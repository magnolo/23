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
		angular.module('app.controllers', ['ngScrollbar','mdColorPicker','ngAnimate','ui.tree','toastr','ui.router', 'md.data.table', 'ngMaterial', 'ngStorage', 'restangular', 'ngMdIcons', 'angular-loading-bar', 'ngMessages', 'ngSanitize', "leaflet-directive",'nvd3']);
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
			.state('app.index.editor',{
				url: '/editor',
				views: {
					'sidebar@': {
						templateUrl: getView('indexeditor'),
						controller: 'IndexeditorCtrl',
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
			.state('app.index.create', {
				url: '/create',
				views: {
					'sidebar@': {
						templateUrl: getView('indexcreator'),
						controller: 'IndexcreatorCtrl',
						controllerAs: 'vm'
					}
				}
			})
			.state('app.index.create.basic', {
				url: '/basic'
			})
			.state('app.index.check', {
				url: '/checking',
				views:{
					'main@':{
						templateUrl:getView('IndexCheck'),
						controller: 'IndexCheckCtrl',
						controllerAs: 'vm'
					},
					'sidebar@': {
						templateUrl: getView('indexcreator'),
						controller: 'IndexcreatorCtrl',
						controllerAs: 'vm'
					}
				}
			})
			.state('app.index.meta', {
				url: '/adding-meta-data',
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
			.state('app.index.create.final', {
				url: '/adding-meta-data'
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

	angular.module('app.routes').run(["$rootScope", "$mdSidenav", function($rootScope, $mdSidenav){
		$rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState,fromParams){
			if (toState.data && toState.data.pageName){
				$rootScope.current_page = toState.data.pageName;
			}
			$rootScope.previousPage = {state:fromState, params:fromParams};
			$rootScope.stateIsLoading = true;
		});
		$rootScope.$on("$viewContentLoaded", function(event, toState){

		});
		$rootScope.$on("$stateChangeSuccess", function(event, toState){
			$rootScope.stateIsLoading = false;
		});
	}]);

})();

(function (){
    "use strict";

    angular.module('app.config').config(["$authProvider", function ($authProvider){
        // Satellizer configuration that specifies which API
        // route the JWT should be retrieved from
        $authProvider.loginUrl = '/api/authenticate/auth';
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
		$mdThemingProvider.theme('default')
	.primaryPalette('indigo')
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
          keys:{
            mazpen:'vector-tiles-Q3_Os5w',
            mapbox:'pk.eyJ1IjoibWFnbm9sbyIsImEiOiJuSFdUYkg4In0.5HOykKk0pNP1N3isfPQGTQ'
          },
          data:{
            layer: '',
            name:'23_countries',
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
          }
        }
    });

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
          return Restangular.all(route).post(data);
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
            meta:{
              iso_field: '',
              country_field:'',
              year_field:'',
              table:[]
            }
        }, storage, importCache, indicator, indicators = [];

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
                meta:{
                  iso_field: '',
                  country_field:'',
                  year_field:''
                }
            };
          },
          addData:function(item){
            return serviceData.data.push(item);
          },
          addIndicator: function(item){
            return indicators.push(item);
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
            importCache.put('dataToImport',serviceData);
          },
          setIndicator: function(key, item){
            return indicators[key] = item;
          },
          setActiveIndicatorData: function(item){
            return indicator = indicators[indicators.indexOf(indicator)] = item;
          },
          getFromLocalStorage: function(){
            return serviceData = importCache.get('dataToImport');
          },
          getData: function(){
            return serviceData.data;
          },
          getMeta: function(){
            return serviceData.meta;
          },
          getIsoField: function(){
            return serviceData.meta.iso_field;
          },
          getCountryField: function(){
            return serviceData.meta.country_field;
          },
          getErrors: function(){
            return serviceData.errors;
          },
          getFirstEntry: function(){
            return serviceData.data[0];
          },
          getDataSize: function(){
            return serviceData.data.length;
          },
          getIndicator: function(key){
            return indicator = indicators[key];
          },
          activeIndicator: function(){
            return indicator;
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

    angular.module('app.controllers').controller('IndexCheckCtrl', ["$rootScope", "toastr", "DialogService", "DataService", "IndexService", function($rootScope, toastr, DialogService, DataService, IndexService){
        //
        //$rootScope.sidebarOpen = false;

        var vm = this;
        vm.data = [];
        vm.selected = [];
        vm.deleteData = deleteData;
        vm.deleteSelected = deleteSelected;
        vm.onOrderChange = onOrderChange;
        vm.onPaginationChange = onPaginationChange;
        vm.checkForErrors = checkForErrors;
        vm.clearErrors = clearErrors;
        vm.showUploadContainer = false;
        vm.editColumnData = editColumnData;
        vm.fetchIso = fetchIso;
        vm.editRow = editRow;
        vm.data = IndexService.getData();
        vm.meta = IndexService.getMeta();
        vm.errors = IndexService.getErrors();
        vm.query = {
          filter: '',
          order: '-errors',
          limit: 15,
          page: 1
        };
        vm.myData = DataService.getAll('me/data');
        activate();

        function activate(){
          checkMyData();
        }

        function checkMyData(){
          vm.extendingChoices = [];
          if(vm.data.length){
            vm.myData.then(function(imports){
              angular.forEach(imports, function(entry){
                var found = 0;
                angular.forEach(vm.data[0].meta.fields, function(field){
                    var columns = JSON.parse(entry.meta_data);
                    angular.forEach(columns, function(column){
                      if(column.column == field ){
                        found++;
                      }
                    })
                });
                if(found >= vm.data[0].meta.fields.length - 2){
                  vm.extendingChoices.push(entry);
                }
              })
              if(vm.extendingChoices.length){
                DialogService.fromTemplate('extendData', $scope);
              }
            });
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
        function clearErrors(){
          angular.forEach(vm.data, function(row, key){
            angular.forEach(row.data[0], function(item, k){
              if(isNaN(item) || item < 0){
                if(/*item.toString().toUpperCase() == "NA" ||*/ item < 0 || item.toString().toUpperCase().indexOf('N/A') > -1){
                  vm.data[key].data[0][k] = null;
                  vm.errors --;
                  row.errors.splice(0,1);
                }
              }
            });
            if(!row.data[0][vm.meta.iso_field]){
              vm.iso_errors++;
              vm.errors++
              row.errors.push({
                type:"2",
                message:"Iso field is not valid!",
                column: vm.meta.iso_field
              })
            }
          });
        }
        function editColumnData(e, key){
          vm.toEdit = key;
          DialogService.fromTemplate('editcolumn', $scope);
        }
        function deleteSelected(){
          angular.forEach(vm.selected, function(item, key){
            angular.forEach(item.errors, function(error, k){
              if(error.type == 2){
                vm.iso_errors --;
              }
              vm.errors --;
            })
            vm.data.splice(vm.data.indexOf(item), 1);
            vm.selected.splice(key, 1);
          });
          if(vm.data.length == 0){
            vm.deleteData();
            $state.got('app.index.create');
          }
        }
        function editRow(){
          vm.row = vm.selected[0];
          DialogService.fromTemplate('editrow', $scope);
        }
        function deleteData(){
          vm.data = [];
        }
        function fetchIso(){
          if(!vm.meta.iso_field){
            toastr.error('Check your selection for the ISO field', 'Column not specified!');
            return false;
          }
          if(!vm.meta.country_field){
            toastr.error('Check your selection for the COUNTRY field', 'Column not specified!');
            return false;
          }
          if(vm.meta.country_field == vm.meta.iso_field){
            toastr.error('ISO field and COUNTRY field can not be the same', 'Selection error!');
            return false;
          }

          vm.toSelect = [];
          vm.notFound = [];
          var entries = [];
          var isoCheck = 0;
          var isoType = 'iso-3166-2';
          angular.forEach(vm.data, function(item, key){
              if(item.data[0][vm.meta.iso_field]){
                isoCheck += item.data[0][vm.meta.iso_field].length == 3 ? 1 : 0;
              }
              switch (item.data[0][vm.meta.country_field]) {
                case 'Cabo Verde':
                      item.data[0][vm.meta.country_field] = 'Cape Verde';
                  break;
                case "Democratic Peoples Republic of Korea":
                        item.data[0][vm.meta.country_field]   = "Democratic People's Republic of Korea";
                    break;
                case "Cote d'Ivoire":
                        item.data[0][vm.meta.country_field]   = "Ivory Coast";
                    break;
                case "Lao Peoples Democratic Republic":
                      item.data[0][vm.meta.country_field]  = "Lao People's Democratic Republic";
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
          DataService.post('countries/byIsoNames', {data:entries, iso: isoType}).then(function(response){
              angular.forEach(response, function(country, key){
                angular.forEach(vm.data, function(item, k){
                    if(country.name == item.data[0][vm.meta.country_field]){
                      if(country.data.length > 1){
                        var toSelect = {
                          entry: item,
                          options: country.data
                        };
                        vm.toSelect.push(toSelect);
                      }
                      else{
                        if(typeof country.data[0] != "undefined"){
                          vm.data[k].data[0][vm.meta.iso_field] = country.data[0].iso;
                          vm.data[k].data[0][vm.meta.country_field] = country.data[0].admin;
                          if(item.errors.length){
                            angular.forEach(item.errors, function(error, e){
                              if(error.type == 2){
                                vm.iso_errors --;
                                vm.errors --;
                                item.errors.splice(e, 1);
                              }
                            })
                          }
                        }
                        else{

                            vm.iso_errors++;
                            vm.errors++
                            item.errors.push({
                              type:"3",
                              message:"Could not locate a valid iso name!",
                              column: vm.meta.country_field
                            });


                        }
                      }
                    }
                });
              });
              vm.iso_checked = true;
          }, function(response){
          //  console.log(response);
            toastr.error('Please check your field selections', response.data.message);
          })
        }
    }]);

})();

(function(){
	"use strict";

	angular.module('app.controllers').controller('HeaderCtrl', ["$scope", "$rootScope", "$auth", "toastr", function($scope, $rootScope, $auth, toastr){

		var vm = this;
		vm.isAuthenticated = isAuthenticated;
		vm.doLogout = doLogout;
		vm.openMenu = openMenu;

		function isAuthenticated(){
			 return $auth.isAuthenticated();
		}
		function doLogout(){
			if($auth.isAuthenticated()){
				$auth.logout().then(function(data){
					toastr.success('You have successfully logged out');
				}).catch(function(response){

				});
			}
		}
		var originatorEv;
    function openMenu($mdOpenMenu, ev) {
      originatorEv = ev;
      $mdOpenMenu(ev);
    };
		$rootScope.sidebarOpen = true;
		$scope.$watch(function(){
			return $rootScope.current_page;
		}, function(newPage){
			$scope.current_page = newPage || 'Page Name';
		});

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
					createCanvas();
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
					color:vm.structure.color || '#00ccaa',
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
			if (feature.layer.name === VectorlayerService.getName()+'_geom_label') {
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
		};
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

    angular.module('app.controllers').controller('IndexMetaCtrl', ["$scope", "DataService", "IndexService", "toastr", function($scope, DataService,IndexService,toastr){
        //

        var vm = this;

        vm.indicators = [];
        vm.data = IndexService.getData();
        vm.meta = IndexService.getMeta();
        vm.errors = IndexService.getErrors();
        vm.indicator = IndexService.activeIndicator();
        vm.extendData = extendData;
        vm.saveData = saveData;

        function extendData(){
          var insertData = {data:[]};
          var meta = [], fields = [];
          angular.forEach(vm.data, function(item, key){
            if(item.errors.length == 0){
              item.data[0].year = vm.meta.year;
              insertData.data.push(item.data[0]);
            }
            else{
              toastr.error('There are some errors left!', 'Huch!');
              return;
            }
          });

          DataService.post('data/tables/'+vm.addDataTo.table_name+'/insert', insertData).then(function(res){
            if(res == true){
              toastr.success(insertData.data.length+' items importet to '+vm.meta.name,'Success');
              vm.data = [];
              vm.step = 0;
            }
          });
        }
        function saveData(){
          var insertData = {data:[]};
          var meta = [], fields = [];
          angular.forEach(vm.data, function(item, key){
            if(item.errors.length == 0){
              item.data[0].year = vm.meta.year;
              vm.meta.iso_type = item.data[0][vm.meta.iso_field].length == 3 ? 'iso-3166-1' : 'iso-3166-2';
              insertData.data.push(item.data[0]);
            }
            else{
              toastr.error('There are some errors left!', 'Huch!');
              return;
            }
          });
          angular.forEach(vm.data[0].data[0], function(item, key){
            if(vm.indicators[key]){
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
          angular.forEach(vm.data.table, function(item, key){
            meta.push({
              field:key,
              data: item
            })
          })
          vm.meta.fields = fields;
          vm.meta.info = meta;
          DataService.post('data/tables', vm.meta).then(function(response){
              DataService.post('data/tables/'+response.table_name+'/insert', insertData).then(function(res){
                if(res == true){
                  toastr.success(insertData.data.length+' items importet to '+vm.meta.name,'Success');
                  vm.data = [];
                  vm.step = 0;
                }
              });
          }, function(response){
            if(response.message){
              toastr.error(response.message, 'Ouch!');
            }
          })
        }

        $scope.$watch(function(){ return IndexService.activeIndicator()}, function(n,o){
          if(n === o)return;
          vm.indicator = n;
        });
        $scope.$watch('vm.indicator', function(n,o){
          if(n === o) return;
          IndexService.setActiveIndicatorData(n);
        },true);
    }]);

})();

(function(){
    "use strict";

    angular.module('app.controllers').controller('IndexMetaMenuCtrl', ["$scope", "DataService", "IndexService", function($scope,DataService,IndexService){
      var vm = this;
      vm.data = IndexService.getData();
      vm.meta = IndexService.getMeta();
      vm.selectForEditing = selectForEditing;
      vm.indicators = [];

      function selectForEditing(key){
        if(typeof IndexService.getIndicator(key) == "undefined"){
          IndexService.setIndicator(key,{
            column_name:key,
            title:key
          });
        }
        vm.editingItem = key;
        vm.indicator = IndexService.getIndicator(key);
      }
      $scope.$watch(function(){ return IndexService.activeIndicator()}, function(n,o){
        if(n === o)return;
        vm.indicators[n.column_name] = n;
      },true);
    }]);
})();

(function(){
    "use strict";

    angular.module('app.controllers').controller('IndexcreatorCtrl', ["$scope", "DialogService", "DataService", "$timeout", "$state", "$filter", "leafletData", "toastr", "IconsService", "IndexService", "VectorlayerService", function($scope, DialogService,DataService, $timeout,$state, $filter, leafletData, toastr, IconsService,IndexService, VectorlayerService){
        //
        console.log($state);
        if($state.current.name == 'app.index.create'){
          if(IndexService.getData().length){
            if(confirm('Existing Data. Go On?')){
              $state.go('app.index.check');
            }
            else{
              IndexService.clear();
            }
          }
        }

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

	angular.module('app.controllers').controller('IndexeditorCtrl', ["$filter", "DataService", function ($filter,DataService) {
		//
		var vm = this;

		vm.indicators = [];

		activate();

		function activate(){
			loadAll();
		}

		function loadAll(){
			vm.indicators = DataService.getAll('indicators').$object
		}
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
			scrollWheelZoom: false
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

    angular.module('app.controllers').controller('CopyproviderCtrl', ["$scope", "DialogService", function($scope, DialogService){
        $scope.$parent.vm.askedToReplicate = true;
        $scope.$parent.vm.doProviders = true;
        $scope.$parent.vm.doCategories = true;
        $scope.$parent.vm.doMeasures = true;
        $scope.$parent.vm.doPublic = true;
        $scope.save = function(){
          $scope.$parent.vm.item.dataprovider = $scope.$parent.vm.doProviders ? $scope.$parent.vm.preProvider : [];
          $scope.$parent.vm.item.measure_type_id = $scope.$parent.vm.doMeasures ? $scope.$parent.vm.preMeasure : 0;
          $scope.$parent.vm.item.categories = $scope.$parent.vm.doCategories ? $scope.$parent.vm.preCategories: [];
          $scope.$parent.vm.item.is_public = $scope.$parent.vm.doPublic ? $scope.$parent.vm.prePublic: false;
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
            $state.go('app.index.create.check');
          	DialogService.hide();
        };

        $scope.hide = function(){
          $state.go('app.index.create.check');
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

(function(){
    "use strict";

    angular.module('app.controllers').controller('SelectisofetchersCtrl', ["$scope", "DialogService", function($scope, DialogService){
        $scope.iso = $scope.$parent.vm.meta.iso_field;
        $scope.list = $scope.$parent.vm.toSelect;

        $scope.save = function(){
          DialogService.hide();
        };

        $scope.hide = function(){
        	DialogService.hide();
        };

        $scope.$watch('list', function(n, o){
            console.log(n);
          if(n === o){
            return;
          }
          angular.forEach(n, function(item, key){
            if(item.entry.data[0][$scope.iso] && !o[key].entry.data[0][$scope.iso]){
              item.entry.errors.splice(0,1);
              $scope.$parent.vm.iso_errors --;
              $scope.$parent.vm.errors --;
            }
          });
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
					name = file.name;
					type = file.type;
					size = file.size;
					reader.readAsDataURL(file);
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
				options: '='
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

	angular.module('app.controllers').controller('IndicatorCtrl', ["$scope", "DataService", "DialogService", "$filter", function ($scope, DataService, DialogService, $filter) {
		//
		var vm = this;

		vm.categories = [];
		vm.dataproviders = [];
		vm.selectedItem = null;
		vm.searchText = null;
		vm.querySearch = querySearch;
		vm.querySearchCategory = querySearchCategory;

		vm.toggleCategorie = toggleCategorie;
		vm.selectedCategorie = selectedCategorie;

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
		}

		function toggleCategorie(categorie) {
			var index = vm.item.categories.indexOf(categorie);
			index === -1 ? vm.item.categories.push(categorie) : vm.item.categories.splice(index, 1);
		}

		function selectedCategorie(item, categorie) {
			if (typeof item.categories == "undefined") {
				item.categories = [];
				return false;
			}
			var index = item.categories.indexOf(categorie);
			return index !== -1 ? true : false;
		}
		$scope.$watch('vm.item', function (n, o) {
			if (n === o) return;
			if(!vm.askedToReplicate) {
				vm.preProvider = o.dataprovider;
				vm.preMeasure = o.measure_type_id;
				vm.preCategories = o.categories;
				vm.prePublic = o.is_public;
				DialogService.fromTemplate('copyprovider', $scope);
			} else {
				n.dataprovider = vm.doProviders ? vm.preProvider : [];
				n.measure_type_id = vm.doMeasures ? vm.preMeasure : 0;
				n.categories = vm.doCategories ? vm.preCategories: [];
				n.is_public = vm.doPublic ? vm.prePublic: false;
			}
		});
		$scope.$watch('vm.item', function (n, o) {
			if (n === o) return;
			if (typeof n.categories == "undefined") n.categories = [];
			if (n.title && n.measure_type_id && n.dataprovider && n.title.length >= 3) {
				n.base = true;
				n.full = n.categories.length ? true : false;
			} else {
				n.base = n.full = false;
			};
		}, true);
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

		activate();

		function activate() {
			check();
		}
		function check(){
			if (vm.item.title && vm.item.measure_type_id && vm.item.dataprovider && vm.item.title.length >= 3) {
				vm.item.base = true;
				vm.item.full = vm.item.categories.length ? true : false;
			} else {
				vm.item.base = vm.item.full = false;
			};
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
						errors = 0;
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
													row.errors.push({
														type:"1",
														message:"Field in row is not valid for database use!",
														column: item
													})
													errors++;
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
					//~ y = d3.scale.pow().exponent(1.3).domain([0, 0.25, 1]).range([0, 30, radius]),
					//~ y = d3.scale.linear().domain([0, 0.25, 0.5, 0.75, 1]).range([0, 30, 115, 200, radius]),
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

				// Add labels. Very ugly code to split sentences into lines. Can only make
				// code better if find a way to use d outside calls such as .text(function(d))

				// This block replaces the two blocks arround it. It is 'useful' because it
				// uses foreignObject, so that text will wrap around like in regular HTML. I tried
				// to get it to work, but it only introduced more bugs. Unfortunately, the
				// ugly solution (hard coded line splicing) won.
				//~ var textEnter = text.enter().append("foreignObject")
				//~ .attr("x",0)
				//~ .attr("y",-20)
				//~ .attr("height", 100)
				//~ .attr("width", function(d){ return (y(d.dy) +50); })
				//~ .attr("transform", function(d) {
				//~ var angleAlign = (d.x > 0.5 ? 2 : -2),
				//~ angle = x(d.x + d.dx / 2) * 180 / Math.PI - 90,
				//~ transl = (y(d.y) + circPadding);
				//~ d.rot = angle;
				//~ if (!d.depth) transl = -50;
				//~ if (angle > 90) transl += 120;
				//~ if (d.depth)
				//~ return "rotate(" + angle + ")translate(" + transl + ")rotate(" + (angle > 90 ? -180 : 0) + ")";
				//~ else
				//~ return "translate(" + transl + ")";
				//~ })
				//~ .append("xhtml:body")
				//~ .style("background", "none")
				//~ .style("text-align", function(d){ return (d.rot > 90 ? "left" : "right")})
				//~ .html(function(d){ return '<div class=' +"depth" + d.depth +' style=\"width: ' +(y(d.dy) +50) +'px;' +"text-align: " + (d.rot > 90 ? "right" : "left") +'">' +d.name +'</div>';})

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
					return d.color;
					if (d.color)
						return d.color;
					else {
						var tintDecay = 0.20;
						// Find child number
						var x = 0;
						while (d.parent.children[x] != d)
							x++;
						var tintChange = (tintDecay * (x + 1)).toString();
						return pusher.color(d.parent.color).tint(tintChange).html('hex6');
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
				"color": $scope.data.color,
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiLCJyb3V0ZXMuanMiLCJyb3V0ZXMucnVuLmpzIiwiY29uZmlnL2F1dGguanMiLCJjb25maWcvbG9hZGluZ19iYXIuanMiLCJjb25maWcvcmVzdGFuZ3VsYXIuanMiLCJjb25maWcvdGhlbWUuanMiLCJjb25maWcvdG9hc3RyLmpzIiwiZmlsdGVycy9hbHBoYW51bS5qcyIsImZpbHRlcnMvY2FwaXRhbGl6ZS5qcyIsImZpbHRlcnMvZmluZGJ5bmFtZS5qcyIsImZpbHRlcnMvaHVtYW5fcmVhZGFibGUuanMiLCJmaWx0ZXJzL3RydW5jYXRlX2NoYXJhY3RlcnMuanMiLCJmaWx0ZXJzL3RydW5jYXRlX3dvcmRzLmpzIiwiZmlsdGVycy90cnVzdF9odG1sLmpzIiwiZmlsdGVycy91Y2ZpcnN0LmpzIiwic2VydmljZXMvVmVjdG9ybGF5ZXIuanMiLCJzZXJ2aWNlcy9jb3VudHJpZXMuanMiLCJzZXJ2aWNlcy9kYXRhLmpzIiwic2VydmljZXMvZGlhbG9nLmpzIiwic2VydmljZXMvaWNvbnMuanMiLCJzZXJ2aWNlcy9pbmRleC5qcyIsInNlcnZpY2VzL2luZGl6ZXMuanMiLCJzZXJ2aWNlcy90b2FzdC5qcyIsImFwcC9JbmRleENoZWNrL0luZGV4Q2hlY2suanMiLCJhcHAvaGVhZGVyL2hlYWRlci5qcyIsImFwcC9ob21lL2hvbWUuanMiLCJhcHAvaW1wb3J0Y3N2L2ltcG9ydGNzdi5qcyIsImFwcC9pbmRleC9pbmRleC5qcyIsImFwcC9pbmRleC9pbmRleGJhc2UuanMiLCJhcHAvaW5kZXhNZXRhL2luZGV4TWV0YS5qcyIsImFwcC9pbmRleE1ldGEvaW5kZXhNZXRhTWVudS5qcyIsImFwcC9pbmRleGNyZWF0b3IvaW5kZXhjcmVhdG9yLmpzIiwiYXBwL2luZGV4ZWRpdG9yL2luZGV4ZWRpdG9yLmpzIiwiYXBwL2luZGV4aW5mby9pbmRleGluZm8uanMiLCJhcHAvbG9naW4vbG9naW4uanMiLCJhcHAvbWFwL21hcC5qcyIsImFwcC9zZWxlY3RlZC9zZWxlY3RlZC5qcyIsImFwcC9zaWRlYmFyL3NpZGViYXIuanMiLCJhcHAvc2lnbnVwL3NpZ251cC5qcyIsImFwcC90b2FzdHMvdG9hc3RzLmpzIiwiYXBwL3Vuc3VwcG9ydGVkX2Jyb3dzZXIvdW5zdXBwb3J0ZWRfYnJvd3Nlci5qcyIsImFwcC91c2VyL3VzZXIuanMiLCJkaWFsb2dzL2FkZF91c2Vycy9hZGRfdXNlcnMuanMiLCJkaWFsb2dzL2NvcHlwcm92aWRlci9jb3B5cHJvdmlkZXIuanMiLCJkaWFsb2dzL2VkaXRjb2x1bW4vZWRpdGNvbHVtbi5qcyIsImRpYWxvZ3MvZWRpdHJvdy9lZGl0cm93LmpzIiwiZGlhbG9ncy9leHRlbmREYXRhL2V4dGVuZERhdGEuanMiLCJkaWFsb2dzL2xvb3NlZGF0YS9sb29zZWRhdGEuanMiLCJkaWFsb2dzL3NlbGVjdGlzb2ZldGNoZXJzL3NlbGVjdGlzb2ZldGNoZXJzLmpzIiwiZGlyZWN0aXZlcy9idWJibGVzL2J1YmJsZXMuanMiLCJkaXJlY3RpdmVzL2J1YmJsZXMvZGVmaW5pdGlvbi5qcyIsImRpcmVjdGl2ZXMvY2lyY2xlZ3JhcGgvY2lyY2xlZ3JhcGguanMiLCJkaXJlY3RpdmVzL2NpcmNsZWdyYXBoL2RlZmluaXRpb24uanMiLCJkaXJlY3RpdmVzL2ZpbGVEcm9wem9uZS9kZWZpbml0aW9uLmpzIiwiZGlyZWN0aXZlcy9maWxlRHJvcHpvbmUvZmlsZURyb3B6b25lLmpzIiwiZGlyZWN0aXZlcy9oaXN0b3J5L2RlZmluaXRpb24uanMiLCJkaXJlY3RpdmVzL2hpc3RvcnkvaGlzdG9yeS5qcyIsImRpcmVjdGl2ZXMvaW5kaWNhdG9yL2RlZmluaXRpb24uanMiLCJkaXJlY3RpdmVzL2luZGljYXRvci9pbmRpY2F0b3IuanMiLCJkaXJlY3RpdmVzL2luZGljYXRvck1lbnUvZGVmaW5pdGlvbi5qcyIsImRpcmVjdGl2ZXMvaW5kaWNhdG9yTWVudS9pbmRpY2F0b3JNZW51LmpzIiwiZGlyZWN0aXZlcy9tZWRpYW4vZGVmaW5pdGlvbi5qcyIsImRpcmVjdGl2ZXMvbWVkaWFuL21lZGlhbi5qcyIsImRpcmVjdGl2ZXMvcGFyc2Vjc3YvZGVmaW5pdGlvbi5qcyIsImRpcmVjdGl2ZXMvcGFyc2Vjc3YvcGFyc2Vjc3YuanMiLCJkaXJlY3RpdmVzL3NpbXBsZWxpbmVjaGFydC9kZWZpbml0aW9uLmpzIiwiZGlyZWN0aXZlcy9zaW1wbGVsaW5lY2hhcnQvc2ltcGxlbGluZWNoYXJ0LmpzIiwiZGlyZWN0aXZlcy9zbGlkZVRvZ2dsZS9kZWZpbml0aW9uLmpzIiwiZGlyZWN0aXZlcy9zbGlkZVRvZ2dsZS9zbGlkZVRvZ2dsZS5qcyIsImRpcmVjdGl2ZXMvc3ViaW5kZXgvZGVmaW5pdGlvbi5qcyIsImRpcmVjdGl2ZXMvc3ViaW5kZXgvc3ViaW5kZXguanMiLCJkaXJlY3RpdmVzL3N1bmJ1cnN0L2RlZmluaXRpb24uanMiLCJkaXJlY3RpdmVzL3N1bmJ1cnN0L3N1bmJ1cnN0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLENBQUEsVUFBQTtDQUNBOztDQUVBLElBQUEsTUFBQSxRQUFBLE9BQUE7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7OztFQUlBLFFBQUEsT0FBQSxjQUFBLENBQUEsYUFBQSxhQUFBO0VBQ0EsUUFBQSxPQUFBLG1CQUFBLENBQUEsY0FBQSxnQkFBQSxZQUFBLFVBQUEsU0FBQSxhQUFBLGlCQUFBLGNBQUEsYUFBQSxlQUFBLGFBQUEsdUJBQUEsY0FBQSxjQUFBLG9CQUFBO0VBQ0EsUUFBQSxPQUFBLGVBQUE7RUFDQSxRQUFBLE9BQUEsZ0JBQUEsQ0FBQSxnQkFBQSxhQUFBLGFBQUEsZUFBQTtFQUNBLFFBQUEsT0FBQSxrQkFBQSxDQUFBLGFBQUE7RUFDQSxRQUFBLE9BQUEsY0FBQTs7OztBQ25CQSxDQUFBLFlBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsY0FBQSxxRUFBQSxVQUFBLGdCQUFBLG9CQUFBLG1CQUFBOztFQUVBLElBQUEsVUFBQSxVQUFBLFVBQUE7R0FDQSxPQUFBLGdCQUFBLFdBQUEsTUFBQSxXQUFBOzs7RUFHQSxtQkFBQSxVQUFBOztFQUVBO0lBQ0EsTUFBQSxPQUFBO0lBQ0EsVUFBQTtJQUNBLE9BQUE7S0FDQSxRQUFBO01BQ0EsYUFBQSxRQUFBO01BQ0EsWUFBQTtNQUNBLGNBQUE7O0tBRUEsTUFBQTtLQUNBLFFBQUE7TUFDQSxhQUFBLFFBQUE7TUFDQSxZQUFBO01BQ0EsY0FBQTs7OztJQUlBLE1BQUEsV0FBQTtJQUNBLElBQUE7SUFDQSxNQUFBO0tBQ0EsV0FBQTtNQUNBLGFBQUEsUUFBQTtNQUNBLFlBQUE7TUFDQSxjQUFBOzs7O0lBSUEsTUFBQSxZQUFBO0lBQ0EsS0FBQTtJQUNBLFVBQUE7OztJQUdBLE1BQUEsa0JBQUE7SUFDQSxLQUFBO0lBQ0EsT0FBQTtLQUNBLFNBQUE7TUFDQSxhQUFBLFFBQUE7TUFDQSxZQUFBO01BQ0EsY0FBQTs7Ozs7O0lBTUEsTUFBQSxvQkFBQTtJQUNBLEtBQUE7SUFDQSxPQUFBO0tBQ0EsU0FBQTtNQUNBLGFBQUEsUUFBQTtNQUNBLFlBQUE7TUFDQSxjQUFBO01BQ0EsU0FBQTtPQUNBLGtDQUFBLFVBQUEsYUFBQSxPQUFBO1FBQ0EsT0FBQSxZQUFBLE9BQUEsTUFBQTs7Ozs7OztJQU9BLE1BQUEsYUFBQTtJQUNBLFVBQUE7SUFDQSxLQUFBOzs7SUFHQSxNQUFBLG1CQUFBO0lBQ0EsS0FBQTtJQUNBLE9BQUE7S0FDQSxZQUFBO01BQ0EsYUFBQSxRQUFBO01BQ0EsWUFBQTtNQUNBLGNBQUE7Ozs7Ozs7Ozs7Ozs7O0lBY0EsTUFBQSxvQkFBQTtJQUNBLEtBQUE7SUFDQSxPQUFBO0tBQ0EsWUFBQTtNQUNBLGFBQUEsUUFBQTtNQUNBLFlBQUE7TUFDQSxjQUFBOzs7O0lBSUEsTUFBQSwwQkFBQTtJQUNBLEtBQUE7O0lBRUEsTUFBQSxtQkFBQTtJQUNBLEtBQUE7SUFDQSxNQUFBO0tBQ0EsUUFBQTtNQUNBLFlBQUEsUUFBQTtNQUNBLFlBQUE7TUFDQSxjQUFBOztLQUVBLFlBQUE7TUFDQSxhQUFBLFFBQUE7TUFDQSxZQUFBO01BQ0EsY0FBQTs7OztJQUlBLE1BQUEsa0JB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Q0FFQSxRQUFBLE9BQUEsZUFBQSxRQUFBLGNBQUEsVUFBQTtFQUNBLE9BQUEsU0FBQSxPQUFBLEtBQUE7R0FDQSxPQUFBLENBQUEsQ0FBQSxDQUFBLFNBQUEsTUFBQSxRQUFBLHNCQUFBLFNBQUEsSUFBQTtJQUNBLE9BQUEsSUFBQSxPQUFBLEdBQUEsZ0JBQUEsSUFBQSxPQUFBLEdBQUE7UUFDQTs7Ozs7QUNQQSxDQUFBLFlBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsZUFBQSxPQUFBLGNBQUEsWUFBQTtFQUNBLE9BQUEsVUFBQSxPQUFBLE1BQUEsT0FBQTs7TUFFQSxJQUFBLFNBQUE7R0FDQSxJQUFBLElBQUE7SUFDQSxNQUFBLE1BQUE7O0dBRUEsT0FBQSxJQUFBLEtBQUEsS0FBQTtJQUNBLElBQUEsTUFBQSxHQUFBLE9BQUEsY0FBQSxRQUFBLEtBQUEsaUJBQUEsQ0FBQSxHQUFBO01BQ0EsT0FBQSxLQUFBLE1BQUE7OztHQUdBLE9BQUE7Ozs7OztBQ2ZBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxlQUFBLFFBQUEsaUJBQUEsVUFBQTtFQUNBLE9BQUEsU0FBQSxTQUFBLEtBQUE7R0FDQSxLQUFBLENBQUEsS0FBQTtJQUNBLE9BQUE7O0dBRUEsSUFBQSxRQUFBLElBQUEsTUFBQTtHQUNBLEtBQUEsSUFBQSxFQUFBLEdBQUEsRUFBQSxNQUFBLFFBQUEsS0FBQTtJQUNBLE1BQUEsS0FBQSxNQUFBLEdBQUEsT0FBQSxHQUFBLGdCQUFBLE1BQUEsR0FBQSxNQUFBOztHQUVBLE9BQUEsTUFBQSxLQUFBOzs7O0FDWkEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLGVBQUEsT0FBQSxzQkFBQSxZQUFBO1FBQ0EsT0FBQSxVQUFBLE9BQUEsT0FBQSxhQUFBO1lBQ0EsSUFBQSxNQUFBLFFBQUE7Z0JBQ0EsT0FBQTs7WUFFQSxJQUFBLFNBQUEsR0FBQTtnQkFDQSxPQUFBOztZQUVBLElBQUEsU0FBQSxNQUFBLFNBQUEsT0FBQTtnQkFDQSxRQUFBLE1BQUEsVUFBQSxHQUFBOztnQkFFQSxJQUFBLENBQUEsYUFBQTtvQkFDQSxJQUFBLFlBQUEsTUFBQSxZQUFBOztvQkFFQSxJQUFBLGNBQUEsQ0FBQSxHQUFBO3dCQUNBLFFBQUEsTUFBQSxPQUFBLEdBQUE7O3VCQUVBO29CQUNBLE9BQUEsTUFBQSxPQUFBLE1BQUEsT0FBQSxPQUFBLEtBQUE7d0JBQ0EsUUFBQSxNQUFBLE9BQUEsR0FBQSxNQUFBLFNBQUE7OztnQkFHQSxPQUFBLFFBQUE7O1lBRUEsT0FBQTs7OztBQzNCQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsZUFBQSxPQUFBLGlCQUFBLFlBQUE7UUFDQSxPQUFBLFVBQUEsT0FBQSxPQUFBO1lBQ0EsSUFBQSxNQUFBLFFBQUE7Z0JBQ0EsT0FBQTs7WUFFQSxJQUFBLFNBQUEsR0FBQTtnQkFDQSxPQUFBOztZQUVBLElBQUEsT0FBQTtnQkFDQSxJQUFBLGFBQUEsTUFBQSxNQUFBO2dCQUNBLElBQUEsV0FBQSxTQUFBLE9BQUE7b0JBQ0EsUUFBQSxXQUFBLE1BQUEsR0FBQSxPQUFBLEtBQUEsT0FBQTs7O1lBR0EsT0FBQTs7OztBQ2pCQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsZUFBQSxRQUFBLHNCQUFBLFVBQUEsTUFBQTtFQUNBLE9BQUEsVUFBQSxNQUFBO0dBQ0EsT0FBQSxLQUFBLFlBQUE7Ozs7QUNMQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsZUFBQSxPQUFBLFdBQUEsV0FBQTtFQUNBLE9BQUEsVUFBQSxRQUFBO0dBQ0EsS0FBQSxDQUFBLE9BQUE7SUFDQSxPQUFBOztHQUVBLE9BQUEsTUFBQSxVQUFBLEdBQUEsR0FBQSxnQkFBQSxNQUFBLFVBQUE7Ozs7OztBQ1JBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxnQkFBQSxRQUFBLHNCQUFBLFVBQUE7O1FBRUEsTUFBQTtVQUNBLEtBQUE7WUFDQSxPQUFBO1lBQ0EsT0FBQTs7VUFFQSxLQUFBO1lBQ0EsT0FBQTtZQUNBLEtBQUE7WUFDQSxLQUFBO1lBQ0EsS0FBQTtZQUNBLElBQUE7WUFDQSxRQUFBOztVQUVBLFVBQUEsU0FBQSxFQUFBO1lBQ0EsT0FBQSxLQUFBLEtBQUEsUUFBQTs7VUFFQSxVQUFBLFVBQUE7WUFDQSxPQUFBLEtBQUEsS0FBQTs7VUFFQSxTQUFBLFVBQUE7WUFDQSxPQUFBLEtBQUEsS0FBQTs7VUFFQSxRQUFBLFdBQUE7WUFDQSxPQUFBLEtBQUEsS0FBQTs7VUFFQSxJQUFBLFVBQUE7WUFDQSxPQUFBLEtBQUEsS0FBQTs7VUFFQSxNQUFBLFdBQUE7WUFDQSxPQUFBLEtBQUEsS0FBQTs7VUFFQSxNQUFBLFdBQUE7WUFDQSxPQUFBLEtBQUEsS0FBQTs7Ozs7OztBQ3JDQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsZ0JBQUEsUUFBQSxvQ0FBQSxTQUFBLFlBQUE7O1FBRUEsT0FBQTtVQUNBLFdBQUE7VUFDQSxXQUFBLFVBQUE7WUFDQSxPQUFBLEtBQUEsWUFBQSxZQUFBLE9BQUEsa0JBQUE7O1VBRUEsU0FBQSxVQUFBO1lBQ0EsR0FBQSxDQUFBLEtBQUEsVUFBQSxPQUFBO2NBQ0EsS0FBQTs7WUFFQSxPQUFBLEtBQUE7Ozs7Ozs7QUNkQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsZ0JBQUEsUUFBQSxlQUFBO0lBQ0EsWUFBQSxVQUFBLENBQUEsY0FBQTs7SUFFQSxTQUFBLFlBQUEsYUFBQSxPQUFBO1FBQ0EsT0FBQTtVQUNBLFFBQUE7VUFDQSxRQUFBO1VBQ0EsTUFBQTs7O1FBR0EsU0FBQSxPQUFBLE1BQUE7VUFDQSxJQUFBLE9BQUEsWUFBQSxJQUFBLE9BQUE7WUFDQSxLQUFBLEtBQUEsVUFBQSxJQUFBLFNBQUEsS0FBQTtjQUNBLE9BQUEsTUFBQSxLQUFBLFlBQUE7Y0FDQSxRQUFBLElBQUE7O1lBRUEsT0FBQTs7UUFFQSxTQUFBLE9BQUEsT0FBQSxHQUFBO1VBQ0EsT0FBQSxZQUFBLElBQUEsT0FBQSxJQUFBOztRQUVBLFNBQUEsS0FBQSxPQUFBLEtBQUE7VUFDQSxPQUFBLFlBQUEsSUFBQSxPQUFBLEtBQUE7Ozs7OztBQ3pCQSxD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QUEsWUFBQSxLQUFBOztVQUVBLGFBQUEsVUFBQTtZQUNBLE9BQUEsWUFBQSxLQUFBOztVQUVBLGNBQUEsU0FBQSxJQUFBO1lBQ0EsT0FBQSxZQUFBLFdBQUE7O1VBRUEsaUJBQUEsVUFBQTtZQUNBLE9BQUE7Ozs7Ozs7QUNuR0EsQ0FBQSxZQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGdCQUFBLFFBQUEsa0NBQUEsVUFBQSxhQUFBOztFQUVBLE9BQUE7R0FDQSxPQUFBO0lBQ0EsTUFBQTtLQUNBLE1BQUE7S0FDQSxXQUFBOztJQUVBLFVBQUE7S0FDQSxNQUFBO0tBQ0EsVUFBQTs7O0dBR0EsV0FBQSxTQUFBLE9BQUE7O0lBRUEsS0FBQSxNQUFBLFNBQUEsT0FBQSxZQUFBLE9BQUEsV0FBQSxRQUFBO0lBQ0EsS0FBQSxNQUFBLFNBQUEsWUFBQSxZQUFBLE9BQUEsV0FBQSxRQUFBO0lBQ0EsS0FBQSxNQUFBLEtBQUEsT0FBQSxLQUFBLE1BQUEsU0FBQSxLQUFBO0lBQ0EsS0FBQSxNQUFBLEtBQUEsWUFBQSxLQUFBLE1BQUEsU0FBQSxVQUFBO0lBQ0EsT0FBQSxLQUFBOztHQUVBLFNBQUEsWUFBQTtJQUNBLE9BQUEsS0FBQSxNQUFBLEtBQUE7O0dBRUEsY0FBQSxZQUFBO0lBQ0EsT0FBQSxLQUFBLE1BQUEsS0FBQTs7R0FFQSxnQkFBQSxZQUFBO0lBQ0EsT0FBQSxLQUFBLE1BQUEsU0FBQTs7R0FFQSxxQkFBQSxZQUFBO0lBQ0EsT0FBQSxLQUFBLE1BQUEsU0FBQTs7Ozs7OztBQ2xDQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsZ0JBQUEsUUFBQSw2QkFBQSxTQUFBLFNBQUE7O0VBRUEsSUFBQSxRQUFBO0dBQ0EsV0FBQTtHQUNBLFNBQUE7O0VBRUEsT0FBQTtHQUNBLE1BQUEsU0FBQSxRQUFBO0lBQ0EsSUFBQSxDQUFBLFFBQUE7S0FDQSxPQUFBOzs7SUFHQSxPQUFBLFNBQUE7S0FDQSxTQUFBO09BQ0EsUUFBQTtPQUNBLFNBQUE7T0FDQSxPQUFBO09BQ0EsVUFBQTs7O0dBR0EsT0FBQSxTQUFBLFFBQUE7SUFDQSxJQUFBLENBQUEsUUFBQTtLQUNBLE9BQUE7OztJQUdBLE9BQUEsU0FBQTtLQUNBLFNBQUE7T0FDQSxRQUFBO09BQ0EsU0FBQTtPQUNBLE1BQUE7T0FDQSxPQUFBO09BQ0EsVUFBQTs7Ozs7O0FDbENBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLDJGQUFBLFNBQUEsWUFBQSxRQUFBLGVBQUEsYUFBQSxhQUFBOzs7O1FBSUEsSUFBQSxLQUFBO1FBQ0EsR0FBQSxPQUFBO1FBQ0EsR0FBQSxXQUFBO1FBQ0EsR0FBQSxhQUFBO1FBQ0EsR0FBQSxpQkFBQTtRQUNBLEdBQUEsZ0JBQUE7UUFDQSxHQUFBLHFCQUFBO1FBQ0EsR0FBQSxpQkFBQTtRQUNBLEdBQUEsY0FBQTtRQUNBLEdBQUEsc0JBQUE7UUFDQSxHQUFBLGlCQUFBO1FBQ0EsR0FBQSxXQUFBO1FBQ0EsR0FBQSxVQUFBO1FBQ0EsR0FBQSxPQUFBLGFBQUE7UUFDQSxHQUFBLE9BQUEsYUFBQTtRQUNBLEdBQUEsU0FBQSxhQUFBO1FBQ0EsR0FBQSxRQUFBO1VBQ0EsUUFBQTtVQUNBLE9BQUE7VUFDQSxPQUFBO1VBQ0EsTUFBQTs7UUFFQSxHQUFBLFNBQUEsWUFBQSxPQUFBO1FBQ0E7O1FBRUEsU0FBQSxVQUFBO1VBQ0E7OztRQUdBLFNBQUEsYUFBQTtVQUNBLEdBQUEsbUJBQUE7VUFDQSxHQUFBLEdBQUEsS0FBQSxPQUFBO1lBQ0EsR0FBQSxPQUFBLEtBQUEsU0FBQSxRQUFBO2NBQ0EsUUFBQSxRQUFBLFNBQUEsU0FBQSxNQUFBO2dCQUNBLElBQUEsUUFBQTtnQkFDQSxRQUFBLFFBQUEsR0FBQSxLQUFBLEdBQUEsS0FBQSxRQUFBLFNBQUEsTUFBQTtvQkFDQSxJQUFBLFVBQUEsS0FBQSxNQUFBLE1BQUE7b0JBQ0EsUUFBQSxRQUFBLFNBQUEsU0FBQSxPQUFBO3NCQUNBLEdBQUEsT0FBQSxVQUFBLE9BQUE7d0JBQ0E7Ozs7Z0JBSUEsR0FBQSxTQUFBLEdBQUEsS0FBQSxHQUFBLEtBQUEsT0FBQSxTQUFBLEVBQUE7a0JBQ0EsR0FBQSxpQkFBQSxLQUFBOzs7Y0FHQSxHQUFBLEdBQUEsaUJBQUEsT0FBQTtnQkFDQSxjQUFBLGFBQUEsY0FBQTs7Ozs7OztRQU9BLFNBQUEsT0FBQSxXQUFBO1VBQ0EsR0FBQSxTQUFBO1NBQ0E7UUFDQSxTQUFBLGNBQUEsT0FBQTtVQUNBLE9BQUEsR0FBQSxPQUFBLFFBQUEsV0FBQSxHQUFBLE1BQUEsQ0FBQSxRQUFBO1NBQ0E7UUFDQSxTQUFBLG1CQUFBLE1BQUEsT0FBQTs7O1NBR0E7UUFDQSxTQUFBLGVBQUEsS0FBQTtVQUNBLE9BQUEsS0FBQSxPQUFBLFNBQUEsSUFBQSxXQUFBOztRQUVBLFNBQUEsYUFBQTtVQUNBLFFBQUEsUUFBQSxHQUFBLE1BQUEsU0FBQSxLQUFBLElBQUE7WUFDQSxRQUFBLFFBQUEsSUFBQSxLQUFBLElBQUEsU0FBQSxNQUFBLEVBQUE7Y0FDQSxHQUFBLE1BQUEsU0FBQSxPQUFBLEVBQUE7Z0JBQ0EsZ0RBQUEsT0FBQSxLQUFBLEtBQUEsV0FBQSxjQUFBLFFBQUEsU0FBQSxDQUFBLEVBQUE7a0JBQ0EsR0FBQSxLQUFBLEtBQUEsS0FBQSxHQUFBLEtBQUE7a0JBQ0EsR0FBQTtrQkFDQSxJQUFBLE9BQUEsT0FBQSxFQUFBOzs7O1lBSUEsR0FBQSxDQUFBLElBQUEsS0FBQSxHQUFBLEdBQUEsS0FBQSxXQUFBO2NBQ0EsR0FBQTtjQUNBLEdBQUE7Y0FDQSxJQUFBLE9BQUEsS0FBQTtnQkFDQSxLQUFBO2dCQUNBLFFBQUE7Z0JBQ0EsUUFBQSxHQUFBLEtBQUE7Ozs7O1FBS0EsU0FBQSxlQUFBLEdBQUEsSUFBQTtVQUNBLEdBQUEsU0FBQTtVQUNBLGNBQUEsYUFBQSxjQUFBOztRQUVBLFNBQUEsZ0JBQUE7VUFDQSxRQUFBLFFBQUEsR0FBQSxVQUFBLFNBQUEsTUFBQSxJQUFBO1lBQ0EsUUFBQSxRQUFBLEtBQUEsUUFBQSxTQUFBLE9BQUEsRUFBQTtjQUNBLEdBQUEsTUFBQSxRQUFBLEVBQUE7Z0JBQ0EsR0FBQTs7Y0FFQSxHQUFBOztZQUVBLEdBQUEsS0FBQSxPQUFBLEdBQUEsS0FBQSxRQUFBLE9BQUE7WUFDQSxHQUFBLFNBQUEsT0FBQSxLQUFBOztVQUVBLEdBQUEsR0FBQSxLQUFBLFVBQUEsRUFBQTtZQUNBLEdBQUE7WUFDQSxPQUFBLElBQUE7OztRQUdBLFNBQUEsU0FBQTtVQUNBLEdBQUEsTUFBQSxHQUFBLFNBQUE7VUFDQSxjQUFBLGFBQUEsV0FBQTs7UUFFQSxTQUFBLFlBQUE7VUFDQSxHQUFBLE9BQUE7O1FBRUEsU0FBQSxVQUFBO1VBQ0EsR0FBQSxDQUFBLEdBQUEsS0FBQSxVQUFBO1lBQ0EsT0FBQSxNQUFBLDBDQUFBO1lBQ0EsT0FBQTs7VUFFQSxHQUFBLENBQUEsR0FBQSxLQUFBLGNBQUE7WUFDQSxPQUFBLE1BQUEsOENBQUE7WUFDQSxPQUFBOztVQUVBLEdBQUEsR0FBQSxLQUFBLGlCQUFBLEdBQUEsS0FBQSxVQUFBO1lBQ0EsT0FBQSxNQUFBLG1EQUFBO1lBQ0EsT0FBQTs7O1VBR0EsR0FBQSxXQUFBO1VBQ0EsR0FBQSxXQUFBO1VBQ0EsSUFBQSxVQUFBO1VBQ0EsSUFBQSxXQUFBO1VBQ0EsSUFBQSxVQUFBO1VBQ0EsUUFBQSxRQUFBLEdBQUEsTUFBQSxTQUFBLE1BQUEsSUFBQTtjQUNBLEdBQUEsS0FBQSxLQUFBLEdBQUEsR0FBQSxLQUFBLFdBQUE7Z0JBQ0EsWUFBQSxLQUFBLEtBQUEsR0FBQSxHQUFBLEtBQUEsV0FBQSxVQUFBLElBQUEsSUFBQTs7Y0FFQSxRQUFBLEtBQUEsS0FBQSxHQUFBLEdBQUEsS0FBQTtnQkFDQSxLQUFBO3NCQUNBLEtBQUEsS0FBQSxHQUFBLEdBQUEsS0FBQSxpQkFBQTtrQkFDQTtnQkFDQSxLQUFBO3dCQUNBLEtBQUEsS0FBQSxHQUFBLEdBQUEsS0FBQSxtQkFBQTtvQkFDQTtnQkFDQSxLQUFBO3dCQUNBLEtBQUEsS0FBQSxHQUFBLEdBQUEsS0FBQSxtQkFBQTtvQkFDQTtnQkFDQSxLQUFBO3NCQUNBLEtBQUEsS0FBQSxHQUFBLEdBQUEsS0FBQSxrQkFBQTtvQkFDQTtnQkFDQTtrQkFDQTs7Y0FFQSxR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QUE7TUFDQSxHQUFBLFNBQUEsT0FBQSxPQUFBO01BQ0E7O0tBRUEsR0FBQSxPQUFBLE9BQUEsVUFBQTtNQUNBLEdBQUEsT0FBQTtNQUNBLEdBQUEsUUFBQSxVQUFBLEtBQUEsR0FBQTtNQUNBLEdBQUEsUUFBQSxTQUFBO01BQ0EsV0FBQSxTQUFBO01BQ0EsSUFBQSxZQUFBLE9BQUEsT0FBQSxVQUFBLE1BQUE7TUFDQSxRQUFBLFFBQUEsV0FBQSxTQUFBLElBQUE7T0FDQSxHQUFBLFFBQUEsVUFBQSxLQUFBLGVBQUE7OztNQUdBLFVBQUEsS0FBQSxHQUFBLFFBQUE7TUFDQSxZQUFBLE9BQUEsa0JBQUEsV0FBQSxLQUFBLFVBQUEsTUFBQTtPQUNBLEdBQUEsT0FBQTs7Ozs7Ozs7RUFRQSxTQUFBLFFBQUE7R0FDQSxRQUFBLFFBQUE7O0VBRUEsU0FBQSxlQUFBLFNBQUE7R0FDQSxJQUFBLFdBQUEsTUFBQSxHQUFBLGNBQUEsSUFBQTtJQUNBLEdBQUEsYUFBQTtVQUNBO0lBQ0EsR0FBQSxhQUFBOztHQUVBLEdBQUEsZUFBQSxHQUFBLGFBQUEsa0JBQUE7R0FDQTtFQUNBLFNBQUEsU0FBQSxNQUFBO0dBQ0EsR0FBQSxXQUFBLGVBQUE7R0FDQSxnQkFBQTtHQUNBOztFQUVBLFNBQUEsYUFBQTtHQUNBLEdBQUEsWUFBQSxDQUFBLEdBQUE7R0FDQSxHQUFBLFlBQUEsR0FBQSxhQUFBLE9BQUEsaUJBQUE7O0VBRUEsU0FBQSxXQUFBLEtBQUE7R0FDQSxHQUFBLFVBQUE7R0FDQSxHQUFBO0dBQ0E7O0VBRUEsU0FBQSxtQkFBQSxLQUFBO0dBQ0EsSUFBQSxHQUFBLFdBQUE7SUFDQSxTQUFBLFlBQUE7S0FDQSxHQUFBLFVBQUEsT0FBQSxHQUFBLHFCQUFBLFNBQUEsR0FBQSxRQUFBLEtBQUEsV0FBQTs7O0dBR0E7RUFDQSxTQUFBLFdBQUE7R0FDQSxHQUFBLENBQUEsR0FBQSxRQUFBO0lBQ0E7O0dBRUEsSUFBQSxPQUFBO0dBQ0EsUUFBQSxRQUFBLEdBQUEsTUFBQSxTQUFBLE1BQUE7SUFDQSxLQUFBLEdBQUEsVUFBQSxRQUFBLFdBQUEsS0FBQSxHQUFBLFVBQUE7SUFDQSxLQUFBLFdBQUEsV0FBQSxLQUFBLEdBQUEsVUFBQTs7R0FFQSxHQUFBLE9BQUEsUUFBQSxXQUFBLEdBQUEsTUFBQSxDQUFBLEdBQUEsVUFBQSxPQUFBLE9BQUE7R0FDQSxPQUFBLEdBQUEsS0FBQSxRQUFBLEdBQUEsV0FBQTtHQUNBLEdBQUEsUUFBQSxHQUFBLFVBQUEsS0FBQSxXQUFBO0dBQ0EsR0FBQSxnQkFBQTtLQUNBLE1BQUEsR0FBQSxVQUFBLFNBQUE7S0FDQSxNQUFBLEdBQUEsVUFBQSxLQUFBOztHQUVBLE9BQUE7O0VBRUEsU0FBQSxRQUFBLFFBQUE7O0dBRUEsSUFBQSxPQUFBLEdBQUEsS0FBQSxRQUFBLFdBQUE7R0FDQSxPQUFBOztFQUVBLFNBQUEsYUFBQTtHQUNBLEdBQUEsT0FBQSxDQUFBLEdBQUE7R0FDQTs7RUFFQSxTQUFBLGdCQUFBO0dBQ0EsT0FBQSxHQUFBLFVBQUEsQ0FBQSxHQUFBO0dBQ0E7RUFDQSxTQUFBLGdCQUFBLElBQUE7R0FDQSxZQUFBLE9BQUEsU0FBQSxPQUFBLE9BQUEsT0FBQSxLQUFBLEtBQUEsVUFBQSxNQUFBO0lBQ0EsR0FBQSxRQUFBLE9BQUE7SUFDQSxlQUFBOzs7RUFHQSxTQUFBLGVBQUEsS0FBQTtHQUNBLEdBQUEsQ0FBQSxPQUFBLE9BQUEsVUFBQTtJQUNBLFlBQUEsT0FBQSxrQkFBQSxDQUFBLE1BQUEsS0FBQSxVQUFBLE1BQUE7S0FDQSxHQUFBLE9BQUE7Ozs7OztFQU1BLFNBQUEsZ0JBQUEsTUFBQTtHQUNBLElBQUEsUUFBQSxDQUFBLEdBQUEsUUFBQSxVQUFBLENBQUEsUUFBQSxHQUFBLFFBQUEsUUFBQTtJQUNBLEdBQUE7Ozs7RUFJQSxTQUFBLG1CQUFBO0dBQ0EsR0FBQSxRQUFBLFlBQUEsQ0FBQSxHQUFBO0dBQ0EsR0FBQSxRQUFBLFNBQUEsQ0FBQSxHQUFBLFFBQUE7R0FDQSxJQUFBLEdBQUEsUUFBQSxRQUFBO0lBQ0EsR0FBQSxPQUFBO0lBQ0EsV0FBQSxTQUFBO0lBQ0EsR0FBQSxVQUFBLFFBQUEsY0FBQTtJQUNBLEdBQUEsVUFBQSxTQUFBOztVQUVBO0lBQ0EsV0FBQSxTQUFBO0lBQ0EsUUFBQSxRQUFBLEdBQUEsVUFBQSxPQUFBLEdBQUEscUJBQUEsVUFBQSxVQUFBLFNBQUE7S0FDQSxRQUFBLFdBQUE7O0lBRUEsR0FBQSxVQUFBLE9BQUEsR0FBQSxxQkFBQSxTQUFBLEdBQUEsUUFBQSxLQUFBLFdBQUE7SUFDQSxHQUFBLFVBQUEsUUFBQSxjQUFBO0lBQ0EsR0FBQSxVQUFBLFNBQUE7SUFDQSxZQUFBLE9BQUEsa0JBQUEsQ0FBQSxHQUFBLFFBQUEsTUFBQSxLQUFBLFVBQUEsTUFBQTtLQUNBLEdBQUEsT0FBQTs7SUFFQSxPQUFBLEdBQUEsMEJBQUE7S0FDQSxNQUFBLE9BQUEsT0FBQTtLQUNBLEtBQUEsT0FBQSxPQUFBOzs7O0dBSUE7O0VBRUEsU0FBQSxtQkFBQSxTQUFBO0dBQ0EsSUFBQSxRQUFBO0dBQ0EsUUFBQSxRQUFBLEdBQUEsUUFBQSxXQUFBLFVBQUEsS0FBQSxLQUFBO0lBQ0EsSUFBQSxXQUFBLE9BQUEsT0FBQSxHQUFBLFNBQUE7S0FDQSxHQUFBLFFBQUEsVUFBQSxPQUFBLEtBQUE7S0FDQSxRQUFBOzs7R0FHQSxJQUFBLENBQUEsT0FBQTtJQUNBLEdBQUEsUUFBQSxVQUFBLEtBQUE7SUFDQTtHQUNBLElBQUEsT0FBQTtHQUNBLElBQUEsVUFBQTtHQUNBLFFBQUEsUUFBQSxHQUFBLFFBQUEsV0FBQSxVQUFBLE1BQUEsS0FBQTtJQUNBLEtBQUEsS0FBQSxLQUFBO0lBQ0EsR0FBQSxLQUFBLEdBQUEsVUFBQSxRQUFBLEdBQUEsUUFBQSxJQUFBO0tBQ0EsUUFBQSxLQUFBLEtBQUE7OztHQUdBLElBQUEsS0FBQSxTQUFBLEdBQUE7SUFDQSxZQUFBLE9BQUEsa0JBQUEsTUFBQSxLQUFBLFVBQUEsTUFBQTtLQUNBLEdBQUEsT0FBQTs7SUFFQSxPQUFBLEdBQUEsa0NBQUE7S0FDQSxPQUFBLE9BQUEsT0FBQTtLQUNBLE1BQUEsT0FBQSxPQUFBO0tBQ0EsVUFBQSxRQUFBLEtBQUE7Ozs7R0FJQSxPQUFBLENBQUE7R0FDQTs7RUFFQSxTQUFBLFlBQUE7R0FDQSxJQUFBLENBQUEsR0FBQSxTQUFBO0lBQ0EsT0FBQTs7O0dBR0EsT0FBQSxDQUFBLEdBQUEsUUFBQSxHQUFBLFdBQUEsS0FBQTtHQUNBOztFQUVBLFNBQUEsY0FBQTtHQUNBLElBQUEsQ0FBQSxHQUFBLFNBQUE7SUFDQSxPQUFBOztHQUVBLE9BQUEsR0FBQSxRQUFBLGlCQUFBLElBQUEsa0JBQUE7R0FDQTs7RUFFQSxTQUFBLE9BQUEsR0FBQTtHQUNBLEdBQUEsWUFBQTs7O0VBR0EsU0FBQSxVQUFBLE1BQUE7R0FDQSxJQUFBLFFBQUE7R0FDQSxRQUFBLFFBQUEsS0FBQSxVQUFBLFVBQUEsTUFBQTtJQUNBLElBQUEsS0FBQSxlQUFBLEdBQUEsUUFBQSxZQUFBLE1BQUE7S0FDQSxHQUFBLGFBQUE7O0lBRUEsVUFBQTs7R0FFQSxPQUFBOzs7RUFHQSxTQUFBLFdBQUE7R0FDQSxVQUFBLEdBQUE7R0FDQTs7RUFFQSxTQUFBLGdCQUFBLE1BQUE7R0FDQSxJQUFBLFNBQUE7R0FDQSxRQUFBLFFBQUEsR0FBQSxNQUFBLFVBQUEsS0FBQTtJQUNBLElBQUEsSUFBQSxXQUFBLE1BQUE7S0FDQSxTQUFBOzs7R0FHQSxPQUFBO0dBQ0E7O0VBRUEsU0FBQSxlQUFBLEtBQUE7R0FDQSxJQUFBLFNBQUE7R0FDQSxRQUFBLFFBQUEsR0FBQSxNQUFBLFVBQUEsS0FBQTtJQUNBLElBQUEsSUFBQSxPQUFBLEtBQUE7S0FDQSxTQUFBOzs7O0dBSUEsT0FBQTtHQUNBOztFQUVBLFNBQUEsYUFBQSxPQUFBOztHQUVBLEdBQUEsU0FBQSxTQUFBLGNBQUE7R0FDQSxHQUFBLE9BQUEsUUFBQTtHQUNBLEdBQUEsT0FBQSxTQUFBO0dBQ0EsR0FBQSxNQUFBLEdBQUEsT0FBQSxXQUFBO0dBQ0EsSUFBQSxXQUFBLEdBQUEsSUFBQSxxQkFBQSxHQUFBLEdBQUEsS0FBQTtHQUNBLFNBQUEsYUFBQSxHQUFBO0dBQ0EsU0FBQSxhQUFBLE1BQUEsVUFBQTtHQUNBLFNBQUEsYUFBQSxHQUFBO0dBQ0EsR0FBQSxJQUFBLFlBQUE7R0FDQSxHQUFBLElBQUEsU0FBQSxHQUFBLEdBQUEsS0FBQTtHQUNBLEdBQUEsVUFBQSxHQUFBLElBQUEsYUFBQSxHQUFBLEdBQUEsS0FBQSxHQUFBOzs7O0VBSUEsU0FBQSxhQUFBLE9BQUE7R0FDQSxJQUFBLFdBQUEsR0FBQSxJQUFBLHFCQUFBLEdBQUEsR0FBQSxLQUFBO0dBQ0EsU0FBQSxhQUFBLEdBQUE7R0FDQSxTQUFBLGFBQUEsTUFBQSxTQUFBO0dBQ0EsU0FBQSxhQUFBLEdBQUE7R0FDQSxHQUFBLElBQUEsWUFBQTtHQUNBLEdBQUEsSUFBQSxTQUFBLEdBQUEsR0FBQSxLQUFBO0dBQ0EsR0FBQSxVQUFBLEdBQUEsSUFBQSxhQUFBLEdBQUEsR0FBQSxLQUFBLEdBQUE7O0dBRUE7O0VBRUEsU0FBQSxjQUFBLFNBQUE7R0FDQSxJQUFBLFFBQUE7R0FDQSxJQUFBLE1BQUEsUUFBQSxXQUFBLEdBQUE7R0FDQSxJQUFBLFNBQUEsZUFBQTtHQUNBLElBQUEsUUFBQSxHQUFBLFVBQUEsUUFBQTs7O0dBR0EsSUFBQSxXQUFBLFNBQUEsTUFBQSxNQUFBLE9BQUEsVUFBQTs7R0FFQSxJQUFBLFFBQUEsVUFBQSxHQUFBLFFBQUEsWUFBQSxPQUFBLEdBQUEsUUFBQSxXQUFBLEtBQUEsT0FBQSxHQUFBLFFBQUEsV0FBQSxLQUFBLE1BQUEsR0FBQSxRQUFBLFdBQUEsS0FBQTtHQUNBLE1BQUEsUUFBQTtHQUNBLE1BQUEsVUFBQTtJQUNBLE9BQUE7SUFDQSxNQUFBOztHQUVBLE1BQUEsV0FBQTtJQUNBLE9BQUE7SUFDQSxTQUFBO0tBQ0EsT0FBQTtLQUNBLE1BQUE7OztHQUdBLE9BQUE7R0FDQTs7RUFFQSxTQUFBLGVBQUEsU0FBQTs7R0FFQSxJQUFBLFFBQUE7R0FDQSxJQUFBLE1BQUEsUUFBQSxXQUFBLEdBQUE7O0dBRUEsSUFBQSxTQUFBLGVBQUE7R0FDQSxJQUFBLFFBQUEsR0FBQSxVQUFBLFFBQUE7R0FDQSxJQUFBLE9BQUEsUUFBQTtHQUNBLEdBQUEsT0FBQSxHQUFBLFFBQUEsSUFBQTtLQUNBLFFBQUEsV0FBQTs7O0dBR0EsUUFBQTtHQUNBLEtBQUE7SUFDQSxJQUFBLE9BQUEsT0FBQSxVQUFBLGFBQUE7OztLQUdBLElBQUEsV0FBQSxTQUFBLE1BQUEsTUFBQSxTQUFBLE9BQUEsV0FBQTs7S0FFQSxJQUFBLFFBQUEsVUFBQSxHQUFBLFFBQUEsWUFBQSxPQUFBLEdBQUEsUUFBQSxXQUFBLEtBQUEsT0FBQSxHQUFBLFFBQUEsV0FBQSxLQUFBLE1BQUEsR0FBQSxRQUFBLFdBQUEsS0FBQTtLQUNBLE1BQUEsUUFBQSxVQUFBLEdBQUEsUUFBQSxZQUFBLE9BQUEsR0FBQSxRQUFBLFdBQUEsS0FBQSxPQUFBLEdBQUEsUUFBQSxXQUFBLEtBQUE7S0FDQSxNQUFBLFVBQUE7TUFDQSxPQUFBO01BQ0EsTUFBQTs7S0FFQSxNQUFBLFdBQUE7TUFDQSxPQUFBLFVBQUEsR0FBQSxRQUFBLFlBQUEsT0FBQSxHQUFBLFFBQUEsV0FBQSxLQUFBLE9BQUEsR0FBQSxRQUFBLFdBQUEsS0FBQTtNQUNBLFNBQUE7T0FDQSxPQUFBO09BQ0EsTUFBQTs7O0tBR0E7V0FDQTs7S0FFQSxNQUFBLFFBQUE7S0FDQSxNQUFBLFVBQUE7TUFDQSxPQUFBO01BQ0EsTUFBQTs7OztHQUlBLElBQUEsUUFBQSxNQUFBLFNBQUEsbUJBQUEsVUFBQSxlQUFBO0lBQ0EsTUFBQSxjQUFBLFlBQUE7S0FDQSxJQUFBLFFBQUE7TUFDQSxNQUFBLFFBQUEsV0FBQTtNQUNBLFVBQUEsQ0FBQSxLQUFBO01BQ0EsVUFBQTs7S0FFQSxPQUFBOzs7R0FHQSxPQUFBO0dBQ0E7O0VBRUEsT0FBQSxPQUFBLGNBQUEsVUFBQSxHQUFBLEdBQUE7R0FDQSxJQUFBLE1BQUEsR0FBQTtJQUNBOzs7R0FHQSxHQUFBLEVBQUEsS0FBQTtJQUNBLEdBQUEsRUFBQSxJQUFBO0tBQ0EsR0FBQSxVQUFBLE9BQUEsR0FBQSxxQkFBQSxTQUFBLEVBQUEsS0FBQSxXQUFBOztJQUVBO0lBQ0EsZ0JBQUEsRUFBQTtJQUNBLEdBQUEsVUFBQSxPQUFBLEdBQUEscUJBQUEsU0FBQSxFQUFBLEtBQUEsV0FBQTtJQUNBLEdBQUEsT0FBQSxRQUFBLFFBQUEsNkJBQUEsT0FBQSxRQUFBLFFBQUEsaUJBQUE7S0FDQSxPQUFBLEdBQUEsMkJBQUE7TUFDQSxPQUFBLE9BQUEsT0FBQTtNQUNBLE1BQUEsRUFBQTs7O1VBR0E7SUFDQSxPQUFBLEdBQUEsaUJBQUE7S0FDQSxPQUFBLE9BQUEsT0FBQTs7OztFQUlBLE9BQUEsT0FBQSwwQkFBQSxVQUFBLEdBQUEsR0FBQTtHQUNBLElBQUEsTUFBQSxHQUFBO0lBQ0E7O0dBRUEsSUFBQSxFQUFBO0lBQ0EsYUFBQSxFQUFBO1FBQ0E7SUFDQSxhQUFBO0lBQ0E7R0FDQSxHQUFBOzs7Ozs7Ozs7Ozs7O0dBYUEsSUFBQSxHQUFBLFFBQUEsS0FBQTtJQUNBLEdBQUEsT0FBQSxPQUFBLFVBQUE7S0FDQSxPQUFBLEdBQUEsbUNBQUE7TUFDQSxPQUFBLEVBQUE7TUFDQSxNQUFBLEdBQUEsUUFBQTtNQUNBLFdBQUEsT0FBQSxPQUFBOzs7UUFHQTtLQUNBLE9BQUEsR0FBQSwyQkFBQTtNQUNBLE9BQUEsRUFBQTtNQUNBLE1BQUEsR0FBQSxRQUFBOzs7VUFHQTtJQUNBLE9BQUEsR0FBQSxrQkFBQTtLQUNBLE9BQUEsRUFBQTs7Ozs7RUFLQSxPQUFBLE9BQUEsV0FBQSxVQUFBLEdBQUEsR0FBQTtHQUNBLElBQUEsTUFBQSxHQUFBO0lBQ0E7Ozs7Ozs7O0dBUUEsSUFBQSxZQUFBLEVBQUEsT0FBQSxFQUFBLFlBQUEsR0FBQSxHQUFBLElBQUEsRUFBQSxZQUFBLEdBQUEsR0FBQTtJQUNBLFlBQUEsRUFBQSxPQUFBLEVBQUEsWUFBQSxHQUFBLEdBQUEsSUFBQSxFQUFBLFlBQUEsR0FBQSxHQUFBO0lBQ0EsU0FBQSxFQUFBLGFBQUEsV0FBQTs7R0FFQSxJQUFBLE1BQUE7SUFDQSxDQUFBLEdBQUE7SUFDQSxDQUFBLElBQUE7O0dBRUEsSUFBQSxHQUFBLFFBQUEsUUFBQTtJQUNBLE1BQUE7S0FDQSxDQUFBLEdBQUE7S0FDQSxDQUFBLEdBQUE7OztHQUdBLEdBQUEsSUFBQSxVQUFBLFFBQUE7SUFDQSxRQUFBLElBQUE7SUFDQSxTQUFBOzs7O0VBSUEsT0FBQSxJQUFBLHVCQUFBLFVBQUEsT0FBQSxTQUFBLFVBQUEsV0FBQSxZQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0VBa0NBLFNBQUEsZ0JBQUE7R0FDQSxZQUFBLE9BQUEsT0FBQSxLQUFBLFVBQUEsS0FBQTtJQUNBLEdBQUEsTUFBQTtJQUNBLEdBQUEsWUFBQSxtQkFBQTtJQUNBLFNBQUEsWUFBQTtLQUNBLEdBQUEsT0FBQSxPQUFBLFVBQUE7TUFDQSxHQUFBLFVBQUEsUUFBQSxjQUFBO01BQ0EsR0FBQSxVQUFBLFNBQUE7TUFDQSxHQUFBLFVBQUEsT0FBQSxHQUFBLHFCQUFBLFNBQUEsR0FBQSxRQUFBLEtBQUEsV0FBQTtNQUNBLElBQUEsWUFBQSxPQUFBLE9BQUEsVUFBQSxNQUFBO01BQ0EsUUFBQSxRQUFBLFdBQUEsU0FBQSxJQUFBO09BQ0EsR0FBQSxVQUFBLE9BQUEsR0FBQSxxQkFBQSxTQUFBLEtBQUEsV0FBQTs7OztTQUlBO01BQ0EsR0FBQSxVQUFBLFNBQUE7TUFDQSxHQUFBLE9BQUEsT0FBQSxLQUFBO1FBQ0EsR0FBQSxVQUFBLE9BQUEsR0FBQSxxQkFBQSxTQUFBLE9BQUEsT0FBQSxNQUFBLFdBQUE7Ozs7O0lBS0EsR0FBQSxVQUFBLFFBQUEsVUFBQSxVQUFBLEtBQUEsR0FBQTtLQUNBLElBQUEsQ0FBQSxHQUFBLFFBQUEsUUFBQTtNQUNBLElBQUEsSUFBQSxlQUFBLElBQUEsUUFBQSxXQUFBLEdBQUE7TUFDQSxJQUFBLE9BQUEsRUFBQSxHQUFBLFVBQUEsU0FBQSxhQUFBO09BQ0EsR0FBQSxVQUFBLGVBQUEsSUFBQSxRQUFBLFdBQUEsR0FBQTthQUNBO09BQ0EsYUFBQSxNQUFBOztZQUVBO01BQ0EsUUFBQSxJQUFBO01BQ0EsSUFBQSxJQUFBLGVBQUEsSUFBQSxRQUFBLFdBQUEsR0FBQTtNQUNBLElBQUEsT0FBQSxFQUFBLEdBQUEsVUFBQSxTQUFBLGFBQUE7T0FDQSxHQUFBLG1CQUFBO2FBQ0E7T0FDQSxhQUFBLE1BQUE7Ozs7O0dBS0E7Ozs7QUN2akJBLENBQUEsWUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLHNDQUFBLFVBQUEsT0FBQSxRQUFBOztJQUVBLE9BQUEsU0FBQTs7OztBQ0xBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLHFFQUFBLFNBQUEsUUFBQSxZQUFBLGFBQUEsT0FBQTs7O1FBR0EsSUFBQSxLQUFBOztRQUVBLEdBQUEsYUFBQTtRQUNBLEdBQUEsT0FBQSxhQUFBO1FBQ0EsR0FBQSxPQUFBLGFBQUE7UUFDQSxHQUFBLFNBQUEsYUFBQTtRQUNBLEdBQUEsWUFBQSxhQUFBO1FBQ0EsR0FBQSxhQUFBO1FBQ0EsR0FBQSxXQUFBOztRQUVBLFNBQUEsWUFBQTtVQUNBLElBQUEsYUFBQSxDQUFBLEtBQUE7VUFDQSxJQUFBLE9BQUEsSUFBQSxTQUFBO1VBQ0EsUUFBQSxRQUFBLEdBQUEsTUFBQSxTQUFBLE1BQUEsSUFBQTtZQUNBLEdBQUEsS0FBQSxPQUFBLFVBQUEsRUFBQTtjQUNBLEtBQUEsS0FBQSxHQUFBLE9BQUEsR0FBQSxLQUFBO2NBQ0EsV0FBQSxLQUFBLEtBQUEsS0FBQSxLQUFBOztnQkFFQTtjQUNBLE9BQUEsTUFBQSwrQkFBQTtjQUNBOzs7O1VBSUEsWUFBQSxLQUFBLGVBQUEsR0FBQSxVQUFBLFdBQUEsV0FBQSxZQUFBLEtBQUEsU0FBQSxJQUFBO1lBQ0EsR0FBQSxPQUFBLEtBQUE7Y0FDQSxPQUFBLFFBQUEsV0FBQSxLQUFBLE9BQUEsc0JBQUEsR0FBQSxLQUFBLEtBQUE7Y0FDQSxHQUFBLE9BQUE7Y0FDQSxHQUFBLE9BQUE7Ozs7UUFJQSxTQUFBLFVBQUE7VUFDQSxJQUFBLGFBQUEsQ0FBQSxLQUFBO1VBQ0EsSUFBQSxPQUFBLElBQUEsU0FBQTtVQUNBLFFBQUEsUUFBQSxHQUFBLE1BQUEsU0FBQSxNQUFBLElBQUE7WUFDQSxHQUFBLEtBQUEsT0FBQSxVQUFBLEVBQUE7Y0FDQSxLQUFBLEtBQUEsR0FBQSxPQUFBLEdBQUEsS0FBQTtjQUNBLEdBQUEsS0FBQSxXQUFBLEtBQUEsS0FBQSxHQUFBLEdBQUEsS0FBQSxXQUFBLFVBQUEsSUFBQSxlQUFBO2NBQ0EsV0FBQSxLQUFBLEtBQUEsS0FBQSxLQUFBOztnQkFFQTtjQUNBLE9BQUEsTUFBQSwrQkFBQTtjQUNBOzs7VUFHQSxRQUFBLFFBQUEsR0FBQSxLQUFBLEdBQUEsS0FBQSxJQUFBLFNBQUEsTUFBQSxJQUFBO1lBQ0EsR0FBQSxHQUFBLFdBQUEsS0FBQTtjQUNBLElBQUEsUUFBQTtnQkFDQSxVQUFBO2dCQUNBLFFBQUEsR0FBQSxXQUFBLEtBQUE7Z0JBQ0EsY0FBQSxHQUFBLFdBQUEsS0FBQTtnQkFDQSxrQkFBQSxHQUFBLFdBQUEsS0FBQSxtQkFBQTtnQkFDQSxhQUFBLEdBQUEsV0FBQSxLQUFBLGFBQUE7Z0JBQ0EsbUJBQUEsR0FBQSxXQUFBLEtBQUEsYUFBQSxNQUFBOztjQUVBLElBQUEsYUFBQTtjQUNBLFFBQUEsUUFBQSxHQUFBLFdBQUEsS0FBQSxZQUFBLFNBQUEsSUFBQTtnQkFDQSxXQUFBLEtBQUEsSUFBQTs7Y0FFQSxNQUFBLGFBQUE7Y0FDQSxPQUFBLEtBQUE7OztVQUdBLFFBQUEsUUFBQSxHQUFBLEtBQUEsT0FBQSxTQUFBLE1BQUEsSUFBQTtZQUNBLEtBQUEsS0FBQTtjQUNBLE1BQUE7Y0FDQSxNQUFBOzs7VUFHQSxHQUFBLEtBQUEsU0FBQTtVQUNBLEdBQUEsS0FBQSxPQUFBO1VBQ0EsWUFBQSxLQUFBLGVBQUEsR0FBQSxNQUFBLEtBQUEsU0FBQSxTQUFBO2NBQ0EsWUFBQSxLQUFBLGVBQUEsU0FBQSxXQUFBLFdBQUEsWUFBQSxLQUFBLFNBQUEsSUFBQTtnQkFDQSxHQUFBLE9BQUEsS0FBQTtrQkFDQSxPQUFBLFFBQUEsV0FBQSxLQUFBLE9BQUEsc0JBQUEsR0FBQSxLQUFBLEtBQUE7a0JBQ0EsR0FBQSxPQUFBO2tCQUNBLEdBQUEsT0FBQTs7O2FBR0EsU0FBQSxTQUFBO1lBQ0EsR0FBQSxTQUFBLFFBQUE7Y0FDQSxPQUFBLE1BQUEsU0FBQSxTQUFBOzs7OztRQUtBLE9BQUEsT0FBQSxVQUFBLEVBQUEsT0FBQSxhQUFBLG9CQUFBLFNBQUEsRUFBQSxFQUFBO1VBQ0EsR0FBQSxNQUFBLEVBQUE7VUFDQSxHQUFBLFlBQUE7O1FBRUEsT0FBQSxPQUFBLGdCQUFBLFNBQUEsRUFBQSxFQUFBO1VBQ0EsR0FBQSxNQUFBLEdBQUE7VUFDQSxhQUFBLHVCQUFBO1VBQ0E7Ozs7O0FDcEdBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLCtEQUFBLFNBQUEsT0FBQSxZQUFBLGFBQUE7TUFDQSxJQUFBLEtBQUE7TUFDQSxHQUFBLE9BQUEsYUFBQTtNQUNBLEdBQUEsT0FBQSxhQUFBO01BQ0EsR0FBQSxtQkFBQTtNQUNBLEdBQUEsYUFBQTs7TUFFQSxTQUFBLGlCQUFBLElBQUE7UUFDQSxHQUFBLE9BQUEsYUFBQSxhQUFBLFFBQUEsWUFBQTtVQUNBLGFBQUEsYUFBQSxJQUFBO1lBQ0EsWUFBQTtZQUNBLE1BQUE7OztRQUdBLEdBQUEsY0FBQTtRQUNBLEdBQUEsWUFBQSxhQUFBLGFBQUE7O01BRUEsT0FBQSxPQUFBLFVBQUEsRUFBQSxPQUFBLGFBQUEsb0JBQUEsU0FBQSxFQUFBLEVBQUE7UUFDQSxHQUFBLE1BQUEsRUFBQTtRQUNBLEdBQUEsV0FBQSxFQUFBLGVBQUE7UUFDQTs7OztBQ3ZCQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSwrS0FBQSxTQUFBLFFBQUEsY0FBQSxhQUFBLFNBQUEsUUFBQSxTQUFBLGFBQUEsUUFBQSxhQUFBLGNBQUEsbUJBQUE7O1FBRUEsUUFBQSxJQUFBO1FBQ0EsR0FBQSxPQUFBLFFBQUEsUUFBQSxtQkFBQTtVQUNBLEdBQUEsYUFBQSxVQUFBLE9BQUE7WUFDQSxHQUFBLFFBQUEseUJBQUE7Y0FDQSxPQUFBLEdBQUE7O2dCQUVBO2NBQ0EsYUFBQTs7Ozs7UUFLQSxJQUFBLEtBQUE7UUFDQSxHQUFBLE1BQUE7UUFDQSxHQUFBLE9BQUE7UUFDQSxHQUFBLFdBQUE7UUFDQSxHQUFBLFdBQUE7UUFDQSxHQUFBLGVBQUE7UUFDQSxHQUFBLG1CQUFBO1FBQ0EsR0FBQSxrQkFBQTs7UUFFQSxHQUFBLFNBQUE7UUFDQSxHQUFBLFNBQUE7UUFDQSxHQUFBLFlBQUE7UUFDQSxHQUFBLG1CQUFBO1FBQ0EsR0FBQSxhQUFBO1FBQ0EsR0FBQSxjQUFBO1FBQ0EsR0FBQSxlQUFBO1FBQ0EsR0FBQSxnQkFBQTtRQUNBLEdBQUEsT0FBQTtRQUNBLEdBQUEsWUFBQTs7O1FBR0EsR0FBQSxnQkFBQTtRQUNBLEdBQUEsc0JBQUE7UUFDQSxHQUFBLG1CQUFBO1FBQ0EsR0FBQSxpQkFBQTtRQUNBLEdBQUEscUJBQUE7UUFDQSxHQUFBLHFCQUFBO1FBQ0EsR0FBQSx1QkFBQTtRQUNBLEdBQUEseUJBQUE7UUFDQSxHQUFBLFdBQUE7UUFDQSxHQUFBLGlCQUFBO1FBQ0EsR0FBQSxZQUFBO1FBQ0EsR0FBQSxjQUFBO1FBQ0EsR0FBQSxZQUFBOztRQUVBLEdBQUEsUUFBQSxhQUFBOzs7UUFHQSxHQUFBLE9BQUE7VUFDQSxXQUFBO1VBQ0EsY0FBQTtVQUNBLE1BQUE7O1FBRUEsR0FBQSxRQUFBO1VBQ0EsUUFBQTtVQUNBLE9BQUE7VUFDQSxPQUFBO1VBQ0EsTUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7OztRQW1CQTs7UUFFQSxTQUFBLFVBQUE7OztRQUdBLFNBQUEsVUFBQSxPQUFBO1VBQ0EsT0FBQSxTQUFBLFdBQUE7O1FBRUEsU0FBQSxnQkFBQSxRQUFBO1NBQ0EsSUFBQSxRQUFBO2NBQ0EsTUFBQTtjQUNBLFNBQUE7VUFDQSxPQUFBO1VBQ0EsTUFBQTs7O1NBR0EsT0FBQTs7UUFFQSxTQUFBLFVBQUE7V0FDQSxZQUFBLE9BQUEsT0FBQSxLQUFBLFVBQUEsS0FBQTtjQUNBLEdBQUEsWUFBQSxtQkFBQTtjQUNBLFNBQUEsVUFBQTtnQkFDQSxHQUFBLFVBQUEsU0FBQTs7Ozs7O1FBTUEsU0FBQSxxQkFBQTtVQUNBLEdBQUEsZ0JBQUEsQ0FBQSxHQUFBO1VBQ0EsR0FBQSxHQUFBLGNBQUE7WUFDQSxHQUFBOzs7UUFHQSxTQUFBLGVBQUE7VUFDQSxHQUFBLENBQUEsR0FBQSxVQUFBO1lBQ0EsWUFBQSxPQUFBLGVBQUEsS0FBQSxTQUFBLFNBQUE7Y0FDQSxHQUFBLFlBQUE7Y0FDQSxHQUFBLG9CQUFBLElBQUEsR0FBQSxrQkFBQTs7Ozs7UUFLQSxTQUFBLGlCQUFBLFNBQUE7VUFDQSxPQUFBLEdBQUEsa0JBQUEsUUFBQSxZQUFBLENBQUEsSUFBQSxPQUFBOztRQUVBLFNBQUEsZ0JBQUEsVUFBQSxLQUFBO1VBQ0EsUUFBQSxRQUFBLE1BQUEsU0FBQSxNQUFBLElBQUE7O2dCQUVBLEdBQUEsUUFBQSxTQUFBO2tCQUNBLEtBQUEsT0FBQSxLQUFBO2tCQUNBLEdBQUEsaUJBQUEsT0FBQSxHQUFBLGlCQUFBLFFBQUEsT0FBQTtrQkFDQSxHQUFBLGtCQUFBLE9BQUEsR0FBQSxrQkFBQSxRQUFBLE1BQUE7OztjQUdBLGdCQUFBLFVBQUEsS0FBQTs7O1FBR0EsU0FBQSxlQUFBLFNBQUE7VUFDQSxJQUFBLE1BQUEsR0FBQSxrQkFBQSxRQUFBO1VBQ0EsSUFBQSxNQUFBLENBQUEsRUFBQTtZQUNBLEdBQUEsa0JBQUEsT0FBQSxLQUFBO1lBQ0EsZ0JBQUEsVUFBQSxHQUFBOztjQUVBO1lBQ0EsR0FBQSxrQkFBQSxLQUFBO1lBQ0EsR0FBQSxHQUFBLGlCQUFBLFVBQUEsS0FBQSxPQUFBLEdBQUEsaUJBQUEsR0FBQSxXQUFBLFlBQUE7Y0FDQSxHQUFBLGlCQUFBLEdBQUEsTUFBQSxLQUFBOztnQkFFQTtnQkFDQSxHQUFBLE9BQUEsS0FBQTs7Ozs7O1FBTUEsU0FBQSxlQUFBLE1BQUE7VUFDQSxRQUFBLFFBQUEsT0FBQSxTQUFBLE1BQUEsSUFBQTtZQUNBLE1BQUEsS0FBQSxTQUFBLFNBQUEsTUFBQSxNQUFBO1lBQ0EsZUFBQSxNQUFBOzs7UUFHQSxTQUFBLG1CQUFBLEtBQUE7VUFDQSxRQUFBLElBQUE7O1FBRUEsU0FBQSxtQkFBQSxLQUFBO1VBQ0EsUUFBQSxJQUFBOztRQUVB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QSxXQUFBLDBFQUFBLFNBQUEsUUFBQSxZQUFBLG9CQUFBLFFBQUE7O1FBRUEsSUFBQSxLQUFBO1FBQ0EsR0FBQSxZQUFBLE9BQUEsUUFBQSxHQUFBO1FBQ0EsR0FBQSxVQUFBLE9BQUEsUUFBQSxHQUFBO1FBQ0EsR0FBQSxPQUFBLE9BQUEsUUFBQSxHQUFBO1FBQ0EsR0FBQSxVQUFBO1FBQ0EsR0FBQSxZQUFBLG1CQUFBO1FBQ0EsR0FBQSxVQUFBO1FBQ0EsR0FBQSxZQUFBO1FBQ0EsR0FBQSxjQUFBOztRQUVBLFNBQUEsV0FBQTtVQUNBLElBQUEsT0FBQTtVQUNBLFFBQUEsUUFBQSxHQUFBLE1BQUEsU0FBQSxNQUFBO1lBQ0EsS0FBQSxHQUFBLFVBQUEsb0JBQUEsV0FBQSxLQUFBLEdBQUEsVUFBQTtZQUNBLEtBQUEsV0FBQSxTQUFBLEtBQUE7O1VBRUEsSUFBQSxTQUFBLFFBQUEsV0FBQSxHQUFBLE1BQUEsQ0FBQSxHQUFBLFVBQUEsa0JBQUEsVUFBQTtVQUNBLEtBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxPQUFBLFFBQUEsS0FBQTtZQUNBLElBQUEsT0FBQSxHQUFBLE9BQUEsR0FBQSxRQUFBLEtBQUE7Y0FDQSxPQUFBLElBQUE7OztVQUdBLEdBQUEsUUFBQSxHQUFBLFVBQUEsaUJBQUEsV0FBQTtVQUNBLEdBQUEsZ0JBQUE7Y0FDQSxNQUFBLEdBQUEsVUFBQTtjQUNBLE1BQUEsR0FBQSxVQUFBLGlCQUFBOzs7UUFHQSxTQUFBLFFBQUEsUUFBQTtVQUNBLElBQUEsU0FBQSxRQUFBLFdBQUEsR0FBQSxNQUFBLENBQUEsR0FBQSxVQUFBLGtCQUFBLFVBQUE7VUFDQSxJQUFBLE9BQUE7VUFDQSxRQUFBLFFBQUEsUUFBQSxTQUFBLE1BQUEsSUFBQTtZQUNBLEdBQUEsS0FBQSxXQUFBLFFBQUEsUUFBQTtjQUNBLE9BQUE7OztVQUdBLE9BQUEsS0FBQTs7UUFFQSxTQUFBLFlBQUE7T0FDQSxJQUFBLENBQUEsR0FBQSxTQUFBO1FBQ0EsT0FBQTs7T0FFQSxPQUFBLENBQUEsR0FBQSxRQUFBLEdBQUEsV0FBQSxLQUFBO09BQ0E7O01BRUEsU0FBQSxjQUFBO09BQ0EsSUFBQSxDQUFBLEdBQUEsU0FBQTtRQUNBLE9BQUE7O09BRUEsT0FBQSxHQUFBLFFBQUEsaUJBQUEsSUFBQSxrQkFBQTtPQUNBOztRQUVBLE9BQUEsT0FBQSxjQUFBLFVBQUEsR0FBQSxHQUFBO1VBQ0EsSUFBQSxNQUFBLEdBQUE7WUFDQTs7O1lBR0EsR0FBQSxFQUFBLElBQUE7Y0FDQSxHQUFBLFVBQUEsT0FBQSxtQkFBQSxTQUFBLEVBQUEsS0FBQSxXQUFBOztZQUVBO1lBQ0EsZ0JBQUEsRUFBQTs7Ozs7Ozs7O0FDbEVBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLG9DQUFBLFNBQUEsUUFBQSxPQUFBOzs7Ozs7QUNIQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSxjQUFBLFVBQUE7Ozs7OztBQ0hBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLHlDQUFBLFNBQUEsUUFBQSxhQUFBOztFQUVBLE9BQUEsZUFBQSxVQUFBO0dBQ0EsYUFBQSxLQUFBOzs7RUFHQSxPQUFBLGFBQUEsVUFBQTtHQUNBLGFBQUEsTUFBQTs7Ozs7OztBQ1ZBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLDBCQUFBLFVBQUE7Ozs7OztBQ0hBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLFlBQUEsVUFBQTs7Ozs7O0FDSEEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsNENBQUEsU0FBQSxRQUFBLGNBQUE7O1FBRUEsT0FBQSxPQUFBLFVBQUE7O1lBRUEsY0FBQTs7O1FBR0EsT0FBQSxPQUFBLFVBQUE7U0FDQSxjQUFBOzs7Ozs7O0FDWEEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsZ0RBQUEsU0FBQSxRQUFBLGNBQUE7UUFDQSxPQUFBLFFBQUEsR0FBQSxtQkFBQTtRQUNBLE9BQUEsUUFBQSxHQUFBLGNBQUE7UUFDQSxPQUFBLFFBQUEsR0FBQSxlQUFBO1FBQ0EsT0FBQSxRQUFBLEdBQUEsYUFBQTtRQUNBLE9BQUEsUUFBQSxHQUFBLFdBQUE7UUFDQSxPQUFBLE9BQUEsVUFBQTtVQUNBLE9BQUEsUUFBQSxHQUFBLEtBQUEsZUFBQSxPQUFBLFFBQUEsR0FBQSxjQUFBLE9BQUEsUUFBQSxHQUFBLGNBQUE7VUFDQSxPQUFBLFFBQUEsR0FBQSxLQUFBLGtCQUFBLE9BQUEsUUFBQSxHQUFBLGFBQUEsT0FBQSxRQUFBLEdBQUEsYUFBQTtVQUNBLE9BQUEsUUFBQSxHQUFBLEtBQUEsYUFBQSxPQUFBLFFBQUEsR0FBQSxlQUFBLE9BQUEsUUFBQSxHQUFBLGVBQUE7VUFDQSxPQUFBLFFBQUEsR0FBQSxLQUFBLFlBQUEsT0FBQSxRQUFBLEdBQUEsV0FBQSxPQUFBLFFBQUEsR0FBQSxXQUFBO1lBQ0EsY0FBQTs7O1FBR0EsT0FBQSxPQUFBLFVBQUE7VUFDQSxPQUFBLFFBQUEsR0FBQSxjQUFBO1VBQ0EsT0FBQSxRQUFBLEdBQUEsZUFBQTtVQUNBLE9BQUEsUUFBQSxHQUFBLGFBQUE7U0FDQSxjQUFBOzs7Ozs7O0FDckJBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLDhDQUFBLFNBQUEsUUFBQSxjQUFBO1FBQ0EsT0FBQSxPQUFBLE9BQUEsUUFBQSxHQUFBO1FBQ0EsR0FBQSxPQUFBLE9BQUEsUUFBQSxHQUFBLEtBQUEsTUFBQSxPQUFBLFNBQUEsWUFBQTtVQUNBLE9BQUEsUUFBQSxHQUFBLEtBQUEsTUFBQSxPQUFBLFFBQUE7O1lBRUE7VUFDQSxHQUFBLE9BQUEsUUFBQSxHQUFBLEtBQUEsTUFBQSxPQUFBLE1BQUEsTUFBQTtZQUNBLE9BQUEsUUFBQSxPQUFBLFFBQUEsR0FBQSxLQUFBLE1BQUEsT0FBQSxNQUFBOztVQUVBLEdBQUEsT0FBQSxRQUFBLEdBQUEsS0FBQSxNQUFBLE9BQUEsTUFBQSxZQUFBO1lBQ0EsT0FBQSxjQUFBLE9BQUEsUUFBQSxHQUFBLEtBQUEsTUFBQSxPQUFBLE1BQUE7Ozs7UUFJQSxPQUFBLE9BQUEsVUFBQTtVQUNBLE9BQUEsUUFBQSxHQUFBLEtBQUEsTUFBQSxPQUFBLE1BQUEsUUFBQSxPQUFBO1VBQ0EsT0FBQSxRQUFBLEdBQUEsS0FBQSxNQUFBLE9BQUEsTUFBQSxjQUFBLE9BQUE7VUFDQSxjQUFBOzs7UUFHQSxPQUFBLE9BQUEsVUFBQTtTQUNBLGNBQUE7Ozs7Ozs7QUN4QkEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsMkNBQUEsU0FBQSxRQUFBLGNBQUE7UUFDQSxPQUFBLE9BQUEsT0FBQSxRQUFBLEdBQUEsU0FBQTtRQUNBLE9BQUEsT0FBQSxVQUFBOztZQUVBLGNBQUE7OztRQUdBLE9BQUEsT0FBQSxVQUFBO1NBQ0EsY0FBQTs7Ozs7OztBQ1hBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLHdEQUFBLFNBQUEsT0FBQSxRQUFBLGNBQUE7O1FBRUEsT0FBQSxPQUFBLFVBQUE7WUFDQSxPQUFBLEdBQUEsV0FBQTtZQUNBLE9BQUEsR0FBQSxLQUFBLFlBQUEsT0FBQSxHQUFBLFVBQUE7WUFDQSxPQUFBLEdBQUEsS0FBQSxnQkFBQSxPQUFBLEdBQUEsVUFBQTtZQUNBLE9BQUEsR0FBQTtXQUNBLGNBQUE7OztRQUdBLE9BQUEsT0FBQSxVQUFBO1VBQ0EsT0FBQSxHQUFBO1NBQ0EsY0FBQTs7Ozs7OztBQ2ZBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLHVEQUFBLFNBQUEsUUFBQSxRQUFBLGNBQUE7O1FBRUEsT0FBQSxPQUFBLFVBQUE7O1lBRUEsT0FBQSxHQUFBO1lBQ0EsT0FBQSxHQUFBLE9BQUEsUUFBQTtZQUNBLGNBQUE7OztRQUdBLE9BQUEsT0FBQSxVQUFBO1NBQ0EsY0FBQTs7Ozs7OztBQ2JBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLHFEQUFBLFNBQUEsUUFBQSxjQUFBO1FBQ0EsT0FBQSxNQUFBLE9BQUEsUUFBQSxHQUFBLEtBQUE7UUFDQSxPQUFBLE9BQUEsT0FBQSxRQUFBLEdBQUE7O1FBRUEsT0FBQSxPQUFBLFVBQUE7VUFDQSxjQUFBOzs7UUFHQSxPQUFBLE9BQUEsVUFBQTtTQUNBLGNBQUE7OztRQUdBLE9BQUEsT0FBQSxRQUFBLFNBQUEsR0FBQSxFQUFBO1lBQ0EsUUFBQSxJQUFBO1VBQ0EsR0FBQSxNQUFBLEVBQUE7WUFDQTs7VUFFQSxRQUFBLFFBQUEsR0FBQSxTQUFBLE1BQUEsSUFBQTtZQUNBLEdBQUEsS0FBQSxNQUFBLEtBQUEsR0FBQSxPQUFBLFFBQUEsQ0FBQSxFQUFBLEtBQUEsTUFBQSxLQUFBLEdBQUEsT0FBQSxLQUFBO2NBQ0EsS0FBQSxNQUFBLE9BQUEsT0FBQSxFQUFBO2NBQ0EsT0FBQSxRQUFBLEdBQUE7Y0FDQSxPQUFBLFFBQUEsR0FBQTs7O1dBR0E7Ozs7OztBQzNCQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLFFBQUEsb0JBQUEsWUFBQSxlQUFBLFVBQUE7Ozs7Ozs7QUNIQSxDQUFBLFlBQUE7Q0FDQTs7Q0FFQSxTQUFBLGNBQUEsV0FBQSxPQUFBO0VBQ0EsSUFBQSxZQUFBO0VBQ0EsSUFBQSxPQUFBLFNBQUEsZUFBQTtFQUNBLEdBQUEsUUFBQSxLQUFBO0dBQ0EsUUFBQSxRQUFBLFVBQUEsS0FBQSxRQUFBLE9BQUEsK0NBQUEsWUFBQTs7RUFFQTtFQUNBLFNBQUEsWUFBQSxTQUFBLE1BQUEsT0FBQSxTQUFBO0dBQ0EsUUFBQSxRQUFBLFNBQUEsY0FBQSxNQUFBLFlBQUEsS0FBQTtHQUNBLFFBQUEsUUFBQSxTQUFBLGNBQUEsTUFBQSxZQUFBLElBQUEsV0FBQTs7R0FFQSxPQUFBLGVBQUEsT0FBQSxNQUFBOztFQUVBLFNBQUEsY0FBQTtHQUNBLFFBQUEsUUFBQSxTQUFBLGNBQUEsTUFBQSxZQUFBLElBQUEsV0FBQTs7RUFFQSxTQUFBLGVBQUEsT0FBQSxHQUFBLFNBQUE7R0FDQSxJQUFBLE9BQUEsTUFBQTtHQUNBLElBQUEsVUFBQTtHQUNBLElBQUEsVUFBQTtHQUNBLElBQUEsTUFBQSxRQUFBLEtBQUEsT0FBQTtHQUNBLElBQUEsUUFBQSxPQUFBO0dBQ0EsSUFBQSxNQUFBLFFBQUEsUUFBQSxTQUFBLGNBQUEsT0FBQTtHQUNBLElBQUEsTUFBQSxTQUFBLGNBQUEsTUFBQTtHQUNBLElBQUEsUUFBQSxJQUFBLHdCQUFBLE1BQUEsRUFBQSxJQUFBLE1BQUE7R0FDQSxJQUFBLFNBQUEsSUFBQSx3QkFBQSxPQUFBLEVBQUEsSUFBQSxFQUFBLFNBQUE7R0FDQSxPQUFBLFFBQUEsUUFBQSxTQUFBLGNBQUEsT0FBQSxJQUFBLE9BQUEsUUFBQSxNQUFBLElBQUEsUUFBQSxTQUFBOztFQUVBLE9BQUE7R0FDQSxhQUFBO0dBQ0EsYUFBQTtHQUNBLGdCQUFBOzs7Q0FHQSxRQUFBLE9BQUEsa0JBQUEsVUFBQSx3Q0FBQSxVQUFBLFVBQUEsY0FBQTtFQUNBLElBQUE7RUFDQSxXQUFBLFlBQUE7R0FDQSxPQUFBO0lBQ0EsT0FBQTtJQUNBLFFBQUE7SUFDQSxnQkFBQTtJQUNBLFdBQUE7SUFDQSxLQUFBO0lBQ0EsT0FBQTtJQUNBLFFBQUE7SUFDQSxTQUFBO0lBQ0EsU0FBQTtJQUNBLFFBQUE7SUFDQSxZQUFBLEdBQUEsTUFBQSxVQUFBLE9BQUEsQ0FBQSxNQUFBLE9BQUEsTUFBQSxDQUFBLFdBQUE7SUFDQSxZQUFBO0lBQ0EsY0FBQTtJQUNBLFVBQUE7SUFDQSxTQUFBLGNBQUEsbUJBQUE7OztFQUdBLE9BQUE7R0FDQSxVQUFBO0dBQ0EsT0FBQTtJQUNBLFdBQUE7SUFDQSxXQUFBO0lBQ0EsU0FBQTtJQUNBLFlBQUE7SUFDQSxTQUFBO0lBQ0EsU0FBQTs7R0FFQSxTQUFBO0dBQ0EsTUFBQSxVQUFBLE9BQUEsTUFBQSxPQUFBLFNBQUE7SUFDQSxJQUFBLFVBQUEsUUFBQSxPQUFBLFlBQUE7SUFDQSxJQUFBLFFBQUE7S0FDQSxRQUFBO0tBQ0EsU0FBQTtLQUNBLFNBQUE7O0lBRUEsSUFBQSxhQUFBLEdBQUEsSUFBQSxNQUFBLFdBQUEsVUFBQSxHQUFBO0tBQ0EsT0FBQSxXQUFBLEVBQUE7OztJQUdBLFFBQUEsZUFBQSxHQUFBLE1BQUEsTUFBQSxTQUFBLEtBQUEsT0FBQSxDQUFBLEdBQUEsYUFBQSxNQUFBLENBQUEsR0FBQTtJQUNBLFFBQUEsU0FBQTtLQUNBLEdBQUEsUUFBQSxRQUFBO0tBQ0EsR0FBQSxRQUFBLFNBQUE7O0lBRUEsUUFBQSxjQUFBOztJQUVBLElBQUEsZUFBQSxZQUFBO0tBQ0EsR0FBQSxNQUFBLFFBQUEsU0FBQSxVQUFBLEtBQUEsTUFBQSxRQUFBLFNBQUEsR0FBQSxTQUFBLFNBQUEsRUFBQTtNQUNBLFFBQUEsUUFBQSxNQUFBLFFBQUEsVUFBQSxVQUFBLE9BQUEsT0FBQTtPQUNBLElBQUEsSUFBQTtRQUNBLE1BQUEsTUFBQTtRQUNBLE1BQUEsTUFBQTtRQUNBLE9BQUEsTUFBQTtRQUNBLE9BQUEsTUFBQTtRQUNBLE1BQUEsTUFBQTtRQUNBLFNBQUEsYUFBQSxXQUFBLE1BQUE7UUFDQSxNQUFBO1FBQ0EsU0FBQSxNQUFBOztPQUVBLE9BQUEsS0FBQTtPQUNBLFFBQUEsUUFBQSxNQUFBLFVBQUEsVUFBQSxNQUFBO1FBQ0EsSUFBQSxNQUFBLFVBQUEsS0FBQSxPQUFBO1NBQ0EsSUFBQSxPQUFBO1VBQ0EsTUFBQSxLQUFBO1VBQ0EsUUFBQSxNQUFBLFVBQUEsS0FBQSxRQUFBLE1BQUE7VUFDQSxPQUFBLE1BQUEsVUFBQSxLQUFBO1VBQ0EsTUFBQSxLQUFBO1VBQ0EsT0FBQSxNQUFBO1VBQ0EsR0FBQSxRQUFBLE9BQUE7VUFDQSxHQUFBLFFBQUEsT0FBQTtVQUNBLE9BQUEsS0FBQTtVQUNBLE1BQUEsS0FBQTtVQUNBLFNBQUEsYUFBQSxXQUFBLEtBQUE7VUFDQSxNQUFBO1VBQ0EsU0FBQTs7U0FFQSxNQUFBLEtBQUE7Ozs7TUFJQTs7O1NBR0E7TUFDQSxJQUFBLElBQUE7T0FDQSxNQUFBLE1BQUEsUUFBQTtPQUNBLE1BQUEsTUFBQSxRQUFBO09BQ0EsT0FBQSxNQUFBLFFBQUE7T0FDQSxPQUFBLE1BQUEsUUFBQTtPQUNBLE1BQUEsTUFBQSxRQUFBO09BQ0EsU0FBQSxNQUFBLFFBQUE7T0FDQSxNQUFBLE1BQUEsUUFBQTtPQUNBLFVBQUEsTUFBQSxRQUFBOztNQUVBLE9BQUEsS0FBQTtNQUNBLFFBQUEsUUFBQSxNQUFBLFFBQUEsVUFBQSxVQUFBLE1BQUE7T0FDQSxJQUFBLE1BQUEsVUFBQSxLQUFBLE9BQUE7UUFDQSxJQUFBLE9BQUE7U0FDQSxNQUFBLEtBQUE7U0FDQSxRQUFBLE1BQUEsVUFBQSxLQUFBLFFBQUEsTUFBQTtTQUNBLE9BQUEsTUFBQSxVQUFBLEtBQUEsUUFBQSxNQUFBO1NBQ0EsTUFBQSxLQUFBO1NBQ0EsT0FBQSxNQUFBLFFBQUE7U0FDQSxHQUFBLFFBQUEsT0FBQTtTQUNBLEdBQUEsUUFBQSxPQUFBO1NBQ0EsT0FBQSxLQUFBO1NBQ0EsTUFBQSxLQUFBO1NBQ0EsU0FBQSxhQUFBLFdBQUEsS0FBQTtTQUNBLE1BQUE7U0FDQSxTQUFBOztRQUVBLE1BQUEsS0FBQTs7Ozs7SUFLQSxJQUFBLGNBQUEsVUFBQTtLQUNBLFFBQUE7S0FDQSxTQUFBOztJQUVBLElBQUEsZ0JBQUEsVUFBQTtLQUNBLFFBQUEsUUFBQSxPQUFBLFNBQUEsTUFBQSxJQUFBO09BQ0EsUUFBQSxZQUFBLEtBQUEsU0FBQTtRQUNBLEdBQUEsUUFBQSxRQUFBO1FBQ0EsR0FBQSxRQUFBLFNBQUEsS0FBQSxJQUFBO1FBQ0EsUUFBQTs7OztJQUlBLElBQUEsYUFBQSxZQUFBO0tBQ0EsUUFBQSxRQUFBLE1BQUEsS0FBQTtLQUNBLFFBQUEsTUFBQSxHQUFBLE9BQUEsS0FBQSxJQUFBLE9BQUEsT0FBQSxLQUFBLFNBQUEsUUFBQSxPQUFBLEtBQUEsVUFBQSxRQUFBLFFBQUEsS0FBQSxNQUFBOztLQUVBLElBQUEsQ0FBQSxRQUFBLFNBQUE7TUFDQSxJQUFBLEtBQUEsS0FBQTtNQUNBLEdBQUEsT0FBQSxVQUFBLEVBQUE7T0FDQSxJQUFBLFNBQUEsR0FBQSxJQUFBO1NBQ0EsWUFBQTtTQUNBLFlBQUE7U0FDQSxXQUFBLENBQUEsTUFBQSxLQUFBO1NBQ0EsU0FBQSxNQUFBLEtBQUE7T0FDQSxJQUFBLFlBQUEsR0FBQSxJQUFBO1NBQ0EsWUFBQTtTQUNBLFlBQUE7U0FDQSxXQUFBLE1BQUEsS0FBQTtTQUNBLFNBQUEsT0FBQSxLQUFBOztPQUVBLFFBQUEsU0FBQSxRQUFBLElBQUEsT0FBQTtTQUNBLEtBQUEsS0FBQTtTQUNBLEtBQUEsUUFBQSxTQUFBLEVBQUE7U0FDQSxPQUFBLE9BQUEsR0FBQSxTQUFBOztTQUVBLEtBQUEsTUFBQTtTQUNBLEtBQUEsYUFBQSxjQUFBLFFBQUEsTUFBQSxHQUFBLEtBQUEsUUFBQSxPQUFBLElBQUEsUUFBQSxPQUFBLElBQUE7T0FDQSxRQUFBLFlBQUEsUUFBQSxJQUFBLE9BQUE7U0FDQSxLQUFBLEtBQUE7U0FDQSxLQUFBLE1BQUE7U0FDQSxLQUFBLFFBQUEsU0FBQSxFQUFBO1NBQ0EsT0FBQSxPQUFBLEdBQUEsU0FBQTs7U0FFQSxLQUFBLGFBQUEsY0FBQSxRQUFBLE1BQUEsR0FBQSxLQUFBLFFBQUEsT0FBQSxHQUFBOztVQUVBO09BQ0EsSUFBQSxNQUFBLEdBQUEsSUFBQTtTQUNBLFlBQUEsUUFBQSxNQUFBLElBQUE7U0FDQSxZQUFBLFFBQUEsTUFBQTtTQUNBLFdBQUEsS0FBQSxLQUFBO1NBQ0EsU0FBQSxPQUFBLEtBQUE7OztPQUdBLFFBQUEsTUFBQSxRQUFBLElBQUEsT0FBQTtTQUNBLEtBQUEsS0FBQTtTQUNBLEtBQUEsUUFBQSxPQUFBLEdBQUE7U0FDQSxLQUFBLE1BQUE7U0FDQSxLQUFBLGFBQUEsY0FBQSxRQUFBLE1BQUEsR0FBQSxLQUFBLFFBQUEsT0FBQSxHQUFBOzs7O0lBSUEsR0FBQSxRQUFBLFVBQUEsUUFBQSxPQUFBLFVBQUEsRUFBQTtNQUNBLElBQUEsYUFBQSxRQUFBLElBQUEsVUFBQSxlQUFBLEtBQUEsUUFBQSxRQUFBLE9BQUE7UUFDQSxLQUFBLFNBQUE7UUFDQSxLQUFBLFFBQUEsU0FBQSxFQUFBO1FBQ0EsT0FBQSxFQUFBOzs7Ozs7OztRQVFBLEtBQUEsS0FBQTtRQUNBLE1BQUEsYUFBQTtRQUNBLE1BQUEsVUFBQTs7UUFFQSxLQUFBLFNBQUEsUUFBQTtRQUNBLEtBQUEsZUFBQTtRQUNBLEdBQUEsU0FBQSxTQUFBLEVBQUE7UUFDQSxRQUFBLGNBQUEsRUFBQTtRQUNBLFFBQUE7O1FBRUEsS0FBQSxLQUFBLFNBQUEsRUFBQTtRQUNBLElBQUEsUUFBQSxPQUFBLFFBQUE7UUFDQSxHQUFBLFNBQUEsRUFBQTtTQUNBLE9BQUE7O1lBRUE7U0FDQSxPQUFBLFFBQUEsU0FBQTs7O1FBR0EsS0FBQSxTQUFBLEVBQUE7UUFDQSxPQUFBLEVBQUE7Ozs7S0FJQSxRQUFBLGFBQUEsUUFBQSxJQUFBLFVBQUEsVUFBQSxLQUFBLE9BQUEsUUFBQSxPQUFBLEtBQUEsS0FBQSxhQUFBLGdCQUFBLFFBQUEsUUFBQSxLQUFBLE9BQUEsUUFBQSxTQUFBLEtBQUEsS0FBQSxLQUFBLFNBQUE7Ozs7OztLQU1BLFFBQUEsVUFBQSxRQUFBLFdBQUEsT0FBQSxVQUFBLEtBQUEsS0FBQSxHQUFBLEtBQUEsU0FBQSxVQUFBLEdBQUE7TUFDQSxPQUFBLEVBQUEsU0FBQSxRQUFBLFdBQUEsRUFBQTtTQUNBLEtBQUEsZ0JBQUEsR0FBQSxLQUFBLFVBQUEsVUFBQSxHQUFBO01BQ0EsT0FBQSxHQUFBLElBQUEsUUFBQSxXQUFBLEVBQUEsUUFBQTtRQUNBLEtBQUEsTUFBQSxVQUFBLEdBQUE7O01BRUEsT0FBQSxZQUFBLEVBQUE7O0tBRUEsUUFBQSxRQUFBLFFBQUEsV0FBQSxPQUFBO09BQ0EsS0FBQSxlQUFBO09BQ0EsS0FBQSxhQUFBLFVBQUEsR0FBQTs7O09BR0EsS0FBQSxlQUFBO09BQ0EsS0FBQSxRQUFBLFNBQUEsRUFBQTtPQUNBLE9BQUEsRUFBQSxVQUFBLFNBQUEsRUFBQTs7T0FFQSxNQUFBLFdBQUEsU0FBQSxFQUFBO09BQ0EsR0FBQSxFQUFBLFFBQUE7UUFDQSxPQUFBOztXQUVBO1FBQ0EsT0FBQTs7O09BR0EsS0FBQSxVQUFBLEdBQUE7T0FDQSxPQUFBLEVBQUEsV0FBQTs7S0FFQSxRQUFBLE1BQUEsR0FBQSxhQUFBLFVBQUEsR0FBQSxHQUFBO01BQ0EsT0FBQSxhQUFBLEdBQUEsR0FBQTtRQUNBLEdBQUEsWUFBQSxVQUFBLEdBQUEsR0FBQTtNQUNBLE9BQUEsYUFBQSxHQUFBLEdBQUE7UUFDQSxHQUFBLFNBQUEsVUFBQSxHQUFBLEdBQUE7O01BRUEsUUFBQSxjQUFBLEVBQUE7TUFDQSxRQUFBOztLQUVBLFFBQUEsUUFBQSxhQUFBLFNBQUEsUUFBQSxVQUFBLEtBQUEsS0FBQSxVQUFBLEdBQUE7TUFDQSxPQUFBLEVBQUE7O0tBRUEsUUFBQSxNQUFBLGFBQUEsU0FBQSxRQUFBLFVBQUEsS0FBQSxhQUFBLFVBQUEsR0FBQTtNQUNBLE9BQUEsRUFBQSxTQUFBLE9BQUE7UUFDQSxLQUFBLEtBQUEsVUFBQSxHQUFBO01BQ0EsT0FBQSxFQUFBLFNBQUEsTUFBQTs7O0lBR0EsSUFBQSxhQUFBLFlBQUE7O0tBRUEsTUFBQSxRQUFBLFVBQUEsR0FBQSxHQUFBO01BQ0EsUUFBQSxRQUFBLGFBQUEsU0FBQSxRQUFBLFVBQUEsTUFBQSxJQUFBLFFBQUE7UUFDQSxLQUFBLEtBQUEsVUFBQSxHQUFBO1FBQ0EsRUFBQSxTQUFBLEVBQUEsUUFBQSxNQUFBLFVBQUEsRUFBQSxRQUFBLE1BQUE7UUFDQSxPQUFBLE1BQUEsVUFBQSxFQUFBLFFBQUEsTUFBQTs7TUFFQSxRQUFBLE1BQUEsYUFBQSxTQUFBLFFBQUEsVUFBQSxNQUFBLElBQUEsUUFBQTtRQUNBLEtBQUEsYUFBQSxVQUFBLEdBQUE7UUFDQSxPQUFBLENBQUEsTUFBQSxVQUFBLEVBQUEsUUFBQSxNQUFBLGNBQUEsT0FBQTs7UUFFQSxLQUFBLEtBQUEsVUFBQSxHQUFBO1FBQ0EsT0FBQSxDQUFBLE1BQUEsVUFBQSxFQUFBLFFBQUEsTUFBQSxjQUFBLE1BQUE7Ozs7SUFJQSxJQUFBLFNBQUEsVUFBQSxHQUFBO0tBQ0EsT0FBQSxDQUFBLEtBQUEsSUFBQSxFQUFBLFFBQUEsT0FBQTs7SUFFQSxJQUFBLFFBQUEsWUFBQTtLQUNBLE9BQUEsUUFBQSxRQUFBLEdBQUEsT0FBQSxRQUFBLE1BQUEsT0FBQSxLQUFBLENBQUEsUUFBQSxPQUFBLFFBQUEsU0FBQSxNQUFBOztJQUVBLElBQUEsb0JBQUEsWUFBQTtLQUNBLFFBQUEsTUFBQSxRQUFBLFFBQUEsZ0JBQUEsT0FBQSxRQUFBLFNBQUEsTUFBQSxHQUFBLFFBQUEsVUFBQSxHQUFBO01BQ0EsUUFBQSxXQUFBLEtBQUEsb0JBQUEsRUFBQSxRQUFBLEtBQUEsYUFBQSxVQUFBLEdBQUE7T0FDQSxPQUFBLGVBQUEsRUFBQSxJQUFBLE1BQUEsRUFBQSxJQUFBOzs7S0FHQSxRQUFBLE1BQUE7O0lBRUEsSUFBQSxpQkFBQSxZQUFBO0tBQ0EsUUFBQSxNQUFBLFFBQUEsUUFBQSxnQkFBQSxPQUFBLFFBQUEsU0FBQSxLQUFBLEdBQUEsUUFBQSxVQUFBLEdBQUE7TUFDQSxRQUFBLFdBQUEsS0FBQSxpQkFBQSxFQUFBLFFBQUEsS0FBQSxhQUFBLFVBQUEsR0FBQTtPQUNBLE9BQUEsZUFBQSxFQUFBLElBQUEsTUFBQSxFQUFBLElBQUE7OztLQUdBLFFBQUEsTUFBQTs7SUFFQSxJQUFBLHNCQUFBLFVBQUEsT0FBQTtLQUNBLE9BQUEsQ0FBQSxVQUFBLE9BQUE7TUFDQSxPQUFBLFVBQUEsR0FBQTtPQUNBLEVBQUEsSUFBQSxFQUFBLElBQUEsQ0FBQSxRQUFBLE1BQUEsSUFBQSxFQUFBLE1BQUEsUUFBQSxTQUFBLFFBQUEsT0FBQTtPQUNBLEVBQUEsSUFBQSxFQUFBLElBQUEsQ0FBQSxRQUFBLE9BQUEsSUFBQSxFQUFBLE1BQUEsUUFBQSxTQUFBLFFBQUEsUUFBQTs7UUFFQTs7SUFFQSxJQUFBLG1CQUFBLFVBQUEsT0FBQTtLQUNBLE9BQUEsQ0FBQSxVQUFBLE9BQUE7TUFDQSxPQUFBLFVBQUEsR0FBQTtPQUNBLEVBQUEsSUFBQSxFQUFBLElBQUEsQ0FBQSxRQUFBLE9BQUEsSUFBQSxFQUFBLE1BQUEsUUFBQSxTQUFBLFFBQUEsUUFBQTtPQUNBLEVBQUEsSUFBQSxFQUFBLElBQUEsQ0FBQSxNQUFBLEVBQUEsTUFBQSxRQUFBLFNBQUEsUUFBQSxRQUFBOztRQUVBOztJQUVBLElBQUEsbUJBQUEsVUFBQSxPQUFBO0tBQ0EsT0FBQSxDQUFBLFVBQUEsT0FBQTtNQUNBLE9BQUEsVUFBQSxHQUFBOztPQUVBLElBQUE7T0FDQSxTQUFBLFFBQUEsWUFBQSxFQUFBO09BQ0EsRUFBQSxJQUFBLEVBQUEsSUFBQSxDQUFBLE9BQUEsSUFBQSxFQUFBLE1BQUEsT0FBQSxTQUFBLFFBQUEsUUFBQTtPQUNBLE9BQUEsRUFBQSxJQUFBLEVBQUEsSUFBQSxDQUFBLE9BQUEsSUFBQSxFQUFBLE1BQUEsT0FBQSxTQUFBLFFBQUEsUUFBQTs7UUFFQTs7SUFFQSxJQUFBLGVBQUEsVUFBQSxNQUFBLEdBQUEsU0FBQTtLQUNBLElBQUE7S0FDQSxVQUFBLDJCQUFBLEtBQUEsT0FBQTtLQUNBLFFBQUEsUUFBQSxLQUFBLEtBQUEsVUFBQSxVQUFBLE1BQUE7TUFDQSxXQUFBLHlDQUFBLEtBQUEsU0FBQSxLQUFBLFNBQUEsVUFBQSxLQUFBLFNBQUE7O0tBRUEsU0FBQSxRQUFBLFFBQUEsWUFBQSxTQUFBLE1BQUEsR0FBQSxPQUFBLE1BQUEsWUFBQTs7O0lBR0EsSUFBQSxlQUFBLFVBQUEsTUFBQSxHQUFBLFNBQUE7S0FDQSxPQUFBLFFBQUEsUUFBQTs7O0lBR0EsTUFBQSxPQUFBLGFBQUEsVUFBQSxNQUFBLFNBQUE7S0FDQSxRQUFBLFFBQUE7O0tBRUEsSUFBQSxRQUFBLFdBQUEsTUFBQTtNQUNBO01BQ0E7TUFDQTtZQUNBO01BQ0E7O0tBRUEsR0FBQSxPQUFBLFVBQUEsS0FBQSxRQUFBLFVBQUEsS0FBQTtPQUNBOztTQUVBO09BQ0E7Ozs7SUFJQSxNQUFBLE9BQUEsV0FBQSxVQUFBLEdBQUEsR0FBQTtLQUNBLEdBQUEsTUFBQSxFQUFBO01BQ0E7O0tBRUEsR0FBQSxPQUFBLEVBQUEsR0FBQSxZQUFBLFlBQUE7TUFDQSxRQUFBLFFBQUE7TUFDQTtNQUNBO01BQ0E7TUFDQTs7TUFFQSxHQUFBLE9BQUEsVUFBQSxLQUFBLFFBQUEsVUFBQSxLQUFBO1FBQ0E7OztVQUdBOztRQUVBOzs7OztJQUtBLE1BQUEsT0FBQSxhQUFBLFVBQUEsTUFBQSxNQUFBO0tBQ0EsSUFBQSxTQUFBLE1BQUE7TUFDQTs7S0FFQSxJQUFBLFFBQUEsT0FBQTtNQUNBO1lBQ0E7TUFDQTs7Ozs7Ozs7QUNqYkEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxRQUFBLG9CQUFBLFlBQUEsbUJBQUEsVUFBQTs7Ozs7O0FDSEEsQ0FBQSxZQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGtCQUFBLFVBQUEsNEJBQUEsVUFBQSxVQUFBO0VBQ0EsSUFBQSxXQUFBLFlBQUE7R0FDQSxPQUFBO0lBQ0EsT0FBQTtJQUNBLFFBQUE7SUFDQSxPQUFBO0lBQ0EsTUFBQTtJQUNBLE9BQUE7OztFQUdBLE9BQUE7R0FDQSxVQUFBO0dBQ0EsWUFBQTtHQUNBLE9BQUE7SUFDQSxTQUFBOztHQUVBLFNBQUE7R0FDQSxNQUFBLFVBQUEsUUFBQSxTQUFBLFFBQUEsU0FBQTs7O0lBR0EsT0FBQSxVQUFBLFFBQUEsT0FBQSxZQUFBLE9BQUE7OztJQUdBLElBQUEsU0FBQSxHQUFBLE1BQUE7TUFDQSxPQUFBLENBQUEsR0FBQSxPQUFBLFFBQUE7TUFDQSxNQUFBLENBQUEsR0FBQTtNQUNBLE1BQUE7OztJQUdBLElBQUEsTUFBQSxHQUFBLE9BQUEsUUFBQSxJQUFBLE9BQUE7TUFDQSxLQUFBLFNBQUEsT0FBQSxRQUFBO01BQ0EsS0FBQSxVQUFBLE9BQUEsUUFBQTtNQUNBLE9BQUE7SUFDQSxJQUFBLFlBQUEsSUFBQSxPQUFBO01BQ0EsS0FBQSxhQUFBLGVBQUEsT0FBQSxRQUFBLFFBQUEsSUFBQSxNQUFBLE9BQUEsUUFBQSxTQUFBLElBQUE7SUFDQSxJQUFBLGFBQUEsVUFBQSxPQUFBO01BQ0EsS0FBQSxLQUFBLE9BQUEsUUFBQSxRQUFBLElBQUE7TUFDQSxLQUFBLGdCQUFBO01BQ0EsS0FBQSxVQUFBLE9BQUEsUUFBQTtNQUNBLE1BQUEsV0FBQTtNQUNBLEtBQUEsUUFBQTtJQUNBLElBQUEsTUFBQSxHQUFBLElBQUE7TUFDQSxXQUFBO01BQ0EsWUFBQSxVQUFBLEdBQUE7TUFDQSxPQUFBLE9BQUEsUUFBQSxRQUFBLElBQUE7O01BRUEsWUFBQSxVQUFBLEdBQUE7TUFDQSxPQUFBLE9BQUEsUUFBQSxRQUFBOztJQUVBLElBQUEsY0FBQSxVQUFBLE9BQUE7TUFDQSxNQUFBO01BQ0EsVUFBQSxJQUFBLEtBQUEsS0FBQTs7TUFFQSxNQUFBLFFBQUEsT0FBQSxRQUFBO01BQ0EsS0FBQSxLQUFBO0lBQ0EsSUFBQSxPQUFBLFVBQUEsVUFBQTtNQUNBLEtBQUEsQ0FBQTtNQUNBO01BQ0EsT0FBQTtNQUNBLEtBQUEsVUFBQSxHQUFBO01BQ0EsT0FBQSxPQUFBOztNQUVBLE1BQUEsUUFBQSxPQUFBLFFBQUE7TUFDQSxNQUFBLGVBQUE7TUFDQSxLQUFBLGVBQUE7TUFDQSxLQUFBLEtBQUE7OztJQUdBLFNBQUEsVUFBQSxRQUFBO0tBQ0EsWUFBQTtPQUNBLFNBQUE7T0FDQSxLQUFBLFVBQUEsT0FBQSxVQUFBLElBQUEsS0FBQTtLQUNBLEtBQUEsYUFBQSxTQUFBLEtBQUEsTUFBQSxRQUFBLFVBQUEsR0FBQTtNQUNBLElBQUEsT0FBQSxLQUFBLFlBQUEsTUFBQTtNQUNBLElBQUEsSUFBQSxHQUFBLFlBQUEsU0FBQSxLQUFBLEtBQUE7TUFDQSxPQUFBLFVBQUEsR0FBQTtPQUNBLEtBQUEsY0FBQSxRQUFBLEtBQUEsTUFBQSxFQUFBLEtBQUEsS0FBQTs7Ozs7O0lBTUEsU0FBQSxTQUFBLFlBQUEsVUFBQTtLQUNBLFdBQUEsVUFBQSxLQUFBLFVBQUEsR0FBQTtNQUNBLElBQUEsY0FBQSxHQUFBLFlBQUEsRUFBQSxVQUFBO01BQ0EsT0FBQSxVQUFBLEdBQUE7T0FDQSxFQUFBLFdBQUEsWUFBQTtPQUNBLE9BQUEsSUFBQTs7Ozs7SUFLQSxPQUFBLE9BQUEsV0FBQSxVQUFBLEdBQUEsR0FBQTtLQUNBLElBQUEsTUFBQSxHQUFBO01BQ0E7O0tBRUEsV0FBQSxNQUFBLFVBQUEsRUFBQTtLQUNBLFlBQUEsTUFBQSxRQUFBLEVBQUE7S0FDQSxLQUFBLE1BQUEsUUFBQSxFQUFBO0tBQ0EsU0FBQSxZQUFBO01BQ0EsVUFBQSxRQUFB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RUFHQSxTQUFBLGtCQUFBLE1BQUEsV0FBQTtHQUNBLElBQUEsT0FBQSxLQUFBLGNBQUEsYUFBQTtJQUNBLEtBQUEsYUFBQTtJQUNBLE9BQUE7O0dBRUEsSUFBQSxRQUFBLEtBQUEsV0FBQSxRQUFBO0dBQ0EsT0FBQSxVQUFBLENBQUEsSUFBQSxPQUFBOztFQUVBLE9BQUEsT0FBQSxXQUFBLFVBQUEsR0FBQSxHQUFBO0dBQ0EsSUFBQSxNQUFBLEdBQUE7R0FDQSxHQUFBLENBQUEsR0FBQSxrQkFBQTtJQUNBLEdBQUEsY0FBQSxFQUFBO0lBQ0EsR0FBQSxhQUFBLEVBQUE7SUFDQSxHQUFBLGdCQUFBLEVBQUE7SUFDQSxHQUFBLFlBQUEsRUFBQTtJQUNBLGNBQUEsYUFBQSxnQkFBQTtVQUNBO0lBQ0EsRUFBQSxlQUFBLEdBQUEsY0FBQSxHQUFBLGNBQUE7SUFDQSxFQUFBLGtCQUFBLEdBQUEsYUFBQSxHQUFBLGFBQUE7SUFDQSxFQUFBLGFBQUEsR0FBQSxlQUFBLEdBQUEsZUFBQTtJQUNBLEVBQUEsWUFBQSxHQUFBLFdBQUEsR0FBQSxXQUFBOzs7RUFHQSxPQUFBLE9BQUEsV0FBQSxVQUFBLEdBQUEsR0FBQTtHQUNBLElBQUEsTUFBQSxHQUFBO0dBQ0EsSUFBQSxPQUFBLEVBQUEsY0FBQSxhQUFBLEVBQUEsYUFBQTtHQUNBLElBQUEsRUFBQSxTQUFBLEVBQUEsbUJBQUEsRUFBQSxnQkFBQSxFQUFBLE1BQUEsVUFBQSxHQUFBO0lBQ0EsRUFBQSxPQUFBO0lBQ0EsRUFBQSxPQUFBLEVBQUEsV0FBQSxTQUFBLE9BQUE7VUFDQTtJQUNBLEVBQUEsT0FBQSxFQUFBLE9BQUE7SUFDQTtLQUNBOzs7OztBQzFFQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsa0JBQUEsV0FBQSxpQkFBQSxXQUFBOztFQUVBLE9BQUE7R0FDQSxVQUFBO0dBQ0EsT0FBQTtJQUNBLE1BQUE7O0dBRUEsUUFBQTtHQUNBLGFBQUE7R0FDQSxZQUFBO0dBQ0EsY0FBQTtHQUNBLGtCQUFBO0dBQ0EsTUFBQSxVQUFBLE9BQUEsU0FBQSxPQUFBOztJQUVBLElBQUEsS0FBQTtJQUNBLElBQUEsS0FBQSxRQUFBO0lBQ0EsSUFBQSxTQUFBLFFBQUE7SUFDQSxPQUFBLEdBQUEsY0FBQSxTQUFBLEVBQUE7S0FDQSxRQUFBLFNBQUE7T0FDQSxHQUFBLGNBQUEsU0FBQSxFQUFBO0tBQ0EsUUFBQSxZQUFBOzs7Ozs7Ozs7QUN2QkEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxRQUFBLG9CQUFBLFlBQUEscUJBQUEsVUFBQTs7RUFFQSxJQUFBLEtBQUE7O0VBRUE7O0VBRUEsU0FBQSxXQUFBO0dBQ0E7O0VBRUEsU0FBQSxPQUFBO0dBQ0EsSUFBQSxHQUFBLEtBQUEsU0FBQSxHQUFBLEtBQUEsbUJBQUEsR0FBQSxLQUFBLGdCQUFBLEdBQUEsS0FBQSxNQUFBLFVBQUEsR0FBQTtJQUNBLEdBQUEsS0FBQSxPQUFBO0lBQ0EsR0FBQSxLQUFBLE9BQUEsR0FBQSxLQUFBLFdBQUEsU0FBQSxPQUFBO1VBQ0E7SUFDQSxHQUFBLEtBQUEsT0FBQSxHQUFBLEtBQUEsT0FBQTtJQUNBOzs7Ozs7QUNsQkEsQ0FBQSxZQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGtCQUFBLFVBQUEsdUJBQUEsVUFBQSxVQUFBO0VBQ0EsSUFBQSxXQUFBLFlBQUE7R0FDQSxPQUFBO0lBQ0EsSUFBQTtJQUNBLE9BQUE7SUFDQSxRQUFBO0lBQ0EsTUFBQTtJQUNBLE9BQUE7SUFDQSxVQUFBO0lBQ0EsUUFBQTtLQUNBLE1BQUE7S0FDQSxPQUFBO0tBQ0EsS0FBQTtLQUNBLFFBQUE7O0lBRUEsUUFBQSxFQUFBO0tBQ0EsVUFBQTtLQUNBLE9BQUE7S0FDQSxTQUFBO09BQ0E7S0FDQSxVQUFBO0tBQ0EsT0FBQTtLQUNBLFNBQUE7TUFDQTtLQUNBLFVBQUE7S0FDQSxPQUFBO0tBQ0EsU0FBQTs7OztFQUlBLE9BQUE7R0FDQSxVQUFBO0dBQ0EsT0FBQTtJQUNBLE1BQUE7SUFDQSxTQUFBOztHQUVBLFNBQUE7R0FDQSxNQUFBLFVBQUEsUUFBQSxTQUFBLFFBQUEsU0FBQTs7SUFFQSxJQUFBLFVBQUEsUUFBQSxPQUFBLFlBQUE7SUFDQSxVQUFBLFFBQUEsT0FBQSxTQUFBLE9BQUE7SUFDQSxRQUFBLFNBQUEsSUFBQSxPQUFBO0lBQ0EsR0FBQSxRQUFBLE1BQUE7S0FDQSxRQUFBLE9BQUEsR0FBQSxRQUFBLFFBQUE7O0lBRUEsUUFBQSxJQUFBLFVBQUEsUUFBQSxTQUFBLE1BQUEsSUFBQSxpQkFBQSxRQUFBLFNBQUEsSUFBQTtJQUNBLElBQUEsTUFBQTtJQUNBLFFBQUEsUUFBQSxPQUFBLE1BQUEsVUFBQSxLQUFBLEtBQUE7S0FDQSxNQUFBLEdBQUEsSUFBQSxDQUFBLEtBQUEsU0FBQSxJQUFBLFFBQUE7O0lBRUEsSUFBQSxJQUFBLEdBQUEsTUFBQTtNQUNBLE9BQUEsQ0FBQSxHQUFBO01BQ0EsTUFBQSxDQUFBLFFBQUEsT0FBQSxNQUFBLFFBQUEsUUFBQSxRQUFBLE9BQUE7TUFDQSxNQUFBOztJQUVBLElBQUEsUUFBQSxHQUFBLElBQUE7TUFDQSxFQUFBO01BQ0EsT0FBQSxDQUFBLEdBQUE7TUFDQSxHQUFBLFNBQUE7TUFDQSxHQUFBLFlBQUE7O0lBRUEsSUFBQSxNQUFBLEdBQUEsT0FBQSxRQUFBLElBQUEsT0FBQTtNQUNBLEtBQUEsU0FBQSxRQUFBO01BQ0EsS0FBQSxVQUFBLFFBQUE7TUFDQSxPQUFBOztJQUVBLElBQUEsV0FBQSxJQUFBLE9BQUE7TUFDQSxPQUFBO01BQ0EsS0FBQSxNQUFBLFFBQUEsTUFBQSxRQUFBO01BQ0EsS0FBQSxNQUFBO01BQ0EsS0FBQSxNQUFBO01BQ0EsS0FBQSxNQUFBO01BQ0EsS0FBQSxNQUFBO01BQ0EsS0FBQSxnQkFBQTtJQUNBLFFBQUEsUUFBQSxRQUFBLFFBQUEsVUFBQSxPQUFBO0tBQ0EsU0FBQSxPQUFBO09BQ0EsS0FBQSxVQUFBLE1BQUEsV0FBQTtPQUNBLEtBQUEsY0FBQSxNQUFBO09BQ0EsS0FBQSxnQkFBQSxNQUFBOztJQUVBLElBQUEsT0FBQSxJQUFBLE9BQUE7TUFDQSxLQUFBLFNBQUEsUUFBQTtNQUNBLEtBQUEsVUFBQSxRQUFBO01BQ0EsTUFBQSxRQUFBLFdBQUEsUUFBQSxNQUFBLFFBQUEsU0FBQTtJQUNBLElBQUEsU0FBQSxJQUFBLE9BQUEsS0FBQSxLQUFBLGFBQUEsZUFBQSxRQUFBLFNBQUEsSUFBQSxPQUFBLFFBQUEsU0FBQSxJQUFBO01BQ0EsS0FBQSxTQUFBOztJQUVBLElBQUEsUUFBQSxTQUFBLE1BQUE7S0FDQSxPQUFBLE9BQUE7T0FDQSxLQUFBLEtBQUEsUUFBQSxTQUFBO0tBQ0EsT0FBQSxPQUFBO09BQ0EsS0FBQTtPQUNBLE1BQUEsYUFBQSxRQUFBLE9BQUE7T0FDQSxLQUFBLGVBQUE7T0FDQSxLQUFBLEtBQUE7S0FDQSxJQUFBLFVBQUEsSUFBQSxPQUFBLEtBQUEsS0FBQSxhQUFBLGdCQUFBLFFBQUEsU0FBQSxRQUFBLFNBQUEsTUFBQSxPQUFBLFFBQUEsU0FBQSxJQUFBO09BQ0EsS0FBQSxTQUFBO0tBQ0EsUUFBQSxPQUFBO09BQ0EsS0FBQSxLQUFBLFFBQUEsU0FBQTtLQUNBLFFBQUEsT0FBQTtPQUNBLEtBQUEsVUFBQTs7T0FFQSxHQUFBLE1BQUEsS0FBQTtRQUNBLElBQUEsSUFBQSxDQUFBLFNBQUEsT0FBQSxNQUFBO1FBQ0EsT0FBQSxFQUFBLE9BQUEsR0FBQSxFQUFBLFFBQUEsU0FBQTs7T0FFQSxPQUFBOztPQUVBLE1BQUEsYUFBQSxRQUFBLE9BQUE7T0FDQSxLQUFBLGVBQUE7T0FDQSxLQUFBLEtBQUE7O0lBRUEsSUFBQSxTQUFBLElBQUEsT0FBQTtNQUNBLEtBQUEsU0FBQTtJQUNBLEdBQUEsUUFBQSxZQUFBLEtBQUE7S0FDQSxPQUFBLEtBQUE7OztJQUdBLE9BQUEsT0FBQTtNQUNBLEtBQUEsVUFBQSxRQUFBOztJQUVBLElBQUEsUUFBQSxTQUFBLE1BQUE7SUFDQSxPQUFBLE9BQUE7TUFDQSxLQUFBLE1BQUEsUUFBQSxRQUFBO01BQ0EsS0FBQSxNQUFBO01BQ0EsS0FBQSxNQUFBLFFBQUEsUUFBQTtNQUNBLEtBQUEsTUFBQSxRQUFBO01BQ0EsS0FBQSxvQkFBQTtNQUNBLEtBQUEsZ0JBQUE7TUFDQSxLQUFBLFVBQUE7O0lBRUEsSUFBQSxhQUFBLE9BQUEsT0FBQTtNQUNBLEtBQUEsYUFBQSxpQkFBQSxRQUFBLFNBQUEsSUFBQTtJQUNBLElBQUEsU0FBQSxXQUFBLE9BQUE7TUFDQSxLQUFBLFNBQUE7TUFDQSxLQUFBLEtBQUEsUUFBQSxTQUFBO0tBQ0EsR0FBQSxRQUFBLE1BQUE7TUFDQSxPQUFBLE1BQUEsUUFBQSxRQUFBOztJQUVBLElBQUEsY0FBQSxXQUFBLE9BQUE7TUFDQSxLQUFBO01BQ0EsTUFBQSxhQUFBLFFBQUEsT0FBQTtNQUNBLEtBQUEsZUFBQSxVQUFBLEtBQUEsS0FBQTs7Ozs7O0lBTUEsU0FBQSxRQUFBO0tBQ0EsSUFBQSxRQUFBLE1BQUEsU0FBQTs7S0FFQSxJQUFBLEdBQUEsTUFBQSxhQUFBO01BQ0EsUUFBQSxFQUFBLE9BQUEsR0FBQSxNQUFBLE1BQUE7TUFDQSxNQUFBLE9BQUEsQ0FBQSxPQUFBOztLQUVBLEdBQUEsU0FBQSxTQUFBLEtBQUE7TUFDQSxJQUFBLElBQUEsQ0FBQSxTQUFBLFNBQUEsTUFBQTtNQUNBLFlBQUEsS0FBQSxFQUFBLE9BQUEsR0FBQSxFQUFBLFFBQUEsU0FBQTs7U0FFQTtNQUNBLFlBQUEsS0FBQSxTQUFBOzs7S0FHQSxXQUFBLEtBQUEsYUFBQSxlQUFBLEVBQUEsU0FBQSxNQUFBLFFBQUEsU0FBQSxJQUFBOzs7SUFHQSxTQUFBLFVBQUE7O0tBRUEsSUFBQSxRQUFBLE1BQUEsU0FBQTtNQUNBLFFBQUE7TUFDQSxRQUFBO0tBQ0EsSUFBQSxRQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0lBZ0JBLE9BQUEsT0FBQSxXQUFBLFNBQUEsRUFBQSxFQUFBO0tBQ0EsR0FBQSxNQUFBLEVBQUE7TUFDQTs7S0FFQSxRQUFBLE9BQUEsR0FBQSxRQUFBLEVBQUE7S0FDQSxXQUFBLElBQUEsT0FBQTtPQUNBLE9BQUE7T0FDQSxLQUFBLE1BQUEsUUFBQSxNQUFBLElBQUEsRUFBQTtPQUNBLEtBQUEsTUFBQTtPQUNBLEtBQUEsTUFBQTtPQUNBLEtBQUEsTUFBQTtPQUNBLEtBQUEsTUFBQTtPQUNBLEtBQUEsZ0JBQUE7S0FDQSxRQUFBLFFBQUEsUUFBQSxRQUFBLFVBQUEsT0FBQTtNQUNBLFNBQUEsT0FBQTtRQUNBLEtBQUEsVUFBQSxNQUFBLFdBQUE7UUFDQSxLQUFBLGNBQUEsTUFBQTtRQUNBLEtBQUEsZ0JBQUEsTUFBQTs7S0FFQSxLQUFBLE1BQUEsUUFBQSxVQUFBLFFBQUEsUUFBQSxJQUFBLEVBQUEsTUFBQTtLQUNBLE9BQUEsTUFBQSxRQUFBLEVBQUE7S0FDQSxZQUFBLEtBQUEsU0FBQSxRQUFBLFlBQUEsRUFBQTtLQUNBLFdBQUEsYUFBQSxTQUFBLEtBQUEsS0FBQSxRQUFBLEtBQUEsYUFBQSxlQUFBLEVBQUEsUUFBQSxZQUFBLEVBQUEsVUFBQSxNQUFBLFFBQUEsU0FBQSxJQUFBOztJQUVBLE9BQUE7S0FDQSxZQUFBO01BQ0EsT0FBQSxRQUFBOztLQUVBLFVBQUEsVUFBQSxVQUFBO01BQ0EsSUFBQSxDQUFBLFVBQUE7T0FDQSxZQUFBLEtBQUEsU0FBQTtPQUNBLFdBQUEsS0FBQSxhQUFBLGVBQUEsRUFBQSxLQUFBLE1BQUEsUUFBQSxTQUFBLElBQUE7T0FDQTs7TUFFQSxZQUFBLEtBQUEsU0FBQSxTQUFBLFFBQUE7TUFDQSxJQUFBLFlBQUEsVUFBQTtPQUNBLFdBQUEsS0FBQSxhQUFBLGVBQUEsRUFBQSxTQUFBLFFBQUEsVUFBQSxNQUFBLFFBQUEsU0FBQSxJQUFBO2FBQ0E7T0FDQSxXQUFBLGFBQUEsU0FBQSxLQUFBLEtBQUEsUUFBQSxLQUFBLGFBQUEsZUFBQSxFQUFBLFNBQUEsUUFBQSxVQUFBLE1BQUEsUUFBQSxTQUFBLElBQUE7Ozs7Ozs7Ozs7O0FDcE9BLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsUUFBQSxvQkFBQSxZQUFBLGNBQUEsVUFBQTs7Ozs7O0FDSEEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGtCQUFBLFdBQUEsNkRBQUEsU0FBQSxRQUFBLFVBQUEsUUFBQSxjQUFBOztFQUVBLE9BQUE7R0FDQSxVQUFBO0dBQ0EsYUFBQTtHQUNBLFlBQUE7R0FDQSxRQUFBO0dBQ0EsTUFBQSxVQUFBLFFBQUEsU0FBQSxRQUFBOztJQUVBLElBQUEsU0FBQTtJQUNBLElBQUEsVUFBQSxHQUFBLFdBQUEsR0FBQSxhQUFBLEdBQUE7SUFDQSxJQUFBLE9BQUE7SUFDQSxJQUFBLFdBQUE7SUFDQSxJQUFBLG1CQUFBO0lBQ0EsSUFBQSxTQUFBLFFBQUEsS0FBQTtLQUNBLElBQUEsUUFBQSxRQUFBLEtBQUE7S0FDQSxJQUFBLGFBQUE7S0FDQSxJQUFBLE1BQUE7S0FDQSxJQUFBLFVBQUE7S0FDQSxNQUFBLElBQUEsRUFBQSxRQUFBO0tBQ0EsT0FBQSxLQUFBLFNBQUEsV0FBQTtPQUNBLE1BQUEsR0FBQTs7S0FFQSxNQUFBLEtBQUEsU0FBQSxTQUFBLEVBQUE7TUFDQSxhQUFBO01BQ0EsTUFBQTtNQUNBLFVBQUE7TUFDQSxTQUFBO01BQ0EsVUFBQSxHQUFBLFdBQUEsR0FBQSxhQUFBLEdBQUE7TUFDQSxPQUFBO01BQ0EsV0FBQTtPQUNBLFNBQUEsVUFBQTtRQUNBLGFBQUE7UUFDQSxJQUFBLE1BQUEsS0FBQSxNQUFBLE1BQUEsR0FBQSxNQUFBLEdBQUE7U0FDQSxnQkFBQTtTQUNBLE9BQUE7U0FDQSxlQUFBO1NBQ0EsS0FBQSxTQUFBLElBQUE7VUFDQSxRQUFBLFFBQUEsSUFBQSxLQUFBLElBQUEsU0FBQSxNQUFBLElBQUE7V0FDQSxHQUFBLE1BQUEsU0FBQSxPQUFBLEdBQUE7WUFDQSxnREFBQSxPQUFBLEtBQUEsS0FBQSxXQUFBLGNBQUEsUUFBQSxTQUFBLENBQUEsRUFBQTthQUNBLElBQUEsT0FBQSxLQUFBO2NBQ0EsS0FBQTtjQUNBLFFBQUE7Y0FDQSxRQUFBOzthQUVBOzs7O1VBSUEsR0FBQSxXQUFBO1dBQ0EsUUFBQSxRQUFBLElBQUEsS0FBQSxJQUFBLFNBQUEsTUFBQSxJQUFBO1lBQ0EsR0FBQSxJQUFBLFVBQUEsRUFBQTthQUNBLEdBQUEsT0FBQSxRQUFBLEtBQUEsUUFBQSxZQUFBO2VBQ0EsUUFBQSxLQUFBLE9BQUE7O2FBRUEsUUFBQSxLQUFBLEtBQUEsS0FBQTs7Ozs7Y0FLQTtXQUNBLGFBQUEsUUFBQTs7Ozs7U0FLQSxrQkFBQSxTQUFBO1NBQ0E7OztVQUdBLElBQUEsUUFBQSxNQUFBLE9BQUEsZUFBQTtXQUNBLElBQUEsWUFBQTtZQUNBLElBQUEsV0FBQSxNQUFBLE9BQUEsR0FBQSxPQUFBLE9BQUE7O1VBRUEsR0FBQSxTQUFBLFNBQUEsRUFBQTtZQUNBLFdBQUEsTUFBQSxPQUFBLEdBQUEsT0FBQSxPQUFBO1dBQ0EsWUFBQTs7VUFFQSxJQUFBLFFBQUE7O1VBRUEsSUFBQSxJQUFBLElBQUEsR0FBQSxLQUFBLFNBQUEsUUFBQSxJQUFBO1dBQ0EsR0FBQSxTQUFBLEdBQUE7WUFDQSxTQUFBLEtBQUEsU0FBQSxHQUFBLFFBQUEsY0FBQSxLQUFBO1lBQ0EsR0FBQSxTQUFBLEdBQUEsUUFBQSxPQUFBLENBQUEsRUFBQTthQUNBLFNBQUEsS0FBQSxTQUFBLEdBQUEsT0FBQSxHQUFBLFNBQUEsR0FBQSxRQUFBOztZQUVBLElBQUEsT0FBQSxTQUFBLEdBQUEsTUFBQTtZQUNBLEdBQUEsS0FBQSxTQUFBLEVBQUE7YUFDQSxTQUFBLEtBQUE7YUFDQSxJQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsS0FBQSxRQUFBLElBQUE7Y0FDQSxHQUFBLE1BQUEsS0FBQSxJQUFBO2VBQ0EsR0FBQSxJQUFBLEVBQUE7Z0JBQ0EsU0FBQSxNQUFBOztlQUVBLFNBQUEsTUFBQSxLQUFBOzs7OztZQUtBLEdBQUEsU0FBQSxHQUFBLFVBQUEsRUFBQTthQUNBLE1BQUEsS0FBQTs7OztVQUlBLEdBQUEsU0FBQSxVQUFBLE1BQUEsT0FBQTtXQUNBLGFBQUE7WUFDQSxJQUFBLElBQUEsSUFBQSxHQUFBLEtBQUEsU0FBQSxRQUFBLElBQUE7YUFDQSxHQUFBLE9BQUEsUUFBQSxTQUFBLE9BQUEsWUFBQTtjQUNBLFFBQUEsU0FBQSxNQUFBOzthQUVBLFFBQUEsU0FBQSxJQUFBLE9BQUE7Ozs7WUFJQSxPQUFBLFNBQUEsS0FBQSxhQUFBLE1BQUEsT0FBQTs7U0FFQSxPQUFBLFNBQUEsS0FBQTtTQUNBO1VBQ0EsYUFBQSxNQUFBOztTQUVBLFVBQUEsU0FBQTtTQUNBO1VBQ0EsYUFBQSxVQUFBOzs7VUFHQSxHQUFBLENBQUEsV0FBQTtXQUNBLFFBQUEsUUFBQSxhQUFBLGdCQUFBLEtBQUEsSUFBQSxTQUFBLE1BQUEsSUFBQTtZQUNBLEdBQUEsSUFBQSxjQUFBLFFBQUEsVUFBQSxDQUFBLEtBQUEsSUFBQSxjQUFBLFFBQUEsV0FBQSxDQUFBLEVBQUE7YUFDQSxhQUFBLFlBQUE7O2FBRUEsR0FBQSxJQUFBLGNBQUEsUUFBQSxjQUFBLENBQUEsRUFBQTtjQUNBLGFBQUEsZ0JBQUE7Ozs7Y0FJQTtXQUNBLFFBQUEsUUFBQSxTQUFBLFNBQUEsS0FBQSxJQUFBO1lBQ0EsS0FBQSxTQUFBO1lBQ0EsR0FBQSxJQUFBLGlCQUFBLGVBQUEsT0FBQSxPQUFBLFlBQUE7YUFDQSxJQUFBLElBQUEsQ0FBQSxJQUFBLElBQUE7YUFDQSxRQUFBLFFBQUEsS0FBQSxNQUFBLFNBQUEsUUFBQSxFQUFBO2NBQ0EsRUFBQSxVQUFBLEtBQUE7Y0FDQSxHQUFBLE1BQUEsV0FBQSxTQUFBLEdBQUE7ZUFDQSxHQUFBLE9BQUEsV0FBQSxpQkFBQSxRQUFBLFNBQUEsS0FBQSxPQUFBLFdBQUEsY0FBQSxRQUFBLFNBQUEsQ0FBQSxFQUFBO2dCQUNBLEtBQUEsT0FBQSxLQUFBO2lCQUNBLEtBQUE7aUJBQ0EsUUFBQTtpQkFDQSxRQUFBOztnQkFFQTs7OzthQUlBLGFBQUEsUUFBQSxDQUFBLEtBQUEsQ0FBQSxJQUFBLE9BQUEsS0FBQTs7O1dBR0EsYUFBQSxZQUFBOzs7O1VBSUEsYUFBQTtVQUNBLE9BQUEsS0FBQSxhQUFBLGNBQUEsb0JBQUE7VUFDQSxPQUFBLEdBQUE7Ozs7Ozs7Ozs7Ozs7O0FDdEtBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsUUFBQSxvQkFBQSxZQUFBLGdCQUFBLFVBQUE7Ozs7Ozs7QUNIQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsa0JBQUEsV0FBQSxtQkFBQSxXQUFBO0VBQ0EsSUFBQSxXQUFBLFVBQUE7R0FDQSxPQUFBO0lBQ0EsT0FBQTs7O0VBR0EsT0FBQTtHQUNBLFVBQUE7R0FDQSxNQUFBO0lBQ0EsS0FBQTtJQUNBLFVBQUE7SUFDQSxRQUFBOztHQUVBLGFBQUE7R0FDQSxZQUFBO0dBQ0EsTUFBQSxVQUFBLFFBQUEsU0FBQSxRQUFBO0lBQ0EsT0FBQSxVQUFBLFFBQUEsT0FBQSxZQUFBLE9BQUE7SUFDQSxPQUFBO0lBQ0EsT0FBQTs7Ozs7Ozs7QUNyQkEsQ0FBQSxZQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsa0NBQUEsVUFBQSxRQUFBO0VBQ0EsT0FBQSxTQUFBO0dBQ0EsU0FBQTtHQUNBLFVBQUE7R0FDQSxVQUFBO0dBQ0EsYUFBQTtHQUNBLGlCQUFBO0dBQ0Esa0JBQUE7R0FDQSxlQUFBO0dBQ0EsaUJBQUE7R0FDQSxVQUFBOztFQUVBLE9BQUEsUUFBQTtHQUNBLFNBQUE7SUFDQSxPQUFBOztHQUVBLE1BQUE7O0VBRUEsT0FBQSxXQUFBLFlBQUE7R0FDQSxPQUFBLE1BQUEsUUFBQSxRQUFBO0lBQ0EsTUFBQTtJQUNBLGdCQUFBO0lBQ0EsUUFBQTtLQUNBLEtBQUE7S0FDQSxPQUFBO0tBQ0EsUUFBQTtLQUNBLE1BQUE7O0lBRUEsR0FBQSxVQUFBLEdBQUE7S0FDQSxPQUFBLEVBQUE7O0lBRUEsR0FBQSxVQUFBLEdBQUE7S0FDQSxPQUFBLEVBQUE7O0lBRUEsWUFBQTtJQUNBLFlBQUE7SUFDQSxXQUFBO0lBQ0Esb0JBQUE7SUFDQSx5QkFBQTs7O0lBR0EsT0FBQTtLQUNBLFdBQUE7O0lBRUEsT0FBQTtLQUNBLFdBQUE7S0FDQSxtQkFBQTs7SUFFQSxRQUFBO0tBQ0EsWUFBQTs7SUFFQSxPQUFBO0tBQ0EsYUFBQTs7OztHQUlBLElBQUEsT0FBQSxRQUFBLFVBQUEsTUFBQTtJQUNBLE9BQUEsTUFBQSxRQUFBLE1BQUEsVUFBQSxDQUFBLFNBQUEsT0FBQSxNQUFBLE1BQUEsT0FBQSxNQUFBOztHQUVBLE9BQUEsT0FBQTs7RUFFQSxPQUFBLGlCQUFBLFlBQUE7R0FDQSxJQUFBLFlBQUE7R0FDQSxPQUFBLFFBQUE7SUFDQSxLQUFBO0lBQ0EsS0FBQTs7R0FFQSxRQUFBLFFBQUEsT0FBQSxXQUFBLFVBQUEsTUFBQSxLQUFBO0lBQ0EsSUFBQSxRQUFBO0tBQ0EsSUFBQTtLQUNBLEtBQUEsS0FBQTtLQUNBLE9BQUEsS0FBQTtLQUNBLFFBQUE7O0lBRUEsUUFBQSxRQUFBLE9BQUEsTUFBQSxVQUFBLE1BQUEsR0FBQTtLQUNBLE1BQUEsT0FBQSxLQUFBO01BQ0EsSUFBQTtNQUNBLEdBQUEsS0FBQSxLQUFBLE9BQUE7TUFDQSxHQUFBLEtBQUEsS0FBQSxPQUFBOztLQUVBLE9BQUEsTUFBQSxNQUFBLEtBQUEsSUFBQSxPQUFBLE1BQUEsS0FBQSxLQUFBLEtBQUEsT0FBQTtLQUNBLE9BQUEsTUFBQSxNQUFBLEtBQUEsSUFBQSxPQUFBLE1BQUEsS0FBQSxLQUFBLEtBQUEsT0FBQTs7SUFFQSxVQUFBLEtBQUE7OztHQUdBLE9BQUEsTUFBQSxPQUFBO0dBQ0EsSUFBQSxPQUFBLFFBQUEsVUFBQSxRQUFBO0lBQ0EsT0FBQSxNQUFBLFFBQUEsTUFBQSxVQUFBLENBQUEsU0FBQSxPQUFBLE1BQUEsTUFBQSxPQUFBLE1BQUE7OztFQUdBLE9BQUEsT0FBQSxRQUFBLFVBQUEsR0FBQSxHQUFBO0dBQ0EsSUFBQSxDQUFBLEdBQUE7SUFDQTs7R0FFQSxPQUFBOztFQUVBLE9BQUEsT0FBQSxhQUFBLFVBQUEsR0FBQSxHQUFBO0dBQ0EsSUFBQSxNQUFBLEdBQUE7SUFDQTs7R0FFQSxPQUFBOzs7Ozs7QUN4R0EsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGtCQUFBLFVBQUEsaUJBQUEsQ0FBQSxlQUFBLFNBQUEsYUFBQTs7RUFFQSxJQUFBLFNBQUE7UUFDQSxJQUFBLFNBQUE7O1FBRUEsU0FBQSxNQUFBLElBQUE7WUFDQSxJQUFBLEtBQUEsR0FBQSxHQUFBLGFBQUE7WUFDQSxJQUFBLENBQUEsSUFBQTtnQkFDQSxLQUFBLEVBQUE7Z0JBQ0EsR0FBQSxHQUFBLGFBQUEscUJBQUE7O1lBRUEsT0FBQTs7UUFFQSxTQUFBLFNBQUEsSUFBQTtZQUNBLElBQUEsUUFBQSxPQUFBO1lBQ0EsSUFBQSxDQUFBLE9BQUE7Z0JBQ0EsUUFBQTtnQkFDQSxPQUFBLE1BQUE7O1lBRUEsT0FBQTs7O1FBR0EsU0FBQSxlQUFBLFNBQUEsT0FBQSxVQUFBLFNBQUEsUUFBQTtZQUNBLE9BQUEsV0FBQTtnQkFDQSxNQUFBLFlBQUE7Z0JBQ0EsTUFBQSxXQUFBO2dCQUNBLE1BQUEsU0FBQTtnQkFDQSxTQUFBLFFBQUEsUUFBQSxXQUFBO29CQUNBLElBQUEsV0FBQSxNQUFBLFdBQUEsUUFBQTt3QkFDQSxRQUFBLEdBQUEsTUFBQSxTQUFBOztvQkFFQSxNQUFBLFlBQUE7b0JBQ0EsTUFBQSxXQUFBO29CQUNBLE1BQUE7Ozs7O1FBS0EsT0FBQTtZQUNBLE9BQUEsU0FBQSxTQUFBLFFBQUE7O29CQUVBLElBQUEsUUFBQSxTQUFBLE1BQUE7b0JBQ0EsSUFBQSxTQUFBLENBQUEsTUFBQSxhQUFBLE1BQUE7d0JBQ0EsTUFBQSxTQUFBLFFBQUEsR0FBQTtvQkFDQSxJQUFBLFdBQUEsWUFBQSxTQUFBO3dCQUNBLE1BQUEsQ0FBQSxRQUFBLFNBQUEsTUFBQSxTQUFBO3dCQUNBLElBQUEsQ0FBQSxRQUFBLE9BQUEsU0FBQTs7b0JBRUEsSUFBQSxVQUFBO3dCQUNBLElBQUEsTUFBQSxXQUFBOzRCQUNBLE1BQUE7OEJBQ0EsZUFBQTs2Q0FDQTs2Q0FDQTs2Q0FDQTs2Q0FDQTs0QkFDQSxPQUFBLE1BQUEsU0FBQTs7NkJBRUE7NEJBQ0EsTUFBQSxTQUFBOzRCQUNBLE9BQUEsZUFBQTtrREFDQTtrREFDQTtrREFDQTtrREFDQTs7OztnQkFJQTs7WUFFQSxPQUFBLFNBQUEsU0FBQSxRQUFBOztvQkFFQSxJQUFBLFFBQUEsU0FBQSxNQUFBO29CQUNBLElBQUEsU0FBQSxDQUFBLE1BQUEsYUFBQSxNQUFBO3dCQUNBLE1BQUEsU0FBQSxRQUFBLEdBQUE7O29CQUVBLElBQUEsV0FBQSxZQUFBLFNBQUE7d0JBQ0EsTUFBQSxDQUFBLFFBQUEsT0FBQSxTQUFBO3dCQUNBLElBQUEsQ0FBQSxRQUFBLFNBQUEsTUFBQSxTQUFBOztvQkFFQSxJQUFBLFVBQUE7d0JBQ0EsSUFBQSxNQUFBLFdBQUE7NEJBQ0EsTUFBQSxTQUFBLGVBQUE7MERBQ0E7MERBQ0E7MERBQ0E7MERBQ0E7NEJBQ0EsT0FBQSxNQUFBLFNBQUE7OzZCQUVBOzRCQUNBLE1BQUEsU0FBQTs0QkFDQSxPQUFBLGVBQUE7a0RBQ0E7a0RBQ0E7a0RBQ0E7a0RBQ0E7Ozs7Z0JBSUE7Ozs7OztBQ3RHQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLFFBQUEsb0JBQUEsWUFBQSxtQkFBQSxVQUFBOzs7Ozs7QUNIQSxDQUFBLFlBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsa0JBQUEsVUFBQSxZQUFBOztDQUVBLFNBQUEsVUFBQSxDQUFBLFlBQUE7O0NBRUEsU0FBQSxTQUFBLFVBQUEsY0FBQTtFQUNBLE9BQUE7R0FDQSxVQUFBO0dBQ0EsU0FBQTtHQUNBLFlBQUE7R0FDQSxhQUFBO0dBQ0EsTUFBQTs7O0VBR0EsU0FBQSxxQkFBQSxRQUFBLFNBQUEsUUFBQTs7Ozs7QUNoQkEsQ0FBQSxXQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsa0RBQUEsU0FBQSxRQUFBLFNBQUEsVUFBQTtFQUNBLE9BQUEsT0FBQTtFQUNBLE9BQUEsV0FBQTtFQUNBLE9BQUEsaUJBQUE7RUFDQSxPQUFBLGdCQUFBO0VBQ0EsT0FBQSxjQUFBO0VBQ0EsT0FBQSxhQUFBO0VBQ0EsT0FBQSxnQkFBQTtFQUNBLE9BQUEsYUFBQTtFQUNBOztFQUVBLFNBQUEsV0FBQTtHQUNBLE9BQUE7R0FDQSxPQUFBO0dBQ0EsT0FBQTtHQUNBLE9BQUE7R0FDQSxPQUFBO0dBQ0EsT0FBQSxPQUFBLHVCQUFBLFNBQUEsU0FBQSxTQUFBO0lBQ0EsSUFBQSxZQUFBLFNBQUE7S0FDQSxPQUFBOztJQUVBLE9BQUE7SUFDQSxPQUFBO0lBQ0EsT0FBQTtJQUNBLE9BQUE7O0dBRUEsT0FBQSxPQUFBLFdBQUEsU0FBQSxHQUFBLEdBQUE7SUFDQSxJQUFBLE1BQUEsR0FBQTtLQUNBOztJQUVBLE9BQUE7Ozs7RUFJQSxTQUFBLGFBQUE7R0FDQSxPQUFBLE9BQUEsQ0FBQSxPQUFBO0dBQ0E7O0VBRUEsU0FBQSxjQUFBO0dBQ0EsSUFBQSxPQUFBO0dBQ0EsUUFBQSxRQUFBLE9BQUEsTUFBQSxTQUFBLE1BQUE7SUFDQSxLQUFBLE9BQUEsUUFBQSxZQUFBLFFBQUEsV0FBQSxLQUFBLE9BQUEsUUFBQSxZQUFBO0lBQ0EsS0FBQSxXQUFBLFNBQUEsS0FBQTs7R0FFQSxJQUFBLFNBQUEsUUFBQSxXQUFBLE9BQUEsS0FBQSxDQUFBLE9BQUEsUUFBQSxZQUFBLE1BQUEsVUFBQTtHQUNBLEtBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxPQUFBLFFBQUEsS0FBQTtJQUNBLElBQUEsT0FBQSxHQUFBLE9BQUEsT0FBQSxRQUFBLEtBQUE7S0FDQSxPQUFBLElBQUE7OztHQUdBLE9BQUEsUUFBQSxPQUFBLFFBQUEsWUFBQSxLQUFBLFdBQUE7O0VBRUEsU0FBQSxXQUFBLFFBQUE7R0FDQSxJQUFBLFNBQUEsUUFBQSxXQUFBLE9BQUEsS0FBQSxDQUFBLE9BQUEsUUFBQSxZQUFBLE1BQUEsVUFBQTtHQUNBLElBQUEsT0FBQTtHQUNBLFFBQUEsUUFBQSxRQUFBLFNBQUEsTUFBQSxJQUFBO0lBQ0EsR0FBQSxLQUFBLFdBQUEsUUFBQSxRQUFBO0tBQ0EsT0FBQTs7O0dBR0EsT0FBQSxLQUFBOztFQUVBLFNBQUEsZ0JBQUE7R0FDQSxPQUFBLFVBQUEsQ0FBQSxPQUFBLFFBQUEsUUFBQSxZQUFBOzs7RUFHQSxTQUFBLGdCQUFBO0dBQ0EsT0FBQSxnQkFBQTtJQUNBLE9BQUEsT0FBQSxRQUFBLFFBQUEsWUFBQTtJQUNBLE9BQUEsT0FBQSxRQUFBLFFBQUEsWUFBQTtJQUNBLFVBQUE7SUFDQSxPQUFBO0tBQ0EsS0FBQTs7O0dBR0EsT0FBQSxtQkFBQTtJQUNBLE9BQUEsT0FBQSxRQUFBLFFBQUEsWUFBQTtJQUNBLE9BQUEsT0FBQSxRQUFBLFFBQUEsWUFBQTtJQUNBLFVBQUE7SUFDQSxPQUFBO0tBQ0EsS0FBQTs7Ozs7RUFLQSxTQUFBLFdBQUE7R0FDQSxPQUFBLFFBQUE7SUFDQSxTQUFBO0tBQ0EsT0FBQTtNQUNBLE1BQUE7O01BRUEsZ0JBQUE7TUFDQSxRQUFBO09BQ0EsS0FBQTtPQUNBLE9BQUE7T0FDQSxRQUFBO09BQ0EsTUFBQTs7TUFFQSxHQUFBLFNBQUEsR0FBQTtPQUNBLE9BQUEsRUFBQTs7TUFFQSxHQUFBLFNBQUEsR0FBQTtPQUNBLE9BQUEsRUFBQTs7TUFFQSxZQUFBO01BQ0EsV0FBQTtNQUNBLG9CQUFBO01BQ0EseUJBQUE7TUFDQSxRQUFBLENBQUEsS0FBQTtNQUNBLE9BQUE7T0FDQSxXQUFBOztNQUVBLE9BQUE7T0FDQSxXQUFBO09BQ0EsbUJBQUE7O01BRUEsUUFBQTtPQUNBLFlBQUE7T0FDQSxRQUFBO1FBQ0EsUUFBQTs7O01BR0EsT0FBQTtPQUNBLGFBQUE7Ozs7SUFJQSxNQUFBOztHQUVBLE9BQUEsT0FBQTs7O0VBR0EsU0FBQSxpQkFBQTtHQUNBLElBQUEsWUFBQTtHQUNBLFFBQUEsUUFBQSxPQUFBLFFBQUEsWUFBQSxVQUFBLFNBQUEsTUFBQSxLQUFBO0lBQ0EsSUFBQSxRQUFBO0tBQ0EsS0FBQSxLQUFBO0tBQ0EsT0FBQSxLQUFBO0tBQ0EsUUFBQTs7SUFFQSxRQUFBLFFBQUEsT0FBQSxRQUFBLEtBQUEsU0FBQSxNQUFBO0tBQ0EsTUFBQSxPQUFBLEtBQUE7TUFDQSxHQUFBLEtBQUE7TUFDQSxHQUFBLEtBQUEsS0FBQTs7O0lBR0EsVUFBQSxLQUFBOztHQUVBLE9BQUEsTUFBQSxPQUFBOzs7Ozs7QUN2SkEsQ0FBQSxZQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGtCQUFBLFVBQUEsWUFBQSxZQUFBO0VBQ0EsSUFBQSxXQUFBLFVBQUE7SUFDQSxPQUFBO01BQ0EsTUFBQTs7O0VBR0EsT0FBQTtHQUNBLFVBQUE7O0dBRUEsWUFBQTtHQUNBLE9BQUE7SUFDQSxNQUFBOztHQUVBLE1BQUEsVUFBQSxRQUFBLFNBQUEsUUFBQTtJQUNBLElBQUEsVUFBQSxRQUFBLE9BQUEsWUFBQTtJQUNBLE9BQUE7SUFDQSxPQUFBO0lBQ0EsSUFBQSxRQUFBO0tBQ0EsU0FBQTtLQUNBLFNBQUEsQ0FBQSxTQUFBO0tBQ0EsSUFBQSxHQUFBLE1BQUEsU0FBQSxNQUFBLENBQUEsR0FBQSxJQUFBLEtBQUE7S0FDQSxJQUFBLEdBQUEsTUFBQSxNQUFBLFNBQUEsS0FBQSxPQUFBLENBQUEsR0FBQSxJQUFBLE1BQUEsQ0FBQSxHQUFBOzs7S0FHQSxVQUFBO0tBQ0EsV0FBQTtLQUNBLGNBQUE7O0lBRUEsSUFBQSxNQUFBLEdBQUEsT0FBQSxRQUFBOzs7SUFHQSxJQUFBLE1BQUEsSUFBQSxPQUFBO01BQ0EsS0FBQSxTQUFBLFFBQUEsVUFBQTtNQUNBLEtBQUEsVUFBQSxTQUFBLFVBQUE7TUFDQSxPQUFBO01BQ0EsS0FBQSxhQUFBLGVBQUEsQ0FBQSxTQUFBLFNBQUEsU0FBQSxXQUFBOzs7Ozs7OztJQVFBLElBQUEsWUFBQSxHQUFBLE9BQUE7TUFDQSxLQUFBO01BQ0EsTUFBQSxVQUFBLEdBQUE7TUFDQSxPQUFBOzs7SUFHQSxJQUFBLE1BQUEsR0FBQSxJQUFBO01BQ0EsV0FBQSxVQUFBLEdBQUE7TUFDQSxPQUFBLEtBQUEsSUFBQSxHQUFBLEtBQUEsSUFBQSxJQUFBLEtBQUEsSUFBQSxFQUFBLEVBQUE7O01BRUEsU0FBQSxVQUFBLEdBQUE7TUFDQSxPQUFBLEtBQUEsSUFBQSxHQUFBLEtBQUEsSUFBQSxJQUFBLEtBQUEsSUFBQSxFQUFBLEVBQUEsSUFBQSxFQUFBOztNQUVBLFlBQUEsVUFBQSxHQUFBO01BQ0EsT0FBQSxLQUFBLElBQUEsR0FBQSxFQUFBLElBQUEsRUFBQSxFQUFBLEtBQUEsRUFBQTs7TUFFQSxZQUFBLFVBQUEsR0FBQTtNQUNBLE9BQUEsS0FBQSxJQUFBLEdBQUEsRUFBQSxFQUFBLElBQUEsRUFBQTs7O0lBR0EsSUFBQSxXQUFBO0tBQ0EsV0FBQTtLQUNBLFdBQUE7S0FDQSxXQUFBOzs7SUFHQSxJQUFBLFFBQUEsVUFBQSxNQUFBLE9BQUE7O0lBRUEsSUFBQSxPQUFBLElBQUEsVUFBQSxRQUFBLEtBQUE7SUFDQSxLQUFBLFFBQUEsT0FBQTtNQUNBLEtBQUEsTUFBQSxVQUFBLEdBQUEsR0FBQTtNQUNBLE9BQUEsVUFBQTs7TUFFQSxLQUFBLEtBQUE7TUFDQSxLQUFBLGFBQUE7TUFDQSxLQUFBLFNBQUEsVUFBQSxHQUFBO01BQ0EsT0FBQSxFQUFBLFFBQUEsV0FBQTs7TUFFQSxNQUFBLFFBQUE7TUFDQSxHQUFBLFNBQUE7O0lBRUEsSUFBQSxPQUFBLElBQUEsVUFBQSxRQUFBLEtBQUE7SUFDQSxJQUFBLFlBQUEsS0FBQSxRQUFBLE9BQUE7TUFDQSxNQUFBLGdCQUFBO01BQ0EsS0FBQSxlQUFBLFVBQUEsR0FBQTtNQUNBLElBQUEsRUFBQTtPQUNBLE9BQUE7OztPQUdBLE9BQUE7O01BRUEsS0FBQSxNQUFBLFVBQUEsR0FBQTtNQUNBLE9BQUEsVUFBQSxFQUFBOztNQUVBLEtBQUEsU0FBQSxVQUFBLEdBQUE7TUFDQSxPQUFBOztNQUVBLEtBQUEsTUFBQSxVQUFBLEdBQUE7TUFDQSxPQUFBLEVBQUEsUUFBQSxTQUFBOztNQUVBLEtBQUEsYUFBQSxVQUFBLEdBQUE7TUFDQSxJQUFBLFlBQUEsQ0FBQSxFQUFBLFFBQUEsSUFBQSxNQUFBLEtBQUEsU0FBQTtPQUNBLGNBQUEsRUFBQSxJQUFBLE1BQUEsSUFBQSxDQUFBO09BQ0EsUUFBQSxFQUFBLEVBQUEsSUFBQSxFQUFBLEtBQUEsS0FBQSxNQUFBLEtBQUEsS0FBQSxNQUFBLFlBQUEsYUFBQTtPQUNBLFNBQUEsU0FBQSxZQUFBLENBQUEsS0FBQTtPQUNBLFNBQUEsQ0FBQSxFQUFBLEVBQUEsS0FBQSxlQUFBO09BQ0EsWUFBQSxRQUFBLEtBQUEsQ0FBQSxNQUFBO01BQ0EsSUFBQSxFQUFBLFFBQUEsWUFBQSxFQUFBLFFBQUEsVUFBQSxVQUFBO01BQ0EsSUFBQSxFQUFBLFNBQUEsR0FBQTtPQUNBLFNBQUEsQ0FBQTtPQUNBLFNBQUE7T0FDQSxXQUFBO2FBQ0EsSUFBQSxFQUFBLFNBQUEsR0FBQSxVQUFBLENBQUE7V0FDQSxJQUFBLEVBQUEsU0FBQSxHQUFBLFVBQUEsQ0FBQTtXQUNBLElBQUEsRUFBQSxTQUFBLEdBQUEsVUFBQTtNQUNBLE9BQUEsWUFBQSxTQUFBLGdCQUFBLFNBQUEsYUFBQSxXQUFBOztNQUVBLEdBQUEsU0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQStCQSxVQUFBLE9BQUE7TUFDQSxLQUFBLEtBQUE7TUFDQSxLQUFBLFVBQUEsR0FBQTs7TUFFQSxJQUFBLEVBQUEsU0FBQSxLQUFBLEVBQUEsUUFBQSxZQUFBLEVBQUEsUUFBQSxZQUFBLEVBQUEsUUFBQSxZQUFBLEVBQUEsUUFBQTtPQUNBLE9BQUEsRUFBQSxLQUFBLE1BQUEsS0FBQSxLQUFBLE9BQUEsRUFBQSxLQUFBLE1BQUEsS0FBQSxNQUFBOztPQUVBLE9BQUEsRUFBQSxLQUFBLE1BQUEsS0FBQTs7SUFFQSxVQUFBLE9BQUE7TUFDQSxLQUFBLEtBQUE7TUFDQSxLQUFBLE1BQUE7TUFDQSxLQUFBLFVBQUEsR0FBQTs7TUFFQSxJQUFBLEVBQUEsU0FBQSxLQUFBLEVBQUEsUUFBQSxZQUFBLEVBQUEsUUFBQSxZQUFBLEVBQUEsUUFBQSxZQUFBLEVBQUEsUUFBQTtPQUNBLE9BQUEsQ0FBQSxFQUFBLEtBQUEsTUFBQSxLQUFBLE1BQUEsTUFBQSxPQUFBLEVBQUEsS0FBQSxNQUFBLEtBQUEsTUFBQTs7T0FFQSxPQUFBLENBQUEsRUFBQSxLQUFBLE1BQUEsS0FBQSxNQUFBLE1BQUEsT0FBQSxFQUFBLEtBQUEsTUFBQSxLQUFBLE1BQUE7O0lBRUEsVUFBQSxPQUFBO01BQ0EsS0FBQSxLQUFBO01BQ0EsS0FBQSxNQUFBO01BQ0EsS0FBQSxVQUFBLEdBQUE7TUFDQSxJQUFBLEVBQUEsU0FBQSxLQUFBLEVBQUEsUUFBQSxZQUFBLEVBQUEsUUFBQSxZQUFBLEVBQUEsUUFBQSxZQUFBLEVBQUEsUUFBQTtPQUNBLE9BQUEsQ0FBQSxFQUFBLEtBQUEsTUFBQSxLQUFBLE1BQUEsTUFBQSxPQUFBLEVBQUEsS0FBQSxNQUFBLEtBQUEsTUFBQTs7T0FFQSxPQUFBLENBQUEsRUFBQSxLQUFBLE1BQUEsS0FBQSxNQUFBLE1BQUEsT0FBQSxFQUFBLEtBQUEsTUFBQSxLQUFBLE1BQUEsSUFBQTs7O0lBR0EsU0FBQSxNQUFBLEdBQUE7O0tBRUEsS0FBQTtPQUNBLFNBQUE7T0FDQSxVQUFBLEtBQUEsU0FBQTs7OztLQUlBLEtBQUEsTUFBQSxjQUFBLFVBQUEsR0FBQTtPQUNBLE9BQUEsV0FBQSxHQUFBLEtBQUEsT0FBQSxHQUFBLE9BQUEsTUFBQSxNQUFBOztPQUVBO09BQ0EsU0FBQTtPQUNBLFVBQUEsZUFBQSxVQUFBLEdBQUE7T0FDQSxPQUFBLFlBQUE7UUFDQSxJQUFBLEVBQUE7U0FDQSxPQUFBOzs7U0FHQSxPQUFBOzs7T0FHQSxVQUFBLGFBQUEsVUFBQSxHQUFBO09BQ0EsSUFBQSxZQUFBLENBQUEsRUFBQSxRQUFBLElBQUEsTUFBQSxLQUFBLFNBQUE7T0FDQSxPQUFBLFlBQUE7UUFDQSxJQUFBLFlBQUEsQ0FBQSxFQUFBLFFBQUEsSUFBQSxNQUFBLEtBQUEsU0FBQTtTQUNBLGNBQUEsRUFBQSxJQUFBLE1BQUEsSUFBQSxDQUFBO1NBQ0EsUUFBQSxFQUFBLEVBQUEsSUFBQSxFQUFBLEtBQUEsS0FBQSxNQUFBLEtBQUEsS0FBQSxNQUFBLFlBQUEsYUFBQTtTQUNBLFNBQUEsU0FBQSxZQUFBLENBQUEsS0FBQTtTQUNBLFNBQUEsQ0FBQSxFQUFBLEVBQUEsS0FBQSxlQUFBO1NBQ0EsWUFBQSxRQUFBLEtBQUEsQ0FBQSxNQUFBO1FBQ0EsSUFBQSxFQUFBLFFBQUEsWUFBQSxFQUFBLFFBQUEsVUFBQSxVQUFBO1FBQ0EsSUFBQSxFQUFBLFNBQUEsR0FBQTtTQUNBLFNBQUEsQ0FBQTtTQUNBLFNBQUE7U0FDQSxXQUFBO2VBQ0EsSUFBQSxFQUFBLFNBQUEsR0FBQSxVQUFBLENBQUE7YUFDQSxJQUFBLEVBQUEsU0FBQSxHQUFBLFVBQUEsQ0FBQTthQUNBLElBQUEsRUFBQSxTQUFBLEdBQUEsVUFBQTtRQUNBLE9BQUEsWUFBQSxTQUFBLGdCQUFBLFNBQUEsYUFBQSxXQUFBOzs7T0FHQSxNQUFBLGdCQUFBLFVBQUEsR0FBQTtPQUNBLE9BQUEsV0FBQSxHQUFBLEtBQUEsSUFBQTs7T0FFQSxLQUFBLE9BQUEsVUFBQSxHQUFBO09BQ0EsR0FBQSxPQUFBLE1BQUEsTUFBQSxjQUFBLFdBQUEsR0FBQSxLQUFBLE9BQUE7Ozs7O0lBS0EsU0FBQSxXQUFBLEdBQUEsR0FBQTtLQUNBLElBQUEsTUFBQSxHQUFBLE9BQUE7S0FDQSxJQUFBLEVBQUEsVUFBQTtNQUNBLE9BQUEsRUFBQSxTQUFBLEtBQUEsVUFBQSxHQUFBO09BQ0EsT0FBQSxXQUFBLEdBQUE7OztLQUdBLE9BQUE7OztJQUdBLFNBQUEsU0FBQSxHQUFBO0tBQ0EsT0FBQSxFQUFBO0tBQ0EsSUFBQSxFQUFBO01BQ0EsT0FBQSxFQUFBO1VBQ0E7TUFDQSxJQUFBLFlBQUE7O01BRUEsSUFBQSxJQUFBO01BQ0EsT0FBQSxFQUFBLE9BQUEsU0FBQSxNQUFBO09BQ0E7TUFDQSxJQUFBLGFBQUEsQ0FBQSxhQUFBLElBQUEsSUFBQTtNQUNBLE9BQUEsT0FBQSxNQUFBLEVBQUEsT0FBQSxPQUFBLEtBQUEsWUFBQSxLQUFBOzs7OztJQUtBLFNBQUEsU0FBQSxHQUFBO0tBQ0EsSUFBQSxLQUFBLEtBQUE7TUFDQSxLQUFBLEdBQUEsWUFBQSxFQUFBLFVBQUEsQ0FBQSxFQUFBLEdBQUEsRUFBQSxJQUFBLEVBQUEsS0FBQTtNQUNBLEtBQUEsR0FBQSxZQUFBLEVBQUEsVUFBQSxDQUFBLEVBQUEsR0FBQTtNQUNBLEtBQUEsR0FBQSxZQUFBLEVBQUEsU0FBQSxDQUFBLEVBQUEsSUFBQSxLQUFBLEdBQUE7O0tBRUEsT0FBQSxVQUFBLEdBQUE7TUFDQSxPQUFBLFVBQUEsR0FBQTtPQUNBLEVBQUEsT0FBQSxHQUFBO09BQ0EsRUFBQSxPQUFBLEdBQUEsSUFBQSxNQUFBLEdBQUE7T0FDQSxPQUFBLElBQUE7Ozs7O0lBS0EsU0FBQSxLQUFBLEdBQUE7S0FDQSxPQUFBLEVBQUEsV0FBQSxLQUFBLElBQUEsTUFBQSxNQUFBLEVBQUEsU0FBQSxJQUFBLFNBQUEsRUFBQSxJQUFBLEVBQUE7Ozs7Ozs7QUNwUkEsQ0FBQSxZQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsMkJBQUEsVUFBQSxRQUFBOztFQUVBLE9BQUEsV0FBQSxZQUFBO0dBQ0EsT0FBQSxRQUFBO0lBQ0EsU0FBQTtLQUNBLE9BQUE7TUFDQSxNQUFBO01BQ0EsUUFBQTtNQUNBLFlBQUE7T0FDQSxZQUFBO09BQ0EsU0FBQTtPQUNBLFVBQUE7T0FDQSxRQUFBO09BQ0EsTUFBQTtPQUNBLFlBQUE7T0FDQSxVQUFBO1FBQ0EsT0FBQTtRQUNBLFNBQUE7UUFDQSxVQUFBO1FBQ0EsUUFBQTs7O01BR0EsV0FBQTtPQUNBLFlBQUE7T0FDQSxXQUFBO09BQ0EsWUFBQTtPQUNBLGdCQUFBO09BQ0EsV0FBQTtPQUNBLGtCQUFBO09BQ0EsWUFBQTtPQUNBLFdBQUE7T0FDQSxhQUFBO09BQ0EsaUJBQUE7O09BRUEsVUFBQTtRQUNBLFFBQUE7UUFDQSxPQUFBOztPQUVBLFVBQUE7T0FDQSxRQUFBO09BQ0EsZUFBQTtPQUNBLE1BQUE7Ozs7SUFJQSxNQUFBOztHQUVBLE9BQUEsT0FBQTs7RUFFQSxJQUFBLFlBQUEsVUFBQSxNQUFBO0dBQ0EsSUFBQSxXQUFBO0dBQ0EsUUFBQSxRQUFBLE1BQUEsVUFBQSxNQUFBO0lBQ0EsSUFBQSxRQUFBO0tBQ0EsUUFBQSxLQUFBO0tBQ0EsUUFBQSxLQUFBO0tBQ0EsU0FBQSxLQUFBO0tBQ0EsWUFBQSxVQUFBLEtBQUE7O0lBRUEsR0FBQSxLQUFBLE1BQUE7S0FDQSxNQUFBLFFBQUEsS0FBQTs7SUFFQSxHQUFBLEtBQUEsS0FBQTtLQUNBLE1BQUEsT0FBQSxLQUFBOztJQUVBLFNBQUEsS0FBQTs7R0FFQSxPQUFBOztFQUVBLE9BQUEsaUJBQUEsWUFBQTtHQUNBLElBQUEsWUFBQTtJQUNBLFFBQUEsT0FBQSxLQUFBO0lBQ0EsU0FBQSxPQUFBLEtBQUE7SUFDQSxZQUFBLFVBQUEsT0FBQSxLQUFBO0lBQ0EsUUFBQTs7R0FFQSxPQUFBLE1BQUEsT0FBQTtHQUNBLE9BQUE7O0VBRUEsT0FBQSxPQUFBLFFBQUEsVUFBQSxHQUFBLEdBQUE7R0FDQSxJQUFBLENBQUEsR0FBQTtJQUNBOztHQUVBLE9BQUE7Ozs7O0FBS0EiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdHZhciBhcHAgPSBhbmd1bGFyLm1vZHVsZSgnYXBwJyxcblx0XHRbXG5cdFx0J2FwcC5jb250cm9sbGVycycsXG5cdFx0J2FwcC5maWx0ZXJzJyxcblx0XHQnYXBwLnNlcnZpY2VzJyxcblx0XHQnYXBwLmRpcmVjdGl2ZXMnLFxuXHRcdCdhcHAucm91dGVzJyxcblx0XHQnYXBwLmNvbmZpZydcblx0XHRdKTtcblxuXG5cdFx0YW5ndWxhci5tb2R1bGUoJ2FwcC5yb3V0ZXMnLCBbJ3VpLnJvdXRlcicsICduZ1N0b3JhZ2UnLCAnc2F0ZWxsaXplciddKTtcblx0XHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJywgWyduZ1Njcm9sbGJhcicsJ21kQ29sb3JQaWNrZXInLCduZ0FuaW1hdGUnLCd1aS50cmVlJywndG9hc3RyJywndWkucm91dGVyJywgJ21kLmRhdGEudGFibGUnLCAnbmdNYXRlcmlhbCcsICduZ1N0b3JhZ2UnLCAncmVzdGFuZ3VsYXInLCAnbmdNZEljb25zJywgJ2FuZ3VsYXItbG9hZGluZy1iYXInLCAnbmdNZXNzYWdlcycsICduZ1Nhbml0aXplJywgXCJsZWFmbGV0LWRpcmVjdGl2ZVwiLCdudmQzJ10pO1xuXHRcdGFuZ3VsYXIubW9kdWxlKCdhcHAuZmlsdGVycycsIFtdKTtcblx0XHRhbmd1bGFyLm1vZHVsZSgnYXBwLnNlcnZpY2VzJywgWydhbmd1bGFyLWNhY2hlJywndWkucm91dGVyJywgJ25nU3RvcmFnZScsICdyZXN0YW5ndWxhcicsICd0b2FzdHInXSk7XG5cdFx0YW5ndWxhci5tb2R1bGUoJ2FwcC5kaXJlY3RpdmVzJywgWyduZ01hdGVyaWFsJywnbmdQYXBhUGFyc2UnXSk7XG5cdFx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb25maWcnLCBbXSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLnJvdXRlcycpLmNvbmZpZyhmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlciwgJGxvY2F0aW9uUHJvdmlkZXIpIHtcblx0Ly9cdCRsb2NhdGlvblByb3ZpZGVyLmh0bWw1TW9kZSh0cnVlKTtcblx0XHR2YXIgZ2V0VmlldyA9IGZ1bmN0aW9uICh2aWV3TmFtZSkge1xuXHRcdFx0cmV0dXJuICcvdmlld3MvYXBwLycgKyB2aWV3TmFtZSArICcvJyArIHZpZXdOYW1lICsgJy5odG1sJztcblx0XHR9O1xuXG5cdFx0JHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSgnLycpO1xuXG5cdFx0JHN0YXRlUHJvdmlkZXJcblx0XHRcdC5zdGF0ZSgnYXBwJywge1xuXHRcdFx0XHRhYnN0cmFjdDogdHJ1ZSxcblx0XHRcdFx0dmlld3M6IHtcblx0XHRcdFx0XHRoZWFkZXI6IHtcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdoZWFkZXInKSxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdIZWFkZXJDdHJsJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0bWFpbjoge30sXG5cdFx0XHRcdFx0J21hcEAnOiB7XG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogZ2V0VmlldygnbWFwJyksXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiAnTWFwQ3RybCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyQXM6ICd2bSdcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cdFx0XHQuc3RhdGUoJ2FwcC5ob21lJyx7XG5cdFx0XHRcdHVybDonLycsXG5cdFx0XHRcdHZpZXdzOntcblx0XHRcdFx0XHQnc2lkZWJhckAnOntcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdob21lJyksXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiAnSG9tZUN0cmwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlckFzOiAndm0nXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdFx0LnN0YXRlKCdhcHAudXNlcicsIHtcblx0XHRcdFx0dXJsOiAnL3VzZXInLFxuXHRcdFx0XHRhYnN0cmFjdDogdHJ1ZVxuXG5cdFx0XHR9KVxuXHRcdFx0LnN0YXRlKCdhcHAudXNlci5sb2dpbicsIHtcblx0XHRcdFx0dXJsOiAnL2xvZ2luJyxcblx0XHRcdFx0dmlld3M6IHtcblx0XHRcdFx0XHQnbWFpbkAnOiB7XG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogZ2V0VmlldygnbG9naW4nKSxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdMb2dpbkN0cmwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlckFzOiAndm0nXG5cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLnVzZXIucHJvZmlsZScsIHtcblx0XHRcdFx0dXJsOiAnL215LXByb2ZpbGUnLFxuXHRcdFx0XHR2aWV3czoge1xuXHRcdFx0XHRcdCdtYWluQCc6IHtcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiBnZXRWaWV3KCd1c2VyJyksXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiAnVXNlckN0cmwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlckFzOiAndm0nLFxuXHRcdFx0XHRcdFx0cmVzb2x2ZToge1xuXHRcdFx0XHRcdFx0XHRwcm9maWxlOiBmdW5jdGlvbiAoRGF0YVNlcnZpY2UsICRhdXRoKSB7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIERhdGFTZXJ2aWNlLmdldE9uZSgnbWUnKS4kb2JqZWN0O1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdH0pXG5cdFx0XHQuc3RhdGUoJ2FwcC5pbmRleCcsIHtcblx0XHRcdFx0YWJzdHJhY3Q6IHRydWUsXG5cdFx0XHRcdHVybDogJy9pbmRleCdcblxuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLmluZGV4LmVkaXRvcicse1xuXHRcdFx0XHR1cmw6ICcvZWRpdG9yJyxcblx0XHRcdFx0dmlld3M6IHtcblx0XHRcdFx0XHQnc2lkZWJhckAnOiB7XG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogZ2V0VmlldygnaW5kZXhlZGl0b3InKSxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdJbmRleGVkaXRvckN0cmwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlckFzOiAndm0nXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdC8qdmlld3M6e1xuXHRcdFx0XHRcdCdpbmZvJzp7XG5cblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdCdtZW51Jzp7XG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDpnZXRWaWV3KCdpbmRleGVkaXRvcicpLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlcjogJ0luZGV4ZWRpdG9yQ3RybCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyQXM6ICd2bSdcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0qL1xuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLmluZGV4LmNyZWF0ZScsIHtcblx0XHRcdFx0dXJsOiAnL2NyZWF0ZScsXG5cdFx0XHRcdHZpZXdzOiB7XG5cdFx0XHRcdFx0J3NpZGViYXJAJzoge1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6IGdldFZpZXcoJ2luZGV4Y3JlYXRvcicpLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlcjogJ0luZGV4Y3JlYXRvckN0cmwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlckFzOiAndm0nXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdFx0LnN0YXRlKCdhcHAuaW5kZXguY3JlYXRlLmJhc2ljJywge1xuXHRcdFx0XHR1cmw6ICcvYmFzaWMnXG5cdFx0XHR9KVxuXHRcdFx0LnN0YXRlKCdhcHAuaW5kZXguY2hlY2snLCB7XG5cdFx0XHRcdHVybDogJy9jaGVja2luZycsXG5cdFx0XHRcdHZpZXdzOntcblx0XHRcdFx0XHQnbWFpbkAnOntcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOmdldFZpZXcoJ0luZGV4Q2hlY2snKSxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdJbmRleENoZWNrQ3RybCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyQXM6ICd2bSdcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdCdzaWRlYmFyQCc6IHtcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdpbmRleGNyZWF0b3InKSxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdJbmRleGNyZWF0b3JDdHJsJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLmluZGV4Lm1ldGEnLCB7XG5cdFx0XHRcdHVybDogJy9hZGRpbmctbWV0YS1kYXRhJyxcblx0XHRcdFx0dmlld3M6e1xuXHRcdFx0XHRcdCdtYWluQCc6e1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6Z2V0VmlldygnaW5kZXhNZXRhJyksXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiAnSW5kZXhNZXRhQ3RybCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyQXM6ICd2bSdcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdCdzaWRlYmFyQCc6e1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICcvdmlld3MvYXBwL2luZGV4TWV0YS9pbmRleE1ldGFNZW51Lmh0bWwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlcjogJ0luZGV4TWV0YU1lbnVDdHJsJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLmluZGV4LmNyZWF0ZS5maW5hbCcsIHtcblx0XHRcdFx0dXJsOiAnL2FkZGluZy1tZXRhLWRhdGEnXG5cdFx0XHR9KVxuXHRcdFx0LnN0YXRlKCdhcHAuaW5kZXguc2hvdycsIHtcblx0XHRcdFx0dXJsOiAnLzppbmRleCcsXG5cdFx0XHRcdHZpZXdzOiB7XG5cdFx0XHRcdFx0J3NpZGViYXJAJzoge1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICcvdmlld3MvYXBwL2luZGV4L2luZm8uaHRtbCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiAnSW5kZXhDdHJsJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJyxcblx0XHRcdFx0XHRcdHJlc29sdmU6IHtcblx0XHRcdFx0XHRcdFx0ZGF0YTogZnVuY3Rpb24gKEluZGl6ZXNTZXJ2aWNlLCAkc3RhdGVQYXJhbXMpIHtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gSW5kaXplc1NlcnZpY2UuZmV0Y2hEYXRhKCRzdGF0ZVBhcmFtcy5pbmRleCk7XG5cdFx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRcdGNvdW50cmllczogZnVuY3Rpb24oQ291bnRyaWVzU2VydmljZSl7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIENvdW50cmllc1NlcnZpY2UuZ2V0RGF0YSgpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHQnc2VsZWN0ZWQnOiB7XG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogJy92aWV3cy9hcHAvaW5kZXgvc2VsZWN0ZWQuaHRtbCcsXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdFx0LnN0YXRlKCdhcHAuaW5kZXguc2hvdy5pbmZvJywge1xuXHRcdFx0XHQgdXJsOicvaW5mbycsXG5cdFx0XHRcdCB2aWV3czp7XG5cdFx0XHRcdFx0ICdtYWluQCc6e1xuXHRcdFx0XHRcdFx0IGNvbnRyb2xsZXI6J0luZGV4aW5mb0N0cmwnLFxuXHRcdFx0XHRcdFx0IGNvbnRyb2xsZXJBczogJ3ZtJyxcblx0XHRcdFx0XHRcdCBcdHRlbXBsYXRlVXJsOmdldFZpZXcoJ2luZGV4aW5mbycpXG5cdFx0XHRcdFx0IH1cblx0XHRcdFx0IH1cblx0XHRcdH0pXG5cdFx0XHQuc3RhdGUoJ2FwcC5pbmRleC5zaG93LnNlbGVjdGVkJywge1xuXHRcdFx0XHR1cmw6ICcvOml0ZW0nLFxuXHRcdFx0XHQvKnZpZXdzOntcblx0XHRcdFx0XHQnc2VsZWN0ZWQnOntcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdzZWxlY3RlZCcpLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlcjogJ1NlbGVjdGVkQ3RybCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyQXM6ICd2bScsXG5cdFx0XHRcdFx0XHRyZXNvbHZlOntcblx0XHRcdFx0XHRcdFx0Z2V0Q291bnRyeTogZnVuY3Rpb24oRGF0YVNlcnZpY2UsICRzdGF0ZVBhcmFtcyl7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIERhdGFTZXJ2aWNlLmdldE9uZSgnbmF0aW9ucycsICRzdGF0ZVBhcmFtcy5pdGVtKS4kb2JqZWN0O1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9Ki9cblx0XHRcdH0pXG5cdFx0XHQuc3RhdGUoJ2FwcC5pbmRleC5zaG93LnNlbGVjdGVkLmNvbXBhcmUnLCB7XG5cdFx0XHRcdHVybDogJy9jb21wYXJlLzpjb3VudHJpZXMnXG5cdFx0XHR9KVxuXHRcdFx0LnN0YXRlKCdhcHAuaW1wb3J0Y3N2Jywge1xuXHRcdFx0XHR1cmw6ICcvaW1wb3J0ZXInLFxuXHRcdFx0XHRkYXRhOiB7XG5cdFx0XHRcdFx0cGFnZU5hbWU6ICdJbXBvcnQgQ1NWJ1xuXHRcdFx0XHR9LFxuXHRcdFx0XHR2aWV3czoge1xuXHRcdFx0XHRcdCdtYWluQCc6IHtcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdpbXBvcnRjc3YnKVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0J21hcCc6IHt9XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXG5cblxuXHR9KTtcbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5yb3V0ZXMnKS5ydW4oZnVuY3Rpb24oJHJvb3RTY29wZSwgJG1kU2lkZW5hdil7XG5cdFx0JHJvb3RTY29wZS4kb24oXCIkc3RhdGVDaGFuZ2VTdGFydFwiLCBmdW5jdGlvbihldmVudCwgdG9TdGF0ZSwgdG9QYXJhbXMsIGZyb21TdGF0ZSxmcm9tUGFyYW1zKXtcblx0XHRcdGlmICh0b1N0YXRlLmRhdGEgJiYgdG9TdGF0ZS5kYXRhLnBhZ2VOYW1lKXtcblx0XHRcdFx0JHJvb3RTY29wZS5jdXJyZW50X3BhZ2UgPSB0b1N0YXRlLmRhdGEucGFnZU5hbWU7XG5cdFx0XHR9XG5cdFx0XHQkcm9vdFNjb3BlLnByZXZpb3VzUGFnZSA9IHtzdGF0ZTpmcm9tU3RhdGUsIHBhcmFtczpmcm9tUGFyYW1zfTtcblx0XHRcdCRyb290U2NvcGUuc3RhdGVJc0xvYWRpbmcgPSB0cnVlO1xuXHRcdH0pO1xuXHRcdCRyb290U2NvcGUuJG9uKFwiJHZpZXdDb250ZW50TG9hZGVkXCIsIGZ1bmN0aW9uKGV2ZW50LCB0b1N0YXRlKXtcblxuXHRcdH0pO1xuXHRcdCRyb290U2NvcGUuJG9uKFwiJHN0YXRlQ2hhbmdlU3VjY2Vzc1wiLCBmdW5jdGlvbihldmVudCwgdG9TdGF0ZSl7XG5cdFx0XHQkcm9vdFNjb3BlLnN0YXRlSXNMb2FkaW5nID0gZmFsc2U7XG5cdFx0fSk7XG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb25maWcnKS5jb25maWcoZnVuY3Rpb24gKCRhdXRoUHJvdmlkZXIpe1xuICAgICAgICAvLyBTYXRlbGxpemVyIGNvbmZpZ3VyYXRpb24gdGhhdCBzcGVjaWZpZXMgd2hpY2ggQVBJXG4gICAgICAgIC8vIHJvdXRlIHRoZSBKV1Qgc2hvdWxkIGJlIHJldHJpZXZlZCBmcm9tXG4gICAgICAgICRhdXRoUHJvdmlkZXIubG9naW5VcmwgPSAnL2FwaS9hdXRoZW50aWNhdGUvYXV0aCc7XG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29uZmlnJykuY29uZmlnKGZ1bmN0aW9uIChjZnBMb2FkaW5nQmFyUHJvdmlkZXIpe1xuXHRcdGNmcExvYWRpbmdCYXJQcm92aWRlci5pbmNsdWRlU3Bpbm5lciA9IGZhbHNlO1xuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbmZpZycpLmNvbmZpZyggZnVuY3Rpb24oUmVzdGFuZ3VsYXJQcm92aWRlcikge1xuXHRcdFJlc3Rhbmd1bGFyUHJvdmlkZXJcblx0XHQuc2V0QmFzZVVybCgnL2FwaS8nKVxuXHRcdC5zZXREZWZhdWx0SGVhZGVycyh7IGFjY2VwdDogXCJhcHBsaWNhdGlvbi94LmxhcmF2ZWwudjEranNvblwiIH0pXG5cdFx0LmFkZFJlc3BvbnNlSW50ZXJjZXB0b3IoZnVuY3Rpb24oZGF0YSxvcGVyYXRpb24sd2hhdCx1cmwscmVzcG9uc2UsZGVmZXJyZWQpIHtcbiAgICAgICAgdmFyIGV4dHJhY3RlZERhdGE7XG4gICAgICAgIGV4dHJhY3RlZERhdGEgPSBkYXRhLmRhdGE7XG4gICAgICAgIGlmIChkYXRhLm1ldGEpIHtcbiAgICAgICAgICAgIGV4dHJhY3RlZERhdGEuX21ldGEgPSBkYXRhLm1ldGE7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGRhdGEuaW5jbHVkZWQpIHsgXG4gICAgICAgICAgICBleHRyYWN0ZWREYXRhLl9pbmNsdWRlZCA9IGRhdGEuaW5jbHVkZWQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGV4dHJhY3RlZERhdGE7XG4gICAgfSk7XG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29uZmlnJykuY29uZmlnKGZ1bmN0aW9uKCRtZFRoZW1pbmdQcm92aWRlcikge1xuXHRcdC8qIEZvciBtb3JlIGluZm8sIHZpc2l0IGh0dHBzOi8vbWF0ZXJpYWwuYW5ndWxhcmpzLm9yZy8jL1RoZW1pbmcvMDFfaW50cm9kdWN0aW9uICovXG4vKlx0dmFyIG5lb25UZWFsTWFwID0gJG1kVGhlbWluZ1Byb3ZpZGVyLmV4dGVuZFBhbGV0dGUoJ3RlYWwnLCB7XG4gICAgJzUwMCc6ICcwMGNjYWEnLFxuXHRcdCdBMjAwJzogJzAwY2NhYSdcbiAgfSk7XG5cdHZhciB3aGl0ZU1hcCA9ICRtZFRoZW1pbmdQcm92aWRlci5leHRlbmRQYWxldHRlKCd0ZWFsJywge1xuICAgICc1MDAnOiAnMDBjY2FhJyxcblx0XHQnQTIwMCc6ICcjZmZmJ1xuICB9KTtcblx0dmFyIGJsdWVNYXAgPSAkbWRUaGVtaW5nUHJvdmlkZXIuZXh0ZW5kUGFsZXR0ZSgnYmx1ZScsIHtcbiAgICAnNTAwJzogJyMwMDZiYjknLFxuXHRcdCdBMjAwJzogJyMwMDZiYjknXG4gIH0pO1xuXHQkbWRUaGVtaW5nUHJvdmlkZXIuZGVmaW5lUGFsZXR0ZSgnbmVvblRlYWwnLCBuZW9uVGVhbE1hcCk7XG5cdCRtZFRoZW1pbmdQcm92aWRlci5kZWZpbmVQYWxldHRlKCd3aGl0ZVRlYWwnLCB3aGl0ZU1hcCk7XG5cdCRtZFRoZW1pbmdQcm92aWRlci5kZWZpbmVQYWxldHRlKCdibHVlcicsIGJsdWVNYXApO1xuXHRcdCRtZFRoZW1pbmdQcm92aWRlci50aGVtZSgnZGVmYXVsdCcpXG5cdFx0LnByaW1hcnlQYWxldHRlKCdsaWdodC1ibHVlJylcblx0XHQuYWNjZW50UGFsZXR0ZSgnYmx1ZXInKTsqL1xuXHRcdCRtZFRoZW1pbmdQcm92aWRlci50aGVtZSgnZGVmYXVsdCcpXG5cdC5wcmltYXJ5UGFsZXR0ZSgnaW5kaWdvJylcblx0LmFjY2VudFBhbGV0dGUoJ2dyZXknKVxuXHQud2FyblBhbGV0dGUoJ3JlZCcpO1xuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb25maWcnKS5jb25maWcoZnVuY3Rpb24odG9hc3RyQ29uZmlnKXtcbiAgICAgICAgLy9cbiAgICAgICAgYW5ndWxhci5leHRlbmQodG9hc3RyQ29uZmlnLCB7XG4gICAgICAgICAgYXV0b0Rpc21pc3M6IGZhbHNlLFxuICAgICAgICAgIGNvbnRhaW5lcklkOiAndG9hc3QtY29udGFpbmVyJyxcbiAgICAgICAgICBtYXhPcGVuZWQ6IDAsXG4gICAgICAgICAgbmV3ZXN0T25Ub3A6IHRydWUsXG4gICAgICAgICAgcG9zaXRpb25DbGFzczogJ3RvYXN0LWJvdHRvbS1yaWdodCcsXG4gICAgICAgICAgcHJldmVudER1cGxpY2F0ZXM6IGZhbHNlLFxuICAgICAgICAgIHByZXZlbnRPcGVuRHVwbGljYXRlczogZmFsc2UsXG4gICAgICAgICAgdGFyZ2V0OiAnYm9keScsXG4gICAgICAgICAgY2xvc2VCdXR0b246IHRydWVcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuZmlsdGVycycpLmZpbHRlciggJ2FscGhhbnVtJywgZnVuY3Rpb24oKXtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCBpbnB1dCApe1xuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIGlmICggIWlucHV0ICl7XG4gICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGlucHV0LnJlcGxhY2UoLyhbXjAtOUEtWl0pL2csXCJcIik7XG5cbiAgICAgICAgfVxuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZmlsdGVycycpLmZpbHRlciggJ2NhcGl0YWxpemUnLCBmdW5jdGlvbigpe1xuXHRcdHJldHVybiBmdW5jdGlvbihpbnB1dCwgYWxsKSB7XG5cdFx0XHRyZXR1cm4gKCEhaW5wdXQpID8gaW5wdXQucmVwbGFjZSgvKFteXFxXX10rW15cXHMtXSopICovZyxmdW5jdGlvbih0eHQpe1xuXHRcdFx0XHRyZXR1cm4gdHh0LmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgdHh0LnN1YnN0cigxKS50b0xvd2VyQ2FzZSgpO1xuXHRcdFx0fSkgOiAnJztcblx0XHR9O1xuXHR9KTtcbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmZpbHRlcnMnKS5maWx0ZXIoJ2ZpbmRieW5hbWUnLCBmdW5jdGlvbiAoKSB7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uIChpbnB1dCwgbmFtZSwgZmllbGQpIHtcblx0XHRcdC8vXG4gICAgICB2YXIgZm91bmRzID0gW107XG5cdFx0XHR2YXIgaSA9IDAsXG5cdFx0XHRcdGxlbiA9IGlucHV0Lmxlbmd0aDtcblxuXHRcdFx0Zm9yICg7IGkgPCBsZW47IGkrKykge1xuXHRcdFx0XHRpZiAoaW5wdXRbaV1bZmllbGRdLnRvTG93ZXJDYXNlKCkuaW5kZXhPZihuYW1lLnRvTG93ZXJDYXNlKCkpID4gLTEpIHtcblx0XHRcdFx0XHQgZm91bmRzLnB1c2goaW5wdXRbaV0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gZm91bmRzO1xuXHRcdH1cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5maWx0ZXJzJykuZmlsdGVyKCAnaHVtYW5SZWFkYWJsZScsIGZ1bmN0aW9uKCl7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uIGh1bWFuaXplKHN0cikge1xuXHRcdFx0aWYgKCAhc3RyICl7XG5cdFx0XHRcdHJldHVybiAnJztcblx0XHRcdH1cblx0XHRcdHZhciBmcmFncyA9IHN0ci5zcGxpdCgnXycpO1xuXHRcdFx0Zm9yICh2YXIgaT0wOyBpPGZyYWdzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdGZyYWdzW2ldID0gZnJhZ3NbaV0uY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBmcmFnc1tpXS5zbGljZSgxKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBmcmFncy5qb2luKCcgJyk7XG5cdFx0fTtcblx0fSk7XG59KSgpOyIsIihmdW5jdGlvbigpe1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuZmlsdGVycycpLmZpbHRlcigndHJ1bmNhdGVDaGFyYWN0ZXJzJywgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGlucHV0LCBjaGFycywgYnJlYWtPbldvcmQpIHtcbiAgICAgICAgICAgIGlmIChpc05hTihjaGFycykpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaW5wdXQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoY2hhcnMgPD0gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpbnB1dCAmJiBpbnB1dC5sZW5ndGggPiBjaGFycykge1xuICAgICAgICAgICAgICAgIGlucHV0ID0gaW5wdXQuc3Vic3RyaW5nKDAsIGNoYXJzKTtcblxuICAgICAgICAgICAgICAgIGlmICghYnJlYWtPbldvcmQpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGxhc3RzcGFjZSA9IGlucHV0Lmxhc3RJbmRleE9mKCcgJyk7XG4gICAgICAgICAgICAgICAgICAgIC8vIEdldCBsYXN0IHNwYWNlXG4gICAgICAgICAgICAgICAgICAgIGlmIChsYXN0c3BhY2UgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbnB1dCA9IGlucHV0LnN1YnN0cigwLCBsYXN0c3BhY2UpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgd2hpbGUgKGlucHV0LmNoYXJBdChpbnB1dC5sZW5ndGgtMSkgPT09ICcgJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5wdXQgPSBpbnB1dC5zdWJzdHIoMCwgaW5wdXQubGVuZ3RoIC0gMSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIGlucHV0ICsgJy4uLic7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gaW5wdXQ7XG4gICAgICAgIH07XG4gICAgfSk7XG59KSgpOyIsIihmdW5jdGlvbigpe1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuZmlsdGVycycpLmZpbHRlcigndHJ1bmNhdGVXb3JkcycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChpbnB1dCwgd29yZHMpIHtcbiAgICAgICAgICAgIGlmIChpc05hTih3b3JkcykpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaW5wdXQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAod29yZHMgPD0gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpbnB1dCkge1xuICAgICAgICAgICAgICAgIHZhciBpbnB1dFdvcmRzID0gaW5wdXQuc3BsaXQoL1xccysvKTtcbiAgICAgICAgICAgICAgICBpZiAoaW5wdXRXb3Jkcy5sZW5ndGggPiB3b3Jkcykge1xuICAgICAgICAgICAgICAgICAgICBpbnB1dCA9IGlucHV0V29yZHMuc2xpY2UoMCwgd29yZHMpLmpvaW4oJyAnKSArICcuLi4nO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBpbnB1dDtcbiAgICAgICAgfTtcbiAgICB9KTtcbn0pKCk7IiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZmlsdGVycycpLmZpbHRlciggJ3RydXN0SHRtbCcsIGZ1bmN0aW9uKCAkc2NlICl7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uKCBodG1sICl7XG5cdFx0XHRyZXR1cm4gJHNjZS50cnVzdEFzSHRtbChodG1sKTtcblx0XHR9O1xuXHR9KTtcbn0pKCk7IiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZmlsdGVycycpLmZpbHRlcigndWNmaXJzdCcsIGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBmdW5jdGlvbiggaW5wdXQgKSB7XG5cdFx0XHRpZiAoICFpbnB1dCApe1xuXHRcdFx0XHRyZXR1cm4gbnVsbDtcblx0XHRcdH1cblx0XHRcdHJldHVybiBpbnB1dC5zdWJzdHJpbmcoMCwgMSkudG9VcHBlckNhc2UoKSArIGlucHV0LnN1YnN0cmluZygxKTtcblx0XHR9O1xuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5zZXJ2aWNlcycpLmZhY3RvcnkoJ1ZlY3RvcmxheWVyU2VydmljZScsIGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgcmV0dXJue1xuICAgICAgICAgIGtleXM6e1xuICAgICAgICAgICAgbWF6cGVuOid2ZWN0b3ItdGlsZXMtUTNfT3M1dycsXG4gICAgICAgICAgICBtYXBib3g6J3BrLmV5SjFJam9pYldGbmJtOXNieUlzSW1FaU9pSnVTRmRVWWtnNEluMC41SE95a0trMHBOUDFOM2lzZlBRR1RRJ1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZGF0YTp7XG4gICAgICAgICAgICBsYXllcjogJycsXG4gICAgICAgICAgICBuYW1lOicyM19jb3VudHJpZXMnLFxuICAgICAgICAgICAgaXNvMzonYWRtMF9hMycsXG4gICAgICAgICAgICBpc28yOidpc29fYTInLFxuICAgICAgICAgICAgaXNvOidpc29fYTInLFxuICAgICAgICAgICAgZmllbGRzOiBcImlkLGFkbWluLGFkbTBfYTMsd2JfYTMsc3VfYTMsaXNvX2EzLGlzb19hMixuYW1lLG5hbWVfbG9uZ1wiXG4gICAgICAgICAgfSxcbiAgICAgICAgICBzZXRMYXllcjogZnVuY3Rpb24obCl7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5kYXRhLmxheWVyID0gbDtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGdldExheWVyOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGF0YS5sYXllcjtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGdldE5hbWU6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5kYXRhLm5hbWU7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBmaWVsZHM6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGF0YS5maWVsZHM7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBpc286ZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmRhdGEuaXNvO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgaXNvMzogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5kYXRhLmlzbzM7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBpc28yOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmRhdGEuaXNvMjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5zZXJ2aWNlcycpLmZhY3RvcnkoJ0NvdW50cmllc1NlcnZpY2UnLCBmdW5jdGlvbihEYXRhU2VydmljZSl7XG4gICAgICAgIC8vXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgY291bnRyaWVzOiBbXSxcbiAgICAgICAgICBmZXRjaERhdGE6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jb3VudHJpZXMgPSBEYXRhU2VydmljZS5nZXRPbmUoJ2NvdW50cmllcy9pc29zJykuJG9iamVjdDtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGdldERhdGE6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBpZighdGhpcy5jb3VudHJpZXMubGVuZ3RoKXtcbiAgICAgICAgICAgICAgdGhpcy5mZXRjaERhdGEoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNvdW50cmllcztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5zZXJ2aWNlcycpLmZhY3RvcnkoJ0RhdGFTZXJ2aWNlJywgRGF0YVNlcnZpY2UpO1xuICAgIERhdGFTZXJ2aWNlLiRpbmplY3QgPSBbJ1Jlc3Rhbmd1bGFyJywndG9hc3RyJ107XG5cbiAgICBmdW5jdGlvbiBEYXRhU2VydmljZShSZXN0YW5ndWxhciwgdG9hc3RyKXtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBnZXRBbGw6IGdldEFsbCxcbiAgICAgICAgICBnZXRPbmU6IGdldE9uZSxcbiAgICAgICAgICBwb3N0OiBwb3N0XG4gICAgICAgIH07XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0QWxsKHJvdXRlKXtcbiAgICAgICAgICB2YXIgZGF0YSA9IFJlc3Rhbmd1bGFyLmFsbChyb3V0ZSkuZ2V0TGlzdCgpO1xuICAgICAgICAgICAgZGF0YS50aGVuKGZ1bmN0aW9uKCl7fSwgZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgICAgICAgIHRvYXN0ci5lcnJvcihkYXRhLnN0YXR1c1RleHQsICdDb25uZWN0aW9uIEVycm9yJyk7XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBnZXRPbmUocm91dGUsIGlkKXtcbiAgICAgICAgICByZXR1cm4gUmVzdGFuZ3VsYXIub25lKHJvdXRlLCBpZCkuZ2V0KCk7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gcG9zdChyb3V0ZSwgZGF0YSl7XG4gICAgICAgICAgcmV0dXJuIFJlc3Rhbmd1bGFyLmFsbChyb3V0ZSkucG9zdChkYXRhKTtcbiAgICAgICAgfVxuICAgIH1cblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZShcImFwcC5zZXJ2aWNlc1wiKS5mYWN0b3J5KCdEaWFsb2dTZXJ2aWNlJywgZnVuY3Rpb24oJG1kRGlhbG9nKXtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRmcm9tVGVtcGxhdGU6IGZ1bmN0aW9uKHRlbXBsYXRlLCAkc2NvcGUpe1xuXG5cdFx0XHRcdHZhciBvcHRpb25zID0ge1xuXHRcdFx0XHRcdHRlbXBsYXRlVXJsOiAnLi92aWV3cy9kaWFsb2dzLycgKyB0ZW1wbGF0ZSArICcvJyArIHRlbXBsYXRlICsgJy5odG1sJ1xuXHRcdFx0XHR9O1xuXG5cdFx0XHRcdGlmICgkc2NvcGUpe1xuXHRcdFx0XHRcdG9wdGlvbnMuc2NvcGUgPSAkc2NvcGUuJG5ldygpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuICRtZERpYWxvZy5zaG93KG9wdGlvbnMpO1xuXHRcdFx0fSxcblxuXHRcdFx0aGlkZTogZnVuY3Rpb24oKXtcblx0XHRcdFx0cmV0dXJuICRtZERpYWxvZy5oaWRlKCk7XG5cdFx0XHR9LFxuXG5cdFx0XHRhbGVydDogZnVuY3Rpb24odGl0bGUsIGNvbnRlbnQpe1xuXHRcdFx0XHQkbWREaWFsb2cuc2hvdyhcblx0XHRcdFx0XHQkbWREaWFsb2cuYWxlcnQoKVxuXHRcdFx0XHRcdFx0LnRpdGxlKHRpdGxlKVxuXHRcdFx0XHRcdFx0LmNvbnRlbnQoY29udGVudClcblx0XHRcdFx0XHRcdC5vaygnT2snKVxuXHRcdFx0XHQpO1xuXHRcdFx0fSxcblxuXHRcdFx0Y29uZmlybTogZnVuY3Rpb24odGl0bGUsIGNvbnRlbnQpIHtcblx0XHRcdFx0cmV0dXJuICRtZERpYWxvZy5zaG93KFxuXHRcdFx0XHRcdCRtZERpYWxvZy5jb25maXJtKClcblx0XHRcdFx0XHRcdC50aXRsZSh0aXRsZSlcblx0XHRcdFx0XHRcdC5jb250ZW50KGNvbnRlbnQpXG5cdFx0XHRcdFx0XHQub2soJ09rJylcblx0XHRcdFx0XHRcdC5jYW5jZWwoJ0NhbmNlbCcpXG5cdFx0XHRcdCk7XG5cdFx0XHR9XG5cdFx0fTtcblx0fSk7XG59KSgpOyIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5zZXJ2aWNlcycpLmZhY3RvcnkoJ0ljb25zU2VydmljZScsIGZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciB1bmljb2RlcyA9IHtcbiAgICAgICAgICAnZW1wdHknOiBcIlxcdWU2MDBcIixcbiAgICAgICAgICAnYWdyYXInOiBcIlxcdWU2MDBcIixcbiAgICAgICAgICAnYW5jaG9yJzogXCJcXHVlNjAxXCIsXG4gICAgICAgICAgJ2J1dHRlcmZseSc6IFwiXFx1ZTYwMlwiLFxuICAgICAgICAgICdlbmVyZ3knOlwiXFx1ZTYwM1wiLFxuICAgICAgICAgICdzaW5rJzogXCJcXHVlNjA0XCIsXG4gICAgICAgICAgJ21hbic6IFwiXFx1ZTYwNVwiLFxuICAgICAgICAgICdmYWJyaWMnOiBcIlxcdWU2MDZcIixcbiAgICAgICAgICAndHJlZSc6XCJcXHVlNjA3XCIsXG4gICAgICAgICAgJ3dhdGVyJzpcIlxcdWU2MDhcIlxuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZ2V0VW5pY29kZTogZnVuY3Rpb24oaWNvbil7XG4gICAgICAgICAgICByZXR1cm4gdW5pY29kZXNbaWNvbl07XG4gICAgICAgICAgfSxcbiAgICAgICAgICBnZXRMaXN0OmZ1bmN0aW9uKCl7XG4gICAgICAgICAgICByZXR1cm4gdW5pY29kZXM7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuc2VydmljZXMnKS5mYWN0b3J5KCdJbmRleFNlcnZpY2UnLCBmdW5jdGlvbihDYWNoZUZhY3RvcnksJHN0YXRlKXtcbiAgICAgICAgLy9cbiAgICAgICAgdmFyIHNlcnZpY2VEYXRhID0ge1xuICAgICAgICAgICAgZGF0YTogW10sXG4gICAgICAgICAgICBlcnJvcnM6IFtdLFxuICAgICAgICAgICAgbWV0YTp7XG4gICAgICAgICAgICAgIGlzb19maWVsZDogJycsXG4gICAgICAgICAgICAgIGNvdW50cnlfZmllbGQ6JycsXG4gICAgICAgICAgICAgIHllYXJfZmllbGQ6JycsXG4gICAgICAgICAgICAgIHRhYmxlOltdXG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIHN0b3JhZ2UsIGltcG9ydENhY2hlLCBpbmRpY2F0b3IsIGluZGljYXRvcnMgPSBbXTtcblxuICAgICAgICBpZiAoIUNhY2hlRmFjdG9yeS5nZXQoJ2ltcG9ydERhdGEnKSkge1xuICAgICAgICAgIGltcG9ydENhY2hlID0gQ2FjaGVGYWN0b3J5KCdpbXBvcnREYXRhJywge1xuICAgICAgICAgICAgY2FjaGVGbHVzaEludGVydmFsOiA2MCAqIDYwICogMTAwMCwgLy8gVGhpcyBjYWNoZSB3aWxsIGNsZWFyIGl0c2VsZiBldmVyeSBob3VyLlxuICAgICAgICAgICAgZGVsZXRlT25FeHBpcmU6ICdhZ2dyZXNzaXZlJywgLy8gSXRlbXMgd2lsbCBiZSBkZWxldGVkIGZyb20gdGhpcyBjYWNoZSByaWdodCB3aGVuIHRoZXkgZXhwaXJlLlxuICAgICAgICAgICAgc3RvcmFnZU1vZGU6ICdsb2NhbFN0b3JhZ2UnIC8vIFRoaXMgY2FjaGUgd2lsbCB1c2UgYGxvY2FsU3RvcmFnZWAuXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgc2VydmljZURhdGEgPSBpbXBvcnRDYWNoZS5nZXQoJ2RhdGFUb0ltcG9ydCcpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2V7XG4gICAgICAgICAgaW1wb3J0Q2FjaGUgPSBDYWNoZUZhY3RvcnkuZ2V0KCdpbXBvcnREYXRhJyk7XG4gICAgICAgICAgc3RvcmFnZSA9IGltcG9ydENhY2hlLmdldCgnZGF0YVRvSW1wb3J0Jyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBjbGVhcjpmdW5jdGlvbigpe1xuICAgICAgICAgICAgJHN0YXRlLmdvKCdhcHAuaW5kZXguY3JlYXRlJyk7XG4gICAgICAgICAgICBpZihDYWNoZUZhY3RvcnkuZ2V0KCdpbXBvcnREYXRhJykpe1xuICAgICAgICAgICAgICAgIGltcG9ydENhY2hlLnJlbW92ZSgnZGF0YVRvSW1wb3J0Jyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gc2VydmljZURhdGE9IHtcbiAgICAgICAgICAgICAgICBkYXRhOiBbXSxcbiAgICAgICAgICAgICAgICBlcnJvcnM6IFtdLFxuICAgICAgICAgICAgICAgIG1ldGE6e1xuICAgICAgICAgICAgICAgICAgaXNvX2ZpZWxkOiAnJyxcbiAgICAgICAgICAgICAgICAgIGNvdW50cnlfZmllbGQ6JycsXG4gICAgICAgICAgICAgICAgICB5ZWFyX2ZpZWxkOicnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGFkZERhdGE6ZnVuY3Rpb24oaXRlbSl7XG4gICAgICAgICAgICByZXR1cm4gc2VydmljZURhdGEuZGF0YS5wdXNoKGl0ZW0pO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgYWRkSW5kaWNhdG9yOiBmdW5jdGlvbihpdGVtKXtcbiAgICAgICAgICAgIHJldHVybiBpbmRpY2F0b3JzLnB1c2goaXRlbSk7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBzZXREYXRhOiBmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgICAgIHJldHVybiBzZXJ2aWNlRGF0YS5kYXRhID0gZGF0YTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIHNldElzb0ZpZWxkOiBmdW5jdGlvbihrZXkpe1xuICAgICAgICAgICAgcmV0dXJuIHNlcnZpY2VEYXRhLm1ldGEuaXNvX2ZpZWxkID0ga2V5O1xuICAgICAgICAgIH0sXG4gICAgICAgICAgc2V0Q291bnRyeUZpZWxkOiBmdW5jdGlvbihrZXkpe1xuICAgICAgICAgICAgcmV0dXJuIHNlcnZpY2VEYXRhLm1ldGEuY291bnRyeV9maWVsZCA9IGtleTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIHNldEVycm9yczogZnVuY3Rpb24oZXJyb3JzKXtcbiAgICAgICAgICAgIHJldHVybiBzZXJ2aWNlRGF0YS5lcnJvcnMgPSBlcnJvcnM7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBzZXRUb0xvY2FsU3RvcmFnZTogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIGltcG9ydENhY2hlLnB1dCgnZGF0YVRvSW1wb3J0JyxzZXJ2aWNlRGF0YSk7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBzZXRJbmRpY2F0b3I6IGZ1bmN0aW9uKGtleSwgaXRlbSl7XG4gICAgICAgICAgICByZXR1cm4gaW5kaWNhdG9yc1trZXldID0gaXRlbTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIHNldEFjdGl2ZUluZGljYXRvckRhdGE6IGZ1bmN0aW9uKGl0ZW0pe1xuICAgICAgICAgICAgcmV0dXJuIGluZGljYXRvciA9IGluZGljYXRvcnNbaW5kaWNhdG9ycy5pbmRleE9mKGluZGljYXRvcildID0gaXRlbTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGdldEZyb21Mb2NhbFN0b3JhZ2U6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICByZXR1cm4gc2VydmljZURhdGEgPSBpbXBvcnRDYWNoZS5nZXQoJ2RhdGFUb0ltcG9ydCcpO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZ2V0RGF0YTogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHJldHVybiBzZXJ2aWNlRGF0YS5kYXRhO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZ2V0TWV0YTogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHJldHVybiBzZXJ2aWNlRGF0YS5tZXRhO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZ2V0SXNvRmllbGQ6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICByZXR1cm4gc2VydmljZURhdGEubWV0YS5pc29fZmllbGQ7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBnZXRDb3VudHJ5RmllbGQ6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICByZXR1cm4gc2VydmljZURhdGEubWV0YS5jb3VudHJ5X2ZpZWxkO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZ2V0RXJyb3JzOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgcmV0dXJuIHNlcnZpY2VEYXRhLmVycm9ycztcbiAgICAgICAgICB9LFxuICAgICAgICAgIGdldEZpcnN0RW50cnk6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICByZXR1cm4gc2VydmljZURhdGEuZGF0YVswXTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGdldERhdGFTaXplOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgcmV0dXJuIHNlcnZpY2VEYXRhLmRhdGEubGVuZ3RoO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZ2V0SW5kaWNhdG9yOiBmdW5jdGlvbihrZXkpe1xuICAgICAgICAgICAgcmV0dXJuIGluZGljYXRvciA9IGluZGljYXRvcnNba2V5XTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGFjdGl2ZUluZGljYXRvcjogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHJldHVybiBpbmRpY2F0b3I7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLnNlcnZpY2VzJykuZmFjdG9yeSgnSW5kaXplc1NlcnZpY2UnLCBmdW5jdGlvbiAoRGF0YVNlcnZpY2UpIHtcblx0XHQvL1xuXHRcdHJldHVybiB7XG5cdFx0XHRpbmRleDoge1xuXHRcdFx0XHRkYXRhOiB7XG5cdFx0XHRcdFx0ZGF0YTogbnVsbCxcblx0XHRcdFx0XHRzdHJ1Y3R1cmU6IG51bGxcblx0XHRcdFx0fSxcblx0XHRcdFx0cHJvbWlzZXM6IHtcblx0XHRcdFx0XHRkYXRhOiBudWxsLFxuXHRcdFx0XHRcdHN0cnVjdHVyOiBudWxsXG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHRmZXRjaERhdGE6IGZ1bmN0aW9uKGluZGV4KSB7XG5cblx0XHRcdFx0dGhpcy5pbmRleC5wcm9taXNlcy5kYXRhID0gRGF0YVNlcnZpY2UuZ2V0QWxsKCdpbmRleC8nICsgaW5kZXggKyAnL3llYXIvbGF0ZXN0Jyk7XG5cdFx0XHRcdHRoaXMuaW5kZXgucHJvbWlzZXMuc3RydWN0dXJlID0gRGF0YVNlcnZpY2UuZ2V0T25lKCdpbmRleC8nICsgaW5kZXggKyAnL3N0cnVjdHVyZScpO1xuXHRcdFx0XHR0aGlzLmluZGV4LmRhdGEuZGF0YSA9IHRoaXMuaW5kZXgucHJvbWlzZXMuZGF0YS4kb2JqZWN0O1xuXHRcdFx0XHR0aGlzLmluZGV4LmRhdGEuc3RydWN0dXJlID0gdGhpcy5pbmRleC5wcm9taXNlcy5zdHJ1Y3R1cmUuJG9iamVjdDtcblx0XHRcdFx0cmV0dXJuIHRoaXMuaW5kZXg7XG5cdFx0XHR9LFxuXHRcdFx0Z2V0RGF0YTogZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5pbmRleC5kYXRhLmRhdGE7XG5cdFx0XHR9LFxuXHRcdFx0Z2V0U3RydWN0dXJlOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLmluZGV4LmRhdGEuc3RydWN0dXJlO1xuXHRcdFx0fSxcblx0XHRcdGdldERhdGFQcm9taXNlOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLmluZGV4LnByb21pc2VzLmRhdGE7XG5cdFx0XHR9LFxuXHRcdFx0Z2V0U3RydWN0dXJlUHJvbWlzZTogZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5pbmRleC5wcm9taXNlcy5zdHJ1Y3R1cmU7XG5cdFx0XHR9XG5cdFx0fVxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZShcImFwcC5zZXJ2aWNlc1wiKS5mYWN0b3J5KCdUb2FzdFNlcnZpY2UnLCBmdW5jdGlvbigkbWRUb2FzdCl7XG5cblx0XHR2YXIgZGVsYXkgPSA2MDAwLFxuXHRcdFx0cG9zaXRpb24gPSAndG9wIHJpZ2h0Jyxcblx0XHRcdGFjdGlvbiA9ICdPSyc7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0c2hvdzogZnVuY3Rpb24oY29udGVudCl7XG5cdFx0XHRcdGlmICghY29udGVudCl7XG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuICRtZFRvYXN0LnNob3coXG5cdFx0XHRcdFx0JG1kVG9hc3Quc2ltcGxlKClcblx0XHRcdFx0XHRcdC5jb250ZW50KGNvbnRlbnQpXG5cdFx0XHRcdFx0XHQucG9zaXRpb24ocG9zaXRpb24pXG5cdFx0XHRcdFx0XHQuYWN0aW9uKGFjdGlvbilcblx0XHRcdFx0XHRcdC5oaWRlRGVsYXkoZGVsYXkpXG5cdFx0XHRcdCk7XG5cdFx0XHR9LFxuXHRcdFx0ZXJyb3I6IGZ1bmN0aW9uKGNvbnRlbnQpe1xuXHRcdFx0XHRpZiAoIWNvbnRlbnQpe1xuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiAkbWRUb2FzdC5zaG93KFxuXHRcdFx0XHRcdCRtZFRvYXN0LnNpbXBsZSgpXG5cdFx0XHRcdFx0XHQuY29udGVudChjb250ZW50KVxuXHRcdFx0XHRcdFx0LnBvc2l0aW9uKHBvc2l0aW9uKVxuXHRcdFx0XHRcdFx0LnRoZW1lKCd3YXJuJylcblx0XHRcdFx0XHRcdC5hY3Rpb24oYWN0aW9uKVxuXHRcdFx0XHRcdFx0LmhpZGVEZWxheShkZWxheSlcblx0XHRcdFx0KTtcblx0XHRcdH1cblx0XHR9O1xuXHR9KTtcbn0pKCk7IiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignSW5kZXhDaGVja0N0cmwnLCBmdW5jdGlvbigkcm9vdFNjb3BlLCB0b2FzdHIsIERpYWxvZ1NlcnZpY2UsIERhdGFTZXJ2aWNlLCBJbmRleFNlcnZpY2Upe1xuICAgICAgICAvL1xuICAgICAgICAvLyRyb290U2NvcGUuc2lkZWJhck9wZW4gPSBmYWxzZTtcblxuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuICAgICAgICB2bS5kYXRhID0gW107XG4gICAgICAgIHZtLnNlbGVjdGVkID0gW107XG4gICAgICAgIHZtLmRlbGV0ZURhdGEgPSBkZWxldGVEYXRhO1xuICAgICAgICB2bS5kZWxldGVTZWxlY3RlZCA9IGRlbGV0ZVNlbGVjdGVkO1xuICAgICAgICB2bS5vbk9yZGVyQ2hhbmdlID0gb25PcmRlckNoYW5nZTtcbiAgICAgICAgdm0ub25QYWdpbmF0aW9uQ2hhbmdlID0gb25QYWdpbmF0aW9uQ2hhbmdlO1xuICAgICAgICB2bS5jaGVja0ZvckVycm9ycyA9IGNoZWNrRm9yRXJyb3JzO1xuICAgICAgICB2bS5jbGVhckVycm9ycyA9IGNsZWFyRXJyb3JzO1xuICAgICAgICB2bS5zaG93VXBsb2FkQ29udGFpbmVyID0gZmFsc2U7XG4gICAgICAgIHZtLmVkaXRDb2x1bW5EYXRhID0gZWRpdENvbHVtbkRhdGE7XG4gICAgICAgIHZtLmZldGNoSXNvID0gZmV0Y2hJc287XG4gICAgICAgIHZtLmVkaXRSb3cgPSBlZGl0Um93O1xuICAgICAgICB2bS5kYXRhID0gSW5kZXhTZXJ2aWNlLmdldERhdGEoKTtcbiAgICAgICAgdm0ubWV0YSA9IEluZGV4U2VydmljZS5nZXRNZXRhKCk7XG4gICAgICAgIHZtLmVycm9ycyA9IEluZGV4U2VydmljZS5nZXRFcnJvcnMoKTtcbiAgICAgICAgdm0ucXVlcnkgPSB7XG4gICAgICAgICAgZmlsdGVyOiAnJyxcbiAgICAgICAgICBvcmRlcjogJy1lcnJvcnMnLFxuICAgICAgICAgIGxpbWl0OiAxNSxcbiAgICAgICAgICBwYWdlOiAxXG4gICAgICAgIH07XG4gICAgICAgIHZtLm15RGF0YSA9IERhdGFTZXJ2aWNlLmdldEFsbCgnbWUvZGF0YScpO1xuICAgICAgICBhY3RpdmF0ZSgpO1xuXG4gICAgICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCl7XG4gICAgICAgICAgY2hlY2tNeURhdGEoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGNoZWNrTXlEYXRhKCl7XG4gICAgICAgICAgdm0uZXh0ZW5kaW5nQ2hvaWNlcyA9IFtdO1xuICAgICAgICAgIGlmKHZtLmRhdGEubGVuZ3RoKXtcbiAgICAgICAgICAgIHZtLm15RGF0YS50aGVuKGZ1bmN0aW9uKGltcG9ydHMpe1xuICAgICAgICAgICAgICBhbmd1bGFyLmZvckVhY2goaW1wb3J0cywgZnVuY3Rpb24oZW50cnkpe1xuICAgICAgICAgICAgICAgIHZhciBmb3VuZCA9IDA7XG4gICAgICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKHZtLmRhdGFbMF0ubWV0YS5maWVsZHMsIGZ1bmN0aW9uKGZpZWxkKXtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNvbHVtbnMgPSBKU09OLnBhcnNlKGVudHJ5Lm1ldGFfZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaChjb2x1bW5zLCBmdW5jdGlvbihjb2x1bW4pe1xuICAgICAgICAgICAgICAgICAgICAgIGlmKGNvbHVtbi5jb2x1bW4gPT0gZmllbGQgKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvdW5kKys7XG4gICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGlmKGZvdW5kID49IHZtLmRhdGFbMF0ubWV0YS5maWVsZHMubGVuZ3RoIC0gMil7XG4gICAgICAgICAgICAgICAgICB2bS5leHRlbmRpbmdDaG9pY2VzLnB1c2goZW50cnkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgaWYodm0uZXh0ZW5kaW5nQ2hvaWNlcy5sZW5ndGgpe1xuICAgICAgICAgICAgICAgIERpYWxvZ1NlcnZpY2UuZnJvbVRlbXBsYXRlKCdleHRlbmREYXRhJywgJHNjb3BlKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBzZWFyY2gocHJlZGljYXRlKSB7XG4gICAgICAgICAgdm0uZmlsdGVyID0gcHJlZGljYXRlO1xuICAgICAgICB9O1xuICAgICAgICBmdW5jdGlvbiBvbk9yZGVyQ2hhbmdlKG9yZGVyKSB7XG4gICAgICAgICAgcmV0dXJuIHZtLmRhdGEgPSAkZmlsdGVyKCdvcmRlckJ5Jykodm0uZGF0YSwgW29yZGVyXSwgdHJ1ZSlcbiAgICAgICAgfTtcbiAgICAgICAgZnVuY3Rpb24gb25QYWdpbmF0aW9uQ2hhbmdlKHBhZ2UsIGxpbWl0KSB7XG4gICAgICAgICAgLy9jb25zb2xlLmxvZyhwYWdlLCBsaW1pdCk7XG4gICAgICAgICAgLy9yZXR1cm4gJG51dHJpdGlvbi5kZXNzZXJ0cy5nZXQoJHNjb3BlLnF1ZXJ5LCBzdWNjZXNzKS4kcHJvbWlzZTtcbiAgICAgICAgfTtcbiAgICAgICAgZnVuY3Rpb24gY2hlY2tGb3JFcnJvcnMoaXRlbSl7XG4gICAgICAgICAgcmV0dXJuIGl0ZW0uZXJyb3JzLmxlbmd0aCA+IDAgPyAnbWQtd2Fybic6ICcnO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGNsZWFyRXJyb3JzKCl7XG4gICAgICAgICAgYW5ndWxhci5mb3JFYWNoKHZtLmRhdGEsIGZ1bmN0aW9uKHJvdywga2V5KXtcbiAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaChyb3cuZGF0YVswXSwgZnVuY3Rpb24oaXRlbSwgayl7XG4gICAgICAgICAgICAgIGlmKGlzTmFOKGl0ZW0pIHx8IGl0ZW0gPCAwKXtcbiAgICAgICAgICAgICAgICBpZigvKml0ZW0udG9TdHJpbmcoKS50b1VwcGVyQ2FzZSgpID09IFwiTkFcIiB8fCovIGl0ZW0gPCAwIHx8IGl0ZW0udG9TdHJpbmcoKS50b1VwcGVyQ2FzZSgpLmluZGV4T2YoJ04vQScpID4gLTEpe1xuICAgICAgICAgICAgICAgICAgdm0uZGF0YVtrZXldLmRhdGFbMF1ba10gPSBudWxsO1xuICAgICAgICAgICAgICAgICAgdm0uZXJyb3JzIC0tO1xuICAgICAgICAgICAgICAgICAgcm93LmVycm9ycy5zcGxpY2UoMCwxKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYoIXJvdy5kYXRhWzBdW3ZtLm1ldGEuaXNvX2ZpZWxkXSl7XG4gICAgICAgICAgICAgIHZtLmlzb19lcnJvcnMrKztcbiAgICAgICAgICAgICAgdm0uZXJyb3JzKytcbiAgICAgICAgICAgICAgcm93LmVycm9ycy5wdXNoKHtcbiAgICAgICAgICAgICAgICB0eXBlOlwiMlwiLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6XCJJc28gZmllbGQgaXMgbm90IHZhbGlkIVwiLFxuICAgICAgICAgICAgICAgIGNvbHVtbjogdm0ubWV0YS5pc29fZmllbGRcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBlZGl0Q29sdW1uRGF0YShlLCBrZXkpe1xuICAgICAgICAgIHZtLnRvRWRpdCA9IGtleTtcbiAgICAgICAgICBEaWFsb2dTZXJ2aWNlLmZyb21UZW1wbGF0ZSgnZWRpdGNvbHVtbicsICRzY29wZSk7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gZGVsZXRlU2VsZWN0ZWQoKXtcbiAgICAgICAgICBhbmd1bGFyLmZvckVhY2godm0uc2VsZWN0ZWQsIGZ1bmN0aW9uKGl0ZW0sIGtleSl7XG4gICAgICAgICAgICBhbmd1bGFyLmZvckVhY2goaXRlbS5lcnJvcnMsIGZ1bmN0aW9uKGVycm9yLCBrKXtcbiAgICAgICAgICAgICAgaWYoZXJyb3IudHlwZSA9PSAyKXtcbiAgICAgICAgICAgICAgICB2bS5pc29fZXJyb3JzIC0tO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHZtLmVycm9ycyAtLTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB2bS5kYXRhLnNwbGljZSh2bS5kYXRhLmluZGV4T2YoaXRlbSksIDEpO1xuICAgICAgICAgICAgdm0uc2VsZWN0ZWQuc3BsaWNlKGtleSwgMSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgaWYodm0uZGF0YS5sZW5ndGggPT0gMCl7XG4gICAgICAgICAgICB2bS5kZWxldGVEYXRhKCk7XG4gICAgICAgICAgICAkc3RhdGUuZ290KCdhcHAuaW5kZXguY3JlYXRlJyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGVkaXRSb3coKXtcbiAgICAgICAgICB2bS5yb3cgPSB2bS5zZWxlY3RlZFswXTtcbiAgICAgICAgICBEaWFsb2dTZXJ2aWNlLmZyb21UZW1wbGF0ZSgnZWRpdHJvdycsICRzY29wZSk7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gZGVsZXRlRGF0YSgpe1xuICAgICAgICAgIHZtLmRhdGEgPSBbXTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBmZXRjaElzbygpe1xuICAgICAgICAgIGlmKCF2bS5tZXRhLmlzb19maWVsZCl7XG4gICAgICAgICAgICB0b2FzdHIuZXJyb3IoJ0NoZWNrIHlvdXIgc2VsZWN0aW9uIGZvciB0aGUgSVNPIGZpZWxkJywgJ0NvbHVtbiBub3Qgc3BlY2lmaWVkIScpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZighdm0ubWV0YS5jb3VudHJ5X2ZpZWxkKXtcbiAgICAgICAgICAgIHRvYXN0ci5lcnJvcignQ2hlY2sgeW91ciBzZWxlY3Rpb24gZm9yIHRoZSBDT1VOVFJZIGZpZWxkJywgJ0NvbHVtbiBub3Qgc3BlY2lmaWVkIScpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZih2bS5tZXRhLmNvdW50cnlfZmllbGQgPT0gdm0ubWV0YS5pc29fZmllbGQpe1xuICAgICAgICAgICAgdG9hc3RyLmVycm9yKCdJU08gZmllbGQgYW5kIENPVU5UUlkgZmllbGQgY2FuIG5vdCBiZSB0aGUgc2FtZScsICdTZWxlY3Rpb24gZXJyb3IhJyk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdm0udG9TZWxlY3QgPSBbXTtcbiAgICAgICAgICB2bS5ub3RGb3VuZCA9IFtdO1xuICAgICAgICAgIHZhciBlbnRyaWVzID0gW107XG4gICAgICAgICAgdmFyIGlzb0NoZWNrID0gMDtcbiAgICAgICAgICB2YXIgaXNvVHlwZSA9ICdpc28tMzE2Ni0yJztcbiAgICAgICAgICBhbmd1bGFyLmZvckVhY2godm0uZGF0YSwgZnVuY3Rpb24oaXRlbSwga2V5KXtcbiAgICAgICAgICAgICAgaWYoaXRlbS5kYXRhWzBdW3ZtLm1ldGEuaXNvX2ZpZWxkXSl7XG4gICAgICAgICAgICAgICAgaXNvQ2hlY2sgKz0gaXRlbS5kYXRhWzBdW3ZtLm1ldGEuaXNvX2ZpZWxkXS5sZW5ndGggPT0gMyA/IDEgOiAwO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHN3aXRjaCAoaXRlbS5kYXRhWzBdW3ZtLm1ldGEuY291bnRyeV9maWVsZF0pIHtcbiAgICAgICAgICAgICAgICBjYXNlICdDYWJvIFZlcmRlJzpcbiAgICAgICAgICAgICAgICAgICAgICBpdGVtLmRhdGFbMF1bdm0ubWV0YS5jb3VudHJ5X2ZpZWxkXSA9ICdDYXBlIFZlcmRlJztcbiAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgXCJEZW1vY3JhdGljIFBlb3BsZXMgUmVwdWJsaWMgb2YgS29yZWFcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0uZGF0YVswXVt2bS5tZXRhLmNvdW50cnlfZmllbGRdICAgPSBcIkRlbW9jcmF0aWMgUGVvcGxlJ3MgUmVwdWJsaWMgb2YgS29yZWFcIjtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBcIkNvdGUgZCdJdm9pcmVcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0uZGF0YVswXVt2bS5tZXRhLmNvdW50cnlfZmllbGRdICAgPSBcIkl2b3J5IENvYXN0XCI7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgXCJMYW8gUGVvcGxlcyBEZW1vY3JhdGljIFJlcHVibGljXCI6XG4gICAgICAgICAgICAgICAgICAgICAgaXRlbS5kYXRhWzBdW3ZtLm1ldGEuY291bnRyeV9maWVsZF0gID0gXCJMYW8gUGVvcGxlJ3MgRGVtb2NyYXRpYyBSZXB1YmxpY1wiO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgZW50cmllcy5wdXNoKHtcbiAgICAgICAgICAgICAgICBpc286IGl0ZW0uZGF0YVswXVt2bS5tZXRhLmlzb19maWVsZF0sXG4gICAgICAgICAgICAgICAgbmFtZTogaXRlbS5kYXRhWzBdW3ZtLm1ldGEuY291bnRyeV9maWVsZF1cbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgdmFyIGlzb1R5cGUgPSBpc29DaGVjayA+PSAoZW50cmllcy5sZW5ndGggLyAyKSA/ICdpc28tMzE2Ni0xJyA6ICdpc28tMzE2Ni0yJztcbiAgICAgICAgICBEYXRhU2VydmljZS5wb3N0KCdjb3VudHJpZXMvYnlJc29OYW1lcycsIHtkYXRhOmVudHJpZXMsIGlzbzogaXNvVHlwZX0pLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgICAgICAgICBhbmd1bGFyLmZvckVhY2gocmVzcG9uc2UsIGZ1bmN0aW9uKGNvdW50cnksIGtleSl7XG4gICAgICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKHZtLmRhdGEsIGZ1bmN0aW9uKGl0ZW0sIGspe1xuICAgICAgICAgICAgICAgICAgICBpZihjb3VudHJ5Lm5hbWUgPT0gaXRlbS5kYXRhWzBdW3ZtLm1ldGEuY291bnRyeV9maWVsZF0pe1xuICAgICAgICAgICAgICAgICAgICAgIGlmKGNvdW50cnkuZGF0YS5sZW5ndGggPiAxKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0b1NlbGVjdCA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZW50cnk6IGl0ZW0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnM6IGNvdW50cnkuZGF0YVxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZtLnRvU2VsZWN0LnB1c2godG9TZWxlY3QpO1xuICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYodHlwZW9mIGNvdW50cnkuZGF0YVswXSAhPSBcInVuZGVmaW5lZFwiKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdm0uZGF0YVtrXS5kYXRhWzBdW3ZtLm1ldGEuaXNvX2ZpZWxkXSA9IGNvdW50cnkuZGF0YVswXS5pc287XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHZtLmRhdGFba10uZGF0YVswXVt2bS5tZXRhLmNvdW50cnlfZmllbGRdID0gY291bnRyeS5kYXRhWzBdLmFkbWluO1xuICAgICAgICAgICAgICAgICAgICAgICAgICBpZihpdGVtLmVycm9ycy5sZW5ndGgpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaChpdGVtLmVycm9ycywgZnVuY3Rpb24oZXJyb3IsIGUpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoZXJyb3IudHlwZSA9PSAyKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdm0uaXNvX2Vycm9ycyAtLTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdm0uZXJyb3JzIC0tO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtLmVycm9ycy5zcGxpY2UoZSwgMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZXtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZtLmlzb19lcnJvcnMrKztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2bS5lcnJvcnMrK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0uZXJyb3JzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTpcIjNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6XCJDb3VsZCBub3QgbG9jYXRlIGEgdmFsaWQgaXNvIG5hbWUhXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2x1bW46IHZtLm1ldGEuY291bnRyeV9maWVsZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIHZtLmlzb19jaGVja2VkID0gdHJ1ZTtcbiAgICAgICAgICB9LCBmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICAgICAgLy8gIGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcbiAgICAgICAgICAgIHRvYXN0ci5lcnJvcignUGxlYXNlIGNoZWNrIHlvdXIgZmllbGQgc2VsZWN0aW9ucycsIHJlc3BvbnNlLmRhdGEubWVzc2FnZSk7XG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdIZWFkZXJDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCAkcm9vdFNjb3BlLCAkYXV0aCwgdG9hc3RyKXtcblxuXHRcdHZhciB2bSA9IHRoaXM7XG5cdFx0dm0uaXNBdXRoZW50aWNhdGVkID0gaXNBdXRoZW50aWNhdGVkO1xuXHRcdHZtLmRvTG9nb3V0ID0gZG9Mb2dvdXQ7XG5cdFx0dm0ub3Blbk1lbnUgPSBvcGVuTWVudTtcblxuXHRcdGZ1bmN0aW9uIGlzQXV0aGVudGljYXRlZCgpe1xuXHRcdFx0IHJldHVybiAkYXV0aC5pc0F1dGhlbnRpY2F0ZWQoKTtcblx0XHR9XG5cdFx0ZnVuY3Rpb24gZG9Mb2dvdXQoKXtcblx0XHRcdGlmKCRhdXRoLmlzQXV0aGVudGljYXRlZCgpKXtcblx0XHRcdFx0JGF1dGgubG9nb3V0KCkudGhlbihmdW5jdGlvbihkYXRhKXtcblx0XHRcdFx0XHR0b2FzdHIuc3VjY2VzcygnWW91IGhhdmUgc3VjY2Vzc2Z1bGx5IGxvZ2dlZCBvdXQnKTtcblx0XHRcdFx0fSkuY2F0Y2goZnVuY3Rpb24ocmVzcG9uc2Upe1xuXG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH1cblx0XHR2YXIgb3JpZ2luYXRvckV2O1xuICAgIGZ1bmN0aW9uIG9wZW5NZW51KCRtZE9wZW5NZW51LCBldikge1xuICAgICAgb3JpZ2luYXRvckV2ID0gZXY7XG4gICAgICAkbWRPcGVuTWVudShldik7XG4gICAgfTtcblx0XHQkcm9vdFNjb3BlLnNpZGViYXJPcGVuID0gdHJ1ZTtcblx0XHQkc2NvcGUuJHdhdGNoKGZ1bmN0aW9uKCl7XG5cdFx0XHRyZXR1cm4gJHJvb3RTY29wZS5jdXJyZW50X3BhZ2U7XG5cdFx0fSwgZnVuY3Rpb24obmV3UGFnZSl7XG5cdFx0XHQkc2NvcGUuY3VycmVudF9wYWdlID0gbmV3UGFnZSB8fCAnUGFnZSBOYW1lJztcblx0XHR9KTtcblxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0hvbWVDdHJsJywgZnVuY3Rpb24oRGF0YVNlcnZpY2Upe1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuICAgICAgICBEYXRhU2VydmljZS5nZXRBbGwoJ2luZGV4JykudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICAgICAgdm0uaW5kaXplcyA9IHJlc3BvbnNlO1xuICAgICAgICB9KTtcblxuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0ltcG9ydGNzdkN0cmwnLCBmdW5jdGlvbiAoJG1kRGlhbG9nKSB7XG5cdFx0dGhpcy5zZXR0aW5ncyA9IHtcblx0XHRcdHByaW50TGF5b3V0OiB0cnVlLFxuXHRcdFx0c2hvd1J1bGVyOiB0cnVlLFxuXHRcdFx0c2hvd1NwZWxsaW5nU3VnZ2VzdGlvbnM6IHRydWUsXG5cdFx0XHRwcmVzZW50YXRpb25Nb2RlOiAnZWRpdCdcblx0XHR9O1xuXG5cdFx0dGhpcy5zYW1wbGVBY3Rpb24gPSBmdW5jdGlvbiAobmFtZSwgZXYpIHtcblx0XHRcdCRtZERpYWxvZy5zaG93KCRtZERpYWxvZy5hbGVydCgpXG5cdFx0XHRcdC50aXRsZShuYW1lKVxuXHRcdFx0XHQuY29udGVudCgnWW91IHRyaWdnZXJlZCB0aGUgXCInICsgbmFtZSArICdcIiBhY3Rpb24nKVxuXHRcdFx0XHQub2soJ0dyZWF0Jylcblx0XHRcdFx0LnRhcmdldEV2ZW50KGV2KVxuXHRcdFx0KTtcblx0XHR9O1xuXG4gICAgdGhpcy5vcGVuQ3N2VXBsb2FkID0gZnVuY3Rpb24oKSB7XG5cdFx0XHQkbWREaWFsb2cuc2hvdyh7XG5cdFx0XHRcdFx0Ly9jb250cm9sbGVyOiBEaWFsb2dDb250cm9sbGVyLFxuXHRcdFx0XHRcdHRlbXBsYXRlVXJsOiAnL3ZpZXdzL2FwcC9pbXBvcnRjc3YvY3N2VXBsb2FkRGlhbG9nLmh0bWwnLFxuXHQgICAgICAgIGJpbmRUb0NvbnRyb2xsZXI6IHRydWUsXG5cdFx0XHRcdH0pXG5cdFx0XHRcdC50aGVuKGZ1bmN0aW9uIChhbnN3ZXIpIHtcblxuXHRcdFx0XHR9LCBmdW5jdGlvbiAoKSB7XG5cblx0XHRcdFx0fSk7XG5cdFx0fTtcblx0fSlcblxuXG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0luZGV4Q3RybCcsIGZ1bmN0aW9uICgkc2NvcGUsICR3aW5kb3csICRyb290U2NvcGUsJGZpbHRlciwgJHN0YXRlLCAkdGltZW91dCwgVG9hc3RTZXJ2aWNlLCBWZWN0b3JsYXllclNlcnZpY2UsIGRhdGEsIGNvdW50cmllcywgbGVhZmxldERhdGEsIERhdGFTZXJ2aWNlKSB7XG5cdFx0Ly8gVmFyaWFibGUgZGVmaW5pdGlvbnNcblx0XHR2YXIgdm0gPSB0aGlzO1xuXHRcdHZtLm1hcCA9IG51bGw7XG5cblx0XHR2bS5kYXRhU2VydmVyID0gZGF0YS5wcm9taXNlcy5kYXRhO1xuXHRcdHZtLnN0cnVjdHVyZVNlcnZlciA9IGRhdGEucHJvbWlzZXMuc3RydWN0dXJlO1xuXHRcdHZtLmNvdW50cnlMaXN0ID0gY291bnRyaWVzO1xuXG5cdFx0dm0uc3RydWN0dXJlID0gXCJcIjtcblx0XHR2bS5tdnRTY291cmNlID0gVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldExheWVyKCk7XG5cdFx0dm0ubXZ0Q291bnRyeUxheWVyID0gVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldE5hbWUoKTtcblx0XHR2bS5tdnRDb3VudHJ5TGF5ZXJHZW9tID0gdm0ubXZ0Q291bnRyeUxheWVyK1wiX2dlb21cIjtcblx0XHR2bS5pc29fZmllbGQgPSBWZWN0b3JsYXllclNlcnZpY2UuZGF0YS5pc28yO1xuXHRcdHZtLm5vZGVQYXJlbnQgPSB7fTtcblx0XHR2bS5zZWxlY3RlZFRhYiA9IDA7XG5cdFx0dm0uY3VycmVudCA9IFwiXCI7XG5cdFx0dm0udGFiQ29udGVudCA9IFwiXCI7XG5cdFx0dm0udG9nZ2xlQnV0dG9uID0gJ2Fycm93X2Ryb3BfZG93bic7XG5cdFx0dm0ubWVudWVPcGVuID0gdHJ1ZTtcblx0XHR2bS5pbmZvID0gZmFsc2U7XG5cdFx0dm0uY2xvc2VJY29uID0gJ2Nsb3NlJztcblx0XHR2bS5jb21wYXJlID0ge1xuXHRcdFx0YWN0aXZlOiBmYWxzZSxcblx0XHRcdGNvdW50cmllczogW11cblx0XHR9O1xuXHRcdHZtLmRpc3BsYXkgPSB7XG5cdFx0XHRzZWxlY3RlZENhdDogJydcblx0XHR9O1xuXG5cdFx0Ly9GdW5jdGlvbiBkZWZpbml0b25zXG5cdFx0dm0uc2hvd1RhYkNvbnRlbnQgPSBzaG93VGFiQ29udGVudDtcblx0XHR2bS5zZXRUYWIgPSBzZXRUYWI7XG5cdFx0dm0uc2V0U3RhdGUgPSBzZXRTdGF0ZTtcblx0XHR2bS5zZXRDdXJyZW50ID0gc2V0Q3VycmVudDtcblx0XHR2bS5zZXRTZWxlY3RlZEZlYXR1cmUgPSBzZXRTZWxlY3RlZEZlYXR1cmU7XG5cdFx0dm0uZ2V0UmFuayA9IGdldFJhbms7XG5cdFx0dm0uZ2V0T2Zmc2V0ID0gZ2V0T2Zmc2V0O1xuXHRcdHZtLmdldFRlbmRlbmN5ID0gZ2V0VGVuZGVuY3k7XG5cblx0XHR2bS5jaGVja0NvbXBhcmlzb24gPSBjaGVja0NvbXBhcmlzb247XG5cdFx0dm0udG9nZ2xlT3BlbiA9IHRvZ2dsZU9wZW47XG5cdFx0dm0udG9nZ2xlSW5mbyA9IHRvZ2dsZUluZm87XG5cdFx0dm0udG9nZ2xlRGV0YWlscyA9IHRvZ2dsZURldGFpbHM7XG5cdFx0dm0udG9nZ2xlQ29tcGFyaXNvbiA9IHRvZ2dsZUNvbXBhcmlzb247XG5cdFx0dm0udG9nZ2xlQ291bnRyaWVMaXN0ID0gdG9nZ2xlQ291bnRyaWVMaXN0O1xuXHRcdHZtLm1hcEdvdG9Db3VudHJ5ID0gbWFwR290b0NvdW50cnk7XG5cdFx0dm0uZ29CYWNrID0gZ29CYWNrO1xuXG5cdFx0dm0uY2FsY1RyZWUgPSBjYWxjVHJlZTtcblxuXHRcdGFjdGl2YXRlKCk7XG5cblx0XHRmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcblx0XG5cdFx0XHR2bS5zdHJ1Y3R1cmVTZXJ2ZXIudGhlbihmdW5jdGlvbihzdHJ1Y3R1cmUpe1xuXHRcdFx0XHR2bS5kYXRhU2VydmVyLnRoZW4oZnVuY3Rpb24oZGF0YSl7XG5cdFx0XHRcdFx0dm0uZGF0YSA9IGRhdGE7XG5cdFx0XHRcdFx0dm0uc3RydWN0dXJlID0gc3RydWN0dXJlO1xuXHRcdFx0XHRcdGNyZWF0ZUNhbnZhcygpO1xuXHRcdFx0XHRcdGRyYXdDb3VudHJpZXMoKTtcblx0XHRcdFx0XHRpZigkc3RhdGUucGFyYW1zLml0ZW0pe1xuXHRcdFx0XHRcdFx0dm0uc2V0U3RhdGUoJHN0YXRlLnBhcmFtcy5pdGVtKTtcblx0XHRcdFx0XHRcdGNhbGNSYW5rKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmKCRzdGF0ZS5wYXJhbXMuY291bnRyaWVzKXtcblx0XHRcdFx0XHRcdHZtLnNldFRhYigyKTtcblx0XHRcdFx0XHRcdHZtLmNvbXBhcmUuY291bnRyaWVzLnB1c2godm0uY3VycmVudCk7XG5cdFx0XHRcdFx0XHR2bS5jb21wYXJlLmFjdGl2ZSA9IHRydWU7XG5cdFx0XHRcdFx0XHQkcm9vdFNjb3BlLmdyZXllZCA9IHRydWU7XG5cdFx0XHRcdFx0XHR2YXIgY291bnRyaWVzID0gJHN0YXRlLnBhcmFtcy5jb3VudHJpZXMuc3BsaXQoJy12cy0nKTtcblx0XHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChjb3VudHJpZXMsIGZ1bmN0aW9uKGlzbyl7XG5cdFx0XHRcdFx0XHRcdHZtLmNvbXBhcmUuY291bnRyaWVzLnB1c2goZ2V0TmF0aW9uQnlJc28oaXNvKSk7XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdC8vb25zb2xlLmxvZyh2bS5jb21wYXJlLmNvdW50cmllcyk7XG5cdFx0XHRcdFx0XHRjb3VudHJpZXMucHVzaCh2bS5jdXJyZW50Lmlzbyk7XG5cdFx0XHRcdFx0XHREYXRhU2VydmljZS5nZXRPbmUoJ2NvdW50cmllcy9iYm94JywgY291bnRyaWVzKS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG5cdFx0XHRcdFx0XHRcdHZtLmJib3ggPSBkYXRhO1xuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KVxuXHRcdFx0fSk7XG5cblx0XHR9XG5cblx0XHRmdW5jdGlvbiBnb0JhY2soKXtcblx0XHRcdCR3aW5kb3cuaGlzdG9yeS5iYWNrKCk7XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIHNob3dUYWJDb250ZW50KGNvbnRlbnQpIHtcblx0XHRcdGlmIChjb250ZW50ID09ICcnICYmIHZtLnRhYkNvbnRlbnQgPT0gJycpIHtcblx0XHRcdFx0dm0udGFiQ29udGVudCA9ICdyYW5rJztcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHZtLnRhYkNvbnRlbnQgPSBjb250ZW50O1xuXHRcdFx0fVxuXHRcdFx0dm0udG9nZ2xlQnV0dG9uID0gdm0udGFiQ29udGVudCA/ICdhcnJvd19kcm9wX3VwJyA6ICdhcnJvd19kcm9wX2Rvd24nO1xuXHRcdH07XG5cdFx0ZnVuY3Rpb24gc2V0U3RhdGUoaXRlbSkge1xuXHRcdFx0dm0uc2V0Q3VycmVudChnZXROYXRpb25CeUlzbyhpdGVtKSk7XG5cdFx0XHRmZXRjaE5hdGlvbkRhdGEoaXRlbSk7XG5cdFx0fTtcblxuXHRcdGZ1bmN0aW9uIHRvZ2dsZU9wZW4oKSB7XG5cdFx0XHR2bS5tZW51ZU9wZW4gPSAhdm0ubWVudWVPcGVuO1xuXHRcdFx0dm0uY2xvc2VJY29uID0gdm0ubWVudWVPcGVuID09IHRydWUgPyAnY2hldnJvbl9sZWZ0JyA6ICdjaGV2cm9uX3JpZ2h0Jztcblx0XHR9XG5cdFx0ZnVuY3Rpb24gc2V0Q3VycmVudChuYXQpIHtcblx0XHRcdHZtLmN1cnJlbnQgPSBuYXQ7XG5cdFx0XHR2bS5zZXRTZWxlY3RlZEZlYXR1cmUoKTtcblx0XHR9O1xuXG5cdFx0ZnVuY3Rpb24gc2V0U2VsZWN0ZWRGZWF0dXJlKGlzbykge1xuXHRcdFx0aWYgKHZtLm12dFNvdXJjZSkge1xuXHRcdFx0XHQkdGltZW91dChmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0dm0ubXZ0U291cmNlLmxheWVyc1t2bS5tdnRDb3VudHJ5TGF5ZXJHZW9tXS5mZWF0dXJlc1t2bS5jdXJyZW50Lmlzb10uc2VsZWN0ZWQgPSB0cnVlO1xuXHRcdFx0XHR9KVxuXHRcdFx0fVxuXHRcdH07XG5cdFx0ZnVuY3Rpb24gY2FsY1JhbmsoKSB7XG5cdFx0XHRpZighdm0uY3VycmVudCl7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHRcdHZhciByYW5rID0gMDtcblx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5kYXRhLCBmdW5jdGlvbihpdGVtKSB7XG5cdFx0XHRcdGl0ZW1bdm0uc3RydWN0dXJlLm5hbWVdID0gcGFyc2VGbG9hdChpdGVtW3ZtLnN0cnVjdHVyZS5uYW1lXSk7XG5cdFx0XHRcdGl0ZW1bJ3Njb3JlJ10gPSBwYXJzZUZsb2F0KGl0ZW1bdm0uc3RydWN0dXJlLm5hbWVdKTtcblx0XHRcdH0pO1xuXHRcdFx0dm0uZGF0YSA9ICRmaWx0ZXIoJ29yZGVyQnknKSh2bS5kYXRhLCBbdm0uc3RydWN0dXJlLm5hbWVdLCAnaXNvJywgdHJ1ZSk7XG5cdFx0XHRyYW5rID0gdm0uZGF0YS5pbmRleE9mKHZtLmN1cnJlbnQpICsgMTtcblx0XHRcdHZtLmN1cnJlbnRbdm0uc3RydWN0dXJlLm5hbWUrJ19yYW5rJ10gPSByYW5rO1xuXHRcdFx0dm0uY2lyY2xlT3B0aW9ucyA9IHtcblx0XHRcdFx0XHRjb2xvcjp2bS5zdHJ1Y3R1cmUuY29sb3IgfHwgJyMwMGNjYWEnLFxuXHRcdFx0XHRcdGZpZWxkOnZtLnN0cnVjdHVyZS5uYW1lKydfcmFuaydcblx0XHRcdH07XG5cdFx0XHRyZXR1cm4gcmFuaztcblx0XHR9XG5cdFx0ZnVuY3Rpb24gZ2V0UmFuayhjb3VudHJ5KXtcblxuXHRcdFx0dmFyIHJhbmsgPSB2bS5kYXRhLmluZGV4T2YoY291bnRyeSkgKyAxO1xuXHRcdFx0cmV0dXJuIHJhbms7XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIHRvZ2dsZUluZm8oKSB7XG5cdFx0XHR2bS5pbmZvID0gIXZtLmluZm87XG5cdFx0fTtcblxuXHRcdGZ1bmN0aW9uIHRvZ2dsZURldGFpbHMoKSB7XG5cdFx0XHRyZXR1cm4gdm0uZGV0YWlscyA9ICF2bS5kZXRhaWxzO1xuXHRcdH07XG5cdFx0ZnVuY3Rpb24gZmV0Y2hOYXRpb25EYXRhKGlzbyl7XG5cdFx0XHREYXRhU2VydmljZS5nZXRPbmUoJ2luZGV4LycrJHN0YXRlLnBhcmFtcy5pbmRleCwgaXNvKS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG5cdFx0XHRcdHZtLmN1cnJlbnQuZGF0YSA9IGRhdGE7XG5cdFx0XHRcdG1hcEdvdG9Db3VudHJ5KGlzbyk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdFx0ZnVuY3Rpb24gbWFwR290b0NvdW50cnkoaXNvKSB7XG5cdFx0XHRpZighJHN0YXRlLnBhcmFtcy5jb3VudHJpZXMpe1xuXHRcdFx0XHREYXRhU2VydmljZS5nZXRPbmUoJ2NvdW50cmllcy9iYm94JywgW2lzb10pLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcblx0XHRcdFx0XHR2bS5iYm94ID0gZGF0YTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cblx0XHR9XG5cblx0XHRmdW5jdGlvbiBjaGVja0NvbXBhcmlzb24od2FudCkge1xuXHRcdFx0aWYgKHdhbnQgJiYgIXZtLmNvbXBhcmUuYWN0aXZlIHx8ICF3YW50ICYmIHZtLmNvbXBhcmUuYWN0aXZlKSB7XG5cdFx0XHRcdHZtLnRvZ2dsZUNvbXBhcmlzb24oKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRmdW5jdGlvbiB0b2dnbGVDb21wYXJpc29uKCkge1xuXHRcdFx0dm0uY29tcGFyZS5jb3VudHJpZXMgPSBbdm0uY3VycmVudF07XG5cdFx0XHR2bS5jb21wYXJlLmFjdGl2ZSA9ICF2bS5jb21wYXJlLmFjdGl2ZTtcblx0XHRcdGlmICh2bS5jb21wYXJlLmFjdGl2ZSkge1xuXHRcdFx0XHR2bS5zZXRUYWIoMik7XG5cdFx0XHRcdCRyb290U2NvcGUuZ3JleWVkID0gdHJ1ZTtcblx0XHRcdFx0dm0ubXZ0U291cmNlLm9wdGlvbnMubXV0ZXhUb2dnbGUgPSBmYWxzZTtcblx0XHRcdFx0dm0ubXZ0U291cmNlLnNldFN0eWxlKGludmVydGVkU3R5bGUpO1xuXG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkcm9vdFNjb3BlLmdyZXllZCA9IGZhbHNlO1xuXHRcdFx0XHRhbmd1bGFyLmZvckVhY2godm0ubXZ0U291cmNlLmxheWVyc1t2bS5tdnRDb3VudHJ5TGF5ZXJHZW9tXS5mZWF0dXJlcywgZnVuY3Rpb24gKGZlYXR1cmUpIHtcblx0XHRcdFx0XHRmZWF0dXJlLnNlbGVjdGVkID0gZmFsc2U7XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHR2bS5tdnRTb3VyY2UubGF5ZXJzW3ZtLm12dENvdW50cnlMYXllckdlb21dLmZlYXR1cmVzW3ZtLmN1cnJlbnQuaXNvXS5zZWxlY3RlZCA9IHRydWU7XG5cdFx0XHRcdHZtLm12dFNvdXJjZS5vcHRpb25zLm11dGV4VG9nZ2xlID0gdHJ1ZTtcblx0XHRcdFx0dm0ubXZ0U291cmNlLnNldFN0eWxlKGNvdW50cmllc1N0eWxlKTtcblx0XHRcdFx0RGF0YVNlcnZpY2UuZ2V0T25lKCdjb3VudHJpZXMvYmJveCcsIFt2bS5jdXJyZW50Lmlzb10pLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcblx0XHRcdFx0XHR2bS5iYm94ID0gZGF0YTtcblx0XHRcdFx0fSk7XG5cdFx0XHRcdCRzdGF0ZS5nbygnYXBwLmluZGV4LnNob3cuc2VsZWN0ZWQnLHtcblx0XHRcdFx0XHRpbmRleDokc3RhdGUucGFyYW1zLmluZGV4LFxuXHRcdFx0XHRcdGl0ZW06JHN0YXRlLnBhcmFtcy5pdGVtXG5cdFx0XHRcdH0pXG5cdFx0XHR9XG5cdFx0XHQvL3ZtLm12dFNvdXJjZS5yZWRyYXcoKTtcblx0XHR9O1xuXG5cdFx0ZnVuY3Rpb24gdG9nZ2xlQ291bnRyaWVMaXN0KGNvdW50cnkpIHtcblx0XHRcdHZhciBmb3VuZCA9IGZhbHNlO1xuXHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLmNvbXBhcmUuY291bnRyaWVzLCBmdW5jdGlvbiAobmF0LCBrZXkpIHtcblx0XHRcdFx0aWYgKGNvdW50cnkgPT0gbmF0ICYmIG5hdCAhPSB2bS5jdXJyZW50KSB7XG5cdFx0XHRcdFx0dm0uY29tcGFyZS5jb3VudHJpZXMuc3BsaWNlKGtleSwgMSk7XG5cdFx0XHRcdFx0Zm91bmQgPSB0cnVlO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHRcdGlmICghZm91bmQpIHtcblx0XHRcdFx0dm0uY29tcGFyZS5jb3VudHJpZXMucHVzaChjb3VudHJ5KTtcblx0XHRcdH07XG5cdFx0XHR2YXIgaXNvcyA9IFtdO1xuXHRcdFx0dmFyIGNvbXBhcmUgPSBbXTtcblx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5jb21wYXJlLmNvdW50cmllcywgZnVuY3Rpb24gKGl0ZW0sIGtleSkge1xuXHRcdFx0XHRpc29zLnB1c2goaXRlbS5pc28pO1xuXHRcdFx0XHRpZihpdGVtW3ZtLnN0cnVjdHVyZS5pc29dICE9IHZtLmN1cnJlbnQuaXNvKXtcblx0XHRcdFx0XHRjb21wYXJlLnB1c2goaXRlbS5pc28pO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHRcdGlmIChpc29zLmxlbmd0aCA+IDEpIHtcblx0XHRcdFx0RGF0YVNlcnZpY2UuZ2V0T25lKCdjb3VudHJpZXMvYmJveCcsIGlzb3MpLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcblx0XHRcdFx0XHR2bS5iYm94ID0gZGF0YTtcblx0XHRcdFx0fSk7XG5cdFx0XHRcdCRzdGF0ZS5nbygnYXBwLmluZGV4LnNob3cuc2VsZWN0ZWQuY29tcGFyZScse1xuXHRcdFx0XHRcdGluZGV4OiAkc3RhdGUucGFyYW1zLmluZGV4LFxuXHRcdFx0XHRcdGl0ZW06ICRzdGF0ZS5wYXJhbXMuaXRlbSxcblx0XHRcdFx0XHRjb3VudHJpZXM6Y29tcGFyZS5qb2luKCctdnMtJylcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiAhZm91bmQ7XG5cdFx0fTtcblxuXHRcdGZ1bmN0aW9uIGdldE9mZnNldCgpIHtcblx0XHRcdGlmICghdm0uY3VycmVudCkge1xuXHRcdFx0XHRyZXR1cm4gMDtcblx0XHRcdH1cblx0XHRcdC8vY29uc29sZS5sb2codm0uZ2V0UmFuayh2bS5jdXJyZW50KSk7XG5cdFx0XHRyZXR1cm4gKHZtLmdldFJhbmsodm0uY3VycmVudCkgLSAyKSAqIDE3O1xuXHRcdH07XG5cblx0XHRmdW5jdGlvbiBnZXRUZW5kZW5jeSgpIHtcblx0XHRcdGlmICghdm0uY3VycmVudCkge1xuXHRcdFx0XHRyZXR1cm4gJ2Fycm93X2Ryb3BfZG93bidcblx0XHRcdH1cblx0XHRcdHJldHVybiB2bS5jdXJyZW50LnBlcmNlbnRfY2hhbmdlID4gMCA/ICdhcnJvd19kcm9wX3VwJyA6ICdhcnJvd19kcm9wX2Rvd24nO1xuXHRcdH07XG5cblx0XHRmdW5jdGlvbiBzZXRUYWIoaSkge1xuXHRcdFx0dm0uYWN0aXZlVGFiID0gaTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBnZXRQYXJlbnQoZGF0YSkge1xuXHRcdFx0dmFyIGl0ZW1zID0gW107XG5cdFx0XHRhbmd1bGFyLmZvckVhY2goZGF0YS5jaGlsZHJlbiwgZnVuY3Rpb24gKGl0ZW0pIHtcblx0XHRcdFx0aWYgKGl0ZW0uY29sdW1uX25hbWUgPT0gdm0uZGlzcGxheS5zZWxlY3RlZENhdC50eXBlKSB7XG5cdFx0XHRcdFx0dm0ubm9kZVBhcmVudCA9IGRhdGE7XG5cdFx0XHRcdH1cblx0XHRcdFx0Z2V0UGFyZW50KGl0ZW0pO1xuXHRcdFx0fSk7XG5cdFx0XHRyZXR1cm4gaXRlbXM7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gY2FsY1RyZWUoKSB7XG5cdFx0XHRnZXRQYXJlbnQodm0uc3RydWN0dXJlKTtcblx0XHR9O1xuXG5cdFx0ZnVuY3Rpb24gZ2V0TmF0aW9uQnlOYW1lKG5hbWUpIHtcblx0XHRcdHZhciBuYXRpb24gPSB7fTtcblx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5kYXRhLCBmdW5jdGlvbiAobmF0KSB7XG5cdFx0XHRcdGlmIChuYXQuY291bnRyeSA9PSBuYW1lKSB7XG5cdFx0XHRcdFx0bmF0aW9uID0gbmF0O1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHRcdHJldHVybiBuYXRpb247XG5cdFx0fTtcblxuXHRcdGZ1bmN0aW9uIGdldE5hdGlvbkJ5SXNvKGlzbykge1xuXHRcdFx0dmFyIG5hdGlvbiA9IHt9O1xuXHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLmRhdGEsIGZ1bmN0aW9uIChuYXQpIHtcblx0XHRcdFx0aWYgKG5hdC5pc28gPT0gaXNvKSB7XG5cdFx0XHRcdFx0bmF0aW9uID0gbmF0O1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdFx0cmV0dXJuIG5hdGlvbjtcblx0XHR9O1xuXG5cdFx0ZnVuY3Rpb24gY3JlYXRlQ2FudmFzKGNvbG9yKSB7XG5cblx0XHRcdHZtLmNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuXHRcdFx0dm0uY2FudmFzLndpZHRoID0gMjgwO1xuXHRcdFx0dm0uY2FudmFzLmhlaWdodCA9IDEwO1xuXHRcdFx0dm0uY3R4ID0gdm0uY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG5cdFx0XHR2YXIgZ3JhZGllbnQgPSB2bS5jdHguY3JlYXRlTGluZWFyR3JhZGllbnQoMCwgMCwgMjgwLCAxMCk7XG5cdFx0XHRncmFkaWVudC5hZGRDb2xvclN0b3AoMSwgJ3JnYmEoMjU1LDI1NSwyNTUsMCknKTtcblx0XHRcdGdyYWRpZW50LmFkZENvbG9yU3RvcCgwLjUzLCBjb2xvciB8fCAgJ3JnYmEoMTI4LCAyNDMsIDE5OCwxKScpO1xuXHRcdFx0Z3JhZGllbnQuYWRkQ29sb3JTdG9wKDAsICdyZ2JhKDEwMiwxMDIsMTAyLDEpJyk7XG5cdFx0XHR2bS5jdHguZmlsbFN0eWxlID0gZ3JhZGllbnQ7XG5cdFx0XHR2bS5jdHguZmlsbFJlY3QoMCwgMCwgMjgwLCAxMCk7XG5cdFx0XHR2bS5wYWxldHRlID0gdm0uY3R4LmdldEltYWdlRGF0YSgwLCAwLCAyNTcsIDEpLmRhdGE7XG5cdFx0XHQvL2RvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdib2R5JylbMF0uYXBwZW5kQ2hpbGQodm0uY2FudmFzKTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiB1cGRhdGVDYW52YXMoY29sb3IpIHtcblx0XHRcdHZhciBncmFkaWVudCA9IHZtLmN0eC5jcmVhdGVMaW5lYXJHcmFkaWVudCgwLCAwLCAyODAsIDEwKTtcblx0XHRcdGdyYWRpZW50LmFkZENvbG9yU3RvcCgxLCAncmdiYSgyNTUsMjU1LDI1NSwwKScpO1xuXHRcdFx0Z3JhZGllbnQuYWRkQ29sb3JTdG9wKDAuNTMsIGNvbG9yIHx8ICdyZ2JhKDEyOCwgMjQzLCAxOTgsMSknICk7XG5cdFx0XHRncmFkaWVudC5hZGRDb2xvclN0b3AoMCwgJ3JnYmEoMTAyLDEwMiwxMDIsMSknKTtcblx0XHRcdHZtLmN0eC5maWxsU3R5bGUgPSBncmFkaWVudDtcblx0XHRcdHZtLmN0eC5maWxsUmVjdCgwLCAwLCAyODAsIDEwKTtcblx0XHRcdHZtLnBhbGV0dGUgPSB2bS5jdHguZ2V0SW1hZ2VEYXRhKDAsIDAsIDI1NywgMSkuZGF0YTtcblx0XHRcdC8vZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2JvZHknKVswXS5hcHBlbmRDaGlsZCh2bS5jYW52YXMpO1xuXHRcdH07XG5cblx0XHRmdW5jdGlvbiBpbnZlcnRlZFN0eWxlKGZlYXR1cmUpIHtcblx0XHRcdHZhciBzdHlsZSA9IHt9O1xuXHRcdFx0dmFyIGlzbyA9IGZlYXR1cmUucHJvcGVydGllc1t2bS5pc29fZmllbGRdO1xuXHRcdFx0dmFyIG5hdGlvbiA9IGdldE5hdGlvbkJ5SXNvKGlzbyk7XG5cdFx0XHR2YXIgZmllbGQgPSB2bS5zdHJ1Y3R1cmUubmFtZSB8fCAnc2NvcmUnO1xuXG5cdFx0XHQvL1RPRE86IE1BWCBWQUxVRSBJTlNURUFEIE9GIDEwMFxuXHRcdFx0dmFyIGNvbG9yUG9zID0gcGFyc2VJbnQoMjU2IC8gMTAwICogbmF0aW9uW2ZpZWxkXSkgKiA0O1xuXG5cdFx0XHR2YXIgY29sb3IgPSAncmdiYSgnICsgdm0ucGFsZXR0ZVtjb2xvclBvc10gKyAnLCAnICsgdm0ucGFsZXR0ZVtjb2xvclBvcyArIDFdICsgJywgJyArIHZtLnBhbGV0dGVbY29sb3JQb3MgKyAyXSArICcsJyArIHZtLnBhbGV0dGVbY29sb3JQb3MgKyAzXSArICcpJztcblx0XHRcdHN0eWxlLmNvbG9yID0gJ3JnYmEoMCwwLDAsMCknO1xuXHRcdFx0c3R5bGUub3V0bGluZSA9IHtcblx0XHRcdFx0Y29sb3I6ICdyZ2JhKDAsMCwwLDApJyxcblx0XHRcdFx0c2l6ZTogMFxuXHRcdFx0fTtcblx0XHRcdHN0eWxlLnNlbGVjdGVkID0ge1xuXHRcdFx0XHRjb2xvcjogY29sb3IsXG5cdFx0XHRcdG91dGxpbmU6IHtcblx0XHRcdFx0XHRjb2xvcjogJ3JnYmEoMCwwLDAsMC4zKScsXG5cdFx0XHRcdFx0c2l6ZTogMlxuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXHRcdFx0cmV0dXJuIHN0eWxlO1xuXHRcdH07XG5cblx0XHRmdW5jdGlvbiBjb3VudHJpZXNTdHlsZShmZWF0dXJlKSB7XG5cblx0XHRcdHZhciBzdHlsZSA9IHt9O1xuXHRcdFx0dmFyIGlzbyA9IGZlYXR1cmUucHJvcGVydGllc1t2bS5pc29fZmllbGRdO1xuXG5cdFx0XHR2YXIgbmF0aW9uID0gZ2V0TmF0aW9uQnlJc28oaXNvKTtcblx0XHRcdHZhciBmaWVsZCA9IHZtLnN0cnVjdHVyZS5uYW1lIHx8ICdzY29yZSc7XG5cdFx0XHR2YXIgdHlwZSA9IGZlYXR1cmUudHlwZTtcblx0XHRcdGlmKGlzbyAhPSB2bS5jdXJyZW50Lmlzbyl7XG5cdFx0XHRcdFx0ZmVhdHVyZS5zZWxlY3RlZCA9IGZhbHNlO1xuXHRcdFx0fVxuXG5cdFx0XHRzd2l0Y2ggKHR5cGUpIHtcblx0XHRcdGNhc2UgMzogLy8nUG9seWdvbidcblx0XHRcdFx0aWYgKHR5cGVvZiBuYXRpb25bZmllbGRdICE9IFwidW5kZWZpbmVkXCIpIHtcblxuXHRcdFx0XHRcdC8vVE9ETzogTUFYIFZBTFVFIElOU1RFQUQgT0YgMTAwXG5cdFx0XHRcdFx0dmFyIGNvbG9yUG9zID0gcGFyc2VJbnQoMjU2IC8gMTAwICogcGFyc2VJbnQobmF0aW9uW2ZpZWxkXSkpICogNDtcblxuXHRcdFx0XHRcdHZhciBjb2xvciA9ICdyZ2JhKCcgKyB2bS5wYWxldHRlW2NvbG9yUG9zXSArICcsICcgKyB2bS5wYWxldHRlW2NvbG9yUG9zICsgMV0gKyAnLCAnICsgdm0ucGFsZXR0ZVtjb2xvclBvcyArIDJdICsgJywnICsgdm0ucGFsZXR0ZVtjb2xvclBvcyArIDNdICsgJyknO1xuXHRcdFx0XHRcdHN0eWxlLmNvbG9yID0gJ3JnYmEoJyArIHZtLnBhbGV0dGVbY29sb3JQb3NdICsgJywgJyArIHZtLnBhbGV0dGVbY29sb3JQb3MgKyAxXSArICcsICcgKyB2bS5wYWxldHRlW2NvbG9yUG9zICsgMl0gKyAnLDAuNiknOyAvL2NvbG9yO1xuXHRcdFx0XHRcdHN0eWxlLm91dGxpbmUgPSB7XG5cdFx0XHRcdFx0XHRjb2xvcjogY29sb3IsXG5cdFx0XHRcdFx0XHRzaXplOiAxXG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRzdHlsZS5zZWxlY3RlZCA9IHtcblx0XHRcdFx0XHRcdGNvbG9yOiAncmdiYSgnICsgdm0ucGFsZXR0ZVtjb2xvclBvc10gKyAnLCAnICsgdm0ucGFsZXR0ZVtjb2xvclBvcyArIDFdICsgJywgJyArIHZtLnBhbGV0dGVbY29sb3JQb3MgKyAyXSArICcsMC4zKScsXG5cdFx0XHRcdFx0XHRvdXRsaW5lOiB7XG5cdFx0XHRcdFx0XHRcdGNvbG9yOiAncmdiYSg2Niw2Niw2NiwwLjkpJyxcblx0XHRcdFx0XHRcdFx0c2l6ZTogMlxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0XHRzdHlsZS5jb2xvciA9ICdyZ2JhKDI1NSwyNTUsMjU1LDApJztcblx0XHRcdFx0XHRzdHlsZS5vdXRsaW5lID0ge1xuXHRcdFx0XHRcdFx0Y29sb3I6ICdyZ2JhKDI1NSwyNTUsMjU1LDApJyxcblx0XHRcdFx0XHRcdHNpemU6IDFcblx0XHRcdFx0XHR9O1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRpZiAoZmVhdHVyZS5sYXllci5uYW1lID09PSBWZWN0b3JsYXllclNlcnZpY2UuZ2V0TmFtZSgpKydfZ2VvbV9sYWJlbCcpIHtcblx0XHRcdFx0c3R5bGUuc3RhdGljTGFiZWwgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0dmFyIHN0eWxlID0ge1xuXHRcdFx0XHRcdFx0aHRtbDogZmVhdHVyZS5wcm9wZXJ0aWVzLm5hbWUsXG5cdFx0XHRcdFx0XHRpY29uU2l6ZTogWzEyNSwgMzBdLFxuXHRcdFx0XHRcdFx0Y3NzQ2xhc3M6ICdsYWJlbC1pY29uLXRleHQnXG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRyZXR1cm4gc3R5bGU7XG5cdFx0XHRcdH07XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gc3R5bGU7XG5cdFx0fTtcblxuXHRcdCRzY29wZS4kd2F0Y2goJ3ZtLmN1cnJlbnQnLCBmdW5jdGlvbiAobiwgbykge1xuXHRcdFx0aWYgKG4gPT09IG8pIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRpZihuLmlzbykge1xuXHRcdFx0XHRpZihvLmlzbyl7XG5cdFx0XHRcdFx0dm0ubXZ0U291cmNlLmxheWVyc1t2bS5tdnRDb3VudHJ5TGF5ZXJHZW9tXS5mZWF0dXJlc1tvLmlzb10uc2VsZWN0ZWQgPSBmYWxzZTtcblx0XHRcdFx0fVxuXHRcdFx0XHRjYWxjUmFuaygpO1xuXHRcdFx0XHRmZXRjaE5hdGlvbkRhdGEobi5pc28pO1xuXHRcdFx0XHR2bS5tdnRTb3VyY2UubGF5ZXJzW3ZtLm12dENvdW50cnlMYXllckdlb21dLmZlYXR1cmVzW24uaXNvXS5zZWxlY3RlZCA9IHRydWU7XG5cdFx0XHRcdGlmKCRzdGF0ZS5jdXJyZW50Lm5hbWUgPT0gJ2FwcC5pbmRleC5zaG93LnNlbGVjdGVkJyB8fCAkc3RhdGUuY3VycmVudC5uYW1lID09ICdhcHAuaW5kZXguc2hvdycpe1xuXHRcdFx0XHRcdCRzdGF0ZS5nbygnYXBwLmluZGV4LnNob3cuc2VsZWN0ZWQnLCB7XG5cdFx0XHRcdFx0XHRpbmRleDogJHN0YXRlLnBhcmFtcy5pbmRleCxcblx0XHRcdFx0XHRcdGl0ZW06IG4uaXNvXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCRzdGF0ZS5nbygnYXBwLmluZGV4LnNob3cnLHtcblx0XHRcdFx0XHRpbmRleDogJHN0YXRlLnBhcmFtcy5pbmRleFxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9KTtcblx0XHQkc2NvcGUuJHdhdGNoKCd2bS5kaXNwbGF5LnNlbGVjdGVkQ2F0JywgZnVuY3Rpb24gKG4sIG8pIHtcblx0XHRcdGlmIChuID09PSBvKSB7XG5cdFx0XHRcdHJldHVyblxuXHRcdFx0fVxuXHRcdFx0aWYgKG4uY29sb3IpXG5cdFx0XHRcdHVwZGF0ZUNhbnZhcyhuLmNvbG9yKTtcblx0XHRcdGVsc2Uge1xuXHRcdFx0XHR1cGRhdGVDYW52YXMoJ3JnYmEoMTI4LCAyNDMsIDE5OCwxKScpO1xuXHRcdFx0fTtcblx0XHRcdHZtLmNhbGNUcmVlKCk7XG5cdFx0XHQvKmlmICh2bS5jb21wYXJlLmFjdGl2ZSkge1xuXHRcdFx0XHQkdGltZW91dChmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0Ly92bS5tdnRTb3VyY2Uuc2V0U3R5bGUoaW52ZXJ0ZWRTdHlsZSk7XG5cdFx0XHRcdFx0Ly92bS5tdnRTb3VyY2UucmVkcmF3KCk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JHRpbWVvdXQoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdC8vdm0ubXZ0U291cmNlLnNldFN0eWxlKGNvdW50cmllc1N0eWxlKTtcblx0XHRcdFx0XHQvL3ZtLm12dFNvdXJjZS5yZWRyYXcoKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9Ki9cblxuXHRcdFx0aWYgKHZtLmN1cnJlbnQuaXNvKSB7XG5cdFx0XHRcdGlmKCRzdGF0ZS5wYXJhbXMuY291bnRyaWVzKXtcblx0XHRcdFx0XHQkc3RhdGUuZ28oJ2FwcC5pbmRleC5zaG93LnNlbGVjdGVkLmNvbXBhcmUnLCB7XG5cdFx0XHRcdFx0XHRpbmRleDogbi5uYW1lLFxuXHRcdFx0XHRcdFx0aXRlbTogdm0uY3VycmVudC5pc28sXG5cdFx0XHRcdFx0XHRjb3VudHJpZXM6ICRzdGF0ZS5wYXJhbXMuY291bnRyaWVzXG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNle1xuXHRcdFx0XHRcdCRzdGF0ZS5nbygnYXBwLmluZGV4LnNob3cuc2VsZWN0ZWQnLCB7XG5cdFx0XHRcdFx0XHRpbmRleDogbi5uYW1lLFxuXHRcdFx0XHRcdFx0aXRlbTogdm0uY3VycmVudC5pc29cblx0XHRcdFx0XHR9KVxuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkc3RhdGUuZ28oJ2FwcC5pbmRleC5zaG93Jywge1xuXHRcdFx0XHRcdGluZGV4OiBuLm5hbWVcblx0XHRcdFx0fSlcblx0XHRcdH1cblxuXHRcdH0pO1xuXHRcdCRzY29wZS4kd2F0Y2goJ3ZtLmJib3gnLCBmdW5jdGlvbiAobiwgbykge1xuXHRcdFx0aWYgKG4gPT09IG8pIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdFx0Lyp2YXIgbGF0ID0gW24uY29vcmRpbmF0ZXNbMF1bMF1bMV0sXG5cdFx0XHRcdFx0W24uY29vcmRpbmF0ZXNbMF1bMF1bMF1dXG5cdFx0XHRcdF0sXG5cdFx0XHRcdGxuZyA9IFtuLmNvb3JkaW5hdGVzWzBdWzJdWzFdLFxuXHRcdFx0XHRcdFtuLmNvb3JkaW5hdGVzWzBdWzJdWzBdXVxuXHRcdFx0XHRdKi9cblx0XHRcdHZhciBzb3V0aFdlc3QgPSBMLmxhdExuZyhuLmNvb3JkaW5hdGVzWzBdWzBdWzFdLCBuLmNvb3JkaW5hdGVzWzBdWzBdWzBdKSxcblx0XHRcdFx0bm9ydGhFYXN0ID0gTC5sYXRMbmcobi5jb29yZGluYXRlc1swXVsyXVsxXSwgbi5jb29yZGluYXRlc1swXVsyXVswXSksXG5cdFx0XHRcdGJvdW5kcyA9IEwubGF0TG5nQm91bmRzKHNvdXRoV2VzdCwgbm9ydGhFYXN0KTtcblxuXHRcdFx0dmFyIHBhZCA9IFtcblx0XHRcdFx0WzAsIDBdLFxuXHRcdFx0XHRbMTAwLDEwMF1cblx0XHRcdF07XG5cdFx0XHRpZiAodm0uY29tcGFyZS5hY3RpdmUpIHtcblx0XHRcdFx0cGFkID0gW1xuXHRcdFx0XHRcdFswLCAwXSxcblx0XHRcdFx0XHRbMCwgMF1cblx0XHRcdFx0XTtcblx0XHRcdH1cblx0XHRcdHZtLm1hcC5maXRCb3VuZHMoYm91bmRzLCB7XG5cdFx0XHRcdHBhZGRpbmc6cGFkWzFdLFxuXHRcdFx0XHRtYXhab29tOiA2XG5cdFx0XHR9KTtcblx0XHR9KTtcblxuXHRcdCRzY29wZS4kb24oXCIkc3RhdGVDaGFuZ2VTdWNjZXNzXCIsIGZ1bmN0aW9uIChldmVudCwgdG9TdGF0ZSwgdG9QYXJhbXMsIGZyb21TdGF0ZSwgZnJvbVBhcmFtcykge1xuXG5cdFx0XHQvKmNvbnNvbGUubG9nKCQpXG5cdFx0XHRpZiAodG9TdGF0ZS5uYW1lID09IFwiYXBwLmluZGV4LnNob3dcIikge1xuXHRcdFx0XHRcdHZtLmN1cnJlbnQgPSBcIlwiO1xuXHRcdFx0fSBlbHNlIGlmICh0b1N0YXRlLm5hbWUgPT0gXCJhcHAuaW5kZXguc2hvdy5zZWxlY3RlZFwiKSB7XG5cblx0XHRcdFx0aWYodG9QYXJhbXMuaW5kZXggIT0gZnJvbVBhcmFtcy5pbmRleCl7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2coJ2FuZGVycycpXG5cdFx0XHRcdH1cblx0XHRcdFx0Y29uc29sZS5sb2codG9QYXJhbXMuaXRlbSk7XG5cdFx0XHRcdHZtLnNldFN0YXRlKHRvUGFyYW1zLml0ZW0pO1xuXHRcdFx0XHRjYWxjUmFuaygpO1xuXHRcdFx0XHQvL3ZtLm12dFNvdXJjZS5vcHRpb25zLm11dGV4VG9nZ2xlID0gdHJ1ZTtcblx0XHRcdFx0RGF0YVNlcnZpY2UuZ2V0T25lKCduYXRpb25zJywgdm0uY3VycmVudC5pc28pLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcblx0XHRcdFx0XHR2bS5jdXJyZW50LmRhdGEgPSBkYXRhO1xuXHRcdFx0XHRcdERhdGFTZXJ2aWNlLmdldE9uZSgnbmF0aW9ucy9iYm94JywgW3ZtLmN1cnJlbnQuaXNvXSkudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuXHRcdFx0XHRcdFx0dm0uYmJveCA9IGRhdGE7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSBlbHNlIGlmICh0b1N0YXRlLm5hbWUgPT0gXCJhcHAuaW5kZXguc2hvdy5zZWxlY3RlZC5jb21wYXJlXCIpIHtcblx0XHRcdFx0dm0uc2V0U3RhdGUodG9QYXJhbXMuaXRlbSk7XG5cdFx0XHRcdC8vJHNjb3BlLmFjdGl2ZVRhYiA9IDI7XG5cdFx0XHRcdC8qRGF0YVNlcnZpY2UuZ2V0T25lKCduYXRpb25zJywgdG9QYXJhbXMuaXRlbSkudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuXHRcdFx0XHRcdHZtLmNvdW50cnkgPSBkYXRhO1xuXHRcdFx0XHRcdERhdGFTZXJ2aWNlLmdldE9uZSgnbmF0aW9ucy9iYm94JywgW3ZtLmNvdW50cnkuaXNvXSkudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuXHRcdFx0XHRcdFx0dm0uYmJveCA9IGRhdGE7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dm0uY3VycmVudCA9IFwiXCI7XG5cdFx0XHR9Ki9cblx0XHR9KTtcblxuXHRcdGZ1bmN0aW9uIGRyYXdDb3VudHJpZXMoKSB7XG5cdFx0XHRsZWFmbGV0RGF0YS5nZXRNYXAoJ21hcCcpLnRoZW4oZnVuY3Rpb24gKG1hcCkge1xuXHRcdFx0XHR2bS5tYXAgPSBtYXA7XG5cdFx0XHRcdHZtLm12dFNvdXJjZSA9IFZlY3RvcmxheWVyU2VydmljZS5nZXRMYXllcigpO1xuXHRcdFx0XHQkdGltZW91dChmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0aWYoJHN0YXRlLnBhcmFtcy5jb3VudHJpZXMpe1xuXHRcdFx0XHRcdFx0dm0ubXZ0U291cmNlLm9wdGlvbnMubXV0ZXhUb2dnbGUgPSBmYWxzZTtcblx0XHRcdFx0XHRcdHZtLm12dFNvdXJjZS5zZXRTdHlsZShpbnZlcnRlZFN0eWxlKTtcblx0XHRcdFx0XHRcdHZtLm12dFNvdXJjZS5sYXllcnNbdm0ubXZ0Q291bnRyeUxheWVyR2VvbV0uZmVhdHVyZXNbdm0uY3VycmVudC5pc29dLnNlbGVjdGVkID0gdHJ1ZTtcblx0XHRcdFx0XHRcdHZhciBjb3VudHJpZXMgPSAkc3RhdGUucGFyYW1zLmNvdW50cmllcy5zcGxpdCgnLXZzLScpO1xuXHRcdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKGNvdW50cmllcywgZnVuY3Rpb24oaXNvKXtcblx0XHRcdFx0XHRcdFx0dm0ubXZ0U291cmNlLmxheWVyc1t2bS5tdnRDb3VudHJ5TGF5ZXJHZW9tXS5mZWF0dXJlc1tpc29dLnNlbGVjdGVkID0gdHJ1ZTtcblx0XHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2V7XG5cdFx0XHRcdFx0XHR2bS5tdnRTb3VyY2Uuc2V0U3R5bGUoY291bnRyaWVzU3R5bGUpO1xuXHRcdFx0XHRcdFx0aWYoJHN0YXRlLnBhcmFtcy5pdGVtKXtcblx0XHRcdFx0XHRcdFx0XHR2bS5tdnRTb3VyY2UubGF5ZXJzW3ZtLm12dENvdW50cnlMYXllckdlb21dLmZlYXR1cmVzWyRzdGF0ZS5wYXJhbXMuaXRlbV0uc2VsZWN0ZWQgPSB0cnVlO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHQvL3ZtLm12dFNvdXJjZS5yZWRyYXcoKTtcblx0XHRcdFx0fSk7XG5cdFx0XHRcdHZtLm12dFNvdXJjZS5vcHRpb25zLm9uQ2xpY2sgPSBmdW5jdGlvbiAoZXZ0LCB0KSB7XG5cdFx0XHRcdFx0aWYgKCF2bS5jb21wYXJlLmFjdGl2ZSkge1xuXHRcdFx0XHRcdFx0dmFyIGMgPSBnZXROYXRpb25CeUlzbyhldnQuZmVhdHVyZS5wcm9wZXJ0aWVzW3ZtLmlzb19maWVsZF0pO1xuXHRcdFx0XHRcdFx0aWYgKHR5cGVvZiBjW3ZtLnN0cnVjdHVyZS5uYW1lXSAhPSBcInVuZGVmaW5lZFwiKSB7XG5cdFx0XHRcdFx0XHRcdHZtLmN1cnJlbnQgPSBnZXROYXRpb25CeUlzbyhldnQuZmVhdHVyZS5wcm9wZXJ0aWVzW3ZtLmlzb19maWVsZF0pO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0VG9hc3RTZXJ2aWNlLmVycm9yKCdObyBpbmZvIGFib3V0IHRoaXMgbG9jYXRpb24hJyk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKGV2dCk7XG5cdFx0XHRcdFx0XHR2YXIgYyA9IGdldE5hdGlvbkJ5SXNvKGV2dC5mZWF0dXJlLnByb3BlcnRpZXNbdm0uaXNvX2ZpZWxkXSk7XG5cdFx0XHRcdFx0XHRpZiAodHlwZW9mIGNbdm0uc3RydWN0dXJlLm5hbWVdICE9IFwidW5kZWZpbmVkXCIpIHtcblx0XHRcdFx0XHRcdFx0dm0udG9nZ2xlQ291bnRyaWVMaXN0KGMpO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0VG9hc3RTZXJ2aWNlLmVycm9yKCdObyBpbmZvIGFib3V0IHRoaXMgbG9jYXRpb24hJyk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9O1xuXHR9KTtcbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignSW5kZXhiYXNlQ3RybCcsIGZ1bmN0aW9uICgkc2NvcGUsJHN0YXRlKSB7XG5cdFx0Ly9cbiAgICAkc2NvcGUuJHN0YXRlID0gJHN0YXRlO1xuXHR9KTtcbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdJbmRleE1ldGFDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBEYXRhU2VydmljZSxJbmRleFNlcnZpY2UsdG9hc3RyKXtcbiAgICAgICAgLy9cblxuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgICAgIHZtLmluZGljYXRvcnMgPSBbXTtcbiAgICAgICAgdm0uZGF0YSA9IEluZGV4U2VydmljZS5nZXREYXRhKCk7XG4gICAgICAgIHZtLm1ldGEgPSBJbmRleFNlcnZpY2UuZ2V0TWV0YSgpO1xuICAgICAgICB2bS5lcnJvcnMgPSBJbmRleFNlcnZpY2UuZ2V0RXJyb3JzKCk7XG4gICAgICAgIHZtLmluZGljYXRvciA9IEluZGV4U2VydmljZS5hY3RpdmVJbmRpY2F0b3IoKTtcbiAgICAgICAgdm0uZXh0ZW5kRGF0YSA9IGV4dGVuZERhdGE7XG4gICAgICAgIHZtLnNhdmVEYXRhID0gc2F2ZURhdGE7XG5cbiAgICAgICAgZnVuY3Rpb24gZXh0ZW5kRGF0YSgpe1xuICAgICAgICAgIHZhciBpbnNlcnREYXRhID0ge2RhdGE6W119O1xuICAgICAgICAgIHZhciBtZXRhID0gW10sIGZpZWxkcyA9IFtdO1xuICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaCh2bS5kYXRhLCBmdW5jdGlvbihpdGVtLCBrZXkpe1xuICAgICAgICAgICAgaWYoaXRlbS5lcnJvcnMubGVuZ3RoID09IDApe1xuICAgICAgICAgICAgICBpdGVtLmRhdGFbMF0ueWVhciA9IHZtLm1ldGEueWVhcjtcbiAgICAgICAgICAgICAgaW5zZXJ0RGF0YS5kYXRhLnB1c2goaXRlbS5kYXRhWzBdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICAgIHRvYXN0ci5lcnJvcignVGhlcmUgYXJlIHNvbWUgZXJyb3JzIGxlZnQhJywgJ0h1Y2ghJyk7XG4gICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIERhdGFTZXJ2aWNlLnBvc3QoJ2RhdGEvdGFibGVzLycrdm0uYWRkRGF0YVRvLnRhYmxlX25hbWUrJy9pbnNlcnQnLCBpbnNlcnREYXRhKS50aGVuKGZ1bmN0aW9uKHJlcyl7XG4gICAgICAgICAgICBpZihyZXMgPT0gdHJ1ZSl7XG4gICAgICAgICAgICAgIHRvYXN0ci5zdWNjZXNzKGluc2VydERhdGEuZGF0YS5sZW5ndGgrJyBpdGVtcyBpbXBvcnRldCB0byAnK3ZtLm1ldGEubmFtZSwnU3VjY2VzcycpO1xuICAgICAgICAgICAgICB2bS5kYXRhID0gW107XG4gICAgICAgICAgICAgIHZtLnN0ZXAgPSAwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIHNhdmVEYXRhKCl7XG4gICAgICAgICAgdmFyIGluc2VydERhdGEgPSB7ZGF0YTpbXX07XG4gICAgICAgICAgdmFyIG1ldGEgPSBbXSwgZmllbGRzID0gW107XG4gICAgICAgICAgYW5ndWxhci5mb3JFYWNoKHZtLmRhdGEsIGZ1bmN0aW9uKGl0ZW0sIGtleSl7XG4gICAgICAgICAgICBpZihpdGVtLmVycm9ycy5sZW5ndGggPT0gMCl7XG4gICAgICAgICAgICAgIGl0ZW0uZGF0YVswXS55ZWFyID0gdm0ubWV0YS55ZWFyO1xuICAgICAgICAgICAgICB2bS5tZXRhLmlzb190eXBlID0gaXRlbS5kYXRhWzBdW3ZtLm1ldGEuaXNvX2ZpZWxkXS5sZW5ndGggPT0gMyA/ICdpc28tMzE2Ni0xJyA6ICdpc28tMzE2Ni0yJztcbiAgICAgICAgICAgICAgaW5zZXJ0RGF0YS5kYXRhLnB1c2goaXRlbS5kYXRhWzBdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICAgIHRvYXN0ci5lcnJvcignVGhlcmUgYXJlIHNvbWUgZXJyb3JzIGxlZnQhJywgJ0h1Y2ghJyk7XG4gICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgICBhbmd1bGFyLmZvckVhY2godm0uZGF0YVswXS5kYXRhWzBdLCBmdW5jdGlvbihpdGVtLCBrZXkpe1xuICAgICAgICAgICAgaWYodm0uaW5kaWNhdG9yc1trZXldKXtcbiAgICAgICAgICAgICAgdmFyIGZpZWxkID0ge1xuICAgICAgICAgICAgICAgICdjb2x1bW4nOiBrZXksXG4gICAgICAgICAgICAgICAgJ3RpdGxlJzp2bS5pbmRpY2F0b3JzW2tleV0udGl0bGUsXG4gICAgICAgICAgICAgICAgJ2Rlc2NyaXB0aW9uJzp2bS5pbmRpY2F0b3JzW2tleV0uZGVzY3JpcHRpb24sXG4gICAgICAgICAgICAgICAgJ21lYXN1cmVfdHlwZV9pZCc6dm0uaW5kaWNhdG9yc1trZXldLm1lYXN1cmVfdHlwZV9pZCB8fCAwLFxuICAgICAgICAgICAgICAgICdpc19wdWJsaWMnOiB2bS5pbmRpY2F0b3JzW2tleV0uaXNfcHVibGljIHx8IDAsXG4gICAgICAgICAgICAgICAgJ2RhdGFwcm92aWRlcl9pZCc6IHZtLmluZGljYXRvcnNba2V5XS5kYXRhcHJvdmlkZXIuaWQgfHwgMFxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICB2YXIgY2F0ZWdvcmllcyA9IFtdO1xuICAgICAgICAgICAgICBhbmd1bGFyLmZvckVhY2godm0uaW5kaWNhdG9yc1trZXldLmNhdGVnb3JpZXMsIGZ1bmN0aW9uKGNhdCl7XG4gICAgICAgICAgICAgICAgY2F0ZWdvcmllcy5wdXNoKGNhdC5pZCk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICBmaWVsZC5jYXRlZ29yaWVzID0gY2F0ZWdvcmllcztcbiAgICAgICAgICAgICAgZmllbGRzLnB1c2goZmllbGQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaCh2bS5kYXRhLnRhYmxlLCBmdW5jdGlvbihpdGVtLCBrZXkpe1xuICAgICAgICAgICAgbWV0YS5wdXNoKHtcbiAgICAgICAgICAgICAgZmllbGQ6a2V5LFxuICAgICAgICAgICAgICBkYXRhOiBpdGVtXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH0pXG4gICAgICAgICAgdm0ubWV0YS5maWVsZHMgPSBmaWVsZHM7XG4gICAgICAgICAgdm0ubWV0YS5pbmZvID0gbWV0YTtcbiAgICAgICAgICBEYXRhU2VydmljZS5wb3N0KCdkYXRhL3RhYmxlcycsIHZtLm1ldGEpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgICAgICAgICBEYXRhU2VydmljZS5wb3N0KCdkYXRhL3RhYmxlcy8nK3Jlc3BvbnNlLnRhYmxlX25hbWUrJy9pbnNlcnQnLCBpbnNlcnREYXRhKS50aGVuKGZ1bmN0aW9uKHJlcyl7XG4gICAgICAgICAgICAgICAgaWYocmVzID09IHRydWUpe1xuICAgICAgICAgICAgICAgICAgdG9hc3RyLnN1Y2Nlc3MoaW5zZXJ0RGF0YS5kYXRhLmxlbmd0aCsnIGl0ZW1zIGltcG9ydGV0IHRvICcrdm0ubWV0YS5uYW1lLCdTdWNjZXNzJyk7XG4gICAgICAgICAgICAgICAgICB2bS5kYXRhID0gW107XG4gICAgICAgICAgICAgICAgICB2bS5zdGVwID0gMDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0sIGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgICAgICAgIGlmKHJlc3BvbnNlLm1lc3NhZ2Upe1xuICAgICAgICAgICAgICB0b2FzdHIuZXJyb3IocmVzcG9uc2UubWVzc2FnZSwgJ091Y2ghJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuXG4gICAgICAgICRzY29wZS4kd2F0Y2goZnVuY3Rpb24oKXsgcmV0dXJuIEluZGV4U2VydmljZS5hY3RpdmVJbmRpY2F0b3IoKX0sIGZ1bmN0aW9uKG4sbyl7XG4gICAgICAgICAgaWYobiA9PT0gbylyZXR1cm47XG4gICAgICAgICAgdm0uaW5kaWNhdG9yID0gbjtcbiAgICAgICAgfSk7XG4gICAgICAgICRzY29wZS4kd2F0Y2goJ3ZtLmluZGljYXRvcicsIGZ1bmN0aW9uKG4sbyl7XG4gICAgICAgICAgaWYobiA9PT0gbykgcmV0dXJuO1xuICAgICAgICAgIEluZGV4U2VydmljZS5zZXRBY3RpdmVJbmRpY2F0b3JEYXRhKG4pO1xuICAgICAgICB9LHRydWUpO1xuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignSW5kZXhNZXRhTWVudUN0cmwnLCBmdW5jdGlvbigkc2NvcGUsRGF0YVNlcnZpY2UsSW5kZXhTZXJ2aWNlKXtcbiAgICAgIHZhciB2bSA9IHRoaXM7XG4gICAgICB2bS5kYXRhID0gSW5kZXhTZXJ2aWNlLmdldERhdGEoKTtcbiAgICAgIHZtLm1ldGEgPSBJbmRleFNlcnZpY2UuZ2V0TWV0YSgpO1xuICAgICAgdm0uc2VsZWN0Rm9yRWRpdGluZyA9IHNlbGVjdEZvckVkaXRpbmc7XG4gICAgICB2bS5pbmRpY2F0b3JzID0gW107XG5cbiAgICAgIGZ1bmN0aW9uIHNlbGVjdEZvckVkaXRpbmcoa2V5KXtcbiAgICAgICAgaWYodHlwZW9mIEluZGV4U2VydmljZS5nZXRJbmRpY2F0b3Ioa2V5KSA9PSBcInVuZGVmaW5lZFwiKXtcbiAgICAgICAgICBJbmRleFNlcnZpY2Uuc2V0SW5kaWNhdG9yKGtleSx7XG4gICAgICAgICAgICBjb2x1bW5fbmFtZTprZXksXG4gICAgICAgICAgICB0aXRsZTprZXlcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICB2bS5lZGl0aW5nSXRlbSA9IGtleTtcbiAgICAgICAgdm0uaW5kaWNhdG9yID0gSW5kZXhTZXJ2aWNlLmdldEluZGljYXRvcihrZXkpO1xuICAgICAgfVxuICAgICAgJHNjb3BlLiR3YXRjaChmdW5jdGlvbigpeyByZXR1cm4gSW5kZXhTZXJ2aWNlLmFjdGl2ZUluZGljYXRvcigpfSwgZnVuY3Rpb24obixvKXtcbiAgICAgICAgaWYobiA9PT0gbylyZXR1cm47XG4gICAgICAgIHZtLmluZGljYXRvcnNbbi5jb2x1bW5fbmFtZV0gPSBuO1xuICAgICAgfSx0cnVlKTtcbiAgICB9KTtcbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdJbmRleGNyZWF0b3JDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBEaWFsb2dTZXJ2aWNlLERhdGFTZXJ2aWNlLCAkdGltZW91dCwkc3RhdGUsICRmaWx0ZXIsIGxlYWZsZXREYXRhLCB0b2FzdHIsIEljb25zU2VydmljZSxJbmRleFNlcnZpY2UsIFZlY3RvcmxheWVyU2VydmljZSl7XG4gICAgICAgIC8vXG4gICAgICAgIGNvbnNvbGUubG9nKCRzdGF0ZSk7XG4gICAgICAgIGlmKCRzdGF0ZS5jdXJyZW50Lm5hbWUgPT0gJ2FwcC5pbmRleC5jcmVhdGUnKXtcbiAgICAgICAgICBpZihJbmRleFNlcnZpY2UuZ2V0RGF0YSgpLmxlbmd0aCl7XG4gICAgICAgICAgICBpZihjb25maXJtKCdFeGlzdGluZyBEYXRhLiBHbyBPbj8nKSl7XG4gICAgICAgICAgICAgICRzdGF0ZS5nbygnYXBwLmluZGV4LmNoZWNrJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICBJbmRleFNlcnZpY2UuY2xlYXIoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuICAgICAgICB2bS5tYXAgPSBudWxsO1xuICAgICAgICB2bS5kYXRhID0gW107XG4gICAgICAgIHZtLnRvU2VsZWN0ID0gW107XG4gICAgICAgIHZtLnNlbGVjdGVkID0gW107XG4gICAgICAgIHZtLnNlbGVjdGVkUm93cyA9IFtdO1xuICAgICAgICB2bS5zZWxlY3RlZFJlc291cmNlcyA9W107XG4gICAgICAgIHZtLnNvcnRlZFJlc291cmNlcyA9IFtdO1xuXG4gICAgICAgIHZtLmdyb3VwcyA9IFtdO1xuICAgICAgICB2bS5teURhdGEgPSBbXTtcbiAgICAgICAgdm0uYWRkRGF0YVRvID0ge307XG4gICAgICAgIHZtLnNlbGVjdGVkRm9yR3JvdXAgPSBbXTtcbiAgICAgICAgdm0uaXNvX2Vycm9ycyA9IDA7XG4gICAgICAgIHZtLmlzb19jaGVja2VkID0gZmFsc2U7XG4gICAgICAgIHZtLnNhdmVEaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgICB2bS5zZWxlY3RlZEluZGV4ID0gMDtcbiAgICAgICAgdm0uc3RlcCA9IDA7XG4gICAgICAgIHZtLm9wZW5DbG9zZSA9IG9wZW5DbG9zZTtcbiAgICAgICAgLy92bS5zZWFyY2ggPSBzZWFyY2g7XG5cbiAgICAgICAgdm0ubGlzdFJlc291cmNlcyA9IGxpc3RSZXNvdXJjZXM7XG4gICAgICAgIHZtLnRvZ2dsZUxpc3RSZXNvdXJjZXMgPSB0b2dnbGVMaXN0UmVzb3VyY2VzO1xuICAgICAgICB2bS5zZWxlY3RlZFJlc291cmNlID0gc2VsZWN0ZWRSZXNvdXJjZTtcbiAgICAgICAgdm0udG9nZ2xlUmVzb3VyY2UgPSB0b2dnbGVSZXNvdXJjZTtcbiAgICAgICAgdm0uaW5jcmVhc2VQZXJjZW50YWdlID0gaW5jcmVhc2VQZXJjZW50YWdlO1xuICAgICAgICB2bS5kZWNyZWFzZVBlcmNlbnRhZ2UgPSBkZWNyZWFzZVBlcmNlbnRhZ2U7XG4gICAgICAgIHZtLnRvZ2dsZUdyb3VwU2VsZWN0aW9uID0gdG9nZ2xlR3JvdXBTZWxlY3Rpb247XG4gICAgICAgIHZtLmV4aXN0c0luR3JvdXBTZWxlY3Rpb24gPSBleGlzdHNJbkdyb3VwU2VsZWN0aW9uO1xuICAgICAgICB2bS5hZGRHcm91cCA9IGFkZEdyb3VwO1xuICAgICAgICB2bS5jbG9uZVNlbGVjdGlvbiA9IGNsb25lU2VsZWN0aW9uO1xuICAgICAgICB2bS5lZGl0RW50cnkgPSBlZGl0RW50cnk7XG4gICAgICAgIHZtLnJlbW92ZUVudHJ5ID0gcmVtb3ZlRW50cnk7XG4gICAgICAgIHZtLnNhdmVJbmRleCA9IHNhdmVJbmRleDtcblxuICAgICAgICB2bS5pY29ucyA9IEljb25zU2VydmljZS5nZXRMaXN0KCk7XG5cblxuICAgICAgICB2bS5tZXRhID0ge1xuICAgICAgICAgIGlzb19maWVsZDogJycsXG4gICAgICAgICAgY291bnRyeV9maWVsZDonJyxcbiAgICAgICAgICB0YWJsZTpbXVxuICAgICAgICB9O1xuICAgICAgICB2bS5xdWVyeSA9IHtcbiAgICAgICAgICBmaWx0ZXI6ICcnLFxuICAgICAgICAgIG9yZGVyOiAnLWVycm9ycycsXG4gICAgICAgICAgbGltaXQ6IDE1LFxuICAgICAgICAgIHBhZ2U6IDFcbiAgICAgICAgfTtcblxuICAgICAgICAvKnZtLnRyZWVPcHRpb25zID0ge1xuICAgICAgICAgIGJlZm9yZURyb3A6ZnVuY3Rpb24oZXZlbnQpe1xuICAgICAgICAgICAgaWYoZXZlbnQuZGVzdC5ub2Rlc1Njb3BlICE9IGV2ZW50LnNvdXJjZS5ub2Rlc1Njb3BlKXtcbiAgICAgICAgICAgICAgdmFyIGlkeCA9IGV2ZW50LmRlc3Qubm9kZXNTY29wZS4kbW9kZWxWYWx1ZS5pbmRleE9mKGV2ZW50LnNvdXJjZS5ub2RlU2NvcGUuJG1vZGVsVmFsdWUpO1xuICAgICAgICAgICAgICBpZihpZHggPiAtMSl7XG4gICAgICAgICAgICAgICAgIGV2ZW50LnNvdXJjZS5ub2RlU2NvcGUuJCRhcHBseSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICB0b2FzdHIuZXJyb3IoJ09ubHkgb25lIGVsZW1lbnQgb2YgYSBraW5kIHBlciBncm91cCBwb3NzaWJsZSEnLCAnTm90IGFsbG93ZWQhJylcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgZHJvcHBlZDpmdW5jdGlvbihldmVudCl7XG4gICAgICAgICAgICBjYWxjUGVyY2VudGFnZSh2bS5ncm91cHMpO1xuICAgICAgICAgIH1cbiAgICAgICAgfTsqL1xuXG4gICAgICAgIC8vUnVuIFN0YXJ0dXAtRnVuY2l0b25zXG4gICAgICAgIGFjdGl2YXRlKCk7XG5cbiAgICAgICAgZnVuY3Rpb24gYWN0aXZhdGUoKXtcbiAgICAgICAgICAvL2NsZWFyTWFwKCk7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gb3BlbkNsb3NlKGFjdGl2ZSl7XG4gICAgICAgICAgcmV0dXJuIGFjdGl2ZSA/ICdyZW1vdmUnIDogJ2FkZCc7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gY2xlYXJMYXllclN0eWxlKGZlYXR1cmUpe1xuICAgICAgXHRcdFx0dmFyIHN0eWxlID0ge1xuICAgICAgICAgICAgICBjb2xvcjoncmdiYSgyNTUsMjU1LDI1NSwwKScsXG4gICAgICAgICAgICAgIG91dGxpbmU6IHtcbiAgICBcdFx0XHRcdFx0XHRjb2xvcjogJ3JnYmEoMjU1LDI1NSwyNTUsMCknLFxuICAgIFx0XHRcdFx0XHRcdHNpemU6IDFcbiAgICBcdFx0XHRcdFx0fVxuICAgICAgICAgICAgfTtcbiAgICAgIFx0XHRcdHJldHVybiBzdHlsZTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBjbGVhck1hcCgpe1xuICAgICAgICAgIFx0bGVhZmxldERhdGEuZ2V0TWFwKCdtYXAnKS50aGVuKGZ1bmN0aW9uIChtYXApIHtcbiAgICAgICAgICAgICAgdm0ubXZ0U291cmNlID0gVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldExheWVyKCk7XG4gICAgICAgICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgdm0ubXZ0U291cmNlLnNldFN0eWxlKGNsZWFyTGF5ZXJTdHlsZSk7XG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG5cbiAgICAgICAgZnVuY3Rpb24gdG9nZ2xlTGlzdFJlc291cmNlcygpe1xuICAgICAgICAgIHZtLnNob3dSZXNvdXJjZXMgPSAhdm0uc2hvd1Jlc291cmNlcztcbiAgICAgICAgICBpZih2bS5zaG93UmVzb3VyY2VzKXtcbiAgICAgICAgICAgIHZtLmxpc3RSZXNvdXJjZXMoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gbGlzdFJlc291cmNlcygpe1xuICAgICAgICAgIGlmKCF2bS5yZXNvdXJjZXMpe1xuICAgICAgICAgICAgRGF0YVNlcnZpY2UuZ2V0QWxsKCdkYXRhL3RhYmxlcycpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgICAgICAgICB2bS5yZXNvdXJjZXMgPSByZXNwb25zZTtcbiAgICAgICAgICAgICAgdm0uc2VsZWN0ZWRSZXNvdXJjZXMgPSBbXSwgdm0uc29ydGVkUmVzb3VyY2VzID0gW107XG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH1cblxuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIHNlbGVjdGVkUmVzb3VyY2UocmVzb3VyY2Upe1xuICAgICAgICAgIHJldHVybiB2bS5zZWxlY3RlZFJlc291cmNlcy5pbmRleE9mKHJlc291cmNlKSA+IC0xID8gdHJ1ZSA6IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGRlbGV0ZUZyb21Hcm91cChyZXNvdXJjZSwgbGlzdCl7XG4gICAgICAgICAgYW5ndWxhci5mb3JFYWNoKGxpc3QsIGZ1bmN0aW9uKGl0ZW0sIGtleSl7XG4gICAgICAgICAgICAgIC8vaWYodHlwZW9mIGl0ZW0uaXNHcm91cCA9PSBcInVuZGVmaW5lZFwiKXtcbiAgICAgICAgICAgICAgICBpZihpdGVtID09IHJlc291cmNlKXtcbiAgICAgICAgICAgICAgICAgIGxpc3Quc3BsaWNlKGtleSwgMSk7XG4gICAgICAgICAgICAgICAgICB2bS5zZWxlY3RlZEZvckdyb3VwLnNwbGljZSh2bS5zZWxlY3RlZEZvckdyb3VwLmluZGV4T2YoaXRlbSksIDEpO1xuICAgICAgICAgICAgICAgICAgdm0uc2VsZWN0ZWRSZXNvdXJjZXMuc3BsaWNlKHZtLnNlbGVjdGVkUmVzb3VyY2VzLmluZGV4T2YoaXRlbSksMSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAvL31cbiAgICAgICAgICAgICAgZGVsZXRlRnJvbUdyb3VwKHJlc291cmNlLCBpdGVtLm5vZGVzKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiB0b2dnbGVSZXNvdXJjZShyZXNvdXJjZSl7XG4gICAgICAgICAgdmFyIGlkeCA9IHZtLnNlbGVjdGVkUmVzb3VyY2VzLmluZGV4T2YocmVzb3VyY2UpO1xuICAgICAgICAgIGlmKCBpZHggPiAtMSl7XG4gICAgICAgICAgICB2bS5zZWxlY3RlZFJlc291cmNlcy5zcGxpY2UoaWR4LCAxKTtcbiAgICAgICAgICAgIGRlbGV0ZUZyb21Hcm91cChyZXNvdXJjZSwgdm0uZ3JvdXBzKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgIHZtLnNlbGVjdGVkUmVzb3VyY2VzLnB1c2gocmVzb3VyY2UpO1xuICAgICAgICAgICAgaWYodm0uc2VsZWN0ZWRGb3JHcm91cC5sZW5ndGggPT0gMSAmJiB0eXBlb2Ygdm0uc2VsZWN0ZWRGb3JHcm91cFswXS5pc0dyb3VwICE9IFwidW5kZWZpbmVkXCIpe1xuICAgICAgICAgICAgICB2bS5zZWxlY3RlZEZvckdyb3VwWzBdLm5vZGVzLnB1c2gocmVzb3VyY2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgICB2bS5ncm91cHMucHVzaChyZXNvdXJjZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy9jYWxjUGVyY2VudGFnZSh2bS5zb3J0ZWRSZXNvdXJjZXMpO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGNhbGNQZXJjZW50YWdlKG5vZGVzKXtcbiAgICAgICAgICBhbmd1bGFyLmZvckVhY2gobm9kZXMsIGZ1bmN0aW9uKG5vZGUsIGtleSl7XG4gICAgICAgICAgICBub2Rlc1trZXldLndlaWdodCA9IHBhcnNlSW50KDEwMCAvIG5vZGVzLmxlbmd0aCk7XG4gICAgICAgICAgICBjYWxjUGVyY2VudGFnZShub2Rlcy5ub2RlKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBpbmNyZWFzZVBlcmNlbnRhZ2UoaXRlbSl7XG4gICAgICAgICAgY29uc29sZS5sb2coaXRlbSk7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gZGVjcmVhc2VQZXJjZW50YWdlKGl0ZW0pe1xuICAgICAgICAgIGNvbnNvbGUubG9nKGl0ZW0pXG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gdG9nZ2xlR3JvdXBTZWxlY3Rpb24oaXRlbSl7XG4gICAgICAgICAgdmFyIGlkeCA9IHZtLnNlbGVjdGVkRm9yR3JvdXAuaW5kZXhPZihpdGVtKTtcbiAgICAgICAgICBpZiggaWR4ID4gLTEpe1xuICAgICAgICAgICAgdm0uc2VsZWN0ZWRGb3JHcm91cC5zcGxpY2UoaWR4LCAxKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgIHZtLnNlbGVjdGVkRm9yR3JvdXAucHVzaChpdGVtKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gZXhpc3RzSW5Hcm91cFNlbGVjdGlvbihpdGVtKXtcbiAgICAgICAgICByZXR1cm4gdm0uc2VsZWN0ZWRGb3JHcm91cC5pbmRleE9mKGl0ZW0pID4gLTE7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gYWRkR3JvdXAoKXtcbiAgICAgICAgICB2YXIgbmV3R3JvdXAgPSB7XG4gICAgICAgICAgICB0aXRsZTonR3JvdXAnLFxuICAgICAgICAgICAgaXNHcm91cDp0cnVlLFxuICAgICAgICAgICAgbm9kZXM6W11cbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgaWYodm0uc2VsZWN0ZWRGb3JHcm91cC5sZW5ndGggPT0gMSAmJiB0eXBlb2Ygdm0uc2VsZWN0ZWRGb3JHcm91cFswXS5pc0dyb3VwICE9IFwidW5kZWZpbmVkXCIpe1xuICAgICAgICAgICAgdm0uc2VsZWN0ZWRGb3JHcm91cFswXS5ub2Rlcy5wdXNoKG5ld0dyb3VwKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSBpZih2bS5zZWxlY3RlZEZvckdyb3VwLmxlbmd0aCA+IDAgKXtcbiAgICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKHZtLnNlbGVjdGVkRm9yR3JvdXAsIGZ1bmN0aW9uKGl0ZW0sIGtleSl7XG4gICAgICAgICAgICAgICAgICBuZXdHcm91cC5ub2Rlcy5wdXNoKGl0ZW0pO1xuICAgICAgICAgICAgICAgICAgZGVsZXRlRnJvbUdyb3VwKGl0ZW0sIHZtLnNlbGVjdGVkRm9yR3JvdXApO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgdm0uZ3JvdXBzLnB1c2gobmV3R3JvdXApO1xuICAgICAgICAgICAgICB2bS5zZWxlY3RlZEZvckdyb3VwID0gW107XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICB2bS5ncm91cHMucHVzaChuZXdHcm91cCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGNsb25lU2VsZWN0aW9uKCl7XG4gICAgICAgICAgdmFyIG5ld0dyb3VwID0ge1xuICAgICAgICAgICAgdGl0bGU6J0Nsb25lZCBFbGVtZW50cycsXG4gICAgICAgICAgICBpc0dyb3VwOnRydWUsXG4gICAgICAgICAgICBub2RlczpbXVxuICAgICAgICAgIH07XG4gICAgICAgICAgYW5ndWxhci5mb3JFYWNoKHZtLnNlbGVjdGVkRm9yR3JvdXAsIGZ1bmN0aW9uKGl0ZW0sIGtleSl7XG4gICAgICAgICAgICBuZXdHcm91cC5ub2Rlcy5wdXNoKGl0ZW0pO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIHZtLmdyb3Vwcy5wdXNoKG5ld0dyb3VwKTtcbiAgICAgICAgICB2bS5zZWxlY3RlZEZvckdyb3VwID0gW107XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gZWRpdEVudHJ5KGl0ZW0pe1xuICAgICAgICAgIHZtLmVkaXRJdGVtID0gaXRlbTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiByZW1vdmVFbnRyeShpdGVtLCBsaXN0KXtcbiAgICAgICAgICAgIGRlbGV0ZUZyb21Hcm91cChpdGVtLCBsaXN0KTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBzYXZlSW5kZXgoKXtcbiAgICAgICAgICBpZih2bS5zYXZlRGlzYWJsZWQpe1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICB2bS5zYXZlRGlzYWJsZWQgPSB0cnVlO1xuICAgICAgICAgIGlmKHR5cGVvZiB2bS5uZXdJbmRleCA9PSAndW5kZWZpbmVkJyl7XG4gICAgICAgICAgICB0b2FzdHIuZXJyb3IoJ1lvdSBuZWVkIHRvIGVudGVyIGEgdGl0bGUhJywnSW5mbyBtaXNzaW5nJyk7XG4gICAgICAgICAgICB2bS5zYXZlRGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYoIXZtLm5ld0luZGV4LnRpdGxlKXtcbiAgICAgICAgICAgIHRvYXN0ci5lcnJvcignWW91IG5lZWQgdG8gZW50ZXIgYSB0aXRsZSEnLCdJbmZvIG1pc3NpbmcnKTtcbiAgICAgICAgICAgIHZtLnNhdmVEaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICB2bS5uZXdJbmRleC5kYXRhID0gdm0uZ3JvdXBzO1xuICAgICAgICAgIERhdGFTZXJ2aWNlLnBvc3QoJ2luZGV4Jywgdm0ubmV3SW5kZXgpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgICAgICAgdm0uc2F2ZURpc2FibGVkID0gZmFsc2U7XG4gICAgICAgICAgICB0b2FzdHIuc3VjY2VzcygnWW91ciBJbmRleCBoYXMgYmVlbiBjcmVhdGVkJywgJ1N1Y2Nlc3MnKSxcbiAgICAgICAgICAgICRzdGF0ZS5nbygnYXBwLmluZGV4LnNob3cnLCB7aW5kZXg6cmVzcG9uc2UubmFtZX0pO1xuICAgICAgICAgIH0sZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgICAgICAgdm0uc2F2ZURpc2FibGVkID0gZmFsc2U7XG4gICAgICAgICAgICB0b2FzdHIuZXJyb3IocmVzcG9uc2UubWVzc2FnZSwnVXBwcyEhJyk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgLyokc2NvcGUuJG9uKFwiJHN0YXRlQ2hhbmdlU3VjY2Vzc1wiLCBmdW5jdGlvbiAoZXZlbnQsIHRvU3RhdGUsIHRvUGFyYW1zLCBmcm9tU3RhdGUsIGZyb21QYXJhbXMpIHtcbiAgICAgICAgICBpZighdm0uZGF0YS5sZW5ndGgpe1xuICAgICAgICAgICAgJHN0YXRlLmdvKCdhcHAuaW5kZXguY3JlYXRlJyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICBzd2l0Y2ggKHRvU3RhdGUubmFtZSkge1xuICAgICAgICAgICAgICBjYXNlICdhcHAuaW5kZXguY3JlYXRlJzpcbiAgICAgICAgICAgICAgICAgIHZtLnN0ZXAgPSAwO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICBjYXNlICdhcHAuaW5kZXguY3JlYXRlLmJhc2ljJzpcbiAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHZtLmRhdGEpO1xuICAgICAgICAgICAgICAgICAgICB2bS5zdGVwID0gMTtcbiAgICAgICAgICAgICAgICAgICAgY2hlY2tNeURhdGEoKTtcbiAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICBjYXNlICdhcHAuaW5kZXguY3JlYXRlLmNoZWNrJzpcbiAgICAgICAgICAgICAgICAgIHZtLnN0ZXAgPSAyO1xuICAgICAgICAgICAgICAgICAgdm0uc2hvd1VwbG9hZENvbnRhaW5lciA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICBjYXNlICdhcHAuaW5kZXguY3JlYXRlLm1ldGEnOlxuICAgICAgICAgICAgICAgICAgdm0uc3RlcCA9IDM7XG4gICAgICAgICAgICAgICAgICAgIHZtLnNob3dVcGxvYWRDb250YWluZXIgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICBjYXNlICdhcHAuaW5kZXguY3JlYXRlLmZpbmFsJzpcbiAgICAgICAgICAgICAgICAgIHZtLnN0ZXAgPSA0O1xuICAgICAgICAgICAgICAgICAgICB2bS5zaG93VXBsb2FkQ29udGFpbmVyID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pOyovXG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignSW5kZXhlZGl0b3JDdHJsJywgZnVuY3Rpb24gKCRmaWx0ZXIsRGF0YVNlcnZpY2UpIHtcblx0XHQvL1xuXHRcdHZhciB2bSA9IHRoaXM7XG5cblx0XHR2bS5pbmRpY2F0b3JzID0gW107XG5cblx0XHRhY3RpdmF0ZSgpO1xuXG5cdFx0ZnVuY3Rpb24gYWN0aXZhdGUoKXtcblx0XHRcdGxvYWRBbGwoKTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBsb2FkQWxsKCl7XG5cdFx0XHR2bS5pbmRpY2F0b3JzID0gRGF0YVNlcnZpY2UuZ2V0QWxsKCdpbmRpY2F0b3JzJykuJG9iamVjdFxuXHRcdH1cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignSW5kZXhpbmZvQ3RybCcsIGZ1bmN0aW9uKEluZGl6ZXNTZXJ2aWNlKXtcbiAgICAgICAgdmFyIHZtID0gdGhpcztcbiAgICAgICAgdm0uc3RydWN0dXJlID0gSW5kaXplc1NlcnZpY2UuZ2V0U3RydWN0dXJlKCk7XG4gICAgfSk7XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignTG9naW5DdHJsJywgZnVuY3Rpb24oJHJvb3RTY29wZSwgJHN0YXRlLCAkYXV0aCwgdG9hc3RyKXtcbiAgICAgICAgdmFyIHZtID0gdGhpcztcbiAgICAgICAgdm0ucHJldlN0YXRlID0gbnVsbDtcbiAgICAgICAgdm0uZG9Mb2dpbiA9IGRvTG9naW47XG4gICAgICAgIHZtLmNoZWNrTG9nZ2VkSW4gPSBjaGVja0xvZ2dlZEluO1xuICAgICAgICB2bS51c2VyID0ge1xuICAgICAgICAgIGVtYWlsOicnLFxuICAgICAgICAgIHBhc3N3b3JkOicnXG4gICAgICAgIH07XG5cbiAgICAgICAgYWN0aXZhdGUoKTtcblxuICAgICAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpe1xuICAgICAgICAgIHZtLmNoZWNrTG9nZ2VkSW4oKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGNoZWNrTG9nZ2VkSW4oKXtcblxuICAgICAgICAgIGlmKCRhdXRoLmlzQXV0aGVudGljYXRlZCgpKXtcbiAgICAgICAgICAgIC8vJHN0YXRlLmdvKCdhcHAuaW5kZXguc2hvdycsIHtpbmRleDonZXBpJ30pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBkb0xvZ2luKCl7XG4gICAgICAgICAgJGF1dGgubG9naW4odm0udXNlcikudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICAgICAgICB0b2FzdHIuc3VjY2VzcygnWW91IGhhdmUgc3VjY2Vzc2Z1bGx5IHNpZ25lZCBpbicpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coJHJvb3RTY29wZS5wcmV2aW91c1BhZ2UpO1xuICAgICAgICAgICAgJHN0YXRlLmdvKCRyb290U2NvcGUucHJldmlvdXNQYWdlLnN0YXRlLm5hbWUgfHwgJ2FwcC5ob21lJywgJHJvb3RTY29wZS5wcmV2aW91c1BhZ2UucGFyYW1zKTtcbiAgICAgICAgICB9KS5jYXRjaChmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICAgICAgICB0b2FzdHIuZXJyb3IoJ1BsZWFzZSBjaGVjayB5b3VyIGVtYWlsIGFuZCBwYXNzd29yZCcsICdTb21ldGhpbmcgd2VudCB3cm9uZycpO1xuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdNYXBDdHJsJywgZnVuY3Rpb24gKGxlYWZsZXREYXRhLCBWZWN0b3JsYXllclNlcnZpY2UpIHtcblx0XHQvL1xuXHRcdHZhciB2bSA9IHRoaXM7XG5cdFx0dmFyIGFwaUtleSA9IFZlY3RvcmxheWVyU2VydmljZS5rZXlzLm1hcGJveDtcblxuXHRcdHZtLmRlZmF1bHRzID0ge1xuXHRcdFx0c2Nyb2xsV2hlZWxab29tOiBmYWxzZVxuXHRcdH07XG5cdFx0dm0uY2VudGVyID0ge1xuXHRcdFx0bGF0OiAwLFxuXHRcdFx0bG5nOiAwLFxuXHRcdFx0em9vbTogM1xuXHRcdH07XG5cdFx0dm0ubGF5ZXJzID0ge1xuXHRcdFx0YmFzZWxheWVyczoge1xuXHRcdFx0XHR4eXo6IHtcblx0XHRcdFx0XHRuYW1lOiAnTWFwQm94IE91dGRvb3JzIE1vZCcsXG5cdFx0XHRcdFx0dXJsOiAnaHR0cHM6Ly97c30udGlsZXMubWFwYm94LmNvbS92NC92YWxkZXJyYW1hLmQ4NjExNGI2L3t6fS97eH0ve3l9LnBuZz9hY2Nlc3NfdG9rZW49JyArIGFwaUtleSxcblx0XHRcdFx0XHR0eXBlOiAneHl6Jyxcblx0XHRcdFx0XHRsYXllck9wdGlvbnM6e1xuXHRcdFx0XHRcdFx0XHRub1dyYXA6IHRydWUsXG5cdFx0XHRcdFx0XHRcdGNvbnRpbnVvdXNXb3JsZDogZmFsc2Vcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH07XG5cdFx0dm0ubWF4Ym91bmRzID0ge1xuXHRcdFx0c291dGhXZXN0OiB7XG5cdFx0XHRcdGxhdDogOTAsXG5cdFx0XHRcdGxuZzogMTgwXG5cdFx0XHR9LFxuXHRcdFx0bm9ydGhFYXN0OiB7XG5cdFx0XHRcdGxhdDogLTkwLFxuXHRcdFx0XHRsbmc6IC0xODBcblx0XHRcdH1cblx0XHR9O1xuXHRcdGxlYWZsZXREYXRhLmdldE1hcCgnbWFwJykudGhlbihmdW5jdGlvbiAobWFwKSB7XG5cdFx0XHR2YXIgdXJsID0gJ2h0dHA6Ly92MjIwMTUwNTI4MzU4MjUzNTgueW91cnZzZXJ2ZXIubmV0OjMwMDEvc2VydmljZXMvcG9zdGdpcy8nICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldE5hbWUoKSArICcvZ2VvbS92ZWN0b3ItdGlsZXMve3p9L3t4fS97eX0ucGJmP2ZpZWxkcz0nICsgVmVjdG9ybGF5ZXJTZXJ2aWNlLmZpZWxkcygpOyAvL1xuXHRcdFx0dmFyIGxheWVyID0gbmV3IEwuVGlsZUxheWVyLk1WVFNvdXJjZSh7XG5cdFx0XHRcdHVybDogdXJsLFxuXHRcdFx0XHRkZWJ1ZzogZmFsc2UsXG5cdFx0XHRcdGNsaWNrYWJsZUxheWVyczogW1ZlY3RvcmxheWVyU2VydmljZS5nZXROYW1lKCkgKyAnX2dlb20nXSxcblx0XHRcdFx0bXV0ZXhUb2dnbGU6IHRydWUsXG5cdFx0XHRcdGdldElERm9yTGF5ZXJGZWF0dXJlOiBmdW5jdGlvbiAoZmVhdHVyZSkge1xuXHRcdFx0XHRcdHJldHVybiBmZWF0dXJlLnByb3BlcnRpZXMuaXNvX2EyO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRmaWx0ZXI6IGZ1bmN0aW9uIChmZWF0dXJlLCBjb250ZXh0KSB7XG5cblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0XHRtYXAuYWRkTGF5ZXIoVmVjdG9ybGF5ZXJTZXJ2aWNlLnNldExheWVyKGxheWVyKSk7XG5cdFx0XHR2YXIgbGFiZWxzTGF5ZXIgPSBMLnRpbGVMYXllcignaHR0cHM6Ly97c30udGlsZXMubWFwYm94LmNvbS92NC9tYWdub2xvLjA2MDI5YTljL3t6fS97eH0ve3l9LnBuZz9hY2Nlc3NfdG9rZW49JyArIGFwaUtleSx7XG5cblx0XHRcdFx0XHRcdG5vV3JhcDogdHJ1ZSxcblx0XHRcdFx0XHRcdGNvbnRpbnVvdXNXb3JsZDogZmFsc2Vcblx0XHRcdFx0XG5cdFx0XHR9KTtcblx0XHRcdG1hcC5hZGRMYXllcihsYWJlbHNMYXllcik7XG5cdFx0XHRsYWJlbHNMYXllci5icmluZ1RvRnJvbnQoKTtcblx0XHR9KTtcblx0fSk7XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignU2VsZWN0ZWRDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBnZXRDb3VudHJ5LCBWZWN0b3JsYXllclNlcnZpY2UsICRmaWx0ZXIpe1xuICAgICAgICAvL1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuICAgICAgICB2bS5zdHJ1Y3R1cmUgPSAkc2NvcGUuJHBhcmVudC52bS5zdHJ1Y3R1cmU7XG4gICAgICAgIHZtLmRpc3BsYXkgPSAkc2NvcGUuJHBhcmVudC52bS5kaXNwbGF5O1xuICAgICAgICB2bS5kYXRhID0gJHNjb3BlLiRwYXJlbnQudm0uZGF0YTtcbiAgICAgICAgdm0uY3VycmVudCA9IGdldENvdW50cnk7XG4gICAgICAgIHZtLm12dFNvdXJjZSA9IFZlY3RvcmxheWVyU2VydmljZS5nZXRMYXllcigpO1xuICAgICAgICB2bS5nZXRSYW5rID0gZ2V0UmFuaztcbiAgICAgICAgdm0uZ2V0T2Zmc2V0ID0gZ2V0T2Zmc2V0O1xuICAgICAgICB2bS5nZXRUZW5kZW5jeSA9IGdldFRlbmRlbmN5O1xuXG4gICAgICAgIGZ1bmN0aW9uIGNhbGNSYW5rKCkge1xuICAgICAgICAgIHZhciByYW5rID0gMDtcbiAgICAgICAgICBhbmd1bGFyLmZvckVhY2godm0uZGF0YSwgZnVuY3Rpb24oaXRlbSkge1xuICAgICAgICAgICAgaXRlbVt2bS5zdHJ1Y3R1cmUuc2NvcmVfZmllbGRfbmFtZV0gPSBwYXJzZUZsb2F0KGl0ZW1bdm0uc3RydWN0dXJlLnNjb3JlX2ZpZWxkX25hbWVdKTtcbiAgICAgICAgICAgIGl0ZW1bJ3Njb3JlJ10gPSBwYXJzZUludChpdGVtWydzY29yZSddKTtcbiAgICAgICAgICB9KVxuICAgICAgICAgIHZhciBmaWx0ZXIgPSAkZmlsdGVyKCdvcmRlckJ5Jykodm0uZGF0YSwgW3ZtLnN0cnVjdHVyZS5zY29yZV9maWVsZF9uYW1lLCBcInNjb3JlXCJdLCB0cnVlKTtcbiAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGZpbHRlci5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKGZpbHRlcltpXS5pc28gPT0gdm0uY3VycmVudC5pc28pIHtcbiAgICAgICAgICAgICAgcmFuayA9IGkgKyAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICB2bS5jdXJyZW50W3ZtLnN0cnVjdHVyZS5zY29yZV9maWVsZF9uYW1lKydfcmFuayddID0gcmFuaztcbiAgICAgICAgICB2bS5jaXJjbGVPcHRpb25zID0ge1xuICAgICAgICAgICAgICBjb2xvcjp2bS5zdHJ1Y3R1cmUuY29sb3IsXG4gICAgICAgICAgICAgIGZpZWxkOnZtLnN0cnVjdHVyZS5zY29yZV9maWVsZF9uYW1lKydfcmFuaydcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gZ2V0UmFuayhjb3VudHJ5KXtcbiAgICAgICAgICB2YXIgZmlsdGVyID0gJGZpbHRlcignb3JkZXJCeScpKHZtLmRhdGEsIFt2bS5zdHJ1Y3R1cmUuc2NvcmVfZmllbGRfbmFtZSwgXCJzY29yZVwiXSwgdHJ1ZSk7XG4gICAgICAgICAgdmFyIHJhbmsgPSAwO1xuICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaChmaWx0ZXIsIGZ1bmN0aW9uKGl0ZW0sIGtleSl7XG4gICAgICAgICAgICBpZihpdGVtLmNvdW50cnkgPT0gY291bnRyeS5jb3VudHJ5KXtcbiAgICAgICAgICAgICAgcmFuayA9IGtleTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgICByZXR1cm4gcmFuaysxO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGdldE9mZnNldCgpIHtcbiAgICBcdFx0XHRpZiAoIXZtLmN1cnJlbnQpIHtcbiAgICBcdFx0XHRcdHJldHVybiAwO1xuICAgIFx0XHRcdH1cbiAgICBcdFx0XHRyZXR1cm4gKHZtLmdldFJhbmsodm0uY3VycmVudCkgLSAyKSAqIDE2O1xuICAgIFx0XHR9O1xuXG4gICAgXHRcdGZ1bmN0aW9uIGdldFRlbmRlbmN5KCkge1xuICAgIFx0XHRcdGlmICghdm0uY3VycmVudCkge1xuICAgIFx0XHRcdFx0cmV0dXJuICdhcnJvd19kcm9wX2Rvd24nXG4gICAgXHRcdFx0fVxuICAgIFx0XHRcdHJldHVybiB2bS5jdXJyZW50LnBlcmNlbnRfY2hhbmdlID4gMCA/ICdhcnJvd19kcm9wX3VwJyA6ICdhcnJvd19kcm9wX2Rvd24nO1xuICAgIFx0XHR9O1xuXG4gICAgICAgICRzY29wZS4kd2F0Y2goJ3ZtLmN1cnJlbnQnLCBmdW5jdGlvbiAobiwgbykge1xuICAgICAgICAgIGlmIChuID09PSBvKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZihvLmlzbyl7XG4gICAgICAgICAgICAgIHZtLm12dFNvdXJjZS5sYXllcnMuY291bnRyaWVzX2JpZ19nZW9tLmZlYXR1cmVzW28uaXNvXS5zZWxlY3RlZCA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2FsY1JhbmsoKTtcbiAgICAgICAgICAgIGZldGNoTmF0aW9uRGF0YShuLmlzbyk7XG5cblxuICAgICAgICB9KTtcbiAgICAgICAgLyo7Ki9cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignU2lkZWJhckN0cmwnLCBmdW5jdGlvbigkc2NvcGUsICRzdGF0ZSl7XG5cblxuXHR9KTtcblxufSkoKTsiLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdTaWdudXBDdHJsJywgZnVuY3Rpb24oKXtcbiAgICAgICAgLy9cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignVG9hc3RzQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgVG9hc3RTZXJ2aWNlKXtcblxuXHRcdCRzY29wZS50b2FzdFN1Y2Nlc3MgPSBmdW5jdGlvbigpe1xuXHRcdFx0VG9hc3RTZXJ2aWNlLnNob3coJ1VzZXIgYWRkZWQgc3VjY2Vzc2Z1bGx5IScpO1xuXHRcdH07XG5cblx0XHQkc2NvcGUudG9hc3RFcnJvciA9IGZ1bmN0aW9uKCl7XG5cdFx0XHRUb2FzdFNlcnZpY2UuZXJyb3IoJ0Nvbm5lY3Rpb24gaW50ZXJydXB0ZWQhJyk7XG5cdFx0fTtcblxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ1Vuc3VwcG9ydGVkQnJvd3NlckN0cmwnLCBmdW5jdGlvbigpe1xuICAgICAgICAvL1xuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignVXNlckN0cmwnLCBmdW5jdGlvbigpe1xuICAgICAgICAvL1xuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignQWRkVXNlcnNDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBEaWFsb2dTZXJ2aWNlKXtcblxuICAgICAgICAkc2NvcGUuc2F2ZSA9IGZ1bmN0aW9uKCl7XG5cdCAgICAgICAgLy9kbyBzb21ldGhpbmcgdXNlZnVsXG4gICAgICAgICAgICBEaWFsb2dTZXJ2aWNlLmhpZGUoKTtcbiAgICAgICAgfTtcblxuICAgICAgICAkc2NvcGUuaGlkZSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIFx0RGlhbG9nU2VydmljZS5oaWRlKCk7XG4gICAgICAgIH07XG5cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0NvcHlwcm92aWRlckN0cmwnLCBmdW5jdGlvbigkc2NvcGUsIERpYWxvZ1NlcnZpY2Upe1xuICAgICAgICAkc2NvcGUuJHBhcmVudC52bS5hc2tlZFRvUmVwbGljYXRlID0gdHJ1ZTtcbiAgICAgICAgJHNjb3BlLiRwYXJlbnQudm0uZG9Qcm92aWRlcnMgPSB0cnVlO1xuICAgICAgICAkc2NvcGUuJHBhcmVudC52bS5kb0NhdGVnb3JpZXMgPSB0cnVlO1xuICAgICAgICAkc2NvcGUuJHBhcmVudC52bS5kb01lYXN1cmVzID0gdHJ1ZTtcbiAgICAgICAgJHNjb3BlLiRwYXJlbnQudm0uZG9QdWJsaWMgPSB0cnVlO1xuICAgICAgICAkc2NvcGUuc2F2ZSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgJHNjb3BlLiRwYXJlbnQudm0uaXRlbS5kYXRhcHJvdmlkZXIgPSAkc2NvcGUuJHBhcmVudC52bS5kb1Byb3ZpZGVycyA/ICRzY29wZS4kcGFyZW50LnZtLnByZVByb3ZpZGVyIDogW107XG4gICAgICAgICAgJHNjb3BlLiRwYXJlbnQudm0uaXRlbS5tZWFzdXJlX3R5cGVfaWQgPSAkc2NvcGUuJHBhcmVudC52bS5kb01lYXN1cmVzID8gJHNjb3BlLiRwYXJlbnQudm0ucHJlTWVhc3VyZSA6IDA7XG4gICAgICAgICAgJHNjb3BlLiRwYXJlbnQudm0uaXRlbS5jYXRlZ29yaWVzID0gJHNjb3BlLiRwYXJlbnQudm0uZG9DYXRlZ29yaWVzID8gJHNjb3BlLiRwYXJlbnQudm0ucHJlQ2F0ZWdvcmllczogW107XG4gICAgICAgICAgJHNjb3BlLiRwYXJlbnQudm0uaXRlbS5pc19wdWJsaWMgPSAkc2NvcGUuJHBhcmVudC52bS5kb1B1YmxpYyA/ICRzY29wZS4kcGFyZW50LnZtLnByZVB1YmxpYzogZmFsc2U7XG4gICAgICAgICAgICBEaWFsb2dTZXJ2aWNlLmhpZGUoKTtcbiAgICAgICAgfTtcblxuICAgICAgICAkc2NvcGUuaGlkZSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgJHNjb3BlLiRwYXJlbnQudm0uZG9Qcm92aWRlcnMgPSBmYWxzZTtcbiAgICAgICAgICAkc2NvcGUuJHBhcmVudC52bS5kb0NhdGVnb3JpZXMgPSBmYWxzZTtcbiAgICAgICAgICAkc2NvcGUuJHBhcmVudC52bS5kb01lYXN1cmVzID0gZmFsc2U7XG4gICAgICAgIFx0RGlhbG9nU2VydmljZS5oaWRlKCk7XG4gICAgICAgIH07XG5cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0VkaXRjb2x1bW5DdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBEaWFsb2dTZXJ2aWNlKXtcbiAgICAgICAgJHNjb3BlLm5hbWUgPSAkc2NvcGUuJHBhcmVudC52bS50b0VkaXQ7XG4gICAgICAgIGlmKHR5cGVvZiAkc2NvcGUuJHBhcmVudC52bS5tZXRhLnRhYmxlWyRzY29wZS5uYW1lXSA9PSBcInVuZGVmaW5lZFwiKXtcbiAgICAgICAgICAkc2NvcGUuJHBhcmVudC52bS5tZXRhLnRhYmxlWyRzY29wZS5uYW1lXSA9IHt9O1xuICAgICAgICB9XG4gICAgICAgIGVsc2V7XG4gICAgICAgICAgaWYoJHNjb3BlLiRwYXJlbnQudm0ubWV0YS50YWJsZVskc2NvcGUubmFtZV0udGl0bGUpe1xuICAgICAgICAgICAgJHNjb3BlLnRpdGxlID0gJHNjb3BlLiRwYXJlbnQudm0ubWV0YS50YWJsZVskc2NvcGUubmFtZV0udGl0bGU7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmKCRzY29wZS4kcGFyZW50LnZtLm1ldGEudGFibGVbJHNjb3BlLm5hbWVdLmRlc2NyaXB0aW9uKXtcbiAgICAgICAgICAgICRzY29wZS5kZXNjcmlwdGlvbiA9ICRzY29wZS4kcGFyZW50LnZtLm1ldGEudGFibGVbJHNjb3BlLm5hbWVdLmRlc2NyaXB0aW9uO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgICRzY29wZS5zYXZlID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAkc2NvcGUuJHBhcmVudC52bS5tZXRhLnRhYmxlWyRzY29wZS5uYW1lXS50aXRsZSA9ICRzY29wZS50aXRsZTtcbiAgICAgICAgICAkc2NvcGUuJHBhcmVudC52bS5tZXRhLnRhYmxlWyRzY29wZS5uYW1lXS5kZXNjcmlwdGlvbiA9ICRzY29wZS5kZXNjcmlwdGlvbjtcbiAgICAgICAgICBEaWFsb2dTZXJ2aWNlLmhpZGUoKTtcbiAgICAgICAgfTtcblxuICAgICAgICAkc2NvcGUuaGlkZSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIFx0RGlhbG9nU2VydmljZS5oaWRlKCk7XG4gICAgICAgIH07XG5cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0VkaXRyb3dDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBEaWFsb2dTZXJ2aWNlKXtcbiAgICAgICAgJHNjb3BlLmRhdGEgPSAkc2NvcGUuJHBhcmVudC52bS5zZWxlY3RlZFswXTtcbiAgICAgICAgJHNjb3BlLnNhdmUgPSBmdW5jdGlvbigpe1xuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIERpYWxvZ1NlcnZpY2UuaGlkZSgpO1xuICAgICAgICB9O1xuXG4gICAgICAgICRzY29wZS5oaWRlID0gZnVuY3Rpb24oKXtcbiAgICAgICAgXHREaWFsb2dTZXJ2aWNlLmhpZGUoKTtcbiAgICAgICAgfTtcblxuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignRXh0ZW5kRGF0YUN0cmwnLCBmdW5jdGlvbigkc2NvcGUsJHN0YXRlLCBEaWFsb2dTZXJ2aWNlKXtcblxuICAgICAgICAkc2NvcGUuc2F2ZSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAkc2NvcGUudm0uZG9FeHRlbmQgPSB0cnVlO1xuICAgICAgICAgICAgJHNjb3BlLnZtLm1ldGEuaXNvX2ZpZWxkID0gJHNjb3BlLnZtLmFkZERhdGFUby5pc29fbmFtZTtcbiAgICAgICAgICAgICRzY29wZS52bS5tZXRhLmNvdW50cnlfZmllbGQgPSAkc2NvcGUudm0uYWRkRGF0YVRvLmNvdW50cnlfbmFtZTtcbiAgICAgICAgICAgICRzdGF0ZS5nbygnYXBwLmluZGV4LmNyZWF0ZS5jaGVjaycpO1xuICAgICAgICAgIFx0RGlhbG9nU2VydmljZS5oaWRlKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgJHNjb3BlLmhpZGUgPSBmdW5jdGlvbigpe1xuICAgICAgICAgICRzdGF0ZS5nbygnYXBwLmluZGV4LmNyZWF0ZS5jaGVjaycpO1xuICAgICAgICBcdERpYWxvZ1NlcnZpY2UuaGlkZSgpO1xuICAgICAgICB9O1xuXG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdMb29zZWRhdGFDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCAkc3RhdGUsIERpYWxvZ1NlcnZpY2Upe1xuXG4gICAgICAgICRzY29wZS5zYXZlID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAkc2NvcGUudm0uZGVsZXRlRGF0YSgpO1xuICAgICAgICAgICAgJHN0YXRlLmdvKCRzY29wZS50b1N0YXRlLm5hbWUpO1xuICAgICAgICAgICAgRGlhbG9nU2VydmljZS5oaWRlKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgJHNjb3BlLmhpZGUgPSBmdW5jdGlvbigpe1xuICAgICAgICBcdERpYWxvZ1NlcnZpY2UuaGlkZSgpO1xuICAgICAgICB9O1xuXG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdTZWxlY3Rpc29mZXRjaGVyc0N0cmwnLCBmdW5jdGlvbigkc2NvcGUsIERpYWxvZ1NlcnZpY2Upe1xuICAgICAgICAkc2NvcGUuaXNvID0gJHNjb3BlLiRwYXJlbnQudm0ubWV0YS5pc29fZmllbGQ7XG4gICAgICAgICRzY29wZS5saXN0ID0gJHNjb3BlLiRwYXJlbnQudm0udG9TZWxlY3Q7XG5cbiAgICAgICAgJHNjb3BlLnNhdmUgPSBmdW5jdGlvbigpe1xuICAgICAgICAgIERpYWxvZ1NlcnZpY2UuaGlkZSgpO1xuICAgICAgICB9O1xuXG4gICAgICAgICRzY29wZS5oaWRlID0gZnVuY3Rpb24oKXtcbiAgICAgICAgXHREaWFsb2dTZXJ2aWNlLmhpZGUoKTtcbiAgICAgICAgfTtcblxuICAgICAgICAkc2NvcGUuJHdhdGNoKCdsaXN0JywgZnVuY3Rpb24obiwgbyl7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhuKTtcbiAgICAgICAgICBpZihuID09PSBvKXtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgYW5ndWxhci5mb3JFYWNoKG4sIGZ1bmN0aW9uKGl0ZW0sIGtleSl7XG4gICAgICAgICAgICBpZihpdGVtLmVudHJ5LmRhdGFbMF1bJHNjb3BlLmlzb10gJiYgIW9ba2V5XS5lbnRyeS5kYXRhWzBdWyRzY29wZS5pc29dKXtcbiAgICAgICAgICAgICAgaXRlbS5lbnRyeS5lcnJvcnMuc3BsaWNlKDAsMSk7XG4gICAgICAgICAgICAgICRzY29wZS4kcGFyZW50LnZtLmlzb19lcnJvcnMgLS07XG4gICAgICAgICAgICAgICRzY29wZS4kcGFyZW50LnZtLmVycm9ycyAtLTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfSwgdHJ1ZSk7XG5cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSggJ2FwcC5jb250cm9sbGVycycgKS5jb250cm9sbGVyKCAnQnViYmxlc0N0cmwnLCBmdW5jdGlvbigpe1xuXHRcdC8vXG5cbiAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRmdW5jdGlvbiBDdXN0b21Ub29sdGlwKHRvb2x0aXBJZCwgd2lkdGgpIHtcblx0XHR2YXIgdG9vbHRpcElkID0gdG9vbHRpcElkO1xuXHRcdHZhciBlbGVtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodG9vbHRpcElkKTtcblx0XHRpZihlbGVtID09IG51bGwpe1xuXHRcdFx0YW5ndWxhci5lbGVtZW50KGRvY3VtZW50KS5maW5kKCdib2R5JykuYXBwZW5kKFwiPGRpdiBjbGFzcz0ndG9vbHRpcCBtZC13aGl0ZWZyYW1lLXozJyBpZD0nXCIgKyB0b29sdGlwSWQgKyBcIic+PC9kaXY+XCIpO1xuXHRcdH1cblx0XHRoaWRlVG9vbHRpcCgpO1xuXHRcdGZ1bmN0aW9uIHNob3dUb29sdGlwKGNvbnRlbnQsIGRhdGEsIGV2ZW50LCBlbGVtZW50KSB7XG5cdFx0XHRhbmd1bGFyLmVsZW1lbnQoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignIycgKyB0b29sdGlwSWQpKS5odG1sKGNvbnRlbnQpO1xuXHRcdFx0YW5ndWxhci5lbGVtZW50KGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyMnICsgdG9vbHRpcElkKSkuY3NzKCdkaXNwbGF5JywgJ2Jsb2NrJyk7XG5cblx0XHRcdHJldHVybiB1cGRhdGVQb3NpdGlvbihldmVudCwgZGF0YSwgZWxlbWVudCk7XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIGhpZGVUb29sdGlwKCkge1xuXHRcdFx0YW5ndWxhci5lbGVtZW50KGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyMnICsgdG9vbHRpcElkKSkuY3NzKCdkaXNwbGF5JywgJ25vbmUnKTtcblx0XHR9XG5cdFx0ZnVuY3Rpb24gdXBkYXRlUG9zaXRpb24oZXZlbnQsIGQsIGVsZW1lbnQpIHtcblx0XHRcdHZhciB0dGlkID0gXCIjXCIgKyB0b29sdGlwSWQ7XG5cdFx0XHR2YXIgeE9mZnNldCA9IDIwO1xuXHRcdFx0dmFyIHlPZmZzZXQgPSAxMDtcblx0XHRcdHZhciBzdmcgPSBlbGVtZW50LmZpbmQoJ3N2ZycpWzBdOy8vZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3N2Z192aXMnKTtcblx0XHRcdHZhciB3c2NyWSA9IHdpbmRvdy5zY3JvbGxZO1xuXHRcdFx0dmFyIHR0dyA9IGFuZ3VsYXIuZWxlbWVudChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHR0aWQpKS5vZmZzZXRXaWR0aDtcblx0XHRcdHZhciB0dGggPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHR0aWQpLm9mZnNldEhlaWdodDtcblx0XHRcdHZhciB0dHRvcCA9IHN2Zy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3AgKyBkLnkgLSB0dGggLyAyO1xuXHRcdFx0dmFyIHR0bGVmdCA9IHN2Zy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5sZWZ0ICsgZC54ICsgZC5yYWRpdXMgKyAxMjtcblx0XHRcdHJldHVybiBhbmd1bGFyLmVsZW1lbnQoZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0dGlkKSkuY3NzKCd0b3AnLCB0dHRvcCArICdweCcpLmNzcygnbGVmdCcsIHR0bGVmdCArICdweCcpO1xuXHRcdH1cblx0XHRyZXR1cm4ge1xuXHRcdFx0c2hvd1Rvb2x0aXA6IHNob3dUb29sdGlwLFxuXHRcdFx0aGlkZVRvb2x0aXA6IGhpZGVUb29sdGlwLFxuXHRcdFx0dXBkYXRlUG9zaXRpb246IHVwZGF0ZVBvc2l0aW9uXG5cdFx0fVxuXHR9XG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZGlyZWN0aXZlcycpLmRpcmVjdGl2ZSgnYnViYmxlcycsIGZ1bmN0aW9uICgkY29tcGlsZSwgSWNvbnNTZXJ2aWNlKSB7XG5cdFx0dmFyIGRlZmF1bHRzO1xuXHRcdGRlZmF1bHRzID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0d2lkdGg6IDMwMCxcblx0XHRcdFx0aGVpZ2h0OiAzMDAsXG5cdFx0XHRcdGxheW91dF9ncmF2aXR5OiAwLFxuXHRcdFx0XHRzaXplZmFjdG9yOjMsXG5cdFx0XHRcdHZpczogbnVsbCxcblx0XHRcdFx0Zm9yY2U6IG51bGwsXG5cdFx0XHRcdGRhbXBlcjogMC4wODUsXG5cdFx0XHRcdGNpcmNsZXM6IG51bGwsXG5cdFx0XHRcdGJvcmRlcnM6IHRydWUsXG5cdFx0XHRcdGxhYmVsczogdHJ1ZSxcblx0XHRcdFx0ZmlsbF9jb2xvcjogZDMuc2NhbGUub3JkaW5hbCgpLmRvbWFpbihbXCJlaFwiLCBcImV2XCJdKS5yYW5nZShbXCIjYTMxMDMxXCIsIFwiI2JlY2NhZVwiXSksXG5cdFx0XHRcdG1heF9hbW91bnQ6ICcnLFxuXHRcdFx0XHRyYWRpdXNfc2NhbGU6ICcnLFxuXHRcdFx0XHRkdXJhdGlvbjogMTAwMCxcblx0XHRcdFx0dG9vbHRpcDogQ3VzdG9tVG9vbHRpcChcImJ1YmJsZXNfdG9vbHRpcFwiLCAyNDApXG5cdFx0XHR9O1xuXHRcdH07XG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlc3RyaWN0OiAnRScsXG5cdFx0XHRzY29wZToge1xuXHRcdFx0XHRjaGFydGRhdGE6ICc9Jyxcblx0XHRcdFx0ZGlyZWN0aW9uOiAnPScsXG5cdFx0XHRcdGdyYXZpdHk6ICc9Jyxcblx0XHRcdFx0c2l6ZWZhY3RvcjogJz0nLFxuXHRcdFx0XHRpbmRleGVyOiAnPScsXG5cdFx0XHRcdGJvcmRlcnM6ICdAJ1xuXHRcdFx0fSxcblx0XHRcdHJlcXVpcmU6ICduZ01vZGVsJyxcblx0XHRcdGxpbms6IGZ1bmN0aW9uIChzY29wZSwgZWxlbSwgYXR0cnMsIG5nTW9kZWwpIHtcblx0XHRcdFx0dmFyIG9wdGlvbnMgPSBhbmd1bGFyLmV4dGVuZChkZWZhdWx0cygpLCBhdHRycyk7XG5cdFx0XHRcdHZhciBub2RlcyA9IFtdLFxuXHRcdFx0XHRcdGxpbmtzID0gW10sXG5cdFx0XHRcdFx0bGFiZWxzID0gW10sXG5cdFx0XHRcdFx0Z3JvdXBzID0gW107XG5cblx0XHRcdFx0dmFyIG1heF9hbW91bnQgPSBkMy5tYXgoc2NvcGUuY2hhcnRkYXRhLCBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdHJldHVybiBwYXJzZUZsb2F0KGQudmFsdWUpO1xuXHRcdFx0XHR9KTtcblx0XHRcdFx0Ly9vcHRpb25zLmhlaWdodCA9IG9wdGlvbnMud2lkdGggKiAxLjE7XG5cdFx0XHRcdG9wdGlvbnMucmFkaXVzX3NjYWxlID0gZDMuc2NhbGUucG93KCkuZXhwb25lbnQoMC41KS5kb21haW4oWzAsIG1heF9hbW91bnRdKS5yYW5nZShbMiwgODVdKTtcblx0XHRcdFx0b3B0aW9ucy5jZW50ZXIgPSB7XG5cdFx0XHRcdFx0eDogb3B0aW9ucy53aWR0aCAvIDIsXG5cdFx0XHRcdFx0eTogb3B0aW9ucy5oZWlnaHQgLyAyXG5cdFx0XHRcdH07XG5cdFx0XHRcdG9wdGlvbnMuY2F0X2NlbnRlcnMgPSB7fTtcblxuXHRcdFx0XHR2YXIgY3JlYXRlX25vZGVzID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdGlmKHNjb3BlLmluZGV4ZXIuY2hpbGRyZW4ubGVuZ3RoID09IDIgJiYgc2NvcGUuaW5kZXhlci5jaGlsZHJlblswXS5jaGlsZHJlbi5sZW5ndGggPiAwKXtcblx0XHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChzY29wZS5pbmRleGVyLmNoaWxkcmVuLCBmdW5jdGlvbiAoZ3JvdXAsIGluZGV4KSB7XG5cdFx0XHRcdFx0XHRcdHZhciBkID0ge1xuXHRcdFx0XHRcdFx0XHRcdHR5cGU6IGdyb3VwLm5hbWUsXG5cdFx0XHRcdFx0XHRcdFx0bmFtZTogZ3JvdXAudGl0bGUsXG5cdFx0XHRcdFx0XHRcdFx0Z3JvdXA6IGdyb3VwLm5hbWUsXG5cdFx0XHRcdFx0XHRcdFx0Y29sb3I6IGdyb3VwLmNvbG9yLFxuXHRcdFx0XHRcdFx0XHRcdGljb246IGdyb3VwLmljb24sXG5cdFx0XHRcdFx0XHRcdFx0dW5pY29kZTogSWNvbnNTZXJ2aWNlLmdldFVuaWNvZGUoZ3JvdXAuaWNvbiksXG5cdFx0XHRcdFx0XHRcdFx0ZGF0YTogZ3JvdXAsXG5cdFx0XHRcdFx0XHRcdFx0Y2hpbGRyZW46Z3JvdXAuY2hpbGRyZW5cblx0XHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdFx0bGFiZWxzLnB1c2goZCk7XG5cdFx0XHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChncm91cC5jaGlsZHJlbiwgZnVuY3Rpb24gKGl0ZW0pIHtcblx0XHRcdFx0XHRcdFx0XHRpZiAoc2NvcGUuY2hhcnRkYXRhW2l0ZW0ubmFtZV0pIHtcblx0XHRcdFx0XHRcdFx0XHRcdHZhciBub2RlID0ge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR0eXBlOiBpdGVtLm5hbWUsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHJhZGl1czogc2NvcGUuY2hhcnRkYXRhW2l0ZW0ubmFtZV0gLyBzY29wZS5zaXplZmFjdG9yLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHR2YWx1ZTogc2NvcGUuY2hhcnRkYXRhW2l0ZW0ubmFtZV0sXG5cdFx0XHRcdFx0XHRcdFx0XHRcdG5hbWU6IGl0ZW0udGl0bGUsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGdyb3VwOiBncm91cC5uYW1lLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHR4OiBvcHRpb25zLmNlbnRlci54LFxuXHRcdFx0XHRcdFx0XHRcdFx0XHR5OiBvcHRpb25zLmNlbnRlci55LFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRjb2xvcjogaXRlbS5jb2xvcixcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWNvbjogaXRlbS5pY29uLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHR1bmljb2RlOiBJY29uc1NlcnZpY2UuZ2V0VW5pY29kZShpdGVtLmljb24pLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRkYXRhOiBpdGVtLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRjaGlsZHJlbjppdGVtXG5cdFx0XHRcdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdFx0XHRcdFx0bm9kZXMucHVzaChub2RlKTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRjcmVhdGVfZ3JvdXBzKCk7XG5cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZWxzZXtcblx0XHRcdFx0XHRcdHZhciBkID0ge1xuXHRcdFx0XHRcdFx0XHR0eXBlOiBzY29wZS5pbmRleGVyLm5hbWUsXG5cdFx0XHRcdFx0XHRcdG5hbWU6IHNjb3BlLmluZGV4ZXIudGl0bGUsXG5cdFx0XHRcdFx0XHRcdGdyb3VwOiBzY29wZS5pbmRleGVyLm5hbWUsXG5cdFx0XHRcdFx0XHRcdGNvbG9yOiBzY29wZS5pbmRleGVyLmNvbG9yLFxuXHRcdFx0XHRcdFx0XHRpY29uOiBzY29wZS5pbmRleGVyLmljb24sXG5cdFx0XHRcdFx0XHRcdHVuaWNvZGU6IHNjb3BlLmluZGV4ZXIudW5pY29kZSxcblx0XHRcdFx0XHRcdFx0ZGF0YTogc2NvcGUuaW5kZXhlci5kYXRhLFxuXHRcdFx0XHRcdFx0XHRjaGlsZHJlbjogc2NvcGUuaW5kZXhlci5jaGlsZHJlblxuXHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdGxhYmVscy5wdXNoKGQpO1xuXHRcdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKHNjb3BlLmluZGV4ZXIuY2hpbGRyZW4sIGZ1bmN0aW9uIChpdGVtKSB7XG5cdFx0XHRcdFx0XHRcdGlmIChzY29wZS5jaGFydGRhdGFbaXRlbS5uYW1lXSkge1xuXHRcdFx0XHRcdFx0XHRcdHZhciBub2RlID0ge1xuXHRcdFx0XHRcdFx0XHRcdFx0dHlwZTogaXRlbS5uYW1lLFxuXHRcdFx0XHRcdFx0XHRcdFx0cmFkaXVzOiBzY29wZS5jaGFydGRhdGFbaXRlbS5uYW1lXSAvIHNjb3BlLnNpemVmYWN0b3IsXG5cdFx0XHRcdFx0XHRcdFx0XHR2YWx1ZTogc2NvcGUuY2hhcnRkYXRhW2l0ZW0ubmFtZV0gLyBzY29wZS5zaXplZmFjdG9yLFxuXHRcdFx0XHRcdFx0XHRcdFx0bmFtZTogaXRlbS50aXRsZSxcblx0XHRcdFx0XHRcdFx0XHRcdGdyb3VwOiBzY29wZS5pbmRleGVyLm5hbWUsXG5cdFx0XHRcdFx0XHRcdFx0XHR4OiBvcHRpb25zLmNlbnRlci54LFxuXHRcdFx0XHRcdFx0XHRcdFx0eTogb3B0aW9ucy5jZW50ZXIueSxcblx0XHRcdFx0XHRcdFx0XHRcdGNvbG9yOiBpdGVtLmNvbG9yLFxuXHRcdFx0XHRcdFx0XHRcdFx0aWNvbjogaXRlbS5pY29uLFxuXHRcdFx0XHRcdFx0XHRcdFx0dW5pY29kZTogSWNvbnNTZXJ2aWNlLmdldFVuaWNvZGUoaXRlbS5pY29uKSxcblx0XHRcdFx0XHRcdFx0XHRcdGRhdGE6IGl0ZW0sXG5cdFx0XHRcdFx0XHRcdFx0XHRjaGlsZHJlbjppdGVtXG5cdFx0XHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdFx0XHRub2Rlcy5wdXNoKG5vZGUpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH07XG5cdFx0XHRcdHZhciBjbGVhcl9ub2RlcyA9IGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0bm9kZXMgPSBbXTtcblx0XHRcdFx0XHRsYWJlbHMgPSBbXTtcblx0XHRcdFx0fVxuXHRcdFx0XHR2YXIgY3JlYXRlX2dyb3VwcyA9IGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKG5vZGVzLCBmdW5jdGlvbihub2RlLCBrZXkpe1xuXHRcdFx0XHRcdFx0XHRvcHRpb25zLmNhdF9jZW50ZXJzW25vZGUuZ3JvdXBdID0ge1xuXHRcdFx0XHRcdFx0XHRcdHg6IG9wdGlvbnMud2lkdGggLyAyLFxuXHRcdFx0XHRcdFx0XHRcdHk6IG9wdGlvbnMuaGVpZ2h0IC8gMiArICgxIC0ga2V5KSxcblx0XHRcdFx0XHRcdFx0XHRkYW1wZXI6IDAuMDg1LFxuXHRcdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9O1xuXHRcdFx0XHR2YXIgY3JlYXRlX3ZpcyA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRhbmd1bGFyLmVsZW1lbnQoZWxlbSkuaHRtbCgnJyk7XG5cdFx0XHRcdFx0b3B0aW9ucy52aXMgPSBkMy5zZWxlY3QoZWxlbVswXSkuYXBwZW5kKFwic3ZnXCIpLmF0dHIoXCJ3aWR0aFwiLCBvcHRpb25zLndpZHRoKS5hdHRyKFwiaGVpZ2h0XCIsIG9wdGlvbnMuaGVpZ2h0KS5hdHRyKFwiaWRcIiwgXCJzdmdfdmlzXCIpO1xuXG5cdFx0XHRcdFx0aWYgKCFvcHRpb25zLmJvcmRlcnMpIHtcblx0XHRcdFx0XHRcdHZhciBwaSA9IE1hdGguUEk7XG5cdFx0XHRcdFx0XHRpZihsYWJlbHMubGVuZ3RoID09IDIpe1xuXHRcdFx0XHRcdFx0XHR2YXIgYXJjVG9wID0gZDMuc3ZnLmFyYygpXG5cdFx0XHRcdFx0XHRcdFx0LmlubmVyUmFkaXVzKDEwOSlcblx0XHRcdFx0XHRcdFx0XHQub3V0ZXJSYWRpdXMoMTEwKVxuXHRcdFx0XHRcdFx0XHRcdC5zdGFydEFuZ2xlKC05MCAqIChwaSAvIDE4MCkpIC8vY29udmVydGluZyBmcm9tIGRlZ3MgdG8gcmFkaWFuc1xuXHRcdFx0XHRcdFx0XHRcdC5lbmRBbmdsZSg5MCAqIChwaSAvIDE4MCkpOyAvL2p1c3QgcmFkaWFuc1xuXHRcdFx0XHRcdFx0XHR2YXIgYXJjQm90dG9tID0gZDMuc3ZnLmFyYygpXG5cdFx0XHRcdFx0XHRcdFx0LmlubmVyUmFkaXVzKDEzNClcblx0XHRcdFx0XHRcdFx0XHQub3V0ZXJSYWRpdXMoMTM1KVxuXHRcdFx0XHRcdFx0XHRcdC5zdGFydEFuZ2xlKDkwICogKHBpIC8gMTgwKSkgLy9jb252ZXJ0aW5nIGZyb20gZGVncyB0byByYWRpYW5zXG5cdFx0XHRcdFx0XHRcdFx0LmVuZEFuZ2xlKDI3MCAqIChwaSAvIDE4MCkpOyAvL2p1c3QgcmFkaWFuc1xuXG5cdFx0XHRcdFx0XHRcdG9wdGlvbnMuYXJjVG9wID0gb3B0aW9ucy52aXMuYXBwZW5kKFwicGF0aFwiKVxuXHRcdFx0XHRcdFx0XHRcdC5hdHRyKFwiZFwiLCBhcmNUb3ApXG5cdFx0XHRcdFx0XHRcdFx0LmF0dHIoXCJmaWxsXCIsIGZ1bmN0aW9uKGQpe1xuXHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIGxhYmVsc1swXS5jb2xvciB8fCBcIiNiZTVmMDBcIjtcblx0XHRcdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0XHRcdC5hdHRyKFwiaWRcIiwgXCJhcmNUb3BcIilcblx0XHRcdFx0XHRcdFx0XHQuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIisob3B0aW9ucy53aWR0aC8yKStcIixcIisob3B0aW9ucy5oZWlnaHQvMiAtIG9wdGlvbnMuaGVpZ2h0LzEyKStcIilcIik7XG5cdFx0XHRcdFx0XHRcdG9wdGlvbnMuYXJjQm90dG9tID0gb3B0aW9ucy52aXMuYXBwZW5kKFwicGF0aFwiKVxuXHRcdFx0XHRcdFx0XHRcdC5hdHRyKFwiZFwiLCBhcmNCb3R0b20pXG5cdFx0XHRcdFx0XHRcdFx0LmF0dHIoXCJpZFwiLCBcImFyY0JvdHRvbVwiKVxuXHRcdFx0XHRcdFx0XHRcdC5hdHRyKFwiZmlsbFwiLCBmdW5jdGlvbihkKXtcblx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiBsYWJlbHNbMV0uY29sb3IgfHwgXCIjMDA2YmI2XCI7XG5cdFx0XHRcdFx0XHRcdFx0fSApXG5cdFx0XHRcdFx0XHRcdFx0LmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIrKG9wdGlvbnMud2lkdGgvMikrXCIsXCIrKG9wdGlvbnMuaGVpZ2h0LzIpK1wiKVwiKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGVsc2V7XG5cdFx0XHRcdFx0XHRcdHZhciBhcmMgPSBkMy5zdmcuYXJjKClcblx0XHRcdFx0XHRcdFx0XHQuaW5uZXJSYWRpdXMob3B0aW9ucy53aWR0aC8zIC0gMSlcblx0XHRcdFx0XHRcdFx0XHQub3V0ZXJSYWRpdXMob3B0aW9ucy53aWR0aC8zKVxuXHRcdFx0XHRcdFx0XHRcdC5zdGFydEFuZ2xlKDAgKiAocGkgLyAxODApKSAvL2NvbnZlcnRpbmcgZnJvbSBkZWdzIHRvIHJhZGlhbnNcblx0XHRcdFx0XHRcdFx0XHQuZW5kQW5nbGUoMzYwICogKHBpIC8gMTgwKSk7IC8vanVzdCByYWRpYW5zXG5cblxuXHRcdFx0XHRcdFx0XHRvcHRpb25zLmFyYyA9IG9wdGlvbnMudmlzLmFwcGVuZChcInBhdGhcIilcblx0XHRcdFx0XHRcdFx0XHQuYXR0cihcImRcIiwgYXJjKVxuXHRcdFx0XHRcdFx0XHRcdC5hdHRyKFwiZmlsbFwiLCBsYWJlbHNbMF0uY29sb3IpXG5cdFx0XHRcdFx0XHRcdFx0LmF0dHIoXCJpZFwiLCBcImFyY1RvcFwiKVxuXHRcdFx0XHRcdFx0XHRcdC5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiKyhvcHRpb25zLndpZHRoLzIpK1wiLFwiKyhvcHRpb25zLmhlaWdodC8yKStcIilcIik7XG5cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdGlmKG9wdGlvbnMubGFiZWxzID09IHRydWUgJiYgbGFiZWxzLmxlbmd0aCA9PSAyKXtcblx0XHRcdFx0XHRcdHZhciB0ZXh0TGFiZWxzID0gb3B0aW9ucy52aXMuc2VsZWN0QWxsKCd0ZXh0LmxhYmVscycpLmRhdGEobGFiZWxzKS5lbnRlcigpLmFwcGVuZChcInRleHRcIilcblx0XHRcdFx0XHRcdFx0LmF0dHIoJ2NsYXNzJywgJ2xhYmVscycpXG5cdFx0XHRcdFx0XHRcdC5hdHRyKCdmaWxsJywgZnVuY3Rpb24oZCl7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIGQuY29sb3I7XG5cdFx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0XHQvKlx0LmF0dHIoJ3RyYW5zZm9ybScsIGZ1bmN0aW9uKGQpe1xuXHRcdFx0XHRcdFx0XHRcdHZhciBpbmRleCA9IGxhYmVscy5pbmRleE9mKGQpO1xuXHRcdFx0XHRcdFx0XHRcdGlmKGluZGV4ID4gMCl7XG5cdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gJ3JvdGF0ZSg5MCwgMTAwLCAxMDApJztcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH0pKi9cblx0XHRcdFx0XHRcdFx0LmF0dHIoJ3gnLCBcIjUwJVwiKVxuXHRcdFx0XHRcdFx0XHQuc3R5bGUoJ2ZvbnQtc2l6ZScsICcxLjJlbScpXG5cdFx0XHRcdFx0XHRcdC5zdHlsZSgnY3Vyc29yJywgJ3BvaW50ZXInKVxuXG5cdFx0XHRcdFx0XHRcdC5hdHRyKCd3aWR0aCcsIG9wdGlvbnMud2lkdGgpXG5cdFx0XHRcdFx0XHRcdC5hdHRyKCd0ZXh0LWFuY2hvcicsICdtaWRkbGUnKVxuXHRcdFx0XHRcdFx0XHQub24oJ2NsaWNrJywgZnVuY3Rpb24oZCl7XG5cdFx0XHRcdFx0XHRcdFx0bmdNb2RlbC4kc2V0Vmlld1ZhbHVlKGQuZGF0YSk7XG5cdFx0XHRcdFx0XHRcdFx0bmdNb2RlbC4kcmVuZGVyKCk7XG5cdFx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0XHRcdC5hdHRyKFwieVwiLCBmdW5jdGlvbihkKXtcblx0XHRcdFx0XHRcdFx0XHR2YXIgaW5kZXggPSBsYWJlbHMuaW5kZXhPZihkKTtcblx0XHRcdFx0XHRcdFx0XHRpZihpbmRleCA9PSAwKXtcblx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiAxNTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0ZWxzZXtcblx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiBvcHRpb25zLmhlaWdodCAtIDY7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0XHQudGV4dChmdW5jdGlvbihkKXtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gZC5uYW1lO1xuXHRcdFx0XHRcdFx0XHR9KVxuXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdG9wdGlvbnMuY29udGFpbmVycyA9IG9wdGlvbnMudmlzLnNlbGVjdEFsbCgnZy5ub2RlJykuZGF0YShub2RlcykuZW50ZXIoKS5hcHBlbmQoJ2cnKS5hdHRyKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKCcgKyAob3B0aW9ucy53aWR0aCAvIDIpICsgJywnICsgKG9wdGlvbnMuaGVpZ2h0IC8gMikgKyAnKScpLmF0dHIoJ2NsYXNzJywgJ25vZGUnKTtcblxuXHRcdFx0XHRcdC8qb3B0aW9ucy5jaXJjbGVzID0gb3B0aW9ucy5jb250YWluZXJzLnNlbGVjdEFsbChcImNpcmNsZVwiKS5kYXRhKG5vZGVzLCBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGQuaWQ7XG5cdFx0XHRcdFx0fSk7Ki9cblxuXHRcdFx0XHRcdG9wdGlvbnMuY2lyY2xlcyA9IG9wdGlvbnMuY29udGFpbmVycy5hcHBlbmQoXCJjaXJjbGVcIikuYXR0cihcInJcIiwgMCkuYXR0cihcImZpbGxcIiwgKGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZC5jb2xvciB8fCBvcHRpb25zLmZpbGxfY29sb3IoZC5ncm91cCk7XG5cdFx0XHRcdFx0fSkpLmF0dHIoXCJzdHJva2Utd2lkdGhcIiwgMCkuYXR0cihcInN0cm9rZVwiLCBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGQzLnJnYihvcHRpb25zLmZpbGxfY29sb3IoZC5ncm91cCkpLmRhcmtlcigpO1xuXHRcdFx0XHRcdH0pLmF0dHIoXCJpZFwiLCBmdW5jdGlvbiAoZCkge1xuXHRcblx0XHRcdFx0XHRcdHJldHVybiBcImJ1YmJsZV9cIiArIGQudHlwZTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRvcHRpb25zLmljb25zID0gb3B0aW9ucy5jb250YWluZXJzLmFwcGVuZChcInRleHRcIilcblx0XHRcdFx0XHRcdC5hdHRyKCdmb250LWZhbWlseScsICdFUEknKVxuXHRcdFx0XHRcdFx0LmF0dHIoJ2ZvbnQtc2l6ZScsIGZ1bmN0aW9uIChkKSB7XG5cblx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0XHQuYXR0cihcInRleHQtYW5jaG9yXCIsIFwibWlkZGxlXCIpXG5cdFx0XHRcdFx0XHQuYXR0cignZmlsbCcsIGZ1bmN0aW9uKGQpe1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gZC51bmljb2RlID8gJyNmZmYnIDogZC5jb2xvcjtcblx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0XHQuc3R5bGUoJ29wYWNpdHknLCBmdW5jdGlvbihkKXtcblx0XHRcdFx0XHRcdFx0aWYoZC51bmljb2RlKXtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gMTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRlbHNle1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybiAwO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0LnRleHQoZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGQudW5pY29kZSB8fCAnMSdcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdG9wdGlvbnMuaWNvbnMub24oXCJtb3VzZW92ZXJcIiwgZnVuY3Rpb24gKGQsIGkpIHtcblx0XHRcdFx0XHRcdHJldHVybiBzaG93X2RldGFpbHMoZCwgaSwgdGhpcyk7XG5cdFx0XHRcdFx0fSkub24oXCJtb3VzZW91dFwiLCBmdW5jdGlvbiAoZCwgaSkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGhpZGVfZGV0YWlscyhkLCBpLCB0aGlzKTtcblx0XHRcdFx0XHR9KS5vbihcImNsaWNrXCIsIGZ1bmN0aW9uIChkLCBpKSB7XG5cblx0XHRcdFx0XHRcdG5nTW9kZWwuJHNldFZpZXdWYWx1ZShkLmRhdGEpO1xuXHRcdFx0XHRcdFx0bmdNb2RlbC4kcmVuZGVyKCk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0b3B0aW9ucy5jaXJjbGVzLnRyYW5zaXRpb24oKS5kdXJhdGlvbihvcHRpb25zLmR1cmF0aW9uKS5hdHRyKFwiclwiLCBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGQucmFkaXVzO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdG9wdGlvbnMuaWNvbnMudHJhbnNpdGlvbigpLmR1cmF0aW9uKG9wdGlvbnMuZHVyYXRpb24pLmF0dHIoXCJmb250LXNpemVcIiwgZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdHJldHVybiBkLnJhZGl1cyAqIDEuNzUgKyAncHgnO1xuXHRcdFx0XHRcdH0pLmF0dHIoJ3knLCBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGQucmFkaXVzICogLjc1ICsgJ3B4Jztcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fTtcblx0XHRcdFx0dmFyIHVwZGF0ZV92aXMgPSBmdW5jdGlvbiAoKSB7XG5cblx0XHRcdFx0XHRub2Rlcy5mb3JFYWNoKGZ1bmN0aW9uIChkLCBpKSB7XG5cdFx0XHRcdFx0XHRvcHRpb25zLmNpcmNsZXMudHJhbnNpdGlvbigpLmR1cmF0aW9uKG9wdGlvbnMuZHVyYXRpb24pLmRlbGF5KGkgKiBvcHRpb25zLmR1cmF0aW9uKVxuXHRcdFx0XHRcdFx0XHQuYXR0cihcInJcIiwgZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdFx0XHRkLnJhZGl1cyA9IGQudmFsdWUgPSBzY29wZS5jaGFydGRhdGFbZC50eXBlXSAvIHNjb3BlLnNpemVmYWN0b3I7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIHNjb3BlLmNoYXJ0ZGF0YVtkLnR5cGVdIC8gc2NvcGUuc2l6ZWZhY3Rvcjtcblx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRvcHRpb25zLmljb25zLnRyYW5zaXRpb24oKS5kdXJhdGlvbihvcHRpb25zLmR1cmF0aW9uKS5kZWxheShpICogb3B0aW9ucy5kdXJhdGlvbilcblx0XHRcdFx0XHRcdFx0LmF0dHIoXCJmb250LXNpemVcIiwgZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gKHNjb3BlLmNoYXJ0ZGF0YVtkLnR5cGVdIC8gc2NvcGUuc2l6ZWZhY3RvcikgKiAxLjc1ICsgJ3B4J1xuXHRcdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0XHQuYXR0cigneScsIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIChzY29wZS5jaGFydGRhdGFbZC50eXBlXSAvIHNjb3BlLnNpemVmYWN0b3IpICogLjc1ICsgJ3B4Jztcblx0XHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fTtcblx0XHRcdFx0dmFyIGNoYXJnZSA9IGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0cmV0dXJuIC1NYXRoLnBvdyhkLnJhZGl1cywgMi4wKSAvIDQ7XG5cdFx0XHRcdH07XG5cdFx0XHRcdHZhciBzdGFydCA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRyZXR1cm4gb3B0aW9ucy5mb3JjZSA9IGQzLmxheW91dC5mb3JjZSgpLm5vZGVzKG5vZGVzKS5zaXplKFtvcHRpb25zLndpZHRoLCBvcHRpb25zLmhlaWdodF0pLmxpbmtzKGxpbmtzKTtcblx0XHRcdFx0fTtcblx0XHRcdFx0dmFyIGRpc3BsYXlfZ3JvdXBfYWxsID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdG9wdGlvbnMuZm9yY2UuZ3Jhdml0eShvcHRpb25zLmxheW91dF9ncmF2aXR5KS5jaGFyZ2UoY2hhcmdlKS5mcmljdGlvbigwLjg1KS5vbihcInRpY2tcIiwgZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0XHRcdG9wdGlvbnMuY29udGFpbmVycy5lYWNoKG1vdmVfdG93YXJkc19jZW50ZXIoZS5hbHBoYSkpLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuICd0cmFuc2xhdGUoJyArIGQueCArICcsJyArIGQueSArICcpJztcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdG9wdGlvbnMuZm9yY2Uuc3RhcnQoKTtcblx0XHRcdFx0fTtcblx0XHRcdFx0dmFyIGRpc3BsYXlfYnlfY2F0ID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdG9wdGlvbnMuZm9yY2UuZ3Jhdml0eShvcHRpb25zLmxheW91dF9ncmF2aXR5KS5jaGFyZ2UoY2hhcmdlKS5mcmljdGlvbigwLjkpLm9uKFwidGlja1wiLCBmdW5jdGlvbiAoZSkge1xuXHRcdFx0XHRcdFx0b3B0aW9ucy5jb250YWluZXJzLmVhY2gobW92ZV90b3dhcmRzX2NhdChlLmFscGhhKSkuYXR0cihcInRyYW5zZm9ybVwiLCBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gJ3RyYW5zbGF0ZSgnICsgZC54ICsgJywnICsgZC55ICsgJyknO1xuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0b3B0aW9ucy5mb3JjZS5zdGFydCgpO1xuXHRcdFx0XHR9O1xuXHRcdFx0XHR2YXIgbW92ZV90b3dhcmRzX2NlbnRlciA9IGZ1bmN0aW9uIChhbHBoYSkge1xuXHRcdFx0XHRcdHJldHVybiAoZnVuY3Rpb24gKF90aGlzKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdFx0ZC54ID0gZC54ICsgKG9wdGlvbnMud2lkdGgvMiAtIGQueCkgKiAob3B0aW9ucy5kYW1wZXIgKyAwLjAyKSAqIGFscGhhICoxLjI1O1xuXHRcdFx0XHRcdFx0XHRkLnkgPSBkLnkgKyAob3B0aW9ucy5oZWlnaHQvMiAtIGQueSkgKiAob3B0aW9ucy5kYW1wZXIgKyAwLjAyKSAqIGFscGhhICogMS4yNTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KSh0aGlzKTtcblx0XHRcdFx0fTtcblx0XHRcdFx0dmFyIG1vdmVfdG93YXJkc190b3AgPSBmdW5jdGlvbiAoYWxwaGEpIHtcblx0XHRcdFx0XHRyZXR1cm4gKGZ1bmN0aW9uIChfdGhpcykge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRcdGQueCA9IGQueCArIChvcHRpb25zLmNlbnRlci54IC0gZC54KSAqIChvcHRpb25zLmRhbXBlciArIDAuMDIpICogYWxwaGEgKiAxLjE7XG5cdFx0XHRcdFx0XHRcdGQueSA9IGQueSArICgyMDAgLSBkLnkpICogKG9wdGlvbnMuZGFtcGVyICsgMC4wMikgKiBhbHBoYSAqIDEuMTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KSh0aGlzKTtcblx0XHRcdFx0fTtcblx0XHRcdFx0dmFyIG1vdmVfdG93YXJkc19jYXQgPSBmdW5jdGlvbiAoYWxwaGEpIHtcblx0XHRcdFx0XHRyZXR1cm4gKGZ1bmN0aW9uIChfdGhpcykge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGZ1bmN0aW9uIChkKSB7XG5cblx0XHRcdFx0XHRcdFx0dmFyIHRhcmdldDtcblx0XHRcdFx0XHRcdFx0dGFyZ2V0ID0gb3B0aW9ucy5jYXRfY2VudGVyc1tkLmdyb3VwXTtcblx0XHRcdFx0XHRcdFx0ZC54ID0gZC54ICsgKHRhcmdldC54IC0gZC54KSAqICh0YXJnZXQuZGFtcGVyICsgMC4wMikgKiBhbHBoYSAqIDE7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBkLnkgPSBkLnkgKyAodGFyZ2V0LnkgLSBkLnkpICogKHRhcmdldC5kYW1wZXIgKyAwLjAyKSAqIGFscGhhICogMTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KSh0aGlzKTtcblx0XHRcdFx0fTtcblx0XHRcdFx0dmFyIHNob3dfZGV0YWlscyA9IGZ1bmN0aW9uIChkYXRhLCBpLCBlbGVtZW50KSB7XG5cdFx0XHRcdFx0dmFyIGNvbnRlbnQ7XG5cdFx0XHRcdFx0Y29udGVudCA9IFwiPHNwYW4gY2xhc3M9XFxcInRpdGxlXFxcIj5cIiArIGRhdGEubmFtZSArIFwiPC9zcGFuPjxici8+XCI7XG5cdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKGRhdGEuZGF0YS5jaGlsZHJlbiwgZnVuY3Rpb24gKGluZm8pIHtcblx0XHRcdFx0XHRcdGNvbnRlbnQgKz0gXCI8c3BhbiBjbGFzcz1cXFwibmFtZVxcXCIgc3R5bGU9XFxcImNvbG9yOlwiICsgKGluZm8uY29sb3IgfHwgZGF0YS5jb2xvcikgKyBcIlxcXCI+IFwiICsgKGluZm8udGl0bGUpICsgXCI8L3NwYW4+PGJyLz5cIjtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHQkY29tcGlsZShvcHRpb25zLnRvb2x0aXAuc2hvd1Rvb2x0aXAoY29udGVudCwgZGF0YSwgZDMuZXZlbnQsIGVsZW0pLmNvbnRlbnRzKCkpKHNjb3BlKTtcblx0XHRcdFx0fTtcblxuXHRcdFx0XHR2YXIgaGlkZV9kZXRhaWxzID0gZnVuY3Rpb24gKGRhdGEsIGksIGVsZW1lbnQpIHtcblx0XHRcdFx0XHRyZXR1cm4gb3B0aW9ucy50b29sdGlwLmhpZGVUb29sdGlwKCk7XG5cdFx0XHRcdH07XG5cblx0XHRcdFx0c2NvcGUuJHdhdGNoKCdjaGFydGRhdGEnLCBmdW5jdGlvbiAoZGF0YSwgb2xkRGF0YSkge1xuXHRcdFx0XHRcdG9wdGlvbnMudG9vbHRpcC5oaWRlVG9vbHRpcCgpO1xuXG5cdFx0XHRcdFx0aWYgKG9wdGlvbnMuY2lyY2xlcyA9PSBudWxsKSB7XG5cdFx0XHRcdFx0XHRjcmVhdGVfbm9kZXMoKTtcblx0XHRcdFx0XHRcdGNyZWF0ZV92aXMoKTtcblx0XHRcdFx0XHRcdHN0YXJ0KCk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHVwZGF0ZV92aXMoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYobGFiZWxzLmxlbmd0aCA9PSAxIHx8IG9wdGlvbnMubGFiZWxzICE9IHRydWUpe1xuXHRcdFx0XHRcdFx0XHRkaXNwbGF5X2dyb3VwX2FsbCgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNle1xuXHRcdFx0XHRcdFx0XHRkaXNwbGF5X2J5X2NhdCgpO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHR9KTtcblx0XHRcdFx0c2NvcGUuJHdhdGNoKCdpbmRleGVyJywgZnVuY3Rpb24gKG4sIG8pIHtcblx0XHRcdFx0XHRpZihuID09PSBvKXtcblx0XHRcdFx0XHRcdHJldHVyblxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZih0eXBlb2YgblswXS5jaGlsZHJlbiAhPSBcInVuZGVmaW5lZFwiKXtcblx0XHRcdFx0XHRcdG9wdGlvbnMudG9vbHRpcC5oaWRlVG9vbHRpcCgpO1xuXHRcdFx0XHRcdFx0Y2xlYXJfbm9kZXMoKTtcblx0XHRcdFx0XHRcdGNyZWF0ZV9ub2RlcygpO1xuXHRcdFx0XHRcdFx0Y3JlYXRlX3ZpcygpO1xuXHRcdFx0XHRcdFx0c3RhcnQoKTtcblxuXHRcdFx0XHRcdFx0aWYobGFiZWxzLmxlbmd0aCA9PSAxIHx8IG9wdGlvbnMubGFiZWxzICE9IHRydWUpe1xuXHRcdFx0XHRcdFx0XHRcdGRpc3BsYXlfZ3JvdXBfYWxsKCk7XG5cdFx0XHRcdFx0XHRcdFx0Ly9jb25zb2xlLmxvZygnYWxsJyk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRlbHNle1xuXHRcdFx0XHRcdFx0XHRcdC8vZGlzcGxheV9ieV9jYXQoKTtcblx0XHRcdFx0XHRcdFx0XHRkaXNwbGF5X2dyb3VwX2FsbCgpO1xuXHRcdFx0XHRcdFx0XHRcdC8vY29uc29sZS5sb2coJ2FsbCcpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHRcdHNjb3BlLiR3YXRjaCgnZGlyZWN0aW9uJywgZnVuY3Rpb24gKG9sZEQsIG5ld0QpIHtcblx0XHRcdFx0XHRpZiAob2xkRCA9PT0gbmV3RCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAob2xkRCA9PSBcImFsbFwiKSB7XG5cdFx0XHRcdFx0XHRkaXNwbGF5X2dyb3VwX2FsbCgpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRkaXNwbGF5X2J5X2NhdCgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSlcblx0XHRcdH1cblx0XHR9O1xuXHR9KTtcbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoICdhcHAuY29udHJvbGxlcnMnICkuY29udHJvbGxlciggJ0NpcmNsZWdyYXBoQ3RybCcsIGZ1bmN0aW9uKCl7XG5cdFx0Ly9cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZGlyZWN0aXZlcycpLmRpcmVjdGl2ZSgnY2lyY2xlZ3JhcGgnLCBmdW5jdGlvbiAoJHRpbWVvdXQpIHtcblx0XHR2YXIgZGVmYXVsdHMgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHR3aWR0aDogODAsXG5cdFx0XHRcdGhlaWdodDogODAsXG5cdFx0XHRcdGNvbG9yOiAnIzAwY2NhYScsXG5cdFx0XHRcdHNpemU6IDE3OCxcblx0XHRcdFx0ZmllbGQ6ICdyYW5rJ1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4ge1xuXHRcdFx0cmVzdHJpY3Q6ICdFJyxcblx0XHRcdGNvbnRyb2xsZXI6ICdDaXJjbGVncmFwaEN0cmwnLFxuXHRcdFx0c2NvcGU6IHtcblx0XHRcdFx0b3B0aW9uczogJz0nXG5cdFx0XHR9LFxuXHRcdFx0cmVxdWlyZTogJ25nTW9kZWwnLFxuXHRcdFx0bGluazogZnVuY3Rpb24gKCRzY29wZSwgZWxlbWVudCwgJGF0dHJzLCBuZ01vZGVsKSB7XG5cdFx0XHRcdC8vRmV0Y2hpbmcgT3B0aW9uc1xuXG5cdFx0XHRcdCRzY29wZS5vcHRpb25zID0gYW5ndWxhci5leHRlbmQoZGVmYXVsdHMoKSwgJHNjb3BlLm9wdGlvbnMpO1xuXG5cdFx0XHRcdC8vQ3JlYXRpbmcgdGhlIFNjYWxlXG5cdFx0XHRcdHZhciByb3RhdGUgPSBkMy5zY2FsZS5saW5lYXIoKVxuXHRcdFx0XHRcdC5kb21haW4oWzEsICRzY29wZS5vcHRpb25zLnNpemVdKVxuXHRcdFx0XHRcdC5yYW5nZShbMSwgMF0pXG5cdFx0XHRcdFx0LmNsYW1wKHRydWUpO1xuXG5cdFx0XHRcdC8vQ3JlYXRpbmcgRWxlbWVudHNcblx0XHRcdFx0dmFyIHN2ZyA9IGQzLnNlbGVjdChlbGVtZW50WzBdKS5hcHBlbmQoJ3N2ZycpXG5cdFx0XHRcdFx0LmF0dHIoJ3dpZHRoJywgJHNjb3BlLm9wdGlvbnMud2lkdGgpXG5cdFx0XHRcdFx0LmF0dHIoJ2hlaWdodCcsICRzY29wZS5vcHRpb25zLmhlaWdodClcblx0XHRcdFx0XHQuYXBwZW5kKCdnJyk7XG5cdFx0XHRcdHZhciBjb250YWluZXIgPSBzdmcuYXBwZW5kKCdnJylcblx0XHRcdFx0XHQuYXR0cigndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgnICsgJHNjb3BlLm9wdGlvbnMud2lkdGggLyAyICsgJywnICsgJHNjb3BlLm9wdGlvbnMuaGVpZ2h0IC8gMiArICcpJyk7XG5cdFx0XHRcdHZhciBjaXJjbGVCYWNrID0gY29udGFpbmVyLmFwcGVuZCgnY2lyY2xlJylcblx0XHRcdFx0XHQuYXR0cigncicsICRzY29wZS5vcHRpb25zLndpZHRoIC8gMiAtIDIpXG5cdFx0XHRcdFx0LmF0dHIoJ3N0cm9rZS13aWR0aCcsIDIpXG5cdFx0XHRcdFx0LmF0dHIoJ3N0cm9rZScsICRzY29wZS5vcHRpb25zLmNvbG9yKVxuXHRcdFx0XHRcdC5zdHlsZSgnb3BhY2l0eScsICcwLjYnKVxuXHRcdFx0XHRcdC5hdHRyKCdmaWxsJywgJ25vbmUnKTtcblx0XHRcdFx0dmFyIGFyYyA9IGQzLnN2Zy5hcmMoKVxuXHRcdFx0XHRcdC5zdGFydEFuZ2xlKDApXG5cdFx0XHRcdFx0LmlubmVyUmFkaXVzKGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gJHNjb3BlLm9wdGlvbnMud2lkdGggLyAyIC0gNDtcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC5vdXRlclJhZGl1cyhmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuICRzY29wZS5vcHRpb25zLndpZHRoIC8gMjtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0dmFyIGNpcmNsZUdyYXBoID0gY29udGFpbmVyLmFwcGVuZCgncGF0aCcpXG5cdFx0XHRcdFx0LmRhdHVtKHtcblx0XHRcdFx0XHRcdGVuZEFuZ2xlOiAyICogTWF0aC5QSSAqIDBcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC5zdHlsZShcImZpbGxcIiwgJHNjb3BlLm9wdGlvbnMuY29sb3IpXG5cdFx0XHRcdFx0LmF0dHIoJ2QnLCBhcmMpO1xuXHRcdFx0XHR2YXIgdGV4dCA9IGNvbnRhaW5lci5zZWxlY3RBbGwoJ3RleHQnKVxuXHRcdFx0XHRcdC5kYXRhKFswXSlcblx0XHRcdFx0XHQuZW50ZXIoKVxuXHRcdFx0XHRcdC5hcHBlbmQoJ3RleHQnKVxuXHRcdFx0XHRcdC50ZXh0KGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gJ07CsCcgKyBkO1xuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0LnN0eWxlKFwiZmlsbFwiLCAkc2NvcGUub3B0aW9ucy5jb2xvcilcblx0XHRcdFx0XHQuc3R5bGUoJ2ZvbnQtd2VpZ2h0JywgJ2JvbGQnKVxuXHRcdFx0XHRcdC5hdHRyKCd0ZXh0LWFuY2hvcicsICdtaWRkbGUnKVxuXHRcdFx0XHRcdC5hdHRyKCd5JywgJzAuMzVlbScpO1xuXG5cdFx0XHRcdC8vVHJhbnNpdGlvbiBpZiBzZWxlY3Rpb24gaGFzIGNoYW5nZWRcblx0XHRcdFx0ZnVuY3Rpb24gYW5pbWF0ZUl0KHJhZGl1cykge1xuXHRcdFx0XHRcdGNpcmNsZUdyYXBoLnRyYW5zaXRpb24oKVxuXHRcdFx0XHRcdFx0LmR1cmF0aW9uKDc1MClcblx0XHRcdFx0XHRcdC5jYWxsKGFyY1R3ZWVuLCByb3RhdGUocmFkaXVzKSAqIDIgKiBNYXRoLlBJKTtcblx0XHRcdFx0XHR0ZXh0LnRyYW5zaXRpb24oKS5kdXJhdGlvbig3NTApLnR3ZWVuKCd0ZXh0JywgZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdHZhciBkYXRhID0gdGhpcy50ZXh0Q29udGVudC5zcGxpdCgnTsKwJyk7XG5cdFx0XHRcdFx0XHR2YXIgaSA9IGQzLmludGVycG9sYXRlKHBhcnNlSW50KGRhdGFbMV0pLCByYWRpdXMpO1xuXHRcdFx0XHRcdFx0cmV0dXJuIGZ1bmN0aW9uICh0KSB7XG5cdFx0XHRcdFx0XHRcdHRoaXMudGV4dENvbnRlbnQgPSAnTsKwJyArIChNYXRoLnJvdW5kKGkodCkgKiAxKSAvIDEpO1xuXHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly9Ud2VlbiBhbmltYXRpb24gZm9yIHRoZSBBcmNcblx0XHRcdFx0ZnVuY3Rpb24gYXJjVHdlZW4odHJhbnNpdGlvbiwgbmV3QW5nbGUpIHtcblx0XHRcdFx0XHR0cmFuc2l0aW9uLmF0dHJUd2VlbihcImRcIiwgZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdHZhciBpbnRlcnBvbGF0ZSA9IGQzLmludGVycG9sYXRlKGQuZW5kQW5nbGUsIG5ld0FuZ2xlKTtcblx0XHRcdFx0XHRcdHJldHVybiBmdW5jdGlvbiAodCkge1xuXHRcdFx0XHRcdFx0XHRkLmVuZEFuZ2xlID0gaW50ZXJwb2xhdGUodCk7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBhcmMoZCk7XG5cdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0JHNjb3BlLiR3YXRjaCgnb3B0aW9ucycsIGZ1bmN0aW9uIChuLCBvKSB7XG5cdFx0XHRcdFx0aWYgKG4gPT09IG8pIHtcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Y2lyY2xlQmFjay5zdHlsZSgnc3Ryb2tlJywgbi5jb2xvcik7XG5cdFx0XHRcdFx0Y2lyY2xlR3JhcGguc3R5bGUoJ2ZpbGwnLCBuLmNvbG9yKTtcblx0XHRcdFx0XHR0ZXh0LnN0eWxlKCdmaWxsJywgbi5jb2xvcik7XG5cdFx0XHRcdFx0JHRpbWVvdXQoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0YW5pbWF0ZUl0KG5nTW9kZWwuJG1vZGVsVmFsdWVbbi5maWVsZF0pXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRcdC8vV2F0Y2hpbmcgaWYgc2VsZWN0aW9uIGhhcyBjaGFuZ2VkIGZyb20gYW5vdGhlciBVSSBlbGVtZW50XG5cdFx0XHRcdCRzY29wZS4kd2F0Y2goXG5cdFx0XHRcdFx0ZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIG5nTW9kZWwuJG1vZGVsVmFsdWU7XG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRmdW5jdGlvbiAobiwgbykge1xuXHRcdFx0XHRcdFx0aWYgKCFuKSB7XG5cdFx0XHRcdFx0XHRcdG4gPSB7fTtcblx0XHRcdFx0XHRcdFx0blskc2NvcGUub3B0aW9ucy5maWVsZF0gPSAkc2NvcGUub3B0aW9ucy5zaXplO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0JHRpbWVvdXQoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0XHRhbmltYXRlSXQoblskc2NvcGUub3B0aW9ucy5maWVsZF0pO1xuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fTtcblxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZGlyZWN0aXZlcycpLmRpcmVjdGl2ZSgnZmlsZURyb3B6b25lJywgZnVuY3Rpb24gKHRvYXN0cikge1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlc3RyaWN0OiAnRUEnLFxuXHRcdFx0c2NvcGU6IHtcbiAgICAgICAgZmlsZTogJz0nLFxuICAgICAgICBmaWxlTmFtZTogJz0nXG4gICAgICB9LFxuXHRcdFx0bGluazogZnVuY3Rpb24gKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuXHRcdFx0XHR2YXIgY2hlY2tTaXplLCBpc1R5cGVWYWxpZCwgcHJvY2Vzc0RyYWdPdmVyT3JFbnRlciwgdmFsaWRNaW1lVHlwZXM7XG5cdFx0XHRcdHByb2Nlc3NEcmFnT3Zlck9yRW50ZXIgPSBmdW5jdGlvbiAoZXZlbnQpIHtcblx0XHRcdFx0XHRpZiAoZXZlbnQgIT0gbnVsbCkge1xuXHRcdFx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZXZlbnQuZGF0YVRyYW5zZmVyLmVmZmVjdEFsbG93ZWQgPSAnY29weSc7XG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHR9O1xuXHRcdFx0XHR2YWxpZE1pbWVUeXBlcyA9IGF0dHJzLmZpbGVEcm9wem9uZTtcblx0XHRcdFx0Y2hlY2tTaXplID0gZnVuY3Rpb24gKHNpemUpIHtcblx0XHRcdFx0XHR2YXIgX3JlZjtcblx0XHRcdFx0XHRpZiAoKChfcmVmID0gYXR0cnMubWF4RmlsZVNpemUpID09PSAodm9pZCAwKSB8fCBfcmVmID09PSAnJykgfHwgKHNpemUgLyAxMDI0KSAvIDEwMjQgPCBhdHRycy5tYXhGaWxlU2l6ZSkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGFsZXJ0KFwiRmlsZSBtdXN0IGJlIHNtYWxsZXIgdGhhbiBcIiArIGF0dHJzLm1heEZpbGVTaXplICsgXCIgTUJcIik7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9O1xuXHRcdFx0XHRpc1R5cGVWYWxpZCA9IGZ1bmN0aW9uICh0eXBlKSB7XG5cdFx0XHRcdFx0aWYgKCh2YWxpZE1pbWVUeXBlcyA9PT0gKHZvaWQgMCkgfHwgdmFsaWRNaW1lVHlwZXMgPT09ICcnKSB8fCB2YWxpZE1pbWVUeXBlcy5pbmRleE9mKHR5cGUpID4gLTEpIHtcblx0XHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHR0b2FzdHIuZXJyb3IoXCJGaWxlIG11c3QgYmUgb25lIG9mIGZvbGxvd2luZyB0eXBlcyBcIiArIHZhbGlkTWltZVR5cGVzLCAnSW52YWxpZCBmaWxlIHR5cGUhJyk7XG5cblx0XHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH07XG5cdFx0XHRcdGVsZW1lbnQuYmluZCgnZHJhZ292ZXInLCBwcm9jZXNzRHJhZ092ZXJPckVudGVyKTtcblx0XHRcdFx0ZWxlbWVudC5iaW5kKCdkcmFnZW50ZXInLCBwcm9jZXNzRHJhZ092ZXJPckVudGVyKTtcblx0XHRcdFx0cmV0dXJuIGVsZW1lbnQuYmluZCgnZHJvcCcsIGZ1bmN0aW9uIChldmVudCkge1xuXHRcdFx0XHRcdHZhciBmaWxlLCBuYW1lLCByZWFkZXIsIHNpemUsIHR5cGU7XG5cdFx0XHRcdFx0aWYgKGV2ZW50ICE9IG51bGwpIHtcblx0XHRcdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XG5cdFx0XHRcdFx0cmVhZGVyLm9ubG9hZCA9IGZ1bmN0aW9uIChldnQpIHtcblx0XHRcdFx0XHRcdGlmIChjaGVja1NpemUoc2l6ZSkgJiYgaXNUeXBlVmFsaWQodHlwZSkpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIHNjb3BlLiRhcHBseShmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRcdFx0c2NvcGUuZmlsZSA9IGV2dC50YXJnZXQucmVzdWx0O1xuXHRcdFx0XHRcdFx0XHRcdGlmIChhbmd1bGFyLmlzU3RyaW5nKHNjb3BlLmZpbGVOYW1lKSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIHNjb3BlLmZpbGVOYW1lID0gbmFtZTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0ZmlsZSA9IGV2ZW50LmRhdGFUcmFuc2Zlci5maWxlc1swXTtcblx0XHRcdFx0XHRuYW1lID0gZmlsZS5uYW1lO1xuXHRcdFx0XHRcdHR5cGUgPSBmaWxlLnR5cGU7XG5cdFx0XHRcdFx0c2l6ZSA9IGZpbGUuc2l6ZTtcblx0XHRcdFx0XHRyZWFkZXIucmVhZEFzRGF0YVVSTChmaWxlKTtcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH07XG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCAnYXBwLmNvbnRyb2xsZXJzJyApLmNvbnRyb2xsZXIoICdGaWxlRHJvcHpvbmVDdHJsJywgZnVuY3Rpb24oKXtcblx0XHQvL1xuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZGlyZWN0aXZlcycpLmRpcmVjdGl2ZSggJ2hpc3RvcnknLCBmdW5jdGlvbigpIHtcblx0XHR2YXIgZGVmYXVsdHMgPSBmdW5jdGlvbigpe1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0ZmllbGQ6ICdzY29yZScsXG5cdFx0XHRcdGNvbG9yOiAnJ1xuXHRcdFx0fVxuXHRcdH07XG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlc3RyaWN0OiAnRScsXG5cdFx0XHR0ZW1wbGF0ZVVybDogJ3ZpZXdzL2RpcmVjdGl2ZXMvaGlzdG9yeS9oaXN0b3J5Lmh0bWwnLFxuXHRcdFx0Y29udHJvbGxlcjogJ0hpc3RvcnlDdHJsJyxcblx0XHRcdHNjb3BlOntcblx0XHRcdFx0b3B0aW9uczonPScsXG5cdFx0XHRcdGNoYXJ0ZGF0YTogJz0nXG5cdFx0XHR9LFxuXHRcdFx0bGluazogZnVuY3Rpb24oICRzY29wZSwgZWxlbWVudCwgJGF0dHJzLCBuZ01vZGVsKXtcblx0XHRcdFx0XHR2YXIgb3B0aW9ucyA9IGFuZ3VsYXIuZXh0ZW5kKGRlZmF1bHRzKCksICRzY29wZS5vcHRpb25zKTtcblx0XHRcdH1cblx0XHR9O1xuXG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0hpc3RvcnlDdHJsJywgZnVuY3Rpb24gKCRzY29wZSkge1xuXHRcdCRzY29wZS5zZXREYXRhID0gc2V0RGF0YTtcblx0XHRhY3RpdmF0ZSgpO1xuXHRcblx0XHRmdW5jdGlvbiBhY3RpdmF0ZSgpe1xuXHRcdFx0JHNjb3BlLnNldERhdGEoKTtcblx0XHRcdCRzY29wZS4kd2F0Y2goJ29wdGlvbnMnLCBmdW5jdGlvbihuLG8pe1xuXHRcdFx0XHRpZihuID09PSAwKXtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblx0XHRcdFx0JHNjb3BlLnNldERhdGEoKTtcblx0XHRcdH0pXG5cdFx0fVxuXHRcdGZ1bmN0aW9uIHNldERhdGEoKXtcblx0XHRcdCRzY29wZS5kaXNwbGF5ID0ge1xuXHRcdFx0XHRzZWxlY3RlZENhdDogJycsXG5cdFx0XHRcdHJhbms6IFt7XG5cdFx0XHRcdFx0ZmllbGRzOiB7XG5cdFx0XHRcdFx0XHR4OiAneWVhcicsXG5cdFx0XHRcdFx0XHR5OiAncmFuaydcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdHRpdGxlOiAnUmFuaycsXG5cdFx0XHRcdFx0Y29sb3I6ICcjNTJiNjk1J1xuXHRcdFx0XHR9XSxcblx0XHRcdFx0c2NvcmU6IFt7XG5cdFx0XHRcdFx0ZmllbGRzOiB7XG5cdFx0XHRcdFx0XHR4OiAneWVhcicsXG5cdFx0XHRcdFx0XHR5OiAkc2NvcGUub3B0aW9ucy5maWVsZFxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0dGl0bGU6ICdTY29yZScsXG5cdFx0XHRcdFx0Y29sb3I6ICRzY29wZS5vcHRpb25zLmNvbG9yXG5cdFx0XHRcdH1dXG5cdFx0XHR9O1xuXHRcdH1cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5kaXJlY3RpdmVzJykuZGlyZWN0aXZlKCAnaW5kaWNhdG9yJywgZnVuY3Rpb24oKSB7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0cmVzdHJpY3Q6ICdFQScsXG5cdFx0XHR0ZW1wbGF0ZVVybDogJ3ZpZXdzL2RpcmVjdGl2ZXMvaW5kaWNhdG9yL2luZGljYXRvci5odG1sJyxcblx0XHRcdGNvbnRyb2xsZXI6ICdJbmRpY2F0b3JDdHJsJyxcblx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJyxcblx0XHRcdHNjb3BlOntcblx0XHRcdFx0aXRlbTogJz0nLFxuXHRcdFx0XHRvcHRpb25zOiAnPSdcblx0XHRcdH0sXG5cdFx0XHRiaW5kVG9Db250cm9sbGVyOiB0cnVlLFxuXHRcdFx0cmVwbGFjZTp0cnVlLFxuXHRcdFx0Ly9yZXF1aXJlOiAnaXRlbScsXG5cdFx0XHRsaW5rOiBmdW5jdGlvbiggc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBpdGVtTW9kZWwgKXtcblx0XHRcdFx0Ly9cblx0XHRcdFx0LypzY29wZS4kd2F0Y2goXG5cdFx0XHRcdFx0ZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGl0ZW1Nb2RlbC4kbW9kZWxWYWx1ZTtcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdGZ1bmN0aW9uIChuLCBvKSB7XG5cdFx0XHRcdFx0XHRjb25zb2xlLmxvZyhuKTtcblx0XHRcdFx0XHR9KTsqL1xuXHRcdFx0fVxuXHRcdH07XG5cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignSW5kaWNhdG9yQ3RybCcsIGZ1bmN0aW9uICgkc2NvcGUsIERhdGFTZXJ2aWNlLCBEaWFsb2dTZXJ2aWNlLCAkZmlsdGVyKSB7XG5cdFx0Ly9cblx0XHR2YXIgdm0gPSB0aGlzO1xuXG5cdFx0dm0uY2F0ZWdvcmllcyA9IFtdO1xuXHRcdHZtLmRhdGFwcm92aWRlcnMgPSBbXTtcblx0XHR2bS5zZWxlY3RlZEl0ZW0gPSBudWxsO1xuXHRcdHZtLnNlYXJjaFRleHQgPSBudWxsO1xuXHRcdHZtLnF1ZXJ5U2VhcmNoID0gcXVlcnlTZWFyY2g7XG5cdFx0dm0ucXVlcnlTZWFyY2hDYXRlZ29yeSA9IHF1ZXJ5U2VhcmNoQ2F0ZWdvcnk7XG5cblx0XHR2bS50b2dnbGVDYXRlZ29yaWUgPSB0b2dnbGVDYXRlZ29yaWU7XG5cdFx0dm0uc2VsZWN0ZWRDYXRlZ29yaWUgPSBzZWxlY3RlZENhdGVnb3JpZTtcblxuXHRcdGFjdGl2YXRlKCk7XG5cblx0XHRmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcblx0XHRcdGxvYWRBbGwoKTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBxdWVyeVNlYXJjaChxdWVyeSkge1xuXHRcdFx0cmV0dXJuICRmaWx0ZXIoJ2ZpbmRieW5hbWUnKSh2bS5kYXRhcHJvdmlkZXJzLCBxdWVyeSwgJ3RpdGxlJyk7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gcXVlcnlTZWFyY2hDYXRlZ29yeShxdWVyeSkge1xuXHRcdFx0cmV0dXJuICRmaWx0ZXIoJ2ZpbmRieW5hbWUnKSh2bS5jYXRlZ29yaWVzLCBxdWVyeSwgJ3RpdGxlJyk7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gbG9hZEFsbCgpIHtcblx0XHRcdHZtLmRhdGFwcm92aWRlcnMgPSBEYXRhU2VydmljZS5nZXRBbGwoJ2RhdGFwcm92aWRlcnMnKS4kb2JqZWN0O1xuXHRcdFx0dm0uY2F0ZWdvcmllcyA9IERhdGFTZXJ2aWNlLmdldEFsbCgnY2F0ZWdvcmllcycpLiRvYmplY3Q7XG5cdFx0XHR2bS5tZWFzdXJlVHlwZXMgPSBEYXRhU2VydmljZS5nZXRBbGwoJ21lYXN1cmVfdHlwZXMnKS4kb2JqZWN0O1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIHRvZ2dsZUNhdGVnb3JpZShjYXRlZ29yaWUpIHtcblx0XHRcdHZhciBpbmRleCA9IHZtLml0ZW0uY2F0ZWdvcmllcy5pbmRleE9mKGNhdGVnb3JpZSk7XG5cdFx0XHRpbmRleCA9PT0gLTEgPyB2bS5pdGVtLmNhdGVnb3JpZXMucHVzaChjYXRlZ29yaWUpIDogdm0uaXRlbS5jYXRlZ29yaWVzLnNwbGljZShpbmRleCwgMSk7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gc2VsZWN0ZWRDYXRlZ29yaWUoaXRlbSwgY2F0ZWdvcmllKSB7XG5cdFx0XHRpZiAodHlwZW9mIGl0ZW0uY2F0ZWdvcmllcyA9PSBcInVuZGVmaW5lZFwiKSB7XG5cdFx0XHRcdGl0ZW0uY2F0ZWdvcmllcyA9IFtdO1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cdFx0XHR2YXIgaW5kZXggPSBpdGVtLmNhdGVnb3JpZXMuaW5kZXhPZihjYXRlZ29yaWUpO1xuXHRcdFx0cmV0dXJuIGluZGV4ICE9PSAtMSA/IHRydWUgOiBmYWxzZTtcblx0XHR9XG5cdFx0JHNjb3BlLiR3YXRjaCgndm0uaXRlbScsIGZ1bmN0aW9uIChuLCBvKSB7XG5cdFx0XHRpZiAobiA9PT0gbykgcmV0dXJuO1xuXHRcdFx0aWYoIXZtLmFza2VkVG9SZXBsaWNhdGUpIHtcblx0XHRcdFx0dm0ucHJlUHJvdmlkZXIgPSBvLmRhdGFwcm92aWRlcjtcblx0XHRcdFx0dm0ucHJlTWVhc3VyZSA9IG8ubWVhc3VyZV90eXBlX2lkO1xuXHRcdFx0XHR2bS5wcmVDYXRlZ29yaWVzID0gby5jYXRlZ29yaWVzO1xuXHRcdFx0XHR2bS5wcmVQdWJsaWMgPSBvLmlzX3B1YmxpYztcblx0XHRcdFx0RGlhbG9nU2VydmljZS5mcm9tVGVtcGxhdGUoJ2NvcHlwcm92aWRlcicsICRzY29wZSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRuLmRhdGFwcm92aWRlciA9IHZtLmRvUHJvdmlkZXJzID8gdm0ucHJlUHJvdmlkZXIgOiBbXTtcblx0XHRcdFx0bi5tZWFzdXJlX3R5cGVfaWQgPSB2bS5kb01lYXN1cmVzID8gdm0ucHJlTWVhc3VyZSA6IDA7XG5cdFx0XHRcdG4uY2F0ZWdvcmllcyA9IHZtLmRvQ2F0ZWdvcmllcyA/IHZtLnByZUNhdGVnb3JpZXM6IFtdO1xuXHRcdFx0XHRuLmlzX3B1YmxpYyA9IHZtLmRvUHVibGljID8gdm0ucHJlUHVibGljOiBmYWxzZTtcblx0XHRcdH1cblx0XHR9KTtcblx0XHQkc2NvcGUuJHdhdGNoKCd2bS5pdGVtJywgZnVuY3Rpb24gKG4sIG8pIHtcblx0XHRcdGlmIChuID09PSBvKSByZXR1cm47XG5cdFx0XHRpZiAodHlwZW9mIG4uY2F0ZWdvcmllcyA9PSBcInVuZGVmaW5lZFwiKSBuLmNhdGVnb3JpZXMgPSBbXTtcblx0XHRcdGlmIChuLnRpdGxlICYmIG4ubWVhc3VyZV90eXBlX2lkICYmIG4uZGF0YXByb3ZpZGVyICYmIG4udGl0bGUubGVuZ3RoID49IDMpIHtcblx0XHRcdFx0bi5iYXNlID0gdHJ1ZTtcblx0XHRcdFx0bi5mdWxsID0gbi5jYXRlZ29yaWVzLmxlbmd0aCA/IHRydWUgOiBmYWxzZTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdG4uYmFzZSA9IG4uZnVsbCA9IGZhbHNlO1xuXHRcdFx0fTtcblx0XHR9LCB0cnVlKTtcblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5kaXJlY3RpdmVzJykuZGlyZWN0aXZlKCAnaW5kaWNhdG9yTWVudScsIGZ1bmN0aW9uKCkge1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlc3RyaWN0OiAnRUEnLFxuXHRcdFx0c2NvcGU6IHtcblx0XHRcdFx0aXRlbTogJz1pdGVtJ1xuXHRcdFx0fSxcblx0XHRcdHJlcGxhY2U6dHJ1ZSxcblx0XHRcdHRlbXBsYXRlVXJsOiAndmlld3MvZGlyZWN0aXZlcy9pbmRpY2F0b3JNZW51L2luZGljYXRvck1lbnUuaHRtbCcsXG5cdFx0XHRjb250cm9sbGVyOiAnSW5kaWNhdG9yTWVudUN0cmwnLFxuXHRcdFx0Y29udHJvbGxlckFzOiAndm0nLFxuXHRcdFx0YmluZFRvQ29udHJvbGxlcjogdHJ1ZSxcblx0XHRcdGxpbms6IGZ1bmN0aW9uKCBzY29wZSwgZWxlbWVudCwgYXR0cnMgKXtcblx0XHRcdFx0Ly9cblx0XHRcdFx0dmFyIGNsID0gJ2FjdGl2ZSc7XG5cdFx0XHRcdHZhciBlbCA9IGVsZW1lbnRbMF07XG5cdFx0XHRcdHZhciBwYXJlbnQgPSBlbGVtZW50LnBhcmVudCgpO1xuXHRcdFx0XHRwYXJlbnQub24oJ21vdXNlZW50ZXInLCBmdW5jdGlvbihlKXtcblx0XHRcdFx0XHRlbGVtZW50LmFkZENsYXNzKGNsKTtcblx0XHRcdFx0fSkub24oJ21vdXNlbGVhdmUnLCBmdW5jdGlvbihlKXtcblx0XHRcdFx0XHRlbGVtZW50LnJlbW92ZUNsYXNzKGNsKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fTtcblxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSggJ2FwcC5jb250cm9sbGVycycgKS5jb250cm9sbGVyKCAnSW5kaWNhdG9yTWVudUN0cmwnLCBmdW5jdGlvbigpe1xuXHRcdC8vXG5cdFx0dmFyIHZtID0gdGhpcztcblxuXHRcdGFjdGl2YXRlKCk7XG5cblx0XHRmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcblx0XHRcdGNoZWNrKCk7XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIGNoZWNrKCl7XG5cdFx0XHRpZiAodm0uaXRlbS50aXRsZSAmJiB2bS5pdGVtLm1lYXN1cmVfdHlwZV9pZCAmJiB2bS5pdGVtLmRhdGFwcm92aWRlciAmJiB2bS5pdGVtLnRpdGxlLmxlbmd0aCA+PSAzKSB7XG5cdFx0XHRcdHZtLml0ZW0uYmFzZSA9IHRydWU7XG5cdFx0XHRcdHZtLml0ZW0uZnVsbCA9IHZtLml0ZW0uY2F0ZWdvcmllcy5sZW5ndGggPyB0cnVlIDogZmFsc2U7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR2bS5pdGVtLmJhc2UgPSB2bS5pdGVtLmZ1bGwgPSBmYWxzZTtcblx0XHRcdH07XG5cdFx0fVxuICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZGlyZWN0aXZlcycpLmRpcmVjdGl2ZSgnbWVkaWFuJywgZnVuY3Rpb24gKCR0aW1lb3V0KSB7XG5cdFx0dmFyIGRlZmF1bHRzID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0aWQ6ICdncmFkaWVudCcsXG5cdFx0XHRcdHdpZHRoOiAzMDAsXG5cdFx0XHRcdGhlaWdodDogNDAsXG5cdFx0XHRcdGluZm86IHRydWUsXG5cdFx0XHRcdGZpZWxkOiAnc2NvcmUnLFxuXHRcdFx0XHRoYW5kbGluZzogdHJ1ZSxcblx0XHRcdFx0bWFyZ2luOiB7XG5cdFx0XHRcdFx0bGVmdDogMjAsXG5cdFx0XHRcdFx0cmlnaHQ6IDIwLFxuXHRcdFx0XHRcdHRvcDogMTAsXG5cdFx0XHRcdFx0Ym90dG9tOiAxMFxuXHRcdFx0XHR9LFxuXHRcdFx0XHRjb2xvcnM6IFsge1xuXHRcdFx0XHRcdHBvc2l0aW9uOiAwLFxuXHRcdFx0XHRcdGNvbG9yOiAncmdiYSgxMDIsMTAyLDEwMiwxKScsXG5cdFx0XHRcdFx0b3BhY2l0eTogMVxuXHRcdFx0XHR9LCB7XG5cdFx0XHRcdFx0cG9zaXRpb246IDUzLFxuXHRcdFx0XHRcdGNvbG9yOiAncmdiYSgxMjgsIDI0MywgMTk4LDEpJyxcblx0XHRcdFx0XHRvcGFjaXR5OiAxXG5cdFx0XHRcdH0se1xuXHRcdFx0XHRcdHBvc2l0aW9uOiAxMDAsXG5cdFx0XHRcdFx0Y29sb3I6ICdyZ2JhKDI1NSwyNTUsMjU1LDEpJyxcblx0XHRcdFx0XHRvcGFjaXR5OiAwXG5cdFx0XHRcdH1dXG5cdFx0XHR9O1xuXHRcdH1cblx0XHRyZXR1cm4ge1xuXHRcdFx0cmVzdHJpY3Q6ICdFJyxcblx0XHRcdHNjb3BlOiB7XG5cdFx0XHRcdGRhdGE6ICc9Jyxcblx0XHRcdFx0b3B0aW9uczogJz0nXG5cdFx0XHR9LFxuXHRcdFx0cmVxdWlyZTogJ25nTW9kZWwnLFxuXHRcdFx0bGluazogZnVuY3Rpb24gKCRzY29wZSwgZWxlbWVudCwgJGF0dHJzLCBuZ01vZGVsKSB7XG5cblx0XHRcdFx0dmFyIG9wdGlvbnMgPSBhbmd1bGFyLmV4dGVuZChkZWZhdWx0cygpLCAkYXR0cnMpO1xuXHRcdFx0XHRvcHRpb25zID0gYW5ndWxhci5leHRlbmQob3B0aW9ucywgJHNjb3BlLm9wdGlvbnMpO1xuXHRcdFx0XHRvcHRpb25zLnVuaXF1ZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuXHRcdFx0XHRpZihvcHRpb25zLmNvbG9yKXtcblx0XHRcdFx0XHRvcHRpb25zLmNvbG9yc1sxXS5jb2xvciA9IG9wdGlvbnMuY29sb3I7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxlbWVudC5jc3MoJ2hlaWdodCcsIG9wdGlvbnMuaGVpZ2h0ICsgJ3B4JykuY3NzKCdib3JkZXItcmFkaXVzJywgb3B0aW9ucy5oZWlnaHQgLyAyICsgJ3B4Jyk7XG5cdFx0XHRcdHZhciBtYXggPSAwO1xuXHRcdFx0XHRhbmd1bGFyLmZvckVhY2goJHNjb3BlLmRhdGEsIGZ1bmN0aW9uIChuYXQsIGtleSkge1xuXHRcdFx0XHRcdG1heCA9IGQzLm1heChbbWF4LCBwYXJzZUludChuYXRbb3B0aW9ucy5maWVsZF0pXSk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHR2YXIgeCA9IGQzLnNjYWxlLmxpbmVhcigpXG5cdFx0XHRcdFx0LmRvbWFpbihbMCwgbWF4XSlcblx0XHRcdFx0XHQucmFuZ2UoW29wdGlvbnMubWFyZ2luLmxlZnQsIG9wdGlvbnMud2lkdGggLSBvcHRpb25zLm1hcmdpbi5sZWZ0XSlcblx0XHRcdFx0XHQuY2xhbXAodHJ1ZSk7XG5cblx0XHRcdFx0dmFyIGJydXNoID0gZDMuc3ZnLmJydXNoKClcblx0XHRcdFx0XHQueCh4KVxuXHRcdFx0XHRcdC5leHRlbnQoWzAsIDBdKVxuXHRcdFx0XHRcdC5vbihcImJydXNoXCIsIGJydXNoKVxuXHRcdFx0XHRcdC5vbihcImJydXNoZW5kXCIsIGJydXNoZWQpO1xuXG5cdFx0XHRcdHZhciBzdmcgPSBkMy5zZWxlY3QoZWxlbWVudFswXSkuYXBwZW5kKFwic3ZnXCIpXG5cdFx0XHRcdFx0LmF0dHIoXCJ3aWR0aFwiLCBvcHRpb25zLndpZHRoKVxuXHRcdFx0XHRcdC5hdHRyKFwiaGVpZ2h0XCIsIG9wdGlvbnMuaGVpZ2h0KVxuXHRcdFx0XHRcdC5hcHBlbmQoXCJnXCIpO1xuXHRcdFx0XHQvLy5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKDAsXCIgKyBvcHRpb25zLm1hcmdpbi50b3AgLyAyICsgXCIpXCIpO1xuXHRcdFx0XHR2YXIgZ3JhZGllbnQgPSBzdmcuYXBwZW5kKCdzdmc6ZGVmcycpXG5cdFx0XHRcdFx0LmFwcGVuZChcInN2ZzpsaW5lYXJHcmFkaWVudFwiKVxuXHRcdFx0XHRcdC5hdHRyKCdpZCcsIG9wdGlvbnMuZmllbGQrb3B0aW9ucy51bmlxdWUpXG5cdFx0XHRcdFx0LmF0dHIoJ3gxJywgJzAlJylcblx0XHRcdFx0XHQuYXR0cigneTEnLCAnMCUnKVxuXHRcdFx0XHRcdC5hdHRyKCd4MicsICcxMDAlJylcblx0XHRcdFx0XHQuYXR0cigneTInLCAnMCUnKVxuXHRcdFx0XHRcdC5hdHRyKCdzcHJlYWRNZXRob2QnLCAncGFkJylcblx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKG9wdGlvbnMuY29sb3JzLCBmdW5jdGlvbiAoY29sb3IpIHtcblx0XHRcdFx0XHRncmFkaWVudC5hcHBlbmQoJ3N2ZzpzdG9wJylcblx0XHRcdFx0XHRcdC5hdHRyKCdvZmZzZXQnLCBjb2xvci5wb3NpdGlvbiArICclJylcblx0XHRcdFx0XHRcdC5hdHRyKCdzdG9wLWNvbG9yJywgY29sb3IuY29sb3IpXG5cdFx0XHRcdFx0XHQuYXR0cignc3RvcC1vcGFjaXR5JywgY29sb3Iub3BhY2l0eSk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHR2YXIgcmVjdCA9IHN2Zy5hcHBlbmQoJ3N2ZzpyZWN0Jylcblx0XHRcdFx0XHQuYXR0cignd2lkdGgnLCBvcHRpb25zLndpZHRoKVxuXHRcdFx0XHRcdC5hdHRyKCdoZWlnaHQnLCBvcHRpb25zLmhlaWdodClcblx0XHRcdFx0XHQuc3R5bGUoJ2ZpbGwnLCAndXJsKCMnICsgKG9wdGlvbnMuZmllbGQrb3B0aW9ucy51bmlxdWUpKyAnKScpO1xuXHRcdFx0XHR2YXIgbGVnZW5kID0gc3ZnLmFwcGVuZCgnZycpLmF0dHIoJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoJyArIG9wdGlvbnMuaGVpZ2h0IC8gMiArICcsICcgKyBvcHRpb25zLmhlaWdodCAvIDIgKyAnKScpXG5cdFx0XHRcdFx0LmF0dHIoJ2NsYXNzJywgJ3N0YXJ0TGFiZWwnKVxuXG5cdFx0XHRcdGlmIChvcHRpb25zLmluZm8gPT09IHRydWUpIHtcblx0XHRcdFx0XHRsZWdlbmQuYXBwZW5kKCdjaXJjbGUnKVxuXHRcdFx0XHRcdFx0LmF0dHIoJ3InLCBvcHRpb25zLmhlaWdodCAvIDIpO1xuXHRcdFx0XHRcdGxlZ2VuZC5hcHBlbmQoJ3RleHQnKVxuXHRcdFx0XHRcdFx0LnRleHQoMClcblx0XHRcdFx0XHRcdC5zdHlsZSgnZm9udC1zaXplJywgb3B0aW9ucy5oZWlnaHQvMi41KVxuXHRcdFx0XHRcdFx0LmF0dHIoJ3RleHQtYW5jaG9yJywgJ21pZGRsZScpXG5cdFx0XHRcdFx0XHQuYXR0cigneScsICcuMzVlbScpXG5cdFx0XHRcdFx0dmFyIGxlZ2VuZDIgPSBzdmcuYXBwZW5kKCdnJykuYXR0cigndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgnICsgKG9wdGlvbnMud2lkdGggLSAob3B0aW9ucy5oZWlnaHQgLyAyKSkgKyAnLCAnICsgb3B0aW9ucy5oZWlnaHQgLyAyICsgJyknKVxuXHRcdFx0XHRcdFx0LmF0dHIoJ2NsYXNzJywgJ2VuZExhYmVsJylcblx0XHRcdFx0XHRsZWdlbmQyLmFwcGVuZCgnY2lyY2xlJylcblx0XHRcdFx0XHRcdC5hdHRyKCdyJywgb3B0aW9ucy5oZWlnaHQgLyAyKVxuXHRcdFx0XHRcdGxlZ2VuZDIuYXBwZW5kKCd0ZXh0Jylcblx0XHRcdFx0XHRcdC50ZXh0KGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0XHRcdC8vVERPRE86IENIY2tpY2sgaWYgbm8gY29tbWEgdGhlcmUgXG5cdFx0XHRcdFx0XHRcdGlmKG1heCA+IDEwMDApe1xuXHRcdFx0XHRcdFx0XHRcdHZhciB2ID0gKHBhcnNlSW50KG1heCkgLyAxMDAwKS50b1N0cmluZygpO1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybiB2LnN1YnN0cigwLCB2LmluZGV4T2YoJy4nKSApICsgXCJrXCIgO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdHJldHVybiBtYXhcblx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0XHQuc3R5bGUoJ2ZvbnQtc2l6ZScsIG9wdGlvbnMuaGVpZ2h0LzIuNSlcblx0XHRcdFx0XHRcdC5hdHRyKCd0ZXh0LWFuY2hvcicsICdtaWRkbGUnKVxuXHRcdFx0XHRcdFx0LmF0dHIoJ3knLCAnLjM1ZW0nKVxuXHRcdFx0XHR9XG5cdFx0XHRcdHZhciBzbGlkZXIgPSBzdmcuYXBwZW5kKFwiZ1wiKVxuXHRcdFx0XHRcdC5hdHRyKFwiY2xhc3NcIiwgXCJzbGlkZXJcIik7XG5cdFx0XHRcdGlmKG9wdGlvbnMuaGFuZGxpbmcgPT0gdHJ1ZSl7XG5cdFx0XHRcdFx0c2xpZGVyLmNhbGwoYnJ1c2gpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0c2xpZGVyLnNlbGVjdChcIi5iYWNrZ3JvdW5kXCIpXG5cdFx0XHRcdFx0LmF0dHIoXCJoZWlnaHRcIiwgb3B0aW9ucy5oZWlnaHQpO1xuXG5cdFx0XHRcdGlmIChvcHRpb25zLmluZm8gPT09IHRydWUpIHtcblx0XHRcdFx0c2xpZGVyLmFwcGVuZCgnbGluZScpXG5cdFx0XHRcdFx0LmF0dHIoJ3gxJywgb3B0aW9ucy53aWR0aCAvIDIpXG5cdFx0XHRcdFx0LmF0dHIoJ3kxJywgMClcblx0XHRcdFx0XHQuYXR0cigneDInLCBvcHRpb25zLndpZHRoIC8gMilcblx0XHRcdFx0XHQuYXR0cigneTInLCBvcHRpb25zLmhlaWdodClcblx0XHRcdFx0XHQuYXR0cignc3Ryb2tlLWRhc2hhcnJheScsICczLDMnKVxuXHRcdFx0XHRcdC5hdHRyKCdzdHJva2Utd2lkdGgnLCAxKVxuXHRcdFx0XHRcdC5hdHRyKCdzdHJva2UnLCAncmdiYSgwLDAsMCw4NyknKTtcblx0XHRcdFx0fVxuXHRcdFx0XHR2YXIgaGFuZGxlQ29udCA9IHNsaWRlci5hcHBlbmQoJ2cnKVxuXHRcdFx0XHRcdC5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKDAsXCIgKyBvcHRpb25zLmhlaWdodCAvIDIgKyBcIilcIik7XG5cdFx0XHRcdHZhciBoYW5kbGUgPSBoYW5kbGVDb250LmFwcGVuZChcImNpcmNsZVwiKVxuXHRcdFx0XHRcdC5hdHRyKFwiY2xhc3NcIiwgXCJoYW5kbGVcIilcblx0XHRcdFx0XHQuYXR0cihcInJcIiwgb3B0aW9ucy5oZWlnaHQgLyAyKTtcblx0XHRcdFx0XHRpZihvcHRpb25zLmNvbG9yKXtcblx0XHRcdFx0XHRcdGhhbmRsZS5zdHlsZSgnZmlsbCcsIG9wdGlvbnMuY29sb3IpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0dmFyIGhhbmRsZUxhYmVsID0gaGFuZGxlQ29udC5hcHBlbmQoJ3RleHQnKVxuXHRcdFx0XHRcdC50ZXh0KDApXG5cdFx0XHRcdFx0LnN0eWxlKCdmb250LXNpemUnLCBvcHRpb25zLmhlaWdodC8yLjUpXG5cdFx0XHRcdFx0LmF0dHIoXCJ0ZXh0LWFuY2hvclwiLCBcIm1pZGRsZVwiKS5hdHRyKCd5JywgJzAuMzVlbScpO1xuXG5cdFx0XHRcdC8vc2xpZGVyXG5cdFx0XHRcdC8vLmNhbGwoYnJ1c2guZXh0ZW50KFswLCAwXSkpXG5cdFx0XHRcdC8vLmNhbGwoYnJ1c2guZXZlbnQpO1xuXG5cdFx0XHRcdGZ1bmN0aW9uIGJydXNoKCkge1xuXHRcdFx0XHRcdHZhciB2YWx1ZSA9IGJydXNoLmV4dGVudCgpWzBdO1xuXG5cdFx0XHRcdFx0aWYgKGQzLmV2ZW50LnNvdXJjZUV2ZW50KSB7XG5cdFx0XHRcdFx0XHR2YWx1ZSA9IHguaW52ZXJ0KGQzLm1vdXNlKHRoaXMpWzBdKTtcblx0XHRcdFx0XHRcdGJydXNoLmV4dGVudChbdmFsdWUsIHZhbHVlXSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmKHBhcnNlSW50KHZhbHVlKSA+IDEwMDApe1xuXHRcdFx0XHRcdFx0dmFyIHYgPSAocGFyc2VJbnQodmFsdWUpIC8gMTAwMCkudG9TdHJpbmcoKTtcblx0XHRcdFx0XHRcdGhhbmRsZUxhYmVsLnRleHQodi5zdWJzdHIoMCwgdi5pbmRleE9mKCcuJykgKSArIFwia1wiICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2V7XG5cdFx0XHRcdFx0XHRoYW5kbGVMYWJlbC50ZXh0KHBhcnNlSW50KHZhbHVlKSk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aGFuZGxlQ29udC5hdHRyKFwidHJhbnNmb3JtXCIsICd0cmFuc2xhdGUoJyArIHgodmFsdWUpICsgJywnICsgb3B0aW9ucy5oZWlnaHQgLyAyICsgJyknKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGZ1bmN0aW9uIGJydXNoZWQoKSB7XG5cblx0XHRcdFx0XHR2YXIgdmFsdWUgPSBicnVzaC5leHRlbnQoKVswXSxcblx0XHRcdFx0XHRcdGNvdW50ID0gMCxcblx0XHRcdFx0XHRcdGZvdW5kID0gZmFsc2U7XG5cdFx0XHRcdFx0dmFyIGZpbmFsID0gXCJcIjtcblx0XHRcdFx0XHQvKmRvIHtcblxuXHRcdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKCRzY29wZS5kYXRhLCBmdW5jdGlvbiAobmF0LCBrZXkpIHtcblx0XHRcdFx0XHRcdFx0aWYgKHBhcnNlSW50KG5hdFtvcHRpb25zLmZpZWxkXSkgPT0gcGFyc2VJbnQodmFsdWUpKSB7XG5cdFx0XHRcdFx0XHRcdFx0ZmluYWwgPSBuYXQ7XG5cdFx0XHRcdFx0XHRcdFx0Zm91bmQgPSB0cnVlO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdGNvdW50Kys7XG5cdFx0XHRcdFx0XHR2YWx1ZSA9IHZhbHVlID4gNTAgPyB2YWx1ZSAtIDEgOiB2YWx1ZSArIDE7XG5cdFx0XHRcdFx0fSB3aGlsZSAoIWZvdW5kICYmIGNvdW50IDwgbWF4KTtcblxuXHRcdFx0XHRcdG5nTW9kZWwuJHNldFZpZXdWYWx1ZShmaW5hbCk7XG5cdFx0XHRcdFx0bmdNb2RlbC4kcmVuZGVyKCk7Ki9cblx0XHRcdFx0fVxuXHRcdFx0XHQkc2NvcGUuJHdhdGNoKCdvcHRpb25zJywgZnVuY3Rpb24obixvKXtcblx0XHRcdFx0XHRpZihuID09PSBvKXtcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0b3B0aW9ucy5jb2xvcnNbMV0uY29sb3IgPSBuLmNvbG9yO1xuXHRcdFx0XHRcdGdyYWRpZW50ID0gc3ZnLmFwcGVuZCgnc3ZnOmRlZnMnKVxuXHRcdFx0XHRcdFx0LmFwcGVuZChcInN2ZzpsaW5lYXJHcmFkaWVudFwiKVxuXHRcdFx0XHRcdFx0LmF0dHIoJ2lkJywgb3B0aW9ucy5maWVsZCtcIl9cIituLmNvbG9yKVxuXHRcdFx0XHRcdFx0LmF0dHIoJ3gxJywgJzAlJylcblx0XHRcdFx0XHRcdC5hdHRyKCd5MScsICcwJScpXG5cdFx0XHRcdFx0XHQuYXR0cigneDInLCAnMTAwJScpXG5cdFx0XHRcdFx0XHQuYXR0cigneTInLCAnMCUnKVxuXHRcdFx0XHRcdFx0LmF0dHIoJ3NwcmVhZE1ldGhvZCcsICdwYWQnKVxuXHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChvcHRpb25zLmNvbG9ycywgZnVuY3Rpb24gKGNvbG9yKSB7XG5cdFx0XHRcdFx0XHRncmFkaWVudC5hcHBlbmQoJ3N2ZzpzdG9wJylcblx0XHRcdFx0XHRcdFx0LmF0dHIoJ29mZnNldCcsIGNvbG9yLnBvc2l0aW9uICsgJyUnKVxuXHRcdFx0XHRcdFx0XHQuYXR0cignc3RvcC1jb2xvcicsIGNvbG9yLmNvbG9yKVxuXHRcdFx0XHRcdFx0XHQuYXR0cignc3RvcC1vcGFjaXR5JywgY29sb3Iub3BhY2l0eSk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0cmVjdC5zdHlsZSgnZmlsbCcsICd1cmwoIycgKyBvcHRpb25zLmZpZWxkICsgJ18nK24uY29sb3IrJyknKTtcblx0XHRcdFx0XHRoYW5kbGUuc3R5bGUoJ2ZpbGwnLCBuLmNvbG9yKTtcblx0XHRcdFx0XHRoYW5kbGVMYWJlbC50ZXh0KHBhcnNlSW50KG5nTW9kZWwuJG1vZGVsVmFsdWVbbi5maWVsZF0pKTtcblx0XHRcdFx0XHRoYW5kbGVDb250LnRyYW5zaXRpb24oKS5kdXJhdGlvbig1MDApLmVhc2UoJ3F1YWQnKS5hdHRyKFwidHJhbnNmb3JtXCIsICd0cmFuc2xhdGUoJyArIHgobmdNb2RlbC4kbW9kZWxWYWx1ZVtuLmZpZWxkXSkgKyAnLCcgKyBvcHRpb25zLmhlaWdodCAvIDIgKyAnKScpO1xuXHRcdFx0XHR9KTtcblx0XHRcdFx0JHNjb3BlLiR3YXRjaChcblx0XHRcdFx0XHRmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gbmdNb2RlbC4kbW9kZWxWYWx1ZTtcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdGZ1bmN0aW9uIChuZXdWYWx1ZSwgb2xkVmFsdWUpIHtcblx0XHRcdFx0XHRcdGlmICghbmV3VmFsdWUpIHtcblx0XHRcdFx0XHRcdFx0aGFuZGxlTGFiZWwudGV4dChwYXJzZUludCgwKSk7XG5cdFx0XHRcdFx0XHRcdGhhbmRsZUNvbnQuYXR0cihcInRyYW5zZm9ybVwiLCAndHJhbnNsYXRlKCcgKyB4KDApICsgJywnICsgb3B0aW9ucy5oZWlnaHQgLyAyICsgJyknKTtcblx0XHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0aGFuZGxlTGFiZWwudGV4dChwYXJzZUludChuZXdWYWx1ZVtvcHRpb25zLmZpZWxkXSkpO1xuXHRcdFx0XHRcdFx0aWYgKG5ld1ZhbHVlID09IG9sZFZhbHVlKSB7XG5cdFx0XHRcdFx0XHRcdGhhbmRsZUNvbnQuYXR0cihcInRyYW5zZm9ybVwiLCAndHJhbnNsYXRlKCcgKyB4KG5ld1ZhbHVlW29wdGlvbnMuZmllbGRdKSArICcsJyArIG9wdGlvbnMuaGVpZ2h0IC8gMiArICcpJyk7XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRoYW5kbGVDb250LnRyYW5zaXRpb24oKS5kdXJhdGlvbig1MDApLmVhc2UoJ3F1YWQnKS5hdHRyKFwidHJhbnNmb3JtXCIsICd0cmFuc2xhdGUoJyArIHgobmV3VmFsdWVbb3B0aW9ucy5maWVsZF0pICsgJywnICsgb3B0aW9ucy5oZWlnaHQgLyAyICsgJyknKTtcblxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH07XG5cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoICdhcHAuY29udHJvbGxlcnMnICkuY29udHJvbGxlciggJ01lZGlhbkN0cmwnLCBmdW5jdGlvbigpe1xuXHRcdC8vXG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5kaXJlY3RpdmVzJykuZGlyZWN0aXZlKCAncGFyc2Vjc3YnLCBmdW5jdGlvbigkc3RhdGUsICR0aW1lb3V0LCB0b2FzdHIsIEluZGV4U2VydmljZSkge1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlc3RyaWN0OiAnRUEnLFxuXHRcdFx0dGVtcGxhdGVVcmw6ICd2aWV3cy9kaXJlY3RpdmVzL3BhcnNlY3N2L3BhcnNlY3N2Lmh0bWwnLFxuXHRcdFx0Y29udHJvbGxlcjogJ1BhcnNlY3N2Q3RybCcsXG5cdFx0XHRyZXBsYWNlOnRydWUsXG5cdFx0XHRsaW5rOiBmdW5jdGlvbiggJHNjb3BlLCBlbGVtZW50LCAkYXR0cnMgKXtcblx0XHRcdFx0Ly9cblx0XHRcdFx0dmFyIGVycm9ycyA9IDA7XG5cdFx0XHRcdHZhciBzdGVwcGVkID0gMCwgcm93Q291bnQgPSAwLCBlcnJvckNvdW50ID0gMCwgZmlyc3RFcnJvcjtcblx0XHRcdFx0dmFyIHN0YXJ0LCBlbmQ7XG5cdFx0XHRcdHZhciBmaXJzdFJ1biA9IHRydWU7XG5cdFx0XHRcdHZhciBtYXhVbnBhcnNlTGVuZ3RoID0gMTAwMDA7XG5cdFx0XHRcdHZhciBidXR0b24gPSBlbGVtZW50LmZpbmQoJ2J1dHRvbicpO1xuXHRcdFx0XHRcdHZhciBpbnB1dCA9IGVsZW1lbnQuZmluZCgnaW5wdXQnKTtcblx0XHRcdFx0XHR2YXIgaXNWZXJ0aWNhbCA9IGZhbHNlO1xuXHRcdFx0XHRcdHZhciByYXcgPSBbXTtcblx0XHRcdFx0XHR2YXIgcmF3TGlzdCA9IHt9O1xuXHRcdFx0XHRcdGlucHV0LmNzcyh7IGRpc3BsYXk6J25vbmUnIH0pO1xuXHRcdFx0XHRcdGJ1dHRvbi5iaW5kKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0XHRpbnB1dFswXS5jbGljaygpO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdGlucHV0LmJpbmQoJ2NoYW5nZScsZnVuY3Rpb24oZSl7XG5cdFx0XHRcdFx0XHRpc1ZlcnRpY2FsID0gZmFsc2U7XG5cdFx0XHRcdFx0XHRyYXcgPSBbXTtcblx0XHRcdFx0XHRcdHJhd0xpc3QgPSB7fTtcblx0XHRcdFx0XHRcdGVycm9ycyA9IDA7XG5cdFx0XHRcdFx0XHRzdGVwcGVkID0gMCwgcm93Q291bnQgPSAwLCBlcnJvckNvdW50ID0gMCwgZmlyc3RFcnJvcjtcblx0XHRcdFx0XHRcdHN0YXJ0LCBlbmQ7XG5cdFx0XHRcdFx0XHRmaXJzdFJ1biA9IHRydWU7XG5cdFx0XHRcdFx0XHRcdCR0aW1lb3V0KGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0XHRcdFx0SW5kZXhTZXJ2aWNlLmNsZWFyKCk7XG5cdFx0XHRcdFx0XHRcdFx0dmFyIGNzdiA9IFBhcGEucGFyc2UoaW5wdXRbMF0uZmlsZXNbMF0se1xuXHRcdFx0XHRcdFx0XHRcdFx0c2tpcEVtcHR5TGluZXM6IHRydWUsXG5cdFx0XHRcdFx0XHRcdFx0XHRoZWFkZXI6dHJ1ZSxcblx0XHRcdFx0XHRcdFx0XHRcdGR5bmFtaWNUeXBpbmc6IHRydWUsXG5cdFx0XHRcdFx0XHRcdFx0XHRzdGVwOmZ1bmN0aW9uKHJvdyl7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChyb3cuZGF0YVswXSwgZnVuY3Rpb24oaXRlbSwga2V5KXtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZihpc05hTihpdGVtKSB8fCBpdGVtIDwgMCApe1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWYoLyppdGVtLnRvU3RyaW5nKCkudG9VcHBlckNhc2UoKSA9PSBcIk5BXCIgfHwgKi9pdGVtIDwgMCB8fCBpdGVtLnRvU3RyaW5nKCkudG9VcHBlckNhc2UoKS5pbmRleE9mKCdOL0EnKSA+IC0xKXtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cm93LmVycm9ycy5wdXNoKHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR0eXBlOlwiMVwiLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1lc3NhZ2U6XCJGaWVsZCBpbiByb3cgaXMgbm90IHZhbGlkIGZvciBkYXRhYmFzZSB1c2UhXCIsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Y29sdW1uOiBpdGVtXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVycm9ycysrO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlmKGlzVmVydGljYWwpe1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChyb3cuZGF0YVswXSwgZnVuY3Rpb24oaXRlbSwga2V5KXtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlmKGtleS5sZW5ndGggPT0gMyl7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlmKHR5cGVvZlx0cmF3TGlzdFtrZXldLmRhdGEgPT0gXCJ1bmRlZmluZWRcIil7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRyYXdMaXN0W2tleV0uZGF0YSA9IFtdO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJhd0xpc3Rba2V5XS5kYXRhLnB1c2goaXRlbSk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Ly9yYXdMaXN0W2tleV0uZXJyb3JzID0gcm93LmVycm9ycztcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRlbHNle1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdEluZGV4U2VydmljZS5hZGREYXRhKHJvdyk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0Ly9jb25zb2xlLmxvZyhyb3cpO1xuXG5cdFx0XHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHRcdFx0YmVmb3JlRmlyc3RDaHVuazogZnVuY3Rpb24oY2h1bmspXG5cdFx0XHRcdFx0XHRcdFx0XHR7XG5cblx0XHRcdFx0XHRcdFx0XHRcdFx0Ly9DaGVjayBpZiB0aGVyZSBhcmUgcG9pbnRzIGluIHRoZSBoZWFkZXJzXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHZhciBpbmRleCA9IGNodW5rLm1hdGNoKCAvXFxyXFxufFxccnxcXG4vICkuaW5kZXg7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0dmFyIGRlbGltaXRlciA9ICcsJztcblx0XHRcdFx0XHRcdFx0XHQgICAgdmFyIGhlYWRpbmdzID0gY2h1bmsuc3Vic3RyKDAsIGluZGV4KS5zcGxpdCggJywnICk7XG5cblx0XHRcdFx0XHRcdFx0XHRcdFx0aWYoaGVhZGluZ3MubGVuZ3RoIDwgMil7XG4gXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGhlYWRpbmdzID0gY2h1bmsuc3Vic3RyKDAsIGluZGV4KS5zcGxpdCggXCJcXHRcIiApO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRlbGltaXRlciA9ICdcXHQnO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHZhciBpc0lzbyA9IFtdO1xuXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGZvcih2YXIgaSA9IDA7IGkgPD0gaGVhZGluZ3MubGVuZ3RoOyBpKyspe1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlmKGhlYWRpbmdzW2ldKXtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGhlYWRpbmdzW2ldID0gaGVhZGluZ3NbaV0ucmVwbGFjZSgvW15hLXowLTldL2dpLCdfJykudG9Mb3dlckNhc2UoKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlmKGhlYWRpbmdzW2ldLmluZGV4T2YoJy4nKSA+IC0xKXtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aGVhZGluZ3NbaV0gPSBoZWFkaW5nc1tpXS5zdWJzdHIoMCwgaGVhZGluZ3NbaV0uaW5kZXhPZignLicpKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHZhciBoZWFkID0gaGVhZGluZ3NbaV0uc3BsaXQoJ18nKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlmKGhlYWQubGVuZ3RoID4gMSl7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGhlYWRpbmdzW2ldID0gJyc7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGZvcih2YXIgaiA9IDA7IGogPCBoZWFkLmxlbmd0aDsgaisrKXtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZihpc05hTihoZWFkW2pdKSl7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZihqID4gMCl7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGhlYWRpbmdzW2ldICs9ICdfJztcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGhlYWRpbmdzW2ldICs9IGhlYWRbal07XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlmKGhlYWRpbmdzW2ldLmxlbmd0aCA9PSAzKXtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aXNJc28ucHVzaCh0cnVlKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0aWYoaGVhZGluZ3MubGVuZ3RoID09IGlzSXNvLmxlbmd0aCl7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0aXNWZXJ0aWNhbCA9IHRydWU7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRmb3IodmFyIGkgPSAwOyBpIDw9IGhlYWRpbmdzLmxlbmd0aDsgaSsrKXtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWYodHlwZW9mIHJhd0xpc3RbaGVhZGluZ3NbaV1dID09IFwidW5kZWZpbmVkXCIpe1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJhd0xpc3RbaGVhZGluZ3NbaV1dID0ge307XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cmF3TGlzdFtoZWFkaW5nc1tpXV0uZGF0YSA9IFtdO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0XHQgICAgcmV0dXJuIGhlYWRpbmdzLmpvaW4oZGVsaW1pdGVyKSArIGNodW5rLnN1YnN0cihpbmRleCk7XG5cdFx0XHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHRcdFx0ZXJyb3I6IGZ1bmN0aW9uKGVyciwgZmlsZSlcblx0XHRcdFx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0VG9hc3RTZXJ2aWNlLmVycm9yKGVycik7XG5cdFx0XHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHRcdFx0Y29tcGxldGU6IGZ1bmN0aW9uKHJlc3VsdHMpXG5cdFx0XHRcdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdEluZGV4U2VydmljZS5zZXRFcnJvcnMoZXJyb3JzKTtcblxuXHRcdFx0XHRcdFx0XHRcdFx0XHQvL1NlZSBpZiB0aGVyZSBpcyBhbiBmaWVsZCBuYW1lIFwiaXNvXCIgaW4gdGhlIGhlYWRpbmdzO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZighaXNWZXJ0aWNhbCl7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKEluZGV4U2VydmljZS5nZXRGaXJzdEVudHJ5KCkuZGF0YVswXSwgZnVuY3Rpb24oaXRlbSwga2V5KXtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlmKGtleS50b0xvd2VyQ2FzZSgpLmluZGV4T2YoJ2lzbycpICE9IC0xIHx8IGtleS50b0xvd2VyQ2FzZSgpLmluZGV4T2YoJ2NvZGUnKSAhPSAtMSl7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdEluZGV4U2VydmljZS5zZXRJc29GaWVsZChrZXkpO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZihrZXkudG9Mb3dlckNhc2UoKS5pbmRleE9mKCdjb3VudHJ5JykgIT0gLTEpe1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdEluZGV4U2VydmljZS5zZXRDb3VudHJ5RmllbGQoa2V5KTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGVsc2V7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKHJhd0xpc3QsIGZ1bmN0aW9uKGl0ZW0sa2V5KXtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGl0ZW0uZXJyb3JzID0gW107XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZihrZXkudG9Mb3dlckNhc2UoKSAhPSBcInVuZGVmaW5lZFwiICYmIHR5cGVvZiBrZXkgIT0gXCJ1bmRlZmluZWRcIil7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHZhciByID0ge2lzbzprZXkudG9VcHBlckNhc2UoKX07XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChpdGVtLmRhdGEsIGZ1bmN0aW9uKGNvbHVtbiwgaSl7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0clsnY29sdW1uXycraV0gPSBjb2x1bW47XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWYoaXNOYU4oY29sdW1uKSB8fCBjb2x1bW4gPCAwICl7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZihjb2x1bW4udG9TdHJpbmcoKS50b1VwcGVyQ2FzZSgpID09IFwiTkFcIiB8fCBjb2x1bW4gPCAwIHx8IGNvbHVtbi50b1N0cmluZygpLnRvVXBwZXJDYXNlKCkuaW5kZXhPZignTi9BJykgPiAtMSl7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGl0ZW0uZXJyb3JzLnB1c2goe1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHR5cGU6XCIxXCIsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bWVzc2FnZTpcIkZpZWxkIGluIHJvdyBpcyBub3QgdmFsaWQgZm9yIGRhdGFiYXNlIHVzZSFcIixcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjb2x1bW46IGl0ZW1cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZXJyb3JzKys7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0SW5kZXhTZXJ2aWNlLmFkZERhdGEoe2RhdGE6W3JdLCBlcnJvcnM6aXRlbS5lcnJvcnN9KTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRJbmRleFNlcnZpY2Uuc2V0SXNvRmllbGQoJ2lzbycpO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cblxuXHRcdFx0XHRcdFx0XHRcdFx0XHRJbmRleFNlcnZpY2Uuc2V0VG9Mb2NhbFN0b3JhZ2UoKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0dG9hc3RyLmluZm8oSW5kZXhTZXJ2aWNlLmdldERhdGFTaXplKCkrJyBsaW5lcyBpbXBvcnRldCEnLCAnSW5mb3JtYXRpb24nKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0JHN0YXRlLmdvKCdhcHAuaW5kZXguY2hlY2snKTtcblx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH07XG5cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoICdhcHAuY29udHJvbGxlcnMnICkuY29udHJvbGxlciggJ1BhcnNlY3N2Q3RybCcsIGZ1bmN0aW9uKCl7XG5cdFx0Ly9cblxuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZGlyZWN0aXZlcycpLmRpcmVjdGl2ZSggJ3NpbXBsZWxpbmVjaGFydCcsIGZ1bmN0aW9uKCkge1xuXHRcdHZhciBkZWZhdWx0cyA9IGZ1bmN0aW9uKCl7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRpbnZlcnQ6ZmFsc2Vcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlc3RyaWN0OiAnRScsXG5cdFx0XHRzY29wZTp7XG5cdFx0XHRcdGRhdGE6Jz0nLFxuXHRcdFx0XHRzZWxlY3Rpb246Jz0nLFxuXHRcdFx0XHRvcHRpb25zOic9J1xuXHRcdFx0fSxcblx0XHRcdHRlbXBsYXRlVXJsOiAndmlld3MvZGlyZWN0aXZlcy9zaW1wbGVsaW5lY2hhcnQvc2ltcGxlbGluZWNoYXJ0Lmh0bWwnLFxuXHRcdFx0Y29udHJvbGxlcjogJ1NpbXBsZWxpbmVjaGFydEN0cmwnLFxuXHRcdFx0bGluazogZnVuY3Rpb24oICRzY29wZSwgZWxlbWVudCwgJGF0dHJzICl7XG5cdFx0XHRcdCRzY29wZS5vcHRpb25zID0gYW5ndWxhci5leHRlbmQoZGVmYXVsdHMoKSwgJHNjb3BlLm9wdGlvbnMpO1xuXHRcdFx0XHQkc2NvcGUuY2FsY3VsYXRlR3JhcGgoKTtcblx0XHRcdFx0JHNjb3BlLnNldENoYXJ0KCk7XG5cdFx0XHR9XG5cdFx0fTtcblxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdTaW1wbGVsaW5lY2hhcnRDdHJsJywgZnVuY3Rpb24gKCRzY29wZSkge1xuXHRcdCRzY29wZS5jb25maWcgPSB7XG5cdFx0XHR2aXNpYmxlOiB0cnVlLCAvLyBkZWZhdWx0OiB0cnVlXG5cdFx0XHRleHRlbmRlZDogZmFsc2UsIC8vIGRlZmF1bHQ6IGZhbHNlXG5cdFx0XHRkaXNhYmxlZDogZmFsc2UsIC8vIGRlZmF1bHQ6IGZhbHNlXG5cdFx0XHRhdXRvcmVmcmVzaDogdHJ1ZSwgLy8gZGVmYXVsdDogdHJ1ZVxuXHRcdFx0cmVmcmVzaERhdGFPbmx5OiBmYWxzZSwgLy8gZGVmYXVsdDogZmFsc2Vcblx0XHRcdGRlZXBXYXRjaE9wdGlvbnM6IHRydWUsIC8vIGRlZmF1bHQ6IHRydWVcblx0XHRcdGRlZXBXYXRjaERhdGE6IGZhbHNlLCAvLyBkZWZhdWx0OiBmYWxzZVxuXHRcdFx0ZGVlcFdhdGNoQ29uZmlnOiB0cnVlLCAvLyBkZWZhdWx0OiB0cnVlXG5cdFx0XHRkZWJvdW5jZTogMTAgLy8gZGVmYXVsdDogMTBcblx0XHR9O1xuXHRcdCRzY29wZS5jaGFydCA9IHtcblx0XHRcdG9wdGlvbnM6IHtcblx0XHRcdFx0Y2hhcnQ6IHt9XG5cdFx0XHR9LFxuXHRcdFx0ZGF0YTogW11cblx0XHR9O1xuXHRcdCRzY29wZS5zZXRDaGFydCA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdCRzY29wZS5jaGFydC5vcHRpb25zLmNoYXJ0ID0ge1xuXHRcdFx0XHR0eXBlOiAnbGluZUNoYXJ0Jyxcblx0XHRcdFx0bGVnZW5kUG9zaXRpb246ICdsZWZ0Jyxcblx0XHRcdFx0bWFyZ2luOiB7XG5cdFx0XHRcdFx0dG9wOiAyMCxcblx0XHRcdFx0XHRyaWdodDogMjAsXG5cdFx0XHRcdFx0Ym90dG9tOiAyMCxcblx0XHRcdFx0XHRsZWZ0OiAyMFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR4OiBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdHJldHVybiBkLng7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdHk6IGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGQueTtcblx0XHRcdFx0fSxcblx0XHRcdFx0c2hvd0xlZ2VuZDogZmFsc2UsXG5cdFx0XHRcdHNob3dWYWx1ZXM6IGZhbHNlLFxuXHRcdFx0XHRzaG93WUF4aXM6IGZhbHNlLFxuXHRcdFx0XHR0cmFuc2l0aW9uRHVyYXRpb246IDUwMCxcblx0XHRcdFx0dXNlSW50ZXJhY3RpdmVHdWlkZWxpbmU6IHRydWUsXG5cdFx0XHRcdC8vZm9yY2VZOiBbMTAwLCAwXSxcblx0XHRcdFx0Ly95RG9tYWluOnlEb21haW4sXG5cdFx0XHRcdHhBeGlzOiB7XG5cdFx0XHRcdFx0YXhpc0xhYmVsOiAnJ1xuXHRcdFx0XHR9LFxuXHRcdFx0XHR5QXhpczoge1xuXHRcdFx0XHRcdGF4aXNMYWJlbDogJycsXG5cdFx0XHRcdFx0YXhpc0xhYmVsRGlzdGFuY2U6IDMwXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGxlZ2VuZDoge1xuXHRcdFx0XHRcdHJpZ2h0QWxpZ246IGZhbHNlXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGxpbmVzOiB7XG5cdFx0XHRcdFx0aW50ZXJwb2xhdGU6ICdjYXJkaW5hbCdcblx0XHRcdFx0fVxuXG5cdFx0XHR9O1xuXHRcdFx0aWYgKCRzY29wZS5vcHRpb25zLmludmVydCA9PSB0cnVlKSB7XG5cdFx0XHRcdCRzY29wZS5jaGFydC5vcHRpb25zLmNoYXJ0LnlEb21haW4gPSBbcGFyc2VJbnQoJHNjb3BlLnJhbmdlLm1heCksICRzY29wZS5yYW5nZS5taW5dO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuICRzY29wZS5jaGFydDtcblx0XHR9XG5cdFx0JHNjb3BlLmNhbGN1bGF0ZUdyYXBoID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0dmFyIGNoYXJ0RGF0YSA9IFtdO1xuXHRcdFx0JHNjb3BlLnJhbmdlID0ge1xuXHRcdFx0XHRtYXg6IDAsXG5cdFx0XHRcdG1pbjogMTAwMFxuXHRcdFx0fTtcblx0XHRcdGFuZ3VsYXIuZm9yRWFjaCgkc2NvcGUuc2VsZWN0aW9uLCBmdW5jdGlvbiAoaXRlbSwga2V5KSB7XG5cdFx0XHRcdHZhciBncmFwaCA9IHtcblx0XHRcdFx0XHRpZDoga2V5LFxuXHRcdFx0XHRcdGtleTogaXRlbS50aXRsZSxcblx0XHRcdFx0XHRjb2xvcjogaXRlbS5jb2xvcixcblx0XHRcdFx0XHR2YWx1ZXM6IFtdXG5cdFx0XHRcdH07XG5cdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaCgkc2NvcGUuZGF0YSwgZnVuY3Rpb24gKGRhdGEsIGspIHtcblx0XHRcdFx0XHRncmFwaC52YWx1ZXMucHVzaCh7XG5cdFx0XHRcdFx0XHRpZDogayxcblx0XHRcdFx0XHRcdHg6IGRhdGFbaXRlbS5maWVsZHMueF0sXG5cdFx0XHRcdFx0XHR5OiBkYXRhW2l0ZW0uZmllbGRzLnldXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0JHNjb3BlLnJhbmdlLm1heCA9IE1hdGgubWF4KCRzY29wZS5yYW5nZS5tYXgsIGRhdGFbaXRlbS5maWVsZHMueV0pO1xuXHRcdFx0XHRcdCRzY29wZS5yYW5nZS5taW4gPSBNYXRoLm1pbigkc2NvcGUucmFuZ2UubWluLCBkYXRhW2l0ZW0uZmllbGRzLnldKTtcblx0XHRcdFx0fSk7XG5cdFx0XHRcdGNoYXJ0RGF0YS5wdXNoKGdyYXBoKTtcblx0XHRcdH0pO1xuXG5cdFx0XHQkc2NvcGUuY2hhcnQuZGF0YSA9IGNoYXJ0RGF0YTtcblx0XHRcdGlmICgkc2NvcGUub3B0aW9ucy5pbnZlcnQgPT0gXCJ0cnVlXCIpIHtcblx0XHRcdFx0JHNjb3BlLmNoYXJ0Lm9wdGlvbnMuY2hhcnQueURvbWFpbiA9IFtwYXJzZUludCgkc2NvcGUucmFuZ2UubWF4KSwgJHNjb3BlLnJhbmdlLm1pbl07XG5cdFx0XHR9XG5cdFx0fTtcblx0XHQkc2NvcGUuJHdhdGNoKCdkYXRhJywgZnVuY3Rpb24gKG4sIG8pIHtcblx0XHRcdGlmICghbikge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0XHQkc2NvcGUuY2FsY3VsYXRlR3JhcGgoKTtcblx0XHR9KTtcblx0XHQkc2NvcGUuJHdhdGNoKCdzZWxlY3Rpb24nLCBmdW5jdGlvbiAobiwgbykge1xuXHRcdFx0aWYgKG4gPT09IG8pIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdFx0JHNjb3BlLmNhbGN1bGF0ZUdyYXBoKCk7XG5cdFx0fSlcblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5kaXJlY3RpdmVzJykuYW5pbWF0aW9uKCcuc2xpZGUtdG9nZ2xlJywgWyckYW5pbWF0ZUNzcycsIGZ1bmN0aW9uKCRhbmltYXRlQ3NzKSB7XG5cblx0XHR2YXIgbGFzdElkID0gMDtcbiAgICAgICAgdmFyIF9jYWNoZSA9IHt9O1xuXG4gICAgICAgIGZ1bmN0aW9uIGdldElkKGVsKSB7XG4gICAgICAgICAgICB2YXIgaWQgPSBlbFswXS5nZXRBdHRyaWJ1dGUoXCJkYXRhLXNsaWRlLXRvZ2dsZVwiKTtcbiAgICAgICAgICAgIGlmICghaWQpIHtcbiAgICAgICAgICAgICAgICBpZCA9ICsrbGFzdElkO1xuICAgICAgICAgICAgICAgIGVsWzBdLnNldEF0dHJpYnV0ZShcImRhdGEtc2xpZGUtdG9nZ2xlXCIsIGlkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBpZDtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBnZXRTdGF0ZShpZCkge1xuICAgICAgICAgICAgdmFyIHN0YXRlID0gX2NhY2hlW2lkXTtcbiAgICAgICAgICAgIGlmICghc3RhdGUpIHtcbiAgICAgICAgICAgICAgICBzdGF0ZSA9IHt9O1xuICAgICAgICAgICAgICAgIF9jYWNoZVtpZF0gPSBzdGF0ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGdlbmVyYXRlUnVubmVyKGNsb3NpbmcsIHN0YXRlLCBhbmltYXRvciwgZWxlbWVudCwgZG9uZUZuKSB7XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgc3RhdGUuYW5pbWF0aW5nID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBzdGF0ZS5hbmltYXRvciA9IGFuaW1hdG9yO1xuICAgICAgICAgICAgICAgIHN0YXRlLmRvbmVGbiA9IGRvbmVGbjtcbiAgICAgICAgICAgICAgICBhbmltYXRvci5zdGFydCgpLmZpbmFsbHkoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjbG9zaW5nICYmIHN0YXRlLmRvbmVGbiA9PT0gZG9uZUZuKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50WzBdLnN0eWxlLmhlaWdodCA9ICcnO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHN0YXRlLmFuaW1hdGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBzdGF0ZS5hbmltYXRvciA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAgICAgc3RhdGUuZG9uZUZuKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgbGVhdmU6IGZ1bmN0aW9uKGVsZW1lbnQsIGRvbmVGbikge1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciBzdGF0ZSA9IGdldFN0YXRlKGdldElkKGVsZW1lbnQpKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGhlaWdodCA9IChzdGF0ZS5hbmltYXRpbmcgJiYgc3RhdGUuaGVpZ2h0KSA/XG4gICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZS5oZWlnaHQgOiBlbGVtZW50WzBdLm9mZnNldEhlaWdodDtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGFuaW1hdG9yID0gJGFuaW1hdGVDc3MoZWxlbWVudCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgZnJvbToge2hlaWdodDogaGVpZ2h0ICsgJ3B4Jywgb3BhY2l0eTogMX0sXG4gICAgICAgICAgICAgICAgICAgICAgICB0bzoge2hlaWdodDogJzBweCcsIG9wYWNpdHk6IDB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBpZiAoYW5pbWF0b3IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzdGF0ZS5hbmltYXRpbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZS5kb25lRm4gPVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2VuZXJhdGVSdW5uZXIodHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5pbWF0b3IsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZG9uZUZuKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gc3RhdGUuYW5pbWF0b3IuZW5kKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZS5oZWlnaHQgPSBoZWlnaHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGdlbmVyYXRlUnVubmVyKHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbmltYXRvcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZG9uZUZuKSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBkb25lRm4oKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlbnRlcjogZnVuY3Rpb24oZWxlbWVudCwgZG9uZUZuKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIHN0YXRlID0gZ2V0U3RhdGUoZ2V0SWQoZWxlbWVudCkpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgaGVpZ2h0ID0gKHN0YXRlLmFuaW1hdGluZyAmJiBzdGF0ZS5oZWlnaHQpID9cbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlLmhlaWdodCA6IGVsZW1lbnRbMF0ub2Zmc2V0SGVpZ2h0O1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciBhbmltYXRvciA9ICRhbmltYXRlQ3NzKGVsZW1lbnQsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZyb206IHtoZWlnaHQ6ICcwcHgnLCBvcGFjaXR5OiAwfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvOiB7aGVpZ2h0OiBoZWlnaHQgKyAncHgnLCBvcGFjaXR5OiAxfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFuaW1hdG9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3RhdGUuYW5pbWF0aW5nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGUuZG9uZUZuID0gZ2VuZXJhdGVSdW5uZXIoZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5pbWF0b3IsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkb25lRm4pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBzdGF0ZS5hbmltYXRvci5lbmQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlLmhlaWdodCA9IGhlaWdodDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZ2VuZXJhdGVSdW5uZXIoZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbmltYXRvcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZG9uZUZuKSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBkb25lRm4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XSk7XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCAnYXBwLmNvbnRyb2xsZXJzJyApLmNvbnRyb2xsZXIoICdTbGlkZVRvZ2dsZUN0cmwnLCBmdW5jdGlvbigpe1xuXHRcdC8vXG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmRpcmVjdGl2ZXMnKS5kaXJlY3RpdmUoJ3N1YmluZGV4Jywgc3ViaW5kZXgpO1xuXG5cdHN1YmluZGV4LiRpbmplY3QgPSBbJyR0aW1lb3V0JywgJ3Ntb290aFNjcm9sbCddO1xuXG5cdGZ1bmN0aW9uIHN1YmluZGV4KCR0aW1lb3V0LCBzbW9vdGhTY3JvbGwpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0cmVzdHJpY3Q6ICdFJyxcblx0XHRcdHJlcGxhY2U6IHRydWUsXG5cdFx0XHRjb250cm9sbGVyOiAnU3ViaW5kZXhDdHJsJyxcblx0XHRcdHRlbXBsYXRlVXJsOiAndmlld3MvZGlyZWN0aXZlcy9zdWJpbmRleC9zdWJpbmRleC5odG1sJyxcblx0XHRcdGxpbms6IHN1YmluZGV4TGlua0Z1bmN0aW9uXG5cdFx0fTtcblxuXHRcdGZ1bmN0aW9uIHN1YmluZGV4TGlua0Z1bmN0aW9uKCRzY29wZSwgZWxlbWVudCwgJGF0dHJzKSB7XG5cdFx0fVxuXHR9XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignU3ViaW5kZXhDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCAkZmlsdGVyLCAkdGltZW91dCkge1xuXHRcdCRzY29wZS5pbmZvID0gZmFsc2U7XG5cdFx0JHNjb3BlLnNldENoYXJ0ID0gc2V0Q2hhcnQ7XG5cdFx0JHNjb3BlLmNhbGN1bGF0ZUdyYXBoID0gY2FsY3VsYXRlR3JhcGg7XG5cdFx0JHNjb3BlLmNyZWF0ZUluZGV4ZXIgPSBjcmVhdGVJbmRleGVyO1xuXHRcdCRzY29wZS5jYWxjU3ViUmFuayA9IGNhbGNTdWJSYW5rO1xuXHRcdCRzY29wZS50b2dnbGVJbmZvID0gdG9nZ2xlSW5mbztcblx0XHQkc2NvcGUuY3JlYXRlT3B0aW9ucyA9IGNyZWF0ZU9wdGlvbnM7XG5cdFx0JHNjb3BlLmdldFN1YlJhbmsgPSBnZXRTdWJSYW5rO1xuXHRcdGFjdGl2YXRlKCk7XG5cblx0XHRmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcblx0XHRcdCRzY29wZS5jYWxjU3ViUmFuaygpO1xuXHRcdFx0JHNjb3BlLnNldENoYXJ0KCk7XG5cdFx0XHQkc2NvcGUuY2FsY3VsYXRlR3JhcGgoKTtcblx0XHRcdCRzY29wZS5jcmVhdGVJbmRleGVyKCk7XG5cdFx0XHQkc2NvcGUuY3JlYXRlT3B0aW9ucygpO1xuXHRcdFx0JHNjb3BlLiR3YXRjaCgnZGlzcGxheS5zZWxlY3RlZENhdCcsIGZ1bmN0aW9uKG5ld0l0ZW0sIG9sZEl0ZW0pIHtcblx0XHRcdFx0aWYgKG5ld0l0ZW0gPT09IG9sZEl0ZW0pIHtcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdH1cblx0XHRcdFx0JHNjb3BlLmNyZWF0ZUluZGV4ZXIoKTtcblx0XHRcdFx0JHNjb3BlLmNhbGN1bGF0ZUdyYXBoKCk7XG5cdFx0XHRcdCRzY29wZS5jcmVhdGVPcHRpb25zKCk7XG5cdFx0XHRcdCRzY29wZS5jYWxjU3ViUmFuaygpO1xuXHRcdFx0fSk7XG5cdFx0XHQkc2NvcGUuJHdhdGNoKCdjdXJyZW50JywgZnVuY3Rpb24obiwgbykge1xuXHRcdFx0XHRpZiAobiA9PT0gbykge1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXHRcdFx0XHQkc2NvcGUuY2FsY1N1YlJhbmsoKTtcblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIHRvZ2dsZUluZm8oKSB7XG5cdFx0XHQkc2NvcGUuaW5mbyA9ICEkc2NvcGUuaW5mbztcblx0XHR9O1xuXG5cdFx0ZnVuY3Rpb24gY2FsY1N1YlJhbmsoKSB7XG5cdFx0XHR2YXIgcmFuayA9IDA7XG5cdFx0XHRhbmd1bGFyLmZvckVhY2goJHNjb3BlLmRhdGEsIGZ1bmN0aW9uKGl0ZW0pIHtcblx0XHRcdFx0aXRlbVskc2NvcGUuZGlzcGxheS5zZWxlY3RlZENhdC50eXBlXSA9IHBhcnNlRmxvYXQoaXRlbVskc2NvcGUuZGlzcGxheS5zZWxlY3RlZENhdC50eXBlXSk7XG5cdFx0XHRcdGl0ZW1bJ3Njb3JlJ10gPSBwYXJzZUludChpdGVtWydzY29yZSddKTtcblx0XHRcdH0pXG5cdFx0XHR2YXIgZmlsdGVyID0gJGZpbHRlcignb3JkZXJCeScpKCRzY29wZS5lcGksIFskc2NvcGUuZGlzcGxheS5zZWxlY3RlZENhdC50eXBlLCBcInNjb3JlXCJdLCB0cnVlKTtcblx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgZmlsdGVyLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdGlmIChmaWx0ZXJbaV0uaXNvID09ICRzY29wZS5jdXJyZW50Lmlzbykge1xuXHRcdFx0XHRcdHJhbmsgPSBpICsgMTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0JHNjb3BlLmN1cnJlbnRbJHNjb3BlLmRpc3BsYXkuc2VsZWN0ZWRDYXQudHlwZSsnX3JhbmsnXSA9IHJhbms7XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIGdldFN1YlJhbmsoY291bnRyeSl7XG5cdFx0XHR2YXIgZmlsdGVyID0gJGZpbHRlcignb3JkZXJCeScpKCRzY29wZS5lcGksIFskc2NvcGUuZGlzcGxheS5zZWxlY3RlZENhdC50eXBlLCBcInNjb3JlXCJdLCB0cnVlKTtcblx0XHRcdHZhciByYW5rID0gMDtcblx0XHRcdGFuZ3VsYXIuZm9yRWFjaChmaWx0ZXIsIGZ1bmN0aW9uKGl0ZW0sIGtleSl7XG5cdFx0XHRcdGlmKGl0ZW0uY291bnRyeSA9PSBjb3VudHJ5LmNvdW50cnkpe1xuXHRcdFx0XHRcdHJhbmsgPSBrZXk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdFx0cmV0dXJuIHJhbmsrMTtcblx0XHR9XG5cdFx0ZnVuY3Rpb24gY3JlYXRlSW5kZXhlcigpIHtcblx0XHRcdCRzY29wZS5pbmRleGVyID0gWyRzY29wZS4kcGFyZW50LmRpc3BsYXkuc2VsZWN0ZWRDYXQuZGF0YV07XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gY3JlYXRlT3B0aW9ucygpIHtcblx0XHRcdCRzY29wZS5tZWRpYW5PcHRpb25zID0ge1xuXHRcdFx0XHRjb2xvcjogJHNjb3BlLiRwYXJlbnQuZGlzcGxheS5zZWxlY3RlZENhdC5jb2xvcixcblx0XHRcdFx0ZmllbGQ6ICRzY29wZS4kcGFyZW50LmRpc3BsYXkuc2VsZWN0ZWRDYXQudHlwZSxcblx0XHRcdFx0aGFuZGxpbmc6IGZhbHNlLFxuXHRcdFx0XHRtYXJnaW46e1xuXHRcdFx0XHRcdGxlZnQ6MTBcblx0XHRcdFx0fVxuXHRcdFx0fTtcblx0XHRcdCRzY29wZS5tZWRpYW5PcHRpb25zQmlnID0ge1xuXHRcdFx0XHRjb2xvcjogJHNjb3BlLiRwYXJlbnQuZGlzcGxheS5zZWxlY3RlZENhdC5jb2xvcixcblx0XHRcdFx0ZmllbGQ6ICRzY29wZS4kcGFyZW50LmRpc3BsYXkuc2VsZWN0ZWRDYXQudHlwZSxcblx0XHRcdFx0aGFuZGxpbmc6IGZhbHNlLFxuXHRcdFx0XHRtYXJnaW46e1xuXHRcdFx0XHRcdGxlZnQ6MjBcblx0XHRcdFx0fVxuXHRcdFx0fTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBzZXRDaGFydCgpIHtcblx0XHRcdCRzY29wZS5jaGFydCA9IHtcblx0XHRcdFx0b3B0aW9uczoge1xuXHRcdFx0XHRcdGNoYXJ0OiB7XG5cdFx0XHRcdFx0XHR0eXBlOiAnbGluZUNoYXJ0Jyxcblx0XHRcdFx0XHRcdC8vaGVpZ2h0OiAyMDAsXG5cdFx0XHRcdFx0XHRsZWdlbmRQb3NpdGlvbjogJ2xlZnQnLFxuXHRcdFx0XHRcdFx0bWFyZ2luOiB7XG5cdFx0XHRcdFx0XHRcdHRvcDogMjAsXG5cdFx0XHRcdFx0XHRcdHJpZ2h0OiAyMCxcblx0XHRcdFx0XHRcdFx0Ym90dG9tOiAyMCxcblx0XHRcdFx0XHRcdFx0bGVmdDogMjBcblx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHR4OiBmdW5jdGlvbihkKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBkLng7XG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0eTogZnVuY3Rpb24oZCkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gZC55O1xuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdHNob3dWYWx1ZXM6IGZhbHNlLFxuXHRcdFx0XHRcdFx0c2hvd1lBeGlzOiBmYWxzZSxcblx0XHRcdFx0XHRcdHRyYW5zaXRpb25EdXJhdGlvbjogNTAwLFxuXHRcdFx0XHRcdFx0dXNlSW50ZXJhY3RpdmVHdWlkZWxpbmU6IHRydWUsXG5cdFx0XHRcdFx0XHRmb3JjZVk6IFsxMDAsIDBdLFxuXHRcdFx0XHRcdFx0eEF4aXM6IHtcblx0XHRcdFx0XHRcdFx0YXhpc0xhYmVsOiAnJ1xuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdHlBeGlzOiB7XG5cdFx0XHRcdFx0XHRcdGF4aXNMYWJlbDogJycsXG5cdFx0XHRcdFx0XHRcdGF4aXNMYWJlbERpc3RhbmNlOiAzMFxuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdGxlZ2VuZDoge1xuXHRcdFx0XHRcdFx0XHRyaWdodEFsaWduOiBmYWxzZSxcblx0XHRcdFx0XHRcdFx0bWFyZ2luOiB7XG5cdFx0XHRcdFx0XHRcdFx0Ym90dG9tOiAzMFxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0bGluZXM6IHtcblx0XHRcdFx0XHRcdFx0aW50ZXJwb2xhdGU6ICdjYXJkaW5hbCdcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sXG5cdFx0XHRcdGRhdGE6IFtdXG5cdFx0XHR9O1xuXHRcdFx0cmV0dXJuICRzY29wZS5jaGFydDtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBjYWxjdWxhdGVHcmFwaCgpIHtcblx0XHRcdHZhciBjaGFydERhdGEgPSBbXTtcblx0XHRcdGFuZ3VsYXIuZm9yRWFjaCgkc2NvcGUuZGlzcGxheS5zZWxlY3RlZENhdC5jaGlsZHJlbiwgZnVuY3Rpb24oaXRlbSwga2V5KSB7XG5cdFx0XHRcdHZhciBncmFwaCA9IHtcblx0XHRcdFx0XHRrZXk6IGl0ZW0udGl0bGUsXG5cdFx0XHRcdFx0Y29sb3I6IGl0ZW0uY29sb3IsXG5cdFx0XHRcdFx0dmFsdWVzOiBbXVxuXHRcdFx0XHR9O1xuXHRcdFx0XHRhbmd1bGFyLmZvckVhY2goJHNjb3BlLmNvdW50cnkuZXBpLCBmdW5jdGlvbihkYXRhKSB7XG5cdFx0XHRcdFx0Z3JhcGgudmFsdWVzLnB1c2goe1xuXHRcdFx0XHRcdFx0eDogZGF0YS55ZWFyLFxuXHRcdFx0XHRcdFx0eTogZGF0YVtpdGVtLmNvbHVtbl9uYW1lXVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9KTtcblx0XHRcdFx0Y2hhcnREYXRhLnB1c2goZ3JhcGgpO1xuXHRcdFx0fSk7XG5cdFx0XHQkc2NvcGUuY2hhcnQuZGF0YSA9IGNoYXJ0RGF0YTtcblx0XHR9XG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5kaXJlY3RpdmVzJykuZGlyZWN0aXZlKCdzdW5idXJzdCcsIGZ1bmN0aW9uICgpIHtcblx0XHR2YXIgZGVmYXVsdHMgPSBmdW5jdGlvbigpe1xuXHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdCBtb2RlOiAnc2l6ZSdcblx0XHRcdFx0fVxuXHRcdH07XG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlc3RyaWN0OiAnRScsXG5cdFx0XHQvL3RlbXBsYXRlVXJsOiAndmlld3MvZGlyZWN0aXZlcy9zdW5idXJzdC9zdW5idXJzdC5odG1sJyxcblx0XHRcdGNvbnRyb2xsZXI6ICdTdW5idXJzdEN0cmwnLFxuXHRcdFx0c2NvcGU6IHtcblx0XHRcdFx0ZGF0YTogJz0nXG5cdFx0XHR9LFxuXHRcdFx0bGluazogZnVuY3Rpb24gKCRzY29wZSwgZWxlbWVudCwgJGF0dHJzKSB7XG5cdFx0XHRcdHZhciBvcHRpb25zID0gYW5ndWxhci5leHRlbmQoZGVmYXVsdHMoKSwgJGF0dHJzKTtcblx0XHRcdFx0JHNjb3BlLnNldENoYXJ0KCk7XG5cdFx0XHRcdCRzY29wZS5jYWxjdWxhdGVHcmFwaCgpO1xuXHRcdFx0XHR2YXIgd2lkdGggPSA2MTAsXG5cdFx0XHRcdFx0aGVpZ2h0ID0gd2lkdGgsXG5cdFx0XHRcdFx0cmFkaXVzID0gKHdpZHRoKSAvIDIsXG5cdFx0XHRcdFx0eCA9IGQzLnNjYWxlLmxpbmVhcigpLnJhbmdlKFswLCAyICogTWF0aC5QSV0pLFxuXHRcdFx0XHRcdHkgPSBkMy5zY2FsZS5wb3coKS5leHBvbmVudCgxLjMpLmRvbWFpbihbMCwgMV0pLnJhbmdlKFswLCByYWRpdXNdKSxcblx0XHRcdFx0XHQvL34geSA9IGQzLnNjYWxlLnBvdygpLmV4cG9uZW50KDEuMykuZG9tYWluKFswLCAwLjI1LCAxXSkucmFuZ2UoWzAsIDMwLCByYWRpdXNdKSxcblx0XHRcdFx0XHQvL34geSA9IGQzLnNjYWxlLmxpbmVhcigpLmRvbWFpbihbMCwgMC4yNSwgMC41LCAwLjc1LCAxXSkucmFuZ2UoWzAsIDMwLCAxMTUsIDIwMCwgcmFkaXVzXSksXG5cdFx0XHRcdFx0cGFkZGluZyA9IDAsXG5cdFx0XHRcdFx0ZHVyYXRpb24gPSAxMDAwLFxuXHRcdFx0XHRcdGNpcmNQYWRkaW5nID0gMTA7XG5cblx0XHRcdFx0dmFyIGRpdiA9IGQzLnNlbGVjdChlbGVtZW50WzBdKTtcblxuXG5cdFx0XHRcdHZhciB2aXMgPSBkaXYuYXBwZW5kKFwic3ZnXCIpXG5cdFx0XHRcdFx0LmF0dHIoXCJ3aWR0aFwiLCB3aWR0aCArIHBhZGRpbmcgKiAyKVxuXHRcdFx0XHRcdC5hdHRyKFwiaGVpZ2h0XCIsIGhlaWdodCArIHBhZGRpbmcgKiAyKVxuXHRcdFx0XHRcdC5hcHBlbmQoXCJnXCIpXG5cdFx0XHRcdFx0LmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIgKyBbcmFkaXVzICsgcGFkZGluZywgcmFkaXVzICsgcGFkZGluZ10gKyBcIilcIik7XG5cblx0XHRcdFx0Lypcblx0XHRcdFx0ZGl2LmFwcGVuZChcInBcIilcblx0XHRcdFx0XHRcdC5hdHRyKFwiaWRcIiwgXCJpbnRyb1wiKVxuXHRcdFx0XHRcdFx0LnRleHQoXCJDbGljayB0byB6b29tIVwiKTtcblx0XHRcdFx0Ki9cblxuXHRcdFx0XHR2YXIgcGFydGl0aW9uID0gZDMubGF5b3V0LnBhcnRpdGlvbigpXG5cdFx0XHRcdFx0LnNvcnQobnVsbClcblx0XHRcdFx0XHQudmFsdWUoZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdHJldHVybiAxO1xuXHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdHZhciBhcmMgPSBkMy5zdmcuYXJjKClcblx0XHRcdFx0XHQuc3RhcnRBbmdsZShmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIE1hdGgubWF4KDAsIE1hdGgubWluKDIgKiBNYXRoLlBJLCB4KGQueCkpKTtcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC5lbmRBbmdsZShmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIE1hdGgubWF4KDAsIE1hdGgubWluKDIgKiBNYXRoLlBJLCB4KGQueCArIGQuZHgpKSk7XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQuaW5uZXJSYWRpdXMoZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdHJldHVybiBNYXRoLm1heCgwLCBkLnkgPyB5KGQueSkgOiBkLnkpO1xuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0Lm91dGVyUmFkaXVzKGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gTWF0aC5tYXgoMCwgeShkLnkgKyBkLmR5KSk7XG5cdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0dmFyIHNwZWNpYWwxID0gXCJXYXN0ZXdhdGVyIFRyZWF0bWVudFwiLFxuXHRcdFx0XHRcdHNwZWNpYWwyID0gXCJBaXIgUG9sbHV0aW9uIFBNMi41IEV4Y2VlZGFuY2VcIixcblx0XHRcdFx0XHRzcGVjaWFsMyA9IFwiQWdyaWN1bHR1cmFsIFN1YnNpZGllc1wiLFxuXHRcdFx0XHRcdHNwZWNpYWw0ID0gXCJQZXN0aWNpZGUgUmVndWxhdGlvblwiO1xuXG5cblx0XHRcdFx0dmFyIG5vZGVzID0gcGFydGl0aW9uLm5vZGVzKCRzY29wZS5jYWxjdWxhdGVHcmFwaCgpKTtcblxuXHRcdFx0XHR2YXIgcGF0aCA9IHZpcy5zZWxlY3RBbGwoXCJwYXRoXCIpLmRhdGEobm9kZXMpO1xuXHRcdFx0XHRwYXRoLmVudGVyKCkuYXBwZW5kKFwicGF0aFwiKVxuXHRcdFx0XHRcdC5hdHRyKFwiaWRcIiwgZnVuY3Rpb24gKGQsIGkpIHtcblx0XHRcdFx0XHRcdHJldHVybiBcInBhdGgtXCIgKyBpO1xuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0LmF0dHIoXCJkXCIsIGFyYylcblx0XHRcdFx0XHQuYXR0cihcImZpbGwtcnVsZVwiLCBcImV2ZW5vZGRcIilcblx0XHRcdFx0XHQuYXR0cihcImNsYXNzXCIsIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZC5kZXB0aCA/IFwiYnJhbmNoXCIgOiBcInJvb3RcIjtcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC5zdHlsZShcImZpbGxcIiwgc2V0Q29sb3IpXG5cdFx0XHRcdFx0Lm9uKFwiY2xpY2tcIiwgY2xpY2spO1xuXG5cdFx0XHRcdHZhciB0ZXh0ID0gdmlzLnNlbGVjdEFsbChcInRleHRcIikuZGF0YShub2Rlcyk7XG5cdFx0XHRcdHZhciB0ZXh0RW50ZXIgPSB0ZXh0LmVudGVyKCkuYXBwZW5kKFwidGV4dFwiKVxuXHRcdFx0XHRcdC5zdHlsZShcImZpbGwtb3BhY2l0eVwiLCAxKVxuXHRcdFx0XHRcdC5hdHRyKFwidGV4dC1hbmNob3JcIiwgZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdGlmIChkLmRlcHRoKVxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gXCJtaWRkbGVcIjtcblx0XHRcdFx0XHRcdC8vfiByZXR1cm4geChkLnggKyBkLmR4IC8gMikgPiBNYXRoLlBJID8gXCJlbmRcIiA6IFwic3RhcnRcIjtcblx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0cmV0dXJuIFwibWlkZGxlXCI7XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQuYXR0cihcImlkXCIsIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gXCJkZXB0aFwiICsgZC5kZXB0aDtcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC5hdHRyKFwiY2xhc3NcIiwgZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdHJldHVybiBcInNlY3RvclwiXG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQuYXR0cihcImR5XCIsIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZC5kZXB0aCA/IFwiLjJlbVwiIDogXCIwLjM1ZW1cIjtcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC5hdHRyKFwidHJhbnNmb3JtXCIsIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHR2YXIgbXVsdGlsaW5lID0gKGQubmFtZSB8fCBcIlwiKS5zcGxpdChcIiBcIikubGVuZ3RoID4gMixcblx0XHRcdFx0XHRcdFx0YW5nbGVBbGlnbiA9IChkLnggPiAwLjUgPyAyIDogLTIpLFxuXHRcdFx0XHRcdFx0XHRhbmdsZSA9IHgoZC54ICsgZC5keCAvIDIpICogMTgwIC8gTWF0aC5QSSAtIDkwICsgKG11bHRpbGluZSA/IGFuZ2xlQWxpZ24gOiAwKSxcblx0XHRcdFx0XHRcdFx0cm90YXRlID0gYW5nbGUgKyAobXVsdGlsaW5lID8gLS41IDogMCksXG5cdFx0XHRcdFx0XHRcdHRyYW5zbCA9ICh5KGQueSkgKyBjaXJjUGFkZGluZykgKyAzNSxcblx0XHRcdFx0XHRcdFx0c2VjQW5nbGUgPSAoYW5nbGUgPiA5MCA/IC0xODAgOiAwKTtcblx0XHRcdFx0XHRcdGlmIChkLm5hbWUgPT0gc3BlY2lhbDMgfHwgZC5uYW1lID09IHNwZWNpYWw0KSByb3RhdGUgKz0gMTtcblx0XHRcdFx0XHRcdGlmIChkLmRlcHRoID09IDApIHtcblx0XHRcdFx0XHRcdFx0dHJhbnNsID0gLTIuNTA7XG5cdFx0XHRcdFx0XHRcdHJvdGF0ZSA9IDA7XG5cdFx0XHRcdFx0XHRcdHNlY0FuZ2xlID0gMDtcblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoZC5kZXB0aCA9PSAxKSB0cmFuc2wgKz0gLTk7XG5cdFx0XHRcdFx0XHRlbHNlIGlmIChkLmRlcHRoID09IDIpIHRyYW5zbCArPSAtNTtcblx0XHRcdFx0XHRcdGVsc2UgaWYgKGQuZGVwdGggPT0gMykgdHJhbnNsICs9IDQ7XG5cdFx0XHRcdFx0XHRyZXR1cm4gXCJyb3RhdGUoXCIgKyByb3RhdGUgKyBcIil0cmFuc2xhdGUoXCIgKyB0cmFuc2wgKyBcIilyb3RhdGUoXCIgKyBzZWNBbmdsZSArIFwiKVwiO1xuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0Lm9uKFwiY2xpY2tcIiwgY2xpY2spO1xuXG5cdFx0XHRcdC8vIEFkZCBsYWJlbHMuIFZlcnkgdWdseSBjb2RlIHRvIHNwbGl0IHNlbnRlbmNlcyBpbnRvIGxpbmVzLiBDYW4gb25seSBtYWtlXG5cdFx0XHRcdC8vIGNvZGUgYmV0dGVyIGlmIGZpbmQgYSB3YXkgdG8gdXNlIGQgb3V0c2lkZSBjYWxscyBzdWNoIGFzIC50ZXh0KGZ1bmN0aW9uKGQpKVxuXG5cdFx0XHRcdC8vIFRoaXMgYmxvY2sgcmVwbGFjZXMgdGhlIHR3byBibG9ja3MgYXJyb3VuZCBpdC4gSXQgaXMgJ3VzZWZ1bCcgYmVjYXVzZSBpdFxuXHRcdFx0XHQvLyB1c2VzIGZvcmVpZ25PYmplY3QsIHNvIHRoYXQgdGV4dCB3aWxsIHdyYXAgYXJvdW5kIGxpa2UgaW4gcmVndWxhciBIVE1MLiBJIHRyaWVkXG5cdFx0XHRcdC8vIHRvIGdldCBpdCB0byB3b3JrLCBidXQgaXQgb25seSBpbnRyb2R1Y2VkIG1vcmUgYnVncy4gVW5mb3J0dW5hdGVseSwgdGhlXG5cdFx0XHRcdC8vIHVnbHkgc29sdXRpb24gKGhhcmQgY29kZWQgbGluZSBzcGxpY2luZykgd29uLlxuXHRcdFx0XHQvL34gdmFyIHRleHRFbnRlciA9IHRleHQuZW50ZXIoKS5hcHBlbmQoXCJmb3JlaWduT2JqZWN0XCIpXG5cdFx0XHRcdC8vfiAuYXR0cihcInhcIiwwKVxuXHRcdFx0XHQvL34gLmF0dHIoXCJ5XCIsLTIwKVxuXHRcdFx0XHQvL34gLmF0dHIoXCJoZWlnaHRcIiwgMTAwKVxuXHRcdFx0XHQvL34gLmF0dHIoXCJ3aWR0aFwiLCBmdW5jdGlvbihkKXsgcmV0dXJuICh5KGQuZHkpICs1MCk7IH0pXG5cdFx0XHRcdC8vfiAuYXR0cihcInRyYW5zZm9ybVwiLCBmdW5jdGlvbihkKSB7XG5cdFx0XHRcdC8vfiB2YXIgYW5nbGVBbGlnbiA9IChkLnggPiAwLjUgPyAyIDogLTIpLFxuXHRcdFx0XHQvL34gYW5nbGUgPSB4KGQueCArIGQuZHggLyAyKSAqIDE4MCAvIE1hdGguUEkgLSA5MCxcblx0XHRcdFx0Ly9+IHRyYW5zbCA9ICh5KGQueSkgKyBjaXJjUGFkZGluZyk7XG5cdFx0XHRcdC8vfiBkLnJvdCA9IGFuZ2xlO1xuXHRcdFx0XHQvL34gaWYgKCFkLmRlcHRoKSB0cmFuc2wgPSAtNTA7XG5cdFx0XHRcdC8vfiBpZiAoYW5nbGUgPiA5MCkgdHJhbnNsICs9IDEyMDtcblx0XHRcdFx0Ly9+IGlmIChkLmRlcHRoKVxuXHRcdFx0XHQvL34gcmV0dXJuIFwicm90YXRlKFwiICsgYW5nbGUgKyBcIil0cmFuc2xhdGUoXCIgKyB0cmFuc2wgKyBcIilyb3RhdGUoXCIgKyAoYW5nbGUgPiA5MCA/IC0xODAgOiAwKSArIFwiKVwiO1xuXHRcdFx0XHQvL34gZWxzZVxuXHRcdFx0XHQvL34gcmV0dXJuIFwidHJhbnNsYXRlKFwiICsgdHJhbnNsICsgXCIpXCI7XG5cdFx0XHRcdC8vfiB9KVxuXHRcdFx0XHQvL34gLmFwcGVuZChcInhodG1sOmJvZHlcIilcblx0XHRcdFx0Ly9+IC5zdHlsZShcImJhY2tncm91bmRcIiwgXCJub25lXCIpXG5cdFx0XHRcdC8vfiAuc3R5bGUoXCJ0ZXh0LWFsaWduXCIsIGZ1bmN0aW9uKGQpeyByZXR1cm4gKGQucm90ID4gOTAgPyBcImxlZnRcIiA6IFwicmlnaHRcIil9KVxuXHRcdFx0XHQvL34gLmh0bWwoZnVuY3Rpb24oZCl7IHJldHVybiAnPGRpdiBjbGFzcz0nICtcImRlcHRoXCIgKyBkLmRlcHRoICsnIHN0eWxlPVxcXCJ3aWR0aDogJyArKHkoZC5keSkgKzUwKSArJ3B4OycgK1widGV4dC1hbGlnbjogXCIgKyAoZC5yb3QgPiA5MCA/IFwicmlnaHRcIiA6IFwibGVmdFwiKSArJ1wiPicgK2QubmFtZSArJzwvZGl2Pic7fSlcblxuXHRcdFx0XHR0ZXh0RW50ZXIuYXBwZW5kKFwidHNwYW5cIilcblx0XHRcdFx0XHQuYXR0cihcInhcIiwgMClcblx0XHRcdFx0XHQudGV4dChmdW5jdGlvbiAoZCkge1xuXG5cdFx0XHRcdFx0XHRpZiAoZC5kZXB0aCA9PSAzICYmIGQubmFtZSAhPSBzcGVjaWFsMSAmJiBkLm5hbWUgIT0gc3BlY2lhbDIgJiYgZC5uYW1lICE9IHNwZWNpYWwzICYmIGQubmFtZSAhPSBzcGVjaWFsNClcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGQubmFtZS5zcGxpdChcIiBcIilbMF0gKyBcIiBcIiArIChkLm5hbWUuc3BsaXQoXCIgXCIpWzFdIHx8IFwiXCIpO1xuXHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gZC5uYW1lLnNwbGl0KFwiIFwiKVswXTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0dGV4dEVudGVyLmFwcGVuZChcInRzcGFuXCIpXG5cdFx0XHRcdFx0LmF0dHIoXCJ4XCIsIDApXG5cdFx0XHRcdFx0LmF0dHIoXCJkeVwiLCBcIjFlbVwiKVxuXHRcdFx0XHRcdC50ZXh0KGZ1bmN0aW9uIChkKSB7XG5cblx0XHRcdFx0XHRcdGlmIChkLmRlcHRoID09IDMgJiYgZC5uYW1lICE9IHNwZWNpYWwxICYmIGQubmFtZSAhPSBzcGVjaWFsMiAmJiBkLm5hbWUgIT0gc3BlY2lhbDMgJiYgZC5uYW1lICE9IHNwZWNpYWw0KVxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gKGQubmFtZS5zcGxpdChcIiBcIilbMl0gfHwgXCJcIikgKyBcIiBcIiArIChkLm5hbWUuc3BsaXQoXCIgXCIpWzNdIHx8IFwiXCIpO1xuXHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gKGQubmFtZS5zcGxpdChcIiBcIilbMV0gfHwgXCJcIikgKyBcIiBcIiArIChkLm5hbWUuc3BsaXQoXCIgXCIpWzJdIHx8IFwiXCIpO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR0ZXh0RW50ZXIuYXBwZW5kKFwidHNwYW5cIilcblx0XHRcdFx0XHQuYXR0cihcInhcIiwgMClcblx0XHRcdFx0XHQuYXR0cihcImR5XCIsIFwiMWVtXCIpXG5cdFx0XHRcdFx0LnRleHQoZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdGlmIChkLmRlcHRoID09IDMgJiYgZC5uYW1lICE9IHNwZWNpYWwxICYmIGQubmFtZSAhPSBzcGVjaWFsMiAmJiBkLm5hbWUgIT0gc3BlY2lhbDMgJiYgZC5uYW1lICE9IHNwZWNpYWw0KVxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gKGQubmFtZS5zcGxpdChcIiBcIilbNF0gfHwgXCJcIikgKyBcIiBcIiArIChkLm5hbWUuc3BsaXQoXCIgXCIpWzVdIHx8IFwiXCIpO1xuXHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gKGQubmFtZS5zcGxpdChcIiBcIilbM10gfHwgXCJcIikgKyBcIiBcIiArIChkLm5hbWUuc3BsaXQoXCIgXCIpWzRdIHx8IFwiXCIpOztcblx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRmdW5jdGlvbiBjbGljayhkKSB7XG5cdFx0XHRcdFx0Ly8gQ29udHJvbCBhcmMgdHJhbnNpdGlvblxuXHRcdFx0XHRcdHBhdGgudHJhbnNpdGlvbigpXG5cdFx0XHRcdFx0XHQuZHVyYXRpb24oZHVyYXRpb24pXG5cdFx0XHRcdFx0XHQuYXR0clR3ZWVuKFwiZFwiLCBhcmNUd2VlbihkKSk7XG5cblx0XHRcdFx0XHQvLyBTb21ld2hhdCBvZiBhIGhhY2sgYXMgd2UgcmVseSBvbiBhcmNUd2VlbiB1cGRhdGluZyB0aGUgc2NhbGVzLlxuXHRcdFx0XHRcdC8vIENvbnRyb2wgdGhlIHRleHQgdHJhbnNpdGlvblxuXHRcdFx0XHRcdHRleHQuc3R5bGUoXCJ2aXNpYmlsaXR5XCIsIGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBpc1BhcmVudE9mKGQsIGUpID8gbnVsbCA6IGQzLnNlbGVjdCh0aGlzKS5zdHlsZShcInZpc2liaWxpdHlcIik7XG5cdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0LnRyYW5zaXRpb24oKVxuXHRcdFx0XHRcdFx0LmR1cmF0aW9uKGR1cmF0aW9uKVxuXHRcdFx0XHRcdFx0LmF0dHJUd2VlbihcInRleHQtYW5jaG9yXCIsIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRcdFx0aWYgKGQuZGVwdGgpXG5cdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gXCJtaWRkbGVcIjtcblx0XHRcdFx0XHRcdFx0XHQvL34gcmV0dXJuIHgoZC54ICsgZC5keCAvIDIpID4gTWF0aC5QSSA/IFwiZW5kXCIgOiBcInN0YXJ0XCI7XG5cdFx0XHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIFwibWlkZGxlXCI7XG5cdFx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0LmF0dHJUd2VlbihcInRyYW5zZm9ybVwiLCBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0XHR2YXIgbXVsdGlsaW5lID0gKGQubmFtZSB8fCBcIlwiKS5zcGxpdChcIiBcIikubGVuZ3RoID4gMjtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdFx0XHR2YXIgbXVsdGlsaW5lID0gKGQubmFtZSB8fCBcIlwiKS5zcGxpdChcIiBcIikubGVuZ3RoID4gMixcblx0XHRcdFx0XHRcdFx0XHRcdGFuZ2xlQWxpZ24gPSAoZC54ID4gMC41ID8gMiA6IC0yKSxcblx0XHRcdFx0XHRcdFx0XHRcdGFuZ2xlID0geChkLnggKyBkLmR4IC8gMikgKiAxODAgLyBNYXRoLlBJIC0gOTAgKyAobXVsdGlsaW5lID8gYW5nbGVBbGlnbiA6IDApLFxuXHRcdFx0XHRcdFx0XHRcdFx0cm90YXRlID0gYW5nbGUgKyAobXVsdGlsaW5lID8gLS41IDogMCksXG5cdFx0XHRcdFx0XHRcdFx0XHR0cmFuc2wgPSAoeShkLnkpICsgY2lyY1BhZGRpbmcpICsgMzUsXG5cdFx0XHRcdFx0XHRcdFx0XHRzZWNBbmdsZSA9IChhbmdsZSA+IDkwID8gLTE4MCA6IDApO1xuXHRcdFx0XHRcdFx0XHRcdGlmIChkLm5hbWUgPT0gc3BlY2lhbDMgfHwgZC5uYW1lID09IHNwZWNpYWw0KSByb3RhdGUgKz0gMTtcblx0XHRcdFx0XHRcdFx0XHRpZiAoZC5kZXB0aCA9PSAwKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHR0cmFuc2wgPSAtMi41MDtcblx0XHRcdFx0XHRcdFx0XHRcdHJvdGF0ZSA9IDA7XG5cdFx0XHRcdFx0XHRcdFx0XHRzZWNBbmdsZSA9IDA7XG5cdFx0XHRcdFx0XHRcdFx0fSBlbHNlIGlmIChkLmRlcHRoID09IDEpIHRyYW5zbCArPSAtOTtcblx0XHRcdFx0XHRcdFx0XHRlbHNlIGlmIChkLmRlcHRoID09IDIpIHRyYW5zbCArPSAtNTtcblx0XHRcdFx0XHRcdFx0XHRlbHNlIGlmIChkLmRlcHRoID09IDMpIHRyYW5zbCArPSA0O1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBcInJvdGF0ZShcIiArIHJvdGF0ZSArIFwiKXRyYW5zbGF0ZShcIiArIHRyYW5zbCArIFwiKXJvdGF0ZShcIiArIHNlY0FuZ2xlICsgXCIpXCI7XG5cdFx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0LnN0eWxlKFwiZmlsbC1vcGFjaXR5XCIsIGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBpc1BhcmVudE9mKGQsIGUpID8gMSA6IDFlLTY7XG5cdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0LmVhY2goXCJlbmRcIiwgZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0XHRcdFx0ZDMuc2VsZWN0KHRoaXMpLnN0eWxlKFwidmlzaWJpbGl0eVwiLCBpc1BhcmVudE9mKGQsIGUpID8gbnVsbCA6IFwiaGlkZGVuXCIpO1xuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblxuXG5cdFx0XHRcdGZ1bmN0aW9uIGlzUGFyZW50T2YocCwgYykge1xuXHRcdFx0XHRcdGlmIChwID09PSBjKSByZXR1cm4gdHJ1ZTtcblx0XHRcdFx0XHRpZiAocC5jaGlsZHJlbikge1xuXHRcdFx0XHRcdFx0cmV0dXJuIHAuY2hpbGRyZW4uc29tZShmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gaXNQYXJlbnRPZihkLCBjKTtcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRmdW5jdGlvbiBzZXRDb2xvcihkKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGQuY29sb3I7XG5cdFx0XHRcdFx0aWYgKGQuY29sb3IpXG5cdFx0XHRcdFx0XHRyZXR1cm4gZC5jb2xvcjtcblx0XHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRcdHZhciB0aW50RGVjYXkgPSAwLjIwO1xuXHRcdFx0XHRcdFx0Ly8gRmluZCBjaGlsZCBudW1iZXJcblx0XHRcdFx0XHRcdHZhciB4ID0gMDtcblx0XHRcdFx0XHRcdHdoaWxlIChkLnBhcmVudC5jaGlsZHJlblt4XSAhPSBkKVxuXHRcdFx0XHRcdFx0XHR4Kys7XG5cdFx0XHRcdFx0XHR2YXIgdGludENoYW5nZSA9ICh0aW50RGVjYXkgKiAoeCArIDEpKS50b1N0cmluZygpO1xuXHRcdFx0XHRcdFx0cmV0dXJuIHB1c2hlci5jb2xvcihkLnBhcmVudC5jb2xvcikudGludCh0aW50Q2hhbmdlKS5odG1sKCdoZXg2Jyk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gSW50ZXJwb2xhdGUgdGhlIHNjYWxlcyFcblx0XHRcdFx0ZnVuY3Rpb24gYXJjVHdlZW4oZCkge1xuXHRcdFx0XHRcdHZhciBteSA9IG1heFkoZCksXG5cdFx0XHRcdFx0XHR4ZCA9IGQzLmludGVycG9sYXRlKHguZG9tYWluKCksIFtkLngsIGQueCArIGQuZHggLSAwLjAwMDldKSxcblx0XHRcdFx0XHRcdHlkID0gZDMuaW50ZXJwb2xhdGUoeS5kb21haW4oKSwgW2QueSwgbXldKSxcblx0XHRcdFx0XHRcdHlyID0gZDMuaW50ZXJwb2xhdGUoeS5yYW5nZSgpLCBbZC55ID8gMjAgOiAwLCByYWRpdXNdKTtcblxuXHRcdFx0XHRcdHJldHVybiBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGZ1bmN0aW9uICh0KSB7XG5cdFx0XHRcdFx0XHRcdHguZG9tYWluKHhkKHQpKTtcblx0XHRcdFx0XHRcdFx0eS5kb21haW4oeWQodCkpLnJhbmdlKHlyKHQpKTtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGFyYyhkKTtcblx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGZ1bmN0aW9uIG1heFkoZCkge1xuXHRcdFx0XHRcdHJldHVybiBkLmNoaWxkcmVuID8gTWF0aC5tYXguYXBwbHkoTWF0aCwgZC5jaGlsZHJlbi5tYXAobWF4WSkpIDogZC55ICsgZC5keTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fSk7XG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ1N1bmJ1cnN0Q3RybCcsIGZ1bmN0aW9uICgkc2NvcGUpIHtcblxuXHRcdCRzY29wZS5zZXRDaGFydCA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdCRzY29wZS5jaGFydCA9IHtcblx0XHRcdFx0b3B0aW9uczoge1xuXHRcdFx0XHRcdGNoYXJ0OiB7XG5cdFx0XHRcdFx0XHR0eXBlOiAnc3VuYnVyc3QnLFxuXHRcdFx0XHRcdFx0aGVpZ2h0OiA3MDAsXG5cdFx0XHRcdFx0XHRcInN1bmJ1cnN0XCI6IHtcblx0XHRcdFx0XHRcdFx0XCJkaXNwYXRjaFwiOiB7fSxcblx0XHRcdFx0XHRcdFx0XCJ3aWR0aFwiOiBudWxsLFxuXHRcdFx0XHRcdFx0XHRcImhlaWdodFwiOiBudWxsLFxuXHRcdFx0XHRcdFx0XHRcIm1vZGVcIjogXCJzaXplXCIsXG5cdFx0XHRcdFx0XHRcdFwiaWRcIjogMjA4OCxcblx0XHRcdFx0XHRcdFx0XCJkdXJhdGlvblwiOiA1MDAsXG5cdFx0XHRcdFx0XHRcdFwibWFyZ2luXCI6IHtcblx0XHRcdFx0XHRcdFx0XHRcInRvcFwiOiAwLFxuXHRcdFx0XHRcdFx0XHRcdFwicmlnaHRcIjogMCxcblx0XHRcdFx0XHRcdFx0XHRcImJvdHRvbVwiOiAwLFxuXHRcdFx0XHRcdFx0XHRcdFwibGVmdFwiOiAwXG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRcInRvb2x0aXBcIjoge1xuXHRcdFx0XHRcdFx0XHRcImR1cmF0aW9uXCI6IDAsXG5cdFx0XHRcdFx0XHRcdFwiZ3Jhdml0eVwiOiBcIndcIixcblx0XHRcdFx0XHRcdFx0XCJkaXN0YW5jZVwiOiAyNSxcblx0XHRcdFx0XHRcdFx0XCJzbmFwRGlzdGFuY2VcIjogMCxcblx0XHRcdFx0XHRcdFx0XCJjbGFzc2VzXCI6IG51bGwsXG5cdFx0XHRcdFx0XHRcdFwiY2hhcnRDb250YWluZXJcIjogbnVsbCxcblx0XHRcdFx0XHRcdFx0XCJmaXhlZFRvcFwiOiBudWxsLFxuXHRcdFx0XHRcdFx0XHRcImVuYWJsZWRcIjogdHJ1ZSxcblx0XHRcdFx0XHRcdFx0XCJoaWRlRGVsYXlcIjogNDAwLFxuXHRcdFx0XHRcdFx0XHRcImhlYWRlckVuYWJsZWRcIjogZmFsc2UsXG5cblx0XHRcdFx0XHRcdFx0XCJvZmZzZXRcIjoge1xuXHRcdFx0XHRcdFx0XHRcdFwibGVmdFwiOiAwLFxuXHRcdFx0XHRcdFx0XHRcdFwidG9wXCI6IDBcblx0XHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdFx0XCJoaWRkZW5cIjogdHJ1ZSxcblx0XHRcdFx0XHRcdFx0XCJkYXRhXCI6IG51bGwsXG5cdFx0XHRcdFx0XHRcdFwidG9vbHRpcEVsZW1cIjogbnVsbCxcblx0XHRcdFx0XHRcdFx0XCJpZFwiOiBcIm52dG9vbHRpcC05OTM0N1wiXG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSxcblx0XHRcdFx0ZGF0YTogW11cblx0XHRcdH07XG5cdFx0XHRyZXR1cm4gJHNjb3BlLmNoYXJ0O1xuXHRcdH1cblx0XHR2YXIgYnVpbGRUcmVlID0gZnVuY3Rpb24gKGRhdGEpIHtcblx0XHRcdHZhciBjaGlsZHJlbiA9IFtdO1xuXHRcdFx0YW5ndWxhci5mb3JFYWNoKGRhdGEsIGZ1bmN0aW9uIChpdGVtKSB7XG5cdFx0XHRcdHZhciBjaGlsZCA9IHtcblx0XHRcdFx0XHQnbmFtZSc6IGl0ZW0udGl0bGUsXG5cdFx0XHRcdFx0J3NpemUnOiBpdGVtLnNpemUsXG5cdFx0XHRcdFx0J2NvbG9yJzogaXRlbS5jb2xvcixcblx0XHRcdFx0XHQnY2hpbGRyZW4nOiBidWlsZFRyZWUoaXRlbS5jaGlsZHJlbilcblx0XHRcdFx0fTtcblx0XHRcdFx0aWYoaXRlbS5jb2xvcil7XG5cdFx0XHRcdFx0Y2hpbGQuY29sb3IgPSBpdGVtLmNvbG9yXG5cdFx0XHRcdH1cblx0XHRcdFx0aWYoaXRlbS5zaXplKXtcblx0XHRcdFx0XHRjaGlsZC5zaXplID0gaXRlbS5zaXplXG5cdFx0XHRcdH1cblx0XHRcdFx0Y2hpbGRyZW4ucHVzaChjaGlsZCk7XG5cdFx0XHR9KTtcblx0XHRcdHJldHVybiBjaGlsZHJlbjtcblx0XHR9O1xuXHRcdCRzY29wZS5jYWxjdWxhdGVHcmFwaCA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdHZhciBjaGFydERhdGEgPSB7XG5cdFx0XHRcdFwibmFtZVwiOiAkc2NvcGUuZGF0YS50aXRsZSxcblx0XHRcdFx0XCJjb2xvclwiOiAkc2NvcGUuZGF0YS5jb2xvcixcblx0XHRcdFx0XCJjaGlsZHJlblwiOiBidWlsZFRyZWUoJHNjb3BlLmRhdGEuY2hpbGRyZW4pLFxuXHRcdFx0XHRcInNpemVcIjogMVxuXHRcdFx0fTtcblx0XHRcdCRzY29wZS5jaGFydC5kYXRhID0gY2hhcnREYXRhO1xuXHRcdFx0cmV0dXJuIGNoYXJ0RGF0YTtcblx0XHR9O1xuXHRcdCRzY29wZS4kd2F0Y2goJ2RhdGEnLCBmdW5jdGlvbiAobiwgbykge1xuXHRcdFx0aWYgKCFuKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHRcdCRzY29wZS5jYWxjdWxhdGVHcmFwaCgpO1xuXHRcdH0pXG5cdH0pO1xuXG59KSgpO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
