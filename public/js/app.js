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
		angular.module('app.controllers', ['dndLists','angular.filter','angularMoment','ngScrollbar','mdColorPicker','ngAnimate','ui.tree','toastr','ui.router', 'md.data.table', 'ngMaterial', 'ngStorage', 'restangular', 'ngMdIcons', 'angular-loading-bar', 'ngMessages', 'ngSanitize', "leaflet-directive",'nvd3']);
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

		$urlRouterProvider.otherwise('/conflict/index');

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
				resolve:{
					indices: ["ContentService", function(ContentService){
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
					styles: ["ContentService", function(ContentService){
						return ContentService.getStyles();
					}],
					categories: ["ContentService", function(ContentService){
						return ContentService.getCategories({indicators:true, tree:true});
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
				url:'/details',
				layout:'row',
				resolve: {
					data: ["ContentService", "$stateParams", function(ContentService, $stateParams) {
						return ContentService.getIndicatorData($stateParams.id, $stateParams.year);
					}]
				},
				views:{
					'main@':{
						templateUrl: '/views/app/indicator/indicatorYearTable.html',
						controller:'IndicatorYearTableCtrl',
						controllerAs:'vm',
					}
				}
			})
			.state('app.index.show', {
				url: '/:index',
				views: {
					'sidebar@': {
						templateUrl: '/views/app/index/info.html',
						controller: 'IndexCtrl',
						controllerAs: 'vm',
						resolve: {
							data: ["IndizesService", "$stateParams", function(IndizesService, $stateParams) {
								return IndizesService.fetchData($stateParams.index);
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
			.state('app.conflict.index',{
				url: '/index',
				resolve:{
					conflicts:["Restangular", function(Restangular){
						return Restangular.all('conflicts/nations').getList();
					}]
				},
				views:{
					'sidebar@':{
						controller:'ConflictsCtrl',
						controllerAs: 'vm',
						templateUrl:getView('conflicts')
					},
					'items-menu@':{
						templateUrl:getView('conflictitems'),
						controller:'ConflictitemsCtrl',
						controllerAs: 'vm'
					}
				}
			})
			.state('app.conflict.index.nation',{
				url: '/nation/:iso',
				resolve:{
					nation:["Restangular", "$stateParams", function(Restangular, $stateParams){
						return 	Restangular.one('/conflicts/nations/', $stateParams.iso).get();
					}]
				},
				views:{
					'sidebar@':{
						controller:'ConflictnationCtrl',
						controllerAs: 'vm',
						templateUrl:getView('conflictnation')
					}
				}
			})
			.state('app.conflict.index.details',{
				url: '/:id',
				resolve:{
					conflict:["Restangular", "$stateParams", function(Restangular, $stateParams){
						return 	Restangular.one('/conflicts/events/', $stateParams.id).get();
					}]
				},
				views:{
					'sidebar@':{
						controller:'ConflictdetailsCtrl',
						controllerAs: 'vm',
						templateUrl:getView('conflictdetails')
					},
					'items-menu@':{}
				}
			})
			.state('app.conflict.import',{
				url: '/import',
				auth:true,
				views: {
					'sidebar@': {
						controller: 'ConflictImportCtrl',
						controllerAs: 'vm',
						templateUrl: getView('conflictimport')
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

(function(){
	"use strict";

	angular.module('app.routes').run(["$rootScope", "$mdSidenav", "$timeout", "$auth", "$state", "$localStorage", "$window", "leafletData", "toastr", function($rootScope, $mdSidenav, $timeout, $auth, $state,$localStorage,$window, leafletData, toastr){
		$rootScope.sidebarOpen = true;
		$rootScope.looseLayout = $localStorage.fullView || false;
		$rootScope.goBack = function(){
		 $window.history.back();
	 }
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
			if(typeof toState.views != "undefined"){
				if(toState.views.hasOwnProperty('additional@')){
					$rootScope.additional = true;
				}
				else{
					$rootScope.additional = false;
				}
				if(toState.views.hasOwnProperty('items-menu@')){
					$rootScope.itemMenu = true;
				}
				else{
					$rootScope.itemMenu = false;
				}
			}
			else{
				$rootScope.additional = false;
				$rootScope.itemMenu = false;
			}
			if(toState.name.indexOf('conflict') > -1 && toState.name != "app.conflict.import"){
				$rootScope.noHeader = true;
			}
			else{
				$rootScope.noHeader = false;
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

(function (){
	"use strict";

	angular.module('app.config').config(["cfpLoadingBarProvider", function (cfpLoadingBarProvider){
		cfpLoadingBarProvider.includeSpinner = false;
	}]);

})();

(function(){
	"use strict";

	angular.module('app.config').config( ["RestangularProvider", function(RestangularProvider) {
		RestangularProvider
		.setBaseUrl('/api/')
		.setDefaultHeaders({ accept: "application/x.laravel.v1+json" })
		.addResponseInterceptor(function(data,operation,what,url,response,deferred) {
        var extractedData;
        extractedData = data.data;
        if (data.meta) {
            extractedData._meta = data.meta;
        }
        if (data.included) {
            extractedData._included = data.included;
        }
        return extractedData;
    })
		.setErrorInterceptor(function(response, deferred, responseHandler) {
			console.log('errro');
			if (response.status === 403) {

    		return false; // error handled
    	}

    	return true; // error not handled
    	});
	}]);

})();

(function(){
	"use strict";

	angular.module('app.config').config(["$mdThemingProvider", function($mdThemingProvider) {
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
	}]);

})();

(function(){
    "use strict";

    angular.module('app.config').config(["toastrConfig", function(toastrConfig){
        //
        angular.extend(toastrConfig, {
          autoDismiss: false,
          containerId: 'toast-container',
          maxOpened: 0,
          newestOnTop: true,
          positionClass: 'toast-bottom-right',
          preventDuplicates: false,
          preventOpenDuplicates: false,
          target: 'body',
          closeButton: true
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
			fetchCategories: function(filter) {
				return this.content.categories = DataService.getAll('categories', filter).$object;
			},
			fetchStyles: function(filter) {
				return this.content.styles = DataService.getAll('styles', filter).$object;
			},
			getIndices: function(filter){
				return this.fetchIndices(filter);
				if (this.content.indices.length == 0) {

				}
				return this.content.indices;
			},
			getCategories: function(filter) {
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
					return this.content.data = DataService.getOne('index/' + id)
				//}
			},
			removeItem: function(id){
				return DataService.remove('index/', id);
			},
			getCategory: function(id) {
				if (this.content.categories.length) {
					for (var i = 0; i < this.content.categories.length; i++) {
						if (this.content.categories[i].id == id) {
							return this.content.categories[i];
						}
					}
				} else {
					return this.content.category = DataService.getOne('categories/' + id).$object;
				}
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
				angular.forEach(this.data.layer.layers[this.data.name+'_geom'].features, function(feature, key){
					if(key != iso)
					feature.selected = false;
				});
				this.redraw();
			},
			setSelectedFeature:function(iso, selected){
				this.data.layer.layers[this.data.name+'_geom'].features[iso].selected = selected;
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

(function(){
    "use strict";

    angular.module('app.controllers').controller('ConflictdetailsCtrl', ["$timeout", "$rootScope", "VectorlayerService", "conflict", function($timeout, $rootScope, VectorlayerService, conflict){
        //
        var vm = this;
        vm.conflict = conflict;
        vm.showCountries = false;
        vm.getTendency = getTendency;
        vm.linearScale = d3.scale.linear().domain([0, 5]).range([0, 256]);
        vm.colors = ['#d4ebf7', '#87cceb', '#36a8c6', '#268399', '#0e6377'];
        vm.relations = [];
        vm.countries = [];
        vm.showCountriesButton = showCountriesButton;
        vm.circleOptions = {
          color: '#4fb0e5',
          field: 'int2015',
          size: 5,
          hideNumbering: true
        };

        activate();

    		function activate() {
    			VectorlayerService.setData(vm.conflict.nations, vm.colors, true);
    			VectorlayerService.setStyle(invertedStyle);
    			VectorlayerService.countryClick(countryClick);
    			$timeout(function () {
            //VectorlayerService.setSelectedFeature(vm.nation.iso, true);

    					angular.forEach(vm.conflict.nations, function (nation) {
    						var i = vm.relations.indexOf(nation.iso);
    						if (i == -1 ) {
    							vm.relations.push(nation.iso)
                  vm.countries.push(nation);
    							VectorlayerService.setSelectedFeature(nation.iso, true);
    						}
    					});

            console.log(vm.countries);
    				$rootScope.greyed = true;
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
    				VectorlayerService.resetSelected(country.iso);
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

    			var color = 'rgba(' + VectorlayerService.palette[colorPos] + ', ' + VectorlayerService.palette[colorPos + 1] + ', ' + VectorlayerService.palette[colorPos + 2] + ',' + VectorlayerService.palette[colorPos + 3] + ')';
    			style.color = 'rgba(0,0,0,0)';
    			style.outline = {
    				color: 'rgba(0,0,0,0)',
    				size: 0
    			};
    			style.selected = {
    				color: color,
    				outline: {
    					color: 'rgba(0,0,0,0.3)',
    					size: 1
    				}
    			};
    			return style;
    		}
        function getTendency(){
          if(vm.conflict == null) return "cached";
          if(vm.conflict.int2015 == vm.conflict.int2014)
          return "cached";
          if(vm.conflict.int2015 < vm.conflict.int2014)
          return "arrow_drop_down";

          return "arrow_drop_up";
        }
        function showCountriesButton(){
          if(vm.showCountries) return "arrow_drop_up";
          return "arrow_drop_down";
        }
    }]);

})();

(function(){
    "use strict";

    angular.module('app.controllers').controller('ConflictitemsCtrl', function(){
        //
    });

})();

(function () {
	"use strict";

	angular.module('app.controllers').controller('ConflictnationCtrl', ["$timeout", "$state", "$rootScope", "conflicts", "nation", "VectorlayerService", "DataService", function ($timeout, $state, $rootScope, conflicts, nation, VectorlayerService, DataService) {
		//
		var vm = this;
		vm.nation = nation;
		vm.conflicts = conflicts;
		vm.linearScale = d3.scale.linear().domain([0, 5]).range([0, 256]);
		vm.colors = ['#d4ebf7', '#87cceb', '#36a8c6', '#268399', '#0e6377'];
		vm.relations = [];
    vm.conflict = null;
    vm.getTendency = getTendency;
    vm.circleOptions = {
      color: '#4fb0e5',
      field: 'intensity',
      size: 5,
      hideNumbering: true
    };
		activate();

		function activate() {
			VectorlayerService.setData(vm.conflicts, vm.colors, true);
			VectorlayerService.setStyle(invertedStyle);
			VectorlayerService.countryClick(countryClick);
			$timeout(function () {
        vm.relations.push(vm.nation.iso);
        VectorlayerService.setSelectedFeature(vm.nation.iso, true);
				angular.forEach(vm.nation.conflicts, function (conflict) {
          if(!vm.conflict) vm.conflict = conflict;
          if(conflict.int2015 > vm.conflict.int2015){
            vm.conflict = conflict;
          }
					angular.forEach(conflict.nations, function (nation) {
						var i = vm.relations.indexOf(nation.iso);
						if (i == -1 && nation.iso != vm.nation.iso) {
							vm.relations.push(nation.iso)
							VectorlayerService.setSelectedFeature(nation.iso, true);
						}
					});
				});
				$rootScope.greyed = true;
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
    function getTendency(){
      if(vm.conflict == null) return "cached";
      if(vm.conflict.int2015 == vm.conflict.int2014)
      return "cached";
      if(vm.conflict.int2015 < vm.conflict.int2014)
      return "arrow_drop_down";

      return "arrow_drop_up";
    }
		function countryClick(evt, t) {

			var country = VectorlayerService.getNationByIso(evt.feature.properties['iso_a2']);
			if (typeof country['intensity'] != "undefined") {
				VectorlayerService.resetSelected(country.iso);
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

			var color = 'rgba(' + VectorlayerService.palette[colorPos] + ', ' + VectorlayerService.palette[colorPos + 1] + ', ' + VectorlayerService.palette[colorPos + 2] + ',' + VectorlayerService.palette[colorPos + 3] + ')';
			style.color = 'rgba(0,0,0,0)';
			style.outline = {
				color: 'rgba(0,0,0,0)',
				size: 0
			};
			style.selected = {
				color: color,
				outline: {
					color: 'rgba(0,0,0,0.3)',
					size: 1
				}
			};
			return style;
		}
	}]);

})();

(function () {
	"use strict";

	angular.module('app.controllers').controller('ConflictsCtrl', ["$timeout", "$state", "$rootScope", "$scope", "conflicts", "VectorlayerService", "Restangular", function ($timeout,$state, $rootScope, $scope, conflicts, VectorlayerService, Restangular) {
		//

		var vm = this;
		vm.ready = false;
		vm.conflicts = conflicts;
		vm.relations = [];
		vm.linearScale = d3.scale.linear().domain([0, 5]).range([0, 256]);
		vm.colors = ['#d4ebf7', '#87cceb', '#36a8c6', '#268399', '#0e6377'];
		vm.typesColors = {
			interstate: '#69d4c3',
			intrastate: '#b7b7b7',
			substate: '#ff9d27'
		};
		vm.active = {
			conflict: '',
			tpye: ''
		};
		vm.conflictCount = 0;
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
			color: '#69d4c3',
			count: 0
		}, {
			type: 'intrastate',
			count: 0,
			color: '#b7b7b7'
		}, {
			type: 'substate',
			count: 0,
			color: '#ff9d27'
		}];

		activate();

		function activate() {
			VectorlayerService.setStyle(countriesStyle);
			VectorlayerService.countryClick(countryClick);
			VectorlayerService.setData(vm.conflicts, vm.colors, true);
			//	$timeout(function() {
			calcIntensities();
			//});
		}

		function calcIntensities() {
			angular.forEach(vm.conflicts, function (nation) {

				angular.forEach(nation.conflicts, function (conflict) {
					vm.conflictCount++;
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
				})
			});
			vm.ready = true;
		}

		function countryClick(evt, t) {

			var country = VectorlayerService.getNationByIso(evt.feature.properties['iso_a2']);
			if (typeof country['intensity'] != "undefined") {
				VectorlayerService.resetSelected(country.iso);
				$state.go('app.conflict.index.nation',{iso:country.iso});
			}
		}
		function invertedStyle(feature){
			var style = {};
			var iso = feature.properties[VectorlayerService.data.iso2];
			var nation = VectorlayerService.getNationByIso(iso);
			var field = 'intensity';
			var colorPos = parseInt(vm.linearScale(parseFloat(nation[field]))) * 4; // parseInt(256 / vm.range.max * parseInt(nation[field])) * 4;

			var color = 'rgba(' + VectorlayerService.palette[colorPos] + ', ' + VectorlayerService.palette[colorPos + 1] + ', ' + VectorlayerService.palette[colorPos + 2] + ',' + VectorlayerService.palette[colorPos + 3] + ')';
			style.color = 'rgba(0,0,0,0)';
			style.outline = {
				color: 'rgba(0,0,0,0)',
				size: 0
			};
			style.selected = {
				color: color,
				outline: {
					color: 'rgba(0,0,0,0.3)',
					size: 1
				}
			};
			return style;
		}
		function countriesStyle(feature) {
			var style = {};
			var iso = feature.properties[VectorlayerService.data.iso2];
			var nation = VectorlayerService.getNationByIso(iso);

			var field = 'intensity';
			var type = feature.type;
			feature.selected = false;

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
			return style;
		};
	}]);

})();

(function() {
	"use strict";

	angular.module('app.controllers').controller('FullListCtrl', ["indicators", "indices", function(indicators, indices) {
		//
		var vm = this;
		vm.indicators = indicators;
		vm.indices = indices;
	}]);
})();
(function(){
	"use strict";

	angular.module('app.controllers').controller('HeaderCtrl', ["$scope", "leafletData", "$state", "$localStorage", "$rootScope", "$auth", "toastr", "$timeout", function($scope, leafletData, $state,$localStorage, $rootScope, $auth, toastr, $timeout){

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
		})
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

	angular.module('app.controllers').controller('IndexCtrl', ["$scope", "$window", "$rootScope", "$filter", "$state", "$timeout", "toastr", "VectorlayerService", "data", "countries", "leafletData", "DataService", function($scope, $window, $rootScope, $filter, $state, $timeout, toastr, VectorlayerService, data, countries, leafletData, DataService) {
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
			console.log(item);
			$state.go('app.index.show.selected',{
				index:item.name,
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
			DataService.getOne('index/' + $state.params.index, iso).then(function(data) {
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
					index: $state.params.index,
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
						index: $state.params.index,
						item: n.iso
					});
				}
			} else {
				$state.go('app.index.show', {
					index: $state.params.index
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
						index: n.name,
						item: vm.current.iso,
						countries: $state.params.countries
					})
				} else {
					$state.go('app.index.show.selected', {
						index: n.name,
						item: vm.current.iso
					})
				}
			} else {
				$state.go('app.index.show', {
					index: n.name
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

	angular.module('app.controllers').controller('IndexeditorcategoryCtrl', ["category", "DataService", "ContentService", function (category, DataService,ContentService) {
    var vm = this;
    vm.category = category;
  }]);
})();

(function () {
	"use strict";

	angular.module('app.controllers').controller('IndexeditorCtrl', ["$scope", "$filter", "$timeout", "$state", "indicators", "indices", "styles", "categories", "DataService", "ContentService", function ($scope, $filter, $timeout,$state, indicators, indices, styles, categories, DataService,ContentService) {
		//
		var vm = this;


		vm.categories = categories;
		vm.composits = indices;
		vm.styles = styles;
		vm.indicators = indicators;

		vm.selection = {
			indices:[],
			indicators:[],
			styles:[],
			categories:[]
		};
		vm.selectedTab = 0;

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
							removeItem(item,vm.composits);
							vm.selection.indices = [];
						});
					});
				}
			},
			categories:{
				drag:false,
				type:'categories',
				itemClick: function(id, name){
					$state.go('app.index.editor.categories.category', {id:id})
				}
			},
			styles:{
				drag:false,
				type:'styles',
				withColor:true
			}
		};
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
		vm.checkTabContent = checkTabContent;


		function toggleList(key){
			if(vm.visibleList == key){
				vm.visibleList = '';
			}
			else{
				vm.visibleList = key;
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
		/*function selectedItem(item) {
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
		function selectAllGroup(group){
			vm.selection = [];
			angular.forEach(group, function(item){
				vm.selection.push(item);
			});

		}
		function toggleSelection(item) {
			var index = vm.selection.indexOf(item);
			if (index > -1) {
				return vm.selection.splice(index, 1);
			} else {
				return vm.selection.push(item);
			}
		}*/

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
		function openMenu($mdOpenMenu, ev) {
			$mdOpenMenu(ev);
		}

		$scope.$watch('vm.search.query', function (query, oldQuery) {
			if(query === oldQuery) return false;
			vm.query = vm.filter.types;
			vm.query.q = query;
			vm.indicators = ContentService.fetchIndicators(vm.query);
		});
		$scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
			if(toState.name.indexOf('app.index.editor.indicators') != -1){
				vm.selectedTab = 1;
				activate(toParams);
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
		vm.selected = 0;
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
				}
      },
      withSave: true
    }

		active();


		function active(){
			console.log(vm.index);
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

(function () {
	"use strict";

	angular.module('app.controllers').controller('MapCtrl', ["leafletData", "VectorlayerService", function (leafletData, VectorlayerService) {
		//
		var vm = this;
		var apiKey = VectorlayerService.keys.mapbox;

		vm.defaults = {
			//scrollWheelZoom: false,
			minZoom:2
		};
		vm.center = {
			lat: 0,
			lng: 0,
			zoom: 3
		};
		vm.layers = {
			baselayers: {
				xyz: {
					name: 'MapBox Outdoors Mod',
					url: 'https://{s}.tiles.mapbox.com/v4/valderrama.d86114b6/{z}/{x}/{y}.png?access_token=' + apiKey,
					type: 'xyz',
					layerOptions:{
							noWrap: true,
							continuousWorld: false
					}

				}
			}
		};
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
		leafletData.getMap('map').then(function (map) {
			VectorlayerService.setMap(map);
			var url = 'http://v22015052835825358.yourvserver.net:3001/services/postgis/' + VectorlayerService.getName() + '/geom/vector-tiles/{z}/{x}/{y}.pbf?fields=' + VectorlayerService.fields(); //
			var layer = new L.TileLayer.MVTSource({
				url: url,
				debug: false,
				clickableLayers: [VectorlayerService.getName() + '_geom'],
				mutexToggle: true,
				getIDForLayerFeature: function (feature) {
					return feature.properties.iso_a2;
				},
				filter: function (feature, context) {

					return true;
				}
			});
			map.addLayer(VectorlayerService.setLayer(layer));
			var labelsLayer = L.tileLayer('https://{s}.tiles.mapbox.com/v4/magnolo.06029a9c/{z}/{x}/{y}.png?access_token=' + apiKey,{
						noWrap: true,
						continuousWorld: false
			});
			map.addLayer(labelsLayer);
			labelsLayer.bringToFront();
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
		vm.checkBase = checkBase;
		vm.styles = ContentService.getStyles();

		function querySearchCategory(query) {
			return $filter('findbyname')($filter('flatten')(vm.categories), query, 'title');
		}
		function checkBase(){
			if (vm.item.title && vm.item.title.length >= 3) {
				return true;
			}
			return false;
		}
		function saveCategory(valid) {
			if(valid){
				if(vm.item.id){
					vm.item.save().then(function (data) {
						toastr.success('Category has been updated', 'Success');
						$scope.categoryForm.$setSubmitted();
					});
				}
				else{
					DataService.post('categories', vm.item).then(function (data) {
						vm.categories.push(data);
						//vm.item.categories.push(data);
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
			deleteDrop: removeItems
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
						//$state.go('app.index.editor.indizes.data',{id:vm.item.name})
					}
				});
			}
			else{
				DataService.post('index', vm.item).then(function(response){
					if(response){
						toastr.success('Data successfully saved!', 'Successfully saved');
						vm.item.isDirty = false;
						vm.original = angular.copy(vm.item);
						$state.go('app.index.editor.indizes.data',{id:response.name})
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
						console.log(ngModel.$modelValue);
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
								scope.events.push(row.data[0]);
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
				activeConflict: '='
			},
			link: function( scope, element, attrs ){
				//
				 function segColor(c){ return {interstate:"#807dba", intrastate:"#e08214",substate:"#41ab5d"}[c]; }
				var pD = scope.data;
				console.log(pD);
				var pC ={},    pieDim ={w:150, h: 150};
        pieDim.r = Math.min(pieDim.w, pieDim.h) / 2;

				var piesvg = d3.select(element[0]).append("svg")
            .attr("width", pieDim.w).attr("height", pieDim.h)
						.attr('class', 'outer-pie').append("g")
            .attr("transform", "translate("+pieDim.w/2+","+pieDim.h/2+")");
				var piesvg2 = d3.select(element[0]).append("svg")
            .attr("width", pieDim.w).attr("height", pieDim.h)
						.attr('class', 'inner-pie')
						.append("g")
            .attr("transform", "translate("+pieDim.w/2+","+pieDim.h/2+")");

        // create function to draw the arcs of the pie slices.
        var arc = d3.svg.arc().outerRadius(pieDim.r - 10).innerRadius(pieDim.r - 23);
        var arc2 = d3.svg.arc().outerRadius(pieDim.r - 23).innerRadius(0);

        // create a function to compute the pie slice angles.
        var pie = d3.layout.pie().sort(null).value(function(d) { return d.count; });
        var pie2 = d3.layout.pie().sort(null).value(function(d) { return d.count; });

        // Draw the pie slices.
        piesvg.selectAll("path").data(pie(pD)).enter().append("path").attr("d", arc)
            .each(function(d) { this._current = d; })
            .style("fill", function(d) { return d.data.color; })
            .on("mouseover",mouseover).on("mouseout",mouseout);
				piesvg2.selectAll("path").data(pie(pD)).enter().append("path").attr("d", arc2)
		            .each(function(d) { this._current = d; })
		            .style("fill", function(d) { return d.data.color; })
		            .on("mouseover",mouseover).on("mouseout",mouseout);
        // create function to update pie-chart. This will be used by histogram.
        pC.update = function(nD){
            piesvg.selectAll("path").data(pie(nD)).transition().duration(500)
                .attrTween("d", arcTween);
        }
        // Utility function to be called on mouseover a pie slice.
        function mouseover(d){
            // call the update function of histogram with new data.
            scope.activeType = d.data.type;
						scope.$apply();
        }
        //Utility function to be called on mouseout a pie slice.
        function mouseout(d){
            // call the update function of histogram with all data.
            scope.activeType = "";
						scope.$apply();
        }
        // Animating the pie-slice requiring a custom function which specifies
        // how the intermediate paths should be drawn.
        function arcTween(a) {
            var i = d3.interpolate(this._current, a);
            this._current = i(0);
            return function(t) { return arc(i(t));    };
        }
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
			scope:{},
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

	angular.module('app.directives').animation('.slide-toggle', ['$animateCss', function($animateCss) {

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
		console.log(this);
	})
})();

(function(){
	"use strict";

	angular.module('app.directives').directive( 'treeview', ["RecursionHelper", function(RecursionHelper) {
		var options = {
			editWeight:false,
			drag: false,
			edit: false
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
				options:'=',
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
		//vm.childSelected = childSelected;
		vm.toggleSelection = toggleSelection;
		vm.onDragOver = onDragOver;
		vm.onDropComplete = onDropComplete;
		vm.onMovedComplete = onMovedComplete;
		vm.addChildren = addChildren;

		activate();

		function activate(){
			console.log(vm.selection);
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
			var i = vm.selection.indexOf(item);
			if(i > -1){
				vm.selection.splice(i, 1);
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
			if(vm.selection.indexOf(item) > -1){
				return true;
			}
			return false;
		}

		/*function childSelected(children) {
			var found = false;
			angular.forEach($filter('flatten')(children), function(child) {
				if (selectedItem(child)) {
					found = true;
				}
			});
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiLCJyb3V0ZXMuanMiLCJyb3V0ZXMucnVuLmpzIiwiY29uZmlnL2F1dGguanMiLCJjb25maWcvbG9hZGluZ19iYXIuanMiLCJjb25maWcvcmVzdGFuZ3VsYXIuanMiLCJjb25maWcvdGhlbWUuanMiLCJjb25maWcvdG9hc3RyLmpzIiwiZmlsdGVycy9hbHBoYW51bS5qcyIsImZpbHRlcnMvY2FwaXRhbGl6ZS5qcyIsImZpbHRlcnMvZmluZGJ5bmFtZS5qcyIsImZpbHRlcnMvaHVtYW5fcmVhZGFibGUuanMiLCJmaWx0ZXJzL29yZGVyT2JqZWN0QnkuanMiLCJmaWx0ZXJzL3Byb3BlcnR5LmpzIiwiZmlsdGVycy90cnVuY2F0ZV9jaGFyYWN0ZXJzLmpzIiwiZmlsdGVycy90cnVuY2F0ZV93b3Jkcy5qcyIsImZpbHRlcnMvdHJ1c3RfaHRtbC5qcyIsImZpbHRlcnMvdWNmaXJzdC5qcyIsInNlcnZpY2VzL2NvbnRlbnQuanMiLCJzZXJ2aWNlcy9jb3VudHJpZXMuanMiLCJzZXJ2aWNlcy9kYXRhLmpzIiwic2VydmljZXMvZGlhbG9nLmpzIiwic2VydmljZXMvZXJyb3JDaGVja2VyLmpzIiwic2VydmljZXMvaWNvbnMuanMiLCJzZXJ2aWNlcy9pbmRleC5qcyIsInNlcnZpY2VzL2luZGl6ZXMuanMiLCJzZXJ2aWNlcy9yZWN1cnNpb25oZWxwZXIuanMiLCJzZXJ2aWNlcy90b2FzdC5qcyIsInNlcnZpY2VzL3VzZXIuanMiLCJzZXJ2aWNlcy92ZWN0b3JsYXllci5qcyIsImFwcC9jb25mbGljdEltcG9ydC9jb25mbGljdEltcG9ydC5qcyIsImFwcC9jb25mbGljdGRldGFpbHMvY29uZmxpY3RkZXRhaWxzLmpzIiwiYXBwL2NvbmZsaWN0aXRlbXMvY29uZmxpY3RpdGVtcy5qcyIsImFwcC9jb25mbGljdG5hdGlvbi9jb25mbGljdG5hdGlvbi5qcyIsImFwcC9jb25mbGljdHMvY29uZmxpY3RzLmpzIiwiYXBwL2Z1bGxMaXN0L2Z1bGxMaXN0LmpzIiwiYXBwL2hlYWRlci9oZWFkZXIuanMiLCJhcHAvaG9tZS9ob21lLmpzIiwiYXBwL2ltcG9ydGNzdi9pbXBvcnRjc3YuanMiLCJhcHAvaW5kZXgvaW5kZXguanMiLCJhcHAvaW5kZXgvaW5kZXhiYXNlLmpzIiwiYXBwL2luZGV4Q2hlY2svaW5kZXhDaGVjay5qcyIsImFwcC9pbmRleENoZWNrL2luZGV4Q2hlY2tTaWRlYmFyLmpzIiwiYXBwL2luZGV4RmluYWwvaW5kZXhGaW5hbC5qcyIsImFwcC9pbmRleEZpbmFsL2luZGV4RmluYWxNZW51LmpzIiwiYXBwL2luZGV4TWV0YS9pbmRleE1ldGEuanMiLCJhcHAvaW5kZXhNZXRhL2luZGV4TWV0YU1lbnUuanMiLCJhcHAvaW5kZXhjcmVhdG9yL2luZGV4Y3JlYXRvci5qcyIsImFwcC9pbmRleE15RGF0YS9pbmRleE15RGF0YS5qcyIsImFwcC9pbmRleE15RGF0YS9pbmRleE15RGF0YUVudHJ5LmpzIiwiYXBwL2luZGV4TXlEYXRhL2luZGV4TXlEYXRhTWVudS5qcyIsImFwcC9pbmRleGVkaXRvci9jYXRlZ29yeS5qcyIsImFwcC9pbmRleGVkaXRvci9pbmRleGVkaXRvci5qcyIsImFwcC9pbmRleGVkaXRvci9pbmRpY2F0b3IuanMiLCJhcHAvaW5kZXhlZGl0b3IvaW5kaWNhdG9ycy5qcyIsImFwcC9pbmRleGVkaXRvci9pbmRpemVzLmpzIiwiYXBwL2luZGV4aW5mby9pbmRleGluZm8uanMiLCJhcHAvaW5kaWNhdG9yL2luZGljYXRvci5qcyIsImFwcC9pbmRpY2F0b3IvaW5kaWNhdG9yWWVhclRhYmxlLmpzIiwiYXBwL2xvZ2luL2xvZ2luLmpzIiwiYXBwL21hcC9tYXAuanMiLCJhcHAvc2VsZWN0ZWQvc2VsZWN0ZWQuanMiLCJhcHAvc2lkZWJhci9zaWRlYmFyLmpzIiwiYXBwL3NpZ251cC9zaWdudXAuanMiLCJhcHAvdG9hc3RzL3RvYXN0cy5qcyIsImFwcC91bnN1cHBvcnRlZF9icm93c2VyL3Vuc3VwcG9ydGVkX2Jyb3dzZXIuanMiLCJhcHAvdXNlci91c2VyLmpzIiwiZGlhbG9ncy9hZGRQcm92aWRlci9hZGRQcm92aWRlci5qcyIsImRpYWxvZ3MvYWRkVW5pdC9hZGRVbml0LmpzIiwiZGlhbG9ncy9hZGRZZWFyL2FkZFllYXIuanMiLCJkaWFsb2dzL2FkZF91c2Vycy9hZGRfdXNlcnMuanMiLCJkaWFsb2dzL2NvcHlwcm92aWRlci9jb3B5cHJvdmlkZXIuanMiLCJkaWFsb2dzL2VkaXRjb2x1bW4vZWRpdGNvbHVtbi5qcyIsImRpYWxvZ3MvZWRpdHJvdy9lZGl0cm93LmpzIiwiZGlhbG9ncy9leHRlbmREYXRhL2V4dGVuZERhdGEuanMiLCJkaWFsb2dzL2xvb3NlZGF0YS9sb29zZWRhdGEuanMiLCJkaWFsb2dzL3NlbGVjdGlzb2ZldGNoZXJzL3NlbGVjdGlzb2ZldGNoZXJzLmpzIiwiZGlyZWN0aXZlcy9hdXRvRm9jdXMvZGVmaW5pdGlvbi5qcyIsImRpcmVjdGl2ZXMvYmFycy9iYXJzLmpzIiwiZGlyZWN0aXZlcy9iYXJzL2RlZmluaXRpb24uanMiLCJkaXJlY3RpdmVzL2J1YmJsZXMvYnViYmxlcy5qcyIsImRpcmVjdGl2ZXMvYnViYmxlcy9kZWZpbml0aW9uLmpzIiwiZGlyZWN0aXZlcy9jYXRlZ29yaWVzL2NhdGVnb3JpZXMuanMiLCJkaXJlY3RpdmVzL2NhdGVnb3JpZXMvZGVmaW5pdGlvbi5qcyIsImRpcmVjdGl2ZXMvY2F0ZWdvcnkvY2F0ZWdvcnkuanMiLCJkaXJlY3RpdmVzL2NhdGVnb3J5L2RlZmluaXRpb24uanMiLCJkaXJlY3RpdmVzL2NpcmNsZWdyYXBoL2NpcmNsZWdyYXBoLmpzIiwiZGlyZWN0aXZlcy9jaXJjbGVncmFwaC9kZWZpbml0aW9uLmpzIiwiZGlyZWN0aXZlcy9jb21wb3NpdHMvY29tcG9zaXRzLmpzIiwiZGlyZWN0aXZlcy9jb21wb3NpdHMvZGVmaW5pdGlvbi5qcyIsImRpcmVjdGl2ZXMvY29udGVudGVkaXRhYmxlL2NvbnRlbnRlZGl0YWJsZS5qcyIsImRpcmVjdGl2ZXMvY29udGVudGVkaXRhYmxlL2RlZmluaXRpb24uanMiLCJkaXJlY3RpdmVzL2ZpbGVEcm9wem9uZS9kZWZpbml0aW9uLmpzIiwiZGlyZWN0aXZlcy9maWxlRHJvcHpvbmUvZmlsZURyb3B6b25lLmpzIiwiZGlyZWN0aXZlcy9oaXN0b3J5L2RlZmluaXRpb24uanMiLCJkaXJlY3RpdmVzL2hpc3RvcnkvaGlzdG9yeS5qcyIsImRpcmVjdGl2ZXMvaW5kaWNhdG9yL2RlZmluaXRpb24uanMiLCJkaXJlY3RpdmVzL2luZGljYXRvci9pbmRpY2F0b3IuanMiLCJkaXJlY3RpdmVzL2luZGljYXRvck1lbnUvZGVmaW5pdGlvbi5qcyIsImRpcmVjdGl2ZXMvaW5kaWNhdG9yTWVudS9pbmRpY2F0b3JNZW51LmpzIiwiZGlyZWN0aXZlcy9pbmRpemVzL2RlZmluaXRpb24uanMiLCJkaXJlY3RpdmVzL2luZGl6ZXMvaW5kaXplcy5qcyIsImRpcmVjdGl2ZXMvbWVkaWFuL2RlZmluaXRpb24uanMiLCJkaXJlY3RpdmVzL21lZGlhbi9tZWRpYW4uanMiLCJkaXJlY3RpdmVzL3BhcnNlQ29uZmxpY3RDc3YvZGVmaW5pdGlvbi5qcyIsImRpcmVjdGl2ZXMvcGFyc2VDb25mbGljdENzdi9wYXJzZUNvbmZsaWN0Q3N2LmpzIiwiZGlyZWN0aXZlcy9wYXJzZUNvbmZsaWN0RXZlbnRzQ3N2L2RlZmluaXRpb24uanMiLCJkaXJlY3RpdmVzL3BhcnNlQ29uZmxpY3RFdmVudHNDc3YvcGFyc2VDb25mbGljdEV2ZW50c0Nzdi5qcyIsImRpcmVjdGl2ZXMvcGFyc2Vjc3YvZGVmaW5pdGlvbi5qcyIsImRpcmVjdGl2ZXMvcGFyc2Vjc3YvcGFyc2Vjc3YuanMiLCJkaXJlY3RpdmVzL3BpZWNoYXJ0L2RlZmluaXRpb24uanMiLCJkaXJlY3RpdmVzL3BpZWNoYXJ0L3BpZWNoYXJ0LmpzIiwiZGlyZWN0aXZlcy9yb3VuZGJhci9kZWZpbml0aW9uLmpzIiwiZGlyZWN0aXZlcy9yb3VuZGJhci9yb3VuZGJhci5qcyIsImRpcmVjdGl2ZXMvc2ltcGxlbGluZWNoYXJ0L2RlZmluaXRpb24uanMiLCJkaXJlY3RpdmVzL3NpbXBsZWxpbmVjaGFydC9zaW1wbGVsaW5lY2hhcnQuanMiLCJkaXJlY3RpdmVzL3NsaWRlVG9nZ2xlL2RlZmluaXRpb24uanMiLCJkaXJlY3RpdmVzL3NsaWRlVG9nZ2xlL3NsaWRlVG9nZ2xlLmpzIiwiZGlyZWN0aXZlcy9zdHlsZXMvZGVmaW5pdGlvbi5qcyIsImRpcmVjdGl2ZXMvc3R5bGVzL3N0eWxlcy5qcyIsImRpcmVjdGl2ZXMvc3ViaW5kZXgvZGVmaW5pdGlvbi5qcyIsImRpcmVjdGl2ZXMvc3ViaW5kZXgvc3ViaW5kZXguanMiLCJkaXJlY3RpdmVzL3N1bmJ1cnN0L2RlZmluaXRpb24uanMiLCJkaXJlY3RpdmVzL3N1bmJ1cnN0L3N1bmJ1cnN0LmpzIiwiZGlyZWN0aXZlcy90cmVlbWVudS9kZWZpbml0aW9uLmpzIiwiZGlyZWN0aXZlcy90cmVlbWVudS90cmVlbWVudS5qcyIsImRpcmVjdGl2ZXMvdHJlZXZpZXcvZGVmaW5pdGlvbi5qcyIsImRpcmVjdGl2ZXMvdHJlZXZpZXcvdHJlZXZpZXcuanMiLCJkaXJlY3RpdmVzL3dlaWdodC9kZWZpbml0aW9uLmpzIiwiZGlyZWN0aXZlcy93ZWlnaHQvd2VpZ2h0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLENBQUEsVUFBQTtDQUNBOztDQUVBLElBQUEsTUFBQSxRQUFBLE9BQUE7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7OztFQUlBLFFBQUEsT0FBQSxjQUFBLENBQUEsYUFBQSxhQUFBO0VBQ0EsUUFBQSxPQUFBLG1CQUFBLENBQUEsV0FBQSxpQkFBQSxnQkFBQSxjQUFBLGdCQUFBLFlBQUEsVUFBQSxTQUFBLGFBQUEsaUJBQUEsY0FBQSxhQUFBLGVBQUEsYUFBQSx1QkFBQSxjQUFBLGNBQUEsb0JBQUE7RUFDQSxRQUFBLE9BQUEsZUFBQTtFQUNBLFFBQUEsT0FBQSxnQkFBQSxDQUFBLGdCQUFBLGFBQUEsYUFBQSxlQUFBO0VBQ0EsUUFBQSxPQUFBLGtCQUFBLENBQUEsYUFBQTtFQUNBLFFBQUEsT0FBQSxjQUFBOzs7O0FDbkJBLENBQUEsV0FBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxjQUFBLHFFQUFBLFNBQUEsZ0JBQUEsb0JBQUEsbUJBQUE7O0VBRUEsSUFBQSxVQUFBLFNBQUEsVUFBQTtHQUNBLE9BQUEsZ0JBQUEsV0FBQSxNQUFBLFdBQUE7OztFQUdBLG1CQUFBLFVBQUE7O0VBRUE7SUFDQSxNQUFBLE9BQUE7SUFDQSxVQUFBO0lBQ0EsT0FBQTtLQUNBLFFBQUE7TUFDQSxhQUFBLFFBQUE7TUFDQSxZQUFBO01BQ0EsY0FBQTs7S0FFQSxNQUFBO0tBQ0EsUUFBQTtNQUNBLGFBQUEsUUFBQTtNQUNBLFlBQUE7TUFDQSxjQUFBOzs7O0lBSUEsTUFBQSxZQUFBO0lBQ0EsS0FBQTtJQUNBLE9BQUE7S0FDQSxZQUFBO01BQ0EsYUFBQSxRQUFBO01BQ0EsWUFBQTtNQUNBLGNBQUE7Ozs7SUFJQSxNQUFBLFlBQUE7SUFDQSxLQUFBO0lBQ0EsVUFBQTs7O0lBR0EsTUFBQSxrQkFBQTtJQUNBLEtBQUE7SUFDQSxPQUFBO0tBQ0EsU0FBQTtNQUNBLGFBQUEsUUFBQTtNQUNBLFlBQUE7TUFDQSxjQUFBOzs7Ozs7SUFNQSxNQUFBLG9CQUFBO0lBQ0EsS0FBQTtJQUNBLE1BQUE7SUFDQSxPQUFBO0tBQ0EsU0FBQTtNQUNBLGFBQUEsUUFBQTtNQUNBLFlBQUE7TUFDQSxjQUFBO01BQ0EsU0FBQTtPQUNBLGtDQUFBLFNBQUEsYUFBQSxPQUFBO1FBQ0EsT0FBQSxZQUFBLE9BQUEsTUFBQTs7Ozs7OztJQU9BLE1BQUEsYUFBQTtJQUNBLFVBQUE7SUFDQSxLQUFBO0lBQ0EsU0FBQTtLQUNBLGdDQUFBLFNBQUEsa0JBQUE7TUFDQSxPQUFBLGlCQUFBOzs7OztJQUtBLE1BQUEsb0JBQUE7SUFDQSxLQUFBO0lBQ0EsTUFBQTtJQUNBLE9BQUE7S0FDQSxZQUFBO01BQ0EsYUFBQTtNQUNBLFlBQUE7TUFDQSxjQUFBOztLQUVBLFNBQUE7TUFDQSxhQUFBLFFBQUE7TUFDQSxZQUFBO01BQ0EsY0FBQTs7OztJQUlBLE1BQUEsMEJBQUE7SUFDQSxLQUFBO0lBQ0EsTUFBQTtJQUNBLE9BQUE7S0FDQSxZQUFBO01BQ0EsYUFBQTtNQUNBLFlBQUE7TUFDQSxjQUFBOztLQUVBLFNBQUE7TUFDQSxhQUFBO01BQ0EsWUFBQTtNQUNBLGNBQUE7Ozs7SUFJQSxNQUFBLG9CQUFBO0lBQ0EsS0FBQTtJQUNBLE1BQUE7SUFDQSxRQUFBO0tBQ0EsNEJBQUEsU0FBQSxlQUFBO01BQ0EsT0FBQSxlQUFBOztLQUVBLCtCQUFBLFNBQUEsZ0JBQUE7TUFDQSxPQUFBLGVBQUEsZ0JBQUE7T0FDQSxNQUFBO09BQ0EsT0FBQTtPQUNBLE9BQUE7T0FDQSxLQUFBOzs7S0FHQSwyQkFBQSxTQUFBLGVBQUE7TUFDQSxPQUFBLGVBQUE7O0tBRUEsK0JBQUEsU0FBQSxlQUFBO01BQ0EsT0FBQSxlQUFBLGNBQUEsQ0FBQSxXQUFBLE1BQUEsS0FBQTs7O0lBR0EsT0FBQTtLQUNBLFlBQUE7TUFDQSxhQUFBLFFBQUE7TUFDQSxZQUFBO01BQ0EsY0FBQTs7OztJQUlBLE1BQUEsK0JBQUE7SUFDQSxLQUFBO0lBQ0EsTUFBQTs7SUFFQSxNQUFBLHlDQUFBO0lBQ0EsS0FBQTtJQUNBLE1BQUE7SUFDQSxRQUFBO0lBQ0EsT0FBQTtLQUNBLFNBQUE7TUFDQSxhQUFBO01BQ0EsWUFBQTtNQUNBLGNBQUE7TUFDQSxTQUFBO09BQ0EsOENBQUEsU0FBQSxnQkFBQSxjQUFBO1FBQ0EsT0FBQSxlQUFBLGFBQUEsYUFBQTs7Ozs7Ozs7Ozs7Ozs7OztJQWdCQSxNQUFBLDRCQUFBO0lBQ0EsS0FBQTtJQUNBLE1BQUE7OztJQUdBLE1BQUEsaUNBQUE7SUFDQSxLQUFBO0lBQ0EsTUFBQTtJQUNBLFFBQUE7SUFDQSxTQUFBO0tBQ0EsMENBQUEsU0FBQSxnQkFBQSxjQUFBO01BQ0EsSUFBQSxhQUFBLE1BQUEsR0FBQSxPQUFBO01BQ0EsT0FBQSxlQUFBLFFBQUEsYUFBQTs7O0lBR0EsT0FBQTtLQUNBLFNBQUE7TUFDQSxhQUFBO01BQ0EsWUFBQTtNQUNBLGNBQUE7Ozs7SUFJQSxNQUFBLHFDQUFBO0lBQ0EsS0FBQTtJQUNBLFFBQUE7SUFDQSxPQUFBO0tBQ0EsZUFBQTtNQUNBLGFBQUE7TUFDQSxZQUFBO01BQ0EsY0FBQTtNQUNBLFNBQUE7T0FDQSwrQ0FBQSxTQUFBLGdCQUFBLGNBQUE7UUFDQSxPQUFBLGVBQUEsZ0JBQUE7U0FDQSxNQUFBO1NBQ0EsT0FBQTtTQUNBLE9BQUE7U0FDQSxLQUFBOzs7Ozs7O0lBT0EsTUFBQSxpREFBQTtJQUNBLEtBQUE7SUFDQSxNQUFBO0lBQ0EsUUFBQTs7SUFFQSxNQUFBLCtCQUFBO0lBQ0EsS0FBQTtJQUNBLE1BQUE7O0lBRUEsTUFBQSx3Q0FBQTtJQUNBLEtBQUE7SUFDQSxNQUFBO0lBQ0EsUUFBQTtJQUNBLE9BQUE7S0FDQSxTQUFBO01BQ0EsYUFBQTtNQUNBLFlBQUE7TUFDQSxjQUFBO01BQ0EsU0FBQTtPQUNBLDZDQUFBLFNBQUEsZ0JBQUEsY0FBQTtRQUNBLE9BQUEsZUFBQSxZQUFBLGFBQUE7Ozs7OztJQU1BLE1BQUEsb0JBQUE7SUFDQSxLQUFBO0lBQ0EsTUFBQTtJQUNBLE9BQUE7S0FDQSxZQUFBO01BQ0EsYUFBQSxRQUFBO01BQ0EsWUFBQTtNQUNBLGNBQUE7Ozs7SUFJQSxNQUFBLDBCQUFBO0lBQ0EsS0FBQTtJQUNBLE1BQUE7O0lBRUEsTUFBQSxtQkFBQTtJQUNBLEtBQUE7SUFDQSxNQUFBO0lBQ0EsT0FBQTtLQUNBLFNBQUE7TUFDQSxhQUFBLFFBQUE7TUFDQSxZQUFBO01BQ0EsY0FBQTs7S0FFQSxZQUFBO01BQ0EsYUFBQTtNQUNBLFlBQUE7TUFDQSxjQUFBOzs7O0lBSUEsTUFBQSxrQkFBQTtJQUNBLEtBQUE7SUFDQSxNQUFBO0lBQ0EsUUFBQTtJQUNBLE9BQUE7S0FDQSxTQUFBO01BQ0EsYUFBQSxRQUFBO01BQ0EsWUFBQTtNQUNBLGNBQUE7O0tBRUEsWUFBQTtNQUNBLGFBQUE7TUFDQSxZQUFBO01BQ0EsY0FBQTs7OztJQUlBLE1BQUEsbUJBQUE7SUFDQSxLQUFBO0lBQ0EsTUFBQTtJQUNBLFFBQUE7SUFDQSxPQUFBO0tBQ0EsU0FBQTtNQUNBLGFBQUEsUUFBQTtNQUNBLFlBQUE7TUFDQSxjQUFBOztLQUVBLFlBQUE7TUFDQSxhQUFBO01BQ0EsWUFBQTtNQUNBLGNBQUE7Ozs7SUFJQSxNQUFBLGtCQUFBO0lBQ0EsS0FBQTtJQUNBLE9BQUE7S0FDQSxZQUFBO01BQ0EsYUFBQSxRQUFBO01BQ0EsWUFBQTtNQUNBLGNBQUE7TUFDQSxTQUFBO09BQ0EsK0JBQUEsU0FBQSxnQkFBQTtRQUNBLE9BQUEsZUFBQSxnQkFBQTtTQUNBLE1BQUE7U0FDQSxPQUFBO1NBQ0EsT0FBQTtTQUNBLEtBQUE7OztPQUdBLHlCQUFBLFNBQUEsYUFBQTtRQUNBLE9BQUEsWUFBQSxPQUFBLFNBQUE7Ozs7OztJQU1BLE1BQUEsdUJBQUE7SUFDQSxLQUFBO0lBQ0EsU0FBQTtLQUNBLDhDQUFBLFNBQUEsZ0JBQUEsY0FBQTtNQUNBLE9BQUEsZUFBQSxlQUFBLGFBQUE7OztJQUdBLE9BQUE7S0FDQSxZQUFBO01BQ0EsYUFBQSxRQUFBO01BQ0EsWUFBQTtNQUNBLGNBQUE7Ozs7SUFJQSxNQUFBLDRCQUFBO0lBQ0EsS0FBQTs7SUFFQSxNQUFBLGlDQUFBO0lBQ0EsSUFBQTtJQUNBLE9BQUE7SUFDQSxTQUFBO0tBQ0EseUNBQUEsU0FBQSxnQkFBQSxjQUFBO01BQ0EsT0FBQSxlQUFBLGlCQUFBLGFBQUEsSUFBQSxhQUFBOzs7SUFHQSxNQUFBO0tBQ0EsUUFBQTtNQUNBLGFBQUE7TUFDQSxXQUFBO01BQ0EsYUFBQTs7OztJQUlBLE1BQUEsa0JBQUE7SUFDQSxLQUFBO0lBQ0EsT0FBQTtLQUNBLFlBQUE7TUFDQSxhQUFBO01BQ0EsWUFBQTtNQUNBLGNBQUE7TUFDQSxTQUFBO09BQ0EseUNBQUEsU0FBQSxnQkFBQSxjQUFBO1FBQ0EsT0FBQSxlQUFBLFVBQUEsYUFBQTs7T0FFQSxnQ0FBQSxTQUFBLGtCQUFBO1FBQ0EsT0FBQSxpQkFBQTs7OztLQUlBLFlBQUE7TUFDQSxhQUFBOzs7O0lBSUEsTUFBQSx1QkFBQTtJQUNBLEtBQUE7SUFDQSxPQUFBO0tBQ0EsU0FBQTtNQUNBLFlBQUE7TUFDQSxjQUFBO01BQ0EsYUFBQSxRQUFBOzs7O0lBSUEsTUFBQSwyQkFBQTtJQUNBLEtBQUE7Ozs7Ozs7Ozs7Ozs7O0lBY0EsTUFBQSxtQ0FBQTtJQUNBLEtBQUE7O0lBRUEsTUFBQSxnQkFBQTtJQUNBLFVBQUE7SUFDQSxLQUFBOztJQUVBLE1BQUEscUJBQUE7SUFDQSxLQUFBO0lBQ0EsUUFBQTtLQUNBLDBCQUFBLFNBQUEsWUFBQTtNQUNBLE9BQUEsWUFBQSxJQUFBLHFCQUFBOzs7SUFHQSxNQUFBO0tBQ0EsV0FBQTtNQUNBLFdBQUE7TUFDQSxjQUFBO01BQ0EsWUFBQSxRQUFBOztLQUVBLGNBQUE7TUFDQSxZQUFBLFFBQUE7TUFDQSxXQUFBO01BQ0EsY0FBQTs7OztJQUlBLE1BQUEsNEJBQUE7SUFDQSxLQUFBO0lBQ0EsUUFBQTtLQUNBLHVDQUFBLFNBQUEsYUFBQSxhQUFBO01BQ0EsUUFBQSxZQUFBLElBQUEsdUJBQUEsYUFBQSxLQUFBOzs7SUFHQSxNQUFBO0tBQ0EsV0FBQTtNQUNBLFdBQUE7TUFDQSxjQUFBO01BQ0EsWUFBQSxRQUFBOzs7O0lBSUEsTUFBQSw2QkFBQTtJQUNBLEtBQUE7SUFDQSxRQUFBO0tBQ0EseUNBQUEsU0FBQSxhQUFBLGFBQUE7TUFDQSxRQUFBLFlBQUEsSUFBQSxzQkFBQSxhQUFBLElBQUE7OztJQUdBLE1BQUE7S0FDQSxXQUFBO01BQ0EsV0FBQTtNQUNBLGNBQUE7TUFDQSxZQUFBLFFBQUE7O0tBRUEsY0FBQTs7O0lBR0EsTUFBQSxzQkFBQTtJQUNBLEtBQUE7SUFDQSxLQUFBO0lBQ0EsT0FBQTtLQUNBLFlBQUE7TUFDQSxZQUFBO01BQ0EsY0FBQTtNQUNBLGFBQUEsUUFBQTs7OztJQUlBLE1BQUEsaUJBQUE7SUFDQSxLQUFBO0lBQ0EsTUFBQTtLQUNBLFVBQUE7O0lBRUEsT0FBQTtLQUNBLFNBQUE7TUFDQSxhQUFBLFFBQUE7O0tBRUEsT0FBQTs7Ozs7O0FDM2VBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxjQUFBLHFIQUFBLFNBQUEsWUFBQSxZQUFBLFVBQUEsT0FBQSxPQUFBLGNBQUEsU0FBQSxhQUFBLE9BQUE7RUFDQSxXQUFBLGNBQUE7RUFDQSxXQUFBLGNBQUEsY0FBQSxZQUFBO0VBQ0EsV0FBQSxTQUFBLFVBQUE7R0FDQSxRQUFBLFFBQUE7O0VBRUEsV0FBQSxJQUFBLHFCQUFBLFNBQUEsT0FBQSxTQUFBLFVBQUEsVUFBQSxXQUFBO0dBQ0EsSUFBQSxRQUFBLFFBQUEsQ0FBQSxNQUFBLGtCQUFBO0lBQ0EsT0FBQSxNQUFBLHVDQUFBO01BQ0EsTUFBQTtNQUNBLE9BQUEsT0FBQSxHQUFBOztHQUVBLElBQUEsUUFBQSxRQUFBLFFBQUEsS0FBQSxTQUFBO0lBQ0EsV0FBQSxlQUFBLFFBQUEsS0FBQTs7R0FFQSxHQUFBLFFBQUEsVUFBQSxNQUFBO0lBQ0EsV0FBQSxRQUFBOztPQUVBO0lBQ0EsV0FBQSxRQUFBOztHQUVBLEdBQUEsT0FBQSxRQUFBLFNBQUEsWUFBQTtJQUNBLEdBQUEsUUFBQSxNQUFBLGVBQUEsZUFBQTtLQUNBLFdBQUEsYUFBQTs7UUFFQTtLQUNBLFdBQUEsYUFBQTs7SUFFQSxHQUFBLFFBQUEsTUFBQSxlQUFBLGVBQUE7S0FDQSxXQUFBLFdBQUE7O1FBRUE7S0FDQSxXQUFBLFdBQUE7OztPQUdBO0lBQ0EsV0FBQSxhQUFBO0lBQ0EsV0FBQSxXQUFBOztHQUVBLEdBQUEsUUFBQSxLQUFBLFFBQUEsY0FBQSxDQUFBLEtBQUEsUUFBQSxRQUFBLHNCQUFBO0lBQ0EsV0FBQSxXQUFBOztPQUVBO0lBQ0EsV0FBQSxXQUFBOztHQUVBLFdBQUEsZUFBQSxDQUFBLE1BQUEsV0FBQSxPQUFBO0dBQ0EsV0FBQSxpQkFBQTs7RUFFQSxXQUFBLElBQUEsc0JBQUEsU0FBQSxPQUFBLFFBQUE7Ozs7RUFJQSxXQUFBLElBQUEsdUJBQUEsU0FBQSxPQUFBLFFBQUE7R0FDQSxXQUFBLGlCQUFBO0dBQ0E7OztFQUdBLFNBQUEsY0FBQTtHQUNBLFNBQUEsVUFBQTtJQUNBLFlBQUEsT0FBQSxPQUFBLEtBQUEsVUFBQSxLQUFBO0tBQ0EsSUFBQTs7TUFFQTs7Ozs7QUNqRUEsQ0FBQSxZQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGNBQUEseUJBQUEsVUFBQSxlQUFBOzs7RUFHQSxjQUFBLFdBQUE7SUFDQSxjQUFBLFlBQUE7SUFDQSxjQUFBLFlBQUE7RUFDQSxjQUFBLFNBQUE7R0FDQSxLQUFBO0dBQ0EsVUFBQTs7RUFFQSxjQUFBLE9BQUE7R0FDQSxLQUFBO0dBQ0EsVUFBQTs7Ozs7O0FDZkEsQ0FBQSxXQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGNBQUEsaUNBQUEsVUFBQSxzQkFBQTtFQUNBLHNCQUFBLGlCQUFBOzs7OztBQ0pBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxjQUFBLGdDQUFBLFNBQUEscUJBQUE7RUFDQTtHQUNBLFdBQUE7R0FDQSxrQkFBQSxFQUFBLFFBQUE7R0FDQSx1QkFBQSxTQUFBLEtBQUEsVUFBQSxLQUFBLElBQUEsU0FBQSxVQUFBO1FBQ0EsSUFBQTtRQUNBLGdCQUFBLEtBQUE7UUFDQSxJQUFBLEtBQUEsTUFBQTtZQUNBLGNBQUEsUUFBQSxLQUFBOztRQUVBLElBQUEsS0FBQSxVQUFBO1lBQ0EsY0FBQSxZQUFBLEtBQUE7O1FBRUEsT0FBQTs7R0FFQSxvQkFBQSxTQUFBLFVBQUEsVUFBQSxpQkFBQTtHQUNBLFFBQUEsSUFBQTtHQUNBLElBQUEsU0FBQSxXQUFBLEtBQUE7O01BRUEsT0FBQTs7O0tBR0EsT0FBQTs7Ozs7O0FDekJBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxjQUFBLDhCQUFBLFNBQUEsb0JBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0VBb0JBLElBQUEsVUFBQSxtQkFBQSxjQUFBLFVBQUE7R0FDQSxPQUFBO0dBQ0EsUUFBQTs7R0FFQSxtQkFBQSxjQUFBLFNBQUE7O0VBRUEsbUJBQUEsTUFBQTtHQUNBLGVBQUE7R0FDQSxjQUFBO0dBQ0EsWUFBQTs7Ozs7QUNoQ0EsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLGNBQUEsd0JBQUEsU0FBQSxhQUFBOztRQUVBLFFBQUEsT0FBQSxjQUFBO1VBQ0EsYUFBQTtVQUNBLGFBQUE7VUFDQSxXQUFBO1VBQ0EsYUFBQTtVQUNBLGVBQUE7VUFDQSxtQkFBQTtVQUNBLHVCQUFBO1VBQ0EsUUFBQTtVQUNBLGFBQUE7Ozs7OztBQ2RBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxlQUFBLFFBQUEsWUFBQSxVQUFBO1FBQ0EsT0FBQSxVQUFBLE9BQUE7O1lBRUEsS0FBQSxDQUFBLE9BQUE7Y0FDQSxPQUFBOztZQUVBLE9BQUEsTUFBQSxRQUFBLGVBQUE7Ozs7Ozs7QUNUQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsZUFBQSxRQUFBLGNBQUEsVUFBQTtFQUNBLE9BQUEsU0FBQSxPQUFBLEtBQUE7R0FDQSxPQUFBLENBQUEsQ0FBQSxDQUFBLFNBQUEsTUFBQSxRQUFBLHNCQUFBLFNBQUEsSUFBQTtJQUNBLE9BQUEsSUFBQSxPQUFBLEdBQUEsZ0JBQUEsSUFBQSxPQUFBLEdBQUE7UUFDQTs7Ozs7QUNQQSxDQUFBLFlBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsZUFBQSxPQUFBLGNBQUEsWUFBQTtFQUNBLE9BQUEsVUFBQSxPQUFBLE1BQUEsT0FBQTs7TUFFQSxJQUFBLFNBQUE7R0FDQSxJQUFBLElBQUE7SUFDQSxNQUFBLE1BQUE7O0dBRUEsT0FBQSxJQUFBLEtBQUEsS0FBQTtJQUNBLElBQUEsTUFBQSxHQUFBLE9BQUEsY0FBQSxRQUFBLEtBQUEsaUJBQUEsQ0FBQSxHQUFBO01BQ0EsT0FBQSxLQUFBLE1BQUE7OztHQUdBLE9BQUE7Ozs7OztBQ2ZBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxlQUFBLFFBQUEsaUJBQUEsVUFBQTtFQUNBLE9BQUEsU0FBQSxTQUFBLEtBQUE7R0FDQSxLQUFBLENBQUEsS0FBQTtJQUNBLE9BQUE7O0dBRUEsSUFBQSxRQUFBLElBQUEsTUFBQTtHQUNBLEtBQUEsSUFBQSxFQUFBLEdBQUEsRUFBQSxNQUFBLFFBQUEsS0FBQTtJQUNBLE1BQUEsS0FBQSxNQUFBLEdBQUEsT0FBQSxHQUFBLGdCQUFBLE1BQUEsR0FBQSxNQUFBOztHQUVBLE9BQUEsTUFBQSxLQUFBOzs7O0FDWkEsQ0FBQSxZQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGVBQUEsT0FBQSxpQkFBQSxZQUFBO0VBQ0EsT0FBQSxVQUFBLE9BQUEsV0FBQTtHQUNBLElBQUEsQ0FBQSxRQUFBLFNBQUEsUUFBQSxPQUFBOztHQUVBLElBQUEsUUFBQTtHQUNBLEtBQUEsSUFBQSxhQUFBLE9BQUE7SUFDQSxNQUFBLEtBQUEsTUFBQTs7O0dBR0EsTUFBQSxLQUFBLFVBQUEsR0FBQSxHQUFBO0lBQ0EsSUFBQSxTQUFBLEVBQUE7SUFDQSxJQUFBLFNBQUEsRUFBQTtJQUNBLE9BQUEsSUFBQTs7R0FFQSxPQUFBOzs7Ozs7QUNqQkEsQ0FBQSxZQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGVBQUEsT0FBQSxZQUFBO0NBQ0EsU0FBQSxXQUFBO0VBQ0EsT0FBQSxVQUFBLE9BQUEsWUFBQSxPQUFBOztNQUVBLElBQUEsUUFBQTtNQUNBLElBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxNQUFBLFFBQUEsSUFBQTs7UUFFQSxHQUFBLE1BQUEsR0FBQSxLQUFBLGVBQUEsTUFBQTtVQUNBLE1BQUEsS0FBQSxNQUFBOzs7O0dBSUEsT0FBQTs7Ozs7QUNmQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsZUFBQSxPQUFBLHNCQUFBLFlBQUE7UUFDQSxPQUFBLFVBQUEsT0FBQSxPQUFBLGFBQUE7WUFDQSxJQUFBLE1BQUEsUUFBQTtnQkFDQSxPQUFBOztZQUVBLElBQUEsU0FBQSxHQUFBO2dCQUNBLE9BQUE7O1lBRUEsSUFBQSxTQUFBLE1BQUEsU0FBQSxPQUFBO2dCQUNBLFFBQUEsTUFBQSxVQUFBLEdBQUE7O2dCQUVBLElBQUEsQ0FBQSxhQUFBO29CQUNBLElBQUEsWUFBQSxNQUFBLFlBQUE7O29CQUVBLElBQUEsY0FBQSxDQUFBLEdBQUE7d0JBQ0EsUUFBQSxNQUFBLE9BQUEsR0FBQTs7dUJBRUE7b0JBQ0EsT0FBQSxNQUFBLE9BQUEsTUFBQSxPQUFBLE9BQUEsS0FBQTt3QkFDQSxRQUFBLE1BQUEsT0FBQSxHQUFBLE1BQUEsU0FBQTs7O2dCQUdBLE9BQUEsUUFBQTs7WUFFQSxPQUFBOzs7O0FDM0JBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxlQUFBLE9BQUEsaUJBQUEsWUFBQTtRQUNBLE9BQUEsVUFBQSxPQUFBLE9BQUE7WUFDQSxJQUFBLE1BQUEsUUFBQTtnQkFDQSxPQUFBOztZQUVBLElBQUEsU0FBQSxHQUFBO2dCQUNBLE9BQUE7O1lBRUEsSUFBQSxPQUFBO2dCQUNBLElBQUEsYUFBQSxNQUFBLE1BQUE7Z0JBQ0EsSUFBQSxXQUFBLFNBQUEsT0FBQTtvQkFDQSxRQUFBLFdBQUEsTUFBQSxHQUFBLE9BQUEsS0FBQSxPQUFBOzs7WUFHQSxPQUFBOzs7O0FDakJBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxlQUFBLFFBQUEsc0JBQUEsVUFBQSxNQUFBO0VBQ0EsT0FBQSxVQUFBLE1BQUE7R0FDQSxPQUFBLEtBQUEsWUFBQTs7OztBQ0xBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxlQUFBLE9BQUEsV0FBQSxXQUFBO0VBQ0EsT0FBQSxVQUFBLFFBQUE7R0FDQSxLQUFBLENBQUEsT0FBQTtJQUNBLE9BQUE7O0dBRUEsT0FBQSxNQUFBLFVBQUEsR0FBQSxHQUFBLGdCQUFBLE1BQUEsVUFBQTs7Ozs7O0FDUkEsQ0FBQSxXQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGdCQUFBLFFBQUEsa0NBQUEsU0FBQSxhQUFBOztFQUVBLFNBQUEsY0FBQSxLQUFBLEdBQUE7O0dBRUEsSUFBQSxJQUFBLElBQUEsR0FBQSxJQUFBLEtBQUEsT0FBQSxJQUFBO0lBQ0EsSUFBQSxPQUFBLEtBQUE7SUFDQSxHQUFBLEtBQUEsTUFBQSxHQUFBO0tBQ0EsT0FBQTs7SUFFQSxHQUFBLEtBQUEsU0FBQTtLQUNBLElBQUEsWUFBQSxjQUFBLEtBQUEsVUFBQTtLQUNBLEdBQUEsVUFBQTtNQUNBLE9BQUE7Ozs7O0dBS0EsT0FBQTs7RUFFQSxPQUFBO0dBQ0EsU0FBQTtJQUNBLFlBQUE7SUFDQSxXQUFBO0lBQ0EsTUFBQTtJQUNBLFlBQUE7SUFDQSxVQUFBO0lBQ0EsUUFBQTtJQUNBLGNBQUE7SUFDQSxRQUFBOztHQUVBLGNBQUEsU0FBQSxRQUFBO0lBQ0EsT0FBQSxLQUFBLFFBQUEsVUFBQSxZQUFBLE9BQUEsY0FBQTs7R0FFQSxpQkFBQSxTQUFBLFFBQUE7SUFDQSxPQUFBLEtBQUEsUUFBQSxhQUFBLFlBQUEsT0FBQSxjQUFBLFFBQUE7O0dBRUEsaUJBQUEsU0FBQSxRQUFBO0lBQ0EsT0FBQSxLQUFBLFFBQUEsYUFBQSxZQUFBLE9BQUEsY0FBQSxRQUFBOztHQUVBLGFBQUEsU0FBQSxRQUFBO0lBQ0EsT0FBQSxLQUFBLFFBQUEsU0FBQSxZQUFBLE9BQUEsVUFBQSxRQUFBOztHQUVBLFlBQUEsU0FBQSxPQUFBO0lBQ0EsT0FBQSxLQUFBLGFBQUE7SUFDQSxJQUFBLEtBQUEsUUFBQSxRQUFBLFVBQUEsR0FBQTs7O0lBR0EsT0FBQSxLQUFBLFFBQUE7O0dBRUEsZUFBQSxTQUFBLFFBQUE7SUFDQSxJQUFBLEtBQUEsUUFBQSxXQUFBLFVBQUEsR0FBQTtLQUNBLE9BQUEsS0FBQSxnQkFBQTs7SUFFQSxPQUFBLEtBQUEsUUFBQTs7R0FFQSxlQUFBLFdBQUE7SUFDQSxJQUFBLEtBQUEsUUFBQSxXQUFBLFNBQUEsR0FBQTtLQUNBLE9BQUEsS0FBQSxRQUFBOztJQUVBLE9BQUEsS0FBQTs7O0dBR0EsV0FBQSxTQUFBLFFBQUE7SUFDQSxJQUFBLEtBQUEsUUFBQSxPQUFBLFVBQUEsR0FBQTtLQUNBLE9BQUEsS0FBQSxZQUFBOztJQUVBLE9BQUEsS0FBQSxRQUFBOztHQUVBLGNBQUEsU0FBQSxJQUFBO0lBQ0EsSUFBQSxLQUFBLFFBQUEsV0FBQSxTQUFBLEdBQUE7S0FDQSxLQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsS0FBQSxRQUFBLFdBQUEsUUFBQSxLQUFBO01BQ0EsSUFBQSxLQUFBLFFBQUEsV0FBQSxHQUFBLE1BQUEsSUFBQTtPQUNBLE9BQUEsS0FBQSxRQUFBLFdBQUE7Ozs7SUFJQSxPQUFBLEtBQUEsZUFBQTs7R0FFQSxnQkFBQSxTQUFBLElBQUE7SUFDQSxPQUFBLEtBQUEsUUFBQSxZQUFBLFlBQUEsT0FBQSxnQkFBQSxJQUFBOztHQUVBLHVCQUFBLFNBQUEsSUFBQTtJQUNBLE9BQUEsWUFBQSxPQUFBLGFBQUE7O0dBRUEsa0JBQUEsU0FBQSxJQUFBLE1BQUE7SUFDQSxJQUFBLE1BQUE7S0FDQSxPQUFBLEtBQUEsUUFBQSxPQUFBLFlBQUEsT0FBQSxnQkFBQSxLQUFBLFdBQUE7O0lBRUEsT0FBQSxLQUFBLFFBQUEsT0FBQSxZQUFBLE9BQUEsZ0JBQUEsS0FBQTs7R0FFQSxTQUFBLFNBQUEsSUFBQTs7Ozs7S0FLQSxPQUFBLEtBQUEsUUFBQSxPQUFBLFlBQUEsT0FBQSxXQUFBOzs7R0FHQSxZQUFBLFNBQUEsR0FBQTtJQUNBLE9BQUEsWUFBQSxPQUFBLFVBQUE7O0dBRUEsYUFBQSxTQUFBLElBQUE7SUFDQSxJQUFBLEtBQUEsUUFBQSxXQUFBLFFBQUE7S0FDQSxLQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsS0FBQSxRQUFBLFdBQUEsUUFBQSxLQUFBO01BQ0EsSUFBQSxLQUFBLFFBQUEsV0FBQSxHQUFBLE1BQUEsSUFBQTtPQUNBLE9BQUEsS0FBQSxRQUFBLFdBQUE7OztXQUdBO0tBQ0EsT0FBQSxLQUFBLFFBQUEsV0FBQSxZQUFBLE9BQUEsZ0JBQUEsSUFBQTs7Ozs7Ozs7O0FDaEhBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxnQkFBQSxRQUFBLG9DQUFBLFNBQUEsWUFBQTs7UUFFQSxPQUFBO1VBQ0EsV0FBQTtVQUNBLFdBQUEsVUFBQTtZQUNBLE9BQUEsS0FBQSxZQUFBLFlBQUEsT0FBQSxrQkFBQTs7VUFFQSxTQUFBLFVBQUE7WUFDQSxHQUFBLENBQUEsS0FBQSxVQUFBLE9BQUE7Y0FDQSxLQUFBOztZQUVBLE9BQUEsS0FBQTs7Ozs7OztBQ2RBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxnQkFBQSxRQUFBLGVBQUE7SUFDQSxZQUFBLFVBQUEsQ0FBQSxjQUFBOztJQUVBLFNBQUEsWUFBQSxhQUFBLE9BQUE7UUFDQSxPQUFBO1VBQ0EsUUFBQTtVQUNBLFFBQUE7VUFDQSxNQUFBO1VBQ0EsS0FBQTtVQUNBLFFBQUE7OztRQUdBLFNBQUEsT0FBQSxPQUFBLE9BQUE7VUFDQSxJQUFBLE9BQUEsWUFBQSxJQUFBLE9BQUEsUUFBQTtZQUNBLEtBQUEsS0FBQSxVQUFBLElBQUEsU0FBQSxLQUFBO2NBQ0EsT0FBQSxNQUFBLEtBQUEsWUFBQTs7WUFFQSxPQUFBOztRQUVBLFNBQUEsT0FBQSxPQUFBLEdBQUE7VUFDQSxPQUFBLFlBQUEsSUFBQSxPQUFBLElBQUE7O1FBRUEsU0FBQSxLQUFBLE9BQUEsS0FBQTtVQUNBLElBQUEsT0FBQSxZQUFBLElBQUEsT0FBQSxLQUFBO1VBQ0EsS0FBQSxLQUFBLFVBQUEsSUFBQSxTQUFBLEtBQUE7WUFDQSxPQUFBLE1BQUEsS0FBQSxLQUFBLE9BQUE7O1VBRUEsT0FBQTs7UUFFQSxTQUFBLElBQUEsT0FBQSxLQUFBO1VBQ0EsT0FBQSxZQUFBLElBQUEsT0FBQSxJQUFBOztRQUVBLFNBQUEsT0FBQSxPQUFBLEdBQUE7VUFDQSxPQUFBLFlBQUEsSUFBQSxPQUFBLElBQUE7Ozs7OztBQ3BDQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsZ0JBQUEsUUFBQSwrQkFBQSxTQUFBLFVBQUE7O0VBRUEsT0FBQTtHQUNBLGNBQUEsU0FBQSxVQUFBLE9BQUE7O0lBRUEsSUFBQSxVQUFBO0tBQ0EsYUFBQSxxQkFBQSxXQUFBLE1BQUEsV0FBQTs7O0lBR0EsSUFBQSxPQUFBO0tBQ0EsUUFBQSxRQUFBLE9BQUE7OztJQUdBLE9BQUEsVUFBQSxLQUFBOzs7R0FHQSxNQUFBLFVBQUE7SUFDQSxPQUFBLFVBQUE7OztHQUdBLE9BQUEsU0FBQSxPQUFBLFFBQUE7SUFDQSxVQUFBO0tBQ0EsVUFBQTtPQUNBLE1BQUE7T0FDQSxRQUFBO09BQ0EsR0FBQTs7OztHQUlBLFNBQUEsU0FBQSxPQUFBLFNBQUE7SUFDQSxPQUFBLFVBQUE7S0FDQSxVQUFBO09BQ0EsTUFBQTtPQUNBLFFBQUE7T0FDQSxHQUFBO09BQ0EsT0FBQTs7Ozs7O0FDdENBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxnQkFBQSxRQUFBLHdFQUFBLFNBQUEsYUFBQSxlQUFBLGFBQUE7O1FBRUEsSUFBQSxLQUFBOztRQUVBLFNBQUEsWUFBQSxNQUFBO09BQ0EsR0FBQSxtQkFBQTtPQUNBLElBQUEsR0FBQSxLQUFBLFFBQUE7UUFDQSxHQUFBLE9BQUEsS0FBQSxTQUFBLFNBQUE7U0FDQSxRQUFBLFFBQUEsU0FBQSxTQUFBLE9BQUE7VUFDQSxJQUFBLFFBQUE7VUFDQSxRQUFBLFFBQUEsR0FBQSxLQUFBLEdBQUEsS0FBQSxRQUFBLFNBQUEsT0FBQTtXQUNBLElBQUEsVUFBQSxLQUFBLE1BQUEsTUFBQTtXQUNBLFFBQUEsUUFBQSxTQUFBLFNBQUEsUUFBQTtZQUNBLElBQUEsT0FBQSxVQUFBLE9BQUE7YUFDQTs7OztVQUlBLElBQUEsU0FBQSxHQUFBLEtBQUEsR0FBQSxLQUFBLE9BQUEsU0FBQSxHQUFBO1dBQ0EsR0FBQSxpQkFBQSxLQUFBOzs7U0FHQSxJQUFBLEdBQUEsaUJBQUEsUUFBQTtVQUNBLEdBQUEsR0FBQSxLQUFBLFdBQUE7V0FDQSxHQUFBLEtBQUEsT0FBQSxHQUFBLEtBQUEsR0FBQSxLQUFBLEdBQUEsR0FBQSxLQUFBOztVQUVBLGNBQUEsYUFBQSxjQUFBOzs7O1VBSUEsT0FBQTs7O01BR0EsU0FBQSxjQUFBO09BQ0EsUUFBQSxRQUFBLEdBQUEsTUFBQSxTQUFBLEtBQUEsS0FBQTtRQUNBLFFBQUEsUUFBQSxJQUFBLEtBQUEsSUFBQSxTQUFBLE1BQUEsR0FBQTtTQUNBLElBQUEsTUFBQSxTQUFBLE9BQUEsR0FBQTtVQUNBLEtBQUEsS0FBQSxXQUFBLGlCQUFBLFNBQUEsT0FBQSxLQUFBLEtBQUEsV0FBQSxjQUFBLFFBQUEsU0FBQSxDQUFBLEdBQUE7V0FDQSxHQUFBLEtBQUEsS0FBQSxLQUFBLEdBQUEsS0FBQTtXQUNBLElBQUEsT0FBQSxPQUFBLEdBQUE7V0FDQSxHQUFBLE9BQUEsT0FBQSxHQUFBOzs7O1FBSUEsSUFBQSxDQUFBLElBQUEsS0FBQSxHQUFBLEdBQUEsS0FBQSxZQUFBO1NBQ0EsSUFBQSxRQUFBO1VBQ0EsTUFBQTtVQUNBLFNBQUE7VUFDQSxPQUFBLElBQUEsS0FBQSxHQUFBLEdBQUEsS0FBQTtVQUNBLFFBQUEsR0FBQSxLQUFBO1VBQ0EsS0FBQTs7U0FFQSxJQUFBLGFBQUE7U0FDQSxRQUFBLFFBQUEsSUFBQSxRQUFBLFNBQUEsT0FBQSxLQUFBO1VBQ0EsSUFBQSxNQUFBLFFBQUEsR0FBQTtXQUNBLGFBQUE7OztTQUdBLElBQUEsQ0FBQSxZQUFBO1VBQ0EsSUFBQSxPQUFBLEtBQUE7VUFDQSxHQUFBLFdBQUEsS0FBQTs7Ozs7O01BTUEsU0FBQSxXQUFBO09BQ0EsSUFBQSxDQUFBLEdBQUEsS0FBQSxXQUFBO1FBQ0EsT0FBQSxNQUFBLDBDQUFBO1FBQ0EsT0FBQTs7T0FFQSxJQUFBLENBQUEsR0FBQSxLQUFBLGVBQUE7UUFDQSxPQUFBLE1BQUEsOENBQUE7UUFDQSxPQUFBOztPQUVBLElBQUEsR0FBQSxLQUFBLGlCQUFBLEdBQUEsS0FBQSxXQUFBO1FBQ0EsT0FBQSxNQUFBLG1EQUFBO1FBQ0EsT0FBQTs7O09BR0EsR0FBQSxXQUFBO09BQ0EsSUFBQSxVQUFBO09BQ0EsSUFBQSxXQUFBO09BQ0EsSUFBQSxVQUFBO09BQ0EsUUFBQSxRQUFBLEdBQUEsTUFBQSxTQUFBLE1BQUEsS0FBQTtRQUNBLElBQUEsS0FBQSxLQUFBLEdBQUEsR0FBQSxLQUFBLFlBQUE7U0FDQSxZQUFBLEtBQUEsS0FBQSxHQUFBLEdBQUEsS0FBQSxXQUFBLFVBQUEsSUFBQSxJQUFBOztRQUVBLFFBQUEsS0FBQSxLQUFBLEdBQUEsR0FBQSxLQUFBO1NBQ0EsS0FBQTtVQUNBLEtBQUEsS0FBQSxHQUFBLEdBQUEsS0FBQSxpQkFBQTtVQUNBO1NBQ0EsS0FBQTtVQUNBLEtBQUEsS0FBQSxHQUFBLEdBQUEsS0FBQSxpQkFBQTtVQUNBO1NBQ0EsS0FBQTtVQUNBLEtBQUEsS0FBQSxHQUFBLEdBQUEsS0FBQSxpQkFBQTtVQUNBO1NBQ0EsS0FBQTtVQUNBLEtBQUEsS0FBQSxHQUFBLEdBQUEsS0FBQSxpQkFBQTtVQUNBO1NBQ0E7VUFDQTs7UUFFQSxRQUFBLEtBQUE7U0FDQSxLQUFBLEtBQUEsS0FBQSxHQUFBLEdBQUEsS0FBQTtTQUNBLE1BQUEsS0FBQSxLQUFBLEdBQUEsR0FBQSxLQUFBOzs7T0FHQSxJQUFBLFVBQUEsYUFBQSxRQUFBLFNBQUEsS0FBQSxlQUFBO09BQ0EsYUFBQTtPQUNBLFlBQUEsS0FBQSx3QkFBQTtRQUNBLE1BQUE7UUFDQSxLQUFBO1VBQ0EsS0FBQSxTQUFBLFVBQUE7UUFDQSxRQUFBLFFBQUEsVUFBQSxTQUFBLFNBQUEsS0FBQTtTQUNBLFFBQUEsUUFBQSxHQUFBLE1BQUEsU0FBQSxNQUFBLEdBQUE7VUFDQSxJQUFBLFFBQUEsUUFBQSxLQUFBLEtBQUEsR0FBQSxHQUFBLEtBQUEsZ0JBQUE7V0FDQSxJQUFBLFFBQUEsS0FBQSxTQUFBLEdBQUE7WUFDQSxJQUFBLFdBQUE7YUFDQSxPQUFBO2FBQ0EsU0FBQSxRQUFBOztZQUVBLGFBQUEsWUFBQTtrQkFDQTtZQUNBLElBQUEsT0FBQSxRQUFBLEtBQUEsTUFBQSxhQUFBO2FBQ0EsR0FBQSxLQUFBLEdBQUEsS0FBQSxHQUFBLEdBQUEsS0FBQSxhQUFBLFFBQUEsS0FBQSxHQUFBO2FBQ0EsR0FBQSxLQUFBLEdBQUEsS0FBQSxHQUFBLEdBQUEsS0FBQSxpQkFBQSxRQUFBLEtBQUEsR0FBQTthQUNBLElBQUEsS0FBQSxPQUFBLFFBQUE7Y0FDQSxRQUFBLFFBQUEsS0FBQSxRQUFBLFNBQUEsT0FBQSxHQUFBO2VBQ0EsSUFBQSxNQUFBLFFBQUEsS0FBQSxNQUFBLFFBQUEsR0FBQTtnQkFDQSxHQUFBLFdBQUEsT0FBQSxHQUFBO2dCQUNBLEtBQUEsT0FBQSxPQUFBLEdBQUE7c0JBQ0EsSUFBQSxNQUFBLFFBQUEsR0FBQTtnQkFDQSxJQUFBLE1BQUEsVUFBQSxHQUFBLEtBQUEsV0FBQTtpQkFDQSxHQUFBLE9BQUEsT0FBQSxHQUFBO2lCQUNBLEtBQUEsT0FBQSxPQUFBLEdBQUE7Ozs7OzttQkFNQTs7YUFFQSxJQUFBLFFBQUE7Y0FDQSxNQUFBO2NBQ0EsU0FBQTtjQUNBLFFBQUEsR0FBQSxLQUFBOzthQUVBLElBQUEsYUFBQTthQUNBLFFBQUEsUUFBQSxHQUFBLEtBQUEsR0FBQSxRQUFBLFNBQUEsT0FBQSxHQUFBO2NBQ0EsUUFBQSxJQUFBO2NBQ0EsSUFBQSxNQUFBLFFBQUEsR0FBQTtlQUNBLGFBQUE7OzthQUdBLElBQUEsQ0FBQSxZQUFBO2NBQ0EsYUFBQSxZQUFBO2NBQ0EsS0FBQSxPQUFBLEtBQUE7Ozs7Ozs7UUFPQSxHQUFBLGNBQUE7UUFDQSxJQUFBLGFBQUEsY0FBQSxRQUFBO1NBQ0EsY0FBQSxhQUFBOztVQUVBLFNBQUEsVUFBQTtRQUNBLE9BQUEsTUFBQSxzQ0FBQSxTQUFBLEtBQUE7Ozs7UUFJQSxPQUFBO1VBQ0EsYUFBQTs7Ozs7O0FDbExBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxnQkFBQSxRQUFBLGdCQUFBLFVBQUE7UUFDQSxJQUFBLFdBQUE7VUFDQSxTQUFBO1VBQ0EsU0FBQTtVQUNBLFVBQUE7VUFDQSxhQUFBO1VBQ0EsU0FBQTtVQUNBLFFBQUE7VUFDQSxPQUFBO1VBQ0EsVUFBQTtVQUNBLE9BQUE7VUFDQSxRQUFBOzs7UUFHQSxPQUFBO1VBQ0EsWUFBQSxTQUFBLEtBQUE7WUFDQSxPQUFBLFNBQUE7O1VBRUEsUUFBQSxVQUFBO1lBQ0EsT0FBQTs7Ozs7OztBQ3RCQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsZ0JBQUEsUUFBQSwyQ0FBQSxTQUFBLGFBQUEsT0FBQTs7UUFFQSxJQUFBLGNBQUE7WUFDQSxNQUFBO1lBQ0EsUUFBQTtZQUNBLFdBQUE7WUFDQSxLQUFBO2NBQ0EsV0FBQTtjQUNBLGNBQUE7Y0FDQSxXQUFBO2NBQ0EsTUFBQTs7WUFFQSxXQUFBO1lBQ0EsU0FBQTtXQUNBLFNBQUEsYUFBQTs7UUFFQSxJQUFBLENBQUEsYUFBQSxJQUFBLGVBQUE7VUFDQSxjQUFBLGFBQUEsY0FBQTtZQUNBLG9CQUFBLEtBQUEsS0FBQTtZQUNBLGdCQUFBO1lBQ0EsYUFBQTs7VUFFQSxjQUFBLFlBQUEsSUFBQTs7WUFFQTtVQUNBLGNBQUEsYUFBQSxJQUFBO1VBQ0EsVUFBQSxZQUFBLElBQUE7O1FBRUEsT0FBQTtVQUNBLE1BQUEsVUFBQTtZQUNBLE9BQUEsR0FBQTtZQUNBLEdBQUEsYUFBQSxJQUFBLGNBQUE7Z0JBQ0EsWUFBQSxPQUFBOztZQUVBLE9BQUEsYUFBQTtnQkFDQSxNQUFBO2dCQUNBLFFBQUE7Z0JBQ0EsV0FBQTtnQkFDQSxLQUFBO2tCQUNBLFdBQUE7a0JBQ0EsY0FBQTtrQkFDQSxXQUFBOztnQkFFQSxTQUFBO2dCQUNBLFdBQUE7OztVQUdBLFFBQUEsU0FBQSxLQUFBO1lBQ0EsT0FBQSxZQUFBLEtBQUEsS0FBQTs7VUFFQSxjQUFBLFNBQUEsS0FBQTtZQUNBLE9BQUEsWUFBQSxXQUFBLEtBQUE7O1VBRUEsYUFBQSxTQUFBLEtBQUE7WUFDQSxPQUFBLFlBQUEsU0FBQSxLQUFBOztVQUVBLGFBQUEsU0FBQSxNQUFBO1lBQ0EsT0FBQSxZQUFBLFdBQUEsS0FBQTs7VUFFQSxnQkFBQSxTQUFBLEtBQUE7WUFDQSxJQUFBLFFBQUEsWUFBQSxTQUFBLFFBQUE7WUFDQSxPQUFBLFFBQUEsQ0FBQSxJQUFBLFlBQUEsU0FBQSxPQUFBLE9BQUEsS0FBQTs7VUFFQSxTQUFBLFNBQUEsS0FBQTtZQUNBLE9BQUEsWUFBQSxPQUFBOztVQUVBLGFBQUEsU0FBQSxJQUFBO1lBQ0EsT0FBQSxZQUFBLEtBQUEsWUFBQTs7VUFFQSxpQkFBQSxTQUFBLElBQUE7WUFDQSxPQUFBLFlBQUEsS0FBQSxnQkFBQTs7VUFFQSxjQUFBLFNBQUEsSUFBQTtZQUNBLE9BQUEsWUFBQSxLQUFBLGFBQUE7O1VBRUEsV0FBQSxTQUFBLE9BQUE7WUFDQSxPQUFBLFlBQUEsU0FBQTs7VUFFQSxtQkFBQSxVQUFBOztVQUVBLFlBQUEsSUFBQSxlQUFBOztVQUVBLGNBQUEsU0FBQSxLQUFBLEtBQUE7WUFDQSxPQUFBLFlBQUEsV0FBQSxPQUFBOztVQUVBLHdCQUFBLFNBQUEsS0FBQTtZQUNBLE9BQUEsWUFBQSxZQUFBLFdBQUEsS0FBQSxlQUFBOztVQUVBLHFCQUFBLFVBQUE7WUFDQSxPQUFBLGNBQUEsWUFBQSxJQUFBOztVQUVBLGFBQUEsVUFBQTtZQUNBLE9BQUE7O1VBRUEsU0FBQSxVQUFBO1lBQ0EsR0FBQSxPQUFBLGVBQUEsYUFBQSxPQUFBO1lBQ0EsT0FBQSxZQUFBOztVQUVBLFNBQUEsVUFBQTtZQUNBLEdBQUEsT0FBQSxlQUFBLGFBQUEsT0FBQTtZQUNBLE9BQUEsWUFBQTs7VUFFQSxhQUFBLFVBQUE7WUFDQSxPQUFBLFlBQUE7O1VBRUEsYUFBQSxVQUFBO1lBQ0EsT0FBQSxZQUFBLEtBQUE7O1VBRUEsaUJBQUEsVUFBQTtZQUNBLE9BQUEsWUFBQSxLQUFBOztVQUVBLFdBQUEsVUFBQTtZQUNBLEdBQUEsT0FBQSxlQUFBLGFBQUEsT0FBQTtZQUNBLE9BQUEsWUFBQTs7VUFFQSxjQUFBLFVBQUE7WUFDQSxHQUFBLE9BQUEsZUFBQSxhQUFBLE9BQUE7WUFDQSxPQUFBLFlBQUE7O1VBRUEsZUFBQSxVQUFBO1lBQ0EsT0FBQSxZQUFBLEtBQUE7O1VBRUEsYUFBQSxVQUFBO1lBQ0EsT0FBQSxZQUFBLEtBQUE7O1VBRUEsY0FBQSxTQUFBLElBQUE7WUFDQSxPQUFBLFlBQUEsWUFBQSxXQUFBOztVQUVBLGVBQUEsVUFBQTtZQUNBLEdBQUEsT0FBQSxlQUFBLGFBQUEsT0FBQTtZQUNBLE9BQUEsWUFBQTs7VUFFQSxpQkFBQSxVQUFBO1lBQ0EsT0FBQTs7VUFFQSxlQUFBLFVBQUE7WUFDQSxPQUFBLFlBQUE7O1VBRUEsZUFBQSxVQUFBO1lBQ0EsT0FBQSxZQUFBLFdBQUEsT0FBQSxFQUFBOztVQUVBLFlBQUEsVUFBQTtZQUNBLE9BQUEsWUFBQSxPQUFBLE9BQUEsRUFBQTs7VUFFQSxlQUFBLFVBQUE7WUFDQSxPQUFBLFlBQUEsV0FBQTs7VUFFQSxtQkFBQSxVQUFBO1lBQ0EsR0FBQSxhQUFBLElBQUEsY0FBQTtnQkFDQSxZQUFBLE9BQUE7O1lBRUEsT0FBQSxhQUFBO2dCQUNBLE1BQUE7Z0JBQ0EsUUFBQTtnQkFDQSxXQUFBO2dCQUNBLEtBQUE7a0JBQ0EsV0FBQTtrQkFDQSxjQUFBO2tCQUNBLFdBQUE7O2dCQUVBLFNBQUE7Z0JBQ0EsV0FBQTs7Ozs7Ozs7QUNwS0EsQ0FBQSxZQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGdCQUFBLFFBQUEsa0NBQUEsVUFBQSxhQUFBOztFQUVBLE9BQUE7R0FDQSxPQUFBO0lBQ0EsTUFBQTtLQUNBLE1BQUE7S0FDQSxXQUFBOztJQUVBLFVBQUE7S0FDQSxNQUFBO0tBQ0EsVUFBQTs7O0dBR0EsV0FBQSxTQUFBLE9BQUE7SUFDQSxLQUFBLE1BQUEsU0FBQSxPQUFBLFlBQUEsT0FBQSxXQUFBLFFBQUE7SUFDQSxLQUFBLE1BQUEsU0FBQSxZQUFBLFlBQUEsT0FBQSxXQUFBLFFBQUE7SUFDQSxLQUFBLE1BQUEsS0FBQSxPQUFBLEtBQUEsTUFBQSxTQUFBLEtBQUE7SUFDQSxLQUFBLE1BQUEsS0FBQSxZQUFBLEtBQUEsTUFBQSxTQUFBLFVBQUE7SUFDQSxPQUFBLEtBQUE7O0dBRUEsU0FBQSxZQUFBO0lBQ0EsT0FBQSxLQUFBLE1BQUEsS0FBQTs7R0FFQSxjQUFBLFlBQUE7SUFDQSxPQUFBLEtBQUEsTUFBQSxLQUFBOztHQUVBLGdCQUFBLFlBQUE7SUFDQSxPQUFBLEtBQUEsTUFBQSxTQUFBOztHQUVBLHFCQUFBLFlBQUE7SUFDQSxPQUFBLEtBQUEsTUFBQSxTQUFBOzs7Ozs7O0FDakNBLENBQUEsWUFBQTtFQUNBOztFQUVBLFFBQUEsT0FBQSxnQkFBQSxRQUFBLGdDQUFBLFVBQUEsVUFBQTs7SUFFQSxPQUFBOzs7Ozs7O0tBT0EsU0FBQSxVQUFBLFNBQUEsTUFBQTs7TUFFQSxJQUFBLFFBQUEsV0FBQSxPQUFBO09BQ0EsT0FBQTtRQUNBLE1BQUE7Ozs7O01BS0EsSUFBQSxXQUFBLFFBQUEsV0FBQTtNQUNBLElBQUE7TUFDQSxPQUFBO09BQ0EsS0FBQSxDQUFBLFFBQUEsS0FBQSxPQUFBLEtBQUEsTUFBQTs7OztPQUlBLE1BQUEsVUFBQSxPQUFBLFNBQUE7O1FBRUEsSUFBQSxDQUFBLGtCQUFBO1NBQ0EsbUJBQUEsU0FBQTs7O1FBR0EsaUJBQUEsT0FBQSxVQUFBLE9BQUE7U0FDQSxRQUFBLE9BQUE7Ozs7UUFJQSxJQUFBLFFBQUEsS0FBQSxNQUFBO1NBQ0EsS0FBQSxLQUFBLE1BQUEsTUFBQTs7Ozs7Ozs7OztBQ3hDQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsZ0JBQUEsUUFBQSw2QkFBQSxTQUFBLFNBQUE7O0VBRUEsSUFBQSxRQUFBO0dBQ0EsV0FBQTtHQUNBLFNBQUE7O0VBRUEsT0FBQTtHQUNBLE1BQUEsU0FBQSxRQUFBO0lBQ0EsSUFBQSxDQUFBLFFBQUE7S0FDQSxPQUFBOzs7SUFHQSxPQUFBLFNBQUE7S0FDQSxTQUFBO09BQ0EsUUFBQTtPQUNBLFNBQUE7T0FDQSxPQUFBO09BQ0EsVUFBQTs7O0dBR0EsT0FBQSxTQUFBLFFBQUE7SUFDQSxJQUFBLENBQUEsUUFBQTtLQUNBLE9BQUE7OztJQUdBLE9BQUEsU0FBQTtLQUNBLFNBQUE7T0FDQSxRQUFBO09BQ0EsU0FBQTtPQUNBLE1BQUE7T0FDQSxPQUFBO09BQ0EsVUFBQTs7Ozs7O0FDbENBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxnQkFBQSxRQUFBLCtCQUFBLFNBQUEsWUFBQTs7O1FBR0EsT0FBQTtVQUNBLEtBQUE7WUFDQSxNQUFBOztVQUVBLFFBQUEsVUFBQTtZQUNBLE9BQUEsS0FBQSxLQUFBLE9BQUEsWUFBQSxPQUFBOztVQUVBLFdBQUEsVUFBQTs7O1VBR0EsV0FBQSxVQUFBOzs7Ozs7OztBQ2hCQSxDQUFBLFdBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsZ0JBQUEsUUFBQSxtQ0FBQSxTQUFBLFVBQUE7RUFDQSxJQUFBLE9BQUEsTUFBQSxRQUFBO0VBQ0EsT0FBQTtHQUNBLFFBQUE7R0FDQSxTQUFBO0dBQ0EsS0FBQTtHQUNBLE1BQUE7SUFDQSxRQUFBO0lBQ0EsUUFBQTs7R0FFQSxNQUFBO0lBQ0EsT0FBQTtJQUNBLE1BQUE7SUFDQSxXQUFBO0lBQ0EsTUFBQTtJQUNBLE1BQUE7SUFDQSxLQUFBO0lBQ0EsUUFBQTtJQUNBLE1BQUE7O0dBRUEsS0FBQTtJQUNBLE1BQUE7SUFDQSxTQUFBO0lBQ0EsV0FBQTtJQUNBLE9BQUE7O0dBRUEsVUFBQTtHQUNBLFFBQUEsU0FBQSxJQUFBO0lBQ0EsT0FBQSxLQUFBLFdBQUE7O0dBRUEsVUFBQSxTQUFBLEdBQUE7SUFDQSxPQUFBLEtBQUEsS0FBQSxRQUFBOztHQUVBLFVBQUEsV0FBQTtJQUNBLE9BQUEsS0FBQSxLQUFBOztHQUVBLFNBQUEsV0FBQTtJQUNBLE9BQUEsS0FBQSxLQUFBOztHQUVBLFFBQUEsV0FBQTtJQUNBLE9BQUEsS0FBQSxLQUFBOztHQUVBLEtBQUEsV0FBQTtJQUNBLE9BQUEsS0FBQSxLQUFBOztHQUVBLE1BQUEsV0FBQTtJQUNBLE9BQUEsS0FBQSxLQUFBOztHQUVBLE1BQUEsV0FBQTtJQUNBLE9BQUEsS0FBQSxLQUFBOztHQUVBLGNBQUEsU0FBQSxPQUFBO0lBQ0EsS0FBQSxTQUFBLFNBQUEsY0FBQTtJQUNBLEtBQUEsT0FBQSxRQUFBO0lBQ0EsS0FBQSxPQUFBLFNBQUE7SUFDQSxLQUFBLE1BQUEsS0FBQSxPQUFBLFdBQUE7SUFDQSxJQUFBLFdBQUEsS0FBQSxJQUFBLHFCQUFBLEdBQUEsR0FBQSxLQUFBO0lBQ0EsU0FBQSxhQUFBLEdBQUE7SUFDQSxTQUFBLGFBQUEsTUFBQSxTQUFBO0lBQ0EsU0FBQSxhQUFBLEdBQUE7SUFDQSxLQUFBLElBQUEsWUFBQTtJQUNBLEtBQUEsSUFBQSxTQUFBLEdBQUEsR0FBQSxLQUFBO0lBQ0EsS0FBQSxVQUFBLEtBQUEsSUFBQSxhQUFBLEdBQUEsR0FBQSxLQUFBLEdBQUE7OztHQUdBLGNBQUEsU0FBQSxPQUFBO0lBQ0EsSUFBQSxXQUFBLEtBQUEsSUFBQSxxQkFBQSxHQUFBLEdBQUEsS0FBQTtJQUNBLFNBQUEsYUFBQSxHQUFBO0lBQ0EsU0FBQSxhQUFBLE1BQUEsU0FBQTtJQUNBLFNBQUEsYUFBQSxHQUFBO0lBQ0EsS0FBQSxJQUFBLFlBQUE7SUFDQSxLQUFBLElBQUEsU0FBQSxHQUFBLEdBQUEsS0FBQTtJQUNBLEtBQUEsVUFBQSxLQUFBLElBQUEsYUFBQSxHQUFBLEdBQUEsS0FBQSxHQUFBOzs7R0FHQSxtQkFBQSxTQUFBLFdBQUE7O0lBRUEsS0FBQSxTQUFBLFNBQUEsY0FBQTtJQUNBLEtBQUEsT0FBQSxRQUFBO0lBQ0EsS0FBQSxPQUFBLFNBQUE7SUFDQSxLQUFBLE1BQUEsS0FBQSxPQUFBLFdBQUE7SUFDQSxJQUFBLFdBQUEsS0FBQSxJQUFBLHFCQUFBLEdBQUEsR0FBQSxLQUFBOztJQUVBLElBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxXQUFBLFFBQUEsSUFBQTtLQUNBLFNBQUEsYUFBQSxLQUFBLFdBQUEsUUFBQSxLQUFBLEdBQUEsV0FBQTs7SUFFQSxLQUFBLElBQUEsWUFBQTtJQUNBLEtBQUEsSUFBQSxTQUFBLEdBQUEsR0FBQSxLQUFBO0lBQ0EsS0FBQSxVQUFBLEtBQUEsSUFBQSxhQUFBLEdBQUEsR0FBQSxLQUFBLEdBQUE7OztHQUdBLG1CQUFBLFNBQUEsWUFBQTtJQUNBLElBQUEsV0FBQSxLQUFBLElBQUEscUJBQUEsR0FBQSxHQUFBLEtBQUE7SUFDQSxJQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsV0FBQSxRQUFBLElBQUE7S0FDQSxTQUFBLGFBQUEsS0FBQSxXQUFBLFFBQUEsS0FBQSxHQUFBLFdBQUE7O0lBRUEsS0FBQSxJQUFBLFlBQUE7SUFDQSxLQUFBLElBQUEsU0FBQSxHQUFBLEdBQUEsS0FBQTtJQUNBLEtBQUEsVUFBQSxLQUFBLElBQUEsYUFBQSxHQUFBLEdBQUEsS0FBQSxHQUFBOzs7R0FHQSxjQUFBLFNBQUEsT0FBQTtJQUNBLE9BQUEsS0FBQSxLQUFBLFlBQUE7Ozs7O0dBS0EsY0FBQSxTQUFBLGVBQUE7SUFDQSxJQUFBLE9BQUE7SUFDQSxTQUFBLFVBQUE7TUFDQSxLQUFBLEtBQUEsTUFBQSxRQUFBLFVBQUE7Ozs7R0FJQSxVQUFBLFNBQUEsT0FBQTtJQUNBLE9BQUEsS0FBQSxRQUFBOztHQUVBLFVBQUEsU0FBQSxNQUFBO0lBQ0EsT0FBQSxLQUFBLElBQUEsUUFBQTs7R0FFQSxTQUFBLFNBQUEsTUFBQSxPQUFBLFFBQUE7SUFDQSxLQUFBLElBQUEsT0FBQTtJQUNBLElBQUEsT0FBQSxTQUFBLGFBQUE7S0FDQSxLQUFBLEtBQUEsWUFBQTs7SUFFQSxJQUFBLENBQUEsS0FBQSxRQUFBO0tBQ0EsR0FBQSxPQUFBLEtBQUEsS0FBQSxhQUFBLFNBQUE7TUFDQSxLQUFBLGFBQUEsS0FBQSxLQUFBOztTQUVBO01BQ0EsS0FBQSxrQkFBQSxLQUFBLEtBQUE7O1dBRUE7S0FDQSxHQUFBLE9BQUEsS0FBQSxLQUFBLGFBQUEsU0FBQTtNQUNBLEtBQUEsYUFBQSxLQUFBLEtBQUE7O1NBRUE7TUFDQSxLQUFBLGtCQUFBLEtBQUEsS0FBQTs7O0lBR0EsSUFBQSxRQUFBO0tBQ0EsS0FBQTs7O0dBR0EsZ0JBQUEsU0FBQSxLQUFBLE1BQUE7SUFDQSxHQUFBLE9BQUEsU0FBQSxZQUFBO0tBQ0EsSUFBQSxLQUFBLFVBQUEsR0FBQSxPQUFBO0tBQ0EsSUFBQSxTQUFBO0tBQ0EsUUFBQSxRQUFBLE1BQUEsU0FBQSxLQUFBO01BQ0EsSUFBQSxJQUFBLE9BQUEsS0FBQTtPQUNBLFNBQUE7Ozs7UUFJQTtLQUNBLElBQUEsS0FBQSxJQUFBLEtBQUEsVUFBQSxHQUFBLE9BQUE7S0FDQSxJQUFBLFNBQUE7S0FDQSxRQUFBLFFBQUEsS0FBQSxJQUFBLE1BQUEsU0FBQSxLQUFBO01BQ0EsSUFBQSxJQUFBLE9BQUEsS0FBQTtPQUNBLFNBQUE7Ozs7O0lBS0EsT0FBQTs7R0FFQSxpQkFBQSxTQUFBLE1BQUE7SUFDQSxJQUFBLEtBQUEsSUFBQSxLQUFBLFVBQUEsR0FBQSxPQUFBOztHQUVBLGdCQUFBLFNBQUEsT0FBQSxPQUFBLE9BQUE7SUFDQSxJQUFBLE9BQUE7O0lBRUEsU0FBQSxXQUFBO0tBQ0EsSUFBQSxPQUFBLFNBQUEsZUFBQSxTQUFBLE1BQUE7TUFDQSxLQUFBLEtBQUEsTUFBQSxTQUFBO1lBQ0E7TUFDQSxLQUFBLEtBQUEsTUFBQSxTQUFBLEtBQUEsSUFBQTs7S0FFQSxJQUFBLE9BQUEsU0FBQSxhQUFBO01BQ0EsS0FBQSxLQUFBLE1BQUEsUUFBQSxVQUFBOztLQUVBLEtBQUEsS0FBQSxNQUFBOzs7R0FHQSxlQUFBLFNBQUEsSUFBQTtJQUNBLFFBQUEsUUFBQSxLQUFBLEtBQUEsTUFBQSxPQUFBLEtBQUEsS0FBQSxLQUFBLFNBQUEsVUFBQSxTQUFBLFNBQUEsSUFBQTtLQUNBLEdBQUEsT0FBQTtLQUNBLFFBQUEsV0FBQTs7SUFFQSxLQUFBOztHQUVBLG1CQUFBLFNBQUEsS0FBQSxTQUFBO0lBQ0EsS0FBQSxLQUFBLE1BQUEsT0FBQSxLQUFBLEtBQUEsS0FBQSxTQUFBLFNBQUEsS0FBQSxXQUFBOztHQUVBLE9BQUEsVUFBQTtJQUNBLEtBQUEsS0FBQSxNQUFBOzs7R0FHQSxnQkFBQSxTQUFBLFNBQUE7SUFDQTtJQUNBLElBQUEsUUFBQTtJQUNBLElBQUEsTUFBQSxRQUFBLFdBQUEsS0FBQSxLQUFBO0lBQ0EsSUFBQSxTQUFBLEtBQUEsZUFBQTtJQUNBLElBQUEsUUFBQSxLQUFBLEtBQUE7SUFDQSxJQUFBLE9BQUEsUUFBQTtJQUNBLFFBQUEsV0FBQTs7SUFFQSxRQUFBO0tBQ0EsS0FBQTtNQUNBLElBQUEsT0FBQSxPQUFBLFVBQUEsZUFBQSxPQUFBLFVBQUEsS0FBQTtPQUNBLElBQUEsY0FBQSxHQUFBLE1BQUEsU0FBQSxPQUFBLENBQUEsR0FBQSxNQUFBLElBQUEsR0FBQSxNQUFBLE1BQUEsTUFBQSxDQUFBLEVBQUE7O09BRUEsSUFBQSxZQUFBLFNBQUEsWUFBQSxXQUFBLE9BQUEsWUFBQTtPQUNBLFFBQUEsSUFBQSxVQUFBLElBQUE7T0FDQSxJQUFBLFFBQUEsVUFBQSxLQUFBLFFBQUEsWUFBQSxPQUFBLEtBQUEsUUFBQSxXQUFBLEtBQUEsT0FBQSxLQUFBLFFBQUEsV0FBQSxLQUFBLE1BQUEsS0FBQSxRQUFBLFdBQUEsS0FBQTtPQUNBLE1BQUEsUUFBQSxVQUFBLEtBQUEsUUFBQSxZQUFBLE9BQUEsS0FBQSxRQUFBLFdBQUEsS0FBQSxPQUFBLEtBQUEsUUFBQSxXQUFBLEtBQUE7T0FDQSxNQUFBLFVBQUE7UUFDQSxPQUFBO1FBQ0EsTUFBQTs7T0FFQSxNQUFBLFdBQUE7UUFDQSxPQUFBLFVBQUEsS0FBQSxRQUFBLFlBQUEsT0FBQSxLQUFBLFFBQUEsV0FBQSxLQUFBLE9BQUEsS0FBQSxRQUFBLFdBQUEsS0FBQTtRQUNBLFNBQUE7U0FDQSxPQUFBO1NBQ0EsTUFBQTs7OzthQUlBO09BQ0EsTUFBQSxRQUFBO09BQ0EsTUFBQSxVQUFBO1FBQ0EsT0FBQTtRQUNBLE1BQUE7Ozs7T0FJQTs7SUFFQSxPQUFBOzs7Ozs7OztBQ2pQQSxDQUFBLFdBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSwwREFBQSxTQUFBLGFBQUEsUUFBQSxRQUFBOztFQUVBLElBQUEsS0FBQTtFQUNBLEdBQUEsVUFBQTtFQUNBLEdBQUEsU0FBQTtFQUNBLEdBQUEsTUFBQTs7RUFFQSxHQUFBLFdBQUE7O0VBRUEsU0FBQSxXQUFBO0dBQ0EsSUFBQSxPQUFBO0lBQ0EsU0FBQSxHQUFBO0lBQ0EsUUFBQSxHQUFBOztHQUVBLFlBQUEsSUFBQSxxQkFBQSxLQUFBLE1BQUEsS0FBQSxTQUFBLE1BQUE7SUFDQSxPQUFBLEdBQUE7Ozs7Ozs7O0FDbEJBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLG9GQUFBLFNBQUEsVUFBQSxZQUFBLG9CQUFBLFNBQUE7O1FBRUEsSUFBQSxLQUFBO1FBQ0EsR0FBQSxXQUFBO1FBQ0EsR0FBQSxnQkFBQTtRQUNBLEdBQUEsY0FBQTtRQUNBLEdBQUEsY0FBQSxHQUFBLE1BQUEsU0FBQSxPQUFBLENBQUEsR0FBQSxJQUFBLE1BQUEsQ0FBQSxHQUFBO1FBQ0EsR0FBQSxTQUFBLENBQUEsV0FBQSxXQUFBLFdBQUEsV0FBQTtRQUNBLEdBQUEsWUFBQTtRQUNBLEdBQUEsWUFBQTtRQUNBLEdBQUEsc0JBQUE7UUFDQSxHQUFBLGdCQUFBO1VBQ0EsT0FBQTtVQUNBLE9BQUE7VUFDQSxNQUFBO1VBQ0EsZUFBQTs7O1FBR0E7O01BRUEsU0FBQSxXQUFBO09BQ0EsbUJBQUEsUUFBQSxHQUFBLFNBQUEsU0FBQSxHQUFBLFFBQUE7T0FDQSxtQkFBQSxTQUFBO09BQ0EsbUJBQUEsYUFBQTtPQUNBLFNBQUEsWUFBQTs7O1NBR0EsUUFBQSxRQUFBLEdBQUEsU0FBQSxTQUFBLFVBQUEsUUFBQTtVQUNBLElBQUEsSUFBQSxHQUFBLFVBQUEsUUFBQSxPQUFBO1VBQ0EsSUFBQSxLQUFBLENBQUEsSUFBQTtXQUNBLEdBQUEsVUFBQSxLQUFBLE9BQUE7a0JBQ0EsR0FBQSxVQUFBLEtBQUE7V0FDQSxtQkFBQSxtQkFBQSxPQUFBLEtBQUE7Ozs7WUFJQSxRQUFBLElBQUEsR0FBQTtRQUNBLFdBQUEsU0FBQTtRQUNBLG1CQUFBLGVBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7UUFtQkEsU0FBQSxhQUFBLEtBQUEsR0FBQTs7T0FFQSxJQUFBLFVBQUEsbUJBQUEsZUFBQSxJQUFBLFFBQUEsV0FBQTtPQUNBLElBQUEsT0FBQSxRQUFBLGdCQUFBLGFBQUE7UUFDQSxtQkFBQSxjQUFBLFFBQUE7UUFDQSxPQUFBLEdBQUEsNkJBQUE7U0FDQSxLQUFBLFFBQUE7Ozs7O01BS0EsU0FBQSxjQUFBLFNBQUE7T0FDQSxJQUFBLFFBQUE7T0FDQSxJQUFBLE1BQUEsUUFBQSxXQUFBLG1CQUFBLEtBQUE7T0FDQSxJQUFBLFNBQUEsbUJBQUEsZUFBQTtPQUNBLElBQUEsUUFBQTtPQUNBLElBQUEsV0FBQSxTQUFBLEdBQUEsWUFBQSxXQUFBLE9BQUEsWUFBQTs7T0FFQSxJQUFBLFFBQUEsVUFBQSxtQkFBQSxRQUFBLFlBQUEsT0FBQSxtQkFBQSxRQUFBLFdBQUEsS0FBQSxPQUFBLG1CQUFBLFFBQUEsV0FBQSxLQUFBLE1BQUEsbUJBQUEsUUFBQSxXQUFBLEtBQUE7T0FDQSxNQUFBLFFBQUE7T0FDQSxNQUFBLFVBQUE7UUFDQSxPQUFBO1FBQ0EsTUFBQTs7T0FFQSxNQUFBLFdBQUE7UUFDQSxPQUFBO1FBQ0EsU0FBQTtTQUNBLE9BQUE7U0FDQSxNQUFBOzs7T0FHQSxPQUFBOztRQUVBLFNBQUEsYUFBQTtVQUNBLEdBQUEsR0FBQSxZQUFBLE1BQUEsT0FBQTtVQUNBLEdBQUEsR0FBQSxTQUFBLFdBQUEsR0FBQSxTQUFBO1VBQ0EsT0FBQTtVQUNBLEdBQUEsR0FBQSxTQUFBLFVBQUEsR0FBQSxTQUFBO1VBQ0EsT0FBQTs7VUFFQSxPQUFBOztRQUVBLFNBQUEscUJBQUE7VUFDQSxHQUFBLEdBQUEsZUFBQSxPQUFBO1VBQ0EsT0FBQTs7Ozs7O0FDeEdBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLHFCQUFBLFVBQUE7Ozs7OztBQ0hBLENBQUEsWUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLHVIQUFBLFVBQUEsVUFBQSxRQUFBLFlBQUEsV0FBQSxRQUFBLG9CQUFBLGFBQUE7O0VBRUEsSUFBQSxLQUFBO0VBQ0EsR0FBQSxTQUFBO0VBQ0EsR0FBQSxZQUFBO0VBQ0EsR0FBQSxjQUFBLEdBQUEsTUFBQSxTQUFBLE9BQUEsQ0FBQSxHQUFBLElBQUEsTUFBQSxDQUFBLEdBQUE7RUFDQSxHQUFBLFNBQUEsQ0FBQSxXQUFBLFdBQUEsV0FBQSxXQUFBO0VBQ0EsR0FBQSxZQUFBO0lBQ0EsR0FBQSxXQUFBO0lBQ0EsR0FBQSxjQUFBO0lBQ0EsR0FBQSxnQkFBQTtNQUNBLE9BQUE7TUFDQSxPQUFBO01BQ0EsTUFBQTtNQUNBLGVBQUE7O0VBRUE7O0VBRUEsU0FBQSxXQUFBO0dBQ0EsbUJBQUEsUUFBQSxHQUFBLFdBQUEsR0FBQSxRQUFBO0dBQ0EsbUJBQUEsU0FBQTtHQUNBLG1CQUFBLGFBQUE7R0FDQSxTQUFBLFlBQUE7UUFDQSxHQUFBLFVBQUEsS0FBQSxHQUFBLE9BQUE7UUFDQSxtQkFBQSxtQkFBQSxHQUFBLE9BQUEsS0FBQTtJQUNBLFFBQUEsUUFBQSxHQUFBLE9BQUEsV0FBQSxVQUFBLFVBQUE7VUFDQSxHQUFBLENBQUEsR0FBQSxVQUFBLEdBQUEsV0FBQTtVQUNBLEdBQUEsU0FBQSxVQUFBLEdBQUEsU0FBQSxRQUFBO1lBQ0EsR0FBQSxXQUFBOztLQUVBLFFBQUEsUUFBQSxTQUFBLFNBQUEsVUFBQSxRQUFBO01BQ0EsSUFBQSxJQUFBLEdBQUEsVUFBQSxRQUFBLE9BQUE7TUFDQSxJQUFBLEtBQUEsQ0FBQSxLQUFBLE9BQUEsT0FBQSxHQUFBLE9BQUEsS0FBQTtPQUNBLEdBQUEsVUFBQSxLQUFBLE9BQUE7T0FDQSxtQkFBQSxtQkFBQSxPQUFBLEtBQUE7Ozs7SUFJQSxXQUFBLFNBQUE7SUFDQSxtQkFBQSxlQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBbUJBLFNBQUEsYUFBQTtNQUNBLEdBQUEsR0FBQSxZQUFBLE1BQUEsT0FBQTtNQUNBLEdBQUEsR0FBQSxTQUFBLFdBQUEsR0FBQSxTQUFBO01BQ0EsT0FBQTtNQUNBLEdBQUEsR0FBQSxTQUFBLFVBQUEsR0FBQSxTQUFBO01BQ0EsT0FBQTs7TUFFQSxPQUFBOztFQUVBLFNBQUEsYUFBQSxLQUFBLEdBQUE7O0dBRUEsSUFBQSxVQUFBLG1CQUFBLGVBQUEsSUFBQSxRQUFBLFdBQUE7R0FDQSxJQUFBLE9BQUEsUUFBQSxnQkFBQSxhQUFBO0lBQ0EsbUJBQUEsY0FBQSxRQUFBO0lBQ0EsT0FBQSxHQUFBLDZCQUFBO0tBQ0EsS0FBQSxRQUFBOzs7OztFQUtBLFNBQUEsY0FBQSxTQUFBO0dBQ0EsSUFBQSxRQUFBO0dBQ0EsSUFBQSxNQUFBLFFBQUEsV0FBQSxtQkFBQSxLQUFBO0dBQ0EsSUFBQSxTQUFBLG1CQUFBLGVBQUE7R0FDQSxJQUFBLFFBQUE7R0FDQSxJQUFBLFdBQUEsU0FBQSxHQUFBLFlBQUEsV0FBQSxPQUFBLFlBQUE7O0dBRUEsSUFBQSxRQUFBLFVBQUEsbUJBQUEsUUFBQSxZQUFBLE9BQUEsbUJBQUEsUUFBQSxXQUFBLEtBQUEsT0FBQSxtQkFBQSxRQUFBLFdBQUEsS0FBQSxNQUFBLG1CQUFBLFFBQUEsV0FBQSxLQUFBO0dBQ0EsTUFBQSxRQUFBO0dBQ0EsTUFBQSxVQUFBO0lBQ0EsT0FBQTtJQUNBLE1BQUE7O0dBRUEsTUFBQSxXQUFBO0lBQ0EsT0FBQTtJQUNBLFNBQUE7S0FDQSxPQUFBO0tBQ0EsTUFBQTs7O0dBR0EsT0FBQTs7Ozs7O0FDckdBLENBQUEsWUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLGtIQUFBLFVBQUEsU0FBQSxRQUFBLFlBQUEsUUFBQSxXQUFBLG9CQUFBLGFBQUE7OztFQUdBLElBQUEsS0FBQTtFQUNBLEdBQUEsUUFBQTtFQUNBLEdBQUEsWUFBQTtFQUNBLEdBQUEsWUFBQTtFQUNBLEdBQUEsY0FBQSxHQUFBLE1BQUEsU0FBQSxPQUFBLENBQUEsR0FBQSxJQUFBLE1BQUEsQ0FBQSxHQUFBO0VBQ0EsR0FBQSxTQUFBLENBQUEsV0FBQSxXQUFBLFdBQUEsV0FBQTtFQUNBLEdBQUEsY0FBQTtHQUNBLFlBQUE7R0FDQSxZQUFBO0dBQ0EsVUFBQTs7RUFFQSxHQUFBLFNBQUE7R0FDQSxVQUFBO0dBQ0EsTUFBQTs7RUFFQSxHQUFBLGdCQUFBO0VBQ0EsR0FBQSxzQkFBQTtHQUNBLFNBQUE7R0FDQSxLQUFBO0dBQ0EsS0FBQTtHQUNBLE1BQUE7R0FDQSxVQUFBOztFQUVBLEdBQUEsWUFBQSxDQUFBO0dBQ0EsT0FBQTtHQUNBLE9BQUE7R0FDQSxPQUFBLEdBQUEsT0FBQTtLQUNBO0dBQ0EsT0FBQTtHQUNBLE9BQUE7R0FDQSxPQUFBLEdBQUEsT0FBQTtLQUNBO0dBQ0EsT0FBQTtHQUNBLE9BQUE7R0FDQSxPQUFBLEdBQUEsT0FBQTtLQUNBO0dBQ0EsT0FBQTtHQUNBLE9BQUE7R0FDQSxPQUFBLEdBQUEsT0FBQTtLQUNBO0dBQ0EsT0FBQTtHQUNBLE9BQUE7R0FDQSxPQUFBLEdBQUEsT0FBQTs7O0VBR0EsR0FBQSxnQkFBQSxDQUFBO0dBQ0EsTUFBQTtHQUNBLE9BQUE7R0FDQSxPQUFBO0tBQ0E7R0FDQSxNQUFBO0dBQ0EsT0FBQTtHQUNBLE9BQUE7S0FDQTtHQUNBLE1BQUE7R0FDQSxPQUFBO0dBQ0EsT0FBQTs7O0VBR0E7O0VBRUEsU0FBQSxXQUFBO0dBQ0EsbUJBQUEsU0FBQTtHQUNBLG1CQUFBLGFBQUE7R0FDQSxtQkFBQSxRQUFBLEdBQUEsV0FBQSxHQUFBLFFBQUE7O0dBRUE7Ozs7RUFJQSxTQUFBLGtCQUFBO0dBQ0EsUUFBQSxRQUFBLEdBQUEsV0FBQSxVQUFBLFFBQUE7O0lBRUEsUUFBQSxRQUFBLE9BQUEsV0FBQSxVQUFBLFVBQUE7S0FDQSxHQUFBO0tBQ0EsUUFBQSxTQUFBO0tBQ0EsS0FBQTtNQUNBLEdBQUEsY0FBQSxHQUFBO01BQ0E7S0FDQSxLQUFBO01BQ0EsR0FBQSxjQUFBLEdBQUE7TUFDQTtLQUNBLEtBQUE7TUFDQSxHQUFBLGNBQUEsR0FBQTtNQUNBO0tBQ0E7OztLQUdBLFFBQUEsU0FBQTtLQUNBLEtBQUE7TUFDQSxHQUFBLG9CQUFBO01BQ0EsR0FBQSxVQUFBLEdBQUE7TUFDQTtLQUNBLEtBQUE7TUFDQSxHQUFBLG9CQUFBO01BQ0EsR0FBQSxVQUFBLEdBQUE7TUFDQTtLQUNBLEtBQUE7TUFDQSxHQUFBLG9CQUFBO01BQ0EsR0FBQSxVQUFBLEdBQUE7TUFDQTtLQUNBLEtBQUE7TUFDQSxHQUFBLG9CQUFBO01BQ0EsR0FBQSxVQUFBLEdBQUE7TUFDQTtLQUNBLEtBQUE7TUFDQSxHQUFBLG9CQUFBO01BQ0EsR0FBQSxVQUFBLEdBQUE7TUFDQTtLQUNBOzs7O0dBSUEsR0FBQSxRQUFBOzs7RUFHQSxTQUFBLGFBQUEsS0FBQSxHQUFBOztHQUVBLElBQUEsVUFBQSxtQkFBQSxlQUFBLElBQUEsUUFBQSxXQUFBO0dBQ0EsSUFBQSxPQUFBLFFBQUEsZ0JBQUEsYUFBQTtJQUNBLG1CQUFBLGNBQUEsUUFBQTtJQUNBLE9BQUEsR0FBQSw0QkFBQSxDQUFBLElBQUEsUUFBQTs7O0VBR0EsU0FBQSxjQUFBLFFBQUE7R0FDQSxJQUFBLFFBQUE7R0FDQSxJQUFBLE1BQUEsUUFBQSxXQUFBLG1CQUFBLEtBQUE7R0FDQSxJQUFBLFNBQUEsbUJBQUEsZUFBQTtHQUNBLElBQUEsUUFBQTtHQUNBLElBQUEsV0FBQSxTQUFBLEdBQUEsWUFBQSxXQUFBLE9BQUEsWUFBQTs7R0FFQSxJQUFBLFFBQUEsVUFBQSxtQkFBQSxRQUFBLFlBQUEsT0FBQSxtQkFBQSxRQUFBLFdBQUEsS0FBQSxPQUFBLG1CQUFBLFFBQUEsV0FBQSxLQUFBLE1BQUEsbUJBQUEsUUFBQSxXQUFBLEtBQUE7R0FDQSxNQUFBLFFBQUE7R0FDQSxNQUFBLFVBQUE7SUFDQSxPQUFBO0lBQ0EsTUFBQTs7R0FFQSxNQUFBLFdBQUE7SUFDQSxPQUFBO0lBQ0EsU0FBQTtLQUNBLE9BQUE7S0FDQSxNQUFBOzs7R0FHQSxPQUFBOztFQUVBLFNBQUEsZUFBQSxTQUFBO0dBQ0EsSUFBQSxRQUFBO0dBQ0EsSUFBQSxNQUFBLFFBQUEsV0FBQSxtQkFBQSxLQUFBO0dBQ0EsSUFBQSxTQUFBLG1CQUFBLGVBQUE7O0dBRUEsSUFBQSxRQUFBO0dBQ0EsSUFBQSxPQUFBLFFBQUE7R0FDQSxRQUFBLFdBQUE7O0dBRUEsUUFBQTtHQUNBLEtBQUE7SUFDQSxJQUFBLE9BQUEsT0FBQSxVQUFBLGVBQUEsT0FBQSxVQUFBLE1BQUE7S0FDQSxJQUFBLFdBQUEsU0FBQSxHQUFBLFlBQUEsV0FBQSxPQUFBLFlBQUE7S0FDQSxJQUFBLFFBQUEsVUFBQSxtQkFBQSxRQUFBLFlBQUEsT0FBQSxtQkFBQSxRQUFBLFdBQUEsS0FBQSxPQUFBLG1CQUFBLFFBQUEsV0FBQSxLQUFBLE1BQUEsbUJBQUEsUUFBQSxXQUFBLEtBQUE7TUFDQSxNQUFBLFFBQUEsVUFBQSxtQkFBQSxRQUFBLFlBQUEsT0FBQSxtQkFBQSxRQUFBLFdBQUEsS0FBQSxPQUFBLG1CQUFBLFFBQUEsV0FBQSxLQUFBO01BQ0EsTUFBQSxVQUFBO09BQ0EsT0FBQTtPQUNBLE1BQUE7O0tBRUEsTUFBQSxXQUFBO01BQ0EsT0FBQSxVQUFBLG1CQUFBLFFBQUEsWUFBQSxPQUFBLG1CQUFBLFFBQUEsV0FBQSxLQUFBLE9BQUEsbUJBQUEsUUFBQSxXQUFBLEtBQUEsTUFBQSxtQkFBQSxRQUFBLFdBQUEsS0FBQTtNQUNBLFNBQUE7T0FDQSxPQUFBO09BQ0EsTUFBQTs7OztXQUlBO0tBQ0EsTUFBQSxRQUFBO0tBQ0EsTUFBQSxVQUFBO01BQ0EsT0FBQTtNQUNBLE1BQUE7Ozs7SUFJQTs7R0FFQSxPQUFBO0dBQ0E7Ozs7O0FDOUxBLENBQUEsV0FBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLDBDQUFBLFNBQUEsWUFBQSxTQUFBOztFQUVBLElBQUEsS0FBQTtFQUNBLEdBQUEsYUFBQTtFQUNBLEdBQUEsVUFBQTs7O0FDUEEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsZ0hBQUEsU0FBQSxRQUFBLGFBQUEsT0FBQSxlQUFBLFlBQUEsT0FBQSxRQUFBLFNBQUE7O0VBRUEsSUFBQSxLQUFBO0VBQ0EsV0FBQSxrQkFBQTtFQUNBLEdBQUEsVUFBQTtFQUNBLEdBQUEsV0FBQTtFQUNBLEdBQUEsV0FBQTtFQUNBLEdBQUEsYUFBQTtFQUNBLEdBQUEsZUFBQSxTQUFBLFNBQUE7R0FDQSxNQUFBLGFBQUE7O0VBRUEsU0FBQSxpQkFBQTtJQUNBLE9BQUEsTUFBQTs7RUFFQSxTQUFBLFNBQUE7R0FDQSxNQUFBLE1BQUEsR0FBQSxNQUFBLEtBQUEsU0FBQSxTQUFBO0lBQ0EsT0FBQSxRQUFBOztNQUVBLE1BQUEsU0FBQSxTQUFBO0lBQ0EsT0FBQSxNQUFBLHdDQUFBOzs7RUFHQSxTQUFBLFVBQUE7R0FDQSxHQUFBLE1BQUEsa0JBQUE7SUFDQSxNQUFBLFNBQUEsS0FBQSxTQUFBLEtBQUE7S0FDQSxHQUFBLE9BQUEsUUFBQSxLQUFBO01BQ0EsT0FBQSxHQUFBOztLQUVBLE9BQUEsUUFBQTtPQUNBLE1BQUEsU0FBQSxTQUFBOzs7Ozs7SUFNQSxTQUFBLFNBQUEsYUFBQSxJQUFBO01BQ0EsWUFBQTtLQUNBO0VBQ0EsU0FBQSxZQUFBO0dBQ0EsV0FBQSxjQUFBLENBQUEsV0FBQTtHQUNBLGNBQUEsV0FBQSxXQUFBO0dBQ0E7O0VBRUEsU0FBQSxjQUFBO0dBQ0EsU0FBQSxVQUFBO0lBQ0EsWUFBQSxPQUFBLE9BQUEsS0FBQSxVQUFBLEtBQUE7S0FDQSxJQUFBOztNQUVBOztFQUVBLFdBQUEsY0FBQTtFQUNBLE9BQUEsT0FBQSxVQUFBO0dBQ0EsT0FBQSxXQUFBO0tBQ0EsU0FBQSxRQUFBO0dBQ0EsT0FBQSxlQUFBLFdBQUE7O0VBRUEsT0FBQSxPQUFBLHFCQUFBLFNBQUEsRUFBQSxFQUFBO0dBQ0EsR0FBQSxLQUFBLEdBQUEsT0FBQTtHQUNBOzs7Ozs7QUM3REEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsNEJBQUEsU0FBQSxZQUFBO1FBQ0EsSUFBQSxLQUFBO1FBQ0EsWUFBQSxPQUFBLFNBQUEsQ0FBQSxhQUFBLE9BQUEsS0FBQSxTQUFBLFNBQUE7VUFDQSxHQUFBLFVBQUE7Ozs7Ozs7QUNOQSxDQUFBLFlBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSwrQkFBQSxVQUFBLFdBQUE7RUFDQSxLQUFBLFdBQUE7R0FDQSxhQUFBO0dBQ0EsV0FBQTtHQUNBLHlCQUFBO0dBQ0Esa0JBQUE7OztFQUdBLEtBQUEsZUFBQSxVQUFBLE1BQUEsSUFBQTtHQUNBLFVBQUEsS0FBQSxVQUFBO0tBQ0EsTUFBQTtLQUNBLFFBQUEsd0JBQUEsT0FBQTtLQUNBLEdBQUE7S0FDQSxZQUFBOzs7O0lBSUEsS0FBQSxnQkFBQSxXQUFBO0dBQ0EsVUFBQSxLQUFBOztLQUVBLGFBQUE7U0FDQSxrQkFBQTs7S0FFQSxLQUFBLFVBQUEsUUFBQTs7T0FFQSxZQUFBOzs7Ozs7Ozs7QUM1QkEsQ0FBQSxXQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEscUtBQUEsU0FBQSxRQUFBLFNBQUEsWUFBQSxTQUFBLFFBQUEsVUFBQSxRQUFBLG9CQUFBLE1BQUEsV0FBQSxhQUFBLGFBQUE7O0VBRUEsSUFBQSxLQUFBO0VBQ0EsR0FBQSxNQUFBOztFQUVBLEdBQUEsYUFBQSxLQUFBLFNBQUE7RUFDQSxHQUFBLGtCQUFBLEtBQUEsU0FBQTtFQUNBLEdBQUEsY0FBQTs7RUFFQSxHQUFBLFlBQUE7RUFDQSxHQUFBLGFBQUEsbUJBQUE7RUFDQSxHQUFBLGtCQUFBLG1CQUFBO0VBQ0EsR0FBQSxzQkFBQSxHQUFBLGtCQUFBO0VBQ0EsR0FBQSxZQUFBLG1CQUFBLEtBQUE7RUFDQSxHQUFBLGFBQUE7RUFDQSxHQUFBLGNBQUE7RUFDQSxHQUFBLFVBQUE7RUFDQSxHQUFBLGFBQUE7RUFDQSxHQUFBLGVBQUE7RUFDQSxHQUFBLFlBQUE7RUFDQSxHQUFBLE9BQUE7RUFDQSxHQUFBLFlBQUE7RUFDQSxHQUFBLFVBQUE7R0FDQSxRQUFBO0dBQ0EsV0FBQTs7RUFFQSxHQUFBLFVBQUE7R0FDQSxhQUFBOzs7O0VBSUEsR0FBQSxpQkFBQTtFQUNBLEdBQUEsU0FBQTtFQUNBLEdBQUEsV0FBQTtFQUNBLEdBQUEsYUFBQTtFQUNBLEdBQUEscUJBQUE7RUFDQSxHQUFBLFVBQUE7RUFDQSxHQUFBLFlBQUE7RUFDQSxHQUFBLGNBQUE7O0VBRUEsR0FBQSxrQkFBQTtFQUNBLEdBQUEsYUFBQTtFQUNBLEdBQUEsYUFBQTtFQUNBLEdBQUEsZ0JBQUE7RUFDQSxHQUFBLG1CQUFBO0VBQ0EsR0FBQSxxQkFBQTtFQUNBLEdBQUEsaUJBQUE7RUFDQSxHQUFBLFNBQUE7RUFDQSxHQUFBLFlBQUE7O0VBRUEsR0FBQSxXQUFBOztFQUVBLEdBQUEsWUFBQTs7RUFFQTs7RUFFQSxTQUFBLFdBQUE7O0dBRUEsR0FBQSxnQkFBQSxLQUFBLFNBQUEsV0FBQTtJQUNBLEdBQUEsV0FBQSxLQUFBLFNBQUEsTUFBQTtLQUNBLEdBQUEsT0FBQTtLQUNBLEdBQUEsWUFBQTtLQUNBLElBQUEsQ0FBQSxHQUFBLFVBQUEsT0FBQTtNQUNBLEdBQUEsVUFBQSxRQUFBO09BQ0EsUUFBQTtPQUNBLFNBQUE7T0FDQSxjQUFBOzs7S0FHQSxhQUFBLEdBQUEsVUFBQSxNQUFBO0tBQ0E7S0FDQSxJQUFBLE9BQUEsT0FBQSxNQUFBO01BQ0EsR0FBQSxTQUFBLE9BQUEsT0FBQTtNQUNBOztLQUVBLElBQUEsT0FBQSxPQUFBLFdBQUE7TUFDQSxHQUFBLE9BQUE7TUFDQSxHQUFBLFFBQUEsVUFBQSxLQUFBLEdBQUE7TUFDQSxHQUFBLFFBQUEsU0FBQTtNQUNBLFdBQUEsU0FBQTtNQUNBLElBQUEsWUFBQSxPQUFBLE9BQUEsVUFBQSxNQUFBO01BQ0EsUUFBQSxRQUFBLFdBQUEsU0FBQSxLQUFBO09BQ0EsR0FBQSxRQUFBLFVBQUEsS0FBQSxlQUFBOzs7TUFHQSxVQUFBLEtBQUEsR0FBQSxRQUFBO01BQ0EsWUFBQSxPQUFBLGtCQUFBLFdBQUEsS0FBQSxTQUFBLE1BQUE7T0FDQSxHQUFBLE9BQUE7Ozs7Ozs7O0VBUUEsU0FBQSxTQUFBO0dBQ0EsUUFBQSxRQUFBOztFQUVBLFNBQUEsVUFBQSxLQUFBO0dBQ0EsUUFBQSxJQUFBO0dBQ0EsT0FBQSxHQUFBLDBCQUFBO0lBQ0EsTUFBQSxLQUFBO0lBQ0EsS0FBQSxPQUFBLE9BQUE7OztFQUdBLFNBQUEsV0FBQTtHQUNBLElBQUEsY0FBQTtHQUNBLFFBQUEsUUFBQSxHQUFBLFVBQUEsVUFBQSxTQUFBLE1BQUE7SUFDQSxHQUFBLE1BQUEsU0FBQSxTQUFBLEVBQUE7S0FDQSxjQUFBOzs7R0FHQSxPQUFBOztFQUVBLFNBQUEsZUFBQSxTQUFBO0dBQ0EsSUFBQSxXQUFBLE1BQUEsR0FBQSxjQUFBLElBQUE7SUFDQSxHQUFBLGFBQUE7VUFDQTtJQUNBLEdBQUEsYUFBQTs7R0FFQSxHQUFBLGVBQUEsR0FBQSxhQUFBLGtCQUFBO0dBQ0E7O0VBRUEsU0FBQSxTQUFBLE1BQUE7R0FDQSxHQUFBLFdBQUEsZUFBQTtHQUNBLGdCQUFBO0dBQ0E7O0VBRUEsU0FBQSxhQUFBO0dBQ0EsR0FBQSxZQUFBLENBQUEsR0FBQTtHQUNBLEdBQUEsWUFBQSxHQUFBLGFBQUEsT0FBQSxpQkFBQTs7O0VBR0EsU0FBQSxXQUFBLEtBQUE7R0FDQSxHQUFBLFVBQUE7R0FDQSxHQUFBO0dBQ0E7O0VBRUEsU0FBQSxtQkFBQSxLQUFBO0dBQ0EsSUFBQSxHQUFBLFdBQUE7SUFDQSxTQUFBLFdBQUE7S0FDQSxHQUFBLFVBQUEsT0FBQSxHQUFBLHFCQUFBLFNBQUEsR0FBQSxRQUFBLEtBQUEsV0FBQTs7O0dBR0E7OztFQUdBLFNBQUEsV0FBQTtHQUNBLElBQUEsQ0FBQSxHQUFBLFNBQUE7SUFDQTs7R0FFQSxJQUFBLE9BQUE7R0FDQSxJQUFBLE9BQUE7R0FDQSxRQUFBLFFBQUEsR0FBQSxNQUFBLFNBQUEsTUFBQTtJQUNBLEtBQUEsR0FBQSxVQUFBLFFBQUEsV0FBQSxLQUFBLEdBQUEsVUFBQTtJQUNBLEtBQUEsV0FBQSxXQUFBLEtBQUEsR0FBQSxVQUFBOzs7R0FHQSxPQUFBLEdBQUEsS0FBQSxRQUFBLEdBQUEsV0FBQTtHQUNBLEdBQUEsUUFBQSxHQUFBLFVBQUEsT0FBQSxXQUFBO0dBQ0EsR0FBQSxnQkFBQTtJQUNBLE9BQUEsR0FBQSxVQUFBLE1BQUEsY0FBQTtJQUNBLE9BQUEsR0FBQSxVQUFBLE9BQUE7SUFDQSxNQUFBLEdBQUEsS0FBQTs7O0dBR0EsT0FBQTs7O0VBR0EsU0FBQSxRQUFBLFNBQUE7O0dBRUEsSUFBQSxPQUFBLEdBQUEsS0FBQSxRQUFBLFdBQUE7R0FDQSxPQUFBOzs7O0VBSUEsU0FBQSxhQUFBO0dBQ0EsR0FBQSxPQUFBLENBQUEsR0FBQTtHQUNBOzs7RUFHQSxTQUFBLGdCQUFBO0dBQ0EsT0FBQSxHQUFBLFVBQUEsQ0FBQSxHQUFBO0dBQ0E7OztFQUdBLFNBQUEsZ0JBQUEsS0FBQTtHQUNBLFlBQUEsT0FBQSxXQUFBLE9BQUEsT0FBQSxPQUFBLEtBQUEsS0FBQSxTQUFBLE1BQUE7SUFDQSxHQUFBLFFBQUEsT0FBQTtJQUNBLGVBQUE7Ozs7O0VBS0EsU0FBQSxlQUFBLEtBQUE7R0FDQSxJQUFBLENBQUEsT0FBQSxPQUFBLFdBQUE7SUFDQSxZQUFBLE9BQUEsa0JBQUEsQ0FBQSxNQUFBLEtBQUEsU0FBQSxNQUFBO0tBQ0EsR0FBQSxPQUFBOzs7Ozs7RUFNQSxTQUFBLGdCQUFBLE1BQUE7R0FDQSxJQUFBLFFBQUEsQ0FBQSxHQUFBLFFBQUEsVUFBQSxDQUFBLFFBQUEsR0FBQSxRQUFBLFFBQUE7SUFDQSxHQUFBOzs7O0VBSUEsU0FBQSxtQkFBQTtHQUNBLEdBQUEsUUFBQSxZQUFBLENBQUEsR0FBQTtHQUNBLEdBQUEsUUFBQSxTQUFBLENBQUEsR0FBQSxRQUFBO0dBQ0EsSUFBQSxHQUFBLFFBQUEsUUFBQTtJQUNBLEdBQUEsT0FBQTtJQUNBLFdBQUEsU0FBQTtJQUNBLEdBQUEsVUFBQSxRQUFBLGNBQUE7SUFDQSxHQUFBLFVBQUEsU0FBQTs7VUFFQTtJQUNBLFdBQUEsU0FBQTtJQUNBLFFBQUEsUUFBQSxHQUFBLFVBQUEsT0FBQSxHQUFBLHFCQUFBLFVBQUEsU0FBQSxTQUFBO0tBQ0EsUUFBQSxXQUFBOztJQUVBLEdBQUEsVUFBQSxPQUFBLEdBQUEscUJBQUEsU0FBQSxHQUFBLFFBQUEsS0FBQSxXQUFBO0lBQ0EsR0FBQSxVQUFBLFFBQUEsY0FBQTtJQUNBLEdBQUEsVUFBQSxTQUFBO0lBQ0EsWUFBQSxPQUFBLGtCQUFBLENBQUEsR0FBQSxRQUFBLE1BQUEsS0FBQSxTQUFBLE1BQUE7S0FDQSxHQUFBLE9BQUE7O0lBRUEsT0FBQSxHQUFBLDJCQUFBO0tBQ0EsT0FBQSxPQUFBLE9BQUE7S0FDQSxNQUFBLE9BQUEsT0FBQTs7OztHQUlBOztFQUVBLFNBQUEsbUJBQUEsU0FBQTtHQUNBLElBQUEsUUFBQTtHQUNBLFFBQUEsUUFBQSxHQUFBLFFBQUEsV0FBQSxTQUFBLEtBQUEsS0FBQTtJQUNBLElBQUEsV0FBQSxPQUFBLE9BQUEsR0FBQSxTQUFBO0tBQ0EsR0FBQSxRQUFBLFVBQUEsT0FBQSxLQUFBO0tBQ0EsUUFBQTs7O0dBR0EsSUFBQSxDQUFBLE9BQUE7SUFDQSxHQUFBLFFBQUEsVUFBQSxLQUFBO0lBQ0E7R0FDQSxJQUFBLE9BQUE7R0FDQSxJQUFBLFVBQUE7R0FDQSxRQUFBLFFBQUEsR0FBQSxRQUFBLFdBQUEsU0FBQSxNQUFBLEtBQUE7SUFDQSxLQUFBLEtBQUEsS0FBQTtJQUNBLElBQUEsS0FBQSxHQUFBLFVBQUEsUUFBQSxHQUFBLFFBQUEsS0FBQTtLQUNBLFFBQUEsS0FBQSxLQUFBOzs7R0FHQSxJQUFBLEtBQUEsU0FBQSxHQUFBO0lBQ0EsWUFBQSxPQUFBLGtCQUFBLE1BQUEsS0FBQSxTQUFBLE1BQUE7S0FDQSxHQUFBLE9BQUE7O0lBRUEsT0FBQSxHQUFBLG1DQUFBO0tBQ0EsT0FBQSxPQUFBLE9BQUE7S0FDQSxNQUFBLE9BQUEsT0FBQTtLQUNBLFdBQUEsUUFBQSxLQUFBOzs7O0dBSUEsT0FBQSxDQUFBO0dBQ0E7OztFQUdBLFNBQUEsWUFBQTtHQUNBLElBQUEsQ0FBQSxHQUFBLFNBQUE7SUFDQSxPQUFBOzs7R0FHQSxPQUFBLENBQUEsR0FBQSxRQUFBLEdBQUEsV0FBQSxLQUFBO0dBQ0E7OztFQUdBLFNBQUEsY0FBQTtHQUNBLElBQUEsQ0FBQSxHQUFBLFNBQUE7SUFDQSxPQUFBOztHQUVBLE9BQUEsR0FBQSxRQUFBLGlCQUFBLElBQUEsa0JBQUE7R0FDQTs7O0VBR0EsU0FBQSxPQUFBLEdBQUE7Ozs7RUFJQSxTQUFBLFVBQUEsTUFBQTtHQUNBLElBQUEsUUFBQTtHQUNBLFFBQUEsUUFBQSxLQUFBLFVBQUEsU0FBQSxNQUFBO0lBQ0EsSUFBQSxLQUFBLGVBQUEsR0FBQSxRQUFBLFlBQUEsTUFBQTtLQUNBLEdBQUEsYUFBQTs7SUFFQSxVQUFBOztHQUVBLE9BQUE7OztFQUdBLFNBQUEsV0FBQTtHQUNBLFVBQUEsR0FBQTtHQUNBOzs7RUFHQSxTQUFBLGdCQUFBLE1BQUE7R0FDQSxJQUFBLFNBQUE7R0FDQSxRQUFBLFFBQUEsR0FBQSxNQUFBLFNBQUEsS0FBQTtJQUNBLElBQUEsSUFBQSxXQUFBLE1BQUE7S0FDQSxTQUFBOzs7R0FHQSxPQUFBO0dBQ0E7OztFQUdBLFNBQUEsZUFBQSxLQUFBO0dBQ0EsSUFBQSxTQUFBO0dBQ0EsUUFBQSxRQUFBLEdBQUEsTUFBQSxTQUFBLEtBQUE7SUFDQSxJQUFBLElBQUEsT0FBQSxLQUFBO0tBQ0EsU0FBQTs7OztHQUlBLE9BQUE7R0FDQTs7O0VBR0EsU0FBQSxhQUFBLE9BQUE7O0dBRUEsR0FBQSxTQUFBLFNBQUEsY0FBQTtHQUNBLEdBQUEsT0FBQSxRQUFBO0dBQ0EsR0FBQSxPQUFBLFNBQUE7R0FDQSxHQUFBLE1BQUEsR0FBQSxPQUFBLFdBQUE7R0FDQSxJQUFBLFdBQUEsR0FBQSxJQUFBLHFCQUFBLEdBQUEsR0FBQSxLQUFBO0dBQ0EsU0FBQSxhQUFBLEdBQUE7R0FDQSxTQUFBLGFBQUEsTUFBQSxTQUFBO0dBQ0EsU0FBQSxhQUFBLEdBQUE7R0FDQSxHQUFBLElBQUEsWUFBQTtHQUNBLEdBQUEsSUFBQSxTQUFBLEdBQUEsR0FBQSxLQUFBO0dBQ0EsR0FBQSxVQUFBLEdBQUEsSUFBQSxhQUFBLEdBQUEsR0FBQSxLQUFBLEdBQUE7Ozs7O0VBS0EsU0FBQSxhQUFBLE9BQUE7R0FDQSxJQUFBLFdBQUEsR0FBQSxJQUFBLHFCQUFBLEdBQUEsR0FBQSxLQUFBO0dBQ0EsU0FBQSxhQUFBLEdBQUE7R0FDQSxTQUFBLGFBQUEsTUFBQSxTQUFBO0dBQ0EsU0FBQSxhQUFBLEdBQUE7R0FDQSxHQUFBLElBQUEsWUFBQTtHQUNBLEdBQUEsSUFBQSxTQUFBLEdBQUEsR0FBQSxLQUFBO0dBQ0EsR0FBQSxVQUFBLEdBQUEsSUFBQSxhQUFBLEdBQUEsR0FBQSxLQUFBLEdBQUE7O0dBRUE7OztFQUdBLFNBQUEsY0FBQSxTQUFBO0dBQ0EsSUFBQSxRQUFBO0dBQ0EsSUFBQSxNQUFBLFFBQUEsV0FBQSxHQUFBO0dBQ0EsSUFBQSxTQUFBLGVBQUE7R0FDQSxJQUFBLFFBQUEsR0FBQSxVQUFBLFFBQUE7OztHQUdBLElBQUEsV0FBQSxTQUFBLE1BQUEsTUFBQSxPQUFBLFVBQUE7O0dBRUEsSUFBQSxRQUFBLFVBQUEsR0FBQSxRQUFBLFlBQUEsT0FBQSxHQUFBLFFBQUEsV0FBQSxLQUFBLE9BQUEsR0FBQSxRQUFBLFdBQUEsS0FBQSxNQUFBLEdBQUEsUUFBQSxXQUFBLEtBQUE7R0FDQSxNQUFBLFFBQUE7R0FDQSxNQUFBLFVBQUE7SUFDQSxPQUFBO0lBQ0EsTUFBQTs7R0FFQSxNQUFBLFdBQUE7SUFDQSxPQUFBO0lBQ0EsU0FBQTtLQUNBLE9BQUE7S0FDQSxNQUFBOzs7R0FHQSxPQUFBO0dBQ0E7OztFQUdBLFNBQUEsZUFBQSxTQUFBOztHQUVBLElBQUEsUUFBQTtHQUNBLElBQUEsTUFBQSxRQUFBLFdBQUEsR0FBQTs7R0FFQSxJQUFBLFNBQUEsZUFBQTtHQUNBLElBQUEsUUFBQSxHQUFBLFVBQUEsUUFBQTtHQUNBLElBQUEsT0FBQSxRQUFBO0dBQ0EsSUFBQSxPQUFBLEdBQUEsUUFBQSxLQUFBO0lBQ0EsUUFBQSxXQUFBOzs7R0FHQSxRQUFBO0lBQ0EsS0FBQTtLQUNBLElBQUEsT0FBQSxPQUFBLFVBQUEsYUFBQTs7O01BR0EsSUFBQSxXQUFBLFNBQUEsTUFBQSxNQUFBLFNBQUEsT0FBQSxXQUFBOztNQUVBLElBQUEsUUFBQSxVQUFBLEdBQUEsUUFBQSxZQUFBLE9BQUEsR0FBQSxRQUFBLFdBQUEsS0FBQSxPQUFBLEdBQUEsUUFBQSxXQUFBLEtBQUEsTUFBQSxHQUFBLFFBQUEsV0FBQSxLQUFBO01BQ0EsTUFBQSxRQUFBLFVBQUEsR0FBQSxRQUFBLFlBQUEsT0FBQSxHQUFBLFFBQUEsV0FBQSxLQUFBLE9BQUEsR0FBQSxRQUFBLFdBQUEsS0FBQTtNQUNBLE1BQUEsVUFBQTtPQUNBLE9BQUE7T0FDQSxNQUFBOztNQUVBLE1BQUEsV0FBQTtPQUNBLE9BQUEsVUFBQSxHQUFBLFFBQUEsWUFBQSxPQUFBLEdBQUEsUUFBQSxXQUFBLEtBQUEsT0FBQSxHQUFBLFFBQUEsV0FBQSxLQUFBO09BQ0EsU0FBQTtRQUNBLE9BQUE7UUFDQSxNQUFBOzs7TUFHQTtZQUNBOztNQUVBLE1BQUEsUUFBQTtNQUNBLE1BQUEsVUFBQTtPQUNBLE9BQUE7T0FDQSxNQUFBOzs7OztHQUtBLElBQUEsUUFBQSxNQUFBLFNBQUEsbUJBQUEsWUFBQSxTQUFBO0lBQ0EsTUFBQSxjQUFBLFdBQUE7S0FDQSxJQUFBLFFBQUE7TUFDQSxNQUFBLFFBQUEsV0FBQTtNQUNBLFVBQUEsQ0FBQSxLQUFBO01BQ0EsVUFBQTs7S0FFQSxPQUFBOzs7R0FHQSxPQUFBO0dBQ0E7O0VBRUEsT0FBQSxPQUFBLGNBQUEsU0FBQSxHQUFBLEdBQUE7R0FDQSxJQUFBLE1BQUEsR0FBQTtJQUNBOzs7R0FHQSxJQUFBLEVBQUEsS0FBQTtJQUNBLElBQUEsRUFBQSxLQUFBO0tBQ0EsR0FBQSxVQUFBLE9BQUEsR0FBQSxxQkFBQSxTQUFBLEVBQUEsS0FBQSxXQUFBOztJQUVBO0lBQ0EsZ0JBQUEsRUFBQTtJQUNBLEdBQUEsVUFBQSxPQUFBLEdBQUEscUJBQUEsU0FBQSxFQUFBLEtBQUEsV0FBQTtJQUNBLElBQUEsT0FBQSxRQUFBLFFBQUEsNkJBQUEsT0FBQSxRQUFBLFFBQUEsa0JBQUE7S0FDQSxPQUFBLEdBQUEsMkJBQUE7TUFDQSxPQUFBLE9BQUEsT0FBQTtNQUNBLE1BQUEsRUFBQTs7O1VBR0E7SUFDQSxPQUFBLEdBQUEsa0JBQUE7S0FDQSxPQUFBLE9BQUEsT0FBQTs7OztFQUlBLE9BQUEsT0FBQSwwQkFBQSxTQUFBLEdBQUEsR0FBQTtHQUNBLElBQUEsTUFBQSxHQUFBO0lBQ0E7O0dBRUEsUUFBQSxJQUFBO0dBQ0EsSUFBQSxFQUFBO0lBQ0EsYUFBQSxFQUFBO1FBQ0E7SUFDQSxhQUFBO0lBQ0E7R0FDQSxHQUFBOzs7Ozs7Ozs7Ozs7O0dBYUEsSUFBQSxHQUFBLFFBQUEsS0FBQTtJQUNBLElBQUEsT0FBQSxPQUFBLFdBQUE7S0FDQSxPQUFBLEdBQUEsbUNBQUE7TUFDQSxPQUFBLEVBQUE7TUFDQSxNQUFBLEdBQUEsUUFBQTtNQUNBLFdBQUEsT0FBQSxPQUFBOztXQUVBO0tBQ0EsT0FBQSxHQUFBLDJCQUFBO01BQ0EsT0FBQSxFQUFBO01BQ0EsTUFBQSxHQUFBLFFBQUE7OztVQUdBO0lBQ0EsT0FBQSxHQUFBLGtCQUFBO0tBQ0EsT0FBQSxFQUFBOzs7Ozs7O0VBT0EsT0FBQSxPQUFBLFdBQUEsU0FBQSxHQUFBLEdBQUE7R0FDQSxJQUFBLE1BQUEsR0FBQTtJQUNBOzs7Ozs7OztHQVFBLElBQUEsWUFBQSxFQUFBLE9BQUEsRUFBQSxZQUFBLEdBQUEsR0FBQSxJQUFBLEVBQUEsWUFBQSxHQUFBLEdBQUE7SUFDQSxZQUFBLEVBQUEsT0FBQSxFQUFBLFlBQUEsR0FBQSxHQUFBLElBQUEsRUFBQSxZQUFBLEdBQUEsR0FBQTtJQUNBLFNBQUEsRUFBQSxhQUFBLFdBQUE7O0dBRUEsSUFBQSxNQUFBO0lBQ0EsQ0FBQSxHQUFBO0lBQ0EsQ0FBQSxLQUFBOztHQUVBLElBQUEsR0FBQSxRQUFBLFFBQUE7SUFDQSxNQUFBO0tBQ0EsQ0FBQSxHQUFBO0tBQ0EsQ0FBQSxHQUFBOzs7R0FHQSxHQUFBLElBQUEsVUFBQSxRQUFBO0lBQ0EsU0FBQSxJQUFBO0lBQ0EsU0FBQTs7OztFQUlBLE9BQUEsSUFBQSx1QkFBQSxTQUFBLE9BQUEsU0FBQSxVQUFBLFdBQUEsWUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7RUFtQ0EsU0FBQSxnQkFBQTtHQUNBLFlBQUEsT0FBQSxPQUFBLEtBQUEsU0FBQSxLQUFBO0lBQ0EsR0FBQSxNQUFBO0lBQ0EsR0FBQSxZQUFBLG1CQUFBO0lBQ0EsU0FBQSxXQUFBO0tBQ0EsSUFBQSxPQUFBLE9BQUEsV0FBQTtNQUNBLEdBQUEsVUFBQSxRQUFBLGNBQUE7TUFDQSxHQUFBLFVBQUEsU0FBQTtNQUNBLEdBQUEsVUFBQSxPQUFBLEdBQUEscUJBQUEsU0FBQSxHQUFBLFFBQUEsS0FBQSxXQUFBO01BQ0EsSUFBQSxZQUFBLE9BQUEsT0FBQSxVQUFBLE1BQUE7TUFDQSxRQUFBLFFBQUEsV0FBQSxTQUFBLEtBQUE7T0FDQSxHQUFBLFVBQUEsT0FBQSxHQUFBLHFCQUFBLFNBQUEsS0FBQSxXQUFBOzs7WUFHQTtNQUNBLEdBQUEsVUFBQSxTQUFBO01BQ0EsSUFBQSxPQUFBLE9BQUEsTUFBQTtPQUNBLEdBQUEsVUFBQSxPQUFBLEdBQUEscUJBQUEsU0FBQSxPQUFBLE9BQUEsTUFBQSxXQUFBOzs7OztJQUtBLEdBQUEsVUFBQSxRQUFBLFVBQUEsU0FBQSxLQUFBLEdBQUE7O0tBRUEsSUFBQSxDQUFBLEdBQUEsUUFBQSxRQUFBO01BQ0EsSUFBQSxJQUFBLGVBQUEsSUFBQSxRQUFBLFdBQUEsR0FBQTtNQUNBLElBQUEsT0FBQSxFQUFBLEdBQUEsVUFBQSxTQUFBLGFBQUE7T0FDQSxHQUFBLFVBQUEsZUFBQSxJQUFBLFFBQUEsV0FBQSxHQUFBO2FBQ0E7T0FDQSxPQUFBLE1BQUEsZ0NBQUEsSUFBQSxRQUFBLFdBQUE7O1lBRUE7TUFDQSxJQUFBLElBQUEsZUFBQSxJQUFBLFFBQUEsV0FBQSxHQUFBO01BQ0EsSUFBQSxPQUFBLEVBQUEsR0FBQSxVQUFBLFNBQUEsYUFBQTtPQUNBLEdBQUEsbUJBQUE7YUFDQTtPQUNBLE9BQUEsTUFBQSxnQ0FBQSxJQUFBLFFBQUEsV0FBQTs7Ozs7Ozs7O0FDdm1CQSxDQUFBLFlBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSxzQ0FBQSxVQUFBLE9BQUEsUUFBQTs7SUFFQSxPQUFBLFNBQUE7Ozs7QUNMQSxDQUFBLFlBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSx5R0FBQSxVQUFBLFFBQUEsUUFBQSxTQUFBLFVBQUEsUUFBQSxlQUFBLGNBQUE7OztFQUdBLElBQUEsS0FBQTtFQUNBLEdBQUEsT0FBQSxhQUFBO0VBQ0EsR0FBQSxPQUFBLGFBQUE7RUFDQSxHQUFBLFNBQUEsYUFBQTtFQUNBLEdBQUEsYUFBQSxhQUFBO0VBQ0EsR0FBQSxXQUFBO0lBQ0EsR0FBQSxhQUFBO0VBQ0EsR0FBQSxhQUFBO0VBQ0EsR0FBQSxpQkFBQTtFQUNBLEdBQUEsZUFBQTtFQUNBLEdBQUEsZ0JBQUE7RUFDQSxHQUFBLHFCQUFBO0VBQ0EsR0FBQSxpQkFBQTtFQUNBLEdBQUEsZUFBQTtJQUNBLEdBQUEsa0JBQUE7RUFDQSxHQUFBLHNCQUFBOztFQUVBLEdBQUEsVUFBQTtJQUNBLEdBQUEsUUFBQTtFQUNBLEdBQUEsUUFBQTtHQUNBLFFBQUE7R0FDQSxPQUFBO0dBQ0EsT0FBQTtHQUNBLE1BQUE7OztFQUdBOztFQUVBLFNBQUEsV0FBQTtHQUNBO0tBQ0E7OztFQUdBLFNBQUEsWUFBQTtHQUNBLElBQUEsQ0FBQSxHQUFBLE1BQUE7SUFDQSxPQUFBLEdBQUE7OztJQUdBLFNBQUEsVUFBQTtHQUNBLFNBQUEsVUFBQTtJQUNBLElBQUEsT0FBQSxRQUFBLFdBQUEsR0FBQSxNQUFBLFFBQUEsR0FBQSxLQUFBO09BQ0EsR0FBQSxRQUFBO0lBQ0EsSUFBQSxTQUFBO0lBQ0EsSUFBQSxRQUFBO0tBQ0EsUUFBQSxRQUFBLElBQUEsU0FBQSxPQUFBLEVBQUE7S0FDQSxHQUFBLE1BQUEsU0FBQSxPQUFBO01BQ0EsUUFBQTs7O09BR0EsUUFBQSxRQUFBLElBQUEsT0FBQSxTQUFBLE1BQUE7U0FDQSxHQUFBLE1BQUEsS0FBQSxNQUFBLEtBQUEsR0FBQSxLQUFBOztJQUVBLEdBQUEsYUFBQSxHQUFBLE1BQUE7Ozs7O0VBS0EsU0FBQSxPQUFBLFdBQUE7R0FDQSxHQUFBLFNBQUE7R0FDQTs7RUFFQSxTQUFBLGNBQUEsT0FBQTtHQUNBLE9BQUEsR0FBQSxPQUFBLFFBQUEsV0FBQSxHQUFBLE1BQUEsQ0FBQSxRQUFBO0dBQ0E7O0VBRUEsU0FBQSxtQkFBQSxNQUFBLE9BQUE7OztHQUdBOztFQUVBLFNBQUEsZUFBQSxNQUFBO0dBQ0EsT0FBQSxLQUFBLE9BQUEsU0FBQSxJQUFBLFlBQUE7Ozs7Ozs7RUFPQSxTQUFBLGFBQUEsR0FBQSxLQUFBO0dBQ0EsUUFBQSxRQUFBLEdBQUEsTUFBQSxVQUFBLE1BQUEsR0FBQTtJQUNBLFFBQUEsUUFBQSxLQUFBLE1BQUEsVUFBQSxPQUFBLEdBQUE7S0FDQSxJQUFBLEtBQUEsS0FBQTtNQUNBLFFBQUEsUUFBQSxHQUFBLEtBQUEsR0FBQSxRQUFBLFNBQUEsT0FBQSxFQUFBO09BQ0EsR0FBQSxNQUFBLFVBQUEsSUFBQTtRQUNBLElBQUEsTUFBQSxRQUFBLEtBQUEsTUFBQSxRQUFBLEdBQUE7U0FDQSxhQUFBOztRQUVBLGFBQUE7UUFDQSxHQUFBLEtBQUEsR0FBQSxPQUFBLE9BQUEsR0FBQTs7O01BR0EsT0FBQSxHQUFBLEtBQUEsR0FBQSxLQUFBOzs7O0dBSUEsYUFBQTtHQUNBLE9BQUE7OztFQUdBLFNBQUEsaUJBQUE7R0FDQSxRQUFBLFFBQUEsR0FBQSxVQUFBLFVBQUEsTUFBQSxLQUFBO0lBQ0EsUUFBQSxRQUFBLEtBQUEsUUFBQSxVQUFBLE9BQUEsR0FBQTtLQUNBLElBQUEsTUFBQSxRQUFBLEtBQUEsTUFBQSxRQUFBLEdBQUE7TUFDQSxHQUFBO01BQ0EsYUFBQTs7S0FFQSxHQUFBO0tBQ0EsYUFBQTs7SUFFQSxHQUFBLEtBQUEsT0FBQSxHQUFBLEtBQUEsUUFBQSxPQUFBOztHQUVBLEdBQUEsV0FBQTtHQUNBLGFBQUE7R0FDQSxJQUFBLEdBQUEsS0FBQSxVQUFBLEdBQUE7SUFDQSxHQUFBO0lBQ0EsT0FBQSxHQUFBOzs7O0VBSUEsU0FBQSxlQUFBO0dBQ0EsR0FBQSxXQUFBO0dBQ0EsUUFBQSxRQUFBLEdBQUEsTUFBQSxVQUFBLE1BQUEsS0FBQTtJQUNBLElBQUEsS0FBQSxPQUFBLFFBQUE7S0FDQSxHQUFBLFNBQUEsS0FBQTs7Ozs7RUFLQSxTQUFBLFVBQUE7R0FDQSxHQUFBLE1BQUEsR0FBQSxTQUFBO0dBQ0EsY0FBQSxhQUFBLFdBQUE7OztFQUdBLFNBQUEsYUFBQTtHQUNBLEdBQUEsT0FBQTs7O0VBR0EsU0FBQSxrQkFBQTtHQUNBLFFBQUEsUUFBQSxHQUFBLE1BQUEsVUFBQSxLQUFBLEdBQUE7SUFDQSxRQUFBLFFBQUEsSUFBQSxNQUFBLFVBQUEsTUFBQSxLQUFBO0tBQ0EsSUFBQSxNQUFBLFNBQUEsT0FBQSxHQUFBO01BQ0EsSUFBQSxLQUFBLFdBQUEsaUJBQUEsU0FBQSxPQUFBLEtBQUEsS0FBQSxXQUFBLGNBQUEsUUFBQSxTQUFBLENBQUEsR0FBQTtPQUNBLElBQUEsUUFBQTtRQUNBLE1BQUE7UUFDQSxTQUFBO1FBQ0EsUUFBQTtRQUNBLE9BQUE7O09BRUEsSUFBQSxPQUFBLEtBQUE7T0FDQSxHQUFBLE9BQUEsS0FBQTs7Ozs7Ozs7Ozs7O0FDM0pBLENBQUEsV0FBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLHNIQUFBLFNBQUEsWUFBQSxRQUFBLFFBQUEsY0FBQSxhQUFBLGVBQUEsUUFBQTtFQUNBLElBQUEsS0FBQTtFQUNBLEdBQUEsT0FBQSxhQUFBO0VBQ0EsR0FBQSxPQUFBLGFBQUE7RUFDQSxHQUFBLFNBQUEsYUFBQTtFQUNBLEdBQUEsYUFBQSxhQUFBO0VBQ0EsR0FBQSxjQUFBO0VBQ0EsR0FBQSxXQUFBOztFQUVBOztFQUVBLFNBQUEsV0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztFQWtDQSxTQUFBLGNBQUE7R0FDQSxRQUFBLFFBQUEsR0FBQSxNQUFBLFNBQUEsS0FBQSxLQUFBO0lBQ0EsUUFBQSxRQUFBLElBQUEsTUFBQSxTQUFBLE1BQUEsR0FBQTtLQUNBLElBQUEsTUFBQSxTQUFBLE9BQUEsR0FBQTtNQUNBLEtBQUEsS0FBQSxXQUFBLGlCQUFBLHlCQUFBLEtBQUEsV0FBQSxjQUFBLFFBQUEsU0FBQSxDQUFBLEdBQUE7T0FDQSxHQUFBLEtBQUEsS0FBQSxLQUFBLEtBQUE7T0FDQSxJQUFBLE9BQUEsT0FBQSxHQUFBO09BQ0EsR0FBQSxPQUFBLE9BQUEsR0FBQTs7OztJQUlBLElBQUEsQ0FBQSxJQUFBLEtBQUEsR0FBQSxLQUFBLFlBQUE7S0FDQSxJQUFBLFFBQUE7TUFDQSxNQUFBO01BQ0EsU0FBQTtNQUNBLE9BQUEsSUFBQSxLQUFBLEdBQUEsS0FBQTtNQUNBLFFBQUEsR0FBQSxLQUFBO01BQ0EsS0FBQTs7S0FFQSxJQUFBLGFBQUE7S0FDQSxRQUFBLFFBQUEsSUFBQSxRQUFBLFNBQUEsT0FBQSxLQUFBO01BQ0EsSUFBQSxNQUFBLFFBQUEsR0FBQTtPQUNBLGFBQUE7OztLQUdBLElBQUEsQ0FBQSxZQUFBO01BQ0EsSUFBQSxPQUFBLEtBQUE7TUFDQSxHQUFBLFdBQUEsS0FBQTs7OztHQUlBLGFBQUE7OztFQUdBLFNBQUEsV0FBQTs7R0FFQSxJQUFBLENBQUEsR0FBQSxLQUFBLFdBQUE7SUFDQSxPQUFBLE1BQUEsMENBQUE7SUFDQSxPQUFBOztHQUVBLElBQUEsQ0FBQSxHQUFBLEtBQUEsZUFBQTtJQUNBLE9BQUEsTUFBQSw4Q0FBQTtJQUNBLE9BQUE7O0dBRUEsSUFBQSxHQUFBLEtBQUEsaUJBQUEsR0FBQSxLQUFBLFdBQUE7SUFDQSxPQUFBLE1BQUEsbURBQUE7SUFDQSxPQUFBOztHQUVBLFdBQUEsaUJBQUE7R0FDQSxHQUFBLFdBQUE7R0FDQSxJQUFBLFVBQUE7R0FDQSxJQUFBLFdBQUE7R0FDQSxJQUFBLFVBQUE7R0FDQSxRQUFBLFFBQUEsR0FBQSxNQUFBLFNBQUEsTUFBQSxLQUFBO0lBQ0EsSUFBQSxLQUFBLEtBQUEsR0FBQSxLQUFBLFlBQUE7S0FDQSxZQUFBLEtBQUEsS0FBQSxHQUFBLEtBQUEsV0FBQSxVQUFBLElBQUEsSUFBQTs7SUFFQSxRQUFBLEtBQUEsS0FBQSxHQUFBLEtBQUE7S0FDQSxLQUFBO01BQ0EsS0FBQSxLQUFBLEdBQUEsS0FBQSxpQkFBQTtNQUNBO0tBQ0EsS0FBQTtNQUNBLEtBQUEsS0FBQSxHQUFBLEtBQUEsaUJBQUE7TUFDQTtLQUNBLEtBQUE7TUFDQSxLQUFBLEtBQUEsR0FBQSxLQUFBLGlCQUFBO01BQ0E7S0FDQSxLQUFBO01BQ0EsS0FBQSxLQUFBLEdBQUEsS0FBQSxpQkFBQTtNQUNBO0tBQ0E7TUFDQTs7SUFFQSxRQUFBLEtBQUE7S0FDQSxLQUFBLEtBQUEsS0FBQSxHQUFBLEtBQUE7S0FDQSxNQUFBLEtBQUEsS0FBQSxHQUFBLEtBQUE7OztHQUdBLElBQUEsVUFBQSxhQUFBLFFBQUEsU0FBQSxLQUFBLGVBQUE7R0FDQSxhQUFBO0dBQ0EsWUFBQSxLQUFBLHdCQUFBO0lBQ0EsTUFBQTtJQUNBLEtBQUE7TUFDQSxLQUFBLFNBQUEsVUFBQTtJQUNBLFdBQUEsaUJBQUE7SUFDQSxRQUFBLFFBQUEsVUFBQSxTQUFBLFNBQUEsS0FBQTtLQUNBLFFBQUEsUUFBQSxHQUFBLE1BQUEsU0FBQSxNQUFBLEdBQUE7TUFDQSxJQUFBLFFBQUEsUUFBQSxLQUFBLEtBQUEsR0FBQSxLQUFBLGdCQUFBO09BQ0EsSUFBQSxRQUFBLEtBQUEsU0FBQSxHQUFBO1FBQ0EsSUFBQSxXQUFBO1NBQ0EsT0FBQTtTQUNBLFNBQUEsUUFBQTs7UUFFQSxhQUFBLFlBQUE7Y0FDQSxHQUFBLFFBQUEsS0FBQSxVQUFBLEVBQUE7UUFDQSxJQUFBLE9BQUEsUUFBQSxRQUFBLGFBQUE7U0FDQSxHQUFBLEtBQUEsR0FBQSxLQUFBLEdBQUEsS0FBQSxhQUFBLFFBQUEsS0FBQSxHQUFBO1NBQ0EsR0FBQSxLQUFBLEdBQUEsS0FBQSxHQUFBLEtBQUEsaUJBQUEsUUFBQSxLQUFBLEdBQUE7U0FDQSxJQUFBLEtBQUEsT0FBQSxRQUFBO1VBQ0EsUUFBQSxRQUFBLEtBQUEsUUFBQSxTQUFBLE9BQUEsR0FBQTtXQUNBLElBQUEsTUFBQSxRQUFBLEtBQUEsTUFBQSxRQUFBLEdBQUE7WUFDQSxHQUFBLFdBQUEsT0FBQSxHQUFBO1lBQ0EsS0FBQSxPQUFBLE9BQUEsR0FBQTtrQkFDQSxJQUFBLE1BQUEsUUFBQSxHQUFBO1lBQ0EsSUFBQSxNQUFBLFVBQUEsR0FBQSxLQUFBLFdBQUE7YUFDQSxHQUFBLE9BQUEsT0FBQSxHQUFBO2FBQ0EsS0FBQSxPQUFBLE9BQUEsR0FBQTs7Ozs7O2VBTUE7O1NBRUEsSUFBQSxRQUFBO1VBQ0EsTUFBQTtVQUNBLFNBQUE7VUFDQSxRQUFBLEdBQUEsS0FBQTs7U0FFQSxJQUFBLGFBQUE7U0FDQSxRQUFBLFFBQUEsR0FBQSxLQUFBLEdBQUEsUUFBQSxTQUFBLE9BQUEsR0FBQTtVQUNBLFFBQUEsSUFBQTtVQUNBLElBQUEsTUFBQSxRQUFBLEdBQUE7V0FDQSxhQUFBOzs7U0FHQSxJQUFBLENBQUEsWUFBQTtVQUNBLGFBQUEsWUFBQTtVQUNBLEtBQUEsT0FBQSxLQUFBOzs7Ozs7O0lBT0EsR0FBQSxjQUFBO0lBQ0EsYUFBQTtJQUNBLElBQUEsYUFBQSxjQUFBLFFBQUE7S0FDQSxjQUFBLGFBQUE7O01BRUEsU0FBQSxVQUFBO0lBQ0EsV0FBQSxpQkFBQTtJQUNBLE9BQUEsTUFBQSxzQ0FBQSxTQUFBLEtBQUE7Ozs7RUFJQSxHQUFBLGFBQUE7O0VBRUEsU0FBQSxhQUFBO0dBQ0EsSUFBQSxhQUFBO0lBQ0EsTUFBQTs7R0FFQSxJQUFBLE9BQUE7SUFDQSxTQUFBO0dBQ0EsUUFBQSxRQUFBLEdBQUEsTUFBQSxTQUFBLE1BQUEsS0FBQTtJQUNBLElBQUEsS0FBQSxPQUFBLFVBQUEsR0FBQTtLQUNBLEtBQUEsS0FBQSxHQUFBLE9BQUEsR0FBQSxLQUFBO0tBQ0EsR0FBQSxHQUFBLEtBQUEsY0FBQSxHQUFBLEtBQUEsY0FBQSxRQUFBO01BQ0EsT0FBQSxLQUFBLEtBQUEsR0FBQSxLQUFBOztLQUVBLFdBQUEsS0FBQSxLQUFBLEtBQUE7V0FDQTtLQUNBLE9BQUEsTUFBQSwrQkFBQTtLQUNBOzs7R0FHQSxRQUFBLElBQUE7R0FDQSxZQUFBLEtBQUEsaUJBQUEsR0FBQSxVQUFBLGFBQUEsV0FBQSxZQUFBLEtBQUEsU0FBQSxLQUFBO0lBQ0EsSUFBQSxPQUFBLE1BQUE7S0FDQSxPQUFBLFFBQUEsV0FBQSxLQUFBLFNBQUEsd0JBQUEsR0FBQSxLQUFBLE1BQUE7S0FDQSxHQUFBLE9BQUEsYUFBQTtLQUNBLE9BQUEsR0FBQTs7Ozs7Ozs7QUMzTkEsQ0FBQSxZQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsc0VBQUEsVUFBQSxRQUFBLGNBQUEsYUFBQSxRQUFBOztFQUVBLElBQUEsS0FBQTtFQUNBLEdBQUEsT0FBQSxhQUFBO0VBQ0EsR0FBQSxPQUFBLGFBQUE7RUFDQSxHQUFBLFNBQUEsYUFBQTtFQUNBLEdBQUEsYUFBQSxhQUFBO0VBQ0EsR0FBQSxXQUFBOzs7RUFHQTs7RUFFQSxTQUFBLFdBQUE7Ozs7R0FJQTs7O0VBR0EsU0FBQSxZQUFBO0dBQ0EsSUFBQSxDQUFBLEdBQUEsTUFBQTtJQUNBLE9BQUEsR0FBQTs7OztFQUlBLFNBQUEsU0FBQSxPQUFBO0dBQ0EsSUFBQSxPQUFBO0lBQ0EsSUFBQSxhQUFBO0tBQ0EsTUFBQTs7SUFFQSxJQUFBLFVBQUE7SUFDQSxJQUFBLGFBQUE7S0FDQSxTQUFBO0lBQ0EsR0FBQSxVQUFBO0lBQ0EsUUFBQSxRQUFBLEdBQUEsTUFBQSxVQUFBLE1BQUEsS0FBQTtLQUNBLElBQUEsS0FBQSxPQUFBLFVBQUEsR0FBQTtNQUNBLEdBQUEsS0FBQSxLQUFBLEdBQUEsS0FBQSxZQUFBO09BQ0EsS0FBQSxLQUFBLE9BQUEsS0FBQSxLQUFBLEdBQUEsS0FBQTs7T0FFQSxHQUFBLEdBQUEsS0FBQSxjQUFBLEdBQUEsS0FBQSxjQUFBLFFBQUE7UUFDQSxPQUFBLEtBQUEsS0FBQSxHQUFBLEtBQUE7OztPQUdBLEdBQUEsS0FBQSxXQUFBLEtBQUEsS0FBQSxHQUFBLEtBQUEsV0FBQSxVQUFBLElBQUEsZUFBQTtPQUNBLFdBQUEsS0FBQSxLQUFBLEtBQUE7O1VBRUE7T0FDQSxRQUFBLEtBQUE7Ozs7WUFJQTtNQUNBLE9BQUEsTUFBQSwrQkFBQTtNQUNBOzs7SUFHQSxRQUFBLFFBQUEsR0FBQSxZQUFBLFVBQUEsTUFBQSxLQUFBO0tBQ0EsSUFBQSxPQUFBLEdBQUEsS0FBQSxhQUFBLE9BQUEsR0FBQSxLQUFBLGVBQUE7TUFDQSxJQUFBLFdBQUE7TUFDQSxJQUFBLE9BQUEsR0FBQSxXQUFBLEtBQUEsU0FBQSxhQUFBO09BQ0EsV0FBQSxHQUFBLFdBQUEsS0FBQSxNQUFBOztNQUVBLElBQUEsUUFBQTtPQUNBLFVBQUE7T0FDQSxTQUFBLEdBQUEsV0FBQSxLQUFBO09BQ0EsZUFBQSxHQUFBLFdBQUEsS0FBQTtPQUNBLG1CQUFBLEdBQUEsV0FBQSxLQUFBLEtBQUEsTUFBQTtPQUNBLGFBQUEsR0FBQSxXQUFBLEtBQUEsYUFBQTtPQUNBLFlBQUE7T0FDQSxtQkFBQSxHQUFBLFdBQUEsS0FBQSxhQUFBLE1BQUE7O01BRUEsSUFBQSxhQUFBO01BQ0EsUUFBQSxRQUFBLEdBQUEsV0FBQSxLQUFBLFlBQUEsVUFBQSxLQUFBO09BQ0EsV0FBQSxLQUFBLElBQUE7O01BRUEsTUFBQSxhQUFBO01BQ0EsT0FBQSxLQUFBOzs7SUFHQSxHQUFBLEtBQUEsU0FBQTtJQUNBLEdBQUEsUUFBQSxTQUFBLEVBQUE7S0FDQSxPQUFBLE1BQUEsT0FBQSxRQUFBLFNBQUEsWUFBQTs7O0lBR0EsWUFBQSxLQUFBLGVBQUEsR0FBQSxNQUFBLEtBQUEsVUFBQSxVQUFBO0tBQ0EsWUFBQSxLQUFBLGlCQUFBLFNBQUEsYUFBQSxXQUFBLFlBQUEsS0FBQSxVQUFBLEtBQUE7TUFDQSxJQUFBLE9BQUEsTUFBQTtPQUNBLE9BQUEsUUFBQSxXQUFBLEtBQUEsU0FBQSx3QkFBQSxHQUFBLEtBQUEsTUFBQTtPQUNBLGFBQUE7T0FDQSxPQUFBLEdBQUE7T0FDQSxHQUFBLE9BQUE7T0FDQSxHQUFBLE9BQUE7O01BRUEsR0FBQSxVQUFBOztPQUVBLFVBQUEsVUFBQTtLQUNBLElBQUEsU0FBQSxTQUFBO01BQ0EsT0FBQSxNQUFBLFNBQUEsU0FBQTs7O0tBR0EsR0FBQSxVQUFBOzs7Ozs7OztBQ3ZHQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSx1Q0FBQSxTQUFBLGFBQUE7TUFDQSxJQUFBLEtBQUE7TUFDQSxHQUFBLE9BQUEsYUFBQTtNQUNBLEdBQUEsT0FBQSxhQUFBO01BQ0EsR0FBQSxhQUFBLGFBQUE7TUFDQSxHQUFBLG1CQUFBLE9BQUEsS0FBQSxHQUFBLFlBQUE7Ozs7O0FDUkEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsaUhBQUEsU0FBQSxRQUFBLFFBQUEsbUJBQUEsU0FBQSxhQUFBLGFBQUEsT0FBQTs7O1FBR0EsSUFBQSxLQUFBO1FBQ0EsR0FBQSxNQUFBO1FBQ0EsR0FBQSxNQUFBO1FBQ0EsR0FBQSxhQUFBO1FBQ0EsR0FBQSxRQUFBO1FBQ0EsR0FBQSxPQUFBLGFBQUE7UUFDQSxHQUFBLE9BQUEsYUFBQTtRQUNBLEdBQUEsU0FBQSxhQUFBO1FBQ0EsR0FBQSxZQUFBLGFBQUE7UUFDQSxHQUFBLGlCQUFBO1FBQ0EsbUJBQUEsYUFBQTs7O1FBR0EsUUFBQSxJQUFBLEdBQUE7UUFDQTs7UUFFQSxTQUFBLFVBQUE7VUFDQTs7O1FBR0EsU0FBQSxXQUFBO1VBQ0EsR0FBQSxDQUFBLEdBQUEsS0FBQTtZQUNBLE9BQUEsR0FBQTs7OztRQUlBLE9BQUEsT0FBQSxVQUFBLEVBQUEsT0FBQSxhQUFBLG9CQUFBLFNBQUEsRUFBQSxFQUFBO1VBQ0EsR0FBQSxNQUFBLEVBQUE7VUFDQSxHQUFBLFlBQUE7VUFDQSxHQUFBLE1BQUE7VUFDQSxHQUFBLE1BQUE7VUFDQSxHQUFBLEdBQUEsVUFBQSxNQUFBO1lBQ0EsbUJBQUEsYUFBQSxHQUFBLFVBQUEsTUFBQTs7VUFFQTtZQUNBLGFBQUE7OztRQUdBLE9BQUEsT0FBQSxnQkFBQSxTQUFBLEVBQUEsRUFBQTtVQUNBLEdBQUEsTUFBQSxHQUFBO1VBQ0EsR0FBQSxPQUFBLEVBQUEsWUFBQSxhQUFBO1lBQ0EsR0FBQSxFQUFBLFlBQUEsRUFBQSxTQUFBO2NBQ0EsR0FBQSxFQUFBLE1BQUE7Z0JBQ0EsbUJBQUEsYUFBQSxFQUFBLE1BQUE7O2tCQUVBO2tCQUNBLG1CQUFBLGFBQUE7O2NBRUE7OztjQUdBO1lBQ0EsR0FBQSxPQUFBLEVBQUEsY0FBQSxZQUFBO2NBQ0EsR0FBQSxFQUFBLFdBQUEsT0FBQTtnQkFDQSxtQkFBQSxhQUFBLEVBQUEsV0FBQSxHQUFBLE1BQUE7O2tCQUVBO2dCQUNBLG1CQUFBLGFBQUE7OztZQUdBOztVQUVBLGFBQUEsdUJBQUE7VUFDQSxhQUFBO1VBQ0E7OztRQUdBLFNBQUEsUUFBQTtVQUNBLEdBQUEsTUFBQTtVQUNBLEdBQUEsTUFBQTtVQUNBLFFBQUEsUUFBQSxHQUFBLE1BQUEsU0FBQSxNQUFBLElBQUE7Y0FDQSxHQUFBLE1BQUEsS0FBQSxJQUFBLEtBQUEsS0FBQSxHQUFBLFVBQUEsY0FBQSxHQUFBO2NBQ0EsR0FBQSxNQUFBLEtBQUEsSUFBQSxLQUFBLEtBQUEsR0FBQSxVQUFBLGNBQUEsR0FBQTs7VUFFQSxHQUFBLFFBQUEsR0FBQSxNQUFBLFNBQUEsT0FBQSxDQUFBLEdBQUEsSUFBQSxHQUFBLE1BQUEsTUFBQSxDQUFBLEVBQUE7O1FBRUEsU0FBQSxjQUFBLElBQUE7VUFDQSxJQUFBLFFBQUE7VUFDQSxRQUFBLFFBQUEsR0FBQSxNQUFBLFNBQUEsTUFBQSxJQUFBO2FBQ0EsR0FBQSxLQUFBLEtBQUEsR0FBQSxLQUFBLGNBQUEsSUFBQTtlQUNBLFFBQUEsS0FBQSxLQUFBLEdBQUEsVUFBQTs7O1VBR0EsT0FBQTs7UUFFQSxTQUFBLGVBQUEsU0FBQTtPQUNBLElBQUEsUUFBQTtPQUNBLElBQUEsTUFBQSxRQUFBLFdBQUE7T0FDQSxJQUFBLFFBQUEsY0FBQSxRQUFBLEdBQUE7T0FDQSxJQUFBLFFBQUEsR0FBQSxVQUFBO09BQ0EsSUFBQSxPQUFBLFFBQUE7O09BRUEsUUFBQTtPQUNBLEtBQUE7O1NBRUEsSUFBQSxXQUFBLFNBQUEsTUFBQSxNQUFBLFNBQUEsR0FBQSxNQUFBLFdBQUE7U0FDQSxJQUFBLFFBQUEsVUFBQSxtQkFBQSxTQUFBLFlBQUEsT0FBQSxtQkFBQSxTQUFBLFdBQUEsS0FBQSxPQUFBLG1CQUFBLFNBQUEsV0FBQSxLQUFBLE1BQUEsbUJBQUEsU0FBQSxXQUFBLEtBQUE7Y0FDQSxNQUFBLFFBQUEsVUFBQSxtQkFBQSxTQUFBLGFBQUEsT0FBQSxtQkFBQSxTQUFBLFdBQUEsS0FBQSxPQUFBLG1CQUFBLFNBQUEsV0FBQSxLQUFBO1NBQ0EsTUFBQSxVQUFBO1VBQ0EsT0FBQTtVQUNBLE1BQUE7O1NBRUEsTUFBQSxXQUFBO1VBQ0EsT0FBQSxVQUFBLG1CQUFBLFNBQUEsWUFBQSxPQUFBLG1CQUFBLFNBQUEsV0FBQSxLQUFBLE9BQUEsbUJBQUEsU0FBQSxXQUFBLEtBQUE7VUFDQSxTQUFBO1dBQ0EsT0FBQTtXQUNBLE1BQUE7OztTQUdBOzs7O09BSUEsSUFBQSxRQUFBLE1BQUEsU0FBQSxtQkFBQSxVQUFBLFNBQUE7UUFDQSxNQUFBLGNBQUEsWUFBQTtTQUNBLElBQUEsUUFBQTtVQUNBLE1BQUEsUUFBQSxXQUFBO1VBQ0EsVUFBQSxDQUFBLEtBQUE7VUFDQSxVQUFBOztTQUVBLE9BQUE7OztPQUdBLE9BQUE7O1FBRUEsU0FBQSxjQUFBO1VBQ0EsR0FBQSxVQUFBLFNBQUE7VUFDQSxHQUFBLFVBQUE7O1FBRUEsU0FBQSxnQkFBQTtVQUNBO09BQ0EsWUFBQSxPQUFBLE9BQUEsS0FBQSxVQUFBLEtBQUE7UUFDQSxHQUFBLE1BQUE7UUFDQSxHQUFBLFlBQUEsbUJBQUE7UUFDQSxTQUFBLFlBQUE7VUFDQTs7Ozs7Ozs7QUM3SUEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsb0dBQUEsU0FBQSxPQUFBLFFBQUEsUUFBQSxZQUFBLGVBQUEsYUFBQTtNQUNBLElBQUEsS0FBQTtNQUNBLEdBQUEsT0FBQSxhQUFBO01BQ0EsR0FBQSxPQUFBLGFBQUE7TUFDQSxhQUFBO01BQ0EsR0FBQSxhQUFBLGFBQUE7TUFDQSxHQUFBLG1CQUFBO01BQ0EsR0FBQSxZQUFBO01BQ0EsR0FBQSxZQUFBO01BQ0EsR0FBQSxXQUFBO01BQ0EsR0FBQSxXQUFBOzs7TUFHQSxTQUFBLGlCQUFBLElBQUE7UUFDQSxHQUFBLE9BQUEsYUFBQSxhQUFBLFFBQUEsWUFBQTtVQUNBLGFBQUEsYUFBQSxJQUFBO1lBQ0EsWUFBQTtZQUNBLE1BQUE7OztRQUdBLEdBQUEsY0FBQTtRQUNBLEdBQUEsWUFBQSxhQUFBLGFBQUE7UUFDQSxhQUFBOztNQUVBLFNBQUEsVUFBQSxLQUFBO1FBQ0EsR0FBQSxPQUFBLFFBQUEsYUFBQSxPQUFBO0tBQ0EsSUFBQSxLQUFBLFNBQUEsS0FBQSxRQUFBLEtBQUEsZ0JBQUEsS0FBQSxNQUFBLFVBQUEsR0FBQTtNQUNBLE9BQUE7O0tBRUEsT0FBQTs7SUFFQSxTQUFBLFVBQUEsS0FBQTtRQUNBLEdBQUEsT0FBQSxRQUFBLGVBQUEsT0FBQSxLQUFBLGNBQUEsYUFBQSxPQUFBO0tBQ0EsT0FBQSxVQUFBLFNBQUEsS0FBQSxXQUFBLFNBQUEsT0FBQTs7TUFFQSxTQUFBLFVBQUE7UUFDQSxJQUFBLE9BQUE7UUFDQSxRQUFBLFFBQUEsR0FBQSxZQUFBLFNBQUEsVUFBQTtVQUNBLEdBQUEsVUFBQSxXQUFBO1lBQ0E7Ozs7UUFJQSxHQUFBLFFBQUEsT0FBQSxLQUFBLEdBQUEsWUFBQSxPQUFBO1VBQ0EsT0FBQTs7UUFFQSxPQUFBOztNQUVBLFNBQUEsV0FBQTs7VUFFQSxHQUFBLENBQUEsR0FBQSxLQUFBLGNBQUEsQ0FBQSxHQUFBLEtBQUEsS0FBQTtZQUNBLGNBQUEsYUFBQSxXQUFBO1lBQ0EsT0FBQTs7TUFFQSxJQUFBLGFBQUE7T0FDQSxNQUFBOztNQUVBLElBQUEsVUFBQTtNQUNBLElBQUEsYUFBQTtPQUNBLFNBQUE7TUFDQSxHQUFBLFVBQUE7TUFDQSxRQUFBLFFBQUEsR0FBQSxNQUFBLFVBQUEsTUFBQSxLQUFBO09BQ0EsSUFBQSxLQUFBLE9BQUEsVUFBQSxHQUFBO1FBQ0EsR0FBQSxLQUFBLEtBQUEsR0FBQSxLQUFBLFlBQUE7U0FDQSxLQUFBLEtBQUEsT0FBQSxLQUFBLEtBQUEsR0FBQSxLQUFBOztTQUVBLEdBQUEsR0FBQSxLQUFBLGNBQUEsR0FBQSxLQUFBLGNBQUEsUUFBQTtVQUNBLE9BQUEsS0FBQSxLQUFBLEdBQUEsS0FBQTs7O1NBR0EsR0FBQSxLQUFBLFdBQUEsS0FBQSxLQUFBLEdBQUEsS0FBQSxXQUFBLFVBQUEsSUFBQSxlQUFBO1NBQ0EsV0FBQSxLQUFBLEtBQUEsS0FBQTs7WUFFQTtnQkFDQSxHQUFBLEdBQUEsS0FBQSxLQUFBO2tCQUNBLEtBQUEsS0FBQSxPQUFBLEdBQUEsS0FBQTtrQkFDQSxHQUFBLEtBQUEsV0FBQSxLQUFBLEtBQUEsR0FBQSxLQUFBLFdBQUEsVUFBQSxJQUFBLGVBQUE7V0FDQSxXQUFBLEtBQUEsS0FBQSxLQUFBOztvQkFFQTttQkFDQSxRQUFBLEtBQUE7Ozs7Ozs7Y0FPQTtRQUNBLE9BQUEsTUFBQSwrQkFBQTtRQUNBOzs7TUFHQSxRQUFBLFFBQUEsR0FBQSxZQUFBLFVBQUEsTUFBQSxLQUFBO09BQ0EsSUFBQSxPQUFBLEdBQUEsS0FBQSxhQUFBLE9BQUEsR0FBQSxLQUFBLGVBQUE7UUFDQSxJQUFBLFdBQUE7UUFDQSxJQUFBLE9BQUEsR0FBQSxXQUFBLEtBQUEsU0FBQSxhQUFBO1NBQ0EsV0FBQSxHQUFBLFdBQUEsS0FBQSxNQUFBOztRQUVBLElBQUEsUUFBQTtTQUNBLFVBQUE7U0FDQSxTQUFBLEdBQUEsV0FBQSxLQUFBO1NBQ0EsZUFBQSxHQUFBLFdBQUEsS0FBQTtTQUNBLG1CQUFBLEdBQUEsV0FBQSxLQUFBLEtBQUEsTUFBQTtTQUNBLGFBQUEsR0FBQSxXQUFBLEtBQUEsYUFBQTtTQUNBLFlBQUE7U0FDQSxtQkFBQSxHQUFBLFdBQUEsS0FBQSxhQUFBLE1BQUE7O1FBRUEsSUFBQSxhQUFBO1FBQ0EsUUFBQSxRQUFBLEdBQUEsV0FBQSxLQUFBLFlBQUEsVUFBQSxLQUFBO1NBQ0EsV0FBQSxLQUFBLElBQUE7O1FBRUEsTUFBQSxhQUFBO1FBQ0EsT0FBQSxLQUFBOzs7TUFHQSxHQUFBLEtBQUEsU0FBQTtNQUNBLEdBQUEsUUFBQSxTQUFBLEVBQUE7T0FDQSxPQUFBLE1BQUEsT0FBQSxRQUFBLFNBQUEsWUFBQTtZQUNBLE9BQUE7OztNQUdBLFlBQUEsS0FBQSxlQUFBLEdBQUEsTUFBQSxLQUFBLFVBQUEsVUFBQTtPQUNBLFlBQUEsS0FBQSxpQkFBQSxTQUFBLGFBQUEsV0FBQSxZQUFBLEtBQUEsVUFBQSxLQUFBO1FBQ0EsSUFBQSxPQUFBLE1BQUE7U0FDQSxPQUFBLFFBQUEsV0FBQSxLQUFBLFNBQUEsd0JBQUEsR0FBQSxLQUFBLE1BQUE7U0FDQSxhQUFBO1NBQ0EsT0FBQSxHQUFBO1NBQ0EsR0FBQSxPQUFBO1NBQ0EsR0FBQSxPQUFBOztRQUVBLEdBQUEsVUFBQTs7U0FFQSxVQUFBLFVBQUE7T0FDQSxJQUFBLFNBQUEsU0FBQTtRQUNBLE9BQUEsTUFBQSxTQUFBLFNBQUE7OztPQUdBLEdBQUEsVUFBQTs7OztNQUlBLFNBQUEsY0FBQTs7Ozs7Ozs7OztLQVVBLE9BQUEsT0FBQSxVQUFBLEVBQUEsT0FBQSxhQUFBLG9CQUFBLFNBQUEsRUFBQSxFQUFBO1FBQ0EsR0FBQSxNQUFBLEVBQUE7UUFDQSxHQUFBLFdBQUEsRUFBQSxlQUFBO1FBQ0E7TUFDQSxPQUFBLE9BQUEsVUFBQSxFQUFBLE9BQUEsYUFBQSxvQkFBQSxTQUFBLEVBQUEsRUFBQTtRQUNBLElBQUEsTUFBQSxLQUFBLE9BQUEsS0FBQSxlQUFBLEtBQUEsTUFBQTtRQUNBLEdBQUEsQ0FBQSxHQUFBLGtCQUFBO1VBQ0EsR0FBQSxjQUFBLEdBQUEsV0FBQSxFQUFBLGFBQUE7VUFDQSxHQUFBLGFBQUEsR0FBQSxXQUFBLEVBQUEsYUFBQTtVQUNBLEdBQUEsVUFBQSxHQUFBLFdBQUEsRUFBQSxhQUFBO1VBQ0EsR0FBQSxnQkFBQSxHQUFBLFdBQUEsRUFBQSxhQUFBO1VBQ0EsR0FBQSxZQUFBLEdBQUEsV0FBQSxFQUFBLGFBQUE7VUFDQSxHQUFBLFdBQUEsR0FBQSxXQUFBLEVBQUEsYUFBQTs7VUFFQSxjQUFBLGFBQUEsZ0JBQUE7ZUFDQTs7Ozs7Ozs7Ozs7QUN6S0EsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsK0tBQUEsU0FBQSxRQUFBLGNBQUEsYUFBQSxTQUFBLFFBQUEsU0FBQSxhQUFBLFFBQUEsYUFBQSxjQUFBLG1CQUFBOzs7Ozs7Ozs7Ozs7Ozs7UUFlQSxJQUFBLEtBQUE7UUFDQSxHQUFBLE1BQUE7UUFDQSxHQUFBLE9BQUE7UUFDQSxHQUFBLFdBQUE7UUFDQSxHQUFBLFdBQUE7UUFDQSxHQUFBLGVBQUE7UUFDQSxHQUFBLG1CQUFBO1FBQ0EsR0FBQSxrQkFBQTs7UUFFQSxHQUFBLFNBQUE7UUFDQSxHQUFBLFNBQUE7UUFDQSxHQUFBLFlBQUE7UUFDQSxHQUFBLG1CQUFBO1FBQ0EsR0FBQSxhQUFBO1FBQ0EsR0FBQSxjQUFBO1FBQ0EsR0FBQSxlQUFBO1FBQ0EsR0FBQSxnQkFBQTtRQUNBLEdBQUEsT0FBQTtRQUNBLEdBQUEsWUFBQTs7O1FBR0EsR0FBQSxnQkFBQTtRQUNBLEdBQUEsc0JBQUE7UUFDQSxHQUFBLG1CQUFBO1FBQ0EsR0FBQSxpQkFBQTtRQUNBLEdBQUEscUJBQUE7UUFDQSxHQUFBLHFCQUFBO1FBQ0EsR0FBQSx1QkFBQTtRQUNBLEdBQUEseUJBQUE7UUFDQSxHQUFBLFdBQUE7UUFDQSxHQUFBLGlCQUFBO1FBQ0EsR0FBQSxZQUFBO1FBQ0EsR0FBQSxjQUFBO1FBQ0EsR0FBQSxZQUFBOztRQUVBLEdBQUEsUUFBQSxhQUFBOztRQUVBLEdBQUEsT0FBQTtVQUNBLFdBQUE7VUFDQSxjQUFBO1VBQ0EsTUFBQTs7UUFFQSxHQUFBLFFBQUE7VUFDQSxRQUFBO1VBQ0EsT0FBQTtVQUNBLE9BQUE7VUFDQSxNQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O1FBbUJBOztRQUVBLFNBQUEsVUFBQTs7VUFFQSxhQUFBOztRQUVBLFNBQUEsVUFBQSxPQUFBO1VBQ0EsT0FBQSxTQUFBLFdBQUE7O1FBRUEsU0FBQSxnQkFBQSxRQUFBO1NBQ0EsSUFBQSxRQUFBO2NBQ0EsTUFBQTtjQUNBLFNBQUE7VUFDQSxPQUFBO1VBQ0EsTUFBQTs7O1NBR0EsT0FBQTs7UUFFQSxTQUFBLFVBQUE7V0FDQSxZQUFBLE9BQUEsT0FBQSxLQUFBLFVBQUEsS0FBQTtjQUNBLEdBQUEsWUFBQSxtQkFBQTtjQUNBLFNBQUEsVUFBQTtnQkFDQSxHQUFBLFVBQUEsU0FBQTs7Ozs7O1FBTUEsU0FBQSxxQkFBQTtVQUNBLEdBQUEsZ0JBQUEsQ0FBQSxHQUFBO1VBQ0EsR0FBQSxHQUFBLGNBQUE7WUFDQSxHQUFBOzs7UUFHQSxTQUFBLGVBQUE7VUFDQSxHQUFBLENBQUEsR0FBQSxVQUFBO1lBQ0EsWUFBQSxPQUFBLGVBQUEsS0FBQSxTQUFBLFNBQUE7Y0FDQSxHQUFBLFlBQUE7Y0FDQSxHQUFBLG9CQUFBLElBQUEsR0FBQSxrQkFBQTs7Ozs7UUFLQSxTQUFBLGlCQUFBLFNBQUE7VUFDQSxPQUFBLEdBQUEsa0JBQUEsUUFBQSxZQUFBLENBQUEsSUFBQSxPQUFBOztRQUVBLFNBQUEsZ0JBQUEsVUFBQSxLQUFBO1VBQ0EsUUFBQSxRQUFBLE1BQUEsU0FBQSxNQUFBLElBQUE7O2dCQUVBLEdBQUEsUUFBQSxTQUFBO2tCQUNBLEtBQUEsT0FBQSxLQUFBO2tCQUNBLEdBQUEsaUJBQUEsT0FBQSxHQUFBLGlCQUFBLFFBQUEsT0FBQTtrQkFDQSxHQUFBLGtCQUFBLE9BQUEsR0FBQSxrQkFBQSxRQUFBLE1BQUE7OztjQUdBLGdCQUFBLFVBQUEsS0FBQTs7O1FBR0EsU0FBQSxlQUFBLFNBQUE7VUFDQSxJQUFBLE1BQUEsR0FBQSxrQkFBQSxRQUFBO1VBQ0EsSUFBQSxNQUFBLENBQUEsRUFBQTtZQUNBLEdBQUEsa0JBQUEsT0FBQSxLQUFBO1lBQ0EsZ0JBQUEsVUFBQSxHQUFBOztjQUVBO1lBQ0EsR0FBQSxrQkFBQSxLQUFBO1lBQ0EsR0FBQSxHQUFBLGlCQUFBLFVBQUEsS0FBQSxPQUFBLEdBQUEsaUJBQUEsR0FBQSxXQUFBLFlBQUE7Y0FDQSxHQUFBLGlCQUFBLEdBQUEsTUFBQSxLQUFBOztnQkFFQTtnQkFDQSxHQUFBLE9BQUEsS0FBQTs7Ozs7O1FBTUEsU0FBQSxlQUFBLE1BQUE7VUFDQSxRQUFBLFFBQUEsT0FBQSxTQUFBLE1BQUEsSUFBQTtZQUNBLE1BQUEsS0FBQSxTQUFBLFNBQUEsTUFBQSxNQUFBO1lBQ0EsZUFBQSxNQUFBOzs7UUFHQSxTQUFBLG1CQUFBLEtBQUE7VUFDQSxRQUFBLElBQUE7O1FBRUEsU0FBQSxtQkFBQSxLQUFBO1VBQ0EsUUFBQSxJQUFBOztRQUVBLFNBQUEscUJBQUEsS0FBQTtVQUNBLElBQUEsTUFBQSxHQUFBLGlCQUFBLFFBQUE7VUFDQSxJQUFBLE1BQUEsQ0FBQSxFQUFBO1lBQ0EsR0FBQSxpQkFBQSxPQUFBLEtBQUE7O2NBRUE7WUFDQSxHQUFBLGlCQUFBLEtBQUE7OztRQUdBLFNBQUEsdUJBQUEsS0FBQTtVQUNBLE9BQUEsR0FBQSxpQkFBQSxRQUFBLFFBQUEsQ0FBQTs7UUFFQSxTQUFBLFVBQUE7VUFDQSxJQUFBLFdBQUE7WUFDQSxNQUFBO1lBQ0EsUUFBQTtZQUNBLE1BQUE7OztVQUdBLEdBQUEsR0FBQSxpQkFBQSxVQUFBLEtBQUEsT0FBQSxHQUFBLGlCQUFBLEdBQUEsV0FBQSxZQUFBO1lBQ0EsR0FBQSxpQkFBQSxHQUFBLE1BQUEsS0FBQTs7ZUFFQSxHQUFBLEdBQUEsaUJBQUEsU0FBQSxHQUFBO2NBQ0EsUUFBQSxRQUFBLEdBQUEsa0JBQUEsU0FBQSxNQUFBLElBQUE7a0JBQ0EsU0FBQSxNQUFBLEtBQUE7a0JBQ0EsZ0JBQUEsTUFBQSxHQUFBOztjQUVBLEdBQUEsT0FBQSxLQUFBO2NBQ0EsR0FBQSxtQkFBQTs7Y0FFQTtZQUNBLEdBQUEsT0FBQSxLQUFBOzs7UUFHQSxTQUFBLGdCQUFBO1VBQ0EsSUFBQSxXQUFBO1lBQ0EsTUFBQTtZQUNBLFFBQUE7WUFDQSxNQUFBOztVQUVBLFFBQUEsUUFBQSxHQUFBLGtCQUFBLFNBQUEsTUFBQSxJQUFBO1lBQ0EsU0FBQSxNQUFBLEtBQUE7O1VBRUEsR0FBQSxPQUFBLEtBQUE7VUFDQSxHQUFBLG1CQUFBOztRQUVBLFNBQUEsVUFBQSxLQUFBO1VBQ0EsR0FBQSxXQUFBOztRQUVBLFNBQUEsWUFBQSxNQUFBLEtBQUE7WUFDQSxnQkFBQSxNQUFBOztRQUVBLFNBQUEsV0FBQTtVQUNBLEdBQUEsR0FBQSxhQUFBO1lBQ0E7O1VBRUEsR0FBQSxlQUFBO1VBQ0EsR0FBQSxPQUFBLEdBQUEsWUFBQSxZQUFBO1lBQ0EsT0FBQSxNQUFBLDZCQUFBO1lBQ0EsR0FBQSxlQUFBO1lBQ0E7O1VBRUEsR0FBQSxDQUFBLEdBQUEsU0FBQSxNQUFBO1lBQ0EsT0FBQSxNQUFBLDZCQUFBO1lBQ0EsR0FBQSxlQUFBO1lBQ0E7O1VBRUEsR0FBQSxTQUFBLE9BQUEsR0FBQTtVQUNBLFlBQUEsS0FBQSxTQUFBLEdBQUEsVUFBQSxLQUFBLFNBQUEsU0FBQTtZQUNBLEdBQUEsZUFBQTtZQUNBLE9BQUEsUUFBQSwrQkFBQTtZQUNBLE9BQUEsR0FBQSxrQkFBQSxDQUFBLE1BQUEsU0FBQTtZQUNBLFNBQUEsU0FBQTtZQUNBLEdBQUEsZUFBQTtZQUNBLE9BQUEsTUFBQSxTQUFBLFFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDdFBBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLG1CQUFBLFVBQUE7Ozs7OztBQ0hBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLHdDQUFBLFNBQUEsWUFBQTtNQUNBLElBQUEsS0FBQTtNQUNBLEdBQUEsT0FBQSxZQUFBOzs7O0FDTEEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsdUNBQUEsU0FBQSxZQUFBO01BQ0EsSUFBQSxLQUFBOztNQUVBLEdBQUEsT0FBQTs7TUFFQTs7TUFFQSxTQUFBLFVBQUE7UUFDQSxZQUFBLFNBQUEsS0FBQSxTQUFBLEtBQUE7VUFDQSxHQUFBLE9BQUE7WUFDQTs7OztNQUlBLFNBQUEsYUFBQTtRQUNBLFFBQUEsSUFBQSxHQUFBO1FBQ0EsUUFBQSxRQUFBLEdBQUEsTUFBQSxTQUFBLEtBQUE7WUFDQSxLQUFBLE9BQUEsS0FBQSxNQUFBLEtBQUE7Ozs7Ozs7QUNwQkEsQ0FBQSxZQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEseUVBQUEsVUFBQSxVQUFBLFlBQUEsZ0JBQUE7SUFDQSxJQUFBLEtBQUE7SUFDQSxHQUFBLFdBQUE7Ozs7QUNMQSxDQUFBLFlBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSxpSkFBQSxVQUFBLFFBQUEsU0FBQSxTQUFBLFFBQUEsWUFBQSxTQUFBLFFBQUEsWUFBQSxZQUFBLGdCQUFBOztFQUVBLElBQUEsS0FBQTs7O0VBR0EsR0FBQSxhQUFBO0VBQ0EsR0FBQSxZQUFBO0VBQ0EsR0FBQSxTQUFBO0VBQ0EsR0FBQSxhQUFBOztFQUVBLEdBQUEsWUFBQTtHQUNBLFFBQUE7R0FDQSxXQUFBO0dBQ0EsT0FBQTtHQUNBLFdBQUE7O0VBRUEsR0FBQSxjQUFBOztFQUVBLEdBQUEsVUFBQTtHQUNBLFVBQUE7SUFDQSxLQUFBO0lBQ0EsS0FBQTtJQUNBLFVBQUE7SUFDQSxVQUFBO0lBQ0EsU0FBQTtJQUNBLFlBQUE7SUFDQSxXQUFBLFNBQUEsSUFBQSxLQUFBO0tBQ0EsT0FBQSxHQUFBLGlDQUFBLENBQUEsR0FBQSxJQUFBLEtBQUE7O0lBRUEsU0FBQSxVQUFBO0tBQ0EsT0FBQSxHQUFBLGlDQUFBLENBQUEsR0FBQSxHQUFBLE1BQUE7O0lBRUEsWUFBQSxVQUFBO0tBQ0EsUUFBQSxRQUFBLEdBQUEsVUFBQSxRQUFBLFNBQUEsTUFBQSxJQUFBO01BQ0EsZUFBQSxXQUFBLEtBQUEsSUFBQSxLQUFBLFNBQUEsS0FBQTtPQUNBLFdBQUEsS0FBQSxHQUFBO09BQ0EsR0FBQSxVQUFBLFVBQUE7Ozs7O0dBS0EsV0FBQTtJQUNBLEtBQUE7SUFDQSxLQUFBO0lBQ0EsV0FBQSxTQUFBLElBQUEsS0FBQTtLQUNBLE9BQUEsR0FBQSx3Q0FBQSxDQUFBLEdBQUE7OztHQUdBLE9BQUE7SUFDQSxLQUFBO0lBQ0EsS0FBQTtJQUNBLFVBQUE7OztFQUdBLEdBQUEsU0FBQTtHQUNBLEtBQUE7R0FDQSxRQUFBO0dBQ0EsTUFBQTtHQUNBLFdBQUE7R0FDQSxPQUFBO0lBQ0EsT0FBQTtJQUNBLE9BQUE7SUFDQSxZQUFBO0lBQ0EsYUFBQTtJQUNBLGFBQUE7OztFQUdBLEdBQUEsU0FBQTtHQUNBLE9BQUE7R0FDQSxNQUFBOztFQUVBLEdBQUEsV0FBQTtFQUNBLEdBQUEsYUFBQTtFQUNBLEdBQUEsa0JBQUE7OztFQUdBLFNBQUEsV0FBQSxJQUFBO0dBQ0EsR0FBQSxHQUFBLGVBQUEsSUFBQTtJQUNBLEdBQUEsY0FBQTs7T0FFQTtJQUNBLEdBQUEsY0FBQTs7OztFQUlBLFNBQUEsV0FBQSxNQUFBLEtBQUE7R0FDQSxRQUFBLFFBQUEsTUFBQSxTQUFBLE9BQUEsSUFBQTtJQUNBLEdBQUEsTUFBQSxNQUFBLEtBQUEsR0FBQTtLQUNBLEtBQUEsT0FBQSxLQUFBO0tBQ0EsT0FBQTs7SUFFQSxHQUFBLE1BQUEsU0FBQTtLQUNBLElBQUEsWUFBQSxXQUFBLE1BQUEsTUFBQTtLQUNBLEdBQUEsVUFBQTtNQUNBLE9BQUE7Ozs7R0FJQSxPQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7RUFpQ0EsU0FBQSxnQkFBQSxNQUFBO0dBQ0EsUUFBQTtJQUNBLEtBQUE7TUFDQSxPQUFBLEdBQUE7S0FDQTtJQUNBLEtBQUE7TUFDQSxPQUFBLEdBQUE7O0tBRUE7SUFDQSxLQUFBO01BQ0EsR0FBQSxPQUFBLE9BQUEsT0FBQSxNQUFBLFlBQUE7UUFDQSxPQUFBLEdBQUEsZ0NBQUE7U0FDQSxHQUFBLE9BQUEsT0FBQTs7O1VBR0E7UUFDQSxPQUFBLEdBQUE7OztLQUdBO0lBQ0EsS0FBQTs7S0FFQTtJQUNBOzs7O0VBSUEsU0FBQSxTQUFBLGFBQUEsSUFBQTtHQUNBLFlBQUE7OztFQUdBLE9BQUEsT0FBQSxtQkFBQSxVQUFBLE9BQUEsVUFBQTtHQUNBLEdBQUEsVUFBQSxVQUFBLE9BQUE7R0FDQSxHQUFBLFFBQUEsR0FBQSxPQUFBO0dBQ0EsR0FBQSxNQUFBLElBQUE7R0FDQSxHQUFBLGFBQUEsZUFBQSxnQkFBQSxHQUFBOztFQUVBLE9BQUEsSUFBQSx1QkFBQSxTQUFBLE9BQUEsU0FBQSxVQUFBLFdBQUEsV0FBQTtHQUNBLEdBQUEsUUFBQSxLQUFBLFFBQUEsa0NBQUEsQ0FBQSxFQUFBO0lBQ0EsR0FBQSxjQUFBO0lBQ0EsU0FBQTs7UUFFQSxHQUFBLFFBQUEsS0FBQSxRQUFBLGtDQUFBLENBQUEsRUFBQTtJQUNBLEdBQUEsY0FBQTs7UUFFQSxHQUFBLFFBQUEsS0FBQSxRQUFBLCtCQUFBLENBQUEsRUFBQTtJQUNBLEdBQUEsY0FBQTs7Ozs7Ozs7QUNwTEEsQ0FBQSxZQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsaUlBQUEsVUFBQSxRQUFBLE9BQUEsVUFBQSxvQkFBQSxhQUFBLGdCQUFBLFdBQUE7O0VBRUEsSUFBQSxLQUFBO0lBQ0EsR0FBQSxZQUFBO0VBQ0EsR0FBQSxRQUFBO0VBQ0EsR0FBQSxNQUFBO0VBQ0EsR0FBQSxNQUFBO0VBQ0EsR0FBQSxXQUFBO0VBQ0E7O0VBRUEsZUFBQSxpQkFBQSxPQUFBLE9BQUEsSUFBQSxLQUFBLFNBQUEsS0FBQTtHQUNBLElBQUEsYUFBQTtHQUNBLEdBQUEsT0FBQSxHQUFBLFVBQUEsU0FBQSxZQUFBO0lBQ0EsUUFBQSxRQUFBLEdBQUEsVUFBQSxZQUFBLFNBQUEsSUFBQTtLQUNBLEdBQUEsT0FBQSxJQUFBLFNBQUEsWUFBQTtNQUNBLGFBQUEsSUFBQSxNQUFBOzs7O1FBSUEsR0FBQSxHQUFBLFVBQUEsTUFBQTtJQUNBLGFBQUEsR0FBQSxVQUFBLE1BQUE7O0dBRUEsbUJBQUEsYUFBQTtHQUNBLEdBQUEsT0FBQTtHQUNBO0dBQ0E7O0VBRUEsU0FBQSxXQUFBO0dBQ0EsR0FBQSxPQUFBLFFBQUEsUUFBQSxxQ0FBQTtJQUNBLEdBQUEsT0FBQSxPQUFBLFNBQUEsY0FBQTtLQUNBLEdBQUEsV0FBQTs7U0FFQSxHQUFBLE9BQUEsT0FBQSxTQUFBLFVBQUE7S0FDQSxHQUFBLFdBQUE7O1NBRUEsR0FBQSxPQUFBLE9BQUEsU0FBQSxRQUFBO0tBQ0EsR0FBQSxXQUFBOztTQUVBLEdBQUEsT0FBQSxPQUFBLFNBQUEsYUFBQTtLQUNBLEdBQUEsV0FBQTs7UUFFQTtLQUNBLEdBQUEsV0FBQTs7OztFQUlBLFNBQUEsUUFBQTtHQUNBLEdBQUEsTUFBQTtHQUNBLEdBQUEsTUFBQTtHQUNBLFFBQUEsUUFBQSxHQUFBLE1BQUEsU0FBQSxNQUFBLElBQUE7S0FDQSxHQUFBLE1BQUEsS0FBQSxJQUFBLEtBQUEsT0FBQSxHQUFBO0tBQ0EsR0FBQSxNQUFBLEtBQUEsSUFBQSxLQUFBLE9BQUEsR0FBQTs7R0FFQSxHQUFBLFFBQUEsR0FBQSxNQUFBLFNBQUEsT0FBQSxDQUFBLEdBQUEsSUFBQSxHQUFBLE1BQUEsTUFBQSxDQUFBLEVBQUE7O0VBRUEsU0FBQSxjQUFBLElBQUE7R0FDQSxJQUFBLFFBQUE7R0FDQSxRQUFBLFFBQUEsR0FBQSxNQUFBLFNBQUEsTUFBQSxJQUFBO0tBQ0EsR0FBQSxLQUFBLE9BQUEsSUFBQTtNQUNBLFFBQUEsS0FBQTs7O0dBR0EsT0FBQTs7RUFFQSxTQUFBLGVBQUEsU0FBQTtHQUNBLElBQUEsUUFBQTtHQUNBLElBQUEsTUFBQSxRQUFBLFdBQUE7R0FDQSxJQUFBLFFBQUEsY0FBQSxRQUFBLEdBQUE7R0FDQSxJQUFBLE9BQUEsUUFBQTs7R0FFQSxRQUFBO0lBQ0EsS0FBQTtLQUNBLElBQUEsV0FBQSxTQUFBLE1BQUEsTUFBQSxTQUFBLEdBQUEsTUFBQSxXQUFBO0tBQ0EsSUFBQSxRQUFBLFVBQUEsbUJBQUEsU0FBQSxZQUFBLE9BQUEsbUJBQUEsU0FBQSxXQUFBLEtBQUEsT0FBQSxtQkFBQSxTQUFBLFdBQUEsS0FBQSxNQUFBLG1CQUFBLFNBQUEsV0FBQSxLQUFBO0tBQ0EsTUFBQSxRQUFBLFVBQUEsbUJBQUEsU0FBQSxhQUFBLE9BQUEsbUJBQUEsU0FBQSxXQUFBLEtBQUEsT0FBQSxtQkFBQSxTQUFBLFdBQUEsS0FBQTtLQUNBLE1BQUEsVUFBQTtNQUNBLE9BQUE7TUFDQSxNQUFBOztLQUVBLE1BQUEsV0FBQTtNQUNBLE9BQUEsVUFBQSxtQkFBQSxTQUFBLFlBQUEsT0FBQSxtQkFBQSxTQUFBLFdBQUEsS0FBQSxPQUFBLG1CQUFBLFNBQUEsV0FBQSxLQUFBO01BQ0EsU0FBQTtPQUNBLE9BQUE7T0FDQSxNQUFBOzs7S0FHQTs7O0dBR0EsT0FBQTs7RUFFQSxTQUFBLGdCQUFBO0dBQ0E7R0FDQSxZQUFBLE9BQUEsT0FBQSxLQUFBLFVBQUEsS0FBQTtJQUNBLEdBQUEsTUFBQTtJQUNBLEdBQUEsWUFBQSxtQkFBQTtJQUNBLFNBQUEsWUFBQTtNQUNBLEdBQUEsVUFBQSxTQUFBOzs7Ozs7RUFNQSxPQUFBLElBQUEsdUJBQUEsVUFBQTtHQUNBOzs7Ozs7O0FDM0dBLENBQUEsWUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLHVFQUFBLFVBQUEsWUFBQSxZQUFBLGdCQUFBOztJQUVBLElBQUEsS0FBQTtJQUNBLEdBQUEsYUFBQTs7Ozs7O0FDTkEsQ0FBQSxZQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsMkhBQUEsVUFBQSxRQUFBLE9BQUEsVUFBQSxvQkFBQSxhQUFBLGdCQUFBLE9BQUE7O0VBRUEsSUFBQSxLQUFBOztJQUVBLEdBQUEsUUFBQTtFQUNBLEdBQUEsUUFBQTtFQUNBLEdBQUEsTUFBQTtFQUNBLEdBQUEsTUFBQTtFQUNBLEdBQUEsV0FBQTtFQUNBO0lBQ0EsR0FBQSxVQUFBO01BQ0EsUUFBQTtRQUNBLFVBQUEsVUFBQTtVQUNBLE9BQUEsR0FBQTs7SUFFQSxrQkFBQSxVQUFBO0tBQ0EsSUFBQSxPQUFBO01BQ0EsT0FBQTs7S0FFQSxHQUFBLE1BQUEsU0FBQSxLQUFBOzs7TUFHQSxVQUFBOzs7RUFHQTs7O0VBR0EsU0FBQSxRQUFBO0dBQ0EsUUFBQSxJQUFBLEdBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztFQXFCQSxTQUFBLFdBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7RUFtQkEsU0FBQSxRQUFBO0dBQ0EsR0FBQSxNQUFBO0dBQ0EsR0FBQSxNQUFBO0dBQ0EsUUFBQSxRQUFBLEdBQUEsTUFBQSxTQUFBLE1BQUEsSUFBQTtLQUNBLEdBQUEsTUFBQSxLQUFBLElBQUEsS0FBQSxPQUFBLEdBQUE7S0FDQSxHQUFBLE1BQUEsS0FBQSxJQUFBLEtBQUEsT0FBQSxHQUFBOztHQUVBLEdBQUEsUUFBQSxHQUFBLE1BQUEsU0FBQSxPQUFBLENBQUEsR0FBQSxJQUFBLEdBQUEsTUFBQSxNQUFBLENBQUEsRUFBQTs7RUFFQSxTQUFBLGNBQUEsSUFBQTtHQUNBLElBQUEsUUFBQTtHQUNBLFFBQUEsUUFBQSxHQUFBLE1BQUEsU0FBQSxNQUFBLElBQUE7S0FDQSxHQUFBLEtBQUEsT0FBQSxJQUFBO01BQ0EsUUFBQSxLQUFBOzs7R0FHQSxPQUFBOztFQUVBLFNBQUEsZUFBQSxTQUFBO0dBQ0EsSUFBQSxRQUFBO0dBQ0EsSUFBQSxNQUFBLFFBQUEsV0FBQTtHQUNBLElBQUEsUUFBQSxjQUFBLFFBQUEsR0FBQTtHQUNBLElBQUEsT0FBQSxRQUFBOztHQUVBLFFBQUE7SUFDQSxLQUFBO0tBQ0EsSUFBQSxXQUFBLFNBQUEsTUFBQSxNQUFBLFNBQUEsR0FBQSxNQUFBLFdBQUE7S0FDQSxJQUFBLFFBQUEsVUFBQSxtQkFBQSxTQUFBLFlBQUEsT0FBQSxtQkFBQSxTQUFBLFdBQUEsS0FBQSxPQUFBLG1CQUFBLFNBQUEsV0FBQSxLQUFBLE1BQUEsbUJBQUEsU0FBQSxXQUFBLEtBQUE7S0FDQSxNQUFBLFFBQUEsVUFBQSxtQkFBQSxTQUFBLGFBQUEsT0FBQSxtQkFBQSxTQUFBLFdBQUEsS0FBQSxPQUFBLG1CQUFBLFNBQUEsV0FBQSxLQUFBO0tBQ0EsTUFBQSxVQUFBO01BQ0EsT0FBQTtNQUNBLE1BQUE7O0tBRUEsTUFBQSxXQUFBO01BQ0EsT0FBQSxVQUFBLG1CQUFBLFNBQUEsWUFBQSxPQUFBLG1CQUFBLFNBQUEsV0FBQSxLQUFBLE9BQUEsbUJBQUEsU0FBQSxXQUFBLEtBQUE7TUFDQSxTQUFBO09BQ0EsT0FBQTtPQUNBLE1BQUE7OztLQUdBOzs7R0FHQSxPQUFBOztFQUVBLFNBQUEsZ0JBQUE7R0FDQTtHQUNBLFlBQUEsT0FBQSxPQUFBLEtBQUEsVUFBQSxLQUFBO0lBQ0EsR0FBQSxNQUFBO0lBQ0EsR0FBQSxZQUFBLG1CQUFBO0lBQ0EsU0FBQSxZQUFBO01BQ0EsR0FBQSxVQUFBLFNBQUE7Ozs7OztFQU1BLE9BQUEsSUFBQSx1QkFBQSxVQUFBO0dBQ0E7Ozs7Ozs7QUNsSUEsQ0FBQSxVQUFBO0lBQ0E7SUFDQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSxvQ0FBQSxTQUFBLGVBQUE7UUFDQSxJQUFBLEtBQUE7UUFDQSxHQUFBLFlBQUEsZUFBQTs7OztBQ0pBLENBQUEsV0FBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLDZJQUFBLFNBQUEsUUFBQSxRQUFBLFFBQUEsVUFBQSxXQUFBLFdBQUEsZ0JBQUEsb0JBQUEsUUFBQTs7RUFFQSxJQUFBLEtBQUE7RUFDQSxHQUFBLFVBQUE7RUFDQSxHQUFBLFNBQUE7RUFDQSxHQUFBLGNBQUE7RUFDQSxHQUFBLFlBQUE7RUFDQSxHQUFBLE9BQUE7RUFDQSxHQUFBLFFBQUE7R0FDQSxJQUFBLENBQUE7R0FDQSxJQUFBOztFQUVBLEdBQUEsVUFBQTtFQUNBLEdBQUEsYUFBQTtFQUNBLEdBQUEsWUFBQTtFQUNBLEdBQUEsVUFBQTtFQUNBLEdBQUEsY0FBQTtFQUNBOztFQUVBLFNBQUEsVUFBQTtHQUNBLG1CQUFBLFNBQUE7R0FDQSxtQkFBQSxhQUFBO0dBQ0EsU0FBQSxVQUFBO0lBQ0EsR0FBQSxPQUFBLE9BQUEsS0FBQTtLQUNBLElBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxHQUFBLFVBQUEsTUFBQSxRQUFBLElBQUE7TUFDQSxHQUFBLEdBQUEsVUFBQSxNQUFBLEdBQUEsUUFBQSxPQUFBLE9BQUEsS0FBQTtPQUNBLEdBQUEsVUFBQTs7OztTQUlBLEdBQUEsQ0FBQSxHQUFBLE9BQUE7S0FDQSxHQUFBLFNBQUE7Ozs7Ozs7RUFPQSxTQUFBLFNBQUEsS0FBQTtHQUNBLFNBQUEsVUFBQTs7OztHQUlBO0VBQ0EsU0FBQSxhQUFBO0dBQ0EsR0FBQSxPQUFBLFFBQUEsUUFBQSwyQkFBQTtLQUNBLE9BQUEsR0FBQSxnQ0FBQSxDQUFBLEtBQUEsR0FBQTs7T0FFQTtJQUNBLE9BQUEsR0FBQSwyQkFBQSxDQUFBLEdBQUEsR0FBQSxVQUFBLElBQUEsS0FBQSxHQUFBLFVBQUEsTUFBQSxLQUFBLEdBQUE7OztFQUdBLFNBQUEsUUFBQSxTQUFBO0dBQ0EsSUFBQSxPQUFBLEdBQUEsS0FBQSxRQUFBLFdBQUE7R0FDQSxPQUFBOzs7RUFHQSxTQUFBLFlBQUE7R0FDQSxJQUFBLENBQUEsR0FBQSxTQUFBO0lBQ0EsT0FBQTs7O0dBR0EsT0FBQSxDQUFBLEdBQUEsUUFBQSxHQUFBLFdBQUEsS0FBQTtHQUNBOztFQUVBLFNBQUEsV0FBQSxLQUFBO0dBQ0EsR0FBQSxVQUFBO0dBQ0E7R0FDQTs7RUFFQSxTQUFBLHFCQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlQTtFQUNBLFNBQUEsYUFBQSxJQUFBLEVBQUE7R0FDQSxJQUFBLElBQUEsbUJBQUEsZUFBQSxJQUFBLFFBQUEsV0FBQSxtQkFBQSxLQUFBO0dBQ0EsSUFBQSxPQUFBLEVBQUEsU0FBQSxhQUFBO0lBQ0EsR0FBQSxVQUFBO1VBQ0E7SUFDQSxPQUFBLE1BQUE7OztFQUdBLFNBQUEsUUFBQSxNQUFBO0dBQ0EsR0FBQSxPQUFBO0dBQ0EsZUFBQSxpQkFBQSxHQUFBLFVBQUEsSUFBQSxNQUFBLEtBQUEsU0FBQSxLQUFBO0lBQ0EsR0FBQSxPQUFBLFFBQUEsUUFBQSxnQ0FBQTtLQUNBLE9BQUEsR0FBQSxnQ0FBQSxDQUFBLEtBQUE7O1NBRUEsR0FBQSxPQUFBLFFBQUEsUUFBQSwyQkFBQTtLQUNBLE9BQUEsR0FBQSwyQkFBQSxDQUFBLEtBQUE7O1FBRUE7S0FDQSxPQUFBLEdBQUEsMkJBQUEsQ0FBQSxLQUFBOztJQUVBLEdBQUEsT0FBQTtJQUNBLFFBQUEsUUFBQSxHQUFBLE1BQUEsU0FBQSxLQUFBO0tBQ0EsS0FBQSxPQUFBLEdBQUEsS0FBQSxRQUFBLE9BQUE7S0FDQSxHQUFBLEdBQUEsUUFBQTtNQUNBLEdBQUEsS0FBQSxPQUFBLEdBQUEsUUFBQSxJQUFBO09BQ0EsV0FBQTs7OztLQUlBLEdBQUEsTUFBQSxPQUFBLEdBQUEsSUFBQSxDQUFBLEdBQUEsTUFBQSxLQUFBLFdBQUEsS0FBQTtLQUNBLEdBQUEsTUFBQSxPQUFBLEdBQUEsSUFBQSxDQUFBLEdBQUEsTUFBQSxLQUFBLFdBQUEsS0FBQTs7O0tBR0EsR0FBQSxnQkFBQTtNQUNBLE9BQUEsR0FBQSxVQUFBLE9BQUEsY0FBQTtNQUNBLE9BQUE7TUFDQSxNQUFBLEdBQUEsS0FBQTs7O0lBR0E7SUFDQSxHQUFBLGNBQUEsR0FBQSxNQUFBLFNBQUEsT0FBQSxDQUFBLEdBQUEsTUFBQSxJQUFBLEdBQUEsTUFBQSxNQUFBLE1BQUEsQ0FBQSxFQUFBO0lBQ0EsbUJBQUEsUUFBQSxHQUFBLE1BQUEsR0FBQSxVQUFBLE9BQUEsWUFBQTs7Ozs7OztFQU9BLFNBQUEsZUFBQSxTQUFBO0dBQ0EsSUFBQSxRQUFBO0dBQ0EsSUFBQSxNQUFBLFFBQUEsV0FBQSxtQkFBQSxLQUFBO0dBQ0EsSUFBQSxTQUFBLG1CQUFBLGVBQUE7O0dBRUEsSUFBQSxRQUFBO0dBQ0EsSUFBQSxPQUFBLFFBQUE7R0FDQSxRQUFBLFdBQUE7R0FDQSxHQUFBLEdBQUEsUUFBQTtJQUNBLEdBQUEsR0FBQSxRQUFBLE9BQUEsSUFBQTtNQUNBLFFBQUEsV0FBQTs7Ozs7O0dBTUEsUUFBQTtJQUNBLEtBQUE7S0FDQSxJQUFBLE9BQUEsT0FBQSxVQUFBLGVBQUEsT0FBQSxVQUFBLEtBQUE7O01BRUEsSUFBQSxZQUFBLFNBQUEsR0FBQSxZQUFBLFdBQUEsT0FBQSxZQUFBO01BQ0EsSUFBQSxRQUFBLFVBQUEsbUJBQUEsUUFBQSxZQUFBLE9BQUEsbUJBQUEsUUFBQSxXQUFBLEtBQUEsT0FBQSxtQkFBQSxRQUFBLFdBQUEsS0FBQSxNQUFBLG1CQUFBLFFBQUEsV0FBQSxLQUFBO01BQ0EsTUFBQSxRQUFBLFVBQUEsbUJBQUEsUUFBQSxZQUFBLE9BQUEsbUJBQUEsUUFBQSxXQUFBLEtBQUEsT0FBQSxtQkFBQSxRQUFBLFdBQUEsS0FBQTtNQUNBLE1BQUEsVUFBQTtPQUNBLE9BQUE7T0FDQSxNQUFBOztNQUVBLE1BQUEsV0FBQTtPQUNBLE9BQUEsVUFBQSxtQkFBQSxRQUFBLFlBQUEsT0FBQSxtQkFBQSxRQUFBLFdBQUEsS0FBQSxPQUFBLG1CQUFBLFFBQUEsV0FBQSxLQUFBO09BQ0EsU0FBQTtRQUNBLE9BQUE7UUFDQSxNQUFBOzs7O1lBSUE7TUFDQSxNQUFBLFFBQUE7TUFDQSxNQUFBLFVBQUE7T0FDQSxPQUFBO09BQ0EsTUFBQTs7OztNQUlBOztHQUVBLE9BQUE7R0FDQTs7RUFFQSxPQUFBLElBQUE7R0FDQSxTQUFBLE9BQUEsU0FBQSxVQUFBLFdBQUEsV0FBQTtJQUNBLEdBQUEsUUFBQSxRQUFBLDJCQUFBOzs7Ozs7OztBQzNMQSxDQUFBLFlBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSw4Q0FBQSxVQUFBLFNBQUEsTUFBQTs7RUFFQSxJQUFBLEtBQUE7SUFDQSxHQUFBLE9BQUE7SUFDQSxHQUFBLGdCQUFBO0VBQ0EsR0FBQSxxQkFBQTs7SUFFQSxTQUFBLGNBQUEsT0FBQTtHQUNBLE9BQUEsR0FBQSxPQUFBLFFBQUEsV0FBQSxHQUFBLE1BQUEsQ0FBQSxRQUFBO0dBQ0E7O0VBRUEsU0FBQSxtQkFBQSxNQUFBLE9BQUE7OztHQUdBOzs7Ozs7QUNqQkEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEseURBQUEsU0FBQSxZQUFBLFFBQUEsT0FBQSxPQUFBO1FBQ0EsSUFBQSxLQUFBO1FBQ0EsR0FBQSxZQUFBO1FBQ0EsR0FBQSxVQUFBO1FBQ0EsR0FBQSxnQkFBQTs7UUFFQSxHQUFBLE9BQUE7VUFDQSxNQUFBO1VBQ0EsU0FBQTs7O1FBR0E7O1FBRUEsU0FBQSxVQUFBO1VBQ0EsR0FBQTs7O1FBR0EsU0FBQSxlQUFBOztVQUVBLEdBQUEsTUFBQSxrQkFBQTs7OztRQUlBLFNBQUEsU0FBQTtVQUNBLE1BQUEsTUFBQSxHQUFBLE1BQUEsS0FBQSxTQUFBLFNBQUE7WUFDQSxPQUFBLFFBQUE7WUFDQSxRQUFBLElBQUEsV0FBQTtZQUNBLE9BQUEsR0FBQSxXQUFBLGFBQUEsTUFBQSxRQUFBLFlBQUEsV0FBQSxhQUFBO2FBQ0EsTUFBQSxTQUFBLFNBQUE7WUFDQSxPQUFBLE1BQUEsd0NBQUE7Ozs7Ozs7QUNoQ0EsQ0FBQSxZQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsaURBQUEsVUFBQSxhQUFBLG9CQUFBOztFQUVBLElBQUEsS0FBQTtFQUNBLElBQUEsU0FBQSxtQkFBQSxLQUFBOztFQUVBLEdBQUEsV0FBQTs7R0FFQSxRQUFBOztFQUVBLEdBQUEsU0FBQTtHQUNBLEtBQUE7R0FDQSxLQUFBO0dBQ0EsTUFBQTs7RUFFQSxHQUFBLFNBQUE7R0FDQSxZQUFBO0lBQ0EsS0FBQTtLQUNBLE1BQUE7S0FDQSxLQUFBLHNGQUFBO0tBQ0EsTUFBQTtLQUNBLGFBQUE7T0FDQSxRQUFBO09BQ0EsaUJBQUE7Ozs7OztFQU1BLEdBQUEsWUFBQTtHQUNBLFdBQUE7SUFDQSxLQUFBO0lBQ0EsS0FBQTs7R0FFQSxXQUFBO0lBQ0EsS0FBQSxDQUFBO0lBQ0EsS0FBQSxDQUFBOzs7RUFHQSxZQUFBLE9BQUEsT0FBQSxLQUFBLFVBQUEsS0FBQTtHQUNBLG1CQUFBLE9BQUE7R0FDQSxJQUFBLE1BQUEscUVBQUEsbUJBQUEsWUFBQSwrQ0FBQSxtQkFBQTtHQUNBLElBQUEsUUFBQSxJQUFBLEVBQUEsVUFBQSxVQUFBO0lBQ0EsS0FBQTtJQUNBLE9BQUE7SUFDQSxpQkFBQSxDQUFBLG1CQUFBLFlBQUE7SUFDQSxhQUFBO0lBQ0Esc0JBQUEsVUFBQSxTQUFBO0tBQ0EsT0FBQSxRQUFBLFdBQUE7O0lBRUEsUUFBQSxVQUFBLFNBQUEsU0FBQTs7S0FFQSxPQUFBOzs7R0FHQSxJQUFBLFNBQUEsbUJBQUEsU0FBQTtHQUNBLElBQUEsY0FBQSxFQUFBLFVBQUEsbUZBQUEsT0FBQTtNQUNBLFFBQUE7TUFDQSxpQkFBQTs7R0FFQSxJQUFBLFNBQUE7R0FDQSxZQUFBOzs7OztBQy9EQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSwwRUFBQSxTQUFBLFFBQUEsWUFBQSxvQkFBQSxRQUFBOztRQUVBLElBQUEsS0FBQTtRQUNBLEdBQUEsWUFBQSxPQUFBLFFBQUEsR0FBQTtRQUNBLEdBQUEsVUFBQSxPQUFBLFFBQUEsR0FBQTtRQUNBLEdBQUEsT0FBQSxPQUFBLFFBQUEsR0FBQTtRQUNBLEdBQUEsVUFBQTtRQUNBLEdBQUEsWUFBQSxtQkFBQTtRQUNBLEdBQUEsVUFBQTtRQUNBLEdBQUEsWUFBQTtRQUNBLEdBQUEsY0FBQTs7UUFFQSxTQUFBLFdBQUE7VUFDQSxJQUFBLE9BQUE7VUFDQSxRQUFBLFFBQUEsR0FBQSxNQUFBLFNBQUEsTUFBQTtZQUNBLEtBQUEsR0FBQSxVQUFBLG9CQUFBLFdBQUEsS0FBQSxHQUFBLFVBQUE7WUFDQSxLQUFBLFdBQUEsU0FBQSxLQUFBOztVQUVBLElBQUEsU0FBQSxRQUFBLFdBQUEsR0FBQSxNQUFBLENBQUEsR0FBQSxVQUFBLGtCQUFBLFVBQUE7VUFDQSxLQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsT0FBQSxRQUFBLEtBQUE7WUFDQSxJQUFBLE9BQUEsR0FBQSxPQUFBLEdBQUEsUUFBQSxLQUFBO2NBQ0EsT0FBQSxJQUFBOzs7VUFHQSxHQUFBLFFBQUEsR0FBQSxVQUFBLGlCQUFBLFdBQUE7VUFDQSxHQUFBLGdCQUFBO2NBQ0EsTUFBQSxHQUFBLFVBQUE7Y0FDQSxNQUFBLEdBQUEsVUFBQSxpQkFBQTs7O1FBR0EsU0FBQSxRQUFBLFFBQUE7VUFDQSxJQUFBLFNBQUEsUUFBQSxXQUFBLEdBQUEsTUFBQSxDQUFBLEdBQUEsVUFBQSxrQkFBQSxVQUFBO1VBQ0EsSUFBQSxPQUFBO1VBQ0EsUUFBQSxRQUFBLFFBQUEsU0FBQSxNQUFBLElBQUE7WUFDQSxHQUFBLEtBQUEsV0FBQSxRQUFBLFFBQUE7Y0FDQSxPQUFBOzs7VUFHQSxPQUFBLEtBQUE7O1FBRUEsU0FBQSxZQUFBO09BQ0EsSUFBQSxDQUFBLEdBQUEsU0FBQTtRQUNBLE9BQUE7O09BRUEsT0FBQSxDQUFBLEdBQUEsUUFBQSxHQUFBLFdBQUEsS0FBQTtPQUNBOztNQUVBLFNBQUEsY0FBQTtPQUNBLElBQUEsQ0FBQSxHQUFBLFNBQUE7UUFDQSxPQUFBOztPQUVBLE9BQUEsR0FBQSxRQUFBLGlCQUFBLElBQUEsa0JBQUE7T0FDQTs7UUFFQSxPQUFBLE9BQUEsY0FBQSxVQUFBLEdBQUEsR0FBQTtVQUNBLElBQUEsTUFBQSxHQUFBO1lBQ0E7OztZQUdBLEdBQUEsRUFBQSxJQUFBO2NBQ0EsR0FBQSxVQUFBLE9BQUEsbUJBQUEsU0FBQSxFQUFBLEtBQUEsV0FBQTs7WUFFQTtZQUNBLGdCQUFBLEVBQUE7Ozs7Ozs7OztBQ2xFQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSxvQ0FBQSxTQUFBLFFBQUEsT0FBQTs7Ozs7O0FDSEEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsY0FBQSxVQUFBOzs7Ozs7QUNIQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSx5Q0FBQSxTQUFBLFFBQUEsYUFBQTs7RUFFQSxPQUFBLGVBQUEsVUFBQTtHQUNBLGFBQUEsS0FBQTs7O0VBR0EsT0FBQSxhQUFBLFVBQUE7R0FDQSxhQUFBLE1BQUE7Ozs7Ozs7QUNWQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSwwQkFBQSxVQUFBOzs7Ozs7QUNIQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSxZQUFBLFVBQUE7Ozs7OztBQ0hBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLDhEQUFBLFNBQUEsUUFBQSxlQUFBLFlBQUE7UUFDQSxJQUFBLEtBQUE7UUFDQSxHQUFBLGVBQUE7UUFDQSxHQUFBLGFBQUEsUUFBQSxPQUFBLFFBQUEsR0FBQTs7UUFFQSxHQUFBLE9BQUEsVUFBQTs7WUFFQSxZQUFBLEtBQUEsa0JBQUEsR0FBQSxjQUFBLEtBQUEsU0FBQSxLQUFBO2NBQ0EsT0FBQSxRQUFBLEdBQUEsY0FBQSxLQUFBO2NBQ0EsT0FBQSxRQUFBLEdBQUEsS0FBQSxlQUFBO2NBQ0EsY0FBQTs7Ozs7UUFLQSxHQUFBLE9BQUEsVUFBQTtTQUNBLGNBQUE7Ozs7Ozs7QUNuQkEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsMERBQUEsU0FBQSxRQUFBLFlBQUEsY0FBQTs7TUFFQSxJQUFBLEtBQUE7TUFDQSxHQUFBLE9BQUE7TUFDQSxHQUFBLEtBQUEsUUFBQSxPQUFBLFFBQUEsR0FBQTs7TUFFQSxHQUFBLE9BQUEsVUFBQTs7VUFFQSxZQUFBLEtBQUEsa0JBQUEsR0FBQSxNQUFBLEtBQUEsU0FBQSxLQUFBO1lBQ0EsT0FBQSxRQUFBLEdBQUEsYUFBQSxLQUFBO1lBQ0EsT0FBQSxRQUFBLEdBQUEsS0FBQSxPQUFBO1lBQ0EsY0FBQTs7Ozs7TUFLQSxHQUFBLE9BQUEsVUFBQTtRQUNBLGNBQUE7Ozs7Ozs7O0FDcEJBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLDJDQUFBLFNBQUEsUUFBQSxjQUFBOztRQUVBLE9BQUEsT0FBQSxVQUFBO1lBQ0EsUUFBQSxJQUFBLE9BQUE7WUFDQSxPQUFBLEdBQUE7WUFDQSxjQUFBOzs7UUFHQSxPQUFBLE9BQUEsVUFBQTtTQUNBLGNBQUE7Ozs7Ozs7QUNaQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSw0Q0FBQSxTQUFBLFFBQUEsY0FBQTs7UUFFQSxPQUFBLE9BQUEsVUFBQTs7WUFFQSxjQUFBOzs7UUFHQSxPQUFBLE9BQUEsVUFBQTtTQUNBLGNBQUE7Ozs7Ozs7QUNYQSxDQUFBLFlBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSxnRUFBQSxVQUFBLFFBQUEsY0FBQSxlQUFBO0VBQ0EsT0FBQSxRQUFBLEdBQUEsbUJBQUE7RUFDQSxPQUFBLFFBQUEsR0FBQSxjQUFBO0VBQ0EsT0FBQSxRQUFBLEdBQUEsVUFBQTtFQUNBLE9BQUEsUUFBQSxHQUFBLGVBQUE7RUFDQSxPQUFBLFFBQUEsR0FBQSxhQUFBO0VBQ0EsT0FBQSxRQUFBLEdBQUEsV0FBQTtFQUNBLE9BQUEsT0FBQSxZQUFBOztHQUVBLFFBQUEsUUFBQSxPQUFBLFFBQUEsR0FBQSxLQUFBLEdBQUEsTUFBQSxVQUFBLE1BQUEsS0FBQTtJQUNBLElBQUEsT0FBQSxRQUFBO0tBQ0EsSUFBQSxPQUFBLGFBQUEsYUFBQSxRQUFBLGFBQUE7TUFDQSxhQUFBLGFBQUEsS0FBQTtPQUNBLGFBQUE7T0FDQSxPQUFBOzs7S0FHQSxJQUFBLE9BQUEsYUFBQSxhQUFBO0tBQ0EsSUFBQSxPQUFBLFFBQUEsR0FBQSxhQUFBO01BQ0EsS0FBQSxlQUFBLE9BQUEsUUFBQSxHQUFBOztLQUVBLElBQUEsT0FBQSxRQUFBLEdBQUEsWUFBQTtNQUNBLEtBQUEsT0FBQSxPQUFBLFFBQUEsR0FBQTs7S0FFQSxJQUFBLE9BQUEsUUFBQSxHQUFBLGNBQUE7TUFDQSxLQUFBLGFBQUEsT0FBQSxRQUFBLEdBQUE7O0tBRUEsSUFBQSxPQUFBLFFBQUEsR0FBQSxVQUFBO01BQ0EsS0FBQSxZQUFBLE9BQUEsUUFBQSxHQUFBOztLQUVBLElBQUEsT0FBQSxRQUFBLEdBQUEsU0FBQTs7TUFFQSxJQUFBLE9BQUEsS0FBQSxTQUFBLGFBQUE7T0FDQSxLQUFBLFFBQUEsT0FBQSxRQUFBLEdBQUE7T0FDQSxLQUFBLFdBQUEsT0FBQSxRQUFBLEdBQUEsU0FBQTs7Ozs7O0dBTUEsY0FBQTtHQUNBLGFBQUE7Ozs7RUFJQSxPQUFBLE9BQUEsWUFBQTtHQUNBLE9BQUEsUUFBQSxHQUFBLGNBQUE7R0FDQSxPQUFBLFFBQUEsR0FBQSxlQUFBO0dBQ0EsT0FBQSxRQUFBLEdBQUEsYUFBQTtHQUNBLGNBQUE7Ozs7Ozs7QUNwREEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsOENBQUEsU0FBQSxRQUFBLGNBQUE7UUFDQSxPQUFBLE9BQUEsT0FBQSxRQUFBLEdBQUE7UUFDQSxHQUFBLE9BQUEsT0FBQSxRQUFBLEdBQUEsS0FBQSxNQUFBLE9BQUEsU0FBQSxZQUFBO1VBQ0EsT0FBQSxRQUFBLEdBQUEsS0FBQSxNQUFBLE9BQUEsUUFBQTs7WUFFQTtVQUNBLEdBQUEsT0FBQSxRQUFBLEdBQUEsS0FBQSxNQUFBLE9BQUEsTUFBQSxNQUFBO1lBQ0EsT0FBQSxRQUFBLE9BQUEsUUFBQSxHQUFBLEtBQUEsTUFBQSxPQUFBLE1BQUE7O1VBRUEsR0FBQSxPQUFBLFFBQUEsR0FBQSxLQUFBLE1BQUEsT0FBQSxNQUFBLFlBQUE7WUFDQSxPQUFBLGNBQUEsT0FBQSxRQUFBLEdBQUEsS0FBQSxNQUFBLE9BQUEsTUFBQTs7OztRQUlBLE9BQUEsT0FBQSxVQUFBO1VBQ0EsT0FBQSxRQUFBLEdBQUEsS0FBQSxNQUFBLE9BQUEsTUFBQSxRQUFBLE9BQUE7VUFDQSxPQUFBLFFBQUEsR0FBQSxLQUFBLE1BQUEsT0FBQSxNQUFBLGNBQUEsT0FBQTtVQUNBLGNBQUE7OztRQUdBLE9BQUEsT0FBQSxVQUFBO1NBQ0EsY0FBQTs7Ozs7OztBQ3hCQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSwyQ0FBQSxTQUFBLFFBQUEsY0FBQTtRQUNBLE9BQUEsT0FBQSxPQUFBLFFBQUEsR0FBQSxTQUFBO1FBQ0EsT0FBQSxPQUFBLFVBQUE7O1lBRUEsY0FBQTs7O1FBR0EsT0FBQSxPQUFBLFVBQUE7U0FDQSxjQUFBOzs7Ozs7O0FDWEEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsd0RBQUEsU0FBQSxPQUFBLFFBQUEsY0FBQTs7UUFFQSxPQUFBLE9BQUEsVUFBQTtZQUNBLE9BQUEsR0FBQSxXQUFBO1lBQ0EsT0FBQSxHQUFBLEtBQUEsWUFBQSxPQUFBLEdBQUEsVUFBQTtZQUNBLE9BQUEsR0FBQSxLQUFBLGdCQUFBLE9BQUEsR0FBQSxVQUFBO1lBQ0EsT0FBQSxHQUFBO1dBQ0EsY0FBQTs7O1FBR0EsT0FBQSxPQUFBLFVBQUE7VUFDQSxPQUFBLEdBQUE7U0FDQSxjQUFBOzs7Ozs7O0FDZkEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsdURBQUEsU0FBQSxRQUFBLFFBQUEsY0FBQTs7UUFFQSxPQUFBLE9BQUEsVUFBQTs7WUFFQSxPQUFBLEdBQUE7WUFDQSxPQUFBLEdBQUEsT0FBQSxRQUFBO1lBQ0EsY0FBQTs7O1FBR0EsT0FBQSxPQUFBLFVBQUE7U0FDQSxjQUFBOzs7Ozs7O0FDYkEsQ0FBQSxZQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEscUVBQUEsVUFBQSxRQUFBLGNBQUEsZUFBQTtFQUNBLElBQUEsS0FBQTtFQUNBLElBQUEsT0FBQSxhQUFBO0VBQ0EsR0FBQSxNQUFBLEtBQUE7RUFDQSxHQUFBLE9BQUEsYUFBQTtFQUNBLEdBQUEsT0FBQSxZQUFBO0dBQ0EsY0FBQTs7O0VBR0EsR0FBQSxPQUFBLFlBQUE7R0FDQSxjQUFBOztFQUVBLE9BQUEsT0FBQSxXQUFBLFVBQUEsR0FBQSxHQUFBO0dBQ0EsSUFBQSxNQUFBLEdBQUE7SUFDQTs7R0FFQSxRQUFBLFFBQUEsR0FBQSxVQUFBLE1BQUEsS0FBQTtJQUNBLElBQUEsS0FBQSxNQUFBLEtBQUEsR0FBQSxHQUFBLE1BQUE7S0FDQSxRQUFBLFFBQUEsS0FBQSxNQUFBLFFBQUEsVUFBQSxPQUFBLEdBQUE7TUFDQSxJQUFBLE1BQUEsUUFBQSxLQUFBLE1BQUEsUUFBQSxHQUFBO09BQ0EsYUFBQTtPQUNBLEtBQUEsTUFBQSxPQUFBLE9BQUEsR0FBQTthQUNBLElBQUEsTUFBQSxRQUFBLEdBQUE7T0FDQSxJQUFBLE1BQUEsVUFBQSxHQUFBLEtBQUE7UUFDQSxhQUFBO1FBQ0EsS0FBQSxNQUFBLE9BQUEsT0FBQSxHQUFBOzs7O0tBSUEsR0FBQSxLQUFBLE9BQUEsS0FBQTs7O0dBR0EsSUFBQSxHQUFBLEtBQUEsVUFBQSxHQUFBO0lBQ0EsY0FBQTs7S0FFQTs7Ozs7QUN0Q0EsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGtCQUFBLFdBQUEsMEJBQUEsU0FBQSxVQUFBO0VBQ0EsT0FBQTtRQUNBLFVBQUE7UUFDQSxNQUFBLFNBQUEsUUFBQSxVQUFBO1lBQ0EsU0FBQSxVQUFBO2dCQUNBLFNBQUEsR0FBQTtlQUNBOzs7Ozs7OztBQ1RBLENBQUEsWUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLFlBQUEsWUFBQTs7RUFFQSxJQUFBLEtBQUE7RUFDQSxHQUFBLFFBQUE7O0VBRUEsU0FBQSxNQUFBLE1BQUE7R0FDQSxHQUFBLENBQUEsR0FBQSxNQUFBO0dBQ0EsT0FBQSxHQUFBLEtBQUEsS0FBQTs7Ozs7O0FDVkEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGtCQUFBLFdBQUEsUUFBQSxXQUFBOztFQUVBLE9BQUE7R0FDQSxVQUFBO0dBQ0EsYUFBQTtHQUNBLFlBQUE7R0FDQSxjQUFBO0dBQ0EsTUFBQTtHQUNBLGtCQUFBO0lBQ0EsTUFBQTtJQUNBLFNBQUE7SUFDQSxXQUFBOztHQUVBLE1BQUEsVUFBQSxPQUFBLFNBQUEsT0FBQTs7Ozs7Ozs7O0FDaEJBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsUUFBQSxvQkFBQSxZQUFBLGVBQUEsVUFBQTs7Ozs7OztBQ0hBLENBQUEsWUFBQTtDQUNBOztDQUVBLFNBQUEsY0FBQSxXQUFBLE9BQUE7RUFDQSxJQUFBLFlBQUE7RUFDQSxJQUFBLE9BQUEsU0FBQSxlQUFBO0VBQ0EsR0FBQSxRQUFBLEtBQUE7R0FDQSxRQUFBLFFBQUEsVUFBQSxLQUFBLFFBQUEsT0FBQSwrQ0FBQSxZQUFBOztFQUVBO0VBQ0EsU0FBQSxZQUFBLFNBQUEsTUFBQSxPQUFBLFNBQUE7R0FDQSxRQUFBLFFBQUEsU0FBQSxjQUFBLE1BQUEsWUFBQSxLQUFBO0dBQ0EsUUFBQSxRQUFBLFNBQUEsY0FBQSxNQUFBLFlBQUEsSUFBQSxXQUFBOztHQUVBLE9BQUEsZUFBQSxPQUFBLE1BQUE7O0VBRUEsU0FBQSxjQUFBO0dBQ0EsUUFBQSxRQUFBLFNBQUEsY0FBQSxNQUFBLFlBQUEsSUFBQSxXQUFBOztFQUVBLFNBQUEsZUFBQSxPQUFBLEdBQUEsU0FBQTtHQUNBLElBQUEsT0FBQSxNQUFBO0dBQ0EsSUFBQSxVQUFBO0dBQ0EsSUFBQSxVQUFBO0dBQ0EsSUFBQSxNQUFBLFFBQUEsS0FBQSxPQUFBO0dBQ0EsSUFBQSxRQUFBLE9BQUE7R0FDQSxJQUFBLE1BQUEsUUFBQSxRQUFBLFNBQUEsY0FBQSxPQUFBO0dBQ0EsSUFBQSxNQUFBLFNBQUEsY0FBQSxNQUFBO0dBQ0EsSUFBQSxRQUFBLElBQUEsd0JBQUEsTUFBQSxFQUFBLElBQUEsTUFBQTtHQUNBLElBQUEsU0FBQSxJQUFBLHdCQUFBLE9BQUEsRUFBQSxJQUFBLEVBQUEsU0FBQTtHQUNBLE9BQUEsUUFBQSxRQUFBLFNBQUEsY0FBQSxPQUFBLElBQUEsT0FBQSxRQUFBLE1BQUEsSUFBQSxRQUFBLFNBQUE7O0VBRUEsT0FBQTtHQUNBLGFBQUE7R0FDQSxhQUFBO0dBQ0EsZ0JBQUE7OztDQUdBLFFBQUEsT0FBQSxrQkFBQSxVQUFBLHdDQUFBLFVBQUEsVUFBQSxjQUFBO0VBQ0EsSUFBQTtFQUNBLFdBQUEsWUFBQTtHQUNBLE9BQUE7SUFDQSxPQUFBO0lBQ0EsUUFBQTtJQUNBLGdCQUFBO0lBQ0EsV0FBQTtJQUNBLEtBQUE7SUFDQSxPQUFBO0lBQ0EsUUFBQTtJQUNBLFNBQUE7SUFDQSxTQUFBO0lBQ0EsUUFBQTtJQUNBLFlBQUEsR0FBQSxNQUFBLFVBQUEsT0FBQSxDQUFBLE1BQUEsT0FBQSxNQUFBLENBQUEsV0FBQTtJQUNBLFlBQUE7SUFDQSxjQUFBO0lBQ0EsVUFBQTtJQUNBLFNBQUEsY0FBQSxtQkFBQTs7O0VBR0EsT0FBQTtHQUNBLFVBQUE7R0FDQSxPQUFBO0lBQ0EsV0FBQTtJQUNBLFdBQUE7SUFDQSxTQUFBO0lBQ0EsWUFBQTtJQUNBLFNBQUE7SUFDQSxTQUFBOztHQUVBLFNBQUE7R0FDQSxNQUFBLFVBQUEsT0FBQSxNQUFBLE9BQUEsU0FBQTtJQUNBLElBQUEsVUFBQSxRQUFBLE9BQUEsWUFBQTtJQUNBLElBQUEsUUFBQTtLQUNBLFFBQUE7S0FDQSxTQUFBO0tBQ0EsU0FBQTs7SUFFQSxJQUFBLGFBQUEsR0FBQSxJQUFBLE1BQUEsV0FBQSxVQUFBLEdBQUE7S0FDQSxPQUFBLFdBQUEsRUFBQTs7O0lBR0EsUUFBQSxlQUFBLEdBQUEsTUFBQSxNQUFBLFNBQUEsS0FBQSxPQUFBLENBQUEsR0FBQSxhQUFBLE1BQUEsQ0FBQSxHQUFBO0lBQ0EsUUFBQSxTQUFBO0tBQ0EsR0FBQSxRQUFBLFFBQUE7S0FDQSxHQUFBLFFBQUEsU0FBQTs7SUFFQSxRQUFBLGNBQUE7O0lBRUEsSUFBQSxlQUFBLFlBQUE7S0FDQSxHQUFBLE1BQUEsUUFBQSxTQUFBLFVBQUEsS0FBQSxNQUFBLFFBQUEsU0FBQSxHQUFBLFNBQUEsU0FBQSxFQUFBO01BQ0EsUUFBQSxRQUFBLE1BQUEsUUFBQSxVQUFBLFVBQUEsT0FBQSxPQUFBO09BQ0EsSUFBQSxTQUFBLE1BQUE7T0FDQSxHQUFBLE1BQUEsWUFBQSxFQUFBO1FBQ0EsU0FBQSxNQUFBLE1BQUE7OztPQUdBLElBQUEsSUFBQTtRQUNBLE1BQUEsTUFBQTtRQUNBLE1BQUEsTUFBQTtRQUNBLE9BQUEsTUFBQTtRQUNBLE9BQUE7UUFDQSxNQUFBLE1BQUE7UUFDQSxTQUFBLGFBQUEsV0FBQSxNQUFBO1FBQ0EsTUFBQTtRQUNBLFNBQUEsTUFBQTs7T0FFQSxPQUFBLEtBQUE7T0FDQSxRQUFBLFFBQUEsTUFBQSxVQUFBLFVBQUEsTUFBQTtRQUNBLElBQUEsTUFBQSxVQUFBLEtBQUEsT0FBQTtTQUNBLElBQUEsUUFBQSxLQUFBO1NBQ0EsR0FBQSxLQUFBLFlBQUEsRUFBQTtVQUNBLFFBQUEsS0FBQSxNQUFBOztjQUVBLEdBQUEsTUFBQSxZQUFBLEVBQUE7VUFDQSxRQUFBLE1BQUEsTUFBQTs7U0FFQSxJQUFBLE9BQUE7VUFDQSxNQUFBLEtBQUE7VUFDQSxRQUFBLE1BQUEsVUFBQSxLQUFBLFFBQUEsTUFBQTtVQUNBLE9BQUEsTUFBQSxVQUFBLEtBQUE7VUFDQSxNQUFBLEtBQUE7VUFDQSxPQUFBLE1BQUE7VUFDQSxHQUFBLFFBQUEsT0FBQTtVQUNBLEdBQUEsUUFBQSxPQUFBO1VBQ0EsT0FBQTtVQUNBLE1BQUEsS0FBQTtVQUNBLFNBQUEsYUFBQSxXQUFBLEtBQUE7VUFDQSxNQUFBO1VBQ0EsU0FBQTs7U0FFQSxNQUFBLEtBQUE7Ozs7TUFJQTs7O1NBR0E7O01BRUEsSUFBQSxJQUFBO09BQ0EsTUFBQSxNQUFBLFFBQUE7T0FDQSxNQUFBLE1BQUEsUUFBQTtPQUNBLE9BQUEsTUFBQSxRQUFBO09BQ0EsT0FBQSxNQUFBLFFBQUEsTUFBQSxjQUFBLE1BQUEsUUFBQTtPQUNBLE1BQUEsTUFBQSxRQUFBO09BQ0EsU0FBQSxNQUFBLFFBQUE7T0FDQSxNQUFBLE1BQUEsUUFBQTtPQUNBLFVBQUEsTUFBQSxRQUFBOztNQUVBLE9BQUEsS0FBQTtNQUNBLFFBQUEsUUFBQSxNQUFBLFFBQUEsVUFBQSxVQUFBLE1BQUE7T0FDQSxJQUFBLE1BQUEsVUFBQSxLQUFBLE9BQUE7O1FBRUEsSUFBQSxPQUFBO1NBQ0EsTUFBQSxLQUFBO1NBQ0EsUUFBQSxNQUFBLFVBQUEsS0FBQSxRQUFBLE1BQUE7U0FDQSxPQUFBLE1BQUEsVUFBQSxLQUFBLFFBQUEsTUFBQTtTQUNBLE1BQUEsS0FBQTtTQUNBLE9BQUEsTUFBQSxRQUFBO1NBQ0EsR0FBQSxRQUFBLE9BQUE7U0FDQSxHQUFBLFFBQUEsT0FBQTtTQUNBLE9BQUEsS0FBQTtTQUNBLE1BQUEsS0FBQTtTQUNBLFNBQUEsYUFBQSxXQUFBLEtBQUE7U0FDQSxNQUFBO1NBQ0EsU0FBQTs7UUFFQSxNQUFBLEtBQUE7Ozs7O0lBS0EsSUFBQSxjQUFBLFVBQUE7S0FDQSxRQUFBO0tBQ0EsU0FBQTs7SUFFQSxJQUFBLGdCQUFBLFVBQUE7S0FDQSxRQUFBLFFBQUEsT0FBQSxTQUFBLE1BQUEsSUFBQTtPQUNBLFFBQUEsWUFBQSxLQUFBLFNBQUE7UUFDQSxHQUFBLFFBQUEsUUFBQTtRQUNBLEdBQUEsUUFBQSxTQUFBLEtBQUEsSUFBQTtRQUNBLFFBQUE7Ozs7SUFJQSxJQUFBLGFBQUEsWUFBQTtLQUNBLFFBQUEsUUFBQSxNQUFBLEtBQUE7S0FDQSxRQUFBLE1BQUEsR0FBQSxPQUFBLEtBQUEsSUFBQSxPQUFBLE9BQUEsS0FBQSxTQUFBLFFBQUEsT0FBQSxLQUFBLFVBQUEsUUFBQSxRQUFBLEtBQUEsTUFBQTs7S0FFQSxJQUFBLENBQUEsUUFBQSxTQUFBO01BQ0EsSUFBQSxLQUFBLEtBQUE7TUFDQSxHQUFBLE9BQUEsVUFBQSxFQUFBO09BQ0EsSUFBQSxTQUFBLEdBQUEsSUFBQTtTQUNBLFlBQUE7U0FDQSxZQUFBO1NBQ0EsV0FBQSxDQUFBLE1BQUEsS0FBQTtTQUNBLFNBQUEsTUFBQSxLQUFBO09BQ0EsSUFBQSxZQUFBLEdBQUEsSUFBQTtTQUNBLFlBQUE7U0FDQSxZQUFBO1NBQ0EsV0FBQSxNQUFBLEtBQUE7U0FDQSxTQUFBLE9BQUEsS0FBQTs7T0FFQSxRQUFBLFNBQUEsUUFBQSxJQUFBLE9BQUE7U0FDQSxLQUFBLEtBQUE7U0FDQSxLQUFBLFFBQUEsU0FBQSxFQUFBO1NBQ0EsT0FBQSxPQUFBLEdBQUEsU0FBQTs7U0FFQSxLQUFBLE1BQUE7U0FDQSxLQUFBLGFBQUEsY0FBQSxRQUFBLE1BQUEsR0FBQSxLQUFBLFFBQUEsT0FBQSxJQUFBLFFBQUEsT0FBQSxJQUFBO09BQ0EsUUFBQSxZQUFBLFFBQUEsSUFBQSxPQUFBO1NBQ0EsS0FBQSxLQUFBO1NBQ0EsS0FBQSxNQUFBO1NBQ0EsS0FBQSxRQUFBLFNBQUEsRUFBQTtTQUNBLE9BQUEsT0FBQSxHQUFBLFNBQUE7O1NBRUEsS0FBQSxhQUFBLGNBQUEsUUFBQSxNQUFBLEdBQUEsS0FBQSxRQUFBLE9BQUEsR0FBQTs7VUFFQTtPQUNBLElBQUEsTUFBQSxHQUFBLElBQUE7U0FDQSxZQUFBLFFBQUEsTUFBQSxJQUFBO1NBQ0EsWUFBQSxRQUFBLE1BQUE7U0FDQSxXQUFBLEtBQUEsS0FBQTtTQUNBLFNBQUEsT0FBQSxLQUFBOzs7T0FHQSxRQUFBLE1BQUEsUUFBQSxJQUFBLE9BQUE7U0FDQSxLQUFBLEtBQUE7U0FDQSxLQUFBLFFBQUEsT0FBQSxHQUFBO1NBQ0EsS0FBQSxNQUFBO1NBQ0EsS0FBQSxhQUFBLGNBQUEsUUFBQSxNQUFBLEdBQUEsS0FBQSxRQUFBLE9BQUEsR0FBQTs7OztJQUlBLEdBQUEsUUFBQSxVQUFBLFFBQUEsT0FBQSxVQUFBLEVBQUE7TUFDQSxJQUFBLGFBQUEsUUFBQSxJQUFBLFVBQUEsZUFBQSxLQUFBLFFBQUEsUUFBQSxPQUFBO1FBQ0EsS0FBQSxTQUFBO1FBQ0EsS0FBQSxRQUFBLFNBQUEsRUFBQTtRQUNBLE9BQUEsRUFBQTs7Ozs7Ozs7UUFRQSxLQUFBLEtBQUE7UUFDQSxNQUFBLGFBQUE7UUFDQSxNQUFBLFVBQUE7O1FBRUEsS0FBQSxTQUFBLFFBQUE7UUFDQSxLQUFBLGVBQUE7UUFDQSxHQUFBLFNBQUEsU0FBQSxFQUFBO1FBQ0EsUUFBQSxjQUFBLEVBQUE7UUFDQSxRQUFBOztRQUVBLEtBQUEsS0FBQSxTQUFBLEVBQUE7UUFDQSxJQUFBLFFBQUEsT0FBQSxRQUFBO1FBQ0EsR0FBQSxTQUFBLEVBQUE7U0FDQSxPQUFBOztZQUVBO1NBQ0EsT0FBQSxRQUFBLFNBQUE7OztRQUdBLEtBQUEsU0FBQSxFQUFBO1FBQ0EsT0FBQSxFQUFBOzs7O0tBSUEsUUFBQSxhQUFBLFFBQUEsSUFBQSxVQUFBLFVBQUEsS0FBQSxPQUFBLFFBQUEsT0FBQSxLQUFBLEtBQUEsYUFBQSxnQkFBQSxRQUFBLFFBQUEsS0FBQSxPQUFBLFFBQUEsU0FBQSxLQUFBLEtBQUEsS0FBQSxTQUFBOzs7Ozs7S0FNQSxRQUFBLFVBQUEsUUFBQSxXQUFBLE9BQUEsVUFBQSxLQUFBLEtBQUEsR0FBQSxLQUFBLFNBQUEsVUFBQSxHQUFBO01BQ0EsT0FBQSxFQUFBLFNBQUEsUUFBQSxXQUFBLEVBQUE7U0FDQSxLQUFBLGdCQUFBLEdBQUEsS0FBQSxVQUFBLFVBQUEsR0FBQTtNQUNBLE9BQUEsR0FBQSxJQUFBLFFBQUEsV0FBQSxFQUFBLFFBQUE7UUFDQSxLQUFBLE1BQUEsVUFBQSxHQUFBOztNQUVBLE9BQUEsWUFBQSxFQUFBOztLQUVBLFFBQUEsUUFBQSxRQUFBLFdBQUEsT0FBQTtPQUNBLEtBQUEsZUFBQTtPQUNBLEtBQUEsYUFBQSxVQUFBLEdBQUE7OztPQUdBLEtBQUEsZUFBQTtPQUNBLEtBQUEsUUFBQSxTQUFBLEVBQUE7T0FDQSxPQUFBLEVBQUEsVUFBQSxTQUFBLEVBQUE7O09BRUEsTUFBQSxXQUFBLFNBQUEsRUFBQTtPQUNBLEdBQUEsRUFBQSxRQUFBO1FBQ0EsT0FBQTs7V0FFQTtRQUNBLE9BQUE7OztPQUdBLEtBQUEsVUFBQSxHQUFBO09BQ0EsT0FBQSxFQUFBLFdBQUE7O0tBRUEsUUFBQSxNQUFBLEdBQUEsYUFBQSxVQUFBLEdBQUEsR0FBQTs7TUFFQSxPQUFBLGFBQUEsR0FBQSxHQUFBO1FBQ0EsR0FBQSxZQUFBLFVBQUEsR0FBQSxHQUFBO01BQ0EsT0FBQSxhQUFBLEdBQUEsR0FBQTtRQUNBLEdBQUEsU0FBQSxVQUFBLEdBQUEsR0FBQTs7TUFFQSxRQUFBLGNBQUEsRUFBQTtNQUNBLFFBQUE7O0tBRUEsUUFBQSxRQUFBLGFBQUEsU0FBQSxRQUFBLFVBQUEsS0FBQSxLQUFBLFVBQUEsR0FBQTtNQUNBLE9BQUEsRUFBQTs7S0FFQSxRQUFBLE1BQUEsYUFBQSxTQUFBLFFBQUEsVUFBQSxLQUFBLGFBQUEsVUFBQSxHQUFBO01BQ0EsT0FBQSxFQUFBLFNBQUEsT0FBQTtRQUNBLEtBQUEsS0FBQSxVQUFBLEdBQUE7TUFDQSxPQUFBLEVBQUEsU0FBQSxNQUFBOzs7SUFHQSxJQUFBLGFBQUEsWUFBQTs7S0FFQSxNQUFBLFFBQUEsVUFBQSxHQUFBLEdBQUE7TUFDQSxRQUFBLFFBQUEsYUFBQSxTQUFBLFFBQUEsVUFBQSxNQUFBLElBQUEsUUFBQTtRQUNBLEtBQUEsS0FBQSxVQUFBLEdBQUE7UUFDQSxFQUFBLFNBQUEsRUFBQSxRQUFBLE1BQUEsVUFBQSxFQUFBLFFBQUEsTUFBQTtRQUNBLE9BQUEsTUFBQSxVQUFBLEVBQUEsUUFBQSxNQUFBOztNQUVBLFFBQUEsTUFBQSxhQUFBLFNBQUEsUUFBQSxVQUFBLE1BQUEsSUFBQSxRQUFBO1FBQ0EsS0FBQSxhQUFBLFVBQUEsR0FBQTtRQUNBLE9BQUEsQ0FBQSxNQUFBLFVBQUEsRUFBQSxRQUFBLE1BQUEsY0FBQSxPQUFBOztRQUVBLEtBQUEsS0FBQSxVQUFBLEdBQUE7UUFDQSxPQUFBLENBQUEsTUFBQSxVQUFBLEVBQUEsUUFBQSxNQUFBLGNBQUEsTUFBQTs7OztJQUlBLElBQUEsU0FBQSxVQUFBLEdBQUE7S0FDQSxPQUFBLENBQUEsS0FBQSxJQUFBLEVBQUEsUUFBQSxPQUFBOztJQUVBLElBQUEsUUFBQSxZQUFBO0tBQ0EsT0FBQSxRQUFBLFFBQUEsR0FBQSxPQUFBLFFBQUEsTUFBQSxPQUFBLEtBQUEsQ0FBQSxRQUFBLE9BQUEsUUFBQSxTQUFBLE1BQUE7O0lBRUEsSUFBQSxvQkFBQSxZQUFBO0tBQ0EsUUFBQSxNQUFBLFFBQUEsUUFBQSxnQkFBQSxPQUFBLFFBQUEsU0FBQSxNQUFBLEdBQUEsUUFBQSxVQUFBLEdBQUE7TUFDQSxRQUFBLFdBQUEsS0FBQSxvQkFBQSxFQUFBLFFBQUEsS0FBQSxhQUFBLFVBQUEsR0FBQTtPQUNBLE9BQUEsZUFBQSxFQUFBLElBQUEsTUFBQSxFQUFBLElBQUE7OztLQUdBLFFBQUEsTUFBQTs7SUFFQSxJQUFBLGlCQUFBLFlBQUE7S0FDQSxRQUFBLE1BQUEsUUFBQSxRQUFBLGdCQUFBLE9BQUEsUUFBQSxTQUFBLEtBQUEsR0FBQSxRQUFBLFVBQUEsR0FBQTtNQUNBLFFBQUEsV0FBQSxLQUFBLGlCQUFBLEVBQUEsUUFBQSxLQUFBLGFBQUEsVUFBQSxHQUFBO09BQ0EsT0FBQSxlQUFBLEVBQUEsSUFBQSxNQUFBLEVBQUEsSUFBQTs7O0tBR0EsUUFBQSxNQUFBOztJQUVBLElBQUEsc0JBQUEsVUFBQSxPQUFBO0tBQ0EsT0FBQSxDQUFBLFVBQUEsT0FBQTtNQUNBLE9BQUEsVUFBQSxHQUFBO09BQ0EsRUFBQSxJQUFBLEVBQUEsSUFBQSxDQUFBLFFBQUEsTUFBQSxJQUFBLEVBQUEsTUFBQSxRQUFBLFNBQUEsUUFBQSxPQUFBO09BQ0EsRUFBQSxJQUFBLEVBQUEsSUFBQSxDQUFBLFFBQUEsT0FBQSxJQUFBLEVBQUEsTUFBQSxRQUFBLFNBQUEsUUFBQSxRQUFBOztRQUVBOztJQUVBLElBQUEsbUJBQUEsVUFBQSxPQUFBO0tBQ0EsT0FBQSxDQUFBLFVBQUEsT0FBQTtNQUNBLE9BQUEsVUFBQSxHQUFBO09BQ0EsRUFBQSxJQUFBLEVBQUEsSUFBQSxDQUFBLFFBQUEsT0FBQSxJQUFBLEVBQUEsTUFBQSxRQUFBLFNBQUEsUUFBQSxRQUFBO09BQ0EsRUFBQSxJQUFBLEVBQUEsSUFBQSxDQUFBLE1BQUEsRUFBQSxNQUFBLFFBQUEsU0FBQSxRQUFBLFFBQUE7O1FBRUE7O0lBRUEsSUFBQSxtQkFBQSxVQUFBLE9BQUE7S0FDQSxPQUFBLENBQUEsVUFBQSxPQUFBO01BQ0EsT0FBQSxVQUFBLEdBQUE7O09BRUEsSUFBQTtPQUNBLFNBQUEsUUFBQSxZQUFBLEVBQUE7T0FDQSxFQUFBLElBQUEsRUFBQSxJQUFBLENBQUEsT0FBQSxJQUFBLEVBQUEsTUFBQSxPQUFBLFNBQUEsUUFBQSxRQUFBO09BQ0EsT0FBQSxFQUFBLElBQUEsRUFBQSxJQUFBLENBQUEsT0FBQSxJQUFBLEVBQUEsTUFBQSxPQUFBLFNBQUEsUUFBQSxRQUFBOztRQUVBOztJQUVBLElBQUEsZUFBQSxVQUFBLE1BQUEsR0FBQSxTQUFBO0tBQ0EsSUFBQTtLQUNBLElBQUEsYUFBQTtNQUNBLE9BQUE7O0tBRUEsVUFBQSxvREFBQSxLQUFBLE1BQUE7S0FDQSxXQUFBLDBCQUFBLEtBQUEsT0FBQTtLQUNBLFFBQUEsUUFBQSxLQUFBLEtBQUEsVUFBQSxVQUFBLE1BQUE7TUFDQSxHQUFBLE1BQUEsVUFBQSxLQUFBLFFBQUEsR0FBQTtPQUNBLFdBQUE7T0FDQSxXQUFBLG9EQUFBLE1BQUEsVUFBQSxLQUFBLE1BQUE7T0FDQSxXQUFBLHlDQUFBLEtBQUEsU0FBQSxLQUFBLFNBQUEsT0FBQSxNQUFBLFVBQUEsS0FBQSxNQUFBLFNBQUEsS0FBQSxTQUFBO09BQ0EsV0FBQTs7Ozs7O0tBTUEsU0FBQSxRQUFBLFFBQUEsWUFBQSxTQUFBLE1BQUEsR0FBQSxPQUFBLE1BQUEsWUFBQTs7O0lBR0EsSUFBQSxlQUFBLFVBQUEsTUFBQSxHQUFBLFNBQUE7S0FDQSxPQUFBLFFBQUEsUUFBQTs7O0lBR0EsTUFBQSxPQUFBLGFBQUEsVUFBQSxNQUFBLFNBQUE7S0FDQSxRQUFBLFFBQUE7O0tBRUEsSUFBQSxRQUFBLFdBQUEsTUFBQTtNQUNBO01BQ0E7TUFDQTtZQUNBO01BQ0E7O0tBRUEsR0FBQSxPQUFBLFVBQUEsS0FBQSxRQUFBLFVBQUEsS0FBQTtPQUNBOztTQUVBO09BQ0E7Ozs7SUFJQSxNQUFBLE9BQUEsV0FBQSxVQUFBLEdBQUEsR0FBQTtLQUNBLEdBQUEsTUFBQSxFQUFBO01BQ0E7O0tBRUEsR0FBQSxPQUFBLEVBQUEsR0FBQSxZQUFBLFlBQUE7TUFDQSxRQUFBLFFBQUE7TUFDQTtNQUNBO01BQ0E7TUFDQTs7TUFFQSxHQUFBLE9BQUEsVUFBQSxLQUFBLFFBQUEsVUFBQSxLQUFBO1FBQ0E7OztVQUdBOztRQUVBOzs7OztJQUtBLE1BQUEsT0FBQSxhQUFBLFVBQUEsTUFBQSxNQUFBO0tBQ0EsSUFBQSxTQUFBLE1BQUE7TUFDQTs7S0FFQSxJQUFBLFFBQUEsT0FBQTtNQUNBO1lBQ0E7TUFDQTs7Ozs7Ozs7QUM1Y0EsQ0FBQSxZQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsdURBQUEsVUFBQSxTQUFBLFFBQUEsYUFBQTs7RUFFQSxJQUFBLEtBQUE7RUFDQSxHQUFBLGFBQUE7R0FDQSxPQUFBLFVBQUE7SUFDQSxHQUFBLGlCQUFBOztHQUVBLFNBQUEsU0FBQSxTQUFBO0lBQ0EsR0FBQSxpQkFBQTs7Ozs7Ozs7QUNYQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsa0JBQUEsV0FBQSxjQUFBLFdBQUE7O0VBRUEsT0FBQTtHQUNBLFVBQUE7R0FDQSxhQUFBO0dBQ0EsWUFBQTtHQUNBLGNBQUE7R0FDQSxNQUFBO0dBQ0Esa0JBQUE7SUFDQSxNQUFBO0lBQ0EsWUFBQTtJQUNBLFFBQUE7SUFDQSxNQUFBOztHQUVBLFFBQUE7R0FDQSxNQUFBLFVBQUEsT0FBQSxTQUFBLE9BQUE7Ozs7Ozs7OztBQ2xCQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLFFBQUEsb0JBQUEsWUFBQSxpRkFBQSxTQUFBLFFBQUEsU0FBQSxRQUFBLGFBQUEsZUFBQTs7RUFFQSxJQUFBLEtBQUE7RUFDQSxHQUFBLGVBQUE7RUFDQSxHQUFBLHNCQUFBO0VBQ0EsR0FBQSxZQUFBO0VBQ0EsR0FBQSxTQUFBLGVBQUE7O0VBRUEsU0FBQSxvQkFBQSxPQUFBO0dBQ0EsT0FBQSxRQUFBLGNBQUEsUUFBQSxXQUFBLEdBQUEsYUFBQSxPQUFBOztFQUVBLFNBQUEsV0FBQTtHQUNBLElBQUEsR0FBQSxLQUFBLFNBQUEsR0FBQSxLQUFBLE1BQUEsVUFBQSxHQUFBO0lBQ0EsT0FBQTs7R0FFQSxPQUFBOztFQUVBLFNBQUEsYUFBQSxPQUFBO0dBQ0EsR0FBQSxNQUFBO0lBQ0EsR0FBQSxHQUFBLEtBQUEsR0FBQTtLQUNBLEdBQUEsS0FBQSxPQUFBLEtBQUEsVUFBQSxNQUFBO01BQ0EsT0FBQSxRQUFBLDZCQUFBO01BQ0EsT0FBQSxhQUFBOzs7UUFHQTtLQUNBLFlBQUEsS0FBQSxjQUFBLEdBQUEsTUFBQSxLQUFBLFVBQUEsTUFBQTtNQUNBLEdBQUEsV0FBQSxLQUFBOztNQUVBLE9BQUEsUUFBQSwrQkFBQTtNQUNBLEdBQUEsUUFBQSxTQUFBOzs7Ozs7Ozs7O0FDakNBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxrQkFBQSxXQUFBLFlBQUEsV0FBQTs7RUFFQSxPQUFBO0dBQ0EsVUFBQTtHQUNBLGFBQUE7R0FDQSxZQUFBO0dBQ0EsY0FBQTtHQUNBLE1BQUE7R0FDQSxrQkFBQTtJQUNBLE1BQUE7SUFDQSxZQUFBO0lBQ0EsUUFBQTtJQUNBLE1BQUE7O0dBRUEsUUFBQTtHQUNBLE1BQUEsVUFBQSxPQUFBLFNBQUEsT0FBQTs7Ozs7Ozs7O0FDbEJBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsUUFBQSxvQkFBQSxZQUFBLG1CQUFBLFVBQUE7Ozs7OztBQ0hBLENBQUEsWUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxrQkFBQSxVQUFBLDRCQUFBLFVBQUEsVUFBQTtFQUNBLElBQUEsV0FBQSxZQUFBO0dBQ0EsT0FBQTtJQUNBLE9BQUE7SUFDQSxRQUFBO0lBQ0EsT0FBQTtJQUNBLE1BQUE7SUFDQSxPQUFBOzs7RUFHQSxPQUFBO0dBQ0EsVUFBQTtHQUNBLFlBQUE7R0FDQSxPQUFBO0lBQ0EsU0FBQTtJQUNBLE1BQUE7O0dBRUEsTUFBQSxVQUFBLFFBQUEsU0FBQSxRQUFBOzs7SUFHQSxPQUFBLFVBQUEsUUFBQSxPQUFBLFlBQUEsT0FBQTtJQUNBLEtBQUEsSUFBQSxJQUFBLEtBQUE7O0lBRUEsSUFBQSxTQUFBLEdBQUEsTUFBQTtNQUNBLE9BQUEsQ0FBQSxHQUFBLE9BQUEsUUFBQTtNQUNBLE1BQUEsQ0FBQSxHQUFBO01BQ0EsTUFBQTs7O0lBR0EsSUFBQSxNQUFBLEdBQUEsT0FBQSxRQUFBLElBQUEsT0FBQTtNQUNBLEtBQUEsU0FBQSxPQUFBLFFBQUE7TUFDQSxLQUFBLFVBQUEsT0FBQSxRQUFBO01BQ0EsT0FBQTs7SUFFQSxJQUFBLFlBQUEsSUFBQSxPQUFBO01BQ0EsS0FBQSxhQUFBLGVBQUEsT0FBQSxRQUFBLFFBQUEsSUFBQSxNQUFBLE9BQUEsUUFBQSxTQUFBLElBQUE7O0lBRUEsSUFBQSxhQUFBLFVBQUEsT0FBQTtNQUNBLEtBQUEsS0FBQSxPQUFBLFFBQUEsUUFBQSxJQUFBO01BQ0EsS0FBQSxnQkFBQTtNQUNBLEtBQUEsVUFBQSxPQUFBLFFBQUE7TUFDQSxNQUFBLFdBQUE7TUFDQSxLQUFBLFFBQUE7O0lBRUEsSUFBQSxNQUFBLEdBQUEsSUFBQTtNQUNBLFdBQUE7TUFDQSxZQUFBLFVBQUEsR0FBQTtNQUNBLE9BQUEsT0FBQSxRQUFBLFFBQUEsSUFBQTs7TUFFQSxZQUFBLFVBQUEsR0FBQTtNQUNBLE9BQUEsT0FBQSxRQUFBLFFBQUE7OztJQUdBLElBQUEsY0FBQSxVQUFBLE9BQUE7TUFDQSxNQUFBO01BQ0EsVUFBQSxJQUFBLEtBQUEsS0FBQTs7TUFFQSxNQUFBLFFBQUEsT0FBQSxRQUFBO01BQ0EsS0FBQSxLQUFBO0lBQ0EsSUFBQSxPQUFBLFVBQUEsVUFBQTtNQUNBLEtBQUEsQ0FBQTtNQUNBO01BQ0EsT0FBQTtNQUNBLEtBQUEsVUFBQSxHQUFBO01BQ0EsR0FBQSxDQUFBLE9BQUEsUUFBQTtPQUNBLE9BQUEsT0FBQTtNQUNBLE9BQUE7O01BRUEsTUFBQSxRQUFBLE9BQUEsUUFBQTtNQUNBLE1BQUEsZUFBQTtNQUNBLE1BQUEsYUFBQSxVQUFBO01BQ0EsR0FBQSxDQUFBLE9BQUEsUUFBQTtNQUNBLE9BQUE7TUFDQSxPQUFBOztNQUVBLEtBQUEsZUFBQTtNQUNBLEtBQUEsS0FBQSxTQUFBLEVBQUE7TUFDQSxHQUFBLENBQUEsT0FBQSxRQUFBO09BQ0EsT0FBQTtNQUNBLE9BQUE7Ozs7SUFJQSxTQUFBLFVBQUEsUUFBQTtLQUNBLFlBQUE7UUFDQSxTQUFBO1FBQ0EsS0FBQSxVQUFBLE9BQUEsVUFBQSxJQUFBLEtBQUE7O0tBRUEsS0FBQSxhQUFBLFNBQUEsS0FBQSxNQUFBLFFBQUEsVUFBQSxHQUFBO01BQ0EsR0FBQSxDQUFBLE9BQUEsUUFBQSxjQUFBO09BQ0EsSUFBQSxPQUFBLEtBQUEsWUFBQSxNQUFBO09BQ0EsSUFBQSxJQUFBLEdBQUEsWUFBQSxTQUFBLEtBQUEsS0FBQTtPQUNBLE9BQUEsVUFBQSxHQUFBO1FBQ0EsS0FBQSxjQUFBLFFBQUEsS0FBQSxNQUFBLEVBQUEsS0FBQSxLQUFBOzs7VUFHQTtPQUNBLElBQUEsSUFBQSxHQUFBLFlBQUEsU0FBQSxJQUFBO09BQ0EsT0FBQSxVQUFBLEdBQUE7UUFDQSxLQUFBLGVBQUEsS0FBQSxNQUFBLEVBQUEsS0FBQSxLQUFBOzs7Ozs7O0lBT0EsU0FBQSxTQUFBLFlBQUEsVUFBQTtLQUNBLFdBQUEsVUFBQSxLQUFBLFVBQUEsR0FBQTtNQUNBLElBQUEsY0FBQSxHQUFBLFlBQUEsRUFBQSxVQUFBO01BQ0EsT0FBQSxVQUFBLEdBQUE7T0FDQSxFQUFBLFdBQUEsWUFBQTtPQUNBLE9BQUEsSUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBa0JBLE9BQUEsT0FBQSxRQUFBLFVBQUEsR0FBQSxHQUFBOztNQUVBLElBQUEsQ0FBQSxHQUFBO09BQ0EsRUFBQSxPQUFBLFFBQUEsU0FBQSxPQUFBLFFBQUE7O01BRUEsU0FBQSxZQUFBO1FBQ0EsVUFBQSxFQUFBLE9BQUEsUUFBQTs7O0lBR0EsT0FBQSxPQUFBLFdBQUEsU0FBQSxFQUFBLEVBQUE7S0FDQSxHQUFBLE1BQUEsS0FBQSxDQUFBLEdBQUE7S0FDQSxTQUFBLFlBQUE7T0FDQSxVQUFBLE9BQUEsS0FBQSxPQUFBLFFBQUE7O01BRUE7Ozs7Ozs7O0FDbEpBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsUUFBQSxvQkFBQSxZQUFBLGlCQUFBLFVBQUE7Ozs7OztBQ0hBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxrQkFBQSxXQUFBLGFBQUEsV0FBQTs7RUFFQSxPQUFBO0dBQ0EsVUFBQTtHQUNBLGFBQUE7R0FDQSxZQUFBO0dBQ0EsY0FBQTtHQUNBLE1BQUE7R0FDQSxrQkFBQTtJQUNBLE9BQUE7SUFDQSxNQUFBO0lBQ0EsUUFBQTs7R0FFQSxRQUFBO0dBQ0EsTUFBQSxVQUFBLE9BQUEsU0FBQSxPQUFBOzs7Ozs7Ozs7QUNqQkEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxRQUFBLG9CQUFBLFlBQUEsdUJBQUEsVUFBQTs7Ozs7O0FDSEEsQ0FBQSxZQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGtCQUFBLFVBQUEsbUJBQUEsWUFBQTs7RUFFQSxPQUFBO0dBQ0EsVUFBQTtHQUNBLFNBQUE7R0FDQSxNQUFBLFVBQUEsT0FBQSxTQUFBLE9BQUEsU0FBQTs7O0lBR0EsUUFBQSxVQUFBLFlBQUE7S0FDQSxRQUFBLEtBQUEsUUFBQSxjQUFBOzs7O0lBSUEsUUFBQSxHQUFBLHFCQUFBLFlBQUE7S0FDQSxNQUFBLE9BQUE7Ozs7OztJQU1BLFNBQUEsZUFBQTtLQUNBLElBQUEsT0FBQSxRQUFBOzs7S0FHQSxJQUFBLE1BQUEsV0FBQSxRQUFBLFFBQUE7TUFDQSxPQUFBOztLQUVBLFFBQUEsY0FBQTs7Ozs7Ozs7O0FDOUJBLENBQUEsWUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxrQkFBQSxVQUFBLDJCQUFBLFVBQUEsUUFBQTs7RUFFQSxPQUFBO0dBQ0EsVUFBQTtHQUNBLE9BQUE7UUFDQSxNQUFBO1FBQ0EsVUFBQTs7R0FFQSxNQUFBLFVBQUEsT0FBQSxTQUFBLE9BQUE7SUFDQSxJQUFBLFdBQUEsYUFBQSx3QkFBQTtJQUNBLHlCQUFBLFVBQUEsT0FBQTtLQUNBLElBQUEsU0FBQSxNQUFBO01BQ0EsTUFBQTs7S0FFQSxNQUFBLGFBQUEsZ0JBQUE7S0FDQSxPQUFBOztJQUVBLGlCQUFBLE1BQUE7SUFDQSxZQUFBLFVBQUEsTUFBQTtLQUNBLElBQUE7S0FDQSxJQUFBLENBQUEsQ0FBQSxPQUFBLE1BQUEsa0JBQUEsS0FBQSxNQUFBLFNBQUEsT0FBQSxDQUFBLE9BQUEsUUFBQSxPQUFBLE1BQUEsYUFBQTtNQUNBLE9BQUE7WUFDQTtNQUNBLE1BQUEsK0JBQUEsTUFBQSxjQUFBO01BQ0EsT0FBQTs7O0lBR0EsY0FBQSxVQUFBLE1BQUE7S0FDQSxJQUFBLENBQUEsb0JBQUEsS0FBQSxNQUFBLG1CQUFBLE9BQUEsZUFBQSxRQUFBLFFBQUEsQ0FBQSxHQUFBO01BQ0EsT0FBQTtZQUNBO01BQ0EsT0FBQSxNQUFBLHlDQUFBLGdCQUFBOztNQUVBLE9BQUE7OztJQUdBLFFBQUEsS0FBQSxZQUFBO0lBQ0EsUUFBQSxLQUFBLGFBQUE7SUFDQSxPQUFBLFFBQUEsS0FBQSxRQUFBLFVBQUEsT0FBQTtLQUNBLElBQUEsTUFBQSxNQUFBLFFBQUEsTUFBQTtLQUNBLElBQUEsU0FBQSxNQUFBO01BQ0EsTUFBQTs7S0FFQSxTQUFBLElBQUE7S0FDQSxPQUFBLFNBQUEsVUFBQSxLQUFBO01BQ0EsSUFBQSxVQUFBLFNBQUEsWUFBQSxPQUFBO09BQ0EsT0FBQSxNQUFBLE9BQUEsWUFBQTtRQUNBLE1BQUEsT0FBQSxJQUFBLE9BQUE7UUFDQSxJQUFBLFFBQUEsU0FBQSxNQUFBLFdBQUE7U0FDQSxPQUFBLE1BQUEsV0FBQTs7Ozs7S0FLQSxPQUFBLE1BQUEsYUFBQSxNQUFBOzs7OztLQUtBLE1BQUEsT0FBQTtLQUNBLE9BQUE7Ozs7Ozs7O0FDL0RBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsUUFBQSxvQkFBQSxZQUFBLG9CQUFBLFVBQUE7Ozs7OztBQ0hBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxrQkFBQSxXQUFBLFdBQUEsV0FBQTtFQUNBLElBQUEsV0FBQSxVQUFBO0dBQ0EsT0FBQTtJQUNBLE9BQUE7SUFDQSxPQUFBOzs7RUFHQSxPQUFBO0dBQ0EsVUFBQTtHQUNBLGFBQUE7R0FDQSxZQUFBO0dBQ0EsTUFBQTtJQUNBLFFBQUE7SUFDQSxXQUFBOztHQUVBLE1BQUEsVUFBQSxRQUFBLFNBQUEsUUFBQSxRQUFBO0tBQ0EsSUFBQSxVQUFBLFFBQUEsT0FBQSxZQUFBLE9BQUE7Ozs7Ozs7O0FDbkJBLENBQUEsWUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLDBCQUFBLFVBQUEsUUFBQTtFQUNBLE9BQUEsVUFBQTtFQUNBOztFQUVBLFNBQUEsVUFBQTtHQUNBLE9BQUE7R0FDQSxPQUFBLE9BQUEsV0FBQSxTQUFBLEVBQUEsRUFBQTtJQUNBLEdBQUEsTUFBQSxFQUFBO0tBQ0E7O0lBRUEsT0FBQTs7O0VBR0EsU0FBQSxTQUFBO0dBQ0EsT0FBQSxVQUFBO0lBQ0EsYUFBQTtJQUNBLE1BQUEsQ0FBQTtLQUNBLFFBQUE7TUFDQSxHQUFBO01BQ0EsR0FBQTs7S0FFQSxPQUFBO0tBQ0EsT0FBQTs7SUFFQSxPQUFBLENBQUE7S0FDQSxRQUFBO01BQ0EsR0FBQTtNQUNBLEdBQUEsT0FBQSxRQUFBOztLQUVBLE9BQUE7S0FDQSxPQUFBLE9BQUEsUUFBQTs7Ozs7Ozs7QUNqQ0EsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGtCQUFBLFdBQUEsYUFBQSxXQUFBOztFQUVBLE9BQUE7R0FDQSxVQUFBO0dBQ0EsYUFBQTtHQUNBLFlBQUE7R0FDQSxjQUFBO0dBQ0EsTUFBQTtJQUNBLE1BQUE7SUFDQSxTQUFBO0lBQ0EsVUFBQTs7R0FFQSxrQkFBQTtHQUNBLFFBQUE7O0dBRUEsTUFBQSxVQUFBLE9BQUEsU0FBQSxPQUFBLFdBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7QUNsQkEsQ0FBQSxZQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEseUhBQUEsVUFBQSxRQUFBLGFBQUEsZ0JBQUEsZUFBQSxTQUFBLFFBQUEsb0JBQUE7O0VBRUEsSUFBQSxLQUFBOztFQUVBLEdBQUEsV0FBQSxRQUFBLEtBQUEsR0FBQTs7RUFFQSxHQUFBLFlBQUE7RUFDQSxHQUFBLFlBQUE7O0VBRUEsR0FBQSxhQUFBO0VBQ0EsR0FBQSxnQkFBQTtFQUNBLEdBQUEsZUFBQTtFQUNBLEdBQUEsYUFBQTtFQUNBLEdBQUEsYUFBQTtFQUNBLEdBQUEsY0FBQTtFQUNBLEdBQUEsWUFBQTs7RUFFQSxHQUFBLE9BQUE7O0VBRUEsR0FBQSxpQkFBQTtFQUNBLEdBQUEsYUFBQTs7RUFFQTs7RUFFQSxTQUFBLFdBQUE7R0FDQTs7O0VBR0EsU0FBQSxZQUFBLE9BQUE7R0FDQSxPQUFBLFFBQUEsY0FBQSxHQUFBLGVBQUEsT0FBQTs7RUFFQSxTQUFBLFVBQUEsT0FBQTtHQUNBLE9BQUEsUUFBQSxjQUFBLEdBQUEsY0FBQSxPQUFBOzs7RUFHQSxTQUFBLFVBQUE7R0FDQSxHQUFBLGdCQUFBLFlBQUEsT0FBQSxpQkFBQTtHQUNBLEdBQUEsYUFBQSxlQUFBLGNBQUEsQ0FBQSxLQUFBO0dBQ0EsR0FBQSxlQUFBLFlBQUEsT0FBQSxpQkFBQTtHQUNBLEdBQUEsU0FBQSxZQUFBLE9BQUEsVUFBQTs7O0VBR0EsU0FBQSxXQUFBO0dBQ0EsSUFBQSxHQUFBLEtBQUEsU0FBQSxHQUFBLEtBQUEsUUFBQSxHQUFBLEtBQUEsZ0JBQUEsR0FBQSxLQUFBLE1BQUEsVUFBQSxHQUFBO0lBQ0EsT0FBQTs7R0FFQSxPQUFBOztFQUVBLFNBQUEsV0FBQTtHQUNBLEdBQUEsT0FBQSxHQUFBLEtBQUEsY0FBQSxhQUFBLE9BQUE7R0FDQSxPQUFBLGVBQUEsR0FBQSxLQUFBLFdBQUEsU0FBQSxPQUFBOztFQUVBLFNBQUEsTUFBQTtHQUNBLEdBQUEsS0FBQSxPQUFBLEtBQUEsU0FBQSxTQUFBO0lBQ0EsR0FBQSxTQUFBO0tBQ0EsT0FBQSxRQUFBLDhCQUFBO0tBQ0EsR0FBQSxLQUFBLFVBQUE7S0FDQSxHQUFBLFdBQUEsUUFBQSxLQUFBLEdBQUE7Ozs7OztFQU1BLFNBQUEsZUFBQSxLQUFBO0dBQ0EsY0FBQSxhQUFBLGVBQUE7O0VBRUEsU0FBQSxXQUFBLEtBQUE7R0FDQSxjQUFBLGFBQUEsV0FBQTs7O0VBR0EsT0FBQSxPQUFBLFdBQUEsU0FBQSxHQUFBLEVBQUE7R0FDQSxHQUFBLEtBQUEsR0FBQTtNQUNBLEdBQUEsS0FBQSxVQUFBLENBQUEsUUFBQSxPQUFBLEdBQUEsTUFBQSxHQUFBOztJQUVBOzs7OztBQzdFQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsa0JBQUEsV0FBQSxpQkFBQSxXQUFBOztFQUVBLE9BQUE7R0FDQSxVQUFBO0dBQ0EsT0FBQTtJQUNBLE1BQUE7O0dBRUEsUUFBQTtHQUNBLGFBQUE7R0FDQSxZQUFBO0dBQ0EsY0FBQTtHQUNBLGtCQUFBO0dBQ0EsTUFBQSxVQUFBLE9BQUEsU0FBQSxPQUFBOztJQUVBLElBQUEsS0FBQTtJQUNBLElBQUEsS0FBQSxRQUFBO0lBQ0EsSUFBQSxTQUFBLFFBQUE7SUFDQSxPQUFBLEdBQUEsY0FBQSxTQUFBLEVBQUE7S0FDQSxRQUFBLFNBQUE7T0FDQSxHQUFBLGNBQUEsU0FBQSxFQUFBO0tBQ0EsUUFBQSxZQUFBOzs7Ozs7Ozs7O0FDdkJBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsUUFBQSxvQkFBQSxZQUFBLHFCQUFBLFVBQUE7O0VBRUEsSUFBQSxLQUFBO0VBQ0EsR0FBQSxZQUFBO0VBQ0EsR0FBQSxTQUFBO0VBQ0EsR0FBQSxpQkFBQTs7RUFFQSxTQUFBLFFBQUE7R0FDQSxPQUFBLEdBQUEsS0FBQSxjQUFBLGNBQUE7O0VBRUEsU0FBQSxnQkFBQTtHQUNBLEdBQUEsS0FBQSxjQUFBLENBQUEsR0FBQSxLQUFBO0dBQ0EsR0FBQSxLQUFBOztFQUVBLFNBQUEsVUFBQSxLQUFBO0dBQ0EsSUFBQSxLQUFBLFNBQUEsS0FBQSxtQkFBQSxLQUFBLGdCQUFBLEtBQUEsTUFBQSxVQUFBLEdBQUE7SUFDQSxPQUFBOztHQUVBLE9BQUE7Ozs7OztBQ3JCQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsa0JBQUEsV0FBQSxXQUFBLFdBQUE7O0VBRUEsT0FBQTtHQUNBLFVBQUE7R0FDQSxhQUFBO0dBQ0EsWUFBQTtHQUNBLGNBQUE7R0FDQSxNQUFBO0lBQ0EsTUFBQTtJQUNBLFNBQUE7SUFDQSxVQUFBOztHQUVBLGtCQUFBO0dBQ0EsUUFBQTtHQUNBLE1BQUEsVUFBQSxPQUFBLFNBQUEsT0FBQTs7Ozs7Ozs7O0FDakJBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsUUFBQSxvQkFBQSxZQUFBLHNHQUFBLFNBQUEsUUFBQSxRQUFBLFNBQUEsVUFBQSxRQUFBLGFBQUEsZUFBQTs7RUFFQSxJQUFBLEtBQUE7RUFDQSxHQUFBLFdBQUEsUUFBQSxLQUFBLEdBQUE7RUFDQSxHQUFBLFlBQUE7RUFDQSxHQUFBLFlBQUE7RUFDQSxHQUFBLE9BQUE7O0VBRUEsR0FBQSxjQUFBO0dBQ0EsS0FBQTtHQUNBLFVBQUE7R0FDQSxVQUFBO0dBQ0EsVUFBQTtHQUNBLFVBQUE7R0FDQSxZQUFBO0dBQ0Esa0JBQUE7R0FDQSxTQUFBO0dBQ0EsU0FBQTtHQUNBLFlBQUE7R0FDQSxXQUFBO0dBQ0EsVUFBQSxHQUFBLFFBQUEsUUFBQTtHQUNBLG1CQUFBLEdBQUEsUUFBQSxRQUFBO0dBQ0EsWUFBQTs7RUFFQTs7O0VBR0EsU0FBQSxXQUFBO0dBQ0E7OztFQUdBLFNBQUEsVUFBQTtHQUNBLEdBQUEsYUFBQSxlQUFBLGNBQUEsQ0FBQSxLQUFBO0dBQ0EsR0FBQSxTQUFBLFlBQUEsT0FBQSxVQUFBO0dBQ0EsR0FBQSxRQUFBLFlBQUEsT0FBQSxlQUFBOztHQUVBLEdBQUEsT0FBQSxHQUFBLEtBQUEsTUFBQSxZQUFBO0lBQ0EsR0FBQSxLQUFBLGVBQUE7SUFDQSxHQUFBLEtBQUEsV0FBQTs7O0VBR0EsU0FBQSxXQUFBO0dBQ0EsSUFBQSxHQUFBLEtBQUEsU0FBQSxHQUFBLEtBQUEsZ0JBQUEsR0FBQSxLQUFBLE1BQUEsVUFBQSxHQUFBO0lBQ0EsT0FBQTs7R0FFQSxPQUFBOztFQUVBLFNBQUEsV0FBQTtHQUNBLEdBQUEsT0FBQSxHQUFBLEtBQUEsY0FBQSxhQUFBLE9BQUE7R0FDQSxPQUFBLGVBQUEsR0FBQSxLQUFBLFdBQUEsU0FBQSxPQUFBOztFQUVBLFNBQUEsTUFBQTtHQUNBLEdBQUEsR0FBQSxLQUFBLEdBQUE7SUFDQSxHQUFBLEtBQUEsT0FBQSxLQUFBLFNBQUEsU0FBQTtLQUNBLEdBQUEsU0FBQTtNQUNBLE9BQUEsUUFBQSw4QkFBQTtNQUNBLEdBQUEsS0FBQSxVQUFBO01BQ0EsR0FBQSxXQUFBLFFBQUEsS0FBQSxHQUFBOzs7OztPQUtBO0lBQ0EsWUFBQSxLQUFBLFNBQUEsR0FBQSxNQUFBLEtBQUEsU0FBQSxTQUFBO0tBQ0EsR0FBQSxTQUFBO01BQ0EsT0FBQSxRQUFBLDRCQUFBO01BQ0EsR0FBQSxLQUFBLFVBQUE7TUFDQSxHQUFBLFdBQUEsUUFBQSxLQUFBLEdBQUE7TUFDQSxPQUFBLEdBQUEsZ0NBQUEsQ0FBQSxHQUFBLFNBQUE7Ozs7Ozs7RUFPQSxTQUFBLFlBQUEsT0FBQSxLQUFBOzs7O0VBSUEsT0FBQSxPQUFBLFdBQUEsU0FBQSxHQUFBLEVBQUE7R0FDQSxHQUFBLEtBQUEsR0FBQTtJQUNBLEdBQUEsS0FBQSxVQUFBLENBQUEsUUFBQSxPQUFBLEdBQUEsTUFBQSxHQUFBOztJQUVBOzs7OztBQ3RGQSxDQUFBLFlBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsa0JBQUEsVUFBQSx1QkFBQSxVQUFBLFVBQUE7RUFDQSxJQUFBLFdBQUEsWUFBQTtHQUNBLE9BQUE7SUFDQSxJQUFBO0lBQ0EsT0FBQTtJQUNBLFFBQUE7SUFDQSxNQUFBO0lBQ0EsT0FBQTtJQUNBLFVBQUE7SUFDQSxRQUFBO0tBQ0EsTUFBQTtLQUNBLE9BQUE7S0FDQSxLQUFBO0tBQ0EsUUFBQTs7SUFFQSxRQUFBLEVBQUE7S0FDQSxVQUFBO0tBQ0EsT0FBQTtLQUNBLFNBQUE7T0FDQTtLQUNBLFVBQUE7S0FDQSxPQUFBO0tBQ0EsU0FBQTtNQUNBO0tBQ0EsVUFBQTtLQUNBLE9BQUE7S0FDQSxTQUFBOzs7O0VBSUEsT0FBQTtHQUNBLFVBQUE7R0FDQSxPQUFBO0lBQ0EsTUFBQTtJQUNBLFNBQUE7O0dBRUEsU0FBQTtHQUNBLE1BQUEsVUFBQSxRQUFBLFNBQUEsUUFBQSxTQUFBOztJQUVBLElBQUEsVUFBQSxRQUFBLE9BQUEsWUFBQTtJQUNBLElBQUEsTUFBQSxHQUFBLE1BQUE7SUFDQSxVQUFBLFFBQUEsT0FBQSxTQUFBLE9BQUE7O0lBRUEsUUFBQSxTQUFBLElBQUEsT0FBQTtJQUNBLEdBQUEsUUFBQSxNQUFBO0tBQ0EsUUFBQSxPQUFBLEdBQUEsUUFBQSxRQUFBOztJQUVBLFFBQUEsSUFBQSxVQUFBLFFBQUEsU0FBQSxNQUFBLElBQUEsaUJBQUEsUUFBQSxTQUFBLElBQUE7OztJQUdBLFFBQUEsUUFBQSxPQUFBLE1BQUEsVUFBQSxLQUFBLEtBQUE7S0FDQSxNQUFBLEdBQUEsSUFBQSxDQUFBLEtBQUEsU0FBQSxJQUFBLFFBQUE7S0FDQSxNQUFBLEdBQUEsSUFBQSxDQUFBLEtBQUEsU0FBQSxJQUFBLFFBQUE7OztJQUdBLElBQUEsSUFBQSxHQUFBLE1BQUE7TUFDQSxPQUFBLENBQUEsS0FBQTtNQUNBLE1BQUEsQ0FBQSxRQUFBLE9BQUEsTUFBQSxRQUFBLFFBQUEsUUFBQSxPQUFBO01BQ0EsTUFBQTs7SUFFQSxJQUFBLFFBQUEsR0FBQSxJQUFBO01BQ0EsRUFBQTtNQUNBLE9BQUEsQ0FBQSxHQUFBO01BQ0EsR0FBQSxTQUFBO01BQ0EsR0FBQSxZQUFBOztJQUVBLElBQUEsTUFBQSxHQUFBLE9BQUEsUUFBQSxJQUFBLE9BQUE7TUFDQSxLQUFBLFNBQUEsUUFBQTtNQUNBLEtBQUEsVUFBQSxRQUFBO01BQ0EsT0FBQTs7SUFFQSxJQUFBLFdBQUEsSUFBQSxPQUFBO01BQ0EsT0FBQTtNQUNBLEtBQUEsTUFBQSxRQUFBLE1BQUEsUUFBQTtNQUNBLEtBQUEsTUFBQTtNQUNBLEtBQUEsTUFBQTtNQUNBLEtBQUEsTUFBQTtNQUNBLEtBQUEsTUFBQTtNQUNBLEtBQUEsZ0JBQUE7SUFDQSxRQUFBLFFBQUEsUUFBQSxRQUFBLFVBQUEsT0FBQTtLQUNBLFNBQUEsT0FBQTtPQUNBLEtBQUEsVUFBQSxNQUFBLFdBQUE7T0FDQSxLQUFBLGNBQUEsTUFBQTtPQUNBLEtBQUEsZ0JBQUEsTUFBQTs7SUFFQSxJQUFBLE9BQUEsSUFBQSxPQUFBO01BQ0EsS0FBQSxTQUFBLFFBQUE7TUFDQSxLQUFBLFVBQUEsUUFBQTtNQUNBLE1BQUEsUUFBQSxXQUFBLFFBQUEsTUFBQSxRQUFBLFNBQUE7SUFDQSxJQUFBLFNBQUEsSUFBQSxPQUFBLEtBQUEsS0FBQSxhQUFBLGVBQUEsUUFBQSxTQUFBLElBQUEsT0FBQSxRQUFBLFNBQUEsSUFBQTtNQUNBLEtBQUEsU0FBQTs7SUFFQSxJQUFBLFFBQUEsU0FBQSxNQUFBOztLQUVBLE9BQUEsT0FBQTtPQUNBLEtBQUEsS0FBQSxRQUFBLFNBQUE7S0FDQSxPQUFBLE9BQUE7T0FDQSxLQUFBO09BQ0EsTUFBQSxhQUFBLFFBQUEsT0FBQTtPQUNBLEtBQUEsZUFBQTtPQUNBLEtBQUEsS0FBQTtPQUNBLEtBQUEsTUFBQTtLQUNBLElBQUEsVUFBQSxJQUFBLE9BQUEsS0FBQSxLQUFBLGFBQUEsZ0JBQUEsUUFBQSxTQUFBLFFBQUEsU0FBQSxNQUFBLE9BQUEsUUFBQSxTQUFBLElBQUE7T0FDQSxLQUFBLFNBQUE7S0FDQSxRQUFBLE9BQUE7T0FDQSxLQUFBLEtBQUEsUUFBQSxTQUFBO0tBQ0EsUUFBQSxPQUFBO09BQ0EsS0FBQSxVQUFBOztPQUVBLEdBQUEsTUFBQSxLQUFBO1FBQ0EsSUFBQSxJQUFBLENBQUEsU0FBQSxPQUFBLE1BQUE7UUFDQSxPQUFBLEVBQUEsT0FBQSxHQUFBLEVBQUEsUUFBQSxTQUFBOztPQUVBLE9BQUE7O09BRUEsTUFBQSxhQUFBLFFBQUEsT0FBQTtPQUNBLEtBQUEsZUFBQTtPQUNBLEtBQUEsS0FBQTtPQUNBLEtBQUEsTUFBQTs7SUFFQSxJQUFBLFNBQUEsSUFBQSxPQUFBO01BQ0EsS0FBQSxTQUFBO0lBQ0EsR0FBQSxRQUFBLFlBQUEsS0FBQTtLQUNBLE9BQUEsS0FBQTs7O0lBR0EsT0FBQSxPQUFBO01BQ0EsS0FBQSxVQUFBLFFBQUE7O0lBRUEsSUFBQSxRQUFBLFNBQUEsTUFBQTtJQUNBLE9BQUEsT0FBQTtNQUNBLEtBQUEsTUFBQSxRQUFBLFFBQUE7TUFDQSxLQUFBLE1BQUE7TUFDQSxLQUFBLE1BQUEsUUFBQSxRQUFBO01BQ0EsS0FBQSxNQUFBLFFBQUE7TUFDQSxLQUFBLG9CQUFBO01BQ0EsS0FBQSxnQkFBQTtNQUNBLEtBQUEsVUFBQTs7SUFFQSxJQUFBLGFBQUEsT0FBQSxPQUFBO01BQ0EsS0FBQSxhQUFBLGlCQUFBLFFBQUEsU0FBQSxJQUFBO0lBQ0EsSUFBQSxTQUFBLFdBQUEsT0FBQTtNQUNBLEtBQUEsU0FBQTtNQUNBLEtBQUEsS0FBQSxRQUFBLFNBQUE7S0FDQSxHQUFBLFFBQUEsTUFBQTtNQUNBLE9BQUEsTUFBQSxRQUFBLFFBQUE7O0lBRUEsSUFBQSxjQUFBLFdBQUEsT0FBQTtNQUNBLEtBQUE7TUFDQSxNQUFBLGFBQUEsUUFBQSxPQUFBO01BQ0EsS0FBQSxlQUFBLFVBQUEsS0FBQSxLQUFBOzs7Ozs7SUFNQSxTQUFBLFFBQUE7S0FDQSxJQUFBLFFBQUEsTUFBQSxTQUFBOztLQUVBLElBQUEsR0FBQSxNQUFBLGFBQUE7TUFDQSxRQUFBLEVBQUEsT0FBQSxHQUFBLE1BQUEsTUFBQTtNQUNBLE1BQUEsT0FBQSxDQUFBLE9BQUE7OztLQUdBLEdBQUEsU0FBQSxTQUFBLEtBQUE7TUFDQSxJQUFBLElBQUEsQ0FBQSxTQUFBLFNBQUEsTUFBQTtNQUNBLFlBQUEsS0FBQSxFQUFBLE9BQUEsR0FBQSxFQUFBLFFBQUEsU0FBQTs7U0FFQTtNQUNBLFlBQUEsS0FBQSxTQUFBOztLQUVBLFdBQUEsS0FBQSxhQUFBLGVBQUEsRUFBQSxTQUFBLE1BQUEsUUFBQSxTQUFBLElBQUE7OztJQUdBLFNBQUEsVUFBQTs7S0FFQSxJQUFBLFFBQUEsTUFBQSxTQUFBO01BQ0EsUUFBQTtNQUNBLFFBQUE7S0FDQSxJQUFBLFFBQUE7S0FDQSxHQUFBOztNQUVBLFFBQUEsUUFBQSxPQUFBLE1BQUEsVUFBQSxLQUFBLEtBQUE7T0FDQSxJQUFBLFNBQUEsSUFBQSxRQUFBLFdBQUEsU0FBQSxRQUFBO1FBQ0EsUUFBQTtRQUNBLFFBQUE7OztNQUdBO01BQ0EsUUFBQSxRQUFBLEtBQUEsUUFBQSxJQUFBLFFBQUE7Y0FDQSxDQUFBLFNBQUEsUUFBQTs7S0FFQSxRQUFBLGNBQUE7S0FDQSxRQUFBOzs7O0lBSUEsT0FBQSxPQUFBLFdBQUEsU0FBQSxFQUFBLEVBQUE7S0FDQSxHQUFBLE1BQUEsRUFBQTtNQUNBOztLQUVBLFFBQUEsT0FBQSxHQUFBLFFBQUEsRUFBQTtLQUNBLFdBQUEsSUFBQSxPQUFBO09BQ0EsT0FBQTtPQUNBLEtBQUEsTUFBQSxRQUFBLE1BQUEsSUFBQSxFQUFBO09BQ0EsS0FBQSxNQUFBO09BQ0EsS0FBQSxNQUFBO09BQ0EsS0FBQSxNQUFBO09BQ0EsS0FBQSxNQUFBO09BQ0EsS0FBQSxnQkFBQTtLQUNBLFFBQUEsUUFBQSxRQUFBLFFBQUEsVUFBQSxPQUFBO01BQ0EsU0FBQSxPQUFBO1FBQ0EsS0FBQSxVQUFBLE1BQUEsV0FBQTtRQUNBLEtBQUEsY0FBQSxNQUFBO1FBQ0EsS0FBQSxnQkFBQSxNQUFBOztLQUVBLEtBQUEsTUFBQSxRQUFBLFVBQUEsUUFBQSxRQUFBLElBQUEsRUFBQSxNQUFBO0tBQ0EsT0FBQSxNQUFBLFFBQUEsRUFBQTtLQUNBLEdBQUEsUUFBQSxZQUFBO09BQ0EsWUFBQSxLQUFBLFNBQUEsUUFBQSxZQUFBLEVBQUE7T0FDQSxXQUFBLGFBQUEsU0FBQSxLQUFBLEtBQUEsUUFBQSxLQUFBLGFBQUEsZUFBQSxFQUFBLFFBQUEsWUFBQSxFQUFBLFVBQUEsTUFBQSxRQUFBLFNBQUEsSUFBQTs7U0FFQTtNQUNBLFlBQUEsS0FBQTs7O0lBR0EsT0FBQTtLQUNBLFlBQUE7TUFDQSxPQUFBLFFBQUE7O0tBRUEsVUFBQSxVQUFBLFVBQUE7TUFDQSxJQUFBLENBQUEsVUFBQTtPQUNBLFlBQUEsS0FBQSxTQUFBO09BQ0EsV0FBQSxLQUFBLGFBQUEsZUFBQSxFQUFBLEtBQUEsTUFBQSxRQUFBLFNBQUEsSUFBQTtPQUNBOztNQUVBLFlBQUEsS0FBQSxTQUFBLFNBQUEsUUFBQTtNQUNBLElBQUEsWUFBQSxVQUFBO09BQ0EsV0FBQSxLQUFBLGFBQUEsZUFBQSxFQUFBLFNBQUEsUUFBQSxVQUFBLE1BQUEsUUFBQSxTQUFBLElBQUE7YUFDQTtPQUNBLFdBQUEsYUFBQSxTQUFBLEtBQUEsS0FBQSxRQUFBLEtBQUEsYUFBQSxlQUFBLEVBQUEsU0FBQSxRQUFBLFVBQUEsTUFBQSxRQUFBLFNBQUEsSUFBQTs7OztLQUlBLE9BQUEsT0FBQSxRQUFBLFNBQUEsR0FBQSxFQUFBO01BQ0EsR0FBQSxNQUFBLEdBQUEsT0FBQTs7TUFFQSxNQUFBO01BQ0EsTUFBQTtNQUNBLFFBQUEsUUFBQSxPQUFBLE1BQUEsVUFBQSxLQUFBLEtBQUE7T0FDQSxNQUFBLEdBQUEsSUFBQSxDQUFBLEtBQUEsU0FBQSxJQUFBLFFBQUE7T0FDQSxNQUFBLEdBQUEsSUFBQSxDQUFBLEtBQUEsU0FBQSxJQUFBLFFBQUE7T0FDQSxHQUFBLElBQUEsT0FBQSxRQUFBLFlBQUEsSUFBQTtTQUNBLFlBQUEsS0FBQSxTQUFBLElBQUEsUUFBQTtTQUNBLFdBQUEsYUFBQSxTQUFBLEtBQUEsS0FBQSxRQUFBLEtBQUEsYUFBQSxlQUFBLEVBQUEsSUFBQSxRQUFBLFVBQUEsTUFBQSxRQUFBLFNBQUEsSUFBQTs7OztNQUlBLFFBQUEsSUFBQSxRQUFBO01BQ0EsSUFBQSxHQUFBLE1BQUE7UUFDQSxPQUFBLENBQUEsS0FBQTtRQUNBLE1BQUEsQ0FBQSxRQUFBLE9BQUEsTUFBQSxRQUFBLFFBQUEsUUFBQSxPQUFBO1FBQ0EsTUFBQTtNQUNBLE1BQUEsRUFBQTtTQUNBLE9BQUEsQ0FBQSxHQUFBO1NBQ0EsR0FBQSxTQUFBO1NBQ0EsR0FBQSxZQUFBO01BQ0EsT0FBQSxPQUFBLGVBQUEsS0FBQTtNQUNBLFFBQUEsT0FBQSxlQUFBLEtBQUEsVUFBQTs7T0FFQSxHQUFBLE1BQUEsS0FBQTtRQUNBLElBQUEsSUFBQSxDQUFBLFNBQUEsT0FBQSxNQUFBO1FBQ0EsT0FBQSxFQUFBLE9BQUEsR0FBQSxFQUFBLFFBQUEsU0FBQTs7T0FFQSxPQUFBOztNQUVBLFFBQUEsUUFBQSxPQUFBLE1BQUEsVUFBQSxLQUFBLEtBQUE7T0FDQSxHQUFBLElBQUEsT0FBQSxRQUFBLFlBQUEsSUFBQTtTQUNBLFlBQUEsS0FBQSxTQUFBLElBQUEsUUFBQTtTQUNBLFdBQUEsYUFBQSxTQUFBLEtBQUEsS0FBQSxRQUFBLEtBQUEsYUFBQSxlQUFBLEVBQUEsSUFBQSxRQUFBLFVBQUEsTUFBQSxRQUFBLFNBQUEsSUFBQTs7Ozs7Ozs7Ozs7OztBQzFSQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLFFBQUEsb0JBQUEsWUFBQSxjQUFBLFVBQUE7Ozs7OztBQ0hBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxrQkFBQSxXQUFBLHFEQUFBLFNBQUEsUUFBQSxVQUFBLFFBQUE7O0VBRUEsT0FBQTtHQUNBLFVBQUE7R0FDQSxhQUFBO0dBQ0EsWUFBQTtHQUNBLE9BQUE7SUFDQSxTQUFBO0lBQ0EsS0FBQTs7R0FFQSxNQUFBLFVBQUEsT0FBQSxTQUFBLE9BQUE7O0lBRUEsSUFBQSxTQUFBO0lBQ0EsSUFBQSxVQUFBO0tBQ0EsV0FBQTtLQUNBLGFBQUE7S0FDQTtJQUNBLElBQUEsT0FBQTtJQUNBLElBQUEsV0FBQTtJQUNBLElBQUEsbUJBQUE7SUFDQSxJQUFBLFNBQUEsUUFBQSxLQUFBO0lBQ0EsSUFBQSxRQUFBLFFBQUEsS0FBQTtJQUNBLElBQUEsYUFBQTtJQUNBLElBQUEsTUFBQTtJQUNBLElBQUEsVUFBQTtJQUNBLE1BQUEsSUFBQTtLQUNBLFNBQUE7O0lBRUEsT0FBQSxLQUFBLFNBQUEsWUFBQTtLQUNBLE1BQUEsR0FBQTs7SUFFQSxNQUFBLEtBQUEsVUFBQSxVQUFBLEdBQUE7S0FDQSxhQUFBO0tBQ0EsTUFBQTtLQUNBLFVBQUE7O0tBRUEsU0FBQTtLQUNBLFVBQUEsR0FBQSxXQUFBLEdBQUEsYUFBQSxHQUFBO0tBQ0EsT0FBQTtLQUNBLFdBQUE7S0FDQSxNQUFBLFVBQUE7S0FDQSxTQUFBLFlBQUE7O01BRUEsSUFBQSxPQUFBLE1BQUEsR0FBQSxNQUFBLEdBQUE7TUFDQSxJQUFBLE1BQUEsS0FBQSxNQUFBLE1BQUEsR0FBQSxNQUFBLElBQUE7T0FDQSxnQkFBQTtPQUNBLFFBQUE7T0FDQSxlQUFBO09BQ0EsVUFBQTtPQUNBLE1BQUEsVUFBQSxLQUFBO1FBQ0EsSUFBQSxVQUFBLElBQUEsS0FBQSxHQUFBLFVBQUEsTUFBQSxXQUFBLElBQUEsU0FBQTtRQUNBO1lBQ0EsT0FBQSxFQUFBOztRQUVBLElBQUEsS0FBQSxHQUFBLFNBQUE7UUFDQSxNQUFBLE9BQUEsUUFBQTtRQUNBLE1BQUEsUUFBQSxLQUFBLElBQUEsS0FBQTs7O09BR0EsU0FBQSxVQUFBO1FBQ0EsTUFBQTs7Ozs7Ozs7Ozs7Ozs7QUMvREEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxRQUFBLG9CQUFBLFlBQUEsd0JBQUEsVUFBQTs7Ozs7O0FDSEEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGtCQUFBLFdBQUEsMkRBQUEsU0FBQSxRQUFBLFVBQUEsUUFBQTs7RUFFQSxPQUFBO0dBQ0EsVUFBQTtHQUNBLGFBQUE7R0FDQSxZQUFBO0dBQ0EsT0FBQTtJQUNBLFFBQUE7O0dBRUEsTUFBQSxVQUFBLE9BQUEsU0FBQSxPQUFBOztJQUVBLElBQUEsU0FBQTtJQUNBLElBQUEsVUFBQTtLQUNBLFdBQUE7S0FDQSxhQUFBO0tBQ0E7SUFDQSxJQUFBLE9BQUE7SUFDQSxJQUFBLFdBQUE7SUFDQSxJQUFBLG1CQUFBO0lBQ0EsSUFBQSxTQUFBLFFBQUEsS0FBQTtJQUNBLElBQUEsUUFBQSxRQUFBLEtBQUE7SUFDQSxJQUFBLGFBQUE7SUFDQSxJQUFBLE1BQUE7SUFDQSxJQUFBLFVBQUE7SUFDQSxNQUFBLElBQUE7S0FDQSxTQUFBOztJQUVBLE9BQUEsS0FBQSxTQUFBLFlBQUE7S0FDQSxNQUFBLEdBQUE7O0lBRUEsTUFBQSxLQUFBLFVBQUEsVUFBQSxHQUFBO0tBQ0EsYUFBQTtLQUNBLE1BQUE7S0FDQSxVQUFBO0NBQ0EsTUFBQSxTQUFBO0tBQ0EsU0FBQTtLQUNBLFVBQUEsR0FBQSxXQUFBLEdBQUEsYUFBQSxHQUFBO0tBQ0EsT0FBQTtLQUNBLFdBQUE7S0FDQSxTQUFBLFlBQUE7O01BRUEsSUFBQSxPQUFBLE1BQUEsR0FBQSxNQUFBLEdBQUE7TUFDQSxJQUFBLE1BQUEsS0FBQSxNQUFBLE1BQUEsR0FBQSxNQUFBLElBQUE7T0FDQSxnQkFBQTtPQUNBLFFBQUE7T0FDQSxlQUFBO09BQ0EsVUFBQTtPQUNBLE1BQUEsVUFBQSxLQUFBO1FBQ0EsUUFBQSxJQUFBLEtBQUEsR0FBQTtTQUNBLEtBQUE7VUFDQSxJQUFBLEtBQUEsR0FBQSxVQUFBO1VBQ0E7U0FDQSxLQUFBO1VBQ0EsSUFBQSxLQUFBLEdBQUEsVUFBQTtVQUNBO1NBQ0EsS0FBQTtVQUNBLElBQUEsS0FBQSxHQUFBLFVBQUE7VUFDQTtTQUNBOzs7UUFHQSxNQUFBLE9BQUEsS0FBQSxJQUFBLEtBQUE7O09BRUEsU0FBQSxVQUFBO1FBQ0EsTUFBQTs7Ozs7Ozs7Ozs7Ozs7QUNuRUEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxRQUFBLG9CQUFBLFlBQUEsOEJBQUEsVUFBQTs7Ozs7O0FDSEEsQ0FBQSxZQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGtCQUFBLFVBQUEsNkRBQUEsVUFBQSxRQUFBLFVBQUEsUUFBQSxjQUFBOztFQUVBLE9BQUE7R0FDQSxVQUFBO0dBQ0EsYUFBQTtHQUNBLFlBQUE7R0FDQSxTQUFBO0dBQ0EsTUFBQSxVQUFBLFFBQUEsU0FBQSxRQUFBOztJQUVBLElBQUEsU0FBQTtJQUNBLElBQUEsVUFBQTtLQUNBLFdBQUE7S0FDQSxhQUFBO0tBQ0E7SUFDQSxJQUFBLE9BQUE7SUFDQSxJQUFBLFdBQUE7SUFDQSxJQUFBLG1CQUFBO0lBQ0EsSUFBQSxTQUFBLFFBQUEsS0FBQTtJQUNBLElBQUEsUUFBQSxRQUFBLEtBQUE7SUFDQSxJQUFBLGFBQUE7SUFDQSxJQUFBLE1BQUE7SUFDQSxJQUFBLFVBQUE7SUFDQSxNQUFBLElBQUE7S0FDQSxTQUFBOztJQUVBLE9BQUEsS0FBQSxTQUFBLFlBQUE7S0FDQSxNQUFBLEdBQUE7O0lBRUEsTUFBQSxLQUFBLFVBQUEsVUFBQSxHQUFBO0tBQ0EsYUFBQTtLQUNBLE1BQUE7S0FDQSxVQUFBOztLQUVBLFNBQUE7S0FDQSxVQUFBLEdBQUEsV0FBQSxHQUFBLGFBQUEsR0FBQTtLQUNBLE9BQUE7S0FDQSxXQUFBO0tBQ0EsU0FBQSxZQUFBO01BQ0EsYUFBQTtNQUNBLFFBQUEsSUFBQTtNQUNBLElBQUEsT0FBQSxNQUFBLEdBQUEsTUFBQSxHQUFBO01BQ0EsSUFBQSxNQUFBLEtBQUEsTUFBQSxNQUFBLEdBQUEsTUFBQSxJQUFBO09BQ0EsZ0JBQUE7T0FDQSxRQUFBO09BQ0EsZUFBQTtPQUNBLFVBQUE7OztPQUdBLE9BQUEsVUFBQSxPQUFBO1FBQ0EsUUFBQSxRQUFBLE1BQUEsTUFBQSxVQUFBLEtBQUEsT0FBQTs7U0FFQSxJQUFBLElBQUE7VUFDQSxLQUFBO1VBQ0EsT0FBQTs7U0FFQSxRQUFBLFFBQUEsS0FBQSxVQUFBLE1BQUEsS0FBQTtVQUNBLElBQUEsTUFBQSxTQUFBLE9BQUEsR0FBQTtXQUNBLElBQUEsS0FBQSxXQUFBLGlCQUFBLHlCQUFBLEtBQUEsV0FBQSxjQUFBLFFBQUEsU0FBQSxDQUFBLEdBQUE7WUFDQSxJQUFBLFFBQUE7YUFDQSxNQUFBO2FBQ0EsU0FBQTthQUNBLFFBQUE7YUFDQSxPQUFBOztZQUVBLEVBQUEsT0FBQSxLQUFBO1lBQ0EsT0FBQSxLQUFBOzs7O1NBSUEsSUFBQSxZQUFBO1VBQ0EsUUFBQSxRQUFBLEtBQUEsVUFBQSxNQUFBLEtBQUE7V0FDQSxJQUFBLElBQUEsVUFBQSxHQUFBO1lBQ0EsSUFBQSxPQUFBLFFBQUEsS0FBQSxRQUFBLGFBQUE7YUFDQSxRQUFBLEtBQUEsT0FBQTs7WUFFQSxRQUFBLEtBQUEsS0FBQSxLQUFBOzs7O2dCQUlBOztVQUVBLEVBQUEsT0FBQTs7VUFFQSxhQUFBLFFBQUE7Ozs7OztPQU1BLGtCQUFBLFVBQUEsT0FBQTs7O1FBR0EsSUFBQSxRQUFBLE1BQUEsTUFBQSxjQUFBO1FBQ0EsSUFBQSxZQUFBO1FBQ0EsSUFBQSxXQUFBLE1BQUEsT0FBQSxHQUFBLE9BQUEsTUFBQTs7UUFFQSxJQUFBLFNBQUEsU0FBQSxHQUFBO1NBQ0EsV0FBQSxNQUFBLE9BQUEsR0FBQSxPQUFBLE1BQUE7U0FDQSxZQUFBOztRQUVBLElBQUEsUUFBQTs7UUFFQSxLQUFBLElBQUEsSUFBQSxHQUFBLEtBQUEsU0FBQSxRQUFBLEtBQUE7U0FDQSxJQUFBLFNBQUEsSUFBQTtVQUNBLFNBQUEsS0FBQSxTQUFBLEdBQUEsUUFBQSxlQUFBLEtBQUE7VUFDQSxJQUFBLFNBQUEsR0FBQSxRQUFBLE9BQUEsQ0FBQSxHQUFBO1dBQ0EsU0FBQSxLQUFBLFNBQUEsR0FBQSxPQUFBLEdBQUEsU0FBQSxHQUFBLFFBQUE7O1VBRUEsSUFBQSxPQUFBLFNBQUEsR0FBQSxNQUFBO1VBQ0EsSUFBQSxLQUFBLFNBQUEsR0FBQTtXQUNBLFNBQUEsS0FBQTtXQUNBLEtBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxLQUFBLFFBQUEsS0FBQTtZQUNBLElBQUEsTUFBQSxLQUFBLEtBQUE7YUFDQSxJQUFBLElBQUEsR0FBQTtjQUNBLFNBQUEsTUFBQTs7YUFFQSxTQUFBLE1BQUEsS0FBQTs7Ozs7VUFLQSxJQUFBLFNBQUEsR0FBQSxVQUFBLEdBQUE7V0FDQSxNQUFBLEtBQUE7Ozs7UUFJQSxJQUFBLFNBQUEsVUFBQSxNQUFBLFFBQUE7U0FDQSxhQUFBO1NBQ0EsS0FBQSxJQUFBLElBQUEsR0FBQSxLQUFBLFNBQUEsUUFBQSxLQUFBO1VBQ0EsSUFBQSxPQUFBLFFBQUEsU0FBQSxPQUFBLGFBQUE7V0FDQSxRQUFBLFNBQUEsTUFBQTs7VUFFQSxRQUFBLFNBQUEsSUFBQSxPQUFBOzs7O1FBSUEsT0FBQSxTQUFBLEtBQUEsYUFBQSxNQUFBLE9BQUE7O09BRUEsT0FBQSxVQUFBLEtBQUEsTUFBQTtRQUNBLGFBQUEsTUFBQTs7T0FFQSxVQUFBLFVBQUEsU0FBQTs7UUFFQSxhQUFBLFVBQUE7OztRQUdBLElBQUEsQ0FBQSxZQUFBO1NBQ0EsUUFBQSxRQUFBLGFBQUEsZ0JBQUEsTUFBQSxVQUFBLE1BQUEsS0FBQTs7VUFFQSxJQUFBLElBQUEsY0FBQSxRQUFBLFVBQUEsQ0FBQSxLQUFBLElBQUEsY0FBQSxRQUFBLFdBQUEsQ0FBQSxHQUFBO1dBQ0EsYUFBQSxZQUFBOztVQUVBLElBQUEsSUFBQSxjQUFBLFFBQUEsY0FBQSxDQUFBLEdBQUE7V0FDQSxhQUFBLGdCQUFBOztVQUVBLElBQUEsSUFBQSxjQUFBLFFBQUEsV0FBQSxDQUFBLEtBQUEsS0FBQSxXQUFBLFVBQUEsR0FBQTtXQUNBLGFBQUEsYUFBQTs7O2VBR0E7U0FDQSxRQUFBLFFBQUEsU0FBQSxVQUFBLE1BQUEsS0FBQTtVQUNBLEtBQUEsU0FBQTtVQUNBLElBQUEsS0FBQSxpQkFBQSxlQUFBLE9BQUEsT0FBQSxhQUFBO1dBQ0EsSUFBQSxJQUFBO1lBQ0EsS0FBQSxJQUFBOztXQUVBLFFBQUEsUUFBQSxLQUFBLE1BQUEsVUFBQSxRQUFBLEdBQUE7WUFDQSxFQUFBLFlBQUEsS0FBQTtZQUNBLElBQUEsTUFBQSxXQUFBLFNBQUEsR0FBQTthQUNBLElBQUEsT0FBQSxXQUFBLGlCQUFBLFFBQUEsU0FBQSxLQUFBLE9BQUEsV0FBQSxjQUFBLFFBQUEsU0FBQSxDQUFBLEdBQUE7Y0FDQSxLQUFBLE9BQUEsS0FBQTtlQUNBLE1BQUE7ZUFDQSxTQUFBO2VBQ0EsUUFBQTs7Y0FFQTs7Ozs7V0FLQSxhQUFBLFFBQUE7WUFDQSxNQUFBLENBQUE7WUFDQSxRQUFBLEtBQUE7Ozs7U0FJQSxhQUFBLFlBQUE7O1FBRUEsYUFBQTtRQUNBLFNBQUEsVUFBQTtTQUNBLE9BQUEsS0FBQSxhQUFBLGdCQUFBLG9CQUFBO1NBQ0EsT0FBQSxHQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0FDbE1BLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsUUFBQSxvQkFBQSxZQUFBLGdCQUFBLFVBQUE7Ozs7Ozs7QUNIQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsa0JBQUEsV0FBQSxZQUFBLFdBQUE7O0VBRUEsT0FBQTtHQUNBLFVBQUE7R0FDQSxhQUFBO0dBQ0EsWUFBQTtHQUNBLE1BQUE7SUFDQSxNQUFBO0lBQ0EsWUFBQTtJQUNBLGdCQUFBOztHQUVBLE1BQUEsVUFBQSxPQUFBLFNBQUEsT0FBQTs7S0FFQSxTQUFBLFNBQUEsRUFBQSxFQUFBLE9BQUEsQ0FBQSxXQUFBLFdBQUEsV0FBQSxVQUFBLFNBQUEsV0FBQTtJQUNBLElBQUEsS0FBQSxNQUFBO0lBQ0EsUUFBQSxJQUFBO0lBQ0EsSUFBQSxJQUFBLE9BQUEsUUFBQSxDQUFBLEVBQUEsS0FBQSxHQUFBO1FBQ0EsT0FBQSxJQUFBLEtBQUEsSUFBQSxPQUFBLEdBQUEsT0FBQSxLQUFBOztJQUVBLElBQUEsU0FBQSxHQUFBLE9BQUEsUUFBQSxJQUFBLE9BQUE7YUFDQSxLQUFBLFNBQUEsT0FBQSxHQUFBLEtBQUEsVUFBQSxPQUFBO09BQ0EsS0FBQSxTQUFBLGFBQUEsT0FBQTthQUNBLEtBQUEsYUFBQSxhQUFBLE9BQUEsRUFBQSxFQUFBLElBQUEsT0FBQSxFQUFBLEVBQUE7SUFDQSxJQUFBLFVBQUEsR0FBQSxPQUFBLFFBQUEsSUFBQSxPQUFBO2FBQ0EsS0FBQSxTQUFBLE9BQUEsR0FBQSxLQUFBLFVBQUEsT0FBQTtPQUNBLEtBQUEsU0FBQTtPQUNBLE9BQUE7YUFDQSxLQUFBLGFBQUEsYUFBQSxPQUFBLEVBQUEsRUFBQSxJQUFBLE9BQUEsRUFBQSxFQUFBOzs7UUFHQSxJQUFBLE1BQUEsR0FBQSxJQUFBLE1BQUEsWUFBQSxPQUFBLElBQUEsSUFBQSxZQUFBLE9BQUEsSUFBQTtRQUNBLElBQUEsT0FBQSxHQUFBLElBQUEsTUFBQSxZQUFBLE9BQUEsSUFBQSxJQUFBLFlBQUE7OztRQUdBLElBQUEsTUFBQSxHQUFBLE9BQUEsTUFBQSxLQUFBLE1BQUEsTUFBQSxTQUFBLEdBQUEsRUFBQSxPQUFBLEVBQUE7UUFDQSxJQUFBLE9BQUEsR0FBQSxPQUFBLE1BQUEsS0FBQSxNQUFBLE1BQUEsU0FBQSxHQUFBLEVBQUEsT0FBQSxFQUFBOzs7UUFHQSxPQUFBLFVBQUEsUUFBQSxLQUFBLElBQUEsS0FBQSxRQUFBLE9BQUEsUUFBQSxLQUFBLEtBQUE7YUFDQSxLQUFBLFNBQUEsR0FBQSxFQUFBLEtBQUEsV0FBQTthQUNBLE1BQUEsUUFBQSxTQUFBLEdBQUEsRUFBQSxPQUFBLEVBQUEsS0FBQTthQUNBLEdBQUEsWUFBQSxXQUFBLEdBQUEsV0FBQTtJQUNBLFFBQUEsVUFBQSxRQUFBLEtBQUEsSUFBQSxLQUFBLFFBQUEsT0FBQSxRQUFBLEtBQUEsS0FBQTtlQUNBLEtBQUEsU0FBQSxHQUFBLEVBQUEsS0FBQSxXQUFBO2VBQ0EsTUFBQSxRQUFBLFNBQUEsR0FBQSxFQUFBLE9BQUEsRUFBQSxLQUFBO2VBQ0EsR0FBQSxZQUFBLFdBQUEsR0FBQSxXQUFBOztRQUVBLEdBQUEsU0FBQSxTQUFBLEdBQUE7WUFDQSxPQUFBLFVBQUEsUUFBQSxLQUFBLElBQUEsS0FBQSxhQUFBLFNBQUE7aUJBQ0EsVUFBQSxLQUFBOzs7UUFHQSxTQUFBLFVBQUEsRUFBQTs7WUFFQSxNQUFBLGFBQUEsRUFBQSxLQUFBO01BQ0EsTUFBQTs7O1FBR0EsU0FBQSxTQUFBLEVBQUE7O1lBRUEsTUFBQSxhQUFBO01BQ0EsTUFBQTs7OztRQUlBLFNBQUEsU0FBQSxHQUFBO1lBQ0EsSUFBQSxJQUFBLEdBQUEsWUFBQSxLQUFBLFVBQUE7WUFDQSxLQUFBLFdBQUEsRUFBQTtZQUNBLE9BQUEsU0FBQSxHQUFBLEVBQUEsT0FBQSxJQUFBLEVBQUE7Ozs7Ozs7OztBQ3ZFQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLFFBQUEsb0JBQUEsWUFBQSxnQkFBQSxVQUFBOzs7Ozs7QUNIQSxDQUFBLFdBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsa0JBQUEsVUFBQSxZQUFBLFdBQUE7O0VBRUEsT0FBQTtHQUNBLFVBQUE7O0dBRUEsWUFBQTtHQUNBLE9BQUE7SUFDQSxNQUFBO0lBQ0EsWUFBQTtJQUNBLGdCQUFBOztHQUVBLE1BQUEsU0FBQSxPQUFBLFNBQUEsT0FBQTs7SUFFQSxJQUFBLFNBQUE7TUFDQSxLQUFBO01BQ0EsT0FBQTtNQUNBLFFBQUE7TUFDQSxNQUFBOztLQUVBLFFBQUEsTUFBQSxPQUFBLE9BQUEsT0FBQTtLQUNBLFNBQUEsTUFBQSxPQUFBLE1BQUEsT0FBQTtLQUNBLFdBQUE7S0FDQSxRQUFBOzs7SUFHQSxJQUFBLFFBQUE7S0FDQSxHQUFBLEdBQUEsTUFBQTs7SUFFQSxNQUFBLEVBQUEsT0FBQSxDQUFBLEdBQUE7SUFDQSxNQUFBLEVBQUEsTUFBQSxDQUFBLFFBQUE7SUFDQSxJQUFBLE1BQUEsR0FBQSxPQUFBLFFBQUEsSUFBQSxPQUFBO01BQ0EsS0FBQSxTQUFBLFFBQUEsT0FBQSxPQUFBLE9BQUE7TUFDQSxLQUFBLFVBQUEsU0FBQSxPQUFBLE1BQUEsT0FBQTtNQUNBLE9BQUE7TUFDQSxLQUFBLGFBQUEsaUJBQUEsT0FBQSxNQUFBOzs7O0lBSUEsSUFBQSxPQUFBLElBQUEsVUFBQSxTQUFBLEtBQUEsTUFBQSxNQUFBLFFBQUEsT0FBQSxLQUFBLEtBQUEsU0FBQTs7SUFFQSxJQUFBLFNBQUE7TUFDQSxPQUFBO01BQ0EsS0FBQSxLQUFBLFNBQUEsR0FBQSxHQUFBO01BQ0EsT0FBQSxjQUFBLEtBQUEsV0FBQSxTQUFBLEdBQUEsV0FBQSxTQUFBLFdBQUEsR0FBQSxNQUFBLE1BQUEsT0FBQTs7TUFFQSxLQUFBLFNBQUE7SUFDQSxJQUFBLFlBQUE7TUFDQSxPQUFBO01BQ0EsS0FBQSxLQUFBLFNBQUEsR0FBQSxHQUFBO01BQ0EsT0FBQSxjQUFBLEtBQUEsV0FBQSxVQUFBLE1BQUEsRUFBQSxFQUFBLFNBQUEsV0FBQSxTQUFBLE1BQUEsRUFBQSxFQUFBLFNBQUEsV0FBQSxHQUFBLE1BQUEsTUFBQSxPQUFBOzs7Ozs7Ozs7Ozs7S0FZQSxNQUFBLFFBQUEsU0FBQSxHQUFBO01BQ0EsT0FBQSxFQUFBOzs7Ozs7Ozs7O0lBVUEsSUFBQSxZQUFBO01BQ0EsT0FBQTs7SUFFQSxVQUFBLEtBQUEsU0FBQSxHQUFBO01BQ0EsT0FBQSxFQUFBO1FBQ0EsS0FBQSxLQUFBLFNBQUEsR0FBQSxHQUFBO01BQ0EsT0FBQSxLQUFBLFdBQUE7O01BRUEsS0FBQSxLQUFBLENBQUE7TUFDQSxLQUFBLFNBQUEsU0FBQSxHQUFBO01BQ0EsT0FBQTs7TUFFQSxNQUFBLE9BQUE7O0lBRUEsSUFBQSxhQUFBO01BQ0EsT0FBQTtJQUNBLFdBQUEsS0FBQSxTQUFBLEVBQUE7TUFDQSxPQUFBLEVBQUE7O01BRUEsS0FBQSxLQUFBLFNBQUEsR0FBQSxHQUFBO01BQ0EsT0FBQSxLQUFBLFdBQUE7O01BRUEsS0FBQSxLQUFBLFNBQUE7TUFDQSxLQUFBLFNBQUEsU0FBQSxHQUFBO01BQ0EsT0FBQTs7TUFFQSxNQUFBLFFBQUEsU0FBQSxFQUFBO01BQ0EsT0FBQSxFQUFBOzs7O0lBSUEsU0FBQSxhQUFBLEdBQUEsR0FBQSxHQUFBLEdBQUEsR0FBQSxJQUFBLElBQUEsSUFBQSxJQUFBO0tBQ0EsSUFBQTtLQUNBLFNBQUEsT0FBQSxJQUFBLEtBQUEsTUFBQTtLQUNBLFVBQUEsT0FBQSxJQUFBLElBQUE7S0FDQSxJQUFBLElBQUE7TUFDQSxVQUFBLE1BQUEsSUFBQSxNQUFBLElBQUEsWUFBQSxJQUFBLE1BQUE7WUFDQTtNQUNBLFVBQUEsTUFBQTtNQUNBLFVBQUEsTUFBQTs7S0FFQSxVQUFBLE9BQUEsSUFBQSxJQUFBO0tBQ0EsSUFBQSxJQUFBO01BQ0EsVUFBQSxNQUFBLElBQUEsTUFBQSxJQUFBLFlBQUEsQ0FBQSxJQUFBLE1BQUE7WUFDQTtNQUNBLFVBQUEsTUFBQTtNQUNBLFVBQUEsTUFBQSxDQUFBOztLQUVBLFVBQUEsT0FBQSxJQUFBLElBQUE7S0FDQSxJQUFBLElBQUE7TUFDQSxVQUFBLE1BQUEsSUFBQSxNQUFBLElBQUEsWUFBQSxDQUFBLElBQUEsTUFBQSxDQUFBO1lBQ0E7TUFDQSxVQUFBLE1BQUEsQ0FBQTtNQUNBLFVBQUEsTUFBQSxDQUFBOztLQUVBLFVBQUEsT0FBQSxJQUFBLElBQUE7S0FDQSxJQUFBLElBQUE7TUFDQSxVQUFBLE1BQUEsSUFBQSxNQUFBLElBQUEsWUFBQSxJQUFBLE1BQUEsQ0FBQTtZQUNBO01BQ0EsVUFBQSxNQUFBLENBQUE7TUFDQSxVQUFBLE1BQUE7O0tBRUEsVUFBQTtLQUNBLE9BQUE7Ozs7Ozs7OztBQzFJQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLFFBQUEsb0JBQUEsWUFBQSxnQkFBQSxVQUFBOzs7Ozs7QUNIQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsa0JBQUEsV0FBQSxtQkFBQSxXQUFBOztFQUVBLE9BQUE7R0FDQSxVQUFBO0dBQ0EsTUFBQTtHQUNBLGFBQUE7R0FDQSxZQUFBO0dBQ0EsY0FBQTtHQUNBLE1BQUE7R0FDQSxrQkFBQTtJQUNBLEtBQUE7SUFDQSxVQUFBO0lBQ0EsUUFBQTs7R0FFQSxNQUFBLFVBQUEsUUFBQSxTQUFBLFFBQUE7Ozs7Ozs7Ozs7QUNqQkEsQ0FBQSxZQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsa0NBQUEsVUFBQSxRQUFBO0VBQ0EsSUFBQSxLQUFBO0VBQ0EsSUFBQSxXQUFBLFVBQUE7R0FDQSxPQUFBO0lBQ0EsT0FBQTs7O0VBR0EsR0FBQSxVQUFBLFFBQUEsT0FBQSxZQUFBLEdBQUE7RUFDQSxHQUFBLFNBQUE7R0FDQSxTQUFBO0dBQ0EsVUFBQTtHQUNBLFVBQUE7R0FDQSxhQUFBO0dBQ0EsaUJBQUE7R0FDQSxrQkFBQTtHQUNBLGVBQUE7R0FDQSxpQkFBQTtHQUNBLFVBQUE7O0VBRUEsR0FBQSxRQUFBO0dBQ0EsU0FBQTtJQUNBLE9BQUE7O0dBRUEsTUFBQTs7O0VBR0E7O0VBRUEsU0FBQSxVQUFBO0dBQ0E7R0FDQTs7RUFFQSxTQUFBLGFBQUE7R0FDQSxHQUFBLE1BQUEsUUFBQSxNQUFBLFNBQUEsQ0FBQSxHQUFBLE1BQUEsS0FBQSxHQUFBLE1BQUE7O0dBRUEsU0FBQSxXQUFBO0dBQ0EsR0FBQSxNQUFBLFFBQUEsUUFBQTtJQUNBLE1BQUE7SUFDQSxnQkFBQTtJQUNBLFNBQUE7SUFDQSxRQUFBO0tBQ0EsS0FBQTtLQUNBLE9BQUE7S0FDQSxRQUFBO0tBQ0EsTUFBQTs7SUFFQSxHQUFBLFVBQUEsR0FBQTtLQUNBLE9BQUEsRUFBQTs7SUFFQSxHQUFBLFVBQUEsR0FBQTtLQUNBLE9BQUEsRUFBQTs7SUFFQSxZQUFBO0lBQ0EsWUFBQTs7O0lBR0Esb0JBQUE7O0lBRUEsUUFBQSxDQUFBLEdBQUEsTUFBQSxLQUFBLEdBQUEsTUFBQTs7SUFFQSxPQUFBO0tBQ0EsV0FBQTtLQUNBLG1CQUFBOztJQUVBLE9BQUE7S0FDQSxXQUFBO0tBQ0EsbUJBQUE7O0lBRUEsUUFBQTtLQUNBLFlBQUE7O0lBRUEsT0FBQTtLQUNBLGFBQUE7Ozs7O0dBS0EsSUFBQSxHQUFBLFFBQUEsVUFBQSxNQUFBO0lBQ0EsR0FBQSxNQUFBLFFBQUEsTUFBQSxTQUFBLENBQUEsU0FBQSxHQUFBLE1BQUEsTUFBQSxHQUFBLE1BQUE7O0dBRUEsUUFBQSxJQUFBLEdBQUE7R0FDQSxPQUFBLEdBQUE7O0VBRUEsU0FBQSxpQkFBQTtHQUNBLElBQUEsWUFBQTtHQUNBLEdBQUEsUUFBQTtJQUNBLEtBQUE7SUFDQSxLQUFBOzs7R0FHQSxRQUFBLFFBQUEsR0FBQSxXQUFBLFVBQUEsTUFBQSxLQUFBO0lBQ0EsSUFBQSxRQUFBO0tBQ0EsSUFBQTtLQUNBLEtBQUEsS0FBQTtLQUNBLE9BQUEsS0FBQTtLQUNBLFFBQUE7O0lBRUEsUUFBQSxRQUFBLEdBQUEsTUFBQSxVQUFBLE1BQUEsR0FBQTtLQUNBLE1BQUEsT0FBQSxLQUFBO01BQ0EsSUFBQTtNQUNBLEdBQUEsS0FBQSxLQUFBLE9BQUE7TUFDQSxHQUFBLEtBQUEsS0FBQSxPQUFBOztLQUVBLEdBQUEsTUFBQSxNQUFBLEtBQUEsSUFBQSxHQUFBLE1BQUEsS0FBQSxLQUFBLEtBQUEsT0FBQTtLQUNBLEdBQUEsTUFBQSxNQUFBLEtBQUEsSUFBQSxHQUFBLE1BQUEsS0FBQSxLQUFBLEtBQUEsT0FBQTs7SUFFQSxVQUFBLEtBQUE7O0dBRUEsR0FBQSxNQUFBO0dBQ0EsR0FBQSxNQUFBO0dBQ0EsR0FBQSxNQUFBLE9BQUE7R0FDQSxJQUFBLEdBQUEsUUFBQSxVQUFBLFFBQUE7SUFDQSxHQUFBLE1BQUEsUUFBQSxNQUFBLFVBQUEsQ0FBQSxTQUFBLEdBQUEsTUFBQSxNQUFBLEdBQUEsTUFBQTs7R0FFQSxPQUFBO0dBQ0E7RUFDQSxPQUFBLE9BQUEsV0FBQSxVQUFBLEdBQUEsR0FBQTtHQUNBLElBQUEsQ0FBQSxHQUFBO0lBQ0E7O0dBRUE7R0FDQTs7O0VBR0EsT0FBQSxPQUFBLGdCQUFBLFVBQUEsR0FBQSxHQUFBO0dBQ0EsSUFBQSxNQUFBLEdBQUE7SUFDQTs7Ozs7Ozs7O0FDaklBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxrQkFBQSxVQUFBLGlCQUFBLENBQUEsZUFBQSxTQUFBLGFBQUE7O0VBRUEsSUFBQSxTQUFBO1FBQ0EsSUFBQSxTQUFBOztRQUVBLFNBQUEsTUFBQSxJQUFBO1lBQ0EsSUFBQSxLQUFBLEdBQUEsR0FBQSxhQUFBO1lBQ0EsSUFBQSxDQUFBLElBQUE7Z0JBQ0EsS0FBQSxFQUFBO2dCQUNBLEdBQUEsR0FBQSxhQUFBLHFCQUFBOztZQUVBLE9BQUE7O1FBRUEsU0FBQSxTQUFBLElBQUE7WUFDQSxJQUFBLFFBQUEsT0FBQTtZQUNBLElBQUEsQ0FBQSxPQUFBO2dCQUNBLFFBQUE7Z0JBQ0EsT0FBQSxNQUFBOztZQUVBLE9BQUE7OztRQUdBLFNBQUEsZUFBQSxTQUFBLE9BQUEsVUFBQSxTQUFBLFFBQUE7WUFDQSxPQUFBLFdBQUE7Z0JBQ0EsTUFBQSxZQUFBO2dCQUNBLE1BQUEsV0FBQTtnQkFDQSxNQUFBLFNBQUE7Z0JBQ0EsU0FBQSxRQUFBLFFBQUEsV0FBQTtvQkFDQSxJQUFBLFdBQUEsTUFBQSxXQUFBLFFBQUE7d0JBQ0EsUUFBQSxHQUFBLE1BQUEsU0FBQTs7b0JBRUEsTUFBQSxZQUFBO29CQUNBLE1BQUEsV0FBQTtvQkFDQSxNQUFBOzs7OztRQUtBLE9BQUE7WUFDQSxPQUFBLFNBQUEsU0FBQSxRQUFBOztvQkFFQSxJQUFBLFFBQUEsU0FBQSxNQUFBO29CQUNBLElBQUEsU0FBQSxDQUFBLE1BQUEsYUFBQSxNQUFBO3dCQUNBLE1BQUEsU0FBQSxRQUFBLEdBQUE7b0JBQ0EsSUFBQSxXQUFBLFlBQUEsU0FBQTt3QkFDQSxNQUFBLENBQUEsUUFBQSxTQUFBLE1BQUEsU0FBQTt3QkFDQSxJQUFBLENBQUEsUUFBQSxPQUFBLFNBQUE7O29CQUVBLElBQUEsVUFBQTt3QkFDQSxJQUFBLE1BQUEsV0FBQTs0QkFDQSxNQUFBOzhCQUNBLGVBQUE7NkNBQ0E7NkNBQ0E7NkNBQ0E7NkNBQ0E7NEJBQ0EsT0FBQSxNQUFBLFNBQUE7OzZCQUVBOzRCQUNBLE1BQUEsU0FBQTs0QkFDQSxPQUFBLGVBQUE7a0RBQ0E7a0RBQ0E7a0RBQ0E7a0RBQ0E7Ozs7Z0JBSUE7O1lBRUEsT0FBQSxTQUFBLFNBQUEsUUFBQTs7b0JBRUEsSUFBQSxRQUFBLFNBQUEsTUFBQTtvQkFDQSxJQUFBLFNBQUEsQ0FBQSxNQUFBLGFBQUEsTUFBQTt3QkFDQSxNQUFBLFNBQUEsUUFBQSxHQUFBOztvQkFFQSxJQUFBLFdBQUEsWUFBQSxTQUFBO3dCQUNBLE1BQUEsQ0FBQSxRQUFBLE9BQUEsU0FBQTt3QkFDQSxJQUFBLENBQUEsUUFBQSxTQUFBLE1BQUEsU0FBQTs7b0JBRUEsSUFBQSxVQUFBO3dCQUNBLElBQUEsTUFBQSxXQUFBOzRCQUNBLE1BQUEsU0FBQSxlQUFBOzBEQUNBOzBEQUNBOzBEQUNBOzBEQUNBOzRCQUNBLE9BQUEsTUFBQSxTQUFBOzs2QkFFQTs0QkFDQSxNQUFBLFNBQUE7NEJBQ0EsT0FBQSxlQUFBO2tEQUNBO2tEQUNBO2tEQUNBO2tEQUNBOzs7O2dCQUlBOzs7Ozs7QUN0R0EsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxRQUFBLG9CQUFBLFlBQUEsbUJBQUEsVUFBQTs7Ozs7O0FDSEEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGtCQUFBLFdBQUEsVUFBQSxXQUFBOztFQUVBLE9BQUE7R0FDQSxVQUFBO0dBQ0EsYUFBQTtHQUNBLFlBQUE7R0FDQSxjQUFBO0dBQ0EsTUFBQTtHQUNBLGtCQUFBO0lBQ0EsTUFBQTtJQUNBLFFBQUE7SUFDQSxRQUFBO0lBQ0EsTUFBQTs7R0FFQSxRQUFBO0dBQ0EsTUFBQSxVQUFBLE9BQUEsU0FBQSxPQUFBOzs7Ozs7Ozs7QUNsQkEsQ0FBQSxZQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsd0NBQUEsVUFBQSxRQUFBLGFBQUE7O0VBRUEsSUFBQSxLQUFBO0VBQ0EsR0FBQSxjQUFBO0VBQ0EsR0FBQSxnQkFBQTtFQUNBLEdBQUEsWUFBQTtFQUNBLEdBQUEsUUFBQTs7RUFFQSxTQUFBLFlBQUEsT0FBQTtHQUNBLElBQUEsR0FBQSxLQUFBLFlBQUEsTUFBQSxJQUFBO0lBQ0EsR0FBQSxLQUFBLFdBQUE7VUFDQTtJQUNBLEdBQUEsS0FBQSxXQUFBLE1BQUE7SUFDQSxHQUFBLEtBQUEsUUFBQTs7O0VBR0EsU0FBQSxjQUFBLE1BQUEsT0FBQTtHQUNBLE9BQUEsR0FBQSxLQUFBLFlBQUEsTUFBQSxLQUFBLE9BQUE7O0VBRUEsU0FBQSxZQUFBO0dBQ0EsWUFBQSxLQUFBLFVBQUEsR0FBQSxPQUFBLEtBQUEsVUFBQSxNQUFBO0lBQ0EsR0FBQSxPQUFBLEtBQUE7SUFDQSxHQUFBLGNBQUE7S0FDQSxHQUFBLFFBQUE7SUFDQSxHQUFBLEtBQUEsUUFBQTtJQUNBLE9BQUEsUUFBQSw0QkFBQTs7Ozs7OztBQzVCQSxDQUFBLFlBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsa0JBQUEsVUFBQSxZQUFBOztDQUVBLFNBQUEsVUFBQSxDQUFBLFlBQUE7O0NBRUEsU0FBQSxTQUFBLFVBQUEsY0FBQTtFQUNBLE9BQUE7R0FDQSxVQUFBO0dBQ0EsU0FBQTtHQUNBLFlBQUE7R0FDQSxhQUFBO0dBQ0EsTUFBQTs7O0VBR0EsU0FBQSxxQkFBQSxRQUFBLFNBQUEsUUFBQTs7Ozs7QUNoQkEsQ0FBQSxXQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsa0RBQUEsU0FBQSxRQUFBLFNBQUEsVUFBQTtFQUNBLE9BQUEsT0FBQTtFQUNBLE9BQUEsV0FBQTtFQUNBLE9BQUEsaUJBQUE7RUFDQSxPQUFBLGdCQUFBO0VBQ0EsT0FBQSxjQUFBO0VBQ0EsT0FBQSxhQUFBO0VBQ0EsT0FBQSxnQkFBQTtFQUNBLE9BQUEsYUFBQTtFQUNBOztFQUVBLFNBQUEsV0FBQTtHQUNBLE9BQUE7R0FDQSxPQUFBO0dBQ0EsT0FBQTtHQUNBLE9BQUE7R0FDQSxPQUFBO0dBQ0EsT0FBQSxPQUFBLHVCQUFBLFNBQUEsU0FBQSxTQUFBO0lBQ0EsSUFBQSxZQUFBLFNBQUE7S0FDQSxPQUFBOztJQUVBLE9BQUE7SUFDQSxPQUFBO0lBQ0EsT0FBQTtJQUNBLE9BQUE7O0dBRUEsT0FBQSxPQUFBLFdBQUEsU0FBQSxHQUFBLEdBQUE7SUFDQSxJQUFBLE1BQUEsR0FBQTtLQUNBOztJQUVBLE9BQUE7Ozs7RUFJQSxTQUFBLGFBQUE7R0FDQSxPQUFBLE9BQUEsQ0FBQSxPQUFBO0dBQ0E7O0VBRUEsU0FBQSxjQUFBO0dBQ0EsSUFBQSxPQUFBO0dBQ0EsUUFBQSxRQUFBLE9BQUEsTUFBQSxTQUFBLE1BQUE7SUFDQSxLQUFBLE9BQUEsUUFBQSxZQUFBLFFBQUEsV0FBQSxLQUFBLE9BQUEsUUFBQSxZQUFBO0lBQ0EsS0FBQSxXQUFBLFNBQUEsS0FBQTs7R0FFQSxJQUFBLFNBQUEsUUFBQSxXQUFBLE9BQUEsS0FBQSxDQUFBLE9BQUEsUUFBQSxZQUFBLE1BQUEsVUFBQTtHQUNBLEtBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxPQUFBLFFBQUEsS0FBQTtJQUNBLElBQUEsT0FBQSxHQUFBLE9BQUEsT0FBQSxRQUFBLEtBQUE7S0FDQSxPQUFBLElBQUE7OztHQUdBLE9BQUEsUUFBQSxPQUFBLFFBQUEsWUFBQSxLQUFBLFdBQUE7O0VBRUEsU0FBQSxXQUFBLFFBQUE7R0FDQSxJQUFBLFNBQUEsUUFBQSxXQUFBLE9BQUEsS0FBQSxDQUFBLE9BQUEsUUFBQSxZQUFBLE1BQUEsVUFBQTtHQUNBLElBQUEsT0FBQTtHQUNBLFFBQUEsUUFBQSxRQUFBLFNBQUEsTUFBQSxJQUFBO0lBQ0EsR0FBQSxLQUFBLFdBQUEsUUFBQSxRQUFBO0tBQ0EsT0FBQTs7O0dBR0EsT0FBQSxLQUFBOztFQUVBLFNBQUEsZ0JBQUE7R0FDQSxPQUFBLFVBQUEsQ0FBQSxPQUFBLFFBQUEsUUFBQSxZQUFBOzs7RUFHQSxTQUFBLGdCQUFBO0dBQ0EsT0FBQSxnQkFBQTtJQUNBLE9BQUEsT0FBQSxRQUFBLFFBQUEsWUFBQTtJQUNBLE9BQUEsT0FBQSxRQUFBLFFBQUEsWUFBQTtJQUNBLFVBQUE7SUFDQSxPQUFBO0tBQ0EsS0FBQTs7O0dBR0EsT0FBQSxtQkFBQTtJQUNBLE9BQUEsT0FBQSxRQUFBLFFBQUEsWUFBQTtJQUNBLE9BQUEsT0FBQSxRQUFBLFFBQUEsWUFBQTtJQUNBLFVBQUE7SUFDQSxPQUFBO0tBQ0EsS0FBQTs7Ozs7RUFLQSxTQUFBLFdBQUE7R0FDQSxPQUFBLFFBQUE7SUFDQSxTQUFBO0tBQ0EsT0FBQTtNQUNBLE1BQUE7O01BRUEsZ0JBQUE7TUFDQSxRQUFBO09BQ0EsS0FBQTtPQUNBLE9BQUE7T0FDQSxRQUFBO09BQ0EsTUFBQTs7TUFFQSxHQUFBLFNBQUEsR0FBQTtPQUNBLE9BQUEsRUFBQTs7TUFFQSxHQUFBLFNBQUEsR0FBQTtPQUNBLE9BQUEsRUFBQTs7TUFFQSxZQUFBO01BQ0EsV0FBQTtNQUNBLG9CQUFBO01BQ0EseUJBQUE7TUFDQSxRQUFBLENBQUEsS0FBQTtNQUNBLE9BQUE7T0FDQSxXQUFBOztNQUVBLE9BQUE7T0FDQSxXQUFBO09BQ0EsbUJBQUE7O01BRUEsUUFBQTtPQUNBLFlBQUE7T0FDQSxRQUFBO1FBQ0EsUUFBQTs7O01BR0EsT0FBQTtPQUNBLGFBQUE7Ozs7SUFJQSxNQUFBOztHQUVBLE9BQUEsT0FBQTs7O0VBR0EsU0FBQSxpQkFBQTtHQUNBLElBQUEsWUFBQTtHQUNBLFFBQUEsUUFBQSxPQUFBLFFBQUEsWUFBQSxVQUFBLFNBQUEsTUFBQSxLQUFBO0lBQ0EsSUFBQSxRQUFBO0tBQ0EsS0FBQSxLQUFBO0tBQ0EsT0FBQSxLQUFBO0tBQ0EsUUFBQTs7SUFFQSxRQUFBLFFBQUEsT0FBQSxRQUFBLEtBQUEsU0FBQSxNQUFBO0tBQ0EsTUFBQSxPQUFBLEtBQUE7TUFDQSxHQUFBLEtBQUE7TUFDQSxHQUFBLEtBQUEsS0FBQTs7O0lBR0EsVUFBQSxLQUFBOztHQUVBLE9BQUEsTUFBQSxPQUFBOzs7Ozs7QUN2SkEsQ0FBQSxZQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGtCQUFBLFVBQUEsWUFBQSxZQUFBO0VBQ0EsSUFBQSxXQUFBLFVBQUE7SUFDQSxPQUFBO01BQ0EsTUFBQTs7O0VBR0EsT0FBQTtHQUNBLFVBQUE7O0dBRUEsWUFBQTtHQUNBLE9BQUE7SUFDQSxNQUFBOztHQUVBLE1BQUEsVUFBQSxRQUFBLFNBQUEsUUFBQTtJQUNBLElBQUEsVUFBQSxRQUFBLE9BQUEsWUFBQTtJQUNBLE9BQUE7SUFDQSxPQUFBO0lBQ0EsSUFBQSxRQUFBO0tBQ0EsU0FBQTtLQUNBLFNBQUEsQ0FBQSxTQUFBO0tBQ0EsSUFBQSxHQUFBLE1BQUEsU0FBQSxNQUFBLENBQUEsR0FBQSxJQUFBLEtBQUE7S0FDQSxJQUFBLEdBQUEsTUFBQSxNQUFBLFNBQUEsS0FBQSxPQUFBLENBQUEsR0FBQSxJQUFBLE1BQUEsQ0FBQSxHQUFBOztLQUVBLFVBQUE7S0FDQSxXQUFBO0tBQ0EsY0FBQTs7SUFFQSxJQUFBLE1BQUEsR0FBQSxPQUFBLFFBQUE7OztJQUdBLElBQUEsTUFBQSxJQUFBLE9BQUE7TUFDQSxLQUFBLFNBQUEsUUFBQSxVQUFBO01BQ0EsS0FBQSxVQUFBLFNBQUEsVUFBQTtNQUNBLE9BQUE7TUFDQSxLQUFBLGFBQUEsZUFBQSxDQUFBLFNBQUEsU0FBQSxTQUFBLFdBQUE7Ozs7Ozs7O0lBUUEsSUFBQSxZQUFBLEdBQUEsT0FBQTtNQUNBLEtBQUE7TUFDQSxNQUFBLFVBQUEsR0FBQTtNQUNBLE9BQUE7OztJQUdBLElBQUEsTUFBQSxHQUFBLElBQUE7TUFDQSxXQUFBLFVBQUEsR0FBQTtNQUNBLE9BQUEsS0FBQSxJQUFBLEdBQUEsS0FBQSxJQUFBLElBQUEsS0FBQSxJQUFBLEVBQUEsRUFBQTs7TUFFQSxTQUFBLFVBQUEsR0FBQTtNQUNBLE9BQUEsS0FBQSxJQUFBLEdBQUEsS0FBQSxJQUFBLElBQUEsS0FBQSxJQUFBLEVBQUEsRUFBQSxJQUFBLEVBQUE7O01BRUEsWUFBQSxVQUFBLEdBQUE7TUFDQSxPQUFBLEtBQUEsSUFBQSxHQUFBLEVBQUEsSUFBQSxFQUFBLEVBQUEsS0FBQSxFQUFBOztNQUVBLFlBQUEsVUFBQSxHQUFBO01BQ0EsT0FBQSxLQUFBLElBQUEsR0FBQSxFQUFBLEVBQUEsSUFBQSxFQUFBOzs7SUFHQSxJQUFBLFdBQUE7S0FDQSxXQUFBO0tBQ0EsV0FBQTtLQUNBLFdBQUE7OztJQUdBLElBQUEsUUFBQSxVQUFBLE1BQUEsT0FBQTs7SUFFQSxJQUFBLE9BQUEsSUFBQSxVQUFBLFFBQUEsS0FBQTtJQUNBLEtBQUEsUUFBQSxPQUFBO01BQ0EsS0FBQSxNQUFBLFVBQUEsR0FBQSxHQUFBO01BQ0EsT0FBQSxVQUFBOztNQUVBLEtBQUEsS0FBQTtNQUNBLEtBQUEsYUFBQTtNQUNBLEtBQUEsU0FBQSxVQUFBLEdBQUE7TUFDQSxPQUFBLEVBQUEsUUFBQSxXQUFBOztNQUVBLE1BQUEsUUFBQTtNQUNBLEdBQUEsU0FBQTs7SUFFQSxJQUFBLE9BQUEsSUFBQSxVQUFBLFFBQUEsS0FBQTtJQUNBLElBQUEsWUFBQSxLQUFBLFFBQUEsT0FBQTtNQUNBLE1BQUEsZ0JBQUE7TUFDQSxLQUFBLGVBQUEsVUFBQSxHQUFBO01BQ0EsSUFBQSxFQUFBO09BQ0EsT0FBQTs7O09BR0EsT0FBQTs7TUFFQSxLQUFBLE1BQUEsVUFBQSxHQUFBO01BQ0EsT0FBQSxVQUFBLEVBQUE7O01BRUEsS0FBQSxTQUFBLFVBQUEsR0FBQTtNQUNBLE9BQUE7O01BRUEsS0FBQSxNQUFBLFVBQUEsR0FBQTtNQUNBLE9BQUEsRUFBQSxRQUFBLFNBQUE7O01BRUEsS0FBQSxhQUFBLFVBQUEsR0FBQTtNQUNBLElBQUEsWUFBQSxDQUFBLEVBQUEsUUFBQSxJQUFBLE1BQUEsS0FBQSxTQUFBO09BQ0EsY0FBQSxFQUFBLElBQUEsTUFBQSxJQUFBLENBQUE7T0FDQSxRQUFBLEVBQUEsRUFBQSxJQUFBLEVBQUEsS0FBQSxLQUFBLE1BQUEsS0FBQSxLQUFBLE1BQUEsWUFBQSxhQUFBO09BQ0EsU0FBQSxTQUFBLFlBQUEsQ0FBQSxLQUFBO09BQ0EsU0FBQSxDQUFBLEVBQUEsRUFBQSxLQUFBLGVBQUE7T0FDQSxZQUFBLFFBQUEsS0FBQSxDQUFBLE1BQUE7TUFDQSxJQUFBLEVBQUEsUUFBQSxZQUFBLEVBQUEsUUFBQSxVQUFBLFVBQUE7TUFDQSxJQUFBLEVBQUEsU0FBQSxHQUFBO09BQ0EsU0FBQSxDQUFBO09BQ0EsU0FBQTtPQUNBLFdBQUE7YUFDQSxJQUFBLEVBQUEsU0FBQSxHQUFBLFVBQUEsQ0FBQTtXQUNBLElBQUEsRUFBQSxTQUFBLEdBQUEsVUFBQSxDQUFBO1dBQ0EsSUFBQSxFQUFBLFNBQUEsR0FBQSxVQUFBO01BQ0EsT0FBQSxZQUFBLFNBQUEsZ0JBQUEsU0FBQSxhQUFBLFdBQUE7O01BRUEsR0FBQSxTQUFBOztJQUVBLFVBQUEsT0FBQTtNQUNBLEtBQUEsS0FBQTtNQUNBLEtBQUEsVUFBQSxHQUFBOztNQUVBLElBQUEsRUFBQSxTQUFBLEtBQUEsRUFBQSxRQUFBLFlBQUEsRUFBQSxRQUFBLFlBQUEsRUFBQSxRQUFBLFlBQUEsRUFBQSxRQUFBO09BQ0EsT0FBQSxFQUFBLEtBQUEsTUFBQSxLQUFBLEtBQUEsT0FBQSxFQUFBLEtBQUEsTUFBQSxLQUFBLE1BQUE7O09BRUEsT0FBQSxFQUFBLEtBQUEsTUFBQSxLQUFBOztJQUVBLFVBQUEsT0FBQTtNQUNBLEtBQUEsS0FBQTtNQUNBLEtBQUEsTUFBQTtNQUNBLEtBQUEsVUFBQSxHQUFBOztNQUVBLElBQUEsRUFBQSxTQUFBLEtBQUEsRUFBQSxRQUFBLFlBQUEsRUFBQSxRQUFBLFlBQUEsRUFBQSxRQUFBLFlBQUEsRUFBQSxRQUFBO09BQ0EsT0FBQSxDQUFBLEVBQUEsS0FBQSxNQUFBLEtBQUEsTUFBQSxNQUFBLE9BQUEsRUFBQSxLQUFBLE1BQUEsS0FBQSxNQUFBOztPQUVBLE9BQUEsQ0FBQSxFQUFBLEtBQUEsTUFBQSxLQUFBLE1BQUEsTUFBQSxPQUFBLEVBQUEsS0FBQSxNQUFBLEtBQUEsTUFBQTs7SUFFQSxVQUFBLE9BQUE7TUFDQSxLQUFBLEtBQUE7TUFDQSxLQUFBLE1BQUE7TUFDQSxLQUFBLFVBQUEsR0FBQTtNQUNBLElBQUEsRUFBQSxTQUFBLEtBQUEsRUFBQSxRQUFBLFlBQUEsRUFBQSxRQUFBLFlBQUEsRUFBQSxRQUFBLFlBQUEsRUFBQSxRQUFBO09BQ0EsT0FBQSxDQUFBLEVBQUEsS0FBQSxNQUFBLEtBQUEsTUFBQSxNQUFBLE9BQUEsRUFBQSxLQUFBLE1BQUEsS0FBQSxNQUFBOztPQUVBLE9BQUEsQ0FBQSxFQUFBLEtBQUEsTUFBQSxLQUFBLE1BQUEsTUFBQSxPQUFBLEVBQUEsS0FBQSxNQUFBLEtBQUEsTUFBQSxJQUFBOzs7SUFHQSxTQUFBLE1BQUEsR0FBQTs7S0FFQSxLQUFBO09BQ0EsU0FBQTtPQUNBLFVBQUEsS0FBQSxTQUFBOzs7O0tBSUEsS0FBQSxNQUFBLGNBQUEsVUFBQSxHQUFBO09BQ0EsT0FBQSxXQUFBLEdBQUEsS0FBQSxPQUFBLEdBQUEsT0FBQSxNQUFBLE1BQUE7O09BRUE7T0FDQSxTQUFBO09BQ0EsVUFBQSxlQUFBLFVBQUEsR0FBQTtPQUNBLE9BQUEsWUFBQTtRQUNBLElBQUEsRUFBQTtTQUNBLE9BQUE7OztTQUdBLE9BQUE7OztPQUdBLFVBQUEsYUFBQSxVQUFBLEdBQUE7T0FDQSxJQUFBLFlBQUEsQ0FBQSxFQUFBLFFBQUEsSUFBQSxNQUFBLEtBQUEsU0FBQTtPQUNBLE9BQUEsWUFBQTtRQUNBLElBQUEsWUFBQSxDQUFBLEVBQUEsUUFBQSxJQUFBLE1BQUEsS0FBQSxTQUFBO1NBQ0EsY0FBQSxFQUFBLElBQUEsTUFBQSxJQUFBLENBQUE7U0FDQSxRQUFBLEVBQUEsRUFBQSxJQUFBLEVBQUEsS0FBQSxLQUFBLE1BQUEsS0FBQSxLQUFBLE1BQUEsWUFBQSxhQUFBO1NBQ0EsU0FBQSxTQUFBLFlBQUEsQ0FBQSxLQUFBO1NBQ0EsU0FBQSxDQUFBLEVBQUEsRUFBQSxLQUFBLGVBQUE7U0FDQSxZQUFBLFFBQUEsS0FBQSxDQUFBLE1BQUE7UUFDQSxJQUFBLEVBQUEsUUFBQSxZQUFBLEVBQUEsUUFBQSxVQUFBLFVBQUE7UUFDQSxJQUFBLEVBQUEsU0FBQSxHQUFBO1NBQ0EsU0FBQSxDQUFBO1NBQ0EsU0FBQTtTQUNBLFdBQUE7ZUFDQSxJQUFBLEVBQUEsU0FBQSxHQUFBLFVBQUEsQ0FBQTthQUNBLElBQUEsRUFBQSxTQUFBLEdBQUEsVUFBQSxDQUFBO2FBQ0EsSUFBQSxFQUFBLFNBQUEsR0FBQSxVQUFBO1FBQ0EsT0FBQSxZQUFBLFNBQUEsZ0JBQUEsU0FBQSxhQUFBLFdBQUE7OztPQUdBLE1BQUEsZ0JBQUEsVUFBQSxHQUFBO09BQ0EsT0FBQSxXQUFBLEdBQUEsS0FBQSxJQUFBOztPQUVBLEtBQUEsT0FBQSxVQUFBLEdBQUE7T0FDQSxHQUFBLE9BQUEsTUFBQSxNQUFBLGNBQUEsV0FBQSxHQUFBLEtBQUEsT0FBQTs7Ozs7SUFLQSxTQUFBLFdBQUEsR0FBQSxHQUFBO0tBQ0EsSUFBQSxNQUFBLEdBQUEsT0FBQTtLQUNBLElBQUEsRUFBQSxVQUFBO01BQ0EsT0FBQSxFQUFBLFNBQUEsS0FBQSxVQUFBLEdBQUE7T0FDQSxPQUFBLFdBQUEsR0FBQTs7O0tBR0EsT0FBQTs7O0lBR0EsU0FBQSxTQUFBLEdBQUE7OztLQUdBLElBQUEsRUFBQTtNQUNBLE9BQUEsRUFBQTtVQUNBO01BQ0EsT0FBQTs7Ozs7Ozs7Ozs7O0lBWUEsU0FBQSxTQUFBLEdBQUE7S0FDQSxJQUFBLEtBQUEsS0FBQTtNQUNBLEtBQUEsR0FBQSxZQUFBLEVBQUEsVUFBQSxDQUFBLEVBQUEsR0FBQSxFQUFBLElBQUEsRUFBQSxLQUFBO01BQ0EsS0FBQSxHQUFBLFlBQUEsRUFBQSxVQUFBLENBQUEsRUFBQSxHQUFBO01BQ0EsS0FBQSxHQUFBLFlBQUEsRUFBQSxTQUFBLENBQUEsRUFBQSxJQUFBLEtBQUEsR0FBQTs7S0FFQSxPQUFBLFVBQUEsR0FBQTtNQUNBLE9BQUEsVUFBQSxHQUFBO09BQ0EsRUFBQSxPQUFBLEdBQUE7T0FDQSxFQUFBLE9BQUEsR0FBQSxJQUFBLE1BQUEsR0FBQTtPQUNBLE9BQUEsSUFBQTs7Ozs7SUFLQSxTQUFBLEtBQUEsR0FBQTtLQUNBLE9BQUEsRUFBQSxXQUFBLEtBQUEsSUFBQSxNQUFBLE1BQUEsRUFBQSxTQUFBLElBQUEsU0FBQSxFQUFBLElBQUEsRUFBQTs7Ozs7OztBQ3hQQSxDQUFBLFlBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSwyQkFBQSxVQUFBLFFBQUE7O0VBRUEsT0FBQSxXQUFBLFlBQUE7R0FDQSxPQUFBLFFBQUE7SUFDQSxTQUFBO0tBQ0EsT0FBQTtNQUNBLE1BQUE7TUFDQSxRQUFBO01BQ0EsWUFBQTtPQUNBLFlBQUE7T0FDQSxTQUFBO09BQ0EsVUFBQTtPQUNBLFFBQUE7T0FDQSxNQUFBO09BQ0EsWUFBQTtPQUNBLFVBQUE7UUFDQSxPQUFBO1FBQ0EsU0FBQTtRQUNBLFVBQUE7UUFDQSxRQUFBOzs7TUFHQSxXQUFBO09BQ0EsWUFBQTtPQUNBLFdBQUE7T0FDQSxZQUFBO09BQ0EsZ0JBQUE7T0FDQSxXQUFBO09BQ0Esa0JBQUE7T0FDQSxZQUFBO09BQ0EsV0FBQTtPQUNBLGFBQUE7T0FDQSxpQkFBQTs7T0FFQSxVQUFBO1FBQ0EsUUFBQTtRQUNBLE9BQUE7O09BRUEsVUFBQTtPQUNBLFFBQUE7T0FDQSxlQUFBO09BQ0EsTUFBQTs7OztJQUlBLE1BQUE7O0dBRUEsT0FBQSxPQUFBOztFQUVBLElBQUEsWUFBQSxVQUFBLE1BQUE7R0FDQSxJQUFBLFdBQUE7R0FDQSxRQUFBLFFBQUEsTUFBQSxVQUFBLE1BQUE7SUFDQSxJQUFBLFFBQUE7S0FDQSxRQUFBLEtBQUE7S0FDQSxRQUFBLEtBQUE7S0FDQSxTQUFBLEtBQUE7S0FDQSxZQUFBLFVBQUEsS0FBQTs7SUFFQSxHQUFBLEtBQUEsTUFBQTtLQUNBLE1BQUEsUUFBQSxLQUFBOztJQUVBLEdBQUEsS0FBQSxLQUFBO0tBQ0EsTUFBQSxPQUFBLEtBQUE7O0lBRUEsU0FBQSxLQUFBOztHQUVBLE9BQUE7O0VBRUEsT0FBQSxpQkFBQSxZQUFBO0dBQ0EsSUFBQSxZQUFBO0lBQ0EsUUFBQSxPQUFBLEtBQUE7SUFDQSxTQUFBLE9BQUEsS0FBQSxNQUFBLGNBQUE7SUFDQSxZQUFBLFVBQUEsT0FBQSxLQUFBO0lBQ0EsUUFBQTs7R0FFQSxPQUFBLE1BQUEsT0FBQTtHQUNBLE9BQUE7O0VBRUEsT0FBQSxPQUFBLFFBQUEsVUFBQSxHQUFBLEdBQUE7R0FDQSxJQUFBLENBQUEsR0FBQTtJQUNBOztHQUVBLE9BQUE7Ozs7OztBQ3JGQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsa0JBQUEsV0FBQSxZQUFBLFdBQUE7O0VBRUEsT0FBQTtHQUNBLFVBQUE7R0FDQSxhQUFBO0dBQ0EsWUFBQTtHQUNBLGNBQUE7R0FDQSxNQUFBO0dBQ0Esa0JBQUE7SUFDQSxRQUFBO0lBQ0EsS0FBQTtJQUNBLFdBQUE7O0dBRUEsUUFBQTtHQUNBLE1BQUEsVUFBQSxPQUFBLFNBQUEsT0FBQTs7Ozs7Ozs7O0FDakJBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsUUFBQSxvQkFBQSxZQUFBLGdCQUFBLFVBQUE7RUFDQSxRQUFBLElBQUE7Ozs7QUNKQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsa0JBQUEsV0FBQSxnQ0FBQSxTQUFBLGlCQUFBO0VBQ0EsSUFBQSxVQUFBO0dBQ0EsV0FBQTtHQUNBLE1BQUE7R0FDQSxNQUFBOztFQUVBLE9BQUE7R0FDQSxVQUFBO0dBQ0EsYUFBQTtHQUNBLFlBQUE7R0FDQSxjQUFBO0dBQ0EsTUFBQTtHQUNBLGtCQUFBO0lBQ0EsT0FBQTtJQUNBLE1BQUE7SUFDQSxXQUFBO0lBQ0EsUUFBQTtJQUNBLE9BQUE7O0dBRUEsUUFBQTtHQUNBLFNBQUEsU0FBQSxTQUFBO1lBQ0EsT0FBQSxnQkFBQSxRQUFBLFNBQUEsU0FBQSxPQUFBLFVBQUEsUUFBQSxZQUFBLGFBQUE7UUFDQSxRQUFBLE9BQUEsU0FBQSxNQUFBLEdBQUE7Ozs7Ozs7Ozs7Ozs7QUN6QkEsQ0FBQSxXQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsNEJBQUEsU0FBQSxTQUFBOztFQUVBLElBQUEsS0FBQTtFQUNBLEdBQUEsZUFBQTs7RUFFQSxHQUFBLGtCQUFBO0VBQ0EsR0FBQSxhQUFBO0VBQ0EsR0FBQSxpQkFBQTtFQUNBLEdBQUEsa0JBQUE7RUFDQSxHQUFBLGNBQUE7O0VBRUE7O0VBRUEsU0FBQSxVQUFBO0dBQ0EsUUFBQSxJQUFBLEdBQUE7R0FDQSxHQUFBLE9BQUEsR0FBQSxhQUFBLFlBQUE7SUFDQSxHQUFBLFlBQUE7Ozs7RUFJQSxTQUFBLFdBQUEsT0FBQSxPQUFBLFVBQUEsTUFBQTtHQUNBLE9BQUE7OztFQUdBLFNBQUEsZUFBQSxPQUFBLE9BQUEsTUFBQSxVQUFBO0dBQ0EsUUFBQSxRQUFBLEdBQUEsT0FBQSxTQUFBLE9BQUEsSUFBQTtJQUNBLEdBQUEsTUFBQSxNQUFBLEVBQUE7S0FDQSxHQUFBLE1BQUEsT0FBQSxLQUFBOzs7R0FHQSxPQUFBOzs7RUFHQSxTQUFBLGdCQUFBLE9BQUEsTUFBQSxLQUFBO0dBQ0EsR0FBQSxHQUFBLFFBQUEsVUFBQTtJQUNBLE9BQUEsR0FBQSxNQUFBLE9BQUEsT0FBQTs7O0VBR0EsU0FBQSxnQkFBQSxLQUFBO0dBQ0EsSUFBQSxJQUFBLEdBQUEsVUFBQSxRQUFBO0dBQ0EsR0FBQSxJQUFBLENBQUEsRUFBQTtJQUNBLEdBQUEsVUFBQSxPQUFBLEdBQUE7O09BRUE7SUFDQSxHQUFBLFVBQUEsS0FBQTs7O0VBR0EsU0FBQSxZQUFBLE1BQUE7O0dBRUEsS0FBQSxXQUFBO0dBQ0EsS0FBQSxXQUFBOzs7RUFHQSxTQUFBLGFBQUEsTUFBQTtHQUNBLEdBQUEsR0FBQSxVQUFBLFFBQUEsUUFBQSxDQUFBLEVBQUE7SUFDQSxPQUFBOztHQUVBLE9BQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDNURBLENBQUEsV0FBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxrQkFBQSxVQUFBLFVBQUEsV0FBQTs7RUFFQSxPQUFBO0dBQ0EsVUFBQTtHQUNBLGFBQUE7R0FDQSxZQUFBO0dBQ0EsY0FBQTtHQUNBLE9BQUE7R0FDQSxrQkFBQTtJQUNBLE9BQUE7SUFDQSxNQUFBO0lBQ0EsU0FBQTs7R0FFQSxTQUFBO0dBQ0EsTUFBQSxTQUFBLE9BQUEsU0FBQSxPQUFBOzs7Ozs7OztBQ2pCQSxDQUFBLFdBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSx5QkFBQSxTQUFBLFFBQUE7O0VBRUEsSUFBQSxLQUFBO0VBQ0EsR0FBQSxjQUFBO0VBQ0EsR0FBQSxjQUFBOztFQUVBOztFQUVBLFNBQUEsV0FBQTtHQUNBOzs7RUFHQSxTQUFBLFlBQUE7O0dBRUEsSUFBQSxPQUFBLEdBQUEsS0FBQSxVQUFBLGVBQUEsQ0FBQSxHQUFBLEtBQUEsUUFBQTtJQUNBLFFBQUEsUUFBQSxHQUFBLE9BQUEsU0FBQSxPQUFBO0tBQ0EsTUFBQSxTQUFBLE1BQUEsR0FBQSxNQUFBOzs7OztFQUtBLFNBQUEsYUFBQTtHQUNBLElBQUEsUUFBQSxHQUFBLEtBQUE7R0FDQSxJQUFBLE9BQUEsQ0FBQSxNQUFBLFVBQUEsR0FBQSxNQUFBLFNBQUE7R0FDQSxRQUFBLFFBQUEsR0FBQSxPQUFBLFNBQUEsT0FBQTtJQUNBLElBQUEsVUFBQSxHQUFBLE1BQUE7S0FDQSxNQUFBLFNBQUE7OztHQUdBLE9BQUE7OztFQUdBLFNBQUEsY0FBQTtHQUNBLEdBQUEsR0FBQSxLQUFBLFVBQUEsSUFBQSxPQUFBO0dBQ0EsSUFBQSxHQUFBLEtBQUEsU0FBQSxLQUFBLEdBQUE7SUFDQSxHQUFBLEtBQUEsU0FBQSxJQUFBLEtBQUEsTUFBQSxHQUFBLEtBQUEsU0FBQTtVQUNBO0lBQ0EsR0FBQSxLQUFBLFVBQUE7O0dBRUE7OztFQUdBLFNBQUEsY0FBQTtHQUNBLEdBQUEsR0FBQSxLQUFBLFVBQUEsR0FBQSxPQUFBO0dBQ0EsSUFBQSxHQUFBLEtBQUEsU0FBQSxLQUFBLEdBQUE7SUFDQSxHQUFBLEtBQUEsU0FBQSxJQUFBLEtBQUEsTUFBQSxHQUFBLEtBQUEsU0FBQSxLQUFBO1VBQ0E7SUFDQSxHQUFBLEtBQUEsVUFBQTs7R0FFQTs7Ozs7OztBQU9BIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHR2YXIgYXBwID0gYW5ndWxhci5tb2R1bGUoJ2FwcCcsXG5cdFx0W1xuXHRcdCdhcHAuY29udHJvbGxlcnMnLFxuXHRcdCdhcHAuZmlsdGVycycsXG5cdFx0J2FwcC5zZXJ2aWNlcycsXG5cdFx0J2FwcC5kaXJlY3RpdmVzJyxcblx0XHQnYXBwLnJvdXRlcycsXG5cdFx0J2FwcC5jb25maWcnXG5cdFx0XSk7XG5cblxuXHRcdGFuZ3VsYXIubW9kdWxlKCdhcHAucm91dGVzJywgWyd1aS5yb3V0ZXInLCAnbmdTdG9yYWdlJywgJ3NhdGVsbGl6ZXInXSk7XG5cdFx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycsIFsnZG5kTGlzdHMnLCdhbmd1bGFyLmZpbHRlcicsJ2FuZ3VsYXJNb21lbnQnLCduZ1Njcm9sbGJhcicsJ21kQ29sb3JQaWNrZXInLCduZ0FuaW1hdGUnLCd1aS50cmVlJywndG9hc3RyJywndWkucm91dGVyJywgJ21kLmRhdGEudGFibGUnLCAnbmdNYXRlcmlhbCcsICduZ1N0b3JhZ2UnLCAncmVzdGFuZ3VsYXInLCAnbmdNZEljb25zJywgJ2FuZ3VsYXItbG9hZGluZy1iYXInLCAnbmdNZXNzYWdlcycsICduZ1Nhbml0aXplJywgXCJsZWFmbGV0LWRpcmVjdGl2ZVwiLCdudmQzJ10pO1xuXHRcdGFuZ3VsYXIubW9kdWxlKCdhcHAuZmlsdGVycycsIFtdKTtcblx0XHRhbmd1bGFyLm1vZHVsZSgnYXBwLnNlcnZpY2VzJywgWydhbmd1bGFyLWNhY2hlJywndWkucm91dGVyJywgJ25nU3RvcmFnZScsICdyZXN0YW5ndWxhcicsICd0b2FzdHInXSk7XG5cdFx0YW5ndWxhci5tb2R1bGUoJ2FwcC5kaXJlY3RpdmVzJywgWyduZ01hdGVyaWFsJywnbmdQYXBhUGFyc2UnXSk7XG5cdFx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb25maWcnLCBbXSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAucm91dGVzJykuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIsICRsb2NhdGlvblByb3ZpZGVyKSB7XG5cdFx0Ly9cdCRsb2NhdGlvblByb3ZpZGVyLmh0bWw1TW9kZSh0cnVlKTtcblx0XHR2YXIgZ2V0VmlldyA9IGZ1bmN0aW9uKHZpZXdOYW1lKSB7XG5cdFx0XHRyZXR1cm4gJy92aWV3cy9hcHAvJyArIHZpZXdOYW1lICsgJy8nICsgdmlld05hbWUgKyAnLmh0bWwnO1xuXHRcdH07XG5cblx0XHQkdXJsUm91dGVyUHJvdmlkZXIub3RoZXJ3aXNlKCcvY29uZmxpY3QvaW5kZXgnKTtcblxuXHRcdCRzdGF0ZVByb3ZpZGVyXG5cdFx0XHQuc3RhdGUoJ2FwcCcsIHtcblx0XHRcdFx0YWJzdHJhY3Q6IHRydWUsXG5cdFx0XHRcdHZpZXdzOiB7XG5cdFx0XHRcdFx0aGVhZGVyOiB7XG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogZ2V0VmlldygnaGVhZGVyJyksXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiAnSGVhZGVyQ3RybCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyQXM6ICd2bSdcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdG1haW46IHt9LFxuXHRcdFx0XHRcdCdtYXBAJzoge1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6IGdldFZpZXcoJ21hcCcpLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlcjogJ01hcEN0cmwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlckFzOiAndm0nXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdFx0LnN0YXRlKCdhcHAuaG9tZScsIHtcblx0XHRcdFx0dXJsOiAnLycsXG5cdFx0XHRcdHZpZXdzOiB7XG5cdFx0XHRcdFx0J3NpZGViYXJAJzoge1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6IGdldFZpZXcoJ2hvbWUnKSxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdIb21lQ3RybCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyQXM6ICd2bSdcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cdFx0XHQuc3RhdGUoJ2FwcC51c2VyJywge1xuXHRcdFx0XHR1cmw6ICcvdXNlcicsXG5cdFx0XHRcdGFic3RyYWN0OiB0cnVlXG5cblx0XHRcdH0pXG5cdFx0XHQuc3RhdGUoJ2FwcC51c2VyLmxvZ2luJywge1xuXHRcdFx0XHR1cmw6ICcvbG9naW4nLFxuXHRcdFx0XHR2aWV3czoge1xuXHRcdFx0XHRcdCdtYWluQCc6IHtcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdsb2dpbicpLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlcjogJ0xvZ2luQ3RybCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyQXM6ICd2bSdcblxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHR9KVxuXHRcdFx0LnN0YXRlKCdhcHAudXNlci5wcm9maWxlJywge1xuXHRcdFx0XHR1cmw6ICcvbXktcHJvZmlsZScsXG5cdFx0XHRcdGF1dGg6IHRydWUsXG5cdFx0XHRcdHZpZXdzOiB7XG5cdFx0XHRcdFx0J21haW5AJzoge1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6IGdldFZpZXcoJ3VzZXInKSxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdVc2VyQ3RybCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyQXM6ICd2bScsXG5cdFx0XHRcdFx0XHRyZXNvbHZlOiB7XG5cdFx0XHRcdFx0XHRcdHByb2ZpbGU6IGZ1bmN0aW9uKERhdGFTZXJ2aWNlLCAkYXV0aCkge1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBEYXRhU2VydmljZS5nZXRPbmUoJ21lJykuJG9iamVjdDtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHR9KVxuXHRcdFx0LnN0YXRlKCdhcHAuaW5kZXgnLCB7XG5cdFx0XHRcdGFic3RyYWN0OiB0cnVlLFxuXHRcdFx0XHR1cmw6ICcvaW5kZXgnLFxuXHRcdFx0XHRyZXNvbHZlOiB7XG5cdFx0XHRcdFx0Y291bnRyaWVzOiBmdW5jdGlvbihDb3VudHJpZXNTZXJ2aWNlKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gQ291bnRyaWVzU2VydmljZS5nZXREYXRhKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXG5cdFx0XHQuc3RhdGUoJ2FwcC5pbmRleC5teWRhdGEnLCB7XG5cdFx0XHRcdHVybDogJy9teS1kYXRhJyxcblx0XHRcdFx0YXV0aDogdHJ1ZSxcblx0XHRcdFx0dmlld3M6IHtcblx0XHRcdFx0XHQnc2lkZWJhckAnOiB7XG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogJy92aWV3cy9hcHAvaW5kZXhNeURhdGEvaW5kZXhNeURhdGFNZW51Lmh0bWwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlcjogJ0luZGV4TXlEYXRhTWVudUN0cmwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlckFzOiAndm0nXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHQnbWFpbkAnOiB7XG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogZ2V0VmlldygnaW5kZXhNeURhdGEnKSxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdJbmRleE15RGF0YUN0cmwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlckFzOiAndm0nXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdFx0LnN0YXRlKCdhcHAuaW5kZXgubXlkYXRhLmVudHJ5Jywge1xuXHRcdFx0XHR1cmw6ICcvOm5hbWUnLFxuXHRcdFx0XHRhdXRoOiB0cnVlLFxuXHRcdFx0XHR2aWV3czoge1xuXHRcdFx0XHRcdCdzaWRlYmFyQCc6IHtcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiAnL3ZpZXdzL2FwcC9pbmRleE15RGF0YS9pbmRleE15RGF0YU1lbnUuaHRtbCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiAnSW5kZXhNeURhdGFNZW51Q3RybCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyQXM6ICd2bSdcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdCdtYWluQCc6IHtcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiAnL3ZpZXdzL2FwcC9pbmRleE15RGF0YS9pbmRleE15RGF0YUVudHJ5Lmh0bWwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlcjogJ0luZGV4TXlEYXRhRW50cnlDdHJsJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLmluZGV4LmVkaXRvcicsIHtcblx0XHRcdFx0dXJsOiAnL2VkaXRvcicsXG5cdFx0XHRcdGF1dGg6IHRydWUsXG5cdFx0XHRcdHJlc29sdmU6e1xuXHRcdFx0XHRcdGluZGljZXM6IGZ1bmN0aW9uKENvbnRlbnRTZXJ2aWNlKXtcblx0XHRcdFx0XHRcdHJldHVybiBDb250ZW50U2VydmljZS5nZXRJbmRpY2VzKCk7XG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRpbmRpY2F0b3JzOiBmdW5jdGlvbihDb250ZW50U2VydmljZSkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIENvbnRlbnRTZXJ2aWNlLmZldGNoSW5kaWNhdG9ycyh7XG5cdFx0XHRcdFx0XHRcdHBhZ2U6IDEsXG5cdFx0XHRcdFx0XHRcdG9yZGVyOiAndGl0bGUnLFxuXHRcdFx0XHRcdFx0XHRsaW1pdDogMTAwMCxcblx0XHRcdFx0XHRcdFx0ZGlyOiAnQVNDJ1xuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRzdHlsZXM6IGZ1bmN0aW9uKENvbnRlbnRTZXJ2aWNlKXtcblx0XHRcdFx0XHRcdHJldHVybiBDb250ZW50U2VydmljZS5nZXRTdHlsZXMoKTtcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdGNhdGVnb3JpZXM6IGZ1bmN0aW9uKENvbnRlbnRTZXJ2aWNlKXtcblx0XHRcdFx0XHRcdHJldHVybiBDb250ZW50U2VydmljZS5nZXRDYXRlZ29yaWVzKHtpbmRpY2F0b3JzOnRydWUsIHRyZWU6dHJ1ZX0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSxcblx0XHRcdFx0dmlld3M6IHtcblx0XHRcdFx0XHQnc2lkZWJhckAnOiB7XG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogZ2V0VmlldygnaW5kZXhlZGl0b3InKSxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdJbmRleGVkaXRvckN0cmwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlckFzOiAndm0nLFxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLmluZGV4LmVkaXRvci5pbmRpY2F0b3JzJywge1xuXHRcdFx0XHR1cmw6ICcvaW5kaWNhdG9ycycsXG5cdFx0XHRcdGF1dGg6IHRydWUsXG5cdFx0XHR9KVxuXHRcdFx0LnN0YXRlKCdhcHAuaW5kZXguZWRpdG9yLmluZGljYXRvcnMuaW5kaWNhdG9yJywge1xuXHRcdFx0XHR1cmw6ICcvOmlkJyxcblx0XHRcdFx0YXV0aDogdHJ1ZSxcblx0XHRcdFx0bGF5b3V0OiAncm93Jyxcblx0XHRcdFx0dmlld3M6IHtcblx0XHRcdFx0XHQnbWFpbkAnOiB7XG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogJy92aWV3cy9hcHAvaW5kZXhlZGl0b3IvaW5kZXhlZGl0b3JpbmRpY2F0b3IuaHRtbCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiAnSW5kZXhlZGl0b3JpbmRpY2F0b3JDdHJsJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJyxcblx0XHRcdFx0XHRcdHJlc29sdmU6IHtcblx0XHRcdFx0XHRcdFx0aW5kaWNhdG9yOiBmdW5jdGlvbihDb250ZW50U2VydmljZSwgJHN0YXRlUGFyYW1zKSB7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIENvbnRlbnRTZXJ2aWNlLmdldEluZGljYXRvcigkc3RhdGVQYXJhbXMuaWQpXG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0Lyp2aWV3czp7XG5cdFx0XHRcdFx0J2luZm8nOntcblxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0J21lbnUnOntcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOmdldFZpZXcoJ2luZGV4ZWRpdG9yJyksXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiAnSW5kZXhlZGl0b3JDdHJsJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSovXG5cdFx0XHR9KVxuXHRcdFx0LnN0YXRlKCdhcHAuaW5kZXguZWRpdG9yLmluZGl6ZXMnLCB7XG5cdFx0XHRcdHVybDogJy9pbmRpemVzJyxcblx0XHRcdFx0YXV0aDogdHJ1ZSxcblxuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLmluZGV4LmVkaXRvci5pbmRpemVzLmRhdGEnLCB7XG5cdFx0XHRcdHVybDogJy86aWQvOm5hbWUnLFxuXHRcdFx0XHRhdXRoOiB0cnVlLFxuXHRcdFx0XHRsYXlvdXQ6ICdyb3cnLFxuXHRcdFx0XHRyZXNvbHZlOiB7XG5cdFx0XHRcdFx0aW5kZXg6IGZ1bmN0aW9uKENvbnRlbnRTZXJ2aWNlLCAkc3RhdGVQYXJhbXMpIHtcblx0XHRcdFx0XHRcdGlmICgkc3RhdGVQYXJhbXMuaWQgPT0gMCkgcmV0dXJuIHt9O1xuXHRcdFx0XHRcdFx0cmV0dXJuIENvbnRlbnRTZXJ2aWNlLmdldEl0ZW0oJHN0YXRlUGFyYW1zLmlkKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sXG5cdFx0XHRcdHZpZXdzOiB7XG5cdFx0XHRcdFx0J21haW5AJzoge1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICcvdmlld3MvYXBwL2luZGV4ZWRpdG9yL2luZGV4ZWRpdG9yaW5kaXplcy5odG1sJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdJbmRleGVkaXRvcmluZGl6ZXNDdHJsJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLmluZGV4LmVkaXRvci5pbmRpemVzLmRhdGEuYWRkJywge1xuXHRcdFx0XHR1cmw6ICcvYWRkJyxcblx0XHRcdFx0bGF5b3V0OiAncm93Jyxcblx0XHRcdFx0dmlld3M6IHtcblx0XHRcdFx0XHQnYWRkaXRpb25hbEAnOiB7XG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogJy92aWV3cy9hcHAvaW5kZXhlZGl0b3IvaW5kaWNhdG9ycy5odG1sJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdJbmRleGluaWRjYXRvcnNDdHJsJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJyxcblx0XHRcdFx0XHRcdHJlc29sdmU6IHtcblx0XHRcdFx0XHRcdFx0aW5kaWNhdG9yczogZnVuY3Rpb24oQ29udGVudFNlcnZpY2UsICRzdGF0ZVBhcmFtcykge1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBDb250ZW50U2VydmljZS5mZXRjaEluZGljYXRvcnMoe1xuXHRcdFx0XHRcdFx0XHRcdFx0cGFnZTogMSxcblx0XHRcdFx0XHRcdFx0XHRcdG9yZGVyOiAndGl0bGUnLFxuXHRcdFx0XHRcdFx0XHRcdFx0bGltaXQ6IDEwMDAsXG5cdFx0XHRcdFx0XHRcdFx0XHRkaXI6ICdBU0MnXG5cdFx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cdFx0XHQuc3RhdGUoJ2FwcC5pbmRleC5lZGl0b3IuaW5kaWNhdG9ycy5pbmRpY2F0b3IuZGV0YWlscycsIHtcblx0XHRcdFx0dXJsOiAnLzplbnRyeScsXG5cdFx0XHRcdGF1dGg6IHRydWUsXG5cdFx0XHRcdGxheW91dDogJ3Jvdydcblx0XHRcdH0pXG5cdFx0XHQuc3RhdGUoJ2FwcC5pbmRleC5lZGl0b3IuY2F0ZWdvcmllcycsIHtcblx0XHRcdFx0dXJsOiAnL2NhdGVnb3JpZXMnLFxuXHRcdFx0XHRhdXRoOiB0cnVlLFxuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLmluZGV4LmVkaXRvci5jYXRlZ29yaWVzLmNhdGVnb3J5Jywge1xuXHRcdFx0XHR1cmw6ICcvOmlkJyxcblx0XHRcdFx0YXV0aDogdHJ1ZSxcblx0XHRcdFx0bGF5b3V0OiAncm93Jyxcblx0XHRcdFx0dmlld3M6IHtcblx0XHRcdFx0XHQnbWFpbkAnOiB7XG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogJy92aWV3cy9hcHAvaW5kZXhlZGl0b3IvaW5kZXhlZGl0b3JjYXRlZ29yeS5odG1sJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdJbmRleGVkaXRvcmNhdGVnb3J5Q3RybCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyQXM6ICd2bScsXG5cdFx0XHRcdFx0XHRyZXNvbHZlOiB7XG5cdFx0XHRcdFx0XHRcdGNhdGVnb3J5OiBmdW5jdGlvbihDb250ZW50U2VydmljZSwgJHN0YXRlUGFyYW1zKSB7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIENvbnRlbnRTZXJ2aWNlLmdldENhdGVnb3J5KCRzdGF0ZVBhcmFtcy5pZCk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cdFx0XHQuc3RhdGUoJ2FwcC5pbmRleC5jcmVhdGUnLCB7XG5cdFx0XHRcdHVybDogJy9jcmVhdGUnLFxuXHRcdFx0XHRhdXRoOiB0cnVlLFxuXHRcdFx0XHR2aWV3czoge1xuXHRcdFx0XHRcdCdzaWRlYmFyQCc6IHtcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdpbmRleGNyZWF0b3InKSxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdJbmRleGNyZWF0b3JDdHJsJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLmluZGV4LmNyZWF0ZS5iYXNpYycsIHtcblx0XHRcdFx0dXJsOiAnL2Jhc2ljJyxcblx0XHRcdFx0YXV0aDogdHJ1ZVxuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLmluZGV4LmNoZWNrJywge1xuXHRcdFx0XHR1cmw6ICcvY2hlY2tpbmcnLFxuXHRcdFx0XHRhdXRoOiB0cnVlLFxuXHRcdFx0XHR2aWV3czoge1xuXHRcdFx0XHRcdCdtYWluQCc6IHtcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdpbmRleENoZWNrJyksXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiAnSW5kZXhDaGVja0N0cmwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlckFzOiAndm0nXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHQnc2lkZWJhckAnOiB7XG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogJy92aWV3cy9hcHAvaW5kZXhDaGVjay9pbmRleENoZWNrU2lkZWJhci5odG1sJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdJbmRleENoZWNrU2lkZWJhckN0cmwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlckFzOiAndm0nXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdFx0LnN0YXRlKCdhcHAuaW5kZXgubWV0YScsIHtcblx0XHRcdFx0dXJsOiAnL2FkZGluZy1tZXRhLWRhdGEnLFxuXHRcdFx0XHRhdXRoOiB0cnVlLFxuXHRcdFx0XHRsYXlvdXQ6ICdyb3cnLFxuXHRcdFx0XHR2aWV3czoge1xuXHRcdFx0XHRcdCdtYWluQCc6IHtcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdpbmRleE1ldGEnKSxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdJbmRleE1ldGFDdHJsJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0J3NpZGViYXJAJzoge1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICcvdmlld3MvYXBwL2luZGV4TWV0YS9pbmRleE1ldGFNZW51Lmh0bWwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlcjogJ0luZGV4TWV0YU1lbnVDdHJsJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLmluZGV4LmZpbmFsJywge1xuXHRcdFx0XHR1cmw6ICcvZmluYWwnLFxuXHRcdFx0XHRhdXRoOiB0cnVlLFxuXHRcdFx0XHRsYXlvdXQ6ICdyb3cnLFxuXHRcdFx0XHR2aWV3czoge1xuXHRcdFx0XHRcdCdtYWluQCc6IHtcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdpbmRleEZpbmFsJyksXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiAnSW5kZXhGaW5hbEN0cmwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlckFzOiAndm0nXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHQnc2lkZWJhckAnOiB7XG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogJy92aWV3cy9hcHAvaW5kZXhGaW5hbC9pbmRleEZpbmFsTWVudS5odG1sJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdJbmRleEZpbmFsTWVudUN0cmwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlckFzOiAndm0nXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdFx0LnN0YXRlKCdhcHAuaW5kZXgubGlzdCcsIHtcblx0XHRcdFx0dXJsOiAnL2xpc3QnLFxuXHRcdFx0XHR2aWV3czoge1xuXHRcdFx0XHRcdCdzaWRlYmFyQCc6IHtcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdmdWxsTGlzdCcpLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlcjogJ0Z1bGxMaXN0Q3RybCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyQXM6ICd2bScsXG5cdFx0XHRcdFx0XHRyZXNvbHZlOiB7XG5cdFx0XHRcdFx0XHRcdGluZGljYXRvcnM6IGZ1bmN0aW9uKENvbnRlbnRTZXJ2aWNlKSB7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIENvbnRlbnRTZXJ2aWNlLmZldGNoSW5kaWNhdG9ycyh7XG5cdFx0XHRcdFx0XHRcdFx0XHRwYWdlOiAxLFxuXHRcdFx0XHRcdFx0XHRcdFx0b3JkZXI6ICd0aXRsZScsXG5cdFx0XHRcdFx0XHRcdFx0XHRsaW1pdDogMTAwMCxcblx0XHRcdFx0XHRcdFx0XHRcdGRpcjogJ0FTQydcblx0XHRcdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHRpbmRpY2VzOiBmdW5jdGlvbihEYXRhU2VydmljZSkge1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBEYXRhU2VydmljZS5nZXRBbGwoJ2luZGV4JykuJG9iamVjdDtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLmluZGV4LmluZGljYXRvcicsIHtcblx0XHRcdFx0dXJsOiAnL2luZGljYXRvci86aWQvOm5hbWUnLFxuXHRcdFx0XHRyZXNvbHZlOiB7XG5cdFx0XHRcdFx0aW5kaWNhdG9yOiBmdW5jdGlvbihDb250ZW50U2VydmljZSwgJHN0YXRlUGFyYW1zKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gQ29udGVudFNlcnZpY2UuZmV0Y2hJbmRpY2F0b3IoJHN0YXRlUGFyYW1zLmlkKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sXG5cdFx0XHRcdHZpZXdzOiB7XG5cdFx0XHRcdFx0J3NpZGViYXJAJzoge1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6IGdldFZpZXcoJ2luZGljYXRvcicpLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlcjogJ0luZGljYXRvclNob3dDdHJsJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJyxcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cdFx0XHQuc3RhdGUoJ2FwcC5pbmRleC5pbmRpY2F0b3IueWVhcicsIHtcblx0XHRcdFx0dXJsOiAnLzp5ZWFyJyxcblx0XHRcdH0pXG5cdFx0XHQuc3RhdGUoJ2FwcC5pbmRleC5pbmRpY2F0b3IueWVhci5pbmZvJywge1xuXHRcdFx0XHR1cmw6Jy9kZXRhaWxzJyxcblx0XHRcdFx0bGF5b3V0Oidyb3cnLFxuXHRcdFx0XHRyZXNvbHZlOiB7XG5cdFx0XHRcdFx0ZGF0YTogZnVuY3Rpb24oQ29udGVudFNlcnZpY2UsICRzdGF0ZVBhcmFtcykge1xuXHRcdFx0XHRcdFx0cmV0dXJuIENvbnRlbnRTZXJ2aWNlLmdldEluZGljYXRvckRhdGEoJHN0YXRlUGFyYW1zLmlkLCAkc3RhdGVQYXJhbXMueWVhcik7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9LFxuXHRcdFx0XHR2aWV3czp7XG5cdFx0XHRcdFx0J21haW5AJzp7XG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogJy92aWV3cy9hcHAvaW5kaWNhdG9yL2luZGljYXRvclllYXJUYWJsZS5odG1sJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6J0luZGljYXRvclllYXJUYWJsZUN0cmwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlckFzOid2bScsXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdFx0LnN0YXRlKCdhcHAuaW5kZXguc2hvdycsIHtcblx0XHRcdFx0dXJsOiAnLzppbmRleCcsXG5cdFx0XHRcdHZpZXdzOiB7XG5cdFx0XHRcdFx0J3NpZGViYXJAJzoge1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICcvdmlld3MvYXBwL2luZGV4L2luZm8uaHRtbCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiAnSW5kZXhDdHJsJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJyxcblx0XHRcdFx0XHRcdHJlc29sdmU6IHtcblx0XHRcdFx0XHRcdFx0ZGF0YTogZnVuY3Rpb24oSW5kaXplc1NlcnZpY2UsICRzdGF0ZVBhcmFtcykge1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBJbmRpemVzU2VydmljZS5mZXRjaERhdGEoJHN0YXRlUGFyYW1zLmluZGV4KTtcblx0XHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdFx0Y291bnRyaWVzOiBmdW5jdGlvbihDb3VudHJpZXNTZXJ2aWNlKSB7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIENvdW50cmllc1NlcnZpY2UuZ2V0RGF0YSgpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHQnc2VsZWN0ZWQnOiB7XG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogJy92aWV3cy9hcHAvaW5kZXgvc2VsZWN0ZWQuaHRtbCcsXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdFx0LnN0YXRlKCdhcHAuaW5kZXguc2hvdy5pbmZvJywge1xuXHRcdFx0XHR1cmw6ICcvaW5mbycsXG5cdFx0XHRcdHZpZXdzOiB7XG5cdFx0XHRcdFx0J21haW5AJzoge1xuXHRcdFx0XHRcdFx0Y29udHJvbGxlcjogJ0luZGV4aW5mb0N0cmwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlckFzOiAndm0nLFxuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6IGdldFZpZXcoJ2luZGV4aW5mbycpXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdFx0LnN0YXRlKCdhcHAuaW5kZXguc2hvdy5zZWxlY3RlZCcsIHtcblx0XHRcdFx0dXJsOiAnLzppdGVtJyxcblx0XHRcdFx0Lyp2aWV3czp7XG5cdFx0XHRcdFx0J3NlbGVjdGVkJzp7XG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogZ2V0Vmlldygnc2VsZWN0ZWQnKSxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdTZWxlY3RlZEN0cmwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlckFzOiAndm0nLFxuXHRcdFx0XHRcdFx0cmVzb2x2ZTp7XG5cdFx0XHRcdFx0XHRcdGdldENvdW50cnk6IGZ1bmN0aW9uKERhdGFTZXJ2aWNlLCAkc3RhdGVQYXJhbXMpe1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBEYXRhU2VydmljZS5nZXRPbmUoJ25hdGlvbnMnLCAkc3RhdGVQYXJhbXMuaXRlbSkuJG9iamVjdDtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSovXG5cdFx0XHR9KVxuXHRcdFx0LnN0YXRlKCdhcHAuaW5kZXguc2hvdy5zZWxlY3RlZC5jb21wYXJlJywge1xuXHRcdFx0XHR1cmw6ICcvY29tcGFyZS86Y291bnRyaWVzJ1xuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLmNvbmZsaWN0Jywge1xuXHRcdFx0XHRhYnN0cmFjdDogdHJ1ZSxcblx0XHRcdFx0dXJsOiAnL2NvbmZsaWN0Jyxcblx0XHRcdH0pXG5cdFx0XHQuc3RhdGUoJ2FwcC5jb25mbGljdC5pbmRleCcse1xuXHRcdFx0XHR1cmw6ICcvaW5kZXgnLFxuXHRcdFx0XHRyZXNvbHZlOntcblx0XHRcdFx0XHRjb25mbGljdHM6ZnVuY3Rpb24oUmVzdGFuZ3VsYXIpe1xuXHRcdFx0XHRcdFx0cmV0dXJuIFJlc3Rhbmd1bGFyLmFsbCgnY29uZmxpY3RzL25hdGlvbnMnKS5nZXRMaXN0KCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9LFxuXHRcdFx0XHR2aWV3czp7XG5cdFx0XHRcdFx0J3NpZGViYXJAJzp7XG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOidDb25mbGljdHNDdHJsJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJyxcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOmdldFZpZXcoJ2NvbmZsaWN0cycpXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHQnaXRlbXMtbWVudUAnOntcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOmdldFZpZXcoJ2NvbmZsaWN0aXRlbXMnKSxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6J0NvbmZsaWN0aXRlbXNDdHJsJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLmNvbmZsaWN0LmluZGV4Lm5hdGlvbicse1xuXHRcdFx0XHR1cmw6ICcvbmF0aW9uLzppc28nLFxuXHRcdFx0XHRyZXNvbHZlOntcblx0XHRcdFx0XHRuYXRpb246ZnVuY3Rpb24oUmVzdGFuZ3VsYXIsICRzdGF0ZVBhcmFtcyl7XG5cdFx0XHRcdFx0XHRyZXR1cm4gXHRSZXN0YW5ndWxhci5vbmUoJy9jb25mbGljdHMvbmF0aW9ucy8nLCAkc3RhdGVQYXJhbXMuaXNvKS5nZXQoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sXG5cdFx0XHRcdHZpZXdzOntcblx0XHRcdFx0XHQnc2lkZWJhckAnOntcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6J0NvbmZsaWN0bmF0aW9uQ3RybCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyQXM6ICd2bScsXG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDpnZXRWaWV3KCdjb25mbGljdG5hdGlvbicpXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdFx0LnN0YXRlKCdhcHAuY29uZmxpY3QuaW5kZXguZGV0YWlscycse1xuXHRcdFx0XHR1cmw6ICcvOmlkJyxcblx0XHRcdFx0cmVzb2x2ZTp7XG5cdFx0XHRcdFx0Y29uZmxpY3Q6ZnVuY3Rpb24oUmVzdGFuZ3VsYXIsICRzdGF0ZVBhcmFtcyl7XG5cdFx0XHRcdFx0XHRyZXR1cm4gXHRSZXN0YW5ndWxhci5vbmUoJy9jb25mbGljdHMvZXZlbnRzLycsICRzdGF0ZVBhcmFtcy5pZCkuZ2V0KCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9LFxuXHRcdFx0XHR2aWV3czp7XG5cdFx0XHRcdFx0J3NpZGViYXJAJzp7XG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOidDb25mbGljdGRldGFpbHNDdHJsJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJyxcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOmdldFZpZXcoJ2NvbmZsaWN0ZGV0YWlscycpXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHQnaXRlbXMtbWVudUAnOnt9XG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cdFx0XHQuc3RhdGUoJ2FwcC5jb25mbGljdC5pbXBvcnQnLHtcblx0XHRcdFx0dXJsOiAnL2ltcG9ydCcsXG5cdFx0XHRcdGF1dGg6dHJ1ZSxcblx0XHRcdFx0dmlld3M6IHtcblx0XHRcdFx0XHQnc2lkZWJhckAnOiB7XG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiAnQ29uZmxpY3RJbXBvcnRDdHJsJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJyxcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdjb25mbGljdGltcG9ydCcpXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdFx0LnN0YXRlKCdhcHAuaW1wb3J0Y3N2Jywge1xuXHRcdFx0XHR1cmw6ICcvaW1wb3J0ZXInLFxuXHRcdFx0XHRkYXRhOiB7XG5cdFx0XHRcdFx0cGFnZU5hbWU6ICdJbXBvcnQgQ1NWJ1xuXHRcdFx0XHR9LFxuXHRcdFx0XHR2aWV3czoge1xuXHRcdFx0XHRcdCdtYWluQCc6IHtcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdpbXBvcnRjc3YnKVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0J21hcCc6IHt9XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHR9KTtcbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5yb3V0ZXMnKS5ydW4oZnVuY3Rpb24oJHJvb3RTY29wZSwgJG1kU2lkZW5hdiwgJHRpbWVvdXQsICRhdXRoLCAkc3RhdGUsJGxvY2FsU3RvcmFnZSwkd2luZG93LCBsZWFmbGV0RGF0YSwgdG9hc3RyKXtcblx0XHQkcm9vdFNjb3BlLnNpZGViYXJPcGVuID0gdHJ1ZTtcblx0XHQkcm9vdFNjb3BlLmxvb3NlTGF5b3V0ID0gJGxvY2FsU3RvcmFnZS5mdWxsVmlldyB8fCBmYWxzZTtcblx0XHQkcm9vdFNjb3BlLmdvQmFjayA9IGZ1bmN0aW9uKCl7XG5cdFx0ICR3aW5kb3cuaGlzdG9yeS5iYWNrKCk7XG5cdCB9XG5cdFx0JHJvb3RTY29wZS4kb24oXCIkc3RhdGVDaGFuZ2VTdGFydFwiLCBmdW5jdGlvbihldmVudCwgdG9TdGF0ZSwgdG9QYXJhbXMsIGZyb21TdGF0ZSxmcm9tUGFyYW1zKXtcblx0XHRcdGlmICh0b1N0YXRlLmF1dGggJiYgISRhdXRoLmlzQXV0aGVudGljYXRlZCgpKXtcblx0XHRcdFx0dG9hc3RyLmVycm9yKCdZb3VyIG5vdCBhbGxvd2VkIHRvIGdvIHRoZXJlIGJ1ZGR5IScsICdBY2Nlc3MgZGVuaWVkJyk7XG5cdFx0ICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0ICAgIHJldHVybiAkc3RhdGUuZ28oJ2FwcC5ob21lJyk7XG5cdFx0ICB9XG5cdFx0XHRpZiAodG9TdGF0ZS5kYXRhICYmIHRvU3RhdGUuZGF0YS5wYWdlTmFtZSl7XG5cdFx0XHRcdCRyb290U2NvcGUuY3VycmVudF9wYWdlID0gdG9TdGF0ZS5kYXRhLnBhZ2VOYW1lO1xuXHRcdFx0fVxuXHRcdFx0aWYodG9TdGF0ZS5sYXlvdXQgPT0gXCJyb3dcIil7XG5cdFx0XHRcdCRyb290U2NvcGUucm93ZWQgPSB0cnVlO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZXtcblx0XHRcdFx0JHJvb3RTY29wZS5yb3dlZCA9IGZhbHNlO1xuXHRcdFx0fVxuXHRcdFx0aWYodHlwZW9mIHRvU3RhdGUudmlld3MgIT0gXCJ1bmRlZmluZWRcIil7XG5cdFx0XHRcdGlmKHRvU3RhdGUudmlld3MuaGFzT3duUHJvcGVydHkoJ2FkZGl0aW9uYWxAJykpe1xuXHRcdFx0XHRcdCRyb290U2NvcGUuYWRkaXRpb25hbCA9IHRydWU7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZXtcblx0XHRcdFx0XHQkcm9vdFNjb3BlLmFkZGl0aW9uYWwgPSBmYWxzZTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZih0b1N0YXRlLnZpZXdzLmhhc093blByb3BlcnR5KCdpdGVtcy1tZW51QCcpKXtcblx0XHRcdFx0XHQkcm9vdFNjb3BlLml0ZW1NZW51ID0gdHJ1ZTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNle1xuXHRcdFx0XHRcdCRyb290U2NvcGUuaXRlbU1lbnUgPSBmYWxzZTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0ZWxzZXtcblx0XHRcdFx0JHJvb3RTY29wZS5hZGRpdGlvbmFsID0gZmFsc2U7XG5cdFx0XHRcdCRyb290U2NvcGUuaXRlbU1lbnUgPSBmYWxzZTtcblx0XHRcdH1cblx0XHRcdGlmKHRvU3RhdGUubmFtZS5pbmRleE9mKCdjb25mbGljdCcpID4gLTEgJiYgdG9TdGF0ZS5uYW1lICE9IFwiYXBwLmNvbmZsaWN0LmltcG9ydFwiKXtcblx0XHRcdFx0JHJvb3RTY29wZS5ub0hlYWRlciA9IHRydWU7XG5cdFx0XHR9XG5cdFx0XHRlbHNle1xuXHRcdFx0XHQkcm9vdFNjb3BlLm5vSGVhZGVyID0gZmFsc2U7XG5cdFx0XHR9XG5cdFx0XHQkcm9vdFNjb3BlLnByZXZpb3VzUGFnZSA9IHtzdGF0ZTpmcm9tU3RhdGUsIHBhcmFtczpmcm9tUGFyYW1zfTtcblx0XHRcdCRyb290U2NvcGUuc3RhdGVJc0xvYWRpbmcgPSB0cnVlO1xuXHRcdH0pO1xuXHRcdCRyb290U2NvcGUuJG9uKFwiJHZpZXdDb250ZW50TG9hZGVkXCIsIGZ1bmN0aW9uKGV2ZW50LCB0b1N0YXRlKXtcblxuXHRcdH0pO1xuXG5cdFx0JHJvb3RTY29wZS4kb24oXCIkc3RhdGVDaGFuZ2VTdWNjZXNzXCIsIGZ1bmN0aW9uKGV2ZW50LCB0b1N0YXRlKXtcblx0XHRcdCRyb290U2NvcGUuc3RhdGVJc0xvYWRpbmcgPSBmYWxzZTtcblx0XHRcdHJlc2V0TWFwU2l6ZSgpO1xuXHRcdH0pO1xuXG5cdFx0ZnVuY3Rpb24gcmVzZXRNYXBTaXplKCl7XG5cdFx0XHQkdGltZW91dChmdW5jdGlvbigpe1xuXHRcdFx0XHRsZWFmbGV0RGF0YS5nZXRNYXAoJ21hcCcpLnRoZW4oZnVuY3Rpb24gKG1hcCkge1xuXHRcdFx0XHRcdG1hcC5pbnZhbGlkYXRlU2l6ZSgpO1xuXHRcdFx0XHR9KVxuXHRcdFx0fSwgMTAwMCk7XG5cdFx0fVxuXHR9KTtcbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbmZpZycpLmNvbmZpZyhmdW5jdGlvbiAoJGF1dGhQcm92aWRlcikge1xuXHRcdC8vIFNhdGVsbGl6ZXIgY29uZmlndXJhdGlvbiB0aGF0IHNwZWNpZmllcyB3aGljaCBBUElcblx0XHQvLyByb3V0ZSB0aGUgSldUIHNob3VsZCBiZSByZXRyaWV2ZWQgZnJvbVxuXHRcdCRhdXRoUHJvdmlkZXIubG9naW5VcmwgPSAnL2FwaS9hdXRoZW50aWNhdGUvYXV0aCc7XG4gICAgJGF1dGhQcm92aWRlci5zaWdudXBVcmwgPSAnL2FwaS9hdXRoZW50aWNhdGUvYXV0aC9zaWdudXAnO1xuICAgICRhdXRoUHJvdmlkZXIudW5saW5rVXJsID0gJy9hcGkvYXV0aGVudGljYXRlL2F1dGgvdW5saW5rLyc7XG5cdFx0JGF1dGhQcm92aWRlci5mYWNlYm9vayh7XG5cdFx0XHR1cmw6ICcvYXBpL2F1dGhlbnRpY2F0ZS9mYWNlYm9vaycsXG5cdFx0XHRjbGllbnRJZDogJzc3MTk2MTgzMjkxMDA3Midcblx0XHR9KTtcblx0XHQkYXV0aFByb3ZpZGVyLmdvb2dsZSh7XG5cdFx0XHR1cmw6ICcvYXBpL2F1dGhlbnRpY2F0ZS9nb29nbGUnLFxuXHRcdFx0Y2xpZW50SWQ6ICcyNzY2MzQ1Mzc0NDAtY2d0dDE0cWoyZThpbnAwdnE1b3E5YjQ2azc0ampzM2UuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20nXG5cdFx0fSk7XG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbmZpZycpLmNvbmZpZyhmdW5jdGlvbiAoY2ZwTG9hZGluZ0JhclByb3ZpZGVyKXtcblx0XHRjZnBMb2FkaW5nQmFyUHJvdmlkZXIuaW5jbHVkZVNwaW5uZXIgPSBmYWxzZTtcblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb25maWcnKS5jb25maWcoIGZ1bmN0aW9uKFJlc3Rhbmd1bGFyUHJvdmlkZXIpIHtcblx0XHRSZXN0YW5ndWxhclByb3ZpZGVyXG5cdFx0LnNldEJhc2VVcmwoJy9hcGkvJylcblx0XHQuc2V0RGVmYXVsdEhlYWRlcnMoeyBhY2NlcHQ6IFwiYXBwbGljYXRpb24veC5sYXJhdmVsLnYxK2pzb25cIiB9KVxuXHRcdC5hZGRSZXNwb25zZUludGVyY2VwdG9yKGZ1bmN0aW9uKGRhdGEsb3BlcmF0aW9uLHdoYXQsdXJsLHJlc3BvbnNlLGRlZmVycmVkKSB7XG4gICAgICAgIHZhciBleHRyYWN0ZWREYXRhO1xuICAgICAgICBleHRyYWN0ZWREYXRhID0gZGF0YS5kYXRhO1xuICAgICAgICBpZiAoZGF0YS5tZXRhKSB7XG4gICAgICAgICAgICBleHRyYWN0ZWREYXRhLl9tZXRhID0gZGF0YS5tZXRhO1xuICAgICAgICB9XG4gICAgICAgIGlmIChkYXRhLmluY2x1ZGVkKSB7XG4gICAgICAgICAgICBleHRyYWN0ZWREYXRhLl9pbmNsdWRlZCA9IGRhdGEuaW5jbHVkZWQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGV4dHJhY3RlZERhdGE7XG4gICAgfSlcblx0XHQuc2V0RXJyb3JJbnRlcmNlcHRvcihmdW5jdGlvbihyZXNwb25zZSwgZGVmZXJyZWQsIHJlc3BvbnNlSGFuZGxlcikge1xuXHRcdFx0Y29uc29sZS5sb2coJ2VycnJvJyk7XG5cdFx0XHRpZiAocmVzcG9uc2Uuc3RhdHVzID09PSA0MDMpIHtcblxuICAgIFx0XHRyZXR1cm4gZmFsc2U7IC8vIGVycm9yIGhhbmRsZWRcbiAgICBcdH1cblxuICAgIFx0cmV0dXJuIHRydWU7IC8vIGVycm9yIG5vdCBoYW5kbGVkXG4gICAgXHR9KTtcblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb25maWcnKS5jb25maWcoZnVuY3Rpb24oJG1kVGhlbWluZ1Byb3ZpZGVyKSB7XG5cdFx0LyogRm9yIG1vcmUgaW5mbywgdmlzaXQgaHR0cHM6Ly9tYXRlcmlhbC5hbmd1bGFyanMub3JnLyMvVGhlbWluZy8wMV9pbnRyb2R1Y3Rpb24gKi9cbi8qXHR2YXIgbmVvblRlYWxNYXAgPSAkbWRUaGVtaW5nUHJvdmlkZXIuZXh0ZW5kUGFsZXR0ZSgndGVhbCcsIHtcbiAgICAnNTAwJzogJzAwY2NhYScsXG5cdFx0J0EyMDAnOiAnMDBjY2FhJ1xuICB9KTtcblx0dmFyIHdoaXRlTWFwID0gJG1kVGhlbWluZ1Byb3ZpZGVyLmV4dGVuZFBhbGV0dGUoJ3RlYWwnLCB7XG4gICAgJzUwMCc6ICcwMGNjYWEnLFxuXHRcdCdBMjAwJzogJyNmZmYnXG4gIH0pO1xuXHR2YXIgYmx1ZU1hcCA9ICRtZFRoZW1pbmdQcm92aWRlci5leHRlbmRQYWxldHRlKCdibHVlJywge1xuICAgICc1MDAnOiAnIzAwNmJiOScsXG5cdFx0J0EyMDAnOiAnIzAwNmJiOSdcbiAgfSk7XG5cdCRtZFRoZW1pbmdQcm92aWRlci5kZWZpbmVQYWxldHRlKCduZW9uVGVhbCcsIG5lb25UZWFsTWFwKTtcblx0JG1kVGhlbWluZ1Byb3ZpZGVyLmRlZmluZVBhbGV0dGUoJ3doaXRlVGVhbCcsIHdoaXRlTWFwKTtcblx0JG1kVGhlbWluZ1Byb3ZpZGVyLmRlZmluZVBhbGV0dGUoJ2JsdWVyJywgYmx1ZU1hcCk7XG5cdFx0JG1kVGhlbWluZ1Byb3ZpZGVyLnRoZW1lKCdkZWZhdWx0Jylcblx0XHQucHJpbWFyeVBhbGV0dGUoJ2xpZ2h0LWJsdWUnKVxuXHRcdC5hY2NlbnRQYWxldHRlKCdibHVlcicpOyovXG5cdFx0dmFyIGJsdWVNYXAgPSAkbWRUaGVtaW5nUHJvdmlkZXIuZXh0ZW5kUGFsZXR0ZSgnaW5kaWdvJywge1xuXHRcdFx0JzUwMCc6ICcjMDA2YmI5Jyxcblx0XHRcdCdBMjAwJzogJyMwMDZiYjknXG5cdFx0fSk7XG5cdFx0XHQkbWRUaGVtaW5nUHJvdmlkZXIuZGVmaW5lUGFsZXR0ZSgnYmx1ZXInLCBibHVlTWFwKTtcblxuXHRcdCRtZFRoZW1pbmdQcm92aWRlci50aGVtZSgnZGVmYXVsdCcpXG5cdFx0LnByaW1hcnlQYWxldHRlKCdibHVlcicpXG5cdFx0LmFjY2VudFBhbGV0dGUoJ2dyZXknKVxuXHRcdC53YXJuUGFsZXR0ZSgncmVkJyk7XG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbmZpZycpLmNvbmZpZyhmdW5jdGlvbih0b2FzdHJDb25maWcpe1xuICAgICAgICAvL1xuICAgICAgICBhbmd1bGFyLmV4dGVuZCh0b2FzdHJDb25maWcsIHtcbiAgICAgICAgICBhdXRvRGlzbWlzczogZmFsc2UsXG4gICAgICAgICAgY29udGFpbmVySWQ6ICd0b2FzdC1jb250YWluZXInLFxuICAgICAgICAgIG1heE9wZW5lZDogMCxcbiAgICAgICAgICBuZXdlc3RPblRvcDogdHJ1ZSxcbiAgICAgICAgICBwb3NpdGlvbkNsYXNzOiAndG9hc3QtYm90dG9tLXJpZ2h0JyxcbiAgICAgICAgICBwcmV2ZW50RHVwbGljYXRlczogZmFsc2UsXG4gICAgICAgICAgcHJldmVudE9wZW5EdXBsaWNhdGVzOiBmYWxzZSxcbiAgICAgICAgICB0YXJnZXQ6ICdib2R5JyxcbiAgICAgICAgICBjbG9zZUJ1dHRvbjogdHJ1ZVxuICAgICAgICB9KTtcbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5maWx0ZXJzJykuZmlsdGVyKCAnYWxwaGFudW0nLCBmdW5jdGlvbigpe1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oIGlucHV0ICl7XG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgaWYgKCAhaW5wdXQgKXtcbiAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gaW5wdXQucmVwbGFjZSgvKFteMC05QS1aXSkvZyxcIlwiKTtcblxuICAgICAgICB9XG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5maWx0ZXJzJykuZmlsdGVyKCAnY2FwaXRhbGl6ZScsIGZ1bmN0aW9uKCl7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uKGlucHV0LCBhbGwpIHtcblx0XHRcdHJldHVybiAoISFpbnB1dCkgPyBpbnB1dC5yZXBsYWNlKC8oW15cXFdfXStbXlxccy1dKikgKi9nLGZ1bmN0aW9uKHR4dCl7XG5cdFx0XHRcdHJldHVybiB0eHQuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyB0eHQuc3Vic3RyKDEpLnRvTG93ZXJDYXNlKCk7XG5cdFx0XHR9KSA6ICcnO1xuXHRcdH07XG5cdH0pO1xufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZmlsdGVycycpLmZpbHRlcignZmluZGJ5bmFtZScsIGZ1bmN0aW9uICgpIHtcblx0XHRyZXR1cm4gZnVuY3Rpb24gKGlucHV0LCBuYW1lLCBmaWVsZCkge1xuXHRcdFx0Ly9cbiAgICAgIHZhciBmb3VuZHMgPSBbXTtcblx0XHRcdHZhciBpID0gMCxcblx0XHRcdFx0bGVuID0gaW5wdXQubGVuZ3RoO1xuXG5cdFx0XHRmb3IgKDsgaSA8IGxlbjsgaSsrKSB7XG5cdFx0XHRcdGlmIChpbnB1dFtpXVtmaWVsZF0udG9Mb3dlckNhc2UoKS5pbmRleE9mKG5hbWUudG9Mb3dlckNhc2UoKSkgPiAtMSkge1xuXHRcdFx0XHRcdCBmb3VuZHMucHVzaChpbnB1dFtpXSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHJldHVybiBmb3VuZHM7XG5cdFx0fVxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmZpbHRlcnMnKS5maWx0ZXIoICdodW1hblJlYWRhYmxlJywgZnVuY3Rpb24oKXtcblx0XHRyZXR1cm4gZnVuY3Rpb24gaHVtYW5pemUoc3RyKSB7XG5cdFx0XHRpZiAoICFzdHIgKXtcblx0XHRcdFx0cmV0dXJuICcnO1xuXHRcdFx0fVxuXHRcdFx0dmFyIGZyYWdzID0gc3RyLnNwbGl0KCdfJyk7XG5cdFx0XHRmb3IgKHZhciBpPTA7IGk8ZnJhZ3MubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0ZnJhZ3NbaV0gPSBmcmFnc1tpXS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIGZyYWdzW2ldLnNsaWNlKDEpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGZyYWdzLmpvaW4oJyAnKTtcblx0XHR9O1xuXHR9KTtcbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5maWx0ZXJzJykuZmlsdGVyKCdPcmRlck9iamVjdEJ5JywgZnVuY3Rpb24gKCkge1xuXHRcdHJldHVybiBmdW5jdGlvbiAoaW5wdXQsIGF0dHJpYnV0ZSkge1xuXHRcdFx0aWYgKCFhbmd1bGFyLmlzT2JqZWN0KGlucHV0KSkgcmV0dXJuIGlucHV0O1xuXG5cdFx0XHR2YXIgYXJyYXkgPSBbXTtcblx0XHRcdGZvciAodmFyIG9iamVjdEtleSBpbiBpbnB1dCkge1xuXHRcdFx0XHRhcnJheS5wdXNoKGlucHV0W29iamVjdEtleV0pO1xuXHRcdFx0fVxuXG5cdFx0XHRhcnJheS5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XG5cdFx0XHRcdGEgPSBwYXJzZUludChhW2F0dHJpYnV0ZV0pO1xuXHRcdFx0XHRiID0gcGFyc2VJbnQoYlthdHRyaWJ1dGVdKTtcblx0XHRcdFx0cmV0dXJuIGEgLSBiO1xuXHRcdFx0fSk7XG5cdFx0XHRyZXR1cm4gYXJyYXk7XG5cdFx0fVxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZmlsdGVycycpLmZpbHRlcigncHJvcGVydHknLCBwcm9wZXJ0eSk7XG5cdGZ1bmN0aW9uIHByb3BlcnR5KCkge1xuXHRcdHJldHVybiBmdW5jdGlvbiAoYXJyYXksIHllYXJfZmllbGQsIHZhbHVlKSB7XG5cbiAgICAgIHZhciBpdGVtcyA9IFtdO1xuICAgICAgZm9yKHZhciBpID0gMDsgaSA8IGFycmF5Lmxlbmd0aDsgaSsrKXtcblxuICAgICAgICBpZihhcnJheVtpXS5kYXRhW3llYXJfZmllbGRdID09IHZhbHVlKXtcbiAgICAgICAgICBpdGVtcy5wdXNoKGFycmF5W2ldKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG5cdFx0XHRyZXR1cm4gaXRlbXM7XG5cdFx0fVxuXHR9XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5maWx0ZXJzJykuZmlsdGVyKCd0cnVuY2F0ZUNoYXJhY3RlcnMnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoaW5wdXQsIGNoYXJzLCBicmVha09uV29yZCkge1xuICAgICAgICAgICAgaWYgKGlzTmFOKGNoYXJzKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpbnB1dDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChjaGFycyA8PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICcnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGlucHV0ICYmIGlucHV0Lmxlbmd0aCA+IGNoYXJzKSB7XG4gICAgICAgICAgICAgICAgaW5wdXQgPSBpbnB1dC5zdWJzdHJpbmcoMCwgY2hhcnMpO1xuXG4gICAgICAgICAgICAgICAgaWYgKCFicmVha09uV29yZCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgbGFzdHNwYWNlID0gaW5wdXQubGFzdEluZGV4T2YoJyAnKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gR2V0IGxhc3Qgc3BhY2VcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxhc3RzcGFjZSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlucHV0ID0gaW5wdXQuc3Vic3RyKDAsIGxhc3RzcGFjZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB3aGlsZSAoaW5wdXQuY2hhckF0KGlucHV0Lmxlbmd0aC0xKSA9PT0gJyAnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbnB1dCA9IGlucHV0LnN1YnN0cigwLCBpbnB1dC5sZW5ndGggLSAxKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gaW5wdXQgKyAnLi4uJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBpbnB1dDtcbiAgICAgICAgfTtcbiAgICB9KTtcbn0pKCk7IiwiKGZ1bmN0aW9uKCl7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5maWx0ZXJzJykuZmlsdGVyKCd0cnVuY2F0ZVdvcmRzJywgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGlucHV0LCB3b3Jkcykge1xuICAgICAgICAgICAgaWYgKGlzTmFOKHdvcmRzKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpbnB1dDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh3b3JkcyA8PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICcnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGlucHV0KSB7XG4gICAgICAgICAgICAgICAgdmFyIGlucHV0V29yZHMgPSBpbnB1dC5zcGxpdCgvXFxzKy8pO1xuICAgICAgICAgICAgICAgIGlmIChpbnB1dFdvcmRzLmxlbmd0aCA+IHdvcmRzKSB7XG4gICAgICAgICAgICAgICAgICAgIGlucHV0ID0gaW5wdXRXb3Jkcy5zbGljZSgwLCB3b3Jkcykuam9pbignICcpICsgJy4uLic7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGlucHV0O1xuICAgICAgICB9O1xuICAgIH0pO1xufSkoKTsiLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5maWx0ZXJzJykuZmlsdGVyKCAndHJ1c3RIdG1sJywgZnVuY3Rpb24oICRzY2UgKXtcblx0XHRyZXR1cm4gZnVuY3Rpb24oIGh0bWwgKXtcblx0XHRcdHJldHVybiAkc2NlLnRydXN0QXNIdG1sKGh0bWwpO1xuXHRcdH07XG5cdH0pO1xufSkoKTsiLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5maWx0ZXJzJykuZmlsdGVyKCd1Y2ZpcnN0JywgZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uKCBpbnB1dCApIHtcblx0XHRcdGlmICggIWlucHV0ICl7XG5cdFx0XHRcdHJldHVybiBudWxsO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGlucHV0LnN1YnN0cmluZygwLCAxKS50b1VwcGVyQ2FzZSgpICsgaW5wdXQuc3Vic3RyaW5nKDEpO1xuXHRcdH07XG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLnNlcnZpY2VzJykuZmFjdG9yeSgnQ29udGVudFNlcnZpY2UnLCBmdW5jdGlvbihEYXRhU2VydmljZSkge1xuXHRcdC8vXG5cdFx0ZnVuY3Rpb24gc2VhcmNoRm9ySXRlbShsaXN0LGlkKXtcblxuXHRcdFx0Zm9yKHZhciBpID0gMDsgaSA8IGxpc3QubGVuZ3RoO2krKyl7XG5cdFx0XHRcdHZhciBpdGVtID0gbGlzdFtpXTtcblx0XHRcdFx0aWYoaXRlbS5pZCA9PSBpZCl7XG5cdFx0XHRcdFx0cmV0dXJuIGl0ZW07XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYoaXRlbS5jaGlsZHJlbil7XG5cdFx0XHRcdFx0dmFyIHN1YnJlc3VsdCA9IHNlYXJjaEZvckl0ZW0oaXRlbS5jaGlsZHJlbiwgaWQpO1xuXHRcdFx0XHRcdGlmKHN1YnJlc3VsdCl7XG5cdFx0XHRcdFx0XHRyZXR1cm4gc3VicmVzdWx0O1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gbnVsbDtcblx0XHR9XG5cdFx0cmV0dXJuIHtcblx0XHRcdGNvbnRlbnQ6IHtcblx0XHRcdFx0aW5kaWNhdG9yczogW10sXG5cdFx0XHRcdGluZGljYXRvcjoge30sXG5cdFx0XHRcdGRhdGE6IFtdLFxuXHRcdFx0XHRjYXRlZ29yaWVzOiBbXSxcblx0XHRcdFx0Y2F0ZWdvcnk6IHt9LFxuXHRcdFx0XHRzdHlsZXM6IFtdLFxuXHRcdFx0XHRpbmZvZ3JhcGhpY3M6IFtdLFxuXHRcdFx0XHRpbmRpY2VzOltdXG5cdFx0XHR9LFxuXHRcdFx0ZmV0Y2hJbmRpY2VzOiBmdW5jdGlvbihmaWx0ZXIpIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMuY29udGVudC5pbmRpY2VzID0gRGF0YVNlcnZpY2UuZ2V0QWxsKCdtZS9pbmRpemVzJykuJG9iamVjdDtcblx0XHRcdH0sXG5cdFx0XHRmZXRjaEluZGljYXRvcnM6IGZ1bmN0aW9uKGZpbHRlcikge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5jb250ZW50LmluZGljYXRvcnMgPSBEYXRhU2VydmljZS5nZXRBbGwoJ2luZGljYXRvcnMnLCBmaWx0ZXIpLiRvYmplY3Rcblx0XHRcdH0sXG5cdFx0XHRmZXRjaENhdGVnb3JpZXM6IGZ1bmN0aW9uKGZpbHRlcikge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5jb250ZW50LmNhdGVnb3JpZXMgPSBEYXRhU2VydmljZS5nZXRBbGwoJ2NhdGVnb3JpZXMnLCBmaWx0ZXIpLiRvYmplY3Q7XG5cdFx0XHR9LFxuXHRcdFx0ZmV0Y2hTdHlsZXM6IGZ1bmN0aW9uKGZpbHRlcikge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5jb250ZW50LnN0eWxlcyA9IERhdGFTZXJ2aWNlLmdldEFsbCgnc3R5bGVzJywgZmlsdGVyKS4kb2JqZWN0O1xuXHRcdFx0fSxcblx0XHRcdGdldEluZGljZXM6IGZ1bmN0aW9uKGZpbHRlcil7XG5cdFx0XHRcdHJldHVybiB0aGlzLmZldGNoSW5kaWNlcyhmaWx0ZXIpO1xuXHRcdFx0XHRpZiAodGhpcy5jb250ZW50LmluZGljZXMubGVuZ3RoID09IDApIHtcblxuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiB0aGlzLmNvbnRlbnQuaW5kaWNlcztcblx0XHRcdH0sXG5cdFx0XHRnZXRDYXRlZ29yaWVzOiBmdW5jdGlvbihmaWx0ZXIpIHtcblx0XHRcdFx0aWYgKHRoaXMuY29udGVudC5jYXRlZ29yaWVzLmxlbmd0aCA9PSAwKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHRoaXMuZmV0Y2hDYXRlZ29yaWVzKGZpbHRlcik7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHRoaXMuY29udGVudC5jYXRlZ29yaWVzO1xuXHRcdFx0fSxcblx0XHRcdGdldEluZGljYXRvcnM6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRpZiAodGhpcy5jb250ZW50LmluZGljYXRvcnMubGVuZ3RoID4gMCkge1xuXHRcdFx0XHRcdHJldHVybiB0aGlzLmNvbnRlbnQuaW5kaWNhdG9ycztcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gdGhpcy5mZXRjaEluZGljYXRvcnMoKTtcblxuXHRcdFx0fSxcblx0XHRcdGdldFN0eWxlczogZnVuY3Rpb24oZmlsdGVyKSB7XG5cdFx0XHRcdGlmICh0aGlzLmNvbnRlbnQuc3R5bGVzLmxlbmd0aCA9PSAwKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHRoaXMuZmV0Y2hTdHlsZXMoZmlsdGVyKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gdGhpcy5jb250ZW50LnN0eWxlcztcblx0XHRcdH0sXG5cdFx0XHRnZXRJbmRpY2F0b3I6IGZ1bmN0aW9uKGlkKSB7XG5cdFx0XHRcdGlmICh0aGlzLmNvbnRlbnQuaW5kaWNhdG9ycy5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmNvbnRlbnQuaW5kaWNhdG9ycy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRcdFx0aWYgKHRoaXMuY29udGVudC5pbmRpY2F0b3JzW2ldLmlkID09IGlkKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiB0aGlzLmNvbnRlbnQuaW5kaWNhdG9yc1tpXTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHRoaXMuZmV0Y2hJbmRpY2F0b3IoaWQpO1xuXHRcdFx0fSxcblx0XHRcdGZldGNoSW5kaWNhdG9yOiBmdW5jdGlvbihpZCkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5jb250ZW50LmluZGljYXRvciA9IERhdGFTZXJ2aWNlLmdldE9uZSgnaW5kaWNhdG9ycy8nICsgaWQpLiRvYmplY3Q7XG5cdFx0XHR9LFxuXHRcdFx0ZmV0Y2hJbmRpY2F0b3JQcm9taXNlOiBmdW5jdGlvbihpZCkge1xuXHRcdFx0XHRyZXR1cm4gRGF0YVNlcnZpY2UuZ2V0T25lKCdpbmRpY2F0b3JzJyxpZCk7XG5cdFx0XHR9LFxuXHRcdFx0Z2V0SW5kaWNhdG9yRGF0YTogZnVuY3Rpb24oaWQsIHllYXIpIHtcblx0XHRcdFx0aWYgKHllYXIpIHtcblx0XHRcdFx0XHRyZXR1cm4gdGhpcy5jb250ZW50LmRhdGEgPSBEYXRhU2VydmljZS5nZXRBbGwoJ2luZGljYXRvcnMvJyArIGlkICsgJy9kYXRhLycgKyB5ZWFyKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gdGhpcy5jb250ZW50LmRhdGEgPSBEYXRhU2VydmljZS5nZXRBbGwoJ2luZGljYXRvcnMvJyArIGlkICsgJy9kYXRhJyk7XG5cdFx0XHR9LFxuXHRcdFx0Z2V0SXRlbTogZnVuY3Rpb24oaWQpIHtcblx0XHRcdC8qXHRpZih0aGlzLmNvbnRlbnQuaW5kaWNlcy5sZW5ndGggPiAwKXtcblx0XHRcdFx0XHQgdGhpcy5jb250ZW50LmRhdGEgPSBzZWFyY2hGb3JJdGVtKHRoaXMuY29udGVudC5pbmRpY2VzLCBpZCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZXsqL1xuXHRcdFx0XHRcdHJldHVybiB0aGlzLmNvbnRlbnQuZGF0YSA9IERhdGFTZXJ2aWNlLmdldE9uZSgnaW5kZXgvJyArIGlkKVxuXHRcdFx0XHQvL31cblx0XHRcdH0sXG5cdFx0XHRyZW1vdmVJdGVtOiBmdW5jdGlvbihpZCl7XG5cdFx0XHRcdHJldHVybiBEYXRhU2VydmljZS5yZW1vdmUoJ2luZGV4LycsIGlkKTtcblx0XHRcdH0sXG5cdFx0XHRnZXRDYXRlZ29yeTogZnVuY3Rpb24oaWQpIHtcblx0XHRcdFx0aWYgKHRoaXMuY29udGVudC5jYXRlZ29yaWVzLmxlbmd0aCkge1xuXHRcdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5jb250ZW50LmNhdGVnb3JpZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHRcdGlmICh0aGlzLmNvbnRlbnQuY2F0ZWdvcmllc1tpXS5pZCA9PSBpZCkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gdGhpcy5jb250ZW50LmNhdGVnb3JpZXNbaV07XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHJldHVybiB0aGlzLmNvbnRlbnQuY2F0ZWdvcnkgPSBEYXRhU2VydmljZS5nZXRPbmUoJ2NhdGVnb3JpZXMvJyArIGlkKS4kb2JqZWN0O1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHR9XG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLnNlcnZpY2VzJykuZmFjdG9yeSgnQ291bnRyaWVzU2VydmljZScsIGZ1bmN0aW9uKERhdGFTZXJ2aWNlKXtcbiAgICAgICAgLy9cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBjb3VudHJpZXM6IFtdLFxuICAgICAgICAgIGZldGNoRGF0YTogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNvdW50cmllcyA9IERhdGFTZXJ2aWNlLmdldE9uZSgnY291bnRyaWVzL2lzb3MnKS4kb2JqZWN0O1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZ2V0RGF0YTogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIGlmKCF0aGlzLmNvdW50cmllcy5sZW5ndGgpe1xuICAgICAgICAgICAgICB0aGlzLmZldGNoRGF0YSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY291bnRyaWVzO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLnNlcnZpY2VzJykuZmFjdG9yeSgnRGF0YVNlcnZpY2UnLCBEYXRhU2VydmljZSk7XG4gICAgRGF0YVNlcnZpY2UuJGluamVjdCA9IFsnUmVzdGFuZ3VsYXInLCd0b2FzdHInXTtcblxuICAgIGZ1bmN0aW9uIERhdGFTZXJ2aWNlKFJlc3Rhbmd1bGFyLCB0b2FzdHIpe1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGdldEFsbDogZ2V0QWxsLFxuICAgICAgICAgIGdldE9uZTogZ2V0T25lLFxuICAgICAgICAgIHBvc3Q6IHBvc3QsXG4gICAgICAgICAgcHV0OiBwdXQsXG4gICAgICAgICAgcmVtb3ZlOiByZW1vdmVcbiAgICAgICAgfTtcblxuICAgICAgICBmdW5jdGlvbiBnZXRBbGwocm91dGUsIGZpbHRlcil7XG4gICAgICAgICAgdmFyIGRhdGEgPSBSZXN0YW5ndWxhci5hbGwocm91dGUpLmdldExpc3QoZmlsdGVyKTtcbiAgICAgICAgICAgIGRhdGEudGhlbihmdW5jdGlvbigpe30sIGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAgICAgICB0b2FzdHIuZXJyb3IoZGF0YS5zdGF0dXNUZXh0LCAnQ29ubmVjdGlvbiBFcnJvcicpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBnZXRPbmUocm91dGUsIGlkKXtcbiAgICAgICAgICByZXR1cm4gUmVzdGFuZ3VsYXIub25lKHJvdXRlLCBpZCkuZ2V0KCk7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gcG9zdChyb3V0ZSwgZGF0YSl7XG4gICAgICAgICAgdmFyIGRhdGEgPSBSZXN0YW5ndWxhci5hbGwocm91dGUpLnBvc3QoZGF0YSk7XG4gICAgICAgICAgZGF0YS50aGVuKGZ1bmN0aW9uKCl7fSwgZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgICAgICB0b2FzdHIuZXJyb3IoZGF0YS5kYXRhLmVycm9yLCAnU2F2aW5nIGZhaWxlZCcpO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIHB1dChyb3V0ZSwgZGF0YSl7XG4gICAgICAgICAgcmV0dXJuIFJlc3Rhbmd1bGFyLmFsbChyb3V0ZSkucHV0KGRhdGEpO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIHJlbW92ZShyb3V0ZSwgaWQpe1xuICAgICAgICAgIHJldHVybiBSZXN0YW5ndWxhci5vbmUocm91dGUsIGlkKS5yZW1vdmUoKTtcbiAgICAgICAgfVxuICAgIH1cblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZShcImFwcC5zZXJ2aWNlc1wiKS5mYWN0b3J5KCdEaWFsb2dTZXJ2aWNlJywgZnVuY3Rpb24oJG1kRGlhbG9nKXtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRmcm9tVGVtcGxhdGU6IGZ1bmN0aW9uKHRlbXBsYXRlLCAkc2NvcGUpe1xuXG5cdFx0XHRcdHZhciBvcHRpb25zID0ge1xuXHRcdFx0XHRcdHRlbXBsYXRlVXJsOiAnLi92aWV3cy9kaWFsb2dzLycgKyB0ZW1wbGF0ZSArICcvJyArIHRlbXBsYXRlICsgJy5odG1sJ1xuXHRcdFx0XHR9O1xuXG5cdFx0XHRcdGlmICgkc2NvcGUpe1xuXHRcdFx0XHRcdG9wdGlvbnMuc2NvcGUgPSAkc2NvcGUuJG5ldygpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuICRtZERpYWxvZy5zaG93KG9wdGlvbnMpO1xuXHRcdFx0fSxcblxuXHRcdFx0aGlkZTogZnVuY3Rpb24oKXtcblx0XHRcdFx0cmV0dXJuICRtZERpYWxvZy5oaWRlKCk7XG5cdFx0XHR9LFxuXG5cdFx0XHRhbGVydDogZnVuY3Rpb24odGl0bGUsIGNvbnRlbnQpe1xuXHRcdFx0XHQkbWREaWFsb2cuc2hvdyhcblx0XHRcdFx0XHQkbWREaWFsb2cuYWxlcnQoKVxuXHRcdFx0XHRcdFx0LnRpdGxlKHRpdGxlKVxuXHRcdFx0XHRcdFx0LmNvbnRlbnQoY29udGVudClcblx0XHRcdFx0XHRcdC5vaygnT2snKVxuXHRcdFx0XHQpO1xuXHRcdFx0fSxcblxuXHRcdFx0Y29uZmlybTogZnVuY3Rpb24odGl0bGUsIGNvbnRlbnQpIHtcblx0XHRcdFx0cmV0dXJuICRtZERpYWxvZy5zaG93KFxuXHRcdFx0XHRcdCRtZERpYWxvZy5jb25maXJtKClcblx0XHRcdFx0XHRcdC50aXRsZSh0aXRsZSlcblx0XHRcdFx0XHRcdC5jb250ZW50KGNvbnRlbnQpXG5cdFx0XHRcdFx0XHQub2soJ09rJylcblx0XHRcdFx0XHRcdC5jYW5jZWwoJ0NhbmNlbCcpXG5cdFx0XHRcdCk7XG5cdFx0XHR9XG5cdFx0fTtcblx0fSk7XG59KSgpOyIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5zZXJ2aWNlcycpLmZhY3RvcnkoJ0Vycm9yQ2hlY2tlclNlcnZpY2UnLCBmdW5jdGlvbihEYXRhU2VydmljZSwgRGlhbG9nU2VydmljZSwgSW5kZXhTZXJ2aWNlKXtcbiAgICAgICAgLy9cbiAgICAgICAgdmFyIHZtID0gdGhpcztcblxuICAgICAgICBmdW5jdGlvbiBjaGVja015RGF0YShkYXRhKSB7XG4gICAgXHRcdFx0dm0uZXh0ZW5kaW5nQ2hvaWNlcyA9IFtdO1xuICAgIFx0XHRcdGlmICh2bS5kYXRhLmxlbmd0aCkge1xuICAgIFx0XHRcdFx0dm0ubXlEYXRhLnRoZW4oZnVuY3Rpb24oaW1wb3J0cykge1xuICAgIFx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2goaW1wb3J0cywgZnVuY3Rpb24oZW50cnkpIHtcbiAgICBcdFx0XHRcdFx0XHR2YXIgZm91bmQgPSAwO1xuICAgIFx0XHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5kYXRhWzBdLm1ldGEuZmllbGRzLCBmdW5jdGlvbihmaWVsZCkge1xuICAgIFx0XHRcdFx0XHRcdFx0dmFyIGNvbHVtbnMgPSBKU09OLnBhcnNlKGVudHJ5Lm1ldGFfZGF0YSk7XG4gICAgXHRcdFx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2goY29sdW1ucywgZnVuY3Rpb24oY29sdW1uKSB7XG4gICAgXHRcdFx0XHRcdFx0XHRcdGlmIChjb2x1bW4uY29sdW1uID09IGZpZWxkKSB7XG4gICAgXHRcdFx0XHRcdFx0XHRcdFx0Zm91bmQrKztcbiAgICBcdFx0XHRcdFx0XHRcdFx0fVxuICAgIFx0XHRcdFx0XHRcdFx0fSlcbiAgICBcdFx0XHRcdFx0XHR9KTtcbiAgICBcdFx0XHRcdFx0XHRpZiAoZm91bmQgPj0gdm0uZGF0YVswXS5tZXRhLmZpZWxkcy5sZW5ndGggLSAzKSB7XG4gICAgXHRcdFx0XHRcdFx0XHR2bS5leHRlbmRpbmdDaG9pY2VzLnB1c2goZW50cnkpO1xuICAgIFx0XHRcdFx0XHRcdH1cbiAgICBcdFx0XHRcdFx0fSlcbiAgICBcdFx0XHRcdFx0aWYgKHZtLmV4dGVuZGluZ0Nob2ljZXMubGVuZ3RoKSB7XG4gICAgXHRcdFx0XHRcdFx0aWYodm0ubWV0YS55ZWFyX2ZpZWxkKXtcbiAgICBcdFx0XHRcdFx0XHRcdHZtLm1ldGEueWVhciA9IHZtLmRhdGFbMF0uZGF0YVswXVt2bS5tZXRhLnllYXJfZmllbGRdO1xuICAgIFx0XHRcdFx0XHRcdH1cbiAgICBcdFx0XHRcdFx0XHREaWFsb2dTZXJ2aWNlLmZyb21UZW1wbGF0ZSgnZXh0ZW5kRGF0YScsICRzY29wZSk7XG4gICAgXHRcdFx0XHRcdH1cbiAgICBcdFx0XHRcdH0pO1xuICAgIFx0XHRcdH1cbiAgICAgICAgICByZXR1cm4gZXh0ZW5kZWRDaG9pY2VzO1xuICAgIFx0XHR9XG5cbiAgICBcdFx0ZnVuY3Rpb24gY2xlYXJFcnJvcnMoKSB7XG4gICAgXHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLmRhdGEsIGZ1bmN0aW9uKHJvdywga2V5KSB7XG4gICAgXHRcdFx0XHRhbmd1bGFyLmZvckVhY2gocm93LmRhdGFbMF0sIGZ1bmN0aW9uKGl0ZW0sIGspIHtcbiAgICBcdFx0XHRcdFx0aWYgKGlzTmFOKGl0ZW0pIHx8IGl0ZW0gPCAwKSB7XG4gICAgXHRcdFx0XHRcdFx0aWYgKCBpdGVtLnRvU3RyaW5nKCkudG9VcHBlckNhc2UoKSA9PSBcIiNOQVwiIHx8IGl0ZW0gPCAwIHx8IGl0ZW0udG9TdHJpbmcoKS50b1VwcGVyQ2FzZSgpLmluZGV4T2YoJ04vQScpID4gLTEpIHtcbiAgICBcdFx0XHRcdFx0XHRcdHZtLmRhdGFba2V5XS5kYXRhWzBdW2tdID0gbnVsbDtcbiAgICBcdFx0XHRcdFx0XHRcdHJvdy5lcnJvcnMuc3BsaWNlKDAsIDEpO1xuICAgIFx0XHRcdFx0XHRcdFx0dm0uZXJyb3JzLnNwbGljZSgwLCAxKTtcbiAgICBcdFx0XHRcdFx0XHR9XG4gICAgXHRcdFx0XHRcdH1cbiAgICBcdFx0XHRcdH0pO1xuICAgIFx0XHRcdFx0aWYgKCFyb3cuZGF0YVswXVt2bS5tZXRhLmlzb19maWVsZF0pIHtcbiAgICBcdFx0XHRcdFx0dmFyIGVycm9yID0ge1xuICAgIFx0XHRcdFx0XHRcdHR5cGU6IFwiMlwiLFxuICAgIFx0XHRcdFx0XHRcdG1lc3NhZ2U6IFwiSXNvIGZpZWxkIGlzIG5vdCB2YWxpZCFcIixcbiAgICBcdFx0XHRcdFx0XHR2YWx1ZTogcm93LmRhdGFbMF1bdm0ubWV0YS5pc29fZmllbGRdLFxuICAgIFx0XHRcdFx0XHRcdGNvbHVtbjogdm0ubWV0YS5pc29fZmllbGQsXG4gICAgXHRcdFx0XHRcdFx0cm93OiBrZXlcbiAgICBcdFx0XHRcdFx0fTtcbiAgICBcdFx0XHRcdFx0dmFyIGVycm9yRm91bmQgPSBmYWxzZTtcbiAgICBcdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKHJvdy5lcnJvcnMsIGZ1bmN0aW9uKGVycm9yLCBrZXkpIHtcbiAgICBcdFx0XHRcdFx0XHRpZiAoZXJyb3IudHlwZSA9PSAyKSB7XG4gICAgXHRcdFx0XHRcdFx0XHRlcnJvckZvdW5kID0gdHJ1ZTtcbiAgICBcdFx0XHRcdFx0XHR9XG4gICAgXHRcdFx0XHRcdH0pXG4gICAgXHRcdFx0XHRcdGlmICghZXJyb3JGb3VuZCkge1xuICAgIFx0XHRcdFx0XHRcdHJvdy5lcnJvcnMucHVzaChlcnJvcik7XG4gICAgXHRcdFx0XHRcdFx0dm0uaXNvX2Vycm9ycy5wdXNoKGVycm9yKTtcbiAgICBcdFx0XHRcdFx0fVxuICAgIFx0XHRcdFx0fVxuICAgIFx0XHRcdH0pO1xuICAgIFx0XHR9XG5cbiAgICBcdFx0ZnVuY3Rpb24gZmV0Y2hJc28oKSB7XG4gICAgXHRcdFx0aWYgKCF2bS5tZXRhLmlzb19maWVsZCkge1xuICAgIFx0XHRcdFx0dG9hc3RyLmVycm9yKCdDaGVjayB5b3VyIHNlbGVjdGlvbiBmb3IgdGhlIElTTyBmaWVsZCcsICdDb2x1bW4gbm90IHNwZWNpZmllZCEnKTtcbiAgICBcdFx0XHRcdHJldHVybiBmYWxzZTtcbiAgICBcdFx0XHR9XG4gICAgXHRcdFx0aWYgKCF2bS5tZXRhLmNvdW50cnlfZmllbGQpIHtcbiAgICBcdFx0XHRcdHRvYXN0ci5lcnJvcignQ2hlY2sgeW91ciBzZWxlY3Rpb24gZm9yIHRoZSBDT1VOVFJZIGZpZWxkJywgJ0NvbHVtbiBub3Qgc3BlY2lmaWVkIScpO1xuICAgIFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuICAgIFx0XHRcdH1cbiAgICBcdFx0XHRpZiAodm0ubWV0YS5jb3VudHJ5X2ZpZWxkID09IHZtLm1ldGEuaXNvX2ZpZWxkKSB7XG4gICAgXHRcdFx0XHR0b2FzdHIuZXJyb3IoJ0lTTyBmaWVsZCBhbmQgQ09VTlRSWSBmaWVsZCBjYW4gbm90IGJlIHRoZSBzYW1lJywgJ1NlbGVjdGlvbiBlcnJvciEnKTtcbiAgICBcdFx0XHRcdHJldHVybiBmYWxzZTtcbiAgICBcdFx0XHR9XG5cbiAgICBcdFx0XHR2bS5ub3RGb3VuZCA9IFtdO1xuICAgIFx0XHRcdHZhciBlbnRyaWVzID0gW107XG4gICAgXHRcdFx0dmFyIGlzb0NoZWNrID0gMDtcbiAgICBcdFx0XHR2YXIgaXNvVHlwZSA9ICdpc28tMzE2Ni0yJztcbiAgICBcdFx0XHRhbmd1bGFyLmZvckVhY2godm0uZGF0YSwgZnVuY3Rpb24oaXRlbSwga2V5KSB7XG4gICAgXHRcdFx0XHRpZiAoaXRlbS5kYXRhWzBdW3ZtLm1ldGEuaXNvX2ZpZWxkXSkge1xuICAgIFx0XHRcdFx0XHRpc29DaGVjayArPSBpdGVtLmRhdGFbMF1bdm0ubWV0YS5pc29fZmllbGRdLmxlbmd0aCA9PSAzID8gMSA6IDA7XG4gICAgXHRcdFx0XHR9XG4gICAgXHRcdFx0XHRzd2l0Y2ggKGl0ZW0uZGF0YVswXVt2bS5tZXRhLmNvdW50cnlfZmllbGRdKSB7XG4gICAgXHRcdFx0XHRcdGNhc2UgJ0NhYm8gVmVyZGUnOlxuICAgIFx0XHRcdFx0XHRcdGl0ZW0uZGF0YVswXVt2bS5tZXRhLmNvdW50cnlfZmllbGRdID0gJ0NhcGUgVmVyZGUnO1xuICAgIFx0XHRcdFx0XHRcdGJyZWFrO1xuICAgIFx0XHRcdFx0XHRjYXNlIFwiRGVtb2NyYXRpYyBQZW9wbGVzIFJlcHVibGljIG9mIEtvcmVhXCI6XG4gICAgXHRcdFx0XHRcdFx0aXRlbS5kYXRhWzBdW3ZtLm1ldGEuY291bnRyeV9maWVsZF0gPSBcIkRlbW9jcmF0aWMgUGVvcGxlJ3MgUmVwdWJsaWMgb2YgS29yZWFcIjtcbiAgICBcdFx0XHRcdFx0XHRicmVhaztcbiAgICBcdFx0XHRcdFx0Y2FzZSBcIkNvdGUgZCdJdm9pcmVcIjpcbiAgICBcdFx0XHRcdFx0XHRpdGVtLmRhdGFbMF1bdm0ubWV0YS5jb3VudHJ5X2ZpZWxkXSA9IFwiSXZvcnkgQ29hc3RcIjtcbiAgICBcdFx0XHRcdFx0XHRicmVhaztcbiAgICBcdFx0XHRcdFx0Y2FzZSBcIkxhbyBQZW9wbGVzIERlbW9jcmF0aWMgUmVwdWJsaWNcIjpcbiAgICBcdFx0XHRcdFx0XHRpdGVtLmRhdGFbMF1bdm0ubWV0YS5jb3VudHJ5X2ZpZWxkXSA9IFwiTGFvIFBlb3BsZSdzIERlbW9jcmF0aWMgUmVwdWJsaWNcIjtcbiAgICBcdFx0XHRcdFx0XHRicmVhaztcbiAgICBcdFx0XHRcdFx0ZGVmYXVsdDpcbiAgICBcdFx0XHRcdFx0XHRicmVhaztcbiAgICBcdFx0XHRcdH1cbiAgICBcdFx0XHRcdGVudHJpZXMucHVzaCh7XG4gICAgXHRcdFx0XHRcdGlzbzogaXRlbS5kYXRhWzBdW3ZtLm1ldGEuaXNvX2ZpZWxkXSxcbiAgICBcdFx0XHRcdFx0bmFtZTogaXRlbS5kYXRhWzBdW3ZtLm1ldGEuY291bnRyeV9maWVsZF1cbiAgICBcdFx0XHRcdH0pO1xuICAgIFx0XHRcdH0pO1xuICAgIFx0XHRcdHZhciBpc29UeXBlID0gaXNvQ2hlY2sgPj0gKGVudHJpZXMubGVuZ3RoIC8gMikgPyAnaXNvLTMxNjYtMScgOiAnaXNvLTMxNjYtMic7XG4gICAgXHRcdFx0SW5kZXhTZXJ2aWNlLnJlc2V0VG9TZWxlY3QoKTtcbiAgICBcdFx0XHREYXRhU2VydmljZS5wb3N0KCdjb3VudHJpZXMvYnlJc29OYW1lcycsIHtcbiAgICBcdFx0XHRcdGRhdGE6IGVudHJpZXMsXG4gICAgXHRcdFx0XHRpc286IGlzb1R5cGVcbiAgICBcdFx0XHR9KS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgXHRcdFx0XHRhbmd1bGFyLmZvckVhY2gocmVzcG9uc2UsIGZ1bmN0aW9uKGNvdW50cnksIGtleSkge1xuICAgIFx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2godm0uZGF0YSwgZnVuY3Rpb24oaXRlbSwgaykge1xuICAgIFx0XHRcdFx0XHRcdGlmIChjb3VudHJ5Lm5hbWUgPT0gaXRlbS5kYXRhWzBdW3ZtLm1ldGEuY291bnRyeV9maWVsZF0pIHtcbiAgICBcdFx0XHRcdFx0XHRcdGlmIChjb3VudHJ5LmRhdGEubGVuZ3RoID4gMSkge1xuICAgIFx0XHRcdFx0XHRcdFx0XHR2YXIgdG9TZWxlY3QgPSB7XG4gICAgXHRcdFx0XHRcdFx0XHRcdFx0ZW50cnk6IGl0ZW0sXG4gICAgXHRcdFx0XHRcdFx0XHRcdFx0b3B0aW9uczogY291bnRyeS5kYXRhXG4gICAgXHRcdFx0XHRcdFx0XHRcdH07XG4gICAgXHRcdFx0XHRcdFx0XHRcdEluZGV4U2VydmljZS5hZGRUb1NlbGVjdCh0b1NlbGVjdCk7XG4gICAgXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuICAgIFx0XHRcdFx0XHRcdFx0XHRpZiAodHlwZW9mIGNvdW50cnkuZGF0YVswXSAhPSBcInVuZGVmaW5lZFwiKSB7XG4gICAgXHRcdFx0XHRcdFx0XHRcdFx0dm0uZGF0YVtrXS5kYXRhWzBdW3ZtLm1ldGEuaXNvX2ZpZWxkXSA9IGNvdW50cnkuZGF0YVswXS5pc287XG4gICAgXHRcdFx0XHRcdFx0XHRcdFx0dm0uZGF0YVtrXS5kYXRhWzBdW3ZtLm1ldGEuY291bnRyeV9maWVsZF0gPSBjb3VudHJ5LmRhdGFbMF0uYWRtaW47XG4gICAgXHRcdFx0XHRcdFx0XHRcdFx0aWYgKGl0ZW0uZXJyb3JzLmxlbmd0aCkge1xuICAgIFx0XHRcdFx0XHRcdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKGl0ZW0uZXJyb3JzLCBmdW5jdGlvbihlcnJvciwgZSkge1xuICAgIFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoZXJyb3IudHlwZSA9PSAyIHx8IGVycm9yLnR5cGUgPT0gMykge1xuICAgIFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHZtLmlzb19lcnJvcnMuc3BsaWNlKDAsIDEpO1xuICAgIFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGl0ZW0uZXJyb3JzLnNwbGljZShlLCAxKTtcbiAgICBcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fSBlbHNlIGlmIChlcnJvci50eXBlID09IDEpIHtcbiAgICBcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoZXJyb3IuY29sdW1uID09IHZtLm1ldGEuaXNvX2ZpZWxkKSB7XG4gICAgXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR2bS5lcnJvcnMuc3BsaWNlKDAsIDEpO1xuICAgIFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aXRlbS5lcnJvcnMuc3BsaWNlKGUsIDEpO1xuICAgIFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cbiAgICBcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuICAgIFx0XHRcdFx0XHRcdFx0XHRcdFx0fSk7XG5cbiAgICBcdFx0XHRcdFx0XHRcdFx0XHR9XG4gICAgXHRcdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG4gICAgXHRcdFx0XHRcdFx0XHRcdFx0Ly9jb25zb2xlLmxvZyh2bS5kYXRhW2tdKTtcbiAgICBcdFx0XHRcdFx0XHRcdFx0XHR2YXIgZXJyb3IgPSB7XG4gICAgXHRcdFx0XHRcdFx0XHRcdFx0XHR0eXBlOiBcIjNcIixcbiAgICBcdFx0XHRcdFx0XHRcdFx0XHRcdG1lc3NhZ2U6IFwiQ291bGQgbm90IGxvY2F0ZSBhIHZhbGlkIGlzbyBuYW1lIVwiLFxuICAgIFx0XHRcdFx0XHRcdFx0XHRcdFx0Y29sdW1uOiB2bS5tZXRhLmNvdW50cnlfZmllbGRcbiAgICBcdFx0XHRcdFx0XHRcdFx0XHR9O1xuICAgIFx0XHRcdFx0XHRcdFx0XHRcdHZhciBlcnJvckZvdW5kID0gZmFsc2U7XG4gICAgXHRcdFx0XHRcdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLmRhdGFba10uZXJyb3JzLCBmdW5jdGlvbihlcnJvciwgaSkge1xuICAgIFx0XHRcdFx0XHRcdFx0XHRcdFx0Y29uc29sZS5sb2coZXJyb3IpO1xuICAgIFx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKGVycm9yLnR5cGUgPT0gMykge1xuICAgIFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlcnJvckZvdW5kID0gdHJ1ZTtcbiAgICBcdFx0XHRcdFx0XHRcdFx0XHRcdH1cbiAgICBcdFx0XHRcdFx0XHRcdFx0XHR9KVxuICAgIFx0XHRcdFx0XHRcdFx0XHRcdGlmICghZXJyb3JGb3VuZCkge1xuICAgIFx0XHRcdFx0XHRcdFx0XHRcdFx0SW5kZXhTZXJ2aWNlLmFkZElzb0Vycm9yKGVycm9yKTtcbiAgICBcdFx0XHRcdFx0XHRcdFx0XHRcdGl0ZW0uZXJyb3JzLnB1c2goZXJyb3IpO1xuICAgIFx0XHRcdFx0XHRcdFx0XHRcdH1cbiAgICBcdFx0XHRcdFx0XHRcdFx0fVxuICAgIFx0XHRcdFx0XHRcdFx0fVxuICAgIFx0XHRcdFx0XHRcdH1cbiAgICBcdFx0XHRcdFx0fSk7XG4gICAgXHRcdFx0XHR9KTtcbiAgICBcdFx0XHRcdHZtLmlzb19jaGVja2VkID0gdHJ1ZTtcbiAgICBcdFx0XHRcdGlmIChJbmRleFNlcnZpY2UuZ2V0VG9TZWxlY3QoKS5sZW5ndGgpIHtcbiAgICBcdFx0XHRcdFx0RGlhbG9nU2VydmljZS5mcm9tVGVtcGxhdGUoJ3NlbGVjdGlzb2ZldGNoZXJzJyk7XG4gICAgXHRcdFx0XHR9XG4gICAgXHRcdFx0fSwgZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICBcdFx0XHRcdHRvYXN0ci5lcnJvcignUGxlYXNlIGNoZWNrIHlvdXIgZmllbGQgc2VsZWN0aW9ucycsIHJlc3BvbnNlLmRhdGEubWVzc2FnZSk7XG4gICAgXHRcdFx0fSk7XG5cbiAgICBcdFx0fVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGNoZWNrTXlEYXRhOiBjaGVja015RGF0YVxuICAgICAgICB9XG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuc2VydmljZXMnKS5mYWN0b3J5KCdJY29uc1NlcnZpY2UnLCBmdW5jdGlvbigpe1xuICAgICAgICB2YXIgdW5pY29kZXMgPSB7XG4gICAgICAgICAgJ2VtcHR5JzogXCJcXHVlNjAwXCIsXG4gICAgICAgICAgJ2FncmFyJzogXCJcXHVlNjAwXCIsXG4gICAgICAgICAgJ2FuY2hvcic6IFwiXFx1ZTYwMVwiLFxuICAgICAgICAgICdidXR0ZXJmbHknOiBcIlxcdWU2MDJcIixcbiAgICAgICAgICAnZW5lcmd5JzpcIlxcdWU2MDNcIixcbiAgICAgICAgICAnc2luayc6IFwiXFx1ZTYwNFwiLFxuICAgICAgICAgICdtYW4nOiBcIlxcdWU2MDVcIixcbiAgICAgICAgICAnZmFicmljJzogXCJcXHVlNjA2XCIsXG4gICAgICAgICAgJ3RyZWUnOlwiXFx1ZTYwN1wiLFxuICAgICAgICAgICd3YXRlcic6XCJcXHVlNjA4XCJcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGdldFVuaWNvZGU6IGZ1bmN0aW9uKGljb24pe1xuICAgICAgICAgICAgcmV0dXJuIHVuaWNvZGVzW2ljb25dO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZ2V0TGlzdDpmdW5jdGlvbigpe1xuICAgICAgICAgICAgcmV0dXJuIHVuaWNvZGVzO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLnNlcnZpY2VzJykuZmFjdG9yeSgnSW5kZXhTZXJ2aWNlJywgZnVuY3Rpb24oQ2FjaGVGYWN0b3J5LCRzdGF0ZSl7XG4gICAgICAgIC8vXG4gICAgICAgIHZhciBzZXJ2aWNlRGF0YSA9IHtcbiAgICAgICAgICAgIGRhdGE6IFtdLFxuICAgICAgICAgICAgZXJyb3JzOiBbXSxcbiAgICAgICAgICAgIGlzb19lcnJvcnM6W10sXG4gICAgICAgICAgICBtZXRhOntcbiAgICAgICAgICAgICAgaXNvX2ZpZWxkOiAnJyxcbiAgICAgICAgICAgICAgY291bnRyeV9maWVsZDonJyxcbiAgICAgICAgICAgICAgeWVhcl9maWVsZDonJyxcbiAgICAgICAgICAgICAgdGFibGU6W11cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBpbmRpY2F0b3JzOnt9LFxuICAgICAgICAgICAgdG9TZWxlY3Q6W11cbiAgICAgICAgfSwgc3RvcmFnZSwgaW1wb3J0Q2FjaGUsIGluZGljYXRvcjtcblxuICAgICAgICBpZiAoIUNhY2hlRmFjdG9yeS5nZXQoJ2ltcG9ydERhdGEnKSkge1xuICAgICAgICAgIGltcG9ydENhY2hlID0gQ2FjaGVGYWN0b3J5KCdpbXBvcnREYXRhJywge1xuICAgICAgICAgICAgY2FjaGVGbHVzaEludGVydmFsOiA2MCAqIDYwICogMTAwMCwgLy8gVGhpcyBjYWNoZSB3aWxsIGNsZWFyIGl0c2VsZiBldmVyeSBob3VyLlxuICAgICAgICAgICAgZGVsZXRlT25FeHBpcmU6ICdhZ2dyZXNzaXZlJywgLy8gSXRlbXMgd2lsbCBiZSBkZWxldGVkIGZyb20gdGhpcyBjYWNoZSByaWdodCB3aGVuIHRoZXkgZXhwaXJlLlxuICAgICAgICAgICAgc3RvcmFnZU1vZGU6ICdsb2NhbFN0b3JhZ2UnIC8vIFRoaXMgY2FjaGUgd2lsbCB1c2UgYGxvY2FsU3RvcmFnZWAuXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgc2VydmljZURhdGEgPSBpbXBvcnRDYWNoZS5nZXQoJ2RhdGFUb0ltcG9ydCcpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2V7XG4gICAgICAgICAgaW1wb3J0Q2FjaGUgPSBDYWNoZUZhY3RvcnkuZ2V0KCdpbXBvcnREYXRhJyk7XG4gICAgICAgICAgc3RvcmFnZSA9IGltcG9ydENhY2hlLmdldCgnZGF0YVRvSW1wb3J0Jyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBjbGVhcjpmdW5jdGlvbigpe1xuICAgICAgICAgICAgJHN0YXRlLmdvKCdhcHAuaW5kZXguY3JlYXRlJyk7XG4gICAgICAgICAgICBpZihDYWNoZUZhY3RvcnkuZ2V0KCdpbXBvcnREYXRhJykpe1xuICAgICAgICAgICAgICAgIGltcG9ydENhY2hlLnJlbW92ZSgnZGF0YVRvSW1wb3J0Jyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gc2VydmljZURhdGE9IHtcbiAgICAgICAgICAgICAgICBkYXRhOiBbXSxcbiAgICAgICAgICAgICAgICBlcnJvcnM6IFtdLFxuICAgICAgICAgICAgICAgIGlzb19lcnJvcnM6W10sXG4gICAgICAgICAgICAgICAgbWV0YTp7XG4gICAgICAgICAgICAgICAgICBpc29fZmllbGQ6ICcnLFxuICAgICAgICAgICAgICAgICAgY291bnRyeV9maWVsZDonJyxcbiAgICAgICAgICAgICAgICAgIHllYXJfZmllbGQ6JydcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHRvU2VsZWN0OltdLFxuICAgICAgICAgICAgICAgIGluZGljYXRvcnM6e31cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfSxcbiAgICAgICAgICBhZGREYXRhOmZ1bmN0aW9uKGl0ZW0pe1xuICAgICAgICAgICAgcmV0dXJuIHNlcnZpY2VEYXRhLmRhdGEucHVzaChpdGVtKTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGFkZEluZGljYXRvcjogZnVuY3Rpb24oaXRlbSl7XG4gICAgICAgICAgICByZXR1cm4gc2VydmljZURhdGEuaW5kaWNhdG9ycy5wdXNoKGl0ZW0pO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgYWRkVG9TZWxlY3Q6IGZ1bmN0aW9uKGl0ZW0pe1xuICAgICAgICAgICAgcmV0dXJuIHNlcnZpY2VEYXRhLnRvU2VsZWN0LnB1c2goaXRlbSk7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBhZGRJc29FcnJvcjogZnVuY3Rpb24oZXJyb3Ipe1xuICAgICAgICAgICAgcmV0dXJuIHNlcnZpY2VEYXRhLmlzb19lcnJvcnMucHVzaChlcnJvcik7XG4gICAgICAgICAgfSxcbiAgICAgICAgICByZW1vdmVUb1NlbGVjdDogZnVuY3Rpb24oaXRlbSl7XG4gICAgICAgICAgICB2YXIgaW5kZXggPSBzZXJ2aWNlRGF0YS50b1NlbGVjdC5pbmRleE9mKGl0ZW0pO1xuICAgICAgICAgICAgcmV0dXJuIGluZGV4ID4gLTEgPyBzZXJ2aWNlRGF0YS50b1NlbGVjdC5zcGxpY2UoaW5kZXgsIDEpIDogZmFsc2U7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBzZXREYXRhOiBmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgICAgIHJldHVybiBzZXJ2aWNlRGF0YS5kYXRhID0gZGF0YTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIHNldElzb0ZpZWxkOiBmdW5jdGlvbihrZXkpe1xuICAgICAgICAgICAgcmV0dXJuIHNlcnZpY2VEYXRhLm1ldGEuaXNvX2ZpZWxkID0ga2V5O1xuICAgICAgICAgIH0sXG4gICAgICAgICAgc2V0Q291bnRyeUZpZWxkOiBmdW5jdGlvbihrZXkpe1xuICAgICAgICAgICAgcmV0dXJuIHNlcnZpY2VEYXRhLm1ldGEuY291bnRyeV9maWVsZCA9IGtleTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIHNldFllYXJGaWVsZDogZnVuY3Rpb24oa2V5KXtcbiAgICAgICAgICAgIHJldHVybiBzZXJ2aWNlRGF0YS5tZXRhLnllYXJfZmllbGQgPSBrZXk7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBzZXRFcnJvcnM6IGZ1bmN0aW9uKGVycm9ycyl7XG4gICAgICAgICAgICByZXR1cm4gc2VydmljZURhdGEuZXJyb3JzID0gZXJyb3JzO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgc2V0VG9Mb2NhbFN0b3JhZ2U6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKHNlcnZpY2VEYXRhKTtcbiAgICAgICAgICBpbXBvcnRDYWNoZS5wdXQoJ2RhdGFUb0ltcG9ydCcsc2VydmljZURhdGEpO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgc2V0SW5kaWNhdG9yOiBmdW5jdGlvbihrZXksIGl0ZW0pe1xuICAgICAgICAgICAgcmV0dXJuIHNlcnZpY2VEYXRhLmluZGljYXRvcnNba2V5XSA9IGl0ZW07XG4gICAgICAgICAgfSxcbiAgICAgICAgICBzZXRBY3RpdmVJbmRpY2F0b3JEYXRhOiBmdW5jdGlvbihpdGVtKXtcbiAgICAgICAgICAgIHJldHVybiBpbmRpY2F0b3IgPSBzZXJ2aWNlRGF0YS5pbmRpY2F0b3JzW2l0ZW0uY29sdW1uX25hbWVdID0gaXRlbTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGdldEZyb21Mb2NhbFN0b3JhZ2U6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICByZXR1cm4gc2VydmljZURhdGEgPSBpbXBvcnRDYWNoZS5nZXQoJ2RhdGFUb0ltcG9ydCcpO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZ2V0RnVsbERhdGE6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICByZXR1cm4gc2VydmljZURhdGE7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBnZXREYXRhOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgaWYodHlwZW9mIHNlcnZpY2VEYXRhID09IFwidW5kZWZpbmVkXCIpIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIHJldHVybiBzZXJ2aWNlRGF0YS5kYXRhO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZ2V0TWV0YTogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIGlmKHR5cGVvZiBzZXJ2aWNlRGF0YSA9PSBcInVuZGVmaW5lZFwiKSByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICByZXR1cm4gc2VydmljZURhdGEubWV0YTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGdldFRvU2VsZWN0OiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgcmV0dXJuIHNlcnZpY2VEYXRhLnRvU2VsZWN0O1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZ2V0SXNvRmllbGQ6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICByZXR1cm4gc2VydmljZURhdGEubWV0YS5pc29fZmllbGQ7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBnZXRDb3VudHJ5RmllbGQ6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICByZXR1cm4gc2VydmljZURhdGEubWV0YS5jb3VudHJ5X2ZpZWxkO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZ2V0RXJyb3JzOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgaWYodHlwZW9mIHNlcnZpY2VEYXRhID09IFwidW5kZWZpbmVkXCIpIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIHJldHVybiBzZXJ2aWNlRGF0YS5lcnJvcnM7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBnZXRJc29FcnJvcnM6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBpZih0eXBlb2Ygc2VydmljZURhdGEgPT0gXCJ1bmRlZmluZWRcIikgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgcmV0dXJuIHNlcnZpY2VEYXRhLmlzb19lcnJvcnM7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBnZXRGaXJzdEVudHJ5OiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgcmV0dXJuIHNlcnZpY2VEYXRhLmRhdGFbMF07XG4gICAgICAgICAgfSxcbiAgICAgICAgICBnZXREYXRhU2l6ZTogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHJldHVybiBzZXJ2aWNlRGF0YS5kYXRhLmxlbmd0aDtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGdldEluZGljYXRvcjogZnVuY3Rpb24oa2V5KXtcbiAgICAgICAgICAgIHJldHVybiBpbmRpY2F0b3IgPSBzZXJ2aWNlRGF0YS5pbmRpY2F0b3JzW2tleV07XG4gICAgICAgICAgfSxcbiAgICAgICAgICBnZXRJbmRpY2F0b3JzOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgaWYodHlwZW9mIHNlcnZpY2VEYXRhID09IFwidW5kZWZpbmVkXCIpIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIHJldHVybiBzZXJ2aWNlRGF0YS5pbmRpY2F0b3JzO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgYWN0aXZlSW5kaWNhdG9yOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgcmV0dXJuIGluZGljYXRvcjtcbiAgICAgICAgICB9LFxuICAgICAgICAgIHJlc2V0SW5kaWNhdG9yOmZ1bmN0aW9uKCl7XG4gICAgICAgICAgICByZXR1cm4gaW5kaWNhdG9yID0gbnVsbDtcbiAgICAgICAgICB9LFxuICAgICAgICAgIHJlZHVjZUlzb0Vycm9yOmZ1bmN0aW9uKCl7XG4gICAgICAgICAgICByZXR1cm4gc2VydmljZURhdGEuaXNvX2Vycm9ycy5zcGxpY2UoMCwxKTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIHJlZHVjZUVycm9yOmZ1bmN0aW9uKCl7XG4gICAgICAgICAgICByZXR1cm4gc2VydmljZURhdGEuZXJyb3JzLnNwbGljZSgwLDEpO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgcmVzZXRUb1NlbGVjdDogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHJldHVybiBzZXJ2aWNlRGF0YS50b1NlbGVjdCA9IFtdO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgcmVzZXRMb2NhbFN0b3JhZ2U6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBpZihDYWNoZUZhY3RvcnkuZ2V0KCdpbXBvcnREYXRhJykpe1xuICAgICAgICAgICAgICAgIGltcG9ydENhY2hlLnJlbW92ZSgnZGF0YVRvSW1wb3J0Jyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gc2VydmljZURhdGE9IHtcbiAgICAgICAgICAgICAgICBkYXRhOiBbXSxcbiAgICAgICAgICAgICAgICBlcnJvcnM6IFtdLFxuICAgICAgICAgICAgICAgIGlzb19lcnJvcnM6W10sXG4gICAgICAgICAgICAgICAgbWV0YTp7XG4gICAgICAgICAgICAgICAgICBpc29fZmllbGQ6ICcnLFxuICAgICAgICAgICAgICAgICAgY291bnRyeV9maWVsZDonJyxcbiAgICAgICAgICAgICAgICAgIHllYXJfZmllbGQ6JydcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHRvU2VsZWN0OltdLFxuICAgICAgICAgICAgICAgIGluZGljYXRvcnM6e31cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLnNlcnZpY2VzJykuZmFjdG9yeSgnSW5kaXplc1NlcnZpY2UnLCBmdW5jdGlvbiAoRGF0YVNlcnZpY2UpIHtcblx0XHQvL1xuXHRcdHJldHVybiB7XG5cdFx0XHRpbmRleDoge1xuXHRcdFx0XHRkYXRhOiB7XG5cdFx0XHRcdFx0ZGF0YTogbnVsbCxcblx0XHRcdFx0XHRzdHJ1Y3R1cmU6IG51bGxcblx0XHRcdFx0fSxcblx0XHRcdFx0cHJvbWlzZXM6IHtcblx0XHRcdFx0XHRkYXRhOiBudWxsLFxuXHRcdFx0XHRcdHN0cnVjdHVyOiBudWxsXG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHRmZXRjaERhdGE6IGZ1bmN0aW9uKGluZGV4KSB7XG5cdFx0XHRcdHRoaXMuaW5kZXgucHJvbWlzZXMuZGF0YSA9IERhdGFTZXJ2aWNlLmdldEFsbCgnaW5kZXgvJyArIGluZGV4ICsgJy95ZWFyL2xhdGVzdCcpO1xuXHRcdFx0XHR0aGlzLmluZGV4LnByb21pc2VzLnN0cnVjdHVyZSA9IERhdGFTZXJ2aWNlLmdldE9uZSgnaW5kZXgvJyArIGluZGV4ICsgJy9zdHJ1Y3R1cmUnKTtcblx0XHRcdFx0dGhpcy5pbmRleC5kYXRhLmRhdGEgPSB0aGlzLmluZGV4LnByb21pc2VzLmRhdGEuJG9iamVjdDtcblx0XHRcdFx0dGhpcy5pbmRleC5kYXRhLnN0cnVjdHVyZSA9IHRoaXMuaW5kZXgucHJvbWlzZXMuc3RydWN0dXJlLiRvYmplY3Q7XG5cdFx0XHRcdHJldHVybiB0aGlzLmluZGV4O1xuXHRcdFx0fSxcblx0XHRcdGdldERhdGE6IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMuaW5kZXguZGF0YS5kYXRhO1xuXHRcdFx0fSxcblx0XHRcdGdldFN0cnVjdHVyZTogZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5pbmRleC5kYXRhLnN0cnVjdHVyZTtcblx0XHRcdH0sXG5cdFx0XHRnZXREYXRhUHJvbWlzZTogZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5pbmRleC5wcm9taXNlcy5kYXRhO1xuXHRcdFx0fSxcblx0XHRcdGdldFN0cnVjdHVyZVByb21pc2U6IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMuaW5kZXgucHJvbWlzZXMuc3RydWN0dXJlO1xuXHRcdFx0fVxuXHRcdH1cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXHRcdFwidXNlIHN0cmljdFwiO1xuXG5cdFx0YW5ndWxhci5tb2R1bGUoJ2FwcC5zZXJ2aWNlcycpLmZhY3RvcnkoJ1JlY3Vyc2lvbkhlbHBlcicsIGZ1bmN0aW9uICgkY29tcGlsZSkge1xuXHRcdFx0XHQvL1xuXHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdC8qKlxuXHRcdFx0XHRcdCAqIE1hbnVhbGx5IGNvbXBpbGVzIHRoZSBlbGVtZW50LCBmaXhpbmcgdGhlIHJlY3Vyc2lvbiBsb29wLlxuXHRcdFx0XHRcdCAqIEBwYXJhbSBlbGVtZW50XG5cdFx0XHRcdFx0ICogQHBhcmFtIFtsaW5rXSBBIHBvc3QtbGluayBmdW5jdGlvbiwgb3IgYW4gb2JqZWN0IHdpdGggZnVuY3Rpb24ocykgcmVnaXN0ZXJlZCB2aWEgcHJlIGFuZCBwb3N0IHByb3BlcnRpZXMuXG5cdFx0XHRcdFx0ICogQHJldHVybnMgQW4gb2JqZWN0IGNvbnRhaW5pbmcgdGhlIGxpbmtpbmcgZnVuY3Rpb25zLlxuXHRcdFx0XHRcdCAqL1xuXHRcdFx0XHRcdGNvbXBpbGU6IGZ1bmN0aW9uIChlbGVtZW50LCBsaW5rKSB7XG5cdFx0XHRcdFx0XHQvLyBOb3JtYWxpemUgdGhlIGxpbmsgcGFyYW1ldGVyXG5cdFx0XHRcdFx0XHRpZiAoYW5ndWxhci5pc0Z1bmN0aW9uKGxpbmspKSB7XG5cdFx0XHRcdFx0XHRcdGxpbmsgPSB7XG5cdFx0XHRcdFx0XHRcdFx0cG9zdDogbGlua1xuXHRcdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHQvLyBCcmVhayB0aGUgcmVjdXJzaW9uIGxvb3AgYnkgcmVtb3ZpbmcgdGhlIGNvbnRlbnRzXG5cdFx0XHRcdFx0XHR2YXIgY29udGVudHMgPSBlbGVtZW50LmNvbnRlbnRzKCkucmVtb3ZlKCk7XG5cdFx0XHRcdFx0XHR2YXIgY29tcGlsZWRDb250ZW50cztcblx0XHRcdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0XHRcdHByZTogKGxpbmsgJiYgbGluay5wcmUpID8gbGluay5wcmUgOiBudWxsLFxuXHRcdFx0XHRcdFx0XHQvKipcblx0XHRcdFx0XHRcdFx0ICogQ29tcGlsZXMgYW5kIHJlLWFkZHMgdGhlIGNvbnRlbnRzXG5cdFx0XHRcdFx0XHRcdCAqL1xuXHRcdFx0XHRcdFx0XHRwb3N0OiBmdW5jdGlvbiAoc2NvcGUsIGVsZW1lbnQpIHtcblx0XHRcdFx0XHRcdFx0XHQvLyBDb21waWxlIHRoZSBjb250ZW50c1xuXHRcdFx0XHRcdFx0XHRcdGlmICghY29tcGlsZWRDb250ZW50cykge1xuXHRcdFx0XHRcdFx0XHRcdFx0Y29tcGlsZWRDb250ZW50cyA9ICRjb21waWxlKGNvbnRlbnRzKTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0Ly8gUmUtYWRkIHRoZSBjb21waWxlZCBjb250ZW50cyB0byB0aGUgZWxlbWVudFxuXHRcdFx0XHRcdFx0XHRcdGNvbXBpbGVkQ29udGVudHMoc2NvcGUsIGZ1bmN0aW9uIChjbG9uZSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0ZWxlbWVudC5hcHBlbmQoY2xvbmUpO1xuXHRcdFx0XHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFx0XHRcdFx0Ly8gQ2FsbCB0aGUgcG9zdC1saW5raW5nIGZ1bmN0aW9uLCBpZiBhbnlcblx0XHRcdFx0XHRcdFx0XHRpZiAobGluayAmJiBsaW5rLnBvc3QpIHtcblx0XHRcdFx0XHRcdFx0XHRcdGxpbmsucG9zdC5hcHBseShudWxsLCBhcmd1bWVudHMpO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cblx0XHR9KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKFwiYXBwLnNlcnZpY2VzXCIpLmZhY3RvcnkoJ1RvYXN0U2VydmljZScsIGZ1bmN0aW9uKCRtZFRvYXN0KXtcblxuXHRcdHZhciBkZWxheSA9IDYwMDAsXG5cdFx0XHRwb3NpdGlvbiA9ICd0b3AgcmlnaHQnLFxuXHRcdFx0YWN0aW9uID0gJ09LJztcblxuXHRcdHJldHVybiB7XG5cdFx0XHRzaG93OiBmdW5jdGlvbihjb250ZW50KXtcblx0XHRcdFx0aWYgKCFjb250ZW50KXtcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm4gJG1kVG9hc3Quc2hvdyhcblx0XHRcdFx0XHQkbWRUb2FzdC5zaW1wbGUoKVxuXHRcdFx0XHRcdFx0LmNvbnRlbnQoY29udGVudClcblx0XHRcdFx0XHRcdC5wb3NpdGlvbihwb3NpdGlvbilcblx0XHRcdFx0XHRcdC5hY3Rpb24oYWN0aW9uKVxuXHRcdFx0XHRcdFx0LmhpZGVEZWxheShkZWxheSlcblx0XHRcdFx0KTtcblx0XHRcdH0sXG5cdFx0XHRlcnJvcjogZnVuY3Rpb24oY29udGVudCl7XG5cdFx0XHRcdGlmICghY29udGVudCl7XG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuICRtZFRvYXN0LnNob3coXG5cdFx0XHRcdFx0JG1kVG9hc3Quc2ltcGxlKClcblx0XHRcdFx0XHRcdC5jb250ZW50KGNvbnRlbnQpXG5cdFx0XHRcdFx0XHQucG9zaXRpb24ocG9zaXRpb24pXG5cdFx0XHRcdFx0XHQudGhlbWUoJ3dhcm4nKVxuXHRcdFx0XHRcdFx0LmFjdGlvbihhY3Rpb24pXG5cdFx0XHRcdFx0XHQuaGlkZURlbGF5KGRlbGF5KVxuXHRcdFx0XHQpO1xuXHRcdFx0fVxuXHRcdH07XG5cdH0pO1xufSkoKTsiLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuc2VydmljZXMnKS5mYWN0b3J5KCdVc2VyU2VydmljZScsIGZ1bmN0aW9uKERhdGFTZXJ2aWNlKXtcbiAgICAgICAgLy9cblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHVzZXI6e1xuICAgICAgICAgICAgZGF0YTogW11cbiAgICAgICAgICB9LFxuICAgICAgICAgIG15RGF0YTogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnVzZXIuZGF0YSA9IERhdGFTZXJ2aWNlLmdldEFsbCgnbWUvZGF0YScpO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgbXlQcm9maWxlOiBmdW5jdGlvbigpe1xuXG4gICAgICAgICAgfSxcbiAgICAgICAgICBteUZyaWVuZHM6IGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5zZXJ2aWNlcycpLmZhY3RvcnkoJ1ZlY3RvcmxheWVyU2VydmljZScsIGZ1bmN0aW9uKCR0aW1lb3V0KSB7XG5cdFx0dmFyIHRoYXQgPSB0aGlzLCBfc2VsZiA9IHRoaXM7XG5cdFx0cmV0dXJuIHtcblx0XHRcdGNhbnZhczogZmFsc2UsXG5cdFx0XHRwYWxldHRlOiBbXSxcblx0XHRcdGN0eDogJycsXG5cdFx0XHRrZXlzOiB7XG5cdFx0XHRcdG1henBlbjogJ3ZlY3Rvci10aWxlcy1RM19PczV3Jyxcblx0XHRcdFx0bWFwYm94OiAncGsuZXlKMUlqb2liV0ZuYm05c2J5SXNJbUVpT2lKdVNGZFVZa2c0SW4wLjVIT3lrS2swcE5QMU4zaXNmUFFHVFEnXG5cdFx0XHR9LFxuXHRcdFx0ZGF0YToge1xuXHRcdFx0XHRsYXllcjogJycsXG5cdFx0XHRcdG5hbWU6ICdjb3VudHJpZXNfYmlnJyxcblx0XHRcdFx0YmFzZUNvbG9yOiAnIzA2YTk5YycsXG5cdFx0XHRcdGlzbzM6ICdhZG0wX2EzJyxcblx0XHRcdFx0aXNvMjogJ2lzb19hMicsXG5cdFx0XHRcdGlzbzogJ2lzb19hMicsXG5cdFx0XHRcdGZpZWxkczogXCJpZCxhZG1pbixhZG0wX2EzLHdiX2EzLHN1X2EzLGlzb19hMyxpc29fYTIsbmFtZSxuYW1lX2xvbmdcIixcblx0XHRcdFx0ZmllbGQ6J3Njb3JlJ1xuXHRcdFx0fSxcblx0XHRcdG1hcDoge1xuXHRcdFx0XHRkYXRhOiBbXSxcblx0XHRcdFx0Y3VycmVudDogW10sXG5cdFx0XHRcdHN0cnVjdHVyZTogW10sXG5cdFx0XHRcdHN0eWxlOiBbXVxuXHRcdFx0fSxcblx0XHRcdG1hcExheWVyOiBudWxsLFxuXHRcdFx0c2V0TWFwOiBmdW5jdGlvbihtYXApe1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5tYXBMYXllciA9IG1hcDtcblx0XHRcdH0sXG5cdFx0XHRzZXRMYXllcjogZnVuY3Rpb24obCkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5kYXRhLmxheWVyID0gbDtcblx0XHRcdH0sXG5cdFx0XHRnZXRMYXllcjogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLmRhdGEubGF5ZXI7XG5cdFx0XHR9LFxuXHRcdFx0Z2V0TmFtZTogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLmRhdGEubmFtZTtcblx0XHRcdH0sXG5cdFx0XHRmaWVsZHM6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5kYXRhLmZpZWxkcztcblx0XHRcdH0sXG5cdFx0XHRpc286IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5kYXRhLmlzbztcblx0XHRcdH0sXG5cdFx0XHRpc28zOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMuZGF0YS5pc28zO1xuXHRcdFx0fSxcblx0XHRcdGlzbzI6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5kYXRhLmlzbzI7XG5cdFx0XHR9LFxuXHRcdFx0Y3JlYXRlQ2FudmFzOiBmdW5jdGlvbihjb2xvcikge1xuXHRcdFx0XHR0aGlzLmNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuXHRcdFx0XHR0aGlzLmNhbnZhcy53aWR0aCA9IDI4MDtcblx0XHRcdFx0dGhpcy5jYW52YXMuaGVpZ2h0ID0gMTA7XG5cdFx0XHRcdHRoaXMuY3R4ID0gdGhpcy5jYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcblx0XHRcdFx0dmFyIGdyYWRpZW50ID0gdGhpcy5jdHguY3JlYXRlTGluZWFyR3JhZGllbnQoMCwgMCwgMjgwLCAxMCk7XG5cdFx0XHRcdGdyYWRpZW50LmFkZENvbG9yU3RvcCgxLCAncmdiYSgyNTUsMjU1LDI1NSwwKScpO1xuXHRcdFx0XHRncmFkaWVudC5hZGRDb2xvclN0b3AoMC41MywgY29sb3IgfHwgJ3JnYmEoMTI4LCAyNDMsIDE5OCwxKScpO1xuXHRcdFx0XHRncmFkaWVudC5hZGRDb2xvclN0b3AoMCwgJ3JnYmEoMTAyLDEwMiwxMDIsMSknKTtcblx0XHRcdFx0dGhpcy5jdHguZmlsbFN0eWxlID0gZ3JhZGllbnQ7XG5cdFx0XHRcdHRoaXMuY3R4LmZpbGxSZWN0KDAsIDAsIDI4MCwgMTApO1xuXHRcdFx0XHR0aGlzLnBhbGV0dGUgPSB0aGlzLmN0eC5nZXRJbWFnZURhdGEoMCwgMCwgMjU3LCAxKS5kYXRhO1xuXHRcdFx0XHQvL2RvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdib2R5JylbMF0uYXBwZW5kQ2hpbGQodGhpcy5jYW52YXMpO1xuXHRcdFx0fSxcblx0XHRcdHVwZGF0ZUNhbnZhczogZnVuY3Rpb24oY29sb3IpIHtcblx0XHRcdFx0dmFyIGdyYWRpZW50ID0gdGhpcy5jdHguY3JlYXRlTGluZWFyR3JhZGllbnQoMCwgMCwgMjgwLCAxMCk7XG5cdFx0XHRcdGdyYWRpZW50LmFkZENvbG9yU3RvcCgxLCAncmdiYSgyNTUsMjU1LDI1NSwwKScpO1xuXHRcdFx0XHRncmFkaWVudC5hZGRDb2xvclN0b3AoMC41MywgY29sb3IgfHwgJ3JnYmEoMTI4LCAyNDMsIDE5OCwxKScpO1xuXHRcdFx0XHRncmFkaWVudC5hZGRDb2xvclN0b3AoMCwgJ3JnYmEoMTAyLDEwMiwxMDIsMSknKTtcblx0XHRcdFx0dGhpcy5jdHguZmlsbFN0eWxlID0gZ3JhZGllbnQ7XG5cdFx0XHRcdHRoaXMuY3R4LmZpbGxSZWN0KDAsIDAsIDI4MCwgMTApO1xuXHRcdFx0XHR0aGlzLnBhbGV0dGUgPSB0aGlzLmN0eC5nZXRJbWFnZURhdGEoMCwgMCwgMjU3LCAxKS5kYXRhO1xuXHRcdFx0XHQvL2RvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdib2R5JylbMF0uYXBwZW5kQ2hpbGQodGhpcy5jYW52YXMpO1xuXHRcdFx0fSxcblx0XHRcdGNyZWF0ZUZpeGVkQ2FudmFzOiBmdW5jdGlvbihjb2xvclJhbmdlKXtcblxuXHRcdFx0XHR0aGlzLmNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuXHRcdFx0XHR0aGlzLmNhbnZhcy53aWR0aCA9IDI4MDtcblx0XHRcdFx0dGhpcy5jYW52YXMuaGVpZ2h0ID0gMTA7XG5cdFx0XHRcdHRoaXMuY3R4ID0gdGhpcy5jYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcblx0XHRcdFx0dmFyIGdyYWRpZW50ID0gdGhpcy5jdHguY3JlYXRlTGluZWFyR3JhZGllbnQoMCwgMCwgMjgwLCAxMCk7XG5cblx0XHRcdFx0Zm9yKHZhciBpID0gMDsgaSA8IGNvbG9yUmFuZ2UubGVuZ3RoOyBpKyspe1xuXHRcdFx0XHRcdGdyYWRpZW50LmFkZENvbG9yU3RvcCgxIC8gKGNvbG9yUmFuZ2UubGVuZ3RoIC0xKSAqIGksIGNvbG9yUmFuZ2VbaV0pO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHRoaXMuY3R4LmZpbGxTdHlsZSA9IGdyYWRpZW50O1xuXHRcdFx0XHR0aGlzLmN0eC5maWxsUmVjdCgwLCAwLCAyODAsIDEwKTtcblx0XHRcdFx0dGhpcy5wYWxldHRlID0gdGhpcy5jdHguZ2V0SW1hZ2VEYXRhKDAsIDAsIDI1NywgMSkuZGF0YTtcblxuXHRcdFx0fSxcblx0XHRcdHVwZGF0ZUZpeGVkQ2FudmFzOiBmdW5jdGlvbihjb2xvclJhbmdlKSB7XG5cdFx0XHRcdHZhciBncmFkaWVudCA9IHRoaXMuY3R4LmNyZWF0ZUxpbmVhckdyYWRpZW50KDAsIDAsIDI4MCwgMTApO1xuXHRcdFx0XHRmb3IodmFyIGkgPSAwOyBpIDwgY29sb3JSYW5nZS5sZW5ndGg7IGkrKyl7XG5cdFx0XHRcdFx0Z3JhZGllbnQuYWRkQ29sb3JTdG9wKDEgLyAoY29sb3JSYW5nZS5sZW5ndGggLTEpICogaSwgY29sb3JSYW5nZVtpXSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0dGhpcy5jdHguZmlsbFN0eWxlID0gZ3JhZGllbnQ7XG5cdFx0XHRcdHRoaXMuY3R4LmZpbGxSZWN0KDAsIDAsIDI4MCwgMTApO1xuXHRcdFx0XHR0aGlzLnBhbGV0dGUgPSB0aGlzLmN0eC5nZXRJbWFnZURhdGEoMCwgMCwgMjU3LCAxKS5kYXRhO1xuXHRcdFx0XHQvL2RvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdib2R5JylbMF0uYXBwZW5kQ2hpbGQodGhpcy5jYW52YXMpO1xuXHRcdFx0fSxcblx0XHRcdHNldEJhc2VDb2xvcjogZnVuY3Rpb24oY29sb3IpIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMuZGF0YS5iYXNlQ29sb3IgPSBjb2xvcjtcblx0XHRcdH0sXG5cdFx0LypcdHNldFN0eWxlOiBmdW5jdGlvbihzdHlsZSkge1xuXHRcdFx0XHR0aGlzLmRhdGEubGF5ZXIuc2V0U3R5bGUoc3R5bGUpXG5cdFx0XHR9LCovXG5cdFx0XHRjb3VudHJ5Q2xpY2s6IGZ1bmN0aW9uKGNsaWNrRnVuY3Rpb24pIHtcblx0XHRcdFx0dmFyIHRoYXQgPSB0aGlzO1xuXHRcdFx0XHQkdGltZW91dChmdW5jdGlvbigpe1xuXHRcdFx0XHRcdFx0dGhhdC5kYXRhLmxheWVyLm9wdGlvbnMub25DbGljayA9IGNsaWNrRnVuY3Rpb247XG5cdFx0XHRcdH0pXG5cblx0XHRcdH0sXG5cdFx0XHRnZXRDb2xvcjogZnVuY3Rpb24odmFsdWUpIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMucGFsZXR0ZVt2YWx1ZV07XG5cdFx0XHR9LFxuXHRcdFx0c2V0U3R5bGU6IGZ1bmN0aW9uKHN0eWxlKXtcblx0XHRcdFx0cmV0dXJuIHRoaXMubWFwLnN0eWxlID0gc3R5bGU7XG5cdFx0XHR9LFxuXHRcdFx0c2V0RGF0YTogZnVuY3Rpb24oZGF0YSwgY29sb3IsIGRyYXdJdCkge1xuXHRcdFx0XHR0aGlzLm1hcC5kYXRhID0gZGF0YTtcblx0XHRcdFx0aWYgKHR5cGVvZiBjb2xvciAhPSBcInVuZGVmaW5lZFwiKSB7XG5cdFx0XHRcdFx0dGhpcy5kYXRhLmJhc2VDb2xvciA9IGNvbG9yO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICghdGhpcy5jYW52YXMpIHtcblx0XHRcdFx0XHRpZih0eXBlb2YgdGhpcy5kYXRhLmJhc2VDb2xvciA9PSAnc3RyaW5nJyl7XG5cdFx0XHRcdFx0XHR0aGlzLmNyZWF0ZUNhbnZhcyh0aGlzLmRhdGEuYmFzZUNvbG9yKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZWxzZXtcblx0XHRcdFx0XHRcdHRoaXMuY3JlYXRlRml4ZWRDYW52YXModGhpcy5kYXRhLmJhc2VDb2xvcik7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGlmKHR5cGVvZiB0aGlzLmRhdGEuYmFzZUNvbG9yID09ICdzdHJpbmcnKXtcblx0XHRcdFx0XHRcdHRoaXMudXBkYXRlQ2FudmFzKHRoaXMuZGF0YS5iYXNlQ29sb3IpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNle1xuXHRcdFx0XHRcdFx0dGhpcy51cGRhdGVGaXhlZENhbnZhcyh0aGlzLmRhdGEuYmFzZUNvbG9yKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKGRyYXdJdCkge1xuXHRcdFx0XHRcdHRoaXMucGFpbnRDb3VudHJpZXMoKTtcblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdGdldE5hdGlvbkJ5SXNvOiBmdW5jdGlvbihpc28sIGxpc3QpIHtcblx0XHRcdFx0aWYodHlwZW9mIGxpc3QgIT09IFwidW5kZWZpbmVkXCIpe1xuXHRcdFx0XHRcdGlmIChsaXN0Lmxlbmd0aCA9PSAwKSByZXR1cm4gZmFsc2U7XG5cdFx0XHRcdFx0dmFyIG5hdGlvbiA9IHt9O1xuXHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChsaXN0LCBmdW5jdGlvbihuYXQpIHtcblx0XHRcdFx0XHRcdGlmIChuYXQuaXNvID09IGlzbykge1xuXHRcdFx0XHRcdFx0XHRuYXRpb24gPSBuYXQ7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZXtcblx0XHRcdFx0XHRpZiAodGhpcy5tYXAuZGF0YS5sZW5ndGggPT0gMCkgcmV0dXJuIGZhbHNlO1xuXHRcdFx0XHRcdHZhciBuYXRpb24gPSB7fTtcblx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2godGhpcy5tYXAuZGF0YSwgZnVuY3Rpb24obmF0KSB7XG5cdFx0XHRcdFx0XHRpZiAobmF0LmlzbyA9PSBpc28pIHtcblx0XHRcdFx0XHRcdFx0bmF0aW9uID0gbmF0O1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuIG5hdGlvbjtcblx0XHRcdH0sXG5cdFx0XHRnZXROYXRpb25CeU5hbWU6IGZ1bmN0aW9uKG5hbWUpIHtcblx0XHRcdFx0aWYgKHRoaXMubWFwLmRhdGEubGVuZ3RoID09IDApIHJldHVybiBmYWxzZTtcblx0XHRcdH0sXG5cdFx0XHRwYWludENvdW50cmllczogZnVuY3Rpb24oc3R5bGUsIGNsaWNrLCBtdXRleCkge1xuXHRcdFx0XHR2YXIgdGhhdCA9IHRoaXM7XG5cblx0XHRcdFx0JHRpbWVvdXQoZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0aWYgKHR5cGVvZiBzdHlsZSAhPSBcInVuZGVmaW5lZFwiICYmIHN0eWxlICE9IG51bGwpIHtcblx0XHRcdFx0XHRcdHRoYXQuZGF0YS5sYXllci5zZXRTdHlsZShzdHlsZSk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHRoYXQuZGF0YS5sYXllci5zZXRTdHlsZSh0aGF0Lm1hcC5zdHlsZSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmICh0eXBlb2YgY2xpY2sgIT0gXCJ1bmRlZmluZWRcIikge1xuXHRcdFx0XHRcdFx0dGhhdC5kYXRhLmxheWVyLm9wdGlvbnMub25DbGljayA9IGNsaWNrXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHRoYXQuZGF0YS5sYXllci5yZWRyYXcoKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9LFxuXHRcdFx0cmVzZXRTZWxlY3RlZDogZnVuY3Rpb24oaXNvKXtcblx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKHRoaXMuZGF0YS5sYXllci5sYXllcnNbdGhpcy5kYXRhLm5hbWUrJ19nZW9tJ10uZmVhdHVyZXMsIGZ1bmN0aW9uKGZlYXR1cmUsIGtleSl7XG5cdFx0XHRcdFx0aWYoa2V5ICE9IGlzbylcblx0XHRcdFx0XHRmZWF0dXJlLnNlbGVjdGVkID0gZmFsc2U7XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHR0aGlzLnJlZHJhdygpO1xuXHRcdFx0fSxcblx0XHRcdHNldFNlbGVjdGVkRmVhdHVyZTpmdW5jdGlvbihpc28sIHNlbGVjdGVkKXtcblx0XHRcdFx0dGhpcy5kYXRhLmxheWVyLmxheWVyc1t0aGlzLmRhdGEubmFtZSsnX2dlb20nXS5mZWF0dXJlc1tpc29dLnNlbGVjdGVkID0gc2VsZWN0ZWQ7XG5cdFx0XHR9LFxuXHRcdFx0cmVkcmF3OmZ1bmN0aW9uKCl7XG5cdFx0XHRcdHRoaXMuZGF0YS5sYXllci5yZWRyYXcoKTtcblx0XHRcdH0sXG5cdFx0XHQvL0ZVTEwgVE8gRE9cblx0XHRcdGNvdW50cmllc1N0eWxlOiBmdW5jdGlvbihmZWF0dXJlKSB7XG5cdFx0XHRcdGRlYnVnZ2VyO1xuXHRcdFx0XHR2YXIgc3R5bGUgPSB7fTtcblx0XHRcdFx0dmFyIGlzbyA9IGZlYXR1cmUucHJvcGVydGllc1t0aGF0LmRhdGEuaXNvMl07XG5cdFx0XHRcdHZhciBuYXRpb24gPSB0aGF0LmdldE5hdGlvbkJ5SXNvKGlzbyk7XG5cdFx0XHRcdHZhciBmaWVsZCA9IHRoYXQuZGF0YS5maWVsZDtcblx0XHRcdFx0dmFyIHR5cGUgPSBmZWF0dXJlLnR5cGU7XG5cdFx0XHRcdGZlYXR1cmUuc2VsZWN0ZWQgPSBmYWxzZTtcblxuXHRcdFx0XHRzd2l0Y2ggKHR5cGUpIHtcblx0XHRcdFx0XHRjYXNlIDM6IC8vJ1BvbHlnb24nXG5cdFx0XHRcdFx0XHRpZiAodHlwZW9mIG5hdGlvbltmaWVsZF0gIT0gXCJ1bmRlZmluZWRcIiAmJiBuYXRpb25bZmllbGRdICE9IG51bGwpe1xuXHRcdFx0XHRcdFx0XHR2YXIgbGluZWFyU2NhbGUgPSBkMy5zY2FsZS5saW5lYXIoKS5kb21haW4oW3ZtLnJhbmdlLm1pbix2bS5yYW5nZS5tYXhdKS5yYW5nZShbMCwyNTZdKTtcblxuXHRcdFx0XHRcdFx0XHR2YXIgY29sb3JQb3MgPSAgcGFyc2VJbnQobGluZWFyU2NhbGUocGFyc2VGbG9hdChuYXRpb25bZmllbGRdKSkpICogNDsvLyBwYXJzZUludCgyNTYgLyB2bS5yYW5nZS5tYXggKiBwYXJzZUludChuYXRpb25bZmllbGRdKSkgKiA0O1xuXHRcdFx0XHRcdFx0XHRjb25zb2xlLmxvZyhjb2xvclBvcywgaXNvLG5hdGlvbik7XG5cdFx0XHRcdFx0XHRcdHZhciBjb2xvciA9ICdyZ2JhKCcgKyB0aGF0LnBhbGV0dGVbY29sb3JQb3NdICsgJywgJyArIHRoYXQucGFsZXR0ZVtjb2xvclBvcyArIDFdICsgJywgJyArIHRoYXQucGFsZXR0ZVtjb2xvclBvcyArIDJdICsgJywnICsgdGhhdC5wYWxldHRlW2NvbG9yUG9zICsgM10gKyAnKSc7XG5cdFx0XHRcdFx0XHRcdHN0eWxlLmNvbG9yID0gJ3JnYmEoJyArIHRoYXQucGFsZXR0ZVtjb2xvclBvc10gKyAnLCAnICsgdGhhdC5wYWxldHRlW2NvbG9yUG9zICsgMV0gKyAnLCAnICsgdGhhdC5wYWxldHRlW2NvbG9yUG9zICsgMl0gKyAnLDAuNiknOyAvL2NvbG9yO1xuXHRcdFx0XHRcdFx0XHRzdHlsZS5vdXRsaW5lID0ge1xuXHRcdFx0XHRcdFx0XHRcdGNvbG9yOiBjb2xvcixcblx0XHRcdFx0XHRcdFx0XHRzaXplOiAxXG5cdFx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0XHRcdHN0eWxlLnNlbGVjdGVkID0ge1xuXHRcdFx0XHRcdFx0XHRcdGNvbG9yOiAncmdiYSgnICsgdGhhdC5wYWxldHRlW2NvbG9yUG9zXSArICcsICcgKyB0aGF0LnBhbGV0dGVbY29sb3JQb3MgKyAxXSArICcsICcgKyB0aGF0LnBhbGV0dGVbY29sb3JQb3MgKyAyXSArICcsMC4zKScsXG5cdFx0XHRcdFx0XHRcdFx0b3V0bGluZToge1xuXHRcdFx0XHRcdFx0XHRcdFx0Y29sb3I6ICdyZ2JhKDY2LDY2LDY2LDAuOSknLFxuXHRcdFx0XHRcdFx0XHRcdFx0c2l6ZTogMlxuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fTtcblxuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0c3R5bGUuY29sb3IgPSAncmdiYSgyNTUsMjU1LDI1NSwwKSc7XG5cdFx0XHRcdFx0XHRcdHN0eWxlLm91dGxpbmUgPSB7XG5cdFx0XHRcdFx0XHRcdFx0Y29sb3I6ICdyZ2JhKDI1NSwyNTUsMjU1LDApJyxcblx0XHRcdFx0XHRcdFx0XHRzaXplOiAxXG5cdFx0XHRcdFx0XHRcdH07XG5cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHN0eWxlO1xuXHRcdFx0fVxuXG5cdFx0fVxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0NvbmZsaWN0SW1wb3J0Q3RybCcsIGZ1bmN0aW9uKFJlc3Rhbmd1bGFyLCB0b2FzdHIsICRzdGF0ZSkge1xuXHRcdC8vXG5cdFx0dmFyIHZtID0gdGhpcztcblx0XHR2bS5uYXRpb25zID0gW107XG5cdFx0dm0uZXZlbnRzID0gW107XG5cdFx0dm0uc3VtID0gMDtcblxuXHRcdHZtLnNhdmVUb0RiID0gc2F2ZVRvRGI7XG5cblx0XHRmdW5jdGlvbiBzYXZlVG9EYigpIHtcblx0XHRcdHZhciBkYXRhID0ge1xuXHRcdFx0XHRuYXRpb25zOiB2bS5uYXRpb25zLFxuXHRcdFx0XHRldmVudHM6IHZtLmV2ZW50c1xuXHRcdFx0fTtcblx0XHRcdFJlc3Rhbmd1bGFyLmFsbCgnL2NvbmZsaWN0cy9pbXBvcnQnKS5wb3N0KGRhdGEpLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuXHRcdFx0XHQkc3RhdGUuZ28oJ2FwcC5jb25mbGljdC5pbmRleCcpXG5cdFx0XHR9KTtcblx0XHR9XG5cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdDb25mbGljdGRldGFpbHNDdHJsJywgZnVuY3Rpb24oJHRpbWVvdXQsICRyb290U2NvcGUsIFZlY3RvcmxheWVyU2VydmljZSwgY29uZmxpY3Qpe1xuICAgICAgICAvL1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuICAgICAgICB2bS5jb25mbGljdCA9IGNvbmZsaWN0O1xuICAgICAgICB2bS5zaG93Q291bnRyaWVzID0gZmFsc2U7XG4gICAgICAgIHZtLmdldFRlbmRlbmN5ID0gZ2V0VGVuZGVuY3k7XG4gICAgICAgIHZtLmxpbmVhclNjYWxlID0gZDMuc2NhbGUubGluZWFyKCkuZG9tYWluKFswLCA1XSkucmFuZ2UoWzAsIDI1Nl0pO1xuICAgICAgICB2bS5jb2xvcnMgPSBbJyNkNGViZjcnLCAnIzg3Y2NlYicsICcjMzZhOGM2JywgJyMyNjgzOTknLCAnIzBlNjM3NyddO1xuICAgICAgICB2bS5yZWxhdGlvbnMgPSBbXTtcbiAgICAgICAgdm0uY291bnRyaWVzID0gW107XG4gICAgICAgIHZtLnNob3dDb3VudHJpZXNCdXR0b24gPSBzaG93Q291bnRyaWVzQnV0dG9uO1xuICAgICAgICB2bS5jaXJjbGVPcHRpb25zID0ge1xuICAgICAgICAgIGNvbG9yOiAnIzRmYjBlNScsXG4gICAgICAgICAgZmllbGQ6ICdpbnQyMDE1JyxcbiAgICAgICAgICBzaXplOiA1LFxuICAgICAgICAgIGhpZGVOdW1iZXJpbmc6IHRydWVcbiAgICAgICAgfTtcblxuICAgICAgICBhY3RpdmF0ZSgpO1xuXG4gICAgXHRcdGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xuICAgIFx0XHRcdFZlY3RvcmxheWVyU2VydmljZS5zZXREYXRhKHZtLmNvbmZsaWN0Lm5hdGlvbnMsIHZtLmNvbG9ycywgdHJ1ZSk7XG4gICAgXHRcdFx0VmVjdG9ybGF5ZXJTZXJ2aWNlLnNldFN0eWxlKGludmVydGVkU3R5bGUpO1xuICAgIFx0XHRcdFZlY3RvcmxheWVyU2VydmljZS5jb3VudHJ5Q2xpY2soY291bnRyeUNsaWNrKTtcbiAgICBcdFx0XHQkdGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAvL1ZlY3RvcmxheWVyU2VydmljZS5zZXRTZWxlY3RlZEZlYXR1cmUodm0ubmF0aW9uLmlzbywgdHJ1ZSk7XG5cbiAgICBcdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLmNvbmZsaWN0Lm5hdGlvbnMsIGZ1bmN0aW9uIChuYXRpb24pIHtcbiAgICBcdFx0XHRcdFx0XHR2YXIgaSA9IHZtLnJlbGF0aW9ucy5pbmRleE9mKG5hdGlvbi5pc28pO1xuICAgIFx0XHRcdFx0XHRcdGlmIChpID09IC0xICkge1xuICAgIFx0XHRcdFx0XHRcdFx0dm0ucmVsYXRpb25zLnB1c2gobmF0aW9uLmlzbylcbiAgICAgICAgICAgICAgICAgIHZtLmNvdW50cmllcy5wdXNoKG5hdGlvbik7XG4gICAgXHRcdFx0XHRcdFx0XHRWZWN0b3JsYXllclNlcnZpY2Uuc2V0U2VsZWN0ZWRGZWF0dXJlKG5hdGlvbi5pc28sIHRydWUpO1xuICAgIFx0XHRcdFx0XHRcdH1cbiAgICBcdFx0XHRcdFx0fSk7XG5cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHZtLmNvdW50cmllcyk7XG4gICAgXHRcdFx0XHQkcm9vdFNjb3BlLmdyZXllZCA9IHRydWU7XG4gICAgXHRcdFx0XHRWZWN0b3JsYXllclNlcnZpY2UucGFpbnRDb3VudHJpZXMoaW52ZXJ0ZWRTdHlsZSk7XG4gICAgXHRcdFx0XHQvKkRhdGFTZXJ2aWNlLmdldE9uZSgnY291bnRyaWVzL2Jib3gnLCB2bS5yZWxhdGlvbnMpLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcbiAgICBcdFx0XHRcdFx0dmFyIHNvdXRoV2VzdCA9IEwubGF0TG5nKGRhdGEuY29vcmRpbmF0ZXNbMF1bMF1bMV0sIGRhdGEuY29vcmRpbmF0ZXNbMF1bMF1bMF0pLFxuICAgIFx0XHRcdFx0XHRcdG5vcnRoRWFzdCA9IEwubGF0TG5nKGRhdGEuY29vcmRpbmF0ZXNbMF1bMl1bMV0sIGRhdGEuY29vcmRpbmF0ZXNbMF1bMl1bMF0pLFxuICAgIFx0XHRcdFx0XHRcdGJvdW5kcyA9IEwubGF0TG5nQm91bmRzKHNvdXRoV2VzdCwgbm9ydGhFYXN0KTtcblxuICAgIFx0XHRcdFx0XHR2YXIgcGFkID0gW1xuICAgIFx0XHRcdFx0XHRcdFswLCAwXSxcbiAgICBcdFx0XHRcdFx0XHRbNTAsIDUwXVxuICAgIFx0XHRcdFx0XHRdO1xuXG4gICAgXHRcdFx0XHRcdFZlY3RvcmxheWVyU2VydmljZS5tYXBMYXllci5maXRCb3VuZHMoYm91bmRzLCB7XG4gICAgXHRcdFx0XHRcdFx0cGFkZGluZzogcGFkWzFdLFxuICAgIFx0XHRcdFx0XHRcdG1heFpvb206IDRcbiAgICBcdFx0XHRcdFx0fSk7XG4gICAgXHRcdFx0XHR9KTsqL1xuICAgIFx0XHRcdH0pO1xuXG4gICAgXHRcdH1cbiAgICAgICAgZnVuY3Rpb24gY291bnRyeUNsaWNrKGV2dCwgdCkge1xuXG4gICAgXHRcdFx0dmFyIGNvdW50cnkgPSBWZWN0b3JsYXllclNlcnZpY2UuZ2V0TmF0aW9uQnlJc28oZXZ0LmZlYXR1cmUucHJvcGVydGllc1snaXNvX2EyJ10pO1xuICAgIFx0XHRcdGlmICh0eXBlb2YgY291bnRyeVsnaW50ZW5zaXR5J10gIT0gXCJ1bmRlZmluZWRcIikge1xuICAgIFx0XHRcdFx0VmVjdG9ybGF5ZXJTZXJ2aWNlLnJlc2V0U2VsZWN0ZWQoY291bnRyeS5pc28pO1xuICAgIFx0XHRcdFx0JHN0YXRlLmdvKCdhcHAuY29uZmxpY3QuaW5kZXgubmF0aW9uJywge1xuICAgIFx0XHRcdFx0XHRpc286IGNvdW50cnkuaXNvXG4gICAgXHRcdFx0XHR9KTtcbiAgICBcdFx0XHR9XG4gICAgXHRcdH1cblxuICAgIFx0XHRmdW5jdGlvbiBpbnZlcnRlZFN0eWxlKGZlYXR1cmUpIHtcbiAgICBcdFx0XHR2YXIgc3R5bGUgPSB7fTtcbiAgICBcdFx0XHR2YXIgaXNvID0gZmVhdHVyZS5wcm9wZXJ0aWVzW1ZlY3RvcmxheWVyU2VydmljZS5kYXRhLmlzbzJdO1xuICAgIFx0XHRcdHZhciBuYXRpb24gPSBWZWN0b3JsYXllclNlcnZpY2UuZ2V0TmF0aW9uQnlJc28oaXNvKTtcbiAgICBcdFx0XHR2YXIgZmllbGQgPSAnaW50ZW5zaXR5JztcbiAgICBcdFx0XHR2YXIgY29sb3JQb3MgPSBwYXJzZUludCh2bS5saW5lYXJTY2FsZShwYXJzZUZsb2F0KG5hdGlvbltmaWVsZF0pKSkgKiA0OyAvLyBwYXJzZUludCgyNTYgLyB2bS5yYW5nZS5tYXggKiBwYXJzZUludChuYXRpb25bZmllbGRdKSkgKiA0O1xuXG4gICAgXHRcdFx0dmFyIGNvbG9yID0gJ3JnYmEoJyArIFZlY3RvcmxheWVyU2VydmljZS5wYWxldHRlW2NvbG9yUG9zXSArICcsICcgKyBWZWN0b3JsYXllclNlcnZpY2UucGFsZXR0ZVtjb2xvclBvcyArIDFdICsgJywgJyArIFZlY3RvcmxheWVyU2VydmljZS5wYWxldHRlW2NvbG9yUG9zICsgMl0gKyAnLCcgKyBWZWN0b3JsYXllclNlcnZpY2UucGFsZXR0ZVtjb2xvclBvcyArIDNdICsgJyknO1xuICAgIFx0XHRcdHN0eWxlLmNvbG9yID0gJ3JnYmEoMCwwLDAsMCknO1xuICAgIFx0XHRcdHN0eWxlLm91dGxpbmUgPSB7XG4gICAgXHRcdFx0XHRjb2xvcjogJ3JnYmEoMCwwLDAsMCknLFxuICAgIFx0XHRcdFx0c2l6ZTogMFxuICAgIFx0XHRcdH07XG4gICAgXHRcdFx0c3R5bGUuc2VsZWN0ZWQgPSB7XG4gICAgXHRcdFx0XHRjb2xvcjogY29sb3IsXG4gICAgXHRcdFx0XHRvdXRsaW5lOiB7XG4gICAgXHRcdFx0XHRcdGNvbG9yOiAncmdiYSgwLDAsMCwwLjMpJyxcbiAgICBcdFx0XHRcdFx0c2l6ZTogMVxuICAgIFx0XHRcdFx0fVxuICAgIFx0XHRcdH07XG4gICAgXHRcdFx0cmV0dXJuIHN0eWxlO1xuICAgIFx0XHR9XG4gICAgICAgIGZ1bmN0aW9uIGdldFRlbmRlbmN5KCl7XG4gICAgICAgICAgaWYodm0uY29uZmxpY3QgPT0gbnVsbCkgcmV0dXJuIFwiY2FjaGVkXCI7XG4gICAgICAgICAgaWYodm0uY29uZmxpY3QuaW50MjAxNSA9PSB2bS5jb25mbGljdC5pbnQyMDE0KVxuICAgICAgICAgIHJldHVybiBcImNhY2hlZFwiO1xuICAgICAgICAgIGlmKHZtLmNvbmZsaWN0LmludDIwMTUgPCB2bS5jb25mbGljdC5pbnQyMDE0KVxuICAgICAgICAgIHJldHVybiBcImFycm93X2Ryb3BfZG93blwiO1xuXG4gICAgICAgICAgcmV0dXJuIFwiYXJyb3dfZHJvcF91cFwiO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIHNob3dDb3VudHJpZXNCdXR0b24oKXtcbiAgICAgICAgICBpZih2bS5zaG93Q291bnRyaWVzKSByZXR1cm4gXCJhcnJvd19kcm9wX3VwXCI7XG4gICAgICAgICAgcmV0dXJuIFwiYXJyb3dfZHJvcF9kb3duXCI7XG4gICAgICAgIH1cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0NvbmZsaWN0aXRlbXNDdHJsJywgZnVuY3Rpb24oKXtcbiAgICAgICAgLy9cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdDb25mbGljdG5hdGlvbkN0cmwnLCBmdW5jdGlvbiAoJHRpbWVvdXQsICRzdGF0ZSwgJHJvb3RTY29wZSwgY29uZmxpY3RzLCBuYXRpb24sIFZlY3RvcmxheWVyU2VydmljZSwgRGF0YVNlcnZpY2UpIHtcblx0XHQvL1xuXHRcdHZhciB2bSA9IHRoaXM7XG5cdFx0dm0ubmF0aW9uID0gbmF0aW9uO1xuXHRcdHZtLmNvbmZsaWN0cyA9IGNvbmZsaWN0cztcblx0XHR2bS5saW5lYXJTY2FsZSA9IGQzLnNjYWxlLmxpbmVhcigpLmRvbWFpbihbMCwgNV0pLnJhbmdlKFswLCAyNTZdKTtcblx0XHR2bS5jb2xvcnMgPSBbJyNkNGViZjcnLCAnIzg3Y2NlYicsICcjMzZhOGM2JywgJyMyNjgzOTknLCAnIzBlNjM3NyddO1xuXHRcdHZtLnJlbGF0aW9ucyA9IFtdO1xuICAgIHZtLmNvbmZsaWN0ID0gbnVsbDtcbiAgICB2bS5nZXRUZW5kZW5jeSA9IGdldFRlbmRlbmN5O1xuICAgIHZtLmNpcmNsZU9wdGlvbnMgPSB7XG4gICAgICBjb2xvcjogJyM0ZmIwZTUnLFxuICAgICAgZmllbGQ6ICdpbnRlbnNpdHknLFxuICAgICAgc2l6ZTogNSxcbiAgICAgIGhpZGVOdW1iZXJpbmc6IHRydWVcbiAgICB9O1xuXHRcdGFjdGl2YXRlKCk7XG5cblx0XHRmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcblx0XHRcdFZlY3RvcmxheWVyU2VydmljZS5zZXREYXRhKHZtLmNvbmZsaWN0cywgdm0uY29sb3JzLCB0cnVlKTtcblx0XHRcdFZlY3RvcmxheWVyU2VydmljZS5zZXRTdHlsZShpbnZlcnRlZFN0eWxlKTtcblx0XHRcdFZlY3RvcmxheWVyU2VydmljZS5jb3VudHJ5Q2xpY2soY291bnRyeUNsaWNrKTtcblx0XHRcdCR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdm0ucmVsYXRpb25zLnB1c2godm0ubmF0aW9uLmlzbyk7XG4gICAgICAgIFZlY3RvcmxheWVyU2VydmljZS5zZXRTZWxlY3RlZEZlYXR1cmUodm0ubmF0aW9uLmlzbywgdHJ1ZSk7XG5cdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5uYXRpb24uY29uZmxpY3RzLCBmdW5jdGlvbiAoY29uZmxpY3QpIHtcbiAgICAgICAgICBpZighdm0uY29uZmxpY3QpIHZtLmNvbmZsaWN0ID0gY29uZmxpY3Q7XG4gICAgICAgICAgaWYoY29uZmxpY3QuaW50MjAxNSA+IHZtLmNvbmZsaWN0LmludDIwMTUpe1xuICAgICAgICAgICAgdm0uY29uZmxpY3QgPSBjb25mbGljdDtcbiAgICAgICAgICB9XG5cdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKGNvbmZsaWN0Lm5hdGlvbnMsIGZ1bmN0aW9uIChuYXRpb24pIHtcblx0XHRcdFx0XHRcdHZhciBpID0gdm0ucmVsYXRpb25zLmluZGV4T2YobmF0aW9uLmlzbyk7XG5cdFx0XHRcdFx0XHRpZiAoaSA9PSAtMSAmJiBuYXRpb24uaXNvICE9IHZtLm5hdGlvbi5pc28pIHtcblx0XHRcdFx0XHRcdFx0dm0ucmVsYXRpb25zLnB1c2gobmF0aW9uLmlzbylcblx0XHRcdFx0XHRcdFx0VmVjdG9ybGF5ZXJTZXJ2aWNlLnNldFNlbGVjdGVkRmVhdHVyZShuYXRpb24uaXNvLCB0cnVlKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fSk7XG5cdFx0XHRcdCRyb290U2NvcGUuZ3JleWVkID0gdHJ1ZTtcblx0XHRcdFx0VmVjdG9ybGF5ZXJTZXJ2aWNlLnBhaW50Q291bnRyaWVzKGludmVydGVkU3R5bGUpO1xuXHRcdFx0XHQvKkRhdGFTZXJ2aWNlLmdldE9uZSgnY291bnRyaWVzL2Jib3gnLCB2bS5yZWxhdGlvbnMpLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcblx0XHRcdFx0XHR2YXIgc291dGhXZXN0ID0gTC5sYXRMbmcoZGF0YS5jb29yZGluYXRlc1swXVswXVsxXSwgZGF0YS5jb29yZGluYXRlc1swXVswXVswXSksXG5cdFx0XHRcdFx0XHRub3J0aEVhc3QgPSBMLmxhdExuZyhkYXRhLmNvb3JkaW5hdGVzWzBdWzJdWzFdLCBkYXRhLmNvb3JkaW5hdGVzWzBdWzJdWzBdKSxcblx0XHRcdFx0XHRcdGJvdW5kcyA9IEwubGF0TG5nQm91bmRzKHNvdXRoV2VzdCwgbm9ydGhFYXN0KTtcblxuXHRcdFx0XHRcdHZhciBwYWQgPSBbXG5cdFx0XHRcdFx0XHRbMCwgMF0sXG5cdFx0XHRcdFx0XHRbNTAsIDUwXVxuXHRcdFx0XHRcdF07XG5cblx0XHRcdFx0XHRWZWN0b3JsYXllclNlcnZpY2UubWFwTGF5ZXIuZml0Qm91bmRzKGJvdW5kcywge1xuXHRcdFx0XHRcdFx0cGFkZGluZzogcGFkWzFdLFxuXHRcdFx0XHRcdFx0bWF4Wm9vbTogNFxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9KTsqL1xuXHRcdFx0fSk7XG5cblx0XHR9XG4gICAgZnVuY3Rpb24gZ2V0VGVuZGVuY3koKXtcbiAgICAgIGlmKHZtLmNvbmZsaWN0ID09IG51bGwpIHJldHVybiBcImNhY2hlZFwiO1xuICAgICAgaWYodm0uY29uZmxpY3QuaW50MjAxNSA9PSB2bS5jb25mbGljdC5pbnQyMDE0KVxuICAgICAgcmV0dXJuIFwiY2FjaGVkXCI7XG4gICAgICBpZih2bS5jb25mbGljdC5pbnQyMDE1IDwgdm0uY29uZmxpY3QuaW50MjAxNClcbiAgICAgIHJldHVybiBcImFycm93X2Ryb3BfZG93blwiO1xuXG4gICAgICByZXR1cm4gXCJhcnJvd19kcm9wX3VwXCI7XG4gICAgfVxuXHRcdGZ1bmN0aW9uIGNvdW50cnlDbGljayhldnQsIHQpIHtcblxuXHRcdFx0dmFyIGNvdW50cnkgPSBWZWN0b3JsYXllclNlcnZpY2UuZ2V0TmF0aW9uQnlJc28oZXZ0LmZlYXR1cmUucHJvcGVydGllc1snaXNvX2EyJ10pO1xuXHRcdFx0aWYgKHR5cGVvZiBjb3VudHJ5WydpbnRlbnNpdHknXSAhPSBcInVuZGVmaW5lZFwiKSB7XG5cdFx0XHRcdFZlY3RvcmxheWVyU2VydmljZS5yZXNldFNlbGVjdGVkKGNvdW50cnkuaXNvKTtcblx0XHRcdFx0JHN0YXRlLmdvKCdhcHAuY29uZmxpY3QuaW5kZXgubmF0aW9uJywge1xuXHRcdFx0XHRcdGlzbzogY291bnRyeS5pc29cblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gaW52ZXJ0ZWRTdHlsZShmZWF0dXJlKSB7XG5cdFx0XHR2YXIgc3R5bGUgPSB7fTtcblx0XHRcdHZhciBpc28gPSBmZWF0dXJlLnByb3BlcnRpZXNbVmVjdG9ybGF5ZXJTZXJ2aWNlLmRhdGEuaXNvMl07XG5cdFx0XHR2YXIgbmF0aW9uID0gVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldE5hdGlvbkJ5SXNvKGlzbyk7XG5cdFx0XHR2YXIgZmllbGQgPSAnaW50ZW5zaXR5Jztcblx0XHRcdHZhciBjb2xvclBvcyA9IHBhcnNlSW50KHZtLmxpbmVhclNjYWxlKHBhcnNlRmxvYXQobmF0aW9uW2ZpZWxkXSkpKSAqIDQ7IC8vIHBhcnNlSW50KDI1NiAvIHZtLnJhbmdlLm1heCAqIHBhcnNlSW50KG5hdGlvbltmaWVsZF0pKSAqIDQ7XG5cblx0XHRcdHZhciBjb2xvciA9ICdyZ2JhKCcgKyBWZWN0b3JsYXllclNlcnZpY2UucGFsZXR0ZVtjb2xvclBvc10gKyAnLCAnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLnBhbGV0dGVbY29sb3JQb3MgKyAxXSArICcsICcgKyBWZWN0b3JsYXllclNlcnZpY2UucGFsZXR0ZVtjb2xvclBvcyArIDJdICsgJywnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLnBhbGV0dGVbY29sb3JQb3MgKyAzXSArICcpJztcblx0XHRcdHN0eWxlLmNvbG9yID0gJ3JnYmEoMCwwLDAsMCknO1xuXHRcdFx0c3R5bGUub3V0bGluZSA9IHtcblx0XHRcdFx0Y29sb3I6ICdyZ2JhKDAsMCwwLDApJyxcblx0XHRcdFx0c2l6ZTogMFxuXHRcdFx0fTtcblx0XHRcdHN0eWxlLnNlbGVjdGVkID0ge1xuXHRcdFx0XHRjb2xvcjogY29sb3IsXG5cdFx0XHRcdG91dGxpbmU6IHtcblx0XHRcdFx0XHRjb2xvcjogJ3JnYmEoMCwwLDAsMC4zKScsXG5cdFx0XHRcdFx0c2l6ZTogMVxuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXHRcdFx0cmV0dXJuIHN0eWxlO1xuXHRcdH1cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignQ29uZmxpY3RzQ3RybCcsIGZ1bmN0aW9uICgkdGltZW91dCwkc3RhdGUsICRyb290U2NvcGUsICRzY29wZSwgY29uZmxpY3RzLCBWZWN0b3JsYXllclNlcnZpY2UsIFJlc3Rhbmd1bGFyKSB7XG5cdFx0Ly9cblxuXHRcdHZhciB2bSA9IHRoaXM7XG5cdFx0dm0ucmVhZHkgPSBmYWxzZTtcblx0XHR2bS5jb25mbGljdHMgPSBjb25mbGljdHM7XG5cdFx0dm0ucmVsYXRpb25zID0gW107XG5cdFx0dm0ubGluZWFyU2NhbGUgPSBkMy5zY2FsZS5saW5lYXIoKS5kb21haW4oWzAsIDVdKS5yYW5nZShbMCwgMjU2XSk7XG5cdFx0dm0uY29sb3JzID0gWycjZDRlYmY3JywgJyM4N2NjZWInLCAnIzM2YThjNicsICcjMjY4Mzk5JywgJyMwZTYzNzcnXTtcblx0XHR2bS50eXBlc0NvbG9ycyA9IHtcblx0XHRcdGludGVyc3RhdGU6ICcjNjlkNGMzJyxcblx0XHRcdGludHJhc3RhdGU6ICcjYjdiN2I3Jyxcblx0XHRcdHN1YnN0YXRlOiAnI2ZmOWQyNydcblx0XHR9O1xuXHRcdHZtLmFjdGl2ZSA9IHtcblx0XHRcdGNvbmZsaWN0OiAnJyxcblx0XHRcdHRweWU6ICcnXG5cdFx0fTtcblx0XHR2bS5jb25mbGljdENvdW50ID0gMDtcblx0XHR2bS5jb25mbGljdEludGVuc2l0aWVzID0ge1xuXHRcdFx0dmVyeUxvdzogMCxcblx0XHRcdGxvdzogMCxcblx0XHRcdG1pZDogMCxcblx0XHRcdGhpZ2g6IDAsXG5cdFx0XHR2ZXJ5SGlnaDogMFxuXHRcdH07XG5cdFx0dm0uY2hhcnREYXRhID0gW3tcblx0XHRcdGxhYmVsOiAxLFxuXHRcdFx0dmFsdWU6IDAsXG5cdFx0XHRjb2xvcjogdm0uY29sb3JzWzBdXG5cdFx0fSwge1xuXHRcdFx0bGFiZWw6IDIsXG5cdFx0XHR2YWx1ZTogMCxcblx0XHRcdGNvbG9yOiB2bS5jb2xvcnNbMV1cblx0XHR9LCB7XG5cdFx0XHRsYWJlbDogMyxcblx0XHRcdHZhbHVlOiAwLFxuXHRcdFx0Y29sb3I6IHZtLmNvbG9yc1syXVxuXHRcdH0sIHtcblx0XHRcdGxhYmVsOiA0LFxuXHRcdFx0dmFsdWU6IDAsXG5cdFx0XHRjb2xvcjogdm0uY29sb3JzWzNdXG5cdFx0fSwge1xuXHRcdFx0bGFiZWw6IDUsXG5cdFx0XHR2YWx1ZTogMCxcblx0XHRcdGNvbG9yOiB2bS5jb2xvcnNbNF1cblx0XHR9XTtcblxuXHRcdHZtLmNvbmZsaWN0VHlwZXMgPSBbe1xuXHRcdFx0dHlwZTogJ2ludGVyc3RhdGUnLFxuXHRcdFx0Y29sb3I6ICcjNjlkNGMzJyxcblx0XHRcdGNvdW50OiAwXG5cdFx0fSwge1xuXHRcdFx0dHlwZTogJ2ludHJhc3RhdGUnLFxuXHRcdFx0Y291bnQ6IDAsXG5cdFx0XHRjb2xvcjogJyNiN2I3YjcnXG5cdFx0fSwge1xuXHRcdFx0dHlwZTogJ3N1YnN0YXRlJyxcblx0XHRcdGNvdW50OiAwLFxuXHRcdFx0Y29sb3I6ICcjZmY5ZDI3J1xuXHRcdH1dO1xuXG5cdFx0YWN0aXZhdGUoKTtcblxuXHRcdGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xuXHRcdFx0VmVjdG9ybGF5ZXJTZXJ2aWNlLnNldFN0eWxlKGNvdW50cmllc1N0eWxlKTtcblx0XHRcdFZlY3RvcmxheWVyU2VydmljZS5jb3VudHJ5Q2xpY2soY291bnRyeUNsaWNrKTtcblx0XHRcdFZlY3RvcmxheWVyU2VydmljZS5zZXREYXRhKHZtLmNvbmZsaWN0cywgdm0uY29sb3JzLCB0cnVlKTtcblx0XHRcdC8vXHQkdGltZW91dChmdW5jdGlvbigpIHtcblx0XHRcdGNhbGNJbnRlbnNpdGllcygpO1xuXHRcdFx0Ly99KTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBjYWxjSW50ZW5zaXRpZXMoKSB7XG5cdFx0XHRhbmd1bGFyLmZvckVhY2godm0uY29uZmxpY3RzLCBmdW5jdGlvbiAobmF0aW9uKSB7XG5cblx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKG5hdGlvbi5jb25mbGljdHMsIGZ1bmN0aW9uIChjb25mbGljdCkge1xuXHRcdFx0XHRcdHZtLmNvbmZsaWN0Q291bnQrKztcblx0XHRcdFx0XHRzd2l0Y2ggKGNvbmZsaWN0LnR5cGVfaWQpIHtcblx0XHRcdFx0XHRjYXNlIDE6XG5cdFx0XHRcdFx0XHR2bS5jb25mbGljdFR5cGVzWzBdLmNvdW50Kys7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlIDI6XG5cdFx0XHRcdFx0XHR2bS5jb25mbGljdFR5cGVzWzFdLmNvdW50Kys7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlIDM6XG5cdFx0XHRcdFx0XHR2bS5jb25mbGljdFR5cGVzWzJdLmNvdW50Kys7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRkZWZhdWx0OlxuXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHN3aXRjaCAoY29uZmxpY3QuaW50MjAxNSkge1xuXHRcdFx0XHRcdGNhc2UgMTpcblx0XHRcdFx0XHRcdHZtLmNvbmZsaWN0SW50ZW5zaXRpZXMudmVyeUxvdysrO1xuXHRcdFx0XHRcdFx0dm0uY2hhcnREYXRhWzBdLnZhbHVlKys7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlIDI6XG5cdFx0XHRcdFx0XHR2bS5jb25mbGljdEludGVuc2l0aWVzLmxvdysrO1xuXHRcdFx0XHRcdFx0dm0uY2hhcnREYXRhWzFdLnZhbHVlKys7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlIDM6XG5cdFx0XHRcdFx0XHR2bS5jb25mbGljdEludGVuc2l0aWVzLm1pZCsrO1xuXHRcdFx0XHRcdFx0dm0uY2hhcnREYXRhWzJdLnZhbHVlKys7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlIDQ6XG5cdFx0XHRcdFx0XHR2bS5jb25mbGljdEludGVuc2l0aWVzLmhpZ2grKztcblx0XHRcdFx0XHRcdHZtLmNoYXJ0RGF0YVszXS52YWx1ZSsrO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSA1OlxuXHRcdFx0XHRcdFx0dm0uY29uZmxpY3RJbnRlbnNpdGllcy52ZXJ5SGlnaCsrO1xuXHRcdFx0XHRcdFx0dm0uY2hhcnREYXRhWzRdLnZhbHVlKys7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSlcblx0XHRcdH0pO1xuXHRcdFx0dm0ucmVhZHkgPSB0cnVlO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGNvdW50cnlDbGljayhldnQsIHQpIHtcblxuXHRcdFx0dmFyIGNvdW50cnkgPSBWZWN0b3JsYXllclNlcnZpY2UuZ2V0TmF0aW9uQnlJc28oZXZ0LmZlYXR1cmUucHJvcGVydGllc1snaXNvX2EyJ10pO1xuXHRcdFx0aWYgKHR5cGVvZiBjb3VudHJ5WydpbnRlbnNpdHknXSAhPSBcInVuZGVmaW5lZFwiKSB7XG5cdFx0XHRcdFZlY3RvcmxheWVyU2VydmljZS5yZXNldFNlbGVjdGVkKGNvdW50cnkuaXNvKTtcblx0XHRcdFx0JHN0YXRlLmdvKCdhcHAuY29uZmxpY3QuaW5kZXgubmF0aW9uJyx7aXNvOmNvdW50cnkuaXNvfSk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIGludmVydGVkU3R5bGUoZmVhdHVyZSl7XG5cdFx0XHR2YXIgc3R5bGUgPSB7fTtcblx0XHRcdHZhciBpc28gPSBmZWF0dXJlLnByb3BlcnRpZXNbVmVjdG9ybGF5ZXJTZXJ2aWNlLmRhdGEuaXNvMl07XG5cdFx0XHR2YXIgbmF0aW9uID0gVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldE5hdGlvbkJ5SXNvKGlzbyk7XG5cdFx0XHR2YXIgZmllbGQgPSAnaW50ZW5zaXR5Jztcblx0XHRcdHZhciBjb2xvclBvcyA9IHBhcnNlSW50KHZtLmxpbmVhclNjYWxlKHBhcnNlRmxvYXQobmF0aW9uW2ZpZWxkXSkpKSAqIDQ7IC8vIHBhcnNlSW50KDI1NiAvIHZtLnJhbmdlLm1heCAqIHBhcnNlSW50KG5hdGlvbltmaWVsZF0pKSAqIDQ7XG5cblx0XHRcdHZhciBjb2xvciA9ICdyZ2JhKCcgKyBWZWN0b3JsYXllclNlcnZpY2UucGFsZXR0ZVtjb2xvclBvc10gKyAnLCAnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLnBhbGV0dGVbY29sb3JQb3MgKyAxXSArICcsICcgKyBWZWN0b3JsYXllclNlcnZpY2UucGFsZXR0ZVtjb2xvclBvcyArIDJdICsgJywnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLnBhbGV0dGVbY29sb3JQb3MgKyAzXSArICcpJztcblx0XHRcdHN0eWxlLmNvbG9yID0gJ3JnYmEoMCwwLDAsMCknO1xuXHRcdFx0c3R5bGUub3V0bGluZSA9IHtcblx0XHRcdFx0Y29sb3I6ICdyZ2JhKDAsMCwwLDApJyxcblx0XHRcdFx0c2l6ZTogMFxuXHRcdFx0fTtcblx0XHRcdHN0eWxlLnNlbGVjdGVkID0ge1xuXHRcdFx0XHRjb2xvcjogY29sb3IsXG5cdFx0XHRcdG91dGxpbmU6IHtcblx0XHRcdFx0XHRjb2xvcjogJ3JnYmEoMCwwLDAsMC4zKScsXG5cdFx0XHRcdFx0c2l6ZTogMVxuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXHRcdFx0cmV0dXJuIHN0eWxlO1xuXHRcdH1cblx0XHRmdW5jdGlvbiBjb3VudHJpZXNTdHlsZShmZWF0dXJlKSB7XG5cdFx0XHR2YXIgc3R5bGUgPSB7fTtcblx0XHRcdHZhciBpc28gPSBmZWF0dXJlLnByb3BlcnRpZXNbVmVjdG9ybGF5ZXJTZXJ2aWNlLmRhdGEuaXNvMl07XG5cdFx0XHR2YXIgbmF0aW9uID0gVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldE5hdGlvbkJ5SXNvKGlzbyk7XG5cblx0XHRcdHZhciBmaWVsZCA9ICdpbnRlbnNpdHknO1xuXHRcdFx0dmFyIHR5cGUgPSBmZWF0dXJlLnR5cGU7XG5cdFx0XHRmZWF0dXJlLnNlbGVjdGVkID0gZmFsc2U7XG5cblx0XHRcdHN3aXRjaCAodHlwZSkge1xuXHRcdFx0Y2FzZSAzOiAvLydQb2x5Z29uJ1xuXHRcdFx0XHRpZiAodHlwZW9mIG5hdGlvbltmaWVsZF0gIT0gXCJ1bmRlZmluZWRcIiAmJiBuYXRpb25bZmllbGRdICE9IG51bGwpIHtcblx0XHRcdFx0XHR2YXIgY29sb3JQb3MgPSBwYXJzZUludCh2bS5saW5lYXJTY2FsZShwYXJzZUZsb2F0KG5hdGlvbltmaWVsZF0pKSkgKiA0OyAvLyBwYXJzZUludCgyNTYgLyB2bS5yYW5nZS5tYXggKiBwYXJzZUludChuYXRpb25bZmllbGRdKSkgKiA0O1xuXHRcdFx0XHRcdHZhciBjb2xvciA9ICdyZ2JhKCcgKyBWZWN0b3JsYXllclNlcnZpY2UucGFsZXR0ZVtjb2xvclBvc10gKyAnLCAnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLnBhbGV0dGVbY29sb3JQb3MgKyAxXSArICcsICcgKyBWZWN0b3JsYXllclNlcnZpY2UucGFsZXR0ZVtjb2xvclBvcyArIDJdICsgJywnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLnBhbGV0dGVbY29sb3JQb3MgKyAzXSArICcpJztcblx0XHRcdFx0XHRcdHN0eWxlLmNvbG9yID0gJ3JnYmEoJyArIFZlY3RvcmxheWVyU2VydmljZS5wYWxldHRlW2NvbG9yUG9zXSArICcsICcgKyBWZWN0b3JsYXllclNlcnZpY2UucGFsZXR0ZVtjb2xvclBvcyArIDFdICsgJywgJyArIFZlY3RvcmxheWVyU2VydmljZS5wYWxldHRlW2NvbG9yUG9zICsgMl0gKyAnLDAuNiknOyAvL2NvbG9yO1xuXHRcdFx0XHRcdFx0c3R5bGUub3V0bGluZSA9IHtcblx0XHRcdFx0XHRcdFx0Y29sb3I6IGNvbG9yLFxuXHRcdFx0XHRcdFx0XHRzaXplOiAxXG5cdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdHN0eWxlLnNlbGVjdGVkID0ge1xuXHRcdFx0XHRcdFx0Y29sb3I6ICdyZ2JhKCcgKyBWZWN0b3JsYXllclNlcnZpY2UucGFsZXR0ZVtjb2xvclBvc10gKyAnLCAnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLnBhbGV0dGVbY29sb3JQb3MgKyAxXSArICcsICcgKyBWZWN0b3JsYXllclNlcnZpY2UucGFsZXR0ZVtjb2xvclBvcyArIDJdICsgJywnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLnBhbGV0dGVbY29sb3JQb3MgKyAzXSArICcpJyxcblx0XHRcdFx0XHRcdG91dGxpbmU6IHtcblx0XHRcdFx0XHRcdFx0Y29sb3I6ICdyZ2JhKDY2LDY2LDY2LDAuOSknLFxuXHRcdFx0XHRcdFx0XHRzaXplOiAyXG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fTtcblxuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHN0eWxlLmNvbG9yID0gJ3JnYmEoMjU1LDI1NSwyNTUsMCknO1xuXHRcdFx0XHRcdHN0eWxlLm91dGxpbmUgPSB7XG5cdFx0XHRcdFx0XHRjb2xvcjogJ3JnYmEoMjU1LDI1NSwyNTUsMCknLFxuXHRcdFx0XHRcdFx0c2l6ZTogMVxuXHRcdFx0XHRcdH07XG5cblx0XHRcdFx0fVxuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHRcdHJldHVybiBzdHlsZTtcblx0XHR9O1xuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0Z1bGxMaXN0Q3RybCcsIGZ1bmN0aW9uKGluZGljYXRvcnMsIGluZGljZXMpIHtcblx0XHQvL1xuXHRcdHZhciB2bSA9IHRoaXM7XG5cdFx0dm0uaW5kaWNhdG9ycyA9IGluZGljYXRvcnM7XG5cdFx0dm0uaW5kaWNlcyA9IGluZGljZXM7XG5cdH0pO1xufSkoKTsiLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0hlYWRlckN0cmwnLCBmdW5jdGlvbigkc2NvcGUsIGxlYWZsZXREYXRhLCAkc3RhdGUsJGxvY2FsU3RvcmFnZSwgJHJvb3RTY29wZSwgJGF1dGgsIHRvYXN0ciwgJHRpbWVvdXQpe1xuXG5cdFx0dmFyIHZtID0gdGhpcztcblx0XHQkcm9vdFNjb3BlLmlzQXV0aGVudGljYXRlZCA9IGlzQXV0aGVudGljYXRlZDtcblx0XHR2bS5kb0xvZ2luID0gZG9Mb2dpbjtcblx0XHR2bS5kb0xvZ291dCA9IGRvTG9nb3V0O1xuXHRcdHZtLm9wZW5NZW51ID0gb3Blbk1lbnU7XG5cdFx0dm0udG9nZ2xlVmlldyA9IHRvZ2dsZVZpZXc7XG5cdFx0dm0uYXV0aGVudGljYXRlID0gZnVuY3Rpb24ocHJvdmlkZXIpe1xuXHRcdFx0JGF1dGguYXV0aGVudGljYXRlKHByb3ZpZGVyKTtcblx0XHR9O1xuXHRcdGZ1bmN0aW9uIGlzQXV0aGVudGljYXRlZCgpe1xuXHRcdFx0IHJldHVybiAkYXV0aC5pc0F1dGhlbnRpY2F0ZWQoKTtcblx0XHR9XG5cdFx0ZnVuY3Rpb24gZG9Mb2dpbigpe1xuXHRcdFx0JGF1dGgubG9naW4odm0udXNlcikudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG5cdFx0XHRcdHRvYXN0ci5zdWNjZXNzKCdZb3UgaGF2ZSBzdWNjZXNzZnVsbHkgc2lnbmVkIGluJyk7XG5cdFx0XHRcdC8vJHN0YXRlLmdvKCRyb290U2NvcGUucHJldmlvdXNQYWdlLnN0YXRlLm5hbWUgfHwgJ2FwcC5ob21lJywgJHJvb3RTY29wZS5wcmV2aW91c1BhZ2UucGFyYW1zKTtcblx0XHRcdH0pLmNhdGNoKGZ1bmN0aW9uKHJlc3BvbnNlKXtcblx0XHRcdFx0dG9hc3RyLmVycm9yKCdQbGVhc2UgY2hlY2sgeW91ciBlbWFpbCBhbmQgcGFzc3dvcmQnLCAnU29tZXRoaW5nIHdlbnQgd3JvbmcnKTtcblx0XHRcdH0pXG5cdFx0fVxuXHRcdGZ1bmN0aW9uIGRvTG9nb3V0KCl7XG5cdFx0XHRpZigkYXV0aC5pc0F1dGhlbnRpY2F0ZWQoKSl7XG5cdFx0XHRcdCRhdXRoLmxvZ291dCgpLnRoZW4oZnVuY3Rpb24oZGF0YSl7XG5cdFx0XHRcdFx0aWYoJHN0YXRlLmN1cnJlbnQuYXV0aCl7XG5cdFx0XHRcdFx0XHQkc3RhdGUuZ28oJ2FwcC5ob21lJyk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHRvYXN0ci5zdWNjZXNzKCdZb3UgaGF2ZSBzdWNjZXNzZnVsbHkgbG9nZ2VkIG91dCcpO1xuXHRcdFx0XHR9KS5jYXRjaChmdW5jdGlvbihyZXNwb25zZSl7XG5cblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fVxuXG4gICAgZnVuY3Rpb24gb3Blbk1lbnUoJG1kT3Blbk1lbnUsIGV2KSB7XG4gICAgICAkbWRPcGVuTWVudShldik7XG4gICAgfTtcblx0XHRmdW5jdGlvbiB0b2dnbGVWaWV3KCl7XG5cdFx0XHQkcm9vdFNjb3BlLmxvb3NlTGF5b3V0ID0gISRyb290U2NvcGUubG9vc2VMYXlvdXQ7XG5cdFx0XHQkbG9jYWxTdG9yYWdlLmZ1bGxWaWV3ID0gJHJvb3RTY29wZS5sb29zZUxheW91dDtcblx0XHRcdHJlc2V0TWFwU2l6ZSgpO1xuXHRcdH1cblx0XHRmdW5jdGlvbiByZXNldE1hcFNpemUoKXtcblx0XHRcdCR0aW1lb3V0KGZ1bmN0aW9uKCl7XG5cdFx0XHRcdGxlYWZsZXREYXRhLmdldE1hcCgnbWFwJykudGhlbihmdW5jdGlvbiAobWFwKSB7XG5cdFx0XHRcdFx0bWFwLmludmFsaWRhdGVTaXplKCk7XG5cdFx0XHRcdH0pXG5cdFx0XHR9LCAzMDApO1xuXHRcdH1cblx0XHQkcm9vdFNjb3BlLnNpZGViYXJPcGVuID0gdHJ1ZTtcblx0XHQkc2NvcGUuJHdhdGNoKGZ1bmN0aW9uKCl7XG5cdFx0XHRyZXR1cm4gJHJvb3RTY29wZS5jdXJyZW50X3BhZ2U7XG5cdFx0fSwgZnVuY3Rpb24obmV3UGFnZSl7XG5cdFx0XHQkc2NvcGUuY3VycmVudF9wYWdlID0gbmV3UGFnZSB8fCAnUGFnZSBOYW1lJztcblx0XHR9KTtcblx0XHQkc2NvcGUuJHdhdGNoKCckcm9vdC5zaWRlYmFyT3BlbicsIGZ1bmN0aW9uKG4sbyl7XG5cdFx0XHRpZihuID09IG8pIHJldHVybiBmYWxzZTtcblx0XHRcdHJlc2V0TWFwU2l6ZSgpO1xuXHRcdH0pXG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignSG9tZUN0cmwnLCBmdW5jdGlvbihEYXRhU2VydmljZSl7XG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG4gICAgICAgIERhdGFTZXJ2aWNlLmdldEFsbCgnaW5kZXgnLCB7aXNfb2ZmaWNpYWw6IHRydWV9KS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgICAgICB2bS5pbmRpemVzID0gcmVzcG9uc2U7XG4gICAgICAgIH0pO1xuXG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignSW1wb3J0Y3N2Q3RybCcsIGZ1bmN0aW9uICgkbWREaWFsb2cpIHtcblx0XHR0aGlzLnNldHRpbmdzID0ge1xuXHRcdFx0cHJpbnRMYXlvdXQ6IHRydWUsXG5cdFx0XHRzaG93UnVsZXI6IHRydWUsXG5cdFx0XHRzaG93U3BlbGxpbmdTdWdnZXN0aW9uczogdHJ1ZSxcblx0XHRcdHByZXNlbnRhdGlvbk1vZGU6ICdlZGl0J1xuXHRcdH07XG5cblx0XHR0aGlzLnNhbXBsZUFjdGlvbiA9IGZ1bmN0aW9uIChuYW1lLCBldikge1xuXHRcdFx0JG1kRGlhbG9nLnNob3coJG1kRGlhbG9nLmFsZXJ0KClcblx0XHRcdFx0LnRpdGxlKG5hbWUpXG5cdFx0XHRcdC5jb250ZW50KCdZb3UgdHJpZ2dlcmVkIHRoZSBcIicgKyBuYW1lICsgJ1wiIGFjdGlvbicpXG5cdFx0XHRcdC5vaygnR3JlYXQnKVxuXHRcdFx0XHQudGFyZ2V0RXZlbnQoZXYpXG5cdFx0XHQpO1xuXHRcdH07XG5cbiAgICB0aGlzLm9wZW5Dc3ZVcGxvYWQgPSBmdW5jdGlvbigpIHtcblx0XHRcdCRtZERpYWxvZy5zaG93KHtcblx0XHRcdFx0XHQvL2NvbnRyb2xsZXI6IERpYWxvZ0NvbnRyb2xsZXIsXG5cdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICcvdmlld3MvYXBwL2ltcG9ydGNzdi9jc3ZVcGxvYWREaWFsb2cuaHRtbCcsXG5cdCAgICAgICAgYmluZFRvQ29udHJvbGxlcjogdHJ1ZSxcblx0XHRcdFx0fSlcblx0XHRcdFx0LnRoZW4oZnVuY3Rpb24gKGFuc3dlcikge1xuXG5cdFx0XHRcdH0sIGZ1bmN0aW9uICgpIHtcblxuXHRcdFx0XHR9KTtcblx0XHR9O1xuXHR9KVxuXG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdJbmRleEN0cmwnLCBmdW5jdGlvbigkc2NvcGUsICR3aW5kb3csICRyb290U2NvcGUsICRmaWx0ZXIsICRzdGF0ZSwgJHRpbWVvdXQsIHRvYXN0ciwgVmVjdG9ybGF5ZXJTZXJ2aWNlLCBkYXRhLCBjb3VudHJpZXMsIGxlYWZsZXREYXRhLCBEYXRhU2VydmljZSkge1xuXHRcdC8vIFZhcmlhYmxlIGRlZmluaXRpb25zXG5cdFx0dmFyIHZtID0gdGhpcztcblx0XHR2bS5tYXAgPSBudWxsO1xuXG5cdFx0dm0uZGF0YVNlcnZlciA9IGRhdGEucHJvbWlzZXMuZGF0YTtcblx0XHR2bS5zdHJ1Y3R1cmVTZXJ2ZXIgPSBkYXRhLnByb21pc2VzLnN0cnVjdHVyZTtcblx0XHR2bS5jb3VudHJ5TGlzdCA9IGNvdW50cmllcztcblxuXHRcdHZtLnN0cnVjdHVyZSA9IFwiXCI7XG5cdFx0dm0ubXZ0U2NvdXJjZSA9IFZlY3RvcmxheWVyU2VydmljZS5nZXRMYXllcigpO1xuXHRcdHZtLm12dENvdW50cnlMYXllciA9IFZlY3RvcmxheWVyU2VydmljZS5nZXROYW1lKCk7XG5cdFx0dm0ubXZ0Q291bnRyeUxheWVyR2VvbSA9IHZtLm12dENvdW50cnlMYXllciArIFwiX2dlb21cIjtcblx0XHR2bS5pc29fZmllbGQgPSBWZWN0b3JsYXllclNlcnZpY2UuZGF0YS5pc28yO1xuXHRcdHZtLm5vZGVQYXJlbnQgPSB7fTtcblx0XHR2bS5zZWxlY3RlZFRhYiA9IDA7XG5cdFx0dm0uY3VycmVudCA9IFwiXCI7XG5cdFx0dm0udGFiQ29udGVudCA9IFwiXCI7XG5cdFx0dm0udG9nZ2xlQnV0dG9uID0gJ2Fycm93X2Ryb3BfZG93bic7XG5cdFx0dm0ubWVudWVPcGVuID0gdHJ1ZTtcblx0XHR2bS5pbmZvID0gZmFsc2U7XG5cdFx0dm0uY2xvc2VJY29uID0gJ2Nsb3NlJztcblx0XHR2bS5jb21wYXJlID0ge1xuXHRcdFx0YWN0aXZlOiBmYWxzZSxcblx0XHRcdGNvdW50cmllczogW11cblx0XHR9O1xuXHRcdHZtLmRpc3BsYXkgPSB7XG5cdFx0XHRzZWxlY3RlZENhdDogJydcblx0XHR9O1xuXG5cdFx0Ly9GdW5jdGlvbiBkZWZpbml0b25zXG5cdFx0dm0uc2hvd1RhYkNvbnRlbnQgPSBzaG93VGFiQ29udGVudDtcblx0XHR2bS5zZXRUYWIgPSBzZXRUYWI7XG5cdFx0dm0uc2V0U3RhdGUgPSBzZXRTdGF0ZTtcblx0XHR2bS5zZXRDdXJyZW50ID0gc2V0Q3VycmVudDtcblx0XHR2bS5zZXRTZWxlY3RlZEZlYXR1cmUgPSBzZXRTZWxlY3RlZEZlYXR1cmU7XG5cdFx0dm0uZ2V0UmFuayA9IGdldFJhbms7XG5cdFx0dm0uZ2V0T2Zmc2V0ID0gZ2V0T2Zmc2V0O1xuXHRcdHZtLmdldFRlbmRlbmN5ID0gZ2V0VGVuZGVuY3k7XG5cblx0XHR2bS5jaGVja0NvbXBhcmlzb24gPSBjaGVja0NvbXBhcmlzb247XG5cdFx0dm0udG9nZ2xlT3BlbiA9IHRvZ2dsZU9wZW47XG5cdFx0dm0udG9nZ2xlSW5mbyA9IHRvZ2dsZUluZm87XG5cdFx0dm0udG9nZ2xlRGV0YWlscyA9IHRvZ2dsZURldGFpbHM7XG5cdFx0dm0udG9nZ2xlQ29tcGFyaXNvbiA9IHRvZ2dsZUNvbXBhcmlzb247XG5cdFx0dm0udG9nZ2xlQ291bnRyaWVMaXN0ID0gdG9nZ2xlQ291bnRyaWVMaXN0O1xuXHRcdHZtLm1hcEdvdG9Db3VudHJ5ID0gbWFwR290b0NvdW50cnk7XG5cdFx0dm0uZ29CYWNrID0gZ29CYWNrO1xuXHRcdHZtLmdvVG9JbmRleCA9IGdvVG9JbmRleDtcblxuXHRcdHZtLmNhbGNUcmVlID0gY2FsY1RyZWU7XG5cblx0XHR2bS5pc1ByZWxhc3QgPSBpc1ByZWxhc3Q7XG5cblx0XHRhY3RpdmF0ZSgpO1xuXG5cdFx0ZnVuY3Rpb24gYWN0aXZhdGUoKSB7XG5cblx0XHRcdHZtLnN0cnVjdHVyZVNlcnZlci50aGVuKGZ1bmN0aW9uKHN0cnVjdHVyZSkge1xuXHRcdFx0XHR2bS5kYXRhU2VydmVyLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuXHRcdFx0XHRcdHZtLmRhdGEgPSBkYXRhO1xuXHRcdFx0XHRcdHZtLnN0cnVjdHVyZSA9IHN0cnVjdHVyZTtcblx0XHRcdFx0XHRpZiAoIXZtLnN0cnVjdHVyZS5zdHlsZSkge1xuXHRcdFx0XHRcdFx0dm0uc3RydWN0dXJlLnN0eWxlID0ge1xuXHRcdFx0XHRcdFx0XHQnbmFtZSc6ICdkZWZhdWx0Jyxcblx0XHRcdFx0XHRcdFx0J3RpdGxlJzogJ0RlZmF1bHQnLFxuXHRcdFx0XHRcdFx0XHQnYmFzZV9jb2xvcic6ICdyZ2JhKDEyOCwgMjQzLCAxOTgsMSknXG5cdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRjcmVhdGVDYW52YXModm0uc3RydWN0dXJlLnN0eWxlLmJhc2VfY29sb3IpO1xuXHRcdFx0XHRcdGRyYXdDb3VudHJpZXMoKTtcblx0XHRcdFx0XHRpZiAoJHN0YXRlLnBhcmFtcy5pdGVtKSB7XG5cdFx0XHRcdFx0XHR2bS5zZXRTdGF0ZSgkc3RhdGUucGFyYW1zLml0ZW0pO1xuXHRcdFx0XHRcdFx0Y2FsY1JhbmsoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKCRzdGF0ZS5wYXJhbXMuY291bnRyaWVzKSB7XG5cdFx0XHRcdFx0XHR2bS5zZXRUYWIoMik7XG5cdFx0XHRcdFx0XHR2bS5jb21wYXJlLmNvdW50cmllcy5wdXNoKHZtLmN1cnJlbnQpO1xuXHRcdFx0XHRcdFx0dm0uY29tcGFyZS5hY3RpdmUgPSB0cnVlO1xuXHRcdFx0XHRcdFx0JHJvb3RTY29wZS5ncmV5ZWQgPSB0cnVlO1xuXHRcdFx0XHRcdFx0dmFyIGNvdW50cmllcyA9ICRzdGF0ZS5wYXJhbXMuY291bnRyaWVzLnNwbGl0KCctdnMtJyk7XG5cdFx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2goY291bnRyaWVzLCBmdW5jdGlvbihpc28pIHtcblx0XHRcdFx0XHRcdFx0dm0uY29tcGFyZS5jb3VudHJpZXMucHVzaChnZXROYXRpb25CeUlzbyhpc28pKTtcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0Ly9vbnNvbGUubG9nKHZtLmNvbXBhcmUuY291bnRyaWVzKTtcblx0XHRcdFx0XHRcdGNvdW50cmllcy5wdXNoKHZtLmN1cnJlbnQuaXNvKTtcblx0XHRcdFx0XHRcdERhdGFTZXJ2aWNlLmdldE9uZSgnY291bnRyaWVzL2Jib3gnLCBjb3VudHJpZXMpLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuXHRcdFx0XHRcdFx0XHR2bS5iYm94ID0gZGF0YTtcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSlcblx0XHRcdH0pO1xuXG5cdFx0fVxuXHRcdC8vIFRPRE86IE1PVkUgVE8gR0xPQkFMXG5cdFx0ZnVuY3Rpb24gZ29CYWNrKCkge1xuXHRcdFx0JHdpbmRvdy5oaXN0b3J5LmJhY2soKTtcblx0XHR9XG5cdFx0ZnVuY3Rpb24gZ29Ub0luZGV4KGl0ZW0pe1xuXHRcdFx0Y29uc29sZS5sb2coaXRlbSk7XG5cdFx0XHQkc3RhdGUuZ28oJ2FwcC5pbmRleC5zaG93LnNlbGVjdGVkJyx7XG5cdFx0XHRcdGluZGV4Oml0ZW0ubmFtZSxcblx0XHRcdFx0aXRlbTokc3RhdGUucGFyYW1zWydpdGVtJ11cblx0XHRcdH0pO1xuXHRcdH1cblx0XHRmdW5jdGlvbiBpc1ByZWxhc3QoKXtcblx0XHRcdHZhciBsZXZlbHNGb3VuZCA9IGZhbHNlO1xuXHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLnN0cnVjdHVyZS5jaGlsZHJlbiwgZnVuY3Rpb24oY2hpbGQpe1xuXHRcdFx0XHRpZihjaGlsZC5jaGlsZHJlbi5sZW5ndGggPiAwKXtcblx0XHRcdFx0XHRsZXZlbHNGb3VuZCA9IHRydWU7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdFx0cmV0dXJuIGxldmVsc0ZvdW5kO1xuXHRcdH1cblx0XHRmdW5jdGlvbiBzaG93VGFiQ29udGVudChjb250ZW50KSB7XG5cdFx0XHRpZiAoY29udGVudCA9PSAnJyAmJiB2bS50YWJDb250ZW50ID09ICcnKSB7XG5cdFx0XHRcdHZtLnRhYkNvbnRlbnQgPSAncmFuayc7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR2bS50YWJDb250ZW50ID0gY29udGVudDtcblx0XHRcdH1cblx0XHRcdHZtLnRvZ2dsZUJ1dHRvbiA9IHZtLnRhYkNvbnRlbnQgPyAnYXJyb3dfZHJvcF91cCcgOiAnYXJyb3dfZHJvcF9kb3duJztcblx0XHR9O1xuXG5cdFx0ZnVuY3Rpb24gc2V0U3RhdGUoaXRlbSkge1xuXHRcdFx0dm0uc2V0Q3VycmVudChnZXROYXRpb25CeUlzbyhpdGVtKSk7XG5cdFx0XHRmZXRjaE5hdGlvbkRhdGEoaXRlbSk7XG5cdFx0fTtcblxuXHRcdGZ1bmN0aW9uIHRvZ2dsZU9wZW4oKSB7XG5cdFx0XHR2bS5tZW51ZU9wZW4gPSAhdm0ubWVudWVPcGVuO1xuXHRcdFx0dm0uY2xvc2VJY29uID0gdm0ubWVudWVPcGVuID09IHRydWUgPyAnY2hldnJvbl9sZWZ0JyA6ICdjaGV2cm9uX3JpZ2h0Jztcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBzZXRDdXJyZW50KG5hdCkge1xuXHRcdFx0dm0uY3VycmVudCA9IG5hdDtcblx0XHRcdHZtLnNldFNlbGVjdGVkRmVhdHVyZSgpO1xuXHRcdH07XG5cblx0XHRmdW5jdGlvbiBzZXRTZWxlY3RlZEZlYXR1cmUoaXNvKSB7XG5cdFx0XHRpZiAodm0ubXZ0U291cmNlKSB7XG5cdFx0XHRcdCR0aW1lb3V0KGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdHZtLm12dFNvdXJjZS5sYXllcnNbdm0ubXZ0Q291bnRyeUxheWVyR2VvbV0uZmVhdHVyZXNbdm0uY3VycmVudC5pc29dLnNlbGVjdGVkID0gdHJ1ZTtcblx0XHRcdFx0fSlcblx0XHRcdH1cblx0XHR9O1xuXG5cdFx0Ly9UT0RPOiBNT1ZFIFRPIFNFUlZJQ0Vcblx0XHRmdW5jdGlvbiBjYWxjUmFuaygpIHtcblx0XHRcdGlmICghdm0uY3VycmVudCkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0XHR2YXIgcmFuayA9IDA7XG5cdFx0XHR2YXIga2FjayA9IFtdO1xuXHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLmRhdGEsIGZ1bmN0aW9uKGl0ZW0pIHtcblx0XHRcdFx0aXRlbVt2bS5zdHJ1Y3R1cmUubmFtZV0gPSBwYXJzZUZsb2F0KGl0ZW1bdm0uc3RydWN0dXJlLm5hbWVdKTtcblx0XHRcdFx0aXRlbVsnc2NvcmUnXSA9IHBhcnNlRmxvYXQoaXRlbVt2bS5zdHJ1Y3R1cmUubmFtZV0pO1xuXHRcdFx0fSk7XG5cdFx0XHQvL3ZtLmRhdGEgPSAkZmlsdGVyKCdvcmRlckJ5Jykodm0uZGF0YSwgJ3Njb3JlJywgJ2lzbycsIHRydWUpO1xuXHRcdFx0cmFuayA9IHZtLmRhdGEuaW5kZXhPZih2bS5jdXJyZW50KSArIDE7XG5cdFx0XHR2bS5jdXJyZW50W3ZtLnN0cnVjdHVyZS5uYW1lICsgJ19yYW5rJ10gPSByYW5rO1xuXHRcdFx0dm0uY2lyY2xlT3B0aW9ucyA9IHtcblx0XHRcdFx0Y29sb3I6IHZtLnN0cnVjdHVyZS5zdHlsZS5iYXNlX2NvbG9yIHx8ICcjMDBjY2FhJyxcblx0XHRcdFx0ZmllbGQ6IHZtLnN0cnVjdHVyZS5uYW1lICsgJ19yYW5rJyxcblx0XHRcdFx0c2l6ZTogdm0uZGF0YS5sZW5ndGhcblx0XHRcdH07XG5cblx0XHRcdHJldHVybiByYW5rO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGdldFJhbmsoY291bnRyeSkge1xuXG5cdFx0XHR2YXIgcmFuayA9IHZtLmRhdGEuaW5kZXhPZihjb3VudHJ5KSArIDE7XG5cdFx0XHRyZXR1cm4gcmFuaztcblx0XHR9XG5cblx0XHQvL1RPRE86IFJFTU9WRSwgTk9XIEdPVCBPV04gVVJMXG5cdFx0ZnVuY3Rpb24gdG9nZ2xlSW5mbygpIHtcblx0XHRcdHZtLmluZm8gPSAhdm0uaW5mbztcblx0XHR9O1xuXG5cdFx0Ly9UT0RPOiBQVVQgSU4gVklFV1xuXHRcdGZ1bmN0aW9uIHRvZ2dsZURldGFpbHMoKSB7XG5cdFx0XHRyZXR1cm4gdm0uZGV0YWlscyA9ICF2bS5kZXRhaWxzO1xuXHRcdH07XG5cblx0XHQvL1RPRE86IE1PVkUgVE8gU0VSVklDRVxuXHRcdGZ1bmN0aW9uIGZldGNoTmF0aW9uRGF0YShpc28pIHtcblx0XHRcdERhdGFTZXJ2aWNlLmdldE9uZSgnaW5kZXgvJyArICRzdGF0ZS5wYXJhbXMuaW5kZXgsIGlzbykudGhlbihmdW5jdGlvbihkYXRhKSB7XG5cdFx0XHRcdHZtLmN1cnJlbnQuZGF0YSA9IGRhdGE7XG5cdFx0XHRcdG1hcEdvdG9Db3VudHJ5KGlzbyk7XG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHQvL1RPRE86IE1PVkUgVE8gTUFQIFNFUlZJQ0Vcblx0XHRmdW5jdGlvbiBtYXBHb3RvQ291bnRyeShpc28pIHtcblx0XHRcdGlmICghJHN0YXRlLnBhcmFtcy5jb3VudHJpZXMpIHtcblx0XHRcdFx0RGF0YVNlcnZpY2UuZ2V0T25lKCdjb3VudHJpZXMvYmJveCcsIFtpc29dKS50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcblx0XHRcdFx0XHR2bS5iYm94ID0gZGF0YTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cblx0XHR9XG5cblx0XHRmdW5jdGlvbiBjaGVja0NvbXBhcmlzb24od2FudCkge1xuXHRcdFx0aWYgKHdhbnQgJiYgIXZtLmNvbXBhcmUuYWN0aXZlIHx8ICF3YW50ICYmIHZtLmNvbXBhcmUuYWN0aXZlKSB7XG5cdFx0XHRcdHZtLnRvZ2dsZUNvbXBhcmlzb24oKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRmdW5jdGlvbiB0b2dnbGVDb21wYXJpc29uKCkge1xuXHRcdFx0dm0uY29tcGFyZS5jb3VudHJpZXMgPSBbdm0uY3VycmVudF07XG5cdFx0XHR2bS5jb21wYXJlLmFjdGl2ZSA9ICF2bS5jb21wYXJlLmFjdGl2ZTtcblx0XHRcdGlmICh2bS5jb21wYXJlLmFjdGl2ZSkge1xuXHRcdFx0XHR2bS5zZXRUYWIoMik7XG5cdFx0XHRcdCRyb290U2NvcGUuZ3JleWVkID0gdHJ1ZTtcblx0XHRcdFx0dm0ubXZ0U291cmNlLm9wdGlvbnMubXV0ZXhUb2dnbGUgPSBmYWxzZTtcblx0XHRcdFx0dm0ubXZ0U291cmNlLnNldFN0eWxlKGludmVydGVkU3R5bGUpO1xuXG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkcm9vdFNjb3BlLmdyZXllZCA9IGZhbHNlO1xuXHRcdFx0XHRhbmd1bGFyLmZvckVhY2godm0ubXZ0U291cmNlLmxheWVyc1t2bS5tdnRDb3VudHJ5TGF5ZXJHZW9tXS5mZWF0dXJlcywgZnVuY3Rpb24oZmVhdHVyZSkge1xuXHRcdFx0XHRcdGZlYXR1cmUuc2VsZWN0ZWQgPSBmYWxzZTtcblx0XHRcdFx0fSk7XG5cdFx0XHRcdHZtLm12dFNvdXJjZS5sYXllcnNbdm0ubXZ0Q291bnRyeUxheWVyR2VvbV0uZmVhdHVyZXNbdm0uY3VycmVudC5pc29dLnNlbGVjdGVkID0gdHJ1ZTtcblx0XHRcdFx0dm0ubXZ0U291cmNlLm9wdGlvbnMubXV0ZXhUb2dnbGUgPSB0cnVlO1xuXHRcdFx0XHR2bS5tdnRTb3VyY2Uuc2V0U3R5bGUoY291bnRyaWVzU3R5bGUpO1xuXHRcdFx0XHREYXRhU2VydmljZS5nZXRPbmUoJ2NvdW50cmllcy9iYm94JywgW3ZtLmN1cnJlbnQuaXNvXSkudGhlbihmdW5jdGlvbihkYXRhKSB7XG5cdFx0XHRcdFx0dm0uYmJveCA9IGRhdGE7XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHQkc3RhdGUuZ28oJ2FwcC5pbmRleC5zaG93LnNlbGVjdGVkJywge1xuXHRcdFx0XHRcdGluZGV4OiAkc3RhdGUucGFyYW1zLmluZGV4LFxuXHRcdFx0XHRcdGl0ZW06ICRzdGF0ZS5wYXJhbXMuaXRlbVxuXHRcdFx0XHR9KVxuXHRcdFx0fVxuXHRcdFx0Ly92bS5tdnRTb3VyY2UucmVkcmF3KCk7XG5cdFx0fTtcblxuXHRcdGZ1bmN0aW9uIHRvZ2dsZUNvdW50cmllTGlzdChjb3VudHJ5KSB7XG5cdFx0XHR2YXIgZm91bmQgPSBmYWxzZTtcblx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5jb21wYXJlLmNvdW50cmllcywgZnVuY3Rpb24obmF0LCBrZXkpIHtcblx0XHRcdFx0aWYgKGNvdW50cnkgPT0gbmF0ICYmIG5hdCAhPSB2bS5jdXJyZW50KSB7XG5cdFx0XHRcdFx0dm0uY29tcGFyZS5jb3VudHJpZXMuc3BsaWNlKGtleSwgMSk7XG5cdFx0XHRcdFx0Zm91bmQgPSB0cnVlO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHRcdGlmICghZm91bmQpIHtcblx0XHRcdFx0dm0uY29tcGFyZS5jb3VudHJpZXMucHVzaChjb3VudHJ5KTtcblx0XHRcdH07XG5cdFx0XHR2YXIgaXNvcyA9IFtdO1xuXHRcdFx0dmFyIGNvbXBhcmUgPSBbXTtcblx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5jb21wYXJlLmNvdW50cmllcywgZnVuY3Rpb24oaXRlbSwga2V5KSB7XG5cdFx0XHRcdGlzb3MucHVzaChpdGVtLmlzbyk7XG5cdFx0XHRcdGlmIChpdGVtW3ZtLnN0cnVjdHVyZS5pc29dICE9IHZtLmN1cnJlbnQuaXNvKSB7XG5cdFx0XHRcdFx0Y29tcGFyZS5wdXNoKGl0ZW0uaXNvKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0XHRpZiAoaXNvcy5sZW5ndGggPiAxKSB7XG5cdFx0XHRcdERhdGFTZXJ2aWNlLmdldE9uZSgnY291bnRyaWVzL2Jib3gnLCBpc29zKS50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcblx0XHRcdFx0XHR2bS5iYm94ID0gZGF0YTtcblx0XHRcdFx0fSk7XG5cdFx0XHRcdCRzdGF0ZS5nbygnYXBwLmluZGV4LnNob3cuc2VsZWN0ZWQuY29tcGFyZScsIHtcblx0XHRcdFx0XHRpbmRleDogJHN0YXRlLnBhcmFtcy5pbmRleCxcblx0XHRcdFx0XHRpdGVtOiAkc3RhdGUucGFyYW1zLml0ZW0sXG5cdFx0XHRcdFx0Y291bnRyaWVzOiBjb21wYXJlLmpvaW4oJy12cy0nKVxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuICFmb3VuZDtcblx0XHR9O1xuXG5cdFx0Ly9UT0RPOiBNT1ZFIFRPIE9XTiBESVJFQ1RJVkVcblx0XHRmdW5jdGlvbiBnZXRPZmZzZXQoKSB7XG5cdFx0XHRpZiAoIXZtLmN1cnJlbnQpIHtcblx0XHRcdFx0cmV0dXJuIDA7XG5cdFx0XHR9XG5cdFx0XHQvL2NvbnNvbGUubG9nKHZtLmdldFJhbmsodm0uY3VycmVudCkpO1xuXHRcdFx0cmV0dXJuICh2bS5nZXRSYW5rKHZtLmN1cnJlbnQpIC0gMikgKiAxNztcblx0XHR9O1xuXG5cdFx0Ly9UT0RPOiBNT1ZFIFRPIE9XTiBESVJFQ1RJVkVcblx0XHRmdW5jdGlvbiBnZXRUZW5kZW5jeSgpIHtcblx0XHRcdGlmICghdm0uY3VycmVudCkge1xuXHRcdFx0XHRyZXR1cm4gJ2Fycm93X2Ryb3BfZG93bidcblx0XHRcdH1cblx0XHRcdHJldHVybiB2bS5jdXJyZW50LnBlcmNlbnRfY2hhbmdlID4gMCA/ICdhcnJvd19kcm9wX3VwJyA6ICdhcnJvd19kcm9wX2Rvd24nO1xuXHRcdH07XG5cblx0XHQvL1RPRE86IE1PVkUgVE8gVklFV1xuXHRcdGZ1bmN0aW9uIHNldFRhYihpKSB7XG5cdFx0XHQvL3ZtLmFjdGl2ZVRhYiA9IGk7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gZ2V0UGFyZW50KGRhdGEpIHtcblx0XHRcdHZhciBpdGVtcyA9IFtdO1xuXHRcdFx0YW5ndWxhci5mb3JFYWNoKGRhdGEuY2hpbGRyZW4sIGZ1bmN0aW9uKGl0ZW0pIHtcblx0XHRcdFx0aWYgKGl0ZW0uY29sdW1uX25hbWUgPT0gdm0uZGlzcGxheS5zZWxlY3RlZENhdC50eXBlKSB7XG5cdFx0XHRcdFx0dm0ubm9kZVBhcmVudCA9IGRhdGE7XG5cdFx0XHRcdH1cblx0XHRcdFx0Z2V0UGFyZW50KGl0ZW0pO1xuXHRcdFx0fSk7XG5cdFx0XHRyZXR1cm4gaXRlbXM7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gY2FsY1RyZWUoKSB7XG5cdFx0XHRnZXRQYXJlbnQodm0uc3RydWN0dXJlKTtcblx0XHR9O1xuXG5cdFx0Ly9UT0RPOiBNT1ZFIFRPIFNFUlZJQ0UgQ09VTlRSWVxuXHRcdGZ1bmN0aW9uIGdldE5hdGlvbkJ5TmFtZShuYW1lKSB7XG5cdFx0XHR2YXIgbmF0aW9uID0ge307XG5cdFx0XHRhbmd1bGFyLmZvckVhY2godm0uZGF0YSwgZnVuY3Rpb24obmF0KSB7XG5cdFx0XHRcdGlmIChuYXQuY291bnRyeSA9PSBuYW1lKSB7XG5cdFx0XHRcdFx0bmF0aW9uID0gbmF0O1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHRcdHJldHVybiBuYXRpb247XG5cdFx0fTtcblxuXHRcdC8vVE9ETzogTU9WRSBUTyBTRVJWSUNFIENPVU5UUllcblx0XHRmdW5jdGlvbiBnZXROYXRpb25CeUlzbyhpc28pIHtcblx0XHRcdHZhciBuYXRpb24gPSB7fTtcblx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5kYXRhLCBmdW5jdGlvbihuYXQpIHtcblx0XHRcdFx0aWYgKG5hdC5pc28gPT0gaXNvKSB7XG5cdFx0XHRcdFx0bmF0aW9uID0gbmF0O1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdFx0cmV0dXJuIG5hdGlvbjtcblx0XHR9O1xuXG5cdFx0Ly9UT0RPOiBNT1ZFIFRPIFNFUlZJQ0UgTUFQXG5cdFx0ZnVuY3Rpb24gY3JlYXRlQ2FudmFzKGNvbG9yKSB7XG5cblx0XHRcdHZtLmNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuXHRcdFx0dm0uY2FudmFzLndpZHRoID0gMjgwO1xuXHRcdFx0dm0uY2FudmFzLmhlaWdodCA9IDEwO1xuXHRcdFx0dm0uY3R4ID0gdm0uY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG5cdFx0XHR2YXIgZ3JhZGllbnQgPSB2bS5jdHguY3JlYXRlTGluZWFyR3JhZGllbnQoMCwgMCwgMjgwLCAxMCk7XG5cdFx0XHRncmFkaWVudC5hZGRDb2xvclN0b3AoMSwgJ3JnYmEoMjU1LDI1NSwyNTUsMCknKTtcblx0XHRcdGdyYWRpZW50LmFkZENvbG9yU3RvcCgwLjUzLCBjb2xvciB8fCAncmdiYSgxMjgsIDI0MywgMTk4LDEpJyk7XG5cdFx0XHRncmFkaWVudC5hZGRDb2xvclN0b3AoMCwgJ3JnYmEoMTAyLDEwMiwxMDIsMSknKTtcblx0XHRcdHZtLmN0eC5maWxsU3R5bGUgPSBncmFkaWVudDtcblx0XHRcdHZtLmN0eC5maWxsUmVjdCgwLCAwLCAyODAsIDEwKTtcblx0XHRcdHZtLnBhbGV0dGUgPSB2bS5jdHguZ2V0SW1hZ2VEYXRhKDAsIDAsIDI1NywgMSkuZGF0YTtcblx0XHRcdC8vZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2JvZHknKVswXS5hcHBlbmRDaGlsZCh2bS5jYW52YXMpO1xuXHRcdH1cblxuXHRcdC8vVE9ETzogTU9WRSBUTyBTRVJWSUNFIE1BUFxuXHRcdGZ1bmN0aW9uIHVwZGF0ZUNhbnZhcyhjb2xvcikge1xuXHRcdFx0dmFyIGdyYWRpZW50ID0gdm0uY3R4LmNyZWF0ZUxpbmVhckdyYWRpZW50KDAsIDAsIDI4MCwgMTApO1xuXHRcdFx0Z3JhZGllbnQuYWRkQ29sb3JTdG9wKDEsICdyZ2JhKDI1NSwyNTUsMjU1LDApJyk7XG5cdFx0XHRncmFkaWVudC5hZGRDb2xvclN0b3AoMC41MywgY29sb3IgfHwgJ3JnYmEoMTI4LCAyNDMsIDE5OCwxKScpO1xuXHRcdFx0Z3JhZGllbnQuYWRkQ29sb3JTdG9wKDAsICdyZ2JhKDEwMiwxMDIsMTAyLDEpJyk7XG5cdFx0XHR2bS5jdHguZmlsbFN0eWxlID0gZ3JhZGllbnQ7XG5cdFx0XHR2bS5jdHguZmlsbFJlY3QoMCwgMCwgMjgwLCAxMCk7XG5cdFx0XHR2bS5wYWxldHRlID0gdm0uY3R4LmdldEltYWdlRGF0YSgwLCAwLCAyNTcsIDEpLmRhdGE7XG5cdFx0XHQvL2RvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdib2R5JylbMF0uYXBwZW5kQ2hpbGQodm0uY2FudmFzKTtcblx0XHR9O1xuXG5cdFx0Ly9UT0RPOiBNT1ZFIFRPIFNFUlZJQ0UgTUFQXG5cdFx0ZnVuY3Rpb24gaW52ZXJ0ZWRTdHlsZShmZWF0dXJlKSB7XG5cdFx0XHR2YXIgc3R5bGUgPSB7fTtcblx0XHRcdHZhciBpc28gPSBmZWF0dXJlLnByb3BlcnRpZXNbdm0uaXNvX2ZpZWxkXTtcblx0XHRcdHZhciBuYXRpb24gPSBnZXROYXRpb25CeUlzbyhpc28pO1xuXHRcdFx0dmFyIGZpZWxkID0gdm0uc3RydWN0dXJlLm5hbWUgfHwgJ3Njb3JlJztcblxuXHRcdFx0Ly9UT0RPOiBNQVggVkFMVUUgSU5TVEVBRCBPRiAxMDBcblx0XHRcdHZhciBjb2xvclBvcyA9IHBhcnNlSW50KDI1NiAvIDEwMCAqIG5hdGlvbltmaWVsZF0pICogNDtcblxuXHRcdFx0dmFyIGNvbG9yID0gJ3JnYmEoJyArIHZtLnBhbGV0dGVbY29sb3JQb3NdICsgJywgJyArIHZtLnBhbGV0dGVbY29sb3JQb3MgKyAxXSArICcsICcgKyB2bS5wYWxldHRlW2NvbG9yUG9zICsgMl0gKyAnLCcgKyB2bS5wYWxldHRlW2NvbG9yUG9zICsgM10gKyAnKSc7XG5cdFx0XHRzdHlsZS5jb2xvciA9ICdyZ2JhKDAsMCwwLDApJztcblx0XHRcdHN0eWxlLm91dGxpbmUgPSB7XG5cdFx0XHRcdGNvbG9yOiAncmdiYSgwLDAsMCwwKScsXG5cdFx0XHRcdHNpemU6IDBcblx0XHRcdH07XG5cdFx0XHRzdHlsZS5zZWxlY3RlZCA9IHtcblx0XHRcdFx0Y29sb3I6IGNvbG9yLFxuXHRcdFx0XHRvdXRsaW5lOiB7XG5cdFx0XHRcdFx0Y29sb3I6ICdyZ2JhKDAsMCwwLDAuMyknLFxuXHRcdFx0XHRcdHNpemU6IDJcblx0XHRcdFx0fVxuXHRcdFx0fTtcblx0XHRcdHJldHVybiBzdHlsZTtcblx0XHR9O1xuXG5cdFx0Ly9UT0RPOiBNT1ZFIFRPIFNFUlZJQ0Vcblx0XHRmdW5jdGlvbiBjb3VudHJpZXNTdHlsZShmZWF0dXJlKSB7XG5cblx0XHRcdHZhciBzdHlsZSA9IHt9O1xuXHRcdFx0dmFyIGlzbyA9IGZlYXR1cmUucHJvcGVydGllc1t2bS5pc29fZmllbGRdO1xuXG5cdFx0XHR2YXIgbmF0aW9uID0gZ2V0TmF0aW9uQnlJc28oaXNvKTtcblx0XHRcdHZhciBmaWVsZCA9IHZtLnN0cnVjdHVyZS5uYW1lIHx8ICdzY29yZSc7XG5cdFx0XHR2YXIgdHlwZSA9IGZlYXR1cmUudHlwZTtcblx0XHRcdGlmIChpc28gIT0gdm0uY3VycmVudC5pc28pIHtcblx0XHRcdFx0ZmVhdHVyZS5zZWxlY3RlZCA9IGZhbHNlO1xuXHRcdFx0fVxuXG5cdFx0XHRzd2l0Y2ggKHR5cGUpIHtcblx0XHRcdFx0Y2FzZSAzOiAvLydQb2x5Z29uJ1xuXHRcdFx0XHRcdGlmICh0eXBlb2YgbmF0aW9uW2ZpZWxkXSAhPSBcInVuZGVmaW5lZFwiKSB7XG5cblx0XHRcdFx0XHRcdC8vVE9ETzogTUFYIFZBTFVFIElOU1RFQUQgT0YgMTAwXG5cdFx0XHRcdFx0XHR2YXIgY29sb3JQb3MgPSBwYXJzZUludCgyNTYgLyAxMDAgKiBwYXJzZUludChuYXRpb25bZmllbGRdKSkgKiA0O1xuXG5cdFx0XHRcdFx0XHR2YXIgY29sb3IgPSAncmdiYSgnICsgdm0ucGFsZXR0ZVtjb2xvclBvc10gKyAnLCAnICsgdm0ucGFsZXR0ZVtjb2xvclBvcyArIDFdICsgJywgJyArIHZtLnBhbGV0dGVbY29sb3JQb3MgKyAyXSArICcsJyArIHZtLnBhbGV0dGVbY29sb3JQb3MgKyAzXSArICcpJztcblx0XHRcdFx0XHRcdHN0eWxlLmNvbG9yID0gJ3JnYmEoJyArIHZtLnBhbGV0dGVbY29sb3JQb3NdICsgJywgJyArIHZtLnBhbGV0dGVbY29sb3JQb3MgKyAxXSArICcsICcgKyB2bS5wYWxldHRlW2NvbG9yUG9zICsgMl0gKyAnLDAuNiknOyAvL2NvbG9yO1xuXHRcdFx0XHRcdFx0c3R5bGUub3V0bGluZSA9IHtcblx0XHRcdFx0XHRcdFx0Y29sb3I6IGNvbG9yLFxuXHRcdFx0XHRcdFx0XHRzaXplOiAxXG5cdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdFx0c3R5bGUuc2VsZWN0ZWQgPSB7XG5cdFx0XHRcdFx0XHRcdGNvbG9yOiAncmdiYSgnICsgdm0ucGFsZXR0ZVtjb2xvclBvc10gKyAnLCAnICsgdm0ucGFsZXR0ZVtjb2xvclBvcyArIDFdICsgJywgJyArIHZtLnBhbGV0dGVbY29sb3JQb3MgKyAyXSArICcsMC4zKScsXG5cdFx0XHRcdFx0XHRcdG91dGxpbmU6IHtcblx0XHRcdFx0XHRcdFx0XHRjb2xvcjogJ3JnYmEoNjYsNjYsNjYsMC45KScsXG5cdFx0XHRcdFx0XHRcdFx0c2l6ZTogMlxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblxuXHRcdFx0XHRcdFx0c3R5bGUuY29sb3IgPSAncmdiYSgyNTUsMjU1LDI1NSwwKSc7XG5cdFx0XHRcdFx0XHRzdHlsZS5vdXRsaW5lID0ge1xuXHRcdFx0XHRcdFx0XHRjb2xvcjogJ3JnYmEoMjU1LDI1NSwyNTUsMCknLFxuXHRcdFx0XHRcdFx0XHRzaXplOiAxXG5cdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdC8vY29uc29sZS5sb2coZmVhdHVyZS5wcm9wZXJ0aWVzLm5hbWUpXG5cdFx0XHRpZiAoZmVhdHVyZS5sYXllci5uYW1lID09PSBWZWN0b3JsYXllclNlcnZpY2UuZ2V0TmFtZSgpICsgJ19nZW9tJykge1xuXHRcdFx0XHRzdHlsZS5zdGF0aWNMYWJlbCA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdHZhciBzdHlsZSA9IHtcblx0XHRcdFx0XHRcdGh0bWw6IGZlYXR1cmUucHJvcGVydGllcy5uYW1lLFxuXHRcdFx0XHRcdFx0aWNvblNpemU6IFsxMjUsIDMwXSxcblx0XHRcdFx0XHRcdGNzc0NsYXNzOiAnbGFiZWwtaWNvbi10ZXh0J1xuXHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0cmV0dXJuIHN0eWxlO1xuXHRcdFx0XHR9O1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHN0eWxlO1xuXHRcdH07XG5cblx0XHQkc2NvcGUuJHdhdGNoKCd2bS5jdXJyZW50JywgZnVuY3Rpb24obiwgbykge1xuXHRcdFx0aWYgKG4gPT09IG8pIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAobi5pc28pIHtcblx0XHRcdFx0aWYgKG8uaXNvKSB7XG5cdFx0XHRcdFx0dm0ubXZ0U291cmNlLmxheWVyc1t2bS5tdnRDb3VudHJ5TGF5ZXJHZW9tXS5mZWF0dXJlc1tvLmlzb10uc2VsZWN0ZWQgPSBmYWxzZTtcblx0XHRcdFx0fVxuXHRcdFx0XHRjYWxjUmFuaygpO1xuXHRcdFx0XHRmZXRjaE5hdGlvbkRhdGEobi5pc28pO1xuXHRcdFx0XHR2bS5tdnRTb3VyY2UubGF5ZXJzW3ZtLm12dENvdW50cnlMYXllckdlb21dLmZlYXR1cmVzW24uaXNvXS5zZWxlY3RlZCA9IHRydWU7XG5cdFx0XHRcdGlmICgkc3RhdGUuY3VycmVudC5uYW1lID09ICdhcHAuaW5kZXguc2hvdy5zZWxlY3RlZCcgfHwgJHN0YXRlLmN1cnJlbnQubmFtZSA9PSAnYXBwLmluZGV4LnNob3cnKSB7XG5cdFx0XHRcdFx0JHN0YXRlLmdvKCdhcHAuaW5kZXguc2hvdy5zZWxlY3RlZCcsIHtcblx0XHRcdFx0XHRcdGluZGV4OiAkc3RhdGUucGFyYW1zLmluZGV4LFxuXHRcdFx0XHRcdFx0aXRlbTogbi5pc29cblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JHN0YXRlLmdvKCdhcHAuaW5kZXguc2hvdycsIHtcblx0XHRcdFx0XHRpbmRleDogJHN0YXRlLnBhcmFtcy5pbmRleFxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9KTtcblx0XHQkc2NvcGUuJHdhdGNoKCd2bS5kaXNwbGF5LnNlbGVjdGVkQ2F0JywgZnVuY3Rpb24obiwgbykge1xuXHRcdFx0aWYgKG4gPT09IG8pIHtcblx0XHRcdFx0cmV0dXJuXG5cdFx0XHR9XG5cdFx0XHRjb25zb2xlLmxvZyhuKTtcblx0XHRcdGlmIChuLmNvbG9yKVxuXHRcdFx0XHR1cGRhdGVDYW52YXMobi5jb2xvcik7XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0dXBkYXRlQ2FudmFzKCdyZ2JhKDEyOCwgMjQzLCAxOTgsMSknKTtcblx0XHRcdH07XG5cdFx0XHR2bS5jYWxjVHJlZSgpO1xuXHRcdFx0LyppZiAodm0uY29tcGFyZS5hY3RpdmUpIHtcblx0XHRcdFx0JHRpbWVvdXQoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdC8vdm0ubXZ0U291cmNlLnNldFN0eWxlKGludmVydGVkU3R5bGUpO1xuXHRcdFx0XHRcdC8vdm0ubXZ0U291cmNlLnJlZHJhdygpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHQvL3ZtLm12dFNvdXJjZS5zZXRTdHlsZShjb3VudHJpZXNTdHlsZSk7XG5cdFx0XHRcdFx0Ly92bS5tdnRTb3VyY2UucmVkcmF3KCk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSovXG5cblx0XHRcdGlmICh2bS5jdXJyZW50Lmlzbykge1xuXHRcdFx0XHRpZiAoJHN0YXRlLnBhcmFtcy5jb3VudHJpZXMpIHtcblx0XHRcdFx0XHQkc3RhdGUuZ28oJ2FwcC5pbmRleC5zaG93LnNlbGVjdGVkLmNvbXBhcmUnLCB7XG5cdFx0XHRcdFx0XHRpbmRleDogbi5uYW1lLFxuXHRcdFx0XHRcdFx0aXRlbTogdm0uY3VycmVudC5pc28sXG5cdFx0XHRcdFx0XHRjb3VudHJpZXM6ICRzdGF0ZS5wYXJhbXMuY291bnRyaWVzXG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQkc3RhdGUuZ28oJ2FwcC5pbmRleC5zaG93LnNlbGVjdGVkJywge1xuXHRcdFx0XHRcdFx0aW5kZXg6IG4ubmFtZSxcblx0XHRcdFx0XHRcdGl0ZW06IHZtLmN1cnJlbnQuaXNvXG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JHN0YXRlLmdvKCdhcHAuaW5kZXguc2hvdycsIHtcblx0XHRcdFx0XHRpbmRleDogbi5uYW1lXG5cdFx0XHRcdH0pXG5cdFx0XHR9XG5cblx0XHR9KTtcblxuXHRcdC8vVE9ETzogTU9WRSBUTyBTRVJWSUNFIE1BUFxuXHRcdCRzY29wZS4kd2F0Y2goJ3ZtLmJib3gnLCBmdW5jdGlvbihuLCBvKSB7XG5cdFx0XHRpZiAobiA9PT0gbykge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0XHQvKnZhciBsYXQgPSBbbi5jb29yZGluYXRlc1swXVswXVsxXSxcblx0XHRcdFx0XHRbbi5jb29yZGluYXRlc1swXVswXVswXV1cblx0XHRcdFx0XSxcblx0XHRcdFx0bG5nID0gW24uY29vcmRpbmF0ZXNbMF1bMl1bMV0sXG5cdFx0XHRcdFx0W24uY29vcmRpbmF0ZXNbMF1bMl1bMF1dXG5cdFx0XHRcdF0qL1xuXHRcdFx0dmFyIHNvdXRoV2VzdCA9IEwubGF0TG5nKG4uY29vcmRpbmF0ZXNbMF1bMF1bMV0sIG4uY29vcmRpbmF0ZXNbMF1bMF1bMF0pLFxuXHRcdFx0XHRub3J0aEVhc3QgPSBMLmxhdExuZyhuLmNvb3JkaW5hdGVzWzBdWzJdWzFdLCBuLmNvb3JkaW5hdGVzWzBdWzJdWzBdKSxcblx0XHRcdFx0Ym91bmRzID0gTC5sYXRMbmdCb3VuZHMoc291dGhXZXN0LCBub3J0aEVhc3QpO1xuXG5cdFx0XHR2YXIgcGFkID0gW1xuXHRcdFx0XHRbMCwgMF0sXG5cdFx0XHRcdFsxMDAsIDEwMF1cblx0XHRcdF07XG5cdFx0XHRpZiAodm0uY29tcGFyZS5hY3RpdmUpIHtcblx0XHRcdFx0cGFkID0gW1xuXHRcdFx0XHRcdFswLCAwXSxcblx0XHRcdFx0XHRbMCwgMF1cblx0XHRcdFx0XTtcblx0XHRcdH1cblx0XHRcdHZtLm1hcC5maXRCb3VuZHMoYm91bmRzLCB7XG5cdFx0XHRcdHBhZGRpbmc6IHBhZFsxXSxcblx0XHRcdFx0bWF4Wm9vbTogNlxuXHRcdFx0fSk7XG5cdFx0fSk7XG5cblx0XHQkc2NvcGUuJG9uKFwiJHN0YXRlQ2hhbmdlU3VjY2Vzc1wiLCBmdW5jdGlvbihldmVudCwgdG9TdGF0ZSwgdG9QYXJhbXMsIGZyb21TdGF0ZSwgZnJvbVBhcmFtcykge1xuXG5cdFx0XHQvKmNvbnNvbGUubG9nKCQpXG5cdFx0XHRpZiAodG9TdGF0ZS5uYW1lID09IFwiYXBwLmluZGV4LnNob3dcIikge1xuXHRcdFx0XHRcdHZtLmN1cnJlbnQgPSBcIlwiO1xuXHRcdFx0fSBlbHNlIGlmICh0b1N0YXRlLm5hbWUgPT0gXCJhcHAuaW5kZXguc2hvdy5zZWxlY3RlZFwiKSB7XG5cblx0XHRcdFx0aWYodG9QYXJhbXMuaW5kZXggIT0gZnJvbVBhcmFtcy5pbmRleCl7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2coJ2FuZGVycycpXG5cdFx0XHRcdH1cblx0XHRcdFx0Y29uc29sZS5sb2codG9QYXJhbXMuaXRlbSk7XG5cdFx0XHRcdHZtLnNldFN0YXRlKHRvUGFyYW1zLml0ZW0pO1xuXHRcdFx0XHRjYWxjUmFuaygpO1xuXHRcdFx0XHQvL3ZtLm12dFNvdXJjZS5vcHRpb25zLm11dGV4VG9nZ2xlID0gdHJ1ZTtcblx0XHRcdFx0RGF0YVNlcnZpY2UuZ2V0T25lKCduYXRpb25zJywgdm0uY3VycmVudC5pc28pLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcblx0XHRcdFx0XHR2bS5jdXJyZW50LmRhdGEgPSBkYXRhO1xuXHRcdFx0XHRcdERhdGFTZXJ2aWNlLmdldE9uZSgnbmF0aW9ucy9iYm94JywgW3ZtLmN1cnJlbnQuaXNvXSkudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuXHRcdFx0XHRcdFx0dm0uYmJveCA9IGRhdGE7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSBlbHNlIGlmICh0b1N0YXRlLm5hbWUgPT0gXCJhcHAuaW5kZXguc2hvdy5zZWxlY3RlZC5jb21wYXJlXCIpIHtcblx0XHRcdFx0dm0uc2V0U3RhdGUodG9QYXJhbXMuaXRlbSk7XG5cdFx0XHRcdC8vJHNjb3BlLmFjdGl2ZVRhYiA9IDI7XG5cdFx0XHRcdC8qRGF0YVNlcnZpY2UuZ2V0T25lKCduYXRpb25zJywgdG9QYXJhbXMuaXRlbSkudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuXHRcdFx0XHRcdHZtLmNvdW50cnkgPSBkYXRhO1xuXHRcdFx0XHRcdERhdGFTZXJ2aWNlLmdldE9uZSgnbmF0aW9ucy9iYm94JywgW3ZtLmNvdW50cnkuaXNvXSkudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuXHRcdFx0XHRcdFx0dm0uYmJveCA9IGRhdGE7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dm0uY3VycmVudCA9IFwiXCI7XG5cdFx0XHR9Ki9cblx0XHR9KTtcblxuXHRcdC8vVE9ETzogTU9WRSBUTyBTRVJWSUNFIE1BUFxuXHRcdGZ1bmN0aW9uIGRyYXdDb3VudHJpZXMoKSB7XG5cdFx0XHRsZWFmbGV0RGF0YS5nZXRNYXAoJ21hcCcpLnRoZW4oZnVuY3Rpb24obWFwKSB7XG5cdFx0XHRcdHZtLm1hcCA9IG1hcDtcblx0XHRcdFx0dm0ubXZ0U291cmNlID0gVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldExheWVyKCk7XG5cdFx0XHRcdCR0aW1lb3V0KGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdGlmICgkc3RhdGUucGFyYW1zLmNvdW50cmllcykge1xuXHRcdFx0XHRcdFx0dm0ubXZ0U291cmNlLm9wdGlvbnMubXV0ZXhUb2dnbGUgPSBmYWxzZTtcblx0XHRcdFx0XHRcdHZtLm12dFNvdXJjZS5zZXRTdHlsZShpbnZlcnRlZFN0eWxlKTtcblx0XHRcdFx0XHRcdHZtLm12dFNvdXJjZS5sYXllcnNbdm0ubXZ0Q291bnRyeUxheWVyR2VvbV0uZmVhdHVyZXNbdm0uY3VycmVudC5pc29dLnNlbGVjdGVkID0gdHJ1ZTtcblx0XHRcdFx0XHRcdHZhciBjb3VudHJpZXMgPSAkc3RhdGUucGFyYW1zLmNvdW50cmllcy5zcGxpdCgnLXZzLScpO1xuXHRcdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKGNvdW50cmllcywgZnVuY3Rpb24oaXNvKSB7XG5cdFx0XHRcdFx0XHRcdHZtLm12dFNvdXJjZS5sYXllcnNbdm0ubXZ0Q291bnRyeUxheWVyR2VvbV0uZmVhdHVyZXNbaXNvXS5zZWxlY3RlZCA9IHRydWU7XG5cdFx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHR2bS5tdnRTb3VyY2Uuc2V0U3R5bGUoY291bnRyaWVzU3R5bGUpO1xuXHRcdFx0XHRcdFx0aWYgKCRzdGF0ZS5wYXJhbXMuaXRlbSkge1xuXHRcdFx0XHRcdFx0XHR2bS5tdnRTb3VyY2UubGF5ZXJzW3ZtLm12dENvdW50cnlMYXllckdlb21dLmZlYXR1cmVzWyRzdGF0ZS5wYXJhbXMuaXRlbV0uc2VsZWN0ZWQgPSB0cnVlO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHQvL3ZtLm12dFNvdXJjZS5yZWRyYXcoKTtcblx0XHRcdFx0fSk7XG5cdFx0XHRcdHZtLm12dFNvdXJjZS5vcHRpb25zLm9uQ2xpY2sgPSBmdW5jdGlvbihldnQsIHQpIHtcblxuXHRcdFx0XHRcdGlmICghdm0uY29tcGFyZS5hY3RpdmUpIHtcblx0XHRcdFx0XHRcdHZhciBjID0gZ2V0TmF0aW9uQnlJc28oZXZ0LmZlYXR1cmUucHJvcGVydGllc1t2bS5pc29fZmllbGRdKTtcblx0XHRcdFx0XHRcdGlmICh0eXBlb2YgY1t2bS5zdHJ1Y3R1cmUubmFtZV0gIT0gXCJ1bmRlZmluZWRcIikge1xuXHRcdFx0XHRcdFx0XHR2bS5jdXJyZW50ID0gZ2V0TmF0aW9uQnlJc28oZXZ0LmZlYXR1cmUucHJvcGVydGllc1t2bS5pc29fZmllbGRdKTtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdHRvYXN0ci5lcnJvcignTm8gaW5mbyBhYm91dCB0aGlzIGxvY2F0aW9uIScsIGV2dC5mZWF0dXJlLnByb3BlcnRpZXMuYWRtaW4pO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHR2YXIgYyA9IGdldE5hdGlvbkJ5SXNvKGV2dC5mZWF0dXJlLnByb3BlcnRpZXNbdm0uaXNvX2ZpZWxkXSk7XG5cdFx0XHRcdFx0XHRpZiAodHlwZW9mIGNbdm0uc3RydWN0dXJlLm5hbWVdICE9IFwidW5kZWZpbmVkXCIpIHtcblx0XHRcdFx0XHRcdFx0dm0udG9nZ2xlQ291bnRyaWVMaXN0KGMpO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0dG9hc3RyLmVycm9yKCdObyBpbmZvIGFib3V0IHRoaXMgbG9jYXRpb24hJywgZXZ0LmZlYXR1cmUucHJvcGVydGllcy5hZG1pbik7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9XG5cdH0pO1xufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdJbmRleGJhc2VDdHJsJywgZnVuY3Rpb24gKCRzY29wZSwkc3RhdGUpIHtcblx0XHQvL1xuICAgICRzY29wZS4kc3RhdGUgPSAkc3RhdGU7XG5cdH0pO1xufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdJbmRleENoZWNrQ3RybCcsIGZ1bmN0aW9uICgkc2NvcGUsICRzdGF0ZSwgJGZpbHRlciwgJHRpbWVvdXQsIHRvYXN0ciwgRGlhbG9nU2VydmljZSwgSW5kZXhTZXJ2aWNlKSB7XG5cblxuXHRcdHZhciB2bSA9IHRoaXM7XG5cdFx0dm0uZGF0YSA9IEluZGV4U2VydmljZS5nZXREYXRhKCk7XG5cdFx0dm0ubWV0YSA9IEluZGV4U2VydmljZS5nZXRNZXRhKCk7XG5cdFx0dm0uZXJyb3JzID0gSW5kZXhTZXJ2aWNlLmdldEVycm9ycygpO1xuXHRcdHZtLmlzb19lcnJvcnMgPSBJbmRleFNlcnZpY2UuZ2V0SXNvRXJyb3JzKCk7XG5cdFx0dm0uc2VsZWN0ZWQgPSBbXTtcbiAgICB2bS55ZWFyZmlsdGVyID0gJyc7XG5cdFx0dm0uZGVsZXRlRGF0YSA9IGRlbGV0ZURhdGE7XG5cdFx0dm0uZGVsZXRlU2VsZWN0ZWQgPSBkZWxldGVTZWxlY3RlZDtcblx0XHR2bS5kZWxldGVDb2x1bW4gPSBkZWxldGVDb2x1bW47XG5cdFx0dm0ub25PcmRlckNoYW5nZSA9IG9uT3JkZXJDaGFuZ2U7XG5cdFx0dm0ub25QYWdpbmF0aW9uQ2hhbmdlID0gb25QYWdpbmF0aW9uQ2hhbmdlO1xuXHRcdHZtLmNoZWNrRm9yRXJyb3JzID0gY2hlY2tGb3JFcnJvcnM7XG5cdFx0dm0uc2VsZWN0RXJyb3JzID0gc2VsZWN0RXJyb3JzO1xuICAgIHZtLnNlYXJjaEZvckVycm9ycyA9IHNlYXJjaEZvckVycm9ycztcblx0XHR2bS5zaG93VXBsb2FkQ29udGFpbmVyID0gZmFsc2U7XG5cdFx0Ly92bS5lZGl0Q29sdW1uRGF0YSA9IGVkaXRDb2x1bW5EYXRhO1xuXHRcdHZtLmVkaXRSb3cgPSBlZGl0Um93O1xuICAgIHZtLnllYXJzID0gW107XG5cdFx0dm0ucXVlcnkgPSB7XG5cdFx0XHRmaWx0ZXI6ICcnLFxuXHRcdFx0b3JkZXI6ICctZXJyb3JzJyxcblx0XHRcdGxpbWl0OiAxNSxcblx0XHRcdHBhZ2U6IDFcblx0XHR9O1xuXG5cdFx0YWN0aXZhdGUoKTtcblxuXHRcdGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xuXHRcdFx0Y2hlY2tEYXRhKCk7XG4gICAgXHRnZXRZZWFycygpO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGNoZWNrRGF0YSgpIHtcblx0XHRcdGlmICghdm0uZGF0YSkge1xuXHRcdFx0XHQkc3RhdGUuZ28oJ2FwcC5pbmRleC5jcmVhdGUnKTtcblx0XHRcdH1cblx0XHR9XG4gICAgZnVuY3Rpb24gZ2V0WWVhcnMoKXtcblx0XHRcdCR0aW1lb3V0KGZ1bmN0aW9uKCl7XG5cdFx0XHRcdHZhciBkYXQgPSAoJGZpbHRlcignZ3JvdXBCeScpKHZtLmRhdGEsICdkYXRhLicrdm0ubWV0YS5jb3VudHJ5X2ZpZWxkICkpO1xuXHQgICAgICB2bS55ZWFycyA9IFtdO1xuXHRcdFx0XHR2YXIgbGVuZ3RoID0gMDtcblx0XHRcdFx0dmFyIGluZGV4ID0gbnVsbDtcblx0XHRcdCAgYW5ndWxhci5mb3JFYWNoKGRhdCxmdW5jdGlvbihlbnRyeSwgaSl7XG5cdFx0XHRcdFx0aWYoZW50cnkubGVuZ3RoID4gbGVuZ3RoKXtcblx0XHRcdFx0XHRcdGluZGV4ID0gaVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdCAgICAgIGFuZ3VsYXIuZm9yRWFjaChkYXRbaW5kZXhdLGZ1bmN0aW9uKGVudHJ5KXtcblx0ICAgICAgICB2bS55ZWFycy5wdXNoKGVudHJ5LmRhdGFbdm0ubWV0YS55ZWFyX2ZpZWxkXSlcblx0ICAgICAgfSk7XG5cdFx0XHRcdHZtLnllYXJmaWx0ZXIgPSB2bS55ZWFyc1swXTtcblx0XHRcdH0pO1xuXG5cbiAgICB9XG5cdFx0ZnVuY3Rpb24gc2VhcmNoKHByZWRpY2F0ZSkge1xuXHRcdFx0dm0uZmlsdGVyID0gcHJlZGljYXRlO1xuXHRcdH07XG5cblx0XHRmdW5jdGlvbiBvbk9yZGVyQ2hhbmdlKG9yZGVyKSB7XG5cdFx0XHRyZXR1cm4gdm0uZGF0YSA9ICRmaWx0ZXIoJ29yZGVyQnknKSh2bS5kYXRhLCBbb3JkZXJdLCB0cnVlKVxuXHRcdH07XG5cblx0XHRmdW5jdGlvbiBvblBhZ2luYXRpb25DaGFuZ2UocGFnZSwgbGltaXQpIHtcblx0XHRcdC8vY29uc29sZS5sb2cocGFnZSwgbGltaXQpO1xuXHRcdFx0Ly9yZXR1cm4gJG51dHJpdGlvbi5kZXNzZXJ0cy5nZXQoJHNjb3BlLnF1ZXJ5LCBzdWNjZXNzKS4kcHJvbWlzZTtcblx0XHR9O1xuXG5cdFx0ZnVuY3Rpb24gY2hlY2tGb3JFcnJvcnMoaXRlbSkge1xuXHRcdFx0cmV0dXJuIGl0ZW0uZXJyb3JzLmxlbmd0aCA+IDAgPyAnbWQtd2FybicgOiAnJztcblx0XHR9XG5cblx0XHQvKmZ1bmN0aW9uIGVkaXRDb2x1bW5EYXRhKGUsIGtleSl7XG5cdFx0ICB2bS50b0VkaXQgPSBrZXk7XG5cdFx0ICBEaWFsb2dTZXJ2aWNlLmZyb21UZW1wbGF0ZSgnZWRpdGNvbHVtbicsICRzY29wZSk7XG5cdFx0fSovXG5cdFx0ZnVuY3Rpb24gZGVsZXRlQ29sdW1uKGUsIGtleSkge1xuXHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLmRhdGEsIGZ1bmN0aW9uIChpdGVtLCBrKSB7XG5cdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChpdGVtLmRhdGEsIGZ1bmN0aW9uIChmaWVsZCwgbCkge1xuXHRcdFx0XHRcdGlmIChsID09IGtleSkge1xuXHRcdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLmRhdGFba10uZXJyb3JzLCBmdW5jdGlvbihlcnJvciwgaSl7XG5cdFx0XHRcdFx0XHRcdGlmKGVycm9yLmNvbHVtbiA9PSBrZXkpe1xuXHRcdFx0XHRcdFx0XHRcdGlmIChlcnJvci50eXBlID09IDIgfHwgZXJyb3IudHlwZSA9PSAzKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRJbmRleFNlcnZpY2UucmVkdWNlSXNvRXJyb3IoKTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0SW5kZXhTZXJ2aWNlLnJlZHVjZUVycm9yKCk7XG5cdFx0XHRcdFx0XHRcdFx0dm0uZGF0YVtrXS5lcnJvcnMuc3BsaWNlKGksIDEpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0ZGVsZXRlIHZtLmRhdGFba10uZGF0YVtrZXldO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSlcblx0XHRcdH0pO1xuXHRcdFx0SW5kZXhTZXJ2aWNlLnNldFRvTG9jYWxTdG9yYWdlKCk7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gZGVsZXRlU2VsZWN0ZWQoKSB7XG5cdFx0XHRhbmd1bGFyLmZvckVhY2godm0uc2VsZWN0ZWQsIGZ1bmN0aW9uIChpdGVtLCBrZXkpIHtcblx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKGl0ZW0uZXJyb3JzLCBmdW5jdGlvbiAoZXJyb3IsIGspIHtcblx0XHRcdFx0XHRpZiAoZXJyb3IudHlwZSA9PSAyIHx8IGVycm9yLnR5cGUgPT0gMykge1xuXHRcdFx0XHRcdFx0dm0uaXNvX2Vycm9ycy0tO1xuXHRcdFx0XHRcdFx0SW5kZXhTZXJ2aWNlLnJlZHVjZUlzb0Vycm9yKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHZtLmVycm9ycy0tO1xuXHRcdFx0XHRcdEluZGV4U2VydmljZS5yZWR1Y2VFcnJvcigpO1xuXHRcdFx0XHR9KVxuXHRcdFx0XHR2bS5kYXRhLnNwbGljZSh2bS5kYXRhLmluZGV4T2YoaXRlbSksIDEpO1xuXHRcdFx0fSk7XG5cdFx0XHR2bS5zZWxlY3RlZCA9IFtdO1xuXHRcdFx0SW5kZXhTZXJ2aWNlLnNldFRvTG9jYWxTdG9yYWdlKCk7XG5cdFx0XHRpZiAodm0uZGF0YS5sZW5ndGggPT0gMCkge1xuXHRcdFx0XHR2bS5kZWxldGVEYXRhKCk7XG5cdFx0XHRcdCRzdGF0ZS5nbygnYXBwLmluZGV4LmNyZWF0ZScpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIHNlbGVjdEVycm9ycygpIHtcblx0XHRcdHZtLnNlbGVjdGVkID0gW107XG5cdFx0XHRhbmd1bGFyLmZvckVhY2godm0uZGF0YSwgZnVuY3Rpb24gKGl0ZW0sIGtleSkge1xuXHRcdFx0XHRpZiAoaXRlbS5lcnJvcnMubGVuZ3RoKSB7XG5cdFx0XHRcdFx0dm0uc2VsZWN0ZWQucHVzaChpdGVtKTtcblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBlZGl0Um93KCkge1xuXHRcdFx0dm0ucm93ID0gdm0uc2VsZWN0ZWRbMF07XG5cdFx0XHREaWFsb2dTZXJ2aWNlLmZyb21UZW1wbGF0ZSgnZWRpdHJvdycsICRzY29wZSk7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gZGVsZXRlRGF0YSgpIHtcblx0XHRcdHZtLmRhdGEgPSBbXTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBzZWFyY2hGb3JFcnJvcnMoKSB7XG5cdFx0XHRhbmd1bGFyLmZvckVhY2godm0uZGF0YSwgZnVuY3Rpb24gKHJvdywgaykge1xuXHRcdFx0XHRhbmd1bGFyLmZvckVhY2gocm93LmRhdGEsIGZ1bmN0aW9uIChpdGVtLCBrZXkpIHtcblx0XHRcdFx0XHRpZiAoaXNOYU4oaXRlbSkgfHwgaXRlbSA8IDApIHtcblx0XHRcdFx0XHRcdGlmIChpdGVtLnRvU3RyaW5nKCkudG9VcHBlckNhc2UoKSA9PSBcIiNOQVwiIHx8IGl0ZW0gPCAwIHx8IGl0ZW0udG9TdHJpbmcoKS50b1VwcGVyQ2FzZSgpLmluZGV4T2YoJ04vQScpID4gLTEpIHtcblx0XHRcdFx0XHRcdFx0dmFyIGVycm9yID0ge1xuXHRcdFx0XHRcdFx0XHRcdHR5cGU6IFwiMVwiLFxuXHRcdFx0XHRcdFx0XHRcdG1lc3NhZ2U6IFwiRmllbGQgaW4gcm93IGlzIG5vdCB2YWxpZCBmb3IgZGF0YWJhc2UgdXNlIVwiLFxuXHRcdFx0XHRcdFx0XHRcdGNvbHVtbjoga2V5LFxuXHRcdFx0XHRcdFx0XHRcdHZhbHVlOiBpdGVtXG5cdFx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0XHRcdHJvdy5lcnJvcnMucHVzaChlcnJvcilcblx0XHRcdFx0XHRcdFx0dm0uZXJyb3JzLnB1c2goZXJyb3IpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHR9KTtcblx0XHR9XG5cblx0fSk7XG5cblxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0luZGV4Q2hlY2tTaWRlYmFyQ3RybCcsIGZ1bmN0aW9uKCRyb290U2NvcGUsICRzY29wZSwgJHN0YXRlLCBJbmRleFNlcnZpY2UsIERhdGFTZXJ2aWNlLCBEaWFsb2dTZXJ2aWNlLCB0b2FzdHIpIHtcblx0XHR2YXIgdm0gPSB0aGlzO1xuXHRcdHZtLmRhdGEgPSBJbmRleFNlcnZpY2UuZ2V0RGF0YSgpO1xuXHRcdHZtLm1ldGEgPSBJbmRleFNlcnZpY2UuZ2V0TWV0YSgpO1xuXHRcdHZtLmVycm9ycyA9IEluZGV4U2VydmljZS5nZXRFcnJvcnMoKTtcblx0XHR2bS5pc29fZXJyb3JzID0gSW5kZXhTZXJ2aWNlLmdldElzb0Vycm9ycygpO1xuXHRcdHZtLmNsZWFyRXJyb3JzID0gY2xlYXJFcnJvcnM7XG5cdFx0dm0uZmV0Y2hJc28gPSBmZXRjaElzbztcblxuXHRcdGFjdGl2YXRlKCk7XG5cblx0XHRmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcblxuXHRcdFx0Ly92bS5teURhdGEgPSBEYXRhU2VydmljZS5nZXRBbGwoJ21lL2RhdGEnKTtcblx0XHRcdC8vY2hlY2tNeURhdGEoKTtcblx0XHR9XG5cblx0XHQvKmZ1bmN0aW9uIGNoZWNrTXlEYXRhKCkge1xuXHRcdFx0dm0uZXh0ZW5kaW5nQ2hvaWNlcyA9IFtdO1xuXHRcdFx0aWYgKHZtLmRhdGEubGVuZ3RoKSB7XG5cdFx0XHRcdHZtLm15RGF0YS50aGVuKGZ1bmN0aW9uKGltcG9ydHMpIHtcblx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2goaW1wb3J0cywgZnVuY3Rpb24oZW50cnkpIHtcblx0XHRcdFx0XHRcdHZhciBmb3VuZCA9IDA7XG5cdFx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2godm0uZGF0YVswXS5tZXRhLmZpZWxkcywgZnVuY3Rpb24oZmllbGQpIHtcblx0XHRcdFx0XHRcdFx0dmFyIGNvbHVtbnMgPSBKU09OLnBhcnNlKGVudHJ5Lm1ldGFfZGF0YSk7XG5cdFx0XHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChjb2x1bW5zLCBmdW5jdGlvbihjb2x1bW4pIHtcblx0XHRcdFx0XHRcdFx0XHRpZiAoY29sdW1uLmNvbHVtbiA9PSBmaWVsZCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0Zm91bmQrKztcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdGlmIChmb3VuZCA+PSB2bS5kYXRhWzBdLm1ldGEuZmllbGRzLmxlbmd0aCAtIDMpIHtcblx0XHRcdFx0XHRcdFx0dm0uZXh0ZW5kaW5nQ2hvaWNlcy5wdXNoKGVudHJ5KTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdGlmICh2bS5leHRlbmRpbmdDaG9pY2VzLmxlbmd0aCkge1xuXHRcdFx0XHRcdFx0aWYodm0ubWV0YS55ZWFyX2ZpZWxkKXtcblx0XHRcdFx0XHRcdFx0dm0ubWV0YS55ZWFyID0gdm0uZGF0YVswXS5kYXRhWzBdW3ZtLm1ldGEueWVhcl9maWVsZF07XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHREaWFsb2dTZXJ2aWNlLmZyb21UZW1wbGF0ZSgnZXh0ZW5kRGF0YScsICRzY29wZSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9Ki9cblxuXHRcdGZ1bmN0aW9uIGNsZWFyRXJyb3JzKCkge1xuXHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLmRhdGEsIGZ1bmN0aW9uKHJvdywga2V5KSB7XG5cdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChyb3cuZGF0YSwgZnVuY3Rpb24oaXRlbSwgaykge1xuXHRcdFx0XHRcdGlmIChpc05hTihpdGVtKSB8fCBpdGVtIDwgMCkge1xuXHRcdFx0XHRcdFx0aWYgKCBpdGVtLnRvU3RyaW5nKCkudG9VcHBlckNhc2UoKSA9PSBcIiNOQVwiLyogfHwgaXRlbSA8IDAqLyB8fCBpdGVtLnRvU3RyaW5nKCkudG9VcHBlckNhc2UoKS5pbmRleE9mKCdOL0EnKSA+IC0xKSB7XG5cdFx0XHRcdFx0XHRcdHZtLmRhdGFba2V5XS5kYXRhW2tdID0gbnVsbDtcblx0XHRcdFx0XHRcdFx0cm93LmVycm9ycy5zcGxpY2UoMCwgMSk7XG5cdFx0XHRcdFx0XHRcdHZtLmVycm9ycy5zcGxpY2UoMCwgMSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdFx0aWYgKCFyb3cuZGF0YVt2bS5tZXRhLmlzb19maWVsZF0pIHtcblx0XHRcdFx0XHR2YXIgZXJyb3IgPSB7XG5cdFx0XHRcdFx0XHR0eXBlOiBcIjJcIixcblx0XHRcdFx0XHRcdG1lc3NhZ2U6IFwiSXNvIGZpZWxkIGlzIG5vdCB2YWxpZCFcIixcblx0XHRcdFx0XHRcdHZhbHVlOiByb3cuZGF0YVt2bS5tZXRhLmlzb19maWVsZF0sXG5cdFx0XHRcdFx0XHRjb2x1bW46IHZtLm1ldGEuaXNvX2ZpZWxkLFxuXHRcdFx0XHRcdFx0cm93OiBrZXlcblx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdHZhciBlcnJvckZvdW5kID0gZmFsc2U7XG5cdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKHJvdy5lcnJvcnMsIGZ1bmN0aW9uKGVycm9yLCBrZXkpIHtcblx0XHRcdFx0XHRcdGlmIChlcnJvci50eXBlID09IDIpIHtcblx0XHRcdFx0XHRcdFx0ZXJyb3JGb3VuZCA9IHRydWU7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRpZiAoIWVycm9yRm91bmQpIHtcblx0XHRcdFx0XHRcdHJvdy5lcnJvcnMucHVzaChlcnJvcik7XG5cdFx0XHRcdFx0XHR2bS5pc29fZXJyb3JzLnB1c2goZXJyb3IpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0XHRJbmRleFNlcnZpY2Uuc2V0VG9Mb2NhbFN0b3JhZ2UoKTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBmZXRjaElzbygpIHtcblxuXHRcdFx0aWYgKCF2bS5tZXRhLmlzb19maWVsZCkge1xuXHRcdFx0XHR0b2FzdHIuZXJyb3IoJ0NoZWNrIHlvdXIgc2VsZWN0aW9uIGZvciB0aGUgSVNPIGZpZWxkJywgJ0NvbHVtbiBub3Qgc3BlY2lmaWVkIScpO1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cdFx0XHRpZiAoIXZtLm1ldGEuY291bnRyeV9maWVsZCkge1xuXHRcdFx0XHR0b2FzdHIuZXJyb3IoJ0NoZWNrIHlvdXIgc2VsZWN0aW9uIGZvciB0aGUgQ09VTlRSWSBmaWVsZCcsICdDb2x1bW4gbm90IHNwZWNpZmllZCEnKTtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXHRcdFx0aWYgKHZtLm1ldGEuY291bnRyeV9maWVsZCA9PSB2bS5tZXRhLmlzb19maWVsZCkge1xuXHRcdFx0XHR0b2FzdHIuZXJyb3IoJ0lTTyBmaWVsZCBhbmQgQ09VTlRSWSBmaWVsZCBjYW4gbm90IGJlIHRoZSBzYW1lJywgJ1NlbGVjdGlvbiBlcnJvciEnKTtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXHRcdFx0JHJvb3RTY29wZS5zdGF0ZUlzTG9hZGluZyA9IHRydWU7XG5cdFx0XHR2bS5ub3RGb3VuZCA9IFtdO1xuXHRcdFx0dmFyIGVudHJpZXMgPSBbXTtcblx0XHRcdHZhciBpc29DaGVjayA9IDA7XG5cdFx0XHR2YXIgaXNvVHlwZSA9ICdpc28tMzE2Ni0yJztcblx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5kYXRhLCBmdW5jdGlvbihpdGVtLCBrZXkpIHtcblx0XHRcdFx0aWYgKGl0ZW0uZGF0YVt2bS5tZXRhLmlzb19maWVsZF0pIHtcblx0XHRcdFx0XHRpc29DaGVjayArPSBpdGVtLmRhdGFbdm0ubWV0YS5pc29fZmllbGRdLmxlbmd0aCA9PSAzID8gMSA6IDA7XG5cdFx0XHRcdH1cblx0XHRcdFx0c3dpdGNoIChpdGVtLmRhdGFbdm0ubWV0YS5jb3VudHJ5X2ZpZWxkXSkge1xuXHRcdFx0XHRcdGNhc2UgJ0NhYm8gVmVyZGUnOlxuXHRcdFx0XHRcdFx0aXRlbS5kYXRhW3ZtLm1ldGEuY291bnRyeV9maWVsZF0gPSAnQ2FwZSBWZXJkZSc7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlIFwiRGVtb2NyYXRpYyBQZW9wbGVzIFJlcHVibGljIG9mIEtvcmVhXCI6XG5cdFx0XHRcdFx0XHRpdGVtLmRhdGFbdm0ubWV0YS5jb3VudHJ5X2ZpZWxkXSA9IFwiRGVtb2NyYXRpYyBQZW9wbGUncyBSZXB1YmxpYyBvZiBLb3JlYVwiO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSBcIkNvdGUgZCdJdm9pcmVcIjpcblx0XHRcdFx0XHRcdGl0ZW0uZGF0YVt2bS5tZXRhLmNvdW50cnlfZmllbGRdID0gXCJJdm9yeSBDb2FzdFwiO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSBcIkxhbyBQZW9wbGVzIERlbW9jcmF0aWMgUmVwdWJsaWNcIjpcblx0XHRcdFx0XHRcdGl0ZW0uZGF0YVt2bS5tZXRhLmNvdW50cnlfZmllbGRdID0gXCJMYW8gUGVvcGxlJ3MgRGVtb2NyYXRpYyBSZXB1YmxpY1wiO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVudHJpZXMucHVzaCh7XG5cdFx0XHRcdFx0aXNvOiBpdGVtLmRhdGFbdm0ubWV0YS5pc29fZmllbGRdLFxuXHRcdFx0XHRcdG5hbWU6IGl0ZW0uZGF0YVt2bS5tZXRhLmNvdW50cnlfZmllbGRdXG5cdFx0XHRcdH0pO1xuXHRcdFx0fSk7XG5cdFx0XHR2YXIgaXNvVHlwZSA9IGlzb0NoZWNrID49IChlbnRyaWVzLmxlbmd0aCAvIDIpID8gJ2lzby0zMTY2LTEnIDogJ2lzby0zMTY2LTInO1xuXHRcdFx0SW5kZXhTZXJ2aWNlLnJlc2V0VG9TZWxlY3QoKTtcblx0XHRcdERhdGFTZXJ2aWNlLnBvc3QoJ2NvdW50cmllcy9ieUlzb05hbWVzJywge1xuXHRcdFx0XHRkYXRhOiBlbnRyaWVzLFxuXHRcdFx0XHRpc286IGlzb1R5cGVcblx0XHRcdH0pLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcblx0XHRcdFx0JHJvb3RTY29wZS5zdGF0ZUlzTG9hZGluZyA9IGZhbHNlO1xuXHRcdFx0XHRhbmd1bGFyLmZvckVhY2gocmVzcG9uc2UsIGZ1bmN0aW9uKGNvdW50cnksIGtleSkge1xuXHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5kYXRhLCBmdW5jdGlvbihpdGVtLCBrKSB7XG5cdFx0XHRcdFx0XHRpZiAoY291bnRyeS5uYW1lID09IGl0ZW0uZGF0YVt2bS5tZXRhLmNvdW50cnlfZmllbGRdKSB7XG5cdFx0XHRcdFx0XHRcdGlmIChjb3VudHJ5LmRhdGEubGVuZ3RoID4gMSkge1xuXHRcdFx0XHRcdFx0XHRcdHZhciB0b1NlbGVjdCA9IHtcblx0XHRcdFx0XHRcdFx0XHRcdGVudHJ5OiBpdGVtLFxuXHRcdFx0XHRcdFx0XHRcdFx0b3B0aW9uczogY291bnRyeS5kYXRhXG5cdFx0XHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdFx0XHRJbmRleFNlcnZpY2UuYWRkVG9TZWxlY3QodG9TZWxlY3QpO1xuXHRcdFx0XHRcdFx0XHR9IGVsc2UgaWYoY291bnRyeS5kYXRhLmxlbmd0aCA9PSAxKXtcblx0XHRcdFx0XHRcdFx0XHRpZiAodHlwZW9mIGNvdW50cnkuZGF0YSAhPSBcInVuZGVmaW5lZFwiKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHR2bS5kYXRhW2tdLmRhdGFbdm0ubWV0YS5pc29fZmllbGRdID0gY291bnRyeS5kYXRhWzBdLmlzbztcblx0XHRcdFx0XHRcdFx0XHRcdHZtLmRhdGFba10uZGF0YVt2bS5tZXRhLmNvdW50cnlfZmllbGRdID0gY291bnRyeS5kYXRhWzBdLmFkbWluO1xuXHRcdFx0XHRcdFx0XHRcdFx0aWYgKGl0ZW0uZXJyb3JzLmxlbmd0aCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2goaXRlbS5lcnJvcnMsIGZ1bmN0aW9uKGVycm9yLCBlKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKGVycm9yLnR5cGUgPT0gMiB8fCBlcnJvci50eXBlID09IDMpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHZtLmlzb19lcnJvcnMuc3BsaWNlKDAsIDEpO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aXRlbS5lcnJvcnMuc3BsaWNlKGUsIDEpO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoZXJyb3IudHlwZSA9PSAxKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoZXJyb3IuY29sdW1uID09IHZtLm1ldGEuaXNvX2ZpZWxkKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHZtLmVycm9ycy5zcGxpY2UoMCwgMSk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGl0ZW0uZXJyb3JzLnNwbGljZShlLCAxKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHRcdC8vY29uc29sZS5sb2codm0uZGF0YVtrXSk7XG5cdFx0XHRcdFx0XHRcdFx0XHR2YXIgZXJyb3IgPSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHR5cGU6IFwiM1wiLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRtZXNzYWdlOiBcIkNvdWxkIG5vdCBsb2NhdGUgYSB2YWxpZCBpc28gbmFtZSFcIixcblx0XHRcdFx0XHRcdFx0XHRcdFx0Y29sdW1uOiB2bS5tZXRhLmNvdW50cnlfZmllbGRcblx0XHRcdFx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0XHRcdFx0XHR2YXIgZXJyb3JGb3VuZCA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLmRhdGFba10uZXJyb3JzLCBmdW5jdGlvbihlcnJvciwgaSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRjb25zb2xlLmxvZyhlcnJvcik7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlmIChlcnJvci50eXBlID09IDMpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlcnJvckZvdW5kID0gdHJ1ZTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRcdFx0XHRcdGlmICghZXJyb3JGb3VuZCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRJbmRleFNlcnZpY2UuYWRkSXNvRXJyb3IoZXJyb3IpO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRpdGVtLmVycm9ycy5wdXNoKGVycm9yKTtcblx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fSk7XG5cdFx0XHRcdHZtLmlzb19jaGVja2VkID0gdHJ1ZTtcblx0XHRcdFx0SW5kZXhTZXJ2aWNlLnNldFRvTG9jYWxTdG9yYWdlKCk7XG5cdFx0XHRcdGlmIChJbmRleFNlcnZpY2UuZ2V0VG9TZWxlY3QoKS5sZW5ndGgpIHtcblx0XHRcdFx0XHREaWFsb2dTZXJ2aWNlLmZyb21UZW1wbGF0ZSgnc2VsZWN0aXNvZmV0Y2hlcnMnKTtcblx0XHRcdFx0fVxuXHRcdFx0fSwgZnVuY3Rpb24ocmVzcG9uc2UpIHtcblx0XHRcdFx0JHJvb3RTY29wZS5zdGF0ZUlzTG9hZGluZyA9IGZhbHNlO1xuXHRcdFx0XHR0b2FzdHIuZXJyb3IoJ1BsZWFzZSBjaGVjayB5b3VyIGZpZWxkIHNlbGVjdGlvbnMnLCByZXNwb25zZS5kYXRhLm1lc3NhZ2UpO1xuXHRcdFx0fSk7XG5cblx0XHR9XG5cdFx0dm0uZXh0ZW5kRGF0YSA9IGV4dGVuZERhdGE7XG5cblx0XHRmdW5jdGlvbiBleHRlbmREYXRhKCkge1xuXHRcdFx0dmFyIGluc2VydERhdGEgPSB7XG5cdFx0XHRcdGRhdGE6IFtdXG5cdFx0XHR9O1xuXHRcdFx0dmFyIG1ldGEgPSBbXSxcblx0XHRcdFx0ZmllbGRzID0gW107XG5cdFx0XHRhbmd1bGFyLmZvckVhY2godm0uZGF0YSwgZnVuY3Rpb24oaXRlbSwga2V5KSB7XG5cdFx0XHRcdGlmIChpdGVtLmVycm9ycy5sZW5ndGggPT0gMCkge1xuXHRcdFx0XHRcdGl0ZW0uZGF0YVswXS55ZWFyID0gdm0ubWV0YS55ZWFyO1xuXHRcdFx0XHRcdGlmKHZtLm1ldGEueWVhcl9maWVsZCAmJiB2bS5tZXRhLnllYXJfZmllbGQgIT0gXCJ5ZWFyXCIpIHtcblx0XHRcdFx0XHRcdGRlbGV0ZSBpdGVtLmRhdGFbdm0ubWV0YS55ZWFyX2ZpZWxkXTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aW5zZXJ0RGF0YS5kYXRhLnB1c2goaXRlbS5kYXRhKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHR0b2FzdHIuZXJyb3IoJ1RoZXJlIGFyZSBzb21lIGVycm9ycyBsZWZ0IScsICdIdWNoIScpO1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0XHRjb25zb2xlLmxvZyhpbnNlcnREYXRhKTtcblx0XHRcdERhdGFTZXJ2aWNlLnBvc3QoJ2RhdGEvdGFibGVzLycgKyB2bS5hZGREYXRhVG8udGFibGVfbmFtZSArICcvaW5zZXJ0JywgaW5zZXJ0RGF0YSkudGhlbihmdW5jdGlvbihyZXMpIHtcblx0XHRcdFx0aWYgKHJlcyA9PSB0cnVlKSB7XG5cdFx0XHRcdFx0dG9hc3RyLnN1Y2Nlc3MoaW5zZXJ0RGF0YS5kYXRhLmxlbmd0aCArICcgaXRlbXMgaW1wb3J0ZXQgdG8gJyArIHZtLm1ldGEubmFtZSwgJ1N1Y2Nlc3MnKTtcblx0XHRcdFx0XHR2bS5kYXRhID0gSW5kZXhTZXJ2aWNlLmNsZWFyKCk7XG5cdFx0XHRcdFx0JHN0YXRlLmdvKCdhcHAuaW5kZXgubXlkYXRhJyk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH1cblxuXHR9KTtcbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignSW5kZXhGaW5hbEN0cmwnLCBmdW5jdGlvbiAoJHN0YXRlLCBJbmRleFNlcnZpY2UsIERhdGFTZXJ2aWNlLCB0b2FzdHIpIHtcblx0XHQvL1xuXHRcdHZhciB2bSA9IHRoaXM7XG5cdFx0dm0uZGF0YSA9IEluZGV4U2VydmljZS5nZXREYXRhKCk7XG5cdFx0dm0ubWV0YSA9IEluZGV4U2VydmljZS5nZXRNZXRhKCk7XG5cdFx0dm0uZXJyb3JzID0gSW5kZXhTZXJ2aWNlLmdldEVycm9ycygpO1xuXHRcdHZtLmluZGljYXRvcnMgPSBJbmRleFNlcnZpY2UuZ2V0SW5kaWNhdG9ycygpO1xuXHRcdHZtLnNhdmVEYXRhID0gc2F2ZURhdGE7XG5cblxuXHRcdGFjdGl2YXRlKCk7XG5cblx0XHRmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcblx0XHRcdC8qaWYgKHZtLm1ldGEueWVhcl9maWVsZCkge1xuXHRcdFx0XHR2bS5tZXRhLnllYXIgPSB2bS5kYXRhWzBdLmRhdGFbdm0ubWV0YS55ZWFyX2ZpZWxkXTtcblx0XHRcdH0qL1xuXHRcdFx0Y2hlY2tEYXRhKCk7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gY2hlY2tEYXRhKCkge1xuXHRcdFx0aWYgKCF2bS5kYXRhKSB7XG5cdFx0XHRcdCRzdGF0ZS5nbygnYXBwLmluZGV4LmNyZWF0ZScpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIHNhdmVEYXRhKHZhbGlkKSB7XG5cdFx0XHRpZiAodmFsaWQpIHtcblx0XHRcdFx0dmFyIGluc2VydERhdGEgPSB7XG5cdFx0XHRcdFx0ZGF0YTogW11cblx0XHRcdFx0fTtcblx0XHRcdFx0dmFyIG5vWWVhcnMgPSBbXTtcblx0XHRcdFx0dmFyIGluc2VydE1ldGEgPSBbXSxcblx0XHRcdFx0XHRmaWVsZHMgPSBbXTtcblx0XHRcdFx0dm0ubG9hZGluZyA9IHRydWU7XG5cdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5kYXRhLCBmdW5jdGlvbiAoaXRlbSwga2V5KSB7XG5cdFx0XHRcdFx0aWYgKGl0ZW0uZXJyb3JzLmxlbmd0aCA9PSAwKSB7XG5cdFx0XHRcdFx0XHRpZihpdGVtLmRhdGFbdm0ubWV0YS55ZWFyX2ZpZWxkXSl7XG5cdFx0XHRcdFx0XHRcdGl0ZW0uZGF0YS55ZWFyID0gaXRlbS5kYXRhW3ZtLm1ldGEueWVhcl9maWVsZF07XG5cblx0XHRcdFx0XHRcdFx0aWYodm0ubWV0YS55ZWFyX2ZpZWxkICYmIHZtLm1ldGEueWVhcl9maWVsZCAhPSBcInllYXJcIikge1xuXHRcdFx0XHRcdFx0XHRcdGRlbGV0ZSBpdGVtLmRhdGFbdm0ubWV0YS55ZWFyX2ZpZWxkXTtcblx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRcdHZtLm1ldGEuaXNvX3R5cGUgPSBpdGVtLmRhdGFbdm0ubWV0YS5pc29fZmllbGRdLmxlbmd0aCA9PSAzID8gJ2lzby0zMTY2LTEnIDogJ2lzby0zMTY2LTInO1xuXHRcdFx0XHRcdFx0XHRpbnNlcnREYXRhLmRhdGEucHVzaChpdGVtLmRhdGEpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0ZWxzZXtcblx0XHRcdFx0XHRcdFx0bm9ZZWFycy5wdXNoKGl0ZW0pO1xuXHRcdFx0XHRcdFx0fVxuXG5cblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0dG9hc3RyLmVycm9yKCdUaGVyZSBhcmUgc29tZSBlcnJvcnMgbGVmdCEnLCAnSHVjaCEnKTtcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRhbmd1bGFyLmZvckVhY2godm0uaW5kaWNhdG9ycywgZnVuY3Rpb24gKGl0ZW0sIGtleSkge1xuXHRcdFx0XHRcdGlmIChrZXkgIT0gdm0ubWV0YS5pc29fZmllbGQgJiYga2V5ICE9IHZtLm1ldGEuY291bnRyeV9maWVsZCkge1xuXHRcdFx0XHRcdFx0dmFyIHN0eWxlX2lkID0gMDtcblx0XHRcdFx0XHRcdGlmICh0eXBlb2Ygdm0uaW5kaWNhdG9yc1trZXldLnN0eWxlICE9IFwidW5kZWZpbmVkXCIpIHtcblx0XHRcdFx0XHRcdFx0c3R5bGVfaWQgPSB2bS5pbmRpY2F0b3JzW2tleV0uc3R5bGUuaWQ7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR2YXIgZmllbGQgPSB7XG5cdFx0XHRcdFx0XHRcdCdjb2x1bW4nOiBrZXksXG5cdFx0XHRcdFx0XHRcdCd0aXRsZSc6IHZtLmluZGljYXRvcnNba2V5XS50aXRsZSxcblx0XHRcdFx0XHRcdFx0J2Rlc2NyaXB0aW9uJzogdm0uaW5kaWNhdG9yc1trZXldLmRlc2NyaXB0aW9uLFxuXHRcdFx0XHRcdFx0XHQnbWVhc3VyZV90eXBlX2lkJzogdm0uaW5kaWNhdG9yc1trZXldLnR5cGUuaWQgfHwgMCxcblx0XHRcdFx0XHRcdFx0J2lzX3B1YmxpYyc6IHZtLmluZGljYXRvcnNba2V5XS5pc19wdWJsaWMgfHwgMCxcblx0XHRcdFx0XHRcdFx0J3N0eWxlX2lkJzogc3R5bGVfaWQsXG5cdFx0XHRcdFx0XHRcdCdkYXRhcHJvdmlkZXJfaWQnOiB2bS5pbmRpY2F0b3JzW2tleV0uZGF0YXByb3ZpZGVyLmlkIHx8IDBcblx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0XHR2YXIgY2F0ZWdvcmllcyA9IFtdO1xuXHRcdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLmluZGljYXRvcnNba2V5XS5jYXRlZ29yaWVzLCBmdW5jdGlvbiAoY2F0KSB7XG5cdFx0XHRcdFx0XHRcdGNhdGVnb3JpZXMucHVzaChjYXQuaWQpO1xuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRmaWVsZC5jYXRlZ29yaWVzID0gY2F0ZWdvcmllcztcblx0XHRcdFx0XHRcdGZpZWxkcy5wdXNoKGZpZWxkKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHR2bS5tZXRhLmZpZWxkcyA9IGZpZWxkcztcblx0XHRcdFx0aWYobm9ZZWFycy5sZW5ndGggPiAwKXtcblx0XHRcdFx0XHR0b2FzdHIuZXJyb3IoXCJmb3IgXCIrbm9ZZWFycy5sZW5ndGggKyBcIiBlbnRyaWVzXCIsICdObyB5ZWFyIHZhbHVlIGZvdW5kIScpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0RGF0YVNlcnZpY2UucG9zdCgnZGF0YS90YWJsZXMnLCB2bS5tZXRhKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuXHRcdFx0XHRcdERhdGFTZXJ2aWNlLnBvc3QoJ2RhdGEvdGFibGVzLycgKyByZXNwb25zZS50YWJsZV9uYW1lICsgJy9pbnNlcnQnLCBpbnNlcnREYXRhKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcblx0XHRcdFx0XHRcdGlmIChyZXMgPT0gdHJ1ZSkge1xuXHRcdFx0XHRcdFx0XHR0b2FzdHIuc3VjY2VzcyhpbnNlcnREYXRhLmRhdGEubGVuZ3RoICsgJyBpdGVtcyBpbXBvcnRldCB0byAnICsgdm0ubWV0YS5uYW1lLCAnU3VjY2VzcycpO1xuXHRcdFx0XHRcdFx0XHRJbmRleFNlcnZpY2UuY2xlYXIoKTtcblx0XHRcdFx0XHRcdFx0JHN0YXRlLmdvKCdhcHAuaW5kZXgubXlkYXRhJyk7XG5cdFx0XHRcdFx0XHRcdHZtLmRhdGEgPSBbXTtcblx0XHRcdFx0XHRcdFx0dm0uc3RlcCA9IDA7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR2bS5sb2FkaW5nID0gZmFsc2U7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH0sIGZ1bmN0aW9uIChyZXNwb25zZSkge1xuXHRcdFx0XHRcdGlmIChyZXNwb25zZS5tZXNzYWdlKSB7XG5cdFx0XHRcdFx0XHR0b2FzdHIuZXJyb3IocmVzcG9uc2UubWVzc2FnZSwgJ091Y2ghJyk7XG5cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0dm0ubG9hZGluZyA9IGZhbHNlO1xuXHRcdFx0XHR9KVxuXHRcdFx0fVxuXHRcdH1cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdJbmRleEZpbmFsTWVudUN0cmwnLCBmdW5jdGlvbihJbmRleFNlcnZpY2Upe1xuICAgICAgdmFyIHZtID0gdGhpcztcbiAgICAgIHZtLmRhdGEgPSBJbmRleFNlcnZpY2UuZ2V0RGF0YSgpO1xuICAgICAgdm0ubWV0YSA9IEluZGV4U2VydmljZS5nZXRNZXRhKCk7XG4gICAgICB2bS5pbmRpY2F0b3JzID0gSW5kZXhTZXJ2aWNlLmdldEluZGljYXRvcnMoKTtcbiAgICAgIHZtLmluZGljYXRvcnNMZW5ndGggPSBPYmplY3Qua2V5cyh2bS5pbmRpY2F0b3JzKS5sZW5ndGg7XG5cbiAgICB9KTtcbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdJbmRleE1ldGFDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCAkc3RhdGUsIFZlY3RvcmxheWVyU2VydmljZSwkdGltZW91dCxJbmRleFNlcnZpY2UsbGVhZmxldERhdGEsIHRvYXN0cil7XG4gICAgICAgIC8vXG5cbiAgICAgICAgdmFyIHZtID0gdGhpcztcbiAgICAgICAgdm0ubWluID0gMTAwMDAwMDA7XG4gICAgICAgIHZtLm1heCA9IDA7XG4gICAgICAgIHZtLmluZGljYXRvcnMgPSBbXTtcbiAgICAgICAgdm0uc2NhbGUgPSBcIlwiO1xuICAgICAgICB2bS5kYXRhID0gSW5kZXhTZXJ2aWNlLmdldERhdGEoKTtcbiAgICAgICAgdm0ubWV0YSA9IEluZGV4U2VydmljZS5nZXRNZXRhKCk7XG4gICAgICAgIHZtLmVycm9ycyA9IEluZGV4U2VydmljZS5nZXRFcnJvcnMoKTtcbiAgICAgICAgdm0uaW5kaWNhdG9yID0gSW5kZXhTZXJ2aWNlLmFjdGl2ZUluZGljYXRvcigpO1xuICAgICAgICB2bS5jb3VudHJpZXNTdHlsZSA9IGNvdW50cmllc1N0eWxlO1xuICAgICAgICBWZWN0b3JsYXllclNlcnZpY2UuY3JlYXRlQ2FudmFzKCcjZmYwMDAwJyk7XG5cblxuICAgICAgICBjb25zb2xlLmxvZyh2bS5pbmRpY2F0b3IpO1xuICAgICAgICBhY3RpdmF0ZSgpO1xuXG4gICAgICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCl7XG4gICAgICAgICAgY2hlY2tEYXRhKCk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBjaGVja0RhdGEoKXtcbiAgICAgICAgICBpZighdm0uZGF0YSl7XG4gICAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC5pbmRleC5jcmVhdGUnKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAkc2NvcGUuJHdhdGNoKGZ1bmN0aW9uKCl7IHJldHVybiBJbmRleFNlcnZpY2UuYWN0aXZlSW5kaWNhdG9yKCl9LCBmdW5jdGlvbihuLG8pe1xuICAgICAgICAgIGlmKG4gPT09IG8pcmV0dXJuO1xuICAgICAgICAgIHZtLmluZGljYXRvciA9IG47XG4gICAgICAgICAgdm0ubWluID0gMTAwMDAwMDA7XG4gICAgICAgICAgdm0ubWF4ID0gMDtcbiAgICAgICAgICBpZih2bS5pbmRpY2F0b3Iuc3R5bGUpe1xuICAgICAgICAgICAgVmVjdG9ybGF5ZXJTZXJ2aWNlLnVwZGF0ZUNhbnZhcyh2bS5pbmRpY2F0b3Iuc3R5bGUuYmFzZV9jb2xvcik7XG4gICAgICAgICAgfVxuICAgICAgICAgIGRyYXdDb3VudHJpZXMoKTtcbiAgICAgICAgICAgIEluZGV4U2VydmljZS5zZXRUb0xvY2FsU3RvcmFnZSgpO1xuICAgICAgICB9KTtcblxuICAgICAgICAkc2NvcGUuJHdhdGNoKCd2bS5pbmRpY2F0b3InLCBmdW5jdGlvbihuLG8pe1xuICAgICAgICAgIGlmKG4gPT09IG8pIHJldHVybjtcbiAgICAgICAgICBpZih0eXBlb2Ygbi5zdHlsZV9pZCAhPSBcInVuZGVmaW5lZFwiICl7XG4gICAgICAgICAgICBpZihuLnN0eWxlX2lkICE9IG8uc3R5bGVfaWQpe1xuICAgICAgICAgICAgICBpZihuLnN0eWxlKXtcbiAgICAgICAgICAgICAgICBWZWN0b3JsYXllclNlcnZpY2UudXBkYXRlQ2FudmFzKG4uc3R5bGUuYmFzZV9jb2xvcik7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgICAgIFZlY3RvcmxheWVyU2VydmljZS51cGRhdGVDYW52YXMoJyNmZjAwMDAnKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBkcmF3Q291bnRyaWVzKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICBpZih0eXBlb2Ygbi5jYXRlZ29yaWVzICE9IFwidW5kZWZpbmVkXCIpe1xuICAgICAgICAgICAgICBpZihuLmNhdGVnb3JpZXMubGVuZ3RoKXtcbiAgICAgICAgICAgICAgICBWZWN0b3JsYXllclNlcnZpY2UudXBkYXRlQ2FudmFzKG4uY2F0ZWdvcmllc1swXS5zdHlsZS5iYXNlX2NvbG9yKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICAgIFZlY3RvcmxheWVyU2VydmljZS51cGRhdGVDYW52YXMoJyNmZjAwMDAnKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZHJhd0NvdW50cmllcygpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBJbmRleFNlcnZpY2Uuc2V0QWN0aXZlSW5kaWNhdG9yRGF0YShuKTtcbiAgICAgICAgICBJbmRleFNlcnZpY2Uuc2V0VG9Mb2NhbFN0b3JhZ2UoKTtcbiAgICAgICAgfSx0cnVlKTtcblxuXG4gICAgICAgIGZ1bmN0aW9uIG1pbk1heCgpe1xuICAgICAgICAgIHZtLm1pbiA9IDEwMDAwMDAwO1xuICAgICAgICAgIHZtLm1heCA9IDA7XG4gICAgICAgICAgYW5ndWxhci5mb3JFYWNoKHZtLmRhdGEsIGZ1bmN0aW9uKGl0ZW0sIGtleSl7XG4gICAgICAgICAgICAgIHZtLm1pbiA9IE1hdGgubWluKGl0ZW0uZGF0YVt2bS5pbmRpY2F0b3IuY29sdW1uX25hbWVdLCB2bS5taW4pO1xuICAgICAgICAgICAgICB2bS5tYXggPSBNYXRoLm1heChpdGVtLmRhdGFbdm0uaW5kaWNhdG9yLmNvbHVtbl9uYW1lXSwgdm0ubWF4KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICB2bS5zY2FsZSA9IGQzLnNjYWxlLmxpbmVhcigpLmRvbWFpbihbdm0ubWluLHZtLm1heF0pLnJhbmdlKFswLDEwMF0pO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGdldFZhbHVlQnlJc28oaXNvKXtcbiAgICAgICAgICB2YXIgdmFsdWUgPSAwO1xuICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaCh2bS5kYXRhLCBmdW5jdGlvbihpdGVtLCBrZXkpe1xuICAgICAgICAgICAgIGlmKGl0ZW0uZGF0YVt2bS5tZXRhLmlzb19maWVsZF0gPT0gaXNvKXtcbiAgICAgICAgICAgICAgIHZhbHVlID0gaXRlbS5kYXRhW3ZtLmluZGljYXRvci5jb2x1bW5fbmFtZV07XG4gICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBjb3VudHJpZXNTdHlsZShmZWF0dXJlKSB7XG4gICAgXHRcdFx0dmFyIHN0eWxlID0ge307XG4gICAgXHRcdFx0dmFyIGlzbyA9IGZlYXR1cmUucHJvcGVydGllcy5pc29fYTI7XG4gICAgXHRcdFx0dmFyIHZhbHVlID0gZ2V0VmFsdWVCeUlzbyhpc28pIHx8IHZtLm1pbjtcbiAgICBcdFx0XHR2YXIgZmllbGQgPSB2bS5pbmRpY2F0b3IuY29sdW1uX25hbWU7XG4gICAgXHRcdFx0dmFyIHR5cGUgPSBmZWF0dXJlLnR5cGU7XG5cbiAgICBcdFx0XHRzd2l0Y2ggKHR5cGUpIHtcbiAgICBcdFx0XHRjYXNlIDM6IC8vJ1BvbHlnb24nXG5cbiAgICBcdFx0XHRcdFx0dmFyIGNvbG9yUG9zID0gcGFyc2VJbnQoMjU2IC8gMTAwICogcGFyc2VJbnQodm0uc2NhbGUodmFsdWUpKSkgKiA0O1xuICAgIFx0XHRcdFx0XHR2YXIgY29sb3IgPSAncmdiYSgnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldENvbG9yKGNvbG9yUG9zKSArICcsICcgKyBWZWN0b3JsYXllclNlcnZpY2UuZ2V0Q29sb3IoY29sb3JQb3MgKyAxKSArICcsICcgKyBWZWN0b3JsYXllclNlcnZpY2UuZ2V0Q29sb3IoY29sb3JQb3MgKyAyKSArICcsJyArIFZlY3RvcmxheWVyU2VydmljZS5nZXRDb2xvcihjb2xvclBvcyArIDMpICsgJyknO1xuICAgICAgICAgICAgICBzdHlsZS5jb2xvciA9ICdyZ2JhKCcgKyBWZWN0b3JsYXllclNlcnZpY2UuZ2V0Q29sb3IoY29sb3JQb3MpICArICcsICcgKyBWZWN0b3JsYXllclNlcnZpY2UuZ2V0Q29sb3IoY29sb3JQb3MgKyAxKSArICcsICcgKyBWZWN0b3JsYXllclNlcnZpY2UuZ2V0Q29sb3IoY29sb3JQb3MgKyAyKSArICcsMC42KSc7IC8vY29sb3I7XG4gICAgXHRcdFx0XHRcdHN0eWxlLm91dGxpbmUgPSB7XG4gICAgXHRcdFx0XHRcdFx0Y29sb3I6IGNvbG9yLFxuICAgIFx0XHRcdFx0XHRcdHNpemU6IDFcbiAgICBcdFx0XHRcdFx0fTtcbiAgICBcdFx0XHRcdFx0c3R5bGUuc2VsZWN0ZWQgPSB7XG4gICAgXHRcdFx0XHRcdFx0Y29sb3I6ICdyZ2JhKCcgKyBWZWN0b3JsYXllclNlcnZpY2UuZ2V0Q29sb3IoY29sb3JQb3MpICsgJywgJyArIFZlY3RvcmxheWVyU2VydmljZS5nZXRDb2xvcihjb2xvclBvcyArIDEpICsgJywgJyArIFZlY3RvcmxheWVyU2VydmljZS5nZXRDb2xvcihjb2xvclBvcyArIDIpICsgJywwLjMpJyxcbiAgICBcdFx0XHRcdFx0XHRvdXRsaW5lOiB7XG4gICAgXHRcdFx0XHRcdFx0XHRjb2xvcjogJ3JnYmEoNjYsNjYsNjYsMC45KScsXG4gICAgXHRcdFx0XHRcdFx0XHRzaXplOiAyXG4gICAgXHRcdFx0XHRcdFx0fVxuICAgIFx0XHRcdFx0XHR9O1xuICAgIFx0XHRcdFx0XHRicmVhaztcblxuICAgIFx0XHRcdH1cblxuICAgIFx0XHRcdGlmIChmZWF0dXJlLmxheWVyLm5hbWUgPT09IFZlY3RvcmxheWVyU2VydmljZS5nZXROYW1lKCkrJ19nZW9tJykge1xuICAgIFx0XHRcdFx0c3R5bGUuc3RhdGljTGFiZWwgPSBmdW5jdGlvbiAoKSB7XG4gICAgXHRcdFx0XHRcdHZhciBzdHlsZSA9IHtcbiAgICBcdFx0XHRcdFx0XHRodG1sOiBmZWF0dXJlLnByb3BlcnRpZXMubmFtZSxcbiAgICBcdFx0XHRcdFx0XHRpY29uU2l6ZTogWzEyNSwgMzBdLFxuICAgIFx0XHRcdFx0XHRcdGNzc0NsYXNzOiAnbGFiZWwtaWNvbi10ZXh0J1xuICAgIFx0XHRcdFx0XHR9O1xuICAgIFx0XHRcdFx0XHRyZXR1cm4gc3R5bGU7XG4gICAgXHRcdFx0XHR9O1xuICAgIFx0XHRcdH1cbiAgICBcdFx0XHRyZXR1cm4gc3R5bGU7XG4gICAgXHRcdH1cbiAgICAgICAgZnVuY3Rpb24gc2V0Q291bnRyaWVzKCl7XG4gICAgICAgICAgdm0ubXZ0U291cmNlLnNldFN0eWxlKGNvdW50cmllc1N0eWxlKTtcbiAgICAgICAgICB2bS5tdnRTb3VyY2UucmVkcmF3KCk7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gZHJhd0NvdW50cmllcygpIHtcbiAgICAgICAgICBtaW5NYXgoKTtcbiAgICBcdFx0XHRsZWFmbGV0RGF0YS5nZXRNYXAoJ21hcCcpLnRoZW4oZnVuY3Rpb24gKG1hcCkge1xuICAgIFx0XHRcdFx0dm0ubWFwID0gbWFwO1xuICAgIFx0XHRcdFx0dm0ubXZ0U291cmNlID0gVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldExheWVyKCk7XG4gICAgXHRcdFx0XHQkdGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgXHRcdFx0XHRcdFx0c2V0Q291bnRyaWVzKCk7XG4gICAgXHRcdFx0XHR9KTtcbiAgICBcdFx0XHR9KTtcbiAgICBcdFx0fVxuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignSW5kZXhNZXRhTWVudUN0cmwnLCBmdW5jdGlvbigkc2NvcGUsJHN0YXRlLCB0b2FzdHIsIERhdGFTZXJ2aWNlLERpYWxvZ1NlcnZpY2UsIEluZGV4U2VydmljZSl7XG4gICAgICB2YXIgdm0gPSB0aGlzO1xuICAgICAgdm0uZGF0YSA9IEluZGV4U2VydmljZS5nZXREYXRhKCk7XG4gICAgICB2bS5tZXRhID0gSW5kZXhTZXJ2aWNlLmdldE1ldGEoKTtcbiAgICAgIEluZGV4U2VydmljZS5yZXNldEluZGljYXRvcigpO1xuICAgICAgdm0uaW5kaWNhdG9ycyA9IEluZGV4U2VydmljZS5nZXRJbmRpY2F0b3JzKCk7XG4gICAgICB2bS5zZWxlY3RGb3JFZGl0aW5nID0gc2VsZWN0Rm9yRWRpdGluZztcbiAgICAgIHZtLmNoZWNrRnVsbCA9IGNoZWNrRnVsbDtcbiAgICAgIHZtLmNoZWNrQmFzZSA9IGNoZWNrQmFzZTtcbiAgICAgIHZtLmNoZWNrQWxsID0gY2hlY2tBbGw7XG4gICAgICB2bS5zYXZlRGF0YSA9IHNhdmVEYXRhO1xuXG5cbiAgICAgIGZ1bmN0aW9uIHNlbGVjdEZvckVkaXRpbmcoa2V5KXtcbiAgICAgICAgaWYodHlwZW9mIEluZGV4U2VydmljZS5nZXRJbmRpY2F0b3Ioa2V5KSA9PSBcInVuZGVmaW5lZFwiKXtcbiAgICAgICAgICBJbmRleFNlcnZpY2Uuc2V0SW5kaWNhdG9yKGtleSx7XG4gICAgICAgICAgICBjb2x1bW5fbmFtZTprZXksXG4gICAgICAgICAgICB0aXRsZTprZXlcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICB2bS5lZGl0aW5nSXRlbSA9IGtleTtcbiAgICAgICAgdm0uaW5kaWNhdG9yID0gSW5kZXhTZXJ2aWNlLmdldEluZGljYXRvcihrZXkpO1xuICAgICAgICBJbmRleFNlcnZpY2Uuc2V0VG9Mb2NhbFN0b3JhZ2UoKTtcbiAgICAgIH1cbiAgICAgIGZ1bmN0aW9uIGNoZWNrQmFzZShpdGVtKXtcbiAgICAgICAgaWYodHlwZW9mIGl0ZW0gPT0gXCJ1bmRlZmluZWRcIikgcmV0dXJuIGZhbHNlO1xuICBcdFx0XHRpZiAoaXRlbS50aXRsZSAmJiBpdGVtLnR5cGUgJiYgaXRlbS5kYXRhcHJvdmlkZXIgJiYgaXRlbS50aXRsZS5sZW5ndGggPj0gMykge1xuICBcdFx0XHRcdHJldHVybiB0cnVlO1xuICBcdFx0XHR9XG4gIFx0XHRcdHJldHVybiBmYWxzZTtcbiAgXHRcdH1cbiAgXHRcdGZ1bmN0aW9uIGNoZWNrRnVsbChpdGVtKXtcbiAgICAgICAgaWYodHlwZW9mIGl0ZW0gPT0gXCJ1bmRlZmluZWRcIiB8fCB0eXBlb2YgaXRlbS5jYXRlZ29yaWVzID09IFwidW5kZWZpbmVkXCIpIHJldHVybiBmYWxzZTtcbiAgXHRcdFx0cmV0dXJuIGNoZWNrQmFzZShpdGVtKSAmJiBpdGVtLmNhdGVnb3JpZXMubGVuZ3RoID8gdHJ1ZSA6IGZhbHNlO1xuICBcdFx0fVxuICAgICAgZnVuY3Rpb24gY2hlY2tBbGwoKXtcbiAgICAgICAgdmFyIGRvbmUgPSAwO1xuICAgICAgICBhbmd1bGFyLmZvckVhY2godm0uaW5kaWNhdG9ycywgZnVuY3Rpb24oaW5kaWNhdG9yKXtcbiAgICAgICAgICBpZihjaGVja0Jhc2UoaW5kaWNhdG9yKSl7XG4gICAgICAgICAgICBkb25lICsrO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIC8vY29uc29sZS5sb2coZG9uZSwgT2JqZWN0LmtleXModm0uaW5kaWNhdG9ycykubGVuZ3RoKTtcbiAgICAgICAgaWYoZG9uZSA9PSBPYmplY3Qua2V5cyh2bS5pbmRpY2F0b3JzKS5sZW5ndGgpe1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIGZ1bmN0aW9uIHNhdmVEYXRhKCkge1xuXG4gICAgICAgICAgaWYoIXZtLm1ldGEueWVhcl9maWVsZCAmJiAhdm0ubWV0YS55ZWFyKXtcbiAgICAgICAgICAgIERpYWxvZ1NlcnZpY2UuZnJvbVRlbXBsYXRlKCdhZGRZZWFyJywgJHNjb3BlKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICB9XG4gIFx0XHRcdFx0dmFyIGluc2VydERhdGEgPSB7XG4gIFx0XHRcdFx0XHRkYXRhOiBbXVxuICBcdFx0XHRcdH07XG4gIFx0XHRcdFx0dmFyIG5vWWVhcnMgPSBbXTtcbiAgXHRcdFx0XHR2YXIgaW5zZXJ0TWV0YSA9IFtdLFxuICBcdFx0XHRcdFx0ZmllbGRzID0gW107XG4gIFx0XHRcdFx0dm0ubG9hZGluZyA9IHRydWU7XG4gIFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLmRhdGEsIGZ1bmN0aW9uIChpdGVtLCBrZXkpIHtcbiAgXHRcdFx0XHRcdGlmIChpdGVtLmVycm9ycy5sZW5ndGggPT0gMCkge1xuICBcdFx0XHRcdFx0XHRpZihpdGVtLmRhdGFbdm0ubWV0YS55ZWFyX2ZpZWxkXSl7XG4gIFx0XHRcdFx0XHRcdFx0aXRlbS5kYXRhLnllYXIgPSBpdGVtLmRhdGFbdm0ubWV0YS55ZWFyX2ZpZWxkXTtcblxuICBcdFx0XHRcdFx0XHRcdGlmKHZtLm1ldGEueWVhcl9maWVsZCAmJiB2bS5tZXRhLnllYXJfZmllbGQgIT0gXCJ5ZWFyXCIpIHtcbiAgXHRcdFx0XHRcdFx0XHRcdGRlbGV0ZSBpdGVtLmRhdGFbdm0ubWV0YS55ZWFyX2ZpZWxkXTtcbiAgXHRcdFx0XHRcdFx0XHR9XG5cbiAgXHRcdFx0XHRcdFx0XHR2bS5tZXRhLmlzb190eXBlID0gaXRlbS5kYXRhW3ZtLm1ldGEuaXNvX2ZpZWxkXS5sZW5ndGggPT0gMyA/ICdpc28tMzE2Ni0xJyA6ICdpc28tMzE2Ni0yJztcbiAgXHRcdFx0XHRcdFx0XHRpbnNlcnREYXRhLmRhdGEucHVzaChpdGVtLmRhdGEpO1xuICBcdFx0XHRcdFx0XHR9XG4gIFx0XHRcdFx0XHRcdGVsc2V7XG4gICAgICAgICAgICAgICAgaWYodm0ubWV0YS55ZWFyKXtcbiAgICAgICAgICAgICAgICAgIGl0ZW0uZGF0YS55ZWFyID0gdm0ubWV0YS55ZWFyO1xuICAgICAgICAgICAgICAgICAgdm0ubWV0YS5pc29fdHlwZSA9IGl0ZW0uZGF0YVt2bS5tZXRhLmlzb19maWVsZF0ubGVuZ3RoID09IDMgPyAnaXNvLTMxNjYtMScgOiAnaXNvLTMxNjYtMic7XG4gICAgXHRcdFx0XHRcdFx0XHRpbnNlcnREYXRhLmRhdGEucHVzaChpdGVtLmRhdGEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICAgICAgXHRub1llYXJzLnB1c2goaXRlbSk7XG4gICAgICAgICAgICAgICAgfVxuXG5cbiAgXHRcdFx0XHRcdFx0fVxuXG5cbiAgXHRcdFx0XHRcdH0gZWxzZSB7XG4gIFx0XHRcdFx0XHRcdHRvYXN0ci5lcnJvcignVGhlcmUgYXJlIHNvbWUgZXJyb3JzIGxlZnQhJywgJ0h1Y2ghJyk7XG4gIFx0XHRcdFx0XHRcdHJldHVybjtcbiAgXHRcdFx0XHRcdH1cbiAgXHRcdFx0XHR9KTtcbiAgXHRcdFx0XHRhbmd1bGFyLmZvckVhY2godm0uaW5kaWNhdG9ycywgZnVuY3Rpb24gKGl0ZW0sIGtleSkge1xuICBcdFx0XHRcdFx0aWYgKGtleSAhPSB2bS5tZXRhLmlzb19maWVsZCAmJiBrZXkgIT0gdm0ubWV0YS5jb3VudHJ5X2ZpZWxkKSB7XG4gIFx0XHRcdFx0XHRcdHZhciBzdHlsZV9pZCA9IDA7XG4gIFx0XHRcdFx0XHRcdGlmICh0eXBlb2Ygdm0uaW5kaWNhdG9yc1trZXldLnN0eWxlICE9IFwidW5kZWZpbmVkXCIpIHtcbiAgXHRcdFx0XHRcdFx0XHRzdHlsZV9pZCA9IHZtLmluZGljYXRvcnNba2V5XS5zdHlsZS5pZDtcbiAgXHRcdFx0XHRcdFx0fVxuICBcdFx0XHRcdFx0XHR2YXIgZmllbGQgPSB7XG4gIFx0XHRcdFx0XHRcdFx0J2NvbHVtbic6IGtleSxcbiAgXHRcdFx0XHRcdFx0XHQndGl0bGUnOiB2bS5pbmRpY2F0b3JzW2tleV0udGl0bGUsXG4gIFx0XHRcdFx0XHRcdFx0J2Rlc2NyaXB0aW9uJzogdm0uaW5kaWNhdG9yc1trZXldLmRlc2NyaXB0aW9uLFxuICBcdFx0XHRcdFx0XHRcdCdtZWFzdXJlX3R5cGVfaWQnOiB2bS5pbmRpY2F0b3JzW2tleV0udHlwZS5pZCB8fCAwLFxuICBcdFx0XHRcdFx0XHRcdCdpc19wdWJsaWMnOiB2bS5pbmRpY2F0b3JzW2tleV0uaXNfcHVibGljIHx8IDAsXG4gIFx0XHRcdFx0XHRcdFx0J3N0eWxlX2lkJzogc3R5bGVfaWQsXG4gIFx0XHRcdFx0XHRcdFx0J2RhdGFwcm92aWRlcl9pZCc6IHZtLmluZGljYXRvcnNba2V5XS5kYXRhcHJvdmlkZXIuaWQgfHwgMFxuICBcdFx0XHRcdFx0XHR9O1xuICBcdFx0XHRcdFx0XHR2YXIgY2F0ZWdvcmllcyA9IFtdO1xuICBcdFx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2godm0uaW5kaWNhdG9yc1trZXldLmNhdGVnb3JpZXMsIGZ1bmN0aW9uIChjYXQpIHtcbiAgXHRcdFx0XHRcdFx0XHRjYXRlZ29yaWVzLnB1c2goY2F0LmlkKTtcbiAgXHRcdFx0XHRcdFx0fSk7XG4gIFx0XHRcdFx0XHRcdGZpZWxkLmNhdGVnb3JpZXMgPSBjYXRlZ29yaWVzO1xuICBcdFx0XHRcdFx0XHRmaWVsZHMucHVzaChmaWVsZCk7XG4gIFx0XHRcdFx0XHR9XG4gIFx0XHRcdFx0fSk7XG4gIFx0XHRcdFx0dm0ubWV0YS5maWVsZHMgPSBmaWVsZHM7XG4gIFx0XHRcdFx0aWYobm9ZZWFycy5sZW5ndGggPiAwKXtcbiAgXHRcdFx0XHRcdHRvYXN0ci5lcnJvcihcImZvciBcIitub1llYXJzLmxlbmd0aCArIFwiIGVudHJpZXNcIiwgJ05vIHllYXIgdmFsdWUgZm91bmQhJyk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gIFx0XHRcdFx0fVxuXG4gIFx0XHRcdFx0RGF0YVNlcnZpY2UucG9zdCgnZGF0YS90YWJsZXMnLCB2bS5tZXRhKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICBcdFx0XHRcdFx0RGF0YVNlcnZpY2UucG9zdCgnZGF0YS90YWJsZXMvJyArIHJlc3BvbnNlLnRhYmxlX25hbWUgKyAnL2luc2VydCcsIGluc2VydERhdGEpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICBcdFx0XHRcdFx0XHRpZiAocmVzID09IHRydWUpIHtcbiAgXHRcdFx0XHRcdFx0XHR0b2FzdHIuc3VjY2VzcyhpbnNlcnREYXRhLmRhdGEubGVuZ3RoICsgJyBpdGVtcyBpbXBvcnRldCB0byAnICsgdm0ubWV0YS5uYW1lLCAnU3VjY2VzcycpO1xuICBcdFx0XHRcdFx0XHRcdEluZGV4U2VydmljZS5jbGVhcigpO1xuICBcdFx0XHRcdFx0XHRcdCRzdGF0ZS5nbygnYXBwLmluZGV4Lm15ZGF0YScpO1xuICBcdFx0XHRcdFx0XHRcdHZtLmRhdGEgPSBbXTtcbiAgXHRcdFx0XHRcdFx0XHR2bS5zdGVwID0gMDtcbiAgXHRcdFx0XHRcdFx0fVxuICBcdFx0XHRcdFx0XHR2bS5sb2FkaW5nID0gZmFsc2U7XG4gIFx0XHRcdFx0XHR9KTtcbiAgXHRcdFx0XHR9LCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgXHRcdFx0XHRcdGlmIChyZXNwb25zZS5tZXNzYWdlKSB7XG4gIFx0XHRcdFx0XHRcdHRvYXN0ci5lcnJvcihyZXNwb25zZS5tZXNzYWdlLCAnT3VjaCEnKTtcblxuICBcdFx0XHRcdFx0fVxuICBcdFx0XHRcdFx0dm0ubG9hZGluZyA9IGZhbHNlO1xuICBcdFx0XHRcdH0pXG5cbiAgXHRcdH1cbiAgICAgIGZ1bmN0aW9uIGNvcHlUb090aGVycygpe1xuICAgICAgLyogIHZtLnByZVByb3ZpZGVyID0gdm0uaW5kaWNhdG9yc1tvLmNvbHVtbl9uYW1lXS5kYXRhcHJvdmlkZXI7XG4gICAgICAgIHZtLnByZU1lYXN1cmUgPSB2bS5pbmRpY2F0b3JzW28uY29sdW1uX25hbWVdLm1lYXN1cmVfdHlwZV9pZDtcbiAgICAgICAgdm0ucHJlVHlwZSA9IHZtLmluZGljYXRvcnNbby5jb2x1bW5fbmFtZV0udHlwZTtcbiAgICAgICAgdm0ucHJlQ2F0ZWdvcmllcyA9IHZtLmluZGljYXRvcnNbby5jb2x1bW5fbmFtZV0uY2F0ZWdvcmllcztcbiAgICAgICAgdm0ucHJlUHVibGljID0gdm0uaW5kaWNhdG9yc1tvLmNvbHVtbl9uYW1lXS5pc19wdWJsaWM7XG4gICAgICAgIHZtLnByZVN0eWxlID0gdm0uaW5kaWNhdG9yc1tvLmNvbHVtbl9uYW1lXS5zdHlsZTtcblxuICAgICAgICBEaWFsb2dTZXJ2aWNlLmZyb21UZW1wbGF0ZSgnY29weXByb3ZpZGVyJywgJHNjb3BlKTsqL1xuICAgICAgfVxuICAgICAkc2NvcGUuJHdhdGNoKGZ1bmN0aW9uKCl7IHJldHVybiBJbmRleFNlcnZpY2UuYWN0aXZlSW5kaWNhdG9yKCl9LCBmdW5jdGlvbihuLG8pe1xuICAgICAgICBpZihuID09PSBvKXJldHVybjtcbiAgICAgICAgdm0uaW5kaWNhdG9yc1tuLmNvbHVtbl9uYW1lXSA9IG47XG4gICAgICB9LHRydWUpO1xuICAgICAgJHNjb3BlLiR3YXRjaChmdW5jdGlvbigpeyByZXR1cm4gSW5kZXhTZXJ2aWNlLmFjdGl2ZUluZGljYXRvcigpfSwgZnVuY3Rpb24obixvKXtcbiAgICAgICAgaWYgKG4gPT09IG8gfHwgdHlwZW9mIG8gPT0gXCJ1bmRlZmluZWRcIiB8fCBvID09IG51bGwpIHJldHVybjtcbiAgICAgICAgaWYoIXZtLmFza2VkVG9SZXBsaWNhdGUpIHtcbiAgICAgICAgICB2bS5wcmVQcm92aWRlciA9IHZtLmluZGljYXRvcnNbby5jb2x1bW5fbmFtZV0uZGF0YXByb3ZpZGVyO1xuICAgICAgICAgIHZtLnByZU1lYXN1cmUgPSB2bS5pbmRpY2F0b3JzW28uY29sdW1uX25hbWVdLm1lYXN1cmVfdHlwZV9pZDtcbiAgICAgICAgICB2bS5wcmVUeXBlID0gdm0uaW5kaWNhdG9yc1tvLmNvbHVtbl9uYW1lXS50eXBlO1xuICAgICAgICAgIHZtLnByZUNhdGVnb3JpZXMgPSB2bS5pbmRpY2F0b3JzW28uY29sdW1uX25hbWVdLmNhdGVnb3JpZXM7XG4gICAgICAgICAgdm0ucHJlUHVibGljID0gdm0uaW5kaWNhdG9yc1tvLmNvbHVtbl9uYW1lXS5pc19wdWJsaWM7XG4gICAgICAgICAgdm0ucHJlU3R5bGUgPSB2bS5pbmRpY2F0b3JzW28uY29sdW1uX25hbWVdLnN0eWxlO1xuXG4gICAgICAgICAgRGlhbG9nU2VydmljZS5mcm9tVGVtcGxhdGUoJ2NvcHlwcm92aWRlcicsICRzY29wZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy9uLmRhdGFwcm92aWRlciA9IHZtLmRvUHJvdmlkZXJzID8gdm0ucHJlUHJvdmlkZXIgOiBbXTtcbiAgICAgICAgICAvL24ubWVhc3VyZV90eXBlX2lkID0gdm0uZG9NZWFzdXJlcyA/IHZtLnByZU1lYXN1cmUgOiAwO1xuICAgICAgICAgIC8vbi5jYXRlZ29yaWVzID0gdm0uZG9DYXRlZ29yaWVzID8gdm0ucHJlQ2F0ZWdvcmllczogW107XG4gICAgICAgICAgLy9uLmlzX3B1YmxpYyA9IHZtLmRvUHVibGljID8gdm0ucHJlUHVibGljOiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICB9KTtcbiAgICB9KTtcbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdJbmRleGNyZWF0b3JDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBEaWFsb2dTZXJ2aWNlLERhdGFTZXJ2aWNlLCAkdGltZW91dCwkc3RhdGUsICRmaWx0ZXIsIGxlYWZsZXREYXRhLCB0b2FzdHIsIEljb25zU2VydmljZSxJbmRleFNlcnZpY2UsIFZlY3RvcmxheWVyU2VydmljZSl7XG5cbiAgICAgICAgLy9UT0RPOiBDaGVjayBpZiB0aGVyZSBpcyBkYXRhIGluIHN0b3JhZ2UgdG8gZmluaXNoXG4gICAgICAvKiAgY29uc29sZS5sb2coJHN0YXRlKTtcbiAgICAgICAgaWYoJHN0YXRlLmN1cnJlbnQubmFtZSA9PSAnYXBwLmluZGV4LmNyZWF0ZScpe1xuICAgICAgICAgIGlmKEluZGV4U2VydmljZS5nZXREYXRhKCkubGVuZ3RoKXtcbiAgICAgICAgICAgIGlmKGNvbmZpcm0oJ0V4aXN0aW5nIERhdGEuIEdvIE9uPycpKXtcbiAgICAgICAgICAgICAgJHN0YXRlLmdvKCdhcHAuaW5kZXguY2hlY2snKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICAgIEluZGV4U2VydmljZS5jbGVhcigpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSovXG5cbiAgICAgICAgdmFyIHZtID0gdGhpcztcbiAgICAgICAgdm0ubWFwID0gbnVsbDtcbiAgICAgICAgdm0uZGF0YSA9IFtdO1xuICAgICAgICB2bS50b1NlbGVjdCA9IFtdO1xuICAgICAgICB2bS5zZWxlY3RlZCA9IFtdO1xuICAgICAgICB2bS5zZWxlY3RlZFJvd3MgPSBbXTtcbiAgICAgICAgdm0uc2VsZWN0ZWRSZXNvdXJjZXMgPVtdO1xuICAgICAgICB2bS5zb3J0ZWRSZXNvdXJjZXMgPSBbXTtcblxuICAgICAgICB2bS5ncm91cHMgPSBbXTtcbiAgICAgICAgdm0ubXlEYXRhID0gW107XG4gICAgICAgIHZtLmFkZERhdGFUbyA9IHt9O1xuICAgICAgICB2bS5zZWxlY3RlZEZvckdyb3VwID0gW107XG4gICAgICAgIHZtLmlzb19lcnJvcnMgPSAwO1xuICAgICAgICB2bS5pc29fY2hlY2tlZCA9IGZhbHNlO1xuICAgICAgICB2bS5zYXZlRGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgdm0uc2VsZWN0ZWRJbmRleCA9IDA7XG4gICAgICAgIHZtLnN0ZXAgPSAwO1xuICAgICAgICB2bS5vcGVuQ2xvc2UgPSBvcGVuQ2xvc2U7XG4gICAgICAgIC8vdm0uc2VhcmNoID0gc2VhcmNoO1xuXG4gICAgICAgIHZtLmxpc3RSZXNvdXJjZXMgPSBsaXN0UmVzb3VyY2VzO1xuICAgICAgICB2bS50b2dnbGVMaXN0UmVzb3VyY2VzID0gdG9nZ2xlTGlzdFJlc291cmNlcztcbiAgICAgICAgdm0uc2VsZWN0ZWRSZXNvdXJjZSA9IHNlbGVjdGVkUmVzb3VyY2U7XG4gICAgICAgIHZtLnRvZ2dsZVJlc291cmNlID0gdG9nZ2xlUmVzb3VyY2U7XG4gICAgICAgIHZtLmluY3JlYXNlUGVyY2VudGFnZSA9IGluY3JlYXNlUGVyY2VudGFnZTtcbiAgICAgICAgdm0uZGVjcmVhc2VQZXJjZW50YWdlID0gZGVjcmVhc2VQZXJjZW50YWdlO1xuICAgICAgICB2bS50b2dnbGVHcm91cFNlbGVjdGlvbiA9IHRvZ2dsZUdyb3VwU2VsZWN0aW9uO1xuICAgICAgICB2bS5leGlzdHNJbkdyb3VwU2VsZWN0aW9uID0gZXhpc3RzSW5Hcm91cFNlbGVjdGlvbjtcbiAgICAgICAgdm0uYWRkR3JvdXAgPSBhZGRHcm91cDtcbiAgICAgICAgdm0uY2xvbmVTZWxlY3Rpb24gPSBjbG9uZVNlbGVjdGlvbjtcbiAgICAgICAgdm0uZWRpdEVudHJ5ID0gZWRpdEVudHJ5O1xuICAgICAgICB2bS5yZW1vdmVFbnRyeSA9IHJlbW92ZUVudHJ5O1xuICAgICAgICB2bS5zYXZlSW5kZXggPSBzYXZlSW5kZXg7XG5cbiAgICAgICAgdm0uaWNvbnMgPSBJY29uc1NlcnZpY2UuZ2V0TGlzdCgpO1xuXG4gICAgICAgIHZtLm1ldGEgPSB7XG4gICAgICAgICAgaXNvX2ZpZWxkOiAnJyxcbiAgICAgICAgICBjb3VudHJ5X2ZpZWxkOicnLFxuICAgICAgICAgIHRhYmxlOltdXG4gICAgICAgIH07XG4gICAgICAgIHZtLnF1ZXJ5ID0ge1xuICAgICAgICAgIGZpbHRlcjogJycsXG4gICAgICAgICAgb3JkZXI6ICctZXJyb3JzJyxcbiAgICAgICAgICBsaW1pdDogMTUsXG4gICAgICAgICAgcGFnZTogMVxuICAgICAgICB9O1xuXG4gICAgICAgIC8qdm0udHJlZU9wdGlvbnMgPSB7XG4gICAgICAgICAgYmVmb3JlRHJvcDpmdW5jdGlvbihldmVudCl7XG4gICAgICAgICAgICBpZihldmVudC5kZXN0Lm5vZGVzU2NvcGUgIT0gZXZlbnQuc291cmNlLm5vZGVzU2NvcGUpe1xuICAgICAgICAgICAgICB2YXIgaWR4ID0gZXZlbnQuZGVzdC5ub2Rlc1Njb3BlLiRtb2RlbFZhbHVlLmluZGV4T2YoZXZlbnQuc291cmNlLm5vZGVTY29wZS4kbW9kZWxWYWx1ZSk7XG4gICAgICAgICAgICAgIGlmKGlkeCA+IC0xKXtcbiAgICAgICAgICAgICAgICAgZXZlbnQuc291cmNlLm5vZGVTY29wZS4kJGFwcGx5ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgIHRvYXN0ci5lcnJvcignT25seSBvbmUgZWxlbWVudCBvZiBhIGtpbmQgcGVyIGdyb3VwIHBvc3NpYmxlIScsICdOb3QgYWxsb3dlZCEnKVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBkcm9wcGVkOmZ1bmN0aW9uKGV2ZW50KXtcbiAgICAgICAgICAgIGNhbGNQZXJjZW50YWdlKHZtLmdyb3Vwcyk7XG4gICAgICAgICAgfVxuICAgICAgICB9OyovXG5cbiAgICAgICAgLy9SdW4gU3RhcnR1cC1GdW5jaXRvbnNcbiAgICAgICAgYWN0aXZhdGUoKTtcblxuICAgICAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpe1xuICAgICAgICAgIC8vY2xlYXJNYXAoKTtcbiAgICAgICAgICBJbmRleFNlcnZpY2UucmVzZXRMb2NhbFN0b3JhZ2UoKTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBvcGVuQ2xvc2UoYWN0aXZlKXtcbiAgICAgICAgICByZXR1cm4gYWN0aXZlID8gJ3JlbW92ZScgOiAnYWRkJztcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBjbGVhckxheWVyU3R5bGUoZmVhdHVyZSl7XG4gICAgICBcdFx0XHR2YXIgc3R5bGUgPSB7XG4gICAgICAgICAgICAgIGNvbG9yOidyZ2JhKDI1NSwyNTUsMjU1LDApJyxcbiAgICAgICAgICAgICAgb3V0bGluZToge1xuICAgIFx0XHRcdFx0XHRcdGNvbG9yOiAncmdiYSgyNTUsMjU1LDI1NSwwKScsXG4gICAgXHRcdFx0XHRcdFx0c2l6ZTogMVxuICAgIFx0XHRcdFx0XHR9XG4gICAgICAgICAgICB9O1xuICAgICAgXHRcdFx0cmV0dXJuIHN0eWxlO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGNsZWFyTWFwKCl7XG4gICAgICAgICAgXHRsZWFmbGV0RGF0YS5nZXRNYXAoJ21hcCcpLnRoZW4oZnVuY3Rpb24gKG1hcCkge1xuICAgICAgICAgICAgICB2bS5tdnRTb3VyY2UgPSBWZWN0b3JsYXllclNlcnZpY2UuZ2V0TGF5ZXIoKTtcbiAgICAgICAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICB2bS5tdnRTb3VyY2Uuc2V0U3R5bGUoY2xlYXJMYXllclN0eWxlKTtcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cblxuICAgICAgICBmdW5jdGlvbiB0b2dnbGVMaXN0UmVzb3VyY2VzKCl7XG4gICAgICAgICAgdm0uc2hvd1Jlc291cmNlcyA9ICF2bS5zaG93UmVzb3VyY2VzO1xuICAgICAgICAgIGlmKHZtLnNob3dSZXNvdXJjZXMpe1xuICAgICAgICAgICAgdm0ubGlzdFJlc291cmNlcygpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBsaXN0UmVzb3VyY2VzKCl7XG4gICAgICAgICAgaWYoIXZtLnJlc291cmNlcyl7XG4gICAgICAgICAgICBEYXRhU2VydmljZS5nZXRBbGwoJ2RhdGEvdGFibGVzJykudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICAgICAgICAgIHZtLnJlc291cmNlcyA9IHJlc3BvbnNlO1xuICAgICAgICAgICAgICB2bS5zZWxlY3RlZFJlc291cmNlcyA9IFtdLCB2bS5zb3J0ZWRSZXNvdXJjZXMgPSBbXTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfVxuXG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gc2VsZWN0ZWRSZXNvdXJjZShyZXNvdXJjZSl7XG4gICAgICAgICAgcmV0dXJuIHZtLnNlbGVjdGVkUmVzb3VyY2VzLmluZGV4T2YocmVzb3VyY2UpID4gLTEgPyB0cnVlIDogZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gZGVsZXRlRnJvbUdyb3VwKHJlc291cmNlLCBsaXN0KXtcbiAgICAgICAgICBhbmd1bGFyLmZvckVhY2gobGlzdCwgZnVuY3Rpb24oaXRlbSwga2V5KXtcbiAgICAgICAgICAgICAgLy9pZih0eXBlb2YgaXRlbS5pc0dyb3VwID09IFwidW5kZWZpbmVkXCIpe1xuICAgICAgICAgICAgICAgIGlmKGl0ZW0gPT0gcmVzb3VyY2Upe1xuICAgICAgICAgICAgICAgICAgbGlzdC5zcGxpY2Uoa2V5LCAxKTtcbiAgICAgICAgICAgICAgICAgIHZtLnNlbGVjdGVkRm9yR3JvdXAuc3BsaWNlKHZtLnNlbGVjdGVkRm9yR3JvdXAuaW5kZXhPZihpdGVtKSwgMSk7XG4gICAgICAgICAgICAgICAgICB2bS5zZWxlY3RlZFJlc291cmNlcy5zcGxpY2Uodm0uc2VsZWN0ZWRSZXNvdXJjZXMuaW5kZXhPZihpdGVtKSwxKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIC8vfVxuICAgICAgICAgICAgICBkZWxldGVGcm9tR3JvdXAocmVzb3VyY2UsIGl0ZW0ubm9kZXMpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIHRvZ2dsZVJlc291cmNlKHJlc291cmNlKXtcbiAgICAgICAgICB2YXIgaWR4ID0gdm0uc2VsZWN0ZWRSZXNvdXJjZXMuaW5kZXhPZihyZXNvdXJjZSk7XG4gICAgICAgICAgaWYoIGlkeCA+IC0xKXtcbiAgICAgICAgICAgIHZtLnNlbGVjdGVkUmVzb3VyY2VzLnNwbGljZShpZHgsIDEpO1xuICAgICAgICAgICAgZGVsZXRlRnJvbUdyb3VwKHJlc291cmNlLCB2bS5ncm91cHMpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgdm0uc2VsZWN0ZWRSZXNvdXJjZXMucHVzaChyZXNvdXJjZSk7XG4gICAgICAgICAgICBpZih2bS5zZWxlY3RlZEZvckdyb3VwLmxlbmd0aCA9PSAxICYmIHR5cGVvZiB2bS5zZWxlY3RlZEZvckdyb3VwWzBdLmlzR3JvdXAgIT0gXCJ1bmRlZmluZWRcIil7XG4gICAgICAgICAgICAgIHZtLnNlbGVjdGVkRm9yR3JvdXBbMF0ubm9kZXMucHVzaChyZXNvdXJjZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICAgIHZtLmdyb3Vwcy5wdXNoKHJlc291cmNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvL2NhbGNQZXJjZW50YWdlKHZtLnNvcnRlZFJlc291cmNlcyk7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gY2FsY1BlcmNlbnRhZ2Uobm9kZXMpe1xuICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaChub2RlcywgZnVuY3Rpb24obm9kZSwga2V5KXtcbiAgICAgICAgICAgIG5vZGVzW2tleV0ud2VpZ2h0ID0gcGFyc2VJbnQoMTAwIC8gbm9kZXMubGVuZ3RoKTtcbiAgICAgICAgICAgIGNhbGNQZXJjZW50YWdlKG5vZGVzLm5vZGUpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGluY3JlYXNlUGVyY2VudGFnZShpdGVtKXtcbiAgICAgICAgICBjb25zb2xlLmxvZyhpdGVtKTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBkZWNyZWFzZVBlcmNlbnRhZ2UoaXRlbSl7XG4gICAgICAgICAgY29uc29sZS5sb2coaXRlbSlcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiB0b2dnbGVHcm91cFNlbGVjdGlvbihpdGVtKXtcbiAgICAgICAgICB2YXIgaWR4ID0gdm0uc2VsZWN0ZWRGb3JHcm91cC5pbmRleE9mKGl0ZW0pO1xuICAgICAgICAgIGlmKCBpZHggPiAtMSl7XG4gICAgICAgICAgICB2bS5zZWxlY3RlZEZvckdyb3VwLnNwbGljZShpZHgsIDEpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgdm0uc2VsZWN0ZWRGb3JHcm91cC5wdXNoKGl0ZW0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBleGlzdHNJbkdyb3VwU2VsZWN0aW9uKGl0ZW0pe1xuICAgICAgICAgIHJldHVybiB2bS5zZWxlY3RlZEZvckdyb3VwLmluZGV4T2YoaXRlbSkgPiAtMTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBhZGRHcm91cCgpe1xuICAgICAgICAgIHZhciBuZXdHcm91cCA9IHtcbiAgICAgICAgICAgIHRpdGxlOidHcm91cCcsXG4gICAgICAgICAgICBpc0dyb3VwOnRydWUsXG4gICAgICAgICAgICBub2RlczpbXVxuICAgICAgICAgIH07XG5cbiAgICAgICAgICBpZih2bS5zZWxlY3RlZEZvckdyb3VwLmxlbmd0aCA9PSAxICYmIHR5cGVvZiB2bS5zZWxlY3RlZEZvckdyb3VwWzBdLmlzR3JvdXAgIT0gXCJ1bmRlZmluZWRcIil7XG4gICAgICAgICAgICB2bS5zZWxlY3RlZEZvckdyb3VwWzBdLm5vZGVzLnB1c2gobmV3R3JvdXApO1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIGlmKHZtLnNlbGVjdGVkRm9yR3JvdXAubGVuZ3RoID4gMCApe1xuICAgICAgICAgICAgICBhbmd1bGFyLmZvckVhY2godm0uc2VsZWN0ZWRGb3JHcm91cCwgZnVuY3Rpb24oaXRlbSwga2V5KXtcbiAgICAgICAgICAgICAgICAgIG5ld0dyb3VwLm5vZGVzLnB1c2goaXRlbSk7XG4gICAgICAgICAgICAgICAgICBkZWxldGVGcm9tR3JvdXAoaXRlbSwgdm0uc2VsZWN0ZWRGb3JHcm91cCk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB2bS5ncm91cHMucHVzaChuZXdHcm91cCk7XG4gICAgICAgICAgICAgIHZtLnNlbGVjdGVkRm9yR3JvdXAgPSBbXTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgIHZtLmdyb3Vwcy5wdXNoKG5ld0dyb3VwKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gY2xvbmVTZWxlY3Rpb24oKXtcbiAgICAgICAgICB2YXIgbmV3R3JvdXAgPSB7XG4gICAgICAgICAgICB0aXRsZTonQ2xvbmVkIEVsZW1lbnRzJyxcbiAgICAgICAgICAgIGlzR3JvdXA6dHJ1ZSxcbiAgICAgICAgICAgIG5vZGVzOltdXG4gICAgICAgICAgfTtcbiAgICAgICAgICBhbmd1bGFyLmZvckVhY2godm0uc2VsZWN0ZWRGb3JHcm91cCwgZnVuY3Rpb24oaXRlbSwga2V5KXtcbiAgICAgICAgICAgIG5ld0dyb3VwLm5vZGVzLnB1c2goaXRlbSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgdm0uZ3JvdXBzLnB1c2gobmV3R3JvdXApO1xuICAgICAgICAgIHZtLnNlbGVjdGVkRm9yR3JvdXAgPSBbXTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBlZGl0RW50cnkoaXRlbSl7XG4gICAgICAgICAgdm0uZWRpdEl0ZW0gPSBpdGVtO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIHJlbW92ZUVudHJ5KGl0ZW0sIGxpc3Qpe1xuICAgICAgICAgICAgZGVsZXRlRnJvbUdyb3VwKGl0ZW0sIGxpc3QpO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIHNhdmVJbmRleCgpe1xuICAgICAgICAgIGlmKHZtLnNhdmVEaXNhYmxlZCl7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIHZtLnNhdmVEaXNhYmxlZCA9IHRydWU7XG4gICAgICAgICAgaWYodHlwZW9mIHZtLm5ld0luZGV4ID09ICd1bmRlZmluZWQnKXtcbiAgICAgICAgICAgIHRvYXN0ci5lcnJvcignWW91IG5lZWQgdG8gZW50ZXIgYSB0aXRsZSEnLCdJbmZvIG1pc3NpbmcnKTtcbiAgICAgICAgICAgIHZtLnNhdmVEaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZighdm0ubmV3SW5kZXgudGl0bGUpe1xuICAgICAgICAgICAgdG9hc3RyLmVycm9yKCdZb3UgbmVlZCB0byBlbnRlciBhIHRpdGxlIScsJ0luZm8gbWlzc2luZycpO1xuICAgICAgICAgICAgdm0uc2F2ZURpc2FibGVkID0gZmFsc2U7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIHZtLm5ld0luZGV4LmRhdGEgPSB2bS5ncm91cHM7XG4gICAgICAgICAgRGF0YVNlcnZpY2UucG9zdCgnaW5kZXgnLCB2bS5uZXdJbmRleCkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICAgICAgICB2bS5zYXZlRGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIHRvYXN0ci5zdWNjZXNzKCdZb3VyIEluZGV4IGhhcyBiZWVuIGNyZWF0ZWQnLCAnU3VjY2VzcycpLFxuICAgICAgICAgICAgJHN0YXRlLmdvKCdhcHAuaW5kZXguc2hvdycsIHtpbmRleDpyZXNwb25zZS5uYW1lfSk7XG4gICAgICAgICAgfSxmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICAgICAgICB2bS5zYXZlRGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIHRvYXN0ci5lcnJvcihyZXNwb25zZS5tZXNzYWdlLCdVcHBzISEnKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICAvKiRzY29wZS4kb24oXCIkc3RhdGVDaGFuZ2VTdWNjZXNzXCIsIGZ1bmN0aW9uIChldmVudCwgdG9TdGF0ZSwgdG9QYXJhbXMsIGZyb21TdGF0ZSwgZnJvbVBhcmFtcykge1xuICAgICAgICAgIGlmKCF2bS5kYXRhLmxlbmd0aCl7XG4gICAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC5pbmRleC5jcmVhdGUnKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgIHN3aXRjaCAodG9TdGF0ZS5uYW1lKSB7XG4gICAgICAgICAgICAgIGNhc2UgJ2FwcC5pbmRleC5jcmVhdGUnOlxuICAgICAgICAgICAgICAgICAgdm0uc3RlcCA9IDA7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIGNhc2UgJ2FwcC5pbmRleC5jcmVhdGUuYmFzaWMnOlxuICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2codm0uZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIHZtLnN0ZXAgPSAxO1xuICAgICAgICAgICAgICAgICAgICBjaGVja015RGF0YSgpO1xuICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIGNhc2UgJ2FwcC5pbmRleC5jcmVhdGUuY2hlY2snOlxuICAgICAgICAgICAgICAgICAgdm0uc3RlcCA9IDI7XG4gICAgICAgICAgICAgICAgICB2bS5zaG93VXBsb2FkQ29udGFpbmVyID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIGNhc2UgJ2FwcC5pbmRleC5jcmVhdGUubWV0YSc6XG4gICAgICAgICAgICAgICAgICB2bS5zdGVwID0gMztcbiAgICAgICAgICAgICAgICAgICAgdm0uc2hvd1VwbG9hZENvbnRhaW5lciA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIGNhc2UgJ2FwcC5pbmRleC5jcmVhdGUuZmluYWwnOlxuICAgICAgICAgICAgICAgICAgdm0uc3RlcCA9IDQ7XG4gICAgICAgICAgICAgICAgICAgIHZtLnNob3dVcGxvYWRDb250YWluZXIgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7Ki9cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0luZGV4TXlEYXRhQ3RybCcsIGZ1bmN0aW9uKCl7XG4gICAgICAgIC8vXG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdJbmRleE15RGF0YUVudHJ5Q3RybCcsIGZ1bmN0aW9uKFVzZXJTZXJ2aWNlKXtcbiAgICAgIHZhciB2bSA9IHRoaXM7XG4gICAgICB2bS5kYXRhID0gVXNlclNlcnZpY2UubXlEYXRhKCk7XG4gICAgfSk7XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignSW5kZXhNeURhdGFNZW51Q3RybCcsIGZ1bmN0aW9uKFVzZXJTZXJ2aWNlKXtcbiAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgIHZtLmRhdGEgPSBbXTtcblxuICAgICAgYWN0aXZhdGUoKTtcblxuICAgICAgZnVuY3Rpb24gYWN0aXZhdGUoKXtcbiAgICAgICAgVXNlclNlcnZpY2UubXlEYXRhKCkudGhlbihmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgICB2bS5kYXRhID0gZGF0YTtcbiAgICAgICAgICAgIGNvbnZlcnRJbmZvKCk7XG4gICAgICAgIH0pXG5cbiAgICAgIH1cbiAgICAgIGZ1bmN0aW9uIGNvbnZlcnRJbmZvKCl7XG4gICAgICAgIGNvbnNvbGUubG9nKHZtLmRhdGEpO1xuICAgICAgICBhbmd1bGFyLmZvckVhY2godm0uZGF0YSwgZnVuY3Rpb24oaXRlbSl7XG4gICAgICAgICAgICBpdGVtLm1ldGEgPSBKU09OLnBhcnNlKGl0ZW0ubWV0YV9kYXRhKTtcbiAgICAgICAgfSlcblxuICAgICAgfVxuICAgIH0pO1xufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdJbmRleGVkaXRvcmNhdGVnb3J5Q3RybCcsIGZ1bmN0aW9uIChjYXRlZ29yeSwgRGF0YVNlcnZpY2UsQ29udGVudFNlcnZpY2UpIHtcbiAgICB2YXIgdm0gPSB0aGlzO1xuICAgIHZtLmNhdGVnb3J5ID0gY2F0ZWdvcnk7XG4gIH0pO1xufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdJbmRleGVkaXRvckN0cmwnLCBmdW5jdGlvbiAoJHNjb3BlLCAkZmlsdGVyLCAkdGltZW91dCwkc3RhdGUsIGluZGljYXRvcnMsIGluZGljZXMsIHN0eWxlcywgY2F0ZWdvcmllcywgRGF0YVNlcnZpY2UsQ29udGVudFNlcnZpY2UpIHtcblx0XHQvL1xuXHRcdHZhciB2bSA9IHRoaXM7XG5cblxuXHRcdHZtLmNhdGVnb3JpZXMgPSBjYXRlZ29yaWVzO1xuXHRcdHZtLmNvbXBvc2l0cyA9IGluZGljZXM7XG5cdFx0dm0uc3R5bGVzID0gc3R5bGVzO1xuXHRcdHZtLmluZGljYXRvcnMgPSBpbmRpY2F0b3JzO1xuXG5cdFx0dm0uc2VsZWN0aW9uID0ge1xuXHRcdFx0aW5kaWNlczpbXSxcblx0XHRcdGluZGljYXRvcnM6W10sXG5cdFx0XHRzdHlsZXM6W10sXG5cdFx0XHRjYXRlZ29yaWVzOltdXG5cdFx0fTtcblx0XHR2bS5zZWxlY3RlZFRhYiA9IDA7XG5cblx0XHR2bS5vcHRpb25zID0ge1xuXHRcdFx0Y29tcG9zaXRzOntcblx0XHRcdFx0ZHJhZzpmYWxzZSxcblx0XHRcdFx0dHlwZTonY29tcG9zaXRzJyxcblx0XHRcdFx0YWxsb3dNb3ZlOmZhbHNlLFxuXHRcdFx0XHRhbGxvd0Ryb3A6ZmFsc2UsXG5cdFx0XHRcdGFsbG93QWRkOnRydWUsXG5cdFx0XHRcdGFsbG93RGVsZXRlOnRydWUsXG5cdFx0XHRcdGl0ZW1DbGljazogZnVuY3Rpb24oaWQsIG5hbWUpe1xuXHRcdFx0XHRcdCRzdGF0ZS5nbygnYXBwLmluZGV4LmVkaXRvci5pbmRpemVzLmRhdGEnLCB7aWQ6aWQsIG5hbWU6bmFtZX0pXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGFkZENsaWNrOmZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0JHN0YXRlLmdvKCdhcHAuaW5kZXguZWRpdG9yLmluZGl6ZXMuZGF0YScsIHtpZDowLCBuYW1lOiAnbmV3J30pXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGRlbGV0ZUNsaWNrOmZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLnNlbGVjdGlvbi5pbmRpY2VzLGZ1bmN0aW9uKGl0ZW0sIGtleSl7XG5cdFx0XHRcdFx0XHRDb250ZW50U2VydmljZS5yZW1vdmVJdGVtKGl0ZW0uaWQpLnRoZW4oZnVuY3Rpb24oZGF0YSl7XG5cdFx0XHRcdFx0XHRcdHJlbW92ZUl0ZW0oaXRlbSx2bS5jb21wb3NpdHMpO1xuXHRcdFx0XHRcdFx0XHR2bS5zZWxlY3Rpb24uaW5kaWNlcyA9IFtdO1xuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHRjYXRlZ29yaWVzOntcblx0XHRcdFx0ZHJhZzpmYWxzZSxcblx0XHRcdFx0dHlwZTonY2F0ZWdvcmllcycsXG5cdFx0XHRcdGl0ZW1DbGljazogZnVuY3Rpb24oaWQsIG5hbWUpe1xuXHRcdFx0XHRcdCRzdGF0ZS5nbygnYXBwLmluZGV4LmVkaXRvci5jYXRlZ29yaWVzLmNhdGVnb3J5Jywge2lkOmlkfSlcblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdHN0eWxlczp7XG5cdFx0XHRcdGRyYWc6ZmFsc2UsXG5cdFx0XHRcdHR5cGU6J3N0eWxlcycsXG5cdFx0XHRcdHdpdGhDb2xvcjp0cnVlXG5cdFx0XHR9XG5cdFx0fTtcblx0XHR2bS5maWx0ZXIgPSB7XG5cdFx0XHRzb3J0Oid0aXRsZScsXG5cdFx0XHRyZXZlcnNlOmZhbHNlLFxuXHRcdFx0bGlzdDogMCxcblx0XHRcdHB1Ymxpc2hlZDogZmFsc2UsXG5cdFx0XHR0eXBlczoge1xuXHRcdFx0XHR0aXRsZTogdHJ1ZSxcblx0XHRcdFx0c3R5bGU6IGZhbHNlLFxuXHRcdFx0XHRjYXRlZ29yaWVzOiBmYWxzZSxcblx0XHRcdFx0aW5mb2dyYXBoaWM6IGZhbHNlLFxuXHRcdFx0XHRkZXNjcmlwdGlvbjogZmFsc2UsXG5cdFx0XHR9XG5cdFx0fTtcblx0XHR2bS5zZWFyY2ggPSB7XG5cdFx0XHRxdWVyeTogJycsXG5cdFx0XHRzaG93OiBmYWxzZVxuXHRcdH07XG5cdFx0dm0ub3Blbk1lbnUgPSBvcGVuTWVudTtcblx0XHR2bS50b2dnbGVMaXN0ID0gdG9nZ2xlTGlzdDtcblx0XHR2bS5jaGVja1RhYkNvbnRlbnQgPSBjaGVja1RhYkNvbnRlbnQ7XG5cblxuXHRcdGZ1bmN0aW9uIHRvZ2dsZUxpc3Qoa2V5KXtcblx0XHRcdGlmKHZtLnZpc2libGVMaXN0ID09IGtleSl7XG5cdFx0XHRcdHZtLnZpc2libGVMaXN0ID0gJyc7XG5cdFx0XHR9XG5cdFx0XHRlbHNle1xuXHRcdFx0XHR2bS52aXNpYmxlTGlzdCA9IGtleTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRmdW5jdGlvbiByZW1vdmVJdGVtKGl0ZW0sIGxpc3Qpe1xuXHRcdFx0YW5ndWxhci5mb3JFYWNoKGxpc3QsIGZ1bmN0aW9uKGVudHJ5LCBrZXkpe1xuXHRcdFx0XHRpZihlbnRyeS5pZCA9PSBpdGVtLmlkKXtcblx0XHRcdFx0XHRsaXN0LnNwbGljZShrZXksIDEpO1xuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmKGVudHJ5LmNoaWxkcmVuKXtcblx0XHRcdFx0XHR2YXIgc3VicmVzdWx0ID0gcmVtb3ZlSXRlbShpdGVtLCBlbnRyeS5jaGlsZHJlbik7XG5cdFx0XHRcdFx0aWYoc3VicmVzdWx0KXtcblx0XHRcdFx0XHRcdHJldHVybiBzdWJyZXN1bHQ7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cdFx0LypmdW5jdGlvbiBzZWxlY3RlZEl0ZW0oaXRlbSkge1xuXHRcdFx0cmV0dXJuIHZtLnNlbGVjdGlvbi5pbmRleE9mKGl0ZW0pID4gLTEgPyB0cnVlIDogZmFsc2U7XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIHNlbGVjdEFsbCgpe1xuXHRcdFx0aWYodm0uc2VsZWN0aW9uLmxlbmd0aCl7XG5cdFx0XHRcdHZtLnNlbGVjdGlvbiA9IFtdO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZXtcblx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLmluZGljYXRvcnMsIGZ1bmN0aW9uKGl0ZW0pe1xuXHRcdFx0XHRcdGlmKHZtLnNlbGVjdGlvbi5pbmRleE9mKGl0ZW0pID09IC0xKXtcblx0XHRcdFx0XHRcdHZtLnNlbGVjdGlvbi5wdXNoKGl0ZW0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIHNlbGVjdEFsbEdyb3VwKGdyb3VwKXtcblx0XHRcdHZtLnNlbGVjdGlvbiA9IFtdO1xuXHRcdFx0YW5ndWxhci5mb3JFYWNoKGdyb3VwLCBmdW5jdGlvbihpdGVtKXtcblx0XHRcdFx0dm0uc2VsZWN0aW9uLnB1c2goaXRlbSk7XG5cdFx0XHR9KTtcblxuXHRcdH1cblx0XHRmdW5jdGlvbiB0b2dnbGVTZWxlY3Rpb24oaXRlbSkge1xuXHRcdFx0dmFyIGluZGV4ID0gdm0uc2VsZWN0aW9uLmluZGV4T2YoaXRlbSk7XG5cdFx0XHRpZiAoaW5kZXggPiAtMSkge1xuXHRcdFx0XHRyZXR1cm4gdm0uc2VsZWN0aW9uLnNwbGljZShpbmRleCwgMSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXR1cm4gdm0uc2VsZWN0aW9uLnB1c2goaXRlbSk7XG5cdFx0XHR9XG5cdFx0fSovXG5cblx0XHRmdW5jdGlvbiBjaGVja1RhYkNvbnRlbnQoaW5kZXgpe1xuXHRcdFx0c3dpdGNoIChpbmRleCkge1xuXHRcdFx0XHRjYXNlIDE6XG5cdFx0XHRcdFx0XHQkc3RhdGUuZ28oJ2FwcC5pbmRleC5lZGl0b3IuaW5kaWNhdG9ycycpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIDI6XG5cdFx0XHRcdFx0XHQkc3RhdGUuZ28oJ2FwcC5pbmRleC5lZGl0b3IuY2F0ZWdvcmllcycpO1xuXG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgMDpcblx0XHRcdFx0XHRcdGlmKHR5cGVvZiAkc3RhdGUucGFyYW1zLmlkICE9IFwidW5kZWZpbmVkXCIpe1xuXHRcdFx0XHRcdFx0XHRcdCRzdGF0ZS5nbygnYXBwLmluZGV4LmVkaXRvci5pbmRpemVzLmRhdGEnLHtcblx0XHRcdFx0XHRcdFx0XHRcdGlkOiRzdGF0ZS5wYXJhbXMuaWRcblx0XHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGVsc2V7XG5cdFx0XHRcdFx0XHRcdFx0JHN0YXRlLmdvKCdhcHAuaW5kZXguZWRpdG9yLmluZGl6ZXMnKTtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIDM6XG5cblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0ZGVmYXVsdDpcblxuXHRcdFx0fVxuXHRcdH1cblx0XHRmdW5jdGlvbiBvcGVuTWVudSgkbWRPcGVuTWVudSwgZXYpIHtcblx0XHRcdCRtZE9wZW5NZW51KGV2KTtcblx0XHR9XG5cblx0XHQkc2NvcGUuJHdhdGNoKCd2bS5zZWFyY2gucXVlcnknLCBmdW5jdGlvbiAocXVlcnksIG9sZFF1ZXJ5KSB7XG5cdFx0XHRpZihxdWVyeSA9PT0gb2xkUXVlcnkpIHJldHVybiBmYWxzZTtcblx0XHRcdHZtLnF1ZXJ5ID0gdm0uZmlsdGVyLnR5cGVzO1xuXHRcdFx0dm0ucXVlcnkucSA9IHF1ZXJ5O1xuXHRcdFx0dm0uaW5kaWNhdG9ycyA9IENvbnRlbnRTZXJ2aWNlLmZldGNoSW5kaWNhdG9ycyh2bS5xdWVyeSk7XG5cdFx0fSk7XG5cdFx0JHNjb3BlLiRvbignJHN0YXRlQ2hhbmdlU3VjY2VzcycsIGZ1bmN0aW9uKGV2ZW50LCB0b1N0YXRlLCB0b1BhcmFtcywgZnJvbVN0YXRlLCBmcm9tUGFyYW1zKXtcblx0XHRcdGlmKHRvU3RhdGUubmFtZS5pbmRleE9mKCdhcHAuaW5kZXguZWRpdG9yLmluZGljYXRvcnMnKSAhPSAtMSl7XG5cdFx0XHRcdHZtLnNlbGVjdGVkVGFiID0gMTtcblx0XHRcdFx0YWN0aXZhdGUodG9QYXJhbXMpO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSBpZih0b1N0YXRlLm5hbWUuaW5kZXhPZignYXBwLmluZGV4LmVkaXRvci5jYXRlZ29yaWVzJykgIT0gLTEpe1xuXHRcdFx0XHR2bS5zZWxlY3RlZFRhYiA9IDI7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIGlmKHRvU3RhdGUubmFtZS5pbmRleE9mKCdhcHAuaW5kZXguZWRpdG9yLmluZGl6ZXMnKSAhPSAtMSl7XG5cdFx0XHRcdHZtLnNlbGVjdGVkVGFiID0gMDtcblxuXHRcdFx0fVxuXHRcdH0pO1xuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdJbmRleGVkaXRvcmluZGljYXRvckN0cmwnLCBmdW5jdGlvbiAoJHNjb3BlLCAkc3RhdGUsJHRpbWVvdXQsIFZlY3RvcmxheWVyU2VydmljZSwgbGVhZmxldERhdGEsIENvbnRlbnRTZXJ2aWNlLCBpbmRpY2F0b3IpIHtcblx0XHQvL1xuXHRcdHZhciB2bSA9IHRoaXM7XG4gICAgdm0uaW5kaWNhdG9yID0gaW5kaWNhdG9yO1xuXHRcdHZtLnNjYWxlID0gXCJcIjtcblx0XHR2bS5taW4gPSAxMDAwMDAwMDtcblx0XHR2bS5tYXggPSAwO1xuXHRcdHZtLnNlbGVjdGVkID0gMDtcblx0XHRzZXRBY3RpdmUoKTtcblxuXHRcdENvbnRlbnRTZXJ2aWNlLmdldEluZGljYXRvckRhdGEoJHN0YXRlLnBhcmFtcy5pZCkudGhlbihmdW5jdGlvbihkYXRhKXtcblx0XHRcdHZhciBiYXNlX2NvbG9yID0gJyNmZjAwMDAnO1xuXHRcdFx0aWYodHlwZW9mIHZtLmluZGljYXRvci5zdHlsZSA9PSBcInVuZGVmaW5lZFwiKXtcblx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLmluZGljYXRvci5jYXRlZ29yaWVzLCBmdW5jdGlvbihjYXQpe1xuXHRcdFx0XHRcdGlmKHR5cGVvZiBjYXQuc3R5bGUgIT0gXCJ1bmRlZmluZWRcIil7XG5cdFx0XHRcdFx0XHRiYXNlX2NvbG9yID0gY2F0LnN0eWxlLmJhc2VfY29sb3I7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHRcdGVsc2UgaWYodm0uaW5kaWNhdG9yLnN0eWxlKXtcblx0XHRcdFx0YmFzZV9jb2xvciA9IHZtLmluZGljYXRvci5zdHlsZS5iYXNlX2NvbG9yO1xuXHRcdFx0fVxuXHRcdFx0VmVjdG9ybGF5ZXJTZXJ2aWNlLmNyZWF0ZUNhbnZhcyhiYXNlX2NvbG9yICk7XG5cdFx0XHR2bS5kYXRhID0gZGF0YTtcblx0XHRcdG1pbk1heCgpO1xuXHRcdFx0ZHJhd0NvdW50cmllcygpO1xuXHRcdH0pO1xuXHRcdGZ1bmN0aW9uIHNldEFjdGl2ZSgpe1xuXHRcdFx0aWYoJHN0YXRlLmN1cnJlbnQubmFtZSA9PSAnYXBwLmluZGV4LmVkaXRvci5pbmRpY2F0b3IuZGV0YWlscycpe1xuXHRcdFx0XHRpZigkc3RhdGUucGFyYW1zLmVudHJ5ID09IFwiaW5mb2dyYXBoaWNcIil7XG5cdFx0XHRcdFx0dm0uc2VsZWN0ZWQgPSAxO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2UgaWYoJHN0YXRlLnBhcmFtcy5lbnRyeSA9PSBcImluZGl6ZXNcIil7XG5cdFx0XHRcdFx0dm0uc2VsZWN0ZWQgPSAyO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2UgaWYoJHN0YXRlLnBhcmFtcy5lbnRyeSA9PSBcInN0eWxlXCIpe1xuXHRcdFx0XHRcdHZtLnNlbGVjdGVkID0gMztcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIGlmKCRzdGF0ZS5wYXJhbXMuZW50cnkgPT0gXCJjYXRlZ29yaWVzXCIpe1xuXHRcdFx0XHRcdHZtLnNlbGVjdGVkID0gNDtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNle1xuXHRcdFx0XHRcdHZtLnNlbGVjdGVkID0gMDtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0XHRmdW5jdGlvbiBtaW5NYXgoKXtcblx0XHRcdHZtLm1pbiA9IDEwMDAwMDAwO1xuXHRcdFx0dm0ubWF4ID0gMDtcblx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5kYXRhLCBmdW5jdGlvbihpdGVtLCBrZXkpe1xuXHRcdFx0XHRcdHZtLm1pbiA9IE1hdGgubWluKGl0ZW0uc2NvcmUsIHZtLm1pbik7XG5cdFx0XHRcdFx0dm0ubWF4ID0gTWF0aC5tYXgoaXRlbS5zY29yZSwgdm0ubWF4KTtcblx0XHRcdH0pO1xuXHRcdFx0dm0uc2NhbGUgPSBkMy5zY2FsZS5saW5lYXIoKS5kb21haW4oW3ZtLm1pbix2bS5tYXhdKS5yYW5nZShbMCwxMDBdKTtcblx0XHR9XG5cdFx0ZnVuY3Rpb24gZ2V0VmFsdWVCeUlzbyhpc28pe1xuXHRcdFx0dmFyIHZhbHVlID0gMDtcblx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5kYXRhLCBmdW5jdGlvbihpdGVtLCBrZXkpe1xuXHRcdFx0XHQgaWYoaXRlbS5pc28gPT0gaXNvKXtcblx0XHRcdFx0XHQgdmFsdWUgPSBpdGVtLnNjb3JlO1xuXHRcdFx0XHQgfVxuXHRcdFx0fSk7XG5cdFx0XHRyZXR1cm4gdmFsdWU7XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIGNvdW50cmllc1N0eWxlKGZlYXR1cmUpIHtcblx0XHRcdHZhciBzdHlsZSA9IHt9O1xuXHRcdFx0dmFyIGlzbyA9IGZlYXR1cmUucHJvcGVydGllcy5pc29fYTI7XG5cdFx0XHR2YXIgdmFsdWUgPSBnZXRWYWx1ZUJ5SXNvKGlzbykgfHwgdm0ubWluO1xuXHRcdFx0dmFyIHR5cGUgPSBmZWF0dXJlLnR5cGU7XG5cblx0XHRcdHN3aXRjaCAodHlwZSkge1xuXHRcdFx0XHRjYXNlIDM6IC8vJ1BvbHlnb24nXG5cdFx0XHRcdFx0dmFyIGNvbG9yUG9zID0gcGFyc2VJbnQoMjU2IC8gMTAwICogcGFyc2VJbnQodm0uc2NhbGUodmFsdWUpKSkgKiA0O1xuXHRcdFx0XHRcdHZhciBjb2xvciA9ICdyZ2JhKCcgKyBWZWN0b3JsYXllclNlcnZpY2UuZ2V0Q29sb3IoY29sb3JQb3MpICsgJywgJyArIFZlY3RvcmxheWVyU2VydmljZS5nZXRDb2xvcihjb2xvclBvcyArIDEpICsgJywgJyArIFZlY3RvcmxheWVyU2VydmljZS5nZXRDb2xvcihjb2xvclBvcyArIDIpICsgJywnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldENvbG9yKGNvbG9yUG9zICsgMykgKyAnKSc7XG5cdFx0XHRcdFx0c3R5bGUuY29sb3IgPSAncmdiYSgnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldENvbG9yKGNvbG9yUG9zKSAgKyAnLCAnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldENvbG9yKGNvbG9yUG9zICsgMSkgKyAnLCAnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldENvbG9yKGNvbG9yUG9zICsgMikgKyAnLDAuNiknOyAvL2NvbG9yO1xuXHRcdFx0XHRcdHN0eWxlLm91dGxpbmUgPSB7XG5cdFx0XHRcdFx0XHRjb2xvcjogY29sb3IsXG5cdFx0XHRcdFx0XHRzaXplOiAxXG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRzdHlsZS5zZWxlY3RlZCA9IHtcblx0XHRcdFx0XHRcdGNvbG9yOiAncmdiYSgnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldENvbG9yKGNvbG9yUG9zKSArICcsICcgKyBWZWN0b3JsYXllclNlcnZpY2UuZ2V0Q29sb3IoY29sb3JQb3MgKyAxKSArICcsICcgKyBWZWN0b3JsYXllclNlcnZpY2UuZ2V0Q29sb3IoY29sb3JQb3MgKyAyKSArICcsMC4zKScsXG5cdFx0XHRcdFx0XHRvdXRsaW5lOiB7XG5cdFx0XHRcdFx0XHRcdGNvbG9yOiAncmdiYSg2Niw2Niw2NiwwLjkpJyxcblx0XHRcdFx0XHRcdFx0c2l6ZTogMlxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdH1cblx0XHRcdHJldHVybiBzdHlsZTtcblx0XHR9XG5cdFx0ZnVuY3Rpb24gZHJhd0NvdW50cmllcygpIHtcblx0XHRcdG1pbk1heCgpO1xuXHRcdFx0bGVhZmxldERhdGEuZ2V0TWFwKCdtYXAnKS50aGVuKGZ1bmN0aW9uIChtYXApIHtcblx0XHRcdFx0dm0ubWFwID0gbWFwO1xuXHRcdFx0XHR2bS5tdnRTb3VyY2UgPSBWZWN0b3JsYXllclNlcnZpY2UuZ2V0TGF5ZXIoKTtcblx0XHRcdFx0JHRpbWVvdXQoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0dm0ubXZ0U291cmNlLnNldFN0eWxlKGNvdW50cmllc1N0eWxlKTtcblx0XHRcdFx0XHQvL3ZtLm12dFNvdXJjZS5yZWRyYXcoKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHQkc2NvcGUuJG9uKCckc3RhdGVDaGFuZ2VTdWNjZXNzJywgZnVuY3Rpb24oKXtcblx0XHRcdHNldEFjdGl2ZSgpO1xuXHRcdH0pO1xuXG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0luZGV4aW5pZGNhdG9yc0N0cmwnLCBmdW5jdGlvbiAoaW5kaWNhdG9ycywgRGF0YVNlcnZpY2UsQ29udGVudFNlcnZpY2UpIHtcblx0XHQvL1xuICAgIHZhciB2bSA9IHRoaXM7XG4gICAgdm0uaW5kaWNhdG9ycyA9IGluZGljYXRvcnM7XG5cblxuICB9KVxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdJbmRleGVkaXRvcmluZGl6ZXNDdHJsJywgZnVuY3Rpb24gKCRzY29wZSwgJHN0YXRlLCR0aW1lb3V0LCBWZWN0b3JsYXllclNlcnZpY2UsIGxlYWZsZXREYXRhLCBDb250ZW50U2VydmljZSwgaW5kZXgpIHtcblx0XHQvL1xuXHRcdHZhciB2bSA9IHRoaXM7XG4gICAgLy92bS5pbmRpY2F0b3IgPSBpbmRpY2F0b3I7XG4gICAgdm0uaW5kZXggPSBpbmRleDtcblx0XHR2bS5zY2FsZSA9IFwiXCI7XG5cdFx0dm0ubWluID0gMTAwMDAwMDA7XG5cdFx0dm0ubWF4ID0gMDtcblx0XHR2bS5zZWxlY3RlZCA9IDA7XG5cdFx0c2V0QWN0aXZlKCk7XG4gICAgdm0ub3B0aW9ucyA9IHtcbiAgICAgIGluZGl6ZXM6e1xuICAgICAgICBhZGRDbGljazogZnVuY3Rpb24oKXtcbiAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC5pbmRleC5lZGl0b3IuaW5kaXplcy5kYXRhLmFkZCcpO1xuICAgICAgICB9LFxuXHRcdFx0XHRhZGRDb250YWluZXJDbGljazpmdW5jdGlvbigpe1xuXHRcdFx0XHRcdHZhciBpdGVtID0ge1xuXHRcdFx0XHRcdFx0dGl0bGU6ICdJIGFtIGEgZ3JvdXAuLi4gbmFtZSBtZSdcblx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdHZtLmluZGV4LmNoaWxkcmVuLnB1c2goaXRlbSk7XG5cdFx0XHRcdH1cbiAgICAgIH0sXG4gICAgICB3aXRoU2F2ZTogdHJ1ZVxuICAgIH1cblxuXHRcdGFjdGl2ZSgpO1xuXG5cblx0XHRmdW5jdGlvbiBhY3RpdmUoKXtcblx0XHRcdGNvbnNvbGUubG9nKHZtLmluZGV4KTtcblx0XHR9XG5cblx0XHQvKkNvbnRlbnRTZXJ2aWNlLmdldEluZGljYXRvckRhdGEoJHN0YXRlLnBhcmFtcy5pZCkudGhlbihmdW5jdGlvbihkYXRhKXtcblx0XHRcdHZhciBiYXNlX2NvbG9yID0gJyNmZjAwMDAnO1xuXHRcdFx0aWYodHlwZW9mIHZtLmluZGljYXRvci5zdHlsZSA9PSBcInVuZGVmaW5lZFwiKXtcblx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLmluZGljYXRvci5jYXRlZ29yaWVzLCBmdW5jdGlvbihjYXQpe1xuXHRcdFx0XHRcdGlmKHR5cGVvZiBjYXQuc3R5bGUgIT0gXCJ1bmRlZmluZWRcIil7XG5cdFx0XHRcdFx0XHRiYXNlX2NvbG9yID0gY2F0LnN0eWxlLmJhc2VfY29sb3I7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHRcdGVsc2UgaWYodm0uaW5kaWNhdG9yLnN0eWxlKXtcblx0XHRcdFx0YmFzZV9jb2xvciA9IHZtLmluZGljYXRvci5zdHlsZS5iYXNlX2NvbG9yO1xuXHRcdFx0fVxuXHRcdFx0VmVjdG9ybGF5ZXJTZXJ2aWNlLmNyZWF0ZUNhbnZhcyhiYXNlX2NvbG9yICk7XG5cdFx0XHR2bS5kYXRhID0gZGF0YTtcblx0XHRcdG1pbk1heCgpO1xuXHRcdFx0ZHJhd0NvdW50cmllcygpO1xuXHRcdH0pOyovXG5cblx0XHRmdW5jdGlvbiBzZXRBY3RpdmUoKXtcblx0XHQvKlx0aWYoJHN0YXRlLmN1cnJlbnQubmFtZSA9PSAnYXBwLmluZGV4LmVkaXRvci5pbmRpY2F0b3IuZGV0YWlscycpe1xuXHRcdFx0XHRpZigkc3RhdGUucGFyYW1zLmVudHJ5ID09IFwiaW5mb2dyYXBoaWNcIil7XG5cdFx0XHRcdFx0dm0uc2VsZWN0ZWQgPSAxO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2UgaWYoJHN0YXRlLnBhcmFtcy5lbnRyeSA9PSBcImluZGl6ZXNcIil7XG5cdFx0XHRcdFx0dm0uc2VsZWN0ZWQgPSAyO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2UgaWYoJHN0YXRlLnBhcmFtcy5lbnRyeSA9PSBcInN0eWxlXCIpe1xuXHRcdFx0XHRcdHZtLnNlbGVjdGVkID0gMztcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIGlmKCRzdGF0ZS5wYXJhbXMuZW50cnkgPT0gXCJjYXRlZ29yaWVzXCIpe1xuXHRcdFx0XHRcdHZtLnNlbGVjdGVkID0gNDtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNle1xuXHRcdFx0XHRcdHZtLnNlbGVjdGVkID0gMDtcblx0XHRcdFx0fVxuXHRcdFx0fSovXG5cdFx0fVxuXHRcdGZ1bmN0aW9uIG1pbk1heCgpe1xuXHRcdFx0dm0ubWluID0gMTAwMDAwMDA7XG5cdFx0XHR2bS5tYXggPSAwO1xuXHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLmRhdGEsIGZ1bmN0aW9uKGl0ZW0sIGtleSl7XG5cdFx0XHRcdFx0dm0ubWluID0gTWF0aC5taW4oaXRlbS5zY29yZSwgdm0ubWluKTtcblx0XHRcdFx0XHR2bS5tYXggPSBNYXRoLm1heChpdGVtLnNjb3JlLCB2bS5tYXgpO1xuXHRcdFx0fSk7XG5cdFx0XHR2bS5zY2FsZSA9IGQzLnNjYWxlLmxpbmVhcigpLmRvbWFpbihbdm0ubWluLHZtLm1heF0pLnJhbmdlKFswLDEwMF0pO1xuXHRcdH1cblx0XHRmdW5jdGlvbiBnZXRWYWx1ZUJ5SXNvKGlzbyl7XG5cdFx0XHR2YXIgdmFsdWUgPSAwO1xuXHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLmRhdGEsIGZ1bmN0aW9uKGl0ZW0sIGtleSl7XG5cdFx0XHRcdCBpZihpdGVtLmlzbyA9PSBpc28pe1xuXHRcdFx0XHRcdCB2YWx1ZSA9IGl0ZW0uc2NvcmU7XG5cdFx0XHRcdCB9XG5cdFx0XHR9KTtcblx0XHRcdHJldHVybiB2YWx1ZTtcblx0XHR9XG5cdFx0ZnVuY3Rpb24gY291bnRyaWVzU3R5bGUoZmVhdHVyZSkge1xuXHRcdFx0dmFyIHN0eWxlID0ge307XG5cdFx0XHR2YXIgaXNvID0gZmVhdHVyZS5wcm9wZXJ0aWVzLmlzb19hMjtcblx0XHRcdHZhciB2YWx1ZSA9IGdldFZhbHVlQnlJc28oaXNvKSB8fCB2bS5taW47XG5cdFx0XHR2YXIgdHlwZSA9IGZlYXR1cmUudHlwZTtcblxuXHRcdFx0c3dpdGNoICh0eXBlKSB7XG5cdFx0XHRcdGNhc2UgMzogLy8nUG9seWdvbidcblx0XHRcdFx0XHR2YXIgY29sb3JQb3MgPSBwYXJzZUludCgyNTYgLyAxMDAgKiBwYXJzZUludCh2bS5zY2FsZSh2YWx1ZSkpKSAqIDQ7XG5cdFx0XHRcdFx0dmFyIGNvbG9yID0gJ3JnYmEoJyArIFZlY3RvcmxheWVyU2VydmljZS5nZXRDb2xvcihjb2xvclBvcykgKyAnLCAnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldENvbG9yKGNvbG9yUG9zICsgMSkgKyAnLCAnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldENvbG9yKGNvbG9yUG9zICsgMikgKyAnLCcgKyBWZWN0b3JsYXllclNlcnZpY2UuZ2V0Q29sb3IoY29sb3JQb3MgKyAzKSArICcpJztcblx0XHRcdFx0XHRzdHlsZS5jb2xvciA9ICdyZ2JhKCcgKyBWZWN0b3JsYXllclNlcnZpY2UuZ2V0Q29sb3IoY29sb3JQb3MpICArICcsICcgKyBWZWN0b3JsYXllclNlcnZpY2UuZ2V0Q29sb3IoY29sb3JQb3MgKyAxKSArICcsICcgKyBWZWN0b3JsYXllclNlcnZpY2UuZ2V0Q29sb3IoY29sb3JQb3MgKyAyKSArICcsMC42KSc7IC8vY29sb3I7XG5cdFx0XHRcdFx0c3R5bGUub3V0bGluZSA9IHtcblx0XHRcdFx0XHRcdGNvbG9yOiBjb2xvcixcblx0XHRcdFx0XHRcdHNpemU6IDFcblx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdHN0eWxlLnNlbGVjdGVkID0ge1xuXHRcdFx0XHRcdFx0Y29sb3I6ICdyZ2JhKCcgKyBWZWN0b3JsYXllclNlcnZpY2UuZ2V0Q29sb3IoY29sb3JQb3MpICsgJywgJyArIFZlY3RvcmxheWVyU2VydmljZS5nZXRDb2xvcihjb2xvclBvcyArIDEpICsgJywgJyArIFZlY3RvcmxheWVyU2VydmljZS5nZXRDb2xvcihjb2xvclBvcyArIDIpICsgJywwLjMpJyxcblx0XHRcdFx0XHRcdG91dGxpbmU6IHtcblx0XHRcdFx0XHRcdFx0Y29sb3I6ICdyZ2JhKDY2LDY2LDY2LDAuOSknLFxuXHRcdFx0XHRcdFx0XHRzaXplOiAyXG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHN0eWxlO1xuXHRcdH1cblx0XHRmdW5jdGlvbiBkcmF3Q291bnRyaWVzKCkge1xuXHRcdFx0bWluTWF4KCk7XG5cdFx0XHRsZWFmbGV0RGF0YS5nZXRNYXAoJ21hcCcpLnRoZW4oZnVuY3Rpb24gKG1hcCkge1xuXHRcdFx0XHR2bS5tYXAgPSBtYXA7XG5cdFx0XHRcdHZtLm12dFNvdXJjZSA9IFZlY3RvcmxheWVyU2VydmljZS5nZXRMYXllcigpO1xuXHRcdFx0XHQkdGltZW91dChmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHR2bS5tdnRTb3VyY2Uuc2V0U3R5bGUoY291bnRyaWVzU3R5bGUpO1xuXHRcdFx0XHRcdC8vdm0ubXZ0U291cmNlLnJlZHJhdygpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdCRzY29wZS4kb24oJyRzdGF0ZUNoYW5nZVN1Y2Nlc3MnLCBmdW5jdGlvbigpe1xuXHRcdFx0c2V0QWN0aXZlKCk7XG5cdFx0fSk7XG5cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignSW5kZXhpbmZvQ3RybCcsIGZ1bmN0aW9uKEluZGl6ZXNTZXJ2aWNlKXtcbiAgICAgICAgdmFyIHZtID0gdGhpcztcbiAgICAgICAgdm0uc3RydWN0dXJlID0gSW5kaXplc1NlcnZpY2UuZ2V0U3RydWN0dXJlKCk7XG4gICAgfSk7XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignSW5kaWNhdG9yU2hvd0N0cmwnLCBmdW5jdGlvbigkc2NvcGUsICRzdGF0ZSwgJGZpbHRlciwkdGltZW91dCwgaW5kaWNhdG9yLCBjb3VudHJpZXMsIENvbnRlbnRTZXJ2aWNlLCBWZWN0b3JsYXllclNlcnZpY2UsIHRvYXN0cikge1xuXHRcdC8vXG5cdFx0dmFyIHZtID0gdGhpcztcblx0XHR2bS5jdXJyZW50ID0gbnVsbDtcblx0XHR2bS5hY3RpdmUgPSBudWxsO1xuXHRcdHZtLmNvdW50cnlMaXN0ID0gY291bnRyaWVzO1xuXHRcdHZtLmluZGljYXRvciA9IGluZGljYXRvcjtcblx0XHR2bS5kYXRhID0gW107XG5cdFx0dm0ucmFuZ2UgPSB7XG5cdFx0XHRtYXg6LTEwMDAwMCxcblx0XHRcdG1pbjoxMDAwMDBcblx0XHR9O1xuXHRcdHZtLmdldERhdGEgPSBnZXREYXRhO1xuXHRcdHZtLnNldEN1cnJlbnQgPSBzZXRDdXJyZW50O1xuXHRcdHZtLmdldE9mZnNldCA9IGdldE9mZnNldDtcblx0XHR2bS5nZXRSYW5rID0gZ2V0UmFuaztcblx0XHR2bS5nb0luZm9TdGF0ZSA9IGdvSW5mb1N0YXRlO1xuXHRcdGFjdGl2YXRlKCk7XG5cblx0XHRmdW5jdGlvbiBhY3RpdmF0ZSgpe1xuXHRcdFx0VmVjdG9ybGF5ZXJTZXJ2aWNlLnNldFN0eWxlKGNvdW50cmllc1N0eWxlKTtcblx0XHRcdFZlY3RvcmxheWVyU2VydmljZS5jb3VudHJ5Q2xpY2soY291bnRyeUNsaWNrKTtcblx0XHRcdCR0aW1lb3V0KGZ1bmN0aW9uKCl7XG5cdFx0XHRcdGlmKCRzdGF0ZS5wYXJhbXMueWVhcil7XG5cdFx0XHRcdFx0Zm9yKHZhciBpID0gMDsgaSA8IHZtLmluZGljYXRvci55ZWFycy5sZW5ndGg7IGkrKyl7XG5cdFx0XHRcdFx0XHRpZih2bS5pbmRpY2F0b3IueWVhcnNbaV0ueWVhciA9PSAkc3RhdGUucGFyYW1zLnllYXIpe1xuXHRcdFx0XHRcdFx0XHR2bS5hY3RpdmUgPSAgaTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSBpZighdm0uYWN0aXZlKXtcblx0XHRcdFx0XHR2bS5hY3RpdmUgPSAwO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gc2V0U3RhdGUoaXNvKSB7XG5cdFx0XHQkdGltZW91dChmdW5jdGlvbigpe1xuXHRcdFx0XHQvL2NvbnNvbGUubG9nKFZlY3RvcmxheWVyU2VydmljZS5nZXROYXRpb25CeUlzbyhpc28pKTtcblx0XHRcdFx0Ly92bS5jdXJyZW50ID0gVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldE5hdGlvbkJ5SXNvKGlzbyk7XG5cdFx0XHR9KVxuXHRcdH07XG5cdFx0ZnVuY3Rpb24gZ29JbmZvU3RhdGUoKXtcblx0XHRcdGlmKCRzdGF0ZS5jdXJyZW50Lm5hbWUgPT0gJ2FwcC5pbmRleC5pbmRpY2F0b3IueWVhcicpe1xuXHRcdFx0XHRcdCRzdGF0ZS5nbygnYXBwLmluZGV4LmluZGljYXRvci55ZWFyLmluZm8nLHt5ZWFyOnZtLnllYXJ9KTtcblx0XHRcdH1cblx0XHRcdGVsc2V7XG5cdFx0XHRcdCRzdGF0ZS5nbygnYXBwLmluZGV4LmluZGljYXRvci55ZWFyJyx7aWQ6dm0uaW5kaWNhdG9yLmlkLCBuYW1lOnZtLmluZGljYXRvci5uYW1lLCB5ZWFyOnZtLnllYXJ9KTtcblx0XHRcdH1cblx0XHR9XG5cdFx0ZnVuY3Rpb24gZ2V0UmFuayhjb3VudHJ5KSB7XG5cdFx0XHR2YXIgcmFuayA9IHZtLmRhdGEuaW5kZXhPZihjb3VudHJ5KSArIDE7XG5cdFx0XHRyZXR1cm4gcmFuaztcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBnZXRPZmZzZXQoKSB7XG5cdFx0XHRpZiAoIXZtLmN1cnJlbnQpIHtcblx0XHRcdFx0cmV0dXJuIDA7XG5cdFx0XHR9XG5cdFx0XHQvL2NvbnNvbGUubG9nKHZtLmdldFJhbmsodm0uY3VycmVudCkpO1xuXHRcdFx0cmV0dXJuICh2bS5nZXRSYW5rKHZtLmN1cnJlbnQpIC0gMikgKiAxNztcblx0XHR9O1xuXG5cdFx0ZnVuY3Rpb24gc2V0Q3VycmVudChuYXQpIHtcblx0XHRcdHZtLmN1cnJlbnQgPSBuYXQ7XG5cdFx0XHRzZXRTZWxlY3RlZEZlYXR1cmUoKTtcblx0XHR9O1xuXG5cdFx0ZnVuY3Rpb24gc2V0U2VsZWN0ZWRGZWF0dXJlKCkge1xuXG5cdFx0XHQvKlx0JHRpbWVvdXQoZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0VmVjdG9ybGF5ZXJTZXJ2aWNlLmdldExheWVyKCkubGF5ZXJzW1ZlY3RvcmxheWVyU2VydmljZS5nZXROYW1lKCkrJ19nZW9tJ10uZmVhdHVyZXNbdm0uY3VycmVudC5pc29dLnNlbGVjdGVkID0gdHJ1ZTtcblx0XHRcdFx0fSk7Ki9cblx0XHRcdFx0LyppZigkc3RhdGUuY3VycmVudC5uYW1lID09ICdhcHAuaW5kZXguaW5kaWNhdG9yLnllYXInKXtcblx0XHRcdFx0XHQkc3RhdGUuZ28oJ2FwcC5pbmRleC5pbmRpY2F0b3IueWVhci5jb3VudHJ5Jyx7IGlzbzp2bS5jdXJyZW50Lmlzb30pXG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSBpZigkc3RhdGUuY3VycmVudC5uYW1lID09ICdhcHAuaW5kZXguaW5kaWNhdG9yLnllYXIuaW5mbycpe1xuXHRcdFx0XHRcdCRzdGF0ZS5nbygnYXBwLmluZGV4LmluZGljYXRvci55ZWFyLmluZm8uY291bnRyeScseyBpc286dm0uY3VycmVudC5pc299KVxuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2V7XG5cdFx0XHRcdFx0JHN0YXRlLmdvKCRzdGF0ZS5jdXJyZW50Lm5hbWUseyBpc286dm0uY3VycmVudC5pc299KVxuXHRcdFx0XHR9Ki9cblxuXHRcdH07XG5cdFx0ZnVuY3Rpb24gY291bnRyeUNsaWNrKGV2dCx0KXtcblx0XHRcdHZhciBjID0gVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldE5hdGlvbkJ5SXNvKGV2dC5mZWF0dXJlLnByb3BlcnRpZXNbVmVjdG9ybGF5ZXJTZXJ2aWNlLmRhdGEuaXNvMl0pO1xuXHRcdFx0aWYgKHR5cGVvZiBjLnNjb3JlICE9IFwidW5kZWZpbmVkXCIpIHtcblx0XHRcdFx0dm0uY3VycmVudCA9IGM7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0b2FzdHIuZXJyb3IoJ05vIGluZm8gYWJvdXQgdGhpcyBsb2NhdGlvbiEnKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0ZnVuY3Rpb24gZ2V0RGF0YSh5ZWFyKSB7XG5cdFx0XHR2bS55ZWFyID0geWVhcjtcblx0XHRcdENvbnRlbnRTZXJ2aWNlLmdldEluZGljYXRvckRhdGEodm0uaW5kaWNhdG9yLmlkLCB5ZWFyKS50aGVuKGZ1bmN0aW9uKGRhdCkge1xuXHRcdFx0XHRpZigkc3RhdGUuY3VycmVudC5uYW1lID09ICdhcHAuaW5kZXguaW5kaWNhdG9yLnllYXIuaW5mbycpe1xuXHRcdFx0XHRcdCRzdGF0ZS5nbygnYXBwLmluZGV4LmluZGljYXRvci55ZWFyLmluZm8nLHt5ZWFyOnllYXJ9KTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIGlmKCRzdGF0ZS5jdXJyZW50Lm5hbWUgPT0gJ2FwcC5pbmRleC5pbmRpY2F0b3IueWVhcicpe1xuXHRcdFx0XHRcdCRzdGF0ZS5nbygnYXBwLmluZGV4LmluZGljYXRvci55ZWFyJyx7eWVhcjp5ZWFyfSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZXtcblx0XHRcdFx0XHQkc3RhdGUuZ28oJ2FwcC5pbmRleC5pbmRpY2F0b3IueWVhcicse3llYXI6eWVhcn0pO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHZtLmRhdGEgPSBkYXQ7XG5cdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5kYXRhLCBmdW5jdGlvbihpdGVtKXtcblx0XHRcdFx0XHRpdGVtLnJhbmsgPSB2bS5kYXRhLmluZGV4T2YoaXRlbSkgKzE7XG5cdFx0XHRcdFx0aWYodm0uY3VycmVudCl7XG5cdFx0XHRcdFx0XHRpZihpdGVtLmlzbyA9PSB2bS5jdXJyZW50Lmlzbyl7XG5cdFx0XHRcdFx0XHRcdHNldEN1cnJlbnQoaXRlbSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0dm0ucmFuZ2UubWF4ID0gIGQzLm1heChbdm0ucmFuZ2UubWF4LCBwYXJzZUZsb2F0KGl0ZW0uc2NvcmUpXSk7XG5cdFx0XHRcdFx0dm0ucmFuZ2UubWluID0gIGQzLm1pbihbdm0ucmFuZ2UubWluLCBwYXJzZUZsb2F0KGl0ZW0uc2NvcmUpXSk7XG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFx0dm0uY2lyY2xlT3B0aW9ucyA9IHtcblx0XHRcdFx0XHRcdGNvbG9yOiB2bS5pbmRpY2F0b3Iuc3R5bGVkLmJhc2VfY29sb3IgfHwgJyMwMGNjYWEnLFxuXHRcdFx0XHRcdFx0ZmllbGQ6ICdyYW5rJyxcblx0XHRcdFx0XHRcdHNpemU6IHZtLmRhdGEubGVuZ3RoXG5cdFx0XHRcdFx0fTtcblxuXHRcdFx0XHRnZXRPZmZzZXQoKTtcblx0XHRcdFx0dm0ubGluZWFyU2NhbGUgPSBkMy5zY2FsZS5saW5lYXIoKS5kb21haW4oW3ZtLnJhbmdlLm1pbix2bS5yYW5nZS5tYXhdKS5yYW5nZShbMCwyNTZdKTtcblx0XHRcdFx0VmVjdG9ybGF5ZXJTZXJ2aWNlLnNldERhdGEodm0uZGF0YSwgdm0uaW5kaWNhdG9yLnN0eWxlZC5iYXNlX2NvbG9yLCB0cnVlKTtcblx0XHRcdFx0Ly9WZWN0b3JsYXllclNlcnZpY2UucGFpbnRDb3VudHJpZXMoY291bnRyaWVzU3R5bGUsIGNvdW50cnlDbGljayk7XG5cdFx0XHR9KTtcblxuXG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gY291bnRyaWVzU3R5bGUoZmVhdHVyZSkge1xuXHRcdFx0dmFyIHN0eWxlID0ge307XG5cdFx0XHR2YXIgaXNvID0gZmVhdHVyZS5wcm9wZXJ0aWVzW1ZlY3RvcmxheWVyU2VydmljZS5kYXRhLmlzbzJdO1xuXHRcdFx0dmFyIG5hdGlvbiA9IFZlY3RvcmxheWVyU2VydmljZS5nZXROYXRpb25CeUlzbyhpc28pO1xuXG5cdFx0XHR2YXIgZmllbGQgPSAnc2NvcmUnO1xuXHRcdFx0dmFyIHR5cGUgPSBmZWF0dXJlLnR5cGU7XG5cdFx0XHRmZWF0dXJlLnNlbGVjdGVkID0gZmFsc2U7XG5cdFx0XHRpZih2bS5jdXJyZW50KXtcblx0XHRcdFx0aWYodm0uY3VycmVudC5pc28gPT0gaXNvKXtcblx0XHRcdFx0XHRcdGZlYXR1cmUuc2VsZWN0ZWQgPSB0cnVlO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblxuXG5cdFx0XHRzd2l0Y2ggKHR5cGUpIHtcblx0XHRcdFx0Y2FzZSAzOiAvLydQb2x5Z29uJ1xuXHRcdFx0XHRcdGlmICh0eXBlb2YgbmF0aW9uW2ZpZWxkXSAhPSBcInVuZGVmaW5lZFwiICYmIG5hdGlvbltmaWVsZF0gIT0gbnVsbCl7XG5cblx0XHRcdFx0XHRcdHZhciBjb2xvclBvcyA9ICBwYXJzZUludCh2bS5saW5lYXJTY2FsZShwYXJzZUZsb2F0KG5hdGlvbltmaWVsZF0pKSkgKiA0Oy8vIHBhcnNlSW50KDI1NiAvIHZtLnJhbmdlLm1heCAqIHBhcnNlSW50KG5hdGlvbltmaWVsZF0pKSAqIDQ7XG5cdFx0XHRcdFx0XHR2YXIgY29sb3IgPSAncmdiYSgnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLnBhbGV0dGVbY29sb3JQb3NdICsgJywgJyArIFZlY3RvcmxheWVyU2VydmljZS5wYWxldHRlW2NvbG9yUG9zICsgMV0gKyAnLCAnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLnBhbGV0dGVbY29sb3JQb3MgKyAyXSArICcsJyArIFZlY3RvcmxheWVyU2VydmljZS5wYWxldHRlW2NvbG9yUG9zICsgM10gKyAnKSc7XG5cdFx0XHRcdFx0XHRzdHlsZS5jb2xvciA9ICdyZ2JhKCcgKyBWZWN0b3JsYXllclNlcnZpY2UucGFsZXR0ZVtjb2xvclBvc10gKyAnLCAnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLnBhbGV0dGVbY29sb3JQb3MgKyAxXSArICcsICcgKyBWZWN0b3JsYXllclNlcnZpY2UucGFsZXR0ZVtjb2xvclBvcyArIDJdICsgJywwLjYpJzsgLy9jb2xvcjtcblx0XHRcdFx0XHRcdHN0eWxlLm91dGxpbmUgPSB7XG5cdFx0XHRcdFx0XHRcdGNvbG9yOiBjb2xvcixcblx0XHRcdFx0XHRcdFx0c2l6ZTogMVxuXHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdHN0eWxlLnNlbGVjdGVkID0ge1xuXHRcdFx0XHRcdFx0XHRjb2xvcjogJ3JnYmEoJyArIFZlY3RvcmxheWVyU2VydmljZS5wYWxldHRlW2NvbG9yUG9zXSArICcsICcgKyBWZWN0b3JsYXllclNlcnZpY2UucGFsZXR0ZVtjb2xvclBvcyArIDFdICsgJywgJyArIFZlY3RvcmxheWVyU2VydmljZS5wYWxldHRlW2NvbG9yUG9zICsgMl0gKyAnLDAuMyknLFxuXHRcdFx0XHRcdFx0XHRvdXRsaW5lOiB7XG5cdFx0XHRcdFx0XHRcdFx0Y29sb3I6ICdyZ2JhKDY2LDY2LDY2LDAuOSknLFxuXHRcdFx0XHRcdFx0XHRcdHNpemU6IDJcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fTtcblxuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRzdHlsZS5jb2xvciA9ICdyZ2JhKDI1NSwyNTUsMjU1LDApJztcblx0XHRcdFx0XHRcdHN0eWxlLm91dGxpbmUgPSB7XG5cdFx0XHRcdFx0XHRcdGNvbG9yOiAncmdiYSgyNTUsMjU1LDI1NSwwKScsXG5cdFx0XHRcdFx0XHRcdHNpemU6IDFcblx0XHRcdFx0XHRcdH07XG5cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHRcdHJldHVybiBzdHlsZTtcblx0XHR9O1xuXG5cdFx0JHNjb3BlLiRvbignJHN0YXRlQ2hhbmdlU3VjY2VzcycsXG5cdFx0XHRmdW5jdGlvbihldmVudCwgdG9TdGF0ZSwgdG9QYXJhbXMsIGZyb21TdGF0ZSwgZnJvbVBhcmFtcyl7XG5cdFx0XHRcdGlmKHRvU3RhdGUubmFtZSA9PSAnYXBwLmluZGV4LmluZGljYXRvci5kYXRhJyl7XG5cblx0XHRcdFx0fVxuXHRcdH0pXG5cblx0fSk7XG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0luZGljYXRvclllYXJUYWJsZUN0cmwnLCBmdW5jdGlvbiAoJGZpbHRlciwgZGF0YSkge1xuXHRcdC8vXG5cdFx0dmFyIHZtID0gdGhpcztcbiAgICB2bS5kYXRhID0gZGF0YTtcbiAgICB2bS5vbk9yZGVyQ2hhbmdlID0gb25PcmRlckNoYW5nZTtcblx0XHR2bS5vblBhZ2luYXRpb25DaGFuZ2UgPSBvblBhZ2luYXRpb25DaGFuZ2U7XG5cbiAgICBmdW5jdGlvbiBvbk9yZGVyQ2hhbmdlKG9yZGVyKSB7XG5cdFx0XHRyZXR1cm4gdm0uZGF0YSA9ICRmaWx0ZXIoJ29yZGVyQnknKSh2bS5kYXRhLCBbb3JkZXJdLCB0cnVlKVxuXHRcdH07XG5cblx0XHRmdW5jdGlvbiBvblBhZ2luYXRpb25DaGFuZ2UocGFnZSwgbGltaXQpIHtcblx0XHRcdC8vY29uc29sZS5sb2cocGFnZSwgbGltaXQpO1xuXHRcdFx0Ly9yZXR1cm4gJG51dHJpdGlvbi5kZXNzZXJ0cy5nZXQoJHNjb3BlLnF1ZXJ5LCBzdWNjZXNzKS4kcHJvbWlzZTtcblx0XHR9O1xuXG5cbiAgfSk7XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignTG9naW5DdHJsJywgZnVuY3Rpb24oJHJvb3RTY29wZSwgJHN0YXRlLCAkYXV0aCwgdG9hc3RyKXtcbiAgICAgICAgdmFyIHZtID0gdGhpcztcbiAgICAgICAgdm0ucHJldlN0YXRlID0gbnVsbDtcbiAgICAgICAgdm0uZG9Mb2dpbiA9IGRvTG9naW47XG4gICAgICAgIHZtLmNoZWNrTG9nZ2VkSW4gPSBjaGVja0xvZ2dlZEluO1xuICAgICAgXG4gICAgICAgIHZtLnVzZXIgPSB7XG4gICAgICAgICAgZW1haWw6JycsXG4gICAgICAgICAgcGFzc3dvcmQ6JydcbiAgICAgICAgfTtcblxuICAgICAgICBhY3RpdmF0ZSgpO1xuXG4gICAgICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCl7XG4gICAgICAgICAgdm0uY2hlY2tMb2dnZWRJbigpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gY2hlY2tMb2dnZWRJbigpe1xuXG4gICAgICAgICAgaWYoJGF1dGguaXNBdXRoZW50aWNhdGVkKCkpe1xuICAgICAgICAgICAgLy8kc3RhdGUuZ28oJ2FwcC5pbmRleC5zaG93Jywge2luZGV4OidlcGknfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGRvTG9naW4oKXtcbiAgICAgICAgICAkYXV0aC5sb2dpbih2bS51c2VyKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgICAgICAgIHRvYXN0ci5zdWNjZXNzKCdZb3UgaGF2ZSBzdWNjZXNzZnVsbHkgc2lnbmVkIGluJyk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygkcm9vdFNjb3BlLnByZXZpb3VzUGFnZSk7XG4gICAgICAgICAgICAkc3RhdGUuZ28oJHJvb3RTY29wZS5wcmV2aW91c1BhZ2Uuc3RhdGUubmFtZSB8fCAnYXBwLmhvbWUnLCAkcm9vdFNjb3BlLnByZXZpb3VzUGFnZS5wYXJhbXMpO1xuICAgICAgICAgIH0pLmNhdGNoKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgICAgICAgIHRvYXN0ci5lcnJvcignUGxlYXNlIGNoZWNrIHlvdXIgZW1haWwgYW5kIHBhc3N3b3JkJywgJ1NvbWV0aGluZyB3ZW50IHdyb25nJyk7XG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ01hcEN0cmwnLCBmdW5jdGlvbiAobGVhZmxldERhdGEsIFZlY3RvcmxheWVyU2VydmljZSkge1xuXHRcdC8vXG5cdFx0dmFyIHZtID0gdGhpcztcblx0XHR2YXIgYXBpS2V5ID0gVmVjdG9ybGF5ZXJTZXJ2aWNlLmtleXMubWFwYm94O1xuXG5cdFx0dm0uZGVmYXVsdHMgPSB7XG5cdFx0XHQvL3Njcm9sbFdoZWVsWm9vbTogZmFsc2UsXG5cdFx0XHRtaW5ab29tOjJcblx0XHR9O1xuXHRcdHZtLmNlbnRlciA9IHtcblx0XHRcdGxhdDogMCxcblx0XHRcdGxuZzogMCxcblx0XHRcdHpvb206IDNcblx0XHR9O1xuXHRcdHZtLmxheWVycyA9IHtcblx0XHRcdGJhc2VsYXllcnM6IHtcblx0XHRcdFx0eHl6OiB7XG5cdFx0XHRcdFx0bmFtZTogJ01hcEJveCBPdXRkb29ycyBNb2QnLFxuXHRcdFx0XHRcdHVybDogJ2h0dHBzOi8ve3N9LnRpbGVzLm1hcGJveC5jb20vdjQvdmFsZGVycmFtYS5kODYxMTRiNi97en0ve3h9L3t5fS5wbmc/YWNjZXNzX3Rva2VuPScgKyBhcGlLZXksXG5cdFx0XHRcdFx0dHlwZTogJ3h5eicsXG5cdFx0XHRcdFx0bGF5ZXJPcHRpb25zOntcblx0XHRcdFx0XHRcdFx0bm9XcmFwOiB0cnVlLFxuXHRcdFx0XHRcdFx0XHRjb250aW51b3VzV29ybGQ6IGZhbHNlXG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9O1xuXHRcdHZtLm1heGJvdW5kcyA9IHtcblx0XHRcdHNvdXRoV2VzdDoge1xuXHRcdFx0XHRsYXQ6IDkwLFxuXHRcdFx0XHRsbmc6IDE4MFxuXHRcdFx0fSxcblx0XHRcdG5vcnRoRWFzdDoge1xuXHRcdFx0XHRsYXQ6IC05MCxcblx0XHRcdFx0bG5nOiAtMTgwXG5cdFx0XHR9XG5cdFx0fTtcblx0XHRsZWFmbGV0RGF0YS5nZXRNYXAoJ21hcCcpLnRoZW4oZnVuY3Rpb24gKG1hcCkge1xuXHRcdFx0VmVjdG9ybGF5ZXJTZXJ2aWNlLnNldE1hcChtYXApO1xuXHRcdFx0dmFyIHVybCA9ICdodHRwOi8vdjIyMDE1MDUyODM1ODI1MzU4LnlvdXJ2c2VydmVyLm5ldDozMDAxL3NlcnZpY2VzL3Bvc3RnaXMvJyArIFZlY3RvcmxheWVyU2VydmljZS5nZXROYW1lKCkgKyAnL2dlb20vdmVjdG9yLXRpbGVzL3t6fS97eH0ve3l9LnBiZj9maWVsZHM9JyArIFZlY3RvcmxheWVyU2VydmljZS5maWVsZHMoKTsgLy9cblx0XHRcdHZhciBsYXllciA9IG5ldyBMLlRpbGVMYXllci5NVlRTb3VyY2Uoe1xuXHRcdFx0XHR1cmw6IHVybCxcblx0XHRcdFx0ZGVidWc6IGZhbHNlLFxuXHRcdFx0XHRjbGlja2FibGVMYXllcnM6IFtWZWN0b3JsYXllclNlcnZpY2UuZ2V0TmFtZSgpICsgJ19nZW9tJ10sXG5cdFx0XHRcdG11dGV4VG9nZ2xlOiB0cnVlLFxuXHRcdFx0XHRnZXRJREZvckxheWVyRmVhdHVyZTogZnVuY3Rpb24gKGZlYXR1cmUpIHtcblx0XHRcdFx0XHRyZXR1cm4gZmVhdHVyZS5wcm9wZXJ0aWVzLmlzb19hMjtcblx0XHRcdFx0fSxcblx0XHRcdFx0ZmlsdGVyOiBmdW5jdGlvbiAoZmVhdHVyZSwgY29udGV4dCkge1xuXG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdFx0bWFwLmFkZExheWVyKFZlY3RvcmxheWVyU2VydmljZS5zZXRMYXllcihsYXllcikpO1xuXHRcdFx0dmFyIGxhYmVsc0xheWVyID0gTC50aWxlTGF5ZXIoJ2h0dHBzOi8ve3N9LnRpbGVzLm1hcGJveC5jb20vdjQvbWFnbm9sby4wNjAyOWE5Yy97en0ve3h9L3t5fS5wbmc/YWNjZXNzX3Rva2VuPScgKyBhcGlLZXkse1xuXHRcdFx0XHRcdFx0bm9XcmFwOiB0cnVlLFxuXHRcdFx0XHRcdFx0Y29udGludW91c1dvcmxkOiBmYWxzZVxuXHRcdFx0fSk7XG5cdFx0XHRtYXAuYWRkTGF5ZXIobGFiZWxzTGF5ZXIpO1xuXHRcdFx0bGFiZWxzTGF5ZXIuYnJpbmdUb0Zyb250KCk7XG5cdFx0fSk7XG5cdH0pO1xufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ1NlbGVjdGVkQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgZ2V0Q291bnRyeSwgVmVjdG9ybGF5ZXJTZXJ2aWNlLCAkZmlsdGVyKXtcbiAgICAgICAgLy9cbiAgICAgICAgdmFyIHZtID0gdGhpcztcbiAgICAgICAgdm0uc3RydWN0dXJlID0gJHNjb3BlLiRwYXJlbnQudm0uc3RydWN0dXJlO1xuICAgICAgICB2bS5kaXNwbGF5ID0gJHNjb3BlLiRwYXJlbnQudm0uZGlzcGxheTtcbiAgICAgICAgdm0uZGF0YSA9ICRzY29wZS4kcGFyZW50LnZtLmRhdGE7XG4gICAgICAgIHZtLmN1cnJlbnQgPSBnZXRDb3VudHJ5O1xuICAgICAgICB2bS5tdnRTb3VyY2UgPSBWZWN0b3JsYXllclNlcnZpY2UuZ2V0TGF5ZXIoKTtcbiAgICAgICAgdm0uZ2V0UmFuayA9IGdldFJhbms7XG4gICAgICAgIHZtLmdldE9mZnNldCA9IGdldE9mZnNldDtcbiAgICAgICAgdm0uZ2V0VGVuZGVuY3kgPSBnZXRUZW5kZW5jeTtcblxuICAgICAgICBmdW5jdGlvbiBjYWxjUmFuaygpIHtcbiAgICAgICAgICB2YXIgcmFuayA9IDA7XG4gICAgICAgICAgYW5ndWxhci5mb3JFYWNoKHZtLmRhdGEsIGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgICAgICAgIGl0ZW1bdm0uc3RydWN0dXJlLnNjb3JlX2ZpZWxkX25hbWVdID0gcGFyc2VGbG9hdChpdGVtW3ZtLnN0cnVjdHVyZS5zY29yZV9maWVsZF9uYW1lXSk7XG4gICAgICAgICAgICBpdGVtWydzY29yZSddID0gcGFyc2VJbnQoaXRlbVsnc2NvcmUnXSk7XG4gICAgICAgICAgfSlcbiAgICAgICAgICB2YXIgZmlsdGVyID0gJGZpbHRlcignb3JkZXJCeScpKHZtLmRhdGEsIFt2bS5zdHJ1Y3R1cmUuc2NvcmVfZmllbGRfbmFtZSwgXCJzY29yZVwiXSwgdHJ1ZSk7XG4gICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBmaWx0ZXIubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChmaWx0ZXJbaV0uaXNvID09IHZtLmN1cnJlbnQuaXNvKSB7XG4gICAgICAgICAgICAgIHJhbmsgPSBpICsgMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgdm0uY3VycmVudFt2bS5zdHJ1Y3R1cmUuc2NvcmVfZmllbGRfbmFtZSsnX3JhbmsnXSA9IHJhbms7XG4gICAgICAgICAgdm0uY2lyY2xlT3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgY29sb3I6dm0uc3RydWN0dXJlLmNvbG9yLFxuICAgICAgICAgICAgICBmaWVsZDp2bS5zdHJ1Y3R1cmUuc2NvcmVfZmllbGRfbmFtZSsnX3JhbmsnXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGdldFJhbmsoY291bnRyeSl7XG4gICAgICAgICAgdmFyIGZpbHRlciA9ICRmaWx0ZXIoJ29yZGVyQnknKSh2bS5kYXRhLCBbdm0uc3RydWN0dXJlLnNjb3JlX2ZpZWxkX25hbWUsIFwic2NvcmVcIl0sIHRydWUpO1xuICAgICAgICAgIHZhciByYW5rID0gMDtcbiAgICAgICAgICBhbmd1bGFyLmZvckVhY2goZmlsdGVyLCBmdW5jdGlvbihpdGVtLCBrZXkpe1xuICAgICAgICAgICAgaWYoaXRlbS5jb3VudHJ5ID09IGNvdW50cnkuY291bnRyeSl7XG4gICAgICAgICAgICAgIHJhbmsgPSBrZXk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgcmV0dXJuIHJhbmsrMTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBnZXRPZmZzZXQoKSB7XG4gICAgXHRcdFx0aWYgKCF2bS5jdXJyZW50KSB7XG4gICAgXHRcdFx0XHRyZXR1cm4gMDtcbiAgICBcdFx0XHR9XG4gICAgXHRcdFx0cmV0dXJuICh2bS5nZXRSYW5rKHZtLmN1cnJlbnQpIC0gMikgKiAxNjtcbiAgICBcdFx0fTtcblxuICAgIFx0XHRmdW5jdGlvbiBnZXRUZW5kZW5jeSgpIHtcbiAgICBcdFx0XHRpZiAoIXZtLmN1cnJlbnQpIHtcbiAgICBcdFx0XHRcdHJldHVybiAnYXJyb3dfZHJvcF9kb3duJ1xuICAgIFx0XHRcdH1cbiAgICBcdFx0XHRyZXR1cm4gdm0uY3VycmVudC5wZXJjZW50X2NoYW5nZSA+IDAgPyAnYXJyb3dfZHJvcF91cCcgOiAnYXJyb3dfZHJvcF9kb3duJztcbiAgICBcdFx0fTtcblxuICAgICAgICAkc2NvcGUuJHdhdGNoKCd2bS5jdXJyZW50JywgZnVuY3Rpb24gKG4sIG8pIHtcbiAgICAgICAgICBpZiAobiA9PT0gbykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYoby5pc28pe1xuICAgICAgICAgICAgICB2bS5tdnRTb3VyY2UubGF5ZXJzLmNvdW50cmllc19iaWdfZ2VvbS5mZWF0dXJlc1tvLmlzb10uc2VsZWN0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhbGNSYW5rKCk7XG4gICAgICAgICAgICBmZXRjaE5hdGlvbkRhdGEobi5pc28pO1xuXG5cbiAgICAgICAgfSk7XG4gICAgICAgIC8qOyovXG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ1NpZGViYXJDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCAkc3RhdGUpe1xuXG5cblx0fSk7XG5cbn0pKCk7IiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignU2lnbnVwQ3RybCcsIGZ1bmN0aW9uKCl7XG4gICAgICAgIC8vXG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ1RvYXN0c0N0cmwnLCBmdW5jdGlvbigkc2NvcGUsIFRvYXN0U2VydmljZSl7XG5cblx0XHQkc2NvcGUudG9hc3RTdWNjZXNzID0gZnVuY3Rpb24oKXtcblx0XHRcdFRvYXN0U2VydmljZS5zaG93KCdVc2VyIGFkZGVkIHN1Y2Nlc3NmdWxseSEnKTtcblx0XHR9O1xuXG5cdFx0JHNjb3BlLnRvYXN0RXJyb3IgPSBmdW5jdGlvbigpe1xuXHRcdFx0VG9hc3RTZXJ2aWNlLmVycm9yKCdDb25uZWN0aW9uIGludGVycnVwdGVkIScpO1xuXHRcdH07XG5cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdVbnN1cHBvcnRlZEJyb3dzZXJDdHJsJywgZnVuY3Rpb24oKXtcbiAgICAgICAgLy9cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ1VzZXJDdHJsJywgZnVuY3Rpb24oKXtcbiAgICAgICAgLy9cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0FkZFByb3ZpZGVyQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgRGlhbG9nU2VydmljZSwgRGF0YVNlcnZpY2Upe1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuICAgICAgICB2bS5kYXRhcHJvdmlkZXIgPSB7fTtcbiAgICAgICAgdm0uZGF0YXByb3ZpZGVyLnRpdGxlID0gJHNjb3BlLiRwYXJlbnQudm0uc2VhcmNoVGV4dDtcblxuICAgICAgICB2bS5zYXZlID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICBEYXRhU2VydmljZS5wb3N0KCcvZGF0YXByb3ZpZGVycycsIHZtLmRhdGFwcm92aWRlcikudGhlbihmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgICAgICAgJHNjb3BlLiRwYXJlbnQudm0uZGF0YXByb3ZpZGVycy5wdXNoKGRhdGEpO1xuICAgICAgICAgICAgICAkc2NvcGUuJHBhcmVudC52bS5pdGVtLmRhdGFwcm92aWRlciA9IGRhdGE7XG4gICAgICAgICAgICAgIERpYWxvZ1NlcnZpY2UuaGlkZSgpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfTtcblxuICAgICAgICB2bS5oaWRlID0gZnVuY3Rpb24oKXtcbiAgICAgICAgXHREaWFsb2dTZXJ2aWNlLmhpZGUoKTtcbiAgICAgICAgfTtcblxuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignQWRkVW5pdEN0cmwnLCBmdW5jdGlvbigkc2NvcGUsIERhdGFTZXJ2aWNlLERpYWxvZ1NlcnZpY2Upe1xuXG4gICAgICB2YXIgdm0gPSB0aGlzO1xuICAgICAgdm0udW5pdCA9IHt9O1xuICAgICAgdm0udW5pdC50aXRsZSA9ICRzY29wZS4kcGFyZW50LnZtLnNlYXJjaFVuaXQ7XG5cbiAgICAgIHZtLnNhdmUgPSBmdW5jdGlvbigpe1xuICAgICAgICAgIC8vXG4gICAgICAgICAgRGF0YVNlcnZpY2UucG9zdCgnL21lYXN1cmVfdHlwZXMnLCB2bS51bml0KS50aGVuKGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAgICAgJHNjb3BlLiRwYXJlbnQudm0ubWVhc3VyZVR5cGVzLnB1c2goZGF0YSk7XG4gICAgICAgICAgICAkc2NvcGUuJHBhcmVudC52bS5pdGVtLnR5cGUgPSBkYXRhO1xuICAgICAgICAgICAgRGlhbG9nU2VydmljZS5oaWRlKCk7XG4gICAgICAgICAgfSk7XG5cbiAgICAgIH07XG5cbiAgICAgIHZtLmhpZGUgPSBmdW5jdGlvbigpe1xuICAgICAgICBEaWFsb2dTZXJ2aWNlLmhpZGUoKTtcbiAgICAgIH07XG5cblxuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignQWRkWWVhckN0cmwnLCBmdW5jdGlvbigkc2NvcGUsIERpYWxvZ1NlcnZpY2Upe1xuXG4gICAgICAgICRzY29wZS5zYXZlID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCRzY29wZS52bSk7XG4gICAgICAgICAgICAkc2NvcGUudm0uc2F2ZURhdGEoKTtcbiAgICAgICAgICAgIERpYWxvZ1NlcnZpY2UuaGlkZSgpO1xuICAgICAgICB9O1xuXG4gICAgICAgICRzY29wZS5oaWRlID0gZnVuY3Rpb24oKXtcbiAgICAgICAgXHREaWFsb2dTZXJ2aWNlLmhpZGUoKTtcbiAgICAgICAgfTtcblxuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignQWRkVXNlcnNDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBEaWFsb2dTZXJ2aWNlKXtcblxuICAgICAgICAkc2NvcGUuc2F2ZSA9IGZ1bmN0aW9uKCl7XG5cdCAgICAgICAgLy9kbyBzb21ldGhpbmcgdXNlZnVsXG4gICAgICAgICAgICBEaWFsb2dTZXJ2aWNlLmhpZGUoKTtcbiAgICAgICAgfTtcblxuICAgICAgICAkc2NvcGUuaGlkZSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIFx0RGlhbG9nU2VydmljZS5oaWRlKCk7XG4gICAgICAgIH07XG5cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdDb3B5cHJvdmlkZXJDdHJsJywgZnVuY3Rpb24gKCRzY29wZSwgSW5kZXhTZXJ2aWNlLCBEaWFsb2dTZXJ2aWNlKSB7XG5cdFx0JHNjb3BlLiRwYXJlbnQudm0uYXNrZWRUb1JlcGxpY2F0ZSA9IHRydWU7XG5cdFx0JHNjb3BlLiRwYXJlbnQudm0uZG9Qcm92aWRlcnMgPSB0cnVlO1xuXHRcdCRzY29wZS4kcGFyZW50LnZtLmRvU3R5bGUgPSB0cnVlO1xuXHRcdCRzY29wZS4kcGFyZW50LnZtLmRvQ2F0ZWdvcmllcyA9IHRydWU7XG5cdFx0JHNjb3BlLiRwYXJlbnQudm0uZG9NZWFzdXJlcyA9IHRydWU7XG5cdFx0JHNjb3BlLiRwYXJlbnQudm0uZG9QdWJsaWMgPSB0cnVlO1xuXHRcdCRzY29wZS5zYXZlID0gZnVuY3Rpb24gKCkge1xuXG5cdFx0XHRhbmd1bGFyLmZvckVhY2goJHNjb3BlLiRwYXJlbnQudm0uZGF0YVswXS5kYXRhLCBmdW5jdGlvbiAoZGF0YSwga2V5KSB7XG5cdFx0XHRcdGlmIChrZXkgIT0gXCJ5ZWFyXCIpIHtcblx0XHRcdFx0XHRpZiAodHlwZW9mIEluZGV4U2VydmljZS5nZXRJbmRpY2F0b3Ioa2V5KSA9PSBcInVuZGVmaW5lZFwiKSB7XG5cdFx0XHRcdFx0XHRJbmRleFNlcnZpY2Uuc2V0SW5kaWNhdG9yKGtleSwge1xuXHRcdFx0XHRcdFx0XHRjb2x1bW5fbmFtZToga2V5LFxuXHRcdFx0XHRcdFx0XHR0aXRsZToga2V5XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0dmFyIGl0ZW0gPSBJbmRleFNlcnZpY2UuZ2V0SW5kaWNhdG9yKGtleSk7XG5cdFx0XHRcdFx0aWYgKCRzY29wZS4kcGFyZW50LnZtLmRvUHJvdmlkZXJzKSB7XG5cdFx0XHRcdFx0XHRpdGVtLmRhdGFwcm92aWRlciA9ICRzY29wZS4kcGFyZW50LnZtLnByZVByb3ZpZGVyO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAoJHNjb3BlLiRwYXJlbnQudm0uZG9NZWFzdXJlcykge1xuXHRcdFx0XHRcdFx0aXRlbS50eXBlID0gJHNjb3BlLiRwYXJlbnQudm0ucHJlVHlwZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKCRzY29wZS4kcGFyZW50LnZtLmRvQ2F0ZWdvcmllcykge1xuXHRcdFx0XHRcdFx0aXRlbS5jYXRlZ29yaWVzID0gJHNjb3BlLiRwYXJlbnQudm0ucHJlQ2F0ZWdvcmllcztcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKCRzY29wZS4kcGFyZW50LnZtLmRvUHVibGljKSB7XG5cdFx0XHRcdFx0XHRpdGVtLmlzX3B1YmxpYyA9ICRzY29wZS4kcGFyZW50LnZtLnByZVB1YmxpYztcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKCRzY29wZS4kcGFyZW50LnZtLmRvU3R5bGUpIHtcblxuXHRcdFx0XHRcdFx0aWYgKHR5cGVvZiBpdGVtLnN0eWxlICE9IFwidW5kZWZpbmVkXCIpIHtcblx0XHRcdFx0XHRcdFx0aXRlbS5zdHlsZSA9ICRzY29wZS4kcGFyZW50LnZtLnByZVN0eWxlO1xuXHRcdFx0XHRcdFx0XHRpdGVtLnN0eWxlX2lkID0gJHNjb3BlLiRwYXJlbnQudm0ucHJlU3R5bGUuaWQ7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdFx0RGlhbG9nU2VydmljZS5oaWRlKCk7XG5cdFx0XHRJbmRleFNlcnZpY2Uuc2V0VG9Mb2NhbFN0b3JhZ2UoKTtcblxuXHRcdH07XG5cblx0XHQkc2NvcGUuaGlkZSA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdCRzY29wZS4kcGFyZW50LnZtLmRvUHJvdmlkZXJzID0gZmFsc2U7XG5cdFx0XHQkc2NvcGUuJHBhcmVudC52bS5kb0NhdGVnb3JpZXMgPSBmYWxzZTtcblx0XHRcdCRzY29wZS4kcGFyZW50LnZtLmRvTWVhc3VyZXMgPSBmYWxzZTtcblx0XHRcdERpYWxvZ1NlcnZpY2UuaGlkZSgpO1xuXHRcdH07XG5cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdFZGl0Y29sdW1uQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgRGlhbG9nU2VydmljZSl7XG4gICAgICAgICRzY29wZS5uYW1lID0gJHNjb3BlLiRwYXJlbnQudm0udG9FZGl0O1xuICAgICAgICBpZih0eXBlb2YgJHNjb3BlLiRwYXJlbnQudm0ubWV0YS50YWJsZVskc2NvcGUubmFtZV0gPT0gXCJ1bmRlZmluZWRcIil7XG4gICAgICAgICAgJHNjb3BlLiRwYXJlbnQudm0ubWV0YS50YWJsZVskc2NvcGUubmFtZV0gPSB7fTtcbiAgICAgICAgfVxuICAgICAgICBlbHNle1xuICAgICAgICAgIGlmKCRzY29wZS4kcGFyZW50LnZtLm1ldGEudGFibGVbJHNjb3BlLm5hbWVdLnRpdGxlKXtcbiAgICAgICAgICAgICRzY29wZS50aXRsZSA9ICRzY29wZS4kcGFyZW50LnZtLm1ldGEudGFibGVbJHNjb3BlLm5hbWVdLnRpdGxlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZigkc2NvcGUuJHBhcmVudC52bS5tZXRhLnRhYmxlWyRzY29wZS5uYW1lXS5kZXNjcmlwdGlvbil7XG4gICAgICAgICAgICAkc2NvcGUuZGVzY3JpcHRpb24gPSAkc2NvcGUuJHBhcmVudC52bS5tZXRhLnRhYmxlWyRzY29wZS5uYW1lXS5kZXNjcmlwdGlvbjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAkc2NvcGUuc2F2ZSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgJHNjb3BlLiRwYXJlbnQudm0ubWV0YS50YWJsZVskc2NvcGUubmFtZV0udGl0bGUgPSAkc2NvcGUudGl0bGU7XG4gICAgICAgICAgJHNjb3BlLiRwYXJlbnQudm0ubWV0YS50YWJsZVskc2NvcGUubmFtZV0uZGVzY3JpcHRpb24gPSAkc2NvcGUuZGVzY3JpcHRpb247XG4gICAgICAgICAgRGlhbG9nU2VydmljZS5oaWRlKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgJHNjb3BlLmhpZGUgPSBmdW5jdGlvbigpe1xuICAgICAgICBcdERpYWxvZ1NlcnZpY2UuaGlkZSgpO1xuICAgICAgICB9O1xuXG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdFZGl0cm93Q3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgRGlhbG9nU2VydmljZSl7XG4gICAgICAgICRzY29wZS5kYXRhID0gJHNjb3BlLiRwYXJlbnQudm0uc2VsZWN0ZWRbMF07XG4gICAgICAgICRzY29wZS5zYXZlID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICBEaWFsb2dTZXJ2aWNlLmhpZGUoKTtcbiAgICAgICAgfTtcblxuICAgICAgICAkc2NvcGUuaGlkZSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIFx0RGlhbG9nU2VydmljZS5oaWRlKCk7XG4gICAgICAgIH07XG5cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0V4dGVuZERhdGFDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCRzdGF0ZSwgRGlhbG9nU2VydmljZSl7XG5cbiAgICAgICAgJHNjb3BlLnNhdmUgPSBmdW5jdGlvbigpe1xuICAgICAgICAgICAgJHNjb3BlLnZtLmRvRXh0ZW5kID0gdHJ1ZTtcbiAgICAgICAgICAgICRzY29wZS52bS5tZXRhLmlzb19maWVsZCA9ICRzY29wZS52bS5hZGREYXRhVG8uaXNvX25hbWU7XG4gICAgICAgICAgICAkc2NvcGUudm0ubWV0YS5jb3VudHJ5X2ZpZWxkID0gJHNjb3BlLnZtLmFkZERhdGFUby5jb3VudHJ5X25hbWU7XG4gICAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC5pbmRleC5jaGVjaycpO1xuICAgICAgICAgIFx0RGlhbG9nU2VydmljZS5oaWRlKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgJHNjb3BlLmhpZGUgPSBmdW5jdGlvbigpe1xuICAgICAgICAgICRzdGF0ZS5nbygnYXBwLmluZGV4LmNoZWNrJyk7XG4gICAgICAgIFx0RGlhbG9nU2VydmljZS5oaWRlKCk7XG4gICAgICAgIH07XG5cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0xvb3NlZGF0YUN0cmwnLCBmdW5jdGlvbigkc2NvcGUsICRzdGF0ZSwgRGlhbG9nU2VydmljZSl7XG5cbiAgICAgICAgJHNjb3BlLnNhdmUgPSBmdW5jdGlvbigpe1xuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgICRzY29wZS52bS5kZWxldGVEYXRhKCk7XG4gICAgICAgICAgICAkc3RhdGUuZ28oJHNjb3BlLnRvU3RhdGUubmFtZSk7XG4gICAgICAgICAgICBEaWFsb2dTZXJ2aWNlLmhpZGUoKTtcbiAgICAgICAgfTtcblxuICAgICAgICAkc2NvcGUuaGlkZSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIFx0RGlhbG9nU2VydmljZS5oaWRlKCk7XG4gICAgICAgIH07XG5cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdTZWxlY3Rpc29mZXRjaGVyc0N0cmwnLCBmdW5jdGlvbiAoJHNjb3BlLCBJbmRleFNlcnZpY2UsIERpYWxvZ1NlcnZpY2UpIHtcblx0XHR2YXIgdm0gPSB0aGlzO1xuXHRcdHZhciBtZXRhID0gSW5kZXhTZXJ2aWNlLmdldE1ldGEoKTtcblx0XHR2bS5pc28gPSBtZXRhLmlzb19maWVsZDtcblx0XHR2bS5saXN0ID0gSW5kZXhTZXJ2aWNlLmdldFRvU2VsZWN0KCk7XG5cdFx0dm0uc2F2ZSA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdERpYWxvZ1NlcnZpY2UuaGlkZSgpO1xuXHRcdH07XG5cblx0XHR2bS5oaWRlID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0RGlhbG9nU2VydmljZS5oaWRlKCk7XG5cdFx0fTtcblx0XHQkc2NvcGUuJHdhdGNoKCd2bS5saXN0JywgZnVuY3Rpb24gKG4sIG8pIHtcblx0XHRcdGlmIChuID09PSBvKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHRcdGFuZ3VsYXIuZm9yRWFjaChuLCBmdW5jdGlvbiAoaXRlbSwga2V5KSB7XG5cdFx0XHRcdGlmIChpdGVtLmVudHJ5LmRhdGFbMF1bdm0uaXNvXSkge1xuXHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChpdGVtLmVudHJ5LmVycm9ycywgZnVuY3Rpb24gKGVycm9yLCBlKSB7XG5cdFx0XHRcdFx0XHRpZiAoZXJyb3IudHlwZSA9PSAyIHx8IGVycm9yLnR5cGUgPT0gMykge1xuXHRcdFx0XHRcdFx0XHRJbmRleFNlcnZpY2UucmVkdWNlSXNvRXJyb3IoKTtcblx0XHRcdFx0XHRcdFx0aXRlbS5lbnRyeS5lcnJvcnMuc3BsaWNlKGUsIDEpO1xuXHRcdFx0XHRcdFx0fSBlbHNlIGlmIChlcnJvci50eXBlID09IDEpIHtcblx0XHRcdFx0XHRcdFx0aWYgKGVycm9yLmNvbHVtbiA9PSB2bS5pc28pIHtcblx0XHRcdFx0XHRcdFx0XHRJbmRleFNlcnZpY2UucmVkdWNlRXJyb3IoKTtcblx0XHRcdFx0XHRcdFx0XHRpdGVtLmVudHJ5LmVycm9ycy5zcGxpY2UoZSwgMSk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR2bS5saXN0LnNwbGljZShrZXksIDEpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHRcdGlmICh2bS5saXN0Lmxlbmd0aCA9PSAwKSB7XG5cdFx0XHRcdERpYWxvZ1NlcnZpY2UuaGlkZSgpO1xuXHRcdFx0fVxuXHRcdH0sIHRydWUpO1xuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmRpcmVjdGl2ZXMnKS5kaXJlY3RpdmUoICdhdXRvRm9jdXMnLCBmdW5jdGlvbigkdGltZW91dCkge1xuXHRcdHJldHVybiB7XG4gICAgICAgIHJlc3RyaWN0OiAnQUMnLFxuICAgICAgICBsaW5rOiBmdW5jdGlvbihfc2NvcGUsIF9lbGVtZW50KSB7XG4gICAgICAgICAgICAkdGltZW91dChmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIF9lbGVtZW50WzBdLmZvY3VzKCk7XG4gICAgICAgICAgICB9LCAwKTtcbiAgICAgICAgfVxuICAgIH07XG5cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignQmFyc0N0cmwnLCBmdW5jdGlvbiAoKSB7XG5cdFx0Ly9cblx0XHR2YXIgdm0gPSB0aGlzO1xuXHRcdHZtLndpZHRoID0gd2lkdGg7XG5cblx0XHRmdW5jdGlvbiB3aWR0aChpdGVtKSB7XG5cdFx0XHRpZighdm0uZGF0YSkgcmV0dXJuO1xuXHRcdFx0cmV0dXJuIHZtLmRhdGFbaXRlbS5uYW1lXTtcblx0XHR9XG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZGlyZWN0aXZlcycpLmRpcmVjdGl2ZSggJ2JhcnMnLCBmdW5jdGlvbigpIHtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRyZXN0cmljdDogJ0VBJyxcblx0XHRcdHRlbXBsYXRlVXJsOiAndmlld3MvZGlyZWN0aXZlcy9iYXJzL2JhcnMuaHRtbCcsXG5cdFx0XHRjb250cm9sbGVyOiAnQmFyc0N0cmwnLFxuXHRcdFx0Y29udHJvbGxlckFzOiAndm0nLFxuXHRcdFx0c2NvcGU6e30sXG5cdFx0XHRiaW5kVG9Db250cm9sbGVyOiB7XG5cdFx0XHRcdGRhdGE6ICc9Jyxcblx0XHRcdFx0b3B0aW9uczogJz0nLFxuXHRcdFx0XHRzdHJ1Y3R1cmU6ICc9J1xuXHRcdFx0fSxcblx0XHRcdGxpbms6IGZ1bmN0aW9uKCBzY29wZSwgZWxlbWVudCwgYXR0cnMgKXtcblx0XHRcdFx0Ly9cblx0XHRcdH1cblx0XHR9O1xuXG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCAnYXBwLmNvbnRyb2xsZXJzJyApLmNvbnRyb2xsZXIoICdCdWJibGVzQ3RybCcsIGZ1bmN0aW9uKCl7XG5cdFx0Ly9cblxuICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGZ1bmN0aW9uIEN1c3RvbVRvb2x0aXAodG9vbHRpcElkLCB3aWR0aCkge1xuXHRcdHZhciB0b29sdGlwSWQgPSB0b29sdGlwSWQ7XG5cdFx0dmFyIGVsZW0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0b29sdGlwSWQpO1xuXHRcdGlmKGVsZW0gPT0gbnVsbCl7XG5cdFx0XHRhbmd1bGFyLmVsZW1lbnQoZG9jdW1lbnQpLmZpbmQoJ2JvZHknKS5hcHBlbmQoXCI8ZGl2IGNsYXNzPSd0b29sdGlwIG1kLXdoaXRlZnJhbWUtejMnIGlkPSdcIiArIHRvb2x0aXBJZCArIFwiJz48L2Rpdj5cIik7XG5cdFx0fVxuXHRcdGhpZGVUb29sdGlwKCk7XG5cdFx0ZnVuY3Rpb24gc2hvd1Rvb2x0aXAoY29udGVudCwgZGF0YSwgZXZlbnQsIGVsZW1lbnQpIHtcblx0XHRcdGFuZ3VsYXIuZWxlbWVudChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjJyArIHRvb2x0aXBJZCkpLmh0bWwoY29udGVudCk7XG5cdFx0XHRhbmd1bGFyLmVsZW1lbnQoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignIycgKyB0b29sdGlwSWQpKS5jc3MoJ2Rpc3BsYXknLCAnYmxvY2snKTtcblxuXHRcdFx0cmV0dXJuIHVwZGF0ZVBvc2l0aW9uKGV2ZW50LCBkYXRhLCBlbGVtZW50KTtcblx0XHR9XG5cdFx0ZnVuY3Rpb24gaGlkZVRvb2x0aXAoKSB7XG5cdFx0XHRhbmd1bGFyLmVsZW1lbnQoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignIycgKyB0b29sdGlwSWQpKS5jc3MoJ2Rpc3BsYXknLCAnbm9uZScpO1xuXHRcdH1cblx0XHRmdW5jdGlvbiB1cGRhdGVQb3NpdGlvbihldmVudCwgZCwgZWxlbWVudCkge1xuXHRcdFx0dmFyIHR0aWQgPSBcIiNcIiArIHRvb2x0aXBJZDtcblx0XHRcdHZhciB4T2Zmc2V0ID0gMjA7XG5cdFx0XHR2YXIgeU9mZnNldCA9IDEwO1xuXHRcdFx0dmFyIHN2ZyA9IGVsZW1lbnQuZmluZCgnc3ZnJylbMF07Ly9kb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjc3ZnX3ZpcycpO1xuXHRcdFx0dmFyIHdzY3JZID0gd2luZG93LnNjcm9sbFk7XG5cdFx0XHR2YXIgdHR3ID0gYW5ndWxhci5lbGVtZW50KGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodHRpZCkpLm9mZnNldFdpZHRoO1xuXHRcdFx0dmFyIHR0aCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodHRpZCkub2Zmc2V0SGVpZ2h0O1xuXHRcdFx0dmFyIHR0dG9wID0gc3ZnLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcCArIGQueSAtIHR0aCAvIDI7XG5cdFx0XHR2YXIgdHRsZWZ0ID0gc3ZnLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmxlZnQgKyBkLnggKyBkLnJhZGl1cyArIDEyO1xuXHRcdFx0cmV0dXJuIGFuZ3VsYXIuZWxlbWVudChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHR0aWQpKS5jc3MoJ3RvcCcsIHR0dG9wICsgJ3B4JykuY3NzKCdsZWZ0JywgdHRsZWZ0ICsgJ3B4Jyk7XG5cdFx0fVxuXHRcdHJldHVybiB7XG5cdFx0XHRzaG93VG9vbHRpcDogc2hvd1Rvb2x0aXAsXG5cdFx0XHRoaWRlVG9vbHRpcDogaGlkZVRvb2x0aXAsXG5cdFx0XHR1cGRhdGVQb3NpdGlvbjogdXBkYXRlUG9zaXRpb25cblx0XHR9XG5cdH1cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5kaXJlY3RpdmVzJykuZGlyZWN0aXZlKCdidWJibGVzJywgZnVuY3Rpb24gKCRjb21waWxlLCBJY29uc1NlcnZpY2UpIHtcblx0XHR2YXIgZGVmYXVsdHM7XG5cdFx0ZGVmYXVsdHMgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHR3aWR0aDogMzAwLFxuXHRcdFx0XHRoZWlnaHQ6IDMwMCxcblx0XHRcdFx0bGF5b3V0X2dyYXZpdHk6IDAsXG5cdFx0XHRcdHNpemVmYWN0b3I6Myxcblx0XHRcdFx0dmlzOiBudWxsLFxuXHRcdFx0XHRmb3JjZTogbnVsbCxcblx0XHRcdFx0ZGFtcGVyOiAwLjA4NSxcblx0XHRcdFx0Y2lyY2xlczogbnVsbCxcblx0XHRcdFx0Ym9yZGVyczogdHJ1ZSxcblx0XHRcdFx0bGFiZWxzOiB0cnVlLFxuXHRcdFx0XHRmaWxsX2NvbG9yOiBkMy5zY2FsZS5vcmRpbmFsKCkuZG9tYWluKFtcImVoXCIsIFwiZXZcIl0pLnJhbmdlKFtcIiNhMzEwMzFcIiwgXCIjYmVjY2FlXCJdKSxcblx0XHRcdFx0bWF4X2Ftb3VudDogJycsXG5cdFx0XHRcdHJhZGl1c19zY2FsZTogJycsXG5cdFx0XHRcdGR1cmF0aW9uOiAxMDAwLFxuXHRcdFx0XHR0b29sdGlwOiBDdXN0b21Ub29sdGlwKFwiYnViYmxlc190b29sdGlwXCIsIDI0MClcblx0XHRcdH07XG5cdFx0fTtcblx0XHRyZXR1cm4ge1xuXHRcdFx0cmVzdHJpY3Q6ICdFJyxcblx0XHRcdHNjb3BlOiB7XG5cdFx0XHRcdGNoYXJ0ZGF0YTogJz0nLFxuXHRcdFx0XHRkaXJlY3Rpb246ICc9Jyxcblx0XHRcdFx0Z3Jhdml0eTogJz0nLFxuXHRcdFx0XHRzaXplZmFjdG9yOiAnPScsXG5cdFx0XHRcdGluZGV4ZXI6ICc9Jyxcblx0XHRcdFx0Ym9yZGVyczogJ0AnXG5cdFx0XHR9LFxuXHRcdFx0cmVxdWlyZTogJ25nTW9kZWwnLFxuXHRcdFx0bGluazogZnVuY3Rpb24gKHNjb3BlLCBlbGVtLCBhdHRycywgbmdNb2RlbCkge1xuXHRcdFx0XHR2YXIgb3B0aW9ucyA9IGFuZ3VsYXIuZXh0ZW5kKGRlZmF1bHRzKCksIGF0dHJzKTtcblx0XHRcdFx0dmFyIG5vZGVzID0gW10sXG5cdFx0XHRcdFx0bGlua3MgPSBbXSxcblx0XHRcdFx0XHRsYWJlbHMgPSBbXSxcblx0XHRcdFx0XHRncm91cHMgPSBbXTtcblxuXHRcdFx0XHR2YXIgbWF4X2Ftb3VudCA9IGQzLm1heChzY29wZS5jaGFydGRhdGEsIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHBhcnNlRmxvYXQoZC52YWx1ZSk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHQvL29wdGlvbnMuaGVpZ2h0ID0gb3B0aW9ucy53aWR0aCAqIDEuMTtcblx0XHRcdFx0b3B0aW9ucy5yYWRpdXNfc2NhbGUgPSBkMy5zY2FsZS5wb3coKS5leHBvbmVudCgwLjUpLmRvbWFpbihbMCwgbWF4X2Ftb3VudF0pLnJhbmdlKFsyLCA4NV0pO1xuXHRcdFx0XHRvcHRpb25zLmNlbnRlciA9IHtcblx0XHRcdFx0XHR4OiBvcHRpb25zLndpZHRoIC8gMixcblx0XHRcdFx0XHR5OiBvcHRpb25zLmhlaWdodCAvIDJcblx0XHRcdFx0fTtcblx0XHRcdFx0b3B0aW9ucy5jYXRfY2VudGVycyA9IHt9O1xuXG5cdFx0XHRcdHZhciBjcmVhdGVfbm9kZXMgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0aWYoc2NvcGUuaW5kZXhlci5jaGlsZHJlbi5sZW5ndGggPT0gMiAmJiBzY29wZS5pbmRleGVyLmNoaWxkcmVuWzBdLmNoaWxkcmVuLmxlbmd0aCA+IDApe1xuXHRcdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKHNjb3BlLmluZGV4ZXIuY2hpbGRyZW4sIGZ1bmN0aW9uIChncm91cCwgaW5kZXgpIHtcblx0XHRcdFx0XHRcdFx0dmFyIG1Db2xvciA9IGdyb3VwLmNvbG9yO1xuXHRcdFx0XHRcdFx0XHRpZihncm91cC5zdHlsZV9pZCAhPSAwKXtcblx0XHRcdFx0XHRcdFx0XHRtQ29sb3IgPSBncm91cC5zdHlsZS5iYXNlX2NvbG9yO1xuXHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0dmFyIGQgPSB7XG5cdFx0XHRcdFx0XHRcdFx0dHlwZTogZ3JvdXAubmFtZSxcblx0XHRcdFx0XHRcdFx0XHRuYW1lOiBncm91cC50aXRsZSxcblx0XHRcdFx0XHRcdFx0XHRncm91cDogZ3JvdXAubmFtZSxcblx0XHRcdFx0XHRcdFx0XHRjb2xvcjogbUNvbG9yLFxuXHRcdFx0XHRcdFx0XHRcdGljb246IGdyb3VwLmljb24sXG5cdFx0XHRcdFx0XHRcdFx0dW5pY29kZTogSWNvbnNTZXJ2aWNlLmdldFVuaWNvZGUoZ3JvdXAuaWNvbiksXG5cdFx0XHRcdFx0XHRcdFx0ZGF0YTogZ3JvdXAsXG5cdFx0XHRcdFx0XHRcdFx0Y2hpbGRyZW46Z3JvdXAuY2hpbGRyZW5cblx0XHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdFx0bGFiZWxzLnB1c2goZCk7XG5cdFx0XHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChncm91cC5jaGlsZHJlbiwgZnVuY3Rpb24gKGl0ZW0pIHtcblx0XHRcdFx0XHRcdFx0XHRpZiAoc2NvcGUuY2hhcnRkYXRhW2l0ZW0ubmFtZV0pIHtcblx0XHRcdFx0XHRcdFx0XHRcdHZhciBjb2xvciA9IGl0ZW0uY29sb3I7XG5cdFx0XHRcdFx0XHRcdFx0XHRpZihpdGVtLnN0eWxlX2lkICE9IDApe1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRjb2xvciA9IGl0ZW0uc3R5bGUuYmFzZV9jb2xvcjtcblx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdGVsc2UgaWYoZ3JvdXAuc3R5bGVfaWQgIT0gMCl7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGNvbG9yID0gZ3JvdXAuc3R5bGUuYmFzZV9jb2xvcjtcblx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdHZhciBub2RlID0ge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR0eXBlOiBpdGVtLm5hbWUsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHJhZGl1czogc2NvcGUuY2hhcnRkYXRhW2l0ZW0ubmFtZV0gLyBzY29wZS5zaXplZmFjdG9yLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHR2YWx1ZTogc2NvcGUuY2hhcnRkYXRhW2l0ZW0ubmFtZV0sXG5cdFx0XHRcdFx0XHRcdFx0XHRcdG5hbWU6IGl0ZW0udGl0bGUsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGdyb3VwOiBncm91cC5uYW1lLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHR4OiBvcHRpb25zLmNlbnRlci54LFxuXHRcdFx0XHRcdFx0XHRcdFx0XHR5OiBvcHRpb25zLmNlbnRlci55LFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRjb2xvcjogY29sb3IsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGljb246IGl0ZW0uaWNvbixcblx0XHRcdFx0XHRcdFx0XHRcdFx0dW5pY29kZTogSWNvbnNTZXJ2aWNlLmdldFVuaWNvZGUoaXRlbS5pY29uKSxcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZGF0YTogaXRlbSxcblx0XHRcdFx0XHRcdFx0XHRcdFx0Y2hpbGRyZW46aXRlbVxuXHRcdFx0XHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdFx0XHRcdG5vZGVzLnB1c2gobm9kZSk7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0Y3JlYXRlX2dyb3VwcygpO1xuXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2V7XG5cblx0XHRcdFx0XHRcdHZhciBkID0ge1xuXHRcdFx0XHRcdFx0XHR0eXBlOiBzY29wZS5pbmRleGVyLm5hbWUsXG5cdFx0XHRcdFx0XHRcdG5hbWU6IHNjb3BlLmluZGV4ZXIudGl0bGUsXG5cdFx0XHRcdFx0XHRcdGdyb3VwOiBzY29wZS5pbmRleGVyLm5hbWUsXG5cdFx0XHRcdFx0XHRcdGNvbG9yOiBzY29wZS5pbmRleGVyLnN0eWxlLmJhc2VfY29sb3IgfHwgc2NvcGUuaW5kZXhlci5jb2xvcixcblx0XHRcdFx0XHRcdFx0aWNvbjogc2NvcGUuaW5kZXhlci5pY29uLFxuXHRcdFx0XHRcdFx0XHR1bmljb2RlOiBzY29wZS5pbmRleGVyLnVuaWNvZGUsXG5cdFx0XHRcdFx0XHRcdGRhdGE6IHNjb3BlLmluZGV4ZXIuZGF0YSxcblx0XHRcdFx0XHRcdFx0Y2hpbGRyZW46IHNjb3BlLmluZGV4ZXIuY2hpbGRyZW5cblx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0XHRsYWJlbHMucHVzaChkKTtcblx0XHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChzY29wZS5pbmRleGVyLmNoaWxkcmVuLCBmdW5jdGlvbiAoaXRlbSkge1xuXHRcdFx0XHRcdFx0XHRpZiAoc2NvcGUuY2hhcnRkYXRhW2l0ZW0ubmFtZV0pIHtcblxuXHRcdFx0XHRcdFx0XHRcdHZhciBub2RlID0ge1xuXHRcdFx0XHRcdFx0XHRcdFx0dHlwZTogaXRlbS5uYW1lLFxuXHRcdFx0XHRcdFx0XHRcdFx0cmFkaXVzOiBzY29wZS5jaGFydGRhdGFbaXRlbS5uYW1lXSAvIHNjb3BlLnNpemVmYWN0b3IsXG5cdFx0XHRcdFx0XHRcdFx0XHR2YWx1ZTogc2NvcGUuY2hhcnRkYXRhW2l0ZW0ubmFtZV0gLyBzY29wZS5zaXplZmFjdG9yLFxuXHRcdFx0XHRcdFx0XHRcdFx0bmFtZTogaXRlbS50aXRsZSxcblx0XHRcdFx0XHRcdFx0XHRcdGdyb3VwOiBzY29wZS5pbmRleGVyLm5hbWUsXG5cdFx0XHRcdFx0XHRcdFx0XHR4OiBvcHRpb25zLmNlbnRlci54LFxuXHRcdFx0XHRcdFx0XHRcdFx0eTogb3B0aW9ucy5jZW50ZXIueSxcblx0XHRcdFx0XHRcdFx0XHRcdGNvbG9yOiBpdGVtLmNvbG9yLFxuXHRcdFx0XHRcdFx0XHRcdFx0aWNvbjogaXRlbS5pY29uLFxuXHRcdFx0XHRcdFx0XHRcdFx0dW5pY29kZTogSWNvbnNTZXJ2aWNlLmdldFVuaWNvZGUoaXRlbS5pY29uKSxcblx0XHRcdFx0XHRcdFx0XHRcdGRhdGE6IGl0ZW0sXG5cdFx0XHRcdFx0XHRcdFx0XHRjaGlsZHJlbjppdGVtXG5cdFx0XHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdFx0XHRub2Rlcy5wdXNoKG5vZGUpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH07XG5cdFx0XHRcdHZhciBjbGVhcl9ub2RlcyA9IGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0bm9kZXMgPSBbXTtcblx0XHRcdFx0XHRsYWJlbHMgPSBbXTtcblx0XHRcdFx0fVxuXHRcdFx0XHR2YXIgY3JlYXRlX2dyb3VwcyA9IGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKG5vZGVzLCBmdW5jdGlvbihub2RlLCBrZXkpe1xuXHRcdFx0XHRcdFx0XHRvcHRpb25zLmNhdF9jZW50ZXJzW25vZGUuZ3JvdXBdID0ge1xuXHRcdFx0XHRcdFx0XHRcdHg6IG9wdGlvbnMud2lkdGggLyAyLFxuXHRcdFx0XHRcdFx0XHRcdHk6IG9wdGlvbnMuaGVpZ2h0IC8gMiArICgxIC0ga2V5KSxcblx0XHRcdFx0XHRcdFx0XHRkYW1wZXI6IDAuMDg1LFxuXHRcdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9O1xuXHRcdFx0XHR2YXIgY3JlYXRlX3ZpcyA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRhbmd1bGFyLmVsZW1lbnQoZWxlbSkuaHRtbCgnJyk7XG5cdFx0XHRcdFx0b3B0aW9ucy52aXMgPSBkMy5zZWxlY3QoZWxlbVswXSkuYXBwZW5kKFwic3ZnXCIpLmF0dHIoXCJ3aWR0aFwiLCBvcHRpb25zLndpZHRoKS5hdHRyKFwiaGVpZ2h0XCIsIG9wdGlvbnMuaGVpZ2h0KS5hdHRyKFwiaWRcIiwgXCJzdmdfdmlzXCIpO1xuXG5cdFx0XHRcdFx0aWYgKCFvcHRpb25zLmJvcmRlcnMpIHtcblx0XHRcdFx0XHRcdHZhciBwaSA9IE1hdGguUEk7XG5cdFx0XHRcdFx0XHRpZihsYWJlbHMubGVuZ3RoID09IDIpe1xuXHRcdFx0XHRcdFx0XHR2YXIgYXJjVG9wID0gZDMuc3ZnLmFyYygpXG5cdFx0XHRcdFx0XHRcdFx0LmlubmVyUmFkaXVzKDEwOSlcblx0XHRcdFx0XHRcdFx0XHQub3V0ZXJSYWRpdXMoMTEwKVxuXHRcdFx0XHRcdFx0XHRcdC5zdGFydEFuZ2xlKC05MCAqIChwaSAvIDE4MCkpIC8vY29udmVydGluZyBmcm9tIGRlZ3MgdG8gcmFkaWFuc1xuXHRcdFx0XHRcdFx0XHRcdC5lbmRBbmdsZSg5MCAqIChwaSAvIDE4MCkpOyAvL2p1c3QgcmFkaWFuc1xuXHRcdFx0XHRcdFx0XHR2YXIgYXJjQm90dG9tID0gZDMuc3ZnLmFyYygpXG5cdFx0XHRcdFx0XHRcdFx0LmlubmVyUmFkaXVzKDEzNClcblx0XHRcdFx0XHRcdFx0XHQub3V0ZXJSYWRpdXMoMTM1KVxuXHRcdFx0XHRcdFx0XHRcdC5zdGFydEFuZ2xlKDkwICogKHBpIC8gMTgwKSkgLy9jb252ZXJ0aW5nIGZyb20gZGVncyB0byByYWRpYW5zXG5cdFx0XHRcdFx0XHRcdFx0LmVuZEFuZ2xlKDI3MCAqIChwaSAvIDE4MCkpOyAvL2p1c3QgcmFkaWFuc1xuXG5cdFx0XHRcdFx0XHRcdG9wdGlvbnMuYXJjVG9wID0gb3B0aW9ucy52aXMuYXBwZW5kKFwicGF0aFwiKVxuXHRcdFx0XHRcdFx0XHRcdC5hdHRyKFwiZFwiLCBhcmNUb3ApXG5cdFx0XHRcdFx0XHRcdFx0LmF0dHIoXCJmaWxsXCIsIGZ1bmN0aW9uKGQpe1xuXHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIGxhYmVsc1swXS5jb2xvciB8fCBcIiNiZTVmMDBcIjtcblx0XHRcdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0XHRcdC5hdHRyKFwiaWRcIiwgXCJhcmNUb3BcIilcblx0XHRcdFx0XHRcdFx0XHQuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIisob3B0aW9ucy53aWR0aC8yKStcIixcIisob3B0aW9ucy5oZWlnaHQvMiAtIG9wdGlvbnMuaGVpZ2h0LzEyKStcIilcIik7XG5cdFx0XHRcdFx0XHRcdG9wdGlvbnMuYXJjQm90dG9tID0gb3B0aW9ucy52aXMuYXBwZW5kKFwicGF0aFwiKVxuXHRcdFx0XHRcdFx0XHRcdC5hdHRyKFwiZFwiLCBhcmNCb3R0b20pXG5cdFx0XHRcdFx0XHRcdFx0LmF0dHIoXCJpZFwiLCBcImFyY0JvdHRvbVwiKVxuXHRcdFx0XHRcdFx0XHRcdC5hdHRyKFwiZmlsbFwiLCBmdW5jdGlvbihkKXtcblx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiBsYWJlbHNbMV0uY29sb3IgfHwgXCIjMDA2YmI2XCI7XG5cdFx0XHRcdFx0XHRcdFx0fSApXG5cdFx0XHRcdFx0XHRcdFx0LmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIrKG9wdGlvbnMud2lkdGgvMikrXCIsXCIrKG9wdGlvbnMuaGVpZ2h0LzIpK1wiKVwiKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGVsc2V7XG5cdFx0XHRcdFx0XHRcdHZhciBhcmMgPSBkMy5zdmcuYXJjKClcblx0XHRcdFx0XHRcdFx0XHQuaW5uZXJSYWRpdXMob3B0aW9ucy53aWR0aC8zIC0gMSlcblx0XHRcdFx0XHRcdFx0XHQub3V0ZXJSYWRpdXMob3B0aW9ucy53aWR0aC8zKVxuXHRcdFx0XHRcdFx0XHRcdC5zdGFydEFuZ2xlKDAgKiAocGkgLyAxODApKSAvL2NvbnZlcnRpbmcgZnJvbSBkZWdzIHRvIHJhZGlhbnNcblx0XHRcdFx0XHRcdFx0XHQuZW5kQW5nbGUoMzYwICogKHBpIC8gMTgwKSk7IC8vanVzdCByYWRpYW5zXG5cblxuXHRcdFx0XHRcdFx0XHRvcHRpb25zLmFyYyA9IG9wdGlvbnMudmlzLmFwcGVuZChcInBhdGhcIilcblx0XHRcdFx0XHRcdFx0XHQuYXR0cihcImRcIiwgYXJjKVxuXHRcdFx0XHRcdFx0XHRcdC5hdHRyKFwiZmlsbFwiLCBsYWJlbHNbMF0uY29sb3IpXG5cdFx0XHRcdFx0XHRcdFx0LmF0dHIoXCJpZFwiLCBcImFyY1RvcFwiKVxuXHRcdFx0XHRcdFx0XHRcdC5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiKyhvcHRpb25zLndpZHRoLzIpK1wiLFwiKyhvcHRpb25zLmhlaWdodC8yKStcIilcIik7XG5cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdGlmKG9wdGlvbnMubGFiZWxzID09IHRydWUgJiYgbGFiZWxzLmxlbmd0aCA9PSAyKXtcblx0XHRcdFx0XHRcdHZhciB0ZXh0TGFiZWxzID0gb3B0aW9ucy52aXMuc2VsZWN0QWxsKCd0ZXh0LmxhYmVscycpLmRhdGEobGFiZWxzKS5lbnRlcigpLmFwcGVuZChcInRleHRcIilcblx0XHRcdFx0XHRcdFx0LmF0dHIoJ2NsYXNzJywgJ2xhYmVscycpXG5cdFx0XHRcdFx0XHRcdC5hdHRyKCdmaWxsJywgZnVuY3Rpb24oZCl7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIGQuY29sb3I7XG5cdFx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0XHQvKlx0LmF0dHIoJ3RyYW5zZm9ybScsIGZ1bmN0aW9uKGQpe1xuXHRcdFx0XHRcdFx0XHRcdHZhciBpbmRleCA9IGxhYmVscy5pbmRleE9mKGQpO1xuXHRcdFx0XHRcdFx0XHRcdGlmKGluZGV4ID4gMCl7XG5cdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gJ3JvdGF0ZSg5MCwgMTAwLCAxMDApJztcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH0pKi9cblx0XHRcdFx0XHRcdFx0LmF0dHIoJ3gnLCBcIjUwJVwiKVxuXHRcdFx0XHRcdFx0XHQuc3R5bGUoJ2ZvbnQtc2l6ZScsICcxLjJlbScpXG5cdFx0XHRcdFx0XHRcdC5zdHlsZSgnY3Vyc29yJywgJ3BvaW50ZXInKVxuXG5cdFx0XHRcdFx0XHRcdC5hdHRyKCd3aWR0aCcsIG9wdGlvbnMud2lkdGgpXG5cdFx0XHRcdFx0XHRcdC5hdHRyKCd0ZXh0LWFuY2hvcicsICdtaWRkbGUnKVxuXHRcdFx0XHRcdFx0XHQub24oJ2NsaWNrJywgZnVuY3Rpb24oZCl7XG5cdFx0XHRcdFx0XHRcdFx0bmdNb2RlbC4kc2V0Vmlld1ZhbHVlKGQuZGF0YSk7XG5cdFx0XHRcdFx0XHRcdFx0bmdNb2RlbC4kcmVuZGVyKCk7XG5cdFx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0XHRcdC5hdHRyKFwieVwiLCBmdW5jdGlvbihkKXtcblx0XHRcdFx0XHRcdFx0XHR2YXIgaW5kZXggPSBsYWJlbHMuaW5kZXhPZihkKTtcblx0XHRcdFx0XHRcdFx0XHRpZihpbmRleCA9PSAwKXtcblx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiAxNTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0ZWxzZXtcblx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiBvcHRpb25zLmhlaWdodCAtIDY7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0XHQudGV4dChmdW5jdGlvbihkKXtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gZC5uYW1lO1xuXHRcdFx0XHRcdFx0XHR9KVxuXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdG9wdGlvbnMuY29udGFpbmVycyA9IG9wdGlvbnMudmlzLnNlbGVjdEFsbCgnZy5ub2RlJykuZGF0YShub2RlcykuZW50ZXIoKS5hcHBlbmQoJ2cnKS5hdHRyKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKCcgKyAob3B0aW9ucy53aWR0aCAvIDIpICsgJywnICsgKG9wdGlvbnMuaGVpZ2h0IC8gMikgKyAnKScpLmF0dHIoJ2NsYXNzJywgJ25vZGUnKTtcblxuXHRcdFx0XHRcdC8qb3B0aW9ucy5jaXJjbGVzID0gb3B0aW9ucy5jb250YWluZXJzLnNlbGVjdEFsbChcImNpcmNsZVwiKS5kYXRhKG5vZGVzLCBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGQuaWQ7XG5cdFx0XHRcdFx0fSk7Ki9cblxuXHRcdFx0XHRcdG9wdGlvbnMuY2lyY2xlcyA9IG9wdGlvbnMuY29udGFpbmVycy5hcHBlbmQoXCJjaXJjbGVcIikuYXR0cihcInJcIiwgMCkuYXR0cihcImZpbGxcIiwgKGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZC5jb2xvciB8fCBvcHRpb25zLmZpbGxfY29sb3IoZC5ncm91cCk7XG5cdFx0XHRcdFx0fSkpLmF0dHIoXCJzdHJva2Utd2lkdGhcIiwgMCkuYXR0cihcInN0cm9rZVwiLCBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGQzLnJnYihvcHRpb25zLmZpbGxfY29sb3IoZC5ncm91cCkpLmRhcmtlcigpO1xuXHRcdFx0XHRcdH0pLmF0dHIoXCJpZFwiLCBmdW5jdGlvbiAoZCkge1xuXG5cdFx0XHRcdFx0XHRyZXR1cm4gXCJidWJibGVfXCIgKyBkLnR5cGU7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0b3B0aW9ucy5pY29ucyA9IG9wdGlvbnMuY29udGFpbmVycy5hcHBlbmQoXCJ0ZXh0XCIpXG5cdFx0XHRcdFx0XHQuYXR0cignZm9udC1mYW1pbHknLCAnRVBJJylcblx0XHRcdFx0XHRcdC5hdHRyKCdmb250LXNpemUnLCBmdW5jdGlvbiAoZCkge1xuXG5cdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0LmF0dHIoXCJ0ZXh0LWFuY2hvclwiLCBcIm1pZGRsZVwiKVxuXHRcdFx0XHRcdFx0LmF0dHIoJ2ZpbGwnLCBmdW5jdGlvbihkKXtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGQudW5pY29kZSA/ICcjZmZmJyA6IGQuY29sb3I7XG5cdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0LnN0eWxlKCdvcGFjaXR5JywgZnVuY3Rpb24oZCl7XG5cdFx0XHRcdFx0XHRcdGlmKGQudW5pY29kZSl7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIDE7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0ZWxzZXtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gMDtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRcdC50ZXh0KGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBkLnVuaWNvZGUgfHwgJzEnXG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRvcHRpb25zLmljb25zLm9uKFwibW91c2VvdmVyXCIsIGZ1bmN0aW9uIChkLCBpKSB7XG5cblx0XHRcdFx0XHRcdHJldHVybiBzaG93X2RldGFpbHMoZCwgaSwgdGhpcyk7XG5cdFx0XHRcdFx0fSkub24oXCJtb3VzZW91dFwiLCBmdW5jdGlvbiAoZCwgaSkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGhpZGVfZGV0YWlscyhkLCBpLCB0aGlzKTtcblx0XHRcdFx0XHR9KS5vbihcImNsaWNrXCIsIGZ1bmN0aW9uIChkLCBpKSB7XG5cblx0XHRcdFx0XHRcdG5nTW9kZWwuJHNldFZpZXdWYWx1ZShkLmRhdGEpO1xuXHRcdFx0XHRcdFx0bmdNb2RlbC4kcmVuZGVyKCk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0b3B0aW9ucy5jaXJjbGVzLnRyYW5zaXRpb24oKS5kdXJhdGlvbihvcHRpb25zLmR1cmF0aW9uKS5hdHRyKFwiclwiLCBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGQucmFkaXVzO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdG9wdGlvbnMuaWNvbnMudHJhbnNpdGlvbigpLmR1cmF0aW9uKG9wdGlvbnMuZHVyYXRpb24pLmF0dHIoXCJmb250LXNpemVcIiwgZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdHJldHVybiBkLnJhZGl1cyAqIDEuNzUgKyAncHgnO1xuXHRcdFx0XHRcdH0pLmF0dHIoJ3knLCBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGQucmFkaXVzICogLjc1ICsgJ3B4Jztcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fTtcblx0XHRcdFx0dmFyIHVwZGF0ZV92aXMgPSBmdW5jdGlvbiAoKSB7XG5cblx0XHRcdFx0XHRub2Rlcy5mb3JFYWNoKGZ1bmN0aW9uIChkLCBpKSB7XG5cdFx0XHRcdFx0XHRvcHRpb25zLmNpcmNsZXMudHJhbnNpdGlvbigpLmR1cmF0aW9uKG9wdGlvbnMuZHVyYXRpb24pLmRlbGF5KGkgKiBvcHRpb25zLmR1cmF0aW9uKVxuXHRcdFx0XHRcdFx0XHQuYXR0cihcInJcIiwgZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdFx0XHRkLnJhZGl1cyA9IGQudmFsdWUgPSBzY29wZS5jaGFydGRhdGFbZC50eXBlXSAvIHNjb3BlLnNpemVmYWN0b3I7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIHNjb3BlLmNoYXJ0ZGF0YVtkLnR5cGVdIC8gc2NvcGUuc2l6ZWZhY3Rvcjtcblx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRvcHRpb25zLmljb25zLnRyYW5zaXRpb24oKS5kdXJhdGlvbihvcHRpb25zLmR1cmF0aW9uKS5kZWxheShpICogb3B0aW9ucy5kdXJhdGlvbilcblx0XHRcdFx0XHRcdFx0LmF0dHIoXCJmb250LXNpemVcIiwgZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gKHNjb3BlLmNoYXJ0ZGF0YVtkLnR5cGVdIC8gc2NvcGUuc2l6ZWZhY3RvcikgKiAxLjc1ICsgJ3B4J1xuXHRcdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0XHQuYXR0cigneScsIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIChzY29wZS5jaGFydGRhdGFbZC50eXBlXSAvIHNjb3BlLnNpemVmYWN0b3IpICogLjc1ICsgJ3B4Jztcblx0XHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fTtcblx0XHRcdFx0dmFyIGNoYXJnZSA9IGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0cmV0dXJuIC1NYXRoLnBvdyhkLnJhZGl1cywgMi4wKSAvIDQ7XG5cdFx0XHRcdH07XG5cdFx0XHRcdHZhciBzdGFydCA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRyZXR1cm4gb3B0aW9ucy5mb3JjZSA9IGQzLmxheW91dC5mb3JjZSgpLm5vZGVzKG5vZGVzKS5zaXplKFtvcHRpb25zLndpZHRoLCBvcHRpb25zLmhlaWdodF0pLmxpbmtzKGxpbmtzKTtcblx0XHRcdFx0fTtcblx0XHRcdFx0dmFyIGRpc3BsYXlfZ3JvdXBfYWxsID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdG9wdGlvbnMuZm9yY2UuZ3Jhdml0eShvcHRpb25zLmxheW91dF9ncmF2aXR5KS5jaGFyZ2UoY2hhcmdlKS5mcmljdGlvbigwLjg1KS5vbihcInRpY2tcIiwgZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0XHRcdG9wdGlvbnMuY29udGFpbmVycy5lYWNoKG1vdmVfdG93YXJkc19jZW50ZXIoZS5hbHBoYSkpLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuICd0cmFuc2xhdGUoJyArIGQueCArICcsJyArIGQueSArICcpJztcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdG9wdGlvbnMuZm9yY2Uuc3RhcnQoKTtcblx0XHRcdFx0fTtcblx0XHRcdFx0dmFyIGRpc3BsYXlfYnlfY2F0ID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdG9wdGlvbnMuZm9yY2UuZ3Jhdml0eShvcHRpb25zLmxheW91dF9ncmF2aXR5KS5jaGFyZ2UoY2hhcmdlKS5mcmljdGlvbigwLjkpLm9uKFwidGlja1wiLCBmdW5jdGlvbiAoZSkge1xuXHRcdFx0XHRcdFx0b3B0aW9ucy5jb250YWluZXJzLmVhY2gobW92ZV90b3dhcmRzX2NhdChlLmFscGhhKSkuYXR0cihcInRyYW5zZm9ybVwiLCBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gJ3RyYW5zbGF0ZSgnICsgZC54ICsgJywnICsgZC55ICsgJyknO1xuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0b3B0aW9ucy5mb3JjZS5zdGFydCgpO1xuXHRcdFx0XHR9O1xuXHRcdFx0XHR2YXIgbW92ZV90b3dhcmRzX2NlbnRlciA9IGZ1bmN0aW9uIChhbHBoYSkge1xuXHRcdFx0XHRcdHJldHVybiAoZnVuY3Rpb24gKF90aGlzKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdFx0ZC54ID0gZC54ICsgKG9wdGlvbnMud2lkdGgvMiAtIGQueCkgKiAob3B0aW9ucy5kYW1wZXIgKyAwLjAyKSAqIGFscGhhICoxLjI1O1xuXHRcdFx0XHRcdFx0XHRkLnkgPSBkLnkgKyAob3B0aW9ucy5oZWlnaHQvMiAtIGQueSkgKiAob3B0aW9ucy5kYW1wZXIgKyAwLjAyKSAqIGFscGhhICogMS4yNTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KSh0aGlzKTtcblx0XHRcdFx0fTtcblx0XHRcdFx0dmFyIG1vdmVfdG93YXJkc190b3AgPSBmdW5jdGlvbiAoYWxwaGEpIHtcblx0XHRcdFx0XHRyZXR1cm4gKGZ1bmN0aW9uIChfdGhpcykge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRcdGQueCA9IGQueCArIChvcHRpb25zLmNlbnRlci54IC0gZC54KSAqIChvcHRpb25zLmRhbXBlciArIDAuMDIpICogYWxwaGEgKiAxLjE7XG5cdFx0XHRcdFx0XHRcdGQueSA9IGQueSArICgyMDAgLSBkLnkpICogKG9wdGlvbnMuZGFtcGVyICsgMC4wMikgKiBhbHBoYSAqIDEuMTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KSh0aGlzKTtcblx0XHRcdFx0fTtcblx0XHRcdFx0dmFyIG1vdmVfdG93YXJkc19jYXQgPSBmdW5jdGlvbiAoYWxwaGEpIHtcblx0XHRcdFx0XHRyZXR1cm4gKGZ1bmN0aW9uIChfdGhpcykge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGZ1bmN0aW9uIChkKSB7XG5cblx0XHRcdFx0XHRcdFx0dmFyIHRhcmdldDtcblx0XHRcdFx0XHRcdFx0dGFyZ2V0ID0gb3B0aW9ucy5jYXRfY2VudGVyc1tkLmdyb3VwXTtcblx0XHRcdFx0XHRcdFx0ZC54ID0gZC54ICsgKHRhcmdldC54IC0gZC54KSAqICh0YXJnZXQuZGFtcGVyICsgMC4wMikgKiBhbHBoYSAqIDE7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBkLnkgPSBkLnkgKyAodGFyZ2V0LnkgLSBkLnkpICogKHRhcmdldC5kYW1wZXIgKyAwLjAyKSAqIGFscGhhICogMTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KSh0aGlzKTtcblx0XHRcdFx0fTtcblx0XHRcdFx0dmFyIHNob3dfZGV0YWlscyA9IGZ1bmN0aW9uIChkYXRhLCBpLCBlbGVtZW50KSB7XG5cdFx0XHRcdFx0dmFyIGNvbnRlbnQ7XG5cdFx0XHRcdFx0dmFyXHRiYXJPcHRpb25zID0ge1xuXHRcdFx0XHRcdFx0dGl0bGVkOnRydWVcblx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdGNvbnRlbnQgPSAnPG1kLXByb2dyZXNzLWxpbmVhciBtZC1tb2RlPVwiZGV0ZXJtaW5hdGVcIiB2YWx1ZT1cIicrZGF0YS52YWx1ZSsnXCI+PC9tZC1wcm9ncmVzcy1saW5lYXI+J1xuXHRcdFx0XHRcdGNvbnRlbnQgKz0gXCI8c3BhbiBjbGFzcz1cXFwidGl0bGVcXFwiPlwiKyBkYXRhLm5hbWUgKyBcIjwvc3Bhbj48YnIvPlwiO1xuXHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChkYXRhLmRhdGEuY2hpbGRyZW4sIGZ1bmN0aW9uIChpbmZvKSB7XG5cdFx0XHRcdFx0XHRpZihzY29wZS5jaGFydGRhdGFbaW5mby5uYW1lXSA+IDAgKXtcblx0XHRcdFx0XHRcdFx0Y29udGVudCArPSAnPGRpdiBjbGFzcz1cInN1YlwiPic7XG5cdFx0XHRcdFx0XHRcdGNvbnRlbnQgKz0gJzxtZC1wcm9ncmVzcy1saW5lYXIgbWQtbW9kZT1cImRldGVybWluYXRlXCIgdmFsdWU9XCInK3Njb3BlLmNoYXJ0ZGF0YVtpbmZvLm5hbWVdKydcIj48L21kLXByb2dyZXNzLWxpbmVhcj4nXG5cdFx0XHRcdFx0XHRcdGNvbnRlbnQgKz0gXCI8c3BhbiBjbGFzcz1cXFwibmFtZVxcXCIgc3R5bGU9XFxcImNvbG9yOlwiICsgKGluZm8uY29sb3IgfHwgZGF0YS5jb2xvcikgKyBcIlxcXCI+IFwiK3Njb3BlLmNoYXJ0ZGF0YVtpbmZvLm5hbWVdKycgLSAnICsgKGluZm8udGl0bGUpICsgXCI8L3NwYW4+PGJyLz5cIjtcblx0XHRcdFx0XHRcdFx0Y29udGVudCArPSAnPC9kaXY+Jztcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdC8vY29udGVudCA9ICc8YmFycyBvcHRpb25zPVwiYmFyT3B0aW9uc1wiIHN0cnVjdHVyZT1cImRhdGEuZGF0YS5jaGlsZHJlblwiIGRhdGE9XCJkYXRhXCI+PC9iYXJzPic7XG5cblx0XHRcdFx0XHQkY29tcGlsZShvcHRpb25zLnRvb2x0aXAuc2hvd1Rvb2x0aXAoY29udGVudCwgZGF0YSwgZDMuZXZlbnQsIGVsZW0pLmNvbnRlbnRzKCkpKHNjb3BlKTtcblx0XHRcdFx0fTtcblxuXHRcdFx0XHR2YXIgaGlkZV9kZXRhaWxzID0gZnVuY3Rpb24gKGRhdGEsIGksIGVsZW1lbnQpIHtcblx0XHRcdFx0XHRyZXR1cm4gb3B0aW9ucy50b29sdGlwLmhpZGVUb29sdGlwKCk7XG5cdFx0XHRcdH07XG5cblx0XHRcdFx0c2NvcGUuJHdhdGNoKCdjaGFydGRhdGEnLCBmdW5jdGlvbiAoZGF0YSwgb2xkRGF0YSkge1xuXHRcdFx0XHRcdG9wdGlvbnMudG9vbHRpcC5oaWRlVG9vbHRpcCgpO1xuXG5cdFx0XHRcdFx0aWYgKG9wdGlvbnMuY2lyY2xlcyA9PSBudWxsKSB7XG5cdFx0XHRcdFx0XHRjcmVhdGVfbm9kZXMoKTtcblx0XHRcdFx0XHRcdGNyZWF0ZV92aXMoKTtcblx0XHRcdFx0XHRcdHN0YXJ0KCk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHVwZGF0ZV92aXMoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYobGFiZWxzLmxlbmd0aCA9PSAxIHx8IG9wdGlvbnMubGFiZWxzICE9IHRydWUpe1xuXHRcdFx0XHRcdFx0XHRkaXNwbGF5X2dyb3VwX2FsbCgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNle1xuXHRcdFx0XHRcdFx0XHRkaXNwbGF5X2J5X2NhdCgpO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHR9KTtcblx0XHRcdFx0c2NvcGUuJHdhdGNoKCdpbmRleGVyJywgZnVuY3Rpb24gKG4sIG8pIHtcblx0XHRcdFx0XHRpZihuID09PSBvKXtcblx0XHRcdFx0XHRcdHJldHVyblxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZih0eXBlb2YgblswXS5jaGlsZHJlbiAhPSBcInVuZGVmaW5lZFwiKXtcblx0XHRcdFx0XHRcdG9wdGlvbnMudG9vbHRpcC5oaWRlVG9vbHRpcCgpO1xuXHRcdFx0XHRcdFx0Y2xlYXJfbm9kZXMoKTtcblx0XHRcdFx0XHRcdGNyZWF0ZV9ub2RlcygpO1xuXHRcdFx0XHRcdFx0Y3JlYXRlX3ZpcygpO1xuXHRcdFx0XHRcdFx0c3RhcnQoKTtcblxuXHRcdFx0XHRcdFx0aWYobGFiZWxzLmxlbmd0aCA9PSAxIHx8IG9wdGlvbnMubGFiZWxzICE9IHRydWUpe1xuXHRcdFx0XHRcdFx0XHRcdGRpc3BsYXlfZ3JvdXBfYWxsKCk7XG5cdFx0XHRcdFx0XHRcdFx0Ly9jb25zb2xlLmxvZygnYWxsJyk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRlbHNle1xuXHRcdFx0XHRcdFx0XHRcdC8vZGlzcGxheV9ieV9jYXQoKTtcblx0XHRcdFx0XHRcdFx0XHRkaXNwbGF5X2dyb3VwX2FsbCgpO1xuXHRcdFx0XHRcdFx0XHRcdC8vY29uc29sZS5sb2coJ2FsbCcpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHRcdHNjb3BlLiR3YXRjaCgnZGlyZWN0aW9uJywgZnVuY3Rpb24gKG9sZEQsIG5ld0QpIHtcblx0XHRcdFx0XHRpZiAob2xkRCA9PT0gbmV3RCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAob2xkRCA9PSBcImFsbFwiKSB7XG5cdFx0XHRcdFx0XHRkaXNwbGF5X2dyb3VwX2FsbCgpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRkaXNwbGF5X2J5X2NhdCgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSlcblx0XHRcdH1cblx0XHR9O1xuXHR9KTtcbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignQ2F0ZWdvcmllc0N0cmwnLCBmdW5jdGlvbiAoJGZpbHRlciwgdG9hc3RyLCBEYXRhU2VydmljZSkge1xuXHRcdC8vXG5cdFx0dmFyIHZtID0gdGhpcztcblx0XHR2bS5jYXRPcHRpb25zID0ge1xuXHRcdFx0YWJvcnQ6IGZ1bmN0aW9uKCl7XG5cdFx0XHRcdHZtLmNyZWF0ZUNhdGVnb3J5ID0gZmFsc2U7XG5cdFx0XHR9LFxuXHRcdFx0cG9zdERvbmU6ZnVuY3Rpb24oY2F0ZWdvcnkpe1xuXHRcdFx0XHR2bS5jcmVhdGVDYXRlZ29yeSA9IGZhbHNlO1xuXHRcdFx0fVxuXHRcdH1cblxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmRpcmVjdGl2ZXMnKS5kaXJlY3RpdmUoICdjYXRlZ29yaWVzJywgZnVuY3Rpb24oKSB7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0cmVzdHJpY3Q6ICdFJyxcblx0XHRcdHRlbXBsYXRlVXJsOiAndmlld3MvZGlyZWN0aXZlcy9jYXRlZ29yaWVzL2NhdGVnb3JpZXMuaHRtbCcsXG5cdFx0XHRjb250cm9sbGVyOiAnQ2F0ZWdvcmllc0N0cmwnLFxuXHRcdFx0Y29udHJvbGxlckFzOiAndm0nLFxuXHRcdFx0c2NvcGU6e30sXG5cdFx0XHRiaW5kVG9Db250cm9sbGVyOiB7XG5cdFx0XHRcdGl0ZW06ICc9Jyxcblx0XHRcdFx0Y2F0ZWdvcmllczogJz0nLFxuXHRcdFx0XHRvcHRpb25zOic9Jyxcblx0XHRcdFx0c2F2ZTogJyYnXG5cdFx0XHR9LFxuXHRcdFx0cmVwbGFjZTp0cnVlLFxuXHRcdFx0bGluazogZnVuY3Rpb24oIHNjb3BlLCBlbGVtZW50LCBhdHRycyApe1xuXHRcdFx0XHQvL1xuXHRcdFx0fVxuXHRcdH07XG5cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoICdhcHAuY29udHJvbGxlcnMnICkuY29udHJvbGxlciggJ0NhdGVnb3J5Q3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgJGZpbHRlciwgdG9hc3RyLCBEYXRhU2VydmljZSwgQ29udGVudFNlcnZpY2Upe1xuXHRcdC8vXG5cdFx0dmFyIHZtID0gdGhpcztcblx0XHR2bS5zYXZlQ2F0ZWdvcnkgPSBzYXZlQ2F0ZWdvcnk7XG5cdFx0dm0ucXVlcnlTZWFyY2hDYXRlZ29yeSA9IHF1ZXJ5U2VhcmNoQ2F0ZWdvcnk7XG5cdFx0dm0uY2hlY2tCYXNlID0gY2hlY2tCYXNlO1xuXHRcdHZtLnN0eWxlcyA9IENvbnRlbnRTZXJ2aWNlLmdldFN0eWxlcygpO1xuXG5cdFx0ZnVuY3Rpb24gcXVlcnlTZWFyY2hDYXRlZ29yeShxdWVyeSkge1xuXHRcdFx0cmV0dXJuICRmaWx0ZXIoJ2ZpbmRieW5hbWUnKSgkZmlsdGVyKCdmbGF0dGVuJykodm0uY2F0ZWdvcmllcyksIHF1ZXJ5LCAndGl0bGUnKTtcblx0XHR9XG5cdFx0ZnVuY3Rpb24gY2hlY2tCYXNlKCl7XG5cdFx0XHRpZiAodm0uaXRlbS50aXRsZSAmJiB2bS5pdGVtLnRpdGxlLmxlbmd0aCA+PSAzKSB7XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblx0XHRmdW5jdGlvbiBzYXZlQ2F0ZWdvcnkodmFsaWQpIHtcblx0XHRcdGlmKHZhbGlkKXtcblx0XHRcdFx0aWYodm0uaXRlbS5pZCl7XG5cdFx0XHRcdFx0dm0uaXRlbS5zYXZlKCkudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuXHRcdFx0XHRcdFx0dG9hc3RyLnN1Y2Nlc3MoJ0NhdGVnb3J5IGhhcyBiZWVuIHVwZGF0ZWQnLCAnU3VjY2VzcycpO1xuXHRcdFx0XHRcdFx0JHNjb3BlLmNhdGVnb3J5Rm9ybS4kc2V0U3VibWl0dGVkKCk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZXtcblx0XHRcdFx0XHREYXRhU2VydmljZS5wb3N0KCdjYXRlZ29yaWVzJywgdm0uaXRlbSkudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuXHRcdFx0XHRcdFx0dm0uY2F0ZWdvcmllcy5wdXNoKGRhdGEpO1xuXHRcdFx0XHRcdFx0Ly92bS5pdGVtLmNhdGVnb3JpZXMucHVzaChkYXRhKTtcblx0XHRcdFx0XHRcdHRvYXN0ci5zdWNjZXNzKCdOZXcgQ2F0ZWdvcnkgaGFzIGJlZW4gc2F2ZWQnLCAnU3VjY2VzcycpO1xuXHRcdFx0XHRcdFx0dm0ub3B0aW9ucy5wb3N0RG9uZShkYXRhKTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXG5cdFx0XHR9XG5cdFx0fVxuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZGlyZWN0aXZlcycpLmRpcmVjdGl2ZSggJ2NhdGVnb3J5JywgZnVuY3Rpb24oKSB7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0cmVzdHJpY3Q6ICdFQScsXG5cdFx0XHR0ZW1wbGF0ZVVybDogJ3ZpZXdzL2RpcmVjdGl2ZXMvY2F0ZWdvcnkvY2F0ZWdvcnkuaHRtbCcsXG5cdFx0XHRjb250cm9sbGVyOiAnQ2F0ZWdvcnlDdHJsJyxcblx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJyxcblx0XHRcdHNjb3BlOnt9LFxuXHRcdFx0YmluZFRvQ29udHJvbGxlcjoge1xuXHRcdFx0XHRpdGVtOiAnPScsXG5cdFx0XHRcdGNhdGVnb3JpZXM6ICc9Jyxcblx0XHRcdFx0b3B0aW9uczonPScsXG5cdFx0XHRcdHNhdmU6ICcmJ1xuXHRcdFx0fSxcblx0XHRcdHJlcGxhY2U6dHJ1ZSxcblx0XHRcdGxpbms6IGZ1bmN0aW9uKCBzY29wZSwgZWxlbWVudCwgYXR0cnMgKXtcblx0XHRcdFx0Ly9cblx0XHRcdH1cblx0XHR9O1xuXG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCAnYXBwLmNvbnRyb2xsZXJzJyApLmNvbnRyb2xsZXIoICdDaXJjbGVncmFwaEN0cmwnLCBmdW5jdGlvbigpe1xuXHRcdC8vXG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmRpcmVjdGl2ZXMnKS5kaXJlY3RpdmUoJ2NpcmNsZWdyYXBoJywgZnVuY3Rpb24gKCR0aW1lb3V0KSB7XG5cdFx0dmFyIGRlZmF1bHRzID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0d2lkdGg6IDgwLFxuXHRcdFx0XHRoZWlnaHQ6IDgwLFxuXHRcdFx0XHRjb2xvcjogJyMwMGNjYWEnLFxuXHRcdFx0XHRzaXplOiAxNzgsXG5cdFx0XHRcdGZpZWxkOiAncmFuaydcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlc3RyaWN0OiAnRScsXG5cdFx0XHRjb250cm9sbGVyOiAnQ2lyY2xlZ3JhcGhDdHJsJyxcblx0XHRcdHNjb3BlOiB7XG5cdFx0XHRcdG9wdGlvbnM6ICc9Jyxcblx0XHRcdFx0aXRlbTogJz0nXG5cdFx0XHR9LFxuXHRcdFx0bGluazogZnVuY3Rpb24gKCRzY29wZSwgZWxlbWVudCwgJGF0dHJzKSB7XG5cdFx0XHRcdC8vRmV0Y2hpbmcgT3B0aW9uc1xuXG5cdFx0XHRcdCRzY29wZS5vcHRpb25zID0gYW5ndWxhci5leHRlbmQoZGVmYXVsdHMoKSwgJHNjb3BlLm9wdGlvbnMpO1xuXHRcdFx0XHR2YXIgIM+EID0gMiAqIE1hdGguUEk7XG5cdFx0XHRcdC8vQ3JlYXRpbmcgdGhlIFNjYWxlXG5cdFx0XHRcdHZhciByb3RhdGUgPSBkMy5zY2FsZS5saW5lYXIoKVxuXHRcdFx0XHRcdC5kb21haW4oWzEsICRzY29wZS5vcHRpb25zLnNpemVdKVxuXHRcdFx0XHRcdC5yYW5nZShbMSwgMF0pXG5cdFx0XHRcdFx0LmNsYW1wKHRydWUpO1xuXG5cdFx0XHRcdC8vQ3JlYXRpbmcgRWxlbWVudHNcblx0XHRcdFx0dmFyIHN2ZyA9IGQzLnNlbGVjdChlbGVtZW50WzBdKS5hcHBlbmQoJ3N2ZycpXG5cdFx0XHRcdFx0LmF0dHIoJ3dpZHRoJywgJHNjb3BlLm9wdGlvbnMud2lkdGgpXG5cdFx0XHRcdFx0LmF0dHIoJ2hlaWdodCcsICRzY29wZS5vcHRpb25zLmhlaWdodClcblx0XHRcdFx0XHQuYXBwZW5kKCdnJyk7XG5cblx0XHRcdFx0dmFyIGNvbnRhaW5lciA9IHN2Zy5hcHBlbmQoJ2cnKVxuXHRcdFx0XHRcdC5hdHRyKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKCcgKyAkc2NvcGUub3B0aW9ucy53aWR0aCAvIDIgKyAnLCcgKyAkc2NvcGUub3B0aW9ucy5oZWlnaHQgLyAyICsgJyknKTtcblxuXHRcdFx0XHR2YXIgY2lyY2xlQmFjayA9IGNvbnRhaW5lci5hcHBlbmQoJ2NpcmNsZScpXG5cdFx0XHRcdFx0LmF0dHIoJ3InLCAkc2NvcGUub3B0aW9ucy53aWR0aCAvIDIgLSAyKVxuXHRcdFx0XHRcdC5hdHRyKCdzdHJva2Utd2lkdGgnLCAyKVxuXHRcdFx0XHRcdC5hdHRyKCdzdHJva2UnLCAkc2NvcGUub3B0aW9ucy5jb2xvcilcblx0XHRcdFx0XHQuc3R5bGUoJ29wYWNpdHknLCAnMC42Jylcblx0XHRcdFx0XHQuYXR0cignZmlsbCcsICdub25lJyk7XG5cblx0XHRcdFx0dmFyIGFyYyA9IGQzLnN2Zy5hcmMoKVxuXHRcdFx0XHRcdC5zdGFydEFuZ2xlKDApXG5cdFx0XHRcdFx0LmlubmVyUmFkaXVzKGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gJHNjb3BlLm9wdGlvbnMud2lkdGggLyAyIC0gNDtcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC5vdXRlclJhZGl1cyhmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuICRzY29wZS5vcHRpb25zLndpZHRoIC8gMjtcblx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHR2YXIgY2lyY2xlR3JhcGggPSBjb250YWluZXIuYXBwZW5kKCdwYXRoJylcblx0XHRcdFx0XHQuZGF0dW0oe1xuXHRcdFx0XHRcdFx0ZW5kQW5nbGU6IDIgKiBNYXRoLlBJICogMFxuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0LnN0eWxlKFwiZmlsbFwiLCAkc2NvcGUub3B0aW9ucy5jb2xvcilcblx0XHRcdFx0XHQuYXR0cignZCcsIGFyYyk7XG5cdFx0XHRcdHZhciB0ZXh0ID0gY29udGFpbmVyLnNlbGVjdEFsbCgndGV4dCcpXG5cdFx0XHRcdFx0LmRhdGEoWzBdKVxuXHRcdFx0XHRcdC5lbnRlcigpXG5cdFx0XHRcdFx0LmFwcGVuZCgndGV4dCcpXG5cdFx0XHRcdFx0LnRleHQoZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdGlmKCEkc2NvcGUub3B0aW9ucy5oaWRlTnVtYmVyaW5nKVxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gJ07CsCcgKyBkO1xuXHRcdFx0XHRcdFx0cmV0dXJuIGQ7XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQuc3R5bGUoXCJmaWxsXCIsICRzY29wZS5vcHRpb25zLmNvbG9yKVxuXHRcdFx0XHRcdC5zdHlsZSgnZm9udC13ZWlnaHQnLCAnYm9sZCcpXG5cdFx0XHRcdFx0LnN0eWxlKCdmb250LXNpemUnLCBmdW5jdGlvbigpe1xuXHRcdFx0XHRcdFx0aWYoISRzY29wZS5vcHRpb25zLmhpZGVOdW1iZXJpbmcpXG5cdFx0XHRcdFx0XHRyZXR1cm4gJzFlbSc7XG5cdFx0XHRcdFx0XHRyZXR1cm4gJzEuNWVtJztcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC5hdHRyKCd0ZXh0LWFuY2hvcicsICdtaWRkbGUnKVxuXHRcdFx0XHRcdC5hdHRyKCd5JywgZnVuY3Rpb24oZCl7XG5cdFx0XHRcdFx0XHRpZighJHNjb3BlLm9wdGlvbnMuaGlkZU51bWJlcmluZylcblx0XHRcdFx0XHRcdFx0cmV0dXJuICcwLjM1ZW0nO1xuXHRcdFx0XHRcdFx0cmV0dXJuICcwLjM3ZW0nXG5cdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0Ly9UcmFuc2l0aW9uIGlmIHNlbGVjdGlvbiBoYXMgY2hhbmdlZFxuXHRcdFx0XHRmdW5jdGlvbiBhbmltYXRlSXQocmFkaXVzKSB7XG5cdFx0XHRcdFx0Y2lyY2xlR3JhcGgudHJhbnNpdGlvbigpXG5cdFx0XHRcdFx0XHRcdC5kdXJhdGlvbig3NTApXG5cdFx0XHRcdFx0XHRcdC5jYWxsKGFyY1R3ZWVuLCByb3RhdGUocmFkaXVzKSAqIDIgKiBNYXRoLlBJKTtcblxuXHRcdFx0XHRcdHRleHQudHJhbnNpdGlvbigpLmR1cmF0aW9uKDc1MCkudHdlZW4oJ3RleHQnLCBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0aWYoISRzY29wZS5vcHRpb25zLmhpZGVOdW1iZXJpbmcpe1xuXHRcdFx0XHRcdFx0XHR2YXIgZGF0YSA9IHRoaXMudGV4dENvbnRlbnQuc3BsaXQoJ07CsCcpO1xuXHRcdFx0XHRcdFx0XHR2YXIgaSA9IGQzLmludGVycG9sYXRlKHBhcnNlSW50KGRhdGFbMV0pLCByYWRpdXMpO1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gZnVuY3Rpb24gKHQpIHtcblx0XHRcdFx0XHRcdFx0XHR0aGlzLnRleHRDb250ZW50ID0gJ07CsCcgKyAoTWF0aC5yb3VuZChpKHQpICogMSkgLyAxKTtcblx0XHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGVsc2V7XG5cdFx0XHRcdFx0XHRcdHZhciBpID0gZDMuaW50ZXJwb2xhdGUocGFyc2VJbnQoZCksIHJhZGl1cyk7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBmdW5jdGlvbiAodCkge1xuXHRcdFx0XHRcdFx0XHRcdHRoaXMudGV4dENvbnRlbnQgPSAoTWF0aC5yb3VuZChpKHQpICogMSkgLyAxKTtcblx0XHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly9Ud2VlbiBhbmltYXRpb24gZm9yIHRoZSBBcmNcblx0XHRcdFx0ZnVuY3Rpb24gYXJjVHdlZW4odHJhbnNpdGlvbiwgbmV3QW5nbGUpIHtcblx0XHRcdFx0XHR0cmFuc2l0aW9uLmF0dHJUd2VlbihcImRcIiwgZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdHZhciBpbnRlcnBvbGF0ZSA9IGQzLmludGVycG9sYXRlKGQuZW5kQW5nbGUsIG5ld0FuZ2xlKTtcblx0XHRcdFx0XHRcdHJldHVybiBmdW5jdGlvbiAodCkge1xuXHRcdFx0XHRcdFx0XHRkLmVuZEFuZ2xlID0gaW50ZXJwb2xhdGUodCk7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBhcmMoZCk7XG5cdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Lyokc2NvcGUuJHdhdGNoKCdvcHRpb25zJywgZnVuY3Rpb24gKG4sIG8pIHtcblx0XHRcdFx0XHRpZiAobiA9PT0gbykge1xuXHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRjaXJjbGVCYWNrLnN0eWxlKCdzdHJva2UnLCBuLmNvbG9yKTtcblx0XHRcdFx0XHRjaXJjbGVHcmFwaC5zdHlsZSgnZmlsbCcsIG4uY29sb3IpO1xuXHRcdFx0XHRcdHRleHQuc3R5bGUoJ2ZpbGwnLCBuLmNvbG9yKTtcblx0XHRcdFx0XHQkdGltZW91dChmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRhbmltYXRlSXQoJHNjb3BlLml0ZW1bbi5maWVsZF0pXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH0pOyovXG5cblx0XHRcdFx0Ly9XYXRjaGluZyBpZiBzZWxlY3Rpb24gaGFzIGNoYW5nZWQgZnJvbSBhbm90aGVyIFVJIGVsZW1lbnRcblx0XHRcdFx0JHNjb3BlLiR3YXRjaCgnaXRlbScsXHRmdW5jdGlvbiAobiwgbykge1xuXHRcdFx0XHRcdFx0Ly9pZihuID09PSBvKSByZXR1cm47XG5cdFx0XHRcdFx0XHRpZiAoIW4pIHtcblx0XHRcdFx0XHRcdFx0blskc2NvcGUub3B0aW9ucy5maWVsZF0gPSAkc2NvcGUub3B0aW9ucy5zaXplO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0JHRpbWVvdXQoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0XHRcdGFuaW1hdGVJdChuWyRzY29wZS5vcHRpb25zLmZpZWxkXSk7XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0JHNjb3BlLiR3YXRjaCgnb3B0aW9ucycsIGZ1bmN0aW9uKG4sbyl7XG5cdFx0XHRcdFx0aWYobiA9PT0gbyB8fCAhbikgcmV0dXJuO1xuXHRcdFx0XHRcdCR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdFx0YW5pbWF0ZUl0KCRzY29wZS5pdGVtWyRzY29wZS5vcHRpb25zLmZpZWxkXSk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH0sdHJ1ZSk7XG5cdFx0XHR9XG5cdFx0fTtcblxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSggJ2FwcC5jb250cm9sbGVycycgKS5jb250cm9sbGVyKCAnQ29tcG9zaXRzQ3RybCcsIGZ1bmN0aW9uKCl7XG5cdFx0Ly9cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmRpcmVjdGl2ZXMnKS5kaXJlY3RpdmUoICdjb21wb3NpdHMnLCBmdW5jdGlvbigpIHtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRyZXN0cmljdDogJ0VBJyxcblx0XHRcdHRlbXBsYXRlVXJsOiAndmlld3MvZGlyZWN0aXZlcy9jb21wb3NpdHMvY29tcG9zaXRzLmh0bWwnLFxuXHRcdFx0Y29udHJvbGxlcjogJ0NvbXBvc2l0c0N0cmwnLFxuXHRcdFx0Y29udHJvbGxlckFzOiAndm0nLFxuXHRcdFx0c2NvcGU6e30sXG5cdFx0XHRiaW5kVG9Db250cm9sbGVyOiB7XG5cdFx0XHRcdGl0ZW1zOiAnPScsXG5cdFx0XHRcdGl0ZW06ICc9Jyxcblx0XHRcdFx0b3B0aW9uczonPSdcblx0XHRcdH0sXG5cdFx0XHRyZXBsYWNlOnRydWUsXG5cdFx0XHRsaW5rOiBmdW5jdGlvbiggc2NvcGUsIGVsZW1lbnQsIGF0dHJzICl7XG5cdFx0XHRcdC8vXG5cdFx0XHR9XG5cdFx0fTtcblxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSggJ2FwcC5jb250cm9sbGVycycgKS5jb250cm9sbGVyKCAnQ29udGVudGVkaXRhYmxlQ3RybCcsIGZ1bmN0aW9uKCl7XG5cdFx0Ly9cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZGlyZWN0aXZlcycpLmRpcmVjdGl2ZSgnY29udGVudGVkaXRhYmxlJywgZnVuY3Rpb24gKCkge1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlc3RyaWN0OiAnQScsXG5cdFx0XHRyZXF1aXJlOiAnP25nTW9kZWwnLFxuXHRcdFx0bGluazogZnVuY3Rpb24gKHNjb3BlLCBlbGVtZW50LCBhdHRycywgbmdNb2RlbCkge1xuXG5cdFx0XHRcdC8vaWYgKCFuZ01vZGVsKSByZXR1cm47XG5cdFx0XHRcdG5nTW9kZWwuJHJlbmRlciA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRlbGVtZW50Lmh0bWwobmdNb2RlbC4kdmlld1ZhbHVlIHx8ICcnKTtcblx0XHRcdFx0fTtcblxuXHRcdFx0XHQvLyBMaXN0ZW4gZm9yIGNoYW5nZSBldmVudHMgdG8gZW5hYmxlIGJpbmRpbmdcblx0XHRcdFx0ZWxlbWVudC5vbignYmx1ciBrZXl1cCBjaGFuZ2UnLCBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0c2NvcGUuJGFwcGx5KHJlYWRWaWV3VGV4dCk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRcblx0XHRcdFx0Ly8gTm8gbmVlZCB0byBpbml0aWFsaXplLCBBbmd1bGFySlMgd2lsbCBpbml0aWFsaXplIHRoZSB0ZXh0IGJhc2VkIG9uIG5nLW1vZGVsIGF0dHJpYnV0ZVxuXG5cdFx0XHRcdC8vIFdyaXRlIGRhdGEgdG8gdGhlIG1vZGVsXG5cdFx0XHRcdGZ1bmN0aW9uIHJlYWRWaWV3VGV4dCgpIHtcblx0XHRcdFx0XHR2YXIgaHRtbCA9IGVsZW1lbnQuaHRtbCgpO1xuXHRcdFx0XHRcdC8vIFdoZW4gd2UgY2xlYXIgdGhlIGNvbnRlbnQgZWRpdGFibGUgdGhlIGJyb3dzZXIgbGVhdmVzIGEgPGJyPiBiZWhpbmRcblx0XHRcdFx0XHQvLyBJZiBzdHJpcC1iciBhdHRyaWJ1dGUgaXMgcHJvdmlkZWQgdGhlbiB3ZSBzdHJpcCB0aGlzIG91dFxuXHRcdFx0XHRcdGlmIChhdHRycy5zdHJpcEJyICYmIGh0bWwgPT0gJzxicj4nKSB7XG5cdFx0XHRcdFx0XHRodG1sID0gJyc7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdG5nTW9kZWwuJHNldFZpZXdWYWx1ZShodG1sKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH07XG5cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmRpcmVjdGl2ZXMnKS5kaXJlY3RpdmUoJ2ZpbGVEcm9wem9uZScsIGZ1bmN0aW9uICh0b2FzdHIpIHtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRyZXN0cmljdDogJ0VBJyxcblx0XHRcdHNjb3BlOiB7XG4gICAgICAgIGZpbGU6ICc9JyxcbiAgICAgICAgZmlsZU5hbWU6ICc9J1xuICAgICAgfSxcblx0XHRcdGxpbms6IGZ1bmN0aW9uIChzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcblx0XHRcdFx0dmFyIGNoZWNrU2l6ZSwgaXNUeXBlVmFsaWQsIHByb2Nlc3NEcmFnT3Zlck9yRW50ZXIsIHZhbGlkTWltZVR5cGVzO1xuXHRcdFx0XHRwcm9jZXNzRHJhZ092ZXJPckVudGVyID0gZnVuY3Rpb24gKGV2ZW50KSB7XG5cdFx0XHRcdFx0aWYgKGV2ZW50ICE9IG51bGwpIHtcblx0XHRcdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGV2ZW50LmRhdGFUcmFuc2Zlci5lZmZlY3RBbGxvd2VkID0gJ2NvcHknO1xuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0fTtcblx0XHRcdFx0dmFsaWRNaW1lVHlwZXMgPSBhdHRycy5maWxlRHJvcHpvbmU7XG5cdFx0XHRcdGNoZWNrU2l6ZSA9IGZ1bmN0aW9uIChzaXplKSB7XG5cdFx0XHRcdFx0dmFyIF9yZWY7XG5cdFx0XHRcdFx0aWYgKCgoX3JlZiA9IGF0dHJzLm1heEZpbGVTaXplKSA9PT0gKHZvaWQgMCkgfHwgX3JlZiA9PT0gJycpIHx8IChzaXplIC8gMTAyNCkgLyAxMDI0IDwgYXR0cnMubWF4RmlsZVNpemUpIHtcblx0XHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRhbGVydChcIkZpbGUgbXVzdCBiZSBzbWFsbGVyIHRoYW4gXCIgKyBhdHRycy5tYXhGaWxlU2l6ZSArIFwiIE1CXCIpO1xuXHRcdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fTtcblx0XHRcdFx0aXNUeXBlVmFsaWQgPSBmdW5jdGlvbiAodHlwZSkge1xuXHRcdFx0XHRcdGlmICgodmFsaWRNaW1lVHlwZXMgPT09ICh2b2lkIDApIHx8IHZhbGlkTWltZVR5cGVzID09PSAnJykgfHwgdmFsaWRNaW1lVHlwZXMuaW5kZXhPZih0eXBlKSA+IC0xKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0dG9hc3RyLmVycm9yKFwiRmlsZSBtdXN0IGJlIG9uZSBvZiBmb2xsb3dpbmcgdHlwZXMgXCIgKyB2YWxpZE1pbWVUeXBlcywgJ0ludmFsaWQgZmlsZSB0eXBlIScpO1xuXG5cdFx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9O1xuXHRcdFx0XHRlbGVtZW50LmJpbmQoJ2RyYWdvdmVyJywgcHJvY2Vzc0RyYWdPdmVyT3JFbnRlcik7XG5cdFx0XHRcdGVsZW1lbnQuYmluZCgnZHJhZ2VudGVyJywgcHJvY2Vzc0RyYWdPdmVyT3JFbnRlcik7XG5cdFx0XHRcdHJldHVybiBlbGVtZW50LmJpbmQoJ2Ryb3AnLCBmdW5jdGlvbiAoZXZlbnQpIHtcblx0XHRcdFx0XHR2YXIgZmlsZSwgbmFtZSwgcmVhZGVyLCBzaXplLCB0eXBlO1xuXHRcdFx0XHRcdGlmIChldmVudCAhPSBudWxsKSB7XG5cdFx0XHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRyZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xuXHRcdFx0XHRcdHJlYWRlci5vbmxvYWQgPSBmdW5jdGlvbiAoZXZ0KSB7XG5cdFx0XHRcdFx0XHRpZiAoY2hlY2tTaXplKHNpemUpICYmIGlzVHlwZVZhbGlkKHR5cGUpKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBzY29wZS4kYXBwbHkoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0XHRcdHNjb3BlLmZpbGUgPSBldnQudGFyZ2V0LnJlc3VsdDtcblx0XHRcdFx0XHRcdFx0XHRpZiAoYW5ndWxhci5pc1N0cmluZyhzY29wZS5maWxlTmFtZSkpIHtcblx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiBzY29wZS5maWxlTmFtZSA9IG5hbWU7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdGZpbGUgPSBldmVudC5kYXRhVHJhbnNmZXIuZmlsZXNbMF07XG5cdFx0XHRcdFx0LypuYW1lID0gZmlsZS5uYW1lO1xuXHRcdFx0XHRcdHR5cGUgPSBmaWxlLnR5cGU7XG5cdFx0XHRcdFx0c2l6ZSA9IGZpbGUuc2l6ZTtcblx0XHRcdFx0XHRyZWFkZXIucmVhZEFzRGF0YVVSTChmaWxlKTsqL1xuXHRcdFx0XHRcdHNjb3BlLmZpbGUgPSBmaWxlO1xuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fTtcblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoICdhcHAuY29udHJvbGxlcnMnICkuY29udHJvbGxlciggJ0ZpbGVEcm9wem9uZUN0cmwnLCBmdW5jdGlvbigpe1xuXHRcdC8vXG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5kaXJlY3RpdmVzJykuZGlyZWN0aXZlKCAnaGlzdG9yeScsIGZ1bmN0aW9uKCkge1xuXHRcdHZhciBkZWZhdWx0cyA9IGZ1bmN0aW9uKCl7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRmaWVsZDogJ3Njb3JlJyxcblx0XHRcdFx0Y29sb3I6ICcnXG5cdFx0XHR9XG5cdFx0fTtcblx0XHRyZXR1cm4ge1xuXHRcdFx0cmVzdHJpY3Q6ICdFJyxcblx0XHRcdHRlbXBsYXRlVXJsOiAndmlld3MvZGlyZWN0aXZlcy9oaXN0b3J5L2hpc3RvcnkuaHRtbCcsXG5cdFx0XHRjb250cm9sbGVyOiAnSGlzdG9yeUN0cmwnLFxuXHRcdFx0c2NvcGU6e1xuXHRcdFx0XHRvcHRpb25zOic9Jyxcblx0XHRcdFx0Y2hhcnRkYXRhOiAnPSdcblx0XHRcdH0sXG5cdFx0XHRsaW5rOiBmdW5jdGlvbiggJHNjb3BlLCBlbGVtZW50LCAkYXR0cnMsIG5nTW9kZWwpe1xuXHRcdFx0XHRcdHZhciBvcHRpb25zID0gYW5ndWxhci5leHRlbmQoZGVmYXVsdHMoKSwgJHNjb3BlLm9wdGlvbnMpO1xuXHRcdFx0fVxuXHRcdH07XG5cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignSGlzdG9yeUN0cmwnLCBmdW5jdGlvbiAoJHNjb3BlKSB7XG5cdFx0JHNjb3BlLnNldERhdGEgPSBzZXREYXRhO1xuXHRcdGFjdGl2YXRlKCk7XG5cdFxuXHRcdGZ1bmN0aW9uIGFjdGl2YXRlKCl7XG5cdFx0XHQkc2NvcGUuc2V0RGF0YSgpO1xuXHRcdFx0JHNjb3BlLiR3YXRjaCgnb3B0aW9ucycsIGZ1bmN0aW9uKG4sbyl7XG5cdFx0XHRcdGlmKG4gPT09IDApe1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXHRcdFx0XHQkc2NvcGUuc2V0RGF0YSgpO1xuXHRcdFx0fSlcblx0XHR9XG5cdFx0ZnVuY3Rpb24gc2V0RGF0YSgpe1xuXHRcdFx0JHNjb3BlLmRpc3BsYXkgPSB7XG5cdFx0XHRcdHNlbGVjdGVkQ2F0OiAnJyxcblx0XHRcdFx0cmFuazogW3tcblx0XHRcdFx0XHRmaWVsZHM6IHtcblx0XHRcdFx0XHRcdHg6ICd5ZWFyJyxcblx0XHRcdFx0XHRcdHk6ICdyYW5rJ1xuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0dGl0bGU6ICdSYW5rJyxcblx0XHRcdFx0XHRjb2xvcjogJyM1MmI2OTUnXG5cdFx0XHRcdH1dLFxuXHRcdFx0XHRzY29yZTogW3tcblx0XHRcdFx0XHRmaWVsZHM6IHtcblx0XHRcdFx0XHRcdHg6ICd5ZWFyJyxcblx0XHRcdFx0XHRcdHk6ICRzY29wZS5vcHRpb25zLmZpZWxkXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHR0aXRsZTogJ1Njb3JlJyxcblx0XHRcdFx0XHRjb2xvcjogJHNjb3BlLm9wdGlvbnMuY29sb3Jcblx0XHRcdFx0fV1cblx0XHRcdH07XG5cdFx0fVxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmRpcmVjdGl2ZXMnKS5kaXJlY3RpdmUoICdpbmRpY2F0b3InLCBmdW5jdGlvbigpIHtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRyZXN0cmljdDogJ0VBJyxcblx0XHRcdHRlbXBsYXRlVXJsOiAndmlld3MvZGlyZWN0aXZlcy9pbmRpY2F0b3IvaW5kaWNhdG9yLmh0bWwnLFxuXHRcdFx0Y29udHJvbGxlcjogJ0luZGljYXRvckN0cmwnLFxuXHRcdFx0Y29udHJvbGxlckFzOiAndm0nLFxuXHRcdFx0c2NvcGU6e1xuXHRcdFx0XHRpdGVtOiAnPScsXG5cdFx0XHRcdG9wdGlvbnM6ICc9Jyxcblx0XHRcdFx0c2VsZWN0ZWQ6ICc9J1xuXHRcdFx0fSxcblx0XHRcdGJpbmRUb0NvbnRyb2xsZXI6IHRydWUsXG5cdFx0XHRyZXBsYWNlOnRydWUsXG5cdFx0XHQvL3JlcXVpcmU6ICdpdGVtJyxcblx0XHRcdGxpbms6IGZ1bmN0aW9uKCBzY29wZSwgZWxlbWVudCwgYXR0cnMsIGl0ZW1Nb2RlbCApe1xuXHRcdFx0XHQvL1xuXHRcdFx0XHQvKnNjb3BlLiR3YXRjaChcblx0XHRcdFx0XHRmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gaXRlbU1vZGVsLiRtb2RlbFZhbHVlO1xuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0ZnVuY3Rpb24gKG4sIG8pIHtcblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKG4pO1xuXHRcdFx0XHRcdH0pOyovXG5cdFx0XHR9XG5cdFx0fTtcblxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdJbmRpY2F0b3JDdHJsJywgZnVuY3Rpb24gKCRzY29wZSwgRGF0YVNlcnZpY2UsIENvbnRlbnRTZXJ2aWNlLCBEaWFsb2dTZXJ2aWNlLCAkZmlsdGVyLCB0b2FzdHIsIFZlY3RvcmxheWVyU2VydmljZSkge1xuXHRcdC8vXG5cdFx0dmFyIHZtID0gdGhpcztcblxuXHRcdHZtLm9yaWdpbmFsID0gYW5ndWxhci5jb3B5KHZtLml0ZW0pO1xuXG5cdFx0dm0uY2hlY2tCYXNlID0gY2hlY2tCYXNlO1xuXHRcdHZtLmNoZWNrRnVsbCA9IGNoZWNrRnVsbDtcblxuXHRcdHZtLmNhdGVnb3JpZXMgPSBbXTtcblx0XHR2bS5kYXRhcHJvdmlkZXJzID0gW107XG5cdFx0dm0uc2VsZWN0ZWRJdGVtID0gbnVsbDtcblx0XHR2bS5zZWFyY2hUZXh0ID0gbnVsbDtcblx0XHR2bS5zZWFyY2hVbml0ID0gbnVsbDtcblx0XHR2bS5xdWVyeVNlYXJjaCA9IHF1ZXJ5U2VhcmNoO1xuXHRcdHZtLnF1ZXJ5VW5pdCA9IHF1ZXJ5VW5pdDtcblxuXHRcdHZtLnNhdmUgPSBzYXZlO1xuXG5cdFx0dm0uY3JlYXRlUHJvdmlkZXIgPSBjcmVhdGVQcm92aWRlcjtcblx0XHR2bS5jcmVhdGVVbml0ID0gY3JlYXRlVW5pdDtcblxuXHRcdGFjdGl2YXRlKCk7XG5cblx0XHRmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcblx0XHRcdGxvYWRBbGwoKTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBxdWVyeVNlYXJjaChxdWVyeSkge1xuXHRcdFx0cmV0dXJuICRmaWx0ZXIoJ2ZpbmRieW5hbWUnKSh2bS5kYXRhcHJvdmlkZXJzLCBxdWVyeSwgJ3RpdGxlJyk7XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIHF1ZXJ5VW5pdChxdWVyeSkge1xuXHRcdFx0cmV0dXJuICRmaWx0ZXIoJ2ZpbmRieW5hbWUnKSh2bS5tZWFzdXJlVHlwZXMsIHF1ZXJ5LCAndGl0bGUnKTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBsb2FkQWxsKCkge1xuXHRcdFx0dm0uZGF0YXByb3ZpZGVycyA9IERhdGFTZXJ2aWNlLmdldEFsbCgnZGF0YXByb3ZpZGVycycpLiRvYmplY3Q7XG5cdFx0XHR2bS5jYXRlZ29yaWVzID0gQ29udGVudFNlcnZpY2UuZ2V0Q2F0ZWdvcmllcyh7dHJlZTp0cnVlfSk7XG5cdFx0XHR2bS5tZWFzdXJlVHlwZXMgPSBEYXRhU2VydmljZS5nZXRBbGwoJ21lYXN1cmVfdHlwZXMnKS4kb2JqZWN0O1xuXHRcdFx0dm0uc3R5bGVzID0gRGF0YVNlcnZpY2UuZ2V0QWxsKCdzdHlsZXMnKS4kb2JqZWN0O1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGNoZWNrQmFzZSgpe1xuXHRcdFx0aWYgKHZtLml0ZW0udGl0bGUgJiYgdm0uaXRlbS50eXBlICYmIHZtLml0ZW0uZGF0YXByb3ZpZGVyICYmIHZtLml0ZW0udGl0bGUubGVuZ3RoID49IDMpIHtcblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIGNoZWNrRnVsbCgpe1xuXHRcdFx0aWYodHlwZW9mIHZtLml0ZW0uY2F0ZWdvcmllcyA9PSBcInVuZGVmaW5lZFwiKSByZXR1cm4gZmFsc2U7XG5cdFx0XHRyZXR1cm4gY2hlY2tCYXNlKCkgJiYgdm0uaXRlbS5jYXRlZ29yaWVzLmxlbmd0aCA/IHRydWUgOiBmYWxzZTtcblx0XHR9XG5cdFx0ZnVuY3Rpb24gc2F2ZSgpe1xuXHRcdFx0dm0uaXRlbS5zYXZlKCkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG5cdFx0XHRcdGlmKHJlc3BvbnNlKXtcblx0XHRcdFx0XHR0b2FzdHIuc3VjY2VzcygnRGF0YSBzdWNjZXNzZnVsbHkgdXBkYXRlZCEnLCAnU3VjY2Vzc2Z1bGx5IHNhdmVkJyk7XG5cdFx0XHRcdFx0dm0uaXRlbS5pc0RpcnR5ID0gZmFsc2U7XG5cdFx0XHRcdFx0dm0ub3JpZ2luYWwgPSBhbmd1bGFyLmNvcHkodm0uaXRlbSk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdC8vVE9ETzogSVRTIEEgSEFDSyBUTyBHRVQgSVQgV09SSzogbmctY2xpY2sgdnMgbmctbW91c2Vkb3duXG5cdFx0ZnVuY3Rpb24gY3JlYXRlUHJvdmlkZXIodGV4dCl7XG5cdFx0XHREaWFsb2dTZXJ2aWNlLmZyb21UZW1wbGF0ZSgnYWRkUHJvdmlkZXInLCAkc2NvcGUpO1xuXHRcdH1cblx0XHRmdW5jdGlvbiBjcmVhdGVVbml0KHRleHQpe1xuXHRcdFx0RGlhbG9nU2VydmljZS5mcm9tVGVtcGxhdGUoJ2FkZFVuaXQnLCAkc2NvcGUpO1xuXHRcdH1cblxuXHRcdCRzY29wZS4kd2F0Y2goJ3ZtLml0ZW0nLCBmdW5jdGlvbihuLCBvKXtcblx0XHRcdGlmKG4gIT0gbykge1xuXHRcdCAgICB2bS5pdGVtLmlzRGlydHkgPSAhYW5ndWxhci5lcXVhbHModm0uaXRlbSwgdm0ub3JpZ2luYWwpO1xuXHRcdCAgfVxuXHRcdH0sdHJ1ZSk7XG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZGlyZWN0aXZlcycpLmRpcmVjdGl2ZSggJ2luZGljYXRvck1lbnUnLCBmdW5jdGlvbigpIHtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRyZXN0cmljdDogJ0VBJyxcblx0XHRcdHNjb3BlOiB7XG5cdFx0XHRcdGl0ZW06ICc9aXRlbSdcblx0XHRcdH0sXG5cdFx0XHRyZXBsYWNlOnRydWUsXG5cdFx0XHR0ZW1wbGF0ZVVybDogJ3ZpZXdzL2RpcmVjdGl2ZXMvaW5kaWNhdG9yTWVudS9pbmRpY2F0b3JNZW51Lmh0bWwnLFxuXHRcdFx0Y29udHJvbGxlcjogJ0luZGljYXRvck1lbnVDdHJsJyxcblx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJyxcblx0XHRcdGJpbmRUb0NvbnRyb2xsZXI6IHRydWUsXG5cdFx0XHRsaW5rOiBmdW5jdGlvbiggc2NvcGUsIGVsZW1lbnQsIGF0dHJzICl7XG5cdFx0XHRcdC8vXG5cdFx0XHRcdHZhciBjbCA9ICdhY3RpdmUnO1xuXHRcdFx0XHR2YXIgZWwgPSBlbGVtZW50WzBdO1xuXHRcdFx0XHR2YXIgcGFyZW50ID0gZWxlbWVudC5wYXJlbnQoKTtcblx0XHRcdFx0cGFyZW50Lm9uKCdtb3VzZWVudGVyJywgZnVuY3Rpb24oZSl7XG5cdFx0XHRcdFx0ZWxlbWVudC5hZGRDbGFzcyhjbCk7XG5cdFx0XHRcdH0pLm9uKCdtb3VzZWxlYXZlJywgZnVuY3Rpb24oZSl7XG5cdFx0XHRcdFx0ZWxlbWVudC5yZW1vdmVDbGFzcyhjbCk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRcblx0XHRcdH1cblx0XHR9O1xuXG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCAnYXBwLmNvbnRyb2xsZXJzJyApLmNvbnRyb2xsZXIoICdJbmRpY2F0b3JNZW51Q3RybCcsIGZ1bmN0aW9uKCl7XG5cdFx0Ly9cblx0XHR2YXIgdm0gPSB0aGlzO1xuXHRcdHZtLmNoZWNrQmFzZSA9IGNoZWNrQmFzZTtcblx0XHR2bS5sb2NrZWQgPSBsb2NrZWQ7XG5cdFx0dm0uY2hhbmdlT2ZmaWNpYWwgPSBjaGFuZ2VPZmZpY2lhbDtcblxuXHRcdGZ1bmN0aW9uIGxvY2tlZCgpe1xuXHRcdFx0cmV0dXJuIHZtLml0ZW0uaXNfb2ZmaWNpYWwgPyAnbG9ja19vcGVuJyA6ICdsb2NrJztcblx0XHR9XG5cdFx0ZnVuY3Rpb24gY2hhbmdlT2ZmaWNpYWwoKXtcblx0XHRcdHZtLml0ZW0uaXNfb2ZmaWNpYWwgPSAhdm0uaXRlbS5pc19vZmZpY2lhbDtcblx0XHRcdHZtLml0ZW0uc2F2ZSgpO1xuXHRcdH1cblx0XHRmdW5jdGlvbiBjaGVja0Jhc2UoaXRlbSl7XG5cdFx0XHRpZiAoaXRlbS50aXRsZSAmJiBpdGVtLm1lYXN1cmVfdHlwZV9pZCAmJiBpdGVtLmRhdGFwcm92aWRlciAmJiBpdGVtLnRpdGxlLmxlbmd0aCA+PSAzKSB7XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cbiAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5kaXJlY3RpdmVzJykuZGlyZWN0aXZlKCAnaW5kaXplcycsIGZ1bmN0aW9uKCkge1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlc3RyaWN0OiAnRUEnLFxuXHRcdFx0dGVtcGxhdGVVcmw6ICd2aWV3cy9kaXJlY3RpdmVzL2luZGl6ZXMvaW5kaXplcy5odG1sJyxcblx0XHRcdGNvbnRyb2xsZXI6ICdJbmRpemVzQ3RybCcsXG5cdFx0XHRjb250cm9sbGVyQXM6ICd2bScsXG5cdFx0XHRzY29wZTp7XG5cdFx0XHRcdGl0ZW06ICc9Jyxcblx0XHRcdFx0b3B0aW9uczogJz0nLFxuXHRcdFx0XHRzZWxlY3RlZDogJz0nXG5cdFx0XHR9LFxuXHRcdFx0YmluZFRvQ29udHJvbGxlcjogdHJ1ZSxcblx0XHRcdHJlcGxhY2U6dHJ1ZSxcblx0XHRcdGxpbms6IGZ1bmN0aW9uKCBzY29wZSwgZWxlbWVudCwgYXR0cnMgKXtcblx0XHRcdFx0Ly9cblx0XHRcdH1cblx0XHR9O1xuXG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCAnYXBwLmNvbnRyb2xsZXJzJyApLmNvbnRyb2xsZXIoICdJbmRpemVzQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgJHN0YXRlLCAkZmlsdGVyLCAkdGltZW91dCwgdG9hc3RyLCBEYXRhU2VydmljZSwgQ29udGVudFNlcnZpY2Upe1xuXHRcdC8vXG5cdFx0dmFyIHZtID0gdGhpcztcblx0XHR2bS5vcmlnaW5hbCA9IGFuZ3VsYXIuY29weSh2bS5pdGVtKTtcblx0XHR2bS5jaGVja0Jhc2UgPSBjaGVja0Jhc2U7XG5cdFx0dm0uY2hlY2tGdWxsID0gY2hlY2tGdWxsO1xuXHRcdHZtLnNhdmUgPSBzYXZlO1xuXG5cdFx0dm0uYmFzZU9wdGlvbnMgPSB7XG5cdFx0XHRkcmFnOnRydWUsXG5cdFx0XHRhbGxvd0Ryb3A6dHJ1ZSxcblx0XHRcdGFsbG93RHJhZzp0cnVlLFxuXHRcdFx0YWxsb3dNb3ZlOnRydWUsXG5cdFx0XHRhbGxvd1NhdmU6dHJ1ZSxcblx0XHRcdGFsbG93RGVsZXRlOnRydWUsXG5cdFx0XHRhbGxvd0FkZENvbnRhaW5lcjp0cnVlLFxuXHRcdFx0YWxsb3dBZGQ6dHJ1ZSxcblx0XHRcdGVkaXRhYmxlOnRydWUsXG5cdFx0XHRhc3NpZ21lbnRzOiB0cnVlLFxuXHRcdFx0c2F2ZUNsaWNrOiBzYXZlLFxuXHRcdFx0YWRkQ2xpY2s6IHZtLm9wdGlvbnMuaW5kaXplcy5hZGRDbGljayxcblx0XHRcdGFkZENvbnRhaW5lckNsaWNrOiB2bS5vcHRpb25zLmluZGl6ZXMuYWRkQ29udGFpbmVyQ2xpY2ssXG5cdFx0XHRkZWxldGVEcm9wOiByZW1vdmVJdGVtc1xuXHRcdH07XG5cdFx0YWN0aXZhdGUoKTtcblxuXG5cdFx0ZnVuY3Rpb24gYWN0aXZhdGUoKSB7XG5cdFx0XHRsb2FkQWxsKCk7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gbG9hZEFsbCgpIHtcblx0XHRcdHZtLmNhdGVnb3JpZXMgPSBDb250ZW50U2VydmljZS5nZXRDYXRlZ29yaWVzKHt0cmVlOnRydWV9KTtcblx0XHRcdHZtLnN0eWxlcyA9IERhdGFTZXJ2aWNlLmdldEFsbCgnc3R5bGVzJykuJG9iamVjdDtcblx0XHRcdHZtLnR5cGVzID0gRGF0YVNlcnZpY2UuZ2V0QWxsKCdpbmRleC90eXBlcycpLiRvYmplY3Q7XG5cblx0XHRcdGlmKHR5cGVvZiB2bS5pdGVtLmlkID09IFwidW5kZWZpbmVkXCIpe1xuXHRcdFx0XHR2bS5pdGVtLml0ZW1fdHlwZV9pZCA9IDE7XG5cdFx0XHRcdHZtLml0ZW0uY2hpbGRyZW4gPSBbXTtcblx0XHRcdH1cblx0XHR9XG5cdFx0ZnVuY3Rpb24gY2hlY2tCYXNlKCl7XG5cdFx0XHRpZiAodm0uaXRlbS50aXRsZSAmJiB2bS5pdGVtLml0ZW1fdHlwZV9pZCAmJiB2bS5pdGVtLnRpdGxlLmxlbmd0aCA+PSAzKSB7XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblx0XHRmdW5jdGlvbiBjaGVja0Z1bGwoKXtcblx0XHRcdGlmKHR5cGVvZiB2bS5pdGVtLmNhdGVnb3JpZXMgPT0gXCJ1bmRlZmluZWRcIikgcmV0dXJuIGZhbHNlO1xuXHRcdFx0cmV0dXJuIGNoZWNrQmFzZSgpICYmIHZtLml0ZW0uY2F0ZWdvcmllcy5sZW5ndGggPyB0cnVlIDogZmFsc2U7XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIHNhdmUoKXtcblx0XHRcdGlmKHZtLml0ZW0uaWQpe1xuXHRcdFx0XHR2bS5pdGVtLnNhdmUoKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcblx0XHRcdFx0XHRpZihyZXNwb25zZSl7XG5cdFx0XHRcdFx0XHR0b2FzdHIuc3VjY2VzcygnRGF0YSBzdWNjZXNzZnVsbHkgdXBkYXRlZCEnLCAnU3VjY2Vzc2Z1bGx5IHNhdmVkJyk7XG5cdFx0XHRcdFx0XHR2bS5pdGVtLmlzRGlydHkgPSBmYWxzZTtcblx0XHRcdFx0XHRcdHZtLm9yaWdpbmFsID0gYW5ndWxhci5jb3B5KHZtLml0ZW0pO1xuXHRcdFx0XHRcdFx0Ly8kc3RhdGUuZ28oJ2FwcC5pbmRleC5lZGl0b3IuaW5kaXplcy5kYXRhJyx7aWQ6dm0uaXRlbS5uYW1lfSlcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZXtcblx0XHRcdFx0RGF0YVNlcnZpY2UucG9zdCgnaW5kZXgnLCB2bS5pdGVtKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcblx0XHRcdFx0XHRpZihyZXNwb25zZSl7XG5cdFx0XHRcdFx0XHR0b2FzdHIuc3VjY2VzcygnRGF0YSBzdWNjZXNzZnVsbHkgc2F2ZWQhJywgJ1N1Y2Nlc3NmdWxseSBzYXZlZCcpO1xuXHRcdFx0XHRcdFx0dm0uaXRlbS5pc0RpcnR5ID0gZmFsc2U7XG5cdFx0XHRcdFx0XHR2bS5vcmlnaW5hbCA9IGFuZ3VsYXIuY29weSh2bS5pdGVtKTtcblx0XHRcdFx0XHRcdCRzdGF0ZS5nbygnYXBwLmluZGV4LmVkaXRvci5pbmRpemVzLmRhdGEnLHtpZDpyZXNwb25zZS5uYW1lfSlcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gcmVtb3ZlSXRlbXMoZXZlbnQsIGl0ZW0pe1xuXHRcdC8vXHRjb25zb2xlLmxvZyh2bS5pdGVtLCBpdGVtKTtcblxuXHRcdH1cblx0XHQkc2NvcGUuJHdhdGNoKCd2bS5pdGVtJywgZnVuY3Rpb24obiwgbyl7XG5cdFx0XHRpZihuICE9IG8pIHtcblx0XHRcdFx0dm0uaXRlbS5pc0RpcnR5ID0gIWFuZ3VsYXIuZXF1YWxzKHZtLml0ZW0sIHZtLm9yaWdpbmFsKTtcblx0XHRcdH1cblx0XHR9LHRydWUpO1xuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5kaXJlY3RpdmVzJykuZGlyZWN0aXZlKCdtZWRpYW4nLCBmdW5jdGlvbiAoJHRpbWVvdXQpIHtcblx0XHR2YXIgZGVmYXVsdHMgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRpZDogJ2dyYWRpZW50Jyxcblx0XHRcdFx0d2lkdGg6IDMwMCxcblx0XHRcdFx0aGVpZ2h0OiA0MCxcblx0XHRcdFx0aW5mbzogdHJ1ZSxcblx0XHRcdFx0ZmllbGQ6ICdzY29yZScsXG5cdFx0XHRcdGhhbmRsaW5nOiB0cnVlLFxuXHRcdFx0XHRtYXJnaW46IHtcblx0XHRcdFx0XHRsZWZ0OiAyMCxcblx0XHRcdFx0XHRyaWdodDogMjAsXG5cdFx0XHRcdFx0dG9wOiAxMCxcblx0XHRcdFx0XHRib3R0b206IDEwXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGNvbG9yczogWyB7XG5cdFx0XHRcdFx0cG9zaXRpb246IDAsXG5cdFx0XHRcdFx0Y29sb3I6ICdyZ2JhKDEwMiwxMDIsMTAyLDEpJyxcblx0XHRcdFx0XHRvcGFjaXR5OiAxXG5cdFx0XHRcdH0sIHtcblx0XHRcdFx0XHRwb3NpdGlvbjogNTMsXG5cdFx0XHRcdFx0Y29sb3I6ICdyZ2JhKDEyOCwgMjQzLCAxOTgsMSknLFxuXHRcdFx0XHRcdG9wYWNpdHk6IDFcblx0XHRcdFx0fSx7XG5cdFx0XHRcdFx0cG9zaXRpb246IDEwMCxcblx0XHRcdFx0XHRjb2xvcjogJ3JnYmEoMjU1LDI1NSwyNTUsMSknLFxuXHRcdFx0XHRcdG9wYWNpdHk6IDBcblx0XHRcdFx0fV1cblx0XHRcdH07XG5cdFx0fVxuXHRcdHJldHVybiB7XG5cdFx0XHRyZXN0cmljdDogJ0UnLFxuXHRcdFx0c2NvcGU6IHtcblx0XHRcdFx0ZGF0YTogJz0nLFxuXHRcdFx0XHRvcHRpb25zOiAnPSdcblx0XHRcdH0sXG5cdFx0XHRyZXF1aXJlOiAnbmdNb2RlbCcsXG5cdFx0XHRsaW5rOiBmdW5jdGlvbiAoJHNjb3BlLCBlbGVtZW50LCAkYXR0cnMsIG5nTW9kZWwpIHtcblxuXHRcdFx0XHR2YXIgb3B0aW9ucyA9IGFuZ3VsYXIuZXh0ZW5kKGRlZmF1bHRzKCksICRhdHRycyk7XG5cdFx0XHRcdHZhciBtYXggPSAwLCBtaW4gPSAwO1xuXHRcdFx0XHRvcHRpb25zID0gYW5ndWxhci5leHRlbmQob3B0aW9ucywgJHNjb3BlLm9wdGlvbnMpO1xuXG5cdFx0XHRcdG9wdGlvbnMudW5pcXVlID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG5cdFx0XHRcdGlmKG9wdGlvbnMuY29sb3Ipe1xuXHRcdFx0XHRcdG9wdGlvbnMuY29sb3JzWzFdLmNvbG9yID0gb3B0aW9ucy5jb2xvcjtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbGVtZW50LmNzcygnaGVpZ2h0Jywgb3B0aW9ucy5oZWlnaHQgKyAncHgnKS5jc3MoJ2JvcmRlci1yYWRpdXMnLCBvcHRpb25zLmhlaWdodCAvIDIgKyAncHgnKTtcblxuXG5cdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaCgkc2NvcGUuZGF0YSwgZnVuY3Rpb24gKG5hdCwga2V5KSB7XG5cdFx0XHRcdFx0bWF4ID0gZDMubWF4KFttYXgsIHBhcnNlSW50KG5hdFtvcHRpb25zLmZpZWxkXSldKTtcblx0XHRcdFx0XHRtaW4gPSBkMy5taW4oW21pbiwgcGFyc2VJbnQobmF0W29wdGlvbnMuZmllbGRdKV0pO1xuXHRcdFx0XHR9KTtcblxuXHRcdFx0XHR2YXIgeCA9IGQzLnNjYWxlLmxpbmVhcigpXG5cdFx0XHRcdFx0LmRvbWFpbihbbWluLCBtYXhdKVxuXHRcdFx0XHRcdC5yYW5nZShbb3B0aW9ucy5tYXJnaW4ubGVmdCwgb3B0aW9ucy53aWR0aCAtIG9wdGlvbnMubWFyZ2luLmxlZnRdKVxuXHRcdFx0XHRcdC5jbGFtcCh0cnVlKTtcblxuXHRcdFx0XHR2YXIgYnJ1c2ggPSBkMy5zdmcuYnJ1c2goKVxuXHRcdFx0XHRcdC54KHgpXG5cdFx0XHRcdFx0LmV4dGVudChbMCwgMF0pXG5cdFx0XHRcdFx0Lm9uKFwiYnJ1c2hcIiwgYnJ1c2gpXG5cdFx0XHRcdFx0Lm9uKFwiYnJ1c2hlbmRcIiwgYnJ1c2hlZCk7XG5cblx0XHRcdFx0dmFyIHN2ZyA9IGQzLnNlbGVjdChlbGVtZW50WzBdKS5hcHBlbmQoXCJzdmdcIilcblx0XHRcdFx0XHQuYXR0cihcIndpZHRoXCIsIG9wdGlvbnMud2lkdGgpXG5cdFx0XHRcdFx0LmF0dHIoXCJoZWlnaHRcIiwgb3B0aW9ucy5oZWlnaHQpXG5cdFx0XHRcdFx0LmFwcGVuZChcImdcIik7XG5cdFx0XHRcdC8vLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoMCxcIiArIG9wdGlvbnMubWFyZ2luLnRvcCAvIDIgKyBcIilcIik7XG5cdFx0XHRcdHZhciBncmFkaWVudCA9IHN2Zy5hcHBlbmQoJ3N2ZzpkZWZzJylcblx0XHRcdFx0XHQuYXBwZW5kKFwic3ZnOmxpbmVhckdyYWRpZW50XCIpXG5cdFx0XHRcdFx0LmF0dHIoJ2lkJywgb3B0aW9ucy5maWVsZCtvcHRpb25zLnVuaXF1ZSlcblx0XHRcdFx0XHQuYXR0cigneDEnLCAnMCUnKVxuXHRcdFx0XHRcdC5hdHRyKCd5MScsICcwJScpXG5cdFx0XHRcdFx0LmF0dHIoJ3gyJywgJzEwMCUnKVxuXHRcdFx0XHRcdC5hdHRyKCd5MicsICcwJScpXG5cdFx0XHRcdFx0LmF0dHIoJ3NwcmVhZE1ldGhvZCcsICdwYWQnKVxuXHRcdFx0XHRhbmd1bGFyLmZvckVhY2gob3B0aW9ucy5jb2xvcnMsIGZ1bmN0aW9uIChjb2xvcikge1xuXHRcdFx0XHRcdGdyYWRpZW50LmFwcGVuZCgnc3ZnOnN0b3AnKVxuXHRcdFx0XHRcdFx0LmF0dHIoJ29mZnNldCcsIGNvbG9yLnBvc2l0aW9uICsgJyUnKVxuXHRcdFx0XHRcdFx0LmF0dHIoJ3N0b3AtY29sb3InLCBjb2xvci5jb2xvcilcblx0XHRcdFx0XHRcdC5hdHRyKCdzdG9wLW9wYWNpdHknLCBjb2xvci5vcGFjaXR5KTtcblx0XHRcdFx0fSk7XG5cdFx0XHRcdHZhciByZWN0ID0gc3ZnLmFwcGVuZCgnc3ZnOnJlY3QnKVxuXHRcdFx0XHRcdC5hdHRyKCd3aWR0aCcsIG9wdGlvbnMud2lkdGgpXG5cdFx0XHRcdFx0LmF0dHIoJ2hlaWdodCcsIG9wdGlvbnMuaGVpZ2h0KVxuXHRcdFx0XHRcdC5zdHlsZSgnZmlsbCcsICd1cmwoIycgKyAob3B0aW9ucy5maWVsZCtvcHRpb25zLnVuaXF1ZSkrICcpJyk7XG5cdFx0XHRcdHZhciBsZWdlbmQgPSBzdmcuYXBwZW5kKCdnJykuYXR0cigndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgnICsgb3B0aW9ucy5oZWlnaHQgLyAyICsgJywgJyArIG9wdGlvbnMuaGVpZ2h0IC8gMiArICcpJylcblx0XHRcdFx0XHQuYXR0cignY2xhc3MnLCAnc3RhcnRMYWJlbCcpXG5cblx0XHRcdFx0aWYgKG9wdGlvbnMuaW5mbyA9PT0gdHJ1ZSkge1xuXG5cdFx0XHRcdFx0bGVnZW5kLmFwcGVuZCgnY2lyY2xlJylcblx0XHRcdFx0XHRcdC5hdHRyKCdyJywgb3B0aW9ucy5oZWlnaHQgLyAyKTtcblx0XHRcdFx0XHRsZWdlbmQuYXBwZW5kKCd0ZXh0Jylcblx0XHRcdFx0XHRcdC50ZXh0KG1pbilcblx0XHRcdFx0XHRcdC5zdHlsZSgnZm9udC1zaXplJywgb3B0aW9ucy5oZWlnaHQvMi41KVxuXHRcdFx0XHRcdFx0LmF0dHIoJ3RleHQtYW5jaG9yJywgJ21pZGRsZScpXG5cdFx0XHRcdFx0XHQuYXR0cigneScsICcuMzVlbScpXG5cdFx0XHRcdFx0XHQuYXR0cignaWQnLCAnbG93ZXJWYWx1ZScpO1xuXHRcdFx0XHRcdHZhciBsZWdlbmQyID0gc3ZnLmFwcGVuZCgnZycpLmF0dHIoJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoJyArIChvcHRpb25zLndpZHRoIC0gKG9wdGlvbnMuaGVpZ2h0IC8gMikpICsgJywgJyArIG9wdGlvbnMuaGVpZ2h0IC8gMiArICcpJylcblx0XHRcdFx0XHRcdC5hdHRyKCdjbGFzcycsICdlbmRMYWJlbCcpXG5cdFx0XHRcdFx0bGVnZW5kMi5hcHBlbmQoJ2NpcmNsZScpXG5cdFx0XHRcdFx0XHQuYXR0cigncicsIG9wdGlvbnMuaGVpZ2h0IC8gMilcblx0XHRcdFx0XHRsZWdlbmQyLmFwcGVuZCgndGV4dCcpXG5cdFx0XHRcdFx0XHQudGV4dChmdW5jdGlvbigpe1xuXHRcdFx0XHRcdFx0XHQvL1RET0RPOiBDSGNraWNrIGlmIG5vIGNvbW1hIHRoZXJlXG5cdFx0XHRcdFx0XHRcdGlmKG1heCA+IDEwMDApe1xuXHRcdFx0XHRcdFx0XHRcdHZhciB2ID0gKHBhcnNlSW50KG1heCkgLyAxMDAwKS50b1N0cmluZygpO1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybiB2LnN1YnN0cigwLCB2LmluZGV4T2YoJy4nKSApICsgXCJrXCIgO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdHJldHVybiBtYXhcblx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0XHQuc3R5bGUoJ2ZvbnQtc2l6ZScsIG9wdGlvbnMuaGVpZ2h0LzIuNSlcblx0XHRcdFx0XHRcdC5hdHRyKCd0ZXh0LWFuY2hvcicsICdtaWRkbGUnKVxuXHRcdFx0XHRcdFx0LmF0dHIoJ3knLCAnLjM1ZW0nKVxuXHRcdFx0XHRcdFx0LmF0dHIoJ2lkJywgJ3VwcGVyVmFsdWUnKTtcblx0XHRcdFx0fVxuXHRcdFx0XHR2YXIgc2xpZGVyID0gc3ZnLmFwcGVuZChcImdcIilcblx0XHRcdFx0XHQuYXR0cihcImNsYXNzXCIsIFwic2xpZGVyXCIpO1xuXHRcdFx0XHRpZihvcHRpb25zLmhhbmRsaW5nID09IHRydWUpe1xuXHRcdFx0XHRcdHNsaWRlci5jYWxsKGJydXNoKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHNsaWRlci5zZWxlY3QoXCIuYmFja2dyb3VuZFwiKVxuXHRcdFx0XHRcdC5hdHRyKFwiaGVpZ2h0XCIsIG9wdGlvbnMuaGVpZ2h0KTtcblxuXHRcdFx0XHRpZiAob3B0aW9ucy5pbmZvID09PSB0cnVlKSB7XG5cdFx0XHRcdHNsaWRlci5hcHBlbmQoJ2xpbmUnKVxuXHRcdFx0XHRcdC5hdHRyKCd4MScsIG9wdGlvbnMud2lkdGggLyAyKVxuXHRcdFx0XHRcdC5hdHRyKCd5MScsIDApXG5cdFx0XHRcdFx0LmF0dHIoJ3gyJywgb3B0aW9ucy53aWR0aCAvIDIpXG5cdFx0XHRcdFx0LmF0dHIoJ3kyJywgb3B0aW9ucy5oZWlnaHQpXG5cdFx0XHRcdFx0LmF0dHIoJ3N0cm9rZS1kYXNoYXJyYXknLCAnMywzJylcblx0XHRcdFx0XHQuYXR0cignc3Ryb2tlLXdpZHRoJywgMSlcblx0XHRcdFx0XHQuYXR0cignc3Ryb2tlJywgJ3JnYmEoMCwwLDAsODcpJyk7XG5cdFx0XHRcdH1cblx0XHRcdFx0dmFyIGhhbmRsZUNvbnQgPSBzbGlkZXIuYXBwZW5kKCdnJylcblx0XHRcdFx0XHQuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZSgwLFwiICsgb3B0aW9ucy5oZWlnaHQgLyAyICsgXCIpXCIpO1xuXHRcdFx0XHR2YXIgaGFuZGxlID0gaGFuZGxlQ29udC5hcHBlbmQoXCJjaXJjbGVcIilcblx0XHRcdFx0XHQuYXR0cihcImNsYXNzXCIsIFwiaGFuZGxlXCIpXG5cdFx0XHRcdFx0LmF0dHIoXCJyXCIsIG9wdGlvbnMuaGVpZ2h0IC8gMik7XG5cdFx0XHRcdFx0aWYob3B0aW9ucy5jb2xvcil7XG5cdFx0XHRcdFx0XHRoYW5kbGUuc3R5bGUoJ2ZpbGwnLCBvcHRpb25zLmNvbG9yKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdHZhciBoYW5kbGVMYWJlbCA9IGhhbmRsZUNvbnQuYXBwZW5kKCd0ZXh0Jylcblx0XHRcdFx0XHQudGV4dCgwKVxuXHRcdFx0XHRcdC5zdHlsZSgnZm9udC1zaXplJywgb3B0aW9ucy5oZWlnaHQvMi41KVxuXHRcdFx0XHRcdC5hdHRyKFwidGV4dC1hbmNob3JcIiwgXCJtaWRkbGVcIikuYXR0cigneScsICcwLjM1ZW0nKTtcblxuXHRcdFx0XHQvL3NsaWRlclxuXHRcdFx0XHQvLy5jYWxsKGJydXNoLmV4dGVudChbMCwgMF0pKVxuXHRcdFx0XHQvLy5jYWxsKGJydXNoLmV2ZW50KTtcblxuXHRcdFx0XHRmdW5jdGlvbiBicnVzaCgpIHtcblx0XHRcdFx0XHR2YXIgdmFsdWUgPSBicnVzaC5leHRlbnQoKVswXTtcblxuXHRcdFx0XHRcdGlmIChkMy5ldmVudC5zb3VyY2VFdmVudCkge1xuXHRcdFx0XHRcdFx0dmFsdWUgPSB4LmludmVydChkMy5tb3VzZSh0aGlzKVswXSk7XG5cdFx0XHRcdFx0XHRicnVzaC5leHRlbnQoW3ZhbHVlLCB2YWx1ZV0pO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmKHBhcnNlSW50KHZhbHVlKSA+IDEwMDApe1xuXHRcdFx0XHRcdFx0dmFyIHYgPSAocGFyc2VJbnQodmFsdWUpIC8gMTAwMCkudG9TdHJpbmcoKTtcblx0XHRcdFx0XHRcdGhhbmRsZUxhYmVsLnRleHQodi5zdWJzdHIoMCwgdi5pbmRleE9mKCcuJykgKSArIFwia1wiICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2V7XG5cdFx0XHRcdFx0XHRoYW5kbGVMYWJlbC50ZXh0KHBhcnNlSW50KHZhbHVlKSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGhhbmRsZUNvbnQuYXR0cihcInRyYW5zZm9ybVwiLCAndHJhbnNsYXRlKCcgKyB4KHZhbHVlKSArICcsJyArIG9wdGlvbnMuaGVpZ2h0IC8gMiArICcpJyk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRmdW5jdGlvbiBicnVzaGVkKCkge1xuXG5cdFx0XHRcdFx0dmFyIHZhbHVlID0gYnJ1c2guZXh0ZW50KClbMF0sXG5cdFx0XHRcdFx0XHRjb3VudCA9IDAsXG5cdFx0XHRcdFx0XHRmb3VuZCA9IGZhbHNlO1xuXHRcdFx0XHRcdHZhciBmaW5hbCA9IFwiXCI7XG5cdFx0XHRcdFx0ZG8ge1xuXG5cdFx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2goJHNjb3BlLmRhdGEsIGZ1bmN0aW9uIChuYXQsIGtleSkge1xuXHRcdFx0XHRcdFx0XHRpZiAocGFyc2VJbnQobmF0W29wdGlvbnMuZmllbGRdKSA9PSBwYXJzZUludCh2YWx1ZSkpIHtcblx0XHRcdFx0XHRcdFx0XHRmaW5hbCA9IG5hdDtcblx0XHRcdFx0XHRcdFx0XHRmb3VuZCA9IHRydWU7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0Y291bnQrKztcblx0XHRcdFx0XHRcdHZhbHVlID0gdmFsdWUgPiA1MCA/IHZhbHVlIC0gMSA6IHZhbHVlICsgMTtcblx0XHRcdFx0XHR9IHdoaWxlICghZm91bmQgJiYgY291bnQgPCBtYXgpO1xuXG5cdFx0XHRcdFx0bmdNb2RlbC4kc2V0Vmlld1ZhbHVlKGZpbmFsKTtcblx0XHRcdFx0XHRuZ01vZGVsLiRyZW5kZXIoKTtcblx0XHRcdFx0fVxuXG5cblx0XHRcdFx0JHNjb3BlLiR3YXRjaCgnb3B0aW9ucycsIGZ1bmN0aW9uKG4sbyl7XG5cdFx0XHRcdFx0aWYobiA9PT0gbyl7XG5cdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdG9wdGlvbnMuY29sb3JzWzFdLmNvbG9yID0gbi5jb2xvcjtcblx0XHRcdFx0XHRncmFkaWVudCA9IHN2Zy5hcHBlbmQoJ3N2ZzpkZWZzJylcblx0XHRcdFx0XHRcdC5hcHBlbmQoXCJzdmc6bGluZWFyR3JhZGllbnRcIilcblx0XHRcdFx0XHRcdC5hdHRyKCdpZCcsIG9wdGlvbnMuZmllbGQrXCJfXCIrbi5jb2xvcilcblx0XHRcdFx0XHRcdC5hdHRyKCd4MScsICcwJScpXG5cdFx0XHRcdFx0XHQuYXR0cigneTEnLCAnMCUnKVxuXHRcdFx0XHRcdFx0LmF0dHIoJ3gyJywgJzEwMCUnKVxuXHRcdFx0XHRcdFx0LmF0dHIoJ3kyJywgJzAlJylcblx0XHRcdFx0XHRcdC5hdHRyKCdzcHJlYWRNZXRob2QnLCAncGFkJylcblx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2gob3B0aW9ucy5jb2xvcnMsIGZ1bmN0aW9uIChjb2xvcikge1xuXHRcdFx0XHRcdFx0Z3JhZGllbnQuYXBwZW5kKCdzdmc6c3RvcCcpXG5cdFx0XHRcdFx0XHRcdC5hdHRyKCdvZmZzZXQnLCBjb2xvci5wb3NpdGlvbiArICclJylcblx0XHRcdFx0XHRcdFx0LmF0dHIoJ3N0b3AtY29sb3InLCBjb2xvci5jb2xvcilcblx0XHRcdFx0XHRcdFx0LmF0dHIoJ3N0b3Atb3BhY2l0eScsIGNvbG9yLm9wYWNpdHkpO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdHJlY3Quc3R5bGUoJ2ZpbGwnLCAndXJsKCMnICsgb3B0aW9ucy5maWVsZCArICdfJytuLmNvbG9yKycpJyk7XG5cdFx0XHRcdFx0aGFuZGxlLnN0eWxlKCdmaWxsJywgbi5jb2xvcik7XG5cdFx0XHRcdFx0aWYobmdNb2RlbC4kbW9kZWxWYWx1ZSl7XG5cdFx0XHRcdFx0XHRcdGhhbmRsZUxhYmVsLnRleHQocGFyc2VJbnQobmdNb2RlbC4kbW9kZWxWYWx1ZVtuLmZpZWxkXSkpO1xuXHRcdFx0XHRcdFx0XHRoYW5kbGVDb250LnRyYW5zaXRpb24oKS5kdXJhdGlvbig1MDApLmVhc2UoJ3F1YWQnKS5hdHRyKFwidHJhbnNmb3JtXCIsICd0cmFuc2xhdGUoJyArIHgobmdNb2RlbC4kbW9kZWxWYWx1ZVtuLmZpZWxkXSkgKyAnLCcgKyBvcHRpb25zLmhlaWdodCAvIDIgKyAnKScpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNle1xuXHRcdFx0XHRcdFx0aGFuZGxlTGFiZWwudGV4dCgwKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdCRzY29wZS4kd2F0Y2goXG5cdFx0XHRcdFx0ZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIG5nTW9kZWwuJG1vZGVsVmFsdWU7XG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRmdW5jdGlvbiAobmV3VmFsdWUsIG9sZFZhbHVlKSB7XG5cdFx0XHRcdFx0XHRpZiAoIW5ld1ZhbHVlKSB7XG5cdFx0XHRcdFx0XHRcdGhhbmRsZUxhYmVsLnRleHQocGFyc2VJbnQoMCkpO1xuXHRcdFx0XHRcdFx0XHRoYW5kbGVDb250LmF0dHIoXCJ0cmFuc2Zvcm1cIiwgJ3RyYW5zbGF0ZSgnICsgeCgwKSArICcsJyArIG9wdGlvbnMuaGVpZ2h0IC8gMiArICcpJyk7XG5cdFx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGhhbmRsZUxhYmVsLnRleHQocGFyc2VJbnQobmV3VmFsdWVbb3B0aW9ucy5maWVsZF0pKTtcblx0XHRcdFx0XHRcdGlmIChuZXdWYWx1ZSA9PSBvbGRWYWx1ZSkge1xuXHRcdFx0XHRcdFx0XHRoYW5kbGVDb250LmF0dHIoXCJ0cmFuc2Zvcm1cIiwgJ3RyYW5zbGF0ZSgnICsgeChuZXdWYWx1ZVtvcHRpb25zLmZpZWxkXSkgKyAnLCcgKyBvcHRpb25zLmhlaWdodCAvIDIgKyAnKScpO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0aGFuZGxlQ29udC50cmFuc2l0aW9uKCkuZHVyYXRpb24oNTAwKS5lYXNlKCdxdWFkJykuYXR0cihcInRyYW5zZm9ybVwiLCAndHJhbnNsYXRlKCcgKyB4KG5ld1ZhbHVlW29wdGlvbnMuZmllbGRdKSArICcsJyArIG9wdGlvbnMuaGVpZ2h0IC8gMiArICcpJyk7XG5cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHQkc2NvcGUuJHdhdGNoKCdkYXRhJywgZnVuY3Rpb24obiwgbyl7XG5cdFx0XHRcdFx0XHRpZihuID09PSBvKSByZXR1cm4gZmFsc2U7XG5cdFx0XHRcdFx0Ly9cdGNvbnNvbGUubG9nKG4pO1xuXHRcdFx0XHRcdFx0bWluID0gMDtcblx0XHRcdFx0XHRcdG1heCA9IDA7XG5cdFx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2goJHNjb3BlLmRhdGEsIGZ1bmN0aW9uIChuYXQsIGtleSkge1xuXHRcdFx0XHRcdFx0XHRtYXggPSBkMy5tYXgoW21heCwgcGFyc2VJbnQobmF0W29wdGlvbnMuZmllbGRdKV0pO1xuXHRcdFx0XHRcdFx0XHRtaW4gPSBkMy5taW4oW21pbiwgcGFyc2VJbnQobmF0W29wdGlvbnMuZmllbGRdKV0pO1xuXHRcdFx0XHRcdFx0XHRpZihuYXQuaXNvID09IG5nTW9kZWwuJG1vZGVsVmFsdWUuaXNvKXtcblx0XHRcdFx0XHRcdFx0XHRcdGhhbmRsZUxhYmVsLnRleHQocGFyc2VJbnQobmF0W29wdGlvbnMuZmllbGRdKSk7XG5cdFx0XHRcdFx0XHRcdFx0XHRoYW5kbGVDb250LnRyYW5zaXRpb24oKS5kdXJhdGlvbig1MDApLmVhc2UoJ3F1YWQnKS5hdHRyKFwidHJhbnNmb3JtXCIsICd0cmFuc2xhdGUoJyArIHgobmF0W29wdGlvbnMuZmllbGRdKSArICcsJyArIG9wdGlvbnMuaGVpZ2h0IC8gMiArICcpJyk7XG5cblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRjb25zb2xlLmxvZyhuZ01vZGVsLiRtb2RlbFZhbHVlKTtcblx0XHRcdFx0XHRcdHggPSBkMy5zY2FsZS5saW5lYXIoKVxuXHRcdFx0XHRcdFx0XHQuZG9tYWluKFttaW4sIG1heF0pXG5cdFx0XHRcdFx0XHRcdC5yYW5nZShbb3B0aW9ucy5tYXJnaW4ubGVmdCwgb3B0aW9ucy53aWR0aCAtIG9wdGlvbnMubWFyZ2luLmxlZnRdKVxuXHRcdFx0XHRcdFx0XHQuY2xhbXAodHJ1ZSk7XG5cdFx0XHRcdFx0XHRicnVzaC54KHgpXG5cdFx0XHRcdFx0XHRcdFx0LmV4dGVudChbMCwgMF0pXG5cdFx0XHRcdFx0XHRcdFx0Lm9uKFwiYnJ1c2hcIiwgYnJ1c2gpXG5cdFx0XHRcdFx0XHRcdFx0Lm9uKFwiYnJ1c2hlbmRcIiwgYnJ1c2hlZCk7XG5cdFx0XHRcdFx0XHRsZWdlbmQuc2VsZWN0KCcjbG93ZXJWYWx1ZScpLnRleHQobWluKTtcblx0XHRcdFx0XHRcdGxlZ2VuZDIuc2VsZWN0KCcjdXBwZXJWYWx1ZScpLnRleHQoZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRcdFx0Ly9URE9ETzogQ0hja2ljayBpZiBubyBjb21tYSB0aGVyZVxuXHRcdFx0XHRcdFx0XHRpZihtYXggPiAxMDAwKXtcblx0XHRcdFx0XHRcdFx0XHR2YXIgdiA9IChwYXJzZUludChtYXgpIC8gMTAwMCkudG9TdHJpbmcoKTtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gdi5zdWJzdHIoMCwgdi5pbmRleE9mKCcuJykgKSArIFwia1wiIDtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gbWF4XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaCgkc2NvcGUuZGF0YSwgZnVuY3Rpb24gKG5hdCwga2V5KSB7XG5cdFx0XHRcdFx0XHRcdGlmKG5hdC5pc28gPT0gbmdNb2RlbC4kbW9kZWxWYWx1ZS5pc28pe1xuXHRcdFx0XHRcdFx0XHRcdFx0aGFuZGxlTGFiZWwudGV4dChwYXJzZUludChuYXRbb3B0aW9ucy5maWVsZF0pKTtcblx0XHRcdFx0XHRcdFx0XHRcdGhhbmRsZUNvbnQudHJhbnNpdGlvbigpLmR1cmF0aW9uKDUwMCkuZWFzZSgncXVhZCcpLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgJ3RyYW5zbGF0ZSgnICsgeChuYXRbb3B0aW9ucy5maWVsZF0pICsgJywnICsgb3B0aW9ucy5oZWlnaHQgLyAyICsgJyknKTtcblxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH07XG5cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoICdhcHAuY29udHJvbGxlcnMnICkuY29udHJvbGxlciggJ01lZGlhbkN0cmwnLCBmdW5jdGlvbigpe1xuXHRcdC8vXG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5kaXJlY3RpdmVzJykuZGlyZWN0aXZlKCAncGFyc2VDb25mbGljdENzdicsIGZ1bmN0aW9uKCRzdGF0ZSwgJHRpbWVvdXQsIHRvYXN0cikge1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlc3RyaWN0OiAnRUEnLFxuXHRcdFx0dGVtcGxhdGVVcmw6ICd2aWV3cy9kaXJlY3RpdmVzL3BhcnNlQ29uZmxpY3RDc3YvcGFyc2VDb25mbGljdENzdi5odG1sJyxcblx0XHRcdGNvbnRyb2xsZXI6ICdQYXJzZUNvbmZsaWN0Q3N2Q3RybCcsXG5cdFx0XHRzY29wZToge1xuXHRcdFx0XHRuYXRpb25zOiAnPScsXG5cdFx0XHRcdHN1bTogJz0nXG5cdFx0XHR9LFxuXHRcdFx0bGluazogZnVuY3Rpb24oIHNjb3BlLCBlbGVtZW50LCBhdHRycyApe1xuXHRcdFx0XHQvL1xuXHRcdFx0XHR2YXIgZXJyb3JzID0gMDtcblx0XHRcdFx0dmFyIHN0ZXBwZWQgPSAwLFxuXHRcdFx0XHRcdHJvd0NvdW50ID0gMCxcblx0XHRcdFx0XHRlcnJvckNvdW50ID0gMCxcblx0XHRcdFx0XHRmaXJzdEVycm9yO1xuXHRcdFx0XHR2YXIgc3RhcnQsIGVuZDtcblx0XHRcdFx0dmFyIGZpcnN0UnVuID0gdHJ1ZTtcblx0XHRcdFx0dmFyIG1heFVucGFyc2VMZW5ndGggPSAxMDAwMDtcblx0XHRcdFx0dmFyIGJ1dHRvbiA9IGVsZW1lbnQuZmluZCgnYnV0dG9uJyk7XG5cdFx0XHRcdHZhciBpbnB1dCA9IGVsZW1lbnQuZmluZCgnaW5wdXQnKTtcblx0XHRcdFx0dmFyIGlzVmVydGljYWwgPSBmYWxzZTtcblx0XHRcdFx0dmFyIHJhdyA9IFtdO1xuXHRcdFx0XHR2YXIgcmF3TGlzdCA9IHt9O1xuXHRcdFx0XHRpbnB1dC5jc3Moe1xuXHRcdFx0XHRcdGRpc3BsYXk6ICdub25lJ1xuXHRcdFx0XHR9KTtcblx0XHRcdFx0YnV0dG9uLmJpbmQoJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdGlucHV0WzBdLmNsaWNrKCk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRpbnB1dC5iaW5kKCdjaGFuZ2UnLCBmdW5jdGlvbiAoZSkge1xuXHRcdFx0XHRcdGlzVmVydGljYWwgPSBmYWxzZTtcblx0XHRcdFx0XHRyYXcgPSBbXTtcblx0XHRcdFx0XHRyYXdMaXN0ID0ge307XG5cblx0XHRcdFx0XHRlcnJvcnMgPSBbXTtcblx0XHRcdFx0XHRzdGVwcGVkID0gMCwgcm93Q291bnQgPSAwLCBlcnJvckNvdW50ID0gMCwgZmlyc3RFcnJvcjtcblx0XHRcdFx0XHRzdGFydCwgZW5kO1xuXHRcdFx0XHRcdGZpcnN0UnVuID0gdHJ1ZTtcblx0XHRcdFx0XHRzY29wZS5uYXRpb25zID0gW107XG5cdFx0XHRcdFx0JHRpbWVvdXQoZnVuY3Rpb24gKCkge1xuXG5cdFx0XHRcdFx0XHR2YXIgc2l6ZSA9IGlucHV0WzBdLmZpbGVzWzBdLnNpemU7XG5cdFx0XHRcdFx0XHR2YXIgY3N2ID0gUGFwYS5wYXJzZShpbnB1dFswXS5maWxlc1swXSwge1xuXHRcdFx0XHRcdFx0XHRza2lwRW1wdHlMaW5lczogdHJ1ZSxcblx0XHRcdFx0XHRcdFx0aGVhZGVyOiB0cnVlLFxuXHRcdFx0XHRcdFx0XHRkeW5hbWljVHlwaW5nOiB0cnVlLFxuXHRcdFx0XHRcdFx0XHRmYXN0TW9kZTogdHJ1ZSxcblx0XHRcdFx0XHRcdFx0c3RlcDogZnVuY3Rpb24gKHJvdykge1xuXHRcdFx0XHRcdFx0XHRcdHZhciBudW1iZXJzID0gcm93LmRhdGFbMF0uY29uZmxpY3RzLm1hdGNoKC9bMC05XSsvZykubWFwKGZ1bmN0aW9uKG4pXG5cdFx0XHRcdFx0XHRcdFx0ey8vanVzdCBjb2VyY2UgdG8gbnVtYmVyc1xuXHRcdFx0XHRcdFx0XHRcdCAgICByZXR1cm4gKyhuKTtcblx0XHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdFx0XHRyb3cuZGF0YVswXS5ldmVudHMgPSBudW1iZXJzO1xuXHRcdFx0XHRcdFx0XHRcdHNjb3BlLnN1bSArPSBudW1iZXJzLmxlbmd0aDtcblx0XHRcdFx0XHRcdFx0XHRzY29wZS5uYXRpb25zLnB1c2gocm93LmRhdGFbMF0pO1xuXG5cdFx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRcdGNvbXBsZXRlOmZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0XHRcdFx0c2NvcGUuJGFwcGx5KCk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fTtcblxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSggJ2FwcC5jb250cm9sbGVycycgKS5jb250cm9sbGVyKCAnUGFyc2VDb25mbGljdENzdkN0cmwnLCBmdW5jdGlvbigpe1xuXHRcdC8vXG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5kaXJlY3RpdmVzJykuZGlyZWN0aXZlKCAncGFyc2VDb25mbGljdEV2ZW50c0NzdicsIGZ1bmN0aW9uKCRzdGF0ZSwgJHRpbWVvdXQsIHRvYXN0cikge1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlc3RyaWN0OiAnRUEnLFxuXHRcdFx0dGVtcGxhdGVVcmw6ICd2aWV3cy9kaXJlY3RpdmVzL3BhcnNlQ29uZmxpY3RFdmVudHNDc3YvcGFyc2VDb25mbGljdEV2ZW50c0Nzdi5odG1sJyxcblx0XHRcdGNvbnRyb2xsZXI6ICdQYXJzZUNvbmZsaWN0RXZlbnRzQ3N2Q3RybCcsXG5cdFx0XHRzY29wZToge1xuXHRcdFx0XHRldmVudHM6ICc9Jyxcblx0XHRcdH0sXG5cdFx0XHRsaW5rOiBmdW5jdGlvbiggc2NvcGUsIGVsZW1lbnQsIGF0dHJzICl7XG5cdFx0XHRcdC8vXG5cdFx0XHRcdHZhciBlcnJvcnMgPSAwO1xuXHRcdFx0XHR2YXIgc3RlcHBlZCA9IDAsXG5cdFx0XHRcdFx0cm93Q291bnQgPSAwLFxuXHRcdFx0XHRcdGVycm9yQ291bnQgPSAwLFxuXHRcdFx0XHRcdGZpcnN0RXJyb3I7XG5cdFx0XHRcdHZhciBzdGFydCwgZW5kO1xuXHRcdFx0XHR2YXIgZmlyc3RSdW4gPSB0cnVlO1xuXHRcdFx0XHR2YXIgbWF4VW5wYXJzZUxlbmd0aCA9IDEwMDAwO1xuXHRcdFx0XHR2YXIgYnV0dG9uID0gZWxlbWVudC5maW5kKCdidXR0b24nKTtcblx0XHRcdFx0dmFyIGlucHV0ID0gZWxlbWVudC5maW5kKCdpbnB1dCcpO1xuXHRcdFx0XHR2YXIgaXNWZXJ0aWNhbCA9IGZhbHNlO1xuXHRcdFx0XHR2YXIgcmF3ID0gW107XG5cdFx0XHRcdHZhciByYXdMaXN0ID0ge307XG5cdFx0XHRcdGlucHV0LmNzcyh7XG5cdFx0XHRcdFx0ZGlzcGxheTogJ25vbmUnXG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRidXR0b24uYmluZCgnY2xpY2snLCBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0aW5wdXRbMF0uY2xpY2soKTtcblx0XHRcdFx0fSk7XG5cdFx0XHRcdGlucHV0LmJpbmQoJ2NoYW5nZScsIGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdFx0aXNWZXJ0aWNhbCA9IGZhbHNlO1xuXHRcdFx0XHRcdHJhdyA9IFtdO1xuXHRcdFx0XHRcdHJhd0xpc3QgPSB7fTtcblx0c2NvcGUuZXZlbnRzID0gW107XG5cdFx0XHRcdFx0ZXJyb3JzID0gW107XG5cdFx0XHRcdFx0c3RlcHBlZCA9IDAsIHJvd0NvdW50ID0gMCwgZXJyb3JDb3VudCA9IDAsIGZpcnN0RXJyb3I7XG5cdFx0XHRcdFx0c3RhcnQsIGVuZDtcblx0XHRcdFx0XHRmaXJzdFJ1biA9IHRydWU7XG5cdFx0XHRcdFx0JHRpbWVvdXQoZnVuY3Rpb24gKCkge1xuXG5cdFx0XHRcdFx0XHR2YXIgc2l6ZSA9IGlucHV0WzBdLmZpbGVzWzBdLnNpemU7XG5cdFx0XHRcdFx0XHR2YXIgY3N2ID0gUGFwYS5wYXJzZShpbnB1dFswXS5maWxlc1swXSwge1xuXHRcdFx0XHRcdFx0XHRza2lwRW1wdHlMaW5lczogdHJ1ZSxcblx0XHRcdFx0XHRcdFx0aGVhZGVyOiB0cnVlLFxuXHRcdFx0XHRcdFx0XHRkeW5hbWljVHlwaW5nOiB0cnVlLFxuXHRcdFx0XHRcdFx0XHRmYXN0TW9kZTogdHJ1ZSxcblx0XHRcdFx0XHRcdFx0c3RlcDogZnVuY3Rpb24gKHJvdykge1xuXHRcdFx0XHRcdFx0XHRcdHN3aXRjaCAocm93LmRhdGFbMF0udHlwZSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0Y2FzZSAnaW50ZXJzdGF0ZSc6XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHJvdy5kYXRhWzBdLnR5cGVfaWQgPSAxO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdFx0XHRcdGNhc2UgJ2ludHJhc3RhdGUnOlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRyb3cuZGF0YVswXS50eXBlX2lkID0gMjtcblx0XHRcdFx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRcdFx0XHRjYXNlICdzdWJzdGF0ZSc6XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHJvdy5kYXRhWzBdLnR5cGVfaWQgPSAzO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdFx0XHRcdGRlZmF1bHQ6XG5cblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0c2NvcGUuZXZlbnRzLnB1c2gocm93LmRhdGFbMF0pO1xuXHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHRjb21wbGV0ZTpmdW5jdGlvbigpe1xuXHRcdFx0XHRcdFx0XHRcdHNjb3BlLiRhcHBseSgpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH07XG5cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoICdhcHAuY29udHJvbGxlcnMnICkuY29udHJvbGxlciggJ1BhcnNlQ29uZmxpY3RFdmVudHNDc3ZDdHJsJywgZnVuY3Rpb24oKXtcblx0XHQvL1xuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5kaXJlY3RpdmVzJykuZGlyZWN0aXZlKCdwYXJzZWNzdicsIGZ1bmN0aW9uICgkc3RhdGUsICR0aW1lb3V0LCB0b2FzdHIsIEluZGV4U2VydmljZSkge1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlc3RyaWN0OiAnRUEnLFxuXHRcdFx0dGVtcGxhdGVVcmw6ICd2aWV3cy9kaXJlY3RpdmVzL3BhcnNlY3N2L3BhcnNlY3N2Lmh0bWwnLFxuXHRcdFx0Y29udHJvbGxlcjogJ1BhcnNlY3N2Q3RybCcsXG5cdFx0XHRyZXBsYWNlOiB0cnVlLFxuXHRcdFx0bGluazogZnVuY3Rpb24gKCRzY29wZSwgZWxlbWVudCwgJGF0dHJzKSB7XG5cdFx0XHRcdC8vXG5cdFx0XHRcdHZhciBlcnJvcnMgPSAwO1xuXHRcdFx0XHR2YXIgc3RlcHBlZCA9IDAsXG5cdFx0XHRcdFx0cm93Q291bnQgPSAwLFxuXHRcdFx0XHRcdGVycm9yQ291bnQgPSAwLFxuXHRcdFx0XHRcdGZpcnN0RXJyb3I7XG5cdFx0XHRcdHZhciBzdGFydCwgZW5kO1xuXHRcdFx0XHR2YXIgZmlyc3RSdW4gPSB0cnVlO1xuXHRcdFx0XHR2YXIgbWF4VW5wYXJzZUxlbmd0aCA9IDEwMDAwO1xuXHRcdFx0XHR2YXIgYnV0dG9uID0gZWxlbWVudC5maW5kKCdidXR0b24nKTtcblx0XHRcdFx0dmFyIGlucHV0ID0gZWxlbWVudC5maW5kKCdpbnB1dCcpO1xuXHRcdFx0XHR2YXIgaXNWZXJ0aWNhbCA9IGZhbHNlO1xuXHRcdFx0XHR2YXIgcmF3ID0gW107XG5cdFx0XHRcdHZhciByYXdMaXN0ID0ge307XG5cdFx0XHRcdGlucHV0LmNzcyh7XG5cdFx0XHRcdFx0ZGlzcGxheTogJ25vbmUnXG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRidXR0b24uYmluZCgnY2xpY2snLCBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0aW5wdXRbMF0uY2xpY2soKTtcblx0XHRcdFx0fSk7XG5cdFx0XHRcdGlucHV0LmJpbmQoJ2NoYW5nZScsIGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdFx0aXNWZXJ0aWNhbCA9IGZhbHNlO1xuXHRcdFx0XHRcdHJhdyA9IFtdO1xuXHRcdFx0XHRcdHJhd0xpc3QgPSB7fTtcblxuXHRcdFx0XHRcdGVycm9ycyA9IFtdO1xuXHRcdFx0XHRcdHN0ZXBwZWQgPSAwLCByb3dDb3VudCA9IDAsIGVycm9yQ291bnQgPSAwLCBmaXJzdEVycm9yO1xuXHRcdFx0XHRcdHN0YXJ0LCBlbmQ7XG5cdFx0XHRcdFx0Zmlyc3RSdW4gPSB0cnVlO1xuXHRcdFx0XHRcdCR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdEluZGV4U2VydmljZS5jbGVhcigpO1xuXHRcdFx0XHRcdFx0Y29uc29sZS5sb2coUGFwYSk7XG5cdFx0XHRcdFx0XHR2YXIgc2l6ZSA9IGlucHV0WzBdLmZpbGVzWzBdLnNpemU7XG5cdFx0XHRcdFx0XHR2YXIgY3N2ID0gUGFwYS5wYXJzZShpbnB1dFswXS5maWxlc1swXSwge1xuXHRcdFx0XHRcdFx0XHRza2lwRW1wdHlMaW5lczogdHJ1ZSxcblx0XHRcdFx0XHRcdFx0aGVhZGVyOiB0cnVlLFxuXHRcdFx0XHRcdFx0XHRkeW5hbWljVHlwaW5nOiB0cnVlLFxuXHRcdFx0XHRcdFx0XHRmYXN0TW9kZTogdHJ1ZSxcblx0XHRcdFx0XHRcdFx0Ly93b3JrZXI6IHRydWUsXG5cdFx0XHRcdFx0XHRcdC8vSUYgXCJzdGVwXCIgaW5zdGVhZCBvZiBcImNodW5rXCIgPiBjaHVuayA9IHJvdyBhbmQgY2h1bmsuZGF0YSA9IHJvdy5kYXRhWzBdXG5cdFx0XHRcdFx0XHRcdGNodW5rOiBmdW5jdGlvbiAoY2h1bmspIHtcblx0XHRcdFx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2goY2h1bmsuZGF0YSwgZnVuY3Rpb24gKHJvdywgaW5kZXgpIHtcblxuXHRcdFx0XHRcdFx0XHRcdFx0dmFyIHIgPSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGRhdGE6e30sXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGVycm9yczpbXVxuXHRcdFx0XHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChyb3csIGZ1bmN0aW9uIChpdGVtLCBrZXkpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKGlzTmFOKGl0ZW0pIHx8IGl0ZW0gPCAwKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKGl0ZW0udG9TdHJpbmcoKS50b1VwcGVyQ2FzZSgpID09IFwiI05BXCIgLyp8fCBpdGVtIDwgMCovIHx8IGl0ZW0udG9TdHJpbmcoKS50b1VwcGVyQ2FzZSgpLmluZGV4T2YoJ04vQScpID4gLTEpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHZhciBlcnJvciA9IHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0dHlwZTogXCIxXCIsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1lc3NhZ2U6IFwiRmllbGQgaW4gcm93IGlzIG5vdCB2YWxpZCBmb3IgZGF0YWJhc2UgdXNlIVwiLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjb2x1bW46IGtleSxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0dmFsdWU6IGl0ZW1cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRyLmVycm9ycy5wdXNoKGVycm9yKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVycm9ycy5wdXNoKGVycm9yKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0XHRcdFx0aWYgKGlzVmVydGljYWwpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKHJvdywgZnVuY3Rpb24gKGl0ZW0sIGtleSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlmIChrZXkubGVuZ3RoID09IDMpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlmICh0eXBlb2YgcmF3TGlzdFtrZXldLmRhdGEgPT0gXCJ1bmRlZmluZWRcIikge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRyYXdMaXN0W2tleV0uZGF0YSA9IFtdO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cmF3TGlzdFtrZXldLmRhdGEucHVzaChpdGVtKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHQvL3Jhd0xpc3Rba2V5XS5lcnJvcnMgPSByb3cuZXJyb3JzO1xuXHRcdFx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0Ly9JRiBcInN0ZXBcIiBpbnN0ZWFkIG9mIFwiY2h1bmtcIjogciA+IHJvdy5kYXRhID0gcm93LmRhdGFbMF1cblx0XHRcdFx0XHRcdFx0XHRcdFx0ci5kYXRhID0gcm93O1xuXG5cdFx0XHRcdFx0XHRcdFx0XHRcdEluZGV4U2VydmljZS5hZGREYXRhKHIpO1xuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRcdFx0fSlcblxuXHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHRiZWZvcmVGaXJzdENodW5rOiBmdW5jdGlvbiAoY2h1bmspIHtcblxuXHRcdFx0XHRcdFx0XHRcdC8vQ2hlY2sgaWYgdGhlcmUgYXJlIHBvaW50cyBpbiB0aGUgaGVhZGVyc1xuXHRcdFx0XHRcdFx0XHRcdHZhciBpbmRleCA9IGNodW5rLm1hdGNoKC9cXHJcXG58XFxyfFxcbi8pLmluZGV4O1xuXHRcdFx0XHRcdFx0XHRcdHZhciBkZWxpbWl0ZXIgPSAnLCc7XG5cdFx0XHRcdFx0XHRcdFx0dmFyIGhlYWRpbmdzID0gY2h1bmsuc3Vic3RyKDAsIGluZGV4KS5zcGxpdCgnLCcpO1xuXG5cdFx0XHRcdFx0XHRcdFx0aWYgKGhlYWRpbmdzLmxlbmd0aCA8IDIpIHtcblx0XHRcdFx0XHRcdFx0XHRcdGhlYWRpbmdzID0gY2h1bmsuc3Vic3RyKDAsIGluZGV4KS5zcGxpdChcIlxcdFwiKTtcblx0XHRcdFx0XHRcdFx0XHRcdGRlbGltaXRlciA9ICdcXHQnO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHR2YXIgaXNJc28gPSBbXTtcblxuXHRcdFx0XHRcdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDw9IGhlYWRpbmdzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAoaGVhZGluZ3NbaV0pIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0aGVhZGluZ3NbaV0gPSBoZWFkaW5nc1tpXS5yZXBsYWNlKC9bXmEtejAtOV0vZ2ksICdfJykudG9Mb3dlckNhc2UoKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKGhlYWRpbmdzW2ldLmluZGV4T2YoJy4nKSA+IC0xKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0aGVhZGluZ3NbaV0gPSBoZWFkaW5nc1tpXS5zdWJzdHIoMCwgaGVhZGluZ3NbaV0uaW5kZXhPZignLicpKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0XHR2YXIgaGVhZCA9IGhlYWRpbmdzW2ldLnNwbGl0KCdfJyk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlmIChoZWFkLmxlbmd0aCA+IDEpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRoZWFkaW5nc1tpXSA9ICcnO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGZvciAodmFyIGogPSAwOyBqIDwgaGVhZC5sZW5ndGg7IGorKykge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKGlzTmFOKGhlYWRbal0pKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlmIChqID4gMCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGhlYWRpbmdzW2ldICs9ICdfJztcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRoZWFkaW5nc1tpXSArPSBoZWFkW2pdO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlmIChoZWFkaW5nc1tpXS5sZW5ndGggPT0gMykge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlzSXNvLnB1c2godHJ1ZSk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0aWYgKGhlYWRpbmdzLmxlbmd0aCA9PSBpc0lzby5sZW5ndGgpIHtcblx0XHRcdFx0XHRcdFx0XHRcdGlzVmVydGljYWwgPSB0cnVlO1xuXHRcdFx0XHRcdFx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPD0gaGVhZGluZ3MubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKHR5cGVvZiByYXdMaXN0W2hlYWRpbmdzW2ldXSA9PSBcInVuZGVmaW5lZFwiKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0cmF3TGlzdFtoZWFkaW5nc1tpXV0gPSB7fTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRyYXdMaXN0W2hlYWRpbmdzW2ldXS5kYXRhID0gW107XG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIGhlYWRpbmdzLmpvaW4oZGVsaW1pdGVyKSArIGNodW5rLnN1YnN0cihpbmRleCk7XG5cdFx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRcdGVycm9yOiBmdW5jdGlvbiAoZXJyLCBmaWxlKSB7XG5cdFx0XHRcdFx0XHRcdFx0VG9hc3RTZXJ2aWNlLmVycm9yKGVycik7XG5cdFx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRcdGNvbXBsZXRlOiBmdW5jdGlvbiAocmVzdWx0cykge1xuXG5cdFx0XHRcdFx0XHRcdFx0SW5kZXhTZXJ2aWNlLnNldEVycm9ycyhlcnJvcnMpO1xuXG5cdFx0XHRcdFx0XHRcdFx0Ly9TZWUgaWYgdGhlcmUgaXMgYW4gZmllbGQgbmFtZSBcImlzb1wiIGluIHRoZSBoZWFkaW5ncztcblx0XHRcdFx0XHRcdFx0XHRpZiAoIWlzVmVydGljYWwpIHtcblx0XHRcdFx0XHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChJbmRleFNlcnZpY2UuZ2V0Rmlyc3RFbnRyeSgpLmRhdGEsIGZ1bmN0aW9uIChpdGVtLCBrZXkpIHtcblxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoa2V5LnRvTG93ZXJDYXNlKCkuaW5kZXhPZignaXNvJykgIT0gLTEgfHwga2V5LnRvTG93ZXJDYXNlKCkuaW5kZXhPZignY29kZScpICE9IC0xKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0SW5kZXhTZXJ2aWNlLnNldElzb0ZpZWxkKGtleSk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKGtleS50b0xvd2VyQ2FzZSgpLmluZGV4T2YoJ2NvdW50cnknKSAhPSAtMSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdEluZGV4U2VydmljZS5zZXRDb3VudHJ5RmllbGQoa2V5KTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoa2V5LnRvTG93ZXJDYXNlKCkuaW5kZXhPZigneWVhcicpICE9IC0xICYmIGl0ZW0udG9TdHJpbmcoKS5sZW5ndGggPT0gNCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdEluZGV4U2VydmljZS5zZXRZZWFyRmllbGQoa2V5KTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChyYXdMaXN0LCBmdW5jdGlvbiAoaXRlbSwga2V5KSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGl0ZW0uZXJyb3JzID0gW107XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlmIChpdGVtLnRvTG93ZXJDYXNlKCkgIT0gXCJ1bmRlZmluZWRcIiAmJiB0eXBlb2Yga2V5ICE9IFwidW5kZWZpbmVkXCIpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR2YXIgciA9IHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlzbzoga2V5LnRvVXBwZXJDYXNlKClcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChpdGVtLmRhdGEsIGZ1bmN0aW9uIChjb2x1bW4sIGkpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJbJ2NvbHVtbl8nICsgaV0gPSBjb2x1bW47XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoaXNOYU4oY29sdW1uKSB8fCBjb2x1bW4gPCAwKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlmIChjb2x1bW4udG9TdHJpbmcoKS50b1VwcGVyQ2FzZSgpID09IFwiTkFcIiB8fCBjb2x1bW4gPCAwIHx8IGNvbHVtbi50b1N0cmluZygpLnRvVXBwZXJDYXNlKCkuaW5kZXhPZignTi9BJykgPiAtMSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGl0ZW0uZXJyb3JzLnB1c2goe1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0dHlwZTogXCIxXCIsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtZXNzYWdlOiBcIkZpZWxkIGluIHJvdyBpcyBub3QgdmFsaWQgZm9yIGRhdGFiYXNlIHVzZSFcIixcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGNvbHVtbjogaXRlbVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZXJyb3JzKys7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdEluZGV4U2VydmljZS5hZGREYXRhKHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRhdGE6IFtyXSxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVycm9yczogaXRlbS5lcnJvcnNcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRcdFx0XHRJbmRleFNlcnZpY2Uuc2V0SXNvRmllbGQoJ2lzbycpO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRJbmRleFNlcnZpY2Uuc2V0VG9Mb2NhbFN0b3JhZ2UoKTtcblx0XHRcdFx0XHRcdFx0XHQkdGltZW91dChmdW5jdGlvbigpe1xuXHRcdFx0XHRcdFx0XHRcdFx0dG9hc3RyLmluZm8oSW5kZXhTZXJ2aWNlLmdldERhdGFTaXplKCkgKyAnIGxpbmVzIGltcG9ydGV0IScsICdJbmZvcm1hdGlvbicpO1xuXHRcdFx0XHRcdFx0XHRcdFx0JHN0YXRlLmdvKCdhcHAuaW5kZXguY2hlY2snKTtcblx0XHRcdFx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH07XG5cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoICdhcHAuY29udHJvbGxlcnMnICkuY29udHJvbGxlciggJ1BhcnNlY3N2Q3RybCcsIGZ1bmN0aW9uKCl7XG5cdFx0Ly9cblxuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZGlyZWN0aXZlcycpLmRpcmVjdGl2ZSggJ3BpZWNoYXJ0JywgZnVuY3Rpb24oKSB7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0cmVzdHJpY3Q6ICdFQScsXG5cdFx0XHR0ZW1wbGF0ZVVybDogJ3ZpZXdzL2RpcmVjdGl2ZXMvcGllY2hhcnQvcGllY2hhcnQuaHRtbCcsXG5cdFx0XHRjb250cm9sbGVyOiAnUGllY2hhcnRDdHJsJyxcblx0XHRcdHNjb3BlOntcblx0XHRcdFx0ZGF0YTogJz1jaGFydERhdGEnLFxuXHRcdFx0XHRhY3RpdmVUeXBlOiAnPScsXG5cdFx0XHRcdGFjdGl2ZUNvbmZsaWN0OiAnPSdcblx0XHRcdH0sXG5cdFx0XHRsaW5rOiBmdW5jdGlvbiggc2NvcGUsIGVsZW1lbnQsIGF0dHJzICl7XG5cdFx0XHRcdC8vXG5cdFx0XHRcdCBmdW5jdGlvbiBzZWdDb2xvcihjKXsgcmV0dXJuIHtpbnRlcnN0YXRlOlwiIzgwN2RiYVwiLCBpbnRyYXN0YXRlOlwiI2UwODIxNFwiLHN1YnN0YXRlOlwiIzQxYWI1ZFwifVtjXTsgfVxuXHRcdFx0XHR2YXIgcEQgPSBzY29wZS5kYXRhO1xuXHRcdFx0XHRjb25zb2xlLmxvZyhwRCk7XG5cdFx0XHRcdHZhciBwQyA9e30sICAgIHBpZURpbSA9e3c6MTUwLCBoOiAxNTB9O1xuICAgICAgICBwaWVEaW0uciA9IE1hdGgubWluKHBpZURpbS53LCBwaWVEaW0uaCkgLyAyO1xuXG5cdFx0XHRcdHZhciBwaWVzdmcgPSBkMy5zZWxlY3QoZWxlbWVudFswXSkuYXBwZW5kKFwic3ZnXCIpXG4gICAgICAgICAgICAuYXR0cihcIndpZHRoXCIsIHBpZURpbS53KS5hdHRyKFwiaGVpZ2h0XCIsIHBpZURpbS5oKVxuXHRcdFx0XHRcdFx0LmF0dHIoJ2NsYXNzJywgJ291dGVyLXBpZScpLmFwcGVuZChcImdcIilcbiAgICAgICAgICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiK3BpZURpbS53LzIrXCIsXCIrcGllRGltLmgvMitcIilcIik7XG5cdFx0XHRcdHZhciBwaWVzdmcyID0gZDMuc2VsZWN0KGVsZW1lbnRbMF0pLmFwcGVuZChcInN2Z1wiKVxuICAgICAgICAgICAgLmF0dHIoXCJ3aWR0aFwiLCBwaWVEaW0udykuYXR0cihcImhlaWdodFwiLCBwaWVEaW0uaClcblx0XHRcdFx0XHRcdC5hdHRyKCdjbGFzcycsICdpbm5lci1waWUnKVxuXHRcdFx0XHRcdFx0LmFwcGVuZChcImdcIilcbiAgICAgICAgICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiK3BpZURpbS53LzIrXCIsXCIrcGllRGltLmgvMitcIilcIik7XG5cbiAgICAgICAgLy8gY3JlYXRlIGZ1bmN0aW9uIHRvIGRyYXcgdGhlIGFyY3Mgb2YgdGhlIHBpZSBzbGljZXMuXG4gICAgICAgIHZhciBhcmMgPSBkMy5zdmcuYXJjKCkub3V0ZXJSYWRpdXMocGllRGltLnIgLSAxMCkuaW5uZXJSYWRpdXMocGllRGltLnIgLSAyMyk7XG4gICAgICAgIHZhciBhcmMyID0gZDMuc3ZnLmFyYygpLm91dGVyUmFkaXVzKHBpZURpbS5yIC0gMjMpLmlubmVyUmFkaXVzKDApO1xuXG4gICAgICAgIC8vIGNyZWF0ZSBhIGZ1bmN0aW9uIHRvIGNvbXB1dGUgdGhlIHBpZSBzbGljZSBhbmdsZXMuXG4gICAgICAgIHZhciBwaWUgPSBkMy5sYXlvdXQucGllKCkuc29ydChudWxsKS52YWx1ZShmdW5jdGlvbihkKSB7IHJldHVybiBkLmNvdW50OyB9KTtcbiAgICAgICAgdmFyIHBpZTIgPSBkMy5sYXlvdXQucGllKCkuc29ydChudWxsKS52YWx1ZShmdW5jdGlvbihkKSB7IHJldHVybiBkLmNvdW50OyB9KTtcblxuICAgICAgICAvLyBEcmF3IHRoZSBwaWUgc2xpY2VzLlxuICAgICAgICBwaWVzdmcuc2VsZWN0QWxsKFwicGF0aFwiKS5kYXRhKHBpZShwRCkpLmVudGVyKCkuYXBwZW5kKFwicGF0aFwiKS5hdHRyKFwiZFwiLCBhcmMpXG4gICAgICAgICAgICAuZWFjaChmdW5jdGlvbihkKSB7IHRoaXMuX2N1cnJlbnQgPSBkOyB9KVxuICAgICAgICAgICAgLnN0eWxlKFwiZmlsbFwiLCBmdW5jdGlvbihkKSB7IHJldHVybiBkLmRhdGEuY29sb3I7IH0pXG4gICAgICAgICAgICAub24oXCJtb3VzZW92ZXJcIixtb3VzZW92ZXIpLm9uKFwibW91c2VvdXRcIixtb3VzZW91dCk7XG5cdFx0XHRcdHBpZXN2ZzIuc2VsZWN0QWxsKFwicGF0aFwiKS5kYXRhKHBpZShwRCkpLmVudGVyKCkuYXBwZW5kKFwicGF0aFwiKS5hdHRyKFwiZFwiLCBhcmMyKVxuXHRcdCAgICAgICAgICAgIC5lYWNoKGZ1bmN0aW9uKGQpIHsgdGhpcy5fY3VycmVudCA9IGQ7IH0pXG5cdFx0ICAgICAgICAgICAgLnN0eWxlKFwiZmlsbFwiLCBmdW5jdGlvbihkKSB7IHJldHVybiBkLmRhdGEuY29sb3I7IH0pXG5cdFx0ICAgICAgICAgICAgLm9uKFwibW91c2VvdmVyXCIsbW91c2VvdmVyKS5vbihcIm1vdXNlb3V0XCIsbW91c2VvdXQpO1xuICAgICAgICAvLyBjcmVhdGUgZnVuY3Rpb24gdG8gdXBkYXRlIHBpZS1jaGFydC4gVGhpcyB3aWxsIGJlIHVzZWQgYnkgaGlzdG9ncmFtLlxuICAgICAgICBwQy51cGRhdGUgPSBmdW5jdGlvbihuRCl7XG4gICAgICAgICAgICBwaWVzdmcuc2VsZWN0QWxsKFwicGF0aFwiKS5kYXRhKHBpZShuRCkpLnRyYW5zaXRpb24oKS5kdXJhdGlvbig1MDApXG4gICAgICAgICAgICAgICAgLmF0dHJUd2VlbihcImRcIiwgYXJjVHdlZW4pO1xuICAgICAgICB9XG4gICAgICAgIC8vIFV0aWxpdHkgZnVuY3Rpb24gdG8gYmUgY2FsbGVkIG9uIG1vdXNlb3ZlciBhIHBpZSBzbGljZS5cbiAgICAgICAgZnVuY3Rpb24gbW91c2VvdmVyKGQpe1xuICAgICAgICAgICAgLy8gY2FsbCB0aGUgdXBkYXRlIGZ1bmN0aW9uIG9mIGhpc3RvZ3JhbSB3aXRoIG5ldyBkYXRhLlxuICAgICAgICAgICAgc2NvcGUuYWN0aXZlVHlwZSA9IGQuZGF0YS50eXBlO1xuXHRcdFx0XHRcdFx0c2NvcGUuJGFwcGx5KCk7XG4gICAgICAgIH1cbiAgICAgICAgLy9VdGlsaXR5IGZ1bmN0aW9uIHRvIGJlIGNhbGxlZCBvbiBtb3VzZW91dCBhIHBpZSBzbGljZS5cbiAgICAgICAgZnVuY3Rpb24gbW91c2VvdXQoZCl7XG4gICAgICAgICAgICAvLyBjYWxsIHRoZSB1cGRhdGUgZnVuY3Rpb24gb2YgaGlzdG9ncmFtIHdpdGggYWxsIGRhdGEuXG4gICAgICAgICAgICBzY29wZS5hY3RpdmVUeXBlID0gXCJcIjtcblx0XHRcdFx0XHRcdHNjb3BlLiRhcHBseSgpO1xuICAgICAgICB9XG4gICAgICAgIC8vIEFuaW1hdGluZyB0aGUgcGllLXNsaWNlIHJlcXVpcmluZyBhIGN1c3RvbSBmdW5jdGlvbiB3aGljaCBzcGVjaWZpZXNcbiAgICAgICAgLy8gaG93IHRoZSBpbnRlcm1lZGlhdGUgcGF0aHMgc2hvdWxkIGJlIGRyYXduLlxuICAgICAgICBmdW5jdGlvbiBhcmNUd2VlbihhKSB7XG4gICAgICAgICAgICB2YXIgaSA9IGQzLmludGVycG9sYXRlKHRoaXMuX2N1cnJlbnQsIGEpO1xuICAgICAgICAgICAgdGhpcy5fY3VycmVudCA9IGkoMCk7XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24odCkgeyByZXR1cm4gYXJjKGkodCkpOyAgICB9O1xuICAgICAgICB9XG5cdFx0XHR9XG5cdFx0fTtcblxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSggJ2FwcC5jb250cm9sbGVycycgKS5jb250cm9sbGVyKCAnUGllY2hhcnRDdHJsJywgZnVuY3Rpb24oKXtcblx0XHQvL1xuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmRpcmVjdGl2ZXMnKS5kaXJlY3RpdmUoJ3JvdW5kYmFyJywgZnVuY3Rpb24oKSB7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0cmVzdHJpY3Q6ICdFQScsXG5cdFx0XHQvL3RlbXBsYXRlVXJsOiAndmlld3MvZGlyZWN0aXZlcy9yb3VuZGJhci9yb3VuZGJhci5odG1sJyxcblx0XHRcdGNvbnRyb2xsZXI6ICdSb3VuZGJhckN0cmwnLFxuXHRcdFx0c2NvcGU6IHtcblx0XHRcdFx0ZGF0YTogJz1jaGFydERhdGEnLFxuXHRcdFx0XHRhY3RpdmVUeXBlOiAnPScsXG5cdFx0XHRcdGFjdGl2ZUNvbmZsaWN0OiAnPSdcblx0XHRcdH0sXG5cdFx0XHRsaW5rOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcblxuXHRcdFx0XHR2YXIgbWFyZ2luID0ge1xuXHRcdFx0XHRcdFx0dG9wOiA0MCxcblx0XHRcdFx0XHRcdHJpZ2h0OiAyMCxcblx0XHRcdFx0XHRcdGJvdHRvbTogMzAsXG5cdFx0XHRcdFx0XHRsZWZ0OiA0MFxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0d2lkdGggPSAzMDAgLSBtYXJnaW4ubGVmdCAtIG1hcmdpbi5yaWdodCxcblx0XHRcdFx0XHRoZWlnaHQgPSAyMDAgLSBtYXJnaW4udG9wIC0gbWFyZ2luLmJvdHRvbSxcblx0XHRcdFx0XHRiYXJXaWR0aCA9IDIwLFxuXHRcdFx0XHRcdHNwYWNlID0gMjU7XG5cblxuXHRcdFx0XHR2YXIgc2NhbGUgPSB7XG5cdFx0XHRcdFx0eTogZDMuc2NhbGUubGluZWFyKClcblx0XHRcdFx0fTtcblx0XHRcdFx0c2NhbGUueS5kb21haW4oWzAsIDIyMF0pO1xuXHRcdFx0XHRzY2FsZS55LnJhbmdlKFtoZWlnaHQsIDBdKTtcblx0XHRcdFx0dmFyIHN2ZyA9IGQzLnNlbGVjdChlbGVtZW50WzBdKS5hcHBlbmQoXCJzdmdcIilcblx0XHRcdFx0XHQuYXR0cihcIndpZHRoXCIsIHdpZHRoICsgbWFyZ2luLmxlZnQgKyBtYXJnaW4ucmlnaHQpXG5cdFx0XHRcdFx0LmF0dHIoXCJoZWlnaHRcIiwgaGVpZ2h0ICsgbWFyZ2luLnRvcCArIG1hcmdpbi5ib3R0b20pXG5cdFx0XHRcdFx0LmFwcGVuZChcImdcIilcblx0XHRcdFx0XHQuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZSgwLFwiICsgbWFyZ2luLnRvcCArIFwiKVwiKTtcblxuXHRcdFx0XHQvL3guZG9tYWluKHNjb3BlLmRhdGEubWFwKGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQubGV0dGVyOyB9KSk7XG5cdFx0XHRcdC8veS5kb21haW4oWzAsIGQzLm1heChzY29wZS5kYXRhLCBmdW5jdGlvbihkKSB7IHJldHVybiBkLmZyZXF1ZW5jeTsgfSldKTtcblx0XHRcdFx0dmFyIGJhcnMgPSBzdmcuc2VsZWN0QWxsKCcuYmFycycpLmRhdGEoc2NvcGUuZGF0YSkuZW50ZXIoKS5hcHBlbmQoXCJnXCIpLmF0dHIoJ2NsYXNzJywgJ2JhcnMnKTsgLy8uYXR0cihcInRyYW5zZm9ybVwiLCBmdW5jdGlvbihkLCBpKSB7IHJldHVybiBcInRyYW5zbGF0ZShcIiArIGkgKiAyMCArIFwiLCAwKVwiOyB9KTs7XG5cblx0XHRcdFx0dmFyIGJhcnNCZyA9IGJhcnNcblx0XHRcdFx0XHQuYXBwZW5kKCdwYXRoJylcblx0XHRcdFx0XHQuYXR0cignZCcsIGZ1bmN0aW9uKGQsIGkpIHtcblx0XHRcdFx0XHRcdHJldHVybiByb3VuZGVkX3JlY3QoKGkgKiAoYmFyV2lkdGggKyBzcGFjZSkpLCAwLCBiYXJXaWR0aCwgKGhlaWdodCksIGJhcldpZHRoIC8gMiwgdHJ1ZSwgdHJ1ZSwgZmFsc2UsIGZhbHNlKVxuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0LmF0dHIoJ2NsYXNzJywgJ2JnJyk7XG5cdFx0XHRcdHZhciB2YWx1ZUJhcnMgPSBiYXJzXG5cdFx0XHRcdFx0LmFwcGVuZCgncGF0aCcpXG5cdFx0XHRcdFx0LmF0dHIoJ2QnLCBmdW5jdGlvbihkLCBpKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gcm91bmRlZF9yZWN0KChpICogKGJhcldpZHRoICsgc3BhY2UpKSwgKHNjYWxlLnkoZC52YWx1ZSkpLCBiYXJXaWR0aCwgKGhlaWdodCAtIHNjYWxlLnkoZC52YWx1ZSkpLCBiYXJXaWR0aCAvIDIsIHRydWUsIHRydWUsIGZhbHNlLCBmYWxzZSlcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC8qLmF0dHIoJ3gnLCBmdW5jdGlvbihkLCBpKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gaSAqIChiYXJXaWR0aCArIHNwYWNlKTtcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC5hdHRyKCd5JywgZnVuY3Rpb24oZCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIHNjYWxlLnkoZC52YWx1ZSk7XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQuYXR0cihcIndpZHRoXCIsIGZ1bmN0aW9uKGQpIHtcblx0XHRcdFx0XHRcdHJldHVybiBiYXJXaWR0aFxuXHRcdFx0XHRcdH0pKi9cblxuXHRcdFx0XHQuc3R5bGUoXCJmaWxsXCIsIGZ1bmN0aW9uKGQpIHtcblx0XHRcdFx0XHRcdHJldHVybiBkLmNvbG9yXG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQvKi50cmFuc2l0aW9uKClcblx0XHRcdFx0XHQuZHVyYXRpb24oMzAwMClcblx0XHRcdFx0XHQuZWFzZShcInF1YWRcIilcblx0XHRcdFx0XHQuYXR0cihcImhlaWdodFwiLCBmdW5jdGlvbihkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gaGVpZ2h0IC0gc2NhbGUueShkLnZhbHVlKVxuXHRcdFx0XHRcdH0pKi9cblx0XHRcdFx0O1xuXG5cdFx0XHRcdHZhciB2YWx1ZVRleHQgPSBiYXJzXG5cdFx0XHRcdFx0LmFwcGVuZChcInRleHRcIik7XG5cblx0XHRcdFx0dmFsdWVUZXh0LnRleHQoZnVuY3Rpb24oZCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGQudmFsdWVcblx0XHRcdFx0XHR9KS5hdHRyKFwieFwiLCBmdW5jdGlvbihkLCBpKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gaSAqIChiYXJXaWR0aCArIHNwYWNlKTtcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC5hdHRyKFwieVwiLCAtOClcblx0XHRcdFx0XHQuYXR0cihcIndpZHRoXCIsIGZ1bmN0aW9uKGQpIHtcblx0XHRcdFx0XHRcdHJldHVybiBiYXJXaWR0aFxuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0LnN0eWxlKCdmaWxsJywnIzRmYjBlNScpO1xuXG5cdFx0XHRcdHZhciBsYWJlbHNUZXh0ID0gYmFyc1xuXHRcdFx0XHRcdC5hcHBlbmQoXCJ0ZXh0XCIpXG5cdFx0XHRcdGxhYmVsc1RleHQudGV4dChmdW5jdGlvbihkKXtcblx0XHRcdFx0XHRcdHJldHVybiBkLmxhYmVsXG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQuYXR0cihcInhcIiwgZnVuY3Rpb24oZCwgaSkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGkgKiAoYmFyV2lkdGggKyBzcGFjZSk7XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQuYXR0cihcInlcIiwgaGVpZ2h0ICsgMjApXG5cdFx0XHRcdFx0LmF0dHIoXCJ3aWR0aFwiLCBmdW5jdGlvbihkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gYmFyV2lkdGhcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC5zdHlsZSgnZmlsbCcsIGZ1bmN0aW9uKGQpe1xuXHRcdFx0XHRcdFx0cmV0dXJuIGQuY29sb3Jcblx0XHRcdFx0XHR9KTtcblxuXG5cdFx0XHRcdGZ1bmN0aW9uIHJvdW5kZWRfcmVjdCh4LCB5LCB3LCBoLCByLCB0bCwgdHIsIGJsLCBicikge1xuXHRcdFx0XHRcdHZhciByZXR2YWw7XG5cdFx0XHRcdFx0cmV0dmFsID0gXCJNXCIgKyAoeCArIHIpICsgXCIsXCIgKyB5O1xuXHRcdFx0XHRcdHJldHZhbCArPSBcImhcIiArICh3IC0gMiAqIHIpO1xuXHRcdFx0XHRcdGlmICh0cikge1xuXHRcdFx0XHRcdFx0cmV0dmFsICs9IFwiYVwiICsgciArIFwiLFwiICsgciArIFwiIDAgMCAxIFwiICsgciArIFwiLFwiICsgcjtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0cmV0dmFsICs9IFwiaFwiICsgcjtcblx0XHRcdFx0XHRcdHJldHZhbCArPSBcInZcIiArIHI7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHJldHZhbCArPSBcInZcIiArIChoIC0gMiAqIHIpO1xuXHRcdFx0XHRcdGlmIChicikge1xuXHRcdFx0XHRcdFx0cmV0dmFsICs9IFwiYVwiICsgciArIFwiLFwiICsgciArIFwiIDAgMCAxIFwiICsgLXIgKyBcIixcIiArIHI7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHJldHZhbCArPSBcInZcIiArIHI7XG5cdFx0XHRcdFx0XHRyZXR2YWwgKz0gXCJoXCIgKyAtcjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmV0dmFsICs9IFwiaFwiICsgKDIgKiByIC0gdyk7XG5cdFx0XHRcdFx0aWYgKGJsKSB7XG5cdFx0XHRcdFx0XHRyZXR2YWwgKz0gXCJhXCIgKyByICsgXCIsXCIgKyByICsgXCIgMCAwIDEgXCIgKyAtciArIFwiLFwiICsgLXI7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHJldHZhbCArPSBcImhcIiArIC1yO1xuXHRcdFx0XHRcdFx0cmV0dmFsICs9IFwidlwiICsgLXI7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHJldHZhbCArPSBcInZcIiArICgyICogciAtIGgpO1xuXHRcdFx0XHRcdGlmICh0bCkge1xuXHRcdFx0XHRcdFx0cmV0dmFsICs9IFwiYVwiICsgciArIFwiLFwiICsgciArIFwiIDAgMCAxIFwiICsgciArIFwiLFwiICsgLXI7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHJldHZhbCArPSBcInZcIiArIC1yO1xuXHRcdFx0XHRcdFx0cmV0dmFsICs9IFwiaFwiICsgcjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmV0dmFsICs9IFwielwiO1xuXHRcdFx0XHRcdHJldHVybiByZXR2YWw7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9O1xuXG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCAnYXBwLmNvbnRyb2xsZXJzJyApLmNvbnRyb2xsZXIoICdSb3VuZGJhckN0cmwnLCBmdW5jdGlvbigpe1xuXHRcdC8vXG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5kaXJlY3RpdmVzJykuZGlyZWN0aXZlKCAnc2ltcGxlbGluZWNoYXJ0JywgZnVuY3Rpb24oKSB7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0cmVzdHJpY3Q6ICdFJyxcblx0XHRcdHNjb3BlOnt9LFxuXHRcdFx0dGVtcGxhdGVVcmw6ICd2aWV3cy9kaXJlY3RpdmVzL3NpbXBsZWxpbmVjaGFydC9zaW1wbGVsaW5lY2hhcnQuaHRtbCcsXG5cdFx0XHRjb250cm9sbGVyOiAnU2ltcGxlbGluZWNoYXJ0Q3RybCcsXG5cdFx0XHRjb250cm9sbGVyQXM6ICd2bScsXG5cdFx0XHRzY29wZTp7fSxcblx0XHRcdGJpbmRUb0NvbnRyb2xsZXI6IHtcblx0XHRcdFx0ZGF0YTonPScsXG5cdFx0XHRcdHNlbGVjdGlvbjonPScsXG5cdFx0XHRcdG9wdGlvbnM6Jz0nXG5cdFx0XHR9LFxuXHRcdFx0bGluazogZnVuY3Rpb24oICRzY29wZSwgZWxlbWVudCwgJGF0dHJzICl7XG5cdFx0XHRcblxuXHRcdFx0fVxuXHRcdH07XG5cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignU2ltcGxlbGluZWNoYXJ0Q3RybCcsIGZ1bmN0aW9uICgkc2NvcGUpIHtcblx0XHR2YXIgdm0gPSB0aGlzO1xuXHRcdHZhciBkZWZhdWx0cyA9IGZ1bmN0aW9uKCl7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRpbnZlcnQ6ZmFsc2Vcblx0XHRcdH1cblx0XHR9XG5cdFx0dm0ub3B0aW9ucyA9IGFuZ3VsYXIuZXh0ZW5kKGRlZmF1bHRzKCksIHZtLm9wdGlvbnMpO1xuXHRcdHZtLmNvbmZpZyA9IHtcblx0XHRcdHZpc2libGU6IHRydWUsIC8vIGRlZmF1bHQ6IHRydWVcblx0XHRcdGV4dGVuZGVkOiBmYWxzZSwgLy8gZGVmYXVsdDogZmFsc2Vcblx0XHRcdGRpc2FibGVkOiBmYWxzZSwgLy8gZGVmYXVsdDogZmFsc2Vcblx0XHRcdGF1dG9yZWZyZXNoOiB0cnVlLCAvLyBkZWZhdWx0OiB0cnVlXG5cdFx0XHRyZWZyZXNoRGF0YU9ubHk6IGZhbHNlLCAvLyBkZWZhdWx0OiBmYWxzZVxuXHRcdFx0ZGVlcFdhdGNoT3B0aW9uczogdHJ1ZSwgLy8gZGVmYXVsdDogdHJ1ZVxuXHRcdFx0ZGVlcFdhdGNoRGF0YTogdHJ1ZSwgLy8gZGVmYXVsdDogZmFsc2Vcblx0XHRcdGRlZXBXYXRjaENvbmZpZzogdHJ1ZSwgLy8gZGVmYXVsdDogdHJ1ZVxuXHRcdFx0ZGVib3VuY2U6IDEwIC8vIGRlZmF1bHQ6IDEwXG5cdFx0fTtcblx0XHR2bS5jaGFydCA9IHtcblx0XHRcdG9wdGlvbnM6IHtcblx0XHRcdFx0Y2hhcnQ6IHt9XG5cdFx0XHR9LFxuXHRcdFx0ZGF0YTogW11cblx0XHR9O1xuXG5cdFx0YWN0aXZhdGUoKTtcblxuXHRcdGZ1bmN0aW9uIGFjdGl2YXRlKCl7XG5cdFx0XHRjYWxjdWxhdGVHcmFwaCgpO1xuXHRcdFx0c2V0Q2hhcnQoKTtcblx0XHR9XG5cdFx0ZnVuY3Rpb24gdXBkYXRlQ2hhcnQoKXtcblx0XHRcdHZtLmNoYXJ0Lm9wdGlvbnMuY2hhcnQuZm9yY2VZID0gW3ZtLnJhbmdlLm1heCwgdm0ucmFuZ2UubWluXTtcblx0XHR9XG5cdCBcdGZ1bmN0aW9uIHNldENoYXJ0KCkge1xuXHRcdFx0dm0uY2hhcnQub3B0aW9ucy5jaGFydCA9IHtcblx0XHRcdFx0dHlwZTogJ2xpbmVDaGFydCcsXG5cdFx0XHRcdGxlZ2VuZFBvc2l0aW9uOiAnbGVmdCcsXG5cdFx0XHRcdGR1cmF0aW9uOjEwMCxcblx0XHRcdFx0bWFyZ2luOiB7XG5cdFx0XHRcdFx0dG9wOiAyMCxcblx0XHRcdFx0XHRyaWdodDogMjAsXG5cdFx0XHRcdFx0Ym90dG9tOiAyMCxcblx0XHRcdFx0XHRsZWZ0OiAyMFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR4OiBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdHJldHVybiBkLng7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdHk6IGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGQueTtcblx0XHRcdFx0fSxcblx0XHRcdFx0c2hvd0xlZ2VuZDogZmFsc2UsXG5cdFx0XHRcdHNob3dWYWx1ZXM6IGZhbHNlLFxuXHRcdFx0XHQvL3Nob3dZQXhpczogZmFsc2UsXG5cblx0XHRcdFx0dHJhbnNpdGlvbkR1cmF0aW9uOiA1MDAsXG5cdFx0XHRcdC8vdXNlSW50ZXJhY3RpdmVHdWlkZWxpbmU6IHRydWUsXG5cdFx0XHRcdGZvcmNlWTogW3ZtLnJhbmdlLm1heCwgdm0ucmFuZ2UubWluXSxcblx0XHRcdFx0Ly95RG9tYWluOltwYXJzZUludCh2bS5yYW5nZS5taW4pLCB2bS5yYW5nZS5tYXhdLFxuXHRcdFx0XHR4QXhpczoge1xuXHRcdFx0XHRcdGF4aXNMYWJlbDogJ1llYXInLFxuXHRcdFx0XHRcdGF4aXNMYWJlbERpc3RhbmNlOiAzMFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR5QXhpczoge1xuXHRcdFx0XHRcdGF4aXNMYWJlbDogJycsXG5cdFx0XHRcdFx0YXhpc0xhYmVsRGlzdGFuY2U6IDMwXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGxlZ2VuZDoge1xuXHRcdFx0XHRcdHJpZ2h0QWxpZ246IGZhbHNlXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGxpbmVzOiB7XG5cdFx0XHRcdFx0aW50ZXJwb2xhdGU6ICdjYXJkaW5hbCdcblx0XHRcdFx0fVxuXG5cdFx0XHR9O1xuXG5cdFx0XHRpZiAodm0ub3B0aW9ucy5pbnZlcnQgPT0gdHJ1ZSkge1xuXHRcdFx0XHR2bS5jaGFydC5vcHRpb25zLmNoYXJ0LmZvcmNlWSA9IFtwYXJzZUludCh2bS5yYW5nZS5tYXgpLCB2bS5yYW5nZS5taW5dO1xuXHRcdFx0fVxuXHRcdFx0Y29uc29sZS5sb2codm0uY2hhcnQpXG5cdFx0XHRyZXR1cm4gdm0uY2hhcnQ7XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIGNhbGN1bGF0ZUdyYXBoKCkge1xuXHRcdFx0dmFyIGNoYXJ0RGF0YSA9IFtdO1xuXHRcdFx0dm0ucmFuZ2UgPSB7XG5cdFx0XHRcdG1heDogMCxcblx0XHRcdFx0bWluOiAxMDAwXG5cdFx0XHR9O1xuXG5cdFx0XHRhbmd1bGFyLmZvckVhY2godm0uc2VsZWN0aW9uLCBmdW5jdGlvbiAoaXRlbSwga2V5KSB7XG5cdFx0XHRcdHZhciBncmFwaCA9IHtcblx0XHRcdFx0XHRpZDoga2V5LFxuXHRcdFx0XHRcdGtleTogaXRlbS50aXRsZSxcblx0XHRcdFx0XHRjb2xvcjogaXRlbS5jb2xvcixcblx0XHRcdFx0XHR2YWx1ZXM6IFtdXG5cdFx0XHRcdH07XG5cdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5kYXRhLCBmdW5jdGlvbiAoZGF0YSwgaykge1xuXHRcdFx0XHRcdGdyYXBoLnZhbHVlcy5wdXNoKHtcblx0XHRcdFx0XHRcdGlkOiBrLFxuXHRcdFx0XHRcdFx0eDogZGF0YVtpdGVtLmZpZWxkcy54XSxcblx0XHRcdFx0XHRcdHk6IGRhdGFbaXRlbS5maWVsZHMueV1cblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR2bS5yYW5nZS5tYXggPSBNYXRoLm1heCh2bS5yYW5nZS5tYXgsIGRhdGFbaXRlbS5maWVsZHMueV0pO1xuXHRcdFx0XHRcdHZtLnJhbmdlLm1pbiA9IE1hdGgubWluKHZtLnJhbmdlLm1pbiwgZGF0YVtpdGVtLmZpZWxkcy55XSk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRjaGFydERhdGEucHVzaChncmFwaCk7XG5cdFx0XHR9KTtcblx0XHRcdHZtLnJhbmdlLm1heCsrO1xuXHRcdFx0dm0ucmFuZ2UubWluLS07XG5cdFx0XHR2bS5jaGFydC5kYXRhID0gY2hhcnREYXRhO1xuXHRcdFx0aWYgKHZtLm9wdGlvbnMuaW52ZXJ0ID09IFwidHJ1ZVwiKSB7XG5cdFx0XHRcdHZtLmNoYXJ0Lm9wdGlvbnMuY2hhcnQueURvbWFpbiA9IFtwYXJzZUludCh2bS5yYW5nZS5tYXgpLCB2bS5yYW5nZS5taW5dO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGNoYXJ0RGF0YTtcblx0XHR9O1xuXHRcdCRzY29wZS4kd2F0Y2goJ3ZtLmRhdGEnLCBmdW5jdGlvbiAobiwgbykge1xuXHRcdFx0aWYgKCFuKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHRcdGNhbGN1bGF0ZUdyYXBoKCk7XG5cdFx0XHR1cGRhdGVDaGFydCgpO1xuXG5cdFx0fSk7XG5cdFx0JHNjb3BlLiR3YXRjaCgndm0uc2VsZWN0aW9uJywgZnVuY3Rpb24gKG4sIG8pIHtcblx0XHRcdGlmIChuID09PSBvKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHQvL1x0dXBkYXRlQ2hhcnQoKTtcblx0XHRcdC8vY2FsY3VsYXRlR3JhcGgoKTtcblx0XHR9KVxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmRpcmVjdGl2ZXMnKS5hbmltYXRpb24oJy5zbGlkZS10b2dnbGUnLCBbJyRhbmltYXRlQ3NzJywgZnVuY3Rpb24oJGFuaW1hdGVDc3MpIHtcblxuXHRcdHZhciBsYXN0SWQgPSAwO1xuICAgICAgICB2YXIgX2NhY2hlID0ge307XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0SWQoZWwpIHtcbiAgICAgICAgICAgIHZhciBpZCA9IGVsWzBdLmdldEF0dHJpYnV0ZShcImRhdGEtc2xpZGUtdG9nZ2xlXCIpO1xuICAgICAgICAgICAgaWYgKCFpZCkge1xuICAgICAgICAgICAgICAgIGlkID0gKytsYXN0SWQ7XG4gICAgICAgICAgICAgICAgZWxbMF0uc2V0QXR0cmlidXRlKFwiZGF0YS1zbGlkZS10b2dnbGVcIiwgaWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGlkO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGdldFN0YXRlKGlkKSB7XG4gICAgICAgICAgICB2YXIgc3RhdGUgPSBfY2FjaGVbaWRdO1xuICAgICAgICAgICAgaWYgKCFzdGF0ZSkge1xuICAgICAgICAgICAgICAgIHN0YXRlID0ge307XG4gICAgICAgICAgICAgICAgX2NhY2hlW2lkXSA9IHN0YXRlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZ2VuZXJhdGVSdW5uZXIoY2xvc2luZywgc3RhdGUsIGFuaW1hdG9yLCBlbGVtZW50LCBkb25lRm4pIHtcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBzdGF0ZS5hbmltYXRpbmcgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHN0YXRlLmFuaW1hdG9yID0gYW5pbWF0b3I7XG4gICAgICAgICAgICAgICAgc3RhdGUuZG9uZUZuID0gZG9uZUZuO1xuICAgICAgICAgICAgICAgIGFuaW1hdG9yLnN0YXJ0KCkuZmluYWxseShmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNsb3NpbmcgJiYgc3RhdGUuZG9uZUZuID09PSBkb25lRm4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnRbMF0uc3R5bGUuaGVpZ2h0ID0gJyc7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgc3RhdGUuYW5pbWF0aW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIHN0YXRlLmFuaW1hdG9yID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgICAgICBzdGF0ZS5kb25lRm4oKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBsZWF2ZTogZnVuY3Rpb24oZWxlbWVudCwgZG9uZUZuKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIHN0YXRlID0gZ2V0U3RhdGUoZ2V0SWQoZWxlbWVudCkpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgaGVpZ2h0ID0gKHN0YXRlLmFuaW1hdGluZyAmJiBzdGF0ZS5oZWlnaHQpID9cbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlLmhlaWdodCA6IGVsZW1lbnRbMF0ub2Zmc2V0SGVpZ2h0O1xuICAgICAgICAgICAgICAgICAgICB2YXIgYW5pbWF0b3IgPSAkYW5pbWF0ZUNzcyhlbGVtZW50LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmcm9tOiB7aGVpZ2h0OiBoZWlnaHQgKyAncHgnLCBvcGFjaXR5OiAxfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvOiB7aGVpZ2h0OiAnMHB4Jywgb3BhY2l0eTogMH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChhbmltYXRvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN0YXRlLmFuaW1hdGluZykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlLmRvbmVGbiA9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZW5lcmF0ZVJ1bm5lcih0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbmltYXRvcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkb25lRm4pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBzdGF0ZS5hbmltYXRvci5lbmQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlLmhlaWdodCA9IGhlaWdodDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZ2VuZXJhdGVSdW5uZXIodHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuaW1hdG9yLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkb25lRm4pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGRvbmVGbigpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGVudGVyOiBmdW5jdGlvbihlbGVtZW50LCBkb25lRm4pIHtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgc3RhdGUgPSBnZXRTdGF0ZShnZXRJZChlbGVtZW50KSk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBoZWlnaHQgPSAoc3RhdGUuYW5pbWF0aW5nICYmIHN0YXRlLmhlaWdodCkgP1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGUuaGVpZ2h0IDogZWxlbWVudFswXS5vZmZzZXRIZWlnaHQ7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGFuaW1hdG9yID0gJGFuaW1hdGVDc3MoZWxlbWVudCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgZnJvbToge2hlaWdodDogJzBweCcsIG9wYWNpdHk6IDB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgdG86IHtoZWlnaHQ6IGhlaWdodCArICdweCcsIG9wYWNpdHk6IDF9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBpZiAoYW5pbWF0b3IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzdGF0ZS5hbmltYXRpbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZS5kb25lRm4gPSBnZW5lcmF0ZVJ1bm5lcihmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbmltYXRvcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvbmVGbik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHN0YXRlLmFuaW1hdG9yLmVuZCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGUuaGVpZ2h0ID0gaGVpZ2h0O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBnZW5lcmF0ZVJ1bm5lcihmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuaW1hdG9yLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkb25lRm4pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGRvbmVGbigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1dKTtcbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoICdhcHAuY29udHJvbGxlcnMnICkuY29udHJvbGxlciggJ1NsaWRlVG9nZ2xlQ3RybCcsIGZ1bmN0aW9uKCl7XG5cdFx0Ly9cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmRpcmVjdGl2ZXMnKS5kaXJlY3RpdmUoICdzdHlsZXMnLCBmdW5jdGlvbigpIHtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRyZXN0cmljdDogJ0UnLFxuXHRcdFx0dGVtcGxhdGVVcmw6ICd2aWV3cy9kaXJlY3RpdmVzL3N0eWxlcy9zdHlsZXMuaHRtbCcsXG5cdFx0XHRjb250cm9sbGVyOiAnU3R5bGVzQ3RybCcsXG5cdFx0XHRjb250cm9sbGVyQXM6ICd2bScsXG5cdFx0XHRzY29wZTp7fSxcblx0XHRcdGJpbmRUb0NvbnRyb2xsZXI6IHtcblx0XHRcdFx0aXRlbTogJz0nLFxuXHRcdFx0XHRzdHlsZXM6ICc9Jyxcblx0XHRcdFx0b3B0aW9uczonPScsXG5cdFx0XHRcdHNhdmU6ICcmJ1xuXHRcdFx0fSxcblx0XHRcdHJlcGxhY2U6dHJ1ZSxcblx0XHRcdGxpbms6IGZ1bmN0aW9uKCBzY29wZSwgZWxlbWVudCwgYXR0cnMgKXtcblx0XHRcdFx0Ly9cblx0XHRcdH1cblx0XHR9O1xuXG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ1N0eWxlc0N0cmwnLCBmdW5jdGlvbiAodG9hc3RyLCBEYXRhU2VydmljZSkge1xuXHRcdC8vXG5cdFx0dmFyIHZtID0gdGhpcztcblx0XHR2bS50b2dnbGVTdHlsZSA9IHRvZ2dsZVN0eWxlO1xuXHRcdHZtLnNlbGVjdGVkU3R5bGUgPSBzZWxlY3RlZFN0eWxlO1xuXHRcdHZtLnNhdmVTdHlsZSA9IHNhdmVTdHlsZTtcblx0XHR2bS5zdHlsZSA9IFtdO1xuXG5cdFx0ZnVuY3Rpb24gdG9nZ2xlU3R5bGUoc3R5bGUpIHtcblx0XHRcdGlmICh2bS5pdGVtLnN0eWxlX2lkID09IHN0eWxlLmlkKSB7XG5cdFx0XHRcdHZtLml0ZW0uc3R5bGVfaWQgPSAwO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dm0uaXRlbS5zdHlsZV9pZCA9IHN0eWxlLmlkXG5cdFx0XHRcdHZtLml0ZW0uc3R5bGUgPSBzdHlsZTtcblx0XHRcdH1cblx0XHR9XG5cdFx0ZnVuY3Rpb24gc2VsZWN0ZWRTdHlsZShpdGVtLCBzdHlsZSkge1xuXHRcdFx0cmV0dXJuIHZtLml0ZW0uc3R5bGVfaWQgPT0gc3R5bGUuaWQgPyB0cnVlIDogZmFsc2U7XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIHNhdmVTdHlsZSgpIHtcblx0XHRcdERhdGFTZXJ2aWNlLnBvc3QoJ3N0eWxlcycsIHZtLnN0eWxlKS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG5cdFx0XHRcdHZtLnN0eWxlcy5wdXNoKGRhdGEpO1xuXHRcdFx0XHR2bS5jcmVhdGVTdHlsZSA9IGZhbHNlO1xuXHRcdFx0XHRcdHZtLnN0eWxlID0gW107XG5cdFx0XHRcdHZtLml0ZW0uc3R5bGUgPSBkYXRhO1xuXHRcdFx0XHR0b2FzdHIuc3VjY2VzcygnTmV3IFN0eWxlIGhhcyBiZWVuIHNhdmVkJywgJ1N1Y2Nlc3MnKTtcblx0XHRcdH0pO1xuXHRcdH1cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmRpcmVjdGl2ZXMnKS5kaXJlY3RpdmUoJ3N1YmluZGV4Jywgc3ViaW5kZXgpO1xuXG5cdHN1YmluZGV4LiRpbmplY3QgPSBbJyR0aW1lb3V0JywgJ3Ntb290aFNjcm9sbCddO1xuXG5cdGZ1bmN0aW9uIHN1YmluZGV4KCR0aW1lb3V0LCBzbW9vdGhTY3JvbGwpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0cmVzdHJpY3Q6ICdFJyxcblx0XHRcdHJlcGxhY2U6IHRydWUsXG5cdFx0XHRjb250cm9sbGVyOiAnU3ViaW5kZXhDdHJsJyxcblx0XHRcdHRlbXBsYXRlVXJsOiAndmlld3MvZGlyZWN0aXZlcy9zdWJpbmRleC9zdWJpbmRleC5odG1sJyxcblx0XHRcdGxpbms6IHN1YmluZGV4TGlua0Z1bmN0aW9uXG5cdFx0fTtcblxuXHRcdGZ1bmN0aW9uIHN1YmluZGV4TGlua0Z1bmN0aW9uKCRzY29wZSwgZWxlbWVudCwgJGF0dHJzKSB7XG5cdFx0fVxuXHR9XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignU3ViaW5kZXhDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCAkZmlsdGVyLCAkdGltZW91dCkge1xuXHRcdCRzY29wZS5pbmZvID0gZmFsc2U7XG5cdFx0JHNjb3BlLnNldENoYXJ0ID0gc2V0Q2hhcnQ7XG5cdFx0JHNjb3BlLmNhbGN1bGF0ZUdyYXBoID0gY2FsY3VsYXRlR3JhcGg7XG5cdFx0JHNjb3BlLmNyZWF0ZUluZGV4ZXIgPSBjcmVhdGVJbmRleGVyO1xuXHRcdCRzY29wZS5jYWxjU3ViUmFuayA9IGNhbGNTdWJSYW5rO1xuXHRcdCRzY29wZS50b2dnbGVJbmZvID0gdG9nZ2xlSW5mbztcblx0XHQkc2NvcGUuY3JlYXRlT3B0aW9ucyA9IGNyZWF0ZU9wdGlvbnM7XG5cdFx0JHNjb3BlLmdldFN1YlJhbmsgPSBnZXRTdWJSYW5rO1xuXHRcdGFjdGl2YXRlKCk7XG5cblx0XHRmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcblx0XHRcdCRzY29wZS5jYWxjU3ViUmFuaygpO1xuXHRcdFx0JHNjb3BlLnNldENoYXJ0KCk7XG5cdFx0XHQkc2NvcGUuY2FsY3VsYXRlR3JhcGgoKTtcblx0XHRcdCRzY29wZS5jcmVhdGVJbmRleGVyKCk7XG5cdFx0XHQkc2NvcGUuY3JlYXRlT3B0aW9ucygpO1xuXHRcdFx0JHNjb3BlLiR3YXRjaCgnZGlzcGxheS5zZWxlY3RlZENhdCcsIGZ1bmN0aW9uKG5ld0l0ZW0sIG9sZEl0ZW0pIHtcblx0XHRcdFx0aWYgKG5ld0l0ZW0gPT09IG9sZEl0ZW0pIHtcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdH1cblx0XHRcdFx0JHNjb3BlLmNyZWF0ZUluZGV4ZXIoKTtcblx0XHRcdFx0JHNjb3BlLmNhbGN1bGF0ZUdyYXBoKCk7XG5cdFx0XHRcdCRzY29wZS5jcmVhdGVPcHRpb25zKCk7XG5cdFx0XHRcdCRzY29wZS5jYWxjU3ViUmFuaygpO1xuXHRcdFx0fSk7XG5cdFx0XHQkc2NvcGUuJHdhdGNoKCdjdXJyZW50JywgZnVuY3Rpb24obiwgbykge1xuXHRcdFx0XHRpZiAobiA9PT0gbykge1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXHRcdFx0XHQkc2NvcGUuY2FsY1N1YlJhbmsoKTtcblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIHRvZ2dsZUluZm8oKSB7XG5cdFx0XHQkc2NvcGUuaW5mbyA9ICEkc2NvcGUuaW5mbztcblx0XHR9O1xuXG5cdFx0ZnVuY3Rpb24gY2FsY1N1YlJhbmsoKSB7XG5cdFx0XHR2YXIgcmFuayA9IDA7XG5cdFx0XHRhbmd1bGFyLmZvckVhY2goJHNjb3BlLmRhdGEsIGZ1bmN0aW9uKGl0ZW0pIHtcblx0XHRcdFx0aXRlbVskc2NvcGUuZGlzcGxheS5zZWxlY3RlZENhdC50eXBlXSA9IHBhcnNlRmxvYXQoaXRlbVskc2NvcGUuZGlzcGxheS5zZWxlY3RlZENhdC50eXBlXSk7XG5cdFx0XHRcdGl0ZW1bJ3Njb3JlJ10gPSBwYXJzZUludChpdGVtWydzY29yZSddKTtcblx0XHRcdH0pXG5cdFx0XHR2YXIgZmlsdGVyID0gJGZpbHRlcignb3JkZXJCeScpKCRzY29wZS5lcGksIFskc2NvcGUuZGlzcGxheS5zZWxlY3RlZENhdC50eXBlLCBcInNjb3JlXCJdLCB0cnVlKTtcblx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgZmlsdGVyLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdGlmIChmaWx0ZXJbaV0uaXNvID09ICRzY29wZS5jdXJyZW50Lmlzbykge1xuXHRcdFx0XHRcdHJhbmsgPSBpICsgMTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0JHNjb3BlLmN1cnJlbnRbJHNjb3BlLmRpc3BsYXkuc2VsZWN0ZWRDYXQudHlwZSsnX3JhbmsnXSA9IHJhbms7XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIGdldFN1YlJhbmsoY291bnRyeSl7XG5cdFx0XHR2YXIgZmlsdGVyID0gJGZpbHRlcignb3JkZXJCeScpKCRzY29wZS5lcGksIFskc2NvcGUuZGlzcGxheS5zZWxlY3RlZENhdC50eXBlLCBcInNjb3JlXCJdLCB0cnVlKTtcblx0XHRcdHZhciByYW5rID0gMDtcblx0XHRcdGFuZ3VsYXIuZm9yRWFjaChmaWx0ZXIsIGZ1bmN0aW9uKGl0ZW0sIGtleSl7XG5cdFx0XHRcdGlmKGl0ZW0uY291bnRyeSA9PSBjb3VudHJ5LmNvdW50cnkpe1xuXHRcdFx0XHRcdHJhbmsgPSBrZXk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdFx0cmV0dXJuIHJhbmsrMTtcblx0XHR9XG5cdFx0ZnVuY3Rpb24gY3JlYXRlSW5kZXhlcigpIHtcblx0XHRcdCRzY29wZS5pbmRleGVyID0gWyRzY29wZS4kcGFyZW50LmRpc3BsYXkuc2VsZWN0ZWRDYXQuZGF0YV07XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gY3JlYXRlT3B0aW9ucygpIHtcblx0XHRcdCRzY29wZS5tZWRpYW5PcHRpb25zID0ge1xuXHRcdFx0XHRjb2xvcjogJHNjb3BlLiRwYXJlbnQuZGlzcGxheS5zZWxlY3RlZENhdC5jb2xvcixcblx0XHRcdFx0ZmllbGQ6ICRzY29wZS4kcGFyZW50LmRpc3BsYXkuc2VsZWN0ZWRDYXQudHlwZSxcblx0XHRcdFx0aGFuZGxpbmc6IGZhbHNlLFxuXHRcdFx0XHRtYXJnaW46e1xuXHRcdFx0XHRcdGxlZnQ6MTBcblx0XHRcdFx0fVxuXHRcdFx0fTtcblx0XHRcdCRzY29wZS5tZWRpYW5PcHRpb25zQmlnID0ge1xuXHRcdFx0XHRjb2xvcjogJHNjb3BlLiRwYXJlbnQuZGlzcGxheS5zZWxlY3RlZENhdC5jb2xvcixcblx0XHRcdFx0ZmllbGQ6ICRzY29wZS4kcGFyZW50LmRpc3BsYXkuc2VsZWN0ZWRDYXQudHlwZSxcblx0XHRcdFx0aGFuZGxpbmc6IGZhbHNlLFxuXHRcdFx0XHRtYXJnaW46e1xuXHRcdFx0XHRcdGxlZnQ6MjBcblx0XHRcdFx0fVxuXHRcdFx0fTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBzZXRDaGFydCgpIHtcblx0XHRcdCRzY29wZS5jaGFydCA9IHtcblx0XHRcdFx0b3B0aW9uczoge1xuXHRcdFx0XHRcdGNoYXJ0OiB7XG5cdFx0XHRcdFx0XHR0eXBlOiAnbGluZUNoYXJ0Jyxcblx0XHRcdFx0XHRcdC8vaGVpZ2h0OiAyMDAsXG5cdFx0XHRcdFx0XHRsZWdlbmRQb3NpdGlvbjogJ2xlZnQnLFxuXHRcdFx0XHRcdFx0bWFyZ2luOiB7XG5cdFx0XHRcdFx0XHRcdHRvcDogMjAsXG5cdFx0XHRcdFx0XHRcdHJpZ2h0OiAyMCxcblx0XHRcdFx0XHRcdFx0Ym90dG9tOiAyMCxcblx0XHRcdFx0XHRcdFx0bGVmdDogMjBcblx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHR4OiBmdW5jdGlvbihkKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBkLng7XG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0eTogZnVuY3Rpb24oZCkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gZC55O1xuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdHNob3dWYWx1ZXM6IGZhbHNlLFxuXHRcdFx0XHRcdFx0c2hvd1lBeGlzOiBmYWxzZSxcblx0XHRcdFx0XHRcdHRyYW5zaXRpb25EdXJhdGlvbjogNTAwLFxuXHRcdFx0XHRcdFx0dXNlSW50ZXJhY3RpdmVHdWlkZWxpbmU6IHRydWUsXG5cdFx0XHRcdFx0XHRmb3JjZVk6IFsxMDAsIDBdLFxuXHRcdFx0XHRcdFx0eEF4aXM6IHtcblx0XHRcdFx0XHRcdFx0YXhpc0xhYmVsOiAnJ1xuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdHlBeGlzOiB7XG5cdFx0XHRcdFx0XHRcdGF4aXNMYWJlbDogJycsXG5cdFx0XHRcdFx0XHRcdGF4aXNMYWJlbERpc3RhbmNlOiAzMFxuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdGxlZ2VuZDoge1xuXHRcdFx0XHRcdFx0XHRyaWdodEFsaWduOiBmYWxzZSxcblx0XHRcdFx0XHRcdFx0bWFyZ2luOiB7XG5cdFx0XHRcdFx0XHRcdFx0Ym90dG9tOiAzMFxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0bGluZXM6IHtcblx0XHRcdFx0XHRcdFx0aW50ZXJwb2xhdGU6ICdjYXJkaW5hbCdcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sXG5cdFx0XHRcdGRhdGE6IFtdXG5cdFx0XHR9O1xuXHRcdFx0cmV0dXJuICRzY29wZS5jaGFydDtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBjYWxjdWxhdGVHcmFwaCgpIHtcblx0XHRcdHZhciBjaGFydERhdGEgPSBbXTtcblx0XHRcdGFuZ3VsYXIuZm9yRWFjaCgkc2NvcGUuZGlzcGxheS5zZWxlY3RlZENhdC5jaGlsZHJlbiwgZnVuY3Rpb24oaXRlbSwga2V5KSB7XG5cdFx0XHRcdHZhciBncmFwaCA9IHtcblx0XHRcdFx0XHRrZXk6IGl0ZW0udGl0bGUsXG5cdFx0XHRcdFx0Y29sb3I6IGl0ZW0uY29sb3IsXG5cdFx0XHRcdFx0dmFsdWVzOiBbXVxuXHRcdFx0XHR9O1xuXHRcdFx0XHRhbmd1bGFyLmZvckVhY2goJHNjb3BlLmNvdW50cnkuZXBpLCBmdW5jdGlvbihkYXRhKSB7XG5cdFx0XHRcdFx0Z3JhcGgudmFsdWVzLnB1c2goe1xuXHRcdFx0XHRcdFx0eDogZGF0YS55ZWFyLFxuXHRcdFx0XHRcdFx0eTogZGF0YVtpdGVtLmNvbHVtbl9uYW1lXVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9KTtcblx0XHRcdFx0Y2hhcnREYXRhLnB1c2goZ3JhcGgpO1xuXHRcdFx0fSk7XG5cdFx0XHQkc2NvcGUuY2hhcnQuZGF0YSA9IGNoYXJ0RGF0YTtcblx0XHR9XG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5kaXJlY3RpdmVzJykuZGlyZWN0aXZlKCdzdW5idXJzdCcsIGZ1bmN0aW9uICgpIHtcblx0XHR2YXIgZGVmYXVsdHMgPSBmdW5jdGlvbigpe1xuXHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdCBtb2RlOiAnc2l6ZSdcblx0XHRcdFx0fVxuXHRcdH07XG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlc3RyaWN0OiAnRScsXG5cdFx0XHQvL3RlbXBsYXRlVXJsOiAndmlld3MvZGlyZWN0aXZlcy9zdW5idXJzdC9zdW5idXJzdC5odG1sJyxcblx0XHRcdGNvbnRyb2xsZXI6ICdTdW5idXJzdEN0cmwnLFxuXHRcdFx0c2NvcGU6IHtcblx0XHRcdFx0ZGF0YTogJz0nXG5cdFx0XHR9LFxuXHRcdFx0bGluazogZnVuY3Rpb24gKCRzY29wZSwgZWxlbWVudCwgJGF0dHJzKSB7XG5cdFx0XHRcdHZhciBvcHRpb25zID0gYW5ndWxhci5leHRlbmQoZGVmYXVsdHMoKSwgJGF0dHJzKTtcblx0XHRcdFx0JHNjb3BlLnNldENoYXJ0KCk7XG5cdFx0XHRcdCRzY29wZS5jYWxjdWxhdGVHcmFwaCgpO1xuXHRcdFx0XHR2YXIgd2lkdGggPSA2MTAsXG5cdFx0XHRcdFx0aGVpZ2h0ID0gd2lkdGgsXG5cdFx0XHRcdFx0cmFkaXVzID0gKHdpZHRoKSAvIDIsXG5cdFx0XHRcdFx0eCA9IGQzLnNjYWxlLmxpbmVhcigpLnJhbmdlKFswLCAyICogTWF0aC5QSV0pLFxuXHRcdFx0XHRcdHkgPSBkMy5zY2FsZS5wb3coKS5leHBvbmVudCgxLjMpLmRvbWFpbihbMCwgMV0pLnJhbmdlKFswLCByYWRpdXNdKSxcblxuXHRcdFx0XHRcdHBhZGRpbmcgPSAwLFxuXHRcdFx0XHRcdGR1cmF0aW9uID0gMTAwMCxcblx0XHRcdFx0XHRjaXJjUGFkZGluZyA9IDEwO1xuXG5cdFx0XHRcdHZhciBkaXYgPSBkMy5zZWxlY3QoZWxlbWVudFswXSk7XG5cblxuXHRcdFx0XHR2YXIgdmlzID0gZGl2LmFwcGVuZChcInN2Z1wiKVxuXHRcdFx0XHRcdC5hdHRyKFwid2lkdGhcIiwgd2lkdGggKyBwYWRkaW5nICogMilcblx0XHRcdFx0XHQuYXR0cihcImhlaWdodFwiLCBoZWlnaHQgKyBwYWRkaW5nICogMilcblx0XHRcdFx0XHQuYXBwZW5kKFwiZ1wiKVxuXHRcdFx0XHRcdC5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiICsgW3JhZGl1cyArIHBhZGRpbmcsIHJhZGl1cyArIHBhZGRpbmddICsgXCIpXCIpO1xuXG5cdFx0XHRcdC8qXG5cdFx0XHRcdGRpdi5hcHBlbmQoXCJwXCIpXG5cdFx0XHRcdFx0XHQuYXR0cihcImlkXCIsIFwiaW50cm9cIilcblx0XHRcdFx0XHRcdC50ZXh0KFwiQ2xpY2sgdG8gem9vbSFcIik7XG5cdFx0XHRcdCovXG5cblx0XHRcdFx0dmFyIHBhcnRpdGlvbiA9IGQzLmxheW91dC5wYXJ0aXRpb24oKVxuXHRcdFx0XHRcdC5zb3J0KG51bGwpXG5cdFx0XHRcdFx0LnZhbHVlKGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gMTtcblx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHR2YXIgYXJjID0gZDMuc3ZnLmFyYygpXG5cdFx0XHRcdFx0LnN0YXJ0QW5nbGUoZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdHJldHVybiBNYXRoLm1heCgwLCBNYXRoLm1pbigyICogTWF0aC5QSSwgeChkLngpKSk7XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQuZW5kQW5nbGUoZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdHJldHVybiBNYXRoLm1heCgwLCBNYXRoLm1pbigyICogTWF0aC5QSSwgeChkLnggKyBkLmR4KSkpO1xuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0LmlubmVyUmFkaXVzKGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gTWF0aC5tYXgoMCwgZC55ID8geShkLnkpIDogZC55KTtcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC5vdXRlclJhZGl1cyhmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIE1hdGgubWF4KDAsIHkoZC55ICsgZC5keSkpO1xuXHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdHZhciBzcGVjaWFsMSA9IFwiV2FzdGV3YXRlciBUcmVhdG1lbnRcIixcblx0XHRcdFx0XHRzcGVjaWFsMiA9IFwiQWlyIFBvbGx1dGlvbiBQTTIuNSBFeGNlZWRhbmNlXCIsXG5cdFx0XHRcdFx0c3BlY2lhbDMgPSBcIkFncmljdWx0dXJhbCBTdWJzaWRpZXNcIixcblx0XHRcdFx0XHRzcGVjaWFsNCA9IFwiUGVzdGljaWRlIFJlZ3VsYXRpb25cIjtcblxuXG5cdFx0XHRcdHZhciBub2RlcyA9IHBhcnRpdGlvbi5ub2Rlcygkc2NvcGUuY2FsY3VsYXRlR3JhcGgoKSk7XG5cblx0XHRcdFx0dmFyIHBhdGggPSB2aXMuc2VsZWN0QWxsKFwicGF0aFwiKS5kYXRhKG5vZGVzKTtcblx0XHRcdFx0cGF0aC5lbnRlcigpLmFwcGVuZChcInBhdGhcIilcblx0XHRcdFx0XHQuYXR0cihcImlkXCIsIGZ1bmN0aW9uIChkLCBpKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gXCJwYXRoLVwiICsgaTtcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC5hdHRyKFwiZFwiLCBhcmMpXG5cdFx0XHRcdFx0LmF0dHIoXCJmaWxsLXJ1bGVcIiwgXCJldmVub2RkXCIpXG5cdFx0XHRcdFx0LmF0dHIoXCJjbGFzc1wiLCBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGQuZGVwdGggPyBcImJyYW5jaFwiIDogXCJyb290XCI7XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQuc3R5bGUoXCJmaWxsXCIsIHNldENvbG9yKVxuXHRcdFx0XHRcdC5vbihcImNsaWNrXCIsIGNsaWNrKTtcblxuXHRcdFx0XHR2YXIgdGV4dCA9IHZpcy5zZWxlY3RBbGwoXCJ0ZXh0XCIpLmRhdGEobm9kZXMpO1xuXHRcdFx0XHR2YXIgdGV4dEVudGVyID0gdGV4dC5lbnRlcigpLmFwcGVuZChcInRleHRcIilcblx0XHRcdFx0XHQuc3R5bGUoXCJmaWxsLW9wYWNpdHlcIiwgMSlcblx0XHRcdFx0XHQuYXR0cihcInRleHQtYW5jaG9yXCIsIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRpZiAoZC5kZXB0aClcblx0XHRcdFx0XHRcdFx0cmV0dXJuIFwibWlkZGxlXCI7XG5cdFx0XHRcdFx0XHQvL34gcmV0dXJuIHgoZC54ICsgZC5keCAvIDIpID4gTWF0aC5QSSA/IFwiZW5kXCIgOiBcInN0YXJ0XCI7XG5cdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdHJldHVybiBcIm1pZGRsZVwiO1xuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0LmF0dHIoXCJpZFwiLCBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIFwiZGVwdGhcIiArIGQuZGVwdGg7XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQuYXR0cihcImNsYXNzXCIsIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gXCJzZWN0b3JcIlxuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0LmF0dHIoXCJkeVwiLCBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGQuZGVwdGggPyBcIi4yZW1cIiA6IFwiMC4zNWVtXCI7XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQuYXR0cihcInRyYW5zZm9ybVwiLCBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0dmFyIG11bHRpbGluZSA9IChkLm5hbWUgfHwgXCJcIikuc3BsaXQoXCIgXCIpLmxlbmd0aCA+IDIsXG5cdFx0XHRcdFx0XHRcdGFuZ2xlQWxpZ24gPSAoZC54ID4gMC41ID8gMiA6IC0yKSxcblx0XHRcdFx0XHRcdFx0YW5nbGUgPSB4KGQueCArIGQuZHggLyAyKSAqIDE4MCAvIE1hdGguUEkgLSA5MCArIChtdWx0aWxpbmUgPyBhbmdsZUFsaWduIDogMCksXG5cdFx0XHRcdFx0XHRcdHJvdGF0ZSA9IGFuZ2xlICsgKG11bHRpbGluZSA/IC0uNSA6IDApLFxuXHRcdFx0XHRcdFx0XHR0cmFuc2wgPSAoeShkLnkpICsgY2lyY1BhZGRpbmcpICsgMzUsXG5cdFx0XHRcdFx0XHRcdHNlY0FuZ2xlID0gKGFuZ2xlID4gOTAgPyAtMTgwIDogMCk7XG5cdFx0XHRcdFx0XHRpZiAoZC5uYW1lID09IHNwZWNpYWwzIHx8IGQubmFtZSA9PSBzcGVjaWFsNCkgcm90YXRlICs9IDE7XG5cdFx0XHRcdFx0XHRpZiAoZC5kZXB0aCA9PSAwKSB7XG5cdFx0XHRcdFx0XHRcdHRyYW5zbCA9IC0yLjUwO1xuXHRcdFx0XHRcdFx0XHRyb3RhdGUgPSAwO1xuXHRcdFx0XHRcdFx0XHRzZWNBbmdsZSA9IDA7XG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKGQuZGVwdGggPT0gMSkgdHJhbnNsICs9IC05O1xuXHRcdFx0XHRcdFx0ZWxzZSBpZiAoZC5kZXB0aCA9PSAyKSB0cmFuc2wgKz0gLTU7XG5cdFx0XHRcdFx0XHRlbHNlIGlmIChkLmRlcHRoID09IDMpIHRyYW5zbCArPSA0O1xuXHRcdFx0XHRcdFx0cmV0dXJuIFwicm90YXRlKFwiICsgcm90YXRlICsgXCIpdHJhbnNsYXRlKFwiICsgdHJhbnNsICsgXCIpcm90YXRlKFwiICsgc2VjQW5nbGUgKyBcIilcIjtcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC5vbihcImNsaWNrXCIsIGNsaWNrKTtcblxuXHRcdFx0XHR0ZXh0RW50ZXIuYXBwZW5kKFwidHNwYW5cIilcblx0XHRcdFx0XHQuYXR0cihcInhcIiwgMClcblx0XHRcdFx0XHQudGV4dChmdW5jdGlvbiAoZCkge1xuXG5cdFx0XHRcdFx0XHRpZiAoZC5kZXB0aCA9PSAzICYmIGQubmFtZSAhPSBzcGVjaWFsMSAmJiBkLm5hbWUgIT0gc3BlY2lhbDIgJiYgZC5uYW1lICE9IHNwZWNpYWwzICYmIGQubmFtZSAhPSBzcGVjaWFsNClcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGQubmFtZS5zcGxpdChcIiBcIilbMF0gKyBcIiBcIiArIChkLm5hbWUuc3BsaXQoXCIgXCIpWzFdIHx8IFwiXCIpO1xuXHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gZC5uYW1lLnNwbGl0KFwiIFwiKVswXTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0dGV4dEVudGVyLmFwcGVuZChcInRzcGFuXCIpXG5cdFx0XHRcdFx0LmF0dHIoXCJ4XCIsIDApXG5cdFx0XHRcdFx0LmF0dHIoXCJkeVwiLCBcIjFlbVwiKVxuXHRcdFx0XHRcdC50ZXh0KGZ1bmN0aW9uIChkKSB7XG5cblx0XHRcdFx0XHRcdGlmIChkLmRlcHRoID09IDMgJiYgZC5uYW1lICE9IHNwZWNpYWwxICYmIGQubmFtZSAhPSBzcGVjaWFsMiAmJiBkLm5hbWUgIT0gc3BlY2lhbDMgJiYgZC5uYW1lICE9IHNwZWNpYWw0KVxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gKGQubmFtZS5zcGxpdChcIiBcIilbMl0gfHwgXCJcIikgKyBcIiBcIiArIChkLm5hbWUuc3BsaXQoXCIgXCIpWzNdIHx8IFwiXCIpO1xuXHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gKGQubmFtZS5zcGxpdChcIiBcIilbMV0gfHwgXCJcIikgKyBcIiBcIiArIChkLm5hbWUuc3BsaXQoXCIgXCIpWzJdIHx8IFwiXCIpO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR0ZXh0RW50ZXIuYXBwZW5kKFwidHNwYW5cIilcblx0XHRcdFx0XHQuYXR0cihcInhcIiwgMClcblx0XHRcdFx0XHQuYXR0cihcImR5XCIsIFwiMWVtXCIpXG5cdFx0XHRcdFx0LnRleHQoZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdGlmIChkLmRlcHRoID09IDMgJiYgZC5uYW1lICE9IHNwZWNpYWwxICYmIGQubmFtZSAhPSBzcGVjaWFsMiAmJiBkLm5hbWUgIT0gc3BlY2lhbDMgJiYgZC5uYW1lICE9IHNwZWNpYWw0KVxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gKGQubmFtZS5zcGxpdChcIiBcIilbNF0gfHwgXCJcIikgKyBcIiBcIiArIChkLm5hbWUuc3BsaXQoXCIgXCIpWzVdIHx8IFwiXCIpO1xuXHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gKGQubmFtZS5zcGxpdChcIiBcIilbM10gfHwgXCJcIikgKyBcIiBcIiArIChkLm5hbWUuc3BsaXQoXCIgXCIpWzRdIHx8IFwiXCIpOztcblx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRmdW5jdGlvbiBjbGljayhkKSB7XG5cdFx0XHRcdFx0Ly8gQ29udHJvbCBhcmMgdHJhbnNpdGlvblxuXHRcdFx0XHRcdHBhdGgudHJhbnNpdGlvbigpXG5cdFx0XHRcdFx0XHQuZHVyYXRpb24oZHVyYXRpb24pXG5cdFx0XHRcdFx0XHQuYXR0clR3ZWVuKFwiZFwiLCBhcmNUd2VlbihkKSk7XG5cblx0XHRcdFx0XHQvLyBTb21ld2hhdCBvZiBhIGhhY2sgYXMgd2UgcmVseSBvbiBhcmNUd2VlbiB1cGRhdGluZyB0aGUgc2NhbGVzLlxuXHRcdFx0XHRcdC8vIENvbnRyb2wgdGhlIHRleHQgdHJhbnNpdGlvblxuXHRcdFx0XHRcdHRleHQuc3R5bGUoXCJ2aXNpYmlsaXR5XCIsIGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBpc1BhcmVudE9mKGQsIGUpID8gbnVsbCA6IGQzLnNlbGVjdCh0aGlzKS5zdHlsZShcInZpc2liaWxpdHlcIik7XG5cdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0LnRyYW5zaXRpb24oKVxuXHRcdFx0XHRcdFx0LmR1cmF0aW9uKGR1cmF0aW9uKVxuXHRcdFx0XHRcdFx0LmF0dHJUd2VlbihcInRleHQtYW5jaG9yXCIsIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRcdFx0aWYgKGQuZGVwdGgpXG5cdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gXCJtaWRkbGVcIjtcblx0XHRcdFx0XHRcdFx0XHQvL34gcmV0dXJuIHgoZC54ICsgZC5keCAvIDIpID4gTWF0aC5QSSA/IFwiZW5kXCIgOiBcInN0YXJ0XCI7XG5cdFx0XHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIFwibWlkZGxlXCI7XG5cdFx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0LmF0dHJUd2VlbihcInRyYW5zZm9ybVwiLCBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0XHR2YXIgbXVsdGlsaW5lID0gKGQubmFtZSB8fCBcIlwiKS5zcGxpdChcIiBcIikubGVuZ3RoID4gMjtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdFx0XHR2YXIgbXVsdGlsaW5lID0gKGQubmFtZSB8fCBcIlwiKS5zcGxpdChcIiBcIikubGVuZ3RoID4gMixcblx0XHRcdFx0XHRcdFx0XHRcdGFuZ2xlQWxpZ24gPSAoZC54ID4gMC41ID8gMiA6IC0yKSxcblx0XHRcdFx0XHRcdFx0XHRcdGFuZ2xlID0geChkLnggKyBkLmR4IC8gMikgKiAxODAgLyBNYXRoLlBJIC0gOTAgKyAobXVsdGlsaW5lID8gYW5nbGVBbGlnbiA6IDApLFxuXHRcdFx0XHRcdFx0XHRcdFx0cm90YXRlID0gYW5nbGUgKyAobXVsdGlsaW5lID8gLS41IDogMCksXG5cdFx0XHRcdFx0XHRcdFx0XHR0cmFuc2wgPSAoeShkLnkpICsgY2lyY1BhZGRpbmcpICsgMzUsXG5cdFx0XHRcdFx0XHRcdFx0XHRzZWNBbmdsZSA9IChhbmdsZSA+IDkwID8gLTE4MCA6IDApO1xuXHRcdFx0XHRcdFx0XHRcdGlmIChkLm5hbWUgPT0gc3BlY2lhbDMgfHwgZC5uYW1lID09IHNwZWNpYWw0KSByb3RhdGUgKz0gMTtcblx0XHRcdFx0XHRcdFx0XHRpZiAoZC5kZXB0aCA9PSAwKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHR0cmFuc2wgPSAtMi41MDtcblx0XHRcdFx0XHRcdFx0XHRcdHJvdGF0ZSA9IDA7XG5cdFx0XHRcdFx0XHRcdFx0XHRzZWNBbmdsZSA9IDA7XG5cdFx0XHRcdFx0XHRcdFx0fSBlbHNlIGlmIChkLmRlcHRoID09IDEpIHRyYW5zbCArPSAtOTtcblx0XHRcdFx0XHRcdFx0XHRlbHNlIGlmIChkLmRlcHRoID09IDIpIHRyYW5zbCArPSAtNTtcblx0XHRcdFx0XHRcdFx0XHRlbHNlIGlmIChkLmRlcHRoID09IDMpIHRyYW5zbCArPSA0O1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBcInJvdGF0ZShcIiArIHJvdGF0ZSArIFwiKXRyYW5zbGF0ZShcIiArIHRyYW5zbCArIFwiKXJvdGF0ZShcIiArIHNlY0FuZ2xlICsgXCIpXCI7XG5cdFx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0LnN0eWxlKFwiZmlsbC1vcGFjaXR5XCIsIGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBpc1BhcmVudE9mKGQsIGUpID8gMSA6IDFlLTY7XG5cdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0LmVhY2goXCJlbmRcIiwgZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0XHRcdFx0ZDMuc2VsZWN0KHRoaXMpLnN0eWxlKFwidmlzaWJpbGl0eVwiLCBpc1BhcmVudE9mKGQsIGUpID8gbnVsbCA6IFwiaGlkZGVuXCIpO1xuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblxuXG5cdFx0XHRcdGZ1bmN0aW9uIGlzUGFyZW50T2YocCwgYykge1xuXHRcdFx0XHRcdGlmIChwID09PSBjKSByZXR1cm4gdHJ1ZTtcblx0XHRcdFx0XHRpZiAocC5jaGlsZHJlbikge1xuXHRcdFx0XHRcdFx0cmV0dXJuIHAuY2hpbGRyZW4uc29tZShmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gaXNQYXJlbnRPZihkLCBjKTtcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRmdW5jdGlvbiBzZXRDb2xvcihkKSB7XG5cblx0XHRcdFx0XHQvL3JldHVybiA7XG5cdFx0XHRcdFx0aWYgKGQuY29sb3IpXG5cdFx0XHRcdFx0XHRyZXR1cm4gZC5jb2xvcjtcblx0XHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRcdHJldHVybiAnI2NjYyc7XG5cdFx0XHRcdFx0XHQvKnZhciB0aW50RGVjYXkgPSAwLjIwO1xuXHRcdFx0XHRcdFx0Ly8gRmluZCBjaGlsZCBudW1iZXJcblx0XHRcdFx0XHRcdHZhciB4ID0gMDtcblx0XHRcdFx0XHRcdHdoaWxlIChkLnBhcmVudC5jaGlsZHJlblt4XSAhPSBkKVxuXHRcdFx0XHRcdFx0XHR4Kys7XG5cdFx0XHRcdFx0XHR2YXIgdGludENoYW5nZSA9ICh0aW50RGVjYXkgKiAoeCArIDEpKS50b1N0cmluZygpO1xuXHRcdFx0XHRcdFx0cmV0dXJuIHB1c2hlci5jb2xvcihkLnBhcmVudC5jb2xvcikudGludCh0aW50Q2hhbmdlKS5odG1sKCdoZXg2Jyk7Ki9cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBJbnRlcnBvbGF0ZSB0aGUgc2NhbGVzIVxuXHRcdFx0XHRmdW5jdGlvbiBhcmNUd2VlbihkKSB7XG5cdFx0XHRcdFx0dmFyIG15ID0gbWF4WShkKSxcblx0XHRcdFx0XHRcdHhkID0gZDMuaW50ZXJwb2xhdGUoeC5kb21haW4oKSwgW2QueCwgZC54ICsgZC5keCAtIDAuMDAwOV0pLFxuXHRcdFx0XHRcdFx0eWQgPSBkMy5pbnRlcnBvbGF0ZSh5LmRvbWFpbigpLCBbZC55LCBteV0pLFxuXHRcdFx0XHRcdFx0eXIgPSBkMy5pbnRlcnBvbGF0ZSh5LnJhbmdlKCksIFtkLnkgPyAyMCA6IDAsIHJhZGl1c10pO1xuXG5cdFx0XHRcdFx0cmV0dXJuIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZnVuY3Rpb24gKHQpIHtcblx0XHRcdFx0XHRcdFx0eC5kb21haW4oeGQodCkpO1xuXHRcdFx0XHRcdFx0XHR5LmRvbWFpbih5ZCh0KSkucmFuZ2UoeXIodCkpO1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gYXJjKGQpO1xuXHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHR9O1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0ZnVuY3Rpb24gbWF4WShkKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGQuY2hpbGRyZW4gPyBNYXRoLm1heC5hcHBseShNYXRoLCBkLmNoaWxkcmVuLm1hcChtYXhZKSkgOiBkLnkgKyBkLmR5O1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9KTtcbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignU3VuYnVyc3RDdHJsJywgZnVuY3Rpb24gKCRzY29wZSkge1xuXG5cdFx0JHNjb3BlLnNldENoYXJ0ID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0JHNjb3BlLmNoYXJ0ID0ge1xuXHRcdFx0XHRvcHRpb25zOiB7XG5cdFx0XHRcdFx0Y2hhcnQ6IHtcblx0XHRcdFx0XHRcdHR5cGU6ICdzdW5idXJzdCcsXG5cdFx0XHRcdFx0XHRoZWlnaHQ6IDcwMCxcblx0XHRcdFx0XHRcdFwic3VuYnVyc3RcIjoge1xuXHRcdFx0XHRcdFx0XHRcImRpc3BhdGNoXCI6IHt9LFxuXHRcdFx0XHRcdFx0XHRcIndpZHRoXCI6IG51bGwsXG5cdFx0XHRcdFx0XHRcdFwiaGVpZ2h0XCI6IG51bGwsXG5cdFx0XHRcdFx0XHRcdFwibW9kZVwiOiBcInNpemVcIixcblx0XHRcdFx0XHRcdFx0XCJpZFwiOiAyMDg4LFxuXHRcdFx0XHRcdFx0XHRcImR1cmF0aW9uXCI6IDUwMCxcblx0XHRcdFx0XHRcdFx0XCJtYXJnaW5cIjoge1xuXHRcdFx0XHRcdFx0XHRcdFwidG9wXCI6IDAsXG5cdFx0XHRcdFx0XHRcdFx0XCJyaWdodFwiOiAwLFxuXHRcdFx0XHRcdFx0XHRcdFwiYm90dG9tXCI6IDAsXG5cdFx0XHRcdFx0XHRcdFx0XCJsZWZ0XCI6IDBcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdFwidG9vbHRpcFwiOiB7XG5cdFx0XHRcdFx0XHRcdFwiZHVyYXRpb25cIjogMCxcblx0XHRcdFx0XHRcdFx0XCJncmF2aXR5XCI6IFwid1wiLFxuXHRcdFx0XHRcdFx0XHRcImRpc3RhbmNlXCI6IDI1LFxuXHRcdFx0XHRcdFx0XHRcInNuYXBEaXN0YW5jZVwiOiAwLFxuXHRcdFx0XHRcdFx0XHRcImNsYXNzZXNcIjogbnVsbCxcblx0XHRcdFx0XHRcdFx0XCJjaGFydENvbnRhaW5lclwiOiBudWxsLFxuXHRcdFx0XHRcdFx0XHRcImZpeGVkVG9wXCI6IG51bGwsXG5cdFx0XHRcdFx0XHRcdFwiZW5hYmxlZFwiOiB0cnVlLFxuXHRcdFx0XHRcdFx0XHRcImhpZGVEZWxheVwiOiA0MDAsXG5cdFx0XHRcdFx0XHRcdFwiaGVhZGVyRW5hYmxlZFwiOiBmYWxzZSxcblxuXHRcdFx0XHRcdFx0XHRcIm9mZnNldFwiOiB7XG5cdFx0XHRcdFx0XHRcdFx0XCJsZWZ0XCI6IDAsXG5cdFx0XHRcdFx0XHRcdFx0XCJ0b3BcIjogMFxuXHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHRcImhpZGRlblwiOiB0cnVlLFxuXHRcdFx0XHRcdFx0XHRcImRhdGFcIjogbnVsbCxcblx0XHRcdFx0XHRcdFx0XCJ0b29sdGlwRWxlbVwiOiBudWxsLFxuXHRcdFx0XHRcdFx0XHRcImlkXCI6IFwibnZ0b29sdGlwLTk5MzQ3XCJcblx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRkYXRhOiBbXVxuXHRcdFx0fTtcblx0XHRcdHJldHVybiAkc2NvcGUuY2hhcnQ7XG5cdFx0fVxuXHRcdHZhciBidWlsZFRyZWUgPSBmdW5jdGlvbiAoZGF0YSkge1xuXHRcdFx0dmFyIGNoaWxkcmVuID0gW107XG5cdFx0XHRhbmd1bGFyLmZvckVhY2goZGF0YSwgZnVuY3Rpb24gKGl0ZW0pIHtcblx0XHRcdFx0dmFyIGNoaWxkID0ge1xuXHRcdFx0XHRcdCduYW1lJzogaXRlbS50aXRsZSxcblx0XHRcdFx0XHQnc2l6ZSc6IGl0ZW0uc2l6ZSxcblx0XHRcdFx0XHQnY29sb3InOiBpdGVtLmNvbG9yLFxuXHRcdFx0XHRcdCdjaGlsZHJlbic6IGJ1aWxkVHJlZShpdGVtLmNoaWxkcmVuKVxuXHRcdFx0XHR9O1xuXHRcdFx0XHRpZihpdGVtLmNvbG9yKXtcblx0XHRcdFx0XHRjaGlsZC5jb2xvciA9IGl0ZW0uY29sb3Jcblx0XHRcdFx0fVxuXHRcdFx0XHRpZihpdGVtLnNpemUpe1xuXHRcdFx0XHRcdGNoaWxkLnNpemUgPSBpdGVtLnNpemVcblx0XHRcdFx0fVxuXHRcdFx0XHRjaGlsZHJlbi5wdXNoKGNoaWxkKTtcblx0XHRcdH0pO1xuXHRcdFx0cmV0dXJuIGNoaWxkcmVuO1xuXHRcdH07XG5cdFx0JHNjb3BlLmNhbGN1bGF0ZUdyYXBoID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0dmFyIGNoYXJ0RGF0YSA9IHtcblx0XHRcdFx0XCJuYW1lXCI6ICRzY29wZS5kYXRhLnRpdGxlLFxuXHRcdFx0XHRcImNvbG9yXCI6ICRzY29wZS5kYXRhLnN0eWxlLmJhc2VfY29sb3IgfHwgJyMwMDAnLFxuXHRcdFx0XHRcImNoaWxkcmVuXCI6IGJ1aWxkVHJlZSgkc2NvcGUuZGF0YS5jaGlsZHJlbiksXG5cdFx0XHRcdFwic2l6ZVwiOiAxXG5cdFx0XHR9O1xuXHRcdFx0JHNjb3BlLmNoYXJ0LmRhdGEgPSBjaGFydERhdGE7XG5cdFx0XHRyZXR1cm4gY2hhcnREYXRhO1xuXHRcdH07XG5cdFx0JHNjb3BlLiR3YXRjaCgnZGF0YScsIGZ1bmN0aW9uIChuLCBvKSB7XG5cdFx0XHRpZiAoIW4pIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdFx0JHNjb3BlLmNhbGN1bGF0ZUdyYXBoKCk7XG5cdFx0fSlcblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5kaXJlY3RpdmVzJykuZGlyZWN0aXZlKCAndHJlZW1lbnUnLCBmdW5jdGlvbigpIHtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRyZXN0cmljdDogJ0VBJyxcblx0XHRcdHRlbXBsYXRlVXJsOiAndmlld3MvZGlyZWN0aXZlcy90cmVlbWVudS90cmVlbWVudS5odG1sJyxcblx0XHRcdGNvbnRyb2xsZXI6ICdUcmVlbWVudUN0cmwnLFxuXHRcdFx0Y29udHJvbGxlckFzOiAndm0nLFxuXHRcdFx0c2NvcGU6e30sXG5cdFx0XHRiaW5kVG9Db250cm9sbGVyOiB7XG5cdFx0XHRcdG9wdGlvbnM6Jz0nLFxuXHRcdFx0XHRpdGVtOic9PycsXG5cdFx0XHRcdHNlbGVjdGlvbjogJz0/J1xuXHRcdFx0fSxcblx0XHRcdHJlcGxhY2U6dHJ1ZSxcblx0XHRcdGxpbms6IGZ1bmN0aW9uKCBzY29wZSwgZWxlbWVudCwgYXR0cnMgKXtcblx0XHRcdFx0Ly9cblx0XHRcdH1cblx0XHR9O1xuXG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCAnYXBwLmNvbnRyb2xsZXJzJyApLmNvbnRyb2xsZXIoICdUcmVlbWVudUN0cmwnLCBmdW5jdGlvbigpe1xuXHRcdGNvbnNvbGUubG9nKHRoaXMpO1xuXHR9KVxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmRpcmVjdGl2ZXMnKS5kaXJlY3RpdmUoICd0cmVldmlldycsIGZ1bmN0aW9uKFJlY3Vyc2lvbkhlbHBlcikge1xuXHRcdHZhciBvcHRpb25zID0ge1xuXHRcdFx0ZWRpdFdlaWdodDpmYWxzZSxcblx0XHRcdGRyYWc6IGZhbHNlLFxuXHRcdFx0ZWRpdDogZmFsc2Vcblx0XHR9O1xuXHRcdHJldHVybiB7XG5cdFx0XHRyZXN0cmljdDogJ0UnLFxuXHRcdFx0dGVtcGxhdGVVcmw6ICd2aWV3cy9kaXJlY3RpdmVzL3RyZWV2aWV3L3RyZWV2aWV3Lmh0bWwnLFxuXHRcdFx0Y29udHJvbGxlcjogJ1RyZWV2aWV3Q3RybCcsXG5cdFx0XHRjb250cm9sbGVyQXM6ICd2bScsXG5cdFx0XHRzY29wZTp7fSxcblx0XHRcdGJpbmRUb0NvbnRyb2xsZXI6IHtcblx0XHRcdFx0aXRlbXM6ICc9Jyxcblx0XHRcdFx0aXRlbTogJz0/Jyxcblx0XHRcdFx0c2VsZWN0aW9uOiAnPT8nLFxuXHRcdFx0XHRvcHRpb25zOic9Jyxcblx0XHRcdFx0Y2xpY2s6ICcmJ1xuXHRcdFx0fSxcblx0XHRcdHJlcGxhY2U6dHJ1ZSxcblx0XHRcdGNvbXBpbGU6IGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAgICAgICAgICAgIHJldHVybiBSZWN1cnNpb25IZWxwZXIuY29tcGlsZShlbGVtZW50LCBmdW5jdGlvbihzY29wZSwgaUVsZW1lbnQsIGlBdHRycywgY29udHJvbGxlciwgdHJhbnNjbHVkZUZuKXtcblx0XHRcdFx0XHRcdFx0XHRhbmd1bGFyLmV4dGVuZChvcHRpb25zLCBzY29wZS52bS5vcHRpb25zKVxuXHRcdFx0XHRcdFx0XHRcdC8vIERlZmluZSB5b3VyIG5vcm1hbCBsaW5rIGZ1bmN0aW9uIGhlcmUuXG4gICAgICAgICAgICAgICAgLy8gQWx0ZXJuYXRpdmU6IGluc3RlYWQgb2YgcGFzc2luZyBhIGZ1bmN0aW9uLFxuICAgICAgICAgICAgICAgIC8vIHlvdSBjYW4gYWxzbyBwYXNzIGFuIG9iamVjdCB3aXRoXG4gICAgICAgICAgICAgICAgLy8gYSAncHJlJy0gYW5kICdwb3N0Jy1saW5rIGZ1bmN0aW9uLlxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblx0XHR9O1xuXG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignVHJlZXZpZXdDdHJsJywgZnVuY3Rpb24oJGZpbHRlcikge1xuXHRcdC8vXG5cdFx0dmFyIHZtID0gdGhpcztcblx0XHR2bS5zZWxlY3RlZEl0ZW0gPSBzZWxlY3RlZEl0ZW07XG5cdFx0Ly92bS5jaGlsZFNlbGVjdGVkID0gY2hpbGRTZWxlY3RlZDtcblx0XHR2bS50b2dnbGVTZWxlY3Rpb24gPSB0b2dnbGVTZWxlY3Rpb247XG5cdFx0dm0ub25EcmFnT3ZlciA9IG9uRHJhZ092ZXI7XG5cdFx0dm0ub25Ecm9wQ29tcGxldGUgPSBvbkRyb3BDb21wbGV0ZTtcblx0XHR2bS5vbk1vdmVkQ29tcGxldGUgPSBvbk1vdmVkQ29tcGxldGU7XG5cdFx0dm0uYWRkQ2hpbGRyZW4gPSBhZGRDaGlsZHJlbjtcblxuXHRcdGFjdGl2YXRlKCk7XG5cblx0XHRmdW5jdGlvbiBhY3RpdmF0ZSgpe1xuXHRcdFx0Y29uc29sZS5sb2codm0uc2VsZWN0aW9uKTtcblx0XHRcdGlmKHR5cGVvZiB2bS5zZWxlY3Rpb24gPT0gXCJ1bmRlZmluZWRcIil7XG5cdFx0XHRcdHZtLnNlbGVjdGlvbiA9IFtdO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIG9uRHJhZ092ZXIoZXZlbnQsIGluZGV4LCBleHRlcm5hbCwgdHlwZSkge1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gb25Ecm9wQ29tcGxldGUoZXZlbnQsIGluZGV4LCBpdGVtLCBleHRlcm5hbCkge1xuXHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLml0ZW1zLCBmdW5jdGlvbihlbnRyeSwga2V5KXtcblx0XHRcdFx0aWYoZW50cnkuaWQgPT0gMCl7XG5cdFx0XHRcdFx0dm0uaXRlbXMuc3BsaWNlKGtleSwgMSk7XG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cdFx0XHRyZXR1cm4gaXRlbTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBvbk1vdmVkQ29tcGxldGUoaW5kZXgsIGRhdGEsIGV2dCkge1xuXHRcdFx0aWYodm0ub3B0aW9ucy5hbGxvd01vdmUpe1xuXHRcdFx0XHRyZXR1cm4gdm0uaXRlbXMuc3BsaWNlKGluZGV4LCAxKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0ZnVuY3Rpb24gdG9nZ2xlU2VsZWN0aW9uKGl0ZW0pe1xuXHRcdFx0dmFyIGkgPSB2bS5zZWxlY3Rpb24uaW5kZXhPZihpdGVtKTtcblx0XHRcdGlmKGkgPiAtMSl7XG5cdFx0XHRcdHZtLnNlbGVjdGlvbi5zcGxpY2UoaSwgMSk7XG5cdFx0XHR9XG5cdFx0XHRlbHNle1xuXHRcdFx0XHR2bS5zZWxlY3Rpb24ucHVzaChpdGVtKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0ZnVuY3Rpb24gYWRkQ2hpbGRyZW4oaXRlbSkge1xuXG5cdFx0XHRpdGVtLmNoaWxkcmVuID0gW107XG5cdFx0XHRpdGVtLmV4cGFuZGVkID0gdHJ1ZTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBzZWxlY3RlZEl0ZW0oaXRlbSkge1xuXHRcdFx0aWYodm0uc2VsZWN0aW9uLmluZGV4T2YoaXRlbSkgPiAtMSl7XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdC8qZnVuY3Rpb24gY2hpbGRTZWxlY3RlZChjaGlsZHJlbikge1xuXHRcdFx0dmFyIGZvdW5kID0gZmFsc2U7XG5cdFx0XHRhbmd1bGFyLmZvckVhY2goJGZpbHRlcignZmxhdHRlbicpKGNoaWxkcmVuKSwgZnVuY3Rpb24oY2hpbGQpIHtcblx0XHRcdFx0aWYgKHNlbGVjdGVkSXRlbShjaGlsZCkpIHtcblx0XHRcdFx0XHRmb3VuZCA9IHRydWU7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdFx0cmV0dXJuIGZvdW5kO1xuXHRcdH1cblxuXHRcdC8qZnVuY3Rpb24gdG9nZ2xlSXRlbShpdGVtKSB7XG5cdFx0XHRpZiAodHlwZW9mIHZtLml0ZW1bdm0ub3B0aW9ucy50eXBlXSA9PT0gXCJ1bmRlZmluZWRcIikgdm0uaXRlbVt2bS5vcHRpb25zLnR5cGVdID0gW107XG5cdFx0XHR2YXIgZm91bmQgPSBmYWxzZSxcblx0XHRcdFx0aW5kZXggPSAtMTtcblx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5pdGVtW3ZtLm9wdGlvbnMudHlwZV0sIGZ1bmN0aW9uKGVudHJ5LCBpKSB7XG5cdFx0XHRcdGlmIChlbnRyeS5pZCA9PSBpdGVtLmlkKSB7XG5cdFx0XHRcdFx0Zm91bmQgPSB0cnVlO1xuXHRcdFx0XHRcdGluZGV4ID0gaTtcblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHRcdGluZGV4ID09PSAtMSA/IHZtLml0ZW1bdm0ub3B0aW9ucy50eXBlXS5wdXNoKGl0ZW0pIDogdm0uaXRlbVt2bS5vcHRpb25zLnR5cGVdLnNwbGljZShpbmRleCwgMSk7XG5cdFx0fSovXG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmRpcmVjdGl2ZXMnKS5kaXJlY3RpdmUoJ3dlaWdodCcsIGZ1bmN0aW9uKCkge1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlc3RyaWN0OiAnRUEnLFxuXHRcdFx0dGVtcGxhdGVVcmw6ICd2aWV3cy9kaXJlY3RpdmVzL3dlaWdodC93ZWlnaHQuaHRtbCcsXG5cdFx0XHRjb250cm9sbGVyOiAnV2VpZ2h0Q3RybCcsXG5cdFx0XHRjb250cm9sbGVyQXM6ICd2bScsXG5cdFx0XHRzY29wZToge30sXG5cdFx0XHRiaW5kVG9Db250cm9sbGVyOiB7XG5cdFx0XHRcdGl0ZW1zOiAnPScsXG5cdFx0XHRcdGl0ZW06ICc9Jyxcblx0XHRcdFx0b3B0aW9uczogJz0nXG5cdFx0XHR9LFxuXHRcdFx0cmVwbGFjZTogdHJ1ZSxcblx0XHRcdGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuXHRcdFx0XHQvL1xuXHRcdFx0fVxuXHRcdH07XG5cblx0fSk7XG5cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignV2VpZ2h0Q3RybCcsIGZ1bmN0aW9uKCRzY29wZSkge1xuXHRcdC8vXG5cdFx0dmFyIHZtID0gdGhpcztcblx0XHR2bS5yYWlzZVdlaWdodCA9IHJhaXNlV2VpZ2h0O1xuXHRcdHZtLmxvd2VyV2VpZ2h0ID0gbG93ZXJXZWlnaHQ7XG5cblx0XHRhY3RpdmF0ZSgpO1xuXG5cdFx0ZnVuY3Rpb24gYWN0aXZhdGUoKSB7XG5cdFx0XHRjYWxjU3RhcnQoKTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBjYWxjU3RhcnQoKSB7XG5cblx0XHRcdGlmICh0eXBlb2Ygdm0uaXRlbS53ZWlnaHQgPT0gXCJ1bmRlZmluZWRcIiB8fCAhdm0uaXRlbS53ZWlnaHQpIHtcblx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLml0ZW1zLCBmdW5jdGlvbihlbnRyeSkge1xuXHRcdFx0XHRcdGVudHJ5LndlaWdodCA9IDEwMCAvIHZtLml0ZW1zLmxlbmd0aDtcblx0XHRcdFx0fSlcblx0XHRcdH1cblx0XHR9XG5cblx0XHRmdW5jdGlvbiBjYWxjVmFsdWVzKCkge1xuXHRcdFx0dmFyIGZpeGVkID0gdm0uaXRlbS53ZWlnaHQ7XG5cdFx0XHR2YXIgcmVzdCA9ICgxMDAgLSBmaXhlZCkgLyAodm0uaXRlbXMubGVuZ3RoIC0gMSk7XG5cdFx0XHRhbmd1bGFyLmZvckVhY2godm0uaXRlbXMsIGZ1bmN0aW9uKGVudHJ5KSB7XG5cdFx0XHRcdGlmIChlbnRyeSAhPT0gdm0uaXRlbSkge1xuXHRcdFx0XHRcdGVudHJ5LndlaWdodCA9IHJlc3Q7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdFx0cmV0dXJuIHJlc3Q7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gcmFpc2VXZWlnaHQoKSB7XG5cdFx0XHRpZih2bS5pdGVtLndlaWdodCA+PSA5NSkgcmV0dXJuIGZhbHNlO1xuXHRcdFx0aWYgKHZtLml0ZW0ud2VpZ2h0ICUgNSAhPSAwKSB7XG5cdFx0XHRcdHZtLml0ZW0ud2VpZ2h0ID0gNSAqIE1hdGgucm91bmQodm0uaXRlbS53ZWlnaHQgLyA1KTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHZtLml0ZW0ud2VpZ2h0ICs9IDU7XG5cdFx0XHR9XG5cdFx0XHRjYWxjVmFsdWVzKCk7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gbG93ZXJXZWlnaHQoKSB7XG5cdFx0XHRpZih2bS5pdGVtLndlaWdodCA8PSA1KSByZXR1cm4gZmFsc2U7XG5cdFx0XHRpZiAodm0uaXRlbS53ZWlnaHQgJSA1ICE9IDApIHtcblx0XHRcdFx0dm0uaXRlbS53ZWlnaHQgPSA1ICogTWF0aC5yb3VuZCh2bS5pdGVtLndlaWdodCAvIDUpIC0gNTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHZtLml0ZW0ud2VpZ2h0IC09IDU7XG5cdFx0XHR9XG5cdFx0XHRjYWxjVmFsdWVzKCk7XG5cdFx0fVxuXG5cblx0fSk7XG5cbn0pKCk7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
