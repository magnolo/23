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
		angular.module('app.controllers', ['mdColorPicker','ngAnimate','ui.tree','toastr','ui.router', 'md.data.table', 'ngMaterial', 'ngStorage', 'restangular', 'ngMdIcons', 'angular-loading-bar', 'ngMessages', 'ngSanitize', "leaflet-directive",'nvd3']);
		angular.module('app.filters', []);
		angular.module('app.services', ['ui.router', 'ngStorage', 'restangular', 'toastr']);
		angular.module('app.directives', ['ngMaterial','ngPapaParse']);
		angular.module('app.config', []);

})();

(function () {
	"use strict";

	angular.module('app.routes').config(["$stateProvider", "$urlRouterProvider", function ($stateProvider, $urlRouterProvider) {

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
					'main@':{
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
				url: '/index',
				views: {
					'main@': {
						templateUrl: getView('index'),
						controller: 'IndexbaseCtrl',
						controllerAs: 'vm'
					}
				}
			})
			.state('app.index.editor',{
				url: '/editor',
				views:{
					'info':{

					},
					'menu':{
						templateUrl:getView('indexeditor'),
						controller: 'IndexeditorCtrl',
						controllerAs: 'vm'
					}
				}
			})
			.state('app.index.create', {
				url: '/create',
				views: {
					'info': {

					},
					'menu': {
						templateUrl: getView('indexcreator'),
						controller: 'IndexcreatorCtrl',
						controllerAs: 'vm'
					}
				}
			})
			.state('app.index.create.basic', {
				url: '/basic'
			})
			.state('app.index.create.check', {
				url: '/checking'
			})
			.state('app.index.create.meta', {
				url: '/adding-meta-data'
			})
			.state('app.index.create.final', {
				url: '/adding-meta-data'
			})
			.state('app.index.show', {
				url: '/:index',
				views: {
					'info': {
						templateUrl: '/views/app/index/info.html',
						controller: 'IndexCtrl',
						controllerAs: 'vm',
						resolve: {
							initialData: ["DataService", "$stateParams", function (DataService, $stateParams) {
								var d = DataService.getAll('index/' + $stateParams.index + '/year/2014');
								var i = DataService.getOne('index/' + $stateParams.index + '/structure');
								var countries = DataService.getAll('countries');
								return {
									dataObject: d.$object,
									indexerObject: i.$object,
									data: d,
									indexer: i,
									countries: countries.$object
								}
							}]
						}
					},
					'selected': {
						templateUrl: '/views/app/index/selected.html',
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
		$rootScope.$on("$stateChangeStart", function(event, toState){

			if (toState.data && toState.data.pageName){
				$rootScope.current_page = toState.data.pageName;
			}
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
	var neonTealMap = $mdThemingProvider.extendPalette('teal', {
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
		.primaryPalette('neonTeal')
		.accentPalette('bluer');
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
          data:{
            layer: '',
          },
          setLayer: function(l){
            return this.data.layer = l;
          },
          getLayer: function(){
            return this.data.layer;
          }
        }
    });

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

	angular.module('app.controllers').controller('IndexCtrl', ["$scope", "$window", "$rootScope", "$filter", "$state", "$timeout", "ToastService", "VectorlayerService", "initialData", "leafletData", "DataService", function ($scope, $window, $rootScope,$filter, $state, $timeout, ToastService, VectorlayerService, initialData, leafletData, DataService) {
		// Variable definitions
		var vm = this;
		vm.map = null;

		vm.dataServer = initialData.data;
		vm.data = initialData.dataObject;
		vm.countryList = initialData.countries;
		vm.structureServer = initialData.indexer;
		vm.structure = "";
		vm.mvtScource = VectorlayerService.getLayer();
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

					console.log(vm.data);
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
					vm.mvtSource.layers.countries_big_geom.features[vm.current.iso].selected = true;
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
				item['score'] = parseFloat(item['score']);
			})
			vm.data = $filter('orderBy')(vm.data, [vm.structure.name, "score"], true);
			rank = vm.data.indexOf(vm.current) + 1;
			vm.current[vm.structure.name+'_rank'] = rank;
			vm.circleOptions = {
					color:vm.structure.color,
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
				angular.forEach(vm.mvtSource.layers.countries_big_geom.features, function (feature) {
					feature.selected = false;
				});
				vm.mvtSource.layers.countries_big_geom.features[vm.current.iso].selected = true;
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
				isos.push(item[vm.structure.iso]);
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
			return (vm.getRank(vm.current) - 2) * 16;
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

		function createCanvas(colors) {

			vm.canvas = document.createElement('canvas');
			vm.canvas.width = 280;
			vm.canvas.height = 10;
			vm.ctx = vm.canvas.getContext('2d');
			var gradient = vm.ctx.createLinearGradient(0, 0, 280, 10);
			gradient.addColorStop(1, 'rgba(255,255,255,0)');
			gradient.addColorStop(0.53, 'rgba(128, 243, 198,1)');
			gradient.addColorStop(0, 'rgba(102,102,102,1)');
			vm.ctx.fillStyle = gradient;
			vm.ctx.fillRect(0, 0, 280, 10);
			vm.palette = vm.ctx.getImageData(0, 0, 257, 1).data;
			//document.getElementsByTagName('body')[0].appendChild(vm.canvas);
		}

		function updateCanvas(color) {
			var gradient = vm.ctx.createLinearGradient(0, 0, 280, 10);
			gradient.addColorStop(1, 'rgba(255,255,255,0)');
			gradient.addColorStop(0.53, color);
			gradient.addColorStop(0, 'rgba(102,102,102,1)');
			vm.ctx.fillStyle = gradient;
			vm.ctx.fillRect(0, 0, 280, 10);
			vm.palette = vm.ctx.getImageData(0, 0, 257, 1).data;
			//document.getElementsByTagName('body')[0].appendChild(vm.canvas);
		};

		function invertedStyle(feature) {
			var style = {};
			var iso = feature.properties.adm0_a3;
			var nation = getNationByIso(iso);
			var field = vm.structure.name || 'score';

			console.log(vm.structure.name);
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
			var iso = feature.properties.adm0_a3;
			var nation = getNationByIso(iso);
			var field = vm.structure.column_name || 'score';
			var type = feature.type;
			if(iso != vm.current.iso){
					feature.selected = false;
			}

			switch (type) {
			case 3: //'Polygon'
				if (typeof nation[field] != "undefined") {

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
			if (feature.layer.name === 'countries_big_geom_label') {
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
			console.log(n);
			if(n.iso) {
				if(o.iso){
					vm.mvtSource.layers.countries_big_geom.features[o.iso].selected = false;
				}
				calcRank();
				fetchNationData(n.iso);
				vm.mvtSource.layers.countries_big_geom.features[n.iso].selected = true;
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
			if (n)
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
			console.log(n);
			var lat = [n.coordinates[0][0][1],
					[n.coordinates[0][0][0]]
				],
				lng = [n.coordinates[0][2][1],
					[n.coordinates[0][2][0]]
				]
			var southWest = L.latLng(n.coordinates[0][0][1], n.coordinates[0][0][0]),
				northEast = L.latLng(n.coordinates[0][2][1], n.coordinates[0][2][0]),
				bounds = L.latLngBounds(southWest, northEast);

			var pad = [
				[350, 200],
				[0, 200]
			];
			if (vm.compare.active) {
				pad = [
					[350, 0],
					[0, 0]
				];
			}
			vm.map.fitBounds(bounds, {
				paddingTopLeft: pad[0],
				paddingBottomRight: pad[1],
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
						vm.mvtSource.layers.countries_big_geom.features[vm.current.iso].selected = true;
						var countries = $state.params.countries.split('-vs-');
						angular.forEach(countries, function(iso){
							vm.mvtSource.layers.countries_big_geom.features[iso].selected = true;
						});

					}
					else{
						vm.mvtSource.setStyle(countriesStyle);
						if($state.params.item){
								vm.mvtSource.layers.countries_big_geom.features[$state.params.item].selected = true;
						}
					}
					//vm.mvtSource.redraw();
				});
				vm.mvtSource.options.onClick = function (evt, t) {
					if (!vm.compare.active) {
						var c = getNationByIso(evt.feature.properties.adm0_a3);
						console.log(evt.feature.properties.adm0_a3, c, vm.current);
						if (typeof c[vm.structure.name] != "undefined") {
							vm.current = getNationByIso(evt.feature.properties.adm0_a3);
						} else {
							ToastService.error('No info about this location!');
						}
					} else {
						var c = getNationByIso(evt.feature.properties.adm0_a3);
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
		$scope.$watch(function(){
			return $rootScope.current_page;
		}, function(newPage){
			$scope.current_page = newPage || 'Page Name';
		});

	}]);

})();

(function () {
	"use strict";

	angular.module('app.controllers').controller('IndexeditorCtrl', ["$filter", "DataService", function ($filter,DataService) {
		//
		var vm = this;

		vm.dataproviders = [];
		vm.selectedItem = null;
		vm.searchText = null;
		vm.querySearch = querySearch;

    activate();

    function activate(){
      loadAll();
    }
		function querySearch(query) {
      console.log($filter('findbyname')(vm.dataproviders, query, 'title'));
			var results = query ? $filter('findbyname')(vm.dataproviders, query, 'title') : [];
      console.log(results);
			return results;
		}
		function loadAll() {
      DataService.getAll('dataproviders').then(function(data){
        vm.dataproviders = data;
      });
		}
	}]);

})();

(function(){
    "use strict";

    angular.module('app.controllers').controller('LoginCtrl', ["$state", "$auth", "toastr", function($state, $auth, toastr){
        var vm = this;
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
            $state.go('app.index.show',{index:'epi'})
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
		var apiKey = 'pk.eyJ1IjoibWFnbm9sbyIsImEiOiJuSFdUYkg4In0.5HOykKk0pNP1N3isfPQGTQ';
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
				}
			}
		}
		leafletData.getMap('map').then(function(map) {
			var url = 'http://v22015052835825358.yourvserver.net:3001/services/postgis/countries_big/geom/vector-tiles/{z}/{x}/{y}.pbf?fields=id,admin,adm0_a3,wb_a3,su_a3,iso_a3,name,name_long'; //
			var layer = new L.TileLayer.MVTSource({
				url: url,
				debug: false,
				clickableLayers: ['countries_big_geom'],
				mutexToggle: true,
				getIDForLayerFeature: function(feature) {
					return feature.properties.adm0_a3;
				},
				filter: function(feature, context) {
					return true;
				}
			});
			 map.addLayer(VectorlayerService.setLayer(layer));
			 var labelsLayer = L.tileLayer('https://{s}.tiles.mapbox.com/v4/magnolo.06029a9c/{z}/{x}/{y}.png?access_token=' + apiKey);
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

    angular.module('app.controllers').controller('IndexcreatorCtrl', ["$scope", "$rootScope", "DialogService", "DataService", "$timeout", "$state", "$filter", "leafletData", "toastr", "IconsService", "VectorlayerService", function($scope,$rootScope,DialogService,DataService, $timeout,$state, $filter, leafletData, toastr, IconsService, VectorlayerService){
        //
        var vm = this;
        vm.map = null;
        vm.data = [];
        vm.toSelect = [];
        vm.selected = [];
        vm.selectedRows = [];
        vm.selectedResources =[];
        vm.sortedResources = [];
        vm.indicators = [];
        vm.groups = [];
        vm.myData = [];
        vm.addDataTo = {};
        vm.selectedForGroup = [];
        vm.iso_errors = 0;
        vm.iso_checked = false;
        vm.saveDisabled = false;
        vm.selectedIndex = 0;
        vm.step = 0;
        vm.search = search;
        vm.deleteData = deleteData;
        vm.deleteSelected = deleteSelected;
        vm.onOrderChange = onOrderChange;
        vm.onPaginationChange = onPaginationChange;
        vm.checkForErrors = checkForErrors;
        vm.clearErrors = clearErrors;
        vm.showUploadContainer = false;
        vm.openClose = openClose;
        vm.checkColumnData = checkColumnData;
        vm.editColumnData = editColumnData;
        vm.fetchIso = fetchIso;
        vm.editRow = editRow;
        vm.saveData = saveData;
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
        vm.selectForEditing = selectForEditing;
        vm.checkFields = checkFields;
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

        vm.treeOptions = {
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
        };

        //Run Startup-Funcitons
        activate();

        function activate(){
          clearMap();
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
                if(item.toString().toUpperCase() == "NA" || item < 0 || item.toString().toUpperCase().indexOf('N/A') > -1){
                  vm.data[key].data[0][k] = '';
                  vm.errors --;
                  row.errors.splice(0,1);
                }
              }
              switch (item) {
                case 'Cabo Verde':
                      vm.data[key].data[0][k]   = 'Cape Verde';
                  break;
                case "Democratic Peoples Republic of Korea":
                        vm.data[key].data[0][k]   = "Democratic People's Republic of Korea";
                    break;
                case "Cote d'Ivoire":
                        vm.data[key].data[0][k]   = "Ivory Coast";
                    break;
                case "Lao Peoples Democratic Republic":
                        vm.data[key].data[0][k]   = "Lao People's Democratic Republic";
                    break;
                default:
                  break;
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
        function checkColumnData(key){
          if(typeof vm.meta.table[key] != "undefined"){
            if(vm.meta.table[key].title){
              return true;
            }
          }
          return false;
        }
        function editColumnData(e, key){
          vm.toEdit = key;
          DialogService.fromTemplate('editcolumn', $scope);
        }
        function selectForEditing(key){
          if(typeof vm.indicators[key] == "undefined"){
            vm.indicators[key] = {
              column_name:key,
              title:key
            };
          }
          vm.editingItem = key;
          vm.indicator = vm.indicators[key];
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
          angular.forEach(vm.data, function(item, key){
              entries.push({
                iso: item.data[0][vm.meta.iso_field],
                name: item.data[0][vm.meta.country_field]
              });
          });
          DataService.post('countries/byIsoNames', {data:entries}).then(function(response){
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
                          console.log(country);
                        }
                      }
                    }
                });
              });
              if(vm.toSelect.length){
                DialogService.fromTemplate('selectisofetchers', $scope);
              }
              vm.iso_checked = true;
          }, function(response){
          //  console.log(response);
            toastr.error('Please check your field selections', response.data.message);
          })
        }
        function saveData(){
        //  console.log(vm.meta.table);
          //console.log(vm.meta.table, vm.data[0].data[0].length);
          //console.log(vm.indicators);
          //return false;

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
          angular.forEach(vm.data[0].data[0], function(item, key){
            if(vm.indicators[key]){
              var field = {
                'column': key,
                'title':vm.indicators[key].title,
                'description':vm.indicators[key].description,
                'measure_type_id':vm.indicators[key].measure_type_id || 0,
                'type': vm.indicators[key].type,
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
          console.log(vm.meta);
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

        function checkFields(data){
          console.log(vm.data);
          angular.forEach(vm.data[0].meta.fields, function(field){

          })
          console.log(data);
        }
        $scope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {

          switch (toState.name) {
            case 'app.index.create.basic':
              if(!vm.myData.length){
                vm.myData = DataService.getAll('me/data').$object;
              }
              break;
            case 'app.index.create.check':
              break;
            case 'app.index.create.meta':
                if(!vm.meta.iso_field){
                  toastr.error('No field for ISO Code selected!', 'Error');
                  event.preventDefault();
                   $rootScope.stateIsLoading = false;
                }

                break;
            case 'app.index.create.final':
              break;
            default:
                if(vm.data.length){
                  $scope.toState = toState;
                  DialogService.fromTemplate('loosedata', $scope, vm.deleteData);
                  event.preventDefault();
                  $rootScope.stateIsLoading = false;
                }
              break;
          }
        });

        $scope.$on("$stateChangeSuccess", function (event, toState, toParams, fromState, fromParams) {
          if(!vm.data.length){
            $state.go('app.index.create');
          }
          else{
            switch (toState.name) {
              case 'app.index.create':
                  vm.step = 0;
                break;
              case 'app.index.create.basic':
                    vm.step = 1;
                    vm.showUploadContainer = false;
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
        });
    }]);

})();

(function(){
    "use strict";

    angular.module('app.controllers').controller('UserCtrl', function(){
        //
    });

})();

(function(){
    "use strict";

    angular.module('app.controllers').controller('UnsupportedBrowserCtrl', function(){
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
            console.log($scope.data);
        };

        $scope.hide = function(){
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
								type: group.score_field_name,
								name: group.title,
								group: group.score_field_name,
								color: group.color,
								icon: group.icon,
								unicode: IconsService.getUnicode(group.icon),
								data: group,
								children:group.children
							};
							labels.push(d);
							angular.forEach(group.children, function (item) {
								if (scope.chartdata[item.score_field_name]) {
									var node = {
										type: item.score_field_name,
										radius: scope.chartdata[item.score_field_name] / scope.sizefactor,
										value: scope.chartdata[item.score_field_name],
										name: item.title,
										group: group.score_field_name,
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
							type: scope.indexer.score_field_name,
							name: scope.indexer.title,
							group: scope.indexer.score_field_name,
							color: scope.indexer.color,
							icon: scope.indexer.icon,
							unicode: scope.indexer.unicode,
							data: scope.indexer.data,
							children: scope.indexer.children
						};
						labels.push(d);
						angular.forEach(scope.indexer.children, function (item) {
							if (scope.chartdata[item.score_field_name]) {
								var node = {
									type: item.score_field_name,
									radius: scope.chartdata[item.score_field_name] / scope.sizefactor,
									value: scope.chartdata[item.score_field_name] / scope.sizefactor,
									name: item.title,
									group: scope.indexer.score_field_name,
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
						return "bubble_" + d.id;
					});
					options.icons = options.containers.append("text")
						.attr('font-family', 'EPI')
						.attr('font-size', function (d) {

						})
						.attr("text-anchor", "middle")
						.attr('fill', function(d){
							return d.unicode ? '#fff' : d.color;
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

	angular.module('app.directives').directive( 'indicator', function() {

		return {
			restrict: 'EA',
			templateUrl: 'views/directives/indicator/indicator.html',
			controller: 'IndicatorCtrl',
			controllerAs: 'vm',
			scope:{
				item: '='
			},
			bindToController: true,
			replace:true,
			require: 'item',
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

(function(){
	"use strict";

	angular.module( 'app.controllers' ).controller( 'IndicatorCtrl', ["$scope", "DataService", "$filter", function($scope, DataService, $filter){
		//
			var vm = this;

			vm.categories = [];
			vm.dataproviders = [];
			vm.selectedItem = null;
			vm.searchText = null;
			vm.querySearch = querySearch;
			vm.querySearchCategory = querySearchCategory;

	    activate();

	    function activate(){
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

			$scope.$watchCollection('vm.item', function(n, o){
					if(n === o){
						return;
					}
					console.log(n);
					if(n.title && n.measure_type_id && n.type && n.dataprovider){
						n.base = true;
					}
					else{
						n.base = false;
					};
			});
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
				options = angular.extend(options, $scope.options);
				options.unique = new Date().getTime();
				if(options.color){
					options.colors[1].color = options.color;
				}
				element.css('height', options.height + 'px').css('border-radius', options.height / 2 + 'px');
				var x = d3.scale.linear()
					.domain([0, 100])
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
						.text(100)
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

					if (d3.event.sourceEvent) { // not a programmatic event
						value = x.invert(d3.mouse(this)[0]);
						brush.extent([value, value]);
					}
					handleLabel.text(parseInt(value));
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
					} while (!found && count < 100);
					console.log(final);
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

	angular.module('app.directives').directive( 'parsecsv', ["$state", "$timeout", "toastr", function($state, $timeout, toastr) {

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
								Papa.parse(input[0].files[0],{
									skipEmptyLines: true,
									header:true,
									dynamicTyping: true,
									step:function(row){
										angular.forEach(row.data[0], function(item, key){
											if(isNaN(item) || item < 0 ){
												if(item.toString().toUpperCase() == "NA" || item < 0 || item.toString().toUpperCase().indexOf('N/A') > -1){
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
											$scope.vm.data.push(row);
										}

									},
									beforeFirstChunk: function(chunk)
									{
										//Check if there are points in the headers
										var index = chunk.match( /\r\n|\r|\n/ ).index;
								    var headings = chunk.substr(0, index).split( ',' );
										var isIso = [];
										for(var i = 0; i <= headings.length; i++){
											if(headings[i]){
												headings[i] = headings[i].replace(/[^a-z0-9]/gi,'_').toLowerCase();
												if(headings[i].indexOf('.') > -1){
													headings[i] = headings[i].substr(0, headings[i].indexOf('.'));
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
								    return headings.join() + chunk.substr(index);
									},
									error: function(err, file)
									{
										ToastService.error(err);
									},
									complete: function(results)
									{
										$scope.vm.errors = errors;

										//See if there is an field name "iso" in the headings;
										if(!isVertical){
											angular.forEach($scope.vm.data[0].data[0], function(item, key){
												if(key.toLowerCase().indexOf('iso') != -1 || key.toLowerCase().indexOf('code') != -1){
													$scope.vm.meta.iso_field = key;
												}
													if(key.toLowerCase().indexOf('country') != -1){
														$scope.vm.meta.country_field = key;
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
													$scope.vm.data.push({data:[r], errors:item.errors});
												}
											});
											$scope.vm.meta.iso_field = 'iso';
										}

										$state.go('app.index.create.basic');
										toastr.info($scope.vm.data.length+' lines importet!', 'Information')
									}
								})
							})

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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiLCJyb3V0ZXMuanMiLCJyb3V0ZXMucnVuLmpzIiwiY29uZmlnL2F1dGguanMiLCJjb25maWcvbG9hZGluZ19iYXIuanMiLCJjb25maWcvcmVzdGFuZ3VsYXIuanMiLCJjb25maWcvdGhlbWUuanMiLCJjb25maWcvdG9hc3RyLmpzIiwiZmlsdGVycy9hbHBoYW51bS5qcyIsImZpbHRlcnMvY2FwaXRhbGl6ZS5qcyIsImZpbHRlcnMvZmluZGJ5bmFtZS5qcyIsImZpbHRlcnMvaHVtYW5fcmVhZGFibGUuanMiLCJmaWx0ZXJzL3RydW5jYXRlX2NoYXJhY3RlcnMuanMiLCJmaWx0ZXJzL3RydW5jYXRlX3dvcmRzLmpzIiwiZmlsdGVycy90cnVzdF9odG1sLmpzIiwiZmlsdGVycy91Y2ZpcnN0LmpzIiwic2VydmljZXMvVmVjdG9ybGF5ZXIuanMiLCJzZXJ2aWNlcy9kYXRhLmpzIiwic2VydmljZXMvZGlhbG9nLmpzIiwic2VydmljZXMvaWNvbnMuanMiLCJzZXJ2aWNlcy90b2FzdC5qcyIsImFwcC9ob21lL2hvbWUuanMiLCJhcHAvaW1wb3J0Y3N2L2ltcG9ydGNzdi5qcyIsImFwcC9pbmRleC9pbmRleC5qcyIsImFwcC9pbmRleC9pbmRleGJhc2UuanMiLCJhcHAvaGVhZGVyL2hlYWRlci5qcyIsImFwcC9pbmRleGVkaXRvci9pbmRleGVkaXRvci5qcyIsImFwcC9sb2dpbi9sb2dpbi5qcyIsImFwcC9tYXAvbWFwLmpzIiwiYXBwL3NlbGVjdGVkL3NlbGVjdGVkLmpzIiwiYXBwL3NpZGViYXIvc2lkZWJhci5qcyIsImFwcC9zaWdudXAvc2lnbnVwLmpzIiwiYXBwL3RvYXN0cy90b2FzdHMuanMiLCJhcHAvaW5kZXhjcmVhdG9yL2luZGV4Y3JlYXRvci5qcyIsImFwcC91c2VyL3VzZXIuanMiLCJhcHAvdW5zdXBwb3J0ZWRfYnJvd3Nlci91bnN1cHBvcnRlZF9icm93c2VyLmpzIiwiZGlhbG9ncy9hZGRfdXNlcnMvYWRkX3VzZXJzLmpzIiwiZGlhbG9ncy9lZGl0Y29sdW1uL2VkaXRjb2x1bW4uanMiLCJkaWFsb2dzL2VkaXRyb3cvZWRpdHJvdy5qcyIsImRpYWxvZ3MvbG9vc2VkYXRhL2xvb3NlZGF0YS5qcyIsImRpYWxvZ3Mvc2VsZWN0aXNvZmV0Y2hlcnMvc2VsZWN0aXNvZmV0Y2hlcnMuanMiLCJkaXJlY3RpdmVzL2J1YmJsZXMvYnViYmxlcy5qcyIsImRpcmVjdGl2ZXMvYnViYmxlcy9kZWZpbml0aW9uLmpzIiwiZGlyZWN0aXZlcy9jaXJjbGVncmFwaC9jaXJjbGVncmFwaC5qcyIsImRpcmVjdGl2ZXMvY2lyY2xlZ3JhcGgvZGVmaW5pdGlvbi5qcyIsImRpcmVjdGl2ZXMvaGlzdG9yeS9kZWZpbml0aW9uLmpzIiwiZGlyZWN0aXZlcy9oaXN0b3J5L2hpc3RvcnkuanMiLCJkaXJlY3RpdmVzL2luZGljYXRvci9kZWZpbml0aW9uLmpzIiwiZGlyZWN0aXZlcy9pbmRpY2F0b3IvaW5kaWNhdG9yLmpzIiwiZGlyZWN0aXZlcy9tZWRpYW4vZGVmaW5pdGlvbi5qcyIsImRpcmVjdGl2ZXMvbWVkaWFuL21lZGlhbi5qcyIsImRpcmVjdGl2ZXMvcGFyc2Vjc3YvZGVmaW5pdGlvbi5qcyIsImRpcmVjdGl2ZXMvcGFyc2Vjc3YvcGFyc2Vjc3YuanMiLCJkaXJlY3RpdmVzL3NpbXBsZWxpbmVjaGFydC9kZWZpbml0aW9uLmpzIiwiZGlyZWN0aXZlcy9zaW1wbGVsaW5lY2hhcnQvc2ltcGxlbGluZWNoYXJ0LmpzIiwiZGlyZWN0aXZlcy9zbGlkZVRvZ2dsZS9kZWZpbml0aW9uLmpzIiwiZGlyZWN0aXZlcy9zbGlkZVRvZ2dsZS9zbGlkZVRvZ2dsZS5qcyIsImRpcmVjdGl2ZXMvc3ViaW5kZXgvZGVmaW5pdGlvbi5qcyIsImRpcmVjdGl2ZXMvc3ViaW5kZXgvc3ViaW5kZXguanMiLCJkaXJlY3RpdmVzL3N1bmJ1cnN0L2RlZmluaXRpb24uanMiLCJkaXJlY3RpdmVzL3N1bmJ1cnN0L3N1bmJ1cnN0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLENBQUEsVUFBQTtDQUNBOztDQUVBLElBQUEsTUFBQSxRQUFBLE9BQUE7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7OztFQUlBLFFBQUEsT0FBQSxjQUFBLENBQUEsYUFBQSxhQUFBO0VBQ0EsUUFBQSxPQUFBLG1CQUFBLENBQUEsZ0JBQUEsWUFBQSxVQUFBLFNBQUEsYUFBQSxpQkFBQSxjQUFBLGFBQUEsZUFBQSxhQUFBLHVCQUFBLGNBQUEsY0FBQSxvQkFBQTtFQUNBLFFBQUEsT0FBQSxlQUFBO0VBQ0EsUUFBQSxPQUFBLGdCQUFBLENBQUEsYUFBQSxhQUFBLGVBQUE7RUFDQSxRQUFBLE9BQUEsa0JBQUEsQ0FBQSxhQUFBO0VBQ0EsUUFBQSxPQUFBLGNBQUE7Ozs7QUNuQkEsQ0FBQSxZQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGNBQUEsZ0RBQUEsVUFBQSxnQkFBQSxvQkFBQTs7RUFFQSxJQUFBLFVBQUEsVUFBQSxVQUFBO0dBQ0EsT0FBQSxnQkFBQSxXQUFBLE1BQUEsV0FBQTs7O0VBR0EsbUJBQUEsVUFBQTs7RUFFQTtJQUNBLE1BQUEsT0FBQTtJQUNBLFVBQUE7SUFDQSxPQUFBO0tBQ0EsUUFBQTtNQUNBLGFBQUEsUUFBQTtNQUNBLFlBQUE7TUFDQSxjQUFBOztLQUVBLE1BQUE7S0FDQSxRQUFBO01BQ0EsYUFBQSxRQUFBO01BQ0EsWUFBQTtNQUNBLGNBQUE7Ozs7SUFJQSxNQUFBLFdBQUE7SUFDQSxJQUFBO0lBQ0EsTUFBQTtLQUNBLFFBQUE7TUFDQSxhQUFBLFFBQUE7TUFDQSxZQUFBO01BQ0EsY0FBQTs7OztJQUlBLE1BQUEsWUFBQTtJQUNBLEtBQUE7SUFDQSxVQUFBOzs7SUFHQSxNQUFBLGtCQUFBO0lBQ0EsS0FBQTtJQUNBLE9BQUE7S0FDQSxTQUFBO01BQ0EsYUFBQSxRQUFBO01BQ0EsWUFBQTtNQUNBLGNBQUE7Ozs7OztJQU1BLE1BQUEsb0JBQUE7SUFDQSxLQUFBO0lBQ0EsT0FBQTtLQUNBLFNBQUE7TUFDQSxhQUFBLFFBQUE7TUFDQSxZQUFBO01BQ0EsY0FBQTtNQUNBLFNBQUE7T0FDQSxrQ0FBQSxVQUFBLGFBQUEsT0FBQTtRQUNBLE9BQUEsWUFBQSxPQUFBLE1BQUE7Ozs7Ozs7SUFPQSxNQUFBLGFBQUE7SUFDQSxVQUFBO0lBQ0EsS0FBQTtJQUNBLE9BQUE7S0FDQSxTQUFBO01BQ0EsYUFBQSxRQUFBO01BQ0EsWUFBQTtNQUNBLGNBQUE7Ozs7SUFJQSxNQUFBLG1CQUFBO0lBQ0EsS0FBQTtJQUNBLE1BQUE7S0FDQSxPQUFBOzs7S0FHQSxPQUFBO01BQ0EsWUFBQSxRQUFBO01BQ0EsWUFBQTtNQUNBLGNBQUE7Ozs7SUFJQSxNQUFBLG9CQUFBO0lBQ0EsS0FBQTtJQUNBLE9BQUE7S0FDQSxRQUFBOzs7S0FHQSxRQUFBO01BQ0EsYUFBQSxRQUFBO01BQ0EsWUFBQTtNQUNBLGNBQUE7Ozs7SUFJQSxNQUFBLDBCQUFBO0lBQ0EsS0FBQTs7SUFFQSxNQUFBLDBCQUFBO0lBQ0EsS0FBQTs7SUFFQSxNQUFBLHlCQUFBO0lBQ0EsS0FBQTs7SUFFQSxNQUFBLDBCQUFBO0lBQ0EsS0FBQTs7SUFFQSxNQUFBLGtCQUFBO0lBQ0EsS0FBQTtJQUNBLE9BQUE7S0FDQSxRQUFBO01BQ0EsYUFBQTtNQUNBLFlBQUE7TUFDQSxjQUFBO01BQ0EsU0FBQTtPQUNBLDZDQUFBLFVBQUEsYUFBQSxjQUFBO1FBQ0EsSUFBQSxJQUFBLFlBQUEsT0FBQSxXQUFBLGFBQUEsUUFBQTtRQUNBLElBQUEsSUFBQSxZQUFBLE9BQUEsV0FBQSxhQUFBLFFBQUE7UUFDQSxJQUFBLFlBQUEsWUFBQSxPQUFBO1FBQ0EsT0FBQTtTQUNBLFlBQUEsRUFBQTtTQUNBLGVBQUEsRUFBQTtTQUNBLE1BQUE7U0FDQSxTQUFBO1NBQ0EsV0FBQSxVQUFBOzs7OztLQUtBLFlBQUE7TUFDQSxhQUFBOzs7O0lBSUEsTUFBQSwyQkFBQTtJQUNBLEtBQUE7Ozs7Ozs7Ozs7Ozs7O0lBY0EsTUFBQSxtQ0FBQTtJQUNBLEtBQUE7O0lBRUEsTUFBQSxpQkFBQTtJQUNBLEtBQUE7SUFDQSxNQUFBO0tBQ0EsVUFBQTs7SUFFQSxPQUFBO0tBQ0EsU0FBQTtNQUNBLGFBQUEsUUFBQTs7S0FFQSxPQUFBOzs7Ozs7Ozs7QUM5S0EsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGNBQUEsaUNBQUEsU0FBQSxZQUFBLFdBQUE7RUFDQSxXQUFBLElBQUEscUJBQUEsU0FBQSxPQUFBLFFBQUE7O0dBRUEsSUFBQSxRQUFBLFFBQUEsUUFBQSxLQUFBLFNBQUE7SUFDQSxXQUFBLGVBQUEsUUFBQSxLQUFBOztJQUVBLFdBQUEsaUJBQUE7O0VBRUEsV0FBQSxJQUFBLHNCQUFBLFNBQUEsT0FBQSxRQUFBOzs7O0VBSUEsV0FBQSxJQUFBLHVCQUFBLFNBQUEsT0FBQSxRQUFBO0dBQ0EsV0FBQSxpQkFBQTs7Ozs7O0FDaEJBLENBQUEsV0FBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxjQUFBLHlCQUFBLFVBQUEsY0FBQTs7O1FBR0EsY0FBQSxXQUFBOzs7OztBQ05BLENBQUEsV0FBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxjQUFBLGlDQUFBLFVBQUEsc0JBQUE7RUFDQSxzQkFBQSxpQkFBQTs7Ozs7QUNKQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsY0FBQSxnQ0FBQSxTQUFBLHFCQUFBO0VBQ0E7R0FDQSxXQUFBO0dBQ0Esa0JBQUEsRUFBQSxRQUFBO0dBQ0EsdUJBQUEsU0FBQSxLQUFBLFVBQUEsS0FBQSxJQUFBLFNBQUEsVUFBQTtRQUNBLElBQUE7UUFDQSxnQkFBQSxLQUFBO1FBQ0EsSUFBQSxLQUFBLE1BQUE7WUFDQSxjQUFBLFFBQUEsS0FBQTs7UUFFQSxJQUFBLEtBQUEsVUFBQTtZQUNBLGNBQUEsWUFBQSxLQUFBOztRQUVBLE9BQUE7Ozs7OztBQ2hCQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsY0FBQSw4QkFBQSxTQUFBLG9CQUFBOztDQUVBLElBQUEsY0FBQSxtQkFBQSxjQUFBLFFBQUE7SUFDQSxPQUFBO0VBQ0EsUUFBQTs7Q0FFQSxJQUFBLFdBQUEsbUJBQUEsY0FBQSxRQUFBO0lBQ0EsT0FBQTtFQUNBLFFBQUE7O0NBRUEsSUFBQSxVQUFBLG1CQUFBLGNBQUEsUUFBQTtJQUNBLE9BQUE7RUFDQSxRQUFBOztDQUVBLG1CQUFBLGNBQUEsWUFBQTtDQUNBLG1CQUFBLGNBQUEsYUFBQTtDQUNBLG1CQUFBLGNBQUEsU0FBQTtFQUNBLG1CQUFBLE1BQUE7R0FDQSxlQUFBO0dBQ0EsY0FBQTs7Ozs7QUN0QkEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLGNBQUEsd0JBQUEsU0FBQSxhQUFBOztRQUVBLFFBQUEsT0FBQSxjQUFBO1VBQ0EsYUFBQTtVQUNBLGFBQUE7VUFDQSxXQUFBO1VBQ0EsYUFBQTtVQUNBLGVBQUE7VUFDQSxtQkFBQTtVQUNBLHVCQUFBO1VBQ0EsUUFBQTtVQUNBLGFBQUE7Ozs7OztBQ2RBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxlQUFBLFFBQUEsWUFBQSxVQUFBO1FBQ0EsT0FBQSxVQUFBLE9BQUE7O1lBRUEsS0FBQSxDQUFBLE9BQUE7Y0FDQSxPQUFBOztZQUVBLE9BQUEsTUFBQSxRQUFBLGVBQUE7Ozs7Ozs7QUNUQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsZUFBQSxRQUFBLGNBQUEsVUFBQTtFQUNBLE9BQUEsU0FBQSxPQUFBLEtBQUE7R0FDQSxPQUFBLENBQUEsQ0FBQSxDQUFBLFNBQUEsTUFBQSxRQUFBLHNCQUFBLFNBQUEsSUFBQTtJQUNBLE9BQUEsSUFBQSxPQUFBLEdBQUEsZ0JBQUEsSUFBQSxPQUFBLEdBQUE7UUFDQTs7Ozs7QUNQQSxDQUFBLFlBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsZUFBQSxPQUFBLGNBQUEsWUFBQTtFQUNBLE9BQUEsVUFBQSxPQUFBLE1BQUEsT0FBQTs7TUFFQSxJQUFBLFNBQUE7R0FDQSxJQUFBLElBQUE7SUFDQSxNQUFBLE1BQUE7O0dBRUEsT0FBQSxJQUFBLEtBQUEsS0FBQTtJQUNBLElBQUEsTUFBQSxHQUFBLE9BQUEsY0FBQSxRQUFBLEtBQUEsaUJBQUEsQ0FBQSxHQUFBO01BQ0EsT0FBQSxLQUFBLE1BQUE7OztHQUdBLE9BQUE7Ozs7OztBQ2ZBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxlQUFBLFFBQUEsaUJBQUEsVUFBQTtFQUNBLE9BQUEsU0FBQSxTQUFBLEtBQUE7R0FDQSxLQUFBLENBQUEsS0FBQTtJQUNBLE9BQUE7O0dBRUEsSUFBQSxRQUFBLElBQUEsTUFBQTtHQUNBLEtBQUEsSUFBQSxFQUFBLEdBQUEsRUFBQSxNQUFBLFFBQUEsS0FBQTtJQUNBLE1BQUEsS0FBQSxNQUFBLEdBQUEsT0FBQSxHQUFBLGdCQUFBLE1BQUEsR0FBQSxNQUFBOztHQUVBLE9BQUEsTUFBQSxLQUFBOzs7O0FDWkEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLGVBQUEsT0FBQSxzQkFBQSxZQUFBO1FBQ0EsT0FBQSxVQUFBLE9BQUEsT0FBQSxhQUFBO1lBQ0EsSUFBQSxNQUFBLFFBQUE7Z0JBQ0EsT0FBQTs7WUFFQSxJQUFBLFNBQUEsR0FBQTtnQkFDQSxPQUFBOztZQUVBLElBQUEsU0FBQSxNQUFBLFNBQUEsT0FBQTtnQkFDQSxRQUFBLE1BQUEsVUFBQSxHQUFBOztnQkFFQSxJQUFBLENBQUEsYUFBQTtvQkFDQSxJQUFBLFlBQUEsTUFBQSxZQUFBOztvQkFFQSxJQUFBLGNBQUEsQ0FBQSxHQUFBO3dCQUNBLFFBQUEsTUFBQSxPQUFBLEdBQUE7O3VCQUVBO29CQUNBLE9BQUEsTUFBQSxPQUFBLE1BQUEsT0FBQSxPQUFBLEtBQUE7d0JBQ0EsUUFBQSxNQUFBLE9BQUEsR0FBQSxNQUFBLFNBQUE7OztnQkFHQSxPQUFBLFFBQUE7O1lBRUEsT0FBQTs7OztBQzNCQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsZUFBQSxPQUFBLGlCQUFBLFlBQUE7UUFDQSxPQUFBLFVBQUEsT0FBQSxPQUFBO1lBQ0EsSUFBQSxNQUFBLFFBQUE7Z0JBQ0EsT0FBQTs7WUFFQSxJQUFBLFNBQUEsR0FBQTtnQkFDQSxPQUFBOztZQUVBLElBQUEsT0FBQTtnQkFDQSxJQUFBLGFBQUEsTUFBQSxNQUFBO2dCQUNBLElBQUEsV0FBQSxTQUFBLE9BQUE7b0JBQ0EsUUFBQSxXQUFBLE1BQUEsR0FBQSxPQUFBLEtBQUEsT0FBQTs7O1lBR0EsT0FBQTs7OztBQ2pCQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsZUFBQSxRQUFBLHNCQUFBLFVBQUEsTUFBQTtFQUNBLE9BQUEsVUFBQSxNQUFBO0dBQ0EsT0FBQSxLQUFBLFlBQUE7Ozs7QUNMQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsZUFBQSxPQUFBLFdBQUEsV0FBQTtFQUNBLE9BQUEsVUFBQSxRQUFBO0dBQ0EsS0FBQSxDQUFBLE9BQUE7SUFDQSxPQUFBOztHQUVBLE9BQUEsTUFBQSxVQUFBLEdBQUEsR0FBQSxnQkFBQSxNQUFBLFVBQUE7Ozs7OztBQ1JBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxnQkFBQSxRQUFBLHNCQUFBLFVBQUE7O1FBRUEsTUFBQTtVQUNBLEtBQUE7WUFDQSxPQUFBOztVQUVBLFVBQUEsU0FBQSxFQUFBO1lBQ0EsT0FBQSxLQUFBLEtBQUEsUUFBQTs7VUFFQSxVQUFBLFVBQUE7WUFDQSxPQUFBLEtBQUEsS0FBQTs7Ozs7OztBQ2JBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxnQkFBQSxRQUFBLGVBQUE7SUFDQSxZQUFBLFVBQUEsQ0FBQSxjQUFBOztJQUVBLFNBQUEsWUFBQSxhQUFBLE9BQUE7UUFDQSxPQUFBO1VBQ0EsUUFBQTtVQUNBLFFBQUE7VUFDQSxNQUFBOzs7UUFHQSxTQUFBLE9BQUEsTUFBQTtVQUNBLElBQUEsT0FBQSxZQUFBLElBQUEsT0FBQTtZQUNBLEtBQUEsS0FBQSxVQUFBLElBQUEsU0FBQSxLQUFBO2NBQ0EsT0FBQSxNQUFBLEtBQUEsWUFBQTtjQUNBLFFBQUEsSUFBQTs7WUFFQSxPQUFBOztRQUVBLFNBQUEsT0FBQSxPQUFBLEdBQUE7VUFDQSxPQUFBLFlBQUEsSUFBQSxPQUFBLElBQUE7O1FBRUEsU0FBQSxLQUFBLE9BQUEsS0FBQTtVQUNBLE9BQUEsWUFBQSxJQUFBLE9BQUEsS0FBQTs7Ozs7O0FDekJBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxnQkFBQSxRQUFBLCtCQUFBLFNBQUEsVUFBQTs7RUFFQSxPQUFBO0dBQ0EsY0FBQSxTQUFBLFVBQUEsT0FBQTs7SUFFQSxJQUFBLFVBQUE7S0FDQSxhQUFBLHFCQUFBLFdBQUEsTUFBQSxXQUFBOzs7SUFHQSxJQUFBLE9BQUE7S0FDQSxRQUFBLFFBQUEsT0FBQTs7O0lBR0EsT0FBQSxVQUFBLEtBQUE7OztHQUdBLE1BQUEsVUFBQTtJQUNBLE9BQUEsVUFBQTs7O0dBR0EsT0FBQSxTQUFBLE9BQUEsUUFBQTtJQUNBLFVBQUE7S0FDQSxVQUFBO09BQ0EsTUFBQTtPQUNBLFFBQUE7T0FDQSxHQUFBOzs7O0dBSUEsU0FBQSxTQUFBLE9BQUEsU0FBQTtJQUNBLE9BQUEsVUFBQTtLQUNBLFVBQUE7T0FDQSxNQUFBO09BQ0EsUUFBQTtPQUNBLEdBQUE7T0FDQSxPQUFBOzs7Ozs7QUN0Q0EsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLGdCQUFBLFFBQUEsZ0JBQUEsVUFBQTtRQUNBLElBQUEsV0FBQTtVQUNBLFNBQUE7VUFDQSxTQUFBO1VBQ0EsVUFBQTtVQUNBLGFBQUE7VUFDQSxTQUFBO1VBQ0EsUUFBQTtVQUNBLE9BQUE7VUFDQSxVQUFBO1VBQ0EsT0FBQTtVQUNBLFFBQUE7OztRQUdBLE9BQUE7VUFDQSxZQUFBLFNBQUEsS0FBQTtZQUNBLE9BQUEsU0FBQTs7VUFFQSxRQUFBLFVBQUE7WUFDQSxPQUFBOzs7Ozs7O0FDdEJBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxnQkFBQSxRQUFBLDZCQUFBLFNBQUEsU0FBQTs7RUFFQSxJQUFBLFFBQUE7R0FDQSxXQUFBO0dBQ0EsU0FBQTs7RUFFQSxPQUFBO0dBQ0EsTUFBQSxTQUFBLFFBQUE7SUFDQSxJQUFBLENBQUEsUUFBQTtLQUNBLE9BQUE7OztJQUdBLE9BQUEsU0FBQTtLQUNBLFNBQUE7T0FDQSxRQUFBO09BQ0EsU0FBQTtPQUNBLE9BQUE7T0FDQSxVQUFBOzs7R0FHQSxPQUFBLFNBQUEsUUFBQTtJQUNBLElBQUEsQ0FBQSxRQUFBO0tBQ0EsT0FBQTs7O0lBR0EsT0FBQSxTQUFBO0tBQ0EsU0FBQTtPQUNBLFFBQUE7T0FDQSxTQUFBO09BQ0EsTUFBQTtPQUNBLE9BQUE7T0FDQSxVQUFBOzs7Ozs7QUNsQ0EsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsNEJBQUEsU0FBQSxZQUFBO1FBQ0EsSUFBQSxLQUFBO1FBQ0EsWUFBQSxPQUFBLFNBQUEsS0FBQSxTQUFBLFNBQUE7VUFDQSxHQUFBLFVBQUE7Ozs7Ozs7QUNOQSxDQUFBLFlBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSwrQkFBQSxVQUFBLFdBQUE7RUFDQSxLQUFBLFdBQUE7R0FDQSxhQUFBO0dBQ0EsV0FBQTtHQUNBLHlCQUFBO0dBQ0Esa0JBQUE7OztFQUdBLEtBQUEsZUFBQSxVQUFBLE1BQUEsSUFBQTtHQUNBLFVBQUEsS0FBQSxVQUFBO0tBQ0EsTUFBQTtLQUNBLFFBQUEsd0JBQUEsT0FBQTtLQUNBLEdBQUE7S0FDQSxZQUFBOzs7O0lBSUEsS0FBQSxnQkFBQSxXQUFBO0dBQ0EsVUFBQSxLQUFBOztLQUVBLGFBQUE7U0FDQSxrQkFBQTs7S0FFQSxLQUFBLFVBQUEsUUFBQTs7T0FFQSxZQUFBOzs7Ozs7Ozs7QUM1QkEsQ0FBQSxZQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEscUtBQUEsVUFBQSxRQUFBLFNBQUEsV0FBQSxTQUFBLFFBQUEsVUFBQSxjQUFBLG9CQUFBLGFBQUEsYUFBQSxhQUFBOztFQUVBLElBQUEsS0FBQTtFQUNBLEdBQUEsTUFBQTs7RUFFQSxHQUFBLGFBQUEsWUFBQTtFQUNBLEdBQUEsT0FBQSxZQUFBO0VBQ0EsR0FBQSxjQUFBLFlBQUE7RUFDQSxHQUFBLGtCQUFBLFlBQUE7RUFDQSxHQUFBLFlBQUE7RUFDQSxHQUFBLGFBQUEsbUJBQUE7RUFDQSxHQUFBLGFBQUE7RUFDQSxHQUFBLGNBQUE7RUFDQSxHQUFBLFVBQUE7RUFDQSxHQUFBLGFBQUE7RUFDQSxHQUFBLGVBQUE7RUFDQSxHQUFBLFlBQUE7RUFDQSxHQUFBLE9BQUE7RUFDQSxHQUFBLFlBQUE7RUFDQSxHQUFBLFVBQUE7R0FDQSxRQUFBO0dBQ0EsV0FBQTs7RUFFQSxHQUFBLFVBQUE7R0FDQSxhQUFBOzs7O0VBSUEsR0FBQSxpQkFBQTtFQUNBLEdBQUEsU0FBQTtFQUNBLEdBQUEsV0FBQTtFQUNBLEdBQUEsYUFBQTtFQUNBLEdBQUEscUJBQUE7RUFDQSxHQUFBLFVBQUE7RUFDQSxHQUFBLFlBQUE7RUFDQSxHQUFBLGNBQUE7O0VBRUEsR0FBQSxrQkFBQTtFQUNBLEdBQUEsYUFBQTtFQUNBLEdBQUEsYUFBQTtFQUNBLEdBQUEsZ0JBQUE7RUFDQSxHQUFBLG1CQUFBO0VBQ0EsR0FBQSxxQkFBQTtFQUNBLEdBQUEsaUJBQUE7RUFDQSxHQUFBLFNBQUE7O0VBRUEsR0FBQSxXQUFBOztFQUVBOztFQUVBLFNBQUEsV0FBQTs7R0FFQSxHQUFBLGdCQUFBLEtBQUEsU0FBQSxVQUFBO0lBQ0EsR0FBQSxXQUFBLEtBQUEsU0FBQSxLQUFBOztLQUVBLFFBQUEsSUFBQSxHQUFBO0tBQ0EsR0FBQSxZQUFBO0tBQ0E7S0FDQTtLQUNBLEdBQUEsT0FBQSxPQUFBLEtBQUE7TUFDQSxHQUFBLFNBQUEsT0FBQSxPQUFBO01BQ0E7O0tBRUEsR0FBQSxPQUFBLE9BQUEsVUFBQTtNQUNBLEdBQUEsT0FBQTtNQUNBLEdBQUEsUUFBQSxVQUFBLEtBQUEsR0FBQTtNQUNBLEdBQUEsUUFBQSxTQUFBO01BQ0EsV0FBQSxTQUFBO01BQ0EsSUFBQSxZQUFBLE9BQUEsT0FBQSxVQUFBLE1BQUE7TUFDQSxRQUFBLFFBQUEsV0FBQSxTQUFBLElBQUE7T0FDQSxHQUFBLFFBQUEsVUFBQSxLQUFBLGVBQUE7OztNQUdBLFVBQUEsS0FBQSxHQUFBLFFBQUE7TUFDQSxZQUFBLE9BQUEsa0JBQUEsV0FBQSxLQUFBLFVBQUEsTUFBQTtPQUNBLEdBQUEsT0FBQTs7Ozs7Ozs7RUFRQSxTQUFBLFFBQUE7R0FDQSxRQUFBLFFBQUE7O0VBRUEsU0FBQSxlQUFBLFNBQUE7R0FDQSxJQUFBLFdBQUEsTUFBQSxHQUFBLGNBQUEsSUFBQTtJQUNBLEdBQUEsYUFBQTtVQUNBO0lBQ0EsR0FBQSxhQUFBOztHQUVBLEdBQUEsZUFBQSxHQUFBLGFBQUEsa0JBQUE7R0FDQTtFQUNBLFNBQUEsU0FBQSxNQUFBO0dBQ0EsR0FBQSxXQUFBLGVBQUE7R0FDQSxnQkFBQTtHQUNBOztFQUVBLFNBQUEsYUFBQTtHQUNBLEdBQUEsWUFBQSxDQUFBLEdBQUE7R0FDQSxHQUFBLFlBQUEsR0FBQSxhQUFBLE9BQUEsaUJBQUE7O0VBRUEsU0FBQSxXQUFBLEtBQUE7R0FDQSxHQUFBLFVBQUE7R0FDQSxHQUFBO0dBQ0E7O0VBRUEsU0FBQSxtQkFBQSxLQUFBO0dBQ0EsSUFBQSxHQUFBLFdBQUE7SUFDQSxTQUFBLFlBQUE7S0FDQSxHQUFBLFVBQUEsT0FBQSxtQkFBQSxTQUFBLEdBQUEsUUFBQSxLQUFBLFdBQUE7OztHQUdBO0VBQ0EsU0FBQSxXQUFBO0dBQ0EsR0FBQSxDQUFBLEdBQUEsUUFBQTtJQUNBOztHQUVBLElBQUEsT0FBQTtHQUNBLFFBQUEsUUFBQSxHQUFBLE1BQUEsU0FBQSxNQUFBO0lBQ0EsS0FBQSxHQUFBLFVBQUEsUUFBQSxXQUFBLEtBQUEsR0FBQSxVQUFBO0lBQ0EsS0FBQSxXQUFBLFdBQUEsS0FBQTs7R0FFQSxHQUFBLE9BQUEsUUFBQSxXQUFBLEdBQUEsTUFBQSxDQUFBLEdBQUEsVUFBQSxNQUFBLFVBQUE7R0FDQSxPQUFBLEdBQUEsS0FBQSxRQUFBLEdBQUEsV0FBQTtHQUNBLEdBQUEsUUFBQSxHQUFBLFVBQUEsS0FBQSxXQUFBO0dBQ0EsR0FBQSxnQkFBQTtLQUNBLE1BQUEsR0FBQSxVQUFBO0tBQ0EsTUFBQSxHQUFBLFVBQUEsS0FBQTs7R0FFQSxPQUFBOztFQUVBLFNBQUEsUUFBQSxRQUFBOztHQUVBLElBQUEsT0FBQSxHQUFBLEtBQUEsUUFBQSxXQUFBO0dBQ0EsT0FBQTs7RUFFQSxTQUFBLGFBQUE7R0FDQSxHQUFBLE9BQUEsQ0FBQSxHQUFBO0dBQ0E7O0VBRUEsU0FBQSxnQkFBQTtHQUNBLE9BQUEsR0FBQSxVQUFBLENBQUEsR0FBQTtHQUNBO0VBQ0EsU0FBQSxnQkFBQSxJQUFBO0dBQ0EsWUFBQSxPQUFBLFNBQUEsT0FBQSxPQUFBLE9BQUEsS0FBQSxLQUFBLFVBQUEsTUFBQTtJQUNBLEdBQUEsUUFBQSxPQUFBO0lBQ0EsZUFBQTs7O0VBR0EsU0FBQSxlQUFBLEtBQUE7R0FDQSxHQUFBLENBQUEsT0FBQSxPQUFBLFVBQUE7SUFDQSxZQUFBLE9BQUEsa0JBQUEsQ0FBQSxNQUFBLEtBQUEsVUFBQSxNQUFBO0tBQ0EsR0FBQSxPQUFBOzs7Ozs7RUFNQSxTQUFBLGdCQUFBLE1BQUE7R0FDQSxJQUFBLFFBQUEsQ0FBQSxHQUFBLFFBQUEsVUFBQSxDQUFBLFFBQUEsR0FBQSxRQUFBLFFBQUE7SUFDQSxHQUFBOzs7O0VBSUEsU0FBQSxtQkFBQTtHQUNBLEdBQUEsUUFBQSxZQUFBLENBQUEsR0FBQTtHQUNBLEdBQUEsUUFBQSxTQUFBLENBQUEsR0FBQSxRQUFBO0dBQ0EsSUFBQSxHQUFBLFFBQUEsUUFBQTtJQUNBLEdBQUEsT0FBQTtJQUNBLFdBQUEsU0FBQTtJQUNBLEdBQUEsVUFBQSxRQUFBLGNBQUE7SUFDQSxHQUFBLFVBQUEsU0FBQTs7VUFFQTtJQUNBLFdBQUEsU0FBQTtJQUNBLFFBQUEsUUFBQSxHQUFBLFVBQUEsT0FBQSxtQkFBQSxVQUFBLFVBQUEsU0FBQTtLQUNBLFFBQUEsV0FBQTs7SUFFQSxHQUFBLFVBQUEsT0FBQSxtQkFBQSxTQUFBLEdBQUEsUUFBQSxLQUFBLFdBQUE7SUFDQSxHQUFBLFVBQUEsUUFBQSxjQUFBO0lBQ0EsR0FBQSxVQUFBLFNBQUE7SUFDQSxZQUFBLE9BQUEsa0JBQUEsQ0FBQSxHQUFBLFFBQUEsTUFBQSxLQUFBLFVBQUEsTUFBQTtLQUNBLEdBQUEsT0FBQTs7SUFFQSxPQUFBLEdBQUEsMEJBQUE7S0FDQSxNQUFBLE9BQUEsT0FBQTtLQUNBLEtBQUEsT0FBQSxPQUFBOzs7O0dBSUE7O0VBRUEsU0FBQSxtQkFBQSxTQUFBO0dBQ0EsSUFBQSxRQUFBO0dBQ0EsUUFBQSxRQUFBLEdBQUEsUUFBQSxXQUFBLFVBQUEsS0FBQSxLQUFBO0lBQ0EsSUFBQSxXQUFBLE9BQUEsT0FBQSxHQUFBLFNBQUE7S0FDQSxHQUFBLFFBQUEsVUFBQSxPQUFBLEtBQUE7S0FDQSxRQUFBOzs7R0FHQSxJQUFBLENBQUEsT0FBQTtJQUNBLEdBQUEsUUFBQSxVQUFBLEtBQUE7SUFDQTtHQUNBLElBQUEsT0FBQTtHQUNBLElBQUEsVUFBQTtHQUNBLFFBQUEsUUFBQSxHQUFBLFFBQUEsV0FBQSxVQUFBLE1BQUEsS0FBQTtJQUNBLEtBQUEsS0FBQSxLQUFBLEdBQUEsVUFBQTtJQUNBLEdBQUEsS0FBQSxHQUFBLFVBQUEsUUFBQSxHQUFBLFFBQUEsSUFBQTtLQUNBLFFBQUEsS0FBQSxLQUFBOzs7R0FHQSxJQUFBLEtBQUEsU0FBQSxHQUFBO0lBQ0EsWUFBQSxPQUFBLGtCQUFBLE1BQUEsS0FBQSxVQUFBLE1BQUE7S0FDQSxHQUFBLE9BQUE7O0lBRUEsT0FBQSxHQUFBLGtDQUFBO0tBQ0EsT0FBQSxPQUFBLE9BQUE7S0FDQSxNQUFBLE9BQUEsT0FBQTtLQUNBLFVBQUEsUUFBQSxLQUFBOzs7O0dBSUEsT0FBQSxDQUFBO0dBQ0E7O0VBRUEsU0FBQSxZQUFBO0dBQ0EsSUFBQSxDQUFBLEdBQUEsU0FBQTtJQUNBLE9BQUE7OztHQUdBLE9BQUEsQ0FBQSxHQUFBLFFBQUEsR0FBQSxXQUFBLEtBQUE7R0FDQTs7RUFFQSxTQUFBLGNBQUE7R0FDQSxJQUFBLENBQUEsR0FBQSxTQUFBO0lBQ0EsT0FBQTs7R0FFQSxPQUFBLEdBQUEsUUFBQSxpQkFBQSxJQUFBLGtCQUFBO0dBQ0E7O0VBRUEsU0FBQSxPQUFBLEdBQUE7R0FDQSxHQUFBLFlBQUE7OztFQUdBLFNBQUEsVUFBQSxNQUFBO0dBQ0EsSUFBQSxRQUFBO0dBQ0EsUUFBQSxRQUFBLEtBQUEsVUFBQSxVQUFBLE1BQUE7SUFDQSxJQUFBLEtBQUEsZUFBQSxHQUFBLFFBQUEsWUFBQSxNQUFBO0tBQ0EsR0FBQSxhQUFBOztJQUVBLFVBQUE7O0dBRUEsT0FBQTs7O0VBR0EsU0FBQSxXQUFBO0dBQ0EsVUFBQSxHQUFBO0dBQ0E7O0VBRUEsU0FBQSxnQkFBQSxNQUFBO0dBQ0EsSUFBQSxTQUFBO0dBQ0EsUUFBQSxRQUFBLEdBQUEsTUFBQSxVQUFBLEtBQUE7SUFDQSxJQUFBLElBQUEsV0FBQSxNQUFBO0tBQ0EsU0FBQTs7O0dBR0EsT0FBQTtHQUNBOztFQUVBLFNBQUEsZUFBQSxLQUFBO0dBQ0EsSUFBQSxTQUFBO0dBQ0EsUUFBQSxRQUFBLEdBQUEsTUFBQSxVQUFBLEtBQUE7SUFDQSxJQUFBLElBQUEsT0FBQSxLQUFBO0tBQ0EsU0FBQTs7OztHQUlBLE9BQUE7R0FDQTs7RUFFQSxTQUFBLGFBQUEsUUFBQTs7R0FFQSxHQUFBLFNBQUEsU0FBQSxjQUFBO0dBQ0EsR0FBQSxPQUFBLFFBQUE7R0FDQSxHQUFBLE9BQUEsU0FBQTtHQUNBLEdBQUEsTUFBQSxHQUFBLE9BQUEsV0FBQTtHQUNBLElBQUEsV0FBQSxHQUFBLElBQUEscUJBQUEsR0FBQSxHQUFBLEtBQUE7R0FDQSxTQUFBLGFBQUEsR0FBQTtHQUNBLFNBQUEsYUFBQSxNQUFBO0dBQ0EsU0FBQSxhQUFBLEdBQUE7R0FDQSxHQUFBLElBQUEsWUFBQTtHQUNBLEdBQUEsSUFBQSxTQUFBLEdBQUEsR0FBQSxLQUFBO0dBQ0EsR0FBQSxVQUFBLEdBQUEsSUFBQSxhQUFBLEdBQUEsR0FBQSxLQUFBLEdBQUE7Ozs7RUFJQSxTQUFBLGFBQUEsT0FBQTtHQUNBLElBQUEsV0FBQSxHQUFBLElBQUEscUJBQUEsR0FBQSxHQUFBLEtBQUE7R0FDQSxTQUFBLGFBQUEsR0FBQTtHQUNBLFNBQUEsYUFBQSxNQUFBO0dBQ0EsU0FBQSxhQUFBLEdBQUE7R0FDQSxHQUFBLElBQUEsWUFBQTtHQUNBLEdBQUEsSUFBQSxTQUFBLEdBQUEsR0FBQSxLQUFBO0dBQ0EsR0FBQSxVQUFBLEdBQUEsSUFBQSxhQUFBLEdBQUEsR0FBQSxLQUFBLEdBQUE7O0dBRUE7O0VBRUEsU0FBQSxjQUFBLFNBQUE7R0FDQSxJQUFBLFFBQUE7R0FDQSxJQUFBLE1BQUEsUUFBQSxXQUFBO0dBQ0EsSUFBQSxTQUFBLGVBQUE7R0FDQSxJQUFBLFFBQUEsR0FBQSxVQUFBLFFBQUE7O0dBRUEsUUFBQSxJQUFBLEdBQUEsVUFBQTtHQUNBLElBQUEsV0FBQSxTQUFBLE1BQUEsTUFBQSxPQUFBLFVBQUE7R0FDQSxJQUFBLFFBQUEsVUFBQSxHQUFBLFFBQUEsWUFBQSxPQUFBLEdBQUEsUUFBQSxXQUFBLEtBQUEsT0FBQSxHQUFBLFFBQUEsV0FBQSxLQUFBLE1BQUEsR0FBQSxRQUFBLFdBQUEsS0FBQTtHQUNBLE1BQUEsUUFBQTtHQUNBLE1BQUEsVUFBQTtJQUNBLE9BQUE7SUFDQSxNQUFBOztHQUVBLE1BQUEsV0FBQTtJQUNBLE9BQUE7SUFDQSxTQUFBO0tBQ0EsT0FBQTtLQUNBLE1BQUE7OztHQUdBLE9BQUE7R0FDQTs7RUFFQSxTQUFBLGVBQUEsU0FBQTs7R0FFQSxJQUFBLFFBQUE7R0FDQSxJQUFBLE1BQUEsUUFBQSxXQUFBO0dBQ0EsSUFBQSxTQUFBLGVBQUE7R0FDQSxJQUFBLFFBQUEsR0FBQSxVQUFBLGVBQUE7R0FDQSxJQUFBLE9BQUEsUUFBQTtHQUNBLEdBQUEsT0FBQSxHQUFBLFFBQUEsSUFBQTtLQUNBLFFBQUEsV0FBQTs7O0dBR0EsUUFBQTtHQUNBLEtBQUE7SUFDQSxJQUFBLE9BQUEsT0FBQSxVQUFBLGFBQUE7O0tBRUEsSUFBQSxXQUFBLFNBQUEsTUFBQSxNQUFBLFNBQUEsT0FBQSxXQUFBO0tBQ0EsSUFBQSxRQUFBLFVBQUEsR0FBQSxRQUFBLFlBQUEsT0FBQSxHQUFBLFFBQUEsV0FBQSxLQUFBLE9BQUEsR0FBQSxRQUFBLFdBQUEsS0FBQSxNQUFBLEdBQUEsUUFBQSxXQUFBLEtBQUE7S0FDQSxNQUFBLFFBQUEsVUFBQSxHQUFBLFFBQUEsWUFBQSxPQUFBLEdBQUEsUUFBQSxXQUFBLEtBQUEsT0FBQSxHQUFBLFFBQUEsV0FBQSxLQUFBO0tBQ0EsTUFBQSxVQUFBO01BQ0EsT0FBQTtNQUNBLE1BQUE7O0tBRUEsTUFBQSxXQUFBO01BQ0EsT0FBQSxVQUFBLEdBQUEsUUFBQSxZQUFBLE9BQUEsR0FBQSxRQUFBLFdBQUEsS0FBQSxPQUFBLEdBQUEsUUFBQSxXQUFBLEtBQUE7TUFDQSxTQUFBO09BQ0EsT0FBQTtPQUNBLE1BQUE7OztLQUdBO1dBQ0E7O0tBRUEsTUFBQSxRQUFBO0tBQ0EsTUFBQSxVQUFBO01BQ0EsT0FBQTtNQUNBLE1BQUE7Ozs7R0FJQSxJQUFBLFFBQUEsTUFBQSxTQUFBLDRCQUFBO0lBQ0EsTUFBQSxjQUFBLFlBQUE7S0FDQSxJQUFBLFFBQUE7TUFDQSxNQUFBLFFBQUEsV0FBQTtNQUNBLFVBQUEsQ0FBQSxLQUFBO01BQ0EsVUFBQTs7S0FFQSxPQUFBOzs7R0FHQSxPQUFBO0dBQ0E7O0VBRUEsT0FBQSxPQUFBLGNBQUEsVUFBQSxHQUFBLEdBQUE7R0FDQSxJQUFBLE1BQUEsR0FBQTtJQUNBOztHQUVBLFFBQUEsSUFBQTtHQUNBLEdBQUEsRUFBQSxLQUFBO0lBQ0EsR0FBQSxFQUFBLElBQUE7S0FDQSxHQUFBLFVBQUEsT0FBQSxtQkFBQSxTQUFBLEVBQUEsS0FBQSxXQUFBOztJQUVBO0lBQ0EsZ0JBQUEsRUFBQTtJQUNBLEdBQUEsVUFBQSxPQUFBLG1CQUFBLFNBQUEsRUFBQSxLQUFBLFdBQUE7SUFDQSxHQUFBLE9BQUEsUUFBQSxRQUFBLDZCQUFBLE9BQUEsUUFBQSxRQUFBLGlCQUFBO0tBQ0EsT0FBQSxHQUFBLDJCQUFBO01BQ0EsT0FBQSxPQUFBLE9BQUE7TUFDQSxNQUFBLEVBQUE7OztVQUdBO0lBQ0EsT0FBQSxHQUFBLGlCQUFBO0tBQ0EsT0FBQSxPQUFBLE9BQUE7Ozs7RUFJQSxPQUFBLE9BQUEsMEJBQUEsVUFBQSxHQUFBLEdBQUE7R0FDQSxJQUFBLE1BQUEsR0FBQTtJQUNBOztHQUVBLElBQUE7SUFDQSxhQUFBLEVBQUE7UUFDQTtJQUNBLGFBQUE7SUFDQTtHQUNBLEdBQUE7Ozs7Ozs7Ozs7Ozs7R0FhQSxJQUFBLEdBQUEsUUFBQSxLQUFBO0lBQ0EsR0FBQSxPQUFBLE9BQUEsVUFBQTtLQUNBLE9BQUEsR0FBQSxtQ0FBQTtNQUNBLE9BQUEsRUFBQTtNQUNBLE1BQUEsR0FBQSxRQUFBO01BQ0EsV0FBQSxPQUFBLE9BQUE7OztRQUdBO0tBQ0EsT0FBQSxHQUFBLDJCQUFBO01BQ0EsT0FBQSxFQUFBO01BQ0EsTUFBQSxHQUFBLFFBQUE7OztVQUdBO0lBQ0EsT0FBQSxHQUFBLGtCQUFBO0tBQ0EsT0FBQSxFQUFBOzs7OztFQUtBLE9BQUEsT0FBQSxXQUFBLFVBQUEsR0FBQSxHQUFBO0dBQ0EsSUFBQSxNQUFBLEdBQUE7SUFDQTs7R0FFQSxRQUFBLElBQUE7R0FDQSxJQUFBLE1BQUEsQ0FBQSxFQUFBLFlBQUEsR0FBQSxHQUFBO0tBQ0EsQ0FBQSxFQUFBLFlBQUEsR0FBQSxHQUFBOztJQUVBLE1BQUEsQ0FBQSxFQUFBLFlBQUEsR0FBQSxHQUFBO0tBQ0EsQ0FBQSxFQUFBLFlBQUEsR0FBQSxHQUFBOztHQUVBLElBQUEsWUFBQSxFQUFBLE9BQUEsRUFBQSxZQUFBLEdBQUEsR0FBQSxJQUFBLEVBQUEsWUFBQSxHQUFBLEdBQUE7SUFDQSxZQUFBLEVBQUEsT0FBQSxFQUFBLFlBQUEsR0FBQSxHQUFBLElBQUEsRUFBQSxZQUFBLEdBQUEsR0FBQTtJQUNBLFNBQUEsRUFBQSxhQUFBLFdBQUE7O0dBRUEsSUFBQSxNQUFBO0lBQ0EsQ0FBQSxLQUFBO0lBQ0EsQ0FBQSxHQUFBOztHQUVBLElBQUEsR0FBQSxRQUFBLFFBQUE7SUFDQSxNQUFBO0tBQ0EsQ0FBQSxLQUFBO0tBQ0EsQ0FBQSxHQUFBOzs7R0FHQSxHQUFBLElBQUEsVUFBQSxRQUFBO0lBQ0EsZ0JBQUEsSUFBQTtJQUNBLG9CQUFBLElBQUE7SUFDQSxTQUFBOzs7O0VBSUEsT0FBQSxJQUFBLHVCQUFBLFVBQUEsT0FBQSxTQUFBLFVBQUEsV0FBQSxZQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0VBa0NBLFNBQUEsZ0JBQUE7R0FDQSxZQUFBLE9BQUEsT0FBQSxLQUFBLFVBQUEsS0FBQTtJQUNBLEdBQUEsTUFBQTtJQUNBLEdBQUEsWUFBQSxtQkFBQTtJQUNBLFNBQUEsWUFBQTtLQUNBLEdBQUEsT0FBQSxPQUFBLFVBQUE7TUFDQSxHQUFBLFVBQUEsUUFBQSxjQUFBO01BQ0EsR0FBQSxVQUFBLFNBQUE7TUFDQSxHQUFBLFVBQUEsT0FBQSxtQkFBQSxTQUFBLEdBQUEsUUFBQSxLQUFBLFdBQUE7TUFDQSxJQUFBLFlBQUEsT0FBQSxPQUFBLFVBQUEsTUFBQTtNQUNBLFFBQUEsUUFBQSxXQUFBLFNBQUEsSUFBQTtPQUNBLEdBQUEsVUFBQSxPQUFBLG1CQUFBLFNBQUEsS0FBQSxXQUFBOzs7O1NBSUE7TUFDQSxHQUFBLFVBQUEsU0FBQTtNQUNBLEdBQUEsT0FBQSxPQUFBLEtBQUE7UUFDQSxHQUFBLFVBQUEsT0FBQSxtQkFBQSxTQUFBLE9BQUEsT0FBQSxNQUFBLFdBQUE7Ozs7O0lBS0EsR0FBQSxVQUFBLFFBQUEsVUFBQSxVQUFBLEtBQUEsR0FBQTtLQUNBLElBQUEsQ0FBQSxHQUFBLFFBQUEsUUFBQTtNQUNBLElBQUEsSUFBQSxlQUFBLElBQUEsUUFBQSxXQUFBO01BQ0EsUUFBQSxJQUFBLElBQUEsUUFBQSxXQUFBLFNBQUEsR0FBQSxHQUFBO01BQ0EsSUFBQSxPQUFBLEVBQUEsR0FBQSxVQUFBLFNBQUEsYUFBQTtPQUNBLEdBQUEsVUFBQSxlQUFBLElBQUEsUUFBQSxXQUFBO2FBQ0E7T0FDQSxhQUFBLE1BQUE7O1lBRUE7TUFDQSxJQUFBLElBQUEsZUFBQSxJQUFBLFFBQUEsV0FBQTtNQUNBLElBQUEsT0FBQSxFQUFBLEdBQUEsVUFBQSxTQUFBLGFBQUE7T0FDQSxHQUFBLG1CQUFBO2FBQ0E7T0FDQSxhQUFBLE1BQUE7Ozs7O0dBS0E7Ozs7QUNuakJBLENBQUEsWUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLHNDQUFBLFVBQUEsT0FBQSxRQUFBOztJQUVBLE9BQUEsU0FBQTs7OztBQ0xBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLDBEQUFBLFNBQUEsUUFBQSxZQUFBLE9BQUEsT0FBQTs7RUFFQSxJQUFBLEtBQUE7RUFDQSxHQUFBLGtCQUFBO0VBQ0EsR0FBQSxXQUFBO0VBQ0EsR0FBQSxXQUFBOztFQUVBLFNBQUEsaUJBQUE7SUFDQSxPQUFBLE1BQUE7O0VBRUEsU0FBQSxVQUFBO0dBQ0EsR0FBQSxNQUFBLGtCQUFBO0lBQ0EsTUFBQSxTQUFBLEtBQUEsU0FBQSxLQUFBO0tBQ0EsT0FBQSxRQUFBO09BQ0EsTUFBQSxTQUFBLFNBQUE7Ozs7O0VBS0EsSUFBQTtJQUNBLFNBQUEsU0FBQSxhQUFBLElBQUE7TUFDQSxlQUFBO01BQ0EsWUFBQTtLQUNBO0VBQ0EsT0FBQSxPQUFBLFVBQUE7R0FDQSxPQUFBLFdBQUE7S0FDQSxTQUFBLFFBQUE7R0FDQSxPQUFBLGVBQUEsV0FBQTs7Ozs7OztBQzlCQSxDQUFBLFlBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSw4Q0FBQSxVQUFBLFFBQUEsYUFBQTs7RUFFQSxJQUFBLEtBQUE7O0VBRUEsR0FBQSxnQkFBQTtFQUNBLEdBQUEsZUFBQTtFQUNBLEdBQUEsYUFBQTtFQUNBLEdBQUEsY0FBQTs7SUFFQTs7SUFFQSxTQUFBLFVBQUE7TUFDQTs7RUFFQSxTQUFBLFlBQUEsT0FBQTtNQUNBLFFBQUEsSUFBQSxRQUFBLGNBQUEsR0FBQSxlQUFBLE9BQUE7R0FDQSxJQUFBLFVBQUEsUUFBQSxRQUFBLGNBQUEsR0FBQSxlQUFBLE9BQUEsV0FBQTtNQUNBLFFBQUEsSUFBQTtHQUNBLE9BQUE7O0VBRUEsU0FBQSxVQUFBO01BQ0EsWUFBQSxPQUFBLGlCQUFBLEtBQUEsU0FBQSxLQUFBO1FBQ0EsR0FBQSxnQkFBQTs7Ozs7OztBQ3pCQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSwyQ0FBQSxTQUFBLFFBQUEsT0FBQSxPQUFBO1FBQ0EsSUFBQSxLQUFBO1FBQ0EsR0FBQSxVQUFBO1FBQ0EsR0FBQSxnQkFBQTtRQUNBLEdBQUEsT0FBQTtVQUNBLE1BQUE7VUFDQSxTQUFBOzs7UUFHQTs7UUFFQSxTQUFBLFVBQUE7VUFDQSxHQUFBOzs7UUFHQSxTQUFBLGVBQUE7O1VBRUEsR0FBQSxNQUFBLGtCQUFBOzs7O1FBSUEsU0FBQSxTQUFBO1VBQ0EsTUFBQSxNQUFBLEdBQUEsTUFBQSxLQUFBLFNBQUEsU0FBQTtZQUNBLE9BQUEsUUFBQTtZQUNBLE9BQUEsR0FBQSxpQkFBQSxDQUFBLE1BQUE7YUFDQSxNQUFBLFNBQUEsU0FBQTtZQUNBLE9BQUEsTUFBQSx3Q0FBQTs7Ozs7OztBQzdCQSxDQUFBLFlBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSxpREFBQSxVQUFBLGFBQUEsb0JBQUE7O0VBRUEsSUFBQSxLQUFBO0VBQ0EsSUFBQSxTQUFBO0VBQ0EsR0FBQSxXQUFBO0dBQ0EsaUJBQUE7O0VBRUEsR0FBQSxTQUFBO0dBQ0EsS0FBQTtHQUNBLEtBQUE7R0FDQSxNQUFBOztFQUVBLEdBQUEsU0FBQTtHQUNBLFlBQUE7SUFDQSxLQUFBO0tBQ0EsTUFBQTtLQUNBLEtBQUEsc0ZBQUE7S0FDQSxNQUFBOzs7O0VBSUEsWUFBQSxPQUFBLE9BQUEsS0FBQSxTQUFBLEtBQUE7R0FDQSxJQUFBLE1BQUE7R0FDQSxJQUFBLFFBQUEsSUFBQSxFQUFBLFVBQUEsVUFBQTtJQUNBLEtBQUE7SUFDQSxPQUFBO0lBQ0EsaUJBQUEsQ0FBQTtJQUNBLGFBQUE7SUFDQSxzQkFBQSxTQUFBLFNBQUE7S0FDQSxPQUFBLFFBQUEsV0FBQTs7SUFFQSxRQUFBLFNBQUEsU0FBQSxTQUFBO0tBQ0EsT0FBQTs7O0lBR0EsSUFBQSxTQUFBLG1CQUFBLFNBQUE7SUFDQSxJQUFBLGNBQUEsRUFBQSxVQUFBLG1GQUFBO0lBQ0EsSUFBQSxTQUFBO0lBQ0EsWUFBQTs7Ozs7QUN6Q0EsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsMEVBQUEsU0FBQSxRQUFBLFlBQUEsb0JBQUEsUUFBQTs7UUFFQSxJQUFBLEtBQUE7UUFDQSxHQUFBLFlBQUEsT0FBQSxRQUFBLEdBQUE7UUFDQSxHQUFBLFVBQUEsT0FBQSxRQUFBLEdBQUE7UUFDQSxHQUFBLE9BQUEsT0FBQSxRQUFBLEdBQUE7UUFDQSxHQUFBLFVBQUE7UUFDQSxHQUFBLFlBQUEsbUJBQUE7UUFDQSxHQUFBLFVBQUE7UUFDQSxHQUFBLFlBQUE7UUFDQSxHQUFBLGNBQUE7O1FBRUEsU0FBQSxXQUFBO1VBQ0EsSUFBQSxPQUFBO1VBQ0EsUUFBQSxRQUFBLEdBQUEsTUFBQSxTQUFBLE1BQUE7WUFDQSxLQUFBLEdBQUEsVUFBQSxvQkFBQSxXQUFBLEtBQUEsR0FBQSxVQUFBO1lBQ0EsS0FBQSxXQUFBLFNBQUEsS0FBQTs7VUFFQSxJQUFBLFNBQUEsUUFBQSxXQUFBLEdBQUEsTUFBQSxDQUFBLEdBQUEsVUFBQSxrQkFBQSxVQUFBO1VBQ0EsS0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLE9BQUEsUUFBQSxLQUFBO1lBQ0EsSUFBQSxPQUFBLEdBQUEsT0FBQSxHQUFBLFFBQUEsS0FBQTtjQUNBLE9BQUEsSUFBQTs7O1VBR0EsR0FBQSxRQUFBLEdBQUEsVUFBQSxpQkFBQSxXQUFBO1VBQ0EsR0FBQSxnQkFBQTtjQUNBLE1BQUEsR0FBQSxVQUFBO2NBQ0EsTUFBQSxHQUFBLFVBQUEsaUJBQUE7OztRQUdBLFNBQUEsUUFBQSxRQUFBO1VBQ0EsSUFBQSxTQUFBLFFBQUEsV0FBQSxHQUFBLE1BQUEsQ0FBQSxHQUFBLFVBQUEsa0JBQUEsVUFBQTtVQUNBLElBQUEsT0FBQTtVQUNBLFFBQUEsUUFBQSxRQUFBLFNBQUEsTUFBQSxJQUFBO1lBQ0EsR0FBQSxLQUFBLFdBQUEsUUFBQSxRQUFBO2NBQ0EsT0FBQTs7O1VBR0EsT0FBQSxLQUFBOztRQUVBLFNBQUEsWUFBQTtPQUNBLElBQUEsQ0FBQSxHQUFBLFNBQUE7UUFDQSxPQUFBOztPQUVBLE9BQUEsQ0FBQSxHQUFBLFFBQUEsR0FBQSxXQUFBLEtBQUE7T0FDQTs7TUFFQSxTQUFBLGNBQUE7T0FDQSxJQUFBLENBQUEsR0FBQSxTQUFBO1FBQ0EsT0FBQTs7T0FFQSxPQUFBLEdBQUEsUUFBQSxpQkFBQSxJQUFBLGtCQUFBO09BQ0E7O1FBRUEsT0FBQSxPQUFBLGNBQUEsVUFBQSxHQUFBLEdBQUE7VUFDQSxJQUFBLE1BQUEsR0FBQTtZQUNBOzs7WUFHQSxHQUFBLEVBQUEsSUFBQTtjQUNBLEdBQUEsVUFBQSxPQUFBLG1CQUFBLFNBQUEsRUFBQSxLQUFBLFdBQUE7O1lBRUE7WUFDQSxnQkFBQSxFQUFBOzs7Ozs7Ozs7QUNsRUEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsb0NBQUEsU0FBQSxRQUFBLE9BQUE7Ozs7OztBQ0hBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLGNBQUEsVUFBQTs7Ozs7O0FDSEEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEseUNBQUEsU0FBQSxRQUFBLGFBQUE7O0VBRUEsT0FBQSxlQUFBLFVBQUE7R0FDQSxhQUFBLEtBQUE7OztFQUdBLE9BQUEsYUFBQSxVQUFBO0dBQ0EsYUFBQSxNQUFBOzs7Ozs7O0FDVkEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsNktBQUEsU0FBQSxPQUFBLFdBQUEsY0FBQSxhQUFBLFNBQUEsUUFBQSxTQUFBLGFBQUEsUUFBQSxjQUFBLG1CQUFBOztRQUVBLElBQUEsS0FBQTtRQUNBLEdBQUEsTUFBQTtRQUNBLEdBQUEsT0FBQTtRQUNBLEdBQUEsV0FBQTtRQUNBLEdBQUEsV0FBQTtRQUNBLEdBQUEsZUFBQTtRQUNBLEdBQUEsbUJBQUE7UUFDQSxHQUFBLGtCQUFBO1FBQ0EsR0FBQSxhQUFBO1FBQ0EsR0FBQSxTQUFBO1FBQ0EsR0FBQSxTQUFBO1FBQ0EsR0FBQSxZQUFBO1FBQ0EsR0FBQSxtQkFBQTtRQUNBLEdBQUEsYUFBQTtRQUNBLEdBQUEsY0FBQTtRQUNBLEdBQUEsZUFBQTtRQUNBLEdBQUEsZ0JBQUE7UUFDQSxHQUFBLE9BQUE7UUFDQSxHQUFBLFNBQUE7UUFDQSxHQUFBLGFBQUE7UUFDQSxHQUFBLGlCQUFBO1FBQ0EsR0FBQSxnQkFBQTtRQUNBLEdBQUEscUJBQUE7UUFDQSxHQUFBLGlCQUFBO1FBQ0EsR0FBQSxjQUFBO1FBQ0EsR0FBQSxzQkFBQTtRQUNBLEdBQUEsWUFBQTtRQUNBLEdBQUEsa0JBQUE7UUFDQSxHQUFBLGlCQUFBO1FBQ0EsR0FBQSxXQUFBO1FBQ0EsR0FBQSxVQUFBO1FBQ0EsR0FBQSxXQUFBO1FBQ0EsR0FBQSxnQkFBQTtRQUNBLEdBQUEsc0JBQUE7UUFDQSxHQUFBLG1CQUFBO1FBQ0EsR0FBQSxpQkFBQTtRQUNBLEdBQUEscUJBQUE7UUFDQSxHQUFBLHFCQUFBO1FBQ0EsR0FBQSx1QkFBQTtRQUNBLEdBQUEseUJBQUE7UUFDQSxHQUFBLFdBQUE7UUFDQSxHQUFBLGlCQUFBO1FBQ0EsR0FBQSxZQUFBO1FBQ0EsR0FBQSxjQUFBO1FBQ0EsR0FBQSxZQUFBO1FBQ0EsR0FBQSxRQUFBLGFBQUE7UUFDQSxHQUFBLG1CQUFBO1FBQ0EsR0FBQSxjQUFBO1FBQ0EsR0FBQSxPQUFBO1VBQ0EsV0FBQTtVQUNBLGNBQUE7VUFDQSxNQUFBOztRQUVBLEdBQUEsUUFBQTtVQUNBLFFBQUE7VUFDQSxPQUFBO1VBQ0EsT0FBQTtVQUNBLE1BQUE7OztRQUdBLEdBQUEsY0FBQTtVQUNBLFdBQUEsU0FBQSxNQUFBO1lBQ0EsR0FBQSxNQUFBLEtBQUEsY0FBQSxNQUFBLE9BQUEsV0FBQTtjQUNBLElBQUEsTUFBQSxNQUFBLEtBQUEsV0FBQSxZQUFBLFFBQUEsTUFBQSxPQUFBLFVBQUE7Y0FDQSxHQUFBLE1BQUEsQ0FBQSxFQUFBO2lCQUNBLE1BQUEsT0FBQSxVQUFBLFVBQUE7aUJBQ0EsT0FBQSxNQUFBLGtEQUFBOzs7O1VBSUEsUUFBQSxTQUFBLE1BQUE7WUFDQSxlQUFBLEdBQUE7Ozs7O1FBS0E7O1FBRUEsU0FBQSxVQUFBO1VBQ0E7O1FBRUEsU0FBQSxVQUFBLE9BQUE7VUFDQSxPQUFBLFNBQUEsV0FBQTs7UUFFQSxTQUFBLGdCQUFBLFFBQUE7U0FDQSxJQUFBLFFBQUE7Y0FDQSxNQUFBO2NBQ0EsU0FBQTtVQUNBLE9BQUE7VUFDQSxNQUFBOzs7U0FHQSxPQUFBOztRQUVBLFNBQUEsVUFBQTtXQUNBLFlBQUEsT0FBQSxPQUFBLEtBQUEsVUFBQSxLQUFBO2NBQ0EsR0FBQSxZQUFBLG1CQUFBO2NBQ0EsU0FBQSxVQUFBO2dCQUNBLEdBQUEsVUFBQSxTQUFBOzs7O1FBSUEsU0FBQSxPQUFBLFdBQUE7VUFDQSxHQUFBLFNBQUE7U0FDQTtRQUNBLFNBQUEsY0FBQSxPQUFBO1VBQ0EsT0FBQSxHQUFBLE9BQUEsUUFBQSxXQUFBLEdBQUEsTUFBQSxDQUFBLFFBQUE7U0FDQTtRQUNBLFNBQUEsbUJBQUEsTUFBQSxPQUFBOzs7U0FHQTtRQUNBLFNBQUEsZUFBQSxLQUFBO1VBQ0EsT0FBQSxLQUFBLE9BQUEsU0FBQSxJQUFBLFdBQUE7O1FBRUEsU0FBQSxhQUFBO1VBQ0EsUUFBQSxRQUFBLEdBQUEsTUFBQSxTQUFBLEtBQUEsSUFBQTtZQUNBLFFBQUEsUUFBQSxJQUFBLEtBQUEsSUFBQSxTQUFBLE1BQUEsRUFBQTtjQUNBLEdBQUEsTUFBQSxTQUFBLE9BQUEsRUFBQTtnQkFDQSxHQUFBLEtBQUEsV0FBQSxpQkFBQSxRQUFBLE9BQUEsS0FBQSxLQUFBLFdBQUEsY0FBQSxRQUFBLFNBQUEsQ0FBQSxFQUFBO2tCQUNBLEdBQUEsS0FBQSxLQUFBLEtBQUEsR0FBQSxLQUFBO2tCQUNBLEdBQUE7a0JBQ0EsSUFBQSxPQUFBLE9BQUEsRUFBQTs7O2NBR0EsUUFBQTtnQkFDQSxLQUFBO3NCQUNBLEdBQUEsS0FBQSxLQUFBLEtBQUEsR0FBQSxPQUFBO2tCQUNBO2dCQUNBLEtBQUE7d0JBQ0EsR0FBQSxLQUFBLEtBQUEsS0FBQSxHQUFBLE9BQUE7b0JBQ0E7Z0JBQ0EsS0FBQTt3QkFDQSxHQUFBLEtBQUEsS0FBQSxLQUFBLEdBQUEsT0FBQTtvQkFDQTtnQkFDQSxLQUFBO3dCQUNBLEdBQUEsS0FBQSxLQUFBLEtBQUEsR0FBQSxPQUFBO29CQUNBO2dCQUNBO2tCQUNBOzs7WUFHQSxHQUFBLENBQUEsSUFBQSxLQUFBLEdBQUEsR0FBQSxLQUFBLFdBQUE7Y0FDQSxHQUFBO2NBQ0EsR0FBQTtjQUNBLElBQUEsT0FBQSxLQUFBO2dCQUNBLEtBQUE7Z0JBQ0EsUUFBQTtnQkFDQSxRQUFBLEdBQUEsS0FBQTs7Ozs7UUFLQSxTQUFBLGdCQUFBLElBQUE7VUFDQSxHQUFBLE9BQUEsR0FBQSxLQUFBLE1BQUEsUUFBQSxZQUFBO1lBQ0EsR0FBQSxHQUFBLEtBQUEsTUFBQSxLQUFBLE1BQUE7Y0FDQSxPQUFBOzs7VUFHQSxPQUFBOztRQUVBLFNBQUEsZUFBQSxHQUFBLElBQUE7VUFDQSxHQUFBLFNBQUE7VUFDQSxjQUFBLGFBQUEsY0FBQTs7UUFFQSxTQUFBLGlCQUFBLElBQUE7VUFDQSxHQUFBLE9BQUEsR0FBQSxXQUFBLFFBQUEsWUFBQTtZQUNBLEdBQUEsV0FBQSxPQUFBO2NBQ0EsWUFBQTtjQUNBLE1BQUE7OztVQUdBLEdBQUEsY0FBQTtVQUNBLEdBQUEsWUFBQSxHQUFBLFdBQUE7O1FBRUEsU0FBQSxnQkFBQTtVQUNBLFFBQUEsUUFBQSxHQUFBLFVBQUEsU0FBQSxNQUFBLElBQUE7WUFDQSxRQUFBLFFBQUEsS0FBQSxRQUFBLFNBQUEsT0FBQSxFQUFBO2NBQ0EsR0FBQSxNQUFBLFFBQUEsRUFBQTtnQkFDQSxHQUFBOztjQUVBLEdBQUE7O1lBRUEsR0FBQSxLQUFBLE9BQUEsR0FBQSxLQUFBLFFBQUEsT0FBQTtZQUNBLEdBQUEsU0FBQSxPQUFBLEtBQUE7O1VBRUEsR0FBQSxHQUFBLEtBQUEsVUFBQSxFQUFBO1lBQ0EsR0FBQTtZQUNBLE9BQUEsSUFBQTs7O1FBR0EsU0FBQSxTQUFBO1VBQ0EsR0FBQSxNQUFBLEdBQUEsU0FBQTtVQUNBLGNBQUEsYUFBQSxXQUFBOztRQUVBLFNBQUEsWUFBQTtVQUNBLEdBQUEsT0FBQTs7UUFFQSxTQUFBLFVBQUE7VUFDQSxHQUFBLENBQUEsR0FBQSxLQUFBLFVBQUE7WUFDQSxPQUFBLE1BQUEsMENBQUE7WUFDQSxPQUFBOztVQUVBLEdBQUEsQ0FBQSxHQUFBLEtBQUEsY0FBQTtZQUNBLE9BQUEsTUFBQSw4Q0FBQTtZQUNBLE9BQUE7O1VBRUEsR0FBQSxHQUFBLEtBQUEsaUJBQUEsR0FBQSxLQUFBLFVBQUE7WUFDQSxPQUFBLE1BQUEsbURBQUE7WUFDQSxPQUFBOzs7VUFHQSxHQUFBLFdBQUE7VUFDQSxHQUFBLFdBQUE7VUFDQSxJQUFBLFVBQUE7VUFDQSxRQUFBLFFBQUEsR0FBQSxNQUFBLFNBQUEsTUFBQSxJQUFBO2NBQ0EsUUFBQSxLQUFBO2dCQUNBLEtBQUEsS0FBQSxLQUFBLEdBQUEsR0FBQSxLQUFBO2dCQUNBLE1BQUEsS0FBQSxLQUFBLEdBQUEsR0FBQSxLQUFBOzs7VUFHQSxZQUFBLEtBQUEsd0JBQUEsQ0FBQSxLQUFBLFVBQUEsS0FBQSxTQUFBLFNBQUE7Y0FDQSxRQUFBLFFBQUEsVUFBQSxTQUFBLFNBQUEsSUFBQTtnQkFDQSxRQUFBLFFBQUEsR0FBQSxNQUFBLFNBQUEsTUFBQSxFQUFBO29CQUNBLEdBQUEsUUFBQSxRQUFBLEtBQUEsS0FBQSxHQUFBLEdBQUEsS0FBQSxlQUFBO3NCQUNBLEdBQUEsUUFBQSxLQUFBLFNBQUEsRUFBQTt3QkFDQSxJQUFBLFdBQUE7MEJBQ0EsT0FBQTswQkFDQSxTQUFBLFFBQUE7O3dCQUVBLEdBQUEsU0FBQSxLQUFBOzswQkFFQTt3QkFDQSxHQUFBLE9BQUEsUUFBQSxLQUFBLE1BQUEsWUFBQTswQkFDQSxHQUFBLEtBQUEsR0FBQSxLQUFBLEdBQUEsR0FBQSxLQUFBLGFBQUEsUUFBQSxLQUFBLEdBQUE7MEJBQ0EsR0FBQSxLQUFBLEdBQUEsS0FBQSxHQUFBLEdBQUEsS0FBQSxpQkFBQSxRQUFBLEtBQUEsR0FBQTswQkFDQSxHQUFBLEtBQUEsT0FBQSxPQUFBOzRCQUNBLFFBQUEsUUFBQSxLQUFBLFFBQUEsU0FBQSxPQUFBLEVBQUE7OEJBQ0EsR0FBQSxNQUFBLFFBQUEsRUFBQTtnQ0FDQSxHQUFBO2dDQUNBLEdBQUE7Z0NBQ0EsS0FBQSxPQUFBLE9BQUEsR0FBQTs7Ozs7NEJBS0E7MEJBQ0EsUUFBQSxJQUFBOzs7Ozs7Y0FNQSxHQUFBLEdBQUEsU0FBQSxPQUFBO2dCQUNBLGNBQUEsYUFBQSxxQkFBQTs7Y0FFQSxHQUFBLGNBQUE7YUFDQSxTQUFBLFNBQUE7O1lBRUEsT0FBQSxNQUFBLHNDQUFBLFNBQUEsS0FBQTs7O1FBR0EsU0FBQSxVQUFBOzs7Ozs7VUFNQSxJQUFBLGFBQUEsQ0FBQSxLQUFBO1VBQ0EsSUFBQSxPQUFBLElBQUEsU0FBQTtVQUNBLFFBQUEsUUFBQSxHQUFBLE1BQUEsU0FBQSxNQUFBLElBQUE7WUFDQSxHQUFBLEtBQUEsT0FBQSxVQUFBLEVBQUE7Y0FDQSxLQUFBLEtBQUEsR0FBQSxPQUFBLEdBQUEsS0FBQTtjQUNBLFdBQUEsS0FBQSxLQUFBLEtBQUEsS0FBQTs7Z0JBRUE7Y0FDQSxPQUFBLE1BQUEsK0JBQUE7Y0FDQTs7O1VBR0EsUUFBQSxRQUFBLEdBQUEsS0FBQSxHQUFBLEtBQUEsSUFBQSxTQUFBLE1BQUEsSUFBQTtZQUNBLEdBQUEsR0FBQSxXQUFBLEtBQUE7Y0FDQSxJQUFBLFFBQUE7Z0JBQ0EsVUFBQTtnQkFDQSxRQUFBLEdBQUEsV0FBQSxLQUFBO2dCQUNBLGNBQUEsR0FBQSxXQUFBLEtBQUE7Z0JBQ0Esa0JBQUEsR0FBQSxXQUFBLEtBQUEsbUJBQUE7Z0JBQ0EsUUFBQSxHQUFBLFdBQUEsS0FBQTtnQkFDQSxhQUFBLEdBQUEsV0FBQSxLQUFBLGFBQUE7Z0JBQ0EsbUJBQUEsR0FBQSxXQUFBLEtBQUEsYUFBQSxNQUFBOztjQUVBLElBQUEsYUFBQTtjQUNBLFFBQUEsUUFBQSxHQUFBLFdBQUEsS0FBQSxZQUFBLFNBQUEsSUFBQTtnQkFDQSxXQUFBLEtBQUEsSUFBQTs7Y0FFQSxNQUFBLGFBQUE7Y0FDQSxPQUFBLEtBQUE7OztVQUdBLFFBQUEsUUFBQSxHQUFBLEtBQUEsT0FBQSxTQUFBLE1BQUEsSUFBQTtZQUNBLEtBQUEsS0FBQTtjQUNBLE1BQUE7Y0FDQSxNQUFBOzs7VUFHQSxHQUFBLEtBQUEsU0FBQTtVQUNBLEdBQUEsS0FBQSxPQUFBO1VBQ0EsUUFBQSxJQUFBLEdBQUE7VUFDQSxZQUFBLEtBQUEsZUFBQSxHQUFBLE1BQUEsS0FBQSxTQUFBLFNBQUE7Y0FDQSxZQUFBLEtBQUEsZUFBQSxTQUFBLFdBQUEsV0FBQSxZQUFBLEtBQUEsU0FBQSxJQUFBO2dCQUNBLEdBQUEsT0FBQSxLQUFBO2tCQUNBLE9BQUEsUUFBQSxXQUFBLEtBQUEsT0FBQSxzQkFBQSxHQUFBLEtBQUEsS0FBQTtrQkFDQSxHQUFBLE9BQUE7a0JBQ0EsR0FBQSxPQUFBOzs7YUFHQSxTQUFBLFNBQUE7WUFDQSxHQUFBLFNBQUEsUUFBQTtjQUNBLE9BQUEsTUFBQSxTQUFBLFNBQUE7Ozs7UUFJQSxTQUFBLHFCQUFBO1VBQ0EsR0FBQSxnQkFBQSxDQUFBLEdBQUE7VUFDQSxHQUFBLEdBQUEsY0FBQTtZQUNBLEdBQUE7OztRQUdBLFNBQUEsZUFBQTtVQUNBLEdBQUEsQ0FBQSxHQUFBLFVBQUE7WUFDQSxZQUFBLE9BQUEsZUFBQSxLQUFBLFNBQUEsU0FBQTtjQUNBLEdBQUEsWUFBQTtjQUNBLEdBQUEsb0JBQUEsSUFBQSxHQUFBLGtCQUFBOzs7OztRQUtBLFNBQUEsaUJBQUEsU0FBQTtVQUNBLE9BQUEsR0FBQSxrQkFBQSxRQUFBLFlBQUEsQ0FBQSxJQUFBLE9BQUE7O1FBRUEsU0FBQSxnQkFBQSxVQUFBLEtBQUE7VUFDQSxRQUFBLFFBQUEsTUFBQSxTQUFBLE1BQUEsSUFBQTs7Z0JBRUEsR0FBQSxRQUFBLFNBQUE7a0JBQ0EsS0FBQSxPQUFBLEtBQUE7a0JBQ0EsR0FBQSxpQkFBQSxPQUFBLEdBQUEsaUJBQUEsUUFBQSxPQUFBO2tCQUNBLEdBQUEsa0JBQUEsT0FBQSxHQUFBLGtCQUFBLFFBQUEsTUFBQTs7O2NBR0EsZ0JBQUEsVUFBQSxLQUFBOzs7UUFHQSxTQUFBLGVBQUEsU0FBQTtVQUNBLElBQUEsTUFBQSxHQUFBLGtCQUFBLFFBQUE7VUFDQSxJQUFBLE1BQUEsQ0FBQSxFQUFBO1lBQ0EsR0FBQSxrQkFBQSxPQUFBLEtBQUE7WUFDQSxnQkFBQSxVQUFBLEdBQUE7O2NBRUE7WUFDQSxHQUFBLGtCQUFBLEtBQUE7WUFDQSxHQUFBLEdBQUEsaUJBQUEsVUFBQSxLQUFBLE9BQUEsR0FBQSxpQkFBQSxHQUFBLFdBQUEsWUFBQTtjQUNBLEdBQUEsaUJBQUEsR0FBQSxNQUFBLEtBQUE7O2dCQUVBO2dCQUNBLEdBQUEsT0FBQSxLQUFBOzs7Ozs7UUFNQSxTQUFBLGVBQUEsTUFBQTtVQUNBLFFBQUEsUUFBQSxPQUFBLFNBQUEsTUFBQSxJQUFBO1lBQ0EsTUFBQSxLQUFBLFNBQUEsU0FBQSxNQUFBLE1BQUE7WUFDQSxlQUFBLE1BQUE7OztRQUdBLFNBQUEsbUJBQUEsS0FBQTtVQUNBLFFBQUEsSUFBQTs7UUFFQSxTQUFBLG1CQUFBLEtBQUE7VUFDQSxRQUFBLElBQUE7O1FBRUEsU0FBQSxxQkFBQSxLQUFBO1VBQ0EsSUFBQSxNQUFBLEdBQUEsaUJBQUEsUUFBQTtVQUNBLElBQUEsTUFBQSxDQUFBLEVBQUE7WUFDQSxHQUFBLGlCQUFBLE9BQUEsS0FBQTs7Y0FFQTtZQUNBLEdBQUEsaUJBQUEsS0FBQTs7O1FBR0EsU0FBQSx1QkFBQSxLQUFBO1VBQ0EsT0FBQSxHQUFBLGlCQUFBLFFBQUEsUUFBQSxDQUFBOztRQUVBLFNBQUEsVUFBQTtVQUNBLElBQUEsV0FBQTtZQUNBLE1BQUE7WUFDQSxRQUFBO1lBQ0EsTUFBQTs7O1VBR0EsR0FBQSxHQUFBLGlCQUFBLFVBQUEsS0FBQSxPQUFBLEdBQUEsaUJBQUEsR0FBQSxXQUFBLFlBQUE7WUFDQSxHQUFBLGlCQUFBLEdBQUEsTUFBQSxLQUFBOztlQUVBLEdBQUEsR0FBQSxpQkFBQSxTQUFBLEdBQUE7Y0FDQSxRQUFBLFFBQUEsR0FBQSxrQkFBQSxTQUFBLE1BQUEsSUFBQTtrQkFDQSxTQUFBLE1BQUEsS0FBQTtrQkFDQSxnQkFBQSxNQUFBLEdBQUE7O2NBRUEsR0FBQSxPQUFBLEtBQUE7Y0FDQSxHQUFBLG1CQUFBOztjQUVBO1lBQ0EsR0FBQSxPQUFBLEtBQUE7OztRQUdBLFNBQUEsZ0JBQUE7VUFDQSxJQUFBLFdBQUE7WUFDQSxNQUFBO1lBQ0EsUUFBQTtZQUNBLE1BQUE7OztVQUdBLFFBQUEsUUFBQSxHQUFBLGtCQUFBLFNBQUEsTUFBQSxJQUFBO1lBQ0EsU0FBQSxNQUFBLEtBQUE7O1VBRUEsR0FBQSxPQUFBLEtBQUE7VUFDQSxHQUFBLG1CQUFBOztRQUVBLFNBQUEsVUFBQSxLQUFBO1VBQ0EsR0FBQSxXQUFBOztRQUVBLFNBQUEsWUFBQSxNQUFBLEtBQUE7WUFDQSxnQkFBQSxNQUFBOztRQUVBLFNBQUEsV0FBQTtVQUNBLEdBQUEsR0FBQSxhQUFBO1lBQ0E7O1VBRUEsR0FBQSxlQUFBO1VBQ0EsR0FBQSxPQUFBLEdBQUEsWUFBQSxZQUFBO1lBQ0EsT0FBQSxNQUFBLDZCQUFBO1lBQ0EsR0FBQSxlQUFBO1lBQ0E7O1VBRUEsR0FBQSxDQUFBLEdBQUEsU0FBQSxNQUFBO1lBQ0EsT0FBQSxNQUFBLDZCQUFBO1lBQ0EsR0FBQSxlQUFBO1lBQ0E7O1VBRUEsR0FBQSxTQUFBLE9BQUEsR0FBQTtVQUNBLFlBQUEsS0FBQSxTQUFBLEdBQUEsVUFBQSxLQUFBLFNBQUEsU0FBQTtZQUNBLEdBQUEsZUFBQTtZQUNBLE9BQUEsUUFBQSwrQkFBQTtZQUNBLE9BQUEsR0FBQSxrQkFBQSxDQUFBLE1BQUEsU0FBQTtZQUNBLFNBQUEsU0FBQTtZQUNBLEdBQUEsZUFBQTtZQUNBLE9BQUEsTUFBQSxTQUFBLFFBQUE7Ozs7UUFJQSxTQUFBLFlBQUEsS0FBQTtVQUNBLFFBQUEsSUFBQSxHQUFBO1VBQ0EsUUFBQSxRQUFBLEdBQUEsS0FBQSxHQUFBLEtBQUEsUUFBQSxTQUFBLE1BQUE7OztVQUdBLFFBQUEsSUFBQTs7UUFFQSxPQUFBLElBQUEscUJBQUEsVUFBQSxPQUFBLFNBQUEsVUFBQSxXQUFBLFlBQUE7O1VBRUEsUUFBQSxRQUFBO1lBQ0EsS0FBQTtjQUNBLEdBQUEsQ0FBQSxHQUFBLE9BQUEsT0FBQTtnQkFDQSxHQUFBLFNBQUEsWUFBQSxPQUFBLFdBQUE7O2NBRUE7WUFDQSxLQUFBO2NBQ0E7WUFDQSxLQUFBO2dCQUNBLEdBQUEsQ0FBQSxHQUFBLEtBQUEsVUFBQTtrQkFDQSxPQUFBLE1BQUEsbUNBQUE7a0JBQ0EsTUFBQTttQkFDQSxXQUFBLGlCQUFBOzs7Z0JBR0E7WUFDQSxLQUFBO2NBQ0E7WUFDQTtnQkFDQSxHQUFBLEdBQUEsS0FBQSxPQUFBO2tCQUNBLE9BQUEsVUFBQTtrQkFDQSxjQUFBLGFBQUEsYUFBQSxRQUFBLEdBQUE7a0JBQ0EsTUFBQTtrQkFDQSxXQUFBLGlCQUFBOztjQUVBOzs7O1FBSUEsT0FBQSxJQUFBLHVCQUFBLFVBQUEsT0FBQSxTQUFBLFVBQUEsV0FBQSxZQUFBO1VBQ0EsR0FBQSxDQUFBLEdBQUEsS0FBQSxPQUFBO1lBQ0EsT0FBQSxHQUFBOztjQUVBO1lBQ0EsUUFBQSxRQUFBO2NBQ0EsS0FBQTtrQkFDQSxHQUFBLE9BQUE7Z0JBQ0E7Y0FDQSxLQUFBO29CQUNBLEdBQUEsT0FBQTtvQkFDQSxHQUFBLHNCQUFBO2tCQUNBO2NBQ0EsS0FBQTtrQkFDQSxHQUFBLE9BQUE7a0JBQ0EsR0FBQSxzQkFBQTtnQkFDQTtjQUNBLEtBQUE7a0JBQ0EsR0FBQSxPQUFBO29CQUNBLEdBQUEsc0JBQUE7a0JBQ0E7Y0FDQSxLQUFBO2tCQUNBLEdBQUEsT0FBQTtvQkFDQSxHQUFBLHNCQUFBO2tCQUNBO2NBQ0E7Z0JBQ0E7Ozs7Ozs7O0FDbGhCQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSxZQUFBLFVBQUE7Ozs7OztBQ0hBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLDBCQUFBLFVBQUE7Ozs7OztBQ0hBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLDRDQUFBLFNBQUEsUUFBQSxjQUFBOztRQUVBLE9BQUEsT0FBQSxVQUFBOztZQUVBLGNBQUE7OztRQUdBLE9BQUEsT0FBQSxVQUFBO1NBQ0EsY0FBQTs7Ozs7OztBQ1hBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLDhDQUFBLFNBQUEsUUFBQSxjQUFBO1FBQ0EsT0FBQSxPQUFBLE9BQUEsUUFBQSxHQUFBO1FBQ0EsR0FBQSxPQUFBLE9BQUEsUUFBQSxHQUFBLEtBQUEsTUFBQSxPQUFBLFNBQUEsWUFBQTtVQUNBLE9BQUEsUUFBQSxHQUFBLEtBQUEsTUFBQSxPQUFBLFFBQUE7O1lBRUE7VUFDQSxHQUFBLE9BQUEsUUFBQSxHQUFBLEtBQUEsTUFBQSxPQUFBLE1BQUEsTUFBQTtZQUNBLE9BQUEsUUFBQSxPQUFBLFFBQUEsR0FBQSxLQUFBLE1BQUEsT0FBQSxNQUFBOztVQUVBLEdBQUEsT0FBQSxRQUFBLEdBQUEsS0FBQSxNQUFBLE9BQUEsTUFBQSxZQUFBO1lBQ0EsT0FBQSxjQUFBLE9BQUEsUUFBQSxHQUFBLEtBQUEsTUFBQSxPQUFBLE1BQUE7Ozs7UUFJQSxPQUFBLE9BQUEsVUFBQTtVQUNBLE9BQUEsUUFBQSxHQUFBLEtBQUEsTUFBQSxPQUFBLE1BQUEsUUFBQSxPQUFBO1VBQ0EsT0FBQSxRQUFBLEdBQUEsS0FBQSxNQUFBLE9BQUEsTUFBQSxjQUFBLE9BQUE7VUFDQSxjQUFBOzs7UUFHQSxPQUFBLE9BQUEsVUFBQTtTQUNBLGNBQUE7Ozs7Ozs7QUN4QkEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsMkNBQUEsU0FBQSxRQUFBLGNBQUE7UUFDQSxPQUFBLE9BQUEsT0FBQSxRQUFBLEdBQUEsU0FBQTtRQUNBLE9BQUEsT0FBQSxVQUFBOztZQUVBLFFBQUEsSUFBQSxPQUFBOzs7UUFHQSxPQUFBLE9BQUEsVUFBQTtTQUNBLGNBQUE7Ozs7Ozs7QUNYQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSx1REFBQSxTQUFBLFFBQUEsUUFBQSxjQUFBOztRQUVBLE9BQUEsT0FBQSxVQUFBOztZQUVBLE9BQUEsR0FBQTtZQUNBLE9BQUEsR0FBQSxPQUFBLFFBQUE7WUFDQSxjQUFBOzs7UUFHQSxPQUFBLE9BQUEsVUFBQTtTQUNBLGNBQUE7Ozs7Ozs7QUNiQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSxxREFBQSxTQUFBLFFBQUEsY0FBQTtRQUNBLE9BQUEsTUFBQSxPQUFBLFFBQUEsR0FBQSxLQUFBO1FBQ0EsT0FBQSxPQUFBLE9BQUEsUUFBQSxHQUFBOztRQUVBLE9BQUEsT0FBQSxVQUFBO1VBQ0EsY0FBQTs7O1FBR0EsT0FBQSxPQUFBLFVBQUE7U0FDQSxjQUFBOzs7UUFHQSxPQUFBLE9BQUEsUUFBQSxTQUFBLEdBQUEsRUFBQTtZQUNBLFFBQUEsSUFBQTtVQUNBLEdBQUEsTUFBQSxFQUFBO1lBQ0E7O1VBRUEsUUFBQSxRQUFBLEdBQUEsU0FBQSxNQUFBLElBQUE7WUFDQSxHQUFBLEtBQUEsTUFBQSxLQUFBLEdBQUEsT0FBQSxRQUFBLENBQUEsRUFBQSxLQUFBLE1BQUEsS0FBQSxHQUFBLE9BQUEsS0FBQTtjQUNBLEtBQUEsTUFBQSxPQUFBLE9BQUEsRUFBQTtjQUNBLE9BQUEsUUFBQSxHQUFBO2NBQ0EsT0FBQSxRQUFBLEdBQUE7OztXQUdBOzs7Ozs7QUMzQkEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxRQUFBLG9CQUFBLFlBQUEsZUFBQSxVQUFBOzs7Ozs7O0FDSEEsQ0FBQSxZQUFBO0NBQ0E7O0NBRUEsU0FBQSxjQUFBLFdBQUEsT0FBQTtFQUNBLElBQUEsWUFBQTtFQUNBLElBQUEsT0FBQSxTQUFBLGVBQUE7RUFDQSxHQUFBLFFBQUEsS0FBQTtHQUNBLFFBQUEsUUFBQSxVQUFBLEtBQUEsUUFBQSxPQUFBLCtDQUFBLFlBQUE7O0VBRUE7RUFDQSxTQUFBLFlBQUEsU0FBQSxNQUFBLE9BQUEsU0FBQTtHQUNBLFFBQUEsUUFBQSxTQUFBLGNBQUEsTUFBQSxZQUFBLEtBQUE7R0FDQSxRQUFBLFFBQUEsU0FBQSxjQUFBLE1BQUEsWUFBQSxJQUFBLFdBQUE7O0dBRUEsT0FBQSxlQUFBLE9BQUEsTUFBQTs7RUFFQSxTQUFBLGNBQUE7R0FDQSxRQUFBLFFBQUEsU0FBQSxjQUFBLE1BQUEsWUFBQSxJQUFBLFdBQUE7O0VBRUEsU0FBQSxlQUFBLE9BQUEsR0FBQSxTQUFBO0dBQ0EsSUFBQSxPQUFBLE1BQUE7R0FDQSxJQUFBLFVBQUE7R0FDQSxJQUFBLFVBQUE7R0FDQSxJQUFBLE1BQUEsUUFBQSxLQUFBLE9BQUE7R0FDQSxJQUFBLFFBQUEsT0FBQTtHQUNBLElBQUEsTUFBQSxRQUFBLFFBQUEsU0FBQSxjQUFBLE9BQUE7R0FDQSxJQUFBLE1BQUEsU0FBQSxjQUFBLE1BQUE7R0FDQSxJQUFBLFFBQUEsSUFBQSx3QkFBQSxNQUFBLEVBQUEsSUFBQSxNQUFBO0dBQ0EsSUFBQSxTQUFBLElBQUEsd0JBQUEsT0FBQSxFQUFBLElBQUEsRUFBQSxTQUFBO0dBQ0EsT0FBQSxRQUFBLFFBQUEsU0FBQSxjQUFBLE9BQUEsSUFBQSxPQUFBLFFBQUEsTUFBQSxJQUFBLFFBQUEsU0FBQTs7RUFFQSxPQUFBO0dBQ0EsYUFBQTtHQUNBLGFBQUE7R0FDQSxnQkFBQTs7O0NBR0EsUUFBQSxPQUFBLGtCQUFBLFVBQUEsd0NBQUEsVUFBQSxVQUFBLGNBQUE7RUFDQSxJQUFBO0VBQ0EsV0FBQSxZQUFBO0dBQ0EsT0FBQTtJQUNBLE9BQUE7SUFDQSxRQUFBO0lBQ0EsZ0JBQUE7SUFDQSxXQUFBO0lBQ0EsS0FBQTtJQUNBLE9BQUE7SUFDQSxRQUFBO0lBQ0EsU0FBQTtJQUNBLFNBQUE7SUFDQSxRQUFBO0lBQ0EsWUFBQSxHQUFBLE1BQUEsVUFBQSxPQUFBLENBQUEsTUFBQSxPQUFBLE1BQUEsQ0FBQSxXQUFBO0lBQ0EsWUFBQTtJQUNBLGNBQUE7SUFDQSxVQUFBO0lBQ0EsU0FBQSxjQUFBLG1CQUFBOzs7RUFHQSxPQUFBO0dBQ0EsVUFBQTtHQUNBLE9BQUE7SUFDQSxXQUFBO0lBQ0EsV0FBQTtJQUNBLFNBQUE7SUFDQSxZQUFBO0lBQ0EsU0FBQTtJQUNBLFNBQUE7O0dBRUEsU0FBQTtHQUNBLE1BQUEsVUFBQSxPQUFBLE1BQUEsT0FBQSxTQUFBO0lBQ0EsSUFBQSxVQUFBLFFBQUEsT0FBQSxZQUFBO0lBQ0EsSUFBQSxRQUFBO0tBQ0EsUUFBQTtLQUNBLFNBQUE7S0FDQSxTQUFBOztJQUVBLElBQUEsYUFBQSxHQUFBLElBQUEsTUFBQSxXQUFBLFVBQUEsR0FBQTtLQUNBLE9BQUEsV0FBQSxFQUFBOzs7SUFHQSxRQUFBLGVBQUEsR0FBQSxNQUFBLE1BQUEsU0FBQSxLQUFBLE9BQUEsQ0FBQSxHQUFBLGFBQUEsTUFBQSxDQUFBLEdBQUE7SUFDQSxRQUFBLFNBQUE7S0FDQSxHQUFBLFFBQUEsUUFBQTtLQUNBLEdBQUEsUUFBQSxTQUFBOztJQUVBLFFBQUEsY0FBQTs7SUFFQSxJQUFBLGVBQUEsWUFBQTtLQUNBLEdBQUEsTUFBQSxRQUFBLFNBQUEsVUFBQSxLQUFBLE1BQUEsUUFBQSxTQUFBLEdBQUEsU0FBQSxTQUFBLEVBQUE7TUFDQSxRQUFBLFFBQUEsTUFBQSxRQUFBLFVBQUEsVUFBQSxPQUFBLE9BQUE7T0FDQSxJQUFBLElBQUE7UUFDQSxNQUFBLE1BQUE7UUFDQSxNQUFBLE1BQUE7UUFDQSxPQUFBLE1BQUE7UUFDQSxPQUFBLE1BQUE7UUFDQSxNQUFBLE1BQUE7UUFDQSxTQUFBLGFBQUEsV0FBQSxNQUFBO1FBQ0EsTUFBQTtRQUNBLFNBQUEsTUFBQTs7T0FFQSxPQUFBLEtBQUE7T0FDQSxRQUFBLFFBQUEsTUFBQSxVQUFBLFVBQUEsTUFBQTtRQUNBLElBQUEsTUFBQSxVQUFBLEtBQUEsbUJBQUE7U0FDQSxJQUFBLE9BQUE7VUFDQSxNQUFBLEtBQUE7VUFDQSxRQUFBLE1BQUEsVUFBQSxLQUFBLG9CQUFBLE1BQUE7VUFDQSxPQUFBLE1BQUEsVUFBQSxLQUFBO1VBQ0EsTUFBQSxLQUFBO1VBQ0EsT0FBQSxNQUFBO1VBQ0EsR0FBQSxRQUFBLE9BQUE7VUFDQSxHQUFBLFFBQUEsT0FBQTtVQUNBLE9BQUEsS0FBQTtVQUNBLE1BQUEsS0FBQTtVQUNBLFNBQUEsYUFBQSxXQUFBLEtBQUE7VUFDQSxNQUFBO1VBQ0EsU0FBQTs7U0FFQSxNQUFBLEtBQUE7Ozs7TUFJQTs7O1NBR0E7TUFDQSxJQUFBLElBQUE7T0FDQSxNQUFBLE1BQUEsUUFBQTtPQUNBLE1BQUEsTUFBQSxRQUFBO09BQ0EsT0FBQSxNQUFBLFFBQUE7T0FDQSxPQUFBLE1BQUEsUUFBQTtPQUNBLE1BQUEsTUFBQSxRQUFBO09BQ0EsU0FBQSxNQUFBLFFBQUE7T0FDQSxNQUFBLE1BQUEsUUFBQTtPQUNBLFVBQUEsTUFBQSxRQUFBOztNQUVBLE9BQUEsS0FBQTtNQUNBLFFBQUEsUUFBQSxNQUFBLFFBQUEsVUFBQSxVQUFBLE1BQUE7T0FDQSxJQUFBLE1BQUEsVUFBQSxLQUFBLG1CQUFBO1FBQ0EsSUFBQSxPQUFBO1NBQ0EsTUFBQSxLQUFBO1NBQ0EsUUFBQSxNQUFBLFVBQUEsS0FBQSxvQkFBQSxNQUFBO1NBQ0EsT0FBQSxNQUFBLFVBQUEsS0FBQSxvQkFBQSxNQUFBO1NBQ0EsTUFBQSxLQUFBO1NBQ0EsT0FBQSxNQUFBLFFBQUE7U0FDQSxHQUFBLFFBQUEsT0FBQTtTQUNBLEdBQUEsUUFBQSxPQUFBO1NBQ0EsT0FBQSxLQUFBO1NBQ0EsTUFBQSxLQUFBO1NBQ0EsU0FBQSxhQUFBLFdBQUEsS0FBQTtTQUNBLE1BQUE7U0FDQSxTQUFBOztRQUVBLE1BQUEsS0FBQTs7Ozs7SUFLQSxJQUFBLGNBQUEsVUFBQTtLQUNBLFFBQUE7S0FDQSxTQUFBOztJQUVBLElBQUEsZ0JBQUEsVUFBQTtLQUNBLFFBQUEsUUFBQSxPQUFBLFNBQUEsTUFBQSxJQUFBO09BQ0EsUUFBQSxZQUFBLEtBQUEsU0FBQTtRQUNBLEdBQUEsUUFBQSxRQUFBO1FBQ0EsR0FBQSxRQUFBLFNBQUEsS0FBQSxJQUFBO1FBQ0EsUUFBQTs7OztJQUlBLElBQUEsYUFBQSxZQUFBO0tBQ0EsUUFBQSxRQUFBLE1BQUEsS0FBQTtLQUNBLFFBQUEsTUFBQSxHQUFBLE9BQUEsS0FBQSxJQUFBLE9BQUEsT0FBQSxLQUFBLFNBQUEsUUFBQSxPQUFBLEtBQUEsVUFBQSxRQUFBLFFBQUEsS0FBQSxNQUFBOztLQUVBLElBQUEsQ0FBQSxRQUFBLFNBQUE7TUFDQSxJQUFBLEtBQUEsS0FBQTtNQUNBLEdBQUEsT0FBQSxVQUFBLEVBQUE7T0FDQSxJQUFBLFNBQUEsR0FBQSxJQUFBO1NBQ0EsWUFBQTtTQUNBLFlBQUE7U0FDQSxXQUFBLENBQUEsTUFBQSxLQUFBO1NBQ0EsU0FBQSxNQUFBLEtBQUE7T0FDQSxJQUFBLFlBQUEsR0FBQSxJQUFBO1NBQ0EsWUFBQTtTQUNBLFlBQUE7U0FDQSxXQUFBLE1BQUEsS0FBQTtTQUNBLFNBQUEsT0FBQSxLQUFBOztPQUVBLFFBQUEsU0FBQSxRQUFBLElBQUEsT0FBQTtTQUNBLEtBQUEsS0FBQTtTQUNBLEtBQUEsUUFBQSxTQUFBLEVBQUE7U0FDQSxPQUFBLE9BQUEsR0FBQSxTQUFBOztTQUVBLEtBQUEsTUFBQTtTQUNBLEtBQUEsYUFBQSxjQUFBLFFBQUEsTUFBQSxHQUFBLEtBQUEsUUFBQSxPQUFBLElBQUEsUUFBQSxPQUFBLElBQUE7T0FDQSxRQUFBLFlBQUEsUUFBQSxJQUFBLE9BQUE7U0FDQSxLQUFBLEtBQUE7U0FDQSxLQUFBLE1BQUE7U0FDQSxLQUFBLFFBQUEsU0FBQSxFQUFBO1NBQ0EsT0FBQSxPQUFBLEdBQUEsU0FBQTs7U0FFQSxLQUFBLGFBQUEsY0FBQSxRQUFBLE1BQUEsR0FBQSxLQUFBLFFBQUEsT0FBQSxHQUFBOztVQUVBO09BQ0EsSUFBQSxNQUFBLEdBQUEsSUFBQTtTQUNBLFlBQUEsUUFBQSxNQUFBLElBQUE7U0FDQSxZQUFBLFFBQUEsTUFBQTtTQUNBLFdBQUEsS0FBQSxLQUFBO1NBQ0EsU0FBQSxPQUFBLEtBQUE7OztPQUdBLFFBQUEsTUFBQSxRQUFBLElBQUEsT0FBQTtTQUNBLEtBQUEsS0FBQTtTQUNBLEtBQUEsUUFBQSxPQUFBLEdBQUE7U0FDQSxLQUFBLE1BQUE7U0FDQSxLQUFBLGFBQUEsY0FBQSxRQUFBLE1BQUEsR0FBQSxLQUFBLFFBQUEsT0FBQSxHQUFBOzs7O0lBSUEsR0FBQSxRQUFBLFVBQUEsUUFBQSxPQUFBLFVBQUEsRUFBQTtNQUNBLElBQUEsYUFBQSxRQUFBLElBQUEsVUFBQSxlQUFBLEtBQUEsUUFBQSxRQUFBLE9BQUE7UUFDQSxLQUFBLFNBQUE7UUFDQSxLQUFBLFFBQUEsU0FBQSxFQUFBO1FBQ0EsT0FBQSxFQUFBOzs7Ozs7OztRQVFBLEtBQUEsS0FBQTtRQUNBLE1BQUEsYUFBQTtRQUNBLE1BQUEsVUFBQTs7UUFFQSxLQUFBLFNBQUEsUUFBQTtRQUNBLEtBQUEsZUFBQTtRQUNBLEdBQUEsU0FBQSxTQUFBLEVBQUE7UUFDQSxRQUFBLGNBQUEsRUFBQTtRQUNBLFFBQUE7O1FBRUEsS0FBQSxLQUFBLFNBQUEsRUFBQTtRQUNBLElBQUEsUUFBQSxPQUFBLFFBQUE7UUFDQSxHQUFBLFNBQUEsRUFBQTtTQUNBLE9BQUE7O1lBRUE7U0FDQSxPQUFBLFFBQUEsU0FBQTs7O1FBR0EsS0FBQSxTQUFBLEVBQUE7UUFDQSxPQUFBLEVBQUE7Ozs7S0FJQSxRQUFBLGFBQUEsUUFBQSxJQUFBLFVBQUEsVUFBQSxLQUFBLE9BQUEsUUFBQSxPQUFBLEtBQUEsS0FBQSxhQUFBLGdCQUFBLFFBQUEsUUFBQSxLQUFBLE9BQUEsUUFBQSxTQUFBLEtBQUEsS0FBQSxLQUFBLFNBQUE7Ozs7OztLQU1BLFFBQUEsVUFBQSxRQUFBLFdBQUEsT0FBQSxVQUFBLEtBQUEsS0FBQSxHQUFBLEtBQUEsU0FBQSxVQUFBLEdBQUE7TUFDQSxPQUFBLEVBQUEsU0FBQSxRQUFBLFdBQUEsRUFBQTtTQUNBLEtBQUEsZ0JBQUEsR0FBQSxLQUFBLFVBQUEsVUFBQSxHQUFBO01BQ0EsT0FBQSxHQUFBLElBQUEsUUFBQSxXQUFBLEVBQUEsUUFBQTtRQUNBLEtBQUEsTUFBQSxVQUFBLEdBQUE7TUFDQSxPQUFBLFlBQUEsRUFBQTs7S0FFQSxRQUFBLFFBQUEsUUFBQSxXQUFBLE9BQUE7T0FDQSxLQUFBLGVBQUE7T0FDQSxLQUFBLGFBQUEsVUFBQSxHQUFBOzs7T0FHQSxLQUFBLGVBQUE7T0FDQSxLQUFBLFFBQUEsU0FBQSxFQUFBO09BQ0EsT0FBQSxFQUFBLFVBQUEsU0FBQSxFQUFBOztPQUVBLEtBQUEsVUFBQSxHQUFBO09BQ0EsT0FBQSxFQUFBLFdBQUE7O0tBRUEsUUFBQSxNQUFBLEdBQUEsYUFBQSxVQUFBLEdBQUEsR0FBQTtNQUNBLE9BQUEsYUFBQSxHQUFBLEdBQUE7UUFDQSxHQUFBLFlBQUEsVUFBQSxHQUFBLEdBQUE7TUFDQSxPQUFBLGFBQUEsR0FBQSxHQUFBO1FBQ0EsR0FBQSxTQUFBLFVBQUEsR0FBQSxHQUFBOztNQUVBLFFBQUEsY0FBQSxFQUFBO01BQ0EsUUFBQTs7S0FFQSxRQUFBLFFBQUEsYUFBQSxTQUFBLFFBQUEsVUFBQSxLQUFBLEtBQUEsVUFBQSxHQUFBO01BQ0EsT0FBQSxFQUFBOztLQUVBLFFBQUEsTUFBQSxhQUFBLFNBQUEsUUFBQSxVQUFBLEtBQUEsYUFBQSxVQUFBLEdBQUE7TUFDQSxPQUFBLEVBQUEsU0FBQSxPQUFBO1FBQ0EsS0FBQSxLQUFBLFVBQUEsR0FBQTtNQUNBLE9BQUEsRUFBQSxTQUFBLE1BQUE7OztJQUdBLElBQUEsYUFBQSxZQUFBOztLQUVBLE1BQUEsUUFBQSxVQUFBLEdBQUEsR0FBQTtNQUNBLFFBQUEsUUFBQSxhQUFBLFNBQUEsUUFBQSxVQUFBLE1BQUEsSUFBQSxRQUFBO1FBQ0EsS0FBQSxLQUFBLFVBQUEsR0FBQTtRQUNBLEVBQUEsU0FBQSxFQUFBLFFBQUEsTUFBQSxVQUFBLEVBQUEsUUFBQSxNQUFBO1FBQ0EsT0FBQSxNQUFBLFVBQUEsRUFBQSxRQUFBLE1BQUE7O01BRUEsUUFBQSxNQUFBLGFBQUEsU0FBQSxRQUFBLFVBQUEsTUFBQSxJQUFBLFFBQUE7UUFDQSxLQUFBLGFBQUEsVUFBQSxHQUFBO1FBQ0EsT0FBQSxDQUFBLE1BQUEsVUFBQSxFQUFBLFFBQUEsTUFBQSxjQUFBLE9BQUE7O1FBRUEsS0FBQSxLQUFBLFVBQUEsR0FBQTtRQUNBLE9BQUEsQ0FBQSxNQUFBLFVBQUEsRUFBQSxRQUFBLE1BQUEsY0FBQSxNQUFBOzs7O0lBSUEsSUFBQSxTQUFBLFVBQUEsR0FBQTtLQUNBLE9BQUEsQ0FBQSxLQUFBLElBQUEsRUFBQSxRQUFBLE9BQUE7O0lBRUEsSUFBQSxRQUFBLFlBQUE7S0FDQSxPQUFBLFFBQUEsUUFBQSxHQUFBLE9BQUEsUUFBQSxNQUFBLE9BQUEsS0FBQSxDQUFBLFFBQUEsT0FBQSxRQUFBLFNBQUEsTUFBQTs7SUFFQSxJQUFBLG9CQUFBLFlBQUE7S0FDQSxRQUFBLE1BQUEsUUFBQSxRQUFBLGdCQUFBLE9BQUEsUUFBQSxTQUFBLE1BQUEsR0FBQSxRQUFBLFVBQUEsR0FBQTtNQUNBLFFBQUEsV0FBQSxLQUFBLG9CQUFBLEVBQUEsUUFBQSxLQUFBLGFBQUEsVUFBQSxHQUFBO09BQ0EsT0FBQSxlQUFBLEVBQUEsSUFBQSxNQUFBLEVBQUEsSUFBQTs7O0tBR0EsUUFBQSxNQUFBOztJQUVBLElBQUEsaUJBQUEsWUFBQTtLQUNBLFFBQUEsTUFBQSxRQUFBLFFBQUEsZ0JBQUEsT0FBQSxRQUFBLFNBQUEsS0FBQSxHQUFBLFFBQUEsVUFBQSxHQUFBO01BQ0EsUUFBQSxXQUFBLEtBQUEsaUJBQUEsRUFBQSxRQUFBLEtBQUEsYUFBQSxVQUFBLEdBQUE7T0FDQSxPQUFBLGVBQUEsRUFBQSxJQUFBLE1BQUEsRUFBQSxJQUFBOzs7S0FHQSxRQUFBLE1BQUE7O0lBRUEsSUFBQSxzQkFBQSxVQUFBLE9BQUE7S0FDQSxPQUFBLENBQUEsVUFBQSxPQUFBO01BQ0EsT0FBQSxVQUFBLEdBQUE7T0FDQSxFQUFBLElBQUEsRUFBQSxJQUFBLENBQUEsUUFBQSxNQUFBLElBQUEsRUFBQSxNQUFBLFFBQUEsU0FBQSxRQUFBLE9BQUE7T0FDQSxFQUFBLElBQUEsRUFBQSxJQUFBLENBQUEsUUFBQSxPQUFBLElBQUEsRUFBQSxNQUFBLFFBQUEsU0FBQSxRQUFBLFFBQUE7O1FBRUE7O0lBRUEsSUFBQSxtQkFBQSxVQUFBLE9BQUE7S0FDQSxPQUFBLENBQUEsVUFBQSxPQUFBO01BQ0EsT0FBQSxVQUFBLEdBQUE7T0FDQSxFQUFBLElBQUEsRUFBQSxJQUFBLENBQUEsUUFBQSxPQUFBLElBQUEsRUFBQSxNQUFBLFFBQUEsU0FBQSxRQUFBLFFBQUE7T0FDQSxFQUFBLElBQUEsRUFBQSxJQUFBLENBQUEsTUFBQSxFQUFBLE1BQUEsUUFBQSxTQUFBLFFBQUEsUUFBQTs7UUFFQTs7SUFFQSxJQUFBLG1CQUFBLFVBQUEsT0FBQTtLQUNBLE9BQUEsQ0FBQSxVQUFBLE9BQUE7TUFDQSxPQUFBLFVBQUEsR0FBQTs7T0FFQSxJQUFBO09BQ0EsU0FBQSxRQUFBLFlBQUEsRUFBQTtPQUNBLEVBQUEsSUFBQSxFQUFBLElBQUEsQ0FBQSxPQUFBLElBQUEsRUFBQSxNQUFBLE9BQUEsU0FBQSxRQUFBLFFBQUE7T0FDQSxPQUFBLEVBQUEsSUFBQSxFQUFBLElBQUEsQ0FBQSxPQUFBLElBQUEsRUFBQSxNQUFBLE9BQUEsU0FBQSxRQUFBLFFBQUE7O1FBRUE7O0lBRUEsSUFBQSxlQUFBLFVBQUEsTUFBQSxHQUFBLFNBQUE7S0FDQSxJQUFBO0tBQ0EsVUFBQSwyQkFBQSxLQUFBLE9BQUE7S0FDQSxRQUFBLFFBQUEsS0FBQSxLQUFBLFVBQUEsVUFBQSxNQUFBO01BQ0EsV0FBQSx5Q0FBQSxLQUFBLFNBQUEsS0FBQSxTQUFBLFVBQUEsS0FBQSxTQUFBOztLQUVBLFNBQUEsUUFBQSxRQUFBLFlBQUEsU0FBQSxNQUFBLEdBQUEsT0FBQSxNQUFBLFlBQUE7OztJQUdBLElBQUEsZUFBQSxVQUFBLE1BQUEsR0FBQSxTQUFBO0tBQ0EsT0FBQSxRQUFBLFFBQUE7OztJQUdBLE1BQUEsT0FBQSxhQUFBLFVBQUEsTUFBQSxTQUFBO0tBQ0EsUUFBQSxRQUFBOztLQUVBLElBQUEsUUFBQSxXQUFBLE1BQUE7TUFDQTtNQUNBO01BQ0E7WUFDQTtNQUNBOztLQUVBLEdBQUEsT0FBQSxVQUFBLEtBQUEsUUFBQSxVQUFBLEtBQUE7T0FDQTs7U0FFQTtPQUNBOzs7O0lBSUEsTUFBQSxPQUFBLFdBQUEsVUFBQSxHQUFBLEdBQUE7S0FDQSxHQUFBLE1BQUEsRUFBQTtNQUNBOztLQUVBLEdBQUEsT0FBQSxFQUFBLEdBQUEsWUFBQSxZQUFBO01BQ0EsUUFBQSxRQUFBO01BQ0E7TUFDQTtNQUNBO01BQ0E7O01BRUEsR0FBQSxPQUFBLFVBQUEsS0FBQSxRQUFBLFVBQUEsS0FBQTtRQUNBOzs7VUFHQTs7UUFFQTs7Ozs7SUFLQSxNQUFBLE9BQUEsYUFBQSxVQUFBLE1BQUEsTUFBQTtLQUNBLElBQUEsU0FBQSxNQUFBO01BQ0E7O0tBRUEsSUFBQSxRQUFBLE9BQUE7TUFDQTtZQUNBO01BQ0E7Ozs7Ozs7O0FDeGFBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsUUFBQSxvQkFBQSxZQUFBLG1CQUFBLFVBQUE7Ozs7OztBQ0hBLENBQUEsWUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxrQkFBQSxVQUFBLDRCQUFBLFVBQUEsVUFBQTtFQUNBLElBQUEsV0FBQSxZQUFBO0dBQ0EsT0FBQTtJQUNBLE9BQUE7SUFDQSxRQUFBO0lBQ0EsT0FBQTtJQUNBLE1BQUE7SUFDQSxPQUFBOzs7RUFHQSxPQUFBO0dBQ0EsVUFBQTtHQUNBLFlBQUE7R0FDQSxPQUFBO0lBQ0EsU0FBQTs7R0FFQSxTQUFBO0dBQ0EsTUFBQSxVQUFBLFFBQUEsU0FBQSxRQUFBLFNBQUE7OztJQUdBLE9BQUEsVUFBQSxRQUFBLE9BQUEsWUFBQSxPQUFBOzs7SUFHQSxJQUFBLFNBQUEsR0FBQSxNQUFBO01BQ0EsT0FBQSxDQUFBLEdBQUEsT0FBQSxRQUFBO01BQ0EsTUFBQSxDQUFBLEdBQUE7TUFDQSxNQUFBOzs7SUFHQSxJQUFBLE1BQUEsR0FBQSxPQUFBLFFBQUEsSUFBQSxPQUFBO01BQ0EsS0FBQSxTQUFBLE9BQUEsUUFBQTtNQUNBLEtBQUEsVUFBQSxPQUFBLFFBQUE7TUFDQSxPQUFBO0lBQ0EsSUFBQSxZQUFBLElBQUEsT0FBQTtNQUNBLEtBQUEsYUFBQSxlQUFBLE9BQUEsUUFBQSxRQUFBLElBQUEsTUFBQSxPQUFBLFFBQUEsU0FBQSxJQUFBO0lBQ0EsSUFBQSxhQUFBLFVBQUEsT0FBQTtNQUNBLEtBQUEsS0FBQSxPQUFBLFFBQUEsUUFBQSxJQUFBO01BQ0EsS0FBQSxnQkFBQTtNQUNBLEtBQUEsVUFBQSxPQUFBLFFBQUE7TUFDQSxNQUFBLFdBQUE7TUFDQSxLQUFBLFFBQUE7SUFDQSxJQUFBLE1BQUEsR0FBQSxJQUFBO01BQ0EsV0FBQTtNQUNBLFlBQUEsVUFBQSxHQUFBO01BQ0EsT0FBQSxPQUFBLFFBQUEsUUFBQSxJQUFBOztNQUVBLFlBQUEsVUFBQSxHQUFBO01BQ0EsT0FBQSxPQUFBLFFBQUEsUUFBQTs7SUFFQSxJQUFBLGNBQUEsVUFBQSxPQUFBO01BQ0EsTUFBQTtNQUNBLFVBQUEsSUFBQSxLQUFBLEtBQUE7O01BRUEsTUFBQSxRQUFBLE9BQUEsUUFBQTtNQUNBLEtBQUEsS0FBQTtJQUNBLElBQUEsT0FBQSxVQUFBLFVBQUE7TUFDQSxLQUFBLENBQUE7TUFDQTtNQUNBLE9BQUE7TUFDQSxLQUFBLFVBQUEsR0FBQTtNQUNBLE9BQUEsT0FBQTs7TUFFQSxNQUFBLFFBQUEsT0FBQSxRQUFBO01BQ0EsTUFBQSxlQUFBO01BQ0EsS0FBQSxlQUFBO01BQ0EsS0FBQSxLQUFBOzs7SUFHQSxTQUFBLFVBQUEsUUFBQTtLQUNBLFlBQUE7T0FDQSxTQUFBO09BQ0EsS0FBQSxVQUFBLE9BQUEsVUFBQSxJQUFBLEtBQUE7S0FDQSxLQUFBLGFBQUEsU0FBQSxLQUFBLE1BQUEsUUFBQSxVQUFBLEdBQUE7TUFDQSxJQUFBLE9BQUEsS0FBQSxZQUFBLE1BQUE7TUFDQSxJQUFBLElBQUEsR0FBQSxZQUFBLFNBQUEsS0FBQSxLQUFBO01BQ0EsT0FBQSxVQUFBLEdBQUE7T0FDQSxLQUFBLGNBQUEsUUFBQSxLQUFBLE1BQUEsRUFBQSxLQUFBLEtBQUE7Ozs7OztJQU1BLFNBQUEsU0FBQSxZQUFBLFVBQUE7S0FDQSxXQUFBLFVBQUEsS0FBQSxVQUFBLEdBQUE7TUFDQSxJQUFBLGNBQUEsR0FBQSxZQUFBLEVBQUEsVUFBQTtNQUNBLE9BQUEsVUFBQSxHQUFBO09BQ0EsRUFBQSxXQUFBLFlBQUE7T0FDQSxPQUFBLElBQUE7Ozs7O0lBS0EsT0FBQSxPQUFBLFdBQUEsVUFBQSxHQUFBLEdBQUE7S0FDQSxJQUFBLE1BQUEsR0FBQTtNQUNBOztLQUVBLFdBQUEsTUFBQSxVQUFBLEVBQUE7S0FDQSxZQUFBLE1BQUEsUUFBQSxFQUFBO0tBQ0EsS0FBQSxNQUFBLFFBQUEsRUFBQTtLQUNBLFNBQUEsWUFBQTtNQUNBLFVBQUEsUUFBQSxZQUFBLEVBQUE7Ozs7O0lBS0EsT0FBQTtLQUNBLFlBQUE7TUFDQSxPQUFBLFFBQUE7O0tBRUEsVUFBQSxHQUFBLEdBQUE7TUFDQSxJQUFBLENBQUEsR0FBQTtPQUNBLElBQUE7T0FDQSxFQUFBLE9BQUEsUUFBQSxTQUFBLE9BQUEsUUFBQTs7TUFFQSxTQUFBLFlBQUE7T0FDQSxVQUFBLEVBQUEsT0FBQSxRQUFBOzs7Ozs7Ozs7O0FDdEhBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxrQkFBQSxXQUFBLFdBQUEsV0FBQTtFQUNBLElBQUEsV0FBQSxVQUFBO0dBQ0EsT0FBQTtJQUNBLE9BQUE7SUFDQSxPQUFBOzs7RUFHQSxPQUFBO0dBQ0EsVUFBQTtHQUNBLGFBQUE7R0FDQSxZQUFBO0dBQ0EsTUFBQTtJQUNBLFFBQUE7SUFDQSxXQUFBOztHQUVBLE1BQUEsVUFBQSxRQUFBLFNBQUEsUUFBQSxRQUFBO0tBQ0EsSUFBQSxVQUFBLFFBQUEsT0FBQSxZQUFBLE9BQUE7Ozs7Ozs7O0FDbkJBLENBQUEsWUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLDBCQUFBLFVBQUEsUUFBQTtFQUNBLE9BQUEsVUFBQTtFQUNBOztFQUVBLFNBQUEsVUFBQTtHQUNBLE9BQUE7R0FDQSxPQUFBLE9BQUEsV0FBQSxTQUFBLEVBQUEsRUFBQTtJQUNBLEdBQUEsTUFBQSxFQUFBO0tBQ0E7O0lBRUEsT0FBQTs7O0VBR0EsU0FBQSxTQUFBO0dBQ0EsT0FBQSxVQUFBO0lBQ0EsYUFBQTtJQUNBLE1BQUEsQ0FBQTtLQUNBLFFBQUE7TUFDQSxHQUFBO01BQ0EsR0FBQTs7S0FFQSxPQUFBO0tBQ0EsT0FBQTs7SUFFQSxPQUFBLENBQUE7S0FDQSxRQUFBO01BQ0EsR0FBQTtNQUNBLEdBQUEsT0FBQSxRQUFBOztLQUVBLE9BQUE7S0FDQSxPQUFBLE9BQUEsUUFBQTs7Ozs7Ozs7QUNqQ0EsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGtCQUFBLFdBQUEsYUFBQSxXQUFBOztFQUVBLE9BQUE7R0FDQSxVQUFBO0dBQ0EsYUFBQTtHQUNBLFlBQUE7R0FDQSxjQUFBO0dBQ0EsTUFBQTtJQUNBLE1BQUE7O0dBRUEsa0JBQUE7R0FDQSxRQUFBO0dBQ0EsU0FBQTtHQUNBLE1BQUEsVUFBQSxPQUFBLFNBQUEsT0FBQSxXQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0FDaEJBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsUUFBQSxvQkFBQSxZQUFBLHNEQUFBLFNBQUEsUUFBQSxhQUFBLFFBQUE7O0dBRUEsSUFBQSxLQUFBOztHQUVBLEdBQUEsYUFBQTtHQUNBLEdBQUEsZ0JBQUE7R0FDQSxHQUFBLGVBQUE7R0FDQSxHQUFBLGFBQUE7R0FDQSxHQUFBLGNBQUE7R0FDQSxHQUFBLHNCQUFBOztLQUVBOztLQUVBLFNBQUEsVUFBQTtPQUNBOztHQUVBLFNBQUEsWUFBQSxPQUFBO0lBQ0EsT0FBQSxRQUFBLGNBQUEsR0FBQSxlQUFBLE9BQUE7O0dBRUEsU0FBQSxvQkFBQSxPQUFBO0lBQ0EsT0FBQSxRQUFBLGNBQUEsR0FBQSxZQUFBLE9BQUE7O0dBRUEsU0FBQSxVQUFBO09BQ0EsR0FBQSxnQkFBQSxZQUFBLE9BQUEsaUJBQUE7SUFDQSxHQUFBLGFBQUEsWUFBQSxPQUFBLGNBQUE7SUFDQSxHQUFBLGVBQUEsWUFBQSxPQUFBLGlCQUFBOzs7R0FHQSxPQUFBLGlCQUFBLFdBQUEsU0FBQSxHQUFBLEVBQUE7S0FDQSxHQUFBLE1BQUEsRUFBQTtNQUNBOztLQUVBLFFBQUEsSUFBQTtLQUNBLEdBQUEsRUFBQSxTQUFBLEVBQUEsbUJBQUEsRUFBQSxRQUFBLEVBQUEsYUFBQTtNQUNBLEVBQUEsT0FBQTs7U0FFQTtNQUNBLEVBQUEsT0FBQTtNQUNBOzs7Ozs7QUN6Q0EsQ0FBQSxZQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGtCQUFBLFVBQUEsdUJBQUEsVUFBQSxVQUFBO0VBQ0EsSUFBQSxXQUFBLFlBQUE7R0FDQSxPQUFBO0lBQ0EsSUFBQTtJQUNBLE9BQUE7SUFDQSxRQUFBO0lBQ0EsTUFBQTtJQUNBLE9BQUE7SUFDQSxVQUFBO0lBQ0EsUUFBQTtLQUNBLE1BQUE7S0FDQSxPQUFBO0tBQ0EsS0FBQTtLQUNBLFFBQUE7O0lBRUEsUUFBQSxFQUFBO0tBQ0EsVUFBQTtLQUNBLE9BQUE7S0FDQSxTQUFBO09BQ0E7S0FDQSxVQUFBO0tBQ0EsT0FBQTtLQUNBLFNBQUE7TUFDQTtLQUNBLFVBQUE7S0FDQSxPQUFBO0tBQ0EsU0FBQTs7OztFQUlBLE9BQUE7R0FDQSxVQUFBO0dBQ0EsT0FBQTtJQUNBLE1BQUE7SUFDQSxTQUFBOztHQUVBLFNBQUE7R0FDQSxNQUFBLFVBQUEsUUFBQSxTQUFBLFFBQUEsU0FBQTs7SUFFQSxJQUFBLFVBQUEsUUFBQSxPQUFBLFlBQUE7SUFDQSxVQUFBLFFBQUEsT0FBQSxTQUFBLE9BQUE7SUFDQSxRQUFBLFNBQUEsSUFBQSxPQUFBO0lBQ0EsR0FBQSxRQUFBLE1BQUE7S0FDQSxRQUFBLE9BQUEsR0FBQSxRQUFBLFFBQUE7O0lBRUEsUUFBQSxJQUFBLFVBQUEsUUFBQSxTQUFBLE1BQUEsSUFBQSxpQkFBQSxRQUFBLFNBQUEsSUFBQTtJQUNBLElBQUEsSUFBQSxHQUFBLE1BQUE7TUFDQSxPQUFBLENBQUEsR0FBQTtNQUNBLE1BQUEsQ0FBQSxRQUFBLE9BQUEsTUFBQSxRQUFBLFFBQUEsUUFBQSxPQUFBO01BQ0EsTUFBQTs7SUFFQSxJQUFBLFFBQUEsR0FBQSxJQUFBO01BQ0EsRUFBQTtNQUNBLE9BQUEsQ0FBQSxHQUFBO01BQ0EsR0FBQSxTQUFBO01BQ0EsR0FBQSxZQUFBOztJQUVBLElBQUEsTUFBQSxHQUFBLE9BQUEsUUFBQSxJQUFBLE9BQUE7TUFDQSxLQUFBLFNBQUEsUUFBQTtNQUNBLEtBQUEsVUFBQSxRQUFBO01BQ0EsT0FBQTs7SUFFQSxJQUFBLFdBQUEsSUFBQSxPQUFBO01BQ0EsT0FBQTtNQUNBLEtBQUEsTUFBQSxRQUFBLE1BQUEsUUFBQTtNQUNBLEtBQUEsTUFBQTtNQUNBLEtBQUEsTUFBQTtNQUNBLEtBQUEsTUFBQTtNQUNBLEtBQUEsTUFBQTtNQUNBLEtBQUEsZ0JBQUE7SUFDQSxRQUFBLFFBQUEsUUFBQSxRQUFBLFVBQUEsT0FBQTtLQUNBLFNBQUEsT0FBQTtPQUNBLEtBQUEsVUFBQSxNQUFBLFdBQUE7T0FDQSxLQUFBLGNBQUEsTUFBQTtPQUNBLEtBQUEsZ0JBQUEsTUFBQTs7SUFFQSxJQUFBLE9BQUEsSUFBQSxPQUFBO01BQ0EsS0FBQSxTQUFBLFFBQUE7TUFDQSxLQUFBLFVBQUEsUUFBQTtNQUNBLE1BQUEsUUFBQSxXQUFBLFFBQUEsTUFBQSxRQUFBLFNBQUE7SUFDQSxJQUFBLFNBQUEsSUFBQSxPQUFBLEtBQUEsS0FBQSxhQUFBLGVBQUEsUUFBQSxTQUFBLElBQUEsT0FBQSxRQUFBLFNBQUEsSUFBQTtNQUNBLEtBQUEsU0FBQTs7SUFFQSxJQUFBLFFBQUEsU0FBQSxNQUFBO0tBQ0EsT0FBQSxPQUFBO09BQ0EsS0FBQSxLQUFBLFFBQUEsU0FBQTtLQUNBLE9BQUEsT0FBQTtPQUNBLEtBQUE7T0FDQSxNQUFBLGFBQUEsUUFBQSxPQUFBO09BQ0EsS0FBQSxlQUFBO09BQ0EsS0FBQSxLQUFBO0tBQ0EsSUFBQSxVQUFBLElBQUEsT0FBQSxLQUFBLEtBQUEsYUFBQSxnQkFBQSxRQUFBLFNBQUEsUUFBQSxTQUFBLE1BQUEsT0FBQSxRQUFBLFNBQUEsSUFBQTtPQUNBLEtBQUEsU0FBQTtLQUNBLFFBQUEsT0FBQTtPQUNBLEtBQUEsS0FBQSxRQUFBLFNBQUE7S0FDQSxRQUFBLE9BQUE7T0FDQSxLQUFBO09BQ0EsTUFBQSxhQUFBLFFBQUEsT0FBQTtPQUNBLEtBQUEsZUFBQTtPQUNBLEtBQUEsS0FBQTs7SUFFQSxJQUFBLFNBQUEsSUFBQSxPQUFBO01BQ0EsS0FBQSxTQUFBO0lBQ0EsR0FBQSxRQUFBLFlBQUEsS0FBQTtLQUNBLE9BQUEsS0FBQTs7O0lBR0EsT0FBQSxPQUFBO01BQ0EsS0FBQSxVQUFBLFFBQUE7O0lBRUEsSUFBQSxRQUFBLFNBQUEsTUFBQTtJQUNBLE9BQUEsT0FBQTtNQUNBLEtBQUEsTUFBQSxRQUFBLFFBQUE7TUFDQSxLQUFBLE1BQUE7TUFDQSxLQUFBLE1BQUEsUUFBQSxRQUFBO01BQ0EsS0FBQSxNQUFBLFFBQUE7TUFDQSxLQUFBLG9CQUFBO01BQ0EsS0FBQSxnQkFBQTtNQUNBLEtBQUEsVUFBQTs7SUFFQSxJQUFBLGFBQUEsT0FBQSxPQUFBO01BQ0EsS0FBQSxhQUFBLGlCQUFBLFFBQUEsU0FBQSxJQUFBO0lBQ0EsSUFBQSxTQUFBLFdBQUEsT0FBQTtNQUNBLEtBQUEsU0FBQTtNQUNBLEtBQUEsS0FBQSxRQUFBLFNBQUE7S0FDQSxHQUFBLFFBQUEsTUFBQTtNQUNBLE9BQUEsTUFBQSxRQUFBLFFBQUE7O0lBRUEsSUFBQSxjQUFBLFdBQUEsT0FBQTtNQUNBLEtBQUE7TUFDQSxNQUFBLGFBQUEsUUFBQSxPQUFBO01BQ0EsS0FBQSxlQUFBLFVBQUEsS0FBQSxLQUFBOzs7Ozs7SUFNQSxTQUFBLFFBQUE7S0FDQSxJQUFBLFFBQUEsTUFBQSxTQUFBOztLQUVBLElBQUEsR0FBQSxNQUFBLGFBQUE7TUFDQSxRQUFBLEVBQUEsT0FBQSxHQUFBLE1BQUEsTUFBQTtNQUNBLE1BQUEsT0FBQSxDQUFBLE9BQUE7O0tBRUEsWUFBQSxLQUFBLFNBQUE7S0FDQSxXQUFBLEtBQUEsYUFBQSxlQUFBLEVBQUEsU0FBQSxNQUFBLFFBQUEsU0FBQSxJQUFBOzs7SUFHQSxTQUFBLFVBQUE7S0FDQSxJQUFBLFFBQUEsTUFBQSxTQUFBO01BQ0EsUUFBQTtNQUNBLFFBQUE7S0FDQSxJQUFBLFFBQUE7S0FDQSxHQUFBOztNQUVBLFFBQUEsUUFBQSxPQUFBLE1BQUEsVUFBQSxLQUFBLEtBQUE7T0FDQSxJQUFBLFNBQUEsSUFBQSxRQUFBLFdBQUEsU0FBQSxRQUFBO1FBQ0EsUUFBQTtRQUNBLFFBQUE7OztNQUdBO01BQ0EsUUFBQSxRQUFBLEtBQUEsUUFBQSxJQUFBLFFBQUE7Y0FDQSxDQUFBLFNBQUEsUUFBQTtLQUNBLFFBQUEsSUFBQTtLQUNBLFFBQUEsY0FBQTtLQUNBLFFBQUE7O0lBRUEsT0FBQSxPQUFBLFdBQUEsU0FBQSxFQUFBLEVBQUE7S0FDQSxHQUFBLE1BQUEsRUFBQTtNQUNBOztLQUVBLFFBQUEsT0FBQSxHQUFBLFFBQUEsRUFBQTtLQUNBLFdBQUEsSUFBQSxPQUFBO09BQ0EsT0FBQTtPQUNBLEtBQUEsTUFBQSxRQUFBLE1BQUEsSUFBQSxFQUFBO09BQ0EsS0FBQSxNQUFBO09BQ0EsS0FBQSxNQUFBO09BQ0EsS0FBQSxNQUFBO09BQ0EsS0FBQSxNQUFBO09BQ0EsS0FBQSxnQkFBQTtLQUNBLFFBQUEsUUFBQSxRQUFBLFFBQUEsVUFBQSxPQUFBO01BQ0EsU0FBQSxPQUFBO1FBQ0EsS0FBQSxVQUFBLE1BQUEsV0FBQTtRQUNBLEtBQUEsY0FBQSxNQUFBO1FBQ0EsS0FBQSxnQkFBQSxNQUFBOztLQUVBLEtBQUEsTUFBQSxRQUFBLFVBQUEsUUFBQSxRQUFBLElBQUEsRUFBQSxNQUFBO0tBQ0EsT0FBQSxNQUFBLFFBQUEsRUFBQTtLQUNBLFlBQUEsS0FBQSxTQUFBLFFBQUEsWUFBQSxFQUFBO0tBQ0EsV0FBQSxhQUFBLFNBQUEsS0FBQSxLQUFBLFFBQUEsS0FBQSxhQUFBLGVBQUEsRUFBQSxRQUFBLFlBQUEsRUFBQSxVQUFBLE1BQUEsUUFBQSxTQUFBLElBQUE7O0lBRUEsT0FBQTtLQUNBLFlBQUE7TUFDQSxPQUFBLFFBQUE7O0tBRUEsVUFBQSxVQUFBLFVBQUE7TUFDQSxJQUFBLENBQUEsVUFBQTtPQUNBLFlBQUEsS0FBQSxTQUFBO09BQ0EsV0FBQSxLQUFBLGFBQUEsZUFBQSxFQUFBLEtBQUEsTUFBQSxRQUFBLFNBQUEsSUFBQTtPQUNBOztNQUVBLFlBQUEsS0FBQSxTQUFBLFNBQUEsUUFBQTtNQUNBLElBQUEsWUFBQSxVQUFBO09BQ0EsV0FBQSxLQUFBLGFBQUEsZUFBQSxFQUFBLFNBQUEsUUFBQSxVQUFBLE1BQUEsUUFBQSxTQUFBLElBQUE7YUFDQTtPQUNBLFdBQUEsYUFBQSxTQUFBLEtBQUEsS0FBQSxRQUFBLEtBQUEsYUFBQSxlQUFBLEVBQUEsU0FBQSxRQUFBLFVBQUEsTUFBQSxRQUFBLFNBQUEsSUFBQTs7Ozs7Ozs7Ozs7QUNqTkEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxRQUFBLG9CQUFBLFlBQUEsY0FBQSxVQUFBOzs7Ozs7QUNIQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsa0JBQUEsV0FBQSw2Q0FBQSxTQUFBLFFBQUEsVUFBQSxRQUFBOztFQUVBLE9BQUE7R0FDQSxVQUFBO0dBQ0EsYUFBQTtHQUNBLFlBQUE7R0FDQSxRQUFBO0dBQ0EsTUFBQSxVQUFBLFFBQUEsU0FBQSxRQUFBOztJQUVBLElBQUEsU0FBQTtJQUNBLElBQUEsVUFBQSxHQUFBLFdBQUEsR0FBQSxhQUFBLEdBQUE7SUFDQSxJQUFBLE9BQUE7SUFDQSxJQUFBLFdBQUE7SUFDQSxJQUFBLG1CQUFBO0lBQ0EsSUFBQSxTQUFBLFFBQUEsS0FBQTtLQUNBLElBQUEsUUFBQSxRQUFBLEtBQUE7S0FDQSxJQUFBLGFBQUE7S0FDQSxJQUFBLE1BQUE7S0FDQSxJQUFBLFVBQUE7S0FDQSxNQUFBLElBQUEsRUFBQSxRQUFBO0tBQ0EsT0FBQSxLQUFBLFNBQUEsV0FBQTtPQUNBLE1BQUEsR0FBQTs7S0FFQSxNQUFBLEtBQUEsU0FBQSxTQUFBLEVBQUE7TUFDQSxhQUFBO01BQ0EsTUFBQTtNQUNBLFVBQUE7TUFDQSxTQUFBO01BQ0EsVUFBQSxHQUFBLFdBQUEsR0FBQSxhQUFBLEdBQUE7TUFDQSxPQUFBO01BQ0EsV0FBQTtPQUNBLFNBQUEsVUFBQTtRQUNBLEtBQUEsTUFBQSxNQUFBLEdBQUEsTUFBQSxHQUFBO1NBQ0EsZ0JBQUE7U0FDQSxPQUFBO1NBQ0EsZUFBQTtTQUNBLEtBQUEsU0FBQSxJQUFBO1VBQ0EsUUFBQSxRQUFBLElBQUEsS0FBQSxJQUFBLFNBQUEsTUFBQSxJQUFBO1dBQ0EsR0FBQSxNQUFBLFNBQUEsT0FBQSxHQUFBO1lBQ0EsR0FBQSxLQUFBLFdBQUEsaUJBQUEsUUFBQSxPQUFBLEtBQUEsS0FBQSxXQUFBLGNBQUEsUUFBQSxTQUFBLENBQUEsRUFBQTthQUNBLElBQUEsT0FBQSxLQUFBO2NBQ0EsS0FBQTtjQUNBLFFBQUE7Y0FDQSxRQUFBOzthQUVBOzs7O1VBSUEsR0FBQSxXQUFBO1dBQ0EsUUFBQSxRQUFBLElBQUEsS0FBQSxJQUFBLFNBQUEsTUFBQSxJQUFBO1lBQ0EsR0FBQSxJQUFBLFVBQUEsRUFBQTthQUNBLEdBQUEsT0FBQSxRQUFBLEtBQUEsUUFBQSxZQUFBO2VBQ0EsUUFBQSxLQUFBLE9BQUE7O2FBRUEsUUFBQSxLQUFBLEtBQUEsS0FBQTs7Ozs7Y0FLQTtXQUNBLE9BQUEsR0FBQSxLQUFBLEtBQUE7Ozs7U0FJQSxrQkFBQSxTQUFBO1NBQ0E7O1VBRUEsSUFBQSxRQUFBLE1BQUEsT0FBQSxlQUFBO1lBQ0EsSUFBQSxXQUFBLE1BQUEsT0FBQSxHQUFBLE9BQUEsT0FBQTtVQUNBLElBQUEsUUFBQTtVQUNBLElBQUEsSUFBQSxJQUFBLEdBQUEsS0FBQSxTQUFBLFFBQUEsSUFBQTtXQUNBLEdBQUEsU0FBQSxHQUFBO1lBQ0EsU0FBQSxLQUFBLFNBQUEsR0FBQSxRQUFBLGNBQUEsS0FBQTtZQUNBLEdBQUEsU0FBQSxHQUFBLFFBQUEsT0FBQSxDQUFBLEVBQUE7YUFDQSxTQUFBLEtBQUEsU0FBQSxHQUFBLE9BQUEsR0FBQSxTQUFBLEdBQUEsUUFBQTs7WUFFQSxHQUFBLFNBQUEsR0FBQSxVQUFBLEVBQUE7YUFDQSxNQUFBLEtBQUE7Ozs7VUFJQSxHQUFBLFNBQUEsVUFBQSxNQUFBLE9BQUE7V0FDQSxhQUFBO1lBQ0EsSUFBQSxJQUFBLElBQUEsR0FBQSxLQUFBLFNBQUEsUUFBQSxJQUFBO2FBQ0EsR0FBQSxPQUFBLFFBQUEsU0FBQSxPQUFBLFlBQUE7Y0FDQSxRQUFBLFNBQUEsTUFBQTs7YUFFQSxRQUFBLFNBQUEsSUFBQSxPQUFBOzs7WUFHQSxPQUFBLFNBQUEsU0FBQSxNQUFBLE9BQUE7O1NBRUEsT0FBQSxTQUFBLEtBQUE7U0FDQTtVQUNBLGFBQUEsTUFBQTs7U0FFQSxVQUFBLFNBQUE7U0FDQTtVQUNBLE9BQUEsR0FBQSxTQUFBOzs7VUFHQSxHQUFBLENBQUEsV0FBQTtXQUNBLFFBQUEsUUFBQSxPQUFBLEdBQUEsS0FBQSxHQUFBLEtBQUEsSUFBQSxTQUFBLE1BQUEsSUFBQTtZQUNBLEdBQUEsSUFBQSxjQUFBLFFBQUEsVUFBQSxDQUFBLEtBQUEsSUFBQSxjQUFBLFFBQUEsV0FBQSxDQUFBLEVBQUE7YUFDQSxPQUFBLEdBQUEsS0FBQSxZQUFBOzthQUVBLEdBQUEsSUFBQSxjQUFBLFFBQUEsY0FBQSxDQUFBLEVBQUE7Y0FDQSxPQUFBLEdBQUEsS0FBQSxnQkFBQTs7OztjQUlBO1dBQ0EsUUFBQSxRQUFBLFNBQUEsU0FBQSxLQUFBLElBQUE7WUFDQSxLQUFBLFNBQUE7WUFDQSxHQUFBLElBQUEsaUJBQUEsZUFBQSxPQUFBLE9BQUEsWUFBQTthQUNBLElBQUEsSUFBQSxDQUFBLElBQUEsSUFBQTthQUNBLFFBQUEsUUFBQSxLQUFBLE1BQUEsU0FBQSxRQUFBLEVBQUE7Y0FDQSxFQUFBLFVBQUEsS0FBQTtjQUNBLEdBQUEsTUFBQSxXQUFBLFNBQUEsR0FBQTtlQUNBLEdBQUEsT0FBQSxXQUFBLGlCQUFBLFFBQUEsU0FBQSxLQUFBLE9BQUEsV0FBQSxjQUFBLFFBQUEsU0FBQSxDQUFBLEVBQUE7Z0JBQ0EsS0FBQSxPQUFBLEtBQUE7aUJBQ0EsS0FBQTtpQkFDQSxRQUFBO2lCQUNBLFFBQUE7O2dCQUVBOzs7O2FBSUEsT0FBQSxHQUFBLEtBQUEsS0FBQSxDQUFBLEtBQUEsQ0FBQSxJQUFBLE9BQUEsS0FBQTs7O1dBR0EsT0FBQSxHQUFBLEtBQUEsWUFBQTs7O1VBR0EsT0FBQSxHQUFBO1VBQ0EsT0FBQSxLQUFBLE9BQUEsR0FBQSxLQUFBLE9BQUEsb0JBQUE7Ozs7Ozs7Ozs7Ozs7QUM1SUEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxRQUFBLG9CQUFBLFlBQUEsZ0JBQUEsVUFBQTs7Ozs7OztBQ0hBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxrQkFBQSxXQUFBLG1CQUFBLFdBQUE7RUFDQSxJQUFBLFdBQUEsVUFBQTtHQUNBLE9BQUE7SUFDQSxPQUFBOzs7RUFHQSxPQUFBO0dBQ0EsVUFBQTtHQUNBLE1BQUE7SUFDQSxLQUFBO0lBQ0EsVUFBQTtJQUNBLFFBQUE7O0dBRUEsYUFBQTtHQUNBLFlBQUE7R0FDQSxNQUFBLFVBQUEsUUFBQSxTQUFBLFFBQUE7SUFDQSxPQUFBLFVBQUEsUUFBQSxPQUFBLFlBQUEsT0FBQTtJQUNBLE9BQUE7SUFDQSxPQUFBOzs7Ozs7OztBQ3JCQSxDQUFBLFlBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSxrQ0FBQSxVQUFBLFFBQUE7RUFDQSxPQUFBLFNBQUE7R0FDQSxTQUFBO0dBQ0EsVUFBQTtHQUNBLFVBQUE7R0FDQSxhQUFBO0dBQ0EsaUJBQUE7R0FDQSxrQkFBQTtHQUNBLGVBQUE7R0FDQSxpQkFBQTtHQUNBLFVBQUE7O0VBRUEsT0FBQSxRQUFBO0dBQ0EsU0FBQTtJQUNBLE9BQUE7O0dBRUEsTUFBQTs7RUFFQSxPQUFBLFdBQUEsWUFBQTtHQUNBLE9BQUEsTUFBQSxRQUFBLFFBQUE7SUFDQSxNQUFBO0lBQ0EsZ0JBQUE7SUFDQSxRQUFBO0tBQ0EsS0FBQTtLQUNBLE9BQUE7S0FDQSxRQUFBO0tBQ0EsTUFBQTs7SUFFQSxHQUFBLFVBQUEsR0FBQTtLQUNBLE9BQUEsRUFBQTs7SUFFQSxHQUFBLFVBQUEsR0FBQTtLQUNBLE9BQUEsRUFBQTs7SUFFQSxZQUFBO0lBQ0EsWUFBQTtJQUNBLFdBQUE7SUFDQSxvQkFBQTtJQUNBLHlCQUFBOzs7SUFHQSxPQUFBO0tBQ0EsV0FBQTs7SUFFQSxPQUFBO0tBQ0EsV0FBQTtLQUNBLG1CQUFBOztJQUVBLFFBQUE7S0FDQSxZQUFBOztJQUVBLE9BQUE7S0FDQSxhQUFBOzs7O0dBSUEsSUFBQSxPQUFBLFFBQUEsVUFBQSxNQUFBO0lBQ0EsT0FBQSxNQUFBLFFBQUEsTUFBQSxVQUFBLENBQUEsU0FBQSxPQUFBLE1BQUEsTUFBQSxPQUFBLE1BQUE7O0dBRUEsT0FBQSxPQUFBOztFQUVBLE9BQUEsaUJBQUEsWUFBQTtHQUNBLElBQUEsWUFBQTtHQUNBLE9BQUEsUUFBQTtJQUNBLEtBQUE7SUFDQSxLQUFBOztHQUVBLFFBQUEsUUFBQSxPQUFBLFdBQUEsVUFBQSxNQUFBLEtBQUE7SUFDQSxJQUFBLFFBQUE7S0FDQSxJQUFBO0tBQ0EsS0FBQSxLQUFBO0tBQ0EsT0FBQSxLQUFBO0tBQ0EsUUFBQTs7SUFFQSxRQUFBLFFBQUEsT0FBQSxNQUFBLFVBQUEsTUFBQSxHQUFBO0tBQ0EsTUFBQSxPQUFBLEtBQUE7TUFDQSxJQUFBO01BQ0EsR0FBQSxLQUFBLEtBQUEsT0FBQTtNQUNBLEdBQUEsS0FBQSxLQUFBLE9BQUE7O0tBRUEsT0FBQSxNQUFBLE1BQUEsS0FBQSxJQUFBLE9BQUEsTUFBQSxLQUFBLEtBQUEsS0FBQSxPQUFBO0tBQ0EsT0FBQSxNQUFBLE1BQUEsS0FBQSxJQUFBLE9BQUEsTUFBQSxLQUFBLEtBQUEsS0FBQSxPQUFBOztJQUVBLFVBQUEsS0FBQTs7O0dBR0EsT0FBQSxNQUFBLE9BQUE7R0FDQSxJQUFBLE9BQUEsUUFBQSxVQUFBLFFBQUE7SUFDQSxPQUFBLE1BQUEsUUFBQSxNQUFBLFVBQUEsQ0FBQSxTQUFBLE9BQUEsTUFBQSxNQUFBLE9BQUEsTUFBQTs7O0VBR0EsT0FBQSxPQUFBLFFBQUEsVUFBQSxHQUFBLEdBQUE7R0FDQSxJQUFBLENBQUEsR0FBQTtJQUNBOztHQUVBLE9BQUE7O0VBRUEsT0FBQSxPQUFBLGFBQUEsVUFBQSxHQUFBLEdBQUE7R0FDQSxJQUFBLE1BQUEsR0FBQTtJQUNBOztHQUVBLE9BQUE7Ozs7OztBQ3hHQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsa0JBQUEsVUFBQSxpQkFBQSxDQUFBLGVBQUEsU0FBQSxhQUFBOztFQUVBLElBQUEsU0FBQTtRQUNBLElBQUEsU0FBQTs7UUFFQSxTQUFBLE1BQUEsSUFBQTtZQUNBLElBQUEsS0FBQSxHQUFBLEdBQUEsYUFBQTtZQUNBLElBQUEsQ0FBQSxJQUFBO2dCQUNBLEtBQUEsRUFBQTtnQkFDQSxHQUFBLEdBQUEsYUFBQSxxQkFBQTs7WUFFQSxPQUFBOztRQUVBLFNBQUEsU0FBQSxJQUFBO1lBQ0EsSUFBQSxRQUFBLE9BQUE7WUFDQSxJQUFBLENBQUEsT0FBQTtnQkFDQSxRQUFBO2dCQUNBLE9BQUEsTUFBQTs7WUFFQSxPQUFBOzs7UUFHQSxTQUFBLGVBQUEsU0FBQSxPQUFBLFVBQUEsU0FBQSxRQUFBO1lBQ0EsT0FBQSxXQUFBO2dCQUNBLE1BQUEsWUFBQTtnQkFDQSxNQUFBLFdBQUE7Z0JBQ0EsTUFBQSxTQUFBO2dCQUNBLFNBQUEsUUFBQSxRQUFBLFdBQUE7b0JBQ0EsSUFBQSxXQUFBLE1BQUEsV0FBQSxRQUFBO3dCQUNBLFFBQUEsR0FBQSxNQUFBLFNBQUE7O29CQUVBLE1BQUEsWUFBQTtvQkFDQSxNQUFBLFdBQUE7b0JBQ0EsTUFBQTs7Ozs7UUFLQSxPQUFBO1lBQ0EsT0FBQSxTQUFBLFNBQUEsUUFBQTs7b0JBRUEsSUFBQSxRQUFBLFNBQUEsTUFBQTtvQkFDQSxJQUFBLFNBQUEsQ0FBQSxNQUFBLGFBQUEsTUFBQTt3QkFDQSxNQUFBLFNBQUEsUUFBQSxHQUFBO29CQUNBLElBQUEsV0FBQSxZQUFBLFNBQUE7d0JBQ0EsTUFBQSxDQUFBLFFBQUEsU0FBQSxNQUFBLFNBQUE7d0JBQ0EsSUFBQSxDQUFBLFFBQUEsT0FBQSxTQUFBOztvQkFFQSxJQUFBLFVBQUE7d0JBQ0EsSUFBQSxNQUFBLFdBQUE7NEJBQ0EsTUFBQTs4QkFDQSxlQUFBOzZDQUNBOzZDQUNBOzZDQUNBOzZDQUNBOzRCQUNBLE9BQUEsTUFBQSxTQUFBOzs2QkFFQTs0QkFDQSxNQUFBLFNBQUE7NEJBQ0EsT0FBQSxlQUFBO2tEQUNBO2tEQUNBO2tEQUNBO2tEQUNBOzs7O2dCQUlBOztZQUVBLE9BQUEsU0FBQSxTQUFBLFFBQUE7O29CQUVBLElBQUEsUUFBQSxTQUFBLE1BQUE7b0JBQ0EsSUFBQSxTQUFBLENBQUEsTUFBQSxhQUFBLE1BQUE7d0JBQ0EsTUFBQSxTQUFBLFFBQUEsR0FBQTs7b0JBRUEsSUFBQSxXQUFBLFlBQUEsU0FBQTt3QkFDQSxNQUFBLENBQUEsUUFBQSxPQUFBLFNBQUE7d0JBQ0EsSUFBQSxDQUFBLFFBQUEsU0FBQSxNQUFBLFNBQUE7O29CQUVBLElBQUEsVUFBQTt3QkFDQSxJQUFBLE1BQUEsV0FBQTs0QkFDQSxNQUFBLFNBQUEsZUFBQTswREFDQTswREFDQTswREFDQTswREFDQTs0QkFDQSxPQUFBLE1BQUEsU0FBQTs7NkJBRUE7NEJBQ0EsTUFBQSxTQUFBOzRCQUNBLE9BQUEsZUFBQTtrREFDQTtrREFDQTtrREFDQTtrREFDQTs7OztnQkFJQTs7Ozs7O0FDdEdBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsUUFBQSxvQkFBQSxZQUFBLG1CQUFBLFVBQUE7Ozs7OztBQ0hBLENBQUEsWUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxrQkFBQSxVQUFBLFlBQUE7O0NBRUEsU0FBQSxVQUFBLENBQUEsWUFBQTs7Q0FFQSxTQUFBLFNBQUEsVUFBQSxjQUFBO0VBQ0EsT0FBQTtHQUNBLFVBQUE7R0FDQSxTQUFBO0dBQ0EsWUFBQTtHQUNBLGFBQUE7R0FDQSxNQUFBOzs7RUFHQSxTQUFBLHFCQUFBLFFBQUEsU0FBQSxRQUFBOzs7OztBQ2hCQSxDQUFBLFdBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSxrREFBQSxTQUFBLFFBQUEsU0FBQSxVQUFBO0VBQ0EsT0FBQSxPQUFBO0VBQ0EsT0FBQSxXQUFBO0VBQ0EsT0FBQSxpQkFBQTtFQUNBLE9BQUEsZ0JBQUE7RUFDQSxPQUFBLGNBQUE7RUFDQSxPQUFBLGFBQUE7RUFDQSxPQUFBLGdCQUFBO0VBQ0EsT0FBQSxhQUFBO0VBQ0E7O0VBRUEsU0FBQSxXQUFBO0dBQ0EsT0FBQTtHQUNBLE9BQUE7R0FDQSxPQUFBO0dBQ0EsT0FBQTtHQUNBLE9BQUE7R0FDQSxPQUFBLE9BQUEsdUJBQUEsU0FBQSxTQUFBLFNBQUE7SUFDQSxJQUFBLFlBQUEsU0FBQTtLQUNBLE9BQUE7O0lBRUEsT0FBQTtJQUNBLE9BQUE7SUFDQSxPQUFBO0lBQ0EsT0FBQTs7R0FFQSxPQUFBLE9BQUEsV0FBQSxTQUFBLEdBQUEsR0FBQTtJQUNBLElBQUEsTUFBQSxHQUFBO0tBQ0E7O0lBRUEsT0FBQTs7OztFQUlBLFNBQUEsYUFBQTtHQUNBLE9BQUEsT0FBQSxDQUFBLE9BQUE7R0FDQTs7RUFFQSxTQUFBLGNBQUE7R0FDQSxJQUFBLE9BQUE7R0FDQSxRQUFBLFFBQUEsT0FBQSxNQUFBLFNBQUEsTUFBQTtJQUNBLEtBQUEsT0FBQSxRQUFBLFlBQUEsUUFBQSxXQUFBLEtBQUEsT0FBQSxRQUFBLFlBQUE7SUFDQSxLQUFBLFdBQUEsU0FBQSxLQUFBOztHQUVBLElBQUEsU0FBQSxRQUFBLFdBQUEsT0FBQSxLQUFBLENBQUEsT0FBQSxRQUFBLFlBQUEsTUFBQSxVQUFBO0dBQ0EsS0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLE9BQUEsUUFBQSxLQUFBO0lBQ0EsSUFBQSxPQUFBLEdBQUEsT0FBQSxPQUFBLFFBQUEsS0FBQTtLQUNBLE9BQUEsSUFBQTs7O0dBR0EsT0FBQSxRQUFBLE9BQUEsUUFBQSxZQUFBLEtBQUEsV0FBQTs7RUFFQSxTQUFBLFdBQUEsUUFBQTtHQUNBLElBQUEsU0FBQSxRQUFBLFdBQUEsT0FBQSxLQUFBLENBQUEsT0FBQSxRQUFBLFlBQUEsTUFBQSxVQUFBO0dBQ0EsSUFBQSxPQUFBO0dBQ0EsUUFBQSxRQUFBLFFBQUEsU0FBQSxNQUFBLElBQUE7SUFDQSxHQUFBLEtBQUEsV0FBQSxRQUFBLFFBQUE7S0FDQSxPQUFBOzs7R0FHQSxPQUFBLEtBQUE7O0VBRUEsU0FBQSxnQkFBQTtHQUNBLE9BQUEsVUFBQSxDQUFBLE9BQUEsUUFBQSxRQUFBLFlBQUE7OztFQUdBLFNBQUEsZ0JBQUE7R0FDQSxPQUFBLGdCQUFBO0lBQ0EsT0FBQSxPQUFBLFFBQUEsUUFBQSxZQUFBO0lBQ0EsT0FBQSxPQUFBLFFBQUEsUUFBQSxZQUFBO0lBQ0EsVUFBQTtJQUNBLE9BQUE7S0FDQSxLQUFBOzs7R0FHQSxPQUFBLG1CQUFBO0lBQ0EsT0FBQSxPQUFBLFFBQUEsUUFBQSxZQUFBO0lBQ0EsT0FBQSxPQUFBLFFBQUEsUUFBQSxZQUFBO0lBQ0EsVUFBQTtJQUNBLE9BQUE7S0FDQSxLQUFBOzs7OztFQUtBLFNBQUEsV0FBQTtHQUNBLE9BQUEsUUFBQTtJQUNBLFNBQUE7S0FDQSxPQUFBO01BQ0EsTUFBQTs7TUFFQSxnQkFBQTtNQUNBLFFBQUE7T0FDQSxLQUFBO09BQ0EsT0FBQTtPQUNBLFFBQUE7T0FDQSxNQUFBOztNQUVBLEdBQUEsU0FBQSxHQUFBO09BQ0EsT0FBQSxFQUFBOztNQUVBLEdBQUEsU0FBQSxHQUFBO09BQ0EsT0FBQSxFQUFBOztNQUVBLFlBQUE7TUFDQSxXQUFBO01BQ0Esb0JBQUE7TUFDQSx5QkFBQTtNQUNBLFFBQUEsQ0FBQSxLQUFBO01BQ0EsT0FBQTtPQUNBLFdBQUE7O01BRUEsT0FBQTtPQUNBLFdBQUE7T0FDQSxtQkFBQTs7TUFFQSxRQUFBO09BQ0EsWUFBQTtPQUNBLFFBQUE7UUFDQSxRQUFBOzs7TUFHQSxPQUFBO09BQ0EsYUFBQTs7OztJQUlBLE1BQUE7O0dBRUEsT0FBQSxPQUFBOzs7RUFHQSxTQUFBLGlCQUFBO0dBQ0EsSUFBQSxZQUFBO0dBQ0EsUUFBQSxRQUFBLE9BQUEsUUFBQSxZQUFBLFVBQUEsU0FBQSxNQUFBLEtBQUE7SUFDQSxJQUFBLFFBQUE7S0FDQSxLQUFBLEtBQUE7S0FDQSxPQUFBLEtBQUE7S0FDQSxRQUFBOztJQUVBLFFBQUEsUUFBQSxPQUFBLFFBQUEsS0FBQSxTQUFBLE1BQUE7S0FDQSxNQUFBLE9BQUEsS0FBQTtNQUNBLEdBQUEsS0FBQTtNQUNBLEdBQUEsS0FBQSxLQUFBOzs7SUFHQSxVQUFBLEtBQUE7O0dBRUEsT0FBQSxNQUFBLE9BQUE7Ozs7OztBQ3ZKQSxDQUFBLFlBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsa0JBQUEsVUFBQSxZQUFBLFlBQUE7RUFDQSxJQUFBLFdBQUEsVUFBQTtJQUNBLE9BQUE7TUFDQSxNQUFBOzs7RUFHQSxPQUFBO0dBQ0EsVUFBQTs7R0FFQSxZQUFBO0dBQ0EsT0FBQTtJQUNBLE1BQUE7O0dBRUEsTUFBQSxVQUFBLFFBQUEsU0FBQSxRQUFBO0lBQ0EsSUFBQSxVQUFBLFFBQUEsT0FBQSxZQUFBO0lBQ0EsT0FBQTtJQUNBLE9BQUE7SUFDQSxJQUFBLFFBQUE7S0FDQSxTQUFBO0tBQ0EsU0FBQSxDQUFBLFNBQUE7S0FDQSxJQUFBLEdBQUEsTUFBQSxTQUFBLE1BQUEsQ0FBQSxHQUFBLElBQUEsS0FBQTtLQUNBLElBQUEsR0FBQSxNQUFBLE1BQUEsU0FBQSxLQUFBLE9BQUEsQ0FBQSxHQUFBLElBQUEsTUFBQSxDQUFBLEdBQUE7OztLQUdBLFVBQUE7S0FDQSxXQUFBO0tBQ0EsY0FBQTs7SUFFQSxJQUFBLE1BQUEsR0FBQSxPQUFBLFFBQUE7OztJQUdBLElBQUEsTUFBQSxJQUFBLE9BQUE7TUFDQSxLQUFBLFNBQUEsUUFBQSxVQUFBO01BQ0EsS0FBQSxVQUFBLFNBQUEsVUFBQTtNQUNBLE9BQUE7TUFDQSxLQUFBLGFBQUEsZUFBQSxDQUFBLFNBQUEsU0FBQSxTQUFBLFdBQUE7Ozs7Ozs7O0lBUUEsSUFBQSxZQUFBLEdBQUEsT0FBQTtNQUNBLEtBQUE7TUFDQSxNQUFBLFVBQUEsR0FBQTtNQUNBLE9BQUE7OztJQUdBLElBQUEsTUFBQSxHQUFBLElBQUE7TUFDQSxXQUFBLFVBQUEsR0FBQTtNQUNBLE9BQUEsS0FBQSxJQUFBLEdBQUEsS0FBQSxJQUFBLElBQUEsS0FBQSxJQUFBLEVBQUEsRUFBQTs7TUFFQSxTQUFBLFVBQUEsR0FBQTtNQUNBLE9BQUEsS0FBQSxJQUFBLEdBQUEsS0FBQSxJQUFBLElBQUEsS0FBQSxJQUFBLEVBQUEsRUFBQSxJQUFBLEVBQUE7O01BRUEsWUFBQSxVQUFBLEdBQUE7TUFDQSxPQUFBLEtBQUEsSUFBQSxHQUFBLEVBQUEsSUFBQSxFQUFBLEVBQUEsS0FBQSxFQUFBOztNQUVBLFlBQUEsVUFBQSxHQUFBO01BQ0EsT0FBQSxLQUFBLElBQUEsR0FBQSxFQUFBLEVBQUEsSUFBQSxFQUFBOzs7SUFHQSxJQUFBLFdBQUE7S0FDQSxXQUFBO0tBQ0EsV0FBQTtLQUNBLFdBQUE7OztJQUdBLElBQUEsUUFBQSxVQUFBLE1BQUEsT0FBQTs7SUFFQSxJQUFBLE9BQUEsSUFBQSxVQUFBLFFBQUEsS0FBQTtJQUNBLEtBQUEsUUFBQSxPQUFBO01BQ0EsS0FBQSxNQUFBLFVBQUEsR0FBQSxHQUFBO01BQ0EsT0FBQSxVQUFBOztNQUVBLEtBQUEsS0FBQTtNQUNBLEtBQUEsYUFBQTtNQUNBLEtBQUEsU0FBQSxVQUFBLEdBQUE7TUFDQSxPQUFBLEVBQUEsUUFBQSxXQUFBOztNQUVBLE1BQUEsUUFBQTtNQUNBLEdBQUEsU0FBQTs7SUFFQSxJQUFBLE9BQUEsSUFBQSxVQUFBLFFBQUEsS0FBQTtJQUNBLElBQUEsWUFBQSxLQUFBLFFBQUEsT0FBQTtNQUNBLE1BQUEsZ0JBQUE7TUFDQSxLQUFBLGVBQUEsVUFBQSxHQUFBO01BQ0EsSUFBQSxFQUFBO09BQ0EsT0FBQTs7O09BR0EsT0FBQTs7TUFFQSxLQUFBLE1BQUEsVUFBQSxHQUFBO01BQ0EsT0FBQSxVQUFBLEVBQUE7O01BRUEsS0FBQSxTQUFBLFVBQUEsR0FBQTtNQUNBLE9BQUE7O01BRUEsS0FBQSxNQUFBLFVBQUEsR0FBQTtNQUNBLE9BQUEsRUFBQSxRQUFBLFNBQUE7O01BRUEsS0FBQSxhQUFBLFVBQUEsR0FBQTtNQUNBLElBQUEsWUFBQSxDQUFBLEVBQUEsUUFBQSxJQUFBLE1BQUEsS0FBQSxTQUFBO09BQ0EsY0FBQSxFQUFBLElBQUEsTUFBQSxJQUFBLENBQUE7T0FDQSxRQUFBLEVBQUEsRUFBQSxJQUFBLEVBQUEsS0FBQSxLQUFBLE1BQUEsS0FBQSxLQUFBLE1BQUEsWUFBQSxhQUFBO09BQ0EsU0FBQSxTQUFBLFlBQUEsQ0FBQSxLQUFBO09BQ0EsU0FBQSxDQUFBLEVBQUEsRUFBQSxLQUFBLGVBQUE7T0FDQSxZQUFBLFFBQUEsS0FBQSxDQUFBLE1BQUE7TUFDQSxJQUFBLEVBQUEsUUFBQSxZQUFBLEVBQUEsUUFBQSxVQUFBLFVBQUE7TUFDQSxJQUFBLEVBQUEsU0FBQSxHQUFBO09BQ0EsU0FBQSxDQUFBO09BQ0EsU0FBQTtPQUNBLFdBQUE7YUFDQSxJQUFBLEVBQUEsU0FBQSxHQUFBLFVBQUEsQ0FBQTtXQUNBLElBQUEsRUFBQSxTQUFBLEdBQUEsVUFBQSxDQUFBO1dBQ0EsSUFBQSxFQUFBLFNBQUEsR0FBQSxVQUFBO01BQ0EsT0FBQSxZQUFBLFNBQUEsZ0JBQUEsU0FBQSxhQUFBLFdBQUE7O01BRUEsR0FBQSxTQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBK0JBLFVBQUEsT0FBQTtNQUNBLEtBQUEsS0FBQTtNQUNBLEtBQUEsVUFBQSxHQUFBOztNQUVBLElBQUEsRUFBQSxTQUFBLEtBQUEsRUFBQSxRQUFBLFlBQUEsRUFBQSxRQUFBLFlBQUEsRUFBQSxRQUFBLFlBQUEsRUFBQSxRQUFBO09BQ0EsT0FBQSxFQUFBLEtBQUEsTUFBQSxLQUFBLEtBQUEsT0FBQSxFQUFBLEtBQUEsTUFBQSxLQUFBLE1BQUE7O09BRUEsT0FBQSxFQUFBLEtBQUEsTUFBQSxLQUFBOztJQUVBLFVBQUEsT0FBQTtNQUNBLEtBQUEsS0FBQTtNQUNBLEtBQUEsTUFBQTtNQUNBLEtBQUEsVUFBQSxHQUFBOztNQUVBLElBQUEsRUFBQSxTQUFBLEtBQUEsRUFBQSxRQUFBLFlBQUEsRUFBQSxRQUFBLFlBQUEsRUFBQSxRQUFBLFlBQUEsRUFBQSxRQUFBO09BQ0EsT0FBQSxDQUFBLEVBQUEsS0FBQSxNQUFBLEtBQUEsTUFBQSxNQUFBLE9BQUEsRUFBQSxLQUFBLE1BQUEsS0FBQSxNQUFBOztPQUVBLE9BQUEsQ0FBQSxFQUFBLEtBQUEsTUFBQSxLQUFBLE1BQUEsTUFBQSxPQUFBLEVBQUEsS0FBQSxNQUFBLEtBQUEsTUFBQTs7SUFFQSxVQUFBLE9BQUE7TUFDQSxLQUFBLEtBQUE7TUFDQSxLQUFBLE1BQUE7TUFDQSxLQUFBLFVBQUEsR0FBQTtNQUNBLElBQUEsRUFBQSxTQUFBLEtBQUEsRUFBQSxRQUFBLFlBQUEsRUFBQSxRQUFBLFlBQUEsRUFBQSxRQUFBLFlBQUEsRUFBQSxRQUFBO09BQ0EsT0FBQSxDQUFBLEVBQUEsS0FBQSxNQUFBLEtBQUEsTUFBQSxNQUFBLE9BQUEsRUFBQSxLQUFBLE1BQUEsS0FBQSxNQUFBOztPQUVBLE9BQUEsQ0FBQSxFQUFBLEtBQUEsTUFBQSxLQUFBLE1BQUEsTUFBQSxPQUFBLEVBQUEsS0FBQSxNQUFBLEtBQUEsTUFBQSxJQUFBOzs7SUFHQSxTQUFBLE1BQUEsR0FBQTs7S0FFQSxLQUFBO09BQ0EsU0FBQTtPQUNBLFVBQUEsS0FBQSxTQUFBOzs7O0tBSUEsS0FBQSxNQUFBLGNBQUEsVUFBQSxHQUFBO09BQ0EsT0FBQSxXQUFBLEdBQUEsS0FBQSxPQUFBLEdBQUEsT0FBQSxNQUFBLE1BQUE7O09BRUE7T0FDQSxTQUFBO09BQ0EsVUFBQSxlQUFBLFVBQUEsR0FBQTtPQUNBLE9BQUEsWUFBQTtRQUNBLElBQUEsRUFBQTtTQUNBLE9BQUE7OztTQUdBLE9BQUE7OztPQUdBLFVBQUEsYUFBQSxVQUFBLEdBQUE7T0FDQSxJQUFBLFlBQUEsQ0FBQSxFQUFBLFFBQUEsSUFBQSxNQUFBLEtBQUEsU0FBQTtPQUNBLE9BQUEsWUFBQTtRQUNBLElBQUEsWUFBQSxDQUFBLEVBQUEsUUFBQSxJQUFBLE1BQUEsS0FBQSxTQUFBO1NBQ0EsY0FBQSxFQUFBLElBQUEsTUFBQSxJQUFBLENBQUE7U0FDQSxRQUFBLEVBQUEsRUFBQSxJQUFBLEVBQUEsS0FBQSxLQUFBLE1BQUEsS0FBQSxLQUFBLE1BQUEsWUFBQSxhQUFBO1NBQ0EsU0FBQSxTQUFBLFlBQUEsQ0FBQSxLQUFBO1NBQ0EsU0FBQSxDQUFBLEVBQUEsRUFBQSxLQUFBLGVBQUE7U0FDQSxZQUFBLFFBQUEsS0FBQSxDQUFBLE1BQUE7UUFDQSxJQUFBLEVBQUEsUUFBQSxZQUFBLEVBQUEsUUFBQSxVQUFBLFVBQUE7UUFDQSxJQUFBLEVBQUEsU0FBQSxHQUFBO1NBQ0EsU0FBQSxDQUFBO1NBQ0EsU0FBQTtTQUNBLFdBQUE7ZUFDQSxJQUFBLEVBQUEsU0FBQSxHQUFBLFVBQUEsQ0FBQTthQUNBLElBQUEsRUFBQSxTQUFBLEdBQUEsVUFBQSxDQUFBO2FBQ0EsSUFBQSxFQUFBLFNBQUEsR0FBQSxVQUFBO1FBQ0EsT0FBQSxZQUFBLFNBQUEsZ0JBQUEsU0FBQSxhQUFBLFdBQUE7OztPQUdBLE1BQUEsZ0JBQUEsVUFBQSxHQUFBO09BQ0EsT0FBQSxXQUFBLEdBQUEsS0FBQSxJQUFBOztPQUVBLEtBQUEsT0FBQSxVQUFBLEdBQUE7T0FDQSxHQUFBLE9BQUEsTUFBQSxNQUFBLGNBQUEsV0FBQSxHQUFBLEtBQUEsT0FBQTs7Ozs7SUFLQSxTQUFBLFdBQUEsR0FBQSxHQUFBO0tBQ0EsSUFBQSxNQUFBLEdBQUEsT0FBQTtLQUNBLElBQUEsRUFBQSxVQUFBO01BQ0EsT0FBQSxFQUFBLFNBQUEsS0FBQSxVQUFBLEdBQUE7T0FDQSxPQUFBLFdBQUEsR0FBQTs7O0tBR0EsT0FBQTs7O0lBR0EsU0FBQSxTQUFBLEdBQUE7S0FDQSxPQUFBLEVBQUE7S0FDQSxJQUFBLEVBQUE7TUFDQSxPQUFBLEVBQUE7VUFDQTtNQUNBLElBQUEsWUFBQTs7TUFFQSxJQUFBLElBQUE7TUFDQSxPQUFBLEVBQUEsT0FBQSxTQUFBLE1BQUE7T0FDQTtNQUNBLElBQUEsYUFBQSxDQUFBLGFBQUEsSUFBQSxJQUFBO01BQ0EsT0FBQSxPQUFBLE1BQUEsRUFBQSxPQUFBLE9BQUEsS0FBQSxZQUFBLEtBQUE7Ozs7O0lBS0EsU0FBQSxTQUFBLEdBQUE7S0FDQSxJQUFBLEtBQUEsS0FBQTtNQUNBLEtBQUEsR0FBQSxZQUFBLEVBQUEsVUFBQSxDQUFBLEVBQUEsR0FBQSxFQUFBLElBQUEsRUFBQSxLQUFBO01BQ0EsS0FBQSxHQUFBLFlBQUEsRUFBQSxVQUFBLENBQUEsRUFBQSxHQUFBO01BQ0EsS0FBQSxHQUFBLFlBQUEsRUFBQSxTQUFBLENBQUEsRUFBQSxJQUFBLEtBQUEsR0FBQTs7S0FFQSxPQUFBLFVBQUEsR0FBQTtNQUNBLE9BQUEsVUFBQSxHQUFBO09BQ0EsRUFBQSxPQUFBLEdBQUE7T0FDQSxFQUFBLE9BQUEsR0FBQSxJQUFBLE1BQUEsR0FBQTtPQUNBLE9BQUEsSUFBQTs7Ozs7SUFLQSxTQUFBLEtBQUEsR0FBQTtLQUNBLE9BQUEsRUFBQSxXQUFBLEtBQUEsSUFBQSxNQUFBLE1BQUEsRUFBQSxTQUFBLElBQUEsU0FBQSxFQUFBLElBQUEsRUFBQTs7Ozs7OztBQ3BSQSxDQUFBLFlBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSwyQkFBQSxVQUFBLFFBQUE7O0VBRUEsT0FBQSxXQUFBLFlBQUE7R0FDQSxPQUFBLFFBQUE7SUFDQSxTQUFBO0tBQ0EsT0FBQTtNQUNBLE1BQUE7TUFDQSxRQUFBO01BQ0EsWUFBQTtPQUNBLFlBQUE7T0FDQSxTQUFBO09BQ0EsVUFBQTtPQUNBLFFBQUE7T0FDQSxNQUFBO09BQ0EsWUFBQTtPQUNBLFVBQUE7UUFDQSxPQUFBO1FBQ0EsU0FBQTtRQUNBLFVBQUE7UUFDQSxRQUFBOzs7TUFHQSxXQUFBO09BQ0EsWUFBQTtPQUNBLFdBQUE7T0FDQSxZQUFBO09BQ0EsZ0JBQUE7T0FDQSxXQUFBO09BQ0Esa0JBQUE7T0FDQSxZQUFBO09BQ0EsV0FBQTtPQUNBLGFBQUE7T0FDQSxpQkFBQTs7T0FFQSxVQUFBO1FBQ0EsUUFBQTtRQUNBLE9BQUE7O09BRUEsVUFBQTtPQUNBLFFBQUE7T0FDQSxlQUFBO09BQ0EsTUFBQTs7OztJQUlBLE1BQUE7O0dBRUEsT0FBQSxPQUFBOztFQUVBLElBQUEsWUFBQSxVQUFBLE1BQUE7R0FDQSxJQUFBLFdBQUE7R0FDQSxRQUFBLFFBQUEsTUFBQSxVQUFBLE1BQUE7SUFDQSxJQUFBLFFBQUE7S0FDQSxRQUFBLEtBQUE7S0FDQSxRQUFBLEtBQUE7S0FDQSxTQUFBLEtBQUE7S0FDQSxZQUFBLFVBQUEsS0FBQTs7SUFFQSxHQUFBLEtBQUEsTUFBQTtLQUNBLE1BQUEsUUFBQSxLQUFBOztJQUVBLEdBQUEsS0FBQSxLQUFBO0tBQ0EsTUFBQSxPQUFBLEtBQUE7O0lBRUEsU0FBQSxLQUFBOztHQUVBLE9BQUE7O0VBRUEsT0FBQSxpQkFBQSxZQUFBO0dBQ0EsSUFBQSxZQUFBO0lBQ0EsUUFBQSxPQUFBLEtBQUE7SUFDQSxTQUFBLE9BQUEsS0FBQTtJQUNBLFlBQUEsVUFBQSxPQUFBLEtBQUE7SUFDQSxRQUFBOztHQUVBLE9BQUEsTUFBQSxPQUFBO0dBQ0EsT0FBQTs7RUFFQSxPQUFBLE9BQUEsUUFBQSxVQUFBLEdBQUEsR0FBQTtHQUNBLElBQUEsQ0FBQSxHQUFBO0lBQ0E7O0dBRUEsT0FBQTs7Ozs7QUFLQSIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0dmFyIGFwcCA9IGFuZ3VsYXIubW9kdWxlKCdhcHAnLFxuXHRcdFtcblx0XHQnYXBwLmNvbnRyb2xsZXJzJyxcblx0XHQnYXBwLmZpbHRlcnMnLFxuXHRcdCdhcHAuc2VydmljZXMnLFxuXHRcdCdhcHAuZGlyZWN0aXZlcycsXG5cdFx0J2FwcC5yb3V0ZXMnLFxuXHRcdCdhcHAuY29uZmlnJ1xuXHRcdF0pO1xuXG5cblx0XHRhbmd1bGFyLm1vZHVsZSgnYXBwLnJvdXRlcycsIFsndWkucm91dGVyJywgJ25nU3RvcmFnZScsICdzYXRlbGxpemVyJ10pO1xuXHRcdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnLCBbJ21kQ29sb3JQaWNrZXInLCduZ0FuaW1hdGUnLCd1aS50cmVlJywndG9hc3RyJywndWkucm91dGVyJywgJ21kLmRhdGEudGFibGUnLCAnbmdNYXRlcmlhbCcsICduZ1N0b3JhZ2UnLCAncmVzdGFuZ3VsYXInLCAnbmdNZEljb25zJywgJ2FuZ3VsYXItbG9hZGluZy1iYXInLCAnbmdNZXNzYWdlcycsICduZ1Nhbml0aXplJywgXCJsZWFmbGV0LWRpcmVjdGl2ZVwiLCdudmQzJ10pO1xuXHRcdGFuZ3VsYXIubW9kdWxlKCdhcHAuZmlsdGVycycsIFtdKTtcblx0XHRhbmd1bGFyLm1vZHVsZSgnYXBwLnNlcnZpY2VzJywgWyd1aS5yb3V0ZXInLCAnbmdTdG9yYWdlJywgJ3Jlc3Rhbmd1bGFyJywgJ3RvYXN0ciddKTtcblx0XHRhbmd1bGFyLm1vZHVsZSgnYXBwLmRpcmVjdGl2ZXMnLCBbJ25nTWF0ZXJpYWwnLCduZ1BhcGFQYXJzZSddKTtcblx0XHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbmZpZycsIFtdKTtcblxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAucm91dGVzJykuY29uZmlnKGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyKSB7XG5cblx0XHR2YXIgZ2V0VmlldyA9IGZ1bmN0aW9uICh2aWV3TmFtZSkge1xuXHRcdFx0cmV0dXJuICcvdmlld3MvYXBwLycgKyB2aWV3TmFtZSArICcvJyArIHZpZXdOYW1lICsgJy5odG1sJztcblx0XHR9O1xuXG5cdFx0JHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSgnLycpO1xuXG5cdFx0JHN0YXRlUHJvdmlkZXJcblx0XHRcdC5zdGF0ZSgnYXBwJywge1xuXHRcdFx0XHRhYnN0cmFjdDogdHJ1ZSxcblx0XHRcdFx0dmlld3M6IHtcblx0XHRcdFx0XHRoZWFkZXI6IHtcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdoZWFkZXInKSxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdIZWFkZXJDdHJsJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0bWFpbjoge30sXG5cdFx0XHRcdFx0J21hcEAnOiB7XG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogZ2V0VmlldygnbWFwJyksXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiAnTWFwQ3RybCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyQXM6ICd2bSdcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cdFx0XHQuc3RhdGUoJ2FwcC5ob21lJyx7XG5cdFx0XHRcdHVybDonLycsXG5cdFx0XHRcdHZpZXdzOntcblx0XHRcdFx0XHQnbWFpbkAnOntcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdob21lJyksXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiAnSG9tZUN0cmwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlckFzOiAndm0nXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdFx0LnN0YXRlKCdhcHAudXNlcicsIHtcblx0XHRcdFx0dXJsOiAnL3VzZXInLFxuXHRcdFx0XHRhYnN0cmFjdDogdHJ1ZVxuXG5cdFx0XHR9KVxuXHRcdFx0LnN0YXRlKCdhcHAudXNlci5sb2dpbicsIHtcblx0XHRcdFx0dXJsOiAnL2xvZ2luJyxcblx0XHRcdFx0dmlld3M6IHtcblx0XHRcdFx0XHQnbWFpbkAnOiB7XG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogZ2V0VmlldygnbG9naW4nKSxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdMb2dpbkN0cmwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlckFzOiAndm0nXG5cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLnVzZXIucHJvZmlsZScsIHtcblx0XHRcdFx0dXJsOiAnL215LXByb2ZpbGUnLFxuXHRcdFx0XHR2aWV3czoge1xuXHRcdFx0XHRcdCdtYWluQCc6IHtcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiBnZXRWaWV3KCd1c2VyJyksXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiAnVXNlckN0cmwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlckFzOiAndm0nLFxuXHRcdFx0XHRcdFx0cmVzb2x2ZToge1xuXHRcdFx0XHRcdFx0XHRwcm9maWxlOiBmdW5jdGlvbiAoRGF0YVNlcnZpY2UsICRhdXRoKSB7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIERhdGFTZXJ2aWNlLmdldE9uZSgnbWUnKS4kb2JqZWN0O1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdH0pXG5cdFx0XHQuc3RhdGUoJ2FwcC5pbmRleCcsIHtcblx0XHRcdFx0YWJzdHJhY3Q6IHRydWUsXG5cdFx0XHRcdHVybDogJy9pbmRleCcsXG5cdFx0XHRcdHZpZXdzOiB7XG5cdFx0XHRcdFx0J21haW5AJzoge1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6IGdldFZpZXcoJ2luZGV4JyksXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiAnSW5kZXhiYXNlQ3RybCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyQXM6ICd2bSdcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cdFx0XHQuc3RhdGUoJ2FwcC5pbmRleC5lZGl0b3InLHtcblx0XHRcdFx0dXJsOiAnL2VkaXRvcicsXG5cdFx0XHRcdHZpZXdzOntcblx0XHRcdFx0XHQnaW5mbyc6e1xuXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHQnbWVudSc6e1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6Z2V0VmlldygnaW5kZXhlZGl0b3InKSxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdJbmRleGVkaXRvckN0cmwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlckFzOiAndm0nXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdFx0LnN0YXRlKCdhcHAuaW5kZXguY3JlYXRlJywge1xuXHRcdFx0XHR1cmw6ICcvY3JlYXRlJyxcblx0XHRcdFx0dmlld3M6IHtcblx0XHRcdFx0XHQnaW5mbyc6IHtcblxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0J21lbnUnOiB7XG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogZ2V0VmlldygnaW5kZXhjcmVhdG9yJyksXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiAnSW5kZXhjcmVhdG9yQ3RybCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyQXM6ICd2bSdcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cdFx0XHQuc3RhdGUoJ2FwcC5pbmRleC5jcmVhdGUuYmFzaWMnLCB7XG5cdFx0XHRcdHVybDogJy9iYXNpYydcblx0XHRcdH0pXG5cdFx0XHQuc3RhdGUoJ2FwcC5pbmRleC5jcmVhdGUuY2hlY2snLCB7XG5cdFx0XHRcdHVybDogJy9jaGVja2luZydcblx0XHRcdH0pXG5cdFx0XHQuc3RhdGUoJ2FwcC5pbmRleC5jcmVhdGUubWV0YScsIHtcblx0XHRcdFx0dXJsOiAnL2FkZGluZy1tZXRhLWRhdGEnXG5cdFx0XHR9KVxuXHRcdFx0LnN0YXRlKCdhcHAuaW5kZXguY3JlYXRlLmZpbmFsJywge1xuXHRcdFx0XHR1cmw6ICcvYWRkaW5nLW1ldGEtZGF0YSdcblx0XHRcdH0pXG5cdFx0XHQuc3RhdGUoJ2FwcC5pbmRleC5zaG93Jywge1xuXHRcdFx0XHR1cmw6ICcvOmluZGV4Jyxcblx0XHRcdFx0dmlld3M6IHtcblx0XHRcdFx0XHQnaW5mbyc6IHtcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiAnL3ZpZXdzL2FwcC9pbmRleC9pbmZvLmh0bWwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlcjogJ0luZGV4Q3RybCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyQXM6ICd2bScsXG5cdFx0XHRcdFx0XHRyZXNvbHZlOiB7XG5cdFx0XHRcdFx0XHRcdGluaXRpYWxEYXRhOiBmdW5jdGlvbiAoRGF0YVNlcnZpY2UsICRzdGF0ZVBhcmFtcykge1xuXHRcdFx0XHRcdFx0XHRcdHZhciBkID0gRGF0YVNlcnZpY2UuZ2V0QWxsKCdpbmRleC8nICsgJHN0YXRlUGFyYW1zLmluZGV4ICsgJy95ZWFyLzIwMTQnKTtcblx0XHRcdFx0XHRcdFx0XHR2YXIgaSA9IERhdGFTZXJ2aWNlLmdldE9uZSgnaW5kZXgvJyArICRzdGF0ZVBhcmFtcy5pbmRleCArICcvc3RydWN0dXJlJyk7XG5cdFx0XHRcdFx0XHRcdFx0dmFyIGNvdW50cmllcyA9IERhdGFTZXJ2aWNlLmdldEFsbCgnY291bnRyaWVzJyk7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHRcdFx0XHRcdGRhdGFPYmplY3Q6IGQuJG9iamVjdCxcblx0XHRcdFx0XHRcdFx0XHRcdGluZGV4ZXJPYmplY3Q6IGkuJG9iamVjdCxcblx0XHRcdFx0XHRcdFx0XHRcdGRhdGE6IGQsXG5cdFx0XHRcdFx0XHRcdFx0XHRpbmRleGVyOiBpLFxuXHRcdFx0XHRcdFx0XHRcdFx0Y291bnRyaWVzOiBjb3VudHJpZXMuJG9iamVjdFxuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0J3NlbGVjdGVkJzoge1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICcvdmlld3MvYXBwL2luZGV4L3NlbGVjdGVkLmh0bWwnLFxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLmluZGV4LnNob3cuc2VsZWN0ZWQnLCB7XG5cdFx0XHRcdHVybDogJy86aXRlbScsXG5cdFx0XHRcdC8qdmlld3M6e1xuXHRcdFx0XHRcdCdzZWxlY3RlZCc6e1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6IGdldFZpZXcoJ3NlbGVjdGVkJyksXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiAnU2VsZWN0ZWRDdHJsJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJyxcblx0XHRcdFx0XHRcdHJlc29sdmU6e1xuXHRcdFx0XHRcdFx0XHRnZXRDb3VudHJ5OiBmdW5jdGlvbihEYXRhU2VydmljZSwgJHN0YXRlUGFyYW1zKXtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gRGF0YVNlcnZpY2UuZ2V0T25lKCduYXRpb25zJywgJHN0YXRlUGFyYW1zLml0ZW0pLiRvYmplY3Q7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0qL1xuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLmluZGV4LnNob3cuc2VsZWN0ZWQuY29tcGFyZScsIHtcblx0XHRcdFx0dXJsOiAnL2NvbXBhcmUvOmNvdW50cmllcydcblx0XHRcdH0pXG5cdFx0XHQuc3RhdGUoJ2FwcC5pbXBvcnRjc3YnLCB7XG5cdFx0XHRcdHVybDogJy9pbXBvcnRlcicsXG5cdFx0XHRcdGRhdGE6IHtcblx0XHRcdFx0XHRwYWdlTmFtZTogJ0ltcG9ydCBDU1YnXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHZpZXdzOiB7XG5cdFx0XHRcdFx0J21haW5AJzoge1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6IGdldFZpZXcoJ2ltcG9ydGNzdicpXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHQnbWFwJzoge31cblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblxuXG5cdH0pO1xufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLnJvdXRlcycpLnJ1bihmdW5jdGlvbigkcm9vdFNjb3BlLCAkbWRTaWRlbmF2KXtcblx0XHQkcm9vdFNjb3BlLiRvbihcIiRzdGF0ZUNoYW5nZVN0YXJ0XCIsIGZ1bmN0aW9uKGV2ZW50LCB0b1N0YXRlKXtcblxuXHRcdFx0aWYgKHRvU3RhdGUuZGF0YSAmJiB0b1N0YXRlLmRhdGEucGFnZU5hbWUpe1xuXHRcdFx0XHQkcm9vdFNjb3BlLmN1cnJlbnRfcGFnZSA9IHRvU3RhdGUuZGF0YS5wYWdlTmFtZTtcblx0XHRcdH1cblx0XHRcdCAkcm9vdFNjb3BlLnN0YXRlSXNMb2FkaW5nID0gdHJ1ZTtcblx0XHR9KTtcblx0XHQkcm9vdFNjb3BlLiRvbihcIiR2aWV3Q29udGVudExvYWRlZFwiLCBmdW5jdGlvbihldmVudCwgdG9TdGF0ZSl7XG5cblx0XHR9KTtcblxuXHRcdCRyb290U2NvcGUuJG9uKFwiJHN0YXRlQ2hhbmdlU3VjY2Vzc1wiLCBmdW5jdGlvbihldmVudCwgdG9TdGF0ZSl7XG5cdFx0XHQkcm9vdFNjb3BlLnN0YXRlSXNMb2FkaW5nID0gZmFsc2U7XG5cdFx0fSk7XG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb25maWcnKS5jb25maWcoZnVuY3Rpb24gKCRhdXRoUHJvdmlkZXIpe1xuICAgICAgICAvLyBTYXRlbGxpemVyIGNvbmZpZ3VyYXRpb24gdGhhdCBzcGVjaWZpZXMgd2hpY2ggQVBJXG4gICAgICAgIC8vIHJvdXRlIHRoZSBKV1Qgc2hvdWxkIGJlIHJldHJpZXZlZCBmcm9tXG4gICAgICAgICRhdXRoUHJvdmlkZXIubG9naW5VcmwgPSAnL2FwaS9hdXRoZW50aWNhdGUvYXV0aCc7XG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29uZmlnJykuY29uZmlnKGZ1bmN0aW9uIChjZnBMb2FkaW5nQmFyUHJvdmlkZXIpe1xuXHRcdGNmcExvYWRpbmdCYXJQcm92aWRlci5pbmNsdWRlU3Bpbm5lciA9IGZhbHNlO1xuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbmZpZycpLmNvbmZpZyggZnVuY3Rpb24oUmVzdGFuZ3VsYXJQcm92aWRlcikge1xuXHRcdFJlc3Rhbmd1bGFyUHJvdmlkZXJcblx0XHQuc2V0QmFzZVVybCgnL2FwaS8nKVxuXHRcdC5zZXREZWZhdWx0SGVhZGVycyh7IGFjY2VwdDogXCJhcHBsaWNhdGlvbi94LmxhcmF2ZWwudjEranNvblwiIH0pXG5cdFx0LmFkZFJlc3BvbnNlSW50ZXJjZXB0b3IoZnVuY3Rpb24oZGF0YSxvcGVyYXRpb24sd2hhdCx1cmwscmVzcG9uc2UsZGVmZXJyZWQpIHtcbiAgICAgICAgdmFyIGV4dHJhY3RlZERhdGE7XG4gICAgICAgIGV4dHJhY3RlZERhdGEgPSBkYXRhLmRhdGE7XG4gICAgICAgIGlmIChkYXRhLm1ldGEpIHtcbiAgICAgICAgICAgIGV4dHJhY3RlZERhdGEuX21ldGEgPSBkYXRhLm1ldGE7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGRhdGEuaW5jbHVkZWQpIHsgXG4gICAgICAgICAgICBleHRyYWN0ZWREYXRhLl9pbmNsdWRlZCA9IGRhdGEuaW5jbHVkZWQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGV4dHJhY3RlZERhdGE7XG4gICAgfSk7XG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29uZmlnJykuY29uZmlnKGZ1bmN0aW9uKCRtZFRoZW1pbmdQcm92aWRlcikge1xuXHRcdC8qIEZvciBtb3JlIGluZm8sIHZpc2l0IGh0dHBzOi8vbWF0ZXJpYWwuYW5ndWxhcmpzLm9yZy8jL1RoZW1pbmcvMDFfaW50cm9kdWN0aW9uICovXG5cdHZhciBuZW9uVGVhbE1hcCA9ICRtZFRoZW1pbmdQcm92aWRlci5leHRlbmRQYWxldHRlKCd0ZWFsJywge1xuICAgICc1MDAnOiAnMDBjY2FhJyxcblx0XHQnQTIwMCc6ICcwMGNjYWEnXG4gIH0pO1xuXHR2YXIgd2hpdGVNYXAgPSAkbWRUaGVtaW5nUHJvdmlkZXIuZXh0ZW5kUGFsZXR0ZSgndGVhbCcsIHtcbiAgICAnNTAwJzogJzAwY2NhYScsXG5cdFx0J0EyMDAnOiAnI2ZmZidcbiAgfSk7XG5cdHZhciBibHVlTWFwID0gJG1kVGhlbWluZ1Byb3ZpZGVyLmV4dGVuZFBhbGV0dGUoJ2JsdWUnLCB7XG4gICAgJzUwMCc6ICcjMDA2YmI5Jyxcblx0XHQnQTIwMCc6ICcjMDA2YmI5J1xuICB9KTtcblx0JG1kVGhlbWluZ1Byb3ZpZGVyLmRlZmluZVBhbGV0dGUoJ25lb25UZWFsJywgbmVvblRlYWxNYXApO1xuXHQkbWRUaGVtaW5nUHJvdmlkZXIuZGVmaW5lUGFsZXR0ZSgnd2hpdGVUZWFsJywgd2hpdGVNYXApO1xuXHQkbWRUaGVtaW5nUHJvdmlkZXIuZGVmaW5lUGFsZXR0ZSgnYmx1ZXInLCBibHVlTWFwKTtcblx0XHQkbWRUaGVtaW5nUHJvdmlkZXIudGhlbWUoJ2RlZmF1bHQnKVxuXHRcdC5wcmltYXJ5UGFsZXR0ZSgnbmVvblRlYWwnKVxuXHRcdC5hY2NlbnRQYWxldHRlKCdibHVlcicpO1xuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb25maWcnKS5jb25maWcoZnVuY3Rpb24odG9hc3RyQ29uZmlnKXtcbiAgICAgICAgLy9cbiAgICAgICAgYW5ndWxhci5leHRlbmQodG9hc3RyQ29uZmlnLCB7XG4gICAgICAgICAgYXV0b0Rpc21pc3M6IGZhbHNlLFxuICAgICAgICAgIGNvbnRhaW5lcklkOiAndG9hc3QtY29udGFpbmVyJyxcbiAgICAgICAgICBtYXhPcGVuZWQ6IDAsXG4gICAgICAgICAgbmV3ZXN0T25Ub3A6IHRydWUsXG4gICAgICAgICAgcG9zaXRpb25DbGFzczogJ3RvYXN0LWJvdHRvbS1yaWdodCcsXG4gICAgICAgICAgcHJldmVudER1cGxpY2F0ZXM6IGZhbHNlLFxuICAgICAgICAgIHByZXZlbnRPcGVuRHVwbGljYXRlczogZmFsc2UsXG4gICAgICAgICAgdGFyZ2V0OiAnYm9keScsXG4gICAgICAgICAgY2xvc2VCdXR0b246IHRydWVcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuZmlsdGVycycpLmZpbHRlciggJ2FscGhhbnVtJywgZnVuY3Rpb24oKXtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCBpbnB1dCApe1xuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIGlmICggIWlucHV0ICl7XG4gICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGlucHV0LnJlcGxhY2UoLyhbXjAtOUEtWl0pL2csXCJcIik7XG5cbiAgICAgICAgfVxuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZmlsdGVycycpLmZpbHRlciggJ2NhcGl0YWxpemUnLCBmdW5jdGlvbigpe1xuXHRcdHJldHVybiBmdW5jdGlvbihpbnB1dCwgYWxsKSB7XG5cdFx0XHRyZXR1cm4gKCEhaW5wdXQpID8gaW5wdXQucmVwbGFjZSgvKFteXFxXX10rW15cXHMtXSopICovZyxmdW5jdGlvbih0eHQpe1xuXHRcdFx0XHRyZXR1cm4gdHh0LmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgdHh0LnN1YnN0cigxKS50b0xvd2VyQ2FzZSgpO1xuXHRcdFx0fSkgOiAnJztcblx0XHR9O1xuXHR9KTtcbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmZpbHRlcnMnKS5maWx0ZXIoJ2ZpbmRieW5hbWUnLCBmdW5jdGlvbiAoKSB7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uIChpbnB1dCwgbmFtZSwgZmllbGQpIHtcblx0XHRcdC8vXG4gICAgICB2YXIgZm91bmRzID0gW107XG5cdFx0XHR2YXIgaSA9IDAsXG5cdFx0XHRcdGxlbiA9IGlucHV0Lmxlbmd0aDtcblxuXHRcdFx0Zm9yICg7IGkgPCBsZW47IGkrKykge1xuXHRcdFx0XHRpZiAoaW5wdXRbaV1bZmllbGRdLnRvTG93ZXJDYXNlKCkuaW5kZXhPZihuYW1lLnRvTG93ZXJDYXNlKCkpID4gLTEpIHtcblx0XHRcdFx0XHQgZm91bmRzLnB1c2goaW5wdXRbaV0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gZm91bmRzO1xuXHRcdH1cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5maWx0ZXJzJykuZmlsdGVyKCAnaHVtYW5SZWFkYWJsZScsIGZ1bmN0aW9uKCl7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uIGh1bWFuaXplKHN0cikge1xuXHRcdFx0aWYgKCAhc3RyICl7XG5cdFx0XHRcdHJldHVybiAnJztcblx0XHRcdH1cblx0XHRcdHZhciBmcmFncyA9IHN0ci5zcGxpdCgnXycpO1xuXHRcdFx0Zm9yICh2YXIgaT0wOyBpPGZyYWdzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdGZyYWdzW2ldID0gZnJhZ3NbaV0uY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBmcmFnc1tpXS5zbGljZSgxKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBmcmFncy5qb2luKCcgJyk7XG5cdFx0fTtcblx0fSk7XG59KSgpOyIsIihmdW5jdGlvbigpe1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuZmlsdGVycycpLmZpbHRlcigndHJ1bmNhdGVDaGFyYWN0ZXJzJywgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGlucHV0LCBjaGFycywgYnJlYWtPbldvcmQpIHtcbiAgICAgICAgICAgIGlmIChpc05hTihjaGFycykpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaW5wdXQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoY2hhcnMgPD0gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpbnB1dCAmJiBpbnB1dC5sZW5ndGggPiBjaGFycykge1xuICAgICAgICAgICAgICAgIGlucHV0ID0gaW5wdXQuc3Vic3RyaW5nKDAsIGNoYXJzKTtcblxuICAgICAgICAgICAgICAgIGlmICghYnJlYWtPbldvcmQpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGxhc3RzcGFjZSA9IGlucHV0Lmxhc3RJbmRleE9mKCcgJyk7XG4gICAgICAgICAgICAgICAgICAgIC8vIEdldCBsYXN0IHNwYWNlXG4gICAgICAgICAgICAgICAgICAgIGlmIChsYXN0c3BhY2UgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbnB1dCA9IGlucHV0LnN1YnN0cigwLCBsYXN0c3BhY2UpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgd2hpbGUgKGlucHV0LmNoYXJBdChpbnB1dC5sZW5ndGgtMSkgPT09ICcgJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5wdXQgPSBpbnB1dC5zdWJzdHIoMCwgaW5wdXQubGVuZ3RoIC0gMSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIGlucHV0ICsgJy4uLic7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gaW5wdXQ7XG4gICAgICAgIH07XG4gICAgfSk7XG59KSgpOyIsIihmdW5jdGlvbigpe1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuZmlsdGVycycpLmZpbHRlcigndHJ1bmNhdGVXb3JkcycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChpbnB1dCwgd29yZHMpIHtcbiAgICAgICAgICAgIGlmIChpc05hTih3b3JkcykpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaW5wdXQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAod29yZHMgPD0gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpbnB1dCkge1xuICAgICAgICAgICAgICAgIHZhciBpbnB1dFdvcmRzID0gaW5wdXQuc3BsaXQoL1xccysvKTtcbiAgICAgICAgICAgICAgICBpZiAoaW5wdXRXb3Jkcy5sZW5ndGggPiB3b3Jkcykge1xuICAgICAgICAgICAgICAgICAgICBpbnB1dCA9IGlucHV0V29yZHMuc2xpY2UoMCwgd29yZHMpLmpvaW4oJyAnKSArICcuLi4nO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBpbnB1dDtcbiAgICAgICAgfTtcbiAgICB9KTtcbn0pKCk7IiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZmlsdGVycycpLmZpbHRlciggJ3RydXN0SHRtbCcsIGZ1bmN0aW9uKCAkc2NlICl7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uKCBodG1sICl7XG5cdFx0XHRyZXR1cm4gJHNjZS50cnVzdEFzSHRtbChodG1sKTtcblx0XHR9O1xuXHR9KTtcbn0pKCk7IiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZmlsdGVycycpLmZpbHRlcigndWNmaXJzdCcsIGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBmdW5jdGlvbiggaW5wdXQgKSB7XG5cdFx0XHRpZiAoICFpbnB1dCApe1xuXHRcdFx0XHRyZXR1cm4gbnVsbDtcblx0XHRcdH1cblx0XHRcdHJldHVybiBpbnB1dC5zdWJzdHJpbmcoMCwgMSkudG9VcHBlckNhc2UoKSArIGlucHV0LnN1YnN0cmluZygxKTtcblx0XHR9O1xuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5zZXJ2aWNlcycpLmZhY3RvcnkoJ1ZlY3RvcmxheWVyU2VydmljZScsIGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgcmV0dXJue1xuICAgICAgICAgIGRhdGE6e1xuICAgICAgICAgICAgbGF5ZXI6ICcnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgc2V0TGF5ZXI6IGZ1bmN0aW9uKGwpe1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGF0YS5sYXllciA9IGw7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBnZXRMYXllcjogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmRhdGEubGF5ZXI7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuc2VydmljZXMnKS5mYWN0b3J5KCdEYXRhU2VydmljZScsIERhdGFTZXJ2aWNlKTtcbiAgICBEYXRhU2VydmljZS4kaW5qZWN0ID0gWydSZXN0YW5ndWxhcicsJ3RvYXN0ciddO1xuXG4gICAgZnVuY3Rpb24gRGF0YVNlcnZpY2UoUmVzdGFuZ3VsYXIsIHRvYXN0cil7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZ2V0QWxsOiBnZXRBbGwsXG4gICAgICAgICAgZ2V0T25lOiBnZXRPbmUsXG4gICAgICAgICAgcG9zdDogcG9zdFxuICAgICAgICB9O1xuXG4gICAgICAgIGZ1bmN0aW9uIGdldEFsbChyb3V0ZSl7XG4gICAgICAgICAgdmFyIGRhdGEgPSBSZXN0YW5ndWxhci5hbGwocm91dGUpLmdldExpc3QoKTtcbiAgICAgICAgICAgIGRhdGEudGhlbihmdW5jdGlvbigpe30sIGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAgICAgICB0b2FzdHIuZXJyb3IoZGF0YS5zdGF0dXNUZXh0LCAnQ29ubmVjdGlvbiBFcnJvcicpO1xuICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gZ2V0T25lKHJvdXRlLCBpZCl7XG4gICAgICAgICAgcmV0dXJuIFJlc3Rhbmd1bGFyLm9uZShyb3V0ZSwgaWQpLmdldCgpO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIHBvc3Qocm91dGUsIGRhdGEpe1xuICAgICAgICAgIHJldHVybiBSZXN0YW5ndWxhci5hbGwocm91dGUpLnBvc3QoZGF0YSk7XG4gICAgICAgIH1cbiAgICB9XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoXCJhcHAuc2VydmljZXNcIikuZmFjdG9yeSgnRGlhbG9nU2VydmljZScsIGZ1bmN0aW9uKCRtZERpYWxvZyl7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0ZnJvbVRlbXBsYXRlOiBmdW5jdGlvbih0ZW1wbGF0ZSwgJHNjb3BlKXtcblxuXHRcdFx0XHR2YXIgb3B0aW9ucyA9IHtcblx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogJy4vdmlld3MvZGlhbG9ncy8nICsgdGVtcGxhdGUgKyAnLycgKyB0ZW1wbGF0ZSArICcuaHRtbCdcblx0XHRcdFx0fTtcblxuXHRcdFx0XHRpZiAoJHNjb3BlKXtcblx0XHRcdFx0XHRvcHRpb25zLnNjb3BlID0gJHNjb3BlLiRuZXcoKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiAkbWREaWFsb2cuc2hvdyhvcHRpb25zKTtcblx0XHRcdH0sXG5cblx0XHRcdGhpZGU6IGZ1bmN0aW9uKCl7XG5cdFx0XHRcdHJldHVybiAkbWREaWFsb2cuaGlkZSgpO1xuXHRcdFx0fSxcblxuXHRcdFx0YWxlcnQ6IGZ1bmN0aW9uKHRpdGxlLCBjb250ZW50KXtcblx0XHRcdFx0JG1kRGlhbG9nLnNob3coXG5cdFx0XHRcdFx0JG1kRGlhbG9nLmFsZXJ0KClcblx0XHRcdFx0XHRcdC50aXRsZSh0aXRsZSlcblx0XHRcdFx0XHRcdC5jb250ZW50KGNvbnRlbnQpXG5cdFx0XHRcdFx0XHQub2soJ09rJylcblx0XHRcdFx0KTtcblx0XHRcdH0sXG5cblx0XHRcdGNvbmZpcm06IGZ1bmN0aW9uKHRpdGxlLCBjb250ZW50KSB7XG5cdFx0XHRcdHJldHVybiAkbWREaWFsb2cuc2hvdyhcblx0XHRcdFx0XHQkbWREaWFsb2cuY29uZmlybSgpXG5cdFx0XHRcdFx0XHQudGl0bGUodGl0bGUpXG5cdFx0XHRcdFx0XHQuY29udGVudChjb250ZW50KVxuXHRcdFx0XHRcdFx0Lm9rKCdPaycpXG5cdFx0XHRcdFx0XHQuY2FuY2VsKCdDYW5jZWwnKVxuXHRcdFx0XHQpO1xuXHRcdFx0fVxuXHRcdH07XG5cdH0pO1xufSkoKTsiLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuc2VydmljZXMnKS5mYWN0b3J5KCdJY29uc1NlcnZpY2UnLCBmdW5jdGlvbigpe1xuICAgICAgICB2YXIgdW5pY29kZXMgPSB7XG4gICAgICAgICAgJ2VtcHR5JzogXCJcXHVlNjAwXCIsXG4gICAgICAgICAgJ2FncmFyJzogXCJcXHVlNjAwXCIsXG4gICAgICAgICAgJ2FuY2hvcic6IFwiXFx1ZTYwMVwiLFxuICAgICAgICAgICdidXR0ZXJmbHknOiBcIlxcdWU2MDJcIixcbiAgICAgICAgICAnZW5lcmd5JzpcIlxcdWU2MDNcIixcbiAgICAgICAgICAnc2luayc6IFwiXFx1ZTYwNFwiLFxuICAgICAgICAgICdtYW4nOiBcIlxcdWU2MDVcIixcbiAgICAgICAgICAnZmFicmljJzogXCJcXHVlNjA2XCIsXG4gICAgICAgICAgJ3RyZWUnOlwiXFx1ZTYwN1wiLFxuICAgICAgICAgICd3YXRlcic6XCJcXHVlNjA4XCJcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGdldFVuaWNvZGU6IGZ1bmN0aW9uKGljb24pe1xuICAgICAgICAgICAgcmV0dXJuIHVuaWNvZGVzW2ljb25dO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZ2V0TGlzdDpmdW5jdGlvbigpe1xuICAgICAgICAgICAgcmV0dXJuIHVuaWNvZGVzO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKFwiYXBwLnNlcnZpY2VzXCIpLmZhY3RvcnkoJ1RvYXN0U2VydmljZScsIGZ1bmN0aW9uKCRtZFRvYXN0KXtcblxuXHRcdHZhciBkZWxheSA9IDYwMDAsXG5cdFx0XHRwb3NpdGlvbiA9ICd0b3AgcmlnaHQnLFxuXHRcdFx0YWN0aW9uID0gJ09LJztcblxuXHRcdHJldHVybiB7XG5cdFx0XHRzaG93OiBmdW5jdGlvbihjb250ZW50KXtcblx0XHRcdFx0aWYgKCFjb250ZW50KXtcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm4gJG1kVG9hc3Quc2hvdyhcblx0XHRcdFx0XHQkbWRUb2FzdC5zaW1wbGUoKVxuXHRcdFx0XHRcdFx0LmNvbnRlbnQoY29udGVudClcblx0XHRcdFx0XHRcdC5wb3NpdGlvbihwb3NpdGlvbilcblx0XHRcdFx0XHRcdC5hY3Rpb24oYWN0aW9uKVxuXHRcdFx0XHRcdFx0LmhpZGVEZWxheShkZWxheSlcblx0XHRcdFx0KTtcblx0XHRcdH0sXG5cdFx0XHRlcnJvcjogZnVuY3Rpb24oY29udGVudCl7XG5cdFx0XHRcdGlmICghY29udGVudCl7XG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuICRtZFRvYXN0LnNob3coXG5cdFx0XHRcdFx0JG1kVG9hc3Quc2ltcGxlKClcblx0XHRcdFx0XHRcdC5jb250ZW50KGNvbnRlbnQpXG5cdFx0XHRcdFx0XHQucG9zaXRpb24ocG9zaXRpb24pXG5cdFx0XHRcdFx0XHQudGhlbWUoJ3dhcm4nKVxuXHRcdFx0XHRcdFx0LmFjdGlvbihhY3Rpb24pXG5cdFx0XHRcdFx0XHQuaGlkZURlbGF5KGRlbGF5KVxuXHRcdFx0XHQpO1xuXHRcdFx0fVxuXHRcdH07XG5cdH0pO1xufSkoKTsiLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdIb21lQ3RybCcsIGZ1bmN0aW9uKERhdGFTZXJ2aWNlKXtcbiAgICAgICAgdmFyIHZtID0gdGhpcztcbiAgICAgICAgRGF0YVNlcnZpY2UuZ2V0QWxsKCdpbmRleCcpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgICAgIHZtLmluZGl6ZXMgPSByZXNwb25zZTtcbiAgICAgICAgfSk7XG5cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdJbXBvcnRjc3ZDdHJsJywgZnVuY3Rpb24gKCRtZERpYWxvZykge1xuXHRcdHRoaXMuc2V0dGluZ3MgPSB7XG5cdFx0XHRwcmludExheW91dDogdHJ1ZSxcblx0XHRcdHNob3dSdWxlcjogdHJ1ZSxcblx0XHRcdHNob3dTcGVsbGluZ1N1Z2dlc3Rpb25zOiB0cnVlLFxuXHRcdFx0cHJlc2VudGF0aW9uTW9kZTogJ2VkaXQnXG5cdFx0fTtcblxuXHRcdHRoaXMuc2FtcGxlQWN0aW9uID0gZnVuY3Rpb24gKG5hbWUsIGV2KSB7XG5cdFx0XHQkbWREaWFsb2cuc2hvdygkbWREaWFsb2cuYWxlcnQoKVxuXHRcdFx0XHQudGl0bGUobmFtZSlcblx0XHRcdFx0LmNvbnRlbnQoJ1lvdSB0cmlnZ2VyZWQgdGhlIFwiJyArIG5hbWUgKyAnXCIgYWN0aW9uJylcblx0XHRcdFx0Lm9rKCdHcmVhdCcpXG5cdFx0XHRcdC50YXJnZXRFdmVudChldilcblx0XHRcdCk7XG5cdFx0fTtcblxuICAgIHRoaXMub3BlbkNzdlVwbG9hZCA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0JG1kRGlhbG9nLnNob3coe1xuXHRcdFx0XHRcdC8vY29udHJvbGxlcjogRGlhbG9nQ29udHJvbGxlcixcblx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogJy92aWV3cy9hcHAvaW1wb3J0Y3N2L2NzdlVwbG9hZERpYWxvZy5odG1sJyxcblx0ICAgICAgICBiaW5kVG9Db250cm9sbGVyOiB0cnVlLFxuXHRcdFx0XHR9KVxuXHRcdFx0XHQudGhlbihmdW5jdGlvbiAoYW5zd2VyKSB7XG5cblx0XHRcdFx0fSwgZnVuY3Rpb24gKCkge1xuXG5cdFx0XHRcdH0pO1xuXHRcdH07XG5cdH0pXG5cblxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdJbmRleEN0cmwnLCBmdW5jdGlvbiAoJHNjb3BlLCAkd2luZG93LCAkcm9vdFNjb3BlLCRmaWx0ZXIsICRzdGF0ZSwgJHRpbWVvdXQsIFRvYXN0U2VydmljZSwgVmVjdG9ybGF5ZXJTZXJ2aWNlLCBpbml0aWFsRGF0YSwgbGVhZmxldERhdGEsIERhdGFTZXJ2aWNlKSB7XG5cdFx0Ly8gVmFyaWFibGUgZGVmaW5pdGlvbnNcblx0XHR2YXIgdm0gPSB0aGlzO1xuXHRcdHZtLm1hcCA9IG51bGw7XG5cblx0XHR2bS5kYXRhU2VydmVyID0gaW5pdGlhbERhdGEuZGF0YTtcblx0XHR2bS5kYXRhID0gaW5pdGlhbERhdGEuZGF0YU9iamVjdDtcblx0XHR2bS5jb3VudHJ5TGlzdCA9IGluaXRpYWxEYXRhLmNvdW50cmllcztcblx0XHR2bS5zdHJ1Y3R1cmVTZXJ2ZXIgPSBpbml0aWFsRGF0YS5pbmRleGVyO1xuXHRcdHZtLnN0cnVjdHVyZSA9IFwiXCI7XG5cdFx0dm0ubXZ0U2NvdXJjZSA9IFZlY3RvcmxheWVyU2VydmljZS5nZXRMYXllcigpO1xuXHRcdHZtLm5vZGVQYXJlbnQgPSB7fTtcblx0XHR2bS5zZWxlY3RlZFRhYiA9IDA7XG5cdFx0dm0uY3VycmVudCA9IFwiXCI7XG5cdFx0dm0udGFiQ29udGVudCA9IFwiXCI7XG5cdFx0dm0udG9nZ2xlQnV0dG9uID0gJ2Fycm93X2Ryb3BfZG93bic7XG5cdFx0dm0ubWVudWVPcGVuID0gdHJ1ZTtcblx0XHR2bS5pbmZvID0gZmFsc2U7XG5cdFx0dm0uY2xvc2VJY29uID0gJ2Nsb3NlJztcblx0XHR2bS5jb21wYXJlID0ge1xuXHRcdFx0YWN0aXZlOiBmYWxzZSxcblx0XHRcdGNvdW50cmllczogW11cblx0XHR9O1xuXHRcdHZtLmRpc3BsYXkgPSB7XG5cdFx0XHRzZWxlY3RlZENhdDogJydcblx0XHR9O1xuXG5cdFx0Ly9GdW5jdGlvbiBkZWZpbml0b25zXG5cdFx0dm0uc2hvd1RhYkNvbnRlbnQgPSBzaG93VGFiQ29udGVudDtcblx0XHR2bS5zZXRUYWIgPSBzZXRUYWI7XG5cdFx0dm0uc2V0U3RhdGUgPSBzZXRTdGF0ZTtcblx0XHR2bS5zZXRDdXJyZW50ID0gc2V0Q3VycmVudDtcblx0XHR2bS5zZXRTZWxlY3RlZEZlYXR1cmUgPSBzZXRTZWxlY3RlZEZlYXR1cmU7XG5cdFx0dm0uZ2V0UmFuayA9IGdldFJhbms7XG5cdFx0dm0uZ2V0T2Zmc2V0ID0gZ2V0T2Zmc2V0O1xuXHRcdHZtLmdldFRlbmRlbmN5ID0gZ2V0VGVuZGVuY3k7XG5cblx0XHR2bS5jaGVja0NvbXBhcmlzb24gPSBjaGVja0NvbXBhcmlzb247XG5cdFx0dm0udG9nZ2xlT3BlbiA9IHRvZ2dsZU9wZW47XG5cdFx0dm0udG9nZ2xlSW5mbyA9IHRvZ2dsZUluZm87XG5cdFx0dm0udG9nZ2xlRGV0YWlscyA9IHRvZ2dsZURldGFpbHM7XG5cdFx0dm0udG9nZ2xlQ29tcGFyaXNvbiA9IHRvZ2dsZUNvbXBhcmlzb247XG5cdFx0dm0udG9nZ2xlQ291bnRyaWVMaXN0ID0gdG9nZ2xlQ291bnRyaWVMaXN0O1xuXHRcdHZtLm1hcEdvdG9Db3VudHJ5ID0gbWFwR290b0NvdW50cnk7XG5cdFx0dm0uZ29CYWNrID0gZ29CYWNrO1xuXG5cdFx0dm0uY2FsY1RyZWUgPSBjYWxjVHJlZTtcblxuXHRcdGFjdGl2YXRlKCk7XG5cblx0XHRmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcblxuXHRcdFx0dm0uc3RydWN0dXJlU2VydmVyLnRoZW4oZnVuY3Rpb24oc3RydWN0dXJlKXtcblx0XHRcdFx0dm0uZGF0YVNlcnZlci50aGVuKGZ1bmN0aW9uKGRhdGEpe1xuXG5cdFx0XHRcdFx0Y29uc29sZS5sb2codm0uZGF0YSk7XG5cdFx0XHRcdFx0dm0uc3RydWN0dXJlID0gc3RydWN0dXJlO1xuXHRcdFx0XHRcdGNyZWF0ZUNhbnZhcygpO1xuXHRcdFx0XHRcdGRyYXdDb3VudHJpZXMoKTtcblx0XHRcdFx0XHRpZigkc3RhdGUucGFyYW1zLml0ZW0pe1xuXHRcdFx0XHRcdFx0dm0uc2V0U3RhdGUoJHN0YXRlLnBhcmFtcy5pdGVtKTtcblx0XHRcdFx0XHRcdGNhbGNSYW5rKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmKCRzdGF0ZS5wYXJhbXMuY291bnRyaWVzKXtcblx0XHRcdFx0XHRcdHZtLnNldFRhYigyKTtcblx0XHRcdFx0XHRcdHZtLmNvbXBhcmUuY291bnRyaWVzLnB1c2godm0uY3VycmVudCk7XG5cdFx0XHRcdFx0XHR2bS5jb21wYXJlLmFjdGl2ZSA9IHRydWU7XG5cdFx0XHRcdFx0XHQkcm9vdFNjb3BlLmdyZXllZCA9IHRydWU7XG5cdFx0XHRcdFx0XHR2YXIgY291bnRyaWVzID0gJHN0YXRlLnBhcmFtcy5jb3VudHJpZXMuc3BsaXQoJy12cy0nKTtcblx0XHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChjb3VudHJpZXMsIGZ1bmN0aW9uKGlzbyl7XG5cdFx0XHRcdFx0XHRcdHZtLmNvbXBhcmUuY291bnRyaWVzLnB1c2goZ2V0TmF0aW9uQnlJc28oaXNvKSk7XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdC8vb25zb2xlLmxvZyh2bS5jb21wYXJlLmNvdW50cmllcyk7XG5cdFx0XHRcdFx0XHRjb3VudHJpZXMucHVzaCh2bS5jdXJyZW50Lmlzbyk7XG5cdFx0XHRcdFx0XHREYXRhU2VydmljZS5nZXRPbmUoJ2NvdW50cmllcy9iYm94JywgY291bnRyaWVzKS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG5cdFx0XHRcdFx0XHRcdHZtLmJib3ggPSBkYXRhO1xuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KVxuXHRcdFx0fSk7XG5cblx0XHR9XG5cblx0XHRmdW5jdGlvbiBnb0JhY2soKXtcblx0XHRcdCR3aW5kb3cuaGlzdG9yeS5iYWNrKCk7XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIHNob3dUYWJDb250ZW50KGNvbnRlbnQpIHtcblx0XHRcdGlmIChjb250ZW50ID09ICcnICYmIHZtLnRhYkNvbnRlbnQgPT0gJycpIHtcblx0XHRcdFx0dm0udGFiQ29udGVudCA9ICdyYW5rJztcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHZtLnRhYkNvbnRlbnQgPSBjb250ZW50O1xuXHRcdFx0fVxuXHRcdFx0dm0udG9nZ2xlQnV0dG9uID0gdm0udGFiQ29udGVudCA/ICdhcnJvd19kcm9wX3VwJyA6ICdhcnJvd19kcm9wX2Rvd24nO1xuXHRcdH07XG5cdFx0ZnVuY3Rpb24gc2V0U3RhdGUoaXRlbSkge1xuXHRcdFx0dm0uc2V0Q3VycmVudChnZXROYXRpb25CeUlzbyhpdGVtKSk7XG5cdFx0XHRmZXRjaE5hdGlvbkRhdGEoaXRlbSk7XG5cdFx0fTtcblxuXHRcdGZ1bmN0aW9uIHRvZ2dsZU9wZW4oKSB7XG5cdFx0XHR2bS5tZW51ZU9wZW4gPSAhdm0ubWVudWVPcGVuO1xuXHRcdFx0dm0uY2xvc2VJY29uID0gdm0ubWVudWVPcGVuID09IHRydWUgPyAnY2hldnJvbl9sZWZ0JyA6ICdjaGV2cm9uX3JpZ2h0Jztcblx0XHR9XG5cdFx0ZnVuY3Rpb24gc2V0Q3VycmVudChuYXQpIHtcblx0XHRcdHZtLmN1cnJlbnQgPSBuYXQ7XG5cdFx0XHR2bS5zZXRTZWxlY3RlZEZlYXR1cmUoKTtcblx0XHR9O1xuXG5cdFx0ZnVuY3Rpb24gc2V0U2VsZWN0ZWRGZWF0dXJlKGlzbykge1xuXHRcdFx0aWYgKHZtLm12dFNvdXJjZSkge1xuXHRcdFx0XHQkdGltZW91dChmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0dm0ubXZ0U291cmNlLmxheWVycy5jb3VudHJpZXNfYmlnX2dlb20uZmVhdHVyZXNbdm0uY3VycmVudC5pc29dLnNlbGVjdGVkID0gdHJ1ZTtcblx0XHRcdFx0fSlcblx0XHRcdH1cblx0XHR9O1xuXHRcdGZ1bmN0aW9uIGNhbGNSYW5rKCkge1xuXHRcdFx0aWYoIXZtLmN1cnJlbnQpe1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0XHR2YXIgcmFuayA9IDA7XG5cdFx0XHRhbmd1bGFyLmZvckVhY2godm0uZGF0YSwgZnVuY3Rpb24oaXRlbSkge1xuXHRcdFx0XHRpdGVtW3ZtLnN0cnVjdHVyZS5uYW1lXSA9IHBhcnNlRmxvYXQoaXRlbVt2bS5zdHJ1Y3R1cmUubmFtZV0pO1xuXHRcdFx0XHRpdGVtWydzY29yZSddID0gcGFyc2VGbG9hdChpdGVtWydzY29yZSddKTtcblx0XHRcdH0pXG5cdFx0XHR2bS5kYXRhID0gJGZpbHRlcignb3JkZXJCeScpKHZtLmRhdGEsIFt2bS5zdHJ1Y3R1cmUubmFtZSwgXCJzY29yZVwiXSwgdHJ1ZSk7XG5cdFx0XHRyYW5rID0gdm0uZGF0YS5pbmRleE9mKHZtLmN1cnJlbnQpICsgMTtcblx0XHRcdHZtLmN1cnJlbnRbdm0uc3RydWN0dXJlLm5hbWUrJ19yYW5rJ10gPSByYW5rO1xuXHRcdFx0dm0uY2lyY2xlT3B0aW9ucyA9IHtcblx0XHRcdFx0XHRjb2xvcjp2bS5zdHJ1Y3R1cmUuY29sb3IsXG5cdFx0XHRcdFx0ZmllbGQ6dm0uc3RydWN0dXJlLm5hbWUrJ19yYW5rJ1xuXHRcdFx0fTtcblx0XHRcdHJldHVybiByYW5rO1xuXHRcdH1cblx0XHRmdW5jdGlvbiBnZXRSYW5rKGNvdW50cnkpe1xuXG5cdFx0XHR2YXIgcmFuayA9IHZtLmRhdGEuaW5kZXhPZihjb3VudHJ5KSArIDE7XG5cdFx0XHRyZXR1cm4gcmFuaztcblx0XHR9XG5cdFx0ZnVuY3Rpb24gdG9nZ2xlSW5mbygpIHtcblx0XHRcdHZtLmluZm8gPSAhdm0uaW5mbztcblx0XHR9O1xuXG5cdFx0ZnVuY3Rpb24gdG9nZ2xlRGV0YWlscygpIHtcblx0XHRcdHJldHVybiB2bS5kZXRhaWxzID0gIXZtLmRldGFpbHM7XG5cdFx0fTtcblx0XHRmdW5jdGlvbiBmZXRjaE5hdGlvbkRhdGEoaXNvKXtcblx0XHRcdERhdGFTZXJ2aWNlLmdldE9uZSgnaW5kZXgvJyskc3RhdGUucGFyYW1zLmluZGV4LCBpc28pLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcblx0XHRcdFx0dm0uY3VycmVudC5kYXRhID0gZGF0YTtcblx0XHRcdFx0bWFwR290b0NvdW50cnkoaXNvKTtcblx0XHRcdH0pO1xuXHRcdH1cblx0XHRmdW5jdGlvbiBtYXBHb3RvQ291bnRyeShpc28pIHtcblx0XHRcdGlmKCEkc3RhdGUucGFyYW1zLmNvdW50cmllcyl7XG5cdFx0XHRcdERhdGFTZXJ2aWNlLmdldE9uZSgnY291bnRyaWVzL2Jib3gnLCBbaXNvXSkudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuXHRcdFx0XHRcdHZtLmJib3ggPSBkYXRhO1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblxuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGNoZWNrQ29tcGFyaXNvbih3YW50KSB7XG5cdFx0XHRpZiAod2FudCAmJiAhdm0uY29tcGFyZS5hY3RpdmUgfHwgIXdhbnQgJiYgdm0uY29tcGFyZS5hY3RpdmUpIHtcblx0XHRcdFx0dm0udG9nZ2xlQ29tcGFyaXNvbigpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIHRvZ2dsZUNvbXBhcmlzb24oKSB7XG5cdFx0XHR2bS5jb21wYXJlLmNvdW50cmllcyA9IFt2bS5jdXJyZW50XTtcblx0XHRcdHZtLmNvbXBhcmUuYWN0aXZlID0gIXZtLmNvbXBhcmUuYWN0aXZlO1xuXHRcdFx0aWYgKHZtLmNvbXBhcmUuYWN0aXZlKSB7XG5cdFx0XHRcdHZtLnNldFRhYigyKTtcblx0XHRcdFx0JHJvb3RTY29wZS5ncmV5ZWQgPSB0cnVlO1xuXHRcdFx0XHR2bS5tdnRTb3VyY2Uub3B0aW9ucy5tdXRleFRvZ2dsZSA9IGZhbHNlO1xuXHRcdFx0XHR2bS5tdnRTb3VyY2Uuc2V0U3R5bGUoaW52ZXJ0ZWRTdHlsZSk7XG5cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCRyb290U2NvcGUuZ3JleWVkID0gZmFsc2U7XG5cdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5tdnRTb3VyY2UubGF5ZXJzLmNvdW50cmllc19iaWdfZ2VvbS5mZWF0dXJlcywgZnVuY3Rpb24gKGZlYXR1cmUpIHtcblx0XHRcdFx0XHRmZWF0dXJlLnNlbGVjdGVkID0gZmFsc2U7XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHR2bS5tdnRTb3VyY2UubGF5ZXJzLmNvdW50cmllc19iaWdfZ2VvbS5mZWF0dXJlc1t2bS5jdXJyZW50Lmlzb10uc2VsZWN0ZWQgPSB0cnVlO1xuXHRcdFx0XHR2bS5tdnRTb3VyY2Uub3B0aW9ucy5tdXRleFRvZ2dsZSA9IHRydWU7XG5cdFx0XHRcdHZtLm12dFNvdXJjZS5zZXRTdHlsZShjb3VudHJpZXNTdHlsZSk7XG5cdFx0XHRcdERhdGFTZXJ2aWNlLmdldE9uZSgnY291bnRyaWVzL2Jib3gnLCBbdm0uY3VycmVudC5pc29dKS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG5cdFx0XHRcdFx0dm0uYmJveCA9IGRhdGE7XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHQkc3RhdGUuZ28oJ2FwcC5pbmRleC5zaG93LnNlbGVjdGVkJyx7XG5cdFx0XHRcdFx0aW5kZXg6JHN0YXRlLnBhcmFtcy5pbmRleCxcblx0XHRcdFx0XHRpdGVtOiRzdGF0ZS5wYXJhbXMuaXRlbVxuXHRcdFx0XHR9KVxuXHRcdFx0fVxuXHRcdFx0Ly92bS5tdnRTb3VyY2UucmVkcmF3KCk7XG5cdFx0fTtcblxuXHRcdGZ1bmN0aW9uIHRvZ2dsZUNvdW50cmllTGlzdChjb3VudHJ5KSB7XG5cdFx0XHR2YXIgZm91bmQgPSBmYWxzZTtcblx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5jb21wYXJlLmNvdW50cmllcywgZnVuY3Rpb24gKG5hdCwga2V5KSB7XG5cdFx0XHRcdGlmIChjb3VudHJ5ID09IG5hdCAmJiBuYXQgIT0gdm0uY3VycmVudCkge1xuXHRcdFx0XHRcdHZtLmNvbXBhcmUuY291bnRyaWVzLnNwbGljZShrZXksIDEpO1xuXHRcdFx0XHRcdGZvdW5kID0gdHJ1ZTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0XHRpZiAoIWZvdW5kKSB7XG5cdFx0XHRcdHZtLmNvbXBhcmUuY291bnRyaWVzLnB1c2goY291bnRyeSk7XG5cdFx0XHR9O1xuXHRcdFx0dmFyIGlzb3MgPSBbXTtcblx0XHRcdHZhciBjb21wYXJlID0gW107XG5cdFx0XHRhbmd1bGFyLmZvckVhY2godm0uY29tcGFyZS5jb3VudHJpZXMsIGZ1bmN0aW9uIChpdGVtLCBrZXkpIHtcblx0XHRcdFx0aXNvcy5wdXNoKGl0ZW1bdm0uc3RydWN0dXJlLmlzb10pO1xuXHRcdFx0XHRpZihpdGVtW3ZtLnN0cnVjdHVyZS5pc29dICE9IHZtLmN1cnJlbnQuaXNvKXtcblx0XHRcdFx0XHRjb21wYXJlLnB1c2goaXRlbS5pc28pO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHRcdGlmIChpc29zLmxlbmd0aCA+IDEpIHtcblx0XHRcdFx0RGF0YVNlcnZpY2UuZ2V0T25lKCdjb3VudHJpZXMvYmJveCcsIGlzb3MpLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcblx0XHRcdFx0XHR2bS5iYm94ID0gZGF0YTtcblx0XHRcdFx0fSk7XG5cdFx0XHRcdCRzdGF0ZS5nbygnYXBwLmluZGV4LnNob3cuc2VsZWN0ZWQuY29tcGFyZScse1xuXHRcdFx0XHRcdGluZGV4OiAkc3RhdGUucGFyYW1zLmluZGV4LFxuXHRcdFx0XHRcdGl0ZW06ICRzdGF0ZS5wYXJhbXMuaXRlbSxcblx0XHRcdFx0XHRjb3VudHJpZXM6Y29tcGFyZS5qb2luKCctdnMtJylcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiAhZm91bmQ7XG5cdFx0fTtcblxuXHRcdGZ1bmN0aW9uIGdldE9mZnNldCgpIHtcblx0XHRcdGlmICghdm0uY3VycmVudCkge1xuXHRcdFx0XHRyZXR1cm4gMDtcblx0XHRcdH1cblx0XHRcdC8vY29uc29sZS5sb2codm0uZ2V0UmFuayh2bS5jdXJyZW50KSk7XG5cdFx0XHRyZXR1cm4gKHZtLmdldFJhbmsodm0uY3VycmVudCkgLSAyKSAqIDE2O1xuXHRcdH07XG5cblx0XHRmdW5jdGlvbiBnZXRUZW5kZW5jeSgpIHtcblx0XHRcdGlmICghdm0uY3VycmVudCkge1xuXHRcdFx0XHRyZXR1cm4gJ2Fycm93X2Ryb3BfZG93bidcblx0XHRcdH1cblx0XHRcdHJldHVybiB2bS5jdXJyZW50LnBlcmNlbnRfY2hhbmdlID4gMCA/ICdhcnJvd19kcm9wX3VwJyA6ICdhcnJvd19kcm9wX2Rvd24nO1xuXHRcdH07XG5cblx0XHRmdW5jdGlvbiBzZXRUYWIoaSkge1xuXHRcdFx0dm0uYWN0aXZlVGFiID0gaTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBnZXRQYXJlbnQoZGF0YSkge1xuXHRcdFx0dmFyIGl0ZW1zID0gW107XG5cdFx0XHRhbmd1bGFyLmZvckVhY2goZGF0YS5jaGlsZHJlbiwgZnVuY3Rpb24gKGl0ZW0pIHtcblx0XHRcdFx0aWYgKGl0ZW0uY29sdW1uX25hbWUgPT0gdm0uZGlzcGxheS5zZWxlY3RlZENhdC50eXBlKSB7XG5cdFx0XHRcdFx0dm0ubm9kZVBhcmVudCA9IGRhdGE7XG5cdFx0XHRcdH1cblx0XHRcdFx0Z2V0UGFyZW50KGl0ZW0pO1xuXHRcdFx0fSk7XG5cdFx0XHRyZXR1cm4gaXRlbXM7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gY2FsY1RyZWUoKSB7XG5cdFx0XHRnZXRQYXJlbnQodm0uc3RydWN0dXJlKTtcblx0XHR9O1xuXG5cdFx0ZnVuY3Rpb24gZ2V0TmF0aW9uQnlOYW1lKG5hbWUpIHtcblx0XHRcdHZhciBuYXRpb24gPSB7fTtcblx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5kYXRhLCBmdW5jdGlvbiAobmF0KSB7XG5cdFx0XHRcdGlmIChuYXQuY291bnRyeSA9PSBuYW1lKSB7XG5cdFx0XHRcdFx0bmF0aW9uID0gbmF0O1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHRcdHJldHVybiBuYXRpb247XG5cdFx0fTtcblxuXHRcdGZ1bmN0aW9uIGdldE5hdGlvbkJ5SXNvKGlzbykge1xuXHRcdFx0dmFyIG5hdGlvbiA9IHt9O1xuXHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLmRhdGEsIGZ1bmN0aW9uIChuYXQpIHtcblx0XHRcdFx0aWYgKG5hdC5pc28gPT0gaXNvKSB7XG5cdFx0XHRcdFx0bmF0aW9uID0gbmF0O1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdFx0cmV0dXJuIG5hdGlvbjtcblx0XHR9O1xuXG5cdFx0ZnVuY3Rpb24gY3JlYXRlQ2FudmFzKGNvbG9ycykge1xuXG5cdFx0XHR2bS5jYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcblx0XHRcdHZtLmNhbnZhcy53aWR0aCA9IDI4MDtcblx0XHRcdHZtLmNhbnZhcy5oZWlnaHQgPSAxMDtcblx0XHRcdHZtLmN0eCA9IHZtLmNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuXHRcdFx0dmFyIGdyYWRpZW50ID0gdm0uY3R4LmNyZWF0ZUxpbmVhckdyYWRpZW50KDAsIDAsIDI4MCwgMTApO1xuXHRcdFx0Z3JhZGllbnQuYWRkQ29sb3JTdG9wKDEsICdyZ2JhKDI1NSwyNTUsMjU1LDApJyk7XG5cdFx0XHRncmFkaWVudC5hZGRDb2xvclN0b3AoMC41MywgJ3JnYmEoMTI4LCAyNDMsIDE5OCwxKScpO1xuXHRcdFx0Z3JhZGllbnQuYWRkQ29sb3JTdG9wKDAsICdyZ2JhKDEwMiwxMDIsMTAyLDEpJyk7XG5cdFx0XHR2bS5jdHguZmlsbFN0eWxlID0gZ3JhZGllbnQ7XG5cdFx0XHR2bS5jdHguZmlsbFJlY3QoMCwgMCwgMjgwLCAxMCk7XG5cdFx0XHR2bS5wYWxldHRlID0gdm0uY3R4LmdldEltYWdlRGF0YSgwLCAwLCAyNTcsIDEpLmRhdGE7XG5cdFx0XHQvL2RvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdib2R5JylbMF0uYXBwZW5kQ2hpbGQodm0uY2FudmFzKTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiB1cGRhdGVDYW52YXMoY29sb3IpIHtcblx0XHRcdHZhciBncmFkaWVudCA9IHZtLmN0eC5jcmVhdGVMaW5lYXJHcmFkaWVudCgwLCAwLCAyODAsIDEwKTtcblx0XHRcdGdyYWRpZW50LmFkZENvbG9yU3RvcCgxLCAncmdiYSgyNTUsMjU1LDI1NSwwKScpO1xuXHRcdFx0Z3JhZGllbnQuYWRkQ29sb3JTdG9wKDAuNTMsIGNvbG9yKTtcblx0XHRcdGdyYWRpZW50LmFkZENvbG9yU3RvcCgwLCAncmdiYSgxMDIsMTAyLDEwMiwxKScpO1xuXHRcdFx0dm0uY3R4LmZpbGxTdHlsZSA9IGdyYWRpZW50O1xuXHRcdFx0dm0uY3R4LmZpbGxSZWN0KDAsIDAsIDI4MCwgMTApO1xuXHRcdFx0dm0ucGFsZXR0ZSA9IHZtLmN0eC5nZXRJbWFnZURhdGEoMCwgMCwgMjU3LCAxKS5kYXRhO1xuXHRcdFx0Ly9kb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnYm9keScpWzBdLmFwcGVuZENoaWxkKHZtLmNhbnZhcyk7XG5cdFx0fTtcblxuXHRcdGZ1bmN0aW9uIGludmVydGVkU3R5bGUoZmVhdHVyZSkge1xuXHRcdFx0dmFyIHN0eWxlID0ge307XG5cdFx0XHR2YXIgaXNvID0gZmVhdHVyZS5wcm9wZXJ0aWVzLmFkbTBfYTM7XG5cdFx0XHR2YXIgbmF0aW9uID0gZ2V0TmF0aW9uQnlJc28oaXNvKTtcblx0XHRcdHZhciBmaWVsZCA9IHZtLnN0cnVjdHVyZS5uYW1lIHx8ICdzY29yZSc7XG5cblx0XHRcdGNvbnNvbGUubG9nKHZtLnN0cnVjdHVyZS5uYW1lKTtcblx0XHRcdHZhciBjb2xvclBvcyA9IHBhcnNlSW50KDI1NiAvIDEwMCAqIG5hdGlvbltmaWVsZF0pICogNDtcblx0XHRcdHZhciBjb2xvciA9ICdyZ2JhKCcgKyB2bS5wYWxldHRlW2NvbG9yUG9zXSArICcsICcgKyB2bS5wYWxldHRlW2NvbG9yUG9zICsgMV0gKyAnLCAnICsgdm0ucGFsZXR0ZVtjb2xvclBvcyArIDJdICsgJywnICsgdm0ucGFsZXR0ZVtjb2xvclBvcyArIDNdICsgJyknO1xuXHRcdFx0c3R5bGUuY29sb3IgPSAncmdiYSgwLDAsMCwwKSc7XG5cdFx0XHRzdHlsZS5vdXRsaW5lID0ge1xuXHRcdFx0XHRjb2xvcjogJ3JnYmEoMCwwLDAsMCknLFxuXHRcdFx0XHRzaXplOiAwXG5cdFx0XHR9O1xuXHRcdFx0c3R5bGUuc2VsZWN0ZWQgPSB7XG5cdFx0XHRcdGNvbG9yOiBjb2xvcixcblx0XHRcdFx0b3V0bGluZToge1xuXHRcdFx0XHRcdGNvbG9yOiAncmdiYSgwLDAsMCwwLjMpJyxcblx0XHRcdFx0XHRzaXplOiAyXG5cdFx0XHRcdH1cblx0XHRcdH07XG5cdFx0XHRyZXR1cm4gc3R5bGU7XG5cdFx0fTtcblxuXHRcdGZ1bmN0aW9uIGNvdW50cmllc1N0eWxlKGZlYXR1cmUpIHtcblxuXHRcdFx0dmFyIHN0eWxlID0ge307XG5cdFx0XHR2YXIgaXNvID0gZmVhdHVyZS5wcm9wZXJ0aWVzLmFkbTBfYTM7XG5cdFx0XHR2YXIgbmF0aW9uID0gZ2V0TmF0aW9uQnlJc28oaXNvKTtcblx0XHRcdHZhciBmaWVsZCA9IHZtLnN0cnVjdHVyZS5jb2x1bW5fbmFtZSB8fCAnc2NvcmUnO1xuXHRcdFx0dmFyIHR5cGUgPSBmZWF0dXJlLnR5cGU7XG5cdFx0XHRpZihpc28gIT0gdm0uY3VycmVudC5pc28pe1xuXHRcdFx0XHRcdGZlYXR1cmUuc2VsZWN0ZWQgPSBmYWxzZTtcblx0XHRcdH1cblxuXHRcdFx0c3dpdGNoICh0eXBlKSB7XG5cdFx0XHRjYXNlIDM6IC8vJ1BvbHlnb24nXG5cdFx0XHRcdGlmICh0eXBlb2YgbmF0aW9uW2ZpZWxkXSAhPSBcInVuZGVmaW5lZFwiKSB7XG5cblx0XHRcdFx0XHR2YXIgY29sb3JQb3MgPSBwYXJzZUludCgyNTYgLyAxMDAgKiBwYXJzZUludChuYXRpb25bZmllbGRdKSkgKiA0O1xuXHRcdFx0XHRcdHZhciBjb2xvciA9ICdyZ2JhKCcgKyB2bS5wYWxldHRlW2NvbG9yUG9zXSArICcsICcgKyB2bS5wYWxldHRlW2NvbG9yUG9zICsgMV0gKyAnLCAnICsgdm0ucGFsZXR0ZVtjb2xvclBvcyArIDJdICsgJywnICsgdm0ucGFsZXR0ZVtjb2xvclBvcyArIDNdICsgJyknO1xuXHRcdFx0XHRcdHN0eWxlLmNvbG9yID0gJ3JnYmEoJyArIHZtLnBhbGV0dGVbY29sb3JQb3NdICsgJywgJyArIHZtLnBhbGV0dGVbY29sb3JQb3MgKyAxXSArICcsICcgKyB2bS5wYWxldHRlW2NvbG9yUG9zICsgMl0gKyAnLDAuNiknOyAvL2NvbG9yO1xuXHRcdFx0XHRcdHN0eWxlLm91dGxpbmUgPSB7XG5cdFx0XHRcdFx0XHRjb2xvcjogY29sb3IsXG5cdFx0XHRcdFx0XHRzaXplOiAxXG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRzdHlsZS5zZWxlY3RlZCA9IHtcblx0XHRcdFx0XHRcdGNvbG9yOiAncmdiYSgnICsgdm0ucGFsZXR0ZVtjb2xvclBvc10gKyAnLCAnICsgdm0ucGFsZXR0ZVtjb2xvclBvcyArIDFdICsgJywgJyArIHZtLnBhbGV0dGVbY29sb3JQb3MgKyAyXSArICcsMC4zKScsXG5cdFx0XHRcdFx0XHRvdXRsaW5lOiB7XG5cdFx0XHRcdFx0XHRcdGNvbG9yOiAncmdiYSg2Niw2Niw2NiwwLjkpJyxcblx0XHRcdFx0XHRcdFx0c2l6ZTogMlxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0XHRzdHlsZS5jb2xvciA9ICdyZ2JhKDI1NSwyNTUsMjU1LDApJztcblx0XHRcdFx0XHRzdHlsZS5vdXRsaW5lID0ge1xuXHRcdFx0XHRcdFx0Y29sb3I6ICdyZ2JhKDI1NSwyNTUsMjU1LDApJyxcblx0XHRcdFx0XHRcdHNpemU6IDFcblx0XHRcdFx0XHR9O1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRpZiAoZmVhdHVyZS5sYXllci5uYW1lID09PSAnY291bnRyaWVzX2JpZ19nZW9tX2xhYmVsJykge1xuXHRcdFx0XHRzdHlsZS5zdGF0aWNMYWJlbCA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHR2YXIgc3R5bGUgPSB7XG5cdFx0XHRcdFx0XHRodG1sOiBmZWF0dXJlLnByb3BlcnRpZXMubmFtZSxcblx0XHRcdFx0XHRcdGljb25TaXplOiBbMTI1LCAzMF0sXG5cdFx0XHRcdFx0XHRjc3NDbGFzczogJ2xhYmVsLWljb24tdGV4dCdcblx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdHJldHVybiBzdHlsZTtcblx0XHRcdFx0fTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBzdHlsZTtcblx0XHR9O1xuXG5cdFx0JHNjb3BlLiR3YXRjaCgndm0uY3VycmVudCcsIGZ1bmN0aW9uIChuLCBvKSB7XG5cdFx0XHRpZiAobiA9PT0gbykge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0XHRjb25zb2xlLmxvZyhuKTtcblx0XHRcdGlmKG4uaXNvKSB7XG5cdFx0XHRcdGlmKG8uaXNvKXtcblx0XHRcdFx0XHR2bS5tdnRTb3VyY2UubGF5ZXJzLmNvdW50cmllc19iaWdfZ2VvbS5mZWF0dXJlc1tvLmlzb10uc2VsZWN0ZWQgPSBmYWxzZTtcblx0XHRcdFx0fVxuXHRcdFx0XHRjYWxjUmFuaygpO1xuXHRcdFx0XHRmZXRjaE5hdGlvbkRhdGEobi5pc28pO1xuXHRcdFx0XHR2bS5tdnRTb3VyY2UubGF5ZXJzLmNvdW50cmllc19iaWdfZ2VvbS5mZWF0dXJlc1tuLmlzb10uc2VsZWN0ZWQgPSB0cnVlO1xuXHRcdFx0XHRpZigkc3RhdGUuY3VycmVudC5uYW1lID09ICdhcHAuaW5kZXguc2hvdy5zZWxlY3RlZCcgfHwgJHN0YXRlLmN1cnJlbnQubmFtZSA9PSAnYXBwLmluZGV4LnNob3cnKXtcblx0XHRcdFx0XHQkc3RhdGUuZ28oJ2FwcC5pbmRleC5zaG93LnNlbGVjdGVkJywge1xuXHRcdFx0XHRcdFx0aW5kZXg6ICRzdGF0ZS5wYXJhbXMuaW5kZXgsXG5cdFx0XHRcdFx0XHRpdGVtOiBuLmlzb1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkc3RhdGUuZ28oJ2FwcC5pbmRleC5zaG93Jyx7XG5cdFx0XHRcdFx0aW5kZXg6ICRzdGF0ZS5wYXJhbXMuaW5kZXhcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0JHNjb3BlLiR3YXRjaCgndm0uZGlzcGxheS5zZWxlY3RlZENhdCcsIGZ1bmN0aW9uIChuLCBvKSB7XG5cdFx0XHRpZiAobiA9PT0gbykge1xuXHRcdFx0XHRyZXR1cm5cblx0XHRcdH1cblx0XHRcdGlmIChuKVxuXHRcdFx0XHR1cGRhdGVDYW52YXMobi5jb2xvcik7XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0dXBkYXRlQ2FudmFzKCdyZ2JhKDEyOCwgMjQzLCAxOTgsMSknKTtcblx0XHRcdH07XG5cdFx0XHR2bS5jYWxjVHJlZSgpO1xuXHRcdFx0LyppZiAodm0uY29tcGFyZS5hY3RpdmUpIHtcblx0XHRcdFx0JHRpbWVvdXQoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdC8vdm0ubXZ0U291cmNlLnNldFN0eWxlKGludmVydGVkU3R5bGUpO1xuXHRcdFx0XHRcdC8vdm0ubXZ0U291cmNlLnJlZHJhdygpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHQvL3ZtLm12dFNvdXJjZS5zZXRTdHlsZShjb3VudHJpZXNTdHlsZSk7XG5cdFx0XHRcdFx0Ly92bS5tdnRTb3VyY2UucmVkcmF3KCk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSovXG5cblx0XHRcdGlmICh2bS5jdXJyZW50Lmlzbykge1xuXHRcdFx0XHRpZigkc3RhdGUucGFyYW1zLmNvdW50cmllcyl7XG5cdFx0XHRcdFx0JHN0YXRlLmdvKCdhcHAuaW5kZXguc2hvdy5zZWxlY3RlZC5jb21wYXJlJywge1xuXHRcdFx0XHRcdFx0aW5kZXg6IG4ubmFtZSxcblx0XHRcdFx0XHRcdGl0ZW06IHZtLmN1cnJlbnQuaXNvLFxuXHRcdFx0XHRcdFx0Y291bnRyaWVzOiAkc3RhdGUucGFyYW1zLmNvdW50cmllc1xuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZXtcblx0XHRcdFx0XHQkc3RhdGUuZ28oJ2FwcC5pbmRleC5zaG93LnNlbGVjdGVkJywge1xuXHRcdFx0XHRcdFx0aW5kZXg6IG4ubmFtZSxcblx0XHRcdFx0XHRcdGl0ZW06IHZtLmN1cnJlbnQuaXNvXG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JHN0YXRlLmdvKCdhcHAuaW5kZXguc2hvdycsIHtcblx0XHRcdFx0XHRpbmRleDogbi5uYW1lXG5cdFx0XHRcdH0pXG5cdFx0XHR9XG5cblx0XHR9KTtcblx0XHQkc2NvcGUuJHdhdGNoKCd2bS5iYm94JywgZnVuY3Rpb24gKG4sIG8pIHtcblx0XHRcdGlmIChuID09PSBvKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHRcdGNvbnNvbGUubG9nKG4pO1xuXHRcdFx0dmFyIGxhdCA9IFtuLmNvb3JkaW5hdGVzWzBdWzBdWzFdLFxuXHRcdFx0XHRcdFtuLmNvb3JkaW5hdGVzWzBdWzBdWzBdXVxuXHRcdFx0XHRdLFxuXHRcdFx0XHRsbmcgPSBbbi5jb29yZGluYXRlc1swXVsyXVsxXSxcblx0XHRcdFx0XHRbbi5jb29yZGluYXRlc1swXVsyXVswXV1cblx0XHRcdFx0XVxuXHRcdFx0dmFyIHNvdXRoV2VzdCA9IEwubGF0TG5nKG4uY29vcmRpbmF0ZXNbMF1bMF1bMV0sIG4uY29vcmRpbmF0ZXNbMF1bMF1bMF0pLFxuXHRcdFx0XHRub3J0aEVhc3QgPSBMLmxhdExuZyhuLmNvb3JkaW5hdGVzWzBdWzJdWzFdLCBuLmNvb3JkaW5hdGVzWzBdWzJdWzBdKSxcblx0XHRcdFx0Ym91bmRzID0gTC5sYXRMbmdCb3VuZHMoc291dGhXZXN0LCBub3J0aEVhc3QpO1xuXG5cdFx0XHR2YXIgcGFkID0gW1xuXHRcdFx0XHRbMzUwLCAyMDBdLFxuXHRcdFx0XHRbMCwgMjAwXVxuXHRcdFx0XTtcblx0XHRcdGlmICh2bS5jb21wYXJlLmFjdGl2ZSkge1xuXHRcdFx0XHRwYWQgPSBbXG5cdFx0XHRcdFx0WzM1MCwgMF0sXG5cdFx0XHRcdFx0WzAsIDBdXG5cdFx0XHRcdF07XG5cdFx0XHR9XG5cdFx0XHR2bS5tYXAuZml0Qm91bmRzKGJvdW5kcywge1xuXHRcdFx0XHRwYWRkaW5nVG9wTGVmdDogcGFkWzBdLFxuXHRcdFx0XHRwYWRkaW5nQm90dG9tUmlnaHQ6IHBhZFsxXSxcblx0XHRcdFx0bWF4Wm9vbTogNlxuXHRcdFx0fSk7XG5cdFx0fSk7XG5cblx0XHQkc2NvcGUuJG9uKFwiJHN0YXRlQ2hhbmdlU3VjY2Vzc1wiLCBmdW5jdGlvbiAoZXZlbnQsIHRvU3RhdGUsIHRvUGFyYW1zLCBmcm9tU3RhdGUsIGZyb21QYXJhbXMpIHtcblxuXHRcdFx0Lypjb25zb2xlLmxvZygkKVxuXHRcdFx0aWYgKHRvU3RhdGUubmFtZSA9PSBcImFwcC5pbmRleC5zaG93XCIpIHtcblx0XHRcdFx0XHR2bS5jdXJyZW50ID0gXCJcIjtcblx0XHRcdH0gZWxzZSBpZiAodG9TdGF0ZS5uYW1lID09IFwiYXBwLmluZGV4LnNob3cuc2VsZWN0ZWRcIikge1xuXG5cdFx0XHRcdGlmKHRvUGFyYW1zLmluZGV4ICE9IGZyb21QYXJhbXMuaW5kZXgpe1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKCdhbmRlcnMnKVxuXHRcdFx0XHR9XG5cdFx0XHRcdGNvbnNvbGUubG9nKHRvUGFyYW1zLml0ZW0pO1xuXHRcdFx0XHR2bS5zZXRTdGF0ZSh0b1BhcmFtcy5pdGVtKTtcblx0XHRcdFx0Y2FsY1JhbmsoKTtcblx0XHRcdFx0Ly92bS5tdnRTb3VyY2Uub3B0aW9ucy5tdXRleFRvZ2dsZSA9IHRydWU7XG5cdFx0XHRcdERhdGFTZXJ2aWNlLmdldE9uZSgnbmF0aW9ucycsIHZtLmN1cnJlbnQuaXNvKS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG5cdFx0XHRcdFx0dm0uY3VycmVudC5kYXRhID0gZGF0YTtcblx0XHRcdFx0XHREYXRhU2VydmljZS5nZXRPbmUoJ25hdGlvbnMvYmJveCcsIFt2bS5jdXJyZW50Lmlzb10pLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcblx0XHRcdFx0XHRcdHZtLmJib3ggPSBkYXRhO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9KTtcblx0XHRcdH0gZWxzZSBpZiAodG9TdGF0ZS5uYW1lID09IFwiYXBwLmluZGV4LnNob3cuc2VsZWN0ZWQuY29tcGFyZVwiKSB7XG5cdFx0XHRcdHZtLnNldFN0YXRlKHRvUGFyYW1zLml0ZW0pO1xuXHRcdFx0XHQvLyRzY29wZS5hY3RpdmVUYWIgPSAyO1xuXHRcdFx0XHQvKkRhdGFTZXJ2aWNlLmdldE9uZSgnbmF0aW9ucycsIHRvUGFyYW1zLml0ZW0pLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcblx0XHRcdFx0XHR2bS5jb3VudHJ5ID0gZGF0YTtcblx0XHRcdFx0XHREYXRhU2VydmljZS5nZXRPbmUoJ25hdGlvbnMvYmJveCcsIFt2bS5jb3VudHJ5Lmlzb10pLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcblx0XHRcdFx0XHRcdHZtLmJib3ggPSBkYXRhO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9KTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHZtLmN1cnJlbnQgPSBcIlwiO1xuXHRcdFx0fSovXG5cdFx0fSk7XG5cblx0XHRmdW5jdGlvbiBkcmF3Q291bnRyaWVzKCkge1xuXHRcdFx0bGVhZmxldERhdGEuZ2V0TWFwKCdtYXAnKS50aGVuKGZ1bmN0aW9uIChtYXApIHtcblx0XHRcdFx0dm0ubWFwID0gbWFwO1xuXHRcdFx0XHR2bS5tdnRTb3VyY2UgPSBWZWN0b3JsYXllclNlcnZpY2UuZ2V0TGF5ZXIoKTtcblx0XHRcdFx0JHRpbWVvdXQoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdGlmKCRzdGF0ZS5wYXJhbXMuY291bnRyaWVzKXtcblx0XHRcdFx0XHRcdHZtLm12dFNvdXJjZS5vcHRpb25zLm11dGV4VG9nZ2xlID0gZmFsc2U7XG5cdFx0XHRcdFx0XHR2bS5tdnRTb3VyY2Uuc2V0U3R5bGUoaW52ZXJ0ZWRTdHlsZSk7XG5cdFx0XHRcdFx0XHR2bS5tdnRTb3VyY2UubGF5ZXJzLmNvdW50cmllc19iaWdfZ2VvbS5mZWF0dXJlc1t2bS5jdXJyZW50Lmlzb10uc2VsZWN0ZWQgPSB0cnVlO1xuXHRcdFx0XHRcdFx0dmFyIGNvdW50cmllcyA9ICRzdGF0ZS5wYXJhbXMuY291bnRyaWVzLnNwbGl0KCctdnMtJyk7XG5cdFx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2goY291bnRyaWVzLCBmdW5jdGlvbihpc28pe1xuXHRcdFx0XHRcdFx0XHR2bS5tdnRTb3VyY2UubGF5ZXJzLmNvdW50cmllc19iaWdfZ2VvbS5mZWF0dXJlc1tpc29dLnNlbGVjdGVkID0gdHJ1ZTtcblx0XHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2V7XG5cdFx0XHRcdFx0XHR2bS5tdnRTb3VyY2Uuc2V0U3R5bGUoY291bnRyaWVzU3R5bGUpO1xuXHRcdFx0XHRcdFx0aWYoJHN0YXRlLnBhcmFtcy5pdGVtKXtcblx0XHRcdFx0XHRcdFx0XHR2bS5tdnRTb3VyY2UubGF5ZXJzLmNvdW50cmllc19iaWdfZ2VvbS5mZWF0dXJlc1skc3RhdGUucGFyYW1zLml0ZW1dLnNlbGVjdGVkID0gdHJ1ZTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Ly92bS5tdnRTb3VyY2UucmVkcmF3KCk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHR2bS5tdnRTb3VyY2Uub3B0aW9ucy5vbkNsaWNrID0gZnVuY3Rpb24gKGV2dCwgdCkge1xuXHRcdFx0XHRcdGlmICghdm0uY29tcGFyZS5hY3RpdmUpIHtcblx0XHRcdFx0XHRcdHZhciBjID0gZ2V0TmF0aW9uQnlJc28oZXZ0LmZlYXR1cmUucHJvcGVydGllcy5hZG0wX2EzKTtcblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKGV2dC5mZWF0dXJlLnByb3BlcnRpZXMuYWRtMF9hMywgYywgdm0uY3VycmVudCk7XG5cdFx0XHRcdFx0XHRpZiAodHlwZW9mIGNbdm0uc3RydWN0dXJlLm5hbWVdICE9IFwidW5kZWZpbmVkXCIpIHtcblx0XHRcdFx0XHRcdFx0dm0uY3VycmVudCA9IGdldE5hdGlvbkJ5SXNvKGV2dC5mZWF0dXJlLnByb3BlcnRpZXMuYWRtMF9hMyk7XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRUb2FzdFNlcnZpY2UuZXJyb3IoJ05vIGluZm8gYWJvdXQgdGhpcyBsb2NhdGlvbiEnKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0dmFyIGMgPSBnZXROYXRpb25CeUlzbyhldnQuZmVhdHVyZS5wcm9wZXJ0aWVzLmFkbTBfYTMpO1xuXHRcdFx0XHRcdFx0aWYgKHR5cGVvZiBjW3ZtLnN0cnVjdHVyZS5uYW1lXSAhPSBcInVuZGVmaW5lZFwiKSB7XG5cdFx0XHRcdFx0XHRcdHZtLnRvZ2dsZUNvdW50cmllTGlzdChjKTtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFRvYXN0U2VydmljZS5lcnJvcignTm8gaW5mbyBhYm91dCB0aGlzIGxvY2F0aW9uIScpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fTtcblx0fSk7XG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0luZGV4YmFzZUN0cmwnLCBmdW5jdGlvbiAoJHNjb3BlLCRzdGF0ZSkge1xuXHRcdC8vXG4gICAgJHNjb3BlLiRzdGF0ZSA9ICRzdGF0ZTtcblx0fSk7XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdIZWFkZXJDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCAkcm9vdFNjb3BlLCAkYXV0aCwgdG9hc3RyKXtcblxuXHRcdHZhciB2bSA9IHRoaXM7XG5cdFx0dm0uaXNBdXRoZW50aWNhdGVkID0gaXNBdXRoZW50aWNhdGVkO1xuXHRcdHZtLmRvTG9nb3V0ID0gZG9Mb2dvdXQ7XG5cdFx0dm0ub3Blbk1lbnUgPSBvcGVuTWVudTtcblxuXHRcdGZ1bmN0aW9uIGlzQXV0aGVudGljYXRlZCgpe1xuXHRcdFx0IHJldHVybiAkYXV0aC5pc0F1dGhlbnRpY2F0ZWQoKTtcblx0XHR9XG5cdFx0ZnVuY3Rpb24gZG9Mb2dvdXQoKXtcblx0XHRcdGlmKCRhdXRoLmlzQXV0aGVudGljYXRlZCgpKXtcblx0XHRcdFx0JGF1dGgubG9nb3V0KCkudGhlbihmdW5jdGlvbihkYXRhKXtcblx0XHRcdFx0XHR0b2FzdHIuc3VjY2VzcygnWW91IGhhdmUgc3VjY2Vzc2Z1bGx5IGxvZ2dlZCBvdXQnKTtcblx0XHRcdFx0fSkuY2F0Y2goZnVuY3Rpb24ocmVzcG9uc2Upe1xuXG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH1cblx0XHR2YXIgb3JpZ2luYXRvckV2O1xuICAgIGZ1bmN0aW9uIG9wZW5NZW51KCRtZE9wZW5NZW51LCBldikge1xuICAgICAgb3JpZ2luYXRvckV2ID0gZXY7XG4gICAgICAkbWRPcGVuTWVudShldik7XG4gICAgfTtcblx0XHQkc2NvcGUuJHdhdGNoKGZ1bmN0aW9uKCl7XG5cdFx0XHRyZXR1cm4gJHJvb3RTY29wZS5jdXJyZW50X3BhZ2U7XG5cdFx0fSwgZnVuY3Rpb24obmV3UGFnZSl7XG5cdFx0XHQkc2NvcGUuY3VycmVudF9wYWdlID0gbmV3UGFnZSB8fCAnUGFnZSBOYW1lJztcblx0XHR9KTtcblxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdJbmRleGVkaXRvckN0cmwnLCBmdW5jdGlvbiAoJGZpbHRlcixEYXRhU2VydmljZSkge1xuXHRcdC8vXG5cdFx0dmFyIHZtID0gdGhpcztcblxuXHRcdHZtLmRhdGFwcm92aWRlcnMgPSBbXTtcblx0XHR2bS5zZWxlY3RlZEl0ZW0gPSBudWxsO1xuXHRcdHZtLnNlYXJjaFRleHQgPSBudWxsO1xuXHRcdHZtLnF1ZXJ5U2VhcmNoID0gcXVlcnlTZWFyY2g7XG5cbiAgICBhY3RpdmF0ZSgpO1xuXG4gICAgZnVuY3Rpb24gYWN0aXZhdGUoKXtcbiAgICAgIGxvYWRBbGwoKTtcbiAgICB9XG5cdFx0ZnVuY3Rpb24gcXVlcnlTZWFyY2gocXVlcnkpIHtcbiAgICAgIGNvbnNvbGUubG9nKCRmaWx0ZXIoJ2ZpbmRieW5hbWUnKSh2bS5kYXRhcHJvdmlkZXJzLCBxdWVyeSwgJ3RpdGxlJykpO1xuXHRcdFx0dmFyIHJlc3VsdHMgPSBxdWVyeSA/ICRmaWx0ZXIoJ2ZpbmRieW5hbWUnKSh2bS5kYXRhcHJvdmlkZXJzLCBxdWVyeSwgJ3RpdGxlJykgOiBbXTtcbiAgICAgIGNvbnNvbGUubG9nKHJlc3VsdHMpO1xuXHRcdFx0cmV0dXJuIHJlc3VsdHM7XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIGxvYWRBbGwoKSB7XG4gICAgICBEYXRhU2VydmljZS5nZXRBbGwoJ2RhdGFwcm92aWRlcnMnKS50aGVuKGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICB2bS5kYXRhcHJvdmlkZXJzID0gZGF0YTtcbiAgICAgIH0pO1xuXHRcdH1cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdMb2dpbkN0cmwnLCBmdW5jdGlvbigkc3RhdGUsICRhdXRoLCB0b2FzdHIpe1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuICAgICAgICB2bS5kb0xvZ2luID0gZG9Mb2dpbjtcbiAgICAgICAgdm0uY2hlY2tMb2dnZWRJbiA9IGNoZWNrTG9nZ2VkSW47XG4gICAgICAgIHZtLnVzZXIgPSB7XG4gICAgICAgICAgZW1haWw6JycsXG4gICAgICAgICAgcGFzc3dvcmQ6JydcbiAgICAgICAgfTtcblxuICAgICAgICBhY3RpdmF0ZSgpO1xuXG4gICAgICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCl7XG4gICAgICAgICAgdm0uY2hlY2tMb2dnZWRJbigpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gY2hlY2tMb2dnZWRJbigpe1xuXG4gICAgICAgICAgaWYoJGF1dGguaXNBdXRoZW50aWNhdGVkKCkpe1xuICAgICAgICAgICAgLy8kc3RhdGUuZ28oJ2FwcC5pbmRleC5zaG93Jywge2luZGV4OidlcGknfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGRvTG9naW4oKXtcbiAgICAgICAgICAkYXV0aC5sb2dpbih2bS51c2VyKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgICAgICAgIHRvYXN0ci5zdWNjZXNzKCdZb3UgaGF2ZSBzdWNjZXNzZnVsbHkgc2lnbmVkIGluJyk7XG4gICAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC5pbmRleC5zaG93Jyx7aW5kZXg6J2VwaSd9KVxuICAgICAgICAgIH0pLmNhdGNoKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgICAgICAgIHRvYXN0ci5lcnJvcignUGxlYXNlIGNoZWNrIHlvdXIgZW1haWwgYW5kIHBhc3N3b3JkJywgJ1NvbWV0aGluZyB3ZW50IHdyb25nJyk7XG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ01hcEN0cmwnLCBmdW5jdGlvbiAobGVhZmxldERhdGEsIFZlY3RvcmxheWVyU2VydmljZSkge1xuXHRcdC8vXG5cdFx0dmFyIHZtID0gdGhpcztcblx0XHR2YXIgYXBpS2V5ID0gJ3BrLmV5SjFJam9pYldGbmJtOXNieUlzSW1FaU9pSnVTRmRVWWtnNEluMC41SE95a0trMHBOUDFOM2lzZlBRR1RRJztcblx0XHR2bS5kZWZhdWx0cyA9IHtcblx0XHRcdHNjcm9sbFdoZWVsWm9vbTogZmFsc2Vcblx0XHR9O1xuXHRcdHZtLmNlbnRlciA9IHtcblx0XHRcdGxhdDogMCxcblx0XHRcdGxuZzogMCxcblx0XHRcdHpvb206IDNcblx0XHR9O1xuXHRcdHZtLmxheWVycyA9IHtcblx0XHRcdGJhc2VsYXllcnM6IHtcblx0XHRcdFx0eHl6OiB7XG5cdFx0XHRcdFx0bmFtZTogJ01hcEJveCBPdXRkb29ycyBNb2QnLFxuXHRcdFx0XHRcdHVybDogJ2h0dHBzOi8ve3N9LnRpbGVzLm1hcGJveC5jb20vdjQvdmFsZGVycmFtYS5kODYxMTRiNi97en0ve3h9L3t5fS5wbmc/YWNjZXNzX3Rva2VuPScgKyBhcGlLZXksXG5cdFx0XHRcdFx0dHlwZTogJ3h5eicsXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdFx0bGVhZmxldERhdGEuZ2V0TWFwKCdtYXAnKS50aGVuKGZ1bmN0aW9uKG1hcCkge1xuXHRcdFx0dmFyIHVybCA9ICdodHRwOi8vdjIyMDE1MDUyODM1ODI1MzU4LnlvdXJ2c2VydmVyLm5ldDozMDAxL3NlcnZpY2VzL3Bvc3RnaXMvY291bnRyaWVzX2JpZy9nZW9tL3ZlY3Rvci10aWxlcy97en0ve3h9L3t5fS5wYmY/ZmllbGRzPWlkLGFkbWluLGFkbTBfYTMsd2JfYTMsc3VfYTMsaXNvX2EzLG5hbWUsbmFtZV9sb25nJzsgLy9cblx0XHRcdHZhciBsYXllciA9IG5ldyBMLlRpbGVMYXllci5NVlRTb3VyY2Uoe1xuXHRcdFx0XHR1cmw6IHVybCxcblx0XHRcdFx0ZGVidWc6IGZhbHNlLFxuXHRcdFx0XHRjbGlja2FibGVMYXllcnM6IFsnY291bnRyaWVzX2JpZ19nZW9tJ10sXG5cdFx0XHRcdG11dGV4VG9nZ2xlOiB0cnVlLFxuXHRcdFx0XHRnZXRJREZvckxheWVyRmVhdHVyZTogZnVuY3Rpb24oZmVhdHVyZSkge1xuXHRcdFx0XHRcdHJldHVybiBmZWF0dXJlLnByb3BlcnRpZXMuYWRtMF9hMztcblx0XHRcdFx0fSxcblx0XHRcdFx0ZmlsdGVyOiBmdW5jdGlvbihmZWF0dXJlLCBjb250ZXh0KSB7XG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdFx0IG1hcC5hZGRMYXllcihWZWN0b3JsYXllclNlcnZpY2Uuc2V0TGF5ZXIobGF5ZXIpKTtcblx0XHRcdCB2YXIgbGFiZWxzTGF5ZXIgPSBMLnRpbGVMYXllcignaHR0cHM6Ly97c30udGlsZXMubWFwYm94LmNvbS92NC9tYWdub2xvLjA2MDI5YTljL3t6fS97eH0ve3l9LnBuZz9hY2Nlc3NfdG9rZW49JyArIGFwaUtleSk7XG5cdFx0XHQgbWFwLmFkZExheWVyKGxhYmVsc0xheWVyKTtcblx0XHRcdCBsYWJlbHNMYXllci5icmluZ1RvRnJvbnQoKTtcblx0XHR9KTtcblx0fSk7XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignU2VsZWN0ZWRDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBnZXRDb3VudHJ5LCBWZWN0b3JsYXllclNlcnZpY2UsICRmaWx0ZXIpe1xuICAgICAgICAvL1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuICAgICAgICB2bS5zdHJ1Y3R1cmUgPSAkc2NvcGUuJHBhcmVudC52bS5zdHJ1Y3R1cmU7XG4gICAgICAgIHZtLmRpc3BsYXkgPSAkc2NvcGUuJHBhcmVudC52bS5kaXNwbGF5O1xuICAgICAgICB2bS5kYXRhID0gJHNjb3BlLiRwYXJlbnQudm0uZGF0YTtcbiAgICAgICAgdm0uY3VycmVudCA9IGdldENvdW50cnk7XG4gICAgICAgIHZtLm12dFNvdXJjZSA9IFZlY3RvcmxheWVyU2VydmljZS5nZXRMYXllcigpO1xuICAgICAgICB2bS5nZXRSYW5rID0gZ2V0UmFuaztcbiAgICAgICAgdm0uZ2V0T2Zmc2V0ID0gZ2V0T2Zmc2V0O1xuICAgICAgICB2bS5nZXRUZW5kZW5jeSA9IGdldFRlbmRlbmN5O1xuXG4gICAgICAgIGZ1bmN0aW9uIGNhbGNSYW5rKCkge1xuICAgICAgICAgIHZhciByYW5rID0gMDtcbiAgICAgICAgICBhbmd1bGFyLmZvckVhY2godm0uZGF0YSwgZnVuY3Rpb24oaXRlbSkge1xuICAgICAgICAgICAgaXRlbVt2bS5zdHJ1Y3R1cmUuc2NvcmVfZmllbGRfbmFtZV0gPSBwYXJzZUZsb2F0KGl0ZW1bdm0uc3RydWN0dXJlLnNjb3JlX2ZpZWxkX25hbWVdKTtcbiAgICAgICAgICAgIGl0ZW1bJ3Njb3JlJ10gPSBwYXJzZUludChpdGVtWydzY29yZSddKTtcbiAgICAgICAgICB9KVxuICAgICAgICAgIHZhciBmaWx0ZXIgPSAkZmlsdGVyKCdvcmRlckJ5Jykodm0uZGF0YSwgW3ZtLnN0cnVjdHVyZS5zY29yZV9maWVsZF9uYW1lLCBcInNjb3JlXCJdLCB0cnVlKTtcbiAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGZpbHRlci5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKGZpbHRlcltpXS5pc28gPT0gdm0uY3VycmVudC5pc28pIHtcbiAgICAgICAgICAgICAgcmFuayA9IGkgKyAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICB2bS5jdXJyZW50W3ZtLnN0cnVjdHVyZS5zY29yZV9maWVsZF9uYW1lKydfcmFuayddID0gcmFuaztcbiAgICAgICAgICB2bS5jaXJjbGVPcHRpb25zID0ge1xuICAgICAgICAgICAgICBjb2xvcjp2bS5zdHJ1Y3R1cmUuY29sb3IsXG4gICAgICAgICAgICAgIGZpZWxkOnZtLnN0cnVjdHVyZS5zY29yZV9maWVsZF9uYW1lKydfcmFuaydcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gZ2V0UmFuayhjb3VudHJ5KXtcbiAgICAgICAgICB2YXIgZmlsdGVyID0gJGZpbHRlcignb3JkZXJCeScpKHZtLmRhdGEsIFt2bS5zdHJ1Y3R1cmUuc2NvcmVfZmllbGRfbmFtZSwgXCJzY29yZVwiXSwgdHJ1ZSk7XG4gICAgICAgICAgdmFyIHJhbmsgPSAwO1xuICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaChmaWx0ZXIsIGZ1bmN0aW9uKGl0ZW0sIGtleSl7XG4gICAgICAgICAgICBpZihpdGVtLmNvdW50cnkgPT0gY291bnRyeS5jb3VudHJ5KXtcbiAgICAgICAgICAgICAgcmFuayA9IGtleTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgICByZXR1cm4gcmFuaysxO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGdldE9mZnNldCgpIHtcbiAgICBcdFx0XHRpZiAoIXZtLmN1cnJlbnQpIHtcbiAgICBcdFx0XHRcdHJldHVybiAwO1xuICAgIFx0XHRcdH1cbiAgICBcdFx0XHRyZXR1cm4gKHZtLmdldFJhbmsodm0uY3VycmVudCkgLSAyKSAqIDE2O1xuICAgIFx0XHR9O1xuXG4gICAgXHRcdGZ1bmN0aW9uIGdldFRlbmRlbmN5KCkge1xuICAgIFx0XHRcdGlmICghdm0uY3VycmVudCkge1xuICAgIFx0XHRcdFx0cmV0dXJuICdhcnJvd19kcm9wX2Rvd24nXG4gICAgXHRcdFx0fVxuICAgIFx0XHRcdHJldHVybiB2bS5jdXJyZW50LnBlcmNlbnRfY2hhbmdlID4gMCA/ICdhcnJvd19kcm9wX3VwJyA6ICdhcnJvd19kcm9wX2Rvd24nO1xuICAgIFx0XHR9O1xuXG4gICAgICAgICRzY29wZS4kd2F0Y2goJ3ZtLmN1cnJlbnQnLCBmdW5jdGlvbiAobiwgbykge1xuICAgICAgICAgIGlmIChuID09PSBvKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZihvLmlzbyl7XG4gICAgICAgICAgICAgIHZtLm12dFNvdXJjZS5sYXllcnMuY291bnRyaWVzX2JpZ19nZW9tLmZlYXR1cmVzW28uaXNvXS5zZWxlY3RlZCA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2FsY1JhbmsoKTtcbiAgICAgICAgICAgIGZldGNoTmF0aW9uRGF0YShuLmlzbyk7XG5cblxuICAgICAgICB9KTtcbiAgICAgICAgLyo7Ki9cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignU2lkZWJhckN0cmwnLCBmdW5jdGlvbigkc2NvcGUsICRzdGF0ZSl7XG5cblxuXHR9KTtcblxufSkoKTsiLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdTaWdudXBDdHJsJywgZnVuY3Rpb24oKXtcbiAgICAgICAgLy9cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignVG9hc3RzQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgVG9hc3RTZXJ2aWNlKXtcblxuXHRcdCRzY29wZS50b2FzdFN1Y2Nlc3MgPSBmdW5jdGlvbigpe1xuXHRcdFx0VG9hc3RTZXJ2aWNlLnNob3coJ1VzZXIgYWRkZWQgc3VjY2Vzc2Z1bGx5IScpO1xuXHRcdH07XG5cblx0XHQkc2NvcGUudG9hc3RFcnJvciA9IGZ1bmN0aW9uKCl7XG5cdFx0XHRUb2FzdFNlcnZpY2UuZXJyb3IoJ0Nvbm5lY3Rpb24gaW50ZXJydXB0ZWQhJyk7XG5cdFx0fTtcblxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0luZGV4Y3JlYXRvckN0cmwnLCBmdW5jdGlvbigkc2NvcGUsJHJvb3RTY29wZSxEaWFsb2dTZXJ2aWNlLERhdGFTZXJ2aWNlLCAkdGltZW91dCwkc3RhdGUsICRmaWx0ZXIsIGxlYWZsZXREYXRhLCB0b2FzdHIsIEljb25zU2VydmljZSwgVmVjdG9ybGF5ZXJTZXJ2aWNlKXtcbiAgICAgICAgLy9cbiAgICAgICAgdmFyIHZtID0gdGhpcztcbiAgICAgICAgdm0ubWFwID0gbnVsbDtcbiAgICAgICAgdm0uZGF0YSA9IFtdO1xuICAgICAgICB2bS50b1NlbGVjdCA9IFtdO1xuICAgICAgICB2bS5zZWxlY3RlZCA9IFtdO1xuICAgICAgICB2bS5zZWxlY3RlZFJvd3MgPSBbXTtcbiAgICAgICAgdm0uc2VsZWN0ZWRSZXNvdXJjZXMgPVtdO1xuICAgICAgICB2bS5zb3J0ZWRSZXNvdXJjZXMgPSBbXTtcbiAgICAgICAgdm0uaW5kaWNhdG9ycyA9IFtdO1xuICAgICAgICB2bS5ncm91cHMgPSBbXTtcbiAgICAgICAgdm0ubXlEYXRhID0gW107XG4gICAgICAgIHZtLmFkZERhdGFUbyA9IHt9O1xuICAgICAgICB2bS5zZWxlY3RlZEZvckdyb3VwID0gW107XG4gICAgICAgIHZtLmlzb19lcnJvcnMgPSAwO1xuICAgICAgICB2bS5pc29fY2hlY2tlZCA9IGZhbHNlO1xuICAgICAgICB2bS5zYXZlRGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgdm0uc2VsZWN0ZWRJbmRleCA9IDA7XG4gICAgICAgIHZtLnN0ZXAgPSAwO1xuICAgICAgICB2bS5zZWFyY2ggPSBzZWFyY2g7XG4gICAgICAgIHZtLmRlbGV0ZURhdGEgPSBkZWxldGVEYXRhO1xuICAgICAgICB2bS5kZWxldGVTZWxlY3RlZCA9IGRlbGV0ZVNlbGVjdGVkO1xuICAgICAgICB2bS5vbk9yZGVyQ2hhbmdlID0gb25PcmRlckNoYW5nZTtcbiAgICAgICAgdm0ub25QYWdpbmF0aW9uQ2hhbmdlID0gb25QYWdpbmF0aW9uQ2hhbmdlO1xuICAgICAgICB2bS5jaGVja0ZvckVycm9ycyA9IGNoZWNrRm9yRXJyb3JzO1xuICAgICAgICB2bS5jbGVhckVycm9ycyA9IGNsZWFyRXJyb3JzO1xuICAgICAgICB2bS5zaG93VXBsb2FkQ29udGFpbmVyID0gZmFsc2U7XG4gICAgICAgIHZtLm9wZW5DbG9zZSA9IG9wZW5DbG9zZTtcbiAgICAgICAgdm0uY2hlY2tDb2x1bW5EYXRhID0gY2hlY2tDb2x1bW5EYXRhO1xuICAgICAgICB2bS5lZGl0Q29sdW1uRGF0YSA9IGVkaXRDb2x1bW5EYXRhO1xuICAgICAgICB2bS5mZXRjaElzbyA9IGZldGNoSXNvO1xuICAgICAgICB2bS5lZGl0Um93ID0gZWRpdFJvdztcbiAgICAgICAgdm0uc2F2ZURhdGEgPSBzYXZlRGF0YTtcbiAgICAgICAgdm0ubGlzdFJlc291cmNlcyA9IGxpc3RSZXNvdXJjZXM7XG4gICAgICAgIHZtLnRvZ2dsZUxpc3RSZXNvdXJjZXMgPSB0b2dnbGVMaXN0UmVzb3VyY2VzO1xuICAgICAgICB2bS5zZWxlY3RlZFJlc291cmNlID0gc2VsZWN0ZWRSZXNvdXJjZTtcbiAgICAgICAgdm0udG9nZ2xlUmVzb3VyY2UgPSB0b2dnbGVSZXNvdXJjZTtcbiAgICAgICAgdm0uaW5jcmVhc2VQZXJjZW50YWdlID0gaW5jcmVhc2VQZXJjZW50YWdlO1xuICAgICAgICB2bS5kZWNyZWFzZVBlcmNlbnRhZ2UgPSBkZWNyZWFzZVBlcmNlbnRhZ2U7XG4gICAgICAgIHZtLnRvZ2dsZUdyb3VwU2VsZWN0aW9uID0gdG9nZ2xlR3JvdXBTZWxlY3Rpb247XG4gICAgICAgIHZtLmV4aXN0c0luR3JvdXBTZWxlY3Rpb24gPSBleGlzdHNJbkdyb3VwU2VsZWN0aW9uO1xuICAgICAgICB2bS5hZGRHcm91cCA9IGFkZEdyb3VwO1xuICAgICAgICB2bS5jbG9uZVNlbGVjdGlvbiA9IGNsb25lU2VsZWN0aW9uO1xuICAgICAgICB2bS5lZGl0RW50cnkgPSBlZGl0RW50cnk7XG4gICAgICAgIHZtLnJlbW92ZUVudHJ5ID0gcmVtb3ZlRW50cnk7XG4gICAgICAgIHZtLnNhdmVJbmRleCA9IHNhdmVJbmRleDtcbiAgICAgICAgdm0uaWNvbnMgPSBJY29uc1NlcnZpY2UuZ2V0TGlzdCgpO1xuICAgICAgICB2bS5zZWxlY3RGb3JFZGl0aW5nID0gc2VsZWN0Rm9yRWRpdGluZztcbiAgICAgICAgdm0uY2hlY2tGaWVsZHMgPSBjaGVja0ZpZWxkcztcbiAgICAgICAgdm0ubWV0YSA9IHtcbiAgICAgICAgICBpc29fZmllbGQ6ICcnLFxuICAgICAgICAgIGNvdW50cnlfZmllbGQ6JycsXG4gICAgICAgICAgdGFibGU6W11cbiAgICAgICAgfTtcbiAgICAgICAgdm0ucXVlcnkgPSB7XG4gICAgICAgICAgZmlsdGVyOiAnJyxcbiAgICAgICAgICBvcmRlcjogJy1lcnJvcnMnLFxuICAgICAgICAgIGxpbWl0OiAxNSxcbiAgICAgICAgICBwYWdlOiAxXG4gICAgICAgIH07XG5cbiAgICAgICAgdm0udHJlZU9wdGlvbnMgPSB7XG4gICAgICAgICAgYmVmb3JlRHJvcDpmdW5jdGlvbihldmVudCl7XG4gICAgICAgICAgICBpZihldmVudC5kZXN0Lm5vZGVzU2NvcGUgIT0gZXZlbnQuc291cmNlLm5vZGVzU2NvcGUpe1xuICAgICAgICAgICAgICB2YXIgaWR4ID0gZXZlbnQuZGVzdC5ub2Rlc1Njb3BlLiRtb2RlbFZhbHVlLmluZGV4T2YoZXZlbnQuc291cmNlLm5vZGVTY29wZS4kbW9kZWxWYWx1ZSk7XG4gICAgICAgICAgICAgIGlmKGlkeCA+IC0xKXtcbiAgICAgICAgICAgICAgICAgZXZlbnQuc291cmNlLm5vZGVTY29wZS4kJGFwcGx5ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgIHRvYXN0ci5lcnJvcignT25seSBvbmUgZWxlbWVudCBvZiBhIGtpbmQgcGVyIGdyb3VwIHBvc3NpYmxlIScsICdOb3QgYWxsb3dlZCEnKVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBkcm9wcGVkOmZ1bmN0aW9uKGV2ZW50KXtcbiAgICAgICAgICAgIGNhbGNQZXJjZW50YWdlKHZtLmdyb3Vwcyk7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIC8vUnVuIFN0YXJ0dXAtRnVuY2l0b25zXG4gICAgICAgIGFjdGl2YXRlKCk7XG5cbiAgICAgICAgZnVuY3Rpb24gYWN0aXZhdGUoKXtcbiAgICAgICAgICBjbGVhck1hcCgpO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIG9wZW5DbG9zZShhY3RpdmUpe1xuICAgICAgICAgIHJldHVybiBhY3RpdmUgPyAncmVtb3ZlJyA6ICdhZGQnO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGNsZWFyTGF5ZXJTdHlsZShmZWF0dXJlKXtcbiAgICAgIFx0XHRcdHZhciBzdHlsZSA9IHtcbiAgICAgICAgICAgICAgY29sb3I6J3JnYmEoMjU1LDI1NSwyNTUsMCknLFxuICAgICAgICAgICAgICBvdXRsaW5lOiB7XG4gICAgXHRcdFx0XHRcdFx0Y29sb3I6ICdyZ2JhKDI1NSwyNTUsMjU1LDApJyxcbiAgICBcdFx0XHRcdFx0XHRzaXplOiAxXG4gICAgXHRcdFx0XHRcdH1cbiAgICAgICAgICAgIH07XG4gICAgICBcdFx0XHRyZXR1cm4gc3R5bGU7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gY2xlYXJNYXAoKXtcbiAgICAgICAgICBcdGxlYWZsZXREYXRhLmdldE1hcCgnbWFwJykudGhlbihmdW5jdGlvbiAobWFwKSB7XG4gICAgICAgICAgICAgIHZtLm12dFNvdXJjZSA9IFZlY3RvcmxheWVyU2VydmljZS5nZXRMYXllcigpO1xuICAgICAgICAgICAgICAkdGltZW91dChmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIHZtLm12dFNvdXJjZS5zZXRTdHlsZShjbGVhckxheWVyU3R5bGUpO1xuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gc2VhcmNoKHByZWRpY2F0ZSkge1xuICAgICAgICAgIHZtLmZpbHRlciA9IHByZWRpY2F0ZTtcbiAgICAgICAgfTtcbiAgICAgICAgZnVuY3Rpb24gb25PcmRlckNoYW5nZShvcmRlcikge1xuICAgICAgICAgIHJldHVybiB2bS5kYXRhID0gJGZpbHRlcignb3JkZXJCeScpKHZtLmRhdGEsIFtvcmRlcl0sIHRydWUpXG4gICAgICAgIH07XG4gICAgICAgIGZ1bmN0aW9uIG9uUGFnaW5hdGlvbkNoYW5nZShwYWdlLCBsaW1pdCkge1xuICAgICAgICAgIC8vY29uc29sZS5sb2cocGFnZSwgbGltaXQpO1xuICAgICAgICAgIC8vcmV0dXJuICRudXRyaXRpb24uZGVzc2VydHMuZ2V0KCRzY29wZS5xdWVyeSwgc3VjY2VzcykuJHByb21pc2U7XG4gICAgICAgIH07XG4gICAgICAgIGZ1bmN0aW9uIGNoZWNrRm9yRXJyb3JzKGl0ZW0pe1xuICAgICAgICAgIHJldHVybiBpdGVtLmVycm9ycy5sZW5ndGggPiAwID8gJ21kLXdhcm4nOiAnJztcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBjbGVhckVycm9ycygpe1xuICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaCh2bS5kYXRhLCBmdW5jdGlvbihyb3csIGtleSl7XG4gICAgICAgICAgICBhbmd1bGFyLmZvckVhY2gocm93LmRhdGFbMF0sIGZ1bmN0aW9uKGl0ZW0sIGspe1xuICAgICAgICAgICAgICBpZihpc05hTihpdGVtKSB8fCBpdGVtIDwgMCl7XG4gICAgICAgICAgICAgICAgaWYoaXRlbS50b1N0cmluZygpLnRvVXBwZXJDYXNlKCkgPT0gXCJOQVwiIHx8IGl0ZW0gPCAwIHx8IGl0ZW0udG9TdHJpbmcoKS50b1VwcGVyQ2FzZSgpLmluZGV4T2YoJ04vQScpID4gLTEpe1xuICAgICAgICAgICAgICAgICAgdm0uZGF0YVtrZXldLmRhdGFbMF1ba10gPSAnJztcbiAgICAgICAgICAgICAgICAgIHZtLmVycm9ycyAtLTtcbiAgICAgICAgICAgICAgICAgIHJvdy5lcnJvcnMuc3BsaWNlKDAsMSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHN3aXRjaCAoaXRlbSkge1xuICAgICAgICAgICAgICAgIGNhc2UgJ0NhYm8gVmVyZGUnOlxuICAgICAgICAgICAgICAgICAgICAgIHZtLmRhdGFba2V5XS5kYXRhWzBdW2tdICAgPSAnQ2FwZSBWZXJkZSc7XG4gICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIFwiRGVtb2NyYXRpYyBQZW9wbGVzIFJlcHVibGljIG9mIEtvcmVhXCI6XG4gICAgICAgICAgICAgICAgICAgICAgICB2bS5kYXRhW2tleV0uZGF0YVswXVtrXSAgID0gXCJEZW1vY3JhdGljIFBlb3BsZSdzIFJlcHVibGljIG9mIEtvcmVhXCI7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgXCJDb3RlIGQnSXZvaXJlXCI6XG4gICAgICAgICAgICAgICAgICAgICAgICB2bS5kYXRhW2tleV0uZGF0YVswXVtrXSAgID0gXCJJdm9yeSBDb2FzdFwiO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIFwiTGFvIFBlb3BsZXMgRGVtb2NyYXRpYyBSZXB1YmxpY1wiOlxuICAgICAgICAgICAgICAgICAgICAgICAgdm0uZGF0YVtrZXldLmRhdGFbMF1ba10gICA9IFwiTGFvIFBlb3BsZSdzIERlbW9jcmF0aWMgUmVwdWJsaWNcIjtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmKCFyb3cuZGF0YVswXVt2bS5tZXRhLmlzb19maWVsZF0pe1xuICAgICAgICAgICAgICB2bS5pc29fZXJyb3JzKys7XG4gICAgICAgICAgICAgIHZtLmVycm9ycysrXG4gICAgICAgICAgICAgIHJvdy5lcnJvcnMucHVzaCh7XG4gICAgICAgICAgICAgICAgdHlwZTpcIjJcIixcbiAgICAgICAgICAgICAgICBtZXNzYWdlOlwiSXNvIGZpZWxkIGlzIG5vdCB2YWxpZCFcIixcbiAgICAgICAgICAgICAgICBjb2x1bW46IHZtLm1ldGEuaXNvX2ZpZWxkXG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gY2hlY2tDb2x1bW5EYXRhKGtleSl7XG4gICAgICAgICAgaWYodHlwZW9mIHZtLm1ldGEudGFibGVba2V5XSAhPSBcInVuZGVmaW5lZFwiKXtcbiAgICAgICAgICAgIGlmKHZtLm1ldGEudGFibGVba2V5XS50aXRsZSl7XG4gICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gZWRpdENvbHVtbkRhdGEoZSwga2V5KXtcbiAgICAgICAgICB2bS50b0VkaXQgPSBrZXk7XG4gICAgICAgICAgRGlhbG9nU2VydmljZS5mcm9tVGVtcGxhdGUoJ2VkaXRjb2x1bW4nLCAkc2NvcGUpO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIHNlbGVjdEZvckVkaXRpbmcoa2V5KXtcbiAgICAgICAgICBpZih0eXBlb2Ygdm0uaW5kaWNhdG9yc1trZXldID09IFwidW5kZWZpbmVkXCIpe1xuICAgICAgICAgICAgdm0uaW5kaWNhdG9yc1trZXldID0ge1xuICAgICAgICAgICAgICBjb2x1bW5fbmFtZTprZXksXG4gICAgICAgICAgICAgIHRpdGxlOmtleVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdm0uZWRpdGluZ0l0ZW0gPSBrZXk7XG4gICAgICAgICAgdm0uaW5kaWNhdG9yID0gdm0uaW5kaWNhdG9yc1trZXldO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGRlbGV0ZVNlbGVjdGVkKCl7XG4gICAgICAgICAgYW5ndWxhci5mb3JFYWNoKHZtLnNlbGVjdGVkLCBmdW5jdGlvbihpdGVtLCBrZXkpe1xuICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKGl0ZW0uZXJyb3JzLCBmdW5jdGlvbihlcnJvciwgayl7XG4gICAgICAgICAgICAgIGlmKGVycm9yLnR5cGUgPT0gMil7XG4gICAgICAgICAgICAgICAgdm0uaXNvX2Vycm9ycyAtLTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB2bS5lcnJvcnMgLS07XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgdm0uZGF0YS5zcGxpY2Uodm0uZGF0YS5pbmRleE9mKGl0ZW0pLCAxKTtcbiAgICAgICAgICAgIHZtLnNlbGVjdGVkLnNwbGljZShrZXksIDEpO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIGlmKHZtLmRhdGEubGVuZ3RoID09IDApe1xuICAgICAgICAgICAgdm0uZGVsZXRlRGF0YSgpO1xuICAgICAgICAgICAgJHN0YXRlLmdvdCgnYXBwLmluZGV4LmNyZWF0ZScpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBlZGl0Um93KCl7XG4gICAgICAgICAgdm0ucm93ID0gdm0uc2VsZWN0ZWRbMF07XG4gICAgICAgICAgRGlhbG9nU2VydmljZS5mcm9tVGVtcGxhdGUoJ2VkaXRyb3cnLCAkc2NvcGUpO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGRlbGV0ZURhdGEoKXtcbiAgICAgICAgICB2bS5kYXRhID0gW107XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gZmV0Y2hJc28oKXtcbiAgICAgICAgICBpZighdm0ubWV0YS5pc29fZmllbGQpe1xuICAgICAgICAgICAgdG9hc3RyLmVycm9yKCdDaGVjayB5b3VyIHNlbGVjdGlvbiBmb3IgdGhlIElTTyBmaWVsZCcsICdDb2x1bW4gbm90IHNwZWNpZmllZCEnKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYoIXZtLm1ldGEuY291bnRyeV9maWVsZCl7XG4gICAgICAgICAgICB0b2FzdHIuZXJyb3IoJ0NoZWNrIHlvdXIgc2VsZWN0aW9uIGZvciB0aGUgQ09VTlRSWSBmaWVsZCcsICdDb2x1bW4gbm90IHNwZWNpZmllZCEnKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYodm0ubWV0YS5jb3VudHJ5X2ZpZWxkID09IHZtLm1ldGEuaXNvX2ZpZWxkKXtcbiAgICAgICAgICAgIHRvYXN0ci5lcnJvcignSVNPIGZpZWxkIGFuZCBDT1VOVFJZIGZpZWxkIGNhbiBub3QgYmUgdGhlIHNhbWUnLCAnU2VsZWN0aW9uIGVycm9yIScpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHZtLnRvU2VsZWN0ID0gW107XG4gICAgICAgICAgdm0ubm90Rm91bmQgPSBbXTtcbiAgICAgICAgICB2YXIgZW50cmllcyA9IFtdO1xuICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaCh2bS5kYXRhLCBmdW5jdGlvbihpdGVtLCBrZXkpe1xuICAgICAgICAgICAgICBlbnRyaWVzLnB1c2goe1xuICAgICAgICAgICAgICAgIGlzbzogaXRlbS5kYXRhWzBdW3ZtLm1ldGEuaXNvX2ZpZWxkXSxcbiAgICAgICAgICAgICAgICBuYW1lOiBpdGVtLmRhdGFbMF1bdm0ubWV0YS5jb3VudHJ5X2ZpZWxkXVxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBEYXRhU2VydmljZS5wb3N0KCdjb3VudHJpZXMvYnlJc29OYW1lcycsIHtkYXRhOmVudHJpZXN9KS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKHJlc3BvbnNlLCBmdW5jdGlvbihjb3VudHJ5LCBrZXkpe1xuICAgICAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaCh2bS5kYXRhLCBmdW5jdGlvbihpdGVtLCBrKXtcbiAgICAgICAgICAgICAgICAgICAgaWYoY291bnRyeS5uYW1lID09IGl0ZW0uZGF0YVswXVt2bS5tZXRhLmNvdW50cnlfZmllbGRdKXtcbiAgICAgICAgICAgICAgICAgICAgICBpZihjb3VudHJ5LmRhdGEubGVuZ3RoID4gMSl7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdG9TZWxlY3QgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGVudHJ5OiBpdGVtLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zOiBjb3VudHJ5LmRhdGFcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICB2bS50b1NlbGVjdC5wdXNoKHRvU2VsZWN0KTtcbiAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKHR5cGVvZiBjb3VudHJ5LmRhdGFbMF0gIT0gXCJ1bmRlZmluZWRcIil7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHZtLmRhdGFba10uZGF0YVswXVt2bS5tZXRhLmlzb19maWVsZF0gPSBjb3VudHJ5LmRhdGFbMF0uaXNvO1xuICAgICAgICAgICAgICAgICAgICAgICAgICB2bS5kYXRhW2tdLmRhdGFbMF1bdm0ubWV0YS5jb3VudHJ5X2ZpZWxkXSA9IGNvdW50cnkuZGF0YVswXS5hZG1pbjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoaXRlbS5lcnJvcnMubGVuZ3RoKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbmd1bGFyLmZvckVhY2goaXRlbS5lcnJvcnMsIGZ1bmN0aW9uKGVycm9yLCBlKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKGVycm9yLnR5cGUgPT0gMil7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZtLmlzb19lcnJvcnMgLS07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZtLmVycm9ycyAtLTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbS5lcnJvcnMuc3BsaWNlKGUsIDEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGNvdW50cnkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgaWYodm0udG9TZWxlY3QubGVuZ3RoKXtcbiAgICAgICAgICAgICAgICBEaWFsb2dTZXJ2aWNlLmZyb21UZW1wbGF0ZSgnc2VsZWN0aXNvZmV0Y2hlcnMnLCAkc2NvcGUpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHZtLmlzb19jaGVja2VkID0gdHJ1ZTtcbiAgICAgICAgICB9LCBmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICAgICAgLy8gIGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcbiAgICAgICAgICAgIHRvYXN0ci5lcnJvcignUGxlYXNlIGNoZWNrIHlvdXIgZmllbGQgc2VsZWN0aW9ucycsIHJlc3BvbnNlLmRhdGEubWVzc2FnZSk7XG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBzYXZlRGF0YSgpe1xuICAgICAgICAvLyAgY29uc29sZS5sb2codm0ubWV0YS50YWJsZSk7XG4gICAgICAgICAgLy9jb25zb2xlLmxvZyh2bS5tZXRhLnRhYmxlLCB2bS5kYXRhWzBdLmRhdGFbMF0ubGVuZ3RoKTtcbiAgICAgICAgICAvL2NvbnNvbGUubG9nKHZtLmluZGljYXRvcnMpO1xuICAgICAgICAgIC8vcmV0dXJuIGZhbHNlO1xuXG4gICAgICAgICAgdmFyIGluc2VydERhdGEgPSB7ZGF0YTpbXX07XG4gICAgICAgICAgdmFyIG1ldGEgPSBbXSwgZmllbGRzID0gW107XG4gICAgICAgICAgYW5ndWxhci5mb3JFYWNoKHZtLmRhdGEsIGZ1bmN0aW9uKGl0ZW0sIGtleSl7XG4gICAgICAgICAgICBpZihpdGVtLmVycm9ycy5sZW5ndGggPT0gMCl7XG4gICAgICAgICAgICAgIGl0ZW0uZGF0YVswXS55ZWFyID0gdm0ubWV0YS55ZWFyO1xuICAgICAgICAgICAgICBpbnNlcnREYXRhLmRhdGEucHVzaChpdGVtLmRhdGFbMF0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgdG9hc3RyLmVycm9yKCdUaGVyZSBhcmUgc29tZSBlcnJvcnMgbGVmdCEnLCAnSHVjaCEnKTtcbiAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaCh2bS5kYXRhWzBdLmRhdGFbMF0sIGZ1bmN0aW9uKGl0ZW0sIGtleSl7XG4gICAgICAgICAgICBpZih2bS5pbmRpY2F0b3JzW2tleV0pe1xuICAgICAgICAgICAgICB2YXIgZmllbGQgPSB7XG4gICAgICAgICAgICAgICAgJ2NvbHVtbic6IGtleSxcbiAgICAgICAgICAgICAgICAndGl0bGUnOnZtLmluZGljYXRvcnNba2V5XS50aXRsZSxcbiAgICAgICAgICAgICAgICAnZGVzY3JpcHRpb24nOnZtLmluZGljYXRvcnNba2V5XS5kZXNjcmlwdGlvbixcbiAgICAgICAgICAgICAgICAnbWVhc3VyZV90eXBlX2lkJzp2bS5pbmRpY2F0b3JzW2tleV0ubWVhc3VyZV90eXBlX2lkIHx8IDAsXG4gICAgICAgICAgICAgICAgJ3R5cGUnOiB2bS5pbmRpY2F0b3JzW2tleV0udHlwZSxcbiAgICAgICAgICAgICAgICAnaXNfcHVibGljJzogdm0uaW5kaWNhdG9yc1trZXldLmlzX3B1YmxpYyB8fCAwLFxuICAgICAgICAgICAgICAgICdkYXRhcHJvdmlkZXJfaWQnOiB2bS5pbmRpY2F0b3JzW2tleV0uZGF0YXByb3ZpZGVyLmlkIHx8IDBcbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgdmFyIGNhdGVnb3JpZXMgPSBbXTtcbiAgICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKHZtLmluZGljYXRvcnNba2V5XS5jYXRlZ29yaWVzLCBmdW5jdGlvbihjYXQpe1xuICAgICAgICAgICAgICAgIGNhdGVnb3JpZXMucHVzaChjYXQuaWQpO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgZmllbGQuY2F0ZWdvcmllcyA9IGNhdGVnb3JpZXM7XG4gICAgICAgICAgICAgIGZpZWxkcy5wdXNoKGZpZWxkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgICBhbmd1bGFyLmZvckVhY2godm0uZGF0YS50YWJsZSwgZnVuY3Rpb24oaXRlbSwga2V5KXtcbiAgICAgICAgICAgIG1ldGEucHVzaCh7XG4gICAgICAgICAgICAgIGZpZWxkOmtleSxcbiAgICAgICAgICAgICAgZGF0YTogaXRlbVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9KVxuICAgICAgICAgIHZtLm1ldGEuZmllbGRzID0gZmllbGRzO1xuICAgICAgICAgIHZtLm1ldGEuaW5mbyA9IG1ldGE7XG4gICAgICAgICAgY29uc29sZS5sb2codm0ubWV0YSk7XG4gICAgICAgICAgRGF0YVNlcnZpY2UucG9zdCgnZGF0YS90YWJsZXMnLCB2bS5tZXRhKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgICAgICAgICAgRGF0YVNlcnZpY2UucG9zdCgnZGF0YS90YWJsZXMvJytyZXNwb25zZS50YWJsZV9uYW1lKycvaW5zZXJ0JywgaW5zZXJ0RGF0YSkudGhlbihmdW5jdGlvbihyZXMpe1xuICAgICAgICAgICAgICAgIGlmKHJlcyA9PSB0cnVlKXtcbiAgICAgICAgICAgICAgICAgIHRvYXN0ci5zdWNjZXNzKGluc2VydERhdGEuZGF0YS5sZW5ndGgrJyBpdGVtcyBpbXBvcnRldCB0byAnK3ZtLm1ldGEubmFtZSwnU3VjY2VzcycpO1xuICAgICAgICAgICAgICAgICAgdm0uZGF0YSA9IFtdO1xuICAgICAgICAgICAgICAgICAgdm0uc3RlcCA9IDA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICB9LCBmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICAgICAgICBpZihyZXNwb25zZS5tZXNzYWdlKXtcbiAgICAgICAgICAgICAgdG9hc3RyLmVycm9yKHJlc3BvbnNlLm1lc3NhZ2UsICdPdWNoIScpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gdG9nZ2xlTGlzdFJlc291cmNlcygpe1xuICAgICAgICAgIHZtLnNob3dSZXNvdXJjZXMgPSAhdm0uc2hvd1Jlc291cmNlcztcbiAgICAgICAgICBpZih2bS5zaG93UmVzb3VyY2VzKXtcbiAgICAgICAgICAgIHZtLmxpc3RSZXNvdXJjZXMoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gbGlzdFJlc291cmNlcygpe1xuICAgICAgICAgIGlmKCF2bS5yZXNvdXJjZXMpe1xuICAgICAgICAgICAgRGF0YVNlcnZpY2UuZ2V0QWxsKCdkYXRhL3RhYmxlcycpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgICAgICAgICB2bS5yZXNvdXJjZXMgPSByZXNwb25zZTtcbiAgICAgICAgICAgICAgdm0uc2VsZWN0ZWRSZXNvdXJjZXMgPSBbXSwgdm0uc29ydGVkUmVzb3VyY2VzID0gW107XG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH1cblxuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIHNlbGVjdGVkUmVzb3VyY2UocmVzb3VyY2Upe1xuICAgICAgICAgIHJldHVybiB2bS5zZWxlY3RlZFJlc291cmNlcy5pbmRleE9mKHJlc291cmNlKSA+IC0xID8gdHJ1ZSA6IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGRlbGV0ZUZyb21Hcm91cChyZXNvdXJjZSwgbGlzdCl7XG4gICAgICAgICAgYW5ndWxhci5mb3JFYWNoKGxpc3QsIGZ1bmN0aW9uKGl0ZW0sIGtleSl7XG4gICAgICAgICAgICAgIC8vaWYodHlwZW9mIGl0ZW0uaXNHcm91cCA9PSBcInVuZGVmaW5lZFwiKXtcbiAgICAgICAgICAgICAgICBpZihpdGVtID09IHJlc291cmNlKXtcbiAgICAgICAgICAgICAgICAgIGxpc3Quc3BsaWNlKGtleSwgMSk7XG4gICAgICAgICAgICAgICAgICB2bS5zZWxlY3RlZEZvckdyb3VwLnNwbGljZSh2bS5zZWxlY3RlZEZvckdyb3VwLmluZGV4T2YoaXRlbSksIDEpO1xuICAgICAgICAgICAgICAgICAgdm0uc2VsZWN0ZWRSZXNvdXJjZXMuc3BsaWNlKHZtLnNlbGVjdGVkUmVzb3VyY2VzLmluZGV4T2YoaXRlbSksMSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAvL31cbiAgICAgICAgICAgICAgZGVsZXRlRnJvbUdyb3VwKHJlc291cmNlLCBpdGVtLm5vZGVzKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiB0b2dnbGVSZXNvdXJjZShyZXNvdXJjZSl7XG4gICAgICAgICAgdmFyIGlkeCA9IHZtLnNlbGVjdGVkUmVzb3VyY2VzLmluZGV4T2YocmVzb3VyY2UpO1xuICAgICAgICAgIGlmKCBpZHggPiAtMSl7XG4gICAgICAgICAgICB2bS5zZWxlY3RlZFJlc291cmNlcy5zcGxpY2UoaWR4LCAxKTtcbiAgICAgICAgICAgIGRlbGV0ZUZyb21Hcm91cChyZXNvdXJjZSwgdm0uZ3JvdXBzKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgIHZtLnNlbGVjdGVkUmVzb3VyY2VzLnB1c2gocmVzb3VyY2UpO1xuICAgICAgICAgICAgaWYodm0uc2VsZWN0ZWRGb3JHcm91cC5sZW5ndGggPT0gMSAmJiB0eXBlb2Ygdm0uc2VsZWN0ZWRGb3JHcm91cFswXS5pc0dyb3VwICE9IFwidW5kZWZpbmVkXCIpe1xuICAgICAgICAgICAgICB2bS5zZWxlY3RlZEZvckdyb3VwWzBdLm5vZGVzLnB1c2gocmVzb3VyY2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgICB2bS5ncm91cHMucHVzaChyZXNvdXJjZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy9jYWxjUGVyY2VudGFnZSh2bS5zb3J0ZWRSZXNvdXJjZXMpO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGNhbGNQZXJjZW50YWdlKG5vZGVzKXtcbiAgICAgICAgICBhbmd1bGFyLmZvckVhY2gobm9kZXMsIGZ1bmN0aW9uKG5vZGUsIGtleSl7XG4gICAgICAgICAgICBub2Rlc1trZXldLndlaWdodCA9IHBhcnNlSW50KDEwMCAvIG5vZGVzLmxlbmd0aCk7XG4gICAgICAgICAgICBjYWxjUGVyY2VudGFnZShub2Rlcy5ub2RlKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBpbmNyZWFzZVBlcmNlbnRhZ2UoaXRlbSl7XG4gICAgICAgICAgY29uc29sZS5sb2coaXRlbSk7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gZGVjcmVhc2VQZXJjZW50YWdlKGl0ZW0pe1xuICAgICAgICAgIGNvbnNvbGUubG9nKGl0ZW0pXG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gdG9nZ2xlR3JvdXBTZWxlY3Rpb24oaXRlbSl7XG4gICAgICAgICAgdmFyIGlkeCA9IHZtLnNlbGVjdGVkRm9yR3JvdXAuaW5kZXhPZihpdGVtKTtcbiAgICAgICAgICBpZiggaWR4ID4gLTEpe1xuICAgICAgICAgICAgdm0uc2VsZWN0ZWRGb3JHcm91cC5zcGxpY2UoaWR4LCAxKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgIHZtLnNlbGVjdGVkRm9yR3JvdXAucHVzaChpdGVtKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gZXhpc3RzSW5Hcm91cFNlbGVjdGlvbihpdGVtKXtcbiAgICAgICAgICByZXR1cm4gdm0uc2VsZWN0ZWRGb3JHcm91cC5pbmRleE9mKGl0ZW0pID4gLTE7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gYWRkR3JvdXAoKXtcbiAgICAgICAgICB2YXIgbmV3R3JvdXAgPSB7XG4gICAgICAgICAgICB0aXRsZTonR3JvdXAnLFxuICAgICAgICAgICAgaXNHcm91cDp0cnVlLFxuICAgICAgICAgICAgbm9kZXM6W11cbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgaWYodm0uc2VsZWN0ZWRGb3JHcm91cC5sZW5ndGggPT0gMSAmJiB0eXBlb2Ygdm0uc2VsZWN0ZWRGb3JHcm91cFswXS5pc0dyb3VwICE9IFwidW5kZWZpbmVkXCIpe1xuICAgICAgICAgICAgdm0uc2VsZWN0ZWRGb3JHcm91cFswXS5ub2Rlcy5wdXNoKG5ld0dyb3VwKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSBpZih2bS5zZWxlY3RlZEZvckdyb3VwLmxlbmd0aCA+IDAgKXtcbiAgICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKHZtLnNlbGVjdGVkRm9yR3JvdXAsIGZ1bmN0aW9uKGl0ZW0sIGtleSl7XG4gICAgICAgICAgICAgICAgICBuZXdHcm91cC5ub2Rlcy5wdXNoKGl0ZW0pO1xuICAgICAgICAgICAgICAgICAgZGVsZXRlRnJvbUdyb3VwKGl0ZW0sIHZtLnNlbGVjdGVkRm9yR3JvdXApO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgdm0uZ3JvdXBzLnB1c2gobmV3R3JvdXApO1xuICAgICAgICAgICAgICB2bS5zZWxlY3RlZEZvckdyb3VwID0gW107XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICB2bS5ncm91cHMucHVzaChuZXdHcm91cCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGNsb25lU2VsZWN0aW9uKCl7XG4gICAgICAgICAgdmFyIG5ld0dyb3VwID0ge1xuICAgICAgICAgICAgdGl0bGU6J0Nsb25lZCBFbGVtZW50cycsXG4gICAgICAgICAgICBpc0dyb3VwOnRydWUsXG4gICAgICAgICAgICBub2RlczpbXVxuICAgICAgICAgIH07XG5cbiAgICAgICAgICBhbmd1bGFyLmZvckVhY2godm0uc2VsZWN0ZWRGb3JHcm91cCwgZnVuY3Rpb24oaXRlbSwga2V5KXtcbiAgICAgICAgICAgIG5ld0dyb3VwLm5vZGVzLnB1c2goaXRlbSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgdm0uZ3JvdXBzLnB1c2gobmV3R3JvdXApO1xuICAgICAgICAgIHZtLnNlbGVjdGVkRm9yR3JvdXAgPSBbXTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBlZGl0RW50cnkoaXRlbSl7XG4gICAgICAgICAgdm0uZWRpdEl0ZW0gPSBpdGVtO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIHJlbW92ZUVudHJ5KGl0ZW0sIGxpc3Qpe1xuICAgICAgICAgICAgZGVsZXRlRnJvbUdyb3VwKGl0ZW0sIGxpc3QpO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIHNhdmVJbmRleCgpe1xuICAgICAgICAgIGlmKHZtLnNhdmVEaXNhYmxlZCl7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIHZtLnNhdmVEaXNhYmxlZCA9IHRydWU7XG4gICAgICAgICAgaWYodHlwZW9mIHZtLm5ld0luZGV4ID09ICd1bmRlZmluZWQnKXtcbiAgICAgICAgICAgIHRvYXN0ci5lcnJvcignWW91IG5lZWQgdG8gZW50ZXIgYSB0aXRsZSEnLCdJbmZvIG1pc3NpbmcnKTtcbiAgICAgICAgICAgIHZtLnNhdmVEaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZighdm0ubmV3SW5kZXgudGl0bGUpe1xuICAgICAgICAgICAgdG9hc3RyLmVycm9yKCdZb3UgbmVlZCB0byBlbnRlciBhIHRpdGxlIScsJ0luZm8gbWlzc2luZycpO1xuICAgICAgICAgICAgdm0uc2F2ZURpc2FibGVkID0gZmFsc2U7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIHZtLm5ld0luZGV4LmRhdGEgPSB2bS5ncm91cHM7XG4gICAgICAgICAgRGF0YVNlcnZpY2UucG9zdCgnaW5kZXgnLCB2bS5uZXdJbmRleCkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICAgICAgICB2bS5zYXZlRGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIHRvYXN0ci5zdWNjZXNzKCdZb3VyIEluZGV4IGhhcyBiZWVuIGNyZWF0ZWQnLCAnU3VjY2VzcycpLFxuICAgICAgICAgICAgJHN0YXRlLmdvKCdhcHAuaW5kZXguc2hvdycsIHtpbmRleDpyZXNwb25zZS5uYW1lfSk7XG4gICAgICAgICAgfSxmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICAgICAgICB2bS5zYXZlRGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIHRvYXN0ci5lcnJvcihyZXNwb25zZS5tZXNzYWdlLCdVcHBzISEnKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGNoZWNrRmllbGRzKGRhdGEpe1xuICAgICAgICAgIGNvbnNvbGUubG9nKHZtLmRhdGEpO1xuICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaCh2bS5kYXRhWzBdLm1ldGEuZmllbGRzLCBmdW5jdGlvbihmaWVsZCl7XG5cbiAgICAgICAgICB9KVxuICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xuICAgICAgICB9XG4gICAgICAgICRzY29wZS4kb24oXCIkc3RhdGVDaGFuZ2VTdGFydFwiLCBmdW5jdGlvbiAoZXZlbnQsIHRvU3RhdGUsIHRvUGFyYW1zLCBmcm9tU3RhdGUsIGZyb21QYXJhbXMpIHtcblxuICAgICAgICAgIHN3aXRjaCAodG9TdGF0ZS5uYW1lKSB7XG4gICAgICAgICAgICBjYXNlICdhcHAuaW5kZXguY3JlYXRlLmJhc2ljJzpcbiAgICAgICAgICAgICAgaWYoIXZtLm15RGF0YS5sZW5ndGgpe1xuICAgICAgICAgICAgICAgIHZtLm15RGF0YSA9IERhdGFTZXJ2aWNlLmdldEFsbCgnbWUvZGF0YScpLiRvYmplY3Q7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdhcHAuaW5kZXguY3JlYXRlLmNoZWNrJzpcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdhcHAuaW5kZXguY3JlYXRlLm1ldGEnOlxuICAgICAgICAgICAgICAgIGlmKCF2bS5tZXRhLmlzb19maWVsZCl7XG4gICAgICAgICAgICAgICAgICB0b2FzdHIuZXJyb3IoJ05vIGZpZWxkIGZvciBJU08gQ29kZSBzZWxlY3RlZCEnLCAnRXJyb3InKTtcbiAgICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgJHJvb3RTY29wZS5zdGF0ZUlzTG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnYXBwLmluZGV4LmNyZWF0ZS5maW5hbCc6XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBpZih2bS5kYXRhLmxlbmd0aCl7XG4gICAgICAgICAgICAgICAgICAkc2NvcGUudG9TdGF0ZSA9IHRvU3RhdGU7XG4gICAgICAgICAgICAgICAgICBEaWFsb2dTZXJ2aWNlLmZyb21UZW1wbGF0ZSgnbG9vc2VkYXRhJywgJHNjb3BlLCB2bS5kZWxldGVEYXRhKTtcbiAgICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLnN0YXRlSXNMb2FkaW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgICRzY29wZS4kb24oXCIkc3RhdGVDaGFuZ2VTdWNjZXNzXCIsIGZ1bmN0aW9uIChldmVudCwgdG9TdGF0ZSwgdG9QYXJhbXMsIGZyb21TdGF0ZSwgZnJvbVBhcmFtcykge1xuICAgICAgICAgIGlmKCF2bS5kYXRhLmxlbmd0aCl7XG4gICAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC5pbmRleC5jcmVhdGUnKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgIHN3aXRjaCAodG9TdGF0ZS5uYW1lKSB7XG4gICAgICAgICAgICAgIGNhc2UgJ2FwcC5pbmRleC5jcmVhdGUnOlxuICAgICAgICAgICAgICAgICAgdm0uc3RlcCA9IDA7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIGNhc2UgJ2FwcC5pbmRleC5jcmVhdGUuYmFzaWMnOlxuICAgICAgICAgICAgICAgICAgICB2bS5zdGVwID0gMTtcbiAgICAgICAgICAgICAgICAgICAgdm0uc2hvd1VwbG9hZENvbnRhaW5lciA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIGNhc2UgJ2FwcC5pbmRleC5jcmVhdGUuY2hlY2snOlxuICAgICAgICAgICAgICAgICAgdm0uc3RlcCA9IDI7XG4gICAgICAgICAgICAgICAgICB2bS5zaG93VXBsb2FkQ29udGFpbmVyID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIGNhc2UgJ2FwcC5pbmRleC5jcmVhdGUubWV0YSc6XG4gICAgICAgICAgICAgICAgICB2bS5zdGVwID0gMztcbiAgICAgICAgICAgICAgICAgICAgdm0uc2hvd1VwbG9hZENvbnRhaW5lciA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIGNhc2UgJ2FwcC5pbmRleC5jcmVhdGUuZmluYWwnOlxuICAgICAgICAgICAgICAgICAgdm0uc3RlcCA9IDQ7XG4gICAgICAgICAgICAgICAgICAgIHZtLnNob3dVcGxvYWRDb250YWluZXIgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdVc2VyQ3RybCcsIGZ1bmN0aW9uKCl7XG4gICAgICAgIC8vXG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdVbnN1cHBvcnRlZEJyb3dzZXJDdHJsJywgZnVuY3Rpb24oKXtcbiAgICAgICAgLy9cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0FkZFVzZXJzQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgRGlhbG9nU2VydmljZSl7XG5cbiAgICAgICAgJHNjb3BlLnNhdmUgPSBmdW5jdGlvbigpe1xuXHQgICAgICAgIC8vZG8gc29tZXRoaW5nIHVzZWZ1bFxuICAgICAgICAgICAgRGlhbG9nU2VydmljZS5oaWRlKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgJHNjb3BlLmhpZGUgPSBmdW5jdGlvbigpe1xuICAgICAgICBcdERpYWxvZ1NlcnZpY2UuaGlkZSgpO1xuICAgICAgICB9O1xuXG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdFZGl0Y29sdW1uQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgRGlhbG9nU2VydmljZSl7XG4gICAgICAgICRzY29wZS5uYW1lID0gJHNjb3BlLiRwYXJlbnQudm0udG9FZGl0O1xuICAgICAgICBpZih0eXBlb2YgJHNjb3BlLiRwYXJlbnQudm0ubWV0YS50YWJsZVskc2NvcGUubmFtZV0gPT0gXCJ1bmRlZmluZWRcIil7XG4gICAgICAgICAgJHNjb3BlLiRwYXJlbnQudm0ubWV0YS50YWJsZVskc2NvcGUubmFtZV0gPSB7fTtcbiAgICAgICAgfVxuICAgICAgICBlbHNle1xuICAgICAgICAgIGlmKCRzY29wZS4kcGFyZW50LnZtLm1ldGEudGFibGVbJHNjb3BlLm5hbWVdLnRpdGxlKXtcbiAgICAgICAgICAgICRzY29wZS50aXRsZSA9ICRzY29wZS4kcGFyZW50LnZtLm1ldGEudGFibGVbJHNjb3BlLm5hbWVdLnRpdGxlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZigkc2NvcGUuJHBhcmVudC52bS5tZXRhLnRhYmxlWyRzY29wZS5uYW1lXS5kZXNjcmlwdGlvbil7XG4gICAgICAgICAgICAkc2NvcGUuZGVzY3JpcHRpb24gPSAkc2NvcGUuJHBhcmVudC52bS5tZXRhLnRhYmxlWyRzY29wZS5uYW1lXS5kZXNjcmlwdGlvbjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAkc2NvcGUuc2F2ZSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgJHNjb3BlLiRwYXJlbnQudm0ubWV0YS50YWJsZVskc2NvcGUubmFtZV0udGl0bGUgPSAkc2NvcGUudGl0bGU7XG4gICAgICAgICAgJHNjb3BlLiRwYXJlbnQudm0ubWV0YS50YWJsZVskc2NvcGUubmFtZV0uZGVzY3JpcHRpb24gPSAkc2NvcGUuZGVzY3JpcHRpb247XG4gICAgICAgICAgRGlhbG9nU2VydmljZS5oaWRlKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgJHNjb3BlLmhpZGUgPSBmdW5jdGlvbigpe1xuICAgICAgICBcdERpYWxvZ1NlcnZpY2UuaGlkZSgpO1xuICAgICAgICB9O1xuXG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdFZGl0cm93Q3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgRGlhbG9nU2VydmljZSl7XG4gICAgICAgICRzY29wZS5kYXRhID0gJHNjb3BlLiRwYXJlbnQudm0uc2VsZWN0ZWRbMF07XG4gICAgICAgICRzY29wZS5zYXZlID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICBjb25zb2xlLmxvZygkc2NvcGUuZGF0YSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgJHNjb3BlLmhpZGUgPSBmdW5jdGlvbigpe1xuICAgICAgICBcdERpYWxvZ1NlcnZpY2UuaGlkZSgpO1xuICAgICAgICB9O1xuXG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdMb29zZWRhdGFDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCAkc3RhdGUsIERpYWxvZ1NlcnZpY2Upe1xuXG4gICAgICAgICRzY29wZS5zYXZlID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAkc2NvcGUudm0uZGVsZXRlRGF0YSgpO1xuICAgICAgICAgICAgJHN0YXRlLmdvKCRzY29wZS50b1N0YXRlLm5hbWUpO1xuICAgICAgICAgICAgRGlhbG9nU2VydmljZS5oaWRlKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgJHNjb3BlLmhpZGUgPSBmdW5jdGlvbigpe1xuICAgICAgICBcdERpYWxvZ1NlcnZpY2UuaGlkZSgpO1xuICAgICAgICB9O1xuXG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdTZWxlY3Rpc29mZXRjaGVyc0N0cmwnLCBmdW5jdGlvbigkc2NvcGUsIERpYWxvZ1NlcnZpY2Upe1xuICAgICAgICAkc2NvcGUuaXNvID0gJHNjb3BlLiRwYXJlbnQudm0ubWV0YS5pc29fZmllbGQ7XG4gICAgICAgICRzY29wZS5saXN0ID0gJHNjb3BlLiRwYXJlbnQudm0udG9TZWxlY3Q7XG5cbiAgICAgICAgJHNjb3BlLnNhdmUgPSBmdW5jdGlvbigpe1xuICAgICAgICAgIERpYWxvZ1NlcnZpY2UuaGlkZSgpO1xuICAgICAgICB9O1xuXG4gICAgICAgICRzY29wZS5oaWRlID0gZnVuY3Rpb24oKXtcbiAgICAgICAgXHREaWFsb2dTZXJ2aWNlLmhpZGUoKTtcbiAgICAgICAgfTtcblxuICAgICAgICAkc2NvcGUuJHdhdGNoKCdsaXN0JywgZnVuY3Rpb24obiwgbyl7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhuKTtcbiAgICAgICAgICBpZihuID09PSBvKXtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgYW5ndWxhci5mb3JFYWNoKG4sIGZ1bmN0aW9uKGl0ZW0sIGtleSl7XG4gICAgICAgICAgICBpZihpdGVtLmVudHJ5LmRhdGFbMF1bJHNjb3BlLmlzb10gJiYgIW9ba2V5XS5lbnRyeS5kYXRhWzBdWyRzY29wZS5pc29dKXtcbiAgICAgICAgICAgICAgaXRlbS5lbnRyeS5lcnJvcnMuc3BsaWNlKDAsMSk7XG4gICAgICAgICAgICAgICRzY29wZS4kcGFyZW50LnZtLmlzb19lcnJvcnMgLS07XG4gICAgICAgICAgICAgICRzY29wZS4kcGFyZW50LnZtLmVycm9ycyAtLTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfSwgdHJ1ZSk7XG5cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSggJ2FwcC5jb250cm9sbGVycycgKS5jb250cm9sbGVyKCAnQnViYmxlc0N0cmwnLCBmdW5jdGlvbigpe1xuXHRcdC8vXG5cbiAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRmdW5jdGlvbiBDdXN0b21Ub29sdGlwKHRvb2x0aXBJZCwgd2lkdGgpIHtcblx0XHR2YXIgdG9vbHRpcElkID0gdG9vbHRpcElkO1xuXHRcdHZhciBlbGVtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodG9vbHRpcElkKTtcblx0XHRpZihlbGVtID09IG51bGwpe1xuXHRcdFx0YW5ndWxhci5lbGVtZW50KGRvY3VtZW50KS5maW5kKCdib2R5JykuYXBwZW5kKFwiPGRpdiBjbGFzcz0ndG9vbHRpcCBtZC13aGl0ZWZyYW1lLXozJyBpZD0nXCIgKyB0b29sdGlwSWQgKyBcIic+PC9kaXY+XCIpO1xuXHRcdH1cblx0XHRoaWRlVG9vbHRpcCgpO1xuXHRcdGZ1bmN0aW9uIHNob3dUb29sdGlwKGNvbnRlbnQsIGRhdGEsIGV2ZW50LCBlbGVtZW50KSB7XG5cdFx0XHRhbmd1bGFyLmVsZW1lbnQoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignIycgKyB0b29sdGlwSWQpKS5odG1sKGNvbnRlbnQpO1xuXHRcdFx0YW5ndWxhci5lbGVtZW50KGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyMnICsgdG9vbHRpcElkKSkuY3NzKCdkaXNwbGF5JywgJ2Jsb2NrJyk7XG5cblx0XHRcdHJldHVybiB1cGRhdGVQb3NpdGlvbihldmVudCwgZGF0YSwgZWxlbWVudCk7XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIGhpZGVUb29sdGlwKCkge1xuXHRcdFx0YW5ndWxhci5lbGVtZW50KGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyMnICsgdG9vbHRpcElkKSkuY3NzKCdkaXNwbGF5JywgJ25vbmUnKTtcblx0XHR9XG5cdFx0ZnVuY3Rpb24gdXBkYXRlUG9zaXRpb24oZXZlbnQsIGQsIGVsZW1lbnQpIHtcblx0XHRcdHZhciB0dGlkID0gXCIjXCIgKyB0b29sdGlwSWQ7XG5cdFx0XHR2YXIgeE9mZnNldCA9IDIwO1xuXHRcdFx0dmFyIHlPZmZzZXQgPSAxMDtcblx0XHRcdHZhciBzdmcgPSBlbGVtZW50LmZpbmQoJ3N2ZycpWzBdOy8vZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3N2Z192aXMnKTtcblx0XHRcdHZhciB3c2NyWSA9IHdpbmRvdy5zY3JvbGxZO1xuXHRcdFx0dmFyIHR0dyA9IGFuZ3VsYXIuZWxlbWVudChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHR0aWQpKS5vZmZzZXRXaWR0aDtcblx0XHRcdHZhciB0dGggPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHR0aWQpLm9mZnNldEhlaWdodDtcblx0XHRcdHZhciB0dHRvcCA9IHN2Zy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3AgKyBkLnkgLSB0dGggLyAyO1xuXHRcdFx0dmFyIHR0bGVmdCA9IHN2Zy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5sZWZ0ICsgZC54ICsgZC5yYWRpdXMgKyAxMjtcblx0XHRcdHJldHVybiBhbmd1bGFyLmVsZW1lbnQoZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0dGlkKSkuY3NzKCd0b3AnLCB0dHRvcCArICdweCcpLmNzcygnbGVmdCcsIHR0bGVmdCArICdweCcpO1xuXHRcdH1cblx0XHRyZXR1cm4ge1xuXHRcdFx0c2hvd1Rvb2x0aXA6IHNob3dUb29sdGlwLFxuXHRcdFx0aGlkZVRvb2x0aXA6IGhpZGVUb29sdGlwLFxuXHRcdFx0dXBkYXRlUG9zaXRpb246IHVwZGF0ZVBvc2l0aW9uXG5cdFx0fVxuXHR9XG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZGlyZWN0aXZlcycpLmRpcmVjdGl2ZSgnYnViYmxlcycsIGZ1bmN0aW9uICgkY29tcGlsZSwgSWNvbnNTZXJ2aWNlKSB7XG5cdFx0dmFyIGRlZmF1bHRzO1xuXHRcdGRlZmF1bHRzID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0d2lkdGg6IDMwMCxcblx0XHRcdFx0aGVpZ2h0OiAzMDAsXG5cdFx0XHRcdGxheW91dF9ncmF2aXR5OiAwLFxuXHRcdFx0XHRzaXplZmFjdG9yOjMsXG5cdFx0XHRcdHZpczogbnVsbCxcblx0XHRcdFx0Zm9yY2U6IG51bGwsXG5cdFx0XHRcdGRhbXBlcjogMC4wODUsXG5cdFx0XHRcdGNpcmNsZXM6IG51bGwsXG5cdFx0XHRcdGJvcmRlcnM6IHRydWUsXG5cdFx0XHRcdGxhYmVsczogdHJ1ZSxcblx0XHRcdFx0ZmlsbF9jb2xvcjogZDMuc2NhbGUub3JkaW5hbCgpLmRvbWFpbihbXCJlaFwiLCBcImV2XCJdKS5yYW5nZShbXCIjYTMxMDMxXCIsIFwiI2JlY2NhZVwiXSksXG5cdFx0XHRcdG1heF9hbW91bnQ6ICcnLFxuXHRcdFx0XHRyYWRpdXNfc2NhbGU6ICcnLFxuXHRcdFx0XHRkdXJhdGlvbjogMTAwMCxcblx0XHRcdFx0dG9vbHRpcDogQ3VzdG9tVG9vbHRpcChcImJ1YmJsZXNfdG9vbHRpcFwiLCAyNDApXG5cdFx0XHR9O1xuXHRcdH07XG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlc3RyaWN0OiAnRScsXG5cdFx0XHRzY29wZToge1xuXHRcdFx0XHRjaGFydGRhdGE6ICc9Jyxcblx0XHRcdFx0ZGlyZWN0aW9uOiAnPScsXG5cdFx0XHRcdGdyYXZpdHk6ICc9Jyxcblx0XHRcdFx0c2l6ZWZhY3RvcjogJz0nLFxuXHRcdFx0XHRpbmRleGVyOiAnPScsXG5cdFx0XHRcdGJvcmRlcnM6ICdAJ1xuXHRcdFx0fSxcblx0XHRcdHJlcXVpcmU6ICduZ01vZGVsJyxcblx0XHRcdGxpbms6IGZ1bmN0aW9uIChzY29wZSwgZWxlbSwgYXR0cnMsIG5nTW9kZWwpIHtcblx0XHRcdFx0dmFyIG9wdGlvbnMgPSBhbmd1bGFyLmV4dGVuZChkZWZhdWx0cygpLCBhdHRycyk7XG5cdFx0XHRcdHZhciBub2RlcyA9IFtdLFxuXHRcdFx0XHRcdGxpbmtzID0gW10sXG5cdFx0XHRcdFx0bGFiZWxzID0gW10sXG5cdFx0XHRcdFx0Z3JvdXBzID0gW107XG5cblx0XHRcdFx0dmFyIG1heF9hbW91bnQgPSBkMy5tYXgoc2NvcGUuY2hhcnRkYXRhLCBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdHJldHVybiBwYXJzZUZsb2F0KGQudmFsdWUpO1xuXHRcdFx0XHR9KTtcblx0XHRcdFx0Ly9vcHRpb25zLmhlaWdodCA9IG9wdGlvbnMud2lkdGggKiAxLjE7XG5cdFx0XHRcdG9wdGlvbnMucmFkaXVzX3NjYWxlID0gZDMuc2NhbGUucG93KCkuZXhwb25lbnQoMC41KS5kb21haW4oWzAsIG1heF9hbW91bnRdKS5yYW5nZShbMiwgODVdKTtcblx0XHRcdFx0b3B0aW9ucy5jZW50ZXIgPSB7XG5cdFx0XHRcdFx0eDogb3B0aW9ucy53aWR0aCAvIDIsXG5cdFx0XHRcdFx0eTogb3B0aW9ucy5oZWlnaHQgLyAyXG5cdFx0XHRcdH07XG5cdFx0XHRcdG9wdGlvbnMuY2F0X2NlbnRlcnMgPSB7fTtcblxuXHRcdFx0XHR2YXIgY3JlYXRlX25vZGVzID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdGlmKHNjb3BlLmluZGV4ZXIuY2hpbGRyZW4ubGVuZ3RoID09IDIgJiYgc2NvcGUuaW5kZXhlci5jaGlsZHJlblswXS5jaGlsZHJlbi5sZW5ndGggPiAwKXtcblx0XHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChzY29wZS5pbmRleGVyLmNoaWxkcmVuLCBmdW5jdGlvbiAoZ3JvdXAsIGluZGV4KSB7XG5cdFx0XHRcdFx0XHRcdHZhciBkID0ge1xuXHRcdFx0XHRcdFx0XHRcdHR5cGU6IGdyb3VwLnNjb3JlX2ZpZWxkX25hbWUsXG5cdFx0XHRcdFx0XHRcdFx0bmFtZTogZ3JvdXAudGl0bGUsXG5cdFx0XHRcdFx0XHRcdFx0Z3JvdXA6IGdyb3VwLnNjb3JlX2ZpZWxkX25hbWUsXG5cdFx0XHRcdFx0XHRcdFx0Y29sb3I6IGdyb3VwLmNvbG9yLFxuXHRcdFx0XHRcdFx0XHRcdGljb246IGdyb3VwLmljb24sXG5cdFx0XHRcdFx0XHRcdFx0dW5pY29kZTogSWNvbnNTZXJ2aWNlLmdldFVuaWNvZGUoZ3JvdXAuaWNvbiksXG5cdFx0XHRcdFx0XHRcdFx0ZGF0YTogZ3JvdXAsXG5cdFx0XHRcdFx0XHRcdFx0Y2hpbGRyZW46Z3JvdXAuY2hpbGRyZW5cblx0XHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdFx0bGFiZWxzLnB1c2goZCk7XG5cdFx0XHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChncm91cC5jaGlsZHJlbiwgZnVuY3Rpb24gKGl0ZW0pIHtcblx0XHRcdFx0XHRcdFx0XHRpZiAoc2NvcGUuY2hhcnRkYXRhW2l0ZW0uc2NvcmVfZmllbGRfbmFtZV0pIHtcblx0XHRcdFx0XHRcdFx0XHRcdHZhciBub2RlID0ge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR0eXBlOiBpdGVtLnNjb3JlX2ZpZWxkX25hbWUsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHJhZGl1czogc2NvcGUuY2hhcnRkYXRhW2l0ZW0uc2NvcmVfZmllbGRfbmFtZV0gLyBzY29wZS5zaXplZmFjdG9yLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHR2YWx1ZTogc2NvcGUuY2hhcnRkYXRhW2l0ZW0uc2NvcmVfZmllbGRfbmFtZV0sXG5cdFx0XHRcdFx0XHRcdFx0XHRcdG5hbWU6IGl0ZW0udGl0bGUsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGdyb3VwOiBncm91cC5zY29yZV9maWVsZF9uYW1lLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHR4OiBvcHRpb25zLmNlbnRlci54LFxuXHRcdFx0XHRcdFx0XHRcdFx0XHR5OiBvcHRpb25zLmNlbnRlci55LFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRjb2xvcjogaXRlbS5jb2xvcixcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWNvbjogaXRlbS5pY29uLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHR1bmljb2RlOiBJY29uc1NlcnZpY2UuZ2V0VW5pY29kZShpdGVtLmljb24pLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRkYXRhOiBpdGVtLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRjaGlsZHJlbjppdGVtXG5cdFx0XHRcdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdFx0XHRcdFx0bm9kZXMucHVzaChub2RlKTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRjcmVhdGVfZ3JvdXBzKCk7XG5cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZWxzZXtcblx0XHRcdFx0XHRcdHZhciBkID0ge1xuXHRcdFx0XHRcdFx0XHR0eXBlOiBzY29wZS5pbmRleGVyLnNjb3JlX2ZpZWxkX25hbWUsXG5cdFx0XHRcdFx0XHRcdG5hbWU6IHNjb3BlLmluZGV4ZXIudGl0bGUsXG5cdFx0XHRcdFx0XHRcdGdyb3VwOiBzY29wZS5pbmRleGVyLnNjb3JlX2ZpZWxkX25hbWUsXG5cdFx0XHRcdFx0XHRcdGNvbG9yOiBzY29wZS5pbmRleGVyLmNvbG9yLFxuXHRcdFx0XHRcdFx0XHRpY29uOiBzY29wZS5pbmRleGVyLmljb24sXG5cdFx0XHRcdFx0XHRcdHVuaWNvZGU6IHNjb3BlLmluZGV4ZXIudW5pY29kZSxcblx0XHRcdFx0XHRcdFx0ZGF0YTogc2NvcGUuaW5kZXhlci5kYXRhLFxuXHRcdFx0XHRcdFx0XHRjaGlsZHJlbjogc2NvcGUuaW5kZXhlci5jaGlsZHJlblxuXHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdGxhYmVscy5wdXNoKGQpO1xuXHRcdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKHNjb3BlLmluZGV4ZXIuY2hpbGRyZW4sIGZ1bmN0aW9uIChpdGVtKSB7XG5cdFx0XHRcdFx0XHRcdGlmIChzY29wZS5jaGFydGRhdGFbaXRlbS5zY29yZV9maWVsZF9uYW1lXSkge1xuXHRcdFx0XHRcdFx0XHRcdHZhciBub2RlID0ge1xuXHRcdFx0XHRcdFx0XHRcdFx0dHlwZTogaXRlbS5zY29yZV9maWVsZF9uYW1lLFxuXHRcdFx0XHRcdFx0XHRcdFx0cmFkaXVzOiBzY29wZS5jaGFydGRhdGFbaXRlbS5zY29yZV9maWVsZF9uYW1lXSAvIHNjb3BlLnNpemVmYWN0b3IsXG5cdFx0XHRcdFx0XHRcdFx0XHR2YWx1ZTogc2NvcGUuY2hhcnRkYXRhW2l0ZW0uc2NvcmVfZmllbGRfbmFtZV0gLyBzY29wZS5zaXplZmFjdG9yLFxuXHRcdFx0XHRcdFx0XHRcdFx0bmFtZTogaXRlbS50aXRsZSxcblx0XHRcdFx0XHRcdFx0XHRcdGdyb3VwOiBzY29wZS5pbmRleGVyLnNjb3JlX2ZpZWxkX25hbWUsXG5cdFx0XHRcdFx0XHRcdFx0XHR4OiBvcHRpb25zLmNlbnRlci54LFxuXHRcdFx0XHRcdFx0XHRcdFx0eTogb3B0aW9ucy5jZW50ZXIueSxcblx0XHRcdFx0XHRcdFx0XHRcdGNvbG9yOiBpdGVtLmNvbG9yLFxuXHRcdFx0XHRcdFx0XHRcdFx0aWNvbjogaXRlbS5pY29uLFxuXHRcdFx0XHRcdFx0XHRcdFx0dW5pY29kZTogSWNvbnNTZXJ2aWNlLmdldFVuaWNvZGUoaXRlbS5pY29uKSxcblx0XHRcdFx0XHRcdFx0XHRcdGRhdGE6IGl0ZW0sXG5cdFx0XHRcdFx0XHRcdFx0XHRjaGlsZHJlbjppdGVtXG5cdFx0XHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdFx0XHRub2Rlcy5wdXNoKG5vZGUpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH07XG5cdFx0XHRcdHZhciBjbGVhcl9ub2RlcyA9IGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0bm9kZXMgPSBbXTtcblx0XHRcdFx0XHRsYWJlbHMgPSBbXTtcblx0XHRcdFx0fVxuXHRcdFx0XHR2YXIgY3JlYXRlX2dyb3VwcyA9IGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKG5vZGVzLCBmdW5jdGlvbihub2RlLCBrZXkpe1xuXHRcdFx0XHRcdFx0XHRvcHRpb25zLmNhdF9jZW50ZXJzW25vZGUuZ3JvdXBdID0ge1xuXHRcdFx0XHRcdFx0XHRcdHg6IG9wdGlvbnMud2lkdGggLyAyLFxuXHRcdFx0XHRcdFx0XHRcdHk6IG9wdGlvbnMuaGVpZ2h0IC8gMiArICgxIC0ga2V5KSxcblx0XHRcdFx0XHRcdFx0XHRkYW1wZXI6IDAuMDg1LFxuXHRcdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9O1xuXHRcdFx0XHR2YXIgY3JlYXRlX3ZpcyA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRhbmd1bGFyLmVsZW1lbnQoZWxlbSkuaHRtbCgnJyk7XG5cdFx0XHRcdFx0b3B0aW9ucy52aXMgPSBkMy5zZWxlY3QoZWxlbVswXSkuYXBwZW5kKFwic3ZnXCIpLmF0dHIoXCJ3aWR0aFwiLCBvcHRpb25zLndpZHRoKS5hdHRyKFwiaGVpZ2h0XCIsIG9wdGlvbnMuaGVpZ2h0KS5hdHRyKFwiaWRcIiwgXCJzdmdfdmlzXCIpO1xuXG5cdFx0XHRcdFx0aWYgKCFvcHRpb25zLmJvcmRlcnMpIHtcblx0XHRcdFx0XHRcdHZhciBwaSA9IE1hdGguUEk7XG5cdFx0XHRcdFx0XHRpZihsYWJlbHMubGVuZ3RoID09IDIpe1xuXHRcdFx0XHRcdFx0XHR2YXIgYXJjVG9wID0gZDMuc3ZnLmFyYygpXG5cdFx0XHRcdFx0XHRcdFx0LmlubmVyUmFkaXVzKDEwOSlcblx0XHRcdFx0XHRcdFx0XHQub3V0ZXJSYWRpdXMoMTEwKVxuXHRcdFx0XHRcdFx0XHRcdC5zdGFydEFuZ2xlKC05MCAqIChwaSAvIDE4MCkpIC8vY29udmVydGluZyBmcm9tIGRlZ3MgdG8gcmFkaWFuc1xuXHRcdFx0XHRcdFx0XHRcdC5lbmRBbmdsZSg5MCAqIChwaSAvIDE4MCkpOyAvL2p1c3QgcmFkaWFuc1xuXHRcdFx0XHRcdFx0XHR2YXIgYXJjQm90dG9tID0gZDMuc3ZnLmFyYygpXG5cdFx0XHRcdFx0XHRcdFx0LmlubmVyUmFkaXVzKDEzNClcblx0XHRcdFx0XHRcdFx0XHQub3V0ZXJSYWRpdXMoMTM1KVxuXHRcdFx0XHRcdFx0XHRcdC5zdGFydEFuZ2xlKDkwICogKHBpIC8gMTgwKSkgLy9jb252ZXJ0aW5nIGZyb20gZGVncyB0byByYWRpYW5zXG5cdFx0XHRcdFx0XHRcdFx0LmVuZEFuZ2xlKDI3MCAqIChwaSAvIDE4MCkpOyAvL2p1c3QgcmFkaWFuc1xuXG5cdFx0XHRcdFx0XHRcdG9wdGlvbnMuYXJjVG9wID0gb3B0aW9ucy52aXMuYXBwZW5kKFwicGF0aFwiKVxuXHRcdFx0XHRcdFx0XHRcdC5hdHRyKFwiZFwiLCBhcmNUb3ApXG5cdFx0XHRcdFx0XHRcdFx0LmF0dHIoXCJmaWxsXCIsIGZ1bmN0aW9uKGQpe1xuXHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIGxhYmVsc1swXS5jb2xvciB8fCBcIiNiZTVmMDBcIjtcblx0XHRcdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0XHRcdC5hdHRyKFwiaWRcIiwgXCJhcmNUb3BcIilcblx0XHRcdFx0XHRcdFx0XHQuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIisob3B0aW9ucy53aWR0aC8yKStcIixcIisob3B0aW9ucy5oZWlnaHQvMiAtIG9wdGlvbnMuaGVpZ2h0LzEyKStcIilcIik7XG5cdFx0XHRcdFx0XHRcdG9wdGlvbnMuYXJjQm90dG9tID0gb3B0aW9ucy52aXMuYXBwZW5kKFwicGF0aFwiKVxuXHRcdFx0XHRcdFx0XHRcdC5hdHRyKFwiZFwiLCBhcmNCb3R0b20pXG5cdFx0XHRcdFx0XHRcdFx0LmF0dHIoXCJpZFwiLCBcImFyY0JvdHRvbVwiKVxuXHRcdFx0XHRcdFx0XHRcdC5hdHRyKFwiZmlsbFwiLCBmdW5jdGlvbihkKXtcblx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiBsYWJlbHNbMV0uY29sb3IgfHwgXCIjMDA2YmI2XCI7XG5cdFx0XHRcdFx0XHRcdFx0fSApXG5cdFx0XHRcdFx0XHRcdFx0LmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIrKG9wdGlvbnMud2lkdGgvMikrXCIsXCIrKG9wdGlvbnMuaGVpZ2h0LzIpK1wiKVwiKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGVsc2V7XG5cdFx0XHRcdFx0XHRcdHZhciBhcmMgPSBkMy5zdmcuYXJjKClcblx0XHRcdFx0XHRcdFx0XHQuaW5uZXJSYWRpdXMob3B0aW9ucy53aWR0aC8zIC0gMSlcblx0XHRcdFx0XHRcdFx0XHQub3V0ZXJSYWRpdXMob3B0aW9ucy53aWR0aC8zKVxuXHRcdFx0XHRcdFx0XHRcdC5zdGFydEFuZ2xlKDAgKiAocGkgLyAxODApKSAvL2NvbnZlcnRpbmcgZnJvbSBkZWdzIHRvIHJhZGlhbnNcblx0XHRcdFx0XHRcdFx0XHQuZW5kQW5nbGUoMzYwICogKHBpIC8gMTgwKSk7IC8vanVzdCByYWRpYW5zXG5cblxuXHRcdFx0XHRcdFx0XHRvcHRpb25zLmFyYyA9IG9wdGlvbnMudmlzLmFwcGVuZChcInBhdGhcIilcblx0XHRcdFx0XHRcdFx0XHQuYXR0cihcImRcIiwgYXJjKVxuXHRcdFx0XHRcdFx0XHRcdC5hdHRyKFwiZmlsbFwiLCBsYWJlbHNbMF0uY29sb3IpXG5cdFx0XHRcdFx0XHRcdFx0LmF0dHIoXCJpZFwiLCBcImFyY1RvcFwiKVxuXHRcdFx0XHRcdFx0XHRcdC5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiKyhvcHRpb25zLndpZHRoLzIpK1wiLFwiKyhvcHRpb25zLmhlaWdodC8yKStcIilcIik7XG5cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdGlmKG9wdGlvbnMubGFiZWxzID09IHRydWUgJiYgbGFiZWxzLmxlbmd0aCA9PSAyKXtcblx0XHRcdFx0XHRcdHZhciB0ZXh0TGFiZWxzID0gb3B0aW9ucy52aXMuc2VsZWN0QWxsKCd0ZXh0LmxhYmVscycpLmRhdGEobGFiZWxzKS5lbnRlcigpLmFwcGVuZChcInRleHRcIilcblx0XHRcdFx0XHRcdFx0LmF0dHIoJ2NsYXNzJywgJ2xhYmVscycpXG5cdFx0XHRcdFx0XHRcdC5hdHRyKCdmaWxsJywgZnVuY3Rpb24oZCl7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIGQuY29sb3I7XG5cdFx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0XHQvKlx0LmF0dHIoJ3RyYW5zZm9ybScsIGZ1bmN0aW9uKGQpe1xuXHRcdFx0XHRcdFx0XHRcdHZhciBpbmRleCA9IGxhYmVscy5pbmRleE9mKGQpO1xuXHRcdFx0XHRcdFx0XHRcdGlmKGluZGV4ID4gMCl7XG5cdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gJ3JvdGF0ZSg5MCwgMTAwLCAxMDApJztcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH0pKi9cblx0XHRcdFx0XHRcdFx0LmF0dHIoJ3gnLCBcIjUwJVwiKVxuXHRcdFx0XHRcdFx0XHQuc3R5bGUoJ2ZvbnQtc2l6ZScsICcxLjJlbScpXG5cdFx0XHRcdFx0XHRcdC5zdHlsZSgnY3Vyc29yJywgJ3BvaW50ZXInKVxuXG5cdFx0XHRcdFx0XHRcdC5hdHRyKCd3aWR0aCcsIG9wdGlvbnMud2lkdGgpXG5cdFx0XHRcdFx0XHRcdC5hdHRyKCd0ZXh0LWFuY2hvcicsICdtaWRkbGUnKVxuXHRcdFx0XHRcdFx0XHQub24oJ2NsaWNrJywgZnVuY3Rpb24oZCl7XG5cdFx0XHRcdFx0XHRcdFx0bmdNb2RlbC4kc2V0Vmlld1ZhbHVlKGQuZGF0YSk7XG5cdFx0XHRcdFx0XHRcdFx0bmdNb2RlbC4kcmVuZGVyKCk7XG5cdFx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0XHRcdC5hdHRyKFwieVwiLCBmdW5jdGlvbihkKXtcblx0XHRcdFx0XHRcdFx0XHR2YXIgaW5kZXggPSBsYWJlbHMuaW5kZXhPZihkKTtcblx0XHRcdFx0XHRcdFx0XHRpZihpbmRleCA9PSAwKXtcblx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiAxNTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0ZWxzZXtcblx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiBvcHRpb25zLmhlaWdodCAtIDY7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0XHQudGV4dChmdW5jdGlvbihkKXtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gZC5uYW1lO1xuXHRcdFx0XHRcdFx0XHR9KVxuXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdG9wdGlvbnMuY29udGFpbmVycyA9IG9wdGlvbnMudmlzLnNlbGVjdEFsbCgnZy5ub2RlJykuZGF0YShub2RlcykuZW50ZXIoKS5hcHBlbmQoJ2cnKS5hdHRyKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKCcgKyAob3B0aW9ucy53aWR0aCAvIDIpICsgJywnICsgKG9wdGlvbnMuaGVpZ2h0IC8gMikgKyAnKScpLmF0dHIoJ2NsYXNzJywgJ25vZGUnKTtcblxuXHRcdFx0XHRcdC8qb3B0aW9ucy5jaXJjbGVzID0gb3B0aW9ucy5jb250YWluZXJzLnNlbGVjdEFsbChcImNpcmNsZVwiKS5kYXRhKG5vZGVzLCBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGQuaWQ7XG5cdFx0XHRcdFx0fSk7Ki9cblxuXHRcdFx0XHRcdG9wdGlvbnMuY2lyY2xlcyA9IG9wdGlvbnMuY29udGFpbmVycy5hcHBlbmQoXCJjaXJjbGVcIikuYXR0cihcInJcIiwgMCkuYXR0cihcImZpbGxcIiwgKGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZC5jb2xvciB8fCBvcHRpb25zLmZpbGxfY29sb3IoZC5ncm91cCk7XG5cdFx0XHRcdFx0fSkpLmF0dHIoXCJzdHJva2Utd2lkdGhcIiwgMCkuYXR0cihcInN0cm9rZVwiLCBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGQzLnJnYihvcHRpb25zLmZpbGxfY29sb3IoZC5ncm91cCkpLmRhcmtlcigpO1xuXHRcdFx0XHRcdH0pLmF0dHIoXCJpZFwiLCBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIFwiYnViYmxlX1wiICsgZC5pZDtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRvcHRpb25zLmljb25zID0gb3B0aW9ucy5jb250YWluZXJzLmFwcGVuZChcInRleHRcIilcblx0XHRcdFx0XHRcdC5hdHRyKCdmb250LWZhbWlseScsICdFUEknKVxuXHRcdFx0XHRcdFx0LmF0dHIoJ2ZvbnQtc2l6ZScsIGZ1bmN0aW9uIChkKSB7XG5cblx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0XHQuYXR0cihcInRleHQtYW5jaG9yXCIsIFwibWlkZGxlXCIpXG5cdFx0XHRcdFx0XHQuYXR0cignZmlsbCcsIGZ1bmN0aW9uKGQpe1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gZC51bmljb2RlID8gJyNmZmYnIDogZC5jb2xvcjtcblx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0XHQudGV4dChmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gZC51bmljb2RlIHx8ICcxJ1xuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0b3B0aW9ucy5pY29ucy5vbihcIm1vdXNlb3ZlclwiLCBmdW5jdGlvbiAoZCwgaSkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIHNob3dfZGV0YWlscyhkLCBpLCB0aGlzKTtcblx0XHRcdFx0XHR9KS5vbihcIm1vdXNlb3V0XCIsIGZ1bmN0aW9uIChkLCBpKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gaGlkZV9kZXRhaWxzKGQsIGksIHRoaXMpO1xuXHRcdFx0XHRcdH0pLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24gKGQsIGkpIHtcblxuXHRcdFx0XHRcdFx0bmdNb2RlbC4kc2V0Vmlld1ZhbHVlKGQuZGF0YSk7XG5cdFx0XHRcdFx0XHRuZ01vZGVsLiRyZW5kZXIoKTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRvcHRpb25zLmNpcmNsZXMudHJhbnNpdGlvbigpLmR1cmF0aW9uKG9wdGlvbnMuZHVyYXRpb24pLmF0dHIoXCJyXCIsIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZC5yYWRpdXM7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0b3B0aW9ucy5pY29ucy50cmFuc2l0aW9uKCkuZHVyYXRpb24ob3B0aW9ucy5kdXJhdGlvbikuYXR0cihcImZvbnQtc2l6ZVwiLCBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGQucmFkaXVzICogMS43NSArICdweCc7XG5cdFx0XHRcdFx0fSkuYXR0cigneScsIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZC5yYWRpdXMgKiAuNzUgKyAncHgnO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9O1xuXHRcdFx0XHR2YXIgdXBkYXRlX3ZpcyA9IGZ1bmN0aW9uICgpIHtcblxuXHRcdFx0XHRcdG5vZGVzLmZvckVhY2goZnVuY3Rpb24gKGQsIGkpIHtcblx0XHRcdFx0XHRcdG9wdGlvbnMuY2lyY2xlcy50cmFuc2l0aW9uKCkuZHVyYXRpb24ob3B0aW9ucy5kdXJhdGlvbikuZGVsYXkoaSAqIG9wdGlvbnMuZHVyYXRpb24pXG5cdFx0XHRcdFx0XHRcdC5hdHRyKFwiclwiLCBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0XHRcdGQucmFkaXVzID0gZC52YWx1ZSA9IHNjb3BlLmNoYXJ0ZGF0YVtkLnR5cGVdIC8gc2NvcGUuc2l6ZWZhY3Rvcjtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gc2NvcGUuY2hhcnRkYXRhW2QudHlwZV0gLyBzY29wZS5zaXplZmFjdG9yO1xuXHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdG9wdGlvbnMuaWNvbnMudHJhbnNpdGlvbigpLmR1cmF0aW9uKG9wdGlvbnMuZHVyYXRpb24pLmRlbGF5KGkgKiBvcHRpb25zLmR1cmF0aW9uKVxuXHRcdFx0XHRcdFx0XHQuYXR0cihcImZvbnQtc2l6ZVwiLCBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybiAoc2NvcGUuY2hhcnRkYXRhW2QudHlwZV0gLyBzY29wZS5zaXplZmFjdG9yKSAqIDEuNzUgKyAncHgnXG5cdFx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0XHRcdC5hdHRyKCd5JywgZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gKHNjb3BlLmNoYXJ0ZGF0YVtkLnR5cGVdIC8gc2NvcGUuc2l6ZWZhY3RvcikgKiAuNzUgKyAncHgnO1xuXHRcdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9O1xuXHRcdFx0XHR2YXIgY2hhcmdlID0gZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRyZXR1cm4gLU1hdGgucG93KGQucmFkaXVzLCAyLjApIC8gNDtcblx0XHRcdFx0fTtcblx0XHRcdFx0dmFyIHN0YXJ0ID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdHJldHVybiBvcHRpb25zLmZvcmNlID0gZDMubGF5b3V0LmZvcmNlKCkubm9kZXMobm9kZXMpLnNpemUoW29wdGlvbnMud2lkdGgsIG9wdGlvbnMuaGVpZ2h0XSkubGlua3MobGlua3MpO1xuXHRcdFx0XHR9O1xuXHRcdFx0XHR2YXIgZGlzcGxheV9ncm91cF9hbGwgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0b3B0aW9ucy5mb3JjZS5ncmF2aXR5KG9wdGlvbnMubGF5b3V0X2dyYXZpdHkpLmNoYXJnZShjaGFyZ2UpLmZyaWN0aW9uKDAuODUpLm9uKFwidGlja1wiLCBmdW5jdGlvbiAoZSkge1xuXHRcdFx0XHRcdFx0b3B0aW9ucy5jb250YWluZXJzLmVhY2gobW92ZV90b3dhcmRzX2NlbnRlcihlLmFscGhhKSkuYXR0cihcInRyYW5zZm9ybVwiLCBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gJ3RyYW5zbGF0ZSgnICsgZC54ICsgJywnICsgZC55ICsgJyknO1xuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0b3B0aW9ucy5mb3JjZS5zdGFydCgpO1xuXHRcdFx0XHR9O1xuXHRcdFx0XHR2YXIgZGlzcGxheV9ieV9jYXQgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0b3B0aW9ucy5mb3JjZS5ncmF2aXR5KG9wdGlvbnMubGF5b3V0X2dyYXZpdHkpLmNoYXJnZShjaGFyZ2UpLmZyaWN0aW9uKDAuOSkub24oXCJ0aWNrXCIsIGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdFx0XHRvcHRpb25zLmNvbnRhaW5lcnMuZWFjaChtb3ZlX3Rvd2FyZHNfY2F0KGUuYWxwaGEpKS5hdHRyKFwidHJhbnNmb3JtXCIsIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiAndHJhbnNsYXRlKCcgKyBkLnggKyAnLCcgKyBkLnkgKyAnKSc7XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRvcHRpb25zLmZvcmNlLnN0YXJ0KCk7XG5cdFx0XHRcdH07XG5cdFx0XHRcdHZhciBtb3ZlX3Rvd2FyZHNfY2VudGVyID0gZnVuY3Rpb24gKGFscGhhKSB7XG5cdFx0XHRcdFx0cmV0dXJuIChmdW5jdGlvbiAoX3RoaXMpIHtcblx0XHRcdFx0XHRcdHJldHVybiBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0XHRkLnggPSBkLnggKyAob3B0aW9ucy53aWR0aC8yIC0gZC54KSAqIChvcHRpb25zLmRhbXBlciArIDAuMDIpICogYWxwaGEgKjEuMjU7XG5cdFx0XHRcdFx0XHRcdGQueSA9IGQueSArIChvcHRpb25zLmhlaWdodC8yIC0gZC55KSAqIChvcHRpb25zLmRhbXBlciArIDAuMDIpICogYWxwaGEgKiAxLjI1O1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pKHRoaXMpO1xuXHRcdFx0XHR9O1xuXHRcdFx0XHR2YXIgbW92ZV90b3dhcmRzX3RvcCA9IGZ1bmN0aW9uIChhbHBoYSkge1xuXHRcdFx0XHRcdHJldHVybiAoZnVuY3Rpb24gKF90aGlzKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdFx0ZC54ID0gZC54ICsgKG9wdGlvbnMuY2VudGVyLnggLSBkLngpICogKG9wdGlvbnMuZGFtcGVyICsgMC4wMikgKiBhbHBoYSAqIDEuMTtcblx0XHRcdFx0XHRcdFx0ZC55ID0gZC55ICsgKDIwMCAtIGQueSkgKiAob3B0aW9ucy5kYW1wZXIgKyAwLjAyKSAqIGFscGhhICogMS4xO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pKHRoaXMpO1xuXHRcdFx0XHR9O1xuXHRcdFx0XHR2YXIgbW92ZV90b3dhcmRzX2NhdCA9IGZ1bmN0aW9uIChhbHBoYSkge1xuXHRcdFx0XHRcdHJldHVybiAoZnVuY3Rpb24gKF90aGlzKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZnVuY3Rpb24gKGQpIHtcblxuXHRcdFx0XHRcdFx0XHR2YXIgdGFyZ2V0O1xuXHRcdFx0XHRcdFx0XHR0YXJnZXQgPSBvcHRpb25zLmNhdF9jZW50ZXJzW2QuZ3JvdXBdO1xuXHRcdFx0XHRcdFx0XHRkLnggPSBkLnggKyAodGFyZ2V0LnggLSBkLngpICogKHRhcmdldC5kYW1wZXIgKyAwLjAyKSAqIGFscGhhICogMTtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGQueSA9IGQueSArICh0YXJnZXQueSAtIGQueSkgKiAodGFyZ2V0LmRhbXBlciArIDAuMDIpICogYWxwaGEgKiAxO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pKHRoaXMpO1xuXHRcdFx0XHR9O1xuXHRcdFx0XHR2YXIgc2hvd19kZXRhaWxzID0gZnVuY3Rpb24gKGRhdGEsIGksIGVsZW1lbnQpIHtcblx0XHRcdFx0XHR2YXIgY29udGVudDtcblx0XHRcdFx0XHRjb250ZW50ID0gXCI8c3BhbiBjbGFzcz1cXFwidGl0bGVcXFwiPlwiICsgZGF0YS5uYW1lICsgXCI8L3NwYW4+PGJyLz5cIjtcblx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2goZGF0YS5kYXRhLmNoaWxkcmVuLCBmdW5jdGlvbiAoaW5mbykge1xuXHRcdFx0XHRcdFx0Y29udGVudCArPSBcIjxzcGFuIGNsYXNzPVxcXCJuYW1lXFxcIiBzdHlsZT1cXFwiY29sb3I6XCIgKyAoaW5mby5jb2xvciB8fCBkYXRhLmNvbG9yKSArIFwiXFxcIj4gXCIgKyAoaW5mby50aXRsZSkgKyBcIjwvc3Bhbj48YnIvPlwiO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdCRjb21waWxlKG9wdGlvbnMudG9vbHRpcC5zaG93VG9vbHRpcChjb250ZW50LCBkYXRhLCBkMy5ldmVudCwgZWxlbSkuY29udGVudHMoKSkoc2NvcGUpO1xuXHRcdFx0XHR9O1xuXG5cdFx0XHRcdHZhciBoaWRlX2RldGFpbHMgPSBmdW5jdGlvbiAoZGF0YSwgaSwgZWxlbWVudCkge1xuXHRcdFx0XHRcdHJldHVybiBvcHRpb25zLnRvb2x0aXAuaGlkZVRvb2x0aXAoKTtcblx0XHRcdFx0fTtcblxuXHRcdFx0XHRzY29wZS4kd2F0Y2goJ2NoYXJ0ZGF0YScsIGZ1bmN0aW9uIChkYXRhLCBvbGREYXRhKSB7XG5cdFx0XHRcdFx0b3B0aW9ucy50b29sdGlwLmhpZGVUb29sdGlwKCk7XG5cblx0XHRcdFx0XHRpZiAob3B0aW9ucy5jaXJjbGVzID09IG51bGwpIHtcblx0XHRcdFx0XHRcdGNyZWF0ZV9ub2RlcygpO1xuXHRcdFx0XHRcdFx0Y3JlYXRlX3ZpcygpO1xuXHRcdFx0XHRcdFx0c3RhcnQoKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0dXBkYXRlX3ZpcygpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZihsYWJlbHMubGVuZ3RoID09IDEgfHwgb3B0aW9ucy5sYWJlbHMgIT0gdHJ1ZSl7XG5cdFx0XHRcdFx0XHRcdGRpc3BsYXlfZ3JvdXBfYWxsKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2V7XG5cdFx0XHRcdFx0XHRcdGRpc3BsYXlfYnlfY2F0KCk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRzY29wZS4kd2F0Y2goJ2luZGV4ZXInLCBmdW5jdGlvbiAobiwgbykge1xuXHRcdFx0XHRcdGlmKG4gPT09IG8pe1xuXHRcdFx0XHRcdFx0cmV0dXJuXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmKHR5cGVvZiBuWzBdLmNoaWxkcmVuICE9IFwidW5kZWZpbmVkXCIpe1xuXHRcdFx0XHRcdFx0b3B0aW9ucy50b29sdGlwLmhpZGVUb29sdGlwKCk7XG5cdFx0XHRcdFx0XHRjbGVhcl9ub2RlcygpO1xuXHRcdFx0XHRcdFx0Y3JlYXRlX25vZGVzKCk7XG5cdFx0XHRcdFx0XHRjcmVhdGVfdmlzKCk7XG5cdFx0XHRcdFx0XHRzdGFydCgpO1xuXG5cdFx0XHRcdFx0XHRpZihsYWJlbHMubGVuZ3RoID09IDEgfHwgb3B0aW9ucy5sYWJlbHMgIT0gdHJ1ZSl7XG5cdFx0XHRcdFx0XHRcdFx0ZGlzcGxheV9ncm91cF9hbGwoKTtcblx0XHRcdFx0XHRcdFx0XHQvL2NvbnNvbGUubG9nKCdhbGwnKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGVsc2V7XG5cdFx0XHRcdFx0XHRcdFx0Ly9kaXNwbGF5X2J5X2NhdCgpO1xuXHRcdFx0XHRcdFx0XHRcdGRpc3BsYXlfZ3JvdXBfYWxsKCk7XG5cdFx0XHRcdFx0XHRcdFx0Ly9jb25zb2xlLmxvZygnYWxsJyk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdFx0c2NvcGUuJHdhdGNoKCdkaXJlY3Rpb24nLCBmdW5jdGlvbiAob2xkRCwgbmV3RCkge1xuXHRcdFx0XHRcdGlmIChvbGREID09PSBuZXdEKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmIChvbGREID09IFwiYWxsXCIpIHtcblx0XHRcdFx0XHRcdGRpc3BsYXlfZ3JvdXBfYWxsKCk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGRpc3BsYXlfYnlfY2F0KCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KVxuXHRcdFx0fVxuXHRcdH07XG5cdH0pO1xufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSggJ2FwcC5jb250cm9sbGVycycgKS5jb250cm9sbGVyKCAnQ2lyY2xlZ3JhcGhDdHJsJywgZnVuY3Rpb24oKXtcblx0XHQvL1xuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5kaXJlY3RpdmVzJykuZGlyZWN0aXZlKCdjaXJjbGVncmFwaCcsIGZ1bmN0aW9uICgkdGltZW91dCkge1xuXHRcdHZhciBkZWZhdWx0cyA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdHdpZHRoOiA4MCxcblx0XHRcdFx0aGVpZ2h0OiA4MCxcblx0XHRcdFx0Y29sb3I6ICcjMDBjY2FhJyxcblx0XHRcdFx0c2l6ZTogMTc4LFxuXHRcdFx0XHRmaWVsZDogJ3JhbmsnXG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiB7XG5cdFx0XHRyZXN0cmljdDogJ0UnLFxuXHRcdFx0Y29udHJvbGxlcjogJ0NpcmNsZWdyYXBoQ3RybCcsXG5cdFx0XHRzY29wZToge1xuXHRcdFx0XHRvcHRpb25zOiAnPSdcblx0XHRcdH0sXG5cdFx0XHRyZXF1aXJlOiAnbmdNb2RlbCcsXG5cdFx0XHRsaW5rOiBmdW5jdGlvbiAoJHNjb3BlLCBlbGVtZW50LCAkYXR0cnMsIG5nTW9kZWwpIHtcblx0XHRcdFx0Ly9GZXRjaGluZyBPcHRpb25zXG5cblx0XHRcdFx0JHNjb3BlLm9wdGlvbnMgPSBhbmd1bGFyLmV4dGVuZChkZWZhdWx0cygpLCAkc2NvcGUub3B0aW9ucyk7XG5cblx0XHRcdFx0Ly9DcmVhdGluZyB0aGUgU2NhbGVcblx0XHRcdFx0dmFyIHJvdGF0ZSA9IGQzLnNjYWxlLmxpbmVhcigpXG5cdFx0XHRcdFx0LmRvbWFpbihbMSwgJHNjb3BlLm9wdGlvbnMuc2l6ZV0pXG5cdFx0XHRcdFx0LnJhbmdlKFsxLCAwXSlcblx0XHRcdFx0XHQuY2xhbXAodHJ1ZSk7XG5cblx0XHRcdFx0Ly9DcmVhdGluZyBFbGVtZW50c1xuXHRcdFx0XHR2YXIgc3ZnID0gZDMuc2VsZWN0KGVsZW1lbnRbMF0pLmFwcGVuZCgnc3ZnJylcblx0XHRcdFx0XHQuYXR0cignd2lkdGgnLCAkc2NvcGUub3B0aW9ucy53aWR0aClcblx0XHRcdFx0XHQuYXR0cignaGVpZ2h0JywgJHNjb3BlLm9wdGlvbnMuaGVpZ2h0KVxuXHRcdFx0XHRcdC5hcHBlbmQoJ2cnKTtcblx0XHRcdFx0dmFyIGNvbnRhaW5lciA9IHN2Zy5hcHBlbmQoJ2cnKVxuXHRcdFx0XHRcdC5hdHRyKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKCcgKyAkc2NvcGUub3B0aW9ucy53aWR0aCAvIDIgKyAnLCcgKyAkc2NvcGUub3B0aW9ucy5oZWlnaHQgLyAyICsgJyknKTtcblx0XHRcdFx0dmFyIGNpcmNsZUJhY2sgPSBjb250YWluZXIuYXBwZW5kKCdjaXJjbGUnKVxuXHRcdFx0XHRcdC5hdHRyKCdyJywgJHNjb3BlLm9wdGlvbnMud2lkdGggLyAyIC0gMilcblx0XHRcdFx0XHQuYXR0cignc3Ryb2tlLXdpZHRoJywgMilcblx0XHRcdFx0XHQuYXR0cignc3Ryb2tlJywgJHNjb3BlLm9wdGlvbnMuY29sb3IpXG5cdFx0XHRcdFx0LnN0eWxlKCdvcGFjaXR5JywgJzAuNicpXG5cdFx0XHRcdFx0LmF0dHIoJ2ZpbGwnLCAnbm9uZScpO1xuXHRcdFx0XHR2YXIgYXJjID0gZDMuc3ZnLmFyYygpXG5cdFx0XHRcdFx0LnN0YXJ0QW5nbGUoMClcblx0XHRcdFx0XHQuaW5uZXJSYWRpdXMoZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdHJldHVybiAkc2NvcGUub3B0aW9ucy53aWR0aCAvIDIgLSA0O1xuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0Lm91dGVyUmFkaXVzKGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gJHNjb3BlLm9wdGlvbnMud2lkdGggLyAyO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR2YXIgY2lyY2xlR3JhcGggPSBjb250YWluZXIuYXBwZW5kKCdwYXRoJylcblx0XHRcdFx0XHQuZGF0dW0oe1xuXHRcdFx0XHRcdFx0ZW5kQW5nbGU6IDIgKiBNYXRoLlBJICogMFxuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0LnN0eWxlKFwiZmlsbFwiLCAkc2NvcGUub3B0aW9ucy5jb2xvcilcblx0XHRcdFx0XHQuYXR0cignZCcsIGFyYyk7XG5cdFx0XHRcdHZhciB0ZXh0ID0gY29udGFpbmVyLnNlbGVjdEFsbCgndGV4dCcpXG5cdFx0XHRcdFx0LmRhdGEoWzBdKVxuXHRcdFx0XHRcdC5lbnRlcigpXG5cdFx0XHRcdFx0LmFwcGVuZCgndGV4dCcpXG5cdFx0XHRcdFx0LnRleHQoZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdHJldHVybiAnTsKwJyArIGQ7XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQuc3R5bGUoXCJmaWxsXCIsICRzY29wZS5vcHRpb25zLmNvbG9yKVxuXHRcdFx0XHRcdC5zdHlsZSgnZm9udC13ZWlnaHQnLCAnYm9sZCcpXG5cdFx0XHRcdFx0LmF0dHIoJ3RleHQtYW5jaG9yJywgJ21pZGRsZScpXG5cdFx0XHRcdFx0LmF0dHIoJ3knLCAnMC4zNWVtJyk7XG5cblx0XHRcdFx0Ly9UcmFuc2l0aW9uIGlmIHNlbGVjdGlvbiBoYXMgY2hhbmdlZFxuXHRcdFx0XHRmdW5jdGlvbiBhbmltYXRlSXQocmFkaXVzKSB7XG5cdFx0XHRcdFx0Y2lyY2xlR3JhcGgudHJhbnNpdGlvbigpXG5cdFx0XHRcdFx0XHQuZHVyYXRpb24oNzUwKVxuXHRcdFx0XHRcdFx0LmNhbGwoYXJjVHdlZW4sIHJvdGF0ZShyYWRpdXMpICogMiAqIE1hdGguUEkpO1xuXHRcdFx0XHRcdHRleHQudHJhbnNpdGlvbigpLmR1cmF0aW9uKDc1MCkudHdlZW4oJ3RleHQnLCBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0dmFyIGRhdGEgPSB0aGlzLnRleHRDb250ZW50LnNwbGl0KCdOwrAnKTtcblx0XHRcdFx0XHRcdHZhciBpID0gZDMuaW50ZXJwb2xhdGUocGFyc2VJbnQoZGF0YVsxXSksIHJhZGl1cyk7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZnVuY3Rpb24gKHQpIHtcblx0XHRcdFx0XHRcdFx0dGhpcy50ZXh0Q29udGVudCA9ICdOwrAnICsgKE1hdGgucm91bmQoaSh0KSAqIDEpIC8gMSk7XG5cdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvL1R3ZWVuIGFuaW1hdGlvbiBmb3IgdGhlIEFyY1xuXHRcdFx0XHRmdW5jdGlvbiBhcmNUd2Vlbih0cmFuc2l0aW9uLCBuZXdBbmdsZSkge1xuXHRcdFx0XHRcdHRyYW5zaXRpb24uYXR0clR3ZWVuKFwiZFwiLCBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0dmFyIGludGVycG9sYXRlID0gZDMuaW50ZXJwb2xhdGUoZC5lbmRBbmdsZSwgbmV3QW5nbGUpO1xuXHRcdFx0XHRcdFx0cmV0dXJuIGZ1bmN0aW9uICh0KSB7XG5cdFx0XHRcdFx0XHRcdGQuZW5kQW5nbGUgPSBpbnRlcnBvbGF0ZSh0KTtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGFyYyhkKTtcblx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQkc2NvcGUuJHdhdGNoKCdvcHRpb25zJywgZnVuY3Rpb24gKG4sIG8pIHtcblx0XHRcdFx0XHRpZiAobiA9PT0gbykge1xuXHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRjaXJjbGVCYWNrLnN0eWxlKCdzdHJva2UnLCBuLmNvbG9yKTtcblx0XHRcdFx0XHRjaXJjbGVHcmFwaC5zdHlsZSgnZmlsbCcsIG4uY29sb3IpO1xuXHRcdFx0XHRcdHRleHQuc3R5bGUoJ2ZpbGwnLCBuLmNvbG9yKTtcblx0XHRcdFx0XHQkdGltZW91dChmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRhbmltYXRlSXQobmdNb2RlbC4kbW9kZWxWYWx1ZVtuLmZpZWxkXSlcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0Ly9XYXRjaGluZyBpZiBzZWxlY3Rpb24gaGFzIGNoYW5nZWQgZnJvbSBhbm90aGVyIFVJIGVsZW1lbnRcblx0XHRcdFx0JHNjb3BlLiR3YXRjaChcblx0XHRcdFx0XHRmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gbmdNb2RlbC4kbW9kZWxWYWx1ZTtcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdGZ1bmN0aW9uIChuLCBvKSB7XG5cdFx0XHRcdFx0XHRpZiAoIW4pIHtcblx0XHRcdFx0XHRcdFx0biA9IHt9O1xuXHRcdFx0XHRcdFx0XHRuWyRzY29wZS5vcHRpb25zLmZpZWxkXSA9ICRzY29wZS5vcHRpb25zLnNpemU7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHQkdGltZW91dChmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRcdGFuaW1hdGVJdChuWyRzY29wZS5vcHRpb25zLmZpZWxkXSk7XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9O1xuXG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZGlyZWN0aXZlcycpLmRpcmVjdGl2ZSggJ2hpc3RvcnknLCBmdW5jdGlvbigpIHtcblx0XHR2YXIgZGVmYXVsdHMgPSBmdW5jdGlvbigpe1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0ZmllbGQ6ICdzY29yZScsXG5cdFx0XHRcdGNvbG9yOiAnJ1xuXHRcdFx0fVxuXHRcdH07XG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlc3RyaWN0OiAnRScsXG5cdFx0XHR0ZW1wbGF0ZVVybDogJ3ZpZXdzL2RpcmVjdGl2ZXMvaGlzdG9yeS9oaXN0b3J5Lmh0bWwnLFxuXHRcdFx0Y29udHJvbGxlcjogJ0hpc3RvcnlDdHJsJyxcblx0XHRcdHNjb3BlOntcblx0XHRcdFx0b3B0aW9uczonPScsXG5cdFx0XHRcdGNoYXJ0ZGF0YTogJz0nXG5cdFx0XHR9LFxuXHRcdFx0bGluazogZnVuY3Rpb24oICRzY29wZSwgZWxlbWVudCwgJGF0dHJzLCBuZ01vZGVsKXtcblx0XHRcdFx0XHR2YXIgb3B0aW9ucyA9IGFuZ3VsYXIuZXh0ZW5kKGRlZmF1bHRzKCksICRzY29wZS5vcHRpb25zKTtcblx0XHRcdH1cblx0XHR9O1xuXG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0hpc3RvcnlDdHJsJywgZnVuY3Rpb24gKCRzY29wZSkge1xuXHRcdCRzY29wZS5zZXREYXRhID0gc2V0RGF0YTtcblx0XHRhY3RpdmF0ZSgpO1xuXHRcblx0XHRmdW5jdGlvbiBhY3RpdmF0ZSgpe1xuXHRcdFx0JHNjb3BlLnNldERhdGEoKTtcblx0XHRcdCRzY29wZS4kd2F0Y2goJ29wdGlvbnMnLCBmdW5jdGlvbihuLG8pe1xuXHRcdFx0XHRpZihuID09PSAwKXtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblx0XHRcdFx0JHNjb3BlLnNldERhdGEoKTtcblx0XHRcdH0pXG5cdFx0fVxuXHRcdGZ1bmN0aW9uIHNldERhdGEoKXtcblx0XHRcdCRzY29wZS5kaXNwbGF5ID0ge1xuXHRcdFx0XHRzZWxlY3RlZENhdDogJycsXG5cdFx0XHRcdHJhbms6IFt7XG5cdFx0XHRcdFx0ZmllbGRzOiB7XG5cdFx0XHRcdFx0XHR4OiAneWVhcicsXG5cdFx0XHRcdFx0XHR5OiAncmFuaydcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdHRpdGxlOiAnUmFuaycsXG5cdFx0XHRcdFx0Y29sb3I6ICcjNTJiNjk1J1xuXHRcdFx0XHR9XSxcblx0XHRcdFx0c2NvcmU6IFt7XG5cdFx0XHRcdFx0ZmllbGRzOiB7XG5cdFx0XHRcdFx0XHR4OiAneWVhcicsXG5cdFx0XHRcdFx0XHR5OiAkc2NvcGUub3B0aW9ucy5maWVsZFxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0dGl0bGU6ICdTY29yZScsXG5cdFx0XHRcdFx0Y29sb3I6ICRzY29wZS5vcHRpb25zLmNvbG9yXG5cdFx0XHRcdH1dXG5cdFx0XHR9O1xuXHRcdH1cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5kaXJlY3RpdmVzJykuZGlyZWN0aXZlKCAnaW5kaWNhdG9yJywgZnVuY3Rpb24oKSB7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0cmVzdHJpY3Q6ICdFQScsXG5cdFx0XHR0ZW1wbGF0ZVVybDogJ3ZpZXdzL2RpcmVjdGl2ZXMvaW5kaWNhdG9yL2luZGljYXRvci5odG1sJyxcblx0XHRcdGNvbnRyb2xsZXI6ICdJbmRpY2F0b3JDdHJsJyxcblx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJyxcblx0XHRcdHNjb3BlOntcblx0XHRcdFx0aXRlbTogJz0nXG5cdFx0XHR9LFxuXHRcdFx0YmluZFRvQ29udHJvbGxlcjogdHJ1ZSxcblx0XHRcdHJlcGxhY2U6dHJ1ZSxcblx0XHRcdHJlcXVpcmU6ICdpdGVtJyxcblx0XHRcdGxpbms6IGZ1bmN0aW9uKCBzY29wZSwgZWxlbWVudCwgYXR0cnMsIGl0ZW1Nb2RlbCApe1xuXHRcdFx0XHQvL1xuXHRcdFx0XHQvKnNjb3BlLiR3YXRjaChcblx0XHRcdFx0XHRmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gaXRlbU1vZGVsLiRtb2RlbFZhbHVlO1xuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0ZnVuY3Rpb24gKG4sIG8pIHtcblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKG4pO1xuXHRcdFx0XHRcdH0pOyovXG5cdFx0XHR9XG5cdFx0fTtcblxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSggJ2FwcC5jb250cm9sbGVycycgKS5jb250cm9sbGVyKCAnSW5kaWNhdG9yQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgRGF0YVNlcnZpY2UsICRmaWx0ZXIpe1xuXHRcdC8vXG5cdFx0XHR2YXIgdm0gPSB0aGlzO1xuXG5cdFx0XHR2bS5jYXRlZ29yaWVzID0gW107XG5cdFx0XHR2bS5kYXRhcHJvdmlkZXJzID0gW107XG5cdFx0XHR2bS5zZWxlY3RlZEl0ZW0gPSBudWxsO1xuXHRcdFx0dm0uc2VhcmNoVGV4dCA9IG51bGw7XG5cdFx0XHR2bS5xdWVyeVNlYXJjaCA9IHF1ZXJ5U2VhcmNoO1xuXHRcdFx0dm0ucXVlcnlTZWFyY2hDYXRlZ29yeSA9IHF1ZXJ5U2VhcmNoQ2F0ZWdvcnk7XG5cblx0ICAgIGFjdGl2YXRlKCk7XG5cblx0ICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCl7XG5cdCAgICAgIGxvYWRBbGwoKTtcblx0ICAgIH1cblx0XHRcdGZ1bmN0aW9uIHF1ZXJ5U2VhcmNoKHF1ZXJ5KSB7XG5cdFx0XHRcdHJldHVybiAkZmlsdGVyKCdmaW5kYnluYW1lJykodm0uZGF0YXByb3ZpZGVycywgcXVlcnksICd0aXRsZScpO1xuXHRcdFx0fVxuXHRcdFx0ZnVuY3Rpb24gcXVlcnlTZWFyY2hDYXRlZ29yeShxdWVyeSkge1xuXHRcdFx0XHRyZXR1cm4gJGZpbHRlcignZmluZGJ5bmFtZScpKHZtLmNhdGVnb3JpZXMsIHF1ZXJ5LCAndGl0bGUnKTtcblx0XHRcdH1cblx0XHRcdGZ1bmN0aW9uIGxvYWRBbGwoKSB7XG5cdCAgICAgIHZtLmRhdGFwcm92aWRlcnMgPSBEYXRhU2VydmljZS5nZXRBbGwoJ2RhdGFwcm92aWRlcnMnKS4kb2JqZWN0O1xuXHRcdFx0XHR2bS5jYXRlZ29yaWVzID0gRGF0YVNlcnZpY2UuZ2V0QWxsKCdjYXRlZ29yaWVzJykuJG9iamVjdDtcblx0XHRcdFx0dm0ubWVhc3VyZVR5cGVzID0gRGF0YVNlcnZpY2UuZ2V0QWxsKCdtZWFzdXJlX3R5cGVzJykuJG9iamVjdDtcblx0XHRcdH1cblxuXHRcdFx0JHNjb3BlLiR3YXRjaENvbGxlY3Rpb24oJ3ZtLml0ZW0nLCBmdW5jdGlvbihuLCBvKXtcblx0XHRcdFx0XHRpZihuID09PSBvKXtcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Y29uc29sZS5sb2cobik7XG5cdFx0XHRcdFx0aWYobi50aXRsZSAmJiBuLm1lYXN1cmVfdHlwZV9pZCAmJiBuLnR5cGUgJiYgbi5kYXRhcHJvdmlkZXIpe1xuXHRcdFx0XHRcdFx0bi5iYXNlID0gdHJ1ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZWxzZXtcblx0XHRcdFx0XHRcdG4uYmFzZSA9IGZhbHNlO1xuXHRcdFx0XHRcdH07XG5cdFx0XHR9KTtcbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZGlyZWN0aXZlcycpLmRpcmVjdGl2ZSgnbWVkaWFuJywgZnVuY3Rpb24gKCR0aW1lb3V0KSB7XG5cdFx0dmFyIGRlZmF1bHRzID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0aWQ6ICdncmFkaWVudCcsXG5cdFx0XHRcdHdpZHRoOiAzMDAsXG5cdFx0XHRcdGhlaWdodDogNDAsXG5cdFx0XHRcdGluZm86IHRydWUsXG5cdFx0XHRcdGZpZWxkOiAnc2NvcmUnLFxuXHRcdFx0XHRoYW5kbGluZzogdHJ1ZSxcblx0XHRcdFx0bWFyZ2luOiB7XG5cdFx0XHRcdFx0bGVmdDogMjAsXG5cdFx0XHRcdFx0cmlnaHQ6IDIwLFxuXHRcdFx0XHRcdHRvcDogMTAsXG5cdFx0XHRcdFx0Ym90dG9tOiAxMFxuXHRcdFx0XHR9LFxuXHRcdFx0XHRjb2xvcnM6IFsge1xuXHRcdFx0XHRcdHBvc2l0aW9uOiAwLFxuXHRcdFx0XHRcdGNvbG9yOiAncmdiYSgxMDIsMTAyLDEwMiwxKScsXG5cdFx0XHRcdFx0b3BhY2l0eTogMVxuXHRcdFx0XHR9LCB7XG5cdFx0XHRcdFx0cG9zaXRpb246IDUzLFxuXHRcdFx0XHRcdGNvbG9yOiAncmdiYSgxMjgsIDI0MywgMTk4LDEpJyxcblx0XHRcdFx0XHRvcGFjaXR5OiAxXG5cdFx0XHRcdH0se1xuXHRcdFx0XHRcdHBvc2l0aW9uOiAxMDAsXG5cdFx0XHRcdFx0Y29sb3I6ICdyZ2JhKDI1NSwyNTUsMjU1LDEpJyxcblx0XHRcdFx0XHRvcGFjaXR5OiAwXG5cdFx0XHRcdH1dXG5cdFx0XHR9O1xuXHRcdH1cblx0XHRyZXR1cm4ge1xuXHRcdFx0cmVzdHJpY3Q6ICdFJyxcblx0XHRcdHNjb3BlOiB7XG5cdFx0XHRcdGRhdGE6ICc9Jyxcblx0XHRcdFx0b3B0aW9uczogJz0nXG5cdFx0XHR9LFxuXHRcdFx0cmVxdWlyZTogJ25nTW9kZWwnLFxuXHRcdFx0bGluazogZnVuY3Rpb24gKCRzY29wZSwgZWxlbWVudCwgJGF0dHJzLCBuZ01vZGVsKSB7XG5cblx0XHRcdFx0dmFyIG9wdGlvbnMgPSBhbmd1bGFyLmV4dGVuZChkZWZhdWx0cygpLCAkYXR0cnMpO1xuXHRcdFx0XHRvcHRpb25zID0gYW5ndWxhci5leHRlbmQob3B0aW9ucywgJHNjb3BlLm9wdGlvbnMpO1xuXHRcdFx0XHRvcHRpb25zLnVuaXF1ZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuXHRcdFx0XHRpZihvcHRpb25zLmNvbG9yKXtcblx0XHRcdFx0XHRvcHRpb25zLmNvbG9yc1sxXS5jb2xvciA9IG9wdGlvbnMuY29sb3I7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxlbWVudC5jc3MoJ2hlaWdodCcsIG9wdGlvbnMuaGVpZ2h0ICsgJ3B4JykuY3NzKCdib3JkZXItcmFkaXVzJywgb3B0aW9ucy5oZWlnaHQgLyAyICsgJ3B4Jyk7XG5cdFx0XHRcdHZhciB4ID0gZDMuc2NhbGUubGluZWFyKClcblx0XHRcdFx0XHQuZG9tYWluKFswLCAxMDBdKVxuXHRcdFx0XHRcdC5yYW5nZShbb3B0aW9ucy5tYXJnaW4ubGVmdCwgb3B0aW9ucy53aWR0aCAtIG9wdGlvbnMubWFyZ2luLmxlZnRdKVxuXHRcdFx0XHRcdC5jbGFtcCh0cnVlKTtcblxuXHRcdFx0XHR2YXIgYnJ1c2ggPSBkMy5zdmcuYnJ1c2goKVxuXHRcdFx0XHRcdC54KHgpXG5cdFx0XHRcdFx0LmV4dGVudChbMCwgMF0pXG5cdFx0XHRcdFx0Lm9uKFwiYnJ1c2hcIiwgYnJ1c2gpXG5cdFx0XHRcdFx0Lm9uKFwiYnJ1c2hlbmRcIiwgYnJ1c2hlZCk7XG5cblx0XHRcdFx0dmFyIHN2ZyA9IGQzLnNlbGVjdChlbGVtZW50WzBdKS5hcHBlbmQoXCJzdmdcIilcblx0XHRcdFx0XHQuYXR0cihcIndpZHRoXCIsIG9wdGlvbnMud2lkdGgpXG5cdFx0XHRcdFx0LmF0dHIoXCJoZWlnaHRcIiwgb3B0aW9ucy5oZWlnaHQpXG5cdFx0XHRcdFx0LmFwcGVuZChcImdcIik7XG5cdFx0XHRcdC8vLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoMCxcIiArIG9wdGlvbnMubWFyZ2luLnRvcCAvIDIgKyBcIilcIik7XG5cdFx0XHRcdHZhciBncmFkaWVudCA9IHN2Zy5hcHBlbmQoJ3N2ZzpkZWZzJylcblx0XHRcdFx0XHQuYXBwZW5kKFwic3ZnOmxpbmVhckdyYWRpZW50XCIpXG5cdFx0XHRcdFx0LmF0dHIoJ2lkJywgb3B0aW9ucy5maWVsZCtvcHRpb25zLnVuaXF1ZSlcblx0XHRcdFx0XHQuYXR0cigneDEnLCAnMCUnKVxuXHRcdFx0XHRcdC5hdHRyKCd5MScsICcwJScpXG5cdFx0XHRcdFx0LmF0dHIoJ3gyJywgJzEwMCUnKVxuXHRcdFx0XHRcdC5hdHRyKCd5MicsICcwJScpXG5cdFx0XHRcdFx0LmF0dHIoJ3NwcmVhZE1ldGhvZCcsICdwYWQnKVxuXHRcdFx0XHRhbmd1bGFyLmZvckVhY2gob3B0aW9ucy5jb2xvcnMsIGZ1bmN0aW9uIChjb2xvcikge1xuXHRcdFx0XHRcdGdyYWRpZW50LmFwcGVuZCgnc3ZnOnN0b3AnKVxuXHRcdFx0XHRcdFx0LmF0dHIoJ29mZnNldCcsIGNvbG9yLnBvc2l0aW9uICsgJyUnKVxuXHRcdFx0XHRcdFx0LmF0dHIoJ3N0b3AtY29sb3InLCBjb2xvci5jb2xvcilcblx0XHRcdFx0XHRcdC5hdHRyKCdzdG9wLW9wYWNpdHknLCBjb2xvci5vcGFjaXR5KTtcblx0XHRcdFx0fSk7XG5cdFx0XHRcdHZhciByZWN0ID0gc3ZnLmFwcGVuZCgnc3ZnOnJlY3QnKVxuXHRcdFx0XHRcdC5hdHRyKCd3aWR0aCcsIG9wdGlvbnMud2lkdGgpXG5cdFx0XHRcdFx0LmF0dHIoJ2hlaWdodCcsIG9wdGlvbnMuaGVpZ2h0KVxuXHRcdFx0XHRcdC5zdHlsZSgnZmlsbCcsICd1cmwoIycgKyAob3B0aW9ucy5maWVsZCtvcHRpb25zLnVuaXF1ZSkrICcpJyk7XG5cdFx0XHRcdHZhciBsZWdlbmQgPSBzdmcuYXBwZW5kKCdnJykuYXR0cigndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgnICsgb3B0aW9ucy5oZWlnaHQgLyAyICsgJywgJyArIG9wdGlvbnMuaGVpZ2h0IC8gMiArICcpJylcblx0XHRcdFx0XHQuYXR0cignY2xhc3MnLCAnc3RhcnRMYWJlbCcpXG5cblx0XHRcdFx0aWYgKG9wdGlvbnMuaW5mbyA9PT0gdHJ1ZSkge1xuXHRcdFx0XHRcdGxlZ2VuZC5hcHBlbmQoJ2NpcmNsZScpXG5cdFx0XHRcdFx0XHQuYXR0cigncicsIG9wdGlvbnMuaGVpZ2h0IC8gMik7XG5cdFx0XHRcdFx0bGVnZW5kLmFwcGVuZCgndGV4dCcpXG5cdFx0XHRcdFx0XHQudGV4dCgwKVxuXHRcdFx0XHRcdFx0LnN0eWxlKCdmb250LXNpemUnLCBvcHRpb25zLmhlaWdodC8yLjUpXG5cdFx0XHRcdFx0XHQuYXR0cigndGV4dC1hbmNob3InLCAnbWlkZGxlJylcblx0XHRcdFx0XHRcdC5hdHRyKCd5JywgJy4zNWVtJylcblx0XHRcdFx0XHR2YXIgbGVnZW5kMiA9IHN2Zy5hcHBlbmQoJ2cnKS5hdHRyKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKCcgKyAob3B0aW9ucy53aWR0aCAtIChvcHRpb25zLmhlaWdodCAvIDIpKSArICcsICcgKyBvcHRpb25zLmhlaWdodCAvIDIgKyAnKScpXG5cdFx0XHRcdFx0XHQuYXR0cignY2xhc3MnLCAnZW5kTGFiZWwnKVxuXHRcdFx0XHRcdGxlZ2VuZDIuYXBwZW5kKCdjaXJjbGUnKVxuXHRcdFx0XHRcdFx0LmF0dHIoJ3InLCBvcHRpb25zLmhlaWdodCAvIDIpXG5cdFx0XHRcdFx0bGVnZW5kMi5hcHBlbmQoJ3RleHQnKVxuXHRcdFx0XHRcdFx0LnRleHQoMTAwKVxuXHRcdFx0XHRcdFx0LnN0eWxlKCdmb250LXNpemUnLCBvcHRpb25zLmhlaWdodC8yLjUpXG5cdFx0XHRcdFx0XHQuYXR0cigndGV4dC1hbmNob3InLCAnbWlkZGxlJylcblx0XHRcdFx0XHRcdC5hdHRyKCd5JywgJy4zNWVtJylcblx0XHRcdFx0fVxuXHRcdFx0XHR2YXIgc2xpZGVyID0gc3ZnLmFwcGVuZChcImdcIilcblx0XHRcdFx0XHQuYXR0cihcImNsYXNzXCIsIFwic2xpZGVyXCIpO1xuXHRcdFx0XHRpZihvcHRpb25zLmhhbmRsaW5nID09IHRydWUpe1xuXHRcdFx0XHRcdHNsaWRlci5jYWxsKGJydXNoKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHNsaWRlci5zZWxlY3QoXCIuYmFja2dyb3VuZFwiKVxuXHRcdFx0XHRcdC5hdHRyKFwiaGVpZ2h0XCIsIG9wdGlvbnMuaGVpZ2h0KTtcblxuXHRcdFx0XHRpZiAob3B0aW9ucy5pbmZvID09PSB0cnVlKSB7XG5cdFx0XHRcdHNsaWRlci5hcHBlbmQoJ2xpbmUnKVxuXHRcdFx0XHRcdC5hdHRyKCd4MScsIG9wdGlvbnMud2lkdGggLyAyKVxuXHRcdFx0XHRcdC5hdHRyKCd5MScsIDApXG5cdFx0XHRcdFx0LmF0dHIoJ3gyJywgb3B0aW9ucy53aWR0aCAvIDIpXG5cdFx0XHRcdFx0LmF0dHIoJ3kyJywgb3B0aW9ucy5oZWlnaHQpXG5cdFx0XHRcdFx0LmF0dHIoJ3N0cm9rZS1kYXNoYXJyYXknLCAnMywzJylcblx0XHRcdFx0XHQuYXR0cignc3Ryb2tlLXdpZHRoJywgMSlcblx0XHRcdFx0XHQuYXR0cignc3Ryb2tlJywgJ3JnYmEoMCwwLDAsODcpJyk7XG5cdFx0XHRcdH1cblx0XHRcdFx0dmFyIGhhbmRsZUNvbnQgPSBzbGlkZXIuYXBwZW5kKCdnJylcblx0XHRcdFx0XHQuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZSgwLFwiICsgb3B0aW9ucy5oZWlnaHQgLyAyICsgXCIpXCIpO1xuXHRcdFx0XHR2YXIgaGFuZGxlID0gaGFuZGxlQ29udC5hcHBlbmQoXCJjaXJjbGVcIilcblx0XHRcdFx0XHQuYXR0cihcImNsYXNzXCIsIFwiaGFuZGxlXCIpXG5cdFx0XHRcdFx0LmF0dHIoXCJyXCIsIG9wdGlvbnMuaGVpZ2h0IC8gMik7XG5cdFx0XHRcdFx0aWYob3B0aW9ucy5jb2xvcil7XG5cdFx0XHRcdFx0XHRoYW5kbGUuc3R5bGUoJ2ZpbGwnLCBvcHRpb25zLmNvbG9yKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdHZhciBoYW5kbGVMYWJlbCA9IGhhbmRsZUNvbnQuYXBwZW5kKCd0ZXh0Jylcblx0XHRcdFx0XHQudGV4dCgwKVxuXHRcdFx0XHRcdC5zdHlsZSgnZm9udC1zaXplJywgb3B0aW9ucy5oZWlnaHQvMi41KVxuXHRcdFx0XHRcdC5hdHRyKFwidGV4dC1hbmNob3JcIiwgXCJtaWRkbGVcIikuYXR0cigneScsICcwLjM1ZW0nKTtcblxuXHRcdFx0XHQvL3NsaWRlclxuXHRcdFx0XHQvLy5jYWxsKGJydXNoLmV4dGVudChbMCwgMF0pKVxuXHRcdFx0XHQvLy5jYWxsKGJydXNoLmV2ZW50KTtcblxuXHRcdFx0XHRmdW5jdGlvbiBicnVzaCgpIHtcblx0XHRcdFx0XHR2YXIgdmFsdWUgPSBicnVzaC5leHRlbnQoKVswXTtcblxuXHRcdFx0XHRcdGlmIChkMy5ldmVudC5zb3VyY2VFdmVudCkgeyAvLyBub3QgYSBwcm9ncmFtbWF0aWMgZXZlbnRcblx0XHRcdFx0XHRcdHZhbHVlID0geC5pbnZlcnQoZDMubW91c2UodGhpcylbMF0pO1xuXHRcdFx0XHRcdFx0YnJ1c2guZXh0ZW50KFt2YWx1ZSwgdmFsdWVdKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aGFuZGxlTGFiZWwudGV4dChwYXJzZUludCh2YWx1ZSkpO1xuXHRcdFx0XHRcdGhhbmRsZUNvbnQuYXR0cihcInRyYW5zZm9ybVwiLCAndHJhbnNsYXRlKCcgKyB4KHZhbHVlKSArICcsJyArIG9wdGlvbnMuaGVpZ2h0IC8gMiArICcpJyk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRmdW5jdGlvbiBicnVzaGVkKCkge1xuXHRcdFx0XHRcdHZhciB2YWx1ZSA9IGJydXNoLmV4dGVudCgpWzBdLFxuXHRcdFx0XHRcdFx0Y291bnQgPSAwLFxuXHRcdFx0XHRcdFx0Zm91bmQgPSBmYWxzZTtcblx0XHRcdFx0XHR2YXIgZmluYWwgPSBcIlwiO1xuXHRcdFx0XHRcdGRvIHtcblxuXHRcdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKCRzY29wZS5kYXRhLCBmdW5jdGlvbiAobmF0LCBrZXkpIHtcblx0XHRcdFx0XHRcdFx0aWYgKHBhcnNlSW50KG5hdFtvcHRpb25zLmZpZWxkXSkgPT0gcGFyc2VJbnQodmFsdWUpKSB7XG5cdFx0XHRcdFx0XHRcdFx0ZmluYWwgPSBuYXQ7XG5cdFx0XHRcdFx0XHRcdFx0Zm91bmQgPSB0cnVlO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdGNvdW50Kys7XG5cdFx0XHRcdFx0XHR2YWx1ZSA9IHZhbHVlID4gNTAgPyB2YWx1ZSAtIDEgOiB2YWx1ZSArIDE7XG5cdFx0XHRcdFx0fSB3aGlsZSAoIWZvdW5kICYmIGNvdW50IDwgMTAwKTtcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhmaW5hbCk7XG5cdFx0XHRcdFx0bmdNb2RlbC4kc2V0Vmlld1ZhbHVlKGZpbmFsKTtcblx0XHRcdFx0XHRuZ01vZGVsLiRyZW5kZXIoKTtcblx0XHRcdFx0fVxuXHRcdFx0XHQkc2NvcGUuJHdhdGNoKCdvcHRpb25zJywgZnVuY3Rpb24obixvKXtcblx0XHRcdFx0XHRpZihuID09PSBvKXtcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0b3B0aW9ucy5jb2xvcnNbMV0uY29sb3IgPSBuLmNvbG9yO1xuXHRcdFx0XHRcdGdyYWRpZW50ID0gc3ZnLmFwcGVuZCgnc3ZnOmRlZnMnKVxuXHRcdFx0XHRcdFx0LmFwcGVuZChcInN2ZzpsaW5lYXJHcmFkaWVudFwiKVxuXHRcdFx0XHRcdFx0LmF0dHIoJ2lkJywgb3B0aW9ucy5maWVsZCtcIl9cIituLmNvbG9yKVxuXHRcdFx0XHRcdFx0LmF0dHIoJ3gxJywgJzAlJylcblx0XHRcdFx0XHRcdC5hdHRyKCd5MScsICcwJScpXG5cdFx0XHRcdFx0XHQuYXR0cigneDInLCAnMTAwJScpXG5cdFx0XHRcdFx0XHQuYXR0cigneTInLCAnMCUnKVxuXHRcdFx0XHRcdFx0LmF0dHIoJ3NwcmVhZE1ldGhvZCcsICdwYWQnKVxuXHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChvcHRpb25zLmNvbG9ycywgZnVuY3Rpb24gKGNvbG9yKSB7XG5cdFx0XHRcdFx0XHRncmFkaWVudC5hcHBlbmQoJ3N2ZzpzdG9wJylcblx0XHRcdFx0XHRcdFx0LmF0dHIoJ29mZnNldCcsIGNvbG9yLnBvc2l0aW9uICsgJyUnKVxuXHRcdFx0XHRcdFx0XHQuYXR0cignc3RvcC1jb2xvcicsIGNvbG9yLmNvbG9yKVxuXHRcdFx0XHRcdFx0XHQuYXR0cignc3RvcC1vcGFjaXR5JywgY29sb3Iub3BhY2l0eSk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0cmVjdC5zdHlsZSgnZmlsbCcsICd1cmwoIycgKyBvcHRpb25zLmZpZWxkICsgJ18nK24uY29sb3IrJyknKTtcblx0XHRcdFx0XHRoYW5kbGUuc3R5bGUoJ2ZpbGwnLCBuLmNvbG9yKTtcblx0XHRcdFx0XHRoYW5kbGVMYWJlbC50ZXh0KHBhcnNlSW50KG5nTW9kZWwuJG1vZGVsVmFsdWVbbi5maWVsZF0pKTtcblx0XHRcdFx0XHRoYW5kbGVDb250LnRyYW5zaXRpb24oKS5kdXJhdGlvbig1MDApLmVhc2UoJ3F1YWQnKS5hdHRyKFwidHJhbnNmb3JtXCIsICd0cmFuc2xhdGUoJyArIHgobmdNb2RlbC4kbW9kZWxWYWx1ZVtuLmZpZWxkXSkgKyAnLCcgKyBvcHRpb25zLmhlaWdodCAvIDIgKyAnKScpO1xuXHRcdFx0XHR9KTtcblx0XHRcdFx0JHNjb3BlLiR3YXRjaChcblx0XHRcdFx0XHRmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gbmdNb2RlbC4kbW9kZWxWYWx1ZTtcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdGZ1bmN0aW9uIChuZXdWYWx1ZSwgb2xkVmFsdWUpIHtcblx0XHRcdFx0XHRcdGlmICghbmV3VmFsdWUpIHtcblx0XHRcdFx0XHRcdFx0aGFuZGxlTGFiZWwudGV4dChwYXJzZUludCgwKSk7XG5cdFx0XHRcdFx0XHRcdGhhbmRsZUNvbnQuYXR0cihcInRyYW5zZm9ybVwiLCAndHJhbnNsYXRlKCcgKyB4KDApICsgJywnICsgb3B0aW9ucy5oZWlnaHQgLyAyICsgJyknKTtcblx0XHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0aGFuZGxlTGFiZWwudGV4dChwYXJzZUludChuZXdWYWx1ZVtvcHRpb25zLmZpZWxkXSkpO1xuXHRcdFx0XHRcdFx0aWYgKG5ld1ZhbHVlID09IG9sZFZhbHVlKSB7XG5cdFx0XHRcdFx0XHRcdGhhbmRsZUNvbnQuYXR0cihcInRyYW5zZm9ybVwiLCAndHJhbnNsYXRlKCcgKyB4KG5ld1ZhbHVlW29wdGlvbnMuZmllbGRdKSArICcsJyArIG9wdGlvbnMuaGVpZ2h0IC8gMiArICcpJyk7XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRoYW5kbGVDb250LnRyYW5zaXRpb24oKS5kdXJhdGlvbig1MDApLmVhc2UoJ3F1YWQnKS5hdHRyKFwidHJhbnNmb3JtXCIsICd0cmFuc2xhdGUoJyArIHgobmV3VmFsdWVbb3B0aW9ucy5maWVsZF0pICsgJywnICsgb3B0aW9ucy5oZWlnaHQgLyAyICsgJyknKTtcblxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH07XG5cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoICdhcHAuY29udHJvbGxlcnMnICkuY29udHJvbGxlciggJ01lZGlhbkN0cmwnLCBmdW5jdGlvbigpe1xuXHRcdC8vXG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5kaXJlY3RpdmVzJykuZGlyZWN0aXZlKCAncGFyc2Vjc3YnLCBmdW5jdGlvbigkc3RhdGUsICR0aW1lb3V0LCB0b2FzdHIpIHtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRyZXN0cmljdDogJ0VBJyxcblx0XHRcdHRlbXBsYXRlVXJsOiAndmlld3MvZGlyZWN0aXZlcy9wYXJzZWNzdi9wYXJzZWNzdi5odG1sJyxcblx0XHRcdGNvbnRyb2xsZXI6ICdQYXJzZWNzdkN0cmwnLFxuXHRcdFx0cmVwbGFjZTp0cnVlLFxuXHRcdFx0bGluazogZnVuY3Rpb24oICRzY29wZSwgZWxlbWVudCwgJGF0dHJzICl7XG5cdFx0XHRcdC8vXG5cdFx0XHRcdHZhciBlcnJvcnMgPSAwO1xuXHRcdFx0XHR2YXIgc3RlcHBlZCA9IDAsIHJvd0NvdW50ID0gMCwgZXJyb3JDb3VudCA9IDAsIGZpcnN0RXJyb3I7XG5cdFx0XHRcdHZhciBzdGFydCwgZW5kO1xuXHRcdFx0XHR2YXIgZmlyc3RSdW4gPSB0cnVlO1xuXHRcdFx0XHR2YXIgbWF4VW5wYXJzZUxlbmd0aCA9IDEwMDAwO1xuXHRcdFx0XHR2YXIgYnV0dG9uID0gZWxlbWVudC5maW5kKCdidXR0b24nKTtcblx0XHRcdFx0XHR2YXIgaW5wdXQgPSBlbGVtZW50LmZpbmQoJ2lucHV0Jyk7XG5cdFx0XHRcdFx0dmFyIGlzVmVydGljYWwgPSBmYWxzZTtcblx0XHRcdFx0XHR2YXIgcmF3ID0gW107XG5cdFx0XHRcdFx0dmFyIHJhd0xpc3QgPSB7fTtcblx0XHRcdFx0XHRpbnB1dC5jc3MoeyBkaXNwbGF5Oidub25lJyB9KTtcblx0XHRcdFx0XHRidXR0b24uYmluZCgnY2xpY2snLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdFx0aW5wdXRbMF0uY2xpY2soKTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRpbnB1dC5iaW5kKCdjaGFuZ2UnLGZ1bmN0aW9uKGUpe1xuXHRcdFx0XHRcdFx0aXNWZXJ0aWNhbCA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0cmF3ID0gW107XG5cdFx0XHRcdFx0XHRyYXdMaXN0ID0ge307XG5cdFx0XHRcdFx0XHRlcnJvcnMgPSAwO1xuXHRcdFx0XHRcdFx0c3RlcHBlZCA9IDAsIHJvd0NvdW50ID0gMCwgZXJyb3JDb3VudCA9IDAsIGZpcnN0RXJyb3I7XG5cdFx0XHRcdFx0XHRzdGFydCwgZW5kO1xuXHRcdFx0XHRcdFx0Zmlyc3RSdW4gPSB0cnVlO1xuXHRcdFx0XHRcdFx0XHQkdGltZW91dChmdW5jdGlvbigpe1xuXHRcdFx0XHRcdFx0XHRcdFBhcGEucGFyc2UoaW5wdXRbMF0uZmlsZXNbMF0se1xuXHRcdFx0XHRcdFx0XHRcdFx0c2tpcEVtcHR5TGluZXM6IHRydWUsXG5cdFx0XHRcdFx0XHRcdFx0XHRoZWFkZXI6dHJ1ZSxcblx0XHRcdFx0XHRcdFx0XHRcdGR5bmFtaWNUeXBpbmc6IHRydWUsXG5cdFx0XHRcdFx0XHRcdFx0XHRzdGVwOmZ1bmN0aW9uKHJvdyl7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChyb3cuZGF0YVswXSwgZnVuY3Rpb24oaXRlbSwga2V5KXtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZihpc05hTihpdGVtKSB8fCBpdGVtIDwgMCApe1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWYoaXRlbS50b1N0cmluZygpLnRvVXBwZXJDYXNlKCkgPT0gXCJOQVwiIHx8IGl0ZW0gPCAwIHx8IGl0ZW0udG9TdHJpbmcoKS50b1VwcGVyQ2FzZSgpLmluZGV4T2YoJ04vQScpID4gLTEpe1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRyb3cuZXJyb3JzLnB1c2goe1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHR5cGU6XCIxXCIsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bWVzc2FnZTpcIkZpZWxkIGluIHJvdyBpcyBub3QgdmFsaWQgZm9yIGRhdGFiYXNlIHVzZSFcIixcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjb2x1bW46IGl0ZW1cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZXJyb3JzKys7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWYoaXNWZXJ0aWNhbCl7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKHJvdy5kYXRhWzBdLCBmdW5jdGlvbihpdGVtLCBrZXkpe1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWYoa2V5Lmxlbmd0aCA9PSAzKXtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWYodHlwZW9mXHRyYXdMaXN0W2tleV0uZGF0YSA9PSBcInVuZGVmaW5lZFwiKXtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJhd0xpc3Rba2V5XS5kYXRhID0gW107XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cmF3TGlzdFtrZXldLmRhdGEucHVzaChpdGVtKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQvL3Jhd0xpc3Rba2V5XS5lcnJvcnMgPSByb3cuZXJyb3JzO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGVsc2V7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0JHNjb3BlLnZtLmRhdGEucHVzaChyb3cpO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRcdFx0XHRiZWZvcmVGaXJzdENodW5rOiBmdW5jdGlvbihjaHVuaylcblx0XHRcdFx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0Ly9DaGVjayBpZiB0aGVyZSBhcmUgcG9pbnRzIGluIHRoZSBoZWFkZXJzXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHZhciBpbmRleCA9IGNodW5rLm1hdGNoKCAvXFxyXFxufFxccnxcXG4vICkuaW5kZXg7XG5cdFx0XHRcdFx0XHRcdFx0ICAgIHZhciBoZWFkaW5ncyA9IGNodW5rLnN1YnN0cigwLCBpbmRleCkuc3BsaXQoICcsJyApO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR2YXIgaXNJc28gPSBbXTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0Zm9yKHZhciBpID0gMDsgaSA8PSBoZWFkaW5ncy5sZW5ndGg7IGkrKyl7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWYoaGVhZGluZ3NbaV0pe1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aGVhZGluZ3NbaV0gPSBoZWFkaW5nc1tpXS5yZXBsYWNlKC9bXmEtejAtOV0vZ2ksJ18nKS50b0xvd2VyQ2FzZSgpO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWYoaGVhZGluZ3NbaV0uaW5kZXhPZignLicpID4gLTEpe1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRoZWFkaW5nc1tpXSA9IGhlYWRpbmdzW2ldLnN1YnN0cigwLCBoZWFkaW5nc1tpXS5pbmRleE9mKCcuJykpO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWYoaGVhZGluZ3NbaV0ubGVuZ3RoID09IDMpe1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpc0lzby5wdXNoKHRydWUpO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZihoZWFkaW5ncy5sZW5ndGggPT0gaXNJc28ubGVuZ3RoKXtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpc1ZlcnRpY2FsID0gdHJ1ZTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGZvcih2YXIgaSA9IDA7IGkgPD0gaGVhZGluZ3MubGVuZ3RoOyBpKyspe1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZih0eXBlb2YgcmF3TGlzdFtoZWFkaW5nc1tpXV0gPT0gXCJ1bmRlZmluZWRcIil7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cmF3TGlzdFtoZWFkaW5nc1tpXV0gPSB7fTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRyYXdMaXN0W2hlYWRpbmdzW2ldXS5kYXRhID0gW107XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHQgICAgcmV0dXJuIGhlYWRpbmdzLmpvaW4oKSArIGNodW5rLnN1YnN0cihpbmRleCk7XG5cdFx0XHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHRcdFx0ZXJyb3I6IGZ1bmN0aW9uKGVyciwgZmlsZSlcblx0XHRcdFx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0VG9hc3RTZXJ2aWNlLmVycm9yKGVycik7XG5cdFx0XHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHRcdFx0Y29tcGxldGU6IGZ1bmN0aW9uKHJlc3VsdHMpXG5cdFx0XHRcdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdCRzY29wZS52bS5lcnJvcnMgPSBlcnJvcnM7XG5cblx0XHRcdFx0XHRcdFx0XHRcdFx0Ly9TZWUgaWYgdGhlcmUgaXMgYW4gZmllbGQgbmFtZSBcImlzb1wiIGluIHRoZSBoZWFkaW5ncztcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWYoIWlzVmVydGljYWwpe1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaCgkc2NvcGUudm0uZGF0YVswXS5kYXRhWzBdLCBmdW5jdGlvbihpdGVtLCBrZXkpe1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWYoa2V5LnRvTG93ZXJDYXNlKCkuaW5kZXhPZignaXNvJykgIT0gLTEgfHwga2V5LnRvTG93ZXJDYXNlKCkuaW5kZXhPZignY29kZScpICE9IC0xKXtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0JHNjb3BlLnZtLm1ldGEuaXNvX2ZpZWxkID0ga2V5O1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZihrZXkudG9Mb3dlckNhc2UoKS5pbmRleE9mKCdjb3VudHJ5JykgIT0gLTEpe1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdCRzY29wZS52bS5tZXRhLmNvdW50cnlfZmllbGQgPSBrZXk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRlbHNle1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChyYXdMaXN0LCBmdW5jdGlvbihpdGVtLGtleSl7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpdGVtLmVycm9ycyA9IFtdO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWYoa2V5LnRvTG93ZXJDYXNlKCkgIT0gXCJ1bmRlZmluZWRcIiAmJiB0eXBlb2Yga2V5ICE9IFwidW5kZWZpbmVkXCIpe1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR2YXIgciA9IHtpc286a2V5LnRvVXBwZXJDYXNlKCl9O1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2goaXRlbS5kYXRhLCBmdW5jdGlvbihjb2x1bW4sIGkpe1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJbJ2NvbHVtbl8nK2ldID0gY29sdW1uO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlmKGlzTmFOKGNvbHVtbikgfHwgY29sdW1uIDwgMCApe1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWYoY29sdW1uLnRvU3RyaW5nKCkudG9VcHBlckNhc2UoKSA9PSBcIk5BXCIgfHwgY29sdW1uIDwgMCB8fCBjb2x1bW4udG9TdHJpbmcoKS50b1VwcGVyQ2FzZSgpLmluZGV4T2YoJ04vQScpID4gLTEpe1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpdGVtLmVycm9ycy5wdXNoKHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR0eXBlOlwiMVwiLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1lc3NhZ2U6XCJGaWVsZCBpbiByb3cgaXMgbm90IHZhbGlkIGZvciBkYXRhYmFzZSB1c2UhXCIsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Y29sdW1uOiBpdGVtXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVycm9ycysrO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdCRzY29wZS52bS5kYXRhLnB1c2goe2RhdGE6W3JdLCBlcnJvcnM6aXRlbS5lcnJvcnN9KTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQkc2NvcGUudm0ubWV0YS5pc29fZmllbGQgPSAnaXNvJztcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRcdFx0XHRcdCRzdGF0ZS5nbygnYXBwLmluZGV4LmNyZWF0ZS5iYXNpYycpO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR0b2FzdHIuaW5mbygkc2NvcGUudm0uZGF0YS5sZW5ndGgrJyBsaW5lcyBpbXBvcnRldCEnLCAnSW5mb3JtYXRpb24nKVxuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0XHRcdH0pXG5cblx0XHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9O1xuXG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCAnYXBwLmNvbnRyb2xsZXJzJyApLmNvbnRyb2xsZXIoICdQYXJzZWNzdkN0cmwnLCBmdW5jdGlvbigpe1xuXHRcdC8vXG5cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmRpcmVjdGl2ZXMnKS5kaXJlY3RpdmUoICdzaW1wbGVsaW5lY2hhcnQnLCBmdW5jdGlvbigpIHtcblx0XHR2YXIgZGVmYXVsdHMgPSBmdW5jdGlvbigpe1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0aW52ZXJ0OmZhbHNlXG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiB7XG5cdFx0XHRyZXN0cmljdDogJ0UnLFxuXHRcdFx0c2NvcGU6e1xuXHRcdFx0XHRkYXRhOic9Jyxcblx0XHRcdFx0c2VsZWN0aW9uOic9Jyxcblx0XHRcdFx0b3B0aW9uczonPSdcblx0XHRcdH0sXG5cdFx0XHR0ZW1wbGF0ZVVybDogJ3ZpZXdzL2RpcmVjdGl2ZXMvc2ltcGxlbGluZWNoYXJ0L3NpbXBsZWxpbmVjaGFydC5odG1sJyxcblx0XHRcdGNvbnRyb2xsZXI6ICdTaW1wbGVsaW5lY2hhcnRDdHJsJyxcblx0XHRcdGxpbms6IGZ1bmN0aW9uKCAkc2NvcGUsIGVsZW1lbnQsICRhdHRycyApe1xuXHRcdFx0XHQkc2NvcGUub3B0aW9ucyA9IGFuZ3VsYXIuZXh0ZW5kKGRlZmF1bHRzKCksICRzY29wZS5vcHRpb25zKTtcblx0XHRcdFx0JHNjb3BlLmNhbGN1bGF0ZUdyYXBoKCk7XG5cdFx0XHRcdCRzY29wZS5zZXRDaGFydCgpO1xuXHRcdFx0fVxuXHRcdH07XG5cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignU2ltcGxlbGluZWNoYXJ0Q3RybCcsIGZ1bmN0aW9uICgkc2NvcGUpIHtcblx0XHQkc2NvcGUuY29uZmlnID0ge1xuXHRcdFx0dmlzaWJsZTogdHJ1ZSwgLy8gZGVmYXVsdDogdHJ1ZVxuXHRcdFx0ZXh0ZW5kZWQ6IGZhbHNlLCAvLyBkZWZhdWx0OiBmYWxzZVxuXHRcdFx0ZGlzYWJsZWQ6IGZhbHNlLCAvLyBkZWZhdWx0OiBmYWxzZVxuXHRcdFx0YXV0b3JlZnJlc2g6IHRydWUsIC8vIGRlZmF1bHQ6IHRydWVcblx0XHRcdHJlZnJlc2hEYXRhT25seTogZmFsc2UsIC8vIGRlZmF1bHQ6IGZhbHNlXG5cdFx0XHRkZWVwV2F0Y2hPcHRpb25zOiB0cnVlLCAvLyBkZWZhdWx0OiB0cnVlXG5cdFx0XHRkZWVwV2F0Y2hEYXRhOiBmYWxzZSwgLy8gZGVmYXVsdDogZmFsc2Vcblx0XHRcdGRlZXBXYXRjaENvbmZpZzogdHJ1ZSwgLy8gZGVmYXVsdDogdHJ1ZVxuXHRcdFx0ZGVib3VuY2U6IDEwIC8vIGRlZmF1bHQ6IDEwXG5cdFx0fTtcblx0XHQkc2NvcGUuY2hhcnQgPSB7XG5cdFx0XHRvcHRpb25zOiB7XG5cdFx0XHRcdGNoYXJ0OiB7fVxuXHRcdFx0fSxcblx0XHRcdGRhdGE6IFtdXG5cdFx0fTtcblx0XHQkc2NvcGUuc2V0Q2hhcnQgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHQkc2NvcGUuY2hhcnQub3B0aW9ucy5jaGFydCA9IHtcblx0XHRcdFx0dHlwZTogJ2xpbmVDaGFydCcsXG5cdFx0XHRcdGxlZ2VuZFBvc2l0aW9uOiAnbGVmdCcsXG5cdFx0XHRcdG1hcmdpbjoge1xuXHRcdFx0XHRcdHRvcDogMjAsXG5cdFx0XHRcdFx0cmlnaHQ6IDIwLFxuXHRcdFx0XHRcdGJvdHRvbTogMjAsXG5cdFx0XHRcdFx0bGVmdDogMjBcblx0XHRcdFx0fSxcblx0XHRcdFx0eDogZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRyZXR1cm4gZC54O1xuXHRcdFx0XHR9LFxuXHRcdFx0XHR5OiBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdHJldHVybiBkLnk7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdHNob3dMZWdlbmQ6IGZhbHNlLFxuXHRcdFx0XHRzaG93VmFsdWVzOiBmYWxzZSxcblx0XHRcdFx0c2hvd1lBeGlzOiBmYWxzZSxcblx0XHRcdFx0dHJhbnNpdGlvbkR1cmF0aW9uOiA1MDAsXG5cdFx0XHRcdHVzZUludGVyYWN0aXZlR3VpZGVsaW5lOiB0cnVlLFxuXHRcdFx0XHQvL2ZvcmNlWTogWzEwMCwgMF0sXG5cdFx0XHRcdC8veURvbWFpbjp5RG9tYWluLFxuXHRcdFx0XHR4QXhpczoge1xuXHRcdFx0XHRcdGF4aXNMYWJlbDogJydcblx0XHRcdFx0fSxcblx0XHRcdFx0eUF4aXM6IHtcblx0XHRcdFx0XHRheGlzTGFiZWw6ICcnLFxuXHRcdFx0XHRcdGF4aXNMYWJlbERpc3RhbmNlOiAzMFxuXHRcdFx0XHR9LFxuXHRcdFx0XHRsZWdlbmQ6IHtcblx0XHRcdFx0XHRyaWdodEFsaWduOiBmYWxzZVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRsaW5lczoge1xuXHRcdFx0XHRcdGludGVycG9sYXRlOiAnY2FyZGluYWwnXG5cdFx0XHRcdH1cblxuXHRcdFx0fTtcblx0XHRcdGlmICgkc2NvcGUub3B0aW9ucy5pbnZlcnQgPT0gdHJ1ZSkge1xuXHRcdFx0XHQkc2NvcGUuY2hhcnQub3B0aW9ucy5jaGFydC55RG9tYWluID0gW3BhcnNlSW50KCRzY29wZS5yYW5nZS5tYXgpLCAkc2NvcGUucmFuZ2UubWluXTtcblx0XHRcdH1cblx0XHRcdHJldHVybiAkc2NvcGUuY2hhcnQ7XG5cdFx0fVxuXHRcdCRzY29wZS5jYWxjdWxhdGVHcmFwaCA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdHZhciBjaGFydERhdGEgPSBbXTtcblx0XHRcdCRzY29wZS5yYW5nZSA9IHtcblx0XHRcdFx0bWF4OiAwLFxuXHRcdFx0XHRtaW46IDEwMDBcblx0XHRcdH07XG5cdFx0XHRhbmd1bGFyLmZvckVhY2goJHNjb3BlLnNlbGVjdGlvbiwgZnVuY3Rpb24gKGl0ZW0sIGtleSkge1xuXHRcdFx0XHR2YXIgZ3JhcGggPSB7XG5cdFx0XHRcdFx0aWQ6IGtleSxcblx0XHRcdFx0XHRrZXk6IGl0ZW0udGl0bGUsXG5cdFx0XHRcdFx0Y29sb3I6IGl0ZW0uY29sb3IsXG5cdFx0XHRcdFx0dmFsdWVzOiBbXVxuXHRcdFx0XHR9O1xuXHRcdFx0XHRhbmd1bGFyLmZvckVhY2goJHNjb3BlLmRhdGEsIGZ1bmN0aW9uIChkYXRhLCBrKSB7XG5cdFx0XHRcdFx0Z3JhcGgudmFsdWVzLnB1c2goe1xuXHRcdFx0XHRcdFx0aWQ6IGssXG5cdFx0XHRcdFx0XHR4OiBkYXRhW2l0ZW0uZmllbGRzLnhdLFxuXHRcdFx0XHRcdFx0eTogZGF0YVtpdGVtLmZpZWxkcy55XVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdCRzY29wZS5yYW5nZS5tYXggPSBNYXRoLm1heCgkc2NvcGUucmFuZ2UubWF4LCBkYXRhW2l0ZW0uZmllbGRzLnldKTtcblx0XHRcdFx0XHQkc2NvcGUucmFuZ2UubWluID0gTWF0aC5taW4oJHNjb3BlLnJhbmdlLm1pbiwgZGF0YVtpdGVtLmZpZWxkcy55XSk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRjaGFydERhdGEucHVzaChncmFwaCk7XG5cdFx0XHR9KTtcblxuXHRcdFx0JHNjb3BlLmNoYXJ0LmRhdGEgPSBjaGFydERhdGE7XG5cdFx0XHRpZiAoJHNjb3BlLm9wdGlvbnMuaW52ZXJ0ID09IFwidHJ1ZVwiKSB7XG5cdFx0XHRcdCRzY29wZS5jaGFydC5vcHRpb25zLmNoYXJ0LnlEb21haW4gPSBbcGFyc2VJbnQoJHNjb3BlLnJhbmdlLm1heCksICRzY29wZS5yYW5nZS5taW5dO1xuXHRcdFx0fVxuXHRcdH07XG5cdFx0JHNjb3BlLiR3YXRjaCgnZGF0YScsIGZ1bmN0aW9uIChuLCBvKSB7XG5cdFx0XHRpZiAoIW4pIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdFx0JHNjb3BlLmNhbGN1bGF0ZUdyYXBoKCk7XG5cdFx0fSk7XG5cdFx0JHNjb3BlLiR3YXRjaCgnc2VsZWN0aW9uJywgZnVuY3Rpb24gKG4sIG8pIHtcblx0XHRcdGlmIChuID09PSBvKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHRcdCRzY29wZS5jYWxjdWxhdGVHcmFwaCgpO1xuXHRcdH0pXG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZGlyZWN0aXZlcycpLmFuaW1hdGlvbignLnNsaWRlLXRvZ2dsZScsIFsnJGFuaW1hdGVDc3MnLCBmdW5jdGlvbigkYW5pbWF0ZUNzcykge1xuXG5cdFx0dmFyIGxhc3RJZCA9IDA7XG4gICAgICAgIHZhciBfY2FjaGUgPSB7fTtcblxuICAgICAgICBmdW5jdGlvbiBnZXRJZChlbCkge1xuICAgICAgICAgICAgdmFyIGlkID0gZWxbMF0uZ2V0QXR0cmlidXRlKFwiZGF0YS1zbGlkZS10b2dnbGVcIik7XG4gICAgICAgICAgICBpZiAoIWlkKSB7XG4gICAgICAgICAgICAgICAgaWQgPSArK2xhc3RJZDtcbiAgICAgICAgICAgICAgICBlbFswXS5zZXRBdHRyaWJ1dGUoXCJkYXRhLXNsaWRlLXRvZ2dsZVwiLCBpZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gaWQ7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gZ2V0U3RhdGUoaWQpIHtcbiAgICAgICAgICAgIHZhciBzdGF0ZSA9IF9jYWNoZVtpZF07XG4gICAgICAgICAgICBpZiAoIXN0YXRlKSB7XG4gICAgICAgICAgICAgICAgc3RhdGUgPSB7fTtcbiAgICAgICAgICAgICAgICBfY2FjaGVbaWRdID0gc3RhdGU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBnZW5lcmF0ZVJ1bm5lcihjbG9zaW5nLCBzdGF0ZSwgYW5pbWF0b3IsIGVsZW1lbnQsIGRvbmVGbikge1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHN0YXRlLmFuaW1hdGluZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgc3RhdGUuYW5pbWF0b3IgPSBhbmltYXRvcjtcbiAgICAgICAgICAgICAgICBzdGF0ZS5kb25lRm4gPSBkb25lRm47XG4gICAgICAgICAgICAgICAgYW5pbWF0b3Iuc3RhcnQoKS5maW5hbGx5KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoY2xvc2luZyAmJiBzdGF0ZS5kb25lRm4gPT09IGRvbmVGbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudFswXS5zdHlsZS5oZWlnaHQgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBzdGF0ZS5hbmltYXRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgc3RhdGUuYW5pbWF0b3IgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgICAgIHN0YXRlLmRvbmVGbigpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGxlYXZlOiBmdW5jdGlvbihlbGVtZW50LCBkb25lRm4pIHtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgc3RhdGUgPSBnZXRTdGF0ZShnZXRJZChlbGVtZW50KSk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBoZWlnaHQgPSAoc3RhdGUuYW5pbWF0aW5nICYmIHN0YXRlLmhlaWdodCkgP1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGUuaGVpZ2h0IDogZWxlbWVudFswXS5vZmZzZXRIZWlnaHQ7XG4gICAgICAgICAgICAgICAgICAgIHZhciBhbmltYXRvciA9ICRhbmltYXRlQ3NzKGVsZW1lbnQsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZyb206IHtoZWlnaHQ6IGhlaWdodCArICdweCcsIG9wYWNpdHk6IDF9LFxuICAgICAgICAgICAgICAgICAgICAgICAgdG86IHtoZWlnaHQ6ICcwcHgnLCBvcGFjaXR5OiAwfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFuaW1hdG9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3RhdGUuYW5pbWF0aW5nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGUuZG9uZUZuID1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdlbmVyYXRlUnVubmVyKHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuaW1hdG9yLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvbmVGbik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHN0YXRlLmFuaW1hdG9yLmVuZCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGUuaGVpZ2h0ID0gaGVpZ2h0O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBnZW5lcmF0ZVJ1bm5lcih0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5pbWF0b3IsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvbmVGbikoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgZG9uZUZuKCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZW50ZXI6IGZ1bmN0aW9uKGVsZW1lbnQsIGRvbmVGbikge1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciBzdGF0ZSA9IGdldFN0YXRlKGdldElkKGVsZW1lbnQpKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGhlaWdodCA9IChzdGF0ZS5hbmltYXRpbmcgJiYgc3RhdGUuaGVpZ2h0KSA/XG4gICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZS5oZWlnaHQgOiBlbGVtZW50WzBdLm9mZnNldEhlaWdodDtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgYW5pbWF0b3IgPSAkYW5pbWF0ZUNzcyhlbGVtZW50LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmcm9tOiB7aGVpZ2h0OiAnMHB4Jywgb3BhY2l0eTogMH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB0bzoge2hlaWdodDogaGVpZ2h0ICsgJ3B4Jywgb3BhY2l0eTogMX1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChhbmltYXRvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN0YXRlLmFuaW1hdGluZykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlLmRvbmVGbiA9IGdlbmVyYXRlUnVubmVyKGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuaW1hdG9yLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZG9uZUZuKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gc3RhdGUuYW5pbWF0b3IuZW5kKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZS5oZWlnaHQgPSBoZWlnaHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGdlbmVyYXRlUnVubmVyKGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5pbWF0b3IsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvbmVGbikoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgZG9uZUZuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfV0pO1xufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSggJ2FwcC5jb250cm9sbGVycycgKS5jb250cm9sbGVyKCAnU2xpZGVUb2dnbGVDdHJsJywgZnVuY3Rpb24oKXtcblx0XHQvL1xuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5kaXJlY3RpdmVzJykuZGlyZWN0aXZlKCdzdWJpbmRleCcsIHN1YmluZGV4KTtcblxuXHRzdWJpbmRleC4kaW5qZWN0ID0gWyckdGltZW91dCcsICdzbW9vdGhTY3JvbGwnXTtcblxuXHRmdW5jdGlvbiBzdWJpbmRleCgkdGltZW91dCwgc21vb3RoU2Nyb2xsKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlc3RyaWN0OiAnRScsXG5cdFx0XHRyZXBsYWNlOiB0cnVlLFxuXHRcdFx0Y29udHJvbGxlcjogJ1N1YmluZGV4Q3RybCcsXG5cdFx0XHR0ZW1wbGF0ZVVybDogJ3ZpZXdzL2RpcmVjdGl2ZXMvc3ViaW5kZXgvc3ViaW5kZXguaHRtbCcsXG5cdFx0XHRsaW5rOiBzdWJpbmRleExpbmtGdW5jdGlvblxuXHRcdH07XG5cblx0XHRmdW5jdGlvbiBzdWJpbmRleExpbmtGdW5jdGlvbigkc2NvcGUsIGVsZW1lbnQsICRhdHRycykge1xuXHRcdH1cblx0fVxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ1N1YmluZGV4Q3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgJGZpbHRlciwgJHRpbWVvdXQpIHtcblx0XHQkc2NvcGUuaW5mbyA9IGZhbHNlO1xuXHRcdCRzY29wZS5zZXRDaGFydCA9IHNldENoYXJ0O1xuXHRcdCRzY29wZS5jYWxjdWxhdGVHcmFwaCA9IGNhbGN1bGF0ZUdyYXBoO1xuXHRcdCRzY29wZS5jcmVhdGVJbmRleGVyID0gY3JlYXRlSW5kZXhlcjtcblx0XHQkc2NvcGUuY2FsY1N1YlJhbmsgPSBjYWxjU3ViUmFuaztcblx0XHQkc2NvcGUudG9nZ2xlSW5mbyA9IHRvZ2dsZUluZm87XG5cdFx0JHNjb3BlLmNyZWF0ZU9wdGlvbnMgPSBjcmVhdGVPcHRpb25zO1xuXHRcdCRzY29wZS5nZXRTdWJSYW5rID0gZ2V0U3ViUmFuaztcblx0XHRhY3RpdmF0ZSgpO1xuXG5cdFx0ZnVuY3Rpb24gYWN0aXZhdGUoKSB7XG5cdFx0XHQkc2NvcGUuY2FsY1N1YlJhbmsoKTtcblx0XHRcdCRzY29wZS5zZXRDaGFydCgpO1xuXHRcdFx0JHNjb3BlLmNhbGN1bGF0ZUdyYXBoKCk7XG5cdFx0XHQkc2NvcGUuY3JlYXRlSW5kZXhlcigpO1xuXHRcdFx0JHNjb3BlLmNyZWF0ZU9wdGlvbnMoKTtcblx0XHRcdCRzY29wZS4kd2F0Y2goJ2Rpc3BsYXkuc2VsZWN0ZWRDYXQnLCBmdW5jdGlvbihuZXdJdGVtLCBvbGRJdGVtKSB7XG5cdFx0XHRcdGlmIChuZXdJdGVtID09PSBvbGRJdGVtKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdCRzY29wZS5jcmVhdGVJbmRleGVyKCk7XG5cdFx0XHRcdCRzY29wZS5jYWxjdWxhdGVHcmFwaCgpO1xuXHRcdFx0XHQkc2NvcGUuY3JlYXRlT3B0aW9ucygpO1xuXHRcdFx0XHQkc2NvcGUuY2FsY1N1YlJhbmsoKTtcblx0XHRcdH0pO1xuXHRcdFx0JHNjb3BlLiR3YXRjaCgnY3VycmVudCcsIGZ1bmN0aW9uKG4sIG8pIHtcblx0XHRcdFx0aWYgKG4gPT09IG8pIHtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblx0XHRcdFx0JHNjb3BlLmNhbGNTdWJSYW5rKCk7XG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiB0b2dnbGVJbmZvKCkge1xuXHRcdFx0JHNjb3BlLmluZm8gPSAhJHNjb3BlLmluZm87XG5cdFx0fTtcblxuXHRcdGZ1bmN0aW9uIGNhbGNTdWJSYW5rKCkge1xuXHRcdFx0dmFyIHJhbmsgPSAwO1xuXHRcdFx0YW5ndWxhci5mb3JFYWNoKCRzY29wZS5kYXRhLCBmdW5jdGlvbihpdGVtKSB7XG5cdFx0XHRcdGl0ZW1bJHNjb3BlLmRpc3BsYXkuc2VsZWN0ZWRDYXQudHlwZV0gPSBwYXJzZUZsb2F0KGl0ZW1bJHNjb3BlLmRpc3BsYXkuc2VsZWN0ZWRDYXQudHlwZV0pO1xuXHRcdFx0XHRpdGVtWydzY29yZSddID0gcGFyc2VJbnQoaXRlbVsnc2NvcmUnXSk7XG5cdFx0XHR9KVxuXHRcdFx0dmFyIGZpbHRlciA9ICRmaWx0ZXIoJ29yZGVyQnknKSgkc2NvcGUuZXBpLCBbJHNjb3BlLmRpc3BsYXkuc2VsZWN0ZWRDYXQudHlwZSwgXCJzY29yZVwiXSwgdHJ1ZSk7XG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGZpbHRlci5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRpZiAoZmlsdGVyW2ldLmlzbyA9PSAkc2NvcGUuY3VycmVudC5pc28pIHtcblx0XHRcdFx0XHRyYW5rID0gaSArIDE7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdCRzY29wZS5jdXJyZW50WyRzY29wZS5kaXNwbGF5LnNlbGVjdGVkQ2F0LnR5cGUrJ19yYW5rJ10gPSByYW5rO1xuXHRcdH1cblx0XHRmdW5jdGlvbiBnZXRTdWJSYW5rKGNvdW50cnkpe1xuXHRcdFx0dmFyIGZpbHRlciA9ICRmaWx0ZXIoJ29yZGVyQnknKSgkc2NvcGUuZXBpLCBbJHNjb3BlLmRpc3BsYXkuc2VsZWN0ZWRDYXQudHlwZSwgXCJzY29yZVwiXSwgdHJ1ZSk7XG5cdFx0XHR2YXIgcmFuayA9IDA7XG5cdFx0XHRhbmd1bGFyLmZvckVhY2goZmlsdGVyLCBmdW5jdGlvbihpdGVtLCBrZXkpe1xuXHRcdFx0XHRpZihpdGVtLmNvdW50cnkgPT0gY291bnRyeS5jb3VudHJ5KXtcblx0XHRcdFx0XHRyYW5rID0ga2V5O1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHRcdHJldHVybiByYW5rKzE7XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIGNyZWF0ZUluZGV4ZXIoKSB7XG5cdFx0XHQkc2NvcGUuaW5kZXhlciA9IFskc2NvcGUuJHBhcmVudC5kaXNwbGF5LnNlbGVjdGVkQ2F0LmRhdGFdO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGNyZWF0ZU9wdGlvbnMoKSB7XG5cdFx0XHQkc2NvcGUubWVkaWFuT3B0aW9ucyA9IHtcblx0XHRcdFx0Y29sb3I6ICRzY29wZS4kcGFyZW50LmRpc3BsYXkuc2VsZWN0ZWRDYXQuY29sb3IsXG5cdFx0XHRcdGZpZWxkOiAkc2NvcGUuJHBhcmVudC5kaXNwbGF5LnNlbGVjdGVkQ2F0LnR5cGUsXG5cdFx0XHRcdGhhbmRsaW5nOiBmYWxzZSxcblx0XHRcdFx0bWFyZ2luOntcblx0XHRcdFx0XHRsZWZ0OjEwXG5cdFx0XHRcdH1cblx0XHRcdH07XG5cdFx0XHQkc2NvcGUubWVkaWFuT3B0aW9uc0JpZyA9IHtcblx0XHRcdFx0Y29sb3I6ICRzY29wZS4kcGFyZW50LmRpc3BsYXkuc2VsZWN0ZWRDYXQuY29sb3IsXG5cdFx0XHRcdGZpZWxkOiAkc2NvcGUuJHBhcmVudC5kaXNwbGF5LnNlbGVjdGVkQ2F0LnR5cGUsXG5cdFx0XHRcdGhhbmRsaW5nOiBmYWxzZSxcblx0XHRcdFx0bWFyZ2luOntcblx0XHRcdFx0XHRsZWZ0OjIwXG5cdFx0XHRcdH1cblx0XHRcdH07XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gc2V0Q2hhcnQoKSB7XG5cdFx0XHQkc2NvcGUuY2hhcnQgPSB7XG5cdFx0XHRcdG9wdGlvbnM6IHtcblx0XHRcdFx0XHRjaGFydDoge1xuXHRcdFx0XHRcdFx0dHlwZTogJ2xpbmVDaGFydCcsXG5cdFx0XHRcdFx0XHQvL2hlaWdodDogMjAwLFxuXHRcdFx0XHRcdFx0bGVnZW5kUG9zaXRpb246ICdsZWZ0Jyxcblx0XHRcdFx0XHRcdG1hcmdpbjoge1xuXHRcdFx0XHRcdFx0XHR0b3A6IDIwLFxuXHRcdFx0XHRcdFx0XHRyaWdodDogMjAsXG5cdFx0XHRcdFx0XHRcdGJvdHRvbTogMjAsXG5cdFx0XHRcdFx0XHRcdGxlZnQ6IDIwXG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0eDogZnVuY3Rpb24oZCkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gZC54O1xuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdHk6IGZ1bmN0aW9uKGQpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGQueTtcblx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRzaG93VmFsdWVzOiBmYWxzZSxcblx0XHRcdFx0XHRcdHNob3dZQXhpczogZmFsc2UsXG5cdFx0XHRcdFx0XHR0cmFuc2l0aW9uRHVyYXRpb246IDUwMCxcblx0XHRcdFx0XHRcdHVzZUludGVyYWN0aXZlR3VpZGVsaW5lOiB0cnVlLFxuXHRcdFx0XHRcdFx0Zm9yY2VZOiBbMTAwLCAwXSxcblx0XHRcdFx0XHRcdHhBeGlzOiB7XG5cdFx0XHRcdFx0XHRcdGF4aXNMYWJlbDogJydcblx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHR5QXhpczoge1xuXHRcdFx0XHRcdFx0XHRheGlzTGFiZWw6ICcnLFxuXHRcdFx0XHRcdFx0XHRheGlzTGFiZWxEaXN0YW5jZTogMzBcblx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRsZWdlbmQ6IHtcblx0XHRcdFx0XHRcdFx0cmlnaHRBbGlnbjogZmFsc2UsXG5cdFx0XHRcdFx0XHRcdG1hcmdpbjoge1xuXHRcdFx0XHRcdFx0XHRcdGJvdHRvbTogMzBcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdGxpbmVzOiB7XG5cdFx0XHRcdFx0XHRcdGludGVycG9sYXRlOiAnY2FyZGluYWwnXG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRkYXRhOiBbXVxuXHRcdFx0fTtcblx0XHRcdHJldHVybiAkc2NvcGUuY2hhcnQ7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gY2FsY3VsYXRlR3JhcGgoKSB7XG5cdFx0XHR2YXIgY2hhcnREYXRhID0gW107XG5cdFx0XHRhbmd1bGFyLmZvckVhY2goJHNjb3BlLmRpc3BsYXkuc2VsZWN0ZWRDYXQuY2hpbGRyZW4sIGZ1bmN0aW9uKGl0ZW0sIGtleSkge1xuXHRcdFx0XHR2YXIgZ3JhcGggPSB7XG5cdFx0XHRcdFx0a2V5OiBpdGVtLnRpdGxlLFxuXHRcdFx0XHRcdGNvbG9yOiBpdGVtLmNvbG9yLFxuXHRcdFx0XHRcdHZhbHVlczogW11cblx0XHRcdFx0fTtcblx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKCRzY29wZS5jb3VudHJ5LmVwaSwgZnVuY3Rpb24oZGF0YSkge1xuXHRcdFx0XHRcdGdyYXBoLnZhbHVlcy5wdXNoKHtcblx0XHRcdFx0XHRcdHg6IGRhdGEueWVhcixcblx0XHRcdFx0XHRcdHk6IGRhdGFbaXRlbS5jb2x1bW5fbmFtZV1cblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fSk7XG5cdFx0XHRcdGNoYXJ0RGF0YS5wdXNoKGdyYXBoKTtcblx0XHRcdH0pO1xuXHRcdFx0JHNjb3BlLmNoYXJ0LmRhdGEgPSBjaGFydERhdGE7XG5cdFx0fVxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZGlyZWN0aXZlcycpLmRpcmVjdGl2ZSgnc3VuYnVyc3QnLCBmdW5jdGlvbiAoKSB7XG5cdFx0dmFyIGRlZmF1bHRzID0gZnVuY3Rpb24oKXtcblx0XHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHQgbW9kZTogJ3NpemUnXG5cdFx0XHRcdH1cblx0XHR9O1xuXHRcdHJldHVybiB7XG5cdFx0XHRyZXN0cmljdDogJ0UnLFxuXHRcdFx0Ly90ZW1wbGF0ZVVybDogJ3ZpZXdzL2RpcmVjdGl2ZXMvc3VuYnVyc3Qvc3VuYnVyc3QuaHRtbCcsXG5cdFx0XHRjb250cm9sbGVyOiAnU3VuYnVyc3RDdHJsJyxcblx0XHRcdHNjb3BlOiB7XG5cdFx0XHRcdGRhdGE6ICc9J1xuXHRcdFx0fSxcblx0XHRcdGxpbms6IGZ1bmN0aW9uICgkc2NvcGUsIGVsZW1lbnQsICRhdHRycykge1xuXHRcdFx0XHR2YXIgb3B0aW9ucyA9IGFuZ3VsYXIuZXh0ZW5kKGRlZmF1bHRzKCksICRhdHRycyk7XG5cdFx0XHRcdCRzY29wZS5zZXRDaGFydCgpO1xuXHRcdFx0XHQkc2NvcGUuY2FsY3VsYXRlR3JhcGgoKTtcblx0XHRcdFx0dmFyIHdpZHRoID0gNjEwLFxuXHRcdFx0XHRcdGhlaWdodCA9IHdpZHRoLFxuXHRcdFx0XHRcdHJhZGl1cyA9ICh3aWR0aCkgLyAyLFxuXHRcdFx0XHRcdHggPSBkMy5zY2FsZS5saW5lYXIoKS5yYW5nZShbMCwgMiAqIE1hdGguUEldKSxcblx0XHRcdFx0XHR5ID0gZDMuc2NhbGUucG93KCkuZXhwb25lbnQoMS4zKS5kb21haW4oWzAsIDFdKS5yYW5nZShbMCwgcmFkaXVzXSksXG5cdFx0XHRcdFx0Ly9+IHkgPSBkMy5zY2FsZS5wb3coKS5leHBvbmVudCgxLjMpLmRvbWFpbihbMCwgMC4yNSwgMV0pLnJhbmdlKFswLCAzMCwgcmFkaXVzXSksXG5cdFx0XHRcdFx0Ly9+IHkgPSBkMy5zY2FsZS5saW5lYXIoKS5kb21haW4oWzAsIDAuMjUsIDAuNSwgMC43NSwgMV0pLnJhbmdlKFswLCAzMCwgMTE1LCAyMDAsIHJhZGl1c10pLFxuXHRcdFx0XHRcdHBhZGRpbmcgPSAwLFxuXHRcdFx0XHRcdGR1cmF0aW9uID0gMTAwMCxcblx0XHRcdFx0XHRjaXJjUGFkZGluZyA9IDEwO1xuXG5cdFx0XHRcdHZhciBkaXYgPSBkMy5zZWxlY3QoZWxlbWVudFswXSk7XG5cblxuXHRcdFx0XHR2YXIgdmlzID0gZGl2LmFwcGVuZChcInN2Z1wiKVxuXHRcdFx0XHRcdC5hdHRyKFwid2lkdGhcIiwgd2lkdGggKyBwYWRkaW5nICogMilcblx0XHRcdFx0XHQuYXR0cihcImhlaWdodFwiLCBoZWlnaHQgKyBwYWRkaW5nICogMilcblx0XHRcdFx0XHQuYXBwZW5kKFwiZ1wiKVxuXHRcdFx0XHRcdC5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiICsgW3JhZGl1cyArIHBhZGRpbmcsIHJhZGl1cyArIHBhZGRpbmddICsgXCIpXCIpO1xuXG5cdFx0XHRcdC8qXG5cdFx0XHRcdGRpdi5hcHBlbmQoXCJwXCIpXG5cdFx0XHRcdFx0XHQuYXR0cihcImlkXCIsIFwiaW50cm9cIilcblx0XHRcdFx0XHRcdC50ZXh0KFwiQ2xpY2sgdG8gem9vbSFcIik7XG5cdFx0XHRcdCovXG5cblx0XHRcdFx0dmFyIHBhcnRpdGlvbiA9IGQzLmxheW91dC5wYXJ0aXRpb24oKVxuXHRcdFx0XHRcdC5zb3J0KG51bGwpXG5cdFx0XHRcdFx0LnZhbHVlKGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gMTtcblx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHR2YXIgYXJjID0gZDMuc3ZnLmFyYygpXG5cdFx0XHRcdFx0LnN0YXJ0QW5nbGUoZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdHJldHVybiBNYXRoLm1heCgwLCBNYXRoLm1pbigyICogTWF0aC5QSSwgeChkLngpKSk7XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQuZW5kQW5nbGUoZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdHJldHVybiBNYXRoLm1heCgwLCBNYXRoLm1pbigyICogTWF0aC5QSSwgeChkLnggKyBkLmR4KSkpO1xuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0LmlubmVyUmFkaXVzKGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gTWF0aC5tYXgoMCwgZC55ID8geShkLnkpIDogZC55KTtcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC5vdXRlclJhZGl1cyhmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIE1hdGgubWF4KDAsIHkoZC55ICsgZC5keSkpO1xuXHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdHZhciBzcGVjaWFsMSA9IFwiV2FzdGV3YXRlciBUcmVhdG1lbnRcIixcblx0XHRcdFx0XHRzcGVjaWFsMiA9IFwiQWlyIFBvbGx1dGlvbiBQTTIuNSBFeGNlZWRhbmNlXCIsXG5cdFx0XHRcdFx0c3BlY2lhbDMgPSBcIkFncmljdWx0dXJhbCBTdWJzaWRpZXNcIixcblx0XHRcdFx0XHRzcGVjaWFsNCA9IFwiUGVzdGljaWRlIFJlZ3VsYXRpb25cIjtcblxuXG5cdFx0XHRcdHZhciBub2RlcyA9IHBhcnRpdGlvbi5ub2Rlcygkc2NvcGUuY2FsY3VsYXRlR3JhcGgoKSk7XG5cblx0XHRcdFx0dmFyIHBhdGggPSB2aXMuc2VsZWN0QWxsKFwicGF0aFwiKS5kYXRhKG5vZGVzKTtcblx0XHRcdFx0cGF0aC5lbnRlcigpLmFwcGVuZChcInBhdGhcIilcblx0XHRcdFx0XHQuYXR0cihcImlkXCIsIGZ1bmN0aW9uIChkLCBpKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gXCJwYXRoLVwiICsgaTtcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC5hdHRyKFwiZFwiLCBhcmMpXG5cdFx0XHRcdFx0LmF0dHIoXCJmaWxsLXJ1bGVcIiwgXCJldmVub2RkXCIpXG5cdFx0XHRcdFx0LmF0dHIoXCJjbGFzc1wiLCBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGQuZGVwdGggPyBcImJyYW5jaFwiIDogXCJyb290XCI7XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQuc3R5bGUoXCJmaWxsXCIsIHNldENvbG9yKVxuXHRcdFx0XHRcdC5vbihcImNsaWNrXCIsIGNsaWNrKTtcblxuXHRcdFx0XHR2YXIgdGV4dCA9IHZpcy5zZWxlY3RBbGwoXCJ0ZXh0XCIpLmRhdGEobm9kZXMpO1xuXHRcdFx0XHR2YXIgdGV4dEVudGVyID0gdGV4dC5lbnRlcigpLmFwcGVuZChcInRleHRcIilcblx0XHRcdFx0XHQuc3R5bGUoXCJmaWxsLW9wYWNpdHlcIiwgMSlcblx0XHRcdFx0XHQuYXR0cihcInRleHQtYW5jaG9yXCIsIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRpZiAoZC5kZXB0aClcblx0XHRcdFx0XHRcdFx0cmV0dXJuIFwibWlkZGxlXCI7XG5cdFx0XHRcdFx0XHQvL34gcmV0dXJuIHgoZC54ICsgZC5keCAvIDIpID4gTWF0aC5QSSA/IFwiZW5kXCIgOiBcInN0YXJ0XCI7XG5cdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdHJldHVybiBcIm1pZGRsZVwiO1xuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0LmF0dHIoXCJpZFwiLCBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIFwiZGVwdGhcIiArIGQuZGVwdGg7XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQuYXR0cihcImNsYXNzXCIsIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gXCJzZWN0b3JcIlxuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0LmF0dHIoXCJkeVwiLCBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGQuZGVwdGggPyBcIi4yZW1cIiA6IFwiMC4zNWVtXCI7XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQuYXR0cihcInRyYW5zZm9ybVwiLCBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0dmFyIG11bHRpbGluZSA9IChkLm5hbWUgfHwgXCJcIikuc3BsaXQoXCIgXCIpLmxlbmd0aCA+IDIsXG5cdFx0XHRcdFx0XHRcdGFuZ2xlQWxpZ24gPSAoZC54ID4gMC41ID8gMiA6IC0yKSxcblx0XHRcdFx0XHRcdFx0YW5nbGUgPSB4KGQueCArIGQuZHggLyAyKSAqIDE4MCAvIE1hdGguUEkgLSA5MCArIChtdWx0aWxpbmUgPyBhbmdsZUFsaWduIDogMCksXG5cdFx0XHRcdFx0XHRcdHJvdGF0ZSA9IGFuZ2xlICsgKG11bHRpbGluZSA/IC0uNSA6IDApLFxuXHRcdFx0XHRcdFx0XHR0cmFuc2wgPSAoeShkLnkpICsgY2lyY1BhZGRpbmcpICsgMzUsXG5cdFx0XHRcdFx0XHRcdHNlY0FuZ2xlID0gKGFuZ2xlID4gOTAgPyAtMTgwIDogMCk7XG5cdFx0XHRcdFx0XHRpZiAoZC5uYW1lID09IHNwZWNpYWwzIHx8IGQubmFtZSA9PSBzcGVjaWFsNCkgcm90YXRlICs9IDE7XG5cdFx0XHRcdFx0XHRpZiAoZC5kZXB0aCA9PSAwKSB7XG5cdFx0XHRcdFx0XHRcdHRyYW5zbCA9IC0yLjUwO1xuXHRcdFx0XHRcdFx0XHRyb3RhdGUgPSAwO1xuXHRcdFx0XHRcdFx0XHRzZWNBbmdsZSA9IDA7XG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKGQuZGVwdGggPT0gMSkgdHJhbnNsICs9IC05O1xuXHRcdFx0XHRcdFx0ZWxzZSBpZiAoZC5kZXB0aCA9PSAyKSB0cmFuc2wgKz0gLTU7XG5cdFx0XHRcdFx0XHRlbHNlIGlmIChkLmRlcHRoID09IDMpIHRyYW5zbCArPSA0O1xuXHRcdFx0XHRcdFx0cmV0dXJuIFwicm90YXRlKFwiICsgcm90YXRlICsgXCIpdHJhbnNsYXRlKFwiICsgdHJhbnNsICsgXCIpcm90YXRlKFwiICsgc2VjQW5nbGUgKyBcIilcIjtcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC5vbihcImNsaWNrXCIsIGNsaWNrKTtcblxuXHRcdFx0XHQvLyBBZGQgbGFiZWxzLiBWZXJ5IHVnbHkgY29kZSB0byBzcGxpdCBzZW50ZW5jZXMgaW50byBsaW5lcy4gQ2FuIG9ubHkgbWFrZVxuXHRcdFx0XHQvLyBjb2RlIGJldHRlciBpZiBmaW5kIGEgd2F5IHRvIHVzZSBkIG91dHNpZGUgY2FsbHMgc3VjaCBhcyAudGV4dChmdW5jdGlvbihkKSlcblxuXHRcdFx0XHQvLyBUaGlzIGJsb2NrIHJlcGxhY2VzIHRoZSB0d28gYmxvY2tzIGFycm91bmQgaXQuIEl0IGlzICd1c2VmdWwnIGJlY2F1c2UgaXRcblx0XHRcdFx0Ly8gdXNlcyBmb3JlaWduT2JqZWN0LCBzbyB0aGF0IHRleHQgd2lsbCB3cmFwIGFyb3VuZCBsaWtlIGluIHJlZ3VsYXIgSFRNTC4gSSB0cmllZFxuXHRcdFx0XHQvLyB0byBnZXQgaXQgdG8gd29yaywgYnV0IGl0IG9ubHkgaW50cm9kdWNlZCBtb3JlIGJ1Z3MuIFVuZm9ydHVuYXRlbHksIHRoZVxuXHRcdFx0XHQvLyB1Z2x5IHNvbHV0aW9uIChoYXJkIGNvZGVkIGxpbmUgc3BsaWNpbmcpIHdvbi5cblx0XHRcdFx0Ly9+IHZhciB0ZXh0RW50ZXIgPSB0ZXh0LmVudGVyKCkuYXBwZW5kKFwiZm9yZWlnbk9iamVjdFwiKVxuXHRcdFx0XHQvL34gLmF0dHIoXCJ4XCIsMClcblx0XHRcdFx0Ly9+IC5hdHRyKFwieVwiLC0yMClcblx0XHRcdFx0Ly9+IC5hdHRyKFwiaGVpZ2h0XCIsIDEwMClcblx0XHRcdFx0Ly9+IC5hdHRyKFwid2lkdGhcIiwgZnVuY3Rpb24oZCl7IHJldHVybiAoeShkLmR5KSArNTApOyB9KVxuXHRcdFx0XHQvL34gLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgZnVuY3Rpb24oZCkge1xuXHRcdFx0XHQvL34gdmFyIGFuZ2xlQWxpZ24gPSAoZC54ID4gMC41ID8gMiA6IC0yKSxcblx0XHRcdFx0Ly9+IGFuZ2xlID0geChkLnggKyBkLmR4IC8gMikgKiAxODAgLyBNYXRoLlBJIC0gOTAsXG5cdFx0XHRcdC8vfiB0cmFuc2wgPSAoeShkLnkpICsgY2lyY1BhZGRpbmcpO1xuXHRcdFx0XHQvL34gZC5yb3QgPSBhbmdsZTtcblx0XHRcdFx0Ly9+IGlmICghZC5kZXB0aCkgdHJhbnNsID0gLTUwO1xuXHRcdFx0XHQvL34gaWYgKGFuZ2xlID4gOTApIHRyYW5zbCArPSAxMjA7XG5cdFx0XHRcdC8vfiBpZiAoZC5kZXB0aClcblx0XHRcdFx0Ly9+IHJldHVybiBcInJvdGF0ZShcIiArIGFuZ2xlICsgXCIpdHJhbnNsYXRlKFwiICsgdHJhbnNsICsgXCIpcm90YXRlKFwiICsgKGFuZ2xlID4gOTAgPyAtMTgwIDogMCkgKyBcIilcIjtcblx0XHRcdFx0Ly9+IGVsc2Vcblx0XHRcdFx0Ly9+IHJldHVybiBcInRyYW5zbGF0ZShcIiArIHRyYW5zbCArIFwiKVwiO1xuXHRcdFx0XHQvL34gfSlcblx0XHRcdFx0Ly9+IC5hcHBlbmQoXCJ4aHRtbDpib2R5XCIpXG5cdFx0XHRcdC8vfiAuc3R5bGUoXCJiYWNrZ3JvdW5kXCIsIFwibm9uZVwiKVxuXHRcdFx0XHQvL34gLnN0eWxlKFwidGV4dC1hbGlnblwiLCBmdW5jdGlvbihkKXsgcmV0dXJuIChkLnJvdCA+IDkwID8gXCJsZWZ0XCIgOiBcInJpZ2h0XCIpfSlcblx0XHRcdFx0Ly9+IC5odG1sKGZ1bmN0aW9uKGQpeyByZXR1cm4gJzxkaXYgY2xhc3M9JyArXCJkZXB0aFwiICsgZC5kZXB0aCArJyBzdHlsZT1cXFwid2lkdGg6ICcgKyh5KGQuZHkpICs1MCkgKydweDsnICtcInRleHQtYWxpZ246IFwiICsgKGQucm90ID4gOTAgPyBcInJpZ2h0XCIgOiBcImxlZnRcIikgKydcIj4nICtkLm5hbWUgKyc8L2Rpdj4nO30pXG5cblx0XHRcdFx0dGV4dEVudGVyLmFwcGVuZChcInRzcGFuXCIpXG5cdFx0XHRcdFx0LmF0dHIoXCJ4XCIsIDApXG5cdFx0XHRcdFx0LnRleHQoZnVuY3Rpb24gKGQpIHtcblxuXHRcdFx0XHRcdFx0aWYgKGQuZGVwdGggPT0gMyAmJiBkLm5hbWUgIT0gc3BlY2lhbDEgJiYgZC5uYW1lICE9IHNwZWNpYWwyICYmIGQubmFtZSAhPSBzcGVjaWFsMyAmJiBkLm5hbWUgIT0gc3BlY2lhbDQpXG5cdFx0XHRcdFx0XHRcdHJldHVybiBkLm5hbWUuc3BsaXQoXCIgXCIpWzBdICsgXCIgXCIgKyAoZC5uYW1lLnNwbGl0KFwiIFwiKVsxXSB8fCBcIlwiKTtcblx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGQubmFtZS5zcGxpdChcIiBcIilbMF07XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdHRleHRFbnRlci5hcHBlbmQoXCJ0c3BhblwiKVxuXHRcdFx0XHRcdC5hdHRyKFwieFwiLCAwKVxuXHRcdFx0XHRcdC5hdHRyKFwiZHlcIiwgXCIxZW1cIilcblx0XHRcdFx0XHQudGV4dChmdW5jdGlvbiAoZCkge1xuXG5cdFx0XHRcdFx0XHRpZiAoZC5kZXB0aCA9PSAzICYmIGQubmFtZSAhPSBzcGVjaWFsMSAmJiBkLm5hbWUgIT0gc3BlY2lhbDIgJiYgZC5uYW1lICE9IHNwZWNpYWwzICYmIGQubmFtZSAhPSBzcGVjaWFsNClcblx0XHRcdFx0XHRcdFx0cmV0dXJuIChkLm5hbWUuc3BsaXQoXCIgXCIpWzJdIHx8IFwiXCIpICsgXCIgXCIgKyAoZC5uYW1lLnNwbGl0KFwiIFwiKVszXSB8fCBcIlwiKTtcblx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0cmV0dXJuIChkLm5hbWUuc3BsaXQoXCIgXCIpWzFdIHx8IFwiXCIpICsgXCIgXCIgKyAoZC5uYW1lLnNwbGl0KFwiIFwiKVsyXSB8fCBcIlwiKTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0dGV4dEVudGVyLmFwcGVuZChcInRzcGFuXCIpXG5cdFx0XHRcdFx0LmF0dHIoXCJ4XCIsIDApXG5cdFx0XHRcdFx0LmF0dHIoXCJkeVwiLCBcIjFlbVwiKVxuXHRcdFx0XHRcdC50ZXh0KGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRpZiAoZC5kZXB0aCA9PSAzICYmIGQubmFtZSAhPSBzcGVjaWFsMSAmJiBkLm5hbWUgIT0gc3BlY2lhbDIgJiYgZC5uYW1lICE9IHNwZWNpYWwzICYmIGQubmFtZSAhPSBzcGVjaWFsNClcblx0XHRcdFx0XHRcdFx0cmV0dXJuIChkLm5hbWUuc3BsaXQoXCIgXCIpWzRdIHx8IFwiXCIpICsgXCIgXCIgKyAoZC5uYW1lLnNwbGl0KFwiIFwiKVs1XSB8fCBcIlwiKTtcblx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0cmV0dXJuIChkLm5hbWUuc3BsaXQoXCIgXCIpWzNdIHx8IFwiXCIpICsgXCIgXCIgKyAoZC5uYW1lLnNwbGl0KFwiIFwiKVs0XSB8fCBcIlwiKTs7XG5cdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0ZnVuY3Rpb24gY2xpY2soZCkge1xuXHRcdFx0XHRcdC8vIENvbnRyb2wgYXJjIHRyYW5zaXRpb25cblx0XHRcdFx0XHRwYXRoLnRyYW5zaXRpb24oKVxuXHRcdFx0XHRcdFx0LmR1cmF0aW9uKGR1cmF0aW9uKVxuXHRcdFx0XHRcdFx0LmF0dHJUd2VlbihcImRcIiwgYXJjVHdlZW4oZCkpO1xuXG5cdFx0XHRcdFx0Ly8gU29tZXdoYXQgb2YgYSBoYWNrIGFzIHdlIHJlbHkgb24gYXJjVHdlZW4gdXBkYXRpbmcgdGhlIHNjYWxlcy5cblx0XHRcdFx0XHQvLyBDb250cm9sIHRoZSB0ZXh0IHRyYW5zaXRpb25cblx0XHRcdFx0XHR0ZXh0LnN0eWxlKFwidmlzaWJpbGl0eVwiLCBmdW5jdGlvbiAoZSkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gaXNQYXJlbnRPZihkLCBlKSA/IG51bGwgOiBkMy5zZWxlY3QodGhpcykuc3R5bGUoXCJ2aXNpYmlsaXR5XCIpO1xuXHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRcdC50cmFuc2l0aW9uKClcblx0XHRcdFx0XHRcdC5kdXJhdGlvbihkdXJhdGlvbilcblx0XHRcdFx0XHRcdC5hdHRyVHdlZW4oXCJ0ZXh0LWFuY2hvclwiLCBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0XHRcdGlmIChkLmRlcHRoKVxuXHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIFwibWlkZGxlXCI7XG5cdFx0XHRcdFx0XHRcdFx0Ly9+IHJldHVybiB4KGQueCArIGQuZHggLyAyKSA+IE1hdGguUEkgPyBcImVuZFwiIDogXCJzdGFydFwiO1xuXHRcdFx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiBcIm1pZGRsZVwiO1xuXHRcdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRcdC5hdHRyVHdlZW4oXCJ0cmFuc2Zvcm1cIiwgZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdFx0dmFyIG11bHRpbGluZSA9IChkLm5hbWUgfHwgXCJcIikuc3BsaXQoXCIgXCIpLmxlbmd0aCA+IDI7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRcdFx0dmFyIG11bHRpbGluZSA9IChkLm5hbWUgfHwgXCJcIikuc3BsaXQoXCIgXCIpLmxlbmd0aCA+IDIsXG5cdFx0XHRcdFx0XHRcdFx0XHRhbmdsZUFsaWduID0gKGQueCA+IDAuNSA/IDIgOiAtMiksXG5cdFx0XHRcdFx0XHRcdFx0XHRhbmdsZSA9IHgoZC54ICsgZC5keCAvIDIpICogMTgwIC8gTWF0aC5QSSAtIDkwICsgKG11bHRpbGluZSA/IGFuZ2xlQWxpZ24gOiAwKSxcblx0XHRcdFx0XHRcdFx0XHRcdHJvdGF0ZSA9IGFuZ2xlICsgKG11bHRpbGluZSA/IC0uNSA6IDApLFxuXHRcdFx0XHRcdFx0XHRcdFx0dHJhbnNsID0gKHkoZC55KSArIGNpcmNQYWRkaW5nKSArIDM1LFxuXHRcdFx0XHRcdFx0XHRcdFx0c2VjQW5nbGUgPSAoYW5nbGUgPiA5MCA/IC0xODAgOiAwKTtcblx0XHRcdFx0XHRcdFx0XHRpZiAoZC5uYW1lID09IHNwZWNpYWwzIHx8IGQubmFtZSA9PSBzcGVjaWFsNCkgcm90YXRlICs9IDE7XG5cdFx0XHRcdFx0XHRcdFx0aWYgKGQuZGVwdGggPT0gMCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0dHJhbnNsID0gLTIuNTA7XG5cdFx0XHRcdFx0XHRcdFx0XHRyb3RhdGUgPSAwO1xuXHRcdFx0XHRcdFx0XHRcdFx0c2VjQW5nbGUgPSAwO1xuXHRcdFx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoZC5kZXB0aCA9PSAxKSB0cmFuc2wgKz0gLTk7XG5cdFx0XHRcdFx0XHRcdFx0ZWxzZSBpZiAoZC5kZXB0aCA9PSAyKSB0cmFuc2wgKz0gLTU7XG5cdFx0XHRcdFx0XHRcdFx0ZWxzZSBpZiAoZC5kZXB0aCA9PSAzKSB0cmFuc2wgKz0gNDtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gXCJyb3RhdGUoXCIgKyByb3RhdGUgKyBcIil0cmFuc2xhdGUoXCIgKyB0cmFuc2wgKyBcIilyb3RhdGUoXCIgKyBzZWNBbmdsZSArIFwiKVwiO1xuXHRcdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRcdC5zdHlsZShcImZpbGwtb3BhY2l0eVwiLCBmdW5jdGlvbiAoZSkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gaXNQYXJlbnRPZihkLCBlKSA/IDEgOiAxZS02O1xuXHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRcdC5lYWNoKFwiZW5kXCIsIGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdFx0XHRcdGQzLnNlbGVjdCh0aGlzKS5zdHlsZShcInZpc2liaWxpdHlcIiwgaXNQYXJlbnRPZihkLCBlKSA/IG51bGwgOiBcImhpZGRlblwiKTtcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cblxuXHRcdFx0XHRmdW5jdGlvbiBpc1BhcmVudE9mKHAsIGMpIHtcblx0XHRcdFx0XHRpZiAocCA9PT0gYykgcmV0dXJuIHRydWU7XG5cdFx0XHRcdFx0aWYgKHAuY2hpbGRyZW4pIHtcblx0XHRcdFx0XHRcdHJldHVybiBwLmNoaWxkcmVuLnNvbWUoZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGlzUGFyZW50T2YoZCwgYyk7XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0ZnVuY3Rpb24gc2V0Q29sb3IoZCkge1xuXHRcdFx0XHRcdHJldHVybiBkLmNvbG9yO1xuXHRcdFx0XHRcdGlmIChkLmNvbG9yKVxuXHRcdFx0XHRcdFx0cmV0dXJuIGQuY29sb3I7XG5cdFx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0XHR2YXIgdGludERlY2F5ID0gMC4yMDtcblx0XHRcdFx0XHRcdC8vIEZpbmQgY2hpbGQgbnVtYmVyXG5cdFx0XHRcdFx0XHR2YXIgeCA9IDA7XG5cdFx0XHRcdFx0XHR3aGlsZSAoZC5wYXJlbnQuY2hpbGRyZW5beF0gIT0gZClcblx0XHRcdFx0XHRcdFx0eCsrO1xuXHRcdFx0XHRcdFx0dmFyIHRpbnRDaGFuZ2UgPSAodGludERlY2F5ICogKHggKyAxKSkudG9TdHJpbmcoKTtcblx0XHRcdFx0XHRcdHJldHVybiBwdXNoZXIuY29sb3IoZC5wYXJlbnQuY29sb3IpLnRpbnQodGludENoYW5nZSkuaHRtbCgnaGV4NicpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIEludGVycG9sYXRlIHRoZSBzY2FsZXMhXG5cdFx0XHRcdGZ1bmN0aW9uIGFyY1R3ZWVuKGQpIHtcblx0XHRcdFx0XHR2YXIgbXkgPSBtYXhZKGQpLFxuXHRcdFx0XHRcdFx0eGQgPSBkMy5pbnRlcnBvbGF0ZSh4LmRvbWFpbigpLCBbZC54LCBkLnggKyBkLmR4IC0gMC4wMDA5XSksXG5cdFx0XHRcdFx0XHR5ZCA9IGQzLmludGVycG9sYXRlKHkuZG9tYWluKCksIFtkLnksIG15XSksXG5cdFx0XHRcdFx0XHR5ciA9IGQzLmludGVycG9sYXRlKHkucmFuZ2UoKSwgW2QueSA/IDIwIDogMCwgcmFkaXVzXSk7XG5cblx0XHRcdFx0XHRyZXR1cm4gZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdHJldHVybiBmdW5jdGlvbiAodCkge1xuXHRcdFx0XHRcdFx0XHR4LmRvbWFpbih4ZCh0KSk7XG5cdFx0XHRcdFx0XHRcdHkuZG9tYWluKHlkKHQpKS5yYW5nZSh5cih0KSk7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBhcmMoZCk7XG5cdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdH07XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRmdW5jdGlvbiBtYXhZKGQpIHtcblx0XHRcdFx0XHRyZXR1cm4gZC5jaGlsZHJlbiA/IE1hdGgubWF4LmFwcGx5KE1hdGgsIGQuY2hpbGRyZW4ubWFwKG1heFkpKSA6IGQueSArIGQuZHk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH0pO1xufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdTdW5idXJzdEN0cmwnLCBmdW5jdGlvbiAoJHNjb3BlKSB7XG5cblx0XHQkc2NvcGUuc2V0Q2hhcnQgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHQkc2NvcGUuY2hhcnQgPSB7XG5cdFx0XHRcdG9wdGlvbnM6IHtcblx0XHRcdFx0XHRjaGFydDoge1xuXHRcdFx0XHRcdFx0dHlwZTogJ3N1bmJ1cnN0Jyxcblx0XHRcdFx0XHRcdGhlaWdodDogNzAwLFxuXHRcdFx0XHRcdFx0XCJzdW5idXJzdFwiOiB7XG5cdFx0XHRcdFx0XHRcdFwiZGlzcGF0Y2hcIjoge30sXG5cdFx0XHRcdFx0XHRcdFwid2lkdGhcIjogbnVsbCxcblx0XHRcdFx0XHRcdFx0XCJoZWlnaHRcIjogbnVsbCxcblx0XHRcdFx0XHRcdFx0XCJtb2RlXCI6IFwic2l6ZVwiLFxuXHRcdFx0XHRcdFx0XHRcImlkXCI6IDIwODgsXG5cdFx0XHRcdFx0XHRcdFwiZHVyYXRpb25cIjogNTAwLFxuXHRcdFx0XHRcdFx0XHRcIm1hcmdpblwiOiB7XG5cdFx0XHRcdFx0XHRcdFx0XCJ0b3BcIjogMCxcblx0XHRcdFx0XHRcdFx0XHRcInJpZ2h0XCI6IDAsXG5cdFx0XHRcdFx0XHRcdFx0XCJib3R0b21cIjogMCxcblx0XHRcdFx0XHRcdFx0XHRcImxlZnRcIjogMFxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XCJ0b29sdGlwXCI6IHtcblx0XHRcdFx0XHRcdFx0XCJkdXJhdGlvblwiOiAwLFxuXHRcdFx0XHRcdFx0XHRcImdyYXZpdHlcIjogXCJ3XCIsXG5cdFx0XHRcdFx0XHRcdFwiZGlzdGFuY2VcIjogMjUsXG5cdFx0XHRcdFx0XHRcdFwic25hcERpc3RhbmNlXCI6IDAsXG5cdFx0XHRcdFx0XHRcdFwiY2xhc3Nlc1wiOiBudWxsLFxuXHRcdFx0XHRcdFx0XHRcImNoYXJ0Q29udGFpbmVyXCI6IG51bGwsXG5cdFx0XHRcdFx0XHRcdFwiZml4ZWRUb3BcIjogbnVsbCxcblx0XHRcdFx0XHRcdFx0XCJlbmFibGVkXCI6IHRydWUsXG5cdFx0XHRcdFx0XHRcdFwiaGlkZURlbGF5XCI6IDQwMCxcblx0XHRcdFx0XHRcdFx0XCJoZWFkZXJFbmFibGVkXCI6IGZhbHNlLFxuXG5cdFx0XHRcdFx0XHRcdFwib2Zmc2V0XCI6IHtcblx0XHRcdFx0XHRcdFx0XHRcImxlZnRcIjogMCxcblx0XHRcdFx0XHRcdFx0XHRcInRvcFwiOiAwXG5cdFx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRcdFwiaGlkZGVuXCI6IHRydWUsXG5cdFx0XHRcdFx0XHRcdFwiZGF0YVwiOiBudWxsLFxuXHRcdFx0XHRcdFx0XHRcInRvb2x0aXBFbGVtXCI6IG51bGwsXG5cdFx0XHRcdFx0XHRcdFwiaWRcIjogXCJudnRvb2x0aXAtOTkzNDdcIlxuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sXG5cdFx0XHRcdGRhdGE6IFtdXG5cdFx0XHR9O1xuXHRcdFx0cmV0dXJuICRzY29wZS5jaGFydDtcblx0XHR9XG5cdFx0dmFyIGJ1aWxkVHJlZSA9IGZ1bmN0aW9uIChkYXRhKSB7XG5cdFx0XHR2YXIgY2hpbGRyZW4gPSBbXTtcblx0XHRcdGFuZ3VsYXIuZm9yRWFjaChkYXRhLCBmdW5jdGlvbiAoaXRlbSkge1xuXHRcdFx0XHR2YXIgY2hpbGQgPSB7XG5cdFx0XHRcdFx0J25hbWUnOiBpdGVtLnRpdGxlLFxuXHRcdFx0XHRcdCdzaXplJzogaXRlbS5zaXplLFxuXHRcdFx0XHRcdCdjb2xvcic6IGl0ZW0uY29sb3IsXG5cdFx0XHRcdFx0J2NoaWxkcmVuJzogYnVpbGRUcmVlKGl0ZW0uY2hpbGRyZW4pXG5cdFx0XHRcdH07XG5cdFx0XHRcdGlmKGl0ZW0uY29sb3Ipe1xuXHRcdFx0XHRcdGNoaWxkLmNvbG9yID0gaXRlbS5jb2xvclxuXHRcdFx0XHR9XG5cdFx0XHRcdGlmKGl0ZW0uc2l6ZSl7XG5cdFx0XHRcdFx0Y2hpbGQuc2l6ZSA9IGl0ZW0uc2l6ZVxuXHRcdFx0XHR9XG5cdFx0XHRcdGNoaWxkcmVuLnB1c2goY2hpbGQpO1xuXHRcdFx0fSk7XG5cdFx0XHRyZXR1cm4gY2hpbGRyZW47XG5cdFx0fTtcblx0XHQkc2NvcGUuY2FsY3VsYXRlR3JhcGggPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHR2YXIgY2hhcnREYXRhID0ge1xuXHRcdFx0XHRcIm5hbWVcIjogJHNjb3BlLmRhdGEudGl0bGUsXG5cdFx0XHRcdFwiY29sb3JcIjogJHNjb3BlLmRhdGEuY29sb3IsXG5cdFx0XHRcdFwiY2hpbGRyZW5cIjogYnVpbGRUcmVlKCRzY29wZS5kYXRhLmNoaWxkcmVuKSxcblx0XHRcdFx0XCJzaXplXCI6IDFcblx0XHRcdH07XG5cdFx0XHQkc2NvcGUuY2hhcnQuZGF0YSA9IGNoYXJ0RGF0YTtcblx0XHRcdHJldHVybiBjaGFydERhdGE7XG5cdFx0fTtcblx0XHQkc2NvcGUuJHdhdGNoKCdkYXRhJywgZnVuY3Rpb24gKG4sIG8pIHtcblx0XHRcdGlmICghbikge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0XHQkc2NvcGUuY2FsY3VsYXRlR3JhcGgoKTtcblx0XHR9KVxuXHR9KTtcblxufSkoKTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
