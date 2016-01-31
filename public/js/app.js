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

(function () {
	"use strict";

	angular.module('app.routes').config(["$stateProvider", "$urlRouterProvider", "$locationProvider", function ($stateProvider, $urlRouterProvider, $locationProvider) {
	//	$locationProvider.html5Mode(true);
		var getView = function (viewName) {
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
					}
				}
			})
			.state('app.home',{
				url:'/',
				views:{
					'sidebar@':{
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
				auth:true,
				views: {
					'main@': {
						templateUrl: getView('user'),
						controller: 'UserCtrl',
						controllerAs: 'vm',
						resolve: {
							profile: ["DataService", "$auth", function (DataService, $auth) {
								return DataService.getOne('me').$object;
							}]
						}
					}
				}

			})
			.state('app.index', {
				abstract: true,
				url: '/index'

			})
			.state('app.index.mydata', {
				url:'/my-data',
				auth:true,
				views:{
					'sidebar@':{
						templateUrl:'/views/app/indexMyData/indexMyDataMenu.html',
						controller: 'IndexMyDataMenuCtrl',
						controllerAs: 'vm'
					},
					'main@':{
						templateUrl:getView('indexMyData'),
						controller: 'IndexMyDataCtrl',
						controllerAs: 'vm'
					}
				}
			})
			.state('app.index.mydata.entry', {
				url:'/:name',
				auth:true,
				views:{
					'sidebar@':{
						templateUrl:'/views/app/indexMyData/indexMyDataMenu.html',
						controller: 'IndexMyDataMenuCtrl',
						controllerAs: 'vm'
					},
					'main@':{
							templateUrl:'/views/app/indexMyData/indexMyDataEntry.html',
							controller: 'IndexMyDataEntryCtrl',
							controllerAs: 'vm'
					}
				}
			})
			.state('app.index.editor',{
				url: '/editor',
				auth:true,
				views: {
					'sidebar@': {
						templateUrl: getView('indexeditor'),
						controller: 'IndexeditorCtrl',
						controllerAs: 'vm',
						resolve:{
							indicators:["ContentService", function(ContentService){
								return ContentService.fetchIndicators({page:1, order:'title', limit:25, dir: 'ASC'});
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
			.state('app.index.editor.indicator',{
				url: '/:id',
				auth:true,
				layout: 'row',
				views: {
					'main@': {
						templateUrl:'/views/app/indexeditor/indexeditorindicator.html',
						controller: 'IndexeditorindicatorCtrl',
						controllerAs: 'vm',
						resolve:{
							indicator:["ContentService", "$stateParams", function(ContentService, $stateParams){
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
			.state('app.index.editor.indicator.details',{
				url: '/:entry',
				auth:true,
				layout:'row'
			})
			.state('app.index.create', {
				url: '/create',
				auth:true,
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
				auth:true
			})
			.state('app.index.check', {
				url: '/checking',
				auth:true,
				views:{
					'main@':{
						templateUrl:getView('indexCheck'),
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
				auth:true,
				layout:'row',
				views:{
					'main@':{
						templateUrl:getView('indexMeta'),
						controller: 'IndexMetaCtrl',
						controllerAs: 'vm'
					},
					'sidebar@':{
						templateUrl: '/views/app/indexMeta/indexMetaMenu.html',
						controller: 'IndexMetaMenuCtrl',
						controllerAs: 'vm'
					}
				}
			})
			.state('app.index.final', {
				url: '/final',
				auth:true,
				layout:'row',
				views:{
					'main@':{
						templateUrl:getView('indexFinal'),
						controller: 'IndexFinalCtrl',
						controllerAs: 'vm'
					},
					'sidebar@':{
						templateUrl: '/views/app/indexFinal/indexFinalMenu.html',
						controller: 'IndexFinalMenuCtrl',
						controllerAs: 'vm'
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
							data: ["IndizesService", "$stateParams", function (IndizesService, $stateParams) {
								return IndizesService.fetchData($stateParams.index);
							}],
							countries: ["CountriesService", function(CountriesService){
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
				 url:'/info',
				 views:{
					 'main@':{
						 controller:'IndexinfoCtrl',
						 controllerAs: 'vm',
						 	templateUrl:getView('indexinfo')
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

	angular.module('app.routes').run(["$rootScope", "$mdSidenav", "$timeout", "$auth", "$state", "$localStorage", "leafletData", "toastr", function($rootScope, $mdSidenav, $timeout, $auth, $state,$localStorage,leafletData, toastr){
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

(function(){
    "use strict";

    angular.module('app.services').factory('VectorlayerService', function(){

        return{
          canvas : '',
          palette: [],
          ctx: '',
          keys:{
            mazpen:'vector-tiles-Q3_Os5w',
            mapbox:'pk.eyJ1IjoibWFnbm9sbyIsImEiOiJuSFdUYkg4In0.5HOykKk0pNP1N3isfPQGTQ'
          },
          data:{
            layer: '',
            name:'countries_big',
            iso3:'adm0_a3',
            iso2:'iso_a2',
            iso:'iso_a2',
            fields: "id,admin,adm0_a3,wb_a3,su_a3,iso_a3,iso_a2,name,name_long"
          },
          setLayer: function(l){
            return this.data.layer = l;
          },
          getLayer: function(){
            return this.data.layer;
          },
          getName: function(){
            return this.data.name;
          },
          fields: function() {
            return this.data.fields;
          },
          iso:function(){
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
      			gradient.addColorStop(0.53, color ||  'rgba(128, 243, 198,1)');
      			gradient.addColorStop(0, 'rgba(102,102,102,1)');
      			this.ctx.fillStyle = gradient;
      			this.ctx.fillRect(0, 0, 280, 10);
      			this.palette = this.ctx.getImageData(0, 0, 257, 1).data;
      			//document.getElementsByTagName('body')[0].appendChild(this.canvas);
      		},
      		updateCanvas:function(color) {
      			var gradient = this.ctx.createLinearGradient(0, 0, 280, 10);
      			gradient.addColorStop(1, 'rgba(255,255,255,0)');
      			gradient.addColorStop(0.53, color || 'rgba(128, 243, 198,1)' );
      			gradient.addColorStop(0, 'rgba(102,102,102,1)');
      			this.ctx.fillStyle = gradient;
      			this.ctx.fillRect(0, 0, 280, 10);
      			this.palette = this.ctx.getImageData(0, 0, 257, 1).data;
      			//document.getElementsByTagName('body')[0].appendChild(vm.canvas);
      		},
          getColor: function(value){
            return this.palette[value];
          }


        }
    });

})();

(function(){
    "use strict";

    angular.module('app.services').factory('ContentService', ["DataService", function(DataService){
        //
        return {
          content: {
            indicators:[],
            indicator:{},
            data: [],
            categories:[],
            styles:[],
            infographics:[]
          },
          fetchIndicators: function(filter){
             return this.content.indicators = DataService.getAll('indicators' , filter).$object
          },
          fetchCategories: function(filter){
            return this.content.categories = DataService.getAll('categories' , filter).$object;
          },
          getCategories: function(filter){
            if(this.content.categories.length == 0){
              return this.fetchCategories(filter);
            }
            return this.content.categories;
          },
          getIndicators: function(){
            return this.content.indicators;
          },
          getIndicator: function(id){
            if(this.content.indicators.length){
              for(var i = 0; i < this.content.indicators.length; i++){
                if(this.content.indicators[i].id == id){
                  return this.content.indicators[i];
                }
              }
            }
            else{
              return this.content.indicator = DataService.getOne('indicators/'+id).$object;
            }

          },
          getIndicatorData: function(id){
            return this.content.data = DataService.getAll('indicators/'+id+'/data');
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
          post: post
        };

        function getAll(route, filter){
          var data = Restangular.all(route).getList(filter);
            data.then(function(){}, function(data){
              toastr.error(data.statusText, 'Connection Error');
              console.log(data);
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
            console.log(data);
          });
          return data;
        }
        function put(route, data){
          return Restangular.all(route).put(data);
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
          reduceIsoError:function(){
            return serviceData.iso_errors.splice(0,1);
          },
          reduceError:function(){
            return serviceData.errors.splice(0,1);
          },
          resetToSelect: function(){
            return serviceData.toSelect = [];
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
            return this.user.data = DataService.getAll('me/data').$object;
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

    angular.module('app.controllers').controller('IndexCheckCtrl', ["$scope", "$state", "$filter", "toastr", "DialogService", "IndexService", function($scope,$state, $filter, toastr, DialogService, IndexService){


        var vm = this;
        vm.data = IndexService.getData();
        vm.meta = IndexService.getMeta();
        vm.errors = IndexService.getErrors();
        vm.iso_errors = IndexService.getIsoErrors();
        vm.selected = [];

        vm.deleteData = deleteData;
        vm.deleteSelected = deleteSelected;
        vm.deleteColumn = deleteColumn;
        vm.onOrderChange = onOrderChange;
        vm.onPaginationChange = onPaginationChange;
        vm.checkForErrors = checkForErrors;
        vm.selectErrors = selectErrors;
        vm.showUploadContainer = false;
        //vm.editColumnData = editColumnData;
        vm.editRow = editRow;

        vm.query = {
          filter: '',
          order: '-errors',
          limit: 15,
          page: 1
        };

        activate();

        function activate(){
          checkData();
        }

        function checkData(){
          if(!vm.data){
            $state.go('app.index.create');
          }
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
        function checkForErrors(item){
          return item.errors.length > 0 ? 'md-warn': '';
        }

        /*function editColumnData(e, key){
          vm.toEdit = key;
          DialogService.fromTemplate('editcolumn', $scope);
        }*/
        function deleteColumn(e, key){
          angular.forEach(vm.data, function(item, k){
            angular.forEach(item.data[0], function(field, l){
              if(l == key){
                delete vm.data[k].data[0][key];
              }
            })
          });
          return false;
        }
        function deleteSelected(){
          angular.forEach(vm.selected, function(item, key){
            angular.forEach(item.errors, function(error, k){
              if(error.type == 2 || error.type == 3){
                vm.iso_errors --;
                IndexService.reduceIsoError();
              }
              vm.errors --;
              IndexService.reduceError();
            })
            vm.data.splice(vm.data.indexOf(item), 1);
          });
          vm.selected = [];
          if(vm.data.length == 0){
            vm.deleteData();
            $state.go('app.index.create');
          }
        }
        function selectErrors(){
          vm.selected = [];
          angular.forEach(vm.data, function(item, key){
            if(item.errors.length){
              vm.selected.push(item);
            }
          })
        }
        function editRow(){
          vm.row = vm.selected[0];
          DialogService.fromTemplate('editrow', $scope);
        }
        function deleteData(){
          vm.data = [];
        }

    }]);

})();

(function() {
	"use strict";

	angular.module('app.controllers').controller('IndexCheckSidebarCtrl', ["$scope", "$state", "IndexService", "DataService", "DialogService", "toastr", function($scope, $state, IndexService, DataService, DialogService, toastr) {
		var vm = this;
		vm.data = IndexService.getData();
		vm.meta = IndexService.getMeta();
		vm.errors = IndexService.getErrors();
		vm.iso_errors = IndexService.getIsoErrors();
		vm.clearErrors = clearErrors;
		vm.fetchIso = fetchIso;

		activate();

		function activate() {
			vm.myData = DataService.getAll('me/data');
			checkMyData();
			console.log(vm.meta);
		}

		function checkMyData() {
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
						delete item.data[0][vm.meta.year_field];
					}
					insertData.data.push(item.data[0]);
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
        DataService.getAll('index').then(function(response){
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

(function () {
	"use strict";

	angular.module('app.controllers').controller('IndexCtrl', ["$scope", "$window", "$rootScope", "$filter", "$state", "$timeout", "ToastService", "VectorlayerService", "data", "countries", "leafletData", "DataService", function ($scope, $window, $rootScope,$filter, $state, $timeout, ToastService, VectorlayerService, data, countries, leafletData, DataService) {
		// Variable definitions
		var vm = this;
		vm.map = null;

		vm.dataServer = data.promises.data;
		vm.structureServer = data.promises.structure;
		vm.countryList = countries;

		vm.structure = "";
		vm.mvtScource = VectorlayerService.getLayer();
		vm.mvtCountryLayer = VectorlayerService.getName();
		vm.mvtCountryLayerGeom = vm.mvtCountryLayer+"_geom";
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

		vm.calcTree = calcTree;

		activate();

		function activate() {

			vm.structureServer.then(function(structure){
				vm.dataServer.then(function(data){
					vm.data = data;
					vm.structure = structure;
					if(!vm.structure.style){
						vm.structure.style = {
							'name':'default',
							'title':'Default',
							'base_color':'rgba(128, 243, 198,1)'
						};
					}
					createCanvas(vm.structure.style.base_color);
					drawCountries();
					if($state.params.item){
						vm.setState($state.params.item);
						calcRank();
					}
					if($state.params.countries){
						vm.setTab(2);
						vm.compare.countries.push(vm.current);
						vm.compare.active = true;
						$rootScope.greyed = true;
						var countries = $state.params.countries.split('-vs-');
						angular.forEach(countries, function(iso){
							vm.compare.countries.push(getNationByIso(iso));
						});
						//onsole.log(vm.compare.countries);
						countries.push(vm.current.iso);
						DataService.getOne('countries/bbox', countries).then(function (data) {
							vm.bbox = data;
						});
					}
				})
			});

		}

		function goBack(){
			$window.history.back();
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
				$timeout(function () {
					vm.mvtSource.layers[vm.mvtCountryLayerGeom].features[vm.current.iso].selected = true;
				})
			}
		};
		function calcRank() {
			if(!vm.current){
				return;
			}
			var rank = 0;
			angular.forEach(vm.data, function(item) {
				item[vm.structure.name] = parseFloat(item[vm.structure.name]);
				item['score'] = parseFloat(item[vm.structure.name]);
			});
			vm.data = $filter('orderBy')(vm.data, [vm.structure.name], 'iso', true);
			rank = vm.data.indexOf(vm.current) + 1;
			vm.current[vm.structure.name+'_rank'] = rank;
			vm.circleOptions = {
					color:vm.structure.style.base_color || '#00ccaa',
					field:vm.structure.name+'_rank'
			};
			return rank;
		}
		function getRank(country){

			var rank = vm.data.indexOf(country) + 1;
			return rank;
		}
		function toggleInfo() {
			vm.info = !vm.info;
		};

		function toggleDetails() {
			return vm.details = !vm.details;
		};
		function fetchNationData(iso){
			DataService.getOne('index/'+$state.params.index, iso).then(function (data) {
				vm.current.data = data;
				mapGotoCountry(iso);
			});
		}
		function mapGotoCountry(iso) {
			if(!$state.params.countries){
				DataService.getOne('countries/bbox', [iso]).then(function (data) {
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
				angular.forEach(vm.mvtSource.layers[vm.mvtCountryLayerGeom].features, function (feature) {
					feature.selected = false;
				});
				vm.mvtSource.layers[vm.mvtCountryLayerGeom].features[vm.current.iso].selected = true;
				vm.mvtSource.options.mutexToggle = true;
				vm.mvtSource.setStyle(countriesStyle);
				DataService.getOne('countries/bbox', [vm.current.iso]).then(function (data) {
					vm.bbox = data;
				});
				$state.go('app.index.show.selected',{
					index:$state.params.index,
					item:$state.params.item
				})
			}
			//vm.mvtSource.redraw();
		};

		function toggleCountrieList(country) {
			var found = false;
			angular.forEach(vm.compare.countries, function (nat, key) {
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
			angular.forEach(vm.compare.countries, function (item, key) {
				isos.push(item.iso);
				if(item[vm.structure.iso] != vm.current.iso){
					compare.push(item.iso);
				}
			});
			if (isos.length > 1) {
				DataService.getOne('countries/bbox', isos).then(function (data) {
					vm.bbox = data;
				});
				$state.go('app.index.show.selected.compare',{
					index: $state.params.index,
					item: $state.params.item,
					countries:compare.join('-vs-')
				});
			}

			return !found;
		};

		function getOffset() {
			if (!vm.current) {
				return 0;
			}
			//console.log(vm.getRank(vm.current));
			return (vm.getRank(vm.current) - 2) * 17;
		};

		function getTendency() {
			if (!vm.current) {
				return 'arrow_drop_down'
			}
			return vm.current.percent_change > 0 ? 'arrow_drop_up' : 'arrow_drop_down';
		};

		function setTab(i) {
			vm.activeTab = i;
		}

		function getParent(data) {
			var items = [];
			angular.forEach(data.children, function (item) {
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

		function getNationByName(name) {
			var nation = {};
			angular.forEach(vm.data, function (nat) {
				if (nat.country == name) {
					nation = nat;
				}
			});
			return nation;
		};

		function getNationByIso(iso) {
			var nation = {};
			angular.forEach(vm.data, function (nat) {
				if (nat.iso == iso) {
					nation = nat;
				}
			});

			return nation;
		};

		function createCanvas(color) {

			vm.canvas = document.createElement('canvas');
			vm.canvas.width = 280;
			vm.canvas.height = 10;
			vm.ctx = vm.canvas.getContext('2d');
			var gradient = vm.ctx.createLinearGradient(0, 0, 280, 10);
			gradient.addColorStop(1, 'rgba(255,255,255,0)');
			gradient.addColorStop(0.53, color ||  'rgba(128, 243, 198,1)');
			gradient.addColorStop(0, 'rgba(102,102,102,1)');
			vm.ctx.fillStyle = gradient;
			vm.ctx.fillRect(0, 0, 280, 10);
			vm.palette = vm.ctx.getImageData(0, 0, 257, 1).data;
			//document.getElementsByTagName('body')[0].appendChild(vm.canvas);
		}

		function updateCanvas(color) {
			var gradient = vm.ctx.createLinearGradient(0, 0, 280, 10);
			gradient.addColorStop(1, 'rgba(255,255,255,0)');
			gradient.addColorStop(0.53, color || 'rgba(128, 243, 198,1)' );
			gradient.addColorStop(0, 'rgba(102,102,102,1)');
			vm.ctx.fillStyle = gradient;
			vm.ctx.fillRect(0, 0, 280, 10);
			vm.palette = vm.ctx.getImageData(0, 0, 257, 1).data;
			//document.getElementsByTagName('body')[0].appendChild(vm.canvas);
		};

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

		function countriesStyle(feature) {

			var style = {};
			var iso = feature.properties[vm.iso_field];

			var nation = getNationByIso(iso);
			var field = vm.structure.name || 'score';
			var type = feature.type;
			if(iso != vm.current.iso){
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
		};

		$scope.$watch('vm.current', function (n, o) {
			if (n === o) {
				return;
			}

			if(n.iso) {
				if(o.iso){
					vm.mvtSource.layers[vm.mvtCountryLayerGeom].features[o.iso].selected = false;
				}
				calcRank();
				fetchNationData(n.iso);
				vm.mvtSource.layers[vm.mvtCountryLayerGeom].features[n.iso].selected = true;
				if($state.current.name == 'app.index.show.selected' || $state.current.name == 'app.index.show'){
					$state.go('app.index.show.selected', {
						index: $state.params.index,
						item: n.iso
					});
				}
			} else {
				$state.go('app.index.show',{
					index: $state.params.index
				});
			}
		});
		$scope.$watch('vm.display.selectedCat', function (n, o) {
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
				if($state.params.countries){
					$state.go('app.index.show.selected.compare', {
						index: n.name,
						item: vm.current.iso,
						countries: $state.params.countries
					})
				}
				else{
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
		$scope.$watch('vm.bbox', function (n, o) {
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
				[100,100]
			];
			if (vm.compare.active) {
				pad = [
					[0, 0],
					[0, 0]
				];
			}
			vm.map.fitBounds(bounds, {
				padding:pad[1],
				maxZoom: 6
			});
		});

		$scope.$on("$stateChangeSuccess", function (event, toState, toParams, fromState, fromParams) {

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

		function drawCountries() {
			leafletData.getMap('map').then(function (map) {
				vm.map = map;
				vm.mvtSource = VectorlayerService.getLayer();
				$timeout(function () {
					if($state.params.countries){
						vm.mvtSource.options.mutexToggle = false;
						vm.mvtSource.setStyle(invertedStyle);
						vm.mvtSource.layers[vm.mvtCountryLayerGeom].features[vm.current.iso].selected = true;
						var countries = $state.params.countries.split('-vs-');
						angular.forEach(countries, function(iso){
							vm.mvtSource.layers[vm.mvtCountryLayerGeom].features[iso].selected = true;
						});

					}
					else{
						vm.mvtSource.setStyle(countriesStyle);
						if($state.params.item){
								vm.mvtSource.layers[vm.mvtCountryLayerGeom].features[$state.params.item].selected = true;
						}
					}
					//vm.mvtSource.redraw();
				});
				vm.mvtSource.options.onClick = function (evt, t) {
					if (!vm.compare.active) {
						var c = getNationByIso(evt.feature.properties[vm.iso_field]);
						if (typeof c[vm.structure.name] != "undefined") {
							vm.current = getNationByIso(evt.feature.properties[vm.iso_field]);
						} else {
							ToastService.error('No info about this location!');
						}
					} else {
						console.log(evt);
						var c = getNationByIso(evt.feature.properties[vm.iso_field]);
						if (typeof c[vm.structure.name] != "undefined") {
							vm.toggleCountrieList(c);
						} else {
							ToastService.error('No info about this location!');
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
			if (vm.meta.year_field) {
				vm.meta.year = vm.data[0].data[0][vm.meta.year_field];
			}
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
				var insertMeta = [],
					fields = [];
				vm.loading = true;
				angular.forEach(vm.data, function (item, key) {
					if (item.errors.length == 0) {
						item.data[0].year = vm.meta.year;
						if(vm.meta.year_field && vm.meta.year_field != "year") {
							delete item.data[0][vm.meta.year_field];
						}
						vm.meta.iso_type = item.data[0][vm.meta.iso_field].length == 3 ? 'iso-3166-1' : 'iso-3166-2';
						insertData.data.push(item.data[0]);

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
				console.log(vm.meta);
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
          //IndexService.setActiveIndicatorData(n);
          IndexService.setToLocalStorage();
        },true);


        function minMax(){
          vm.min = 10000000;
          vm.max = 0;
          angular.forEach(vm.data, function(item, key){
              vm.min = Math.min(item.data[0][vm.indicator.column_name], vm.min);
              vm.max = Math.max(item.data[0][vm.indicator.column_name], vm.max);
          });
          vm.scale = d3.scale.linear().domain([vm.min,vm.max]).range([0,100]);
        }
        function getValueByIso(iso){
          var value = 0;
          angular.forEach(vm.data, function(item, key){
             if(item.data[0][vm.meta.iso_field] == iso){
               value = item.data[0][vm.indicator.column_name];
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
          vm.mvtSource.redraw()
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

    angular.module('app.controllers').controller('IndexMetaMenuCtrl', ["$scope", "DataService", "DialogService", "IndexService", function($scope,DataService,DialogService, IndexService){
      var vm = this;
      vm.data = IndexService.getData();
      vm.meta = IndexService.getMeta();
      vm.indicators = IndexService.getIndicators();
      vm.selectForEditing = selectForEditing;
      vm.checkFull = checkFull;
      vm.checkBas = checkBase;

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
      $scope.$watch(function(){ return IndexService.activeIndicator()}, function(n,o){
        if(n === o)return;
        vm.indicators[n.column_name] = n;
      },true);
      $scope.$watch(function(){ return IndexService.activeIndicator()}, function(n,o){
        if (n === o || typeof o == "undefined") return;
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
      vm.data = UserService.myData();
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

	angular.module('app.controllers').controller('IndexeditorCtrl', ["$scope", "$filter", "$timeout", "$state", "indicators", "DataService", "ContentService", function ($scope, $filter, $timeout,$state, indicators, DataService,ContentService) {
		//
		var vm = this;

		vm.indicators = indicators;
		vm.selection = [];
		vm.selectedTab = 1;
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
		vm.selectAll = selectAll;
		vm.selectAllGroup = selectAllGroup;
		vm.selectedItem = selectedItem;
		vm.toggleSelection = toggleSelection;
		vm.loadIndicators = loadIndicators;


		vm.toggleList = toggleList;

		vm.checkTabContent = checkTabContent;

		activate($state.params);

		function activate(params){
			vm.selection = [];

			angular.forEach(vm.indicators, function(item){
				if(item.id == params.id){
					vm.selection.push(item);
				}
			});
		}

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
		}
		function loadIndicators() {

		}
		function checkTabContent(index){
			switch (index) {
				case 0:

					break;
				case 1:
						vm.categories = ContentService.getCategories({indicators:true, tree:true});
					break;
				case 2:
						vm.composits = DataService.getAll('me/indizes').$object;
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
		$scope.$on('$stateChangeSuccess', function(fromParams, fromState, toParams, toState){
			activate(toParams);
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

(function(){
    "use strict";
    angular.module('app.controllers').controller('IndexinfoCtrl', ["IndizesService", function(IndizesService){
        var vm = this;
        vm.structure = IndizesService.getStructure();
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

    angular.module('app.controllers').controller('CopyproviderCtrl', ["$scope", "IndexService", "DialogService", function($scope, IndexService, DialogService){
        $scope.$parent.vm.askedToReplicate = true;
        $scope.$parent.vm.doProviders = true;
        $scope.$parent.vm.doStyle = true;
        $scope.$parent.vm.doCategories = true;
        $scope.$parent.vm.doMeasures = true;
        $scope.$parent.vm.doPublic = true;
        $scope.save = function(){

          angular.forEach($scope.$parent.vm.data[0].data[0], function(data, key){
            if(key != "year"){


            if(typeof IndexService.getIndicator(key) == "undefined"){
              IndexService.setIndicator(key,{
                column_name:key,
                title:key
              });
            }
            var item = IndexService.getIndicator(key);
            if($scope.$parent.vm.doProviders){
              item.dataprovider =  $scope.$parent.vm.preProvider ;
            }
            if($scope.$parent.vm.doMeasures){
                item.type = $scope.$parent.vm.preType ;
            }
            if($scope.$parent.vm.doCategories){
                item.categories = $scope.$parent.vm.preCategories;
            }
            if($scope.$parent.vm.doPublic){
              item.is_public =  $scope.$parent.vm.prePublic;
            }
            if($scope.$parent.vm.doStyle){

              if(typeof item.style != "undefined"){
                item.style = $scope.$parent.vm.preStyle;
                item.style_id = $scope.$parent.vm.preStyle.id;
              }

            }
          }
          });
          IndexService.setToLocalStorage();
          DialogService.hide();
        };

        $scope.hide = function(){
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
							var d = {
								type: group.name,
								name: group.title,
								group: group.name,
								color: group.color,
								icon: group.icon,
								unicode: IconsService.getUnicode(group.icon),
								data: group,
								children:group.children
							};
							labels.push(d);
							angular.forEach(group.children, function (item) {
								if (scope.chartdata[item.name]) {
									var node = {
										type: item.name,
										radius: scope.chartdata[item.name] / scope.sizefactor,
										value: scope.chartdata[item.name],
										name: item.title,
										group: group.name,
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
						});
						create_groups();

					}
					else{
						var d = {
							type: scope.indexer.name,
							name: scope.indexer.title,
							group: scope.indexer.name,
							color: scope.indexer.color,
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
					content = "<span class=\"title\">" + data.name + "</span><br/>";
					angular.forEach(data.data.children, function (info) {
						content += "<span class=\"name\" style=\"color:" + (info.color || data.color) + "\"> " + (info.title) + "</span><br/>";
					});
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

(function(){
	"use strict";

	angular.module( 'app.controllers' ).controller( 'CategoriesCtrl', ["$filter", "toastr", "DataService", function($filter, toastr, DataService){
		//
		var vm = this;
		vm.saveCategory = saveCategory;
		vm.querySearchCategory = querySearchCategory;

		function querySearchCategory(query) {
			console.log($filter('flatten')(vm.categories));
			return $filter('findbyname')($filter('flatten')(vm.categories), query, 'title');
		}

		function saveCategory(valid){
			if(valid){
				DataService.post('categories', vm.category).then(function(data){
					vm.categories.push(data);
					vm.createCategory = false;
					vm.item.categories.push(data);
					toastr.success('New Category has been saved','Success');
				});
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
				options: '='
			},
			require: 'ngModel',
			link: function ($scope, element, $attrs, ngModel) {
				//Fetching Options

				$scope.options = angular.extend(defaults(), $scope.options);

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
						return 'N°' + d;
					})
					.style("fill", $scope.options.color)
					.style('font-weight', 'bold')
					.attr('text-anchor', 'middle')
					.attr('y', '0.35em');

				//Transition if selection has changed
				function animateIt(radius) {
					circleGraph.transition()
						.duration(750)
						.call(arcTween, rotate(radius) * 2 * Math.PI);
					text.transition().duration(750).tween('text', function (d) {
						var data = this.textContent.split('N°');
						var i = d3.interpolate(parseInt(data[1]), radius);
						return function (t) {
							this.textContent = 'N°' + (Math.round(i(t) * 1) / 1);
						};
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

				$scope.$watch('options', function (n, o) {
					if (n === o) {
						return;
					}
					circleBack.style('stroke', n.color);
					circleGraph.style('fill', n.color);
					text.style('fill', n.color);
					$timeout(function () {
						animateIt(ngModel.$modelValue[n.field])
					});
				});

				//Watching if selection has changed from another UI element
				$scope.$watch(
					function () {
						return ngModel.$modelValue;
					},
					function (n, o) {
						if (!n) {
							n = {};
							n[$scope.options.field] = $scope.options.size;
						}
						$timeout(function () {
							animateIt(n[$scope.options.field]);
						});
					});
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
			bindToController: {
				item: '=',
				composits: '=',
				options:'=',
				save: '&'
			},
			link: function( scope, element, attrs ){
				//
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
				options = angular.extend(options, $scope.options);
				options.unique = new Date().getTime();
				if(options.color){
					options.colors[1].color = options.color;
				}
				element.css('height', options.height + 'px').css('border-radius', options.height / 2 + 'px');
				var max = 0;
				angular.forEach($scope.data, function (nat, key) {
					max = d3.max([max, parseInt(nat[options.field])]);
				});
				var x = d3.scale.linear()
					.domain([0, max])
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
						.text(0)
						.style('font-size', options.height/2.5)
						.attr('text-anchor', 'middle')
						.attr('y', '.35em')
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
					/*do {

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
					ngModel.$render();*/
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
					handleLabel.text(parseInt(ngModel.$modelValue[n.field]));
					handleCont.transition().duration(500).ease('quad').attr("transform", 'translate(' + x(ngModel.$modelValue[n.field]) + ',' + options.height / 2 + ')');
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

	angular.module('app.directives').directive( 'parsecsv', ["$state", "$timeout", "toastr", "IndexService", function($state, $timeout, toastr, IndexService) {

		return {
			restrict: 'EA',
			templateUrl: 'views/directives/parsecsv/parsecsv.html',
			controller: 'ParsecsvCtrl',
			replace:true,
			link: function( $scope, element, $attrs ){
				//

				$scope.$watch('file', function(n,o){
					if(n===o) return false;
					console.log(n);
				})
				var errors = 0;
				var stepped = 0, rowCount = 0, errorCount = 0, firstError;
				var start, end;
				var firstRun = true;
				var maxUnparseLength = 10000;
				var button = element.find('button');
					var input = element.find('input');
					var isVertical = false;
					var raw = [];
					var rawList = {};
					input.css({ display:'none' });
					button.bind('click', function() {
							input[0].click();
					});
					input.bind('change',function(e){
						isVertical = false;
						raw = [];
						rawList = {};

						errors = [];
						stepped = 0, rowCount = 0, errorCount = 0, firstError;
						start, end;
						firstRun = true;
							$timeout(function(){
								IndexService.clear();
								var csv = Papa.parse(input[0].files[0],{
									skipEmptyLines: true,
									header:true,
									dynamicTyping: true,
									step:function(row){
										angular.forEach(row.data[0], function(item, key){
											if(isNaN(item) || item < 0 ){
												if(item.toString().toUpperCase() == "#NA" || item < 0 || item.toString().toUpperCase().indexOf('N/A') > -1){
													var error = {
														type:"1",
														message:"Field in row is not valid for database use!",
														column: key,
														value: item
													};
													row.errors.push(error)
													errors.push(error);
												}
											}
										});
										if(isVertical){
											angular.forEach(row.data[0], function(item, key){
												if(key.length == 3){
													if(typeof	rawList[key].data == "undefined"){
															rawList[key].data = [];
													}
													rawList[key].data.push(item);
												}
											});
											//rawList[key].errors = row.errors;
										}
										else{
											IndexService.addData(row);
										}
										//console.log(row);

									},
									beforeFirstChunk: function(chunk)
									{

										//Check if there are points in the headers
										var index = chunk.match( /\r\n|\r|\n/ ).index;
											var delimiter = ',';
								    var headings = chunk.substr(0, index).split( ',' );

										if(headings.length < 2){
 											headings = chunk.substr(0, index).split( "\t" );
											delimiter = '\t';
										}
										var isIso = [];

										for(var i = 0; i <= headings.length; i++){
											if(headings[i]){
												headings[i] = headings[i].replace(/[^a-z0-9]/gi,'_').toLowerCase();
												if(headings[i].indexOf('.') > -1){
													headings[i] = headings[i].substr(0, headings[i].indexOf('.'));
												}
												var head = headings[i].split('_');
												if(head.length > 1){
													headings[i] = '';
													for(var j = 0; j < head.length; j++){
														if(isNaN(head[j])){
															if(j > 0){
																headings[i] += '_';
															}
															headings[i] += head[j];
														}
													}
												}

												if(headings[i].length == 3){
													isIso.push(true);
												}
											}
										}
										if(headings.length == isIso.length){
											isVertical = true;
												for(var i = 0; i <= headings.length; i++){
													if(typeof rawList[headings[i]] == "undefined"){
														rawList[headings[i]] = {};
													}
													rawList[headings[i]].data = [];
												}
										}

								    return headings.join(delimiter) + chunk.substr(index);
									},
									error: function(err, file)
									{
										ToastService.error(err);
									},
									complete: function(results)
									{
										IndexService.setErrors(errors);

										//See if there is an field name "iso" in the headings;
										if(!isVertical){
											angular.forEach(IndexService.getFirstEntry().data[0], function(item, key){
												if(key.toLowerCase().indexOf('iso') != -1 || key.toLowerCase().indexOf('code') != -1){
													IndexService.setIsoField(key);
												}
													if(key.toLowerCase().indexOf('country') != -1){
														IndexService.setCountryField(key);
													}
													if(key.toLowerCase().indexOf('year') != -1 && item.toString().length == 4){
														IndexService.setYearField(key);
													}
											});
										}
										else{
											angular.forEach(rawList, function(item,key){
												item.errors = [];
												if(key.toLowerCase() != "undefined" && typeof key != "undefined"){
													var r = {iso:key.toUpperCase()};
													angular.forEach(item.data, function(column, i){
														r['column_'+i] = column;
														if(isNaN(column) || column < 0 ){
															if(column.toString().toUpperCase() == "NA" || column < 0 || column.toString().toUpperCase().indexOf('N/A') > -1){
																item.errors.push({
																	type:"1",
																	message:"Field in row is not valid for database use!",
																	column: item
																})
																errors++;
															}
														}
													});
													IndexService.addData({data:[r], errors:item.errors});
												}
											});
											IndexService.setIsoField('iso');
										}


										IndexService.setToLocalStorage();
										toastr.info(IndexService.getDataSize()+' lines importet!', 'Information');
										$state.go('app.index.check');
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

	angular.module('app.directives').directive( 'simplelinechart', function() {
		var defaults = function(){
			return {
				invert:false
			}
		}
		return {
			restrict: 'E',
			scope:{
				data:'=',
				selection:'=',
				options:'='
			},
			templateUrl: 'views/directives/simplelinechart/simplelinechart.html',
			controller: 'SimplelinechartCtrl',
			link: function( $scope, element, $attrs ){
				$scope.options = angular.extend(defaults(), $scope.options);
				$scope.calculateGraph();
				$scope.setChart();
			}
		};

	});

})();

(function () {
	"use strict";

	angular.module('app.controllers').controller('SimplelinechartCtrl', ["$scope", function ($scope) {
		$scope.config = {
			visible: true, // default: true
			extended: false, // default: false
			disabled: false, // default: false
			autorefresh: true, // default: true
			refreshDataOnly: false, // default: false
			deepWatchOptions: true, // default: true
			deepWatchData: false, // default: false
			deepWatchConfig: true, // default: true
			debounce: 10 // default: 10
		};
		$scope.chart = {
			options: {
				chart: {}
			},
			data: []
		};
		$scope.setChart = function () {
			$scope.chart.options.chart = {
				type: 'lineChart',
				legendPosition: 'left',
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
				showYAxis: false,
				transitionDuration: 500,
				useInteractiveGuideline: true,
				//forceY: [100, 0],
				//yDomain:yDomain,
				xAxis: {
					axisLabel: ''
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
			if ($scope.options.invert == true) {
				$scope.chart.options.chart.yDomain = [parseInt($scope.range.max), $scope.range.min];
			}
			return $scope.chart;
		}
		$scope.calculateGraph = function () {
			var chartData = [];
			$scope.range = {
				max: 0,
				min: 1000
			};
			angular.forEach($scope.selection, function (item, key) {
				var graph = {
					id: key,
					key: item.title,
					color: item.color,
					values: []
				};
				angular.forEach($scope.data, function (data, k) {
					graph.values.push({
						id: k,
						x: data[item.fields.x],
						y: data[item.fields.y]
					});
					$scope.range.max = Math.max($scope.range.max, data[item.fields.y]);
					$scope.range.min = Math.min($scope.range.min, data[item.fields.y]);
				});
				chartData.push(graph);
			});

			$scope.chart.data = chartData;
			if ($scope.options.invert == "true") {
				$scope.chart.options.chart.yDomain = [parseInt($scope.range.max), $scope.range.min];
			}
		};
		$scope.$watch('data', function (n, o) {
			if (!n) {
				return;
			}
			$scope.calculateGraph();
		});
		$scope.$watch('selection', function (n, o) {
			if (n === o) {
				return;
			}
			$scope.calculateGraph();
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

	angular.module('app.directives').directive( 'treeview', ["RecursionHelper", function(RecursionHelper) {

		return {
			restrict: 'E',
			templateUrl: 'views/directives/treeview/treeview.html',
			controller: 'TreeviewCtrl',
			controllerAs: 'vm',
			scope:{},
			bindToController: {
				items: '=',
				item: '=',
				options:'='
			},
			replace:true,
			compile: function(element) {
            return RecursionHelper.compile(element, function(scope, iElement, iAttrs, controller, transcludeFn){
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
		vm.toggleItem = toggleItem;
		vm.onDragOver = onDragOver;
		vm.onDropComplete = onDropComplete;
		vm.onMovedComplete = onMovedComplete;
		vm.addChildren = addChildren;

		function onDragOver(event, index, external, type) {
			console.log(event, index, external, type);
			return true;
		}

		function onDropComplete(event, index, item, external) {
			console.log(event, index, item, external);
			return item;
		}

		function onMovedComplete(index, data, evt) {

			return vm.items.splice(index, 1);
		}

		function addChildren(item) {

			item.children = [{
				id: 0,
				title: 'Drop Items here...'
			}];
			item.expanded = true;
		}

		function selectedItem(item) {
			if (typeof vm.item === "undefined") return false;
			var found = false;
			angular.forEach(vm.item[vm.options.type], function(entry, key) {
				if (entry.id == item.id) {
					found = true;
				}
			});
			return found;
		}

		function childSelected(children) {
			var found = false;
			angular.forEach($filter('flatten')(children), function(child) {
				if (selectedItem(child)) {
					found = true;
				}
			});
			return found;
		}

		function toggleItem(item) {
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
		}
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
			if (typeof vm.item.weight == "undefined") {
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
			if (vm.item.weight % 5 != 0) {
				vm.item.weight = 5 * Math.round(vm.item.weight / 5);
			} else {
				vm.item.weight += 5;
			}
			calcValues();
		}

		function lowerWeight() {
			if (vm.item.weight % 5 != 0) {
				vm.item.weight = 5 * Math.round(vm.item.weight / 5) - 5;
			} else {
				vm.item.weight -= 5;
			}
			calcValues();
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiLCJyb3V0ZXMuanMiLCJyb3V0ZXMucnVuLmpzIiwiY29uZmlnL2F1dGguanMiLCJjb25maWcvbG9hZGluZ19iYXIuanMiLCJjb25maWcvcmVzdGFuZ3VsYXIuanMiLCJjb25maWcvdGhlbWUuanMiLCJjb25maWcvdG9hc3RyLmpzIiwiZmlsdGVycy9hbHBoYW51bS5qcyIsImZpbHRlcnMvY2FwaXRhbGl6ZS5qcyIsImZpbHRlcnMvZmluZGJ5bmFtZS5qcyIsImZpbHRlcnMvaHVtYW5fcmVhZGFibGUuanMiLCJmaWx0ZXJzL3RydW5jYXRlX2NoYXJhY3RlcnMuanMiLCJmaWx0ZXJzL3RydW5jYXRlX3dvcmRzLmpzIiwiZmlsdGVycy90cnVzdF9odG1sLmpzIiwiZmlsdGVycy91Y2ZpcnN0LmpzIiwic2VydmljZXMvVmVjdG9ybGF5ZXIuanMiLCJzZXJ2aWNlcy9jb250ZW50LmpzIiwic2VydmljZXMvY291bnRyaWVzLmpzIiwic2VydmljZXMvZGF0YS5qcyIsInNlcnZpY2VzL2RpYWxvZy5qcyIsInNlcnZpY2VzL2ljb25zLmpzIiwic2VydmljZXMvaW5kZXguanMiLCJzZXJ2aWNlcy9pbmRpemVzLmpzIiwic2VydmljZXMvcmVjdXJzaW9uaGVscGVyLmpzIiwic2VydmljZXMvdG9hc3QuanMiLCJzZXJ2aWNlcy91c2VyLmpzIiwiYXBwL0luZGV4Q2hlY2svSW5kZXhDaGVjay5qcyIsImFwcC9JbmRleENoZWNrL2luZGV4Q2hlY2tTaWRlYmFyLmpzIiwiYXBwL2hlYWRlci9oZWFkZXIuanMiLCJhcHAvaG9tZS9ob21lLmpzIiwiYXBwL2ltcG9ydGNzdi9pbXBvcnRjc3YuanMiLCJhcHAvaW5kZXgvaW5kZXguanMiLCJhcHAvaW5kZXgvaW5kZXhiYXNlLmpzIiwiYXBwL2luZGV4RmluYWwvaW5kZXhGaW5hbC5qcyIsImFwcC9pbmRleEZpbmFsL2luZGV4RmluYWxNZW51LmpzIiwiYXBwL2luZGV4TWV0YS9pbmRleE1ldGEuanMiLCJhcHAvaW5kZXhNZXRhL2luZGV4TWV0YU1lbnUuanMiLCJhcHAvaW5kZXhNeURhdGEvaW5kZXhNeURhdGEuanMiLCJhcHAvaW5kZXhNeURhdGEvaW5kZXhNeURhdGFFbnRyeS5qcyIsImFwcC9pbmRleE15RGF0YS9pbmRleE15RGF0YU1lbnUuanMiLCJhcHAvaW5kZXhjcmVhdG9yL2luZGV4Y3JlYXRvci5qcyIsImFwcC9pbmRleGVkaXRvci9pbmRleGVkaXRvci5qcyIsImFwcC9pbmRleGVkaXRvci9pbmRpY2F0b3IuanMiLCJhcHAvaW5kZXhpbmZvL2luZGV4aW5mby5qcyIsImFwcC9sb2dpbi9sb2dpbi5qcyIsImFwcC9zZWxlY3RlZC9zZWxlY3RlZC5qcyIsImFwcC9zaWRlYmFyL3NpZGViYXIuanMiLCJhcHAvc2lnbnVwL3NpZ251cC5qcyIsImFwcC90b2FzdHMvdG9hc3RzLmpzIiwiYXBwL3Vuc3VwcG9ydGVkX2Jyb3dzZXIvdW5zdXBwb3J0ZWRfYnJvd3Nlci5qcyIsImFwcC91c2VyL3VzZXIuanMiLCJkaWFsb2dzL2FkZFByb3ZpZGVyL2FkZFByb3ZpZGVyLmpzIiwiZGlhbG9ncy9hZGRVbml0L2FkZFVuaXQuanMiLCJkaWFsb2dzL2FkZF91c2Vycy9hZGRfdXNlcnMuanMiLCJkaWFsb2dzL2NvcHlwcm92aWRlci9jb3B5cHJvdmlkZXIuanMiLCJkaWFsb2dzL2VkaXRjb2x1bW4vZWRpdGNvbHVtbi5qcyIsImRpYWxvZ3MvZWRpdHJvdy9lZGl0cm93LmpzIiwiZGlhbG9ncy9leHRlbmREYXRhL2V4dGVuZERhdGEuanMiLCJkaWFsb2dzL2xvb3NlZGF0YS9sb29zZWRhdGEuanMiLCJkaWFsb2dzL3NlbGVjdGlzb2ZldGNoZXJzL3NlbGVjdGlzb2ZldGNoZXJzLmpzIiwiZGlyZWN0aXZlcy9hdXRvRm9jdXMvZGVmaW5pdGlvbi5qcyIsImRpcmVjdGl2ZXMvYnViYmxlcy9idWJibGVzLmpzIiwiZGlyZWN0aXZlcy9idWJibGVzL2RlZmluaXRpb24uanMiLCJkaXJlY3RpdmVzL2NhdGVnb3JpZXMvY2F0ZWdvcmllcy5qcyIsImRpcmVjdGl2ZXMvY2F0ZWdvcmllcy9kZWZpbml0aW9uLmpzIiwiZGlyZWN0aXZlcy9jaXJjbGVncmFwaC9jaXJjbGVncmFwaC5qcyIsImRpcmVjdGl2ZXMvY2lyY2xlZ3JhcGgvZGVmaW5pdGlvbi5qcyIsImRpcmVjdGl2ZXMvY29tcG9zaXRzL2NvbXBvc2l0cy5qcyIsImRpcmVjdGl2ZXMvY29tcG9zaXRzL2RlZmluaXRpb24uanMiLCJkaXJlY3RpdmVzL2ZpbGVEcm9wem9uZS9kZWZpbml0aW9uLmpzIiwiZGlyZWN0aXZlcy9maWxlRHJvcHpvbmUvZmlsZURyb3B6b25lLmpzIiwiZGlyZWN0aXZlcy9oaXN0b3J5L2RlZmluaXRpb24uanMiLCJkaXJlY3RpdmVzL2hpc3RvcnkvaGlzdG9yeS5qcyIsImRpcmVjdGl2ZXMvaW5kaWNhdG9yL2RlZmluaXRpb24uanMiLCJkaXJlY3RpdmVzL2luZGljYXRvci9pbmRpY2F0b3IuanMiLCJkaXJlY3RpdmVzL2luZGljYXRvck1lbnUvZGVmaW5pdGlvbi5qcyIsImRpcmVjdGl2ZXMvaW5kaWNhdG9yTWVudS9pbmRpY2F0b3JNZW51LmpzIiwiZGlyZWN0aXZlcy9tZWRpYW4vZGVmaW5pdGlvbi5qcyIsImRpcmVjdGl2ZXMvbWVkaWFuL21lZGlhbi5qcyIsImRpcmVjdGl2ZXMvcGFyc2Vjc3YvZGVmaW5pdGlvbi5qcyIsImRpcmVjdGl2ZXMvcGFyc2Vjc3YvcGFyc2Vjc3YuanMiLCJkaXJlY3RpdmVzL3NpbXBsZWxpbmVjaGFydC9kZWZpbml0aW9uLmpzIiwiZGlyZWN0aXZlcy9zaW1wbGVsaW5lY2hhcnQvc2ltcGxlbGluZWNoYXJ0LmpzIiwiZGlyZWN0aXZlcy9zbGlkZVRvZ2dsZS9kZWZpbml0aW9uLmpzIiwiZGlyZWN0aXZlcy9zbGlkZVRvZ2dsZS9zbGlkZVRvZ2dsZS5qcyIsImRpcmVjdGl2ZXMvc3R5bGVzL2RlZmluaXRpb24uanMiLCJkaXJlY3RpdmVzL3N0eWxlcy9zdHlsZXMuanMiLCJkaXJlY3RpdmVzL3N1YmluZGV4L2RlZmluaXRpb24uanMiLCJkaXJlY3RpdmVzL3N1YmluZGV4L3N1YmluZGV4LmpzIiwiZGlyZWN0aXZlcy9zdW5idXJzdC9kZWZpbml0aW9uLmpzIiwiZGlyZWN0aXZlcy9zdW5idXJzdC9zdW5idXJzdC5qcyIsImRpcmVjdGl2ZXMvdHJlZXZpZXcvZGVmaW5pdGlvbi5qcyIsImRpcmVjdGl2ZXMvdHJlZXZpZXcvdHJlZXZpZXcuanMiLCJkaXJlY3RpdmVzL3dlaWdodC9kZWZpbml0aW9uLmpzIiwiZGlyZWN0aXZlcy93ZWlnaHQvd2VpZ2h0LmpzIiwiYXBwL21hcC9tYXAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsSUFBQSxNQUFBLFFBQUEsT0FBQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBOzs7O0VBSUEsUUFBQSxPQUFBLGNBQUEsQ0FBQSxhQUFBLGFBQUE7RUFDQSxRQUFBLE9BQUEsbUJBQUEsQ0FBQSxXQUFBLGlCQUFBLGdCQUFBLGNBQUEsZ0JBQUEsWUFBQSxVQUFBLFNBQUEsYUFBQSxpQkFBQSxjQUFBLGFBQUEsZUFBQSxhQUFBLHVCQUFBLGNBQUEsY0FBQSxvQkFBQTtFQUNBLFFBQUEsT0FBQSxlQUFBO0VBQ0EsUUFBQSxPQUFBLGdCQUFBLENBQUEsZ0JBQUEsYUFBQSxhQUFBLGVBQUE7RUFDQSxRQUFBLE9BQUEsa0JBQUEsQ0FBQSxhQUFBO0VBQ0EsUUFBQSxPQUFBLGNBQUE7Ozs7QUNuQkEsQ0FBQSxZQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGNBQUEscUVBQUEsVUFBQSxnQkFBQSxvQkFBQSxtQkFBQTs7RUFFQSxJQUFBLFVBQUEsVUFBQSxVQUFBO0dBQ0EsT0FBQSxnQkFBQSxXQUFBLE1BQUEsV0FBQTs7O0VBR0EsbUJBQUEsVUFBQTs7RUFFQTtJQUNBLE1BQUEsT0FBQTtJQUNBLFVBQUE7SUFDQSxPQUFBO0tBQ0EsUUFBQTtNQUNBLGFBQUEsUUFBQTtNQUNBLFlBQUE7TUFDQSxjQUFBOztLQUVBLE1BQUE7S0FDQSxRQUFBO01BQ0EsYUFBQSxRQUFBO01BQ0EsWUFBQTtNQUNBLGNBQUE7Ozs7SUFJQSxNQUFBLFdBQUE7SUFDQSxJQUFBO0lBQ0EsTUFBQTtLQUNBLFdBQUE7TUFDQSxhQUFBLFFBQUE7TUFDQSxZQUFBO01BQ0EsY0FBQTs7OztJQUlBLE1BQUEsWUFBQTtJQUNBLEtBQUE7SUFDQSxVQUFBOzs7SUFHQSxNQUFBLGtCQUFBO0lBQ0EsS0FBQTtJQUNBLE9BQUE7S0FDQSxTQUFBO01BQ0EsYUFBQSxRQUFBO01BQ0EsWUFBQTtNQUNBLGNBQUE7Ozs7OztJQU1BLE1BQUEsb0JBQUE7SUFDQSxLQUFBO0lBQ0EsS0FBQTtJQUNBLE9BQUE7S0FDQSxTQUFBO01BQ0EsYUFBQSxRQUFBO01BQ0EsWUFBQTtNQUNBLGNBQUE7TUFDQSxTQUFBO09BQ0Esa0NBQUEsVUFBQSxhQUFBLE9BQUE7UUFDQSxPQUFBLFlBQUEsT0FBQSxNQUFBOzs7Ozs7O0lBT0EsTUFBQSxhQUFBO0lBQ0EsVUFBQTtJQUNBLEtBQUE7OztJQUdBLE1BQUEsb0JBQUE7SUFDQSxJQUFBO0lBQ0EsS0FBQTtJQUNBLE1BQUE7S0FDQSxXQUFBO01BQ0EsWUFBQTtNQUNBLFlBQUE7TUFDQSxjQUFBOztLQUVBLFFBQUE7TUFDQSxZQUFBLFFBQUE7TUFDQSxZQUFBO01BQ0EsY0FBQTs7OztJQUlBLE1BQUEsMEJBQUE7SUFDQSxJQUFBO0lBQ0EsS0FBQTtJQUNBLE1BQUE7S0FDQSxXQUFBO01BQ0EsWUFBQTtNQUNBLFlBQUE7TUFDQSxjQUFBOztLQUVBLFFBQUE7T0FDQSxZQUFBO09BQ0EsWUFBQTtPQUNBLGNBQUE7Ozs7SUFJQSxNQUFBLG1CQUFBO0lBQ0EsS0FBQTtJQUNBLEtBQUE7SUFDQSxPQUFBO0tBQ0EsWUFBQTtNQUNBLGFBQUEsUUFBQTtNQUNBLFlBQUE7TUFDQSxjQUFBO01BQ0EsUUFBQTtPQUNBLDhCQUFBLFNBQUEsZUFBQTtRQUNBLE9BQUEsZUFBQSxnQkFBQSxDQUFBLEtBQUEsR0FBQSxNQUFBLFNBQUEsTUFBQSxJQUFBLEtBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7SUFnQkEsTUFBQSw2QkFBQTtJQUNBLEtBQUE7SUFDQSxLQUFBO0lBQ0EsUUFBQTtJQUNBLE9BQUE7S0FDQSxTQUFBO01BQ0EsWUFBQTtNQUNBLFlBQUE7TUFDQSxjQUFBO01BQ0EsUUFBQTtPQUNBLDZDQUFBLFNBQUEsZ0JBQUEsYUFBQTtRQUNBLE9BQUEsZUFBQSxhQUFBLGFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7SUFnQkEsTUFBQSxxQ0FBQTtJQUNBLEtBQUE7SUFDQSxLQUFBO0lBQ0EsT0FBQTs7SUFFQSxNQUFBLG9CQUFBO0lBQ0EsS0FBQTtJQUNBLEtBQUE7SUFDQSxPQUFBO0tBQ0EsWUFBQTtNQUNBLGFBQUEsUUFBQTtNQUNBLFlBQUE7TUFDQSxjQUFBOzs7O0lBSUEsTUFBQSwwQkFBQTtJQUNBLEtBQUE7SUFDQSxLQUFBOztJQUVBLE1BQUEsbUJBQUE7SUFDQSxLQUFBO0lBQ0EsS0FBQTtJQUNBLE1BQUE7S0FDQSxRQUFBO01BQ0EsWUFBQSxRQUFBO01BQ0EsWUFBQTtNQUNBLGNBQUE7O0tBRUEsWUFBQTtNQUNBLGFBQUE7TUFDQSxZQUFBO01BQ0EsY0FBQTs7OztJQUlBLE1BQUEsa0JBQUE7SUFDQSxLQUFBO0lBQ0EsS0FBQTtJQUNBLE9BQUE7SUFDQSxNQUFBO0tBQ0EsUUFBQTtNQUNBLFlBQUEsUUFBQTtNQUNBLFlBQUE7TUFDQSxjQUFBOztLQUVBLFdBQUE7TUFDQSxhQUFBO01BQ0EsWUFBQTtNQUNBLGNBQUE7Ozs7SUFJQSxNQUFBLG1CQUFBO0lBQ0EsS0FBQTtJQUNBLEtBQUE7SUFDQSxPQUFBO0lBQ0EsTUFBQTtLQUNBLFFBQUE7TUFDQSxZQUFBLFFBQUE7TUFDQSxZQUFBO01BQ0EsY0FBQTs7S0FFQSxXQUFBO01BQ0EsYUFBQTtNQUNBLFlBQUE7TUFDQSxjQUFBOzs7O0lBSUEsTUFBQSxrQkFBQTtJQUNBLEtBQUE7SUFDQSxPQUFBO0tBQ0EsWUFBQTtNQUNBLGFBQUE7TUFDQSxZQUFBO01BQ0EsY0FBQTtNQUNBLFNBQUE7T0FDQSx5Q0FBQSxVQUFBLGdCQUFBLGNBQUE7UUFDQSxPQUFBLGVBQUEsVUFBQSxhQUFBOztPQUVBLGdDQUFBLFNBQUEsaUJBQUE7UUFDQSxPQUFBLGlCQUFBOzs7O0tBSUEsWUFBQTtNQUNBLGFBQUE7Ozs7SUFJQSxNQUFBLHVCQUFBO0tBQ0EsSUFBQTtLQUNBLE1BQUE7TUFDQSxRQUFBO09BQ0EsV0FBQTtPQUNBLGNBQUE7UUFDQSxZQUFBLFFBQUE7Ozs7SUFJQSxNQUFBLDJCQUFBO0lBQ0EsS0FBQTs7Ozs7Ozs7Ozs7Ozs7SUFjQSxNQUFBLG1DQUFBO0lBQ0EsS0FBQTs7SUFFQSxNQUFBLGlCQUFBO0lBQ0EsS0FBQTtJQUNBLE1BQUE7S0FDQSxVQUFBOztJQUVBLE9BQUE7S0FDQSxTQUFBO01BQ0EsYUFBQSxRQUFBOztLQUVBLE9BQUE7Ozs7Ozs7OztBQ2xTQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsY0FBQSwwR0FBQSxTQUFBLFlBQUEsWUFBQSxVQUFBLE9BQUEsT0FBQSxjQUFBLGFBQUEsT0FBQTtFQUNBLFdBQUEsY0FBQTtFQUNBLFdBQUEsY0FBQSxjQUFBLFlBQUE7O0VBRUEsV0FBQSxJQUFBLHFCQUFBLFNBQUEsT0FBQSxTQUFBLFVBQUEsVUFBQSxXQUFBO0dBQ0EsSUFBQSxRQUFBLFFBQUEsQ0FBQSxNQUFBLGtCQUFBO0lBQ0EsT0FBQSxNQUFBLHVDQUFBO01BQ0EsTUFBQTtNQUNBLE9BQUEsT0FBQSxHQUFBOztHQUVBLElBQUEsUUFBQSxRQUFBLFFBQUEsS0FBQSxTQUFBO0lBQ0EsV0FBQSxlQUFBLFFBQUEsS0FBQTs7R0FFQSxHQUFBLFFBQUEsVUFBQSxNQUFBO0lBQ0EsV0FBQSxRQUFBOztPQUVBO0lBQ0EsV0FBQSxRQUFBOztHQUVBLFdBQUEsZUFBQSxDQUFBLE1BQUEsV0FBQSxPQUFBO0dBQ0EsV0FBQSxpQkFBQTs7RUFFQSxXQUFBLElBQUEsc0JBQUEsU0FBQSxPQUFBLFFBQUE7Ozs7RUFJQSxXQUFBLElBQUEsdUJBQUEsU0FBQSxPQUFBLFFBQUE7R0FDQSxXQUFBLGlCQUFBO0dBQ0E7OztFQUdBLFNBQUEsY0FBQTtHQUNBLFNBQUEsVUFBQTtJQUNBLFlBQUEsT0FBQSxPQUFBLEtBQUEsVUFBQSxLQUFBO0tBQ0EsSUFBQTs7TUFFQTs7Ozs7QUN2Q0EsQ0FBQSxZQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGNBQUEseUJBQUEsVUFBQSxlQUFBOzs7RUFHQSxjQUFBLFdBQUE7SUFDQSxjQUFBLFlBQUE7SUFDQSxjQUFBLFlBQUE7RUFDQSxjQUFBLFNBQUE7R0FDQSxLQUFBO0dBQ0EsVUFBQTs7RUFFQSxjQUFBLE9BQUE7R0FDQSxLQUFBO0dBQ0EsVUFBQTs7Ozs7O0FDZkEsQ0FBQSxXQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGNBQUEsaUNBQUEsVUFBQSxzQkFBQTtFQUNBLHNCQUFBLGlCQUFBOzs7OztBQ0pBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxjQUFBLGdDQUFBLFNBQUEscUJBQUE7RUFDQTtHQUNBLFdBQUE7R0FDQSxrQkFBQSxFQUFBLFFBQUE7R0FDQSx1QkFBQSxTQUFBLEtBQUEsVUFBQSxLQUFBLElBQUEsU0FBQSxVQUFBO1FBQ0EsSUFBQTtRQUNBLGdCQUFBLEtBQUE7UUFDQSxJQUFBLEtBQUEsTUFBQTtZQUNBLGNBQUEsUUFBQSxLQUFBOztRQUVBLElBQUEsS0FBQSxVQUFBO1lBQ0EsY0FBQSxZQUFBLEtBQUE7O1FBRUEsT0FBQTs7Ozs7O0FDaEJBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxjQUFBLDhCQUFBLFNBQUEsb0JBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0VBb0JBLElBQUEsVUFBQSxtQkFBQSxjQUFBLFVBQUE7R0FDQSxPQUFBO0dBQ0EsUUFBQTs7R0FFQSxtQkFBQSxjQUFBLFNBQUE7O0VBRUEsbUJBQUEsTUFBQTtHQUNBLGVBQUE7R0FDQSxjQUFBO0dBQ0EsWUFBQTs7Ozs7QUNoQ0EsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLGNBQUEsd0JBQUEsU0FBQSxhQUFBOztRQUVBLFFBQUEsT0FBQSxjQUFBO1VBQ0EsYUFBQTtVQUNBLGFBQUE7VUFDQSxXQUFBO1VBQ0EsYUFBQTtVQUNBLGVBQUE7VUFDQSxtQkFBQTtVQUNBLHVCQUFBO1VBQ0EsUUFBQTtVQUNBLGFBQUE7Ozs7OztBQ2RBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxlQUFBLFFBQUEsWUFBQSxVQUFBO1FBQ0EsT0FBQSxVQUFBLE9BQUE7O1lBRUEsS0FBQSxDQUFBLE9BQUE7Y0FDQSxPQUFBOztZQUVBLE9BQUEsTUFBQSxRQUFBLGVBQUE7Ozs7Ozs7QUNUQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsZUFBQSxRQUFBLGNBQUEsVUFBQTtFQUNBLE9BQUEsU0FBQSxPQUFBLEtBQUE7R0FDQSxPQUFBLENBQUEsQ0FBQSxDQUFBLFNBQUEsTUFBQSxRQUFBLHNCQUFBLFNBQUEsSUFBQTtJQUNBLE9BQUEsSUFBQSxPQUFBLEdBQUEsZ0JBQUEsSUFBQSxPQUFBLEdBQUE7UUFDQTs7Ozs7QUNQQSxDQUFBLFlBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsZUFBQSxPQUFBLGNBQUEsWUFBQTtFQUNBLE9BQUEsVUFBQSxPQUFBLE1BQUEsT0FBQTs7TUFFQSxJQUFBLFNBQUE7R0FDQSxJQUFBLElBQUE7SUFDQSxNQUFBLE1BQUE7O0dBRUEsT0FBQSxJQUFBLEtBQUEsS0FBQTtJQUNBLElBQUEsTUFBQSxHQUFBLE9BQUEsY0FBQSxRQUFBLEtBQUEsaUJBQUEsQ0FBQSxHQUFBO01BQ0EsT0FBQSxLQUFBLE1BQUE7OztHQUdBLE9BQUE7Ozs7OztBQ2ZBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxlQUFBLFFBQUEsaUJBQUEsVUFBQTtFQUNBLE9BQUEsU0FBQSxTQUFBLEtBQUE7R0FDQSxLQUFBLENBQUEsS0FBQTtJQUNBLE9BQUE7O0dBRUEsSUFBQSxRQUFBLElBQUEsTUFBQTtHQUNBLEtBQUEsSUFBQSxFQUFBLEdBQUEsRUFBQSxNQUFBLFFBQUEsS0FBQTtJQUNBLE1BQUEsS0FBQSxNQUFBLEdBQUEsT0FBQSxHQUFBLGdCQUFBLE1BQUEsR0FBQSxNQUFBOztHQUVBLE9BQUEsTUFBQSxLQUFBOzs7O0FDWkEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLGVBQUEsT0FBQSxzQkFBQSxZQUFBO1FBQ0EsT0FBQSxVQUFBLE9BQUEsT0FBQSxhQUFBO1lBQ0EsSUFBQSxNQUFBLFFBQUE7Z0JBQ0EsT0FBQTs7WUFFQSxJQUFBLFNBQUEsR0FBQTtnQkFDQSxPQUFBOztZQUVBLElBQUEsU0FBQSxNQUFBLFNBQUEsT0FBQTtnQkFDQSxRQUFBLE1BQUEsVUFBQSxHQUFBOztnQkFFQSxJQUFBLENBQUEsYUFBQTtvQkFDQSxJQUFBLFlBQUEsTUFBQSxZQUFBOztvQkFFQSxJQUFBLGNBQUEsQ0FBQSxHQUFBO3dCQUNBLFFBQUEsTUFBQSxPQUFBLEdBQUE7O3VCQUVBO29CQUNBLE9BQUEsTUFBQSxPQUFBLE1BQUEsT0FBQSxPQUFBLEtBQUE7d0JBQ0EsUUFBQSxNQUFBLE9BQUEsR0FBQSxNQUFBLFNBQUE7OztnQkFHQSxPQUFBLFFBQUE7O1lBRUEsT0FBQTs7OztBQzNCQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsZUFBQSxPQUFBLGlCQUFBLFlBQUE7UUFDQSxPQUFBLFVBQUEsT0FBQSxPQUFBO1lBQ0EsSUFBQSxNQUFBLFFBQUE7Z0JBQ0EsT0FBQTs7WUFFQSxJQUFBLFNBQUEsR0FBQTtnQkFDQSxPQUFBOztZQUVBLElBQUEsT0FBQTtnQkFDQSxJQUFBLGFBQUEsTUFBQSxNQUFBO2dCQUNBLElBQUEsV0FBQSxTQUFBLE9BQUE7b0JBQ0EsUUFBQSxXQUFBLE1BQUEsR0FBQSxPQUFBLEtBQUEsT0FBQTs7O1lBR0EsT0FBQTs7OztBQ2pCQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsZUFBQSxRQUFBLHNCQUFBLFVBQUEsTUFBQTtFQUNBLE9BQUEsVUFBQSxNQUFBO0dBQ0EsT0FBQSxLQUFBLFlBQUE7Ozs7QUNMQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsZUFBQSxPQUFBLFdBQUEsV0FBQTtFQUNBLE9BQUEsVUFBQSxRQUFBO0dBQ0EsS0FBQSxDQUFBLE9BQUE7SUFDQSxPQUFBOztHQUVBLE9BQUEsTUFBQSxVQUFBLEdBQUEsR0FBQSxnQkFBQSxNQUFBLFVBQUE7Ozs7OztBQ1JBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxnQkFBQSxRQUFBLHNCQUFBLFVBQUE7O1FBRUEsTUFBQTtVQUNBLFNBQUE7VUFDQSxTQUFBO1VBQ0EsS0FBQTtVQUNBLEtBQUE7WUFDQSxPQUFBO1lBQ0EsT0FBQTs7VUFFQSxLQUFBO1lBQ0EsT0FBQTtZQUNBLEtBQUE7WUFDQSxLQUFBO1lBQ0EsS0FBQTtZQUNBLElBQUE7WUFDQSxRQUFBOztVQUVBLFVBQUEsU0FBQSxFQUFBO1lBQ0EsT0FBQSxLQUFBLEtBQUEsUUFBQTs7VUFFQSxVQUFBLFVBQUE7WUFDQSxPQUFBLEtBQUEsS0FBQTs7VUFFQSxTQUFBLFVBQUE7WUFDQSxPQUFBLEtBQUEsS0FBQTs7VUFFQSxRQUFBLFdBQUE7WUFDQSxPQUFBLEtBQUEsS0FBQTs7VUFFQSxJQUFBLFVBQUE7WUFDQSxPQUFBLEtBQUEsS0FBQTs7VUFFQSxNQUFBLFdBQUE7WUFDQSxPQUFBLEtBQUEsS0FBQTs7VUFFQSxNQUFBLFdBQUE7WUFDQSxPQUFBLEtBQUEsS0FBQTs7VUFFQSxjQUFBLFNBQUEsT0FBQTtTQUNBLEtBQUEsU0FBQSxTQUFBLGNBQUE7U0FDQSxLQUFBLE9BQUEsUUFBQTtTQUNBLEtBQUEsT0FBQSxTQUFBO1NBQ0EsS0FBQSxNQUFBLEtBQUEsT0FBQSxXQUFBO1NBQ0EsSUFBQSxXQUFBLEtBQUEsSUFBQSxxQkFBQSxHQUFBLEdBQUEsS0FBQTtTQUNBLFNBQUEsYUFBQSxHQUFBO1NBQ0EsU0FBQSxhQUFBLE1BQUEsVUFBQTtTQUNBLFNBQUEsYUFBQSxHQUFBO1NBQ0EsS0FBQSxJQUFBLFlBQUE7U0FDQSxLQUFBLElBQUEsU0FBQSxHQUFBLEdBQUEsS0FBQTtTQUNBLEtBQUEsVUFBQSxLQUFBLElBQUEsYUFBQSxHQUFBLEdBQUEsS0FBQSxHQUFBOzs7UUFHQSxhQUFBLFNBQUEsT0FBQTtTQUNBLElBQUEsV0FBQSxLQUFBLElBQUEscUJBQUEsR0FBQSxHQUFBLEtBQUE7U0FDQSxTQUFBLGFBQUEsR0FBQTtTQUNBLFNBQUEsYUFBQSxNQUFBLFNBQUE7U0FDQSxTQUFBLGFBQUEsR0FBQTtTQUNBLEtBQUEsSUFBQSxZQUFBO1NBQ0EsS0FBQSxJQUFBLFNBQUEsR0FBQSxHQUFBLEtBQUE7U0FDQSxLQUFBLFVBQUEsS0FBQSxJQUFBLGFBQUEsR0FBQSxHQUFBLEtBQUEsR0FBQTs7O1VBR0EsVUFBQSxTQUFBLE1BQUE7WUFDQSxPQUFBLEtBQUEsUUFBQTs7Ozs7Ozs7O0FDbkVBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxnQkFBQSxRQUFBLGtDQUFBLFNBQUEsWUFBQTs7UUFFQSxPQUFBO1VBQ0EsU0FBQTtZQUNBLFdBQUE7WUFDQSxVQUFBO1lBQ0EsTUFBQTtZQUNBLFdBQUE7WUFDQSxPQUFBO1lBQ0EsYUFBQTs7VUFFQSxpQkFBQSxTQUFBLE9BQUE7YUFDQSxPQUFBLEtBQUEsUUFBQSxhQUFBLFlBQUEsT0FBQSxlQUFBLFFBQUE7O1VBRUEsaUJBQUEsU0FBQSxPQUFBO1lBQ0EsT0FBQSxLQUFBLFFBQUEsYUFBQSxZQUFBLE9BQUEsZUFBQSxRQUFBOztVQUVBLGVBQUEsU0FBQSxPQUFBO1lBQ0EsR0FBQSxLQUFBLFFBQUEsV0FBQSxVQUFBLEVBQUE7Y0FDQSxPQUFBLEtBQUEsZ0JBQUE7O1lBRUEsT0FBQSxLQUFBLFFBQUE7O1VBRUEsZUFBQSxVQUFBO1lBQ0EsT0FBQSxLQUFBLFFBQUE7O1VBRUEsY0FBQSxTQUFBLEdBQUE7WUFDQSxHQUFBLEtBQUEsUUFBQSxXQUFBLE9BQUE7Y0FDQSxJQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsS0FBQSxRQUFBLFdBQUEsUUFBQSxJQUFBO2dCQUNBLEdBQUEsS0FBQSxRQUFBLFdBQUEsR0FBQSxNQUFBLEdBQUE7a0JBQ0EsT0FBQSxLQUFBLFFBQUEsV0FBQTs7OztnQkFJQTtjQUNBLE9BQUEsS0FBQSxRQUFBLFlBQUEsWUFBQSxPQUFBLGNBQUEsSUFBQTs7OztVQUlBLGtCQUFBLFNBQUEsR0FBQTtZQUNBLE9BQUEsS0FBQSxRQUFBLE9BQUEsWUFBQSxPQUFBLGNBQUEsR0FBQTs7Ozs7Ozs7QUMzQ0EsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLGdCQUFBLFFBQUEsb0NBQUEsU0FBQSxZQUFBOztRQUVBLE9BQUE7VUFDQSxXQUFBO1VBQ0EsV0FBQSxVQUFBO1lBQ0EsT0FBQSxLQUFBLFlBQUEsWUFBQSxPQUFBLGtCQUFBOztVQUVBLFNBQUEsVUFBQTtZQUNBLEdBQUEsQ0FBQSxLQUFBLFVBQUEsT0FBQTtjQUNBLEtBQUE7O1lBRUEsT0FBQSxLQUFBOzs7Ozs7O0FDZEEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLGdCQUFBLFFBQUEsZUFBQTtJQUNBLFlBQUEsVUFBQSxDQUFBLGNBQUE7O0lBRUEsU0FBQSxZQUFBLGFBQUEsT0FBQTtRQUNBLE9BQUE7VUFDQSxRQUFBO1VBQ0EsUUFBQTtVQUNBLE1BQUE7OztRQUdBLFNBQUEsT0FBQSxPQUFBLE9BQUE7VUFDQSxJQUFBLE9BQUEsWUFBQSxJQUFBLE9BQUEsUUFBQTtZQUNBLEtBQUEsS0FBQSxVQUFBLElBQUEsU0FBQSxLQUFBO2NBQ0EsT0FBQSxNQUFBLEtBQUEsWUFBQTtjQUNBLFFBQUEsSUFBQTs7WUFFQSxPQUFBOztRQUVBLFNBQUEsT0FBQSxPQUFBLEdBQUE7VUFDQSxPQUFBLFlBQUEsSUFBQSxPQUFBLElBQUE7O1FBRUEsU0FBQSxLQUFBLE9BQUEsS0FBQTtVQUNBLElBQUEsT0FBQSxZQUFBLElBQUEsT0FBQSxLQUFBO1VBQ0EsS0FBQSxLQUFBLFVBQUEsSUFBQSxTQUFBLEtBQUE7WUFDQSxPQUFBLE1BQUEsS0FBQSxLQUFBLE9BQUE7WUFDQSxRQUFBLElBQUE7O1VBRUEsT0FBQTs7UUFFQSxTQUFBLElBQUEsT0FBQSxLQUFBO1VBQ0EsT0FBQSxZQUFBLElBQUEsT0FBQSxJQUFBOzs7Ozs7QUNqQ0EsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGdCQUFBLFFBQUEsK0JBQUEsU0FBQSxVQUFBOztFQUVBLE9BQUE7R0FDQSxjQUFBLFNBQUEsVUFBQSxPQUFBOztJQUVBLElBQUEsVUFBQTtLQUNBLGFBQUEscUJBQUEsV0FBQSxNQUFBLFdBQUE7OztJQUdBLElBQUEsT0FBQTtLQUNBLFFBQUEsUUFBQSxPQUFBOzs7SUFHQSxPQUFBLFVBQUEsS0FBQTs7O0dBR0EsTUFBQSxVQUFBO0lBQ0EsT0FBQSxVQUFBOzs7R0FHQSxPQUFBLFNBQUEsT0FBQSxRQUFBO0lBQ0EsVUFBQTtLQUNBLFVBQUE7T0FDQSxNQUFBO09BQ0EsUUFBQTtPQUNBLEdBQUE7Ozs7R0FJQSxTQUFBLFNBQUEsT0FBQSxTQUFBO0lBQ0EsT0FBQSxVQUFBO0tBQ0EsVUFBQTtPQUNBLE1BQUE7T0FDQSxRQUFBO09BQ0EsR0FBQTtPQUNBLE9BQUE7Ozs7OztBQ3RDQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsZ0JBQUEsUUFBQSxnQkFBQSxVQUFBO1FBQ0EsSUFBQSxXQUFBO1VBQ0EsU0FBQTtVQUNBLFNBQUE7VUFDQSxVQUFBO1VBQ0EsYUFBQTtVQUNBLFNBQUE7VUFDQSxRQUFBO1VBQ0EsT0FBQTtVQUNBLFVBQUE7VUFDQSxPQUFBO1VBQ0EsUUFBQTs7O1FBR0EsT0FBQTtVQUNBLFlBQUEsU0FBQSxLQUFBO1lBQ0EsT0FBQSxTQUFBOztVQUVBLFFBQUEsVUFBQTtZQUNBLE9BQUE7Ozs7Ozs7QUN0QkEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLGdCQUFBLFFBQUEsMkNBQUEsU0FBQSxhQUFBLE9BQUE7O1FBRUEsSUFBQSxjQUFBO1lBQ0EsTUFBQTtZQUNBLFFBQUE7WUFDQSxXQUFBO1lBQ0EsS0FBQTtjQUNBLFdBQUE7Y0FDQSxjQUFBO2NBQ0EsV0FBQTtjQUNBLE1BQUE7O1lBRUEsV0FBQTtZQUNBLFNBQUE7V0FDQSxTQUFBLGFBQUE7O1FBRUEsSUFBQSxDQUFBLGFBQUEsSUFBQSxlQUFBO1VBQ0EsY0FBQSxhQUFBLGNBQUE7WUFDQSxvQkFBQSxLQUFBLEtBQUE7WUFDQSxnQkFBQTtZQUNBLGFBQUE7O1VBRUEsY0FBQSxZQUFBLElBQUE7O1lBRUE7VUFDQSxjQUFBLGFBQUEsSUFBQTtVQUNBLFVBQUEsWUFBQSxJQUFBOztRQUVBLE9BQUE7VUFDQSxNQUFBLFVBQUE7WUFDQSxPQUFBLEdBQUE7WUFDQSxHQUFBLGFBQUEsSUFBQSxjQUFBO2dCQUNBLFlBQUEsT0FBQTs7WUFFQSxPQUFBLGFBQUE7Z0JBQ0EsTUFBQTtnQkFDQSxRQUFBO2dCQUNBLFdBQUE7Z0JBQ0EsS0FBQTtrQkFDQSxXQUFBO2tCQUNBLGNBQUE7a0JBQ0EsV0FBQTs7Z0JBRUEsU0FBQTtnQkFDQSxXQUFBOzs7VUFHQSxRQUFBLFNBQUEsS0FBQTtZQUNBLE9BQUEsWUFBQSxLQUFBLEtBQUE7O1VBRUEsY0FBQSxTQUFBLEtBQUE7WUFDQSxPQUFBLFlBQUEsV0FBQSxLQUFBOztVQUVBLGFBQUEsU0FBQSxLQUFBO1lBQ0EsT0FBQSxZQUFBLFNBQUEsS0FBQTs7VUFFQSxhQUFBLFNBQUEsTUFBQTtZQUNBLE9BQUEsWUFBQSxXQUFBLEtBQUE7O1VBRUEsZ0JBQUEsU0FBQSxLQUFBO1lBQ0EsSUFBQSxRQUFBLFlBQUEsU0FBQSxRQUFBO1lBQ0EsT0FBQSxRQUFBLENBQUEsSUFBQSxZQUFBLFNBQUEsT0FBQSxPQUFBLEtBQUE7O1VBRUEsU0FBQSxTQUFBLEtBQUE7WUFDQSxPQUFBLFlBQUEsT0FBQTs7VUFFQSxhQUFBLFNBQUEsSUFBQTtZQUNBLE9BQUEsWUFBQSxLQUFBLFlBQUE7O1VBRUEsaUJBQUEsU0FBQSxJQUFBO1lBQ0EsT0FBQSxZQUFBLEtBQUEsZ0JBQUE7O1VBRUEsY0FBQSxTQUFBLElBQUE7WUFDQSxPQUFBLFlBQUEsS0FBQSxhQUFBOztVQUVBLFdBQUEsU0FBQSxPQUFBO1lBQ0EsT0FBQSxZQUFBLFNBQUE7O1VBRUEsbUJBQUEsVUFBQTs7WUFFQSxZQUFBLElBQUEsZUFBQTs7VUFFQSxjQUFBLFNBQUEsS0FBQSxLQUFBO1lBQ0EsT0FBQSxZQUFBLFdBQUEsT0FBQTs7VUFFQSx3QkFBQSxTQUFBLEtBQUE7WUFDQSxPQUFBLFlBQUEsWUFBQSxXQUFBLEtBQUEsZUFBQTs7VUFFQSxxQkFBQSxVQUFBO1lBQ0EsT0FBQSxjQUFBLFlBQUEsSUFBQTs7VUFFQSxhQUFBLFVBQUE7WUFDQSxPQUFBOztVQUVBLFNBQUEsVUFBQTtZQUNBLEdBQUEsT0FBQSxlQUFBLGFBQUEsT0FBQTtZQUNBLE9BQUEsWUFBQTs7VUFFQSxTQUFBLFVBQUE7WUFDQSxHQUFBLE9BQUEsZUFBQSxhQUFBLE9BQUE7WUFDQSxPQUFBLFlBQUE7O1VBRUEsYUFBQSxVQUFBO1lBQ0EsT0FBQSxZQUFBOztVQUVBLGFBQUEsVUFBQTtZQUNBLE9BQUEsWUFBQSxLQUFBOztVQUVBLGlCQUFBLFVBQUE7WUFDQSxPQUFBLFlBQUEsS0FBQTs7VUFFQSxXQUFBLFVBQUE7WUFDQSxHQUFBLE9BQUEsZUFBQSxhQUFBLE9BQUE7WUFDQSxPQUFBLFlBQUE7O1VBRUEsY0FBQSxVQUFBO1lBQ0EsR0FBQSxPQUFBLGVBQUEsYUFBQSxPQUFBO1lBQ0EsT0FBQSxZQUFBOztVQUVBLGVBQUEsVUFBQTtZQUNBLE9BQUEsWUFBQSxLQUFBOztVQUVBLGFBQUEsVUFBQTtZQUNBLE9BQUEsWUFBQSxLQUFBOztVQUVBLGNBQUEsU0FBQSxJQUFBO1lBQ0EsT0FBQSxZQUFBLFlBQUEsV0FBQTs7VUFFQSxlQUFBLFVBQUE7WUFDQSxHQUFBLE9BQUEsZUFBQSxhQUFBLE9BQUE7WUFDQSxPQUFBLFlBQUE7O1VBRUEsaUJBQUEsVUFBQTtZQUNBLE9BQUE7O1VBRUEsZUFBQSxVQUFBO1lBQ0EsT0FBQSxZQUFBLFdBQUEsT0FBQSxFQUFBOztVQUVBLFlBQUEsVUFBQTtZQUNBLE9BQUEsWUFBQSxPQUFBLE9BQUEsRUFBQTs7VUFFQSxlQUFBLFVBQUE7WUFDQSxPQUFBLFlBQUEsV0FBQTs7Ozs7OztBQ2pKQSxDQUFBLFlBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsZ0JBQUEsUUFBQSxrQ0FBQSxVQUFBLGFBQUE7O0VBRUEsT0FBQTtHQUNBLE9BQUE7SUFDQSxNQUFBO0tBQ0EsTUFBQTtLQUNBLFdBQUE7O0lBRUEsVUFBQTtLQUNBLE1BQUE7S0FDQSxVQUFBOzs7R0FHQSxXQUFBLFNBQUEsT0FBQTtJQUNBLEtBQUEsTUFBQSxTQUFBLE9BQUEsWUFBQSxPQUFBLFdBQUEsUUFBQTtJQUNBLEtBQUEsTUFBQSxTQUFBLFlBQUEsWUFBQSxPQUFBLFdBQUEsUUFBQTtJQUNBLEtBQUEsTUFBQSxLQUFBLE9BQUEsS0FBQSxNQUFBLFNBQUEsS0FBQTtJQUNBLEtBQUEsTUFBQSxLQUFBLFlBQUEsS0FBQSxNQUFBLFNBQUEsVUFBQTtJQUNBLE9BQUEsS0FBQTs7R0FFQSxTQUFBLFlBQUE7SUFDQSxPQUFBLEtBQUEsTUFBQSxLQUFBOztHQUVBLGNBQUEsWUFBQTtJQUNBLE9BQUEsS0FBQSxNQUFBLEtBQUE7O0dBRUEsZ0JBQUEsWUFBQTtJQUNBLE9BQUEsS0FBQSxNQUFBLFNBQUE7O0dBRUEscUJBQUEsWUFBQTtJQUNBLE9BQUEsS0FBQSxNQUFBLFNBQUE7Ozs7Ozs7QUNqQ0EsQ0FBQSxZQUFBO0VBQ0E7O0VBRUEsUUFBQSxPQUFBLGdCQUFBLFFBQUEsZ0NBQUEsVUFBQSxVQUFBOztJQUVBLE9BQUE7Ozs7Ozs7S0FPQSxTQUFBLFVBQUEsU0FBQSxNQUFBOztNQUVBLElBQUEsUUFBQSxXQUFBLE9BQUE7T0FDQSxPQUFBO1FBQ0EsTUFBQTs7Ozs7TUFLQSxJQUFBLFdBQUEsUUFBQSxXQUFBO01BQ0EsSUFBQTtNQUNBLE9BQUE7T0FDQSxLQUFBLENBQUEsUUFBQSxLQUFBLE9BQUEsS0FBQSxNQUFBOzs7O09BSUEsTUFBQSxVQUFBLE9BQUEsU0FBQTs7UUFFQSxJQUFBLENBQUEsa0JBQUE7U0FDQSxtQkFBQSxTQUFBOzs7UUFHQSxpQkFBQSxPQUFBLFVBQUEsT0FBQTtTQUNBLFFBQUEsT0FBQTs7OztRQUlBLElBQUEsUUFBQSxLQUFBLE1BQUE7U0FDQSxLQUFBLEtBQUEsTUFBQSxNQUFBOzs7Ozs7Ozs7O0FDeENBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxnQkFBQSxRQUFBLDZCQUFBLFNBQUEsU0FBQTs7RUFFQSxJQUFBLFFBQUE7R0FDQSxXQUFBO0dBQ0EsU0FBQTs7RUFFQSxPQUFBO0dBQ0EsTUFBQSxTQUFBLFFBQUE7SUFDQSxJQUFBLENBQUEsUUFBQTtLQUNBLE9BQUE7OztJQUdBLE9BQUEsU0FBQTtLQUNBLFNBQUE7T0FDQSxRQUFBO09BQ0EsU0FBQTtPQUNBLE9BQUE7T0FDQSxVQUFBOzs7R0FHQSxPQUFBLFNBQUEsUUFBQTtJQUNBLElBQUEsQ0FBQSxRQUFBO0tBQ0EsT0FBQTs7O0lBR0EsT0FBQSxTQUFBO0tBQ0EsU0FBQTtPQUNBLFFBQUE7T0FDQSxTQUFBO09BQ0EsTUFBQTtPQUNBLE9BQUE7T0FDQSxVQUFBOzs7Ozs7QUNsQ0EsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLGdCQUFBLFFBQUEsK0JBQUEsU0FBQSxZQUFBOzs7UUFHQSxPQUFBO1VBQ0EsS0FBQTtZQUNBLE1BQUE7O1VBRUEsUUFBQSxVQUFBO1lBQ0EsT0FBQSxLQUFBLEtBQUEsT0FBQSxZQUFBLE9BQUEsV0FBQTs7VUFFQSxXQUFBLFVBQUE7OztVQUdBLFdBQUEsVUFBQTs7Ozs7Ozs7QUNoQkEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsNkZBQUEsU0FBQSxPQUFBLFFBQUEsU0FBQSxRQUFBLGVBQUEsYUFBQTs7O1FBR0EsSUFBQSxLQUFBO1FBQ0EsR0FBQSxPQUFBLGFBQUE7UUFDQSxHQUFBLE9BQUEsYUFBQTtRQUNBLEdBQUEsU0FBQSxhQUFBO1FBQ0EsR0FBQSxhQUFBLGFBQUE7UUFDQSxHQUFBLFdBQUE7O1FBRUEsR0FBQSxhQUFBO1FBQ0EsR0FBQSxpQkFBQTtRQUNBLEdBQUEsZUFBQTtRQUNBLEdBQUEsZ0JBQUE7UUFDQSxHQUFBLHFCQUFBO1FBQ0EsR0FBQSxpQkFBQTtRQUNBLEdBQUEsZUFBQTtRQUNBLEdBQUEsc0JBQUE7O1FBRUEsR0FBQSxVQUFBOztRQUVBLEdBQUEsUUFBQTtVQUNBLFFBQUE7VUFDQSxPQUFBO1VBQ0EsT0FBQTtVQUNBLE1BQUE7OztRQUdBOztRQUVBLFNBQUEsVUFBQTtVQUNBOzs7UUFHQSxTQUFBLFdBQUE7VUFDQSxHQUFBLENBQUEsR0FBQSxLQUFBO1lBQ0EsT0FBQSxHQUFBOzs7O1FBSUEsU0FBQSxPQUFBLFdBQUE7VUFDQSxHQUFBLFNBQUE7U0FDQTtRQUNBLFNBQUEsY0FBQSxPQUFBO1VBQ0EsT0FBQSxHQUFBLE9BQUEsUUFBQSxXQUFBLEdBQUEsTUFBQSxDQUFBLFFBQUE7U0FDQTtRQUNBLFNBQUEsbUJBQUEsTUFBQSxPQUFBOzs7U0FHQTtRQUNBLFNBQUEsZUFBQSxLQUFBO1VBQ0EsT0FBQSxLQUFBLE9BQUEsU0FBQSxJQUFBLFdBQUE7Ozs7Ozs7UUFPQSxTQUFBLGFBQUEsR0FBQSxJQUFBO1VBQ0EsUUFBQSxRQUFBLEdBQUEsTUFBQSxTQUFBLE1BQUEsRUFBQTtZQUNBLFFBQUEsUUFBQSxLQUFBLEtBQUEsSUFBQSxTQUFBLE9BQUEsRUFBQTtjQUNBLEdBQUEsS0FBQSxJQUFBO2dCQUNBLE9BQUEsR0FBQSxLQUFBLEdBQUEsS0FBQSxHQUFBOzs7O1VBSUEsT0FBQTs7UUFFQSxTQUFBLGdCQUFBO1VBQ0EsUUFBQSxRQUFBLEdBQUEsVUFBQSxTQUFBLE1BQUEsSUFBQTtZQUNBLFFBQUEsUUFBQSxLQUFBLFFBQUEsU0FBQSxPQUFBLEVBQUE7Y0FDQSxHQUFBLE1BQUEsUUFBQSxLQUFBLE1BQUEsUUFBQSxFQUFBO2dCQUNBLEdBQUE7Z0JBQ0EsYUFBQTs7Y0FFQSxHQUFBO2NBQ0EsYUFBQTs7WUFFQSxHQUFBLEtBQUEsT0FBQSxHQUFBLEtBQUEsUUFBQSxPQUFBOztVQUVBLEdBQUEsV0FBQTtVQUNBLEdBQUEsR0FBQSxLQUFBLFVBQUEsRUFBQTtZQUNBLEdBQUE7WUFDQSxPQUFBLEdBQUE7OztRQUdBLFNBQUEsY0FBQTtVQUNBLEdBQUEsV0FBQTtVQUNBLFFBQUEsUUFBQSxHQUFBLE1BQUEsU0FBQSxNQUFBLElBQUE7WUFDQSxHQUFBLEtBQUEsT0FBQSxPQUFBO2NBQ0EsR0FBQSxTQUFBLEtBQUE7Ozs7UUFJQSxTQUFBLFNBQUE7VUFDQSxHQUFBLE1BQUEsR0FBQSxTQUFBO1VBQ0EsY0FBQSxhQUFBLFdBQUE7O1FBRUEsU0FBQSxZQUFBO1VBQ0EsR0FBQSxPQUFBOzs7Ozs7O0FDdEdBLENBQUEsV0FBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLHdHQUFBLFNBQUEsUUFBQSxRQUFBLGNBQUEsYUFBQSxlQUFBLFFBQUE7RUFDQSxJQUFBLEtBQUE7RUFDQSxHQUFBLE9BQUEsYUFBQTtFQUNBLEdBQUEsT0FBQSxhQUFBO0VBQ0EsR0FBQSxTQUFBLGFBQUE7RUFDQSxHQUFBLGFBQUEsYUFBQTtFQUNBLEdBQUEsY0FBQTtFQUNBLEdBQUEsV0FBQTs7RUFFQTs7RUFFQSxTQUFBLFdBQUE7R0FDQSxHQUFBLFNBQUEsWUFBQSxPQUFBO0dBQ0E7R0FDQSxRQUFBLElBQUEsR0FBQTs7O0VBR0EsU0FBQSxjQUFBO0dBQ0EsR0FBQSxtQkFBQTtHQUNBLElBQUEsR0FBQSxLQUFBLFFBQUE7SUFDQSxHQUFBLE9BQUEsS0FBQSxTQUFBLFNBQUE7S0FDQSxRQUFBLFFBQUEsU0FBQSxTQUFBLE9BQUE7TUFDQSxJQUFBLFFBQUE7TUFDQSxRQUFBLFFBQUEsR0FBQSxLQUFBLEdBQUEsS0FBQSxRQUFBLFNBQUEsT0FBQTtPQUNBLElBQUEsVUFBQSxLQUFBLE1BQUEsTUFBQTtPQUNBLFFBQUEsUUFBQSxTQUFBLFNBQUEsUUFBQTtRQUNBLElBQUEsT0FBQSxVQUFBLE9BQUE7U0FDQTs7OztNQUlBLElBQUEsU0FBQSxHQUFBLEtBQUEsR0FBQSxLQUFBLE9BQUEsU0FBQSxHQUFBO09BQ0EsR0FBQSxpQkFBQSxLQUFBOzs7S0FHQSxJQUFBLEdBQUEsaUJBQUEsUUFBQTtNQUNBLEdBQUEsR0FBQSxLQUFBLFdBQUE7T0FDQSxHQUFBLEtBQUEsT0FBQSxHQUFBLEtBQUEsR0FBQSxLQUFBLEdBQUEsR0FBQSxLQUFBOztNQUVBLGNBQUEsYUFBQSxjQUFBOzs7Ozs7RUFNQSxTQUFBLGNBQUE7R0FDQSxRQUFBLFFBQUEsR0FBQSxNQUFBLFNBQUEsS0FBQSxLQUFBO0lBQ0EsUUFBQSxRQUFBLElBQUEsS0FBQSxJQUFBLFNBQUEsTUFBQSxHQUFBO0tBQ0EsSUFBQSxNQUFBLFNBQUEsT0FBQSxHQUFBO01BQ0EsS0FBQSxLQUFBLFdBQUEsaUJBQUEsU0FBQSxPQUFBLEtBQUEsS0FBQSxXQUFBLGNBQUEsUUFBQSxTQUFBLENBQUEsR0FBQTtPQUNBLEdBQUEsS0FBQSxLQUFBLEtBQUEsR0FBQSxLQUFBO09BQ0EsSUFBQSxPQUFBLE9BQUEsR0FBQTtPQUNBLEdBQUEsT0FBQSxPQUFBLEdBQUE7Ozs7SUFJQSxJQUFBLENBQUEsSUFBQSxLQUFBLEdBQUEsR0FBQSxLQUFBLFlBQUE7S0FDQSxJQUFBLFFBQUE7TUFDQSxNQUFBO01BQ0EsU0FBQTtNQUNBLE9BQUEsSUFBQSxLQUFBLEdBQUEsR0FBQSxLQUFBO01BQ0EsUUFBQSxHQUFBLEtBQUE7TUFDQSxLQUFBOztLQUVBLElBQUEsYUFBQTtLQUNBLFFBQUEsUUFBQSxJQUFBLFFBQUEsU0FBQSxPQUFBLEtBQUE7TUFDQSxJQUFBLE1BQUEsUUFBQSxHQUFBO09BQ0EsYUFBQTs7O0tBR0EsSUFBQSxDQUFBLFlBQUE7TUFDQSxJQUFBLE9BQUEsS0FBQTtNQUNBLEdBQUEsV0FBQSxLQUFBOzs7Ozs7O0VBT0EsU0FBQSxXQUFBO0dBQ0EsSUFBQSxDQUFBLEdBQUEsS0FBQSxXQUFBO0lBQ0EsT0FBQSxNQUFBLDBDQUFBO0lBQ0EsT0FBQTs7R0FFQSxJQUFBLENBQUEsR0FBQSxLQUFBLGVBQUE7SUFDQSxPQUFBLE1BQUEsOENBQUE7SUFDQSxPQUFBOztHQUVBLElBQUEsR0FBQSxLQUFBLGlCQUFBLEdBQUEsS0FBQSxXQUFBO0lBQ0EsT0FBQSxNQUFBLG1EQUFBO0lBQ0EsT0FBQTs7O0dBR0EsR0FBQSxXQUFBO0dBQ0EsSUFBQSxVQUFBO0dBQ0EsSUFBQSxXQUFBO0dBQ0EsSUFBQSxVQUFBO0dBQ0EsUUFBQSxRQUFBLEdBQUEsTUFBQSxTQUFBLE1BQUEsS0FBQTtJQUNBLElBQUEsS0FBQSxLQUFBLEdBQUEsR0FBQSxLQUFBLFlBQUE7S0FDQSxZQUFBLEtBQUEsS0FBQSxHQUFBLEdBQUEsS0FBQSxXQUFBLFVBQUEsSUFBQSxJQUFBOztJQUVBLFFBQUEsS0FBQSxLQUFBLEdBQUEsR0FBQSxLQUFBO0tBQ0EsS0FBQTtNQUNBLEtBQUEsS0FBQSxHQUFBLEdBQUEsS0FBQSxpQkFBQTtNQUNBO0tBQ0EsS0FBQTtNQUNBLEtBQUEsS0FBQSxHQUFBLEdBQUEsS0FBQSxpQkFBQTtNQUNBO0tBQ0EsS0FBQTtNQUNBLEtBQUEsS0FBQSxHQUFBLEdBQUEsS0FBQSxpQkFBQTtNQUNBO0tBQ0EsS0FBQTtNQUNBLEtBQUEsS0FBQSxHQUFBLEdBQUEsS0FBQSxpQkFBQTtNQUNBO0tBQ0E7TUFDQTs7SUFFQSxRQUFBLEtBQUE7S0FDQSxLQUFBLEtBQUEsS0FBQSxHQUFBLEdBQUEsS0FBQTtLQUNBLE1BQUEsS0FBQSxLQUFBLEdBQUEsR0FBQSxLQUFBOzs7R0FHQSxJQUFBLFVBQUEsYUFBQSxRQUFBLFNBQUEsS0FBQSxlQUFBO0dBQ0EsYUFBQTtHQUNBLFlBQUEsS0FBQSx3QkFBQTtJQUNBLE1BQUE7SUFDQSxLQUFBO01BQ0EsS0FBQSxTQUFBLFVBQUE7SUFDQSxRQUFBLFFBQUEsVUFBQSxTQUFBLFNBQUEsS0FBQTtLQUNBLFFBQUEsUUFBQSxHQUFBLE1BQUEsU0FBQSxNQUFBLEdBQUE7TUFDQSxJQUFBLFFBQUEsUUFBQSxLQUFBLEtBQUEsR0FBQSxHQUFBLEtBQUEsZ0JBQUE7T0FDQSxJQUFBLFFBQUEsS0FBQSxTQUFBLEdBQUE7UUFDQSxJQUFBLFdBQUE7U0FDQSxPQUFBO1NBQ0EsU0FBQSxRQUFBOztRQUVBLGFBQUEsWUFBQTtjQUNBO1FBQ0EsSUFBQSxPQUFBLFFBQUEsS0FBQSxNQUFBLGFBQUE7U0FDQSxHQUFBLEtBQUEsR0FBQSxLQUFBLEdBQUEsR0FBQSxLQUFBLGFBQUEsUUFBQSxLQUFBLEdBQUE7U0FDQSxHQUFBLEtBQUEsR0FBQSxLQUFBLEdBQUEsR0FBQSxLQUFBLGlCQUFBLFFBQUEsS0FBQSxHQUFBO1NBQ0EsSUFBQSxLQUFBLE9BQUEsUUFBQTtVQUNBLFFBQUEsUUFBQSxLQUFBLFFBQUEsU0FBQSxPQUFBLEdBQUE7V0FDQSxJQUFBLE1BQUEsUUFBQSxLQUFBLE1BQUEsUUFBQSxHQUFBO1lBQ0EsR0FBQSxXQUFBLE9BQUEsR0FBQTtZQUNBLEtBQUEsT0FBQSxPQUFBLEdBQUE7a0JBQ0EsSUFBQSxNQUFBLFFBQUEsR0FBQTtZQUNBLElBQUEsTUFBQSxVQUFBLEdBQUEsS0FBQSxXQUFBO2FBQ0EsR0FBQSxPQUFBLE9BQUEsR0FBQTthQUNBLEtBQUEsT0FBQSxPQUFBLEdBQUE7Ozs7OztlQU1BOztTQUVBLElBQUEsUUFBQTtVQUNBLE1BQUE7VUFDQSxTQUFBO1VBQ0EsUUFBQSxHQUFBLEtBQUE7O1NBRUEsSUFBQSxhQUFBO1NBQ0EsUUFBQSxRQUFBLEdBQUEsS0FBQSxHQUFBLFFBQUEsU0FBQSxPQUFBLEdBQUE7VUFDQSxRQUFBLElBQUE7VUFDQSxJQUFBLE1BQUEsUUFBQSxHQUFBO1dBQ0EsYUFBQTs7O1NBR0EsSUFBQSxDQUFBLFlBQUE7VUFDQSxhQUFBLFlBQUE7VUFDQSxLQUFBLE9BQUEsS0FBQTs7Ozs7OztJQU9BLEdBQUEsY0FBQTtJQUNBLElBQUEsYUFBQSxjQUFBLFFBQUE7S0FDQSxjQUFBLGFBQUE7O01BRUEsU0FBQSxVQUFBO0lBQ0EsT0FBQSxNQUFBLHNDQUFBLFNBQUEsS0FBQTs7OztFQUlBLEdBQUEsYUFBQTs7RUFFQSxTQUFBLGFBQUE7R0FDQSxJQUFBLGFBQUE7SUFDQSxNQUFBOztHQUVBLElBQUEsT0FBQTtJQUNBLFNBQUE7R0FDQSxRQUFBLFFBQUEsR0FBQSxNQUFBLFNBQUEsTUFBQSxLQUFBO0lBQ0EsSUFBQSxLQUFBLE9BQUEsVUFBQSxHQUFBO0tBQ0EsS0FBQSxLQUFBLEdBQUEsT0FBQSxHQUFBLEtBQUE7S0FDQSxHQUFBLEdBQUEsS0FBQSxjQUFBLEdBQUEsS0FBQSxjQUFBLFFBQUE7TUFDQSxPQUFBLEtBQUEsS0FBQSxHQUFBLEdBQUEsS0FBQTs7S0FFQSxXQUFBLEtBQUEsS0FBQSxLQUFBLEtBQUE7V0FDQTtLQUNBLE9BQUEsTUFBQSwrQkFBQTtLQUNBOzs7R0FHQSxRQUFBLElBQUE7R0FDQSxZQUFBLEtBQUEsaUJBQUEsR0FBQSxVQUFBLGFBQUEsV0FBQSxZQUFBLEtBQUEsU0FBQSxLQUFBO0lBQ0EsSUFBQSxPQUFBLE1BQUE7S0FDQSxPQUFBLFFBQUEsV0FBQSxLQUFBLFNBQUEsd0JBQUEsR0FBQSxLQUFBLE1BQUE7S0FDQSxHQUFBLE9BQUEsYUFBQTtLQUNBLE9BQUEsR0FBQTs7Ozs7Ozs7QUN2TkEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsZ0hBQUEsU0FBQSxRQUFBLGFBQUEsT0FBQSxlQUFBLFlBQUEsT0FBQSxRQUFBLFNBQUE7O0VBRUEsSUFBQSxLQUFBO0VBQ0EsV0FBQSxrQkFBQTtFQUNBLEdBQUEsVUFBQTtFQUNBLEdBQUEsV0FBQTtFQUNBLEdBQUEsV0FBQTtFQUNBLEdBQUEsYUFBQTtFQUNBLEdBQUEsZUFBQSxTQUFBLFNBQUE7R0FDQSxNQUFBLGFBQUE7O0VBRUEsU0FBQSxpQkFBQTtJQUNBLE9BQUEsTUFBQTs7RUFFQSxTQUFBLFNBQUE7R0FDQSxNQUFBLE1BQUEsR0FBQSxNQUFBLEtBQUEsU0FBQSxTQUFBO0lBQ0EsT0FBQSxRQUFBOztNQUVBLE1BQUEsU0FBQSxTQUFBO0lBQ0EsT0FBQSxNQUFBLHdDQUFBOzs7RUFHQSxTQUFBLFVBQUE7R0FDQSxHQUFBLE1BQUEsa0JBQUE7SUFDQSxNQUFBLFNBQUEsS0FBQSxTQUFBLEtBQUE7S0FDQSxHQUFBLE9BQUEsUUFBQSxLQUFBO01BQ0EsT0FBQSxHQUFBOztLQUVBLE9BQUEsUUFBQTtPQUNBLE1BQUEsU0FBQSxTQUFBOzs7Ozs7SUFNQSxTQUFBLFNBQUEsYUFBQSxJQUFBO01BQ0EsWUFBQTtLQUNBO0VBQ0EsU0FBQSxZQUFBO0dBQ0EsV0FBQSxjQUFBLENBQUEsV0FBQTtHQUNBLGNBQUEsV0FBQSxXQUFBO0dBQ0E7O0VBRUEsU0FBQSxjQUFBO0dBQ0EsU0FBQSxVQUFBO0lBQ0EsWUFBQSxPQUFBLE9BQUEsS0FBQSxVQUFBLEtBQUE7S0FDQSxJQUFBOztNQUVBOztFQUVBLFdBQUEsY0FBQTtFQUNBLE9BQUEsT0FBQSxVQUFBO0dBQ0EsT0FBQSxXQUFBO0tBQ0EsU0FBQSxRQUFBO0dBQ0EsT0FBQSxlQUFBLFdBQUE7O0VBRUEsT0FBQSxPQUFBLHFCQUFBLFNBQUEsRUFBQSxFQUFBO0dBQ0EsR0FBQSxLQUFBLEdBQUEsT0FBQTtHQUNBOzs7Ozs7QUM3REEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsNEJBQUEsU0FBQSxZQUFBO1FBQ0EsSUFBQSxLQUFBO1FBQ0EsWUFBQSxPQUFBLFNBQUEsS0FBQSxTQUFBLFNBQUE7VUFDQSxHQUFBLFVBQUE7Ozs7Ozs7QUNOQSxDQUFBLFlBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSwrQkFBQSxVQUFBLFdBQUE7RUFDQSxLQUFBLFdBQUE7R0FDQSxhQUFBO0dBQ0EsV0FBQTtHQUNBLHlCQUFBO0dBQ0Esa0JBQUE7OztFQUdBLEtBQUEsZUFBQSxVQUFBLE1BQUEsSUFBQTtHQUNBLFVBQUEsS0FBQSxVQUFBO0tBQ0EsTUFBQTtLQUNBLFFBQUEsd0JBQUEsT0FBQTtLQUNBLEdBQUE7S0FDQSxZQUFBOzs7O0lBSUEsS0FBQSxnQkFBQSxXQUFBO0dBQ0EsVUFBQSxLQUFBOztLQUVBLGFBQUE7U0FDQSxrQkFBQTs7S0FFQSxLQUFBLFVBQUEsUUFBQTs7T0FFQSxZQUFBOzs7Ozs7Ozs7QUM1QkEsQ0FBQSxZQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsMktBQUEsVUFBQSxRQUFBLFNBQUEsV0FBQSxTQUFBLFFBQUEsVUFBQSxjQUFBLG9CQUFBLE1BQUEsV0FBQSxhQUFBLGFBQUE7O0VBRUEsSUFBQSxLQUFBO0VBQ0EsR0FBQSxNQUFBOztFQUVBLEdBQUEsYUFBQSxLQUFBLFNBQUE7RUFDQSxHQUFBLGtCQUFBLEtBQUEsU0FBQTtFQUNBLEdBQUEsY0FBQTs7RUFFQSxHQUFBLFlBQUE7RUFDQSxHQUFBLGFBQUEsbUJBQUE7RUFDQSxHQUFBLGtCQUFBLG1CQUFBO0VBQ0EsR0FBQSxzQkFBQSxHQUFBLGdCQUFBO0VBQ0EsR0FBQSxZQUFBLG1CQUFBLEtBQUE7RUFDQSxHQUFBLGFBQUE7RUFDQSxHQUFBLGNBQUE7RUFDQSxHQUFBLFVBQUE7RUFDQSxHQUFBLGFBQUE7RUFDQSxHQUFBLGVBQUE7RUFDQSxHQUFBLFlBQUE7RUFDQSxHQUFBLE9BQUE7RUFDQSxHQUFBLFlBQUE7RUFDQSxHQUFBLFVBQUE7R0FDQSxRQUFBO0dBQ0EsV0FBQTs7RUFFQSxHQUFBLFVBQUE7R0FDQSxhQUFBOzs7O0VBSUEsR0FBQSxpQkFBQTtFQUNBLEdBQUEsU0FBQTtFQUNBLEdBQUEsV0FBQTtFQUNBLEdBQUEsYUFBQTtFQUNBLEdBQUEscUJBQUE7RUFDQSxHQUFBLFVBQUE7RUFDQSxHQUFBLFlBQUE7RUFDQSxHQUFBLGNBQUE7O0VBRUEsR0FBQSxrQkFBQTtFQUNBLEdBQUEsYUFBQTtFQUNBLEdBQUEsYUFBQTtFQUNBLEdBQUEsZ0JBQUE7RUFDQSxHQUFBLG1CQUFBO0VBQ0EsR0FBQSxxQkFBQTtFQUNBLEdBQUEsaUJBQUE7RUFDQSxHQUFBLFNBQUE7O0VBRUEsR0FBQSxXQUFBOztFQUVBOztFQUVBLFNBQUEsV0FBQTs7R0FFQSxHQUFBLGdCQUFBLEtBQUEsU0FBQSxVQUFBO0lBQ0EsR0FBQSxXQUFBLEtBQUEsU0FBQSxLQUFBO0tBQ0EsR0FBQSxPQUFBO0tBQ0EsR0FBQSxZQUFBO0tBQ0EsR0FBQSxDQUFBLEdBQUEsVUFBQSxNQUFBO01BQ0EsR0FBQSxVQUFBLFFBQUE7T0FDQSxPQUFBO09BQ0EsUUFBQTtPQUNBLGFBQUE7OztLQUdBLGFBQUEsR0FBQSxVQUFBLE1BQUE7S0FDQTtLQUNBLEdBQUEsT0FBQSxPQUFBLEtBQUE7TUFDQSxHQUFBLFNBQUEsT0FBQSxPQUFBO01BQ0E7O0tBRUEsR0FBQSxPQUFBLE9BQUEsVUFBQTtNQUNBLEdBQUEsT0FBQTtNQUNBLEdBQUEsUUFBQSxVQUFBLEtBQUEsR0FBQTtNQUNBLEdBQUEsUUFBQSxTQUFBO01BQ0EsV0FBQSxTQUFBO01BQ0EsSUFBQSxZQUFBLE9BQUEsT0FBQSxVQUFBLE1BQUE7TUFDQSxRQUFBLFFBQUEsV0FBQSxTQUFBLElBQUE7T0FDQSxHQUFBLFFBQUEsVUFBQSxLQUFBLGVBQUE7OztNQUdBLFVBQUEsS0FBQSxHQUFBLFFBQUE7TUFDQSxZQUFBLE9BQUEsa0JBQUEsV0FBQSxLQUFBLFVBQUEsTUFBQTtPQUNBLEdBQUEsT0FBQTs7Ozs7Ozs7RUFRQSxTQUFBLFFBQUE7R0FDQSxRQUFBLFFBQUE7O0VBRUEsU0FBQSxlQUFBLFNBQUE7R0FDQSxJQUFBLFdBQUEsTUFBQSxHQUFBLGNBQUEsSUFBQTtJQUNBLEdBQUEsYUFBQTtVQUNBO0lBQ0EsR0FBQSxhQUFBOztHQUVBLEdBQUEsZUFBQSxHQUFBLGFBQUEsa0JBQUE7R0FDQTtFQUNBLFNBQUEsU0FBQSxNQUFBO0dBQ0EsR0FBQSxXQUFBLGVBQUE7R0FDQSxnQkFBQTtHQUNBOztFQUVBLFNBQUEsYUFBQTtHQUNBLEdBQUEsWUFBQSxDQUFBLEdBQUE7R0FDQSxHQUFBLFlBQUEsR0FBQSxhQUFBLE9BQUEsaUJBQUE7O0VBRUEsU0FBQSxXQUFBLEtBQUE7R0FDQSxHQUFBLFVBQUE7R0FDQSxHQUFBO0dBQ0E7O0VBRUEsU0FBQSxtQkFBQSxLQUFBO0dBQ0EsSUFBQSxHQUFBLFdBQUE7SUFDQSxTQUFBLFlBQUE7S0FDQSxHQUFBLFVBQUEsT0FBQSxHQUFBLHFCQUFBLFNBQUEsR0FBQSxRQUFBLEtBQUEsV0FBQTs7O0dBR0E7RUFDQSxTQUFBLFdBQUE7R0FDQSxHQUFBLENBQUEsR0FBQSxRQUFBO0lBQ0E7O0dBRUEsSUFBQSxPQUFBO0dBQ0EsUUFBQSxRQUFBLEdBQUEsTUFBQSxTQUFBLE1BQUE7SUFDQSxLQUFBLEdBQUEsVUFBQSxRQUFBLFdBQUEsS0FBQSxHQUFBLFVBQUE7SUFDQSxLQUFBLFdBQUEsV0FBQSxLQUFBLEdBQUEsVUFBQTs7R0FFQSxHQUFBLE9BQUEsUUFBQSxXQUFBLEdBQUEsTUFBQSxDQUFBLEdBQUEsVUFBQSxPQUFBLE9BQUE7R0FDQSxPQUFBLEdBQUEsS0FBQSxRQUFBLEdBQUEsV0FBQTtHQUNBLEdBQUEsUUFBQSxHQUFBLFVBQUEsS0FBQSxXQUFBO0dBQ0EsR0FBQSxnQkFBQTtLQUNBLE1BQUEsR0FBQSxVQUFBLE1BQUEsY0FBQTtLQUNBLE1BQUEsR0FBQSxVQUFBLEtBQUE7O0dBRUEsT0FBQTs7RUFFQSxTQUFBLFFBQUEsUUFBQTs7R0FFQSxJQUFBLE9BQUEsR0FBQSxLQUFBLFFBQUEsV0FBQTtHQUNBLE9BQUE7O0VBRUEsU0FBQSxhQUFBO0dBQ0EsR0FBQSxPQUFBLENBQUEsR0FBQTtHQUNBOztFQUVBLFNBQUEsZ0JBQUE7R0FDQSxPQUFBLEdBQUEsVUFBQSxDQUFBLEdBQUE7R0FDQTtFQUNBLFNBQUEsZ0JBQUEsSUFBQTtHQUNBLFlBQUEsT0FBQSxTQUFBLE9BQUEsT0FBQSxPQUFBLEtBQUEsS0FBQSxVQUFBLE1BQUE7SUFDQSxHQUFBLFFBQUEsT0FBQTtJQUNBLGVBQUE7OztFQUdBLFNBQUEsZUFBQSxLQUFBO0dBQ0EsR0FBQSxDQUFBLE9BQUEsT0FBQSxVQUFBO0lBQ0EsWUFBQSxPQUFBLGtCQUFBLENBQUEsTUFBQSxLQUFBLFVBQUEsTUFBQTtLQUNBLEdBQUEsT0FBQTs7Ozs7O0VBTUEsU0FBQSxnQkFBQSxNQUFBO0dBQ0EsSUFBQSxRQUFBLENBQUEsR0FBQSxRQUFBLFVBQUEsQ0FBQSxRQUFBLEdBQUEsUUFBQSxRQUFBO0lBQ0EsR0FBQTs7OztFQUlBLFNBQUEsbUJBQUE7R0FDQSxHQUFBLFFBQUEsWUFBQSxDQUFBLEdBQUE7R0FDQSxHQUFBLFFBQUEsU0FBQSxDQUFBLEdBQUEsUUFBQTtHQUNBLElBQUEsR0FBQSxRQUFBLFFBQUE7SUFDQSxHQUFBLE9BQUE7SUFDQSxXQUFBLFNBQUE7SUFDQSxHQUFBLFVBQUEsUUFBQSxjQUFBO0lBQ0EsR0FBQSxVQUFBLFNBQUE7O1VBRUE7SUFDQSxXQUFBLFNBQUE7SUFDQSxRQUFBLFFBQUEsR0FBQSxVQUFBLE9BQUEsR0FBQSxxQkFBQSxVQUFBLFVBQUEsU0FBQTtLQUNBLFFBQUEsV0FBQTs7SUFFQSxHQUFBLFVBQUEsT0FBQSxHQUFBLHFCQUFBLFNBQUEsR0FBQSxRQUFBLEtBQUEsV0FBQTtJQUNBLEdBQUEsVUFBQSxRQUFBLGNBQUE7SUFDQSxHQUFBLFVBQUEsU0FBQTtJQUNBLFlBQUEsT0FBQSxrQkFBQSxDQUFBLEdBQUEsUUFBQSxNQUFBLEtBQUEsVUFBQSxNQUFBO0tBQ0EsR0FBQSxPQUFBOztJQUVBLE9BQUEsR0FBQSwwQkFBQTtLQUNBLE1BQUEsT0FBQSxPQUFBO0tBQ0EsS0FBQSxPQUFBLE9BQUE7Ozs7R0FJQTs7RUFFQSxTQUFBLG1CQUFBLFNBQUE7R0FDQSxJQUFBLFFBQUE7R0FDQSxRQUFBLFFBQUEsR0FBQSxRQUFBLFdBQUEsVUFBQSxLQUFBLEtBQUE7SUFDQSxJQUFBLFdBQUEsT0FBQSxPQUFBLEdBQUEsU0FBQTtLQUNBLEdBQUEsUUFBQSxVQUFBLE9BQUEsS0FBQTtLQUNBLFFBQUE7OztHQUdBLElBQUEsQ0FBQSxPQUFBO0lBQ0EsR0FBQSxRQUFBLFVBQUEsS0FBQTtJQUNBO0dBQ0EsSUFBQSxPQUFBO0dBQ0EsSUFBQSxVQUFBO0dBQ0EsUUFBQSxRQUFBLEdBQUEsUUFBQSxXQUFBLFVBQUEsTUFBQSxLQUFBO0lBQ0EsS0FBQSxLQUFBLEtBQUE7SUFDQSxHQUFBLEtBQUEsR0FBQSxVQUFBLFFBQUEsR0FBQSxRQUFBLElBQUE7S0FDQSxRQUFBLEtBQUEsS0FBQTs7O0dBR0EsSUFBQSxLQUFBLFNBQUEsR0FBQTtJQUNBLFlBQUEsT0FBQSxrQkFBQSxNQUFBLEtBQUEsVUFBQSxNQUFBO0tBQ0EsR0FBQSxPQUFBOztJQUVBLE9BQUEsR0FBQSxrQ0FBQTtLQUNBLE9BQUEsT0FBQSxPQUFBO0tBQ0EsTUFBQSxPQUFBLE9BQUE7S0FDQSxVQUFBLFFBQUEsS0FBQTs7OztHQUlBLE9BQUEsQ0FBQTtHQUNBOztFQUVBLFNBQUEsWUFBQTtHQUNBLElBQUEsQ0FBQSxHQUFBLFNBQUE7SUFDQSxPQUFBOzs7R0FHQSxPQUFBLENBQUEsR0FBQSxRQUFBLEdBQUEsV0FBQSxLQUFBO0dBQ0E7O0VBRUEsU0FBQSxjQUFBO0dBQ0EsSUFBQSxDQUFBLEdBQUEsU0FBQTtJQUNBLE9BQUE7O0dBRUEsT0FBQSxHQUFBLFFBQUEsaUJBQUEsSUFBQSxrQkFBQTtHQUNBOztFQUVBLFNBQUEsT0FBQSxHQUFBO0dBQ0EsR0FBQSxZQUFBOzs7RUFHQSxTQUFBLFVBQUEsTUFBQTtHQUNBLElBQUEsUUFBQTtHQUNBLFFBQUEsUUFBQSxLQUFBLFVBQUEsVUFBQSxNQUFBO0lBQ0EsSUFBQSxLQUFBLGVBQUEsR0FBQSxRQUFBLFlBQUEsTUFBQTtLQUNBLEdBQUEsYUFBQTs7SUFFQSxVQUFBOztHQUVBLE9BQUE7OztFQUdBLFNBQUEsV0FBQTtHQUNBLFVBQUEsR0FBQTtHQUNBOztFQUVBLFNBQUEsZ0JBQUEsTUFBQTtHQUNBLElBQUEsU0FBQTtHQUNBLFFBQUEsUUFBQSxHQUFBLE1BQUEsVUFBQSxLQUFBO0lBQ0EsSUFBQSxJQUFBLFdBQUEsTUFBQTtLQUNBLFNBQUE7OztHQUdBLE9BQUE7R0FDQTs7RUFFQSxTQUFBLGVBQUEsS0FBQTtHQUNBLElBQUEsU0FBQTtHQUNBLFFBQUEsUUFBQSxHQUFBLE1BQUEsVUFBQSxLQUFBO0lBQ0EsSUFBQSxJQUFBLE9BQUEsS0FBQTtLQUNBLFNBQUE7Ozs7R0FJQSxPQUFBO0dBQ0E7O0VBRUEsU0FBQSxhQUFBLE9BQUE7O0dBRUEsR0FBQSxTQUFBLFNBQUEsY0FBQTtHQUNBLEdBQUEsT0FBQSxRQUFBO0dBQ0EsR0FBQSxPQUFBLFNBQUE7R0FDQSxHQUFBLE1BQUEsR0FBQSxPQUFBLFdBQUE7R0FDQSxJQUFBLFdBQUEsR0FBQSxJQUFBLHFCQUFBLEdBQUEsR0FBQSxLQUFBO0dBQ0EsU0FBQSxhQUFBLEdBQUE7R0FDQSxTQUFBLGFBQUEsTUFBQSxVQUFBO0dBQ0EsU0FBQSxhQUFBLEdBQUE7R0FDQSxHQUFBLElBQUEsWUFBQTtHQUNBLEdBQUEsSUFBQSxTQUFBLEdBQUEsR0FBQSxLQUFBO0dBQ0EsR0FBQSxVQUFBLEdBQUEsSUFBQSxhQUFBLEdBQUEsR0FBQSxLQUFBLEdBQUE7Ozs7RUFJQSxTQUFBLGFBQUEsT0FBQTtHQUNBLElBQUEsV0FBQSxHQUFBLElBQUEscUJBQUEsR0FBQSxHQUFBLEtBQUE7R0FDQSxTQUFBLGFBQUEsR0FBQTtHQUNBLFNBQUEsYUFBQSxNQUFBLFNBQUE7R0FDQSxTQUFBLGFBQUEsR0FBQTtHQUNBLEdBQUEsSUFBQSxZQUFBO0dBQ0EsR0FBQSxJQUFBLFNBQUEsR0FBQSxHQUFBLEtBQUE7R0FDQSxHQUFBLFVBQUEsR0FBQSxJQUFBLGFBQUEsR0FBQSxHQUFBLEtBQUEsR0FBQTs7R0FFQTs7RUFFQSxTQUFBLGNBQUEsU0FBQTtHQUNBLElBQUEsUUFBQTtHQUNBLElBQUEsTUFBQSxRQUFBLFdBQUEsR0FBQTtHQUNBLElBQUEsU0FBQSxlQUFBO0dBQ0EsSUFBQSxRQUFBLEdBQUEsVUFBQSxRQUFBOzs7R0FHQSxJQUFBLFdBQUEsU0FBQSxNQUFBLE1BQUEsT0FBQSxVQUFBOztHQUVBLElBQUEsUUFBQSxVQUFBLEdBQUEsUUFBQSxZQUFBLE9BQUEsR0FBQSxRQUFBLFdBQUEsS0FBQSxPQUFBLEdBQUEsUUFBQSxXQUFBLEtBQUEsTUFBQSxHQUFBLFFBQUEsV0FBQSxLQUFBO0dBQ0EsTUFBQSxRQUFBO0dBQ0EsTUFBQSxVQUFBO0lBQ0EsT0FBQTtJQUNBLE1BQUE7O0dBRUEsTUFBQSxXQUFBO0lBQ0EsT0FBQTtJQUNBLFNBQUE7S0FDQSxPQUFBO0tBQ0EsTUFBQTs7O0dBR0EsT0FBQTtHQUNBOztFQUVBLFNBQUEsZUFBQSxTQUFBOztHQUVBLElBQUEsUUFBQTtHQUNBLElBQUEsTUFBQSxRQUFBLFdBQUEsR0FBQTs7R0FFQSxJQUFBLFNBQUEsZUFBQTtHQUNBLElBQUEsUUFBQSxHQUFBLFVBQUEsUUFBQTtHQUNBLElBQUEsT0FBQSxRQUFBO0dBQ0EsR0FBQSxPQUFBLEdBQUEsUUFBQSxJQUFBO0tBQ0EsUUFBQSxXQUFBOzs7R0FHQSxRQUFBO0dBQ0EsS0FBQTtJQUNBLElBQUEsT0FBQSxPQUFBLFVBQUEsYUFBQTs7O0tBR0EsSUFBQSxXQUFBLFNBQUEsTUFBQSxNQUFBLFNBQUEsT0FBQSxXQUFBOztLQUVBLElBQUEsUUFBQSxVQUFBLEdBQUEsUUFBQSxZQUFBLE9BQUEsR0FBQSxRQUFBLFdBQUEsS0FBQSxPQUFBLEdBQUEsUUFBQSxXQUFBLEtBQUEsTUFBQSxHQUFBLFFBQUEsV0FBQSxLQUFBO0tBQ0EsTUFBQSxRQUFBLFVBQUEsR0FBQSxRQUFBLFlBQUEsT0FBQSxHQUFBLFFBQUEsV0FBQSxLQUFBLE9BQUEsR0FBQSxRQUFBLFdBQUEsS0FBQTtLQUNBLE1BQUEsVUFBQTtNQUNBLE9BQUE7TUFDQSxNQUFBOztLQUVBLE1BQUEsV0FBQTtNQUNBLE9BQUEsVUFBQSxHQUFBLFFBQUEsWUFBQSxPQUFBLEdBQUEsUUFBQSxXQUFBLEtBQUEsT0FBQSxHQUFBLFFBQUEsV0FBQSxLQUFBO01BQ0EsU0FBQTtPQUNBLE9BQUE7T0FDQSxNQUFBOzs7S0FHQTtXQUNBOztLQUVBLE1BQUEsUUFBQTtLQUNBLE1BQUEsVUFBQTtNQUNBLE9BQUE7TUFDQSxNQUFBOzs7OztHQUtBLElBQUEsUUFBQSxNQUFBLFNBQUEsbUJBQUEsVUFBQSxTQUFBO0lBQ0EsTUFBQSxjQUFBLFlBQUE7S0FDQSxJQUFBLFFBQUE7TUFDQSxNQUFBLFFBQUEsV0FBQTtNQUNBLFVBQUEsQ0FBQSxLQUFBO01BQ0EsVUFBQTs7S0FFQSxPQUFBOzs7R0FHQSxPQUFBO0dBQ0E7O0VBRUEsT0FBQSxPQUFBLGNBQUEsVUFBQSxHQUFBLEdBQUE7R0FDQSxJQUFBLE1BQUEsR0FBQTtJQUNBOzs7R0FHQSxHQUFBLEVBQUEsS0FBQTtJQUNBLEdBQUEsRUFBQSxJQUFBO0tBQ0EsR0FBQSxVQUFBLE9BQUEsR0FBQSxxQkFBQSxTQUFBLEVBQUEsS0FBQSxXQUFBOztJQUVBO0lBQ0EsZ0JBQUEsRUFBQTtJQUNBLEdBQUEsVUFBQSxPQUFBLEdBQUEscUJBQUEsU0FBQSxFQUFBLEtBQUEsV0FBQTtJQUNBLEdBQUEsT0FBQSxRQUFBLFFBQUEsNkJBQUEsT0FBQSxRQUFBLFFBQUEsaUJBQUE7S0FDQSxPQUFBLEdBQUEsMkJBQUE7TUFDQSxPQUFBLE9BQUEsT0FBQTtNQUNBLE1BQUEsRUFBQTs7O1VBR0E7SUFDQSxPQUFBLEdBQUEsaUJBQUE7S0FDQSxPQUFBLE9BQUEsT0FBQTs7OztFQUlBLE9BQUEsT0FBQSwwQkFBQSxVQUFBLEdBQUEsR0FBQTtHQUNBLElBQUEsTUFBQSxHQUFBO0lBQ0E7O0dBRUEsUUFBQSxJQUFBO0dBQ0EsSUFBQSxFQUFBO0lBQ0EsYUFBQSxFQUFBO1FBQ0E7SUFDQSxhQUFBO0lBQ0E7R0FDQSxHQUFBOzs7Ozs7Ozs7Ozs7O0dBYUEsSUFBQSxHQUFBLFFBQUEsS0FBQTtJQUNBLEdBQUEsT0FBQSxPQUFBLFVBQUE7S0FDQSxPQUFBLEdBQUEsbUNBQUE7TUFDQSxPQUFBLEVBQUE7TUFDQSxNQUFBLEdBQUEsUUFBQTtNQUNBLFdBQUEsT0FBQSxPQUFBOzs7UUFHQTtLQUNBLE9BQUEsR0FBQSwyQkFBQTtNQUNBLE9BQUEsRUFBQTtNQUNBLE1BQUEsR0FBQSxRQUFBOzs7VUFHQTtJQUNBLE9BQUEsR0FBQSxrQkFBQTtLQUNBLE9BQUEsRUFBQTs7Ozs7RUFLQSxPQUFBLE9BQUEsV0FBQSxVQUFBLEdBQUEsR0FBQTtHQUNBLElBQUEsTUFBQSxHQUFBO0lBQ0E7Ozs7Ozs7O0dBUUEsSUFBQSxZQUFBLEVBQUEsT0FBQSxFQUFBLFlBQUEsR0FBQSxHQUFBLElBQUEsRUFBQSxZQUFBLEdBQUEsR0FBQTtJQUNBLFlBQUEsRUFBQSxPQUFBLEVBQUEsWUFBQSxHQUFBLEdBQUEsSUFBQSxFQUFBLFlBQUEsR0FBQSxHQUFBO0lBQ0EsU0FBQSxFQUFBLGFBQUEsV0FBQTs7R0FFQSxJQUFBLE1BQUE7SUFDQSxDQUFBLEdBQUE7SUFDQSxDQUFBLElBQUE7O0dBRUEsSUFBQSxHQUFBLFFBQUEsUUFBQTtJQUNBLE1BQUE7S0FDQSxDQUFBLEdBQUE7S0FDQSxDQUFBLEdBQUE7OztHQUdBLEdBQUEsSUFBQSxVQUFBLFFBQUE7SUFDQSxRQUFBLElBQUE7SUFDQSxTQUFBOzs7O0VBSUEsT0FBQSxJQUFBLHVCQUFBLFVBQUEsT0FBQSxTQUFBLFVBQUEsV0FBQSxZQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0VBa0NBLFNBQUEsZ0JBQUE7R0FDQSxZQUFBLE9BQUEsT0FBQSxLQUFBLFVBQUEsS0FBQTtJQUNBLEdBQUEsTUFBQTtJQUNBLEdBQUEsWUFBQSxtQkFBQTtJQUNBLFNBQUEsWUFBQTtLQUNBLEdBQUEsT0FBQSxPQUFBLFVBQUE7TUFDQSxHQUFBLFVBQUEsUUFBQSxjQUFBO01BQ0EsR0FBQSxVQUFBLFNBQUE7TUFDQSxHQUFBLFVBQUEsT0FBQSxHQUFBLHFCQUFBLFNBQUEsR0FBQSxRQUFBLEtBQUEsV0FBQTtNQUNBLElBQUEsWUFBQSxPQUFBLE9BQUEsVUFBQSxNQUFBO01BQ0EsUUFBQSxRQUFBLFdBQUEsU0FBQSxJQUFBO09BQ0EsR0FBQSxVQUFBLE9BQUEsR0FBQSxxQkFBQSxTQUFBLEtBQUEsV0FBQTs7OztTQUlBO01BQ0EsR0FBQSxVQUFBLFNBQUE7TUFDQSxHQUFBLE9BQUEsT0FBQSxLQUFBO1FBQ0EsR0FBQSxVQUFBLE9BQUEsR0FBQSxxQkFBQSxTQUFBLE9BQUEsT0FBQSxNQUFBLFdBQUE7Ozs7O0lBS0EsR0FBQSxVQUFBLFFBQUEsVUFBQSxVQUFBLEtBQUEsR0FBQTtLQUNBLElBQUEsQ0FBQSxHQUFBLFFBQUEsUUFBQTtNQUNBLElBQUEsSUFBQSxlQUFBLElBQUEsUUFBQSxXQUFBLEdBQUE7TUFDQSxJQUFBLE9BQUEsRUFBQSxHQUFBLFVBQUEsU0FBQSxhQUFBO09BQ0EsR0FBQSxVQUFBLGVBQUEsSUFBQSxRQUFBLFdBQUEsR0FBQTthQUNBO09BQ0EsYUFBQSxNQUFBOztZQUVBO01BQ0EsUUFBQSxJQUFBO01BQ0EsSUFBQSxJQUFBLGVBQUEsSUFBQSxRQUFBLFdBQUEsR0FBQTtNQUNBLElBQUEsT0FBQSxFQUFBLEdBQUEsVUFBQSxTQUFBLGFBQUE7T0FDQSxHQUFBLG1CQUFBO2FBQ0E7T0FDQSxhQUFBLE1BQUE7Ozs7Ozs7OztBQzNqQkEsQ0FBQSxZQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsc0NBQUEsVUFBQSxPQUFBLFFBQUE7O0lBRUEsT0FBQSxTQUFBOzs7O0FDTEEsQ0FBQSxZQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsc0VBQUEsVUFBQSxRQUFBLGNBQUEsYUFBQSxRQUFBOztFQUVBLElBQUEsS0FBQTtFQUNBLEdBQUEsT0FBQSxhQUFBO0VBQ0EsR0FBQSxPQUFBLGFBQUE7RUFDQSxHQUFBLFNBQUEsYUFBQTtFQUNBLEdBQUEsYUFBQSxhQUFBO0VBQ0EsR0FBQSxXQUFBOzs7RUFHQTs7RUFFQSxTQUFBLFdBQUE7R0FDQSxJQUFBLEdBQUEsS0FBQSxZQUFBO0lBQ0EsR0FBQSxLQUFBLE9BQUEsR0FBQSxLQUFBLEdBQUEsS0FBQSxHQUFBLEdBQUEsS0FBQTs7R0FFQTs7O0VBR0EsU0FBQSxZQUFBO0dBQ0EsSUFBQSxDQUFBLEdBQUEsTUFBQTtJQUNBLE9BQUEsR0FBQTs7OztFQUlBLFNBQUEsU0FBQSxPQUFBO0dBQ0EsSUFBQSxPQUFBO0lBQ0EsSUFBQSxhQUFBO0tBQ0EsTUFBQTs7SUFFQSxJQUFBLGFBQUE7S0FDQSxTQUFBO0lBQ0EsR0FBQSxVQUFBO0lBQ0EsUUFBQSxRQUFBLEdBQUEsTUFBQSxVQUFBLE1BQUEsS0FBQTtLQUNBLElBQUEsS0FBQSxPQUFBLFVBQUEsR0FBQTtNQUNBLEtBQUEsS0FBQSxHQUFBLE9BQUEsR0FBQSxLQUFBO01BQ0EsR0FBQSxHQUFBLEtBQUEsY0FBQSxHQUFBLEtBQUEsY0FBQSxRQUFBO09BQ0EsT0FBQSxLQUFBLEtBQUEsR0FBQSxHQUFBLEtBQUE7O01BRUEsR0FBQSxLQUFBLFdBQUEsS0FBQSxLQUFBLEdBQUEsR0FBQSxLQUFBLFdBQUEsVUFBQSxJQUFBLGVBQUE7TUFDQSxXQUFBLEtBQUEsS0FBQSxLQUFBLEtBQUE7O1lBRUE7TUFDQSxPQUFBLE1BQUEsK0JBQUE7TUFDQTs7O0lBR0EsUUFBQSxRQUFBLEdBQUEsWUFBQSxVQUFBLE1BQUEsS0FBQTtLQUNBLElBQUEsT0FBQSxHQUFBLEtBQUEsYUFBQSxPQUFBLEdBQUEsS0FBQSxlQUFBO01BQ0EsSUFBQSxXQUFBO01BQ0EsSUFBQSxPQUFBLEdBQUEsV0FBQSxLQUFBLFNBQUEsYUFBQTtPQUNBLFdBQUEsR0FBQSxXQUFBLEtBQUEsTUFBQTs7TUFFQSxJQUFBLFFBQUE7T0FDQSxVQUFBO09BQ0EsU0FBQSxHQUFBLFdBQUEsS0FBQTtPQUNBLGVBQUEsR0FBQSxXQUFBLEtBQUE7T0FDQSxtQkFBQSxHQUFBLFdBQUEsS0FBQSxLQUFBLE1BQUE7T0FDQSxhQUFBLEdBQUEsV0FBQSxLQUFBLGFBQUE7T0FDQSxZQUFBO09BQ0EsbUJBQUEsR0FBQSxXQUFBLEtBQUEsYUFBQSxNQUFBOztNQUVBLElBQUEsYUFBQTtNQUNBLFFBQUEsUUFBQSxHQUFBLFdBQUEsS0FBQSxZQUFBLFVBQUEsS0FBQTtPQUNBLFdBQUEsS0FBQSxJQUFBOztNQUVBLE1BQUEsYUFBQTtNQUNBLE9BQUEsS0FBQTs7O0lBR0EsR0FBQSxLQUFBLFNBQUE7SUFDQSxRQUFBLElBQUEsR0FBQTtJQUNBLFlBQUEsS0FBQSxlQUFBLEdBQUEsTUFBQSxLQUFBLFVBQUEsVUFBQTtLQUNBLFlBQUEsS0FBQSxpQkFBQSxTQUFBLGFBQUEsV0FBQSxZQUFBLEtBQUEsVUFBQSxLQUFBO01BQ0EsSUFBQSxPQUFBLE1BQUE7T0FDQSxPQUFBLFFBQUEsV0FBQSxLQUFBLFNBQUEsd0JBQUEsR0FBQSxLQUFBLE1BQUE7T0FDQSxhQUFBO09BQ0EsT0FBQSxHQUFBO09BQ0EsR0FBQSxPQUFBO09BQ0EsR0FBQSxPQUFBOztNQUVBLEdBQUEsVUFBQTs7T0FFQSxVQUFBLFVBQUE7S0FDQSxJQUFBLFNBQUEsU0FBQTtNQUNBLE9BQUEsTUFBQSxTQUFBLFNBQUE7OztLQUdBLEdBQUEsVUFBQTs7Ozs7Ozs7QUMzRkEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsdUNBQUEsU0FBQSxhQUFBO01BQ0EsSUFBQSxLQUFBO01BQ0EsR0FBQSxPQUFBLGFBQUE7TUFDQSxHQUFBLE9BQUEsYUFBQTtNQUNBLEdBQUEsYUFBQSxhQUFBO01BQ0EsR0FBQSxtQkFBQSxPQUFBLEtBQUEsR0FBQSxZQUFBOzs7OztBQ1JBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLGlIQUFBLFNBQUEsUUFBQSxRQUFBLG1CQUFBLFNBQUEsYUFBQSxhQUFBLE9BQUE7OztRQUdBLElBQUEsS0FBQTtRQUNBLEdBQUEsTUFBQTtRQUNBLEdBQUEsTUFBQTtRQUNBLEdBQUEsYUFBQTtRQUNBLEdBQUEsUUFBQTtRQUNBLEdBQUEsT0FBQSxhQUFBO1FBQ0EsR0FBQSxPQUFBLGFBQUE7UUFDQSxHQUFBLFNBQUEsYUFBQTtRQUNBLEdBQUEsWUFBQSxhQUFBO1FBQ0EsR0FBQSxpQkFBQTtRQUNBLG1CQUFBLGFBQUE7OztRQUdBOztRQUVBLFNBQUEsVUFBQTtVQUNBOzs7UUFHQSxTQUFBLFdBQUE7VUFDQSxHQUFBLENBQUEsR0FBQSxLQUFBO1lBQ0EsT0FBQSxHQUFBOzs7O1FBSUEsT0FBQSxPQUFBLFVBQUEsRUFBQSxPQUFBLGFBQUEsb0JBQUEsU0FBQSxFQUFBLEVBQUE7VUFDQSxHQUFBLE1BQUEsRUFBQTtVQUNBLEdBQUEsWUFBQTtVQUNBLEdBQUEsTUFBQTtVQUNBLEdBQUEsTUFBQTtVQUNBLEdBQUEsR0FBQSxVQUFBLE1BQUE7WUFDQSxtQkFBQSxhQUFBLEdBQUEsVUFBQSxNQUFBOztVQUVBOzs7UUFHQSxPQUFBLE9BQUEsZ0JBQUEsU0FBQSxFQUFBLEVBQUE7VUFDQSxHQUFBLE1BQUEsR0FBQTtVQUNBLEdBQUEsT0FBQSxFQUFBLFlBQUEsYUFBQTtZQUNBLEdBQUEsRUFBQSxZQUFBLEVBQUEsU0FBQTtjQUNBLEdBQUEsRUFBQSxNQUFBO2dCQUNBLG1CQUFBLGFBQUEsRUFBQSxNQUFBOztrQkFFQTtrQkFDQSxtQkFBQSxhQUFBOztjQUVBOzs7Y0FHQTtZQUNBLEdBQUEsT0FBQSxFQUFBLGNBQUEsWUFBQTtjQUNBLEdBQUEsRUFBQSxXQUFBLE9BQUE7Z0JBQ0EsbUJBQUEsYUFBQSxFQUFBLFdBQUEsR0FBQSxNQUFBOztrQkFFQTtnQkFDQSxtQkFBQSxhQUFBOzs7WUFHQTs7O1VBR0EsYUFBQTtVQUNBOzs7UUFHQSxTQUFBLFFBQUE7VUFDQSxHQUFBLE1BQUE7VUFDQSxHQUFBLE1BQUE7VUFDQSxRQUFBLFFBQUEsR0FBQSxNQUFBLFNBQUEsTUFBQSxJQUFBO2NBQ0EsR0FBQSxNQUFBLEtBQUEsSUFBQSxLQUFBLEtBQUEsR0FBQSxHQUFBLFVBQUEsY0FBQSxHQUFBO2NBQ0EsR0FBQSxNQUFBLEtBQUEsSUFBQSxLQUFBLEtBQUEsR0FBQSxHQUFBLFVBQUEsY0FBQSxHQUFBOztVQUVBLEdBQUEsUUFBQSxHQUFBLE1BQUEsU0FBQSxPQUFBLENBQUEsR0FBQSxJQUFBLEdBQUEsTUFBQSxNQUFBLENBQUEsRUFBQTs7UUFFQSxTQUFBLGNBQUEsSUFBQTtVQUNBLElBQUEsUUFBQTtVQUNBLFFBQUEsUUFBQSxHQUFBLE1BQUEsU0FBQSxNQUFBLElBQUE7YUFDQSxHQUFBLEtBQUEsS0FBQSxHQUFBLEdBQUEsS0FBQSxjQUFBLElBQUE7ZUFDQSxRQUFBLEtBQUEsS0FBQSxHQUFBLEdBQUEsVUFBQTs7O1VBR0EsT0FBQTs7UUFFQSxTQUFBLGVBQUEsU0FBQTtPQUNBLElBQUEsUUFBQTtPQUNBLElBQUEsTUFBQSxRQUFBLFdBQUE7T0FDQSxJQUFBLFFBQUEsY0FBQSxRQUFBLEdBQUE7T0FDQSxJQUFBLFFBQUEsR0FBQSxVQUFBO09BQ0EsSUFBQSxPQUFBLFFBQUE7O09BRUEsUUFBQTtPQUNBLEtBQUE7O1NBRUEsSUFBQSxXQUFBLFNBQUEsTUFBQSxNQUFBLFNBQUEsR0FBQSxNQUFBLFdBQUE7U0FDQSxJQUFBLFFBQUEsVUFBQSxtQkFBQSxTQUFBLFlBQUEsT0FBQSxtQkFBQSxTQUFBLFdBQUEsS0FBQSxPQUFBLG1CQUFBLFNBQUEsV0FBQSxLQUFBLE1BQUEsbUJBQUEsU0FBQSxXQUFBLEtBQUE7Y0FDQSxNQUFBLFFBQUEsVUFBQSxtQkFBQSxTQUFBLGFBQUEsT0FBQSxtQkFBQSxTQUFBLFdBQUEsS0FBQSxPQUFBLG1CQUFBLFNBQUEsV0FBQSxLQUFBO1NBQ0EsTUFBQSxVQUFBO1VBQ0EsT0FBQTtVQUNBLE1BQUE7O1NBRUEsTUFBQSxXQUFBO1VBQ0EsT0FBQSxVQUFBLG1CQUFBLFNBQUEsWUFBQSxPQUFBLG1CQUFBLFNBQUEsV0FBQSxLQUFBLE9BQUEsbUJBQUEsU0FBQSxXQUFBLEtBQUE7VUFDQSxTQUFBO1dBQ0EsT0FBQTtXQUNBLE1BQUE7OztTQUdBOzs7O09BSUEsSUFBQSxRQUFBLE1BQUEsU0FBQSxtQkFBQSxVQUFBLFNBQUE7UUFDQSxNQUFBLGNBQUEsWUFBQTtTQUNBLElBQUEsUUFBQTtVQUNBLE1BQUEsUUFBQSxXQUFBO1VBQ0EsVUFBQSxDQUFBLEtBQUE7VUFDQSxVQUFBOztTQUVBLE9BQUE7OztPQUdBLE9BQUE7O1FBRUEsU0FBQSxjQUFBO1VBQ0EsR0FBQSxVQUFBLFNBQUE7VUFDQSxHQUFBLFVBQUE7O1FBRUEsU0FBQSxnQkFBQTtVQUNBO09BQ0EsWUFBQSxPQUFBLE9BQUEsS0FBQSxVQUFBLEtBQUE7UUFDQSxHQUFBLE1BQUE7UUFDQSxHQUFBLFlBQUEsbUJBQUE7UUFDQSxTQUFBLFlBQUE7VUFDQTs7Ozs7Ozs7QUMzSUEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsZ0ZBQUEsU0FBQSxPQUFBLFlBQUEsZUFBQSxhQUFBO01BQ0EsSUFBQSxLQUFBO01BQ0EsR0FBQSxPQUFBLGFBQUE7TUFDQSxHQUFBLE9BQUEsYUFBQTtNQUNBLEdBQUEsYUFBQSxhQUFBO01BQ0EsR0FBQSxtQkFBQTtNQUNBLEdBQUEsWUFBQTtNQUNBLEdBQUEsV0FBQTs7TUFFQSxTQUFBLGlCQUFBLElBQUE7UUFDQSxHQUFBLE9BQUEsYUFBQSxhQUFBLFFBQUEsWUFBQTtVQUNBLGFBQUEsYUFBQSxJQUFBO1lBQ0EsWUFBQTtZQUNBLE1BQUE7OztRQUdBLEdBQUEsY0FBQTtRQUNBLEdBQUEsWUFBQSxhQUFBLGFBQUE7UUFDQSxhQUFBOztNQUVBLFNBQUEsVUFBQSxLQUFBO1FBQ0EsR0FBQSxPQUFBLFFBQUEsYUFBQSxPQUFBO0tBQ0EsSUFBQSxLQUFBLFNBQUEsS0FBQSxRQUFBLEtBQUEsZ0JBQUEsS0FBQSxNQUFBLFVBQUEsR0FBQTtNQUNBLE9BQUE7O0tBRUEsT0FBQTs7SUFFQSxTQUFBLFVBQUEsS0FBQTtRQUNBLEdBQUEsT0FBQSxRQUFBLGVBQUEsT0FBQSxLQUFBLGNBQUEsYUFBQSxPQUFBO0tBQ0EsT0FBQSxVQUFBLFNBQUEsS0FBQSxXQUFBLFNBQUEsT0FBQTs7TUFFQSxPQUFBLE9BQUEsVUFBQSxFQUFBLE9BQUEsYUFBQSxvQkFBQSxTQUFBLEVBQUEsRUFBQTtRQUNBLEdBQUEsTUFBQSxFQUFBO1FBQ0EsR0FBQSxXQUFBLEVBQUEsZUFBQTtRQUNBO01BQ0EsT0FBQSxPQUFBLFVBQUEsRUFBQSxPQUFBLGFBQUEsb0JBQUEsU0FBQSxFQUFBLEVBQUE7UUFDQSxJQUFBLE1BQUEsS0FBQSxPQUFBLEtBQUEsYUFBQTtRQUNBLEdBQUEsQ0FBQSxHQUFBLGtCQUFBO1VBQ0EsR0FBQSxjQUFBLEdBQUEsV0FBQSxFQUFBLGFBQUE7VUFDQSxHQUFBLGFBQUEsR0FBQSxXQUFBLEVBQUEsYUFBQTtVQUNBLEdBQUEsVUFBQSxHQUFBLFdBQUEsRUFBQSxhQUFBO1VBQ0EsR0FBQSxnQkFBQSxHQUFBLFdBQUEsRUFBQSxhQUFBO1VBQ0EsR0FBQSxZQUFBLEdBQUEsV0FBQSxFQUFBLGFBQUE7VUFDQSxHQUFBLFdBQUEsR0FBQSxXQUFBLEVBQUEsYUFBQTs7VUFFQSxjQUFBLGFBQUEsZ0JBQUE7ZUFDQTs7Ozs7Ozs7Ozs7QUNqREEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsbUJBQUEsVUFBQTs7Ozs7O0FDSEEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsd0NBQUEsU0FBQSxZQUFBO01BQ0EsSUFBQSxLQUFBO01BQ0EsR0FBQSxPQUFBLFlBQUE7Ozs7QUNMQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSx1Q0FBQSxTQUFBLFlBQUE7TUFDQSxJQUFBLEtBQUE7TUFDQSxHQUFBLE9BQUEsWUFBQTs7OztBQ0xBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLCtLQUFBLFNBQUEsUUFBQSxjQUFBLGFBQUEsU0FBQSxRQUFBLFNBQUEsYUFBQSxRQUFBLGFBQUEsY0FBQSxtQkFBQTs7Ozs7Ozs7Ozs7Ozs7O1FBZUEsSUFBQSxLQUFBO1FBQ0EsR0FBQSxNQUFBO1FBQ0EsR0FBQSxPQUFBO1FBQ0EsR0FBQSxXQUFBO1FBQ0EsR0FBQSxXQUFBO1FBQ0EsR0FBQSxlQUFBO1FBQ0EsR0FBQSxtQkFBQTtRQUNBLEdBQUEsa0JBQUE7O1FBRUEsR0FBQSxTQUFBO1FBQ0EsR0FBQSxTQUFBO1FBQ0EsR0FBQSxZQUFBO1FBQ0EsR0FBQSxtQkFBQTtRQUNBLEdBQUEsYUFBQTtRQUNBLEdBQUEsY0FBQTtRQUNBLEdBQUEsZUFBQTtRQUNBLEdBQUEsZ0JBQUE7UUFDQSxHQUFBLE9BQUE7UUFDQSxHQUFBLFlBQUE7OztRQUdBLEdBQUEsZ0JBQUE7UUFDQSxHQUFBLHNCQUFBO1FBQ0EsR0FBQSxtQkFBQTtRQUNBLEdBQUEsaUJBQUE7UUFDQSxHQUFBLHFCQUFBO1FBQ0EsR0FBQSxxQkFBQTtRQUNBLEdBQUEsdUJBQUE7UUFDQSxHQUFBLHlCQUFBO1FBQ0EsR0FBQSxXQUFBO1FBQ0EsR0FBQSxpQkFBQTtRQUNBLEdBQUEsWUFBQTtRQUNBLEdBQUEsY0FBQTtRQUNBLEdBQUEsWUFBQTs7UUFFQSxHQUFBLFFBQUEsYUFBQTs7O1FBR0EsR0FBQSxPQUFBO1VBQ0EsV0FBQTtVQUNBLGNBQUE7VUFDQSxNQUFBOztRQUVBLEdBQUEsUUFBQTtVQUNBLFFBQUE7VUFDQSxPQUFBO1VBQ0EsT0FBQTtVQUNBLE1BQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7UUFtQkE7O1FBRUEsU0FBQSxVQUFBOzs7UUFHQSxTQUFBLFVBQUEsT0FBQTtVQUNBLE9BQUEsU0FBQSxXQUFBOztRQUVBLFNBQUEsZ0JBQUEsUUFBQTtTQUNBLElBQUEsUUFBQTtjQUNBLE1BQUE7Y0FDQSxTQUFBO1VBQ0EsT0FBQTtVQUNBLE1BQUE7OztTQUdBLE9BQUE7O1FBRUEsU0FBQSxVQUFBO1dBQ0EsWUFBQSxPQUFBLE9BQUEsS0FBQSxVQUFBLEtBQUE7Y0FDQSxHQUFBLFlBQUEsbUJBQUE7Y0FDQSxTQUFBLFVBQUE7Z0JBQ0EsR0FBQSxVQUFBLFNBQUE7Ozs7OztRQU1BLFNBQUEscUJBQUE7VUFDQSxHQUFBLGdCQUFBLENBQUEsR0FBQTtVQUNBLEdBQUEsR0FBQSxjQUFBO1lBQ0EsR0FBQTs7O1FBR0EsU0FBQSxlQUFBO1VBQ0EsR0FBQSxDQUFBLEdBQUEsVUFBQTtZQUNBLFlBQUEsT0FBQSxlQUFBLEtBQUEsU0FBQSxTQUFBO2NBQ0EsR0FBQSxZQUFBO2NBQ0EsR0FBQSxvQkFBQSxJQUFBLEdBQUEsa0JBQUE7Ozs7O1FBS0EsU0FBQSxpQkFBQSxTQUFBO1VBQ0EsT0FBQSxHQUFBLGtCQUFBLFFBQUEsWUFBQSxDQUFBLElBQUEsT0FBQTs7UUFFQSxTQUFBLGdCQUFBLFVBQUEsS0FBQTtVQUNBLFFBQUEsUUFBQSxNQUFBLFNBQUEsTUFBQSxJQUFBOztnQkFFQSxHQUFBLFFBQUEsU0FBQTtrQkFDQSxLQUFBLE9BQUEsS0FBQTtrQkFDQSxHQUFBLGlCQUFBLE9BQUEsR0FBQSxpQkFBQSxRQUFBLE9BQUE7a0JBQ0EsR0FBQSxrQkFBQSxPQUFBLEdBQUEsa0JBQUEsUUFBQSxNQUFBOzs7Y0FHQSxnQkFBQSxVQUFBLEtBQUE7OztRQUdBLFNBQUEsZUFBQSxTQUFBO1VBQ0EsSUFBQSxNQUFBLEdBQUEsa0JBQUEsUUFBQTtVQUNBLElBQUEsTUFBQSxDQUFBLEVBQUE7WUFDQSxHQUFBLGtCQUFBLE9BQUEsS0FBQTtZQUNBLGdCQUFBLFVBQUEsR0FBQTs7Y0FFQTtZQUNBLEdBQUEsa0JBQUEsS0FBQTtZQUNBLEdBQUEsR0FBQSxpQkFBQSxVQUFBLEtBQUEsT0FBQSxHQUFBLGlCQUFBLEdBQUEsV0FBQSxZQUFBO2NBQ0EsR0FBQSxpQkFBQSxHQUFBLE1BQUEsS0FBQTs7Z0JBRUE7Z0JBQ0EsR0FBQSxPQUFBLEtBQUE7Ozs7OztRQU1BLFNBQUEsZUFBQSxNQUFBO1VBQ0EsUUFBQSxRQUFBLE9BQUEsU0FBQSxNQUFBLElBQUE7WUFDQSxNQUFBLEtBQUEsU0FBQSxTQUFBLE1BQUEsTUFBQTtZQUNBLGVBQUEsTUFBQTs7O1FBR0EsU0FBQSxtQkFBQSxLQUFBO1VBQ0EsUUFBQSxJQUFBOztRQUVBLFNBQUEsbUJBQUEsS0FBQTtVQUNBLFFBQUEsSUFBQTs7UUFFQSxTQUFBLHFCQUFBLEtBQUE7VUFDQSxJQUFBLE1BQUEsR0FBQSxpQkFBQSxRQUFBO1VBQ0EsSUFBQSxNQUFBLENBQUEsRUFBQTtZQUNBLEdBQUEsaUJBQUEsT0FBQSxLQUFBOztjQUVBO1lBQ0EsR0FBQSxpQkFBQSxLQUFBOzs7UUFHQSxTQUFBLHVCQUFBLEtBQUE7VUFDQSxPQUFBLEdBQUEsaUJBQUEsUUFBQSxRQUFBLENBQUE7O1FBRUEsU0FBQSxVQUFBO1VBQ0EsSUFBQSxXQUFBO1lBQ0EsTUFBQTtZQUNBLFFBQUE7WUFDQSxNQUFBOzs7VUFHQSxHQUFBLEdBQUEsaUJBQUEsVUFBQSxLQUFBLE9BQUEsR0FBQSxpQkFBQSxHQUFBLFdBQUEsWUFBQTtZQUNBLEdBQUEsaUJBQUEsR0FBQSxNQUFBLEtBQUE7O2VBRUEsR0FBQSxHQUFBLGlCQUFBLFNBQUEsR0FBQTtjQUNBLFFBQUEsUUFBQSxHQUFBLGtCQUFBLFNBQUEsTUFBQSxJQUFBO2tCQUNBLFNBQUEsTUFBQSxLQUFBO2tCQUNBLGdCQUFBLE1BQUEsR0FBQTs7Y0FFQSxHQUFBLE9BQUEsS0FBQTtjQUNBLEdBQUEsbUJBQUE7O2NBRUE7WUFDQSxHQUFBLE9BQUEsS0FBQTs7O1FBR0EsU0FBQSxnQkFBQTtVQUNBLElBQUEsV0FBQTtZQUNBLE1BQUE7WUFDQSxRQUFBO1lBQ0EsTUFBQTs7VUFFQSxRQUFBLFFBQUEsR0FBQSxrQkFBQSxTQUFBLE1BQUEsSUFBQTtZQUNBLFNBQUEsTUFBQSxLQUFBOztVQUVBLEdBQUEsT0FBQSxLQUFBO1VBQ0EsR0FBQSxtQkFBQTs7UUFFQSxTQUFBLFVBQUEsS0FBQTtVQUNBLEdBQUEsV0FBQTs7UUFFQSxTQUFBLFlBQUEsTUFBQSxLQUFBO1lBQ0EsZ0JBQUEsTUFBQTs7UUFFQSxTQUFBLFdBQUE7VUFDQSxHQUFBLEdBQUEsYUFBQTtZQUNBOztVQUVBLEdBQUEsZUFBQTtVQUNBLEdBQUEsT0FBQSxHQUFBLFlBQUEsWUFBQTtZQUNBLE9BQUEsTUFBQSw2QkFBQTtZQUNBLEdBQUEsZUFBQTtZQUNBOztVQUVBLEdBQUEsQ0FBQSxHQUFBLFNBQUEsTUFBQTtZQUNBLE9BQUEsTUFBQSw2QkFBQTtZQUNBLEdBQUEsZUFBQTtZQUNBOztVQUVBLEdBQUEsU0FBQSxPQUFBLEdBQUE7VUFDQSxZQUFBLEtBQUEsU0FBQSxHQUFBLFVBQUEsS0FBQSxTQUFBLFNBQUE7WUFDQSxHQUFBLGVBQUE7WUFDQSxPQUFBLFFBQUEsK0JBQUE7WUFDQSxPQUFBLEdBQUEsa0JBQUEsQ0FBQSxNQUFBLFNBQUE7WUFDQSxTQUFBLFNBQUE7WUFDQSxHQUFBLGVBQUE7WUFDQSxPQUFBLE1BQUEsU0FBQSxRQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3RQQSxDQUFBLFlBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSw4R0FBQSxVQUFBLFFBQUEsU0FBQSxTQUFBLFFBQUEsWUFBQSxZQUFBLGdCQUFBOztFQUVBLElBQUEsS0FBQTs7RUFFQSxHQUFBLGFBQUE7RUFDQSxHQUFBLFlBQUE7RUFDQSxHQUFBLGNBQUE7RUFDQSxHQUFBLFNBQUE7R0FDQSxLQUFBO0dBQ0EsUUFBQTtHQUNBLE1BQUE7R0FDQSxXQUFBO0dBQ0EsT0FBQTtJQUNBLE9BQUE7SUFDQSxPQUFBO0lBQ0EsWUFBQTtJQUNBLGFBQUE7SUFDQSxhQUFBOzs7RUFHQSxHQUFBLFNBQUE7R0FDQSxPQUFBO0dBQ0EsTUFBQTs7RUFFQSxHQUFBLFdBQUE7RUFDQSxHQUFBLFlBQUE7RUFDQSxHQUFBLGlCQUFBO0VBQ0EsR0FBQSxlQUFBO0VBQ0EsR0FBQSxrQkFBQTtFQUNBLEdBQUEsaUJBQUE7OztFQUdBLEdBQUEsYUFBQTs7RUFFQSxHQUFBLGtCQUFBOztFQUVBLFNBQUEsT0FBQTs7RUFFQSxTQUFBLFNBQUEsT0FBQTtHQUNBLEdBQUEsWUFBQTs7R0FFQSxRQUFBLFFBQUEsR0FBQSxZQUFBLFNBQUEsS0FBQTtJQUNBLEdBQUEsS0FBQSxNQUFBLE9BQUEsR0FBQTtLQUNBLEdBQUEsVUFBQSxLQUFBOzs7OztFQUtBLFNBQUEsV0FBQSxJQUFBO0dBQ0EsR0FBQSxHQUFBLGVBQUEsSUFBQTtJQUNBLEdBQUEsY0FBQTs7T0FFQTtJQUNBLEdBQUEsY0FBQTs7O0VBR0EsU0FBQSxhQUFBLE1BQUE7R0FDQSxPQUFBLEdBQUEsVUFBQSxRQUFBLFFBQUEsQ0FBQSxJQUFBLE9BQUE7O0VBRUEsU0FBQSxXQUFBO0dBQ0EsR0FBQSxHQUFBLFVBQUEsT0FBQTtJQUNBLEdBQUEsWUFBQTs7T0FFQTtJQUNBLFFBQUEsUUFBQSxHQUFBLFlBQUEsU0FBQSxLQUFBO0tBQ0EsR0FBQSxHQUFBLFVBQUEsUUFBQSxTQUFBLENBQUEsRUFBQTtNQUNBLEdBQUEsVUFBQSxLQUFBOzs7OztFQUtBLFNBQUEsZUFBQSxNQUFBO0dBQ0EsR0FBQSxZQUFBO0dBQ0EsUUFBQSxRQUFBLE9BQUEsU0FBQSxLQUFBO0lBQ0EsR0FBQSxVQUFBLEtBQUE7Ozs7RUFJQSxTQUFBLGdCQUFBLE1BQUE7R0FDQSxJQUFBLFFBQUEsR0FBQSxVQUFBLFFBQUE7R0FDQSxJQUFBLFFBQUEsQ0FBQSxHQUFBO0lBQ0EsT0FBQSxHQUFBLFVBQUEsT0FBQSxPQUFBO1VBQ0E7SUFDQSxPQUFBLEdBQUEsVUFBQSxLQUFBOzs7RUFHQSxTQUFBLGlCQUFBOzs7RUFHQSxTQUFBLGdCQUFBLE1BQUE7R0FDQSxRQUFBO0lBQ0EsS0FBQTs7S0FFQTtJQUNBLEtBQUE7TUFDQSxHQUFBLGFBQUEsZUFBQSxjQUFBLENBQUEsV0FBQSxNQUFBLEtBQUE7S0FDQTtJQUNBLEtBQUE7TUFDQSxHQUFBLFlBQUEsWUFBQSxPQUFBLGNBQUE7S0FDQTtJQUNBOzs7O0VBSUEsU0FBQSxTQUFBLGFBQUEsSUFBQTtHQUNBLFlBQUE7Ozs7RUFJQSxPQUFBLE9BQUEsbUJBQUEsVUFBQSxPQUFBLFVBQUE7R0FDQSxHQUFBLFVBQUEsVUFBQSxPQUFBO0dBQ0EsR0FBQSxRQUFBLEdBQUEsT0FBQTtHQUNBLEdBQUEsTUFBQSxJQUFBO0dBQ0EsR0FBQSxhQUFBLGVBQUEsZ0JBQUEsR0FBQTs7RUFFQSxPQUFBLElBQUEsdUJBQUEsU0FBQSxZQUFBLFdBQUEsVUFBQSxRQUFBO0dBQ0EsU0FBQTs7Ozs7O0FDdkhBLENBQUEsWUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLGlJQUFBLFVBQUEsUUFBQSxPQUFBLFVBQUEsb0JBQUEsYUFBQSxnQkFBQSxXQUFBOztFQUVBLElBQUEsS0FBQTtJQUNBLEdBQUEsWUFBQTtFQUNBLEdBQUEsUUFBQTtFQUNBLEdBQUEsTUFBQTtFQUNBLEdBQUEsTUFBQTtFQUNBLEdBQUEsV0FBQTtFQUNBOztFQUVBLGVBQUEsaUJBQUEsT0FBQSxPQUFBLElBQUEsS0FBQSxTQUFBLEtBQUE7R0FDQSxJQUFBLGFBQUE7R0FDQSxHQUFBLE9BQUEsR0FBQSxVQUFBLFNBQUEsWUFBQTtJQUNBLFFBQUEsUUFBQSxHQUFBLFVBQUEsWUFBQSxTQUFBLElBQUE7S0FDQSxHQUFBLE9BQUEsSUFBQSxTQUFBLFlBQUE7TUFDQSxhQUFBLElBQUEsTUFBQTs7OztRQUlBLEdBQUEsR0FBQSxVQUFBLE1BQUE7SUFDQSxhQUFBLEdBQUEsVUFBQSxNQUFBOztHQUVBLG1CQUFBLGFBQUE7R0FDQSxHQUFBLE9BQUE7R0FDQTtHQUNBOztFQUVBLFNBQUEsV0FBQTtHQUNBLEdBQUEsT0FBQSxRQUFBLFFBQUEscUNBQUE7SUFDQSxHQUFBLE9BQUEsT0FBQSxTQUFBLGNBQUE7S0FDQSxHQUFBLFdBQUE7O1NBRUEsR0FBQSxPQUFBLE9BQUEsU0FBQSxVQUFBO0tBQ0EsR0FBQSxXQUFBOztTQUVBLEdBQUEsT0FBQSxPQUFBLFNBQUEsUUFBQTtLQUNBLEdBQUEsV0FBQTs7U0FFQSxHQUFBLE9BQUEsT0FBQSxTQUFBLGFBQUE7S0FDQSxHQUFBLFdBQUE7O1FBRUE7S0FDQSxHQUFBLFdBQUE7Ozs7RUFJQSxTQUFBLFFBQUE7R0FDQSxHQUFBLE1BQUE7R0FDQSxHQUFBLE1BQUE7R0FDQSxRQUFBLFFBQUEsR0FBQSxNQUFBLFNBQUEsTUFBQSxJQUFBO0tBQ0EsR0FBQSxNQUFBLEtBQUEsSUFBQSxLQUFBLE9BQUEsR0FBQTtLQUNBLEdBQUEsTUFBQSxLQUFBLElBQUEsS0FBQSxPQUFBLEdBQUE7O0dBRUEsR0FBQSxRQUFBLEdBQUEsTUFBQSxTQUFBLE9BQUEsQ0FBQSxHQUFBLElBQUEsR0FBQSxNQUFBLE1BQUEsQ0FBQSxFQUFBOztFQUVBLFNBQUEsY0FBQSxJQUFBO0dBQ0EsSUFBQSxRQUFBO0dBQ0EsUUFBQSxRQUFBLEdBQUEsTUFBQSxTQUFBLE1BQUEsSUFBQTtLQUNBLEdBQUEsS0FBQSxPQUFBLElBQUE7TUFDQSxRQUFBLEtBQUE7OztHQUdBLE9BQUE7O0VBRUEsU0FBQSxlQUFBLFNBQUE7R0FDQSxJQUFBLFFBQUE7R0FDQSxJQUFBLE1BQUEsUUFBQSxXQUFBO0dBQ0EsSUFBQSxRQUFBLGNBQUEsUUFBQSxHQUFBO0dBQ0EsSUFBQSxPQUFBLFFBQUE7O0dBRUEsUUFBQTtJQUNBLEtBQUE7S0FDQSxJQUFBLFdBQUEsU0FBQSxNQUFBLE1BQUEsU0FBQSxHQUFBLE1BQUEsV0FBQTtLQUNBLElBQUEsUUFBQSxVQUFBLG1CQUFBLFNBQUEsWUFBQSxPQUFBLG1CQUFBLFNBQUEsV0FBQSxLQUFBLE9BQUEsbUJBQUEsU0FBQSxXQUFBLEtBQUEsTUFBQSxtQkFBQSxTQUFBLFdBQUEsS0FBQTtLQUNBLE1BQUEsUUFBQSxVQUFBLG1CQUFBLFNBQUEsYUFBQSxPQUFBLG1CQUFBLFNBQUEsV0FBQSxLQUFBLE9BQUEsbUJBQUEsU0FBQSxXQUFBLEtBQUE7S0FDQSxNQUFBLFVBQUE7TUFDQSxPQUFBO01BQ0EsTUFBQTs7S0FFQSxNQUFBLFdBQUE7TUFDQSxPQUFBLFVBQUEsbUJBQUEsU0FBQSxZQUFBLE9BQUEsbUJBQUEsU0FBQSxXQUFBLEtBQUEsT0FBQSxtQkFBQSxTQUFBLFdBQUEsS0FBQTtNQUNBLFNBQUE7T0FDQSxPQUFBO09BQ0EsTUFBQTs7O0tBR0E7OztHQUdBLE9BQUE7O0VBRUEsU0FBQSxnQkFBQTtHQUNBO0dBQ0EsWUFBQSxPQUFBLE9BQUEsS0FBQSxVQUFBLEtBQUE7SUFDQSxHQUFBLE1BQUE7SUFDQSxHQUFBLFlBQUEsbUJBQUE7SUFDQSxTQUFBLFlBQUE7TUFDQSxHQUFBLFVBQUEsU0FBQTs7Ozs7O0VBTUEsT0FBQSxJQUFBLHVCQUFBLFVBQUE7R0FDQTs7Ozs7OztBQzNHQSxDQUFBLFVBQUE7SUFDQTtJQUNBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLG9DQUFBLFNBQUEsZUFBQTtRQUNBLElBQUEsS0FBQTtRQUNBLEdBQUEsWUFBQSxlQUFBOzs7O0FDSkEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEseURBQUEsU0FBQSxZQUFBLFFBQUEsT0FBQSxPQUFBO1FBQ0EsSUFBQSxLQUFBO1FBQ0EsR0FBQSxZQUFBO1FBQ0EsR0FBQSxVQUFBO1FBQ0EsR0FBQSxnQkFBQTs7UUFFQSxHQUFBLE9BQUE7VUFDQSxNQUFBO1VBQ0EsU0FBQTs7O1FBR0E7O1FBRUEsU0FBQSxVQUFBO1VBQ0EsR0FBQTs7O1FBR0EsU0FBQSxlQUFBOztVQUVBLEdBQUEsTUFBQSxrQkFBQTs7OztRQUlBLFNBQUEsU0FBQTtVQUNBLE1BQUEsTUFBQSxHQUFBLE1BQUEsS0FBQSxTQUFBLFNBQUE7WUFDQSxPQUFBLFFBQUE7WUFDQSxRQUFBLElBQUEsV0FBQTtZQUNBLE9BQUEsR0FBQSxXQUFBLGFBQUEsTUFBQSxRQUFBLFlBQUEsV0FBQSxhQUFBO2FBQ0EsTUFBQSxTQUFBLFNBQUE7WUFDQSxPQUFBLE1BQUEsd0NBQUE7Ozs7Ozs7QUNoQ0EsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsMEVBQUEsU0FBQSxRQUFBLFlBQUEsb0JBQUEsUUFBQTs7UUFFQSxJQUFBLEtBQUE7UUFDQSxHQUFBLFlBQUEsT0FBQSxRQUFBLEdBQUE7UUFDQSxHQUFBLFVBQUEsT0FBQSxRQUFBLEdBQUE7UUFDQSxHQUFBLE9BQUEsT0FBQSxRQUFBLEdBQUE7UUFDQSxHQUFBLFVBQUE7UUFDQSxHQUFBLFlBQUEsbUJBQUE7UUFDQSxHQUFBLFVBQUE7UUFDQSxHQUFBLFlBQUE7UUFDQSxHQUFBLGNBQUE7O1FBRUEsU0FBQSxXQUFBO1VBQ0EsSUFBQSxPQUFBO1VBQ0EsUUFBQSxRQUFBLEdBQUEsTUFBQSxTQUFBLE1BQUE7WUFDQSxLQUFBLEdBQUEsVUFBQSxvQkFBQSxXQUFBLEtBQUEsR0FBQSxVQUFBO1lBQ0EsS0FBQSxXQUFBLFNBQUEsS0FBQTs7VUFFQSxJQUFBLFNBQUEsUUFBQSxXQUFBLEdBQUEsTUFBQSxDQUFBLEdBQUEsVUFBQSxrQkFBQSxVQUFBO1VBQ0EsS0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLE9BQUEsUUFBQSxLQUFBO1lBQ0EsSUFBQSxPQUFBLEdBQUEsT0FBQSxHQUFBLFFBQUEsS0FBQTtjQUNBLE9BQUEsSUFBQTs7O1VBR0EsR0FBQSxRQUFBLEdBQUEsVUFBQSxpQkFBQSxXQUFBO1VBQ0EsR0FBQSxnQkFBQTtjQUNBLE1BQUEsR0FBQSxVQUFBO2NBQ0EsTUFBQSxHQUFBLFVBQUEsaUJBQUE7OztRQUdBLFNBQUEsUUFBQSxRQUFBO1VBQ0EsSUFBQSxTQUFBLFFBQUEsV0FBQSxHQUFBLE1BQUEsQ0FBQSxHQUFBLFVBQUEsa0JBQUEsVUFBQTtVQUNBLElBQUEsT0FBQTtVQUNBLFFBQUEsUUFBQSxRQUFBLFNBQUEsTUFBQSxJQUFBO1lBQ0EsR0FBQSxLQUFBLFdBQUEsUUFBQSxRQUFBO2NBQ0EsT0FBQTs7O1VBR0EsT0FBQSxLQUFBOztRQUVBLFNBQUEsWUFBQTtPQUNBLElBQUEsQ0FBQSxHQUFBLFNBQUE7UUFDQSxPQUFBOztPQUVBLE9BQUEsQ0FBQSxHQUFBLFFBQUEsR0FBQSxXQUFBLEtBQUE7T0FDQTs7TUFFQSxTQUFBLGNBQUE7T0FDQSxJQUFBLENBQUEsR0FBQSxTQUFBO1FBQ0EsT0FBQTs7T0FFQSxPQUFBLEdBQUEsUUFBQSxpQkFBQSxJQUFBLGtCQUFBO09BQ0E7O1FBRUEsT0FBQSxPQUFBLGNBQUEsVUFBQSxHQUFBLEdBQUE7VUFDQSxJQUFBLE1BQUEsR0FBQTtZQUNBOzs7WUFHQSxHQUFBLEVBQUEsSUFBQTtjQUNBLEdBQUEsVUFBQSxPQUFBLG1CQUFBLFNBQUEsRUFBQSxLQUFBLFdBQUE7O1lBRUE7WUFDQSxnQkFBQSxFQUFBOzs7Ozs7Ozs7QUNsRUEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsb0NBQUEsU0FBQSxRQUFBLE9BQUE7Ozs7OztBQ0hBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLGNBQUEsVUFBQTs7Ozs7O0FDSEEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEseUNBQUEsU0FBQSxRQUFBLGFBQUE7O0VBRUEsT0FBQSxlQUFBLFVBQUE7R0FDQSxhQUFBLEtBQUE7OztFQUdBLE9BQUEsYUFBQSxVQUFBO0dBQ0EsYUFBQSxNQUFBOzs7Ozs7O0FDVkEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsMEJBQUEsVUFBQTs7Ozs7O0FDSEEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsWUFBQSxVQUFBOzs7Ozs7QUNIQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSw4REFBQSxTQUFBLFFBQUEsZUFBQSxZQUFBO1FBQ0EsSUFBQSxLQUFBO1FBQ0EsR0FBQSxlQUFBO1FBQ0EsR0FBQSxhQUFBLFFBQUEsT0FBQSxRQUFBLEdBQUE7O1FBRUEsR0FBQSxPQUFBLFVBQUE7O1lBRUEsWUFBQSxLQUFBLGtCQUFBLEdBQUEsY0FBQSxLQUFBLFNBQUEsS0FBQTtjQUNBLE9BQUEsUUFBQSxHQUFBLGNBQUEsS0FBQTtjQUNBLE9BQUEsUUFBQSxHQUFBLEtBQUEsZUFBQTtjQUNBLGNBQUE7Ozs7O1FBS0EsR0FBQSxPQUFBLFVBQUE7U0FDQSxjQUFBOzs7Ozs7O0FDbkJBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLDBEQUFBLFNBQUEsUUFBQSxZQUFBLGNBQUE7O01BRUEsSUFBQSxLQUFBO01BQ0EsR0FBQSxPQUFBO01BQ0EsR0FBQSxLQUFBLFFBQUEsT0FBQSxRQUFBLEdBQUE7O01BRUEsR0FBQSxPQUFBLFVBQUE7O1VBRUEsWUFBQSxLQUFBLGtCQUFBLEdBQUEsTUFBQSxLQUFBLFNBQUEsS0FBQTtZQUNBLE9BQUEsUUFBQSxHQUFBLGFBQUEsS0FBQTtZQUNBLE9BQUEsUUFBQSxHQUFBLEtBQUEsT0FBQTtZQUNBLGNBQUE7Ozs7O01BS0EsR0FBQSxPQUFBLFVBQUE7UUFDQSxjQUFBOzs7Ozs7OztBQ3BCQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSw0Q0FBQSxTQUFBLFFBQUEsY0FBQTs7UUFFQSxPQUFBLE9BQUEsVUFBQTs7WUFFQSxjQUFBOzs7UUFHQSxPQUFBLE9BQUEsVUFBQTtTQUNBLGNBQUE7Ozs7Ozs7QUNYQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSxnRUFBQSxTQUFBLFFBQUEsY0FBQSxjQUFBO1FBQ0EsT0FBQSxRQUFBLEdBQUEsbUJBQUE7UUFDQSxPQUFBLFFBQUEsR0FBQSxjQUFBO1FBQ0EsT0FBQSxRQUFBLEdBQUEsVUFBQTtRQUNBLE9BQUEsUUFBQSxHQUFBLGVBQUE7UUFDQSxPQUFBLFFBQUEsR0FBQSxhQUFBO1FBQ0EsT0FBQSxRQUFBLEdBQUEsV0FBQTtRQUNBLE9BQUEsT0FBQSxVQUFBOztVQUVBLFFBQUEsUUFBQSxPQUFBLFFBQUEsR0FBQSxLQUFBLEdBQUEsS0FBQSxJQUFBLFNBQUEsTUFBQSxJQUFBO1lBQ0EsR0FBQSxPQUFBLE9BQUE7OztZQUdBLEdBQUEsT0FBQSxhQUFBLGFBQUEsUUFBQSxZQUFBO2NBQ0EsYUFBQSxhQUFBLElBQUE7Z0JBQ0EsWUFBQTtnQkFDQSxNQUFBOzs7WUFHQSxJQUFBLE9BQUEsYUFBQSxhQUFBO1lBQ0EsR0FBQSxPQUFBLFFBQUEsR0FBQSxZQUFBO2NBQ0EsS0FBQSxnQkFBQSxPQUFBLFFBQUEsR0FBQTs7WUFFQSxHQUFBLE9BQUEsUUFBQSxHQUFBLFdBQUE7Z0JBQ0EsS0FBQSxPQUFBLE9BQUEsUUFBQSxHQUFBOztZQUVBLEdBQUEsT0FBQSxRQUFBLEdBQUEsYUFBQTtnQkFDQSxLQUFBLGFBQUEsT0FBQSxRQUFBLEdBQUE7O1lBRUEsR0FBQSxPQUFBLFFBQUEsR0FBQSxTQUFBO2NBQ0EsS0FBQSxhQUFBLE9BQUEsUUFBQSxHQUFBOztZQUVBLEdBQUEsT0FBQSxRQUFBLEdBQUEsUUFBQTs7Y0FFQSxHQUFBLE9BQUEsS0FBQSxTQUFBLFlBQUE7Z0JBQ0EsS0FBQSxRQUFBLE9BQUEsUUFBQSxHQUFBO2dCQUNBLEtBQUEsV0FBQSxPQUFBLFFBQUEsR0FBQSxTQUFBOzs7Ozs7VUFNQSxhQUFBO1VBQ0EsY0FBQTs7O1FBR0EsT0FBQSxPQUFBLFVBQUE7VUFDQSxPQUFBLFFBQUEsR0FBQSxjQUFBO1VBQ0EsT0FBQSxRQUFBLEdBQUEsZUFBQTtVQUNBLE9BQUEsUUFBQSxHQUFBLGFBQUE7U0FDQSxjQUFBOzs7Ozs7O0FDckRBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLDhDQUFBLFNBQUEsUUFBQSxjQUFBO1FBQ0EsT0FBQSxPQUFBLE9BQUEsUUFBQSxHQUFBO1FBQ0EsR0FBQSxPQUFBLE9BQUEsUUFBQSxHQUFBLEtBQUEsTUFBQSxPQUFBLFNBQUEsWUFBQTtVQUNBLE9BQUEsUUFBQSxHQUFBLEtBQUEsTUFBQSxPQUFBLFFBQUE7O1lBRUE7VUFDQSxHQUFBLE9BQUEsUUFBQSxHQUFBLEtBQUEsTUFBQSxPQUFBLE1BQUEsTUFBQTtZQUNBLE9BQUEsUUFBQSxPQUFBLFFBQUEsR0FBQSxLQUFBLE1BQUEsT0FBQSxNQUFBOztVQUVBLEdBQUEsT0FBQSxRQUFBLEdBQUEsS0FBQSxNQUFBLE9BQUEsTUFBQSxZQUFBO1lBQ0EsT0FBQSxjQUFBLE9BQUEsUUFBQSxHQUFBLEtBQUEsTUFBQSxPQUFBLE1BQUE7Ozs7UUFJQSxPQUFBLE9BQUEsVUFBQTtVQUNBLE9BQUEsUUFBQSxHQUFBLEtBQUEsTUFBQSxPQUFBLE1BQUEsUUFBQSxPQUFBO1VBQ0EsT0FBQSxRQUFBLEdBQUEsS0FBQSxNQUFBLE9BQUEsTUFBQSxjQUFBLE9BQUE7VUFDQSxjQUFBOzs7UUFHQSxPQUFBLE9BQUEsVUFBQTtTQUNBLGNBQUE7Ozs7Ozs7QUN4QkEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsMkNBQUEsU0FBQSxRQUFBLGNBQUE7UUFDQSxPQUFBLE9BQUEsT0FBQSxRQUFBLEdBQUEsU0FBQTtRQUNBLE9BQUEsT0FBQSxVQUFBOztZQUVBLGNBQUE7OztRQUdBLE9BQUEsT0FBQSxVQUFBO1NBQ0EsY0FBQTs7Ozs7OztBQ1hBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLHdEQUFBLFNBQUEsT0FBQSxRQUFBLGNBQUE7O1FBRUEsT0FBQSxPQUFBLFVBQUE7WUFDQSxPQUFBLEdBQUEsV0FBQTtZQUNBLE9BQUEsR0FBQSxLQUFBLFlBQUEsT0FBQSxHQUFBLFVBQUE7WUFDQSxPQUFBLEdBQUEsS0FBQSxnQkFBQSxPQUFBLEdBQUEsVUFBQTtZQUNBLE9BQUEsR0FBQTtXQUNBLGNBQUE7OztRQUdBLE9BQUEsT0FBQSxVQUFBO1VBQ0EsT0FBQSxHQUFBO1NBQ0EsY0FBQTs7Ozs7OztBQ2ZBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLHVEQUFBLFNBQUEsUUFBQSxRQUFBLGNBQUE7O1FBRUEsT0FBQSxPQUFBLFVBQUE7O1lBRUEsT0FBQSxHQUFBO1lBQ0EsT0FBQSxHQUFBLE9BQUEsUUFBQTtZQUNBLGNBQUE7OztRQUdBLE9BQUEsT0FBQSxVQUFBO1NBQ0EsY0FBQTs7Ozs7OztBQ2JBLENBQUEsWUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLHFFQUFBLFVBQUEsUUFBQSxjQUFBLGVBQUE7RUFDQSxJQUFBLEtBQUE7RUFDQSxJQUFBLE9BQUEsYUFBQTtFQUNBLEdBQUEsTUFBQSxLQUFBO0VBQ0EsR0FBQSxPQUFBLGFBQUE7RUFDQSxHQUFBLE9BQUEsWUFBQTtHQUNBLGNBQUE7OztFQUdBLEdBQUEsT0FBQSxZQUFBO0dBQ0EsY0FBQTs7RUFFQSxPQUFBLE9BQUEsV0FBQSxVQUFBLEdBQUEsR0FBQTtHQUNBLElBQUEsTUFBQSxHQUFBO0lBQ0E7O0dBRUEsUUFBQSxRQUFBLEdBQUEsVUFBQSxNQUFBLEtBQUE7SUFDQSxJQUFBLEtBQUEsTUFBQSxLQUFBLEdBQUEsR0FBQSxNQUFBO0tBQ0EsUUFBQSxRQUFBLEtBQUEsTUFBQSxRQUFBLFVBQUEsT0FBQSxHQUFBO01BQ0EsSUFBQSxNQUFBLFFBQUEsS0FBQSxNQUFBLFFBQUEsR0FBQTtPQUNBLGFBQUE7T0FDQSxLQUFBLE1BQUEsT0FBQSxPQUFBLEdBQUE7YUFDQSxJQUFBLE1BQUEsUUFBQSxHQUFBO09BQ0EsSUFBQSxNQUFBLFVBQUEsR0FBQSxLQUFBO1FBQ0EsYUFBQTtRQUNBLEtBQUEsTUFBQSxPQUFBLE9BQUEsR0FBQTs7OztLQUlBLEdBQUEsS0FBQSxPQUFBLEtBQUE7OztHQUdBLElBQUEsR0FBQSxLQUFBLFVBQUEsR0FBQTtJQUNBLGNBQUE7O0tBRUE7Ozs7O0FDdENBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxrQkFBQSxXQUFBLDBCQUFBLFNBQUEsVUFBQTtFQUNBLE9BQUE7UUFDQSxVQUFBO1FBQ0EsTUFBQSxTQUFBLFFBQUEsVUFBQTtZQUNBLFNBQUEsVUFBQTtnQkFDQSxTQUFBLEdBQUE7ZUFDQTs7Ozs7Ozs7QUNUQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLFFBQUEsb0JBQUEsWUFBQSxlQUFBLFVBQUE7Ozs7Ozs7QUNIQSxDQUFBLFlBQUE7Q0FDQTs7Q0FFQSxTQUFBLGNBQUEsV0FBQSxPQUFBO0VBQ0EsSUFBQSxZQUFBO0VBQ0EsSUFBQSxPQUFBLFNBQUEsZUFBQTtFQUNBLEdBQUEsUUFBQSxLQUFBO0dBQ0EsUUFBQSxRQUFBLFVBQUEsS0FBQSxRQUFBLE9BQUEsK0NBQUEsWUFBQTs7RUFFQTtFQUNBLFNBQUEsWUFBQSxTQUFBLE1BQUEsT0FBQSxTQUFBO0dBQ0EsUUFBQSxRQUFBLFNBQUEsY0FBQSxNQUFBLFlBQUEsS0FBQTtHQUNBLFFBQUEsUUFBQSxTQUFBLGNBQUEsTUFBQSxZQUFBLElBQUEsV0FBQTs7R0FFQSxPQUFBLGVBQUEsT0FBQSxNQUFBOztFQUVBLFNBQUEsY0FBQTtHQUNBLFFBQUEsUUFBQSxTQUFBLGNBQUEsTUFBQSxZQUFBLElBQUEsV0FBQTs7RUFFQSxTQUFBLGVBQUEsT0FBQSxHQUFBLFNBQUE7R0FDQSxJQUFBLE9BQUEsTUFBQTtHQUNBLElBQUEsVUFBQTtHQUNBLElBQUEsVUFBQTtHQUNBLElBQUEsTUFBQSxRQUFBLEtBQUEsT0FBQTtHQUNBLElBQUEsUUFBQSxPQUFBO0dBQ0EsSUFBQSxNQUFBLFFBQUEsUUFBQSxTQUFBLGNBQUEsT0FBQTtHQUNBLElBQUEsTUFBQSxTQUFBLGNBQUEsTUFBQTtHQUNBLElBQUEsUUFBQSxJQUFBLHdCQUFBLE1BQUEsRUFBQSxJQUFBLE1BQUE7R0FDQSxJQUFBLFNBQUEsSUFBQSx3QkFBQSxPQUFBLEVBQUEsSUFBQSxFQUFBLFNBQUE7R0FDQSxPQUFBLFFBQUEsUUFBQSxTQUFBLGNBQUEsT0FBQSxJQUFBLE9BQUEsUUFBQSxNQUFBLElBQUEsUUFBQSxTQUFBOztFQUVBLE9BQUE7R0FDQSxhQUFBO0dBQ0EsYUFBQTtHQUNBLGdCQUFBOzs7Q0FHQSxRQUFBLE9BQUEsa0JBQUEsVUFBQSx3Q0FBQSxVQUFBLFVBQUEsY0FBQTtFQUNBLElBQUE7RUFDQSxXQUFBLFlBQUE7R0FDQSxPQUFBO0lBQ0EsT0FBQTtJQUNBLFFBQUE7SUFDQSxnQkFBQTtJQUNBLFdBQUE7SUFDQSxLQUFBO0lBQ0EsT0FBQTtJQUNBLFFBQUE7SUFDQSxTQUFBO0lBQ0EsU0FBQTtJQUNBLFFBQUE7SUFDQSxZQUFBLEdBQUEsTUFBQSxVQUFBLE9BQUEsQ0FBQSxNQUFBLE9BQUEsTUFBQSxDQUFBLFdBQUE7SUFDQSxZQUFBO0lBQ0EsY0FBQTtJQUNBLFVBQUE7SUFDQSxTQUFBLGNBQUEsbUJBQUE7OztFQUdBLE9BQUE7R0FDQSxVQUFBO0dBQ0EsT0FBQTtJQUNBLFdBQUE7SUFDQSxXQUFBO0lBQ0EsU0FBQTtJQUNBLFlBQUE7SUFDQSxTQUFBO0lBQ0EsU0FBQTs7R0FFQSxTQUFBO0dBQ0EsTUFBQSxVQUFBLE9BQUEsTUFBQSxPQUFBLFNBQUE7SUFDQSxJQUFBLFVBQUEsUUFBQSxPQUFBLFlBQUE7SUFDQSxJQUFBLFFBQUE7S0FDQSxRQUFBO0tBQ0EsU0FBQTtLQUNBLFNBQUE7O0lBRUEsSUFBQSxhQUFBLEdBQUEsSUFBQSxNQUFBLFdBQUEsVUFBQSxHQUFBO0tBQ0EsT0FBQSxXQUFBLEVBQUE7OztJQUdBLFFBQUEsZUFBQSxHQUFBLE1BQUEsTUFBQSxTQUFBLEtBQUEsT0FBQSxDQUFBLEdBQUEsYUFBQSxNQUFBLENBQUEsR0FBQTtJQUNBLFFBQUEsU0FBQTtLQUNBLEdBQUEsUUFBQSxRQUFBO0tBQ0EsR0FBQSxRQUFBLFNBQUE7O0lBRUEsUUFBQSxjQUFBOztJQUVBLElBQUEsZUFBQSxZQUFBO0tBQ0EsR0FBQSxNQUFBLFFBQUEsU0FBQSxVQUFBLEtBQUEsTUFBQSxRQUFBLFNBQUEsR0FBQSxTQUFBLFNBQUEsRUFBQTtNQUNBLFFBQUEsUUFBQSxNQUFBLFFBQUEsVUFBQSxVQUFBLE9BQUEsT0FBQTtPQUNBLElBQUEsSUFBQTtRQUNBLE1BQUEsTUFBQTtRQUNBLE1BQUEsTUFBQTtRQUNBLE9BQUEsTUFBQTtRQUNBLE9BQUEsTUFBQTtRQUNBLE1BQUEsTUFBQTtRQUNBLFNBQUEsYUFBQSxXQUFBLE1BQUE7UUFDQSxNQUFBO1FBQ0EsU0FBQSxNQUFBOztPQUVBLE9BQUEsS0FBQTtPQUNBLFFBQUEsUUFBQSxNQUFBLFVBQUEsVUFBQSxNQUFBO1FBQ0EsSUFBQSxNQUFBLFVBQUEsS0FBQSxPQUFBO1NBQ0EsSUFBQSxPQUFBO1VBQ0EsTUFBQSxLQUFBO1VBQ0EsUUFBQSxNQUFBLFVBQUEsS0FBQSxRQUFBLE1BQUE7VUFDQSxPQUFBLE1BQUEsVUFBQSxLQUFBO1VBQ0EsTUFBQSxLQUFBO1VBQ0EsT0FBQSxNQUFBO1VBQ0EsR0FBQSxRQUFBLE9BQUE7VUFDQSxHQUFBLFFBQUEsT0FBQTtVQUNBLE9BQUEsS0FBQTtVQUNBLE1BQUEsS0FBQTtVQUNBLFNBQUEsYUFBQSxXQUFBLEtBQUE7VUFDQSxNQUFBO1VBQ0EsU0FBQTs7U0FFQSxNQUFBLEtBQUE7Ozs7TUFJQTs7O1NBR0E7TUFDQSxJQUFBLElBQUE7T0FDQSxNQUFBLE1BQUEsUUFBQTtPQUNBLE1BQUEsTUFBQSxRQUFBO09BQ0EsT0FBQSxNQUFBLFFBQUE7T0FDQSxPQUFBLE1BQUEsUUFBQTtPQUNBLE1BQUEsTUFBQSxRQUFBO09BQ0EsU0FBQSxNQUFBLFFBQUE7T0FDQSxNQUFBLE1BQUEsUUFBQTtPQUNBLFVBQUEsTUFBQSxRQUFBOztNQUVBLE9BQUEsS0FBQTtNQUNBLFFBQUEsUUFBQSxNQUFBLFFBQUEsVUFBQSxVQUFBLE1BQUE7T0FDQSxJQUFBLE1BQUEsVUFBQSxLQUFBLE9BQUE7UUFDQSxJQUFBLE9BQUE7U0FDQSxNQUFBLEtBQUE7U0FDQSxRQUFBLE1BQUEsVUFBQSxLQUFBLFFBQUEsTUFBQTtTQUNBLE9BQUEsTUFBQSxVQUFBLEtBQUEsUUFBQSxNQUFBO1NBQ0EsTUFBQSxLQUFBO1NBQ0EsT0FBQSxNQUFBLFFBQUE7U0FDQSxHQUFBLFFBQUEsT0FBQTtTQUNBLEdBQUEsUUFBQSxPQUFBO1NBQ0EsT0FBQSxLQUFBO1NBQ0EsTUFBQSxLQUFBO1NBQ0EsU0FBQSxhQUFBLFdBQUEsS0FBQTtTQUNBLE1BQUE7U0FDQSxTQUFBOztRQUVBLE1BQUEsS0FBQTs7Ozs7SUFLQSxJQUFBLGNBQUEsVUFBQTtLQUNBLFFBQUE7S0FDQSxTQUFBOztJQUVBLElBQUEsZ0JBQUEsVUFBQTtLQUNBLFFBQUEsUUFBQSxPQUFBLFNBQUEsTUFBQSxJQUFBO09BQ0EsUUFBQSxZQUFBLEtBQUEsU0FBQTtRQUNBLEdBQUEsUUFBQSxRQUFBO1FBQ0EsR0FBQSxRQUFBLFNBQUEsS0FBQSxJQUFBO1FBQ0EsUUFBQTs7OztJQUlBLElBQUEsYUFBQSxZQUFBO0tBQ0EsUUFBQSxRQUFBLE1BQUEsS0FBQTtLQUNBLFFBQUEsTUFBQSxHQUFBLE9BQUEsS0FBQSxJQUFBLE9BQUEsT0FBQSxLQUFBLFNBQUEsUUFBQSxPQUFBLEtBQUEsVUFBQSxRQUFBLFFBQUEsS0FBQSxNQUFBOztLQUVBLElBQUEsQ0FBQSxRQUFBLFNBQUE7TUFDQSxJQUFBLEtBQUEsS0FBQTtNQUNBLEdBQUEsT0FBQSxVQUFBLEVBQUE7T0FDQSxJQUFBLFNBQUEsR0FBQSxJQUFBO1NBQ0EsWUFBQTtTQUNBLFlBQUE7U0FDQSxXQUFBLENBQUEsTUFBQSxLQUFBO1NBQ0EsU0FBQSxNQUFBLEtBQUE7T0FDQSxJQUFBLFlBQUEsR0FBQSxJQUFBO1NBQ0EsWUFBQTtTQUNBLFlBQUE7U0FDQSxXQUFBLE1BQUEsS0FBQTtTQUNBLFNBQUEsT0FBQSxLQUFBOztPQUVBLFFBQUEsU0FBQSxRQUFBLElBQUEsT0FBQTtTQUNBLEtBQUEsS0FBQTtTQUNBLEtBQUEsUUFBQSxTQUFBLEVBQUE7U0FDQSxPQUFBLE9BQUEsR0FBQSxTQUFBOztTQUVBLEtBQUEsTUFBQTtTQUNBLEtBQUEsYUFBQSxjQUFBLFFBQUEsTUFBQSxHQUFBLEtBQUEsUUFBQSxPQUFBLElBQUEsUUFBQSxPQUFBLElBQUE7T0FDQSxRQUFBLFlBQUEsUUFBQSxJQUFBLE9BQUE7U0FDQSxLQUFBLEtBQUE7U0FDQSxLQUFBLE1BQUE7U0FDQSxLQUFBLFFBQUEsU0FBQSxFQUFBO1NBQ0EsT0FBQSxPQUFBLEdBQUEsU0FBQTs7U0FFQSxLQUFBLGFBQUEsY0FBQSxRQUFBLE1BQUEsR0FBQSxLQUFBLFFBQUEsT0FBQSxHQUFBOztVQUVBO09BQ0EsSUFBQSxNQUFBLEdBQUEsSUFBQTtTQUNBLFlBQUEsUUFBQSxNQUFBLElBQUE7U0FDQSxZQUFBLFFBQUEsTUFBQTtTQUNBLFdBQUEsS0FBQSxLQUFBO1NBQ0EsU0FBQSxPQUFBLEtBQUE7OztPQUdBLFFBQUEsTUFBQSxRQUFBLElBQUEsT0FBQTtTQUNBLEtBQUEsS0FBQTtTQUNBLEtBQUEsUUFBQSxPQUFBLEdBQUE7U0FDQSxLQUFBLE1BQUE7U0FDQSxLQUFBLGFBQUEsY0FBQSxRQUFBLE1BQUEsR0FBQSxLQUFBLFFBQUEsT0FBQSxHQUFBOzs7O0lBSUEsR0FBQSxRQUFBLFVBQUEsUUFBQSxPQUFBLFVBQUEsRUFBQTtNQUNBLElBQUEsYUFBQSxRQUFBLElBQUEsVUFBQSxlQUFBLEtBQUEsUUFBQSxRQUFBLE9BQUE7UUFDQSxLQUFBLFNBQUE7UUFDQSxLQUFBLFFBQUEsU0FBQSxFQUFBO1FBQ0EsT0FBQSxFQUFBOzs7Ozs7OztRQVFBLEtBQUEsS0FBQTtRQUNBLE1BQUEsYUFBQTtRQUNBLE1BQUEsVUFBQTs7UUFFQSxLQUFBLFNBQUEsUUFBQTtRQUNBLEtBQUEsZUFBQTtRQUNBLEdBQUEsU0FBQSxTQUFBLEVBQUE7UUFDQSxRQUFBLGNBQUEsRUFBQTtRQUNBLFFBQUE7O1FBRUEsS0FBQSxLQUFBLFNBQUEsRUFBQTtRQUNBLElBQUEsUUFBQSxPQUFBLFFBQUE7UUFDQSxHQUFBLFNBQUEsRUFBQTtTQUNBLE9BQUE7O1lBRUE7U0FDQSxPQUFBLFFBQUEsU0FBQTs7O1FBR0EsS0FBQSxTQUFBLEVBQUE7UUFDQSxPQUFBLEVBQUE7Ozs7S0FJQSxRQUFBLGFBQUEsUUFBQSxJQUFBLFVBQUEsVUFBQSxLQUFBLE9BQUEsUUFBQSxPQUFBLEtBQUEsS0FBQSxhQUFBLGdCQUFBLFFBQUEsUUFBQSxLQUFBLE9BQUEsUUFBQSxTQUFBLEtBQUEsS0FBQSxLQUFBLFNBQUE7Ozs7OztLQU1BLFFBQUEsVUFBQSxRQUFBLFdBQUEsT0FBQSxVQUFBLEtBQUEsS0FBQSxHQUFBLEtBQUEsU0FBQSxVQUFBLEdBQUE7TUFDQSxPQUFBLEVBQUEsU0FBQSxRQUFBLFdBQUEsRUFBQTtTQUNBLEtBQUEsZ0JBQUEsR0FBQSxLQUFBLFVBQUEsVUFBQSxHQUFBO01BQ0EsT0FBQSxHQUFBLElBQUEsUUFBQSxXQUFBLEVBQUEsUUFBQTtRQUNBLEtBQUEsTUFBQSxVQUFBLEdBQUE7O01BRUEsT0FBQSxZQUFBLEVBQUE7O0tBRUEsUUFBQSxRQUFBLFFBQUEsV0FBQSxPQUFBO09BQ0EsS0FBQSxlQUFBO09BQ0EsS0FBQSxhQUFBLFVBQUEsR0FBQTs7O09BR0EsS0FBQSxlQUFBO09BQ0EsS0FBQSxRQUFBLFNBQUEsRUFBQTtPQUNBLE9BQUEsRUFBQSxVQUFBLFNBQUEsRUFBQTs7T0FFQSxNQUFBLFdBQUEsU0FBQSxFQUFBO09BQ0EsR0FBQSxFQUFBLFFBQUE7UUFDQSxPQUFBOztXQUVBO1FBQ0EsT0FBQTs7O09BR0EsS0FBQSxVQUFBLEdBQUE7T0FDQSxPQUFBLEVBQUEsV0FBQTs7S0FFQSxRQUFBLE1BQUEsR0FBQSxhQUFBLFVBQUEsR0FBQSxHQUFBO01BQ0EsT0FBQSxhQUFBLEdBQUEsR0FBQTtRQUNBLEdBQUEsWUFBQSxVQUFBLEdBQUEsR0FBQTtNQUNBLE9BQUEsYUFBQSxHQUFBLEdBQUE7UUFDQSxHQUFBLFNBQUEsVUFBQSxHQUFBLEdBQUE7O01BRUEsUUFBQSxjQUFBLEVBQUE7TUFDQSxRQUFBOztLQUVBLFFBQUEsUUFBQSxhQUFBLFNBQUEsUUFBQSxVQUFBLEtBQUEsS0FBQSxVQUFBLEdBQUE7TUFDQSxPQUFBLEVBQUE7O0tBRUEsUUFBQSxNQUFBLGFBQUEsU0FBQSxRQUFBLFVBQUEsS0FBQSxhQUFBLFVBQUEsR0FBQTtNQUNBLE9BQUEsRUFBQSxTQUFBLE9BQUE7UUFDQSxLQUFBLEtBQUEsVUFBQSxHQUFBO01BQ0EsT0FBQSxFQUFBLFNBQUEsTUFBQTs7O0lBR0EsSUFBQSxhQUFBLFlBQUE7O0tBRUEsTUFBQSxRQUFBLFVBQUEsR0FBQSxHQUFBO01BQ0EsUUFBQSxRQUFBLGFBQUEsU0FBQSxRQUFBLFVBQUEsTUFBQSxJQUFBLFFBQUE7UUFDQSxLQUFBLEtBQUEsVUFBQSxHQUFBO1FBQ0EsRUFBQSxTQUFBLEVBQUEsUUFBQSxNQUFBLFVBQUEsRUFBQSxRQUFBLE1BQUE7UUFDQSxPQUFBLE1BQUEsVUFBQSxFQUFBLFFBQUEsTUFBQTs7TUFFQSxRQUFBLE1BQUEsYUFBQSxTQUFBLFFBQUEsVUFBQSxNQUFBLElBQUEsUUFBQTtRQUNBLEtBQUEsYUFBQSxVQUFBLEdBQUE7UUFDQSxPQUFBLENBQUEsTUFBQSxVQUFBLEVBQUEsUUFBQSxNQUFBLGNBQUEsT0FBQTs7UUFFQSxLQUFBLEtBQUEsVUFBQSxHQUFBO1FBQ0EsT0FBQSxDQUFBLE1BQUEsVUFBQSxFQUFBLFFBQUEsTUFBQSxjQUFBLE1BQUE7Ozs7SUFJQSxJQUFBLFNBQUEsVUFBQSxHQUFBO0tBQ0EsT0FBQSxDQUFBLEtBQUEsSUFBQSxFQUFBLFFBQUEsT0FBQTs7SUFFQSxJQUFBLFFBQUEsWUFBQTtLQUNBLE9BQUEsUUFBQSxRQUFBLEdBQUEsT0FBQSxRQUFBLE1BQUEsT0FBQSxLQUFBLENBQUEsUUFBQSxPQUFBLFFBQUEsU0FBQSxNQUFBOztJQUVBLElBQUEsb0JBQUEsWUFBQTtLQUNBLFFBQUEsTUFBQSxRQUFBLFFBQUEsZ0JBQUEsT0FBQSxRQUFBLFNBQUEsTUFBQSxHQUFBLFFBQUEsVUFBQSxHQUFBO01BQ0EsUUFBQSxXQUFBLEtBQUEsb0JBQUEsRUFBQSxRQUFBLEtBQUEsYUFBQSxVQUFBLEdBQUE7T0FDQSxPQUFBLGVBQUEsRUFBQSxJQUFBLE1BQUEsRUFBQSxJQUFBOzs7S0FHQSxRQUFBLE1BQUE7O0lBRUEsSUFBQSxpQkFBQSxZQUFBO0tBQ0EsUUFBQSxNQUFBLFFBQUEsUUFBQSxnQkFBQSxPQUFBLFFBQUEsU0FBQSxLQUFBLEdBQUEsUUFBQSxVQUFBLEdBQUE7TUFDQSxRQUFBLFdBQUEsS0FBQSxpQkFBQSxFQUFBLFFBQUEsS0FBQSxhQUFBLFVBQUEsR0FBQTtPQUNBLE9BQUEsZUFBQSxFQUFBLElBQUEsTUFBQSxFQUFBLElBQUE7OztLQUdBLFFBQUEsTUFBQTs7SUFFQSxJQUFBLHNCQUFBLFVBQUEsT0FBQTtLQUNBLE9BQUEsQ0FBQSxVQUFBLE9BQUE7TUFDQSxPQUFBLFVBQUEsR0FBQTtPQUNBLEVBQUEsSUFBQSxFQUFBLElBQUEsQ0FBQSxRQUFBLE1BQUEsSUFBQSxFQUFBLE1BQUEsUUFBQSxTQUFBLFFBQUEsT0FBQTtPQUNBLEVBQUEsSUFBQSxFQUFBLElBQUEsQ0FBQSxRQUFBLE9BQUEsSUFBQSxFQUFBLE1BQUEsUUFBQSxTQUFBLFFBQUEsUUFBQTs7UUFFQTs7SUFFQSxJQUFBLG1CQUFBLFVBQUEsT0FBQTtLQUNBLE9BQUEsQ0FBQSxVQUFBLE9BQUE7TUFDQSxPQUFBLFVBQUEsR0FBQTtPQUNBLEVBQUEsSUFBQSxFQUFBLElBQUEsQ0FBQSxRQUFBLE9BQUEsSUFBQSxFQUFBLE1BQUEsUUFBQSxTQUFBLFFBQUEsUUFBQTtPQUNBLEVBQUEsSUFBQSxFQUFBLElBQUEsQ0FBQSxNQUFBLEVBQUEsTUFBQSxRQUFBLFNBQUEsUUFBQSxRQUFBOztRQUVBOztJQUVBLElBQUEsbUJBQUEsVUFBQSxPQUFBO0tBQ0EsT0FBQSxDQUFBLFVBQUEsT0FBQTtNQUNBLE9BQUEsVUFBQSxHQUFBOztPQUVBLElBQUE7T0FDQSxTQUFBLFFBQUEsWUFBQSxFQUFBO09BQ0EsRUFBQSxJQUFBLEVBQUEsSUFBQSxDQUFBLE9BQUEsSUFBQSxFQUFBLE1BQUEsT0FBQSxTQUFBLFFBQUEsUUFBQTtPQUNBLE9BQUEsRUFBQSxJQUFBLEVBQUEsSUFBQSxDQUFBLE9BQUEsSUFBQSxFQUFBLE1BQUEsT0FBQSxTQUFBLFFBQUEsUUFBQTs7UUFFQTs7SUFFQSxJQUFBLGVBQUEsVUFBQSxNQUFBLEdBQUEsU0FBQTtLQUNBLElBQUE7S0FDQSxVQUFBLDJCQUFBLEtBQUEsT0FBQTtLQUNBLFFBQUEsUUFBQSxLQUFBLEtBQUEsVUFBQSxVQUFBLE1BQUE7TUFDQSxXQUFBLHlDQUFBLEtBQUEsU0FBQSxLQUFBLFNBQUEsVUFBQSxLQUFBLFNBQUE7O0tBRUEsU0FBQSxRQUFBLFFBQUEsWUFBQSxTQUFBLE1BQUEsR0FBQSxPQUFBLE1BQUEsWUFBQTs7O0lBR0EsSUFBQSxlQUFBLFVBQUEsTUFBQSxHQUFBLFNBQUE7S0FDQSxPQUFBLFFBQUEsUUFBQTs7O0lBR0EsTUFBQSxPQUFBLGFBQUEsVUFBQSxNQUFBLFNBQUE7S0FDQSxRQUFBLFFBQUE7O0tBRUEsSUFBQSxRQUFBLFdBQUEsTUFBQTtNQUNBO01BQ0E7TUFDQTtZQUNBO01BQ0E7O0tBRUEsR0FBQSxPQUFBLFVBQUEsS0FBQSxRQUFBLFVBQUEsS0FBQTtPQUNBOztTQUVBO09BQ0E7Ozs7SUFJQSxNQUFBLE9BQUEsV0FBQSxVQUFBLEdBQUEsR0FBQTtLQUNBLEdBQUEsTUFBQSxFQUFBO01BQ0E7O0tBRUEsR0FBQSxPQUFBLEVBQUEsR0FBQSxZQUFBLFlBQUE7TUFDQSxRQUFBLFFBQUE7TUFDQTtNQUNBO01BQ0E7TUFDQTs7TUFFQSxHQUFBLE9BQUEsVUFBQSxLQUFBLFFBQUEsVUFBQSxLQUFBO1FBQ0E7OztVQUdBOztRQUVBOzs7OztJQUtBLE1BQUEsT0FBQSxhQUFBLFVBQUEsTUFBQSxNQUFBO0tBQ0EsSUFBQSxTQUFBLE1BQUE7TUFDQTs7S0FFQSxJQUFBLFFBQUEsT0FBQTtNQUNBO1lBQ0E7TUFDQTs7Ozs7Ozs7QUNqYkEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxRQUFBLG9CQUFBLFlBQUEsdURBQUEsU0FBQSxTQUFBLFFBQUEsWUFBQTs7RUFFQSxJQUFBLEtBQUE7RUFDQSxHQUFBLGVBQUE7RUFDQSxHQUFBLHNCQUFBOztFQUVBLFNBQUEsb0JBQUEsT0FBQTtHQUNBLFFBQUEsSUFBQSxRQUFBLFdBQUEsR0FBQTtHQUNBLE9BQUEsUUFBQSxjQUFBLFFBQUEsV0FBQSxHQUFBLGFBQUEsT0FBQTs7O0VBR0EsU0FBQSxhQUFBLE1BQUE7R0FDQSxHQUFBLE1BQUE7SUFDQSxZQUFBLEtBQUEsY0FBQSxHQUFBLFVBQUEsS0FBQSxTQUFBLEtBQUE7S0FDQSxHQUFBLFdBQUEsS0FBQTtLQUNBLEdBQUEsaUJBQUE7S0FDQSxHQUFBLEtBQUEsV0FBQSxLQUFBO0tBQ0EsT0FBQSxRQUFBLDhCQUFBOzs7Ozs7OztBQ3BCQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsa0JBQUEsV0FBQSxjQUFBLFdBQUE7O0VBRUEsT0FBQTtHQUNBLFVBQUE7R0FDQSxhQUFBO0dBQ0EsWUFBQTtHQUNBLGNBQUE7R0FDQSxNQUFBO0dBQ0Esa0JBQUE7SUFDQSxNQUFBO0lBQ0EsWUFBQTtJQUNBLFFBQUE7SUFDQSxNQUFBOztHQUVBLFFBQUE7R0FDQSxNQUFBLFVBQUEsT0FBQSxTQUFBLE9BQUE7Ozs7Ozs7OztBQ2xCQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLFFBQUEsb0JBQUEsWUFBQSxtQkFBQSxVQUFBOzs7Ozs7QUNIQSxDQUFBLFlBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsa0JBQUEsVUFBQSw0QkFBQSxVQUFBLFVBQUE7RUFDQSxJQUFBLFdBQUEsWUFBQTtHQUNBLE9BQUE7SUFDQSxPQUFBO0lBQ0EsUUFBQTtJQUNBLE9BQUE7SUFDQSxNQUFBO0lBQ0EsT0FBQTs7O0VBR0EsT0FBQTtHQUNBLFVBQUE7R0FDQSxZQUFBO0dBQ0EsT0FBQTtJQUNBLFNBQUE7O0dBRUEsU0FBQTtHQUNBLE1BQUEsVUFBQSxRQUFBLFNBQUEsUUFBQSxTQUFBOzs7SUFHQSxPQUFBLFVBQUEsUUFBQSxPQUFBLFlBQUEsT0FBQTs7O0lBR0EsSUFBQSxTQUFBLEdBQUEsTUFBQTtNQUNBLE9BQUEsQ0FBQSxHQUFBLE9BQUEsUUFBQTtNQUNBLE1BQUEsQ0FBQSxHQUFBO01BQ0EsTUFBQTs7O0lBR0EsSUFBQSxNQUFBLEdBQUEsT0FBQSxRQUFBLElBQUEsT0FBQTtNQUNBLEtBQUEsU0FBQSxPQUFBLFFBQUE7TUFDQSxLQUFBLFVBQUEsT0FBQSxRQUFBO01BQ0EsT0FBQTtJQUNBLElBQUEsWUFBQSxJQUFBLE9BQUE7TUFDQSxLQUFBLGFBQUEsZUFBQSxPQUFBLFFBQUEsUUFBQSxJQUFBLE1BQUEsT0FBQSxRQUFBLFNBQUEsSUFBQTtJQUNBLElBQUEsYUFBQSxVQUFBLE9BQUE7TUFDQSxLQUFBLEtBQUEsT0FBQSxRQUFBLFFBQUEsSUFBQTtNQUNBLEtBQUEsZ0JBQUE7TUFDQSxLQUFBLFVBQUEsT0FBQSxRQUFBO01BQ0EsTUFBQSxXQUFBO01BQ0EsS0FBQSxRQUFBO0lBQ0EsSUFBQSxNQUFBLEdBQUEsSUFBQTtNQUNBLFdBQUE7TUFDQSxZQUFBLFVBQUEsR0FBQTtNQUNBLE9BQUEsT0FBQSxRQUFBLFFBQUEsSUFBQTs7TUFFQSxZQUFBLFVBQUEsR0FBQTtNQUNBLE9BQUEsT0FBQSxRQUFBLFFBQUE7O0lBRUEsSUFBQSxjQUFBLFVBQUEsT0FBQTtNQUNBLE1BQUE7TUFDQSxVQUFBLElBQUEsS0FBQSxLQUFBOztNQUVBLE1BQUEsUUFBQSxPQUFBLFFBQUE7TUFDQSxLQUFBLEtBQUE7SUFDQSxJQUFBLE9BQUEsVUFBQSxVQUFBO01BQ0EsS0FBQSxDQUFBO01BQ0E7TUFDQSxPQUFBO01BQ0EsS0FBQSxVQUFBLEdBQUE7TUFDQSxPQUFBLE9BQUE7O01BRUEsTUFBQSxRQUFBLE9BQUEsUUFBQTtNQUNBLE1BQUEsZUFBQTtNQUNBLEtBQUEsZUFBQTtNQUNBLEtBQUEsS0FBQTs7O0lBR0EsU0FBQSxVQUFBLFFBQUE7S0FDQSxZQUFBO09BQ0EsU0FBQTtPQUNBLEtBQUEsVUFBQSxPQUFBLFVBQUEsSUFBQSxLQUFBO0tBQ0EsS0FBQSxhQUFBLFNBQUEsS0FBQSxNQUFBLFFBQUEsVUFBQSxHQUFBO01BQ0EsSUFBQSxPQUFBLEtBQUEsWUFBQSxNQUFBO01BQ0EsSUFBQSxJQUFBLEdBQUEsWUFBQSxTQUFBLEtBQUEsS0FBQTtNQUNBLE9BQUEsVUFBQSxHQUFBO09BQ0EsS0FBQSxjQUFBLFFBQUEsS0FBQSxNQUFBLEVBQUEsS0FBQSxLQUFBOzs7Ozs7SUFNQSxTQUFBLFNBQUEsWUFBQSxVQUFBO0tBQ0EsV0FBQSxVQUFBLEtBQUEsVUFBQSxHQUFBO01BQ0EsSUFBQSxjQUFBLEdBQUEsWUFBQSxFQUFBLFVBQUE7TUFDQSxPQUFBLFVBQUEsR0FBQTtPQUNBLEVBQUEsV0FBQSxZQUFBO09BQ0EsT0FBQSxJQUFBOzs7OztJQUtBLE9BQUEsT0FBQSxXQUFBLFVBQUEsR0FBQSxHQUFBO0tBQ0EsSUFBQSxNQUFBLEdBQUE7TUFDQTs7S0FFQSxXQUFBLE1BQUEsVUFBQSxFQUFBO0tBQ0EsWUFBQSxNQUFBLFFBQUEsRUFBQTtLQUNBLEtBQUEsTUFBQSxRQUFBLEVBQUE7S0FDQSxTQUFBLFlBQUE7TUFDQSxVQUFBLFFBQUEsWUFBQSxFQUFBOzs7OztJQUtBLE9BQUE7S0FDQSxZQUFBO01BQ0EsT0FBQSxRQUFBOztLQUVBLFVBQUEsR0FBQSxHQUFBO01BQ0EsSUFBQSxDQUFBLEdBQUE7T0FDQSxJQUFBO09BQ0EsRUFBQSxPQUFBLFFBQUEsU0FBQSxPQUFBLFFBQUE7O01BRUEsU0FBQSxZQUFBO09BQ0EsVUFBQSxFQUFBLE9BQUEsUUFBQTs7Ozs7Ozs7OztBQ3RIQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLFFBQUEsb0JBQUEsWUFBQSxpQkFBQSxVQUFBOzs7Ozs7QUNIQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsa0JBQUEsV0FBQSxhQUFBLFdBQUE7O0VBRUEsT0FBQTtHQUNBLFVBQUE7R0FDQSxhQUFBO0dBQ0EsWUFBQTtHQUNBLGtCQUFBO0lBQ0EsTUFBQTtJQUNBLFdBQUE7SUFDQSxRQUFBO0lBQ0EsTUFBQTs7R0FFQSxNQUFBLFVBQUEsT0FBQSxTQUFBLE9BQUE7Ozs7Ozs7OztBQ2ZBLENBQUEsWUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxrQkFBQSxVQUFBLDJCQUFBLFVBQUEsUUFBQTs7RUFFQSxPQUFBO0dBQ0EsVUFBQTtHQUNBLE9BQUE7UUFDQSxNQUFBO1FBQ0EsVUFBQTs7R0FFQSxNQUFBLFVBQUEsT0FBQSxTQUFBLE9BQUE7SUFDQSxJQUFBLFdBQUEsYUFBQSx3QkFBQTtJQUNBLHlCQUFBLFVBQUEsT0FBQTtLQUNBLElBQUEsU0FBQSxNQUFBO01BQ0EsTUFBQTs7S0FFQSxNQUFBLGFBQUEsZ0JBQUE7S0FDQSxPQUFBOztJQUVBLGlCQUFBLE1BQUE7SUFDQSxZQUFBLFVBQUEsTUFBQTtLQUNBLElBQUE7S0FDQSxJQUFBLENBQUEsQ0FBQSxPQUFBLE1BQUEsa0JBQUEsS0FBQSxNQUFBLFNBQUEsT0FBQSxDQUFBLE9BQUEsUUFBQSxPQUFBLE1BQUEsYUFBQTtNQUNBLE9BQUE7WUFDQTtNQUNBLE1BQUEsK0JBQUEsTUFBQSxjQUFBO01BQ0EsT0FBQTs7O0lBR0EsY0FBQSxVQUFBLE1BQUE7S0FDQSxJQUFBLENBQUEsb0JBQUEsS0FBQSxNQUFBLG1CQUFBLE9BQUEsZUFBQSxRQUFBLFFBQUEsQ0FBQSxHQUFBO01BQ0EsT0FBQTtZQUNBO01BQ0EsT0FBQSxNQUFBLHlDQUFBLGdCQUFBOztNQUVBLE9BQUE7OztJQUdBLFFBQUEsS0FBQSxZQUFBO0lBQ0EsUUFBQSxLQUFBLGFBQUE7SUFDQSxPQUFBLFFBQUEsS0FBQSxRQUFBLFVBQUEsT0FBQTtLQUNBLElBQUEsTUFBQSxNQUFBLFFBQUEsTUFBQTtLQUNBLElBQUEsU0FBQSxNQUFBO01BQ0EsTUFBQTs7S0FFQSxTQUFBLElBQUE7S0FDQSxPQUFBLFNBQUEsVUFBQSxLQUFBO01BQ0EsSUFBQSxVQUFBLFNBQUEsWUFBQSxPQUFBO09BQ0EsT0FBQSxNQUFBLE9BQUEsWUFBQTtRQUNBLE1BQUEsT0FBQSxJQUFBLE9BQUE7UUFDQSxJQUFBLFFBQUEsU0FBQSxNQUFBLFdBQUE7U0FDQSxPQUFBLE1BQUEsV0FBQTs7Ozs7S0FLQSxPQUFBLE1BQUEsYUFBQSxNQUFBOzs7OztLQUtBLE1BQUEsT0FBQTtLQUNBLE9BQUE7Ozs7Ozs7O0FDL0RBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsUUFBQSxvQkFBQSxZQUFBLG9CQUFBLFVBQUE7Ozs7OztBQ0hBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxrQkFBQSxXQUFBLFdBQUEsV0FBQTtFQUNBLElBQUEsV0FBQSxVQUFBO0dBQ0EsT0FBQTtJQUNBLE9BQUE7SUFDQSxPQUFBOzs7RUFHQSxPQUFBO0dBQ0EsVUFBQTtHQUNBLGFBQUE7R0FDQSxZQUFBO0dBQ0EsTUFBQTtJQUNBLFFBQUE7SUFDQSxXQUFBOztHQUVBLE1BQUEsVUFBQSxRQUFBLFNBQUEsUUFBQSxRQUFBO0tBQ0EsSUFBQSxVQUFBLFFBQUEsT0FBQSxZQUFBLE9BQUE7Ozs7Ozs7O0FDbkJBLENBQUEsWUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLDBCQUFBLFVBQUEsUUFBQTtFQUNBLE9BQUEsVUFBQTtFQUNBOztFQUVBLFNBQUEsVUFBQTtHQUNBLE9BQUE7R0FDQSxPQUFBLE9BQUEsV0FBQSxTQUFBLEVBQUEsRUFBQTtJQUNBLEdBQUEsTUFBQSxFQUFBO0tBQ0E7O0lBRUEsT0FBQTs7O0VBR0EsU0FBQSxTQUFBO0dBQ0EsT0FBQSxVQUFBO0lBQ0EsYUFBQTtJQUNBLE1BQUEsQ0FBQTtLQUNBLFFBQUE7TUFDQSxHQUFBO01BQ0EsR0FBQTs7S0FFQSxPQUFBO0tBQ0EsT0FBQTs7SUFFQSxPQUFBLENBQUE7S0FDQSxRQUFBO01BQ0EsR0FBQTtNQUNBLEdBQUEsT0FBQSxRQUFBOztLQUVBLE9BQUE7S0FDQSxPQUFBLE9BQUEsUUFBQTs7Ozs7Ozs7QUNqQ0EsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGtCQUFBLFdBQUEsYUFBQSxXQUFBOztFQUVBLE9BQUE7R0FDQSxVQUFBO0dBQ0EsYUFBQTtHQUNBLFlBQUE7R0FDQSxjQUFBO0dBQ0EsTUFBQTtJQUNBLE1BQUE7SUFDQSxTQUFBO0lBQ0EsVUFBQTs7R0FFQSxrQkFBQTtHQUNBLFFBQUE7O0dBRUEsTUFBQSxVQUFBLE9BQUEsU0FBQSxPQUFBLFdBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7QUNsQkEsQ0FBQSxZQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEseUhBQUEsVUFBQSxRQUFBLGFBQUEsZ0JBQUEsZUFBQSxTQUFBLFFBQUEsb0JBQUE7O0VBRUEsSUFBQSxLQUFBOztFQUVBLEdBQUEsV0FBQSxRQUFBLEtBQUEsR0FBQTs7RUFFQSxHQUFBLFlBQUE7RUFDQSxHQUFBLFlBQUE7O0VBRUEsR0FBQSxhQUFBO0VBQ0EsR0FBQSxnQkFBQTtFQUNBLEdBQUEsZUFBQTtFQUNBLEdBQUEsYUFBQTtFQUNBLEdBQUEsYUFBQTtFQUNBLEdBQUEsY0FBQTtFQUNBLEdBQUEsWUFBQTs7RUFFQSxHQUFBLE9BQUE7O0VBRUEsR0FBQSxpQkFBQTtFQUNBLEdBQUEsYUFBQTs7RUFFQTs7RUFFQSxTQUFBLFdBQUE7R0FDQTs7O0VBR0EsU0FBQSxZQUFBLE9BQUE7R0FDQSxPQUFBLFFBQUEsY0FBQSxHQUFBLGVBQUEsT0FBQTs7RUFFQSxTQUFBLFVBQUEsT0FBQTtHQUNBLE9BQUEsUUFBQSxjQUFBLEdBQUEsY0FBQSxPQUFBOzs7RUFHQSxTQUFBLFVBQUE7R0FDQSxHQUFBLGdCQUFBLFlBQUEsT0FBQSxpQkFBQTtHQUNBLEdBQUEsYUFBQSxlQUFBLGNBQUEsQ0FBQSxLQUFBO0dBQ0EsR0FBQSxlQUFBLFlBQUEsT0FBQSxpQkFBQTtHQUNBLEdBQUEsU0FBQSxZQUFBLE9BQUEsVUFBQTs7O0VBR0EsU0FBQSxXQUFBO0dBQ0EsSUFBQSxHQUFBLEtBQUEsU0FBQSxHQUFBLEtBQUEsUUFBQSxHQUFBLEtBQUEsZ0JBQUEsR0FBQSxLQUFBLE1BQUEsVUFBQSxHQUFBO0lBQ0EsT0FBQTs7R0FFQSxPQUFBOztFQUVBLFNBQUEsV0FBQTtHQUNBLEdBQUEsT0FBQSxHQUFBLEtBQUEsY0FBQSxhQUFBLE9BQUE7R0FDQSxPQUFBLGVBQUEsR0FBQSxLQUFBLFdBQUEsU0FBQSxPQUFBOztFQUVBLFNBQUEsTUFBQTtHQUNBLEdBQUEsS0FBQSxPQUFBLEtBQUEsU0FBQSxTQUFBO0lBQ0EsR0FBQSxTQUFBO0tBQ0EsT0FBQSxRQUFBLDhCQUFBO01BQ0EsR0FBQSxXQUFBLFFBQUEsS0FBQSxHQUFBOzs7Ozs7RUFNQSxTQUFBLGVBQUEsS0FBQTtHQUNBLGNBQUEsYUFBQSxlQUFBOztFQUVBLFNBQUEsV0FBQSxLQUFBO0dBQ0EsY0FBQSxhQUFBLFdBQUE7OztFQUdBLE9BQUEsT0FBQSxXQUFBLFNBQUEsR0FBQSxFQUFBO0dBQ0EsR0FBQSxLQUFBLEdBQUE7TUFDQSxHQUFBLEtBQUEsVUFBQSxDQUFBLFFBQUEsT0FBQSxHQUFBLE1BQUEsR0FBQTs7SUFFQTs7Ozs7QUM1RUEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGtCQUFBLFdBQUEsaUJBQUEsV0FBQTs7RUFFQSxPQUFBO0dBQ0EsVUFBQTtHQUNBLE9BQUE7SUFDQSxNQUFBOztHQUVBLFFBQUE7R0FDQSxhQUFBO0dBQ0EsWUFBQTtHQUNBLGNBQUE7R0FDQSxrQkFBQTtHQUNBLE1BQUEsVUFBQSxPQUFBLFNBQUEsT0FBQTs7SUFFQSxJQUFBLEtBQUE7SUFDQSxJQUFBLEtBQUEsUUFBQTtJQUNBLElBQUEsU0FBQSxRQUFBO0lBQ0EsT0FBQSxHQUFBLGNBQUEsU0FBQSxFQUFBO0tBQ0EsUUFBQSxTQUFBO09BQ0EsR0FBQSxjQUFBLFNBQUEsRUFBQTtLQUNBLFFBQUEsWUFBQTs7Ozs7Ozs7OztBQ3ZCQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLFFBQUEsb0JBQUEsWUFBQSxxQkFBQSxVQUFBOztFQUVBLElBQUEsS0FBQTtFQUNBLEdBQUEsWUFBQTtFQUNBLEdBQUEsU0FBQTtFQUNBLEdBQUEsaUJBQUE7O0VBRUEsU0FBQSxRQUFBO0dBQ0EsT0FBQSxHQUFBLEtBQUEsY0FBQSxjQUFBOztFQUVBLFNBQUEsZ0JBQUE7R0FDQSxHQUFBLEtBQUEsY0FBQSxDQUFBLEdBQUEsS0FBQTtHQUNBLEdBQUEsS0FBQTs7RUFFQSxTQUFBLFVBQUEsS0FBQTtHQUNBLElBQUEsS0FBQSxTQUFBLEtBQUEsbUJBQUEsS0FBQSxnQkFBQSxLQUFBLE1BQUEsVUFBQSxHQUFBO0lBQ0EsT0FBQTs7R0FFQSxPQUFBOzs7Ozs7QUNyQkEsQ0FBQSxZQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGtCQUFBLFVBQUEsdUJBQUEsVUFBQSxVQUFBO0VBQ0EsSUFBQSxXQUFBLFlBQUE7R0FDQSxPQUFBO0lBQ0EsSUFBQTtJQUNBLE9BQUE7SUFDQSxRQUFBO0lBQ0EsTUFBQTtJQUNBLE9BQUE7SUFDQSxVQUFBO0lBQ0EsUUFBQTtLQUNBLE1BQUE7S0FDQSxPQUFBO0tBQ0EsS0FBQTtLQUNBLFFBQUE7O0lBRUEsUUFBQSxFQUFBO0tBQ0EsVUFBQTtLQUNBLE9BQUE7S0FDQSxTQUFBO09BQ0E7S0FDQSxVQUFBO0tBQ0EsT0FBQTtLQUNBLFNBQUE7TUFDQTtLQUNBLFVBQUE7S0FDQSxPQUFBO0tBQ0EsU0FBQTs7OztFQUlBLE9BQUE7R0FDQSxVQUFBO0dBQ0EsT0FBQTtJQUNBLE1BQUE7SUFDQSxTQUFBOztHQUVBLFNBQUE7R0FDQSxNQUFBLFVBQUEsUUFBQSxTQUFBLFFBQUEsU0FBQTs7SUFFQSxJQUFBLFVBQUEsUUFBQSxPQUFBLFlBQUE7SUFDQSxVQUFBLFFBQUEsT0FBQSxTQUFBLE9BQUE7SUFDQSxRQUFBLFNBQUEsSUFBQSxPQUFBO0lBQ0EsR0FBQSxRQUFBLE1BQUE7S0FDQSxRQUFBLE9BQUEsR0FBQSxRQUFBLFFBQUE7O0lBRUEsUUFBQSxJQUFBLFVBQUEsUUFBQSxTQUFBLE1BQUEsSUFBQSxpQkFBQSxRQUFBLFNBQUEsSUFBQTtJQUNBLElBQUEsTUFBQTtJQUNBLFFBQUEsUUFBQSxPQUFBLE1BQUEsVUFBQSxLQUFBLEtBQUE7S0FDQSxNQUFBLEdBQUEsSUFBQSxDQUFBLEtBQUEsU0FBQSxJQUFBLFFBQUE7O0lBRUEsSUFBQSxJQUFBLEdBQUEsTUFBQTtNQUNBLE9BQUEsQ0FBQSxHQUFBO01BQ0EsTUFBQSxDQUFBLFFBQUEsT0FBQSxNQUFBLFFBQUEsUUFBQSxRQUFBLE9BQUE7TUFDQSxNQUFBOztJQUVBLElBQUEsUUFBQSxHQUFBLElBQUE7TUFDQSxFQUFBO01BQ0EsT0FBQSxDQUFBLEdBQUE7TUFDQSxHQUFBLFNBQUE7TUFDQSxHQUFBLFlBQUE7O0lBRUEsSUFBQSxNQUFBLEdBQUEsT0FBQSxRQUFBLElBQUEsT0FBQTtNQUNBLEtBQUEsU0FBQSxRQUFBO01BQ0EsS0FBQSxVQUFBLFFBQUE7TUFDQSxPQUFBOztJQUVBLElBQUEsV0FBQSxJQUFBLE9BQUE7TUFDQSxPQUFBO01BQ0EsS0FBQSxNQUFBLFFBQUEsTUFBQSxRQUFBO01BQ0EsS0FBQSxNQUFBO01BQ0EsS0FBQSxNQUFBO01BQ0EsS0FBQSxNQUFBO01BQ0EsS0FBQSxNQUFBO01BQ0EsS0FBQSxnQkFBQTtJQUNBLFFBQUEsUUFBQSxRQUFBLFFBQUEsVUFBQSxPQUFBO0tBQ0EsU0FBQSxPQUFBO09BQ0EsS0FBQSxVQUFBLE1BQUEsV0FBQTtPQUNBLEtBQUEsY0FBQSxNQUFBO09BQ0EsS0FBQSxnQkFBQSxNQUFBOztJQUVBLElBQUEsT0FBQSxJQUFBLE9BQUE7TUFDQSxLQUFBLFNBQUEsUUFBQTtNQUNBLEtBQUEsVUFBQSxRQUFBO01BQ0EsTUFBQSxRQUFBLFdBQUEsUUFBQSxNQUFBLFFBQUEsU0FBQTtJQUNBLElBQUEsU0FBQSxJQUFBLE9BQUEsS0FBQSxLQUFBLGFBQUEsZUFBQSxRQUFBLFNBQUEsSUFBQSxPQUFBLFFBQUEsU0FBQSxJQUFBO01BQ0EsS0FBQSxTQUFBOztJQUVBLElBQUEsUUFBQSxTQUFBLE1BQUE7S0FDQSxPQUFBLE9BQUE7T0FDQSxLQUFBLEtBQUEsUUFBQSxTQUFBO0tBQ0EsT0FBQSxPQUFBO09BQ0EsS0FBQTtPQUNBLE1BQUEsYUFBQSxRQUFBLE9BQUE7T0FDQSxLQUFBLGVBQUE7T0FDQSxLQUFBLEtBQUE7S0FDQSxJQUFBLFVBQUEsSUFBQSxPQUFBLEtBQUEsS0FBQSxhQUFBLGdCQUFBLFFBQUEsU0FBQSxRQUFBLFNBQUEsTUFBQSxPQUFBLFFBQUEsU0FBQSxJQUFBO09BQ0EsS0FBQSxTQUFBO0tBQ0EsUUFBQSxPQUFBO09BQ0EsS0FBQSxLQUFBLFFBQUEsU0FBQTtLQUNBLFFBQUEsT0FBQTtPQUNBLEtBQUEsVUFBQTs7T0FFQSxHQUFBLE1BQUEsS0FBQTtRQUNBLElBQUEsSUFBQSxDQUFBLFNBQUEsT0FBQSxNQUFBO1FBQ0EsT0FBQSxFQUFBLE9BQUEsR0FBQSxFQUFBLFFBQUEsU0FBQTs7T0FFQSxPQUFBOztPQUVBLE1BQUEsYUFBQSxRQUFBLE9BQUE7T0FDQSxLQUFBLGVBQUE7T0FDQSxLQUFBLEtBQUE7O0lBRUEsSUFBQSxTQUFBLElBQUEsT0FBQTtNQUNBLEtBQUEsU0FBQTtJQUNBLEdBQUEsUUFBQSxZQUFBLEtBQUE7S0FDQSxPQUFBLEtBQUE7OztJQUdBLE9BQUEsT0FBQTtNQUNBLEtBQUEsVUFBQSxRQUFBOztJQUVBLElBQUEsUUFBQSxTQUFBLE1BQUE7SUFDQSxPQUFBLE9BQUE7TUFDQSxLQUFBLE1BQUEsUUFBQSxRQUFBO01BQ0EsS0FBQSxNQUFBO01BQ0EsS0FBQSxNQUFBLFFBQUEsUUFBQTtNQUNBLEtBQUEsTUFBQSxRQUFBO01BQ0EsS0FBQSxvQkFBQTtNQUNBLEtBQUEsZ0JBQUE7TUFDQSxLQUFBLFVBQUE7O0lBRUEsSUFBQSxhQUFBLE9BQUEsT0FBQTtNQUNBLEtBQUEsYUFBQSxpQkFBQSxRQUFBLFNBQUEsSUFBQTtJQUNBLElBQUEsU0FBQSxXQUFBLE9BQUE7TUFDQSxLQUFBLFNBQUE7TUFDQSxLQUFBLEtBQUEsUUFBQSxTQUFBO0tBQ0EsR0FBQSxRQUFBLE1BQUE7TUFDQSxPQUFBLE1BQUEsUUFBQSxRQUFBOztJQUVBLElBQUEsY0FBQSxXQUFBLE9BQUE7TUFDQSxLQUFBO01BQ0EsTUFBQSxhQUFBLFFBQUEsT0FBQTtNQUNBLEtBQUEsZUFBQSxVQUFBLEtBQUEsS0FBQTs7Ozs7O0lBTUEsU0FBQSxRQUFBO0tBQ0EsSUFBQSxRQUFBLE1BQUEsU0FBQTs7S0FFQSxJQUFBLEdBQUEsTUFBQSxhQUFBO01BQ0EsUUFBQSxFQUFBLE9BQUEsR0FBQSxNQUFBLE1BQUE7TUFDQSxNQUFBLE9BQUEsQ0FBQSxPQUFBOztLQUVBLEdBQUEsU0FBQSxTQUFBLEtBQUE7TUFDQSxJQUFBLElBQUEsQ0FBQSxTQUFBLFNBQUEsTUFBQTtNQUNBLFlBQUEsS0FBQSxFQUFBLE9BQUEsR0FBQSxFQUFBLFFBQUEsU0FBQTs7U0FFQTtNQUNBLFlBQUEsS0FBQSxTQUFBOzs7S0FHQSxXQUFBLEtBQUEsYUFBQSxlQUFBLEVBQUEsU0FBQSxNQUFBLFFBQUEsU0FBQSxJQUFBOzs7SUFHQSxTQUFBLFVBQUE7O0tBRUEsSUFBQSxRQUFBLE1BQUEsU0FBQTtNQUNBLFFBQUE7TUFDQSxRQUFBO0tBQ0EsSUFBQSxRQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0lBZ0JBLE9BQUEsT0FBQSxXQUFBLFNBQUEsRUFBQSxFQUFBO0tBQ0EsR0FBQSxNQUFBLEVBQUE7TUFDQTs7S0FFQSxRQUFBLE9BQUEsR0FBQSxRQUFBLEVBQUE7S0FDQSxXQUFBLElBQUEsT0FBQTtPQUNBLE9BQUE7T0FDQSxLQUFBLE1BQUEsUUFBQSxNQUFBLElBQUEsRUFBQTtPQUNBLEtBQUEsTUFBQTtPQUNBLEtBQUEsTUFBQTtPQUNBLEtBQUEsTUFBQTtPQUNBLEtBQUEsTUFBQTtPQUNBLEtBQUEsZ0JBQUE7S0FDQSxRQUFBLFFBQUEsUUFBQSxRQUFBLFVBQUEsT0FBQTtNQUNBLFNBQUEsT0FBQTtRQUNBLEtBQUEsVUFBQSxNQUFBLFdBQUE7UUFDQSxLQUFBLGNBQUEsTUFBQTtRQUNBLEtBQUEsZ0JBQUEsTUFBQTs7S0FFQSxLQUFBLE1BQUEsUUFBQSxVQUFBLFFBQUEsUUFBQSxJQUFBLEVBQUEsTUFBQTtLQUNBLE9BQUEsTUFBQSxRQUFBLEVBQUE7S0FDQSxZQUFBLEtBQUEsU0FBQSxRQUFBLFlBQUEsRUFBQTtLQUNBLFdBQUEsYUFBQSxTQUFBLEtBQUEsS0FBQSxRQUFBLEtBQUEsYUFBQSxlQUFBLEVBQUEsUUFBQSxZQUFBLEVBQUEsVUFBQSxNQUFBLFFBQUEsU0FBQSxJQUFBOztJQUVBLE9BQUE7S0FDQSxZQUFBO01BQ0EsT0FBQSxRQUFBOztLQUVBLFVBQUEsVUFBQSxVQUFBO01BQ0EsSUFBQSxDQUFBLFVBQUE7T0FDQSxZQUFBLEtBQUEsU0FBQTtPQUNBLFdBQUEsS0FBQSxhQUFBLGVBQUEsRUFBQSxLQUFBLE1BQUEsUUFBQSxTQUFBLElBQUE7T0FDQTs7TUFFQSxZQUFBLEtBQUEsU0FBQSxTQUFBLFFBQUE7TUFDQSxJQUFBLFlBQUEsVUFBQTtPQUNBLFdBQUEsS0FBQSxhQUFBLGVBQUEsRUFBQSxTQUFBLFFBQUEsVUFBQSxNQUFBLFFBQUEsU0FBQSxJQUFBO2FBQ0E7T0FDQSxXQUFBLGFBQUEsU0FBQSxLQUFBLEtBQUEsUUFBQSxLQUFBLGFBQUEsZUFBQSxFQUFBLFNBQUEsUUFBQSxVQUFBLE1BQUEsUUFBQSxTQUFBLElBQUE7Ozs7Ozs7Ozs7O0FDcE9BLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsUUFBQSxvQkFBQSxZQUFBLGNBQUEsVUFBQTs7Ozs7O0FDSEEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGtCQUFBLFdBQUEsNkRBQUEsU0FBQSxRQUFBLFVBQUEsUUFBQSxjQUFBOztFQUVBLE9BQUE7R0FDQSxVQUFBO0dBQ0EsYUFBQTtHQUNBLFlBQUE7R0FDQSxRQUFBO0dBQ0EsTUFBQSxVQUFBLFFBQUEsU0FBQSxRQUFBOzs7SUFHQSxPQUFBLE9BQUEsUUFBQSxTQUFBLEVBQUEsRUFBQTtLQUNBLEdBQUEsSUFBQSxHQUFBLE9BQUE7S0FDQSxRQUFBLElBQUE7O0lBRUEsSUFBQSxTQUFBO0lBQ0EsSUFBQSxVQUFBLEdBQUEsV0FBQSxHQUFBLGFBQUEsR0FBQTtJQUNBLElBQUEsT0FBQTtJQUNBLElBQUEsV0FBQTtJQUNBLElBQUEsbUJBQUE7SUFDQSxJQUFBLFNBQUEsUUFBQSxLQUFBO0tBQ0EsSUFBQSxRQUFBLFFBQUEsS0FBQTtLQUNBLElBQUEsYUFBQTtLQUNBLElBQUEsTUFBQTtLQUNBLElBQUEsVUFBQTtLQUNBLE1BQUEsSUFBQSxFQUFBLFFBQUE7S0FDQSxPQUFBLEtBQUEsU0FBQSxXQUFBO09BQ0EsTUFBQSxHQUFBOztLQUVBLE1BQUEsS0FBQSxTQUFBLFNBQUEsRUFBQTtNQUNBLGFBQUE7TUFDQSxNQUFBO01BQ0EsVUFBQTs7TUFFQSxTQUFBO01BQ0EsVUFBQSxHQUFBLFdBQUEsR0FBQSxhQUFBLEdBQUE7TUFDQSxPQUFBO01BQ0EsV0FBQTtPQUNBLFNBQUEsVUFBQTtRQUNBLGFBQUE7UUFDQSxJQUFBLE1BQUEsS0FBQSxNQUFBLE1BQUEsR0FBQSxNQUFBLEdBQUE7U0FDQSxnQkFBQTtTQUNBLE9BQUE7U0FDQSxlQUFBO1NBQ0EsS0FBQSxTQUFBLElBQUE7VUFDQSxRQUFBLFFBQUEsSUFBQSxLQUFBLElBQUEsU0FBQSxNQUFBLElBQUE7V0FDQSxHQUFBLE1BQUEsU0FBQSxPQUFBLEdBQUE7WUFDQSxHQUFBLEtBQUEsV0FBQSxpQkFBQSxTQUFBLE9BQUEsS0FBQSxLQUFBLFdBQUEsY0FBQSxRQUFBLFNBQUEsQ0FBQSxFQUFBO2FBQ0EsSUFBQSxRQUFBO2NBQ0EsS0FBQTtjQUNBLFFBQUE7Y0FDQSxRQUFBO2NBQ0EsT0FBQTs7YUFFQSxJQUFBLE9BQUEsS0FBQTthQUNBLE9BQUEsS0FBQTs7OztVQUlBLEdBQUEsV0FBQTtXQUNBLFFBQUEsUUFBQSxJQUFBLEtBQUEsSUFBQSxTQUFBLE1BQUEsSUFBQTtZQUNBLEdBQUEsSUFBQSxVQUFBLEVBQUE7YUFDQSxHQUFBLE9BQUEsUUFBQSxLQUFBLFFBQUEsWUFBQTtlQUNBLFFBQUEsS0FBQSxPQUFBOzthQUVBLFFBQUEsS0FBQSxLQUFBLEtBQUE7Ozs7O2NBS0E7V0FDQSxhQUFBLFFBQUE7Ozs7O1NBS0Esa0JBQUEsU0FBQTtTQUNBOzs7VUFHQSxJQUFBLFFBQUEsTUFBQSxPQUFBLGVBQUE7V0FDQSxJQUFBLFlBQUE7WUFDQSxJQUFBLFdBQUEsTUFBQSxPQUFBLEdBQUEsT0FBQSxPQUFBOztVQUVBLEdBQUEsU0FBQSxTQUFBLEVBQUE7WUFDQSxXQUFBLE1BQUEsT0FBQSxHQUFBLE9BQUEsT0FBQTtXQUNBLFlBQUE7O1VBRUEsSUFBQSxRQUFBOztVQUVBLElBQUEsSUFBQSxJQUFBLEdBQUEsS0FBQSxTQUFBLFFBQUEsSUFBQTtXQUNBLEdBQUEsU0FBQSxHQUFBO1lBQ0EsU0FBQSxLQUFBLFNBQUEsR0FBQSxRQUFBLGNBQUEsS0FBQTtZQUNBLEdBQUEsU0FBQSxHQUFBLFFBQUEsT0FBQSxDQUFBLEVBQUE7YUFDQSxTQUFBLEtBQUEsU0FBQSxHQUFBLE9BQUEsR0FBQSxTQUFBLEdBQUEsUUFBQTs7WUFFQSxJQUFBLE9BQUEsU0FBQSxHQUFBLE1BQUE7WUFDQSxHQUFBLEtBQUEsU0FBQSxFQUFBO2FBQ0EsU0FBQSxLQUFBO2FBQ0EsSUFBQSxJQUFBLElBQUEsR0FBQSxJQUFBLEtBQUEsUUFBQSxJQUFBO2NBQ0EsR0FBQSxNQUFBLEtBQUEsSUFBQTtlQUNBLEdBQUEsSUFBQSxFQUFBO2dCQUNBLFNBQUEsTUFBQTs7ZUFFQSxTQUFBLE1BQUEsS0FBQTs7Ozs7WUFLQSxHQUFBLFNBQUEsR0FBQSxVQUFBLEVBQUE7YUFDQSxNQUFBLEtBQUE7Ozs7VUFJQSxHQUFBLFNBQUEsVUFBQSxNQUFBLE9BQUE7V0FDQSxhQUFBO1lBQ0EsSUFBQSxJQUFBLElBQUEsR0FBQSxLQUFBLFNBQUEsUUFBQSxJQUFBO2FBQ0EsR0FBQSxPQUFBLFFBQUEsU0FBQSxPQUFBLFlBQUE7Y0FDQSxRQUFBLFNBQUEsTUFBQTs7YUFFQSxRQUFBLFNBQUEsSUFBQSxPQUFBOzs7O1lBSUEsT0FBQSxTQUFBLEtBQUEsYUFBQSxNQUFBLE9BQUE7O1NBRUEsT0FBQSxTQUFBLEtBQUE7U0FDQTtVQUNBLGFBQUEsTUFBQTs7U0FFQSxVQUFBLFNBQUE7U0FDQTtVQUNBLGFBQUEsVUFBQTs7O1VBR0EsR0FBQSxDQUFBLFdBQUE7V0FDQSxRQUFBLFFBQUEsYUFBQSxnQkFBQSxLQUFBLElBQUEsU0FBQSxNQUFBLElBQUE7WUFDQSxHQUFBLElBQUEsY0FBQSxRQUFBLFVBQUEsQ0FBQSxLQUFBLElBQUEsY0FBQSxRQUFBLFdBQUEsQ0FBQSxFQUFBO2FBQ0EsYUFBQSxZQUFBOzthQUVBLEdBQUEsSUFBQSxjQUFBLFFBQUEsY0FBQSxDQUFBLEVBQUE7Y0FDQSxhQUFBLGdCQUFBOzthQUVBLEdBQUEsSUFBQSxjQUFBLFFBQUEsV0FBQSxDQUFBLEtBQUEsS0FBQSxXQUFBLFVBQUEsRUFBQTtjQUNBLGFBQUEsYUFBQTs7OztjQUlBO1dBQ0EsUUFBQSxRQUFBLFNBQUEsU0FBQSxLQUFBLElBQUE7WUFDQSxLQUFBLFNBQUE7WUFDQSxHQUFBLElBQUEsaUJBQUEsZUFBQSxPQUFBLE9BQUEsWUFBQTthQUNBLElBQUEsSUFBQSxDQUFBLElBQUEsSUFBQTthQUNBLFFBQUEsUUFBQSxLQUFBLE1BQUEsU0FBQSxRQUFBLEVBQUE7Y0FDQSxFQUFBLFVBQUEsS0FBQTtjQUNBLEdBQUEsTUFBQSxXQUFBLFNBQUEsR0FBQTtlQUNBLEdBQUEsT0FBQSxXQUFBLGlCQUFBLFFBQUEsU0FBQSxLQUFBLE9BQUEsV0FBQSxjQUFBLFFBQUEsU0FBQSxDQUFBLEVBQUE7Z0JBQ0EsS0FBQSxPQUFBLEtBQUE7aUJBQ0EsS0FBQTtpQkFDQSxRQUFBO2lCQUNBLFFBQUE7O2dCQUVBOzs7O2FBSUEsYUFBQSxRQUFBLENBQUEsS0FBQSxDQUFBLElBQUEsT0FBQSxLQUFBOzs7V0FHQSxhQUFBLFlBQUE7Ozs7VUFJQSxhQUFBO1VBQ0EsT0FBQSxLQUFBLGFBQUEsY0FBQSxvQkFBQTtVQUNBLE9BQUEsR0FBQTs7Ozs7Ozs7Ozs7Ozs7QUNqTEEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxRQUFBLG9CQUFBLFlBQUEsZ0JBQUEsVUFBQTs7Ozs7OztBQ0hBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxrQkFBQSxXQUFBLG1CQUFBLFdBQUE7RUFDQSxJQUFBLFdBQUEsVUFBQTtHQUNBLE9BQUE7SUFDQSxPQUFBOzs7RUFHQSxPQUFBO0dBQ0EsVUFBQTtHQUNBLE1BQUE7SUFDQSxLQUFBO0lBQ0EsVUFBQTtJQUNBLFFBQUE7O0dBRUEsYUFBQTtHQUNBLFlBQUE7R0FDQSxNQUFBLFVBQUEsUUFBQSxTQUFBLFFBQUE7SUFDQSxPQUFBLFVBQUEsUUFBQSxPQUFBLFlBQUEsT0FBQTtJQUNBLE9BQUE7SUFDQSxPQUFBOzs7Ozs7OztBQ3JCQSxDQUFBLFlBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSxrQ0FBQSxVQUFBLFFBQUE7RUFDQSxPQUFBLFNBQUE7R0FDQSxTQUFBO0dBQ0EsVUFBQTtHQUNBLFVBQUE7R0FDQSxhQUFBO0dBQ0EsaUJBQUE7R0FDQSxrQkFBQTtHQUNBLGVBQUE7R0FDQSxpQkFBQTtHQUNBLFVBQUE7O0VBRUEsT0FBQSxRQUFBO0dBQ0EsU0FBQTtJQUNBLE9BQUE7O0dBRUEsTUFBQTs7RUFFQSxPQUFBLFdBQUEsWUFBQTtHQUNBLE9BQUEsTUFBQSxRQUFBLFFBQUE7SUFDQSxNQUFBO0lBQ0EsZ0JBQUE7SUFDQSxRQUFBO0tBQ0EsS0FBQTtLQUNBLE9BQUE7S0FDQSxRQUFBO0tBQ0EsTUFBQTs7SUFFQSxHQUFBLFVBQUEsR0FBQTtLQUNBLE9BQUEsRUFBQTs7SUFFQSxHQUFBLFVBQUEsR0FBQTtLQUNBLE9BQUEsRUFBQTs7SUFFQSxZQUFBO0lBQ0EsWUFBQTtJQUNBLFdBQUE7SUFDQSxvQkFBQTtJQUNBLHlCQUFBOzs7SUFHQSxPQUFBO0tBQ0EsV0FBQTs7SUFFQSxPQUFBO0tBQ0EsV0FBQTtLQUNBLG1CQUFBOztJQUVBLFFBQUE7S0FDQSxZQUFBOztJQUVBLE9BQUE7S0FDQSxhQUFBOzs7O0dBSUEsSUFBQSxPQUFBLFFBQUEsVUFBQSxNQUFBO0lBQ0EsT0FBQSxNQUFBLFFBQUEsTUFBQSxVQUFBLENBQUEsU0FBQSxPQUFBLE1BQUEsTUFBQSxPQUFBLE1BQUE7O0dBRUEsT0FBQSxPQUFBOztFQUVBLE9BQUEsaUJBQUEsWUFBQTtHQUNBLElBQUEsWUFBQTtHQUNBLE9BQUEsUUFBQTtJQUNBLEtBQUE7SUFDQSxLQUFBOztHQUVBLFFBQUEsUUFBQSxPQUFBLFdBQUEsVUFBQSxNQUFBLEtBQUE7SUFDQSxJQUFBLFFBQUE7S0FDQSxJQUFBO0tBQ0EsS0FBQSxLQUFBO0tBQ0EsT0FBQSxLQUFBO0tBQ0EsUUFBQTs7SUFFQSxRQUFBLFFBQUEsT0FBQSxNQUFBLFVBQUEsTUFBQSxHQUFBO0tBQ0EsTUFBQSxPQUFBLEtBQUE7TUFDQSxJQUFBO01BQ0EsR0FBQSxLQUFBLEtBQUEsT0FBQTtNQUNBLEdBQUEsS0FBQSxLQUFBLE9BQUE7O0tBRUEsT0FBQSxNQUFBLE1BQUEsS0FBQSxJQUFBLE9BQUEsTUFBQSxLQUFBLEtBQUEsS0FBQSxPQUFBO0tBQ0EsT0FBQSxNQUFBLE1BQUEsS0FBQSxJQUFBLE9BQUEsTUFBQSxLQUFBLEtBQUEsS0FBQSxPQUFBOztJQUVBLFVBQUEsS0FBQTs7O0dBR0EsT0FBQSxNQUFBLE9BQUE7R0FDQSxJQUFBLE9BQUEsUUFBQSxVQUFBLFFBQUE7SUFDQSxPQUFBLE1BQUEsUUFBQSxNQUFBLFVBQUEsQ0FBQSxTQUFBLE9BQUEsTUFBQSxNQUFBLE9BQUEsTUFBQTs7O0VBR0EsT0FBQSxPQUFBLFFBQUEsVUFBQSxHQUFBLEdBQUE7R0FDQSxJQUFBLENBQUEsR0FBQTtJQUNBOztHQUVBLE9BQUE7O0VBRUEsT0FBQSxPQUFBLGFBQUEsVUFBQSxHQUFBLEdBQUE7R0FDQSxJQUFBLE1BQUEsR0FBQTtJQUNBOztHQUVBLE9BQUE7Ozs7OztBQ3hHQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsa0JBQUEsVUFBQSxpQkFBQSxDQUFBLGVBQUEsU0FBQSxhQUFBOztFQUVBLElBQUEsU0FBQTtRQUNBLElBQUEsU0FBQTs7UUFFQSxTQUFBLE1BQUEsSUFBQTtZQUNBLElBQUEsS0FBQSxHQUFBLEdBQUEsYUFBQTtZQUNBLElBQUEsQ0FBQSxJQUFBO2dCQUNBLEtBQUEsRUFBQTtnQkFDQSxHQUFBLEdBQUEsYUFBQSxxQkFBQTs7WUFFQSxPQUFBOztRQUVBLFNBQUEsU0FBQSxJQUFBO1lBQ0EsSUFBQSxRQUFBLE9BQUE7WUFDQSxJQUFBLENBQUEsT0FBQTtnQkFDQSxRQUFBO2dCQUNBLE9BQUEsTUFBQTs7WUFFQSxPQUFBOzs7UUFHQSxTQUFBLGVBQUEsU0FBQSxPQUFBLFVBQUEsU0FBQSxRQUFBO1lBQ0EsT0FBQSxXQUFBO2dCQUNBLE1BQUEsWUFBQTtnQkFDQSxNQUFBLFdBQUE7Z0JBQ0EsTUFBQSxTQUFBO2dCQUNBLFNBQUEsUUFBQSxRQUFBLFdBQUE7b0JBQ0EsSUFBQSxXQUFBLE1BQUEsV0FBQSxRQUFBO3dCQUNBLFFBQUEsR0FBQSxNQUFBLFNBQUE7O29CQUVBLE1BQUEsWUFBQTtvQkFDQSxNQUFBLFdBQUE7b0JBQ0EsTUFBQTs7Ozs7UUFLQSxPQUFBO1lBQ0EsT0FBQSxTQUFBLFNBQUEsUUFBQTs7b0JBRUEsSUFBQSxRQUFBLFNBQUEsTUFBQTtvQkFDQSxJQUFBLFNBQUEsQ0FBQSxNQUFBLGFBQUEsTUFBQTt3QkFDQSxNQUFBLFNBQUEsUUFBQSxHQUFBO29CQUNBLElBQUEsV0FBQSxZQUFBLFNBQUE7d0JBQ0EsTUFBQSxDQUFBLFFBQUEsU0FBQSxNQUFBLFNBQUE7d0JBQ0EsSUFBQSxDQUFBLFFBQUEsT0FBQSxTQUFBOztvQkFFQSxJQUFBLFVBQUE7d0JBQ0EsSUFBQSxNQUFBLFdBQUE7NEJBQ0EsTUFBQTs4QkFDQSxlQUFBOzZDQUNBOzZDQUNBOzZDQUNBOzZDQUNBOzRCQUNBLE9BQUEsTUFBQSxTQUFBOzs2QkFFQTs0QkFDQSxNQUFBLFNBQUE7NEJBQ0EsT0FBQSxlQUFBO2tEQUNBO2tEQUNBO2tEQUNBO2tEQUNBOzs7O2dCQUlBOztZQUVBLE9BQUEsU0FBQSxTQUFBLFFBQUE7O29CQUVBLElBQUEsUUFBQSxTQUFBLE1BQUE7b0JBQ0EsSUFBQSxTQUFBLENBQUEsTUFBQSxhQUFBLE1BQUE7d0JBQ0EsTUFBQSxTQUFBLFFBQUEsR0FBQTs7b0JBRUEsSUFBQSxXQUFBLFlBQUEsU0FBQTt3QkFDQSxNQUFBLENBQUEsUUFBQSxPQUFBLFNBQUE7d0JBQ0EsSUFBQSxDQUFBLFFBQUEsU0FBQSxNQUFBLFNBQUE7O29CQUVBLElBQUEsVUFBQTt3QkFDQSxJQUFBLE1BQUEsV0FBQTs0QkFDQSxNQUFBLFNBQUEsZUFBQTswREFDQTswREFDQTswREFDQTswREFDQTs0QkFDQSxPQUFBLE1BQUEsU0FBQTs7NkJBRUE7NEJBQ0EsTUFBQSxTQUFBOzRCQUNBLE9BQUEsZUFBQTtrREFDQTtrREFDQTtrREFDQTtrREFDQTs7OztnQkFJQTs7Ozs7O0FDdEdBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsUUFBQSxvQkFBQSxZQUFBLG1CQUFBLFVBQUE7Ozs7OztBQ0hBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxrQkFBQSxXQUFBLFVBQUEsV0FBQTs7RUFFQSxPQUFBO0dBQ0EsVUFBQTtHQUNBLGFBQUE7R0FDQSxZQUFBO0dBQ0EsY0FBQTtHQUNBLE1BQUE7R0FDQSxrQkFBQTtJQUNBLE1BQUE7SUFDQSxRQUFBO0lBQ0EsUUFBQTtJQUNBLE1BQUE7O0dBRUEsUUFBQTtHQUNBLE1BQUEsVUFBQSxPQUFBLFNBQUEsT0FBQTs7Ozs7Ozs7O0FDbEJBLENBQUEsWUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLHdDQUFBLFVBQUEsUUFBQSxhQUFBOztFQUVBLElBQUEsS0FBQTtFQUNBLEdBQUEsY0FBQTtFQUNBLEdBQUEsZ0JBQUE7RUFDQSxHQUFBLFlBQUE7O0VBRUEsU0FBQSxZQUFBLE9BQUE7R0FDQSxJQUFBLEdBQUEsS0FBQSxZQUFBLE1BQUEsSUFBQTtJQUNBLEdBQUEsS0FBQSxXQUFBO1VBQ0E7SUFDQSxHQUFBLEtBQUEsV0FBQSxNQUFBO0lBQ0EsR0FBQSxLQUFBLFFBQUE7OztFQUdBLFNBQUEsY0FBQSxNQUFBLE9BQUE7R0FDQSxPQUFBLEdBQUEsS0FBQSxZQUFBLE1BQUEsS0FBQSxPQUFBOztFQUVBLFNBQUEsWUFBQTtHQUNBLFlBQUEsS0FBQSxVQUFBLEdBQUEsT0FBQSxLQUFBLFVBQUEsTUFBQTtJQUNBLEdBQUEsT0FBQSxLQUFBO0lBQ0EsR0FBQSxjQUFBO0lBQ0EsR0FBQSxLQUFBLFFBQUE7SUFDQSxPQUFBLFFBQUEsNEJBQUE7Ozs7Ozs7QUMxQkEsQ0FBQSxZQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGtCQUFBLFVBQUEsWUFBQTs7Q0FFQSxTQUFBLFVBQUEsQ0FBQSxZQUFBOztDQUVBLFNBQUEsU0FBQSxVQUFBLGNBQUE7RUFDQSxPQUFBO0dBQ0EsVUFBQTtHQUNBLFNBQUE7R0FDQSxZQUFBO0dBQ0EsYUFBQTtHQUNBLE1BQUE7OztFQUdBLFNBQUEscUJBQUEsUUFBQSxTQUFBLFFBQUE7Ozs7O0FDaEJBLENBQUEsV0FBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLGtEQUFBLFNBQUEsUUFBQSxTQUFBLFVBQUE7RUFDQSxPQUFBLE9BQUE7RUFDQSxPQUFBLFdBQUE7RUFDQSxPQUFBLGlCQUFBO0VBQ0EsT0FBQSxnQkFBQTtFQUNBLE9BQUEsY0FBQTtFQUNBLE9BQUEsYUFBQTtFQUNBLE9BQUEsZ0JBQUE7RUFDQSxPQUFBLGFBQUE7RUFDQTs7RUFFQSxTQUFBLFdBQUE7R0FDQSxPQUFBO0dBQ0EsT0FBQTtHQUNBLE9BQUE7R0FDQSxPQUFBO0dBQ0EsT0FBQTtHQUNBLE9BQUEsT0FBQSx1QkFBQSxTQUFBLFNBQUEsU0FBQTtJQUNBLElBQUEsWUFBQSxTQUFBO0tBQ0EsT0FBQTs7SUFFQSxPQUFBO0lBQ0EsT0FBQTtJQUNBLE9BQUE7SUFDQSxPQUFBOztHQUVBLE9BQUEsT0FBQSxXQUFBLFNBQUEsR0FBQSxHQUFBO0lBQ0EsSUFBQSxNQUFBLEdBQUE7S0FDQTs7SUFFQSxPQUFBOzs7O0VBSUEsU0FBQSxhQUFBO0dBQ0EsT0FBQSxPQUFBLENBQUEsT0FBQTtHQUNBOztFQUVBLFNBQUEsY0FBQTtHQUNBLElBQUEsT0FBQTtHQUNBLFFBQUEsUUFBQSxPQUFBLE1BQUEsU0FBQSxNQUFBO0lBQ0EsS0FBQSxPQUFBLFFBQUEsWUFBQSxRQUFBLFdBQUEsS0FBQSxPQUFBLFFBQUEsWUFBQTtJQUNBLEtBQUEsV0FBQSxTQUFBLEtBQUE7O0dBRUEsSUFBQSxTQUFBLFFBQUEsV0FBQSxPQUFBLEtBQUEsQ0FBQSxPQUFBLFFBQUEsWUFBQSxNQUFBLFVBQUE7R0FDQSxLQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsT0FBQSxRQUFBLEtBQUE7SUFDQSxJQUFBLE9BQUEsR0FBQSxPQUFBLE9BQUEsUUFBQSxLQUFBO0tBQ0EsT0FBQSxJQUFBOzs7R0FHQSxPQUFBLFFBQUEsT0FBQSxRQUFBLFlBQUEsS0FBQSxXQUFBOztFQUVBLFNBQUEsV0FBQSxRQUFBO0dBQ0EsSUFBQSxTQUFBLFFBQUEsV0FBQSxPQUFBLEtBQUEsQ0FBQSxPQUFBLFFBQUEsWUFBQSxNQUFBLFVBQUE7R0FDQSxJQUFBLE9BQUE7R0FDQSxRQUFBLFFBQUEsUUFBQSxTQUFBLE1BQUEsSUFBQTtJQUNBLEdBQUEsS0FBQSxXQUFBLFFBQUEsUUFBQTtLQUNBLE9BQUE7OztHQUdBLE9BQUEsS0FBQTs7RUFFQSxTQUFBLGdCQUFBO0dBQ0EsT0FBQSxVQUFBLENBQUEsT0FBQSxRQUFBLFFBQUEsWUFBQTs7O0VBR0EsU0FBQSxnQkFBQTtHQUNBLE9BQUEsZ0JBQUE7SUFDQSxPQUFBLE9BQUEsUUFBQSxRQUFBLFlBQUE7SUFDQSxPQUFBLE9BQUEsUUFBQSxRQUFBLFlBQUE7SUFDQSxVQUFBO0lBQ0EsT0FBQTtLQUNBLEtBQUE7OztHQUdBLE9BQUEsbUJBQUE7SUFDQSxPQUFBLE9BQUEsUUFBQSxRQUFBLFlBQUE7SUFDQSxPQUFBLE9BQUEsUUFBQSxRQUFBLFlBQUE7SUFDQSxVQUFBO0lBQ0EsT0FBQTtLQUNBLEtBQUE7Ozs7O0VBS0EsU0FBQSxXQUFBO0dBQ0EsT0FBQSxRQUFBO0lBQ0EsU0FBQTtLQUNBLE9BQUE7TUFDQSxNQUFBOztNQUVBLGdCQUFBO01BQ0EsUUFBQTtPQUNBLEtBQUE7T0FDQSxPQUFBO09BQ0EsUUFBQTtPQUNBLE1BQUE7O01BRUEsR0FBQSxTQUFBLEdBQUE7T0FDQSxPQUFBLEVBQUE7O01BRUEsR0FBQSxTQUFBLEdBQUE7T0FDQSxPQUFBLEVBQUE7O01BRUEsWUFBQTtNQUNBLFdBQUE7TUFDQSxvQkFBQTtNQUNBLHlCQUFBO01BQ0EsUUFBQSxDQUFBLEtBQUE7TUFDQSxPQUFBO09BQ0EsV0FBQTs7TUFFQSxPQUFBO09BQ0EsV0FBQTtPQUNBLG1CQUFBOztNQUVBLFFBQUE7T0FDQSxZQUFBO09BQ0EsUUFBQTtRQUNBLFFBQUE7OztNQUdBLE9BQUE7T0FDQSxhQUFBOzs7O0lBSUEsTUFBQTs7R0FFQSxPQUFBLE9BQUE7OztFQUdBLFNBQUEsaUJBQUE7R0FDQSxJQUFBLFlBQUE7R0FDQSxRQUFBLFFBQUEsT0FBQSxRQUFBLFlBQUEsVUFBQSxTQUFBLE1BQUEsS0FBQTtJQUNBLElBQUEsUUFBQTtLQUNBLEtBQUEsS0FBQTtLQUNBLE9BQUEsS0FBQTtLQUNBLFFBQUE7O0lBRUEsUUFBQSxRQUFBLE9BQUEsUUFBQSxLQUFBLFNBQUEsTUFBQTtLQUNBLE1BQUEsT0FBQSxLQUFBO01BQ0EsR0FBQSxLQUFBO01BQ0EsR0FBQSxLQUFBLEtBQUE7OztJQUdBLFVBQUEsS0FBQTs7R0FFQSxPQUFBLE1BQUEsT0FBQTs7Ozs7O0FDdkpBLENBQUEsWUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxrQkFBQSxVQUFBLFlBQUEsWUFBQTtFQUNBLElBQUEsV0FBQSxVQUFBO0lBQ0EsT0FBQTtNQUNBLE1BQUE7OztFQUdBLE9BQUE7R0FDQSxVQUFBOztHQUVBLFlBQUE7R0FDQSxPQUFBO0lBQ0EsTUFBQTs7R0FFQSxNQUFBLFVBQUEsUUFBQSxTQUFBLFFBQUE7SUFDQSxJQUFBLFVBQUEsUUFBQSxPQUFBLFlBQUE7SUFDQSxPQUFBO0lBQ0EsT0FBQTtJQUNBLElBQUEsUUFBQTtLQUNBLFNBQUE7S0FDQSxTQUFBLENBQUEsU0FBQTtLQUNBLElBQUEsR0FBQSxNQUFBLFNBQUEsTUFBQSxDQUFBLEdBQUEsSUFBQSxLQUFBO0tBQ0EsSUFBQSxHQUFBLE1BQUEsTUFBQSxTQUFBLEtBQUEsT0FBQSxDQUFBLEdBQUEsSUFBQSxNQUFBLENBQUEsR0FBQTs7S0FFQSxVQUFBO0tBQ0EsV0FBQTtLQUNBLGNBQUE7O0lBRUEsSUFBQSxNQUFBLEdBQUEsT0FBQSxRQUFBOzs7SUFHQSxJQUFBLE1BQUEsSUFBQSxPQUFBO01BQ0EsS0FBQSxTQUFBLFFBQUEsVUFBQTtNQUNBLEtBQUEsVUFBQSxTQUFBLFVBQUE7TUFDQSxPQUFBO01BQ0EsS0FBQSxhQUFBLGVBQUEsQ0FBQSxTQUFBLFNBQUEsU0FBQSxXQUFBOzs7Ozs7OztJQVFBLElBQUEsWUFBQSxHQUFBLE9BQUE7TUFDQSxLQUFBO01BQ0EsTUFBQSxVQUFBLEdBQUE7TUFDQSxPQUFBOzs7SUFHQSxJQUFBLE1BQUEsR0FBQSxJQUFBO01BQ0EsV0FBQSxVQUFBLEdBQUE7TUFDQSxPQUFBLEtBQUEsSUFBQSxHQUFBLEtBQUEsSUFBQSxJQUFBLEtBQUEsSUFBQSxFQUFBLEVBQUE7O01BRUEsU0FBQSxVQUFBLEdBQUE7TUFDQSxPQUFBLEtBQUEsSUFBQSxHQUFBLEtBQUEsSUFBQSxJQUFBLEtBQUEsSUFBQSxFQUFBLEVBQUEsSUFBQSxFQUFBOztNQUVBLFlBQUEsVUFBQSxHQUFBO01BQ0EsT0FBQSxLQUFBLElBQUEsR0FBQSxFQUFBLElBQUEsRUFBQSxFQUFBLEtBQUEsRUFBQTs7TUFFQSxZQUFBLFVBQUEsR0FBQTtNQUNBLE9BQUEsS0FBQSxJQUFBLEdBQUEsRUFBQSxFQUFBLElBQUEsRUFBQTs7O0lBR0EsSUFBQSxXQUFBO0tBQ0EsV0FBQTtLQUNBLFdBQUE7S0FDQSxXQUFBOzs7SUFHQSxJQUFBLFFBQUEsVUFBQSxNQUFBLE9BQUE7O0lBRUEsSUFBQSxPQUFBLElBQUEsVUFBQSxRQUFBLEtBQUE7SUFDQSxLQUFBLFFBQUEsT0FBQTtNQUNBLEtBQUEsTUFBQSxVQUFBLEdBQUEsR0FBQTtNQUNBLE9BQUEsVUFBQTs7TUFFQSxLQUFBLEtBQUE7TUFDQSxLQUFBLGFBQUE7TUFDQSxLQUFBLFNBQUEsVUFBQSxHQUFBO01BQ0EsT0FBQSxFQUFBLFFBQUEsV0FBQTs7TUFFQSxNQUFBLFFBQUE7TUFDQSxHQUFBLFNBQUE7O0lBRUEsSUFBQSxPQUFBLElBQUEsVUFBQSxRQUFBLEtBQUE7SUFDQSxJQUFBLFlBQUEsS0FBQSxRQUFBLE9BQUE7TUFDQSxNQUFBLGdCQUFBO01BQ0EsS0FBQSxlQUFBLFVBQUEsR0FBQTtNQUNBLElBQUEsRUFBQTtPQUNBLE9BQUE7OztPQUdBLE9BQUE7O01BRUEsS0FBQSxNQUFBLFVBQUEsR0FBQTtNQUNBLE9BQUEsVUFBQSxFQUFBOztNQUVBLEtBQUEsU0FBQSxVQUFBLEdBQUE7TUFDQSxPQUFBOztNQUVBLEtBQUEsTUFBQSxVQUFBLEdBQUE7TUFDQSxPQUFBLEVBQUEsUUFBQSxTQUFBOztNQUVBLEtBQUEsYUFBQSxVQUFBLEdBQUE7TUFDQSxJQUFBLFlBQUEsQ0FBQSxFQUFBLFFBQUEsSUFBQSxNQUFBLEtBQUEsU0FBQTtPQUNBLGNBQUEsRUFBQSxJQUFBLE1BQUEsSUFBQSxDQUFBO09BQ0EsUUFBQSxFQUFBLEVBQUEsSUFBQSxFQUFBLEtBQUEsS0FBQSxNQUFBLEtBQUEsS0FBQSxNQUFBLFlBQUEsYUFBQTtPQUNBLFNBQUEsU0FBQSxZQUFBLENBQUEsS0FBQTtPQUNBLFNBQUEsQ0FBQSxFQUFBLEVBQUEsS0FBQSxlQUFBO09BQ0EsWUFBQSxRQUFBLEtBQUEsQ0FBQSxNQUFBO01BQ0EsSUFBQSxFQUFBLFFBQUEsWUFBQSxFQUFBLFFBQUEsVUFBQSxVQUFBO01BQ0EsSUFBQSxFQUFBLFNBQUEsR0FBQTtPQUNBLFNBQUEsQ0FBQTtPQUNBLFNBQUE7T0FDQSxXQUFBO2FBQ0EsSUFBQSxFQUFBLFNBQUEsR0FBQSxVQUFBLENBQUE7V0FDQSxJQUFBLEVBQUEsU0FBQSxHQUFBLFVBQUEsQ0FBQTtXQUNBLElBQUEsRUFBQSxTQUFBLEdBQUEsVUFBQTtNQUNBLE9BQUEsWUFBQSxTQUFBLGdCQUFBLFNBQUEsYUFBQSxXQUFBOztNQUVBLEdBQUEsU0FBQTs7SUFFQSxVQUFBLE9BQUE7TUFDQSxLQUFBLEtBQUE7TUFDQSxLQUFBLFVBQUEsR0FBQTs7TUFFQSxJQUFBLEVBQUEsU0FBQSxLQUFBLEVBQUEsUUFBQSxZQUFBLEVBQUEsUUFBQSxZQUFBLEVBQUEsUUFBQSxZQUFBLEVBQUEsUUFBQTtPQUNBLE9BQUEsRUFBQSxLQUFBLE1BQUEsS0FBQSxLQUFBLE9BQUEsRUFBQSxLQUFBLE1BQUEsS0FBQSxNQUFBOztPQUVBLE9BQUEsRUFBQSxLQUFBLE1BQUEsS0FBQTs7SUFFQSxVQUFBLE9BQUE7TUFDQSxLQUFBLEtBQUE7TUFDQSxLQUFBLE1BQUE7TUFDQSxLQUFBLFVBQUEsR0FBQTs7TUFFQSxJQUFBLEVBQUEsU0FBQSxLQUFBLEVBQUEsUUFBQSxZQUFBLEVBQUEsUUFBQSxZQUFBLEVBQUEsUUFBQSxZQUFBLEVBQUEsUUFBQTtPQUNBLE9BQUEsQ0FBQSxFQUFBLEtBQUEsTUFBQSxLQUFBLE1BQUEsTUFBQSxPQUFBLEVBQUEsS0FBQSxNQUFBLEtBQUEsTUFBQTs7T0FFQSxPQUFBLENBQUEsRUFBQSxLQUFBLE1BQUEsS0FBQSxNQUFBLE1BQUEsT0FBQSxFQUFBLEtBQUEsTUFBQSxLQUFBLE1BQUE7O0lBRUEsVUFBQSxPQUFBO01BQ0EsS0FBQSxLQUFBO01BQ0EsS0FBQSxNQUFBO01BQ0EsS0FBQSxVQUFBLEdBQUE7TUFDQSxJQUFBLEVBQUEsU0FBQSxLQUFBLEVBQUEsUUFBQSxZQUFBLEVBQUEsUUFBQSxZQUFBLEVBQUEsUUFBQSxZQUFBLEVBQUEsUUFBQTtPQUNBLE9BQUEsQ0FBQSxFQUFBLEtBQUEsTUFBQSxLQUFBLE1BQUEsTUFBQSxPQUFBLEVBQUEsS0FBQSxNQUFBLEtBQUEsTUFBQTs7T0FFQSxPQUFBLENBQUEsRUFBQSxLQUFBLE1BQUEsS0FBQSxNQUFBLE1BQUEsT0FBQSxFQUFBLEtBQUEsTUFBQSxLQUFBLE1BQUEsSUFBQTs7O0lBR0EsU0FBQSxNQUFBLEdBQUE7O0tBRUEsS0FBQTtPQUNBLFNBQUE7T0FDQSxVQUFBLEtBQUEsU0FBQTs7OztLQUlBLEtBQUEsTUFBQSxjQUFBLFVBQUEsR0FBQTtPQUNBLE9BQUEsV0FBQSxHQUFBLEtBQUEsT0FBQSxHQUFBLE9BQUEsTUFBQSxNQUFBOztPQUVBO09BQ0EsU0FBQTtPQUNBLFVBQUEsZUFBQSxVQUFBLEdBQUE7T0FDQSxPQUFBLFlBQUE7UUFDQSxJQUFBLEVBQUE7U0FDQSxPQUFBOzs7U0FHQSxPQUFBOzs7T0FHQSxVQUFBLGFBQUEsVUFBQSxHQUFBO09BQ0EsSUFBQSxZQUFBLENBQUEsRUFBQSxRQUFBLElBQUEsTUFBQSxLQUFBLFNBQUE7T0FDQSxPQUFBLFlBQUE7UUFDQSxJQUFBLFlBQUEsQ0FBQSxFQUFBLFFBQUEsSUFBQSxNQUFBLEtBQUEsU0FBQTtTQUNBLGNBQUEsRUFBQSxJQUFBLE1BQUEsSUFBQSxDQUFBO1NBQ0EsUUFBQSxFQUFBLEVBQUEsSUFBQSxFQUFBLEtBQUEsS0FBQSxNQUFBLEtBQUEsS0FBQSxNQUFBLFlBQUEsYUFBQTtTQUNBLFNBQUEsU0FBQSxZQUFBLENBQUEsS0FBQTtTQUNBLFNBQUEsQ0FBQSxFQUFBLEVBQUEsS0FBQSxlQUFBO1NBQ0EsWUFBQSxRQUFBLEtBQUEsQ0FBQSxNQUFBO1FBQ0EsSUFBQSxFQUFBLFFBQUEsWUFBQSxFQUFBLFFBQUEsVUFBQSxVQUFBO1FBQ0EsSUFBQSxFQUFBLFNBQUEsR0FBQTtTQUNBLFNBQUEsQ0FBQTtTQUNBLFNBQUE7U0FDQSxXQUFBO2VBQ0EsSUFBQSxFQUFBLFNBQUEsR0FBQSxVQUFBLENBQUE7YUFDQSxJQUFBLEVBQUEsU0FBQSxHQUFBLFVBQUEsQ0FBQTthQUNBLElBQUEsRUFBQSxTQUFBLEdBQUEsVUFBQTtRQUNBLE9BQUEsWUFBQSxTQUFBLGdCQUFBLFNBQUEsYUFBQSxXQUFBOzs7T0FHQSxNQUFBLGdCQUFBLFVBQUEsR0FBQTtPQUNBLE9BQUEsV0FBQSxHQUFBLEtBQUEsSUFBQTs7T0FFQSxLQUFBLE9BQUEsVUFBQSxHQUFBO09BQ0EsR0FBQSxPQUFBLE1BQUEsTUFBQSxjQUFBLFdBQUEsR0FBQSxLQUFBLE9BQUE7Ozs7O0lBS0EsU0FBQSxXQUFBLEdBQUEsR0FBQTtLQUNBLElBQUEsTUFBQSxHQUFBLE9BQUE7S0FDQSxJQUFBLEVBQUEsVUFBQTtNQUNBLE9BQUEsRUFBQSxTQUFBLEtBQUEsVUFBQSxHQUFBO09BQ0EsT0FBQSxXQUFBLEdBQUE7OztLQUdBLE9BQUE7OztJQUdBLFNBQUEsU0FBQSxHQUFBOzs7S0FHQSxJQUFBLEVBQUE7TUFDQSxPQUFBLEVBQUE7VUFDQTtNQUNBLE9BQUE7Ozs7Ozs7Ozs7OztJQVlBLFNBQUEsU0FBQSxHQUFBO0tBQ0EsSUFBQSxLQUFBLEtBQUE7TUFDQSxLQUFBLEdBQUEsWUFBQSxFQUFBLFVBQUEsQ0FBQSxFQUFBLEdBQUEsRUFBQSxJQUFBLEVBQUEsS0FBQTtNQUNBLEtBQUEsR0FBQSxZQUFBLEVBQUEsVUFBQSxDQUFBLEVBQUEsR0FBQTtNQUNBLEtBQUEsR0FBQSxZQUFBLEVBQUEsU0FBQSxDQUFBLEVBQUEsSUFBQSxLQUFBLEdBQUE7O0tBRUEsT0FBQSxVQUFBLEdBQUE7TUFDQSxPQUFBLFVBQUEsR0FBQTtPQUNBLEVBQUEsT0FBQSxHQUFBO09BQ0EsRUFBQSxPQUFBLEdBQUEsSUFBQSxNQUFBLEdBQUE7T0FDQSxPQUFBLElBQUE7Ozs7O0lBS0EsU0FBQSxLQUFBLEdBQUE7S0FDQSxPQUFBLEVBQUEsV0FBQSxLQUFBLElBQUEsTUFBQSxNQUFBLEVBQUEsU0FBQSxJQUFBLFNBQUEsRUFBQSxJQUFBLEVBQUE7Ozs7Ozs7QUN4UEEsQ0FBQSxZQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsMkJBQUEsVUFBQSxRQUFBOztFQUVBLE9BQUEsV0FBQSxZQUFBO0dBQ0EsT0FBQSxRQUFBO0lBQ0EsU0FBQTtLQUNBLE9BQUE7TUFDQSxNQUFBO01BQ0EsUUFBQTtNQUNBLFlBQUE7T0FDQSxZQUFBO09BQ0EsU0FBQTtPQUNBLFVBQUE7T0FDQSxRQUFBO09BQ0EsTUFBQTtPQUNBLFlBQUE7T0FDQSxVQUFBO1FBQ0EsT0FBQTtRQUNBLFNBQUE7UUFDQSxVQUFBO1FBQ0EsUUFBQTs7O01BR0EsV0FBQTtPQUNBLFlBQUE7T0FDQSxXQUFBO09BQ0EsWUFBQTtPQUNBLGdCQUFBO09BQ0EsV0FBQTtPQUNBLGtCQUFBO09BQ0EsWUFBQTtPQUNBLFdBQUE7T0FDQSxhQUFBO09BQ0EsaUJBQUE7O09BRUEsVUFBQTtRQUNBLFFBQUE7UUFDQSxPQUFBOztPQUVBLFVBQUE7T0FDQSxRQUFBO09BQ0EsZUFBQTtPQUNBLE1BQUE7Ozs7SUFJQSxNQUFBOztHQUVBLE9BQUEsT0FBQTs7RUFFQSxJQUFBLFlBQUEsVUFBQSxNQUFBO0dBQ0EsSUFBQSxXQUFBO0dBQ0EsUUFBQSxRQUFBLE1BQUEsVUFBQSxNQUFBO0lBQ0EsSUFBQSxRQUFBO0tBQ0EsUUFBQSxLQUFBO0tBQ0EsUUFBQSxLQUFBO0tBQ0EsU0FBQSxLQUFBO0tBQ0EsWUFBQSxVQUFBLEtBQUE7O0lBRUEsR0FBQSxLQUFBLE1BQUE7S0FDQSxNQUFBLFFBQUEsS0FBQTs7SUFFQSxHQUFBLEtBQUEsS0FBQTtLQUNBLE1BQUEsT0FBQSxLQUFBOztJQUVBLFNBQUEsS0FBQTs7R0FFQSxPQUFBOztFQUVBLE9BQUEsaUJBQUEsWUFBQTtHQUNBLElBQUEsWUFBQTtJQUNBLFFBQUEsT0FBQSxLQUFBO0lBQ0EsU0FBQSxPQUFBLEtBQUEsTUFBQSxjQUFBO0lBQ0EsWUFBQSxVQUFBLE9BQUEsS0FBQTtJQUNBLFFBQUE7O0dBRUEsT0FBQSxNQUFBLE9BQUE7R0FDQSxPQUFBOztFQUVBLE9BQUEsT0FBQSxRQUFBLFVBQUEsR0FBQSxHQUFBO0dBQ0EsSUFBQSxDQUFBLEdBQUE7SUFDQTs7R0FFQSxPQUFBOzs7Ozs7QUNyRkEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGtCQUFBLFdBQUEsZ0NBQUEsU0FBQSxpQkFBQTs7RUFFQSxPQUFBO0dBQ0EsVUFBQTtHQUNBLGFBQUE7R0FDQSxZQUFBO0dBQ0EsY0FBQTtHQUNBLE1BQUE7R0FDQSxrQkFBQTtJQUNBLE9BQUE7SUFDQSxNQUFBO0lBQ0EsUUFBQTs7R0FFQSxRQUFBO0dBQ0EsU0FBQSxTQUFBLFNBQUE7WUFDQSxPQUFBLGdCQUFBLFFBQUEsU0FBQSxTQUFBLE9BQUEsVUFBQSxRQUFBLFlBQUEsYUFBQTs7Ozs7Ozs7Ozs7OztBQ2xCQSxDQUFBLFdBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSw0QkFBQSxTQUFBLFNBQUE7O0VBRUEsSUFBQSxLQUFBO0VBQ0EsR0FBQSxlQUFBO0VBQ0EsR0FBQSxnQkFBQTtFQUNBLEdBQUEsYUFBQTtFQUNBLEdBQUEsYUFBQTtFQUNBLEdBQUEsaUJBQUE7RUFDQSxHQUFBLGtCQUFBO0VBQ0EsR0FBQSxjQUFBOztFQUVBLFNBQUEsV0FBQSxPQUFBLE9BQUEsVUFBQSxNQUFBO0dBQ0EsUUFBQSxJQUFBLE9BQUEsT0FBQSxVQUFBO0dBQ0EsT0FBQTs7O0VBR0EsU0FBQSxlQUFBLE9BQUEsT0FBQSxNQUFBLFVBQUE7R0FDQSxRQUFBLElBQUEsT0FBQSxPQUFBLE1BQUE7R0FDQSxPQUFBOzs7RUFHQSxTQUFBLGdCQUFBLE9BQUEsTUFBQSxLQUFBOztHQUVBLE9BQUEsR0FBQSxNQUFBLE9BQUEsT0FBQTs7O0VBR0EsU0FBQSxZQUFBLE1BQUE7O0dBRUEsS0FBQSxXQUFBLENBQUE7SUFDQSxJQUFBO0lBQ0EsT0FBQTs7R0FFQSxLQUFBLFdBQUE7OztFQUdBLFNBQUEsYUFBQSxNQUFBO0dBQ0EsSUFBQSxPQUFBLEdBQUEsU0FBQSxhQUFBLE9BQUE7R0FDQSxJQUFBLFFBQUE7R0FDQSxRQUFBLFFBQUEsR0FBQSxLQUFBLEdBQUEsUUFBQSxPQUFBLFNBQUEsT0FBQSxLQUFBO0lBQ0EsSUFBQSxNQUFBLE1BQUEsS0FBQSxJQUFBO0tBQ0EsUUFBQTs7O0dBR0EsT0FBQTs7O0VBR0EsU0FBQSxjQUFBLFVBQUE7R0FDQSxJQUFBLFFBQUE7R0FDQSxRQUFBLFFBQUEsUUFBQSxXQUFBLFdBQUEsU0FBQSxPQUFBO0lBQ0EsSUFBQSxhQUFBLFFBQUE7S0FDQSxRQUFBOzs7R0FHQSxPQUFBOzs7RUFHQSxTQUFBLFdBQUEsTUFBQTtHQUNBLElBQUEsT0FBQSxHQUFBLEtBQUEsR0FBQSxRQUFBLFVBQUEsYUFBQSxHQUFBLEtBQUEsR0FBQSxRQUFBLFFBQUE7R0FDQSxJQUFBLFFBQUE7SUFDQSxRQUFBLENBQUE7R0FDQSxRQUFBLFFBQUEsR0FBQSxLQUFBLEdBQUEsUUFBQSxPQUFBLFNBQUEsT0FBQSxHQUFBO0lBQ0EsSUFBQSxNQUFBLE1BQUEsS0FBQSxJQUFBO0tBQ0EsUUFBQTtLQUNBLFFBQUE7OztHQUdBLFVBQUEsQ0FBQSxJQUFBLEdBQUEsS0FBQSxHQUFBLFFBQUEsTUFBQSxLQUFBLFFBQUEsR0FBQSxLQUFBLEdBQUEsUUFBQSxNQUFBLE9BQUEsT0FBQTs7Ozs7QUNyRUEsQ0FBQSxXQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGtCQUFBLFVBQUEsVUFBQSxXQUFBOztFQUVBLE9BQUE7R0FDQSxVQUFBO0dBQ0EsYUFBQTtHQUNBLFlBQUE7R0FDQSxjQUFBO0dBQ0EsT0FBQTtHQUNBLGtCQUFBO0lBQ0EsT0FBQTtJQUNBLE1BQUE7SUFDQSxTQUFBOztHQUVBLFNBQUE7R0FDQSxNQUFBLFNBQUEsT0FBQSxTQUFBLE9BQUE7Ozs7Ozs7O0FDakJBLENBQUEsV0FBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLHlCQUFBLFNBQUEsUUFBQTs7RUFFQSxJQUFBLEtBQUE7RUFDQSxHQUFBLGNBQUE7RUFDQSxHQUFBLGNBQUE7O0VBRUE7O0VBRUEsU0FBQSxXQUFBO0dBQ0E7OztFQUdBLFNBQUEsWUFBQTtHQUNBLElBQUEsT0FBQSxHQUFBLEtBQUEsVUFBQSxhQUFBO0lBQ0EsUUFBQSxRQUFBLEdBQUEsT0FBQSxTQUFBLE9BQUE7S0FDQSxNQUFBLFNBQUEsTUFBQSxHQUFBLE1BQUE7Ozs7O0VBS0EsU0FBQSxhQUFBO0dBQ0EsSUFBQSxRQUFBLEdBQUEsS0FBQTtHQUNBLElBQUEsT0FBQSxDQUFBLE1BQUEsVUFBQSxHQUFBLE1BQUEsU0FBQTtHQUNBLFFBQUEsUUFBQSxHQUFBLE9BQUEsU0FBQSxPQUFBO0lBQ0EsSUFBQSxVQUFBLEdBQUEsTUFBQTtLQUNBLE1BQUEsU0FBQTs7O0dBR0EsT0FBQTs7O0VBR0EsU0FBQSxjQUFBO0dBQ0EsSUFBQSxHQUFBLEtBQUEsU0FBQSxLQUFBLEdBQUE7SUFDQSxHQUFBLEtBQUEsU0FBQSxJQUFBLEtBQUEsTUFBQSxHQUFBLEtBQUEsU0FBQTtVQUNBO0lBQ0EsR0FBQSxLQUFBLFVBQUE7O0dBRUE7OztFQUdBLFNBQUEsY0FBQTtHQUNBLElBQUEsR0FBQSxLQUFBLFNBQUEsS0FBQSxHQUFBO0lBQ0EsR0FBQSxLQUFBLFNBQUEsSUFBQSxLQUFBLE1BQUEsR0FBQSxLQUFBLFNBQUEsS0FBQTtVQUNBO0lBQ0EsR0FBQSxLQUFBLFVBQUE7O0dBRUE7Ozs7Ozs7QUNqREEsQ0FBQSxZQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsaURBQUEsVUFBQSxhQUFBLG9CQUFBOztFQUVBLElBQUEsS0FBQTtFQUNBLElBQUEsU0FBQSxtQkFBQSxLQUFBOztFQUVBLEdBQUEsV0FBQTs7R0FFQSxRQUFBOztFQUVBLEdBQUEsU0FBQTtHQUNBLEtBQUE7R0FDQSxLQUFBO0dBQ0EsTUFBQTs7RUFFQSxHQUFBLFNBQUE7R0FDQSxZQUFBO0lBQ0EsS0FBQTtLQUNBLE1BQUE7S0FDQSxLQUFBLHNGQUFBO0tBQ0EsTUFBQTtLQUNBLGFBQUE7T0FDQSxRQUFBO09BQ0EsaUJBQUE7Ozs7OztFQU1BLEdBQUEsWUFBQTtHQUNBLFdBQUE7SUFDQSxLQUFBO0lBQ0EsS0FBQTs7R0FFQSxXQUFBO0lBQ0EsS0FBQSxDQUFBO0lBQ0EsS0FBQSxDQUFBOzs7RUFHQSxZQUFBLE9BQUEsT0FBQSxLQUFBLFVBQUEsS0FBQTtHQUNBLElBQUEsTUFBQSxxRUFBQSxtQkFBQSxZQUFBLCtDQUFBLG1CQUFBO0dBQ0EsSUFBQSxRQUFBLElBQUEsRUFBQSxVQUFBLFVBQUE7SUFDQSxLQUFBO0lBQ0EsT0FBQTtJQUNBLGlCQUFBLENBQUEsbUJBQUEsWUFBQTtJQUNBLGFBQUE7SUFDQSxzQkFBQSxVQUFBLFNBQUE7S0FDQSxPQUFBLFFBQUEsV0FBQTs7SUFFQSxRQUFBLFVBQUEsU0FBQSxTQUFBOztLQUVBLE9BQUE7OztHQUdBLElBQUEsU0FBQSxtQkFBQSxTQUFBO0dBQ0EsSUFBQSxjQUFBLEVBQUEsVUFBQSxtRkFBQSxPQUFBO01BQ0EsUUFBQTtNQUNBLGlCQUFBOztHQUVBLElBQUEsU0FBQTtHQUNBLFlBQUE7Ozs7QUFJQSIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0dmFyIGFwcCA9IGFuZ3VsYXIubW9kdWxlKCdhcHAnLFxuXHRcdFtcblx0XHQnYXBwLmNvbnRyb2xsZXJzJyxcblx0XHQnYXBwLmZpbHRlcnMnLFxuXHRcdCdhcHAuc2VydmljZXMnLFxuXHRcdCdhcHAuZGlyZWN0aXZlcycsXG5cdFx0J2FwcC5yb3V0ZXMnLFxuXHRcdCdhcHAuY29uZmlnJ1xuXHRcdF0pO1xuXG5cblx0XHRhbmd1bGFyLm1vZHVsZSgnYXBwLnJvdXRlcycsIFsndWkucm91dGVyJywgJ25nU3RvcmFnZScsICdzYXRlbGxpemVyJ10pO1xuXHRcdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnLCBbJ2RuZExpc3RzJywnYW5ndWxhci5maWx0ZXInLCdhbmd1bGFyTW9tZW50JywnbmdTY3JvbGxiYXInLCdtZENvbG9yUGlja2VyJywnbmdBbmltYXRlJywndWkudHJlZScsJ3RvYXN0cicsJ3VpLnJvdXRlcicsICdtZC5kYXRhLnRhYmxlJywgJ25nTWF0ZXJpYWwnLCAnbmdTdG9yYWdlJywgJ3Jlc3Rhbmd1bGFyJywgJ25nTWRJY29ucycsICdhbmd1bGFyLWxvYWRpbmctYmFyJywgJ25nTWVzc2FnZXMnLCAnbmdTYW5pdGl6ZScsIFwibGVhZmxldC1kaXJlY3RpdmVcIiwnbnZkMyddKTtcblx0XHRhbmd1bGFyLm1vZHVsZSgnYXBwLmZpbHRlcnMnLCBbXSk7XG5cdFx0YW5ndWxhci5tb2R1bGUoJ2FwcC5zZXJ2aWNlcycsIFsnYW5ndWxhci1jYWNoZScsJ3VpLnJvdXRlcicsICduZ1N0b3JhZ2UnLCAncmVzdGFuZ3VsYXInLCAndG9hc3RyJ10pO1xuXHRcdGFuZ3VsYXIubW9kdWxlKCdhcHAuZGlyZWN0aXZlcycsIFsnbmdNYXRlcmlhbCcsJ25nUGFwYVBhcnNlJ10pO1xuXHRcdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29uZmlnJywgW10pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5yb3V0ZXMnKS5jb25maWcoZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIsICRsb2NhdGlvblByb3ZpZGVyKSB7XG5cdC8vXHQkbG9jYXRpb25Qcm92aWRlci5odG1sNU1vZGUodHJ1ZSk7XG5cdFx0dmFyIGdldFZpZXcgPSBmdW5jdGlvbiAodmlld05hbWUpIHtcblx0XHRcdHJldHVybiAnL3ZpZXdzL2FwcC8nICsgdmlld05hbWUgKyAnLycgKyB2aWV3TmFtZSArICcuaHRtbCc7XG5cdFx0fTtcblxuXHRcdCR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UoJy8nKTtcblxuXHRcdCRzdGF0ZVByb3ZpZGVyXG5cdFx0XHQuc3RhdGUoJ2FwcCcsIHtcblx0XHRcdFx0YWJzdHJhY3Q6IHRydWUsXG5cdFx0XHRcdHZpZXdzOiB7XG5cdFx0XHRcdFx0aGVhZGVyOiB7XG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogZ2V0VmlldygnaGVhZGVyJyksXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiAnSGVhZGVyQ3RybCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyQXM6ICd2bSdcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdG1haW46IHt9LFxuXHRcdFx0XHRcdCdtYXBAJzoge1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6IGdldFZpZXcoJ21hcCcpLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlcjogJ01hcEN0cmwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlckFzOiAndm0nXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdFx0LnN0YXRlKCdhcHAuaG9tZScse1xuXHRcdFx0XHR1cmw6Jy8nLFxuXHRcdFx0XHR2aWV3czp7XG5cdFx0XHRcdFx0J3NpZGViYXJAJzp7XG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogZ2V0VmlldygnaG9tZScpLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlcjogJ0hvbWVDdHJsJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLnVzZXInLCB7XG5cdFx0XHRcdHVybDogJy91c2VyJyxcblx0XHRcdFx0YWJzdHJhY3Q6IHRydWVcblxuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLnVzZXIubG9naW4nLCB7XG5cdFx0XHRcdHVybDogJy9sb2dpbicsXG5cdFx0XHRcdHZpZXdzOiB7XG5cdFx0XHRcdFx0J21haW5AJzoge1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6IGdldFZpZXcoJ2xvZ2luJyksXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiAnTG9naW5DdHJsJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdH0pXG5cdFx0XHQuc3RhdGUoJ2FwcC51c2VyLnByb2ZpbGUnLCB7XG5cdFx0XHRcdHVybDogJy9teS1wcm9maWxlJyxcblx0XHRcdFx0YXV0aDp0cnVlLFxuXHRcdFx0XHR2aWV3czoge1xuXHRcdFx0XHRcdCdtYWluQCc6IHtcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiBnZXRWaWV3KCd1c2VyJyksXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiAnVXNlckN0cmwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlckFzOiAndm0nLFxuXHRcdFx0XHRcdFx0cmVzb2x2ZToge1xuXHRcdFx0XHRcdFx0XHRwcm9maWxlOiBmdW5jdGlvbiAoRGF0YVNlcnZpY2UsICRhdXRoKSB7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIERhdGFTZXJ2aWNlLmdldE9uZSgnbWUnKS4kb2JqZWN0O1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdH0pXG5cdFx0XHQuc3RhdGUoJ2FwcC5pbmRleCcsIHtcblx0XHRcdFx0YWJzdHJhY3Q6IHRydWUsXG5cdFx0XHRcdHVybDogJy9pbmRleCdcblxuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLmluZGV4Lm15ZGF0YScsIHtcblx0XHRcdFx0dXJsOicvbXktZGF0YScsXG5cdFx0XHRcdGF1dGg6dHJ1ZSxcblx0XHRcdFx0dmlld3M6e1xuXHRcdFx0XHRcdCdzaWRlYmFyQCc6e1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6Jy92aWV3cy9hcHAvaW5kZXhNeURhdGEvaW5kZXhNeURhdGFNZW51Lmh0bWwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlcjogJ0luZGV4TXlEYXRhTWVudUN0cmwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlckFzOiAndm0nXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHQnbWFpbkAnOntcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOmdldFZpZXcoJ2luZGV4TXlEYXRhJyksXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiAnSW5kZXhNeURhdGFDdHJsJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLmluZGV4Lm15ZGF0YS5lbnRyeScsIHtcblx0XHRcdFx0dXJsOicvOm5hbWUnLFxuXHRcdFx0XHRhdXRoOnRydWUsXG5cdFx0XHRcdHZpZXdzOntcblx0XHRcdFx0XHQnc2lkZWJhckAnOntcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOicvdmlld3MvYXBwL2luZGV4TXlEYXRhL2luZGV4TXlEYXRhTWVudS5odG1sJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdJbmRleE15RGF0YU1lbnVDdHJsJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0J21haW5AJzp7XG5cdFx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOicvdmlld3MvYXBwL2luZGV4TXlEYXRhL2luZGV4TXlEYXRhRW50cnkuaHRtbCcsXG5cdFx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdJbmRleE15RGF0YUVudHJ5Q3RybCcsXG5cdFx0XHRcdFx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLmluZGV4LmVkaXRvcicse1xuXHRcdFx0XHR1cmw6ICcvZWRpdG9yJyxcblx0XHRcdFx0YXV0aDp0cnVlLFxuXHRcdFx0XHR2aWV3czoge1xuXHRcdFx0XHRcdCdzaWRlYmFyQCc6IHtcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdpbmRleGVkaXRvcicpLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlcjogJ0luZGV4ZWRpdG9yQ3RybCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyQXM6ICd2bScsXG5cdFx0XHRcdFx0XHRyZXNvbHZlOntcblx0XHRcdFx0XHRcdFx0aW5kaWNhdG9yczpmdW5jdGlvbihDb250ZW50U2VydmljZSl7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIENvbnRlbnRTZXJ2aWNlLmZldGNoSW5kaWNhdG9ycyh7cGFnZToxLCBvcmRlcjondGl0bGUnLCBsaW1pdDoyNSwgZGlyOiAnQVNDJ30pO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdC8qdmlld3M6e1xuXHRcdFx0XHRcdCdpbmZvJzp7XG5cblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdCdtZW51Jzp7XG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDpnZXRWaWV3KCdpbmRleGVkaXRvcicpLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlcjogJ0luZGV4ZWRpdG9yQ3RybCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyQXM6ICd2bSdcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0qL1xuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLmluZGV4LmVkaXRvci5pbmRpY2F0b3InLHtcblx0XHRcdFx0dXJsOiAnLzppZCcsXG5cdFx0XHRcdGF1dGg6dHJ1ZSxcblx0XHRcdFx0bGF5b3V0OiAncm93Jyxcblx0XHRcdFx0dmlld3M6IHtcblx0XHRcdFx0XHQnbWFpbkAnOiB7XG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDonL3ZpZXdzL2FwcC9pbmRleGVkaXRvci9pbmRleGVkaXRvcmluZGljYXRvci5odG1sJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdJbmRleGVkaXRvcmluZGljYXRvckN0cmwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlckFzOiAndm0nLFxuXHRcdFx0XHRcdFx0cmVzb2x2ZTp7XG5cdFx0XHRcdFx0XHRcdGluZGljYXRvcjpmdW5jdGlvbihDb250ZW50U2VydmljZSwgJHN0YXRlUGFyYW1zKXtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gQ29udGVudFNlcnZpY2UuZ2V0SW5kaWNhdG9yKCRzdGF0ZVBhcmFtcy5pZClcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHQvKnZpZXdzOntcblx0XHRcdFx0XHQnaW5mbyc6e1xuXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHQnbWVudSc6e1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6Z2V0VmlldygnaW5kZXhlZGl0b3InKSxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdJbmRleGVkaXRvckN0cmwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlckFzOiAndm0nXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9Ki9cblx0XHRcdH0pXG5cdFx0XHQuc3RhdGUoJ2FwcC5pbmRleC5lZGl0b3IuaW5kaWNhdG9yLmRldGFpbHMnLHtcblx0XHRcdFx0dXJsOiAnLzplbnRyeScsXG5cdFx0XHRcdGF1dGg6dHJ1ZSxcblx0XHRcdFx0bGF5b3V0Oidyb3cnXG5cdFx0XHR9KVxuXHRcdFx0LnN0YXRlKCdhcHAuaW5kZXguY3JlYXRlJywge1xuXHRcdFx0XHR1cmw6ICcvY3JlYXRlJyxcblx0XHRcdFx0YXV0aDp0cnVlLFxuXHRcdFx0XHR2aWV3czoge1xuXHRcdFx0XHRcdCdzaWRlYmFyQCc6IHtcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdpbmRleGNyZWF0b3InKSxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdJbmRleGNyZWF0b3JDdHJsJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLmluZGV4LmNyZWF0ZS5iYXNpYycsIHtcblx0XHRcdFx0dXJsOiAnL2Jhc2ljJyxcblx0XHRcdFx0YXV0aDp0cnVlXG5cdFx0XHR9KVxuXHRcdFx0LnN0YXRlKCdhcHAuaW5kZXguY2hlY2snLCB7XG5cdFx0XHRcdHVybDogJy9jaGVja2luZycsXG5cdFx0XHRcdGF1dGg6dHJ1ZSxcblx0XHRcdFx0dmlld3M6e1xuXHRcdFx0XHRcdCdtYWluQCc6e1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6Z2V0VmlldygnaW5kZXhDaGVjaycpLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlcjogJ0luZGV4Q2hlY2tDdHJsJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0J3NpZGViYXJAJzoge1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICcvdmlld3MvYXBwL2luZGV4Q2hlY2svaW5kZXhDaGVja1NpZGViYXIuaHRtbCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiAnSW5kZXhDaGVja1NpZGViYXJDdHJsJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLmluZGV4Lm1ldGEnLCB7XG5cdFx0XHRcdHVybDogJy9hZGRpbmctbWV0YS1kYXRhJyxcblx0XHRcdFx0YXV0aDp0cnVlLFxuXHRcdFx0XHRsYXlvdXQ6J3JvdycsXG5cdFx0XHRcdHZpZXdzOntcblx0XHRcdFx0XHQnbWFpbkAnOntcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOmdldFZpZXcoJ2luZGV4TWV0YScpLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlcjogJ0luZGV4TWV0YUN0cmwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlckFzOiAndm0nXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHQnc2lkZWJhckAnOntcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiAnL3ZpZXdzL2FwcC9pbmRleE1ldGEvaW5kZXhNZXRhTWVudS5odG1sJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdJbmRleE1ldGFNZW51Q3RybCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyQXM6ICd2bSdcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cdFx0XHQuc3RhdGUoJ2FwcC5pbmRleC5maW5hbCcsIHtcblx0XHRcdFx0dXJsOiAnL2ZpbmFsJyxcblx0XHRcdFx0YXV0aDp0cnVlLFxuXHRcdFx0XHRsYXlvdXQ6J3JvdycsXG5cdFx0XHRcdHZpZXdzOntcblx0XHRcdFx0XHQnbWFpbkAnOntcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOmdldFZpZXcoJ2luZGV4RmluYWwnKSxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdJbmRleEZpbmFsQ3RybCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyQXM6ICd2bSdcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdCdzaWRlYmFyQCc6e1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICcvdmlld3MvYXBwL2luZGV4RmluYWwvaW5kZXhGaW5hbE1lbnUuaHRtbCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiAnSW5kZXhGaW5hbE1lbnVDdHJsJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLmluZGV4LnNob3cnLCB7XG5cdFx0XHRcdHVybDogJy86aW5kZXgnLFxuXHRcdFx0XHR2aWV3czoge1xuXHRcdFx0XHRcdCdzaWRlYmFyQCc6IHtcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiAnL3ZpZXdzL2FwcC9pbmRleC9pbmZvLmh0bWwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlcjogJ0luZGV4Q3RybCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyQXM6ICd2bScsXG5cdFx0XHRcdFx0XHRyZXNvbHZlOiB7XG5cdFx0XHRcdFx0XHRcdGRhdGE6IGZ1bmN0aW9uIChJbmRpemVzU2VydmljZSwgJHN0YXRlUGFyYW1zKSB7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIEluZGl6ZXNTZXJ2aWNlLmZldGNoRGF0YSgkc3RhdGVQYXJhbXMuaW5kZXgpO1xuXHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHRjb3VudHJpZXM6IGZ1bmN0aW9uKENvdW50cmllc1NlcnZpY2Upe1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBDb3VudHJpZXNTZXJ2aWNlLmdldERhdGEoKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0J3NlbGVjdGVkJzoge1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICcvdmlld3MvYXBwL2luZGV4L3NlbGVjdGVkLmh0bWwnLFxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLmluZGV4LnNob3cuaW5mbycsIHtcblx0XHRcdFx0IHVybDonL2luZm8nLFxuXHRcdFx0XHQgdmlld3M6e1xuXHRcdFx0XHRcdCAnbWFpbkAnOntcblx0XHRcdFx0XHRcdCBjb250cm9sbGVyOidJbmRleGluZm9DdHJsJyxcblx0XHRcdFx0XHRcdCBjb250cm9sbGVyQXM6ICd2bScsXG5cdFx0XHRcdFx0XHQgXHR0ZW1wbGF0ZVVybDpnZXRWaWV3KCdpbmRleGluZm8nKVxuXHRcdFx0XHRcdCB9XG5cdFx0XHRcdCB9XG5cdFx0XHR9KVxuXHRcdFx0LnN0YXRlKCdhcHAuaW5kZXguc2hvdy5zZWxlY3RlZCcsIHtcblx0XHRcdFx0dXJsOiAnLzppdGVtJyxcblx0XHRcdFx0Lyp2aWV3czp7XG5cdFx0XHRcdFx0J3NlbGVjdGVkJzp7XG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogZ2V0Vmlldygnc2VsZWN0ZWQnKSxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdTZWxlY3RlZEN0cmwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlckFzOiAndm0nLFxuXHRcdFx0XHRcdFx0cmVzb2x2ZTp7XG5cdFx0XHRcdFx0XHRcdGdldENvdW50cnk6IGZ1bmN0aW9uKERhdGFTZXJ2aWNlLCAkc3RhdGVQYXJhbXMpe1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBEYXRhU2VydmljZS5nZXRPbmUoJ25hdGlvbnMnLCAkc3RhdGVQYXJhbXMuaXRlbSkuJG9iamVjdDtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSovXG5cdFx0XHR9KVxuXHRcdFx0LnN0YXRlKCdhcHAuaW5kZXguc2hvdy5zZWxlY3RlZC5jb21wYXJlJywge1xuXHRcdFx0XHR1cmw6ICcvY29tcGFyZS86Y291bnRyaWVzJ1xuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLmltcG9ydGNzdicsIHtcblx0XHRcdFx0dXJsOiAnL2ltcG9ydGVyJyxcblx0XHRcdFx0ZGF0YToge1xuXHRcdFx0XHRcdHBhZ2VOYW1lOiAnSW1wb3J0IENTVidcblx0XHRcdFx0fSxcblx0XHRcdFx0dmlld3M6IHtcblx0XHRcdFx0XHQnbWFpbkAnOiB7XG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogZ2V0VmlldygnaW1wb3J0Y3N2Jylcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdCdtYXAnOiB7fVxuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXG5cblx0fSk7XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAucm91dGVzJykucnVuKGZ1bmN0aW9uKCRyb290U2NvcGUsICRtZFNpZGVuYXYsICR0aW1lb3V0LCAkYXV0aCwgJHN0YXRlLCRsb2NhbFN0b3JhZ2UsbGVhZmxldERhdGEsIHRvYXN0cil7XG5cdFx0JHJvb3RTY29wZS5zaWRlYmFyT3BlbiA9IHRydWU7XG5cdFx0JHJvb3RTY29wZS5sb29zZUxheW91dCA9ICRsb2NhbFN0b3JhZ2UuZnVsbFZpZXcgfHwgZmFsc2U7XG5cblx0XHQkcm9vdFNjb3BlLiRvbihcIiRzdGF0ZUNoYW5nZVN0YXJ0XCIsIGZ1bmN0aW9uKGV2ZW50LCB0b1N0YXRlLCB0b1BhcmFtcywgZnJvbVN0YXRlLGZyb21QYXJhbXMpe1xuXHRcdFx0aWYgKHRvU3RhdGUuYXV0aCAmJiAhJGF1dGguaXNBdXRoZW50aWNhdGVkKCkpe1xuXHRcdFx0XHR0b2FzdHIuZXJyb3IoJ1lvdXIgbm90IGFsbG93ZWQgdG8gZ28gdGhlcmUgYnVkZHkhJywgJ0FjY2VzcyBkZW5pZWQnKTtcblx0XHQgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHQgICAgcmV0dXJuICRzdGF0ZS5nbygnYXBwLmhvbWUnKTtcblx0XHQgIH1cblx0XHRcdGlmICh0b1N0YXRlLmRhdGEgJiYgdG9TdGF0ZS5kYXRhLnBhZ2VOYW1lKXtcblx0XHRcdFx0JHJvb3RTY29wZS5jdXJyZW50X3BhZ2UgPSB0b1N0YXRlLmRhdGEucGFnZU5hbWU7XG5cdFx0XHR9XG5cdFx0XHRpZih0b1N0YXRlLmxheW91dCA9PSBcInJvd1wiKXtcblx0XHRcdFx0JHJvb3RTY29wZS5yb3dlZCA9IHRydWU7XG5cdFx0XHR9XG5cdFx0XHRlbHNle1xuXHRcdFx0XHQkcm9vdFNjb3BlLnJvd2VkID0gZmFsc2U7XG5cdFx0XHR9XG5cdFx0XHQkcm9vdFNjb3BlLnByZXZpb3VzUGFnZSA9IHtzdGF0ZTpmcm9tU3RhdGUsIHBhcmFtczpmcm9tUGFyYW1zfTtcblx0XHRcdCRyb290U2NvcGUuc3RhdGVJc0xvYWRpbmcgPSB0cnVlO1xuXHRcdH0pO1xuXHRcdCRyb290U2NvcGUuJG9uKFwiJHZpZXdDb250ZW50TG9hZGVkXCIsIGZ1bmN0aW9uKGV2ZW50LCB0b1N0YXRlKXtcblxuXHRcdH0pO1xuXG5cdFx0JHJvb3RTY29wZS4kb24oXCIkc3RhdGVDaGFuZ2VTdWNjZXNzXCIsIGZ1bmN0aW9uKGV2ZW50LCB0b1N0YXRlKXtcblx0XHRcdCRyb290U2NvcGUuc3RhdGVJc0xvYWRpbmcgPSBmYWxzZTtcblx0XHRcdHJlc2V0TWFwU2l6ZSgpO1xuXHRcdH0pO1xuXG5cdFx0ZnVuY3Rpb24gcmVzZXRNYXBTaXplKCl7XG5cdFx0XHQkdGltZW91dChmdW5jdGlvbigpe1xuXHRcdFx0XHRsZWFmbGV0RGF0YS5nZXRNYXAoJ21hcCcpLnRoZW4oZnVuY3Rpb24gKG1hcCkge1xuXHRcdFx0XHRcdG1hcC5pbnZhbGlkYXRlU2l6ZSgpO1xuXHRcdFx0XHR9KVxuXHRcdFx0fSwgMTAwMCk7XG5cdFx0fVxuXHR9KTtcbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbmZpZycpLmNvbmZpZyhmdW5jdGlvbiAoJGF1dGhQcm92aWRlcikge1xuXHRcdC8vIFNhdGVsbGl6ZXIgY29uZmlndXJhdGlvbiB0aGF0IHNwZWNpZmllcyB3aGljaCBBUElcblx0XHQvLyByb3V0ZSB0aGUgSldUIHNob3VsZCBiZSByZXRyaWV2ZWQgZnJvbVxuXHRcdCRhdXRoUHJvdmlkZXIubG9naW5VcmwgPSAnL2FwaS9hdXRoZW50aWNhdGUvYXV0aCc7XG4gICAgJGF1dGhQcm92aWRlci5zaWdudXBVcmwgPSAnL2FwaS9hdXRoZW50aWNhdGUvYXV0aC9zaWdudXAnO1xuICAgICRhdXRoUHJvdmlkZXIudW5saW5rVXJsID0gJy9hcGkvYXV0aGVudGljYXRlL2F1dGgvdW5saW5rLyc7XG5cdFx0JGF1dGhQcm92aWRlci5mYWNlYm9vayh7XG5cdFx0XHR1cmw6ICcvYXBpL2F1dGhlbnRpY2F0ZS9mYWNlYm9vaycsXG5cdFx0XHRjbGllbnRJZDogJzc3MTk2MTgzMjkxMDA3Midcblx0XHR9KTtcblx0XHQkYXV0aFByb3ZpZGVyLmdvb2dsZSh7XG5cdFx0XHR1cmw6ICcvYXBpL2F1dGhlbnRpY2F0ZS9nb29nbGUnLFxuXHRcdFx0Y2xpZW50SWQ6ICcyNzY2MzQ1Mzc0NDAtY2d0dDE0cWoyZThpbnAwdnE1b3E5YjQ2azc0ampzM2UuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20nXG5cdFx0fSk7XG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbmZpZycpLmNvbmZpZyhmdW5jdGlvbiAoY2ZwTG9hZGluZ0JhclByb3ZpZGVyKXtcblx0XHRjZnBMb2FkaW5nQmFyUHJvdmlkZXIuaW5jbHVkZVNwaW5uZXIgPSBmYWxzZTtcblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb25maWcnKS5jb25maWcoIGZ1bmN0aW9uKFJlc3Rhbmd1bGFyUHJvdmlkZXIpIHtcblx0XHRSZXN0YW5ndWxhclByb3ZpZGVyXG5cdFx0LnNldEJhc2VVcmwoJy9hcGkvJylcblx0XHQuc2V0RGVmYXVsdEhlYWRlcnMoeyBhY2NlcHQ6IFwiYXBwbGljYXRpb24veC5sYXJhdmVsLnYxK2pzb25cIiB9KVxuXHRcdC5hZGRSZXNwb25zZUludGVyY2VwdG9yKGZ1bmN0aW9uKGRhdGEsb3BlcmF0aW9uLHdoYXQsdXJsLHJlc3BvbnNlLGRlZmVycmVkKSB7XG4gICAgICAgIHZhciBleHRyYWN0ZWREYXRhO1xuICAgICAgICBleHRyYWN0ZWREYXRhID0gZGF0YS5kYXRhO1xuICAgICAgICBpZiAoZGF0YS5tZXRhKSB7XG4gICAgICAgICAgICBleHRyYWN0ZWREYXRhLl9tZXRhID0gZGF0YS5tZXRhO1xuICAgICAgICB9XG4gICAgICAgIGlmIChkYXRhLmluY2x1ZGVkKSB7IFxuICAgICAgICAgICAgZXh0cmFjdGVkRGF0YS5faW5jbHVkZWQgPSBkYXRhLmluY2x1ZGVkO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBleHRyYWN0ZWREYXRhO1xuICAgIH0pO1xuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbmZpZycpLmNvbmZpZyhmdW5jdGlvbigkbWRUaGVtaW5nUHJvdmlkZXIpIHtcblx0XHQvKiBGb3IgbW9yZSBpbmZvLCB2aXNpdCBodHRwczovL21hdGVyaWFsLmFuZ3VsYXJqcy5vcmcvIy9UaGVtaW5nLzAxX2ludHJvZHVjdGlvbiAqL1xuLypcdHZhciBuZW9uVGVhbE1hcCA9ICRtZFRoZW1pbmdQcm92aWRlci5leHRlbmRQYWxldHRlKCd0ZWFsJywge1xuICAgICc1MDAnOiAnMDBjY2FhJyxcblx0XHQnQTIwMCc6ICcwMGNjYWEnXG4gIH0pO1xuXHR2YXIgd2hpdGVNYXAgPSAkbWRUaGVtaW5nUHJvdmlkZXIuZXh0ZW5kUGFsZXR0ZSgndGVhbCcsIHtcbiAgICAnNTAwJzogJzAwY2NhYScsXG5cdFx0J0EyMDAnOiAnI2ZmZidcbiAgfSk7XG5cdHZhciBibHVlTWFwID0gJG1kVGhlbWluZ1Byb3ZpZGVyLmV4dGVuZFBhbGV0dGUoJ2JsdWUnLCB7XG4gICAgJzUwMCc6ICcjMDA2YmI5Jyxcblx0XHQnQTIwMCc6ICcjMDA2YmI5J1xuICB9KTtcblx0JG1kVGhlbWluZ1Byb3ZpZGVyLmRlZmluZVBhbGV0dGUoJ25lb25UZWFsJywgbmVvblRlYWxNYXApO1xuXHQkbWRUaGVtaW5nUHJvdmlkZXIuZGVmaW5lUGFsZXR0ZSgnd2hpdGVUZWFsJywgd2hpdGVNYXApO1xuXHQkbWRUaGVtaW5nUHJvdmlkZXIuZGVmaW5lUGFsZXR0ZSgnYmx1ZXInLCBibHVlTWFwKTtcblx0XHQkbWRUaGVtaW5nUHJvdmlkZXIudGhlbWUoJ2RlZmF1bHQnKVxuXHRcdC5wcmltYXJ5UGFsZXR0ZSgnbGlnaHQtYmx1ZScpXG5cdFx0LmFjY2VudFBhbGV0dGUoJ2JsdWVyJyk7Ki9cblx0XHR2YXIgYmx1ZU1hcCA9ICRtZFRoZW1pbmdQcm92aWRlci5leHRlbmRQYWxldHRlKCdpbmRpZ28nLCB7XG5cdFx0XHQnNTAwJzogJyMwMDZiYjknLFxuXHRcdFx0J0EyMDAnOiAnIzAwNmJiOSdcblx0XHR9KTtcblx0XHRcdCRtZFRoZW1pbmdQcm92aWRlci5kZWZpbmVQYWxldHRlKCdibHVlcicsIGJsdWVNYXApO1xuXG5cdFx0JG1kVGhlbWluZ1Byb3ZpZGVyLnRoZW1lKCdkZWZhdWx0Jylcblx0XHQucHJpbWFyeVBhbGV0dGUoJ2JsdWVyJylcblx0XHQuYWNjZW50UGFsZXR0ZSgnZ3JleScpXG5cdFx0Lndhcm5QYWxldHRlKCdyZWQnKTtcblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29uZmlnJykuY29uZmlnKGZ1bmN0aW9uKHRvYXN0ckNvbmZpZyl7XG4gICAgICAgIC8vXG4gICAgICAgIGFuZ3VsYXIuZXh0ZW5kKHRvYXN0ckNvbmZpZywge1xuICAgICAgICAgIGF1dG9EaXNtaXNzOiBmYWxzZSxcbiAgICAgICAgICBjb250YWluZXJJZDogJ3RvYXN0LWNvbnRhaW5lcicsXG4gICAgICAgICAgbWF4T3BlbmVkOiAwLFxuICAgICAgICAgIG5ld2VzdE9uVG9wOiB0cnVlLFxuICAgICAgICAgIHBvc2l0aW9uQ2xhc3M6ICd0b2FzdC1ib3R0b20tcmlnaHQnLFxuICAgICAgICAgIHByZXZlbnREdXBsaWNhdGVzOiBmYWxzZSxcbiAgICAgICAgICBwcmV2ZW50T3BlbkR1cGxpY2F0ZXM6IGZhbHNlLFxuICAgICAgICAgIHRhcmdldDogJ2JvZHknLFxuICAgICAgICAgIGNsb3NlQnV0dG9uOiB0cnVlXG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmZpbHRlcnMnKS5maWx0ZXIoICdhbHBoYW51bScsIGZ1bmN0aW9uKCl7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiggaW5wdXQgKXtcbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICBpZiAoICFpbnB1dCApe1xuICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBpbnB1dC5yZXBsYWNlKC8oW14wLTlBLVpdKS9nLFwiXCIpO1xuXG4gICAgICAgIH1cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmZpbHRlcnMnKS5maWx0ZXIoICdjYXBpdGFsaXplJywgZnVuY3Rpb24oKXtcblx0XHRyZXR1cm4gZnVuY3Rpb24oaW5wdXQsIGFsbCkge1xuXHRcdFx0cmV0dXJuICghIWlucHV0KSA/IGlucHV0LnJlcGxhY2UoLyhbXlxcV19dK1teXFxzLV0qKSAqL2csZnVuY3Rpb24odHh0KXtcblx0XHRcdFx0cmV0dXJuIHR4dC5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHR4dC5zdWJzdHIoMSkudG9Mb3dlckNhc2UoKTtcblx0XHRcdH0pIDogJyc7XG5cdFx0fTtcblx0fSk7XG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5maWx0ZXJzJykuZmlsdGVyKCdmaW5kYnluYW1lJywgZnVuY3Rpb24gKCkge1xuXHRcdHJldHVybiBmdW5jdGlvbiAoaW5wdXQsIG5hbWUsIGZpZWxkKSB7XG5cdFx0XHQvL1xuICAgICAgdmFyIGZvdW5kcyA9IFtdO1xuXHRcdFx0dmFyIGkgPSAwLFxuXHRcdFx0XHRsZW4gPSBpbnB1dC5sZW5ndGg7XG5cblx0XHRcdGZvciAoOyBpIDwgbGVuOyBpKyspIHtcblx0XHRcdFx0aWYgKGlucHV0W2ldW2ZpZWxkXS50b0xvd2VyQ2FzZSgpLmluZGV4T2YobmFtZS50b0xvd2VyQ2FzZSgpKSA+IC0xKSB7XG5cdFx0XHRcdFx0IGZvdW5kcy5wdXNoKGlucHV0W2ldKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGZvdW5kcztcblx0XHR9XG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZmlsdGVycycpLmZpbHRlciggJ2h1bWFuUmVhZGFibGUnLCBmdW5jdGlvbigpe1xuXHRcdHJldHVybiBmdW5jdGlvbiBodW1hbml6ZShzdHIpIHtcblx0XHRcdGlmICggIXN0ciApe1xuXHRcdFx0XHRyZXR1cm4gJyc7XG5cdFx0XHR9XG5cdFx0XHR2YXIgZnJhZ3MgPSBzdHIuc3BsaXQoJ18nKTtcblx0XHRcdGZvciAodmFyIGk9MDsgaTxmcmFncy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRmcmFnc1tpXSA9IGZyYWdzW2ldLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgZnJhZ3NbaV0uc2xpY2UoMSk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gZnJhZ3Muam9pbignICcpO1xuXHRcdH07XG5cdH0pO1xufSkoKTsiLCIoZnVuY3Rpb24oKXtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmZpbHRlcnMnKS5maWx0ZXIoJ3RydW5jYXRlQ2hhcmFjdGVycycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChpbnB1dCwgY2hhcnMsIGJyZWFrT25Xb3JkKSB7XG4gICAgICAgICAgICBpZiAoaXNOYU4oY2hhcnMpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGlucHV0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGNoYXJzIDw9IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaW5wdXQgJiYgaW5wdXQubGVuZ3RoID4gY2hhcnMpIHtcbiAgICAgICAgICAgICAgICBpbnB1dCA9IGlucHV0LnN1YnN0cmluZygwLCBjaGFycyk7XG5cbiAgICAgICAgICAgICAgICBpZiAoIWJyZWFrT25Xb3JkKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBsYXN0c3BhY2UgPSBpbnB1dC5sYXN0SW5kZXhPZignICcpO1xuICAgICAgICAgICAgICAgICAgICAvLyBHZXQgbGFzdCBzcGFjZVxuICAgICAgICAgICAgICAgICAgICBpZiAobGFzdHNwYWNlICE9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5wdXQgPSBpbnB1dC5zdWJzdHIoMCwgbGFzdHNwYWNlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHdoaWxlIChpbnB1dC5jaGFyQXQoaW5wdXQubGVuZ3RoLTEpID09PSAnICcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlucHV0ID0gaW5wdXQuc3Vic3RyKDAsIGlucHV0Lmxlbmd0aCAtIDEpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBpbnB1dCArICcuLi4nO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGlucHV0O1xuICAgICAgICB9O1xuICAgIH0pO1xufSkoKTsiLCIoZnVuY3Rpb24oKXtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmZpbHRlcnMnKS5maWx0ZXIoJ3RydW5jYXRlV29yZHMnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoaW5wdXQsIHdvcmRzKSB7XG4gICAgICAgICAgICBpZiAoaXNOYU4od29yZHMpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGlucHV0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHdvcmRzIDw9IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaW5wdXQpIHtcbiAgICAgICAgICAgICAgICB2YXIgaW5wdXRXb3JkcyA9IGlucHV0LnNwbGl0KC9cXHMrLyk7XG4gICAgICAgICAgICAgICAgaWYgKGlucHV0V29yZHMubGVuZ3RoID4gd29yZHMpIHtcbiAgICAgICAgICAgICAgICAgICAgaW5wdXQgPSBpbnB1dFdvcmRzLnNsaWNlKDAsIHdvcmRzKS5qb2luKCcgJykgKyAnLi4uJztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gaW5wdXQ7XG4gICAgICAgIH07XG4gICAgfSk7XG59KSgpOyIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmZpbHRlcnMnKS5maWx0ZXIoICd0cnVzdEh0bWwnLCBmdW5jdGlvbiggJHNjZSApe1xuXHRcdHJldHVybiBmdW5jdGlvbiggaHRtbCApe1xuXHRcdFx0cmV0dXJuICRzY2UudHJ1c3RBc0h0bWwoaHRtbCk7XG5cdFx0fTtcblx0fSk7XG59KSgpOyIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmZpbHRlcnMnKS5maWx0ZXIoJ3VjZmlyc3QnLCBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gZnVuY3Rpb24oIGlucHV0ICkge1xuXHRcdFx0aWYgKCAhaW5wdXQgKXtcblx0XHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gaW5wdXQuc3Vic3RyaW5nKDAsIDEpLnRvVXBwZXJDYXNlKCkgKyBpbnB1dC5zdWJzdHJpbmcoMSk7XG5cdFx0fTtcblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuc2VydmljZXMnKS5mYWN0b3J5KCdWZWN0b3JsYXllclNlcnZpY2UnLCBmdW5jdGlvbigpe1xuXG4gICAgICAgIHJldHVybntcbiAgICAgICAgICBjYW52YXMgOiAnJyxcbiAgICAgICAgICBwYWxldHRlOiBbXSxcbiAgICAgICAgICBjdHg6ICcnLFxuICAgICAgICAgIGtleXM6e1xuICAgICAgICAgICAgbWF6cGVuOid2ZWN0b3ItdGlsZXMtUTNfT3M1dycsXG4gICAgICAgICAgICBtYXBib3g6J3BrLmV5SjFJam9pYldGbmJtOXNieUlzSW1FaU9pSnVTRmRVWWtnNEluMC41SE95a0trMHBOUDFOM2lzZlBRR1RRJ1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZGF0YTp7XG4gICAgICAgICAgICBsYXllcjogJycsXG4gICAgICAgICAgICBuYW1lOidjb3VudHJpZXNfYmlnJyxcbiAgICAgICAgICAgIGlzbzM6J2FkbTBfYTMnLFxuICAgICAgICAgICAgaXNvMjonaXNvX2EyJyxcbiAgICAgICAgICAgIGlzbzonaXNvX2EyJyxcbiAgICAgICAgICAgIGZpZWxkczogXCJpZCxhZG1pbixhZG0wX2EzLHdiX2EzLHN1X2EzLGlzb19hMyxpc29fYTIsbmFtZSxuYW1lX2xvbmdcIlxuICAgICAgICAgIH0sXG4gICAgICAgICAgc2V0TGF5ZXI6IGZ1bmN0aW9uKGwpe1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGF0YS5sYXllciA9IGw7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBnZXRMYXllcjogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmRhdGEubGF5ZXI7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBnZXROYW1lOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGF0YS5uYW1lO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZmllbGRzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmRhdGEuZmllbGRzO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgaXNvOmZ1bmN0aW9uKCl7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5kYXRhLmlzbztcbiAgICAgICAgICB9LFxuICAgICAgICAgIGlzbzM6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGF0YS5pc28zO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgaXNvMjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5kYXRhLmlzbzI7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBjcmVhdGVDYW52YXM6IGZ1bmN0aW9uKGNvbG9yKSB7XG4gICAgICBcdFx0XHR0aGlzLmNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuICAgICAgXHRcdFx0dGhpcy5jYW52YXMud2lkdGggPSAyODA7XG4gICAgICBcdFx0XHR0aGlzLmNhbnZhcy5oZWlnaHQgPSAxMDtcbiAgICAgIFx0XHRcdHRoaXMuY3R4ID0gdGhpcy5jYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcbiAgICAgIFx0XHRcdHZhciBncmFkaWVudCA9IHRoaXMuY3R4LmNyZWF0ZUxpbmVhckdyYWRpZW50KDAsIDAsIDI4MCwgMTApO1xuICAgICAgXHRcdFx0Z3JhZGllbnQuYWRkQ29sb3JTdG9wKDEsICdyZ2JhKDI1NSwyNTUsMjU1LDApJyk7XG4gICAgICBcdFx0XHRncmFkaWVudC5hZGRDb2xvclN0b3AoMC41MywgY29sb3IgfHwgICdyZ2JhKDEyOCwgMjQzLCAxOTgsMSknKTtcbiAgICAgIFx0XHRcdGdyYWRpZW50LmFkZENvbG9yU3RvcCgwLCAncmdiYSgxMDIsMTAyLDEwMiwxKScpO1xuICAgICAgXHRcdFx0dGhpcy5jdHguZmlsbFN0eWxlID0gZ3JhZGllbnQ7XG4gICAgICBcdFx0XHR0aGlzLmN0eC5maWxsUmVjdCgwLCAwLCAyODAsIDEwKTtcbiAgICAgIFx0XHRcdHRoaXMucGFsZXR0ZSA9IHRoaXMuY3R4LmdldEltYWdlRGF0YSgwLCAwLCAyNTcsIDEpLmRhdGE7XG4gICAgICBcdFx0XHQvL2RvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdib2R5JylbMF0uYXBwZW5kQ2hpbGQodGhpcy5jYW52YXMpO1xuICAgICAgXHRcdH0sXG4gICAgICBcdFx0dXBkYXRlQ2FudmFzOmZ1bmN0aW9uKGNvbG9yKSB7XG4gICAgICBcdFx0XHR2YXIgZ3JhZGllbnQgPSB0aGlzLmN0eC5jcmVhdGVMaW5lYXJHcmFkaWVudCgwLCAwLCAyODAsIDEwKTtcbiAgICAgIFx0XHRcdGdyYWRpZW50LmFkZENvbG9yU3RvcCgxLCAncmdiYSgyNTUsMjU1LDI1NSwwKScpO1xuICAgICAgXHRcdFx0Z3JhZGllbnQuYWRkQ29sb3JTdG9wKDAuNTMsIGNvbG9yIHx8ICdyZ2JhKDEyOCwgMjQzLCAxOTgsMSknICk7XG4gICAgICBcdFx0XHRncmFkaWVudC5hZGRDb2xvclN0b3AoMCwgJ3JnYmEoMTAyLDEwMiwxMDIsMSknKTtcbiAgICAgIFx0XHRcdHRoaXMuY3R4LmZpbGxTdHlsZSA9IGdyYWRpZW50O1xuICAgICAgXHRcdFx0dGhpcy5jdHguZmlsbFJlY3QoMCwgMCwgMjgwLCAxMCk7XG4gICAgICBcdFx0XHR0aGlzLnBhbGV0dGUgPSB0aGlzLmN0eC5nZXRJbWFnZURhdGEoMCwgMCwgMjU3LCAxKS5kYXRhO1xuICAgICAgXHRcdFx0Ly9kb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnYm9keScpWzBdLmFwcGVuZENoaWxkKHZtLmNhbnZhcyk7XG4gICAgICBcdFx0fSxcbiAgICAgICAgICBnZXRDb2xvcjogZnVuY3Rpb24odmFsdWUpe1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucGFsZXR0ZVt2YWx1ZV07XG4gICAgICAgICAgfVxuXG5cbiAgICAgICAgfVxuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLnNlcnZpY2VzJykuZmFjdG9yeSgnQ29udGVudFNlcnZpY2UnLCBmdW5jdGlvbihEYXRhU2VydmljZSl7XG4gICAgICAgIC8vXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgY29udGVudDoge1xuICAgICAgICAgICAgaW5kaWNhdG9yczpbXSxcbiAgICAgICAgICAgIGluZGljYXRvcjp7fSxcbiAgICAgICAgICAgIGRhdGE6IFtdLFxuICAgICAgICAgICAgY2F0ZWdvcmllczpbXSxcbiAgICAgICAgICAgIHN0eWxlczpbXSxcbiAgICAgICAgICAgIGluZm9ncmFwaGljczpbXVxuICAgICAgICAgIH0sXG4gICAgICAgICAgZmV0Y2hJbmRpY2F0b3JzOiBmdW5jdGlvbihmaWx0ZXIpe1xuICAgICAgICAgICAgIHJldHVybiB0aGlzLmNvbnRlbnQuaW5kaWNhdG9ycyA9IERhdGFTZXJ2aWNlLmdldEFsbCgnaW5kaWNhdG9ycycgLCBmaWx0ZXIpLiRvYmplY3RcbiAgICAgICAgICB9LFxuICAgICAgICAgIGZldGNoQ2F0ZWdvcmllczogZnVuY3Rpb24oZmlsdGVyKXtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNvbnRlbnQuY2F0ZWdvcmllcyA9IERhdGFTZXJ2aWNlLmdldEFsbCgnY2F0ZWdvcmllcycgLCBmaWx0ZXIpLiRvYmplY3Q7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBnZXRDYXRlZ29yaWVzOiBmdW5jdGlvbihmaWx0ZXIpe1xuICAgICAgICAgICAgaWYodGhpcy5jb250ZW50LmNhdGVnb3JpZXMubGVuZ3RoID09IDApe1xuICAgICAgICAgICAgICByZXR1cm4gdGhpcy5mZXRjaENhdGVnb3JpZXMoZmlsdGVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNvbnRlbnQuY2F0ZWdvcmllcztcbiAgICAgICAgICB9LFxuICAgICAgICAgIGdldEluZGljYXRvcnM6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jb250ZW50LmluZGljYXRvcnM7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBnZXRJbmRpY2F0b3I6IGZ1bmN0aW9uKGlkKXtcbiAgICAgICAgICAgIGlmKHRoaXMuY29udGVudC5pbmRpY2F0b3JzLmxlbmd0aCl7XG4gICAgICAgICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCB0aGlzLmNvbnRlbnQuaW5kaWNhdG9ycy5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICAgICAgaWYodGhpcy5jb250ZW50LmluZGljYXRvcnNbaV0uaWQgPT0gaWQpe1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY29udGVudC5pbmRpY2F0b3JzW2ldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY29udGVudC5pbmRpY2F0b3IgPSBEYXRhU2VydmljZS5nZXRPbmUoJ2luZGljYXRvcnMvJytpZCkuJG9iamVjdDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgIH0sXG4gICAgICAgICAgZ2V0SW5kaWNhdG9yRGF0YTogZnVuY3Rpb24oaWQpe1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY29udGVudC5kYXRhID0gRGF0YVNlcnZpY2UuZ2V0QWxsKCdpbmRpY2F0b3JzLycraWQrJy9kYXRhJyk7XG4gICAgICAgICAgfVxuXG4gICAgICAgIH1cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5zZXJ2aWNlcycpLmZhY3RvcnkoJ0NvdW50cmllc1NlcnZpY2UnLCBmdW5jdGlvbihEYXRhU2VydmljZSl7XG4gICAgICAgIC8vXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgY291bnRyaWVzOiBbXSxcbiAgICAgICAgICBmZXRjaERhdGE6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jb3VudHJpZXMgPSBEYXRhU2VydmljZS5nZXRPbmUoJ2NvdW50cmllcy9pc29zJykuJG9iamVjdDtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGdldERhdGE6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBpZighdGhpcy5jb3VudHJpZXMubGVuZ3RoKXtcbiAgICAgICAgICAgICAgdGhpcy5mZXRjaERhdGEoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNvdW50cmllcztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5zZXJ2aWNlcycpLmZhY3RvcnkoJ0RhdGFTZXJ2aWNlJywgRGF0YVNlcnZpY2UpO1xuICAgIERhdGFTZXJ2aWNlLiRpbmplY3QgPSBbJ1Jlc3Rhbmd1bGFyJywndG9hc3RyJ107XG5cbiAgICBmdW5jdGlvbiBEYXRhU2VydmljZShSZXN0YW5ndWxhciwgdG9hc3RyKXtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBnZXRBbGw6IGdldEFsbCxcbiAgICAgICAgICBnZXRPbmU6IGdldE9uZSxcbiAgICAgICAgICBwb3N0OiBwb3N0XG4gICAgICAgIH07XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0QWxsKHJvdXRlLCBmaWx0ZXIpe1xuICAgICAgICAgIHZhciBkYXRhID0gUmVzdGFuZ3VsYXIuYWxsKHJvdXRlKS5nZXRMaXN0KGZpbHRlcik7XG4gICAgICAgICAgICBkYXRhLnRoZW4oZnVuY3Rpb24oKXt9LCBmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgICAgICAgdG9hc3RyLmVycm9yKGRhdGEuc3RhdHVzVGV4dCwgJ0Nvbm5lY3Rpb24gRXJyb3InKTtcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGdldE9uZShyb3V0ZSwgaWQpe1xuICAgICAgICAgIHJldHVybiBSZXN0YW5ndWxhci5vbmUocm91dGUsIGlkKS5nZXQoKTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBwb3N0KHJvdXRlLCBkYXRhKXtcbiAgICAgICAgICB2YXIgZGF0YSA9IFJlc3Rhbmd1bGFyLmFsbChyb3V0ZSkucG9zdChkYXRhKTtcbiAgICAgICAgICBkYXRhLnRoZW4oZnVuY3Rpb24oKXt9LCBmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgICAgIHRvYXN0ci5lcnJvcihkYXRhLmRhdGEuZXJyb3IsICdTYXZpbmcgZmFpbGVkJyk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBwdXQocm91dGUsIGRhdGEpe1xuICAgICAgICAgIHJldHVybiBSZXN0YW5ndWxhci5hbGwocm91dGUpLnB1dChkYXRhKTtcbiAgICAgICAgfVxuICAgIH1cblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZShcImFwcC5zZXJ2aWNlc1wiKS5mYWN0b3J5KCdEaWFsb2dTZXJ2aWNlJywgZnVuY3Rpb24oJG1kRGlhbG9nKXtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRmcm9tVGVtcGxhdGU6IGZ1bmN0aW9uKHRlbXBsYXRlLCAkc2NvcGUpe1xuXG5cdFx0XHRcdHZhciBvcHRpb25zID0ge1xuXHRcdFx0XHRcdHRlbXBsYXRlVXJsOiAnLi92aWV3cy9kaWFsb2dzLycgKyB0ZW1wbGF0ZSArICcvJyArIHRlbXBsYXRlICsgJy5odG1sJ1xuXHRcdFx0XHR9O1xuXG5cdFx0XHRcdGlmICgkc2NvcGUpe1xuXHRcdFx0XHRcdG9wdGlvbnMuc2NvcGUgPSAkc2NvcGUuJG5ldygpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuICRtZERpYWxvZy5zaG93KG9wdGlvbnMpO1xuXHRcdFx0fSxcblxuXHRcdFx0aGlkZTogZnVuY3Rpb24oKXtcblx0XHRcdFx0cmV0dXJuICRtZERpYWxvZy5oaWRlKCk7XG5cdFx0XHR9LFxuXG5cdFx0XHRhbGVydDogZnVuY3Rpb24odGl0bGUsIGNvbnRlbnQpe1xuXHRcdFx0XHQkbWREaWFsb2cuc2hvdyhcblx0XHRcdFx0XHQkbWREaWFsb2cuYWxlcnQoKVxuXHRcdFx0XHRcdFx0LnRpdGxlKHRpdGxlKVxuXHRcdFx0XHRcdFx0LmNvbnRlbnQoY29udGVudClcblx0XHRcdFx0XHRcdC5vaygnT2snKVxuXHRcdFx0XHQpO1xuXHRcdFx0fSxcblxuXHRcdFx0Y29uZmlybTogZnVuY3Rpb24odGl0bGUsIGNvbnRlbnQpIHtcblx0XHRcdFx0cmV0dXJuICRtZERpYWxvZy5zaG93KFxuXHRcdFx0XHRcdCRtZERpYWxvZy5jb25maXJtKClcblx0XHRcdFx0XHRcdC50aXRsZSh0aXRsZSlcblx0XHRcdFx0XHRcdC5jb250ZW50KGNvbnRlbnQpXG5cdFx0XHRcdFx0XHQub2soJ09rJylcblx0XHRcdFx0XHRcdC5jYW5jZWwoJ0NhbmNlbCcpXG5cdFx0XHRcdCk7XG5cdFx0XHR9XG5cdFx0fTtcblx0fSk7XG59KSgpOyIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5zZXJ2aWNlcycpLmZhY3RvcnkoJ0ljb25zU2VydmljZScsIGZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciB1bmljb2RlcyA9IHtcbiAgICAgICAgICAnZW1wdHknOiBcIlxcdWU2MDBcIixcbiAgICAgICAgICAnYWdyYXInOiBcIlxcdWU2MDBcIixcbiAgICAgICAgICAnYW5jaG9yJzogXCJcXHVlNjAxXCIsXG4gICAgICAgICAgJ2J1dHRlcmZseSc6IFwiXFx1ZTYwMlwiLFxuICAgICAgICAgICdlbmVyZ3knOlwiXFx1ZTYwM1wiLFxuICAgICAgICAgICdzaW5rJzogXCJcXHVlNjA0XCIsXG4gICAgICAgICAgJ21hbic6IFwiXFx1ZTYwNVwiLFxuICAgICAgICAgICdmYWJyaWMnOiBcIlxcdWU2MDZcIixcbiAgICAgICAgICAndHJlZSc6XCJcXHVlNjA3XCIsXG4gICAgICAgICAgJ3dhdGVyJzpcIlxcdWU2MDhcIlxuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZ2V0VW5pY29kZTogZnVuY3Rpb24oaWNvbil7XG4gICAgICAgICAgICByZXR1cm4gdW5pY29kZXNbaWNvbl07XG4gICAgICAgICAgfSxcbiAgICAgICAgICBnZXRMaXN0OmZ1bmN0aW9uKCl7XG4gICAgICAgICAgICByZXR1cm4gdW5pY29kZXM7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuc2VydmljZXMnKS5mYWN0b3J5KCdJbmRleFNlcnZpY2UnLCBmdW5jdGlvbihDYWNoZUZhY3RvcnksJHN0YXRlKXtcbiAgICAgICAgLy9cbiAgICAgICAgdmFyIHNlcnZpY2VEYXRhID0ge1xuICAgICAgICAgICAgZGF0YTogW10sXG4gICAgICAgICAgICBlcnJvcnM6IFtdLFxuICAgICAgICAgICAgaXNvX2Vycm9yczpbXSxcbiAgICAgICAgICAgIG1ldGE6e1xuICAgICAgICAgICAgICBpc29fZmllbGQ6ICcnLFxuICAgICAgICAgICAgICBjb3VudHJ5X2ZpZWxkOicnLFxuICAgICAgICAgICAgICB5ZWFyX2ZpZWxkOicnLFxuICAgICAgICAgICAgICB0YWJsZTpbXVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGluZGljYXRvcnM6e30sXG4gICAgICAgICAgICB0b1NlbGVjdDpbXVxuICAgICAgICB9LCBzdG9yYWdlLCBpbXBvcnRDYWNoZSwgaW5kaWNhdG9yO1xuXG4gICAgICAgIGlmICghQ2FjaGVGYWN0b3J5LmdldCgnaW1wb3J0RGF0YScpKSB7XG4gICAgICAgICAgaW1wb3J0Q2FjaGUgPSBDYWNoZUZhY3RvcnkoJ2ltcG9ydERhdGEnLCB7XG4gICAgICAgICAgICBjYWNoZUZsdXNoSW50ZXJ2YWw6IDYwICogNjAgKiAxMDAwLCAvLyBUaGlzIGNhY2hlIHdpbGwgY2xlYXIgaXRzZWxmIGV2ZXJ5IGhvdXIuXG4gICAgICAgICAgICBkZWxldGVPbkV4cGlyZTogJ2FnZ3Jlc3NpdmUnLCAvLyBJdGVtcyB3aWxsIGJlIGRlbGV0ZWQgZnJvbSB0aGlzIGNhY2hlIHJpZ2h0IHdoZW4gdGhleSBleHBpcmUuXG4gICAgICAgICAgICBzdG9yYWdlTW9kZTogJ2xvY2FsU3RvcmFnZScgLy8gVGhpcyBjYWNoZSB3aWxsIHVzZSBgbG9jYWxTdG9yYWdlYC5cbiAgICAgICAgICB9KTtcbiAgICAgICAgICBzZXJ2aWNlRGF0YSA9IGltcG9ydENhY2hlLmdldCgnZGF0YVRvSW1wb3J0Jyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZXtcbiAgICAgICAgICBpbXBvcnRDYWNoZSA9IENhY2hlRmFjdG9yeS5nZXQoJ2ltcG9ydERhdGEnKTtcbiAgICAgICAgICBzdG9yYWdlID0gaW1wb3J0Q2FjaGUuZ2V0KCdkYXRhVG9JbXBvcnQnKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGNsZWFyOmZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC5pbmRleC5jcmVhdGUnKTtcbiAgICAgICAgICAgIGlmKENhY2hlRmFjdG9yeS5nZXQoJ2ltcG9ydERhdGEnKSl7XG4gICAgICAgICAgICAgICAgaW1wb3J0Q2FjaGUucmVtb3ZlKCdkYXRhVG9JbXBvcnQnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBzZXJ2aWNlRGF0YT0ge1xuICAgICAgICAgICAgICAgIGRhdGE6IFtdLFxuICAgICAgICAgICAgICAgIGVycm9yczogW10sXG4gICAgICAgICAgICAgICAgaXNvX2Vycm9yczpbXSxcbiAgICAgICAgICAgICAgICBtZXRhOntcbiAgICAgICAgICAgICAgICAgIGlzb19maWVsZDogJycsXG4gICAgICAgICAgICAgICAgICBjb3VudHJ5X2ZpZWxkOicnLFxuICAgICAgICAgICAgICAgICAgeWVhcl9maWVsZDonJ1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgdG9TZWxlY3Q6W10sXG4gICAgICAgICAgICAgICAgaW5kaWNhdG9yczp7fVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGFkZERhdGE6ZnVuY3Rpb24oaXRlbSl7XG4gICAgICAgICAgICByZXR1cm4gc2VydmljZURhdGEuZGF0YS5wdXNoKGl0ZW0pO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgYWRkSW5kaWNhdG9yOiBmdW5jdGlvbihpdGVtKXtcbiAgICAgICAgICAgIHJldHVybiBzZXJ2aWNlRGF0YS5pbmRpY2F0b3JzLnB1c2goaXRlbSk7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBhZGRUb1NlbGVjdDogZnVuY3Rpb24oaXRlbSl7XG4gICAgICAgICAgICByZXR1cm4gc2VydmljZURhdGEudG9TZWxlY3QucHVzaChpdGVtKTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGFkZElzb0Vycm9yOiBmdW5jdGlvbihlcnJvcil7XG4gICAgICAgICAgICByZXR1cm4gc2VydmljZURhdGEuaXNvX2Vycm9ycy5wdXNoKGVycm9yKTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIHJlbW92ZVRvU2VsZWN0OiBmdW5jdGlvbihpdGVtKXtcbiAgICAgICAgICAgIHZhciBpbmRleCA9IHNlcnZpY2VEYXRhLnRvU2VsZWN0LmluZGV4T2YoaXRlbSk7XG4gICAgICAgICAgICByZXR1cm4gaW5kZXggPiAtMSA/IHNlcnZpY2VEYXRhLnRvU2VsZWN0LnNwbGljZShpbmRleCwgMSkgOiBmYWxzZTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIHNldERhdGE6IGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAgICAgcmV0dXJuIHNlcnZpY2VEYXRhLmRhdGEgPSBkYXRhO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgc2V0SXNvRmllbGQ6IGZ1bmN0aW9uKGtleSl7XG4gICAgICAgICAgICByZXR1cm4gc2VydmljZURhdGEubWV0YS5pc29fZmllbGQgPSBrZXk7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBzZXRDb3VudHJ5RmllbGQ6IGZ1bmN0aW9uKGtleSl7XG4gICAgICAgICAgICByZXR1cm4gc2VydmljZURhdGEubWV0YS5jb3VudHJ5X2ZpZWxkID0ga2V5O1xuICAgICAgICAgIH0sXG4gICAgICAgICAgc2V0WWVhckZpZWxkOiBmdW5jdGlvbihrZXkpe1xuICAgICAgICAgICAgcmV0dXJuIHNlcnZpY2VEYXRhLm1ldGEueWVhcl9maWVsZCA9IGtleTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIHNldEVycm9yczogZnVuY3Rpb24oZXJyb3JzKXtcbiAgICAgICAgICAgIHJldHVybiBzZXJ2aWNlRGF0YS5lcnJvcnMgPSBlcnJvcnM7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBzZXRUb0xvY2FsU3RvcmFnZTogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coc2VydmljZURhdGEpO1xuICAgICAgICAgICAgaW1wb3J0Q2FjaGUucHV0KCdkYXRhVG9JbXBvcnQnLHNlcnZpY2VEYXRhKTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIHNldEluZGljYXRvcjogZnVuY3Rpb24oa2V5LCBpdGVtKXtcbiAgICAgICAgICAgIHJldHVybiBzZXJ2aWNlRGF0YS5pbmRpY2F0b3JzW2tleV0gPSBpdGVtO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgc2V0QWN0aXZlSW5kaWNhdG9yRGF0YTogZnVuY3Rpb24oaXRlbSl7XG4gICAgICAgICAgICByZXR1cm4gaW5kaWNhdG9yID0gc2VydmljZURhdGEuaW5kaWNhdG9yc1tpdGVtLmNvbHVtbl9uYW1lXSA9IGl0ZW07XG4gICAgICAgICAgfSxcbiAgICAgICAgICBnZXRGcm9tTG9jYWxTdG9yYWdlOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgcmV0dXJuIHNlcnZpY2VEYXRhID0gaW1wb3J0Q2FjaGUuZ2V0KCdkYXRhVG9JbXBvcnQnKTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGdldEZ1bGxEYXRhOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgcmV0dXJuIHNlcnZpY2VEYXRhO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZ2V0RGF0YTogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIGlmKHR5cGVvZiBzZXJ2aWNlRGF0YSA9PSBcInVuZGVmaW5lZFwiKSByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICByZXR1cm4gc2VydmljZURhdGEuZGF0YTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGdldE1ldGE6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBpZih0eXBlb2Ygc2VydmljZURhdGEgPT0gXCJ1bmRlZmluZWRcIikgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgcmV0dXJuIHNlcnZpY2VEYXRhLm1ldGE7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBnZXRUb1NlbGVjdDogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHJldHVybiBzZXJ2aWNlRGF0YS50b1NlbGVjdDtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGdldElzb0ZpZWxkOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgcmV0dXJuIHNlcnZpY2VEYXRhLm1ldGEuaXNvX2ZpZWxkO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZ2V0Q291bnRyeUZpZWxkOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgcmV0dXJuIHNlcnZpY2VEYXRhLm1ldGEuY291bnRyeV9maWVsZDtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGdldEVycm9yczogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIGlmKHR5cGVvZiBzZXJ2aWNlRGF0YSA9PSBcInVuZGVmaW5lZFwiKSByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICByZXR1cm4gc2VydmljZURhdGEuZXJyb3JzO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZ2V0SXNvRXJyb3JzOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgaWYodHlwZW9mIHNlcnZpY2VEYXRhID09IFwidW5kZWZpbmVkXCIpIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIHJldHVybiBzZXJ2aWNlRGF0YS5pc29fZXJyb3JzO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZ2V0Rmlyc3RFbnRyeTogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHJldHVybiBzZXJ2aWNlRGF0YS5kYXRhWzBdO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZ2V0RGF0YVNpemU6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICByZXR1cm4gc2VydmljZURhdGEuZGF0YS5sZW5ndGg7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBnZXRJbmRpY2F0b3I6IGZ1bmN0aW9uKGtleSl7XG4gICAgICAgICAgICByZXR1cm4gaW5kaWNhdG9yID0gc2VydmljZURhdGEuaW5kaWNhdG9yc1trZXldO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZ2V0SW5kaWNhdG9yczogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIGlmKHR5cGVvZiBzZXJ2aWNlRGF0YSA9PSBcInVuZGVmaW5lZFwiKSByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICByZXR1cm4gc2VydmljZURhdGEuaW5kaWNhdG9ycztcbiAgICAgICAgICB9LFxuICAgICAgICAgIGFjdGl2ZUluZGljYXRvcjogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHJldHVybiBpbmRpY2F0b3I7XG4gICAgICAgICAgfSxcbiAgICAgICAgICByZWR1Y2VJc29FcnJvcjpmdW5jdGlvbigpe1xuICAgICAgICAgICAgcmV0dXJuIHNlcnZpY2VEYXRhLmlzb19lcnJvcnMuc3BsaWNlKDAsMSk7XG4gICAgICAgICAgfSxcbiAgICAgICAgICByZWR1Y2VFcnJvcjpmdW5jdGlvbigpe1xuICAgICAgICAgICAgcmV0dXJuIHNlcnZpY2VEYXRhLmVycm9ycy5zcGxpY2UoMCwxKTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIHJlc2V0VG9TZWxlY3Q6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICByZXR1cm4gc2VydmljZURhdGEudG9TZWxlY3QgPSBbXTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuc2VydmljZXMnKS5mYWN0b3J5KCdJbmRpemVzU2VydmljZScsIGZ1bmN0aW9uIChEYXRhU2VydmljZSkge1xuXHRcdC8vXG5cdFx0cmV0dXJuIHtcblx0XHRcdGluZGV4OiB7XG5cdFx0XHRcdGRhdGE6IHtcblx0XHRcdFx0XHRkYXRhOiBudWxsLFxuXHRcdFx0XHRcdHN0cnVjdHVyZTogbnVsbFxuXHRcdFx0XHR9LFxuXHRcdFx0XHRwcm9taXNlczoge1xuXHRcdFx0XHRcdGRhdGE6IG51bGwsXG5cdFx0XHRcdFx0c3RydWN0dXI6IG51bGxcblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdGZldGNoRGF0YTogZnVuY3Rpb24oaW5kZXgpIHtcblx0XHRcdFx0dGhpcy5pbmRleC5wcm9taXNlcy5kYXRhID0gRGF0YVNlcnZpY2UuZ2V0QWxsKCdpbmRleC8nICsgaW5kZXggKyAnL3llYXIvbGF0ZXN0Jyk7XG5cdFx0XHRcdHRoaXMuaW5kZXgucHJvbWlzZXMuc3RydWN0dXJlID0gRGF0YVNlcnZpY2UuZ2V0T25lKCdpbmRleC8nICsgaW5kZXggKyAnL3N0cnVjdHVyZScpO1xuXHRcdFx0XHR0aGlzLmluZGV4LmRhdGEuZGF0YSA9IHRoaXMuaW5kZXgucHJvbWlzZXMuZGF0YS4kb2JqZWN0O1xuXHRcdFx0XHR0aGlzLmluZGV4LmRhdGEuc3RydWN0dXJlID0gdGhpcy5pbmRleC5wcm9taXNlcy5zdHJ1Y3R1cmUuJG9iamVjdDtcblx0XHRcdFx0cmV0dXJuIHRoaXMuaW5kZXg7XG5cdFx0XHR9LFxuXHRcdFx0Z2V0RGF0YTogZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5pbmRleC5kYXRhLmRhdGE7XG5cdFx0XHR9LFxuXHRcdFx0Z2V0U3RydWN0dXJlOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLmluZGV4LmRhdGEuc3RydWN0dXJlO1xuXHRcdFx0fSxcblx0XHRcdGdldERhdGFQcm9taXNlOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLmluZGV4LnByb21pc2VzLmRhdGE7XG5cdFx0XHR9LFxuXHRcdFx0Z2V0U3RydWN0dXJlUHJvbWlzZTogZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5pbmRleC5wcm9taXNlcy5zdHJ1Y3R1cmU7XG5cdFx0XHR9XG5cdFx0fVxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cdFx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0XHRhbmd1bGFyLm1vZHVsZSgnYXBwLnNlcnZpY2VzJykuZmFjdG9yeSgnUmVjdXJzaW9uSGVscGVyJywgZnVuY3Rpb24gKCRjb21waWxlKSB7XG5cdFx0XHRcdC8vXG5cdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0LyoqXG5cdFx0XHRcdFx0ICogTWFudWFsbHkgY29tcGlsZXMgdGhlIGVsZW1lbnQsIGZpeGluZyB0aGUgcmVjdXJzaW9uIGxvb3AuXG5cdFx0XHRcdFx0ICogQHBhcmFtIGVsZW1lbnRcblx0XHRcdFx0XHQgKiBAcGFyYW0gW2xpbmtdIEEgcG9zdC1saW5rIGZ1bmN0aW9uLCBvciBhbiBvYmplY3Qgd2l0aCBmdW5jdGlvbihzKSByZWdpc3RlcmVkIHZpYSBwcmUgYW5kIHBvc3QgcHJvcGVydGllcy5cblx0XHRcdFx0XHQgKiBAcmV0dXJucyBBbiBvYmplY3QgY29udGFpbmluZyB0aGUgbGlua2luZyBmdW5jdGlvbnMuXG5cdFx0XHRcdFx0ICovXG5cdFx0XHRcdFx0Y29tcGlsZTogZnVuY3Rpb24gKGVsZW1lbnQsIGxpbmspIHtcblx0XHRcdFx0XHRcdC8vIE5vcm1hbGl6ZSB0aGUgbGluayBwYXJhbWV0ZXJcblx0XHRcdFx0XHRcdGlmIChhbmd1bGFyLmlzRnVuY3Rpb24obGluaykpIHtcblx0XHRcdFx0XHRcdFx0bGluayA9IHtcblx0XHRcdFx0XHRcdFx0XHRwb3N0OiBsaW5rXG5cdFx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdC8vIEJyZWFrIHRoZSByZWN1cnNpb24gbG9vcCBieSByZW1vdmluZyB0aGUgY29udGVudHNcblx0XHRcdFx0XHRcdHZhciBjb250ZW50cyA9IGVsZW1lbnQuY29udGVudHMoKS5yZW1vdmUoKTtcblx0XHRcdFx0XHRcdHZhciBjb21waWxlZENvbnRlbnRzO1xuXHRcdFx0XHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHRcdFx0cHJlOiAobGluayAmJiBsaW5rLnByZSkgPyBsaW5rLnByZSA6IG51bGwsXG5cdFx0XHRcdFx0XHRcdC8qKlxuXHRcdFx0XHRcdFx0XHQgKiBDb21waWxlcyBhbmQgcmUtYWRkcyB0aGUgY29udGVudHNcblx0XHRcdFx0XHRcdFx0ICovXG5cdFx0XHRcdFx0XHRcdHBvc3Q6IGZ1bmN0aW9uIChzY29wZSwgZWxlbWVudCkge1xuXHRcdFx0XHRcdFx0XHRcdC8vIENvbXBpbGUgdGhlIGNvbnRlbnRzXG5cdFx0XHRcdFx0XHRcdFx0aWYgKCFjb21waWxlZENvbnRlbnRzKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRjb21waWxlZENvbnRlbnRzID0gJGNvbXBpbGUoY29udGVudHMpO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHQvLyBSZS1hZGQgdGhlIGNvbXBpbGVkIGNvbnRlbnRzIHRvIHRoZSBlbGVtZW50XG5cdFx0XHRcdFx0XHRcdFx0Y29tcGlsZWRDb250ZW50cyhzY29wZSwgZnVuY3Rpb24gKGNsb25lKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRlbGVtZW50LmFwcGVuZChjbG9uZSk7XG5cdFx0XHRcdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0XHRcdFx0XHQvLyBDYWxsIHRoZSBwb3N0LWxpbmtpbmcgZnVuY3Rpb24sIGlmIGFueVxuXHRcdFx0XHRcdFx0XHRcdGlmIChsaW5rICYmIGxpbmsucG9zdCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0bGluay5wb3N0LmFwcGx5KG51bGwsIGFyZ3VtZW50cyk7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblxuXHRcdH0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoXCJhcHAuc2VydmljZXNcIikuZmFjdG9yeSgnVG9hc3RTZXJ2aWNlJywgZnVuY3Rpb24oJG1kVG9hc3Qpe1xuXG5cdFx0dmFyIGRlbGF5ID0gNjAwMCxcblx0XHRcdHBvc2l0aW9uID0gJ3RvcCByaWdodCcsXG5cdFx0XHRhY3Rpb24gPSAnT0snO1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHNob3c6IGZ1bmN0aW9uKGNvbnRlbnQpe1xuXHRcdFx0XHRpZiAoIWNvbnRlbnQpe1xuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiAkbWRUb2FzdC5zaG93KFxuXHRcdFx0XHRcdCRtZFRvYXN0LnNpbXBsZSgpXG5cdFx0XHRcdFx0XHQuY29udGVudChjb250ZW50KVxuXHRcdFx0XHRcdFx0LnBvc2l0aW9uKHBvc2l0aW9uKVxuXHRcdFx0XHRcdFx0LmFjdGlvbihhY3Rpb24pXG5cdFx0XHRcdFx0XHQuaGlkZURlbGF5KGRlbGF5KVxuXHRcdFx0XHQpO1xuXHRcdFx0fSxcblx0XHRcdGVycm9yOiBmdW5jdGlvbihjb250ZW50KXtcblx0XHRcdFx0aWYgKCFjb250ZW50KXtcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm4gJG1kVG9hc3Quc2hvdyhcblx0XHRcdFx0XHQkbWRUb2FzdC5zaW1wbGUoKVxuXHRcdFx0XHRcdFx0LmNvbnRlbnQoY29udGVudClcblx0XHRcdFx0XHRcdC5wb3NpdGlvbihwb3NpdGlvbilcblx0XHRcdFx0XHRcdC50aGVtZSgnd2FybicpXG5cdFx0XHRcdFx0XHQuYWN0aW9uKGFjdGlvbilcblx0XHRcdFx0XHRcdC5oaWRlRGVsYXkoZGVsYXkpXG5cdFx0XHRcdCk7XG5cdFx0XHR9XG5cdFx0fTtcblx0fSk7XG59KSgpOyIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5zZXJ2aWNlcycpLmZhY3RvcnkoJ1VzZXJTZXJ2aWNlJywgZnVuY3Rpb24oRGF0YVNlcnZpY2Upe1xuICAgICAgICAvL1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgdXNlcjp7XG4gICAgICAgICAgICBkYXRhOiBbXVxuICAgICAgICAgIH0sXG4gICAgICAgICAgbXlEYXRhOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudXNlci5kYXRhID0gRGF0YVNlcnZpY2UuZ2V0QWxsKCdtZS9kYXRhJykuJG9iamVjdDtcbiAgICAgICAgICB9LFxuICAgICAgICAgIG15UHJvZmlsZTogZnVuY3Rpb24oKXtcblxuICAgICAgICAgIH0sXG4gICAgICAgICAgbXlGcmllbmRzOiBmdW5jdGlvbigpe1xuXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdJbmRleENoZWNrQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwkc3RhdGUsICRmaWx0ZXIsIHRvYXN0ciwgRGlhbG9nU2VydmljZSwgSW5kZXhTZXJ2aWNlKXtcblxuXG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG4gICAgICAgIHZtLmRhdGEgPSBJbmRleFNlcnZpY2UuZ2V0RGF0YSgpO1xuICAgICAgICB2bS5tZXRhID0gSW5kZXhTZXJ2aWNlLmdldE1ldGEoKTtcbiAgICAgICAgdm0uZXJyb3JzID0gSW5kZXhTZXJ2aWNlLmdldEVycm9ycygpO1xuICAgICAgICB2bS5pc29fZXJyb3JzID0gSW5kZXhTZXJ2aWNlLmdldElzb0Vycm9ycygpO1xuICAgICAgICB2bS5zZWxlY3RlZCA9IFtdO1xuXG4gICAgICAgIHZtLmRlbGV0ZURhdGEgPSBkZWxldGVEYXRhO1xuICAgICAgICB2bS5kZWxldGVTZWxlY3RlZCA9IGRlbGV0ZVNlbGVjdGVkO1xuICAgICAgICB2bS5kZWxldGVDb2x1bW4gPSBkZWxldGVDb2x1bW47XG4gICAgICAgIHZtLm9uT3JkZXJDaGFuZ2UgPSBvbk9yZGVyQ2hhbmdlO1xuICAgICAgICB2bS5vblBhZ2luYXRpb25DaGFuZ2UgPSBvblBhZ2luYXRpb25DaGFuZ2U7XG4gICAgICAgIHZtLmNoZWNrRm9yRXJyb3JzID0gY2hlY2tGb3JFcnJvcnM7XG4gICAgICAgIHZtLnNlbGVjdEVycm9ycyA9IHNlbGVjdEVycm9ycztcbiAgICAgICAgdm0uc2hvd1VwbG9hZENvbnRhaW5lciA9IGZhbHNlO1xuICAgICAgICAvL3ZtLmVkaXRDb2x1bW5EYXRhID0gZWRpdENvbHVtbkRhdGE7XG4gICAgICAgIHZtLmVkaXRSb3cgPSBlZGl0Um93O1xuXG4gICAgICAgIHZtLnF1ZXJ5ID0ge1xuICAgICAgICAgIGZpbHRlcjogJycsXG4gICAgICAgICAgb3JkZXI6ICctZXJyb3JzJyxcbiAgICAgICAgICBsaW1pdDogMTUsXG4gICAgICAgICAgcGFnZTogMVxuICAgICAgICB9O1xuXG4gICAgICAgIGFjdGl2YXRlKCk7XG5cbiAgICAgICAgZnVuY3Rpb24gYWN0aXZhdGUoKXtcbiAgICAgICAgICBjaGVja0RhdGEoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGNoZWNrRGF0YSgpe1xuICAgICAgICAgIGlmKCF2bS5kYXRhKXtcbiAgICAgICAgICAgICRzdGF0ZS5nbygnYXBwLmluZGV4LmNyZWF0ZScpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHNlYXJjaChwcmVkaWNhdGUpIHtcbiAgICAgICAgICB2bS5maWx0ZXIgPSBwcmVkaWNhdGU7XG4gICAgICAgIH07XG4gICAgICAgIGZ1bmN0aW9uIG9uT3JkZXJDaGFuZ2Uob3JkZXIpIHtcbiAgICAgICAgICByZXR1cm4gdm0uZGF0YSA9ICRmaWx0ZXIoJ29yZGVyQnknKSh2bS5kYXRhLCBbb3JkZXJdLCB0cnVlKVxuICAgICAgICB9O1xuICAgICAgICBmdW5jdGlvbiBvblBhZ2luYXRpb25DaGFuZ2UocGFnZSwgbGltaXQpIHtcbiAgICAgICAgICAvL2NvbnNvbGUubG9nKHBhZ2UsIGxpbWl0KTtcbiAgICAgICAgICAvL3JldHVybiAkbnV0cml0aW9uLmRlc3NlcnRzLmdldCgkc2NvcGUucXVlcnksIHN1Y2Nlc3MpLiRwcm9taXNlO1xuICAgICAgICB9O1xuICAgICAgICBmdW5jdGlvbiBjaGVja0ZvckVycm9ycyhpdGVtKXtcbiAgICAgICAgICByZXR1cm4gaXRlbS5lcnJvcnMubGVuZ3RoID4gMCA/ICdtZC13YXJuJzogJyc7XG4gICAgICAgIH1cblxuICAgICAgICAvKmZ1bmN0aW9uIGVkaXRDb2x1bW5EYXRhKGUsIGtleSl7XG4gICAgICAgICAgdm0udG9FZGl0ID0ga2V5O1xuICAgICAgICAgIERpYWxvZ1NlcnZpY2UuZnJvbVRlbXBsYXRlKCdlZGl0Y29sdW1uJywgJHNjb3BlKTtcbiAgICAgICAgfSovXG4gICAgICAgIGZ1bmN0aW9uIGRlbGV0ZUNvbHVtbihlLCBrZXkpe1xuICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaCh2bS5kYXRhLCBmdW5jdGlvbihpdGVtLCBrKXtcbiAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaChpdGVtLmRhdGFbMF0sIGZ1bmN0aW9uKGZpZWxkLCBsKXtcbiAgICAgICAgICAgICAgaWYobCA9PSBrZXkpe1xuICAgICAgICAgICAgICAgIGRlbGV0ZSB2bS5kYXRhW2tdLmRhdGFbMF1ba2V5XTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9KTtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gZGVsZXRlU2VsZWN0ZWQoKXtcbiAgICAgICAgICBhbmd1bGFyLmZvckVhY2godm0uc2VsZWN0ZWQsIGZ1bmN0aW9uKGl0ZW0sIGtleSl7XG4gICAgICAgICAgICBhbmd1bGFyLmZvckVhY2goaXRlbS5lcnJvcnMsIGZ1bmN0aW9uKGVycm9yLCBrKXtcbiAgICAgICAgICAgICAgaWYoZXJyb3IudHlwZSA9PSAyIHx8IGVycm9yLnR5cGUgPT0gMyl7XG4gICAgICAgICAgICAgICAgdm0uaXNvX2Vycm9ycyAtLTtcbiAgICAgICAgICAgICAgICBJbmRleFNlcnZpY2UucmVkdWNlSXNvRXJyb3IoKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB2bS5lcnJvcnMgLS07XG4gICAgICAgICAgICAgIEluZGV4U2VydmljZS5yZWR1Y2VFcnJvcigpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIHZtLmRhdGEuc3BsaWNlKHZtLmRhdGEuaW5kZXhPZihpdGVtKSwgMSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgdm0uc2VsZWN0ZWQgPSBbXTtcbiAgICAgICAgICBpZih2bS5kYXRhLmxlbmd0aCA9PSAwKXtcbiAgICAgICAgICAgIHZtLmRlbGV0ZURhdGEoKTtcbiAgICAgICAgICAgICRzdGF0ZS5nbygnYXBwLmluZGV4LmNyZWF0ZScpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBzZWxlY3RFcnJvcnMoKXtcbiAgICAgICAgICB2bS5zZWxlY3RlZCA9IFtdO1xuICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaCh2bS5kYXRhLCBmdW5jdGlvbihpdGVtLCBrZXkpe1xuICAgICAgICAgICAgaWYoaXRlbS5lcnJvcnMubGVuZ3RoKXtcbiAgICAgICAgICAgICAgdm0uc2VsZWN0ZWQucHVzaChpdGVtKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGVkaXRSb3coKXtcbiAgICAgICAgICB2bS5yb3cgPSB2bS5zZWxlY3RlZFswXTtcbiAgICAgICAgICBEaWFsb2dTZXJ2aWNlLmZyb21UZW1wbGF0ZSgnZWRpdHJvdycsICRzY29wZSk7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gZGVsZXRlRGF0YSgpe1xuICAgICAgICAgIHZtLmRhdGEgPSBbXTtcbiAgICAgICAgfVxuXG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdJbmRleENoZWNrU2lkZWJhckN0cmwnLCBmdW5jdGlvbigkc2NvcGUsICRzdGF0ZSwgSW5kZXhTZXJ2aWNlLCBEYXRhU2VydmljZSwgRGlhbG9nU2VydmljZSwgdG9hc3RyKSB7XG5cdFx0dmFyIHZtID0gdGhpcztcblx0XHR2bS5kYXRhID0gSW5kZXhTZXJ2aWNlLmdldERhdGEoKTtcblx0XHR2bS5tZXRhID0gSW5kZXhTZXJ2aWNlLmdldE1ldGEoKTtcblx0XHR2bS5lcnJvcnMgPSBJbmRleFNlcnZpY2UuZ2V0RXJyb3JzKCk7XG5cdFx0dm0uaXNvX2Vycm9ycyA9IEluZGV4U2VydmljZS5nZXRJc29FcnJvcnMoKTtcblx0XHR2bS5jbGVhckVycm9ycyA9IGNsZWFyRXJyb3JzO1xuXHRcdHZtLmZldGNoSXNvID0gZmV0Y2hJc287XG5cblx0XHRhY3RpdmF0ZSgpO1xuXG5cdFx0ZnVuY3Rpb24gYWN0aXZhdGUoKSB7XG5cdFx0XHR2bS5teURhdGEgPSBEYXRhU2VydmljZS5nZXRBbGwoJ21lL2RhdGEnKTtcblx0XHRcdGNoZWNrTXlEYXRhKCk7XG5cdFx0XHRjb25zb2xlLmxvZyh2bS5tZXRhKTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBjaGVja015RGF0YSgpIHtcblx0XHRcdHZtLmV4dGVuZGluZ0Nob2ljZXMgPSBbXTtcblx0XHRcdGlmICh2bS5kYXRhLmxlbmd0aCkge1xuXHRcdFx0XHR2bS5teURhdGEudGhlbihmdW5jdGlvbihpbXBvcnRzKSB7XG5cdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKGltcG9ydHMsIGZ1bmN0aW9uKGVudHJ5KSB7XG5cdFx0XHRcdFx0XHR2YXIgZm91bmQgPSAwO1xuXHRcdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLmRhdGFbMF0ubWV0YS5maWVsZHMsIGZ1bmN0aW9uKGZpZWxkKSB7XG5cdFx0XHRcdFx0XHRcdHZhciBjb2x1bW5zID0gSlNPTi5wYXJzZShlbnRyeS5tZXRhX2RhdGEpO1xuXHRcdFx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2goY29sdW1ucywgZnVuY3Rpb24oY29sdW1uKSB7XG5cdFx0XHRcdFx0XHRcdFx0aWYgKGNvbHVtbi5jb2x1bW4gPT0gZmllbGQpIHtcblx0XHRcdFx0XHRcdFx0XHRcdGZvdW5kKys7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRpZiAoZm91bmQgPj0gdm0uZGF0YVswXS5tZXRhLmZpZWxkcy5sZW5ndGggLSAzKSB7XG5cdFx0XHRcdFx0XHRcdHZtLmV4dGVuZGluZ0Nob2ljZXMucHVzaChlbnRyeSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRpZiAodm0uZXh0ZW5kaW5nQ2hvaWNlcy5sZW5ndGgpIHtcblx0XHRcdFx0XHRcdGlmKHZtLm1ldGEueWVhcl9maWVsZCl7XG5cdFx0XHRcdFx0XHRcdHZtLm1ldGEueWVhciA9IHZtLmRhdGFbMF0uZGF0YVswXVt2bS5tZXRhLnllYXJfZmllbGRdO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0RGlhbG9nU2VydmljZS5mcm9tVGVtcGxhdGUoJ2V4dGVuZERhdGEnLCAkc2NvcGUpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gY2xlYXJFcnJvcnMoKSB7XG5cdFx0XHRhbmd1bGFyLmZvckVhY2godm0uZGF0YSwgZnVuY3Rpb24ocm93LCBrZXkpIHtcblx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKHJvdy5kYXRhWzBdLCBmdW5jdGlvbihpdGVtLCBrKSB7XG5cdFx0XHRcdFx0aWYgKGlzTmFOKGl0ZW0pIHx8IGl0ZW0gPCAwKSB7XG5cdFx0XHRcdFx0XHRpZiAoIGl0ZW0udG9TdHJpbmcoKS50b1VwcGVyQ2FzZSgpID09IFwiI05BXCIgfHwgaXRlbSA8IDAgfHwgaXRlbS50b1N0cmluZygpLnRvVXBwZXJDYXNlKCkuaW5kZXhPZignTi9BJykgPiAtMSkge1xuXHRcdFx0XHRcdFx0XHR2bS5kYXRhW2tleV0uZGF0YVswXVtrXSA9IG51bGw7XG5cdFx0XHRcdFx0XHRcdHJvdy5lcnJvcnMuc3BsaWNlKDAsIDEpO1xuXHRcdFx0XHRcdFx0XHR2bS5lcnJvcnMuc3BsaWNlKDAsIDEpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHRcdGlmICghcm93LmRhdGFbMF1bdm0ubWV0YS5pc29fZmllbGRdKSB7XG5cdFx0XHRcdFx0dmFyIGVycm9yID0ge1xuXHRcdFx0XHRcdFx0dHlwZTogXCIyXCIsXG5cdFx0XHRcdFx0XHRtZXNzYWdlOiBcIklzbyBmaWVsZCBpcyBub3QgdmFsaWQhXCIsXG5cdFx0XHRcdFx0XHR2YWx1ZTogcm93LmRhdGFbMF1bdm0ubWV0YS5pc29fZmllbGRdLFxuXHRcdFx0XHRcdFx0Y29sdW1uOiB2bS5tZXRhLmlzb19maWVsZCxcblx0XHRcdFx0XHRcdHJvdzoga2V5XG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0XHR2YXIgZXJyb3JGb3VuZCA9IGZhbHNlO1xuXHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChyb3cuZXJyb3JzLCBmdW5jdGlvbihlcnJvciwga2V5KSB7XG5cdFx0XHRcdFx0XHRpZiAoZXJyb3IudHlwZSA9PSAyKSB7XG5cdFx0XHRcdFx0XHRcdGVycm9yRm91bmQgPSB0cnVlO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0aWYgKCFlcnJvckZvdW5kKSB7XG5cdFx0XHRcdFx0XHRyb3cuZXJyb3JzLnB1c2goZXJyb3IpO1xuXHRcdFx0XHRcdFx0dm0uaXNvX2Vycm9ycy5wdXNoKGVycm9yKTtcblxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gZmV0Y2hJc28oKSB7XG5cdFx0XHRpZiAoIXZtLm1ldGEuaXNvX2ZpZWxkKSB7XG5cdFx0XHRcdHRvYXN0ci5lcnJvcignQ2hlY2sgeW91ciBzZWxlY3Rpb24gZm9yIHRoZSBJU08gZmllbGQnLCAnQ29sdW1uIG5vdCBzcGVjaWZpZWQhJyk7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblx0XHRcdGlmICghdm0ubWV0YS5jb3VudHJ5X2ZpZWxkKSB7XG5cdFx0XHRcdHRvYXN0ci5lcnJvcignQ2hlY2sgeW91ciBzZWxlY3Rpb24gZm9yIHRoZSBDT1VOVFJZIGZpZWxkJywgJ0NvbHVtbiBub3Qgc3BlY2lmaWVkIScpO1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cdFx0XHRpZiAodm0ubWV0YS5jb3VudHJ5X2ZpZWxkID09IHZtLm1ldGEuaXNvX2ZpZWxkKSB7XG5cdFx0XHRcdHRvYXN0ci5lcnJvcignSVNPIGZpZWxkIGFuZCBDT1VOVFJZIGZpZWxkIGNhbiBub3QgYmUgdGhlIHNhbWUnLCAnU2VsZWN0aW9uIGVycm9yIScpO1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cblx0XHRcdHZtLm5vdEZvdW5kID0gW107XG5cdFx0XHR2YXIgZW50cmllcyA9IFtdO1xuXHRcdFx0dmFyIGlzb0NoZWNrID0gMDtcblx0XHRcdHZhciBpc29UeXBlID0gJ2lzby0zMTY2LTInO1xuXHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLmRhdGEsIGZ1bmN0aW9uKGl0ZW0sIGtleSkge1xuXHRcdFx0XHRpZiAoaXRlbS5kYXRhWzBdW3ZtLm1ldGEuaXNvX2ZpZWxkXSkge1xuXHRcdFx0XHRcdGlzb0NoZWNrICs9IGl0ZW0uZGF0YVswXVt2bS5tZXRhLmlzb19maWVsZF0ubGVuZ3RoID09IDMgPyAxIDogMDtcblx0XHRcdFx0fVxuXHRcdFx0XHRzd2l0Y2ggKGl0ZW0uZGF0YVswXVt2bS5tZXRhLmNvdW50cnlfZmllbGRdKSB7XG5cdFx0XHRcdFx0Y2FzZSAnQ2FibyBWZXJkZSc6XG5cdFx0XHRcdFx0XHRpdGVtLmRhdGFbMF1bdm0ubWV0YS5jb3VudHJ5X2ZpZWxkXSA9ICdDYXBlIFZlcmRlJztcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgXCJEZW1vY3JhdGljIFBlb3BsZXMgUmVwdWJsaWMgb2YgS29yZWFcIjpcblx0XHRcdFx0XHRcdGl0ZW0uZGF0YVswXVt2bS5tZXRhLmNvdW50cnlfZmllbGRdID0gXCJEZW1vY3JhdGljIFBlb3BsZSdzIFJlcHVibGljIG9mIEtvcmVhXCI7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlIFwiQ290ZSBkJ0l2b2lyZVwiOlxuXHRcdFx0XHRcdFx0aXRlbS5kYXRhWzBdW3ZtLm1ldGEuY291bnRyeV9maWVsZF0gPSBcIkl2b3J5IENvYXN0XCI7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlIFwiTGFvIFBlb3BsZXMgRGVtb2NyYXRpYyBSZXB1YmxpY1wiOlxuXHRcdFx0XHRcdFx0aXRlbS5kYXRhWzBdW3ZtLm1ldGEuY291bnRyeV9maWVsZF0gPSBcIkxhbyBQZW9wbGUncyBEZW1vY3JhdGljIFJlcHVibGljXCI7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZW50cmllcy5wdXNoKHtcblx0XHRcdFx0XHRpc286IGl0ZW0uZGF0YVswXVt2bS5tZXRhLmlzb19maWVsZF0sXG5cdFx0XHRcdFx0bmFtZTogaXRlbS5kYXRhWzBdW3ZtLm1ldGEuY291bnRyeV9maWVsZF1cblx0XHRcdFx0fSk7XG5cdFx0XHR9KTtcblx0XHRcdHZhciBpc29UeXBlID0gaXNvQ2hlY2sgPj0gKGVudHJpZXMubGVuZ3RoIC8gMikgPyAnaXNvLTMxNjYtMScgOiAnaXNvLTMxNjYtMic7XG5cdFx0XHRJbmRleFNlcnZpY2UucmVzZXRUb1NlbGVjdCgpO1xuXHRcdFx0RGF0YVNlcnZpY2UucG9zdCgnY291bnRyaWVzL2J5SXNvTmFtZXMnLCB7XG5cdFx0XHRcdGRhdGE6IGVudHJpZXMsXG5cdFx0XHRcdGlzbzogaXNvVHlwZVxuXHRcdFx0fSkudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuXHRcdFx0XHRhbmd1bGFyLmZvckVhY2gocmVzcG9uc2UsIGZ1bmN0aW9uKGNvdW50cnksIGtleSkge1xuXHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5kYXRhLCBmdW5jdGlvbihpdGVtLCBrKSB7XG5cdFx0XHRcdFx0XHRpZiAoY291bnRyeS5uYW1lID09IGl0ZW0uZGF0YVswXVt2bS5tZXRhLmNvdW50cnlfZmllbGRdKSB7XG5cdFx0XHRcdFx0XHRcdGlmIChjb3VudHJ5LmRhdGEubGVuZ3RoID4gMSkge1xuXHRcdFx0XHRcdFx0XHRcdHZhciB0b1NlbGVjdCA9IHtcblx0XHRcdFx0XHRcdFx0XHRcdGVudHJ5OiBpdGVtLFxuXHRcdFx0XHRcdFx0XHRcdFx0b3B0aW9uczogY291bnRyeS5kYXRhXG5cdFx0XHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdFx0XHRJbmRleFNlcnZpY2UuYWRkVG9TZWxlY3QodG9TZWxlY3QpO1xuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdGlmICh0eXBlb2YgY291bnRyeS5kYXRhWzBdICE9IFwidW5kZWZpbmVkXCIpIHtcblx0XHRcdFx0XHRcdFx0XHRcdHZtLmRhdGFba10uZGF0YVswXVt2bS5tZXRhLmlzb19maWVsZF0gPSBjb3VudHJ5LmRhdGFbMF0uaXNvO1xuXHRcdFx0XHRcdFx0XHRcdFx0dm0uZGF0YVtrXS5kYXRhWzBdW3ZtLm1ldGEuY291bnRyeV9maWVsZF0gPSBjb3VudHJ5LmRhdGFbMF0uYWRtaW47XG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAoaXRlbS5lcnJvcnMubGVuZ3RoKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChpdGVtLmVycm9ycywgZnVuY3Rpb24oZXJyb3IsIGUpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoZXJyb3IudHlwZSA9PSAyIHx8IGVycm9yLnR5cGUgPT0gMykge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0dm0uaXNvX2Vycm9ycy5zcGxpY2UoMCwgMSk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpdGVtLmVycm9ycy5zcGxpY2UoZSwgMSk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0fSBlbHNlIGlmIChlcnJvci50eXBlID09IDEpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlmIChlcnJvci5jb2x1bW4gPT0gdm0ubWV0YS5pc29fZmllbGQpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0dm0uZXJyb3JzLnNwbGljZSgwLCAxKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aXRlbS5lcnJvcnMuc3BsaWNlKGUsIDEpO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdFx0Ly9jb25zb2xlLmxvZyh2bS5kYXRhW2tdKTtcblx0XHRcdFx0XHRcdFx0XHRcdHZhciBlcnJvciA9IHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0dHlwZTogXCIzXCIsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdG1lc3NhZ2U6IFwiQ291bGQgbm90IGxvY2F0ZSBhIHZhbGlkIGlzbyBuYW1lIVwiLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRjb2x1bW46IHZtLm1ldGEuY291bnRyeV9maWVsZFxuXHRcdFx0XHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdFx0XHRcdHZhciBlcnJvckZvdW5kID0gZmFsc2U7XG5cdFx0XHRcdFx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2godm0uZGF0YVtrXS5lcnJvcnMsIGZ1bmN0aW9uKGVycm9yLCBpKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKGVycm9yKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKGVycm9yLnR5cGUgPT0gMykge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVycm9yRm91bmQgPSB0cnVlO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0XHRcdFx0aWYgKCFlcnJvckZvdW5kKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdEluZGV4U2VydmljZS5hZGRJc29FcnJvcihlcnJvcik7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGl0ZW0uZXJyb3JzLnB1c2goZXJyb3IpO1xuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9KTtcblx0XHRcdFx0dm0uaXNvX2NoZWNrZWQgPSB0cnVlO1xuXHRcdFx0XHRpZiAoSW5kZXhTZXJ2aWNlLmdldFRvU2VsZWN0KCkubGVuZ3RoKSB7XG5cdFx0XHRcdFx0RGlhbG9nU2VydmljZS5mcm9tVGVtcGxhdGUoJ3NlbGVjdGlzb2ZldGNoZXJzJyk7XG5cdFx0XHRcdH1cblx0XHRcdH0sIGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG5cdFx0XHRcdHRvYXN0ci5lcnJvcignUGxlYXNlIGNoZWNrIHlvdXIgZmllbGQgc2VsZWN0aW9ucycsIHJlc3BvbnNlLmRhdGEubWVzc2FnZSk7XG5cdFx0XHR9KTtcblxuXHRcdH1cblx0XHR2bS5leHRlbmREYXRhID0gZXh0ZW5kRGF0YTtcblxuXHRcdGZ1bmN0aW9uIGV4dGVuZERhdGEoKSB7XG5cdFx0XHR2YXIgaW5zZXJ0RGF0YSA9IHtcblx0XHRcdFx0ZGF0YTogW11cblx0XHRcdH07XG5cdFx0XHR2YXIgbWV0YSA9IFtdLFxuXHRcdFx0XHRmaWVsZHMgPSBbXTtcblx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5kYXRhLCBmdW5jdGlvbihpdGVtLCBrZXkpIHtcblx0XHRcdFx0aWYgKGl0ZW0uZXJyb3JzLmxlbmd0aCA9PSAwKSB7XG5cdFx0XHRcdFx0aXRlbS5kYXRhWzBdLnllYXIgPSB2bS5tZXRhLnllYXI7XG5cdFx0XHRcdFx0aWYodm0ubWV0YS55ZWFyX2ZpZWxkICYmIHZtLm1ldGEueWVhcl9maWVsZCAhPSBcInllYXJcIikge1xuXHRcdFx0XHRcdFx0ZGVsZXRlIGl0ZW0uZGF0YVswXVt2bS5tZXRhLnllYXJfZmllbGRdO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpbnNlcnREYXRhLmRhdGEucHVzaChpdGVtLmRhdGFbMF0pO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHRvYXN0ci5lcnJvcignVGhlcmUgYXJlIHNvbWUgZXJyb3JzIGxlZnQhJywgJ0h1Y2ghJyk7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHRcdGNvbnNvbGUubG9nKGluc2VydERhdGEpO1xuXHRcdFx0RGF0YVNlcnZpY2UucG9zdCgnZGF0YS90YWJsZXMvJyArIHZtLmFkZERhdGFUby50YWJsZV9uYW1lICsgJy9pbnNlcnQnLCBpbnNlcnREYXRhKS50aGVuKGZ1bmN0aW9uKHJlcykge1xuXHRcdFx0XHRpZiAocmVzID09IHRydWUpIHtcblx0XHRcdFx0XHR0b2FzdHIuc3VjY2VzcyhpbnNlcnREYXRhLmRhdGEubGVuZ3RoICsgJyBpdGVtcyBpbXBvcnRldCB0byAnICsgdm0ubWV0YS5uYW1lLCAnU3VjY2VzcycpO1xuXHRcdFx0XHRcdHZtLmRhdGEgPSBJbmRleFNlcnZpY2UuY2xlYXIoKTtcblx0XHRcdFx0XHQkc3RhdGUuZ28oJ2FwcC5pbmRleC5teWRhdGEnKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdH0pO1xufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignSGVhZGVyQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgbGVhZmxldERhdGEsICRzdGF0ZSwkbG9jYWxTdG9yYWdlLCAkcm9vdFNjb3BlLCAkYXV0aCwgdG9hc3RyLCAkdGltZW91dCl7XG5cblx0XHR2YXIgdm0gPSB0aGlzO1xuXHRcdCRyb290U2NvcGUuaXNBdXRoZW50aWNhdGVkID0gaXNBdXRoZW50aWNhdGVkO1xuXHRcdHZtLmRvTG9naW4gPSBkb0xvZ2luO1xuXHRcdHZtLmRvTG9nb3V0ID0gZG9Mb2dvdXQ7XG5cdFx0dm0ub3Blbk1lbnUgPSBvcGVuTWVudTtcblx0XHR2bS50b2dnbGVWaWV3ID0gdG9nZ2xlVmlldztcblx0XHR2bS5hdXRoZW50aWNhdGUgPSBmdW5jdGlvbihwcm92aWRlcil7XG5cdFx0XHQkYXV0aC5hdXRoZW50aWNhdGUocHJvdmlkZXIpO1xuXHRcdH07XG5cdFx0ZnVuY3Rpb24gaXNBdXRoZW50aWNhdGVkKCl7XG5cdFx0XHQgcmV0dXJuICRhdXRoLmlzQXV0aGVudGljYXRlZCgpO1xuXHRcdH1cblx0XHRmdW5jdGlvbiBkb0xvZ2luKCl7XG5cdFx0XHQkYXV0aC5sb2dpbih2bS51c2VyKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcblx0XHRcdFx0dG9hc3RyLnN1Y2Nlc3MoJ1lvdSBoYXZlIHN1Y2Nlc3NmdWxseSBzaWduZWQgaW4nKTtcblx0XHRcdFx0Ly8kc3RhdGUuZ28oJHJvb3RTY29wZS5wcmV2aW91c1BhZ2Uuc3RhdGUubmFtZSB8fCAnYXBwLmhvbWUnLCAkcm9vdFNjb3BlLnByZXZpb3VzUGFnZS5wYXJhbXMpO1xuXHRcdFx0fSkuY2F0Y2goZnVuY3Rpb24ocmVzcG9uc2Upe1xuXHRcdFx0XHR0b2FzdHIuZXJyb3IoJ1BsZWFzZSBjaGVjayB5b3VyIGVtYWlsIGFuZCBwYXNzd29yZCcsICdTb21ldGhpbmcgd2VudCB3cm9uZycpO1xuXHRcdFx0fSlcblx0XHR9XG5cdFx0ZnVuY3Rpb24gZG9Mb2dvdXQoKXtcblx0XHRcdGlmKCRhdXRoLmlzQXV0aGVudGljYXRlZCgpKXtcblx0XHRcdFx0JGF1dGgubG9nb3V0KCkudGhlbihmdW5jdGlvbihkYXRhKXtcblx0XHRcdFx0XHRpZigkc3RhdGUuY3VycmVudC5hdXRoKXtcblx0XHRcdFx0XHRcdCRzdGF0ZS5nbygnYXBwLmhvbWUnKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0dG9hc3RyLnN1Y2Nlc3MoJ1lvdSBoYXZlIHN1Y2Nlc3NmdWxseSBsb2dnZWQgb3V0Jyk7XG5cdFx0XHRcdH0pLmNhdGNoKGZ1bmN0aW9uKHJlc3BvbnNlKXtcblxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9XG5cbiAgICBmdW5jdGlvbiBvcGVuTWVudSgkbWRPcGVuTWVudSwgZXYpIHtcbiAgICAgICRtZE9wZW5NZW51KGV2KTtcbiAgICB9O1xuXHRcdGZ1bmN0aW9uIHRvZ2dsZVZpZXcoKXtcblx0XHRcdCRyb290U2NvcGUubG9vc2VMYXlvdXQgPSAhJHJvb3RTY29wZS5sb29zZUxheW91dDtcblx0XHRcdCRsb2NhbFN0b3JhZ2UuZnVsbFZpZXcgPSAkcm9vdFNjb3BlLmxvb3NlTGF5b3V0O1xuXHRcdFx0cmVzZXRNYXBTaXplKCk7XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIHJlc2V0TWFwU2l6ZSgpe1xuXHRcdFx0JHRpbWVvdXQoZnVuY3Rpb24oKXtcblx0XHRcdFx0bGVhZmxldERhdGEuZ2V0TWFwKCdtYXAnKS50aGVuKGZ1bmN0aW9uIChtYXApIHtcblx0XHRcdFx0XHRtYXAuaW52YWxpZGF0ZVNpemUoKTtcblx0XHRcdFx0fSlcblx0XHRcdH0sIDMwMCk7XG5cdFx0fVxuXHRcdCRyb290U2NvcGUuc2lkZWJhck9wZW4gPSB0cnVlO1xuXHRcdCRzY29wZS4kd2F0Y2goZnVuY3Rpb24oKXtcblx0XHRcdHJldHVybiAkcm9vdFNjb3BlLmN1cnJlbnRfcGFnZTtcblx0XHR9LCBmdW5jdGlvbihuZXdQYWdlKXtcblx0XHRcdCRzY29wZS5jdXJyZW50X3BhZ2UgPSBuZXdQYWdlIHx8ICdQYWdlIE5hbWUnO1xuXHRcdH0pO1xuXHRcdCRzY29wZS4kd2F0Y2goJyRyb290LnNpZGViYXJPcGVuJywgZnVuY3Rpb24obixvKXtcblx0XHRcdGlmKG4gPT0gbykgcmV0dXJuIGZhbHNlO1xuXHRcdFx0cmVzZXRNYXBTaXplKCk7XG5cdFx0fSlcblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdIb21lQ3RybCcsIGZ1bmN0aW9uKERhdGFTZXJ2aWNlKXtcbiAgICAgICAgdmFyIHZtID0gdGhpcztcbiAgICAgICAgRGF0YVNlcnZpY2UuZ2V0QWxsKCdpbmRleCcpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgICAgIHZtLmluZGl6ZXMgPSByZXNwb25zZTtcbiAgICAgICAgfSk7XG5cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdJbXBvcnRjc3ZDdHJsJywgZnVuY3Rpb24gKCRtZERpYWxvZykge1xuXHRcdHRoaXMuc2V0dGluZ3MgPSB7XG5cdFx0XHRwcmludExheW91dDogdHJ1ZSxcblx0XHRcdHNob3dSdWxlcjogdHJ1ZSxcblx0XHRcdHNob3dTcGVsbGluZ1N1Z2dlc3Rpb25zOiB0cnVlLFxuXHRcdFx0cHJlc2VudGF0aW9uTW9kZTogJ2VkaXQnXG5cdFx0fTtcblxuXHRcdHRoaXMuc2FtcGxlQWN0aW9uID0gZnVuY3Rpb24gKG5hbWUsIGV2KSB7XG5cdFx0XHQkbWREaWFsb2cuc2hvdygkbWREaWFsb2cuYWxlcnQoKVxuXHRcdFx0XHQudGl0bGUobmFtZSlcblx0XHRcdFx0LmNvbnRlbnQoJ1lvdSB0cmlnZ2VyZWQgdGhlIFwiJyArIG5hbWUgKyAnXCIgYWN0aW9uJylcblx0XHRcdFx0Lm9rKCdHcmVhdCcpXG5cdFx0XHRcdC50YXJnZXRFdmVudChldilcblx0XHRcdCk7XG5cdFx0fTtcblxuICAgIHRoaXMub3BlbkNzdlVwbG9hZCA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0JG1kRGlhbG9nLnNob3coe1xuXHRcdFx0XHRcdC8vY29udHJvbGxlcjogRGlhbG9nQ29udHJvbGxlcixcblx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogJy92aWV3cy9hcHAvaW1wb3J0Y3N2L2NzdlVwbG9hZERpYWxvZy5odG1sJyxcblx0ICAgICAgICBiaW5kVG9Db250cm9sbGVyOiB0cnVlLFxuXHRcdFx0XHR9KVxuXHRcdFx0XHQudGhlbihmdW5jdGlvbiAoYW5zd2VyKSB7XG5cblx0XHRcdFx0fSwgZnVuY3Rpb24gKCkge1xuXG5cdFx0XHRcdH0pO1xuXHRcdH07XG5cdH0pXG5cblxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdJbmRleEN0cmwnLCBmdW5jdGlvbiAoJHNjb3BlLCAkd2luZG93LCAkcm9vdFNjb3BlLCRmaWx0ZXIsICRzdGF0ZSwgJHRpbWVvdXQsIFRvYXN0U2VydmljZSwgVmVjdG9ybGF5ZXJTZXJ2aWNlLCBkYXRhLCBjb3VudHJpZXMsIGxlYWZsZXREYXRhLCBEYXRhU2VydmljZSkge1xuXHRcdC8vIFZhcmlhYmxlIGRlZmluaXRpb25zXG5cdFx0dmFyIHZtID0gdGhpcztcblx0XHR2bS5tYXAgPSBudWxsO1xuXG5cdFx0dm0uZGF0YVNlcnZlciA9IGRhdGEucHJvbWlzZXMuZGF0YTtcblx0XHR2bS5zdHJ1Y3R1cmVTZXJ2ZXIgPSBkYXRhLnByb21pc2VzLnN0cnVjdHVyZTtcblx0XHR2bS5jb3VudHJ5TGlzdCA9IGNvdW50cmllcztcblxuXHRcdHZtLnN0cnVjdHVyZSA9IFwiXCI7XG5cdFx0dm0ubXZ0U2NvdXJjZSA9IFZlY3RvcmxheWVyU2VydmljZS5nZXRMYXllcigpO1xuXHRcdHZtLm12dENvdW50cnlMYXllciA9IFZlY3RvcmxheWVyU2VydmljZS5nZXROYW1lKCk7XG5cdFx0dm0ubXZ0Q291bnRyeUxheWVyR2VvbSA9IHZtLm12dENvdW50cnlMYXllcitcIl9nZW9tXCI7XG5cdFx0dm0uaXNvX2ZpZWxkID0gVmVjdG9ybGF5ZXJTZXJ2aWNlLmRhdGEuaXNvMjtcblx0XHR2bS5ub2RlUGFyZW50ID0ge307XG5cdFx0dm0uc2VsZWN0ZWRUYWIgPSAwO1xuXHRcdHZtLmN1cnJlbnQgPSBcIlwiO1xuXHRcdHZtLnRhYkNvbnRlbnQgPSBcIlwiO1xuXHRcdHZtLnRvZ2dsZUJ1dHRvbiA9ICdhcnJvd19kcm9wX2Rvd24nO1xuXHRcdHZtLm1lbnVlT3BlbiA9IHRydWU7XG5cdFx0dm0uaW5mbyA9IGZhbHNlO1xuXHRcdHZtLmNsb3NlSWNvbiA9ICdjbG9zZSc7XG5cdFx0dm0uY29tcGFyZSA9IHtcblx0XHRcdGFjdGl2ZTogZmFsc2UsXG5cdFx0XHRjb3VudHJpZXM6IFtdXG5cdFx0fTtcblx0XHR2bS5kaXNwbGF5ID0ge1xuXHRcdFx0c2VsZWN0ZWRDYXQ6ICcnXG5cdFx0fTtcblxuXHRcdC8vRnVuY3Rpb24gZGVmaW5pdG9uc1xuXHRcdHZtLnNob3dUYWJDb250ZW50ID0gc2hvd1RhYkNvbnRlbnQ7XG5cdFx0dm0uc2V0VGFiID0gc2V0VGFiO1xuXHRcdHZtLnNldFN0YXRlID0gc2V0U3RhdGU7XG5cdFx0dm0uc2V0Q3VycmVudCA9IHNldEN1cnJlbnQ7XG5cdFx0dm0uc2V0U2VsZWN0ZWRGZWF0dXJlID0gc2V0U2VsZWN0ZWRGZWF0dXJlO1xuXHRcdHZtLmdldFJhbmsgPSBnZXRSYW5rO1xuXHRcdHZtLmdldE9mZnNldCA9IGdldE9mZnNldDtcblx0XHR2bS5nZXRUZW5kZW5jeSA9IGdldFRlbmRlbmN5O1xuXG5cdFx0dm0uY2hlY2tDb21wYXJpc29uID0gY2hlY2tDb21wYXJpc29uO1xuXHRcdHZtLnRvZ2dsZU9wZW4gPSB0b2dnbGVPcGVuO1xuXHRcdHZtLnRvZ2dsZUluZm8gPSB0b2dnbGVJbmZvO1xuXHRcdHZtLnRvZ2dsZURldGFpbHMgPSB0b2dnbGVEZXRhaWxzO1xuXHRcdHZtLnRvZ2dsZUNvbXBhcmlzb24gPSB0b2dnbGVDb21wYXJpc29uO1xuXHRcdHZtLnRvZ2dsZUNvdW50cmllTGlzdCA9IHRvZ2dsZUNvdW50cmllTGlzdDtcblx0XHR2bS5tYXBHb3RvQ291bnRyeSA9IG1hcEdvdG9Db3VudHJ5O1xuXHRcdHZtLmdvQmFjayA9IGdvQmFjaztcblxuXHRcdHZtLmNhbGNUcmVlID0gY2FsY1RyZWU7XG5cblx0XHRhY3RpdmF0ZSgpO1xuXG5cdFx0ZnVuY3Rpb24gYWN0aXZhdGUoKSB7XG5cblx0XHRcdHZtLnN0cnVjdHVyZVNlcnZlci50aGVuKGZ1bmN0aW9uKHN0cnVjdHVyZSl7XG5cdFx0XHRcdHZtLmRhdGFTZXJ2ZXIudGhlbihmdW5jdGlvbihkYXRhKXtcblx0XHRcdFx0XHR2bS5kYXRhID0gZGF0YTtcblx0XHRcdFx0XHR2bS5zdHJ1Y3R1cmUgPSBzdHJ1Y3R1cmU7XG5cdFx0XHRcdFx0aWYoIXZtLnN0cnVjdHVyZS5zdHlsZSl7XG5cdFx0XHRcdFx0XHR2bS5zdHJ1Y3R1cmUuc3R5bGUgPSB7XG5cdFx0XHRcdFx0XHRcdCduYW1lJzonZGVmYXVsdCcsXG5cdFx0XHRcdFx0XHRcdCd0aXRsZSc6J0RlZmF1bHQnLFxuXHRcdFx0XHRcdFx0XHQnYmFzZV9jb2xvcic6J3JnYmEoMTI4LCAyNDMsIDE5OCwxKSdcblx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGNyZWF0ZUNhbnZhcyh2bS5zdHJ1Y3R1cmUuc3R5bGUuYmFzZV9jb2xvcik7XG5cdFx0XHRcdFx0ZHJhd0NvdW50cmllcygpO1xuXHRcdFx0XHRcdGlmKCRzdGF0ZS5wYXJhbXMuaXRlbSl7XG5cdFx0XHRcdFx0XHR2bS5zZXRTdGF0ZSgkc3RhdGUucGFyYW1zLml0ZW0pO1xuXHRcdFx0XHRcdFx0Y2FsY1JhbmsoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYoJHN0YXRlLnBhcmFtcy5jb3VudHJpZXMpe1xuXHRcdFx0XHRcdFx0dm0uc2V0VGFiKDIpO1xuXHRcdFx0XHRcdFx0dm0uY29tcGFyZS5jb3VudHJpZXMucHVzaCh2bS5jdXJyZW50KTtcblx0XHRcdFx0XHRcdHZtLmNvbXBhcmUuYWN0aXZlID0gdHJ1ZTtcblx0XHRcdFx0XHRcdCRyb290U2NvcGUuZ3JleWVkID0gdHJ1ZTtcblx0XHRcdFx0XHRcdHZhciBjb3VudHJpZXMgPSAkc3RhdGUucGFyYW1zLmNvdW50cmllcy5zcGxpdCgnLXZzLScpO1xuXHRcdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKGNvdW50cmllcywgZnVuY3Rpb24oaXNvKXtcblx0XHRcdFx0XHRcdFx0dm0uY29tcGFyZS5jb3VudHJpZXMucHVzaChnZXROYXRpb25CeUlzbyhpc28pKTtcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0Ly9vbnNvbGUubG9nKHZtLmNvbXBhcmUuY291bnRyaWVzKTtcblx0XHRcdFx0XHRcdGNvdW50cmllcy5wdXNoKHZtLmN1cnJlbnQuaXNvKTtcblx0XHRcdFx0XHRcdERhdGFTZXJ2aWNlLmdldE9uZSgnY291bnRyaWVzL2Jib3gnLCBjb3VudHJpZXMpLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcblx0XHRcdFx0XHRcdFx0dm0uYmJveCA9IGRhdGE7XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pXG5cdFx0XHR9KTtcblxuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGdvQmFjaygpe1xuXHRcdFx0JHdpbmRvdy5oaXN0b3J5LmJhY2soKTtcblx0XHR9XG5cdFx0ZnVuY3Rpb24gc2hvd1RhYkNvbnRlbnQoY29udGVudCkge1xuXHRcdFx0aWYgKGNvbnRlbnQgPT0gJycgJiYgdm0udGFiQ29udGVudCA9PSAnJykge1xuXHRcdFx0XHR2bS50YWJDb250ZW50ID0gJ3JhbmsnO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dm0udGFiQ29udGVudCA9IGNvbnRlbnQ7XG5cdFx0XHR9XG5cdFx0XHR2bS50b2dnbGVCdXR0b24gPSB2bS50YWJDb250ZW50ID8gJ2Fycm93X2Ryb3BfdXAnIDogJ2Fycm93X2Ryb3BfZG93bic7XG5cdFx0fTtcblx0XHRmdW5jdGlvbiBzZXRTdGF0ZShpdGVtKSB7XG5cdFx0XHR2bS5zZXRDdXJyZW50KGdldE5hdGlvbkJ5SXNvKGl0ZW0pKTtcblx0XHRcdGZldGNoTmF0aW9uRGF0YShpdGVtKTtcblx0XHR9O1xuXG5cdFx0ZnVuY3Rpb24gdG9nZ2xlT3BlbigpIHtcblx0XHRcdHZtLm1lbnVlT3BlbiA9ICF2bS5tZW51ZU9wZW47XG5cdFx0XHR2bS5jbG9zZUljb24gPSB2bS5tZW51ZU9wZW4gPT0gdHJ1ZSA/ICdjaGV2cm9uX2xlZnQnIDogJ2NoZXZyb25fcmlnaHQnO1xuXHRcdH1cblx0XHRmdW5jdGlvbiBzZXRDdXJyZW50KG5hdCkge1xuXHRcdFx0dm0uY3VycmVudCA9IG5hdDtcblx0XHRcdHZtLnNldFNlbGVjdGVkRmVhdHVyZSgpO1xuXHRcdH07XG5cblx0XHRmdW5jdGlvbiBzZXRTZWxlY3RlZEZlYXR1cmUoaXNvKSB7XG5cdFx0XHRpZiAodm0ubXZ0U291cmNlKSB7XG5cdFx0XHRcdCR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHR2bS5tdnRTb3VyY2UubGF5ZXJzW3ZtLm12dENvdW50cnlMYXllckdlb21dLmZlYXR1cmVzW3ZtLmN1cnJlbnQuaXNvXS5zZWxlY3RlZCA9IHRydWU7XG5cdFx0XHRcdH0pXG5cdFx0XHR9XG5cdFx0fTtcblx0XHRmdW5jdGlvbiBjYWxjUmFuaygpIHtcblx0XHRcdGlmKCF2bS5jdXJyZW50KXtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdFx0dmFyIHJhbmsgPSAwO1xuXHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLmRhdGEsIGZ1bmN0aW9uKGl0ZW0pIHtcblx0XHRcdFx0aXRlbVt2bS5zdHJ1Y3R1cmUubmFtZV0gPSBwYXJzZUZsb2F0KGl0ZW1bdm0uc3RydWN0dXJlLm5hbWVdKTtcblx0XHRcdFx0aXRlbVsnc2NvcmUnXSA9IHBhcnNlRmxvYXQoaXRlbVt2bS5zdHJ1Y3R1cmUubmFtZV0pO1xuXHRcdFx0fSk7XG5cdFx0XHR2bS5kYXRhID0gJGZpbHRlcignb3JkZXJCeScpKHZtLmRhdGEsIFt2bS5zdHJ1Y3R1cmUubmFtZV0sICdpc28nLCB0cnVlKTtcblx0XHRcdHJhbmsgPSB2bS5kYXRhLmluZGV4T2Yodm0uY3VycmVudCkgKyAxO1xuXHRcdFx0dm0uY3VycmVudFt2bS5zdHJ1Y3R1cmUubmFtZSsnX3JhbmsnXSA9IHJhbms7XG5cdFx0XHR2bS5jaXJjbGVPcHRpb25zID0ge1xuXHRcdFx0XHRcdGNvbG9yOnZtLnN0cnVjdHVyZS5zdHlsZS5iYXNlX2NvbG9yIHx8ICcjMDBjY2FhJyxcblx0XHRcdFx0XHRmaWVsZDp2bS5zdHJ1Y3R1cmUubmFtZSsnX3JhbmsnXG5cdFx0XHR9O1xuXHRcdFx0cmV0dXJuIHJhbms7XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIGdldFJhbmsoY291bnRyeSl7XG5cblx0XHRcdHZhciByYW5rID0gdm0uZGF0YS5pbmRleE9mKGNvdW50cnkpICsgMTtcblx0XHRcdHJldHVybiByYW5rO1xuXHRcdH1cblx0XHRmdW5jdGlvbiB0b2dnbGVJbmZvKCkge1xuXHRcdFx0dm0uaW5mbyA9ICF2bS5pbmZvO1xuXHRcdH07XG5cblx0XHRmdW5jdGlvbiB0b2dnbGVEZXRhaWxzKCkge1xuXHRcdFx0cmV0dXJuIHZtLmRldGFpbHMgPSAhdm0uZGV0YWlscztcblx0XHR9O1xuXHRcdGZ1bmN0aW9uIGZldGNoTmF0aW9uRGF0YShpc28pe1xuXHRcdFx0RGF0YVNlcnZpY2UuZ2V0T25lKCdpbmRleC8nKyRzdGF0ZS5wYXJhbXMuaW5kZXgsIGlzbykudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuXHRcdFx0XHR2bS5jdXJyZW50LmRhdGEgPSBkYXRhO1xuXHRcdFx0XHRtYXBHb3RvQ291bnRyeShpc28pO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIG1hcEdvdG9Db3VudHJ5KGlzbykge1xuXHRcdFx0aWYoISRzdGF0ZS5wYXJhbXMuY291bnRyaWVzKXtcblx0XHRcdFx0RGF0YVNlcnZpY2UuZ2V0T25lKCdjb3VudHJpZXMvYmJveCcsIFtpc29dKS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG5cdFx0XHRcdFx0dm0uYmJveCA9IGRhdGE7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gY2hlY2tDb21wYXJpc29uKHdhbnQpIHtcblx0XHRcdGlmICh3YW50ICYmICF2bS5jb21wYXJlLmFjdGl2ZSB8fCAhd2FudCAmJiB2bS5jb21wYXJlLmFjdGl2ZSkge1xuXHRcdFx0XHR2bS50b2dnbGVDb21wYXJpc29uKCk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gdG9nZ2xlQ29tcGFyaXNvbigpIHtcblx0XHRcdHZtLmNvbXBhcmUuY291bnRyaWVzID0gW3ZtLmN1cnJlbnRdO1xuXHRcdFx0dm0uY29tcGFyZS5hY3RpdmUgPSAhdm0uY29tcGFyZS5hY3RpdmU7XG5cdFx0XHRpZiAodm0uY29tcGFyZS5hY3RpdmUpIHtcblx0XHRcdFx0dm0uc2V0VGFiKDIpO1xuXHRcdFx0XHQkcm9vdFNjb3BlLmdyZXllZCA9IHRydWU7XG5cdFx0XHRcdHZtLm12dFNvdXJjZS5vcHRpb25zLm11dGV4VG9nZ2xlID0gZmFsc2U7XG5cdFx0XHRcdHZtLm12dFNvdXJjZS5zZXRTdHlsZShpbnZlcnRlZFN0eWxlKTtcblxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JHJvb3RTY29wZS5ncmV5ZWQgPSBmYWxzZTtcblx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLm12dFNvdXJjZS5sYXllcnNbdm0ubXZ0Q291bnRyeUxheWVyR2VvbV0uZmVhdHVyZXMsIGZ1bmN0aW9uIChmZWF0dXJlKSB7XG5cdFx0XHRcdFx0ZmVhdHVyZS5zZWxlY3RlZCA9IGZhbHNlO1xuXHRcdFx0XHR9KTtcblx0XHRcdFx0dm0ubXZ0U291cmNlLmxheWVyc1t2bS5tdnRDb3VudHJ5TGF5ZXJHZW9tXS5mZWF0dXJlc1t2bS5jdXJyZW50Lmlzb10uc2VsZWN0ZWQgPSB0cnVlO1xuXHRcdFx0XHR2bS5tdnRTb3VyY2Uub3B0aW9ucy5tdXRleFRvZ2dsZSA9IHRydWU7XG5cdFx0XHRcdHZtLm12dFNvdXJjZS5zZXRTdHlsZShjb3VudHJpZXNTdHlsZSk7XG5cdFx0XHRcdERhdGFTZXJ2aWNlLmdldE9uZSgnY291bnRyaWVzL2Jib3gnLCBbdm0uY3VycmVudC5pc29dKS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG5cdFx0XHRcdFx0dm0uYmJveCA9IGRhdGE7XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHQkc3RhdGUuZ28oJ2FwcC5pbmRleC5zaG93LnNlbGVjdGVkJyx7XG5cdFx0XHRcdFx0aW5kZXg6JHN0YXRlLnBhcmFtcy5pbmRleCxcblx0XHRcdFx0XHRpdGVtOiRzdGF0ZS5wYXJhbXMuaXRlbVxuXHRcdFx0XHR9KVxuXHRcdFx0fVxuXHRcdFx0Ly92bS5tdnRTb3VyY2UucmVkcmF3KCk7XG5cdFx0fTtcblxuXHRcdGZ1bmN0aW9uIHRvZ2dsZUNvdW50cmllTGlzdChjb3VudHJ5KSB7XG5cdFx0XHR2YXIgZm91bmQgPSBmYWxzZTtcblx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5jb21wYXJlLmNvdW50cmllcywgZnVuY3Rpb24gKG5hdCwga2V5KSB7XG5cdFx0XHRcdGlmIChjb3VudHJ5ID09IG5hdCAmJiBuYXQgIT0gdm0uY3VycmVudCkge1xuXHRcdFx0XHRcdHZtLmNvbXBhcmUuY291bnRyaWVzLnNwbGljZShrZXksIDEpO1xuXHRcdFx0XHRcdGZvdW5kID0gdHJ1ZTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0XHRpZiAoIWZvdW5kKSB7XG5cdFx0XHRcdHZtLmNvbXBhcmUuY291bnRyaWVzLnB1c2goY291bnRyeSk7XG5cdFx0XHR9O1xuXHRcdFx0dmFyIGlzb3MgPSBbXTtcblx0XHRcdHZhciBjb21wYXJlID0gW107XG5cdFx0XHRhbmd1bGFyLmZvckVhY2godm0uY29tcGFyZS5jb3VudHJpZXMsIGZ1bmN0aW9uIChpdGVtLCBrZXkpIHtcblx0XHRcdFx0aXNvcy5wdXNoKGl0ZW0uaXNvKTtcblx0XHRcdFx0aWYoaXRlbVt2bS5zdHJ1Y3R1cmUuaXNvXSAhPSB2bS5jdXJyZW50Lmlzbyl7XG5cdFx0XHRcdFx0Y29tcGFyZS5wdXNoKGl0ZW0uaXNvKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0XHRpZiAoaXNvcy5sZW5ndGggPiAxKSB7XG5cdFx0XHRcdERhdGFTZXJ2aWNlLmdldE9uZSgnY291bnRyaWVzL2Jib3gnLCBpc29zKS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG5cdFx0XHRcdFx0dm0uYmJveCA9IGRhdGE7XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHQkc3RhdGUuZ28oJ2FwcC5pbmRleC5zaG93LnNlbGVjdGVkLmNvbXBhcmUnLHtcblx0XHRcdFx0XHRpbmRleDogJHN0YXRlLnBhcmFtcy5pbmRleCxcblx0XHRcdFx0XHRpdGVtOiAkc3RhdGUucGFyYW1zLml0ZW0sXG5cdFx0XHRcdFx0Y291bnRyaWVzOmNvbXBhcmUuam9pbignLXZzLScpXG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gIWZvdW5kO1xuXHRcdH07XG5cblx0XHRmdW5jdGlvbiBnZXRPZmZzZXQoKSB7XG5cdFx0XHRpZiAoIXZtLmN1cnJlbnQpIHtcblx0XHRcdFx0cmV0dXJuIDA7XG5cdFx0XHR9XG5cdFx0XHQvL2NvbnNvbGUubG9nKHZtLmdldFJhbmsodm0uY3VycmVudCkpO1xuXHRcdFx0cmV0dXJuICh2bS5nZXRSYW5rKHZtLmN1cnJlbnQpIC0gMikgKiAxNztcblx0XHR9O1xuXG5cdFx0ZnVuY3Rpb24gZ2V0VGVuZGVuY3koKSB7XG5cdFx0XHRpZiAoIXZtLmN1cnJlbnQpIHtcblx0XHRcdFx0cmV0dXJuICdhcnJvd19kcm9wX2Rvd24nXG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdm0uY3VycmVudC5wZXJjZW50X2NoYW5nZSA+IDAgPyAnYXJyb3dfZHJvcF91cCcgOiAnYXJyb3dfZHJvcF9kb3duJztcblx0XHR9O1xuXG5cdFx0ZnVuY3Rpb24gc2V0VGFiKGkpIHtcblx0XHRcdHZtLmFjdGl2ZVRhYiA9IGk7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gZ2V0UGFyZW50KGRhdGEpIHtcblx0XHRcdHZhciBpdGVtcyA9IFtdO1xuXHRcdFx0YW5ndWxhci5mb3JFYWNoKGRhdGEuY2hpbGRyZW4sIGZ1bmN0aW9uIChpdGVtKSB7XG5cdFx0XHRcdGlmIChpdGVtLmNvbHVtbl9uYW1lID09IHZtLmRpc3BsYXkuc2VsZWN0ZWRDYXQudHlwZSkge1xuXHRcdFx0XHRcdHZtLm5vZGVQYXJlbnQgPSBkYXRhO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGdldFBhcmVudChpdGVtKTtcblx0XHRcdH0pO1xuXHRcdFx0cmV0dXJuIGl0ZW1zO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGNhbGNUcmVlKCkge1xuXHRcdFx0Z2V0UGFyZW50KHZtLnN0cnVjdHVyZSk7XG5cdFx0fTtcblxuXHRcdGZ1bmN0aW9uIGdldE5hdGlvbkJ5TmFtZShuYW1lKSB7XG5cdFx0XHR2YXIgbmF0aW9uID0ge307XG5cdFx0XHRhbmd1bGFyLmZvckVhY2godm0uZGF0YSwgZnVuY3Rpb24gKG5hdCkge1xuXHRcdFx0XHRpZiAobmF0LmNvdW50cnkgPT0gbmFtZSkge1xuXHRcdFx0XHRcdG5hdGlvbiA9IG5hdDtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0XHRyZXR1cm4gbmF0aW9uO1xuXHRcdH07XG5cblx0XHRmdW5jdGlvbiBnZXROYXRpb25CeUlzbyhpc28pIHtcblx0XHRcdHZhciBuYXRpb24gPSB7fTtcblx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5kYXRhLCBmdW5jdGlvbiAobmF0KSB7XG5cdFx0XHRcdGlmIChuYXQuaXNvID09IGlzbykge1xuXHRcdFx0XHRcdG5hdGlvbiA9IG5hdDtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHRcdHJldHVybiBuYXRpb247XG5cdFx0fTtcblxuXHRcdGZ1bmN0aW9uIGNyZWF0ZUNhbnZhcyhjb2xvcikge1xuXG5cdFx0XHR2bS5jYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcblx0XHRcdHZtLmNhbnZhcy53aWR0aCA9IDI4MDtcblx0XHRcdHZtLmNhbnZhcy5oZWlnaHQgPSAxMDtcblx0XHRcdHZtLmN0eCA9IHZtLmNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuXHRcdFx0dmFyIGdyYWRpZW50ID0gdm0uY3R4LmNyZWF0ZUxpbmVhckdyYWRpZW50KDAsIDAsIDI4MCwgMTApO1xuXHRcdFx0Z3JhZGllbnQuYWRkQ29sb3JTdG9wKDEsICdyZ2JhKDI1NSwyNTUsMjU1LDApJyk7XG5cdFx0XHRncmFkaWVudC5hZGRDb2xvclN0b3AoMC41MywgY29sb3IgfHwgICdyZ2JhKDEyOCwgMjQzLCAxOTgsMSknKTtcblx0XHRcdGdyYWRpZW50LmFkZENvbG9yU3RvcCgwLCAncmdiYSgxMDIsMTAyLDEwMiwxKScpO1xuXHRcdFx0dm0uY3R4LmZpbGxTdHlsZSA9IGdyYWRpZW50O1xuXHRcdFx0dm0uY3R4LmZpbGxSZWN0KDAsIDAsIDI4MCwgMTApO1xuXHRcdFx0dm0ucGFsZXR0ZSA9IHZtLmN0eC5nZXRJbWFnZURhdGEoMCwgMCwgMjU3LCAxKS5kYXRhO1xuXHRcdFx0Ly9kb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnYm9keScpWzBdLmFwcGVuZENoaWxkKHZtLmNhbnZhcyk7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gdXBkYXRlQ2FudmFzKGNvbG9yKSB7XG5cdFx0XHR2YXIgZ3JhZGllbnQgPSB2bS5jdHguY3JlYXRlTGluZWFyR3JhZGllbnQoMCwgMCwgMjgwLCAxMCk7XG5cdFx0XHRncmFkaWVudC5hZGRDb2xvclN0b3AoMSwgJ3JnYmEoMjU1LDI1NSwyNTUsMCknKTtcblx0XHRcdGdyYWRpZW50LmFkZENvbG9yU3RvcCgwLjUzLCBjb2xvciB8fCAncmdiYSgxMjgsIDI0MywgMTk4LDEpJyApO1xuXHRcdFx0Z3JhZGllbnQuYWRkQ29sb3JTdG9wKDAsICdyZ2JhKDEwMiwxMDIsMTAyLDEpJyk7XG5cdFx0XHR2bS5jdHguZmlsbFN0eWxlID0gZ3JhZGllbnQ7XG5cdFx0XHR2bS5jdHguZmlsbFJlY3QoMCwgMCwgMjgwLCAxMCk7XG5cdFx0XHR2bS5wYWxldHRlID0gdm0uY3R4LmdldEltYWdlRGF0YSgwLCAwLCAyNTcsIDEpLmRhdGE7XG5cdFx0XHQvL2RvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdib2R5JylbMF0uYXBwZW5kQ2hpbGQodm0uY2FudmFzKTtcblx0XHR9O1xuXG5cdFx0ZnVuY3Rpb24gaW52ZXJ0ZWRTdHlsZShmZWF0dXJlKSB7XG5cdFx0XHR2YXIgc3R5bGUgPSB7fTtcblx0XHRcdHZhciBpc28gPSBmZWF0dXJlLnByb3BlcnRpZXNbdm0uaXNvX2ZpZWxkXTtcblx0XHRcdHZhciBuYXRpb24gPSBnZXROYXRpb25CeUlzbyhpc28pO1xuXHRcdFx0dmFyIGZpZWxkID0gdm0uc3RydWN0dXJlLm5hbWUgfHwgJ3Njb3JlJztcblxuXHRcdFx0Ly9UT0RPOiBNQVggVkFMVUUgSU5TVEVBRCBPRiAxMDBcblx0XHRcdHZhciBjb2xvclBvcyA9IHBhcnNlSW50KDI1NiAvIDEwMCAqIG5hdGlvbltmaWVsZF0pICogNDtcblxuXHRcdFx0dmFyIGNvbG9yID0gJ3JnYmEoJyArIHZtLnBhbGV0dGVbY29sb3JQb3NdICsgJywgJyArIHZtLnBhbGV0dGVbY29sb3JQb3MgKyAxXSArICcsICcgKyB2bS5wYWxldHRlW2NvbG9yUG9zICsgMl0gKyAnLCcgKyB2bS5wYWxldHRlW2NvbG9yUG9zICsgM10gKyAnKSc7XG5cdFx0XHRzdHlsZS5jb2xvciA9ICdyZ2JhKDAsMCwwLDApJztcblx0XHRcdHN0eWxlLm91dGxpbmUgPSB7XG5cdFx0XHRcdGNvbG9yOiAncmdiYSgwLDAsMCwwKScsXG5cdFx0XHRcdHNpemU6IDBcblx0XHRcdH07XG5cdFx0XHRzdHlsZS5zZWxlY3RlZCA9IHtcblx0XHRcdFx0Y29sb3I6IGNvbG9yLFxuXHRcdFx0XHRvdXRsaW5lOiB7XG5cdFx0XHRcdFx0Y29sb3I6ICdyZ2JhKDAsMCwwLDAuMyknLFxuXHRcdFx0XHRcdHNpemU6IDJcblx0XHRcdFx0fVxuXHRcdFx0fTtcblx0XHRcdHJldHVybiBzdHlsZTtcblx0XHR9O1xuXG5cdFx0ZnVuY3Rpb24gY291bnRyaWVzU3R5bGUoZmVhdHVyZSkge1xuXG5cdFx0XHR2YXIgc3R5bGUgPSB7fTtcblx0XHRcdHZhciBpc28gPSBmZWF0dXJlLnByb3BlcnRpZXNbdm0uaXNvX2ZpZWxkXTtcblxuXHRcdFx0dmFyIG5hdGlvbiA9IGdldE5hdGlvbkJ5SXNvKGlzbyk7XG5cdFx0XHR2YXIgZmllbGQgPSB2bS5zdHJ1Y3R1cmUubmFtZSB8fCAnc2NvcmUnO1xuXHRcdFx0dmFyIHR5cGUgPSBmZWF0dXJlLnR5cGU7XG5cdFx0XHRpZihpc28gIT0gdm0uY3VycmVudC5pc28pe1xuXHRcdFx0XHRcdGZlYXR1cmUuc2VsZWN0ZWQgPSBmYWxzZTtcblx0XHRcdH1cblxuXHRcdFx0c3dpdGNoICh0eXBlKSB7XG5cdFx0XHRjYXNlIDM6IC8vJ1BvbHlnb24nXG5cdFx0XHRcdGlmICh0eXBlb2YgbmF0aW9uW2ZpZWxkXSAhPSBcInVuZGVmaW5lZFwiKSB7XG5cblx0XHRcdFx0XHQvL1RPRE86IE1BWCBWQUxVRSBJTlNURUFEIE9GIDEwMFxuXHRcdFx0XHRcdHZhciBjb2xvclBvcyA9IHBhcnNlSW50KDI1NiAvIDEwMCAqIHBhcnNlSW50KG5hdGlvbltmaWVsZF0pKSAqIDQ7XG5cblx0XHRcdFx0XHR2YXIgY29sb3IgPSAncmdiYSgnICsgdm0ucGFsZXR0ZVtjb2xvclBvc10gKyAnLCAnICsgdm0ucGFsZXR0ZVtjb2xvclBvcyArIDFdICsgJywgJyArIHZtLnBhbGV0dGVbY29sb3JQb3MgKyAyXSArICcsJyArIHZtLnBhbGV0dGVbY29sb3JQb3MgKyAzXSArICcpJztcblx0XHRcdFx0XHRzdHlsZS5jb2xvciA9ICdyZ2JhKCcgKyB2bS5wYWxldHRlW2NvbG9yUG9zXSArICcsICcgKyB2bS5wYWxldHRlW2NvbG9yUG9zICsgMV0gKyAnLCAnICsgdm0ucGFsZXR0ZVtjb2xvclBvcyArIDJdICsgJywwLjYpJzsgLy9jb2xvcjtcblx0XHRcdFx0XHRzdHlsZS5vdXRsaW5lID0ge1xuXHRcdFx0XHRcdFx0Y29sb3I6IGNvbG9yLFxuXHRcdFx0XHRcdFx0c2l6ZTogMVxuXHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0c3R5bGUuc2VsZWN0ZWQgPSB7XG5cdFx0XHRcdFx0XHRjb2xvcjogJ3JnYmEoJyArIHZtLnBhbGV0dGVbY29sb3JQb3NdICsgJywgJyArIHZtLnBhbGV0dGVbY29sb3JQb3MgKyAxXSArICcsICcgKyB2bS5wYWxldHRlW2NvbG9yUG9zICsgMl0gKyAnLDAuMyknLFxuXHRcdFx0XHRcdFx0b3V0bGluZToge1xuXHRcdFx0XHRcdFx0XHRjb2xvcjogJ3JnYmEoNjYsNjYsNjYsMC45KScsXG5cdFx0XHRcdFx0XHRcdHNpemU6IDJcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdFx0c3R5bGUuY29sb3IgPSAncmdiYSgyNTUsMjU1LDI1NSwwKSc7XG5cdFx0XHRcdFx0c3R5bGUub3V0bGluZSA9IHtcblx0XHRcdFx0XHRcdGNvbG9yOiAncmdiYSgyNTUsMjU1LDI1NSwwKScsXG5cdFx0XHRcdFx0XHRzaXplOiAxXG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0Ly9jb25zb2xlLmxvZyhmZWF0dXJlLnByb3BlcnRpZXMubmFtZSlcblx0XHRcdGlmIChmZWF0dXJlLmxheWVyLm5hbWUgPT09IFZlY3RvcmxheWVyU2VydmljZS5nZXROYW1lKCkrJ19nZW9tJykge1xuXHRcdFx0XHRzdHlsZS5zdGF0aWNMYWJlbCA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHR2YXIgc3R5bGUgPSB7XG5cdFx0XHRcdFx0XHRodG1sOiBmZWF0dXJlLnByb3BlcnRpZXMubmFtZSxcblx0XHRcdFx0XHRcdGljb25TaXplOiBbMTI1LCAzMF0sXG5cdFx0XHRcdFx0XHRjc3NDbGFzczogJ2xhYmVsLWljb24tdGV4dCdcblx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdHJldHVybiBzdHlsZTtcblx0XHRcdFx0fTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBzdHlsZTtcblx0XHR9O1xuXG5cdFx0JHNjb3BlLiR3YXRjaCgndm0uY3VycmVudCcsIGZ1bmN0aW9uIChuLCBvKSB7XG5cdFx0XHRpZiAobiA9PT0gbykge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGlmKG4uaXNvKSB7XG5cdFx0XHRcdGlmKG8uaXNvKXtcblx0XHRcdFx0XHR2bS5tdnRTb3VyY2UubGF5ZXJzW3ZtLm12dENvdW50cnlMYXllckdlb21dLmZlYXR1cmVzW28uaXNvXS5zZWxlY3RlZCA9IGZhbHNlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGNhbGNSYW5rKCk7XG5cdFx0XHRcdGZldGNoTmF0aW9uRGF0YShuLmlzbyk7XG5cdFx0XHRcdHZtLm12dFNvdXJjZS5sYXllcnNbdm0ubXZ0Q291bnRyeUxheWVyR2VvbV0uZmVhdHVyZXNbbi5pc29dLnNlbGVjdGVkID0gdHJ1ZTtcblx0XHRcdFx0aWYoJHN0YXRlLmN1cnJlbnQubmFtZSA9PSAnYXBwLmluZGV4LnNob3cuc2VsZWN0ZWQnIHx8ICRzdGF0ZS5jdXJyZW50Lm5hbWUgPT0gJ2FwcC5pbmRleC5zaG93Jyl7XG5cdFx0XHRcdFx0JHN0YXRlLmdvKCdhcHAuaW5kZXguc2hvdy5zZWxlY3RlZCcsIHtcblx0XHRcdFx0XHRcdGluZGV4OiAkc3RhdGUucGFyYW1zLmluZGV4LFxuXHRcdFx0XHRcdFx0aXRlbTogbi5pc29cblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JHN0YXRlLmdvKCdhcHAuaW5kZXguc2hvdycse1xuXHRcdFx0XHRcdGluZGV4OiAkc3RhdGUucGFyYW1zLmluZGV4XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdCRzY29wZS4kd2F0Y2goJ3ZtLmRpc3BsYXkuc2VsZWN0ZWRDYXQnLCBmdW5jdGlvbiAobiwgbykge1xuXHRcdFx0aWYgKG4gPT09IG8pIHtcblx0XHRcdFx0cmV0dXJuXG5cdFx0XHR9XG5cdFx0XHRjb25zb2xlLmxvZyhuKTtcblx0XHRcdGlmIChuLmNvbG9yKVxuXHRcdFx0XHR1cGRhdGVDYW52YXMobi5jb2xvcik7XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0dXBkYXRlQ2FudmFzKCdyZ2JhKDEyOCwgMjQzLCAxOTgsMSknKTtcblx0XHRcdH07XG5cdFx0XHR2bS5jYWxjVHJlZSgpO1xuXHRcdFx0LyppZiAodm0uY29tcGFyZS5hY3RpdmUpIHtcblx0XHRcdFx0JHRpbWVvdXQoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdC8vdm0ubXZ0U291cmNlLnNldFN0eWxlKGludmVydGVkU3R5bGUpO1xuXHRcdFx0XHRcdC8vdm0ubXZ0U291cmNlLnJlZHJhdygpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHQvL3ZtLm12dFNvdXJjZS5zZXRTdHlsZShjb3VudHJpZXNTdHlsZSk7XG5cdFx0XHRcdFx0Ly92bS5tdnRTb3VyY2UucmVkcmF3KCk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSovXG5cblx0XHRcdGlmICh2bS5jdXJyZW50Lmlzbykge1xuXHRcdFx0XHRpZigkc3RhdGUucGFyYW1zLmNvdW50cmllcyl7XG5cdFx0XHRcdFx0JHN0YXRlLmdvKCdhcHAuaW5kZXguc2hvdy5zZWxlY3RlZC5jb21wYXJlJywge1xuXHRcdFx0XHRcdFx0aW5kZXg6IG4ubmFtZSxcblx0XHRcdFx0XHRcdGl0ZW06IHZtLmN1cnJlbnQuaXNvLFxuXHRcdFx0XHRcdFx0Y291bnRyaWVzOiAkc3RhdGUucGFyYW1zLmNvdW50cmllc1xuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZXtcblx0XHRcdFx0XHQkc3RhdGUuZ28oJ2FwcC5pbmRleC5zaG93LnNlbGVjdGVkJywge1xuXHRcdFx0XHRcdFx0aW5kZXg6IG4ubmFtZSxcblx0XHRcdFx0XHRcdGl0ZW06IHZtLmN1cnJlbnQuaXNvXG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JHN0YXRlLmdvKCdhcHAuaW5kZXguc2hvdycsIHtcblx0XHRcdFx0XHRpbmRleDogbi5uYW1lXG5cdFx0XHRcdH0pXG5cdFx0XHR9XG5cblx0XHR9KTtcblx0XHQkc2NvcGUuJHdhdGNoKCd2bS5iYm94JywgZnVuY3Rpb24gKG4sIG8pIHtcblx0XHRcdGlmIChuID09PSBvKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHRcdC8qdmFyIGxhdCA9IFtuLmNvb3JkaW5hdGVzWzBdWzBdWzFdLFxuXHRcdFx0XHRcdFtuLmNvb3JkaW5hdGVzWzBdWzBdWzBdXVxuXHRcdFx0XHRdLFxuXHRcdFx0XHRsbmcgPSBbbi5jb29yZGluYXRlc1swXVsyXVsxXSxcblx0XHRcdFx0XHRbbi5jb29yZGluYXRlc1swXVsyXVswXV1cblx0XHRcdFx0XSovXG5cdFx0XHR2YXIgc291dGhXZXN0ID0gTC5sYXRMbmcobi5jb29yZGluYXRlc1swXVswXVsxXSwgbi5jb29yZGluYXRlc1swXVswXVswXSksXG5cdFx0XHRcdG5vcnRoRWFzdCA9IEwubGF0TG5nKG4uY29vcmRpbmF0ZXNbMF1bMl1bMV0sIG4uY29vcmRpbmF0ZXNbMF1bMl1bMF0pLFxuXHRcdFx0XHRib3VuZHMgPSBMLmxhdExuZ0JvdW5kcyhzb3V0aFdlc3QsIG5vcnRoRWFzdCk7XG5cblx0XHRcdHZhciBwYWQgPSBbXG5cdFx0XHRcdFswLCAwXSxcblx0XHRcdFx0WzEwMCwxMDBdXG5cdFx0XHRdO1xuXHRcdFx0aWYgKHZtLmNvbXBhcmUuYWN0aXZlKSB7XG5cdFx0XHRcdHBhZCA9IFtcblx0XHRcdFx0XHRbMCwgMF0sXG5cdFx0XHRcdFx0WzAsIDBdXG5cdFx0XHRcdF07XG5cdFx0XHR9XG5cdFx0XHR2bS5tYXAuZml0Qm91bmRzKGJvdW5kcywge1xuXHRcdFx0XHRwYWRkaW5nOnBhZFsxXSxcblx0XHRcdFx0bWF4Wm9vbTogNlxuXHRcdFx0fSk7XG5cdFx0fSk7XG5cblx0XHQkc2NvcGUuJG9uKFwiJHN0YXRlQ2hhbmdlU3VjY2Vzc1wiLCBmdW5jdGlvbiAoZXZlbnQsIHRvU3RhdGUsIHRvUGFyYW1zLCBmcm9tU3RhdGUsIGZyb21QYXJhbXMpIHtcblxuXHRcdFx0Lypjb25zb2xlLmxvZygkKVxuXHRcdFx0aWYgKHRvU3RhdGUubmFtZSA9PSBcImFwcC5pbmRleC5zaG93XCIpIHtcblx0XHRcdFx0XHR2bS5jdXJyZW50ID0gXCJcIjtcblx0XHRcdH0gZWxzZSBpZiAodG9TdGF0ZS5uYW1lID09IFwiYXBwLmluZGV4LnNob3cuc2VsZWN0ZWRcIikge1xuXG5cdFx0XHRcdGlmKHRvUGFyYW1zLmluZGV4ICE9IGZyb21QYXJhbXMuaW5kZXgpe1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKCdhbmRlcnMnKVxuXHRcdFx0XHR9XG5cdFx0XHRcdGNvbnNvbGUubG9nKHRvUGFyYW1zLml0ZW0pO1xuXHRcdFx0XHR2bS5zZXRTdGF0ZSh0b1BhcmFtcy5pdGVtKTtcblx0XHRcdFx0Y2FsY1JhbmsoKTtcblx0XHRcdFx0Ly92bS5tdnRTb3VyY2Uub3B0aW9ucy5tdXRleFRvZ2dsZSA9IHRydWU7XG5cdFx0XHRcdERhdGFTZXJ2aWNlLmdldE9uZSgnbmF0aW9ucycsIHZtLmN1cnJlbnQuaXNvKS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG5cdFx0XHRcdFx0dm0uY3VycmVudC5kYXRhID0gZGF0YTtcblx0XHRcdFx0XHREYXRhU2VydmljZS5nZXRPbmUoJ25hdGlvbnMvYmJveCcsIFt2bS5jdXJyZW50Lmlzb10pLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcblx0XHRcdFx0XHRcdHZtLmJib3ggPSBkYXRhO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9KTtcblx0XHRcdH0gZWxzZSBpZiAodG9TdGF0ZS5uYW1lID09IFwiYXBwLmluZGV4LnNob3cuc2VsZWN0ZWQuY29tcGFyZVwiKSB7XG5cdFx0XHRcdHZtLnNldFN0YXRlKHRvUGFyYW1zLml0ZW0pO1xuXHRcdFx0XHQvLyRzY29wZS5hY3RpdmVUYWIgPSAyO1xuXHRcdFx0XHQvKkRhdGFTZXJ2aWNlLmdldE9uZSgnbmF0aW9ucycsIHRvUGFyYW1zLml0ZW0pLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcblx0XHRcdFx0XHR2bS5jb3VudHJ5ID0gZGF0YTtcblx0XHRcdFx0XHREYXRhU2VydmljZS5nZXRPbmUoJ25hdGlvbnMvYmJveCcsIFt2bS5jb3VudHJ5Lmlzb10pLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcblx0XHRcdFx0XHRcdHZtLmJib3ggPSBkYXRhO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9KTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHZtLmN1cnJlbnQgPSBcIlwiO1xuXHRcdFx0fSovXG5cdFx0fSk7XG5cblx0XHRmdW5jdGlvbiBkcmF3Q291bnRyaWVzKCkge1xuXHRcdFx0bGVhZmxldERhdGEuZ2V0TWFwKCdtYXAnKS50aGVuKGZ1bmN0aW9uIChtYXApIHtcblx0XHRcdFx0dm0ubWFwID0gbWFwO1xuXHRcdFx0XHR2bS5tdnRTb3VyY2UgPSBWZWN0b3JsYXllclNlcnZpY2UuZ2V0TGF5ZXIoKTtcblx0XHRcdFx0JHRpbWVvdXQoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdGlmKCRzdGF0ZS5wYXJhbXMuY291bnRyaWVzKXtcblx0XHRcdFx0XHRcdHZtLm12dFNvdXJjZS5vcHRpb25zLm11dGV4VG9nZ2xlID0gZmFsc2U7XG5cdFx0XHRcdFx0XHR2bS5tdnRTb3VyY2Uuc2V0U3R5bGUoaW52ZXJ0ZWRTdHlsZSk7XG5cdFx0XHRcdFx0XHR2bS5tdnRTb3VyY2UubGF5ZXJzW3ZtLm12dENvdW50cnlMYXllckdlb21dLmZlYXR1cmVzW3ZtLmN1cnJlbnQuaXNvXS5zZWxlY3RlZCA9IHRydWU7XG5cdFx0XHRcdFx0XHR2YXIgY291bnRyaWVzID0gJHN0YXRlLnBhcmFtcy5jb3VudHJpZXMuc3BsaXQoJy12cy0nKTtcblx0XHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChjb3VudHJpZXMsIGZ1bmN0aW9uKGlzbyl7XG5cdFx0XHRcdFx0XHRcdHZtLm12dFNvdXJjZS5sYXllcnNbdm0ubXZ0Q291bnRyeUxheWVyR2VvbV0uZmVhdHVyZXNbaXNvXS5zZWxlY3RlZCA9IHRydWU7XG5cdFx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNle1xuXHRcdFx0XHRcdFx0dm0ubXZ0U291cmNlLnNldFN0eWxlKGNvdW50cmllc1N0eWxlKTtcblx0XHRcdFx0XHRcdGlmKCRzdGF0ZS5wYXJhbXMuaXRlbSl7XG5cdFx0XHRcdFx0XHRcdFx0dm0ubXZ0U291cmNlLmxheWVyc1t2bS5tdnRDb3VudHJ5TGF5ZXJHZW9tXS5mZWF0dXJlc1skc3RhdGUucGFyYW1zLml0ZW1dLnNlbGVjdGVkID0gdHJ1ZTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Ly92bS5tdnRTb3VyY2UucmVkcmF3KCk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHR2bS5tdnRTb3VyY2Uub3B0aW9ucy5vbkNsaWNrID0gZnVuY3Rpb24gKGV2dCwgdCkge1xuXHRcdFx0XHRcdGlmICghdm0uY29tcGFyZS5hY3RpdmUpIHtcblx0XHRcdFx0XHRcdHZhciBjID0gZ2V0TmF0aW9uQnlJc28oZXZ0LmZlYXR1cmUucHJvcGVydGllc1t2bS5pc29fZmllbGRdKTtcblx0XHRcdFx0XHRcdGlmICh0eXBlb2YgY1t2bS5zdHJ1Y3R1cmUubmFtZV0gIT0gXCJ1bmRlZmluZWRcIikge1xuXHRcdFx0XHRcdFx0XHR2bS5jdXJyZW50ID0gZ2V0TmF0aW9uQnlJc28oZXZ0LmZlYXR1cmUucHJvcGVydGllc1t2bS5pc29fZmllbGRdKTtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFRvYXN0U2VydmljZS5lcnJvcignTm8gaW5mbyBhYm91dCB0aGlzIGxvY2F0aW9uIScpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRjb25zb2xlLmxvZyhldnQpO1xuXHRcdFx0XHRcdFx0dmFyIGMgPSBnZXROYXRpb25CeUlzbyhldnQuZmVhdHVyZS5wcm9wZXJ0aWVzW3ZtLmlzb19maWVsZF0pO1xuXHRcdFx0XHRcdFx0aWYgKHR5cGVvZiBjW3ZtLnN0cnVjdHVyZS5uYW1lXSAhPSBcInVuZGVmaW5lZFwiKSB7XG5cdFx0XHRcdFx0XHRcdHZtLnRvZ2dsZUNvdW50cmllTGlzdChjKTtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFRvYXN0U2VydmljZS5lcnJvcignTm8gaW5mbyBhYm91dCB0aGlzIGxvY2F0aW9uIScpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fVxuXHR9KTtcbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignSW5kZXhiYXNlQ3RybCcsIGZ1bmN0aW9uICgkc2NvcGUsJHN0YXRlKSB7XG5cdFx0Ly9cbiAgICAkc2NvcGUuJHN0YXRlID0gJHN0YXRlO1xuXHR9KTtcbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignSW5kZXhGaW5hbEN0cmwnLCBmdW5jdGlvbiAoJHN0YXRlLCBJbmRleFNlcnZpY2UsIERhdGFTZXJ2aWNlLCB0b2FzdHIpIHtcblx0XHQvL1xuXHRcdHZhciB2bSA9IHRoaXM7XG5cdFx0dm0uZGF0YSA9IEluZGV4U2VydmljZS5nZXREYXRhKCk7XG5cdFx0dm0ubWV0YSA9IEluZGV4U2VydmljZS5nZXRNZXRhKCk7XG5cdFx0dm0uZXJyb3JzID0gSW5kZXhTZXJ2aWNlLmdldEVycm9ycygpO1xuXHRcdHZtLmluZGljYXRvcnMgPSBJbmRleFNlcnZpY2UuZ2V0SW5kaWNhdG9ycygpO1xuXHRcdHZtLnNhdmVEYXRhID0gc2F2ZURhdGE7XG5cblxuXHRcdGFjdGl2YXRlKCk7XG5cblx0XHRmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcblx0XHRcdGlmICh2bS5tZXRhLnllYXJfZmllbGQpIHtcblx0XHRcdFx0dm0ubWV0YS55ZWFyID0gdm0uZGF0YVswXS5kYXRhWzBdW3ZtLm1ldGEueWVhcl9maWVsZF07XG5cdFx0XHR9XG5cdFx0XHRjaGVja0RhdGEoKTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBjaGVja0RhdGEoKSB7XG5cdFx0XHRpZiAoIXZtLmRhdGEpIHtcblx0XHRcdFx0JHN0YXRlLmdvKCdhcHAuaW5kZXguY3JlYXRlJyk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gc2F2ZURhdGEodmFsaWQpIHtcblx0XHRcdGlmICh2YWxpZCkge1xuXHRcdFx0XHR2YXIgaW5zZXJ0RGF0YSA9IHtcblx0XHRcdFx0XHRkYXRhOiBbXVxuXHRcdFx0XHR9O1xuXHRcdFx0XHR2YXIgaW5zZXJ0TWV0YSA9IFtdLFxuXHRcdFx0XHRcdGZpZWxkcyA9IFtdO1xuXHRcdFx0XHR2bS5sb2FkaW5nID0gdHJ1ZTtcblx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLmRhdGEsIGZ1bmN0aW9uIChpdGVtLCBrZXkpIHtcblx0XHRcdFx0XHRpZiAoaXRlbS5lcnJvcnMubGVuZ3RoID09IDApIHtcblx0XHRcdFx0XHRcdGl0ZW0uZGF0YVswXS55ZWFyID0gdm0ubWV0YS55ZWFyO1xuXHRcdFx0XHRcdFx0aWYodm0ubWV0YS55ZWFyX2ZpZWxkICYmIHZtLm1ldGEueWVhcl9maWVsZCAhPSBcInllYXJcIikge1xuXHRcdFx0XHRcdFx0XHRkZWxldGUgaXRlbS5kYXRhWzBdW3ZtLm1ldGEueWVhcl9maWVsZF07XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR2bS5tZXRhLmlzb190eXBlID0gaXRlbS5kYXRhWzBdW3ZtLm1ldGEuaXNvX2ZpZWxkXS5sZW5ndGggPT0gMyA/ICdpc28tMzE2Ni0xJyA6ICdpc28tMzE2Ni0yJztcblx0XHRcdFx0XHRcdGluc2VydERhdGEuZGF0YS5wdXNoKGl0ZW0uZGF0YVswXSk7XG5cblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0dG9hc3RyLmVycm9yKCdUaGVyZSBhcmUgc29tZSBlcnJvcnMgbGVmdCEnLCAnSHVjaCEnKTtcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRhbmd1bGFyLmZvckVhY2godm0uaW5kaWNhdG9ycywgZnVuY3Rpb24gKGl0ZW0sIGtleSkge1xuXHRcdFx0XHRcdGlmIChrZXkgIT0gdm0ubWV0YS5pc29fZmllbGQgJiYga2V5ICE9IHZtLm1ldGEuY291bnRyeV9maWVsZCkge1xuXHRcdFx0XHRcdFx0dmFyIHN0eWxlX2lkID0gMDtcblx0XHRcdFx0XHRcdGlmICh0eXBlb2Ygdm0uaW5kaWNhdG9yc1trZXldLnN0eWxlICE9IFwidW5kZWZpbmVkXCIpIHtcblx0XHRcdFx0XHRcdFx0c3R5bGVfaWQgPSB2bS5pbmRpY2F0b3JzW2tleV0uc3R5bGUuaWQ7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR2YXIgZmllbGQgPSB7XG5cdFx0XHRcdFx0XHRcdCdjb2x1bW4nOiBrZXksXG5cdFx0XHRcdFx0XHRcdCd0aXRsZSc6IHZtLmluZGljYXRvcnNba2V5XS50aXRsZSxcblx0XHRcdFx0XHRcdFx0J2Rlc2NyaXB0aW9uJzogdm0uaW5kaWNhdG9yc1trZXldLmRlc2NyaXB0aW9uLFxuXHRcdFx0XHRcdFx0XHQnbWVhc3VyZV90eXBlX2lkJzogdm0uaW5kaWNhdG9yc1trZXldLnR5cGUuaWQgfHwgMCxcblx0XHRcdFx0XHRcdFx0J2lzX3B1YmxpYyc6IHZtLmluZGljYXRvcnNba2V5XS5pc19wdWJsaWMgfHwgMCxcblx0XHRcdFx0XHRcdFx0J3N0eWxlX2lkJzogc3R5bGVfaWQsXG5cdFx0XHRcdFx0XHRcdCdkYXRhcHJvdmlkZXJfaWQnOiB2bS5pbmRpY2F0b3JzW2tleV0uZGF0YXByb3ZpZGVyLmlkIHx8IDBcblx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0XHR2YXIgY2F0ZWdvcmllcyA9IFtdO1xuXHRcdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLmluZGljYXRvcnNba2V5XS5jYXRlZ29yaWVzLCBmdW5jdGlvbiAoY2F0KSB7XG5cdFx0XHRcdFx0XHRcdGNhdGVnb3JpZXMucHVzaChjYXQuaWQpO1xuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRmaWVsZC5jYXRlZ29yaWVzID0gY2F0ZWdvcmllcztcblx0XHRcdFx0XHRcdGZpZWxkcy5wdXNoKGZpZWxkKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHR2bS5tZXRhLmZpZWxkcyA9IGZpZWxkcztcblx0XHRcdFx0Y29uc29sZS5sb2codm0ubWV0YSk7XG5cdFx0XHRcdERhdGFTZXJ2aWNlLnBvc3QoJ2RhdGEvdGFibGVzJywgdm0ubWV0YSkudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcblx0XHRcdFx0XHREYXRhU2VydmljZS5wb3N0KCdkYXRhL3RhYmxlcy8nICsgcmVzcG9uc2UudGFibGVfbmFtZSArICcvaW5zZXJ0JywgaW5zZXJ0RGF0YSkudGhlbihmdW5jdGlvbiAocmVzKSB7XG5cdFx0XHRcdFx0XHRpZiAocmVzID09IHRydWUpIHtcblx0XHRcdFx0XHRcdFx0dG9hc3RyLnN1Y2Nlc3MoaW5zZXJ0RGF0YS5kYXRhLmxlbmd0aCArICcgaXRlbXMgaW1wb3J0ZXQgdG8gJyArIHZtLm1ldGEubmFtZSwgJ1N1Y2Nlc3MnKTtcblx0XHRcdFx0XHRcdFx0SW5kZXhTZXJ2aWNlLmNsZWFyKCk7XG5cdFx0XHRcdFx0XHRcdCRzdGF0ZS5nbygnYXBwLmluZGV4Lm15ZGF0YScpO1xuXHRcdFx0XHRcdFx0XHR2bS5kYXRhID0gW107XG5cdFx0XHRcdFx0XHRcdHZtLnN0ZXAgPSAwO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0dm0ubG9hZGluZyA9IGZhbHNlO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9LCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcblx0XHRcdFx0XHRpZiAocmVzcG9uc2UubWVzc2FnZSkge1xuXHRcdFx0XHRcdFx0dG9hc3RyLmVycm9yKHJlc3BvbnNlLm1lc3NhZ2UsICdPdWNoIScpO1xuXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHZtLmxvYWRpbmcgPSBmYWxzZTtcblx0XHRcdFx0fSlcblx0XHRcdH1cblx0XHR9XG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignSW5kZXhGaW5hbE1lbnVDdHJsJywgZnVuY3Rpb24oSW5kZXhTZXJ2aWNlKXtcbiAgICAgIHZhciB2bSA9IHRoaXM7XG4gICAgICB2bS5kYXRhID0gSW5kZXhTZXJ2aWNlLmdldERhdGEoKTtcbiAgICAgIHZtLm1ldGEgPSBJbmRleFNlcnZpY2UuZ2V0TWV0YSgpO1xuICAgICAgdm0uaW5kaWNhdG9ycyA9IEluZGV4U2VydmljZS5nZXRJbmRpY2F0b3JzKCk7XG4gICAgICB2bS5pbmRpY2F0b3JzTGVuZ3RoID0gT2JqZWN0LmtleXModm0uaW5kaWNhdG9ycykubGVuZ3RoO1xuXG4gICAgfSk7XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignSW5kZXhNZXRhQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgJHN0YXRlLCBWZWN0b3JsYXllclNlcnZpY2UsJHRpbWVvdXQsSW5kZXhTZXJ2aWNlLGxlYWZsZXREYXRhLCB0b2FzdHIpe1xuICAgICAgICAvL1xuXG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG4gICAgICAgIHZtLm1pbiA9IDEwMDAwMDAwO1xuICAgICAgICB2bS5tYXggPSAwO1xuICAgICAgICB2bS5pbmRpY2F0b3JzID0gW107XG4gICAgICAgIHZtLnNjYWxlID0gXCJcIjtcbiAgICAgICAgdm0uZGF0YSA9IEluZGV4U2VydmljZS5nZXREYXRhKCk7XG4gICAgICAgIHZtLm1ldGEgPSBJbmRleFNlcnZpY2UuZ2V0TWV0YSgpO1xuICAgICAgICB2bS5lcnJvcnMgPSBJbmRleFNlcnZpY2UuZ2V0RXJyb3JzKCk7XG4gICAgICAgIHZtLmluZGljYXRvciA9IEluZGV4U2VydmljZS5hY3RpdmVJbmRpY2F0b3IoKTtcbiAgICAgICAgdm0uY291bnRyaWVzU3R5bGUgPSBjb3VudHJpZXNTdHlsZTtcbiAgICAgICAgVmVjdG9ybGF5ZXJTZXJ2aWNlLmNyZWF0ZUNhbnZhcygnI2ZmMDAwMCcpO1xuXG5cbiAgICAgICAgYWN0aXZhdGUoKTtcblxuICAgICAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpe1xuICAgICAgICAgIGNoZWNrRGF0YSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gY2hlY2tEYXRhKCl7XG4gICAgICAgICAgaWYoIXZtLmRhdGEpe1xuICAgICAgICAgICAgJHN0YXRlLmdvKCdhcHAuaW5kZXguY3JlYXRlJyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgJHNjb3BlLiR3YXRjaChmdW5jdGlvbigpeyByZXR1cm4gSW5kZXhTZXJ2aWNlLmFjdGl2ZUluZGljYXRvcigpfSwgZnVuY3Rpb24obixvKXtcbiAgICAgICAgICBpZihuID09PSBvKXJldHVybjtcbiAgICAgICAgICB2bS5pbmRpY2F0b3IgPSBuO1xuICAgICAgICAgIHZtLm1pbiA9IDEwMDAwMDAwO1xuICAgICAgICAgIHZtLm1heCA9IDA7XG4gICAgICAgICAgaWYodm0uaW5kaWNhdG9yLnN0eWxlKXtcbiAgICAgICAgICAgIFZlY3RvcmxheWVyU2VydmljZS51cGRhdGVDYW52YXModm0uaW5kaWNhdG9yLnN0eWxlLmJhc2VfY29sb3IpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBkcmF3Q291bnRyaWVzKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICRzY29wZS4kd2F0Y2goJ3ZtLmluZGljYXRvcicsIGZ1bmN0aW9uKG4sbyl7XG4gICAgICAgICAgaWYobiA9PT0gbykgcmV0dXJuO1xuICAgICAgICAgIGlmKHR5cGVvZiBuLnN0eWxlX2lkICE9IFwidW5kZWZpbmVkXCIgKXtcbiAgICAgICAgICAgIGlmKG4uc3R5bGVfaWQgIT0gby5zdHlsZV9pZCl7XG4gICAgICAgICAgICAgIGlmKG4uc3R5bGUpe1xuICAgICAgICAgICAgICAgIFZlY3RvcmxheWVyU2VydmljZS51cGRhdGVDYW52YXMobi5zdHlsZS5iYXNlX2NvbG9yKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICAgICAgVmVjdG9ybGF5ZXJTZXJ2aWNlLnVwZGF0ZUNhbnZhcygnI2ZmMDAwMCcpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGRyYXdDb3VudHJpZXMoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgIGlmKHR5cGVvZiBuLmNhdGVnb3JpZXMgIT0gXCJ1bmRlZmluZWRcIil7XG4gICAgICAgICAgICAgIGlmKG4uY2F0ZWdvcmllcy5sZW5ndGgpe1xuICAgICAgICAgICAgICAgIFZlY3RvcmxheWVyU2VydmljZS51cGRhdGVDYW52YXMobi5jYXRlZ29yaWVzWzBdLnN0eWxlLmJhc2VfY29sb3IpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICAgICAgVmVjdG9ybGF5ZXJTZXJ2aWNlLnVwZGF0ZUNhbnZhcygnI2ZmMDAwMCcpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBkcmF3Q291bnRyaWVzKCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vSW5kZXhTZXJ2aWNlLnNldEFjdGl2ZUluZGljYXRvckRhdGEobik7XG4gICAgICAgICAgSW5kZXhTZXJ2aWNlLnNldFRvTG9jYWxTdG9yYWdlKCk7XG4gICAgICAgIH0sdHJ1ZSk7XG5cblxuICAgICAgICBmdW5jdGlvbiBtaW5NYXgoKXtcbiAgICAgICAgICB2bS5taW4gPSAxMDAwMDAwMDtcbiAgICAgICAgICB2bS5tYXggPSAwO1xuICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaCh2bS5kYXRhLCBmdW5jdGlvbihpdGVtLCBrZXkpe1xuICAgICAgICAgICAgICB2bS5taW4gPSBNYXRoLm1pbihpdGVtLmRhdGFbMF1bdm0uaW5kaWNhdG9yLmNvbHVtbl9uYW1lXSwgdm0ubWluKTtcbiAgICAgICAgICAgICAgdm0ubWF4ID0gTWF0aC5tYXgoaXRlbS5kYXRhWzBdW3ZtLmluZGljYXRvci5jb2x1bW5fbmFtZV0sIHZtLm1heCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgdm0uc2NhbGUgPSBkMy5zY2FsZS5saW5lYXIoKS5kb21haW4oW3ZtLm1pbix2bS5tYXhdKS5yYW5nZShbMCwxMDBdKTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBnZXRWYWx1ZUJ5SXNvKGlzbyl7XG4gICAgICAgICAgdmFyIHZhbHVlID0gMDtcbiAgICAgICAgICBhbmd1bGFyLmZvckVhY2godm0uZGF0YSwgZnVuY3Rpb24oaXRlbSwga2V5KXtcbiAgICAgICAgICAgICBpZihpdGVtLmRhdGFbMF1bdm0ubWV0YS5pc29fZmllbGRdID09IGlzbyl7XG4gICAgICAgICAgICAgICB2YWx1ZSA9IGl0ZW0uZGF0YVswXVt2bS5pbmRpY2F0b3IuY29sdW1uX25hbWVdO1xuICAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gY291bnRyaWVzU3R5bGUoZmVhdHVyZSkge1xuICAgIFx0XHRcdHZhciBzdHlsZSA9IHt9O1xuICAgIFx0XHRcdHZhciBpc28gPSBmZWF0dXJlLnByb3BlcnRpZXMuaXNvX2EyO1xuICAgIFx0XHRcdHZhciB2YWx1ZSA9IGdldFZhbHVlQnlJc28oaXNvKSB8fCB2bS5taW47XG4gICAgXHRcdFx0dmFyIGZpZWxkID0gdm0uaW5kaWNhdG9yLmNvbHVtbl9uYW1lO1xuICAgIFx0XHRcdHZhciB0eXBlID0gZmVhdHVyZS50eXBlO1xuXG4gICAgXHRcdFx0c3dpdGNoICh0eXBlKSB7XG4gICAgXHRcdFx0Y2FzZSAzOiAvLydQb2x5Z29uJ1xuXG4gICAgXHRcdFx0XHRcdHZhciBjb2xvclBvcyA9IHBhcnNlSW50KDI1NiAvIDEwMCAqIHBhcnNlSW50KHZtLnNjYWxlKHZhbHVlKSkpICogNDtcbiAgICBcdFx0XHRcdFx0dmFyIGNvbG9yID0gJ3JnYmEoJyArIFZlY3RvcmxheWVyU2VydmljZS5nZXRDb2xvcihjb2xvclBvcykgKyAnLCAnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldENvbG9yKGNvbG9yUG9zICsgMSkgKyAnLCAnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldENvbG9yKGNvbG9yUG9zICsgMikgKyAnLCcgKyBWZWN0b3JsYXllclNlcnZpY2UuZ2V0Q29sb3IoY29sb3JQb3MgKyAzKSArICcpJztcbiAgICAgICAgICAgICAgc3R5bGUuY29sb3IgPSAncmdiYSgnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldENvbG9yKGNvbG9yUG9zKSAgKyAnLCAnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldENvbG9yKGNvbG9yUG9zICsgMSkgKyAnLCAnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldENvbG9yKGNvbG9yUG9zICsgMikgKyAnLDAuNiknOyAvL2NvbG9yO1xuICAgIFx0XHRcdFx0XHRzdHlsZS5vdXRsaW5lID0ge1xuICAgIFx0XHRcdFx0XHRcdGNvbG9yOiBjb2xvcixcbiAgICBcdFx0XHRcdFx0XHRzaXplOiAxXG4gICAgXHRcdFx0XHRcdH07XG4gICAgXHRcdFx0XHRcdHN0eWxlLnNlbGVjdGVkID0ge1xuICAgIFx0XHRcdFx0XHRcdGNvbG9yOiAncmdiYSgnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldENvbG9yKGNvbG9yUG9zKSArICcsICcgKyBWZWN0b3JsYXllclNlcnZpY2UuZ2V0Q29sb3IoY29sb3JQb3MgKyAxKSArICcsICcgKyBWZWN0b3JsYXllclNlcnZpY2UuZ2V0Q29sb3IoY29sb3JQb3MgKyAyKSArICcsMC4zKScsXG4gICAgXHRcdFx0XHRcdFx0b3V0bGluZToge1xuICAgIFx0XHRcdFx0XHRcdFx0Y29sb3I6ICdyZ2JhKDY2LDY2LDY2LDAuOSknLFxuICAgIFx0XHRcdFx0XHRcdFx0c2l6ZTogMlxuICAgIFx0XHRcdFx0XHRcdH1cbiAgICBcdFx0XHRcdFx0fTtcbiAgICBcdFx0XHRcdFx0YnJlYWs7XG5cbiAgICBcdFx0XHR9XG5cbiAgICBcdFx0XHRpZiAoZmVhdHVyZS5sYXllci5uYW1lID09PSBWZWN0b3JsYXllclNlcnZpY2UuZ2V0TmFtZSgpKydfZ2VvbScpIHtcbiAgICBcdFx0XHRcdHN0eWxlLnN0YXRpY0xhYmVsID0gZnVuY3Rpb24gKCkge1xuICAgIFx0XHRcdFx0XHR2YXIgc3R5bGUgPSB7XG4gICAgXHRcdFx0XHRcdFx0aHRtbDogZmVhdHVyZS5wcm9wZXJ0aWVzLm5hbWUsXG4gICAgXHRcdFx0XHRcdFx0aWNvblNpemU6IFsxMjUsIDMwXSxcbiAgICBcdFx0XHRcdFx0XHRjc3NDbGFzczogJ2xhYmVsLWljb24tdGV4dCdcbiAgICBcdFx0XHRcdFx0fTtcbiAgICBcdFx0XHRcdFx0cmV0dXJuIHN0eWxlO1xuICAgIFx0XHRcdFx0fTtcbiAgICBcdFx0XHR9XG4gICAgXHRcdFx0cmV0dXJuIHN0eWxlO1xuICAgIFx0XHR9XG4gICAgICAgIGZ1bmN0aW9uIHNldENvdW50cmllcygpe1xuICAgICAgICAgIHZtLm12dFNvdXJjZS5zZXRTdHlsZShjb3VudHJpZXNTdHlsZSk7XG4gICAgICAgICAgdm0ubXZ0U291cmNlLnJlZHJhdygpXG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gZHJhd0NvdW50cmllcygpIHtcbiAgICAgICAgICBtaW5NYXgoKTtcbiAgICBcdFx0XHRsZWFmbGV0RGF0YS5nZXRNYXAoJ21hcCcpLnRoZW4oZnVuY3Rpb24gKG1hcCkge1xuICAgIFx0XHRcdFx0dm0ubWFwID0gbWFwO1xuICAgIFx0XHRcdFx0dm0ubXZ0U291cmNlID0gVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldExheWVyKCk7XG4gICAgXHRcdFx0XHQkdGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgXHRcdFx0XHRcdFx0c2V0Q291bnRyaWVzKCk7XG4gICAgXHRcdFx0XHR9KTtcbiAgICBcdFx0XHR9KTtcbiAgICBcdFx0fVxuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignSW5kZXhNZXRhTWVudUN0cmwnLCBmdW5jdGlvbigkc2NvcGUsRGF0YVNlcnZpY2UsRGlhbG9nU2VydmljZSwgSW5kZXhTZXJ2aWNlKXtcbiAgICAgIHZhciB2bSA9IHRoaXM7XG4gICAgICB2bS5kYXRhID0gSW5kZXhTZXJ2aWNlLmdldERhdGEoKTtcbiAgICAgIHZtLm1ldGEgPSBJbmRleFNlcnZpY2UuZ2V0TWV0YSgpO1xuICAgICAgdm0uaW5kaWNhdG9ycyA9IEluZGV4U2VydmljZS5nZXRJbmRpY2F0b3JzKCk7XG4gICAgICB2bS5zZWxlY3RGb3JFZGl0aW5nID0gc2VsZWN0Rm9yRWRpdGluZztcbiAgICAgIHZtLmNoZWNrRnVsbCA9IGNoZWNrRnVsbDtcbiAgICAgIHZtLmNoZWNrQmFzID0gY2hlY2tCYXNlO1xuXG4gICAgICBmdW5jdGlvbiBzZWxlY3RGb3JFZGl0aW5nKGtleSl7XG4gICAgICAgIGlmKHR5cGVvZiBJbmRleFNlcnZpY2UuZ2V0SW5kaWNhdG9yKGtleSkgPT0gXCJ1bmRlZmluZWRcIil7XG4gICAgICAgICAgSW5kZXhTZXJ2aWNlLnNldEluZGljYXRvcihrZXkse1xuICAgICAgICAgICAgY29sdW1uX25hbWU6a2V5LFxuICAgICAgICAgICAgdGl0bGU6a2V5XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgdm0uZWRpdGluZ0l0ZW0gPSBrZXk7XG4gICAgICAgIHZtLmluZGljYXRvciA9IEluZGV4U2VydmljZS5nZXRJbmRpY2F0b3Ioa2V5KTtcbiAgICAgICAgSW5kZXhTZXJ2aWNlLnNldFRvTG9jYWxTdG9yYWdlKCk7XG4gICAgICB9XG4gICAgICBmdW5jdGlvbiBjaGVja0Jhc2UoaXRlbSl7XG4gICAgICAgIGlmKHR5cGVvZiBpdGVtID09IFwidW5kZWZpbmVkXCIpIHJldHVybiBmYWxzZTtcbiAgXHRcdFx0aWYgKGl0ZW0udGl0bGUgJiYgaXRlbS50eXBlICYmIGl0ZW0uZGF0YXByb3ZpZGVyICYmIGl0ZW0udGl0bGUubGVuZ3RoID49IDMpIHtcbiAgXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcbiAgXHRcdFx0fVxuICBcdFx0XHRyZXR1cm4gZmFsc2U7XG4gIFx0XHR9XG4gIFx0XHRmdW5jdGlvbiBjaGVja0Z1bGwoaXRlbSl7XG4gICAgICAgIGlmKHR5cGVvZiBpdGVtID09IFwidW5kZWZpbmVkXCIgfHwgdHlwZW9mIGl0ZW0uY2F0ZWdvcmllcyA9PSBcInVuZGVmaW5lZFwiKSByZXR1cm4gZmFsc2U7XG4gIFx0XHRcdHJldHVybiBjaGVja0Jhc2UoaXRlbSkgJiYgaXRlbS5jYXRlZ29yaWVzLmxlbmd0aCA/IHRydWUgOiBmYWxzZTtcbiAgXHRcdH1cbiAgICAgICRzY29wZS4kd2F0Y2goZnVuY3Rpb24oKXsgcmV0dXJuIEluZGV4U2VydmljZS5hY3RpdmVJbmRpY2F0b3IoKX0sIGZ1bmN0aW9uKG4sbyl7XG4gICAgICAgIGlmKG4gPT09IG8pcmV0dXJuO1xuICAgICAgICB2bS5pbmRpY2F0b3JzW24uY29sdW1uX25hbWVdID0gbjtcbiAgICAgIH0sdHJ1ZSk7XG4gICAgICAkc2NvcGUuJHdhdGNoKGZ1bmN0aW9uKCl7IHJldHVybiBJbmRleFNlcnZpY2UuYWN0aXZlSW5kaWNhdG9yKCl9LCBmdW5jdGlvbihuLG8pe1xuICAgICAgICBpZiAobiA9PT0gbyB8fCB0eXBlb2YgbyA9PSBcInVuZGVmaW5lZFwiKSByZXR1cm47XG4gICAgICAgIGlmKCF2bS5hc2tlZFRvUmVwbGljYXRlKSB7XG4gICAgICAgICAgdm0ucHJlUHJvdmlkZXIgPSB2bS5pbmRpY2F0b3JzW28uY29sdW1uX25hbWVdLmRhdGFwcm92aWRlcjtcbiAgICAgICAgICB2bS5wcmVNZWFzdXJlID0gdm0uaW5kaWNhdG9yc1tvLmNvbHVtbl9uYW1lXS5tZWFzdXJlX3R5cGVfaWQ7XG4gICAgICAgICAgdm0ucHJlVHlwZSA9IHZtLmluZGljYXRvcnNbby5jb2x1bW5fbmFtZV0udHlwZTtcbiAgICAgICAgICB2bS5wcmVDYXRlZ29yaWVzID0gdm0uaW5kaWNhdG9yc1tvLmNvbHVtbl9uYW1lXS5jYXRlZ29yaWVzO1xuICAgICAgICAgIHZtLnByZVB1YmxpYyA9IHZtLmluZGljYXRvcnNbby5jb2x1bW5fbmFtZV0uaXNfcHVibGljO1xuICAgICAgICAgIHZtLnByZVN0eWxlID0gdm0uaW5kaWNhdG9yc1tvLmNvbHVtbl9uYW1lXS5zdHlsZTtcblxuICAgICAgICAgIERpYWxvZ1NlcnZpY2UuZnJvbVRlbXBsYXRlKCdjb3B5cHJvdmlkZXInLCAkc2NvcGUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vbi5kYXRhcHJvdmlkZXIgPSB2bS5kb1Byb3ZpZGVycyA/IHZtLnByZVByb3ZpZGVyIDogW107XG4gICAgICAgICAgLy9uLm1lYXN1cmVfdHlwZV9pZCA9IHZtLmRvTWVhc3VyZXMgPyB2bS5wcmVNZWFzdXJlIDogMDtcbiAgICAgICAgICAvL24uY2F0ZWdvcmllcyA9IHZtLmRvQ2F0ZWdvcmllcyA/IHZtLnByZUNhdGVnb3JpZXM6IFtdO1xuICAgICAgICAgIC8vbi5pc19wdWJsaWMgPSB2bS5kb1B1YmxpYyA/IHZtLnByZVB1YmxpYzogZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgfSk7XG4gICAgfSk7XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignSW5kZXhNeURhdGFDdHJsJywgZnVuY3Rpb24oKXtcbiAgICAgICAgLy9cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0luZGV4TXlEYXRhRW50cnlDdHJsJywgZnVuY3Rpb24oVXNlclNlcnZpY2Upe1xuICAgICAgdmFyIHZtID0gdGhpcztcbiAgICAgIHZtLmRhdGEgPSBVc2VyU2VydmljZS5teURhdGEoKTtcbiAgICB9KTtcbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdJbmRleE15RGF0YU1lbnVDdHJsJywgZnVuY3Rpb24oVXNlclNlcnZpY2Upe1xuICAgICAgdmFyIHZtID0gdGhpcztcbiAgICAgIHZtLmRhdGEgPSBVc2VyU2VydmljZS5teURhdGEoKTtcbiAgICB9KTtcbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdJbmRleGNyZWF0b3JDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBEaWFsb2dTZXJ2aWNlLERhdGFTZXJ2aWNlLCAkdGltZW91dCwkc3RhdGUsICRmaWx0ZXIsIGxlYWZsZXREYXRhLCB0b2FzdHIsIEljb25zU2VydmljZSxJbmRleFNlcnZpY2UsIFZlY3RvcmxheWVyU2VydmljZSl7XG5cbiAgICAgICAgLy9UT0RPOiBDaGVjayBpZiB0aGVyZSBpcyBkYXRhIGluIHN0b3JhZ2UgdG8gZmluaXNoXG4gICAgICAvKiAgY29uc29sZS5sb2coJHN0YXRlKTtcbiAgICAgICAgaWYoJHN0YXRlLmN1cnJlbnQubmFtZSA9PSAnYXBwLmluZGV4LmNyZWF0ZScpe1xuICAgICAgICAgIGlmKEluZGV4U2VydmljZS5nZXREYXRhKCkubGVuZ3RoKXtcbiAgICAgICAgICAgIGlmKGNvbmZpcm0oJ0V4aXN0aW5nIERhdGEuIEdvIE9uPycpKXtcbiAgICAgICAgICAgICAgJHN0YXRlLmdvKCdhcHAuaW5kZXguY2hlY2snKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICAgIEluZGV4U2VydmljZS5jbGVhcigpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSovXG5cbiAgICAgICAgdmFyIHZtID0gdGhpcztcbiAgICAgICAgdm0ubWFwID0gbnVsbDtcbiAgICAgICAgdm0uZGF0YSA9IFtdO1xuICAgICAgICB2bS50b1NlbGVjdCA9IFtdO1xuICAgICAgICB2bS5zZWxlY3RlZCA9IFtdO1xuICAgICAgICB2bS5zZWxlY3RlZFJvd3MgPSBbXTtcbiAgICAgICAgdm0uc2VsZWN0ZWRSZXNvdXJjZXMgPVtdO1xuICAgICAgICB2bS5zb3J0ZWRSZXNvdXJjZXMgPSBbXTtcblxuICAgICAgICB2bS5ncm91cHMgPSBbXTtcbiAgICAgICAgdm0ubXlEYXRhID0gW107XG4gICAgICAgIHZtLmFkZERhdGFUbyA9IHt9O1xuICAgICAgICB2bS5zZWxlY3RlZEZvckdyb3VwID0gW107XG4gICAgICAgIHZtLmlzb19lcnJvcnMgPSAwO1xuICAgICAgICB2bS5pc29fY2hlY2tlZCA9IGZhbHNlO1xuICAgICAgICB2bS5zYXZlRGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgdm0uc2VsZWN0ZWRJbmRleCA9IDA7XG4gICAgICAgIHZtLnN0ZXAgPSAwO1xuICAgICAgICB2bS5vcGVuQ2xvc2UgPSBvcGVuQ2xvc2U7XG4gICAgICAgIC8vdm0uc2VhcmNoID0gc2VhcmNoO1xuXG4gICAgICAgIHZtLmxpc3RSZXNvdXJjZXMgPSBsaXN0UmVzb3VyY2VzO1xuICAgICAgICB2bS50b2dnbGVMaXN0UmVzb3VyY2VzID0gdG9nZ2xlTGlzdFJlc291cmNlcztcbiAgICAgICAgdm0uc2VsZWN0ZWRSZXNvdXJjZSA9IHNlbGVjdGVkUmVzb3VyY2U7XG4gICAgICAgIHZtLnRvZ2dsZVJlc291cmNlID0gdG9nZ2xlUmVzb3VyY2U7XG4gICAgICAgIHZtLmluY3JlYXNlUGVyY2VudGFnZSA9IGluY3JlYXNlUGVyY2VudGFnZTtcbiAgICAgICAgdm0uZGVjcmVhc2VQZXJjZW50YWdlID0gZGVjcmVhc2VQZXJjZW50YWdlO1xuICAgICAgICB2bS50b2dnbGVHcm91cFNlbGVjdGlvbiA9IHRvZ2dsZUdyb3VwU2VsZWN0aW9uO1xuICAgICAgICB2bS5leGlzdHNJbkdyb3VwU2VsZWN0aW9uID0gZXhpc3RzSW5Hcm91cFNlbGVjdGlvbjtcbiAgICAgICAgdm0uYWRkR3JvdXAgPSBhZGRHcm91cDtcbiAgICAgICAgdm0uY2xvbmVTZWxlY3Rpb24gPSBjbG9uZVNlbGVjdGlvbjtcbiAgICAgICAgdm0uZWRpdEVudHJ5ID0gZWRpdEVudHJ5O1xuICAgICAgICB2bS5yZW1vdmVFbnRyeSA9IHJlbW92ZUVudHJ5O1xuICAgICAgICB2bS5zYXZlSW5kZXggPSBzYXZlSW5kZXg7XG5cbiAgICAgICAgdm0uaWNvbnMgPSBJY29uc1NlcnZpY2UuZ2V0TGlzdCgpO1xuXG5cbiAgICAgICAgdm0ubWV0YSA9IHtcbiAgICAgICAgICBpc29fZmllbGQ6ICcnLFxuICAgICAgICAgIGNvdW50cnlfZmllbGQ6JycsXG4gICAgICAgICAgdGFibGU6W11cbiAgICAgICAgfTtcbiAgICAgICAgdm0ucXVlcnkgPSB7XG4gICAgICAgICAgZmlsdGVyOiAnJyxcbiAgICAgICAgICBvcmRlcjogJy1lcnJvcnMnLFxuICAgICAgICAgIGxpbWl0OiAxNSxcbiAgICAgICAgICBwYWdlOiAxXG4gICAgICAgIH07XG5cbiAgICAgICAgLyp2bS50cmVlT3B0aW9ucyA9IHtcbiAgICAgICAgICBiZWZvcmVEcm9wOmZ1bmN0aW9uKGV2ZW50KXtcbiAgICAgICAgICAgIGlmKGV2ZW50LmRlc3Qubm9kZXNTY29wZSAhPSBldmVudC5zb3VyY2Uubm9kZXNTY29wZSl7XG4gICAgICAgICAgICAgIHZhciBpZHggPSBldmVudC5kZXN0Lm5vZGVzU2NvcGUuJG1vZGVsVmFsdWUuaW5kZXhPZihldmVudC5zb3VyY2Uubm9kZVNjb3BlLiRtb2RlbFZhbHVlKTtcbiAgICAgICAgICAgICAgaWYoaWR4ID4gLTEpe1xuICAgICAgICAgICAgICAgICBldmVudC5zb3VyY2Uubm9kZVNjb3BlLiQkYXBwbHkgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgdG9hc3RyLmVycm9yKCdPbmx5IG9uZSBlbGVtZW50IG9mIGEga2luZCBwZXIgZ3JvdXAgcG9zc2libGUhJywgJ05vdCBhbGxvd2VkIScpXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIGRyb3BwZWQ6ZnVuY3Rpb24oZXZlbnQpe1xuICAgICAgICAgICAgY2FsY1BlcmNlbnRhZ2Uodm0uZ3JvdXBzKTtcbiAgICAgICAgICB9XG4gICAgICAgIH07Ki9cblxuICAgICAgICAvL1J1biBTdGFydHVwLUZ1bmNpdG9uc1xuICAgICAgICBhY3RpdmF0ZSgpO1xuXG4gICAgICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCl7XG4gICAgICAgICAgLy9jbGVhck1hcCgpO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIG9wZW5DbG9zZShhY3RpdmUpe1xuICAgICAgICAgIHJldHVybiBhY3RpdmUgPyAncmVtb3ZlJyA6ICdhZGQnO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGNsZWFyTGF5ZXJTdHlsZShmZWF0dXJlKXtcbiAgICAgIFx0XHRcdHZhciBzdHlsZSA9IHtcbiAgICAgICAgICAgICAgY29sb3I6J3JnYmEoMjU1LDI1NSwyNTUsMCknLFxuICAgICAgICAgICAgICBvdXRsaW5lOiB7XG4gICAgXHRcdFx0XHRcdFx0Y29sb3I6ICdyZ2JhKDI1NSwyNTUsMjU1LDApJyxcbiAgICBcdFx0XHRcdFx0XHRzaXplOiAxXG4gICAgXHRcdFx0XHRcdH1cbiAgICAgICAgICAgIH07XG4gICAgICBcdFx0XHRyZXR1cm4gc3R5bGU7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gY2xlYXJNYXAoKXtcbiAgICAgICAgICBcdGxlYWZsZXREYXRhLmdldE1hcCgnbWFwJykudGhlbihmdW5jdGlvbiAobWFwKSB7XG4gICAgICAgICAgICAgIHZtLm12dFNvdXJjZSA9IFZlY3RvcmxheWVyU2VydmljZS5nZXRMYXllcigpO1xuICAgICAgICAgICAgICAkdGltZW91dChmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIHZtLm12dFNvdXJjZS5zZXRTdHlsZShjbGVhckxheWVyU3R5bGUpO1xuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuXG4gICAgICAgIGZ1bmN0aW9uIHRvZ2dsZUxpc3RSZXNvdXJjZXMoKXtcbiAgICAgICAgICB2bS5zaG93UmVzb3VyY2VzID0gIXZtLnNob3dSZXNvdXJjZXM7XG4gICAgICAgICAgaWYodm0uc2hvd1Jlc291cmNlcyl7XG4gICAgICAgICAgICB2bS5saXN0UmVzb3VyY2VzKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGxpc3RSZXNvdXJjZXMoKXtcbiAgICAgICAgICBpZighdm0ucmVzb3VyY2VzKXtcbiAgICAgICAgICAgIERhdGFTZXJ2aWNlLmdldEFsbCgnZGF0YS90YWJsZXMnKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgICAgICAgICAgdm0ucmVzb3VyY2VzID0gcmVzcG9uc2U7XG4gICAgICAgICAgICAgIHZtLnNlbGVjdGVkUmVzb3VyY2VzID0gW10sIHZtLnNvcnRlZFJlc291cmNlcyA9IFtdO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9XG5cbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBzZWxlY3RlZFJlc291cmNlKHJlc291cmNlKXtcbiAgICAgICAgICByZXR1cm4gdm0uc2VsZWN0ZWRSZXNvdXJjZXMuaW5kZXhPZihyZXNvdXJjZSkgPiAtMSA/IHRydWUgOiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBkZWxldGVGcm9tR3JvdXAocmVzb3VyY2UsIGxpc3Qpe1xuICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaChsaXN0LCBmdW5jdGlvbihpdGVtLCBrZXkpe1xuICAgICAgICAgICAgICAvL2lmKHR5cGVvZiBpdGVtLmlzR3JvdXAgPT0gXCJ1bmRlZmluZWRcIil7XG4gICAgICAgICAgICAgICAgaWYoaXRlbSA9PSByZXNvdXJjZSl7XG4gICAgICAgICAgICAgICAgICBsaXN0LnNwbGljZShrZXksIDEpO1xuICAgICAgICAgICAgICAgICAgdm0uc2VsZWN0ZWRGb3JHcm91cC5zcGxpY2Uodm0uc2VsZWN0ZWRGb3JHcm91cC5pbmRleE9mKGl0ZW0pLCAxKTtcbiAgICAgICAgICAgICAgICAgIHZtLnNlbGVjdGVkUmVzb3VyY2VzLnNwbGljZSh2bS5zZWxlY3RlZFJlc291cmNlcy5pbmRleE9mKGl0ZW0pLDEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgLy99XG4gICAgICAgICAgICAgIGRlbGV0ZUZyb21Hcm91cChyZXNvdXJjZSwgaXRlbS5ub2Rlcyk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gdG9nZ2xlUmVzb3VyY2UocmVzb3VyY2Upe1xuICAgICAgICAgIHZhciBpZHggPSB2bS5zZWxlY3RlZFJlc291cmNlcy5pbmRleE9mKHJlc291cmNlKTtcbiAgICAgICAgICBpZiggaWR4ID4gLTEpe1xuICAgICAgICAgICAgdm0uc2VsZWN0ZWRSZXNvdXJjZXMuc3BsaWNlKGlkeCwgMSk7XG4gICAgICAgICAgICBkZWxldGVGcm9tR3JvdXAocmVzb3VyY2UsIHZtLmdyb3Vwcyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICB2bS5zZWxlY3RlZFJlc291cmNlcy5wdXNoKHJlc291cmNlKTtcbiAgICAgICAgICAgIGlmKHZtLnNlbGVjdGVkRm9yR3JvdXAubGVuZ3RoID09IDEgJiYgdHlwZW9mIHZtLnNlbGVjdGVkRm9yR3JvdXBbMF0uaXNHcm91cCAhPSBcInVuZGVmaW5lZFwiKXtcbiAgICAgICAgICAgICAgdm0uc2VsZWN0ZWRGb3JHcm91cFswXS5ub2Rlcy5wdXNoKHJlc291cmNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICAgICAgdm0uZ3JvdXBzLnB1c2gocmVzb3VyY2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vY2FsY1BlcmNlbnRhZ2Uodm0uc29ydGVkUmVzb3VyY2VzKTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBjYWxjUGVyY2VudGFnZShub2Rlcyl7XG4gICAgICAgICAgYW5ndWxhci5mb3JFYWNoKG5vZGVzLCBmdW5jdGlvbihub2RlLCBrZXkpe1xuICAgICAgICAgICAgbm9kZXNba2V5XS53ZWlnaHQgPSBwYXJzZUludCgxMDAgLyBub2Rlcy5sZW5ndGgpO1xuICAgICAgICAgICAgY2FsY1BlcmNlbnRhZ2Uobm9kZXMubm9kZSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gaW5jcmVhc2VQZXJjZW50YWdlKGl0ZW0pe1xuICAgICAgICAgIGNvbnNvbGUubG9nKGl0ZW0pO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGRlY3JlYXNlUGVyY2VudGFnZShpdGVtKXtcbiAgICAgICAgICBjb25zb2xlLmxvZyhpdGVtKVxuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIHRvZ2dsZUdyb3VwU2VsZWN0aW9uKGl0ZW0pe1xuICAgICAgICAgIHZhciBpZHggPSB2bS5zZWxlY3RlZEZvckdyb3VwLmluZGV4T2YoaXRlbSk7XG4gICAgICAgICAgaWYoIGlkeCA+IC0xKXtcbiAgICAgICAgICAgIHZtLnNlbGVjdGVkRm9yR3JvdXAuc3BsaWNlKGlkeCwgMSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICB2bS5zZWxlY3RlZEZvckdyb3VwLnB1c2goaXRlbSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGV4aXN0c0luR3JvdXBTZWxlY3Rpb24oaXRlbSl7XG4gICAgICAgICAgcmV0dXJuIHZtLnNlbGVjdGVkRm9yR3JvdXAuaW5kZXhPZihpdGVtKSA+IC0xO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGFkZEdyb3VwKCl7XG4gICAgICAgICAgdmFyIG5ld0dyb3VwID0ge1xuICAgICAgICAgICAgdGl0bGU6J0dyb3VwJyxcbiAgICAgICAgICAgIGlzR3JvdXA6dHJ1ZSxcbiAgICAgICAgICAgIG5vZGVzOltdXG4gICAgICAgICAgfTtcblxuICAgICAgICAgIGlmKHZtLnNlbGVjdGVkRm9yR3JvdXAubGVuZ3RoID09IDEgJiYgdHlwZW9mIHZtLnNlbGVjdGVkRm9yR3JvdXBbMF0uaXNHcm91cCAhPSBcInVuZGVmaW5lZFwiKXtcbiAgICAgICAgICAgIHZtLnNlbGVjdGVkRm9yR3JvdXBbMF0ubm9kZXMucHVzaChuZXdHcm91cCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2UgaWYodm0uc2VsZWN0ZWRGb3JHcm91cC5sZW5ndGggPiAwICl7XG4gICAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaCh2bS5zZWxlY3RlZEZvckdyb3VwLCBmdW5jdGlvbihpdGVtLCBrZXkpe1xuICAgICAgICAgICAgICAgICAgbmV3R3JvdXAubm9kZXMucHVzaChpdGVtKTtcbiAgICAgICAgICAgICAgICAgIGRlbGV0ZUZyb21Hcm91cChpdGVtLCB2bS5zZWxlY3RlZEZvckdyb3VwKTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIHZtLmdyb3Vwcy5wdXNoKG5ld0dyb3VwKTtcbiAgICAgICAgICAgICAgdm0uc2VsZWN0ZWRGb3JHcm91cCA9IFtdO1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgdm0uZ3JvdXBzLnB1c2gobmV3R3JvdXApO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBjbG9uZVNlbGVjdGlvbigpe1xuICAgICAgICAgIHZhciBuZXdHcm91cCA9IHtcbiAgICAgICAgICAgIHRpdGxlOidDbG9uZWQgRWxlbWVudHMnLFxuICAgICAgICAgICAgaXNHcm91cDp0cnVlLFxuICAgICAgICAgICAgbm9kZXM6W11cbiAgICAgICAgICB9O1xuICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaCh2bS5zZWxlY3RlZEZvckdyb3VwLCBmdW5jdGlvbihpdGVtLCBrZXkpe1xuICAgICAgICAgICAgbmV3R3JvdXAubm9kZXMucHVzaChpdGVtKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICB2bS5ncm91cHMucHVzaChuZXdHcm91cCk7XG4gICAgICAgICAgdm0uc2VsZWN0ZWRGb3JHcm91cCA9IFtdO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGVkaXRFbnRyeShpdGVtKXtcbiAgICAgICAgICB2bS5lZGl0SXRlbSA9IGl0ZW07XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gcmVtb3ZlRW50cnkoaXRlbSwgbGlzdCl7XG4gICAgICAgICAgICBkZWxldGVGcm9tR3JvdXAoaXRlbSwgbGlzdCk7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gc2F2ZUluZGV4KCl7XG4gICAgICAgICAgaWYodm0uc2F2ZURpc2FibGVkKXtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgdm0uc2F2ZURpc2FibGVkID0gdHJ1ZTtcbiAgICAgICAgICBpZih0eXBlb2Ygdm0ubmV3SW5kZXggPT0gJ3VuZGVmaW5lZCcpe1xuICAgICAgICAgICAgdG9hc3RyLmVycm9yKCdZb3UgbmVlZCB0byBlbnRlciBhIHRpdGxlIScsJ0luZm8gbWlzc2luZycpO1xuICAgICAgICAgICAgdm0uc2F2ZURpc2FibGVkID0gZmFsc2U7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmKCF2bS5uZXdJbmRleC50aXRsZSl7XG4gICAgICAgICAgICB0b2FzdHIuZXJyb3IoJ1lvdSBuZWVkIHRvIGVudGVyIGEgdGl0bGUhJywnSW5mbyBtaXNzaW5nJyk7XG4gICAgICAgICAgICB2bS5zYXZlRGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgdm0ubmV3SW5kZXguZGF0YSA9IHZtLmdyb3VwcztcbiAgICAgICAgICBEYXRhU2VydmljZS5wb3N0KCdpbmRleCcsIHZtLm5ld0luZGV4KS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgICAgICAgIHZtLnNhdmVEaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgICAgICAgdG9hc3RyLnN1Y2Nlc3MoJ1lvdXIgSW5kZXggaGFzIGJlZW4gY3JlYXRlZCcsICdTdWNjZXNzJyksXG4gICAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC5pbmRleC5zaG93Jywge2luZGV4OnJlc3BvbnNlLm5hbWV9KTtcbiAgICAgICAgICB9LGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgICAgICAgIHZtLnNhdmVEaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgICAgICAgdG9hc3RyLmVycm9yKHJlc3BvbnNlLm1lc3NhZ2UsJ1VwcHMhIScpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIC8qJHNjb3BlLiRvbihcIiRzdGF0ZUNoYW5nZVN1Y2Nlc3NcIiwgZnVuY3Rpb24gKGV2ZW50LCB0b1N0YXRlLCB0b1BhcmFtcywgZnJvbVN0YXRlLCBmcm9tUGFyYW1zKSB7XG4gICAgICAgICAgaWYoIXZtLmRhdGEubGVuZ3RoKXtcbiAgICAgICAgICAgICRzdGF0ZS5nbygnYXBwLmluZGV4LmNyZWF0ZScpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgc3dpdGNoICh0b1N0YXRlLm5hbWUpIHtcbiAgICAgICAgICAgICAgY2FzZSAnYXBwLmluZGV4LmNyZWF0ZSc6XG4gICAgICAgICAgICAgICAgICB2bS5zdGVwID0gMDtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgY2FzZSAnYXBwLmluZGV4LmNyZWF0ZS5iYXNpYyc6XG4gICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh2bS5kYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgdm0uc3RlcCA9IDE7XG4gICAgICAgICAgICAgICAgICAgIGNoZWNrTXlEYXRhKCk7XG4gICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgY2FzZSAnYXBwLmluZGV4LmNyZWF0ZS5jaGVjayc6XG4gICAgICAgICAgICAgICAgICB2bS5zdGVwID0gMjtcbiAgICAgICAgICAgICAgICAgIHZtLnNob3dVcGxvYWRDb250YWluZXIgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgY2FzZSAnYXBwLmluZGV4LmNyZWF0ZS5tZXRhJzpcbiAgICAgICAgICAgICAgICAgIHZtLnN0ZXAgPSAzO1xuICAgICAgICAgICAgICAgICAgICB2bS5zaG93VXBsb2FkQ29udGFpbmVyID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgY2FzZSAnYXBwLmluZGV4LmNyZWF0ZS5maW5hbCc6XG4gICAgICAgICAgICAgICAgICB2bS5zdGVwID0gNDtcbiAgICAgICAgICAgICAgICAgICAgdm0uc2hvd1VwbG9hZENvbnRhaW5lciA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTsqL1xuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0luZGV4ZWRpdG9yQ3RybCcsIGZ1bmN0aW9uICgkc2NvcGUsICRmaWx0ZXIsICR0aW1lb3V0LCRzdGF0ZSwgaW5kaWNhdG9ycywgRGF0YVNlcnZpY2UsQ29udGVudFNlcnZpY2UpIHtcblx0XHQvL1xuXHRcdHZhciB2bSA9IHRoaXM7XG5cblx0XHR2bS5pbmRpY2F0b3JzID0gaW5kaWNhdG9ycztcblx0XHR2bS5zZWxlY3Rpb24gPSBbXTtcblx0XHR2bS5zZWxlY3RlZFRhYiA9IDE7XG5cdFx0dm0uZmlsdGVyID0ge1xuXHRcdFx0c29ydDondGl0bGUnLFxuXHRcdFx0cmV2ZXJzZTpmYWxzZSxcblx0XHRcdGxpc3Q6IDAsXG5cdFx0XHRwdWJsaXNoZWQ6IGZhbHNlLFxuXHRcdFx0dHlwZXM6IHtcblx0XHRcdFx0dGl0bGU6IHRydWUsXG5cdFx0XHRcdHN0eWxlOiBmYWxzZSxcblx0XHRcdFx0Y2F0ZWdvcmllczogZmFsc2UsXG5cdFx0XHRcdGluZm9ncmFwaGljOiBmYWxzZSxcblx0XHRcdFx0ZGVzY3JpcHRpb246IGZhbHNlLFxuXHRcdFx0fVxuXHRcdH07XG5cdFx0dm0uc2VhcmNoID0ge1xuXHRcdFx0cXVlcnk6ICcnLFxuXHRcdFx0c2hvdzogZmFsc2Vcblx0XHR9O1xuXHRcdHZtLm9wZW5NZW51ID0gb3Blbk1lbnU7XG5cdFx0dm0uc2VsZWN0QWxsID0gc2VsZWN0QWxsO1xuXHRcdHZtLnNlbGVjdEFsbEdyb3VwID0gc2VsZWN0QWxsR3JvdXA7XG5cdFx0dm0uc2VsZWN0ZWRJdGVtID0gc2VsZWN0ZWRJdGVtO1xuXHRcdHZtLnRvZ2dsZVNlbGVjdGlvbiA9IHRvZ2dsZVNlbGVjdGlvbjtcblx0XHR2bS5sb2FkSW5kaWNhdG9ycyA9IGxvYWRJbmRpY2F0b3JzO1xuXG5cblx0XHR2bS50b2dnbGVMaXN0ID0gdG9nZ2xlTGlzdDtcblxuXHRcdHZtLmNoZWNrVGFiQ29udGVudCA9IGNoZWNrVGFiQ29udGVudDtcblxuXHRcdGFjdGl2YXRlKCRzdGF0ZS5wYXJhbXMpO1xuXG5cdFx0ZnVuY3Rpb24gYWN0aXZhdGUocGFyYW1zKXtcblx0XHRcdHZtLnNlbGVjdGlvbiA9IFtdO1xuXG5cdFx0XHRhbmd1bGFyLmZvckVhY2godm0uaW5kaWNhdG9ycywgZnVuY3Rpb24oaXRlbSl7XG5cdFx0XHRcdGlmKGl0ZW0uaWQgPT0gcGFyYW1zLmlkKXtcblx0XHRcdFx0XHR2bS5zZWxlY3Rpb24ucHVzaChpdGVtKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gdG9nZ2xlTGlzdChrZXkpe1xuXHRcdFx0aWYodm0udmlzaWJsZUxpc3QgPT0ga2V5KXtcblx0XHRcdFx0dm0udmlzaWJsZUxpc3QgPSAnJztcblx0XHRcdH1cblx0XHRcdGVsc2V7XG5cdFx0XHRcdHZtLnZpc2libGVMaXN0ID0ga2V5O1xuXHRcdFx0fVxuXHRcdH1cblx0XHRmdW5jdGlvbiBzZWxlY3RlZEl0ZW0oaXRlbSkge1xuXHRcdFx0cmV0dXJuIHZtLnNlbGVjdGlvbi5pbmRleE9mKGl0ZW0pID4gLTEgPyB0cnVlIDogZmFsc2U7XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIHNlbGVjdEFsbCgpe1xuXHRcdFx0aWYodm0uc2VsZWN0aW9uLmxlbmd0aCl7XG5cdFx0XHRcdHZtLnNlbGVjdGlvbiA9IFtdO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZXtcblx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLmluZGljYXRvcnMsIGZ1bmN0aW9uKGl0ZW0pe1xuXHRcdFx0XHRcdGlmKHZtLnNlbGVjdGlvbi5pbmRleE9mKGl0ZW0pID09IC0xKXtcblx0XHRcdFx0XHRcdHZtLnNlbGVjdGlvbi5wdXNoKGl0ZW0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIHNlbGVjdEFsbEdyb3VwKGdyb3VwKXtcblx0XHRcdHZtLnNlbGVjdGlvbiA9IFtdO1xuXHRcdFx0YW5ndWxhci5mb3JFYWNoKGdyb3VwLCBmdW5jdGlvbihpdGVtKXtcblx0XHRcdFx0dm0uc2VsZWN0aW9uLnB1c2goaXRlbSk7XG5cdFx0XHR9KTtcblxuXHRcdH1cblx0XHRmdW5jdGlvbiB0b2dnbGVTZWxlY3Rpb24oaXRlbSkge1xuXHRcdFx0dmFyIGluZGV4ID0gdm0uc2VsZWN0aW9uLmluZGV4T2YoaXRlbSk7XG5cdFx0XHRpZiAoaW5kZXggPiAtMSkge1xuXHRcdFx0XHRyZXR1cm4gdm0uc2VsZWN0aW9uLnNwbGljZShpbmRleCwgMSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXR1cm4gdm0uc2VsZWN0aW9uLnB1c2goaXRlbSk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIGxvYWRJbmRpY2F0b3JzKCkge1xuXG5cdFx0fVxuXHRcdGZ1bmN0aW9uIGNoZWNrVGFiQ29udGVudChpbmRleCl7XG5cdFx0XHRzd2l0Y2ggKGluZGV4KSB7XG5cdFx0XHRcdGNhc2UgMDpcblxuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIDE6XG5cdFx0XHRcdFx0XHR2bS5jYXRlZ29yaWVzID0gQ29udGVudFNlcnZpY2UuZ2V0Q2F0ZWdvcmllcyh7aW5kaWNhdG9yczp0cnVlLCB0cmVlOnRydWV9KTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSAyOlxuXHRcdFx0XHRcdFx0dm0uY29tcG9zaXRzID0gRGF0YVNlcnZpY2UuZ2V0QWxsKCdtZS9pbmRpemVzJykuJG9iamVjdDtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0ZGVmYXVsdDpcblxuXHRcdFx0fVxuXHRcdH1cblx0XHRmdW5jdGlvbiBvcGVuTWVudSgkbWRPcGVuTWVudSwgZXYpIHtcblx0XHRcdCRtZE9wZW5NZW51KGV2KTtcblx0XHR9XG5cblxuXHRcdCRzY29wZS4kd2F0Y2goJ3ZtLnNlYXJjaC5xdWVyeScsIGZ1bmN0aW9uIChxdWVyeSwgb2xkUXVlcnkpIHtcblx0XHRcdGlmKHF1ZXJ5ID09PSBvbGRRdWVyeSkgcmV0dXJuIGZhbHNlO1xuXHRcdFx0dm0ucXVlcnkgPSB2bS5maWx0ZXIudHlwZXM7XG5cdFx0XHR2bS5xdWVyeS5xID0gcXVlcnk7XG5cdFx0XHR2bS5pbmRpY2F0b3JzID0gQ29udGVudFNlcnZpY2UuZmV0Y2hJbmRpY2F0b3JzKHZtLnF1ZXJ5KTtcblx0XHR9KTtcblx0XHQkc2NvcGUuJG9uKCckc3RhdGVDaGFuZ2VTdWNjZXNzJywgZnVuY3Rpb24oZnJvbVBhcmFtcywgZnJvbVN0YXRlLCB0b1BhcmFtcywgdG9TdGF0ZSl7XG5cdFx0XHRhY3RpdmF0ZSh0b1BhcmFtcyk7XG5cdFx0fSk7XG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0luZGV4ZWRpdG9yaW5kaWNhdG9yQ3RybCcsIGZ1bmN0aW9uICgkc2NvcGUsICRzdGF0ZSwkdGltZW91dCwgVmVjdG9ybGF5ZXJTZXJ2aWNlLCBsZWFmbGV0RGF0YSwgQ29udGVudFNlcnZpY2UsIGluZGljYXRvcikge1xuXHRcdC8vXG5cdFx0dmFyIHZtID0gdGhpcztcbiAgICB2bS5pbmRpY2F0b3IgPSBpbmRpY2F0b3I7XG5cdFx0dm0uc2NhbGUgPSBcIlwiO1xuXHRcdHZtLm1pbiA9IDEwMDAwMDAwO1xuXHRcdHZtLm1heCA9IDA7XG5cdFx0dm0uc2VsZWN0ZWQgPSAwO1xuXHRcdHNldEFjdGl2ZSgpO1xuXG5cdFx0Q29udGVudFNlcnZpY2UuZ2V0SW5kaWNhdG9yRGF0YSgkc3RhdGUucGFyYW1zLmlkKS50aGVuKGZ1bmN0aW9uKGRhdGEpe1xuXHRcdFx0dmFyIGJhc2VfY29sb3IgPSAnI2ZmMDAwMCc7XG5cdFx0XHRpZih0eXBlb2Ygdm0uaW5kaWNhdG9yLnN0eWxlID09IFwidW5kZWZpbmVkXCIpe1xuXHRcdFx0XHRhbmd1bGFyLmZvckVhY2godm0uaW5kaWNhdG9yLmNhdGVnb3JpZXMsIGZ1bmN0aW9uKGNhdCl7XG5cdFx0XHRcdFx0aWYodHlwZW9mIGNhdC5zdHlsZSAhPSBcInVuZGVmaW5lZFwiKXtcblx0XHRcdFx0XHRcdGJhc2VfY29sb3IgPSBjYXQuc3R5bGUuYmFzZV9jb2xvcjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSBpZih2bS5pbmRpY2F0b3Iuc3R5bGUpe1xuXHRcdFx0XHRiYXNlX2NvbG9yID0gdm0uaW5kaWNhdG9yLnN0eWxlLmJhc2VfY29sb3I7XG5cdFx0XHR9XG5cdFx0XHRWZWN0b3JsYXllclNlcnZpY2UuY3JlYXRlQ2FudmFzKGJhc2VfY29sb3IgKTtcblx0XHRcdHZtLmRhdGEgPSBkYXRhO1xuXHRcdFx0bWluTWF4KCk7XG5cdFx0XHRkcmF3Q291bnRyaWVzKCk7XG5cdFx0fSk7XG5cdFx0ZnVuY3Rpb24gc2V0QWN0aXZlKCl7XG5cdFx0XHRpZigkc3RhdGUuY3VycmVudC5uYW1lID09ICdhcHAuaW5kZXguZWRpdG9yLmluZGljYXRvci5kZXRhaWxzJyl7XG5cdFx0XHRcdGlmKCRzdGF0ZS5wYXJhbXMuZW50cnkgPT0gXCJpbmZvZ3JhcGhpY1wiKXtcblx0XHRcdFx0XHR2bS5zZWxlY3RlZCA9IDE7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSBpZigkc3RhdGUucGFyYW1zLmVudHJ5ID09IFwiaW5kaXplc1wiKXtcblx0XHRcdFx0XHR2bS5zZWxlY3RlZCA9IDI7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSBpZigkc3RhdGUucGFyYW1zLmVudHJ5ID09IFwic3R5bGVcIil7XG5cdFx0XHRcdFx0dm0uc2VsZWN0ZWQgPSAzO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2UgaWYoJHN0YXRlLnBhcmFtcy5lbnRyeSA9PSBcImNhdGVnb3JpZXNcIil7XG5cdFx0XHRcdFx0dm0uc2VsZWN0ZWQgPSA0O1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2V7XG5cdFx0XHRcdFx0dm0uc2VsZWN0ZWQgPSAwO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIG1pbk1heCgpe1xuXHRcdFx0dm0ubWluID0gMTAwMDAwMDA7XG5cdFx0XHR2bS5tYXggPSAwO1xuXHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLmRhdGEsIGZ1bmN0aW9uKGl0ZW0sIGtleSl7XG5cdFx0XHRcdFx0dm0ubWluID0gTWF0aC5taW4oaXRlbS5zY29yZSwgdm0ubWluKTtcblx0XHRcdFx0XHR2bS5tYXggPSBNYXRoLm1heChpdGVtLnNjb3JlLCB2bS5tYXgpO1xuXHRcdFx0fSk7XG5cdFx0XHR2bS5zY2FsZSA9IGQzLnNjYWxlLmxpbmVhcigpLmRvbWFpbihbdm0ubWluLHZtLm1heF0pLnJhbmdlKFswLDEwMF0pO1xuXHRcdH1cblx0XHRmdW5jdGlvbiBnZXRWYWx1ZUJ5SXNvKGlzbyl7XG5cdFx0XHR2YXIgdmFsdWUgPSAwO1xuXHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLmRhdGEsIGZ1bmN0aW9uKGl0ZW0sIGtleSl7XG5cdFx0XHRcdCBpZihpdGVtLmlzbyA9PSBpc28pe1xuXHRcdFx0XHRcdCB2YWx1ZSA9IGl0ZW0uc2NvcmU7XG5cdFx0XHRcdCB9XG5cdFx0XHR9KTtcblx0XHRcdHJldHVybiB2YWx1ZTtcblx0XHR9XG5cdFx0ZnVuY3Rpb24gY291bnRyaWVzU3R5bGUoZmVhdHVyZSkge1xuXHRcdFx0dmFyIHN0eWxlID0ge307XG5cdFx0XHR2YXIgaXNvID0gZmVhdHVyZS5wcm9wZXJ0aWVzLmlzb19hMjtcblx0XHRcdHZhciB2YWx1ZSA9IGdldFZhbHVlQnlJc28oaXNvKSB8fCB2bS5taW47XG5cdFx0XHR2YXIgdHlwZSA9IGZlYXR1cmUudHlwZTtcblxuXHRcdFx0c3dpdGNoICh0eXBlKSB7XG5cdFx0XHRcdGNhc2UgMzogLy8nUG9seWdvbidcblx0XHRcdFx0XHR2YXIgY29sb3JQb3MgPSBwYXJzZUludCgyNTYgLyAxMDAgKiBwYXJzZUludCh2bS5zY2FsZSh2YWx1ZSkpKSAqIDQ7XG5cdFx0XHRcdFx0dmFyIGNvbG9yID0gJ3JnYmEoJyArIFZlY3RvcmxheWVyU2VydmljZS5nZXRDb2xvcihjb2xvclBvcykgKyAnLCAnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldENvbG9yKGNvbG9yUG9zICsgMSkgKyAnLCAnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldENvbG9yKGNvbG9yUG9zICsgMikgKyAnLCcgKyBWZWN0b3JsYXllclNlcnZpY2UuZ2V0Q29sb3IoY29sb3JQb3MgKyAzKSArICcpJztcblx0XHRcdFx0XHRzdHlsZS5jb2xvciA9ICdyZ2JhKCcgKyBWZWN0b3JsYXllclNlcnZpY2UuZ2V0Q29sb3IoY29sb3JQb3MpICArICcsICcgKyBWZWN0b3JsYXllclNlcnZpY2UuZ2V0Q29sb3IoY29sb3JQb3MgKyAxKSArICcsICcgKyBWZWN0b3JsYXllclNlcnZpY2UuZ2V0Q29sb3IoY29sb3JQb3MgKyAyKSArICcsMC42KSc7IC8vY29sb3I7XG5cdFx0XHRcdFx0c3R5bGUub3V0bGluZSA9IHtcblx0XHRcdFx0XHRcdGNvbG9yOiBjb2xvcixcblx0XHRcdFx0XHRcdHNpemU6IDFcblx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdHN0eWxlLnNlbGVjdGVkID0ge1xuXHRcdFx0XHRcdFx0Y29sb3I6ICdyZ2JhKCcgKyBWZWN0b3JsYXllclNlcnZpY2UuZ2V0Q29sb3IoY29sb3JQb3MpICsgJywgJyArIFZlY3RvcmxheWVyU2VydmljZS5nZXRDb2xvcihjb2xvclBvcyArIDEpICsgJywgJyArIFZlY3RvcmxheWVyU2VydmljZS5nZXRDb2xvcihjb2xvclBvcyArIDIpICsgJywwLjMpJyxcblx0XHRcdFx0XHRcdG91dGxpbmU6IHtcblx0XHRcdFx0XHRcdFx0Y29sb3I6ICdyZ2JhKDY2LDY2LDY2LDAuOSknLFxuXHRcdFx0XHRcdFx0XHRzaXplOiAyXG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHN0eWxlO1xuXHRcdH1cblx0XHRmdW5jdGlvbiBkcmF3Q291bnRyaWVzKCkge1xuXHRcdFx0bWluTWF4KCk7XG5cdFx0XHRsZWFmbGV0RGF0YS5nZXRNYXAoJ21hcCcpLnRoZW4oZnVuY3Rpb24gKG1hcCkge1xuXHRcdFx0XHR2bS5tYXAgPSBtYXA7XG5cdFx0XHRcdHZtLm12dFNvdXJjZSA9IFZlY3RvcmxheWVyU2VydmljZS5nZXRMYXllcigpO1xuXHRcdFx0XHQkdGltZW91dChmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHR2bS5tdnRTb3VyY2Uuc2V0U3R5bGUoY291bnRyaWVzU3R5bGUpO1xuXHRcdFx0XHRcdC8vdm0ubXZ0U291cmNlLnJlZHJhdygpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdCRzY29wZS4kb24oJyRzdGF0ZUNoYW5nZVN1Y2Nlc3MnLCBmdW5jdGlvbigpe1xuXHRcdFx0c2V0QWN0aXZlKCk7XG5cdFx0fSk7XG5cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignSW5kZXhpbmZvQ3RybCcsIGZ1bmN0aW9uKEluZGl6ZXNTZXJ2aWNlKXtcbiAgICAgICAgdmFyIHZtID0gdGhpcztcbiAgICAgICAgdm0uc3RydWN0dXJlID0gSW5kaXplc1NlcnZpY2UuZ2V0U3RydWN0dXJlKCk7XG4gICAgfSk7XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignTG9naW5DdHJsJywgZnVuY3Rpb24oJHJvb3RTY29wZSwgJHN0YXRlLCAkYXV0aCwgdG9hc3RyKXtcbiAgICAgICAgdmFyIHZtID0gdGhpcztcbiAgICAgICAgdm0ucHJldlN0YXRlID0gbnVsbDtcbiAgICAgICAgdm0uZG9Mb2dpbiA9IGRvTG9naW47XG4gICAgICAgIHZtLmNoZWNrTG9nZ2VkSW4gPSBjaGVja0xvZ2dlZEluO1xuICAgICAgXG4gICAgICAgIHZtLnVzZXIgPSB7XG4gICAgICAgICAgZW1haWw6JycsXG4gICAgICAgICAgcGFzc3dvcmQ6JydcbiAgICAgICAgfTtcblxuICAgICAgICBhY3RpdmF0ZSgpO1xuXG4gICAgICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCl7XG4gICAgICAgICAgdm0uY2hlY2tMb2dnZWRJbigpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gY2hlY2tMb2dnZWRJbigpe1xuXG4gICAgICAgICAgaWYoJGF1dGguaXNBdXRoZW50aWNhdGVkKCkpe1xuICAgICAgICAgICAgLy8kc3RhdGUuZ28oJ2FwcC5pbmRleC5zaG93Jywge2luZGV4OidlcGknfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGRvTG9naW4oKXtcbiAgICAgICAgICAkYXV0aC5sb2dpbih2bS51c2VyKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgICAgICAgIHRvYXN0ci5zdWNjZXNzKCdZb3UgaGF2ZSBzdWNjZXNzZnVsbHkgc2lnbmVkIGluJyk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygkcm9vdFNjb3BlLnByZXZpb3VzUGFnZSk7XG4gICAgICAgICAgICAkc3RhdGUuZ28oJHJvb3RTY29wZS5wcmV2aW91c1BhZ2Uuc3RhdGUubmFtZSB8fCAnYXBwLmhvbWUnLCAkcm9vdFNjb3BlLnByZXZpb3VzUGFnZS5wYXJhbXMpO1xuICAgICAgICAgIH0pLmNhdGNoKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgICAgICAgIHRvYXN0ci5lcnJvcignUGxlYXNlIGNoZWNrIHlvdXIgZW1haWwgYW5kIHBhc3N3b3JkJywgJ1NvbWV0aGluZyB3ZW50IHdyb25nJyk7XG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignU2VsZWN0ZWRDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBnZXRDb3VudHJ5LCBWZWN0b3JsYXllclNlcnZpY2UsICRmaWx0ZXIpe1xuICAgICAgICAvL1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuICAgICAgICB2bS5zdHJ1Y3R1cmUgPSAkc2NvcGUuJHBhcmVudC52bS5zdHJ1Y3R1cmU7XG4gICAgICAgIHZtLmRpc3BsYXkgPSAkc2NvcGUuJHBhcmVudC52bS5kaXNwbGF5O1xuICAgICAgICB2bS5kYXRhID0gJHNjb3BlLiRwYXJlbnQudm0uZGF0YTtcbiAgICAgICAgdm0uY3VycmVudCA9IGdldENvdW50cnk7XG4gICAgICAgIHZtLm12dFNvdXJjZSA9IFZlY3RvcmxheWVyU2VydmljZS5nZXRMYXllcigpO1xuICAgICAgICB2bS5nZXRSYW5rID0gZ2V0UmFuaztcbiAgICAgICAgdm0uZ2V0T2Zmc2V0ID0gZ2V0T2Zmc2V0O1xuICAgICAgICB2bS5nZXRUZW5kZW5jeSA9IGdldFRlbmRlbmN5O1xuXG4gICAgICAgIGZ1bmN0aW9uIGNhbGNSYW5rKCkge1xuICAgICAgICAgIHZhciByYW5rID0gMDtcbiAgICAgICAgICBhbmd1bGFyLmZvckVhY2godm0uZGF0YSwgZnVuY3Rpb24oaXRlbSkge1xuICAgICAgICAgICAgaXRlbVt2bS5zdHJ1Y3R1cmUuc2NvcmVfZmllbGRfbmFtZV0gPSBwYXJzZUZsb2F0KGl0ZW1bdm0uc3RydWN0dXJlLnNjb3JlX2ZpZWxkX25hbWVdKTtcbiAgICAgICAgICAgIGl0ZW1bJ3Njb3JlJ10gPSBwYXJzZUludChpdGVtWydzY29yZSddKTtcbiAgICAgICAgICB9KVxuICAgICAgICAgIHZhciBmaWx0ZXIgPSAkZmlsdGVyKCdvcmRlckJ5Jykodm0uZGF0YSwgW3ZtLnN0cnVjdHVyZS5zY29yZV9maWVsZF9uYW1lLCBcInNjb3JlXCJdLCB0cnVlKTtcbiAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGZpbHRlci5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKGZpbHRlcltpXS5pc28gPT0gdm0uY3VycmVudC5pc28pIHtcbiAgICAgICAgICAgICAgcmFuayA9IGkgKyAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICB2bS5jdXJyZW50W3ZtLnN0cnVjdHVyZS5zY29yZV9maWVsZF9uYW1lKydfcmFuayddID0gcmFuaztcbiAgICAgICAgICB2bS5jaXJjbGVPcHRpb25zID0ge1xuICAgICAgICAgICAgICBjb2xvcjp2bS5zdHJ1Y3R1cmUuY29sb3IsXG4gICAgICAgICAgICAgIGZpZWxkOnZtLnN0cnVjdHVyZS5zY29yZV9maWVsZF9uYW1lKydfcmFuaydcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gZ2V0UmFuayhjb3VudHJ5KXtcbiAgICAgICAgICB2YXIgZmlsdGVyID0gJGZpbHRlcignb3JkZXJCeScpKHZtLmRhdGEsIFt2bS5zdHJ1Y3R1cmUuc2NvcmVfZmllbGRfbmFtZSwgXCJzY29yZVwiXSwgdHJ1ZSk7XG4gICAgICAgICAgdmFyIHJhbmsgPSAwO1xuICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaChmaWx0ZXIsIGZ1bmN0aW9uKGl0ZW0sIGtleSl7XG4gICAgICAgICAgICBpZihpdGVtLmNvdW50cnkgPT0gY291bnRyeS5jb3VudHJ5KXtcbiAgICAgICAgICAgICAgcmFuayA9IGtleTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgICByZXR1cm4gcmFuaysxO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGdldE9mZnNldCgpIHtcbiAgICBcdFx0XHRpZiAoIXZtLmN1cnJlbnQpIHtcbiAgICBcdFx0XHRcdHJldHVybiAwO1xuICAgIFx0XHRcdH1cbiAgICBcdFx0XHRyZXR1cm4gKHZtLmdldFJhbmsodm0uY3VycmVudCkgLSAyKSAqIDE2O1xuICAgIFx0XHR9O1xuXG4gICAgXHRcdGZ1bmN0aW9uIGdldFRlbmRlbmN5KCkge1xuICAgIFx0XHRcdGlmICghdm0uY3VycmVudCkge1xuICAgIFx0XHRcdFx0cmV0dXJuICdhcnJvd19kcm9wX2Rvd24nXG4gICAgXHRcdFx0fVxuICAgIFx0XHRcdHJldHVybiB2bS5jdXJyZW50LnBlcmNlbnRfY2hhbmdlID4gMCA/ICdhcnJvd19kcm9wX3VwJyA6ICdhcnJvd19kcm9wX2Rvd24nO1xuICAgIFx0XHR9O1xuXG4gICAgICAgICRzY29wZS4kd2F0Y2goJ3ZtLmN1cnJlbnQnLCBmdW5jdGlvbiAobiwgbykge1xuICAgICAgICAgIGlmIChuID09PSBvKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZihvLmlzbyl7XG4gICAgICAgICAgICAgIHZtLm12dFNvdXJjZS5sYXllcnMuY291bnRyaWVzX2JpZ19nZW9tLmZlYXR1cmVzW28uaXNvXS5zZWxlY3RlZCA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2FsY1JhbmsoKTtcbiAgICAgICAgICAgIGZldGNoTmF0aW9uRGF0YShuLmlzbyk7XG5cblxuICAgICAgICB9KTtcbiAgICAgICAgLyo7Ki9cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignU2lkZWJhckN0cmwnLCBmdW5jdGlvbigkc2NvcGUsICRzdGF0ZSl7XG5cblxuXHR9KTtcblxufSkoKTsiLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdTaWdudXBDdHJsJywgZnVuY3Rpb24oKXtcbiAgICAgICAgLy9cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignVG9hc3RzQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgVG9hc3RTZXJ2aWNlKXtcblxuXHRcdCRzY29wZS50b2FzdFN1Y2Nlc3MgPSBmdW5jdGlvbigpe1xuXHRcdFx0VG9hc3RTZXJ2aWNlLnNob3coJ1VzZXIgYWRkZWQgc3VjY2Vzc2Z1bGx5IScpO1xuXHRcdH07XG5cblx0XHQkc2NvcGUudG9hc3RFcnJvciA9IGZ1bmN0aW9uKCl7XG5cdFx0XHRUb2FzdFNlcnZpY2UuZXJyb3IoJ0Nvbm5lY3Rpb24gaW50ZXJydXB0ZWQhJyk7XG5cdFx0fTtcblxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ1Vuc3VwcG9ydGVkQnJvd3NlckN0cmwnLCBmdW5jdGlvbigpe1xuICAgICAgICAvL1xuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignVXNlckN0cmwnLCBmdW5jdGlvbigpe1xuICAgICAgICAvL1xuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignQWRkUHJvdmlkZXJDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBEaWFsb2dTZXJ2aWNlLCBEYXRhU2VydmljZSl7XG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG4gICAgICAgIHZtLmRhdGFwcm92aWRlciA9IHt9O1xuICAgICAgICB2bS5kYXRhcHJvdmlkZXIudGl0bGUgPSAkc2NvcGUuJHBhcmVudC52bS5zZWFyY2hUZXh0O1xuXG4gICAgICAgIHZtLnNhdmUgPSBmdW5jdGlvbigpe1xuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIERhdGFTZXJ2aWNlLnBvc3QoJy9kYXRhcHJvdmlkZXJzJywgdm0uZGF0YXByb3ZpZGVyKS50aGVuKGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAgICAgICAkc2NvcGUuJHBhcmVudC52bS5kYXRhcHJvdmlkZXJzLnB1c2goZGF0YSk7XG4gICAgICAgICAgICAgICRzY29wZS4kcGFyZW50LnZtLml0ZW0uZGF0YXByb3ZpZGVyID0gZGF0YTtcbiAgICAgICAgICAgICAgRGlhbG9nU2VydmljZS5oaWRlKCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9O1xuXG4gICAgICAgIHZtLmhpZGUgPSBmdW5jdGlvbigpe1xuICAgICAgICBcdERpYWxvZ1NlcnZpY2UuaGlkZSgpO1xuICAgICAgICB9O1xuXG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdBZGRVbml0Q3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgRGF0YVNlcnZpY2UsRGlhbG9nU2VydmljZSl7XG5cbiAgICAgIHZhciB2bSA9IHRoaXM7XG4gICAgICB2bS51bml0ID0ge307XG4gICAgICB2bS51bml0LnRpdGxlID0gJHNjb3BlLiRwYXJlbnQudm0uc2VhcmNoVW5pdDtcblxuICAgICAgdm0uc2F2ZSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgLy9cbiAgICAgICAgICBEYXRhU2VydmljZS5wb3N0KCcvbWVhc3VyZV90eXBlcycsIHZtLnVuaXQpLnRoZW4oZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgICAgICAkc2NvcGUuJHBhcmVudC52bS5tZWFzdXJlVHlwZXMucHVzaChkYXRhKTtcbiAgICAgICAgICAgICRzY29wZS4kcGFyZW50LnZtLml0ZW0udHlwZSA9IGRhdGE7XG4gICAgICAgICAgICBEaWFsb2dTZXJ2aWNlLmhpZGUoKTtcbiAgICAgICAgICB9KTtcblxuICAgICAgfTtcblxuICAgICAgdm0uaGlkZSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIERpYWxvZ1NlcnZpY2UuaGlkZSgpO1xuICAgICAgfTtcblxuXG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdBZGRVc2Vyc0N0cmwnLCBmdW5jdGlvbigkc2NvcGUsIERpYWxvZ1NlcnZpY2Upe1xuXG4gICAgICAgICRzY29wZS5zYXZlID0gZnVuY3Rpb24oKXtcblx0ICAgICAgICAvL2RvIHNvbWV0aGluZyB1c2VmdWxcbiAgICAgICAgICAgIERpYWxvZ1NlcnZpY2UuaGlkZSgpO1xuICAgICAgICB9O1xuXG4gICAgICAgICRzY29wZS5oaWRlID0gZnVuY3Rpb24oKXtcbiAgICAgICAgXHREaWFsb2dTZXJ2aWNlLmhpZGUoKTtcbiAgICAgICAgfTtcblxuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignQ29weXByb3ZpZGVyQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgSW5kZXhTZXJ2aWNlLCBEaWFsb2dTZXJ2aWNlKXtcbiAgICAgICAgJHNjb3BlLiRwYXJlbnQudm0uYXNrZWRUb1JlcGxpY2F0ZSA9IHRydWU7XG4gICAgICAgICRzY29wZS4kcGFyZW50LnZtLmRvUHJvdmlkZXJzID0gdHJ1ZTtcbiAgICAgICAgJHNjb3BlLiRwYXJlbnQudm0uZG9TdHlsZSA9IHRydWU7XG4gICAgICAgICRzY29wZS4kcGFyZW50LnZtLmRvQ2F0ZWdvcmllcyA9IHRydWU7XG4gICAgICAgICRzY29wZS4kcGFyZW50LnZtLmRvTWVhc3VyZXMgPSB0cnVlO1xuICAgICAgICAkc2NvcGUuJHBhcmVudC52bS5kb1B1YmxpYyA9IHRydWU7XG4gICAgICAgICRzY29wZS5zYXZlID0gZnVuY3Rpb24oKXtcblxuICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaCgkc2NvcGUuJHBhcmVudC52bS5kYXRhWzBdLmRhdGFbMF0sIGZ1bmN0aW9uKGRhdGEsIGtleSl7XG4gICAgICAgICAgICBpZihrZXkgIT0gXCJ5ZWFyXCIpe1xuXG5cbiAgICAgICAgICAgIGlmKHR5cGVvZiBJbmRleFNlcnZpY2UuZ2V0SW5kaWNhdG9yKGtleSkgPT0gXCJ1bmRlZmluZWRcIil7XG4gICAgICAgICAgICAgIEluZGV4U2VydmljZS5zZXRJbmRpY2F0b3Ioa2V5LHtcbiAgICAgICAgICAgICAgICBjb2x1bW5fbmFtZTprZXksXG4gICAgICAgICAgICAgICAgdGl0bGU6a2V5XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGl0ZW0gPSBJbmRleFNlcnZpY2UuZ2V0SW5kaWNhdG9yKGtleSk7XG4gICAgICAgICAgICBpZigkc2NvcGUuJHBhcmVudC52bS5kb1Byb3ZpZGVycyl7XG4gICAgICAgICAgICAgIGl0ZW0uZGF0YXByb3ZpZGVyID0gICRzY29wZS4kcGFyZW50LnZtLnByZVByb3ZpZGVyIDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmKCRzY29wZS4kcGFyZW50LnZtLmRvTWVhc3VyZXMpe1xuICAgICAgICAgICAgICAgIGl0ZW0udHlwZSA9ICRzY29wZS4kcGFyZW50LnZtLnByZVR5cGUgO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYoJHNjb3BlLiRwYXJlbnQudm0uZG9DYXRlZ29yaWVzKXtcbiAgICAgICAgICAgICAgICBpdGVtLmNhdGVnb3JpZXMgPSAkc2NvcGUuJHBhcmVudC52bS5wcmVDYXRlZ29yaWVzO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYoJHNjb3BlLiRwYXJlbnQudm0uZG9QdWJsaWMpe1xuICAgICAgICAgICAgICBpdGVtLmlzX3B1YmxpYyA9ICAkc2NvcGUuJHBhcmVudC52bS5wcmVQdWJsaWM7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZigkc2NvcGUuJHBhcmVudC52bS5kb1N0eWxlKXtcblxuICAgICAgICAgICAgICBpZih0eXBlb2YgaXRlbS5zdHlsZSAhPSBcInVuZGVmaW5lZFwiKXtcbiAgICAgICAgICAgICAgICBpdGVtLnN0eWxlID0gJHNjb3BlLiRwYXJlbnQudm0ucHJlU3R5bGU7XG4gICAgICAgICAgICAgICAgaXRlbS5zdHlsZV9pZCA9ICRzY29wZS4kcGFyZW50LnZtLnByZVN0eWxlLmlkO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgSW5kZXhTZXJ2aWNlLnNldFRvTG9jYWxTdG9yYWdlKCk7XG4gICAgICAgICAgRGlhbG9nU2VydmljZS5oaWRlKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgJHNjb3BlLmhpZGUgPSBmdW5jdGlvbigpe1xuICAgICAgICAgICRzY29wZS4kcGFyZW50LnZtLmRvUHJvdmlkZXJzID0gZmFsc2U7XG4gICAgICAgICAgJHNjb3BlLiRwYXJlbnQudm0uZG9DYXRlZ29yaWVzID0gZmFsc2U7XG4gICAgICAgICAgJHNjb3BlLiRwYXJlbnQudm0uZG9NZWFzdXJlcyA9IGZhbHNlO1xuICAgICAgICBcdERpYWxvZ1NlcnZpY2UuaGlkZSgpO1xuICAgICAgICB9O1xuXG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdFZGl0Y29sdW1uQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgRGlhbG9nU2VydmljZSl7XG4gICAgICAgICRzY29wZS5uYW1lID0gJHNjb3BlLiRwYXJlbnQudm0udG9FZGl0O1xuICAgICAgICBpZih0eXBlb2YgJHNjb3BlLiRwYXJlbnQudm0ubWV0YS50YWJsZVskc2NvcGUubmFtZV0gPT0gXCJ1bmRlZmluZWRcIil7XG4gICAgICAgICAgJHNjb3BlLiRwYXJlbnQudm0ubWV0YS50YWJsZVskc2NvcGUubmFtZV0gPSB7fTtcbiAgICAgICAgfVxuICAgICAgICBlbHNle1xuICAgICAgICAgIGlmKCRzY29wZS4kcGFyZW50LnZtLm1ldGEudGFibGVbJHNjb3BlLm5hbWVdLnRpdGxlKXtcbiAgICAgICAgICAgICRzY29wZS50aXRsZSA9ICRzY29wZS4kcGFyZW50LnZtLm1ldGEudGFibGVbJHNjb3BlLm5hbWVdLnRpdGxlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZigkc2NvcGUuJHBhcmVudC52bS5tZXRhLnRhYmxlWyRzY29wZS5uYW1lXS5kZXNjcmlwdGlvbil7XG4gICAgICAgICAgICAkc2NvcGUuZGVzY3JpcHRpb24gPSAkc2NvcGUuJHBhcmVudC52bS5tZXRhLnRhYmxlWyRzY29wZS5uYW1lXS5kZXNjcmlwdGlvbjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAkc2NvcGUuc2F2ZSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgJHNjb3BlLiRwYXJlbnQudm0ubWV0YS50YWJsZVskc2NvcGUubmFtZV0udGl0bGUgPSAkc2NvcGUudGl0bGU7XG4gICAgICAgICAgJHNjb3BlLiRwYXJlbnQudm0ubWV0YS50YWJsZVskc2NvcGUubmFtZV0uZGVzY3JpcHRpb24gPSAkc2NvcGUuZGVzY3JpcHRpb247XG4gICAgICAgICAgRGlhbG9nU2VydmljZS5oaWRlKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgJHNjb3BlLmhpZGUgPSBmdW5jdGlvbigpe1xuICAgICAgICBcdERpYWxvZ1NlcnZpY2UuaGlkZSgpO1xuICAgICAgICB9O1xuXG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdFZGl0cm93Q3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgRGlhbG9nU2VydmljZSl7XG4gICAgICAgICRzY29wZS5kYXRhID0gJHNjb3BlLiRwYXJlbnQudm0uc2VsZWN0ZWRbMF07XG4gICAgICAgICRzY29wZS5zYXZlID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICBEaWFsb2dTZXJ2aWNlLmhpZGUoKTtcbiAgICAgICAgfTtcblxuICAgICAgICAkc2NvcGUuaGlkZSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIFx0RGlhbG9nU2VydmljZS5oaWRlKCk7XG4gICAgICAgIH07XG5cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0V4dGVuZERhdGFDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCRzdGF0ZSwgRGlhbG9nU2VydmljZSl7XG5cbiAgICAgICAgJHNjb3BlLnNhdmUgPSBmdW5jdGlvbigpe1xuICAgICAgICAgICAgJHNjb3BlLnZtLmRvRXh0ZW5kID0gdHJ1ZTtcbiAgICAgICAgICAgICRzY29wZS52bS5tZXRhLmlzb19maWVsZCA9ICRzY29wZS52bS5hZGREYXRhVG8uaXNvX25hbWU7XG4gICAgICAgICAgICAkc2NvcGUudm0ubWV0YS5jb3VudHJ5X2ZpZWxkID0gJHNjb3BlLnZtLmFkZERhdGFUby5jb3VudHJ5X25hbWU7XG4gICAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC5pbmRleC5jaGVjaycpO1xuICAgICAgICAgIFx0RGlhbG9nU2VydmljZS5oaWRlKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgJHNjb3BlLmhpZGUgPSBmdW5jdGlvbigpe1xuICAgICAgICAgICRzdGF0ZS5nbygnYXBwLmluZGV4LmNoZWNrJyk7XG4gICAgICAgIFx0RGlhbG9nU2VydmljZS5oaWRlKCk7XG4gICAgICAgIH07XG5cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0xvb3NlZGF0YUN0cmwnLCBmdW5jdGlvbigkc2NvcGUsICRzdGF0ZSwgRGlhbG9nU2VydmljZSl7XG5cbiAgICAgICAgJHNjb3BlLnNhdmUgPSBmdW5jdGlvbigpe1xuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgICRzY29wZS52bS5kZWxldGVEYXRhKCk7XG4gICAgICAgICAgICAkc3RhdGUuZ28oJHNjb3BlLnRvU3RhdGUubmFtZSk7XG4gICAgICAgICAgICBEaWFsb2dTZXJ2aWNlLmhpZGUoKTtcbiAgICAgICAgfTtcblxuICAgICAgICAkc2NvcGUuaGlkZSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIFx0RGlhbG9nU2VydmljZS5oaWRlKCk7XG4gICAgICAgIH07XG5cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdTZWxlY3Rpc29mZXRjaGVyc0N0cmwnLCBmdW5jdGlvbiAoJHNjb3BlLCBJbmRleFNlcnZpY2UsIERpYWxvZ1NlcnZpY2UpIHtcblx0XHR2YXIgdm0gPSB0aGlzO1xuXHRcdHZhciBtZXRhID0gSW5kZXhTZXJ2aWNlLmdldE1ldGEoKTtcblx0XHR2bS5pc28gPSBtZXRhLmlzb19maWVsZDtcblx0XHR2bS5saXN0ID0gSW5kZXhTZXJ2aWNlLmdldFRvU2VsZWN0KCk7XG5cdFx0dm0uc2F2ZSA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdERpYWxvZ1NlcnZpY2UuaGlkZSgpO1xuXHRcdH07XG5cblx0XHR2bS5oaWRlID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0RGlhbG9nU2VydmljZS5oaWRlKCk7XG5cdFx0fTtcblx0XHQkc2NvcGUuJHdhdGNoKCd2bS5saXN0JywgZnVuY3Rpb24gKG4sIG8pIHtcblx0XHRcdGlmIChuID09PSBvKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHRcdGFuZ3VsYXIuZm9yRWFjaChuLCBmdW5jdGlvbiAoaXRlbSwga2V5KSB7XG5cdFx0XHRcdGlmIChpdGVtLmVudHJ5LmRhdGFbMF1bdm0uaXNvXSkge1xuXHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChpdGVtLmVudHJ5LmVycm9ycywgZnVuY3Rpb24gKGVycm9yLCBlKSB7XG5cdFx0XHRcdFx0XHRpZiAoZXJyb3IudHlwZSA9PSAyIHx8IGVycm9yLnR5cGUgPT0gMykge1xuXHRcdFx0XHRcdFx0XHRJbmRleFNlcnZpY2UucmVkdWNlSXNvRXJyb3IoKTtcblx0XHRcdFx0XHRcdFx0aXRlbS5lbnRyeS5lcnJvcnMuc3BsaWNlKGUsIDEpO1xuXHRcdFx0XHRcdFx0fSBlbHNlIGlmIChlcnJvci50eXBlID09IDEpIHtcblx0XHRcdFx0XHRcdFx0aWYgKGVycm9yLmNvbHVtbiA9PSB2bS5pc28pIHtcblx0XHRcdFx0XHRcdFx0XHRJbmRleFNlcnZpY2UucmVkdWNlRXJyb3IoKTtcblx0XHRcdFx0XHRcdFx0XHRpdGVtLmVudHJ5LmVycm9ycy5zcGxpY2UoZSwgMSk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR2bS5saXN0LnNwbGljZShrZXksIDEpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHRcdGlmICh2bS5saXN0Lmxlbmd0aCA9PSAwKSB7XG5cdFx0XHRcdERpYWxvZ1NlcnZpY2UuaGlkZSgpO1xuXHRcdFx0fVxuXHRcdH0sIHRydWUpO1xuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmRpcmVjdGl2ZXMnKS5kaXJlY3RpdmUoICdhdXRvRm9jdXMnLCBmdW5jdGlvbigkdGltZW91dCkge1xuXHRcdHJldHVybiB7XG4gICAgICAgIHJlc3RyaWN0OiAnQUMnLFxuICAgICAgICBsaW5rOiBmdW5jdGlvbihfc2NvcGUsIF9lbGVtZW50KSB7XG4gICAgICAgICAgICAkdGltZW91dChmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIF9lbGVtZW50WzBdLmZvY3VzKCk7XG4gICAgICAgICAgICB9LCAwKTtcbiAgICAgICAgfVxuICAgIH07XG5cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoICdhcHAuY29udHJvbGxlcnMnICkuY29udHJvbGxlciggJ0J1YmJsZXNDdHJsJywgZnVuY3Rpb24oKXtcblx0XHQvL1xuXG4gIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0ZnVuY3Rpb24gQ3VzdG9tVG9vbHRpcCh0b29sdGlwSWQsIHdpZHRoKSB7XG5cdFx0dmFyIHRvb2x0aXBJZCA9IHRvb2x0aXBJZDtcblx0XHR2YXIgZWxlbSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRvb2x0aXBJZCk7XG5cdFx0aWYoZWxlbSA9PSBudWxsKXtcblx0XHRcdGFuZ3VsYXIuZWxlbWVudChkb2N1bWVudCkuZmluZCgnYm9keScpLmFwcGVuZChcIjxkaXYgY2xhc3M9J3Rvb2x0aXAgbWQtd2hpdGVmcmFtZS16MycgaWQ9J1wiICsgdG9vbHRpcElkICsgXCInPjwvZGl2PlwiKTtcblx0XHR9XG5cdFx0aGlkZVRvb2x0aXAoKTtcblx0XHRmdW5jdGlvbiBzaG93VG9vbHRpcChjb250ZW50LCBkYXRhLCBldmVudCwgZWxlbWVudCkge1xuXHRcdFx0YW5ndWxhci5lbGVtZW50KGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyMnICsgdG9vbHRpcElkKSkuaHRtbChjb250ZW50KTtcblx0XHRcdGFuZ3VsYXIuZWxlbWVudChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjJyArIHRvb2x0aXBJZCkpLmNzcygnZGlzcGxheScsICdibG9jaycpO1xuXG5cdFx0XHRyZXR1cm4gdXBkYXRlUG9zaXRpb24oZXZlbnQsIGRhdGEsIGVsZW1lbnQpO1xuXHRcdH1cblx0XHRmdW5jdGlvbiBoaWRlVG9vbHRpcCgpIHtcblx0XHRcdGFuZ3VsYXIuZWxlbWVudChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjJyArIHRvb2x0aXBJZCkpLmNzcygnZGlzcGxheScsICdub25lJyk7XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIHVwZGF0ZVBvc2l0aW9uKGV2ZW50LCBkLCBlbGVtZW50KSB7XG5cdFx0XHR2YXIgdHRpZCA9IFwiI1wiICsgdG9vbHRpcElkO1xuXHRcdFx0dmFyIHhPZmZzZXQgPSAyMDtcblx0XHRcdHZhciB5T2Zmc2V0ID0gMTA7XG5cdFx0XHR2YXIgc3ZnID0gZWxlbWVudC5maW5kKCdzdmcnKVswXTsvL2RvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNzdmdfdmlzJyk7XG5cdFx0XHR2YXIgd3NjclkgPSB3aW5kb3cuc2Nyb2xsWTtcblx0XHRcdHZhciB0dHcgPSBhbmd1bGFyLmVsZW1lbnQoZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0dGlkKSkub2Zmc2V0V2lkdGg7XG5cdFx0XHR2YXIgdHRoID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0dGlkKS5vZmZzZXRIZWlnaHQ7XG5cdFx0XHR2YXIgdHR0b3AgPSBzdmcuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wICsgZC55IC0gdHRoIC8gMjtcblx0XHRcdHZhciB0dGxlZnQgPSBzdmcuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkubGVmdCArIGQueCArIGQucmFkaXVzICsgMTI7XG5cdFx0XHRyZXR1cm4gYW5ndWxhci5lbGVtZW50KGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodHRpZCkpLmNzcygndG9wJywgdHR0b3AgKyAncHgnKS5jc3MoJ2xlZnQnLCB0dGxlZnQgKyAncHgnKTtcblx0XHR9XG5cdFx0cmV0dXJuIHtcblx0XHRcdHNob3dUb29sdGlwOiBzaG93VG9vbHRpcCxcblx0XHRcdGhpZGVUb29sdGlwOiBoaWRlVG9vbHRpcCxcblx0XHRcdHVwZGF0ZVBvc2l0aW9uOiB1cGRhdGVQb3NpdGlvblxuXHRcdH1cblx0fVxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmRpcmVjdGl2ZXMnKS5kaXJlY3RpdmUoJ2J1YmJsZXMnLCBmdW5jdGlvbiAoJGNvbXBpbGUsIEljb25zU2VydmljZSkge1xuXHRcdHZhciBkZWZhdWx0cztcblx0XHRkZWZhdWx0cyA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdHdpZHRoOiAzMDAsXG5cdFx0XHRcdGhlaWdodDogMzAwLFxuXHRcdFx0XHRsYXlvdXRfZ3Jhdml0eTogMCxcblx0XHRcdFx0c2l6ZWZhY3RvcjozLFxuXHRcdFx0XHR2aXM6IG51bGwsXG5cdFx0XHRcdGZvcmNlOiBudWxsLFxuXHRcdFx0XHRkYW1wZXI6IDAuMDg1LFxuXHRcdFx0XHRjaXJjbGVzOiBudWxsLFxuXHRcdFx0XHRib3JkZXJzOiB0cnVlLFxuXHRcdFx0XHRsYWJlbHM6IHRydWUsXG5cdFx0XHRcdGZpbGxfY29sb3I6IGQzLnNjYWxlLm9yZGluYWwoKS5kb21haW4oW1wiZWhcIiwgXCJldlwiXSkucmFuZ2UoW1wiI2EzMTAzMVwiLCBcIiNiZWNjYWVcIl0pLFxuXHRcdFx0XHRtYXhfYW1vdW50OiAnJyxcblx0XHRcdFx0cmFkaXVzX3NjYWxlOiAnJyxcblx0XHRcdFx0ZHVyYXRpb246IDEwMDAsXG5cdFx0XHRcdHRvb2x0aXA6IEN1c3RvbVRvb2x0aXAoXCJidWJibGVzX3Rvb2x0aXBcIiwgMjQwKVxuXHRcdFx0fTtcblx0XHR9O1xuXHRcdHJldHVybiB7XG5cdFx0XHRyZXN0cmljdDogJ0UnLFxuXHRcdFx0c2NvcGU6IHtcblx0XHRcdFx0Y2hhcnRkYXRhOiAnPScsXG5cdFx0XHRcdGRpcmVjdGlvbjogJz0nLFxuXHRcdFx0XHRncmF2aXR5OiAnPScsXG5cdFx0XHRcdHNpemVmYWN0b3I6ICc9Jyxcblx0XHRcdFx0aW5kZXhlcjogJz0nLFxuXHRcdFx0XHRib3JkZXJzOiAnQCdcblx0XHRcdH0sXG5cdFx0XHRyZXF1aXJlOiAnbmdNb2RlbCcsXG5cdFx0XHRsaW5rOiBmdW5jdGlvbiAoc2NvcGUsIGVsZW0sIGF0dHJzLCBuZ01vZGVsKSB7XG5cdFx0XHRcdHZhciBvcHRpb25zID0gYW5ndWxhci5leHRlbmQoZGVmYXVsdHMoKSwgYXR0cnMpO1xuXHRcdFx0XHR2YXIgbm9kZXMgPSBbXSxcblx0XHRcdFx0XHRsaW5rcyA9IFtdLFxuXHRcdFx0XHRcdGxhYmVscyA9IFtdLFxuXHRcdFx0XHRcdGdyb3VwcyA9IFtdO1xuXG5cdFx0XHRcdHZhciBtYXhfYW1vdW50ID0gZDMubWF4KHNjb3BlLmNoYXJ0ZGF0YSwgZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRyZXR1cm4gcGFyc2VGbG9hdChkLnZhbHVlKTtcblx0XHRcdFx0fSk7XG5cdFx0XHRcdC8vb3B0aW9ucy5oZWlnaHQgPSBvcHRpb25zLndpZHRoICogMS4xO1xuXHRcdFx0XHRvcHRpb25zLnJhZGl1c19zY2FsZSA9IGQzLnNjYWxlLnBvdygpLmV4cG9uZW50KDAuNSkuZG9tYWluKFswLCBtYXhfYW1vdW50XSkucmFuZ2UoWzIsIDg1XSk7XG5cdFx0XHRcdG9wdGlvbnMuY2VudGVyID0ge1xuXHRcdFx0XHRcdHg6IG9wdGlvbnMud2lkdGggLyAyLFxuXHRcdFx0XHRcdHk6IG9wdGlvbnMuaGVpZ2h0IC8gMlxuXHRcdFx0XHR9O1xuXHRcdFx0XHRvcHRpb25zLmNhdF9jZW50ZXJzID0ge307XG5cblx0XHRcdFx0dmFyIGNyZWF0ZV9ub2RlcyA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRpZihzY29wZS5pbmRleGVyLmNoaWxkcmVuLmxlbmd0aCA9PSAyICYmIHNjb3BlLmluZGV4ZXIuY2hpbGRyZW5bMF0uY2hpbGRyZW4ubGVuZ3RoID4gMCl7XG5cdFx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2goc2NvcGUuaW5kZXhlci5jaGlsZHJlbiwgZnVuY3Rpb24gKGdyb3VwLCBpbmRleCkge1xuXHRcdFx0XHRcdFx0XHR2YXIgZCA9IHtcblx0XHRcdFx0XHRcdFx0XHR0eXBlOiBncm91cC5uYW1lLFxuXHRcdFx0XHRcdFx0XHRcdG5hbWU6IGdyb3VwLnRpdGxlLFxuXHRcdFx0XHRcdFx0XHRcdGdyb3VwOiBncm91cC5uYW1lLFxuXHRcdFx0XHRcdFx0XHRcdGNvbG9yOiBncm91cC5jb2xvcixcblx0XHRcdFx0XHRcdFx0XHRpY29uOiBncm91cC5pY29uLFxuXHRcdFx0XHRcdFx0XHRcdHVuaWNvZGU6IEljb25zU2VydmljZS5nZXRVbmljb2RlKGdyb3VwLmljb24pLFxuXHRcdFx0XHRcdFx0XHRcdGRhdGE6IGdyb3VwLFxuXHRcdFx0XHRcdFx0XHRcdGNoaWxkcmVuOmdyb3VwLmNoaWxkcmVuXG5cdFx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0XHRcdGxhYmVscy5wdXNoKGQpO1xuXHRcdFx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2goZ3JvdXAuY2hpbGRyZW4sIGZ1bmN0aW9uIChpdGVtKSB7XG5cdFx0XHRcdFx0XHRcdFx0aWYgKHNjb3BlLmNoYXJ0ZGF0YVtpdGVtLm5hbWVdKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHR2YXIgbm9kZSA9IHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0dHlwZTogaXRlbS5uYW1lLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRyYWRpdXM6IHNjb3BlLmNoYXJ0ZGF0YVtpdGVtLm5hbWVdIC8gc2NvcGUuc2l6ZWZhY3Rvcixcblx0XHRcdFx0XHRcdFx0XHRcdFx0dmFsdWU6IHNjb3BlLmNoYXJ0ZGF0YVtpdGVtLm5hbWVdLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRuYW1lOiBpdGVtLnRpdGxlLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRncm91cDogZ3JvdXAubmFtZSxcblx0XHRcdFx0XHRcdFx0XHRcdFx0eDogb3B0aW9ucy5jZW50ZXIueCxcblx0XHRcdFx0XHRcdFx0XHRcdFx0eTogb3B0aW9ucy5jZW50ZXIueSxcblx0XHRcdFx0XHRcdFx0XHRcdFx0Y29sb3I6IGl0ZW0uY29sb3IsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGljb246IGl0ZW0uaWNvbixcblx0XHRcdFx0XHRcdFx0XHRcdFx0dW5pY29kZTogSWNvbnNTZXJ2aWNlLmdldFVuaWNvZGUoaXRlbS5pY29uKSxcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZGF0YTogaXRlbSxcblx0XHRcdFx0XHRcdFx0XHRcdFx0Y2hpbGRyZW46aXRlbVxuXHRcdFx0XHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdFx0XHRcdG5vZGVzLnB1c2gobm9kZSk7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0Y3JlYXRlX2dyb3VwcygpO1xuXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2V7XG5cdFx0XHRcdFx0XHR2YXIgZCA9IHtcblx0XHRcdFx0XHRcdFx0dHlwZTogc2NvcGUuaW5kZXhlci5uYW1lLFxuXHRcdFx0XHRcdFx0XHRuYW1lOiBzY29wZS5pbmRleGVyLnRpdGxlLFxuXHRcdFx0XHRcdFx0XHRncm91cDogc2NvcGUuaW5kZXhlci5uYW1lLFxuXHRcdFx0XHRcdFx0XHRjb2xvcjogc2NvcGUuaW5kZXhlci5jb2xvcixcblx0XHRcdFx0XHRcdFx0aWNvbjogc2NvcGUuaW5kZXhlci5pY29uLFxuXHRcdFx0XHRcdFx0XHR1bmljb2RlOiBzY29wZS5pbmRleGVyLnVuaWNvZGUsXG5cdFx0XHRcdFx0XHRcdGRhdGE6IHNjb3BlLmluZGV4ZXIuZGF0YSxcblx0XHRcdFx0XHRcdFx0Y2hpbGRyZW46IHNjb3BlLmluZGV4ZXIuY2hpbGRyZW5cblx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0XHRsYWJlbHMucHVzaChkKTtcblx0XHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChzY29wZS5pbmRleGVyLmNoaWxkcmVuLCBmdW5jdGlvbiAoaXRlbSkge1xuXHRcdFx0XHRcdFx0XHRpZiAoc2NvcGUuY2hhcnRkYXRhW2l0ZW0ubmFtZV0pIHtcblx0XHRcdFx0XHRcdFx0XHR2YXIgbm9kZSA9IHtcblx0XHRcdFx0XHRcdFx0XHRcdHR5cGU6IGl0ZW0ubmFtZSxcblx0XHRcdFx0XHRcdFx0XHRcdHJhZGl1czogc2NvcGUuY2hhcnRkYXRhW2l0ZW0ubmFtZV0gLyBzY29wZS5zaXplZmFjdG9yLFxuXHRcdFx0XHRcdFx0XHRcdFx0dmFsdWU6IHNjb3BlLmNoYXJ0ZGF0YVtpdGVtLm5hbWVdIC8gc2NvcGUuc2l6ZWZhY3Rvcixcblx0XHRcdFx0XHRcdFx0XHRcdG5hbWU6IGl0ZW0udGl0bGUsXG5cdFx0XHRcdFx0XHRcdFx0XHRncm91cDogc2NvcGUuaW5kZXhlci5uYW1lLFxuXHRcdFx0XHRcdFx0XHRcdFx0eDogb3B0aW9ucy5jZW50ZXIueCxcblx0XHRcdFx0XHRcdFx0XHRcdHk6IG9wdGlvbnMuY2VudGVyLnksXG5cdFx0XHRcdFx0XHRcdFx0XHRjb2xvcjogaXRlbS5jb2xvcixcblx0XHRcdFx0XHRcdFx0XHRcdGljb246IGl0ZW0uaWNvbixcblx0XHRcdFx0XHRcdFx0XHRcdHVuaWNvZGU6IEljb25zU2VydmljZS5nZXRVbmljb2RlKGl0ZW0uaWNvbiksXG5cdFx0XHRcdFx0XHRcdFx0XHRkYXRhOiBpdGVtLFxuXHRcdFx0XHRcdFx0XHRcdFx0Y2hpbGRyZW46aXRlbVxuXHRcdFx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0XHRcdFx0bm9kZXMucHVzaChub2RlKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9O1xuXHRcdFx0XHR2YXIgY2xlYXJfbm9kZXMgPSBmdW5jdGlvbigpe1xuXHRcdFx0XHRcdG5vZGVzID0gW107XG5cdFx0XHRcdFx0bGFiZWxzID0gW107XG5cdFx0XHRcdH1cblx0XHRcdFx0dmFyIGNyZWF0ZV9ncm91cHMgPSBmdW5jdGlvbigpe1xuXHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChub2RlcywgZnVuY3Rpb24obm9kZSwga2V5KXtcblx0XHRcdFx0XHRcdFx0b3B0aW9ucy5jYXRfY2VudGVyc1tub2RlLmdyb3VwXSA9IHtcblx0XHRcdFx0XHRcdFx0XHR4OiBvcHRpb25zLndpZHRoIC8gMixcblx0XHRcdFx0XHRcdFx0XHR5OiBvcHRpb25zLmhlaWdodCAvIDIgKyAoMSAtIGtleSksXG5cdFx0XHRcdFx0XHRcdFx0ZGFtcGVyOiAwLjA4NSxcblx0XHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fTtcblx0XHRcdFx0dmFyIGNyZWF0ZV92aXMgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0YW5ndWxhci5lbGVtZW50KGVsZW0pLmh0bWwoJycpO1xuXHRcdFx0XHRcdG9wdGlvbnMudmlzID0gZDMuc2VsZWN0KGVsZW1bMF0pLmFwcGVuZChcInN2Z1wiKS5hdHRyKFwid2lkdGhcIiwgb3B0aW9ucy53aWR0aCkuYXR0cihcImhlaWdodFwiLCBvcHRpb25zLmhlaWdodCkuYXR0cihcImlkXCIsIFwic3ZnX3Zpc1wiKTtcblxuXHRcdFx0XHRcdGlmICghb3B0aW9ucy5ib3JkZXJzKSB7XG5cdFx0XHRcdFx0XHR2YXIgcGkgPSBNYXRoLlBJO1xuXHRcdFx0XHRcdFx0aWYobGFiZWxzLmxlbmd0aCA9PSAyKXtcblx0XHRcdFx0XHRcdFx0dmFyIGFyY1RvcCA9IGQzLnN2Zy5hcmMoKVxuXHRcdFx0XHRcdFx0XHRcdC5pbm5lclJhZGl1cygxMDkpXG5cdFx0XHRcdFx0XHRcdFx0Lm91dGVyUmFkaXVzKDExMClcblx0XHRcdFx0XHRcdFx0XHQuc3RhcnRBbmdsZSgtOTAgKiAocGkgLyAxODApKSAvL2NvbnZlcnRpbmcgZnJvbSBkZWdzIHRvIHJhZGlhbnNcblx0XHRcdFx0XHRcdFx0XHQuZW5kQW5nbGUoOTAgKiAocGkgLyAxODApKTsgLy9qdXN0IHJhZGlhbnNcblx0XHRcdFx0XHRcdFx0dmFyIGFyY0JvdHRvbSA9IGQzLnN2Zy5hcmMoKVxuXHRcdFx0XHRcdFx0XHRcdC5pbm5lclJhZGl1cygxMzQpXG5cdFx0XHRcdFx0XHRcdFx0Lm91dGVyUmFkaXVzKDEzNSlcblx0XHRcdFx0XHRcdFx0XHQuc3RhcnRBbmdsZSg5MCAqIChwaSAvIDE4MCkpIC8vY29udmVydGluZyBmcm9tIGRlZ3MgdG8gcmFkaWFuc1xuXHRcdFx0XHRcdFx0XHRcdC5lbmRBbmdsZSgyNzAgKiAocGkgLyAxODApKTsgLy9qdXN0IHJhZGlhbnNcblxuXHRcdFx0XHRcdFx0XHRvcHRpb25zLmFyY1RvcCA9IG9wdGlvbnMudmlzLmFwcGVuZChcInBhdGhcIilcblx0XHRcdFx0XHRcdFx0XHQuYXR0cihcImRcIiwgYXJjVG9wKVxuXHRcdFx0XHRcdFx0XHRcdC5hdHRyKFwiZmlsbFwiLCBmdW5jdGlvbihkKXtcblx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiBsYWJlbHNbMF0uY29sb3IgfHwgXCIjYmU1ZjAwXCI7XG5cdFx0XHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRcdFx0XHQuYXR0cihcImlkXCIsIFwiYXJjVG9wXCIpXG5cdFx0XHRcdFx0XHRcdFx0LmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIrKG9wdGlvbnMud2lkdGgvMikrXCIsXCIrKG9wdGlvbnMuaGVpZ2h0LzIgLSBvcHRpb25zLmhlaWdodC8xMikrXCIpXCIpO1xuXHRcdFx0XHRcdFx0XHRvcHRpb25zLmFyY0JvdHRvbSA9IG9wdGlvbnMudmlzLmFwcGVuZChcInBhdGhcIilcblx0XHRcdFx0XHRcdFx0XHQuYXR0cihcImRcIiwgYXJjQm90dG9tKVxuXHRcdFx0XHRcdFx0XHRcdC5hdHRyKFwiaWRcIiwgXCJhcmNCb3R0b21cIilcblx0XHRcdFx0XHRcdFx0XHQuYXR0cihcImZpbGxcIiwgZnVuY3Rpb24oZCl7XG5cdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gbGFiZWxzWzFdLmNvbG9yIHx8IFwiIzAwNmJiNlwiO1xuXHRcdFx0XHRcdFx0XHRcdH0gKVxuXHRcdFx0XHRcdFx0XHRcdC5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiKyhvcHRpb25zLndpZHRoLzIpK1wiLFwiKyhvcHRpb25zLmhlaWdodC8yKStcIilcIik7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRlbHNle1xuXHRcdFx0XHRcdFx0XHR2YXIgYXJjID0gZDMuc3ZnLmFyYygpXG5cdFx0XHRcdFx0XHRcdFx0LmlubmVyUmFkaXVzKG9wdGlvbnMud2lkdGgvMyAtIDEpXG5cdFx0XHRcdFx0XHRcdFx0Lm91dGVyUmFkaXVzKG9wdGlvbnMud2lkdGgvMylcblx0XHRcdFx0XHRcdFx0XHQuc3RhcnRBbmdsZSgwICogKHBpIC8gMTgwKSkgLy9jb252ZXJ0aW5nIGZyb20gZGVncyB0byByYWRpYW5zXG5cdFx0XHRcdFx0XHRcdFx0LmVuZEFuZ2xlKDM2MCAqIChwaSAvIDE4MCkpOyAvL2p1c3QgcmFkaWFuc1xuXG5cblx0XHRcdFx0XHRcdFx0b3B0aW9ucy5hcmMgPSBvcHRpb25zLnZpcy5hcHBlbmQoXCJwYXRoXCIpXG5cdFx0XHRcdFx0XHRcdFx0LmF0dHIoXCJkXCIsIGFyYylcblx0XHRcdFx0XHRcdFx0XHQuYXR0cihcImZpbGxcIiwgbGFiZWxzWzBdLmNvbG9yKVxuXHRcdFx0XHRcdFx0XHRcdC5hdHRyKFwiaWRcIiwgXCJhcmNUb3BcIilcblx0XHRcdFx0XHRcdFx0XHQuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIisob3B0aW9ucy53aWR0aC8yKStcIixcIisob3B0aW9ucy5oZWlnaHQvMikrXCIpXCIpO1xuXG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRpZihvcHRpb25zLmxhYmVscyA9PSB0cnVlICYmIGxhYmVscy5sZW5ndGggPT0gMil7XG5cdFx0XHRcdFx0XHR2YXIgdGV4dExhYmVscyA9IG9wdGlvbnMudmlzLnNlbGVjdEFsbCgndGV4dC5sYWJlbHMnKS5kYXRhKGxhYmVscykuZW50ZXIoKS5hcHBlbmQoXCJ0ZXh0XCIpXG5cdFx0XHRcdFx0XHRcdC5hdHRyKCdjbGFzcycsICdsYWJlbHMnKVxuXHRcdFx0XHRcdFx0XHQuYXR0cignZmlsbCcsIGZ1bmN0aW9uKGQpe1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBkLmNvbG9yO1xuXHRcdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0LypcdC5hdHRyKCd0cmFuc2Zvcm0nLCBmdW5jdGlvbihkKXtcblx0XHRcdFx0XHRcdFx0XHR2YXIgaW5kZXggPSBsYWJlbHMuaW5kZXhPZihkKTtcblx0XHRcdFx0XHRcdFx0XHRpZihpbmRleCA+IDApe1xuXHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuICdyb3RhdGUoOTAsIDEwMCwgMTAwKSc7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9KSovXG5cdFx0XHRcdFx0XHRcdC5hdHRyKCd4JywgXCI1MCVcIilcblx0XHRcdFx0XHRcdFx0LnN0eWxlKCdmb250LXNpemUnLCAnMS4yZW0nKVxuXHRcdFx0XHRcdFx0XHQuc3R5bGUoJ2N1cnNvcicsICdwb2ludGVyJylcblxuXHRcdFx0XHRcdFx0XHQuYXR0cignd2lkdGgnLCBvcHRpb25zLndpZHRoKVxuXHRcdFx0XHRcdFx0XHQuYXR0cigndGV4dC1hbmNob3InLCAnbWlkZGxlJylcblx0XHRcdFx0XHRcdFx0Lm9uKCdjbGljaycsIGZ1bmN0aW9uKGQpe1xuXHRcdFx0XHRcdFx0XHRcdG5nTW9kZWwuJHNldFZpZXdWYWx1ZShkLmRhdGEpO1xuXHRcdFx0XHRcdFx0XHRcdG5nTW9kZWwuJHJlbmRlcigpO1xuXHRcdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0XHQuYXR0cihcInlcIiwgZnVuY3Rpb24oZCl7XG5cdFx0XHRcdFx0XHRcdFx0dmFyIGluZGV4ID0gbGFiZWxzLmluZGV4T2YoZCk7XG5cdFx0XHRcdFx0XHRcdFx0aWYoaW5kZXggPT0gMCl7XG5cdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gMTU7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdGVsc2V7XG5cdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gb3B0aW9ucy5oZWlnaHQgLSA2O1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRcdFx0LnRleHQoZnVuY3Rpb24oZCl7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIGQubmFtZTtcblx0XHRcdFx0XHRcdFx0fSlcblxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRvcHRpb25zLmNvbnRhaW5lcnMgPSBvcHRpb25zLnZpcy5zZWxlY3RBbGwoJ2cubm9kZScpLmRhdGEobm9kZXMpLmVudGVyKCkuYXBwZW5kKCdnJykuYXR0cigndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgnICsgKG9wdGlvbnMud2lkdGggLyAyKSArICcsJyArIChvcHRpb25zLmhlaWdodCAvIDIpICsgJyknKS5hdHRyKCdjbGFzcycsICdub2RlJyk7XG5cblx0XHRcdFx0XHQvKm9wdGlvbnMuY2lyY2xlcyA9IG9wdGlvbnMuY29udGFpbmVycy5zZWxlY3RBbGwoXCJjaXJjbGVcIikuZGF0YShub2RlcywgZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdHJldHVybiBkLmlkO1xuXHRcdFx0XHRcdH0pOyovXG5cblx0XHRcdFx0XHRvcHRpb25zLmNpcmNsZXMgPSBvcHRpb25zLmNvbnRhaW5lcnMuYXBwZW5kKFwiY2lyY2xlXCIpLmF0dHIoXCJyXCIsIDApLmF0dHIoXCJmaWxsXCIsIChmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGQuY29sb3IgfHwgb3B0aW9ucy5maWxsX2NvbG9yKGQuZ3JvdXApO1xuXHRcdFx0XHRcdH0pKS5hdHRyKFwic3Ryb2tlLXdpZHRoXCIsIDApLmF0dHIoXCJzdHJva2VcIiwgZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdHJldHVybiBkMy5yZ2Iob3B0aW9ucy5maWxsX2NvbG9yKGQuZ3JvdXApKS5kYXJrZXIoKTtcblx0XHRcdFx0XHR9KS5hdHRyKFwiaWRcIiwgZnVuY3Rpb24gKGQpIHtcblx0XG5cdFx0XHRcdFx0XHRyZXR1cm4gXCJidWJibGVfXCIgKyBkLnR5cGU7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0b3B0aW9ucy5pY29ucyA9IG9wdGlvbnMuY29udGFpbmVycy5hcHBlbmQoXCJ0ZXh0XCIpXG5cdFx0XHRcdFx0XHQuYXR0cignZm9udC1mYW1pbHknLCAnRVBJJylcblx0XHRcdFx0XHRcdC5hdHRyKCdmb250LXNpemUnLCBmdW5jdGlvbiAoZCkge1xuXG5cdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0LmF0dHIoXCJ0ZXh0LWFuY2hvclwiLCBcIm1pZGRsZVwiKVxuXHRcdFx0XHRcdFx0LmF0dHIoJ2ZpbGwnLCBmdW5jdGlvbihkKXtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGQudW5pY29kZSA/ICcjZmZmJyA6IGQuY29sb3I7XG5cdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0LnN0eWxlKCdvcGFjaXR5JywgZnVuY3Rpb24oZCl7XG5cdFx0XHRcdFx0XHRcdGlmKGQudW5pY29kZSl7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIDE7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0ZWxzZXtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gMDtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRcdC50ZXh0KGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBkLnVuaWNvZGUgfHwgJzEnXG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRvcHRpb25zLmljb25zLm9uKFwibW91c2VvdmVyXCIsIGZ1bmN0aW9uIChkLCBpKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gc2hvd19kZXRhaWxzKGQsIGksIHRoaXMpO1xuXHRcdFx0XHRcdH0pLm9uKFwibW91c2VvdXRcIiwgZnVuY3Rpb24gKGQsIGkpIHtcblx0XHRcdFx0XHRcdHJldHVybiBoaWRlX2RldGFpbHMoZCwgaSwgdGhpcyk7XG5cdFx0XHRcdFx0fSkub24oXCJjbGlja1wiLCBmdW5jdGlvbiAoZCwgaSkge1xuXG5cdFx0XHRcdFx0XHRuZ01vZGVsLiRzZXRWaWV3VmFsdWUoZC5kYXRhKTtcblx0XHRcdFx0XHRcdG5nTW9kZWwuJHJlbmRlcigpO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdG9wdGlvbnMuY2lyY2xlcy50cmFuc2l0aW9uKCkuZHVyYXRpb24ob3B0aW9ucy5kdXJhdGlvbikuYXR0cihcInJcIiwgZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdHJldHVybiBkLnJhZGl1cztcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRvcHRpb25zLmljb25zLnRyYW5zaXRpb24oKS5kdXJhdGlvbihvcHRpb25zLmR1cmF0aW9uKS5hdHRyKFwiZm9udC1zaXplXCIsIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZC5yYWRpdXMgKiAxLjc1ICsgJ3B4Jztcblx0XHRcdFx0XHR9KS5hdHRyKCd5JywgZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdHJldHVybiBkLnJhZGl1cyAqIC43NSArICdweCc7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH07XG5cdFx0XHRcdHZhciB1cGRhdGVfdmlzID0gZnVuY3Rpb24gKCkge1xuXG5cdFx0XHRcdFx0bm9kZXMuZm9yRWFjaChmdW5jdGlvbiAoZCwgaSkge1xuXHRcdFx0XHRcdFx0b3B0aW9ucy5jaXJjbGVzLnRyYW5zaXRpb24oKS5kdXJhdGlvbihvcHRpb25zLmR1cmF0aW9uKS5kZWxheShpICogb3B0aW9ucy5kdXJhdGlvbilcblx0XHRcdFx0XHRcdFx0LmF0dHIoXCJyXCIsIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRcdFx0ZC5yYWRpdXMgPSBkLnZhbHVlID0gc2NvcGUuY2hhcnRkYXRhW2QudHlwZV0gLyBzY29wZS5zaXplZmFjdG9yO1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBzY29wZS5jaGFydGRhdGFbZC50eXBlXSAvIHNjb3BlLnNpemVmYWN0b3I7XG5cdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0b3B0aW9ucy5pY29ucy50cmFuc2l0aW9uKCkuZHVyYXRpb24ob3B0aW9ucy5kdXJhdGlvbikuZGVsYXkoaSAqIG9wdGlvbnMuZHVyYXRpb24pXG5cdFx0XHRcdFx0XHRcdC5hdHRyKFwiZm9udC1zaXplXCIsIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIChzY29wZS5jaGFydGRhdGFbZC50eXBlXSAvIHNjb3BlLnNpemVmYWN0b3IpICogMS43NSArICdweCdcblx0XHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRcdFx0LmF0dHIoJ3knLCBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybiAoc2NvcGUuY2hhcnRkYXRhW2QudHlwZV0gLyBzY29wZS5zaXplZmFjdG9yKSAqIC43NSArICdweCc7XG5cdFx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH07XG5cdFx0XHRcdHZhciBjaGFyZ2UgPSBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdHJldHVybiAtTWF0aC5wb3coZC5yYWRpdXMsIDIuMCkgLyA0O1xuXHRcdFx0XHR9O1xuXHRcdFx0XHR2YXIgc3RhcnQgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0cmV0dXJuIG9wdGlvbnMuZm9yY2UgPSBkMy5sYXlvdXQuZm9yY2UoKS5ub2Rlcyhub2Rlcykuc2l6ZShbb3B0aW9ucy53aWR0aCwgb3B0aW9ucy5oZWlnaHRdKS5saW5rcyhsaW5rcyk7XG5cdFx0XHRcdH07XG5cdFx0XHRcdHZhciBkaXNwbGF5X2dyb3VwX2FsbCA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRvcHRpb25zLmZvcmNlLmdyYXZpdHkob3B0aW9ucy5sYXlvdXRfZ3Jhdml0eSkuY2hhcmdlKGNoYXJnZSkuZnJpY3Rpb24oMC44NSkub24oXCJ0aWNrXCIsIGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdFx0XHRvcHRpb25zLmNvbnRhaW5lcnMuZWFjaChtb3ZlX3Rvd2FyZHNfY2VudGVyKGUuYWxwaGEpKS5hdHRyKFwidHJhbnNmb3JtXCIsIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiAndHJhbnNsYXRlKCcgKyBkLnggKyAnLCcgKyBkLnkgKyAnKSc7XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRvcHRpb25zLmZvcmNlLnN0YXJ0KCk7XG5cdFx0XHRcdH07XG5cdFx0XHRcdHZhciBkaXNwbGF5X2J5X2NhdCA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRvcHRpb25zLmZvcmNlLmdyYXZpdHkob3B0aW9ucy5sYXlvdXRfZ3Jhdml0eSkuY2hhcmdlKGNoYXJnZSkuZnJpY3Rpb24oMC45KS5vbihcInRpY2tcIiwgZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0XHRcdG9wdGlvbnMuY29udGFpbmVycy5lYWNoKG1vdmVfdG93YXJkc19jYXQoZS5hbHBoYSkpLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuICd0cmFuc2xhdGUoJyArIGQueCArICcsJyArIGQueSArICcpJztcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdG9wdGlvbnMuZm9yY2Uuc3RhcnQoKTtcblx0XHRcdFx0fTtcblx0XHRcdFx0dmFyIG1vdmVfdG93YXJkc19jZW50ZXIgPSBmdW5jdGlvbiAoYWxwaGEpIHtcblx0XHRcdFx0XHRyZXR1cm4gKGZ1bmN0aW9uIChfdGhpcykge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRcdGQueCA9IGQueCArIChvcHRpb25zLndpZHRoLzIgLSBkLngpICogKG9wdGlvbnMuZGFtcGVyICsgMC4wMikgKiBhbHBoYSAqMS4yNTtcblx0XHRcdFx0XHRcdFx0ZC55ID0gZC55ICsgKG9wdGlvbnMuaGVpZ2h0LzIgLSBkLnkpICogKG9wdGlvbnMuZGFtcGVyICsgMC4wMikgKiBhbHBoYSAqIDEuMjU7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSkodGhpcyk7XG5cdFx0XHRcdH07XG5cdFx0XHRcdHZhciBtb3ZlX3Rvd2FyZHNfdG9wID0gZnVuY3Rpb24gKGFscGhhKSB7XG5cdFx0XHRcdFx0cmV0dXJuIChmdW5jdGlvbiAoX3RoaXMpIHtcblx0XHRcdFx0XHRcdHJldHVybiBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0XHRkLnggPSBkLnggKyAob3B0aW9ucy5jZW50ZXIueCAtIGQueCkgKiAob3B0aW9ucy5kYW1wZXIgKyAwLjAyKSAqIGFscGhhICogMS4xO1xuXHRcdFx0XHRcdFx0XHRkLnkgPSBkLnkgKyAoMjAwIC0gZC55KSAqIChvcHRpb25zLmRhbXBlciArIDAuMDIpICogYWxwaGEgKiAxLjE7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSkodGhpcyk7XG5cdFx0XHRcdH07XG5cdFx0XHRcdHZhciBtb3ZlX3Rvd2FyZHNfY2F0ID0gZnVuY3Rpb24gKGFscGhhKSB7XG5cdFx0XHRcdFx0cmV0dXJuIChmdW5jdGlvbiAoX3RoaXMpIHtcblx0XHRcdFx0XHRcdHJldHVybiBmdW5jdGlvbiAoZCkge1xuXG5cdFx0XHRcdFx0XHRcdHZhciB0YXJnZXQ7XG5cdFx0XHRcdFx0XHRcdHRhcmdldCA9IG9wdGlvbnMuY2F0X2NlbnRlcnNbZC5ncm91cF07XG5cdFx0XHRcdFx0XHRcdGQueCA9IGQueCArICh0YXJnZXQueCAtIGQueCkgKiAodGFyZ2V0LmRhbXBlciArIDAuMDIpICogYWxwaGEgKiAxO1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gZC55ID0gZC55ICsgKHRhcmdldC55IC0gZC55KSAqICh0YXJnZXQuZGFtcGVyICsgMC4wMikgKiBhbHBoYSAqIDE7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSkodGhpcyk7XG5cdFx0XHRcdH07XG5cdFx0XHRcdHZhciBzaG93X2RldGFpbHMgPSBmdW5jdGlvbiAoZGF0YSwgaSwgZWxlbWVudCkge1xuXHRcdFx0XHRcdHZhciBjb250ZW50O1xuXHRcdFx0XHRcdGNvbnRlbnQgPSBcIjxzcGFuIGNsYXNzPVxcXCJ0aXRsZVxcXCI+XCIgKyBkYXRhLm5hbWUgKyBcIjwvc3Bhbj48YnIvPlwiO1xuXHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChkYXRhLmRhdGEuY2hpbGRyZW4sIGZ1bmN0aW9uIChpbmZvKSB7XG5cdFx0XHRcdFx0XHRjb250ZW50ICs9IFwiPHNwYW4gY2xhc3M9XFxcIm5hbWVcXFwiIHN0eWxlPVxcXCJjb2xvcjpcIiArIChpbmZvLmNvbG9yIHx8IGRhdGEuY29sb3IpICsgXCJcXFwiPiBcIiArIChpbmZvLnRpdGxlKSArIFwiPC9zcGFuPjxici8+XCI7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0JGNvbXBpbGUob3B0aW9ucy50b29sdGlwLnNob3dUb29sdGlwKGNvbnRlbnQsIGRhdGEsIGQzLmV2ZW50LCBlbGVtKS5jb250ZW50cygpKShzY29wZSk7XG5cdFx0XHRcdH07XG5cblx0XHRcdFx0dmFyIGhpZGVfZGV0YWlscyA9IGZ1bmN0aW9uIChkYXRhLCBpLCBlbGVtZW50KSB7XG5cdFx0XHRcdFx0cmV0dXJuIG9wdGlvbnMudG9vbHRpcC5oaWRlVG9vbHRpcCgpO1xuXHRcdFx0XHR9O1xuXG5cdFx0XHRcdHNjb3BlLiR3YXRjaCgnY2hhcnRkYXRhJywgZnVuY3Rpb24gKGRhdGEsIG9sZERhdGEpIHtcblx0XHRcdFx0XHRvcHRpb25zLnRvb2x0aXAuaGlkZVRvb2x0aXAoKTtcblxuXHRcdFx0XHRcdGlmIChvcHRpb25zLmNpcmNsZXMgPT0gbnVsbCkge1xuXHRcdFx0XHRcdFx0Y3JlYXRlX25vZGVzKCk7XG5cdFx0XHRcdFx0XHRjcmVhdGVfdmlzKCk7XG5cdFx0XHRcdFx0XHRzdGFydCgpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHR1cGRhdGVfdmlzKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmKGxhYmVscy5sZW5ndGggPT0gMSB8fCBvcHRpb25zLmxhYmVscyAhPSB0cnVlKXtcblx0XHRcdFx0XHRcdFx0ZGlzcGxheV9ncm91cF9hbGwoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZWxzZXtcblx0XHRcdFx0XHRcdFx0ZGlzcGxheV9ieV9jYXQoKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0fSk7XG5cdFx0XHRcdHNjb3BlLiR3YXRjaCgnaW5kZXhlcicsIGZ1bmN0aW9uIChuLCBvKSB7XG5cdFx0XHRcdFx0aWYobiA9PT0gbyl7XG5cdFx0XHRcdFx0XHRyZXR1cm5cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYodHlwZW9mIG5bMF0uY2hpbGRyZW4gIT0gXCJ1bmRlZmluZWRcIil7XG5cdFx0XHRcdFx0XHRvcHRpb25zLnRvb2x0aXAuaGlkZVRvb2x0aXAoKTtcblx0XHRcdFx0XHRcdGNsZWFyX25vZGVzKCk7XG5cdFx0XHRcdFx0XHRjcmVhdGVfbm9kZXMoKTtcblx0XHRcdFx0XHRcdGNyZWF0ZV92aXMoKTtcblx0XHRcdFx0XHRcdHN0YXJ0KCk7XG5cblx0XHRcdFx0XHRcdGlmKGxhYmVscy5sZW5ndGggPT0gMSB8fCBvcHRpb25zLmxhYmVscyAhPSB0cnVlKXtcblx0XHRcdFx0XHRcdFx0XHRkaXNwbGF5X2dyb3VwX2FsbCgpO1xuXHRcdFx0XHRcdFx0XHRcdC8vY29uc29sZS5sb2coJ2FsbCcpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0ZWxzZXtcblx0XHRcdFx0XHRcdFx0XHQvL2Rpc3BsYXlfYnlfY2F0KCk7XG5cdFx0XHRcdFx0XHRcdFx0ZGlzcGxheV9ncm91cF9hbGwoKTtcblx0XHRcdFx0XHRcdFx0XHQvL2NvbnNvbGUubG9nKCdhbGwnKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRzY29wZS4kd2F0Y2goJ2RpcmVjdGlvbicsIGZ1bmN0aW9uIChvbGRELCBuZXdEKSB7XG5cdFx0XHRcdFx0aWYgKG9sZEQgPT09IG5ld0QpIHtcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKG9sZEQgPT0gXCJhbGxcIikge1xuXHRcdFx0XHRcdFx0ZGlzcGxheV9ncm91cF9hbGwoKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0ZGlzcGxheV9ieV9jYXQoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pXG5cdFx0XHR9XG5cdFx0fTtcblx0fSk7XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCAnYXBwLmNvbnRyb2xsZXJzJyApLmNvbnRyb2xsZXIoICdDYXRlZ29yaWVzQ3RybCcsIGZ1bmN0aW9uKCRmaWx0ZXIsIHRvYXN0ciwgRGF0YVNlcnZpY2Upe1xuXHRcdC8vXG5cdFx0dmFyIHZtID0gdGhpcztcblx0XHR2bS5zYXZlQ2F0ZWdvcnkgPSBzYXZlQ2F0ZWdvcnk7XG5cdFx0dm0ucXVlcnlTZWFyY2hDYXRlZ29yeSA9IHF1ZXJ5U2VhcmNoQ2F0ZWdvcnk7XG5cblx0XHRmdW5jdGlvbiBxdWVyeVNlYXJjaENhdGVnb3J5KHF1ZXJ5KSB7XG5cdFx0XHRjb25zb2xlLmxvZygkZmlsdGVyKCdmbGF0dGVuJykodm0uY2F0ZWdvcmllcykpO1xuXHRcdFx0cmV0dXJuICRmaWx0ZXIoJ2ZpbmRieW5hbWUnKSgkZmlsdGVyKCdmbGF0dGVuJykodm0uY2F0ZWdvcmllcyksIHF1ZXJ5LCAndGl0bGUnKTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBzYXZlQ2F0ZWdvcnkodmFsaWQpe1xuXHRcdFx0aWYodmFsaWQpe1xuXHRcdFx0XHREYXRhU2VydmljZS5wb3N0KCdjYXRlZ29yaWVzJywgdm0uY2F0ZWdvcnkpLnRoZW4oZnVuY3Rpb24oZGF0YSl7XG5cdFx0XHRcdFx0dm0uY2F0ZWdvcmllcy5wdXNoKGRhdGEpO1xuXHRcdFx0XHRcdHZtLmNyZWF0ZUNhdGVnb3J5ID0gZmFsc2U7XG5cdFx0XHRcdFx0dm0uaXRlbS5jYXRlZ29yaWVzLnB1c2goZGF0YSk7XG5cdFx0XHRcdFx0dG9hc3RyLnN1Y2Nlc3MoJ05ldyBDYXRlZ29yeSBoYXMgYmVlbiBzYXZlZCcsJ1N1Y2Nlc3MnKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fVxuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZGlyZWN0aXZlcycpLmRpcmVjdGl2ZSggJ2NhdGVnb3JpZXMnLCBmdW5jdGlvbigpIHtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRyZXN0cmljdDogJ0UnLFxuXHRcdFx0dGVtcGxhdGVVcmw6ICd2aWV3cy9kaXJlY3RpdmVzL2NhdGVnb3JpZXMvY2F0ZWdvcmllcy5odG1sJyxcblx0XHRcdGNvbnRyb2xsZXI6ICdDYXRlZ29yaWVzQ3RybCcsXG5cdFx0XHRjb250cm9sbGVyQXM6ICd2bScsXG5cdFx0XHRzY29wZTp7fSxcblx0XHRcdGJpbmRUb0NvbnRyb2xsZXI6IHtcblx0XHRcdFx0aXRlbTogJz0nLFxuXHRcdFx0XHRjYXRlZ29yaWVzOiAnPScsXG5cdFx0XHRcdG9wdGlvbnM6Jz0nLFxuXHRcdFx0XHRzYXZlOiAnJidcblx0XHRcdH0sXG5cdFx0XHRyZXBsYWNlOnRydWUsXG5cdFx0XHRsaW5rOiBmdW5jdGlvbiggc2NvcGUsIGVsZW1lbnQsIGF0dHJzICl7XG5cdFx0XHRcdC8vXG5cdFx0XHR9XG5cdFx0fTtcblxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSggJ2FwcC5jb250cm9sbGVycycgKS5jb250cm9sbGVyKCAnQ2lyY2xlZ3JhcGhDdHJsJywgZnVuY3Rpb24oKXtcblx0XHQvL1xuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5kaXJlY3RpdmVzJykuZGlyZWN0aXZlKCdjaXJjbGVncmFwaCcsIGZ1bmN0aW9uICgkdGltZW91dCkge1xuXHRcdHZhciBkZWZhdWx0cyA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdHdpZHRoOiA4MCxcblx0XHRcdFx0aGVpZ2h0OiA4MCxcblx0XHRcdFx0Y29sb3I6ICcjMDBjY2FhJyxcblx0XHRcdFx0c2l6ZTogMTc4LFxuXHRcdFx0XHRmaWVsZDogJ3JhbmsnXG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiB7XG5cdFx0XHRyZXN0cmljdDogJ0UnLFxuXHRcdFx0Y29udHJvbGxlcjogJ0NpcmNsZWdyYXBoQ3RybCcsXG5cdFx0XHRzY29wZToge1xuXHRcdFx0XHRvcHRpb25zOiAnPSdcblx0XHRcdH0sXG5cdFx0XHRyZXF1aXJlOiAnbmdNb2RlbCcsXG5cdFx0XHRsaW5rOiBmdW5jdGlvbiAoJHNjb3BlLCBlbGVtZW50LCAkYXR0cnMsIG5nTW9kZWwpIHtcblx0XHRcdFx0Ly9GZXRjaGluZyBPcHRpb25zXG5cblx0XHRcdFx0JHNjb3BlLm9wdGlvbnMgPSBhbmd1bGFyLmV4dGVuZChkZWZhdWx0cygpLCAkc2NvcGUub3B0aW9ucyk7XG5cblx0XHRcdFx0Ly9DcmVhdGluZyB0aGUgU2NhbGVcblx0XHRcdFx0dmFyIHJvdGF0ZSA9IGQzLnNjYWxlLmxpbmVhcigpXG5cdFx0XHRcdFx0LmRvbWFpbihbMSwgJHNjb3BlLm9wdGlvbnMuc2l6ZV0pXG5cdFx0XHRcdFx0LnJhbmdlKFsxLCAwXSlcblx0XHRcdFx0XHQuY2xhbXAodHJ1ZSk7XG5cblx0XHRcdFx0Ly9DcmVhdGluZyBFbGVtZW50c1xuXHRcdFx0XHR2YXIgc3ZnID0gZDMuc2VsZWN0KGVsZW1lbnRbMF0pLmFwcGVuZCgnc3ZnJylcblx0XHRcdFx0XHQuYXR0cignd2lkdGgnLCAkc2NvcGUub3B0aW9ucy53aWR0aClcblx0XHRcdFx0XHQuYXR0cignaGVpZ2h0JywgJHNjb3BlLm9wdGlvbnMuaGVpZ2h0KVxuXHRcdFx0XHRcdC5hcHBlbmQoJ2cnKTtcblx0XHRcdFx0dmFyIGNvbnRhaW5lciA9IHN2Zy5hcHBlbmQoJ2cnKVxuXHRcdFx0XHRcdC5hdHRyKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKCcgKyAkc2NvcGUub3B0aW9ucy53aWR0aCAvIDIgKyAnLCcgKyAkc2NvcGUub3B0aW9ucy5oZWlnaHQgLyAyICsgJyknKTtcblx0XHRcdFx0dmFyIGNpcmNsZUJhY2sgPSBjb250YWluZXIuYXBwZW5kKCdjaXJjbGUnKVxuXHRcdFx0XHRcdC5hdHRyKCdyJywgJHNjb3BlLm9wdGlvbnMud2lkdGggLyAyIC0gMilcblx0XHRcdFx0XHQuYXR0cignc3Ryb2tlLXdpZHRoJywgMilcblx0XHRcdFx0XHQuYXR0cignc3Ryb2tlJywgJHNjb3BlLm9wdGlvbnMuY29sb3IpXG5cdFx0XHRcdFx0LnN0eWxlKCdvcGFjaXR5JywgJzAuNicpXG5cdFx0XHRcdFx0LmF0dHIoJ2ZpbGwnLCAnbm9uZScpO1xuXHRcdFx0XHR2YXIgYXJjID0gZDMuc3ZnLmFyYygpXG5cdFx0XHRcdFx0LnN0YXJ0QW5nbGUoMClcblx0XHRcdFx0XHQuaW5uZXJSYWRpdXMoZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdHJldHVybiAkc2NvcGUub3B0aW9ucy53aWR0aCAvIDIgLSA0O1xuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0Lm91dGVyUmFkaXVzKGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gJHNjb3BlLm9wdGlvbnMud2lkdGggLyAyO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR2YXIgY2lyY2xlR3JhcGggPSBjb250YWluZXIuYXBwZW5kKCdwYXRoJylcblx0XHRcdFx0XHQuZGF0dW0oe1xuXHRcdFx0XHRcdFx0ZW5kQW5nbGU6IDIgKiBNYXRoLlBJICogMFxuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0LnN0eWxlKFwiZmlsbFwiLCAkc2NvcGUub3B0aW9ucy5jb2xvcilcblx0XHRcdFx0XHQuYXR0cignZCcsIGFyYyk7XG5cdFx0XHRcdHZhciB0ZXh0ID0gY29udGFpbmVyLnNlbGVjdEFsbCgndGV4dCcpXG5cdFx0XHRcdFx0LmRhdGEoWzBdKVxuXHRcdFx0XHRcdC5lbnRlcigpXG5cdFx0XHRcdFx0LmFwcGVuZCgndGV4dCcpXG5cdFx0XHRcdFx0LnRleHQoZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdHJldHVybiAnTsKwJyArIGQ7XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQuc3R5bGUoXCJmaWxsXCIsICRzY29wZS5vcHRpb25zLmNvbG9yKVxuXHRcdFx0XHRcdC5zdHlsZSgnZm9udC13ZWlnaHQnLCAnYm9sZCcpXG5cdFx0XHRcdFx0LmF0dHIoJ3RleHQtYW5jaG9yJywgJ21pZGRsZScpXG5cdFx0XHRcdFx0LmF0dHIoJ3knLCAnMC4zNWVtJyk7XG5cblx0XHRcdFx0Ly9UcmFuc2l0aW9uIGlmIHNlbGVjdGlvbiBoYXMgY2hhbmdlZFxuXHRcdFx0XHRmdW5jdGlvbiBhbmltYXRlSXQocmFkaXVzKSB7XG5cdFx0XHRcdFx0Y2lyY2xlR3JhcGgudHJhbnNpdGlvbigpXG5cdFx0XHRcdFx0XHQuZHVyYXRpb24oNzUwKVxuXHRcdFx0XHRcdFx0LmNhbGwoYXJjVHdlZW4sIHJvdGF0ZShyYWRpdXMpICogMiAqIE1hdGguUEkpO1xuXHRcdFx0XHRcdHRleHQudHJhbnNpdGlvbigpLmR1cmF0aW9uKDc1MCkudHdlZW4oJ3RleHQnLCBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0dmFyIGRhdGEgPSB0aGlzLnRleHRDb250ZW50LnNwbGl0KCdOwrAnKTtcblx0XHRcdFx0XHRcdHZhciBpID0gZDMuaW50ZXJwb2xhdGUocGFyc2VJbnQoZGF0YVsxXSksIHJhZGl1cyk7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZnVuY3Rpb24gKHQpIHtcblx0XHRcdFx0XHRcdFx0dGhpcy50ZXh0Q29udGVudCA9ICdOwrAnICsgKE1hdGgucm91bmQoaSh0KSAqIDEpIC8gMSk7XG5cdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvL1R3ZWVuIGFuaW1hdGlvbiBmb3IgdGhlIEFyY1xuXHRcdFx0XHRmdW5jdGlvbiBhcmNUd2Vlbih0cmFuc2l0aW9uLCBuZXdBbmdsZSkge1xuXHRcdFx0XHRcdHRyYW5zaXRpb24uYXR0clR3ZWVuKFwiZFwiLCBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0dmFyIGludGVycG9sYXRlID0gZDMuaW50ZXJwb2xhdGUoZC5lbmRBbmdsZSwgbmV3QW5nbGUpO1xuXHRcdFx0XHRcdFx0cmV0dXJuIGZ1bmN0aW9uICh0KSB7XG5cdFx0XHRcdFx0XHRcdGQuZW5kQW5nbGUgPSBpbnRlcnBvbGF0ZSh0KTtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGFyYyhkKTtcblx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQkc2NvcGUuJHdhdGNoKCdvcHRpb25zJywgZnVuY3Rpb24gKG4sIG8pIHtcblx0XHRcdFx0XHRpZiAobiA9PT0gbykge1xuXHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRjaXJjbGVCYWNrLnN0eWxlKCdzdHJva2UnLCBuLmNvbG9yKTtcblx0XHRcdFx0XHRjaXJjbGVHcmFwaC5zdHlsZSgnZmlsbCcsIG4uY29sb3IpO1xuXHRcdFx0XHRcdHRleHQuc3R5bGUoJ2ZpbGwnLCBuLmNvbG9yKTtcblx0XHRcdFx0XHQkdGltZW91dChmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRhbmltYXRlSXQobmdNb2RlbC4kbW9kZWxWYWx1ZVtuLmZpZWxkXSlcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0Ly9XYXRjaGluZyBpZiBzZWxlY3Rpb24gaGFzIGNoYW5nZWQgZnJvbSBhbm90aGVyIFVJIGVsZW1lbnRcblx0XHRcdFx0JHNjb3BlLiR3YXRjaChcblx0XHRcdFx0XHRmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gbmdNb2RlbC4kbW9kZWxWYWx1ZTtcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdGZ1bmN0aW9uIChuLCBvKSB7XG5cdFx0XHRcdFx0XHRpZiAoIW4pIHtcblx0XHRcdFx0XHRcdFx0biA9IHt9O1xuXHRcdFx0XHRcdFx0XHRuWyRzY29wZS5vcHRpb25zLmZpZWxkXSA9ICRzY29wZS5vcHRpb25zLnNpemU7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHQkdGltZW91dChmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRcdGFuaW1hdGVJdChuWyRzY29wZS5vcHRpb25zLmZpZWxkXSk7XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9O1xuXG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCAnYXBwLmNvbnRyb2xsZXJzJyApLmNvbnRyb2xsZXIoICdDb21wb3NpdHNDdHJsJywgZnVuY3Rpb24oKXtcblx0XHQvL1xuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZGlyZWN0aXZlcycpLmRpcmVjdGl2ZSggJ2NvbXBvc2l0cycsIGZ1bmN0aW9uKCkge1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlc3RyaWN0OiAnRUEnLFxuXHRcdFx0dGVtcGxhdGVVcmw6ICd2aWV3cy9kaXJlY3RpdmVzL2NvbXBvc2l0cy9jb21wb3NpdHMuaHRtbCcsXG5cdFx0XHRjb250cm9sbGVyOiAnQ29tcG9zaXRzQ3RybCcsXG5cdFx0XHRiaW5kVG9Db250cm9sbGVyOiB7XG5cdFx0XHRcdGl0ZW06ICc9Jyxcblx0XHRcdFx0Y29tcG9zaXRzOiAnPScsXG5cdFx0XHRcdG9wdGlvbnM6Jz0nLFxuXHRcdFx0XHRzYXZlOiAnJidcblx0XHRcdH0sXG5cdFx0XHRsaW5rOiBmdW5jdGlvbiggc2NvcGUsIGVsZW1lbnQsIGF0dHJzICl7XG5cdFx0XHRcdC8vXG5cdFx0XHR9XG5cdFx0fTtcblxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZGlyZWN0aXZlcycpLmRpcmVjdGl2ZSgnZmlsZURyb3B6b25lJywgZnVuY3Rpb24gKHRvYXN0cikge1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlc3RyaWN0OiAnRUEnLFxuXHRcdFx0c2NvcGU6IHtcbiAgICAgICAgZmlsZTogJz0nLFxuICAgICAgICBmaWxlTmFtZTogJz0nXG4gICAgICB9LFxuXHRcdFx0bGluazogZnVuY3Rpb24gKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuXHRcdFx0XHR2YXIgY2hlY2tTaXplLCBpc1R5cGVWYWxpZCwgcHJvY2Vzc0RyYWdPdmVyT3JFbnRlciwgdmFsaWRNaW1lVHlwZXM7XG5cdFx0XHRcdHByb2Nlc3NEcmFnT3Zlck9yRW50ZXIgPSBmdW5jdGlvbiAoZXZlbnQpIHtcblx0XHRcdFx0XHRpZiAoZXZlbnQgIT0gbnVsbCkge1xuXHRcdFx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZXZlbnQuZGF0YVRyYW5zZmVyLmVmZmVjdEFsbG93ZWQgPSAnY29weSc7XG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHR9O1xuXHRcdFx0XHR2YWxpZE1pbWVUeXBlcyA9IGF0dHJzLmZpbGVEcm9wem9uZTtcblx0XHRcdFx0Y2hlY2tTaXplID0gZnVuY3Rpb24gKHNpemUpIHtcblx0XHRcdFx0XHR2YXIgX3JlZjtcblx0XHRcdFx0XHRpZiAoKChfcmVmID0gYXR0cnMubWF4RmlsZVNpemUpID09PSAodm9pZCAwKSB8fCBfcmVmID09PSAnJykgfHwgKHNpemUgLyAxMDI0KSAvIDEwMjQgPCBhdHRycy5tYXhGaWxlU2l6ZSkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGFsZXJ0KFwiRmlsZSBtdXN0IGJlIHNtYWxsZXIgdGhhbiBcIiArIGF0dHJzLm1heEZpbGVTaXplICsgXCIgTUJcIik7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9O1xuXHRcdFx0XHRpc1R5cGVWYWxpZCA9IGZ1bmN0aW9uICh0eXBlKSB7XG5cdFx0XHRcdFx0aWYgKCh2YWxpZE1pbWVUeXBlcyA9PT0gKHZvaWQgMCkgfHwgdmFsaWRNaW1lVHlwZXMgPT09ICcnKSB8fCB2YWxpZE1pbWVUeXBlcy5pbmRleE9mKHR5cGUpID4gLTEpIHtcblx0XHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHR0b2FzdHIuZXJyb3IoXCJGaWxlIG11c3QgYmUgb25lIG9mIGZvbGxvd2luZyB0eXBlcyBcIiArIHZhbGlkTWltZVR5cGVzLCAnSW52YWxpZCBmaWxlIHR5cGUhJyk7XG5cblx0XHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH07XG5cdFx0XHRcdGVsZW1lbnQuYmluZCgnZHJhZ292ZXInLCBwcm9jZXNzRHJhZ092ZXJPckVudGVyKTtcblx0XHRcdFx0ZWxlbWVudC5iaW5kKCdkcmFnZW50ZXInLCBwcm9jZXNzRHJhZ092ZXJPckVudGVyKTtcblx0XHRcdFx0cmV0dXJuIGVsZW1lbnQuYmluZCgnZHJvcCcsIGZ1bmN0aW9uIChldmVudCkge1xuXHRcdFx0XHRcdHZhciBmaWxlLCBuYW1lLCByZWFkZXIsIHNpemUsIHR5cGU7XG5cdFx0XHRcdFx0aWYgKGV2ZW50ICE9IG51bGwpIHtcblx0XHRcdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XG5cdFx0XHRcdFx0cmVhZGVyLm9ubG9hZCA9IGZ1bmN0aW9uIChldnQpIHtcblx0XHRcdFx0XHRcdGlmIChjaGVja1NpemUoc2l6ZSkgJiYgaXNUeXBlVmFsaWQodHlwZSkpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIHNjb3BlLiRhcHBseShmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRcdFx0c2NvcGUuZmlsZSA9IGV2dC50YXJnZXQucmVzdWx0O1xuXHRcdFx0XHRcdFx0XHRcdGlmIChhbmd1bGFyLmlzU3RyaW5nKHNjb3BlLmZpbGVOYW1lKSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIHNjb3BlLmZpbGVOYW1lID0gbmFtZTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0ZmlsZSA9IGV2ZW50LmRhdGFUcmFuc2Zlci5maWxlc1swXTtcblx0XHRcdFx0XHQvKm5hbWUgPSBmaWxlLm5hbWU7XG5cdFx0XHRcdFx0dHlwZSA9IGZpbGUudHlwZTtcblx0XHRcdFx0XHRzaXplID0gZmlsZS5zaXplO1xuXHRcdFx0XHRcdHJlYWRlci5yZWFkQXNEYXRhVVJMKGZpbGUpOyovXG5cdFx0XHRcdFx0c2NvcGUuZmlsZSA9IGZpbGU7XG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9O1xuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSggJ2FwcC5jb250cm9sbGVycycgKS5jb250cm9sbGVyKCAnRmlsZURyb3B6b25lQ3RybCcsIGZ1bmN0aW9uKCl7XG5cdFx0Ly9cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmRpcmVjdGl2ZXMnKS5kaXJlY3RpdmUoICdoaXN0b3J5JywgZnVuY3Rpb24oKSB7XG5cdFx0dmFyIGRlZmF1bHRzID0gZnVuY3Rpb24oKXtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdGZpZWxkOiAnc2NvcmUnLFxuXHRcdFx0XHRjb2xvcjogJydcblx0XHRcdH1cblx0XHR9O1xuXHRcdHJldHVybiB7XG5cdFx0XHRyZXN0cmljdDogJ0UnLFxuXHRcdFx0dGVtcGxhdGVVcmw6ICd2aWV3cy9kaXJlY3RpdmVzL2hpc3RvcnkvaGlzdG9yeS5odG1sJyxcblx0XHRcdGNvbnRyb2xsZXI6ICdIaXN0b3J5Q3RybCcsXG5cdFx0XHRzY29wZTp7XG5cdFx0XHRcdG9wdGlvbnM6Jz0nLFxuXHRcdFx0XHRjaGFydGRhdGE6ICc9J1xuXHRcdFx0fSxcblx0XHRcdGxpbms6IGZ1bmN0aW9uKCAkc2NvcGUsIGVsZW1lbnQsICRhdHRycywgbmdNb2RlbCl7XG5cdFx0XHRcdFx0dmFyIG9wdGlvbnMgPSBhbmd1bGFyLmV4dGVuZChkZWZhdWx0cygpLCAkc2NvcGUub3B0aW9ucyk7XG5cdFx0XHR9XG5cdFx0fTtcblxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdIaXN0b3J5Q3RybCcsIGZ1bmN0aW9uICgkc2NvcGUpIHtcblx0XHQkc2NvcGUuc2V0RGF0YSA9IHNldERhdGE7XG5cdFx0YWN0aXZhdGUoKTtcblx0XG5cdFx0ZnVuY3Rpb24gYWN0aXZhdGUoKXtcblx0XHRcdCRzY29wZS5zZXREYXRhKCk7XG5cdFx0XHQkc2NvcGUuJHdhdGNoKCdvcHRpb25zJywgZnVuY3Rpb24obixvKXtcblx0XHRcdFx0aWYobiA9PT0gMCl7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cdFx0XHRcdCRzY29wZS5zZXREYXRhKCk7XG5cdFx0XHR9KVxuXHRcdH1cblx0XHRmdW5jdGlvbiBzZXREYXRhKCl7XG5cdFx0XHQkc2NvcGUuZGlzcGxheSA9IHtcblx0XHRcdFx0c2VsZWN0ZWRDYXQ6ICcnLFxuXHRcdFx0XHRyYW5rOiBbe1xuXHRcdFx0XHRcdGZpZWxkczoge1xuXHRcdFx0XHRcdFx0eDogJ3llYXInLFxuXHRcdFx0XHRcdFx0eTogJ3JhbmsnXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHR0aXRsZTogJ1JhbmsnLFxuXHRcdFx0XHRcdGNvbG9yOiAnIzUyYjY5NSdcblx0XHRcdFx0fV0sXG5cdFx0XHRcdHNjb3JlOiBbe1xuXHRcdFx0XHRcdGZpZWxkczoge1xuXHRcdFx0XHRcdFx0eDogJ3llYXInLFxuXHRcdFx0XHRcdFx0eTogJHNjb3BlLm9wdGlvbnMuZmllbGRcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdHRpdGxlOiAnU2NvcmUnLFxuXHRcdFx0XHRcdGNvbG9yOiAkc2NvcGUub3B0aW9ucy5jb2xvclxuXHRcdFx0XHR9XVxuXHRcdFx0fTtcblx0XHR9XG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZGlyZWN0aXZlcycpLmRpcmVjdGl2ZSggJ2luZGljYXRvcicsIGZ1bmN0aW9uKCkge1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlc3RyaWN0OiAnRUEnLFxuXHRcdFx0dGVtcGxhdGVVcmw6ICd2aWV3cy9kaXJlY3RpdmVzL2luZGljYXRvci9pbmRpY2F0b3IuaHRtbCcsXG5cdFx0XHRjb250cm9sbGVyOiAnSW5kaWNhdG9yQ3RybCcsXG5cdFx0XHRjb250cm9sbGVyQXM6ICd2bScsXG5cdFx0XHRzY29wZTp7XG5cdFx0XHRcdGl0ZW06ICc9Jyxcblx0XHRcdFx0b3B0aW9uczogJz0nLFxuXHRcdFx0XHRzZWxlY3RlZDogJz0nXG5cdFx0XHR9LFxuXHRcdFx0YmluZFRvQ29udHJvbGxlcjogdHJ1ZSxcblx0XHRcdHJlcGxhY2U6dHJ1ZSxcblx0XHRcdC8vcmVxdWlyZTogJ2l0ZW0nLFxuXHRcdFx0bGluazogZnVuY3Rpb24oIHNjb3BlLCBlbGVtZW50LCBhdHRycywgaXRlbU1vZGVsICl7XG5cdFx0XHRcdC8vXG5cdFx0XHRcdC8qc2NvcGUuJHdhdGNoKFxuXHRcdFx0XHRcdGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdHJldHVybiBpdGVtTW9kZWwuJG1vZGVsVmFsdWU7XG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRmdW5jdGlvbiAobiwgbykge1xuXHRcdFx0XHRcdFx0Y29uc29sZS5sb2cobik7XG5cdFx0XHRcdFx0fSk7Ki9cblx0XHRcdH1cblx0XHR9O1xuXG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0luZGljYXRvckN0cmwnLCBmdW5jdGlvbiAoJHNjb3BlLCBEYXRhU2VydmljZSwgQ29udGVudFNlcnZpY2UsIERpYWxvZ1NlcnZpY2UsICRmaWx0ZXIsIHRvYXN0ciwgVmVjdG9ybGF5ZXJTZXJ2aWNlKSB7XG5cdFx0Ly9cblx0XHR2YXIgdm0gPSB0aGlzO1xuXG5cdFx0dm0ub3JpZ2luYWwgPSBhbmd1bGFyLmNvcHkodm0uaXRlbSk7XG5cblx0XHR2bS5jaGVja0Jhc2UgPSBjaGVja0Jhc2U7XG5cdFx0dm0uY2hlY2tGdWxsID0gY2hlY2tGdWxsO1xuXG5cdFx0dm0uY2F0ZWdvcmllcyA9IFtdO1xuXHRcdHZtLmRhdGFwcm92aWRlcnMgPSBbXTtcblx0XHR2bS5zZWxlY3RlZEl0ZW0gPSBudWxsO1xuXHRcdHZtLnNlYXJjaFRleHQgPSBudWxsO1xuXHRcdHZtLnNlYXJjaFVuaXQgPSBudWxsO1xuXHRcdHZtLnF1ZXJ5U2VhcmNoID0gcXVlcnlTZWFyY2g7XG5cdFx0dm0ucXVlcnlVbml0ID0gcXVlcnlVbml0O1xuXG5cdFx0dm0uc2F2ZSA9IHNhdmU7XG5cblx0XHR2bS5jcmVhdGVQcm92aWRlciA9IGNyZWF0ZVByb3ZpZGVyO1xuXHRcdHZtLmNyZWF0ZVVuaXQgPSBjcmVhdGVVbml0O1xuXG5cdFx0YWN0aXZhdGUoKTtcblxuXHRcdGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xuXHRcdFx0bG9hZEFsbCgpO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIHF1ZXJ5U2VhcmNoKHF1ZXJ5KSB7XG5cdFx0XHRyZXR1cm4gJGZpbHRlcignZmluZGJ5bmFtZScpKHZtLmRhdGFwcm92aWRlcnMsIHF1ZXJ5LCAndGl0bGUnKTtcblx0XHR9XG5cdFx0ZnVuY3Rpb24gcXVlcnlVbml0KHF1ZXJ5KSB7XG5cdFx0XHRyZXR1cm4gJGZpbHRlcignZmluZGJ5bmFtZScpKHZtLm1lYXN1cmVUeXBlcywgcXVlcnksICd0aXRsZScpO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGxvYWRBbGwoKSB7XG5cdFx0XHR2bS5kYXRhcHJvdmlkZXJzID0gRGF0YVNlcnZpY2UuZ2V0QWxsKCdkYXRhcHJvdmlkZXJzJykuJG9iamVjdDtcblx0XHRcdHZtLmNhdGVnb3JpZXMgPSBDb250ZW50U2VydmljZS5nZXRDYXRlZ29yaWVzKHt0cmVlOnRydWV9KTtcblx0XHRcdHZtLm1lYXN1cmVUeXBlcyA9IERhdGFTZXJ2aWNlLmdldEFsbCgnbWVhc3VyZV90eXBlcycpLiRvYmplY3Q7XG5cdFx0XHR2bS5zdHlsZXMgPSBEYXRhU2VydmljZS5nZXRBbGwoJ3N0eWxlcycpLiRvYmplY3Q7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gY2hlY2tCYXNlKCl7XG5cdFx0XHRpZiAodm0uaXRlbS50aXRsZSAmJiB2bS5pdGVtLnR5cGUgJiYgdm0uaXRlbS5kYXRhcHJvdmlkZXIgJiYgdm0uaXRlbS50aXRsZS5sZW5ndGggPj0gMykge1xuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cdFx0ZnVuY3Rpb24gY2hlY2tGdWxsKCl7XG5cdFx0XHRpZih0eXBlb2Ygdm0uaXRlbS5jYXRlZ29yaWVzID09IFwidW5kZWZpbmVkXCIpIHJldHVybiBmYWxzZTtcblx0XHRcdHJldHVybiBjaGVja0Jhc2UoKSAmJiB2bS5pdGVtLmNhdGVnb3JpZXMubGVuZ3RoID8gdHJ1ZSA6IGZhbHNlO1xuXHRcdH1cblx0XHRmdW5jdGlvbiBzYXZlKCl7XG5cdFx0XHR2bS5pdGVtLnNhdmUoKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcblx0XHRcdFx0aWYocmVzcG9uc2Upe1xuXHRcdFx0XHRcdHRvYXN0ci5zdWNjZXNzKCdEYXRhIHN1Y2Nlc3NmdWxseSB1cGRhdGVkIScsICdTdWNjZXNzZnVsbHkgc2F2ZWQnKTtcblx0XHRcdFx0XHRcdHZtLm9yaWdpbmFsID0gYW5ndWxhci5jb3B5KHZtLml0ZW0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHQvL1RPRE86IElUUyBBIEhBQ0sgVE8gR0VUIElUIFdPUks6IG5nLWNsaWNrIHZzIG5nLW1vdXNlZG93blxuXHRcdGZ1bmN0aW9uIGNyZWF0ZVByb3ZpZGVyKHRleHQpe1xuXHRcdFx0RGlhbG9nU2VydmljZS5mcm9tVGVtcGxhdGUoJ2FkZFByb3ZpZGVyJywgJHNjb3BlKTtcblx0XHR9XG5cdFx0ZnVuY3Rpb24gY3JlYXRlVW5pdCh0ZXh0KXtcblx0XHRcdERpYWxvZ1NlcnZpY2UuZnJvbVRlbXBsYXRlKCdhZGRVbml0JywgJHNjb3BlKTtcblx0XHR9XG5cblx0XHQkc2NvcGUuJHdhdGNoKCd2bS5pdGVtJywgZnVuY3Rpb24obiwgbyl7XG5cdFx0XHRpZihuICE9IG8pIHtcblx0XHQgICAgdm0uaXRlbS5pc0RpcnR5ID0gIWFuZ3VsYXIuZXF1YWxzKHZtLml0ZW0sIHZtLm9yaWdpbmFsKTtcblx0XHQgIH1cblx0XHR9LHRydWUpO1xuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmRpcmVjdGl2ZXMnKS5kaXJlY3RpdmUoICdpbmRpY2F0b3JNZW51JywgZnVuY3Rpb24oKSB7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0cmVzdHJpY3Q6ICdFQScsXG5cdFx0XHRzY29wZToge1xuXHRcdFx0XHRpdGVtOiAnPWl0ZW0nXG5cdFx0XHR9LFxuXHRcdFx0cmVwbGFjZTp0cnVlLFxuXHRcdFx0dGVtcGxhdGVVcmw6ICd2aWV3cy9kaXJlY3RpdmVzL2luZGljYXRvck1lbnUvaW5kaWNhdG9yTWVudS5odG1sJyxcblx0XHRcdGNvbnRyb2xsZXI6ICdJbmRpY2F0b3JNZW51Q3RybCcsXG5cdFx0XHRjb250cm9sbGVyQXM6ICd2bScsXG5cdFx0XHRiaW5kVG9Db250cm9sbGVyOiB0cnVlLFxuXHRcdFx0bGluazogZnVuY3Rpb24oIHNjb3BlLCBlbGVtZW50LCBhdHRycyApe1xuXHRcdFx0XHQvL1xuXHRcdFx0XHR2YXIgY2wgPSAnYWN0aXZlJztcblx0XHRcdFx0dmFyIGVsID0gZWxlbWVudFswXTtcblx0XHRcdFx0dmFyIHBhcmVudCA9IGVsZW1lbnQucGFyZW50KCk7XG5cdFx0XHRcdHBhcmVudC5vbignbW91c2VlbnRlcicsIGZ1bmN0aW9uKGUpe1xuXHRcdFx0XHRcdGVsZW1lbnQuYWRkQ2xhc3MoY2wpO1xuXHRcdFx0XHR9KS5vbignbW91c2VsZWF2ZScsIGZ1bmN0aW9uKGUpe1xuXHRcdFx0XHRcdGVsZW1lbnQucmVtb3ZlQ2xhc3MoY2wpO1xuXHRcdFx0XHR9KTtcblx0XHRcdFx0XG5cdFx0XHR9XG5cdFx0fTtcblxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSggJ2FwcC5jb250cm9sbGVycycgKS5jb250cm9sbGVyKCAnSW5kaWNhdG9yTWVudUN0cmwnLCBmdW5jdGlvbigpe1xuXHRcdC8vXG5cdFx0dmFyIHZtID0gdGhpcztcblx0XHR2bS5jaGVja0Jhc2UgPSBjaGVja0Jhc2U7XG5cdFx0dm0ubG9ja2VkID0gbG9ja2VkO1xuXHRcdHZtLmNoYW5nZU9mZmljaWFsID0gY2hhbmdlT2ZmaWNpYWw7XG5cblx0XHRmdW5jdGlvbiBsb2NrZWQoKXtcblx0XHRcdHJldHVybiB2bS5pdGVtLmlzX29mZmljaWFsID8gJ2xvY2tfb3BlbicgOiAnbG9jayc7XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIGNoYW5nZU9mZmljaWFsKCl7XG5cdFx0XHR2bS5pdGVtLmlzX29mZmljaWFsID0gIXZtLml0ZW0uaXNfb2ZmaWNpYWw7XG5cdFx0XHR2bS5pdGVtLnNhdmUoKTtcblx0XHR9XG5cdFx0ZnVuY3Rpb24gY2hlY2tCYXNlKGl0ZW0pe1xuXHRcdFx0aWYgKGl0ZW0udGl0bGUgJiYgaXRlbS5tZWFzdXJlX3R5cGVfaWQgJiYgaXRlbS5kYXRhcHJvdmlkZXIgJiYgaXRlbS50aXRsZS5sZW5ndGggPj0gMykge1xuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG4gIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5kaXJlY3RpdmVzJykuZGlyZWN0aXZlKCdtZWRpYW4nLCBmdW5jdGlvbiAoJHRpbWVvdXQpIHtcblx0XHR2YXIgZGVmYXVsdHMgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRpZDogJ2dyYWRpZW50Jyxcblx0XHRcdFx0d2lkdGg6IDMwMCxcblx0XHRcdFx0aGVpZ2h0OiA0MCxcblx0XHRcdFx0aW5mbzogdHJ1ZSxcblx0XHRcdFx0ZmllbGQ6ICdzY29yZScsXG5cdFx0XHRcdGhhbmRsaW5nOiB0cnVlLFxuXHRcdFx0XHRtYXJnaW46IHtcblx0XHRcdFx0XHRsZWZ0OiAyMCxcblx0XHRcdFx0XHRyaWdodDogMjAsXG5cdFx0XHRcdFx0dG9wOiAxMCxcblx0XHRcdFx0XHRib3R0b206IDEwXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGNvbG9yczogWyB7XG5cdFx0XHRcdFx0cG9zaXRpb246IDAsXG5cdFx0XHRcdFx0Y29sb3I6ICdyZ2JhKDEwMiwxMDIsMTAyLDEpJyxcblx0XHRcdFx0XHRvcGFjaXR5OiAxXG5cdFx0XHRcdH0sIHtcblx0XHRcdFx0XHRwb3NpdGlvbjogNTMsXG5cdFx0XHRcdFx0Y29sb3I6ICdyZ2JhKDEyOCwgMjQzLCAxOTgsMSknLFxuXHRcdFx0XHRcdG9wYWNpdHk6IDFcblx0XHRcdFx0fSx7XG5cdFx0XHRcdFx0cG9zaXRpb246IDEwMCxcblx0XHRcdFx0XHRjb2xvcjogJ3JnYmEoMjU1LDI1NSwyNTUsMSknLFxuXHRcdFx0XHRcdG9wYWNpdHk6IDBcblx0XHRcdFx0fV1cblx0XHRcdH07XG5cdFx0fVxuXHRcdHJldHVybiB7XG5cdFx0XHRyZXN0cmljdDogJ0UnLFxuXHRcdFx0c2NvcGU6IHtcblx0XHRcdFx0ZGF0YTogJz0nLFxuXHRcdFx0XHRvcHRpb25zOiAnPSdcblx0XHRcdH0sXG5cdFx0XHRyZXF1aXJlOiAnbmdNb2RlbCcsXG5cdFx0XHRsaW5rOiBmdW5jdGlvbiAoJHNjb3BlLCBlbGVtZW50LCAkYXR0cnMsIG5nTW9kZWwpIHtcblxuXHRcdFx0XHR2YXIgb3B0aW9ucyA9IGFuZ3VsYXIuZXh0ZW5kKGRlZmF1bHRzKCksICRhdHRycyk7XG5cdFx0XHRcdG9wdGlvbnMgPSBhbmd1bGFyLmV4dGVuZChvcHRpb25zLCAkc2NvcGUub3B0aW9ucyk7XG5cdFx0XHRcdG9wdGlvbnMudW5pcXVlID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG5cdFx0XHRcdGlmKG9wdGlvbnMuY29sb3Ipe1xuXHRcdFx0XHRcdG9wdGlvbnMuY29sb3JzWzFdLmNvbG9yID0gb3B0aW9ucy5jb2xvcjtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbGVtZW50LmNzcygnaGVpZ2h0Jywgb3B0aW9ucy5oZWlnaHQgKyAncHgnKS5jc3MoJ2JvcmRlci1yYWRpdXMnLCBvcHRpb25zLmhlaWdodCAvIDIgKyAncHgnKTtcblx0XHRcdFx0dmFyIG1heCA9IDA7XG5cdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaCgkc2NvcGUuZGF0YSwgZnVuY3Rpb24gKG5hdCwga2V5KSB7XG5cdFx0XHRcdFx0bWF4ID0gZDMubWF4KFttYXgsIHBhcnNlSW50KG5hdFtvcHRpb25zLmZpZWxkXSldKTtcblx0XHRcdFx0fSk7XG5cdFx0XHRcdHZhciB4ID0gZDMuc2NhbGUubGluZWFyKClcblx0XHRcdFx0XHQuZG9tYWluKFswLCBtYXhdKVxuXHRcdFx0XHRcdC5yYW5nZShbb3B0aW9ucy5tYXJnaW4ubGVmdCwgb3B0aW9ucy53aWR0aCAtIG9wdGlvbnMubWFyZ2luLmxlZnRdKVxuXHRcdFx0XHRcdC5jbGFtcCh0cnVlKTtcblxuXHRcdFx0XHR2YXIgYnJ1c2ggPSBkMy5zdmcuYnJ1c2goKVxuXHRcdFx0XHRcdC54KHgpXG5cdFx0XHRcdFx0LmV4dGVudChbMCwgMF0pXG5cdFx0XHRcdFx0Lm9uKFwiYnJ1c2hcIiwgYnJ1c2gpXG5cdFx0XHRcdFx0Lm9uKFwiYnJ1c2hlbmRcIiwgYnJ1c2hlZCk7XG5cblx0XHRcdFx0dmFyIHN2ZyA9IGQzLnNlbGVjdChlbGVtZW50WzBdKS5hcHBlbmQoXCJzdmdcIilcblx0XHRcdFx0XHQuYXR0cihcIndpZHRoXCIsIG9wdGlvbnMud2lkdGgpXG5cdFx0XHRcdFx0LmF0dHIoXCJoZWlnaHRcIiwgb3B0aW9ucy5oZWlnaHQpXG5cdFx0XHRcdFx0LmFwcGVuZChcImdcIik7XG5cdFx0XHRcdC8vLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoMCxcIiArIG9wdGlvbnMubWFyZ2luLnRvcCAvIDIgKyBcIilcIik7XG5cdFx0XHRcdHZhciBncmFkaWVudCA9IHN2Zy5hcHBlbmQoJ3N2ZzpkZWZzJylcblx0XHRcdFx0XHQuYXBwZW5kKFwic3ZnOmxpbmVhckdyYWRpZW50XCIpXG5cdFx0XHRcdFx0LmF0dHIoJ2lkJywgb3B0aW9ucy5maWVsZCtvcHRpb25zLnVuaXF1ZSlcblx0XHRcdFx0XHQuYXR0cigneDEnLCAnMCUnKVxuXHRcdFx0XHRcdC5hdHRyKCd5MScsICcwJScpXG5cdFx0XHRcdFx0LmF0dHIoJ3gyJywgJzEwMCUnKVxuXHRcdFx0XHRcdC5hdHRyKCd5MicsICcwJScpXG5cdFx0XHRcdFx0LmF0dHIoJ3NwcmVhZE1ldGhvZCcsICdwYWQnKVxuXHRcdFx0XHRhbmd1bGFyLmZvckVhY2gob3B0aW9ucy5jb2xvcnMsIGZ1bmN0aW9uIChjb2xvcikge1xuXHRcdFx0XHRcdGdyYWRpZW50LmFwcGVuZCgnc3ZnOnN0b3AnKVxuXHRcdFx0XHRcdFx0LmF0dHIoJ29mZnNldCcsIGNvbG9yLnBvc2l0aW9uICsgJyUnKVxuXHRcdFx0XHRcdFx0LmF0dHIoJ3N0b3AtY29sb3InLCBjb2xvci5jb2xvcilcblx0XHRcdFx0XHRcdC5hdHRyKCdzdG9wLW9wYWNpdHknLCBjb2xvci5vcGFjaXR5KTtcblx0XHRcdFx0fSk7XG5cdFx0XHRcdHZhciByZWN0ID0gc3ZnLmFwcGVuZCgnc3ZnOnJlY3QnKVxuXHRcdFx0XHRcdC5hdHRyKCd3aWR0aCcsIG9wdGlvbnMud2lkdGgpXG5cdFx0XHRcdFx0LmF0dHIoJ2hlaWdodCcsIG9wdGlvbnMuaGVpZ2h0KVxuXHRcdFx0XHRcdC5zdHlsZSgnZmlsbCcsICd1cmwoIycgKyAob3B0aW9ucy5maWVsZCtvcHRpb25zLnVuaXF1ZSkrICcpJyk7XG5cdFx0XHRcdHZhciBsZWdlbmQgPSBzdmcuYXBwZW5kKCdnJykuYXR0cigndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgnICsgb3B0aW9ucy5oZWlnaHQgLyAyICsgJywgJyArIG9wdGlvbnMuaGVpZ2h0IC8gMiArICcpJylcblx0XHRcdFx0XHQuYXR0cignY2xhc3MnLCAnc3RhcnRMYWJlbCcpXG5cblx0XHRcdFx0aWYgKG9wdGlvbnMuaW5mbyA9PT0gdHJ1ZSkge1xuXHRcdFx0XHRcdGxlZ2VuZC5hcHBlbmQoJ2NpcmNsZScpXG5cdFx0XHRcdFx0XHQuYXR0cigncicsIG9wdGlvbnMuaGVpZ2h0IC8gMik7XG5cdFx0XHRcdFx0bGVnZW5kLmFwcGVuZCgndGV4dCcpXG5cdFx0XHRcdFx0XHQudGV4dCgwKVxuXHRcdFx0XHRcdFx0LnN0eWxlKCdmb250LXNpemUnLCBvcHRpb25zLmhlaWdodC8yLjUpXG5cdFx0XHRcdFx0XHQuYXR0cigndGV4dC1hbmNob3InLCAnbWlkZGxlJylcblx0XHRcdFx0XHRcdC5hdHRyKCd5JywgJy4zNWVtJylcblx0XHRcdFx0XHR2YXIgbGVnZW5kMiA9IHN2Zy5hcHBlbmQoJ2cnKS5hdHRyKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKCcgKyAob3B0aW9ucy53aWR0aCAtIChvcHRpb25zLmhlaWdodCAvIDIpKSArICcsICcgKyBvcHRpb25zLmhlaWdodCAvIDIgKyAnKScpXG5cdFx0XHRcdFx0XHQuYXR0cignY2xhc3MnLCAnZW5kTGFiZWwnKVxuXHRcdFx0XHRcdGxlZ2VuZDIuYXBwZW5kKCdjaXJjbGUnKVxuXHRcdFx0XHRcdFx0LmF0dHIoJ3InLCBvcHRpb25zLmhlaWdodCAvIDIpXG5cdFx0XHRcdFx0bGVnZW5kMi5hcHBlbmQoJ3RleHQnKVxuXHRcdFx0XHRcdFx0LnRleHQoZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRcdFx0Ly9URE9ETzogQ0hja2ljayBpZiBubyBjb21tYSB0aGVyZSBcblx0XHRcdFx0XHRcdFx0aWYobWF4ID4gMTAwMCl7XG5cdFx0XHRcdFx0XHRcdFx0dmFyIHYgPSAocGFyc2VJbnQobWF4KSAvIDEwMDApLnRvU3RyaW5nKCk7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIHYuc3Vic3RyKDAsIHYuaW5kZXhPZignLicpICkgKyBcImtcIiA7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0cmV0dXJuIG1heFxuXHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRcdC5zdHlsZSgnZm9udC1zaXplJywgb3B0aW9ucy5oZWlnaHQvMi41KVxuXHRcdFx0XHRcdFx0LmF0dHIoJ3RleHQtYW5jaG9yJywgJ21pZGRsZScpXG5cdFx0XHRcdFx0XHQuYXR0cigneScsICcuMzVlbScpXG5cdFx0XHRcdH1cblx0XHRcdFx0dmFyIHNsaWRlciA9IHN2Zy5hcHBlbmQoXCJnXCIpXG5cdFx0XHRcdFx0LmF0dHIoXCJjbGFzc1wiLCBcInNsaWRlclwiKTtcblx0XHRcdFx0aWYob3B0aW9ucy5oYW5kbGluZyA9PSB0cnVlKXtcblx0XHRcdFx0XHRzbGlkZXIuY2FsbChicnVzaCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRzbGlkZXIuc2VsZWN0KFwiLmJhY2tncm91bmRcIilcblx0XHRcdFx0XHQuYXR0cihcImhlaWdodFwiLCBvcHRpb25zLmhlaWdodCk7XG5cblx0XHRcdFx0aWYgKG9wdGlvbnMuaW5mbyA9PT0gdHJ1ZSkge1xuXHRcdFx0XHRzbGlkZXIuYXBwZW5kKCdsaW5lJylcblx0XHRcdFx0XHQuYXR0cigneDEnLCBvcHRpb25zLndpZHRoIC8gMilcblx0XHRcdFx0XHQuYXR0cigneTEnLCAwKVxuXHRcdFx0XHRcdC5hdHRyKCd4MicsIG9wdGlvbnMud2lkdGggLyAyKVxuXHRcdFx0XHRcdC5hdHRyKCd5MicsIG9wdGlvbnMuaGVpZ2h0KVxuXHRcdFx0XHRcdC5hdHRyKCdzdHJva2UtZGFzaGFycmF5JywgJzMsMycpXG5cdFx0XHRcdFx0LmF0dHIoJ3N0cm9rZS13aWR0aCcsIDEpXG5cdFx0XHRcdFx0LmF0dHIoJ3N0cm9rZScsICdyZ2JhKDAsMCwwLDg3KScpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHZhciBoYW5kbGVDb250ID0gc2xpZGVyLmFwcGVuZCgnZycpXG5cdFx0XHRcdFx0LmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoMCxcIiArIG9wdGlvbnMuaGVpZ2h0IC8gMiArIFwiKVwiKTtcblx0XHRcdFx0dmFyIGhhbmRsZSA9IGhhbmRsZUNvbnQuYXBwZW5kKFwiY2lyY2xlXCIpXG5cdFx0XHRcdFx0LmF0dHIoXCJjbGFzc1wiLCBcImhhbmRsZVwiKVxuXHRcdFx0XHRcdC5hdHRyKFwiclwiLCBvcHRpb25zLmhlaWdodCAvIDIpO1xuXHRcdFx0XHRcdGlmKG9wdGlvbnMuY29sb3Ipe1xuXHRcdFx0XHRcdFx0aGFuZGxlLnN0eWxlKCdmaWxsJywgb3B0aW9ucy5jb2xvcik7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR2YXIgaGFuZGxlTGFiZWwgPSBoYW5kbGVDb250LmFwcGVuZCgndGV4dCcpXG5cdFx0XHRcdFx0LnRleHQoMClcblx0XHRcdFx0XHQuc3R5bGUoJ2ZvbnQtc2l6ZScsIG9wdGlvbnMuaGVpZ2h0LzIuNSlcblx0XHRcdFx0XHQuYXR0cihcInRleHQtYW5jaG9yXCIsIFwibWlkZGxlXCIpLmF0dHIoJ3knLCAnMC4zNWVtJyk7XG5cblx0XHRcdFx0Ly9zbGlkZXJcblx0XHRcdFx0Ly8uY2FsbChicnVzaC5leHRlbnQoWzAsIDBdKSlcblx0XHRcdFx0Ly8uY2FsbChicnVzaC5ldmVudCk7XG5cblx0XHRcdFx0ZnVuY3Rpb24gYnJ1c2goKSB7XG5cdFx0XHRcdFx0dmFyIHZhbHVlID0gYnJ1c2guZXh0ZW50KClbMF07XG5cblx0XHRcdFx0XHRpZiAoZDMuZXZlbnQuc291cmNlRXZlbnQpIHtcblx0XHRcdFx0XHRcdHZhbHVlID0geC5pbnZlcnQoZDMubW91c2UodGhpcylbMF0pO1xuXHRcdFx0XHRcdFx0YnJ1c2guZXh0ZW50KFt2YWx1ZSwgdmFsdWVdKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYocGFyc2VJbnQodmFsdWUpID4gMTAwMCl7XG5cdFx0XHRcdFx0XHR2YXIgdiA9IChwYXJzZUludCh2YWx1ZSkgLyAxMDAwKS50b1N0cmluZygpO1xuXHRcdFx0XHRcdFx0aGFuZGxlTGFiZWwudGV4dCh2LnN1YnN0cigwLCB2LmluZGV4T2YoJy4nKSApICsgXCJrXCIgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZWxzZXtcblx0XHRcdFx0XHRcdGhhbmRsZUxhYmVsLnRleHQocGFyc2VJbnQodmFsdWUpKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRoYW5kbGVDb250LmF0dHIoXCJ0cmFuc2Zvcm1cIiwgJ3RyYW5zbGF0ZSgnICsgeCh2YWx1ZSkgKyAnLCcgKyBvcHRpb25zLmhlaWdodCAvIDIgKyAnKScpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0ZnVuY3Rpb24gYnJ1c2hlZCgpIHtcblxuXHRcdFx0XHRcdHZhciB2YWx1ZSA9IGJydXNoLmV4dGVudCgpWzBdLFxuXHRcdFx0XHRcdFx0Y291bnQgPSAwLFxuXHRcdFx0XHRcdFx0Zm91bmQgPSBmYWxzZTtcblx0XHRcdFx0XHR2YXIgZmluYWwgPSBcIlwiO1xuXHRcdFx0XHRcdC8qZG8ge1xuXG5cdFx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2goJHNjb3BlLmRhdGEsIGZ1bmN0aW9uIChuYXQsIGtleSkge1xuXHRcdFx0XHRcdFx0XHRpZiAocGFyc2VJbnQobmF0W29wdGlvbnMuZmllbGRdKSA9PSBwYXJzZUludCh2YWx1ZSkpIHtcblx0XHRcdFx0XHRcdFx0XHRmaW5hbCA9IG5hdDtcblx0XHRcdFx0XHRcdFx0XHRmb3VuZCA9IHRydWU7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0Y291bnQrKztcblx0XHRcdFx0XHRcdHZhbHVlID0gdmFsdWUgPiA1MCA/IHZhbHVlIC0gMSA6IHZhbHVlICsgMTtcblx0XHRcdFx0XHR9IHdoaWxlICghZm91bmQgJiYgY291bnQgPCBtYXgpO1xuXG5cdFx0XHRcdFx0bmdNb2RlbC4kc2V0Vmlld1ZhbHVlKGZpbmFsKTtcblx0XHRcdFx0XHRuZ01vZGVsLiRyZW5kZXIoKTsqL1xuXHRcdFx0XHR9XG5cdFx0XHRcdCRzY29wZS4kd2F0Y2goJ29wdGlvbnMnLCBmdW5jdGlvbihuLG8pe1xuXHRcdFx0XHRcdGlmKG4gPT09IG8pe1xuXHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRvcHRpb25zLmNvbG9yc1sxXS5jb2xvciA9IG4uY29sb3I7XG5cdFx0XHRcdFx0Z3JhZGllbnQgPSBzdmcuYXBwZW5kKCdzdmc6ZGVmcycpXG5cdFx0XHRcdFx0XHQuYXBwZW5kKFwic3ZnOmxpbmVhckdyYWRpZW50XCIpXG5cdFx0XHRcdFx0XHQuYXR0cignaWQnLCBvcHRpb25zLmZpZWxkK1wiX1wiK24uY29sb3IpXG5cdFx0XHRcdFx0XHQuYXR0cigneDEnLCAnMCUnKVxuXHRcdFx0XHRcdFx0LmF0dHIoJ3kxJywgJzAlJylcblx0XHRcdFx0XHRcdC5hdHRyKCd4MicsICcxMDAlJylcblx0XHRcdFx0XHRcdC5hdHRyKCd5MicsICcwJScpXG5cdFx0XHRcdFx0XHQuYXR0cignc3ByZWFkTWV0aG9kJywgJ3BhZCcpXG5cdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKG9wdGlvbnMuY29sb3JzLCBmdW5jdGlvbiAoY29sb3IpIHtcblx0XHRcdFx0XHRcdGdyYWRpZW50LmFwcGVuZCgnc3ZnOnN0b3AnKVxuXHRcdFx0XHRcdFx0XHQuYXR0cignb2Zmc2V0JywgY29sb3IucG9zaXRpb24gKyAnJScpXG5cdFx0XHRcdFx0XHRcdC5hdHRyKCdzdG9wLWNvbG9yJywgY29sb3IuY29sb3IpXG5cdFx0XHRcdFx0XHRcdC5hdHRyKCdzdG9wLW9wYWNpdHknLCBjb2xvci5vcGFjaXR5KTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRyZWN0LnN0eWxlKCdmaWxsJywgJ3VybCgjJyArIG9wdGlvbnMuZmllbGQgKyAnXycrbi5jb2xvcisnKScpO1xuXHRcdFx0XHRcdGhhbmRsZS5zdHlsZSgnZmlsbCcsIG4uY29sb3IpO1xuXHRcdFx0XHRcdGhhbmRsZUxhYmVsLnRleHQocGFyc2VJbnQobmdNb2RlbC4kbW9kZWxWYWx1ZVtuLmZpZWxkXSkpO1xuXHRcdFx0XHRcdGhhbmRsZUNvbnQudHJhbnNpdGlvbigpLmR1cmF0aW9uKDUwMCkuZWFzZSgncXVhZCcpLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgJ3RyYW5zbGF0ZSgnICsgeChuZ01vZGVsLiRtb2RlbFZhbHVlW24uZmllbGRdKSArICcsJyArIG9wdGlvbnMuaGVpZ2h0IC8gMiArICcpJyk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHQkc2NvcGUuJHdhdGNoKFxuXHRcdFx0XHRcdGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdHJldHVybiBuZ01vZGVsLiRtb2RlbFZhbHVlO1xuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0ZnVuY3Rpb24gKG5ld1ZhbHVlLCBvbGRWYWx1ZSkge1xuXHRcdFx0XHRcdFx0aWYgKCFuZXdWYWx1ZSkge1xuXHRcdFx0XHRcdFx0XHRoYW5kbGVMYWJlbC50ZXh0KHBhcnNlSW50KDApKTtcblx0XHRcdFx0XHRcdFx0aGFuZGxlQ29udC5hdHRyKFwidHJhbnNmb3JtXCIsICd0cmFuc2xhdGUoJyArIHgoMCkgKyAnLCcgKyBvcHRpb25zLmhlaWdodCAvIDIgKyAnKScpO1xuXHRcdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRoYW5kbGVMYWJlbC50ZXh0KHBhcnNlSW50KG5ld1ZhbHVlW29wdGlvbnMuZmllbGRdKSk7XG5cdFx0XHRcdFx0XHRpZiAobmV3VmFsdWUgPT0gb2xkVmFsdWUpIHtcblx0XHRcdFx0XHRcdFx0aGFuZGxlQ29udC5hdHRyKFwidHJhbnNmb3JtXCIsICd0cmFuc2xhdGUoJyArIHgobmV3VmFsdWVbb3B0aW9ucy5maWVsZF0pICsgJywnICsgb3B0aW9ucy5oZWlnaHQgLyAyICsgJyknKTtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdGhhbmRsZUNvbnQudHJhbnNpdGlvbigpLmR1cmF0aW9uKDUwMCkuZWFzZSgncXVhZCcpLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgJ3RyYW5zbGF0ZSgnICsgeChuZXdWYWx1ZVtvcHRpb25zLmZpZWxkXSkgKyAnLCcgKyBvcHRpb25zLmhlaWdodCAvIDIgKyAnKScpO1xuXG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fTtcblxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSggJ2FwcC5jb250cm9sbGVycycgKS5jb250cm9sbGVyKCAnTWVkaWFuQ3RybCcsIGZ1bmN0aW9uKCl7XG5cdFx0Ly9cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmRpcmVjdGl2ZXMnKS5kaXJlY3RpdmUoICdwYXJzZWNzdicsIGZ1bmN0aW9uKCRzdGF0ZSwgJHRpbWVvdXQsIHRvYXN0ciwgSW5kZXhTZXJ2aWNlKSB7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0cmVzdHJpY3Q6ICdFQScsXG5cdFx0XHR0ZW1wbGF0ZVVybDogJ3ZpZXdzL2RpcmVjdGl2ZXMvcGFyc2Vjc3YvcGFyc2Vjc3YuaHRtbCcsXG5cdFx0XHRjb250cm9sbGVyOiAnUGFyc2Vjc3ZDdHJsJyxcblx0XHRcdHJlcGxhY2U6dHJ1ZSxcblx0XHRcdGxpbms6IGZ1bmN0aW9uKCAkc2NvcGUsIGVsZW1lbnQsICRhdHRycyApe1xuXHRcdFx0XHQvL1xuXG5cdFx0XHRcdCRzY29wZS4kd2F0Y2goJ2ZpbGUnLCBmdW5jdGlvbihuLG8pe1xuXHRcdFx0XHRcdGlmKG49PT1vKSByZXR1cm4gZmFsc2U7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2cobik7XG5cdFx0XHRcdH0pXG5cdFx0XHRcdHZhciBlcnJvcnMgPSAwO1xuXHRcdFx0XHR2YXIgc3RlcHBlZCA9IDAsIHJvd0NvdW50ID0gMCwgZXJyb3JDb3VudCA9IDAsIGZpcnN0RXJyb3I7XG5cdFx0XHRcdHZhciBzdGFydCwgZW5kO1xuXHRcdFx0XHR2YXIgZmlyc3RSdW4gPSB0cnVlO1xuXHRcdFx0XHR2YXIgbWF4VW5wYXJzZUxlbmd0aCA9IDEwMDAwO1xuXHRcdFx0XHR2YXIgYnV0dG9uID0gZWxlbWVudC5maW5kKCdidXR0b24nKTtcblx0XHRcdFx0XHR2YXIgaW5wdXQgPSBlbGVtZW50LmZpbmQoJ2lucHV0Jyk7XG5cdFx0XHRcdFx0dmFyIGlzVmVydGljYWwgPSBmYWxzZTtcblx0XHRcdFx0XHR2YXIgcmF3ID0gW107XG5cdFx0XHRcdFx0dmFyIHJhd0xpc3QgPSB7fTtcblx0XHRcdFx0XHRpbnB1dC5jc3MoeyBkaXNwbGF5Oidub25lJyB9KTtcblx0XHRcdFx0XHRidXR0b24uYmluZCgnY2xpY2snLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdFx0aW5wdXRbMF0uY2xpY2soKTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRpbnB1dC5iaW5kKCdjaGFuZ2UnLGZ1bmN0aW9uKGUpe1xuXHRcdFx0XHRcdFx0aXNWZXJ0aWNhbCA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0cmF3ID0gW107XG5cdFx0XHRcdFx0XHRyYXdMaXN0ID0ge307XG5cblx0XHRcdFx0XHRcdGVycm9ycyA9IFtdO1xuXHRcdFx0XHRcdFx0c3RlcHBlZCA9IDAsIHJvd0NvdW50ID0gMCwgZXJyb3JDb3VudCA9IDAsIGZpcnN0RXJyb3I7XG5cdFx0XHRcdFx0XHRzdGFydCwgZW5kO1xuXHRcdFx0XHRcdFx0Zmlyc3RSdW4gPSB0cnVlO1xuXHRcdFx0XHRcdFx0XHQkdGltZW91dChmdW5jdGlvbigpe1xuXHRcdFx0XHRcdFx0XHRcdEluZGV4U2VydmljZS5jbGVhcigpO1xuXHRcdFx0XHRcdFx0XHRcdHZhciBjc3YgPSBQYXBhLnBhcnNlKGlucHV0WzBdLmZpbGVzWzBdLHtcblx0XHRcdFx0XHRcdFx0XHRcdHNraXBFbXB0eUxpbmVzOiB0cnVlLFxuXHRcdFx0XHRcdFx0XHRcdFx0aGVhZGVyOnRydWUsXG5cdFx0XHRcdFx0XHRcdFx0XHRkeW5hbWljVHlwaW5nOiB0cnVlLFxuXHRcdFx0XHRcdFx0XHRcdFx0c3RlcDpmdW5jdGlvbihyb3cpe1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2gocm93LmRhdGFbMF0sIGZ1bmN0aW9uKGl0ZW0sIGtleSl7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWYoaXNOYU4oaXRlbSkgfHwgaXRlbSA8IDAgKXtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlmKGl0ZW0udG9TdHJpbmcoKS50b1VwcGVyQ2FzZSgpID09IFwiI05BXCIgfHwgaXRlbSA8IDAgfHwgaXRlbS50b1N0cmluZygpLnRvVXBwZXJDYXNlKCkuaW5kZXhPZignTi9BJykgPiAtMSl7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHZhciBlcnJvciA9IHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR0eXBlOlwiMVwiLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1lc3NhZ2U6XCJGaWVsZCBpbiByb3cgaXMgbm90IHZhbGlkIGZvciBkYXRhYmFzZSB1c2UhXCIsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Y29sdW1uOiBrZXksXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0dmFsdWU6IGl0ZW1cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cm93LmVycm9ycy5wdXNoKGVycm9yKVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlcnJvcnMucHVzaChlcnJvcik7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWYoaXNWZXJ0aWNhbCl7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKHJvdy5kYXRhWzBdLCBmdW5jdGlvbihpdGVtLCBrZXkpe1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWYoa2V5Lmxlbmd0aCA9PSAzKXtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWYodHlwZW9mXHRyYXdMaXN0W2tleV0uZGF0YSA9PSBcInVuZGVmaW5lZFwiKXtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJhd0xpc3Rba2V5XS5kYXRhID0gW107XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cmF3TGlzdFtrZXldLmRhdGEucHVzaChpdGVtKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQvL3Jhd0xpc3Rba2V5XS5lcnJvcnMgPSByb3cuZXJyb3JzO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGVsc2V7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0SW5kZXhTZXJ2aWNlLmFkZERhdGEocm93KTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0XHQvL2NvbnNvbGUubG9nKHJvdyk7XG5cblx0XHRcdFx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRcdFx0XHRiZWZvcmVGaXJzdENodW5rOiBmdW5jdGlvbihjaHVuaylcblx0XHRcdFx0XHRcdFx0XHRcdHtcblxuXHRcdFx0XHRcdFx0XHRcdFx0XHQvL0NoZWNrIGlmIHRoZXJlIGFyZSBwb2ludHMgaW4gdGhlIGhlYWRlcnNcblx0XHRcdFx0XHRcdFx0XHRcdFx0dmFyIGluZGV4ID0gY2h1bmsubWF0Y2goIC9cXHJcXG58XFxyfFxcbi8gKS5pbmRleDtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR2YXIgZGVsaW1pdGVyID0gJywnO1xuXHRcdFx0XHRcdFx0XHRcdCAgICB2YXIgaGVhZGluZ3MgPSBjaHVuay5zdWJzdHIoMCwgaW5kZXgpLnNwbGl0KCAnLCcgKTtcblxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZihoZWFkaW5ncy5sZW5ndGggPCAyKXtcbiBcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aGVhZGluZ3MgPSBjaHVuay5zdWJzdHIoMCwgaW5kZXgpLnNwbGl0KCBcIlxcdFwiICk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGVsaW1pdGVyID0gJ1xcdCc7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0dmFyIGlzSXNvID0gW107XG5cblx0XHRcdFx0XHRcdFx0XHRcdFx0Zm9yKHZhciBpID0gMDsgaSA8PSBoZWFkaW5ncy5sZW5ndGg7IGkrKyl7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWYoaGVhZGluZ3NbaV0pe1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aGVhZGluZ3NbaV0gPSBoZWFkaW5nc1tpXS5yZXBsYWNlKC9bXmEtejAtOV0vZ2ksJ18nKS50b0xvd2VyQ2FzZSgpO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWYoaGVhZGluZ3NbaV0uaW5kZXhPZignLicpID4gLTEpe1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRoZWFkaW5nc1tpXSA9IGhlYWRpbmdzW2ldLnN1YnN0cigwLCBoZWFkaW5nc1tpXS5pbmRleE9mKCcuJykpO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0dmFyIGhlYWQgPSBoZWFkaW5nc1tpXS5zcGxpdCgnXycpO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWYoaGVhZC5sZW5ndGggPiAxKXtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aGVhZGluZ3NbaV0gPSAnJztcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Zm9yKHZhciBqID0gMDsgaiA8IGhlYWQubGVuZ3RoOyBqKyspe1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlmKGlzTmFOKGhlYWRbal0pKXtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlmKGogPiAwKXtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aGVhZGluZ3NbaV0gKz0gJ18nO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aGVhZGluZ3NbaV0gKz0gaGVhZFtqXTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWYoaGVhZGluZ3NbaV0ubGVuZ3RoID09IDMpe1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpc0lzby5wdXNoKHRydWUpO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZihoZWFkaW5ncy5sZW5ndGggPT0gaXNJc28ubGVuZ3RoKXtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpc1ZlcnRpY2FsID0gdHJ1ZTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGZvcih2YXIgaSA9IDA7IGkgPD0gaGVhZGluZ3MubGVuZ3RoOyBpKyspe1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZih0eXBlb2YgcmF3TGlzdFtoZWFkaW5nc1tpXV0gPT0gXCJ1bmRlZmluZWRcIil7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cmF3TGlzdFtoZWFkaW5nc1tpXV0gPSB7fTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRyYXdMaXN0W2hlYWRpbmdzW2ldXS5kYXRhID0gW107XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHRcdCAgICByZXR1cm4gaGVhZGluZ3Muam9pbihkZWxpbWl0ZXIpICsgY2h1bmsuc3Vic3RyKGluZGV4KTtcblx0XHRcdFx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRcdFx0XHRlcnJvcjogZnVuY3Rpb24oZXJyLCBmaWxlKVxuXHRcdFx0XHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRUb2FzdFNlcnZpY2UuZXJyb3IoZXJyKTtcblx0XHRcdFx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRcdFx0XHRjb21wbGV0ZTogZnVuY3Rpb24ocmVzdWx0cylcblx0XHRcdFx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0SW5kZXhTZXJ2aWNlLnNldEVycm9ycyhlcnJvcnMpO1xuXG5cdFx0XHRcdFx0XHRcdFx0XHRcdC8vU2VlIGlmIHRoZXJlIGlzIGFuIGZpZWxkIG5hbWUgXCJpc29cIiBpbiB0aGUgaGVhZGluZ3M7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlmKCFpc1ZlcnRpY2FsKXtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2goSW5kZXhTZXJ2aWNlLmdldEZpcnN0RW50cnkoKS5kYXRhWzBdLCBmdW5jdGlvbihpdGVtLCBrZXkpe1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWYoa2V5LnRvTG93ZXJDYXNlKCkuaW5kZXhPZignaXNvJykgIT0gLTEgfHwga2V5LnRvTG93ZXJDYXNlKCkuaW5kZXhPZignY29kZScpICE9IC0xKXtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0SW5kZXhTZXJ2aWNlLnNldElzb0ZpZWxkKGtleSk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlmKGtleS50b0xvd2VyQ2FzZSgpLmluZGV4T2YoJ2NvdW50cnknKSAhPSAtMSl7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0SW5kZXhTZXJ2aWNlLnNldENvdW50cnlGaWVsZChrZXkpO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlmKGtleS50b0xvd2VyQ2FzZSgpLmluZGV4T2YoJ3llYXInKSAhPSAtMSAmJiBpdGVtLnRvU3RyaW5nKCkubGVuZ3RoID09IDQpe1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdEluZGV4U2VydmljZS5zZXRZZWFyRmllbGQoa2V5KTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGVsc2V7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKHJhd0xpc3QsIGZ1bmN0aW9uKGl0ZW0sa2V5KXtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGl0ZW0uZXJyb3JzID0gW107XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZihrZXkudG9Mb3dlckNhc2UoKSAhPSBcInVuZGVmaW5lZFwiICYmIHR5cGVvZiBrZXkgIT0gXCJ1bmRlZmluZWRcIil7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHZhciByID0ge2lzbzprZXkudG9VcHBlckNhc2UoKX07XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChpdGVtLmRhdGEsIGZ1bmN0aW9uKGNvbHVtbiwgaSl7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0clsnY29sdW1uXycraV0gPSBjb2x1bW47XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWYoaXNOYU4oY29sdW1uKSB8fCBjb2x1bW4gPCAwICl7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZihjb2x1bW4udG9TdHJpbmcoKS50b1VwcGVyQ2FzZSgpID09IFwiTkFcIiB8fCBjb2x1bW4gPCAwIHx8IGNvbHVtbi50b1N0cmluZygpLnRvVXBwZXJDYXNlKCkuaW5kZXhPZignTi9BJykgPiAtMSl7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGl0ZW0uZXJyb3JzLnB1c2goe1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHR5cGU6XCIxXCIsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bWVzc2FnZTpcIkZpZWxkIGluIHJvdyBpcyBub3QgdmFsaWQgZm9yIGRhdGFiYXNlIHVzZSFcIixcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjb2x1bW46IGl0ZW1cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZXJyb3JzKys7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0SW5kZXhTZXJ2aWNlLmFkZERhdGEoe2RhdGE6W3JdLCBlcnJvcnM6aXRlbS5lcnJvcnN9KTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRJbmRleFNlcnZpY2Uuc2V0SXNvRmllbGQoJ2lzbycpO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cblxuXHRcdFx0XHRcdFx0XHRcdFx0XHRJbmRleFNlcnZpY2Uuc2V0VG9Mb2NhbFN0b3JhZ2UoKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0dG9hc3RyLmluZm8oSW5kZXhTZXJ2aWNlLmdldERhdGFTaXplKCkrJyBsaW5lcyBpbXBvcnRldCEnLCAnSW5mb3JtYXRpb24nKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0JHN0YXRlLmdvKCdhcHAuaW5kZXguY2hlY2snKTtcblx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH07XG5cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoICdhcHAuY29udHJvbGxlcnMnICkuY29udHJvbGxlciggJ1BhcnNlY3N2Q3RybCcsIGZ1bmN0aW9uKCl7XG5cdFx0Ly9cblxuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZGlyZWN0aXZlcycpLmRpcmVjdGl2ZSggJ3NpbXBsZWxpbmVjaGFydCcsIGZ1bmN0aW9uKCkge1xuXHRcdHZhciBkZWZhdWx0cyA9IGZ1bmN0aW9uKCl7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRpbnZlcnQ6ZmFsc2Vcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlc3RyaWN0OiAnRScsXG5cdFx0XHRzY29wZTp7XG5cdFx0XHRcdGRhdGE6Jz0nLFxuXHRcdFx0XHRzZWxlY3Rpb246Jz0nLFxuXHRcdFx0XHRvcHRpb25zOic9J1xuXHRcdFx0fSxcblx0XHRcdHRlbXBsYXRlVXJsOiAndmlld3MvZGlyZWN0aXZlcy9zaW1wbGVsaW5lY2hhcnQvc2ltcGxlbGluZWNoYXJ0Lmh0bWwnLFxuXHRcdFx0Y29udHJvbGxlcjogJ1NpbXBsZWxpbmVjaGFydEN0cmwnLFxuXHRcdFx0bGluazogZnVuY3Rpb24oICRzY29wZSwgZWxlbWVudCwgJGF0dHJzICl7XG5cdFx0XHRcdCRzY29wZS5vcHRpb25zID0gYW5ndWxhci5leHRlbmQoZGVmYXVsdHMoKSwgJHNjb3BlLm9wdGlvbnMpO1xuXHRcdFx0XHQkc2NvcGUuY2FsY3VsYXRlR3JhcGgoKTtcblx0XHRcdFx0JHNjb3BlLnNldENoYXJ0KCk7XG5cdFx0XHR9XG5cdFx0fTtcblxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdTaW1wbGVsaW5lY2hhcnRDdHJsJywgZnVuY3Rpb24gKCRzY29wZSkge1xuXHRcdCRzY29wZS5jb25maWcgPSB7XG5cdFx0XHR2aXNpYmxlOiB0cnVlLCAvLyBkZWZhdWx0OiB0cnVlXG5cdFx0XHRleHRlbmRlZDogZmFsc2UsIC8vIGRlZmF1bHQ6IGZhbHNlXG5cdFx0XHRkaXNhYmxlZDogZmFsc2UsIC8vIGRlZmF1bHQ6IGZhbHNlXG5cdFx0XHRhdXRvcmVmcmVzaDogdHJ1ZSwgLy8gZGVmYXVsdDogdHJ1ZVxuXHRcdFx0cmVmcmVzaERhdGFPbmx5OiBmYWxzZSwgLy8gZGVmYXVsdDogZmFsc2Vcblx0XHRcdGRlZXBXYXRjaE9wdGlvbnM6IHRydWUsIC8vIGRlZmF1bHQ6IHRydWVcblx0XHRcdGRlZXBXYXRjaERhdGE6IGZhbHNlLCAvLyBkZWZhdWx0OiBmYWxzZVxuXHRcdFx0ZGVlcFdhdGNoQ29uZmlnOiB0cnVlLCAvLyBkZWZhdWx0OiB0cnVlXG5cdFx0XHRkZWJvdW5jZTogMTAgLy8gZGVmYXVsdDogMTBcblx0XHR9O1xuXHRcdCRzY29wZS5jaGFydCA9IHtcblx0XHRcdG9wdGlvbnM6IHtcblx0XHRcdFx0Y2hhcnQ6IHt9XG5cdFx0XHR9LFxuXHRcdFx0ZGF0YTogW11cblx0XHR9O1xuXHRcdCRzY29wZS5zZXRDaGFydCA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdCRzY29wZS5jaGFydC5vcHRpb25zLmNoYXJ0ID0ge1xuXHRcdFx0XHR0eXBlOiAnbGluZUNoYXJ0Jyxcblx0XHRcdFx0bGVnZW5kUG9zaXRpb246ICdsZWZ0Jyxcblx0XHRcdFx0bWFyZ2luOiB7XG5cdFx0XHRcdFx0dG9wOiAyMCxcblx0XHRcdFx0XHRyaWdodDogMjAsXG5cdFx0XHRcdFx0Ym90dG9tOiAyMCxcblx0XHRcdFx0XHRsZWZ0OiAyMFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR4OiBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdHJldHVybiBkLng7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdHk6IGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGQueTtcblx0XHRcdFx0fSxcblx0XHRcdFx0c2hvd0xlZ2VuZDogZmFsc2UsXG5cdFx0XHRcdHNob3dWYWx1ZXM6IGZhbHNlLFxuXHRcdFx0XHRzaG93WUF4aXM6IGZhbHNlLFxuXHRcdFx0XHR0cmFuc2l0aW9uRHVyYXRpb246IDUwMCxcblx0XHRcdFx0dXNlSW50ZXJhY3RpdmVHdWlkZWxpbmU6IHRydWUsXG5cdFx0XHRcdC8vZm9yY2VZOiBbMTAwLCAwXSxcblx0XHRcdFx0Ly95RG9tYWluOnlEb21haW4sXG5cdFx0XHRcdHhBeGlzOiB7XG5cdFx0XHRcdFx0YXhpc0xhYmVsOiAnJ1xuXHRcdFx0XHR9LFxuXHRcdFx0XHR5QXhpczoge1xuXHRcdFx0XHRcdGF4aXNMYWJlbDogJycsXG5cdFx0XHRcdFx0YXhpc0xhYmVsRGlzdGFuY2U6IDMwXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGxlZ2VuZDoge1xuXHRcdFx0XHRcdHJpZ2h0QWxpZ246IGZhbHNlXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGxpbmVzOiB7XG5cdFx0XHRcdFx0aW50ZXJwb2xhdGU6ICdjYXJkaW5hbCdcblx0XHRcdFx0fVxuXG5cdFx0XHR9O1xuXHRcdFx0aWYgKCRzY29wZS5vcHRpb25zLmludmVydCA9PSB0cnVlKSB7XG5cdFx0XHRcdCRzY29wZS5jaGFydC5vcHRpb25zLmNoYXJ0LnlEb21haW4gPSBbcGFyc2VJbnQoJHNjb3BlLnJhbmdlLm1heCksICRzY29wZS5yYW5nZS5taW5dO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuICRzY29wZS5jaGFydDtcblx0XHR9XG5cdFx0JHNjb3BlLmNhbGN1bGF0ZUdyYXBoID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0dmFyIGNoYXJ0RGF0YSA9IFtdO1xuXHRcdFx0JHNjb3BlLnJhbmdlID0ge1xuXHRcdFx0XHRtYXg6IDAsXG5cdFx0XHRcdG1pbjogMTAwMFxuXHRcdFx0fTtcblx0XHRcdGFuZ3VsYXIuZm9yRWFjaCgkc2NvcGUuc2VsZWN0aW9uLCBmdW5jdGlvbiAoaXRlbSwga2V5KSB7XG5cdFx0XHRcdHZhciBncmFwaCA9IHtcblx0XHRcdFx0XHRpZDoga2V5LFxuXHRcdFx0XHRcdGtleTogaXRlbS50aXRsZSxcblx0XHRcdFx0XHRjb2xvcjogaXRlbS5jb2xvcixcblx0XHRcdFx0XHR2YWx1ZXM6IFtdXG5cdFx0XHRcdH07XG5cdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaCgkc2NvcGUuZGF0YSwgZnVuY3Rpb24gKGRhdGEsIGspIHtcblx0XHRcdFx0XHRncmFwaC52YWx1ZXMucHVzaCh7XG5cdFx0XHRcdFx0XHRpZDogayxcblx0XHRcdFx0XHRcdHg6IGRhdGFbaXRlbS5maWVsZHMueF0sXG5cdFx0XHRcdFx0XHR5OiBkYXRhW2l0ZW0uZmllbGRzLnldXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0JHNjb3BlLnJhbmdlLm1heCA9IE1hdGgubWF4KCRzY29wZS5yYW5nZS5tYXgsIGRhdGFbaXRlbS5maWVsZHMueV0pO1xuXHRcdFx0XHRcdCRzY29wZS5yYW5nZS5taW4gPSBNYXRoLm1pbigkc2NvcGUucmFuZ2UubWluLCBkYXRhW2l0ZW0uZmllbGRzLnldKTtcblx0XHRcdFx0fSk7XG5cdFx0XHRcdGNoYXJ0RGF0YS5wdXNoKGdyYXBoKTtcblx0XHRcdH0pO1xuXG5cdFx0XHQkc2NvcGUuY2hhcnQuZGF0YSA9IGNoYXJ0RGF0YTtcblx0XHRcdGlmICgkc2NvcGUub3B0aW9ucy5pbnZlcnQgPT0gXCJ0cnVlXCIpIHtcblx0XHRcdFx0JHNjb3BlLmNoYXJ0Lm9wdGlvbnMuY2hhcnQueURvbWFpbiA9IFtwYXJzZUludCgkc2NvcGUucmFuZ2UubWF4KSwgJHNjb3BlLnJhbmdlLm1pbl07XG5cdFx0XHR9XG5cdFx0fTtcblx0XHQkc2NvcGUuJHdhdGNoKCdkYXRhJywgZnVuY3Rpb24gKG4sIG8pIHtcblx0XHRcdGlmICghbikge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0XHQkc2NvcGUuY2FsY3VsYXRlR3JhcGgoKTtcblx0XHR9KTtcblx0XHQkc2NvcGUuJHdhdGNoKCdzZWxlY3Rpb24nLCBmdW5jdGlvbiAobiwgbykge1xuXHRcdFx0aWYgKG4gPT09IG8pIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdFx0JHNjb3BlLmNhbGN1bGF0ZUdyYXBoKCk7XG5cdFx0fSlcblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5kaXJlY3RpdmVzJykuYW5pbWF0aW9uKCcuc2xpZGUtdG9nZ2xlJywgWyckYW5pbWF0ZUNzcycsIGZ1bmN0aW9uKCRhbmltYXRlQ3NzKSB7XG5cblx0XHR2YXIgbGFzdElkID0gMDtcbiAgICAgICAgdmFyIF9jYWNoZSA9IHt9O1xuXG4gICAgICAgIGZ1bmN0aW9uIGdldElkKGVsKSB7XG4gICAgICAgICAgICB2YXIgaWQgPSBlbFswXS5nZXRBdHRyaWJ1dGUoXCJkYXRhLXNsaWRlLXRvZ2dsZVwiKTtcbiAgICAgICAgICAgIGlmICghaWQpIHtcbiAgICAgICAgICAgICAgICBpZCA9ICsrbGFzdElkO1xuICAgICAgICAgICAgICAgIGVsWzBdLnNldEF0dHJpYnV0ZShcImRhdGEtc2xpZGUtdG9nZ2xlXCIsIGlkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBpZDtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBnZXRTdGF0ZShpZCkge1xuICAgICAgICAgICAgdmFyIHN0YXRlID0gX2NhY2hlW2lkXTtcbiAgICAgICAgICAgIGlmICghc3RhdGUpIHtcbiAgICAgICAgICAgICAgICBzdGF0ZSA9IHt9O1xuICAgICAgICAgICAgICAgIF9jYWNoZVtpZF0gPSBzdGF0ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGdlbmVyYXRlUnVubmVyKGNsb3NpbmcsIHN0YXRlLCBhbmltYXRvciwgZWxlbWVudCwgZG9uZUZuKSB7XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgc3RhdGUuYW5pbWF0aW5nID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBzdGF0ZS5hbmltYXRvciA9IGFuaW1hdG9yO1xuICAgICAgICAgICAgICAgIHN0YXRlLmRvbmVGbiA9IGRvbmVGbjtcbiAgICAgICAgICAgICAgICBhbmltYXRvci5zdGFydCgpLmZpbmFsbHkoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjbG9zaW5nICYmIHN0YXRlLmRvbmVGbiA9PT0gZG9uZUZuKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50WzBdLnN0eWxlLmhlaWdodCA9ICcnO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHN0YXRlLmFuaW1hdGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBzdGF0ZS5hbmltYXRvciA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAgICAgc3RhdGUuZG9uZUZuKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgbGVhdmU6IGZ1bmN0aW9uKGVsZW1lbnQsIGRvbmVGbikge1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciBzdGF0ZSA9IGdldFN0YXRlKGdldElkKGVsZW1lbnQpKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGhlaWdodCA9IChzdGF0ZS5hbmltYXRpbmcgJiYgc3RhdGUuaGVpZ2h0KSA/XG4gICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZS5oZWlnaHQgOiBlbGVtZW50WzBdLm9mZnNldEhlaWdodDtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGFuaW1hdG9yID0gJGFuaW1hdGVDc3MoZWxlbWVudCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgZnJvbToge2hlaWdodDogaGVpZ2h0ICsgJ3B4Jywgb3BhY2l0eTogMX0sXG4gICAgICAgICAgICAgICAgICAgICAgICB0bzoge2hlaWdodDogJzBweCcsIG9wYWNpdHk6IDB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBpZiAoYW5pbWF0b3IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzdGF0ZS5hbmltYXRpbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZS5kb25lRm4gPVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2VuZXJhdGVSdW5uZXIodHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5pbWF0b3IsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZG9uZUZuKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gc3RhdGUuYW5pbWF0b3IuZW5kKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZS5oZWlnaHQgPSBoZWlnaHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGdlbmVyYXRlUnVubmVyKHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbmltYXRvcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZG9uZUZuKSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBkb25lRm4oKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlbnRlcjogZnVuY3Rpb24oZWxlbWVudCwgZG9uZUZuKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIHN0YXRlID0gZ2V0U3RhdGUoZ2V0SWQoZWxlbWVudCkpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgaGVpZ2h0ID0gKHN0YXRlLmFuaW1hdGluZyAmJiBzdGF0ZS5oZWlnaHQpID9cbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlLmhlaWdodCA6IGVsZW1lbnRbMF0ub2Zmc2V0SGVpZ2h0O1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciBhbmltYXRvciA9ICRhbmltYXRlQ3NzKGVsZW1lbnQsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZyb206IHtoZWlnaHQ6ICcwcHgnLCBvcGFjaXR5OiAwfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvOiB7aGVpZ2h0OiBoZWlnaHQgKyAncHgnLCBvcGFjaXR5OiAxfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFuaW1hdG9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3RhdGUuYW5pbWF0aW5nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGUuZG9uZUZuID0gZ2VuZXJhdGVSdW5uZXIoZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5pbWF0b3IsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkb25lRm4pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBzdGF0ZS5hbmltYXRvci5lbmQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlLmhlaWdodCA9IGhlaWdodDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZ2VuZXJhdGVSdW5uZXIoZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbmltYXRvcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZG9uZUZuKSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBkb25lRm4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XSk7XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCAnYXBwLmNvbnRyb2xsZXJzJyApLmNvbnRyb2xsZXIoICdTbGlkZVRvZ2dsZUN0cmwnLCBmdW5jdGlvbigpe1xuXHRcdC8vXG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5kaXJlY3RpdmVzJykuZGlyZWN0aXZlKCAnc3R5bGVzJywgZnVuY3Rpb24oKSB7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0cmVzdHJpY3Q6ICdFJyxcblx0XHRcdHRlbXBsYXRlVXJsOiAndmlld3MvZGlyZWN0aXZlcy9zdHlsZXMvc3R5bGVzLmh0bWwnLFxuXHRcdFx0Y29udHJvbGxlcjogJ1N0eWxlc0N0cmwnLFxuXHRcdFx0Y29udHJvbGxlckFzOiAndm0nLFxuXHRcdFx0c2NvcGU6e30sXG5cdFx0XHRiaW5kVG9Db250cm9sbGVyOiB7XG5cdFx0XHRcdGl0ZW06ICc9Jyxcblx0XHRcdFx0c3R5bGVzOiAnPScsXG5cdFx0XHRcdG9wdGlvbnM6Jz0nLFxuXHRcdFx0XHRzYXZlOiAnJidcblx0XHRcdH0sXG5cdFx0XHRyZXBsYWNlOnRydWUsXG5cdFx0XHRsaW5rOiBmdW5jdGlvbiggc2NvcGUsIGVsZW1lbnQsIGF0dHJzICl7XG5cdFx0XHRcdC8vXG5cdFx0XHR9XG5cdFx0fTtcblxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdTdHlsZXNDdHJsJywgZnVuY3Rpb24gKHRvYXN0ciwgRGF0YVNlcnZpY2UpIHtcblx0XHQvL1xuXHRcdHZhciB2bSA9IHRoaXM7XG5cdFx0dm0udG9nZ2xlU3R5bGUgPSB0b2dnbGVTdHlsZTtcblx0XHR2bS5zZWxlY3RlZFN0eWxlID0gc2VsZWN0ZWRTdHlsZTtcblx0XHR2bS5zYXZlU3R5bGUgPSBzYXZlU3R5bGU7XG5cblx0XHRmdW5jdGlvbiB0b2dnbGVTdHlsZShzdHlsZSkge1xuXHRcdFx0aWYgKHZtLml0ZW0uc3R5bGVfaWQgPT0gc3R5bGUuaWQpIHtcblx0XHRcdFx0dm0uaXRlbS5zdHlsZV9pZCA9IDA7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR2bS5pdGVtLnN0eWxlX2lkID0gc3R5bGUuaWRcblx0XHRcdFx0dm0uaXRlbS5zdHlsZSA9IHN0eWxlO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRmdW5jdGlvbiBzZWxlY3RlZFN0eWxlKGl0ZW0sIHN0eWxlKSB7XG5cdFx0XHRyZXR1cm4gdm0uaXRlbS5zdHlsZV9pZCA9PSBzdHlsZS5pZCA/IHRydWUgOiBmYWxzZTtcblx0XHR9XG5cdFx0ZnVuY3Rpb24gc2F2ZVN0eWxlKCkge1xuXHRcdFx0RGF0YVNlcnZpY2UucG9zdCgnc3R5bGVzJywgdm0uc3R5bGUpLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcblx0XHRcdFx0dm0uc3R5bGVzLnB1c2goZGF0YSk7XG5cdFx0XHRcdHZtLmNyZWF0ZVN0eWxlID0gZmFsc2U7XG5cdFx0XHRcdHZtLml0ZW0uc3R5bGUgPSBkYXRhO1xuXHRcdFx0XHR0b2FzdHIuc3VjY2VzcygnTmV3IFN0eWxlIGhhcyBiZWVuIHNhdmVkJywgJ1N1Y2Nlc3MnKTtcblx0XHRcdH0pO1xuXHRcdH1cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmRpcmVjdGl2ZXMnKS5kaXJlY3RpdmUoJ3N1YmluZGV4Jywgc3ViaW5kZXgpO1xuXG5cdHN1YmluZGV4LiRpbmplY3QgPSBbJyR0aW1lb3V0JywgJ3Ntb290aFNjcm9sbCddO1xuXG5cdGZ1bmN0aW9uIHN1YmluZGV4KCR0aW1lb3V0LCBzbW9vdGhTY3JvbGwpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0cmVzdHJpY3Q6ICdFJyxcblx0XHRcdHJlcGxhY2U6IHRydWUsXG5cdFx0XHRjb250cm9sbGVyOiAnU3ViaW5kZXhDdHJsJyxcblx0XHRcdHRlbXBsYXRlVXJsOiAndmlld3MvZGlyZWN0aXZlcy9zdWJpbmRleC9zdWJpbmRleC5odG1sJyxcblx0XHRcdGxpbms6IHN1YmluZGV4TGlua0Z1bmN0aW9uXG5cdFx0fTtcblxuXHRcdGZ1bmN0aW9uIHN1YmluZGV4TGlua0Z1bmN0aW9uKCRzY29wZSwgZWxlbWVudCwgJGF0dHJzKSB7XG5cdFx0fVxuXHR9XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignU3ViaW5kZXhDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCAkZmlsdGVyLCAkdGltZW91dCkge1xuXHRcdCRzY29wZS5pbmZvID0gZmFsc2U7XG5cdFx0JHNjb3BlLnNldENoYXJ0ID0gc2V0Q2hhcnQ7XG5cdFx0JHNjb3BlLmNhbGN1bGF0ZUdyYXBoID0gY2FsY3VsYXRlR3JhcGg7XG5cdFx0JHNjb3BlLmNyZWF0ZUluZGV4ZXIgPSBjcmVhdGVJbmRleGVyO1xuXHRcdCRzY29wZS5jYWxjU3ViUmFuayA9IGNhbGNTdWJSYW5rO1xuXHRcdCRzY29wZS50b2dnbGVJbmZvID0gdG9nZ2xlSW5mbztcblx0XHQkc2NvcGUuY3JlYXRlT3B0aW9ucyA9IGNyZWF0ZU9wdGlvbnM7XG5cdFx0JHNjb3BlLmdldFN1YlJhbmsgPSBnZXRTdWJSYW5rO1xuXHRcdGFjdGl2YXRlKCk7XG5cblx0XHRmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcblx0XHRcdCRzY29wZS5jYWxjU3ViUmFuaygpO1xuXHRcdFx0JHNjb3BlLnNldENoYXJ0KCk7XG5cdFx0XHQkc2NvcGUuY2FsY3VsYXRlR3JhcGgoKTtcblx0XHRcdCRzY29wZS5jcmVhdGVJbmRleGVyKCk7XG5cdFx0XHQkc2NvcGUuY3JlYXRlT3B0aW9ucygpO1xuXHRcdFx0JHNjb3BlLiR3YXRjaCgnZGlzcGxheS5zZWxlY3RlZENhdCcsIGZ1bmN0aW9uKG5ld0l0ZW0sIG9sZEl0ZW0pIHtcblx0XHRcdFx0aWYgKG5ld0l0ZW0gPT09IG9sZEl0ZW0pIHtcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdH1cblx0XHRcdFx0JHNjb3BlLmNyZWF0ZUluZGV4ZXIoKTtcblx0XHRcdFx0JHNjb3BlLmNhbGN1bGF0ZUdyYXBoKCk7XG5cdFx0XHRcdCRzY29wZS5jcmVhdGVPcHRpb25zKCk7XG5cdFx0XHRcdCRzY29wZS5jYWxjU3ViUmFuaygpO1xuXHRcdFx0fSk7XG5cdFx0XHQkc2NvcGUuJHdhdGNoKCdjdXJyZW50JywgZnVuY3Rpb24obiwgbykge1xuXHRcdFx0XHRpZiAobiA9PT0gbykge1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXHRcdFx0XHQkc2NvcGUuY2FsY1N1YlJhbmsoKTtcblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIHRvZ2dsZUluZm8oKSB7XG5cdFx0XHQkc2NvcGUuaW5mbyA9ICEkc2NvcGUuaW5mbztcblx0XHR9O1xuXG5cdFx0ZnVuY3Rpb24gY2FsY1N1YlJhbmsoKSB7XG5cdFx0XHR2YXIgcmFuayA9IDA7XG5cdFx0XHRhbmd1bGFyLmZvckVhY2goJHNjb3BlLmRhdGEsIGZ1bmN0aW9uKGl0ZW0pIHtcblx0XHRcdFx0aXRlbVskc2NvcGUuZGlzcGxheS5zZWxlY3RlZENhdC50eXBlXSA9IHBhcnNlRmxvYXQoaXRlbVskc2NvcGUuZGlzcGxheS5zZWxlY3RlZENhdC50eXBlXSk7XG5cdFx0XHRcdGl0ZW1bJ3Njb3JlJ10gPSBwYXJzZUludChpdGVtWydzY29yZSddKTtcblx0XHRcdH0pXG5cdFx0XHR2YXIgZmlsdGVyID0gJGZpbHRlcignb3JkZXJCeScpKCRzY29wZS5lcGksIFskc2NvcGUuZGlzcGxheS5zZWxlY3RlZENhdC50eXBlLCBcInNjb3JlXCJdLCB0cnVlKTtcblx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgZmlsdGVyLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdGlmIChmaWx0ZXJbaV0uaXNvID09ICRzY29wZS5jdXJyZW50Lmlzbykge1xuXHRcdFx0XHRcdHJhbmsgPSBpICsgMTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0JHNjb3BlLmN1cnJlbnRbJHNjb3BlLmRpc3BsYXkuc2VsZWN0ZWRDYXQudHlwZSsnX3JhbmsnXSA9IHJhbms7XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIGdldFN1YlJhbmsoY291bnRyeSl7XG5cdFx0XHR2YXIgZmlsdGVyID0gJGZpbHRlcignb3JkZXJCeScpKCRzY29wZS5lcGksIFskc2NvcGUuZGlzcGxheS5zZWxlY3RlZENhdC50eXBlLCBcInNjb3JlXCJdLCB0cnVlKTtcblx0XHRcdHZhciByYW5rID0gMDtcblx0XHRcdGFuZ3VsYXIuZm9yRWFjaChmaWx0ZXIsIGZ1bmN0aW9uKGl0ZW0sIGtleSl7XG5cdFx0XHRcdGlmKGl0ZW0uY291bnRyeSA9PSBjb3VudHJ5LmNvdW50cnkpe1xuXHRcdFx0XHRcdHJhbmsgPSBrZXk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdFx0cmV0dXJuIHJhbmsrMTtcblx0XHR9XG5cdFx0ZnVuY3Rpb24gY3JlYXRlSW5kZXhlcigpIHtcblx0XHRcdCRzY29wZS5pbmRleGVyID0gWyRzY29wZS4kcGFyZW50LmRpc3BsYXkuc2VsZWN0ZWRDYXQuZGF0YV07XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gY3JlYXRlT3B0aW9ucygpIHtcblx0XHRcdCRzY29wZS5tZWRpYW5PcHRpb25zID0ge1xuXHRcdFx0XHRjb2xvcjogJHNjb3BlLiRwYXJlbnQuZGlzcGxheS5zZWxlY3RlZENhdC5jb2xvcixcblx0XHRcdFx0ZmllbGQ6ICRzY29wZS4kcGFyZW50LmRpc3BsYXkuc2VsZWN0ZWRDYXQudHlwZSxcblx0XHRcdFx0aGFuZGxpbmc6IGZhbHNlLFxuXHRcdFx0XHRtYXJnaW46e1xuXHRcdFx0XHRcdGxlZnQ6MTBcblx0XHRcdFx0fVxuXHRcdFx0fTtcblx0XHRcdCRzY29wZS5tZWRpYW5PcHRpb25zQmlnID0ge1xuXHRcdFx0XHRjb2xvcjogJHNjb3BlLiRwYXJlbnQuZGlzcGxheS5zZWxlY3RlZENhdC5jb2xvcixcblx0XHRcdFx0ZmllbGQ6ICRzY29wZS4kcGFyZW50LmRpc3BsYXkuc2VsZWN0ZWRDYXQudHlwZSxcblx0XHRcdFx0aGFuZGxpbmc6IGZhbHNlLFxuXHRcdFx0XHRtYXJnaW46e1xuXHRcdFx0XHRcdGxlZnQ6MjBcblx0XHRcdFx0fVxuXHRcdFx0fTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBzZXRDaGFydCgpIHtcblx0XHRcdCRzY29wZS5jaGFydCA9IHtcblx0XHRcdFx0b3B0aW9uczoge1xuXHRcdFx0XHRcdGNoYXJ0OiB7XG5cdFx0XHRcdFx0XHR0eXBlOiAnbGluZUNoYXJ0Jyxcblx0XHRcdFx0XHRcdC8vaGVpZ2h0OiAyMDAsXG5cdFx0XHRcdFx0XHRsZWdlbmRQb3NpdGlvbjogJ2xlZnQnLFxuXHRcdFx0XHRcdFx0bWFyZ2luOiB7XG5cdFx0XHRcdFx0XHRcdHRvcDogMjAsXG5cdFx0XHRcdFx0XHRcdHJpZ2h0OiAyMCxcblx0XHRcdFx0XHRcdFx0Ym90dG9tOiAyMCxcblx0XHRcdFx0XHRcdFx0bGVmdDogMjBcblx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHR4OiBmdW5jdGlvbihkKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBkLng7XG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0eTogZnVuY3Rpb24oZCkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gZC55O1xuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdHNob3dWYWx1ZXM6IGZhbHNlLFxuXHRcdFx0XHRcdFx0c2hvd1lBeGlzOiBmYWxzZSxcblx0XHRcdFx0XHRcdHRyYW5zaXRpb25EdXJhdGlvbjogNTAwLFxuXHRcdFx0XHRcdFx0dXNlSW50ZXJhY3RpdmVHdWlkZWxpbmU6IHRydWUsXG5cdFx0XHRcdFx0XHRmb3JjZVk6IFsxMDAsIDBdLFxuXHRcdFx0XHRcdFx0eEF4aXM6IHtcblx0XHRcdFx0XHRcdFx0YXhpc0xhYmVsOiAnJ1xuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdHlBeGlzOiB7XG5cdFx0XHRcdFx0XHRcdGF4aXNMYWJlbDogJycsXG5cdFx0XHRcdFx0XHRcdGF4aXNMYWJlbERpc3RhbmNlOiAzMFxuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdGxlZ2VuZDoge1xuXHRcdFx0XHRcdFx0XHRyaWdodEFsaWduOiBmYWxzZSxcblx0XHRcdFx0XHRcdFx0bWFyZ2luOiB7XG5cdFx0XHRcdFx0XHRcdFx0Ym90dG9tOiAzMFxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0bGluZXM6IHtcblx0XHRcdFx0XHRcdFx0aW50ZXJwb2xhdGU6ICdjYXJkaW5hbCdcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sXG5cdFx0XHRcdGRhdGE6IFtdXG5cdFx0XHR9O1xuXHRcdFx0cmV0dXJuICRzY29wZS5jaGFydDtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBjYWxjdWxhdGVHcmFwaCgpIHtcblx0XHRcdHZhciBjaGFydERhdGEgPSBbXTtcblx0XHRcdGFuZ3VsYXIuZm9yRWFjaCgkc2NvcGUuZGlzcGxheS5zZWxlY3RlZENhdC5jaGlsZHJlbiwgZnVuY3Rpb24oaXRlbSwga2V5KSB7XG5cdFx0XHRcdHZhciBncmFwaCA9IHtcblx0XHRcdFx0XHRrZXk6IGl0ZW0udGl0bGUsXG5cdFx0XHRcdFx0Y29sb3I6IGl0ZW0uY29sb3IsXG5cdFx0XHRcdFx0dmFsdWVzOiBbXVxuXHRcdFx0XHR9O1xuXHRcdFx0XHRhbmd1bGFyLmZvckVhY2goJHNjb3BlLmNvdW50cnkuZXBpLCBmdW5jdGlvbihkYXRhKSB7XG5cdFx0XHRcdFx0Z3JhcGgudmFsdWVzLnB1c2goe1xuXHRcdFx0XHRcdFx0eDogZGF0YS55ZWFyLFxuXHRcdFx0XHRcdFx0eTogZGF0YVtpdGVtLmNvbHVtbl9uYW1lXVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9KTtcblx0XHRcdFx0Y2hhcnREYXRhLnB1c2goZ3JhcGgpO1xuXHRcdFx0fSk7XG5cdFx0XHQkc2NvcGUuY2hhcnQuZGF0YSA9IGNoYXJ0RGF0YTtcblx0XHR9XG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5kaXJlY3RpdmVzJykuZGlyZWN0aXZlKCdzdW5idXJzdCcsIGZ1bmN0aW9uICgpIHtcblx0XHR2YXIgZGVmYXVsdHMgPSBmdW5jdGlvbigpe1xuXHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdCBtb2RlOiAnc2l6ZSdcblx0XHRcdFx0fVxuXHRcdH07XG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlc3RyaWN0OiAnRScsXG5cdFx0XHQvL3RlbXBsYXRlVXJsOiAndmlld3MvZGlyZWN0aXZlcy9zdW5idXJzdC9zdW5idXJzdC5odG1sJyxcblx0XHRcdGNvbnRyb2xsZXI6ICdTdW5idXJzdEN0cmwnLFxuXHRcdFx0c2NvcGU6IHtcblx0XHRcdFx0ZGF0YTogJz0nXG5cdFx0XHR9LFxuXHRcdFx0bGluazogZnVuY3Rpb24gKCRzY29wZSwgZWxlbWVudCwgJGF0dHJzKSB7XG5cdFx0XHRcdHZhciBvcHRpb25zID0gYW5ndWxhci5leHRlbmQoZGVmYXVsdHMoKSwgJGF0dHJzKTtcblx0XHRcdFx0JHNjb3BlLnNldENoYXJ0KCk7XG5cdFx0XHRcdCRzY29wZS5jYWxjdWxhdGVHcmFwaCgpO1xuXHRcdFx0XHR2YXIgd2lkdGggPSA2MTAsXG5cdFx0XHRcdFx0aGVpZ2h0ID0gd2lkdGgsXG5cdFx0XHRcdFx0cmFkaXVzID0gKHdpZHRoKSAvIDIsXG5cdFx0XHRcdFx0eCA9IGQzLnNjYWxlLmxpbmVhcigpLnJhbmdlKFswLCAyICogTWF0aC5QSV0pLFxuXHRcdFx0XHRcdHkgPSBkMy5zY2FsZS5wb3coKS5leHBvbmVudCgxLjMpLmRvbWFpbihbMCwgMV0pLnJhbmdlKFswLCByYWRpdXNdKSxcblxuXHRcdFx0XHRcdHBhZGRpbmcgPSAwLFxuXHRcdFx0XHRcdGR1cmF0aW9uID0gMTAwMCxcblx0XHRcdFx0XHRjaXJjUGFkZGluZyA9IDEwO1xuXG5cdFx0XHRcdHZhciBkaXYgPSBkMy5zZWxlY3QoZWxlbWVudFswXSk7XG5cblxuXHRcdFx0XHR2YXIgdmlzID0gZGl2LmFwcGVuZChcInN2Z1wiKVxuXHRcdFx0XHRcdC5hdHRyKFwid2lkdGhcIiwgd2lkdGggKyBwYWRkaW5nICogMilcblx0XHRcdFx0XHQuYXR0cihcImhlaWdodFwiLCBoZWlnaHQgKyBwYWRkaW5nICogMilcblx0XHRcdFx0XHQuYXBwZW5kKFwiZ1wiKVxuXHRcdFx0XHRcdC5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiICsgW3JhZGl1cyArIHBhZGRpbmcsIHJhZGl1cyArIHBhZGRpbmddICsgXCIpXCIpO1xuXG5cdFx0XHRcdC8qXG5cdFx0XHRcdGRpdi5hcHBlbmQoXCJwXCIpXG5cdFx0XHRcdFx0XHQuYXR0cihcImlkXCIsIFwiaW50cm9cIilcblx0XHRcdFx0XHRcdC50ZXh0KFwiQ2xpY2sgdG8gem9vbSFcIik7XG5cdFx0XHRcdCovXG5cblx0XHRcdFx0dmFyIHBhcnRpdGlvbiA9IGQzLmxheW91dC5wYXJ0aXRpb24oKVxuXHRcdFx0XHRcdC5zb3J0KG51bGwpXG5cdFx0XHRcdFx0LnZhbHVlKGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gMTtcblx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHR2YXIgYXJjID0gZDMuc3ZnLmFyYygpXG5cdFx0XHRcdFx0LnN0YXJ0QW5nbGUoZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdHJldHVybiBNYXRoLm1heCgwLCBNYXRoLm1pbigyICogTWF0aC5QSSwgeChkLngpKSk7XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQuZW5kQW5nbGUoZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdHJldHVybiBNYXRoLm1heCgwLCBNYXRoLm1pbigyICogTWF0aC5QSSwgeChkLnggKyBkLmR4KSkpO1xuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0LmlubmVyUmFkaXVzKGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gTWF0aC5tYXgoMCwgZC55ID8geShkLnkpIDogZC55KTtcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC5vdXRlclJhZGl1cyhmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIE1hdGgubWF4KDAsIHkoZC55ICsgZC5keSkpO1xuXHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdHZhciBzcGVjaWFsMSA9IFwiV2FzdGV3YXRlciBUcmVhdG1lbnRcIixcblx0XHRcdFx0XHRzcGVjaWFsMiA9IFwiQWlyIFBvbGx1dGlvbiBQTTIuNSBFeGNlZWRhbmNlXCIsXG5cdFx0XHRcdFx0c3BlY2lhbDMgPSBcIkFncmljdWx0dXJhbCBTdWJzaWRpZXNcIixcblx0XHRcdFx0XHRzcGVjaWFsNCA9IFwiUGVzdGljaWRlIFJlZ3VsYXRpb25cIjtcblxuXG5cdFx0XHRcdHZhciBub2RlcyA9IHBhcnRpdGlvbi5ub2Rlcygkc2NvcGUuY2FsY3VsYXRlR3JhcGgoKSk7XG5cblx0XHRcdFx0dmFyIHBhdGggPSB2aXMuc2VsZWN0QWxsKFwicGF0aFwiKS5kYXRhKG5vZGVzKTtcblx0XHRcdFx0cGF0aC5lbnRlcigpLmFwcGVuZChcInBhdGhcIilcblx0XHRcdFx0XHQuYXR0cihcImlkXCIsIGZ1bmN0aW9uIChkLCBpKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gXCJwYXRoLVwiICsgaTtcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC5hdHRyKFwiZFwiLCBhcmMpXG5cdFx0XHRcdFx0LmF0dHIoXCJmaWxsLXJ1bGVcIiwgXCJldmVub2RkXCIpXG5cdFx0XHRcdFx0LmF0dHIoXCJjbGFzc1wiLCBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGQuZGVwdGggPyBcImJyYW5jaFwiIDogXCJyb290XCI7XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQuc3R5bGUoXCJmaWxsXCIsIHNldENvbG9yKVxuXHRcdFx0XHRcdC5vbihcImNsaWNrXCIsIGNsaWNrKTtcblxuXHRcdFx0XHR2YXIgdGV4dCA9IHZpcy5zZWxlY3RBbGwoXCJ0ZXh0XCIpLmRhdGEobm9kZXMpO1xuXHRcdFx0XHR2YXIgdGV4dEVudGVyID0gdGV4dC5lbnRlcigpLmFwcGVuZChcInRleHRcIilcblx0XHRcdFx0XHQuc3R5bGUoXCJmaWxsLW9wYWNpdHlcIiwgMSlcblx0XHRcdFx0XHQuYXR0cihcInRleHQtYW5jaG9yXCIsIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRpZiAoZC5kZXB0aClcblx0XHRcdFx0XHRcdFx0cmV0dXJuIFwibWlkZGxlXCI7XG5cdFx0XHRcdFx0XHQvL34gcmV0dXJuIHgoZC54ICsgZC5keCAvIDIpID4gTWF0aC5QSSA/IFwiZW5kXCIgOiBcInN0YXJ0XCI7XG5cdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdHJldHVybiBcIm1pZGRsZVwiO1xuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0LmF0dHIoXCJpZFwiLCBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIFwiZGVwdGhcIiArIGQuZGVwdGg7XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQuYXR0cihcImNsYXNzXCIsIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gXCJzZWN0b3JcIlxuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0LmF0dHIoXCJkeVwiLCBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGQuZGVwdGggPyBcIi4yZW1cIiA6IFwiMC4zNWVtXCI7XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQuYXR0cihcInRyYW5zZm9ybVwiLCBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0dmFyIG11bHRpbGluZSA9IChkLm5hbWUgfHwgXCJcIikuc3BsaXQoXCIgXCIpLmxlbmd0aCA+IDIsXG5cdFx0XHRcdFx0XHRcdGFuZ2xlQWxpZ24gPSAoZC54ID4gMC41ID8gMiA6IC0yKSxcblx0XHRcdFx0XHRcdFx0YW5nbGUgPSB4KGQueCArIGQuZHggLyAyKSAqIDE4MCAvIE1hdGguUEkgLSA5MCArIChtdWx0aWxpbmUgPyBhbmdsZUFsaWduIDogMCksXG5cdFx0XHRcdFx0XHRcdHJvdGF0ZSA9IGFuZ2xlICsgKG11bHRpbGluZSA/IC0uNSA6IDApLFxuXHRcdFx0XHRcdFx0XHR0cmFuc2wgPSAoeShkLnkpICsgY2lyY1BhZGRpbmcpICsgMzUsXG5cdFx0XHRcdFx0XHRcdHNlY0FuZ2xlID0gKGFuZ2xlID4gOTAgPyAtMTgwIDogMCk7XG5cdFx0XHRcdFx0XHRpZiAoZC5uYW1lID09IHNwZWNpYWwzIHx8IGQubmFtZSA9PSBzcGVjaWFsNCkgcm90YXRlICs9IDE7XG5cdFx0XHRcdFx0XHRpZiAoZC5kZXB0aCA9PSAwKSB7XG5cdFx0XHRcdFx0XHRcdHRyYW5zbCA9IC0yLjUwO1xuXHRcdFx0XHRcdFx0XHRyb3RhdGUgPSAwO1xuXHRcdFx0XHRcdFx0XHRzZWNBbmdsZSA9IDA7XG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKGQuZGVwdGggPT0gMSkgdHJhbnNsICs9IC05O1xuXHRcdFx0XHRcdFx0ZWxzZSBpZiAoZC5kZXB0aCA9PSAyKSB0cmFuc2wgKz0gLTU7XG5cdFx0XHRcdFx0XHRlbHNlIGlmIChkLmRlcHRoID09IDMpIHRyYW5zbCArPSA0O1xuXHRcdFx0XHRcdFx0cmV0dXJuIFwicm90YXRlKFwiICsgcm90YXRlICsgXCIpdHJhbnNsYXRlKFwiICsgdHJhbnNsICsgXCIpcm90YXRlKFwiICsgc2VjQW5nbGUgKyBcIilcIjtcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC5vbihcImNsaWNrXCIsIGNsaWNrKTtcblxuXHRcdFx0XHR0ZXh0RW50ZXIuYXBwZW5kKFwidHNwYW5cIilcblx0XHRcdFx0XHQuYXR0cihcInhcIiwgMClcblx0XHRcdFx0XHQudGV4dChmdW5jdGlvbiAoZCkge1xuXG5cdFx0XHRcdFx0XHRpZiAoZC5kZXB0aCA9PSAzICYmIGQubmFtZSAhPSBzcGVjaWFsMSAmJiBkLm5hbWUgIT0gc3BlY2lhbDIgJiYgZC5uYW1lICE9IHNwZWNpYWwzICYmIGQubmFtZSAhPSBzcGVjaWFsNClcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGQubmFtZS5zcGxpdChcIiBcIilbMF0gKyBcIiBcIiArIChkLm5hbWUuc3BsaXQoXCIgXCIpWzFdIHx8IFwiXCIpO1xuXHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gZC5uYW1lLnNwbGl0KFwiIFwiKVswXTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0dGV4dEVudGVyLmFwcGVuZChcInRzcGFuXCIpXG5cdFx0XHRcdFx0LmF0dHIoXCJ4XCIsIDApXG5cdFx0XHRcdFx0LmF0dHIoXCJkeVwiLCBcIjFlbVwiKVxuXHRcdFx0XHRcdC50ZXh0KGZ1bmN0aW9uIChkKSB7XG5cblx0XHRcdFx0XHRcdGlmIChkLmRlcHRoID09IDMgJiYgZC5uYW1lICE9IHNwZWNpYWwxICYmIGQubmFtZSAhPSBzcGVjaWFsMiAmJiBkLm5hbWUgIT0gc3BlY2lhbDMgJiYgZC5uYW1lICE9IHNwZWNpYWw0KVxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gKGQubmFtZS5zcGxpdChcIiBcIilbMl0gfHwgXCJcIikgKyBcIiBcIiArIChkLm5hbWUuc3BsaXQoXCIgXCIpWzNdIHx8IFwiXCIpO1xuXHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gKGQubmFtZS5zcGxpdChcIiBcIilbMV0gfHwgXCJcIikgKyBcIiBcIiArIChkLm5hbWUuc3BsaXQoXCIgXCIpWzJdIHx8IFwiXCIpO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR0ZXh0RW50ZXIuYXBwZW5kKFwidHNwYW5cIilcblx0XHRcdFx0XHQuYXR0cihcInhcIiwgMClcblx0XHRcdFx0XHQuYXR0cihcImR5XCIsIFwiMWVtXCIpXG5cdFx0XHRcdFx0LnRleHQoZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdGlmIChkLmRlcHRoID09IDMgJiYgZC5uYW1lICE9IHNwZWNpYWwxICYmIGQubmFtZSAhPSBzcGVjaWFsMiAmJiBkLm5hbWUgIT0gc3BlY2lhbDMgJiYgZC5uYW1lICE9IHNwZWNpYWw0KVxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gKGQubmFtZS5zcGxpdChcIiBcIilbNF0gfHwgXCJcIikgKyBcIiBcIiArIChkLm5hbWUuc3BsaXQoXCIgXCIpWzVdIHx8IFwiXCIpO1xuXHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gKGQubmFtZS5zcGxpdChcIiBcIilbM10gfHwgXCJcIikgKyBcIiBcIiArIChkLm5hbWUuc3BsaXQoXCIgXCIpWzRdIHx8IFwiXCIpOztcblx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRmdW5jdGlvbiBjbGljayhkKSB7XG5cdFx0XHRcdFx0Ly8gQ29udHJvbCBhcmMgdHJhbnNpdGlvblxuXHRcdFx0XHRcdHBhdGgudHJhbnNpdGlvbigpXG5cdFx0XHRcdFx0XHQuZHVyYXRpb24oZHVyYXRpb24pXG5cdFx0XHRcdFx0XHQuYXR0clR3ZWVuKFwiZFwiLCBhcmNUd2VlbihkKSk7XG5cblx0XHRcdFx0XHQvLyBTb21ld2hhdCBvZiBhIGhhY2sgYXMgd2UgcmVseSBvbiBhcmNUd2VlbiB1cGRhdGluZyB0aGUgc2NhbGVzLlxuXHRcdFx0XHRcdC8vIENvbnRyb2wgdGhlIHRleHQgdHJhbnNpdGlvblxuXHRcdFx0XHRcdHRleHQuc3R5bGUoXCJ2aXNpYmlsaXR5XCIsIGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBpc1BhcmVudE9mKGQsIGUpID8gbnVsbCA6IGQzLnNlbGVjdCh0aGlzKS5zdHlsZShcInZpc2liaWxpdHlcIik7XG5cdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0LnRyYW5zaXRpb24oKVxuXHRcdFx0XHRcdFx0LmR1cmF0aW9uKGR1cmF0aW9uKVxuXHRcdFx0XHRcdFx0LmF0dHJUd2VlbihcInRleHQtYW5jaG9yXCIsIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRcdFx0aWYgKGQuZGVwdGgpXG5cdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gXCJtaWRkbGVcIjtcblx0XHRcdFx0XHRcdFx0XHQvL34gcmV0dXJuIHgoZC54ICsgZC5keCAvIDIpID4gTWF0aC5QSSA/IFwiZW5kXCIgOiBcInN0YXJ0XCI7XG5cdFx0XHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIFwibWlkZGxlXCI7XG5cdFx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0LmF0dHJUd2VlbihcInRyYW5zZm9ybVwiLCBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0XHR2YXIgbXVsdGlsaW5lID0gKGQubmFtZSB8fCBcIlwiKS5zcGxpdChcIiBcIikubGVuZ3RoID4gMjtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdFx0XHR2YXIgbXVsdGlsaW5lID0gKGQubmFtZSB8fCBcIlwiKS5zcGxpdChcIiBcIikubGVuZ3RoID4gMixcblx0XHRcdFx0XHRcdFx0XHRcdGFuZ2xlQWxpZ24gPSAoZC54ID4gMC41ID8gMiA6IC0yKSxcblx0XHRcdFx0XHRcdFx0XHRcdGFuZ2xlID0geChkLnggKyBkLmR4IC8gMikgKiAxODAgLyBNYXRoLlBJIC0gOTAgKyAobXVsdGlsaW5lID8gYW5nbGVBbGlnbiA6IDApLFxuXHRcdFx0XHRcdFx0XHRcdFx0cm90YXRlID0gYW5nbGUgKyAobXVsdGlsaW5lID8gLS41IDogMCksXG5cdFx0XHRcdFx0XHRcdFx0XHR0cmFuc2wgPSAoeShkLnkpICsgY2lyY1BhZGRpbmcpICsgMzUsXG5cdFx0XHRcdFx0XHRcdFx0XHRzZWNBbmdsZSA9IChhbmdsZSA+IDkwID8gLTE4MCA6IDApO1xuXHRcdFx0XHRcdFx0XHRcdGlmIChkLm5hbWUgPT0gc3BlY2lhbDMgfHwgZC5uYW1lID09IHNwZWNpYWw0KSByb3RhdGUgKz0gMTtcblx0XHRcdFx0XHRcdFx0XHRpZiAoZC5kZXB0aCA9PSAwKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHR0cmFuc2wgPSAtMi41MDtcblx0XHRcdFx0XHRcdFx0XHRcdHJvdGF0ZSA9IDA7XG5cdFx0XHRcdFx0XHRcdFx0XHRzZWNBbmdsZSA9IDA7XG5cdFx0XHRcdFx0XHRcdFx0fSBlbHNlIGlmIChkLmRlcHRoID09IDEpIHRyYW5zbCArPSAtOTtcblx0XHRcdFx0XHRcdFx0XHRlbHNlIGlmIChkLmRlcHRoID09IDIpIHRyYW5zbCArPSAtNTtcblx0XHRcdFx0XHRcdFx0XHRlbHNlIGlmIChkLmRlcHRoID09IDMpIHRyYW5zbCArPSA0O1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBcInJvdGF0ZShcIiArIHJvdGF0ZSArIFwiKXRyYW5zbGF0ZShcIiArIHRyYW5zbCArIFwiKXJvdGF0ZShcIiArIHNlY0FuZ2xlICsgXCIpXCI7XG5cdFx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0LnN0eWxlKFwiZmlsbC1vcGFjaXR5XCIsIGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBpc1BhcmVudE9mKGQsIGUpID8gMSA6IDFlLTY7XG5cdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0LmVhY2goXCJlbmRcIiwgZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0XHRcdFx0ZDMuc2VsZWN0KHRoaXMpLnN0eWxlKFwidmlzaWJpbGl0eVwiLCBpc1BhcmVudE9mKGQsIGUpID8gbnVsbCA6IFwiaGlkZGVuXCIpO1xuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblxuXG5cdFx0XHRcdGZ1bmN0aW9uIGlzUGFyZW50T2YocCwgYykge1xuXHRcdFx0XHRcdGlmIChwID09PSBjKSByZXR1cm4gdHJ1ZTtcblx0XHRcdFx0XHRpZiAocC5jaGlsZHJlbikge1xuXHRcdFx0XHRcdFx0cmV0dXJuIHAuY2hpbGRyZW4uc29tZShmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gaXNQYXJlbnRPZihkLCBjKTtcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRmdW5jdGlvbiBzZXRDb2xvcihkKSB7XG5cblx0XHRcdFx0XHQvL3JldHVybiA7XG5cdFx0XHRcdFx0aWYgKGQuY29sb3IpXG5cdFx0XHRcdFx0XHRyZXR1cm4gZC5jb2xvcjtcblx0XHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRcdHJldHVybiAnI2NjYyc7XG5cdFx0XHRcdFx0XHQvKnZhciB0aW50RGVjYXkgPSAwLjIwO1xuXHRcdFx0XHRcdFx0Ly8gRmluZCBjaGlsZCBudW1iZXJcblx0XHRcdFx0XHRcdHZhciB4ID0gMDtcblx0XHRcdFx0XHRcdHdoaWxlIChkLnBhcmVudC5jaGlsZHJlblt4XSAhPSBkKVxuXHRcdFx0XHRcdFx0XHR4Kys7XG5cdFx0XHRcdFx0XHR2YXIgdGludENoYW5nZSA9ICh0aW50RGVjYXkgKiAoeCArIDEpKS50b1N0cmluZygpO1xuXHRcdFx0XHRcdFx0cmV0dXJuIHB1c2hlci5jb2xvcihkLnBhcmVudC5jb2xvcikudGludCh0aW50Q2hhbmdlKS5odG1sKCdoZXg2Jyk7Ki9cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBJbnRlcnBvbGF0ZSB0aGUgc2NhbGVzIVxuXHRcdFx0XHRmdW5jdGlvbiBhcmNUd2VlbihkKSB7XG5cdFx0XHRcdFx0dmFyIG15ID0gbWF4WShkKSxcblx0XHRcdFx0XHRcdHhkID0gZDMuaW50ZXJwb2xhdGUoeC5kb21haW4oKSwgW2QueCwgZC54ICsgZC5keCAtIDAuMDAwOV0pLFxuXHRcdFx0XHRcdFx0eWQgPSBkMy5pbnRlcnBvbGF0ZSh5LmRvbWFpbigpLCBbZC55LCBteV0pLFxuXHRcdFx0XHRcdFx0eXIgPSBkMy5pbnRlcnBvbGF0ZSh5LnJhbmdlKCksIFtkLnkgPyAyMCA6IDAsIHJhZGl1c10pO1xuXG5cdFx0XHRcdFx0cmV0dXJuIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZnVuY3Rpb24gKHQpIHtcblx0XHRcdFx0XHRcdFx0eC5kb21haW4oeGQodCkpO1xuXHRcdFx0XHRcdFx0XHR5LmRvbWFpbih5ZCh0KSkucmFuZ2UoeXIodCkpO1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gYXJjKGQpO1xuXHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHR9O1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0ZnVuY3Rpb24gbWF4WShkKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGQuY2hpbGRyZW4gPyBNYXRoLm1heC5hcHBseShNYXRoLCBkLmNoaWxkcmVuLm1hcChtYXhZKSkgOiBkLnkgKyBkLmR5O1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9KTtcbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignU3VuYnVyc3RDdHJsJywgZnVuY3Rpb24gKCRzY29wZSkge1xuXG5cdFx0JHNjb3BlLnNldENoYXJ0ID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0JHNjb3BlLmNoYXJ0ID0ge1xuXHRcdFx0XHRvcHRpb25zOiB7XG5cdFx0XHRcdFx0Y2hhcnQ6IHtcblx0XHRcdFx0XHRcdHR5cGU6ICdzdW5idXJzdCcsXG5cdFx0XHRcdFx0XHRoZWlnaHQ6IDcwMCxcblx0XHRcdFx0XHRcdFwic3VuYnVyc3RcIjoge1xuXHRcdFx0XHRcdFx0XHRcImRpc3BhdGNoXCI6IHt9LFxuXHRcdFx0XHRcdFx0XHRcIndpZHRoXCI6IG51bGwsXG5cdFx0XHRcdFx0XHRcdFwiaGVpZ2h0XCI6IG51bGwsXG5cdFx0XHRcdFx0XHRcdFwibW9kZVwiOiBcInNpemVcIixcblx0XHRcdFx0XHRcdFx0XCJpZFwiOiAyMDg4LFxuXHRcdFx0XHRcdFx0XHRcImR1cmF0aW9uXCI6IDUwMCxcblx0XHRcdFx0XHRcdFx0XCJtYXJnaW5cIjoge1xuXHRcdFx0XHRcdFx0XHRcdFwidG9wXCI6IDAsXG5cdFx0XHRcdFx0XHRcdFx0XCJyaWdodFwiOiAwLFxuXHRcdFx0XHRcdFx0XHRcdFwiYm90dG9tXCI6IDAsXG5cdFx0XHRcdFx0XHRcdFx0XCJsZWZ0XCI6IDBcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdFwidG9vbHRpcFwiOiB7XG5cdFx0XHRcdFx0XHRcdFwiZHVyYXRpb25cIjogMCxcblx0XHRcdFx0XHRcdFx0XCJncmF2aXR5XCI6IFwid1wiLFxuXHRcdFx0XHRcdFx0XHRcImRpc3RhbmNlXCI6IDI1LFxuXHRcdFx0XHRcdFx0XHRcInNuYXBEaXN0YW5jZVwiOiAwLFxuXHRcdFx0XHRcdFx0XHRcImNsYXNzZXNcIjogbnVsbCxcblx0XHRcdFx0XHRcdFx0XCJjaGFydENvbnRhaW5lclwiOiBudWxsLFxuXHRcdFx0XHRcdFx0XHRcImZpeGVkVG9wXCI6IG51bGwsXG5cdFx0XHRcdFx0XHRcdFwiZW5hYmxlZFwiOiB0cnVlLFxuXHRcdFx0XHRcdFx0XHRcImhpZGVEZWxheVwiOiA0MDAsXG5cdFx0XHRcdFx0XHRcdFwiaGVhZGVyRW5hYmxlZFwiOiBmYWxzZSxcblxuXHRcdFx0XHRcdFx0XHRcIm9mZnNldFwiOiB7XG5cdFx0XHRcdFx0XHRcdFx0XCJsZWZ0XCI6IDAsXG5cdFx0XHRcdFx0XHRcdFx0XCJ0b3BcIjogMFxuXHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHRcImhpZGRlblwiOiB0cnVlLFxuXHRcdFx0XHRcdFx0XHRcImRhdGFcIjogbnVsbCxcblx0XHRcdFx0XHRcdFx0XCJ0b29sdGlwRWxlbVwiOiBudWxsLFxuXHRcdFx0XHRcdFx0XHRcImlkXCI6IFwibnZ0b29sdGlwLTk5MzQ3XCJcblx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRkYXRhOiBbXVxuXHRcdFx0fTtcblx0XHRcdHJldHVybiAkc2NvcGUuY2hhcnQ7XG5cdFx0fVxuXHRcdHZhciBidWlsZFRyZWUgPSBmdW5jdGlvbiAoZGF0YSkge1xuXHRcdFx0dmFyIGNoaWxkcmVuID0gW107XG5cdFx0XHRhbmd1bGFyLmZvckVhY2goZGF0YSwgZnVuY3Rpb24gKGl0ZW0pIHtcblx0XHRcdFx0dmFyIGNoaWxkID0ge1xuXHRcdFx0XHRcdCduYW1lJzogaXRlbS50aXRsZSxcblx0XHRcdFx0XHQnc2l6ZSc6IGl0ZW0uc2l6ZSxcblx0XHRcdFx0XHQnY29sb3InOiBpdGVtLmNvbG9yLFxuXHRcdFx0XHRcdCdjaGlsZHJlbic6IGJ1aWxkVHJlZShpdGVtLmNoaWxkcmVuKVxuXHRcdFx0XHR9O1xuXHRcdFx0XHRpZihpdGVtLmNvbG9yKXtcblx0XHRcdFx0XHRjaGlsZC5jb2xvciA9IGl0ZW0uY29sb3Jcblx0XHRcdFx0fVxuXHRcdFx0XHRpZihpdGVtLnNpemUpe1xuXHRcdFx0XHRcdGNoaWxkLnNpemUgPSBpdGVtLnNpemVcblx0XHRcdFx0fVxuXHRcdFx0XHRjaGlsZHJlbi5wdXNoKGNoaWxkKTtcblx0XHRcdH0pO1xuXHRcdFx0cmV0dXJuIGNoaWxkcmVuO1xuXHRcdH07XG5cdFx0JHNjb3BlLmNhbGN1bGF0ZUdyYXBoID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0dmFyIGNoYXJ0RGF0YSA9IHtcblx0XHRcdFx0XCJuYW1lXCI6ICRzY29wZS5kYXRhLnRpdGxlLFxuXHRcdFx0XHRcImNvbG9yXCI6ICRzY29wZS5kYXRhLnN0eWxlLmJhc2VfY29sb3IgfHwgJyMwMDAnLFxuXHRcdFx0XHRcImNoaWxkcmVuXCI6IGJ1aWxkVHJlZSgkc2NvcGUuZGF0YS5jaGlsZHJlbiksXG5cdFx0XHRcdFwic2l6ZVwiOiAxXG5cdFx0XHR9O1xuXHRcdFx0JHNjb3BlLmNoYXJ0LmRhdGEgPSBjaGFydERhdGE7XG5cdFx0XHRyZXR1cm4gY2hhcnREYXRhO1xuXHRcdH07XG5cdFx0JHNjb3BlLiR3YXRjaCgnZGF0YScsIGZ1bmN0aW9uIChuLCBvKSB7XG5cdFx0XHRpZiAoIW4pIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdFx0JHNjb3BlLmNhbGN1bGF0ZUdyYXBoKCk7XG5cdFx0fSlcblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5kaXJlY3RpdmVzJykuZGlyZWN0aXZlKCAndHJlZXZpZXcnLCBmdW5jdGlvbihSZWN1cnNpb25IZWxwZXIpIHtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRyZXN0cmljdDogJ0UnLFxuXHRcdFx0dGVtcGxhdGVVcmw6ICd2aWV3cy9kaXJlY3RpdmVzL3RyZWV2aWV3L3RyZWV2aWV3Lmh0bWwnLFxuXHRcdFx0Y29udHJvbGxlcjogJ1RyZWV2aWV3Q3RybCcsXG5cdFx0XHRjb250cm9sbGVyQXM6ICd2bScsXG5cdFx0XHRzY29wZTp7fSxcblx0XHRcdGJpbmRUb0NvbnRyb2xsZXI6IHtcblx0XHRcdFx0aXRlbXM6ICc9Jyxcblx0XHRcdFx0aXRlbTogJz0nLFxuXHRcdFx0XHRvcHRpb25zOic9J1xuXHRcdFx0fSxcblx0XHRcdHJlcGxhY2U6dHJ1ZSxcblx0XHRcdGNvbXBpbGU6IGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAgICAgICAgICAgIHJldHVybiBSZWN1cnNpb25IZWxwZXIuY29tcGlsZShlbGVtZW50LCBmdW5jdGlvbihzY29wZSwgaUVsZW1lbnQsIGlBdHRycywgY29udHJvbGxlciwgdHJhbnNjbHVkZUZuKXtcbiAgICAgICAgICAgICAgICAvLyBEZWZpbmUgeW91ciBub3JtYWwgbGluayBmdW5jdGlvbiBoZXJlLlxuICAgICAgICAgICAgICAgIC8vIEFsdGVybmF0aXZlOiBpbnN0ZWFkIG9mIHBhc3NpbmcgYSBmdW5jdGlvbixcbiAgICAgICAgICAgICAgICAvLyB5b3UgY2FuIGFsc28gcGFzcyBhbiBvYmplY3Qgd2l0aFxuICAgICAgICAgICAgICAgIC8vIGEgJ3ByZSctIGFuZCAncG9zdCctbGluayBmdW5jdGlvbi5cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cdFx0fTtcblxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ1RyZWV2aWV3Q3RybCcsIGZ1bmN0aW9uKCRmaWx0ZXIpIHtcblx0XHQvL1xuXHRcdHZhciB2bSA9IHRoaXM7XG5cdFx0dm0uc2VsZWN0ZWRJdGVtID0gc2VsZWN0ZWRJdGVtO1xuXHRcdHZtLmNoaWxkU2VsZWN0ZWQgPSBjaGlsZFNlbGVjdGVkO1xuXHRcdHZtLnRvZ2dsZUl0ZW0gPSB0b2dnbGVJdGVtO1xuXHRcdHZtLm9uRHJhZ092ZXIgPSBvbkRyYWdPdmVyO1xuXHRcdHZtLm9uRHJvcENvbXBsZXRlID0gb25Ecm9wQ29tcGxldGU7XG5cdFx0dm0ub25Nb3ZlZENvbXBsZXRlID0gb25Nb3ZlZENvbXBsZXRlO1xuXHRcdHZtLmFkZENoaWxkcmVuID0gYWRkQ2hpbGRyZW47XG5cblx0XHRmdW5jdGlvbiBvbkRyYWdPdmVyKGV2ZW50LCBpbmRleCwgZXh0ZXJuYWwsIHR5cGUpIHtcblx0XHRcdGNvbnNvbGUubG9nKGV2ZW50LCBpbmRleCwgZXh0ZXJuYWwsIHR5cGUpO1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gb25Ecm9wQ29tcGxldGUoZXZlbnQsIGluZGV4LCBpdGVtLCBleHRlcm5hbCkge1xuXHRcdFx0Y29uc29sZS5sb2coZXZlbnQsIGluZGV4LCBpdGVtLCBleHRlcm5hbCk7XG5cdFx0XHRyZXR1cm4gaXRlbTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBvbk1vdmVkQ29tcGxldGUoaW5kZXgsIGRhdGEsIGV2dCkge1xuXG5cdFx0XHRyZXR1cm4gdm0uaXRlbXMuc3BsaWNlKGluZGV4LCAxKTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBhZGRDaGlsZHJlbihpdGVtKSB7XG5cblx0XHRcdGl0ZW0uY2hpbGRyZW4gPSBbe1xuXHRcdFx0XHRpZDogMCxcblx0XHRcdFx0dGl0bGU6ICdEcm9wIEl0ZW1zIGhlcmUuLi4nXG5cdFx0XHR9XTtcblx0XHRcdGl0ZW0uZXhwYW5kZWQgPSB0cnVlO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIHNlbGVjdGVkSXRlbShpdGVtKSB7XG5cdFx0XHRpZiAodHlwZW9mIHZtLml0ZW0gPT09IFwidW5kZWZpbmVkXCIpIHJldHVybiBmYWxzZTtcblx0XHRcdHZhciBmb3VuZCA9IGZhbHNlO1xuXHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLml0ZW1bdm0ub3B0aW9ucy50eXBlXSwgZnVuY3Rpb24oZW50cnksIGtleSkge1xuXHRcdFx0XHRpZiAoZW50cnkuaWQgPT0gaXRlbS5pZCkge1xuXHRcdFx0XHRcdGZvdW5kID0gdHJ1ZTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0XHRyZXR1cm4gZm91bmQ7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gY2hpbGRTZWxlY3RlZChjaGlsZHJlbikge1xuXHRcdFx0dmFyIGZvdW5kID0gZmFsc2U7XG5cdFx0XHRhbmd1bGFyLmZvckVhY2goJGZpbHRlcignZmxhdHRlbicpKGNoaWxkcmVuKSwgZnVuY3Rpb24oY2hpbGQpIHtcblx0XHRcdFx0aWYgKHNlbGVjdGVkSXRlbShjaGlsZCkpIHtcblx0XHRcdFx0XHRmb3VuZCA9IHRydWU7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdFx0cmV0dXJuIGZvdW5kO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIHRvZ2dsZUl0ZW0oaXRlbSkge1xuXHRcdFx0aWYgKHR5cGVvZiB2bS5pdGVtW3ZtLm9wdGlvbnMudHlwZV0gPT09IFwidW5kZWZpbmVkXCIpIHZtLml0ZW1bdm0ub3B0aW9ucy50eXBlXSA9IFtdO1xuXHRcdFx0dmFyIGZvdW5kID0gZmFsc2UsXG5cdFx0XHRcdGluZGV4ID0gLTE7XG5cdFx0XHRhbmd1bGFyLmZvckVhY2godm0uaXRlbVt2bS5vcHRpb25zLnR5cGVdLCBmdW5jdGlvbihlbnRyeSwgaSkge1xuXHRcdFx0XHRpZiAoZW50cnkuaWQgPT0gaXRlbS5pZCkge1xuXHRcdFx0XHRcdGZvdW5kID0gdHJ1ZTtcblx0XHRcdFx0XHRpbmRleCA9IGk7XG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cdFx0XHRpbmRleCA9PT0gLTEgPyB2bS5pdGVtW3ZtLm9wdGlvbnMudHlwZV0ucHVzaChpdGVtKSA6IHZtLml0ZW1bdm0ub3B0aW9ucy50eXBlXS5zcGxpY2UoaW5kZXgsIDEpO1xuXHRcdH1cblx0fSk7XG5cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmRpcmVjdGl2ZXMnKS5kaXJlY3RpdmUoJ3dlaWdodCcsIGZ1bmN0aW9uKCkge1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlc3RyaWN0OiAnRUEnLFxuXHRcdFx0dGVtcGxhdGVVcmw6ICd2aWV3cy9kaXJlY3RpdmVzL3dlaWdodC93ZWlnaHQuaHRtbCcsXG5cdFx0XHRjb250cm9sbGVyOiAnV2VpZ2h0Q3RybCcsXG5cdFx0XHRjb250cm9sbGVyQXM6ICd2bScsXG5cdFx0XHRzY29wZToge30sXG5cdFx0XHRiaW5kVG9Db250cm9sbGVyOiB7XG5cdFx0XHRcdGl0ZW1zOiAnPScsXG5cdFx0XHRcdGl0ZW06ICc9Jyxcblx0XHRcdFx0b3B0aW9uczogJz0nXG5cdFx0XHR9LFxuXHRcdFx0cmVwbGFjZTogdHJ1ZSxcblx0XHRcdGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuXHRcdFx0XHQvL1xuXHRcdFx0fVxuXHRcdH07XG5cblx0fSk7XG5cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignV2VpZ2h0Q3RybCcsIGZ1bmN0aW9uKCRzY29wZSkge1xuXHRcdC8vXG5cdFx0dmFyIHZtID0gdGhpcztcblx0XHR2bS5yYWlzZVdlaWdodCA9IHJhaXNlV2VpZ2h0O1xuXHRcdHZtLmxvd2VyV2VpZ2h0ID0gbG93ZXJXZWlnaHQ7XG5cblx0XHRhY3RpdmF0ZSgpO1xuXG5cdFx0ZnVuY3Rpb24gYWN0aXZhdGUoKSB7XG5cdFx0XHRjYWxjU3RhcnQoKTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBjYWxjU3RhcnQoKSB7XG5cdFx0XHRpZiAodHlwZW9mIHZtLml0ZW0ud2VpZ2h0ID09IFwidW5kZWZpbmVkXCIpIHtcblx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLml0ZW1zLCBmdW5jdGlvbihlbnRyeSkge1xuXHRcdFx0XHRcdGVudHJ5LndlaWdodCA9IDEwMCAvIHZtLml0ZW1zLmxlbmd0aDtcblx0XHRcdFx0fSlcblx0XHRcdH1cblx0XHR9XG5cblx0XHRmdW5jdGlvbiBjYWxjVmFsdWVzKCkge1xuXHRcdFx0dmFyIGZpeGVkID0gdm0uaXRlbS53ZWlnaHQ7XG5cdFx0XHR2YXIgcmVzdCA9ICgxMDAgLSBmaXhlZCkgLyAodm0uaXRlbXMubGVuZ3RoIC0gMSk7XG5cdFx0XHRhbmd1bGFyLmZvckVhY2godm0uaXRlbXMsIGZ1bmN0aW9uKGVudHJ5KSB7XG5cdFx0XHRcdGlmIChlbnRyeSAhPT0gdm0uaXRlbSkge1xuXHRcdFx0XHRcdGVudHJ5LndlaWdodCA9IHJlc3Q7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdFx0cmV0dXJuIHJlc3Q7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gcmFpc2VXZWlnaHQoKSB7XG5cdFx0XHRpZiAodm0uaXRlbS53ZWlnaHQgJSA1ICE9IDApIHtcblx0XHRcdFx0dm0uaXRlbS53ZWlnaHQgPSA1ICogTWF0aC5yb3VuZCh2bS5pdGVtLndlaWdodCAvIDUpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dm0uaXRlbS53ZWlnaHQgKz0gNTtcblx0XHRcdH1cblx0XHRcdGNhbGNWYWx1ZXMoKTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBsb3dlcldlaWdodCgpIHtcblx0XHRcdGlmICh2bS5pdGVtLndlaWdodCAlIDUgIT0gMCkge1xuXHRcdFx0XHR2bS5pdGVtLndlaWdodCA9IDUgKiBNYXRoLnJvdW5kKHZtLml0ZW0ud2VpZ2h0IC8gNSkgLSA1O1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dm0uaXRlbS53ZWlnaHQgLT0gNTtcblx0XHRcdH1cblx0XHRcdGNhbGNWYWx1ZXMoKTtcblx0XHR9XG5cblxuXHR9KTtcblxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignTWFwQ3RybCcsIGZ1bmN0aW9uIChsZWFmbGV0RGF0YSwgVmVjdG9ybGF5ZXJTZXJ2aWNlKSB7XG5cdFx0Ly9cblx0XHR2YXIgdm0gPSB0aGlzO1xuXHRcdHZhciBhcGlLZXkgPSBWZWN0b3JsYXllclNlcnZpY2Uua2V5cy5tYXBib3g7XG5cblx0XHR2bS5kZWZhdWx0cyA9IHtcblx0XHRcdC8vc2Nyb2xsV2hlZWxab29tOiBmYWxzZSxcblx0XHRcdG1pblpvb206MlxuXHRcdH07XG5cdFx0dm0uY2VudGVyID0ge1xuXHRcdFx0bGF0OiAwLFxuXHRcdFx0bG5nOiAwLFxuXHRcdFx0em9vbTogM1xuXHRcdH07XG5cdFx0dm0ubGF5ZXJzID0ge1xuXHRcdFx0YmFzZWxheWVyczoge1xuXHRcdFx0XHR4eXo6IHtcblx0XHRcdFx0XHRuYW1lOiAnTWFwQm94IE91dGRvb3JzIE1vZCcsXG5cdFx0XHRcdFx0dXJsOiAnaHR0cHM6Ly97c30udGlsZXMubWFwYm94LmNvbS92NC92YWxkZXJyYW1hLmQ4NjExNGI2L3t6fS97eH0ve3l9LnBuZz9hY2Nlc3NfdG9rZW49JyArIGFwaUtleSxcblx0XHRcdFx0XHR0eXBlOiAneHl6Jyxcblx0XHRcdFx0XHRsYXllck9wdGlvbnM6e1xuXHRcdFx0XHRcdFx0XHRub1dyYXA6IHRydWUsXG5cdFx0XHRcdFx0XHRcdGNvbnRpbnVvdXNXb3JsZDogZmFsc2Vcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH07XG5cdFx0dm0ubWF4Ym91bmRzID0ge1xuXHRcdFx0c291dGhXZXN0OiB7XG5cdFx0XHRcdGxhdDogOTAsXG5cdFx0XHRcdGxuZzogMTgwXG5cdFx0XHR9LFxuXHRcdFx0bm9ydGhFYXN0OiB7XG5cdFx0XHRcdGxhdDogLTkwLFxuXHRcdFx0XHRsbmc6IC0xODBcblx0XHRcdH1cblx0XHR9O1xuXHRcdGxlYWZsZXREYXRhLmdldE1hcCgnbWFwJykudGhlbihmdW5jdGlvbiAobWFwKSB7XG5cdFx0XHR2YXIgdXJsID0gJ2h0dHA6Ly92MjIwMTUwNTI4MzU4MjUzNTgueW91cnZzZXJ2ZXIubmV0OjMwMDEvc2VydmljZXMvcG9zdGdpcy8nICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldE5hbWUoKSArICcvZ2VvbS92ZWN0b3ItdGlsZXMve3p9L3t4fS97eX0ucGJmP2ZpZWxkcz0nICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLmZpZWxkcygpOyAvL1xuXHRcdFx0dmFyIGxheWVyID0gbmV3IEwuVGlsZUxheWVyLk1WVFNvdXJjZSh7XG5cdFx0XHRcdHVybDogdXJsLFxuXHRcdFx0XHRkZWJ1ZzogZmFsc2UsXG5cdFx0XHRcdGNsaWNrYWJsZUxheWVyczogW1ZlY3RvcmxheWVyU2VydmljZS5nZXROYW1lKCkgKyAnX2dlb20nXSxcblx0XHRcdFx0bXV0ZXhUb2dnbGU6IHRydWUsXG5cdFx0XHRcdGdldElERm9yTGF5ZXJGZWF0dXJlOiBmdW5jdGlvbiAoZmVhdHVyZSkge1xuXHRcdFx0XHRcdHJldHVybiBmZWF0dXJlLnByb3BlcnRpZXMuaXNvX2EyO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRmaWx0ZXI6IGZ1bmN0aW9uIChmZWF0dXJlLCBjb250ZXh0KSB7XG5cblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0XHRtYXAuYWRkTGF5ZXIoVmVjdG9ybGF5ZXJTZXJ2aWNlLnNldExheWVyKGxheWVyKSk7XG5cdFx0XHR2YXIgbGFiZWxzTGF5ZXIgPSBMLnRpbGVMYXllcignaHR0cHM6Ly97c30udGlsZXMubWFwYm94LmNvbS92NC9tYWdub2xvLjA2MDI5YTljL3t6fS97eH0ve3l9LnBuZz9hY2Nlc3NfdG9rZW49JyArIGFwaUtleSx7XG5cdFx0XHRcdFx0XHRub1dyYXA6IHRydWUsXG5cdFx0XHRcdFx0XHRjb250aW51b3VzV29ybGQ6IGZhbHNlXG5cdFx0XHR9KTtcblx0XHRcdG1hcC5hZGRMYXllcihsYWJlbHNMYXllcik7XG5cdFx0XHRsYWJlbHNMYXllci5icmluZ1RvRnJvbnQoKTtcblx0XHR9KTtcblx0fSk7XG59KSgpO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
