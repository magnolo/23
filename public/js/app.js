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
		angular.module('app.controllers', ['angularMoment','ngScrollbar','mdColorPicker','ngAnimate','ui.tree','toastr','ui.router', 'md.data.table', 'ngMaterial', 'ngStorage', 'restangular', 'ngMdIcons', 'angular-loading-bar', 'ngMessages', 'ngSanitize', "leaflet-directive",'nvd3']);
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
								return ContentService.fetchIndicators();
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
						templateUrl:getView('IndexCheck'),
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
          fetchIndicators: function(){
             return this.content.indicators = DataService.getAll('indicators').$object
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

        function getAll(route){
          var data = Restangular.all(route).getList();
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
        vm.selected = [];

        vm.deleteData = deleteData;
        vm.deleteSelected = deleteSelected;
        vm.deleteColumn = deleteColumn;
        vm.onOrderChange = onOrderChange;
        vm.onPaginationChange = onPaginationChange;
        vm.checkForErrors = checkForErrors;

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
						if (found >= vm.data[0].meta.fields.length - 2) {
							vm.extendingChoices.push(entry);
						}
					})
					if (vm.extendingChoices.length) {
						DialogService.fromTemplate('extendData', $scope);
					}
				});
			}
		}

		function clearErrors() {
			angular.forEach(vm.data, function(row, key) {
				angular.forEach(row.data[0], function(item, k) {
					if (isNaN(item) || item < 0) {
						if ( /*item.toString().toUpperCase() == "NA" ||*/ item < 0 || item.toString().toUpperCase().indexOf('N/A') > -1) {
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
									console.log(vm.data[k]);
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

(function(){
    "use strict";

    angular.module('app.controllers').controller('IndexFinalCtrl', ["$state", "IndexService", "DataService", "toastr", function($state, IndexService, DataService, toastr){
        //
        var vm = this;
        vm.data = IndexService.getData();
        vm.meta = IndexService.getMeta();
        vm.errors = IndexService.getErrors();
        vm.indicators = IndexService.getIndicators();
        vm.saveData = saveData;

        activate();

        function activate(){
          checkData();
        }

        function checkData(){
          if(!vm.data){
            $state.go('app.index.create');
          }
        }

        function saveData(){
          var insertData = {data:[]};
          var insertMeta = [], fields = [];
          vm.loading = true;
          angular.forEach(vm.data, function(item, key){
            if(item.errors.length == 0){
              item.data[0].year = vm.meta.year;
              console.log(item.data[0]);
              vm.meta.iso_type = item.data[0][vm.meta.iso_field].length == 3 ? 'iso-3166-1' : 'iso-3166-2';
              insertData.data.push(item.data[0]);
            }
            else{
              toastr.error('There are some errors left!', 'Huch!');
              return;
            }
          });
          angular.forEach(vm.indicators, function(item, key){
              if(key != vm.meta.iso_field && key != vm.meta.country_field){
              var field = {
                'column': key,
                'title':vm.indicators[key].title,
                'description':vm.indicators[key].description,
                'measure_type_id':vm.indicators[key].measure_type_id || 0,
                'is_public': vm.indicators[key].is_public || 0,
                'dataprovider_id': vm.indicators[key].dataprovider.id || 0
              };
              var categories = [];
              angular.forEach(vm.indicators[key].categories, function(cat){
                categories.push(cat.id);
              });
              field.categories = categories;
              fields.push(field);
            }
          });
          vm.meta.fields = fields;
          console.log(vm.meta);
          DataService.post('data/tables', vm.meta).then(function(response){
              DataService.post('data/tables/'+response.table_name+'/insert', insertData).then(function(res){
                if(res == true){
                  toastr.success(insertData.data.length+' items importet to '+vm.meta.name,'Success');
                  IndexService.clear();
                  $state.go('app.index.mydata');
                  vm.data = [];
                  vm.step = 0;
                }
                  vm.loading = false;
              });
          }, function(response){
            if(response.message){
              toastr.error(response.message, 'Ouch!');

            }
              vm.loading = false;
          })
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
  			if (item.title && item.measure_type_id && item.dataprovider && item.title.length >= 3) {
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
          vm.preCategories = vm.indicators[o.column_name].categories;
          vm.prePublic = vm.indicators[o.column_name].is_public;
          vm.preStyle = vm.indicators[o.column_name].style;
          console.log(vm.preStyle);
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

(function() {
	"use strict";

	angular.module('app.controllers').controller('IndexeditorCtrl', ["$filter", "indicators", function($filter, indicators) {
		//
		var vm = this;

		vm.indicators = indicators;
		vm.selection = [];
		vm.filter = {
			list: 0,
			types: {
				title: true,
				style: true,
				categories: false,
				infographic: false,
				description: true
			}
		}
		vm.openMenu = openMenu;
		vm.selectedItem = selectedItem;
		vm.toggleSelection = toggleSelection;

		function selectedItem(item) {
			return vm.selection.indexOf(item) > -1 ? true : false;
		}

		function toggleSelection(item) {
			var index = vm.selection.indexOf(item);
			if (index > -1) {
				return vm.selection.splice(index, 1);
			} else {
				return vm.selection.push(item);
			}
		}

		function openMenu($mdOpenMenu, ev) {
			$mdOpenMenu(ev);
		}

	}]);

})();
(function () {
	"use strict";

	angular.module('app.controllers').controller('IndexeditorindicatorCtrl', ["$scope", "$state", "$timeout", "VectorlayerService", "leafletData", "ContentService", function ($scope, $state,$timeout, VectorlayerService, leafletData, ContentService) {
		//
		var vm = this;
    vm.indicator = ContentService.getIndicator($state.params.id);
		vm.scale = "";
		vm.min = 10000000;
		vm.max = 0;
		vm.selected = 0;
		setActive();

		ContentService.getIndicatorData($state.params.id).then(function(data){
			VectorlayerService.createCanvas('#ff0000');
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
                item.measure_type_id = $scope.$parent.vm.preMeasure ;
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
												if(/*item.toString().toUpperCase() == "NA" || */item < 0 || item.toString().toUpperCase().indexOf('N/A') > -1){
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

	angular.module('app.controllers').controller('IndicatorCtrl', ["$scope", "DataService", "DialogService", "$filter", "toastr", function ($scope, DataService, DialogService, $filter, toastr) {
		//
		var vm = this;

		vm.checkBase = checkBase;
		vm.checkFull = checkFull;

		vm.categories = [];
		vm.dataproviders = [];
		vm.selectedItem = null;
		vm.searchText = null;
		vm.querySearch = querySearch;
		vm.querySearchCategory = querySearchCategory;

		vm.toggleCategorie = toggleCategorie;
		vm.selectedCategorie = selectedCategorie;
		vm.saveCategory = saveCategory;

		vm.toggleStyle = toggleStyle;
		vm.selectedStyle = selectedStyle;

		activate();

		function activate() {
			loadAll();
		}

		function querySearch(query) {
			return $filter('findbyname')(vm.dataproviders, query, 'title');
		}

		function querySearchCategory(query) {
			return $filter('findbyname')(vm.categories, query, 'title');
		}

		function loadAll() {
			vm.dataproviders = DataService.getAll('dataproviders').$object;
			vm.categories = DataService.getAll('categories').$object;
			vm.measureTypes = DataService.getAll('measure_types').$object;
			vm.styles = DataService.getAll('styles').$object;
		}

		function checkBase(){
			if (vm.item.title && vm.item.measure_type_id && vm.item.dataprovider && vm.item.title.length >= 3) {
				return true;
			}
			return false;
		}
		function checkFull(){
			if(typeof vm.item.categories == "undefined") return false;
			return checkBase() && vm.item.categories.length ? true : false;
		}

		function toggleCategorie(categorie) {
			var found = false, index = -1;
			angular.forEach(vm.item.categories, function(cat, i){
				if(cat.id == categorie.id){
					found = true;
					index = i;
				}
			})
			console.log(found, index);
			index === -1 ? vm.item.categories.push(categorie) : vm.item.categories.splice(index, 1);
		}

		function selectedCategorie(item, categorie) {
			if (typeof item.categories == "undefined") {
				item.categories = [];
				return false;
			}
		 	var found = false;
			angular.forEach(item.categories, function(cat, key){
				if(cat.id == categorie.id){
					found = true;
				}
			});
			return found;
		}
		function saveCategory(valid){
			if(valid){
				console.log(vm.category);
				DataService.post('categories', vm.category).then(function(data){
					vm.categories.push(data);
					vm.createCategory = false;
					vm.item.categories.push(data);
					toastr.success('New Category was saved','Success');
				});
			}
		}
		function toggleStyle(style) {
			if(vm.item.style_id == style.id){
				vm.item.style_id = 0;
			}
			else{
				vm.item.style_id = style.id
				vm.item.style = style;
			}
		}
		function selectedStyle(item, style) {
			return vm.item.style_id == style.id ? true : false;
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiLCJyb3V0ZXMuanMiLCJyb3V0ZXMucnVuLmpzIiwiY29uZmlnL2F1dGguanMiLCJjb25maWcvbG9hZGluZ19iYXIuanMiLCJjb25maWcvcmVzdGFuZ3VsYXIuanMiLCJjb25maWcvdGhlbWUuanMiLCJjb25maWcvdG9hc3RyLmpzIiwiZmlsdGVycy9hbHBoYW51bS5qcyIsImZpbHRlcnMvY2FwaXRhbGl6ZS5qcyIsImZpbHRlcnMvZmluZGJ5bmFtZS5qcyIsImZpbHRlcnMvaHVtYW5fcmVhZGFibGUuanMiLCJmaWx0ZXJzL3RydW5jYXRlX2NoYXJhY3RlcnMuanMiLCJmaWx0ZXJzL3RydW5jYXRlX3dvcmRzLmpzIiwiZmlsdGVycy90cnVzdF9odG1sLmpzIiwiZmlsdGVycy91Y2ZpcnN0LmpzIiwic2VydmljZXMvVmVjdG9ybGF5ZXIuanMiLCJzZXJ2aWNlcy9jb250ZW50LmpzIiwic2VydmljZXMvY291bnRyaWVzLmpzIiwic2VydmljZXMvZGF0YS5qcyIsInNlcnZpY2VzL2RpYWxvZy5qcyIsInNlcnZpY2VzL2ljb25zLmpzIiwic2VydmljZXMvaW5kZXguanMiLCJzZXJ2aWNlcy9pbmRpemVzLmpzIiwic2VydmljZXMvdG9hc3QuanMiLCJzZXJ2aWNlcy91c2VyLmpzIiwiYXBwL0luZGV4Q2hlY2svSW5kZXhDaGVjay5qcyIsImFwcC9JbmRleENoZWNrL2luZGV4Q2hlY2tTaWRlYmFyLmpzIiwiYXBwL2hvbWUvaG9tZS5qcyIsImFwcC9pbXBvcnRjc3YvaW1wb3J0Y3N2LmpzIiwiYXBwL2luZGV4L2luZGV4LmpzIiwiYXBwL2luZGV4L2luZGV4YmFzZS5qcyIsImFwcC9pbmRleEZpbmFsL2luZGV4RmluYWwuanMiLCJhcHAvaW5kZXhGaW5hbC9pbmRleEZpbmFsTWVudS5qcyIsImFwcC9pbmRleE1ldGEvaW5kZXhNZXRhLmpzIiwiYXBwL2luZGV4TWV0YS9pbmRleE1ldGFNZW51LmpzIiwiYXBwL2luZGV4TXlEYXRhL2luZGV4TXlEYXRhLmpzIiwiYXBwL2luZGV4TXlEYXRhL2luZGV4TXlEYXRhRW50cnkuanMiLCJhcHAvaW5kZXhNeURhdGEvaW5kZXhNeURhdGFNZW51LmpzIiwiYXBwL2luZGV4Y3JlYXRvci9pbmRleGNyZWF0b3IuanMiLCJhcHAvaW5kZXhlZGl0b3IvaW5kZXhlZGl0b3IuanMiLCJhcHAvaW5kZXhlZGl0b3IvaW5kaWNhdG9yLmpzIiwiYXBwL2luZGV4aW5mby9pbmRleGluZm8uanMiLCJhcHAvbG9naW4vbG9naW4uanMiLCJhcHAvbWFwL21hcC5qcyIsImFwcC9zZWxlY3RlZC9zZWxlY3RlZC5qcyIsImFwcC9zaWRlYmFyL3NpZGViYXIuanMiLCJhcHAvc2lnbnVwL3NpZ251cC5qcyIsImFwcC90b2FzdHMvdG9hc3RzLmpzIiwiYXBwL3Vuc3VwcG9ydGVkX2Jyb3dzZXIvdW5zdXBwb3J0ZWRfYnJvd3Nlci5qcyIsImFwcC91c2VyL3VzZXIuanMiLCJkaWFsb2dzL2FkZF91c2Vycy9hZGRfdXNlcnMuanMiLCJkaWFsb2dzL2NvcHlwcm92aWRlci9jb3B5cHJvdmlkZXIuanMiLCJkaWFsb2dzL2VkaXRjb2x1bW4vZWRpdGNvbHVtbi5qcyIsImRpYWxvZ3MvZWRpdHJvdy9lZGl0cm93LmpzIiwiZGlhbG9ncy9leHRlbmREYXRhL2V4dGVuZERhdGEuanMiLCJkaWFsb2dzL2xvb3NlZGF0YS9sb29zZWRhdGEuanMiLCJkaWFsb2dzL3NlbGVjdGlzb2ZldGNoZXJzL3NlbGVjdGlzb2ZldGNoZXJzLmpzIiwiZGlyZWN0aXZlcy9idWJibGVzL2J1YmJsZXMuanMiLCJkaXJlY3RpdmVzL2J1YmJsZXMvZGVmaW5pdGlvbi5qcyIsImRpcmVjdGl2ZXMvY2lyY2xlZ3JhcGgvY2lyY2xlZ3JhcGguanMiLCJkaXJlY3RpdmVzL2NpcmNsZWdyYXBoL2RlZmluaXRpb24uanMiLCJkaXJlY3RpdmVzL2hpc3RvcnkvZGVmaW5pdGlvbi5qcyIsImRpcmVjdGl2ZXMvaGlzdG9yeS9oaXN0b3J5LmpzIiwiZGlyZWN0aXZlcy9pbmRpY2F0b3JNZW51L2RlZmluaXRpb24uanMiLCJkaXJlY3RpdmVzL2luZGljYXRvck1lbnUvaW5kaWNhdG9yTWVudS5qcyIsImRpcmVjdGl2ZXMvbWVkaWFuL2RlZmluaXRpb24uanMiLCJkaXJlY3RpdmVzL21lZGlhbi9tZWRpYW4uanMiLCJkaXJlY3RpdmVzL3BhcnNlY3N2L2RlZmluaXRpb24uanMiLCJkaXJlY3RpdmVzL3BhcnNlY3N2L3BhcnNlY3N2LmpzIiwiZGlyZWN0aXZlcy9zaW1wbGVsaW5lY2hhcnQvZGVmaW5pdGlvbi5qcyIsImRpcmVjdGl2ZXMvc2ltcGxlbGluZWNoYXJ0L3NpbXBsZWxpbmVjaGFydC5qcyIsImRpcmVjdGl2ZXMvc2xpZGVUb2dnbGUvZGVmaW5pdGlvbi5qcyIsImRpcmVjdGl2ZXMvc2xpZGVUb2dnbGUvc2xpZGVUb2dnbGUuanMiLCJkaXJlY3RpdmVzL3N1YmluZGV4L2RlZmluaXRpb24uanMiLCJkaXJlY3RpdmVzL3N1YmluZGV4L3N1YmluZGV4LmpzIiwiZGlyZWN0aXZlcy9zdW5idXJzdC9kZWZpbml0aW9uLmpzIiwiZGlyZWN0aXZlcy9zdW5idXJzdC9zdW5idXJzdC5qcyIsImRpcmVjdGl2ZXMvZmlsZURyb3B6b25lL2RlZmluaXRpb24uanMiLCJkaXJlY3RpdmVzL2ZpbGVEcm9wem9uZS9maWxlRHJvcHpvbmUuanMiLCJkaXJlY3RpdmVzL2luZGljYXRvci9kZWZpbml0aW9uLmpzIiwiZGlyZWN0aXZlcy9pbmRpY2F0b3IvaW5kaWNhdG9yLmpzIiwiYXBwL2hlYWRlci9oZWFkZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsSUFBQSxNQUFBLFFBQUEsT0FBQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBOzs7O0VBSUEsUUFBQSxPQUFBLGNBQUEsQ0FBQSxhQUFBLGFBQUE7RUFDQSxRQUFBLE9BQUEsbUJBQUEsQ0FBQSxnQkFBQSxjQUFBLGdCQUFBLFlBQUEsVUFBQSxTQUFBLGFBQUEsaUJBQUEsY0FBQSxhQUFBLGVBQUEsYUFBQSx1QkFBQSxjQUFBLGNBQUEsb0JBQUE7RUFDQSxRQUFBLE9BQUEsZUFBQTtFQUNBLFFBQUEsT0FBQSxnQkFBQSxDQUFBLGdCQUFBLGFBQUEsYUFBQSxlQUFBO0VBQ0EsUUFBQSxPQUFBLGtCQUFBLENBQUEsYUFBQTtFQUNBLFFBQUEsT0FBQSxjQUFBOzs7O0FDbkJBLENBQUEsWUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxjQUFBLHFFQUFBLFVBQUEsZ0JBQUEsb0JBQUEsbUJBQUE7O0VBRUEsSUFBQSxVQUFBLFVBQUEsVUFBQTtHQUNBLE9BQUEsZ0JBQUEsV0FBQSxNQUFBLFdBQUE7OztFQUdBLG1CQUFBLFVBQUE7O0VBRUE7SUFDQSxNQUFBLE9BQUE7SUFDQSxVQUFBO0lBQ0EsT0FBQTtLQUNBLFFBQUE7TUFDQSxhQUFBLFFBQUE7TUFDQSxZQUFBO01BQ0EsY0FBQTs7S0FFQSxNQUFBO0tBQ0EsUUFBQTtNQUNBLGFBQUEsUUFBQTtNQUNBLFlBQUE7TUFDQSxjQUFBOzs7O0lBSUEsTUFBQSxXQUFBO0lBQ0EsSUFBQTtJQUNBLE1BQUE7S0FDQSxXQUFBO01BQ0EsYUFBQSxRQUFBO01BQ0EsWUFBQTtNQUNBLGNBQUE7Ozs7SUFJQSxNQUFBLFlBQUE7SUFDQSxLQUFBO0lBQ0EsVUFBQTs7O0lBR0EsTUFBQSxrQkFBQTtJQUNBLEtBQUE7SUFDQSxPQUFBO0tBQ0EsU0FBQTtNQUNBLGFBQUEsUUFBQTtNQUNBLFlBQUE7TUFDQSxjQUFBOzs7Ozs7SUFNQSxNQUFBLG9CQUFBO0lBQ0EsS0FBQTtJQUNBLEtBQUE7SUFDQSxPQUFBO0tBQ0EsU0FBQTtNQUNBLGFBQUEsUUFBQTtNQUNBLFlBQUE7TUFDQSxjQUFBO01BQ0EsU0FBQTtPQUNBLGtDQUFBLFVBQUEsYUFBQSxPQUFBO1FBQ0EsT0FBQSxZQUFBLE9BQUEsTUFBQTs7Ozs7OztJQU9BLE1BQUEsYUFBQTtJQUNBLFVBQUE7SUFDQSxLQUFBOzs7SUFHQSxNQUFBLG9CQUFBO0lBQ0EsSUFBQTtJQUNBLEtBQUE7SUFDQSxNQUFBO0tBQ0EsV0FBQTtNQUNBLFlBQUE7TUFDQSxZQUFBO01BQ0EsY0FBQTs7S0FFQSxRQUFBO01BQ0EsWUFBQSxRQUFBO01BQ0EsWUFBQTtNQUNBLGNBQUE7Ozs7SUFJQSxNQUFBLDBCQUFBO0lBQ0EsSUFBQTtJQUNBLEtBQUE7SUFDQSxNQUFBO0tBQ0EsV0FBQTtNQUNBLFlBQUE7TUFDQSxZQUFBO01BQ0EsY0FBQTs7S0FFQSxRQUFBO09BQ0EsWUFBQTtPQUNBLFlBQUE7T0FDQSxjQUFBOzs7O0lBSUEsTUFBQSxtQkFBQTtJQUNBLEtBQUE7SUFDQSxLQUFBO0lBQ0EsT0FBQTtLQUNBLFlBQUE7TUFDQSxhQUFBLFFBQUE7TUFDQSxZQUFBO01BQ0EsY0FBQTtNQUNBLFFBQUE7T0FDQSw4QkFBQSxTQUFBLGVBQUE7UUFDQSxPQUFBLGVBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7SUFnQkEsTUFBQSw2QkFBQTtJQUNBLEtBQUE7SUFDQSxLQUFBO0lBQ0EsUUFBQTtJQUNBLE9BQUE7S0FDQSxTQUFBO01BQ0EsWUFBQTtNQUNBLFlBQUE7TUFDQSxjQUFBOzs7Ozs7Ozs7Ozs7OztJQWNBLE1BQUEscUNBQUE7SUFDQSxLQUFBO0lBQ0EsS0FBQTtJQUNBLE9BQUE7O0lBRUEsTUFBQSxvQkFBQTtJQUNBLEtBQUE7SUFDQSxLQUFBO0lBQ0EsT0FBQTtLQUNBLFlBQUE7TUFDQSxhQUFBLFFBQUE7TUFDQSxZQUFBO01BQ0EsY0FBQTs7OztJQUlBLE1BQUEsMEJBQUE7SUFDQSxLQUFBO0lBQ0EsS0FBQTs7SUFFQSxNQUFBLG1CQUFBO0lBQ0EsS0FBQTtJQUNBLEtBQUE7SUFDQSxNQUFBO0tBQ0EsUUFBQTtNQUNBLFlBQUEsUUFBQTtNQUNBLFlBQUE7TUFDQSxjQUFBOztLQUVBLFlBQUE7TUFDQSxhQUFBO01BQ0EsWUFBQTtNQUNBLGNBQUE7Ozs7SUFJQSxNQUFBLGtCQUFBO0lBQ0EsS0FBQTtJQUNBLEtBQUE7SUFDQSxPQUFBO0lBQ0EsTUFBQTtLQUNBLFFBQUE7TUFDQSxZQUFBLFFBQUE7TUFDQSxZQUFBO01BQ0EsY0FBQTs7S0FFQSxXQUFBO01BQ0EsYUFBQTtNQUNBLFlBQUE7TUFDQSxjQUFBOzs7O0lBSUEsTUFBQSxtQkFBQTtJQUNBLEtBQUE7SUFDQSxLQUFBO0lBQ0EsT0FBQTtJQUNBLE1BQUE7S0FDQSxRQUFBO01BQ0EsWUFBQSxRQUFBO01BQ0EsWUFBQTtNQUNBLGNBQUE7O0tBRUEsV0FBQTtNQUNBLGFBQUE7TUFDQSxZQUFBO01BQ0EsY0FBQTs7OztJQUlBLE1BQUEsa0JBQUE7SUFDQSxLQUFBO0lBQ0EsT0FBQTtLQUNBLFlBQUE7TUFDQSxhQUFBO01BQ0EsWUFBQTtNQUNBLGNBQUE7TUFDQSxTQUFBO09BQ0EseUNBQUEsVUFBQSxnQkFBQSxjQUFBO1FBQ0EsT0FBQSxlQUFBLFVBQUEsYUFBQTs7T0FFQSxnQ0FBQSxTQUFBLGlCQUFBO1FBQ0EsT0FBQSxpQkFBQTs7OztLQUlBLFlBQUE7TUFDQSxhQUFBOzs7O0lBSUEsTUFBQSx1QkFBQTtLQUNBLElBQUE7S0FDQSxNQUFBO01BQ0EsUUFBQTtPQUNBLFdBQUE7T0FDQSxjQUFBO1FBQ0EsWUFBQSxRQUFBOzs7O0lBSUEsTUFBQSwyQkFBQTtJQUNBLEtBQUE7Ozs7Ozs7Ozs7Ozs7O0lBY0EsTUFBQSxtQ0FBQTtJQUNBLEtBQUE7O0lBRUEsTUFBQSxpQkFBQTtJQUNBLEtBQUE7SUFDQSxNQUFBO0tBQ0EsVUFBQTs7SUFFQSxPQUFBO0tBQ0EsU0FBQTtNQUNBLGFBQUEsUUFBQTs7S0FFQSxPQUFBOzs7Ozs7Ozs7QUM3UkEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGNBQUEsMEdBQUEsU0FBQSxZQUFBLFlBQUEsVUFBQSxPQUFBLE9BQUEsY0FBQSxhQUFBLE9BQUE7RUFDQSxXQUFBLGNBQUE7RUFDQSxXQUFBLGNBQUEsY0FBQSxZQUFBOztFQUVBLFdBQUEsSUFBQSxxQkFBQSxTQUFBLE9BQUEsU0FBQSxVQUFBLFVBQUEsV0FBQTtHQUNBLElBQUEsUUFBQSxRQUFBLENBQUEsTUFBQSxrQkFBQTtJQUNBLE9BQUEsTUFBQSx1Q0FBQTtNQUNBLE1BQUE7TUFDQSxPQUFBLE9BQUEsR0FBQTs7R0FFQSxJQUFBLFFBQUEsUUFBQSxRQUFBLEtBQUEsU0FBQTtJQUNBLFdBQUEsZUFBQSxRQUFBLEtBQUE7O0dBRUEsR0FBQSxRQUFBLFVBQUEsTUFBQTtJQUNBLFdBQUEsUUFBQTs7T0FFQTtJQUNBLFdBQUEsUUFBQTs7R0FFQSxXQUFBLGVBQUEsQ0FBQSxNQUFBLFdBQUEsT0FBQTtHQUNBLFdBQUEsaUJBQUE7O0VBRUEsV0FBQSxJQUFBLHNCQUFBLFNBQUEsT0FBQSxRQUFBOzs7O0VBSUEsV0FBQSxJQUFBLHVCQUFBLFNBQUEsT0FBQSxRQUFBO0dBQ0EsV0FBQSxpQkFBQTtHQUNBOzs7RUFHQSxTQUFBLGNBQUE7R0FDQSxTQUFBLFVBQUE7SUFDQSxZQUFBLE9BQUEsT0FBQSxLQUFBLFVBQUEsS0FBQTtLQUNBLElBQUE7O01BRUE7Ozs7O0FDdkNBLENBQUEsWUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxjQUFBLHlCQUFBLFVBQUEsZUFBQTs7O0VBR0EsY0FBQSxXQUFBO0lBQ0EsY0FBQSxZQUFBO0lBQ0EsY0FBQSxZQUFBO0VBQ0EsY0FBQSxTQUFBO0dBQ0EsS0FBQTtHQUNBLFVBQUE7O0VBRUEsY0FBQSxPQUFBO0dBQ0EsS0FBQTtHQUNBLFVBQUE7Ozs7OztBQ2ZBLENBQUEsV0FBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxjQUFBLGlDQUFBLFVBQUEsc0JBQUE7RUFDQSxzQkFBQSxpQkFBQTs7Ozs7QUNKQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsY0FBQSxnQ0FBQSxTQUFBLHFCQUFBO0VBQ0E7R0FDQSxXQUFBO0dBQ0Esa0JBQUEsRUFBQSxRQUFBO0dBQ0EsdUJBQUEsU0FBQSxLQUFBLFVBQUEsS0FBQSxJQUFBLFNBQUEsVUFBQTtRQUNBLElBQUE7UUFDQSxnQkFBQSxLQUFBO1FBQ0EsSUFBQSxLQUFBLE1BQUE7WUFDQSxjQUFBLFFBQUEsS0FBQTs7UUFFQSxJQUFBLEtBQUEsVUFBQTtZQUNBLGNBQUEsWUFBQSxLQUFBOztRQUVBLE9BQUE7Ozs7OztBQ2hCQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsY0FBQSw4QkFBQSxTQUFBLG9CQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztFQW9CQSxJQUFBLFVBQUEsbUJBQUEsY0FBQSxVQUFBO0dBQ0EsT0FBQTtHQUNBLFFBQUE7O0dBRUEsbUJBQUEsY0FBQSxTQUFBOztFQUVBLG1CQUFBLE1BQUE7R0FDQSxlQUFBO0dBQ0EsY0FBQTtHQUNBLFlBQUE7Ozs7O0FDaENBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxjQUFBLHdCQUFBLFNBQUEsYUFBQTs7UUFFQSxRQUFBLE9BQUEsY0FBQTtVQUNBLGFBQUE7VUFDQSxhQUFBO1VBQ0EsV0FBQTtVQUNBLGFBQUE7VUFDQSxlQUFBO1VBQ0EsbUJBQUE7VUFDQSx1QkFBQTtVQUNBLFFBQUE7VUFDQSxhQUFBOzs7Ozs7QUNkQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsZUFBQSxRQUFBLFlBQUEsVUFBQTtRQUNBLE9BQUEsVUFBQSxPQUFBOztZQUVBLEtBQUEsQ0FBQSxPQUFBO2NBQ0EsT0FBQTs7WUFFQSxPQUFBLE1BQUEsUUFBQSxlQUFBOzs7Ozs7O0FDVEEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGVBQUEsUUFBQSxjQUFBLFVBQUE7RUFDQSxPQUFBLFNBQUEsT0FBQSxLQUFBO0dBQ0EsT0FBQSxDQUFBLENBQUEsQ0FBQSxTQUFBLE1BQUEsUUFBQSxzQkFBQSxTQUFBLElBQUE7SUFDQSxPQUFBLElBQUEsT0FBQSxHQUFBLGdCQUFBLElBQUEsT0FBQSxHQUFBO1FBQ0E7Ozs7O0FDUEEsQ0FBQSxZQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGVBQUEsT0FBQSxjQUFBLFlBQUE7RUFDQSxPQUFBLFVBQUEsT0FBQSxNQUFBLE9BQUE7O01BRUEsSUFBQSxTQUFBO0dBQ0EsSUFBQSxJQUFBO0lBQ0EsTUFBQSxNQUFBOztHQUVBLE9BQUEsSUFBQSxLQUFBLEtBQUE7SUFDQSxJQUFBLE1BQUEsR0FBQSxPQUFBLGNBQUEsUUFBQSxLQUFBLGlCQUFBLENBQUEsR0FBQTtNQUNBLE9BQUEsS0FBQSxNQUFBOzs7R0FHQSxPQUFBOzs7Ozs7QUNmQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsZUFBQSxRQUFBLGlCQUFBLFVBQUE7RUFDQSxPQUFBLFNBQUEsU0FBQSxLQUFBO0dBQ0EsS0FBQSxDQUFBLEtBQUE7SUFDQSxPQUFBOztHQUVBLElBQUEsUUFBQSxJQUFBLE1BQUE7R0FDQSxLQUFBLElBQUEsRUFBQSxHQUFBLEVBQUEsTUFBQSxRQUFBLEtBQUE7SUFDQSxNQUFBLEtBQUEsTUFBQSxHQUFBLE9BQUEsR0FBQSxnQkFBQSxNQUFBLEdBQUEsTUFBQTs7R0FFQSxPQUFBLE1BQUEsS0FBQTs7OztBQ1pBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxlQUFBLE9BQUEsc0JBQUEsWUFBQTtRQUNBLE9BQUEsVUFBQSxPQUFBLE9BQUEsYUFBQTtZQUNBLElBQUEsTUFBQSxRQUFBO2dCQUNBLE9BQUE7O1lBRUEsSUFBQSxTQUFBLEdBQUE7Z0JBQ0EsT0FBQTs7WUFFQSxJQUFBLFNBQUEsTUFBQSxTQUFBLE9BQUE7Z0JBQ0EsUUFBQSxNQUFBLFVBQUEsR0FBQTs7Z0JBRUEsSUFBQSxDQUFBLGFBQUE7b0JBQ0EsSUFBQSxZQUFBLE1BQUEsWUFBQTs7b0JBRUEsSUFBQSxjQUFBLENBQUEsR0FBQTt3QkFDQSxRQUFBLE1BQUEsT0FBQSxHQUFBOzt1QkFFQTtvQkFDQSxPQUFBLE1BQUEsT0FBQSxNQUFBLE9BQUEsT0FBQSxLQUFBO3dCQUNBLFFBQUEsTUFBQSxPQUFBLEdBQUEsTUFBQSxTQUFBOzs7Z0JBR0EsT0FBQSxRQUFBOztZQUVBLE9BQUE7Ozs7QUMzQkEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLGVBQUEsT0FBQSxpQkFBQSxZQUFBO1FBQ0EsT0FBQSxVQUFBLE9BQUEsT0FBQTtZQUNBLElBQUEsTUFBQSxRQUFBO2dCQUNBLE9BQUE7O1lBRUEsSUFBQSxTQUFBLEdBQUE7Z0JBQ0EsT0FBQTs7WUFFQSxJQUFBLE9BQUE7Z0JBQ0EsSUFBQSxhQUFBLE1BQUEsTUFBQTtnQkFDQSxJQUFBLFdBQUEsU0FBQSxPQUFBO29CQUNBLFFBQUEsV0FBQSxNQUFBLEdBQUEsT0FBQSxLQUFBLE9BQUE7OztZQUdBLE9BQUE7Ozs7QUNqQkEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGVBQUEsUUFBQSxzQkFBQSxVQUFBLE1BQUE7RUFDQSxPQUFBLFVBQUEsTUFBQTtHQUNBLE9BQUEsS0FBQSxZQUFBOzs7O0FDTEEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGVBQUEsT0FBQSxXQUFBLFdBQUE7RUFDQSxPQUFBLFVBQUEsUUFBQTtHQUNBLEtBQUEsQ0FBQSxPQUFBO0lBQ0EsT0FBQTs7R0FFQSxPQUFBLE1BQUEsVUFBQSxHQUFBLEdBQUEsZ0JBQUEsTUFBQSxVQUFBOzs7Ozs7QUNSQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsZ0JBQUEsUUFBQSxzQkFBQSxVQUFBOztRQUVBLE1BQUE7VUFDQSxTQUFBO1VBQ0EsU0FBQTtVQUNBLEtBQUE7VUFDQSxLQUFBO1lBQ0EsT0FBQTtZQUNBLE9BQUE7O1VBRUEsS0FBQTtZQUNBLE9BQUE7WUFDQSxLQUFBO1lBQ0EsS0FBQTtZQUNBLEtBQUE7WUFDQSxJQUFBO1lBQ0EsUUFBQTs7VUFFQSxVQUFBLFNBQUEsRUFBQTtZQUNBLE9BQUEsS0FBQSxLQUFBLFFBQUE7O1VBRUEsVUFBQSxVQUFBO1lBQ0EsT0FBQSxLQUFBLEtBQUE7O1VBRUEsU0FBQSxVQUFBO1lBQ0EsT0FBQSxLQUFBLEtBQUE7O1VBRUEsUUFBQSxXQUFBO1lBQ0EsT0FBQSxLQUFBLEtBQUE7O1VBRUEsSUFBQSxVQUFBO1lBQ0EsT0FBQSxLQUFBLEtBQUE7O1VBRUEsTUFBQSxXQUFBO1lBQ0EsT0FBQSxLQUFBLEtBQUE7O1VBRUEsTUFBQSxXQUFBO1lBQ0EsT0FBQSxLQUFBLEtBQUE7O1VBRUEsY0FBQSxTQUFBLE9BQUE7U0FDQSxLQUFBLFNBQUEsU0FBQSxjQUFBO1NBQ0EsS0FBQSxPQUFBLFFBQUE7U0FDQSxLQUFBLE9BQUEsU0FBQTtTQUNBLEtBQUEsTUFBQSxLQUFBLE9BQUEsV0FBQTtTQUNBLElBQUEsV0FBQSxLQUFBLElBQUEscUJBQUEsR0FBQSxHQUFBLEtBQUE7U0FDQSxTQUFBLGFBQUEsR0FBQTtTQUNBLFNBQUEsYUFBQSxNQUFBLFVBQUE7U0FDQSxTQUFBLGFBQUEsR0FBQTtTQUNBLEtBQUEsSUFBQSxZQUFBO1NBQ0EsS0FBQSxJQUFBLFNBQUEsR0FBQSxHQUFBLEtBQUE7U0FDQSxLQUFBLFVBQUEsS0FBQSxJQUFBLGFBQUEsR0FBQSxHQUFBLEtBQUEsR0FBQTs7O1FBR0EsYUFBQSxTQUFBLE9BQUE7U0FDQSxJQUFBLFdBQUEsS0FBQSxJQUFBLHFCQUFBLEdBQUEsR0FBQSxLQUFBO1NBQ0EsU0FBQSxhQUFBLEdBQUE7U0FDQSxTQUFBLGFBQUEsTUFBQSxTQUFBO1NBQ0EsU0FBQSxhQUFBLEdBQUE7U0FDQSxLQUFBLElBQUEsWUFBQTtTQUNBLEtBQUEsSUFBQSxTQUFBLEdBQUEsR0FBQSxLQUFBO1NBQ0EsS0FBQSxVQUFBLEtBQUEsSUFBQSxhQUFBLEdBQUEsR0FBQSxLQUFBLEdBQUE7OztVQUdBLFVBQUEsU0FBQSxNQUFBO1lBQ0EsT0FBQSxLQUFBLFFBQUE7Ozs7Ozs7OztBQ25FQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsZ0JBQUEsUUFBQSxrQ0FBQSxTQUFBLFlBQUE7O1FBRUEsT0FBQTtVQUNBLFNBQUE7WUFDQSxXQUFBO1lBQ0EsVUFBQTtZQUNBLE1BQUE7WUFDQSxXQUFBO1lBQ0EsT0FBQTtZQUNBLGFBQUE7O1VBRUEsaUJBQUEsVUFBQTthQUNBLE9BQUEsS0FBQSxRQUFBLGFBQUEsWUFBQSxPQUFBLGNBQUE7O1VBRUEsZUFBQSxVQUFBO1lBQ0EsT0FBQSxLQUFBLFFBQUE7O1VBRUEsY0FBQSxTQUFBLEdBQUE7WUFDQSxHQUFBLEtBQUEsUUFBQSxXQUFBLE9BQUE7Y0FDQSxJQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsS0FBQSxRQUFBLFdBQUEsUUFBQSxJQUFBO2dCQUNBLEdBQUEsS0FBQSxRQUFBLFdBQUEsR0FBQSxNQUFBLEdBQUE7a0JBQ0EsT0FBQSxLQUFBLFFBQUEsV0FBQTs7OztnQkFJQTtjQUNBLE9BQUEsS0FBQSxRQUFBLFlBQUEsWUFBQSxPQUFBLGNBQUEsSUFBQTs7OztVQUlBLGtCQUFBLFNBQUEsR0FBQTtZQUNBLE9BQUEsS0FBQSxRQUFBLE9BQUEsWUFBQSxPQUFBLGNBQUEsR0FBQTs7Ozs7Ozs7QUNsQ0EsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLGdCQUFBLFFBQUEsb0NBQUEsU0FBQSxZQUFBOztRQUVBLE9BQUE7VUFDQSxXQUFBO1VBQ0EsV0FBQSxVQUFBO1lBQ0EsT0FBQSxLQUFBLFlBQUEsWUFBQSxPQUFBLGtCQUFBOztVQUVBLFNBQUEsVUFBQTtZQUNBLEdBQUEsQ0FBQSxLQUFBLFVBQUEsT0FBQTtjQUNBLEtBQUE7O1lBRUEsT0FBQSxLQUFBOzs7Ozs7O0FDZEEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLGdCQUFBLFFBQUEsZUFBQTtJQUNBLFlBQUEsVUFBQSxDQUFBLGNBQUE7O0lBRUEsU0FBQSxZQUFBLGFBQUEsT0FBQTtRQUNBLE9BQUE7VUFDQSxRQUFBO1VBQ0EsUUFBQTtVQUNBLE1BQUE7OztRQUdBLFNBQUEsT0FBQSxNQUFBO1VBQ0EsSUFBQSxPQUFBLFlBQUEsSUFBQSxPQUFBO1lBQ0EsS0FBQSxLQUFBLFVBQUEsSUFBQSxTQUFBLEtBQUE7Y0FDQSxPQUFBLE1BQUEsS0FBQSxZQUFBO2NBQ0EsUUFBQSxJQUFBOztZQUVBLE9BQUE7O1FBRUEsU0FBQSxPQUFBLE9BQUEsR0FBQTtVQUNBLE9BQUEsWUFBQSxJQUFBLE9BQUEsSUFBQTs7UUFFQSxTQUFBLEtBQUEsT0FBQSxLQUFBO1VBQ0EsSUFBQSxPQUFBLFlBQUEsSUFBQSxPQUFBLEtBQUE7VUFDQSxLQUFBLEtBQUEsVUFBQSxJQUFBLFNBQUEsS0FBQTtZQUNBLE9BQUEsTUFBQSxLQUFBLEtBQUEsT0FBQTtZQUNBLFFBQUEsSUFBQTs7VUFFQSxPQUFBOztRQUVBLFNBQUEsSUFBQSxPQUFBLEtBQUE7VUFDQSxPQUFBLFlBQUEsSUFBQSxPQUFBLElBQUE7Ozs7OztBQ2pDQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsZ0JBQUEsUUFBQSwrQkFBQSxTQUFBLFVBQUE7O0VBRUEsT0FBQTtHQUNBLGNBQUEsU0FBQSxVQUFBLE9BQUE7O0lBRUEsSUFBQSxVQUFBO0tBQ0EsYUFBQSxxQkFBQSxXQUFBLE1BQUEsV0FBQTs7O0lBR0EsSUFBQSxPQUFBO0tBQ0EsUUFBQSxRQUFBLE9BQUE7OztJQUdBLE9BQUEsVUFBQSxLQUFBOzs7R0FHQSxNQUFBLFVBQUE7SUFDQSxPQUFBLFVBQUE7OztHQUdBLE9BQUEsU0FBQSxPQUFBLFFBQUE7SUFDQSxVQUFBO0tBQ0EsVUFBQTtPQUNBLE1BQUE7T0FDQSxRQUFBO09BQ0EsR0FBQTs7OztHQUlBLFNBQUEsU0FBQSxPQUFBLFNBQUE7SUFDQSxPQUFBLFVBQUE7S0FDQSxVQUFBO09BQ0EsTUFBQTtPQUNBLFFBQUE7T0FDQSxHQUFBO09BQ0EsT0FBQTs7Ozs7O0FDdENBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxnQkFBQSxRQUFBLGdCQUFBLFVBQUE7UUFDQSxJQUFBLFdBQUE7VUFDQSxTQUFBO1VBQ0EsU0FBQTtVQUNBLFVBQUE7VUFDQSxhQUFBO1VBQ0EsU0FBQTtVQUNBLFFBQUE7VUFDQSxPQUFBO1VBQ0EsVUFBQTtVQUNBLE9BQUE7VUFDQSxRQUFBOzs7UUFHQSxPQUFBO1VBQ0EsWUFBQSxTQUFBLEtBQUE7WUFDQSxPQUFBLFNBQUE7O1VBRUEsUUFBQSxVQUFBO1lBQ0EsT0FBQTs7Ozs7OztBQ3RCQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsZ0JBQUEsUUFBQSwyQ0FBQSxTQUFBLGFBQUEsT0FBQTs7UUFFQSxJQUFBLGNBQUE7WUFDQSxNQUFBO1lBQ0EsUUFBQTtZQUNBLFdBQUE7WUFDQSxLQUFBO2NBQ0EsV0FBQTtjQUNBLGNBQUE7Y0FDQSxXQUFBO2NBQ0EsTUFBQTs7WUFFQSxXQUFBO1lBQ0EsU0FBQTtXQUNBLFNBQUEsYUFBQTs7UUFFQSxJQUFBLENBQUEsYUFBQSxJQUFBLGVBQUE7VUFDQSxjQUFBLGFBQUEsY0FBQTtZQUNBLG9CQUFBLEtBQUEsS0FBQTtZQUNBLGdCQUFBO1lBQ0EsYUFBQTs7VUFFQSxjQUFBLFlBQUEsSUFBQTs7WUFFQTtVQUNBLGNBQUEsYUFBQSxJQUFBO1VBQ0EsVUFBQSxZQUFBLElBQUE7O1FBRUEsT0FBQTtVQUNBLE1BQUEsVUFBQTtZQUNBLE9BQUEsR0FBQTtZQUNBLEdBQUEsYUFBQSxJQUFBLGNBQUE7Z0JBQ0EsWUFBQSxPQUFBOztZQUVBLE9BQUEsYUFBQTtnQkFDQSxNQUFBO2dCQUNBLFFBQUE7Z0JBQ0EsV0FBQTtnQkFDQSxLQUFBO2tCQUNBLFdBQUE7a0JBQ0EsY0FBQTtrQkFDQSxXQUFBOztnQkFFQSxTQUFBO2dCQUNBLFdBQUE7OztVQUdBLFFBQUEsU0FBQSxLQUFBO1lBQ0EsT0FBQSxZQUFBLEtBQUEsS0FBQTs7VUFFQSxjQUFBLFNBQUEsS0FBQTtZQUNBLE9BQUEsWUFBQSxXQUFBLEtBQUE7O1VBRUEsYUFBQSxTQUFBLEtBQUE7WUFDQSxPQUFBLFlBQUEsU0FBQSxLQUFBOztVQUVBLGFBQUEsU0FBQSxNQUFBO1lBQ0EsT0FBQSxZQUFBLFdBQUEsS0FBQTs7VUFFQSxnQkFBQSxTQUFBLEtBQUE7WUFDQSxJQUFBLFFBQUEsWUFBQSxTQUFBLFFBQUE7WUFDQSxPQUFBLFFBQUEsQ0FBQSxJQUFBLFlBQUEsU0FBQSxPQUFBLE9BQUEsS0FBQTs7VUFFQSxTQUFBLFNBQUEsS0FBQTtZQUNBLE9BQUEsWUFBQSxPQUFBOztVQUVBLGFBQUEsU0FBQSxJQUFBO1lBQ0EsT0FBQSxZQUFBLEtBQUEsWUFBQTs7VUFFQSxpQkFBQSxTQUFBLElBQUE7WUFDQSxPQUFBLFlBQUEsS0FBQSxnQkFBQTs7VUFFQSxXQUFBLFNBQUEsT0FBQTtZQUNBLE9BQUEsWUFBQSxTQUFBOztVQUVBLG1CQUFBLFVBQUE7O1lBRUEsWUFBQSxJQUFBLGVBQUE7O1VBRUEsY0FBQSxTQUFBLEtBQUEsS0FBQTtZQUNBLE9BQUEsWUFBQSxXQUFBLE9BQUE7O1VBRUEsd0JBQUEsU0FBQSxLQUFBO1lBQ0EsT0FBQSxZQUFBLFlBQUEsV0FBQSxLQUFBLGVBQUE7O1VBRUEscUJBQUEsVUFBQTtZQUNBLE9BQUEsY0FBQSxZQUFBLElBQUE7O1VBRUEsYUFBQSxVQUFBO1lBQ0EsT0FBQTs7VUFFQSxTQUFBLFVBQUE7WUFDQSxHQUFBLE9BQUEsZUFBQSxhQUFBLE9BQUE7WUFDQSxPQUFBLFlBQUE7O1VBRUEsU0FBQSxVQUFBO1lBQ0EsR0FBQSxPQUFBLGVBQUEsYUFBQSxPQUFBO1lBQ0EsT0FBQSxZQUFBOztVQUVBLGFBQUEsVUFBQTtZQUNBLE9BQUEsWUFBQTs7VUFFQSxhQUFBLFVBQUE7WUFDQSxPQUFBLFlBQUEsS0FBQTs7VUFFQSxpQkFBQSxVQUFBO1lBQ0EsT0FBQSxZQUFBLEtBQUE7O1VBRUEsV0FBQSxVQUFBO1lBQ0EsR0FBQSxPQUFBLGVBQUEsYUFBQSxPQUFBO1lBQ0EsT0FBQSxZQUFBOztVQUVBLGNBQUEsVUFBQTtZQUNBLEdBQUEsT0FBQSxlQUFBLGFBQUEsT0FBQTtZQUNBLE9BQUEsWUFBQTs7VUFFQSxlQUFBLFVBQUE7WUFDQSxPQUFBLFlBQUEsS0FBQTs7VUFFQSxhQUFBLFVBQUE7WUFDQSxPQUFBLFlBQUEsS0FBQTs7VUFFQSxjQUFBLFNBQUEsSUFBQTtZQUNBLE9BQUEsWUFBQSxZQUFBLFdBQUE7O1VBRUEsZUFBQSxVQUFBO1lBQ0EsR0FBQSxPQUFBLGVBQUEsYUFBQSxPQUFBO1lBQ0EsT0FBQSxZQUFBOztVQUVBLGlCQUFBLFVBQUE7WUFDQSxPQUFBOztVQUVBLGVBQUEsVUFBQTtZQUNBLE9BQUEsWUFBQSxXQUFBLE9BQUEsRUFBQTs7VUFFQSxZQUFBLFVBQUE7WUFDQSxPQUFBLFlBQUEsT0FBQSxPQUFBLEVBQUE7O1VBRUEsZUFBQSxVQUFBO1lBQ0EsT0FBQSxZQUFBLFdBQUE7Ozs7Ozs7QUM5SUEsQ0FBQSxZQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGdCQUFBLFFBQUEsa0NBQUEsVUFBQSxhQUFBOztFQUVBLE9BQUE7R0FDQSxPQUFBO0lBQ0EsTUFBQTtLQUNBLE1BQUE7S0FDQSxXQUFBOztJQUVBLFVBQUE7S0FDQSxNQUFBO0tBQ0EsVUFBQTs7O0dBR0EsV0FBQSxTQUFBLE9BQUE7SUFDQSxLQUFBLE1BQUEsU0FBQSxPQUFBLFlBQUEsT0FBQSxXQUFBLFFBQUE7SUFDQSxLQUFBLE1BQUEsU0FBQSxZQUFBLFlBQUEsT0FBQSxXQUFBLFFBQUE7SUFDQSxLQUFBLE1BQUEsS0FBQSxPQUFBLEtBQUEsTUFBQSxTQUFBLEtBQUE7SUFDQSxLQUFBLE1BQUEsS0FBQSxZQUFBLEtBQUEsTUFBQSxTQUFBLFVBQUE7SUFDQSxPQUFBLEtBQUE7O0dBRUEsU0FBQSxZQUFBO0lBQ0EsT0FBQSxLQUFBLE1BQUEsS0FBQTs7R0FFQSxjQUFBLFlBQUE7SUFDQSxPQUFBLEtBQUEsTUFBQSxLQUFBOztHQUVBLGdCQUFBLFlBQUE7SUFDQSxPQUFBLEtBQUEsTUFBQSxTQUFBOztHQUVBLHFCQUFBLFlBQUE7SUFDQSxPQUFBLEtBQUEsTUFBQSxTQUFBOzs7Ozs7O0FDakNBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxnQkFBQSxRQUFBLDZCQUFBLFNBQUEsU0FBQTs7RUFFQSxJQUFBLFFBQUE7R0FDQSxXQUFBO0dBQ0EsU0FBQTs7RUFFQSxPQUFBO0dBQ0EsTUFBQSxTQUFBLFFBQUE7SUFDQSxJQUFBLENBQUEsUUFBQTtLQUNBLE9BQUE7OztJQUdBLE9BQUEsU0FBQTtLQUNBLFNBQUE7T0FDQSxRQUFBO09BQ0EsU0FBQTtPQUNBLE9BQUE7T0FDQSxVQUFBOzs7R0FHQSxPQUFBLFNBQUEsUUFBQTtJQUNBLElBQUEsQ0FBQSxRQUFBO0tBQ0EsT0FBQTs7O0lBR0EsT0FBQSxTQUFBO0tBQ0EsU0FBQTtPQUNBLFFBQUE7T0FDQSxTQUFBO09BQ0EsTUFBQTtPQUNBLE9BQUE7T0FDQSxVQUFBOzs7Ozs7QUNsQ0EsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLGdCQUFBLFFBQUEsK0JBQUEsU0FBQSxZQUFBOzs7UUFHQSxPQUFBO1VBQ0EsS0FBQTtZQUNBLE1BQUE7O1VBRUEsUUFBQSxVQUFBO1lBQ0EsT0FBQSxLQUFBLEtBQUEsT0FBQSxZQUFBLE9BQUEsV0FBQTs7VUFFQSxXQUFBLFVBQUE7OztVQUdBLFdBQUEsVUFBQTs7Ozs7Ozs7QUNoQkEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsNkZBQUEsU0FBQSxPQUFBLFFBQUEsU0FBQSxRQUFBLGVBQUEsYUFBQTs7O1FBR0EsSUFBQSxLQUFBO1FBQ0EsR0FBQSxPQUFBLGFBQUE7UUFDQSxHQUFBLE9BQUEsYUFBQTtRQUNBLEdBQUEsU0FBQSxhQUFBO1FBQ0EsR0FBQSxXQUFBOztRQUVBLEdBQUEsYUFBQTtRQUNBLEdBQUEsaUJBQUE7UUFDQSxHQUFBLGVBQUE7UUFDQSxHQUFBLGdCQUFBO1FBQ0EsR0FBQSxxQkFBQTtRQUNBLEdBQUEsaUJBQUE7O1FBRUEsR0FBQSxzQkFBQTs7UUFFQSxHQUFBLFVBQUE7O1FBRUEsR0FBQSxRQUFBO1VBQ0EsUUFBQTtVQUNBLE9BQUE7VUFDQSxPQUFBO1VBQ0EsTUFBQTs7O1FBR0E7O1FBRUEsU0FBQSxVQUFBO1VBQ0E7OztRQUdBLFNBQUEsV0FBQTtVQUNBLEdBQUEsQ0FBQSxHQUFBLEtBQUE7WUFDQSxPQUFBLEdBQUE7Ozs7UUFJQSxTQUFBLE9BQUEsV0FBQTtVQUNBLEdBQUEsU0FBQTtTQUNBO1FBQ0EsU0FBQSxjQUFBLE9BQUE7VUFDQSxPQUFBLEdBQUEsT0FBQSxRQUFBLFdBQUEsR0FBQSxNQUFBLENBQUEsUUFBQTtTQUNBO1FBQ0EsU0FBQSxtQkFBQSxNQUFBLE9BQUE7OztTQUdBO1FBQ0EsU0FBQSxlQUFBLEtBQUE7VUFDQSxPQUFBLEtBQUEsT0FBQSxTQUFBLElBQUEsV0FBQTs7Ozs7OztRQU9BLFNBQUEsYUFBQSxHQUFBLElBQUE7VUFDQSxRQUFBLFFBQUEsR0FBQSxNQUFBLFNBQUEsTUFBQSxFQUFBO1lBQ0EsUUFBQSxRQUFBLEtBQUEsS0FBQSxJQUFBLFNBQUEsT0FBQSxFQUFBO2NBQ0EsR0FBQSxLQUFBLElBQUE7Z0JBQ0EsT0FBQSxHQUFBLEtBQUEsR0FBQSxLQUFBLEdBQUE7Ozs7VUFJQSxPQUFBOztRQUVBLFNBQUEsZ0JBQUE7VUFDQSxRQUFBLFFBQUEsR0FBQSxVQUFBLFNBQUEsTUFBQSxJQUFBO1lBQ0EsUUFBQSxRQUFBLEtBQUEsUUFBQSxTQUFBLE9BQUEsRUFBQTtjQUNBLEdBQUEsTUFBQSxRQUFBLEtBQUEsTUFBQSxRQUFBLEVBQUE7Z0JBQ0EsR0FBQTtnQkFDQSxhQUFBOztjQUVBLEdBQUE7Y0FDQSxhQUFBOztZQUVBLEdBQUEsS0FBQSxPQUFBLEdBQUEsS0FBQSxRQUFBLE9BQUE7O1VBRUEsR0FBQSxXQUFBO1VBQ0EsR0FBQSxHQUFBLEtBQUEsVUFBQSxFQUFBO1lBQ0EsR0FBQTtZQUNBLE9BQUEsR0FBQTs7O1FBR0EsU0FBQSxTQUFBO1VBQ0EsR0FBQSxNQUFBLEdBQUEsU0FBQTtVQUNBLGNBQUEsYUFBQSxXQUFBOztRQUVBLFNBQUEsWUFBQTtVQUNBLEdBQUEsT0FBQTs7Ozs7OztBQzdGQSxDQUFBLFdBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSx3R0FBQSxTQUFBLFFBQUEsUUFBQSxjQUFBLGFBQUEsZUFBQSxRQUFBO0VBQ0EsSUFBQSxLQUFBO0VBQ0EsR0FBQSxPQUFBLGFBQUE7RUFDQSxHQUFBLE9BQUEsYUFBQTtFQUNBLEdBQUEsU0FBQSxhQUFBO0VBQ0EsR0FBQSxhQUFBLGFBQUE7RUFDQSxHQUFBLGNBQUE7RUFDQSxHQUFBLFdBQUE7O0VBRUE7O0VBRUEsU0FBQSxXQUFBO0dBQ0EsR0FBQSxTQUFBLFlBQUEsT0FBQTtHQUNBOzs7RUFHQSxTQUFBLGNBQUE7R0FDQSxHQUFBLG1CQUFBO0dBQ0EsSUFBQSxHQUFBLEtBQUEsUUFBQTtJQUNBLEdBQUEsT0FBQSxLQUFBLFNBQUEsU0FBQTtLQUNBLFFBQUEsUUFBQSxTQUFBLFNBQUEsT0FBQTtNQUNBLElBQUEsUUFBQTtNQUNBLFFBQUEsUUFBQSxHQUFBLEtBQUEsR0FBQSxLQUFBLFFBQUEsU0FBQSxPQUFBO09BQ0EsSUFBQSxVQUFBLEtBQUEsTUFBQSxNQUFBO09BQ0EsUUFBQSxRQUFBLFNBQUEsU0FBQSxRQUFBO1FBQ0EsSUFBQSxPQUFBLFVBQUEsT0FBQTtTQUNBOzs7O01BSUEsSUFBQSxTQUFBLEdBQUEsS0FBQSxHQUFBLEtBQUEsT0FBQSxTQUFBLEdBQUE7T0FDQSxHQUFBLGlCQUFBLEtBQUE7OztLQUdBLElBQUEsR0FBQSxpQkFBQSxRQUFBO01BQ0EsY0FBQSxhQUFBLGNBQUE7Ozs7OztFQU1BLFNBQUEsY0FBQTtHQUNBLFFBQUEsUUFBQSxHQUFBLE1BQUEsU0FBQSxLQUFBLEtBQUE7SUFDQSxRQUFBLFFBQUEsSUFBQSxLQUFBLElBQUEsU0FBQSxNQUFBLEdBQUE7S0FDQSxJQUFBLE1BQUEsU0FBQSxPQUFBLEdBQUE7TUFDQSxrREFBQSxPQUFBLEtBQUEsS0FBQSxXQUFBLGNBQUEsUUFBQSxTQUFBLENBQUEsR0FBQTtPQUNBLEdBQUEsS0FBQSxLQUFBLEtBQUEsR0FBQSxLQUFBO09BQ0EsSUFBQSxPQUFBLE9BQUEsR0FBQTtPQUNBLEdBQUEsT0FBQSxPQUFBLEdBQUE7Ozs7SUFJQSxJQUFBLENBQUEsSUFBQSxLQUFBLEdBQUEsR0FBQSxLQUFBLFlBQUE7S0FDQSxJQUFBLFFBQUE7TUFDQSxNQUFBO01BQ0EsU0FBQTtNQUNBLE9BQUEsSUFBQSxLQUFBLEdBQUEsR0FBQSxLQUFBO01BQ0EsUUFBQSxHQUFBLEtBQUE7TUFDQSxLQUFBOztLQUVBLElBQUEsYUFBQTtLQUNBLFFBQUEsUUFBQSxJQUFBLFFBQUEsU0FBQSxPQUFBLEtBQUE7TUFDQSxJQUFBLE1BQUEsUUFBQSxHQUFBO09BQ0EsYUFBQTs7O0tBR0EsSUFBQSxDQUFBLFlBQUE7TUFDQSxJQUFBLE9BQUEsS0FBQTtNQUNBLEdBQUEsV0FBQSxLQUFBOzs7Ozs7RUFNQSxTQUFBLFdBQUE7R0FDQSxJQUFBLENBQUEsR0FBQSxLQUFBLFdBQUE7SUFDQSxPQUFBLE1BQUEsMENBQUE7SUFDQSxPQUFBOztHQUVBLElBQUEsQ0FBQSxHQUFBLEtBQUEsZUFBQTtJQUNBLE9BQUEsTUFBQSw4Q0FBQTtJQUNBLE9BQUE7O0dBRUEsSUFBQSxHQUFBLEtBQUEsaUJBQUEsR0FBQSxLQUFBLFdBQUE7SUFDQSxPQUFBLE1BQUEsbURBQUE7SUFDQSxPQUFBOzs7R0FHQSxHQUFBLFdBQUE7R0FDQSxJQUFBLFVBQUE7R0FDQSxJQUFBLFdBQUE7R0FDQSxJQUFBLFVBQUE7R0FDQSxRQUFBLFFBQUEsR0FBQSxNQUFBLFNBQUEsTUFBQSxLQUFBO0lBQ0EsSUFBQSxLQUFBLEtBQUEsR0FBQSxHQUFBLEtBQUEsWUFBQTtLQUNBLFlBQUEsS0FBQSxLQUFBLEdBQUEsR0FBQSxLQUFBLFdBQUEsVUFBQSxJQUFBLElBQUE7O0lBRUEsUUFBQSxLQUFBLEtBQUEsR0FBQSxHQUFBLEtBQUE7S0FDQSxLQUFBO01BQ0EsS0FBQSxLQUFBLEdBQUEsR0FBQSxLQUFBLGlCQUFBO01BQ0E7S0FDQSxLQUFBO01BQ0EsS0FBQSxLQUFBLEdBQUEsR0FBQSxLQUFBLGlCQUFBO01BQ0E7S0FDQSxLQUFBO01BQ0EsS0FBQSxLQUFBLEdBQUEsR0FBQSxLQUFBLGlCQUFBO01BQ0E7S0FDQSxLQUFBO01BQ0EsS0FBQSxLQUFBLEdBQUEsR0FBQSxLQUFBLGlCQUFBO01BQ0E7S0FDQTtNQUNBOztJQUVBLFFBQUEsS0FBQTtLQUNBLEtBQUEsS0FBQSxLQUFBLEdBQUEsR0FBQSxLQUFBO0tBQ0EsTUFBQSxLQUFBLEtBQUEsR0FBQSxHQUFBLEtBQUE7OztHQUdBLElBQUEsVUFBQSxhQUFBLFFBQUEsU0FBQSxLQUFBLGVBQUE7R0FDQSxhQUFBO0dBQ0EsWUFBQSxLQUFBLHdCQUFBO0lBQ0EsTUFBQTtJQUNBLEtBQUE7TUFDQSxLQUFBLFNBQUEsVUFBQTtJQUNBLFFBQUEsUUFBQSxVQUFBLFNBQUEsU0FBQSxLQUFBO0tBQ0EsUUFBQSxRQUFBLEdBQUEsTUFBQSxTQUFBLE1BQUEsR0FBQTtNQUNBLElBQUEsUUFBQSxRQUFBLEtBQUEsS0FBQSxHQUFBLEdBQUEsS0FBQSxnQkFBQTtPQUNBLElBQUEsUUFBQSxLQUFBLFNBQUEsR0FBQTtRQUNBLElBQUEsV0FBQTtTQUNBLE9BQUE7U0FDQSxTQUFBLFFBQUE7O1FBRUEsYUFBQSxZQUFBO2NBQ0E7UUFDQSxJQUFBLE9BQUEsUUFBQSxLQUFBLE1BQUEsYUFBQTtTQUNBLEdBQUEsS0FBQSxHQUFBLEtBQUEsR0FBQSxHQUFBLEtBQUEsYUFBQSxRQUFBLEtBQUEsR0FBQTtTQUNBLEdBQUEsS0FBQSxHQUFBLEtBQUEsR0FBQSxHQUFBLEtBQUEsaUJBQUEsUUFBQSxLQUFBLEdBQUE7U0FDQSxJQUFBLEtBQUEsT0FBQSxRQUFBO1VBQ0EsUUFBQSxRQUFBLEtBQUEsUUFBQSxTQUFBLE9BQUEsR0FBQTtXQUNBLElBQUEsTUFBQSxRQUFBLEtBQUEsTUFBQSxRQUFBLEdBQUE7WUFDQSxHQUFBLFdBQUEsT0FBQSxHQUFBO1lBQ0EsS0FBQSxPQUFBLE9BQUEsR0FBQTtrQkFDQSxJQUFBLE1BQUEsUUFBQSxHQUFBO1lBQ0EsSUFBQSxNQUFBLFVBQUEsR0FBQSxLQUFBLFdBQUE7YUFDQSxHQUFBLE9BQUEsT0FBQSxHQUFBO2FBQ0EsS0FBQSxPQUFBLE9BQUEsR0FBQTs7Ozs7O2VBTUE7U0FDQSxRQUFBLElBQUEsR0FBQSxLQUFBO1NBQ0EsSUFBQSxRQUFBO1VBQ0EsTUFBQTtVQUNBLFNBQUE7VUFDQSxRQUFBLEdBQUEsS0FBQTs7U0FFQSxJQUFBLGFBQUE7U0FDQSxRQUFBLFFBQUEsR0FBQSxLQUFBLEdBQUEsUUFBQSxTQUFBLE9BQUEsR0FBQTtVQUNBLFFBQUEsSUFBQTtVQUNBLElBQUEsTUFBQSxRQUFBLEdBQUE7V0FDQSxhQUFBOzs7U0FHQSxJQUFBLENBQUEsWUFBQTtVQUNBLGFBQUEsWUFBQTtVQUNBLEtBQUEsT0FBQSxLQUFBOzs7Ozs7O0lBT0EsR0FBQSxjQUFBO0lBQ0EsSUFBQSxhQUFBLGNBQUEsUUFBQTtLQUNBLGNBQUEsYUFBQTs7TUFFQSxTQUFBLFVBQUE7SUFDQSxPQUFBLE1BQUEsc0NBQUEsU0FBQSxLQUFBOzs7O0VBSUEsR0FBQSxhQUFBOztFQUVBLFNBQUEsYUFBQTtHQUNBLElBQUEsYUFBQTtJQUNBLE1BQUE7O0dBRUEsSUFBQSxPQUFBO0lBQ0EsU0FBQTtHQUNBLFFBQUEsUUFBQSxHQUFBLE1BQUEsU0FBQSxNQUFBLEtBQUE7SUFDQSxJQUFBLEtBQUEsT0FBQSxVQUFBLEdBQUE7S0FDQSxLQUFBLEtBQUEsR0FBQSxPQUFBLEdBQUEsS0FBQTtLQUNBLFdBQUEsS0FBQSxLQUFBLEtBQUEsS0FBQTtXQUNBO0tBQ0EsT0FBQSxNQUFBLCtCQUFBO0tBQ0E7OztHQUdBLFFBQUEsSUFBQTtHQUNBLFlBQUEsS0FBQSxpQkFBQSxHQUFBLFVBQUEsYUFBQSxXQUFBLFlBQUEsS0FBQSxTQUFBLEtBQUE7SUFDQSxJQUFBLE9BQUEsTUFBQTtLQUNBLE9BQUEsUUFBQSxXQUFBLEtBQUEsU0FBQSx3QkFBQSxHQUFBLEtBQUEsTUFBQTtLQUNBLEdBQUEsT0FBQSxhQUFBO0tBQ0EsT0FBQSxHQUFBOzs7Ozs7O0FDL01BLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLDRCQUFBLFNBQUEsWUFBQTtRQUNBLElBQUEsS0FBQTtRQUNBLFlBQUEsT0FBQSxTQUFBLEtBQUEsU0FBQSxTQUFBO1VBQ0EsR0FBQSxVQUFBOzs7Ozs7O0FDTkEsQ0FBQSxZQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsK0JBQUEsVUFBQSxXQUFBO0VBQ0EsS0FBQSxXQUFBO0dBQ0EsYUFBQTtHQUNBLFdBQUE7R0FDQSx5QkFBQTtHQUNBLGtCQUFBOzs7RUFHQSxLQUFBLGVBQUEsVUFBQSxNQUFBLElBQUE7R0FDQSxVQUFBLEtBQUEsVUFBQTtLQUNBLE1BQUE7S0FDQSxRQUFBLHdCQUFBLE9BQUE7S0FDQSxHQUFBO0tBQ0EsWUFBQTs7OztJQUlBLEtBQUEsZ0JBQUEsV0FBQTtHQUNBLFVBQUEsS0FBQTs7S0FFQSxhQUFBO1NBQ0Esa0JBQUE7O0tBRUEsS0FBQSxVQUFBLFFBQUE7O09BRUEsWUFBQTs7Ozs7Ozs7O0FDNUJBLENBQUEsWUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLDJLQUFBLFVBQUEsUUFBQSxTQUFBLFdBQUEsU0FBQSxRQUFBLFVBQUEsY0FBQSxvQkFBQSxNQUFBLFdBQUEsYUFBQSxhQUFBOztFQUVBLElBQUEsS0FBQTtFQUNBLEdBQUEsTUFBQTs7RUFFQSxHQUFBLGFBQUEsS0FBQSxTQUFBO0VBQ0EsR0FBQSxrQkFBQSxLQUFBLFNBQUE7RUFDQSxHQUFBLGNBQUE7O0VBRUEsR0FBQSxZQUFBO0VBQ0EsR0FBQSxhQUFBLG1CQUFBO0VBQ0EsR0FBQSxrQkFBQSxtQkFBQTtFQUNBLEdBQUEsc0JBQUEsR0FBQSxnQkFBQTtFQUNBLEdBQUEsWUFBQSxtQkFBQSxLQUFBO0VBQ0EsR0FBQSxhQUFBO0VBQ0EsR0FBQSxjQUFBO0VBQ0EsR0FBQSxVQUFBO0VBQ0EsR0FBQSxhQUFBO0VBQ0EsR0FBQSxlQUFBO0VBQ0EsR0FBQSxZQUFBO0VBQ0EsR0FBQSxPQUFBO0VBQ0EsR0FBQSxZQUFBO0VBQ0EsR0FBQSxVQUFBO0dBQ0EsUUFBQTtHQUNBLFdBQUE7O0VBRUEsR0FBQSxVQUFBO0dBQ0EsYUFBQTs7OztFQUlBLEdBQUEsaUJBQUE7RUFDQSxHQUFBLFNBQUE7RUFDQSxHQUFBLFdBQUE7RUFDQSxHQUFBLGFBQUE7RUFDQSxHQUFBLHFCQUFBO0VBQ0EsR0FBQSxVQUFBO0VBQ0EsR0FBQSxZQUFBO0VBQ0EsR0FBQSxjQUFBOztFQUVBLEdBQUEsa0JBQUE7RUFDQSxHQUFBLGFBQUE7RUFDQSxHQUFBLGFBQUE7RUFDQSxHQUFBLGdCQUFBO0VBQ0EsR0FBQSxtQkFBQTtFQUNBLEdBQUEscUJBQUE7RUFDQSxHQUFBLGlCQUFBO0VBQ0EsR0FBQSxTQUFBOztFQUVBLEdBQUEsV0FBQTs7RUFFQTs7RUFFQSxTQUFBLFdBQUE7O0dBRUEsR0FBQSxnQkFBQSxLQUFBLFNBQUEsVUFBQTtJQUNBLEdBQUEsV0FBQSxLQUFBLFNBQUEsS0FBQTtLQUNBLEdBQUEsT0FBQTtLQUNBLEdBQUEsWUFBQTtLQUNBLEdBQUEsQ0FBQSxHQUFBLFVBQUEsTUFBQTtNQUNBLEdBQUEsVUFBQSxRQUFBO09BQ0EsT0FBQTtPQUNBLFFBQUE7T0FDQSxhQUFBOzs7S0FHQSxhQUFBLEdBQUEsVUFBQSxNQUFBO0tBQ0E7S0FDQSxHQUFBLE9BQUEsT0FBQSxLQUFBO01BQ0EsR0FBQSxTQUFBLE9BQUEsT0FBQTtNQUNBOztLQUVBLEdBQUEsT0FBQSxPQUFBLFVBQUE7TUFDQSxHQUFBLE9BQUE7TUFDQSxHQUFBLFFBQUEsVUFBQSxLQUFBLEdBQUE7TUFDQSxHQUFBLFFBQUEsU0FBQTtNQUNBLFdBQUEsU0FBQTtNQUNBLElBQUEsWUFBQSxPQUFBLE9BQUEsVUFBQSxNQUFBO01BQ0EsUUFBQSxRQUFBLFdBQUEsU0FBQSxJQUFBO09BQ0EsR0FBQSxRQUFBLFVBQUEsS0FBQSxlQUFBOzs7TUFHQSxVQUFBLEtBQUEsR0FBQSxRQUFBO01BQ0EsWUFBQSxPQUFBLGtCQUFBLFdBQUEsS0FBQSxVQUFBLE1BQUE7T0FDQSxHQUFBLE9BQUE7Ozs7Ozs7O0VBUUEsU0FBQSxRQUFBO0dBQ0EsUUFBQSxRQUFBOztFQUVBLFNBQUEsZUFBQSxTQUFBO0dBQ0EsSUFBQSxXQUFBLE1BQUEsR0FBQSxjQUFBLElBQUE7SUFDQSxHQUFBLGFBQUE7VUFDQTtJQUNBLEdBQUEsYUFBQTs7R0FFQSxHQUFBLGVBQUEsR0FBQSxhQUFBLGtCQUFBO0dBQ0E7RUFDQSxTQUFBLFNBQUEsTUFBQTtHQUNBLEdBQUEsV0FBQSxlQUFBO0dBQ0EsZ0JBQUE7R0FDQTs7RUFFQSxTQUFBLGFBQUE7R0FDQSxHQUFBLFlBQUEsQ0FBQSxHQUFBO0dBQ0EsR0FBQSxZQUFBLEdBQUEsYUFBQSxPQUFBLGlCQUFBOztFQUVBLFNBQUEsV0FBQSxLQUFBO0dBQ0EsR0FBQSxVQUFBO0dBQ0EsR0FBQTtHQUNBOztFQUVBLFNBQUEsbUJBQUEsS0FBQTtHQUNBLElBQUEsR0FBQSxXQUFBO0lBQ0EsU0FBQSxZQUFBO0tBQ0EsR0FBQSxVQUFBLE9BQUEsR0FBQSxxQkFBQSxTQUFBLEdBQUEsUUFBQSxLQUFBLFdBQUE7OztHQUdBO0VBQ0EsU0FBQSxXQUFBO0dBQ0EsR0FBQSxDQUFBLEdBQUEsUUFBQTtJQUNBOztHQUVBLElBQUEsT0FBQTtHQUNBLFFBQUEsUUFBQSxHQUFBLE1BQUEsU0FBQSxNQUFBO0lBQ0EsS0FBQSxHQUFBLFVBQUEsUUFBQSxXQUFBLEtBQUEsR0FBQSxVQUFBO0lBQ0EsS0FBQSxXQUFBLFdBQUEsS0FBQSxHQUFBLFVBQUE7O0dBRUEsR0FBQSxPQUFBLFFBQUEsV0FBQSxHQUFBLE1BQUEsQ0FBQSxHQUFBLFVBQUEsT0FBQSxPQUFBO0dBQ0EsT0FBQSxHQUFBLEtBQUEsUUFBQSxHQUFBLFdBQUE7R0FDQSxHQUFBLFFBQUEsR0FBQSxVQUFBLEtBQUEsV0FBQTtHQUNBLEdBQUEsZ0JBQUE7S0FDQSxNQUFBLEdBQUEsVUFBQSxNQUFBLGNBQUE7S0FDQSxNQUFBLEdBQUEsVUFBQSxLQUFBOztHQUVBLE9BQUE7O0VBRUEsU0FBQSxRQUFBLFFBQUE7O0dBRUEsSUFBQSxPQUFBLEdBQUEsS0FBQSxRQUFBLFdBQUE7R0FDQSxPQUFBOztFQUVBLFNBQUEsYUFBQTtHQUNBLEdBQUEsT0FBQSxDQUFBLEdBQUE7R0FDQTs7RUFFQSxTQUFBLGdCQUFBO0dBQ0EsT0FBQSxHQUFBLFVBQUEsQ0FBQSxHQUFBO0dBQ0E7RUFDQSxTQUFBLGdCQUFBLElBQUE7R0FDQSxZQUFBLE9BQUEsU0FBQSxPQUFBLE9BQUEsT0FBQSxLQUFBLEtBQUEsVUFBQSxNQUFBO0lBQ0EsR0FBQSxRQUFBLE9BQUE7SUFDQSxlQUFBOzs7RUFHQSxTQUFBLGVBQUEsS0FBQTtHQUNBLEdBQUEsQ0FBQSxPQUFBLE9BQUEsVUFBQTtJQUNBLFlBQUEsT0FBQSxrQkFBQSxDQUFBLE1BQUEsS0FBQSxVQUFBLE1BQUE7S0FDQSxHQUFBLE9BQUE7Ozs7OztFQU1BLFNBQUEsZ0JBQUEsTUFBQTtHQUNBLElBQUEsUUFBQSxDQUFBLEdBQUEsUUFBQSxVQUFBLENBQUEsUUFBQSxHQUFBLFFBQUEsUUFBQTtJQUNBLEdBQUE7Ozs7RUFJQSxTQUFBLG1CQUFBO0dBQ0EsR0FBQSxRQUFBLFlBQUEsQ0FBQSxHQUFBO0dBQ0EsR0FBQSxRQUFBLFNBQUEsQ0FBQSxHQUFBLFFBQUE7R0FDQSxJQUFBLEdBQUEsUUFBQSxRQUFBO0lBQ0EsR0FBQSxPQUFBO0lBQ0EsV0FBQSxTQUFBO0lBQ0EsR0FBQSxVQUFBLFFBQUEsY0FBQTtJQUNBLEdBQUEsVUFBQSxTQUFBOztVQUVBO0lBQ0EsV0FBQSxTQUFBO0lBQ0EsUUFBQSxRQUFBLEdBQUEsVUFBQSxPQUFBLEdBQUEscUJBQUEsVUFBQSxVQUFBLFNBQUE7S0FDQSxRQUFBLFdBQUE7O0lBRUEsR0FBQSxVQUFBLE9BQUEsR0FBQSxxQkFBQSxTQUFBLEdBQUEsUUFBQSxLQUFBLFdBQUE7SUFDQSxHQUFBLFVBQUEsUUFBQSxjQUFBO0lBQ0EsR0FBQSxVQUFBLFNBQUE7SUFDQSxZQUFBLE9BQUEsa0JBQUEsQ0FBQSxHQUFBLFFBQUEsTUFBQSxLQUFBLFVBQUEsTUFBQTtLQUNBLEdBQUEsT0FBQTs7SUFFQSxPQUFBLEdBQUEsMEJBQUE7S0FDQSxNQUFBLE9BQUEsT0FBQTtLQUNBLEtBQUEsT0FBQSxPQUFBOzs7O0dBSUE7O0VBRUEsU0FBQSxtQkFBQSxTQUFBO0dBQ0EsSUFBQSxRQUFBO0dBQ0EsUUFBQSxRQUFBLEdBQUEsUUFBQSxXQUFBLFVBQUEsS0FBQSxLQUFBO0lBQ0EsSUFBQSxXQUFBLE9BQUEsT0FBQSxHQUFBLFNBQUE7S0FDQSxHQUFBLFFBQUEsVUFBQSxPQUFBLEtBQUE7S0FDQSxRQUFBOzs7R0FHQSxJQUFBLENBQUEsT0FBQTtJQUNBLEdBQUEsUUFBQSxVQUFBLEtBQUE7SUFDQTtHQUNBLElBQUEsT0FBQTtHQUNBLElBQUEsVUFBQTtHQUNBLFFBQUEsUUFBQSxHQUFBLFFBQUEsV0FBQSxVQUFBLE1BQUEsS0FBQTtJQUNBLEtBQUEsS0FBQSxLQUFBO0lBQ0EsR0FBQSxLQUFBLEdBQUEsVUFBQSxRQUFBLEdBQUEsUUFBQSxJQUFBO0tBQ0EsUUFBQSxLQUFBLEtBQUE7OztHQUdBLElBQUEsS0FBQSxTQUFBLEdBQUE7SUFDQSxZQUFBLE9BQUEsa0JBQUEsTUFBQSxLQUFBLFVBQUEsTUFBQTtLQUNBLEdBQUEsT0FBQTs7SUFFQSxPQUFBLEdBQUEsa0NBQUE7S0FDQSxPQUFBLE9BQUEsT0FBQTtLQUNBLE1BQUEsT0FBQSxPQUFBO0tBQ0EsVUFBQSxRQUFBLEtBQUE7Ozs7R0FJQSxPQUFBLENBQUE7R0FDQTs7RUFFQSxTQUFBLFlBQUE7R0FDQSxJQUFBLENBQUEsR0FBQSxTQUFBO0lBQ0EsT0FBQTs7O0dBR0EsT0FBQSxDQUFBLEdBQUEsUUFBQSxHQUFBLFdBQUEsS0FBQTtHQUNBOztFQUVBLFNBQUEsY0FBQTtHQUNBLElBQUEsQ0FBQSxHQUFBLFNBQUE7SUFDQSxPQUFBOztHQUVBLE9BQUEsR0FBQSxRQUFBLGlCQUFBLElBQUEsa0JBQUE7R0FDQTs7RUFFQSxTQUFBLE9BQUEsR0FBQTtHQUNBLEdBQUEsWUFBQTs7O0VBR0EsU0FBQSxVQUFBLE1BQUE7R0FDQSxJQUFBLFFBQUE7R0FDQSxRQUFBLFFBQUEsS0FBQSxVQUFBLFVBQUEsTUFBQTtJQUNBLElBQUEsS0FBQSxlQUFBLEdBQUEsUUFBQSxZQUFBLE1BQUE7S0FDQSxHQUFBLGFBQUE7O0lBRUEsVUFBQTs7R0FFQSxPQUFBOzs7RUFHQSxTQUFBLFdBQUE7R0FDQSxVQUFBLEdBQUE7R0FDQTs7RUFFQSxTQUFBLGdCQUFBLE1BQUE7R0FDQSxJQUFBLFNBQUE7R0FDQSxRQUFBLFFBQUEsR0FBQSxNQUFBLFVBQUEsS0FBQTtJQUNBLElBQUEsSUFBQSxXQUFBLE1BQUE7S0FDQSxTQUFBOzs7R0FHQSxPQUFBO0dBQ0E7O0VBRUEsU0FBQSxlQUFBLEtBQUE7R0FDQSxJQUFBLFNBQUE7R0FDQSxRQUFBLFFBQUEsR0FBQSxNQUFBLFVBQUEsS0FBQTtJQUNBLElBQUEsSUFBQSxPQUFBLEtBQUE7S0FDQSxTQUFBOzs7O0dBSUEsT0FBQTtHQUNBOztFQUVBLFNBQUEsYUFBQSxPQUFBOztHQUVBLEdBQUEsU0FBQSxTQUFBLGNBQUE7R0FDQSxHQUFBLE9BQUEsUUFBQTtHQUNBLEdBQUEsT0FBQSxTQUFBO0dBQ0EsR0FBQSxNQUFBLEdBQUEsT0FBQSxXQUFBO0dBQ0EsSUFBQSxXQUFBLEdBQUEsSUFBQSxxQkFBQSxHQUFBLEdBQUEsS0FBQTtHQUNBLFNBQUEsYUFBQSxHQUFBO0dBQ0EsU0FBQSxhQUFBLE1BQUEsVUFBQTtHQUNBLFNBQUEsYUFBQSxHQUFBO0dBQ0EsR0FBQSxJQUFBLFlBQUE7R0FDQSxHQUFBLElBQUEsU0FBQSxHQUFBLEdBQUEsS0FBQTtHQUNBLEdBQUEsVUFBQSxHQUFBLElBQUEsYUFBQSxHQUFBLEdBQUEsS0FBQSxHQUFBOzs7O0VBSUEsU0FBQSxhQUFBLE9BQUE7R0FDQSxJQUFBLFdBQUEsR0FBQSxJQUFBLHFCQUFBLEdBQUEsR0FBQSxLQUFBO0dBQ0EsU0FBQSxhQUFBLEdBQUE7R0FDQSxTQUFBLGFBQUEsTUFBQSxTQUFBO0dBQ0EsU0FBQSxhQUFBLEdBQUE7R0FDQSxHQUFBLElBQUEsWUFBQTtHQUNBLEdBQUEsSUFBQSxTQUFBLEdBQUEsR0FBQSxLQUFBO0dBQ0EsR0FBQSxVQUFBLEdBQUEsSUFBQSxhQUFBLEdBQUEsR0FBQSxLQUFBLEdBQUE7O0dBRUE7O0VBRUEsU0FBQSxjQUFBLFNBQUE7R0FDQSxJQUFBLFFBQUE7R0FDQSxJQUFBLE1BQUEsUUFBQSxXQUFBLEdBQUE7R0FDQSxJQUFBLFNBQUEsZUFBQTtHQUNBLElBQUEsUUFBQSxHQUFBLFVBQUEsUUFBQTs7O0dBR0EsSUFBQSxXQUFBLFNBQUEsTUFBQSxNQUFBLE9BQUEsVUFBQTs7R0FFQSxJQUFBLFFBQUEsVUFBQSxHQUFBLFFBQUEsWUFBQSxPQUFBLEdBQUEsUUFBQSxXQUFBLEtBQUEsT0FBQSxHQUFBLFFBQUEsV0FBQSxLQUFBLE1BQUEsR0FBQSxRQUFBLFdBQUEsS0FBQTtHQUNBLE1BQUEsUUFBQTtHQUNBLE1BQUEsVUFBQTtJQUNBLE9BQUE7SUFDQSxNQUFBOztHQUVBLE1BQUEsV0FBQTtJQUNBLE9BQUE7SUFDQSxTQUFBO0tBQ0EsT0FBQTtLQUNBLE1BQUE7OztHQUdBLE9BQUE7R0FDQTs7RUFFQSxTQUFBLGVBQUEsU0FBQTs7R0FFQSxJQUFBLFFBQUE7R0FDQSxJQUFBLE1BQUEsUUFBQSxXQUFBLEdBQUE7O0dBRUEsSUFBQSxTQUFBLGVBQUE7R0FDQSxJQUFBLFFBQUEsR0FBQSxVQUFBLFFBQUE7R0FDQSxJQUFBLE9BQUEsUUFBQTtHQUNBLEdBQUEsT0FBQSxHQUFBLFFBQUEsSUFBQTtLQUNBLFFBQUEsV0FBQTs7O0dBR0EsUUFBQTtHQUNBLEtBQUE7SUFDQSxJQUFBLE9BQUEsT0FBQSxVQUFBLGFBQUE7OztLQUdBLElBQUEsV0FBQSxTQUFBLE1BQUEsTUFBQSxTQUFBLE9BQUEsV0FBQTs7S0FFQSxJQUFBLFFBQUEsVUFBQSxHQUFBLFFBQUEsWUFBQSxPQUFBLEdBQUEsUUFBQSxXQUFBLEtBQUEsT0FBQSxHQUFBLFFBQUEsV0FBQSxLQUFBLE1BQUEsR0FBQSxRQUFBLFdBQUEsS0FBQTtLQUNBLE1BQUEsUUFBQSxVQUFBLEdBQUEsUUFBQSxZQUFBLE9BQUEsR0FBQSxRQUFBLFdBQUEsS0FBQSxPQUFBLEdBQUEsUUFBQSxXQUFBLEtBQUE7S0FDQSxNQUFBLFVBQUE7TUFDQSxPQUFBO01BQ0EsTUFBQTs7S0FFQSxNQUFBLFdBQUE7TUFDQSxPQUFBLFVBQUEsR0FBQSxRQUFBLFlBQUEsT0FBQSxHQUFBLFFBQUEsV0FBQSxLQUFBLE9BQUEsR0FBQSxRQUFBLFdBQUEsS0FBQTtNQUNBLFNBQUE7T0FDQSxPQUFBO09BQ0EsTUFBQTs7O0tBR0E7V0FDQTs7S0FFQSxNQUFBLFFBQUE7S0FDQSxNQUFBLFVBQUE7TUFDQSxPQUFBO01BQ0EsTUFBQTs7Ozs7R0FLQSxJQUFBLFFBQUEsTUFBQSxTQUFBLG1CQUFBLFVBQUEsU0FBQTtJQUNBLE1BQUEsY0FBQSxZQUFBO0tBQ0EsSUFBQSxRQUFBO01BQ0EsTUFBQSxRQUFBLFdBQUE7TUFDQSxVQUFBLENBQUEsS0FBQTtNQUNBLFVBQUE7O0tBRUEsT0FBQTs7O0dBR0EsT0FBQTtHQUNBOztFQUVBLE9BQUEsT0FBQSxjQUFBLFVBQUEsR0FBQSxHQUFBO0dBQ0EsSUFBQSxNQUFBLEdBQUE7SUFDQTs7O0dBR0EsR0FBQSxFQUFBLEtBQUE7SUFDQSxHQUFBLEVBQUEsSUFBQTtLQUNBLEdBQUEsVUFBQSxPQUFBLEdBQUEscUJBQUEsU0FBQSxFQUFBLEtBQUEsV0FBQTs7SUFFQTtJQUNBLGdCQUFBLEVBQUE7SUFDQSxHQUFBLFVBQUEsT0FBQSxHQUFBLHFCQUFBLFNBQUEsRUFBQSxLQUFBLFdBQUE7SUFDQSxHQUFBLE9BQUEsUUFBQSxRQUFBLDZCQUFBLE9BQUEsUUFBQSxRQUFBLGlCQUFBO0tBQ0EsT0FBQSxHQUFBLDJCQUFBO01BQ0EsT0FBQSxPQUFBLE9BQUE7TUFDQSxNQUFBLEVBQUE7OztVQUdBO0lBQ0EsT0FBQSxHQUFBLGlCQUFBO0tBQ0EsT0FBQSxPQUFBLE9BQUE7Ozs7RUFJQSxPQUFBLE9BQUEsMEJBQUEsVUFBQSxHQUFBLEdBQUE7R0FDQSxJQUFBLE1BQUEsR0FBQTtJQUNBOztHQUVBLFFBQUEsSUFBQTtHQUNBLElBQUEsRUFBQTtJQUNBLGFBQUEsRUFBQTtRQUNBO0lBQ0EsYUFBQTtJQUNBO0dBQ0EsR0FBQTs7Ozs7Ozs7Ozs7OztHQWFBLElBQUEsR0FBQSxRQUFBLEtBQUE7SUFDQSxHQUFBLE9BQUEsT0FBQSxVQUFBO0tBQ0EsT0FBQSxHQUFBLG1DQUFBO01BQ0EsT0FBQSxFQUFBO01BQ0EsTUFBQSxHQUFBLFFBQUE7TUFDQSxXQUFBLE9BQUEsT0FBQTs7O1FBR0E7S0FDQSxPQUFBLEdBQUEsMkJBQUE7TUFDQSxPQUFBLEVBQUE7TUFDQSxNQUFBLEdBQUEsUUFBQTs7O1VBR0E7SUFDQSxPQUFBLEdBQUEsa0JBQUE7S0FDQSxPQUFBLEVBQUE7Ozs7O0VBS0EsT0FBQSxPQUFBLFdBQUEsVUFBQSxHQUFBLEdBQUE7R0FDQSxJQUFBLE1BQUEsR0FBQTtJQUNBOzs7Ozs7OztHQVFBLElBQUEsWUFBQSxFQUFBLE9BQUEsRUFBQSxZQUFBLEdBQUEsR0FBQSxJQUFBLEVBQUEsWUFBQSxHQUFBLEdBQUE7SUFDQSxZQUFBLEVBQUEsT0FBQSxFQUFBLFlBQUEsR0FBQSxHQUFBLElBQUEsRUFBQSxZQUFBLEdBQUEsR0FBQTtJQUNBLFNBQUEsRUFBQSxhQUFBLFdBQUE7O0dBRUEsSUFBQSxNQUFBO0lBQ0EsQ0FBQSxHQUFBO0lBQ0EsQ0FBQSxJQUFBOztHQUVBLElBQUEsR0FBQSxRQUFBLFFBQUE7SUFDQSxNQUFBO0tBQ0EsQ0FBQSxHQUFBO0tBQ0EsQ0FBQSxHQUFBOzs7R0FHQSxHQUFBLElBQUEsVUFBQSxRQUFBO0lBQ0EsUUFBQSxJQUFBO0lBQ0EsU0FBQTs7OztFQUlBLE9BQUEsSUFBQSx1QkFBQSxVQUFBLE9BQUEsU0FBQSxVQUFBLFdBQUEsWUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztFQWtDQSxTQUFBLGdCQUFBO0dBQ0EsWUFBQSxPQUFBLE9BQUEsS0FBQSxVQUFBLEtBQUE7SUFDQSxHQUFBLE1BQUE7SUFDQSxHQUFBLFlBQUEsbUJBQUE7SUFDQSxTQUFBLFlBQUE7S0FDQSxHQUFBLE9BQUEsT0FBQSxVQUFBO01BQ0EsR0FBQSxVQUFBLFFBQUEsY0FBQTtNQUNBLEdBQUEsVUFBQSxTQUFBO01BQ0EsR0FBQSxVQUFBLE9BQUEsR0FBQSxxQkFBQSxTQUFBLEdBQUEsUUFBQSxLQUFBLFdBQUE7TUFDQSxJQUFBLFlBQUEsT0FBQSxPQUFBLFVBQUEsTUFBQTtNQUNBLFFBQUEsUUFBQSxXQUFBLFNBQUEsSUFBQTtPQUNBLEdBQUEsVUFBQSxPQUFBLEdBQUEscUJBQUEsU0FBQSxLQUFBLFdBQUE7Ozs7U0FJQTtNQUNBLEdBQUEsVUFBQSxTQUFBO01BQ0EsR0FBQSxPQUFBLE9BQUEsS0FBQTtRQUNBLEdBQUEsVUFBQSxPQUFBLEdBQUEscUJBQUEsU0FBQSxPQUFBLE9BQUEsTUFBQSxXQUFBOzs7OztJQUtBLEdBQUEsVUFBQSxRQUFBLFVBQUEsVUFBQSxLQUFBLEdBQUE7S0FDQSxJQUFBLENBQUEsR0FBQSxRQUFBLFFBQUE7TUFDQSxJQUFBLElBQUEsZUFBQSxJQUFBLFFBQUEsV0FBQSxHQUFBO01BQ0EsSUFBQSxPQUFBLEVBQUEsR0FBQSxVQUFBLFNBQUEsYUFBQTtPQUNBLEdBQUEsVUFBQSxlQUFBLElBQUEsUUFBQSxXQUFBLEdBQUE7YUFDQTtPQUNBLGFBQUEsTUFBQTs7WUFFQTtNQUNBLFFBQUEsSUFBQTtNQUNBLElBQUEsSUFBQSxlQUFBLElBQUEsUUFBQSxXQUFBLEdBQUE7TUFDQSxJQUFBLE9BQUEsRUFBQSxHQUFBLFVBQUEsU0FBQSxhQUFBO09BQ0EsR0FBQSxtQkFBQTthQUNBO09BQ0EsYUFBQSxNQUFBOzs7Ozs7Ozs7QUMzakJBLENBQUEsWUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLHNDQUFBLFVBQUEsT0FBQSxRQUFBOztJQUVBLE9BQUEsU0FBQTs7OztBQ0xBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLHNFQUFBLFNBQUEsUUFBQSxjQUFBLGFBQUEsT0FBQTs7UUFFQSxJQUFBLEtBQUE7UUFDQSxHQUFBLE9BQUEsYUFBQTtRQUNBLEdBQUEsT0FBQSxhQUFBO1FBQ0EsR0FBQSxTQUFBLGFBQUE7UUFDQSxHQUFBLGFBQUEsYUFBQTtRQUNBLEdBQUEsV0FBQTs7UUFFQTs7UUFFQSxTQUFBLFVBQUE7VUFDQTs7O1FBR0EsU0FBQSxXQUFBO1VBQ0EsR0FBQSxDQUFBLEdBQUEsS0FBQTtZQUNBLE9BQUEsR0FBQTs7OztRQUlBLFNBQUEsVUFBQTtVQUNBLElBQUEsYUFBQSxDQUFBLEtBQUE7VUFDQSxJQUFBLGFBQUEsSUFBQSxTQUFBO1VBQ0EsR0FBQSxVQUFBO1VBQ0EsUUFBQSxRQUFBLEdBQUEsTUFBQSxTQUFBLE1BQUEsSUFBQTtZQUNBLEdBQUEsS0FBQSxPQUFBLFVBQUEsRUFBQTtjQUNBLEtBQUEsS0FBQSxHQUFBLE9BQUEsR0FBQSxLQUFBO2NBQ0EsUUFBQSxJQUFBLEtBQUEsS0FBQTtjQUNBLEdBQUEsS0FBQSxXQUFBLEtBQUEsS0FBQSxHQUFBLEdBQUEsS0FBQSxXQUFBLFVBQUEsSUFBQSxlQUFBO2NBQ0EsV0FBQSxLQUFBLEtBQUEsS0FBQSxLQUFBOztnQkFFQTtjQUNBLE9BQUEsTUFBQSwrQkFBQTtjQUNBOzs7VUFHQSxRQUFBLFFBQUEsR0FBQSxZQUFBLFNBQUEsTUFBQSxJQUFBO2NBQ0EsR0FBQSxPQUFBLEdBQUEsS0FBQSxhQUFBLE9BQUEsR0FBQSxLQUFBLGNBQUE7Y0FDQSxJQUFBLFFBQUE7Z0JBQ0EsVUFBQTtnQkFDQSxRQUFBLEdBQUEsV0FBQSxLQUFBO2dCQUNBLGNBQUEsR0FBQSxXQUFBLEtBQUE7Z0JBQ0Esa0JBQUEsR0FBQSxXQUFBLEtBQUEsbUJBQUE7Z0JBQ0EsYUFBQSxHQUFBLFdBQUEsS0FBQSxhQUFBO2dCQUNBLG1CQUFBLEdBQUEsV0FBQSxLQUFBLGFBQUEsTUFBQTs7Y0FFQSxJQUFBLGFBQUE7Y0FDQSxRQUFBLFFBQUEsR0FBQSxXQUFBLEtBQUEsWUFBQSxTQUFBLElBQUE7Z0JBQ0EsV0FBQSxLQUFBLElBQUE7O2NBRUEsTUFBQSxhQUFBO2NBQ0EsT0FBQSxLQUFBOzs7VUFHQSxHQUFBLEtBQUEsU0FBQTtVQUNBLFFBQUEsSUFBQSxHQUFBO1VBQ0EsWUFBQSxLQUFBLGVBQUEsR0FBQSxNQUFBLEtBQUEsU0FBQSxTQUFBO2NBQ0EsWUFBQSxLQUFBLGVBQUEsU0FBQSxXQUFBLFdBQUEsWUFBQSxLQUFBLFNBQUEsSUFBQTtnQkFDQSxHQUFBLE9BQUEsS0FBQTtrQkFDQSxPQUFBLFFBQUEsV0FBQSxLQUFBLE9BQUEsc0JBQUEsR0FBQSxLQUFBLEtBQUE7a0JBQ0EsYUFBQTtrQkFDQSxPQUFBLEdBQUE7a0JBQ0EsR0FBQSxPQUFBO2tCQUNBLEdBQUEsT0FBQTs7a0JBRUEsR0FBQSxVQUFBOzthQUVBLFNBQUEsU0FBQTtZQUNBLEdBQUEsU0FBQSxRQUFBO2NBQ0EsT0FBQSxNQUFBLFNBQUEsU0FBQTs7O2NBR0EsR0FBQSxVQUFBOzs7Ozs7O0FDNUVBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLHVDQUFBLFNBQUEsYUFBQTtNQUNBLElBQUEsS0FBQTtNQUNBLEdBQUEsT0FBQSxhQUFBO01BQ0EsR0FBQSxPQUFBLGFBQUE7TUFDQSxHQUFBLGFBQUEsYUFBQTtNQUNBLEdBQUEsbUJBQUEsT0FBQSxLQUFBLEdBQUEsWUFBQTs7OztBQ1JBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLGlIQUFBLFNBQUEsUUFBQSxRQUFBLG1CQUFBLFNBQUEsYUFBQSxhQUFBLE9BQUE7OztRQUdBLElBQUEsS0FBQTtRQUNBLEdBQUEsTUFBQTtRQUNBLEdBQUEsTUFBQTtRQUNBLEdBQUEsYUFBQTtRQUNBLEdBQUEsUUFBQTtRQUNBLEdBQUEsT0FBQSxhQUFBO1FBQ0EsR0FBQSxPQUFBLGFBQUE7UUFDQSxHQUFBLFNBQUEsYUFBQTtRQUNBLEdBQUEsWUFBQSxhQUFBO1FBQ0EsR0FBQSxpQkFBQTtRQUNBLG1CQUFBLGFBQUE7OztRQUdBOztRQUVBLFNBQUEsVUFBQTtVQUNBOzs7UUFHQSxTQUFBLFdBQUE7VUFDQSxHQUFBLENBQUEsR0FBQSxLQUFBO1lBQ0EsT0FBQSxHQUFBOzs7O1FBSUEsT0FBQSxPQUFBLFVBQUEsRUFBQSxPQUFBLGFBQUEsb0JBQUEsU0FBQSxFQUFBLEVBQUE7VUFDQSxHQUFBLE1BQUEsRUFBQTtVQUNBLEdBQUEsWUFBQTtVQUNBLEdBQUEsTUFBQTtVQUNBLEdBQUEsTUFBQTtVQUNBLEdBQUEsR0FBQSxVQUFBLE1BQUE7WUFDQSxtQkFBQSxhQUFBLEdBQUEsVUFBQSxNQUFBOztVQUVBOzs7UUFHQSxPQUFBLE9BQUEsZ0JBQUEsU0FBQSxFQUFBLEVBQUE7VUFDQSxHQUFBLE1BQUEsR0FBQTtVQUNBLEdBQUEsT0FBQSxFQUFBLFlBQUEsYUFBQTtZQUNBLEdBQUEsRUFBQSxZQUFBLEVBQUEsU0FBQTtjQUNBLEdBQUEsRUFBQSxNQUFBO2dCQUNBLG1CQUFBLGFBQUEsRUFBQSxNQUFBOztrQkFFQTtrQkFDQSxtQkFBQSxhQUFBOztjQUVBOzs7Y0FHQTtZQUNBLEdBQUEsT0FBQSxFQUFBLGNBQUEsWUFBQTtjQUNBLEdBQUEsRUFBQSxXQUFBLE9BQUE7Z0JBQ0EsbUJBQUEsYUFBQSxFQUFBLFdBQUEsR0FBQSxNQUFBOztrQkFFQTtnQkFDQSxtQkFBQSxhQUFBOzs7WUFHQTs7O1VBR0EsYUFBQTtVQUNBOzs7UUFHQSxTQUFBLFFBQUE7VUFDQSxHQUFBLE1BQUE7VUFDQSxHQUFBLE1BQUE7VUFDQSxRQUFBLFFBQUEsR0FBQSxNQUFBLFNBQUEsTUFBQSxJQUFBO2NBQ0EsR0FBQSxNQUFBLEtBQUEsSUFBQSxLQUFBLEtBQUEsR0FBQSxHQUFBLFVBQUEsY0FBQSxHQUFBO2NBQ0EsR0FBQSxNQUFBLEtBQUEsSUFBQSxLQUFBLEtBQUEsR0FBQSxHQUFBLFVBQUEsY0FBQSxHQUFBOztVQUVBLEdBQUEsUUFBQSxHQUFBLE1BQUEsU0FBQSxPQUFBLENBQUEsR0FBQSxJQUFBLEdBQUEsTUFBQSxNQUFBLENBQUEsRUFBQTs7UUFFQSxTQUFBLGNBQUEsSUFBQTtVQUNBLElBQUEsUUFBQTtVQUNBLFFBQUEsUUFBQSxHQUFBLE1BQUEsU0FBQSxNQUFBLElBQUE7YUFDQSxHQUFBLEtBQUEsS0FBQSxHQUFBLEdBQUEsS0FBQSxjQUFBLElBQUE7ZUFDQSxRQUFBLEtBQUEsS0FBQSxHQUFBLEdBQUEsVUFBQTs7O1VBR0EsT0FBQTs7UUFFQSxTQUFBLGVBQUEsU0FBQTtPQUNBLElBQUEsUUFBQTtPQUNBLElBQUEsTUFBQSxRQUFBLFdBQUE7T0FDQSxJQUFBLFFBQUEsY0FBQSxRQUFBLEdBQUE7T0FDQSxJQUFBLFFBQUEsR0FBQSxVQUFBO09BQ0EsSUFBQSxPQUFBLFFBQUE7O09BRUEsUUFBQTtPQUNBLEtBQUE7O1NBRUEsSUFBQSxXQUFBLFNBQUEsTUFBQSxNQUFBLFNBQUEsR0FBQSxNQUFBLFdBQUE7U0FDQSxJQUFBLFFBQUEsVUFBQSxtQkFBQSxTQUFBLFlBQUEsT0FBQSxtQkFBQSxTQUFBLFdBQUEsS0FBQSxPQUFBLG1CQUFBLFNBQUEsV0FBQSxLQUFBLE1BQUEsbUJBQUEsU0FBQSxXQUFBLEtBQUE7Y0FDQSxNQUFBLFFBQUEsVUFBQSxtQkFBQSxTQUFBLGFBQUEsT0FBQSxtQkFBQSxTQUFBLFdBQUEsS0FBQSxPQUFBLG1CQUFBLFNBQUEsV0FBQSxLQUFBO1NBQ0EsTUFBQSxVQUFBO1VBQ0EsT0FBQTtVQUNBLE1BQUE7O1NBRUEsTUFBQSxXQUFBO1VBQ0EsT0FBQSxVQUFBLG1CQUFBLFNBQUEsWUFBQSxPQUFBLG1CQUFBLFNBQUEsV0FBQSxLQUFBLE9BQUEsbUJBQUEsU0FBQSxXQUFBLEtBQUE7VUFDQSxTQUFBO1dBQ0EsT0FBQTtXQUNBLE1BQUE7OztTQUdBOzs7O09BSUEsSUFBQSxRQUFBLE1BQUEsU0FBQSxtQkFBQSxVQUFBLFNBQUE7UUFDQSxNQUFBLGNBQUEsWUFBQTtTQUNBLElBQUEsUUFBQTtVQUNBLE1BQUEsUUFBQSxXQUFBO1VBQ0EsVUFBQSxDQUFBLEtBQUE7VUFDQSxVQUFBOztTQUVBLE9BQUE7OztPQUdBLE9BQUE7O1FBRUEsU0FBQSxnQkFBQTtVQUNBO09BQ0EsWUFBQSxPQUFBLE9BQUEsS0FBQSxVQUFBLEtBQUE7UUFDQSxHQUFBLE1BQUE7UUFDQSxHQUFBLFlBQUEsbUJBQUE7UUFDQSxTQUFBLFlBQUE7VUFDQSxHQUFBLFVBQUEsU0FBQTs7Ozs7Ozs7O0FDdklBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLGdGQUFBLFNBQUEsT0FBQSxZQUFBLGVBQUEsYUFBQTtNQUNBLElBQUEsS0FBQTtNQUNBLEdBQUEsT0FBQSxhQUFBO01BQ0EsR0FBQSxPQUFBLGFBQUE7TUFDQSxHQUFBLGFBQUEsYUFBQTtNQUNBLEdBQUEsbUJBQUE7TUFDQSxHQUFBLFlBQUE7TUFDQSxHQUFBLFdBQUE7O01BRUEsU0FBQSxpQkFBQSxJQUFBO1FBQ0EsR0FBQSxPQUFBLGFBQUEsYUFBQSxRQUFBLFlBQUE7VUFDQSxhQUFBLGFBQUEsSUFBQTtZQUNBLFlBQUE7WUFDQSxNQUFBOzs7UUFHQSxHQUFBLGNBQUE7UUFDQSxHQUFBLFlBQUEsYUFBQSxhQUFBO1FBQ0EsYUFBQTs7TUFFQSxTQUFBLFVBQUEsS0FBQTtRQUNBLEdBQUEsT0FBQSxRQUFBLGFBQUEsT0FBQTtLQUNBLElBQUEsS0FBQSxTQUFBLEtBQUEsbUJBQUEsS0FBQSxnQkFBQSxLQUFBLE1BQUEsVUFBQSxHQUFBO01BQ0EsT0FBQTs7S0FFQSxPQUFBOztJQUVBLFNBQUEsVUFBQSxLQUFBO1FBQ0EsR0FBQSxPQUFBLFFBQUEsZUFBQSxPQUFBLEtBQUEsY0FBQSxhQUFBLE9BQUE7S0FDQSxPQUFBLFVBQUEsU0FBQSxLQUFBLFdBQUEsU0FBQSxPQUFBOztNQUVBLE9BQUEsT0FBQSxVQUFBLEVBQUEsT0FBQSxhQUFBLG9CQUFBLFNBQUEsRUFBQSxFQUFBO1FBQ0EsR0FBQSxNQUFBLEVBQUE7UUFDQSxHQUFBLFdBQUEsRUFBQSxlQUFBO1FBQ0E7TUFDQSxPQUFBLE9BQUEsVUFBQSxFQUFBLE9BQUEsYUFBQSxvQkFBQSxTQUFBLEVBQUEsRUFBQTtRQUNBLElBQUEsTUFBQSxLQUFBLE9BQUEsS0FBQSxhQUFBO1FBQ0EsR0FBQSxDQUFBLEdBQUEsa0JBQUE7VUFDQSxHQUFBLGNBQUEsR0FBQSxXQUFBLEVBQUEsYUFBQTtVQUNBLEdBQUEsYUFBQSxHQUFBLFdBQUEsRUFBQSxhQUFBO1VBQ0EsR0FBQSxnQkFBQSxHQUFBLFdBQUEsRUFBQSxhQUFBO1VBQ0EsR0FBQSxZQUFBLEdBQUEsV0FBQSxFQUFBLGFBQUE7VUFDQSxHQUFBLFdBQUEsR0FBQSxXQUFBLEVBQUEsYUFBQTtVQUNBLFFBQUEsSUFBQSxHQUFBO1VBQ0EsY0FBQSxhQUFBLGdCQUFBO2VBQ0E7Ozs7Ozs7Ozs7O0FDaERBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLG1CQUFBLFVBQUE7Ozs7OztBQ0hBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLHdDQUFBLFNBQUEsWUFBQTtNQUNBLElBQUEsS0FBQTtNQUNBLEdBQUEsT0FBQSxZQUFBOzs7O0FDTEEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsdUNBQUEsU0FBQSxZQUFBO01BQ0EsSUFBQSxLQUFBO01BQ0EsR0FBQSxPQUFBLFlBQUE7Ozs7QUNMQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSwrS0FBQSxTQUFBLFFBQUEsY0FBQSxhQUFBLFNBQUEsUUFBQSxTQUFBLGFBQUEsUUFBQSxhQUFBLGNBQUEsbUJBQUE7Ozs7Ozs7Ozs7Ozs7OztRQWVBLElBQUEsS0FBQTtRQUNBLEdBQUEsTUFBQTtRQUNBLEdBQUEsT0FBQTtRQUNBLEdBQUEsV0FBQTtRQUNBLEdBQUEsV0FBQTtRQUNBLEdBQUEsZUFBQTtRQUNBLEdBQUEsbUJBQUE7UUFDQSxHQUFBLGtCQUFBOztRQUVBLEdBQUEsU0FBQTtRQUNBLEdBQUEsU0FBQTtRQUNBLEdBQUEsWUFBQTtRQUNBLEdBQUEsbUJBQUE7UUFDQSxHQUFBLGFBQUE7UUFDQSxHQUFBLGNBQUE7UUFDQSxHQUFBLGVBQUE7UUFDQSxHQUFBLGdCQUFBO1FBQ0EsR0FBQSxPQUFBO1FBQ0EsR0FBQSxZQUFBOzs7UUFHQSxHQUFBLGdCQUFBO1FBQ0EsR0FBQSxzQkFBQTtRQUNBLEdBQUEsbUJBQUE7UUFDQSxHQUFBLGlCQUFBO1FBQ0EsR0FBQSxxQkFBQTtRQUNBLEdBQUEscUJBQUE7UUFDQSxHQUFBLHVCQUFBO1FBQ0EsR0FBQSx5QkFBQTtRQUNBLEdBQUEsV0FBQTtRQUNBLEdBQUEsaUJBQUE7UUFDQSxHQUFBLFlBQUE7UUFDQSxHQUFBLGNBQUE7UUFDQSxHQUFBLFlBQUE7O1FBRUEsR0FBQSxRQUFBLGFBQUE7OztRQUdBLEdBQUEsT0FBQTtVQUNBLFdBQUE7VUFDQSxjQUFBO1VBQ0EsTUFBQTs7UUFFQSxHQUFBLFFBQUE7VUFDQSxRQUFBO1VBQ0EsT0FBQTtVQUNBLE9BQUE7VUFDQSxNQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O1FBbUJBOztRQUVBLFNBQUEsVUFBQTs7O1FBR0EsU0FBQSxVQUFBLE9BQUE7VUFDQSxPQUFBLFNBQUEsV0FBQTs7UUFFQSxTQUFBLGdCQUFBLFFBQUE7U0FDQSxJQUFBLFFBQUE7Y0FDQSxNQUFBO2NBQ0EsU0FBQTtVQUNBLE9BQUE7VUFDQSxNQUFBOzs7U0FHQSxPQUFBOztRQUVBLFNBQUEsVUFBQTtXQUNBLFlBQUEsT0FBQSxPQUFBLEtBQUEsVUFBQSxLQUFBO2NBQ0EsR0FBQSxZQUFBLG1CQUFBO2NBQ0EsU0FBQSxVQUFBO2dCQUNBLEdBQUEsVUFBQSxTQUFBOzs7Ozs7UUFNQSxTQUFBLHFCQUFBO1VBQ0EsR0FBQSxnQkFBQSxDQUFBLEdBQUE7VUFDQSxHQUFBLEdBQUEsY0FBQTtZQUNBLEdBQUE7OztRQUdBLFNBQUEsZUFBQTtVQUNBLEdBQUEsQ0FBQSxHQUFBLFVBQUE7WUFDQSxZQUFBLE9BQUEsZUFBQSxLQUFBLFNBQUEsU0FBQTtjQUNBLEdBQUEsWUFBQTtjQUNBLEdBQUEsb0JBQUEsSUFBQSxHQUFBLGtCQUFBOzs7OztRQUtBLFNBQUEsaUJBQUEsU0FBQTtVQUNBLE9BQUEsR0FBQSxrQkFBQSxRQUFBLFlBQUEsQ0FBQSxJQUFBLE9BQUE7O1FBRUEsU0FBQSxnQkFBQSxVQUFBLEtBQUE7VUFDQSxRQUFBLFFBQUEsTUFBQSxTQUFBLE1BQUEsSUFBQTs7Z0JBRUEsR0FBQSxRQUFBLFNBQUE7a0JBQ0EsS0FBQSxPQUFBLEtBQUE7a0JBQ0EsR0FBQSxpQkFBQSxPQUFBLEdBQUEsaUJBQUEsUUFBQSxPQUFBO2tCQUNBLEdBQUEsa0JBQUEsT0FBQSxHQUFBLGtCQUFBLFFBQUEsTUFBQTs7O2NBR0EsZ0JBQUEsVUFBQSxLQUFBOzs7UUFHQSxTQUFBLGVBQUEsU0FBQTtVQUNBLElBQUEsTUFBQSxHQUFBLGtCQUFBLFFBQUE7VUFDQSxJQUFBLE1BQUEsQ0FBQSxFQUFBO1lBQ0EsR0FBQSxrQkFBQSxPQUFBLEtBQUE7WUFDQSxnQkFBQSxVQUFBLEdBQUE7O2NBRUE7WUFDQSxHQUFBLGtCQUFBLEtBQUE7WUFDQSxHQUFBLEdBQUEsaUJBQUEsVUFBQSxLQUFBLE9BQUEsR0FBQSxpQkFBQSxHQUFBLFdBQUEsWUFBQTtjQUNBLEdBQUEsaUJBQUEsR0FBQSxNQUFBLEtBQUE7O2dCQUVBO2dCQUNBLEdBQUEsT0FBQSxLQUFBOzs7Ozs7UUFNQSxTQUFBLGVBQUEsTUFBQTtVQUNBLFFBQUEsUUFBQSxPQUFBLFNBQUEsTUFBQSxJQUFBO1lBQ0EsTUFBQSxLQUFBLFNBQUEsU0FBQSxNQUFBLE1BQUE7WUFDQSxlQUFBLE1BQUE7OztRQUdBLFNBQUEsbUJBQUEsS0FBQTtVQUNBLFFBQUEsSUFBQTs7UUFFQSxTQUFBLG1CQUFBLEtBQUE7VUFDQSxRQUFBLElBQUE7O1FBRUEsU0FBQSxxQkFBQSxLQUFBO1VBQ0EsSUFBQSxNQUFBLEdBQUEsaUJBQUEsUUFBQTtVQUNBLElBQUEsTUFBQSxDQUFBLEVBQUE7WUFDQSxHQUFBLGlCQUFBLE9BQUEsS0FBQTs7Y0FFQTtZQUNBLEdBQUEsaUJBQUEsS0FBQTs7O1FBR0EsU0FBQSx1QkFBQSxLQUFBO1VBQ0EsT0FBQSxHQUFBLGlCQUFBLFFBQUEsUUFBQSxDQUFBOztRQUVBLFNBQUEsVUFBQTtVQUNBLElBQUEsV0FBQTtZQUNBLE1BQUE7WUFDQSxRQUFBO1lBQ0EsTUFBQTs7O1VBR0EsR0FBQSxHQUFBLGlCQUFBLFVBQUEsS0FBQSxPQUFBLEdBQUEsaUJBQUEsR0FBQSxXQUFBLFlBQUE7WUFDQSxHQUFBLGlCQUFBLEdBQUEsTUFBQSxLQUFBOztlQUVBLEdBQUEsR0FBQSxpQkFBQSxTQUFBLEdBQUE7Y0FDQSxRQUFBLFFBQUEsR0FBQSxrQkFBQSxTQUFBLE1BQUEsSUFBQTtrQkFDQSxTQUFBLE1BQUEsS0FBQTtrQkFDQSxnQkFBQSxNQUFBLEdBQUE7O2NBRUEsR0FBQSxPQUFBLEtBQUE7Y0FDQSxHQUFBLG1CQUFBOztjQUVBO1lBQ0EsR0FBQSxPQUFBLEtBQUE7OztRQUdBLFNBQUEsZ0JBQUE7VUFDQSxJQUFBLFdBQUE7WUFDQSxNQUFBO1lBQ0EsUUFBQTtZQUNBLE1BQUE7O1VBRUEsUUFBQSxRQUFBLEdBQUEsa0JBQUEsU0FBQSxNQUFBLElBQUE7WUFDQSxTQUFBLE1BQUEsS0FBQTs7VUFFQSxHQUFBLE9BQUEsS0FBQTtVQUNBLEdBQUEsbUJBQUE7O1FBRUEsU0FBQSxVQUFBLEtBQUE7VUFDQSxHQUFBLFdBQUE7O1FBRUEsU0FBQSxZQUFBLE1BQUEsS0FBQTtZQUNBLGdCQUFBLE1BQUE7O1FBRUEsU0FBQSxXQUFBO1VBQ0EsR0FBQSxHQUFBLGFBQUE7WUFDQTs7VUFFQSxHQUFBLGVBQUE7VUFDQSxHQUFBLE9BQUEsR0FBQSxZQUFBLFlBQUE7WUFDQSxPQUFBLE1BQUEsNkJBQUE7WUFDQSxHQUFBLGVBQUE7WUFDQTs7VUFFQSxHQUFBLENBQUEsR0FBQSxTQUFBLE1BQUE7WUFDQSxPQUFBLE1BQUEsNkJBQUE7WUFDQSxHQUFBLGVBQUE7WUFDQTs7VUFFQSxHQUFBLFNBQUEsT0FBQSxHQUFBO1VBQ0EsWUFBQSxLQUFBLFNBQUEsR0FBQSxVQUFBLEtBQUEsU0FBQSxTQUFBO1lBQ0EsR0FBQSxlQUFBO1lBQ0EsT0FBQSxRQUFBLCtCQUFBO1lBQ0EsT0FBQSxHQUFBLGtCQUFBLENBQUEsTUFBQSxTQUFBO1lBQ0EsU0FBQSxTQUFBO1lBQ0EsR0FBQSxlQUFBO1lBQ0EsT0FBQSxNQUFBLFNBQUEsUUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN0UEEsQ0FBQSxXQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsNkNBQUEsU0FBQSxTQUFBLFlBQUE7O0VBRUEsSUFBQSxLQUFBOztFQUVBLEdBQUEsYUFBQTtFQUNBLEdBQUEsWUFBQTtFQUNBLEdBQUEsU0FBQTtHQUNBLE1BQUE7R0FDQSxPQUFBO0lBQ0EsT0FBQTtJQUNBLE9BQUE7SUFDQSxZQUFBO0lBQ0EsYUFBQTtJQUNBLGFBQUE7OztFQUdBLEdBQUEsV0FBQTtFQUNBLEdBQUEsZUFBQTtFQUNBLEdBQUEsa0JBQUE7O0VBRUEsU0FBQSxhQUFBLE1BQUE7R0FDQSxPQUFBLEdBQUEsVUFBQSxRQUFBLFFBQUEsQ0FBQSxJQUFBLE9BQUE7OztFQUdBLFNBQUEsZ0JBQUEsTUFBQTtHQUNBLElBQUEsUUFBQSxHQUFBLFVBQUEsUUFBQTtHQUNBLElBQUEsUUFBQSxDQUFBLEdBQUE7SUFDQSxPQUFBLEdBQUEsVUFBQSxPQUFBLE9BQUE7VUFDQTtJQUNBLE9BQUEsR0FBQSxVQUFBLEtBQUE7Ozs7RUFJQSxTQUFBLFNBQUEsYUFBQSxJQUFBO0dBQ0EsWUFBQTs7Ozs7O0FDckNBLENBQUEsWUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLG9IQUFBLFVBQUEsUUFBQSxPQUFBLFVBQUEsb0JBQUEsYUFBQSxnQkFBQTs7RUFFQSxJQUFBLEtBQUE7SUFDQSxHQUFBLFlBQUEsZUFBQSxhQUFBLE9BQUEsT0FBQTtFQUNBLEdBQUEsUUFBQTtFQUNBLEdBQUEsTUFBQTtFQUNBLEdBQUEsTUFBQTtFQUNBLEdBQUEsV0FBQTtFQUNBOztFQUVBLGVBQUEsaUJBQUEsT0FBQSxPQUFBLElBQUEsS0FBQSxTQUFBLEtBQUE7R0FDQSxtQkFBQSxhQUFBO0dBQ0EsR0FBQSxPQUFBO0dBQ0E7R0FDQTs7RUFFQSxTQUFBLFdBQUE7R0FDQSxHQUFBLE9BQUEsUUFBQSxRQUFBLHFDQUFBO0lBQ0EsR0FBQSxPQUFBLE9BQUEsU0FBQSxjQUFBO0tBQ0EsR0FBQSxXQUFBOztTQUVBLEdBQUEsT0FBQSxPQUFBLFNBQUEsVUFBQTtLQUNBLEdBQUEsV0FBQTs7U0FFQSxHQUFBLE9BQUEsT0FBQSxTQUFBLFFBQUE7S0FDQSxHQUFBLFdBQUE7O1NBRUEsR0FBQSxPQUFBLE9BQUEsU0FBQSxhQUFBO0tBQ0EsR0FBQSxXQUFBOztRQUVBO0tBQ0EsR0FBQSxXQUFBOzs7O0VBSUEsU0FBQSxRQUFBO0dBQ0EsR0FBQSxNQUFBO0dBQ0EsR0FBQSxNQUFBO0dBQ0EsUUFBQSxRQUFBLEdBQUEsTUFBQSxTQUFBLE1BQUEsSUFBQTtLQUNBLEdBQUEsTUFBQSxLQUFBLElBQUEsS0FBQSxPQUFBLEdBQUE7S0FDQSxHQUFBLE1BQUEsS0FBQSxJQUFBLEtBQUEsT0FBQSxHQUFBOztHQUVBLEdBQUEsUUFBQSxHQUFBLE1BQUEsU0FBQSxPQUFBLENBQUEsR0FBQSxJQUFBLEdBQUEsTUFBQSxNQUFBLENBQUEsRUFBQTs7RUFFQSxTQUFBLGNBQUEsSUFBQTtHQUNBLElBQUEsUUFBQTtHQUNBLFFBQUEsUUFBQSxHQUFBLE1BQUEsU0FBQSxNQUFBLElBQUE7S0FDQSxHQUFBLEtBQUEsT0FBQSxJQUFBO01BQ0EsUUFBQSxLQUFBOzs7R0FHQSxPQUFBOztFQUVBLFNBQUEsZUFBQSxTQUFBO0dBQ0EsSUFBQSxRQUFBO0dBQ0EsSUFBQSxNQUFBLFFBQUEsV0FBQTtHQUNBLElBQUEsUUFBQSxjQUFBLFFBQUEsR0FBQTtHQUNBLElBQUEsT0FBQSxRQUFBOztHQUVBLFFBQUE7SUFDQSxLQUFBO0tBQ0EsSUFBQSxXQUFBLFNBQUEsTUFBQSxNQUFBLFNBQUEsR0FBQSxNQUFBLFdBQUE7S0FDQSxJQUFBLFFBQUEsVUFBQSxtQkFBQSxTQUFBLFlBQUEsT0FBQSxtQkFBQSxTQUFBLFdBQUEsS0FBQSxPQUFBLG1CQUFBLFNBQUEsV0FBQSxLQUFBLE1BQUEsbUJBQUEsU0FBQSxXQUFBLEtBQUE7S0FDQSxNQUFBLFFBQUEsVUFBQSxtQkFBQSxTQUFBLGFBQUEsT0FBQSxtQkFBQSxTQUFBLFdBQUEsS0FBQSxPQUFBLG1CQUFBLFNBQUEsV0FBQSxLQUFBO0tBQ0EsTUFBQSxVQUFBO01BQ0EsT0FBQTtNQUNBLE1BQUE7O0tBRUEsTUFBQSxXQUFBO01BQ0EsT0FBQSxVQUFBLG1CQUFBLFNBQUEsWUFBQSxPQUFBLG1CQUFBLFNBQUEsV0FBQSxLQUFBLE9BQUEsbUJBQUEsU0FBQSxXQUFBLEtBQUE7TUFDQSxTQUFBO09BQ0EsT0FBQTtPQUNBLE1BQUE7OztLQUdBOzs7R0FHQSxPQUFBOztFQUVBLFNBQUEsZ0JBQUE7R0FDQTtHQUNBLFlBQUEsT0FBQSxPQUFBLEtBQUEsVUFBQSxLQUFBO0lBQ0EsR0FBQSxNQUFBO0lBQ0EsR0FBQSxZQUFBLG1CQUFBO0lBQ0EsU0FBQSxZQUFBO01BQ0EsR0FBQSxVQUFBLFNBQUE7Ozs7OztFQU1BLE9BQUEsSUFBQSx1QkFBQSxVQUFBO0dBQ0E7Ozs7Ozs7QUNoR0EsQ0FBQSxVQUFBO0lBQ0E7SUFDQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSxvQ0FBQSxTQUFBLGVBQUE7UUFDQSxJQUFBLEtBQUE7UUFDQSxHQUFBLFlBQUEsZUFBQTs7OztBQ0pBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLHlEQUFBLFNBQUEsWUFBQSxRQUFBLE9BQUEsT0FBQTtRQUNBLElBQUEsS0FBQTtRQUNBLEdBQUEsWUFBQTtRQUNBLEdBQUEsVUFBQTtRQUNBLEdBQUEsZ0JBQUE7O1FBRUEsR0FBQSxPQUFBO1VBQ0EsTUFBQTtVQUNBLFNBQUE7OztRQUdBOztRQUVBLFNBQUEsVUFBQTtVQUNBLEdBQUE7OztRQUdBLFNBQUEsZUFBQTs7VUFFQSxHQUFBLE1BQUEsa0JBQUE7Ozs7UUFJQSxTQUFBLFNBQUE7VUFDQSxNQUFBLE1BQUEsR0FBQSxNQUFBLEtBQUEsU0FBQSxTQUFBO1lBQ0EsT0FBQSxRQUFBO1lBQ0EsUUFBQSxJQUFBLFdBQUE7WUFDQSxPQUFBLEdBQUEsV0FBQSxhQUFBLE1BQUEsUUFBQSxZQUFBLFdBQUEsYUFBQTthQUNBLE1BQUEsU0FBQSxTQUFBO1lBQ0EsT0FBQSxNQUFBLHdDQUFBOzs7Ozs7O0FDaENBLENBQUEsWUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLGlEQUFBLFVBQUEsYUFBQSxvQkFBQTs7RUFFQSxJQUFBLEtBQUE7RUFDQSxJQUFBLFNBQUEsbUJBQUEsS0FBQTs7RUFFQSxHQUFBLFdBQUE7O0dBRUEsUUFBQTs7RUFFQSxHQUFBLFNBQUE7R0FDQSxLQUFBO0dBQ0EsS0FBQTtHQUNBLE1BQUE7O0VBRUEsR0FBQSxTQUFBO0dBQ0EsWUFBQTtJQUNBLEtBQUE7S0FDQSxNQUFBO0tBQ0EsS0FBQSxzRkFBQTtLQUNBLE1BQUE7S0FDQSxhQUFBO09BQ0EsUUFBQTtPQUNBLGlCQUFBOzs7Ozs7RUFNQSxHQUFBLFlBQUE7R0FDQSxXQUFBO0lBQ0EsS0FBQTtJQUNBLEtBQUE7O0dBRUEsV0FBQTtJQUNBLEtBQUEsQ0FBQTtJQUNBLEtBQUEsQ0FBQTs7O0VBR0EsWUFBQSxPQUFBLE9BQUEsS0FBQSxVQUFBLEtBQUE7R0FDQSxJQUFBLE1BQUEscUVBQUEsbUJBQUEsWUFBQSwrQ0FBQSxtQkFBQTtHQUNBLElBQUEsUUFBQSxJQUFBLEVBQUEsVUFBQSxVQUFBO0lBQ0EsS0FBQTtJQUNBLE9BQUE7SUFDQSxpQkFBQSxDQUFBLG1CQUFBLFlBQUE7SUFDQSxhQUFBO0lBQ0Esc0JBQUEsVUFBQSxTQUFBO0tBQ0EsT0FBQSxRQUFBLFdBQUE7O0lBRUEsUUFBQSxVQUFBLFNBQUEsU0FBQTs7S0FFQSxPQUFBOzs7R0FHQSxJQUFBLFNBQUEsbUJBQUEsU0FBQTtHQUNBLElBQUEsY0FBQSxFQUFBLFVBQUEsbUZBQUEsT0FBQTtNQUNBLFFBQUE7TUFDQSxpQkFBQTs7R0FFQSxJQUFBLFNBQUE7R0FDQSxZQUFBOzs7OztBQzlEQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSwwRUFBQSxTQUFBLFFBQUEsWUFBQSxvQkFBQSxRQUFBOztRQUVBLElBQUEsS0FBQTtRQUNBLEdBQUEsWUFBQSxPQUFBLFFBQUEsR0FBQTtRQUNBLEdBQUEsVUFBQSxPQUFBLFFBQUEsR0FBQTtRQUNBLEdBQUEsT0FBQSxPQUFBLFFBQUEsR0FBQTtRQUNBLEdBQUEsVUFBQTtRQUNBLEdBQUEsWUFBQSxtQkFBQTtRQUNBLEdBQUEsVUFBQTtRQUNBLEdBQUEsWUFBQTtRQUNBLEdBQUEsY0FBQTs7UUFFQSxTQUFBLFdBQUE7VUFDQSxJQUFBLE9BQUE7VUFDQSxRQUFBLFFBQUEsR0FBQSxNQUFBLFNBQUEsTUFBQTtZQUNBLEtBQUEsR0FBQSxVQUFBLG9CQUFBLFdBQUEsS0FBQSxHQUFBLFVBQUE7WUFDQSxLQUFBLFdBQUEsU0FBQSxLQUFBOztVQUVBLElBQUEsU0FBQSxRQUFBLFdBQUEsR0FBQSxNQUFBLENBQUEsR0FBQSxVQUFBLGtCQUFBLFVBQUE7VUFDQSxLQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsT0FBQSxRQUFBLEtBQUE7WUFDQSxJQUFBLE9BQUEsR0FBQSxPQUFBLEdBQUEsUUFBQSxLQUFBO2NBQ0EsT0FBQSxJQUFBOzs7VUFHQSxHQUFBLFFBQUEsR0FBQSxVQUFBLGlCQUFBLFdBQUE7VUFDQSxHQUFBLGdCQUFBO2NBQ0EsTUFBQSxHQUFBLFVBQUE7Y0FDQSxNQUFBLEdBQUEsVUFBQSxpQkFBQTs7O1FBR0EsU0FBQSxRQUFBLFFBQUE7VUFDQSxJQUFBLFNBQUEsUUFBQSxXQUFBLEdBQUEsTUFBQSxDQUFBLEdBQUEsVUFBQSxrQkFBQSxVQUFBO1VBQ0EsSUFBQSxPQUFBO1VBQ0EsUUFBQSxRQUFBLFFBQUEsU0FBQSxNQUFBLElBQUE7WUFDQSxHQUFBLEtBQUEsV0FBQSxRQUFBLFFBQUE7Y0FDQSxPQUFBOzs7VUFHQSxPQUFBLEtBQUE7O1FBRUEsU0FBQSxZQUFBO09BQ0EsSUFBQSxDQUFBLEdBQUEsU0FBQTtRQUNBLE9BQUE7O09BRUEsT0FBQSxDQUFBLEdBQUEsUUFBQSxHQUFBLFdBQUEsS0FBQTtPQUNBOztNQUVBLFNBQUEsY0FBQTtPQUNBLElBQUEsQ0FBQSxHQUFBLFNBQUE7UUFDQSxPQUFBOztPQUVBLE9BQUEsR0FBQSxRQUFBLGlCQUFBLElBQUEsa0JBQUE7T0FDQTs7UUFFQSxPQUFBLE9BQUEsY0FBQSxVQUFBLEdBQUEsR0FBQTtVQUNBLElBQUEsTUFBQSxHQUFBO1lBQ0E7OztZQUdBLEdBQUEsRUFBQSxJQUFBO2NBQ0EsR0FBQSxVQUFBLE9BQUEsbUJBQUEsU0FBQSxFQUFBLEtBQUEsV0FBQTs7WUFFQTtZQUNBLGdCQUFBLEVBQUE7Ozs7Ozs7OztBQ2xFQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSxvQ0FBQSxTQUFBLFFBQUEsT0FBQTs7Ozs7O0FDSEEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsY0FBQSxVQUFBOzs7Ozs7QUNIQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSx5Q0FBQSxTQUFBLFFBQUEsYUFBQTs7RUFFQSxPQUFBLGVBQUEsVUFBQTtHQUNBLGFBQUEsS0FBQTs7O0VBR0EsT0FBQSxhQUFBLFVBQUE7R0FDQSxhQUFBLE1BQUE7Ozs7Ozs7QUNWQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSwwQkFBQSxVQUFBOzs7Ozs7QUNIQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSxZQUFBLFVBQUE7Ozs7OztBQ0hBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLDRDQUFBLFNBQUEsUUFBQSxjQUFBOztRQUVBLE9BQUEsT0FBQSxVQUFBOztZQUVBLGNBQUE7OztRQUdBLE9BQUEsT0FBQSxVQUFBO1NBQ0EsY0FBQTs7Ozs7OztBQ1hBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLGdFQUFBLFNBQUEsUUFBQSxjQUFBLGNBQUE7UUFDQSxPQUFBLFFBQUEsR0FBQSxtQkFBQTtRQUNBLE9BQUEsUUFBQSxHQUFBLGNBQUE7UUFDQSxPQUFBLFFBQUEsR0FBQSxVQUFBO1FBQ0EsT0FBQSxRQUFBLEdBQUEsZUFBQTtRQUNBLE9BQUEsUUFBQSxHQUFBLGFBQUE7UUFDQSxPQUFBLFFBQUEsR0FBQSxXQUFBO1FBQ0EsT0FBQSxPQUFBLFVBQUE7O1VBRUEsUUFBQSxRQUFBLE9BQUEsUUFBQSxHQUFBLEtBQUEsR0FBQSxLQUFBLElBQUEsU0FBQSxNQUFBLElBQUE7WUFDQSxHQUFBLE9BQUEsYUFBQSxhQUFBLFFBQUEsWUFBQTtjQUNBLGFBQUEsYUFBQSxJQUFBO2dCQUNBLFlBQUE7Z0JBQ0EsTUFBQTs7O1lBR0EsSUFBQSxPQUFBLGFBQUEsYUFBQTtZQUNBLEdBQUEsT0FBQSxRQUFBLEdBQUEsWUFBQTtjQUNBLEtBQUEsZ0JBQUEsT0FBQSxRQUFBLEdBQUE7O1lBRUEsR0FBQSxPQUFBLFFBQUEsR0FBQSxXQUFBO2dCQUNBLEtBQUEsa0JBQUEsT0FBQSxRQUFBLEdBQUE7O1lBRUEsR0FBQSxPQUFBLFFBQUEsR0FBQSxhQUFBO2dCQUNBLEtBQUEsYUFBQSxPQUFBLFFBQUEsR0FBQTs7WUFFQSxHQUFBLE9BQUEsUUFBQSxHQUFBLFNBQUE7Y0FDQSxLQUFBLGFBQUEsT0FBQSxRQUFBLEdBQUE7O1lBRUEsR0FBQSxPQUFBLFFBQUEsR0FBQSxRQUFBOztjQUVBLEdBQUEsT0FBQSxLQUFBLFNBQUEsWUFBQTtvQkFDQSxLQUFBLFFBQUEsT0FBQSxRQUFBLEdBQUE7Z0JBQ0EsS0FBQSxXQUFBLE9BQUEsUUFBQSxHQUFBLFNBQUE7Ozs7O1VBS0EsYUFBQTtVQUNBLGNBQUE7OztRQUdBLE9BQUEsT0FBQSxVQUFBO1VBQ0EsT0FBQSxRQUFBLEdBQUEsY0FBQTtVQUNBLE9BQUEsUUFBQSxHQUFBLGVBQUE7VUFDQSxPQUFBLFFBQUEsR0FBQSxhQUFBO1NBQ0EsY0FBQTs7Ozs7OztBQ2pEQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSw4Q0FBQSxTQUFBLFFBQUEsY0FBQTtRQUNBLE9BQUEsT0FBQSxPQUFBLFFBQUEsR0FBQTtRQUNBLEdBQUEsT0FBQSxPQUFBLFFBQUEsR0FBQSxLQUFBLE1BQUEsT0FBQSxTQUFBLFlBQUE7VUFDQSxPQUFBLFFBQUEsR0FBQSxLQUFBLE1BQUEsT0FBQSxRQUFBOztZQUVBO1VBQ0EsR0FBQSxPQUFBLFFBQUEsR0FBQSxLQUFBLE1BQUEsT0FBQSxNQUFBLE1BQUE7WUFDQSxPQUFBLFFBQUEsT0FBQSxRQUFBLEdBQUEsS0FBQSxNQUFBLE9BQUEsTUFBQTs7VUFFQSxHQUFBLE9BQUEsUUFBQSxHQUFBLEtBQUEsTUFBQSxPQUFBLE1BQUEsWUFBQTtZQUNBLE9BQUEsY0FBQSxPQUFBLFFBQUEsR0FBQSxLQUFBLE1BQUEsT0FBQSxNQUFBOzs7O1FBSUEsT0FBQSxPQUFBLFVBQUE7VUFDQSxPQUFBLFFBQUEsR0FBQSxLQUFBLE1BQUEsT0FBQSxNQUFBLFFBQUEsT0FBQTtVQUNBLE9BQUEsUUFBQSxHQUFBLEtBQUEsTUFBQSxPQUFBLE1BQUEsY0FBQSxPQUFBO1VBQ0EsY0FBQTs7O1FBR0EsT0FBQSxPQUFBLFVBQUE7U0FDQSxjQUFBOzs7Ozs7O0FDeEJBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLDJDQUFBLFNBQUEsUUFBQSxjQUFBO1FBQ0EsT0FBQSxPQUFBLE9BQUEsUUFBQSxHQUFBLFNBQUE7UUFDQSxPQUFBLE9BQUEsVUFBQTs7WUFFQSxjQUFBOzs7UUFHQSxPQUFBLE9BQUEsVUFBQTtTQUNBLGNBQUE7Ozs7Ozs7QUNYQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSx3REFBQSxTQUFBLE9BQUEsUUFBQSxjQUFBOztRQUVBLE9BQUEsT0FBQSxVQUFBO1lBQ0EsT0FBQSxHQUFBLFdBQUE7WUFDQSxPQUFBLEdBQUEsS0FBQSxZQUFBLE9BQUEsR0FBQSxVQUFBO1lBQ0EsT0FBQSxHQUFBLEtBQUEsZ0JBQUEsT0FBQSxHQUFBLFVBQUE7WUFDQSxPQUFBLEdBQUE7V0FDQSxjQUFBOzs7UUFHQSxPQUFBLE9BQUEsVUFBQTtVQUNBLE9BQUEsR0FBQTtTQUNBLGNBQUE7Ozs7Ozs7QUNmQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSx1REFBQSxTQUFBLFFBQUEsUUFBQSxjQUFBOztRQUVBLE9BQUEsT0FBQSxVQUFBOztZQUVBLE9BQUEsR0FBQTtZQUNBLE9BQUEsR0FBQSxPQUFBLFFBQUE7WUFDQSxjQUFBOzs7UUFHQSxPQUFBLE9BQUEsVUFBQTtTQUNBLGNBQUE7Ozs7Ozs7QUNiQSxDQUFBLFlBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSxxRUFBQSxVQUFBLFFBQUEsY0FBQSxlQUFBO0VBQ0EsSUFBQSxLQUFBO0VBQ0EsSUFBQSxPQUFBLGFBQUE7RUFDQSxHQUFBLE1BQUEsS0FBQTtFQUNBLEdBQUEsT0FBQSxhQUFBO0VBQ0EsR0FBQSxPQUFBLFlBQUE7R0FDQSxjQUFBOzs7RUFHQSxHQUFBLE9BQUEsWUFBQTtHQUNBLGNBQUE7O0VBRUEsT0FBQSxPQUFBLFdBQUEsVUFBQSxHQUFBLEdBQUE7R0FDQSxJQUFBLE1BQUEsR0FBQTtJQUNBOztHQUVBLFFBQUEsUUFBQSxHQUFBLFVBQUEsTUFBQSxLQUFBO0lBQ0EsSUFBQSxLQUFBLE1BQUEsS0FBQSxHQUFBLEdBQUEsTUFBQTtLQUNBLFFBQUEsUUFBQSxLQUFBLE1BQUEsUUFBQSxVQUFBLE9BQUEsR0FBQTtNQUNBLElBQUEsTUFBQSxRQUFBLEtBQUEsTUFBQSxRQUFBLEdBQUE7T0FDQSxhQUFBO09BQ0EsS0FBQSxNQUFBLE9BQUEsT0FBQSxHQUFBO2FBQ0EsSUFBQSxNQUFBLFFBQUEsR0FBQTtPQUNBLElBQUEsTUFBQSxVQUFBLEdBQUEsS0FBQTtRQUNBLGFBQUE7UUFDQSxLQUFBLE1BQUEsT0FBQSxPQUFBLEdBQUE7Ozs7S0FJQSxHQUFBLEtBQUEsT0FBQSxLQUFBOzs7R0FHQSxJQUFBLEdBQUEsS0FBQSxVQUFBLEdBQUE7SUFDQSxjQUFBOztLQUVBOzs7OztBQ3RDQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLFFBQUEsb0JBQUEsWUFBQSxlQUFBLFVBQUE7Ozs7Ozs7QUNIQSxDQUFBLFlBQUE7Q0FDQTs7Q0FFQSxTQUFBLGNBQUEsV0FBQSxPQUFBO0VBQ0EsSUFBQSxZQUFBO0VBQ0EsSUFBQSxPQUFBLFNBQUEsZUFBQTtFQUNBLEdBQUEsUUFBQSxLQUFBO0dBQ0EsUUFBQSxRQUFBLFVBQUEsS0FBQSxRQUFBLE9BQUEsK0NBQUEsWUFBQTs7RUFFQTtFQUNBLFNBQUEsWUFBQSxTQUFBLE1BQUEsT0FBQSxTQUFBO0dBQ0EsUUFBQSxRQUFBLFNBQUEsY0FBQSxNQUFBLFlBQUEsS0FBQTtHQUNBLFFBQUEsUUFBQSxTQUFBLGNBQUEsTUFBQSxZQUFBLElBQUEsV0FBQTs7R0FFQSxPQUFBLGVBQUEsT0FBQSxNQUFBOztFQUVBLFNBQUEsY0FBQTtHQUNBLFFBQUEsUUFBQSxTQUFBLGNBQUEsTUFBQSxZQUFBLElBQUEsV0FBQTs7RUFFQSxTQUFBLGVBQUEsT0FBQSxHQUFBLFNBQUE7R0FDQSxJQUFBLE9BQUEsTUFBQTtHQUNBLElBQUEsVUFBQTtHQUNBLElBQUEsVUFBQTtHQUNBLElBQUEsTUFBQSxRQUFBLEtBQUEsT0FBQTtHQUNBLElBQUEsUUFBQSxPQUFBO0dBQ0EsSUFBQSxNQUFBLFFBQUEsUUFBQSxTQUFBLGNBQUEsT0FBQTtHQUNBLElBQUEsTUFBQSxTQUFBLGNBQUEsTUFBQTtHQUNBLElBQUEsUUFBQSxJQUFBLHdCQUFBLE1BQUEsRUFBQSxJQUFBLE1BQUE7R0FDQSxJQUFBLFNBQUEsSUFBQSx3QkFBQSxPQUFBLEVBQUEsSUFBQSxFQUFBLFNBQUE7R0FDQSxPQUFBLFFBQUEsUUFBQSxTQUFBLGNBQUEsT0FBQSxJQUFBLE9BQUEsUUFBQSxNQUFBLElBQUEsUUFBQSxTQUFBOztFQUVBLE9BQUE7R0FDQSxhQUFBO0dBQ0EsYUFBQTtHQUNBLGdCQUFBOzs7Q0FHQSxRQUFBLE9BQUEsa0JBQUEsVUFBQSx3Q0FBQSxVQUFBLFVBQUEsY0FBQTtFQUNBLElBQUE7RUFDQSxXQUFBLFlBQUE7R0FDQSxPQUFBO0lBQ0EsT0FBQTtJQUNBLFFBQUE7SUFDQSxnQkFBQTtJQUNBLFdBQUE7SUFDQSxLQUFBO0lBQ0EsT0FBQTtJQUNBLFFBQUE7SUFDQSxTQUFBO0lBQ0EsU0FBQTtJQUNBLFFBQUE7SUFDQSxZQUFBLEdBQUEsTUFBQSxVQUFBLE9BQUEsQ0FBQSxNQUFBLE9BQUEsTUFBQSxDQUFBLFdBQUE7SUFDQSxZQUFBO0lBQ0EsY0FBQTtJQUNBLFVBQUE7SUFDQSxTQUFBLGNBQUEsbUJBQUE7OztFQUdBLE9BQUE7R0FDQSxVQUFBO0dBQ0EsT0FBQTtJQUNBLFdBQUE7SUFDQSxXQUFBO0lBQ0EsU0FBQTtJQUNBLFlBQUE7SUFDQSxTQUFBO0lBQ0EsU0FBQTs7R0FFQSxTQUFBO0dBQ0EsTUFBQSxVQUFBLE9BQUEsTUFBQSxPQUFBLFNBQUE7SUFDQSxJQUFBLFVBQUEsUUFBQSxPQUFBLFlBQUE7SUFDQSxJQUFBLFFBQUE7S0FDQSxRQUFBO0tBQ0EsU0FBQTtLQUNBLFNBQUE7O0lBRUEsSUFBQSxhQUFBLEdBQUEsSUFBQSxNQUFBLFdBQUEsVUFBQSxHQUFBO0tBQ0EsT0FBQSxXQUFBLEVBQUE7OztJQUdBLFFBQUEsZUFBQSxHQUFBLE1BQUEsTUFBQSxTQUFBLEtBQUEsT0FBQSxDQUFBLEdBQUEsYUFBQSxNQUFBLENBQUEsR0FBQTtJQUNBLFFBQUEsU0FBQTtLQUNBLEdBQUEsUUFBQSxRQUFBO0tBQ0EsR0FBQSxRQUFBLFNBQUE7O0lBRUEsUUFBQSxjQUFBOztJQUVBLElBQUEsZUFBQSxZQUFBO0tBQ0EsR0FBQSxNQUFBLFFBQUEsU0FBQSxVQUFBLEtBQUEsTUFBQSxRQUFBLFNBQUEsR0FBQSxTQUFBLFNBQUEsRUFBQTtNQUNBLFFBQUEsUUFBQSxNQUFBLFFBQUEsVUFBQSxVQUFBLE9BQUEsT0FBQTtPQUNBLElBQUEsSUFBQTtRQUNBLE1BQUEsTUFBQTtRQUNBLE1BQUEsTUFBQTtRQUNBLE9BQUEsTUFBQTtRQUNBLE9BQUEsTUFBQTtRQUNBLE1BQUEsTUFBQTtRQUNBLFNBQUEsYUFBQSxXQUFBLE1BQUE7UUFDQSxNQUFBO1FBQ0EsU0FBQSxNQUFBOztPQUVBLE9BQUEsS0FBQTtPQUNBLFFBQUEsUUFBQSxNQUFBLFVBQUEsVUFBQSxNQUFBO1FBQ0EsSUFBQSxNQUFBLFVBQUEsS0FBQSxPQUFBO1NBQ0EsSUFBQSxPQUFBO1VBQ0EsTUFBQSxLQUFBO1VBQ0EsUUFBQSxNQUFBLFVBQUEsS0FBQSxRQUFBLE1BQUE7VUFDQSxPQUFBLE1BQUEsVUFBQSxLQUFBO1VBQ0EsTUFBQSxLQUFBO1VBQ0EsT0FBQSxNQUFBO1VBQ0EsR0FBQSxRQUFBLE9BQUE7VUFDQSxHQUFBLFFBQUEsT0FBQTtVQUNBLE9BQUEsS0FBQTtVQUNBLE1BQUEsS0FBQTtVQUNBLFNBQUEsYUFBQSxXQUFBLEtBQUE7VUFDQSxNQUFBO1VBQ0EsU0FBQTs7U0FFQSxNQUFBLEtBQUE7Ozs7TUFJQTs7O1NBR0E7TUFDQSxJQUFBLElBQUE7T0FDQSxNQUFBLE1BQUEsUUFBQTtPQUNBLE1BQUEsTUFBQSxRQUFBO09BQ0EsT0FBQSxNQUFBLFFBQUE7T0FDQSxPQUFBLE1BQUEsUUFBQTtPQUNBLE1BQUEsTUFBQSxRQUFBO09BQ0EsU0FBQSxNQUFBLFFBQUE7T0FDQSxNQUFBLE1BQUEsUUFBQTtPQUNBLFVBQUEsTUFBQSxRQUFBOztNQUVBLE9BQUEsS0FBQTtNQUNBLFFBQUEsUUFBQSxNQUFBLFFBQUEsVUFBQSxVQUFBLE1BQUE7T0FDQSxJQUFBLE1BQUEsVUFBQSxLQUFBLE9BQUE7UUFDQSxJQUFBLE9BQUE7U0FDQSxNQUFBLEtBQUE7U0FDQSxRQUFBLE1BQUEsVUFBQSxLQUFBLFFBQUEsTUFBQTtTQUNBLE9BQUEsTUFBQSxVQUFBLEtBQUEsUUFBQSxNQUFBO1NBQ0EsTUFBQSxLQUFBO1NBQ0EsT0FBQSxNQUFBLFFBQUE7U0FDQSxHQUFBLFFBQUEsT0FBQTtTQUNBLEdBQUEsUUFBQSxPQUFBO1NBQ0EsT0FBQSxLQUFBO1NBQ0EsTUFBQSxLQUFBO1NBQ0EsU0FBQSxhQUFBLFdBQUEsS0FBQTtTQUNBLE1BQUE7U0FDQSxTQUFBOztRQUVBLE1BQUEsS0FBQTs7Ozs7SUFLQSxJQUFBLGNBQUEsVUFBQTtLQUNBLFFBQUE7S0FDQSxTQUFBOztJQUVBLElBQUEsZ0JBQUEsVUFBQTtLQUNBLFFBQUEsUUFBQSxPQUFBLFNBQUEsTUFBQSxJQUFBO09BQ0EsUUFBQSxZQUFBLEtBQUEsU0FBQTtRQUNBLEdBQUEsUUFBQSxRQUFBO1FBQ0EsR0FBQSxRQUFBLFNBQUEsS0FBQSxJQUFBO1FBQ0EsUUFBQTs7OztJQUlBLElBQUEsYUFBQSxZQUFBO0tBQ0EsUUFBQSxRQUFBLE1BQUEsS0FBQTtLQUNBLFFBQUEsTUFBQSxHQUFBLE9BQUEsS0FBQSxJQUFBLE9BQUEsT0FBQSxLQUFBLFNBQUEsUUFBQSxPQUFBLEtBQUEsVUFBQSxRQUFBLFFBQUEsS0FBQSxNQUFBOztLQUVBLElBQUEsQ0FBQSxRQUFBLFNBQUE7TUFDQSxJQUFBLEtBQUEsS0FBQTtNQUNBLEdBQUEsT0FBQSxVQUFBLEVBQUE7T0FDQSxJQUFBLFNBQUEsR0FBQSxJQUFBO1NBQ0EsWUFBQTtTQUNBLFlBQUE7U0FDQSxXQUFBLENBQUEsTUFBQSxLQUFBO1NBQ0EsU0FBQSxNQUFBLEtBQUE7T0FDQSxJQUFBLFlBQUEsR0FBQSxJQUFBO1NBQ0EsWUFBQTtTQUNBLFlBQUE7U0FDQSxXQUFBLE1BQUEsS0FBQTtTQUNBLFNBQUEsT0FBQSxLQUFBOztPQUVBLFFBQUEsU0FBQSxRQUFBLElBQUEsT0FBQTtTQUNBLEtBQUEsS0FBQTtTQUNBLEtBQUEsUUFBQSxTQUFBLEVBQUE7U0FDQSxPQUFBLE9BQUEsR0FBQSxTQUFBOztTQUVBLEtBQUEsTUFBQTtTQUNBLEtBQUEsYUFBQSxjQUFBLFFBQUEsTUFBQSxHQUFBLEtBQUEsUUFBQSxPQUFBLElBQUEsUUFBQSxPQUFBLElBQUE7T0FDQSxRQUFBLFlBQUEsUUFBQSxJQUFBLE9BQUE7U0FDQSxLQUFBLEtBQUE7U0FDQSxLQUFBLE1BQUE7U0FDQSxLQUFBLFFBQUEsU0FBQSxFQUFBO1NBQ0EsT0FBQSxPQUFBLEdBQUEsU0FBQTs7U0FFQSxLQUFBLGFBQUEsY0FBQSxRQUFBLE1BQUEsR0FBQSxLQUFBLFFBQUEsT0FBQSxHQUFBOztVQUVBO09BQ0EsSUFBQSxNQUFBLEdBQUEsSUFBQTtTQUNBLFlBQUEsUUFBQSxNQUFBLElBQUE7U0FDQSxZQUFBLFFBQUEsTUFBQTtTQUNBLFdBQUEsS0FBQSxLQUFBO1NBQ0EsU0FBQSxPQUFBLEtBQUE7OztPQUdBLFFBQUEsTUFBQSxRQUFBLElBQUEsT0FBQTtTQUNBLEtBQUEsS0FBQTtTQUNBLEtBQUEsUUFBQSxPQUFBLEdBQUE7U0FDQSxLQUFBLE1BQUE7U0FDQSxLQUFBLGFBQUEsY0FBQSxRQUFBLE1BQUEsR0FBQSxLQUFBLFFBQUEsT0FBQSxHQUFBOzs7O0lBSUEsR0FBQSxRQUFBLFVBQUEsUUFBQSxPQUFBLFVBQUEsRUFBQTtNQUNBLElBQUEsYUFBQSxRQUFBLElBQUEsVUFBQSxlQUFBLEtBQUEsUUFBQSxRQUFBLE9BQUE7UUFDQSxLQUFBLFNBQUE7UUFDQSxLQUFBLFFBQUEsU0FBQSxFQUFBO1FBQ0EsT0FBQSxFQUFBOzs7Ozs7OztRQVFBLEtBQUEsS0FBQTtRQUNBLE1BQUEsYUFBQTtRQUNBLE1BQUEsVUFBQTs7UUFFQSxLQUFBLFNBQUEsUUFBQTtRQUNBLEtBQUEsZUFBQTtRQUNBLEdBQUEsU0FBQSxTQUFBLEVBQUE7UUFDQSxRQUFBLGNBQUEsRUFBQTtRQUNBLFFBQUE7O1FBRUEsS0FBQSxLQUFBLFNBQUEsRUFBQTtRQUNBLElBQUEsUUFBQSxPQUFBLFFBQUE7UUFDQSxHQUFBLFNBQUEsRUFBQTtTQUNBLE9BQUE7O1lBRUE7U0FDQSxPQUFBLFFBQUEsU0FBQTs7O1FBR0EsS0FBQSxTQUFBLEVBQUE7UUFDQSxPQUFBLEVBQUE7Ozs7S0FJQSxRQUFBLGFBQUEsUUFBQSxJQUFBLFVBQUEsVUFBQSxLQUFBLE9BQUEsUUFBQSxPQUFBLEtBQUEsS0FBQSxhQUFBLGdCQUFBLFFBQUEsUUFBQSxLQUFBLE9BQUEsUUFBQSxTQUFBLEtBQUEsS0FBQSxLQUFBLFNBQUE7Ozs7OztLQU1BLFFBQUEsVUFBQSxRQUFBLFdBQUEsT0FBQSxVQUFBLEtBQUEsS0FBQSxHQUFBLEtBQUEsU0FBQSxVQUFBLEdBQUE7TUFDQSxPQUFBLEVBQUEsU0FBQSxRQUFBLFdBQUEsRUFBQTtTQUNBLEtBQUEsZ0JBQUEsR0FBQSxLQUFBLFVBQUEsVUFBQSxHQUFBO01BQ0EsT0FBQSxHQUFBLElBQUEsUUFBQSxXQUFBLEVBQUEsUUFBQTtRQUNBLEtBQUEsTUFBQSxVQUFBLEdBQUE7O01BRUEsT0FBQSxZQUFBLEVBQUE7O0tBRUEsUUFBQSxRQUFBLFFBQUEsV0FBQSxPQUFBO09BQ0EsS0FBQSxlQUFBO09BQ0EsS0FBQSxhQUFBLFVBQUEsR0FBQTs7O09BR0EsS0FBQSxlQUFBO09BQ0EsS0FBQSxRQUFBLFNBQUEsRUFBQTtPQUNBLE9BQUEsRUFBQSxVQUFBLFNBQUEsRUFBQTs7T0FFQSxNQUFBLFdBQUEsU0FBQSxFQUFBO09BQ0EsR0FBQSxFQUFBLFFBQUE7UUFDQSxPQUFBOztXQUVBO1FBQ0EsT0FBQTs7O09BR0EsS0FBQSxVQUFBLEdBQUE7T0FDQSxPQUFBLEVBQUEsV0FBQTs7S0FFQSxRQUFBLE1BQUEsR0FBQSxhQUFBLFVBQUEsR0FBQSxHQUFBO01BQ0EsT0FBQSxhQUFBLEdBQUEsR0FBQTtRQUNBLEdBQUEsWUFBQSxVQUFBLEdBQUEsR0FBQTtNQUNBLE9BQUEsYUFBQSxHQUFBLEdBQUE7UUFDQSxHQUFBLFNBQUEsVUFBQSxHQUFBLEdBQUE7O01BRUEsUUFBQSxjQUFBLEVBQUE7TUFDQSxRQUFBOztLQUVBLFFBQUEsUUFBQSxhQUFBLFNBQUEsUUFBQSxVQUFBLEtBQUEsS0FBQSxVQUFBLEdBQUE7TUFDQSxPQUFBLEVBQUE7O0tBRUEsUUFBQSxNQUFBLGFBQUEsU0FBQSxRQUFBLFVBQUEsS0FBQSxhQUFBLFVBQUEsR0FBQTtNQUNBLE9BQUEsRUFBQSxTQUFBLE9BQUE7UUFDQSxLQUFBLEtBQUEsVUFBQSxHQUFBO01BQ0EsT0FBQSxFQUFBLFNBQUEsTUFBQTs7O0lBR0EsSUFBQSxhQUFBLFlBQUE7O0tBRUEsTUFBQSxRQUFBLFVBQUEsR0FBQSxHQUFBO01BQ0EsUUFBQSxRQUFBLGFBQUEsU0FBQSxRQUFBLFVBQUEsTUFBQSxJQUFBLFFBQUE7UUFDQSxLQUFBLEtBQUEsVUFBQSxHQUFBO1FBQ0EsRUFBQSxTQUFBLEVBQUEsUUFBQSxNQUFBLFVBQUEsRUFBQSxRQUFBLE1BQUE7UUFDQSxPQUFBLE1BQUEsVUFBQSxFQUFBLFFBQUEsTUFBQTs7TUFFQSxRQUFBLE1BQUEsYUFBQSxTQUFBLFFBQUEsVUFBQSxNQUFBLElBQUEsUUFBQTtRQUNBLEtBQUEsYUFBQSxVQUFBLEdBQUE7UUFDQSxPQUFBLENBQUEsTUFBQSxVQUFBLEVBQUEsUUFBQSxNQUFBLGNBQUEsT0FBQTs7UUFFQSxLQUFBLEtBQUEsVUFBQSxHQUFBO1FBQ0EsT0FBQSxDQUFBLE1BQUEsVUFBQSxFQUFBLFFBQUEsTUFBQSxjQUFBLE1BQUE7Ozs7SUFJQSxJQUFBLFNBQUEsVUFBQSxHQUFBO0tBQ0EsT0FBQSxDQUFBLEtBQUEsSUFBQSxFQUFBLFFBQUEsT0FBQTs7SUFFQSxJQUFBLFFBQUEsWUFBQTtLQUNBLE9BQUEsUUFBQSxRQUFBLEdBQUEsT0FBQSxRQUFBLE1BQUEsT0FBQSxLQUFBLENBQUEsUUFBQSxPQUFBLFFBQUEsU0FBQSxNQUFBOztJQUVBLElBQUEsb0JBQUEsWUFBQTtLQUNBLFFBQUEsTUFBQSxRQUFBLFFBQUEsZ0JBQUEsT0FBQSxRQUFBLFNBQUEsTUFBQSxHQUFBLFFBQUEsVUFBQSxHQUFBO01BQ0EsUUFBQSxXQUFBLEtBQUEsb0JBQUEsRUFBQSxRQUFBLEtBQUEsYUFBQSxVQUFBLEdBQUE7T0FDQSxPQUFBLGVBQUEsRUFBQSxJQUFBLE1BQUEsRUFBQSxJQUFBOzs7S0FHQSxRQUFBLE1BQUE7O0lBRUEsSUFBQSxpQkFBQSxZQUFBO0tBQ0EsUUFBQSxNQUFBLFFBQUEsUUFBQSxnQkFBQSxPQUFBLFFBQUEsU0FBQSxLQUFBLEdBQUEsUUFBQSxVQUFBLEdBQUE7TUFDQSxRQUFBLFdBQUEsS0FBQSxpQkFBQSxFQUFBLFFBQUEsS0FBQSxhQUFBLFVBQUEsR0FBQTtPQUNBLE9BQUEsZUFBQSxFQUFBLElBQUEsTUFBQSxFQUFBLElBQUE7OztLQUdBLFFBQUEsTUFBQTs7SUFFQSxJQUFBLHNCQUFBLFVBQUEsT0FBQTtLQUNBLE9BQUEsQ0FBQSxVQUFBLE9BQUE7TUFDQSxPQUFBLFVBQUEsR0FBQTtPQUNBLEVBQUEsSUFBQSxFQUFBLElBQUEsQ0FBQSxRQUFBLE1BQUEsSUFBQSxFQUFBLE1BQUEsUUFBQSxTQUFBLFFBQUEsT0FBQTtPQUNBLEVBQUEsSUFBQSxFQUFBLElBQUEsQ0FBQSxRQUFBLE9BQUEsSUFBQSxFQUFBLE1BQUEsUUFBQSxTQUFBLFFBQUEsUUFBQTs7UUFFQTs7SUFFQSxJQUFBLG1CQUFBLFVBQUEsT0FBQTtLQUNBLE9BQUEsQ0FBQSxVQUFBLE9BQUE7TUFDQSxPQUFBLFVBQUEsR0FBQTtPQUNBLEVBQUEsSUFBQSxFQUFBLElBQUEsQ0FBQSxRQUFBLE9BQUEsSUFBQSxFQUFBLE1BQUEsUUFBQSxTQUFBLFFBQUEsUUFBQTtPQUNBLEVBQUEsSUFBQSxFQUFBLElBQUEsQ0FBQSxNQUFBLEVBQUEsTUFBQSxRQUFBLFNBQUEsUUFBQSxRQUFBOztRQUVBOztJQUVBLElBQUEsbUJBQUEsVUFBQSxPQUFBO0tBQ0EsT0FBQSxDQUFBLFVBQUEsT0FBQTtNQUNBLE9BQUEsVUFBQSxHQUFBOztPQUVBLElBQUE7T0FDQSxTQUFBLFFBQUEsWUFBQSxFQUFBO09BQ0EsRUFBQSxJQUFBLEVBQUEsSUFBQSxDQUFBLE9BQUEsSUFBQSxFQUFBLE1BQUEsT0FBQSxTQUFBLFFBQUEsUUFBQTtPQUNBLE9BQUEsRUFBQSxJQUFBLEVBQUEsSUFBQSxDQUFBLE9BQUEsSUFBQSxFQUFBLE1BQUEsT0FBQSxTQUFBLFFBQUEsUUFBQTs7UUFFQTs7SUFFQSxJQUFBLGVBQUEsVUFBQSxNQUFBLEdBQUEsU0FBQTtLQUNBLElBQUE7S0FDQSxVQUFBLDJCQUFBLEtBQUEsT0FBQTtLQUNBLFFBQUEsUUFBQSxLQUFBLEtBQUEsVUFBQSxVQUFBLE1BQUE7TUFDQSxXQUFBLHlDQUFBLEtBQUEsU0FBQSxLQUFBLFNBQUEsVUFBQSxLQUFBLFNBQUE7O0tBRUEsU0FBQSxRQUFBLFFBQUEsWUFBQSxTQUFBLE1BQUEsR0FBQSxPQUFBLE1BQUEsWUFBQTs7O0lBR0EsSUFBQSxlQUFBLFVBQUEsTUFBQSxHQUFBLFNBQUE7S0FDQSxPQUFBLFFBQUEsUUFBQTs7O0lBR0EsTUFBQSxPQUFBLGFBQUEsVUFBQSxNQUFBLFNBQUE7S0FDQSxRQUFBLFFBQUE7O0tBRUEsSUFBQSxRQUFBLFdBQUEsTUFBQTtNQUNBO01BQ0E7TUFDQTtZQUNBO01BQ0E7O0tBRUEsR0FBQSxPQUFBLFVBQUEsS0FBQSxRQUFBLFVBQUEsS0FBQTtPQUNBOztTQUVBO09BQ0E7Ozs7SUFJQSxNQUFBLE9BQUEsV0FBQSxVQUFBLEdBQUEsR0FBQTtLQUNBLEdBQUEsTUFBQSxFQUFBO01BQ0E7O0tBRUEsR0FBQSxPQUFBLEVBQUEsR0FBQSxZQUFBLFlBQUE7TUFDQSxRQUFBLFFBQUE7TUFDQTtNQUNBO01BQ0E7TUFDQTs7TUFFQSxHQUFBLE9BQUEsVUFBQSxLQUFBLFFBQUEsVUFBQSxLQUFBO1FBQ0E7OztVQUdBOztRQUVBOzs7OztJQUtBLE1BQUEsT0FBQSxhQUFBLFVBQUEsTUFBQSxNQUFBO0tBQ0EsSUFBQSxTQUFBLE1BQUE7TUFDQTs7S0FFQSxJQUFBLFFBQUEsT0FBQTtNQUNBO1lBQ0E7TUFDQTs7Ozs7Ozs7QUNqYkEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxRQUFBLG9CQUFBLFlBQUEsbUJBQUEsVUFBQTs7Ozs7O0FDSEEsQ0FBQSxZQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGtCQUFBLFVBQUEsNEJBQUEsVUFBQSxVQUFBO0VBQ0EsSUFBQSxXQUFBLFlBQUE7R0FDQSxPQUFBO0lBQ0EsT0FBQTtJQUNBLFFBQUE7SUFDQSxPQUFBO0lBQ0EsTUFBQTtJQUNBLE9BQUE7OztFQUdBLE9BQUE7R0FDQSxVQUFBO0dBQ0EsWUFBQTtHQUNBLE9BQUE7SUFDQSxTQUFBOztHQUVBLFNBQUE7R0FDQSxNQUFBLFVBQUEsUUFBQSxTQUFBLFFBQUEsU0FBQTs7O0lBR0EsT0FBQSxVQUFBLFFBQUEsT0FBQSxZQUFBLE9BQUE7OztJQUdBLElBQUEsU0FBQSxHQUFBLE1BQUE7TUFDQSxPQUFBLENBQUEsR0FBQSxPQUFBLFFBQUE7TUFDQSxNQUFBLENBQUEsR0FBQTtNQUNBLE1BQUE7OztJQUdBLElBQUEsTUFBQSxHQUFBLE9BQUEsUUFBQSxJQUFBLE9BQUE7TUFDQSxLQUFBLFNBQUEsT0FBQSxRQUFBO01BQ0EsS0FBQSxVQUFBLE9BQUEsUUFBQTtNQUNBLE9BQUE7SUFDQSxJQUFBLFlBQUEsSUFBQSxPQUFBO01BQ0EsS0FBQSxhQUFBLGVBQUEsT0FBQSxRQUFBLFFBQUEsSUFBQSxNQUFBLE9BQUEsUUFBQSxTQUFBLElBQUE7SUFDQSxJQUFBLGFBQUEsVUFBQSxPQUFBO01BQ0EsS0FBQSxLQUFBLE9BQUEsUUFBQSxRQUFBLElBQUE7TUFDQSxLQUFBLGdCQUFBO01BQ0EsS0FBQSxVQUFBLE9BQUEsUUFBQTtNQUNBLE1BQUEsV0FBQTtNQUNBLEtBQUEsUUFBQTtJQUNBLElBQUEsTUFBQSxHQUFBLElBQUE7TUFDQSxXQUFBO01BQ0EsWUFBQSxVQUFBLEdBQUE7TUFDQSxPQUFBLE9BQUEsUUFBQSxRQUFBLElBQUE7O01BRUEsWUFBQSxVQUFBLEdBQUE7TUFDQSxPQUFBLE9BQUEsUUFBQSxRQUFBOztJQUVBLElBQUEsY0FBQSxVQUFBLE9BQUE7TUFDQSxNQUFBO01BQ0EsVUFBQSxJQUFBLEtBQUEsS0FBQTs7TUFFQSxNQUFBLFFBQUEsT0FBQSxRQUFBO01BQ0EsS0FBQSxLQUFBO0lBQ0EsSUFBQSxPQUFBLFVBQUEsVUFBQTtNQUNBLEtBQUEsQ0FBQTtNQUNBO01BQ0EsT0FBQTtNQUNBLEtBQUEsVUFBQSxHQUFBO01BQ0EsT0FBQSxPQUFBOztNQUVBLE1BQUEsUUFBQSxPQUFBLFFBQUE7TUFDQSxNQUFBLGVBQUE7TUFDQSxLQUFBLGVBQUE7TUFDQSxLQUFBLEtBQUE7OztJQUdBLFNBQUEsVUFBQSxRQUFBO0tBQ0EsWUFBQTtPQUNBLFNBQUE7T0FDQSxLQUFBLFVBQUEsT0FBQSxVQUFBLElBQUEsS0FBQTtLQUNBLEtBQUEsYUFBQSxTQUFBLEtBQUEsTUFBQSxRQUFBLFVBQUEsR0FBQTtNQUNBLElBQUEsT0FBQSxLQUFBLFlBQUEsTUFBQTtNQUNBLElBQUEsSUFBQSxHQUFBLFlBQUEsU0FBQSxLQUFBLEtBQUE7TUFDQSxPQUFBLFVBQUEsR0FBQTtPQUNBLEtBQUEsY0FBQSxRQUFBLEtBQUEsTUFBQSxFQUFBLEtBQUEsS0FBQTs7Ozs7O0lBTUEsU0FBQSxTQUFBLFlBQUEsVUFBQTtLQUNBLFdBQUEsVUFBQSxLQUFBLFVBQUEsR0FBQTtNQUNBLElBQUEsY0FBQSxHQUFBLFlBQUEsRUFBQSxVQUFBO01BQ0EsT0FBQSxVQUFBLEdBQUE7T0FDQSxFQUFBLFdBQUEsWUFBQTtPQUNBLE9BQUEsSUFBQTs7Ozs7SUFLQSxPQUFBLE9BQUEsV0FBQSxVQUFBLEdBQUEsR0FBQTtLQUNBLElBQUEsTUFBQSxHQUFBO01BQ0E7O0tBRUEsV0FBQSxNQUFBLFVBQUEsRUFBQTtLQUNBLFlBQUEsTUFBQSxRQUFBLEVBQUE7S0FDQSxLQUFBLE1BQUEsUUFBQSxFQUFBO0tBQ0EsU0FBQSxZQUFBO01BQ0EsVUFBQSxRQUFBLFlBQUEsRUFBQTs7Ozs7SUFLQSxPQUFBO0tBQ0EsWUFBQTtNQUNBLE9BQUEsUUFBQTs7S0FFQSxVQUFBLEdBQUEsR0FBQTtNQUNBLElBQUEsQ0FBQSxHQUFBO09BQ0EsSUFBQTtPQUNBLEVBQUEsT0FBQSxRQUFBLFNBQUEsT0FBQSxRQUFBOztNQUVBLFNBQUEsWUFBQTtPQUNBLFVBQUEsRUFBQSxPQUFBLFFBQUE7Ozs7Ozs7Ozs7QUN0SEEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGtCQUFBLFdBQUEsV0FBQSxXQUFBO0VBQ0EsSUFBQSxXQUFBLFVBQUE7R0FDQSxPQUFBO0lBQ0EsT0FBQTtJQUNBLE9BQUE7OztFQUdBLE9BQUE7R0FDQSxVQUFBO0dBQ0EsYUFBQTtHQUNBLFlBQUE7R0FDQSxNQUFBO0lBQ0EsUUFBQTtJQUNBLFdBQUE7O0dBRUEsTUFBQSxVQUFBLFFBQUEsU0FBQSxRQUFBLFFBQUE7S0FDQSxJQUFBLFVBQUEsUUFBQSxPQUFBLFlBQUEsT0FBQTs7Ozs7Ozs7QUNuQkEsQ0FBQSxZQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsMEJBQUEsVUFBQSxRQUFBO0VBQ0EsT0FBQSxVQUFBO0VBQ0E7O0VBRUEsU0FBQSxVQUFBO0dBQ0EsT0FBQTtHQUNBLE9BQUEsT0FBQSxXQUFBLFNBQUEsRUFBQSxFQUFBO0lBQ0EsR0FBQSxNQUFBLEVBQUE7S0FDQTs7SUFFQSxPQUFBOzs7RUFHQSxTQUFBLFNBQUE7R0FDQSxPQUFBLFVBQUE7SUFDQSxhQUFBO0lBQ0EsTUFBQSxDQUFBO0tBQ0EsUUFBQTtNQUNBLEdBQUE7TUFDQSxHQUFBOztLQUVBLE9BQUE7S0FDQSxPQUFBOztJQUVBLE9BQUEsQ0FBQTtLQUNBLFFBQUE7TUFDQSxHQUFBO01BQ0EsR0FBQSxPQUFBLFFBQUE7O0tBRUEsT0FBQTtLQUNBLE9BQUEsT0FBQSxRQUFBOzs7Ozs7OztBQ2pDQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsa0JBQUEsV0FBQSxpQkFBQSxXQUFBOztFQUVBLE9BQUE7R0FDQSxVQUFBO0dBQ0EsT0FBQTtJQUNBLE1BQUE7O0dBRUEsUUFBQTtHQUNBLGFBQUE7R0FDQSxZQUFBO0dBQ0EsY0FBQTtHQUNBLGtCQUFBO0dBQ0EsTUFBQSxVQUFBLE9BQUEsU0FBQSxPQUFBOztJQUVBLElBQUEsS0FBQTtJQUNBLElBQUEsS0FBQSxRQUFBO0lBQ0EsSUFBQSxTQUFBLFFBQUE7SUFDQSxPQUFBLEdBQUEsY0FBQSxTQUFBLEVBQUE7S0FDQSxRQUFBLFNBQUE7T0FDQSxHQUFBLGNBQUEsU0FBQSxFQUFBO0tBQ0EsUUFBQSxZQUFBOzs7Ozs7Ozs7O0FDdkJBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsUUFBQSxvQkFBQSxZQUFBLHFCQUFBLFVBQUE7O0VBRUEsSUFBQSxLQUFBO0VBQ0EsR0FBQSxZQUFBO0VBQ0EsR0FBQSxTQUFBO0VBQ0EsR0FBQSxpQkFBQTs7RUFFQSxTQUFBLFFBQUE7R0FDQSxPQUFBLEdBQUEsS0FBQSxjQUFBLGNBQUE7O0VBRUEsU0FBQSxnQkFBQTtHQUNBLEdBQUEsS0FBQSxjQUFBLENBQUEsR0FBQSxLQUFBO0dBQ0EsR0FBQSxLQUFBOztFQUVBLFNBQUEsVUFBQSxLQUFBO0dBQ0EsSUFBQSxLQUFBLFNBQUEsS0FBQSxtQkFBQSxLQUFBLGdCQUFBLEtBQUEsTUFBQSxVQUFBLEdBQUE7SUFDQSxPQUFBOztHQUVBLE9BQUE7Ozs7OztBQ3JCQSxDQUFBLFlBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsa0JBQUEsVUFBQSx1QkFBQSxVQUFBLFVBQUE7RUFDQSxJQUFBLFdBQUEsWUFBQTtHQUNBLE9BQUE7SUFDQSxJQUFBO0lBQ0EsT0FBQTtJQUNBLFFBQUE7SUFDQSxNQUFBO0lBQ0EsT0FBQTtJQUNBLFVBQUE7SUFDQSxRQUFBO0tBQ0EsTUFBQTtLQUNBLE9BQUE7S0FDQSxLQUFBO0tBQ0EsUUFBQTs7SUFFQSxRQUFBLEVBQUE7S0FDQSxVQUFBO0tBQ0EsT0FBQTtLQUNBLFNBQUE7T0FDQTtLQUNBLFVBQUE7S0FDQSxPQUFBO0tBQ0EsU0FBQTtNQUNBO0tBQ0EsVUFBQTtLQUNBLE9BQUE7S0FDQSxTQUFBOzs7O0VBSUEsT0FBQTtHQUNBLFVBQUE7R0FDQSxPQUFBO0lBQ0EsTUFBQTtJQUNBLFNBQUE7O0dBRUEsU0FBQTtHQUNBLE1BQUEsVUFBQSxRQUFBLFNBQUEsUUFBQSxTQUFBOztJQUVBLElBQUEsVUFBQSxRQUFBLE9BQUEsWUFBQTtJQUNBLFVBQUEsUUFBQSxPQUFBLFNBQUEsT0FBQTtJQUNBLFFBQUEsU0FBQSxJQUFBLE9BQUE7SUFDQSxHQUFBLFFBQUEsTUFBQTtLQUNBLFFBQUEsT0FBQSxHQUFBLFFBQUEsUUFBQTs7SUFFQSxRQUFBLElBQUEsVUFBQSxRQUFBLFNBQUEsTUFBQSxJQUFBLGlCQUFBLFFBQUEsU0FBQSxJQUFBO0lBQ0EsSUFBQSxNQUFBO0lBQ0EsUUFBQSxRQUFBLE9BQUEsTUFBQSxVQUFBLEtBQUEsS0FBQTtLQUNBLE1BQUEsR0FBQSxJQUFBLENBQUEsS0FBQSxTQUFBLElBQUEsUUFBQTs7SUFFQSxJQUFBLElBQUEsR0FBQSxNQUFBO01BQ0EsT0FBQSxDQUFBLEdBQUE7TUFDQSxNQUFBLENBQUEsUUFBQSxPQUFBLE1BQUEsUUFBQSxRQUFBLFFBQUEsT0FBQTtNQUNBLE1BQUE7O0lBRUEsSUFBQSxRQUFBLEdBQUEsSUFBQTtNQUNBLEVBQUE7TUFDQSxPQUFBLENBQUEsR0FBQTtNQUNBLEdBQUEsU0FBQTtNQUNBLEdBQUEsWUFBQTs7SUFFQSxJQUFBLE1BQUEsR0FBQSxPQUFBLFFBQUEsSUFBQSxPQUFBO01BQ0EsS0FBQSxTQUFBLFFBQUE7TUFDQSxLQUFBLFVBQUEsUUFBQTtNQUNBLE9BQUE7O0lBRUEsSUFBQSxXQUFBLElBQUEsT0FBQTtNQUNBLE9BQUE7TUFDQSxLQUFBLE1BQUEsUUFBQSxNQUFBLFFBQUE7TUFDQSxLQUFBLE1BQUE7TUFDQSxLQUFBLE1BQUE7TUFDQSxLQUFBLE1BQUE7TUFDQSxLQUFBLE1BQUE7TUFDQSxLQUFBLGdCQUFBO0lBQ0EsUUFBQSxRQUFBLFFBQUEsUUFBQSxVQUFBLE9BQUE7S0FDQSxTQUFBLE9BQUE7T0FDQSxLQUFBLFVBQUEsTUFBQSxXQUFBO09BQ0EsS0FBQSxjQUFBLE1BQUE7T0FDQSxLQUFBLGdCQUFBLE1BQUE7O0lBRUEsSUFBQSxPQUFBLElBQUEsT0FBQTtNQUNBLEtBQUEsU0FBQSxRQUFBO01BQ0EsS0FBQSxVQUFBLFFBQUE7TUFDQSxNQUFBLFFBQUEsV0FBQSxRQUFBLE1BQUEsUUFBQSxTQUFBO0lBQ0EsSUFBQSxTQUFBLElBQUEsT0FBQSxLQUFBLEtBQUEsYUFBQSxlQUFBLFFBQUEsU0FBQSxJQUFBLE9BQUEsUUFBQSxTQUFBLElBQUE7TUFDQSxLQUFBLFNBQUE7O0lBRUEsSUFBQSxRQUFBLFNBQUEsTUFBQTtLQUNBLE9BQUEsT0FBQTtPQUNBLEtBQUEsS0FBQSxRQUFBLFNBQUE7S0FDQSxPQUFBLE9BQUE7T0FDQSxLQUFBO09BQ0EsTUFBQSxhQUFBLFFBQUEsT0FBQTtPQUNBLEtBQUEsZUFBQTtPQUNBLEtBQUEsS0FBQTtLQUNBLElBQUEsVUFBQSxJQUFBLE9BQUEsS0FBQSxLQUFBLGFBQUEsZ0JBQUEsUUFBQSxTQUFBLFFBQUEsU0FBQSxNQUFBLE9BQUEsUUFBQSxTQUFBLElBQUE7T0FDQSxLQUFBLFNBQUE7S0FDQSxRQUFBLE9BQUE7T0FDQSxLQUFBLEtBQUEsUUFBQSxTQUFBO0tBQ0EsUUFBQSxPQUFBO09BQ0EsS0FBQSxVQUFBOztPQUVBLEdBQUEsTUFBQSxLQUFBO1FBQ0EsSUFBQSxJQUFBLENBQUEsU0FBQSxPQUFBLE1BQUE7UUFDQSxPQUFBLEVBQUEsT0FBQSxHQUFBLEVBQUEsUUFBQSxTQUFBOztPQUVBLE9BQUE7O09BRUEsTUFBQSxhQUFBLFFBQUEsT0FBQTtPQUNBLEtBQUEsZUFBQTtPQUNBLEtBQUEsS0FBQTs7SUFFQSxJQUFBLFNBQUEsSUFBQSxPQUFBO01BQ0EsS0FBQSxTQUFBO0lBQ0EsR0FBQSxRQUFBLFlBQUEsS0FBQTtLQUNBLE9BQUEsS0FBQTs7O0lBR0EsT0FBQSxPQUFBO01BQ0EsS0FBQSxVQUFBLFFBQUE7O0lBRUEsSUFBQSxRQUFBLFNBQUEsTUFBQTtJQUNBLE9BQUEsT0FBQTtNQUNBLEtBQUEsTUFBQSxRQUFBLFFBQUE7TUFDQSxLQUFBLE1BQUE7TUFDQSxLQUFBLE1BQUEsUUFBQSxRQUFBO01BQ0EsS0FBQSxNQUFBLFFBQUE7TUFDQSxLQUFBLG9CQUFBO01BQ0EsS0FBQSxnQkFBQTtNQUNBLEtBQUEsVUFBQTs7SUFFQSxJQUFBLGFBQUEsT0FBQSxPQUFBO01BQ0EsS0FBQSxhQUFBLGlCQUFBLFFBQUEsU0FBQSxJQUFBO0lBQ0EsSUFBQSxTQUFBLFdBQUEsT0FBQTtNQUNBLEtBQUEsU0FBQTtNQUNBLEtBQUEsS0FBQSxRQUFBLFNBQUE7S0FDQSxHQUFBLFFBQUEsTUFBQTtNQUNBLE9BQUEsTUFBQSxRQUFBLFFBQUE7O0lBRUEsSUFBQSxjQUFBLFdBQUEsT0FBQTtNQUNBLEtBQUE7TUFDQSxNQUFBLGFBQUEsUUFBQSxPQUFBO01BQ0EsS0FBQSxlQUFBLFVBQUEsS0FBQSxLQUFBOzs7Ozs7SUFNQSxTQUFBLFFBQUE7S0FDQSxJQUFBLFFBQUEsTUFBQSxTQUFBOztLQUVBLElBQUEsR0FBQSxNQUFBLGFBQUE7TUFDQSxRQUFBLEVBQUEsT0FBQSxHQUFBLE1BQUEsTUFBQTtNQUNBLE1BQUEsT0FBQSxDQUFBLE9BQUE7O0tBRUEsR0FBQSxTQUFBLFNBQUEsS0FBQTtNQUNBLElBQUEsSUFBQSxDQUFBLFNBQUEsU0FBQSxNQUFBO01BQ0EsWUFBQSxLQUFBLEVBQUEsT0FBQSxHQUFBLEVBQUEsUUFBQSxTQUFBOztTQUVBO01BQ0EsWUFBQSxLQUFBLFNBQUE7OztLQUdBLFdBQUEsS0FBQSxhQUFBLGVBQUEsRUFBQSxTQUFBLE1BQUEsUUFBQSxTQUFBLElBQUE7OztJQUdBLFNBQUEsVUFBQTs7S0FFQSxJQUFBLFFBQUEsTUFBQSxTQUFBO01BQ0EsUUFBQTtNQUNBLFFBQUE7S0FDQSxJQUFBLFFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7SUFnQkEsT0FBQSxPQUFBLFdBQUEsU0FBQSxFQUFBLEVBQUE7S0FDQSxHQUFBLE1BQUEsRUFBQTtNQUNBOztLQUVBLFFBQUEsT0FBQSxHQUFBLFFBQUEsRUFBQTtLQUNBLFdBQUEsSUFBQSxPQUFBO09BQ0EsT0FBQTtPQUNBLEtBQUEsTUFBQSxRQUFBLE1BQUEsSUFBQSxFQUFBO09BQ0EsS0FBQSxNQUFBO09BQ0EsS0FBQSxNQUFBO09BQ0EsS0FBQSxNQUFBO09BQ0EsS0FBQSxNQUFBO09BQ0EsS0FBQSxnQkFBQTtLQUNBLFFBQUEsUUFBQSxRQUFBLFFBQUEsVUFBQSxPQUFBO01BQ0EsU0FBQSxPQUFBO1FBQ0EsS0FBQSxVQUFBLE1BQUEsV0FBQTtRQUNBLEtBQUEsY0FBQSxNQUFBO1FBQ0EsS0FBQSxnQkFBQSxNQUFBOztLQUVBLEtBQUEsTUFBQSxRQUFBLFVBQUEsUUFBQSxRQUFBLElBQUEsRUFBQSxNQUFBO0tBQ0EsT0FBQSxNQUFBLFFBQUEsRUFBQTtLQUNBLFlBQUEsS0FBQSxTQUFBLFFBQUEsWUFBQSxFQUFBO0tBQ0EsV0FBQSxhQUFBLFNBQUEsS0FBQSxLQUFBLFFBQUEsS0FBQSxhQUFBLGVBQUEsRUFBQSxRQUFBLFlBQUEsRUFBQSxVQUFBLE1BQUEsUUFBQSxTQUFBLElBQUE7O0lBRUEsT0FBQTtLQUNBLFlBQUE7TUFDQSxPQUFBLFFBQUE7O0tBRUEsVUFBQSxVQUFBLFVBQUE7TUFDQSxJQUFBLENBQUEsVUFBQTtPQUNBLFlBQUEsS0FBQSxTQUFBO09BQ0EsV0FBQSxLQUFBLGFBQUEsZUFBQSxFQUFBLEtBQUEsTUFBQSxRQUFBLFNBQUEsSUFBQTtPQUNBOztNQUVBLFlBQUEsS0FBQSxTQUFBLFNBQUEsUUFBQTtNQUNBLElBQUEsWUFBQSxVQUFBO09BQ0EsV0FBQSxLQUFBLGFBQUEsZUFBQSxFQUFBLFNBQUEsUUFBQSxVQUFBLE1BQUEsUUFBQSxTQUFBLElBQUE7YUFDQTtPQUNBLFdBQUEsYUFBQSxTQUFBLEtBQUEsS0FBQSxRQUFBLEtBQUEsYUFBQSxlQUFBLEVBQUEsU0FBQSxRQUFBLFVBQUEsTUFBQSxRQUFBLFNBQUEsSUFBQTs7Ozs7Ozs7Ozs7QUNwT0EsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxRQUFBLG9CQUFBLFlBQUEsY0FBQSxVQUFBOzs7Ozs7QUNIQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsa0JBQUEsV0FBQSw2REFBQSxTQUFBLFFBQUEsVUFBQSxRQUFBLGNBQUE7O0VBRUEsT0FBQTtHQUNBLFVBQUE7R0FDQSxhQUFBO0dBQ0EsWUFBQTtHQUNBLFFBQUE7R0FDQSxNQUFBLFVBQUEsUUFBQSxTQUFBLFFBQUE7OztJQUdBLE9BQUEsT0FBQSxRQUFBLFNBQUEsRUFBQSxFQUFBO0tBQ0EsR0FBQSxJQUFBLEdBQUEsT0FBQTtLQUNBLFFBQUEsSUFBQTs7SUFFQSxJQUFBLFNBQUE7SUFDQSxJQUFBLFVBQUEsR0FBQSxXQUFBLEdBQUEsYUFBQSxHQUFBO0lBQ0EsSUFBQSxPQUFBO0lBQ0EsSUFBQSxXQUFBO0lBQ0EsSUFBQSxtQkFBQTtJQUNBLElBQUEsU0FBQSxRQUFBLEtBQUE7S0FDQSxJQUFBLFFBQUEsUUFBQSxLQUFBO0tBQ0EsSUFBQSxhQUFBO0tBQ0EsSUFBQSxNQUFBO0tBQ0EsSUFBQSxVQUFBO0tBQ0EsTUFBQSxJQUFBLEVBQUEsUUFBQTtLQUNBLE9BQUEsS0FBQSxTQUFBLFdBQUE7T0FDQSxNQUFBLEdBQUE7O0tBRUEsTUFBQSxLQUFBLFNBQUEsU0FBQSxFQUFBO01BQ0EsYUFBQTtNQUNBLE1BQUE7TUFDQSxVQUFBOztNQUVBLFNBQUE7TUFDQSxVQUFBLEdBQUEsV0FBQSxHQUFBLGFBQUEsR0FBQTtNQUNBLE9BQUE7TUFDQSxXQUFBO09BQ0EsU0FBQSxVQUFBO1FBQ0EsYUFBQTtRQUNBLElBQUEsTUFBQSxLQUFBLE1BQUEsTUFBQSxHQUFBLE1BQUEsR0FBQTtTQUNBLGdCQUFBO1NBQ0EsT0FBQTtTQUNBLGVBQUE7U0FDQSxLQUFBLFNBQUEsSUFBQTtVQUNBLFFBQUEsUUFBQSxJQUFBLEtBQUEsSUFBQSxTQUFBLE1BQUEsSUFBQTtXQUNBLEdBQUEsTUFBQSxTQUFBLE9BQUEsR0FBQTtZQUNBLGdEQUFBLE9BQUEsS0FBQSxLQUFBLFdBQUEsY0FBQSxRQUFBLFNBQUEsQ0FBQSxFQUFBO2FBQ0EsSUFBQSxRQUFBO2NBQ0EsS0FBQTtjQUNBLFFBQUE7Y0FDQSxRQUFBO2NBQ0EsT0FBQTs7YUFFQSxJQUFBLE9BQUEsS0FBQTthQUNBLE9BQUEsS0FBQTs7OztVQUlBLEdBQUEsV0FBQTtXQUNBLFFBQUEsUUFBQSxJQUFBLEtBQUEsSUFBQSxTQUFBLE1BQUEsSUFBQTtZQUNBLEdBQUEsSUFBQSxVQUFBLEVBQUE7YUFDQSxHQUFBLE9BQUEsUUFBQSxLQUFBLFFBQUEsWUFBQTtlQUNBLFFBQUEsS0FBQSxPQUFBOzthQUVBLFFBQUEsS0FBQSxLQUFBLEtBQUE7Ozs7O2NBS0E7V0FDQSxhQUFBLFFBQUE7Ozs7O1NBS0Esa0JBQUEsU0FBQTtTQUNBOzs7VUFHQSxJQUFBLFFBQUEsTUFBQSxPQUFBLGVBQUE7V0FDQSxJQUFBLFlBQUE7WUFDQSxJQUFBLFdBQUEsTUFBQSxPQUFBLEdBQUEsT0FBQSxPQUFBOztVQUVBLEdBQUEsU0FBQSxTQUFBLEVBQUE7WUFDQSxXQUFBLE1BQUEsT0FBQSxHQUFBLE9BQUEsT0FBQTtXQUNBLFlBQUE7O1VBRUEsSUFBQSxRQUFBOztVQUVBLElBQUEsSUFBQSxJQUFBLEdBQUEsS0FBQSxTQUFBLFFBQUEsSUFBQTtXQUNBLEdBQUEsU0FBQSxHQUFBO1lBQ0EsU0FBQSxLQUFBLFNBQUEsR0FBQSxRQUFBLGNBQUEsS0FBQTtZQUNBLEdBQUEsU0FBQSxHQUFBLFFBQUEsT0FBQSxDQUFBLEVBQUE7YUFDQSxTQUFBLEtBQUEsU0FBQSxHQUFBLE9BQUEsR0FBQSxTQUFBLEdBQUEsUUFBQTs7WUFFQSxJQUFBLE9BQUEsU0FBQSxHQUFBLE1BQUE7WUFDQSxHQUFBLEtBQUEsU0FBQSxFQUFBO2FBQ0EsU0FBQSxLQUFBO2FBQ0EsSUFBQSxJQUFBLElBQUEsR0FBQSxJQUFBLEtBQUEsUUFBQSxJQUFBO2NBQ0EsR0FBQSxNQUFBLEtBQUEsSUFBQTtlQUNBLEdBQUEsSUFBQSxFQUFBO2dCQUNBLFNBQUEsTUFBQTs7ZUFFQSxTQUFBLE1BQUEsS0FBQTs7Ozs7WUFLQSxHQUFBLFNBQUEsR0FBQSxVQUFBLEVBQUE7YUFDQSxNQUFBLEtBQUE7Ozs7VUFJQSxHQUFBLFNBQUEsVUFBQSxNQUFBLE9BQUE7V0FDQSxhQUFBO1lBQ0EsSUFBQSxJQUFBLElBQUEsR0FBQSxLQUFBLFNBQUEsUUFBQSxJQUFBO2FBQ0EsR0FBQSxPQUFBLFFBQUEsU0FBQSxPQUFBLFlBQUE7Y0FDQSxRQUFBLFNBQUEsTUFBQTs7YUFFQSxRQUFBLFNBQUEsSUFBQSxPQUFBOzs7O1lBSUEsT0FBQSxTQUFBLEtBQUEsYUFBQSxNQUFBLE9BQUE7O1NBRUEsT0FBQSxTQUFBLEtBQUE7U0FDQTtVQUNBLGFBQUEsTUFBQTs7U0FFQSxVQUFBLFNBQUE7U0FDQTtVQUNBLGFBQUEsVUFBQTs7O1VBR0EsR0FBQSxDQUFBLFdBQUE7V0FDQSxRQUFBLFFBQUEsYUFBQSxnQkFBQSxLQUFBLElBQUEsU0FBQSxNQUFBLElBQUE7WUFDQSxHQUFBLElBQUEsY0FBQSxRQUFBLFVBQUEsQ0FBQSxLQUFBLElBQUEsY0FBQSxRQUFBLFdBQUEsQ0FBQSxFQUFBO2FBQ0EsYUFBQSxZQUFBOzthQUVBLEdBQUEsSUFBQSxjQUFBLFFBQUEsY0FBQSxDQUFBLEVBQUE7Y0FDQSxhQUFBLGdCQUFBOzs7O2NBSUE7V0FDQSxRQUFBLFFBQUEsU0FBQSxTQUFBLEtBQUEsSUFBQTtZQUNBLEtBQUEsU0FBQTtZQUNBLEdBQUEsSUFBQSxpQkFBQSxlQUFBLE9BQUEsT0FBQSxZQUFBO2FBQ0EsSUFBQSxJQUFBLENBQUEsSUFBQSxJQUFBO2FBQ0EsUUFBQSxRQUFBLEtBQUEsTUFBQSxTQUFBLFFBQUEsRUFBQTtjQUNBLEVBQUEsVUFBQSxLQUFBO2NBQ0EsR0FBQSxNQUFBLFdBQUEsU0FBQSxHQUFBO2VBQ0EsR0FBQSxPQUFBLFdBQUEsaUJBQUEsUUFBQSxTQUFBLEtBQUEsT0FBQSxXQUFBLGNBQUEsUUFBQSxTQUFBLENBQUEsRUFBQTtnQkFDQSxLQUFBLE9BQUEsS0FBQTtpQkFDQSxLQUFBO2lCQUNBLFFBQUE7aUJBQ0EsUUFBQTs7Z0JBRUE7Ozs7YUFJQSxhQUFBLFFBQUEsQ0FBQSxLQUFBLENBQUEsSUFBQSxPQUFBLEtBQUE7OztXQUdBLGFBQUEsWUFBQTs7OztVQUlBLGFBQUE7VUFDQSxPQUFBLEtBQUEsYUFBQSxjQUFBLG9CQUFBO1VBQ0EsT0FBQSxHQUFBOzs7Ozs7Ozs7Ozs7OztBQzlLQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLFFBQUEsb0JBQUEsWUFBQSxnQkFBQSxVQUFBOzs7Ozs7O0FDSEEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGtCQUFBLFdBQUEsbUJBQUEsV0FBQTtFQUNBLElBQUEsV0FBQSxVQUFBO0dBQ0EsT0FBQTtJQUNBLE9BQUE7OztFQUdBLE9BQUE7R0FDQSxVQUFBO0dBQ0EsTUFBQTtJQUNBLEtBQUE7SUFDQSxVQUFBO0lBQ0EsUUFBQTs7R0FFQSxhQUFBO0dBQ0EsWUFBQTtHQUNBLE1BQUEsVUFBQSxRQUFBLFNBQUEsUUFBQTtJQUNBLE9BQUEsVUFBQSxRQUFBLE9BQUEsWUFBQSxPQUFBO0lBQ0EsT0FBQTtJQUNBLE9BQUE7Ozs7Ozs7O0FDckJBLENBQUEsWUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLGtDQUFBLFVBQUEsUUFBQTtFQUNBLE9BQUEsU0FBQTtHQUNBLFNBQUE7R0FDQSxVQUFBO0dBQ0EsVUFBQTtHQUNBLGFBQUE7R0FDQSxpQkFBQTtHQUNBLGtCQUFBO0dBQ0EsZUFBQTtHQUNBLGlCQUFBO0dBQ0EsVUFBQTs7RUFFQSxPQUFBLFFBQUE7R0FDQSxTQUFBO0lBQ0EsT0FBQTs7R0FFQSxNQUFBOztFQUVBLE9BQUEsV0FBQSxZQUFBO0dBQ0EsT0FBQSxNQUFBLFFBQUEsUUFBQTtJQUNBLE1BQUE7SUFDQSxnQkFBQTtJQUNBLFFBQUE7S0FDQSxLQUFBO0tBQ0EsT0FBQTtLQUNBLFFBQUE7S0FDQSxNQUFBOztJQUVBLEdBQUEsVUFBQSxHQUFBO0tBQ0EsT0FBQSxFQUFBOztJQUVBLEdBQUEsVUFBQSxHQUFBO0tBQ0EsT0FBQSxFQUFBOztJQUVBLFlBQUE7SUFDQSxZQUFBO0lBQ0EsV0FBQTtJQUNBLG9CQUFBO0lBQ0EseUJBQUE7OztJQUdBLE9BQUE7S0FDQSxXQUFBOztJQUVBLE9BQUE7S0FDQSxXQUFBO0tBQ0EsbUJBQUE7O0lBRUEsUUFBQTtLQUNBLFlBQUE7O0lBRUEsT0FBQTtLQUNBLGFBQUE7Ozs7R0FJQSxJQUFBLE9BQUEsUUFBQSxVQUFBLE1BQUE7SUFDQSxPQUFBLE1BQUEsUUFBQSxNQUFBLFVBQUEsQ0FBQSxTQUFBLE9BQUEsTUFBQSxNQUFBLE9BQUEsTUFBQTs7R0FFQSxPQUFBLE9BQUE7O0VBRUEsT0FBQSxpQkFBQSxZQUFBO0dBQ0EsSUFBQSxZQUFBO0dBQ0EsT0FBQSxRQUFBO0lBQ0EsS0FBQTtJQUNBLEtBQUE7O0dBRUEsUUFBQSxRQUFBLE9BQUEsV0FBQSxVQUFBLE1BQUEsS0FBQTtJQUNBLElBQUEsUUFBQTtLQUNBLElBQUE7S0FDQSxLQUFBLEtBQUE7S0FDQSxPQUFBLEtBQUE7S0FDQSxRQUFBOztJQUVBLFFBQUEsUUFBQSxPQUFBLE1BQUEsVUFBQSxNQUFBLEdBQUE7S0FDQSxNQUFBLE9BQUEsS0FBQTtNQUNBLElBQUE7TUFDQSxHQUFBLEtBQUEsS0FBQSxPQUFBO01BQ0EsR0FBQSxLQUFBLEtBQUEsT0FBQTs7S0FFQSxPQUFBLE1BQUEsTUFBQSxLQUFBLElBQUEsT0FBQSxNQUFBLEtBQUEsS0FBQSxLQUFBLE9BQUE7S0FDQSxPQUFBLE1BQUEsTUFBQSxLQUFBLElBQUEsT0FBQSxNQUFBLEtBQUEsS0FBQSxLQUFBLE9BQUE7O0lBRUEsVUFBQSxLQUFBOzs7R0FHQSxPQUFBLE1BQUEsT0FBQTtHQUNBLElBQUEsT0FBQSxRQUFBLFVBQUEsUUFBQTtJQUNBLE9BQUEsTUFBQSxRQUFBLE1BQUEsVUFBQSxDQUFBLFNBQUEsT0FBQSxNQUFBLE1BQUEsT0FBQSxNQUFBOzs7RUFHQSxPQUFBLE9BQUEsUUFBQSxVQUFBLEdBQUEsR0FBQTtHQUNBLElBQUEsQ0FBQSxHQUFBO0lBQ0E7O0dBRUEsT0FBQTs7RUFFQSxPQUFBLE9BQUEsYUFBQSxVQUFBLEdBQUEsR0FBQTtHQUNBLElBQUEsTUFBQSxHQUFBO0lBQ0E7O0dBRUEsT0FBQTs7Ozs7O0FDeEdBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxrQkFBQSxVQUFBLGlCQUFBLENBQUEsZUFBQSxTQUFBLGFBQUE7O0VBRUEsSUFBQSxTQUFBO1FBQ0EsSUFBQSxTQUFBOztRQUVBLFNBQUEsTUFBQSxJQUFBO1lBQ0EsSUFBQSxLQUFBLEdBQUEsR0FBQSxhQUFBO1lBQ0EsSUFBQSxDQUFBLElBQUE7Z0JBQ0EsS0FBQSxFQUFBO2dCQUNBLEdBQUEsR0FBQSxhQUFBLHFCQUFBOztZQUVBLE9BQUE7O1FBRUEsU0FBQSxTQUFBLElBQUE7WUFDQSxJQUFBLFFBQUEsT0FBQTtZQUNBLElBQUEsQ0FBQSxPQUFBO2dCQUNBLFFBQUE7Z0JBQ0EsT0FBQSxNQUFBOztZQUVBLE9BQUE7OztRQUdBLFNBQUEsZUFBQSxTQUFBLE9BQUEsVUFBQSxTQUFBLFFBQUE7WUFDQSxPQUFBLFdBQUE7Z0JBQ0EsTUFBQSxZQUFBO2dCQUNBLE1BQUEsV0FBQTtnQkFDQSxNQUFBLFNBQUE7Z0JBQ0EsU0FBQSxRQUFBLFFBQUEsV0FBQTtvQkFDQSxJQUFBLFdBQUEsTUFBQSxXQUFBLFFBQUE7d0JBQ0EsUUFBQSxHQUFBLE1BQUEsU0FBQTs7b0JBRUEsTUFBQSxZQUFBO29CQUNBLE1BQUEsV0FBQTtvQkFDQSxNQUFBOzs7OztRQUtBLE9BQUE7WUFDQSxPQUFBLFNBQUEsU0FBQSxRQUFBOztvQkFFQSxJQUFBLFFBQUEsU0FBQSxNQUFBO29CQUNBLElBQUEsU0FBQSxDQUFBLE1BQUEsYUFBQSxNQUFBO3dCQUNBLE1BQUEsU0FBQSxRQUFBLEdBQUE7b0JBQ0EsSUFBQSxXQUFBLFlBQUEsU0FBQTt3QkFDQSxNQUFBLENBQUEsUUFBQSxTQUFBLE1BQUEsU0FBQTt3QkFDQSxJQUFBLENBQUEsUUFBQSxPQUFBLFNBQUE7O29CQUVBLElBQUEsVUFBQTt3QkFDQSxJQUFBLE1BQUEsV0FBQTs0QkFDQSxNQUFBOzhCQUNBLGVBQUE7NkNBQ0E7NkNBQ0E7NkNBQ0E7NkNBQ0E7NEJBQ0EsT0FBQSxNQUFBLFNBQUE7OzZCQUVBOzRCQUNBLE1BQUEsU0FBQTs0QkFDQSxPQUFBLGVBQUE7a0RBQ0E7a0RBQ0E7a0RBQ0E7a0RBQ0E7Ozs7Z0JBSUE7O1lBRUEsT0FBQSxTQUFBLFNBQUEsUUFBQTs7b0JBRUEsSUFBQSxRQUFBLFNBQUEsTUFBQTtvQkFDQSxJQUFBLFNBQUEsQ0FBQSxNQUFBLGFBQUEsTUFBQTt3QkFDQSxNQUFBLFNBQUEsUUFBQSxHQUFBOztvQkFFQSxJQUFBLFdBQUEsWUFBQSxTQUFBO3dCQUNBLE1BQUEsQ0FBQSxRQUFBLE9BQUEsU0FBQTt3QkFDQSxJQUFBLENBQUEsUUFBQSxTQUFBLE1BQUEsU0FBQTs7b0JBRUEsSUFBQSxVQUFBO3dCQUNBLElBQUEsTUFBQSxXQUFBOzRCQUNBLE1BQUEsU0FBQSxlQUFBOzBEQUNBOzBEQUNBOzBEQUNBOzBEQUNBOzRCQUNBLE9BQUEsTUFBQSxTQUFBOzs2QkFFQTs0QkFDQSxNQUFBLFNBQUE7NEJBQ0EsT0FBQSxlQUFBO2tEQUNBO2tEQUNBO2tEQUNBO2tEQUNBOzs7O2dCQUlBOzs7Ozs7QUN0R0EsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxRQUFBLG9CQUFBLFlBQUEsbUJBQUEsVUFBQTs7Ozs7O0FDSEEsQ0FBQSxZQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGtCQUFBLFVBQUEsWUFBQTs7Q0FFQSxTQUFBLFVBQUEsQ0FBQSxZQUFBOztDQUVBLFNBQUEsU0FBQSxVQUFBLGNBQUE7RUFDQSxPQUFBO0dBQ0EsVUFBQTtHQUNBLFNBQUE7R0FDQSxZQUFBO0dBQ0EsYUFBQTtHQUNBLE1BQUE7OztFQUdBLFNBQUEscUJBQUEsUUFBQSxTQUFBLFFBQUE7Ozs7O0FDaEJBLENBQUEsV0FBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLGtEQUFBLFNBQUEsUUFBQSxTQUFBLFVBQUE7RUFDQSxPQUFBLE9BQUE7RUFDQSxPQUFBLFdBQUE7RUFDQSxPQUFBLGlCQUFBO0VBQ0EsT0FBQSxnQkFBQTtFQUNBLE9BQUEsY0FBQTtFQUNBLE9BQUEsYUFBQTtFQUNBLE9BQUEsZ0JBQUE7RUFDQSxPQUFBLGFBQUE7RUFDQTs7RUFFQSxTQUFBLFdBQUE7R0FDQSxPQUFBO0dBQ0EsT0FBQTtHQUNBLE9BQUE7R0FDQSxPQUFBO0dBQ0EsT0FBQTtHQUNBLE9BQUEsT0FBQSx1QkFBQSxTQUFBLFNBQUEsU0FBQTtJQUNBLElBQUEsWUFBQSxTQUFBO0tBQ0EsT0FBQTs7SUFFQSxPQUFBO0lBQ0EsT0FBQTtJQUNBLE9BQUE7SUFDQSxPQUFBOztHQUVBLE9BQUEsT0FBQSxXQUFBLFNBQUEsR0FBQSxHQUFBO0lBQ0EsSUFBQSxNQUFBLEdBQUE7S0FDQTs7SUFFQSxPQUFBOzs7O0VBSUEsU0FBQSxhQUFBO0dBQ0EsT0FBQSxPQUFBLENBQUEsT0FBQTtHQUNBOztFQUVBLFNBQUEsY0FBQTtHQUNBLElBQUEsT0FBQTtHQUNBLFFBQUEsUUFBQSxPQUFBLE1BQUEsU0FBQSxNQUFBO0lBQ0EsS0FBQSxPQUFBLFFBQUEsWUFBQSxRQUFBLFdBQUEsS0FBQSxPQUFBLFFBQUEsWUFBQTtJQUNBLEtBQUEsV0FBQSxTQUFBLEtBQUE7O0dBRUEsSUFBQSxTQUFBLFFBQUEsV0FBQSxPQUFBLEtBQUEsQ0FBQSxPQUFBLFFBQUEsWUFBQSxNQUFBLFVBQUE7R0FDQSxLQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsT0FBQSxRQUFBLEtBQUE7SUFDQSxJQUFBLE9BQUEsR0FBQSxPQUFBLE9BQUEsUUFBQSxLQUFBO0tBQ0EsT0FBQSxJQUFBOzs7R0FHQSxPQUFBLFFBQUEsT0FBQSxRQUFBLFlBQUEsS0FBQSxXQUFBOztFQUVBLFNBQUEsV0FBQSxRQUFBO0dBQ0EsSUFBQSxTQUFBLFFBQUEsV0FBQSxPQUFBLEtBQUEsQ0FBQSxPQUFBLFFBQUEsWUFBQSxNQUFBLFVBQUE7R0FDQSxJQUFBLE9BQUE7R0FDQSxRQUFBLFFBQUEsUUFBQSxTQUFBLE1BQUEsSUFBQTtJQUNBLEdBQUEsS0FBQSxXQUFBLFFBQUEsUUFBQTtLQUNBLE9BQUE7OztHQUdBLE9BQUEsS0FBQTs7RUFFQSxTQUFBLGdCQUFBO0dBQ0EsT0FBQSxVQUFBLENBQUEsT0FBQSxRQUFBLFFBQUEsWUFBQTs7O0VBR0EsU0FBQSxnQkFBQTtHQUNBLE9BQUEsZ0JBQUE7SUFDQSxPQUFBLE9BQUEsUUFBQSxRQUFBLFlBQUE7SUFDQSxPQUFBLE9BQUEsUUFBQSxRQUFBLFlBQUE7SUFDQSxVQUFBO0lBQ0EsT0FBQTtLQUNBLEtBQUE7OztHQUdBLE9BQUEsbUJBQUE7SUFDQSxPQUFBLE9BQUEsUUFBQSxRQUFBLFlBQUE7SUFDQSxPQUFBLE9BQUEsUUFBQSxRQUFBLFlBQUE7SUFDQSxVQUFBO0lBQ0EsT0FBQTtLQUNBLEtBQUE7Ozs7O0VBS0EsU0FBQSxXQUFBO0dBQ0EsT0FBQSxRQUFBO0lBQ0EsU0FBQTtLQUNBLE9BQUE7TUFDQSxNQUFBOztNQUVBLGdCQUFBO01BQ0EsUUFBQTtPQUNBLEtBQUE7T0FDQSxPQUFBO09BQ0EsUUFBQTtPQUNBLE1BQUE7O01BRUEsR0FBQSxTQUFBLEdBQUE7T0FDQSxPQUFBLEVBQUE7O01BRUEsR0FBQSxTQUFBLEdBQUE7T0FDQSxPQUFBLEVBQUE7O01BRUEsWUFBQTtNQUNBLFdBQUE7TUFDQSxvQkFBQTtNQUNBLHlCQUFBO01BQ0EsUUFBQSxDQUFBLEtBQUE7TUFDQSxPQUFBO09BQ0EsV0FBQTs7TUFFQSxPQUFBO09BQ0EsV0FBQTtPQUNBLG1CQUFBOztNQUVBLFFBQUE7T0FDQSxZQUFBO09BQ0EsUUFBQTtRQUNBLFFBQUE7OztNQUdBLE9BQUE7T0FDQSxhQUFBOzs7O0lBSUEsTUFBQTs7R0FFQSxPQUFBLE9BQUE7OztFQUdBLFNBQUEsaUJBQUE7R0FDQSxJQUFBLFlBQUE7R0FDQSxRQUFBLFFBQUEsT0FBQSxRQUFBLFlBQUEsVUFBQSxTQUFBLE1BQUEsS0FBQTtJQUNBLElBQUEsUUFBQTtLQUNBLEtBQUEsS0FBQTtLQUNBLE9BQUEsS0FBQTtLQUNBLFFBQUE7O0lBRUEsUUFBQSxRQUFBLE9BQUEsUUFBQSxLQUFBLFNBQUEsTUFBQTtLQUNBLE1BQUEsT0FBQSxLQUFBO01BQ0EsR0FBQSxLQUFBO01BQ0EsR0FBQSxLQUFBLEtBQUE7OztJQUdBLFVBQUEsS0FBQTs7R0FFQSxPQUFBLE1BQUEsT0FBQTs7Ozs7O0FDdkpBLENBQUEsWUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxrQkFBQSxVQUFBLFlBQUEsWUFBQTtFQUNBLElBQUEsV0FBQSxVQUFBO0lBQ0EsT0FBQTtNQUNBLE1BQUE7OztFQUdBLE9BQUE7R0FDQSxVQUFBOztHQUVBLFlBQUE7R0FDQSxPQUFBO0lBQ0EsTUFBQTs7R0FFQSxNQUFBLFVBQUEsUUFBQSxTQUFBLFFBQUE7SUFDQSxJQUFBLFVBQUEsUUFBQSxPQUFBLFlBQUE7SUFDQSxPQUFBO0lBQ0EsT0FBQTtJQUNBLElBQUEsUUFBQTtLQUNBLFNBQUE7S0FDQSxTQUFBLENBQUEsU0FBQTtLQUNBLElBQUEsR0FBQSxNQUFBLFNBQUEsTUFBQSxDQUFBLEdBQUEsSUFBQSxLQUFBO0tBQ0EsSUFBQSxHQUFBLE1BQUEsTUFBQSxTQUFBLEtBQUEsT0FBQSxDQUFBLEdBQUEsSUFBQSxNQUFBLENBQUEsR0FBQTs7S0FFQSxVQUFBO0tBQ0EsV0FBQTtLQUNBLGNBQUE7O0lBRUEsSUFBQSxNQUFBLEdBQUEsT0FBQSxRQUFBOzs7SUFHQSxJQUFBLE1BQUEsSUFBQSxPQUFBO01BQ0EsS0FBQSxTQUFBLFFBQUEsVUFBQTtNQUNBLEtBQUEsVUFBQSxTQUFBLFVBQUE7TUFDQSxPQUFBO01BQ0EsS0FBQSxhQUFBLGVBQUEsQ0FBQSxTQUFBLFNBQUEsU0FBQSxXQUFBOzs7Ozs7OztJQVFBLElBQUEsWUFBQSxHQUFBLE9BQUE7TUFDQSxLQUFBO01BQ0EsTUFBQSxVQUFBLEdBQUE7TUFDQSxPQUFBOzs7SUFHQSxJQUFBLE1BQUEsR0FBQSxJQUFBO01BQ0EsV0FBQSxVQUFBLEdBQUE7TUFDQSxPQUFBLEtBQUEsSUFBQSxHQUFBLEtBQUEsSUFBQSxJQUFBLEtBQUEsSUFBQSxFQUFBLEVBQUE7O01BRUEsU0FBQSxVQUFBLEdBQUE7TUFDQSxPQUFBLEtBQUEsSUFBQSxHQUFBLEtBQUEsSUFBQSxJQUFBLEtBQUEsSUFBQSxFQUFBLEVBQUEsSUFBQSxFQUFBOztNQUVBLFlBQUEsVUFBQSxHQUFBO01BQ0EsT0FBQSxLQUFBLElBQUEsR0FBQSxFQUFBLElBQUEsRUFBQSxFQUFBLEtBQUEsRUFBQTs7TUFFQSxZQUFBLFVBQUEsR0FBQTtNQUNBLE9BQUEsS0FBQSxJQUFBLEdBQUEsRUFBQSxFQUFBLElBQUEsRUFBQTs7O0lBR0EsSUFBQSxXQUFBO0tBQ0EsV0FBQTtLQUNBLFdBQUE7S0FDQSxXQUFBOzs7SUFHQSxJQUFBLFFBQUEsVUFBQSxNQUFBLE9BQUE7O0lBRUEsSUFBQSxPQUFBLElBQUEsVUFBQSxRQUFBLEtBQUE7SUFDQSxLQUFBLFFBQUEsT0FBQTtNQUNBLEtBQUEsTUFBQSxVQUFBLEdBQUEsR0FBQTtNQUNBLE9BQUEsVUFBQTs7TUFFQSxLQUFBLEtBQUE7TUFDQSxLQUFBLGFBQUE7TUFDQSxLQUFBLFNBQUEsVUFBQSxHQUFBO01BQ0EsT0FBQSxFQUFBLFFBQUEsV0FBQTs7TUFFQSxNQUFBLFFBQUE7TUFDQSxHQUFBLFNBQUE7O0lBRUEsSUFBQSxPQUFBLElBQUEsVUFBQSxRQUFBLEtBQUE7SUFDQSxJQUFBLFlBQUEsS0FBQSxRQUFBLE9BQUE7TUFDQSxNQUFBLGdCQUFBO01BQ0EsS0FBQSxlQUFBLFVBQUEsR0FBQTtNQUNBLElBQUEsRUFBQTtPQUNBLE9BQUE7OztPQUdBLE9BQUE7O01BRUEsS0FBQSxNQUFBLFVBQUEsR0FBQTtNQUNBLE9BQUEsVUFBQSxFQUFBOztNQUVBLEtBQUEsU0FBQSxVQUFBLEdBQUE7TUFDQSxPQUFBOztNQUVBLEtBQUEsTUFBQSxVQUFBLEdBQUE7TUFDQSxPQUFBLEVBQUEsUUFBQSxTQUFBOztNQUVBLEtBQUEsYUFBQSxVQUFBLEdBQUE7TUFDQSxJQUFBLFlBQUEsQ0FBQSxFQUFBLFFBQUEsSUFBQSxNQUFBLEtBQUEsU0FBQTtPQUNBLGNBQUEsRUFBQSxJQUFBLE1BQUEsSUFBQSxDQUFBO09BQ0EsUUFBQSxFQUFBLEVBQUEsSUFBQSxFQUFBLEtBQUEsS0FBQSxNQUFBLEtBQUEsS0FBQSxNQUFBLFlBQUEsYUFBQTtPQUNBLFNBQUEsU0FBQSxZQUFBLENBQUEsS0FBQTtPQUNBLFNBQUEsQ0FBQSxFQUFBLEVBQUEsS0FBQSxlQUFBO09BQ0EsWUFBQSxRQUFBLEtBQUEsQ0FBQSxNQUFBO01BQ0EsSUFBQSxFQUFBLFFBQUEsWUFBQSxFQUFBLFFBQUEsVUFBQSxVQUFBO01BQ0EsSUFBQSxFQUFBLFNBQUEsR0FBQTtPQUNBLFNBQUEsQ0FBQTtPQUNBLFNBQUE7T0FDQSxXQUFBO2FBQ0EsSUFBQSxFQUFBLFNBQUEsR0FBQSxVQUFBLENBQUE7V0FDQSxJQUFBLEVBQUEsU0FBQSxHQUFBLFVBQUEsQ0FBQTtXQUNBLElBQUEsRUFBQSxTQUFBLEdBQUEsVUFBQTtNQUNBLE9BQUEsWUFBQSxTQUFBLGdCQUFBLFNBQUEsYUFBQSxXQUFBOztNQUVBLEdBQUEsU0FBQTs7SUFFQSxVQUFBLE9BQUE7TUFDQSxLQUFBLEtBQUE7TUFDQSxLQUFBLFVBQUEsR0FBQTs7TUFFQSxJQUFBLEVBQUEsU0FBQSxLQUFBLEVBQUEsUUFBQSxZQUFBLEVBQUEsUUFBQSxZQUFBLEVBQUEsUUFBQSxZQUFBLEVBQUEsUUFBQTtPQUNBLE9BQUEsRUFBQSxLQUFBLE1BQUEsS0FBQSxLQUFBLE9BQUEsRUFBQSxLQUFBLE1BQUEsS0FBQSxNQUFBOztPQUVBLE9BQUEsRUFBQSxLQUFBLE1BQUEsS0FBQTs7SUFFQSxVQUFBLE9BQUE7TUFDQSxLQUFBLEtBQUE7TUFDQSxLQUFBLE1BQUE7TUFDQSxLQUFBLFVBQUEsR0FBQTs7TUFFQSxJQUFBLEVBQUEsU0FBQSxLQUFBLEVBQUEsUUFBQSxZQUFBLEVBQUEsUUFBQSxZQUFBLEVBQUEsUUFBQSxZQUFBLEVBQUEsUUFBQTtPQUNBLE9BQUEsQ0FBQSxFQUFBLEtBQUEsTUFBQSxLQUFBLE1BQUEsTUFBQSxPQUFBLEVBQUEsS0FBQSxNQUFBLEtBQUEsTUFBQTs7T0FFQSxPQUFBLENBQUEsRUFBQSxLQUFBLE1BQUEsS0FBQSxNQUFBLE1BQUEsT0FBQSxFQUFBLEtBQUEsTUFBQSxLQUFBLE1BQUE7O0lBRUEsVUFBQSxPQUFBO01BQ0EsS0FBQSxLQUFBO01BQ0EsS0FBQSxNQUFBO01BQ0EsS0FBQSxVQUFBLEdBQUE7TUFDQSxJQUFBLEVBQUEsU0FBQSxLQUFBLEVBQUEsUUFBQSxZQUFBLEVBQUEsUUFBQSxZQUFBLEVBQUEsUUFBQSxZQUFBLEVBQUEsUUFBQTtPQUNBLE9BQUEsQ0FBQSxFQUFBLEtBQUEsTUFBQSxLQUFBLE1BQUEsTUFBQSxPQUFBLEVBQUEsS0FBQSxNQUFBLEtBQUEsTUFBQTs7T0FFQSxPQUFBLENBQUEsRUFBQSxLQUFBLE1BQUEsS0FBQSxNQUFBLE1BQUEsT0FBQSxFQUFBLEtBQUEsTUFBQSxLQUFBLE1BQUEsSUFBQTs7O0lBR0EsU0FBQSxNQUFBLEdBQUE7O0tBRUEsS0FBQTtPQUNBLFNBQUE7T0FDQSxVQUFBLEtBQUEsU0FBQTs7OztLQUlBLEtBQUEsTUFBQSxjQUFBLFVBQUEsR0FBQTtPQUNBLE9BQUEsV0FBQSxHQUFBLEtBQUEsT0FBQSxHQUFBLE9BQUEsTUFBQSxNQUFBOztPQUVBO09BQ0EsU0FBQTtPQUNBLFVBQUEsZUFBQSxVQUFBLEdBQUE7T0FDQSxPQUFBLFlBQUE7UUFDQSxJQUFBLEVBQUE7U0FDQSxPQUFBOzs7U0FHQSxPQUFBOzs7T0FHQSxVQUFBLGFBQUEsVUFBQSxHQUFBO09BQ0EsSUFBQSxZQUFBLENBQUEsRUFBQSxRQUFBLElBQUEsTUFBQSxLQUFBLFNBQUE7T0FDQSxPQUFBLFlBQUE7UUFDQSxJQUFBLFlBQUEsQ0FBQSxFQUFBLFFBQUEsSUFBQSxNQUFBLEtBQUEsU0FBQTtTQUNBLGNBQUEsRUFBQSxJQUFBLE1BQUEsSUFBQSxDQUFBO1NBQ0EsUUFBQSxFQUFBLEVBQUEsSUFBQSxFQUFBLEtBQUEsS0FBQSxNQUFBLEtBQUEsS0FBQSxNQUFBLFlBQUEsYUFBQTtTQUNBLFNBQUEsU0FBQSxZQUFBLENBQUEsS0FBQTtTQUNBLFNBQUEsQ0FBQSxFQUFBLEVBQUEsS0FBQSxlQUFBO1NBQ0EsWUFBQSxRQUFBLEtBQUEsQ0FBQSxNQUFBO1FBQ0EsSUFBQSxFQUFBLFFBQUEsWUFBQSxFQUFBLFFBQUEsVUFBQSxVQUFBO1FBQ0EsSUFBQSxFQUFBLFNBQUEsR0FBQTtTQUNBLFNBQUEsQ0FBQTtTQUNBLFNBQUE7U0FDQSxXQUFBO2VBQ0EsSUFBQSxFQUFBLFNBQUEsR0FBQSxVQUFBLENBQUE7YUFDQSxJQUFBLEVBQUEsU0FBQSxHQUFBLFVBQUEsQ0FBQTthQUNBLElBQUEsRUFBQSxTQUFBLEdBQUEsVUFBQTtRQUNBLE9BQUEsWUFBQSxTQUFBLGdCQUFBLFNBQUEsYUFBQSxXQUFBOzs7T0FHQSxNQUFBLGdCQUFBLFVBQUEsR0FBQTtPQUNBLE9BQUEsV0FBQSxHQUFBLEtBQUEsSUFBQTs7T0FFQSxLQUFBLE9BQUEsVUFBQSxHQUFBO09BQ0EsR0FBQSxPQUFBLE1BQUEsTUFBQSxjQUFBLFdBQUEsR0FBQSxLQUFBLE9BQUE7Ozs7O0lBS0EsU0FBQSxXQUFBLEdBQUEsR0FBQTtLQUNBLElBQUEsTUFBQSxHQUFBLE9BQUE7S0FDQSxJQUFBLEVBQUEsVUFBQTtNQUNBLE9BQUEsRUFBQSxTQUFBLEtBQUEsVUFBQSxHQUFBO09BQ0EsT0FBQSxXQUFBLEdBQUE7OztLQUdBLE9BQUE7OztJQUdBLFNBQUEsU0FBQSxHQUFBOzs7S0FHQSxJQUFBLEVBQUE7TUFDQSxPQUFBLEVBQUE7VUFDQTtNQUNBLE9BQUE7Ozs7Ozs7Ozs7OztJQVlBLFNBQUEsU0FBQSxHQUFBO0tBQ0EsSUFBQSxLQUFBLEtBQUE7TUFDQSxLQUFBLEdBQUEsWUFBQSxFQUFBLFVBQUEsQ0FBQSxFQUFBLEdBQUEsRUFBQSxJQUFBLEVBQUEsS0FBQTtNQUNBLEtBQUEsR0FBQSxZQUFBLEVBQUEsVUFBQSxDQUFBLEVBQUEsR0FBQTtNQUNBLEtBQUEsR0FBQSxZQUFBLEVBQUEsU0FBQSxDQUFBLEVBQUEsSUFBQSxLQUFBLEdBQUE7O0tBRUEsT0FBQSxVQUFBLEdBQUE7TUFDQSxPQUFBLFVBQUEsR0FBQTtPQUNBLEVBQUEsT0FBQSxHQUFBO09BQ0EsRUFBQSxPQUFBLEdBQUEsSUFBQSxNQUFBLEdBQUE7T0FDQSxPQUFBLElBQUE7Ozs7O0lBS0EsU0FBQSxLQUFBLEdBQUE7S0FDQSxPQUFBLEVBQUEsV0FBQSxLQUFBLElBQUEsTUFBQSxNQUFBLEVBQUEsU0FBQSxJQUFBLFNBQUEsRUFBQSxJQUFBLEVBQUE7Ozs7Ozs7QUN4UEEsQ0FBQSxZQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsMkJBQUEsVUFBQSxRQUFBOztFQUVBLE9BQUEsV0FBQSxZQUFBO0dBQ0EsT0FBQSxRQUFBO0lBQ0EsU0FBQTtLQUNBLE9BQUE7TUFDQSxNQUFBO01BQ0EsUUFBQTtNQUNBLFlBQUE7T0FDQSxZQUFBO09BQ0EsU0FBQTtPQUNBLFVBQUE7T0FDQSxRQUFBO09BQ0EsTUFBQTtPQUNBLFlBQUE7T0FDQSxVQUFBO1FBQ0EsT0FBQTtRQUNBLFNBQUE7UUFDQSxVQUFBO1FBQ0EsUUFBQTs7O01BR0EsV0FBQTtPQUNBLFlBQUE7T0FDQSxXQUFBO09BQ0EsWUFBQTtPQUNBLGdCQUFBO09BQ0EsV0FBQTtPQUNBLGtCQUFBO09BQ0EsWUFBQTtPQUNBLFdBQUE7T0FDQSxhQUFBO09BQ0EsaUJBQUE7O09BRUEsVUFBQTtRQUNBLFFBQUE7UUFDQSxPQUFBOztPQUVBLFVBQUE7T0FDQSxRQUFBO09BQ0EsZUFBQTtPQUNBLE1BQUE7Ozs7SUFJQSxNQUFBOztHQUVBLE9BQUEsT0FBQTs7RUFFQSxJQUFBLFlBQUEsVUFBQSxNQUFBO0dBQ0EsSUFBQSxXQUFBO0dBQ0EsUUFBQSxRQUFBLE1BQUEsVUFBQSxNQUFBO0lBQ0EsSUFBQSxRQUFBO0tBQ0EsUUFBQSxLQUFBO0tBQ0EsUUFBQSxLQUFBO0tBQ0EsU0FBQSxLQUFBO0tBQ0EsWUFBQSxVQUFBLEtBQUE7O0lBRUEsR0FBQSxLQUFBLE1BQUE7S0FDQSxNQUFBLFFBQUEsS0FBQTs7SUFFQSxHQUFBLEtBQUEsS0FBQTtLQUNBLE1BQUEsT0FBQSxLQUFBOztJQUVBLFNBQUEsS0FBQTs7R0FFQSxPQUFBOztFQUVBLE9BQUEsaUJBQUEsWUFBQTtHQUNBLElBQUEsWUFBQTtJQUNBLFFBQUEsT0FBQSxLQUFBO0lBQ0EsU0FBQSxPQUFBLEtBQUEsTUFBQSxjQUFBO0lBQ0EsWUFBQSxVQUFBLE9BQUEsS0FBQTtJQUNBLFFBQUE7O0dBRUEsT0FBQSxNQUFBLE9BQUE7R0FDQSxPQUFBOztFQUVBLE9BQUEsT0FBQSxRQUFBLFVBQUEsR0FBQSxHQUFBO0dBQ0EsSUFBQSxDQUFBLEdBQUE7SUFDQTs7R0FFQSxPQUFBOzs7Ozs7QUNyRkEsQ0FBQSxZQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGtCQUFBLFVBQUEsMkJBQUEsVUFBQSxRQUFBOztFQUVBLE9BQUE7R0FDQSxVQUFBO0dBQ0EsT0FBQTtRQUNBLE1BQUE7UUFDQSxVQUFBOztHQUVBLE1BQUEsVUFBQSxPQUFBLFNBQUEsT0FBQTtJQUNBLElBQUEsV0FBQSxhQUFBLHdCQUFBO0lBQ0EseUJBQUEsVUFBQSxPQUFBO0tBQ0EsSUFBQSxTQUFBLE1BQUE7TUFDQSxNQUFBOztLQUVBLE1BQUEsYUFBQSxnQkFBQTtLQUNBLE9BQUE7O0lBRUEsaUJBQUEsTUFBQTtJQUNBLFlBQUEsVUFBQSxNQUFBO0tBQ0EsSUFBQTtLQUNBLElBQUEsQ0FBQSxDQUFBLE9BQUEsTUFBQSxrQkFBQSxLQUFBLE1BQUEsU0FBQSxPQUFBLENBQUEsT0FBQSxRQUFBLE9BQUEsTUFBQSxhQUFBO01BQ0EsT0FBQTtZQUNBO01BQ0EsTUFBQSwrQkFBQSxNQUFBLGNBQUE7TUFDQSxPQUFBOzs7SUFHQSxjQUFBLFVBQUEsTUFBQTtLQUNBLElBQUEsQ0FBQSxvQkFBQSxLQUFBLE1BQUEsbUJBQUEsT0FBQSxlQUFBLFFBQUEsUUFBQSxDQUFBLEdBQUE7TUFDQSxPQUFBO1lBQ0E7TUFDQSxPQUFBLE1BQUEseUNBQUEsZ0JBQUE7O01BRUEsT0FBQTs7O0lBR0EsUUFBQSxLQUFBLFlBQUE7SUFDQSxRQUFBLEtBQUEsYUFBQTtJQUNBLE9BQUEsUUFBQSxLQUFBLFFBQUEsVUFBQSxPQUFBO0tBQ0EsSUFBQSxNQUFBLE1BQUEsUUFBQSxNQUFBO0tBQ0EsSUFBQSxTQUFBLE1BQUE7TUFDQSxNQUFBOztLQUVBLFNBQUEsSUFBQTtLQUNBLE9BQUEsU0FBQSxVQUFBLEtBQUE7TUFDQSxJQUFBLFVBQUEsU0FBQSxZQUFBLE9BQUE7T0FDQSxPQUFBLE1BQUEsT0FBQSxZQUFBO1FBQ0EsTUFBQSxPQUFBLElBQUEsT0FBQTtRQUNBLElBQUEsUUFBQSxTQUFBLE1BQUEsV0FBQTtTQUNBLE9BQUEsTUFBQSxXQUFBOzs7OztLQUtBLE9BQUEsTUFBQSxhQUFBLE1BQUE7Ozs7O0tBS0EsTUFBQSxPQUFBO0tBQ0EsT0FBQTs7Ozs7Ozs7QUMvREEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxRQUFBLG9CQUFBLFlBQUEsb0JBQUEsVUFBQTs7Ozs7O0FDSEEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGtCQUFBLFdBQUEsYUFBQSxXQUFBOztFQUVBLE9BQUE7R0FDQSxVQUFBO0dBQ0EsYUFBQTtHQUNBLFlBQUE7R0FDQSxjQUFBO0dBQ0EsTUFBQTtJQUNBLE1BQUE7SUFDQSxTQUFBO0lBQ0EsVUFBQTs7R0FFQSxrQkFBQTtHQUNBLFFBQUE7O0dBRUEsTUFBQSxVQUFBLE9BQUEsU0FBQSxPQUFBLFdBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7QUNsQkEsQ0FBQSxZQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsaUZBQUEsVUFBQSxRQUFBLGFBQUEsZUFBQSxTQUFBLFFBQUE7O0VBRUEsSUFBQSxLQUFBOztFQUVBLEdBQUEsWUFBQTtFQUNBLEdBQUEsWUFBQTs7RUFFQSxHQUFBLGFBQUE7RUFDQSxHQUFBLGdCQUFBO0VBQ0EsR0FBQSxlQUFBO0VBQ0EsR0FBQSxhQUFBO0VBQ0EsR0FBQSxjQUFBO0VBQ0EsR0FBQSxzQkFBQTs7RUFFQSxHQUFBLGtCQUFBO0VBQ0EsR0FBQSxvQkFBQTtFQUNBLEdBQUEsZUFBQTs7RUFFQSxHQUFBLGNBQUE7RUFDQSxHQUFBLGdCQUFBOztFQUVBOztFQUVBLFNBQUEsV0FBQTtHQUNBOzs7RUFHQSxTQUFBLFlBQUEsT0FBQTtHQUNBLE9BQUEsUUFBQSxjQUFBLEdBQUEsZUFBQSxPQUFBOzs7RUFHQSxTQUFBLG9CQUFBLE9BQUE7R0FDQSxPQUFBLFFBQUEsY0FBQSxHQUFBLFlBQUEsT0FBQTs7O0VBR0EsU0FBQSxVQUFBO0dBQ0EsR0FBQSxnQkFBQSxZQUFBLE9BQUEsaUJBQUE7R0FDQSxHQUFBLGFBQUEsWUFBQSxPQUFBLGNBQUE7R0FDQSxHQUFBLGVBQUEsWUFBQSxPQUFBLGlCQUFBO0dBQ0EsR0FBQSxTQUFBLFlBQUEsT0FBQSxVQUFBOzs7RUFHQSxTQUFBLFdBQUE7R0FDQSxJQUFBLEdBQUEsS0FBQSxTQUFBLEdBQUEsS0FBQSxtQkFBQSxHQUFBLEtBQUEsZ0JBQUEsR0FBQSxLQUFBLE1BQUEsVUFBQSxHQUFBO0lBQ0EsT0FBQTs7R0FFQSxPQUFBOztFQUVBLFNBQUEsV0FBQTtHQUNBLEdBQUEsT0FBQSxHQUFBLEtBQUEsY0FBQSxhQUFBLE9BQUE7R0FDQSxPQUFBLGVBQUEsR0FBQSxLQUFBLFdBQUEsU0FBQSxPQUFBOzs7RUFHQSxTQUFBLGdCQUFBLFdBQUE7R0FDQSxJQUFBLFFBQUEsT0FBQSxRQUFBLENBQUE7R0FDQSxRQUFBLFFBQUEsR0FBQSxLQUFBLFlBQUEsU0FBQSxLQUFBLEVBQUE7SUFDQSxHQUFBLElBQUEsTUFBQSxVQUFBLEdBQUE7S0FDQSxRQUFBO0tBQ0EsUUFBQTs7O0dBR0EsUUFBQSxJQUFBLE9BQUE7R0FDQSxVQUFBLENBQUEsSUFBQSxHQUFBLEtBQUEsV0FBQSxLQUFBLGFBQUEsR0FBQSxLQUFBLFdBQUEsT0FBQSxPQUFBOzs7RUFHQSxTQUFBLGtCQUFBLE1BQUEsV0FBQTtHQUNBLElBQUEsT0FBQSxLQUFBLGNBQUEsYUFBQTtJQUNBLEtBQUEsYUFBQTtJQUNBLE9BQUE7O0lBRUEsSUFBQSxRQUFBO0dBQ0EsUUFBQSxRQUFBLEtBQUEsWUFBQSxTQUFBLEtBQUEsSUFBQTtJQUNBLEdBQUEsSUFBQSxNQUFBLFVBQUEsR0FBQTtLQUNBLFFBQUE7OztHQUdBLE9BQUE7O0VBRUEsU0FBQSxhQUFBLE1BQUE7R0FDQSxHQUFBLE1BQUE7SUFDQSxRQUFBLElBQUEsR0FBQTtJQUNBLFlBQUEsS0FBQSxjQUFBLEdBQUEsVUFBQSxLQUFBLFNBQUEsS0FBQTtLQUNBLEdBQUEsV0FBQSxLQUFBO0tBQ0EsR0FBQSxpQkFBQTtLQUNBLEdBQUEsS0FBQSxXQUFBLEtBQUE7S0FDQSxPQUFBLFFBQUEseUJBQUE7Ozs7RUFJQSxTQUFBLFlBQUEsT0FBQTtHQUNBLEdBQUEsR0FBQSxLQUFBLFlBQUEsTUFBQSxHQUFBO0lBQ0EsR0FBQSxLQUFBLFdBQUE7O09BRUE7SUFDQSxHQUFBLEtBQUEsV0FBQSxNQUFBO0lBQ0EsR0FBQSxLQUFBLFFBQUE7OztFQUdBLFNBQUEsY0FBQSxNQUFBLE9BQUE7R0FDQSxPQUFBLEdBQUEsS0FBQSxZQUFBLE1BQUEsS0FBQSxPQUFBOzs7Ozs7OztBQ3RHQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSxnSEFBQSxTQUFBLFFBQUEsYUFBQSxPQUFBLGVBQUEsWUFBQSxPQUFBLFFBQUEsU0FBQTs7RUFFQSxJQUFBLEtBQUE7RUFDQSxXQUFBLGtCQUFBO0VBQ0EsR0FBQSxVQUFBO0VBQ0EsR0FBQSxXQUFBO0VBQ0EsR0FBQSxXQUFBO0VBQ0EsR0FBQSxhQUFBO0VBQ0EsR0FBQSxlQUFBLFNBQUEsU0FBQTtHQUNBLE1BQUEsYUFBQTs7RUFFQSxTQUFBLGlCQUFBO0lBQ0EsT0FBQSxNQUFBOztFQUVBLFNBQUEsU0FBQTtHQUNBLE1BQUEsTUFBQSxHQUFBLE1BQUEsS0FBQSxTQUFBLFNBQUE7SUFDQSxPQUFBLFFBQUE7O01BRUEsTUFBQSxTQUFBLFNBQUE7SUFDQSxPQUFBLE1BQUEsd0NBQUE7OztFQUdBLFNBQUEsVUFBQTtHQUNBLEdBQUEsTUFBQSxrQkFBQTtJQUNBLE1BQUEsU0FBQSxLQUFBLFNBQUEsS0FBQTtLQUNBLEdBQUEsT0FBQSxRQUFBLEtBQUE7TUFDQSxPQUFBLEdBQUE7O0tBRUEsT0FBQSxRQUFBO09BQ0EsTUFBQSxTQUFBLFNBQUE7Ozs7OztJQU1BLFNBQUEsU0FBQSxhQUFBLElBQUE7TUFDQSxZQUFBO0tBQ0E7RUFDQSxTQUFBLFlBQUE7R0FDQSxXQUFBLGNBQUEsQ0FBQSxXQUFBO0dBQ0EsY0FBQSxXQUFBLFdBQUE7R0FDQTs7RUFFQSxTQUFBLGNBQUE7R0FDQSxTQUFBLFVBQUE7SUFDQSxZQUFBLE9BQUEsT0FBQSxLQUFBLFVBQUEsS0FBQTtLQUNBLElBQUE7O01BRUE7O0VBRUEsV0FBQSxjQUFBO0VBQ0EsT0FBQSxPQUFBLFVBQUE7R0FDQSxPQUFBLFdBQUE7S0FDQSxTQUFBLFFBQUE7R0FDQSxPQUFBLGVBQUEsV0FBQTs7RUFFQSxPQUFBLE9BQUEscUJBQUEsU0FBQSxFQUFBLEVBQUE7R0FDQSxHQUFBLEtBQUEsR0FBQSxPQUFBO0dBQ0E7Ozs7O0FBS0EiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdHZhciBhcHAgPSBhbmd1bGFyLm1vZHVsZSgnYXBwJyxcblx0XHRbXG5cdFx0J2FwcC5jb250cm9sbGVycycsXG5cdFx0J2FwcC5maWx0ZXJzJyxcblx0XHQnYXBwLnNlcnZpY2VzJyxcblx0XHQnYXBwLmRpcmVjdGl2ZXMnLFxuXHRcdCdhcHAucm91dGVzJyxcblx0XHQnYXBwLmNvbmZpZydcblx0XHRdKTtcblxuXG5cdFx0YW5ndWxhci5tb2R1bGUoJ2FwcC5yb3V0ZXMnLCBbJ3VpLnJvdXRlcicsICduZ1N0b3JhZ2UnLCAnc2F0ZWxsaXplciddKTtcblx0XHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJywgWydhbmd1bGFyTW9tZW50JywnbmdTY3JvbGxiYXInLCdtZENvbG9yUGlja2VyJywnbmdBbmltYXRlJywndWkudHJlZScsJ3RvYXN0cicsJ3VpLnJvdXRlcicsICdtZC5kYXRhLnRhYmxlJywgJ25nTWF0ZXJpYWwnLCAnbmdTdG9yYWdlJywgJ3Jlc3Rhbmd1bGFyJywgJ25nTWRJY29ucycsICdhbmd1bGFyLWxvYWRpbmctYmFyJywgJ25nTWVzc2FnZXMnLCAnbmdTYW5pdGl6ZScsIFwibGVhZmxldC1kaXJlY3RpdmVcIiwnbnZkMyddKTtcblx0XHRhbmd1bGFyLm1vZHVsZSgnYXBwLmZpbHRlcnMnLCBbXSk7XG5cdFx0YW5ndWxhci5tb2R1bGUoJ2FwcC5zZXJ2aWNlcycsIFsnYW5ndWxhci1jYWNoZScsJ3VpLnJvdXRlcicsICduZ1N0b3JhZ2UnLCAncmVzdGFuZ3VsYXInLCAndG9hc3RyJ10pO1xuXHRcdGFuZ3VsYXIubW9kdWxlKCdhcHAuZGlyZWN0aXZlcycsIFsnbmdNYXRlcmlhbCcsJ25nUGFwYVBhcnNlJ10pO1xuXHRcdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29uZmlnJywgW10pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5yb3V0ZXMnKS5jb25maWcoZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIsICRsb2NhdGlvblByb3ZpZGVyKSB7XG5cdC8vXHQkbG9jYXRpb25Qcm92aWRlci5odG1sNU1vZGUodHJ1ZSk7XG5cdFx0dmFyIGdldFZpZXcgPSBmdW5jdGlvbiAodmlld05hbWUpIHtcblx0XHRcdHJldHVybiAnL3ZpZXdzL2FwcC8nICsgdmlld05hbWUgKyAnLycgKyB2aWV3TmFtZSArICcuaHRtbCc7XG5cdFx0fTtcblxuXHRcdCR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UoJy8nKTtcblxuXHRcdCRzdGF0ZVByb3ZpZGVyXG5cdFx0XHQuc3RhdGUoJ2FwcCcsIHtcblx0XHRcdFx0YWJzdHJhY3Q6IHRydWUsXG5cdFx0XHRcdHZpZXdzOiB7XG5cdFx0XHRcdFx0aGVhZGVyOiB7XG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogZ2V0VmlldygnaGVhZGVyJyksXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiAnSGVhZGVyQ3RybCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyQXM6ICd2bSdcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdG1haW46IHt9LFxuXHRcdFx0XHRcdCdtYXBAJzoge1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6IGdldFZpZXcoJ21hcCcpLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlcjogJ01hcEN0cmwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlckFzOiAndm0nXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdFx0LnN0YXRlKCdhcHAuaG9tZScse1xuXHRcdFx0XHR1cmw6Jy8nLFxuXHRcdFx0XHR2aWV3czp7XG5cdFx0XHRcdFx0J3NpZGViYXJAJzp7XG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogZ2V0VmlldygnaG9tZScpLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlcjogJ0hvbWVDdHJsJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLnVzZXInLCB7XG5cdFx0XHRcdHVybDogJy91c2VyJyxcblx0XHRcdFx0YWJzdHJhY3Q6IHRydWVcblxuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLnVzZXIubG9naW4nLCB7XG5cdFx0XHRcdHVybDogJy9sb2dpbicsXG5cdFx0XHRcdHZpZXdzOiB7XG5cdFx0XHRcdFx0J21haW5AJzoge1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6IGdldFZpZXcoJ2xvZ2luJyksXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiAnTG9naW5DdHJsJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdH0pXG5cdFx0XHQuc3RhdGUoJ2FwcC51c2VyLnByb2ZpbGUnLCB7XG5cdFx0XHRcdHVybDogJy9teS1wcm9maWxlJyxcblx0XHRcdFx0YXV0aDp0cnVlLFxuXHRcdFx0XHR2aWV3czoge1xuXHRcdFx0XHRcdCdtYWluQCc6IHtcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiBnZXRWaWV3KCd1c2VyJyksXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiAnVXNlckN0cmwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlckFzOiAndm0nLFxuXHRcdFx0XHRcdFx0cmVzb2x2ZToge1xuXHRcdFx0XHRcdFx0XHRwcm9maWxlOiBmdW5jdGlvbiAoRGF0YVNlcnZpY2UsICRhdXRoKSB7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIERhdGFTZXJ2aWNlLmdldE9uZSgnbWUnKS4kb2JqZWN0O1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdH0pXG5cdFx0XHQuc3RhdGUoJ2FwcC5pbmRleCcsIHtcblx0XHRcdFx0YWJzdHJhY3Q6IHRydWUsXG5cdFx0XHRcdHVybDogJy9pbmRleCdcblxuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLmluZGV4Lm15ZGF0YScsIHtcblx0XHRcdFx0dXJsOicvbXktZGF0YScsXG5cdFx0XHRcdGF1dGg6dHJ1ZSxcblx0XHRcdFx0dmlld3M6e1xuXHRcdFx0XHRcdCdzaWRlYmFyQCc6e1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6Jy92aWV3cy9hcHAvaW5kZXhNeURhdGEvaW5kZXhNeURhdGFNZW51Lmh0bWwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlcjogJ0luZGV4TXlEYXRhTWVudUN0cmwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlckFzOiAndm0nXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHQnbWFpbkAnOntcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOmdldFZpZXcoJ2luZGV4TXlEYXRhJyksXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiAnSW5kZXhNeURhdGFDdHJsJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLmluZGV4Lm15ZGF0YS5lbnRyeScsIHtcblx0XHRcdFx0dXJsOicvOm5hbWUnLFxuXHRcdFx0XHRhdXRoOnRydWUsXG5cdFx0XHRcdHZpZXdzOntcblx0XHRcdFx0XHQnc2lkZWJhckAnOntcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOicvdmlld3MvYXBwL2luZGV4TXlEYXRhL2luZGV4TXlEYXRhTWVudS5odG1sJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdJbmRleE15RGF0YU1lbnVDdHJsJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0J21haW5AJzp7XG5cdFx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOicvdmlld3MvYXBwL2luZGV4TXlEYXRhL2luZGV4TXlEYXRhRW50cnkuaHRtbCcsXG5cdFx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdJbmRleE15RGF0YUVudHJ5Q3RybCcsXG5cdFx0XHRcdFx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLmluZGV4LmVkaXRvcicse1xuXHRcdFx0XHR1cmw6ICcvZWRpdG9yJyxcblx0XHRcdFx0YXV0aDp0cnVlLFxuXHRcdFx0XHR2aWV3czoge1xuXHRcdFx0XHRcdCdzaWRlYmFyQCc6IHtcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdpbmRleGVkaXRvcicpLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlcjogJ0luZGV4ZWRpdG9yQ3RybCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyQXM6ICd2bScsXG5cdFx0XHRcdFx0XHRyZXNvbHZlOntcblx0XHRcdFx0XHRcdFx0aW5kaWNhdG9yczpmdW5jdGlvbihDb250ZW50U2VydmljZSl7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIENvbnRlbnRTZXJ2aWNlLmZldGNoSW5kaWNhdG9ycygpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdC8qdmlld3M6e1xuXHRcdFx0XHRcdCdpbmZvJzp7XG5cblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdCdtZW51Jzp7XG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDpnZXRWaWV3KCdpbmRleGVkaXRvcicpLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlcjogJ0luZGV4ZWRpdG9yQ3RybCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyQXM6ICd2bSdcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0qL1xuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLmluZGV4LmVkaXRvci5pbmRpY2F0b3InLHtcblx0XHRcdFx0dXJsOiAnLzppZCcsXG5cdFx0XHRcdGF1dGg6dHJ1ZSxcblx0XHRcdFx0bGF5b3V0OiAncm93Jyxcblx0XHRcdFx0dmlld3M6IHtcblx0XHRcdFx0XHQnbWFpbkAnOiB7XG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDonL3ZpZXdzL2FwcC9pbmRleGVkaXRvci9pbmRleGVkaXRvcmluZGljYXRvci5odG1sJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdJbmRleGVkaXRvcmluZGljYXRvckN0cmwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlckFzOiAndm0nLFxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHQvKnZpZXdzOntcblx0XHRcdFx0XHQnaW5mbyc6e1xuXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHQnbWVudSc6e1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6Z2V0VmlldygnaW5kZXhlZGl0b3InKSxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdJbmRleGVkaXRvckN0cmwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlckFzOiAndm0nXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9Ki9cblx0XHRcdH0pXG5cdFx0XHQuc3RhdGUoJ2FwcC5pbmRleC5lZGl0b3IuaW5kaWNhdG9yLmRldGFpbHMnLHtcblx0XHRcdFx0dXJsOiAnLzplbnRyeScsXG5cdFx0XHRcdGF1dGg6dHJ1ZSxcblx0XHRcdFx0bGF5b3V0Oidyb3cnXG5cdFx0XHR9KVxuXHRcdFx0LnN0YXRlKCdhcHAuaW5kZXguY3JlYXRlJywge1xuXHRcdFx0XHR1cmw6ICcvY3JlYXRlJyxcblx0XHRcdFx0YXV0aDp0cnVlLFxuXHRcdFx0XHR2aWV3czoge1xuXHRcdFx0XHRcdCdzaWRlYmFyQCc6IHtcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdpbmRleGNyZWF0b3InKSxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdJbmRleGNyZWF0b3JDdHJsJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLmluZGV4LmNyZWF0ZS5iYXNpYycsIHtcblx0XHRcdFx0dXJsOiAnL2Jhc2ljJyxcblx0XHRcdFx0YXV0aDp0cnVlXG5cdFx0XHR9KVxuXHRcdFx0LnN0YXRlKCdhcHAuaW5kZXguY2hlY2snLCB7XG5cdFx0XHRcdHVybDogJy9jaGVja2luZycsXG5cdFx0XHRcdGF1dGg6dHJ1ZSxcblx0XHRcdFx0dmlld3M6e1xuXHRcdFx0XHRcdCdtYWluQCc6e1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6Z2V0VmlldygnSW5kZXhDaGVjaycpLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlcjogJ0luZGV4Q2hlY2tDdHJsJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0J3NpZGViYXJAJzoge1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICcvdmlld3MvYXBwL2luZGV4Q2hlY2svaW5kZXhDaGVja1NpZGViYXIuaHRtbCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiAnSW5kZXhDaGVja1NpZGViYXJDdHJsJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLmluZGV4Lm1ldGEnLCB7XG5cdFx0XHRcdHVybDogJy9hZGRpbmctbWV0YS1kYXRhJyxcblx0XHRcdFx0YXV0aDp0cnVlLFxuXHRcdFx0XHRsYXlvdXQ6J3JvdycsXG5cdFx0XHRcdHZpZXdzOntcblx0XHRcdFx0XHQnbWFpbkAnOntcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOmdldFZpZXcoJ2luZGV4TWV0YScpLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlcjogJ0luZGV4TWV0YUN0cmwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlckFzOiAndm0nXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHQnc2lkZWJhckAnOntcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiAnL3ZpZXdzL2FwcC9pbmRleE1ldGEvaW5kZXhNZXRhTWVudS5odG1sJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdJbmRleE1ldGFNZW51Q3RybCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyQXM6ICd2bSdcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cdFx0XHQuc3RhdGUoJ2FwcC5pbmRleC5maW5hbCcsIHtcblx0XHRcdFx0dXJsOiAnL2ZpbmFsJyxcblx0XHRcdFx0YXV0aDp0cnVlLFxuXHRcdFx0XHRsYXlvdXQ6J3JvdycsXG5cdFx0XHRcdHZpZXdzOntcblx0XHRcdFx0XHQnbWFpbkAnOntcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOmdldFZpZXcoJ2luZGV4RmluYWwnKSxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdJbmRleEZpbmFsQ3RybCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyQXM6ICd2bSdcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdCdzaWRlYmFyQCc6e1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICcvdmlld3MvYXBwL2luZGV4RmluYWwvaW5kZXhGaW5hbE1lbnUuaHRtbCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiAnSW5kZXhGaW5hbE1lbnVDdHJsJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLmluZGV4LnNob3cnLCB7XG5cdFx0XHRcdHVybDogJy86aW5kZXgnLFxuXHRcdFx0XHR2aWV3czoge1xuXHRcdFx0XHRcdCdzaWRlYmFyQCc6IHtcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiAnL3ZpZXdzL2FwcC9pbmRleC9pbmZvLmh0bWwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlcjogJ0luZGV4Q3RybCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyQXM6ICd2bScsXG5cdFx0XHRcdFx0XHRyZXNvbHZlOiB7XG5cdFx0XHRcdFx0XHRcdGRhdGE6IGZ1bmN0aW9uIChJbmRpemVzU2VydmljZSwgJHN0YXRlUGFyYW1zKSB7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIEluZGl6ZXNTZXJ2aWNlLmZldGNoRGF0YSgkc3RhdGVQYXJhbXMuaW5kZXgpO1xuXHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHRjb3VudHJpZXM6IGZ1bmN0aW9uKENvdW50cmllc1NlcnZpY2Upe1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBDb3VudHJpZXNTZXJ2aWNlLmdldERhdGEoKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0J3NlbGVjdGVkJzoge1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICcvdmlld3MvYXBwL2luZGV4L3NlbGVjdGVkLmh0bWwnLFxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLmluZGV4LnNob3cuaW5mbycsIHtcblx0XHRcdFx0IHVybDonL2luZm8nLFxuXHRcdFx0XHQgdmlld3M6e1xuXHRcdFx0XHRcdCAnbWFpbkAnOntcblx0XHRcdFx0XHRcdCBjb250cm9sbGVyOidJbmRleGluZm9DdHJsJyxcblx0XHRcdFx0XHRcdCBjb250cm9sbGVyQXM6ICd2bScsXG5cdFx0XHRcdFx0XHQgXHR0ZW1wbGF0ZVVybDpnZXRWaWV3KCdpbmRleGluZm8nKVxuXHRcdFx0XHRcdCB9XG5cdFx0XHRcdCB9XG5cdFx0XHR9KVxuXHRcdFx0LnN0YXRlKCdhcHAuaW5kZXguc2hvdy5zZWxlY3RlZCcsIHtcblx0XHRcdFx0dXJsOiAnLzppdGVtJyxcblx0XHRcdFx0Lyp2aWV3czp7XG5cdFx0XHRcdFx0J3NlbGVjdGVkJzp7XG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogZ2V0Vmlldygnc2VsZWN0ZWQnKSxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdTZWxlY3RlZEN0cmwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlckFzOiAndm0nLFxuXHRcdFx0XHRcdFx0cmVzb2x2ZTp7XG5cdFx0XHRcdFx0XHRcdGdldENvdW50cnk6IGZ1bmN0aW9uKERhdGFTZXJ2aWNlLCAkc3RhdGVQYXJhbXMpe1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBEYXRhU2VydmljZS5nZXRPbmUoJ25hdGlvbnMnLCAkc3RhdGVQYXJhbXMuaXRlbSkuJG9iamVjdDtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSovXG5cdFx0XHR9KVxuXHRcdFx0LnN0YXRlKCdhcHAuaW5kZXguc2hvdy5zZWxlY3RlZC5jb21wYXJlJywge1xuXHRcdFx0XHR1cmw6ICcvY29tcGFyZS86Y291bnRyaWVzJ1xuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLmltcG9ydGNzdicsIHtcblx0XHRcdFx0dXJsOiAnL2ltcG9ydGVyJyxcblx0XHRcdFx0ZGF0YToge1xuXHRcdFx0XHRcdHBhZ2VOYW1lOiAnSW1wb3J0IENTVidcblx0XHRcdFx0fSxcblx0XHRcdFx0dmlld3M6IHtcblx0XHRcdFx0XHQnbWFpbkAnOiB7XG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogZ2V0VmlldygnaW1wb3J0Y3N2Jylcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdCdtYXAnOiB7fVxuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXG5cblx0fSk7XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAucm91dGVzJykucnVuKGZ1bmN0aW9uKCRyb290U2NvcGUsICRtZFNpZGVuYXYsICR0aW1lb3V0LCAkYXV0aCwgJHN0YXRlLCRsb2NhbFN0b3JhZ2UsbGVhZmxldERhdGEsIHRvYXN0cil7XG5cdFx0JHJvb3RTY29wZS5zaWRlYmFyT3BlbiA9IHRydWU7XG5cdFx0JHJvb3RTY29wZS5sb29zZUxheW91dCA9ICRsb2NhbFN0b3JhZ2UuZnVsbFZpZXcgfHwgZmFsc2U7XG5cblx0XHQkcm9vdFNjb3BlLiRvbihcIiRzdGF0ZUNoYW5nZVN0YXJ0XCIsIGZ1bmN0aW9uKGV2ZW50LCB0b1N0YXRlLCB0b1BhcmFtcywgZnJvbVN0YXRlLGZyb21QYXJhbXMpe1xuXHRcdFx0aWYgKHRvU3RhdGUuYXV0aCAmJiAhJGF1dGguaXNBdXRoZW50aWNhdGVkKCkpe1xuXHRcdFx0XHR0b2FzdHIuZXJyb3IoJ1lvdXIgbm90IGFsbG93ZWQgdG8gZ28gdGhlcmUgYnVkZHkhJywgJ0FjY2VzcyBkZW5pZWQnKTtcblx0XHQgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHQgICAgcmV0dXJuICRzdGF0ZS5nbygnYXBwLmhvbWUnKTtcblx0XHQgIH1cblx0XHRcdGlmICh0b1N0YXRlLmRhdGEgJiYgdG9TdGF0ZS5kYXRhLnBhZ2VOYW1lKXtcblx0XHRcdFx0JHJvb3RTY29wZS5jdXJyZW50X3BhZ2UgPSB0b1N0YXRlLmRhdGEucGFnZU5hbWU7XG5cdFx0XHR9XG5cdFx0XHRpZih0b1N0YXRlLmxheW91dCA9PSBcInJvd1wiKXtcblx0XHRcdFx0JHJvb3RTY29wZS5yb3dlZCA9IHRydWU7XG5cdFx0XHR9XG5cdFx0XHRlbHNle1xuXHRcdFx0XHQkcm9vdFNjb3BlLnJvd2VkID0gZmFsc2U7XG5cdFx0XHR9XG5cdFx0XHQkcm9vdFNjb3BlLnByZXZpb3VzUGFnZSA9IHtzdGF0ZTpmcm9tU3RhdGUsIHBhcmFtczpmcm9tUGFyYW1zfTtcblx0XHRcdCRyb290U2NvcGUuc3RhdGVJc0xvYWRpbmcgPSB0cnVlO1xuXHRcdH0pO1xuXHRcdCRyb290U2NvcGUuJG9uKFwiJHZpZXdDb250ZW50TG9hZGVkXCIsIGZ1bmN0aW9uKGV2ZW50LCB0b1N0YXRlKXtcblxuXHRcdH0pO1xuXG5cdFx0JHJvb3RTY29wZS4kb24oXCIkc3RhdGVDaGFuZ2VTdWNjZXNzXCIsIGZ1bmN0aW9uKGV2ZW50LCB0b1N0YXRlKXtcblx0XHRcdCRyb290U2NvcGUuc3RhdGVJc0xvYWRpbmcgPSBmYWxzZTtcblx0XHRcdHJlc2V0TWFwU2l6ZSgpO1xuXHRcdH0pO1xuXG5cdFx0ZnVuY3Rpb24gcmVzZXRNYXBTaXplKCl7XG5cdFx0XHQkdGltZW91dChmdW5jdGlvbigpe1xuXHRcdFx0XHRsZWFmbGV0RGF0YS5nZXRNYXAoJ21hcCcpLnRoZW4oZnVuY3Rpb24gKG1hcCkge1xuXHRcdFx0XHRcdG1hcC5pbnZhbGlkYXRlU2l6ZSgpO1xuXHRcdFx0XHR9KVxuXHRcdFx0fSwgMTAwMCk7XG5cdFx0fVxuXHR9KTtcbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbmZpZycpLmNvbmZpZyhmdW5jdGlvbiAoJGF1dGhQcm92aWRlcikge1xuXHRcdC8vIFNhdGVsbGl6ZXIgY29uZmlndXJhdGlvbiB0aGF0IHNwZWNpZmllcyB3aGljaCBBUElcblx0XHQvLyByb3V0ZSB0aGUgSldUIHNob3VsZCBiZSByZXRyaWV2ZWQgZnJvbVxuXHRcdCRhdXRoUHJvdmlkZXIubG9naW5VcmwgPSAnL2FwaS9hdXRoZW50aWNhdGUvYXV0aCc7XG4gICAgJGF1dGhQcm92aWRlci5zaWdudXBVcmwgPSAnL2FwaS9hdXRoZW50aWNhdGUvYXV0aC9zaWdudXAnO1xuICAgICRhdXRoUHJvdmlkZXIudW5saW5rVXJsID0gJy9hcGkvYXV0aGVudGljYXRlL2F1dGgvdW5saW5rLyc7XG5cdFx0JGF1dGhQcm92aWRlci5mYWNlYm9vayh7XG5cdFx0XHR1cmw6ICcvYXBpL2F1dGhlbnRpY2F0ZS9mYWNlYm9vaycsXG5cdFx0XHRjbGllbnRJZDogJzc3MTk2MTgzMjkxMDA3Midcblx0XHR9KTtcblx0XHQkYXV0aFByb3ZpZGVyLmdvb2dsZSh7XG5cdFx0XHR1cmw6ICcvYXBpL2F1dGhlbnRpY2F0ZS9nb29nbGUnLFxuXHRcdFx0Y2xpZW50SWQ6ICcyNzY2MzQ1Mzc0NDAtY2d0dDE0cWoyZThpbnAwdnE1b3E5YjQ2azc0ampzM2UuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20nXG5cdFx0fSk7XG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbmZpZycpLmNvbmZpZyhmdW5jdGlvbiAoY2ZwTG9hZGluZ0JhclByb3ZpZGVyKXtcblx0XHRjZnBMb2FkaW5nQmFyUHJvdmlkZXIuaW5jbHVkZVNwaW5uZXIgPSBmYWxzZTtcblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb25maWcnKS5jb25maWcoIGZ1bmN0aW9uKFJlc3Rhbmd1bGFyUHJvdmlkZXIpIHtcblx0XHRSZXN0YW5ndWxhclByb3ZpZGVyXG5cdFx0LnNldEJhc2VVcmwoJy9hcGkvJylcblx0XHQuc2V0RGVmYXVsdEhlYWRlcnMoeyBhY2NlcHQ6IFwiYXBwbGljYXRpb24veC5sYXJhdmVsLnYxK2pzb25cIiB9KVxuXHRcdC5hZGRSZXNwb25zZUludGVyY2VwdG9yKGZ1bmN0aW9uKGRhdGEsb3BlcmF0aW9uLHdoYXQsdXJsLHJlc3BvbnNlLGRlZmVycmVkKSB7XG4gICAgICAgIHZhciBleHRyYWN0ZWREYXRhO1xuICAgICAgICBleHRyYWN0ZWREYXRhID0gZGF0YS5kYXRhO1xuICAgICAgICBpZiAoZGF0YS5tZXRhKSB7XG4gICAgICAgICAgICBleHRyYWN0ZWREYXRhLl9tZXRhID0gZGF0YS5tZXRhO1xuICAgICAgICB9XG4gICAgICAgIGlmIChkYXRhLmluY2x1ZGVkKSB7IFxuICAgICAgICAgICAgZXh0cmFjdGVkRGF0YS5faW5jbHVkZWQgPSBkYXRhLmluY2x1ZGVkO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBleHRyYWN0ZWREYXRhO1xuICAgIH0pO1xuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbmZpZycpLmNvbmZpZyhmdW5jdGlvbigkbWRUaGVtaW5nUHJvdmlkZXIpIHtcblx0XHQvKiBGb3IgbW9yZSBpbmZvLCB2aXNpdCBodHRwczovL21hdGVyaWFsLmFuZ3VsYXJqcy5vcmcvIy9UaGVtaW5nLzAxX2ludHJvZHVjdGlvbiAqL1xuLypcdHZhciBuZW9uVGVhbE1hcCA9ICRtZFRoZW1pbmdQcm92aWRlci5leHRlbmRQYWxldHRlKCd0ZWFsJywge1xuICAgICc1MDAnOiAnMDBjY2FhJyxcblx0XHQnQTIwMCc6ICcwMGNjYWEnXG4gIH0pO1xuXHR2YXIgd2hpdGVNYXAgPSAkbWRUaGVtaW5nUHJvdmlkZXIuZXh0ZW5kUGFsZXR0ZSgndGVhbCcsIHtcbiAgICAnNTAwJzogJzAwY2NhYScsXG5cdFx0J0EyMDAnOiAnI2ZmZidcbiAgfSk7XG5cdHZhciBibHVlTWFwID0gJG1kVGhlbWluZ1Byb3ZpZGVyLmV4dGVuZFBhbGV0dGUoJ2JsdWUnLCB7XG4gICAgJzUwMCc6ICcjMDA2YmI5Jyxcblx0XHQnQTIwMCc6ICcjMDA2YmI5J1xuICB9KTtcblx0JG1kVGhlbWluZ1Byb3ZpZGVyLmRlZmluZVBhbGV0dGUoJ25lb25UZWFsJywgbmVvblRlYWxNYXApO1xuXHQkbWRUaGVtaW5nUHJvdmlkZXIuZGVmaW5lUGFsZXR0ZSgnd2hpdGVUZWFsJywgd2hpdGVNYXApO1xuXHQkbWRUaGVtaW5nUHJvdmlkZXIuZGVmaW5lUGFsZXR0ZSgnYmx1ZXInLCBibHVlTWFwKTtcblx0XHQkbWRUaGVtaW5nUHJvdmlkZXIudGhlbWUoJ2RlZmF1bHQnKVxuXHRcdC5wcmltYXJ5UGFsZXR0ZSgnbGlnaHQtYmx1ZScpXG5cdFx0LmFjY2VudFBhbGV0dGUoJ2JsdWVyJyk7Ki9cblx0XHR2YXIgYmx1ZU1hcCA9ICRtZFRoZW1pbmdQcm92aWRlci5leHRlbmRQYWxldHRlKCdpbmRpZ28nLCB7XG5cdFx0XHQnNTAwJzogJyMwMDZiYjknLFxuXHRcdFx0J0EyMDAnOiAnIzAwNmJiOSdcblx0XHR9KTtcblx0XHRcdCRtZFRoZW1pbmdQcm92aWRlci5kZWZpbmVQYWxldHRlKCdibHVlcicsIGJsdWVNYXApO1xuXG5cdFx0JG1kVGhlbWluZ1Byb3ZpZGVyLnRoZW1lKCdkZWZhdWx0Jylcblx0XHQucHJpbWFyeVBhbGV0dGUoJ2JsdWVyJylcblx0XHQuYWNjZW50UGFsZXR0ZSgnZ3JleScpXG5cdFx0Lndhcm5QYWxldHRlKCdyZWQnKTtcblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29uZmlnJykuY29uZmlnKGZ1bmN0aW9uKHRvYXN0ckNvbmZpZyl7XG4gICAgICAgIC8vXG4gICAgICAgIGFuZ3VsYXIuZXh0ZW5kKHRvYXN0ckNvbmZpZywge1xuICAgICAgICAgIGF1dG9EaXNtaXNzOiBmYWxzZSxcbiAgICAgICAgICBjb250YWluZXJJZDogJ3RvYXN0LWNvbnRhaW5lcicsXG4gICAgICAgICAgbWF4T3BlbmVkOiAwLFxuICAgICAgICAgIG5ld2VzdE9uVG9wOiB0cnVlLFxuICAgICAgICAgIHBvc2l0aW9uQ2xhc3M6ICd0b2FzdC1ib3R0b20tcmlnaHQnLFxuICAgICAgICAgIHByZXZlbnREdXBsaWNhdGVzOiBmYWxzZSxcbiAgICAgICAgICBwcmV2ZW50T3BlbkR1cGxpY2F0ZXM6IGZhbHNlLFxuICAgICAgICAgIHRhcmdldDogJ2JvZHknLFxuICAgICAgICAgIGNsb3NlQnV0dG9uOiB0cnVlXG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmZpbHRlcnMnKS5maWx0ZXIoICdhbHBoYW51bScsIGZ1bmN0aW9uKCl7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiggaW5wdXQgKXtcbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICBpZiAoICFpbnB1dCApe1xuICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBpbnB1dC5yZXBsYWNlKC8oW14wLTlBLVpdKS9nLFwiXCIpO1xuXG4gICAgICAgIH1cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmZpbHRlcnMnKS5maWx0ZXIoICdjYXBpdGFsaXplJywgZnVuY3Rpb24oKXtcblx0XHRyZXR1cm4gZnVuY3Rpb24oaW5wdXQsIGFsbCkge1xuXHRcdFx0cmV0dXJuICghIWlucHV0KSA/IGlucHV0LnJlcGxhY2UoLyhbXlxcV19dK1teXFxzLV0qKSAqL2csZnVuY3Rpb24odHh0KXtcblx0XHRcdFx0cmV0dXJuIHR4dC5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHR4dC5zdWJzdHIoMSkudG9Mb3dlckNhc2UoKTtcblx0XHRcdH0pIDogJyc7XG5cdFx0fTtcblx0fSk7XG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5maWx0ZXJzJykuZmlsdGVyKCdmaW5kYnluYW1lJywgZnVuY3Rpb24gKCkge1xuXHRcdHJldHVybiBmdW5jdGlvbiAoaW5wdXQsIG5hbWUsIGZpZWxkKSB7XG5cdFx0XHQvL1xuICAgICAgdmFyIGZvdW5kcyA9IFtdO1xuXHRcdFx0dmFyIGkgPSAwLFxuXHRcdFx0XHRsZW4gPSBpbnB1dC5sZW5ndGg7XG5cblx0XHRcdGZvciAoOyBpIDwgbGVuOyBpKyspIHtcblx0XHRcdFx0aWYgKGlucHV0W2ldW2ZpZWxkXS50b0xvd2VyQ2FzZSgpLmluZGV4T2YobmFtZS50b0xvd2VyQ2FzZSgpKSA+IC0xKSB7XG5cdFx0XHRcdFx0IGZvdW5kcy5wdXNoKGlucHV0W2ldKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGZvdW5kcztcblx0XHR9XG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZmlsdGVycycpLmZpbHRlciggJ2h1bWFuUmVhZGFibGUnLCBmdW5jdGlvbigpe1xuXHRcdHJldHVybiBmdW5jdGlvbiBodW1hbml6ZShzdHIpIHtcblx0XHRcdGlmICggIXN0ciApe1xuXHRcdFx0XHRyZXR1cm4gJyc7XG5cdFx0XHR9XG5cdFx0XHR2YXIgZnJhZ3MgPSBzdHIuc3BsaXQoJ18nKTtcblx0XHRcdGZvciAodmFyIGk9MDsgaTxmcmFncy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRmcmFnc1tpXSA9IGZyYWdzW2ldLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgZnJhZ3NbaV0uc2xpY2UoMSk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gZnJhZ3Muam9pbignICcpO1xuXHRcdH07XG5cdH0pO1xufSkoKTsiLCIoZnVuY3Rpb24oKXtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmZpbHRlcnMnKS5maWx0ZXIoJ3RydW5jYXRlQ2hhcmFjdGVycycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChpbnB1dCwgY2hhcnMsIGJyZWFrT25Xb3JkKSB7XG4gICAgICAgICAgICBpZiAoaXNOYU4oY2hhcnMpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGlucHV0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGNoYXJzIDw9IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaW5wdXQgJiYgaW5wdXQubGVuZ3RoID4gY2hhcnMpIHtcbiAgICAgICAgICAgICAgICBpbnB1dCA9IGlucHV0LnN1YnN0cmluZygwLCBjaGFycyk7XG5cbiAgICAgICAgICAgICAgICBpZiAoIWJyZWFrT25Xb3JkKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBsYXN0c3BhY2UgPSBpbnB1dC5sYXN0SW5kZXhPZignICcpO1xuICAgICAgICAgICAgICAgICAgICAvLyBHZXQgbGFzdCBzcGFjZVxuICAgICAgICAgICAgICAgICAgICBpZiAobGFzdHNwYWNlICE9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5wdXQgPSBpbnB1dC5zdWJzdHIoMCwgbGFzdHNwYWNlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHdoaWxlIChpbnB1dC5jaGFyQXQoaW5wdXQubGVuZ3RoLTEpID09PSAnICcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlucHV0ID0gaW5wdXQuc3Vic3RyKDAsIGlucHV0Lmxlbmd0aCAtIDEpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBpbnB1dCArICcuLi4nO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGlucHV0O1xuICAgICAgICB9O1xuICAgIH0pO1xufSkoKTsiLCIoZnVuY3Rpb24oKXtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmZpbHRlcnMnKS5maWx0ZXIoJ3RydW5jYXRlV29yZHMnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoaW5wdXQsIHdvcmRzKSB7XG4gICAgICAgICAgICBpZiAoaXNOYU4od29yZHMpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGlucHV0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHdvcmRzIDw9IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaW5wdXQpIHtcbiAgICAgICAgICAgICAgICB2YXIgaW5wdXRXb3JkcyA9IGlucHV0LnNwbGl0KC9cXHMrLyk7XG4gICAgICAgICAgICAgICAgaWYgKGlucHV0V29yZHMubGVuZ3RoID4gd29yZHMpIHtcbiAgICAgICAgICAgICAgICAgICAgaW5wdXQgPSBpbnB1dFdvcmRzLnNsaWNlKDAsIHdvcmRzKS5qb2luKCcgJykgKyAnLi4uJztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gaW5wdXQ7XG4gICAgICAgIH07XG4gICAgfSk7XG59KSgpOyIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmZpbHRlcnMnKS5maWx0ZXIoICd0cnVzdEh0bWwnLCBmdW5jdGlvbiggJHNjZSApe1xuXHRcdHJldHVybiBmdW5jdGlvbiggaHRtbCApe1xuXHRcdFx0cmV0dXJuICRzY2UudHJ1c3RBc0h0bWwoaHRtbCk7XG5cdFx0fTtcblx0fSk7XG59KSgpOyIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmZpbHRlcnMnKS5maWx0ZXIoJ3VjZmlyc3QnLCBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gZnVuY3Rpb24oIGlucHV0ICkge1xuXHRcdFx0aWYgKCAhaW5wdXQgKXtcblx0XHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gaW5wdXQuc3Vic3RyaW5nKDAsIDEpLnRvVXBwZXJDYXNlKCkgKyBpbnB1dC5zdWJzdHJpbmcoMSk7XG5cdFx0fTtcblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuc2VydmljZXMnKS5mYWN0b3J5KCdWZWN0b3JsYXllclNlcnZpY2UnLCBmdW5jdGlvbigpe1xuXG4gICAgICAgIHJldHVybntcbiAgICAgICAgICBjYW52YXMgOiAnJyxcbiAgICAgICAgICBwYWxldHRlOiBbXSxcbiAgICAgICAgICBjdHg6ICcnLFxuICAgICAgICAgIGtleXM6e1xuICAgICAgICAgICAgbWF6cGVuOid2ZWN0b3ItdGlsZXMtUTNfT3M1dycsXG4gICAgICAgICAgICBtYXBib3g6J3BrLmV5SjFJam9pYldGbmJtOXNieUlzSW1FaU9pSnVTRmRVWWtnNEluMC41SE95a0trMHBOUDFOM2lzZlBRR1RRJ1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZGF0YTp7XG4gICAgICAgICAgICBsYXllcjogJycsXG4gICAgICAgICAgICBuYW1lOidjb3VudHJpZXNfYmlnJyxcbiAgICAgICAgICAgIGlzbzM6J2FkbTBfYTMnLFxuICAgICAgICAgICAgaXNvMjonaXNvX2EyJyxcbiAgICAgICAgICAgIGlzbzonaXNvX2EyJyxcbiAgICAgICAgICAgIGZpZWxkczogXCJpZCxhZG1pbixhZG0wX2EzLHdiX2EzLHN1X2EzLGlzb19hMyxpc29fYTIsbmFtZSxuYW1lX2xvbmdcIlxuICAgICAgICAgIH0sXG4gICAgICAgICAgc2V0TGF5ZXI6IGZ1bmN0aW9uKGwpe1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGF0YS5sYXllciA9IGw7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBnZXRMYXllcjogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmRhdGEubGF5ZXI7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBnZXROYW1lOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGF0YS5uYW1lO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZmllbGRzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmRhdGEuZmllbGRzO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgaXNvOmZ1bmN0aW9uKCl7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5kYXRhLmlzbztcbiAgICAgICAgICB9LFxuICAgICAgICAgIGlzbzM6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGF0YS5pc28zO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgaXNvMjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5kYXRhLmlzbzI7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBjcmVhdGVDYW52YXM6IGZ1bmN0aW9uKGNvbG9yKSB7XG4gICAgICBcdFx0XHR0aGlzLmNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuICAgICAgXHRcdFx0dGhpcy5jYW52YXMud2lkdGggPSAyODA7XG4gICAgICBcdFx0XHR0aGlzLmNhbnZhcy5oZWlnaHQgPSAxMDtcbiAgICAgIFx0XHRcdHRoaXMuY3R4ID0gdGhpcy5jYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcbiAgICAgIFx0XHRcdHZhciBncmFkaWVudCA9IHRoaXMuY3R4LmNyZWF0ZUxpbmVhckdyYWRpZW50KDAsIDAsIDI4MCwgMTApO1xuICAgICAgXHRcdFx0Z3JhZGllbnQuYWRkQ29sb3JTdG9wKDEsICdyZ2JhKDI1NSwyNTUsMjU1LDApJyk7XG4gICAgICBcdFx0XHRncmFkaWVudC5hZGRDb2xvclN0b3AoMC41MywgY29sb3IgfHwgICdyZ2JhKDEyOCwgMjQzLCAxOTgsMSknKTtcbiAgICAgIFx0XHRcdGdyYWRpZW50LmFkZENvbG9yU3RvcCgwLCAncmdiYSgxMDIsMTAyLDEwMiwxKScpO1xuICAgICAgXHRcdFx0dGhpcy5jdHguZmlsbFN0eWxlID0gZ3JhZGllbnQ7XG4gICAgICBcdFx0XHR0aGlzLmN0eC5maWxsUmVjdCgwLCAwLCAyODAsIDEwKTtcbiAgICAgIFx0XHRcdHRoaXMucGFsZXR0ZSA9IHRoaXMuY3R4LmdldEltYWdlRGF0YSgwLCAwLCAyNTcsIDEpLmRhdGE7XG4gICAgICBcdFx0XHQvL2RvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdib2R5JylbMF0uYXBwZW5kQ2hpbGQodGhpcy5jYW52YXMpO1xuICAgICAgXHRcdH0sXG4gICAgICBcdFx0dXBkYXRlQ2FudmFzOmZ1bmN0aW9uKGNvbG9yKSB7XG4gICAgICBcdFx0XHR2YXIgZ3JhZGllbnQgPSB0aGlzLmN0eC5jcmVhdGVMaW5lYXJHcmFkaWVudCgwLCAwLCAyODAsIDEwKTtcbiAgICAgIFx0XHRcdGdyYWRpZW50LmFkZENvbG9yU3RvcCgxLCAncmdiYSgyNTUsMjU1LDI1NSwwKScpO1xuICAgICAgXHRcdFx0Z3JhZGllbnQuYWRkQ29sb3JTdG9wKDAuNTMsIGNvbG9yIHx8ICdyZ2JhKDEyOCwgMjQzLCAxOTgsMSknICk7XG4gICAgICBcdFx0XHRncmFkaWVudC5hZGRDb2xvclN0b3AoMCwgJ3JnYmEoMTAyLDEwMiwxMDIsMSknKTtcbiAgICAgIFx0XHRcdHRoaXMuY3R4LmZpbGxTdHlsZSA9IGdyYWRpZW50O1xuICAgICAgXHRcdFx0dGhpcy5jdHguZmlsbFJlY3QoMCwgMCwgMjgwLCAxMCk7XG4gICAgICBcdFx0XHR0aGlzLnBhbGV0dGUgPSB0aGlzLmN0eC5nZXRJbWFnZURhdGEoMCwgMCwgMjU3LCAxKS5kYXRhO1xuICAgICAgXHRcdFx0Ly9kb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnYm9keScpWzBdLmFwcGVuZENoaWxkKHZtLmNhbnZhcyk7XG4gICAgICBcdFx0fSxcbiAgICAgICAgICBnZXRDb2xvcjogZnVuY3Rpb24odmFsdWUpe1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucGFsZXR0ZVt2YWx1ZV07XG4gICAgICAgICAgfVxuXG5cbiAgICAgICAgfVxuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLnNlcnZpY2VzJykuZmFjdG9yeSgnQ29udGVudFNlcnZpY2UnLCBmdW5jdGlvbihEYXRhU2VydmljZSl7XG4gICAgICAgIC8vXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgY29udGVudDoge1xuICAgICAgICAgICAgaW5kaWNhdG9yczpbXSxcbiAgICAgICAgICAgIGluZGljYXRvcjp7fSxcbiAgICAgICAgICAgIGRhdGE6IFtdLFxuICAgICAgICAgICAgY2F0ZWdvcmllczpbXSxcbiAgICAgICAgICAgIHN0eWxlczpbXSxcbiAgICAgICAgICAgIGluZm9ncmFwaGljczpbXVxuICAgICAgICAgIH0sXG4gICAgICAgICAgZmV0Y2hJbmRpY2F0b3JzOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgIHJldHVybiB0aGlzLmNvbnRlbnQuaW5kaWNhdG9ycyA9IERhdGFTZXJ2aWNlLmdldEFsbCgnaW5kaWNhdG9ycycpLiRvYmplY3RcbiAgICAgICAgICB9LFxuICAgICAgICAgIGdldEluZGljYXRvcnM6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jb250ZW50LmluZGljYXRvcnM7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBnZXRJbmRpY2F0b3I6IGZ1bmN0aW9uKGlkKXtcbiAgICAgICAgICAgIGlmKHRoaXMuY29udGVudC5pbmRpY2F0b3JzLmxlbmd0aCl7XG4gICAgICAgICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCB0aGlzLmNvbnRlbnQuaW5kaWNhdG9ycy5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICAgICAgaWYodGhpcy5jb250ZW50LmluZGljYXRvcnNbaV0uaWQgPT0gaWQpe1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY29udGVudC5pbmRpY2F0b3JzW2ldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY29udGVudC5pbmRpY2F0b3IgPSBEYXRhU2VydmljZS5nZXRPbmUoJ2luZGljYXRvcnMvJytpZCkuJG9iamVjdDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgIH0sXG4gICAgICAgICAgZ2V0SW5kaWNhdG9yRGF0YTogZnVuY3Rpb24oaWQpe1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY29udGVudC5kYXRhID0gRGF0YVNlcnZpY2UuZ2V0QWxsKCdpbmRpY2F0b3JzLycraWQrJy9kYXRhJyk7XG4gICAgICAgICAgfVxuXG4gICAgICAgIH1cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5zZXJ2aWNlcycpLmZhY3RvcnkoJ0NvdW50cmllc1NlcnZpY2UnLCBmdW5jdGlvbihEYXRhU2VydmljZSl7XG4gICAgICAgIC8vXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgY291bnRyaWVzOiBbXSxcbiAgICAgICAgICBmZXRjaERhdGE6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jb3VudHJpZXMgPSBEYXRhU2VydmljZS5nZXRPbmUoJ2NvdW50cmllcy9pc29zJykuJG9iamVjdDtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGdldERhdGE6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBpZighdGhpcy5jb3VudHJpZXMubGVuZ3RoKXtcbiAgICAgICAgICAgICAgdGhpcy5mZXRjaERhdGEoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNvdW50cmllcztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5zZXJ2aWNlcycpLmZhY3RvcnkoJ0RhdGFTZXJ2aWNlJywgRGF0YVNlcnZpY2UpO1xuICAgIERhdGFTZXJ2aWNlLiRpbmplY3QgPSBbJ1Jlc3Rhbmd1bGFyJywndG9hc3RyJ107XG5cbiAgICBmdW5jdGlvbiBEYXRhU2VydmljZShSZXN0YW5ndWxhciwgdG9hc3RyKXtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBnZXRBbGw6IGdldEFsbCxcbiAgICAgICAgICBnZXRPbmU6IGdldE9uZSxcbiAgICAgICAgICBwb3N0OiBwb3N0XG4gICAgICAgIH07XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0QWxsKHJvdXRlKXtcbiAgICAgICAgICB2YXIgZGF0YSA9IFJlc3Rhbmd1bGFyLmFsbChyb3V0ZSkuZ2V0TGlzdCgpO1xuICAgICAgICAgICAgZGF0YS50aGVuKGZ1bmN0aW9uKCl7fSwgZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgICAgICAgIHRvYXN0ci5lcnJvcihkYXRhLnN0YXR1c1RleHQsICdDb25uZWN0aW9uIEVycm9yJyk7XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBnZXRPbmUocm91dGUsIGlkKXtcbiAgICAgICAgICByZXR1cm4gUmVzdGFuZ3VsYXIub25lKHJvdXRlLCBpZCkuZ2V0KCk7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gcG9zdChyb3V0ZSwgZGF0YSl7XG4gICAgICAgICAgdmFyIGRhdGEgPSBSZXN0YW5ndWxhci5hbGwocm91dGUpLnBvc3QoZGF0YSk7XG4gICAgICAgICAgZGF0YS50aGVuKGZ1bmN0aW9uKCl7fSwgZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgICAgICB0b2FzdHIuZXJyb3IoZGF0YS5kYXRhLmVycm9yLCAnU2F2aW5nIGZhaWxlZCcpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gcHV0KHJvdXRlLCBkYXRhKXtcbiAgICAgICAgICByZXR1cm4gUmVzdGFuZ3VsYXIuYWxsKHJvdXRlKS5wdXQoZGF0YSk7XG4gICAgICAgIH1cbiAgICB9XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoXCJhcHAuc2VydmljZXNcIikuZmFjdG9yeSgnRGlhbG9nU2VydmljZScsIGZ1bmN0aW9uKCRtZERpYWxvZyl7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0ZnJvbVRlbXBsYXRlOiBmdW5jdGlvbih0ZW1wbGF0ZSwgJHNjb3BlKXtcblxuXHRcdFx0XHR2YXIgb3B0aW9ucyA9IHtcblx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogJy4vdmlld3MvZGlhbG9ncy8nICsgdGVtcGxhdGUgKyAnLycgKyB0ZW1wbGF0ZSArICcuaHRtbCdcblx0XHRcdFx0fTtcblxuXHRcdFx0XHRpZiAoJHNjb3BlKXtcblx0XHRcdFx0XHRvcHRpb25zLnNjb3BlID0gJHNjb3BlLiRuZXcoKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiAkbWREaWFsb2cuc2hvdyhvcHRpb25zKTtcblx0XHRcdH0sXG5cblx0XHRcdGhpZGU6IGZ1bmN0aW9uKCl7XG5cdFx0XHRcdHJldHVybiAkbWREaWFsb2cuaGlkZSgpO1xuXHRcdFx0fSxcblxuXHRcdFx0YWxlcnQ6IGZ1bmN0aW9uKHRpdGxlLCBjb250ZW50KXtcblx0XHRcdFx0JG1kRGlhbG9nLnNob3coXG5cdFx0XHRcdFx0JG1kRGlhbG9nLmFsZXJ0KClcblx0XHRcdFx0XHRcdC50aXRsZSh0aXRsZSlcblx0XHRcdFx0XHRcdC5jb250ZW50KGNvbnRlbnQpXG5cdFx0XHRcdFx0XHQub2soJ09rJylcblx0XHRcdFx0KTtcblx0XHRcdH0sXG5cblx0XHRcdGNvbmZpcm06IGZ1bmN0aW9uKHRpdGxlLCBjb250ZW50KSB7XG5cdFx0XHRcdHJldHVybiAkbWREaWFsb2cuc2hvdyhcblx0XHRcdFx0XHQkbWREaWFsb2cuY29uZmlybSgpXG5cdFx0XHRcdFx0XHQudGl0bGUodGl0bGUpXG5cdFx0XHRcdFx0XHQuY29udGVudChjb250ZW50KVxuXHRcdFx0XHRcdFx0Lm9rKCdPaycpXG5cdFx0XHRcdFx0XHQuY2FuY2VsKCdDYW5jZWwnKVxuXHRcdFx0XHQpO1xuXHRcdFx0fVxuXHRcdH07XG5cdH0pO1xufSkoKTsiLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuc2VydmljZXMnKS5mYWN0b3J5KCdJY29uc1NlcnZpY2UnLCBmdW5jdGlvbigpe1xuICAgICAgICB2YXIgdW5pY29kZXMgPSB7XG4gICAgICAgICAgJ2VtcHR5JzogXCJcXHVlNjAwXCIsXG4gICAgICAgICAgJ2FncmFyJzogXCJcXHVlNjAwXCIsXG4gICAgICAgICAgJ2FuY2hvcic6IFwiXFx1ZTYwMVwiLFxuICAgICAgICAgICdidXR0ZXJmbHknOiBcIlxcdWU2MDJcIixcbiAgICAgICAgICAnZW5lcmd5JzpcIlxcdWU2MDNcIixcbiAgICAgICAgICAnc2luayc6IFwiXFx1ZTYwNFwiLFxuICAgICAgICAgICdtYW4nOiBcIlxcdWU2MDVcIixcbiAgICAgICAgICAnZmFicmljJzogXCJcXHVlNjA2XCIsXG4gICAgICAgICAgJ3RyZWUnOlwiXFx1ZTYwN1wiLFxuICAgICAgICAgICd3YXRlcic6XCJcXHVlNjA4XCJcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGdldFVuaWNvZGU6IGZ1bmN0aW9uKGljb24pe1xuICAgICAgICAgICAgcmV0dXJuIHVuaWNvZGVzW2ljb25dO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZ2V0TGlzdDpmdW5jdGlvbigpe1xuICAgICAgICAgICAgcmV0dXJuIHVuaWNvZGVzO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLnNlcnZpY2VzJykuZmFjdG9yeSgnSW5kZXhTZXJ2aWNlJywgZnVuY3Rpb24oQ2FjaGVGYWN0b3J5LCRzdGF0ZSl7XG4gICAgICAgIC8vXG4gICAgICAgIHZhciBzZXJ2aWNlRGF0YSA9IHtcbiAgICAgICAgICAgIGRhdGE6IFtdLFxuICAgICAgICAgICAgZXJyb3JzOiBbXSxcbiAgICAgICAgICAgIGlzb19lcnJvcnM6W10sXG4gICAgICAgICAgICBtZXRhOntcbiAgICAgICAgICAgICAgaXNvX2ZpZWxkOiAnJyxcbiAgICAgICAgICAgICAgY291bnRyeV9maWVsZDonJyxcbiAgICAgICAgICAgICAgeWVhcl9maWVsZDonJyxcbiAgICAgICAgICAgICAgdGFibGU6W11cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBpbmRpY2F0b3JzOnt9LFxuICAgICAgICAgICAgdG9TZWxlY3Q6W11cbiAgICAgICAgfSwgc3RvcmFnZSwgaW1wb3J0Q2FjaGUsIGluZGljYXRvcjtcblxuICAgICAgICBpZiAoIUNhY2hlRmFjdG9yeS5nZXQoJ2ltcG9ydERhdGEnKSkge1xuICAgICAgICAgIGltcG9ydENhY2hlID0gQ2FjaGVGYWN0b3J5KCdpbXBvcnREYXRhJywge1xuICAgICAgICAgICAgY2FjaGVGbHVzaEludGVydmFsOiA2MCAqIDYwICogMTAwMCwgLy8gVGhpcyBjYWNoZSB3aWxsIGNsZWFyIGl0c2VsZiBldmVyeSBob3VyLlxuICAgICAgICAgICAgZGVsZXRlT25FeHBpcmU6ICdhZ2dyZXNzaXZlJywgLy8gSXRlbXMgd2lsbCBiZSBkZWxldGVkIGZyb20gdGhpcyBjYWNoZSByaWdodCB3aGVuIHRoZXkgZXhwaXJlLlxuICAgICAgICAgICAgc3RvcmFnZU1vZGU6ICdsb2NhbFN0b3JhZ2UnIC8vIFRoaXMgY2FjaGUgd2lsbCB1c2UgYGxvY2FsU3RvcmFnZWAuXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgc2VydmljZURhdGEgPSBpbXBvcnRDYWNoZS5nZXQoJ2RhdGFUb0ltcG9ydCcpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2V7XG4gICAgICAgICAgaW1wb3J0Q2FjaGUgPSBDYWNoZUZhY3RvcnkuZ2V0KCdpbXBvcnREYXRhJyk7XG4gICAgICAgICAgc3RvcmFnZSA9IGltcG9ydENhY2hlLmdldCgnZGF0YVRvSW1wb3J0Jyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBjbGVhcjpmdW5jdGlvbigpe1xuICAgICAgICAgICAgJHN0YXRlLmdvKCdhcHAuaW5kZXguY3JlYXRlJyk7XG4gICAgICAgICAgICBpZihDYWNoZUZhY3RvcnkuZ2V0KCdpbXBvcnREYXRhJykpe1xuICAgICAgICAgICAgICAgIGltcG9ydENhY2hlLnJlbW92ZSgnZGF0YVRvSW1wb3J0Jyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gc2VydmljZURhdGE9IHtcbiAgICAgICAgICAgICAgICBkYXRhOiBbXSxcbiAgICAgICAgICAgICAgICBlcnJvcnM6IFtdLFxuICAgICAgICAgICAgICAgIGlzb19lcnJvcnM6W10sXG4gICAgICAgICAgICAgICAgbWV0YTp7XG4gICAgICAgICAgICAgICAgICBpc29fZmllbGQ6ICcnLFxuICAgICAgICAgICAgICAgICAgY291bnRyeV9maWVsZDonJyxcbiAgICAgICAgICAgICAgICAgIHllYXJfZmllbGQ6JydcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHRvU2VsZWN0OltdLFxuICAgICAgICAgICAgICAgIGluZGljYXRvcnM6e31cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfSxcbiAgICAgICAgICBhZGREYXRhOmZ1bmN0aW9uKGl0ZW0pe1xuICAgICAgICAgICAgcmV0dXJuIHNlcnZpY2VEYXRhLmRhdGEucHVzaChpdGVtKTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGFkZEluZGljYXRvcjogZnVuY3Rpb24oaXRlbSl7XG4gICAgICAgICAgICByZXR1cm4gc2VydmljZURhdGEuaW5kaWNhdG9ycy5wdXNoKGl0ZW0pO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgYWRkVG9TZWxlY3Q6IGZ1bmN0aW9uKGl0ZW0pe1xuICAgICAgICAgICAgcmV0dXJuIHNlcnZpY2VEYXRhLnRvU2VsZWN0LnB1c2goaXRlbSk7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBhZGRJc29FcnJvcjogZnVuY3Rpb24oZXJyb3Ipe1xuICAgICAgICAgICAgcmV0dXJuIHNlcnZpY2VEYXRhLmlzb19lcnJvcnMucHVzaChlcnJvcik7XG4gICAgICAgICAgfSxcbiAgICAgICAgICByZW1vdmVUb1NlbGVjdDogZnVuY3Rpb24oaXRlbSl7XG4gICAgICAgICAgICB2YXIgaW5kZXggPSBzZXJ2aWNlRGF0YS50b1NlbGVjdC5pbmRleE9mKGl0ZW0pO1xuICAgICAgICAgICAgcmV0dXJuIGluZGV4ID4gLTEgPyBzZXJ2aWNlRGF0YS50b1NlbGVjdC5zcGxpY2UoaW5kZXgsIDEpIDogZmFsc2U7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBzZXREYXRhOiBmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgICAgIHJldHVybiBzZXJ2aWNlRGF0YS5kYXRhID0gZGF0YTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIHNldElzb0ZpZWxkOiBmdW5jdGlvbihrZXkpe1xuICAgICAgICAgICAgcmV0dXJuIHNlcnZpY2VEYXRhLm1ldGEuaXNvX2ZpZWxkID0ga2V5O1xuICAgICAgICAgIH0sXG4gICAgICAgICAgc2V0Q291bnRyeUZpZWxkOiBmdW5jdGlvbihrZXkpe1xuICAgICAgICAgICAgcmV0dXJuIHNlcnZpY2VEYXRhLm1ldGEuY291bnRyeV9maWVsZCA9IGtleTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIHNldEVycm9yczogZnVuY3Rpb24oZXJyb3JzKXtcbiAgICAgICAgICAgIHJldHVybiBzZXJ2aWNlRGF0YS5lcnJvcnMgPSBlcnJvcnM7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBzZXRUb0xvY2FsU3RvcmFnZTogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coc2VydmljZURhdGEpO1xuICAgICAgICAgICAgaW1wb3J0Q2FjaGUucHV0KCdkYXRhVG9JbXBvcnQnLHNlcnZpY2VEYXRhKTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIHNldEluZGljYXRvcjogZnVuY3Rpb24oa2V5LCBpdGVtKXtcbiAgICAgICAgICAgIHJldHVybiBzZXJ2aWNlRGF0YS5pbmRpY2F0b3JzW2tleV0gPSBpdGVtO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgc2V0QWN0aXZlSW5kaWNhdG9yRGF0YTogZnVuY3Rpb24oaXRlbSl7XG4gICAgICAgICAgICByZXR1cm4gaW5kaWNhdG9yID0gc2VydmljZURhdGEuaW5kaWNhdG9yc1tpdGVtLmNvbHVtbl9uYW1lXSA9IGl0ZW07XG4gICAgICAgICAgfSxcbiAgICAgICAgICBnZXRGcm9tTG9jYWxTdG9yYWdlOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgcmV0dXJuIHNlcnZpY2VEYXRhID0gaW1wb3J0Q2FjaGUuZ2V0KCdkYXRhVG9JbXBvcnQnKTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGdldEZ1bGxEYXRhOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgcmV0dXJuIHNlcnZpY2VEYXRhO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZ2V0RGF0YTogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIGlmKHR5cGVvZiBzZXJ2aWNlRGF0YSA9PSBcInVuZGVmaW5lZFwiKSByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICByZXR1cm4gc2VydmljZURhdGEuZGF0YTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGdldE1ldGE6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBpZih0eXBlb2Ygc2VydmljZURhdGEgPT0gXCJ1bmRlZmluZWRcIikgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgcmV0dXJuIHNlcnZpY2VEYXRhLm1ldGE7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBnZXRUb1NlbGVjdDogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHJldHVybiBzZXJ2aWNlRGF0YS50b1NlbGVjdDtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGdldElzb0ZpZWxkOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgcmV0dXJuIHNlcnZpY2VEYXRhLm1ldGEuaXNvX2ZpZWxkO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZ2V0Q291bnRyeUZpZWxkOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgcmV0dXJuIHNlcnZpY2VEYXRhLm1ldGEuY291bnRyeV9maWVsZDtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGdldEVycm9yczogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIGlmKHR5cGVvZiBzZXJ2aWNlRGF0YSA9PSBcInVuZGVmaW5lZFwiKSByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICByZXR1cm4gc2VydmljZURhdGEuZXJyb3JzO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZ2V0SXNvRXJyb3JzOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgaWYodHlwZW9mIHNlcnZpY2VEYXRhID09IFwidW5kZWZpbmVkXCIpIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIHJldHVybiBzZXJ2aWNlRGF0YS5pc29fZXJyb3JzO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZ2V0Rmlyc3RFbnRyeTogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHJldHVybiBzZXJ2aWNlRGF0YS5kYXRhWzBdO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZ2V0RGF0YVNpemU6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICByZXR1cm4gc2VydmljZURhdGEuZGF0YS5sZW5ndGg7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBnZXRJbmRpY2F0b3I6IGZ1bmN0aW9uKGtleSl7XG4gICAgICAgICAgICByZXR1cm4gaW5kaWNhdG9yID0gc2VydmljZURhdGEuaW5kaWNhdG9yc1trZXldO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZ2V0SW5kaWNhdG9yczogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIGlmKHR5cGVvZiBzZXJ2aWNlRGF0YSA9PSBcInVuZGVmaW5lZFwiKSByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICByZXR1cm4gc2VydmljZURhdGEuaW5kaWNhdG9ycztcbiAgICAgICAgICB9LFxuICAgICAgICAgIGFjdGl2ZUluZGljYXRvcjogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHJldHVybiBpbmRpY2F0b3I7XG4gICAgICAgICAgfSxcbiAgICAgICAgICByZWR1Y2VJc29FcnJvcjpmdW5jdGlvbigpe1xuICAgICAgICAgICAgcmV0dXJuIHNlcnZpY2VEYXRhLmlzb19lcnJvcnMuc3BsaWNlKDAsMSk7XG4gICAgICAgICAgfSxcbiAgICAgICAgICByZWR1Y2VFcnJvcjpmdW5jdGlvbigpe1xuICAgICAgICAgICAgcmV0dXJuIHNlcnZpY2VEYXRhLmVycm9ycy5zcGxpY2UoMCwxKTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIHJlc2V0VG9TZWxlY3Q6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICByZXR1cm4gc2VydmljZURhdGEudG9TZWxlY3QgPSBbXTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuc2VydmljZXMnKS5mYWN0b3J5KCdJbmRpemVzU2VydmljZScsIGZ1bmN0aW9uIChEYXRhU2VydmljZSkge1xuXHRcdC8vXG5cdFx0cmV0dXJuIHtcblx0XHRcdGluZGV4OiB7XG5cdFx0XHRcdGRhdGE6IHtcblx0XHRcdFx0XHRkYXRhOiBudWxsLFxuXHRcdFx0XHRcdHN0cnVjdHVyZTogbnVsbFxuXHRcdFx0XHR9LFxuXHRcdFx0XHRwcm9taXNlczoge1xuXHRcdFx0XHRcdGRhdGE6IG51bGwsXG5cdFx0XHRcdFx0c3RydWN0dXI6IG51bGxcblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdGZldGNoRGF0YTogZnVuY3Rpb24oaW5kZXgpIHtcblx0XHRcdFx0dGhpcy5pbmRleC5wcm9taXNlcy5kYXRhID0gRGF0YVNlcnZpY2UuZ2V0QWxsKCdpbmRleC8nICsgaW5kZXggKyAnL3llYXIvbGF0ZXN0Jyk7XG5cdFx0XHRcdHRoaXMuaW5kZXgucHJvbWlzZXMuc3RydWN0dXJlID0gRGF0YVNlcnZpY2UuZ2V0T25lKCdpbmRleC8nICsgaW5kZXggKyAnL3N0cnVjdHVyZScpO1xuXHRcdFx0XHR0aGlzLmluZGV4LmRhdGEuZGF0YSA9IHRoaXMuaW5kZXgucHJvbWlzZXMuZGF0YS4kb2JqZWN0O1xuXHRcdFx0XHR0aGlzLmluZGV4LmRhdGEuc3RydWN0dXJlID0gdGhpcy5pbmRleC5wcm9taXNlcy5zdHJ1Y3R1cmUuJG9iamVjdDtcblx0XHRcdFx0cmV0dXJuIHRoaXMuaW5kZXg7XG5cdFx0XHR9LFxuXHRcdFx0Z2V0RGF0YTogZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5pbmRleC5kYXRhLmRhdGE7XG5cdFx0XHR9LFxuXHRcdFx0Z2V0U3RydWN0dXJlOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLmluZGV4LmRhdGEuc3RydWN0dXJlO1xuXHRcdFx0fSxcblx0XHRcdGdldERhdGFQcm9taXNlOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLmluZGV4LnByb21pc2VzLmRhdGE7XG5cdFx0XHR9LFxuXHRcdFx0Z2V0U3RydWN0dXJlUHJvbWlzZTogZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5pbmRleC5wcm9taXNlcy5zdHJ1Y3R1cmU7XG5cdFx0XHR9XG5cdFx0fVxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZShcImFwcC5zZXJ2aWNlc1wiKS5mYWN0b3J5KCdUb2FzdFNlcnZpY2UnLCBmdW5jdGlvbigkbWRUb2FzdCl7XG5cblx0XHR2YXIgZGVsYXkgPSA2MDAwLFxuXHRcdFx0cG9zaXRpb24gPSAndG9wIHJpZ2h0Jyxcblx0XHRcdGFjdGlvbiA9ICdPSyc7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0c2hvdzogZnVuY3Rpb24oY29udGVudCl7XG5cdFx0XHRcdGlmICghY29udGVudCl7XG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuICRtZFRvYXN0LnNob3coXG5cdFx0XHRcdFx0JG1kVG9hc3Quc2ltcGxlKClcblx0XHRcdFx0XHRcdC5jb250ZW50KGNvbnRlbnQpXG5cdFx0XHRcdFx0XHQucG9zaXRpb24ocG9zaXRpb24pXG5cdFx0XHRcdFx0XHQuYWN0aW9uKGFjdGlvbilcblx0XHRcdFx0XHRcdC5oaWRlRGVsYXkoZGVsYXkpXG5cdFx0XHRcdCk7XG5cdFx0XHR9LFxuXHRcdFx0ZXJyb3I6IGZ1bmN0aW9uKGNvbnRlbnQpe1xuXHRcdFx0XHRpZiAoIWNvbnRlbnQpe1xuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiAkbWRUb2FzdC5zaG93KFxuXHRcdFx0XHRcdCRtZFRvYXN0LnNpbXBsZSgpXG5cdFx0XHRcdFx0XHQuY29udGVudChjb250ZW50KVxuXHRcdFx0XHRcdFx0LnBvc2l0aW9uKHBvc2l0aW9uKVxuXHRcdFx0XHRcdFx0LnRoZW1lKCd3YXJuJylcblx0XHRcdFx0XHRcdC5hY3Rpb24oYWN0aW9uKVxuXHRcdFx0XHRcdFx0LmhpZGVEZWxheShkZWxheSlcblx0XHRcdFx0KTtcblx0XHRcdH1cblx0XHR9O1xuXHR9KTtcbn0pKCk7IiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLnNlcnZpY2VzJykuZmFjdG9yeSgnVXNlclNlcnZpY2UnLCBmdW5jdGlvbihEYXRhU2VydmljZSl7XG4gICAgICAgIC8vXG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICB1c2VyOntcbiAgICAgICAgICAgIGRhdGE6IFtdXG4gICAgICAgICAgfSxcbiAgICAgICAgICBteURhdGE6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy51c2VyLmRhdGEgPSBEYXRhU2VydmljZS5nZXRBbGwoJ21lL2RhdGEnKS4kb2JqZWN0O1xuICAgICAgICAgIH0sXG4gICAgICAgICAgbXlQcm9maWxlOiBmdW5jdGlvbigpe1xuXG4gICAgICAgICAgfSxcbiAgICAgICAgICBteUZyaWVuZHM6IGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0luZGV4Q2hlY2tDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCRzdGF0ZSwgJGZpbHRlciwgdG9hc3RyLCBEaWFsb2dTZXJ2aWNlLCBJbmRleFNlcnZpY2Upe1xuICBcblxuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuICAgICAgICB2bS5kYXRhID0gSW5kZXhTZXJ2aWNlLmdldERhdGEoKTtcbiAgICAgICAgdm0ubWV0YSA9IEluZGV4U2VydmljZS5nZXRNZXRhKCk7XG4gICAgICAgIHZtLmVycm9ycyA9IEluZGV4U2VydmljZS5nZXRFcnJvcnMoKTtcbiAgICAgICAgdm0uc2VsZWN0ZWQgPSBbXTtcblxuICAgICAgICB2bS5kZWxldGVEYXRhID0gZGVsZXRlRGF0YTtcbiAgICAgICAgdm0uZGVsZXRlU2VsZWN0ZWQgPSBkZWxldGVTZWxlY3RlZDtcbiAgICAgICAgdm0uZGVsZXRlQ29sdW1uID0gZGVsZXRlQ29sdW1uO1xuICAgICAgICB2bS5vbk9yZGVyQ2hhbmdlID0gb25PcmRlckNoYW5nZTtcbiAgICAgICAgdm0ub25QYWdpbmF0aW9uQ2hhbmdlID0gb25QYWdpbmF0aW9uQ2hhbmdlO1xuICAgICAgICB2bS5jaGVja0ZvckVycm9ycyA9IGNoZWNrRm9yRXJyb3JzO1xuXG4gICAgICAgIHZtLnNob3dVcGxvYWRDb250YWluZXIgPSBmYWxzZTtcbiAgICAgICAgLy92bS5lZGl0Q29sdW1uRGF0YSA9IGVkaXRDb2x1bW5EYXRhO1xuICAgICAgICB2bS5lZGl0Um93ID0gZWRpdFJvdztcblxuICAgICAgICB2bS5xdWVyeSA9IHtcbiAgICAgICAgICBmaWx0ZXI6ICcnLFxuICAgICAgICAgIG9yZGVyOiAnLWVycm9ycycsXG4gICAgICAgICAgbGltaXQ6IDE1LFxuICAgICAgICAgIHBhZ2U6IDFcbiAgICAgICAgfTtcblxuICAgICAgICBhY3RpdmF0ZSgpO1xuXG4gICAgICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCl7XG4gICAgICAgICAgY2hlY2tEYXRhKCk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBjaGVja0RhdGEoKXtcbiAgICAgICAgICBpZighdm0uZGF0YSl7XG4gICAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC5pbmRleC5jcmVhdGUnKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBzZWFyY2gocHJlZGljYXRlKSB7XG4gICAgICAgICAgdm0uZmlsdGVyID0gcHJlZGljYXRlO1xuICAgICAgICB9O1xuICAgICAgICBmdW5jdGlvbiBvbk9yZGVyQ2hhbmdlKG9yZGVyKSB7XG4gICAgICAgICAgcmV0dXJuIHZtLmRhdGEgPSAkZmlsdGVyKCdvcmRlckJ5Jykodm0uZGF0YSwgW29yZGVyXSwgdHJ1ZSlcbiAgICAgICAgfTtcbiAgICAgICAgZnVuY3Rpb24gb25QYWdpbmF0aW9uQ2hhbmdlKHBhZ2UsIGxpbWl0KSB7XG4gICAgICAgICAgLy9jb25zb2xlLmxvZyhwYWdlLCBsaW1pdCk7XG4gICAgICAgICAgLy9yZXR1cm4gJG51dHJpdGlvbi5kZXNzZXJ0cy5nZXQoJHNjb3BlLnF1ZXJ5LCBzdWNjZXNzKS4kcHJvbWlzZTtcbiAgICAgICAgfTtcbiAgICAgICAgZnVuY3Rpb24gY2hlY2tGb3JFcnJvcnMoaXRlbSl7XG4gICAgICAgICAgcmV0dXJuIGl0ZW0uZXJyb3JzLmxlbmd0aCA+IDAgPyAnbWQtd2Fybic6ICcnO1xuICAgICAgICB9XG5cbiAgICAgICAgLypmdW5jdGlvbiBlZGl0Q29sdW1uRGF0YShlLCBrZXkpe1xuICAgICAgICAgIHZtLnRvRWRpdCA9IGtleTtcbiAgICAgICAgICBEaWFsb2dTZXJ2aWNlLmZyb21UZW1wbGF0ZSgnZWRpdGNvbHVtbicsICRzY29wZSk7XG4gICAgICAgIH0qL1xuICAgICAgICBmdW5jdGlvbiBkZWxldGVDb2x1bW4oZSwga2V5KXtcbiAgICAgICAgICBhbmd1bGFyLmZvckVhY2godm0uZGF0YSwgZnVuY3Rpb24oaXRlbSwgayl7XG4gICAgICAgICAgICBhbmd1bGFyLmZvckVhY2goaXRlbS5kYXRhWzBdLCBmdW5jdGlvbihmaWVsZCwgbCl7XG4gICAgICAgICAgICAgIGlmKGwgPT0ga2V5KXtcbiAgICAgICAgICAgICAgICBkZWxldGUgdm0uZGF0YVtrXS5kYXRhWzBdW2tleV07XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGRlbGV0ZVNlbGVjdGVkKCl7XG4gICAgICAgICAgYW5ndWxhci5mb3JFYWNoKHZtLnNlbGVjdGVkLCBmdW5jdGlvbihpdGVtLCBrZXkpe1xuICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKGl0ZW0uZXJyb3JzLCBmdW5jdGlvbihlcnJvciwgayl7XG4gICAgICAgICAgICAgIGlmKGVycm9yLnR5cGUgPT0gMiB8fCBlcnJvci50eXBlID09IDMpe1xuICAgICAgICAgICAgICAgIHZtLmlzb19lcnJvcnMgLS07XG4gICAgICAgICAgICAgICAgSW5kZXhTZXJ2aWNlLnJlZHVjZUlzb0Vycm9yKCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgdm0uZXJyb3JzIC0tO1xuICAgICAgICAgICAgICBJbmRleFNlcnZpY2UucmVkdWNlRXJyb3IoKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB2bS5kYXRhLnNwbGljZSh2bS5kYXRhLmluZGV4T2YoaXRlbSksIDEpO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIHZtLnNlbGVjdGVkID0gW107XG4gICAgICAgICAgaWYodm0uZGF0YS5sZW5ndGggPT0gMCl7XG4gICAgICAgICAgICB2bS5kZWxldGVEYXRhKCk7XG4gICAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC5pbmRleC5jcmVhdGUnKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gZWRpdFJvdygpe1xuICAgICAgICAgIHZtLnJvdyA9IHZtLnNlbGVjdGVkWzBdO1xuICAgICAgICAgIERpYWxvZ1NlcnZpY2UuZnJvbVRlbXBsYXRlKCdlZGl0cm93JywgJHNjb3BlKTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBkZWxldGVEYXRhKCl7XG4gICAgICAgICAgdm0uZGF0YSA9IFtdO1xuICAgICAgICB9XG5cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0luZGV4Q2hlY2tTaWRlYmFyQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgJHN0YXRlLCBJbmRleFNlcnZpY2UsIERhdGFTZXJ2aWNlLCBEaWFsb2dTZXJ2aWNlLCB0b2FzdHIpIHtcblx0XHR2YXIgdm0gPSB0aGlzO1xuXHRcdHZtLmRhdGEgPSBJbmRleFNlcnZpY2UuZ2V0RGF0YSgpO1xuXHRcdHZtLm1ldGEgPSBJbmRleFNlcnZpY2UuZ2V0TWV0YSgpO1xuXHRcdHZtLmVycm9ycyA9IEluZGV4U2VydmljZS5nZXRFcnJvcnMoKTtcblx0XHR2bS5pc29fZXJyb3JzID0gSW5kZXhTZXJ2aWNlLmdldElzb0Vycm9ycygpO1xuXHRcdHZtLmNsZWFyRXJyb3JzID0gY2xlYXJFcnJvcnM7XG5cdFx0dm0uZmV0Y2hJc28gPSBmZXRjaElzbztcblxuXHRcdGFjdGl2YXRlKCk7XG5cblx0XHRmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcblx0XHRcdHZtLm15RGF0YSA9IERhdGFTZXJ2aWNlLmdldEFsbCgnbWUvZGF0YScpO1xuXHRcdFx0Y2hlY2tNeURhdGEoKTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBjaGVja015RGF0YSgpIHtcblx0XHRcdHZtLmV4dGVuZGluZ0Nob2ljZXMgPSBbXTtcblx0XHRcdGlmICh2bS5kYXRhLmxlbmd0aCkge1xuXHRcdFx0XHR2bS5teURhdGEudGhlbihmdW5jdGlvbihpbXBvcnRzKSB7XG5cdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKGltcG9ydHMsIGZ1bmN0aW9uKGVudHJ5KSB7XG5cdFx0XHRcdFx0XHR2YXIgZm91bmQgPSAwO1xuXHRcdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLmRhdGFbMF0ubWV0YS5maWVsZHMsIGZ1bmN0aW9uKGZpZWxkKSB7XG5cdFx0XHRcdFx0XHRcdHZhciBjb2x1bW5zID0gSlNPTi5wYXJzZShlbnRyeS5tZXRhX2RhdGEpO1xuXHRcdFx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2goY29sdW1ucywgZnVuY3Rpb24oY29sdW1uKSB7XG5cdFx0XHRcdFx0XHRcdFx0aWYgKGNvbHVtbi5jb2x1bW4gPT0gZmllbGQpIHtcblx0XHRcdFx0XHRcdFx0XHRcdGZvdW5kKys7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRpZiAoZm91bmQgPj0gdm0uZGF0YVswXS5tZXRhLmZpZWxkcy5sZW5ndGggLSAyKSB7XG5cdFx0XHRcdFx0XHRcdHZtLmV4dGVuZGluZ0Nob2ljZXMucHVzaChlbnRyeSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRpZiAodm0uZXh0ZW5kaW5nQ2hvaWNlcy5sZW5ndGgpIHtcblx0XHRcdFx0XHRcdERpYWxvZ1NlcnZpY2UuZnJvbVRlbXBsYXRlKCdleHRlbmREYXRhJywgJHNjb3BlKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGNsZWFyRXJyb3JzKCkge1xuXHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLmRhdGEsIGZ1bmN0aW9uKHJvdywga2V5KSB7XG5cdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChyb3cuZGF0YVswXSwgZnVuY3Rpb24oaXRlbSwgaykge1xuXHRcdFx0XHRcdGlmIChpc05hTihpdGVtKSB8fCBpdGVtIDwgMCkge1xuXHRcdFx0XHRcdFx0aWYgKCAvKml0ZW0udG9TdHJpbmcoKS50b1VwcGVyQ2FzZSgpID09IFwiTkFcIiB8fCovIGl0ZW0gPCAwIHx8IGl0ZW0udG9TdHJpbmcoKS50b1VwcGVyQ2FzZSgpLmluZGV4T2YoJ04vQScpID4gLTEpIHtcblx0XHRcdFx0XHRcdFx0dm0uZGF0YVtrZXldLmRhdGFbMF1ba10gPSBudWxsO1xuXHRcdFx0XHRcdFx0XHRyb3cuZXJyb3JzLnNwbGljZSgwLCAxKTtcblx0XHRcdFx0XHRcdFx0dm0uZXJyb3JzLnNwbGljZSgwLCAxKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRpZiAoIXJvdy5kYXRhWzBdW3ZtLm1ldGEuaXNvX2ZpZWxkXSkge1xuXHRcdFx0XHRcdHZhciBlcnJvciA9IHtcblx0XHRcdFx0XHRcdHR5cGU6IFwiMlwiLFxuXHRcdFx0XHRcdFx0bWVzc2FnZTogXCJJc28gZmllbGQgaXMgbm90IHZhbGlkIVwiLFxuXHRcdFx0XHRcdFx0dmFsdWU6IHJvdy5kYXRhWzBdW3ZtLm1ldGEuaXNvX2ZpZWxkXSxcblx0XHRcdFx0XHRcdGNvbHVtbjogdm0ubWV0YS5pc29fZmllbGQsXG5cdFx0XHRcdFx0XHRyb3c6IGtleVxuXHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0dmFyIGVycm9yRm91bmQgPSBmYWxzZTtcblx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2gocm93LmVycm9ycywgZnVuY3Rpb24oZXJyb3IsIGtleSkge1xuXHRcdFx0XHRcdFx0aWYgKGVycm9yLnR5cGUgPT0gMikge1xuXHRcdFx0XHRcdFx0XHRlcnJvckZvdW5kID0gdHJ1ZTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdGlmICghZXJyb3JGb3VuZCkge1xuXHRcdFx0XHRcdFx0cm93LmVycm9ycy5wdXNoKGVycm9yKTtcblx0XHRcdFx0XHRcdHZtLmlzb19lcnJvcnMucHVzaChlcnJvcik7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBmZXRjaElzbygpIHtcblx0XHRcdGlmICghdm0ubWV0YS5pc29fZmllbGQpIHtcblx0XHRcdFx0dG9hc3RyLmVycm9yKCdDaGVjayB5b3VyIHNlbGVjdGlvbiBmb3IgdGhlIElTTyBmaWVsZCcsICdDb2x1bW4gbm90IHNwZWNpZmllZCEnKTtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXHRcdFx0aWYgKCF2bS5tZXRhLmNvdW50cnlfZmllbGQpIHtcblx0XHRcdFx0dG9hc3RyLmVycm9yKCdDaGVjayB5b3VyIHNlbGVjdGlvbiBmb3IgdGhlIENPVU5UUlkgZmllbGQnLCAnQ29sdW1uIG5vdCBzcGVjaWZpZWQhJyk7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblx0XHRcdGlmICh2bS5tZXRhLmNvdW50cnlfZmllbGQgPT0gdm0ubWV0YS5pc29fZmllbGQpIHtcblx0XHRcdFx0dG9hc3RyLmVycm9yKCdJU08gZmllbGQgYW5kIENPVU5UUlkgZmllbGQgY2FuIG5vdCBiZSB0aGUgc2FtZScsICdTZWxlY3Rpb24gZXJyb3IhJyk7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblxuXHRcdFx0dm0ubm90Rm91bmQgPSBbXTtcblx0XHRcdHZhciBlbnRyaWVzID0gW107XG5cdFx0XHR2YXIgaXNvQ2hlY2sgPSAwO1xuXHRcdFx0dmFyIGlzb1R5cGUgPSAnaXNvLTMxNjYtMic7XG5cdFx0XHRhbmd1bGFyLmZvckVhY2godm0uZGF0YSwgZnVuY3Rpb24oaXRlbSwga2V5KSB7XG5cdFx0XHRcdGlmIChpdGVtLmRhdGFbMF1bdm0ubWV0YS5pc29fZmllbGRdKSB7XG5cdFx0XHRcdFx0aXNvQ2hlY2sgKz0gaXRlbS5kYXRhWzBdW3ZtLm1ldGEuaXNvX2ZpZWxkXS5sZW5ndGggPT0gMyA/IDEgOiAwO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHN3aXRjaCAoaXRlbS5kYXRhWzBdW3ZtLm1ldGEuY291bnRyeV9maWVsZF0pIHtcblx0XHRcdFx0XHRjYXNlICdDYWJvIFZlcmRlJzpcblx0XHRcdFx0XHRcdGl0ZW0uZGF0YVswXVt2bS5tZXRhLmNvdW50cnlfZmllbGRdID0gJ0NhcGUgVmVyZGUnO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSBcIkRlbW9jcmF0aWMgUGVvcGxlcyBSZXB1YmxpYyBvZiBLb3JlYVwiOlxuXHRcdFx0XHRcdFx0aXRlbS5kYXRhWzBdW3ZtLm1ldGEuY291bnRyeV9maWVsZF0gPSBcIkRlbW9jcmF0aWMgUGVvcGxlJ3MgUmVwdWJsaWMgb2YgS29yZWFcIjtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgXCJDb3RlIGQnSXZvaXJlXCI6XG5cdFx0XHRcdFx0XHRpdGVtLmRhdGFbMF1bdm0ubWV0YS5jb3VudHJ5X2ZpZWxkXSA9IFwiSXZvcnkgQ29hc3RcIjtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgXCJMYW8gUGVvcGxlcyBEZW1vY3JhdGljIFJlcHVibGljXCI6XG5cdFx0XHRcdFx0XHRpdGVtLmRhdGFbMF1bdm0ubWV0YS5jb3VudHJ5X2ZpZWxkXSA9IFwiTGFvIFBlb3BsZSdzIERlbW9jcmF0aWMgUmVwdWJsaWNcIjtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXHRcdFx0XHRlbnRyaWVzLnB1c2goe1xuXHRcdFx0XHRcdGlzbzogaXRlbS5kYXRhWzBdW3ZtLm1ldGEuaXNvX2ZpZWxkXSxcblx0XHRcdFx0XHRuYW1lOiBpdGVtLmRhdGFbMF1bdm0ubWV0YS5jb3VudHJ5X2ZpZWxkXVxuXHRcdFx0XHR9KTtcblx0XHRcdH0pO1xuXHRcdFx0dmFyIGlzb1R5cGUgPSBpc29DaGVjayA+PSAoZW50cmllcy5sZW5ndGggLyAyKSA/ICdpc28tMzE2Ni0xJyA6ICdpc28tMzE2Ni0yJztcblx0XHRcdEluZGV4U2VydmljZS5yZXNldFRvU2VsZWN0KCk7XG5cdFx0XHREYXRhU2VydmljZS5wb3N0KCdjb3VudHJpZXMvYnlJc29OYW1lcycsIHtcblx0XHRcdFx0ZGF0YTogZW50cmllcyxcblx0XHRcdFx0aXNvOiBpc29UeXBlXG5cdFx0XHR9KS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG5cdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChyZXNwb25zZSwgZnVuY3Rpb24oY291bnRyeSwga2V5KSB7XG5cdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLmRhdGEsIGZ1bmN0aW9uKGl0ZW0sIGspIHtcblx0XHRcdFx0XHRcdGlmIChjb3VudHJ5Lm5hbWUgPT0gaXRlbS5kYXRhWzBdW3ZtLm1ldGEuY291bnRyeV9maWVsZF0pIHtcblx0XHRcdFx0XHRcdFx0aWYgKGNvdW50cnkuZGF0YS5sZW5ndGggPiAxKSB7XG5cdFx0XHRcdFx0XHRcdFx0dmFyIHRvU2VsZWN0ID0ge1xuXHRcdFx0XHRcdFx0XHRcdFx0ZW50cnk6IGl0ZW0sXG5cdFx0XHRcdFx0XHRcdFx0XHRvcHRpb25zOiBjb3VudHJ5LmRhdGFcblx0XHRcdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdFx0XHRcdEluZGV4U2VydmljZS5hZGRUb1NlbGVjdCh0b1NlbGVjdCk7XG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0aWYgKHR5cGVvZiBjb3VudHJ5LmRhdGFbMF0gIT0gXCJ1bmRlZmluZWRcIikge1xuXHRcdFx0XHRcdFx0XHRcdFx0dm0uZGF0YVtrXS5kYXRhWzBdW3ZtLm1ldGEuaXNvX2ZpZWxkXSA9IGNvdW50cnkuZGF0YVswXS5pc287XG5cdFx0XHRcdFx0XHRcdFx0XHR2bS5kYXRhW2tdLmRhdGFbMF1bdm0ubWV0YS5jb3VudHJ5X2ZpZWxkXSA9IGNvdW50cnkuZGF0YVswXS5hZG1pbjtcblx0XHRcdFx0XHRcdFx0XHRcdGlmIChpdGVtLmVycm9ycy5sZW5ndGgpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKGl0ZW0uZXJyb3JzLCBmdW5jdGlvbihlcnJvciwgZSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlmIChlcnJvci50eXBlID09IDIgfHwgZXJyb3IudHlwZSA9PSAzKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR2bS5pc29fZXJyb3JzLnNwbGljZSgwLCAxKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGl0ZW0uZXJyb3JzLnNwbGljZShlLCAxKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9IGVsc2UgaWYgKGVycm9yLnR5cGUgPT0gMSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKGVycm9yLmNvbHVtbiA9PSB2bS5tZXRhLmlzb19maWVsZCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR2bS5lcnJvcnMuc3BsaWNlKDAsIDEpO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpdGVtLmVycm9ycy5zcGxpY2UoZSwgMSk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRjb25zb2xlLmxvZyh2bS5kYXRhW2tdKTtcblx0XHRcdFx0XHRcdFx0XHRcdHZhciBlcnJvciA9IHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0dHlwZTogXCIzXCIsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdG1lc3NhZ2U6IFwiQ291bGQgbm90IGxvY2F0ZSBhIHZhbGlkIGlzbyBuYW1lIVwiLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRjb2x1bW46IHZtLm1ldGEuY291bnRyeV9maWVsZFxuXHRcdFx0XHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdFx0XHRcdHZhciBlcnJvckZvdW5kID0gZmFsc2U7XG5cdFx0XHRcdFx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2godm0uZGF0YVtrXS5lcnJvcnMsIGZ1bmN0aW9uKGVycm9yLCBpKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKGVycm9yKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKGVycm9yLnR5cGUgPT0gMykge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVycm9yRm91bmQgPSB0cnVlO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0XHRcdFx0aWYgKCFlcnJvckZvdW5kKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdEluZGV4U2VydmljZS5hZGRJc29FcnJvcihlcnJvcik7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGl0ZW0uZXJyb3JzLnB1c2goZXJyb3IpO1xuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9KTtcblx0XHRcdFx0dm0uaXNvX2NoZWNrZWQgPSB0cnVlO1xuXHRcdFx0XHRpZiAoSW5kZXhTZXJ2aWNlLmdldFRvU2VsZWN0KCkubGVuZ3RoKSB7XG5cdFx0XHRcdFx0RGlhbG9nU2VydmljZS5mcm9tVGVtcGxhdGUoJ3NlbGVjdGlzb2ZldGNoZXJzJyk7XG5cdFx0XHRcdH1cblx0XHRcdH0sIGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG5cdFx0XHRcdHRvYXN0ci5lcnJvcignUGxlYXNlIGNoZWNrIHlvdXIgZmllbGQgc2VsZWN0aW9ucycsIHJlc3BvbnNlLmRhdGEubWVzc2FnZSk7XG5cdFx0XHR9KTtcblxuXHRcdH1cblx0XHR2bS5leHRlbmREYXRhID0gZXh0ZW5kRGF0YTtcblxuXHRcdGZ1bmN0aW9uIGV4dGVuZERhdGEoKSB7XG5cdFx0XHR2YXIgaW5zZXJ0RGF0YSA9IHtcblx0XHRcdFx0ZGF0YTogW11cblx0XHRcdH07XG5cdFx0XHR2YXIgbWV0YSA9IFtdLFxuXHRcdFx0XHRmaWVsZHMgPSBbXTtcblx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5kYXRhLCBmdW5jdGlvbihpdGVtLCBrZXkpIHtcblx0XHRcdFx0aWYgKGl0ZW0uZXJyb3JzLmxlbmd0aCA9PSAwKSB7XG5cdFx0XHRcdFx0aXRlbS5kYXRhWzBdLnllYXIgPSB2bS5tZXRhLnllYXI7XG5cdFx0XHRcdFx0aW5zZXJ0RGF0YS5kYXRhLnB1c2goaXRlbS5kYXRhWzBdKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHR0b2FzdHIuZXJyb3IoJ1RoZXJlIGFyZSBzb21lIGVycm9ycyBsZWZ0IScsICdIdWNoIScpO1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0XHRjb25zb2xlLmxvZyhpbnNlcnREYXRhKTtcblx0XHRcdERhdGFTZXJ2aWNlLnBvc3QoJ2RhdGEvdGFibGVzLycgKyB2bS5hZGREYXRhVG8udGFibGVfbmFtZSArICcvaW5zZXJ0JywgaW5zZXJ0RGF0YSkudGhlbihmdW5jdGlvbihyZXMpIHtcblx0XHRcdFx0aWYgKHJlcyA9PSB0cnVlKSB7XG5cdFx0XHRcdFx0dG9hc3RyLnN1Y2Nlc3MoaW5zZXJ0RGF0YS5kYXRhLmxlbmd0aCArICcgaXRlbXMgaW1wb3J0ZXQgdG8gJyArIHZtLm1ldGEubmFtZSwgJ1N1Y2Nlc3MnKTtcblx0XHRcdFx0XHR2bS5kYXRhID0gSW5kZXhTZXJ2aWNlLmNsZWFyKCk7XG5cdFx0XHRcdFx0JHN0YXRlLmdvKCdhcHAuaW5kZXgubXlkYXRhJyk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH1cblxuXHR9KTtcbn0pKCk7IiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignSG9tZUN0cmwnLCBmdW5jdGlvbihEYXRhU2VydmljZSl7XG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG4gICAgICAgIERhdGFTZXJ2aWNlLmdldEFsbCgnaW5kZXgnKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgICAgICB2bS5pbmRpemVzID0gcmVzcG9uc2U7XG4gICAgICAgIH0pO1xuXG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignSW1wb3J0Y3N2Q3RybCcsIGZ1bmN0aW9uICgkbWREaWFsb2cpIHtcblx0XHR0aGlzLnNldHRpbmdzID0ge1xuXHRcdFx0cHJpbnRMYXlvdXQ6IHRydWUsXG5cdFx0XHRzaG93UnVsZXI6IHRydWUsXG5cdFx0XHRzaG93U3BlbGxpbmdTdWdnZXN0aW9uczogdHJ1ZSxcblx0XHRcdHByZXNlbnRhdGlvbk1vZGU6ICdlZGl0J1xuXHRcdH07XG5cblx0XHR0aGlzLnNhbXBsZUFjdGlvbiA9IGZ1bmN0aW9uIChuYW1lLCBldikge1xuXHRcdFx0JG1kRGlhbG9nLnNob3coJG1kRGlhbG9nLmFsZXJ0KClcblx0XHRcdFx0LnRpdGxlKG5hbWUpXG5cdFx0XHRcdC5jb250ZW50KCdZb3UgdHJpZ2dlcmVkIHRoZSBcIicgKyBuYW1lICsgJ1wiIGFjdGlvbicpXG5cdFx0XHRcdC5vaygnR3JlYXQnKVxuXHRcdFx0XHQudGFyZ2V0RXZlbnQoZXYpXG5cdFx0XHQpO1xuXHRcdH07XG5cbiAgICB0aGlzLm9wZW5Dc3ZVcGxvYWQgPSBmdW5jdGlvbigpIHtcblx0XHRcdCRtZERpYWxvZy5zaG93KHtcblx0XHRcdFx0XHQvL2NvbnRyb2xsZXI6IERpYWxvZ0NvbnRyb2xsZXIsXG5cdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICcvdmlld3MvYXBwL2ltcG9ydGNzdi9jc3ZVcGxvYWREaWFsb2cuaHRtbCcsXG5cdCAgICAgICAgYmluZFRvQ29udHJvbGxlcjogdHJ1ZSxcblx0XHRcdFx0fSlcblx0XHRcdFx0LnRoZW4oZnVuY3Rpb24gKGFuc3dlcikge1xuXG5cdFx0XHRcdH0sIGZ1bmN0aW9uICgpIHtcblxuXHRcdFx0XHR9KTtcblx0XHR9O1xuXHR9KVxuXG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignSW5kZXhDdHJsJywgZnVuY3Rpb24gKCRzY29wZSwgJHdpbmRvdywgJHJvb3RTY29wZSwkZmlsdGVyLCAkc3RhdGUsICR0aW1lb3V0LCBUb2FzdFNlcnZpY2UsIFZlY3RvcmxheWVyU2VydmljZSwgZGF0YSwgY291bnRyaWVzLCBsZWFmbGV0RGF0YSwgRGF0YVNlcnZpY2UpIHtcblx0XHQvLyBWYXJpYWJsZSBkZWZpbml0aW9uc1xuXHRcdHZhciB2bSA9IHRoaXM7XG5cdFx0dm0ubWFwID0gbnVsbDtcblxuXHRcdHZtLmRhdGFTZXJ2ZXIgPSBkYXRhLnByb21pc2VzLmRhdGE7XG5cdFx0dm0uc3RydWN0dXJlU2VydmVyID0gZGF0YS5wcm9taXNlcy5zdHJ1Y3R1cmU7XG5cdFx0dm0uY291bnRyeUxpc3QgPSBjb3VudHJpZXM7XG5cblx0XHR2bS5zdHJ1Y3R1cmUgPSBcIlwiO1xuXHRcdHZtLm12dFNjb3VyY2UgPSBWZWN0b3JsYXllclNlcnZpY2UuZ2V0TGF5ZXIoKTtcblx0XHR2bS5tdnRDb3VudHJ5TGF5ZXIgPSBWZWN0b3JsYXllclNlcnZpY2UuZ2V0TmFtZSgpO1xuXHRcdHZtLm12dENvdW50cnlMYXllckdlb20gPSB2bS5tdnRDb3VudHJ5TGF5ZXIrXCJfZ2VvbVwiO1xuXHRcdHZtLmlzb19maWVsZCA9IFZlY3RvcmxheWVyU2VydmljZS5kYXRhLmlzbzI7XG5cdFx0dm0ubm9kZVBhcmVudCA9IHt9O1xuXHRcdHZtLnNlbGVjdGVkVGFiID0gMDtcblx0XHR2bS5jdXJyZW50ID0gXCJcIjtcblx0XHR2bS50YWJDb250ZW50ID0gXCJcIjtcblx0XHR2bS50b2dnbGVCdXR0b24gPSAnYXJyb3dfZHJvcF9kb3duJztcblx0XHR2bS5tZW51ZU9wZW4gPSB0cnVlO1xuXHRcdHZtLmluZm8gPSBmYWxzZTtcblx0XHR2bS5jbG9zZUljb24gPSAnY2xvc2UnO1xuXHRcdHZtLmNvbXBhcmUgPSB7XG5cdFx0XHRhY3RpdmU6IGZhbHNlLFxuXHRcdFx0Y291bnRyaWVzOiBbXVxuXHRcdH07XG5cdFx0dm0uZGlzcGxheSA9IHtcblx0XHRcdHNlbGVjdGVkQ2F0OiAnJ1xuXHRcdH07XG5cblx0XHQvL0Z1bmN0aW9uIGRlZmluaXRvbnNcblx0XHR2bS5zaG93VGFiQ29udGVudCA9IHNob3dUYWJDb250ZW50O1xuXHRcdHZtLnNldFRhYiA9IHNldFRhYjtcblx0XHR2bS5zZXRTdGF0ZSA9IHNldFN0YXRlO1xuXHRcdHZtLnNldEN1cnJlbnQgPSBzZXRDdXJyZW50O1xuXHRcdHZtLnNldFNlbGVjdGVkRmVhdHVyZSA9IHNldFNlbGVjdGVkRmVhdHVyZTtcblx0XHR2bS5nZXRSYW5rID0gZ2V0UmFuaztcblx0XHR2bS5nZXRPZmZzZXQgPSBnZXRPZmZzZXQ7XG5cdFx0dm0uZ2V0VGVuZGVuY3kgPSBnZXRUZW5kZW5jeTtcblxuXHRcdHZtLmNoZWNrQ29tcGFyaXNvbiA9IGNoZWNrQ29tcGFyaXNvbjtcblx0XHR2bS50b2dnbGVPcGVuID0gdG9nZ2xlT3Blbjtcblx0XHR2bS50b2dnbGVJbmZvID0gdG9nZ2xlSW5mbztcblx0XHR2bS50b2dnbGVEZXRhaWxzID0gdG9nZ2xlRGV0YWlscztcblx0XHR2bS50b2dnbGVDb21wYXJpc29uID0gdG9nZ2xlQ29tcGFyaXNvbjtcblx0XHR2bS50b2dnbGVDb3VudHJpZUxpc3QgPSB0b2dnbGVDb3VudHJpZUxpc3Q7XG5cdFx0dm0ubWFwR290b0NvdW50cnkgPSBtYXBHb3RvQ291bnRyeTtcblx0XHR2bS5nb0JhY2sgPSBnb0JhY2s7XG5cblx0XHR2bS5jYWxjVHJlZSA9IGNhbGNUcmVlO1xuXG5cdFx0YWN0aXZhdGUoKTtcblxuXHRcdGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xuXG5cdFx0XHR2bS5zdHJ1Y3R1cmVTZXJ2ZXIudGhlbihmdW5jdGlvbihzdHJ1Y3R1cmUpe1xuXHRcdFx0XHR2bS5kYXRhU2VydmVyLnRoZW4oZnVuY3Rpb24oZGF0YSl7XG5cdFx0XHRcdFx0dm0uZGF0YSA9IGRhdGE7XG5cdFx0XHRcdFx0dm0uc3RydWN0dXJlID0gc3RydWN0dXJlO1xuXHRcdFx0XHRcdGlmKCF2bS5zdHJ1Y3R1cmUuc3R5bGUpe1xuXHRcdFx0XHRcdFx0dm0uc3RydWN0dXJlLnN0eWxlID0ge1xuXHRcdFx0XHRcdFx0XHQnbmFtZSc6J2RlZmF1bHQnLFxuXHRcdFx0XHRcdFx0XHQndGl0bGUnOidEZWZhdWx0Jyxcblx0XHRcdFx0XHRcdFx0J2Jhc2VfY29sb3InOidyZ2JhKDEyOCwgMjQzLCAxOTgsMSknXG5cdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRjcmVhdGVDYW52YXModm0uc3RydWN0dXJlLnN0eWxlLmJhc2VfY29sb3IpO1xuXHRcdFx0XHRcdGRyYXdDb3VudHJpZXMoKTtcblx0XHRcdFx0XHRpZigkc3RhdGUucGFyYW1zLml0ZW0pe1xuXHRcdFx0XHRcdFx0dm0uc2V0U3RhdGUoJHN0YXRlLnBhcmFtcy5pdGVtKTtcblx0XHRcdFx0XHRcdGNhbGNSYW5rKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmKCRzdGF0ZS5wYXJhbXMuY291bnRyaWVzKXtcblx0XHRcdFx0XHRcdHZtLnNldFRhYigyKTtcblx0XHRcdFx0XHRcdHZtLmNvbXBhcmUuY291bnRyaWVzLnB1c2godm0uY3VycmVudCk7XG5cdFx0XHRcdFx0XHR2bS5jb21wYXJlLmFjdGl2ZSA9IHRydWU7XG5cdFx0XHRcdFx0XHQkcm9vdFNjb3BlLmdyZXllZCA9IHRydWU7XG5cdFx0XHRcdFx0XHR2YXIgY291bnRyaWVzID0gJHN0YXRlLnBhcmFtcy5jb3VudHJpZXMuc3BsaXQoJy12cy0nKTtcblx0XHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChjb3VudHJpZXMsIGZ1bmN0aW9uKGlzbyl7XG5cdFx0XHRcdFx0XHRcdHZtLmNvbXBhcmUuY291bnRyaWVzLnB1c2goZ2V0TmF0aW9uQnlJc28oaXNvKSk7XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdC8vb25zb2xlLmxvZyh2bS5jb21wYXJlLmNvdW50cmllcyk7XG5cdFx0XHRcdFx0XHRjb3VudHJpZXMucHVzaCh2bS5jdXJyZW50Lmlzbyk7XG5cdFx0XHRcdFx0XHREYXRhU2VydmljZS5nZXRPbmUoJ2NvdW50cmllcy9iYm94JywgY291bnRyaWVzKS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG5cdFx0XHRcdFx0XHRcdHZtLmJib3ggPSBkYXRhO1xuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KVxuXHRcdFx0fSk7XG5cblx0XHR9XG5cblx0XHRmdW5jdGlvbiBnb0JhY2soKXtcblx0XHRcdCR3aW5kb3cuaGlzdG9yeS5iYWNrKCk7XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIHNob3dUYWJDb250ZW50KGNvbnRlbnQpIHtcblx0XHRcdGlmIChjb250ZW50ID09ICcnICYmIHZtLnRhYkNvbnRlbnQgPT0gJycpIHtcblx0XHRcdFx0dm0udGFiQ29udGVudCA9ICdyYW5rJztcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHZtLnRhYkNvbnRlbnQgPSBjb250ZW50O1xuXHRcdFx0fVxuXHRcdFx0dm0udG9nZ2xlQnV0dG9uID0gdm0udGFiQ29udGVudCA/ICdhcnJvd19kcm9wX3VwJyA6ICdhcnJvd19kcm9wX2Rvd24nO1xuXHRcdH07XG5cdFx0ZnVuY3Rpb24gc2V0U3RhdGUoaXRlbSkge1xuXHRcdFx0dm0uc2V0Q3VycmVudChnZXROYXRpb25CeUlzbyhpdGVtKSk7XG5cdFx0XHRmZXRjaE5hdGlvbkRhdGEoaXRlbSk7XG5cdFx0fTtcblxuXHRcdGZ1bmN0aW9uIHRvZ2dsZU9wZW4oKSB7XG5cdFx0XHR2bS5tZW51ZU9wZW4gPSAhdm0ubWVudWVPcGVuO1xuXHRcdFx0dm0uY2xvc2VJY29uID0gdm0ubWVudWVPcGVuID09IHRydWUgPyAnY2hldnJvbl9sZWZ0JyA6ICdjaGV2cm9uX3JpZ2h0Jztcblx0XHR9XG5cdFx0ZnVuY3Rpb24gc2V0Q3VycmVudChuYXQpIHtcblx0XHRcdHZtLmN1cnJlbnQgPSBuYXQ7XG5cdFx0XHR2bS5zZXRTZWxlY3RlZEZlYXR1cmUoKTtcblx0XHR9O1xuXG5cdFx0ZnVuY3Rpb24gc2V0U2VsZWN0ZWRGZWF0dXJlKGlzbykge1xuXHRcdFx0aWYgKHZtLm12dFNvdXJjZSkge1xuXHRcdFx0XHQkdGltZW91dChmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0dm0ubXZ0U291cmNlLmxheWVyc1t2bS5tdnRDb3VudHJ5TGF5ZXJHZW9tXS5mZWF0dXJlc1t2bS5jdXJyZW50Lmlzb10uc2VsZWN0ZWQgPSB0cnVlO1xuXHRcdFx0XHR9KVxuXHRcdFx0fVxuXHRcdH07XG5cdFx0ZnVuY3Rpb24gY2FsY1JhbmsoKSB7XG5cdFx0XHRpZighdm0uY3VycmVudCl7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHRcdHZhciByYW5rID0gMDtcblx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5kYXRhLCBmdW5jdGlvbihpdGVtKSB7XG5cdFx0XHRcdGl0ZW1bdm0uc3RydWN0dXJlLm5hbWVdID0gcGFyc2VGbG9hdChpdGVtW3ZtLnN0cnVjdHVyZS5uYW1lXSk7XG5cdFx0XHRcdGl0ZW1bJ3Njb3JlJ10gPSBwYXJzZUZsb2F0KGl0ZW1bdm0uc3RydWN0dXJlLm5hbWVdKTtcblx0XHRcdH0pO1xuXHRcdFx0dm0uZGF0YSA9ICRmaWx0ZXIoJ29yZGVyQnknKSh2bS5kYXRhLCBbdm0uc3RydWN0dXJlLm5hbWVdLCAnaXNvJywgdHJ1ZSk7XG5cdFx0XHRyYW5rID0gdm0uZGF0YS5pbmRleE9mKHZtLmN1cnJlbnQpICsgMTtcblx0XHRcdHZtLmN1cnJlbnRbdm0uc3RydWN0dXJlLm5hbWUrJ19yYW5rJ10gPSByYW5rO1xuXHRcdFx0dm0uY2lyY2xlT3B0aW9ucyA9IHtcblx0XHRcdFx0XHRjb2xvcjp2bS5zdHJ1Y3R1cmUuc3R5bGUuYmFzZV9jb2xvciB8fCAnIzAwY2NhYScsXG5cdFx0XHRcdFx0ZmllbGQ6dm0uc3RydWN0dXJlLm5hbWUrJ19yYW5rJ1xuXHRcdFx0fTtcblx0XHRcdHJldHVybiByYW5rO1xuXHRcdH1cblx0XHRmdW5jdGlvbiBnZXRSYW5rKGNvdW50cnkpe1xuXG5cdFx0XHR2YXIgcmFuayA9IHZtLmRhdGEuaW5kZXhPZihjb3VudHJ5KSArIDE7XG5cdFx0XHRyZXR1cm4gcmFuaztcblx0XHR9XG5cdFx0ZnVuY3Rpb24gdG9nZ2xlSW5mbygpIHtcblx0XHRcdHZtLmluZm8gPSAhdm0uaW5mbztcblx0XHR9O1xuXG5cdFx0ZnVuY3Rpb24gdG9nZ2xlRGV0YWlscygpIHtcblx0XHRcdHJldHVybiB2bS5kZXRhaWxzID0gIXZtLmRldGFpbHM7XG5cdFx0fTtcblx0XHRmdW5jdGlvbiBmZXRjaE5hdGlvbkRhdGEoaXNvKXtcblx0XHRcdERhdGFTZXJ2aWNlLmdldE9uZSgnaW5kZXgvJyskc3RhdGUucGFyYW1zLmluZGV4LCBpc28pLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcblx0XHRcdFx0dm0uY3VycmVudC5kYXRhID0gZGF0YTtcblx0XHRcdFx0bWFwR290b0NvdW50cnkoaXNvKTtcblx0XHRcdH0pO1xuXHRcdH1cblx0XHRmdW5jdGlvbiBtYXBHb3RvQ291bnRyeShpc28pIHtcblx0XHRcdGlmKCEkc3RhdGUucGFyYW1zLmNvdW50cmllcyl7XG5cdFx0XHRcdERhdGFTZXJ2aWNlLmdldE9uZSgnY291bnRyaWVzL2Jib3gnLCBbaXNvXSkudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuXHRcdFx0XHRcdHZtLmJib3ggPSBkYXRhO1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblxuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGNoZWNrQ29tcGFyaXNvbih3YW50KSB7XG5cdFx0XHRpZiAod2FudCAmJiAhdm0uY29tcGFyZS5hY3RpdmUgfHwgIXdhbnQgJiYgdm0uY29tcGFyZS5hY3RpdmUpIHtcblx0XHRcdFx0dm0udG9nZ2xlQ29tcGFyaXNvbigpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIHRvZ2dsZUNvbXBhcmlzb24oKSB7XG5cdFx0XHR2bS5jb21wYXJlLmNvdW50cmllcyA9IFt2bS5jdXJyZW50XTtcblx0XHRcdHZtLmNvbXBhcmUuYWN0aXZlID0gIXZtLmNvbXBhcmUuYWN0aXZlO1xuXHRcdFx0aWYgKHZtLmNvbXBhcmUuYWN0aXZlKSB7XG5cdFx0XHRcdHZtLnNldFRhYigyKTtcblx0XHRcdFx0JHJvb3RTY29wZS5ncmV5ZWQgPSB0cnVlO1xuXHRcdFx0XHR2bS5tdnRTb3VyY2Uub3B0aW9ucy5tdXRleFRvZ2dsZSA9IGZhbHNlO1xuXHRcdFx0XHR2bS5tdnRTb3VyY2Uuc2V0U3R5bGUoaW52ZXJ0ZWRTdHlsZSk7XG5cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCRyb290U2NvcGUuZ3JleWVkID0gZmFsc2U7XG5cdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5tdnRTb3VyY2UubGF5ZXJzW3ZtLm12dENvdW50cnlMYXllckdlb21dLmZlYXR1cmVzLCBmdW5jdGlvbiAoZmVhdHVyZSkge1xuXHRcdFx0XHRcdGZlYXR1cmUuc2VsZWN0ZWQgPSBmYWxzZTtcblx0XHRcdFx0fSk7XG5cdFx0XHRcdHZtLm12dFNvdXJjZS5sYXllcnNbdm0ubXZ0Q291bnRyeUxheWVyR2VvbV0uZmVhdHVyZXNbdm0uY3VycmVudC5pc29dLnNlbGVjdGVkID0gdHJ1ZTtcblx0XHRcdFx0dm0ubXZ0U291cmNlLm9wdGlvbnMubXV0ZXhUb2dnbGUgPSB0cnVlO1xuXHRcdFx0XHR2bS5tdnRTb3VyY2Uuc2V0U3R5bGUoY291bnRyaWVzU3R5bGUpO1xuXHRcdFx0XHREYXRhU2VydmljZS5nZXRPbmUoJ2NvdW50cmllcy9iYm94JywgW3ZtLmN1cnJlbnQuaXNvXSkudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuXHRcdFx0XHRcdHZtLmJib3ggPSBkYXRhO1xuXHRcdFx0XHR9KTtcblx0XHRcdFx0JHN0YXRlLmdvKCdhcHAuaW5kZXguc2hvdy5zZWxlY3RlZCcse1xuXHRcdFx0XHRcdGluZGV4OiRzdGF0ZS5wYXJhbXMuaW5kZXgsXG5cdFx0XHRcdFx0aXRlbTokc3RhdGUucGFyYW1zLml0ZW1cblx0XHRcdFx0fSlcblx0XHRcdH1cblx0XHRcdC8vdm0ubXZ0U291cmNlLnJlZHJhdygpO1xuXHRcdH07XG5cblx0XHRmdW5jdGlvbiB0b2dnbGVDb3VudHJpZUxpc3QoY291bnRyeSkge1xuXHRcdFx0dmFyIGZvdW5kID0gZmFsc2U7XG5cdFx0XHRhbmd1bGFyLmZvckVhY2godm0uY29tcGFyZS5jb3VudHJpZXMsIGZ1bmN0aW9uIChuYXQsIGtleSkge1xuXHRcdFx0XHRpZiAoY291bnRyeSA9PSBuYXQgJiYgbmF0ICE9IHZtLmN1cnJlbnQpIHtcblx0XHRcdFx0XHR2bS5jb21wYXJlLmNvdW50cmllcy5zcGxpY2Uoa2V5LCAxKTtcblx0XHRcdFx0XHRmb3VuZCA9IHRydWU7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdFx0aWYgKCFmb3VuZCkge1xuXHRcdFx0XHR2bS5jb21wYXJlLmNvdW50cmllcy5wdXNoKGNvdW50cnkpO1xuXHRcdFx0fTtcblx0XHRcdHZhciBpc29zID0gW107XG5cdFx0XHR2YXIgY29tcGFyZSA9IFtdO1xuXHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLmNvbXBhcmUuY291bnRyaWVzLCBmdW5jdGlvbiAoaXRlbSwga2V5KSB7XG5cdFx0XHRcdGlzb3MucHVzaChpdGVtLmlzbyk7XG5cdFx0XHRcdGlmKGl0ZW1bdm0uc3RydWN0dXJlLmlzb10gIT0gdm0uY3VycmVudC5pc28pe1xuXHRcdFx0XHRcdGNvbXBhcmUucHVzaChpdGVtLmlzbyk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdFx0aWYgKGlzb3MubGVuZ3RoID4gMSkge1xuXHRcdFx0XHREYXRhU2VydmljZS5nZXRPbmUoJ2NvdW50cmllcy9iYm94JywgaXNvcykudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuXHRcdFx0XHRcdHZtLmJib3ggPSBkYXRhO1xuXHRcdFx0XHR9KTtcblx0XHRcdFx0JHN0YXRlLmdvKCdhcHAuaW5kZXguc2hvdy5zZWxlY3RlZC5jb21wYXJlJyx7XG5cdFx0XHRcdFx0aW5kZXg6ICRzdGF0ZS5wYXJhbXMuaW5kZXgsXG5cdFx0XHRcdFx0aXRlbTogJHN0YXRlLnBhcmFtcy5pdGVtLFxuXHRcdFx0XHRcdGNvdW50cmllczpjb21wYXJlLmpvaW4oJy12cy0nKVxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuICFmb3VuZDtcblx0XHR9O1xuXG5cdFx0ZnVuY3Rpb24gZ2V0T2Zmc2V0KCkge1xuXHRcdFx0aWYgKCF2bS5jdXJyZW50KSB7XG5cdFx0XHRcdHJldHVybiAwO1xuXHRcdFx0fVxuXHRcdFx0Ly9jb25zb2xlLmxvZyh2bS5nZXRSYW5rKHZtLmN1cnJlbnQpKTtcblx0XHRcdHJldHVybiAodm0uZ2V0UmFuayh2bS5jdXJyZW50KSAtIDIpICogMTc7XG5cdFx0fTtcblxuXHRcdGZ1bmN0aW9uIGdldFRlbmRlbmN5KCkge1xuXHRcdFx0aWYgKCF2bS5jdXJyZW50KSB7XG5cdFx0XHRcdHJldHVybiAnYXJyb3dfZHJvcF9kb3duJ1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHZtLmN1cnJlbnQucGVyY2VudF9jaGFuZ2UgPiAwID8gJ2Fycm93X2Ryb3BfdXAnIDogJ2Fycm93X2Ryb3BfZG93bic7XG5cdFx0fTtcblxuXHRcdGZ1bmN0aW9uIHNldFRhYihpKSB7XG5cdFx0XHR2bS5hY3RpdmVUYWIgPSBpO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGdldFBhcmVudChkYXRhKSB7XG5cdFx0XHR2YXIgaXRlbXMgPSBbXTtcblx0XHRcdGFuZ3VsYXIuZm9yRWFjaChkYXRhLmNoaWxkcmVuLCBmdW5jdGlvbiAoaXRlbSkge1xuXHRcdFx0XHRpZiAoaXRlbS5jb2x1bW5fbmFtZSA9PSB2bS5kaXNwbGF5LnNlbGVjdGVkQ2F0LnR5cGUpIHtcblx0XHRcdFx0XHR2bS5ub2RlUGFyZW50ID0gZGF0YTtcblx0XHRcdFx0fVxuXHRcdFx0XHRnZXRQYXJlbnQoaXRlbSk7XG5cdFx0XHR9KTtcblx0XHRcdHJldHVybiBpdGVtcztcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBjYWxjVHJlZSgpIHtcblx0XHRcdGdldFBhcmVudCh2bS5zdHJ1Y3R1cmUpO1xuXHRcdH07XG5cblx0XHRmdW5jdGlvbiBnZXROYXRpb25CeU5hbWUobmFtZSkge1xuXHRcdFx0dmFyIG5hdGlvbiA9IHt9O1xuXHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLmRhdGEsIGZ1bmN0aW9uIChuYXQpIHtcblx0XHRcdFx0aWYgKG5hdC5jb3VudHJ5ID09IG5hbWUpIHtcblx0XHRcdFx0XHRuYXRpb24gPSBuYXQ7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdFx0cmV0dXJuIG5hdGlvbjtcblx0XHR9O1xuXG5cdFx0ZnVuY3Rpb24gZ2V0TmF0aW9uQnlJc28oaXNvKSB7XG5cdFx0XHR2YXIgbmF0aW9uID0ge307XG5cdFx0XHRhbmd1bGFyLmZvckVhY2godm0uZGF0YSwgZnVuY3Rpb24gKG5hdCkge1xuXHRcdFx0XHRpZiAobmF0LmlzbyA9PSBpc28pIHtcblx0XHRcdFx0XHRuYXRpb24gPSBuYXQ7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXG5cdFx0XHRyZXR1cm4gbmF0aW9uO1xuXHRcdH07XG5cblx0XHRmdW5jdGlvbiBjcmVhdGVDYW52YXMoY29sb3IpIHtcblxuXHRcdFx0dm0uY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG5cdFx0XHR2bS5jYW52YXMud2lkdGggPSAyODA7XG5cdFx0XHR2bS5jYW52YXMuaGVpZ2h0ID0gMTA7XG5cdFx0XHR2bS5jdHggPSB2bS5jYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcblx0XHRcdHZhciBncmFkaWVudCA9IHZtLmN0eC5jcmVhdGVMaW5lYXJHcmFkaWVudCgwLCAwLCAyODAsIDEwKTtcblx0XHRcdGdyYWRpZW50LmFkZENvbG9yU3RvcCgxLCAncmdiYSgyNTUsMjU1LDI1NSwwKScpO1xuXHRcdFx0Z3JhZGllbnQuYWRkQ29sb3JTdG9wKDAuNTMsIGNvbG9yIHx8ICAncmdiYSgxMjgsIDI0MywgMTk4LDEpJyk7XG5cdFx0XHRncmFkaWVudC5hZGRDb2xvclN0b3AoMCwgJ3JnYmEoMTAyLDEwMiwxMDIsMSknKTtcblx0XHRcdHZtLmN0eC5maWxsU3R5bGUgPSBncmFkaWVudDtcblx0XHRcdHZtLmN0eC5maWxsUmVjdCgwLCAwLCAyODAsIDEwKTtcblx0XHRcdHZtLnBhbGV0dGUgPSB2bS5jdHguZ2V0SW1hZ2VEYXRhKDAsIDAsIDI1NywgMSkuZGF0YTtcblx0XHRcdC8vZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2JvZHknKVswXS5hcHBlbmRDaGlsZCh2bS5jYW52YXMpO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIHVwZGF0ZUNhbnZhcyhjb2xvcikge1xuXHRcdFx0dmFyIGdyYWRpZW50ID0gdm0uY3R4LmNyZWF0ZUxpbmVhckdyYWRpZW50KDAsIDAsIDI4MCwgMTApO1xuXHRcdFx0Z3JhZGllbnQuYWRkQ29sb3JTdG9wKDEsICdyZ2JhKDI1NSwyNTUsMjU1LDApJyk7XG5cdFx0XHRncmFkaWVudC5hZGRDb2xvclN0b3AoMC41MywgY29sb3IgfHwgJ3JnYmEoMTI4LCAyNDMsIDE5OCwxKScgKTtcblx0XHRcdGdyYWRpZW50LmFkZENvbG9yU3RvcCgwLCAncmdiYSgxMDIsMTAyLDEwMiwxKScpO1xuXHRcdFx0dm0uY3R4LmZpbGxTdHlsZSA9IGdyYWRpZW50O1xuXHRcdFx0dm0uY3R4LmZpbGxSZWN0KDAsIDAsIDI4MCwgMTApO1xuXHRcdFx0dm0ucGFsZXR0ZSA9IHZtLmN0eC5nZXRJbWFnZURhdGEoMCwgMCwgMjU3LCAxKS5kYXRhO1xuXHRcdFx0Ly9kb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnYm9keScpWzBdLmFwcGVuZENoaWxkKHZtLmNhbnZhcyk7XG5cdFx0fTtcblxuXHRcdGZ1bmN0aW9uIGludmVydGVkU3R5bGUoZmVhdHVyZSkge1xuXHRcdFx0dmFyIHN0eWxlID0ge307XG5cdFx0XHR2YXIgaXNvID0gZmVhdHVyZS5wcm9wZXJ0aWVzW3ZtLmlzb19maWVsZF07XG5cdFx0XHR2YXIgbmF0aW9uID0gZ2V0TmF0aW9uQnlJc28oaXNvKTtcblx0XHRcdHZhciBmaWVsZCA9IHZtLnN0cnVjdHVyZS5uYW1lIHx8ICdzY29yZSc7XG5cblx0XHRcdC8vVE9ETzogTUFYIFZBTFVFIElOU1RFQUQgT0YgMTAwXG5cdFx0XHR2YXIgY29sb3JQb3MgPSBwYXJzZUludCgyNTYgLyAxMDAgKiBuYXRpb25bZmllbGRdKSAqIDQ7XG5cblx0XHRcdHZhciBjb2xvciA9ICdyZ2JhKCcgKyB2bS5wYWxldHRlW2NvbG9yUG9zXSArICcsICcgKyB2bS5wYWxldHRlW2NvbG9yUG9zICsgMV0gKyAnLCAnICsgdm0ucGFsZXR0ZVtjb2xvclBvcyArIDJdICsgJywnICsgdm0ucGFsZXR0ZVtjb2xvclBvcyArIDNdICsgJyknO1xuXHRcdFx0c3R5bGUuY29sb3IgPSAncmdiYSgwLDAsMCwwKSc7XG5cdFx0XHRzdHlsZS5vdXRsaW5lID0ge1xuXHRcdFx0XHRjb2xvcjogJ3JnYmEoMCwwLDAsMCknLFxuXHRcdFx0XHRzaXplOiAwXG5cdFx0XHR9O1xuXHRcdFx0c3R5bGUuc2VsZWN0ZWQgPSB7XG5cdFx0XHRcdGNvbG9yOiBjb2xvcixcblx0XHRcdFx0b3V0bGluZToge1xuXHRcdFx0XHRcdGNvbG9yOiAncmdiYSgwLDAsMCwwLjMpJyxcblx0XHRcdFx0XHRzaXplOiAyXG5cdFx0XHRcdH1cblx0XHRcdH07XG5cdFx0XHRyZXR1cm4gc3R5bGU7XG5cdFx0fTtcblxuXHRcdGZ1bmN0aW9uIGNvdW50cmllc1N0eWxlKGZlYXR1cmUpIHtcblxuXHRcdFx0dmFyIHN0eWxlID0ge307XG5cdFx0XHR2YXIgaXNvID0gZmVhdHVyZS5wcm9wZXJ0aWVzW3ZtLmlzb19maWVsZF07XG5cblx0XHRcdHZhciBuYXRpb24gPSBnZXROYXRpb25CeUlzbyhpc28pO1xuXHRcdFx0dmFyIGZpZWxkID0gdm0uc3RydWN0dXJlLm5hbWUgfHwgJ3Njb3JlJztcblx0XHRcdHZhciB0eXBlID0gZmVhdHVyZS50eXBlO1xuXHRcdFx0aWYoaXNvICE9IHZtLmN1cnJlbnQuaXNvKXtcblx0XHRcdFx0XHRmZWF0dXJlLnNlbGVjdGVkID0gZmFsc2U7XG5cdFx0XHR9XG5cblx0XHRcdHN3aXRjaCAodHlwZSkge1xuXHRcdFx0Y2FzZSAzOiAvLydQb2x5Z29uJ1xuXHRcdFx0XHRpZiAodHlwZW9mIG5hdGlvbltmaWVsZF0gIT0gXCJ1bmRlZmluZWRcIikge1xuXG5cdFx0XHRcdFx0Ly9UT0RPOiBNQVggVkFMVUUgSU5TVEVBRCBPRiAxMDBcblx0XHRcdFx0XHR2YXIgY29sb3JQb3MgPSBwYXJzZUludCgyNTYgLyAxMDAgKiBwYXJzZUludChuYXRpb25bZmllbGRdKSkgKiA0O1xuXG5cdFx0XHRcdFx0dmFyIGNvbG9yID0gJ3JnYmEoJyArIHZtLnBhbGV0dGVbY29sb3JQb3NdICsgJywgJyArIHZtLnBhbGV0dGVbY29sb3JQb3MgKyAxXSArICcsICcgKyB2bS5wYWxldHRlW2NvbG9yUG9zICsgMl0gKyAnLCcgKyB2bS5wYWxldHRlW2NvbG9yUG9zICsgM10gKyAnKSc7XG5cdFx0XHRcdFx0c3R5bGUuY29sb3IgPSAncmdiYSgnICsgdm0ucGFsZXR0ZVtjb2xvclBvc10gKyAnLCAnICsgdm0ucGFsZXR0ZVtjb2xvclBvcyArIDFdICsgJywgJyArIHZtLnBhbGV0dGVbY29sb3JQb3MgKyAyXSArICcsMC42KSc7IC8vY29sb3I7XG5cdFx0XHRcdFx0c3R5bGUub3V0bGluZSA9IHtcblx0XHRcdFx0XHRcdGNvbG9yOiBjb2xvcixcblx0XHRcdFx0XHRcdHNpemU6IDFcblx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdHN0eWxlLnNlbGVjdGVkID0ge1xuXHRcdFx0XHRcdFx0Y29sb3I6ICdyZ2JhKCcgKyB2bS5wYWxldHRlW2NvbG9yUG9zXSArICcsICcgKyB2bS5wYWxldHRlW2NvbG9yUG9zICsgMV0gKyAnLCAnICsgdm0ucGFsZXR0ZVtjb2xvclBvcyArIDJdICsgJywwLjMpJyxcblx0XHRcdFx0XHRcdG91dGxpbmU6IHtcblx0XHRcdFx0XHRcdFx0Y29sb3I6ICdyZ2JhKDY2LDY2LDY2LDAuOSknLFxuXHRcdFx0XHRcdFx0XHRzaXplOiAyXG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fSBlbHNlIHtcblxuXHRcdFx0XHRcdHN0eWxlLmNvbG9yID0gJ3JnYmEoMjU1LDI1NSwyNTUsMCknO1xuXHRcdFx0XHRcdHN0eWxlLm91dGxpbmUgPSB7XG5cdFx0XHRcdFx0XHRjb2xvcjogJ3JnYmEoMjU1LDI1NSwyNTUsMCknLFxuXHRcdFx0XHRcdFx0c2l6ZTogMVxuXHRcdFx0XHRcdH07XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdC8vY29uc29sZS5sb2coZmVhdHVyZS5wcm9wZXJ0aWVzLm5hbWUpXG5cdFx0XHRpZiAoZmVhdHVyZS5sYXllci5uYW1lID09PSBWZWN0b3JsYXllclNlcnZpY2UuZ2V0TmFtZSgpKydfZ2VvbScpIHtcblx0XHRcdFx0c3R5bGUuc3RhdGljTGFiZWwgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0dmFyIHN0eWxlID0ge1xuXHRcdFx0XHRcdFx0aHRtbDogZmVhdHVyZS5wcm9wZXJ0aWVzLm5hbWUsXG5cdFx0XHRcdFx0XHRpY29uU2l6ZTogWzEyNSwgMzBdLFxuXHRcdFx0XHRcdFx0Y3NzQ2xhc3M6ICdsYWJlbC1pY29uLXRleHQnXG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRyZXR1cm4gc3R5bGU7XG5cdFx0XHRcdH07XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gc3R5bGU7XG5cdFx0fTtcblxuXHRcdCRzY29wZS4kd2F0Y2goJ3ZtLmN1cnJlbnQnLCBmdW5jdGlvbiAobiwgbykge1xuXHRcdFx0aWYgKG4gPT09IG8pIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRpZihuLmlzbykge1xuXHRcdFx0XHRpZihvLmlzbyl7XG5cdFx0XHRcdFx0dm0ubXZ0U291cmNlLmxheWVyc1t2bS5tdnRDb3VudHJ5TGF5ZXJHZW9tXS5mZWF0dXJlc1tvLmlzb10uc2VsZWN0ZWQgPSBmYWxzZTtcblx0XHRcdFx0fVxuXHRcdFx0XHRjYWxjUmFuaygpO1xuXHRcdFx0XHRmZXRjaE5hdGlvbkRhdGEobi5pc28pO1xuXHRcdFx0XHR2bS5tdnRTb3VyY2UubGF5ZXJzW3ZtLm12dENvdW50cnlMYXllckdlb21dLmZlYXR1cmVzW24uaXNvXS5zZWxlY3RlZCA9IHRydWU7XG5cdFx0XHRcdGlmKCRzdGF0ZS5jdXJyZW50Lm5hbWUgPT0gJ2FwcC5pbmRleC5zaG93LnNlbGVjdGVkJyB8fCAkc3RhdGUuY3VycmVudC5uYW1lID09ICdhcHAuaW5kZXguc2hvdycpe1xuXHRcdFx0XHRcdCRzdGF0ZS5nbygnYXBwLmluZGV4LnNob3cuc2VsZWN0ZWQnLCB7XG5cdFx0XHRcdFx0XHRpbmRleDogJHN0YXRlLnBhcmFtcy5pbmRleCxcblx0XHRcdFx0XHRcdGl0ZW06IG4uaXNvXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCRzdGF0ZS5nbygnYXBwLmluZGV4LnNob3cnLHtcblx0XHRcdFx0XHRpbmRleDogJHN0YXRlLnBhcmFtcy5pbmRleFxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9KTtcblx0XHQkc2NvcGUuJHdhdGNoKCd2bS5kaXNwbGF5LnNlbGVjdGVkQ2F0JywgZnVuY3Rpb24gKG4sIG8pIHtcblx0XHRcdGlmIChuID09PSBvKSB7XG5cdFx0XHRcdHJldHVyblxuXHRcdFx0fVxuXHRcdFx0Y29uc29sZS5sb2cobik7XG5cdFx0XHRpZiAobi5jb2xvcilcblx0XHRcdFx0dXBkYXRlQ2FudmFzKG4uY29sb3IpO1xuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdHVwZGF0ZUNhbnZhcygncmdiYSgxMjgsIDI0MywgMTk4LDEpJyk7XG5cdFx0XHR9O1xuXHRcdFx0dm0uY2FsY1RyZWUoKTtcblx0XHRcdC8qaWYgKHZtLmNvbXBhcmUuYWN0aXZlKSB7XG5cdFx0XHRcdCR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHQvL3ZtLm12dFNvdXJjZS5zZXRTdHlsZShpbnZlcnRlZFN0eWxlKTtcblx0XHRcdFx0XHQvL3ZtLm12dFNvdXJjZS5yZWRyYXcoKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkdGltZW91dChmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0Ly92bS5tdnRTb3VyY2Uuc2V0U3R5bGUoY291bnRyaWVzU3R5bGUpO1xuXHRcdFx0XHRcdC8vdm0ubXZ0U291cmNlLnJlZHJhdygpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH0qL1xuXG5cdFx0XHRpZiAodm0uY3VycmVudC5pc28pIHtcblx0XHRcdFx0aWYoJHN0YXRlLnBhcmFtcy5jb3VudHJpZXMpe1xuXHRcdFx0XHRcdCRzdGF0ZS5nbygnYXBwLmluZGV4LnNob3cuc2VsZWN0ZWQuY29tcGFyZScsIHtcblx0XHRcdFx0XHRcdGluZGV4OiBuLm5hbWUsXG5cdFx0XHRcdFx0XHRpdGVtOiB2bS5jdXJyZW50Lmlzbyxcblx0XHRcdFx0XHRcdGNvdW50cmllczogJHN0YXRlLnBhcmFtcy5jb3VudHJpZXNcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2V7XG5cdFx0XHRcdFx0JHN0YXRlLmdvKCdhcHAuaW5kZXguc2hvdy5zZWxlY3RlZCcsIHtcblx0XHRcdFx0XHRcdGluZGV4OiBuLm5hbWUsXG5cdFx0XHRcdFx0XHRpdGVtOiB2bS5jdXJyZW50Lmlzb1xuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCRzdGF0ZS5nbygnYXBwLmluZGV4LnNob3cnLCB7XG5cdFx0XHRcdFx0aW5kZXg6IG4ubmFtZVxuXHRcdFx0XHR9KVxuXHRcdFx0fVxuXG5cdFx0fSk7XG5cdFx0JHNjb3BlLiR3YXRjaCgndm0uYmJveCcsIGZ1bmN0aW9uIChuLCBvKSB7XG5cdFx0XHRpZiAobiA9PT0gbykge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0XHQvKnZhciBsYXQgPSBbbi5jb29yZGluYXRlc1swXVswXVsxXSxcblx0XHRcdFx0XHRbbi5jb29yZGluYXRlc1swXVswXVswXV1cblx0XHRcdFx0XSxcblx0XHRcdFx0bG5nID0gW24uY29vcmRpbmF0ZXNbMF1bMl1bMV0sXG5cdFx0XHRcdFx0W24uY29vcmRpbmF0ZXNbMF1bMl1bMF1dXG5cdFx0XHRcdF0qL1xuXHRcdFx0dmFyIHNvdXRoV2VzdCA9IEwubGF0TG5nKG4uY29vcmRpbmF0ZXNbMF1bMF1bMV0sIG4uY29vcmRpbmF0ZXNbMF1bMF1bMF0pLFxuXHRcdFx0XHRub3J0aEVhc3QgPSBMLmxhdExuZyhuLmNvb3JkaW5hdGVzWzBdWzJdWzFdLCBuLmNvb3JkaW5hdGVzWzBdWzJdWzBdKSxcblx0XHRcdFx0Ym91bmRzID0gTC5sYXRMbmdCb3VuZHMoc291dGhXZXN0LCBub3J0aEVhc3QpO1xuXG5cdFx0XHR2YXIgcGFkID0gW1xuXHRcdFx0XHRbMCwgMF0sXG5cdFx0XHRcdFsxMDAsMTAwXVxuXHRcdFx0XTtcblx0XHRcdGlmICh2bS5jb21wYXJlLmFjdGl2ZSkge1xuXHRcdFx0XHRwYWQgPSBbXG5cdFx0XHRcdFx0WzAsIDBdLFxuXHRcdFx0XHRcdFswLCAwXVxuXHRcdFx0XHRdO1xuXHRcdFx0fVxuXHRcdFx0dm0ubWFwLmZpdEJvdW5kcyhib3VuZHMsIHtcblx0XHRcdFx0cGFkZGluZzpwYWRbMV0sXG5cdFx0XHRcdG1heFpvb206IDZcblx0XHRcdH0pO1xuXHRcdH0pO1xuXG5cdFx0JHNjb3BlLiRvbihcIiRzdGF0ZUNoYW5nZVN1Y2Nlc3NcIiwgZnVuY3Rpb24gKGV2ZW50LCB0b1N0YXRlLCB0b1BhcmFtcywgZnJvbVN0YXRlLCBmcm9tUGFyYW1zKSB7XG5cblx0XHRcdC8qY29uc29sZS5sb2coJClcblx0XHRcdGlmICh0b1N0YXRlLm5hbWUgPT0gXCJhcHAuaW5kZXguc2hvd1wiKSB7XG5cdFx0XHRcdFx0dm0uY3VycmVudCA9IFwiXCI7XG5cdFx0XHR9IGVsc2UgaWYgKHRvU3RhdGUubmFtZSA9PSBcImFwcC5pbmRleC5zaG93LnNlbGVjdGVkXCIpIHtcblxuXHRcdFx0XHRpZih0b1BhcmFtcy5pbmRleCAhPSBmcm9tUGFyYW1zLmluZGV4KXtcblx0XHRcdFx0XHRjb25zb2xlLmxvZygnYW5kZXJzJylcblx0XHRcdFx0fVxuXHRcdFx0XHRjb25zb2xlLmxvZyh0b1BhcmFtcy5pdGVtKTtcblx0XHRcdFx0dm0uc2V0U3RhdGUodG9QYXJhbXMuaXRlbSk7XG5cdFx0XHRcdGNhbGNSYW5rKCk7XG5cdFx0XHRcdC8vdm0ubXZ0U291cmNlLm9wdGlvbnMubXV0ZXhUb2dnbGUgPSB0cnVlO1xuXHRcdFx0XHREYXRhU2VydmljZS5nZXRPbmUoJ25hdGlvbnMnLCB2bS5jdXJyZW50LmlzbykudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuXHRcdFx0XHRcdHZtLmN1cnJlbnQuZGF0YSA9IGRhdGE7XG5cdFx0XHRcdFx0RGF0YVNlcnZpY2UuZ2V0T25lKCduYXRpb25zL2Jib3gnLCBbdm0uY3VycmVudC5pc29dKS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG5cdFx0XHRcdFx0XHR2bS5iYm94ID0gZGF0YTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9IGVsc2UgaWYgKHRvU3RhdGUubmFtZSA9PSBcImFwcC5pbmRleC5zaG93LnNlbGVjdGVkLmNvbXBhcmVcIikge1xuXHRcdFx0XHR2bS5zZXRTdGF0ZSh0b1BhcmFtcy5pdGVtKTtcblx0XHRcdFx0Ly8kc2NvcGUuYWN0aXZlVGFiID0gMjtcblx0XHRcdFx0LypEYXRhU2VydmljZS5nZXRPbmUoJ25hdGlvbnMnLCB0b1BhcmFtcy5pdGVtKS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG5cdFx0XHRcdFx0dm0uY291bnRyeSA9IGRhdGE7XG5cdFx0XHRcdFx0RGF0YVNlcnZpY2UuZ2V0T25lKCduYXRpb25zL2Jib3gnLCBbdm0uY291bnRyeS5pc29dKS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG5cdFx0XHRcdFx0XHR2bS5iYm94ID0gZGF0YTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR2bS5jdXJyZW50ID0gXCJcIjtcblx0XHRcdH0qL1xuXHRcdH0pO1xuXG5cdFx0ZnVuY3Rpb24gZHJhd0NvdW50cmllcygpIHtcblx0XHRcdGxlYWZsZXREYXRhLmdldE1hcCgnbWFwJykudGhlbihmdW5jdGlvbiAobWFwKSB7XG5cdFx0XHRcdHZtLm1hcCA9IG1hcDtcblx0XHRcdFx0dm0ubXZ0U291cmNlID0gVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldExheWVyKCk7XG5cdFx0XHRcdCR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRpZigkc3RhdGUucGFyYW1zLmNvdW50cmllcyl7XG5cdFx0XHRcdFx0XHR2bS5tdnRTb3VyY2Uub3B0aW9ucy5tdXRleFRvZ2dsZSA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0dm0ubXZ0U291cmNlLnNldFN0eWxlKGludmVydGVkU3R5bGUpO1xuXHRcdFx0XHRcdFx0dm0ubXZ0U291cmNlLmxheWVyc1t2bS5tdnRDb3VudHJ5TGF5ZXJHZW9tXS5mZWF0dXJlc1t2bS5jdXJyZW50Lmlzb10uc2VsZWN0ZWQgPSB0cnVlO1xuXHRcdFx0XHRcdFx0dmFyIGNvdW50cmllcyA9ICRzdGF0ZS5wYXJhbXMuY291bnRyaWVzLnNwbGl0KCctdnMtJyk7XG5cdFx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2goY291bnRyaWVzLCBmdW5jdGlvbihpc28pe1xuXHRcdFx0XHRcdFx0XHR2bS5tdnRTb3VyY2UubGF5ZXJzW3ZtLm12dENvdW50cnlMYXllckdlb21dLmZlYXR1cmVzW2lzb10uc2VsZWN0ZWQgPSB0cnVlO1xuXHRcdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZWxzZXtcblx0XHRcdFx0XHRcdHZtLm12dFNvdXJjZS5zZXRTdHlsZShjb3VudHJpZXNTdHlsZSk7XG5cdFx0XHRcdFx0XHRpZigkc3RhdGUucGFyYW1zLml0ZW0pe1xuXHRcdFx0XHRcdFx0XHRcdHZtLm12dFNvdXJjZS5sYXllcnNbdm0ubXZ0Q291bnRyeUxheWVyR2VvbV0uZmVhdHVyZXNbJHN0YXRlLnBhcmFtcy5pdGVtXS5zZWxlY3RlZCA9IHRydWU7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdC8vdm0ubXZ0U291cmNlLnJlZHJhdygpO1xuXHRcdFx0XHR9KTtcblx0XHRcdFx0dm0ubXZ0U291cmNlLm9wdGlvbnMub25DbGljayA9IGZ1bmN0aW9uIChldnQsIHQpIHtcblx0XHRcdFx0XHRpZiAoIXZtLmNvbXBhcmUuYWN0aXZlKSB7XG5cdFx0XHRcdFx0XHR2YXIgYyA9IGdldE5hdGlvbkJ5SXNvKGV2dC5mZWF0dXJlLnByb3BlcnRpZXNbdm0uaXNvX2ZpZWxkXSk7XG5cdFx0XHRcdFx0XHRpZiAodHlwZW9mIGNbdm0uc3RydWN0dXJlLm5hbWVdICE9IFwidW5kZWZpbmVkXCIpIHtcblx0XHRcdFx0XHRcdFx0dm0uY3VycmVudCA9IGdldE5hdGlvbkJ5SXNvKGV2dC5mZWF0dXJlLnByb3BlcnRpZXNbdm0uaXNvX2ZpZWxkXSk7XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRUb2FzdFNlcnZpY2UuZXJyb3IoJ05vIGluZm8gYWJvdXQgdGhpcyBsb2NhdGlvbiEnKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0Y29uc29sZS5sb2coZXZ0KTtcblx0XHRcdFx0XHRcdHZhciBjID0gZ2V0TmF0aW9uQnlJc28oZXZ0LmZlYXR1cmUucHJvcGVydGllc1t2bS5pc29fZmllbGRdKTtcblx0XHRcdFx0XHRcdGlmICh0eXBlb2YgY1t2bS5zdHJ1Y3R1cmUubmFtZV0gIT0gXCJ1bmRlZmluZWRcIikge1xuXHRcdFx0XHRcdFx0XHR2bS50b2dnbGVDb3VudHJpZUxpc3QoYyk7XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRUb2FzdFNlcnZpY2UuZXJyb3IoJ05vIGluZm8gYWJvdXQgdGhpcyBsb2NhdGlvbiEnKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH1cblx0fSk7XG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0luZGV4YmFzZUN0cmwnLCBmdW5jdGlvbiAoJHNjb3BlLCRzdGF0ZSkge1xuXHRcdC8vXG4gICAgJHNjb3BlLiRzdGF0ZSA9ICRzdGF0ZTtcblx0fSk7XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignSW5kZXhGaW5hbEN0cmwnLCBmdW5jdGlvbigkc3RhdGUsIEluZGV4U2VydmljZSwgRGF0YVNlcnZpY2UsIHRvYXN0cil7XG4gICAgICAgIC8vXG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG4gICAgICAgIHZtLmRhdGEgPSBJbmRleFNlcnZpY2UuZ2V0RGF0YSgpO1xuICAgICAgICB2bS5tZXRhID0gSW5kZXhTZXJ2aWNlLmdldE1ldGEoKTtcbiAgICAgICAgdm0uZXJyb3JzID0gSW5kZXhTZXJ2aWNlLmdldEVycm9ycygpO1xuICAgICAgICB2bS5pbmRpY2F0b3JzID0gSW5kZXhTZXJ2aWNlLmdldEluZGljYXRvcnMoKTtcbiAgICAgICAgdm0uc2F2ZURhdGEgPSBzYXZlRGF0YTtcblxuICAgICAgICBhY3RpdmF0ZSgpO1xuXG4gICAgICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCl7XG4gICAgICAgICAgY2hlY2tEYXRhKCk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBjaGVja0RhdGEoKXtcbiAgICAgICAgICBpZighdm0uZGF0YSl7XG4gICAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC5pbmRleC5jcmVhdGUnKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBzYXZlRGF0YSgpe1xuICAgICAgICAgIHZhciBpbnNlcnREYXRhID0ge2RhdGE6W119O1xuICAgICAgICAgIHZhciBpbnNlcnRNZXRhID0gW10sIGZpZWxkcyA9IFtdO1xuICAgICAgICAgIHZtLmxvYWRpbmcgPSB0cnVlO1xuICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaCh2bS5kYXRhLCBmdW5jdGlvbihpdGVtLCBrZXkpe1xuICAgICAgICAgICAgaWYoaXRlbS5lcnJvcnMubGVuZ3RoID09IDApe1xuICAgICAgICAgICAgICBpdGVtLmRhdGFbMF0ueWVhciA9IHZtLm1ldGEueWVhcjtcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coaXRlbS5kYXRhWzBdKTtcbiAgICAgICAgICAgICAgdm0ubWV0YS5pc29fdHlwZSA9IGl0ZW0uZGF0YVswXVt2bS5tZXRhLmlzb19maWVsZF0ubGVuZ3RoID09IDMgPyAnaXNvLTMxNjYtMScgOiAnaXNvLTMxNjYtMic7XG4gICAgICAgICAgICAgIGluc2VydERhdGEuZGF0YS5wdXNoKGl0ZW0uZGF0YVswXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICB0b2FzdHIuZXJyb3IoJ1RoZXJlIGFyZSBzb21lIGVycm9ycyBsZWZ0IScsICdIdWNoIScpO1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgYW5ndWxhci5mb3JFYWNoKHZtLmluZGljYXRvcnMsIGZ1bmN0aW9uKGl0ZW0sIGtleSl7XG4gICAgICAgICAgICAgIGlmKGtleSAhPSB2bS5tZXRhLmlzb19maWVsZCAmJiBrZXkgIT0gdm0ubWV0YS5jb3VudHJ5X2ZpZWxkKXtcbiAgICAgICAgICAgICAgdmFyIGZpZWxkID0ge1xuICAgICAgICAgICAgICAgICdjb2x1bW4nOiBrZXksXG4gICAgICAgICAgICAgICAgJ3RpdGxlJzp2bS5pbmRpY2F0b3JzW2tleV0udGl0bGUsXG4gICAgICAgICAgICAgICAgJ2Rlc2NyaXB0aW9uJzp2bS5pbmRpY2F0b3JzW2tleV0uZGVzY3JpcHRpb24sXG4gICAgICAgICAgICAgICAgJ21lYXN1cmVfdHlwZV9pZCc6dm0uaW5kaWNhdG9yc1trZXldLm1lYXN1cmVfdHlwZV9pZCB8fCAwLFxuICAgICAgICAgICAgICAgICdpc19wdWJsaWMnOiB2bS5pbmRpY2F0b3JzW2tleV0uaXNfcHVibGljIHx8IDAsXG4gICAgICAgICAgICAgICAgJ2RhdGFwcm92aWRlcl9pZCc6IHZtLmluZGljYXRvcnNba2V5XS5kYXRhcHJvdmlkZXIuaWQgfHwgMFxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICB2YXIgY2F0ZWdvcmllcyA9IFtdO1xuICAgICAgICAgICAgICBhbmd1bGFyLmZvckVhY2godm0uaW5kaWNhdG9yc1trZXldLmNhdGVnb3JpZXMsIGZ1bmN0aW9uKGNhdCl7XG4gICAgICAgICAgICAgICAgY2F0ZWdvcmllcy5wdXNoKGNhdC5pZCk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICBmaWVsZC5jYXRlZ29yaWVzID0gY2F0ZWdvcmllcztcbiAgICAgICAgICAgICAgZmllbGRzLnB1c2goZmllbGQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHZtLm1ldGEuZmllbGRzID0gZmllbGRzO1xuICAgICAgICAgIGNvbnNvbGUubG9nKHZtLm1ldGEpO1xuICAgICAgICAgIERhdGFTZXJ2aWNlLnBvc3QoJ2RhdGEvdGFibGVzJywgdm0ubWV0YSkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICAgICAgICAgIERhdGFTZXJ2aWNlLnBvc3QoJ2RhdGEvdGFibGVzLycrcmVzcG9uc2UudGFibGVfbmFtZSsnL2luc2VydCcsIGluc2VydERhdGEpLnRoZW4oZnVuY3Rpb24ocmVzKXtcbiAgICAgICAgICAgICAgICBpZihyZXMgPT0gdHJ1ZSl7XG4gICAgICAgICAgICAgICAgICB0b2FzdHIuc3VjY2VzcyhpbnNlcnREYXRhLmRhdGEubGVuZ3RoKycgaXRlbXMgaW1wb3J0ZXQgdG8gJyt2bS5tZXRhLm5hbWUsJ1N1Y2Nlc3MnKTtcbiAgICAgICAgICAgICAgICAgIEluZGV4U2VydmljZS5jbGVhcigpO1xuICAgICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdhcHAuaW5kZXgubXlkYXRhJyk7XG4gICAgICAgICAgICAgICAgICB2bS5kYXRhID0gW107XG4gICAgICAgICAgICAgICAgICB2bS5zdGVwID0gMDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICB2bS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0sIGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgICAgICAgIGlmKHJlc3BvbnNlLm1lc3NhZ2Upe1xuICAgICAgICAgICAgICB0b2FzdHIuZXJyb3IocmVzcG9uc2UubWVzc2FnZSwgJ091Y2ghJyk7XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgdm0ubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0luZGV4RmluYWxNZW51Q3RybCcsIGZ1bmN0aW9uKEluZGV4U2VydmljZSl7XG4gICAgICB2YXIgdm0gPSB0aGlzO1xuICAgICAgdm0uZGF0YSA9IEluZGV4U2VydmljZS5nZXREYXRhKCk7XG4gICAgICB2bS5tZXRhID0gSW5kZXhTZXJ2aWNlLmdldE1ldGEoKTtcbiAgICAgIHZtLmluZGljYXRvcnMgPSBJbmRleFNlcnZpY2UuZ2V0SW5kaWNhdG9ycygpO1xuICAgICAgdm0uaW5kaWNhdG9yc0xlbmd0aCA9IE9iamVjdC5rZXlzKHZtLmluZGljYXRvcnMpLmxlbmd0aDtcbiAgICB9KTtcbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdJbmRleE1ldGFDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCAkc3RhdGUsIFZlY3RvcmxheWVyU2VydmljZSwkdGltZW91dCxJbmRleFNlcnZpY2UsbGVhZmxldERhdGEsIHRvYXN0cil7XG4gICAgICAgIC8vXG5cbiAgICAgICAgdmFyIHZtID0gdGhpcztcbiAgICAgICAgdm0ubWluID0gMTAwMDAwMDA7XG4gICAgICAgIHZtLm1heCA9IDA7XG4gICAgICAgIHZtLmluZGljYXRvcnMgPSBbXTtcbiAgICAgICAgdm0uc2NhbGUgPSBcIlwiO1xuICAgICAgICB2bS5kYXRhID0gSW5kZXhTZXJ2aWNlLmdldERhdGEoKTtcbiAgICAgICAgdm0ubWV0YSA9IEluZGV4U2VydmljZS5nZXRNZXRhKCk7XG4gICAgICAgIHZtLmVycm9ycyA9IEluZGV4U2VydmljZS5nZXRFcnJvcnMoKTtcbiAgICAgICAgdm0uaW5kaWNhdG9yID0gSW5kZXhTZXJ2aWNlLmFjdGl2ZUluZGljYXRvcigpO1xuICAgICAgICB2bS5jb3VudHJpZXNTdHlsZSA9IGNvdW50cmllc1N0eWxlO1xuICAgICAgICBWZWN0b3JsYXllclNlcnZpY2UuY3JlYXRlQ2FudmFzKCcjZmYwMDAwJyk7XG5cblxuICAgICAgICBhY3RpdmF0ZSgpO1xuXG4gICAgICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCl7XG4gICAgICAgICAgY2hlY2tEYXRhKCk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBjaGVja0RhdGEoKXtcbiAgICAgICAgICBpZighdm0uZGF0YSl7XG4gICAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC5pbmRleC5jcmVhdGUnKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAkc2NvcGUuJHdhdGNoKGZ1bmN0aW9uKCl7IHJldHVybiBJbmRleFNlcnZpY2UuYWN0aXZlSW5kaWNhdG9yKCl9LCBmdW5jdGlvbihuLG8pe1xuICAgICAgICAgIGlmKG4gPT09IG8pcmV0dXJuO1xuICAgICAgICAgIHZtLmluZGljYXRvciA9IG47XG4gICAgICAgICAgdm0ubWluID0gMTAwMDAwMDA7XG4gICAgICAgICAgdm0ubWF4ID0gMDtcbiAgICAgICAgICBpZih2bS5pbmRpY2F0b3Iuc3R5bGUpe1xuICAgICAgICAgICAgVmVjdG9ybGF5ZXJTZXJ2aWNlLnVwZGF0ZUNhbnZhcyh2bS5pbmRpY2F0b3Iuc3R5bGUuYmFzZV9jb2xvcik7XG4gICAgICAgICAgfVxuICAgICAgICAgIGRyYXdDb3VudHJpZXMoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJHNjb3BlLiR3YXRjaCgndm0uaW5kaWNhdG9yJywgZnVuY3Rpb24obixvKXtcbiAgICAgICAgICBpZihuID09PSBvKSByZXR1cm47XG4gICAgICAgICAgaWYodHlwZW9mIG4uc3R5bGVfaWQgIT0gXCJ1bmRlZmluZWRcIiApe1xuICAgICAgICAgICAgaWYobi5zdHlsZV9pZCAhPSBvLnN0eWxlX2lkKXtcbiAgICAgICAgICAgICAgaWYobi5zdHlsZSl7XG4gICAgICAgICAgICAgICAgVmVjdG9ybGF5ZXJTZXJ2aWNlLnVwZGF0ZUNhbnZhcyhuLnN0eWxlLmJhc2VfY29sb3IpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICAgICAgICBWZWN0b3JsYXllclNlcnZpY2UudXBkYXRlQ2FudmFzKCcjZmYwMDAwJyk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgZHJhd0NvdW50cmllcygpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgaWYodHlwZW9mIG4uY2F0ZWdvcmllcyAhPSBcInVuZGVmaW5lZFwiKXtcbiAgICAgICAgICAgICAgaWYobi5jYXRlZ29yaWVzLmxlbmd0aCl7XG4gICAgICAgICAgICAgICAgVmVjdG9ybGF5ZXJTZXJ2aWNlLnVwZGF0ZUNhbnZhcyhuLmNhdGVnb3JpZXNbMF0uc3R5bGUuYmFzZV9jb2xvcik7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgICBWZWN0b3JsYXllclNlcnZpY2UudXBkYXRlQ2FudmFzKCcjZmYwMDAwJyk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGRyYXdDb3VudHJpZXMoKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgLy9JbmRleFNlcnZpY2Uuc2V0QWN0aXZlSW5kaWNhdG9yRGF0YShuKTtcbiAgICAgICAgICBJbmRleFNlcnZpY2Uuc2V0VG9Mb2NhbFN0b3JhZ2UoKTtcbiAgICAgICAgfSx0cnVlKTtcblxuXG4gICAgICAgIGZ1bmN0aW9uIG1pbk1heCgpe1xuICAgICAgICAgIHZtLm1pbiA9IDEwMDAwMDAwO1xuICAgICAgICAgIHZtLm1heCA9IDA7XG4gICAgICAgICAgYW5ndWxhci5mb3JFYWNoKHZtLmRhdGEsIGZ1bmN0aW9uKGl0ZW0sIGtleSl7XG4gICAgICAgICAgICAgIHZtLm1pbiA9IE1hdGgubWluKGl0ZW0uZGF0YVswXVt2bS5pbmRpY2F0b3IuY29sdW1uX25hbWVdLCB2bS5taW4pO1xuICAgICAgICAgICAgICB2bS5tYXggPSBNYXRoLm1heChpdGVtLmRhdGFbMF1bdm0uaW5kaWNhdG9yLmNvbHVtbl9uYW1lXSwgdm0ubWF4KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICB2bS5zY2FsZSA9IGQzLnNjYWxlLmxpbmVhcigpLmRvbWFpbihbdm0ubWluLHZtLm1heF0pLnJhbmdlKFswLDEwMF0pO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGdldFZhbHVlQnlJc28oaXNvKXtcbiAgICAgICAgICB2YXIgdmFsdWUgPSAwO1xuICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaCh2bS5kYXRhLCBmdW5jdGlvbihpdGVtLCBrZXkpe1xuICAgICAgICAgICAgIGlmKGl0ZW0uZGF0YVswXVt2bS5tZXRhLmlzb19maWVsZF0gPT0gaXNvKXtcbiAgICAgICAgICAgICAgIHZhbHVlID0gaXRlbS5kYXRhWzBdW3ZtLmluZGljYXRvci5jb2x1bW5fbmFtZV07XG4gICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBjb3VudHJpZXNTdHlsZShmZWF0dXJlKSB7XG4gICAgXHRcdFx0dmFyIHN0eWxlID0ge307XG4gICAgXHRcdFx0dmFyIGlzbyA9IGZlYXR1cmUucHJvcGVydGllcy5pc29fYTI7XG4gICAgXHRcdFx0dmFyIHZhbHVlID0gZ2V0VmFsdWVCeUlzbyhpc28pIHx8IHZtLm1pbjtcbiAgICBcdFx0XHR2YXIgZmllbGQgPSB2bS5pbmRpY2F0b3IuY29sdW1uX25hbWU7XG4gICAgXHRcdFx0dmFyIHR5cGUgPSBmZWF0dXJlLnR5cGU7XG5cbiAgICBcdFx0XHRzd2l0Y2ggKHR5cGUpIHtcbiAgICBcdFx0XHRjYXNlIDM6IC8vJ1BvbHlnb24nXG5cbiAgICBcdFx0XHRcdFx0dmFyIGNvbG9yUG9zID0gcGFyc2VJbnQoMjU2IC8gMTAwICogcGFyc2VJbnQodm0uc2NhbGUodmFsdWUpKSkgKiA0O1xuICAgIFx0XHRcdFx0XHR2YXIgY29sb3IgPSAncmdiYSgnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldENvbG9yKGNvbG9yUG9zKSArICcsICcgKyBWZWN0b3JsYXllclNlcnZpY2UuZ2V0Q29sb3IoY29sb3JQb3MgKyAxKSArICcsICcgKyBWZWN0b3JsYXllclNlcnZpY2UuZ2V0Q29sb3IoY29sb3JQb3MgKyAyKSArICcsJyArIFZlY3RvcmxheWVyU2VydmljZS5nZXRDb2xvcihjb2xvclBvcyArIDMpICsgJyknO1xuICAgICAgICAgICAgICBzdHlsZS5jb2xvciA9ICdyZ2JhKCcgKyBWZWN0b3JsYXllclNlcnZpY2UuZ2V0Q29sb3IoY29sb3JQb3MpICArICcsICcgKyBWZWN0b3JsYXllclNlcnZpY2UuZ2V0Q29sb3IoY29sb3JQb3MgKyAxKSArICcsICcgKyBWZWN0b3JsYXllclNlcnZpY2UuZ2V0Q29sb3IoY29sb3JQb3MgKyAyKSArICcsMC42KSc7IC8vY29sb3I7XG4gICAgXHRcdFx0XHRcdHN0eWxlLm91dGxpbmUgPSB7XG4gICAgXHRcdFx0XHRcdFx0Y29sb3I6IGNvbG9yLFxuICAgIFx0XHRcdFx0XHRcdHNpemU6IDFcbiAgICBcdFx0XHRcdFx0fTtcbiAgICBcdFx0XHRcdFx0c3R5bGUuc2VsZWN0ZWQgPSB7XG4gICAgXHRcdFx0XHRcdFx0Y29sb3I6ICdyZ2JhKCcgKyBWZWN0b3JsYXllclNlcnZpY2UuZ2V0Q29sb3IoY29sb3JQb3MpICsgJywgJyArIFZlY3RvcmxheWVyU2VydmljZS5nZXRDb2xvcihjb2xvclBvcyArIDEpICsgJywgJyArIFZlY3RvcmxheWVyU2VydmljZS5nZXRDb2xvcihjb2xvclBvcyArIDIpICsgJywwLjMpJyxcbiAgICBcdFx0XHRcdFx0XHRvdXRsaW5lOiB7XG4gICAgXHRcdFx0XHRcdFx0XHRjb2xvcjogJ3JnYmEoNjYsNjYsNjYsMC45KScsXG4gICAgXHRcdFx0XHRcdFx0XHRzaXplOiAyXG4gICAgXHRcdFx0XHRcdFx0fVxuICAgIFx0XHRcdFx0XHR9O1xuICAgIFx0XHRcdFx0XHRicmVhaztcblxuICAgIFx0XHRcdH1cblxuICAgIFx0XHRcdGlmIChmZWF0dXJlLmxheWVyLm5hbWUgPT09IFZlY3RvcmxheWVyU2VydmljZS5nZXROYW1lKCkrJ19nZW9tJykge1xuICAgIFx0XHRcdFx0c3R5bGUuc3RhdGljTGFiZWwgPSBmdW5jdGlvbiAoKSB7XG4gICAgXHRcdFx0XHRcdHZhciBzdHlsZSA9IHtcbiAgICBcdFx0XHRcdFx0XHRodG1sOiBmZWF0dXJlLnByb3BlcnRpZXMubmFtZSxcbiAgICBcdFx0XHRcdFx0XHRpY29uU2l6ZTogWzEyNSwgMzBdLFxuICAgIFx0XHRcdFx0XHRcdGNzc0NsYXNzOiAnbGFiZWwtaWNvbi10ZXh0J1xuICAgIFx0XHRcdFx0XHR9O1xuICAgIFx0XHRcdFx0XHRyZXR1cm4gc3R5bGU7XG4gICAgXHRcdFx0XHR9O1xuICAgIFx0XHRcdH1cbiAgICBcdFx0XHRyZXR1cm4gc3R5bGU7XG4gICAgXHRcdH1cbiAgICAgICAgZnVuY3Rpb24gZHJhd0NvdW50cmllcygpIHtcbiAgICAgICAgICBtaW5NYXgoKTtcbiAgICBcdFx0XHRsZWFmbGV0RGF0YS5nZXRNYXAoJ21hcCcpLnRoZW4oZnVuY3Rpb24gKG1hcCkge1xuICAgIFx0XHRcdFx0dm0ubWFwID0gbWFwO1xuICAgIFx0XHRcdFx0dm0ubXZ0U291cmNlID0gVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldExheWVyKCk7XG4gICAgXHRcdFx0XHQkdGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgXHRcdFx0XHRcdFx0dm0ubXZ0U291cmNlLnNldFN0eWxlKGNvdW50cmllc1N0eWxlKTtcbiAgICBcdFx0XHRcdFx0Ly92bS5tdnRTb3VyY2UucmVkcmF3KCk7XG4gICAgXHRcdFx0XHR9KTtcbiAgICBcdFx0XHR9KTtcbiAgICBcdFx0fVxuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignSW5kZXhNZXRhTWVudUN0cmwnLCBmdW5jdGlvbigkc2NvcGUsRGF0YVNlcnZpY2UsRGlhbG9nU2VydmljZSwgSW5kZXhTZXJ2aWNlKXtcbiAgICAgIHZhciB2bSA9IHRoaXM7XG4gICAgICB2bS5kYXRhID0gSW5kZXhTZXJ2aWNlLmdldERhdGEoKTtcbiAgICAgIHZtLm1ldGEgPSBJbmRleFNlcnZpY2UuZ2V0TWV0YSgpO1xuICAgICAgdm0uaW5kaWNhdG9ycyA9IEluZGV4U2VydmljZS5nZXRJbmRpY2F0b3JzKCk7XG4gICAgICB2bS5zZWxlY3RGb3JFZGl0aW5nID0gc2VsZWN0Rm9yRWRpdGluZztcbiAgICAgIHZtLmNoZWNrRnVsbCA9IGNoZWNrRnVsbDtcbiAgICAgIHZtLmNoZWNrQmFzID0gY2hlY2tCYXNlO1xuXG4gICAgICBmdW5jdGlvbiBzZWxlY3RGb3JFZGl0aW5nKGtleSl7XG4gICAgICAgIGlmKHR5cGVvZiBJbmRleFNlcnZpY2UuZ2V0SW5kaWNhdG9yKGtleSkgPT0gXCJ1bmRlZmluZWRcIil7XG4gICAgICAgICAgSW5kZXhTZXJ2aWNlLnNldEluZGljYXRvcihrZXkse1xuICAgICAgICAgICAgY29sdW1uX25hbWU6a2V5LFxuICAgICAgICAgICAgdGl0bGU6a2V5XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgdm0uZWRpdGluZ0l0ZW0gPSBrZXk7XG4gICAgICAgIHZtLmluZGljYXRvciA9IEluZGV4U2VydmljZS5nZXRJbmRpY2F0b3Ioa2V5KTtcbiAgICAgICAgSW5kZXhTZXJ2aWNlLnNldFRvTG9jYWxTdG9yYWdlKCk7XG4gICAgICB9XG4gICAgICBmdW5jdGlvbiBjaGVja0Jhc2UoaXRlbSl7XG4gICAgICAgIGlmKHR5cGVvZiBpdGVtID09IFwidW5kZWZpbmVkXCIpIHJldHVybiBmYWxzZTtcbiAgXHRcdFx0aWYgKGl0ZW0udGl0bGUgJiYgaXRlbS5tZWFzdXJlX3R5cGVfaWQgJiYgaXRlbS5kYXRhcHJvdmlkZXIgJiYgaXRlbS50aXRsZS5sZW5ndGggPj0gMykge1xuICBcdFx0XHRcdHJldHVybiB0cnVlO1xuICBcdFx0XHR9XG4gIFx0XHRcdHJldHVybiBmYWxzZTtcbiAgXHRcdH1cbiAgXHRcdGZ1bmN0aW9uIGNoZWNrRnVsbChpdGVtKXtcbiAgICAgICAgaWYodHlwZW9mIGl0ZW0gPT0gXCJ1bmRlZmluZWRcIiB8fCB0eXBlb2YgaXRlbS5jYXRlZ29yaWVzID09IFwidW5kZWZpbmVkXCIpIHJldHVybiBmYWxzZTtcbiAgXHRcdFx0cmV0dXJuIGNoZWNrQmFzZShpdGVtKSAmJiBpdGVtLmNhdGVnb3JpZXMubGVuZ3RoID8gdHJ1ZSA6IGZhbHNlO1xuICBcdFx0fVxuICAgICAgJHNjb3BlLiR3YXRjaChmdW5jdGlvbigpeyByZXR1cm4gSW5kZXhTZXJ2aWNlLmFjdGl2ZUluZGljYXRvcigpfSwgZnVuY3Rpb24obixvKXtcbiAgICAgICAgaWYobiA9PT0gbylyZXR1cm47XG4gICAgICAgIHZtLmluZGljYXRvcnNbbi5jb2x1bW5fbmFtZV0gPSBuO1xuICAgICAgfSx0cnVlKTtcbiAgICAgICRzY29wZS4kd2F0Y2goZnVuY3Rpb24oKXsgcmV0dXJuIEluZGV4U2VydmljZS5hY3RpdmVJbmRpY2F0b3IoKX0sIGZ1bmN0aW9uKG4sbyl7XG4gICAgICAgIGlmIChuID09PSBvIHx8IHR5cGVvZiBvID09IFwidW5kZWZpbmVkXCIpIHJldHVybjtcbiAgICAgICAgaWYoIXZtLmFza2VkVG9SZXBsaWNhdGUpIHtcbiAgICAgICAgICB2bS5wcmVQcm92aWRlciA9IHZtLmluZGljYXRvcnNbby5jb2x1bW5fbmFtZV0uZGF0YXByb3ZpZGVyO1xuICAgICAgICAgIHZtLnByZU1lYXN1cmUgPSB2bS5pbmRpY2F0b3JzW28uY29sdW1uX25hbWVdLm1lYXN1cmVfdHlwZV9pZDtcbiAgICAgICAgICB2bS5wcmVDYXRlZ29yaWVzID0gdm0uaW5kaWNhdG9yc1tvLmNvbHVtbl9uYW1lXS5jYXRlZ29yaWVzO1xuICAgICAgICAgIHZtLnByZVB1YmxpYyA9IHZtLmluZGljYXRvcnNbby5jb2x1bW5fbmFtZV0uaXNfcHVibGljO1xuICAgICAgICAgIHZtLnByZVN0eWxlID0gdm0uaW5kaWNhdG9yc1tvLmNvbHVtbl9uYW1lXS5zdHlsZTtcbiAgICAgICAgICBjb25zb2xlLmxvZyh2bS5wcmVTdHlsZSk7XG4gICAgICAgICAgRGlhbG9nU2VydmljZS5mcm9tVGVtcGxhdGUoJ2NvcHlwcm92aWRlcicsICRzY29wZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy9uLmRhdGFwcm92aWRlciA9IHZtLmRvUHJvdmlkZXJzID8gdm0ucHJlUHJvdmlkZXIgOiBbXTtcbiAgICAgICAgICAvL24ubWVhc3VyZV90eXBlX2lkID0gdm0uZG9NZWFzdXJlcyA/IHZtLnByZU1lYXN1cmUgOiAwO1xuICAgICAgICAgIC8vbi5jYXRlZ29yaWVzID0gdm0uZG9DYXRlZ29yaWVzID8gdm0ucHJlQ2F0ZWdvcmllczogW107XG4gICAgICAgICAgLy9uLmlzX3B1YmxpYyA9IHZtLmRvUHVibGljID8gdm0ucHJlUHVibGljOiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICB9KTtcbiAgICB9KTtcbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdJbmRleE15RGF0YUN0cmwnLCBmdW5jdGlvbigpe1xuICAgICAgICAvL1xuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignSW5kZXhNeURhdGFFbnRyeUN0cmwnLCBmdW5jdGlvbihVc2VyU2VydmljZSl7XG4gICAgICB2YXIgdm0gPSB0aGlzO1xuICAgICAgdm0uZGF0YSA9IFVzZXJTZXJ2aWNlLm15RGF0YSgpO1xuICAgIH0pO1xufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0luZGV4TXlEYXRhTWVudUN0cmwnLCBmdW5jdGlvbihVc2VyU2VydmljZSl7XG4gICAgICB2YXIgdm0gPSB0aGlzO1xuICAgICAgdm0uZGF0YSA9IFVzZXJTZXJ2aWNlLm15RGF0YSgpO1xuICAgIH0pO1xufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0luZGV4Y3JlYXRvckN0cmwnLCBmdW5jdGlvbigkc2NvcGUsIERpYWxvZ1NlcnZpY2UsRGF0YVNlcnZpY2UsICR0aW1lb3V0LCRzdGF0ZSwgJGZpbHRlciwgbGVhZmxldERhdGEsIHRvYXN0ciwgSWNvbnNTZXJ2aWNlLEluZGV4U2VydmljZSwgVmVjdG9ybGF5ZXJTZXJ2aWNlKXtcblxuICAgICAgICAvL1RPRE86IENoZWNrIGlmIHRoZXJlIGlzIGRhdGEgaW4gc3RvcmFnZSB0byBmaW5pc2hcbiAgICAgIC8qICBjb25zb2xlLmxvZygkc3RhdGUpO1xuICAgICAgICBpZigkc3RhdGUuY3VycmVudC5uYW1lID09ICdhcHAuaW5kZXguY3JlYXRlJyl7XG4gICAgICAgICAgaWYoSW5kZXhTZXJ2aWNlLmdldERhdGEoKS5sZW5ndGgpe1xuICAgICAgICAgICAgaWYoY29uZmlybSgnRXhpc3RpbmcgRGF0YS4gR28gT24/Jykpe1xuICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC5pbmRleC5jaGVjaycpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgSW5kZXhTZXJ2aWNlLmNsZWFyKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9Ki9cblxuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuICAgICAgICB2bS5tYXAgPSBudWxsO1xuICAgICAgICB2bS5kYXRhID0gW107XG4gICAgICAgIHZtLnRvU2VsZWN0ID0gW107XG4gICAgICAgIHZtLnNlbGVjdGVkID0gW107XG4gICAgICAgIHZtLnNlbGVjdGVkUm93cyA9IFtdO1xuICAgICAgICB2bS5zZWxlY3RlZFJlc291cmNlcyA9W107XG4gICAgICAgIHZtLnNvcnRlZFJlc291cmNlcyA9IFtdO1xuXG4gICAgICAgIHZtLmdyb3VwcyA9IFtdO1xuICAgICAgICB2bS5teURhdGEgPSBbXTtcbiAgICAgICAgdm0uYWRkRGF0YVRvID0ge307XG4gICAgICAgIHZtLnNlbGVjdGVkRm9yR3JvdXAgPSBbXTtcbiAgICAgICAgdm0uaXNvX2Vycm9ycyA9IDA7XG4gICAgICAgIHZtLmlzb19jaGVja2VkID0gZmFsc2U7XG4gICAgICAgIHZtLnNhdmVEaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgICB2bS5zZWxlY3RlZEluZGV4ID0gMDtcbiAgICAgICAgdm0uc3RlcCA9IDA7XG4gICAgICAgIHZtLm9wZW5DbG9zZSA9IG9wZW5DbG9zZTtcbiAgICAgICAgLy92bS5zZWFyY2ggPSBzZWFyY2g7XG5cbiAgICAgICAgdm0ubGlzdFJlc291cmNlcyA9IGxpc3RSZXNvdXJjZXM7XG4gICAgICAgIHZtLnRvZ2dsZUxpc3RSZXNvdXJjZXMgPSB0b2dnbGVMaXN0UmVzb3VyY2VzO1xuICAgICAgICB2bS5zZWxlY3RlZFJlc291cmNlID0gc2VsZWN0ZWRSZXNvdXJjZTtcbiAgICAgICAgdm0udG9nZ2xlUmVzb3VyY2UgPSB0b2dnbGVSZXNvdXJjZTtcbiAgICAgICAgdm0uaW5jcmVhc2VQZXJjZW50YWdlID0gaW5jcmVhc2VQZXJjZW50YWdlO1xuICAgICAgICB2bS5kZWNyZWFzZVBlcmNlbnRhZ2UgPSBkZWNyZWFzZVBlcmNlbnRhZ2U7XG4gICAgICAgIHZtLnRvZ2dsZUdyb3VwU2VsZWN0aW9uID0gdG9nZ2xlR3JvdXBTZWxlY3Rpb247XG4gICAgICAgIHZtLmV4aXN0c0luR3JvdXBTZWxlY3Rpb24gPSBleGlzdHNJbkdyb3VwU2VsZWN0aW9uO1xuICAgICAgICB2bS5hZGRHcm91cCA9IGFkZEdyb3VwO1xuICAgICAgICB2bS5jbG9uZVNlbGVjdGlvbiA9IGNsb25lU2VsZWN0aW9uO1xuICAgICAgICB2bS5lZGl0RW50cnkgPSBlZGl0RW50cnk7XG4gICAgICAgIHZtLnJlbW92ZUVudHJ5ID0gcmVtb3ZlRW50cnk7XG4gICAgICAgIHZtLnNhdmVJbmRleCA9IHNhdmVJbmRleDtcblxuICAgICAgICB2bS5pY29ucyA9IEljb25zU2VydmljZS5nZXRMaXN0KCk7XG5cblxuICAgICAgICB2bS5tZXRhID0ge1xuICAgICAgICAgIGlzb19maWVsZDogJycsXG4gICAgICAgICAgY291bnRyeV9maWVsZDonJyxcbiAgICAgICAgICB0YWJsZTpbXVxuICAgICAgICB9O1xuICAgICAgICB2bS5xdWVyeSA9IHtcbiAgICAgICAgICBmaWx0ZXI6ICcnLFxuICAgICAgICAgIG9yZGVyOiAnLWVycm9ycycsXG4gICAgICAgICAgbGltaXQ6IDE1LFxuICAgICAgICAgIHBhZ2U6IDFcbiAgICAgICAgfTtcblxuICAgICAgICAvKnZtLnRyZWVPcHRpb25zID0ge1xuICAgICAgICAgIGJlZm9yZURyb3A6ZnVuY3Rpb24oZXZlbnQpe1xuICAgICAgICAgICAgaWYoZXZlbnQuZGVzdC5ub2Rlc1Njb3BlICE9IGV2ZW50LnNvdXJjZS5ub2Rlc1Njb3BlKXtcbiAgICAgICAgICAgICAgdmFyIGlkeCA9IGV2ZW50LmRlc3Qubm9kZXNTY29wZS4kbW9kZWxWYWx1ZS5pbmRleE9mKGV2ZW50LnNvdXJjZS5ub2RlU2NvcGUuJG1vZGVsVmFsdWUpO1xuICAgICAgICAgICAgICBpZihpZHggPiAtMSl7XG4gICAgICAgICAgICAgICAgIGV2ZW50LnNvdXJjZS5ub2RlU2NvcGUuJCRhcHBseSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICB0b2FzdHIuZXJyb3IoJ09ubHkgb25lIGVsZW1lbnQgb2YgYSBraW5kIHBlciBncm91cCBwb3NzaWJsZSEnLCAnTm90IGFsbG93ZWQhJylcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgZHJvcHBlZDpmdW5jdGlvbihldmVudCl7XG4gICAgICAgICAgICBjYWxjUGVyY2VudGFnZSh2bS5ncm91cHMpO1xuICAgICAgICAgIH1cbiAgICAgICAgfTsqL1xuXG4gICAgICAgIC8vUnVuIFN0YXJ0dXAtRnVuY2l0b25zXG4gICAgICAgIGFjdGl2YXRlKCk7XG5cbiAgICAgICAgZnVuY3Rpb24gYWN0aXZhdGUoKXtcbiAgICAgICAgICAvL2NsZWFyTWFwKCk7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gb3BlbkNsb3NlKGFjdGl2ZSl7XG4gICAgICAgICAgcmV0dXJuIGFjdGl2ZSA/ICdyZW1vdmUnIDogJ2FkZCc7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gY2xlYXJMYXllclN0eWxlKGZlYXR1cmUpe1xuICAgICAgXHRcdFx0dmFyIHN0eWxlID0ge1xuICAgICAgICAgICAgICBjb2xvcjoncmdiYSgyNTUsMjU1LDI1NSwwKScsXG4gICAgICAgICAgICAgIG91dGxpbmU6IHtcbiAgICBcdFx0XHRcdFx0XHRjb2xvcjogJ3JnYmEoMjU1LDI1NSwyNTUsMCknLFxuICAgIFx0XHRcdFx0XHRcdHNpemU6IDFcbiAgICBcdFx0XHRcdFx0fVxuICAgICAgICAgICAgfTtcbiAgICAgIFx0XHRcdHJldHVybiBzdHlsZTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBjbGVhck1hcCgpe1xuICAgICAgICAgIFx0bGVhZmxldERhdGEuZ2V0TWFwKCdtYXAnKS50aGVuKGZ1bmN0aW9uIChtYXApIHtcbiAgICAgICAgICAgICAgdm0ubXZ0U291cmNlID0gVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldExheWVyKCk7XG4gICAgICAgICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgdm0ubXZ0U291cmNlLnNldFN0eWxlKGNsZWFyTGF5ZXJTdHlsZSk7XG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG5cbiAgICAgICAgZnVuY3Rpb24gdG9nZ2xlTGlzdFJlc291cmNlcygpe1xuICAgICAgICAgIHZtLnNob3dSZXNvdXJjZXMgPSAhdm0uc2hvd1Jlc291cmNlcztcbiAgICAgICAgICBpZih2bS5zaG93UmVzb3VyY2VzKXtcbiAgICAgICAgICAgIHZtLmxpc3RSZXNvdXJjZXMoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gbGlzdFJlc291cmNlcygpe1xuICAgICAgICAgIGlmKCF2bS5yZXNvdXJjZXMpe1xuICAgICAgICAgICAgRGF0YVNlcnZpY2UuZ2V0QWxsKCdkYXRhL3RhYmxlcycpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgICAgICAgICB2bS5yZXNvdXJjZXMgPSByZXNwb25zZTtcbiAgICAgICAgICAgICAgdm0uc2VsZWN0ZWRSZXNvdXJjZXMgPSBbXSwgdm0uc29ydGVkUmVzb3VyY2VzID0gW107XG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH1cblxuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIHNlbGVjdGVkUmVzb3VyY2UocmVzb3VyY2Upe1xuICAgICAgICAgIHJldHVybiB2bS5zZWxlY3RlZFJlc291cmNlcy5pbmRleE9mKHJlc291cmNlKSA+IC0xID8gdHJ1ZSA6IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGRlbGV0ZUZyb21Hcm91cChyZXNvdXJjZSwgbGlzdCl7XG4gICAgICAgICAgYW5ndWxhci5mb3JFYWNoKGxpc3QsIGZ1bmN0aW9uKGl0ZW0sIGtleSl7XG4gICAgICAgICAgICAgIC8vaWYodHlwZW9mIGl0ZW0uaXNHcm91cCA9PSBcInVuZGVmaW5lZFwiKXtcbiAgICAgICAgICAgICAgICBpZihpdGVtID09IHJlc291cmNlKXtcbiAgICAgICAgICAgICAgICAgIGxpc3Quc3BsaWNlKGtleSwgMSk7XG4gICAgICAgICAgICAgICAgICB2bS5zZWxlY3RlZEZvckdyb3VwLnNwbGljZSh2bS5zZWxlY3RlZEZvckdyb3VwLmluZGV4T2YoaXRlbSksIDEpO1xuICAgICAgICAgICAgICAgICAgdm0uc2VsZWN0ZWRSZXNvdXJjZXMuc3BsaWNlKHZtLnNlbGVjdGVkUmVzb3VyY2VzLmluZGV4T2YoaXRlbSksMSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAvL31cbiAgICAgICAgICAgICAgZGVsZXRlRnJvbUdyb3VwKHJlc291cmNlLCBpdGVtLm5vZGVzKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiB0b2dnbGVSZXNvdXJjZShyZXNvdXJjZSl7XG4gICAgICAgICAgdmFyIGlkeCA9IHZtLnNlbGVjdGVkUmVzb3VyY2VzLmluZGV4T2YocmVzb3VyY2UpO1xuICAgICAgICAgIGlmKCBpZHggPiAtMSl7XG4gICAgICAgICAgICB2bS5zZWxlY3RlZFJlc291cmNlcy5zcGxpY2UoaWR4LCAxKTtcbiAgICAgICAgICAgIGRlbGV0ZUZyb21Hcm91cChyZXNvdXJjZSwgdm0uZ3JvdXBzKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgIHZtLnNlbGVjdGVkUmVzb3VyY2VzLnB1c2gocmVzb3VyY2UpO1xuICAgICAgICAgICAgaWYodm0uc2VsZWN0ZWRGb3JHcm91cC5sZW5ndGggPT0gMSAmJiB0eXBlb2Ygdm0uc2VsZWN0ZWRGb3JHcm91cFswXS5pc0dyb3VwICE9IFwidW5kZWZpbmVkXCIpe1xuICAgICAgICAgICAgICB2bS5zZWxlY3RlZEZvckdyb3VwWzBdLm5vZGVzLnB1c2gocmVzb3VyY2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgICB2bS5ncm91cHMucHVzaChyZXNvdXJjZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy9jYWxjUGVyY2VudGFnZSh2bS5zb3J0ZWRSZXNvdXJjZXMpO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGNhbGNQZXJjZW50YWdlKG5vZGVzKXtcbiAgICAgICAgICBhbmd1bGFyLmZvckVhY2gobm9kZXMsIGZ1bmN0aW9uKG5vZGUsIGtleSl7XG4gICAgICAgICAgICBub2Rlc1trZXldLndlaWdodCA9IHBhcnNlSW50KDEwMCAvIG5vZGVzLmxlbmd0aCk7XG4gICAgICAgICAgICBjYWxjUGVyY2VudGFnZShub2Rlcy5ub2RlKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBpbmNyZWFzZVBlcmNlbnRhZ2UoaXRlbSl7XG4gICAgICAgICAgY29uc29sZS5sb2coaXRlbSk7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gZGVjcmVhc2VQZXJjZW50YWdlKGl0ZW0pe1xuICAgICAgICAgIGNvbnNvbGUubG9nKGl0ZW0pXG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gdG9nZ2xlR3JvdXBTZWxlY3Rpb24oaXRlbSl7XG4gICAgICAgICAgdmFyIGlkeCA9IHZtLnNlbGVjdGVkRm9yR3JvdXAuaW5kZXhPZihpdGVtKTtcbiAgICAgICAgICBpZiggaWR4ID4gLTEpe1xuICAgICAgICAgICAgdm0uc2VsZWN0ZWRGb3JHcm91cC5zcGxpY2UoaWR4LCAxKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgIHZtLnNlbGVjdGVkRm9yR3JvdXAucHVzaChpdGVtKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gZXhpc3RzSW5Hcm91cFNlbGVjdGlvbihpdGVtKXtcbiAgICAgICAgICByZXR1cm4gdm0uc2VsZWN0ZWRGb3JHcm91cC5pbmRleE9mKGl0ZW0pID4gLTE7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gYWRkR3JvdXAoKXtcbiAgICAgICAgICB2YXIgbmV3R3JvdXAgPSB7XG4gICAgICAgICAgICB0aXRsZTonR3JvdXAnLFxuICAgICAgICAgICAgaXNHcm91cDp0cnVlLFxuICAgICAgICAgICAgbm9kZXM6W11cbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgaWYodm0uc2VsZWN0ZWRGb3JHcm91cC5sZW5ndGggPT0gMSAmJiB0eXBlb2Ygdm0uc2VsZWN0ZWRGb3JHcm91cFswXS5pc0dyb3VwICE9IFwidW5kZWZpbmVkXCIpe1xuICAgICAgICAgICAgdm0uc2VsZWN0ZWRGb3JHcm91cFswXS5ub2Rlcy5wdXNoKG5ld0dyb3VwKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSBpZih2bS5zZWxlY3RlZEZvckdyb3VwLmxlbmd0aCA+IDAgKXtcbiAgICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKHZtLnNlbGVjdGVkRm9yR3JvdXAsIGZ1bmN0aW9uKGl0ZW0sIGtleSl7XG4gICAgICAgICAgICAgICAgICBuZXdHcm91cC5ub2Rlcy5wdXNoKGl0ZW0pO1xuICAgICAgICAgICAgICAgICAgZGVsZXRlRnJvbUdyb3VwKGl0ZW0sIHZtLnNlbGVjdGVkRm9yR3JvdXApO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgdm0uZ3JvdXBzLnB1c2gobmV3R3JvdXApO1xuICAgICAgICAgICAgICB2bS5zZWxlY3RlZEZvckdyb3VwID0gW107XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICB2bS5ncm91cHMucHVzaChuZXdHcm91cCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGNsb25lU2VsZWN0aW9uKCl7XG4gICAgICAgICAgdmFyIG5ld0dyb3VwID0ge1xuICAgICAgICAgICAgdGl0bGU6J0Nsb25lZCBFbGVtZW50cycsXG4gICAgICAgICAgICBpc0dyb3VwOnRydWUsXG4gICAgICAgICAgICBub2RlczpbXVxuICAgICAgICAgIH07XG4gICAgICAgICAgYW5ndWxhci5mb3JFYWNoKHZtLnNlbGVjdGVkRm9yR3JvdXAsIGZ1bmN0aW9uKGl0ZW0sIGtleSl7XG4gICAgICAgICAgICBuZXdHcm91cC5ub2Rlcy5wdXNoKGl0ZW0pO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIHZtLmdyb3Vwcy5wdXNoKG5ld0dyb3VwKTtcbiAgICAgICAgICB2bS5zZWxlY3RlZEZvckdyb3VwID0gW107XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gZWRpdEVudHJ5KGl0ZW0pe1xuICAgICAgICAgIHZtLmVkaXRJdGVtID0gaXRlbTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiByZW1vdmVFbnRyeShpdGVtLCBsaXN0KXtcbiAgICAgICAgICAgIGRlbGV0ZUZyb21Hcm91cChpdGVtLCBsaXN0KTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBzYXZlSW5kZXgoKXtcbiAgICAgICAgICBpZih2bS5zYXZlRGlzYWJsZWQpe1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICB2bS5zYXZlRGlzYWJsZWQgPSB0cnVlO1xuICAgICAgICAgIGlmKHR5cGVvZiB2bS5uZXdJbmRleCA9PSAndW5kZWZpbmVkJyl7XG4gICAgICAgICAgICB0b2FzdHIuZXJyb3IoJ1lvdSBuZWVkIHRvIGVudGVyIGEgdGl0bGUhJywnSW5mbyBtaXNzaW5nJyk7XG4gICAgICAgICAgICB2bS5zYXZlRGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYoIXZtLm5ld0luZGV4LnRpdGxlKXtcbiAgICAgICAgICAgIHRvYXN0ci5lcnJvcignWW91IG5lZWQgdG8gZW50ZXIgYSB0aXRsZSEnLCdJbmZvIG1pc3NpbmcnKTtcbiAgICAgICAgICAgIHZtLnNhdmVEaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICB2bS5uZXdJbmRleC5kYXRhID0gdm0uZ3JvdXBzO1xuICAgICAgICAgIERhdGFTZXJ2aWNlLnBvc3QoJ2luZGV4Jywgdm0ubmV3SW5kZXgpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgICAgICAgdm0uc2F2ZURpc2FibGVkID0gZmFsc2U7XG4gICAgICAgICAgICB0b2FzdHIuc3VjY2VzcygnWW91ciBJbmRleCBoYXMgYmVlbiBjcmVhdGVkJywgJ1N1Y2Nlc3MnKSxcbiAgICAgICAgICAgICRzdGF0ZS5nbygnYXBwLmluZGV4LnNob3cnLCB7aW5kZXg6cmVzcG9uc2UubmFtZX0pO1xuICAgICAgICAgIH0sZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgICAgICAgdm0uc2F2ZURpc2FibGVkID0gZmFsc2U7XG4gICAgICAgICAgICB0b2FzdHIuZXJyb3IocmVzcG9uc2UubWVzc2FnZSwnVXBwcyEhJyk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgLyokc2NvcGUuJG9uKFwiJHN0YXRlQ2hhbmdlU3VjY2Vzc1wiLCBmdW5jdGlvbiAoZXZlbnQsIHRvU3RhdGUsIHRvUGFyYW1zLCBmcm9tU3RhdGUsIGZyb21QYXJhbXMpIHtcbiAgICAgICAgICBpZighdm0uZGF0YS5sZW5ndGgpe1xuICAgICAgICAgICAgJHN0YXRlLmdvKCdhcHAuaW5kZXguY3JlYXRlJyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICBzd2l0Y2ggKHRvU3RhdGUubmFtZSkge1xuICAgICAgICAgICAgICBjYXNlICdhcHAuaW5kZXguY3JlYXRlJzpcbiAgICAgICAgICAgICAgICAgIHZtLnN0ZXAgPSAwO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICBjYXNlICdhcHAuaW5kZXguY3JlYXRlLmJhc2ljJzpcbiAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHZtLmRhdGEpO1xuICAgICAgICAgICAgICAgICAgICB2bS5zdGVwID0gMTtcbiAgICAgICAgICAgICAgICAgICAgY2hlY2tNeURhdGEoKTtcbiAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICBjYXNlICdhcHAuaW5kZXguY3JlYXRlLmNoZWNrJzpcbiAgICAgICAgICAgICAgICAgIHZtLnN0ZXAgPSAyO1xuICAgICAgICAgICAgICAgICAgdm0uc2hvd1VwbG9hZENvbnRhaW5lciA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICBjYXNlICdhcHAuaW5kZXguY3JlYXRlLm1ldGEnOlxuICAgICAgICAgICAgICAgICAgdm0uc3RlcCA9IDM7XG4gICAgICAgICAgICAgICAgICAgIHZtLnNob3dVcGxvYWRDb250YWluZXIgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICBjYXNlICdhcHAuaW5kZXguY3JlYXRlLmZpbmFsJzpcbiAgICAgICAgICAgICAgICAgIHZtLnN0ZXAgPSA0O1xuICAgICAgICAgICAgICAgICAgICB2bS5zaG93VXBsb2FkQ29udGFpbmVyID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pOyovXG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdJbmRleGVkaXRvckN0cmwnLCBmdW5jdGlvbigkZmlsdGVyLCBpbmRpY2F0b3JzKSB7XG5cdFx0Ly9cblx0XHR2YXIgdm0gPSB0aGlzO1xuXG5cdFx0dm0uaW5kaWNhdG9ycyA9IGluZGljYXRvcnM7XG5cdFx0dm0uc2VsZWN0aW9uID0gW107XG5cdFx0dm0uZmlsdGVyID0ge1xuXHRcdFx0bGlzdDogMCxcblx0XHRcdHR5cGVzOiB7XG5cdFx0XHRcdHRpdGxlOiB0cnVlLFxuXHRcdFx0XHRzdHlsZTogdHJ1ZSxcblx0XHRcdFx0Y2F0ZWdvcmllczogZmFsc2UsXG5cdFx0XHRcdGluZm9ncmFwaGljOiBmYWxzZSxcblx0XHRcdFx0ZGVzY3JpcHRpb246IHRydWVcblx0XHRcdH1cblx0XHR9XG5cdFx0dm0ub3Blbk1lbnUgPSBvcGVuTWVudTtcblx0XHR2bS5zZWxlY3RlZEl0ZW0gPSBzZWxlY3RlZEl0ZW07XG5cdFx0dm0udG9nZ2xlU2VsZWN0aW9uID0gdG9nZ2xlU2VsZWN0aW9uO1xuXG5cdFx0ZnVuY3Rpb24gc2VsZWN0ZWRJdGVtKGl0ZW0pIHtcblx0XHRcdHJldHVybiB2bS5zZWxlY3Rpb24uaW5kZXhPZihpdGVtKSA+IC0xID8gdHJ1ZSA6IGZhbHNlO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIHRvZ2dsZVNlbGVjdGlvbihpdGVtKSB7XG5cdFx0XHR2YXIgaW5kZXggPSB2bS5zZWxlY3Rpb24uaW5kZXhPZihpdGVtKTtcblx0XHRcdGlmIChpbmRleCA+IC0xKSB7XG5cdFx0XHRcdHJldHVybiB2bS5zZWxlY3Rpb24uc3BsaWNlKGluZGV4LCAxKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJldHVybiB2bS5zZWxlY3Rpb24ucHVzaChpdGVtKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRmdW5jdGlvbiBvcGVuTWVudSgkbWRPcGVuTWVudSwgZXYpIHtcblx0XHRcdCRtZE9wZW5NZW51KGV2KTtcblx0XHR9XG5cblx0fSk7XG5cbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0luZGV4ZWRpdG9yaW5kaWNhdG9yQ3RybCcsIGZ1bmN0aW9uICgkc2NvcGUsICRzdGF0ZSwkdGltZW91dCwgVmVjdG9ybGF5ZXJTZXJ2aWNlLCBsZWFmbGV0RGF0YSwgQ29udGVudFNlcnZpY2UpIHtcblx0XHQvL1xuXHRcdHZhciB2bSA9IHRoaXM7XG4gICAgdm0uaW5kaWNhdG9yID0gQ29udGVudFNlcnZpY2UuZ2V0SW5kaWNhdG9yKCRzdGF0ZS5wYXJhbXMuaWQpO1xuXHRcdHZtLnNjYWxlID0gXCJcIjtcblx0XHR2bS5taW4gPSAxMDAwMDAwMDtcblx0XHR2bS5tYXggPSAwO1xuXHRcdHZtLnNlbGVjdGVkID0gMDtcblx0XHRzZXRBY3RpdmUoKTtcblxuXHRcdENvbnRlbnRTZXJ2aWNlLmdldEluZGljYXRvckRhdGEoJHN0YXRlLnBhcmFtcy5pZCkudGhlbihmdW5jdGlvbihkYXRhKXtcblx0XHRcdFZlY3RvcmxheWVyU2VydmljZS5jcmVhdGVDYW52YXMoJyNmZjAwMDAnKTtcblx0XHRcdHZtLmRhdGEgPSBkYXRhO1xuXHRcdFx0bWluTWF4KCk7XG5cdFx0XHRkcmF3Q291bnRyaWVzKCk7XG5cdFx0fSk7XG5cdFx0ZnVuY3Rpb24gc2V0QWN0aXZlKCl7XG5cdFx0XHRpZigkc3RhdGUuY3VycmVudC5uYW1lID09ICdhcHAuaW5kZXguZWRpdG9yLmluZGljYXRvci5kZXRhaWxzJyl7XG5cdFx0XHRcdGlmKCRzdGF0ZS5wYXJhbXMuZW50cnkgPT0gXCJpbmZvZ3JhcGhpY1wiKXtcblx0XHRcdFx0XHR2bS5zZWxlY3RlZCA9IDE7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSBpZigkc3RhdGUucGFyYW1zLmVudHJ5ID09IFwiaW5kaXplc1wiKXtcblx0XHRcdFx0XHR2bS5zZWxlY3RlZCA9IDI7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSBpZigkc3RhdGUucGFyYW1zLmVudHJ5ID09IFwic3R5bGVcIil7XG5cdFx0XHRcdFx0dm0uc2VsZWN0ZWQgPSAzO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2UgaWYoJHN0YXRlLnBhcmFtcy5lbnRyeSA9PSBcImNhdGVnb3JpZXNcIil7XG5cdFx0XHRcdFx0dm0uc2VsZWN0ZWQgPSA0O1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2V7XG5cdFx0XHRcdFx0dm0uc2VsZWN0ZWQgPSAwO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIG1pbk1heCgpe1xuXHRcdFx0dm0ubWluID0gMTAwMDAwMDA7XG5cdFx0XHR2bS5tYXggPSAwO1xuXHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLmRhdGEsIGZ1bmN0aW9uKGl0ZW0sIGtleSl7XG5cdFx0XHRcdFx0dm0ubWluID0gTWF0aC5taW4oaXRlbS5zY29yZSwgdm0ubWluKTtcblx0XHRcdFx0XHR2bS5tYXggPSBNYXRoLm1heChpdGVtLnNjb3JlLCB2bS5tYXgpO1xuXHRcdFx0fSk7XG5cdFx0XHR2bS5zY2FsZSA9IGQzLnNjYWxlLmxpbmVhcigpLmRvbWFpbihbdm0ubWluLHZtLm1heF0pLnJhbmdlKFswLDEwMF0pO1xuXHRcdH1cblx0XHRmdW5jdGlvbiBnZXRWYWx1ZUJ5SXNvKGlzbyl7XG5cdFx0XHR2YXIgdmFsdWUgPSAwO1xuXHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLmRhdGEsIGZ1bmN0aW9uKGl0ZW0sIGtleSl7XG5cdFx0XHRcdCBpZihpdGVtLmlzbyA9PSBpc28pe1xuXHRcdFx0XHRcdCB2YWx1ZSA9IGl0ZW0uc2NvcmU7XG5cdFx0XHRcdCB9XG5cdFx0XHR9KTtcblx0XHRcdHJldHVybiB2YWx1ZTtcblx0XHR9XG5cdFx0ZnVuY3Rpb24gY291bnRyaWVzU3R5bGUoZmVhdHVyZSkge1xuXHRcdFx0dmFyIHN0eWxlID0ge307XG5cdFx0XHR2YXIgaXNvID0gZmVhdHVyZS5wcm9wZXJ0aWVzLmlzb19hMjtcblx0XHRcdHZhciB2YWx1ZSA9IGdldFZhbHVlQnlJc28oaXNvKSB8fCB2bS5taW47XG5cdFx0XHR2YXIgdHlwZSA9IGZlYXR1cmUudHlwZTtcblxuXHRcdFx0c3dpdGNoICh0eXBlKSB7XG5cdFx0XHRcdGNhc2UgMzogLy8nUG9seWdvbidcblx0XHRcdFx0XHR2YXIgY29sb3JQb3MgPSBwYXJzZUludCgyNTYgLyAxMDAgKiBwYXJzZUludCh2bS5zY2FsZSh2YWx1ZSkpKSAqIDQ7XG5cdFx0XHRcdFx0dmFyIGNvbG9yID0gJ3JnYmEoJyArIFZlY3RvcmxheWVyU2VydmljZS5nZXRDb2xvcihjb2xvclBvcykgKyAnLCAnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldENvbG9yKGNvbG9yUG9zICsgMSkgKyAnLCAnICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldENvbG9yKGNvbG9yUG9zICsgMikgKyAnLCcgKyBWZWN0b3JsYXllclNlcnZpY2UuZ2V0Q29sb3IoY29sb3JQb3MgKyAzKSArICcpJztcblx0XHRcdFx0XHRzdHlsZS5jb2xvciA9ICdyZ2JhKCcgKyBWZWN0b3JsYXllclNlcnZpY2UuZ2V0Q29sb3IoY29sb3JQb3MpICArICcsICcgKyBWZWN0b3JsYXllclNlcnZpY2UuZ2V0Q29sb3IoY29sb3JQb3MgKyAxKSArICcsICcgKyBWZWN0b3JsYXllclNlcnZpY2UuZ2V0Q29sb3IoY29sb3JQb3MgKyAyKSArICcsMC42KSc7IC8vY29sb3I7XG5cdFx0XHRcdFx0c3R5bGUub3V0bGluZSA9IHtcblx0XHRcdFx0XHRcdGNvbG9yOiBjb2xvcixcblx0XHRcdFx0XHRcdHNpemU6IDFcblx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdHN0eWxlLnNlbGVjdGVkID0ge1xuXHRcdFx0XHRcdFx0Y29sb3I6ICdyZ2JhKCcgKyBWZWN0b3JsYXllclNlcnZpY2UuZ2V0Q29sb3IoY29sb3JQb3MpICsgJywgJyArIFZlY3RvcmxheWVyU2VydmljZS5nZXRDb2xvcihjb2xvclBvcyArIDEpICsgJywgJyArIFZlY3RvcmxheWVyU2VydmljZS5nZXRDb2xvcihjb2xvclBvcyArIDIpICsgJywwLjMpJyxcblx0XHRcdFx0XHRcdG91dGxpbmU6IHtcblx0XHRcdFx0XHRcdFx0Y29sb3I6ICdyZ2JhKDY2LDY2LDY2LDAuOSknLFxuXHRcdFx0XHRcdFx0XHRzaXplOiAyXG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHN0eWxlO1xuXHRcdH1cblx0XHRmdW5jdGlvbiBkcmF3Q291bnRyaWVzKCkge1xuXHRcdFx0bWluTWF4KCk7XG5cdFx0XHRsZWFmbGV0RGF0YS5nZXRNYXAoJ21hcCcpLnRoZW4oZnVuY3Rpb24gKG1hcCkge1xuXHRcdFx0XHR2bS5tYXAgPSBtYXA7XG5cdFx0XHRcdHZtLm12dFNvdXJjZSA9IFZlY3RvcmxheWVyU2VydmljZS5nZXRMYXllcigpO1xuXHRcdFx0XHQkdGltZW91dChmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHR2bS5tdnRTb3VyY2Uuc2V0U3R5bGUoY291bnRyaWVzU3R5bGUpO1xuXHRcdFx0XHRcdC8vdm0ubXZ0U291cmNlLnJlZHJhdygpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdCRzY29wZS4kb24oJyRzdGF0ZUNoYW5nZVN1Y2Nlc3MnLCBmdW5jdGlvbigpe1xuXHRcdFx0c2V0QWN0aXZlKCk7XG5cdFx0fSk7XG5cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignSW5kZXhpbmZvQ3RybCcsIGZ1bmN0aW9uKEluZGl6ZXNTZXJ2aWNlKXtcbiAgICAgICAgdmFyIHZtID0gdGhpcztcbiAgICAgICAgdm0uc3RydWN0dXJlID0gSW5kaXplc1NlcnZpY2UuZ2V0U3RydWN0dXJlKCk7XG4gICAgfSk7XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignTG9naW5DdHJsJywgZnVuY3Rpb24oJHJvb3RTY29wZSwgJHN0YXRlLCAkYXV0aCwgdG9hc3RyKXtcbiAgICAgICAgdmFyIHZtID0gdGhpcztcbiAgICAgICAgdm0ucHJldlN0YXRlID0gbnVsbDtcbiAgICAgICAgdm0uZG9Mb2dpbiA9IGRvTG9naW47XG4gICAgICAgIHZtLmNoZWNrTG9nZ2VkSW4gPSBjaGVja0xvZ2dlZEluO1xuICAgICAgXG4gICAgICAgIHZtLnVzZXIgPSB7XG4gICAgICAgICAgZW1haWw6JycsXG4gICAgICAgICAgcGFzc3dvcmQ6JydcbiAgICAgICAgfTtcblxuICAgICAgICBhY3RpdmF0ZSgpO1xuXG4gICAgICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCl7XG4gICAgICAgICAgdm0uY2hlY2tMb2dnZWRJbigpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gY2hlY2tMb2dnZWRJbigpe1xuXG4gICAgICAgICAgaWYoJGF1dGguaXNBdXRoZW50aWNhdGVkKCkpe1xuICAgICAgICAgICAgLy8kc3RhdGUuZ28oJ2FwcC5pbmRleC5zaG93Jywge2luZGV4OidlcGknfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGRvTG9naW4oKXtcbiAgICAgICAgICAkYXV0aC5sb2dpbih2bS51c2VyKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgICAgICAgIHRvYXN0ci5zdWNjZXNzKCdZb3UgaGF2ZSBzdWNjZXNzZnVsbHkgc2lnbmVkIGluJyk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygkcm9vdFNjb3BlLnByZXZpb3VzUGFnZSk7XG4gICAgICAgICAgICAkc3RhdGUuZ28oJHJvb3RTY29wZS5wcmV2aW91c1BhZ2Uuc3RhdGUubmFtZSB8fCAnYXBwLmhvbWUnLCAkcm9vdFNjb3BlLnByZXZpb3VzUGFnZS5wYXJhbXMpO1xuICAgICAgICAgIH0pLmNhdGNoKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgICAgICAgIHRvYXN0ci5lcnJvcignUGxlYXNlIGNoZWNrIHlvdXIgZW1haWwgYW5kIHBhc3N3b3JkJywgJ1NvbWV0aGluZyB3ZW50IHdyb25nJyk7XG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ01hcEN0cmwnLCBmdW5jdGlvbiAobGVhZmxldERhdGEsIFZlY3RvcmxheWVyU2VydmljZSkge1xuXHRcdC8vXG5cdFx0dmFyIHZtID0gdGhpcztcblx0XHR2YXIgYXBpS2V5ID0gVmVjdG9ybGF5ZXJTZXJ2aWNlLmtleXMubWFwYm94O1xuXG5cdFx0dm0uZGVmYXVsdHMgPSB7XG5cdFx0XHQvL3Njcm9sbFdoZWVsWm9vbTogZmFsc2UsXG5cdFx0XHRtaW5ab29tOjJcblx0XHR9O1xuXHRcdHZtLmNlbnRlciA9IHtcblx0XHRcdGxhdDogMCxcblx0XHRcdGxuZzogMCxcblx0XHRcdHpvb206IDNcblx0XHR9O1xuXHRcdHZtLmxheWVycyA9IHtcblx0XHRcdGJhc2VsYXllcnM6IHtcblx0XHRcdFx0eHl6OiB7XG5cdFx0XHRcdFx0bmFtZTogJ01hcEJveCBPdXRkb29ycyBNb2QnLFxuXHRcdFx0XHRcdHVybDogJ2h0dHBzOi8ve3N9LnRpbGVzLm1hcGJveC5jb20vdjQvdmFsZGVycmFtYS5kODYxMTRiNi97en0ve3h9L3t5fS5wbmc/YWNjZXNzX3Rva2VuPScgKyBhcGlLZXksXG5cdFx0XHRcdFx0dHlwZTogJ3h5eicsXG5cdFx0XHRcdFx0bGF5ZXJPcHRpb25zOntcblx0XHRcdFx0XHRcdFx0bm9XcmFwOiB0cnVlLFxuXHRcdFx0XHRcdFx0XHRjb250aW51b3VzV29ybGQ6IGZhbHNlXG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9O1xuXHRcdHZtLm1heGJvdW5kcyA9IHtcblx0XHRcdHNvdXRoV2VzdDoge1xuXHRcdFx0XHRsYXQ6IDkwLFxuXHRcdFx0XHRsbmc6IDE4MFxuXHRcdFx0fSxcblx0XHRcdG5vcnRoRWFzdDoge1xuXHRcdFx0XHRsYXQ6IC05MCxcblx0XHRcdFx0bG5nOiAtMTgwXG5cdFx0XHR9XG5cdFx0fTtcblx0XHRsZWFmbGV0RGF0YS5nZXRNYXAoJ21hcCcpLnRoZW4oZnVuY3Rpb24gKG1hcCkge1xuXHRcdFx0dmFyIHVybCA9ICdodHRwOi8vdjIyMDE1MDUyODM1ODI1MzU4LnlvdXJ2c2VydmVyLm5ldDozMDAxL3NlcnZpY2VzL3Bvc3RnaXMvJyArIFZlY3RvcmxheWVyU2VydmljZS5nZXROYW1lKCkgKyAnL2dlb20vdmVjdG9yLXRpbGVzL3t6fS97eH0ve3l9LnBiZj9maWVsZHM9JyArIFZlY3RvcmxheWVyU2VydmljZS5maWVsZHMoKTsgLy9cblx0XHRcdHZhciBsYXllciA9IG5ldyBMLlRpbGVMYXllci5NVlRTb3VyY2Uoe1xuXHRcdFx0XHR1cmw6IHVybCxcblx0XHRcdFx0ZGVidWc6IGZhbHNlLFxuXHRcdFx0XHRjbGlja2FibGVMYXllcnM6IFtWZWN0b3JsYXllclNlcnZpY2UuZ2V0TmFtZSgpICsgJ19nZW9tJ10sXG5cdFx0XHRcdG11dGV4VG9nZ2xlOiB0cnVlLFxuXHRcdFx0XHRnZXRJREZvckxheWVyRmVhdHVyZTogZnVuY3Rpb24gKGZlYXR1cmUpIHtcblx0XHRcdFx0XHRyZXR1cm4gZmVhdHVyZS5wcm9wZXJ0aWVzLmlzb19hMjtcblx0XHRcdFx0fSxcblx0XHRcdFx0ZmlsdGVyOiBmdW5jdGlvbiAoZmVhdHVyZSwgY29udGV4dCkge1xuXG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdFx0bWFwLmFkZExheWVyKFZlY3RvcmxheWVyU2VydmljZS5zZXRMYXllcihsYXllcikpO1xuXHRcdFx0dmFyIGxhYmVsc0xheWVyID0gTC50aWxlTGF5ZXIoJ2h0dHBzOi8ve3N9LnRpbGVzLm1hcGJveC5jb20vdjQvbWFnbm9sby4wNjAyOWE5Yy97en0ve3h9L3t5fS5wbmc/YWNjZXNzX3Rva2VuPScgKyBhcGlLZXkse1xuXHRcdFx0XHRcdFx0bm9XcmFwOiB0cnVlLFxuXHRcdFx0XHRcdFx0Y29udGludW91c1dvcmxkOiBmYWxzZVxuXHRcdFx0fSk7XG5cdFx0XHRtYXAuYWRkTGF5ZXIobGFiZWxzTGF5ZXIpO1xuXHRcdFx0bGFiZWxzTGF5ZXIuYnJpbmdUb0Zyb250KCk7XG5cdFx0fSk7XG5cdH0pO1xufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ1NlbGVjdGVkQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgZ2V0Q291bnRyeSwgVmVjdG9ybGF5ZXJTZXJ2aWNlLCAkZmlsdGVyKXtcbiAgICAgICAgLy9cbiAgICAgICAgdmFyIHZtID0gdGhpcztcbiAgICAgICAgdm0uc3RydWN0dXJlID0gJHNjb3BlLiRwYXJlbnQudm0uc3RydWN0dXJlO1xuICAgICAgICB2bS5kaXNwbGF5ID0gJHNjb3BlLiRwYXJlbnQudm0uZGlzcGxheTtcbiAgICAgICAgdm0uZGF0YSA9ICRzY29wZS4kcGFyZW50LnZtLmRhdGE7XG4gICAgICAgIHZtLmN1cnJlbnQgPSBnZXRDb3VudHJ5O1xuICAgICAgICB2bS5tdnRTb3VyY2UgPSBWZWN0b3JsYXllclNlcnZpY2UuZ2V0TGF5ZXIoKTtcbiAgICAgICAgdm0uZ2V0UmFuayA9IGdldFJhbms7XG4gICAgICAgIHZtLmdldE9mZnNldCA9IGdldE9mZnNldDtcbiAgICAgICAgdm0uZ2V0VGVuZGVuY3kgPSBnZXRUZW5kZW5jeTtcblxuICAgICAgICBmdW5jdGlvbiBjYWxjUmFuaygpIHtcbiAgICAgICAgICB2YXIgcmFuayA9IDA7XG4gICAgICAgICAgYW5ndWxhci5mb3JFYWNoKHZtLmRhdGEsIGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgICAgICAgIGl0ZW1bdm0uc3RydWN0dXJlLnNjb3JlX2ZpZWxkX25hbWVdID0gcGFyc2VGbG9hdChpdGVtW3ZtLnN0cnVjdHVyZS5zY29yZV9maWVsZF9uYW1lXSk7XG4gICAgICAgICAgICBpdGVtWydzY29yZSddID0gcGFyc2VJbnQoaXRlbVsnc2NvcmUnXSk7XG4gICAgICAgICAgfSlcbiAgICAgICAgICB2YXIgZmlsdGVyID0gJGZpbHRlcignb3JkZXJCeScpKHZtLmRhdGEsIFt2bS5zdHJ1Y3R1cmUuc2NvcmVfZmllbGRfbmFtZSwgXCJzY29yZVwiXSwgdHJ1ZSk7XG4gICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBmaWx0ZXIubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChmaWx0ZXJbaV0uaXNvID09IHZtLmN1cnJlbnQuaXNvKSB7XG4gICAgICAgICAgICAgIHJhbmsgPSBpICsgMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgdm0uY3VycmVudFt2bS5zdHJ1Y3R1cmUuc2NvcmVfZmllbGRfbmFtZSsnX3JhbmsnXSA9IHJhbms7XG4gICAgICAgICAgdm0uY2lyY2xlT3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgY29sb3I6dm0uc3RydWN0dXJlLmNvbG9yLFxuICAgICAgICAgICAgICBmaWVsZDp2bS5zdHJ1Y3R1cmUuc2NvcmVfZmllbGRfbmFtZSsnX3JhbmsnXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGdldFJhbmsoY291bnRyeSl7XG4gICAgICAgICAgdmFyIGZpbHRlciA9ICRmaWx0ZXIoJ29yZGVyQnknKSh2bS5kYXRhLCBbdm0uc3RydWN0dXJlLnNjb3JlX2ZpZWxkX25hbWUsIFwic2NvcmVcIl0sIHRydWUpO1xuICAgICAgICAgIHZhciByYW5rID0gMDtcbiAgICAgICAgICBhbmd1bGFyLmZvckVhY2goZmlsdGVyLCBmdW5jdGlvbihpdGVtLCBrZXkpe1xuICAgICAgICAgICAgaWYoaXRlbS5jb3VudHJ5ID09IGNvdW50cnkuY291bnRyeSl7XG4gICAgICAgICAgICAgIHJhbmsgPSBrZXk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgcmV0dXJuIHJhbmsrMTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBnZXRPZmZzZXQoKSB7XG4gICAgXHRcdFx0aWYgKCF2bS5jdXJyZW50KSB7XG4gICAgXHRcdFx0XHRyZXR1cm4gMDtcbiAgICBcdFx0XHR9XG4gICAgXHRcdFx0cmV0dXJuICh2bS5nZXRSYW5rKHZtLmN1cnJlbnQpIC0gMikgKiAxNjtcbiAgICBcdFx0fTtcblxuICAgIFx0XHRmdW5jdGlvbiBnZXRUZW5kZW5jeSgpIHtcbiAgICBcdFx0XHRpZiAoIXZtLmN1cnJlbnQpIHtcbiAgICBcdFx0XHRcdHJldHVybiAnYXJyb3dfZHJvcF9kb3duJ1xuICAgIFx0XHRcdH1cbiAgICBcdFx0XHRyZXR1cm4gdm0uY3VycmVudC5wZXJjZW50X2NoYW5nZSA+IDAgPyAnYXJyb3dfZHJvcF91cCcgOiAnYXJyb3dfZHJvcF9kb3duJztcbiAgICBcdFx0fTtcblxuICAgICAgICAkc2NvcGUuJHdhdGNoKCd2bS5jdXJyZW50JywgZnVuY3Rpb24gKG4sIG8pIHtcbiAgICAgICAgICBpZiAobiA9PT0gbykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYoby5pc28pe1xuICAgICAgICAgICAgICB2bS5tdnRTb3VyY2UubGF5ZXJzLmNvdW50cmllc19iaWdfZ2VvbS5mZWF0dXJlc1tvLmlzb10uc2VsZWN0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhbGNSYW5rKCk7XG4gICAgICAgICAgICBmZXRjaE5hdGlvbkRhdGEobi5pc28pO1xuXG5cbiAgICAgICAgfSk7XG4gICAgICAgIC8qOyovXG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ1NpZGViYXJDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCAkc3RhdGUpe1xuXG5cblx0fSk7XG5cbn0pKCk7IiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignU2lnbnVwQ3RybCcsIGZ1bmN0aW9uKCl7XG4gICAgICAgIC8vXG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ1RvYXN0c0N0cmwnLCBmdW5jdGlvbigkc2NvcGUsIFRvYXN0U2VydmljZSl7XG5cblx0XHQkc2NvcGUudG9hc3RTdWNjZXNzID0gZnVuY3Rpb24oKXtcblx0XHRcdFRvYXN0U2VydmljZS5zaG93KCdVc2VyIGFkZGVkIHN1Y2Nlc3NmdWxseSEnKTtcblx0XHR9O1xuXG5cdFx0JHNjb3BlLnRvYXN0RXJyb3IgPSBmdW5jdGlvbigpe1xuXHRcdFx0VG9hc3RTZXJ2aWNlLmVycm9yKCdDb25uZWN0aW9uIGludGVycnVwdGVkIScpO1xuXHRcdH07XG5cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdVbnN1cHBvcnRlZEJyb3dzZXJDdHJsJywgZnVuY3Rpb24oKXtcbiAgICAgICAgLy9cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ1VzZXJDdHJsJywgZnVuY3Rpb24oKXtcbiAgICAgICAgLy9cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0FkZFVzZXJzQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgRGlhbG9nU2VydmljZSl7XG5cbiAgICAgICAgJHNjb3BlLnNhdmUgPSBmdW5jdGlvbigpe1xuXHQgICAgICAgIC8vZG8gc29tZXRoaW5nIHVzZWZ1bFxuICAgICAgICAgICAgRGlhbG9nU2VydmljZS5oaWRlKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgJHNjb3BlLmhpZGUgPSBmdW5jdGlvbigpe1xuICAgICAgICBcdERpYWxvZ1NlcnZpY2UuaGlkZSgpO1xuICAgICAgICB9O1xuXG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdDb3B5cHJvdmlkZXJDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBJbmRleFNlcnZpY2UsIERpYWxvZ1NlcnZpY2Upe1xuICAgICAgICAkc2NvcGUuJHBhcmVudC52bS5hc2tlZFRvUmVwbGljYXRlID0gdHJ1ZTtcbiAgICAgICAgJHNjb3BlLiRwYXJlbnQudm0uZG9Qcm92aWRlcnMgPSB0cnVlO1xuICAgICAgICAkc2NvcGUuJHBhcmVudC52bS5kb1N0eWxlID0gdHJ1ZTtcbiAgICAgICAgJHNjb3BlLiRwYXJlbnQudm0uZG9DYXRlZ29yaWVzID0gdHJ1ZTtcbiAgICAgICAgJHNjb3BlLiRwYXJlbnQudm0uZG9NZWFzdXJlcyA9IHRydWU7XG4gICAgICAgICRzY29wZS4kcGFyZW50LnZtLmRvUHVibGljID0gdHJ1ZTtcbiAgICAgICAgJHNjb3BlLnNhdmUgPSBmdW5jdGlvbigpe1xuXG4gICAgICAgICAgYW5ndWxhci5mb3JFYWNoKCRzY29wZS4kcGFyZW50LnZtLmRhdGFbMF0uZGF0YVswXSwgZnVuY3Rpb24oZGF0YSwga2V5KXtcbiAgICAgICAgICAgIGlmKHR5cGVvZiBJbmRleFNlcnZpY2UuZ2V0SW5kaWNhdG9yKGtleSkgPT0gXCJ1bmRlZmluZWRcIil7XG4gICAgICAgICAgICAgIEluZGV4U2VydmljZS5zZXRJbmRpY2F0b3Ioa2V5LHtcbiAgICAgICAgICAgICAgICBjb2x1bW5fbmFtZTprZXksXG4gICAgICAgICAgICAgICAgdGl0bGU6a2V5XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGl0ZW0gPSBJbmRleFNlcnZpY2UuZ2V0SW5kaWNhdG9yKGtleSk7XG4gICAgICAgICAgICBpZigkc2NvcGUuJHBhcmVudC52bS5kb1Byb3ZpZGVycyl7XG4gICAgICAgICAgICAgIGl0ZW0uZGF0YXByb3ZpZGVyID0gICRzY29wZS4kcGFyZW50LnZtLnByZVByb3ZpZGVyIDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmKCRzY29wZS4kcGFyZW50LnZtLmRvTWVhc3VyZXMpe1xuICAgICAgICAgICAgICAgIGl0ZW0ubWVhc3VyZV90eXBlX2lkID0gJHNjb3BlLiRwYXJlbnQudm0ucHJlTWVhc3VyZSA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZigkc2NvcGUuJHBhcmVudC52bS5kb0NhdGVnb3JpZXMpe1xuICAgICAgICAgICAgICAgIGl0ZW0uY2F0ZWdvcmllcyA9ICRzY29wZS4kcGFyZW50LnZtLnByZUNhdGVnb3JpZXM7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZigkc2NvcGUuJHBhcmVudC52bS5kb1B1YmxpYyl7XG4gICAgICAgICAgICAgIGl0ZW0uaXNfcHVibGljID0gICRzY29wZS4kcGFyZW50LnZtLnByZVB1YmxpYztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmKCRzY29wZS4kcGFyZW50LnZtLmRvU3R5bGUpe1xuXG4gICAgICAgICAgICAgIGlmKHR5cGVvZiBpdGVtLnN0eWxlICE9IFwidW5kZWZpbmVkXCIpe1xuICAgICAgICAgICAgICAgICAgICBpdGVtLnN0eWxlID0gJHNjb3BlLiRwYXJlbnQudm0ucHJlU3R5bGU7XG4gICAgICAgICAgICAgICAgaXRlbS5zdHlsZV9pZCA9ICRzY29wZS4kcGFyZW50LnZtLnByZVN0eWxlLmlkO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgICBJbmRleFNlcnZpY2Uuc2V0VG9Mb2NhbFN0b3JhZ2UoKTtcbiAgICAgICAgICBEaWFsb2dTZXJ2aWNlLmhpZGUoKTtcbiAgICAgICAgfTtcblxuICAgICAgICAkc2NvcGUuaGlkZSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgJHNjb3BlLiRwYXJlbnQudm0uZG9Qcm92aWRlcnMgPSBmYWxzZTtcbiAgICAgICAgICAkc2NvcGUuJHBhcmVudC52bS5kb0NhdGVnb3JpZXMgPSBmYWxzZTtcbiAgICAgICAgICAkc2NvcGUuJHBhcmVudC52bS5kb01lYXN1cmVzID0gZmFsc2U7XG4gICAgICAgIFx0RGlhbG9nU2VydmljZS5oaWRlKCk7XG4gICAgICAgIH07XG5cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0VkaXRjb2x1bW5DdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBEaWFsb2dTZXJ2aWNlKXtcbiAgICAgICAgJHNjb3BlLm5hbWUgPSAkc2NvcGUuJHBhcmVudC52bS50b0VkaXQ7XG4gICAgICAgIGlmKHR5cGVvZiAkc2NvcGUuJHBhcmVudC52bS5tZXRhLnRhYmxlWyRzY29wZS5uYW1lXSA9PSBcInVuZGVmaW5lZFwiKXtcbiAgICAgICAgICAkc2NvcGUuJHBhcmVudC52bS5tZXRhLnRhYmxlWyRzY29wZS5uYW1lXSA9IHt9O1xuICAgICAgICB9XG4gICAgICAgIGVsc2V7XG4gICAgICAgICAgaWYoJHNjb3BlLiRwYXJlbnQudm0ubWV0YS50YWJsZVskc2NvcGUubmFtZV0udGl0bGUpe1xuICAgICAgICAgICAgJHNjb3BlLnRpdGxlID0gJHNjb3BlLiRwYXJlbnQudm0ubWV0YS50YWJsZVskc2NvcGUubmFtZV0udGl0bGU7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmKCRzY29wZS4kcGFyZW50LnZtLm1ldGEudGFibGVbJHNjb3BlLm5hbWVdLmRlc2NyaXB0aW9uKXtcbiAgICAgICAgICAgICRzY29wZS5kZXNjcmlwdGlvbiA9ICRzY29wZS4kcGFyZW50LnZtLm1ldGEudGFibGVbJHNjb3BlLm5hbWVdLmRlc2NyaXB0aW9uO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgICRzY29wZS5zYXZlID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAkc2NvcGUuJHBhcmVudC52bS5tZXRhLnRhYmxlWyRzY29wZS5uYW1lXS50aXRsZSA9ICRzY29wZS50aXRsZTtcbiAgICAgICAgICAkc2NvcGUuJHBhcmVudC52bS5tZXRhLnRhYmxlWyRzY29wZS5uYW1lXS5kZXNjcmlwdGlvbiA9ICRzY29wZS5kZXNjcmlwdGlvbjtcbiAgICAgICAgICBEaWFsb2dTZXJ2aWNlLmhpZGUoKTtcbiAgICAgICAgfTtcblxuICAgICAgICAkc2NvcGUuaGlkZSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIFx0RGlhbG9nU2VydmljZS5oaWRlKCk7XG4gICAgICAgIH07XG5cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0VkaXRyb3dDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBEaWFsb2dTZXJ2aWNlKXtcbiAgICAgICAgJHNjb3BlLmRhdGEgPSAkc2NvcGUuJHBhcmVudC52bS5zZWxlY3RlZFswXTtcbiAgICAgICAgJHNjb3BlLnNhdmUgPSBmdW5jdGlvbigpe1xuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIERpYWxvZ1NlcnZpY2UuaGlkZSgpO1xuICAgICAgICB9O1xuXG4gICAgICAgICRzY29wZS5oaWRlID0gZnVuY3Rpb24oKXtcbiAgICAgICAgXHREaWFsb2dTZXJ2aWNlLmhpZGUoKTtcbiAgICAgICAgfTtcblxuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignRXh0ZW5kRGF0YUN0cmwnLCBmdW5jdGlvbigkc2NvcGUsJHN0YXRlLCBEaWFsb2dTZXJ2aWNlKXtcblxuICAgICAgICAkc2NvcGUuc2F2ZSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAkc2NvcGUudm0uZG9FeHRlbmQgPSB0cnVlO1xuICAgICAgICAgICAgJHNjb3BlLnZtLm1ldGEuaXNvX2ZpZWxkID0gJHNjb3BlLnZtLmFkZERhdGFUby5pc29fbmFtZTtcbiAgICAgICAgICAgICRzY29wZS52bS5tZXRhLmNvdW50cnlfZmllbGQgPSAkc2NvcGUudm0uYWRkRGF0YVRvLmNvdW50cnlfbmFtZTtcbiAgICAgICAgICAgICRzdGF0ZS5nbygnYXBwLmluZGV4LmNoZWNrJyk7XG4gICAgICAgICAgXHREaWFsb2dTZXJ2aWNlLmhpZGUoKTtcbiAgICAgICAgfTtcblxuICAgICAgICAkc2NvcGUuaGlkZSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgJHN0YXRlLmdvKCdhcHAuaW5kZXguY2hlY2snKTtcbiAgICAgICAgXHREaWFsb2dTZXJ2aWNlLmhpZGUoKTtcbiAgICAgICAgfTtcblxuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignTG9vc2VkYXRhQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgJHN0YXRlLCBEaWFsb2dTZXJ2aWNlKXtcblxuICAgICAgICAkc2NvcGUuc2F2ZSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgJHNjb3BlLnZtLmRlbGV0ZURhdGEoKTtcbiAgICAgICAgICAgICRzdGF0ZS5nbygkc2NvcGUudG9TdGF0ZS5uYW1lKTtcbiAgICAgICAgICAgIERpYWxvZ1NlcnZpY2UuaGlkZSgpO1xuICAgICAgICB9O1xuXG4gICAgICAgICRzY29wZS5oaWRlID0gZnVuY3Rpb24oKXtcbiAgICAgICAgXHREaWFsb2dTZXJ2aWNlLmhpZGUoKTtcbiAgICAgICAgfTtcblxuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ1NlbGVjdGlzb2ZldGNoZXJzQ3RybCcsIGZ1bmN0aW9uICgkc2NvcGUsIEluZGV4U2VydmljZSwgRGlhbG9nU2VydmljZSkge1xuXHRcdHZhciB2bSA9IHRoaXM7XG5cdFx0dmFyIG1ldGEgPSBJbmRleFNlcnZpY2UuZ2V0TWV0YSgpO1xuXHRcdHZtLmlzbyA9IG1ldGEuaXNvX2ZpZWxkO1xuXHRcdHZtLmxpc3QgPSBJbmRleFNlcnZpY2UuZ2V0VG9TZWxlY3QoKTtcblx0XHR2bS5zYXZlID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0RGlhbG9nU2VydmljZS5oaWRlKCk7XG5cdFx0fTtcblxuXHRcdHZtLmhpZGUgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHREaWFsb2dTZXJ2aWNlLmhpZGUoKTtcblx0XHR9O1xuXHRcdCRzY29wZS4kd2F0Y2goJ3ZtLmxpc3QnLCBmdW5jdGlvbiAobiwgbykge1xuXHRcdFx0aWYgKG4gPT09IG8pIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdFx0YW5ndWxhci5mb3JFYWNoKG4sIGZ1bmN0aW9uIChpdGVtLCBrZXkpIHtcblx0XHRcdFx0aWYgKGl0ZW0uZW50cnkuZGF0YVswXVt2bS5pc29dKSB7XG5cdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKGl0ZW0uZW50cnkuZXJyb3JzLCBmdW5jdGlvbiAoZXJyb3IsIGUpIHtcblx0XHRcdFx0XHRcdGlmIChlcnJvci50eXBlID09IDIgfHwgZXJyb3IudHlwZSA9PSAzKSB7XG5cdFx0XHRcdFx0XHRcdEluZGV4U2VydmljZS5yZWR1Y2VJc29FcnJvcigpO1xuXHRcdFx0XHRcdFx0XHRpdGVtLmVudHJ5LmVycm9ycy5zcGxpY2UoZSwgMSk7XG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKGVycm9yLnR5cGUgPT0gMSkge1xuXHRcdFx0XHRcdFx0XHRpZiAoZXJyb3IuY29sdW1uID09IHZtLmlzbykge1xuXHRcdFx0XHRcdFx0XHRcdEluZGV4U2VydmljZS5yZWR1Y2VFcnJvcigpO1xuXHRcdFx0XHRcdFx0XHRcdGl0ZW0uZW50cnkuZXJyb3JzLnNwbGljZShlLCAxKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdHZtLmxpc3Quc3BsaWNlKGtleSwgMSk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdFx0aWYgKHZtLmxpc3QubGVuZ3RoID09IDApIHtcblx0XHRcdFx0RGlhbG9nU2VydmljZS5oaWRlKCk7XG5cdFx0XHR9XG5cdFx0fSwgdHJ1ZSk7XG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCAnYXBwLmNvbnRyb2xsZXJzJyApLmNvbnRyb2xsZXIoICdCdWJibGVzQ3RybCcsIGZ1bmN0aW9uKCl7XG5cdFx0Ly9cblxuICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGZ1bmN0aW9uIEN1c3RvbVRvb2x0aXAodG9vbHRpcElkLCB3aWR0aCkge1xuXHRcdHZhciB0b29sdGlwSWQgPSB0b29sdGlwSWQ7XG5cdFx0dmFyIGVsZW0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0b29sdGlwSWQpO1xuXHRcdGlmKGVsZW0gPT0gbnVsbCl7XG5cdFx0XHRhbmd1bGFyLmVsZW1lbnQoZG9jdW1lbnQpLmZpbmQoJ2JvZHknKS5hcHBlbmQoXCI8ZGl2IGNsYXNzPSd0b29sdGlwIG1kLXdoaXRlZnJhbWUtejMnIGlkPSdcIiArIHRvb2x0aXBJZCArIFwiJz48L2Rpdj5cIik7XG5cdFx0fVxuXHRcdGhpZGVUb29sdGlwKCk7XG5cdFx0ZnVuY3Rpb24gc2hvd1Rvb2x0aXAoY29udGVudCwgZGF0YSwgZXZlbnQsIGVsZW1lbnQpIHtcblx0XHRcdGFuZ3VsYXIuZWxlbWVudChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjJyArIHRvb2x0aXBJZCkpLmh0bWwoY29udGVudCk7XG5cdFx0XHRhbmd1bGFyLmVsZW1lbnQoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignIycgKyB0b29sdGlwSWQpKS5jc3MoJ2Rpc3BsYXknLCAnYmxvY2snKTtcblxuXHRcdFx0cmV0dXJuIHVwZGF0ZVBvc2l0aW9uKGV2ZW50LCBkYXRhLCBlbGVtZW50KTtcblx0XHR9XG5cdFx0ZnVuY3Rpb24gaGlkZVRvb2x0aXAoKSB7XG5cdFx0XHRhbmd1bGFyLmVsZW1lbnQoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignIycgKyB0b29sdGlwSWQpKS5jc3MoJ2Rpc3BsYXknLCAnbm9uZScpO1xuXHRcdH1cblx0XHRmdW5jdGlvbiB1cGRhdGVQb3NpdGlvbihldmVudCwgZCwgZWxlbWVudCkge1xuXHRcdFx0dmFyIHR0aWQgPSBcIiNcIiArIHRvb2x0aXBJZDtcblx0XHRcdHZhciB4T2Zmc2V0ID0gMjA7XG5cdFx0XHR2YXIgeU9mZnNldCA9IDEwO1xuXHRcdFx0dmFyIHN2ZyA9IGVsZW1lbnQuZmluZCgnc3ZnJylbMF07Ly9kb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjc3ZnX3ZpcycpO1xuXHRcdFx0dmFyIHdzY3JZID0gd2luZG93LnNjcm9sbFk7XG5cdFx0XHR2YXIgdHR3ID0gYW5ndWxhci5lbGVtZW50KGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodHRpZCkpLm9mZnNldFdpZHRoO1xuXHRcdFx0dmFyIHR0aCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodHRpZCkub2Zmc2V0SGVpZ2h0O1xuXHRcdFx0dmFyIHR0dG9wID0gc3ZnLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcCArIGQueSAtIHR0aCAvIDI7XG5cdFx0XHR2YXIgdHRsZWZ0ID0gc3ZnLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmxlZnQgKyBkLnggKyBkLnJhZGl1cyArIDEyO1xuXHRcdFx0cmV0dXJuIGFuZ3VsYXIuZWxlbWVudChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHR0aWQpKS5jc3MoJ3RvcCcsIHR0dG9wICsgJ3B4JykuY3NzKCdsZWZ0JywgdHRsZWZ0ICsgJ3B4Jyk7XG5cdFx0fVxuXHRcdHJldHVybiB7XG5cdFx0XHRzaG93VG9vbHRpcDogc2hvd1Rvb2x0aXAsXG5cdFx0XHRoaWRlVG9vbHRpcDogaGlkZVRvb2x0aXAsXG5cdFx0XHR1cGRhdGVQb3NpdGlvbjogdXBkYXRlUG9zaXRpb25cblx0XHR9XG5cdH1cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5kaXJlY3RpdmVzJykuZGlyZWN0aXZlKCdidWJibGVzJywgZnVuY3Rpb24gKCRjb21waWxlLCBJY29uc1NlcnZpY2UpIHtcblx0XHR2YXIgZGVmYXVsdHM7XG5cdFx0ZGVmYXVsdHMgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHR3aWR0aDogMzAwLFxuXHRcdFx0XHRoZWlnaHQ6IDMwMCxcblx0XHRcdFx0bGF5b3V0X2dyYXZpdHk6IDAsXG5cdFx0XHRcdHNpemVmYWN0b3I6Myxcblx0XHRcdFx0dmlzOiBudWxsLFxuXHRcdFx0XHRmb3JjZTogbnVsbCxcblx0XHRcdFx0ZGFtcGVyOiAwLjA4NSxcblx0XHRcdFx0Y2lyY2xlczogbnVsbCxcblx0XHRcdFx0Ym9yZGVyczogdHJ1ZSxcblx0XHRcdFx0bGFiZWxzOiB0cnVlLFxuXHRcdFx0XHRmaWxsX2NvbG9yOiBkMy5zY2FsZS5vcmRpbmFsKCkuZG9tYWluKFtcImVoXCIsIFwiZXZcIl0pLnJhbmdlKFtcIiNhMzEwMzFcIiwgXCIjYmVjY2FlXCJdKSxcblx0XHRcdFx0bWF4X2Ftb3VudDogJycsXG5cdFx0XHRcdHJhZGl1c19zY2FsZTogJycsXG5cdFx0XHRcdGR1cmF0aW9uOiAxMDAwLFxuXHRcdFx0XHR0b29sdGlwOiBDdXN0b21Ub29sdGlwKFwiYnViYmxlc190b29sdGlwXCIsIDI0MClcblx0XHRcdH07XG5cdFx0fTtcblx0XHRyZXR1cm4ge1xuXHRcdFx0cmVzdHJpY3Q6ICdFJyxcblx0XHRcdHNjb3BlOiB7XG5cdFx0XHRcdGNoYXJ0ZGF0YTogJz0nLFxuXHRcdFx0XHRkaXJlY3Rpb246ICc9Jyxcblx0XHRcdFx0Z3Jhdml0eTogJz0nLFxuXHRcdFx0XHRzaXplZmFjdG9yOiAnPScsXG5cdFx0XHRcdGluZGV4ZXI6ICc9Jyxcblx0XHRcdFx0Ym9yZGVyczogJ0AnXG5cdFx0XHR9LFxuXHRcdFx0cmVxdWlyZTogJ25nTW9kZWwnLFxuXHRcdFx0bGluazogZnVuY3Rpb24gKHNjb3BlLCBlbGVtLCBhdHRycywgbmdNb2RlbCkge1xuXHRcdFx0XHR2YXIgb3B0aW9ucyA9IGFuZ3VsYXIuZXh0ZW5kKGRlZmF1bHRzKCksIGF0dHJzKTtcblx0XHRcdFx0dmFyIG5vZGVzID0gW10sXG5cdFx0XHRcdFx0bGlua3MgPSBbXSxcblx0XHRcdFx0XHRsYWJlbHMgPSBbXSxcblx0XHRcdFx0XHRncm91cHMgPSBbXTtcblxuXHRcdFx0XHR2YXIgbWF4X2Ftb3VudCA9IGQzLm1heChzY29wZS5jaGFydGRhdGEsIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHBhcnNlRmxvYXQoZC52YWx1ZSk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHQvL29wdGlvbnMuaGVpZ2h0ID0gb3B0aW9ucy53aWR0aCAqIDEuMTtcblx0XHRcdFx0b3B0aW9ucy5yYWRpdXNfc2NhbGUgPSBkMy5zY2FsZS5wb3coKS5leHBvbmVudCgwLjUpLmRvbWFpbihbMCwgbWF4X2Ftb3VudF0pLnJhbmdlKFsyLCA4NV0pO1xuXHRcdFx0XHRvcHRpb25zLmNlbnRlciA9IHtcblx0XHRcdFx0XHR4OiBvcHRpb25zLndpZHRoIC8gMixcblx0XHRcdFx0XHR5OiBvcHRpb25zLmhlaWdodCAvIDJcblx0XHRcdFx0fTtcblx0XHRcdFx0b3B0aW9ucy5jYXRfY2VudGVycyA9IHt9O1xuXG5cdFx0XHRcdHZhciBjcmVhdGVfbm9kZXMgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0aWYoc2NvcGUuaW5kZXhlci5jaGlsZHJlbi5sZW5ndGggPT0gMiAmJiBzY29wZS5pbmRleGVyLmNoaWxkcmVuWzBdLmNoaWxkcmVuLmxlbmd0aCA+IDApe1xuXHRcdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKHNjb3BlLmluZGV4ZXIuY2hpbGRyZW4sIGZ1bmN0aW9uIChncm91cCwgaW5kZXgpIHtcblx0XHRcdFx0XHRcdFx0dmFyIGQgPSB7XG5cdFx0XHRcdFx0XHRcdFx0dHlwZTogZ3JvdXAubmFtZSxcblx0XHRcdFx0XHRcdFx0XHRuYW1lOiBncm91cC50aXRsZSxcblx0XHRcdFx0XHRcdFx0XHRncm91cDogZ3JvdXAubmFtZSxcblx0XHRcdFx0XHRcdFx0XHRjb2xvcjogZ3JvdXAuY29sb3IsXG5cdFx0XHRcdFx0XHRcdFx0aWNvbjogZ3JvdXAuaWNvbixcblx0XHRcdFx0XHRcdFx0XHR1bmljb2RlOiBJY29uc1NlcnZpY2UuZ2V0VW5pY29kZShncm91cC5pY29uKSxcblx0XHRcdFx0XHRcdFx0XHRkYXRhOiBncm91cCxcblx0XHRcdFx0XHRcdFx0XHRjaGlsZHJlbjpncm91cC5jaGlsZHJlblxuXHRcdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdFx0XHRsYWJlbHMucHVzaChkKTtcblx0XHRcdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKGdyb3VwLmNoaWxkcmVuLCBmdW5jdGlvbiAoaXRlbSkge1xuXHRcdFx0XHRcdFx0XHRcdGlmIChzY29wZS5jaGFydGRhdGFbaXRlbS5uYW1lXSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0dmFyIG5vZGUgPSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHR5cGU6IGl0ZW0ubmFtZSxcblx0XHRcdFx0XHRcdFx0XHRcdFx0cmFkaXVzOiBzY29wZS5jaGFydGRhdGFbaXRlbS5uYW1lXSAvIHNjb3BlLnNpemVmYWN0b3IsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHZhbHVlOiBzY29wZS5jaGFydGRhdGFbaXRlbS5uYW1lXSxcblx0XHRcdFx0XHRcdFx0XHRcdFx0bmFtZTogaXRlbS50aXRsZSxcblx0XHRcdFx0XHRcdFx0XHRcdFx0Z3JvdXA6IGdyb3VwLm5hbWUsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHg6IG9wdGlvbnMuY2VudGVyLngsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHk6IG9wdGlvbnMuY2VudGVyLnksXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGNvbG9yOiBpdGVtLmNvbG9yLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpY29uOiBpdGVtLmljb24sXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHVuaWNvZGU6IEljb25zU2VydmljZS5nZXRVbmljb2RlKGl0ZW0uaWNvbiksXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGRhdGE6IGl0ZW0sXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGNoaWxkcmVuOml0ZW1cblx0XHRcdFx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0XHRcdFx0XHRub2Rlcy5wdXNoKG5vZGUpO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdGNyZWF0ZV9ncm91cHMoKTtcblxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNle1xuXHRcdFx0XHRcdFx0dmFyIGQgPSB7XG5cdFx0XHRcdFx0XHRcdHR5cGU6IHNjb3BlLmluZGV4ZXIubmFtZSxcblx0XHRcdFx0XHRcdFx0bmFtZTogc2NvcGUuaW5kZXhlci50aXRsZSxcblx0XHRcdFx0XHRcdFx0Z3JvdXA6IHNjb3BlLmluZGV4ZXIubmFtZSxcblx0XHRcdFx0XHRcdFx0Y29sb3I6IHNjb3BlLmluZGV4ZXIuY29sb3IsXG5cdFx0XHRcdFx0XHRcdGljb246IHNjb3BlLmluZGV4ZXIuaWNvbixcblx0XHRcdFx0XHRcdFx0dW5pY29kZTogc2NvcGUuaW5kZXhlci51bmljb2RlLFxuXHRcdFx0XHRcdFx0XHRkYXRhOiBzY29wZS5pbmRleGVyLmRhdGEsXG5cdFx0XHRcdFx0XHRcdGNoaWxkcmVuOiBzY29wZS5pbmRleGVyLmNoaWxkcmVuXG5cdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdFx0bGFiZWxzLnB1c2goZCk7XG5cdFx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2goc2NvcGUuaW5kZXhlci5jaGlsZHJlbiwgZnVuY3Rpb24gKGl0ZW0pIHtcblx0XHRcdFx0XHRcdFx0aWYgKHNjb3BlLmNoYXJ0ZGF0YVtpdGVtLm5hbWVdKSB7XG5cdFx0XHRcdFx0XHRcdFx0dmFyIG5vZGUgPSB7XG5cdFx0XHRcdFx0XHRcdFx0XHR0eXBlOiBpdGVtLm5hbWUsXG5cdFx0XHRcdFx0XHRcdFx0XHRyYWRpdXM6IHNjb3BlLmNoYXJ0ZGF0YVtpdGVtLm5hbWVdIC8gc2NvcGUuc2l6ZWZhY3Rvcixcblx0XHRcdFx0XHRcdFx0XHRcdHZhbHVlOiBzY29wZS5jaGFydGRhdGFbaXRlbS5uYW1lXSAvIHNjb3BlLnNpemVmYWN0b3IsXG5cdFx0XHRcdFx0XHRcdFx0XHRuYW1lOiBpdGVtLnRpdGxlLFxuXHRcdFx0XHRcdFx0XHRcdFx0Z3JvdXA6IHNjb3BlLmluZGV4ZXIubmFtZSxcblx0XHRcdFx0XHRcdFx0XHRcdHg6IG9wdGlvbnMuY2VudGVyLngsXG5cdFx0XHRcdFx0XHRcdFx0XHR5OiBvcHRpb25zLmNlbnRlci55LFxuXHRcdFx0XHRcdFx0XHRcdFx0Y29sb3I6IGl0ZW0uY29sb3IsXG5cdFx0XHRcdFx0XHRcdFx0XHRpY29uOiBpdGVtLmljb24sXG5cdFx0XHRcdFx0XHRcdFx0XHR1bmljb2RlOiBJY29uc1NlcnZpY2UuZ2V0VW5pY29kZShpdGVtLmljb24pLFxuXHRcdFx0XHRcdFx0XHRcdFx0ZGF0YTogaXRlbSxcblx0XHRcdFx0XHRcdFx0XHRcdGNoaWxkcmVuOml0ZW1cblx0XHRcdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdFx0XHRcdG5vZGVzLnB1c2gobm9kZSk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fTtcblx0XHRcdFx0dmFyIGNsZWFyX25vZGVzID0gZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRub2RlcyA9IFtdO1xuXHRcdFx0XHRcdGxhYmVscyA9IFtdO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHZhciBjcmVhdGVfZ3JvdXBzID0gZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2gobm9kZXMsIGZ1bmN0aW9uKG5vZGUsIGtleSl7XG5cdFx0XHRcdFx0XHRcdG9wdGlvbnMuY2F0X2NlbnRlcnNbbm9kZS5ncm91cF0gPSB7XG5cdFx0XHRcdFx0XHRcdFx0eDogb3B0aW9ucy53aWR0aCAvIDIsXG5cdFx0XHRcdFx0XHRcdFx0eTogb3B0aW9ucy5oZWlnaHQgLyAyICsgKDEgLSBrZXkpLFxuXHRcdFx0XHRcdFx0XHRcdGRhbXBlcjogMC4wODUsXG5cdFx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH07XG5cdFx0XHRcdHZhciBjcmVhdGVfdmlzID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdGFuZ3VsYXIuZWxlbWVudChlbGVtKS5odG1sKCcnKTtcblx0XHRcdFx0XHRvcHRpb25zLnZpcyA9IGQzLnNlbGVjdChlbGVtWzBdKS5hcHBlbmQoXCJzdmdcIikuYXR0cihcIndpZHRoXCIsIG9wdGlvbnMud2lkdGgpLmF0dHIoXCJoZWlnaHRcIiwgb3B0aW9ucy5oZWlnaHQpLmF0dHIoXCJpZFwiLCBcInN2Z192aXNcIik7XG5cblx0XHRcdFx0XHRpZiAoIW9wdGlvbnMuYm9yZGVycykge1xuXHRcdFx0XHRcdFx0dmFyIHBpID0gTWF0aC5QSTtcblx0XHRcdFx0XHRcdGlmKGxhYmVscy5sZW5ndGggPT0gMil7XG5cdFx0XHRcdFx0XHRcdHZhciBhcmNUb3AgPSBkMy5zdmcuYXJjKClcblx0XHRcdFx0XHRcdFx0XHQuaW5uZXJSYWRpdXMoMTA5KVxuXHRcdFx0XHRcdFx0XHRcdC5vdXRlclJhZGl1cygxMTApXG5cdFx0XHRcdFx0XHRcdFx0LnN0YXJ0QW5nbGUoLTkwICogKHBpIC8gMTgwKSkgLy9jb252ZXJ0aW5nIGZyb20gZGVncyB0byByYWRpYW5zXG5cdFx0XHRcdFx0XHRcdFx0LmVuZEFuZ2xlKDkwICogKHBpIC8gMTgwKSk7IC8vanVzdCByYWRpYW5zXG5cdFx0XHRcdFx0XHRcdHZhciBhcmNCb3R0b20gPSBkMy5zdmcuYXJjKClcblx0XHRcdFx0XHRcdFx0XHQuaW5uZXJSYWRpdXMoMTM0KVxuXHRcdFx0XHRcdFx0XHRcdC5vdXRlclJhZGl1cygxMzUpXG5cdFx0XHRcdFx0XHRcdFx0LnN0YXJ0QW5nbGUoOTAgKiAocGkgLyAxODApKSAvL2NvbnZlcnRpbmcgZnJvbSBkZWdzIHRvIHJhZGlhbnNcblx0XHRcdFx0XHRcdFx0XHQuZW5kQW5nbGUoMjcwICogKHBpIC8gMTgwKSk7IC8vanVzdCByYWRpYW5zXG5cblx0XHRcdFx0XHRcdFx0b3B0aW9ucy5hcmNUb3AgPSBvcHRpb25zLnZpcy5hcHBlbmQoXCJwYXRoXCIpXG5cdFx0XHRcdFx0XHRcdFx0LmF0dHIoXCJkXCIsIGFyY1RvcClcblx0XHRcdFx0XHRcdFx0XHQuYXR0cihcImZpbGxcIiwgZnVuY3Rpb24oZCl7XG5cdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gbGFiZWxzWzBdLmNvbG9yIHx8IFwiI2JlNWYwMFwiO1xuXHRcdFx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0XHRcdFx0LmF0dHIoXCJpZFwiLCBcImFyY1RvcFwiKVxuXHRcdFx0XHRcdFx0XHRcdC5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiKyhvcHRpb25zLndpZHRoLzIpK1wiLFwiKyhvcHRpb25zLmhlaWdodC8yIC0gb3B0aW9ucy5oZWlnaHQvMTIpK1wiKVwiKTtcblx0XHRcdFx0XHRcdFx0b3B0aW9ucy5hcmNCb3R0b20gPSBvcHRpb25zLnZpcy5hcHBlbmQoXCJwYXRoXCIpXG5cdFx0XHRcdFx0XHRcdFx0LmF0dHIoXCJkXCIsIGFyY0JvdHRvbSlcblx0XHRcdFx0XHRcdFx0XHQuYXR0cihcImlkXCIsIFwiYXJjQm90dG9tXCIpXG5cdFx0XHRcdFx0XHRcdFx0LmF0dHIoXCJmaWxsXCIsIGZ1bmN0aW9uKGQpe1xuXHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIGxhYmVsc1sxXS5jb2xvciB8fCBcIiMwMDZiYjZcIjtcblx0XHRcdFx0XHRcdFx0XHR9IClcblx0XHRcdFx0XHRcdFx0XHQuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIisob3B0aW9ucy53aWR0aC8yKStcIixcIisob3B0aW9ucy5oZWlnaHQvMikrXCIpXCIpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0ZWxzZXtcblx0XHRcdFx0XHRcdFx0dmFyIGFyYyA9IGQzLnN2Zy5hcmMoKVxuXHRcdFx0XHRcdFx0XHRcdC5pbm5lclJhZGl1cyhvcHRpb25zLndpZHRoLzMgLSAxKVxuXHRcdFx0XHRcdFx0XHRcdC5vdXRlclJhZGl1cyhvcHRpb25zLndpZHRoLzMpXG5cdFx0XHRcdFx0XHRcdFx0LnN0YXJ0QW5nbGUoMCAqIChwaSAvIDE4MCkpIC8vY29udmVydGluZyBmcm9tIGRlZ3MgdG8gcmFkaWFuc1xuXHRcdFx0XHRcdFx0XHRcdC5lbmRBbmdsZSgzNjAgKiAocGkgLyAxODApKTsgLy9qdXN0IHJhZGlhbnNcblxuXG5cdFx0XHRcdFx0XHRcdG9wdGlvbnMuYXJjID0gb3B0aW9ucy52aXMuYXBwZW5kKFwicGF0aFwiKVxuXHRcdFx0XHRcdFx0XHRcdC5hdHRyKFwiZFwiLCBhcmMpXG5cdFx0XHRcdFx0XHRcdFx0LmF0dHIoXCJmaWxsXCIsIGxhYmVsc1swXS5jb2xvcilcblx0XHRcdFx0XHRcdFx0XHQuYXR0cihcImlkXCIsIFwiYXJjVG9wXCIpXG5cdFx0XHRcdFx0XHRcdFx0LmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIrKG9wdGlvbnMud2lkdGgvMikrXCIsXCIrKG9wdGlvbnMuaGVpZ2h0LzIpK1wiKVwiKTtcblxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0aWYob3B0aW9ucy5sYWJlbHMgPT0gdHJ1ZSAmJiBsYWJlbHMubGVuZ3RoID09IDIpe1xuXHRcdFx0XHRcdFx0dmFyIHRleHRMYWJlbHMgPSBvcHRpb25zLnZpcy5zZWxlY3RBbGwoJ3RleHQubGFiZWxzJykuZGF0YShsYWJlbHMpLmVudGVyKCkuYXBwZW5kKFwidGV4dFwiKVxuXHRcdFx0XHRcdFx0XHQuYXR0cignY2xhc3MnLCAnbGFiZWxzJylcblx0XHRcdFx0XHRcdFx0LmF0dHIoJ2ZpbGwnLCBmdW5jdGlvbihkKXtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gZC5jb2xvcjtcblx0XHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRcdC8qXHQuYXR0cigndHJhbnNmb3JtJywgZnVuY3Rpb24oZCl7XG5cdFx0XHRcdFx0XHRcdFx0dmFyIGluZGV4ID0gbGFiZWxzLmluZGV4T2YoZCk7XG5cdFx0XHRcdFx0XHRcdFx0aWYoaW5kZXggPiAwKXtcblx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiAncm90YXRlKDkwLCAxMDAsIDEwMCknO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fSkqL1xuXHRcdFx0XHRcdFx0XHQuYXR0cigneCcsIFwiNTAlXCIpXG5cdFx0XHRcdFx0XHRcdC5zdHlsZSgnZm9udC1zaXplJywgJzEuMmVtJylcblx0XHRcdFx0XHRcdFx0LnN0eWxlKCdjdXJzb3InLCAncG9pbnRlcicpXG5cblx0XHRcdFx0XHRcdFx0LmF0dHIoJ3dpZHRoJywgb3B0aW9ucy53aWR0aClcblx0XHRcdFx0XHRcdFx0LmF0dHIoJ3RleHQtYW5jaG9yJywgJ21pZGRsZScpXG5cdFx0XHRcdFx0XHRcdC5vbignY2xpY2snLCBmdW5jdGlvbihkKXtcblx0XHRcdFx0XHRcdFx0XHRuZ01vZGVsLiRzZXRWaWV3VmFsdWUoZC5kYXRhKTtcblx0XHRcdFx0XHRcdFx0XHRuZ01vZGVsLiRyZW5kZXIoKTtcblx0XHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRcdFx0LmF0dHIoXCJ5XCIsIGZ1bmN0aW9uKGQpe1xuXHRcdFx0XHRcdFx0XHRcdHZhciBpbmRleCA9IGxhYmVscy5pbmRleE9mKGQpO1xuXHRcdFx0XHRcdFx0XHRcdGlmKGluZGV4ID09IDApe1xuXHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIDE1O1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRlbHNle1xuXHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIG9wdGlvbnMuaGVpZ2h0IC0gNjtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0XHRcdC50ZXh0KGZ1bmN0aW9uKGQpe1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBkLm5hbWU7XG5cdFx0XHRcdFx0XHRcdH0pXG5cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0b3B0aW9ucy5jb250YWluZXJzID0gb3B0aW9ucy52aXMuc2VsZWN0QWxsKCdnLm5vZGUnKS5kYXRhKG5vZGVzKS5lbnRlcigpLmFwcGVuZCgnZycpLmF0dHIoJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoJyArIChvcHRpb25zLndpZHRoIC8gMikgKyAnLCcgKyAob3B0aW9ucy5oZWlnaHQgLyAyKSArICcpJykuYXR0cignY2xhc3MnLCAnbm9kZScpO1xuXG5cdFx0XHRcdFx0LypvcHRpb25zLmNpcmNsZXMgPSBvcHRpb25zLmNvbnRhaW5lcnMuc2VsZWN0QWxsKFwiY2lyY2xlXCIpLmRhdGEobm9kZXMsIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZC5pZDtcblx0XHRcdFx0XHR9KTsqL1xuXG5cdFx0XHRcdFx0b3B0aW9ucy5jaXJjbGVzID0gb3B0aW9ucy5jb250YWluZXJzLmFwcGVuZChcImNpcmNsZVwiKS5hdHRyKFwiclwiLCAwKS5hdHRyKFwiZmlsbFwiLCAoZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdHJldHVybiBkLmNvbG9yIHx8IG9wdGlvbnMuZmlsbF9jb2xvcihkLmdyb3VwKTtcblx0XHRcdFx0XHR9KSkuYXR0cihcInN0cm9rZS13aWR0aFwiLCAwKS5hdHRyKFwic3Ryb2tlXCIsIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZDMucmdiKG9wdGlvbnMuZmlsbF9jb2xvcihkLmdyb3VwKSkuZGFya2VyKCk7XG5cdFx0XHRcdFx0fSkuYXR0cihcImlkXCIsIGZ1bmN0aW9uIChkKSB7XG5cdFxuXHRcdFx0XHRcdFx0cmV0dXJuIFwiYnViYmxlX1wiICsgZC50eXBlO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdG9wdGlvbnMuaWNvbnMgPSBvcHRpb25zLmNvbnRhaW5lcnMuYXBwZW5kKFwidGV4dFwiKVxuXHRcdFx0XHRcdFx0LmF0dHIoJ2ZvbnQtZmFtaWx5JywgJ0VQSScpXG5cdFx0XHRcdFx0XHQuYXR0cignZm9udC1zaXplJywgZnVuY3Rpb24gKGQpIHtcblxuXHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRcdC5hdHRyKFwidGV4dC1hbmNob3JcIiwgXCJtaWRkbGVcIilcblx0XHRcdFx0XHRcdC5hdHRyKCdmaWxsJywgZnVuY3Rpb24oZCl7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBkLnVuaWNvZGUgPyAnI2ZmZicgOiBkLmNvbG9yO1xuXHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRcdC5zdHlsZSgnb3BhY2l0eScsIGZ1bmN0aW9uKGQpe1xuXHRcdFx0XHRcdFx0XHRpZihkLnVuaWNvZGUpe1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybiAxO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdGVsc2V7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIDA7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0XHQudGV4dChmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gZC51bmljb2RlIHx8ICcxJ1xuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0b3B0aW9ucy5pY29ucy5vbihcIm1vdXNlb3ZlclwiLCBmdW5jdGlvbiAoZCwgaSkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIHNob3dfZGV0YWlscyhkLCBpLCB0aGlzKTtcblx0XHRcdFx0XHR9KS5vbihcIm1vdXNlb3V0XCIsIGZ1bmN0aW9uIChkLCBpKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gaGlkZV9kZXRhaWxzKGQsIGksIHRoaXMpO1xuXHRcdFx0XHRcdH0pLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24gKGQsIGkpIHtcblxuXHRcdFx0XHRcdFx0bmdNb2RlbC4kc2V0Vmlld1ZhbHVlKGQuZGF0YSk7XG5cdFx0XHRcdFx0XHRuZ01vZGVsLiRyZW5kZXIoKTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRvcHRpb25zLmNpcmNsZXMudHJhbnNpdGlvbigpLmR1cmF0aW9uKG9wdGlvbnMuZHVyYXRpb24pLmF0dHIoXCJyXCIsIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZC5yYWRpdXM7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0b3B0aW9ucy5pY29ucy50cmFuc2l0aW9uKCkuZHVyYXRpb24ob3B0aW9ucy5kdXJhdGlvbikuYXR0cihcImZvbnQtc2l6ZVwiLCBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGQucmFkaXVzICogMS43NSArICdweCc7XG5cdFx0XHRcdFx0fSkuYXR0cigneScsIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZC5yYWRpdXMgKiAuNzUgKyAncHgnO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9O1xuXHRcdFx0XHR2YXIgdXBkYXRlX3ZpcyA9IGZ1bmN0aW9uICgpIHtcblxuXHRcdFx0XHRcdG5vZGVzLmZvckVhY2goZnVuY3Rpb24gKGQsIGkpIHtcblx0XHRcdFx0XHRcdG9wdGlvbnMuY2lyY2xlcy50cmFuc2l0aW9uKCkuZHVyYXRpb24ob3B0aW9ucy5kdXJhdGlvbikuZGVsYXkoaSAqIG9wdGlvbnMuZHVyYXRpb24pXG5cdFx0XHRcdFx0XHRcdC5hdHRyKFwiclwiLCBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0XHRcdGQucmFkaXVzID0gZC52YWx1ZSA9IHNjb3BlLmNoYXJ0ZGF0YVtkLnR5cGVdIC8gc2NvcGUuc2l6ZWZhY3Rvcjtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gc2NvcGUuY2hhcnRkYXRhW2QudHlwZV0gLyBzY29wZS5zaXplZmFjdG9yO1xuXHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdG9wdGlvbnMuaWNvbnMudHJhbnNpdGlvbigpLmR1cmF0aW9uKG9wdGlvbnMuZHVyYXRpb24pLmRlbGF5KGkgKiBvcHRpb25zLmR1cmF0aW9uKVxuXHRcdFx0XHRcdFx0XHQuYXR0cihcImZvbnQtc2l6ZVwiLCBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybiAoc2NvcGUuY2hhcnRkYXRhW2QudHlwZV0gLyBzY29wZS5zaXplZmFjdG9yKSAqIDEuNzUgKyAncHgnXG5cdFx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0XHRcdC5hdHRyKCd5JywgZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gKHNjb3BlLmNoYXJ0ZGF0YVtkLnR5cGVdIC8gc2NvcGUuc2l6ZWZhY3RvcikgKiAuNzUgKyAncHgnO1xuXHRcdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9O1xuXHRcdFx0XHR2YXIgY2hhcmdlID0gZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRyZXR1cm4gLU1hdGgucG93KGQucmFkaXVzLCAyLjApIC8gNDtcblx0XHRcdFx0fTtcblx0XHRcdFx0dmFyIHN0YXJ0ID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdHJldHVybiBvcHRpb25zLmZvcmNlID0gZDMubGF5b3V0LmZvcmNlKCkubm9kZXMobm9kZXMpLnNpemUoW29wdGlvbnMud2lkdGgsIG9wdGlvbnMuaGVpZ2h0XSkubGlua3MobGlua3MpO1xuXHRcdFx0XHR9O1xuXHRcdFx0XHR2YXIgZGlzcGxheV9ncm91cF9hbGwgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0b3B0aW9ucy5mb3JjZS5ncmF2aXR5KG9wdGlvbnMubGF5b3V0X2dyYXZpdHkpLmNoYXJnZShjaGFyZ2UpLmZyaWN0aW9uKDAuODUpLm9uKFwidGlja1wiLCBmdW5jdGlvbiAoZSkge1xuXHRcdFx0XHRcdFx0b3B0aW9ucy5jb250YWluZXJzLmVhY2gobW92ZV90b3dhcmRzX2NlbnRlcihlLmFscGhhKSkuYXR0cihcInRyYW5zZm9ybVwiLCBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gJ3RyYW5zbGF0ZSgnICsgZC54ICsgJywnICsgZC55ICsgJyknO1xuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0b3B0aW9ucy5mb3JjZS5zdGFydCgpO1xuXHRcdFx0XHR9O1xuXHRcdFx0XHR2YXIgZGlzcGxheV9ieV9jYXQgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0b3B0aW9ucy5mb3JjZS5ncmF2aXR5KG9wdGlvbnMubGF5b3V0X2dyYXZpdHkpLmNoYXJnZShjaGFyZ2UpLmZyaWN0aW9uKDAuOSkub24oXCJ0aWNrXCIsIGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdFx0XHRvcHRpb25zLmNvbnRhaW5lcnMuZWFjaChtb3ZlX3Rvd2FyZHNfY2F0KGUuYWxwaGEpKS5hdHRyKFwidHJhbnNmb3JtXCIsIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiAndHJhbnNsYXRlKCcgKyBkLnggKyAnLCcgKyBkLnkgKyAnKSc7XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRvcHRpb25zLmZvcmNlLnN0YXJ0KCk7XG5cdFx0XHRcdH07XG5cdFx0XHRcdHZhciBtb3ZlX3Rvd2FyZHNfY2VudGVyID0gZnVuY3Rpb24gKGFscGhhKSB7XG5cdFx0XHRcdFx0cmV0dXJuIChmdW5jdGlvbiAoX3RoaXMpIHtcblx0XHRcdFx0XHRcdHJldHVybiBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0XHRkLnggPSBkLnggKyAob3B0aW9ucy53aWR0aC8yIC0gZC54KSAqIChvcHRpb25zLmRhbXBlciArIDAuMDIpICogYWxwaGEgKjEuMjU7XG5cdFx0XHRcdFx0XHRcdGQueSA9IGQueSArIChvcHRpb25zLmhlaWdodC8yIC0gZC55KSAqIChvcHRpb25zLmRhbXBlciArIDAuMDIpICogYWxwaGEgKiAxLjI1O1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pKHRoaXMpO1xuXHRcdFx0XHR9O1xuXHRcdFx0XHR2YXIgbW92ZV90b3dhcmRzX3RvcCA9IGZ1bmN0aW9uIChhbHBoYSkge1xuXHRcdFx0XHRcdHJldHVybiAoZnVuY3Rpb24gKF90aGlzKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdFx0ZC54ID0gZC54ICsgKG9wdGlvbnMuY2VudGVyLnggLSBkLngpICogKG9wdGlvbnMuZGFtcGVyICsgMC4wMikgKiBhbHBoYSAqIDEuMTtcblx0XHRcdFx0XHRcdFx0ZC55ID0gZC55ICsgKDIwMCAtIGQueSkgKiAob3B0aW9ucy5kYW1wZXIgKyAwLjAyKSAqIGFscGhhICogMS4xO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pKHRoaXMpO1xuXHRcdFx0XHR9O1xuXHRcdFx0XHR2YXIgbW92ZV90b3dhcmRzX2NhdCA9IGZ1bmN0aW9uIChhbHBoYSkge1xuXHRcdFx0XHRcdHJldHVybiAoZnVuY3Rpb24gKF90aGlzKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZnVuY3Rpb24gKGQpIHtcblxuXHRcdFx0XHRcdFx0XHR2YXIgdGFyZ2V0O1xuXHRcdFx0XHRcdFx0XHR0YXJnZXQgPSBvcHRpb25zLmNhdF9jZW50ZXJzW2QuZ3JvdXBdO1xuXHRcdFx0XHRcdFx0XHRkLnggPSBkLnggKyAodGFyZ2V0LnggLSBkLngpICogKHRhcmdldC5kYW1wZXIgKyAwLjAyKSAqIGFscGhhICogMTtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGQueSA9IGQueSArICh0YXJnZXQueSAtIGQueSkgKiAodGFyZ2V0LmRhbXBlciArIDAuMDIpICogYWxwaGEgKiAxO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pKHRoaXMpO1xuXHRcdFx0XHR9O1xuXHRcdFx0XHR2YXIgc2hvd19kZXRhaWxzID0gZnVuY3Rpb24gKGRhdGEsIGksIGVsZW1lbnQpIHtcblx0XHRcdFx0XHR2YXIgY29udGVudDtcblx0XHRcdFx0XHRjb250ZW50ID0gXCI8c3BhbiBjbGFzcz1cXFwidGl0bGVcXFwiPlwiICsgZGF0YS5uYW1lICsgXCI8L3NwYW4+PGJyLz5cIjtcblx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2goZGF0YS5kYXRhLmNoaWxkcmVuLCBmdW5jdGlvbiAoaW5mbykge1xuXHRcdFx0XHRcdFx0Y29udGVudCArPSBcIjxzcGFuIGNsYXNzPVxcXCJuYW1lXFxcIiBzdHlsZT1cXFwiY29sb3I6XCIgKyAoaW5mby5jb2xvciB8fCBkYXRhLmNvbG9yKSArIFwiXFxcIj4gXCIgKyAoaW5mby50aXRsZSkgKyBcIjwvc3Bhbj48YnIvPlwiO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdCRjb21waWxlKG9wdGlvbnMudG9vbHRpcC5zaG93VG9vbHRpcChjb250ZW50LCBkYXRhLCBkMy5ldmVudCwgZWxlbSkuY29udGVudHMoKSkoc2NvcGUpO1xuXHRcdFx0XHR9O1xuXG5cdFx0XHRcdHZhciBoaWRlX2RldGFpbHMgPSBmdW5jdGlvbiAoZGF0YSwgaSwgZWxlbWVudCkge1xuXHRcdFx0XHRcdHJldHVybiBvcHRpb25zLnRvb2x0aXAuaGlkZVRvb2x0aXAoKTtcblx0XHRcdFx0fTtcblxuXHRcdFx0XHRzY29wZS4kd2F0Y2goJ2NoYXJ0ZGF0YScsIGZ1bmN0aW9uIChkYXRhLCBvbGREYXRhKSB7XG5cdFx0XHRcdFx0b3B0aW9ucy50b29sdGlwLmhpZGVUb29sdGlwKCk7XG5cblx0XHRcdFx0XHRpZiAob3B0aW9ucy5jaXJjbGVzID09IG51bGwpIHtcblx0XHRcdFx0XHRcdGNyZWF0ZV9ub2RlcygpO1xuXHRcdFx0XHRcdFx0Y3JlYXRlX3ZpcygpO1xuXHRcdFx0XHRcdFx0c3RhcnQoKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0dXBkYXRlX3ZpcygpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZihsYWJlbHMubGVuZ3RoID09IDEgfHwgb3B0aW9ucy5sYWJlbHMgIT0gdHJ1ZSl7XG5cdFx0XHRcdFx0XHRcdGRpc3BsYXlfZ3JvdXBfYWxsKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2V7XG5cdFx0XHRcdFx0XHRcdGRpc3BsYXlfYnlfY2F0KCk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRzY29wZS4kd2F0Y2goJ2luZGV4ZXInLCBmdW5jdGlvbiAobiwgbykge1xuXHRcdFx0XHRcdGlmKG4gPT09IG8pe1xuXHRcdFx0XHRcdFx0cmV0dXJuXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmKHR5cGVvZiBuWzBdLmNoaWxkcmVuICE9IFwidW5kZWZpbmVkXCIpe1xuXHRcdFx0XHRcdFx0b3B0aW9ucy50b29sdGlwLmhpZGVUb29sdGlwKCk7XG5cdFx0XHRcdFx0XHRjbGVhcl9ub2RlcygpO1xuXHRcdFx0XHRcdFx0Y3JlYXRlX25vZGVzKCk7XG5cdFx0XHRcdFx0XHRjcmVhdGVfdmlzKCk7XG5cdFx0XHRcdFx0XHRzdGFydCgpO1xuXG5cdFx0XHRcdFx0XHRpZihsYWJlbHMubGVuZ3RoID09IDEgfHwgb3B0aW9ucy5sYWJlbHMgIT0gdHJ1ZSl7XG5cdFx0XHRcdFx0XHRcdFx0ZGlzcGxheV9ncm91cF9hbGwoKTtcblx0XHRcdFx0XHRcdFx0XHQvL2NvbnNvbGUubG9nKCdhbGwnKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGVsc2V7XG5cdFx0XHRcdFx0XHRcdFx0Ly9kaXNwbGF5X2J5X2NhdCgpO1xuXHRcdFx0XHRcdFx0XHRcdGRpc3BsYXlfZ3JvdXBfYWxsKCk7XG5cdFx0XHRcdFx0XHRcdFx0Ly9jb25zb2xlLmxvZygnYWxsJyk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdFx0c2NvcGUuJHdhdGNoKCdkaXJlY3Rpb24nLCBmdW5jdGlvbiAob2xkRCwgbmV3RCkge1xuXHRcdFx0XHRcdGlmIChvbGREID09PSBuZXdEKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmIChvbGREID09IFwiYWxsXCIpIHtcblx0XHRcdFx0XHRcdGRpc3BsYXlfZ3JvdXBfYWxsKCk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGRpc3BsYXlfYnlfY2F0KCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KVxuXHRcdFx0fVxuXHRcdH07XG5cdH0pO1xufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSggJ2FwcC5jb250cm9sbGVycycgKS5jb250cm9sbGVyKCAnQ2lyY2xlZ3JhcGhDdHJsJywgZnVuY3Rpb24oKXtcblx0XHQvL1xuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5kaXJlY3RpdmVzJykuZGlyZWN0aXZlKCdjaXJjbGVncmFwaCcsIGZ1bmN0aW9uICgkdGltZW91dCkge1xuXHRcdHZhciBkZWZhdWx0cyA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdHdpZHRoOiA4MCxcblx0XHRcdFx0aGVpZ2h0OiA4MCxcblx0XHRcdFx0Y29sb3I6ICcjMDBjY2FhJyxcblx0XHRcdFx0c2l6ZTogMTc4LFxuXHRcdFx0XHRmaWVsZDogJ3JhbmsnXG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiB7XG5cdFx0XHRyZXN0cmljdDogJ0UnLFxuXHRcdFx0Y29udHJvbGxlcjogJ0NpcmNsZWdyYXBoQ3RybCcsXG5cdFx0XHRzY29wZToge1xuXHRcdFx0XHRvcHRpb25zOiAnPSdcblx0XHRcdH0sXG5cdFx0XHRyZXF1aXJlOiAnbmdNb2RlbCcsXG5cdFx0XHRsaW5rOiBmdW5jdGlvbiAoJHNjb3BlLCBlbGVtZW50LCAkYXR0cnMsIG5nTW9kZWwpIHtcblx0XHRcdFx0Ly9GZXRjaGluZyBPcHRpb25zXG5cblx0XHRcdFx0JHNjb3BlLm9wdGlvbnMgPSBhbmd1bGFyLmV4dGVuZChkZWZhdWx0cygpLCAkc2NvcGUub3B0aW9ucyk7XG5cblx0XHRcdFx0Ly9DcmVhdGluZyB0aGUgU2NhbGVcblx0XHRcdFx0dmFyIHJvdGF0ZSA9IGQzLnNjYWxlLmxpbmVhcigpXG5cdFx0XHRcdFx0LmRvbWFpbihbMSwgJHNjb3BlLm9wdGlvbnMuc2l6ZV0pXG5cdFx0XHRcdFx0LnJhbmdlKFsxLCAwXSlcblx0XHRcdFx0XHQuY2xhbXAodHJ1ZSk7XG5cblx0XHRcdFx0Ly9DcmVhdGluZyBFbGVtZW50c1xuXHRcdFx0XHR2YXIgc3ZnID0gZDMuc2VsZWN0KGVsZW1lbnRbMF0pLmFwcGVuZCgnc3ZnJylcblx0XHRcdFx0XHQuYXR0cignd2lkdGgnLCAkc2NvcGUub3B0aW9ucy53aWR0aClcblx0XHRcdFx0XHQuYXR0cignaGVpZ2h0JywgJHNjb3BlLm9wdGlvbnMuaGVpZ2h0KVxuXHRcdFx0XHRcdC5hcHBlbmQoJ2cnKTtcblx0XHRcdFx0dmFyIGNvbnRhaW5lciA9IHN2Zy5hcHBlbmQoJ2cnKVxuXHRcdFx0XHRcdC5hdHRyKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKCcgKyAkc2NvcGUub3B0aW9ucy53aWR0aCAvIDIgKyAnLCcgKyAkc2NvcGUub3B0aW9ucy5oZWlnaHQgLyAyICsgJyknKTtcblx0XHRcdFx0dmFyIGNpcmNsZUJhY2sgPSBjb250YWluZXIuYXBwZW5kKCdjaXJjbGUnKVxuXHRcdFx0XHRcdC5hdHRyKCdyJywgJHNjb3BlLm9wdGlvbnMud2lkdGggLyAyIC0gMilcblx0XHRcdFx0XHQuYXR0cignc3Ryb2tlLXdpZHRoJywgMilcblx0XHRcdFx0XHQuYXR0cignc3Ryb2tlJywgJHNjb3BlLm9wdGlvbnMuY29sb3IpXG5cdFx0XHRcdFx0LnN0eWxlKCdvcGFjaXR5JywgJzAuNicpXG5cdFx0XHRcdFx0LmF0dHIoJ2ZpbGwnLCAnbm9uZScpO1xuXHRcdFx0XHR2YXIgYXJjID0gZDMuc3ZnLmFyYygpXG5cdFx0XHRcdFx0LnN0YXJ0QW5nbGUoMClcblx0XHRcdFx0XHQuaW5uZXJSYWRpdXMoZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdHJldHVybiAkc2NvcGUub3B0aW9ucy53aWR0aCAvIDIgLSA0O1xuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0Lm91dGVyUmFkaXVzKGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gJHNjb3BlLm9wdGlvbnMud2lkdGggLyAyO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR2YXIgY2lyY2xlR3JhcGggPSBjb250YWluZXIuYXBwZW5kKCdwYXRoJylcblx0XHRcdFx0XHQuZGF0dW0oe1xuXHRcdFx0XHRcdFx0ZW5kQW5nbGU6IDIgKiBNYXRoLlBJICogMFxuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0LnN0eWxlKFwiZmlsbFwiLCAkc2NvcGUub3B0aW9ucy5jb2xvcilcblx0XHRcdFx0XHQuYXR0cignZCcsIGFyYyk7XG5cdFx0XHRcdHZhciB0ZXh0ID0gY29udGFpbmVyLnNlbGVjdEFsbCgndGV4dCcpXG5cdFx0XHRcdFx0LmRhdGEoWzBdKVxuXHRcdFx0XHRcdC5lbnRlcigpXG5cdFx0XHRcdFx0LmFwcGVuZCgndGV4dCcpXG5cdFx0XHRcdFx0LnRleHQoZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdHJldHVybiAnTsKwJyArIGQ7XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQuc3R5bGUoXCJmaWxsXCIsICRzY29wZS5vcHRpb25zLmNvbG9yKVxuXHRcdFx0XHRcdC5zdHlsZSgnZm9udC13ZWlnaHQnLCAnYm9sZCcpXG5cdFx0XHRcdFx0LmF0dHIoJ3RleHQtYW5jaG9yJywgJ21pZGRsZScpXG5cdFx0XHRcdFx0LmF0dHIoJ3knLCAnMC4zNWVtJyk7XG5cblx0XHRcdFx0Ly9UcmFuc2l0aW9uIGlmIHNlbGVjdGlvbiBoYXMgY2hhbmdlZFxuXHRcdFx0XHRmdW5jdGlvbiBhbmltYXRlSXQocmFkaXVzKSB7XG5cdFx0XHRcdFx0Y2lyY2xlR3JhcGgudHJhbnNpdGlvbigpXG5cdFx0XHRcdFx0XHQuZHVyYXRpb24oNzUwKVxuXHRcdFx0XHRcdFx0LmNhbGwoYXJjVHdlZW4sIHJvdGF0ZShyYWRpdXMpICogMiAqIE1hdGguUEkpO1xuXHRcdFx0XHRcdHRleHQudHJhbnNpdGlvbigpLmR1cmF0aW9uKDc1MCkudHdlZW4oJ3RleHQnLCBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0dmFyIGRhdGEgPSB0aGlzLnRleHRDb250ZW50LnNwbGl0KCdOwrAnKTtcblx0XHRcdFx0XHRcdHZhciBpID0gZDMuaW50ZXJwb2xhdGUocGFyc2VJbnQoZGF0YVsxXSksIHJhZGl1cyk7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZnVuY3Rpb24gKHQpIHtcblx0XHRcdFx0XHRcdFx0dGhpcy50ZXh0Q29udGVudCA9ICdOwrAnICsgKE1hdGgucm91bmQoaSh0KSAqIDEpIC8gMSk7XG5cdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvL1R3ZWVuIGFuaW1hdGlvbiBmb3IgdGhlIEFyY1xuXHRcdFx0XHRmdW5jdGlvbiBhcmNUd2Vlbih0cmFuc2l0aW9uLCBuZXdBbmdsZSkge1xuXHRcdFx0XHRcdHRyYW5zaXRpb24uYXR0clR3ZWVuKFwiZFwiLCBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0dmFyIGludGVycG9sYXRlID0gZDMuaW50ZXJwb2xhdGUoZC5lbmRBbmdsZSwgbmV3QW5nbGUpO1xuXHRcdFx0XHRcdFx0cmV0dXJuIGZ1bmN0aW9uICh0KSB7XG5cdFx0XHRcdFx0XHRcdGQuZW5kQW5nbGUgPSBpbnRlcnBvbGF0ZSh0KTtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGFyYyhkKTtcblx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQkc2NvcGUuJHdhdGNoKCdvcHRpb25zJywgZnVuY3Rpb24gKG4sIG8pIHtcblx0XHRcdFx0XHRpZiAobiA9PT0gbykge1xuXHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRjaXJjbGVCYWNrLnN0eWxlKCdzdHJva2UnLCBuLmNvbG9yKTtcblx0XHRcdFx0XHRjaXJjbGVHcmFwaC5zdHlsZSgnZmlsbCcsIG4uY29sb3IpO1xuXHRcdFx0XHRcdHRleHQuc3R5bGUoJ2ZpbGwnLCBuLmNvbG9yKTtcblx0XHRcdFx0XHQkdGltZW91dChmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRhbmltYXRlSXQobmdNb2RlbC4kbW9kZWxWYWx1ZVtuLmZpZWxkXSlcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0Ly9XYXRjaGluZyBpZiBzZWxlY3Rpb24gaGFzIGNoYW5nZWQgZnJvbSBhbm90aGVyIFVJIGVsZW1lbnRcblx0XHRcdFx0JHNjb3BlLiR3YXRjaChcblx0XHRcdFx0XHRmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gbmdNb2RlbC4kbW9kZWxWYWx1ZTtcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdGZ1bmN0aW9uIChuLCBvKSB7XG5cdFx0XHRcdFx0XHRpZiAoIW4pIHtcblx0XHRcdFx0XHRcdFx0biA9IHt9O1xuXHRcdFx0XHRcdFx0XHRuWyRzY29wZS5vcHRpb25zLmZpZWxkXSA9ICRzY29wZS5vcHRpb25zLnNpemU7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHQkdGltZW91dChmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRcdGFuaW1hdGVJdChuWyRzY29wZS5vcHRpb25zLmZpZWxkXSk7XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9O1xuXG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZGlyZWN0aXZlcycpLmRpcmVjdGl2ZSggJ2hpc3RvcnknLCBmdW5jdGlvbigpIHtcblx0XHR2YXIgZGVmYXVsdHMgPSBmdW5jdGlvbigpe1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0ZmllbGQ6ICdzY29yZScsXG5cdFx0XHRcdGNvbG9yOiAnJ1xuXHRcdFx0fVxuXHRcdH07XG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlc3RyaWN0OiAnRScsXG5cdFx0XHR0ZW1wbGF0ZVVybDogJ3ZpZXdzL2RpcmVjdGl2ZXMvaGlzdG9yeS9oaXN0b3J5Lmh0bWwnLFxuXHRcdFx0Y29udHJvbGxlcjogJ0hpc3RvcnlDdHJsJyxcblx0XHRcdHNjb3BlOntcblx0XHRcdFx0b3B0aW9uczonPScsXG5cdFx0XHRcdGNoYXJ0ZGF0YTogJz0nXG5cdFx0XHR9LFxuXHRcdFx0bGluazogZnVuY3Rpb24oICRzY29wZSwgZWxlbWVudCwgJGF0dHJzLCBuZ01vZGVsKXtcblx0XHRcdFx0XHR2YXIgb3B0aW9ucyA9IGFuZ3VsYXIuZXh0ZW5kKGRlZmF1bHRzKCksICRzY29wZS5vcHRpb25zKTtcblx0XHRcdH1cblx0XHR9O1xuXG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0hpc3RvcnlDdHJsJywgZnVuY3Rpb24gKCRzY29wZSkge1xuXHRcdCRzY29wZS5zZXREYXRhID0gc2V0RGF0YTtcblx0XHRhY3RpdmF0ZSgpO1xuXHRcblx0XHRmdW5jdGlvbiBhY3RpdmF0ZSgpe1xuXHRcdFx0JHNjb3BlLnNldERhdGEoKTtcblx0XHRcdCRzY29wZS4kd2F0Y2goJ29wdGlvbnMnLCBmdW5jdGlvbihuLG8pe1xuXHRcdFx0XHRpZihuID09PSAwKXtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblx0XHRcdFx0JHNjb3BlLnNldERhdGEoKTtcblx0XHRcdH0pXG5cdFx0fVxuXHRcdGZ1bmN0aW9uIHNldERhdGEoKXtcblx0XHRcdCRzY29wZS5kaXNwbGF5ID0ge1xuXHRcdFx0XHRzZWxlY3RlZENhdDogJycsXG5cdFx0XHRcdHJhbms6IFt7XG5cdFx0XHRcdFx0ZmllbGRzOiB7XG5cdFx0XHRcdFx0XHR4OiAneWVhcicsXG5cdFx0XHRcdFx0XHR5OiAncmFuaydcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdHRpdGxlOiAnUmFuaycsXG5cdFx0XHRcdFx0Y29sb3I6ICcjNTJiNjk1J1xuXHRcdFx0XHR9XSxcblx0XHRcdFx0c2NvcmU6IFt7XG5cdFx0XHRcdFx0ZmllbGRzOiB7XG5cdFx0XHRcdFx0XHR4OiAneWVhcicsXG5cdFx0XHRcdFx0XHR5OiAkc2NvcGUub3B0aW9ucy5maWVsZFxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0dGl0bGU6ICdTY29yZScsXG5cdFx0XHRcdFx0Y29sb3I6ICRzY29wZS5vcHRpb25zLmNvbG9yXG5cdFx0XHRcdH1dXG5cdFx0XHR9O1xuXHRcdH1cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5kaXJlY3RpdmVzJykuZGlyZWN0aXZlKCAnaW5kaWNhdG9yTWVudScsIGZ1bmN0aW9uKCkge1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlc3RyaWN0OiAnRUEnLFxuXHRcdFx0c2NvcGU6IHtcblx0XHRcdFx0aXRlbTogJz1pdGVtJ1xuXHRcdFx0fSxcblx0XHRcdHJlcGxhY2U6dHJ1ZSxcblx0XHRcdHRlbXBsYXRlVXJsOiAndmlld3MvZGlyZWN0aXZlcy9pbmRpY2F0b3JNZW51L2luZGljYXRvck1lbnUuaHRtbCcsXG5cdFx0XHRjb250cm9sbGVyOiAnSW5kaWNhdG9yTWVudUN0cmwnLFxuXHRcdFx0Y29udHJvbGxlckFzOiAndm0nLFxuXHRcdFx0YmluZFRvQ29udHJvbGxlcjogdHJ1ZSxcblx0XHRcdGxpbms6IGZ1bmN0aW9uKCBzY29wZSwgZWxlbWVudCwgYXR0cnMgKXtcblx0XHRcdFx0Ly9cblx0XHRcdFx0dmFyIGNsID0gJ2FjdGl2ZSc7XG5cdFx0XHRcdHZhciBlbCA9IGVsZW1lbnRbMF07XG5cdFx0XHRcdHZhciBwYXJlbnQgPSBlbGVtZW50LnBhcmVudCgpO1xuXHRcdFx0XHRwYXJlbnQub24oJ21vdXNlZW50ZXInLCBmdW5jdGlvbihlKXtcblx0XHRcdFx0XHRlbGVtZW50LmFkZENsYXNzKGNsKTtcblx0XHRcdFx0fSkub24oJ21vdXNlbGVhdmUnLCBmdW5jdGlvbihlKXtcblx0XHRcdFx0XHRlbGVtZW50LnJlbW92ZUNsYXNzKGNsKTtcblx0XHRcdFx0fSk7XG5cdFx0XHRcdFxuXHRcdFx0fVxuXHRcdH07XG5cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoICdhcHAuY29udHJvbGxlcnMnICkuY29udHJvbGxlciggJ0luZGljYXRvck1lbnVDdHJsJywgZnVuY3Rpb24oKXtcblx0XHQvL1xuXHRcdHZhciB2bSA9IHRoaXM7XG5cdFx0dm0uY2hlY2tCYXNlID0gY2hlY2tCYXNlO1xuXHRcdHZtLmxvY2tlZCA9IGxvY2tlZDtcblx0XHR2bS5jaGFuZ2VPZmZpY2lhbCA9IGNoYW5nZU9mZmljaWFsO1xuXG5cdFx0ZnVuY3Rpb24gbG9ja2VkKCl7XG5cdFx0XHRyZXR1cm4gdm0uaXRlbS5pc19vZmZpY2lhbCA/ICdsb2NrX29wZW4nIDogJ2xvY2snO1xuXHRcdH1cblx0XHRmdW5jdGlvbiBjaGFuZ2VPZmZpY2lhbCgpe1xuXHRcdFx0dm0uaXRlbS5pc19vZmZpY2lhbCA9ICF2bS5pdGVtLmlzX29mZmljaWFsO1xuXHRcdFx0dm0uaXRlbS5zYXZlKCk7XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIGNoZWNrQmFzZShpdGVtKXtcblx0XHRcdGlmIChpdGVtLnRpdGxlICYmIGl0ZW0ubWVhc3VyZV90eXBlX2lkICYmIGl0ZW0uZGF0YXByb3ZpZGVyICYmIGl0ZW0udGl0bGUubGVuZ3RoID49IDMpIHtcblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZGlyZWN0aXZlcycpLmRpcmVjdGl2ZSgnbWVkaWFuJywgZnVuY3Rpb24gKCR0aW1lb3V0KSB7XG5cdFx0dmFyIGRlZmF1bHRzID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0aWQ6ICdncmFkaWVudCcsXG5cdFx0XHRcdHdpZHRoOiAzMDAsXG5cdFx0XHRcdGhlaWdodDogNDAsXG5cdFx0XHRcdGluZm86IHRydWUsXG5cdFx0XHRcdGZpZWxkOiAnc2NvcmUnLFxuXHRcdFx0XHRoYW5kbGluZzogdHJ1ZSxcblx0XHRcdFx0bWFyZ2luOiB7XG5cdFx0XHRcdFx0bGVmdDogMjAsXG5cdFx0XHRcdFx0cmlnaHQ6IDIwLFxuXHRcdFx0XHRcdHRvcDogMTAsXG5cdFx0XHRcdFx0Ym90dG9tOiAxMFxuXHRcdFx0XHR9LFxuXHRcdFx0XHRjb2xvcnM6IFsge1xuXHRcdFx0XHRcdHBvc2l0aW9uOiAwLFxuXHRcdFx0XHRcdGNvbG9yOiAncmdiYSgxMDIsMTAyLDEwMiwxKScsXG5cdFx0XHRcdFx0b3BhY2l0eTogMVxuXHRcdFx0XHR9LCB7XG5cdFx0XHRcdFx0cG9zaXRpb246IDUzLFxuXHRcdFx0XHRcdGNvbG9yOiAncmdiYSgxMjgsIDI0MywgMTk4LDEpJyxcblx0XHRcdFx0XHRvcGFjaXR5OiAxXG5cdFx0XHRcdH0se1xuXHRcdFx0XHRcdHBvc2l0aW9uOiAxMDAsXG5cdFx0XHRcdFx0Y29sb3I6ICdyZ2JhKDI1NSwyNTUsMjU1LDEpJyxcblx0XHRcdFx0XHRvcGFjaXR5OiAwXG5cdFx0XHRcdH1dXG5cdFx0XHR9O1xuXHRcdH1cblx0XHRyZXR1cm4ge1xuXHRcdFx0cmVzdHJpY3Q6ICdFJyxcblx0XHRcdHNjb3BlOiB7XG5cdFx0XHRcdGRhdGE6ICc9Jyxcblx0XHRcdFx0b3B0aW9uczogJz0nXG5cdFx0XHR9LFxuXHRcdFx0cmVxdWlyZTogJ25nTW9kZWwnLFxuXHRcdFx0bGluazogZnVuY3Rpb24gKCRzY29wZSwgZWxlbWVudCwgJGF0dHJzLCBuZ01vZGVsKSB7XG5cblx0XHRcdFx0dmFyIG9wdGlvbnMgPSBhbmd1bGFyLmV4dGVuZChkZWZhdWx0cygpLCAkYXR0cnMpO1xuXHRcdFx0XHRvcHRpb25zID0gYW5ndWxhci5leHRlbmQob3B0aW9ucywgJHNjb3BlLm9wdGlvbnMpO1xuXHRcdFx0XHRvcHRpb25zLnVuaXF1ZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuXHRcdFx0XHRpZihvcHRpb25zLmNvbG9yKXtcblx0XHRcdFx0XHRvcHRpb25zLmNvbG9yc1sxXS5jb2xvciA9IG9wdGlvbnMuY29sb3I7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxlbWVudC5jc3MoJ2hlaWdodCcsIG9wdGlvbnMuaGVpZ2h0ICsgJ3B4JykuY3NzKCdib3JkZXItcmFkaXVzJywgb3B0aW9ucy5oZWlnaHQgLyAyICsgJ3B4Jyk7XG5cdFx0XHRcdHZhciBtYXggPSAwO1xuXHRcdFx0XHRhbmd1bGFyLmZvckVhY2goJHNjb3BlLmRhdGEsIGZ1bmN0aW9uIChuYXQsIGtleSkge1xuXHRcdFx0XHRcdG1heCA9IGQzLm1heChbbWF4LCBwYXJzZUludChuYXRbb3B0aW9ucy5maWVsZF0pXSk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHR2YXIgeCA9IGQzLnNjYWxlLmxpbmVhcigpXG5cdFx0XHRcdFx0LmRvbWFpbihbMCwgbWF4XSlcblx0XHRcdFx0XHQucmFuZ2UoW29wdGlvbnMubWFyZ2luLmxlZnQsIG9wdGlvbnMud2lkdGggLSBvcHRpb25zLm1hcmdpbi5sZWZ0XSlcblx0XHRcdFx0XHQuY2xhbXAodHJ1ZSk7XG5cblx0XHRcdFx0dmFyIGJydXNoID0gZDMuc3ZnLmJydXNoKClcblx0XHRcdFx0XHQueCh4KVxuXHRcdFx0XHRcdC5leHRlbnQoWzAsIDBdKVxuXHRcdFx0XHRcdC5vbihcImJydXNoXCIsIGJydXNoKVxuXHRcdFx0XHRcdC5vbihcImJydXNoZW5kXCIsIGJydXNoZWQpO1xuXG5cdFx0XHRcdHZhciBzdmcgPSBkMy5zZWxlY3QoZWxlbWVudFswXSkuYXBwZW5kKFwic3ZnXCIpXG5cdFx0XHRcdFx0LmF0dHIoXCJ3aWR0aFwiLCBvcHRpb25zLndpZHRoKVxuXHRcdFx0XHRcdC5hdHRyKFwiaGVpZ2h0XCIsIG9wdGlvbnMuaGVpZ2h0KVxuXHRcdFx0XHRcdC5hcHBlbmQoXCJnXCIpO1xuXHRcdFx0XHQvLy5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKDAsXCIgKyBvcHRpb25zLm1hcmdpbi50b3AgLyAyICsgXCIpXCIpO1xuXHRcdFx0XHR2YXIgZ3JhZGllbnQgPSBzdmcuYXBwZW5kKCdzdmc6ZGVmcycpXG5cdFx0XHRcdFx0LmFwcGVuZChcInN2ZzpsaW5lYXJHcmFkaWVudFwiKVxuXHRcdFx0XHRcdC5hdHRyKCdpZCcsIG9wdGlvbnMuZmllbGQrb3B0aW9ucy51bmlxdWUpXG5cdFx0XHRcdFx0LmF0dHIoJ3gxJywgJzAlJylcblx0XHRcdFx0XHQuYXR0cigneTEnLCAnMCUnKVxuXHRcdFx0XHRcdC5hdHRyKCd4MicsICcxMDAlJylcblx0XHRcdFx0XHQuYXR0cigneTInLCAnMCUnKVxuXHRcdFx0XHRcdC5hdHRyKCdzcHJlYWRNZXRob2QnLCAncGFkJylcblx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKG9wdGlvbnMuY29sb3JzLCBmdW5jdGlvbiAoY29sb3IpIHtcblx0XHRcdFx0XHRncmFkaWVudC5hcHBlbmQoJ3N2ZzpzdG9wJylcblx0XHRcdFx0XHRcdC5hdHRyKCdvZmZzZXQnLCBjb2xvci5wb3NpdGlvbiArICclJylcblx0XHRcdFx0XHRcdC5hdHRyKCdzdG9wLWNvbG9yJywgY29sb3IuY29sb3IpXG5cdFx0XHRcdFx0XHQuYXR0cignc3RvcC1vcGFjaXR5JywgY29sb3Iub3BhY2l0eSk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHR2YXIgcmVjdCA9IHN2Zy5hcHBlbmQoJ3N2ZzpyZWN0Jylcblx0XHRcdFx0XHQuYXR0cignd2lkdGgnLCBvcHRpb25zLndpZHRoKVxuXHRcdFx0XHRcdC5hdHRyKCdoZWlnaHQnLCBvcHRpb25zLmhlaWdodClcblx0XHRcdFx0XHQuc3R5bGUoJ2ZpbGwnLCAndXJsKCMnICsgKG9wdGlvbnMuZmllbGQrb3B0aW9ucy51bmlxdWUpKyAnKScpO1xuXHRcdFx0XHR2YXIgbGVnZW5kID0gc3ZnLmFwcGVuZCgnZycpLmF0dHIoJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoJyArIG9wdGlvbnMuaGVpZ2h0IC8gMiArICcsICcgKyBvcHRpb25zLmhlaWdodCAvIDIgKyAnKScpXG5cdFx0XHRcdFx0LmF0dHIoJ2NsYXNzJywgJ3N0YXJ0TGFiZWwnKVxuXG5cdFx0XHRcdGlmIChvcHRpb25zLmluZm8gPT09IHRydWUpIHtcblx0XHRcdFx0XHRsZWdlbmQuYXBwZW5kKCdjaXJjbGUnKVxuXHRcdFx0XHRcdFx0LmF0dHIoJ3InLCBvcHRpb25zLmhlaWdodCAvIDIpO1xuXHRcdFx0XHRcdGxlZ2VuZC5hcHBlbmQoJ3RleHQnKVxuXHRcdFx0XHRcdFx0LnRleHQoMClcblx0XHRcdFx0XHRcdC5zdHlsZSgnZm9udC1zaXplJywgb3B0aW9ucy5oZWlnaHQvMi41KVxuXHRcdFx0XHRcdFx0LmF0dHIoJ3RleHQtYW5jaG9yJywgJ21pZGRsZScpXG5cdFx0XHRcdFx0XHQuYXR0cigneScsICcuMzVlbScpXG5cdFx0XHRcdFx0dmFyIGxlZ2VuZDIgPSBzdmcuYXBwZW5kKCdnJykuYXR0cigndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgnICsgKG9wdGlvbnMud2lkdGggLSAob3B0aW9ucy5oZWlnaHQgLyAyKSkgKyAnLCAnICsgb3B0aW9ucy5oZWlnaHQgLyAyICsgJyknKVxuXHRcdFx0XHRcdFx0LmF0dHIoJ2NsYXNzJywgJ2VuZExhYmVsJylcblx0XHRcdFx0XHRsZWdlbmQyLmFwcGVuZCgnY2lyY2xlJylcblx0XHRcdFx0XHRcdC5hdHRyKCdyJywgb3B0aW9ucy5oZWlnaHQgLyAyKVxuXHRcdFx0XHRcdGxlZ2VuZDIuYXBwZW5kKCd0ZXh0Jylcblx0XHRcdFx0XHRcdC50ZXh0KGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0XHRcdC8vVERPRE86IENIY2tpY2sgaWYgbm8gY29tbWEgdGhlcmUgXG5cdFx0XHRcdFx0XHRcdGlmKG1heCA+IDEwMDApe1xuXHRcdFx0XHRcdFx0XHRcdHZhciB2ID0gKHBhcnNlSW50KG1heCkgLyAxMDAwKS50b1N0cmluZygpO1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybiB2LnN1YnN0cigwLCB2LmluZGV4T2YoJy4nKSApICsgXCJrXCIgO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdHJldHVybiBtYXhcblx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0XHQuc3R5bGUoJ2ZvbnQtc2l6ZScsIG9wdGlvbnMuaGVpZ2h0LzIuNSlcblx0XHRcdFx0XHRcdC5hdHRyKCd0ZXh0LWFuY2hvcicsICdtaWRkbGUnKVxuXHRcdFx0XHRcdFx0LmF0dHIoJ3knLCAnLjM1ZW0nKVxuXHRcdFx0XHR9XG5cdFx0XHRcdHZhciBzbGlkZXIgPSBzdmcuYXBwZW5kKFwiZ1wiKVxuXHRcdFx0XHRcdC5hdHRyKFwiY2xhc3NcIiwgXCJzbGlkZXJcIik7XG5cdFx0XHRcdGlmKG9wdGlvbnMuaGFuZGxpbmcgPT0gdHJ1ZSl7XG5cdFx0XHRcdFx0c2xpZGVyLmNhbGwoYnJ1c2gpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0c2xpZGVyLnNlbGVjdChcIi5iYWNrZ3JvdW5kXCIpXG5cdFx0XHRcdFx0LmF0dHIoXCJoZWlnaHRcIiwgb3B0aW9ucy5oZWlnaHQpO1xuXG5cdFx0XHRcdGlmIChvcHRpb25zLmluZm8gPT09IHRydWUpIHtcblx0XHRcdFx0c2xpZGVyLmFwcGVuZCgnbGluZScpXG5cdFx0XHRcdFx0LmF0dHIoJ3gxJywgb3B0aW9ucy53aWR0aCAvIDIpXG5cdFx0XHRcdFx0LmF0dHIoJ3kxJywgMClcblx0XHRcdFx0XHQuYXR0cigneDInLCBvcHRpb25zLndpZHRoIC8gMilcblx0XHRcdFx0XHQuYXR0cigneTInLCBvcHRpb25zLmhlaWdodClcblx0XHRcdFx0XHQuYXR0cignc3Ryb2tlLWRhc2hhcnJheScsICczLDMnKVxuXHRcdFx0XHRcdC5hdHRyKCdzdHJva2Utd2lkdGgnLCAxKVxuXHRcdFx0XHRcdC5hdHRyKCdzdHJva2UnLCAncmdiYSgwLDAsMCw4NyknKTtcblx0XHRcdFx0fVxuXHRcdFx0XHR2YXIgaGFuZGxlQ29udCA9IHNsaWRlci5hcHBlbmQoJ2cnKVxuXHRcdFx0XHRcdC5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKDAsXCIgKyBvcHRpb25zLmhlaWdodCAvIDIgKyBcIilcIik7XG5cdFx0XHRcdHZhciBoYW5kbGUgPSBoYW5kbGVDb250LmFwcGVuZChcImNpcmNsZVwiKVxuXHRcdFx0XHRcdC5hdHRyKFwiY2xhc3NcIiwgXCJoYW5kbGVcIilcblx0XHRcdFx0XHQuYXR0cihcInJcIiwgb3B0aW9ucy5oZWlnaHQgLyAyKTtcblx0XHRcdFx0XHRpZihvcHRpb25zLmNvbG9yKXtcblx0XHRcdFx0XHRcdGhhbmRsZS5zdHlsZSgnZmlsbCcsIG9wdGlvbnMuY29sb3IpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0dmFyIGhhbmRsZUxhYmVsID0gaGFuZGxlQ29udC5hcHBlbmQoJ3RleHQnKVxuXHRcdFx0XHRcdC50ZXh0KDApXG5cdFx0XHRcdFx0LnN0eWxlKCdmb250LXNpemUnLCBvcHRpb25zLmhlaWdodC8yLjUpXG5cdFx0XHRcdFx0LmF0dHIoXCJ0ZXh0LWFuY2hvclwiLCBcIm1pZGRsZVwiKS5hdHRyKCd5JywgJzAuMzVlbScpO1xuXG5cdFx0XHRcdC8vc2xpZGVyXG5cdFx0XHRcdC8vLmNhbGwoYnJ1c2guZXh0ZW50KFswLCAwXSkpXG5cdFx0XHRcdC8vLmNhbGwoYnJ1c2guZXZlbnQpO1xuXG5cdFx0XHRcdGZ1bmN0aW9uIGJydXNoKCkge1xuXHRcdFx0XHRcdHZhciB2YWx1ZSA9IGJydXNoLmV4dGVudCgpWzBdO1xuXG5cdFx0XHRcdFx0aWYgKGQzLmV2ZW50LnNvdXJjZUV2ZW50KSB7XG5cdFx0XHRcdFx0XHR2YWx1ZSA9IHguaW52ZXJ0KGQzLm1vdXNlKHRoaXMpWzBdKTtcblx0XHRcdFx0XHRcdGJydXNoLmV4dGVudChbdmFsdWUsIHZhbHVlXSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmKHBhcnNlSW50KHZhbHVlKSA+IDEwMDApe1xuXHRcdFx0XHRcdFx0dmFyIHYgPSAocGFyc2VJbnQodmFsdWUpIC8gMTAwMCkudG9TdHJpbmcoKTtcblx0XHRcdFx0XHRcdGhhbmRsZUxhYmVsLnRleHQodi5zdWJzdHIoMCwgdi5pbmRleE9mKCcuJykgKSArIFwia1wiICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2V7XG5cdFx0XHRcdFx0XHRoYW5kbGVMYWJlbC50ZXh0KHBhcnNlSW50KHZhbHVlKSk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aGFuZGxlQ29udC5hdHRyKFwidHJhbnNmb3JtXCIsICd0cmFuc2xhdGUoJyArIHgodmFsdWUpICsgJywnICsgb3B0aW9ucy5oZWlnaHQgLyAyICsgJyknKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGZ1bmN0aW9uIGJydXNoZWQoKSB7XG5cblx0XHRcdFx0XHR2YXIgdmFsdWUgPSBicnVzaC5leHRlbnQoKVswXSxcblx0XHRcdFx0XHRcdGNvdW50ID0gMCxcblx0XHRcdFx0XHRcdGZvdW5kID0gZmFsc2U7XG5cdFx0XHRcdFx0dmFyIGZpbmFsID0gXCJcIjtcblx0XHRcdFx0XHQvKmRvIHtcblxuXHRcdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKCRzY29wZS5kYXRhLCBmdW5jdGlvbiAobmF0LCBrZXkpIHtcblx0XHRcdFx0XHRcdFx0aWYgKHBhcnNlSW50KG5hdFtvcHRpb25zLmZpZWxkXSkgPT0gcGFyc2VJbnQodmFsdWUpKSB7XG5cdFx0XHRcdFx0XHRcdFx0ZmluYWwgPSBuYXQ7XG5cdFx0XHRcdFx0XHRcdFx0Zm91bmQgPSB0cnVlO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdGNvdW50Kys7XG5cdFx0XHRcdFx0XHR2YWx1ZSA9IHZhbHVlID4gNTAgPyB2YWx1ZSAtIDEgOiB2YWx1ZSArIDE7XG5cdFx0XHRcdFx0fSB3aGlsZSAoIWZvdW5kICYmIGNvdW50IDwgbWF4KTtcblxuXHRcdFx0XHRcdG5nTW9kZWwuJHNldFZpZXdWYWx1ZShmaW5hbCk7XG5cdFx0XHRcdFx0bmdNb2RlbC4kcmVuZGVyKCk7Ki9cblx0XHRcdFx0fVxuXHRcdFx0XHQkc2NvcGUuJHdhdGNoKCdvcHRpb25zJywgZnVuY3Rpb24obixvKXtcblx0XHRcdFx0XHRpZihuID09PSBvKXtcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0b3B0aW9ucy5jb2xvcnNbMV0uY29sb3IgPSBuLmNvbG9yO1xuXHRcdFx0XHRcdGdyYWRpZW50ID0gc3ZnLmFwcGVuZCgnc3ZnOmRlZnMnKVxuXHRcdFx0XHRcdFx0LmFwcGVuZChcInN2ZzpsaW5lYXJHcmFkaWVudFwiKVxuXHRcdFx0XHRcdFx0LmF0dHIoJ2lkJywgb3B0aW9ucy5maWVsZCtcIl9cIituLmNvbG9yKVxuXHRcdFx0XHRcdFx0LmF0dHIoJ3gxJywgJzAlJylcblx0XHRcdFx0XHRcdC5hdHRyKCd5MScsICcwJScpXG5cdFx0XHRcdFx0XHQuYXR0cigneDInLCAnMTAwJScpXG5cdFx0XHRcdFx0XHQuYXR0cigneTInLCAnMCUnKVxuXHRcdFx0XHRcdFx0LmF0dHIoJ3NwcmVhZE1ldGhvZCcsICdwYWQnKVxuXHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChvcHRpb25zLmNvbG9ycywgZnVuY3Rpb24gKGNvbG9yKSB7XG5cdFx0XHRcdFx0XHRncmFkaWVudC5hcHBlbmQoJ3N2ZzpzdG9wJylcblx0XHRcdFx0XHRcdFx0LmF0dHIoJ29mZnNldCcsIGNvbG9yLnBvc2l0aW9uICsgJyUnKVxuXHRcdFx0XHRcdFx0XHQuYXR0cignc3RvcC1jb2xvcicsIGNvbG9yLmNvbG9yKVxuXHRcdFx0XHRcdFx0XHQuYXR0cignc3RvcC1vcGFjaXR5JywgY29sb3Iub3BhY2l0eSk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0cmVjdC5zdHlsZSgnZmlsbCcsICd1cmwoIycgKyBvcHRpb25zLmZpZWxkICsgJ18nK24uY29sb3IrJyknKTtcblx0XHRcdFx0XHRoYW5kbGUuc3R5bGUoJ2ZpbGwnLCBuLmNvbG9yKTtcblx0XHRcdFx0XHRoYW5kbGVMYWJlbC50ZXh0KHBhcnNlSW50KG5nTW9kZWwuJG1vZGVsVmFsdWVbbi5maWVsZF0pKTtcblx0XHRcdFx0XHRoYW5kbGVDb250LnRyYW5zaXRpb24oKS5kdXJhdGlvbig1MDApLmVhc2UoJ3F1YWQnKS5hdHRyKFwidHJhbnNmb3JtXCIsICd0cmFuc2xhdGUoJyArIHgobmdNb2RlbC4kbW9kZWxWYWx1ZVtuLmZpZWxkXSkgKyAnLCcgKyBvcHRpb25zLmhlaWdodCAvIDIgKyAnKScpO1xuXHRcdFx0XHR9KTtcblx0XHRcdFx0JHNjb3BlLiR3YXRjaChcblx0XHRcdFx0XHRmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gbmdNb2RlbC4kbW9kZWxWYWx1ZTtcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdGZ1bmN0aW9uIChuZXdWYWx1ZSwgb2xkVmFsdWUpIHtcblx0XHRcdFx0XHRcdGlmICghbmV3VmFsdWUpIHtcblx0XHRcdFx0XHRcdFx0aGFuZGxlTGFiZWwudGV4dChwYXJzZUludCgwKSk7XG5cdFx0XHRcdFx0XHRcdGhhbmRsZUNvbnQuYXR0cihcInRyYW5zZm9ybVwiLCAndHJhbnNsYXRlKCcgKyB4KDApICsgJywnICsgb3B0aW9ucy5oZWlnaHQgLyAyICsgJyknKTtcblx0XHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0aGFuZGxlTGFiZWwudGV4dChwYXJzZUludChuZXdWYWx1ZVtvcHRpb25zLmZpZWxkXSkpO1xuXHRcdFx0XHRcdFx0aWYgKG5ld1ZhbHVlID09IG9sZFZhbHVlKSB7XG5cdFx0XHRcdFx0XHRcdGhhbmRsZUNvbnQuYXR0cihcInRyYW5zZm9ybVwiLCAndHJhbnNsYXRlKCcgKyB4KG5ld1ZhbHVlW29wdGlvbnMuZmllbGRdKSArICcsJyArIG9wdGlvbnMuaGVpZ2h0IC8gMiArICcpJyk7XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRoYW5kbGVDb250LnRyYW5zaXRpb24oKS5kdXJhdGlvbig1MDApLmVhc2UoJ3F1YWQnKS5hdHRyKFwidHJhbnNmb3JtXCIsICd0cmFuc2xhdGUoJyArIHgobmV3VmFsdWVbb3B0aW9ucy5maWVsZF0pICsgJywnICsgb3B0aW9ucy5oZWlnaHQgLyAyICsgJyknKTtcblxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH07XG5cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoICdhcHAuY29udHJvbGxlcnMnICkuY29udHJvbGxlciggJ01lZGlhbkN0cmwnLCBmdW5jdGlvbigpe1xuXHRcdC8vXG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5kaXJlY3RpdmVzJykuZGlyZWN0aXZlKCAncGFyc2Vjc3YnLCBmdW5jdGlvbigkc3RhdGUsICR0aW1lb3V0LCB0b2FzdHIsIEluZGV4U2VydmljZSkge1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlc3RyaWN0OiAnRUEnLFxuXHRcdFx0dGVtcGxhdGVVcmw6ICd2aWV3cy9kaXJlY3RpdmVzL3BhcnNlY3N2L3BhcnNlY3N2Lmh0bWwnLFxuXHRcdFx0Y29udHJvbGxlcjogJ1BhcnNlY3N2Q3RybCcsXG5cdFx0XHRyZXBsYWNlOnRydWUsXG5cdFx0XHRsaW5rOiBmdW5jdGlvbiggJHNjb3BlLCBlbGVtZW50LCAkYXR0cnMgKXtcblx0XHRcdFx0Ly9cblxuXHRcdFx0XHQkc2NvcGUuJHdhdGNoKCdmaWxlJywgZnVuY3Rpb24obixvKXtcblx0XHRcdFx0XHRpZihuPT09bykgcmV0dXJuIGZhbHNlO1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKG4pO1xuXHRcdFx0XHR9KVxuXHRcdFx0XHR2YXIgZXJyb3JzID0gMDtcblx0XHRcdFx0dmFyIHN0ZXBwZWQgPSAwLCByb3dDb3VudCA9IDAsIGVycm9yQ291bnQgPSAwLCBmaXJzdEVycm9yO1xuXHRcdFx0XHR2YXIgc3RhcnQsIGVuZDtcblx0XHRcdFx0dmFyIGZpcnN0UnVuID0gdHJ1ZTtcblx0XHRcdFx0dmFyIG1heFVucGFyc2VMZW5ndGggPSAxMDAwMDtcblx0XHRcdFx0dmFyIGJ1dHRvbiA9IGVsZW1lbnQuZmluZCgnYnV0dG9uJyk7XG5cdFx0XHRcdFx0dmFyIGlucHV0ID0gZWxlbWVudC5maW5kKCdpbnB1dCcpO1xuXHRcdFx0XHRcdHZhciBpc1ZlcnRpY2FsID0gZmFsc2U7XG5cdFx0XHRcdFx0dmFyIHJhdyA9IFtdO1xuXHRcdFx0XHRcdHZhciByYXdMaXN0ID0ge307XG5cdFx0XHRcdFx0aW5wdXQuY3NzKHsgZGlzcGxheTonbm9uZScgfSk7XG5cdFx0XHRcdFx0YnV0dG9uLmJpbmQoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHRcdGlucHV0WzBdLmNsaWNrKCk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0aW5wdXQuYmluZCgnY2hhbmdlJyxmdW5jdGlvbihlKXtcblx0XHRcdFx0XHRcdGlzVmVydGljYWwgPSBmYWxzZTtcblx0XHRcdFx0XHRcdHJhdyA9IFtdO1xuXHRcdFx0XHRcdFx0cmF3TGlzdCA9IHt9O1xuXG5cdFx0XHRcdFx0XHRlcnJvcnMgPSBbXTtcblx0XHRcdFx0XHRcdHN0ZXBwZWQgPSAwLCByb3dDb3VudCA9IDAsIGVycm9yQ291bnQgPSAwLCBmaXJzdEVycm9yO1xuXHRcdFx0XHRcdFx0c3RhcnQsIGVuZDtcblx0XHRcdFx0XHRcdGZpcnN0UnVuID0gdHJ1ZTtcblx0XHRcdFx0XHRcdFx0JHRpbWVvdXQoZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRcdFx0XHRJbmRleFNlcnZpY2UuY2xlYXIoKTtcblx0XHRcdFx0XHRcdFx0XHR2YXIgY3N2ID0gUGFwYS5wYXJzZShpbnB1dFswXS5maWxlc1swXSx7XG5cdFx0XHRcdFx0XHRcdFx0XHRza2lwRW1wdHlMaW5lczogdHJ1ZSxcblx0XHRcdFx0XHRcdFx0XHRcdGhlYWRlcjp0cnVlLFxuXHRcdFx0XHRcdFx0XHRcdFx0ZHluYW1pY1R5cGluZzogdHJ1ZSxcblx0XHRcdFx0XHRcdFx0XHRcdHN0ZXA6ZnVuY3Rpb24ocm93KXtcblx0XHRcdFx0XHRcdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKHJvdy5kYXRhWzBdLCBmdW5jdGlvbihpdGVtLCBrZXkpe1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlmKGlzTmFOKGl0ZW0pIHx8IGl0ZW0gPCAwICl7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZigvKml0ZW0udG9TdHJpbmcoKS50b1VwcGVyQ2FzZSgpID09IFwiTkFcIiB8fCAqL2l0ZW0gPCAwIHx8IGl0ZW0udG9TdHJpbmcoKS50b1VwcGVyQ2FzZSgpLmluZGV4T2YoJ04vQScpID4gLTEpe1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR2YXIgZXJyb3IgPSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0dHlwZTpcIjFcIixcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtZXNzYWdlOlwiRmllbGQgaW4gcm93IGlzIG5vdCB2YWxpZCBmb3IgZGF0YWJhc2UgdXNlIVwiLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGNvbHVtbjoga2V5LFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHZhbHVlOiBpdGVtXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJvdy5lcnJvcnMucHVzaChlcnJvcilcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZXJyb3JzLnB1c2goZXJyb3IpO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlmKGlzVmVydGljYWwpe1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChyb3cuZGF0YVswXSwgZnVuY3Rpb24oaXRlbSwga2V5KXtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlmKGtleS5sZW5ndGggPT0gMyl7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlmKHR5cGVvZlx0cmF3TGlzdFtrZXldLmRhdGEgPT0gXCJ1bmRlZmluZWRcIil7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRyYXdMaXN0W2tleV0uZGF0YSA9IFtdO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJhd0xpc3Rba2V5XS5kYXRhLnB1c2goaXRlbSk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Ly9yYXdMaXN0W2tleV0uZXJyb3JzID0gcm93LmVycm9ycztcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRlbHNle1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdEluZGV4U2VydmljZS5hZGREYXRhKHJvdyk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0Ly9jb25zb2xlLmxvZyhyb3cpO1xuXG5cdFx0XHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHRcdFx0YmVmb3JlRmlyc3RDaHVuazogZnVuY3Rpb24oY2h1bmspXG5cdFx0XHRcdFx0XHRcdFx0XHR7XG5cblx0XHRcdFx0XHRcdFx0XHRcdFx0Ly9DaGVjayBpZiB0aGVyZSBhcmUgcG9pbnRzIGluIHRoZSBoZWFkZXJzXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHZhciBpbmRleCA9IGNodW5rLm1hdGNoKCAvXFxyXFxufFxccnxcXG4vICkuaW5kZXg7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0dmFyIGRlbGltaXRlciA9ICcsJztcblx0XHRcdFx0XHRcdFx0XHQgICAgdmFyIGhlYWRpbmdzID0gY2h1bmsuc3Vic3RyKDAsIGluZGV4KS5zcGxpdCggJywnICk7XG5cblx0XHRcdFx0XHRcdFx0XHRcdFx0aWYoaGVhZGluZ3MubGVuZ3RoIDwgMil7XG4gXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGhlYWRpbmdzID0gY2h1bmsuc3Vic3RyKDAsIGluZGV4KS5zcGxpdCggXCJcXHRcIiApO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRlbGltaXRlciA9ICdcXHQnO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHZhciBpc0lzbyA9IFtdO1xuXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGZvcih2YXIgaSA9IDA7IGkgPD0gaGVhZGluZ3MubGVuZ3RoOyBpKyspe1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlmKGhlYWRpbmdzW2ldKXtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGhlYWRpbmdzW2ldID0gaGVhZGluZ3NbaV0ucmVwbGFjZSgvW15hLXowLTldL2dpLCdfJykudG9Mb3dlckNhc2UoKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlmKGhlYWRpbmdzW2ldLmluZGV4T2YoJy4nKSA+IC0xKXtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aGVhZGluZ3NbaV0gPSBoZWFkaW5nc1tpXS5zdWJzdHIoMCwgaGVhZGluZ3NbaV0uaW5kZXhPZignLicpKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHZhciBoZWFkID0gaGVhZGluZ3NbaV0uc3BsaXQoJ18nKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlmKGhlYWQubGVuZ3RoID4gMSl7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGhlYWRpbmdzW2ldID0gJyc7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGZvcih2YXIgaiA9IDA7IGogPCBoZWFkLmxlbmd0aDsgaisrKXtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZihpc05hTihoZWFkW2pdKSl7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZihqID4gMCl7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGhlYWRpbmdzW2ldICs9ICdfJztcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGhlYWRpbmdzW2ldICs9IGhlYWRbal07XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlmKGhlYWRpbmdzW2ldLmxlbmd0aCA9PSAzKXtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aXNJc28ucHVzaCh0cnVlKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0aWYoaGVhZGluZ3MubGVuZ3RoID09IGlzSXNvLmxlbmd0aCl7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0aXNWZXJ0aWNhbCA9IHRydWU7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRmb3IodmFyIGkgPSAwOyBpIDw9IGhlYWRpbmdzLmxlbmd0aDsgaSsrKXtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWYodHlwZW9mIHJhd0xpc3RbaGVhZGluZ3NbaV1dID09IFwidW5kZWZpbmVkXCIpe1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJhd0xpc3RbaGVhZGluZ3NbaV1dID0ge307XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cmF3TGlzdFtoZWFkaW5nc1tpXV0uZGF0YSA9IFtdO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0XHQgICAgcmV0dXJuIGhlYWRpbmdzLmpvaW4oZGVsaW1pdGVyKSArIGNodW5rLnN1YnN0cihpbmRleCk7XG5cdFx0XHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHRcdFx0ZXJyb3I6IGZ1bmN0aW9uKGVyciwgZmlsZSlcblx0XHRcdFx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0VG9hc3RTZXJ2aWNlLmVycm9yKGVycik7XG5cdFx0XHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHRcdFx0Y29tcGxldGU6IGZ1bmN0aW9uKHJlc3VsdHMpXG5cdFx0XHRcdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdEluZGV4U2VydmljZS5zZXRFcnJvcnMoZXJyb3JzKTtcblxuXHRcdFx0XHRcdFx0XHRcdFx0XHQvL1NlZSBpZiB0aGVyZSBpcyBhbiBmaWVsZCBuYW1lIFwiaXNvXCIgaW4gdGhlIGhlYWRpbmdzO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZighaXNWZXJ0aWNhbCl7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKEluZGV4U2VydmljZS5nZXRGaXJzdEVudHJ5KCkuZGF0YVswXSwgZnVuY3Rpb24oaXRlbSwga2V5KXtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlmKGtleS50b0xvd2VyQ2FzZSgpLmluZGV4T2YoJ2lzbycpICE9IC0xIHx8IGtleS50b0xvd2VyQ2FzZSgpLmluZGV4T2YoJ2NvZGUnKSAhPSAtMSl7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdEluZGV4U2VydmljZS5zZXRJc29GaWVsZChrZXkpO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZihrZXkudG9Mb3dlckNhc2UoKS5pbmRleE9mKCdjb3VudHJ5JykgIT0gLTEpe1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdEluZGV4U2VydmljZS5zZXRDb3VudHJ5RmllbGQoa2V5KTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGVsc2V7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKHJhd0xpc3QsIGZ1bmN0aW9uKGl0ZW0sa2V5KXtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGl0ZW0uZXJyb3JzID0gW107XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZihrZXkudG9Mb3dlckNhc2UoKSAhPSBcInVuZGVmaW5lZFwiICYmIHR5cGVvZiBrZXkgIT0gXCJ1bmRlZmluZWRcIil7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHZhciByID0ge2lzbzprZXkudG9VcHBlckNhc2UoKX07XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChpdGVtLmRhdGEsIGZ1bmN0aW9uKGNvbHVtbiwgaSl7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0clsnY29sdW1uXycraV0gPSBjb2x1bW47XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWYoaXNOYU4oY29sdW1uKSB8fCBjb2x1bW4gPCAwICl7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZihjb2x1bW4udG9TdHJpbmcoKS50b1VwcGVyQ2FzZSgpID09IFwiTkFcIiB8fCBjb2x1bW4gPCAwIHx8IGNvbHVtbi50b1N0cmluZygpLnRvVXBwZXJDYXNlKCkuaW5kZXhPZignTi9BJykgPiAtMSl7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGl0ZW0uZXJyb3JzLnB1c2goe1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHR5cGU6XCIxXCIsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bWVzc2FnZTpcIkZpZWxkIGluIHJvdyBpcyBub3QgdmFsaWQgZm9yIGRhdGFiYXNlIHVzZSFcIixcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjb2x1bW46IGl0ZW1cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZXJyb3JzKys7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0SW5kZXhTZXJ2aWNlLmFkZERhdGEoe2RhdGE6W3JdLCBlcnJvcnM6aXRlbS5lcnJvcnN9KTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRJbmRleFNlcnZpY2Uuc2V0SXNvRmllbGQoJ2lzbycpO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cblxuXHRcdFx0XHRcdFx0XHRcdFx0XHRJbmRleFNlcnZpY2Uuc2V0VG9Mb2NhbFN0b3JhZ2UoKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0dG9hc3RyLmluZm8oSW5kZXhTZXJ2aWNlLmdldERhdGFTaXplKCkrJyBsaW5lcyBpbXBvcnRldCEnLCAnSW5mb3JtYXRpb24nKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0JHN0YXRlLmdvKCdhcHAuaW5kZXguY2hlY2snKTtcblx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH07XG5cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoICdhcHAuY29udHJvbGxlcnMnICkuY29udHJvbGxlciggJ1BhcnNlY3N2Q3RybCcsIGZ1bmN0aW9uKCl7XG5cdFx0Ly9cblxuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZGlyZWN0aXZlcycpLmRpcmVjdGl2ZSggJ3NpbXBsZWxpbmVjaGFydCcsIGZ1bmN0aW9uKCkge1xuXHRcdHZhciBkZWZhdWx0cyA9IGZ1bmN0aW9uKCl7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRpbnZlcnQ6ZmFsc2Vcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlc3RyaWN0OiAnRScsXG5cdFx0XHRzY29wZTp7XG5cdFx0XHRcdGRhdGE6Jz0nLFxuXHRcdFx0XHRzZWxlY3Rpb246Jz0nLFxuXHRcdFx0XHRvcHRpb25zOic9J1xuXHRcdFx0fSxcblx0XHRcdHRlbXBsYXRlVXJsOiAndmlld3MvZGlyZWN0aXZlcy9zaW1wbGVsaW5lY2hhcnQvc2ltcGxlbGluZWNoYXJ0Lmh0bWwnLFxuXHRcdFx0Y29udHJvbGxlcjogJ1NpbXBsZWxpbmVjaGFydEN0cmwnLFxuXHRcdFx0bGluazogZnVuY3Rpb24oICRzY29wZSwgZWxlbWVudCwgJGF0dHJzICl7XG5cdFx0XHRcdCRzY29wZS5vcHRpb25zID0gYW5ndWxhci5leHRlbmQoZGVmYXVsdHMoKSwgJHNjb3BlLm9wdGlvbnMpO1xuXHRcdFx0XHQkc2NvcGUuY2FsY3VsYXRlR3JhcGgoKTtcblx0XHRcdFx0JHNjb3BlLnNldENoYXJ0KCk7XG5cdFx0XHR9XG5cdFx0fTtcblxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdTaW1wbGVsaW5lY2hhcnRDdHJsJywgZnVuY3Rpb24gKCRzY29wZSkge1xuXHRcdCRzY29wZS5jb25maWcgPSB7XG5cdFx0XHR2aXNpYmxlOiB0cnVlLCAvLyBkZWZhdWx0OiB0cnVlXG5cdFx0XHRleHRlbmRlZDogZmFsc2UsIC8vIGRlZmF1bHQ6IGZhbHNlXG5cdFx0XHRkaXNhYmxlZDogZmFsc2UsIC8vIGRlZmF1bHQ6IGZhbHNlXG5cdFx0XHRhdXRvcmVmcmVzaDogdHJ1ZSwgLy8gZGVmYXVsdDogdHJ1ZVxuXHRcdFx0cmVmcmVzaERhdGFPbmx5OiBmYWxzZSwgLy8gZGVmYXVsdDogZmFsc2Vcblx0XHRcdGRlZXBXYXRjaE9wdGlvbnM6IHRydWUsIC8vIGRlZmF1bHQ6IHRydWVcblx0XHRcdGRlZXBXYXRjaERhdGE6IGZhbHNlLCAvLyBkZWZhdWx0OiBmYWxzZVxuXHRcdFx0ZGVlcFdhdGNoQ29uZmlnOiB0cnVlLCAvLyBkZWZhdWx0OiB0cnVlXG5cdFx0XHRkZWJvdW5jZTogMTAgLy8gZGVmYXVsdDogMTBcblx0XHR9O1xuXHRcdCRzY29wZS5jaGFydCA9IHtcblx0XHRcdG9wdGlvbnM6IHtcblx0XHRcdFx0Y2hhcnQ6IHt9XG5cdFx0XHR9LFxuXHRcdFx0ZGF0YTogW11cblx0XHR9O1xuXHRcdCRzY29wZS5zZXRDaGFydCA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdCRzY29wZS5jaGFydC5vcHRpb25zLmNoYXJ0ID0ge1xuXHRcdFx0XHR0eXBlOiAnbGluZUNoYXJ0Jyxcblx0XHRcdFx0bGVnZW5kUG9zaXRpb246ICdsZWZ0Jyxcblx0XHRcdFx0bWFyZ2luOiB7XG5cdFx0XHRcdFx0dG9wOiAyMCxcblx0XHRcdFx0XHRyaWdodDogMjAsXG5cdFx0XHRcdFx0Ym90dG9tOiAyMCxcblx0XHRcdFx0XHRsZWZ0OiAyMFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR4OiBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdHJldHVybiBkLng7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdHk6IGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGQueTtcblx0XHRcdFx0fSxcblx0XHRcdFx0c2hvd0xlZ2VuZDogZmFsc2UsXG5cdFx0XHRcdHNob3dWYWx1ZXM6IGZhbHNlLFxuXHRcdFx0XHRzaG93WUF4aXM6IGZhbHNlLFxuXHRcdFx0XHR0cmFuc2l0aW9uRHVyYXRpb246IDUwMCxcblx0XHRcdFx0dXNlSW50ZXJhY3RpdmVHdWlkZWxpbmU6IHRydWUsXG5cdFx0XHRcdC8vZm9yY2VZOiBbMTAwLCAwXSxcblx0XHRcdFx0Ly95RG9tYWluOnlEb21haW4sXG5cdFx0XHRcdHhBeGlzOiB7XG5cdFx0XHRcdFx0YXhpc0xhYmVsOiAnJ1xuXHRcdFx0XHR9LFxuXHRcdFx0XHR5QXhpczoge1xuXHRcdFx0XHRcdGF4aXNMYWJlbDogJycsXG5cdFx0XHRcdFx0YXhpc0xhYmVsRGlzdGFuY2U6IDMwXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGxlZ2VuZDoge1xuXHRcdFx0XHRcdHJpZ2h0QWxpZ246IGZhbHNlXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGxpbmVzOiB7XG5cdFx0XHRcdFx0aW50ZXJwb2xhdGU6ICdjYXJkaW5hbCdcblx0XHRcdFx0fVxuXG5cdFx0XHR9O1xuXHRcdFx0aWYgKCRzY29wZS5vcHRpb25zLmludmVydCA9PSB0cnVlKSB7XG5cdFx0XHRcdCRzY29wZS5jaGFydC5vcHRpb25zLmNoYXJ0LnlEb21haW4gPSBbcGFyc2VJbnQoJHNjb3BlLnJhbmdlLm1heCksICRzY29wZS5yYW5nZS5taW5dO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuICRzY29wZS5jaGFydDtcblx0XHR9XG5cdFx0JHNjb3BlLmNhbGN1bGF0ZUdyYXBoID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0dmFyIGNoYXJ0RGF0YSA9IFtdO1xuXHRcdFx0JHNjb3BlLnJhbmdlID0ge1xuXHRcdFx0XHRtYXg6IDAsXG5cdFx0XHRcdG1pbjogMTAwMFxuXHRcdFx0fTtcblx0XHRcdGFuZ3VsYXIuZm9yRWFjaCgkc2NvcGUuc2VsZWN0aW9uLCBmdW5jdGlvbiAoaXRlbSwga2V5KSB7XG5cdFx0XHRcdHZhciBncmFwaCA9IHtcblx0XHRcdFx0XHRpZDoga2V5LFxuXHRcdFx0XHRcdGtleTogaXRlbS50aXRsZSxcblx0XHRcdFx0XHRjb2xvcjogaXRlbS5jb2xvcixcblx0XHRcdFx0XHR2YWx1ZXM6IFtdXG5cdFx0XHRcdH07XG5cdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaCgkc2NvcGUuZGF0YSwgZnVuY3Rpb24gKGRhdGEsIGspIHtcblx0XHRcdFx0XHRncmFwaC52YWx1ZXMucHVzaCh7XG5cdFx0XHRcdFx0XHRpZDogayxcblx0XHRcdFx0XHRcdHg6IGRhdGFbaXRlbS5maWVsZHMueF0sXG5cdFx0XHRcdFx0XHR5OiBkYXRhW2l0ZW0uZmllbGRzLnldXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0JHNjb3BlLnJhbmdlLm1heCA9IE1hdGgubWF4KCRzY29wZS5yYW5nZS5tYXgsIGRhdGFbaXRlbS5maWVsZHMueV0pO1xuXHRcdFx0XHRcdCRzY29wZS5yYW5nZS5taW4gPSBNYXRoLm1pbigkc2NvcGUucmFuZ2UubWluLCBkYXRhW2l0ZW0uZmllbGRzLnldKTtcblx0XHRcdFx0fSk7XG5cdFx0XHRcdGNoYXJ0RGF0YS5wdXNoKGdyYXBoKTtcblx0XHRcdH0pO1xuXG5cdFx0XHQkc2NvcGUuY2hhcnQuZGF0YSA9IGNoYXJ0RGF0YTtcblx0XHRcdGlmICgkc2NvcGUub3B0aW9ucy5pbnZlcnQgPT0gXCJ0cnVlXCIpIHtcblx0XHRcdFx0JHNjb3BlLmNoYXJ0Lm9wdGlvbnMuY2hhcnQueURvbWFpbiA9IFtwYXJzZUludCgkc2NvcGUucmFuZ2UubWF4KSwgJHNjb3BlLnJhbmdlLm1pbl07XG5cdFx0XHR9XG5cdFx0fTtcblx0XHQkc2NvcGUuJHdhdGNoKCdkYXRhJywgZnVuY3Rpb24gKG4sIG8pIHtcblx0XHRcdGlmICghbikge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0XHQkc2NvcGUuY2FsY3VsYXRlR3JhcGgoKTtcblx0XHR9KTtcblx0XHQkc2NvcGUuJHdhdGNoKCdzZWxlY3Rpb24nLCBmdW5jdGlvbiAobiwgbykge1xuXHRcdFx0aWYgKG4gPT09IG8pIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdFx0JHNjb3BlLmNhbGN1bGF0ZUdyYXBoKCk7XG5cdFx0fSlcblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5kaXJlY3RpdmVzJykuYW5pbWF0aW9uKCcuc2xpZGUtdG9nZ2xlJywgWyckYW5pbWF0ZUNzcycsIGZ1bmN0aW9uKCRhbmltYXRlQ3NzKSB7XG5cblx0XHR2YXIgbGFzdElkID0gMDtcbiAgICAgICAgdmFyIF9jYWNoZSA9IHt9O1xuXG4gICAgICAgIGZ1bmN0aW9uIGdldElkKGVsKSB7XG4gICAgICAgICAgICB2YXIgaWQgPSBlbFswXS5nZXRBdHRyaWJ1dGUoXCJkYXRhLXNsaWRlLXRvZ2dsZVwiKTtcbiAgICAgICAgICAgIGlmICghaWQpIHtcbiAgICAgICAgICAgICAgICBpZCA9ICsrbGFzdElkO1xuICAgICAgICAgICAgICAgIGVsWzBdLnNldEF0dHJpYnV0ZShcImRhdGEtc2xpZGUtdG9nZ2xlXCIsIGlkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBpZDtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBnZXRTdGF0ZShpZCkge1xuICAgICAgICAgICAgdmFyIHN0YXRlID0gX2NhY2hlW2lkXTtcbiAgICAgICAgICAgIGlmICghc3RhdGUpIHtcbiAgICAgICAgICAgICAgICBzdGF0ZSA9IHt9O1xuICAgICAgICAgICAgICAgIF9jYWNoZVtpZF0gPSBzdGF0ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGdlbmVyYXRlUnVubmVyKGNsb3NpbmcsIHN0YXRlLCBhbmltYXRvciwgZWxlbWVudCwgZG9uZUZuKSB7XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgc3RhdGUuYW5pbWF0aW5nID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBzdGF0ZS5hbmltYXRvciA9IGFuaW1hdG9yO1xuICAgICAgICAgICAgICAgIHN0YXRlLmRvbmVGbiA9IGRvbmVGbjtcbiAgICAgICAgICAgICAgICBhbmltYXRvci5zdGFydCgpLmZpbmFsbHkoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjbG9zaW5nICYmIHN0YXRlLmRvbmVGbiA9PT0gZG9uZUZuKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50WzBdLnN0eWxlLmhlaWdodCA9ICcnO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHN0YXRlLmFuaW1hdGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBzdGF0ZS5hbmltYXRvciA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAgICAgc3RhdGUuZG9uZUZuKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgbGVhdmU6IGZ1bmN0aW9uKGVsZW1lbnQsIGRvbmVGbikge1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciBzdGF0ZSA9IGdldFN0YXRlKGdldElkKGVsZW1lbnQpKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGhlaWdodCA9IChzdGF0ZS5hbmltYXRpbmcgJiYgc3RhdGUuaGVpZ2h0KSA/XG4gICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZS5oZWlnaHQgOiBlbGVtZW50WzBdLm9mZnNldEhlaWdodDtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGFuaW1hdG9yID0gJGFuaW1hdGVDc3MoZWxlbWVudCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgZnJvbToge2hlaWdodDogaGVpZ2h0ICsgJ3B4Jywgb3BhY2l0eTogMX0sXG4gICAgICAgICAgICAgICAgICAgICAgICB0bzoge2hlaWdodDogJzBweCcsIG9wYWNpdHk6IDB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBpZiAoYW5pbWF0b3IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzdGF0ZS5hbmltYXRpbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZS5kb25lRm4gPVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2VuZXJhdGVSdW5uZXIodHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5pbWF0b3IsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZG9uZUZuKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gc3RhdGUuYW5pbWF0b3IuZW5kKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZS5oZWlnaHQgPSBoZWlnaHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGdlbmVyYXRlUnVubmVyKHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbmltYXRvcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZG9uZUZuKSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBkb25lRm4oKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlbnRlcjogZnVuY3Rpb24oZWxlbWVudCwgZG9uZUZuKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIHN0YXRlID0gZ2V0U3RhdGUoZ2V0SWQoZWxlbWVudCkpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgaGVpZ2h0ID0gKHN0YXRlLmFuaW1hdGluZyAmJiBzdGF0ZS5oZWlnaHQpID9cbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlLmhlaWdodCA6IGVsZW1lbnRbMF0ub2Zmc2V0SGVpZ2h0O1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciBhbmltYXRvciA9ICRhbmltYXRlQ3NzKGVsZW1lbnQsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZyb206IHtoZWlnaHQ6ICcwcHgnLCBvcGFjaXR5OiAwfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvOiB7aGVpZ2h0OiBoZWlnaHQgKyAncHgnLCBvcGFjaXR5OiAxfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFuaW1hdG9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3RhdGUuYW5pbWF0aW5nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGUuZG9uZUZuID0gZ2VuZXJhdGVSdW5uZXIoZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5pbWF0b3IsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkb25lRm4pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBzdGF0ZS5hbmltYXRvci5lbmQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlLmhlaWdodCA9IGhlaWdodDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZ2VuZXJhdGVSdW5uZXIoZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbmltYXRvcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZG9uZUZuKSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBkb25lRm4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XSk7XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCAnYXBwLmNvbnRyb2xsZXJzJyApLmNvbnRyb2xsZXIoICdTbGlkZVRvZ2dsZUN0cmwnLCBmdW5jdGlvbigpe1xuXHRcdC8vXG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmRpcmVjdGl2ZXMnKS5kaXJlY3RpdmUoJ3N1YmluZGV4Jywgc3ViaW5kZXgpO1xuXG5cdHN1YmluZGV4LiRpbmplY3QgPSBbJyR0aW1lb3V0JywgJ3Ntb290aFNjcm9sbCddO1xuXG5cdGZ1bmN0aW9uIHN1YmluZGV4KCR0aW1lb3V0LCBzbW9vdGhTY3JvbGwpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0cmVzdHJpY3Q6ICdFJyxcblx0XHRcdHJlcGxhY2U6IHRydWUsXG5cdFx0XHRjb250cm9sbGVyOiAnU3ViaW5kZXhDdHJsJyxcblx0XHRcdHRlbXBsYXRlVXJsOiAndmlld3MvZGlyZWN0aXZlcy9zdWJpbmRleC9zdWJpbmRleC5odG1sJyxcblx0XHRcdGxpbms6IHN1YmluZGV4TGlua0Z1bmN0aW9uXG5cdFx0fTtcblxuXHRcdGZ1bmN0aW9uIHN1YmluZGV4TGlua0Z1bmN0aW9uKCRzY29wZSwgZWxlbWVudCwgJGF0dHJzKSB7XG5cdFx0fVxuXHR9XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignU3ViaW5kZXhDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCAkZmlsdGVyLCAkdGltZW91dCkge1xuXHRcdCRzY29wZS5pbmZvID0gZmFsc2U7XG5cdFx0JHNjb3BlLnNldENoYXJ0ID0gc2V0Q2hhcnQ7XG5cdFx0JHNjb3BlLmNhbGN1bGF0ZUdyYXBoID0gY2FsY3VsYXRlR3JhcGg7XG5cdFx0JHNjb3BlLmNyZWF0ZUluZGV4ZXIgPSBjcmVhdGVJbmRleGVyO1xuXHRcdCRzY29wZS5jYWxjU3ViUmFuayA9IGNhbGNTdWJSYW5rO1xuXHRcdCRzY29wZS50b2dnbGVJbmZvID0gdG9nZ2xlSW5mbztcblx0XHQkc2NvcGUuY3JlYXRlT3B0aW9ucyA9IGNyZWF0ZU9wdGlvbnM7XG5cdFx0JHNjb3BlLmdldFN1YlJhbmsgPSBnZXRTdWJSYW5rO1xuXHRcdGFjdGl2YXRlKCk7XG5cblx0XHRmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcblx0XHRcdCRzY29wZS5jYWxjU3ViUmFuaygpO1xuXHRcdFx0JHNjb3BlLnNldENoYXJ0KCk7XG5cdFx0XHQkc2NvcGUuY2FsY3VsYXRlR3JhcGgoKTtcblx0XHRcdCRzY29wZS5jcmVhdGVJbmRleGVyKCk7XG5cdFx0XHQkc2NvcGUuY3JlYXRlT3B0aW9ucygpO1xuXHRcdFx0JHNjb3BlLiR3YXRjaCgnZGlzcGxheS5zZWxlY3RlZENhdCcsIGZ1bmN0aW9uKG5ld0l0ZW0sIG9sZEl0ZW0pIHtcblx0XHRcdFx0aWYgKG5ld0l0ZW0gPT09IG9sZEl0ZW0pIHtcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdH1cblx0XHRcdFx0JHNjb3BlLmNyZWF0ZUluZGV4ZXIoKTtcblx0XHRcdFx0JHNjb3BlLmNhbGN1bGF0ZUdyYXBoKCk7XG5cdFx0XHRcdCRzY29wZS5jcmVhdGVPcHRpb25zKCk7XG5cdFx0XHRcdCRzY29wZS5jYWxjU3ViUmFuaygpO1xuXHRcdFx0fSk7XG5cdFx0XHQkc2NvcGUuJHdhdGNoKCdjdXJyZW50JywgZnVuY3Rpb24obiwgbykge1xuXHRcdFx0XHRpZiAobiA9PT0gbykge1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXHRcdFx0XHQkc2NvcGUuY2FsY1N1YlJhbmsoKTtcblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIHRvZ2dsZUluZm8oKSB7XG5cdFx0XHQkc2NvcGUuaW5mbyA9ICEkc2NvcGUuaW5mbztcblx0XHR9O1xuXG5cdFx0ZnVuY3Rpb24gY2FsY1N1YlJhbmsoKSB7XG5cdFx0XHR2YXIgcmFuayA9IDA7XG5cdFx0XHRhbmd1bGFyLmZvckVhY2goJHNjb3BlLmRhdGEsIGZ1bmN0aW9uKGl0ZW0pIHtcblx0XHRcdFx0aXRlbVskc2NvcGUuZGlzcGxheS5zZWxlY3RlZENhdC50eXBlXSA9IHBhcnNlRmxvYXQoaXRlbVskc2NvcGUuZGlzcGxheS5zZWxlY3RlZENhdC50eXBlXSk7XG5cdFx0XHRcdGl0ZW1bJ3Njb3JlJ10gPSBwYXJzZUludChpdGVtWydzY29yZSddKTtcblx0XHRcdH0pXG5cdFx0XHR2YXIgZmlsdGVyID0gJGZpbHRlcignb3JkZXJCeScpKCRzY29wZS5lcGksIFskc2NvcGUuZGlzcGxheS5zZWxlY3RlZENhdC50eXBlLCBcInNjb3JlXCJdLCB0cnVlKTtcblx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgZmlsdGVyLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdGlmIChmaWx0ZXJbaV0uaXNvID09ICRzY29wZS5jdXJyZW50Lmlzbykge1xuXHRcdFx0XHRcdHJhbmsgPSBpICsgMTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0JHNjb3BlLmN1cnJlbnRbJHNjb3BlLmRpc3BsYXkuc2VsZWN0ZWRDYXQudHlwZSsnX3JhbmsnXSA9IHJhbms7XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIGdldFN1YlJhbmsoY291bnRyeSl7XG5cdFx0XHR2YXIgZmlsdGVyID0gJGZpbHRlcignb3JkZXJCeScpKCRzY29wZS5lcGksIFskc2NvcGUuZGlzcGxheS5zZWxlY3RlZENhdC50eXBlLCBcInNjb3JlXCJdLCB0cnVlKTtcblx0XHRcdHZhciByYW5rID0gMDtcblx0XHRcdGFuZ3VsYXIuZm9yRWFjaChmaWx0ZXIsIGZ1bmN0aW9uKGl0ZW0sIGtleSl7XG5cdFx0XHRcdGlmKGl0ZW0uY291bnRyeSA9PSBjb3VudHJ5LmNvdW50cnkpe1xuXHRcdFx0XHRcdHJhbmsgPSBrZXk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdFx0cmV0dXJuIHJhbmsrMTtcblx0XHR9XG5cdFx0ZnVuY3Rpb24gY3JlYXRlSW5kZXhlcigpIHtcblx0XHRcdCRzY29wZS5pbmRleGVyID0gWyRzY29wZS4kcGFyZW50LmRpc3BsYXkuc2VsZWN0ZWRDYXQuZGF0YV07XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gY3JlYXRlT3B0aW9ucygpIHtcblx0XHRcdCRzY29wZS5tZWRpYW5PcHRpb25zID0ge1xuXHRcdFx0XHRjb2xvcjogJHNjb3BlLiRwYXJlbnQuZGlzcGxheS5zZWxlY3RlZENhdC5jb2xvcixcblx0XHRcdFx0ZmllbGQ6ICRzY29wZS4kcGFyZW50LmRpc3BsYXkuc2VsZWN0ZWRDYXQudHlwZSxcblx0XHRcdFx0aGFuZGxpbmc6IGZhbHNlLFxuXHRcdFx0XHRtYXJnaW46e1xuXHRcdFx0XHRcdGxlZnQ6MTBcblx0XHRcdFx0fVxuXHRcdFx0fTtcblx0XHRcdCRzY29wZS5tZWRpYW5PcHRpb25zQmlnID0ge1xuXHRcdFx0XHRjb2xvcjogJHNjb3BlLiRwYXJlbnQuZGlzcGxheS5zZWxlY3RlZENhdC5jb2xvcixcblx0XHRcdFx0ZmllbGQ6ICRzY29wZS4kcGFyZW50LmRpc3BsYXkuc2VsZWN0ZWRDYXQudHlwZSxcblx0XHRcdFx0aGFuZGxpbmc6IGZhbHNlLFxuXHRcdFx0XHRtYXJnaW46e1xuXHRcdFx0XHRcdGxlZnQ6MjBcblx0XHRcdFx0fVxuXHRcdFx0fTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBzZXRDaGFydCgpIHtcblx0XHRcdCRzY29wZS5jaGFydCA9IHtcblx0XHRcdFx0b3B0aW9uczoge1xuXHRcdFx0XHRcdGNoYXJ0OiB7XG5cdFx0XHRcdFx0XHR0eXBlOiAnbGluZUNoYXJ0Jyxcblx0XHRcdFx0XHRcdC8vaGVpZ2h0OiAyMDAsXG5cdFx0XHRcdFx0XHRsZWdlbmRQb3NpdGlvbjogJ2xlZnQnLFxuXHRcdFx0XHRcdFx0bWFyZ2luOiB7XG5cdFx0XHRcdFx0XHRcdHRvcDogMjAsXG5cdFx0XHRcdFx0XHRcdHJpZ2h0OiAyMCxcblx0XHRcdFx0XHRcdFx0Ym90dG9tOiAyMCxcblx0XHRcdFx0XHRcdFx0bGVmdDogMjBcblx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHR4OiBmdW5jdGlvbihkKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBkLng7XG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0eTogZnVuY3Rpb24oZCkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gZC55O1xuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdHNob3dWYWx1ZXM6IGZhbHNlLFxuXHRcdFx0XHRcdFx0c2hvd1lBeGlzOiBmYWxzZSxcblx0XHRcdFx0XHRcdHRyYW5zaXRpb25EdXJhdGlvbjogNTAwLFxuXHRcdFx0XHRcdFx0dXNlSW50ZXJhY3RpdmVHdWlkZWxpbmU6IHRydWUsXG5cdFx0XHRcdFx0XHRmb3JjZVk6IFsxMDAsIDBdLFxuXHRcdFx0XHRcdFx0eEF4aXM6IHtcblx0XHRcdFx0XHRcdFx0YXhpc0xhYmVsOiAnJ1xuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdHlBeGlzOiB7XG5cdFx0XHRcdFx0XHRcdGF4aXNMYWJlbDogJycsXG5cdFx0XHRcdFx0XHRcdGF4aXNMYWJlbERpc3RhbmNlOiAzMFxuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdGxlZ2VuZDoge1xuXHRcdFx0XHRcdFx0XHRyaWdodEFsaWduOiBmYWxzZSxcblx0XHRcdFx0XHRcdFx0bWFyZ2luOiB7XG5cdFx0XHRcdFx0XHRcdFx0Ym90dG9tOiAzMFxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0bGluZXM6IHtcblx0XHRcdFx0XHRcdFx0aW50ZXJwb2xhdGU6ICdjYXJkaW5hbCdcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sXG5cdFx0XHRcdGRhdGE6IFtdXG5cdFx0XHR9O1xuXHRcdFx0cmV0dXJuICRzY29wZS5jaGFydDtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBjYWxjdWxhdGVHcmFwaCgpIHtcblx0XHRcdHZhciBjaGFydERhdGEgPSBbXTtcblx0XHRcdGFuZ3VsYXIuZm9yRWFjaCgkc2NvcGUuZGlzcGxheS5zZWxlY3RlZENhdC5jaGlsZHJlbiwgZnVuY3Rpb24oaXRlbSwga2V5KSB7XG5cdFx0XHRcdHZhciBncmFwaCA9IHtcblx0XHRcdFx0XHRrZXk6IGl0ZW0udGl0bGUsXG5cdFx0XHRcdFx0Y29sb3I6IGl0ZW0uY29sb3IsXG5cdFx0XHRcdFx0dmFsdWVzOiBbXVxuXHRcdFx0XHR9O1xuXHRcdFx0XHRhbmd1bGFyLmZvckVhY2goJHNjb3BlLmNvdW50cnkuZXBpLCBmdW5jdGlvbihkYXRhKSB7XG5cdFx0XHRcdFx0Z3JhcGgudmFsdWVzLnB1c2goe1xuXHRcdFx0XHRcdFx0eDogZGF0YS55ZWFyLFxuXHRcdFx0XHRcdFx0eTogZGF0YVtpdGVtLmNvbHVtbl9uYW1lXVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9KTtcblx0XHRcdFx0Y2hhcnREYXRhLnB1c2goZ3JhcGgpO1xuXHRcdFx0fSk7XG5cdFx0XHQkc2NvcGUuY2hhcnQuZGF0YSA9IGNoYXJ0RGF0YTtcblx0XHR9XG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5kaXJlY3RpdmVzJykuZGlyZWN0aXZlKCdzdW5idXJzdCcsIGZ1bmN0aW9uICgpIHtcblx0XHR2YXIgZGVmYXVsdHMgPSBmdW5jdGlvbigpe1xuXHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdCBtb2RlOiAnc2l6ZSdcblx0XHRcdFx0fVxuXHRcdH07XG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlc3RyaWN0OiAnRScsXG5cdFx0XHQvL3RlbXBsYXRlVXJsOiAndmlld3MvZGlyZWN0aXZlcy9zdW5idXJzdC9zdW5idXJzdC5odG1sJyxcblx0XHRcdGNvbnRyb2xsZXI6ICdTdW5idXJzdEN0cmwnLFxuXHRcdFx0c2NvcGU6IHtcblx0XHRcdFx0ZGF0YTogJz0nXG5cdFx0XHR9LFxuXHRcdFx0bGluazogZnVuY3Rpb24gKCRzY29wZSwgZWxlbWVudCwgJGF0dHJzKSB7XG5cdFx0XHRcdHZhciBvcHRpb25zID0gYW5ndWxhci5leHRlbmQoZGVmYXVsdHMoKSwgJGF0dHJzKTtcblx0XHRcdFx0JHNjb3BlLnNldENoYXJ0KCk7XG5cdFx0XHRcdCRzY29wZS5jYWxjdWxhdGVHcmFwaCgpO1xuXHRcdFx0XHR2YXIgd2lkdGggPSA2MTAsXG5cdFx0XHRcdFx0aGVpZ2h0ID0gd2lkdGgsXG5cdFx0XHRcdFx0cmFkaXVzID0gKHdpZHRoKSAvIDIsXG5cdFx0XHRcdFx0eCA9IGQzLnNjYWxlLmxpbmVhcigpLnJhbmdlKFswLCAyICogTWF0aC5QSV0pLFxuXHRcdFx0XHRcdHkgPSBkMy5zY2FsZS5wb3coKS5leHBvbmVudCgxLjMpLmRvbWFpbihbMCwgMV0pLnJhbmdlKFswLCByYWRpdXNdKSxcblxuXHRcdFx0XHRcdHBhZGRpbmcgPSAwLFxuXHRcdFx0XHRcdGR1cmF0aW9uID0gMTAwMCxcblx0XHRcdFx0XHRjaXJjUGFkZGluZyA9IDEwO1xuXG5cdFx0XHRcdHZhciBkaXYgPSBkMy5zZWxlY3QoZWxlbWVudFswXSk7XG5cblxuXHRcdFx0XHR2YXIgdmlzID0gZGl2LmFwcGVuZChcInN2Z1wiKVxuXHRcdFx0XHRcdC5hdHRyKFwid2lkdGhcIiwgd2lkdGggKyBwYWRkaW5nICogMilcblx0XHRcdFx0XHQuYXR0cihcImhlaWdodFwiLCBoZWlnaHQgKyBwYWRkaW5nICogMilcblx0XHRcdFx0XHQuYXBwZW5kKFwiZ1wiKVxuXHRcdFx0XHRcdC5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiICsgW3JhZGl1cyArIHBhZGRpbmcsIHJhZGl1cyArIHBhZGRpbmddICsgXCIpXCIpO1xuXG5cdFx0XHRcdC8qXG5cdFx0XHRcdGRpdi5hcHBlbmQoXCJwXCIpXG5cdFx0XHRcdFx0XHQuYXR0cihcImlkXCIsIFwiaW50cm9cIilcblx0XHRcdFx0XHRcdC50ZXh0KFwiQ2xpY2sgdG8gem9vbSFcIik7XG5cdFx0XHRcdCovXG5cblx0XHRcdFx0dmFyIHBhcnRpdGlvbiA9IGQzLmxheW91dC5wYXJ0aXRpb24oKVxuXHRcdFx0XHRcdC5zb3J0KG51bGwpXG5cdFx0XHRcdFx0LnZhbHVlKGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gMTtcblx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHR2YXIgYXJjID0gZDMuc3ZnLmFyYygpXG5cdFx0XHRcdFx0LnN0YXJ0QW5nbGUoZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdHJldHVybiBNYXRoLm1heCgwLCBNYXRoLm1pbigyICogTWF0aC5QSSwgeChkLngpKSk7XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQuZW5kQW5nbGUoZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdHJldHVybiBNYXRoLm1heCgwLCBNYXRoLm1pbigyICogTWF0aC5QSSwgeChkLnggKyBkLmR4KSkpO1xuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0LmlubmVyUmFkaXVzKGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gTWF0aC5tYXgoMCwgZC55ID8geShkLnkpIDogZC55KTtcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC5vdXRlclJhZGl1cyhmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIE1hdGgubWF4KDAsIHkoZC55ICsgZC5keSkpO1xuXHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdHZhciBzcGVjaWFsMSA9IFwiV2FzdGV3YXRlciBUcmVhdG1lbnRcIixcblx0XHRcdFx0XHRzcGVjaWFsMiA9IFwiQWlyIFBvbGx1dGlvbiBQTTIuNSBFeGNlZWRhbmNlXCIsXG5cdFx0XHRcdFx0c3BlY2lhbDMgPSBcIkFncmljdWx0dXJhbCBTdWJzaWRpZXNcIixcblx0XHRcdFx0XHRzcGVjaWFsNCA9IFwiUGVzdGljaWRlIFJlZ3VsYXRpb25cIjtcblxuXG5cdFx0XHRcdHZhciBub2RlcyA9IHBhcnRpdGlvbi5ub2Rlcygkc2NvcGUuY2FsY3VsYXRlR3JhcGgoKSk7XG5cblx0XHRcdFx0dmFyIHBhdGggPSB2aXMuc2VsZWN0QWxsKFwicGF0aFwiKS5kYXRhKG5vZGVzKTtcblx0XHRcdFx0cGF0aC5lbnRlcigpLmFwcGVuZChcInBhdGhcIilcblx0XHRcdFx0XHQuYXR0cihcImlkXCIsIGZ1bmN0aW9uIChkLCBpKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gXCJwYXRoLVwiICsgaTtcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC5hdHRyKFwiZFwiLCBhcmMpXG5cdFx0XHRcdFx0LmF0dHIoXCJmaWxsLXJ1bGVcIiwgXCJldmVub2RkXCIpXG5cdFx0XHRcdFx0LmF0dHIoXCJjbGFzc1wiLCBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGQuZGVwdGggPyBcImJyYW5jaFwiIDogXCJyb290XCI7XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQuc3R5bGUoXCJmaWxsXCIsIHNldENvbG9yKVxuXHRcdFx0XHRcdC5vbihcImNsaWNrXCIsIGNsaWNrKTtcblxuXHRcdFx0XHR2YXIgdGV4dCA9IHZpcy5zZWxlY3RBbGwoXCJ0ZXh0XCIpLmRhdGEobm9kZXMpO1xuXHRcdFx0XHR2YXIgdGV4dEVudGVyID0gdGV4dC5lbnRlcigpLmFwcGVuZChcInRleHRcIilcblx0XHRcdFx0XHQuc3R5bGUoXCJmaWxsLW9wYWNpdHlcIiwgMSlcblx0XHRcdFx0XHQuYXR0cihcInRleHQtYW5jaG9yXCIsIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRpZiAoZC5kZXB0aClcblx0XHRcdFx0XHRcdFx0cmV0dXJuIFwibWlkZGxlXCI7XG5cdFx0XHRcdFx0XHQvL34gcmV0dXJuIHgoZC54ICsgZC5keCAvIDIpID4gTWF0aC5QSSA/IFwiZW5kXCIgOiBcInN0YXJ0XCI7XG5cdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdHJldHVybiBcIm1pZGRsZVwiO1xuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0LmF0dHIoXCJpZFwiLCBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIFwiZGVwdGhcIiArIGQuZGVwdGg7XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQuYXR0cihcImNsYXNzXCIsIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gXCJzZWN0b3JcIlxuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0LmF0dHIoXCJkeVwiLCBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGQuZGVwdGggPyBcIi4yZW1cIiA6IFwiMC4zNWVtXCI7XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQuYXR0cihcInRyYW5zZm9ybVwiLCBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0dmFyIG11bHRpbGluZSA9IChkLm5hbWUgfHwgXCJcIikuc3BsaXQoXCIgXCIpLmxlbmd0aCA+IDIsXG5cdFx0XHRcdFx0XHRcdGFuZ2xlQWxpZ24gPSAoZC54ID4gMC41ID8gMiA6IC0yKSxcblx0XHRcdFx0XHRcdFx0YW5nbGUgPSB4KGQueCArIGQuZHggLyAyKSAqIDE4MCAvIE1hdGguUEkgLSA5MCArIChtdWx0aWxpbmUgPyBhbmdsZUFsaWduIDogMCksXG5cdFx0XHRcdFx0XHRcdHJvdGF0ZSA9IGFuZ2xlICsgKG11bHRpbGluZSA/IC0uNSA6IDApLFxuXHRcdFx0XHRcdFx0XHR0cmFuc2wgPSAoeShkLnkpICsgY2lyY1BhZGRpbmcpICsgMzUsXG5cdFx0XHRcdFx0XHRcdHNlY0FuZ2xlID0gKGFuZ2xlID4gOTAgPyAtMTgwIDogMCk7XG5cdFx0XHRcdFx0XHRpZiAoZC5uYW1lID09IHNwZWNpYWwzIHx8IGQubmFtZSA9PSBzcGVjaWFsNCkgcm90YXRlICs9IDE7XG5cdFx0XHRcdFx0XHRpZiAoZC5kZXB0aCA9PSAwKSB7XG5cdFx0XHRcdFx0XHRcdHRyYW5zbCA9IC0yLjUwO1xuXHRcdFx0XHRcdFx0XHRyb3RhdGUgPSAwO1xuXHRcdFx0XHRcdFx0XHRzZWNBbmdsZSA9IDA7XG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKGQuZGVwdGggPT0gMSkgdHJhbnNsICs9IC05O1xuXHRcdFx0XHRcdFx0ZWxzZSBpZiAoZC5kZXB0aCA9PSAyKSB0cmFuc2wgKz0gLTU7XG5cdFx0XHRcdFx0XHRlbHNlIGlmIChkLmRlcHRoID09IDMpIHRyYW5zbCArPSA0O1xuXHRcdFx0XHRcdFx0cmV0dXJuIFwicm90YXRlKFwiICsgcm90YXRlICsgXCIpdHJhbnNsYXRlKFwiICsgdHJhbnNsICsgXCIpcm90YXRlKFwiICsgc2VjQW5nbGUgKyBcIilcIjtcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC5vbihcImNsaWNrXCIsIGNsaWNrKTtcblxuXHRcdFx0XHR0ZXh0RW50ZXIuYXBwZW5kKFwidHNwYW5cIilcblx0XHRcdFx0XHQuYXR0cihcInhcIiwgMClcblx0XHRcdFx0XHQudGV4dChmdW5jdGlvbiAoZCkge1xuXG5cdFx0XHRcdFx0XHRpZiAoZC5kZXB0aCA9PSAzICYmIGQubmFtZSAhPSBzcGVjaWFsMSAmJiBkLm5hbWUgIT0gc3BlY2lhbDIgJiYgZC5uYW1lICE9IHNwZWNpYWwzICYmIGQubmFtZSAhPSBzcGVjaWFsNClcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGQubmFtZS5zcGxpdChcIiBcIilbMF0gKyBcIiBcIiArIChkLm5hbWUuc3BsaXQoXCIgXCIpWzFdIHx8IFwiXCIpO1xuXHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gZC5uYW1lLnNwbGl0KFwiIFwiKVswXTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0dGV4dEVudGVyLmFwcGVuZChcInRzcGFuXCIpXG5cdFx0XHRcdFx0LmF0dHIoXCJ4XCIsIDApXG5cdFx0XHRcdFx0LmF0dHIoXCJkeVwiLCBcIjFlbVwiKVxuXHRcdFx0XHRcdC50ZXh0KGZ1bmN0aW9uIChkKSB7XG5cblx0XHRcdFx0XHRcdGlmIChkLmRlcHRoID09IDMgJiYgZC5uYW1lICE9IHNwZWNpYWwxICYmIGQubmFtZSAhPSBzcGVjaWFsMiAmJiBkLm5hbWUgIT0gc3BlY2lhbDMgJiYgZC5uYW1lICE9IHNwZWNpYWw0KVxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gKGQubmFtZS5zcGxpdChcIiBcIilbMl0gfHwgXCJcIikgKyBcIiBcIiArIChkLm5hbWUuc3BsaXQoXCIgXCIpWzNdIHx8IFwiXCIpO1xuXHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gKGQubmFtZS5zcGxpdChcIiBcIilbMV0gfHwgXCJcIikgKyBcIiBcIiArIChkLm5hbWUuc3BsaXQoXCIgXCIpWzJdIHx8IFwiXCIpO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR0ZXh0RW50ZXIuYXBwZW5kKFwidHNwYW5cIilcblx0XHRcdFx0XHQuYXR0cihcInhcIiwgMClcblx0XHRcdFx0XHQuYXR0cihcImR5XCIsIFwiMWVtXCIpXG5cdFx0XHRcdFx0LnRleHQoZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdGlmIChkLmRlcHRoID09IDMgJiYgZC5uYW1lICE9IHNwZWNpYWwxICYmIGQubmFtZSAhPSBzcGVjaWFsMiAmJiBkLm5hbWUgIT0gc3BlY2lhbDMgJiYgZC5uYW1lICE9IHNwZWNpYWw0KVxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gKGQubmFtZS5zcGxpdChcIiBcIilbNF0gfHwgXCJcIikgKyBcIiBcIiArIChkLm5hbWUuc3BsaXQoXCIgXCIpWzVdIHx8IFwiXCIpO1xuXHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gKGQubmFtZS5zcGxpdChcIiBcIilbM10gfHwgXCJcIikgKyBcIiBcIiArIChkLm5hbWUuc3BsaXQoXCIgXCIpWzRdIHx8IFwiXCIpOztcblx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRmdW5jdGlvbiBjbGljayhkKSB7XG5cdFx0XHRcdFx0Ly8gQ29udHJvbCBhcmMgdHJhbnNpdGlvblxuXHRcdFx0XHRcdHBhdGgudHJhbnNpdGlvbigpXG5cdFx0XHRcdFx0XHQuZHVyYXRpb24oZHVyYXRpb24pXG5cdFx0XHRcdFx0XHQuYXR0clR3ZWVuKFwiZFwiLCBhcmNUd2VlbihkKSk7XG5cblx0XHRcdFx0XHQvLyBTb21ld2hhdCBvZiBhIGhhY2sgYXMgd2UgcmVseSBvbiBhcmNUd2VlbiB1cGRhdGluZyB0aGUgc2NhbGVzLlxuXHRcdFx0XHRcdC8vIENvbnRyb2wgdGhlIHRleHQgdHJhbnNpdGlvblxuXHRcdFx0XHRcdHRleHQuc3R5bGUoXCJ2aXNpYmlsaXR5XCIsIGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBpc1BhcmVudE9mKGQsIGUpID8gbnVsbCA6IGQzLnNlbGVjdCh0aGlzKS5zdHlsZShcInZpc2liaWxpdHlcIik7XG5cdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0LnRyYW5zaXRpb24oKVxuXHRcdFx0XHRcdFx0LmR1cmF0aW9uKGR1cmF0aW9uKVxuXHRcdFx0XHRcdFx0LmF0dHJUd2VlbihcInRleHQtYW5jaG9yXCIsIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRcdFx0aWYgKGQuZGVwdGgpXG5cdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gXCJtaWRkbGVcIjtcblx0XHRcdFx0XHRcdFx0XHQvL34gcmV0dXJuIHgoZC54ICsgZC5keCAvIDIpID4gTWF0aC5QSSA/IFwiZW5kXCIgOiBcInN0YXJ0XCI7XG5cdFx0XHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIFwibWlkZGxlXCI7XG5cdFx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0LmF0dHJUd2VlbihcInRyYW5zZm9ybVwiLCBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0XHR2YXIgbXVsdGlsaW5lID0gKGQubmFtZSB8fCBcIlwiKS5zcGxpdChcIiBcIikubGVuZ3RoID4gMjtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdFx0XHR2YXIgbXVsdGlsaW5lID0gKGQubmFtZSB8fCBcIlwiKS5zcGxpdChcIiBcIikubGVuZ3RoID4gMixcblx0XHRcdFx0XHRcdFx0XHRcdGFuZ2xlQWxpZ24gPSAoZC54ID4gMC41ID8gMiA6IC0yKSxcblx0XHRcdFx0XHRcdFx0XHRcdGFuZ2xlID0geChkLnggKyBkLmR4IC8gMikgKiAxODAgLyBNYXRoLlBJIC0gOTAgKyAobXVsdGlsaW5lID8gYW5nbGVBbGlnbiA6IDApLFxuXHRcdFx0XHRcdFx0XHRcdFx0cm90YXRlID0gYW5nbGUgKyAobXVsdGlsaW5lID8gLS41IDogMCksXG5cdFx0XHRcdFx0XHRcdFx0XHR0cmFuc2wgPSAoeShkLnkpICsgY2lyY1BhZGRpbmcpICsgMzUsXG5cdFx0XHRcdFx0XHRcdFx0XHRzZWNBbmdsZSA9IChhbmdsZSA+IDkwID8gLTE4MCA6IDApO1xuXHRcdFx0XHRcdFx0XHRcdGlmIChkLm5hbWUgPT0gc3BlY2lhbDMgfHwgZC5uYW1lID09IHNwZWNpYWw0KSByb3RhdGUgKz0gMTtcblx0XHRcdFx0XHRcdFx0XHRpZiAoZC5kZXB0aCA9PSAwKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHR0cmFuc2wgPSAtMi41MDtcblx0XHRcdFx0XHRcdFx0XHRcdHJvdGF0ZSA9IDA7XG5cdFx0XHRcdFx0XHRcdFx0XHRzZWNBbmdsZSA9IDA7XG5cdFx0XHRcdFx0XHRcdFx0fSBlbHNlIGlmIChkLmRlcHRoID09IDEpIHRyYW5zbCArPSAtOTtcblx0XHRcdFx0XHRcdFx0XHRlbHNlIGlmIChkLmRlcHRoID09IDIpIHRyYW5zbCArPSAtNTtcblx0XHRcdFx0XHRcdFx0XHRlbHNlIGlmIChkLmRlcHRoID09IDMpIHRyYW5zbCArPSA0O1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBcInJvdGF0ZShcIiArIHJvdGF0ZSArIFwiKXRyYW5zbGF0ZShcIiArIHRyYW5zbCArIFwiKXJvdGF0ZShcIiArIHNlY0FuZ2xlICsgXCIpXCI7XG5cdFx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0LnN0eWxlKFwiZmlsbC1vcGFjaXR5XCIsIGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBpc1BhcmVudE9mKGQsIGUpID8gMSA6IDFlLTY7XG5cdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0LmVhY2goXCJlbmRcIiwgZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0XHRcdFx0ZDMuc2VsZWN0KHRoaXMpLnN0eWxlKFwidmlzaWJpbGl0eVwiLCBpc1BhcmVudE9mKGQsIGUpID8gbnVsbCA6IFwiaGlkZGVuXCIpO1xuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblxuXG5cdFx0XHRcdGZ1bmN0aW9uIGlzUGFyZW50T2YocCwgYykge1xuXHRcdFx0XHRcdGlmIChwID09PSBjKSByZXR1cm4gdHJ1ZTtcblx0XHRcdFx0XHRpZiAocC5jaGlsZHJlbikge1xuXHRcdFx0XHRcdFx0cmV0dXJuIHAuY2hpbGRyZW4uc29tZShmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gaXNQYXJlbnRPZihkLCBjKTtcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRmdW5jdGlvbiBzZXRDb2xvcihkKSB7XG5cblx0XHRcdFx0XHQvL3JldHVybiA7XG5cdFx0XHRcdFx0aWYgKGQuY29sb3IpXG5cdFx0XHRcdFx0XHRyZXR1cm4gZC5jb2xvcjtcblx0XHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRcdHJldHVybiAnI2NjYyc7XG5cdFx0XHRcdFx0XHQvKnZhciB0aW50RGVjYXkgPSAwLjIwO1xuXHRcdFx0XHRcdFx0Ly8gRmluZCBjaGlsZCBudW1iZXJcblx0XHRcdFx0XHRcdHZhciB4ID0gMDtcblx0XHRcdFx0XHRcdHdoaWxlIChkLnBhcmVudC5jaGlsZHJlblt4XSAhPSBkKVxuXHRcdFx0XHRcdFx0XHR4Kys7XG5cdFx0XHRcdFx0XHR2YXIgdGludENoYW5nZSA9ICh0aW50RGVjYXkgKiAoeCArIDEpKS50b1N0cmluZygpO1xuXHRcdFx0XHRcdFx0cmV0dXJuIHB1c2hlci5jb2xvcihkLnBhcmVudC5jb2xvcikudGludCh0aW50Q2hhbmdlKS5odG1sKCdoZXg2Jyk7Ki9cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBJbnRlcnBvbGF0ZSB0aGUgc2NhbGVzIVxuXHRcdFx0XHRmdW5jdGlvbiBhcmNUd2VlbihkKSB7XG5cdFx0XHRcdFx0dmFyIG15ID0gbWF4WShkKSxcblx0XHRcdFx0XHRcdHhkID0gZDMuaW50ZXJwb2xhdGUoeC5kb21haW4oKSwgW2QueCwgZC54ICsgZC5keCAtIDAuMDAwOV0pLFxuXHRcdFx0XHRcdFx0eWQgPSBkMy5pbnRlcnBvbGF0ZSh5LmRvbWFpbigpLCBbZC55LCBteV0pLFxuXHRcdFx0XHRcdFx0eXIgPSBkMy5pbnRlcnBvbGF0ZSh5LnJhbmdlKCksIFtkLnkgPyAyMCA6IDAsIHJhZGl1c10pO1xuXG5cdFx0XHRcdFx0cmV0dXJuIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZnVuY3Rpb24gKHQpIHtcblx0XHRcdFx0XHRcdFx0eC5kb21haW4oeGQodCkpO1xuXHRcdFx0XHRcdFx0XHR5LmRvbWFpbih5ZCh0KSkucmFuZ2UoeXIodCkpO1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gYXJjKGQpO1xuXHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHR9O1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0ZnVuY3Rpb24gbWF4WShkKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGQuY2hpbGRyZW4gPyBNYXRoLm1heC5hcHBseShNYXRoLCBkLmNoaWxkcmVuLm1hcChtYXhZKSkgOiBkLnkgKyBkLmR5O1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9KTtcbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignU3VuYnVyc3RDdHJsJywgZnVuY3Rpb24gKCRzY29wZSkge1xuXG5cdFx0JHNjb3BlLnNldENoYXJ0ID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0JHNjb3BlLmNoYXJ0ID0ge1xuXHRcdFx0XHRvcHRpb25zOiB7XG5cdFx0XHRcdFx0Y2hhcnQ6IHtcblx0XHRcdFx0XHRcdHR5cGU6ICdzdW5idXJzdCcsXG5cdFx0XHRcdFx0XHRoZWlnaHQ6IDcwMCxcblx0XHRcdFx0XHRcdFwic3VuYnVyc3RcIjoge1xuXHRcdFx0XHRcdFx0XHRcImRpc3BhdGNoXCI6IHt9LFxuXHRcdFx0XHRcdFx0XHRcIndpZHRoXCI6IG51bGwsXG5cdFx0XHRcdFx0XHRcdFwiaGVpZ2h0XCI6IG51bGwsXG5cdFx0XHRcdFx0XHRcdFwibW9kZVwiOiBcInNpemVcIixcblx0XHRcdFx0XHRcdFx0XCJpZFwiOiAyMDg4LFxuXHRcdFx0XHRcdFx0XHRcImR1cmF0aW9uXCI6IDUwMCxcblx0XHRcdFx0XHRcdFx0XCJtYXJnaW5cIjoge1xuXHRcdFx0XHRcdFx0XHRcdFwidG9wXCI6IDAsXG5cdFx0XHRcdFx0XHRcdFx0XCJyaWdodFwiOiAwLFxuXHRcdFx0XHRcdFx0XHRcdFwiYm90dG9tXCI6IDAsXG5cdFx0XHRcdFx0XHRcdFx0XCJsZWZ0XCI6IDBcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdFwidG9vbHRpcFwiOiB7XG5cdFx0XHRcdFx0XHRcdFwiZHVyYXRpb25cIjogMCxcblx0XHRcdFx0XHRcdFx0XCJncmF2aXR5XCI6IFwid1wiLFxuXHRcdFx0XHRcdFx0XHRcImRpc3RhbmNlXCI6IDI1LFxuXHRcdFx0XHRcdFx0XHRcInNuYXBEaXN0YW5jZVwiOiAwLFxuXHRcdFx0XHRcdFx0XHRcImNsYXNzZXNcIjogbnVsbCxcblx0XHRcdFx0XHRcdFx0XCJjaGFydENvbnRhaW5lclwiOiBudWxsLFxuXHRcdFx0XHRcdFx0XHRcImZpeGVkVG9wXCI6IG51bGwsXG5cdFx0XHRcdFx0XHRcdFwiZW5hYmxlZFwiOiB0cnVlLFxuXHRcdFx0XHRcdFx0XHRcImhpZGVEZWxheVwiOiA0MDAsXG5cdFx0XHRcdFx0XHRcdFwiaGVhZGVyRW5hYmxlZFwiOiBmYWxzZSxcblxuXHRcdFx0XHRcdFx0XHRcIm9mZnNldFwiOiB7XG5cdFx0XHRcdFx0XHRcdFx0XCJsZWZ0XCI6IDAsXG5cdFx0XHRcdFx0XHRcdFx0XCJ0b3BcIjogMFxuXHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHRcImhpZGRlblwiOiB0cnVlLFxuXHRcdFx0XHRcdFx0XHRcImRhdGFcIjogbnVsbCxcblx0XHRcdFx0XHRcdFx0XCJ0b29sdGlwRWxlbVwiOiBudWxsLFxuXHRcdFx0XHRcdFx0XHRcImlkXCI6IFwibnZ0b29sdGlwLTk5MzQ3XCJcblx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRkYXRhOiBbXVxuXHRcdFx0fTtcblx0XHRcdHJldHVybiAkc2NvcGUuY2hhcnQ7XG5cdFx0fVxuXHRcdHZhciBidWlsZFRyZWUgPSBmdW5jdGlvbiAoZGF0YSkge1xuXHRcdFx0dmFyIGNoaWxkcmVuID0gW107XG5cdFx0XHRhbmd1bGFyLmZvckVhY2goZGF0YSwgZnVuY3Rpb24gKGl0ZW0pIHtcblx0XHRcdFx0dmFyIGNoaWxkID0ge1xuXHRcdFx0XHRcdCduYW1lJzogaXRlbS50aXRsZSxcblx0XHRcdFx0XHQnc2l6ZSc6IGl0ZW0uc2l6ZSxcblx0XHRcdFx0XHQnY29sb3InOiBpdGVtLmNvbG9yLFxuXHRcdFx0XHRcdCdjaGlsZHJlbic6IGJ1aWxkVHJlZShpdGVtLmNoaWxkcmVuKVxuXHRcdFx0XHR9O1xuXHRcdFx0XHRpZihpdGVtLmNvbG9yKXtcblx0XHRcdFx0XHRjaGlsZC5jb2xvciA9IGl0ZW0uY29sb3Jcblx0XHRcdFx0fVxuXHRcdFx0XHRpZihpdGVtLnNpemUpe1xuXHRcdFx0XHRcdGNoaWxkLnNpemUgPSBpdGVtLnNpemVcblx0XHRcdFx0fVxuXHRcdFx0XHRjaGlsZHJlbi5wdXNoKGNoaWxkKTtcblx0XHRcdH0pO1xuXHRcdFx0cmV0dXJuIGNoaWxkcmVuO1xuXHRcdH07XG5cdFx0JHNjb3BlLmNhbGN1bGF0ZUdyYXBoID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0dmFyIGNoYXJ0RGF0YSA9IHtcblx0XHRcdFx0XCJuYW1lXCI6ICRzY29wZS5kYXRhLnRpdGxlLFxuXHRcdFx0XHRcImNvbG9yXCI6ICRzY29wZS5kYXRhLnN0eWxlLmJhc2VfY29sb3IgfHwgJyMwMDAnLFxuXHRcdFx0XHRcImNoaWxkcmVuXCI6IGJ1aWxkVHJlZSgkc2NvcGUuZGF0YS5jaGlsZHJlbiksXG5cdFx0XHRcdFwic2l6ZVwiOiAxXG5cdFx0XHR9O1xuXHRcdFx0JHNjb3BlLmNoYXJ0LmRhdGEgPSBjaGFydERhdGE7XG5cdFx0XHRyZXR1cm4gY2hhcnREYXRhO1xuXHRcdH07XG5cdFx0JHNjb3BlLiR3YXRjaCgnZGF0YScsIGZ1bmN0aW9uIChuLCBvKSB7XG5cdFx0XHRpZiAoIW4pIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdFx0JHNjb3BlLmNhbGN1bGF0ZUdyYXBoKCk7XG5cdFx0fSlcblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmRpcmVjdGl2ZXMnKS5kaXJlY3RpdmUoJ2ZpbGVEcm9wem9uZScsIGZ1bmN0aW9uICh0b2FzdHIpIHtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRyZXN0cmljdDogJ0VBJyxcblx0XHRcdHNjb3BlOiB7XG4gICAgICAgIGZpbGU6ICc9JyxcbiAgICAgICAgZmlsZU5hbWU6ICc9J1xuICAgICAgfSxcblx0XHRcdGxpbms6IGZ1bmN0aW9uIChzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcblx0XHRcdFx0dmFyIGNoZWNrU2l6ZSwgaXNUeXBlVmFsaWQsIHByb2Nlc3NEcmFnT3Zlck9yRW50ZXIsIHZhbGlkTWltZVR5cGVzO1xuXHRcdFx0XHRwcm9jZXNzRHJhZ092ZXJPckVudGVyID0gZnVuY3Rpb24gKGV2ZW50KSB7XG5cdFx0XHRcdFx0aWYgKGV2ZW50ICE9IG51bGwpIHtcblx0XHRcdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGV2ZW50LmRhdGFUcmFuc2Zlci5lZmZlY3RBbGxvd2VkID0gJ2NvcHknO1xuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0fTtcblx0XHRcdFx0dmFsaWRNaW1lVHlwZXMgPSBhdHRycy5maWxlRHJvcHpvbmU7XG5cdFx0XHRcdGNoZWNrU2l6ZSA9IGZ1bmN0aW9uIChzaXplKSB7XG5cdFx0XHRcdFx0dmFyIF9yZWY7XG5cdFx0XHRcdFx0aWYgKCgoX3JlZiA9IGF0dHJzLm1heEZpbGVTaXplKSA9PT0gKHZvaWQgMCkgfHwgX3JlZiA9PT0gJycpIHx8IChzaXplIC8gMTAyNCkgLyAxMDI0IDwgYXR0cnMubWF4RmlsZVNpemUpIHtcblx0XHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRhbGVydChcIkZpbGUgbXVzdCBiZSBzbWFsbGVyIHRoYW4gXCIgKyBhdHRycy5tYXhGaWxlU2l6ZSArIFwiIE1CXCIpO1xuXHRcdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fTtcblx0XHRcdFx0aXNUeXBlVmFsaWQgPSBmdW5jdGlvbiAodHlwZSkge1xuXHRcdFx0XHRcdGlmICgodmFsaWRNaW1lVHlwZXMgPT09ICh2b2lkIDApIHx8IHZhbGlkTWltZVR5cGVzID09PSAnJykgfHwgdmFsaWRNaW1lVHlwZXMuaW5kZXhPZih0eXBlKSA+IC0xKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0dG9hc3RyLmVycm9yKFwiRmlsZSBtdXN0IGJlIG9uZSBvZiBmb2xsb3dpbmcgdHlwZXMgXCIgKyB2YWxpZE1pbWVUeXBlcywgJ0ludmFsaWQgZmlsZSB0eXBlIScpO1xuXG5cdFx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9O1xuXHRcdFx0XHRlbGVtZW50LmJpbmQoJ2RyYWdvdmVyJywgcHJvY2Vzc0RyYWdPdmVyT3JFbnRlcik7XG5cdFx0XHRcdGVsZW1lbnQuYmluZCgnZHJhZ2VudGVyJywgcHJvY2Vzc0RyYWdPdmVyT3JFbnRlcik7XG5cdFx0XHRcdHJldHVybiBlbGVtZW50LmJpbmQoJ2Ryb3AnLCBmdW5jdGlvbiAoZXZlbnQpIHtcblx0XHRcdFx0XHR2YXIgZmlsZSwgbmFtZSwgcmVhZGVyLCBzaXplLCB0eXBlO1xuXHRcdFx0XHRcdGlmIChldmVudCAhPSBudWxsKSB7XG5cdFx0XHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRyZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xuXHRcdFx0XHRcdHJlYWRlci5vbmxvYWQgPSBmdW5jdGlvbiAoZXZ0KSB7XG5cdFx0XHRcdFx0XHRpZiAoY2hlY2tTaXplKHNpemUpICYmIGlzVHlwZVZhbGlkKHR5cGUpKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBzY29wZS4kYXBwbHkoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0XHRcdHNjb3BlLmZpbGUgPSBldnQudGFyZ2V0LnJlc3VsdDtcblx0XHRcdFx0XHRcdFx0XHRpZiAoYW5ndWxhci5pc1N0cmluZyhzY29wZS5maWxlTmFtZSkpIHtcblx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiBzY29wZS5maWxlTmFtZSA9IG5hbWU7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdGZpbGUgPSBldmVudC5kYXRhVHJhbnNmZXIuZmlsZXNbMF07XG5cdFx0XHRcdFx0LypuYW1lID0gZmlsZS5uYW1lO1xuXHRcdFx0XHRcdHR5cGUgPSBmaWxlLnR5cGU7XG5cdFx0XHRcdFx0c2l6ZSA9IGZpbGUuc2l6ZTtcblx0XHRcdFx0XHRyZWFkZXIucmVhZEFzRGF0YVVSTChmaWxlKTsqL1xuXHRcdFx0XHRcdHNjb3BlLmZpbGUgPSBmaWxlO1xuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fTtcblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoICdhcHAuY29udHJvbGxlcnMnICkuY29udHJvbGxlciggJ0ZpbGVEcm9wem9uZUN0cmwnLCBmdW5jdGlvbigpe1xuXHRcdC8vXG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5kaXJlY3RpdmVzJykuZGlyZWN0aXZlKCAnaW5kaWNhdG9yJywgZnVuY3Rpb24oKSB7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0cmVzdHJpY3Q6ICdFQScsXG5cdFx0XHR0ZW1wbGF0ZVVybDogJ3ZpZXdzL2RpcmVjdGl2ZXMvaW5kaWNhdG9yL2luZGljYXRvci5odG1sJyxcblx0XHRcdGNvbnRyb2xsZXI6ICdJbmRpY2F0b3JDdHJsJyxcblx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJyxcblx0XHRcdHNjb3BlOntcblx0XHRcdFx0aXRlbTogJz0nLFxuXHRcdFx0XHRvcHRpb25zOiAnPScsXG5cdFx0XHRcdHNlbGVjdGVkOiAnPSdcblx0XHRcdH0sXG5cdFx0XHRiaW5kVG9Db250cm9sbGVyOiB0cnVlLFxuXHRcdFx0cmVwbGFjZTp0cnVlLFxuXHRcdFx0Ly9yZXF1aXJlOiAnaXRlbScsXG5cdFx0XHRsaW5rOiBmdW5jdGlvbiggc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBpdGVtTW9kZWwgKXtcblx0XHRcdFx0Ly9cblx0XHRcdFx0LypzY29wZS4kd2F0Y2goXG5cdFx0XHRcdFx0ZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGl0ZW1Nb2RlbC4kbW9kZWxWYWx1ZTtcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdGZ1bmN0aW9uIChuLCBvKSB7XG5cdFx0XHRcdFx0XHRjb25zb2xlLmxvZyhuKTtcblx0XHRcdFx0XHR9KTsqL1xuXHRcdFx0fVxuXHRcdH07XG5cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignSW5kaWNhdG9yQ3RybCcsIGZ1bmN0aW9uICgkc2NvcGUsIERhdGFTZXJ2aWNlLCBEaWFsb2dTZXJ2aWNlLCAkZmlsdGVyLCB0b2FzdHIpIHtcblx0XHQvL1xuXHRcdHZhciB2bSA9IHRoaXM7XG5cblx0XHR2bS5jaGVja0Jhc2UgPSBjaGVja0Jhc2U7XG5cdFx0dm0uY2hlY2tGdWxsID0gY2hlY2tGdWxsO1xuXG5cdFx0dm0uY2F0ZWdvcmllcyA9IFtdO1xuXHRcdHZtLmRhdGFwcm92aWRlcnMgPSBbXTtcblx0XHR2bS5zZWxlY3RlZEl0ZW0gPSBudWxsO1xuXHRcdHZtLnNlYXJjaFRleHQgPSBudWxsO1xuXHRcdHZtLnF1ZXJ5U2VhcmNoID0gcXVlcnlTZWFyY2g7XG5cdFx0dm0ucXVlcnlTZWFyY2hDYXRlZ29yeSA9IHF1ZXJ5U2VhcmNoQ2F0ZWdvcnk7XG5cblx0XHR2bS50b2dnbGVDYXRlZ29yaWUgPSB0b2dnbGVDYXRlZ29yaWU7XG5cdFx0dm0uc2VsZWN0ZWRDYXRlZ29yaWUgPSBzZWxlY3RlZENhdGVnb3JpZTtcblx0XHR2bS5zYXZlQ2F0ZWdvcnkgPSBzYXZlQ2F0ZWdvcnk7XG5cblx0XHR2bS50b2dnbGVTdHlsZSA9IHRvZ2dsZVN0eWxlO1xuXHRcdHZtLnNlbGVjdGVkU3R5bGUgPSBzZWxlY3RlZFN0eWxlO1xuXG5cdFx0YWN0aXZhdGUoKTtcblxuXHRcdGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xuXHRcdFx0bG9hZEFsbCgpO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIHF1ZXJ5U2VhcmNoKHF1ZXJ5KSB7XG5cdFx0XHRyZXR1cm4gJGZpbHRlcignZmluZGJ5bmFtZScpKHZtLmRhdGFwcm92aWRlcnMsIHF1ZXJ5LCAndGl0bGUnKTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBxdWVyeVNlYXJjaENhdGVnb3J5KHF1ZXJ5KSB7XG5cdFx0XHRyZXR1cm4gJGZpbHRlcignZmluZGJ5bmFtZScpKHZtLmNhdGVnb3JpZXMsIHF1ZXJ5LCAndGl0bGUnKTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBsb2FkQWxsKCkge1xuXHRcdFx0dm0uZGF0YXByb3ZpZGVycyA9IERhdGFTZXJ2aWNlLmdldEFsbCgnZGF0YXByb3ZpZGVycycpLiRvYmplY3Q7XG5cdFx0XHR2bS5jYXRlZ29yaWVzID0gRGF0YVNlcnZpY2UuZ2V0QWxsKCdjYXRlZ29yaWVzJykuJG9iamVjdDtcblx0XHRcdHZtLm1lYXN1cmVUeXBlcyA9IERhdGFTZXJ2aWNlLmdldEFsbCgnbWVhc3VyZV90eXBlcycpLiRvYmplY3Q7XG5cdFx0XHR2bS5zdHlsZXMgPSBEYXRhU2VydmljZS5nZXRBbGwoJ3N0eWxlcycpLiRvYmplY3Q7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gY2hlY2tCYXNlKCl7XG5cdFx0XHRpZiAodm0uaXRlbS50aXRsZSAmJiB2bS5pdGVtLm1lYXN1cmVfdHlwZV9pZCAmJiB2bS5pdGVtLmRhdGFwcm92aWRlciAmJiB2bS5pdGVtLnRpdGxlLmxlbmd0aCA+PSAzKSB7XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblx0XHRmdW5jdGlvbiBjaGVja0Z1bGwoKXtcblx0XHRcdGlmKHR5cGVvZiB2bS5pdGVtLmNhdGVnb3JpZXMgPT0gXCJ1bmRlZmluZWRcIikgcmV0dXJuIGZhbHNlO1xuXHRcdFx0cmV0dXJuIGNoZWNrQmFzZSgpICYmIHZtLml0ZW0uY2F0ZWdvcmllcy5sZW5ndGggPyB0cnVlIDogZmFsc2U7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gdG9nZ2xlQ2F0ZWdvcmllKGNhdGVnb3JpZSkge1xuXHRcdFx0dmFyIGZvdW5kID0gZmFsc2UsIGluZGV4ID0gLTE7XG5cdFx0XHRhbmd1bGFyLmZvckVhY2godm0uaXRlbS5jYXRlZ29yaWVzLCBmdW5jdGlvbihjYXQsIGkpe1xuXHRcdFx0XHRpZihjYXQuaWQgPT0gY2F0ZWdvcmllLmlkKXtcblx0XHRcdFx0XHRmb3VuZCA9IHRydWU7XG5cdFx0XHRcdFx0aW5kZXggPSBpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdFx0Y29uc29sZS5sb2coZm91bmQsIGluZGV4KTtcblx0XHRcdGluZGV4ID09PSAtMSA/IHZtLml0ZW0uY2F0ZWdvcmllcy5wdXNoKGNhdGVnb3JpZSkgOiB2bS5pdGVtLmNhdGVnb3JpZXMuc3BsaWNlKGluZGV4LCAxKTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBzZWxlY3RlZENhdGVnb3JpZShpdGVtLCBjYXRlZ29yaWUpIHtcblx0XHRcdGlmICh0eXBlb2YgaXRlbS5jYXRlZ29yaWVzID09IFwidW5kZWZpbmVkXCIpIHtcblx0XHRcdFx0aXRlbS5jYXRlZ29yaWVzID0gW107XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblx0XHQgXHR2YXIgZm91bmQgPSBmYWxzZTtcblx0XHRcdGFuZ3VsYXIuZm9yRWFjaChpdGVtLmNhdGVnb3JpZXMsIGZ1bmN0aW9uKGNhdCwga2V5KXtcblx0XHRcdFx0aWYoY2F0LmlkID09IGNhdGVnb3JpZS5pZCl7XG5cdFx0XHRcdFx0Zm91bmQgPSB0cnVlO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHRcdHJldHVybiBmb3VuZDtcblx0XHR9XG5cdFx0ZnVuY3Rpb24gc2F2ZUNhdGVnb3J5KHZhbGlkKXtcblx0XHRcdGlmKHZhbGlkKXtcblx0XHRcdFx0Y29uc29sZS5sb2codm0uY2F0ZWdvcnkpO1xuXHRcdFx0XHREYXRhU2VydmljZS5wb3N0KCdjYXRlZ29yaWVzJywgdm0uY2F0ZWdvcnkpLnRoZW4oZnVuY3Rpb24oZGF0YSl7XG5cdFx0XHRcdFx0dm0uY2F0ZWdvcmllcy5wdXNoKGRhdGEpO1xuXHRcdFx0XHRcdHZtLmNyZWF0ZUNhdGVnb3J5ID0gZmFsc2U7XG5cdFx0XHRcdFx0dm0uaXRlbS5jYXRlZ29yaWVzLnB1c2goZGF0YSk7XG5cdFx0XHRcdFx0dG9hc3RyLnN1Y2Nlc3MoJ05ldyBDYXRlZ29yeSB3YXMgc2F2ZWQnLCdTdWNjZXNzJyk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRmdW5jdGlvbiB0b2dnbGVTdHlsZShzdHlsZSkge1xuXHRcdFx0aWYodm0uaXRlbS5zdHlsZV9pZCA9PSBzdHlsZS5pZCl7XG5cdFx0XHRcdHZtLml0ZW0uc3R5bGVfaWQgPSAwO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZXtcblx0XHRcdFx0dm0uaXRlbS5zdHlsZV9pZCA9IHN0eWxlLmlkXG5cdFx0XHRcdHZtLml0ZW0uc3R5bGUgPSBzdHlsZTtcblx0XHRcdH1cblx0XHR9XG5cdFx0ZnVuY3Rpb24gc2VsZWN0ZWRTdHlsZShpdGVtLCBzdHlsZSkge1xuXHRcdFx0cmV0dXJuIHZtLml0ZW0uc3R5bGVfaWQgPT0gc3R5bGUuaWQgPyB0cnVlIDogZmFsc2U7XG5cdFx0fVxuXG5cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0hlYWRlckN0cmwnLCBmdW5jdGlvbigkc2NvcGUsIGxlYWZsZXREYXRhLCAkc3RhdGUsJGxvY2FsU3RvcmFnZSwgJHJvb3RTY29wZSwgJGF1dGgsIHRvYXN0ciwgJHRpbWVvdXQpe1xuXG5cdFx0dmFyIHZtID0gdGhpcztcblx0XHQkcm9vdFNjb3BlLmlzQXV0aGVudGljYXRlZCA9IGlzQXV0aGVudGljYXRlZDtcblx0XHR2bS5kb0xvZ2luID0gZG9Mb2dpbjtcblx0XHR2bS5kb0xvZ291dCA9IGRvTG9nb3V0O1xuXHRcdHZtLm9wZW5NZW51ID0gb3Blbk1lbnU7XG5cdFx0dm0udG9nZ2xlVmlldyA9IHRvZ2dsZVZpZXc7XG5cdFx0dm0uYXV0aGVudGljYXRlID0gZnVuY3Rpb24ocHJvdmlkZXIpe1xuXHRcdFx0JGF1dGguYXV0aGVudGljYXRlKHByb3ZpZGVyKTtcblx0XHR9O1xuXHRcdGZ1bmN0aW9uIGlzQXV0aGVudGljYXRlZCgpe1xuXHRcdFx0IHJldHVybiAkYXV0aC5pc0F1dGhlbnRpY2F0ZWQoKTtcblx0XHR9XG5cdFx0ZnVuY3Rpb24gZG9Mb2dpbigpe1xuXHRcdFx0JGF1dGgubG9naW4odm0udXNlcikudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG5cdFx0XHRcdHRvYXN0ci5zdWNjZXNzKCdZb3UgaGF2ZSBzdWNjZXNzZnVsbHkgc2lnbmVkIGluJyk7XG5cdFx0XHRcdC8vJHN0YXRlLmdvKCRyb290U2NvcGUucHJldmlvdXNQYWdlLnN0YXRlLm5hbWUgfHwgJ2FwcC5ob21lJywgJHJvb3RTY29wZS5wcmV2aW91c1BhZ2UucGFyYW1zKTtcblx0XHRcdH0pLmNhdGNoKGZ1bmN0aW9uKHJlc3BvbnNlKXtcblx0XHRcdFx0dG9hc3RyLmVycm9yKCdQbGVhc2UgY2hlY2sgeW91ciBlbWFpbCBhbmQgcGFzc3dvcmQnLCAnU29tZXRoaW5nIHdlbnQgd3JvbmcnKTtcblx0XHRcdH0pXG5cdFx0fVxuXHRcdGZ1bmN0aW9uIGRvTG9nb3V0KCl7XG5cdFx0XHRpZigkYXV0aC5pc0F1dGhlbnRpY2F0ZWQoKSl7XG5cdFx0XHRcdCRhdXRoLmxvZ291dCgpLnRoZW4oZnVuY3Rpb24oZGF0YSl7XG5cdFx0XHRcdFx0aWYoJHN0YXRlLmN1cnJlbnQuYXV0aCl7XG5cdFx0XHRcdFx0XHQkc3RhdGUuZ28oJ2FwcC5ob21lJyk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHRvYXN0ci5zdWNjZXNzKCdZb3UgaGF2ZSBzdWNjZXNzZnVsbHkgbG9nZ2VkIG91dCcpO1xuXHRcdFx0XHR9KS5jYXRjaChmdW5jdGlvbihyZXNwb25zZSl7XG5cblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fVxuXG4gICAgZnVuY3Rpb24gb3Blbk1lbnUoJG1kT3Blbk1lbnUsIGV2KSB7XG4gICAgICAkbWRPcGVuTWVudShldik7XG4gICAgfTtcblx0XHRmdW5jdGlvbiB0b2dnbGVWaWV3KCl7XG5cdFx0XHQkcm9vdFNjb3BlLmxvb3NlTGF5b3V0ID0gISRyb290U2NvcGUubG9vc2VMYXlvdXQ7XG5cdFx0XHQkbG9jYWxTdG9yYWdlLmZ1bGxWaWV3ID0gJHJvb3RTY29wZS5sb29zZUxheW91dDtcblx0XHRcdHJlc2V0TWFwU2l6ZSgpO1xuXHRcdH1cblx0XHRmdW5jdGlvbiByZXNldE1hcFNpemUoKXtcblx0XHRcdCR0aW1lb3V0KGZ1bmN0aW9uKCl7XG5cdFx0XHRcdGxlYWZsZXREYXRhLmdldE1hcCgnbWFwJykudGhlbihmdW5jdGlvbiAobWFwKSB7XG5cdFx0XHRcdFx0bWFwLmludmFsaWRhdGVTaXplKCk7XG5cdFx0XHRcdH0pXG5cdFx0XHR9LCAzMDApO1xuXHRcdH1cblx0XHQkcm9vdFNjb3BlLnNpZGViYXJPcGVuID0gdHJ1ZTtcblx0XHQkc2NvcGUuJHdhdGNoKGZ1bmN0aW9uKCl7XG5cdFx0XHRyZXR1cm4gJHJvb3RTY29wZS5jdXJyZW50X3BhZ2U7XG5cdFx0fSwgZnVuY3Rpb24obmV3UGFnZSl7XG5cdFx0XHQkc2NvcGUuY3VycmVudF9wYWdlID0gbmV3UGFnZSB8fCAnUGFnZSBOYW1lJztcblx0XHR9KTtcblx0XHQkc2NvcGUuJHdhdGNoKCckcm9vdC5zaWRlYmFyT3BlbicsIGZ1bmN0aW9uKG4sbyl7XG5cdFx0XHRpZihuID09IG8pIHJldHVybiBmYWxzZTtcblx0XHRcdHJlc2V0TWFwU2l6ZSgpO1xuXHRcdH0pXG5cdH0pO1xuXG59KSgpO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
