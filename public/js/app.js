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
		angular.module('app.controllers', ['toastr','ui.router', 'md.data.table', 'ngMaterial', 'ngStorage', 'restangular', 'ngMdIcons', 'angular-loading-bar', 'ngMessages', 'ngSanitize', "leaflet-directive",'nvd3']);
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

		$urlRouterProvider.otherwise('/index/epi');

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
								return {
									dataObject: d.$object,
									indexerObject: i.$object,
									data: d,
									indexer: i
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
		.setDefaultHeaders({ accept: "application/x.laravel.v1+json" });
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
					vm.data = data;
					vm.structure = structure.data;
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
						console.log(vm.compare.countries);
						countries.push(vm.current[vm.structure.iso]);
						DataService.getOne('nations/bbox', countries).then(function (data) {
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
					vm.mvtSource.layers.countries_big_geom.features[vm.current[vm.structure.iso]].selected = true;
				})
			}
		};
		function calcRank() {
			if(!vm.current){
				return;
			}
			var rank = 0;
			angular.forEach(vm.data, function(item) {
				item[vm.structure.score_field_name] = parseFloat(item[vm.structure.score_field_name]);
				item['score'] = parseFloat(item['score']);
			})
			var filter = $filter('orderBy')(vm.data, [vm.structure.score_field_name, "score"], true);
			rank = filter.indexOf(vm.current) + 1;
			vm.current[vm.structure.score_field_name+'_rank'] = rank;
			vm.circleOptions = {
					color:vm.structure.color,
					field:vm.structure.score_field_name+'_rank'
			};
		}
		function getRank(country){
			var filter = $filter('orderBy')(vm.data, [vm.structure.score_field_name, "score"], true);
			var rank = filter.indexOf(country) + 1;
			return rank;
		}
		function toggleInfo() {
			vm.info = !vm.info;
		};

		function toggleDetails() {
			return vm.details = !vm.details;
		};
		function fetchNationData(iso){
			DataService.getOne('nations', iso).then(function (data) {
				vm.current.data = data.data;
				mapGotoCountry(iso);
			});
		}
		function mapGotoCountry(iso) {
			if(!$state.params.countries){
				DataService.getOne('nations/bbox', [iso]).then(function (data) {
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
				vm.mvtSource.layers.countries_big_geom.features[vm.current[vm.structure.iso]].selected = true;
				vm.mvtSource.options.mutexToggle = true;
				vm.mvtSource.setStyle(countriesStyle);
				DataService.getOne('nations/bbox', [vm.current[vm.structure.iso]]).then(function (data) {
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
				if(item[vm.structure.iso] != vm.current[vm.structure.iso]){
					compare.push(item[vm.structure.iso]);
				}
			});
			if (isos.length > 1) {
				DataService.getOne('nations/bbox', isos).then(function (data) {
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
				if (nat[vm.structure.iso] == iso) {
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
			gradient.addColorStop(0.53, vm.structure.color || 'rgba(128, 243, 198,1)');
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
			var field = vm.structure.score_field_name || 'score';

			console.log(vm.structure.score_field_name);
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
			var field = vm.structure.score_field_name || 'score';
			var type = feature.type;
			if(iso != vm.current[vm.structure.iso]){
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
			if(n[vm.structure.iso]) {
				if(o[vm.structure.iso]){
					vm.mvtSource.layers.countries_big_geom.features[o[vm.structure.iso]].selected = false;
				}
				calcRank();
				fetchNationData(n[vm.structure.iso]);
				vm.mvtSource.layers.countries_big_geom.features[n[vm.structure.iso]].selected = true;
				if($state.current.name == 'app.index.show.selected' || $state.current.name == 'app.index.show'){
					$state.go('app.index.show.selected', {
						index: $state.params.index,
						item: n[vm.structure.iso]
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

			if (vm.current[vm.structure.iso]) {
				if($state.params.countries){
					$state.go('app.index.show.selected.compare', {
						index: n.name,
						item: vm.current[vm.structure.iso],
						countries: $state.params.countries
					})
				}
				else{
					$state.go('app.index.show.selected', {
						index: n.name,
						item: vm.current[vm.structure.iso]
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
						vm.mvtSource.layers.countries_big_geom.features[vm.current[vm.structure.iso]].selected = true;
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
						if (typeof c[vm.structure.score_field_name] != "undefined") {
							vm.current = getNationByIso(evt.feature.properties.adm0_a3);
						} else {
							ToastService.error('No info about this location!');
						}
					} else {
						var c = getNationByIso(evt.feature.properties.adm0_a3);
						if (typeof c[vm.structure.score_field_name] != "undefined") {
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

    angular.module('app.controllers').controller('IndexcreatorCtrl', ["$scope", "$rootScope", "DialogService", "DataService", "$timeout", "$state", "$filter", "leafletData", "toastr", "VectorlayerService", function($scope,$rootScope,DialogService,DataService, $timeout,$state, $filter, leafletData, toastr, VectorlayerService){
        //
        var vm = this;
        vm.map = null;
        vm.data = [];
        vm.toSelect = [];
        vm.selected = [];
        vm.selectedRows = [];
        vm.iso_errors = 0;
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
                if(item == "NA" || item < 0 || item.indexOf('#N/A') > -1){
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
          vm.toSelect = [];
          vm.notFound = [];
          var entries = [];
          angular.forEach(vm.data, function(item, key){
            entries.push({
              iso: item.data[0][vm.meta.iso_field],
              name: item.data[0][vm.meta.country_field]
            });

          /*  if(!item.data[0][vm.meta.iso_field]){
                DataService.getOne('/nations/byName/'+item.data[0]['country']).then(function(response){
                  var data = response.data;
                  if(data.length == 1){
                    item.data[0][vm.meta.iso_field] = data[0].iso;
                    vm.iso_errors --;
                    vm.errors --;
                    item.errors.splice(0,1);
                  }
                  else if(data.length > 1){
                    var toSelect = {
                      entry: item,
                      options: data
                    };
                    vm.toSelect.push(toSelect);
                  }
                  else{
                    vm.notFound.push(item);
                  }
                })
          //  }*/
          });
          DataService.post('/nations/byIsoNames', {data:entries}).then(function(response){
              angular.forEach(response.data, function(country, key){
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
                    }
                });
              });
              if(vm.toSelect.length){
                DialogService.fromTemplate('selectisofetchers', $scope);
              }
          })
          //if(vm.toSelect.length){
            //DialogService.fromTemplate('selectisofetchers', $scope);
        //  }

        }


        function saveData(){
          console.log(vm.meta);
          console.log(vm.data);
          var insertData = {data:[]};
          var meta = [], fields = [];
          angular.forEach(vm.data, function(item, key){
            if(item.errors.length == 0){
              item.data[0].year = vm.meta.year;
              insertData.data.push(item.data[0]);
            }
          });
          angular.forEach(vm.data[0].data[0], function(item, key){
            console.log(vm.meta.table[key], key);
            if(vm.meta.table[key]){
              var field = {
                'column': key,
                'title':vm.meta.table[key].title,
                'description':vm.meta.table[key].description
              };
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
              DataService.post('data/tables/'+response.data.table_name+'/insert', insertData).then(function(res){
                if(res.data == true){
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

        function listResources(){
          DataService.getAll('data/tables').then(function(response){
            vm.resources = response;
            vm.showResources = true;
          })
        }
        $scope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {
          switch (toState.name) {

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
              case 'app.index.create.check':
                  vm.step = 1;
                  vm.showUploadContainer = false;
                break;
              case 'app.index.create.meta':
                  vm.step = 2;
                  break;
              case 'app.index.create.final':
                  vm.step = 3;
                  break;
              default:

            }
          }
        });
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
					return parseInt(d.value);
				});
				//options.height = options.width * 1.1;
				options.radius_scale = d3.scale.pow().exponent(0.5).domain([0, max_amount]).range([2, 85]);
				options.center = {
					x: options.width / 2,
					y: options.height / 2
				};
				options.cat_centers = {
					"eh": {
						x: options.width / 2,
						y: options.height  * 0.45,
						damper: 0.085
					},
					"ev": {
						x: options.width / 2,
						y: options.height  * 0.55,
						damper: 0.085
					}
				};

				var create_nodes = function () {
					if(scope.indexer.children.length == 2 && scope.indexer.children[0].children.length > 0){
						angular.forEach(scope.indexer.children, function (group) {
							var d = {
								type: group.column_name,
								name: group.title,
								group: group.column_name.substring(0,2),
								color: group.color,
								icon: group.icon,
								unicode: IconsService.getUnicode(group.icon),
								data: group,
								children:group.children
							};
							labels.push(d);

							angular.forEach(group.children, function (item) {
								//console.log(scope.chartdata[item.column_name], scope.chartdata[item.column_name] / scope.sizefactor);
								if (scope.chartdata[item.column_name]) {
									var node = {
										type: item.column_name,
										radius: scope.chartdata[item.column_name] / scope.sizefactor,
										value: scope.chartdata[item.column_name] / scope.sizefactor,
										name: item.title,
										group: item.column_name.substring(0,2),
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
							type: scope.indexer.column_name,
							name: scope.indexer.title,
							group: scope.indexer.column_name.substring(0,2),
							color: scope.indexer.color,
							icon: scope.indexer.icon,
							unicode: scope.indexer.unicode,
							data: scope.indexer.data,
							children: scope.indexer.children
						};
						labels.push(d);
						angular.forEach(scope.indexer.children, function (item) {
							//console.log(scope.chartdata[item.column_name], scope.chartdata[item.column_name] / scope.sizefactor);
							if (scope.chartdata[item.column_name]) {
								var node = {
									type: item.column_name,
									radius: scope.chartdata[item.column_name] / scope.sizefactor,
									value: scope.chartdata[item.column_name] / scope.sizefactor,
									name: item.title,
									group: item.column_name.substring(0,2),
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
					//d3.selectAll("svg > *").remove();
					nodes = [];
					labels = [];
				}
				var create_groups = function(){
					groups = {};
					var count = 0;
					angular.forEach(nodes, function(node){
							var exists = false;
							var group = {};
							angular.forEach(groups, function(group, index){
								if(node.group == index){
									exists = true;
								}
							});
							if(!exists){
								count++;
								groups[node.group] = {
									x: options.width / 2,
									y: options.height / 2 + (1 - count),
									damper: 0.085,
								};
							}
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
								.attr("fill", "#be5f00")
								.attr("id", "arcTop")
								.attr("transform", "translate("+(options.width/2)+","+(options.height/2 - options.height/12)+")");
							options.arcBottom = options.vis.append("path")
								.attr("d", arcBottom)
								.attr("id", "arcBottom")
								.attr("fill", "#006bb6")
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
								console.log('all');
						}
						else{
								display_by_cat();
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

(function() {
	"use strict";

	angular.module('app.directives').directive('circlegraph', ["$timeout", function($timeout) {
		var defaults = function() {
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
			link: function($scope, element, $attrs, ngModel) {
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
					.innerRadius(function(d) {
						return $scope.options.width / 2 - 4;
					})
					.outerRadius(function(d) {
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
					.text(function(d) {
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
					text.transition().duration(750).tween('text', function(d) {
						var data = this.textContent.split('N°');
						var i = d3.interpolate(parseInt(data[1]), radius);
						return function(t) {
							this.textContent =  'N°' + (Math.round(i(t) * 1) / 1);
						};
					})
				}

				//Tween animation for the Arc
				function arcTween(transition, newAngle) {

					transition.attrTween("d", function(d) {
						var interpolate = d3.interpolate(d.endAngle, newAngle);
						return function(t) {
							d.endAngle = interpolate(t);
							return arc(d);
						};
					});
				}
				$scope.$watch('options',function(n, o){
						if(n === o){
							return;
						}
						circleBack.style('stroke', n.color);
						circleGraph.style('fill', n.color);
						text.style('fill', n.color);
						$timeout(function(){
							animateIt(ngModel.$modelValue[n.field])
						});
				});
				//Watching if selection has changed from another UI element
				$scope.$watch(
					function() {
						return ngModel.$modelValue;
					},
					function(n, o) {
					
						if (!n){
							n = {};
							n[$scope.options.field] = $scope.options.size;
						}
						$timeout(function(){
							animateIt(n[$scope.options.field])
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
					input.css({ display:'none' });
					button.bind('click', function() {
							input[0].click();
					});
					input.bind('change',function(e){
							$timeout(function(){
								Papa.parse(input[0].files[0],{
									skipEmptyLines: true,
									header:true,
									dynamicTyping: true,
									step:function(row){
										angular.forEach(row.data[0], function(item){
											if(isNaN(item) || item < 0 ){
												if(item == "NA" || item < 0 || item.indexOf('#N/A') > -1){
													row.errors.push({
														type:"1",
														message:"Field in row is not valid for database use!",
														column: item
													})
													errors++;
												}
											}
										});
										$scope.vm.data.push(row);
									},
									beforeFirstChunk: function(chunk)
									{
										//Check if there are points in the headers
										var index = chunk.match( /\r\n|\r|\n/ ).index;
								    var headings = chunk.substr(0, index).split( ',' );
										for(var i = 0; i <= headings.length; i++){
											if(headings[i]){
												headings[i] = headings[i].replace(/[^a-z0-9]/gi,'_').toLowerCase();
												if(headings[i].indexOf('.') > -1){
													headings[i] = headings[i].substr(0, headings[i].indexOf('.'));
												}
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
										angular.forEach($scope.vm.data[0].data[0], function(item, key){
											if(key.toLowerCase().indexOf('iso') != -1){
												$scope.vm.meta.iso_field = key;
											}
												if(key.toLowerCase().indexOf('country') != -1){
													$scope.vm.meta.country_field = key;
												}
										});
										$state.go('app.index.create.check');
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiLCJyb3V0ZXMuanMiLCJyb3V0ZXMucnVuLmpzIiwiY29uZmlnL2F1dGguanMiLCJjb25maWcvbG9hZGluZ19iYXIuanMiLCJjb25maWcvcmVzdGFuZ3VsYXIuanMiLCJjb25maWcvdGhlbWUuanMiLCJjb25maWcvdG9hc3RyLmpzIiwiZmlsdGVycy9hbHBoYW51bS5qcyIsImZpbHRlcnMvY2FwaXRhbGl6ZS5qcyIsImZpbHRlcnMvaHVtYW5fcmVhZGFibGUuanMiLCJmaWx0ZXJzL3RydW5jYXRlX2NoYXJhY3RlcnMuanMiLCJmaWx0ZXJzL3RydW5jYXRlX3dvcmRzLmpzIiwiZmlsdGVycy90cnVzdF9odG1sLmpzIiwiZmlsdGVycy91Y2ZpcnN0LmpzIiwic2VydmljZXMvZGF0YS5qcyIsInNlcnZpY2VzL2RpYWxvZy5qcyIsInNlcnZpY2VzL2ljb25zLmpzIiwic2VydmljZXMvdG9hc3QuanMiLCJzZXJ2aWNlcy92ZWN0b3JsYXllci5qcyIsImFwcC9oZWFkZXIvaGVhZGVyLmpzIiwiYXBwL2ltcG9ydGNzdi9pbXBvcnRjc3YuanMiLCJhcHAvaW5kZXgvaW5kZXguanMiLCJhcHAvaW5kZXgvaW5kZXhiYXNlLmpzIiwiYXBwL2luZGV4Y3JlYXRvci9pbmRleGNyZWF0b3IuanMiLCJhcHAvbG9naW4vbG9naW4uanMiLCJhcHAvbWFwL21hcC5qcyIsImFwcC9zZWxlY3RlZC9zZWxlY3RlZC5qcyIsImFwcC9zaWRlYmFyL3NpZGViYXIuanMiLCJhcHAvc2lnbnVwL3NpZ251cC5qcyIsImFwcC90b2FzdHMvdG9hc3RzLmpzIiwiYXBwL3Vuc3VwcG9ydGVkX2Jyb3dzZXIvdW5zdXBwb3J0ZWRfYnJvd3Nlci5qcyIsImFwcC91c2VyL3VzZXIuanMiLCJkaWFsb2dzL2FkZF91c2Vycy9hZGRfdXNlcnMuanMiLCJkaWFsb2dzL2VkaXRjb2x1bW4vZWRpdGNvbHVtbi5qcyIsImRpYWxvZ3MvZWRpdHJvdy9lZGl0cm93LmpzIiwiZGlhbG9ncy9sb29zZWRhdGEvbG9vc2VkYXRhLmpzIiwiZGlhbG9ncy9zZWxlY3Rpc29mZXRjaGVycy9zZWxlY3Rpc29mZXRjaGVycy5qcyIsImRpcmVjdGl2ZXMvYnViYmxlcy9idWJibGVzLmpzIiwiZGlyZWN0aXZlcy9idWJibGVzL2RlZmluaXRpb24uanMiLCJkaXJlY3RpdmVzL2NpcmNsZWdyYXBoL2NpcmNsZWdyYXBoLmpzIiwiZGlyZWN0aXZlcy9jaXJjbGVncmFwaC9kZWZpbml0aW9uLmpzIiwiZGlyZWN0aXZlcy9oaXN0b3J5L2RlZmluaXRpb24uanMiLCJkaXJlY3RpdmVzL2hpc3RvcnkvaGlzdG9yeS5qcyIsImRpcmVjdGl2ZXMvbWVkaWFuL2RlZmluaXRpb24uanMiLCJkaXJlY3RpdmVzL21lZGlhbi9tZWRpYW4uanMiLCJkaXJlY3RpdmVzL3BhcnNlY3N2L2RlZmluaXRpb24uanMiLCJkaXJlY3RpdmVzL3BhcnNlY3N2L3BhcnNlY3N2LmpzIiwiZGlyZWN0aXZlcy9zaW1wbGVsaW5lY2hhcnQvZGVmaW5pdGlvbi5qcyIsImRpcmVjdGl2ZXMvc2ltcGxlbGluZWNoYXJ0L3NpbXBsZWxpbmVjaGFydC5qcyIsImRpcmVjdGl2ZXMvc2xpZGVUb2dnbGUvZGVmaW5pdGlvbi5qcyIsImRpcmVjdGl2ZXMvc2xpZGVUb2dnbGUvc2xpZGVUb2dnbGUuanMiLCJkaXJlY3RpdmVzL3N1YmluZGV4L2RlZmluaXRpb24uanMiLCJkaXJlY3RpdmVzL3N1YmluZGV4L3N1YmluZGV4LmpzIiwiZGlyZWN0aXZlcy9zdW5idXJzdC9kZWZpbml0aW9uLmpzIiwiZGlyZWN0aXZlcy9zdW5idXJzdC9zdW5idXJzdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxJQUFBLE1BQUEsUUFBQSxPQUFBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7Ozs7RUFJQSxRQUFBLE9BQUEsY0FBQSxDQUFBLGFBQUEsYUFBQTtFQUNBLFFBQUEsT0FBQSxtQkFBQSxDQUFBLFNBQUEsYUFBQSxpQkFBQSxjQUFBLGFBQUEsZUFBQSxhQUFBLHVCQUFBLGNBQUEsY0FBQSxvQkFBQTtFQUNBLFFBQUEsT0FBQSxlQUFBO0VBQ0EsUUFBQSxPQUFBLGdCQUFBLENBQUEsYUFBQSxhQUFBLGVBQUE7RUFDQSxRQUFBLE9BQUEsa0JBQUEsQ0FBQSxhQUFBO0VBQ0EsUUFBQSxPQUFBLGNBQUE7Ozs7QUNuQkEsQ0FBQSxZQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGNBQUEsZ0RBQUEsVUFBQSxnQkFBQSxvQkFBQTs7RUFFQSxJQUFBLFVBQUEsVUFBQSxVQUFBO0dBQ0EsT0FBQSxnQkFBQSxXQUFBLE1BQUEsV0FBQTs7O0VBR0EsbUJBQUEsVUFBQTs7RUFFQTtJQUNBLE1BQUEsT0FBQTtJQUNBLFVBQUE7SUFDQSxPQUFBO0tBQ0EsUUFBQTtNQUNBLGFBQUEsUUFBQTtNQUNBLFlBQUE7TUFDQSxjQUFBOztLQUVBLE1BQUE7S0FDQSxRQUFBO01BQ0EsYUFBQSxRQUFBO01BQ0EsWUFBQTtNQUNBLGNBQUE7Ozs7SUFJQSxNQUFBLFlBQUE7SUFDQSxLQUFBO0lBQ0EsVUFBQTs7O0lBR0EsTUFBQSxrQkFBQTtJQUNBLEtBQUE7SUFDQSxPQUFBO0tBQ0EsU0FBQTtNQUNBLGFBQUEsUUFBQTtNQUNBLFlBQUE7TUFDQSxjQUFBOzs7Ozs7SUFNQSxNQUFBLG9CQUFBO0lBQ0EsS0FBQTtJQUNBLE9BQUE7S0FDQSxTQUFBO01BQ0EsYUFBQSxRQUFBO01BQ0EsWUFBQTtNQUNBLGNBQUE7TUFDQSxTQUFBO09BQ0Esa0NBQUEsVUFBQSxhQUFBLE9BQUE7UUFDQSxPQUFBLFlBQUEsT0FBQSxNQUFBOzs7Ozs7O0lBT0EsTUFBQSxhQUFBO0lBQ0EsVUFBQTtJQUNBLEtBQUE7SUFDQSxPQUFBO0tBQ0EsU0FBQTtNQUNBLGFBQUEsUUFBQTtNQUNBLFlBQUE7TUFDQSxjQUFBOzs7O0lBSUEsTUFBQSxvQkFBQTtJQUNBLEtBQUE7SUFDQSxPQUFBO0tBQ0EsUUFBQTs7O0tBR0EsUUFBQTtNQUNBLGFBQUEsUUFBQTtNQUNBLFlBQUE7TUFDQSxjQUFBOzs7O0lBSUEsTUFBQSwwQkFBQTtJQUNBLEtBQUE7O0lBRUEsTUFBQSx5QkFBQTtJQUNBLEtBQUE7O0lBRUEsTUFBQSwwQkFBQTtJQUNBLEtBQUE7O0lBRUEsTUFBQSxrQkFBQTtJQUNBLEtBQUE7SUFDQSxPQUFBO0tBQ0EsUUFBQTtNQUNBLGFBQUE7TUFDQSxZQUFBO01BQ0EsY0FBQTtNQUNBLFNBQUE7T0FDQSw2Q0FBQSxVQUFBLGFBQUEsY0FBQTtRQUNBLElBQUEsSUFBQSxZQUFBLE9BQUEsV0FBQSxhQUFBLFFBQUE7UUFDQSxJQUFBLElBQUEsWUFBQSxPQUFBLFdBQUEsYUFBQSxRQUFBO1FBQ0EsT0FBQTtTQUNBLFlBQUEsRUFBQTtTQUNBLGVBQUEsRUFBQTtTQUNBLE1BQUE7U0FDQSxTQUFBOzs7OztLQUtBLFlBQUE7TUFDQSxhQUFBOzs7O0lBSUEsTUFBQSwyQkFBQTtJQUNBLEtBQUE7Ozs7Ozs7Ozs7Ozs7O0lBY0EsTUFBQSxtQ0FBQTtJQUNBLEtBQUE7O0lBRUEsTUFBQSxpQkFBQTtJQUNBLEtBQUE7SUFDQSxNQUFBO0tBQ0EsVUFBQTs7SUFFQSxPQUFBO0tBQ0EsU0FBQTtNQUNBLGFBQUEsUUFBQTs7S0FFQSxPQUFBOzs7Ozs7Ozs7QUNsSkEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGNBQUEsaUNBQUEsU0FBQSxZQUFBLFdBQUE7RUFDQSxXQUFBLElBQUEscUJBQUEsU0FBQSxPQUFBLFFBQUE7O0dBRUEsSUFBQSxRQUFBLFFBQUEsUUFBQSxLQUFBLFNBQUE7SUFDQSxXQUFBLGVBQUEsUUFBQSxLQUFBOztJQUVBLFdBQUEsaUJBQUE7O0VBRUEsV0FBQSxJQUFBLHNCQUFBLFNBQUEsT0FBQSxRQUFBOzs7O0VBSUEsV0FBQSxJQUFBLHVCQUFBLFNBQUEsT0FBQSxRQUFBO0dBQ0EsV0FBQSxpQkFBQTs7Ozs7O0FDaEJBLENBQUEsV0FBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxjQUFBLHlCQUFBLFVBQUEsY0FBQTs7O1FBR0EsY0FBQSxXQUFBOzs7OztBQ05BLENBQUEsV0FBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxjQUFBLGlDQUFBLFVBQUEsc0JBQUE7RUFDQSxzQkFBQSxpQkFBQTs7Ozs7QUNKQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsY0FBQSxnQ0FBQSxTQUFBLHFCQUFBO0VBQ0E7R0FDQSxXQUFBO0dBQ0Esa0JBQUEsRUFBQSxRQUFBOzs7OztBQ05BLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxjQUFBLDhCQUFBLFNBQUEsb0JBQUE7O0NBRUEsSUFBQSxjQUFBLG1CQUFBLGNBQUEsUUFBQTtJQUNBLE9BQUE7RUFDQSxRQUFBOztDQUVBLElBQUEsV0FBQSxtQkFBQSxjQUFBLFFBQUE7SUFDQSxPQUFBO0VBQ0EsUUFBQTs7Q0FFQSxJQUFBLFVBQUEsbUJBQUEsY0FBQSxRQUFBO0lBQ0EsT0FBQTtFQUNBLFFBQUE7O0NBRUEsbUJBQUEsY0FBQSxZQUFBO0NBQ0EsbUJBQUEsY0FBQSxhQUFBO0NBQ0EsbUJBQUEsY0FBQSxTQUFBO0VBQ0EsbUJBQUEsTUFBQTtHQUNBLGVBQUE7R0FDQSxjQUFBOzs7OztBQ3RCQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsY0FBQSx3QkFBQSxTQUFBLGFBQUE7O1FBRUEsUUFBQSxPQUFBLGNBQUE7VUFDQSxhQUFBO1VBQ0EsYUFBQTtVQUNBLFdBQUE7VUFDQSxhQUFBO1VBQ0EsZUFBQTtVQUNBLG1CQUFBO1VBQ0EsdUJBQUE7VUFDQSxRQUFBO1VBQ0EsYUFBQTs7Ozs7O0FDZEEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLGVBQUEsUUFBQSxZQUFBLFVBQUE7UUFDQSxPQUFBLFVBQUEsT0FBQTs7WUFFQSxLQUFBLENBQUEsT0FBQTtjQUNBLE9BQUE7O1lBRUEsT0FBQSxNQUFBLFFBQUEsZUFBQTs7Ozs7OztBQ1RBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxlQUFBLFFBQUEsY0FBQSxVQUFBO0VBQ0EsT0FBQSxTQUFBLE9BQUEsS0FBQTtHQUNBLE9BQUEsQ0FBQSxDQUFBLENBQUEsU0FBQSxNQUFBLFFBQUEsc0JBQUEsU0FBQSxJQUFBO0lBQ0EsT0FBQSxJQUFBLE9BQUEsR0FBQSxnQkFBQSxJQUFBLE9BQUEsR0FBQTtRQUNBOzs7OztBQ1BBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxlQUFBLFFBQUEsaUJBQUEsVUFBQTtFQUNBLE9BQUEsU0FBQSxTQUFBLEtBQUE7R0FDQSxLQUFBLENBQUEsS0FBQTtJQUNBLE9BQUE7O0dBRUEsSUFBQSxRQUFBLElBQUEsTUFBQTtHQUNBLEtBQUEsSUFBQSxFQUFBLEdBQUEsRUFBQSxNQUFBLFFBQUEsS0FBQTtJQUNBLE1BQUEsS0FBQSxNQUFBLEdBQUEsT0FBQSxHQUFBLGdCQUFBLE1BQUEsR0FBQSxNQUFBOztHQUVBLE9BQUEsTUFBQSxLQUFBOzs7O0FDWkEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLGVBQUEsT0FBQSxzQkFBQSxZQUFBO1FBQ0EsT0FBQSxVQUFBLE9BQUEsT0FBQSxhQUFBO1lBQ0EsSUFBQSxNQUFBLFFBQUE7Z0JBQ0EsT0FBQTs7WUFFQSxJQUFBLFNBQUEsR0FBQTtnQkFDQSxPQUFBOztZQUVBLElBQUEsU0FBQSxNQUFBLFNBQUEsT0FBQTtnQkFDQSxRQUFBLE1BQUEsVUFBQSxHQUFBOztnQkFFQSxJQUFBLENBQUEsYUFBQTtvQkFDQSxJQUFBLFlBQUEsTUFBQSxZQUFBOztvQkFFQSxJQUFBLGNBQUEsQ0FBQSxHQUFBO3dCQUNBLFFBQUEsTUFBQSxPQUFBLEdBQUE7O3VCQUVBO29CQUNBLE9BQUEsTUFBQSxPQUFBLE1BQUEsT0FBQSxPQUFBLEtBQUE7d0JBQ0EsUUFBQSxNQUFBLE9BQUEsR0FBQSxNQUFBLFNBQUE7OztnQkFHQSxPQUFBLFFBQUE7O1lBRUEsT0FBQTs7OztBQzNCQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsZUFBQSxPQUFBLGlCQUFBLFlBQUE7UUFDQSxPQUFBLFVBQUEsT0FBQSxPQUFBO1lBQ0EsSUFBQSxNQUFBLFFBQUE7Z0JBQ0EsT0FBQTs7WUFFQSxJQUFBLFNBQUEsR0FBQTtnQkFDQSxPQUFBOztZQUVBLElBQUEsT0FBQTtnQkFDQSxJQUFBLGFBQUEsTUFBQSxNQUFBO2dCQUNBLElBQUEsV0FBQSxTQUFBLE9BQUE7b0JBQ0EsUUFBQSxXQUFBLE1BQUEsR0FBQSxPQUFBLEtBQUEsT0FBQTs7O1lBR0EsT0FBQTs7OztBQ2pCQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsZUFBQSxRQUFBLHNCQUFBLFVBQUEsTUFBQTtFQUNBLE9BQUEsVUFBQSxNQUFBO0dBQ0EsT0FBQSxLQUFBLFlBQUE7Ozs7QUNMQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsZUFBQSxPQUFBLFdBQUEsV0FBQTtFQUNBLE9BQUEsVUFBQSxRQUFBO0dBQ0EsS0FBQSxDQUFBLE9BQUE7SUFDQSxPQUFBOztHQUVBLE9BQUEsTUFBQSxVQUFBLEdBQUEsR0FBQSxnQkFBQSxNQUFBLFVBQUE7Ozs7OztBQ1JBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxnQkFBQSxRQUFBLGVBQUE7SUFDQSxZQUFBLFVBQUEsQ0FBQSxjQUFBOztJQUVBLFNBQUEsWUFBQSxhQUFBLE9BQUE7UUFDQSxPQUFBO1VBQ0EsUUFBQTtVQUNBLFFBQUE7VUFDQSxNQUFBOzs7UUFHQSxTQUFBLE9BQUEsTUFBQTtVQUNBLElBQUEsT0FBQSxZQUFBLElBQUEsT0FBQTtZQUNBLEtBQUEsS0FBQSxVQUFBLElBQUEsU0FBQSxLQUFBO2NBQ0EsT0FBQSxNQUFBLEtBQUEsWUFBQTtjQUNBLFFBQUEsSUFBQTs7WUFFQSxPQUFBOztRQUVBLFNBQUEsT0FBQSxPQUFBLEdBQUE7VUFDQSxPQUFBLFlBQUEsSUFBQSxPQUFBLElBQUE7O1FBRUEsU0FBQSxLQUFBLE9BQUEsS0FBQTtVQUNBLE9BQUEsWUFBQSxJQUFBLE9BQUEsS0FBQTs7Ozs7O0FDekJBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxnQkFBQSxRQUFBLCtCQUFBLFNBQUEsVUFBQTs7RUFFQSxPQUFBO0dBQ0EsY0FBQSxTQUFBLFVBQUEsT0FBQTs7SUFFQSxJQUFBLFVBQUE7S0FDQSxhQUFBLHFCQUFBLFdBQUEsTUFBQSxXQUFBOzs7SUFHQSxJQUFBLE9BQUE7S0FDQSxRQUFBLFFBQUEsT0FBQTs7O0lBR0EsT0FBQSxVQUFBLEtBQUE7OztHQUdBLE1BQUEsVUFBQTtJQUNBLE9BQUEsVUFBQTs7O0dBR0EsT0FBQSxTQUFBLE9BQUEsUUFBQTtJQUNBLFVBQUE7S0FDQSxVQUFBO09BQ0EsTUFBQTtPQUNBLFFBQUE7T0FDQSxHQUFBOzs7O0dBSUEsU0FBQSxTQUFBLE9BQUEsU0FBQTtJQUNBLE9BQUEsVUFBQTtLQUNBLFVBQUE7T0FDQSxNQUFBO09BQ0EsUUFBQTtPQUNBLEdBQUE7T0FDQSxPQUFBOzs7Ozs7QUN0Q0EsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLGdCQUFBLFFBQUEsZ0JBQUEsVUFBQTtRQUNBLElBQUEsV0FBQTtVQUNBLFNBQUE7VUFDQSxTQUFBO1VBQ0EsVUFBQTtVQUNBLGFBQUE7VUFDQSxTQUFBO1VBQ0EsUUFBQTtVQUNBLE9BQUE7VUFDQSxVQUFBO1VBQ0EsT0FBQTtVQUNBLFFBQUE7O1FBRUEsT0FBQTtVQUNBLFlBQUEsU0FBQSxLQUFBO1lBQ0EsT0FBQSxTQUFBOzs7Ozs7O0FDbEJBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxnQkFBQSxRQUFBLDZCQUFBLFNBQUEsU0FBQTs7RUFFQSxJQUFBLFFBQUE7R0FDQSxXQUFBO0dBQ0EsU0FBQTs7RUFFQSxPQUFBO0dBQ0EsTUFBQSxTQUFBLFFBQUE7SUFDQSxJQUFBLENBQUEsUUFBQTtLQUNBLE9BQUE7OztJQUdBLE9BQUEsU0FBQTtLQUNBLFNBQUE7T0FDQSxRQUFBO09BQ0EsU0FBQTtPQUNBLE9BQUE7T0FDQSxVQUFBOzs7R0FHQSxPQUFBLFNBQUEsUUFBQTtJQUNBLElBQUEsQ0FBQSxRQUFBO0tBQ0EsT0FBQTs7O0lBR0EsT0FBQSxTQUFBO0tBQ0EsU0FBQTtPQUNBLFFBQUE7T0FDQSxTQUFBO09BQ0EsTUFBQTtPQUNBLE9BQUE7T0FDQSxVQUFBOzs7Ozs7QUNsQ0EsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLGdCQUFBLFFBQUEsc0JBQUEsVUFBQTs7UUFFQSxNQUFBO1VBQ0EsS0FBQTtZQUNBLE9BQUE7O1VBRUEsVUFBQSxTQUFBLEVBQUE7WUFDQSxPQUFBLEtBQUEsS0FBQSxRQUFBOztVQUVBLFVBQUEsVUFBQTtZQUNBLE9BQUEsS0FBQSxLQUFBOzs7Ozs7O0FDYkEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsMERBQUEsU0FBQSxRQUFBLFlBQUEsT0FBQSxPQUFBOztFQUVBLElBQUEsS0FBQTtFQUNBLEdBQUEsa0JBQUE7RUFDQSxHQUFBLFdBQUE7RUFDQSxHQUFBLFdBQUE7O0VBRUEsU0FBQSxpQkFBQTtJQUNBLE9BQUEsTUFBQTs7RUFFQSxTQUFBLFVBQUE7R0FDQSxHQUFBLE1BQUEsa0JBQUE7SUFDQSxNQUFBLFNBQUEsS0FBQSxTQUFBLEtBQUE7S0FDQSxPQUFBLFFBQUE7T0FDQSxNQUFBLFNBQUEsU0FBQTs7Ozs7RUFLQSxJQUFBO0lBQ0EsU0FBQSxTQUFBLGFBQUEsSUFBQTtNQUNBLGVBQUE7TUFDQSxZQUFBO0tBQ0E7RUFDQSxPQUFBLE9BQUEsVUFBQTtHQUNBLE9BQUEsV0FBQTtLQUNBLFNBQUEsUUFBQTtHQUNBLE9BQUEsZUFBQSxXQUFBOzs7Ozs7O0FDOUJBLENBQUEsWUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLCtCQUFBLFVBQUEsV0FBQTtFQUNBLEtBQUEsV0FBQTtHQUNBLGFBQUE7R0FDQSxXQUFBO0dBQ0EseUJBQUE7R0FDQSxrQkFBQTs7O0VBR0EsS0FBQSxlQUFBLFVBQUEsTUFBQSxJQUFBO0dBQ0EsVUFBQSxLQUFBLFVBQUE7S0FDQSxNQUFBO0tBQ0EsUUFBQSx3QkFBQSxPQUFBO0tBQ0EsR0FBQTtLQUNBLFlBQUE7Ozs7SUFJQSxLQUFBLGdCQUFBLFdBQUE7R0FDQSxVQUFBLEtBQUE7O0tBRUEsYUFBQTtTQUNBLGtCQUFBOztLQUVBLEtBQUEsVUFBQSxRQUFBOztPQUVBLFlBQUE7Ozs7Ozs7OztBQzVCQSxDQUFBLFlBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSxxS0FBQSxVQUFBLFFBQUEsU0FBQSxXQUFBLFNBQUEsUUFBQSxVQUFBLGNBQUEsb0JBQUEsYUFBQSxhQUFBLGFBQUE7O0VBRUEsSUFBQSxLQUFBO0VBQ0EsR0FBQSxNQUFBOztFQUVBLEdBQUEsYUFBQSxZQUFBO0VBQ0EsR0FBQSxrQkFBQSxZQUFBO0VBQ0EsR0FBQSxZQUFBO0VBQ0EsR0FBQSxhQUFBLG1CQUFBO0VBQ0EsR0FBQSxhQUFBO0VBQ0EsR0FBQSxjQUFBO0VBQ0EsR0FBQSxVQUFBO0VBQ0EsR0FBQSxhQUFBO0VBQ0EsR0FBQSxlQUFBO0VBQ0EsR0FBQSxZQUFBO0VBQ0EsR0FBQSxPQUFBO0VBQ0EsR0FBQSxZQUFBO0VBQ0EsR0FBQSxVQUFBO0dBQ0EsUUFBQTtHQUNBLFdBQUE7O0VBRUEsR0FBQSxVQUFBO0dBQ0EsYUFBQTs7OztFQUlBLEdBQUEsaUJBQUE7RUFDQSxHQUFBLFNBQUE7RUFDQSxHQUFBLFdBQUE7RUFDQSxHQUFBLGFBQUE7RUFDQSxHQUFBLHFCQUFBO0VBQ0EsR0FBQSxVQUFBO0VBQ0EsR0FBQSxZQUFBO0VBQ0EsR0FBQSxjQUFBOztFQUVBLEdBQUEsa0JBQUE7RUFDQSxHQUFBLGFBQUE7RUFDQSxHQUFBLGFBQUE7RUFDQSxHQUFBLGdCQUFBO0VBQ0EsR0FBQSxtQkFBQTtFQUNBLEdBQUEscUJBQUE7RUFDQSxHQUFBLGlCQUFBO0VBQ0EsR0FBQSxTQUFBOztFQUVBLEdBQUEsV0FBQTs7RUFFQTs7RUFFQSxTQUFBLFdBQUE7O0dBRUEsR0FBQSxnQkFBQSxLQUFBLFNBQUEsVUFBQTtJQUNBLEdBQUEsV0FBQSxLQUFBLFNBQUEsS0FBQTtLQUNBLEdBQUEsT0FBQTtLQUNBLEdBQUEsWUFBQSxVQUFBO0tBQ0E7S0FDQTtLQUNBLEdBQUEsT0FBQSxPQUFBLEtBQUE7TUFDQSxHQUFBLFNBQUEsT0FBQSxPQUFBO01BQ0E7O0tBRUEsR0FBQSxPQUFBLE9BQUEsVUFBQTtNQUNBLEdBQUEsT0FBQTtNQUNBLEdBQUEsUUFBQSxVQUFBLEtBQUEsR0FBQTtNQUNBLEdBQUEsUUFBQSxTQUFBO01BQ0EsV0FBQSxTQUFBO01BQ0EsSUFBQSxZQUFBLE9BQUEsT0FBQSxVQUFBLE1BQUE7TUFDQSxRQUFBLFFBQUEsV0FBQSxTQUFBLElBQUE7T0FDQSxHQUFBLFFBQUEsVUFBQSxLQUFBLGVBQUE7O01BRUEsUUFBQSxJQUFBLEdBQUEsUUFBQTtNQUNBLFVBQUEsS0FBQSxHQUFBLFFBQUEsR0FBQSxVQUFBO01BQ0EsWUFBQSxPQUFBLGdCQUFBLFdBQUEsS0FBQSxVQUFBLE1BQUE7T0FDQSxHQUFBLE9BQUE7Ozs7Ozs7O0VBUUEsU0FBQSxRQUFBO0dBQ0EsUUFBQSxRQUFBOztFQUVBLFNBQUEsZUFBQSxTQUFBO0dBQ0EsSUFBQSxXQUFBLE1BQUEsR0FBQSxjQUFBLElBQUE7SUFDQSxHQUFBLGFBQUE7VUFDQTtJQUNBLEdBQUEsYUFBQTs7R0FFQSxHQUFBLGVBQUEsR0FBQSxhQUFBLGtCQUFBO0dBQ0E7RUFDQSxTQUFBLFNBQUEsTUFBQTtHQUNBLEdBQUEsV0FBQSxlQUFBO0dBQ0EsZ0JBQUE7R0FDQTs7RUFFQSxTQUFBLGFBQUE7R0FDQSxHQUFBLFlBQUEsQ0FBQSxHQUFBO0dBQ0EsR0FBQSxZQUFBLEdBQUEsYUFBQSxPQUFBLGlCQUFBOztFQUVBLFNBQUEsV0FBQSxLQUFBO0dBQ0EsR0FBQSxVQUFBO0dBQ0EsR0FBQTtHQUNBOztFQUVBLFNBQUEsbUJBQUEsS0FBQTtHQUNBLElBQUEsR0FBQSxXQUFBO0lBQ0EsU0FBQSxZQUFBO0tBQ0EsR0FBQSxVQUFBLE9BQUEsbUJBQUEsU0FBQSxHQUFBLFFBQUEsR0FBQSxVQUFBLE1BQUEsV0FBQTs7O0dBR0E7RUFDQSxTQUFBLFdBQUE7R0FDQSxHQUFBLENBQUEsR0FBQSxRQUFBO0lBQ0E7O0dBRUEsSUFBQSxPQUFBO0dBQ0EsUUFBQSxRQUFBLEdBQUEsTUFBQSxTQUFBLE1BQUE7SUFDQSxLQUFBLEdBQUEsVUFBQSxvQkFBQSxXQUFBLEtBQUEsR0FBQSxVQUFBO0lBQ0EsS0FBQSxXQUFBLFdBQUEsS0FBQTs7R0FFQSxJQUFBLFNBQUEsUUFBQSxXQUFBLEdBQUEsTUFBQSxDQUFBLEdBQUEsVUFBQSxrQkFBQSxVQUFBO0dBQ0EsT0FBQSxPQUFBLFFBQUEsR0FBQSxXQUFBO0dBQ0EsR0FBQSxRQUFBLEdBQUEsVUFBQSxpQkFBQSxXQUFBO0dBQ0EsR0FBQSxnQkFBQTtLQUNBLE1BQUEsR0FBQSxVQUFBO0tBQ0EsTUFBQSxHQUFBLFVBQUEsaUJBQUE7OztFQUdBLFNBQUEsUUFBQSxRQUFBO0dBQ0EsSUFBQSxTQUFBLFFBQUEsV0FBQSxHQUFBLE1BQUEsQ0FBQSxHQUFBLFVBQUEsa0JBQUEsVUFBQTtHQUNBLElBQUEsT0FBQSxPQUFBLFFBQUEsV0FBQTtHQUNBLE9BQUE7O0VBRUEsU0FBQSxhQUFBO0dBQ0EsR0FBQSxPQUFBLENBQUEsR0FBQTtHQUNBOztFQUVBLFNBQUEsZ0JBQUE7R0FDQSxPQUFBLEdBQUEsVUFBQSxDQUFBLEdBQUE7R0FDQTtFQUNBLFNBQUEsZ0JBQUEsSUFBQTtHQUNBLFlBQUEsT0FBQSxXQUFBLEtBQUEsS0FBQSxVQUFBLE1BQUE7SUFDQSxHQUFBLFFBQUEsT0FBQSxLQUFBO0lBQ0EsZUFBQTs7O0VBR0EsU0FBQSxlQUFBLEtBQUE7R0FDQSxHQUFBLENBQUEsT0FBQSxPQUFBLFVBQUE7SUFDQSxZQUFBLE9BQUEsZ0JBQUEsQ0FBQSxNQUFBLEtBQUEsVUFBQSxNQUFBO0tBQ0EsR0FBQSxPQUFBOzs7Ozs7RUFNQSxTQUFBLGdCQUFBLE1BQUE7R0FDQSxJQUFBLFFBQUEsQ0FBQSxHQUFBLFFBQUEsVUFBQSxDQUFBLFFBQUEsR0FBQSxRQUFBLFFBQUE7SUFDQSxHQUFBOzs7O0VBSUEsU0FBQSxtQkFBQTtHQUNBLEdBQUEsUUFBQSxZQUFBLENBQUEsR0FBQTtHQUNBLEdBQUEsUUFBQSxTQUFBLENBQUEsR0FBQSxRQUFBO0dBQ0EsSUFBQSxHQUFBLFFBQUEsUUFBQTtJQUNBLEdBQUEsT0FBQTtJQUNBLFdBQUEsU0FBQTtJQUNBLEdBQUEsVUFBQSxRQUFBLGNBQUE7SUFDQSxHQUFBLFVBQUEsU0FBQTs7VUFFQTtJQUNBLFdBQUEsU0FBQTtJQUNBLFFBQUEsUUFBQSxHQUFBLFVBQUEsT0FBQSxtQkFBQSxVQUFBLFVBQUEsU0FBQTtLQUNBLFFBQUEsV0FBQTs7SUFFQSxHQUFBLFVBQUEsT0FBQSxtQkFBQSxTQUFBLEdBQUEsUUFBQSxHQUFBLFVBQUEsTUFBQSxXQUFBO0lBQ0EsR0FBQSxVQUFBLFFBQUEsY0FBQTtJQUNBLEdBQUEsVUFBQSxTQUFBO0lBQ0EsWUFBQSxPQUFBLGdCQUFBLENBQUEsR0FBQSxRQUFBLEdBQUEsVUFBQSxPQUFBLEtBQUEsVUFBQSxNQUFBO0tBQ0EsR0FBQSxPQUFBOztJQUVBLE9BQUEsR0FBQSwwQkFBQTtLQUNBLE1BQUEsT0FBQSxPQUFBO0tBQ0EsS0FBQSxPQUFBLE9BQUE7Ozs7R0FJQTs7RUFFQSxTQUFBLG1CQUFBLFNBQUE7R0FDQSxJQUFBLFFBQUE7R0FDQSxRQUFBLFFBQUEsR0FBQSxRQUFBLFdBQUEsVUFBQSxLQUFBLEtBQUE7SUFDQSxJQUFBLFdBQUEsT0FBQSxPQUFBLEdBQUEsU0FBQTtLQUNBLEdBQUEsUUFBQSxVQUFBLE9BQUEsS0FBQTtLQUNBLFFBQUE7OztHQUdBLElBQUEsQ0FBQSxPQUFBO0lBQ0EsR0FBQSxRQUFBLFVBQUEsS0FBQTtJQUNBO0dBQ0EsSUFBQSxPQUFBO0dBQ0EsSUFBQSxVQUFBO0dBQ0EsUUFBQSxRQUFBLEdBQUEsUUFBQSxXQUFBLFVBQUEsTUFBQSxLQUFBO0lBQ0EsS0FBQSxLQUFBLEtBQUEsR0FBQSxVQUFBO0lBQ0EsR0FBQSxLQUFBLEdBQUEsVUFBQSxRQUFBLEdBQUEsUUFBQSxHQUFBLFVBQUEsS0FBQTtLQUNBLFFBQUEsS0FBQSxLQUFBLEdBQUEsVUFBQTs7O0dBR0EsSUFBQSxLQUFBLFNBQUEsR0FBQTtJQUNBLFlBQUEsT0FBQSxnQkFBQSxNQUFBLEtBQUEsVUFBQSxNQUFBO0tBQ0EsR0FBQSxPQUFBOztJQUVBLE9BQUEsR0FBQSxrQ0FBQTtLQUNBLE9BQUEsT0FBQSxPQUFBO0tBQ0EsTUFBQSxPQUFBLE9BQUE7S0FDQSxVQUFBLFFBQUEsS0FBQTs7OztHQUlBLE9BQUEsQ0FBQTtHQUNBOztFQUVBLFNBQUEsWUFBQTtHQUNBLElBQUEsQ0FBQSxHQUFBLFNBQUE7SUFDQSxPQUFBOztHQUVBLE9BQUEsQ0FBQSxHQUFBLFFBQUEsR0FBQSxXQUFBLEtBQUE7R0FDQTs7RUFFQSxTQUFBLGNBQUE7R0FDQSxJQUFBLENBQUEsR0FBQSxTQUFBO0lBQ0EsT0FBQTs7R0FFQSxPQUFBLEdBQUEsUUFBQSxpQkFBQSxJQUFBLGtCQUFBO0dBQ0E7O0VBRUEsU0FBQSxPQUFBLEdBQUE7R0FDQSxHQUFBLFlBQUE7OztFQUdBLFNBQUEsVUFBQSxNQUFBO0dBQ0EsSUFBQSxRQUFBO0dBQ0EsUUFBQSxRQUFBLEtBQUEsVUFBQSxVQUFBLE1BQUE7SUFDQSxJQUFBLEtBQUEsZUFBQSxHQUFBLFFBQUEsWUFBQSxNQUFBO0tBQ0EsR0FBQSxhQUFBOztJQUVBLFVBQUE7O0dBRUEsT0FBQTs7O0VBR0EsU0FBQSxXQUFBO0dBQ0EsVUFBQSxHQUFBO0dBQ0E7O0VBRUEsU0FBQSxnQkFBQSxNQUFBO0dBQ0EsSUFBQSxTQUFBO0dBQ0EsUUFBQSxRQUFBLEdBQUEsTUFBQSxVQUFBLEtBQUE7SUFDQSxJQUFBLElBQUEsV0FBQSxNQUFBO0tBQ0EsU0FBQTs7O0dBR0EsT0FBQTtHQUNBOztFQUVBLFNBQUEsZUFBQSxLQUFBO0dBQ0EsSUFBQSxTQUFBO0dBQ0EsUUFBQSxRQUFBLEdBQUEsTUFBQSxVQUFBLEtBQUE7SUFDQSxJQUFBLElBQUEsR0FBQSxVQUFBLFFBQUEsS0FBQTtLQUNBLFNBQUE7Ozs7R0FJQSxPQUFBO0dBQ0E7O0VBRUEsU0FBQSxhQUFBLFFBQUE7O0dBRUEsR0FBQSxTQUFBLFNBQUEsY0FBQTtHQUNBLEdBQUEsT0FBQSxRQUFBO0dBQ0EsR0FBQSxPQUFBLFNBQUE7R0FDQSxHQUFBLE1BQUEsR0FBQSxPQUFBLFdBQUE7R0FDQSxJQUFBLFdBQUEsR0FBQSxJQUFBLHFCQUFBLEdBQUEsR0FBQSxLQUFBO0dBQ0EsU0FBQSxhQUFBLEdBQUE7R0FDQSxTQUFBLGFBQUEsTUFBQSxHQUFBLFVBQUEsU0FBQTtHQUNBLFNBQUEsYUFBQSxHQUFBO0dBQ0EsR0FBQSxJQUFBLFlBQUE7R0FDQSxHQUFBLElBQUEsU0FBQSxHQUFBLEdBQUEsS0FBQTtHQUNBLEdBQUEsVUFBQSxHQUFBLElBQUEsYUFBQSxHQUFBLEdBQUEsS0FBQSxHQUFBOzs7O0VBSUEsU0FBQSxhQUFBLE9BQUE7R0FDQSxJQUFBLFdBQUEsR0FBQSxJQUFBLHFCQUFBLEdBQUEsR0FBQSxLQUFBO0dBQ0EsU0FBQSxhQUFBLEdBQUE7R0FDQSxTQUFBLGFBQUEsTUFBQTtHQUNBLFNBQUEsYUFBQSxHQUFBO0dBQ0EsR0FBQSxJQUFBLFlBQUE7R0FDQSxHQUFBLElBQUEsU0FBQSxHQUFBLEdBQUEsS0FBQTtHQUNBLEdBQUEsVUFBQSxHQUFBLElBQUEsYUFBQSxHQUFBLEdBQUEsS0FBQSxHQUFBOztHQUVBOztFQUVBLFNBQUEsY0FBQSxTQUFBO0dBQ0EsSUFBQSxRQUFBO0dBQ0EsSUFBQSxNQUFBLFFBQUEsV0FBQTtHQUNBLElBQUEsU0FBQSxlQUFBO0dBQ0EsSUFBQSxRQUFBLEdBQUEsVUFBQSxvQkFBQTs7R0FFQSxRQUFBLElBQUEsR0FBQSxVQUFBO0dBQ0EsSUFBQSxXQUFBLFNBQUEsTUFBQSxNQUFBLE9BQUEsVUFBQTtHQUNBLElBQUEsUUFBQSxVQUFBLEdBQUEsUUFBQSxZQUFBLE9BQUEsR0FBQSxRQUFBLFdBQUEsS0FBQSxPQUFBLEdBQUEsUUFBQSxXQUFBLEtBQUEsTUFBQSxHQUFBLFFBQUEsV0FBQSxLQUFBO0dBQ0EsTUFBQSxRQUFBO0dBQ0EsTUFBQSxVQUFBO0lBQ0EsT0FBQTtJQUNBLE1BQUE7O0dBRUEsTUFBQSxXQUFBO0lBQ0EsT0FBQTtJQUNBLFNBQUE7S0FDQSxPQUFBO0tBQ0EsTUFBQTs7O0dBR0EsT0FBQTtHQUNBOztFQUVBLFNBQUEsZUFBQSxTQUFBOztHQUVBLElBQUEsUUFBQTtHQUNBLElBQUEsTUFBQSxRQUFBLFdBQUE7R0FDQSxJQUFBLFNBQUEsZUFBQTtHQUNBLElBQUEsUUFBQSxHQUFBLFVBQUEsb0JBQUE7R0FDQSxJQUFBLE9BQUEsUUFBQTtHQUNBLEdBQUEsT0FBQSxHQUFBLFFBQUEsR0FBQSxVQUFBLEtBQUE7S0FDQSxRQUFBLFdBQUE7OztHQUdBLFFBQUE7R0FDQSxLQUFBO0lBQ0EsSUFBQSxPQUFBLE9BQUEsVUFBQSxhQUFBOztLQUVBLElBQUEsV0FBQSxTQUFBLE1BQUEsTUFBQSxTQUFBLE9BQUEsV0FBQTtLQUNBLElBQUEsUUFBQSxVQUFBLEdBQUEsUUFBQSxZQUFBLE9BQUEsR0FBQSxRQUFBLFdBQUEsS0FBQSxPQUFBLEdBQUEsUUFBQSxXQUFBLEtBQUEsTUFBQSxHQUFBLFFBQUEsV0FBQSxLQUFBO0tBQ0EsTUFBQSxRQUFBLFVBQUEsR0FBQSxRQUFBLFlBQUEsT0FBQSxHQUFBLFFBQUEsV0FBQSxLQUFBLE9BQUEsR0FBQSxRQUFBLFdBQUEsS0FBQTtLQUNBLE1BQUEsVUFBQTtNQUNBLE9BQUE7TUFDQSxNQUFBOztLQUVBLE1BQUEsV0FBQTtNQUNBLE9BQUEsVUFBQSxHQUFBLFFBQUEsWUFBQSxPQUFBLEdBQUEsUUFBQSxXQUFBLEtBQUEsT0FBQSxHQUFBLFFBQUEsV0FBQSxLQUFBO01BQ0EsU0FBQTtPQUNBLE9BQUE7T0FDQSxNQUFBOzs7S0FHQTtXQUNBOztLQUVBLE1BQUEsUUFBQTtLQUNBLE1BQUEsVUFBQTtNQUNBLE9BQUE7TUFDQSxNQUFBOzs7O0dBSUEsSUFBQSxRQUFBLE1BQUEsU0FBQSw0QkFBQTtJQUNBLE1BQUEsY0FBQSxZQUFBO0tBQ0EsSUFBQSxRQUFBO01BQ0EsTUFBQSxRQUFBLFdBQUE7TUFDQSxVQUFBLENBQUEsS0FBQTtNQUNBLFVBQUE7O0tBRUEsT0FBQTs7O0dBR0EsT0FBQTtHQUNBOztFQUVBLE9BQUEsT0FBQSxjQUFBLFVBQUEsR0FBQSxHQUFBO0dBQ0EsSUFBQSxNQUFBLEdBQUE7SUFDQTs7R0FFQSxHQUFBLEVBQUEsR0FBQSxVQUFBLE1BQUE7SUFDQSxHQUFBLEVBQUEsR0FBQSxVQUFBLEtBQUE7S0FDQSxHQUFBLFVBQUEsT0FBQSxtQkFBQSxTQUFBLEVBQUEsR0FBQSxVQUFBLE1BQUEsV0FBQTs7SUFFQTtJQUNBLGdCQUFBLEVBQUEsR0FBQSxVQUFBO0lBQ0EsR0FBQSxVQUFBLE9BQUEsbUJBQUEsU0FBQSxFQUFBLEdBQUEsVUFBQSxNQUFBLFdBQUE7SUFDQSxHQUFBLE9BQUEsUUFBQSxRQUFBLDZCQUFBLE9BQUEsUUFBQSxRQUFBLGlCQUFBO0tBQ0EsT0FBQSxHQUFBLDJCQUFBO01BQ0EsT0FBQSxPQUFBLE9BQUE7TUFDQSxNQUFBLEVBQUEsR0FBQSxVQUFBOzs7VUFHQTtJQUNBLE9BQUEsR0FBQSxpQkFBQTtLQUNBLE9BQUEsT0FBQSxPQUFBOzs7O0VBSUEsT0FBQSxPQUFBLDBCQUFBLFVBQUEsR0FBQSxHQUFBO0dBQ0EsSUFBQSxNQUFBLEdBQUE7SUFDQTs7R0FFQSxJQUFBO0lBQ0EsYUFBQSxFQUFBO1FBQ0E7SUFDQSxhQUFBO0lBQ0E7R0FDQSxHQUFBOzs7Ozs7Ozs7Ozs7O0dBYUEsSUFBQSxHQUFBLFFBQUEsR0FBQSxVQUFBLE1BQUE7SUFDQSxHQUFBLE9BQUEsT0FBQSxVQUFBO0tBQ0EsT0FBQSxHQUFBLG1DQUFBO01BQ0EsT0FBQSxFQUFBO01BQ0EsTUFBQSxHQUFBLFFBQUEsR0FBQSxVQUFBO01BQ0EsV0FBQSxPQUFBLE9BQUE7OztRQUdBO0tBQ0EsT0FBQSxHQUFBLDJCQUFBO01BQ0EsT0FBQSxFQUFBO01BQ0EsTUFBQSxHQUFBLFFBQUEsR0FBQSxVQUFBOzs7VUFHQTtJQUNBLE9BQUEsR0FBQSxrQkFBQTtLQUNBLE9BQUEsRUFBQTs7Ozs7RUFLQSxPQUFBLE9BQUEsV0FBQSxVQUFBLEdBQUEsR0FBQTtHQUNBLElBQUEsTUFBQSxHQUFBO0lBQ0E7OztHQUdBLElBQUEsTUFBQSxDQUFBLEVBQUEsWUFBQSxHQUFBLEdBQUE7S0FDQSxDQUFBLEVBQUEsWUFBQSxHQUFBLEdBQUE7O0lBRUEsTUFBQSxDQUFBLEVBQUEsWUFBQSxHQUFBLEdBQUE7S0FDQSxDQUFBLEVBQUEsWUFBQSxHQUFBLEdBQUE7O0dBRUEsSUFBQSxZQUFBLEVBQUEsT0FBQSxFQUFBLFlBQUEsR0FBQSxHQUFBLElBQUEsRUFBQSxZQUFBLEdBQUEsR0FBQTtJQUNBLFlBQUEsRUFBQSxPQUFBLEVBQUEsWUFBQSxHQUFBLEdBQUEsSUFBQSxFQUFBLFlBQUEsR0FBQSxHQUFBO0lBQ0EsU0FBQSxFQUFBLGFBQUEsV0FBQTs7R0FFQSxJQUFBLE1BQUE7SUFDQSxDQUFBLEtBQUE7SUFDQSxDQUFBLEdBQUE7O0dBRUEsSUFBQSxHQUFBLFFBQUEsUUFBQTtJQUNBLE1BQUE7S0FDQSxDQUFBLEtBQUE7S0FDQSxDQUFBLEdBQUE7OztHQUdBLEdBQUEsSUFBQSxVQUFBLFFBQUE7SUFDQSxnQkFBQSxJQUFBO0lBQ0Esb0JBQUEsSUFBQTtJQUNBLFNBQUE7Ozs7RUFJQSxPQUFBLElBQUEsdUJBQUEsVUFBQSxPQUFBLFNBQUEsVUFBQSxXQUFBLFlBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7RUFrQ0EsU0FBQSxnQkFBQTtHQUNBLFlBQUEsT0FBQSxPQUFBLEtBQUEsVUFBQSxLQUFBO0lBQ0EsR0FBQSxNQUFBO0lBQ0EsR0FBQSxZQUFBLG1CQUFBO0lBQ0EsU0FBQSxZQUFBO0tBQ0EsR0FBQSxPQUFBLE9BQUEsVUFBQTtNQUNBLEdBQUEsVUFBQSxRQUFBLGNBQUE7TUFDQSxHQUFBLFVBQUEsU0FBQTtNQUNBLEdBQUEsVUFBQSxPQUFBLG1CQUFBLFNBQUEsR0FBQSxRQUFBLEdBQUEsVUFBQSxNQUFBLFdBQUE7TUFDQSxJQUFBLFlBQUEsT0FBQSxPQUFBLFVBQUEsTUFBQTtNQUNBLFFBQUEsUUFBQSxXQUFBLFNBQUEsSUFBQTtPQUNBLEdBQUEsVUFBQSxPQUFBLG1CQUFBLFNBQUEsS0FBQSxXQUFBOzs7O1NBSUE7TUFDQSxHQUFBLFVBQUEsU0FBQTtNQUNBLEdBQUEsT0FBQSxPQUFBLEtBQUE7UUFDQSxHQUFBLFVBQUEsT0FBQSxtQkFBQSxTQUFBLE9BQUEsT0FBQSxNQUFBLFdBQUE7Ozs7O0lBS0EsR0FBQSxVQUFBLFFBQUEsVUFBQSxVQUFBLEtBQUEsR0FBQTtLQUNBLElBQUEsQ0FBQSxHQUFBLFFBQUEsUUFBQTtNQUNBLElBQUEsSUFBQSxlQUFBLElBQUEsUUFBQSxXQUFBO01BQ0EsSUFBQSxPQUFBLEVBQUEsR0FBQSxVQUFBLHFCQUFBLGFBQUE7T0FDQSxHQUFBLFVBQUEsZUFBQSxJQUFBLFFBQUEsV0FBQTthQUNBO09BQ0EsYUFBQSxNQUFBOztZQUVBO01BQ0EsSUFBQSxJQUFBLGVBQUEsSUFBQSxRQUFBLFdBQUE7TUFDQSxJQUFBLE9BQUEsRUFBQSxHQUFBLFVBQUEscUJBQUEsYUFBQTtPQUNBLEdBQUEsbUJBQUE7YUFDQTtPQUNBLGFBQUEsTUFBQTs7Ozs7R0FLQTs7OztBQzVpQkEsQ0FBQSxZQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsc0NBQUEsVUFBQSxPQUFBLFFBQUE7O0lBRUEsT0FBQSxTQUFBOzs7O0FDTEEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsNkpBQUEsU0FBQSxPQUFBLFdBQUEsY0FBQSxhQUFBLFNBQUEsUUFBQSxTQUFBLGFBQUEsUUFBQSxtQkFBQTs7UUFFQSxJQUFBLEtBQUE7UUFDQSxHQUFBLE1BQUE7UUFDQSxHQUFBLE9BQUE7UUFDQSxHQUFBLFdBQUE7UUFDQSxHQUFBLFdBQUE7UUFDQSxHQUFBLGVBQUE7UUFDQSxHQUFBLGFBQUE7UUFDQSxHQUFBLGdCQUFBO1FBQ0EsR0FBQSxPQUFBO1FBQ0EsR0FBQSxTQUFBO1FBQ0EsR0FBQSxhQUFBO1FBQ0EsR0FBQSxpQkFBQTtRQUNBLEdBQUEsZ0JBQUE7UUFDQSxHQUFBLHFCQUFBO1FBQ0EsR0FBQSxpQkFBQTtRQUNBLEdBQUEsY0FBQTtRQUNBLEdBQUEsc0JBQUE7UUFDQSxHQUFBLFlBQUE7UUFDQSxHQUFBLGtCQUFBO1FBQ0EsR0FBQSxpQkFBQTtRQUNBLEdBQUEsV0FBQTtRQUNBLEdBQUEsVUFBQTtRQUNBLEdBQUEsV0FBQTtRQUNBLEdBQUEsZ0JBQUE7UUFDQSxHQUFBLE9BQUE7VUFDQSxXQUFBO1VBQ0EsY0FBQTtVQUNBLE1BQUE7O1FBRUEsR0FBQSxRQUFBO1VBQ0EsUUFBQTtVQUNBLE9BQUE7VUFDQSxPQUFBO1VBQ0EsTUFBQTs7O1FBR0E7O1FBRUEsU0FBQSxVQUFBO1VBQ0E7O1FBRUEsU0FBQSxVQUFBLE9BQUE7VUFDQSxPQUFBLFNBQUEsV0FBQTs7UUFFQSxTQUFBLGdCQUFBLFFBQUE7U0FDQSxJQUFBLFFBQUE7Y0FDQSxNQUFBO2NBQ0EsU0FBQTtVQUNBLE9BQUE7VUFDQSxNQUFBOzs7U0FHQSxPQUFBOztRQUVBLFNBQUEsVUFBQTtXQUNBLFlBQUEsT0FBQSxPQUFBLEtBQUEsVUFBQSxLQUFBO2NBQ0EsR0FBQSxZQUFBLG1CQUFBO2NBQ0EsU0FBQSxVQUFBO2dCQUNBLEdBQUEsVUFBQSxTQUFBOzs7O1FBSUEsU0FBQSxPQUFBLFdBQUE7VUFDQSxHQUFBLFNBQUE7U0FDQTtRQUNBLFNBQUEsY0FBQSxPQUFBO1VBQ0EsT0FBQSxHQUFBLE9BQUEsUUFBQSxXQUFBLEdBQUEsTUFBQSxDQUFBLFFBQUE7U0FDQTtRQUNBLFNBQUEsbUJBQUEsTUFBQSxPQUFBOzs7U0FHQTtRQUNBLFNBQUEsZUFBQSxLQUFBO1VBQ0EsT0FBQSxLQUFBLE9BQUEsU0FBQSxJQUFBLFdBQUE7O1FBRUEsU0FBQSxhQUFBO1VBQ0EsUUFBQSxRQUFBLEdBQUEsTUFBQSxTQUFBLEtBQUEsSUFBQTtZQUNBLFFBQUEsUUFBQSxJQUFBLEtBQUEsSUFBQSxTQUFBLE1BQUEsRUFBQTtjQUNBLEdBQUEsTUFBQSxTQUFBLE9BQUEsRUFBQTtnQkFDQSxHQUFBLFFBQUEsUUFBQSxPQUFBLEtBQUEsS0FBQSxRQUFBLFVBQUEsQ0FBQSxFQUFBO2tCQUNBLEdBQUEsS0FBQSxLQUFBLEtBQUEsR0FBQSxLQUFBO2tCQUNBLEdBQUE7a0JBQ0EsSUFBQSxPQUFBLE9BQUEsRUFBQTs7O2NBR0EsUUFBQTtnQkFDQSxLQUFBO3NCQUNBLEdBQUEsS0FBQSxLQUFBLEtBQUEsR0FBQSxPQUFBO2tCQUNBO2dCQUNBLEtBQUE7d0JBQ0EsR0FBQSxLQUFBLEtBQUEsS0FBQSxHQUFBLE9BQUE7b0JBQ0E7Z0JBQ0EsS0FBQTt3QkFDQSxHQUFBLEtBQUEsS0FBQSxLQUFBLEdBQUEsT0FBQTtvQkFDQTtnQkFDQSxLQUFBO3dCQUNBLEdBQUEsS0FBQSxLQUFBLEtBQUEsR0FBQSxPQUFBO29CQUNBO2dCQUNBO2tCQUNBOzs7WUFHQSxHQUFBLENBQUEsSUFBQSxLQUFBLEdBQUEsR0FBQSxLQUFBLFdBQUE7Y0FDQSxHQUFBO2NBQ0EsR0FBQTtjQUNBLElBQUEsT0FBQSxLQUFBO2dCQUNBLEtBQUE7Z0JBQ0EsUUFBQTtnQkFDQSxRQUFBLEdBQUEsS0FBQTs7Ozs7UUFLQSxTQUFBLGdCQUFBLElBQUE7VUFDQSxHQUFBLE9BQUEsR0FBQSxLQUFBLE1BQUEsUUFBQSxZQUFBO1lBQ0EsR0FBQSxHQUFBLEtBQUEsTUFBQSxLQUFBLE1BQUE7Y0FDQSxPQUFBOzs7VUFHQSxPQUFBOztRQUVBLFNBQUEsZUFBQSxHQUFBLElBQUE7VUFDQSxHQUFBLFNBQUE7VUFDQSxjQUFBLGFBQUEsY0FBQTs7UUFFQSxTQUFBLGdCQUFBO1VBQ0EsUUFBQSxRQUFBLEdBQUEsVUFBQSxTQUFBLE1BQUEsSUFBQTtZQUNBLFFBQUEsUUFBQSxLQUFBLFFBQUEsU0FBQSxPQUFBLEVBQUE7Y0FDQSxHQUFBLE1BQUEsUUFBQSxFQUFBO2dCQUNBLEdBQUE7O2NBRUEsR0FBQTs7WUFFQSxHQUFBLEtBQUEsT0FBQSxHQUFBLEtBQUEsUUFBQSxPQUFBO1lBQ0EsR0FBQSxTQUFBLE9BQUEsS0FBQTs7VUFFQSxHQUFBLEdBQUEsS0FBQSxVQUFBLEVBQUE7WUFDQSxHQUFBO1lBQ0EsT0FBQSxJQUFBOzs7UUFHQSxTQUFBLFNBQUE7VUFDQSxHQUFBLE1BQUEsR0FBQSxTQUFBO1VBQ0EsY0FBQSxhQUFBLFdBQUE7O1FBRUEsU0FBQSxZQUFBO1VBQ0EsR0FBQSxPQUFBOztRQUVBLFNBQUEsVUFBQTtVQUNBLEdBQUEsV0FBQTtVQUNBLEdBQUEsV0FBQTtVQUNBLElBQUEsVUFBQTtVQUNBLFFBQUEsUUFBQSxHQUFBLE1BQUEsU0FBQSxNQUFBLElBQUE7WUFDQSxRQUFBLEtBQUE7Y0FDQSxLQUFBLEtBQUEsS0FBQSxHQUFBLEdBQUEsS0FBQTtjQUNBLE1BQUEsS0FBQSxLQUFBLEdBQUEsR0FBQSxLQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1VBeUJBLFlBQUEsS0FBQSx1QkFBQSxDQUFBLEtBQUEsVUFBQSxLQUFBLFNBQUEsU0FBQTtjQUNBLFFBQUEsUUFBQSxTQUFBLE1BQUEsU0FBQSxTQUFBLElBQUE7Z0JBQ0EsUUFBQSxRQUFBLEdBQUEsTUFBQSxTQUFBLE1BQUEsRUFBQTtvQkFDQSxHQUFBLFFBQUEsUUFBQSxLQUFBLEtBQUEsR0FBQSxHQUFBLEtBQUEsZUFBQTtzQkFDQSxHQUFBLFFBQUEsS0FBQSxTQUFBLEVBQUE7d0JBQ0EsSUFBQSxXQUFBOzBCQUNBLE9BQUE7MEJBQ0EsU0FBQSxRQUFBOzt3QkFFQSxHQUFBLFNBQUEsS0FBQTs7MEJBRUE7d0JBQ0EsR0FBQSxLQUFBLEdBQUEsS0FBQSxHQUFBLEdBQUEsS0FBQSxhQUFBLFFBQUEsS0FBQSxHQUFBO3dCQUNBLEdBQUEsS0FBQSxHQUFBLEtBQUEsR0FBQSxHQUFBLEtBQUEsaUJBQUEsUUFBQSxLQUFBLEdBQUE7d0JBQ0EsR0FBQSxLQUFBLE9BQUEsT0FBQTswQkFDQSxRQUFBLFFBQUEsS0FBQSxRQUFBLFNBQUEsT0FBQSxFQUFBOzRCQUNBLEdBQUEsTUFBQSxRQUFBLEVBQUE7OEJBQ0EsR0FBQTs4QkFDQSxHQUFBOzhCQUNBLEtBQUEsT0FBQSxPQUFBLEdBQUE7Ozs7Ozs7O2NBUUEsR0FBQSxHQUFBLFNBQUEsT0FBQTtnQkFDQSxjQUFBLGFBQUEscUJBQUE7Ozs7Ozs7Ozs7UUFVQSxTQUFBLFVBQUE7VUFDQSxRQUFBLElBQUEsR0FBQTtVQUNBLFFBQUEsSUFBQSxHQUFBO1VBQ0EsSUFBQSxhQUFBLENBQUEsS0FBQTtVQUNBLElBQUEsT0FBQSxJQUFBLFNBQUE7VUFDQSxRQUFBLFFBQUEsR0FBQSxNQUFBLFNBQUEsTUFBQSxJQUFBO1lBQ0EsR0FBQSxLQUFBLE9BQUEsVUFBQSxFQUFBO2NBQ0EsS0FBQSxLQUFBLEdBQUEsT0FBQSxHQUFBLEtBQUE7Y0FDQSxXQUFBLEtBQUEsS0FBQSxLQUFBLEtBQUE7OztVQUdBLFFBQUEsUUFBQSxHQUFBLEtBQUEsR0FBQSxLQUFBLElBQUEsU0FBQSxNQUFBLElBQUE7WUFDQSxRQUFBLElBQUEsR0FBQSxLQUFBLE1BQUEsTUFBQTtZQUNBLEdBQUEsR0FBQSxLQUFBLE1BQUEsS0FBQTtjQUNBLElBQUEsUUFBQTtnQkFDQSxVQUFBO2dCQUNBLFFBQUEsR0FBQSxLQUFBLE1BQUEsS0FBQTtnQkFDQSxjQUFBLEdBQUEsS0FBQSxNQUFBLEtBQUE7O2NBRUEsT0FBQSxLQUFBOzs7VUFHQSxRQUFBLFFBQUEsR0FBQSxLQUFBLE9BQUEsU0FBQSxNQUFBLElBQUE7WUFDQSxLQUFBLEtBQUE7Y0FDQSxNQUFBO2NBQ0EsTUFBQTs7O1VBR0EsR0FBQSxLQUFBLFNBQUE7VUFDQSxHQUFBLEtBQUEsT0FBQTtVQUNBLFFBQUEsSUFBQSxHQUFBO1VBQ0EsWUFBQSxLQUFBLGVBQUEsR0FBQSxNQUFBLEtBQUEsU0FBQSxTQUFBO2NBQ0EsWUFBQSxLQUFBLGVBQUEsU0FBQSxLQUFBLFdBQUEsV0FBQSxZQUFBLEtBQUEsU0FBQSxJQUFBO2dCQUNBLEdBQUEsSUFBQSxRQUFBLEtBQUE7a0JBQ0EsT0FBQSxRQUFBLFdBQUEsS0FBQSxPQUFBLHNCQUFBLEdBQUEsS0FBQSxLQUFBO2tCQUNBLEdBQUEsT0FBQTtrQkFDQSxHQUFBLE9BQUE7OzthQUdBLFNBQUEsU0FBQTtZQUNBLEdBQUEsU0FBQSxRQUFBO2NBQ0EsT0FBQSxNQUFBLFNBQUEsU0FBQTs7Ozs7UUFLQSxTQUFBLGVBQUE7VUFDQSxZQUFBLE9BQUEsZUFBQSxLQUFBLFNBQUEsU0FBQTtZQUNBLEdBQUEsWUFBQTtZQUNBLEdBQUEsZ0JBQUE7OztRQUdBLE9BQUEsSUFBQSxxQkFBQSxVQUFBLE9BQUEsU0FBQSxVQUFBLFdBQUEsWUFBQTtVQUNBLFFBQUEsUUFBQTs7WUFFQSxLQUFBOztjQUVBO1lBQ0EsS0FBQTtnQkFDQSxHQUFBLENBQUEsR0FBQSxLQUFBLFVBQUE7O2tCQUVBLE9BQUEsTUFBQSxtQ0FBQTtrQkFDQSxNQUFBO21CQUNBLFdBQUEsaUJBQUE7O2dCQUVBO1lBQ0EsS0FBQTs7Y0FFQTtZQUNBOztnQkFFQSxHQUFBLEdBQUEsS0FBQSxPQUFBO2tCQUNBLE9BQUEsVUFBQTtrQkFDQSxjQUFBLGFBQUEsYUFBQSxRQUFBLEdBQUE7a0JBQ0EsTUFBQTtrQkFDQSxXQUFBLGlCQUFBOzs7Y0FHQTs7OztRQUlBLE9BQUEsSUFBQSx1QkFBQSxVQUFBLE9BQUEsU0FBQSxVQUFBLFdBQUEsWUFBQTtVQUNBLEdBQUEsQ0FBQSxHQUFBLEtBQUEsT0FBQTtZQUNBLE9BQUEsR0FBQTs7Y0FFQTtZQUNBLFFBQUEsUUFBQTtjQUNBLEtBQUE7a0JBQ0EsR0FBQSxPQUFBO2dCQUNBO2NBQ0EsS0FBQTtrQkFDQSxHQUFBLE9BQUE7a0JBQ0EsR0FBQSxzQkFBQTtnQkFDQTtjQUNBLEtBQUE7a0JBQ0EsR0FBQSxPQUFBO2tCQUNBO2NBQ0EsS0FBQTtrQkFDQSxHQUFBLE9BQUE7a0JBQ0E7Y0FDQTs7Ozs7Ozs7O0FDcFVBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLDJDQUFBLFNBQUEsUUFBQSxPQUFBLE9BQUE7UUFDQSxJQUFBLEtBQUE7UUFDQSxHQUFBLFVBQUE7UUFDQSxHQUFBLGdCQUFBO1FBQ0EsR0FBQSxPQUFBO1VBQ0EsTUFBQTtVQUNBLFNBQUE7OztRQUdBOztRQUVBLFNBQUEsVUFBQTtVQUNBLEdBQUE7OztRQUdBLFNBQUEsZUFBQTs7VUFFQSxHQUFBLE1BQUEsa0JBQUE7Ozs7UUFJQSxTQUFBLFNBQUE7VUFDQSxNQUFBLE1BQUEsR0FBQSxNQUFBLEtBQUEsU0FBQSxTQUFBO1lBQ0EsT0FBQSxRQUFBO1lBQ0EsT0FBQSxHQUFBLGlCQUFBLENBQUEsTUFBQTthQUNBLE1BQUEsU0FBQSxTQUFBO1lBQ0EsT0FBQSxNQUFBLHdDQUFBOzs7Ozs7O0FDN0JBLENBQUEsWUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLGlEQUFBLFVBQUEsYUFBQSxvQkFBQTs7RUFFQSxJQUFBLEtBQUE7RUFDQSxJQUFBLFNBQUE7RUFDQSxHQUFBLFdBQUE7R0FDQSxpQkFBQTs7RUFFQSxHQUFBLFNBQUE7R0FDQSxLQUFBO0dBQ0EsS0FBQTtHQUNBLE1BQUE7O0VBRUEsR0FBQSxTQUFBO0dBQ0EsWUFBQTtJQUNBLEtBQUE7S0FDQSxNQUFBO0tBQ0EsS0FBQSxzRkFBQTtLQUNBLE1BQUE7Ozs7RUFJQSxZQUFBLE9BQUEsT0FBQSxLQUFBLFNBQUEsS0FBQTtHQUNBLElBQUEsTUFBQTtHQUNBLElBQUEsUUFBQSxJQUFBLEVBQUEsVUFBQSxVQUFBO0lBQ0EsS0FBQTtJQUNBLE9BQUE7SUFDQSxpQkFBQSxDQUFBO0lBQ0EsYUFBQTtJQUNBLHNCQUFBLFNBQUEsU0FBQTtLQUNBLE9BQUEsUUFBQSxXQUFBOztJQUVBLFFBQUEsU0FBQSxTQUFBLFNBQUE7S0FDQSxPQUFBOzs7SUFHQSxJQUFBLFNBQUEsbUJBQUEsU0FBQTtJQUNBLElBQUEsY0FBQSxFQUFBLFVBQUEsbUZBQUE7SUFDQSxJQUFBLFNBQUE7SUFDQSxZQUFBOzs7OztBQ3pDQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSwwRUFBQSxTQUFBLFFBQUEsWUFBQSxvQkFBQSxRQUFBOztRQUVBLElBQUEsS0FBQTtRQUNBLEdBQUEsWUFBQSxPQUFBLFFBQUEsR0FBQTtRQUNBLEdBQUEsVUFBQSxPQUFBLFFBQUEsR0FBQTtRQUNBLEdBQUEsT0FBQSxPQUFBLFFBQUEsR0FBQTtRQUNBLEdBQUEsVUFBQTtRQUNBLEdBQUEsWUFBQSxtQkFBQTtRQUNBLEdBQUEsVUFBQTtRQUNBLEdBQUEsWUFBQTtRQUNBLEdBQUEsY0FBQTs7UUFFQSxTQUFBLFdBQUE7VUFDQSxJQUFBLE9BQUE7VUFDQSxRQUFBLFFBQUEsR0FBQSxNQUFBLFNBQUEsTUFBQTtZQUNBLEtBQUEsR0FBQSxVQUFBLG9CQUFBLFdBQUEsS0FBQSxHQUFBLFVBQUE7WUFDQSxLQUFBLFdBQUEsU0FBQSxLQUFBOztVQUVBLElBQUEsU0FBQSxRQUFBLFdBQUEsR0FBQSxNQUFBLENBQUEsR0FBQSxVQUFBLGtCQUFBLFVBQUE7VUFDQSxLQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsT0FBQSxRQUFBLEtBQUE7WUFDQSxJQUFBLE9BQUEsR0FBQSxPQUFBLEdBQUEsUUFBQSxLQUFBO2NBQ0EsT0FBQSxJQUFBOzs7VUFHQSxHQUFBLFFBQUEsR0FBQSxVQUFBLGlCQUFBLFdBQUE7VUFDQSxHQUFBLGdCQUFBO2NBQ0EsTUFBQSxHQUFBLFVBQUE7Y0FDQSxNQUFBLEdBQUEsVUFBQSxpQkFBQTs7O1FBR0EsU0FBQSxRQUFBLFFBQUE7VUFDQSxJQUFBLFNBQUEsUUFBQSxXQUFBLEdBQUEsTUFBQSxDQUFBLEdBQUEsVUFBQSxrQkFBQSxVQUFBO1VBQ0EsSUFBQSxPQUFBO1VBQ0EsUUFBQSxRQUFBLFFBQUEsU0FBQSxNQUFBLElBQUE7WUFDQSxHQUFBLEtBQUEsV0FBQSxRQUFBLFFBQUE7Y0FDQSxPQUFBOzs7VUFHQSxPQUFBLEtBQUE7O1FBRUEsU0FBQSxZQUFBO09BQ0EsSUFBQSxDQUFBLEdBQUEsU0FBQTtRQUNBLE9BQUE7O09BRUEsT0FBQSxDQUFBLEdBQUEsUUFBQSxHQUFBLFdBQUEsS0FBQTtPQUNBOztNQUVBLFNBQUEsY0FBQTtPQUNBLElBQUEsQ0FBQSxHQUFBLFNBQUE7UUFDQSxPQUFBOztPQUVBLE9BQUEsR0FBQSxRQUFBLGlCQUFBLElBQUEsa0JBQUE7T0FDQTs7UUFFQSxPQUFBLE9BQUEsY0FBQSxVQUFBLEdBQUEsR0FBQTtVQUNBLElBQUEsTUFBQSxHQUFBO1lBQ0E7OztZQUdBLEdBQUEsRUFBQSxJQUFBO2NBQ0EsR0FBQSxVQUFBLE9BQUEsbUJBQUEsU0FBQSxFQUFBLEtBQUEsV0FBQTs7WUFFQTtZQUNBLGdCQUFBLEVBQUE7Ozs7Ozs7OztBQ2xFQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSxvQ0FBQSxTQUFBLFFBQUEsT0FBQTs7Ozs7O0FDSEEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsY0FBQSxVQUFBOzs7Ozs7QUNIQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSx5Q0FBQSxTQUFBLFFBQUEsYUFBQTs7RUFFQSxPQUFBLGVBQUEsVUFBQTtHQUNBLGFBQUEsS0FBQTs7O0VBR0EsT0FBQSxhQUFBLFVBQUE7R0FDQSxhQUFBLE1BQUE7Ozs7Ozs7QUNWQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSwwQkFBQSxVQUFBOzs7Ozs7QUNIQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSxZQUFBLFVBQUE7Ozs7OztBQ0hBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLDRDQUFBLFNBQUEsUUFBQSxjQUFBOztRQUVBLE9BQUEsT0FBQSxVQUFBOztZQUVBLGNBQUE7OztRQUdBLE9BQUEsT0FBQSxVQUFBO1NBQ0EsY0FBQTs7Ozs7OztBQ1hBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLDhDQUFBLFNBQUEsUUFBQSxjQUFBO1FBQ0EsT0FBQSxPQUFBLE9BQUEsUUFBQSxHQUFBO1FBQ0EsR0FBQSxPQUFBLE9BQUEsUUFBQSxHQUFBLEtBQUEsTUFBQSxPQUFBLFNBQUEsWUFBQTtVQUNBLE9BQUEsUUFBQSxHQUFBLEtBQUEsTUFBQSxPQUFBLFFBQUE7O1lBRUE7VUFDQSxHQUFBLE9BQUEsUUFBQSxHQUFBLEtBQUEsTUFBQSxPQUFBLE1BQUEsTUFBQTtZQUNBLE9BQUEsUUFBQSxPQUFBLFFBQUEsR0FBQSxLQUFBLE1BQUEsT0FBQSxNQUFBOztVQUVBLEdBQUEsT0FBQSxRQUFBLEdBQUEsS0FBQSxNQUFBLE9BQUEsTUFBQSxZQUFBO1lBQ0EsT0FBQSxjQUFBLE9BQUEsUUFBQSxHQUFBLEtBQUEsTUFBQSxPQUFBLE1BQUE7Ozs7UUFJQSxPQUFBLE9BQUEsVUFBQTtVQUNBLE9BQUEsUUFBQSxHQUFBLEtBQUEsTUFBQSxPQUFBLE1BQUEsUUFBQSxPQUFBO1VBQ0EsT0FBQSxRQUFBLEdBQUEsS0FBQSxNQUFBLE9BQUEsTUFBQSxjQUFBLE9BQUE7VUFDQSxjQUFBOzs7UUFHQSxPQUFBLE9BQUEsVUFBQTtTQUNBLGNBQUE7Ozs7Ozs7QUN4QkEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsMkNBQUEsU0FBQSxRQUFBLGNBQUE7UUFDQSxPQUFBLE9BQUEsT0FBQSxRQUFBLEdBQUEsU0FBQTtRQUNBLE9BQUEsT0FBQSxVQUFBOztZQUVBLFFBQUEsSUFBQSxPQUFBOzs7UUFHQSxPQUFBLE9BQUEsVUFBQTtTQUNBLGNBQUE7Ozs7Ozs7QUNYQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSx1REFBQSxTQUFBLFFBQUEsUUFBQSxjQUFBOztRQUVBLE9BQUEsT0FBQSxVQUFBOztZQUVBLE9BQUEsR0FBQTtZQUNBLE9BQUEsR0FBQSxPQUFBLFFBQUE7WUFDQSxjQUFBOzs7UUFHQSxPQUFBLE9BQUEsVUFBQTtTQUNBLGNBQUE7Ozs7Ozs7QUNiQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSxxREFBQSxTQUFBLFFBQUEsY0FBQTtRQUNBLE9BQUEsTUFBQSxPQUFBLFFBQUEsR0FBQSxLQUFBO1FBQ0EsT0FBQSxPQUFBLE9BQUEsUUFBQSxHQUFBOztRQUVBLE9BQUEsT0FBQSxVQUFBO1VBQ0EsY0FBQTs7O1FBR0EsT0FBQSxPQUFBLFVBQUE7U0FDQSxjQUFBOzs7UUFHQSxPQUFBLE9BQUEsUUFBQSxTQUFBLEdBQUEsRUFBQTtZQUNBLFFBQUEsSUFBQTtVQUNBLEdBQUEsTUFBQSxFQUFBO1lBQ0E7O1VBRUEsUUFBQSxRQUFBLEdBQUEsU0FBQSxNQUFBLElBQUE7WUFDQSxHQUFBLEtBQUEsTUFBQSxLQUFBLEdBQUEsT0FBQSxRQUFBLENBQUEsRUFBQSxLQUFBLE1BQUEsS0FBQSxHQUFBLE9BQUEsS0FBQTtjQUNBLEtBQUEsTUFBQSxPQUFBLE9BQUEsRUFBQTtjQUNBLE9BQUEsUUFBQSxHQUFBO2NBQ0EsT0FBQSxRQUFBLEdBQUE7OztXQUdBOzs7Ozs7QUMzQkEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxRQUFBLG9CQUFBLFlBQUEsZUFBQSxVQUFBOzs7Ozs7O0FDSEEsQ0FBQSxZQUFBO0NBQ0E7O0NBRUEsU0FBQSxjQUFBLFdBQUEsT0FBQTtFQUNBLElBQUEsWUFBQTtFQUNBLElBQUEsT0FBQSxTQUFBLGVBQUE7RUFDQSxHQUFBLFFBQUEsS0FBQTtHQUNBLFFBQUEsUUFBQSxVQUFBLEtBQUEsUUFBQSxPQUFBLCtDQUFBLFlBQUE7O0VBRUE7RUFDQSxTQUFBLFlBQUEsU0FBQSxNQUFBLE9BQUEsU0FBQTtHQUNBLFFBQUEsUUFBQSxTQUFBLGNBQUEsTUFBQSxZQUFBLEtBQUE7R0FDQSxRQUFBLFFBQUEsU0FBQSxjQUFBLE1BQUEsWUFBQSxJQUFBLFdBQUE7O0dBRUEsT0FBQSxlQUFBLE9BQUEsTUFBQTs7RUFFQSxTQUFBLGNBQUE7R0FDQSxRQUFBLFFBQUEsU0FBQSxjQUFBLE1BQUEsWUFBQSxJQUFBLFdBQUE7O0VBRUEsU0FBQSxlQUFBLE9BQUEsR0FBQSxTQUFBO0dBQ0EsSUFBQSxPQUFBLE1BQUE7R0FDQSxJQUFBLFVBQUE7R0FDQSxJQUFBLFVBQUE7R0FDQSxJQUFBLE1BQUEsUUFBQSxLQUFBLE9BQUE7R0FDQSxJQUFBLFFBQUEsT0FBQTtHQUNBLElBQUEsTUFBQSxRQUFBLFFBQUEsU0FBQSxjQUFBLE9BQUE7R0FDQSxJQUFBLE1BQUEsU0FBQSxjQUFBLE1BQUE7R0FDQSxJQUFBLFFBQUEsSUFBQSx3QkFBQSxNQUFBLEVBQUEsSUFBQSxNQUFBO0dBQ0EsSUFBQSxTQUFBLElBQUEsd0JBQUEsT0FBQSxFQUFBLElBQUEsRUFBQSxTQUFBO0dBQ0EsT0FBQSxRQUFBLFFBQUEsU0FBQSxjQUFBLE9BQUEsSUFBQSxPQUFBLFFBQUEsTUFBQSxJQUFBLFFBQUEsU0FBQTs7RUFFQSxPQUFBO0dBQ0EsYUFBQTtHQUNBLGFBQUE7R0FDQSxnQkFBQTs7O0NBR0EsUUFBQSxPQUFBLGtCQUFBLFVBQUEsd0NBQUEsVUFBQSxVQUFBLGNBQUE7RUFDQSxJQUFBO0VBQ0EsV0FBQSxZQUFBO0dBQ0EsT0FBQTtJQUNBLE9BQUE7SUFDQSxRQUFBO0lBQ0EsZ0JBQUE7SUFDQSxXQUFBO0lBQ0EsS0FBQTtJQUNBLE9BQUE7SUFDQSxRQUFBO0lBQ0EsU0FBQTtJQUNBLFNBQUE7SUFDQSxRQUFBO0lBQ0EsWUFBQSxHQUFBLE1BQUEsVUFBQSxPQUFBLENBQUEsTUFBQSxPQUFBLE1BQUEsQ0FBQSxXQUFBO0lBQ0EsWUFBQTtJQUNBLGNBQUE7SUFDQSxVQUFBO0lBQ0EsU0FBQSxjQUFBLG1CQUFBOzs7RUFHQSxPQUFBO0dBQ0EsVUFBQTtHQUNBLE9BQUE7SUFDQSxXQUFBO0lBQ0EsV0FBQTtJQUNBLFNBQUE7SUFDQSxZQUFBO0lBQ0EsU0FBQTtJQUNBLFNBQUE7O0dBRUEsU0FBQTtHQUNBLE1BQUEsVUFBQSxPQUFBLE1BQUEsT0FBQSxTQUFBO0lBQ0EsSUFBQSxVQUFBLFFBQUEsT0FBQSxZQUFBO0lBQ0EsSUFBQSxRQUFBO0tBQ0EsUUFBQTtLQUNBLFNBQUE7S0FDQSxTQUFBOztJQUVBLElBQUEsYUFBQSxHQUFBLElBQUEsTUFBQSxXQUFBLFVBQUEsR0FBQTtLQUNBLE9BQUEsU0FBQSxFQUFBOzs7SUFHQSxRQUFBLGVBQUEsR0FBQSxNQUFBLE1BQUEsU0FBQSxLQUFBLE9BQUEsQ0FBQSxHQUFBLGFBQUEsTUFBQSxDQUFBLEdBQUE7SUFDQSxRQUFBLFNBQUE7S0FDQSxHQUFBLFFBQUEsUUFBQTtLQUNBLEdBQUEsUUFBQSxTQUFBOztJQUVBLFFBQUEsY0FBQTtLQUNBLE1BQUE7TUFDQSxHQUFBLFFBQUEsUUFBQTtNQUNBLEdBQUEsUUFBQSxVQUFBO01BQ0EsUUFBQTs7S0FFQSxNQUFBO01BQ0EsR0FBQSxRQUFBLFFBQUE7TUFDQSxHQUFBLFFBQUEsVUFBQTtNQUNBLFFBQUE7Ozs7SUFJQSxJQUFBLGVBQUEsWUFBQTtLQUNBLEdBQUEsTUFBQSxRQUFBLFNBQUEsVUFBQSxLQUFBLE1BQUEsUUFBQSxTQUFBLEdBQUEsU0FBQSxTQUFBLEVBQUE7TUFDQSxRQUFBLFFBQUEsTUFBQSxRQUFBLFVBQUEsVUFBQSxPQUFBO09BQ0EsSUFBQSxJQUFBO1FBQ0EsTUFBQSxNQUFBO1FBQ0EsTUFBQSxNQUFBO1FBQ0EsT0FBQSxNQUFBLFlBQUEsVUFBQSxFQUFBO1FBQ0EsT0FBQSxNQUFBO1FBQ0EsTUFBQSxNQUFBO1FBQ0EsU0FBQSxhQUFBLFdBQUEsTUFBQTtRQUNBLE1BQUE7UUFDQSxTQUFBLE1BQUE7O09BRUEsT0FBQSxLQUFBOztPQUVBLFFBQUEsUUFBQSxNQUFBLFVBQUEsVUFBQSxNQUFBOztRQUVBLElBQUEsTUFBQSxVQUFBLEtBQUEsY0FBQTtTQUNBLElBQUEsT0FBQTtVQUNBLE1BQUEsS0FBQTtVQUNBLFFBQUEsTUFBQSxVQUFBLEtBQUEsZUFBQSxNQUFBO1VBQ0EsT0FBQSxNQUFBLFVBQUEsS0FBQSxlQUFBLE1BQUE7VUFDQSxNQUFBLEtBQUE7VUFDQSxPQUFBLEtBQUEsWUFBQSxVQUFBLEVBQUE7VUFDQSxHQUFBLFFBQUEsT0FBQTtVQUNBLEdBQUEsUUFBQSxPQUFBO1VBQ0EsT0FBQSxLQUFBO1VBQ0EsTUFBQSxLQUFBO1VBQ0EsU0FBQSxhQUFBLFdBQUEsS0FBQTtVQUNBLE1BQUE7VUFDQSxTQUFBOztTQUVBLE1BQUEsS0FBQTs7OztNQUlBOztTQUVBO01BQ0EsSUFBQSxJQUFBO09BQ0EsTUFBQSxNQUFBLFFBQUE7T0FDQSxNQUFBLE1BQUEsUUFBQTtPQUNBLE9BQUEsTUFBQSxRQUFBLFlBQUEsVUFBQSxFQUFBO09BQ0EsT0FBQSxNQUFBLFFBQUE7T0FDQSxNQUFBLE1BQUEsUUFBQTtPQUNBLFNBQUEsTUFBQSxRQUFBO09BQ0EsTUFBQSxNQUFBLFFBQUE7T0FDQSxVQUFBLE1BQUEsUUFBQTs7TUFFQSxPQUFBLEtBQUE7TUFDQSxRQUFBLFFBQUEsTUFBQSxRQUFBLFVBQUEsVUFBQSxNQUFBOztPQUVBLElBQUEsTUFBQSxVQUFBLEtBQUEsY0FBQTtRQUNBLElBQUEsT0FBQTtTQUNBLE1BQUEsS0FBQTtTQUNBLFFBQUEsTUFBQSxVQUFBLEtBQUEsZUFBQSxNQUFBO1NBQ0EsT0FBQSxNQUFBLFVBQUEsS0FBQSxlQUFBLE1BQUE7U0FDQSxNQUFBLEtBQUE7U0FDQSxPQUFBLEtBQUEsWUFBQSxVQUFBLEVBQUE7U0FDQSxHQUFBLFFBQUEsT0FBQTtTQUNBLEdBQUEsUUFBQSxPQUFBO1NBQ0EsT0FBQSxLQUFBO1NBQ0EsTUFBQSxLQUFBO1NBQ0EsU0FBQSxhQUFBLFdBQUEsS0FBQTtTQUNBLE1BQUE7U0FDQSxTQUFBOztRQUVBLE1BQUEsS0FBQTs7Ozs7SUFLQSxJQUFBLGNBQUEsVUFBQTs7S0FFQSxRQUFBO0tBQ0EsU0FBQTs7SUFFQSxJQUFBLGdCQUFBLFVBQUE7S0FDQSxTQUFBO0tBQ0EsSUFBQSxRQUFBO0tBQ0EsUUFBQSxRQUFBLE9BQUEsU0FBQSxLQUFBO09BQ0EsSUFBQSxTQUFBO09BQ0EsSUFBQSxRQUFBO09BQ0EsUUFBQSxRQUFBLFFBQUEsU0FBQSxPQUFBLE1BQUE7UUFDQSxHQUFBLEtBQUEsU0FBQSxNQUFBO1NBQ0EsU0FBQTs7O09BR0EsR0FBQSxDQUFBLE9BQUE7UUFDQTtRQUNBLE9BQUEsS0FBQSxTQUFBO1NBQ0EsR0FBQSxRQUFBLFFBQUE7U0FDQSxHQUFBLFFBQUEsU0FBQSxLQUFBLElBQUE7U0FDQSxRQUFBOzs7Ozs7SUFNQSxJQUFBLGFBQUEsWUFBQTtLQUNBLFFBQUEsUUFBQSxNQUFBLEtBQUE7S0FDQSxRQUFBLE1BQUEsR0FBQSxPQUFBLEtBQUEsSUFBQSxPQUFBLE9BQUEsS0FBQSxTQUFBLFFBQUEsT0FBQSxLQUFBLFVBQUEsUUFBQSxRQUFBLEtBQUEsTUFBQTs7S0FFQSxJQUFBLENBQUEsUUFBQSxTQUFBO01BQ0EsSUFBQSxLQUFBLEtBQUE7TUFDQSxHQUFBLE9BQUEsVUFBQSxFQUFBO09BQ0EsSUFBQSxTQUFBLEdBQUEsSUFBQTtTQUNBLFlBQUE7U0FDQSxZQUFBO1NBQ0EsV0FBQSxDQUFBLE1BQUEsS0FBQTtTQUNBLFNBQUEsTUFBQSxLQUFBO09BQ0EsSUFBQSxZQUFBLEdBQUEsSUFBQTtTQUNBLFlBQUE7U0FDQSxZQUFBO1NBQ0EsV0FBQSxNQUFBLEtBQUE7U0FDQSxTQUFBLE9BQUEsS0FBQTs7T0FFQSxRQUFBLFNBQUEsUUFBQSxJQUFBLE9BQUE7U0FDQSxLQUFBLEtBQUE7U0FDQSxLQUFBLFFBQUE7U0FDQSxLQUFBLE1BQUE7U0FDQSxLQUFBLGFBQUEsY0FBQSxRQUFBLE1BQUEsR0FBQSxLQUFBLFFBQUEsT0FBQSxJQUFBLFFBQUEsT0FBQSxJQUFBO09BQ0EsUUFBQSxZQUFBLFFBQUEsSUFBQSxPQUFBO1NBQ0EsS0FBQSxLQUFBO1NBQ0EsS0FBQSxNQUFBO1NBQ0EsS0FBQSxRQUFBO1NBQ0EsS0FBQSxhQUFBLGNBQUEsUUFBQSxNQUFBLEdBQUEsS0FBQSxRQUFBLE9BQUEsR0FBQTs7VUFFQTtPQUNBLElBQUEsTUFBQSxHQUFBLElBQUE7U0FDQSxZQUFBLFFBQUEsTUFBQSxJQUFBO1NBQ0EsWUFBQSxRQUFBLE1BQUE7U0FDQSxXQUFBLEtBQUEsS0FBQTtTQUNBLFNBQUEsT0FBQSxLQUFBOzs7T0FHQSxRQUFBLE1BQUEsUUFBQSxJQUFBLE9BQUE7U0FDQSxLQUFBLEtBQUE7U0FDQSxLQUFBLFFBQUEsT0FBQSxHQUFBO1NBQ0EsS0FBQSxNQUFBO1NBQ0EsS0FBQSxhQUFBLGNBQUEsUUFBQSxNQUFBLEdBQUEsS0FBQSxRQUFBLE9BQUEsR0FBQTs7OztJQUlBLEdBQUEsUUFBQSxVQUFBLFFBQUEsT0FBQSxVQUFBLEVBQUE7TUFDQSxJQUFBLGFBQUEsUUFBQSxJQUFBLFVBQUEsZUFBQSxLQUFBLFFBQUEsUUFBQSxPQUFBO1FBQ0EsS0FBQSxTQUFBO1FBQ0EsS0FBQSxRQUFBLFNBQUEsRUFBQTtRQUNBLE9BQUEsRUFBQTs7Ozs7Ozs7UUFRQSxLQUFBLEtBQUE7UUFDQSxNQUFBLGFBQUE7UUFDQSxNQUFBLFVBQUE7O1FBRUEsS0FBQSxTQUFBLFFBQUE7UUFDQSxLQUFBLGVBQUE7UUFDQSxHQUFBLFNBQUEsU0FBQSxFQUFBO1FBQ0EsUUFBQSxjQUFBLEVBQUE7UUFDQSxRQUFBOztRQUVBLEtBQUEsS0FBQSxTQUFBLEVBQUE7UUFDQSxJQUFBLFFBQUEsT0FBQSxRQUFBO1FBQ0EsR0FBQSxTQUFBLEVBQUE7U0FDQSxPQUFBOztZQUVBO1NBQ0EsT0FBQSxRQUFBLFNBQUE7OztRQUdBLEtBQUEsU0FBQSxFQUFBO1FBQ0EsT0FBQSxFQUFBOzs7O0tBSUEsUUFBQSxhQUFBLFFBQUEsSUFBQSxVQUFBLFVBQUEsS0FBQSxPQUFBLFFBQUEsT0FBQSxLQUFBLEtBQUEsYUFBQSxnQkFBQSxRQUFBLFFBQUEsS0FBQSxPQUFBLFFBQUEsU0FBQSxLQUFBLEtBQUEsS0FBQSxTQUFBOzs7Ozs7S0FNQSxRQUFBLFVBQUEsUUFBQSxXQUFBLE9BQUEsVUFBQSxLQUFBLEtBQUEsR0FBQSxLQUFBLFNBQUEsVUFBQSxHQUFBO01BQ0EsT0FBQSxFQUFBLFNBQUEsUUFBQSxXQUFBLEVBQUE7U0FDQSxLQUFBLGdCQUFBLEdBQUEsS0FBQSxVQUFBLFVBQUEsR0FBQTtNQUNBLE9BQUEsR0FBQSxJQUFBLFFBQUEsV0FBQSxFQUFBLFFBQUE7UUFDQSxLQUFBLE1BQUEsVUFBQSxHQUFBO01BQ0EsT0FBQSxZQUFBLEVBQUE7O0tBRUEsUUFBQSxRQUFBLFFBQUEsV0FBQSxPQUFBO09BQ0EsS0FBQSxlQUFBO09BQ0EsS0FBQSxhQUFBLFVBQUEsR0FBQTs7O09BR0EsS0FBQSxlQUFBO09BQ0EsS0FBQSxRQUFBLFNBQUEsRUFBQTtPQUNBLE9BQUEsRUFBQSxVQUFBLFNBQUEsRUFBQTs7T0FFQSxLQUFBLFVBQUEsR0FBQTtPQUNBLE9BQUEsRUFBQSxXQUFBOztLQUVBLFFBQUEsTUFBQSxHQUFBLGFBQUEsVUFBQSxHQUFBLEdBQUE7TUFDQSxPQUFBLGFBQUEsR0FBQSxHQUFBO1FBQ0EsR0FBQSxZQUFBLFVBQUEsR0FBQSxHQUFBO01BQ0EsT0FBQSxhQUFBLEdBQUEsR0FBQTtRQUNBLEdBQUEsU0FBQSxVQUFBLEdBQUEsR0FBQTs7TUFFQSxRQUFBLGNBQUEsRUFBQTtNQUNBLFFBQUE7O0tBRUEsUUFBQSxRQUFBLGFBQUEsU0FBQSxRQUFBLFVBQUEsS0FBQSxLQUFBLFVBQUEsR0FBQTtNQUNBLE9BQUEsRUFBQTs7S0FFQSxRQUFBLE1BQUEsYUFBQSxTQUFBLFFBQUEsVUFBQSxLQUFBLGFBQUEsVUFBQSxHQUFBO01BQ0EsT0FBQSxFQUFBLFNBQUEsT0FBQTtRQUNBLEtBQUEsS0FBQSxVQUFBLEdBQUE7TUFDQSxPQUFBLEVBQUEsU0FBQSxNQUFBOzs7SUFHQSxJQUFBLGFBQUEsWUFBQTs7S0FFQSxNQUFBLFFBQUEsVUFBQSxHQUFBLEdBQUE7TUFDQSxRQUFBLFFBQUEsYUFBQSxTQUFBLFFBQUEsVUFBQSxNQUFBLElBQUEsUUFBQTtRQUNBLEtBQUEsS0FBQSxVQUFBLEdBQUE7UUFDQSxFQUFBLFNBQUEsRUFBQSxRQUFBLE1BQUEsVUFBQSxFQUFBLFFBQUEsTUFBQTs7UUFFQSxPQUFBLE1BQUEsVUFBQSxFQUFBLFFBQUEsTUFBQTs7TUFFQSxRQUFBLE1BQUEsYUFBQSxTQUFBLFFBQUEsVUFBQSxNQUFBLElBQUEsUUFBQTtRQUNBLEtBQUEsYUFBQSxVQUFBLEdBQUE7UUFDQSxPQUFBLENBQUEsTUFBQSxVQUFBLEVBQUEsUUFBQSxNQUFBLGNBQUEsT0FBQTs7UUFFQSxLQUFBLEtBQUEsVUFBQSxHQUFBO1FBQ0EsT0FBQSxDQUFBLE1BQUEsVUFBQSxFQUFBLFFBQUEsTUFBQSxjQUFBLE1BQUE7Ozs7SUFJQSxJQUFBLFNBQUEsVUFBQSxHQUFBO0tBQ0EsT0FBQSxDQUFBLEtBQUEsSUFBQSxFQUFBLFFBQUEsT0FBQTs7SUFFQSxJQUFBLFFBQUEsWUFBQTtLQUNBLE9BQUEsUUFBQSxRQUFBLEdBQUEsT0FBQSxRQUFBLE1BQUEsT0FBQSxLQUFBLENBQUEsUUFBQSxPQUFBLFFBQUEsU0FBQSxNQUFBOztJQUVBLElBQUEsb0JBQUEsWUFBQTtLQUNBLFFBQUEsTUFBQSxRQUFBLFFBQUEsZ0JBQUEsT0FBQSxRQUFBLFNBQUEsTUFBQSxHQUFBLFFBQUEsVUFBQSxHQUFBO01BQ0EsUUFBQSxXQUFBLEtBQUEsb0JBQUEsRUFBQSxRQUFBLEtBQUEsYUFBQSxVQUFBLEdBQUE7T0FDQSxPQUFBLGVBQUEsRUFBQSxJQUFBLE1BQUEsRUFBQSxJQUFBOzs7S0FHQSxRQUFBLE1BQUE7O0lBRUEsSUFBQSxpQkFBQSxZQUFBO0tBQ0EsUUFBQSxNQUFBLFFBQUEsUUFBQSxnQkFBQSxPQUFBLFFBQUEsU0FBQSxLQUFBLEdBQUEsUUFBQSxVQUFBLEdBQUE7TUFDQSxRQUFBLFdBQUEsS0FBQSxpQkFBQSxFQUFBLFFBQUEsS0FBQSxhQUFBLFVBQUEsR0FBQTtPQUNBLE9BQUEsZUFBQSxFQUFBLElBQUEsTUFBQSxFQUFBLElBQUE7OztLQUdBLFFBQUEsTUFBQTs7SUFFQSxJQUFBLHNCQUFBLFVBQUEsT0FBQTtLQUNBLE9BQUEsQ0FBQSxVQUFBLE9BQUE7TUFDQSxPQUFBLFVBQUEsR0FBQTtPQUNBLEVBQUEsSUFBQSxFQUFBLElBQUEsQ0FBQSxRQUFBLE1BQUEsSUFBQSxFQUFBLE1BQUEsUUFBQSxTQUFBLFFBQUEsT0FBQTtPQUNBLEVBQUEsSUFBQSxFQUFBLElBQUEsQ0FBQSxRQUFBLE9BQUEsSUFBQSxFQUFBLE1BQUEsUUFBQSxTQUFBLFFBQUEsUUFBQTs7UUFFQTs7SUFFQSxJQUFBLG1CQUFBLFVBQUEsT0FBQTtLQUNBLE9BQUEsQ0FBQSxVQUFBLE9BQUE7TUFDQSxPQUFBLFVBQUEsR0FBQTtPQUNBLEVBQUEsSUFBQSxFQUFBLElBQUEsQ0FBQSxRQUFBLE9BQUEsSUFBQSxFQUFBLE1BQUEsUUFBQSxTQUFBLFFBQUEsUUFBQTtPQUNBLEVBQUEsSUFBQSxFQUFBLElBQUEsQ0FBQSxNQUFBLEVBQUEsTUFBQSxRQUFBLFNBQUEsUUFBQSxRQUFBOztRQUVBOztJQUVBLElBQUEsbUJBQUEsVUFBQSxPQUFBO0tBQ0EsT0FBQSxDQUFBLFVBQUEsT0FBQTtNQUNBLE9BQUEsVUFBQSxHQUFBO09BQ0EsSUFBQTtPQUNBLFNBQUEsUUFBQSxZQUFBLEVBQUE7T0FDQSxFQUFBLElBQUEsRUFBQSxJQUFBLENBQUEsT0FBQSxJQUFBLEVBQUEsTUFBQSxPQUFBLFNBQUEsUUFBQSxRQUFBO09BQ0EsT0FBQSxFQUFBLElBQUEsRUFBQSxJQUFBLENBQUEsT0FBQSxJQUFBLEVBQUEsTUFBQSxPQUFBLFNBQUEsUUFBQSxRQUFBOztRQUVBOztJQUVBLElBQUEsZUFBQSxVQUFBLE1BQUEsR0FBQSxTQUFBO0tBQ0EsSUFBQTtLQUNBLFVBQUEsMkJBQUEsS0FBQSxPQUFBO0tBQ0EsUUFBQSxRQUFBLEtBQUEsS0FBQSxVQUFBLFVBQUEsTUFBQTtNQUNBLFdBQUEseUNBQUEsS0FBQSxTQUFBLEtBQUEsU0FBQSxVQUFBLEtBQUEsU0FBQTs7S0FFQSxTQUFBLFFBQUEsUUFBQSxZQUFBLFNBQUEsTUFBQSxHQUFBLE9BQUEsTUFBQSxZQUFBOzs7SUFHQSxJQUFBLGVBQUEsVUFBQSxNQUFBLEdBQUEsU0FBQTtLQUNBLE9BQUEsUUFBQSxRQUFBOzs7SUFHQSxNQUFBLE9BQUEsYUFBQSxVQUFBLE1BQUEsU0FBQTtLQUNBLFFBQUEsUUFBQTs7S0FFQSxJQUFBLFFBQUEsV0FBQSxNQUFBO01BQ0E7TUFDQTtNQUNBO1lBQ0E7TUFDQTs7S0FFQSxHQUFBLE9BQUEsVUFBQSxLQUFBLFFBQUEsVUFBQSxLQUFBO09BQ0E7O1NBRUE7T0FDQTs7OztJQUlBLE1BQUEsT0FBQSxXQUFBLFVBQUEsR0FBQSxHQUFBO0tBQ0EsR0FBQSxNQUFBLEVBQUE7TUFDQTs7S0FFQSxHQUFBLE9BQUEsRUFBQSxHQUFBLFlBQUEsWUFBQTtNQUNBLFFBQUEsUUFBQTtNQUNBO01BQ0E7TUFDQTtNQUNBOztNQUVBLEdBQUEsT0FBQSxVQUFBLEtBQUEsUUFBQSxVQUFBLEtBQUE7UUFDQTtRQUNBLFFBQUEsSUFBQTs7VUFFQTtRQUNBOzs7O0lBSUEsTUFBQSxPQUFBLGFBQUEsVUFBQSxNQUFBLE1BQUE7S0FDQSxJQUFBLFNBQUEsTUFBQTtNQUNBOztLQUVBLElBQUEsUUFBQSxPQUFBO01BQ0E7WUFDQTtNQUNBOzs7Ozs7OztBQzdiQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLFFBQUEsb0JBQUEsWUFBQSxtQkFBQSxVQUFBOzs7Ozs7QUNIQSxDQUFBLFdBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsa0JBQUEsVUFBQSw0QkFBQSxTQUFBLFVBQUE7RUFDQSxJQUFBLFdBQUEsV0FBQTtHQUNBLE9BQUE7SUFDQSxPQUFBO0lBQ0EsUUFBQTtJQUNBLE9BQUE7SUFDQSxNQUFBO0lBQ0EsT0FBQTs7O0VBR0EsT0FBQTtHQUNBLFVBQUE7R0FDQSxZQUFBO0dBQ0EsT0FBQTtJQUNBLFNBQUE7O0dBRUEsU0FBQTtHQUNBLE1BQUEsU0FBQSxRQUFBLFNBQUEsUUFBQSxTQUFBOzs7SUFHQSxPQUFBLFVBQUEsUUFBQSxPQUFBLFlBQUEsT0FBQTs7O0lBR0EsSUFBQSxTQUFBLEdBQUEsTUFBQTtNQUNBLE9BQUEsQ0FBQSxHQUFBLE9BQUEsUUFBQTtNQUNBLE1BQUEsQ0FBQSxHQUFBO01BQ0EsTUFBQTs7O0lBR0EsSUFBQSxNQUFBLEdBQUEsT0FBQSxRQUFBLElBQUEsT0FBQTtNQUNBLEtBQUEsU0FBQSxPQUFBLFFBQUE7TUFDQSxLQUFBLFVBQUEsT0FBQSxRQUFBO01BQ0EsT0FBQTtJQUNBLElBQUEsWUFBQSxJQUFBLE9BQUE7TUFDQSxLQUFBLGFBQUEsZUFBQSxPQUFBLFFBQUEsUUFBQSxJQUFBLE1BQUEsT0FBQSxRQUFBLFNBQUEsSUFBQTtJQUNBLElBQUEsYUFBQSxVQUFBLE9BQUE7TUFDQSxLQUFBLEtBQUEsT0FBQSxRQUFBLFFBQUEsSUFBQTtNQUNBLEtBQUEsZ0JBQUE7TUFDQSxLQUFBLFVBQUEsT0FBQSxRQUFBO01BQ0EsTUFBQSxXQUFBO01BQ0EsS0FBQSxRQUFBO0lBQ0EsSUFBQSxNQUFBLEdBQUEsSUFBQTtNQUNBLFdBQUE7TUFDQSxZQUFBLFNBQUEsR0FBQTtNQUNBLE9BQUEsT0FBQSxRQUFBLFFBQUEsSUFBQTs7TUFFQSxZQUFBLFNBQUEsR0FBQTtNQUNBLE9BQUEsT0FBQSxRQUFBLFFBQUE7O0lBRUEsSUFBQSxjQUFBLFVBQUEsT0FBQTtNQUNBLE1BQUE7TUFDQSxVQUFBLElBQUEsS0FBQSxLQUFBOztNQUVBLE1BQUEsUUFBQSxPQUFBLFFBQUE7TUFDQSxLQUFBLEtBQUE7SUFDQSxJQUFBLE9BQUEsVUFBQSxVQUFBO01BQ0EsS0FBQSxDQUFBO01BQ0E7TUFDQSxPQUFBO01BQ0EsS0FBQSxTQUFBLEdBQUE7TUFDQSxPQUFBLE9BQUE7O09BRUEsTUFBQSxRQUFBLE9BQUEsUUFBQTtNQUNBLE1BQUEsZUFBQTtNQUNBLEtBQUEsZUFBQTtNQUNBLEtBQUEsS0FBQTs7O0lBR0EsU0FBQSxVQUFBLFFBQUE7S0FDQSxZQUFBO09BQ0EsU0FBQTtPQUNBLEtBQUEsVUFBQSxPQUFBLFVBQUEsSUFBQSxLQUFBO0tBQ0EsS0FBQSxhQUFBLFNBQUEsS0FBQSxNQUFBLFFBQUEsU0FBQSxHQUFBO01BQ0EsSUFBQSxPQUFBLEtBQUEsWUFBQSxNQUFBO01BQ0EsSUFBQSxJQUFBLEdBQUEsWUFBQSxTQUFBLEtBQUEsS0FBQTtNQUNBLE9BQUEsU0FBQSxHQUFBO09BQ0EsS0FBQSxlQUFBLFFBQUEsS0FBQSxNQUFBLEVBQUEsS0FBQSxLQUFBOzs7Ozs7SUFNQSxTQUFBLFNBQUEsWUFBQSxVQUFBOztLQUVBLFdBQUEsVUFBQSxLQUFBLFNBQUEsR0FBQTtNQUNBLElBQUEsY0FBQSxHQUFBLFlBQUEsRUFBQSxVQUFBO01BQ0EsT0FBQSxTQUFBLEdBQUE7T0FDQSxFQUFBLFdBQUEsWUFBQTtPQUNBLE9BQUEsSUFBQTs7OztJQUlBLE9BQUEsT0FBQSxVQUFBLFNBQUEsR0FBQSxFQUFBO01BQ0EsR0FBQSxNQUFBLEVBQUE7T0FDQTs7TUFFQSxXQUFBLE1BQUEsVUFBQSxFQUFBO01BQ0EsWUFBQSxNQUFBLFFBQUEsRUFBQTtNQUNBLEtBQUEsTUFBQSxRQUFBLEVBQUE7TUFDQSxTQUFBLFVBQUE7T0FDQSxVQUFBLFFBQUEsWUFBQSxFQUFBOzs7O0lBSUEsT0FBQTtLQUNBLFdBQUE7TUFDQSxPQUFBLFFBQUE7O0tBRUEsU0FBQSxHQUFBLEdBQUE7O01BRUEsSUFBQSxDQUFBLEVBQUE7T0FDQSxJQUFBO09BQ0EsRUFBQSxPQUFBLFFBQUEsU0FBQSxPQUFBLFFBQUE7O01BRUEsU0FBQSxVQUFBO09BQ0EsVUFBQSxFQUFBLE9BQUEsUUFBQTs7Ozs7Ozs7OztBQ3RIQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsa0JBQUEsV0FBQSxXQUFBLFdBQUE7RUFDQSxJQUFBLFdBQUEsVUFBQTtHQUNBLE9BQUE7SUFDQSxPQUFBO0lBQ0EsT0FBQTs7O0VBR0EsT0FBQTtHQUNBLFVBQUE7R0FDQSxhQUFBO0dBQ0EsWUFBQTtHQUNBLE1BQUE7SUFDQSxRQUFBO0lBQ0EsV0FBQTs7R0FFQSxNQUFBLFVBQUEsUUFBQSxTQUFBLFFBQUEsUUFBQTtLQUNBLElBQUEsVUFBQSxRQUFBLE9BQUEsWUFBQSxPQUFBOzs7Ozs7OztBQ25CQSxDQUFBLFlBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSwwQkFBQSxVQUFBLFFBQUE7RUFDQSxPQUFBLFVBQUE7RUFDQTs7RUFFQSxTQUFBLFVBQUE7R0FDQSxPQUFBO0dBQ0EsT0FBQSxPQUFBLFdBQUEsU0FBQSxFQUFBLEVBQUE7SUFDQSxHQUFBLE1BQUEsRUFBQTtLQUNBOztJQUVBLE9BQUE7OztFQUdBLFNBQUEsU0FBQTtHQUNBLE9BQUEsVUFBQTtJQUNBLGFBQUE7SUFDQSxNQUFBLENBQUE7S0FDQSxRQUFBO01BQ0EsR0FBQTtNQUNBLEdBQUE7O0tBRUEsT0FBQTtLQUNBLE9BQUE7O0lBRUEsT0FBQSxDQUFBO0tBQ0EsUUFBQTtNQUNBLEdBQUE7TUFDQSxHQUFBLE9BQUEsUUFBQTs7S0FFQSxPQUFBO0tBQ0EsT0FBQSxPQUFBLFFBQUE7Ozs7Ozs7O0FDakNBLENBQUEsWUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxrQkFBQSxVQUFBLHVCQUFBLFVBQUEsVUFBQTtFQUNBLElBQUEsV0FBQSxZQUFBO0dBQ0EsT0FBQTtJQUNBLElBQUE7SUFDQSxPQUFBO0lBQ0EsUUFBQTtJQUNBLE1BQUE7SUFDQSxPQUFBO0lBQ0EsVUFBQTtJQUNBLFFBQUE7S0FDQSxNQUFBO0tBQ0EsT0FBQTtLQUNBLEtBQUE7S0FDQSxRQUFBOztJQUVBLFFBQUEsRUFBQTtLQUNBLFVBQUE7S0FDQSxPQUFBO0tBQ0EsU0FBQTtPQUNBO0tBQ0EsVUFBQTtLQUNBLE9BQUE7S0FDQSxTQUFBO01BQ0E7S0FDQSxVQUFBO0tBQ0EsT0FBQTtLQUNBLFNBQUE7Ozs7RUFJQSxPQUFBO0dBQ0EsVUFBQTtHQUNBLE9BQUE7SUFDQSxNQUFBO0lBQ0EsU0FBQTs7R0FFQSxTQUFBO0dBQ0EsTUFBQSxVQUFBLFFBQUEsU0FBQSxRQUFBLFNBQUE7O0lBRUEsSUFBQSxVQUFBLFFBQUEsT0FBQSxZQUFBO0lBQ0EsVUFBQSxRQUFBLE9BQUEsU0FBQSxPQUFBO0lBQ0EsUUFBQSxTQUFBLElBQUEsT0FBQTtJQUNBLEdBQUEsUUFBQSxNQUFBO0tBQ0EsUUFBQSxPQUFBLEdBQUEsUUFBQSxRQUFBOztJQUVBLFFBQUEsSUFBQSxVQUFBLFFBQUEsU0FBQSxNQUFBLElBQUEsaUJBQUEsUUFBQSxTQUFBLElBQUE7SUFDQSxJQUFBLElBQUEsR0FBQSxNQUFBO01BQ0EsT0FBQSxDQUFBLEdBQUE7TUFDQSxNQUFBLENBQUEsUUFBQSxPQUFBLE1BQUEsUUFBQSxRQUFBLFFBQUEsT0FBQTtNQUNBLE1BQUE7O0lBRUEsSUFBQSxRQUFBLEdBQUEsSUFBQTtNQUNBLEVBQUE7TUFDQSxPQUFBLENBQUEsR0FBQTtNQUNBLEdBQUEsU0FBQTtNQUNBLEdBQUEsWUFBQTs7SUFFQSxJQUFBLE1BQUEsR0FBQSxPQUFBLFFBQUEsSUFBQSxPQUFBO01BQ0EsS0FBQSxTQUFBLFFBQUE7TUFDQSxLQUFBLFVBQUEsUUFBQTtNQUNBLE9BQUE7O0lBRUEsSUFBQSxXQUFBLElBQUEsT0FBQTtNQUNBLE9BQUE7TUFDQSxLQUFBLE1BQUEsUUFBQSxNQUFBLFFBQUE7TUFDQSxLQUFBLE1BQUE7TUFDQSxLQUFBLE1BQUE7TUFDQSxLQUFBLE1BQUE7TUFDQSxLQUFBLE1BQUE7TUFDQSxLQUFBLGdCQUFBO0lBQ0EsUUFBQSxRQUFBLFFBQUEsUUFBQSxVQUFBLE9BQUE7S0FDQSxTQUFBLE9BQUE7T0FDQSxLQUFBLFVBQUEsTUFBQSxXQUFBO09BQ0EsS0FBQSxjQUFBLE1BQUE7T0FDQSxLQUFBLGdCQUFBLE1BQUE7O0lBRUEsSUFBQSxPQUFBLElBQUEsT0FBQTtNQUNBLEtBQUEsU0FBQSxRQUFBO01BQ0EsS0FBQSxVQUFBLFFBQUE7TUFDQSxNQUFBLFFBQUEsV0FBQSxRQUFBLE1BQUEsUUFBQSxTQUFBO0lBQ0EsSUFBQSxTQUFBLElBQUEsT0FBQSxLQUFBLEtBQUEsYUFBQSxlQUFBLFFBQUEsU0FBQSxJQUFBLE9BQUEsUUFBQSxTQUFBLElBQUE7TUFDQSxLQUFBLFNBQUE7O0lBRUEsSUFBQSxRQUFBLFNBQUEsTUFBQTtLQUNBLE9BQUEsT0FBQTtPQUNBLEtBQUEsS0FBQSxRQUFBLFNBQUE7S0FDQSxPQUFBLE9BQUE7T0FDQSxLQUFBO09BQ0EsTUFBQSxhQUFBLFFBQUEsT0FBQTtPQUNBLEtBQUEsZUFBQTtPQUNBLEtBQUEsS0FBQTtLQUNBLElBQUEsVUFBQSxJQUFBLE9BQUEsS0FBQSxLQUFBLGFBQUEsZ0JBQUEsUUFBQSxTQUFBLFFBQUEsU0FBQSxNQUFBLE9BQUEsUUFBQSxTQUFBLElBQUE7T0FDQSxLQUFBLFNBQUE7S0FDQSxRQUFBLE9BQUE7T0FDQSxLQUFBLEtBQUEsUUFBQSxTQUFBO0tBQ0EsUUFBQSxPQUFBO09BQ0EsS0FBQTtPQUNBLE1BQUEsYUFBQSxRQUFBLE9BQUE7T0FDQSxLQUFBLGVBQUE7T0FDQSxLQUFBLEtBQUE7O0lBRUEsSUFBQSxTQUFBLElBQUEsT0FBQTtNQUNBLEtBQUEsU0FBQTtJQUNBLEdBQUEsUUFBQSxZQUFBLEtBQUE7S0FDQSxPQUFBLEtBQUE7OztJQUdBLE9BQUEsT0FBQTtNQUNBLEtBQUEsVUFBQSxRQUFBOztJQUVBLElBQUEsUUFBQSxTQUFBLE1BQUE7SUFDQSxPQUFBLE9BQUE7TUFDQSxLQUFBLE1BQUEsUUFBQSxRQUFBO01BQ0EsS0FBQSxNQUFBO01BQ0EsS0FBQSxNQUFBLFFBQUEsUUFBQTtNQUNBLEtBQUEsTUFBQSxRQUFBO01BQ0EsS0FBQSxvQkFBQTtNQUNBLEtBQUEsZ0JBQUE7TUFDQSxLQUFBLFVBQUE7O0lBRUEsSUFBQSxhQUFBLE9BQUEsT0FBQTtNQUNBLEtBQUEsYUFBQSxpQkFBQSxRQUFBLFNBQUEsSUFBQTtJQUNBLElBQUEsU0FBQSxXQUFBLE9BQUE7TUFDQSxLQUFBLFNBQUE7TUFDQSxLQUFBLEtBQUEsUUFBQSxTQUFBO0tBQ0EsR0FBQSxRQUFBLE1BQUE7TUFDQSxPQUFBLE1BQUEsUUFBQSxRQUFBOztJQUVBLElBQUEsY0FBQSxXQUFBLE9BQUE7TUFDQSxLQUFBO01BQ0EsTUFBQSxhQUFBLFFBQUEsT0FBQTtNQUNBLEtBQUEsZUFBQSxVQUFBLEtBQUEsS0FBQTs7Ozs7O0lBTUEsU0FBQSxRQUFBO0tBQ0EsSUFBQSxRQUFBLE1BQUEsU0FBQTs7S0FFQSxJQUFBLEdBQUEsTUFBQSxhQUFBO01BQ0EsUUFBQSxFQUFBLE9BQUEsR0FBQSxNQUFBLE1BQUE7TUFDQSxNQUFBLE9BQUEsQ0FBQSxPQUFBOztLQUVBLFlBQUEsS0FBQSxTQUFBO0tBQ0EsV0FBQSxLQUFBLGFBQUEsZUFBQSxFQUFBLFNBQUEsTUFBQSxRQUFBLFNBQUEsSUFBQTs7O0lBR0EsU0FBQSxVQUFBO0tBQ0EsSUFBQSxRQUFBLE1BQUEsU0FBQTtNQUNBLFFBQUE7TUFDQSxRQUFBO0tBQ0EsSUFBQSxRQUFBO0tBQ0EsR0FBQTs7TUFFQSxRQUFBLFFBQUEsT0FBQSxNQUFBLFVBQUEsS0FBQSxLQUFBO09BQ0EsSUFBQSxTQUFBLElBQUEsUUFBQSxXQUFBLFNBQUEsUUFBQTtRQUNBLFFBQUE7UUFDQSxRQUFBOzs7TUFHQTtNQUNBLFFBQUEsUUFBQSxLQUFBLFFBQUEsSUFBQSxRQUFBO2NBQ0EsQ0FBQSxTQUFBLFFBQUE7S0FDQSxRQUFBLElBQUE7S0FDQSxRQUFBLGNBQUE7S0FDQSxRQUFBOztJQUVBLE9BQUEsT0FBQSxXQUFBLFNBQUEsRUFBQSxFQUFBO0tBQ0EsR0FBQSxNQUFBLEVBQUE7TUFDQTs7S0FFQSxRQUFBLE9BQUEsR0FBQSxRQUFBLEVBQUE7S0FDQSxXQUFBLElBQUEsT0FBQTtPQUNBLE9BQUE7T0FDQSxLQUFBLE1BQUEsUUFBQSxNQUFBLElBQUEsRUFBQTtPQUNBLEtBQUEsTUFBQTtPQUNBLEtBQUEsTUFBQTtPQUNBLEtBQUEsTUFBQTtPQUNBLEtBQUEsTUFBQTtPQUNBLEtBQUEsZ0JBQUE7S0FDQSxRQUFBLFFBQUEsUUFBQSxRQUFBLFVBQUEsT0FBQTtNQUNBLFNBQUEsT0FBQTtRQUNBLEtBQUEsVUFBQSxNQUFBLFdBQUE7UUFDQSxLQUFBLGNBQUEsTUFBQTtRQUNBLEtBQUEsZ0JBQUEsTUFBQTs7S0FFQSxLQUFBLE1BQUEsUUFBQSxVQUFBLFFBQUEsUUFBQSxJQUFBLEVBQUEsTUFBQTtLQUNBLE9BQUEsTUFBQSxRQUFBLEVBQUE7S0FDQSxZQUFBLEtBQUEsU0FBQSxRQUFBLFlBQUEsRUFBQTtLQUNBLFdBQUEsYUFBQSxTQUFBLEtBQUEsS0FBQSxRQUFBLEtBQUEsYUFBQSxlQUFBLEVBQUEsUUFBQSxZQUFBLEVBQUEsVUFBQSxNQUFBLFFBQUEsU0FBQSxJQUFBOztJQUVBLE9BQUE7S0FDQSxZQUFBO01BQ0EsT0FBQSxRQUFBOztLQUVBLFVBQUEsVUFBQSxVQUFBO01BQ0EsSUFBQSxDQUFBLFVBQUE7T0FDQSxZQUFBLEtBQUEsU0FBQTtPQUNBLFdBQUEsS0FBQSxhQUFBLGVBQUEsRUFBQSxLQUFBLE1BQUEsUUFBQSxTQUFBLElBQUE7T0FDQTs7TUFFQSxZQUFBLEtBQUEsU0FBQSxTQUFBLFFBQUE7TUFDQSxJQUFBLFlBQUEsVUFBQTtPQUNBLFdBQUEsS0FBQSxhQUFBLGVBQUEsRUFBQSxTQUFBLFFBQUEsVUFBQSxNQUFBLFFBQUEsU0FBQSxJQUFBO2FBQ0E7T0FDQSxXQUFBLGFBQUEsU0FBQSxLQUFBLEtBQUEsUUFBQSxLQUFBLGFBQUEsZUFBQSxFQUFBLFNBQUEsUUFBQSxVQUFBLE1BQUEsUUFBQSxTQUFBLElBQUE7Ozs7Ozs7Ozs7O0FDak5BLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsUUFBQSxvQkFBQSxZQUFBLGNBQUEsVUFBQTs7Ozs7O0FDSEEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGtCQUFBLFdBQUEsNkNBQUEsU0FBQSxRQUFBLFVBQUEsUUFBQTs7RUFFQSxPQUFBO0dBQ0EsVUFBQTtHQUNBLGFBQUE7R0FDQSxZQUFBO0dBQ0EsUUFBQTtHQUNBLE1BQUEsVUFBQSxRQUFBLFNBQUEsUUFBQTs7SUFFQSxJQUFBLFNBQUE7SUFDQSxJQUFBLFVBQUEsR0FBQSxXQUFBLEdBQUEsYUFBQSxHQUFBO0lBQ0EsSUFBQSxPQUFBO0lBQ0EsSUFBQSxXQUFBO0lBQ0EsSUFBQSxtQkFBQTtJQUNBLElBQUEsU0FBQSxRQUFBLEtBQUE7S0FDQSxJQUFBLFFBQUEsUUFBQSxLQUFBO0tBQ0EsTUFBQSxJQUFBLEVBQUEsUUFBQTtLQUNBLE9BQUEsS0FBQSxTQUFBLFdBQUE7T0FDQSxNQUFBLEdBQUE7O0tBRUEsTUFBQSxLQUFBLFNBQUEsU0FBQSxFQUFBO09BQ0EsU0FBQSxVQUFBO1FBQ0EsS0FBQSxNQUFBLE1BQUEsR0FBQSxNQUFBLEdBQUE7U0FDQSxnQkFBQTtTQUNBLE9BQUE7U0FDQSxlQUFBO1NBQ0EsS0FBQSxTQUFBLElBQUE7VUFDQSxRQUFBLFFBQUEsSUFBQSxLQUFBLElBQUEsU0FBQSxLQUFBO1dBQ0EsR0FBQSxNQUFBLFNBQUEsT0FBQSxHQUFBO1lBQ0EsR0FBQSxRQUFBLFFBQUEsT0FBQSxLQUFBLEtBQUEsUUFBQSxVQUFBLENBQUEsRUFBQTthQUNBLElBQUEsT0FBQSxLQUFBO2NBQ0EsS0FBQTtjQUNBLFFBQUE7Y0FDQSxRQUFBOzthQUVBOzs7O1VBSUEsT0FBQSxHQUFBLEtBQUEsS0FBQTs7U0FFQSxrQkFBQSxTQUFBO1NBQ0E7O1VBRUEsSUFBQSxRQUFBLE1BQUEsT0FBQSxlQUFBO1lBQ0EsSUFBQSxXQUFBLE1BQUEsT0FBQSxHQUFBLE9BQUEsT0FBQTtVQUNBLElBQUEsSUFBQSxJQUFBLEdBQUEsS0FBQSxTQUFBLFFBQUEsSUFBQTtXQUNBLEdBQUEsU0FBQSxHQUFBO1lBQ0EsU0FBQSxLQUFBLFNBQUEsR0FBQSxRQUFBLGNBQUEsS0FBQTtZQUNBLEdBQUEsU0FBQSxHQUFBLFFBQUEsT0FBQSxDQUFBLEVBQUE7YUFDQSxTQUFBLEtBQUEsU0FBQSxHQUFBLE9BQUEsR0FBQSxTQUFBLEdBQUEsUUFBQTs7OztZQUlBLE9BQUEsU0FBQSxTQUFBLE1BQUEsT0FBQTs7U0FFQSxPQUFBLFNBQUEsS0FBQTtTQUNBO1VBQ0EsYUFBQSxNQUFBOztTQUVBLFVBQUEsU0FBQTtTQUNBO1VBQ0EsT0FBQSxHQUFBLFNBQUE7OztVQUdBLFFBQUEsUUFBQSxPQUFBLEdBQUEsS0FBQSxHQUFBLEtBQUEsSUFBQSxTQUFBLE1BQUEsSUFBQTtXQUNBLEdBQUEsSUFBQSxjQUFBLFFBQUEsVUFBQSxDQUFBLEVBQUE7WUFDQSxPQUFBLEdBQUEsS0FBQSxZQUFBOztZQUVBLEdBQUEsSUFBQSxjQUFBLFFBQUEsY0FBQSxDQUFBLEVBQUE7YUFDQSxPQUFBLEdBQUEsS0FBQSxnQkFBQTs7O1VBR0EsT0FBQSxHQUFBO1VBQ0EsT0FBQSxLQUFBLE9BQUEsR0FBQSxLQUFBLE9BQUEsb0JBQUE7Ozs7Ozs7Ozs7Ozs7QUM3RUEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxRQUFBLG9CQUFBLFlBQUEsZ0JBQUEsVUFBQTs7Ozs7OztBQ0hBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxrQkFBQSxXQUFBLG1CQUFBLFdBQUE7RUFDQSxJQUFBLFdBQUEsVUFBQTtHQUNBLE9BQUE7SUFDQSxPQUFBOzs7RUFHQSxPQUFBO0dBQ0EsVUFBQTtHQUNBLE1BQUE7SUFDQSxLQUFBO0lBQ0EsVUFBQTtJQUNBLFFBQUE7O0dBRUEsYUFBQTtHQUNBLFlBQUE7R0FDQSxNQUFBLFVBQUEsUUFBQSxTQUFBLFFBQUE7SUFDQSxPQUFBLFVBQUEsUUFBQSxPQUFBLFlBQUEsT0FBQTtJQUNBLE9BQUE7SUFDQSxPQUFBOzs7Ozs7OztBQ3JCQSxDQUFBLFlBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSxrQ0FBQSxVQUFBLFFBQUE7RUFDQSxPQUFBLFNBQUE7R0FDQSxTQUFBO0dBQ0EsVUFBQTtHQUNBLFVBQUE7R0FDQSxhQUFBO0dBQ0EsaUJBQUE7R0FDQSxrQkFBQTtHQUNBLGVBQUE7R0FDQSxpQkFBQTtHQUNBLFVBQUE7O0VBRUEsT0FBQSxRQUFBO0dBQ0EsU0FBQTtJQUNBLE9BQUE7O0dBRUEsTUFBQTs7RUFFQSxPQUFBLFdBQUEsWUFBQTtHQUNBLE9BQUEsTUFBQSxRQUFBLFFBQUE7SUFDQSxNQUFBO0lBQ0EsZ0JBQUE7SUFDQSxRQUFBO0tBQ0EsS0FBQTtLQUNBLE9BQUE7S0FDQSxRQUFBO0tBQ0EsTUFBQTs7SUFFQSxHQUFBLFVBQUEsR0FBQTtLQUNBLE9BQUEsRUFBQTs7SUFFQSxHQUFBLFVBQUEsR0FBQTtLQUNBLE9BQUEsRUFBQTs7SUFFQSxZQUFBO0lBQ0EsWUFBQTtJQUNBLFdBQUE7SUFDQSxvQkFBQTtJQUNBLHlCQUFBOzs7SUFHQSxPQUFBO0tBQ0EsV0FBQTs7SUFFQSxPQUFBO0tBQ0EsV0FBQTtLQUNBLG1CQUFBOztJQUVBLFFBQUE7S0FDQSxZQUFBOztJQUVBLE9BQUE7S0FDQSxhQUFBOzs7O0dBSUEsSUFBQSxPQUFBLFFBQUEsVUFBQSxNQUFBO0lBQ0EsT0FBQSxNQUFBLFFBQUEsTUFBQSxVQUFBLENBQUEsU0FBQSxPQUFBLE1BQUEsTUFBQSxPQUFBLE1BQUE7O0dBRUEsT0FBQSxPQUFBOztFQUVBLE9BQUEsaUJBQUEsWUFBQTtHQUNBLElBQUEsWUFBQTtHQUNBLE9BQUEsUUFBQTtJQUNBLEtBQUE7SUFDQSxLQUFBOztHQUVBLFFBQUEsUUFBQSxPQUFBLFdBQUEsVUFBQSxNQUFBLEtBQUE7SUFDQSxJQUFBLFFBQUE7S0FDQSxJQUFBO0tBQ0EsS0FBQSxLQUFBO0tBQ0EsT0FBQSxLQUFBO0tBQ0EsUUFBQTs7SUFFQSxRQUFBLFFBQUEsT0FBQSxNQUFBLFVBQUEsTUFBQSxHQUFBO0tBQ0EsTUFBQSxPQUFBLEtBQUE7TUFDQSxJQUFBO01BQ0EsR0FBQSxLQUFBLEtBQUEsT0FBQTtNQUNBLEdBQUEsS0FBQSxLQUFBLE9BQUE7O0tBRUEsT0FBQSxNQUFBLE1BQUEsS0FBQSxJQUFBLE9BQUEsTUFBQSxLQUFBLEtBQUEsS0FBQSxPQUFBO0tBQ0EsT0FBQSxNQUFBLE1BQUEsS0FBQSxJQUFBLE9BQUEsTUFBQSxLQUFBLEtBQUEsS0FBQSxPQUFBOztJQUVBLFVBQUEsS0FBQTs7O0dBR0EsT0FBQSxNQUFBLE9BQUE7R0FDQSxJQUFBLE9BQUEsUUFBQSxVQUFBLFFBQUE7SUFDQSxPQUFBLE1BQUEsUUFBQSxNQUFBLFVBQUEsQ0FBQSxTQUFBLE9BQUEsTUFBQSxNQUFBLE9BQUEsTUFBQTs7O0VBR0EsT0FBQSxPQUFBLFFBQUEsVUFBQSxHQUFBLEdBQUE7R0FDQSxJQUFBLENBQUEsR0FBQTtJQUNBOztHQUVBLE9BQUE7O0VBRUEsT0FBQSxPQUFBLGFBQUEsVUFBQSxHQUFBLEdBQUE7R0FDQSxJQUFBLE1BQUEsR0FBQTtJQUNBOztHQUVBLE9BQUE7Ozs7OztBQ3hHQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsa0JBQUEsVUFBQSxpQkFBQSxDQUFBLGVBQUEsU0FBQSxhQUFBOztFQUVBLElBQUEsU0FBQTtRQUNBLElBQUEsU0FBQTs7UUFFQSxTQUFBLE1BQUEsSUFBQTtZQUNBLElBQUEsS0FBQSxHQUFBLEdBQUEsYUFBQTtZQUNBLElBQUEsQ0FBQSxJQUFBO2dCQUNBLEtBQUEsRUFBQTtnQkFDQSxHQUFBLEdBQUEsYUFBQSxxQkFBQTs7WUFFQSxPQUFBOztRQUVBLFNBQUEsU0FBQSxJQUFBO1lBQ0EsSUFBQSxRQUFBLE9BQUE7WUFDQSxJQUFBLENBQUEsT0FBQTtnQkFDQSxRQUFBO2dCQUNBLE9BQUEsTUFBQTs7WUFFQSxPQUFBOzs7UUFHQSxTQUFBLGVBQUEsU0FBQSxPQUFBLFVBQUEsU0FBQSxRQUFBO1lBQ0EsT0FBQSxXQUFBO2dCQUNBLE1BQUEsWUFBQTtnQkFDQSxNQUFBLFdBQUE7Z0JBQ0EsTUFBQSxTQUFBO2dCQUNBLFNBQUEsUUFBQSxRQUFBLFdBQUE7b0JBQ0EsSUFBQSxXQUFBLE1BQUEsV0FBQSxRQUFBO3dCQUNBLFFBQUEsR0FBQSxNQUFBLFNBQUE7O29CQUVBLE1BQUEsWUFBQTtvQkFDQSxNQUFBLFdBQUE7b0JBQ0EsTUFBQTs7Ozs7UUFLQSxPQUFBO1lBQ0EsT0FBQSxTQUFBLFNBQUEsUUFBQTs7b0JBRUEsSUFBQSxRQUFBLFNBQUEsTUFBQTtvQkFDQSxJQUFBLFNBQUEsQ0FBQSxNQUFBLGFBQUEsTUFBQTt3QkFDQSxNQUFBLFNBQUEsUUFBQSxHQUFBO29CQUNBLElBQUEsV0FBQSxZQUFBLFNBQUE7d0JBQ0EsTUFBQSxDQUFBLFFBQUEsU0FBQSxNQUFBLFNBQUE7d0JBQ0EsSUFBQSxDQUFBLFFBQUEsT0FBQSxTQUFBOztvQkFFQSxJQUFBLFVBQUE7d0JBQ0EsSUFBQSxNQUFBLFdBQUE7NEJBQ0EsTUFBQTs4QkFDQSxlQUFBOzZDQUNBOzZDQUNBOzZDQUNBOzZDQUNBOzRCQUNBLE9BQUEsTUFBQSxTQUFBOzs2QkFFQTs0QkFDQSxNQUFBLFNBQUE7NEJBQ0EsT0FBQSxlQUFBO2tEQUNBO2tEQUNBO2tEQUNBO2tEQUNBOzs7O2dCQUlBOztZQUVBLE9BQUEsU0FBQSxTQUFBLFFBQUE7O29CQUVBLElBQUEsUUFBQSxTQUFBLE1BQUE7b0JBQ0EsSUFBQSxTQUFBLENBQUEsTUFBQSxhQUFBLE1BQUE7d0JBQ0EsTUFBQSxTQUFBLFFBQUEsR0FBQTs7b0JBRUEsSUFBQSxXQUFBLFlBQUEsU0FBQTt3QkFDQSxNQUFBLENBQUEsUUFBQSxPQUFBLFNBQUE7d0JBQ0EsSUFBQSxDQUFBLFFBQUEsU0FBQSxNQUFBLFNBQUE7O29CQUVBLElBQUEsVUFBQTt3QkFDQSxJQUFBLE1BQUEsV0FBQTs0QkFDQSxNQUFBLFNBQUEsZUFBQTswREFDQTswREFDQTswREFDQTswREFDQTs0QkFDQSxPQUFBLE1BQUEsU0FBQTs7NkJBRUE7NEJBQ0EsTUFBQSxTQUFBOzRCQUNBLE9BQUEsZUFBQTtrREFDQTtrREFDQTtrREFDQTtrREFDQTs7OztnQkFJQTs7Ozs7O0FDdEdBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsUUFBQSxvQkFBQSxZQUFBLG1CQUFBLFVBQUE7Ozs7OztBQ0hBLENBQUEsWUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxrQkFBQSxVQUFBLFlBQUE7O0NBRUEsU0FBQSxVQUFBLENBQUEsWUFBQTs7Q0FFQSxTQUFBLFNBQUEsVUFBQSxjQUFBO0VBQ0EsT0FBQTtHQUNBLFVBQUE7R0FDQSxTQUFBO0dBQ0EsWUFBQTtHQUNBLGFBQUE7R0FDQSxNQUFBOzs7RUFHQSxTQUFBLHFCQUFBLFFBQUEsU0FBQSxRQUFBOzs7OztBQ2hCQSxDQUFBLFdBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSxrREFBQSxTQUFBLFFBQUEsU0FBQSxVQUFBO0VBQ0EsT0FBQSxPQUFBO0VBQ0EsT0FBQSxXQUFBO0VBQ0EsT0FBQSxpQkFBQTtFQUNBLE9BQUEsZ0JBQUE7RUFDQSxPQUFBLGNBQUE7RUFDQSxPQUFBLGFBQUE7RUFDQSxPQUFBLGdCQUFBO0VBQ0EsT0FBQSxhQUFBO0VBQ0E7O0VBRUEsU0FBQSxXQUFBO0dBQ0EsT0FBQTtHQUNBLE9BQUE7R0FDQSxPQUFBO0dBQ0EsT0FBQTtHQUNBLE9BQUE7R0FDQSxPQUFBLE9BQUEsdUJBQUEsU0FBQSxTQUFBLFNBQUE7SUFDQSxJQUFBLFlBQUEsU0FBQTtLQUNBLE9BQUE7O0lBRUEsT0FBQTtJQUNBLE9BQUE7SUFDQSxPQUFBO0lBQ0EsT0FBQTs7R0FFQSxPQUFBLE9BQUEsV0FBQSxTQUFBLEdBQUEsR0FBQTtJQUNBLElBQUEsTUFBQSxHQUFBO0tBQ0E7O0lBRUEsT0FBQTs7OztFQUlBLFNBQUEsYUFBQTtHQUNBLE9BQUEsT0FBQSxDQUFBLE9BQUE7R0FDQTs7RUFFQSxTQUFBLGNBQUE7R0FDQSxJQUFBLE9BQUE7R0FDQSxRQUFBLFFBQUEsT0FBQSxNQUFBLFNBQUEsTUFBQTtJQUNBLEtBQUEsT0FBQSxRQUFBLFlBQUEsUUFBQSxXQUFBLEtBQUEsT0FBQSxRQUFBLFlBQUE7SUFDQSxLQUFBLFdBQUEsU0FBQSxLQUFBOztHQUVBLElBQUEsU0FBQSxRQUFBLFdBQUEsT0FBQSxLQUFBLENBQUEsT0FBQSxRQUFBLFlBQUEsTUFBQSxVQUFBO0dBQ0EsS0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLE9BQUEsUUFBQSxLQUFBO0lBQ0EsSUFBQSxPQUFBLEdBQUEsT0FBQSxPQUFBLFFBQUEsS0FBQTtLQUNBLE9BQUEsSUFBQTs7O0dBR0EsT0FBQSxRQUFBLE9BQUEsUUFBQSxZQUFBLEtBQUEsV0FBQTs7RUFFQSxTQUFBLFdBQUEsUUFBQTtHQUNBLElBQUEsU0FBQSxRQUFBLFdBQUEsT0FBQSxLQUFBLENBQUEsT0FBQSxRQUFBLFlBQUEsTUFBQSxVQUFBO0dBQ0EsSUFBQSxPQUFBO0dBQ0EsUUFBQSxRQUFBLFFBQUEsU0FBQSxNQUFBLElBQUE7SUFDQSxHQUFBLEtBQUEsV0FBQSxRQUFBLFFBQUE7S0FDQSxPQUFBOzs7R0FHQSxPQUFBLEtBQUE7O0VBRUEsU0FBQSxnQkFBQTtHQUNBLE9BQUEsVUFBQSxDQUFBLE9BQUEsUUFBQSxRQUFBLFlBQUE7OztFQUdBLFNBQUEsZ0JBQUE7R0FDQSxPQUFBLGdCQUFBO0lBQ0EsT0FBQSxPQUFBLFFBQUEsUUFBQSxZQUFBO0lBQ0EsT0FBQSxPQUFBLFFBQUEsUUFBQSxZQUFBO0lBQ0EsVUFBQTtJQUNBLE9BQUE7S0FDQSxLQUFBOzs7R0FHQSxPQUFBLG1CQUFBO0lBQ0EsT0FBQSxPQUFBLFFBQUEsUUFBQSxZQUFBO0lBQ0EsT0FBQSxPQUFBLFFBQUEsUUFBQSxZQUFBO0lBQ0EsVUFBQTtJQUNBLE9BQUE7S0FDQSxLQUFBOzs7OztFQUtBLFNBQUEsV0FBQTtHQUNBLE9BQUEsUUFBQTtJQUNBLFNBQUE7S0FDQSxPQUFBO01BQ0EsTUFBQTs7TUFFQSxnQkFBQTtNQUNBLFFBQUE7T0FDQSxLQUFBO09BQ0EsT0FBQTtPQUNBLFFBQUE7T0FDQSxNQUFBOztNQUVBLEdBQUEsU0FBQSxHQUFBO09BQ0EsT0FBQSxFQUFBOztNQUVBLEdBQUEsU0FBQSxHQUFBO09BQ0EsT0FBQSxFQUFBOztNQUVBLFlBQUE7TUFDQSxXQUFBO01BQ0Esb0JBQUE7TUFDQSx5QkFBQTtNQUNBLFFBQUEsQ0FBQSxLQUFBO01BQ0EsT0FBQTtPQUNBLFdBQUE7O01BRUEsT0FBQTtPQUNBLFdBQUE7T0FDQSxtQkFBQTs7TUFFQSxRQUFBO09BQ0EsWUFBQTtPQUNBLFFBQUE7UUFDQSxRQUFBOzs7TUFHQSxPQUFBO09BQ0EsYUFBQTs7OztJQUlBLE1BQUE7O0dBRUEsT0FBQSxPQUFBOzs7RUFHQSxTQUFBLGlCQUFBO0dBQ0EsSUFBQSxZQUFBO0dBQ0EsUUFBQSxRQUFBLE9BQUEsUUFBQSxZQUFBLFVBQUEsU0FBQSxNQUFBLEtBQUE7SUFDQSxJQUFBLFFBQUE7S0FDQSxLQUFBLEtBQUE7S0FDQSxPQUFBLEtBQUE7S0FDQSxRQUFBOztJQUVBLFFBQUEsUUFBQSxPQUFBLFFBQUEsS0FBQSxTQUFBLE1BQUE7S0FDQSxNQUFBLE9BQUEsS0FBQTtNQUNBLEdBQUEsS0FBQTtNQUNBLEdBQUEsS0FBQSxLQUFBOzs7SUFHQSxVQUFBLEtBQUE7O0dBRUEsT0FBQSxNQUFBLE9BQUE7Ozs7OztBQ3ZKQSxDQUFBLFlBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsa0JBQUEsVUFBQSxZQUFBLFlBQUE7RUFDQSxJQUFBLFdBQUEsVUFBQTtJQUNBLE9BQUE7TUFDQSxNQUFBOzs7RUFHQSxPQUFBO0dBQ0EsVUFBQTs7R0FFQSxZQUFBO0dBQ0EsT0FBQTtJQUNBLE1BQUE7O0dBRUEsTUFBQSxVQUFBLFFBQUEsU0FBQSxRQUFBO0lBQ0EsSUFBQSxVQUFBLFFBQUEsT0FBQSxZQUFBO0lBQ0EsT0FBQTtJQUNBLE9BQUE7SUFDQSxJQUFBLFFBQUE7S0FDQSxTQUFBO0tBQ0EsU0FBQSxDQUFBLFNBQUE7S0FDQSxJQUFBLEdBQUEsTUFBQSxTQUFBLE1BQUEsQ0FBQSxHQUFBLElBQUEsS0FBQTtLQUNBLElBQUEsR0FBQSxNQUFBLE1BQUEsU0FBQSxLQUFBLE9BQUEsQ0FBQSxHQUFBLElBQUEsTUFBQSxDQUFBLEdBQUE7OztLQUdBLFVBQUE7S0FDQSxXQUFBO0tBQ0EsY0FBQTs7SUFFQSxJQUFBLE1BQUEsR0FBQSxPQUFBLFFBQUE7OztJQUdBLElBQUEsTUFBQSxJQUFBLE9BQUE7TUFDQSxLQUFBLFNBQUEsUUFBQSxVQUFBO01BQ0EsS0FBQSxVQUFBLFNBQUEsVUFBQTtNQUNBLE9BQUE7TUFDQSxLQUFBLGFBQUEsZUFBQSxDQUFBLFNBQUEsU0FBQSxTQUFBLFdBQUE7Ozs7Ozs7O0lBUUEsSUFBQSxZQUFBLEdBQUEsT0FBQTtNQUNBLEtBQUE7TUFDQSxNQUFBLFVBQUEsR0FBQTtNQUNBLE9BQUE7OztJQUdBLElBQUEsTUFBQSxHQUFBLElBQUE7TUFDQSxXQUFBLFVBQUEsR0FBQTtNQUNBLE9BQUEsS0FBQSxJQUFBLEdBQUEsS0FBQSxJQUFBLElBQUEsS0FBQSxJQUFBLEVBQUEsRUFBQTs7TUFFQSxTQUFBLFVBQUEsR0FBQTtNQUNBLE9BQUEsS0FBQSxJQUFBLEdBQUEsS0FBQSxJQUFBLElBQUEsS0FBQSxJQUFBLEVBQUEsRUFBQSxJQUFBLEVBQUE7O01BRUEsWUFBQSxVQUFBLEdBQUE7TUFDQSxPQUFBLEtBQUEsSUFBQSxHQUFBLEVBQUEsSUFBQSxFQUFBLEVBQUEsS0FBQSxFQUFBOztNQUVBLFlBQUEsVUFBQSxHQUFBO01BQ0EsT0FBQSxLQUFBLElBQUEsR0FBQSxFQUFBLEVBQUEsSUFBQSxFQUFBOzs7SUFHQSxJQUFBLFdBQUE7S0FDQSxXQUFBO0tBQ0EsV0FBQTtLQUNBLFdBQUE7OztJQUdBLElBQUEsUUFBQSxVQUFBLE1BQUEsT0FBQTs7SUFFQSxJQUFBLE9BQUEsSUFBQSxVQUFBLFFBQUEsS0FBQTtJQUNBLEtBQUEsUUFBQSxPQUFBO01BQ0EsS0FBQSxNQUFBLFVBQUEsR0FBQSxHQUFBO01BQ0EsT0FBQSxVQUFBOztNQUVBLEtBQUEsS0FBQTtNQUNBLEtBQUEsYUFBQTtNQUNBLEtBQUEsU0FBQSxVQUFBLEdBQUE7TUFDQSxPQUFBLEVBQUEsUUFBQSxXQUFBOztNQUVBLE1BQUEsUUFBQTtNQUNBLEdBQUEsU0FBQTs7SUFFQSxJQUFBLE9BQUEsSUFBQSxVQUFBLFFBQUEsS0FBQTtJQUNBLElBQUEsWUFBQSxLQUFBLFFBQUEsT0FBQTtNQUNBLE1BQUEsZ0JBQUE7TUFDQSxLQUFBLGVBQUEsVUFBQSxHQUFBO01BQ0EsSUFBQSxFQUFBO09BQ0EsT0FBQTs7O09BR0EsT0FBQTs7TUFFQSxLQUFBLE1BQUEsVUFBQSxHQUFBO01BQ0EsT0FBQSxVQUFBLEVBQUE7O01BRUEsS0FBQSxTQUFBLFVBQUEsR0FBQTtNQUNBLE9BQUE7O01BRUEsS0FBQSxNQUFBLFVBQUEsR0FBQTtNQUNBLE9BQUEsRUFBQSxRQUFBLFNBQUE7O01BRUEsS0FBQSxhQUFBLFVBQUEsR0FBQTtNQUNBLElBQUEsWUFBQSxDQUFBLEVBQUEsUUFBQSxJQUFBLE1BQUEsS0FBQSxTQUFBO09BQ0EsY0FBQSxFQUFBLElBQUEsTUFBQSxJQUFBLENBQUE7T0FDQSxRQUFBLEVBQUEsRUFBQSxJQUFBLEVBQUEsS0FBQSxLQUFBLE1BQUEsS0FBQSxLQUFBLE1BQUEsWUFBQSxhQUFBO09BQ0EsU0FBQSxTQUFBLFlBQUEsQ0FBQSxLQUFBO09BQ0EsU0FBQSxDQUFBLEVBQUEsRUFBQSxLQUFBLGVBQUE7T0FDQSxZQUFBLFFBQUEsS0FBQSxDQUFBLE1BQUE7TUFDQSxJQUFBLEVBQUEsUUFBQSxZQUFBLEVBQUEsUUFBQSxVQUFBLFVBQUE7TUFDQSxJQUFBLEVBQUEsU0FBQSxHQUFBO09BQ0EsU0FBQSxDQUFBO09BQ0EsU0FBQTtPQUNBLFdBQUE7YUFDQSxJQUFBLEVBQUEsU0FBQSxHQUFBLFVBQUEsQ0FBQTtXQUNBLElBQUEsRUFBQSxTQUFBLEdBQUEsVUFBQSxDQUFBO1dBQ0EsSUFBQSxFQUFBLFNBQUEsR0FBQSxVQUFBO01BQ0EsT0FBQSxZQUFBLFNBQUEsZ0JBQUEsU0FBQSxhQUFBLFdBQUE7O01BRUEsR0FBQSxTQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBK0JBLFVBQUEsT0FBQTtNQUNBLEtBQUEsS0FBQTtNQUNBLEtBQUEsVUFBQSxHQUFBOztNQUVBLElBQUEsRUFBQSxTQUFBLEtBQUEsRUFBQSxRQUFBLFlBQUEsRUFBQSxRQUFBLFlBQUEsRUFBQSxRQUFBLFlBQUEsRUFBQSxRQUFBO09BQ0EsT0FBQSxFQUFBLEtBQUEsTUFBQSxLQUFBLEtBQUEsT0FBQSxFQUFBLEtBQUEsTUFBQSxLQUFBLE1BQUE7O09BRUEsT0FBQSxFQUFBLEtBQUEsTUFBQSxLQUFBOztJQUVBLFVBQUEsT0FBQTtNQUNBLEtBQUEsS0FBQTtNQUNBLEtBQUEsTUFBQTtNQUNBLEtBQUEsVUFBQSxHQUFBOztNQUVBLElBQUEsRUFBQSxTQUFBLEtBQUEsRUFBQSxRQUFBLFlBQUEsRUFBQSxRQUFBLFlBQUEsRUFBQSxRQUFBLFlBQUEsRUFBQSxRQUFBO09BQ0EsT0FBQSxDQUFBLEVBQUEsS0FBQSxNQUFBLEtBQUEsTUFBQSxNQUFBLE9BQUEsRUFBQSxLQUFBLE1BQUEsS0FBQSxNQUFBOztPQUVBLE9BQUEsQ0FBQSxFQUFBLEtBQUEsTUFBQSxLQUFBLE1BQUEsTUFBQSxPQUFBLEVBQUEsS0FBQSxNQUFBLEtBQUEsTUFBQTs7SUFFQSxVQUFBLE9BQUE7TUFDQSxLQUFBLEtBQUE7TUFDQSxLQUFBLE1BQUE7TUFDQSxLQUFBLFVBQUEsR0FBQTtNQUNBLElBQUEsRUFBQSxTQUFBLEtBQUEsRUFBQSxRQUFBLFlBQUEsRUFBQSxRQUFBLFlBQUEsRUFBQSxRQUFBLFlBQUEsRUFBQSxRQUFBO09BQ0EsT0FBQSxDQUFBLEVBQUEsS0FBQSxNQUFBLEtBQUEsTUFBQSxNQUFBLE9BQUEsRUFBQSxLQUFBLE1BQUEsS0FBQSxNQUFBOztPQUVBLE9BQUEsQ0FBQSxFQUFBLEtBQUEsTUFBQSxLQUFBLE1BQUEsTUFBQSxPQUFBLEVBQUEsS0FBQSxNQUFBLEtBQUEsTUFBQSxJQUFBOzs7SUFHQSxTQUFBLE1BQUEsR0FBQTs7S0FFQSxLQUFBO09BQ0EsU0FBQTtPQUNBLFVBQUEsS0FBQSxTQUFBOzs7O0tBSUEsS0FBQSxNQUFBLGNBQUEsVUFBQSxHQUFBO09BQ0EsT0FBQSxXQUFBLEdBQUEsS0FBQSxPQUFBLEdBQUEsT0FBQSxNQUFBLE1BQUE7O09BRUE7T0FDQSxTQUFBO09BQ0EsVUFBQSxlQUFBLFVBQUEsR0FBQTtPQUNBLE9BQUEsWUFBQTtRQUNBLElBQUEsRUFBQTtTQUNBLE9BQUE7OztTQUdBLE9BQUE7OztPQUdBLFVBQUEsYUFBQSxVQUFBLEdBQUE7T0FDQSxJQUFBLFlBQUEsQ0FBQSxFQUFBLFFBQUEsSUFBQSxNQUFBLEtBQUEsU0FBQTtPQUNBLE9BQUEsWUFBQTtRQUNBLElBQUEsWUFBQSxDQUFBLEVBQUEsUUFBQSxJQUFBLE1BQUEsS0FBQSxTQUFBO1NBQ0EsY0FBQSxFQUFBLElBQUEsTUFBQSxJQUFBLENBQUE7U0FDQSxRQUFBLEVBQUEsRUFBQSxJQUFBLEVBQUEsS0FBQSxLQUFBLE1BQUEsS0FBQSxLQUFBLE1BQUEsWUFBQSxhQUFBO1NBQ0EsU0FBQSxTQUFBLFlBQUEsQ0FBQSxLQUFBO1NBQ0EsU0FBQSxDQUFBLEVBQUEsRUFBQSxLQUFBLGVBQUE7U0FDQSxZQUFBLFFBQUEsS0FBQSxDQUFBLE1BQUE7UUFDQSxJQUFBLEVBQUEsUUFBQSxZQUFBLEVBQUEsUUFBQSxVQUFBLFVBQUE7UUFDQSxJQUFBLEVBQUEsU0FBQSxHQUFBO1NBQ0EsU0FBQSxDQUFBO1NBQ0EsU0FBQTtTQUNBLFdBQUE7ZUFDQSxJQUFBLEVBQUEsU0FBQSxHQUFBLFVBQUEsQ0FBQTthQUNBLElBQUEsRUFBQSxTQUFBLEdBQUEsVUFBQSxDQUFBO2FBQ0EsSUFBQSxFQUFBLFNBQUEsR0FBQSxVQUFBO1FBQ0EsT0FBQSxZQUFBLFNBQUEsZ0JBQUEsU0FBQSxhQUFBLFdBQUE7OztPQUdBLE1BQUEsZ0JBQUEsVUFBQSxHQUFBO09BQ0EsT0FBQSxXQUFBLEdBQUEsS0FBQSxJQUFBOztPQUVBLEtBQUEsT0FBQSxVQUFBLEdBQUE7T0FDQSxHQUFBLE9BQUEsTUFBQSxNQUFBLGNBQUEsV0FBQSxHQUFBLEtBQUEsT0FBQTs7Ozs7SUFLQSxTQUFBLFdBQUEsR0FBQSxHQUFBO0tBQ0EsSUFBQSxNQUFBLEdBQUEsT0FBQTtLQUNBLElBQUEsRUFBQSxVQUFBO01BQ0EsT0FBQSxFQUFBLFNBQUEsS0FBQSxVQUFBLEdBQUE7T0FDQSxPQUFBLFdBQUEsR0FBQTs7O0tBR0EsT0FBQTs7O0lBR0EsU0FBQSxTQUFBLEdBQUE7S0FDQSxPQUFBLEVBQUE7S0FDQSxJQUFBLEVBQUE7TUFDQSxPQUFBLEVBQUE7VUFDQTtNQUNBLElBQUEsWUFBQTs7TUFFQSxJQUFBLElBQUE7TUFDQSxPQUFBLEVBQUEsT0FBQSxTQUFBLE1BQUE7T0FDQTtNQUNBLElBQUEsYUFBQSxDQUFBLGFBQUEsSUFBQSxJQUFBO01BQ0EsT0FBQSxPQUFBLE1BQUEsRUFBQSxPQUFBLE9BQUEsS0FBQSxZQUFBLEtBQUE7Ozs7O0lBS0EsU0FBQSxTQUFBLEdBQUE7S0FDQSxJQUFBLEtBQUEsS0FBQTtNQUNBLEtBQUEsR0FBQSxZQUFBLEVBQUEsVUFBQSxDQUFBLEVBQUEsR0FBQSxFQUFBLElBQUEsRUFBQSxLQUFBO01BQ0EsS0FBQSxHQUFBLFlBQUEsRUFBQSxVQUFBLENBQUEsRUFBQSxHQUFBO01BQ0EsS0FBQSxHQUFBLFlBQUEsRUFBQSxTQUFBLENBQUEsRUFBQSxJQUFBLEtBQUEsR0FBQTs7S0FFQSxPQUFBLFVBQUEsR0FBQTtNQUNBLE9BQUEsVUFBQSxHQUFBO09BQ0EsRUFBQSxPQUFBLEdBQUE7T0FDQSxFQUFBLE9BQUEsR0FBQSxJQUFBLE1BQUEsR0FBQTtPQUNBLE9BQUEsSUFBQTs7Ozs7SUFLQSxTQUFBLEtBQUEsR0FBQTtLQUNBLE9BQUEsRUFBQSxXQUFBLEtBQUEsSUFBQSxNQUFBLE1BQUEsRUFBQSxTQUFBLElBQUEsU0FBQSxFQUFBLElBQUEsRUFBQTs7Ozs7OztBQ3BSQSxDQUFBLFlBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSwyQkFBQSxVQUFBLFFBQUE7O0VBRUEsT0FBQSxXQUFBLFlBQUE7R0FDQSxPQUFBLFFBQUE7SUFDQSxTQUFBO0tBQ0EsT0FBQTtNQUNBLE1BQUE7TUFDQSxRQUFBO01BQ0EsWUFBQTtPQUNBLFlBQUE7T0FDQSxTQUFBO09BQ0EsVUFBQTtPQUNBLFFBQUE7T0FDQSxNQUFBO09BQ0EsWUFBQTtPQUNBLFVBQUE7UUFDQSxPQUFBO1FBQ0EsU0FBQTtRQUNBLFVBQUE7UUFDQSxRQUFBOzs7TUFHQSxXQUFBO09BQ0EsWUFBQTtPQUNBLFdBQUE7T0FDQSxZQUFBO09BQ0EsZ0JBQUE7T0FDQSxXQUFBO09BQ0Esa0JBQUE7T0FDQSxZQUFBO09BQ0EsV0FBQTtPQUNBLGFBQUE7T0FDQSxpQkFBQTs7T0FFQSxVQUFBO1FBQ0EsUUFBQTtRQUNBLE9BQUE7O09BRUEsVUFBQTtPQUNBLFFBQUE7T0FDQSxlQUFBO09BQ0EsTUFBQTs7OztJQUlBLE1BQUE7O0dBRUEsT0FBQSxPQUFBOztFQUVBLElBQUEsWUFBQSxVQUFBLE1BQUE7R0FDQSxJQUFBLFdBQUE7R0FDQSxRQUFBLFFBQUEsTUFBQSxVQUFBLE1BQUE7SUFDQSxJQUFBLFFBQUE7S0FDQSxRQUFBLEtBQUE7S0FDQSxRQUFBLEtBQUE7S0FDQSxTQUFBLEtBQUE7S0FDQSxZQUFBLFVBQUEsS0FBQTs7SUFFQSxHQUFBLEtBQUEsTUFBQTtLQUNBLE1BQUEsUUFBQSxLQUFBOztJQUVBLEdBQUEsS0FBQSxLQUFBO0tBQ0EsTUFBQSxPQUFBLEtBQUE7O0lBRUEsU0FBQSxLQUFBOztHQUVBLE9BQUE7O0VBRUEsT0FBQSxpQkFBQSxZQUFBO0dBQ0EsSUFBQSxZQUFBO0lBQ0EsUUFBQSxPQUFBLEtBQUE7SUFDQSxTQUFBLE9BQUEsS0FBQTtJQUNBLFlBQUEsVUFBQSxPQUFBLEtBQUE7SUFDQSxRQUFBOztHQUVBLE9BQUEsTUFBQSxPQUFBO0dBQ0EsT0FBQTs7RUFFQSxPQUFBLE9BQUEsUUFBQSxVQUFBLEdBQUEsR0FBQTtHQUNBLElBQUEsQ0FBQSxHQUFBO0lBQ0E7O0dBRUEsT0FBQTs7Ozs7QUFLQSIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0dmFyIGFwcCA9IGFuZ3VsYXIubW9kdWxlKCdhcHAnLFxuXHRcdFtcblx0XHQnYXBwLmNvbnRyb2xsZXJzJyxcblx0XHQnYXBwLmZpbHRlcnMnLFxuXHRcdCdhcHAuc2VydmljZXMnLFxuXHRcdCdhcHAuZGlyZWN0aXZlcycsXG5cdFx0J2FwcC5yb3V0ZXMnLFxuXHRcdCdhcHAuY29uZmlnJ1xuXHRcdF0pO1xuXG5cblx0XHRhbmd1bGFyLm1vZHVsZSgnYXBwLnJvdXRlcycsIFsndWkucm91dGVyJywgJ25nU3RvcmFnZScsICdzYXRlbGxpemVyJ10pO1xuXHRcdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnLCBbJ3RvYXN0cicsJ3VpLnJvdXRlcicsICdtZC5kYXRhLnRhYmxlJywgJ25nTWF0ZXJpYWwnLCAnbmdTdG9yYWdlJywgJ3Jlc3Rhbmd1bGFyJywgJ25nTWRJY29ucycsICdhbmd1bGFyLWxvYWRpbmctYmFyJywgJ25nTWVzc2FnZXMnLCAnbmdTYW5pdGl6ZScsIFwibGVhZmxldC1kaXJlY3RpdmVcIiwnbnZkMyddKTtcblx0XHRhbmd1bGFyLm1vZHVsZSgnYXBwLmZpbHRlcnMnLCBbXSk7XG5cdFx0YW5ndWxhci5tb2R1bGUoJ2FwcC5zZXJ2aWNlcycsIFsndWkucm91dGVyJywgJ25nU3RvcmFnZScsICdyZXN0YW5ndWxhcicsICd0b2FzdHInXSk7XG5cdFx0YW5ndWxhci5tb2R1bGUoJ2FwcC5kaXJlY3RpdmVzJywgWyduZ01hdGVyaWFsJywnbmdQYXBhUGFyc2UnXSk7XG5cdFx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb25maWcnLCBbXSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLnJvdXRlcycpLmNvbmZpZyhmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlcikge1xuXG5cdFx0dmFyIGdldFZpZXcgPSBmdW5jdGlvbiAodmlld05hbWUpIHtcblx0XHRcdHJldHVybiAnL3ZpZXdzL2FwcC8nICsgdmlld05hbWUgKyAnLycgKyB2aWV3TmFtZSArICcuaHRtbCc7XG5cdFx0fTtcblxuXHRcdCR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UoJy9pbmRleC9lcGknKTtcblxuXHRcdCRzdGF0ZVByb3ZpZGVyXG5cdFx0XHQuc3RhdGUoJ2FwcCcsIHtcblx0XHRcdFx0YWJzdHJhY3Q6IHRydWUsXG5cdFx0XHRcdHZpZXdzOiB7XG5cdFx0XHRcdFx0aGVhZGVyOiB7XG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogZ2V0VmlldygnaGVhZGVyJyksXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiAnSGVhZGVyQ3RybCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyQXM6ICd2bSdcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdG1haW46IHt9LFxuXHRcdFx0XHRcdCdtYXBAJzoge1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6IGdldFZpZXcoJ21hcCcpLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlcjogJ01hcEN0cmwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlckFzOiAndm0nXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdFx0LnN0YXRlKCdhcHAudXNlcicsIHtcblx0XHRcdFx0dXJsOiAnL3VzZXInLFxuXHRcdFx0XHRhYnN0cmFjdDogdHJ1ZVxuXG5cdFx0XHR9KVxuXHRcdFx0LnN0YXRlKCdhcHAudXNlci5sb2dpbicsIHtcblx0XHRcdFx0dXJsOiAnL2xvZ2luJyxcblx0XHRcdFx0dmlld3M6IHtcblx0XHRcdFx0XHQnbWFpbkAnOiB7XG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogZ2V0VmlldygnbG9naW4nKSxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdMb2dpbkN0cmwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlckFzOiAndm0nXG5cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLnVzZXIucHJvZmlsZScsIHtcblx0XHRcdFx0dXJsOiAnL215LXByb2ZpbGUnLFxuXHRcdFx0XHR2aWV3czoge1xuXHRcdFx0XHRcdCdtYWluQCc6IHtcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiBnZXRWaWV3KCd1c2VyJyksXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiAnVXNlckN0cmwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlckFzOiAndm0nLFxuXHRcdFx0XHRcdFx0cmVzb2x2ZToge1xuXHRcdFx0XHRcdFx0XHRwcm9maWxlOiBmdW5jdGlvbiAoRGF0YVNlcnZpY2UsICRhdXRoKSB7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIERhdGFTZXJ2aWNlLmdldE9uZSgnbWUnKS4kb2JqZWN0O1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdH0pXG5cdFx0XHQuc3RhdGUoJ2FwcC5pbmRleCcsIHtcblx0XHRcdFx0YWJzdHJhY3Q6IHRydWUsXG5cdFx0XHRcdHVybDogJy9pbmRleCcsXG5cdFx0XHRcdHZpZXdzOiB7XG5cdFx0XHRcdFx0J21haW5AJzoge1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6IGdldFZpZXcoJ2luZGV4JyksXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiAnSW5kZXhiYXNlQ3RybCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyQXM6ICd2bSdcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cdFx0XHQuc3RhdGUoJ2FwcC5pbmRleC5jcmVhdGUnLCB7XG5cdFx0XHRcdHVybDogJy9jcmVhdGUnLFxuXHRcdFx0XHR2aWV3czoge1xuXHRcdFx0XHRcdCdpbmZvJzoge1xuXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHQnbWVudSc6IHtcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdpbmRleGNyZWF0b3InKSxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdJbmRleGNyZWF0b3JDdHJsJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLmluZGV4LmNyZWF0ZS5jaGVjaycsIHtcblx0XHRcdFx0dXJsOiAnL2NoZWNraW5nJ1xuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLmluZGV4LmNyZWF0ZS5tZXRhJywge1xuXHRcdFx0XHR1cmw6ICcvYWRkaW5nLW1ldGEtZGF0YSdcblx0XHRcdH0pXG5cdFx0XHQuc3RhdGUoJ2FwcC5pbmRleC5jcmVhdGUuZmluYWwnLCB7XG5cdFx0XHRcdHVybDogJy9hZGRpbmctbWV0YS1kYXRhJ1xuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLmluZGV4LnNob3cnLCB7XG5cdFx0XHRcdHVybDogJy86aW5kZXgnLFxuXHRcdFx0XHR2aWV3czoge1xuXHRcdFx0XHRcdCdpbmZvJzoge1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICcvdmlld3MvYXBwL2luZGV4L2luZm8uaHRtbCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiAnSW5kZXhDdHJsJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJyxcblx0XHRcdFx0XHRcdHJlc29sdmU6IHtcblx0XHRcdFx0XHRcdFx0aW5pdGlhbERhdGE6IGZ1bmN0aW9uIChEYXRhU2VydmljZSwgJHN0YXRlUGFyYW1zKSB7XG5cdFx0XHRcdFx0XHRcdFx0dmFyIGQgPSBEYXRhU2VydmljZS5nZXRBbGwoJ2luZGV4LycgKyAkc3RhdGVQYXJhbXMuaW5kZXggKyAnL3llYXIvMjAxNCcpO1xuXHRcdFx0XHRcdFx0XHRcdHZhciBpID0gRGF0YVNlcnZpY2UuZ2V0T25lKCdpbmRleC8nICsgJHN0YXRlUGFyYW1zLmluZGV4ICsgJy9zdHJ1Y3R1cmUnKTtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdFx0XHRcdFx0ZGF0YU9iamVjdDogZC4kb2JqZWN0LFxuXHRcdFx0XHRcdFx0XHRcdFx0aW5kZXhlck9iamVjdDogaS4kb2JqZWN0LFxuXHRcdFx0XHRcdFx0XHRcdFx0ZGF0YTogZCxcblx0XHRcdFx0XHRcdFx0XHRcdGluZGV4ZXI6IGlcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdCdzZWxlY3RlZCc6IHtcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiAnL3ZpZXdzL2FwcC9pbmRleC9zZWxlY3RlZC5odG1sJyxcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cdFx0XHQuc3RhdGUoJ2FwcC5pbmRleC5zaG93LnNlbGVjdGVkJywge1xuXHRcdFx0XHR1cmw6ICcvOml0ZW0nLFxuXHRcdFx0XHQvKnZpZXdzOntcblx0XHRcdFx0XHQnc2VsZWN0ZWQnOntcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdzZWxlY3RlZCcpLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlcjogJ1NlbGVjdGVkQ3RybCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyQXM6ICd2bScsXG5cdFx0XHRcdFx0XHRyZXNvbHZlOntcblx0XHRcdFx0XHRcdFx0Z2V0Q291bnRyeTogZnVuY3Rpb24oRGF0YVNlcnZpY2UsICRzdGF0ZVBhcmFtcyl7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIERhdGFTZXJ2aWNlLmdldE9uZSgnbmF0aW9ucycsICRzdGF0ZVBhcmFtcy5pdGVtKS4kb2JqZWN0O1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9Ki9cblx0XHRcdH0pXG5cdFx0XHQuc3RhdGUoJ2FwcC5pbmRleC5zaG93LnNlbGVjdGVkLmNvbXBhcmUnLCB7XG5cdFx0XHRcdHVybDogJy9jb21wYXJlLzpjb3VudHJpZXMnXG5cdFx0XHR9KVxuXHRcdFx0LnN0YXRlKCdhcHAuaW1wb3J0Y3N2Jywge1xuXHRcdFx0XHR1cmw6ICcvaW1wb3J0ZXInLFxuXHRcdFx0XHRkYXRhOiB7XG5cdFx0XHRcdFx0cGFnZU5hbWU6ICdJbXBvcnQgQ1NWJ1xuXHRcdFx0XHR9LFxuXHRcdFx0XHR2aWV3czoge1xuXHRcdFx0XHRcdCdtYWluQCc6IHtcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdpbXBvcnRjc3YnKVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0J21hcCc6IHt9XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXG5cblxuXHR9KTtcbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5yb3V0ZXMnKS5ydW4oZnVuY3Rpb24oJHJvb3RTY29wZSwgJG1kU2lkZW5hdil7XG5cdFx0JHJvb3RTY29wZS4kb24oXCIkc3RhdGVDaGFuZ2VTdGFydFwiLCBmdW5jdGlvbihldmVudCwgdG9TdGF0ZSl7XG5cblx0XHRcdGlmICh0b1N0YXRlLmRhdGEgJiYgdG9TdGF0ZS5kYXRhLnBhZ2VOYW1lKXtcblx0XHRcdFx0JHJvb3RTY29wZS5jdXJyZW50X3BhZ2UgPSB0b1N0YXRlLmRhdGEucGFnZU5hbWU7XG5cdFx0XHR9XG5cdFx0XHQgJHJvb3RTY29wZS5zdGF0ZUlzTG9hZGluZyA9IHRydWU7XG5cdFx0fSk7XG5cdFx0JHJvb3RTY29wZS4kb24oXCIkdmlld0NvbnRlbnRMb2FkZWRcIiwgZnVuY3Rpb24oZXZlbnQsIHRvU3RhdGUpe1xuXG5cdFx0fSk7XG5cblx0XHQkcm9vdFNjb3BlLiRvbihcIiRzdGF0ZUNoYW5nZVN1Y2Nlc3NcIiwgZnVuY3Rpb24oZXZlbnQsIHRvU3RhdGUpe1xuXHRcdFx0JHJvb3RTY29wZS5zdGF0ZUlzTG9hZGluZyA9IGZhbHNlO1xuXHRcdH0pO1xuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbiAoKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29uZmlnJykuY29uZmlnKGZ1bmN0aW9uICgkYXV0aFByb3ZpZGVyKXtcbiAgICAgICAgLy8gU2F0ZWxsaXplciBjb25maWd1cmF0aW9uIHRoYXQgc3BlY2lmaWVzIHdoaWNoIEFQSVxuICAgICAgICAvLyByb3V0ZSB0aGUgSldUIHNob3VsZCBiZSByZXRyaWV2ZWQgZnJvbVxuICAgICAgICAkYXV0aFByb3ZpZGVyLmxvZ2luVXJsID0gJy9hcGkvYXV0aGVudGljYXRlL2F1dGgnO1xuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbmZpZycpLmNvbmZpZyhmdW5jdGlvbiAoY2ZwTG9hZGluZ0JhclByb3ZpZGVyKXtcblx0XHRjZnBMb2FkaW5nQmFyUHJvdmlkZXIuaW5jbHVkZVNwaW5uZXIgPSBmYWxzZTtcblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb25maWcnKS5jb25maWcoIGZ1bmN0aW9uKFJlc3Rhbmd1bGFyUHJvdmlkZXIpIHtcblx0XHRSZXN0YW5ndWxhclByb3ZpZGVyXG5cdFx0LnNldEJhc2VVcmwoJy9hcGkvJylcblx0XHQuc2V0RGVmYXVsdEhlYWRlcnMoeyBhY2NlcHQ6IFwiYXBwbGljYXRpb24veC5sYXJhdmVsLnYxK2pzb25cIiB9KTtcblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb25maWcnKS5jb25maWcoZnVuY3Rpb24oJG1kVGhlbWluZ1Byb3ZpZGVyKSB7XG5cdFx0LyogRm9yIG1vcmUgaW5mbywgdmlzaXQgaHR0cHM6Ly9tYXRlcmlhbC5hbmd1bGFyanMub3JnLyMvVGhlbWluZy8wMV9pbnRyb2R1Y3Rpb24gKi9cblx0dmFyIG5lb25UZWFsTWFwID0gJG1kVGhlbWluZ1Byb3ZpZGVyLmV4dGVuZFBhbGV0dGUoJ3RlYWwnLCB7XG4gICAgJzUwMCc6ICcwMGNjYWEnLFxuXHRcdCdBMjAwJzogJzAwY2NhYSdcbiAgfSk7XG5cdHZhciB3aGl0ZU1hcCA9ICRtZFRoZW1pbmdQcm92aWRlci5leHRlbmRQYWxldHRlKCd0ZWFsJywge1xuICAgICc1MDAnOiAnMDBjY2FhJyxcblx0XHQnQTIwMCc6ICcjZmZmJ1xuICB9KTtcblx0dmFyIGJsdWVNYXAgPSAkbWRUaGVtaW5nUHJvdmlkZXIuZXh0ZW5kUGFsZXR0ZSgnYmx1ZScsIHtcbiAgICAnNTAwJzogJyMwMDZiYjknLFxuXHRcdCdBMjAwJzogJyMwMDZiYjknXG4gIH0pO1xuXHQkbWRUaGVtaW5nUHJvdmlkZXIuZGVmaW5lUGFsZXR0ZSgnbmVvblRlYWwnLCBuZW9uVGVhbE1hcCk7XG5cdCRtZFRoZW1pbmdQcm92aWRlci5kZWZpbmVQYWxldHRlKCd3aGl0ZVRlYWwnLCB3aGl0ZU1hcCk7XG5cdCRtZFRoZW1pbmdQcm92aWRlci5kZWZpbmVQYWxldHRlKCdibHVlcicsIGJsdWVNYXApO1xuXHRcdCRtZFRoZW1pbmdQcm92aWRlci50aGVtZSgnZGVmYXVsdCcpXG5cdFx0LnByaW1hcnlQYWxldHRlKCduZW9uVGVhbCcpXG5cdFx0LmFjY2VudFBhbGV0dGUoJ2JsdWVyJyk7XG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbmZpZycpLmNvbmZpZyhmdW5jdGlvbih0b2FzdHJDb25maWcpe1xuICAgICAgICAvL1xuICAgICAgICBhbmd1bGFyLmV4dGVuZCh0b2FzdHJDb25maWcsIHtcbiAgICAgICAgICBhdXRvRGlzbWlzczogZmFsc2UsXG4gICAgICAgICAgY29udGFpbmVySWQ6ICd0b2FzdC1jb250YWluZXInLFxuICAgICAgICAgIG1heE9wZW5lZDogMCxcbiAgICAgICAgICBuZXdlc3RPblRvcDogdHJ1ZSxcbiAgICAgICAgICBwb3NpdGlvbkNsYXNzOiAndG9hc3QtYm90dG9tLXJpZ2h0JyxcbiAgICAgICAgICBwcmV2ZW50RHVwbGljYXRlczogZmFsc2UsXG4gICAgICAgICAgcHJldmVudE9wZW5EdXBsaWNhdGVzOiBmYWxzZSxcbiAgICAgICAgICB0YXJnZXQ6ICdib2R5JyxcbiAgICAgICAgICBjbG9zZUJ1dHRvbjogdHJ1ZVxuICAgICAgICB9KTtcbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5maWx0ZXJzJykuZmlsdGVyKCAnYWxwaGFudW0nLCBmdW5jdGlvbigpe1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oIGlucHV0ICl7XG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgaWYgKCAhaW5wdXQgKXtcbiAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gaW5wdXQucmVwbGFjZSgvKFteMC05QS1aXSkvZyxcIlwiKTtcblxuICAgICAgICB9XG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5maWx0ZXJzJykuZmlsdGVyKCAnY2FwaXRhbGl6ZScsIGZ1bmN0aW9uKCl7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uKGlucHV0LCBhbGwpIHtcblx0XHRcdHJldHVybiAoISFpbnB1dCkgPyBpbnB1dC5yZXBsYWNlKC8oW15cXFdfXStbXlxccy1dKikgKi9nLGZ1bmN0aW9uKHR4dCl7XG5cdFx0XHRcdHJldHVybiB0eHQuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyB0eHQuc3Vic3RyKDEpLnRvTG93ZXJDYXNlKCk7XG5cdFx0XHR9KSA6ICcnO1xuXHRcdH07XG5cdH0pO1xufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmZpbHRlcnMnKS5maWx0ZXIoICdodW1hblJlYWRhYmxlJywgZnVuY3Rpb24oKXtcblx0XHRyZXR1cm4gZnVuY3Rpb24gaHVtYW5pemUoc3RyKSB7XG5cdFx0XHRpZiAoICFzdHIgKXtcblx0XHRcdFx0cmV0dXJuICcnO1xuXHRcdFx0fVxuXHRcdFx0dmFyIGZyYWdzID0gc3RyLnNwbGl0KCdfJyk7XG5cdFx0XHRmb3IgKHZhciBpPTA7IGk8ZnJhZ3MubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0ZnJhZ3NbaV0gPSBmcmFnc1tpXS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIGZyYWdzW2ldLnNsaWNlKDEpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGZyYWdzLmpvaW4oJyAnKTtcblx0XHR9O1xuXHR9KTtcbn0pKCk7IiwiKGZ1bmN0aW9uKCl7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5maWx0ZXJzJykuZmlsdGVyKCd0cnVuY2F0ZUNoYXJhY3RlcnMnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoaW5wdXQsIGNoYXJzLCBicmVha09uV29yZCkge1xuICAgICAgICAgICAgaWYgKGlzTmFOKGNoYXJzKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpbnB1dDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChjaGFycyA8PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICcnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGlucHV0ICYmIGlucHV0Lmxlbmd0aCA+IGNoYXJzKSB7XG4gICAgICAgICAgICAgICAgaW5wdXQgPSBpbnB1dC5zdWJzdHJpbmcoMCwgY2hhcnMpO1xuXG4gICAgICAgICAgICAgICAgaWYgKCFicmVha09uV29yZCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgbGFzdHNwYWNlID0gaW5wdXQubGFzdEluZGV4T2YoJyAnKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gR2V0IGxhc3Qgc3BhY2VcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxhc3RzcGFjZSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlucHV0ID0gaW5wdXQuc3Vic3RyKDAsIGxhc3RzcGFjZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB3aGlsZSAoaW5wdXQuY2hhckF0KGlucHV0Lmxlbmd0aC0xKSA9PT0gJyAnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbnB1dCA9IGlucHV0LnN1YnN0cigwLCBpbnB1dC5sZW5ndGggLSAxKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gaW5wdXQgKyAnLi4uJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBpbnB1dDtcbiAgICAgICAgfTtcbiAgICB9KTtcbn0pKCk7IiwiKGZ1bmN0aW9uKCl7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5maWx0ZXJzJykuZmlsdGVyKCd0cnVuY2F0ZVdvcmRzJywgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGlucHV0LCB3b3Jkcykge1xuICAgICAgICAgICAgaWYgKGlzTmFOKHdvcmRzKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpbnB1dDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh3b3JkcyA8PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICcnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGlucHV0KSB7XG4gICAgICAgICAgICAgICAgdmFyIGlucHV0V29yZHMgPSBpbnB1dC5zcGxpdCgvXFxzKy8pO1xuICAgICAgICAgICAgICAgIGlmIChpbnB1dFdvcmRzLmxlbmd0aCA+IHdvcmRzKSB7XG4gICAgICAgICAgICAgICAgICAgIGlucHV0ID0gaW5wdXRXb3Jkcy5zbGljZSgwLCB3b3Jkcykuam9pbignICcpICsgJy4uLic7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGlucHV0O1xuICAgICAgICB9O1xuICAgIH0pO1xufSkoKTsiLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5maWx0ZXJzJykuZmlsdGVyKCAndHJ1c3RIdG1sJywgZnVuY3Rpb24oICRzY2UgKXtcblx0XHRyZXR1cm4gZnVuY3Rpb24oIGh0bWwgKXtcblx0XHRcdHJldHVybiAkc2NlLnRydXN0QXNIdG1sKGh0bWwpO1xuXHRcdH07XG5cdH0pO1xufSkoKTsiLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5maWx0ZXJzJykuZmlsdGVyKCd1Y2ZpcnN0JywgZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uKCBpbnB1dCApIHtcblx0XHRcdGlmICggIWlucHV0ICl7XG5cdFx0XHRcdHJldHVybiBudWxsO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGlucHV0LnN1YnN0cmluZygwLCAxKS50b1VwcGVyQ2FzZSgpICsgaW5wdXQuc3Vic3RyaW5nKDEpO1xuXHRcdH07XG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLnNlcnZpY2VzJykuZmFjdG9yeSgnRGF0YVNlcnZpY2UnLCBEYXRhU2VydmljZSk7XG4gICAgRGF0YVNlcnZpY2UuJGluamVjdCA9IFsnUmVzdGFuZ3VsYXInLCd0b2FzdHInXTtcblxuICAgIGZ1bmN0aW9uIERhdGFTZXJ2aWNlKFJlc3Rhbmd1bGFyLCB0b2FzdHIpe1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGdldEFsbDogZ2V0QWxsLFxuICAgICAgICAgIGdldE9uZTogZ2V0T25lLFxuICAgICAgICAgIHBvc3Q6IHBvc3RcbiAgICAgICAgfTtcblxuICAgICAgICBmdW5jdGlvbiBnZXRBbGwocm91dGUpe1xuICAgICAgICAgIHZhciBkYXRhID0gUmVzdGFuZ3VsYXIuYWxsKHJvdXRlKS5nZXRMaXN0KCk7XG4gICAgICAgICAgICBkYXRhLnRoZW4oZnVuY3Rpb24oKXt9LCBmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgICAgICAgdG9hc3RyLmVycm9yKGRhdGEuc3RhdHVzVGV4dCwgJ0Nvbm5lY3Rpb24gRXJyb3InKTtcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGdldE9uZShyb3V0ZSwgaWQpe1xuICAgICAgICAgIHJldHVybiBSZXN0YW5ndWxhci5vbmUocm91dGUsIGlkKS5nZXQoKTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBwb3N0KHJvdXRlLCBkYXRhKXtcbiAgICAgICAgICByZXR1cm4gUmVzdGFuZ3VsYXIuYWxsKHJvdXRlKS5wb3N0KGRhdGEpO1xuICAgICAgICB9XG4gICAgfVxuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKFwiYXBwLnNlcnZpY2VzXCIpLmZhY3RvcnkoJ0RpYWxvZ1NlcnZpY2UnLCBmdW5jdGlvbigkbWREaWFsb2cpe1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdGZyb21UZW1wbGF0ZTogZnVuY3Rpb24odGVtcGxhdGUsICRzY29wZSl7XG5cblx0XHRcdFx0dmFyIG9wdGlvbnMgPSB7XG5cdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICcuL3ZpZXdzL2RpYWxvZ3MvJyArIHRlbXBsYXRlICsgJy8nICsgdGVtcGxhdGUgKyAnLmh0bWwnXG5cdFx0XHRcdH07XG5cblx0XHRcdFx0aWYgKCRzY29wZSl7XG5cdFx0XHRcdFx0b3B0aW9ucy5zY29wZSA9ICRzY29wZS4kbmV3KCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm4gJG1kRGlhbG9nLnNob3cob3B0aW9ucyk7XG5cdFx0XHR9LFxuXG5cdFx0XHRoaWRlOiBmdW5jdGlvbigpe1xuXHRcdFx0XHRyZXR1cm4gJG1kRGlhbG9nLmhpZGUoKTtcblx0XHRcdH0sXG5cblx0XHRcdGFsZXJ0OiBmdW5jdGlvbih0aXRsZSwgY29udGVudCl7XG5cdFx0XHRcdCRtZERpYWxvZy5zaG93KFxuXHRcdFx0XHRcdCRtZERpYWxvZy5hbGVydCgpXG5cdFx0XHRcdFx0XHQudGl0bGUodGl0bGUpXG5cdFx0XHRcdFx0XHQuY29udGVudChjb250ZW50KVxuXHRcdFx0XHRcdFx0Lm9rKCdPaycpXG5cdFx0XHRcdCk7XG5cdFx0XHR9LFxuXG5cdFx0XHRjb25maXJtOiBmdW5jdGlvbih0aXRsZSwgY29udGVudCkge1xuXHRcdFx0XHRyZXR1cm4gJG1kRGlhbG9nLnNob3coXG5cdFx0XHRcdFx0JG1kRGlhbG9nLmNvbmZpcm0oKVxuXHRcdFx0XHRcdFx0LnRpdGxlKHRpdGxlKVxuXHRcdFx0XHRcdFx0LmNvbnRlbnQoY29udGVudClcblx0XHRcdFx0XHRcdC5vaygnT2snKVxuXHRcdFx0XHRcdFx0LmNhbmNlbCgnQ2FuY2VsJylcblx0XHRcdFx0KTtcblx0XHRcdH1cblx0XHR9O1xuXHR9KTtcbn0pKCk7IiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLnNlcnZpY2VzJykuZmFjdG9yeSgnSWNvbnNTZXJ2aWNlJywgZnVuY3Rpb24oKXtcbiAgICAgICAgdmFyIHVuaWNvZGVzID0ge1xuICAgICAgICAgICdlbXB0eSc6IFwiXFx1ZTYwMFwiLFxuICAgICAgICAgICdhZ3Jhcic6IFwiXFx1ZTYwMFwiLFxuICAgICAgICAgICdhbmNob3InOiBcIlxcdWU2MDFcIixcbiAgICAgICAgICAnYnV0dGVyZmx5JzogXCJcXHVlNjAyXCIsXG4gICAgICAgICAgJ2VuZXJneSc6XCJcXHVlNjAzXCIsXG4gICAgICAgICAgJ3NpbmsnOiBcIlxcdWU2MDRcIixcbiAgICAgICAgICAnbWFuJzogXCJcXHVlNjA1XCIsXG4gICAgICAgICAgJ2ZhYnJpYyc6IFwiXFx1ZTYwNlwiLFxuICAgICAgICAgICd0cmVlJzpcIlxcdWU2MDdcIixcbiAgICAgICAgICAnd2F0ZXInOlwiXFx1ZTYwOFwiXG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZ2V0VW5pY29kZTogZnVuY3Rpb24oaWNvbil7XG4gICAgICAgICAgICByZXR1cm4gdW5pY29kZXNbaWNvbl07XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoXCJhcHAuc2VydmljZXNcIikuZmFjdG9yeSgnVG9hc3RTZXJ2aWNlJywgZnVuY3Rpb24oJG1kVG9hc3Qpe1xuXG5cdFx0dmFyIGRlbGF5ID0gNjAwMCxcblx0XHRcdHBvc2l0aW9uID0gJ3RvcCByaWdodCcsXG5cdFx0XHRhY3Rpb24gPSAnT0snO1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHNob3c6IGZ1bmN0aW9uKGNvbnRlbnQpe1xuXHRcdFx0XHRpZiAoIWNvbnRlbnQpe1xuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiAkbWRUb2FzdC5zaG93KFxuXHRcdFx0XHRcdCRtZFRvYXN0LnNpbXBsZSgpXG5cdFx0XHRcdFx0XHQuY29udGVudChjb250ZW50KVxuXHRcdFx0XHRcdFx0LnBvc2l0aW9uKHBvc2l0aW9uKVxuXHRcdFx0XHRcdFx0LmFjdGlvbihhY3Rpb24pXG5cdFx0XHRcdFx0XHQuaGlkZURlbGF5KGRlbGF5KVxuXHRcdFx0XHQpO1xuXHRcdFx0fSxcblx0XHRcdGVycm9yOiBmdW5jdGlvbihjb250ZW50KXtcblx0XHRcdFx0aWYgKCFjb250ZW50KXtcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm4gJG1kVG9hc3Quc2hvdyhcblx0XHRcdFx0XHQkbWRUb2FzdC5zaW1wbGUoKVxuXHRcdFx0XHRcdFx0LmNvbnRlbnQoY29udGVudClcblx0XHRcdFx0XHRcdC5wb3NpdGlvbihwb3NpdGlvbilcblx0XHRcdFx0XHRcdC50aGVtZSgnd2FybicpXG5cdFx0XHRcdFx0XHQuYWN0aW9uKGFjdGlvbilcblx0XHRcdFx0XHRcdC5oaWRlRGVsYXkoZGVsYXkpXG5cdFx0XHRcdCk7XG5cdFx0XHR9XG5cdFx0fTtcblx0fSk7XG59KSgpOyIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5zZXJ2aWNlcycpLmZhY3RvcnkoJ1ZlY3RvcmxheWVyU2VydmljZScsIGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgcmV0dXJue1xuICAgICAgICAgIGRhdGE6e1xuICAgICAgICAgICAgbGF5ZXI6ICcnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgc2V0TGF5ZXI6IGZ1bmN0aW9uKGwpe1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGF0YS5sYXllciA9IGw7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBnZXRMYXllcjogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmRhdGEubGF5ZXI7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0hlYWRlckN0cmwnLCBmdW5jdGlvbigkc2NvcGUsICRyb290U2NvcGUsICRhdXRoLCB0b2FzdHIpe1xuXG5cdFx0dmFyIHZtID0gdGhpcztcblx0XHR2bS5pc0F1dGhlbnRpY2F0ZWQgPSBpc0F1dGhlbnRpY2F0ZWQ7XG5cdFx0dm0uZG9Mb2dvdXQgPSBkb0xvZ291dDtcblx0XHR2bS5vcGVuTWVudSA9IG9wZW5NZW51O1xuXG5cdFx0ZnVuY3Rpb24gaXNBdXRoZW50aWNhdGVkKCl7XG5cdFx0XHQgcmV0dXJuICRhdXRoLmlzQXV0aGVudGljYXRlZCgpO1xuXHRcdH1cblx0XHRmdW5jdGlvbiBkb0xvZ291dCgpe1xuXHRcdFx0aWYoJGF1dGguaXNBdXRoZW50aWNhdGVkKCkpe1xuXHRcdFx0XHQkYXV0aC5sb2dvdXQoKS50aGVuKGZ1bmN0aW9uKGRhdGEpe1xuXHRcdFx0XHRcdHRvYXN0ci5zdWNjZXNzKCdZb3UgaGF2ZSBzdWNjZXNzZnVsbHkgbG9nZ2VkIG91dCcpO1xuXHRcdFx0XHR9KS5jYXRjaChmdW5jdGlvbihyZXNwb25zZSl7XG5cblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHZhciBvcmlnaW5hdG9yRXY7XG4gICAgZnVuY3Rpb24gb3Blbk1lbnUoJG1kT3Blbk1lbnUsIGV2KSB7XG4gICAgICBvcmlnaW5hdG9yRXYgPSBldjtcbiAgICAgICRtZE9wZW5NZW51KGV2KTtcbiAgICB9O1xuXHRcdCRzY29wZS4kd2F0Y2goZnVuY3Rpb24oKXtcblx0XHRcdHJldHVybiAkcm9vdFNjb3BlLmN1cnJlbnRfcGFnZTtcblx0XHR9LCBmdW5jdGlvbihuZXdQYWdlKXtcblx0XHRcdCRzY29wZS5jdXJyZW50X3BhZ2UgPSBuZXdQYWdlIHx8ICdQYWdlIE5hbWUnO1xuXHRcdH0pO1xuXG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0ltcG9ydGNzdkN0cmwnLCBmdW5jdGlvbiAoJG1kRGlhbG9nKSB7XG5cdFx0dGhpcy5zZXR0aW5ncyA9IHtcblx0XHRcdHByaW50TGF5b3V0OiB0cnVlLFxuXHRcdFx0c2hvd1J1bGVyOiB0cnVlLFxuXHRcdFx0c2hvd1NwZWxsaW5nU3VnZ2VzdGlvbnM6IHRydWUsXG5cdFx0XHRwcmVzZW50YXRpb25Nb2RlOiAnZWRpdCdcblx0XHR9O1xuXG5cdFx0dGhpcy5zYW1wbGVBY3Rpb24gPSBmdW5jdGlvbiAobmFtZSwgZXYpIHtcblx0XHRcdCRtZERpYWxvZy5zaG93KCRtZERpYWxvZy5hbGVydCgpXG5cdFx0XHRcdC50aXRsZShuYW1lKVxuXHRcdFx0XHQuY29udGVudCgnWW91IHRyaWdnZXJlZCB0aGUgXCInICsgbmFtZSArICdcIiBhY3Rpb24nKVxuXHRcdFx0XHQub2soJ0dyZWF0Jylcblx0XHRcdFx0LnRhcmdldEV2ZW50KGV2KVxuXHRcdFx0KTtcblx0XHR9O1xuXG4gICAgdGhpcy5vcGVuQ3N2VXBsb2FkID0gZnVuY3Rpb24oKSB7XG5cdFx0XHQkbWREaWFsb2cuc2hvdyh7XG5cdFx0XHRcdFx0Ly9jb250cm9sbGVyOiBEaWFsb2dDb250cm9sbGVyLFxuXHRcdFx0XHRcdHRlbXBsYXRlVXJsOiAnL3ZpZXdzL2FwcC9pbXBvcnRjc3YvY3N2VXBsb2FkRGlhbG9nLmh0bWwnLFxuXHQgICAgICAgIGJpbmRUb0NvbnRyb2xsZXI6IHRydWUsXG5cdFx0XHRcdH0pXG5cdFx0XHRcdC50aGVuKGZ1bmN0aW9uIChhbnN3ZXIpIHtcblxuXHRcdFx0XHR9LCBmdW5jdGlvbiAoKSB7XG5cblx0XHRcdFx0fSk7XG5cdFx0fTtcblx0fSlcblxuXG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0luZGV4Q3RybCcsIGZ1bmN0aW9uICgkc2NvcGUsICR3aW5kb3csICRyb290U2NvcGUsJGZpbHRlciwgJHN0YXRlLCAkdGltZW91dCwgVG9hc3RTZXJ2aWNlLCBWZWN0b3JsYXllclNlcnZpY2UsIGluaXRpYWxEYXRhLCBsZWFmbGV0RGF0YSwgRGF0YVNlcnZpY2UpIHtcblx0XHQvLyBWYXJpYWJsZSBkZWZpbml0aW9uc1xuXHRcdHZhciB2bSA9IHRoaXM7XG5cdFx0dm0ubWFwID0gbnVsbDtcblxuXHRcdHZtLmRhdGFTZXJ2ZXIgPSBpbml0aWFsRGF0YS5kYXRhO1xuXHRcdHZtLnN0cnVjdHVyZVNlcnZlciA9IGluaXRpYWxEYXRhLmluZGV4ZXI7XG5cdFx0dm0uc3RydWN0dXJlID0gXCJcIjtcblx0XHR2bS5tdnRTY291cmNlID0gVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldExheWVyKCk7XG5cdFx0dm0ubm9kZVBhcmVudCA9IHt9O1xuXHRcdHZtLnNlbGVjdGVkVGFiID0gMDtcblx0XHR2bS5jdXJyZW50ID0gXCJcIjtcblx0XHR2bS50YWJDb250ZW50ID0gXCJcIjtcblx0XHR2bS50b2dnbGVCdXR0b24gPSAnYXJyb3dfZHJvcF9kb3duJztcblx0XHR2bS5tZW51ZU9wZW4gPSB0cnVlO1xuXHRcdHZtLmluZm8gPSBmYWxzZTtcblx0XHR2bS5jbG9zZUljb24gPSAnY2xvc2UnO1xuXHRcdHZtLmNvbXBhcmUgPSB7XG5cdFx0XHRhY3RpdmU6IGZhbHNlLFxuXHRcdFx0Y291bnRyaWVzOiBbXVxuXHRcdH07XG5cdFx0dm0uZGlzcGxheSA9IHtcblx0XHRcdHNlbGVjdGVkQ2F0OiAnJ1xuXHRcdH07XG5cblx0XHQvL0Z1bmN0aW9uIGRlZmluaXRvbnNcblx0XHR2bS5zaG93VGFiQ29udGVudCA9IHNob3dUYWJDb250ZW50O1xuXHRcdHZtLnNldFRhYiA9IHNldFRhYjtcblx0XHR2bS5zZXRTdGF0ZSA9IHNldFN0YXRlO1xuXHRcdHZtLnNldEN1cnJlbnQgPSBzZXRDdXJyZW50O1xuXHRcdHZtLnNldFNlbGVjdGVkRmVhdHVyZSA9IHNldFNlbGVjdGVkRmVhdHVyZTtcblx0XHR2bS5nZXRSYW5rID0gZ2V0UmFuaztcblx0XHR2bS5nZXRPZmZzZXQgPSBnZXRPZmZzZXQ7XG5cdFx0dm0uZ2V0VGVuZGVuY3kgPSBnZXRUZW5kZW5jeTtcblxuXHRcdHZtLmNoZWNrQ29tcGFyaXNvbiA9IGNoZWNrQ29tcGFyaXNvbjtcblx0XHR2bS50b2dnbGVPcGVuID0gdG9nZ2xlT3Blbjtcblx0XHR2bS50b2dnbGVJbmZvID0gdG9nZ2xlSW5mbztcblx0XHR2bS50b2dnbGVEZXRhaWxzID0gdG9nZ2xlRGV0YWlscztcblx0XHR2bS50b2dnbGVDb21wYXJpc29uID0gdG9nZ2xlQ29tcGFyaXNvbjtcblx0XHR2bS50b2dnbGVDb3VudHJpZUxpc3QgPSB0b2dnbGVDb3VudHJpZUxpc3Q7XG5cdFx0dm0ubWFwR290b0NvdW50cnkgPSBtYXBHb3RvQ291bnRyeTtcblx0XHR2bS5nb0JhY2sgPSBnb0JhY2s7XG5cblx0XHR2bS5jYWxjVHJlZSA9IGNhbGNUcmVlO1xuXG5cdFx0YWN0aXZhdGUoKTtcblxuXHRcdGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xuXG5cdFx0XHR2bS5zdHJ1Y3R1cmVTZXJ2ZXIudGhlbihmdW5jdGlvbihzdHJ1Y3R1cmUpe1xuXHRcdFx0XHR2bS5kYXRhU2VydmVyLnRoZW4oZnVuY3Rpb24oZGF0YSl7XG5cdFx0XHRcdFx0dm0uZGF0YSA9IGRhdGE7XG5cdFx0XHRcdFx0dm0uc3RydWN0dXJlID0gc3RydWN0dXJlLmRhdGE7XG5cdFx0XHRcdFx0Y3JlYXRlQ2FudmFzKCk7XG5cdFx0XHRcdFx0ZHJhd0NvdW50cmllcygpO1xuXHRcdFx0XHRcdGlmKCRzdGF0ZS5wYXJhbXMuaXRlbSl7XG5cdFx0XHRcdFx0XHR2bS5zZXRTdGF0ZSgkc3RhdGUucGFyYW1zLml0ZW0pO1xuXHRcdFx0XHRcdFx0Y2FsY1JhbmsoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYoJHN0YXRlLnBhcmFtcy5jb3VudHJpZXMpe1xuXHRcdFx0XHRcdFx0dm0uc2V0VGFiKDIpO1xuXHRcdFx0XHRcdFx0dm0uY29tcGFyZS5jb3VudHJpZXMucHVzaCh2bS5jdXJyZW50KTtcblx0XHRcdFx0XHRcdHZtLmNvbXBhcmUuYWN0aXZlID0gdHJ1ZTtcblx0XHRcdFx0XHRcdCRyb290U2NvcGUuZ3JleWVkID0gdHJ1ZTtcblx0XHRcdFx0XHRcdHZhciBjb3VudHJpZXMgPSAkc3RhdGUucGFyYW1zLmNvdW50cmllcy5zcGxpdCgnLXZzLScpO1xuXHRcdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKGNvdW50cmllcywgZnVuY3Rpb24oaXNvKXtcblx0XHRcdFx0XHRcdFx0dm0uY29tcGFyZS5jb3VudHJpZXMucHVzaChnZXROYXRpb25CeUlzbyhpc28pKTtcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0Y29uc29sZS5sb2codm0uY29tcGFyZS5jb3VudHJpZXMpO1xuXHRcdFx0XHRcdFx0Y291bnRyaWVzLnB1c2godm0uY3VycmVudFt2bS5zdHJ1Y3R1cmUuaXNvXSk7XG5cdFx0XHRcdFx0XHREYXRhU2VydmljZS5nZXRPbmUoJ25hdGlvbnMvYmJveCcsIGNvdW50cmllcykudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuXHRcdFx0XHRcdFx0XHR2bS5iYm94ID0gZGF0YTtcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSlcblx0XHRcdH0pO1xuXG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gZ29CYWNrKCl7XG5cdFx0XHQkd2luZG93Lmhpc3RvcnkuYmFjaygpO1xuXHRcdH1cblx0XHRmdW5jdGlvbiBzaG93VGFiQ29udGVudChjb250ZW50KSB7XG5cdFx0XHRpZiAoY29udGVudCA9PSAnJyAmJiB2bS50YWJDb250ZW50ID09ICcnKSB7XG5cdFx0XHRcdHZtLnRhYkNvbnRlbnQgPSAncmFuayc7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR2bS50YWJDb250ZW50ID0gY29udGVudDtcblx0XHRcdH1cblx0XHRcdHZtLnRvZ2dsZUJ1dHRvbiA9IHZtLnRhYkNvbnRlbnQgPyAnYXJyb3dfZHJvcF91cCcgOiAnYXJyb3dfZHJvcF9kb3duJztcblx0XHR9O1xuXHRcdGZ1bmN0aW9uIHNldFN0YXRlKGl0ZW0pIHtcblx0XHRcdHZtLnNldEN1cnJlbnQoZ2V0TmF0aW9uQnlJc28oaXRlbSkpO1xuXHRcdFx0ZmV0Y2hOYXRpb25EYXRhKGl0ZW0pO1xuXHRcdH07XG5cblx0XHRmdW5jdGlvbiB0b2dnbGVPcGVuKCkge1xuXHRcdFx0dm0ubWVudWVPcGVuID0gIXZtLm1lbnVlT3Blbjtcblx0XHRcdHZtLmNsb3NlSWNvbiA9IHZtLm1lbnVlT3BlbiA9PSB0cnVlID8gJ2NoZXZyb25fbGVmdCcgOiAnY2hldnJvbl9yaWdodCc7XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIHNldEN1cnJlbnQobmF0KSB7XG5cdFx0XHR2bS5jdXJyZW50ID0gbmF0O1xuXHRcdFx0dm0uc2V0U2VsZWN0ZWRGZWF0dXJlKCk7XG5cdFx0fTtcblxuXHRcdGZ1bmN0aW9uIHNldFNlbGVjdGVkRmVhdHVyZShpc28pIHtcblx0XHRcdGlmICh2bS5tdnRTb3VyY2UpIHtcblx0XHRcdFx0JHRpbWVvdXQoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdHZtLm12dFNvdXJjZS5sYXllcnMuY291bnRyaWVzX2JpZ19nZW9tLmZlYXR1cmVzW3ZtLmN1cnJlbnRbdm0uc3RydWN0dXJlLmlzb11dLnNlbGVjdGVkID0gdHJ1ZTtcblx0XHRcdFx0fSlcblx0XHRcdH1cblx0XHR9O1xuXHRcdGZ1bmN0aW9uIGNhbGNSYW5rKCkge1xuXHRcdFx0aWYoIXZtLmN1cnJlbnQpe1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0XHR2YXIgcmFuayA9IDA7XG5cdFx0XHRhbmd1bGFyLmZvckVhY2godm0uZGF0YSwgZnVuY3Rpb24oaXRlbSkge1xuXHRcdFx0XHRpdGVtW3ZtLnN0cnVjdHVyZS5zY29yZV9maWVsZF9uYW1lXSA9IHBhcnNlRmxvYXQoaXRlbVt2bS5zdHJ1Y3R1cmUuc2NvcmVfZmllbGRfbmFtZV0pO1xuXHRcdFx0XHRpdGVtWydzY29yZSddID0gcGFyc2VGbG9hdChpdGVtWydzY29yZSddKTtcblx0XHRcdH0pXG5cdFx0XHR2YXIgZmlsdGVyID0gJGZpbHRlcignb3JkZXJCeScpKHZtLmRhdGEsIFt2bS5zdHJ1Y3R1cmUuc2NvcmVfZmllbGRfbmFtZSwgXCJzY29yZVwiXSwgdHJ1ZSk7XG5cdFx0XHRyYW5rID0gZmlsdGVyLmluZGV4T2Yodm0uY3VycmVudCkgKyAxO1xuXHRcdFx0dm0uY3VycmVudFt2bS5zdHJ1Y3R1cmUuc2NvcmVfZmllbGRfbmFtZSsnX3JhbmsnXSA9IHJhbms7XG5cdFx0XHR2bS5jaXJjbGVPcHRpb25zID0ge1xuXHRcdFx0XHRcdGNvbG9yOnZtLnN0cnVjdHVyZS5jb2xvcixcblx0XHRcdFx0XHRmaWVsZDp2bS5zdHJ1Y3R1cmUuc2NvcmVfZmllbGRfbmFtZSsnX3JhbmsnXG5cdFx0XHR9O1xuXHRcdH1cblx0XHRmdW5jdGlvbiBnZXRSYW5rKGNvdW50cnkpe1xuXHRcdFx0dmFyIGZpbHRlciA9ICRmaWx0ZXIoJ29yZGVyQnknKSh2bS5kYXRhLCBbdm0uc3RydWN0dXJlLnNjb3JlX2ZpZWxkX25hbWUsIFwic2NvcmVcIl0sIHRydWUpO1xuXHRcdFx0dmFyIHJhbmsgPSBmaWx0ZXIuaW5kZXhPZihjb3VudHJ5KSArIDE7XG5cdFx0XHRyZXR1cm4gcmFuaztcblx0XHR9XG5cdFx0ZnVuY3Rpb24gdG9nZ2xlSW5mbygpIHtcblx0XHRcdHZtLmluZm8gPSAhdm0uaW5mbztcblx0XHR9O1xuXG5cdFx0ZnVuY3Rpb24gdG9nZ2xlRGV0YWlscygpIHtcblx0XHRcdHJldHVybiB2bS5kZXRhaWxzID0gIXZtLmRldGFpbHM7XG5cdFx0fTtcblx0XHRmdW5jdGlvbiBmZXRjaE5hdGlvbkRhdGEoaXNvKXtcblx0XHRcdERhdGFTZXJ2aWNlLmdldE9uZSgnbmF0aW9ucycsIGlzbykudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuXHRcdFx0XHR2bS5jdXJyZW50LmRhdGEgPSBkYXRhLmRhdGE7XG5cdFx0XHRcdG1hcEdvdG9Db3VudHJ5KGlzbyk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdFx0ZnVuY3Rpb24gbWFwR290b0NvdW50cnkoaXNvKSB7XG5cdFx0XHRpZighJHN0YXRlLnBhcmFtcy5jb3VudHJpZXMpe1xuXHRcdFx0XHREYXRhU2VydmljZS5nZXRPbmUoJ25hdGlvbnMvYmJveCcsIFtpc29dKS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG5cdFx0XHRcdFx0dm0uYmJveCA9IGRhdGE7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gY2hlY2tDb21wYXJpc29uKHdhbnQpIHtcblx0XHRcdGlmICh3YW50ICYmICF2bS5jb21wYXJlLmFjdGl2ZSB8fCAhd2FudCAmJiB2bS5jb21wYXJlLmFjdGl2ZSkge1xuXHRcdFx0XHR2bS50b2dnbGVDb21wYXJpc29uKCk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gdG9nZ2xlQ29tcGFyaXNvbigpIHtcblx0XHRcdHZtLmNvbXBhcmUuY291bnRyaWVzID0gW3ZtLmN1cnJlbnRdO1xuXHRcdFx0dm0uY29tcGFyZS5hY3RpdmUgPSAhdm0uY29tcGFyZS5hY3RpdmU7XG5cdFx0XHRpZiAodm0uY29tcGFyZS5hY3RpdmUpIHtcblx0XHRcdFx0dm0uc2V0VGFiKDIpO1xuXHRcdFx0XHQkcm9vdFNjb3BlLmdyZXllZCA9IHRydWU7XG5cdFx0XHRcdHZtLm12dFNvdXJjZS5vcHRpb25zLm11dGV4VG9nZ2xlID0gZmFsc2U7XG5cdFx0XHRcdHZtLm12dFNvdXJjZS5zZXRTdHlsZShpbnZlcnRlZFN0eWxlKTtcblxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JHJvb3RTY29wZS5ncmV5ZWQgPSBmYWxzZTtcblx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLm12dFNvdXJjZS5sYXllcnMuY291bnRyaWVzX2JpZ19nZW9tLmZlYXR1cmVzLCBmdW5jdGlvbiAoZmVhdHVyZSkge1xuXHRcdFx0XHRcdGZlYXR1cmUuc2VsZWN0ZWQgPSBmYWxzZTtcblx0XHRcdFx0fSk7XG5cdFx0XHRcdHZtLm12dFNvdXJjZS5sYXllcnMuY291bnRyaWVzX2JpZ19nZW9tLmZlYXR1cmVzW3ZtLmN1cnJlbnRbdm0uc3RydWN0dXJlLmlzb11dLnNlbGVjdGVkID0gdHJ1ZTtcblx0XHRcdFx0dm0ubXZ0U291cmNlLm9wdGlvbnMubXV0ZXhUb2dnbGUgPSB0cnVlO1xuXHRcdFx0XHR2bS5tdnRTb3VyY2Uuc2V0U3R5bGUoY291bnRyaWVzU3R5bGUpO1xuXHRcdFx0XHREYXRhU2VydmljZS5nZXRPbmUoJ25hdGlvbnMvYmJveCcsIFt2bS5jdXJyZW50W3ZtLnN0cnVjdHVyZS5pc29dXSkudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuXHRcdFx0XHRcdHZtLmJib3ggPSBkYXRhO1xuXHRcdFx0XHR9KTtcblx0XHRcdFx0JHN0YXRlLmdvKCdhcHAuaW5kZXguc2hvdy5zZWxlY3RlZCcse1xuXHRcdFx0XHRcdGluZGV4OiRzdGF0ZS5wYXJhbXMuaW5kZXgsXG5cdFx0XHRcdFx0aXRlbTokc3RhdGUucGFyYW1zLml0ZW1cblx0XHRcdFx0fSlcblx0XHRcdH1cblx0XHRcdC8vdm0ubXZ0U291cmNlLnJlZHJhdygpO1xuXHRcdH07XG5cblx0XHRmdW5jdGlvbiB0b2dnbGVDb3VudHJpZUxpc3QoY291bnRyeSkge1xuXHRcdFx0dmFyIGZvdW5kID0gZmFsc2U7XG5cdFx0XHRhbmd1bGFyLmZvckVhY2godm0uY29tcGFyZS5jb3VudHJpZXMsIGZ1bmN0aW9uIChuYXQsIGtleSkge1xuXHRcdFx0XHRpZiAoY291bnRyeSA9PSBuYXQgJiYgbmF0ICE9IHZtLmN1cnJlbnQpIHtcblx0XHRcdFx0XHR2bS5jb21wYXJlLmNvdW50cmllcy5zcGxpY2Uoa2V5LCAxKTtcblx0XHRcdFx0XHRmb3VuZCA9IHRydWU7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdFx0aWYgKCFmb3VuZCkge1xuXHRcdFx0XHR2bS5jb21wYXJlLmNvdW50cmllcy5wdXNoKGNvdW50cnkpO1xuXHRcdFx0fTtcblx0XHRcdHZhciBpc29zID0gW107XG5cdFx0XHR2YXIgY29tcGFyZSA9IFtdO1xuXHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLmNvbXBhcmUuY291bnRyaWVzLCBmdW5jdGlvbiAoaXRlbSwga2V5KSB7XG5cdFx0XHRcdGlzb3MucHVzaChpdGVtW3ZtLnN0cnVjdHVyZS5pc29dKTtcblx0XHRcdFx0aWYoaXRlbVt2bS5zdHJ1Y3R1cmUuaXNvXSAhPSB2bS5jdXJyZW50W3ZtLnN0cnVjdHVyZS5pc29dKXtcblx0XHRcdFx0XHRjb21wYXJlLnB1c2goaXRlbVt2bS5zdHJ1Y3R1cmUuaXNvXSk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdFx0aWYgKGlzb3MubGVuZ3RoID4gMSkge1xuXHRcdFx0XHREYXRhU2VydmljZS5nZXRPbmUoJ25hdGlvbnMvYmJveCcsIGlzb3MpLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcblx0XHRcdFx0XHR2bS5iYm94ID0gZGF0YTtcblx0XHRcdFx0fSk7XG5cdFx0XHRcdCRzdGF0ZS5nbygnYXBwLmluZGV4LnNob3cuc2VsZWN0ZWQuY29tcGFyZScse1xuXHRcdFx0XHRcdGluZGV4OiAkc3RhdGUucGFyYW1zLmluZGV4LFxuXHRcdFx0XHRcdGl0ZW06ICRzdGF0ZS5wYXJhbXMuaXRlbSxcblx0XHRcdFx0XHRjb3VudHJpZXM6Y29tcGFyZS5qb2luKCctdnMtJylcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiAhZm91bmQ7XG5cdFx0fTtcblxuXHRcdGZ1bmN0aW9uIGdldE9mZnNldCgpIHtcblx0XHRcdGlmICghdm0uY3VycmVudCkge1xuXHRcdFx0XHRyZXR1cm4gMDtcblx0XHRcdH1cblx0XHRcdHJldHVybiAodm0uZ2V0UmFuayh2bS5jdXJyZW50KSAtIDIpICogMTY7XG5cdFx0fTtcblxuXHRcdGZ1bmN0aW9uIGdldFRlbmRlbmN5KCkge1xuXHRcdFx0aWYgKCF2bS5jdXJyZW50KSB7XG5cdFx0XHRcdHJldHVybiAnYXJyb3dfZHJvcF9kb3duJ1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHZtLmN1cnJlbnQucGVyY2VudF9jaGFuZ2UgPiAwID8gJ2Fycm93X2Ryb3BfdXAnIDogJ2Fycm93X2Ryb3BfZG93bic7XG5cdFx0fTtcblxuXHRcdGZ1bmN0aW9uIHNldFRhYihpKSB7XG5cdFx0XHR2bS5hY3RpdmVUYWIgPSBpO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGdldFBhcmVudChkYXRhKSB7XG5cdFx0XHR2YXIgaXRlbXMgPSBbXTtcblx0XHRcdGFuZ3VsYXIuZm9yRWFjaChkYXRhLmNoaWxkcmVuLCBmdW5jdGlvbiAoaXRlbSkge1xuXHRcdFx0XHRpZiAoaXRlbS5jb2x1bW5fbmFtZSA9PSB2bS5kaXNwbGF5LnNlbGVjdGVkQ2F0LnR5cGUpIHtcblx0XHRcdFx0XHR2bS5ub2RlUGFyZW50ID0gZGF0YTtcblx0XHRcdFx0fVxuXHRcdFx0XHRnZXRQYXJlbnQoaXRlbSk7XG5cdFx0XHR9KTtcblx0XHRcdHJldHVybiBpdGVtcztcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBjYWxjVHJlZSgpIHtcblx0XHRcdGdldFBhcmVudCh2bS5zdHJ1Y3R1cmUpO1xuXHRcdH07XG5cblx0XHRmdW5jdGlvbiBnZXROYXRpb25CeU5hbWUobmFtZSkge1xuXHRcdFx0dmFyIG5hdGlvbiA9IHt9O1xuXHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLmRhdGEsIGZ1bmN0aW9uIChuYXQpIHtcblx0XHRcdFx0aWYgKG5hdC5jb3VudHJ5ID09IG5hbWUpIHtcblx0XHRcdFx0XHRuYXRpb24gPSBuYXQ7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdFx0cmV0dXJuIG5hdGlvbjtcblx0XHR9O1xuXG5cdFx0ZnVuY3Rpb24gZ2V0TmF0aW9uQnlJc28oaXNvKSB7XG5cdFx0XHR2YXIgbmF0aW9uID0ge307XG5cdFx0XHRhbmd1bGFyLmZvckVhY2godm0uZGF0YSwgZnVuY3Rpb24gKG5hdCkge1xuXHRcdFx0XHRpZiAobmF0W3ZtLnN0cnVjdHVyZS5pc29dID09IGlzbykge1xuXHRcdFx0XHRcdG5hdGlvbiA9IG5hdDtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHRcdHJldHVybiBuYXRpb247XG5cdFx0fTtcblxuXHRcdGZ1bmN0aW9uIGNyZWF0ZUNhbnZhcyhjb2xvcnMpIHtcblxuXHRcdFx0dm0uY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG5cdFx0XHR2bS5jYW52YXMud2lkdGggPSAyODA7XG5cdFx0XHR2bS5jYW52YXMuaGVpZ2h0ID0gMTA7XG5cdFx0XHR2bS5jdHggPSB2bS5jYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcblx0XHRcdHZhciBncmFkaWVudCA9IHZtLmN0eC5jcmVhdGVMaW5lYXJHcmFkaWVudCgwLCAwLCAyODAsIDEwKTtcblx0XHRcdGdyYWRpZW50LmFkZENvbG9yU3RvcCgxLCAncmdiYSgyNTUsMjU1LDI1NSwwKScpO1xuXHRcdFx0Z3JhZGllbnQuYWRkQ29sb3JTdG9wKDAuNTMsIHZtLnN0cnVjdHVyZS5jb2xvciB8fCAncmdiYSgxMjgsIDI0MywgMTk4LDEpJyk7XG5cdFx0XHRncmFkaWVudC5hZGRDb2xvclN0b3AoMCwgJ3JnYmEoMTAyLDEwMiwxMDIsMSknKTtcblx0XHRcdHZtLmN0eC5maWxsU3R5bGUgPSBncmFkaWVudDtcblx0XHRcdHZtLmN0eC5maWxsUmVjdCgwLCAwLCAyODAsIDEwKTtcblx0XHRcdHZtLnBhbGV0dGUgPSB2bS5jdHguZ2V0SW1hZ2VEYXRhKDAsIDAsIDI1NywgMSkuZGF0YTtcblx0XHRcdC8vZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2JvZHknKVswXS5hcHBlbmRDaGlsZCh2bS5jYW52YXMpO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIHVwZGF0ZUNhbnZhcyhjb2xvcikge1xuXHRcdFx0dmFyIGdyYWRpZW50ID0gdm0uY3R4LmNyZWF0ZUxpbmVhckdyYWRpZW50KDAsIDAsIDI4MCwgMTApO1xuXHRcdFx0Z3JhZGllbnQuYWRkQ29sb3JTdG9wKDEsICdyZ2JhKDI1NSwyNTUsMjU1LDApJyk7XG5cdFx0XHRncmFkaWVudC5hZGRDb2xvclN0b3AoMC41MywgY29sb3IpO1xuXHRcdFx0Z3JhZGllbnQuYWRkQ29sb3JTdG9wKDAsICdyZ2JhKDEwMiwxMDIsMTAyLDEpJyk7XG5cdFx0XHR2bS5jdHguZmlsbFN0eWxlID0gZ3JhZGllbnQ7XG5cdFx0XHR2bS5jdHguZmlsbFJlY3QoMCwgMCwgMjgwLCAxMCk7XG5cdFx0XHR2bS5wYWxldHRlID0gdm0uY3R4LmdldEltYWdlRGF0YSgwLCAwLCAyNTcsIDEpLmRhdGE7XG5cdFx0XHQvL2RvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdib2R5JylbMF0uYXBwZW5kQ2hpbGQodm0uY2FudmFzKTtcblx0XHR9O1xuXG5cdFx0ZnVuY3Rpb24gaW52ZXJ0ZWRTdHlsZShmZWF0dXJlKSB7XG5cdFx0XHR2YXIgc3R5bGUgPSB7fTtcblx0XHRcdHZhciBpc28gPSBmZWF0dXJlLnByb3BlcnRpZXMuYWRtMF9hMztcblx0XHRcdHZhciBuYXRpb24gPSBnZXROYXRpb25CeUlzbyhpc28pO1xuXHRcdFx0dmFyIGZpZWxkID0gdm0uc3RydWN0dXJlLnNjb3JlX2ZpZWxkX25hbWUgfHwgJ3Njb3JlJztcblxuXHRcdFx0Y29uc29sZS5sb2codm0uc3RydWN0dXJlLnNjb3JlX2ZpZWxkX25hbWUpO1xuXHRcdFx0dmFyIGNvbG9yUG9zID0gcGFyc2VJbnQoMjU2IC8gMTAwICogbmF0aW9uW2ZpZWxkXSkgKiA0O1xuXHRcdFx0dmFyIGNvbG9yID0gJ3JnYmEoJyArIHZtLnBhbGV0dGVbY29sb3JQb3NdICsgJywgJyArIHZtLnBhbGV0dGVbY29sb3JQb3MgKyAxXSArICcsICcgKyB2bS5wYWxldHRlW2NvbG9yUG9zICsgMl0gKyAnLCcgKyB2bS5wYWxldHRlW2NvbG9yUG9zICsgM10gKyAnKSc7XG5cdFx0XHRzdHlsZS5jb2xvciA9ICdyZ2JhKDAsMCwwLDApJztcblx0XHRcdHN0eWxlLm91dGxpbmUgPSB7XG5cdFx0XHRcdGNvbG9yOiAncmdiYSgwLDAsMCwwKScsXG5cdFx0XHRcdHNpemU6IDBcblx0XHRcdH07XG5cdFx0XHRzdHlsZS5zZWxlY3RlZCA9IHtcblx0XHRcdFx0Y29sb3I6IGNvbG9yLFxuXHRcdFx0XHRvdXRsaW5lOiB7XG5cdFx0XHRcdFx0Y29sb3I6ICdyZ2JhKDAsMCwwLDAuMyknLFxuXHRcdFx0XHRcdHNpemU6IDJcblx0XHRcdFx0fVxuXHRcdFx0fTtcblx0XHRcdHJldHVybiBzdHlsZTtcblx0XHR9O1xuXG5cdFx0ZnVuY3Rpb24gY291bnRyaWVzU3R5bGUoZmVhdHVyZSkge1xuXG5cdFx0XHR2YXIgc3R5bGUgPSB7fTtcblx0XHRcdHZhciBpc28gPSBmZWF0dXJlLnByb3BlcnRpZXMuYWRtMF9hMztcblx0XHRcdHZhciBuYXRpb24gPSBnZXROYXRpb25CeUlzbyhpc28pO1xuXHRcdFx0dmFyIGZpZWxkID0gdm0uc3RydWN0dXJlLnNjb3JlX2ZpZWxkX25hbWUgfHwgJ3Njb3JlJztcblx0XHRcdHZhciB0eXBlID0gZmVhdHVyZS50eXBlO1xuXHRcdFx0aWYoaXNvICE9IHZtLmN1cnJlbnRbdm0uc3RydWN0dXJlLmlzb10pe1xuXHRcdFx0XHRcdGZlYXR1cmUuc2VsZWN0ZWQgPSBmYWxzZTtcblx0XHRcdH1cblxuXHRcdFx0c3dpdGNoICh0eXBlKSB7XG5cdFx0XHRjYXNlIDM6IC8vJ1BvbHlnb24nXG5cdFx0XHRcdGlmICh0eXBlb2YgbmF0aW9uW2ZpZWxkXSAhPSBcInVuZGVmaW5lZFwiKSB7XG5cblx0XHRcdFx0XHR2YXIgY29sb3JQb3MgPSBwYXJzZUludCgyNTYgLyAxMDAgKiBwYXJzZUludChuYXRpb25bZmllbGRdKSkgKiA0O1xuXHRcdFx0XHRcdHZhciBjb2xvciA9ICdyZ2JhKCcgKyB2bS5wYWxldHRlW2NvbG9yUG9zXSArICcsICcgKyB2bS5wYWxldHRlW2NvbG9yUG9zICsgMV0gKyAnLCAnICsgdm0ucGFsZXR0ZVtjb2xvclBvcyArIDJdICsgJywnICsgdm0ucGFsZXR0ZVtjb2xvclBvcyArIDNdICsgJyknO1xuXHRcdFx0XHRcdHN0eWxlLmNvbG9yID0gJ3JnYmEoJyArIHZtLnBhbGV0dGVbY29sb3JQb3NdICsgJywgJyArIHZtLnBhbGV0dGVbY29sb3JQb3MgKyAxXSArICcsICcgKyB2bS5wYWxldHRlW2NvbG9yUG9zICsgMl0gKyAnLDAuNiknOyAvL2NvbG9yO1xuXHRcdFx0XHRcdHN0eWxlLm91dGxpbmUgPSB7XG5cdFx0XHRcdFx0XHRjb2xvcjogY29sb3IsXG5cdFx0XHRcdFx0XHRzaXplOiAxXG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRzdHlsZS5zZWxlY3RlZCA9IHtcblx0XHRcdFx0XHRcdGNvbG9yOiAncmdiYSgnICsgdm0ucGFsZXR0ZVtjb2xvclBvc10gKyAnLCAnICsgdm0ucGFsZXR0ZVtjb2xvclBvcyArIDFdICsgJywgJyArIHZtLnBhbGV0dGVbY29sb3JQb3MgKyAyXSArICcsMC4zKScsXG5cdFx0XHRcdFx0XHRvdXRsaW5lOiB7XG5cdFx0XHRcdFx0XHRcdGNvbG9yOiAncmdiYSg2Niw2Niw2NiwwLjkpJyxcblx0XHRcdFx0XHRcdFx0c2l6ZTogMlxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0XHRzdHlsZS5jb2xvciA9ICdyZ2JhKDI1NSwyNTUsMjU1LDApJztcblx0XHRcdFx0XHRzdHlsZS5vdXRsaW5lID0ge1xuXHRcdFx0XHRcdFx0Y29sb3I6ICdyZ2JhKDI1NSwyNTUsMjU1LDApJyxcblx0XHRcdFx0XHRcdHNpemU6IDFcblx0XHRcdFx0XHR9O1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRpZiAoZmVhdHVyZS5sYXllci5uYW1lID09PSAnY291bnRyaWVzX2JpZ19nZW9tX2xhYmVsJykge1xuXHRcdFx0XHRzdHlsZS5zdGF0aWNMYWJlbCA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHR2YXIgc3R5bGUgPSB7XG5cdFx0XHRcdFx0XHRodG1sOiBmZWF0dXJlLnByb3BlcnRpZXMubmFtZSxcblx0XHRcdFx0XHRcdGljb25TaXplOiBbMTI1LCAzMF0sXG5cdFx0XHRcdFx0XHRjc3NDbGFzczogJ2xhYmVsLWljb24tdGV4dCdcblx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdHJldHVybiBzdHlsZTtcblx0XHRcdFx0fTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBzdHlsZTtcblx0XHR9O1xuXG5cdFx0JHNjb3BlLiR3YXRjaCgndm0uY3VycmVudCcsIGZ1bmN0aW9uIChuLCBvKSB7XG5cdFx0XHRpZiAobiA9PT0gbykge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0XHRpZihuW3ZtLnN0cnVjdHVyZS5pc29dKSB7XG5cdFx0XHRcdGlmKG9bdm0uc3RydWN0dXJlLmlzb10pe1xuXHRcdFx0XHRcdHZtLm12dFNvdXJjZS5sYXllcnMuY291bnRyaWVzX2JpZ19nZW9tLmZlYXR1cmVzW29bdm0uc3RydWN0dXJlLmlzb11dLnNlbGVjdGVkID0gZmFsc2U7XG5cdFx0XHRcdH1cblx0XHRcdFx0Y2FsY1JhbmsoKTtcblx0XHRcdFx0ZmV0Y2hOYXRpb25EYXRhKG5bdm0uc3RydWN0dXJlLmlzb10pO1xuXHRcdFx0XHR2bS5tdnRTb3VyY2UubGF5ZXJzLmNvdW50cmllc19iaWdfZ2VvbS5mZWF0dXJlc1tuW3ZtLnN0cnVjdHVyZS5pc29dXS5zZWxlY3RlZCA9IHRydWU7XG5cdFx0XHRcdGlmKCRzdGF0ZS5jdXJyZW50Lm5hbWUgPT0gJ2FwcC5pbmRleC5zaG93LnNlbGVjdGVkJyB8fCAkc3RhdGUuY3VycmVudC5uYW1lID09ICdhcHAuaW5kZXguc2hvdycpe1xuXHRcdFx0XHRcdCRzdGF0ZS5nbygnYXBwLmluZGV4LnNob3cuc2VsZWN0ZWQnLCB7XG5cdFx0XHRcdFx0XHRpbmRleDogJHN0YXRlLnBhcmFtcy5pbmRleCxcblx0XHRcdFx0XHRcdGl0ZW06IG5bdm0uc3RydWN0dXJlLmlzb11cblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JHN0YXRlLmdvKCdhcHAuaW5kZXguc2hvdycse1xuXHRcdFx0XHRcdGluZGV4OiAkc3RhdGUucGFyYW1zLmluZGV4XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdCRzY29wZS4kd2F0Y2goJ3ZtLmRpc3BsYXkuc2VsZWN0ZWRDYXQnLCBmdW5jdGlvbiAobiwgbykge1xuXHRcdFx0aWYgKG4gPT09IG8pIHtcblx0XHRcdFx0cmV0dXJuXG5cdFx0XHR9XG5cdFx0XHRpZiAobilcblx0XHRcdFx0dXBkYXRlQ2FudmFzKG4uY29sb3IpO1xuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdHVwZGF0ZUNhbnZhcygncmdiYSgxMjgsIDI0MywgMTk4LDEpJyk7XG5cdFx0XHR9O1xuXHRcdFx0dm0uY2FsY1RyZWUoKTtcblx0XHRcdC8qaWYgKHZtLmNvbXBhcmUuYWN0aXZlKSB7XG5cdFx0XHRcdCR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHQvL3ZtLm12dFNvdXJjZS5zZXRTdHlsZShpbnZlcnRlZFN0eWxlKTtcblx0XHRcdFx0XHQvL3ZtLm12dFNvdXJjZS5yZWRyYXcoKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkdGltZW91dChmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0Ly92bS5tdnRTb3VyY2Uuc2V0U3R5bGUoY291bnRyaWVzU3R5bGUpO1xuXHRcdFx0XHRcdC8vdm0ubXZ0U291cmNlLnJlZHJhdygpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH0qL1xuXG5cdFx0XHRpZiAodm0uY3VycmVudFt2bS5zdHJ1Y3R1cmUuaXNvXSkge1xuXHRcdFx0XHRpZigkc3RhdGUucGFyYW1zLmNvdW50cmllcyl7XG5cdFx0XHRcdFx0JHN0YXRlLmdvKCdhcHAuaW5kZXguc2hvdy5zZWxlY3RlZC5jb21wYXJlJywge1xuXHRcdFx0XHRcdFx0aW5kZXg6IG4ubmFtZSxcblx0XHRcdFx0XHRcdGl0ZW06IHZtLmN1cnJlbnRbdm0uc3RydWN0dXJlLmlzb10sXG5cdFx0XHRcdFx0XHRjb3VudHJpZXM6ICRzdGF0ZS5wYXJhbXMuY291bnRyaWVzXG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNle1xuXHRcdFx0XHRcdCRzdGF0ZS5nbygnYXBwLmluZGV4LnNob3cuc2VsZWN0ZWQnLCB7XG5cdFx0XHRcdFx0XHRpbmRleDogbi5uYW1lLFxuXHRcdFx0XHRcdFx0aXRlbTogdm0uY3VycmVudFt2bS5zdHJ1Y3R1cmUuaXNvXVxuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCRzdGF0ZS5nbygnYXBwLmluZGV4LnNob3cnLCB7XG5cdFx0XHRcdFx0aW5kZXg6IG4ubmFtZVxuXHRcdFx0XHR9KVxuXHRcdFx0fVxuXG5cdFx0fSk7XG5cdFx0JHNjb3BlLiR3YXRjaCgndm0uYmJveCcsIGZ1bmN0aW9uIChuLCBvKSB7XG5cdFx0XHRpZiAobiA9PT0gbykge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdHZhciBsYXQgPSBbbi5jb29yZGluYXRlc1swXVswXVsxXSxcblx0XHRcdFx0XHRbbi5jb29yZGluYXRlc1swXVswXVswXV1cblx0XHRcdFx0XSxcblx0XHRcdFx0bG5nID0gW24uY29vcmRpbmF0ZXNbMF1bMl1bMV0sXG5cdFx0XHRcdFx0W24uY29vcmRpbmF0ZXNbMF1bMl1bMF1dXG5cdFx0XHRcdF1cblx0XHRcdHZhciBzb3V0aFdlc3QgPSBMLmxhdExuZyhuLmNvb3JkaW5hdGVzWzBdWzBdWzFdLCBuLmNvb3JkaW5hdGVzWzBdWzBdWzBdKSxcblx0XHRcdFx0bm9ydGhFYXN0ID0gTC5sYXRMbmcobi5jb29yZGluYXRlc1swXVsyXVsxXSwgbi5jb29yZGluYXRlc1swXVsyXVswXSksXG5cdFx0XHRcdGJvdW5kcyA9IEwubGF0TG5nQm91bmRzKHNvdXRoV2VzdCwgbm9ydGhFYXN0KTtcblxuXHRcdFx0dmFyIHBhZCA9IFtcblx0XHRcdFx0WzM1MCwgMjAwXSxcblx0XHRcdFx0WzAsIDIwMF1cblx0XHRcdF07XG5cdFx0XHRpZiAodm0uY29tcGFyZS5hY3RpdmUpIHtcblx0XHRcdFx0cGFkID0gW1xuXHRcdFx0XHRcdFszNTAsIDBdLFxuXHRcdFx0XHRcdFswLCAwXVxuXHRcdFx0XHRdO1xuXHRcdFx0fVxuXHRcdFx0dm0ubWFwLmZpdEJvdW5kcyhib3VuZHMsIHtcblx0XHRcdFx0cGFkZGluZ1RvcExlZnQ6IHBhZFswXSxcblx0XHRcdFx0cGFkZGluZ0JvdHRvbVJpZ2h0OiBwYWRbMV0sXG5cdFx0XHRcdG1heFpvb206IDZcblx0XHRcdH0pO1xuXHRcdH0pO1xuXG5cdFx0JHNjb3BlLiRvbihcIiRzdGF0ZUNoYW5nZVN1Y2Nlc3NcIiwgZnVuY3Rpb24gKGV2ZW50LCB0b1N0YXRlLCB0b1BhcmFtcywgZnJvbVN0YXRlLCBmcm9tUGFyYW1zKSB7XG5cblx0XHRcdC8qY29uc29sZS5sb2coJClcblx0XHRcdGlmICh0b1N0YXRlLm5hbWUgPT0gXCJhcHAuaW5kZXguc2hvd1wiKSB7XG5cdFx0XHRcdFx0dm0uY3VycmVudCA9IFwiXCI7XG5cdFx0XHR9IGVsc2UgaWYgKHRvU3RhdGUubmFtZSA9PSBcImFwcC5pbmRleC5zaG93LnNlbGVjdGVkXCIpIHtcblxuXHRcdFx0XHRpZih0b1BhcmFtcy5pbmRleCAhPSBmcm9tUGFyYW1zLmluZGV4KXtcblx0XHRcdFx0XHRjb25zb2xlLmxvZygnYW5kZXJzJylcblx0XHRcdFx0fVxuXHRcdFx0XHRjb25zb2xlLmxvZyh0b1BhcmFtcy5pdGVtKTtcblx0XHRcdFx0dm0uc2V0U3RhdGUodG9QYXJhbXMuaXRlbSk7XG5cdFx0XHRcdGNhbGNSYW5rKCk7XG5cdFx0XHRcdC8vdm0ubXZ0U291cmNlLm9wdGlvbnMubXV0ZXhUb2dnbGUgPSB0cnVlO1xuXHRcdFx0XHREYXRhU2VydmljZS5nZXRPbmUoJ25hdGlvbnMnLCB2bS5jdXJyZW50LmlzbykudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuXHRcdFx0XHRcdHZtLmN1cnJlbnQuZGF0YSA9IGRhdGE7XG5cdFx0XHRcdFx0RGF0YVNlcnZpY2UuZ2V0T25lKCduYXRpb25zL2Jib3gnLCBbdm0uY3VycmVudC5pc29dKS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG5cdFx0XHRcdFx0XHR2bS5iYm94ID0gZGF0YTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9IGVsc2UgaWYgKHRvU3RhdGUubmFtZSA9PSBcImFwcC5pbmRleC5zaG93LnNlbGVjdGVkLmNvbXBhcmVcIikge1xuXHRcdFx0XHR2bS5zZXRTdGF0ZSh0b1BhcmFtcy5pdGVtKTtcblx0XHRcdFx0Ly8kc2NvcGUuYWN0aXZlVGFiID0gMjtcblx0XHRcdFx0LypEYXRhU2VydmljZS5nZXRPbmUoJ25hdGlvbnMnLCB0b1BhcmFtcy5pdGVtKS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG5cdFx0XHRcdFx0dm0uY291bnRyeSA9IGRhdGE7XG5cdFx0XHRcdFx0RGF0YVNlcnZpY2UuZ2V0T25lKCduYXRpb25zL2Jib3gnLCBbdm0uY291bnRyeS5pc29dKS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG5cdFx0XHRcdFx0XHR2bS5iYm94ID0gZGF0YTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR2bS5jdXJyZW50ID0gXCJcIjtcblx0XHRcdH0qL1xuXHRcdH0pO1xuXG5cdFx0ZnVuY3Rpb24gZHJhd0NvdW50cmllcygpIHtcblx0XHRcdGxlYWZsZXREYXRhLmdldE1hcCgnbWFwJykudGhlbihmdW5jdGlvbiAobWFwKSB7XG5cdFx0XHRcdHZtLm1hcCA9IG1hcDtcblx0XHRcdFx0dm0ubXZ0U291cmNlID0gVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldExheWVyKCk7XG5cdFx0XHRcdCR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRpZigkc3RhdGUucGFyYW1zLmNvdW50cmllcyl7XG5cdFx0XHRcdFx0XHR2bS5tdnRTb3VyY2Uub3B0aW9ucy5tdXRleFRvZ2dsZSA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0dm0ubXZ0U291cmNlLnNldFN0eWxlKGludmVydGVkU3R5bGUpO1xuXHRcdFx0XHRcdFx0dm0ubXZ0U291cmNlLmxheWVycy5jb3VudHJpZXNfYmlnX2dlb20uZmVhdHVyZXNbdm0uY3VycmVudFt2bS5zdHJ1Y3R1cmUuaXNvXV0uc2VsZWN0ZWQgPSB0cnVlO1xuXHRcdFx0XHRcdFx0dmFyIGNvdW50cmllcyA9ICRzdGF0ZS5wYXJhbXMuY291bnRyaWVzLnNwbGl0KCctdnMtJyk7XG5cdFx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2goY291bnRyaWVzLCBmdW5jdGlvbihpc28pe1xuXHRcdFx0XHRcdFx0XHR2bS5tdnRTb3VyY2UubGF5ZXJzLmNvdW50cmllc19iaWdfZ2VvbS5mZWF0dXJlc1tpc29dLnNlbGVjdGVkID0gdHJ1ZTtcblx0XHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2V7XG5cdFx0XHRcdFx0XHR2bS5tdnRTb3VyY2Uuc2V0U3R5bGUoY291bnRyaWVzU3R5bGUpO1xuXHRcdFx0XHRcdFx0aWYoJHN0YXRlLnBhcmFtcy5pdGVtKXtcblx0XHRcdFx0XHRcdFx0XHR2bS5tdnRTb3VyY2UubGF5ZXJzLmNvdW50cmllc19iaWdfZ2VvbS5mZWF0dXJlc1skc3RhdGUucGFyYW1zLml0ZW1dLnNlbGVjdGVkID0gdHJ1ZTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Ly92bS5tdnRTb3VyY2UucmVkcmF3KCk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHR2bS5tdnRTb3VyY2Uub3B0aW9ucy5vbkNsaWNrID0gZnVuY3Rpb24gKGV2dCwgdCkge1xuXHRcdFx0XHRcdGlmICghdm0uY29tcGFyZS5hY3RpdmUpIHtcblx0XHRcdFx0XHRcdHZhciBjID0gZ2V0TmF0aW9uQnlJc28oZXZ0LmZlYXR1cmUucHJvcGVydGllcy5hZG0wX2EzKTtcblx0XHRcdFx0XHRcdGlmICh0eXBlb2YgY1t2bS5zdHJ1Y3R1cmUuc2NvcmVfZmllbGRfbmFtZV0gIT0gXCJ1bmRlZmluZWRcIikge1xuXHRcdFx0XHRcdFx0XHR2bS5jdXJyZW50ID0gZ2V0TmF0aW9uQnlJc28oZXZ0LmZlYXR1cmUucHJvcGVydGllcy5hZG0wX2EzKTtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFRvYXN0U2VydmljZS5lcnJvcignTm8gaW5mbyBhYm91dCB0aGlzIGxvY2F0aW9uIScpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHR2YXIgYyA9IGdldE5hdGlvbkJ5SXNvKGV2dC5mZWF0dXJlLnByb3BlcnRpZXMuYWRtMF9hMyk7XG5cdFx0XHRcdFx0XHRpZiAodHlwZW9mIGNbdm0uc3RydWN0dXJlLnNjb3JlX2ZpZWxkX25hbWVdICE9IFwidW5kZWZpbmVkXCIpIHtcblx0XHRcdFx0XHRcdFx0dm0udG9nZ2xlQ291bnRyaWVMaXN0KGMpO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0VG9hc3RTZXJ2aWNlLmVycm9yKCdObyBpbmZvIGFib3V0IHRoaXMgbG9jYXRpb24hJyk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9O1xuXHR9KTtcbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignSW5kZXhiYXNlQ3RybCcsIGZ1bmN0aW9uICgkc2NvcGUsJHN0YXRlKSB7XG5cdFx0Ly9cbiAgICAkc2NvcGUuJHN0YXRlID0gJHN0YXRlO1xuXHR9KTtcbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdJbmRleGNyZWF0b3JDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCRyb290U2NvcGUsRGlhbG9nU2VydmljZSxEYXRhU2VydmljZSwgJHRpbWVvdXQsJHN0YXRlLCAkZmlsdGVyLCBsZWFmbGV0RGF0YSwgdG9hc3RyLCBWZWN0b3JsYXllclNlcnZpY2Upe1xuICAgICAgICAvL1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuICAgICAgICB2bS5tYXAgPSBudWxsO1xuICAgICAgICB2bS5kYXRhID0gW107XG4gICAgICAgIHZtLnRvU2VsZWN0ID0gW107XG4gICAgICAgIHZtLnNlbGVjdGVkID0gW107XG4gICAgICAgIHZtLnNlbGVjdGVkUm93cyA9IFtdO1xuICAgICAgICB2bS5pc29fZXJyb3JzID0gMDtcbiAgICAgICAgdm0uc2VsZWN0ZWRJbmRleCA9IDA7XG4gICAgICAgIHZtLnN0ZXAgPSAwO1xuICAgICAgICB2bS5zZWFyY2ggPSBzZWFyY2g7XG4gICAgICAgIHZtLmRlbGV0ZURhdGEgPSBkZWxldGVEYXRhO1xuICAgICAgICB2bS5kZWxldGVTZWxlY3RlZCA9IGRlbGV0ZVNlbGVjdGVkO1xuICAgICAgICB2bS5vbk9yZGVyQ2hhbmdlID0gb25PcmRlckNoYW5nZTtcbiAgICAgICAgdm0ub25QYWdpbmF0aW9uQ2hhbmdlID0gb25QYWdpbmF0aW9uQ2hhbmdlO1xuICAgICAgICB2bS5jaGVja0ZvckVycm9ycyA9IGNoZWNrRm9yRXJyb3JzO1xuICAgICAgICB2bS5jbGVhckVycm9ycyA9IGNsZWFyRXJyb3JzO1xuICAgICAgICB2bS5zaG93VXBsb2FkQ29udGFpbmVyID0gZmFsc2U7XG4gICAgICAgIHZtLm9wZW5DbG9zZSA9IG9wZW5DbG9zZTtcbiAgICAgICAgdm0uY2hlY2tDb2x1bW5EYXRhID0gY2hlY2tDb2x1bW5EYXRhO1xuICAgICAgICB2bS5lZGl0Q29sdW1uRGF0YSA9IGVkaXRDb2x1bW5EYXRhO1xuICAgICAgICB2bS5mZXRjaElzbyA9IGZldGNoSXNvO1xuICAgICAgICB2bS5lZGl0Um93ID0gZWRpdFJvdztcbiAgICAgICAgdm0uc2F2ZURhdGEgPSBzYXZlRGF0YTtcbiAgICAgICAgdm0ubGlzdFJlc291cmNlcyA9IGxpc3RSZXNvdXJjZXM7XG4gICAgICAgIHZtLm1ldGEgPSB7XG4gICAgICAgICAgaXNvX2ZpZWxkOiAnJyxcbiAgICAgICAgICBjb3VudHJ5X2ZpZWxkOicnLFxuICAgICAgICAgIHRhYmxlOltdXG4gICAgICAgIH07XG4gICAgICAgIHZtLnF1ZXJ5ID0ge1xuICAgICAgICAgIGZpbHRlcjogJycsXG4gICAgICAgICAgb3JkZXI6ICctZXJyb3JzJyxcbiAgICAgICAgICBsaW1pdDogMTUsXG4gICAgICAgICAgcGFnZTogMVxuICAgICAgICB9O1xuXG4gICAgICAgIGFjdGl2YXRlKCk7XG5cbiAgICAgICAgZnVuY3Rpb24gYWN0aXZhdGUoKXtcbiAgICAgICAgICBjbGVhck1hcCgpO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIG9wZW5DbG9zZShhY3RpdmUpe1xuICAgICAgICAgIHJldHVybiBhY3RpdmUgPyAncmVtb3ZlJyA6ICdhZGQnO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGNsZWFyTGF5ZXJTdHlsZShmZWF0dXJlKXtcbiAgICAgIFx0XHRcdHZhciBzdHlsZSA9IHtcbiAgICAgICAgICAgICAgY29sb3I6J3JnYmEoMjU1LDI1NSwyNTUsMCknLFxuICAgICAgICAgICAgICBvdXRsaW5lOiB7XG4gICAgXHRcdFx0XHRcdFx0Y29sb3I6ICdyZ2JhKDI1NSwyNTUsMjU1LDApJyxcbiAgICBcdFx0XHRcdFx0XHRzaXplOiAxXG4gICAgXHRcdFx0XHRcdH1cbiAgICAgICAgICAgIH07XG4gICAgICBcdFx0XHRyZXR1cm4gc3R5bGU7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gY2xlYXJNYXAoKXtcbiAgICAgICAgICBcdGxlYWZsZXREYXRhLmdldE1hcCgnbWFwJykudGhlbihmdW5jdGlvbiAobWFwKSB7XG4gICAgICAgICAgICAgIHZtLm12dFNvdXJjZSA9IFZlY3RvcmxheWVyU2VydmljZS5nZXRMYXllcigpO1xuICAgICAgICAgICAgICAkdGltZW91dChmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIHZtLm12dFNvdXJjZS5zZXRTdHlsZShjbGVhckxheWVyU3R5bGUpO1xuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gc2VhcmNoKHByZWRpY2F0ZSkge1xuICAgICAgICAgIHZtLmZpbHRlciA9IHByZWRpY2F0ZTtcbiAgICAgICAgfTtcbiAgICAgICAgZnVuY3Rpb24gb25PcmRlckNoYW5nZShvcmRlcikge1xuICAgICAgICAgIHJldHVybiB2bS5kYXRhID0gJGZpbHRlcignb3JkZXJCeScpKHZtLmRhdGEsIFtvcmRlcl0sIHRydWUpXG4gICAgICAgIH07XG4gICAgICAgIGZ1bmN0aW9uIG9uUGFnaW5hdGlvbkNoYW5nZShwYWdlLCBsaW1pdCkge1xuICAgICAgICAgIC8vY29uc29sZS5sb2cocGFnZSwgbGltaXQpO1xuICAgICAgICAgIC8vcmV0dXJuICRudXRyaXRpb24uZGVzc2VydHMuZ2V0KCRzY29wZS5xdWVyeSwgc3VjY2VzcykuJHByb21pc2U7XG4gICAgICAgIH07XG4gICAgICAgIGZ1bmN0aW9uIGNoZWNrRm9yRXJyb3JzKGl0ZW0pe1xuICAgICAgICAgIHJldHVybiBpdGVtLmVycm9ycy5sZW5ndGggPiAwID8gJ21kLXdhcm4nOiAnJztcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBjbGVhckVycm9ycygpe1xuICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaCh2bS5kYXRhLCBmdW5jdGlvbihyb3csIGtleSl7XG4gICAgICAgICAgICBhbmd1bGFyLmZvckVhY2gocm93LmRhdGFbMF0sIGZ1bmN0aW9uKGl0ZW0sIGspe1xuICAgICAgICAgICAgICBpZihpc05hTihpdGVtKSB8fCBpdGVtIDwgMCl7XG4gICAgICAgICAgICAgICAgaWYoaXRlbSA9PSBcIk5BXCIgfHwgaXRlbSA8IDAgfHwgaXRlbS5pbmRleE9mKCcjTi9BJykgPiAtMSl7XG4gICAgICAgICAgICAgICAgICB2bS5kYXRhW2tleV0uZGF0YVswXVtrXSA9ICcnO1xuICAgICAgICAgICAgICAgICAgdm0uZXJyb3JzIC0tO1xuICAgICAgICAgICAgICAgICAgcm93LmVycm9ycy5zcGxpY2UoMCwxKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgc3dpdGNoIChpdGVtKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnQ2FibyBWZXJkZSc6XG4gICAgICAgICAgICAgICAgICAgICAgdm0uZGF0YVtrZXldLmRhdGFbMF1ba10gICA9ICdDYXBlIFZlcmRlJztcbiAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgXCJEZW1vY3JhdGljIFBlb3BsZXMgUmVwdWJsaWMgb2YgS29yZWFcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgIHZtLmRhdGFba2V5XS5kYXRhWzBdW2tdICAgPSBcIkRlbW9jcmF0aWMgUGVvcGxlJ3MgUmVwdWJsaWMgb2YgS29yZWFcIjtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBcIkNvdGUgZCdJdm9pcmVcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgIHZtLmRhdGFba2V5XS5kYXRhWzBdW2tdICAgPSBcIkl2b3J5IENvYXN0XCI7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgXCJMYW8gUGVvcGxlcyBEZW1vY3JhdGljIFJlcHVibGljXCI6XG4gICAgICAgICAgICAgICAgICAgICAgICB2bS5kYXRhW2tleV0uZGF0YVswXVtrXSAgID0gXCJMYW8gUGVvcGxlJ3MgRGVtb2NyYXRpYyBSZXB1YmxpY1wiO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYoIXJvdy5kYXRhWzBdW3ZtLm1ldGEuaXNvX2ZpZWxkXSl7XG4gICAgICAgICAgICAgIHZtLmlzb19lcnJvcnMrKztcbiAgICAgICAgICAgICAgdm0uZXJyb3JzKytcbiAgICAgICAgICAgICAgcm93LmVycm9ycy5wdXNoKHtcbiAgICAgICAgICAgICAgICB0eXBlOlwiMlwiLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6XCJJc28gZmllbGQgaXMgbm90IHZhbGlkIVwiLFxuICAgICAgICAgICAgICAgIGNvbHVtbjogdm0ubWV0YS5pc29fZmllbGRcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBjaGVja0NvbHVtbkRhdGEoa2V5KXtcbiAgICAgICAgICBpZih0eXBlb2Ygdm0ubWV0YS50YWJsZVtrZXldICE9IFwidW5kZWZpbmVkXCIpe1xuICAgICAgICAgICAgaWYodm0ubWV0YS50YWJsZVtrZXldLnRpdGxlKXtcbiAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBlZGl0Q29sdW1uRGF0YShlLCBrZXkpe1xuICAgICAgICAgIHZtLnRvRWRpdCA9IGtleTtcbiAgICAgICAgICBEaWFsb2dTZXJ2aWNlLmZyb21UZW1wbGF0ZSgnZWRpdGNvbHVtbicsICRzY29wZSk7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gZGVsZXRlU2VsZWN0ZWQoKXtcbiAgICAgICAgICBhbmd1bGFyLmZvckVhY2godm0uc2VsZWN0ZWQsIGZ1bmN0aW9uKGl0ZW0sIGtleSl7XG4gICAgICAgICAgICBhbmd1bGFyLmZvckVhY2goaXRlbS5lcnJvcnMsIGZ1bmN0aW9uKGVycm9yLCBrKXtcbiAgICAgICAgICAgICAgaWYoZXJyb3IudHlwZSA9PSAyKXtcbiAgICAgICAgICAgICAgICB2bS5pc29fZXJyb3JzIC0tO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHZtLmVycm9ycyAtLTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB2bS5kYXRhLnNwbGljZSh2bS5kYXRhLmluZGV4T2YoaXRlbSksIDEpO1xuICAgICAgICAgICAgdm0uc2VsZWN0ZWQuc3BsaWNlKGtleSwgMSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgaWYodm0uZGF0YS5sZW5ndGggPT0gMCl7XG4gICAgICAgICAgICB2bS5kZWxldGVEYXRhKCk7XG4gICAgICAgICAgICAkc3RhdGUuZ290KCdhcHAuaW5kZXguY3JlYXRlJyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGVkaXRSb3coKXtcbiAgICAgICAgICB2bS5yb3cgPSB2bS5zZWxlY3RlZFswXTtcbiAgICAgICAgICBEaWFsb2dTZXJ2aWNlLmZyb21UZW1wbGF0ZSgnZWRpdHJvdycsICRzY29wZSk7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gZGVsZXRlRGF0YSgpe1xuICAgICAgICAgIHZtLmRhdGEgPSBbXTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBmZXRjaElzbygpe1xuICAgICAgICAgIHZtLnRvU2VsZWN0ID0gW107XG4gICAgICAgICAgdm0ubm90Rm91bmQgPSBbXTtcbiAgICAgICAgICB2YXIgZW50cmllcyA9IFtdO1xuICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaCh2bS5kYXRhLCBmdW5jdGlvbihpdGVtLCBrZXkpe1xuICAgICAgICAgICAgZW50cmllcy5wdXNoKHtcbiAgICAgICAgICAgICAgaXNvOiBpdGVtLmRhdGFbMF1bdm0ubWV0YS5pc29fZmllbGRdLFxuICAgICAgICAgICAgICBuYW1lOiBpdGVtLmRhdGFbMF1bdm0ubWV0YS5jb3VudHJ5X2ZpZWxkXVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAvKiAgaWYoIWl0ZW0uZGF0YVswXVt2bS5tZXRhLmlzb19maWVsZF0pe1xuICAgICAgICAgICAgICAgIERhdGFTZXJ2aWNlLmdldE9uZSgnL25hdGlvbnMvYnlOYW1lLycraXRlbS5kYXRhWzBdWydjb3VudHJ5J10pLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgICAgICAgICAgICAgdmFyIGRhdGEgPSByZXNwb25zZS5kYXRhO1xuICAgICAgICAgICAgICAgICAgaWYoZGF0YS5sZW5ndGggPT0gMSl7XG4gICAgICAgICAgICAgICAgICAgIGl0ZW0uZGF0YVswXVt2bS5tZXRhLmlzb19maWVsZF0gPSBkYXRhWzBdLmlzbztcbiAgICAgICAgICAgICAgICAgICAgdm0uaXNvX2Vycm9ycyAtLTtcbiAgICAgICAgICAgICAgICAgICAgdm0uZXJyb3JzIC0tO1xuICAgICAgICAgICAgICAgICAgICBpdGVtLmVycm9ycy5zcGxpY2UoMCwxKTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIGVsc2UgaWYoZGF0YS5sZW5ndGggPiAxKXtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRvU2VsZWN0ID0ge1xuICAgICAgICAgICAgICAgICAgICAgIGVudHJ5OiBpdGVtLFxuICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnM6IGRhdGFcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgdm0udG9TZWxlY3QucHVzaCh0b1NlbGVjdCk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICAgICAgICB2bS5ub3RGb3VuZC5wdXNoKGl0ZW0pO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgLy8gIH0qL1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIERhdGFTZXJ2aWNlLnBvc3QoJy9uYXRpb25zL2J5SXNvTmFtZXMnLCB7ZGF0YTplbnRyaWVzfSkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaChyZXNwb25zZS5kYXRhLCBmdW5jdGlvbihjb3VudHJ5LCBrZXkpe1xuICAgICAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaCh2bS5kYXRhLCBmdW5jdGlvbihpdGVtLCBrKXtcbiAgICAgICAgICAgICAgICAgICAgaWYoY291bnRyeS5uYW1lID09IGl0ZW0uZGF0YVswXVt2bS5tZXRhLmNvdW50cnlfZmllbGRdKXtcbiAgICAgICAgICAgICAgICAgICAgICBpZihjb3VudHJ5LmRhdGEubGVuZ3RoID4gMSl7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdG9TZWxlY3QgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGVudHJ5OiBpdGVtLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zOiBjb3VudHJ5LmRhdGFcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICB2bS50b1NlbGVjdC5wdXNoKHRvU2VsZWN0KTtcbiAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZtLmRhdGFba10uZGF0YVswXVt2bS5tZXRhLmlzb19maWVsZF0gPSBjb3VudHJ5LmRhdGFbMF0uaXNvO1xuICAgICAgICAgICAgICAgICAgICAgICAgdm0uZGF0YVtrXS5kYXRhWzBdW3ZtLm1ldGEuY291bnRyeV9maWVsZF0gPSBjb3VudHJ5LmRhdGFbMF0uYWRtaW47XG4gICAgICAgICAgICAgICAgICAgICAgICBpZihpdGVtLmVycm9ycy5sZW5ndGgpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICBhbmd1bGFyLmZvckVhY2goaXRlbS5lcnJvcnMsIGZ1bmN0aW9uKGVycm9yLCBlKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihlcnJvci50eXBlID09IDIpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdm0uaXNvX2Vycm9ycyAtLTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZtLmVycm9ycyAtLTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0uZXJyb3JzLnNwbGljZShlLCAxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICBpZih2bS50b1NlbGVjdC5sZW5ndGgpe1xuICAgICAgICAgICAgICAgIERpYWxvZ1NlcnZpY2UuZnJvbVRlbXBsYXRlKCdzZWxlY3Rpc29mZXRjaGVycycsICRzY29wZSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICB9KVxuICAgICAgICAgIC8vaWYodm0udG9TZWxlY3QubGVuZ3RoKXtcbiAgICAgICAgICAgIC8vRGlhbG9nU2VydmljZS5mcm9tVGVtcGxhdGUoJ3NlbGVjdGlzb2ZldGNoZXJzJywgJHNjb3BlKTtcbiAgICAgICAgLy8gIH1cblxuICAgICAgICB9XG5cblxuICAgICAgICBmdW5jdGlvbiBzYXZlRGF0YSgpe1xuICAgICAgICAgIGNvbnNvbGUubG9nKHZtLm1ldGEpO1xuICAgICAgICAgIGNvbnNvbGUubG9nKHZtLmRhdGEpO1xuICAgICAgICAgIHZhciBpbnNlcnREYXRhID0ge2RhdGE6W119O1xuICAgICAgICAgIHZhciBtZXRhID0gW10sIGZpZWxkcyA9IFtdO1xuICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaCh2bS5kYXRhLCBmdW5jdGlvbihpdGVtLCBrZXkpe1xuICAgICAgICAgICAgaWYoaXRlbS5lcnJvcnMubGVuZ3RoID09IDApe1xuICAgICAgICAgICAgICBpdGVtLmRhdGFbMF0ueWVhciA9IHZtLm1ldGEueWVhcjtcbiAgICAgICAgICAgICAgaW5zZXJ0RGF0YS5kYXRhLnB1c2goaXRlbS5kYXRhWzBdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgICBhbmd1bGFyLmZvckVhY2godm0uZGF0YVswXS5kYXRhWzBdLCBmdW5jdGlvbihpdGVtLCBrZXkpe1xuICAgICAgICAgICAgY29uc29sZS5sb2codm0ubWV0YS50YWJsZVtrZXldLCBrZXkpO1xuICAgICAgICAgICAgaWYodm0ubWV0YS50YWJsZVtrZXldKXtcbiAgICAgICAgICAgICAgdmFyIGZpZWxkID0ge1xuICAgICAgICAgICAgICAgICdjb2x1bW4nOiBrZXksXG4gICAgICAgICAgICAgICAgJ3RpdGxlJzp2bS5tZXRhLnRhYmxlW2tleV0udGl0bGUsXG4gICAgICAgICAgICAgICAgJ2Rlc2NyaXB0aW9uJzp2bS5tZXRhLnRhYmxlW2tleV0uZGVzY3JpcHRpb25cbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgZmllbGRzLnB1c2goZmllbGQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaCh2bS5kYXRhLnRhYmxlLCBmdW5jdGlvbihpdGVtLCBrZXkpe1xuICAgICAgICAgICAgbWV0YS5wdXNoKHtcbiAgICAgICAgICAgICAgZmllbGQ6a2V5LFxuICAgICAgICAgICAgICBkYXRhOiBpdGVtXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH0pXG4gICAgICAgICAgdm0ubWV0YS5maWVsZHMgPSBmaWVsZHM7XG4gICAgICAgICAgdm0ubWV0YS5pbmZvID0gbWV0YTtcbiAgICAgICAgICBjb25zb2xlLmxvZyh2bS5tZXRhKTtcbiAgICAgICAgICBEYXRhU2VydmljZS5wb3N0KCdkYXRhL3RhYmxlcycsIHZtLm1ldGEpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgICAgICAgICBEYXRhU2VydmljZS5wb3N0KCdkYXRhL3RhYmxlcy8nK3Jlc3BvbnNlLmRhdGEudGFibGVfbmFtZSsnL2luc2VydCcsIGluc2VydERhdGEpLnRoZW4oZnVuY3Rpb24ocmVzKXtcbiAgICAgICAgICAgICAgICBpZihyZXMuZGF0YSA9PSB0cnVlKXtcbiAgICAgICAgICAgICAgICAgIHRvYXN0ci5zdWNjZXNzKGluc2VydERhdGEuZGF0YS5sZW5ndGgrJyBpdGVtcyBpbXBvcnRldCB0byAnK3ZtLm1ldGEubmFtZSwnU3VjY2VzcycpO1xuICAgICAgICAgICAgICAgICAgdm0uZGF0YSA9IFtdO1xuICAgICAgICAgICAgICAgICAgdm0uc3RlcCA9IDA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICB9LCBmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICAgICAgICBpZihyZXNwb25zZS5tZXNzYWdlKXtcbiAgICAgICAgICAgICAgdG9hc3RyLmVycm9yKHJlc3BvbnNlLm1lc3NhZ2UsICdPdWNoIScpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBsaXN0UmVzb3VyY2VzKCl7XG4gICAgICAgICAgRGF0YVNlcnZpY2UuZ2V0QWxsKCdkYXRhL3RhYmxlcycpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgICAgICAgdm0ucmVzb3VyY2VzID0gcmVzcG9uc2U7XG4gICAgICAgICAgICB2bS5zaG93UmVzb3VyY2VzID0gdHJ1ZTtcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICAgICRzY29wZS4kb24oXCIkc3RhdGVDaGFuZ2VTdGFydFwiLCBmdW5jdGlvbiAoZXZlbnQsIHRvU3RhdGUsIHRvUGFyYW1zLCBmcm9tU3RhdGUsIGZyb21QYXJhbXMpIHtcbiAgICAgICAgICBzd2l0Y2ggKHRvU3RhdGUubmFtZSkge1xuXG4gICAgICAgICAgICBjYXNlICdhcHAuaW5kZXguY3JlYXRlLmNoZWNrJzpcblxuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2FwcC5pbmRleC5jcmVhdGUubWV0YSc6XG4gICAgICAgICAgICAgICAgaWYoIXZtLm1ldGEuaXNvX2ZpZWxkKXtcblxuICAgICAgICAgICAgICAgICAgdG9hc3RyLmVycm9yKCdObyBmaWVsZCBmb3IgSVNPIENvZGUgc2VsZWN0ZWQhJywgJ0Vycm9yJyk7XG4gICAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgICRyb290U2NvcGUuc3RhdGVJc0xvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdhcHAuaW5kZXguY3JlYXRlLmZpbmFsJzpcblxuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG5cbiAgICAgICAgICAgICAgICBpZih2bS5kYXRhLmxlbmd0aCl7XG4gICAgICAgICAgICAgICAgICAkc2NvcGUudG9TdGF0ZSA9IHRvU3RhdGU7XG4gICAgICAgICAgICAgICAgICBEaWFsb2dTZXJ2aWNlLmZyb21UZW1wbGF0ZSgnbG9vc2VkYXRhJywgJHNjb3BlLCB2bS5kZWxldGVEYXRhKTtcbiAgICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLnN0YXRlSXNMb2FkaW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgJHNjb3BlLiRvbihcIiRzdGF0ZUNoYW5nZVN1Y2Nlc3NcIiwgZnVuY3Rpb24gKGV2ZW50LCB0b1N0YXRlLCB0b1BhcmFtcywgZnJvbVN0YXRlLCBmcm9tUGFyYW1zKSB7XG4gICAgICAgICAgaWYoIXZtLmRhdGEubGVuZ3RoKXtcbiAgICAgICAgICAgICRzdGF0ZS5nbygnYXBwLmluZGV4LmNyZWF0ZScpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgc3dpdGNoICh0b1N0YXRlLm5hbWUpIHtcbiAgICAgICAgICAgICAgY2FzZSAnYXBwLmluZGV4LmNyZWF0ZSc6XG4gICAgICAgICAgICAgICAgICB2bS5zdGVwID0gMDtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgY2FzZSAnYXBwLmluZGV4LmNyZWF0ZS5jaGVjayc6XG4gICAgICAgICAgICAgICAgICB2bS5zdGVwID0gMTtcbiAgICAgICAgICAgICAgICAgIHZtLnNob3dVcGxvYWRDb250YWluZXIgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgY2FzZSAnYXBwLmluZGV4LmNyZWF0ZS5tZXRhJzpcbiAgICAgICAgICAgICAgICAgIHZtLnN0ZXAgPSAyO1xuICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIGNhc2UgJ2FwcC5pbmRleC5jcmVhdGUuZmluYWwnOlxuICAgICAgICAgICAgICAgICAgdm0uc3RlcCA9IDM7XG4gICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgZGVmYXVsdDpcblxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdMb2dpbkN0cmwnLCBmdW5jdGlvbigkc3RhdGUsICRhdXRoLCB0b2FzdHIpe1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuICAgICAgICB2bS5kb0xvZ2luID0gZG9Mb2dpbjtcbiAgICAgICAgdm0uY2hlY2tMb2dnZWRJbiA9IGNoZWNrTG9nZ2VkSW47XG4gICAgICAgIHZtLnVzZXIgPSB7XG4gICAgICAgICAgZW1haWw6JycsXG4gICAgICAgICAgcGFzc3dvcmQ6JydcbiAgICAgICAgfTtcblxuICAgICAgICBhY3RpdmF0ZSgpO1xuXG4gICAgICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCl7XG4gICAgICAgICAgdm0uY2hlY2tMb2dnZWRJbigpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gY2hlY2tMb2dnZWRJbigpe1xuXG4gICAgICAgICAgaWYoJGF1dGguaXNBdXRoZW50aWNhdGVkKCkpe1xuICAgICAgICAgICAgLy8kc3RhdGUuZ28oJ2FwcC5pbmRleC5zaG93Jywge2luZGV4OidlcGknfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGRvTG9naW4oKXtcbiAgICAgICAgICAkYXV0aC5sb2dpbih2bS51c2VyKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgICAgICAgIHRvYXN0ci5zdWNjZXNzKCdZb3UgaGF2ZSBzdWNjZXNzZnVsbHkgc2lnbmVkIGluJyk7XG4gICAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC5pbmRleC5zaG93Jyx7aW5kZXg6J2VwaSd9KVxuICAgICAgICAgIH0pLmNhdGNoKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgICAgICAgIHRvYXN0ci5lcnJvcignUGxlYXNlIGNoZWNrIHlvdXIgZW1haWwgYW5kIHBhc3N3b3JkJywgJ1NvbWV0aGluZyB3ZW50IHdyb25nJyk7XG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ01hcEN0cmwnLCBmdW5jdGlvbiAobGVhZmxldERhdGEsIFZlY3RvcmxheWVyU2VydmljZSkge1xuXHRcdC8vXG5cdFx0dmFyIHZtID0gdGhpcztcblx0XHR2YXIgYXBpS2V5ID0gJ3BrLmV5SjFJam9pYldGbmJtOXNieUlzSW1FaU9pSnVTRmRVWWtnNEluMC41SE95a0trMHBOUDFOM2lzZlBRR1RRJztcblx0XHR2bS5kZWZhdWx0cyA9IHtcblx0XHRcdHNjcm9sbFdoZWVsWm9vbTogZmFsc2Vcblx0XHR9O1xuXHRcdHZtLmNlbnRlciA9IHtcblx0XHRcdGxhdDogMCxcblx0XHRcdGxuZzogMCxcblx0XHRcdHpvb206IDNcblx0XHR9O1xuXHRcdHZtLmxheWVycyA9IHtcblx0XHRcdGJhc2VsYXllcnM6IHtcblx0XHRcdFx0eHl6OiB7XG5cdFx0XHRcdFx0bmFtZTogJ01hcEJveCBPdXRkb29ycyBNb2QnLFxuXHRcdFx0XHRcdHVybDogJ2h0dHBzOi8ve3N9LnRpbGVzLm1hcGJveC5jb20vdjQvdmFsZGVycmFtYS5kODYxMTRiNi97en0ve3h9L3t5fS5wbmc/YWNjZXNzX3Rva2VuPScgKyBhcGlLZXksXG5cdFx0XHRcdFx0dHlwZTogJ3h5eicsXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdFx0bGVhZmxldERhdGEuZ2V0TWFwKCdtYXAnKS50aGVuKGZ1bmN0aW9uKG1hcCkge1xuXHRcdFx0dmFyIHVybCA9ICdodHRwOi8vdjIyMDE1MDUyODM1ODI1MzU4LnlvdXJ2c2VydmVyLm5ldDozMDAxL3NlcnZpY2VzL3Bvc3RnaXMvY291bnRyaWVzX2JpZy9nZW9tL3ZlY3Rvci10aWxlcy97en0ve3h9L3t5fS5wYmY/ZmllbGRzPWlkLGFkbWluLGFkbTBfYTMsd2JfYTMsc3VfYTMsaXNvX2EzLG5hbWUsbmFtZV9sb25nJzsgLy9cblx0XHRcdHZhciBsYXllciA9IG5ldyBMLlRpbGVMYXllci5NVlRTb3VyY2Uoe1xuXHRcdFx0XHR1cmw6IHVybCxcblx0XHRcdFx0ZGVidWc6IGZhbHNlLFxuXHRcdFx0XHRjbGlja2FibGVMYXllcnM6IFsnY291bnRyaWVzX2JpZ19nZW9tJ10sXG5cdFx0XHRcdG11dGV4VG9nZ2xlOiB0cnVlLFxuXHRcdFx0XHRnZXRJREZvckxheWVyRmVhdHVyZTogZnVuY3Rpb24oZmVhdHVyZSkge1xuXHRcdFx0XHRcdHJldHVybiBmZWF0dXJlLnByb3BlcnRpZXMuYWRtMF9hMztcblx0XHRcdFx0fSxcblx0XHRcdFx0ZmlsdGVyOiBmdW5jdGlvbihmZWF0dXJlLCBjb250ZXh0KSB7XG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdFx0IG1hcC5hZGRMYXllcihWZWN0b3JsYXllclNlcnZpY2Uuc2V0TGF5ZXIobGF5ZXIpKTtcblx0XHRcdCB2YXIgbGFiZWxzTGF5ZXIgPSBMLnRpbGVMYXllcignaHR0cHM6Ly97c30udGlsZXMubWFwYm94LmNvbS92NC9tYWdub2xvLjA2MDI5YTljL3t6fS97eH0ve3l9LnBuZz9hY2Nlc3NfdG9rZW49JyArIGFwaUtleSk7XG5cdFx0XHQgbWFwLmFkZExheWVyKGxhYmVsc0xheWVyKTtcblx0XHRcdCBsYWJlbHNMYXllci5icmluZ1RvRnJvbnQoKTtcblx0XHR9KTtcblx0fSk7XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignU2VsZWN0ZWRDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBnZXRDb3VudHJ5LCBWZWN0b3JsYXllclNlcnZpY2UsICRmaWx0ZXIpe1xuICAgICAgICAvL1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuICAgICAgICB2bS5zdHJ1Y3R1cmUgPSAkc2NvcGUuJHBhcmVudC52bS5zdHJ1Y3R1cmU7XG4gICAgICAgIHZtLmRpc3BsYXkgPSAkc2NvcGUuJHBhcmVudC52bS5kaXNwbGF5O1xuICAgICAgICB2bS5kYXRhID0gJHNjb3BlLiRwYXJlbnQudm0uZGF0YTtcbiAgICAgICAgdm0uY3VycmVudCA9IGdldENvdW50cnk7XG4gICAgICAgIHZtLm12dFNvdXJjZSA9IFZlY3RvcmxheWVyU2VydmljZS5nZXRMYXllcigpO1xuICAgICAgICB2bS5nZXRSYW5rID0gZ2V0UmFuaztcbiAgICAgICAgdm0uZ2V0T2Zmc2V0ID0gZ2V0T2Zmc2V0O1xuICAgICAgICB2bS5nZXRUZW5kZW5jeSA9IGdldFRlbmRlbmN5O1xuXG4gICAgICAgIGZ1bmN0aW9uIGNhbGNSYW5rKCkge1xuICAgICAgICAgIHZhciByYW5rID0gMDtcbiAgICAgICAgICBhbmd1bGFyLmZvckVhY2godm0uZGF0YSwgZnVuY3Rpb24oaXRlbSkge1xuICAgICAgICAgICAgaXRlbVt2bS5zdHJ1Y3R1cmUuc2NvcmVfZmllbGRfbmFtZV0gPSBwYXJzZUZsb2F0KGl0ZW1bdm0uc3RydWN0dXJlLnNjb3JlX2ZpZWxkX25hbWVdKTtcbiAgICAgICAgICAgIGl0ZW1bJ3Njb3JlJ10gPSBwYXJzZUludChpdGVtWydzY29yZSddKTtcbiAgICAgICAgICB9KVxuICAgICAgICAgIHZhciBmaWx0ZXIgPSAkZmlsdGVyKCdvcmRlckJ5Jykodm0uZGF0YSwgW3ZtLnN0cnVjdHVyZS5zY29yZV9maWVsZF9uYW1lLCBcInNjb3JlXCJdLCB0cnVlKTtcbiAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGZpbHRlci5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKGZpbHRlcltpXS5pc28gPT0gdm0uY3VycmVudC5pc28pIHtcbiAgICAgICAgICAgICAgcmFuayA9IGkgKyAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICB2bS5jdXJyZW50W3ZtLnN0cnVjdHVyZS5zY29yZV9maWVsZF9uYW1lKydfcmFuayddID0gcmFuaztcbiAgICAgICAgICB2bS5jaXJjbGVPcHRpb25zID0ge1xuICAgICAgICAgICAgICBjb2xvcjp2bS5zdHJ1Y3R1cmUuY29sb3IsXG4gICAgICAgICAgICAgIGZpZWxkOnZtLnN0cnVjdHVyZS5zY29yZV9maWVsZF9uYW1lKydfcmFuaydcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gZ2V0UmFuayhjb3VudHJ5KXtcbiAgICAgICAgICB2YXIgZmlsdGVyID0gJGZpbHRlcignb3JkZXJCeScpKHZtLmRhdGEsIFt2bS5zdHJ1Y3R1cmUuc2NvcmVfZmllbGRfbmFtZSwgXCJzY29yZVwiXSwgdHJ1ZSk7XG4gICAgICAgICAgdmFyIHJhbmsgPSAwO1xuICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaChmaWx0ZXIsIGZ1bmN0aW9uKGl0ZW0sIGtleSl7XG4gICAgICAgICAgICBpZihpdGVtLmNvdW50cnkgPT0gY291bnRyeS5jb3VudHJ5KXtcbiAgICAgICAgICAgICAgcmFuayA9IGtleTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgICByZXR1cm4gcmFuaysxO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGdldE9mZnNldCgpIHtcbiAgICBcdFx0XHRpZiAoIXZtLmN1cnJlbnQpIHtcbiAgICBcdFx0XHRcdHJldHVybiAwO1xuICAgIFx0XHRcdH1cbiAgICBcdFx0XHRyZXR1cm4gKHZtLmdldFJhbmsodm0uY3VycmVudCkgLSAyKSAqIDE2O1xuICAgIFx0XHR9O1xuXG4gICAgXHRcdGZ1bmN0aW9uIGdldFRlbmRlbmN5KCkge1xuICAgIFx0XHRcdGlmICghdm0uY3VycmVudCkge1xuICAgIFx0XHRcdFx0cmV0dXJuICdhcnJvd19kcm9wX2Rvd24nXG4gICAgXHRcdFx0fVxuICAgIFx0XHRcdHJldHVybiB2bS5jdXJyZW50LnBlcmNlbnRfY2hhbmdlID4gMCA/ICdhcnJvd19kcm9wX3VwJyA6ICdhcnJvd19kcm9wX2Rvd24nO1xuICAgIFx0XHR9O1xuXG4gICAgICAgICRzY29wZS4kd2F0Y2goJ3ZtLmN1cnJlbnQnLCBmdW5jdGlvbiAobiwgbykge1xuICAgICAgICAgIGlmIChuID09PSBvKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZihvLmlzbyl7XG4gICAgICAgICAgICAgIHZtLm12dFNvdXJjZS5sYXllcnMuY291bnRyaWVzX2JpZ19nZW9tLmZlYXR1cmVzW28uaXNvXS5zZWxlY3RlZCA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2FsY1JhbmsoKTtcbiAgICAgICAgICAgIGZldGNoTmF0aW9uRGF0YShuLmlzbyk7XG5cblxuICAgICAgICB9KTtcbiAgICAgICAgLyo7Ki9cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignU2lkZWJhckN0cmwnLCBmdW5jdGlvbigkc2NvcGUsICRzdGF0ZSl7XG5cblxuXHR9KTtcblxufSkoKTsiLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdTaWdudXBDdHJsJywgZnVuY3Rpb24oKXtcbiAgICAgICAgLy9cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignVG9hc3RzQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgVG9hc3RTZXJ2aWNlKXtcblxuXHRcdCRzY29wZS50b2FzdFN1Y2Nlc3MgPSBmdW5jdGlvbigpe1xuXHRcdFx0VG9hc3RTZXJ2aWNlLnNob3coJ1VzZXIgYWRkZWQgc3VjY2Vzc2Z1bGx5IScpO1xuXHRcdH07XG5cblx0XHQkc2NvcGUudG9hc3RFcnJvciA9IGZ1bmN0aW9uKCl7XG5cdFx0XHRUb2FzdFNlcnZpY2UuZXJyb3IoJ0Nvbm5lY3Rpb24gaW50ZXJydXB0ZWQhJyk7XG5cdFx0fTtcblxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ1Vuc3VwcG9ydGVkQnJvd3NlckN0cmwnLCBmdW5jdGlvbigpe1xuICAgICAgICAvL1xuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignVXNlckN0cmwnLCBmdW5jdGlvbigpe1xuICAgICAgICAvL1xuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignQWRkVXNlcnNDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBEaWFsb2dTZXJ2aWNlKXtcblxuICAgICAgICAkc2NvcGUuc2F2ZSA9IGZ1bmN0aW9uKCl7XG5cdCAgICAgICAgLy9kbyBzb21ldGhpbmcgdXNlZnVsXG4gICAgICAgICAgICBEaWFsb2dTZXJ2aWNlLmhpZGUoKTtcbiAgICAgICAgfTtcblxuICAgICAgICAkc2NvcGUuaGlkZSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIFx0RGlhbG9nU2VydmljZS5oaWRlKCk7XG4gICAgICAgIH07XG5cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0VkaXRjb2x1bW5DdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBEaWFsb2dTZXJ2aWNlKXtcbiAgICAgICAgJHNjb3BlLm5hbWUgPSAkc2NvcGUuJHBhcmVudC52bS50b0VkaXQ7XG4gICAgICAgIGlmKHR5cGVvZiAkc2NvcGUuJHBhcmVudC52bS5tZXRhLnRhYmxlWyRzY29wZS5uYW1lXSA9PSBcInVuZGVmaW5lZFwiKXtcbiAgICAgICAgICAkc2NvcGUuJHBhcmVudC52bS5tZXRhLnRhYmxlWyRzY29wZS5uYW1lXSA9IHt9O1xuICAgICAgICB9XG4gICAgICAgIGVsc2V7XG4gICAgICAgICAgaWYoJHNjb3BlLiRwYXJlbnQudm0ubWV0YS50YWJsZVskc2NvcGUubmFtZV0udGl0bGUpe1xuICAgICAgICAgICAgJHNjb3BlLnRpdGxlID0gJHNjb3BlLiRwYXJlbnQudm0ubWV0YS50YWJsZVskc2NvcGUubmFtZV0udGl0bGU7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmKCRzY29wZS4kcGFyZW50LnZtLm1ldGEudGFibGVbJHNjb3BlLm5hbWVdLmRlc2NyaXB0aW9uKXtcbiAgICAgICAgICAgICRzY29wZS5kZXNjcmlwdGlvbiA9ICRzY29wZS4kcGFyZW50LnZtLm1ldGEudGFibGVbJHNjb3BlLm5hbWVdLmRlc2NyaXB0aW9uO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgICRzY29wZS5zYXZlID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAkc2NvcGUuJHBhcmVudC52bS5tZXRhLnRhYmxlWyRzY29wZS5uYW1lXS50aXRsZSA9ICRzY29wZS50aXRsZTtcbiAgICAgICAgICAkc2NvcGUuJHBhcmVudC52bS5tZXRhLnRhYmxlWyRzY29wZS5uYW1lXS5kZXNjcmlwdGlvbiA9ICRzY29wZS5kZXNjcmlwdGlvbjtcbiAgICAgICAgICBEaWFsb2dTZXJ2aWNlLmhpZGUoKTtcbiAgICAgICAgfTtcblxuICAgICAgICAkc2NvcGUuaGlkZSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIFx0RGlhbG9nU2VydmljZS5oaWRlKCk7XG4gICAgICAgIH07XG5cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0VkaXRyb3dDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBEaWFsb2dTZXJ2aWNlKXtcbiAgICAgICAgJHNjb3BlLmRhdGEgPSAkc2NvcGUuJHBhcmVudC52bS5zZWxlY3RlZFswXTtcbiAgICAgICAgJHNjb3BlLnNhdmUgPSBmdW5jdGlvbigpe1xuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCRzY29wZS5kYXRhKTtcbiAgICAgICAgfTtcblxuICAgICAgICAkc2NvcGUuaGlkZSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIFx0RGlhbG9nU2VydmljZS5oaWRlKCk7XG4gICAgICAgIH07XG5cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0xvb3NlZGF0YUN0cmwnLCBmdW5jdGlvbigkc2NvcGUsICRzdGF0ZSwgRGlhbG9nU2VydmljZSl7XG5cbiAgICAgICAgJHNjb3BlLnNhdmUgPSBmdW5jdGlvbigpe1xuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgICRzY29wZS52bS5kZWxldGVEYXRhKCk7XG4gICAgICAgICAgICAkc3RhdGUuZ28oJHNjb3BlLnRvU3RhdGUubmFtZSk7XG4gICAgICAgICAgICBEaWFsb2dTZXJ2aWNlLmhpZGUoKTtcbiAgICAgICAgfTtcblxuICAgICAgICAkc2NvcGUuaGlkZSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIFx0RGlhbG9nU2VydmljZS5oaWRlKCk7XG4gICAgICAgIH07XG5cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ1NlbGVjdGlzb2ZldGNoZXJzQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgRGlhbG9nU2VydmljZSl7XG4gICAgICAgICRzY29wZS5pc28gPSAkc2NvcGUuJHBhcmVudC52bS5tZXRhLmlzb19maWVsZDtcbiAgICAgICAgJHNjb3BlLmxpc3QgPSAkc2NvcGUuJHBhcmVudC52bS50b1NlbGVjdDtcblxuICAgICAgICAkc2NvcGUuc2F2ZSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgRGlhbG9nU2VydmljZS5oaWRlKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgJHNjb3BlLmhpZGUgPSBmdW5jdGlvbigpe1xuICAgICAgICBcdERpYWxvZ1NlcnZpY2UuaGlkZSgpO1xuICAgICAgICB9O1xuXG4gICAgICAgICRzY29wZS4kd2F0Y2goJ2xpc3QnLCBmdW5jdGlvbihuLCBvKXtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKG4pO1xuICAgICAgICAgIGlmKG4gPT09IG8pe1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICBhbmd1bGFyLmZvckVhY2gobiwgZnVuY3Rpb24oaXRlbSwga2V5KXtcbiAgICAgICAgICAgIGlmKGl0ZW0uZW50cnkuZGF0YVswXVskc2NvcGUuaXNvXSAmJiAhb1trZXldLmVudHJ5LmRhdGFbMF1bJHNjb3BlLmlzb10pe1xuICAgICAgICAgICAgICBpdGVtLmVudHJ5LmVycm9ycy5zcGxpY2UoMCwxKTtcbiAgICAgICAgICAgICAgJHNjb3BlLiRwYXJlbnQudm0uaXNvX2Vycm9ycyAtLTtcbiAgICAgICAgICAgICAgJHNjb3BlLiRwYXJlbnQudm0uZXJyb3JzIC0tO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9LCB0cnVlKTtcblxuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCAnYXBwLmNvbnRyb2xsZXJzJyApLmNvbnRyb2xsZXIoICdCdWJibGVzQ3RybCcsIGZ1bmN0aW9uKCl7XG5cdFx0Ly9cblxuICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGZ1bmN0aW9uIEN1c3RvbVRvb2x0aXAodG9vbHRpcElkLCB3aWR0aCkge1xuXHRcdHZhciB0b29sdGlwSWQgPSB0b29sdGlwSWQ7XG5cdFx0dmFyIGVsZW0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0b29sdGlwSWQpO1xuXHRcdGlmKGVsZW0gPT0gbnVsbCl7XG5cdFx0XHRhbmd1bGFyLmVsZW1lbnQoZG9jdW1lbnQpLmZpbmQoJ2JvZHknKS5hcHBlbmQoXCI8ZGl2IGNsYXNzPSd0b29sdGlwIG1kLXdoaXRlZnJhbWUtejMnIGlkPSdcIiArIHRvb2x0aXBJZCArIFwiJz48L2Rpdj5cIik7XG5cdFx0fVxuXHRcdGhpZGVUb29sdGlwKCk7XG5cdFx0ZnVuY3Rpb24gc2hvd1Rvb2x0aXAoY29udGVudCwgZGF0YSwgZXZlbnQsIGVsZW1lbnQpIHtcblx0XHRcdGFuZ3VsYXIuZWxlbWVudChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjJyArIHRvb2x0aXBJZCkpLmh0bWwoY29udGVudCk7XG5cdFx0XHRhbmd1bGFyLmVsZW1lbnQoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignIycgKyB0b29sdGlwSWQpKS5jc3MoJ2Rpc3BsYXknLCAnYmxvY2snKTtcblxuXHRcdFx0cmV0dXJuIHVwZGF0ZVBvc2l0aW9uKGV2ZW50LCBkYXRhLCBlbGVtZW50KTtcblx0XHR9XG5cdFx0ZnVuY3Rpb24gaGlkZVRvb2x0aXAoKSB7XG5cdFx0XHRhbmd1bGFyLmVsZW1lbnQoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignIycgKyB0b29sdGlwSWQpKS5jc3MoJ2Rpc3BsYXknLCAnbm9uZScpO1xuXHRcdH1cblx0XHRmdW5jdGlvbiB1cGRhdGVQb3NpdGlvbihldmVudCwgZCwgZWxlbWVudCkge1xuXHRcdFx0dmFyIHR0aWQgPSBcIiNcIiArIHRvb2x0aXBJZDtcblx0XHRcdHZhciB4T2Zmc2V0ID0gMjA7XG5cdFx0XHR2YXIgeU9mZnNldCA9IDEwO1xuXHRcdFx0dmFyIHN2ZyA9IGVsZW1lbnQuZmluZCgnc3ZnJylbMF07Ly9kb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjc3ZnX3ZpcycpO1xuXHRcdFx0dmFyIHdzY3JZID0gd2luZG93LnNjcm9sbFk7XG5cdFx0XHR2YXIgdHR3ID0gYW5ndWxhci5lbGVtZW50KGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodHRpZCkpLm9mZnNldFdpZHRoO1xuXHRcdFx0dmFyIHR0aCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodHRpZCkub2Zmc2V0SGVpZ2h0O1xuXHRcdFx0dmFyIHR0dG9wID0gc3ZnLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcCArIGQueSAtIHR0aCAvIDI7XG5cdFx0XHR2YXIgdHRsZWZ0ID0gc3ZnLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmxlZnQgKyBkLnggKyBkLnJhZGl1cyArIDEyO1xuXHRcdFx0cmV0dXJuIGFuZ3VsYXIuZWxlbWVudChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHR0aWQpKS5jc3MoJ3RvcCcsIHR0dG9wICsgJ3B4JykuY3NzKCdsZWZ0JywgdHRsZWZ0ICsgJ3B4Jyk7XG5cdFx0fVxuXHRcdHJldHVybiB7XG5cdFx0XHRzaG93VG9vbHRpcDogc2hvd1Rvb2x0aXAsXG5cdFx0XHRoaWRlVG9vbHRpcDogaGlkZVRvb2x0aXAsXG5cdFx0XHR1cGRhdGVQb3NpdGlvbjogdXBkYXRlUG9zaXRpb25cblx0XHR9XG5cdH1cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5kaXJlY3RpdmVzJykuZGlyZWN0aXZlKCdidWJibGVzJywgZnVuY3Rpb24gKCRjb21waWxlLCBJY29uc1NlcnZpY2UpIHtcblx0XHR2YXIgZGVmYXVsdHM7XG5cdFx0ZGVmYXVsdHMgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHR3aWR0aDogMzAwLFxuXHRcdFx0XHRoZWlnaHQ6IDMwMCxcblx0XHRcdFx0bGF5b3V0X2dyYXZpdHk6IDAsXG5cdFx0XHRcdHNpemVmYWN0b3I6Myxcblx0XHRcdFx0dmlzOiBudWxsLFxuXHRcdFx0XHRmb3JjZTogbnVsbCxcblx0XHRcdFx0ZGFtcGVyOiAwLjA4NSxcblx0XHRcdFx0Y2lyY2xlczogbnVsbCxcblx0XHRcdFx0Ym9yZGVyczogdHJ1ZSxcblx0XHRcdFx0bGFiZWxzOiB0cnVlLFxuXHRcdFx0XHRmaWxsX2NvbG9yOiBkMy5zY2FsZS5vcmRpbmFsKCkuZG9tYWluKFtcImVoXCIsIFwiZXZcIl0pLnJhbmdlKFtcIiNhMzEwMzFcIiwgXCIjYmVjY2FlXCJdKSxcblx0XHRcdFx0bWF4X2Ftb3VudDogJycsXG5cdFx0XHRcdHJhZGl1c19zY2FsZTogJycsXG5cdFx0XHRcdGR1cmF0aW9uOiAxMDAwLFxuXHRcdFx0XHR0b29sdGlwOiBDdXN0b21Ub29sdGlwKFwiYnViYmxlc190b29sdGlwXCIsIDI0MClcblx0XHRcdH07XG5cdFx0fTtcblx0XHRyZXR1cm4ge1xuXHRcdFx0cmVzdHJpY3Q6ICdFJyxcblx0XHRcdHNjb3BlOiB7XG5cdFx0XHRcdGNoYXJ0ZGF0YTogJz0nLFxuXHRcdFx0XHRkaXJlY3Rpb246ICc9Jyxcblx0XHRcdFx0Z3Jhdml0eTogJz0nLFxuXHRcdFx0XHRzaXplZmFjdG9yOiAnPScsXG5cdFx0XHRcdGluZGV4ZXI6ICc9Jyxcblx0XHRcdFx0Ym9yZGVyczogJ0AnXG5cdFx0XHR9LFxuXHRcdFx0cmVxdWlyZTogJ25nTW9kZWwnLFxuXHRcdFx0bGluazogZnVuY3Rpb24gKHNjb3BlLCBlbGVtLCBhdHRycywgbmdNb2RlbCkge1xuXHRcdFx0XHR2YXIgb3B0aW9ucyA9IGFuZ3VsYXIuZXh0ZW5kKGRlZmF1bHRzKCksIGF0dHJzKTtcblx0XHRcdFx0dmFyIG5vZGVzID0gW10sXG5cdFx0XHRcdFx0bGlua3MgPSBbXSxcblx0XHRcdFx0XHRsYWJlbHMgPSBbXSxcblx0XHRcdFx0XHRncm91cHMgPSBbXTtcblxuXHRcdFx0XHR2YXIgbWF4X2Ftb3VudCA9IGQzLm1heChzY29wZS5jaGFydGRhdGEsIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHBhcnNlSW50KGQudmFsdWUpO1xuXHRcdFx0XHR9KTtcblx0XHRcdFx0Ly9vcHRpb25zLmhlaWdodCA9IG9wdGlvbnMud2lkdGggKiAxLjE7XG5cdFx0XHRcdG9wdGlvbnMucmFkaXVzX3NjYWxlID0gZDMuc2NhbGUucG93KCkuZXhwb25lbnQoMC41KS5kb21haW4oWzAsIG1heF9hbW91bnRdKS5yYW5nZShbMiwgODVdKTtcblx0XHRcdFx0b3B0aW9ucy5jZW50ZXIgPSB7XG5cdFx0XHRcdFx0eDogb3B0aW9ucy53aWR0aCAvIDIsXG5cdFx0XHRcdFx0eTogb3B0aW9ucy5oZWlnaHQgLyAyXG5cdFx0XHRcdH07XG5cdFx0XHRcdG9wdGlvbnMuY2F0X2NlbnRlcnMgPSB7XG5cdFx0XHRcdFx0XCJlaFwiOiB7XG5cdFx0XHRcdFx0XHR4OiBvcHRpb25zLndpZHRoIC8gMixcblx0XHRcdFx0XHRcdHk6IG9wdGlvbnMuaGVpZ2h0ICAqIDAuNDUsXG5cdFx0XHRcdFx0XHRkYW1wZXI6IDAuMDg1XG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcImV2XCI6IHtcblx0XHRcdFx0XHRcdHg6IG9wdGlvbnMud2lkdGggLyAyLFxuXHRcdFx0XHRcdFx0eTogb3B0aW9ucy5oZWlnaHQgICogMC41NSxcblx0XHRcdFx0XHRcdGRhbXBlcjogMC4wODVcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH07XG5cblx0XHRcdFx0dmFyIGNyZWF0ZV9ub2RlcyA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRpZihzY29wZS5pbmRleGVyLmNoaWxkcmVuLmxlbmd0aCA9PSAyICYmIHNjb3BlLmluZGV4ZXIuY2hpbGRyZW5bMF0uY2hpbGRyZW4ubGVuZ3RoID4gMCl7XG5cdFx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2goc2NvcGUuaW5kZXhlci5jaGlsZHJlbiwgZnVuY3Rpb24gKGdyb3VwKSB7XG5cdFx0XHRcdFx0XHRcdHZhciBkID0ge1xuXHRcdFx0XHRcdFx0XHRcdHR5cGU6IGdyb3VwLmNvbHVtbl9uYW1lLFxuXHRcdFx0XHRcdFx0XHRcdG5hbWU6IGdyb3VwLnRpdGxlLFxuXHRcdFx0XHRcdFx0XHRcdGdyb3VwOiBncm91cC5jb2x1bW5fbmFtZS5zdWJzdHJpbmcoMCwyKSxcblx0XHRcdFx0XHRcdFx0XHRjb2xvcjogZ3JvdXAuY29sb3IsXG5cdFx0XHRcdFx0XHRcdFx0aWNvbjogZ3JvdXAuaWNvbixcblx0XHRcdFx0XHRcdFx0XHR1bmljb2RlOiBJY29uc1NlcnZpY2UuZ2V0VW5pY29kZShncm91cC5pY29uKSxcblx0XHRcdFx0XHRcdFx0XHRkYXRhOiBncm91cCxcblx0XHRcdFx0XHRcdFx0XHRjaGlsZHJlbjpncm91cC5jaGlsZHJlblxuXHRcdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdFx0XHRsYWJlbHMucHVzaChkKTtcblxuXHRcdFx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2goZ3JvdXAuY2hpbGRyZW4sIGZ1bmN0aW9uIChpdGVtKSB7XG5cdFx0XHRcdFx0XHRcdFx0Ly9jb25zb2xlLmxvZyhzY29wZS5jaGFydGRhdGFbaXRlbS5jb2x1bW5fbmFtZV0sIHNjb3BlLmNoYXJ0ZGF0YVtpdGVtLmNvbHVtbl9uYW1lXSAvIHNjb3BlLnNpemVmYWN0b3IpO1xuXHRcdFx0XHRcdFx0XHRcdGlmIChzY29wZS5jaGFydGRhdGFbaXRlbS5jb2x1bW5fbmFtZV0pIHtcblx0XHRcdFx0XHRcdFx0XHRcdHZhciBub2RlID0ge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR0eXBlOiBpdGVtLmNvbHVtbl9uYW1lLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRyYWRpdXM6IHNjb3BlLmNoYXJ0ZGF0YVtpdGVtLmNvbHVtbl9uYW1lXSAvIHNjb3BlLnNpemVmYWN0b3IsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHZhbHVlOiBzY29wZS5jaGFydGRhdGFbaXRlbS5jb2x1bW5fbmFtZV0gLyBzY29wZS5zaXplZmFjdG9yLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRuYW1lOiBpdGVtLnRpdGxlLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRncm91cDogaXRlbS5jb2x1bW5fbmFtZS5zdWJzdHJpbmcoMCwyKSxcblx0XHRcdFx0XHRcdFx0XHRcdFx0eDogb3B0aW9ucy5jZW50ZXIueCxcblx0XHRcdFx0XHRcdFx0XHRcdFx0eTogb3B0aW9ucy5jZW50ZXIueSxcblx0XHRcdFx0XHRcdFx0XHRcdFx0Y29sb3I6IGl0ZW0uY29sb3IsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGljb246IGl0ZW0uaWNvbixcblx0XHRcdFx0XHRcdFx0XHRcdFx0dW5pY29kZTogSWNvbnNTZXJ2aWNlLmdldFVuaWNvZGUoaXRlbS5pY29uKSxcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZGF0YTogaXRlbSxcblx0XHRcdFx0XHRcdFx0XHRcdFx0Y2hpbGRyZW46aXRlbVxuXHRcdFx0XHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdFx0XHRcdG5vZGVzLnB1c2gobm9kZSk7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0Y3JlYXRlX2dyb3VwcygpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNle1xuXHRcdFx0XHRcdFx0dmFyIGQgPSB7XG5cdFx0XHRcdFx0XHRcdHR5cGU6IHNjb3BlLmluZGV4ZXIuY29sdW1uX25hbWUsXG5cdFx0XHRcdFx0XHRcdG5hbWU6IHNjb3BlLmluZGV4ZXIudGl0bGUsXG5cdFx0XHRcdFx0XHRcdGdyb3VwOiBzY29wZS5pbmRleGVyLmNvbHVtbl9uYW1lLnN1YnN0cmluZygwLDIpLFxuXHRcdFx0XHRcdFx0XHRjb2xvcjogc2NvcGUuaW5kZXhlci5jb2xvcixcblx0XHRcdFx0XHRcdFx0aWNvbjogc2NvcGUuaW5kZXhlci5pY29uLFxuXHRcdFx0XHRcdFx0XHR1bmljb2RlOiBzY29wZS5pbmRleGVyLnVuaWNvZGUsXG5cdFx0XHRcdFx0XHRcdGRhdGE6IHNjb3BlLmluZGV4ZXIuZGF0YSxcblx0XHRcdFx0XHRcdFx0Y2hpbGRyZW46IHNjb3BlLmluZGV4ZXIuY2hpbGRyZW5cblx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0XHRsYWJlbHMucHVzaChkKTtcblx0XHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChzY29wZS5pbmRleGVyLmNoaWxkcmVuLCBmdW5jdGlvbiAoaXRlbSkge1xuXHRcdFx0XHRcdFx0XHQvL2NvbnNvbGUubG9nKHNjb3BlLmNoYXJ0ZGF0YVtpdGVtLmNvbHVtbl9uYW1lXSwgc2NvcGUuY2hhcnRkYXRhW2l0ZW0uY29sdW1uX25hbWVdIC8gc2NvcGUuc2l6ZWZhY3Rvcik7XG5cdFx0XHRcdFx0XHRcdGlmIChzY29wZS5jaGFydGRhdGFbaXRlbS5jb2x1bW5fbmFtZV0pIHtcblx0XHRcdFx0XHRcdFx0XHR2YXIgbm9kZSA9IHtcblx0XHRcdFx0XHRcdFx0XHRcdHR5cGU6IGl0ZW0uY29sdW1uX25hbWUsXG5cdFx0XHRcdFx0XHRcdFx0XHRyYWRpdXM6IHNjb3BlLmNoYXJ0ZGF0YVtpdGVtLmNvbHVtbl9uYW1lXSAvIHNjb3BlLnNpemVmYWN0b3IsXG5cdFx0XHRcdFx0XHRcdFx0XHR2YWx1ZTogc2NvcGUuY2hhcnRkYXRhW2l0ZW0uY29sdW1uX25hbWVdIC8gc2NvcGUuc2l6ZWZhY3Rvcixcblx0XHRcdFx0XHRcdFx0XHRcdG5hbWU6IGl0ZW0udGl0bGUsXG5cdFx0XHRcdFx0XHRcdFx0XHRncm91cDogaXRlbS5jb2x1bW5fbmFtZS5zdWJzdHJpbmcoMCwyKSxcblx0XHRcdFx0XHRcdFx0XHRcdHg6IG9wdGlvbnMuY2VudGVyLngsXG5cdFx0XHRcdFx0XHRcdFx0XHR5OiBvcHRpb25zLmNlbnRlci55LFxuXHRcdFx0XHRcdFx0XHRcdFx0Y29sb3I6IGl0ZW0uY29sb3IsXG5cdFx0XHRcdFx0XHRcdFx0XHRpY29uOiBpdGVtLmljb24sXG5cdFx0XHRcdFx0XHRcdFx0XHR1bmljb2RlOiBJY29uc1NlcnZpY2UuZ2V0VW5pY29kZShpdGVtLmljb24pLFxuXHRcdFx0XHRcdFx0XHRcdFx0ZGF0YTogaXRlbSxcblx0XHRcdFx0XHRcdFx0XHRcdGNoaWxkcmVuOml0ZW1cblx0XHRcdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdFx0XHRcdG5vZGVzLnB1c2gobm9kZSk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fTtcblx0XHRcdFx0dmFyIGNsZWFyX25vZGVzID0gZnVuY3Rpb24oKXtcblx0XHRcdFx0XHQvL2QzLnNlbGVjdEFsbChcInN2ZyA+ICpcIikucmVtb3ZlKCk7XG5cdFx0XHRcdFx0bm9kZXMgPSBbXTtcblx0XHRcdFx0XHRsYWJlbHMgPSBbXTtcblx0XHRcdFx0fVxuXHRcdFx0XHR2YXIgY3JlYXRlX2dyb3VwcyA9IGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0Z3JvdXBzID0ge307XG5cdFx0XHRcdFx0dmFyIGNvdW50ID0gMDtcblx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2gobm9kZXMsIGZ1bmN0aW9uKG5vZGUpe1xuXHRcdFx0XHRcdFx0XHR2YXIgZXhpc3RzID0gZmFsc2U7XG5cdFx0XHRcdFx0XHRcdHZhciBncm91cCA9IHt9O1xuXHRcdFx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2goZ3JvdXBzLCBmdW5jdGlvbihncm91cCwgaW5kZXgpe1xuXHRcdFx0XHRcdFx0XHRcdGlmKG5vZGUuZ3JvdXAgPT0gaW5kZXgpe1xuXHRcdFx0XHRcdFx0XHRcdFx0ZXhpc3RzID0gdHJ1ZTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0XHRpZighZXhpc3RzKXtcblx0XHRcdFx0XHRcdFx0XHRjb3VudCsrO1xuXHRcdFx0XHRcdFx0XHRcdGdyb3Vwc1tub2RlLmdyb3VwXSA9IHtcblx0XHRcdFx0XHRcdFx0XHRcdHg6IG9wdGlvbnMud2lkdGggLyAyLFxuXHRcdFx0XHRcdFx0XHRcdFx0eTogb3B0aW9ucy5oZWlnaHQgLyAyICsgKDEgLSBjb3VudCksXG5cdFx0XHRcdFx0XHRcdFx0XHRkYW1wZXI6IDAuMDg1LFxuXHRcdFx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHR9O1xuXHRcdFx0XHR2YXIgY3JlYXRlX3ZpcyA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRhbmd1bGFyLmVsZW1lbnQoZWxlbSkuaHRtbCgnJyk7XG5cdFx0XHRcdFx0b3B0aW9ucy52aXMgPSBkMy5zZWxlY3QoZWxlbVswXSkuYXBwZW5kKFwic3ZnXCIpLmF0dHIoXCJ3aWR0aFwiLCBvcHRpb25zLndpZHRoKS5hdHRyKFwiaGVpZ2h0XCIsIG9wdGlvbnMuaGVpZ2h0KS5hdHRyKFwiaWRcIiwgXCJzdmdfdmlzXCIpO1xuXG5cdFx0XHRcdFx0aWYgKCFvcHRpb25zLmJvcmRlcnMpIHtcblx0XHRcdFx0XHRcdHZhciBwaSA9IE1hdGguUEk7XG5cdFx0XHRcdFx0XHRpZihsYWJlbHMubGVuZ3RoID09IDIpe1xuXHRcdFx0XHRcdFx0XHR2YXIgYXJjVG9wID0gZDMuc3ZnLmFyYygpXG5cdFx0XHRcdFx0XHRcdFx0LmlubmVyUmFkaXVzKDEwOSlcblx0XHRcdFx0XHRcdFx0XHQub3V0ZXJSYWRpdXMoMTEwKVxuXHRcdFx0XHRcdFx0XHRcdC5zdGFydEFuZ2xlKC05MCAqIChwaSAvIDE4MCkpIC8vY29udmVydGluZyBmcm9tIGRlZ3MgdG8gcmFkaWFuc1xuXHRcdFx0XHRcdFx0XHRcdC5lbmRBbmdsZSg5MCAqIChwaSAvIDE4MCkpOyAvL2p1c3QgcmFkaWFuc1xuXHRcdFx0XHRcdFx0XHR2YXIgYXJjQm90dG9tID0gZDMuc3ZnLmFyYygpXG5cdFx0XHRcdFx0XHRcdFx0LmlubmVyUmFkaXVzKDEzNClcblx0XHRcdFx0XHRcdFx0XHQub3V0ZXJSYWRpdXMoMTM1KVxuXHRcdFx0XHRcdFx0XHRcdC5zdGFydEFuZ2xlKDkwICogKHBpIC8gMTgwKSkgLy9jb252ZXJ0aW5nIGZyb20gZGVncyB0byByYWRpYW5zXG5cdFx0XHRcdFx0XHRcdFx0LmVuZEFuZ2xlKDI3MCAqIChwaSAvIDE4MCkpOyAvL2p1c3QgcmFkaWFuc1xuXG5cdFx0XHRcdFx0XHRcdG9wdGlvbnMuYXJjVG9wID0gb3B0aW9ucy52aXMuYXBwZW5kKFwicGF0aFwiKVxuXHRcdFx0XHRcdFx0XHRcdC5hdHRyKFwiZFwiLCBhcmNUb3ApXG5cdFx0XHRcdFx0XHRcdFx0LmF0dHIoXCJmaWxsXCIsIFwiI2JlNWYwMFwiKVxuXHRcdFx0XHRcdFx0XHRcdC5hdHRyKFwiaWRcIiwgXCJhcmNUb3BcIilcblx0XHRcdFx0XHRcdFx0XHQuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIisob3B0aW9ucy53aWR0aC8yKStcIixcIisob3B0aW9ucy5oZWlnaHQvMiAtIG9wdGlvbnMuaGVpZ2h0LzEyKStcIilcIik7XG5cdFx0XHRcdFx0XHRcdG9wdGlvbnMuYXJjQm90dG9tID0gb3B0aW9ucy52aXMuYXBwZW5kKFwicGF0aFwiKVxuXHRcdFx0XHRcdFx0XHRcdC5hdHRyKFwiZFwiLCBhcmNCb3R0b20pXG5cdFx0XHRcdFx0XHRcdFx0LmF0dHIoXCJpZFwiLCBcImFyY0JvdHRvbVwiKVxuXHRcdFx0XHRcdFx0XHRcdC5hdHRyKFwiZmlsbFwiLCBcIiMwMDZiYjZcIilcblx0XHRcdFx0XHRcdFx0XHQuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIisob3B0aW9ucy53aWR0aC8yKStcIixcIisob3B0aW9ucy5oZWlnaHQvMikrXCIpXCIpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0ZWxzZXtcblx0XHRcdFx0XHRcdFx0dmFyIGFyYyA9IGQzLnN2Zy5hcmMoKVxuXHRcdFx0XHRcdFx0XHRcdC5pbm5lclJhZGl1cyhvcHRpb25zLndpZHRoLzMgLSAxKVxuXHRcdFx0XHRcdFx0XHRcdC5vdXRlclJhZGl1cyhvcHRpb25zLndpZHRoLzMpXG5cdFx0XHRcdFx0XHRcdFx0LnN0YXJ0QW5nbGUoMCAqIChwaSAvIDE4MCkpIC8vY29udmVydGluZyBmcm9tIGRlZ3MgdG8gcmFkaWFuc1xuXHRcdFx0XHRcdFx0XHRcdC5lbmRBbmdsZSgzNjAgKiAocGkgLyAxODApKTsgLy9qdXN0IHJhZGlhbnNcblxuXG5cdFx0XHRcdFx0XHRcdG9wdGlvbnMuYXJjID0gb3B0aW9ucy52aXMuYXBwZW5kKFwicGF0aFwiKVxuXHRcdFx0XHRcdFx0XHRcdC5hdHRyKFwiZFwiLCBhcmMpXG5cdFx0XHRcdFx0XHRcdFx0LmF0dHIoXCJmaWxsXCIsIGxhYmVsc1swXS5jb2xvcilcblx0XHRcdFx0XHRcdFx0XHQuYXR0cihcImlkXCIsIFwiYXJjVG9wXCIpXG5cdFx0XHRcdFx0XHRcdFx0LmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIrKG9wdGlvbnMud2lkdGgvMikrXCIsXCIrKG9wdGlvbnMuaGVpZ2h0LzIpK1wiKVwiKTtcblxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0aWYob3B0aW9ucy5sYWJlbHMgPT0gdHJ1ZSAmJiBsYWJlbHMubGVuZ3RoID09IDIpe1xuXHRcdFx0XHRcdFx0dmFyIHRleHRMYWJlbHMgPSBvcHRpb25zLnZpcy5zZWxlY3RBbGwoJ3RleHQubGFiZWxzJykuZGF0YShsYWJlbHMpLmVudGVyKCkuYXBwZW5kKFwidGV4dFwiKVxuXHRcdFx0XHRcdFx0XHQuYXR0cignY2xhc3MnLCAnbGFiZWxzJylcblx0XHRcdFx0XHRcdFx0LmF0dHIoJ2ZpbGwnLCBmdW5jdGlvbihkKXtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gZC5jb2xvcjtcblx0XHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRcdC8qXHQuYXR0cigndHJhbnNmb3JtJywgZnVuY3Rpb24oZCl7XG5cdFx0XHRcdFx0XHRcdFx0dmFyIGluZGV4ID0gbGFiZWxzLmluZGV4T2YoZCk7XG5cdFx0XHRcdFx0XHRcdFx0aWYoaW5kZXggPiAwKXtcblx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiAncm90YXRlKDkwLCAxMDAsIDEwMCknO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fSkqL1xuXHRcdFx0XHRcdFx0XHQuYXR0cigneCcsIFwiNTAlXCIpXG5cdFx0XHRcdFx0XHRcdC5zdHlsZSgnZm9udC1zaXplJywgJzEuMmVtJylcblx0XHRcdFx0XHRcdFx0LnN0eWxlKCdjdXJzb3InLCAncG9pbnRlcicpXG5cblx0XHRcdFx0XHRcdFx0LmF0dHIoJ3dpZHRoJywgb3B0aW9ucy53aWR0aClcblx0XHRcdFx0XHRcdFx0LmF0dHIoJ3RleHQtYW5jaG9yJywgJ21pZGRsZScpXG5cdFx0XHRcdFx0XHRcdC5vbignY2xpY2snLCBmdW5jdGlvbihkKXtcblx0XHRcdFx0XHRcdFx0XHRuZ01vZGVsLiRzZXRWaWV3VmFsdWUoZC5kYXRhKTtcblx0XHRcdFx0XHRcdFx0XHRuZ01vZGVsLiRyZW5kZXIoKTtcblx0XHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRcdFx0LmF0dHIoXCJ5XCIsIGZ1bmN0aW9uKGQpe1xuXHRcdFx0XHRcdFx0XHRcdHZhciBpbmRleCA9IGxhYmVscy5pbmRleE9mKGQpO1xuXHRcdFx0XHRcdFx0XHRcdGlmKGluZGV4ID09IDApe1xuXHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIDE1O1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRlbHNle1xuXHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIG9wdGlvbnMuaGVpZ2h0IC0gNjtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0XHRcdC50ZXh0KGZ1bmN0aW9uKGQpe1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBkLm5hbWU7XG5cdFx0XHRcdFx0XHRcdH0pXG5cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0b3B0aW9ucy5jb250YWluZXJzID0gb3B0aW9ucy52aXMuc2VsZWN0QWxsKCdnLm5vZGUnKS5kYXRhKG5vZGVzKS5lbnRlcigpLmFwcGVuZCgnZycpLmF0dHIoJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoJyArIChvcHRpb25zLndpZHRoIC8gMikgKyAnLCcgKyAob3B0aW9ucy5oZWlnaHQgLyAyKSArICcpJykuYXR0cignY2xhc3MnLCAnbm9kZScpO1xuXG5cdFx0XHRcdFx0LypvcHRpb25zLmNpcmNsZXMgPSBvcHRpb25zLmNvbnRhaW5lcnMuc2VsZWN0QWxsKFwiY2lyY2xlXCIpLmRhdGEobm9kZXMsIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZC5pZDtcblx0XHRcdFx0XHR9KTsqL1xuXG5cdFx0XHRcdFx0b3B0aW9ucy5jaXJjbGVzID0gb3B0aW9ucy5jb250YWluZXJzLmFwcGVuZChcImNpcmNsZVwiKS5hdHRyKFwiclwiLCAwKS5hdHRyKFwiZmlsbFwiLCAoZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdHJldHVybiBkLmNvbG9yIHx8IG9wdGlvbnMuZmlsbF9jb2xvcihkLmdyb3VwKTtcblx0XHRcdFx0XHR9KSkuYXR0cihcInN0cm9rZS13aWR0aFwiLCAwKS5hdHRyKFwic3Ryb2tlXCIsIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZDMucmdiKG9wdGlvbnMuZmlsbF9jb2xvcihkLmdyb3VwKSkuZGFya2VyKCk7XG5cdFx0XHRcdFx0fSkuYXR0cihcImlkXCIsIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gXCJidWJibGVfXCIgKyBkLmlkO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdG9wdGlvbnMuaWNvbnMgPSBvcHRpb25zLmNvbnRhaW5lcnMuYXBwZW5kKFwidGV4dFwiKVxuXHRcdFx0XHRcdFx0LmF0dHIoJ2ZvbnQtZmFtaWx5JywgJ0VQSScpXG5cdFx0XHRcdFx0XHQuYXR0cignZm9udC1zaXplJywgZnVuY3Rpb24gKGQpIHtcblxuXHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRcdC5hdHRyKFwidGV4dC1hbmNob3JcIiwgXCJtaWRkbGVcIilcblx0XHRcdFx0XHRcdC5hdHRyKCdmaWxsJywgZnVuY3Rpb24oZCl7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBkLnVuaWNvZGUgPyAnI2ZmZicgOiBkLmNvbG9yO1xuXHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRcdC50ZXh0KGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBkLnVuaWNvZGUgfHwgJzEnXG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRvcHRpb25zLmljb25zLm9uKFwibW91c2VvdmVyXCIsIGZ1bmN0aW9uIChkLCBpKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gc2hvd19kZXRhaWxzKGQsIGksIHRoaXMpO1xuXHRcdFx0XHRcdH0pLm9uKFwibW91c2VvdXRcIiwgZnVuY3Rpb24gKGQsIGkpIHtcblx0XHRcdFx0XHRcdHJldHVybiBoaWRlX2RldGFpbHMoZCwgaSwgdGhpcyk7XG5cdFx0XHRcdFx0fSkub24oXCJjbGlja1wiLCBmdW5jdGlvbiAoZCwgaSkge1xuXG5cdFx0XHRcdFx0XHRuZ01vZGVsLiRzZXRWaWV3VmFsdWUoZC5kYXRhKTtcblx0XHRcdFx0XHRcdG5nTW9kZWwuJHJlbmRlcigpO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdG9wdGlvbnMuY2lyY2xlcy50cmFuc2l0aW9uKCkuZHVyYXRpb24ob3B0aW9ucy5kdXJhdGlvbikuYXR0cihcInJcIiwgZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdHJldHVybiBkLnJhZGl1cztcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRvcHRpb25zLmljb25zLnRyYW5zaXRpb24oKS5kdXJhdGlvbihvcHRpb25zLmR1cmF0aW9uKS5hdHRyKFwiZm9udC1zaXplXCIsIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZC5yYWRpdXMgKiAxLjc1ICsgJ3B4Jztcblx0XHRcdFx0XHR9KS5hdHRyKCd5JywgZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdHJldHVybiBkLnJhZGl1cyAqIC43NSArICdweCc7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH07XG5cdFx0XHRcdHZhciB1cGRhdGVfdmlzID0gZnVuY3Rpb24gKCkge1xuXG5cdFx0XHRcdFx0bm9kZXMuZm9yRWFjaChmdW5jdGlvbiAoZCwgaSkge1xuXHRcdFx0XHRcdFx0b3B0aW9ucy5jaXJjbGVzLnRyYW5zaXRpb24oKS5kdXJhdGlvbihvcHRpb25zLmR1cmF0aW9uKS5kZWxheShpICogb3B0aW9ucy5kdXJhdGlvbilcblx0XHRcdFx0XHRcdFx0LmF0dHIoXCJyXCIsIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRcdFx0ZC5yYWRpdXMgPSBkLnZhbHVlID0gc2NvcGUuY2hhcnRkYXRhW2QudHlwZV0gLyBzY29wZS5zaXplZmFjdG9yO1xuXG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIHNjb3BlLmNoYXJ0ZGF0YVtkLnR5cGVdIC8gc2NvcGUuc2l6ZWZhY3Rvcjtcblx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRvcHRpb25zLmljb25zLnRyYW5zaXRpb24oKS5kdXJhdGlvbihvcHRpb25zLmR1cmF0aW9uKS5kZWxheShpICogb3B0aW9ucy5kdXJhdGlvbilcblx0XHRcdFx0XHRcdFx0LmF0dHIoXCJmb250LXNpemVcIiwgZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gKHNjb3BlLmNoYXJ0ZGF0YVtkLnR5cGVdIC8gc2NvcGUuc2l6ZWZhY3RvcikgKiAxLjc1ICsgJ3B4J1xuXHRcdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0XHQuYXR0cigneScsIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIChzY29wZS5jaGFydGRhdGFbZC50eXBlXSAvIHNjb3BlLnNpemVmYWN0b3IpICogLjc1ICsgJ3B4Jztcblx0XHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fTtcblx0XHRcdFx0dmFyIGNoYXJnZSA9IGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0cmV0dXJuIC1NYXRoLnBvdyhkLnJhZGl1cywgMi4wKSAvIDQ7XG5cdFx0XHRcdH07XG5cdFx0XHRcdHZhciBzdGFydCA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRyZXR1cm4gb3B0aW9ucy5mb3JjZSA9IGQzLmxheW91dC5mb3JjZSgpLm5vZGVzKG5vZGVzKS5zaXplKFtvcHRpb25zLndpZHRoLCBvcHRpb25zLmhlaWdodF0pLmxpbmtzKGxpbmtzKTtcblx0XHRcdFx0fTtcblx0XHRcdFx0dmFyIGRpc3BsYXlfZ3JvdXBfYWxsID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdG9wdGlvbnMuZm9yY2UuZ3Jhdml0eShvcHRpb25zLmxheW91dF9ncmF2aXR5KS5jaGFyZ2UoY2hhcmdlKS5mcmljdGlvbigwLjg1KS5vbihcInRpY2tcIiwgZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0XHRcdG9wdGlvbnMuY29udGFpbmVycy5lYWNoKG1vdmVfdG93YXJkc19jZW50ZXIoZS5hbHBoYSkpLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuICd0cmFuc2xhdGUoJyArIGQueCArICcsJyArIGQueSArICcpJztcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdG9wdGlvbnMuZm9yY2Uuc3RhcnQoKTtcblx0XHRcdFx0fTtcblx0XHRcdFx0dmFyIGRpc3BsYXlfYnlfY2F0ID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdG9wdGlvbnMuZm9yY2UuZ3Jhdml0eShvcHRpb25zLmxheW91dF9ncmF2aXR5KS5jaGFyZ2UoY2hhcmdlKS5mcmljdGlvbigwLjkpLm9uKFwidGlja1wiLCBmdW5jdGlvbiAoZSkge1xuXHRcdFx0XHRcdFx0b3B0aW9ucy5jb250YWluZXJzLmVhY2gobW92ZV90b3dhcmRzX2NhdChlLmFscGhhKSkuYXR0cihcInRyYW5zZm9ybVwiLCBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gJ3RyYW5zbGF0ZSgnICsgZC54ICsgJywnICsgZC55ICsgJyknO1xuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0b3B0aW9ucy5mb3JjZS5zdGFydCgpO1xuXHRcdFx0XHR9O1xuXHRcdFx0XHR2YXIgbW92ZV90b3dhcmRzX2NlbnRlciA9IGZ1bmN0aW9uIChhbHBoYSkge1xuXHRcdFx0XHRcdHJldHVybiAoZnVuY3Rpb24gKF90aGlzKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdFx0ZC54ID0gZC54ICsgKG9wdGlvbnMud2lkdGgvMiAtIGQueCkgKiAob3B0aW9ucy5kYW1wZXIgKyAwLjAyKSAqIGFscGhhICoxLjI1O1xuXHRcdFx0XHRcdFx0XHRkLnkgPSBkLnkgKyAob3B0aW9ucy5oZWlnaHQvMiAtIGQueSkgKiAob3B0aW9ucy5kYW1wZXIgKyAwLjAyKSAqIGFscGhhICogMS4yNTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KSh0aGlzKTtcblx0XHRcdFx0fTtcblx0XHRcdFx0dmFyIG1vdmVfdG93YXJkc190b3AgPSBmdW5jdGlvbiAoYWxwaGEpIHtcblx0XHRcdFx0XHRyZXR1cm4gKGZ1bmN0aW9uIChfdGhpcykge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRcdGQueCA9IGQueCArIChvcHRpb25zLmNlbnRlci54IC0gZC54KSAqIChvcHRpb25zLmRhbXBlciArIDAuMDIpICogYWxwaGEgKiAxLjE7XG5cdFx0XHRcdFx0XHRcdGQueSA9IGQueSArICgyMDAgLSBkLnkpICogKG9wdGlvbnMuZGFtcGVyICsgMC4wMikgKiBhbHBoYSAqIDEuMTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KSh0aGlzKTtcblx0XHRcdFx0fTtcblx0XHRcdFx0dmFyIG1vdmVfdG93YXJkc19jYXQgPSBmdW5jdGlvbiAoYWxwaGEpIHtcblx0XHRcdFx0XHRyZXR1cm4gKGZ1bmN0aW9uIChfdGhpcykge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRcdHZhciB0YXJnZXQ7XG5cdFx0XHRcdFx0XHRcdHRhcmdldCA9IG9wdGlvbnMuY2F0X2NlbnRlcnNbZC5ncm91cF07XG5cdFx0XHRcdFx0XHRcdGQueCA9IGQueCArICh0YXJnZXQueCAtIGQueCkgKiAodGFyZ2V0LmRhbXBlciArIDAuMDIpICogYWxwaGEgKiAxO1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gZC55ID0gZC55ICsgKHRhcmdldC55IC0gZC55KSAqICh0YXJnZXQuZGFtcGVyICsgMC4wMikgKiBhbHBoYSAqIDE7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSkodGhpcyk7XG5cdFx0XHRcdH07XG5cdFx0XHRcdHZhciBzaG93X2RldGFpbHMgPSBmdW5jdGlvbiAoZGF0YSwgaSwgZWxlbWVudCkge1xuXHRcdFx0XHRcdHZhciBjb250ZW50O1xuXHRcdFx0XHRcdGNvbnRlbnQgPSBcIjxzcGFuIGNsYXNzPVxcXCJ0aXRsZVxcXCI+XCIgKyBkYXRhLm5hbWUgKyBcIjwvc3Bhbj48YnIvPlwiO1xuXHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChkYXRhLmRhdGEuY2hpbGRyZW4sIGZ1bmN0aW9uIChpbmZvKSB7XG5cdFx0XHRcdFx0XHRjb250ZW50ICs9IFwiPHNwYW4gY2xhc3M9XFxcIm5hbWVcXFwiIHN0eWxlPVxcXCJjb2xvcjpcIiArIChpbmZvLmNvbG9yIHx8IGRhdGEuY29sb3IpICsgXCJcXFwiPiBcIiArIChpbmZvLnRpdGxlKSArIFwiPC9zcGFuPjxici8+XCI7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0JGNvbXBpbGUob3B0aW9ucy50b29sdGlwLnNob3dUb29sdGlwKGNvbnRlbnQsIGRhdGEsIGQzLmV2ZW50LCBlbGVtKS5jb250ZW50cygpKShzY29wZSk7XG5cdFx0XHRcdH07XG5cblx0XHRcdFx0dmFyIGhpZGVfZGV0YWlscyA9IGZ1bmN0aW9uIChkYXRhLCBpLCBlbGVtZW50KSB7XG5cdFx0XHRcdFx0cmV0dXJuIG9wdGlvbnMudG9vbHRpcC5oaWRlVG9vbHRpcCgpO1xuXHRcdFx0XHR9O1xuXG5cdFx0XHRcdHNjb3BlLiR3YXRjaCgnY2hhcnRkYXRhJywgZnVuY3Rpb24gKGRhdGEsIG9sZERhdGEpIHtcblx0XHRcdFx0XHRvcHRpb25zLnRvb2x0aXAuaGlkZVRvb2x0aXAoKTtcblxuXHRcdFx0XHRcdGlmIChvcHRpb25zLmNpcmNsZXMgPT0gbnVsbCkge1xuXHRcdFx0XHRcdFx0Y3JlYXRlX25vZGVzKCk7XG5cdFx0XHRcdFx0XHRjcmVhdGVfdmlzKCk7XG5cdFx0XHRcdFx0XHRzdGFydCgpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHR1cGRhdGVfdmlzKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmKGxhYmVscy5sZW5ndGggPT0gMSB8fCBvcHRpb25zLmxhYmVscyAhPSB0cnVlKXtcblx0XHRcdFx0XHRcdFx0ZGlzcGxheV9ncm91cF9hbGwoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZWxzZXtcblx0XHRcdFx0XHRcdFx0ZGlzcGxheV9ieV9jYXQoKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0fSk7XG5cdFx0XHRcdHNjb3BlLiR3YXRjaCgnaW5kZXhlcicsIGZ1bmN0aW9uIChuLCBvKSB7XG5cdFx0XHRcdFx0aWYobiA9PT0gbyl7XG5cdFx0XHRcdFx0XHRyZXR1cm5cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYodHlwZW9mIG5bMF0uY2hpbGRyZW4gIT0gXCJ1bmRlZmluZWRcIil7XG5cdFx0XHRcdFx0XHRvcHRpb25zLnRvb2x0aXAuaGlkZVRvb2x0aXAoKTtcblx0XHRcdFx0XHRcdGNsZWFyX25vZGVzKCk7XG5cdFx0XHRcdFx0XHRjcmVhdGVfbm9kZXMoKTtcblx0XHRcdFx0XHRcdGNyZWF0ZV92aXMoKTtcblx0XHRcdFx0XHRcdHN0YXJ0KCk7XG5cblx0XHRcdFx0XHRcdGlmKGxhYmVscy5sZW5ndGggPT0gMSB8fCBvcHRpb25zLmxhYmVscyAhPSB0cnVlKXtcblx0XHRcdFx0XHRcdFx0XHRkaXNwbGF5X2dyb3VwX2FsbCgpO1xuXHRcdFx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKCdhbGwnKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGVsc2V7XG5cdFx0XHRcdFx0XHRcdFx0ZGlzcGxheV9ieV9jYXQoKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRzY29wZS4kd2F0Y2goJ2RpcmVjdGlvbicsIGZ1bmN0aW9uIChvbGRELCBuZXdEKSB7XG5cdFx0XHRcdFx0aWYgKG9sZEQgPT09IG5ld0QpIHtcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKG9sZEQgPT0gXCJhbGxcIikge1xuXHRcdFx0XHRcdFx0ZGlzcGxheV9ncm91cF9hbGwoKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0ZGlzcGxheV9ieV9jYXQoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pXG5cdFx0XHR9XG5cdFx0fTtcblx0fSk7XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCAnYXBwLmNvbnRyb2xsZXJzJyApLmNvbnRyb2xsZXIoICdDaXJjbGVncmFwaEN0cmwnLCBmdW5jdGlvbigpe1xuXHRcdC8vXG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZGlyZWN0aXZlcycpLmRpcmVjdGl2ZSgnY2lyY2xlZ3JhcGgnLCBmdW5jdGlvbigkdGltZW91dCkge1xuXHRcdHZhciBkZWZhdWx0cyA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0d2lkdGg6IDgwLFxuXHRcdFx0XHRoZWlnaHQ6IDgwLFxuXHRcdFx0XHRjb2xvcjogJyMwMGNjYWEnLFxuXHRcdFx0XHRzaXplOiAxNzgsXG5cdFx0XHRcdGZpZWxkOiAncmFuaydcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlc3RyaWN0OiAnRScsXG5cdFx0XHRjb250cm9sbGVyOiAnQ2lyY2xlZ3JhcGhDdHJsJyxcblx0XHRcdHNjb3BlOiB7XG5cdFx0XHRcdG9wdGlvbnM6ICc9J1xuXHRcdFx0fSxcblx0XHRcdHJlcXVpcmU6ICduZ01vZGVsJyxcblx0XHRcdGxpbms6IGZ1bmN0aW9uKCRzY29wZSwgZWxlbWVudCwgJGF0dHJzLCBuZ01vZGVsKSB7XG5cdFx0XHRcdC8vRmV0Y2hpbmcgT3B0aW9uc1xuXG5cdFx0XHQgJHNjb3BlLm9wdGlvbnMgPSBhbmd1bGFyLmV4dGVuZChkZWZhdWx0cygpLCAkc2NvcGUub3B0aW9ucyk7XG5cblx0XHRcdFx0Ly9DcmVhdGluZyB0aGUgU2NhbGVcblx0XHRcdFx0dmFyIHJvdGF0ZSA9IGQzLnNjYWxlLmxpbmVhcigpXG5cdFx0XHRcdFx0LmRvbWFpbihbMSwgJHNjb3BlLm9wdGlvbnMuc2l6ZV0pXG5cdFx0XHRcdFx0LnJhbmdlKFsxLCAwXSlcblx0XHRcdFx0XHQuY2xhbXAodHJ1ZSk7XG5cblx0XHRcdFx0Ly9DcmVhdGluZyBFbGVtZW50c1xuXHRcdFx0XHR2YXIgc3ZnID0gZDMuc2VsZWN0KGVsZW1lbnRbMF0pLmFwcGVuZCgnc3ZnJylcblx0XHRcdFx0XHQuYXR0cignd2lkdGgnLCAkc2NvcGUub3B0aW9ucy53aWR0aClcblx0XHRcdFx0XHQuYXR0cignaGVpZ2h0JywgJHNjb3BlLm9wdGlvbnMuaGVpZ2h0KVxuXHRcdFx0XHRcdC5hcHBlbmQoJ2cnKTtcblx0XHRcdFx0dmFyIGNvbnRhaW5lciA9IHN2Zy5hcHBlbmQoJ2cnKVxuXHRcdFx0XHRcdC5hdHRyKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKCcgKyAkc2NvcGUub3B0aW9ucy53aWR0aCAvIDIgKyAnLCcgKyAkc2NvcGUub3B0aW9ucy5oZWlnaHQgLyAyICsgJyknKTtcblx0XHRcdFx0dmFyIGNpcmNsZUJhY2sgPSBjb250YWluZXIuYXBwZW5kKCdjaXJjbGUnKVxuXHRcdFx0XHRcdC5hdHRyKCdyJywgJHNjb3BlLm9wdGlvbnMud2lkdGggLyAyIC0gMilcblx0XHRcdFx0XHQuYXR0cignc3Ryb2tlLXdpZHRoJywgMilcblx0XHRcdFx0XHQuYXR0cignc3Ryb2tlJywgJHNjb3BlLm9wdGlvbnMuY29sb3IpXG5cdFx0XHRcdFx0LnN0eWxlKCdvcGFjaXR5JywgJzAuNicpXG5cdFx0XHRcdFx0LmF0dHIoJ2ZpbGwnLCAnbm9uZScpO1xuXHRcdFx0XHR2YXIgYXJjID0gZDMuc3ZnLmFyYygpXG5cdFx0XHRcdFx0LnN0YXJ0QW5nbGUoMClcblx0XHRcdFx0XHQuaW5uZXJSYWRpdXMoZnVuY3Rpb24oZCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuICRzY29wZS5vcHRpb25zLndpZHRoIC8gMiAtIDQ7XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQub3V0ZXJSYWRpdXMoZnVuY3Rpb24oZCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuICRzY29wZS5vcHRpb25zLndpZHRoIC8gMjtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0dmFyIGNpcmNsZUdyYXBoID0gY29udGFpbmVyLmFwcGVuZCgncGF0aCcpXG5cdFx0XHRcdFx0LmRhdHVtKHtcblx0XHRcdFx0XHRcdGVuZEFuZ2xlOiAyICogTWF0aC5QSSAqIDBcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC5zdHlsZShcImZpbGxcIiwgJHNjb3BlLm9wdGlvbnMuY29sb3IpXG5cdFx0XHRcdFx0LmF0dHIoJ2QnLCBhcmMpO1xuXHRcdFx0XHR2YXIgdGV4dCA9IGNvbnRhaW5lci5zZWxlY3RBbGwoJ3RleHQnKVxuXHRcdFx0XHRcdC5kYXRhKFswXSlcblx0XHRcdFx0XHQuZW50ZXIoKVxuXHRcdFx0XHRcdC5hcHBlbmQoJ3RleHQnKVxuXHRcdFx0XHRcdC50ZXh0KGZ1bmN0aW9uKGQpIHtcblx0XHRcdFx0XHRcdHJldHVybiAnTsKwJyArIGQ7XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRcdC5zdHlsZShcImZpbGxcIiwgJHNjb3BlLm9wdGlvbnMuY29sb3IpXG5cdFx0XHRcdFx0LnN0eWxlKCdmb250LXdlaWdodCcsICdib2xkJylcblx0XHRcdFx0XHQuYXR0cigndGV4dC1hbmNob3InLCAnbWlkZGxlJylcblx0XHRcdFx0XHQuYXR0cigneScsICcwLjM1ZW0nKTtcblxuXHRcdFx0XHQvL1RyYW5zaXRpb24gaWYgc2VsZWN0aW9uIGhhcyBjaGFuZ2VkXG5cdFx0XHRcdGZ1bmN0aW9uIGFuaW1hdGVJdChyYWRpdXMpIHtcblx0XHRcdFx0XHRjaXJjbGVHcmFwaC50cmFuc2l0aW9uKClcblx0XHRcdFx0XHRcdC5kdXJhdGlvbig3NTApXG5cdFx0XHRcdFx0XHQuY2FsbChhcmNUd2Vlbiwgcm90YXRlKHJhZGl1cykgKiAyICogTWF0aC5QSSk7XG5cdFx0XHRcdFx0dGV4dC50cmFuc2l0aW9uKCkuZHVyYXRpb24oNzUwKS50d2VlbigndGV4dCcsIGZ1bmN0aW9uKGQpIHtcblx0XHRcdFx0XHRcdHZhciBkYXRhID0gdGhpcy50ZXh0Q29udGVudC5zcGxpdCgnTsKwJyk7XG5cdFx0XHRcdFx0XHR2YXIgaSA9IGQzLmludGVycG9sYXRlKHBhcnNlSW50KGRhdGFbMV0pLCByYWRpdXMpO1xuXHRcdFx0XHRcdFx0cmV0dXJuIGZ1bmN0aW9uKHQpIHtcblx0XHRcdFx0XHRcdFx0dGhpcy50ZXh0Q29udGVudCA9ICAnTsKwJyArIChNYXRoLnJvdW5kKGkodCkgKiAxKSAvIDEpO1xuXHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly9Ud2VlbiBhbmltYXRpb24gZm9yIHRoZSBBcmNcblx0XHRcdFx0ZnVuY3Rpb24gYXJjVHdlZW4odHJhbnNpdGlvbiwgbmV3QW5nbGUpIHtcblxuXHRcdFx0XHRcdHRyYW5zaXRpb24uYXR0clR3ZWVuKFwiZFwiLCBmdW5jdGlvbihkKSB7XG5cdFx0XHRcdFx0XHR2YXIgaW50ZXJwb2xhdGUgPSBkMy5pbnRlcnBvbGF0ZShkLmVuZEFuZ2xlLCBuZXdBbmdsZSk7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZnVuY3Rpb24odCkge1xuXHRcdFx0XHRcdFx0XHRkLmVuZEFuZ2xlID0gaW50ZXJwb2xhdGUodCk7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBhcmMoZCk7XG5cdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cdFx0XHRcdCRzY29wZS4kd2F0Y2goJ29wdGlvbnMnLGZ1bmN0aW9uKG4sIG8pe1xuXHRcdFx0XHRcdFx0aWYobiA9PT0gbyl7XG5cdFx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGNpcmNsZUJhY2suc3R5bGUoJ3N0cm9rZScsIG4uY29sb3IpO1xuXHRcdFx0XHRcdFx0Y2lyY2xlR3JhcGguc3R5bGUoJ2ZpbGwnLCBuLmNvbG9yKTtcblx0XHRcdFx0XHRcdHRleHQuc3R5bGUoJ2ZpbGwnLCBuLmNvbG9yKTtcblx0XHRcdFx0XHRcdCR0aW1lb3V0KGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0XHRcdGFuaW1hdGVJdChuZ01vZGVsLiRtb2RlbFZhbHVlW24uZmllbGRdKVxuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHQvL1dhdGNoaW5nIGlmIHNlbGVjdGlvbiBoYXMgY2hhbmdlZCBmcm9tIGFub3RoZXIgVUkgZWxlbWVudFxuXHRcdFx0XHQkc2NvcGUuJHdhdGNoKFxuXHRcdFx0XHRcdGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIG5nTW9kZWwuJG1vZGVsVmFsdWU7XG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRmdW5jdGlvbihuLCBvKSB7XG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRpZiAoIW4pe1xuXHRcdFx0XHRcdFx0XHRuID0ge307XG5cdFx0XHRcdFx0XHRcdG5bJHNjb3BlLm9wdGlvbnMuZmllbGRdID0gJHNjb3BlLm9wdGlvbnMuc2l6ZTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdCR0aW1lb3V0KGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0XHRcdGFuaW1hdGVJdChuWyRzY29wZS5vcHRpb25zLmZpZWxkXSlcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH07XG5cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5kaXJlY3RpdmVzJykuZGlyZWN0aXZlKCAnaGlzdG9yeScsIGZ1bmN0aW9uKCkge1xuXHRcdHZhciBkZWZhdWx0cyA9IGZ1bmN0aW9uKCl7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRmaWVsZDogJ3Njb3JlJyxcblx0XHRcdFx0Y29sb3I6ICcnXG5cdFx0XHR9XG5cdFx0fTtcblx0XHRyZXR1cm4ge1xuXHRcdFx0cmVzdHJpY3Q6ICdFJyxcblx0XHRcdHRlbXBsYXRlVXJsOiAndmlld3MvZGlyZWN0aXZlcy9oaXN0b3J5L2hpc3RvcnkuaHRtbCcsXG5cdFx0XHRjb250cm9sbGVyOiAnSGlzdG9yeUN0cmwnLFxuXHRcdFx0c2NvcGU6e1xuXHRcdFx0XHRvcHRpb25zOic9Jyxcblx0XHRcdFx0Y2hhcnRkYXRhOiAnPSdcblx0XHRcdH0sXG5cdFx0XHRsaW5rOiBmdW5jdGlvbiggJHNjb3BlLCBlbGVtZW50LCAkYXR0cnMsIG5nTW9kZWwpe1xuXHRcdFx0XHRcdHZhciBvcHRpb25zID0gYW5ndWxhci5leHRlbmQoZGVmYXVsdHMoKSwgJHNjb3BlLm9wdGlvbnMpO1xuXHRcdFx0fVxuXHRcdH07XG5cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignSGlzdG9yeUN0cmwnLCBmdW5jdGlvbiAoJHNjb3BlKSB7XG5cdFx0JHNjb3BlLnNldERhdGEgPSBzZXREYXRhO1xuXHRcdGFjdGl2YXRlKCk7XG5cdFxuXHRcdGZ1bmN0aW9uIGFjdGl2YXRlKCl7XG5cdFx0XHQkc2NvcGUuc2V0RGF0YSgpO1xuXHRcdFx0JHNjb3BlLiR3YXRjaCgnb3B0aW9ucycsIGZ1bmN0aW9uKG4sbyl7XG5cdFx0XHRcdGlmKG4gPT09IDApe1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXHRcdFx0XHQkc2NvcGUuc2V0RGF0YSgpO1xuXHRcdFx0fSlcblx0XHR9XG5cdFx0ZnVuY3Rpb24gc2V0RGF0YSgpe1xuXHRcdFx0JHNjb3BlLmRpc3BsYXkgPSB7XG5cdFx0XHRcdHNlbGVjdGVkQ2F0OiAnJyxcblx0XHRcdFx0cmFuazogW3tcblx0XHRcdFx0XHRmaWVsZHM6IHtcblx0XHRcdFx0XHRcdHg6ICd5ZWFyJyxcblx0XHRcdFx0XHRcdHk6ICdyYW5rJ1xuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0dGl0bGU6ICdSYW5rJyxcblx0XHRcdFx0XHRjb2xvcjogJyM1MmI2OTUnXG5cdFx0XHRcdH1dLFxuXHRcdFx0XHRzY29yZTogW3tcblx0XHRcdFx0XHRmaWVsZHM6IHtcblx0XHRcdFx0XHRcdHg6ICd5ZWFyJyxcblx0XHRcdFx0XHRcdHk6ICRzY29wZS5vcHRpb25zLmZpZWxkXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHR0aXRsZTogJ1Njb3JlJyxcblx0XHRcdFx0XHRjb2xvcjogJHNjb3BlLm9wdGlvbnMuY29sb3Jcblx0XHRcdFx0fV1cblx0XHRcdH07XG5cdFx0fVxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZGlyZWN0aXZlcycpLmRpcmVjdGl2ZSgnbWVkaWFuJywgZnVuY3Rpb24gKCR0aW1lb3V0KSB7XG5cdFx0dmFyIGRlZmF1bHRzID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0aWQ6ICdncmFkaWVudCcsXG5cdFx0XHRcdHdpZHRoOiAzMDAsXG5cdFx0XHRcdGhlaWdodDogNDAsXG5cdFx0XHRcdGluZm86IHRydWUsXG5cdFx0XHRcdGZpZWxkOiAnc2NvcmUnLFxuXHRcdFx0XHRoYW5kbGluZzogdHJ1ZSxcblx0XHRcdFx0bWFyZ2luOiB7XG5cdFx0XHRcdFx0bGVmdDogMjAsXG5cdFx0XHRcdFx0cmlnaHQ6IDIwLFxuXHRcdFx0XHRcdHRvcDogMTAsXG5cdFx0XHRcdFx0Ym90dG9tOiAxMFxuXHRcdFx0XHR9LFxuXHRcdFx0XHRjb2xvcnM6IFsge1xuXHRcdFx0XHRcdHBvc2l0aW9uOiAwLFxuXHRcdFx0XHRcdGNvbG9yOiAncmdiYSgxMDIsMTAyLDEwMiwxKScsXG5cdFx0XHRcdFx0b3BhY2l0eTogMVxuXHRcdFx0XHR9LCB7XG5cdFx0XHRcdFx0cG9zaXRpb246IDUzLFxuXHRcdFx0XHRcdGNvbG9yOiAncmdiYSgxMjgsIDI0MywgMTk4LDEpJyxcblx0XHRcdFx0XHRvcGFjaXR5OiAxXG5cdFx0XHRcdH0se1xuXHRcdFx0XHRcdHBvc2l0aW9uOiAxMDAsXG5cdFx0XHRcdFx0Y29sb3I6ICdyZ2JhKDI1NSwyNTUsMjU1LDEpJyxcblx0XHRcdFx0XHRvcGFjaXR5OiAwXG5cdFx0XHRcdH1dXG5cdFx0XHR9O1xuXHRcdH1cblx0XHRyZXR1cm4ge1xuXHRcdFx0cmVzdHJpY3Q6ICdFJyxcblx0XHRcdHNjb3BlOiB7XG5cdFx0XHRcdGRhdGE6ICc9Jyxcblx0XHRcdFx0b3B0aW9uczogJz0nXG5cdFx0XHR9LFxuXHRcdFx0cmVxdWlyZTogJ25nTW9kZWwnLFxuXHRcdFx0bGluazogZnVuY3Rpb24gKCRzY29wZSwgZWxlbWVudCwgJGF0dHJzLCBuZ01vZGVsKSB7XG5cblx0XHRcdFx0dmFyIG9wdGlvbnMgPSBhbmd1bGFyLmV4dGVuZChkZWZhdWx0cygpLCAkYXR0cnMpO1xuXHRcdFx0XHRvcHRpb25zID0gYW5ndWxhci5leHRlbmQob3B0aW9ucywgJHNjb3BlLm9wdGlvbnMpO1xuXHRcdFx0XHRvcHRpb25zLnVuaXF1ZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuXHRcdFx0XHRpZihvcHRpb25zLmNvbG9yKXtcblx0XHRcdFx0XHRvcHRpb25zLmNvbG9yc1sxXS5jb2xvciA9IG9wdGlvbnMuY29sb3I7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxlbWVudC5jc3MoJ2hlaWdodCcsIG9wdGlvbnMuaGVpZ2h0ICsgJ3B4JykuY3NzKCdib3JkZXItcmFkaXVzJywgb3B0aW9ucy5oZWlnaHQgLyAyICsgJ3B4Jyk7XG5cdFx0XHRcdHZhciB4ID0gZDMuc2NhbGUubGluZWFyKClcblx0XHRcdFx0XHQuZG9tYWluKFswLCAxMDBdKVxuXHRcdFx0XHRcdC5yYW5nZShbb3B0aW9ucy5tYXJnaW4ubGVmdCwgb3B0aW9ucy53aWR0aCAtIG9wdGlvbnMubWFyZ2luLmxlZnRdKVxuXHRcdFx0XHRcdC5jbGFtcCh0cnVlKTtcblxuXHRcdFx0XHR2YXIgYnJ1c2ggPSBkMy5zdmcuYnJ1c2goKVxuXHRcdFx0XHRcdC54KHgpXG5cdFx0XHRcdFx0LmV4dGVudChbMCwgMF0pXG5cdFx0XHRcdFx0Lm9uKFwiYnJ1c2hcIiwgYnJ1c2gpXG5cdFx0XHRcdFx0Lm9uKFwiYnJ1c2hlbmRcIiwgYnJ1c2hlZCk7XG5cblx0XHRcdFx0dmFyIHN2ZyA9IGQzLnNlbGVjdChlbGVtZW50WzBdKS5hcHBlbmQoXCJzdmdcIilcblx0XHRcdFx0XHQuYXR0cihcIndpZHRoXCIsIG9wdGlvbnMud2lkdGgpXG5cdFx0XHRcdFx0LmF0dHIoXCJoZWlnaHRcIiwgb3B0aW9ucy5oZWlnaHQpXG5cdFx0XHRcdFx0LmFwcGVuZChcImdcIik7XG5cdFx0XHRcdC8vLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoMCxcIiArIG9wdGlvbnMubWFyZ2luLnRvcCAvIDIgKyBcIilcIik7XG5cdFx0XHRcdHZhciBncmFkaWVudCA9IHN2Zy5hcHBlbmQoJ3N2ZzpkZWZzJylcblx0XHRcdFx0XHQuYXBwZW5kKFwic3ZnOmxpbmVhckdyYWRpZW50XCIpXG5cdFx0XHRcdFx0LmF0dHIoJ2lkJywgb3B0aW9ucy5maWVsZCtvcHRpb25zLnVuaXF1ZSlcblx0XHRcdFx0XHQuYXR0cigneDEnLCAnMCUnKVxuXHRcdFx0XHRcdC5hdHRyKCd5MScsICcwJScpXG5cdFx0XHRcdFx0LmF0dHIoJ3gyJywgJzEwMCUnKVxuXHRcdFx0XHRcdC5hdHRyKCd5MicsICcwJScpXG5cdFx0XHRcdFx0LmF0dHIoJ3NwcmVhZE1ldGhvZCcsICdwYWQnKVxuXHRcdFx0XHRhbmd1bGFyLmZvckVhY2gob3B0aW9ucy5jb2xvcnMsIGZ1bmN0aW9uIChjb2xvcikge1xuXHRcdFx0XHRcdGdyYWRpZW50LmFwcGVuZCgnc3ZnOnN0b3AnKVxuXHRcdFx0XHRcdFx0LmF0dHIoJ29mZnNldCcsIGNvbG9yLnBvc2l0aW9uICsgJyUnKVxuXHRcdFx0XHRcdFx0LmF0dHIoJ3N0b3AtY29sb3InLCBjb2xvci5jb2xvcilcblx0XHRcdFx0XHRcdC5hdHRyKCdzdG9wLW9wYWNpdHknLCBjb2xvci5vcGFjaXR5KTtcblx0XHRcdFx0fSk7XG5cdFx0XHRcdHZhciByZWN0ID0gc3ZnLmFwcGVuZCgnc3ZnOnJlY3QnKVxuXHRcdFx0XHRcdC5hdHRyKCd3aWR0aCcsIG9wdGlvbnMud2lkdGgpXG5cdFx0XHRcdFx0LmF0dHIoJ2hlaWdodCcsIG9wdGlvbnMuaGVpZ2h0KVxuXHRcdFx0XHRcdC5zdHlsZSgnZmlsbCcsICd1cmwoIycgKyAob3B0aW9ucy5maWVsZCtvcHRpb25zLnVuaXF1ZSkrICcpJyk7XG5cdFx0XHRcdHZhciBsZWdlbmQgPSBzdmcuYXBwZW5kKCdnJykuYXR0cigndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgnICsgb3B0aW9ucy5oZWlnaHQgLyAyICsgJywgJyArIG9wdGlvbnMuaGVpZ2h0IC8gMiArICcpJylcblx0XHRcdFx0XHQuYXR0cignY2xhc3MnLCAnc3RhcnRMYWJlbCcpXG5cblx0XHRcdFx0aWYgKG9wdGlvbnMuaW5mbyA9PT0gdHJ1ZSkge1xuXHRcdFx0XHRcdGxlZ2VuZC5hcHBlbmQoJ2NpcmNsZScpXG5cdFx0XHRcdFx0XHQuYXR0cigncicsIG9wdGlvbnMuaGVpZ2h0IC8gMik7XG5cdFx0XHRcdFx0bGVnZW5kLmFwcGVuZCgndGV4dCcpXG5cdFx0XHRcdFx0XHQudGV4dCgwKVxuXHRcdFx0XHRcdFx0LnN0eWxlKCdmb250LXNpemUnLCBvcHRpb25zLmhlaWdodC8yLjUpXG5cdFx0XHRcdFx0XHQuYXR0cigndGV4dC1hbmNob3InLCAnbWlkZGxlJylcblx0XHRcdFx0XHRcdC5hdHRyKCd5JywgJy4zNWVtJylcblx0XHRcdFx0XHR2YXIgbGVnZW5kMiA9IHN2Zy5hcHBlbmQoJ2cnKS5hdHRyKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKCcgKyAob3B0aW9ucy53aWR0aCAtIChvcHRpb25zLmhlaWdodCAvIDIpKSArICcsICcgKyBvcHRpb25zLmhlaWdodCAvIDIgKyAnKScpXG5cdFx0XHRcdFx0XHQuYXR0cignY2xhc3MnLCAnZW5kTGFiZWwnKVxuXHRcdFx0XHRcdGxlZ2VuZDIuYXBwZW5kKCdjaXJjbGUnKVxuXHRcdFx0XHRcdFx0LmF0dHIoJ3InLCBvcHRpb25zLmhlaWdodCAvIDIpXG5cdFx0XHRcdFx0bGVnZW5kMi5hcHBlbmQoJ3RleHQnKVxuXHRcdFx0XHRcdFx0LnRleHQoMTAwKVxuXHRcdFx0XHRcdFx0LnN0eWxlKCdmb250LXNpemUnLCBvcHRpb25zLmhlaWdodC8yLjUpXG5cdFx0XHRcdFx0XHQuYXR0cigndGV4dC1hbmNob3InLCAnbWlkZGxlJylcblx0XHRcdFx0XHRcdC5hdHRyKCd5JywgJy4zNWVtJylcblx0XHRcdFx0fVxuXHRcdFx0XHR2YXIgc2xpZGVyID0gc3ZnLmFwcGVuZChcImdcIilcblx0XHRcdFx0XHQuYXR0cihcImNsYXNzXCIsIFwic2xpZGVyXCIpO1xuXHRcdFx0XHRpZihvcHRpb25zLmhhbmRsaW5nID09IHRydWUpe1xuXHRcdFx0XHRcdHNsaWRlci5jYWxsKGJydXNoKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHNsaWRlci5zZWxlY3QoXCIuYmFja2dyb3VuZFwiKVxuXHRcdFx0XHRcdC5hdHRyKFwiaGVpZ2h0XCIsIG9wdGlvbnMuaGVpZ2h0KTtcblxuXHRcdFx0XHRpZiAob3B0aW9ucy5pbmZvID09PSB0cnVlKSB7XG5cdFx0XHRcdHNsaWRlci5hcHBlbmQoJ2xpbmUnKVxuXHRcdFx0XHRcdC5hdHRyKCd4MScsIG9wdGlvbnMud2lkdGggLyAyKVxuXHRcdFx0XHRcdC5hdHRyKCd5MScsIDApXG5cdFx0XHRcdFx0LmF0dHIoJ3gyJywgb3B0aW9ucy53aWR0aCAvIDIpXG5cdFx0XHRcdFx0LmF0dHIoJ3kyJywgb3B0aW9ucy5oZWlnaHQpXG5cdFx0XHRcdFx0LmF0dHIoJ3N0cm9rZS1kYXNoYXJyYXknLCAnMywzJylcblx0XHRcdFx0XHQuYXR0cignc3Ryb2tlLXdpZHRoJywgMSlcblx0XHRcdFx0XHQuYXR0cignc3Ryb2tlJywgJ3JnYmEoMCwwLDAsODcpJyk7XG5cdFx0XHRcdH1cblx0XHRcdFx0dmFyIGhhbmRsZUNvbnQgPSBzbGlkZXIuYXBwZW5kKCdnJylcblx0XHRcdFx0XHQuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZSgwLFwiICsgb3B0aW9ucy5oZWlnaHQgLyAyICsgXCIpXCIpO1xuXHRcdFx0XHR2YXIgaGFuZGxlID0gaGFuZGxlQ29udC5hcHBlbmQoXCJjaXJjbGVcIilcblx0XHRcdFx0XHQuYXR0cihcImNsYXNzXCIsIFwiaGFuZGxlXCIpXG5cdFx0XHRcdFx0LmF0dHIoXCJyXCIsIG9wdGlvbnMuaGVpZ2h0IC8gMik7XG5cdFx0XHRcdFx0aWYob3B0aW9ucy5jb2xvcil7XG5cdFx0XHRcdFx0XHRoYW5kbGUuc3R5bGUoJ2ZpbGwnLCBvcHRpb25zLmNvbG9yKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdHZhciBoYW5kbGVMYWJlbCA9IGhhbmRsZUNvbnQuYXBwZW5kKCd0ZXh0Jylcblx0XHRcdFx0XHQudGV4dCgwKVxuXHRcdFx0XHRcdC5zdHlsZSgnZm9udC1zaXplJywgb3B0aW9ucy5oZWlnaHQvMi41KVxuXHRcdFx0XHRcdC5hdHRyKFwidGV4dC1hbmNob3JcIiwgXCJtaWRkbGVcIikuYXR0cigneScsICcwLjM1ZW0nKTtcblxuXHRcdFx0XHQvL3NsaWRlclxuXHRcdFx0XHQvLy5jYWxsKGJydXNoLmV4dGVudChbMCwgMF0pKVxuXHRcdFx0XHQvLy5jYWxsKGJydXNoLmV2ZW50KTtcblxuXHRcdFx0XHRmdW5jdGlvbiBicnVzaCgpIHtcblx0XHRcdFx0XHR2YXIgdmFsdWUgPSBicnVzaC5leHRlbnQoKVswXTtcblxuXHRcdFx0XHRcdGlmIChkMy5ldmVudC5zb3VyY2VFdmVudCkgeyAvLyBub3QgYSBwcm9ncmFtbWF0aWMgZXZlbnRcblx0XHRcdFx0XHRcdHZhbHVlID0geC5pbnZlcnQoZDMubW91c2UodGhpcylbMF0pO1xuXHRcdFx0XHRcdFx0YnJ1c2guZXh0ZW50KFt2YWx1ZSwgdmFsdWVdKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aGFuZGxlTGFiZWwudGV4dChwYXJzZUludCh2YWx1ZSkpO1xuXHRcdFx0XHRcdGhhbmRsZUNvbnQuYXR0cihcInRyYW5zZm9ybVwiLCAndHJhbnNsYXRlKCcgKyB4KHZhbHVlKSArICcsJyArIG9wdGlvbnMuaGVpZ2h0IC8gMiArICcpJyk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRmdW5jdGlvbiBicnVzaGVkKCkge1xuXHRcdFx0XHRcdHZhciB2YWx1ZSA9IGJydXNoLmV4dGVudCgpWzBdLFxuXHRcdFx0XHRcdFx0Y291bnQgPSAwLFxuXHRcdFx0XHRcdFx0Zm91bmQgPSBmYWxzZTtcblx0XHRcdFx0XHR2YXIgZmluYWwgPSBcIlwiO1xuXHRcdFx0XHRcdGRvIHtcblxuXHRcdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKCRzY29wZS5kYXRhLCBmdW5jdGlvbiAobmF0LCBrZXkpIHtcblx0XHRcdFx0XHRcdFx0aWYgKHBhcnNlSW50KG5hdFtvcHRpb25zLmZpZWxkXSkgPT0gcGFyc2VJbnQodmFsdWUpKSB7XG5cdFx0XHRcdFx0XHRcdFx0ZmluYWwgPSBuYXQ7XG5cdFx0XHRcdFx0XHRcdFx0Zm91bmQgPSB0cnVlO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdGNvdW50Kys7XG5cdFx0XHRcdFx0XHR2YWx1ZSA9IHZhbHVlID4gNTAgPyB2YWx1ZSAtIDEgOiB2YWx1ZSArIDE7XG5cdFx0XHRcdFx0fSB3aGlsZSAoIWZvdW5kICYmIGNvdW50IDwgMTAwKTtcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhmaW5hbCk7XG5cdFx0XHRcdFx0bmdNb2RlbC4kc2V0Vmlld1ZhbHVlKGZpbmFsKTtcblx0XHRcdFx0XHRuZ01vZGVsLiRyZW5kZXIoKTtcblx0XHRcdFx0fVxuXHRcdFx0XHQkc2NvcGUuJHdhdGNoKCdvcHRpb25zJywgZnVuY3Rpb24obixvKXtcblx0XHRcdFx0XHRpZihuID09PSBvKXtcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0b3B0aW9ucy5jb2xvcnNbMV0uY29sb3IgPSBuLmNvbG9yO1xuXHRcdFx0XHRcdGdyYWRpZW50ID0gc3ZnLmFwcGVuZCgnc3ZnOmRlZnMnKVxuXHRcdFx0XHRcdFx0LmFwcGVuZChcInN2ZzpsaW5lYXJHcmFkaWVudFwiKVxuXHRcdFx0XHRcdFx0LmF0dHIoJ2lkJywgb3B0aW9ucy5maWVsZCtcIl9cIituLmNvbG9yKVxuXHRcdFx0XHRcdFx0LmF0dHIoJ3gxJywgJzAlJylcblx0XHRcdFx0XHRcdC5hdHRyKCd5MScsICcwJScpXG5cdFx0XHRcdFx0XHQuYXR0cigneDInLCAnMTAwJScpXG5cdFx0XHRcdFx0XHQuYXR0cigneTInLCAnMCUnKVxuXHRcdFx0XHRcdFx0LmF0dHIoJ3NwcmVhZE1ldGhvZCcsICdwYWQnKVxuXHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChvcHRpb25zLmNvbG9ycywgZnVuY3Rpb24gKGNvbG9yKSB7XG5cdFx0XHRcdFx0XHRncmFkaWVudC5hcHBlbmQoJ3N2ZzpzdG9wJylcblx0XHRcdFx0XHRcdFx0LmF0dHIoJ29mZnNldCcsIGNvbG9yLnBvc2l0aW9uICsgJyUnKVxuXHRcdFx0XHRcdFx0XHQuYXR0cignc3RvcC1jb2xvcicsIGNvbG9yLmNvbG9yKVxuXHRcdFx0XHRcdFx0XHQuYXR0cignc3RvcC1vcGFjaXR5JywgY29sb3Iub3BhY2l0eSk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0cmVjdC5zdHlsZSgnZmlsbCcsICd1cmwoIycgKyBvcHRpb25zLmZpZWxkICsgJ18nK24uY29sb3IrJyknKTtcblx0XHRcdFx0XHRoYW5kbGUuc3R5bGUoJ2ZpbGwnLCBuLmNvbG9yKTtcblx0XHRcdFx0XHRoYW5kbGVMYWJlbC50ZXh0KHBhcnNlSW50KG5nTW9kZWwuJG1vZGVsVmFsdWVbbi5maWVsZF0pKTtcblx0XHRcdFx0XHRoYW5kbGVDb250LnRyYW5zaXRpb24oKS5kdXJhdGlvbig1MDApLmVhc2UoJ3F1YWQnKS5hdHRyKFwidHJhbnNmb3JtXCIsICd0cmFuc2xhdGUoJyArIHgobmdNb2RlbC4kbW9kZWxWYWx1ZVtuLmZpZWxkXSkgKyAnLCcgKyBvcHRpb25zLmhlaWdodCAvIDIgKyAnKScpO1xuXHRcdFx0XHR9KTtcblx0XHRcdFx0JHNjb3BlLiR3YXRjaChcblx0XHRcdFx0XHRmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gbmdNb2RlbC4kbW9kZWxWYWx1ZTtcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdGZ1bmN0aW9uIChuZXdWYWx1ZSwgb2xkVmFsdWUpIHtcblx0XHRcdFx0XHRcdGlmICghbmV3VmFsdWUpIHtcblx0XHRcdFx0XHRcdFx0aGFuZGxlTGFiZWwudGV4dChwYXJzZUludCgwKSk7XG5cdFx0XHRcdFx0XHRcdGhhbmRsZUNvbnQuYXR0cihcInRyYW5zZm9ybVwiLCAndHJhbnNsYXRlKCcgKyB4KDApICsgJywnICsgb3B0aW9ucy5oZWlnaHQgLyAyICsgJyknKTtcblx0XHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0aGFuZGxlTGFiZWwudGV4dChwYXJzZUludChuZXdWYWx1ZVtvcHRpb25zLmZpZWxkXSkpO1xuXHRcdFx0XHRcdFx0aWYgKG5ld1ZhbHVlID09IG9sZFZhbHVlKSB7XG5cdFx0XHRcdFx0XHRcdGhhbmRsZUNvbnQuYXR0cihcInRyYW5zZm9ybVwiLCAndHJhbnNsYXRlKCcgKyB4KG5ld1ZhbHVlW29wdGlvbnMuZmllbGRdKSArICcsJyArIG9wdGlvbnMuaGVpZ2h0IC8gMiArICcpJyk7XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRoYW5kbGVDb250LnRyYW5zaXRpb24oKS5kdXJhdGlvbig1MDApLmVhc2UoJ3F1YWQnKS5hdHRyKFwidHJhbnNmb3JtXCIsICd0cmFuc2xhdGUoJyArIHgobmV3VmFsdWVbb3B0aW9ucy5maWVsZF0pICsgJywnICsgb3B0aW9ucy5oZWlnaHQgLyAyICsgJyknKTtcblxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH07XG5cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoICdhcHAuY29udHJvbGxlcnMnICkuY29udHJvbGxlciggJ01lZGlhbkN0cmwnLCBmdW5jdGlvbigpe1xuXHRcdC8vXG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5kaXJlY3RpdmVzJykuZGlyZWN0aXZlKCAncGFyc2Vjc3YnLCBmdW5jdGlvbigkc3RhdGUsICR0aW1lb3V0LCB0b2FzdHIpIHtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRyZXN0cmljdDogJ0VBJyxcblx0XHRcdHRlbXBsYXRlVXJsOiAndmlld3MvZGlyZWN0aXZlcy9wYXJzZWNzdi9wYXJzZWNzdi5odG1sJyxcblx0XHRcdGNvbnRyb2xsZXI6ICdQYXJzZWNzdkN0cmwnLFxuXHRcdFx0cmVwbGFjZTp0cnVlLFxuXHRcdFx0bGluazogZnVuY3Rpb24oICRzY29wZSwgZWxlbWVudCwgJGF0dHJzICl7XG5cdFx0XHRcdC8vXG5cdFx0XHRcdHZhciBlcnJvcnMgPSAwO1xuXHRcdFx0XHR2YXIgc3RlcHBlZCA9IDAsIHJvd0NvdW50ID0gMCwgZXJyb3JDb3VudCA9IDAsIGZpcnN0RXJyb3I7XG5cdFx0XHRcdHZhciBzdGFydCwgZW5kO1xuXHRcdFx0XHR2YXIgZmlyc3RSdW4gPSB0cnVlO1xuXHRcdFx0XHR2YXIgbWF4VW5wYXJzZUxlbmd0aCA9IDEwMDAwO1xuXHRcdFx0XHR2YXIgYnV0dG9uID0gZWxlbWVudC5maW5kKCdidXR0b24nKTtcblx0XHRcdFx0XHR2YXIgaW5wdXQgPSBlbGVtZW50LmZpbmQoJ2lucHV0Jyk7XG5cdFx0XHRcdFx0aW5wdXQuY3NzKHsgZGlzcGxheTonbm9uZScgfSk7XG5cdFx0XHRcdFx0YnV0dG9uLmJpbmQoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHRcdGlucHV0WzBdLmNsaWNrKCk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0aW5wdXQuYmluZCgnY2hhbmdlJyxmdW5jdGlvbihlKXtcblx0XHRcdFx0XHRcdFx0JHRpbWVvdXQoZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRcdFx0XHRQYXBhLnBhcnNlKGlucHV0WzBdLmZpbGVzWzBdLHtcblx0XHRcdFx0XHRcdFx0XHRcdHNraXBFbXB0eUxpbmVzOiB0cnVlLFxuXHRcdFx0XHRcdFx0XHRcdFx0aGVhZGVyOnRydWUsXG5cdFx0XHRcdFx0XHRcdFx0XHRkeW5hbWljVHlwaW5nOiB0cnVlLFxuXHRcdFx0XHRcdFx0XHRcdFx0c3RlcDpmdW5jdGlvbihyb3cpe1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2gocm93LmRhdGFbMF0sIGZ1bmN0aW9uKGl0ZW0pe1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlmKGlzTmFOKGl0ZW0pIHx8IGl0ZW0gPCAwICl7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZihpdGVtID09IFwiTkFcIiB8fCBpdGVtIDwgMCB8fCBpdGVtLmluZGV4T2YoJyNOL0EnKSA+IC0xKXtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cm93LmVycm9ycy5wdXNoKHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR0eXBlOlwiMVwiLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1lc3NhZ2U6XCJGaWVsZCBpbiByb3cgaXMgbm90IHZhbGlkIGZvciBkYXRhYmFzZSB1c2UhXCIsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Y29sdW1uOiBpdGVtXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVycm9ycysrO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdCRzY29wZS52bS5kYXRhLnB1c2gocm93KTtcblx0XHRcdFx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRcdFx0XHRiZWZvcmVGaXJzdENodW5rOiBmdW5jdGlvbihjaHVuaylcblx0XHRcdFx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0Ly9DaGVjayBpZiB0aGVyZSBhcmUgcG9pbnRzIGluIHRoZSBoZWFkZXJzXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHZhciBpbmRleCA9IGNodW5rLm1hdGNoKCAvXFxyXFxufFxccnxcXG4vICkuaW5kZXg7XG5cdFx0XHRcdFx0XHRcdFx0ICAgIHZhciBoZWFkaW5ncyA9IGNodW5rLnN1YnN0cigwLCBpbmRleCkuc3BsaXQoICcsJyApO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRmb3IodmFyIGkgPSAwOyBpIDw9IGhlYWRpbmdzLmxlbmd0aDsgaSsrKXtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZihoZWFkaW5nc1tpXSl7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRoZWFkaW5nc1tpXSA9IGhlYWRpbmdzW2ldLnJlcGxhY2UoL1teYS16MC05XS9naSwnXycpLnRvTG93ZXJDYXNlKCk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZihoZWFkaW5nc1tpXS5pbmRleE9mKCcuJykgPiAtMSl7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGhlYWRpbmdzW2ldID0gaGVhZGluZ3NbaV0uc3Vic3RyKDAsIGhlYWRpbmdzW2ldLmluZGV4T2YoJy4nKSk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0ICAgIHJldHVybiBoZWFkaW5ncy5qb2luKCkgKyBjaHVuay5zdWJzdHIoaW5kZXgpO1xuXHRcdFx0XHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdFx0XHRcdGVycm9yOiBmdW5jdGlvbihlcnIsIGZpbGUpXG5cdFx0XHRcdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFRvYXN0U2VydmljZS5lcnJvcihlcnIpO1xuXHRcdFx0XHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdFx0XHRcdGNvbXBsZXRlOiBmdW5jdGlvbihyZXN1bHRzKVxuXHRcdFx0XHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRcdFx0XHQkc2NvcGUudm0uZXJyb3JzID0gZXJyb3JzO1xuXG5cdFx0XHRcdFx0XHRcdFx0XHRcdC8vU2VlIGlmIHRoZXJlIGlzIGFuIGZpZWxkIG5hbWUgXCJpc29cIiBpbiB0aGUgaGVhZGluZ3M7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaCgkc2NvcGUudm0uZGF0YVswXS5kYXRhWzBdLCBmdW5jdGlvbihpdGVtLCBrZXkpe1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlmKGtleS50b0xvd2VyQ2FzZSgpLmluZGV4T2YoJ2lzbycpICE9IC0xKXtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdCRzY29wZS52bS5tZXRhLmlzb19maWVsZCA9IGtleTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZihrZXkudG9Mb3dlckNhc2UoKS5pbmRleE9mKCdjb3VudHJ5JykgIT0gLTEpe1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQkc2NvcGUudm0ubWV0YS5jb3VudHJ5X2ZpZWxkID0ga2V5O1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0JHN0YXRlLmdvKCdhcHAuaW5kZXguY3JlYXRlLmNoZWNrJyk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHRvYXN0ci5pbmZvKCRzY29wZS52bS5kYXRhLmxlbmd0aCsnIGxpbmVzIGltcG9ydGV0IScsICdJbmZvcm1hdGlvbicpXG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRcdFx0fSlcblxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH07XG5cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoICdhcHAuY29udHJvbGxlcnMnICkuY29udHJvbGxlciggJ1BhcnNlY3N2Q3RybCcsIGZ1bmN0aW9uKCl7XG5cdFx0Ly9cblxuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZGlyZWN0aXZlcycpLmRpcmVjdGl2ZSggJ3NpbXBsZWxpbmVjaGFydCcsIGZ1bmN0aW9uKCkge1xuXHRcdHZhciBkZWZhdWx0cyA9IGZ1bmN0aW9uKCl7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRpbnZlcnQ6ZmFsc2Vcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlc3RyaWN0OiAnRScsXG5cdFx0XHRzY29wZTp7XG5cdFx0XHRcdGRhdGE6Jz0nLFxuXHRcdFx0XHRzZWxlY3Rpb246Jz0nLFxuXHRcdFx0XHRvcHRpb25zOic9J1xuXHRcdFx0fSxcblx0XHRcdHRlbXBsYXRlVXJsOiAndmlld3MvZGlyZWN0aXZlcy9zaW1wbGVsaW5lY2hhcnQvc2ltcGxlbGluZWNoYXJ0Lmh0bWwnLFxuXHRcdFx0Y29udHJvbGxlcjogJ1NpbXBsZWxpbmVjaGFydEN0cmwnLFxuXHRcdFx0bGluazogZnVuY3Rpb24oICRzY29wZSwgZWxlbWVudCwgJGF0dHJzICl7XG5cdFx0XHRcdCRzY29wZS5vcHRpb25zID0gYW5ndWxhci5leHRlbmQoZGVmYXVsdHMoKSwgJHNjb3BlLm9wdGlvbnMpO1xuXHRcdFx0XHQkc2NvcGUuY2FsY3VsYXRlR3JhcGgoKTtcblx0XHRcdFx0JHNjb3BlLnNldENoYXJ0KCk7XG5cdFx0XHR9XG5cdFx0fTtcblxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdTaW1wbGVsaW5lY2hhcnRDdHJsJywgZnVuY3Rpb24gKCRzY29wZSkge1xuXHRcdCRzY29wZS5jb25maWcgPSB7XG5cdFx0XHR2aXNpYmxlOiB0cnVlLCAvLyBkZWZhdWx0OiB0cnVlXG5cdFx0XHRleHRlbmRlZDogZmFsc2UsIC8vIGRlZmF1bHQ6IGZhbHNlXG5cdFx0XHRkaXNhYmxlZDogZmFsc2UsIC8vIGRlZmF1bHQ6IGZhbHNlXG5cdFx0XHRhdXRvcmVmcmVzaDogdHJ1ZSwgLy8gZGVmYXVsdDogdHJ1ZVxuXHRcdFx0cmVmcmVzaERhdGFPbmx5OiBmYWxzZSwgLy8gZGVmYXVsdDogZmFsc2Vcblx0XHRcdGRlZXBXYXRjaE9wdGlvbnM6IHRydWUsIC8vIGRlZmF1bHQ6IHRydWVcblx0XHRcdGRlZXBXYXRjaERhdGE6IGZhbHNlLCAvLyBkZWZhdWx0OiBmYWxzZVxuXHRcdFx0ZGVlcFdhdGNoQ29uZmlnOiB0cnVlLCAvLyBkZWZhdWx0OiB0cnVlXG5cdFx0XHRkZWJvdW5jZTogMTAgLy8gZGVmYXVsdDogMTBcblx0XHR9O1xuXHRcdCRzY29wZS5jaGFydCA9IHtcblx0XHRcdG9wdGlvbnM6IHtcblx0XHRcdFx0Y2hhcnQ6IHt9XG5cdFx0XHR9LFxuXHRcdFx0ZGF0YTogW11cblx0XHR9O1xuXHRcdCRzY29wZS5zZXRDaGFydCA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdCRzY29wZS5jaGFydC5vcHRpb25zLmNoYXJ0ID0ge1xuXHRcdFx0XHR0eXBlOiAnbGluZUNoYXJ0Jyxcblx0XHRcdFx0bGVnZW5kUG9zaXRpb246ICdsZWZ0Jyxcblx0XHRcdFx0bWFyZ2luOiB7XG5cdFx0XHRcdFx0dG9wOiAyMCxcblx0XHRcdFx0XHRyaWdodDogMjAsXG5cdFx0XHRcdFx0Ym90dG9tOiAyMCxcblx0XHRcdFx0XHRsZWZ0OiAyMFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR4OiBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdHJldHVybiBkLng7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdHk6IGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGQueTtcblx0XHRcdFx0fSxcblx0XHRcdFx0c2hvd0xlZ2VuZDogZmFsc2UsXG5cdFx0XHRcdHNob3dWYWx1ZXM6IGZhbHNlLFxuXHRcdFx0XHRzaG93WUF4aXM6IGZhbHNlLFxuXHRcdFx0XHR0cmFuc2l0aW9uRHVyYXRpb246IDUwMCxcblx0XHRcdFx0dXNlSW50ZXJhY3RpdmVHdWlkZWxpbmU6IHRydWUsXG5cdFx0XHRcdC8vZm9yY2VZOiBbMTAwLCAwXSxcblx0XHRcdFx0Ly95RG9tYWluOnlEb21haW4sXG5cdFx0XHRcdHhBeGlzOiB7XG5cdFx0XHRcdFx0YXhpc0xhYmVsOiAnJ1xuXHRcdFx0XHR9LFxuXHRcdFx0XHR5QXhpczoge1xuXHRcdFx0XHRcdGF4aXNMYWJlbDogJycsXG5cdFx0XHRcdFx0YXhpc0xhYmVsRGlzdGFuY2U6IDMwXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGxlZ2VuZDoge1xuXHRcdFx0XHRcdHJpZ2h0QWxpZ246IGZhbHNlXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGxpbmVzOiB7XG5cdFx0XHRcdFx0aW50ZXJwb2xhdGU6ICdjYXJkaW5hbCdcblx0XHRcdFx0fVxuXG5cdFx0XHR9O1xuXHRcdFx0aWYgKCRzY29wZS5vcHRpb25zLmludmVydCA9PSB0cnVlKSB7XG5cdFx0XHRcdCRzY29wZS5jaGFydC5vcHRpb25zLmNoYXJ0LnlEb21haW4gPSBbcGFyc2VJbnQoJHNjb3BlLnJhbmdlLm1heCksICRzY29wZS5yYW5nZS5taW5dO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuICRzY29wZS5jaGFydDtcblx0XHR9XG5cdFx0JHNjb3BlLmNhbGN1bGF0ZUdyYXBoID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0dmFyIGNoYXJ0RGF0YSA9IFtdO1xuXHRcdFx0JHNjb3BlLnJhbmdlID0ge1xuXHRcdFx0XHRtYXg6IDAsXG5cdFx0XHRcdG1pbjogMTAwMFxuXHRcdFx0fTtcblx0XHRcdGFuZ3VsYXIuZm9yRWFjaCgkc2NvcGUuc2VsZWN0aW9uLCBmdW5jdGlvbiAoaXRlbSwga2V5KSB7XG5cdFx0XHRcdHZhciBncmFwaCA9IHtcblx0XHRcdFx0XHRpZDoga2V5LFxuXHRcdFx0XHRcdGtleTogaXRlbS50aXRsZSxcblx0XHRcdFx0XHRjb2xvcjogaXRlbS5jb2xvcixcblx0XHRcdFx0XHR2YWx1ZXM6IFtdXG5cdFx0XHRcdH07XG5cdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaCgkc2NvcGUuZGF0YSwgZnVuY3Rpb24gKGRhdGEsIGspIHtcblx0XHRcdFx0XHRncmFwaC52YWx1ZXMucHVzaCh7XG5cdFx0XHRcdFx0XHRpZDogayxcblx0XHRcdFx0XHRcdHg6IGRhdGFbaXRlbS5maWVsZHMueF0sXG5cdFx0XHRcdFx0XHR5OiBkYXRhW2l0ZW0uZmllbGRzLnldXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0JHNjb3BlLnJhbmdlLm1heCA9IE1hdGgubWF4KCRzY29wZS5yYW5nZS5tYXgsIGRhdGFbaXRlbS5maWVsZHMueV0pO1xuXHRcdFx0XHRcdCRzY29wZS5yYW5nZS5taW4gPSBNYXRoLm1pbigkc2NvcGUucmFuZ2UubWluLCBkYXRhW2l0ZW0uZmllbGRzLnldKTtcblx0XHRcdFx0fSk7XG5cdFx0XHRcdGNoYXJ0RGF0YS5wdXNoKGdyYXBoKTtcblx0XHRcdH0pO1xuXG5cdFx0XHQkc2NvcGUuY2hhcnQuZGF0YSA9IGNoYXJ0RGF0YTtcblx0XHRcdGlmICgkc2NvcGUub3B0aW9ucy5pbnZlcnQgPT0gXCJ0cnVlXCIpIHtcblx0XHRcdFx0JHNjb3BlLmNoYXJ0Lm9wdGlvbnMuY2hhcnQueURvbWFpbiA9IFtwYXJzZUludCgkc2NvcGUucmFuZ2UubWF4KSwgJHNjb3BlLnJhbmdlLm1pbl07XG5cdFx0XHR9XG5cdFx0fTtcblx0XHQkc2NvcGUuJHdhdGNoKCdkYXRhJywgZnVuY3Rpb24gKG4sIG8pIHtcblx0XHRcdGlmICghbikge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0XHQkc2NvcGUuY2FsY3VsYXRlR3JhcGgoKTtcblx0XHR9KTtcblx0XHQkc2NvcGUuJHdhdGNoKCdzZWxlY3Rpb24nLCBmdW5jdGlvbiAobiwgbykge1xuXHRcdFx0aWYgKG4gPT09IG8pIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdFx0JHNjb3BlLmNhbGN1bGF0ZUdyYXBoKCk7XG5cdFx0fSlcblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5kaXJlY3RpdmVzJykuYW5pbWF0aW9uKCcuc2xpZGUtdG9nZ2xlJywgWyckYW5pbWF0ZUNzcycsIGZ1bmN0aW9uKCRhbmltYXRlQ3NzKSB7XG5cblx0XHR2YXIgbGFzdElkID0gMDtcbiAgICAgICAgdmFyIF9jYWNoZSA9IHt9O1xuXG4gICAgICAgIGZ1bmN0aW9uIGdldElkKGVsKSB7XG4gICAgICAgICAgICB2YXIgaWQgPSBlbFswXS5nZXRBdHRyaWJ1dGUoXCJkYXRhLXNsaWRlLXRvZ2dsZVwiKTtcbiAgICAgICAgICAgIGlmICghaWQpIHtcbiAgICAgICAgICAgICAgICBpZCA9ICsrbGFzdElkO1xuICAgICAgICAgICAgICAgIGVsWzBdLnNldEF0dHJpYnV0ZShcImRhdGEtc2xpZGUtdG9nZ2xlXCIsIGlkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBpZDtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBnZXRTdGF0ZShpZCkge1xuICAgICAgICAgICAgdmFyIHN0YXRlID0gX2NhY2hlW2lkXTtcbiAgICAgICAgICAgIGlmICghc3RhdGUpIHtcbiAgICAgICAgICAgICAgICBzdGF0ZSA9IHt9O1xuICAgICAgICAgICAgICAgIF9jYWNoZVtpZF0gPSBzdGF0ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGdlbmVyYXRlUnVubmVyKGNsb3NpbmcsIHN0YXRlLCBhbmltYXRvciwgZWxlbWVudCwgZG9uZUZuKSB7XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgc3RhdGUuYW5pbWF0aW5nID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBzdGF0ZS5hbmltYXRvciA9IGFuaW1hdG9yO1xuICAgICAgICAgICAgICAgIHN0YXRlLmRvbmVGbiA9IGRvbmVGbjtcbiAgICAgICAgICAgICAgICBhbmltYXRvci5zdGFydCgpLmZpbmFsbHkoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjbG9zaW5nICYmIHN0YXRlLmRvbmVGbiA9PT0gZG9uZUZuKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50WzBdLnN0eWxlLmhlaWdodCA9ICcnO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHN0YXRlLmFuaW1hdGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBzdGF0ZS5hbmltYXRvciA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAgICAgc3RhdGUuZG9uZUZuKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgbGVhdmU6IGZ1bmN0aW9uKGVsZW1lbnQsIGRvbmVGbikge1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciBzdGF0ZSA9IGdldFN0YXRlKGdldElkKGVsZW1lbnQpKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGhlaWdodCA9IChzdGF0ZS5hbmltYXRpbmcgJiYgc3RhdGUuaGVpZ2h0KSA/XG4gICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZS5oZWlnaHQgOiBlbGVtZW50WzBdLm9mZnNldEhlaWdodDtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGFuaW1hdG9yID0gJGFuaW1hdGVDc3MoZWxlbWVudCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgZnJvbToge2hlaWdodDogaGVpZ2h0ICsgJ3B4Jywgb3BhY2l0eTogMX0sXG4gICAgICAgICAgICAgICAgICAgICAgICB0bzoge2hlaWdodDogJzBweCcsIG9wYWNpdHk6IDB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBpZiAoYW5pbWF0b3IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzdGF0ZS5hbmltYXRpbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZS5kb25lRm4gPVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2VuZXJhdGVSdW5uZXIodHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5pbWF0b3IsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZG9uZUZuKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gc3RhdGUuYW5pbWF0b3IuZW5kKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZS5oZWlnaHQgPSBoZWlnaHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGdlbmVyYXRlUnVubmVyKHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbmltYXRvcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZG9uZUZuKSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBkb25lRm4oKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlbnRlcjogZnVuY3Rpb24oZWxlbWVudCwgZG9uZUZuKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIHN0YXRlID0gZ2V0U3RhdGUoZ2V0SWQoZWxlbWVudCkpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgaGVpZ2h0ID0gKHN0YXRlLmFuaW1hdGluZyAmJiBzdGF0ZS5oZWlnaHQpID9cbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlLmhlaWdodCA6IGVsZW1lbnRbMF0ub2Zmc2V0SGVpZ2h0O1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciBhbmltYXRvciA9ICRhbmltYXRlQ3NzKGVsZW1lbnQsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZyb206IHtoZWlnaHQ6ICcwcHgnLCBvcGFjaXR5OiAwfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvOiB7aGVpZ2h0OiBoZWlnaHQgKyAncHgnLCBvcGFjaXR5OiAxfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFuaW1hdG9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3RhdGUuYW5pbWF0aW5nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGUuZG9uZUZuID0gZ2VuZXJhdGVSdW5uZXIoZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5pbWF0b3IsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkb25lRm4pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBzdGF0ZS5hbmltYXRvci5lbmQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlLmhlaWdodCA9IGhlaWdodDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZ2VuZXJhdGVSdW5uZXIoZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbmltYXRvcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZG9uZUZuKSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBkb25lRm4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XSk7XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCAnYXBwLmNvbnRyb2xsZXJzJyApLmNvbnRyb2xsZXIoICdTbGlkZVRvZ2dsZUN0cmwnLCBmdW5jdGlvbigpe1xuXHRcdC8vXG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmRpcmVjdGl2ZXMnKS5kaXJlY3RpdmUoJ3N1YmluZGV4Jywgc3ViaW5kZXgpO1xuXG5cdHN1YmluZGV4LiRpbmplY3QgPSBbJyR0aW1lb3V0JywgJ3Ntb290aFNjcm9sbCddO1xuXG5cdGZ1bmN0aW9uIHN1YmluZGV4KCR0aW1lb3V0LCBzbW9vdGhTY3JvbGwpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0cmVzdHJpY3Q6ICdFJyxcblx0XHRcdHJlcGxhY2U6IHRydWUsXG5cdFx0XHRjb250cm9sbGVyOiAnU3ViaW5kZXhDdHJsJyxcblx0XHRcdHRlbXBsYXRlVXJsOiAndmlld3MvZGlyZWN0aXZlcy9zdWJpbmRleC9zdWJpbmRleC5odG1sJyxcblx0XHRcdGxpbms6IHN1YmluZGV4TGlua0Z1bmN0aW9uXG5cdFx0fTtcblxuXHRcdGZ1bmN0aW9uIHN1YmluZGV4TGlua0Z1bmN0aW9uKCRzY29wZSwgZWxlbWVudCwgJGF0dHJzKSB7XG5cdFx0fVxuXHR9XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignU3ViaW5kZXhDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCAkZmlsdGVyLCAkdGltZW91dCkge1xuXHRcdCRzY29wZS5pbmZvID0gZmFsc2U7XG5cdFx0JHNjb3BlLnNldENoYXJ0ID0gc2V0Q2hhcnQ7XG5cdFx0JHNjb3BlLmNhbGN1bGF0ZUdyYXBoID0gY2FsY3VsYXRlR3JhcGg7XG5cdFx0JHNjb3BlLmNyZWF0ZUluZGV4ZXIgPSBjcmVhdGVJbmRleGVyO1xuXHRcdCRzY29wZS5jYWxjU3ViUmFuayA9IGNhbGNTdWJSYW5rO1xuXHRcdCRzY29wZS50b2dnbGVJbmZvID0gdG9nZ2xlSW5mbztcblx0XHQkc2NvcGUuY3JlYXRlT3B0aW9ucyA9IGNyZWF0ZU9wdGlvbnM7XG5cdFx0JHNjb3BlLmdldFN1YlJhbmsgPSBnZXRTdWJSYW5rO1xuXHRcdGFjdGl2YXRlKCk7XG5cblx0XHRmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcblx0XHRcdCRzY29wZS5jYWxjU3ViUmFuaygpO1xuXHRcdFx0JHNjb3BlLnNldENoYXJ0KCk7XG5cdFx0XHQkc2NvcGUuY2FsY3VsYXRlR3JhcGgoKTtcblx0XHRcdCRzY29wZS5jcmVhdGVJbmRleGVyKCk7XG5cdFx0XHQkc2NvcGUuY3JlYXRlT3B0aW9ucygpO1xuXHRcdFx0JHNjb3BlLiR3YXRjaCgnZGlzcGxheS5zZWxlY3RlZENhdCcsIGZ1bmN0aW9uKG5ld0l0ZW0sIG9sZEl0ZW0pIHtcblx0XHRcdFx0aWYgKG5ld0l0ZW0gPT09IG9sZEl0ZW0pIHtcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdH1cblx0XHRcdFx0JHNjb3BlLmNyZWF0ZUluZGV4ZXIoKTtcblx0XHRcdFx0JHNjb3BlLmNhbGN1bGF0ZUdyYXBoKCk7XG5cdFx0XHRcdCRzY29wZS5jcmVhdGVPcHRpb25zKCk7XG5cdFx0XHRcdCRzY29wZS5jYWxjU3ViUmFuaygpO1xuXHRcdFx0fSk7XG5cdFx0XHQkc2NvcGUuJHdhdGNoKCdjdXJyZW50JywgZnVuY3Rpb24obiwgbykge1xuXHRcdFx0XHRpZiAobiA9PT0gbykge1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXHRcdFx0XHQkc2NvcGUuY2FsY1N1YlJhbmsoKTtcblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIHRvZ2dsZUluZm8oKSB7XG5cdFx0XHQkc2NvcGUuaW5mbyA9ICEkc2NvcGUuaW5mbztcblx0XHR9O1xuXG5cdFx0ZnVuY3Rpb24gY2FsY1N1YlJhbmsoKSB7XG5cdFx0XHR2YXIgcmFuayA9IDA7XG5cdFx0XHRhbmd1bGFyLmZvckVhY2goJHNjb3BlLmRhdGEsIGZ1bmN0aW9uKGl0ZW0pIHtcblx0XHRcdFx0aXRlbVskc2NvcGUuZGlzcGxheS5zZWxlY3RlZENhdC50eXBlXSA9IHBhcnNlRmxvYXQoaXRlbVskc2NvcGUuZGlzcGxheS5zZWxlY3RlZENhdC50eXBlXSk7XG5cdFx0XHRcdGl0ZW1bJ3Njb3JlJ10gPSBwYXJzZUludChpdGVtWydzY29yZSddKTtcblx0XHRcdH0pXG5cdFx0XHR2YXIgZmlsdGVyID0gJGZpbHRlcignb3JkZXJCeScpKCRzY29wZS5lcGksIFskc2NvcGUuZGlzcGxheS5zZWxlY3RlZENhdC50eXBlLCBcInNjb3JlXCJdLCB0cnVlKTtcblx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgZmlsdGVyLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdGlmIChmaWx0ZXJbaV0uaXNvID09ICRzY29wZS5jdXJyZW50Lmlzbykge1xuXHRcdFx0XHRcdHJhbmsgPSBpICsgMTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0JHNjb3BlLmN1cnJlbnRbJHNjb3BlLmRpc3BsYXkuc2VsZWN0ZWRDYXQudHlwZSsnX3JhbmsnXSA9IHJhbms7XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIGdldFN1YlJhbmsoY291bnRyeSl7XG5cdFx0XHR2YXIgZmlsdGVyID0gJGZpbHRlcignb3JkZXJCeScpKCRzY29wZS5lcGksIFskc2NvcGUuZGlzcGxheS5zZWxlY3RlZENhdC50eXBlLCBcInNjb3JlXCJdLCB0cnVlKTtcblx0XHRcdHZhciByYW5rID0gMDtcblx0XHRcdGFuZ3VsYXIuZm9yRWFjaChmaWx0ZXIsIGZ1bmN0aW9uKGl0ZW0sIGtleSl7XG5cdFx0XHRcdGlmKGl0ZW0uY291bnRyeSA9PSBjb3VudHJ5LmNvdW50cnkpe1xuXHRcdFx0XHRcdHJhbmsgPSBrZXk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdFx0cmV0dXJuIHJhbmsrMTtcblx0XHR9XG5cdFx0ZnVuY3Rpb24gY3JlYXRlSW5kZXhlcigpIHtcblx0XHRcdCRzY29wZS5pbmRleGVyID0gWyRzY29wZS4kcGFyZW50LmRpc3BsYXkuc2VsZWN0ZWRDYXQuZGF0YV07XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gY3JlYXRlT3B0aW9ucygpIHtcblx0XHRcdCRzY29wZS5tZWRpYW5PcHRpb25zID0ge1xuXHRcdFx0XHRjb2xvcjogJHNjb3BlLiRwYXJlbnQuZGlzcGxheS5zZWxlY3RlZENhdC5jb2xvcixcblx0XHRcdFx0ZmllbGQ6ICRzY29wZS4kcGFyZW50LmRpc3BsYXkuc2VsZWN0ZWRDYXQudHlwZSxcblx0XHRcdFx0aGFuZGxpbmc6IGZhbHNlLFxuXHRcdFx0XHRtYXJnaW46e1xuXHRcdFx0XHRcdGxlZnQ6MTBcblx0XHRcdFx0fVxuXHRcdFx0fTtcblx0XHRcdCRzY29wZS5tZWRpYW5PcHRpb25zQmlnID0ge1xuXHRcdFx0XHRjb2xvcjogJHNjb3BlLiRwYXJlbnQuZGlzcGxheS5zZWxlY3RlZENhdC5jb2xvcixcblx0XHRcdFx0ZmllbGQ6ICRzY29wZS4kcGFyZW50LmRpc3BsYXkuc2VsZWN0ZWRDYXQudHlwZSxcblx0XHRcdFx0aGFuZGxpbmc6IGZhbHNlLFxuXHRcdFx0XHRtYXJnaW46e1xuXHRcdFx0XHRcdGxlZnQ6MjBcblx0XHRcdFx0fVxuXHRcdFx0fTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBzZXRDaGFydCgpIHtcblx0XHRcdCRzY29wZS5jaGFydCA9IHtcblx0XHRcdFx0b3B0aW9uczoge1xuXHRcdFx0XHRcdGNoYXJ0OiB7XG5cdFx0XHRcdFx0XHR0eXBlOiAnbGluZUNoYXJ0Jyxcblx0XHRcdFx0XHRcdC8vaGVpZ2h0OiAyMDAsXG5cdFx0XHRcdFx0XHRsZWdlbmRQb3NpdGlvbjogJ2xlZnQnLFxuXHRcdFx0XHRcdFx0bWFyZ2luOiB7XG5cdFx0XHRcdFx0XHRcdHRvcDogMjAsXG5cdFx0XHRcdFx0XHRcdHJpZ2h0OiAyMCxcblx0XHRcdFx0XHRcdFx0Ym90dG9tOiAyMCxcblx0XHRcdFx0XHRcdFx0bGVmdDogMjBcblx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHR4OiBmdW5jdGlvbihkKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBkLng7XG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0eTogZnVuY3Rpb24oZCkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gZC55O1xuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdHNob3dWYWx1ZXM6IGZhbHNlLFxuXHRcdFx0XHRcdFx0c2hvd1lBeGlzOiBmYWxzZSxcblx0XHRcdFx0XHRcdHRyYW5zaXRpb25EdXJhdGlvbjogNTAwLFxuXHRcdFx0XHRcdFx0dXNlSW50ZXJhY3RpdmVHdWlkZWxpbmU6IHRydWUsXG5cdFx0XHRcdFx0XHRmb3JjZVk6IFsxMDAsIDBdLFxuXHRcdFx0XHRcdFx0eEF4aXM6IHtcblx0XHRcdFx0XHRcdFx0YXhpc0xhYmVsOiAnJ1xuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdHlBeGlzOiB7XG5cdFx0XHRcdFx0XHRcdGF4aXNMYWJlbDogJycsXG5cdFx0XHRcdFx0XHRcdGF4aXNMYWJlbERpc3RhbmNlOiAzMFxuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdGxlZ2VuZDoge1xuXHRcdFx0XHRcdFx0XHRyaWdodEFsaWduOiBmYWxzZSxcblx0XHRcdFx0XHRcdFx0bWFyZ2luOiB7XG5cdFx0XHRcdFx0XHRcdFx0Ym90dG9tOiAzMFxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0bGluZXM6IHtcblx0XHRcdFx0XHRcdFx0aW50ZXJwb2xhdGU6ICdjYXJkaW5hbCdcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sXG5cdFx0XHRcdGRhdGE6IFtdXG5cdFx0XHR9O1xuXHRcdFx0cmV0dXJuICRzY29wZS5jaGFydDtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBjYWxjdWxhdGVHcmFwaCgpIHtcblx0XHRcdHZhciBjaGFydERhdGEgPSBbXTtcblx0XHRcdGFuZ3VsYXIuZm9yRWFjaCgkc2NvcGUuZGlzcGxheS5zZWxlY3RlZENhdC5jaGlsZHJlbiwgZnVuY3Rpb24oaXRlbSwga2V5KSB7XG5cdFx0XHRcdHZhciBncmFwaCA9IHtcblx0XHRcdFx0XHRrZXk6IGl0ZW0udGl0bGUsXG5cdFx0XHRcdFx0Y29sb3I6IGl0ZW0uY29sb3IsXG5cdFx0XHRcdFx0dmFsdWVzOiBbXVxuXHRcdFx0XHR9O1xuXHRcdFx0XHRhbmd1bGFyLmZvckVhY2goJHNjb3BlLmNvdW50cnkuZXBpLCBmdW5jdGlvbihkYXRhKSB7XG5cdFx0XHRcdFx0Z3JhcGgudmFsdWVzLnB1c2goe1xuXHRcdFx0XHRcdFx0eDogZGF0YS55ZWFyLFxuXHRcdFx0XHRcdFx0eTogZGF0YVtpdGVtLmNvbHVtbl9uYW1lXVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9KTtcblx0XHRcdFx0Y2hhcnREYXRhLnB1c2goZ3JhcGgpO1xuXHRcdFx0fSk7XG5cdFx0XHQkc2NvcGUuY2hhcnQuZGF0YSA9IGNoYXJ0RGF0YTtcblx0XHR9XG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5kaXJlY3RpdmVzJykuZGlyZWN0aXZlKCdzdW5idXJzdCcsIGZ1bmN0aW9uICgpIHtcblx0XHR2YXIgZGVmYXVsdHMgPSBmdW5jdGlvbigpe1xuXHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdCBtb2RlOiAnc2l6ZSdcblx0XHRcdFx0fVxuXHRcdH07XG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlc3RyaWN0OiAnRScsXG5cdFx0XHQvL3RlbXBsYXRlVXJsOiAndmlld3MvZGlyZWN0aXZlcy9zdW5idXJzdC9zdW5idXJzdC5odG1sJyxcblx0XHRcdGNvbnRyb2xsZXI6ICdTdW5idXJzdEN0cmwnLFxuXHRcdFx0c2NvcGU6IHtcblx0XHRcdFx0ZGF0YTogJz0nXG5cdFx0XHR9LFxuXHRcdFx0bGluazogZnVuY3Rpb24gKCRzY29wZSwgZWxlbWVudCwgJGF0dHJzKSB7XG5cdFx0XHRcdHZhciBvcHRpb25zID0gYW5ndWxhci5leHRlbmQoZGVmYXVsdHMoKSwgJGF0dHJzKTtcblx0XHRcdFx0JHNjb3BlLnNldENoYXJ0KCk7XG5cdFx0XHRcdCRzY29wZS5jYWxjdWxhdGVHcmFwaCgpO1xuXHRcdFx0XHR2YXIgd2lkdGggPSA2MTAsXG5cdFx0XHRcdFx0aGVpZ2h0ID0gd2lkdGgsXG5cdFx0XHRcdFx0cmFkaXVzID0gKHdpZHRoKSAvIDIsXG5cdFx0XHRcdFx0eCA9IGQzLnNjYWxlLmxpbmVhcigpLnJhbmdlKFswLCAyICogTWF0aC5QSV0pLFxuXHRcdFx0XHRcdHkgPSBkMy5zY2FsZS5wb3coKS5leHBvbmVudCgxLjMpLmRvbWFpbihbMCwgMV0pLnJhbmdlKFswLCByYWRpdXNdKSxcblx0XHRcdFx0XHQvL34geSA9IGQzLnNjYWxlLnBvdygpLmV4cG9uZW50KDEuMykuZG9tYWluKFswLCAwLjI1LCAxXSkucmFuZ2UoWzAsIDMwLCByYWRpdXNdKSxcblx0XHRcdFx0XHQvL34geSA9IGQzLnNjYWxlLmxpbmVhcigpLmRvbWFpbihbMCwgMC4yNSwgMC41LCAwLjc1LCAxXSkucmFuZ2UoWzAsIDMwLCAxMTUsIDIwMCwgcmFkaXVzXSksXG5cdFx0XHRcdFx0cGFkZGluZyA9IDAsXG5cdFx0XHRcdFx0ZHVyYXRpb24gPSAxMDAwLFxuXHRcdFx0XHRcdGNpcmNQYWRkaW5nID0gMTA7XG5cblx0XHRcdFx0dmFyIGRpdiA9IGQzLnNlbGVjdChlbGVtZW50WzBdKTtcblxuXG5cdFx0XHRcdHZhciB2aXMgPSBkaXYuYXBwZW5kKFwic3ZnXCIpXG5cdFx0XHRcdFx0LmF0dHIoXCJ3aWR0aFwiLCB3aWR0aCArIHBhZGRpbmcgKiAyKVxuXHRcdFx0XHRcdC5hdHRyKFwiaGVpZ2h0XCIsIGhlaWdodCArIHBhZGRpbmcgKiAyKVxuXHRcdFx0XHRcdC5hcHBlbmQoXCJnXCIpXG5cdFx0XHRcdFx0LmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIgKyBbcmFkaXVzICsgcGFkZGluZywgcmFkaXVzICsgcGFkZGluZ10gKyBcIilcIik7XG5cblx0XHRcdFx0Lypcblx0XHRcdFx0ZGl2LmFwcGVuZChcInBcIilcblx0XHRcdFx0XHRcdC5hdHRyKFwiaWRcIiwgXCJpbnRyb1wiKVxuXHRcdFx0XHRcdFx0LnRleHQoXCJDbGljayB0byB6b29tIVwiKTtcblx0XHRcdFx0Ki9cblxuXHRcdFx0XHR2YXIgcGFydGl0aW9uID0gZDMubGF5b3V0LnBhcnRpdGlvbigpXG5cdFx0XHRcdFx0LnNvcnQobnVsbClcblx0XHRcdFx0XHQudmFsdWUoZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdHJldHVybiAxO1xuXHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdHZhciBhcmMgPSBkMy5zdmcuYXJjKClcblx0XHRcdFx0XHQuc3RhcnRBbmdsZShmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIE1hdGgubWF4KDAsIE1hdGgubWluKDIgKiBNYXRoLlBJLCB4KGQueCkpKTtcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC5lbmRBbmdsZShmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIE1hdGgubWF4KDAsIE1hdGgubWluKDIgKiBNYXRoLlBJLCB4KGQueCArIGQuZHgpKSk7XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQuaW5uZXJSYWRpdXMoZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdHJldHVybiBNYXRoLm1heCgwLCBkLnkgPyB5KGQueSkgOiBkLnkpO1xuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0Lm91dGVyUmFkaXVzKGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gTWF0aC5tYXgoMCwgeShkLnkgKyBkLmR5KSk7XG5cdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0dmFyIHNwZWNpYWwxID0gXCJXYXN0ZXdhdGVyIFRyZWF0bWVudFwiLFxuXHRcdFx0XHRcdHNwZWNpYWwyID0gXCJBaXIgUG9sbHV0aW9uIFBNMi41IEV4Y2VlZGFuY2VcIixcblx0XHRcdFx0XHRzcGVjaWFsMyA9IFwiQWdyaWN1bHR1cmFsIFN1YnNpZGllc1wiLFxuXHRcdFx0XHRcdHNwZWNpYWw0ID0gXCJQZXN0aWNpZGUgUmVndWxhdGlvblwiO1xuXG5cblx0XHRcdFx0dmFyIG5vZGVzID0gcGFydGl0aW9uLm5vZGVzKCRzY29wZS5jYWxjdWxhdGVHcmFwaCgpKTtcblxuXHRcdFx0XHR2YXIgcGF0aCA9IHZpcy5zZWxlY3RBbGwoXCJwYXRoXCIpLmRhdGEobm9kZXMpO1xuXHRcdFx0XHRwYXRoLmVudGVyKCkuYXBwZW5kKFwicGF0aFwiKVxuXHRcdFx0XHRcdC5hdHRyKFwiaWRcIiwgZnVuY3Rpb24gKGQsIGkpIHtcblx0XHRcdFx0XHRcdHJldHVybiBcInBhdGgtXCIgKyBpO1xuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0LmF0dHIoXCJkXCIsIGFyYylcblx0XHRcdFx0XHQuYXR0cihcImZpbGwtcnVsZVwiLCBcImV2ZW5vZGRcIilcblx0XHRcdFx0XHQuYXR0cihcImNsYXNzXCIsIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZC5kZXB0aCA/IFwiYnJhbmNoXCIgOiBcInJvb3RcIjtcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC5zdHlsZShcImZpbGxcIiwgc2V0Q29sb3IpXG5cdFx0XHRcdFx0Lm9uKFwiY2xpY2tcIiwgY2xpY2spO1xuXG5cdFx0XHRcdHZhciB0ZXh0ID0gdmlzLnNlbGVjdEFsbChcInRleHRcIikuZGF0YShub2Rlcyk7XG5cdFx0XHRcdHZhciB0ZXh0RW50ZXIgPSB0ZXh0LmVudGVyKCkuYXBwZW5kKFwidGV4dFwiKVxuXHRcdFx0XHRcdC5zdHlsZShcImZpbGwtb3BhY2l0eVwiLCAxKVxuXHRcdFx0XHRcdC5hdHRyKFwidGV4dC1hbmNob3JcIiwgZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdGlmIChkLmRlcHRoKVxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gXCJtaWRkbGVcIjtcblx0XHRcdFx0XHRcdC8vfiByZXR1cm4geChkLnggKyBkLmR4IC8gMikgPiBNYXRoLlBJID8gXCJlbmRcIiA6IFwic3RhcnRcIjtcblx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0cmV0dXJuIFwibWlkZGxlXCI7XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQuYXR0cihcImlkXCIsIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gXCJkZXB0aFwiICsgZC5kZXB0aDtcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC5hdHRyKFwiY2xhc3NcIiwgZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdHJldHVybiBcInNlY3RvclwiXG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQuYXR0cihcImR5XCIsIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZC5kZXB0aCA/IFwiLjJlbVwiIDogXCIwLjM1ZW1cIjtcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC5hdHRyKFwidHJhbnNmb3JtXCIsIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHR2YXIgbXVsdGlsaW5lID0gKGQubmFtZSB8fCBcIlwiKS5zcGxpdChcIiBcIikubGVuZ3RoID4gMixcblx0XHRcdFx0XHRcdFx0YW5nbGVBbGlnbiA9IChkLnggPiAwLjUgPyAyIDogLTIpLFxuXHRcdFx0XHRcdFx0XHRhbmdsZSA9IHgoZC54ICsgZC5keCAvIDIpICogMTgwIC8gTWF0aC5QSSAtIDkwICsgKG11bHRpbGluZSA/IGFuZ2xlQWxpZ24gOiAwKSxcblx0XHRcdFx0XHRcdFx0cm90YXRlID0gYW5nbGUgKyAobXVsdGlsaW5lID8gLS41IDogMCksXG5cdFx0XHRcdFx0XHRcdHRyYW5zbCA9ICh5KGQueSkgKyBjaXJjUGFkZGluZykgKyAzNSxcblx0XHRcdFx0XHRcdFx0c2VjQW5nbGUgPSAoYW5nbGUgPiA5MCA/IC0xODAgOiAwKTtcblx0XHRcdFx0XHRcdGlmIChkLm5hbWUgPT0gc3BlY2lhbDMgfHwgZC5uYW1lID09IHNwZWNpYWw0KSByb3RhdGUgKz0gMTtcblx0XHRcdFx0XHRcdGlmIChkLmRlcHRoID09IDApIHtcblx0XHRcdFx0XHRcdFx0dHJhbnNsID0gLTIuNTA7XG5cdFx0XHRcdFx0XHRcdHJvdGF0ZSA9IDA7XG5cdFx0XHRcdFx0XHRcdHNlY0FuZ2xlID0gMDtcblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoZC5kZXB0aCA9PSAxKSB0cmFuc2wgKz0gLTk7XG5cdFx0XHRcdFx0XHRlbHNlIGlmIChkLmRlcHRoID09IDIpIHRyYW5zbCArPSAtNTtcblx0XHRcdFx0XHRcdGVsc2UgaWYgKGQuZGVwdGggPT0gMykgdHJhbnNsICs9IDQ7XG5cdFx0XHRcdFx0XHRyZXR1cm4gXCJyb3RhdGUoXCIgKyByb3RhdGUgKyBcIil0cmFuc2xhdGUoXCIgKyB0cmFuc2wgKyBcIilyb3RhdGUoXCIgKyBzZWNBbmdsZSArIFwiKVwiO1xuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0Lm9uKFwiY2xpY2tcIiwgY2xpY2spO1xuXG5cdFx0XHRcdC8vIEFkZCBsYWJlbHMuIFZlcnkgdWdseSBjb2RlIHRvIHNwbGl0IHNlbnRlbmNlcyBpbnRvIGxpbmVzLiBDYW4gb25seSBtYWtlXG5cdFx0XHRcdC8vIGNvZGUgYmV0dGVyIGlmIGZpbmQgYSB3YXkgdG8gdXNlIGQgb3V0c2lkZSBjYWxscyBzdWNoIGFzIC50ZXh0KGZ1bmN0aW9uKGQpKVxuXG5cdFx0XHRcdC8vIFRoaXMgYmxvY2sgcmVwbGFjZXMgdGhlIHR3byBibG9ja3MgYXJyb3VuZCBpdC4gSXQgaXMgJ3VzZWZ1bCcgYmVjYXVzZSBpdFxuXHRcdFx0XHQvLyB1c2VzIGZvcmVpZ25PYmplY3QsIHNvIHRoYXQgdGV4dCB3aWxsIHdyYXAgYXJvdW5kIGxpa2UgaW4gcmVndWxhciBIVE1MLiBJIHRyaWVkXG5cdFx0XHRcdC8vIHRvIGdldCBpdCB0byB3b3JrLCBidXQgaXQgb25seSBpbnRyb2R1Y2VkIG1vcmUgYnVncy4gVW5mb3J0dW5hdGVseSwgdGhlXG5cdFx0XHRcdC8vIHVnbHkgc29sdXRpb24gKGhhcmQgY29kZWQgbGluZSBzcGxpY2luZykgd29uLlxuXHRcdFx0XHQvL34gdmFyIHRleHRFbnRlciA9IHRleHQuZW50ZXIoKS5hcHBlbmQoXCJmb3JlaWduT2JqZWN0XCIpXG5cdFx0XHRcdC8vfiAuYXR0cihcInhcIiwwKVxuXHRcdFx0XHQvL34gLmF0dHIoXCJ5XCIsLTIwKVxuXHRcdFx0XHQvL34gLmF0dHIoXCJoZWlnaHRcIiwgMTAwKVxuXHRcdFx0XHQvL34gLmF0dHIoXCJ3aWR0aFwiLCBmdW5jdGlvbihkKXsgcmV0dXJuICh5KGQuZHkpICs1MCk7IH0pXG5cdFx0XHRcdC8vfiAuYXR0cihcInRyYW5zZm9ybVwiLCBmdW5jdGlvbihkKSB7XG5cdFx0XHRcdC8vfiB2YXIgYW5nbGVBbGlnbiA9IChkLnggPiAwLjUgPyAyIDogLTIpLFxuXHRcdFx0XHQvL34gYW5nbGUgPSB4KGQueCArIGQuZHggLyAyKSAqIDE4MCAvIE1hdGguUEkgLSA5MCxcblx0XHRcdFx0Ly9+IHRyYW5zbCA9ICh5KGQueSkgKyBjaXJjUGFkZGluZyk7XG5cdFx0XHRcdC8vfiBkLnJvdCA9IGFuZ2xlO1xuXHRcdFx0XHQvL34gaWYgKCFkLmRlcHRoKSB0cmFuc2wgPSAtNTA7XG5cdFx0XHRcdC8vfiBpZiAoYW5nbGUgPiA5MCkgdHJhbnNsICs9IDEyMDtcblx0XHRcdFx0Ly9+IGlmIChkLmRlcHRoKVxuXHRcdFx0XHQvL34gcmV0dXJuIFwicm90YXRlKFwiICsgYW5nbGUgKyBcIil0cmFuc2xhdGUoXCIgKyB0cmFuc2wgKyBcIilyb3RhdGUoXCIgKyAoYW5nbGUgPiA5MCA/IC0xODAgOiAwKSArIFwiKVwiO1xuXHRcdFx0XHQvL34gZWxzZVxuXHRcdFx0XHQvL34gcmV0dXJuIFwidHJhbnNsYXRlKFwiICsgdHJhbnNsICsgXCIpXCI7XG5cdFx0XHRcdC8vfiB9KVxuXHRcdFx0XHQvL34gLmFwcGVuZChcInhodG1sOmJvZHlcIilcblx0XHRcdFx0Ly9+IC5zdHlsZShcImJhY2tncm91bmRcIiwgXCJub25lXCIpXG5cdFx0XHRcdC8vfiAuc3R5bGUoXCJ0ZXh0LWFsaWduXCIsIGZ1bmN0aW9uKGQpeyByZXR1cm4gKGQucm90ID4gOTAgPyBcImxlZnRcIiA6IFwicmlnaHRcIil9KVxuXHRcdFx0XHQvL34gLmh0bWwoZnVuY3Rpb24oZCl7IHJldHVybiAnPGRpdiBjbGFzcz0nICtcImRlcHRoXCIgKyBkLmRlcHRoICsnIHN0eWxlPVxcXCJ3aWR0aDogJyArKHkoZC5keSkgKzUwKSArJ3B4OycgK1widGV4dC1hbGlnbjogXCIgKyAoZC5yb3QgPiA5MCA/IFwicmlnaHRcIiA6IFwibGVmdFwiKSArJ1wiPicgK2QubmFtZSArJzwvZGl2Pic7fSlcblxuXHRcdFx0XHR0ZXh0RW50ZXIuYXBwZW5kKFwidHNwYW5cIilcblx0XHRcdFx0XHQuYXR0cihcInhcIiwgMClcblx0XHRcdFx0XHQudGV4dChmdW5jdGlvbiAoZCkge1xuXG5cdFx0XHRcdFx0XHRpZiAoZC5kZXB0aCA9PSAzICYmIGQubmFtZSAhPSBzcGVjaWFsMSAmJiBkLm5hbWUgIT0gc3BlY2lhbDIgJiYgZC5uYW1lICE9IHNwZWNpYWwzICYmIGQubmFtZSAhPSBzcGVjaWFsNClcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGQubmFtZS5zcGxpdChcIiBcIilbMF0gKyBcIiBcIiArIChkLm5hbWUuc3BsaXQoXCIgXCIpWzFdIHx8IFwiXCIpO1xuXHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gZC5uYW1lLnNwbGl0KFwiIFwiKVswXTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0dGV4dEVudGVyLmFwcGVuZChcInRzcGFuXCIpXG5cdFx0XHRcdFx0LmF0dHIoXCJ4XCIsIDApXG5cdFx0XHRcdFx0LmF0dHIoXCJkeVwiLCBcIjFlbVwiKVxuXHRcdFx0XHRcdC50ZXh0KGZ1bmN0aW9uIChkKSB7XG5cblx0XHRcdFx0XHRcdGlmIChkLmRlcHRoID09IDMgJiYgZC5uYW1lICE9IHNwZWNpYWwxICYmIGQubmFtZSAhPSBzcGVjaWFsMiAmJiBkLm5hbWUgIT0gc3BlY2lhbDMgJiYgZC5uYW1lICE9IHNwZWNpYWw0KVxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gKGQubmFtZS5zcGxpdChcIiBcIilbMl0gfHwgXCJcIikgKyBcIiBcIiArIChkLm5hbWUuc3BsaXQoXCIgXCIpWzNdIHx8IFwiXCIpO1xuXHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gKGQubmFtZS5zcGxpdChcIiBcIilbMV0gfHwgXCJcIikgKyBcIiBcIiArIChkLm5hbWUuc3BsaXQoXCIgXCIpWzJdIHx8IFwiXCIpO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR0ZXh0RW50ZXIuYXBwZW5kKFwidHNwYW5cIilcblx0XHRcdFx0XHQuYXR0cihcInhcIiwgMClcblx0XHRcdFx0XHQuYXR0cihcImR5XCIsIFwiMWVtXCIpXG5cdFx0XHRcdFx0LnRleHQoZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdGlmIChkLmRlcHRoID09IDMgJiYgZC5uYW1lICE9IHNwZWNpYWwxICYmIGQubmFtZSAhPSBzcGVjaWFsMiAmJiBkLm5hbWUgIT0gc3BlY2lhbDMgJiYgZC5uYW1lICE9IHNwZWNpYWw0KVxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gKGQubmFtZS5zcGxpdChcIiBcIilbNF0gfHwgXCJcIikgKyBcIiBcIiArIChkLm5hbWUuc3BsaXQoXCIgXCIpWzVdIHx8IFwiXCIpO1xuXHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gKGQubmFtZS5zcGxpdChcIiBcIilbM10gfHwgXCJcIikgKyBcIiBcIiArIChkLm5hbWUuc3BsaXQoXCIgXCIpWzRdIHx8IFwiXCIpOztcblx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRmdW5jdGlvbiBjbGljayhkKSB7XG5cdFx0XHRcdFx0Ly8gQ29udHJvbCBhcmMgdHJhbnNpdGlvblxuXHRcdFx0XHRcdHBhdGgudHJhbnNpdGlvbigpXG5cdFx0XHRcdFx0XHQuZHVyYXRpb24oZHVyYXRpb24pXG5cdFx0XHRcdFx0XHQuYXR0clR3ZWVuKFwiZFwiLCBhcmNUd2VlbihkKSk7XG5cblx0XHRcdFx0XHQvLyBTb21ld2hhdCBvZiBhIGhhY2sgYXMgd2UgcmVseSBvbiBhcmNUd2VlbiB1cGRhdGluZyB0aGUgc2NhbGVzLlxuXHRcdFx0XHRcdC8vIENvbnRyb2wgdGhlIHRleHQgdHJhbnNpdGlvblxuXHRcdFx0XHRcdHRleHQuc3R5bGUoXCJ2aXNpYmlsaXR5XCIsIGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBpc1BhcmVudE9mKGQsIGUpID8gbnVsbCA6IGQzLnNlbGVjdCh0aGlzKS5zdHlsZShcInZpc2liaWxpdHlcIik7XG5cdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0LnRyYW5zaXRpb24oKVxuXHRcdFx0XHRcdFx0LmR1cmF0aW9uKGR1cmF0aW9uKVxuXHRcdFx0XHRcdFx0LmF0dHJUd2VlbihcInRleHQtYW5jaG9yXCIsIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRcdFx0aWYgKGQuZGVwdGgpXG5cdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gXCJtaWRkbGVcIjtcblx0XHRcdFx0XHRcdFx0XHQvL34gcmV0dXJuIHgoZC54ICsgZC5keCAvIDIpID4gTWF0aC5QSSA/IFwiZW5kXCIgOiBcInN0YXJ0XCI7XG5cdFx0XHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIFwibWlkZGxlXCI7XG5cdFx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0LmF0dHJUd2VlbihcInRyYW5zZm9ybVwiLCBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0XHR2YXIgbXVsdGlsaW5lID0gKGQubmFtZSB8fCBcIlwiKS5zcGxpdChcIiBcIikubGVuZ3RoID4gMjtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdFx0XHR2YXIgbXVsdGlsaW5lID0gKGQubmFtZSB8fCBcIlwiKS5zcGxpdChcIiBcIikubGVuZ3RoID4gMixcblx0XHRcdFx0XHRcdFx0XHRcdGFuZ2xlQWxpZ24gPSAoZC54ID4gMC41ID8gMiA6IC0yKSxcblx0XHRcdFx0XHRcdFx0XHRcdGFuZ2xlID0geChkLnggKyBkLmR4IC8gMikgKiAxODAgLyBNYXRoLlBJIC0gOTAgKyAobXVsdGlsaW5lID8gYW5nbGVBbGlnbiA6IDApLFxuXHRcdFx0XHRcdFx0XHRcdFx0cm90YXRlID0gYW5nbGUgKyAobXVsdGlsaW5lID8gLS41IDogMCksXG5cdFx0XHRcdFx0XHRcdFx0XHR0cmFuc2wgPSAoeShkLnkpICsgY2lyY1BhZGRpbmcpICsgMzUsXG5cdFx0XHRcdFx0XHRcdFx0XHRzZWNBbmdsZSA9IChhbmdsZSA+IDkwID8gLTE4MCA6IDApO1xuXHRcdFx0XHRcdFx0XHRcdGlmIChkLm5hbWUgPT0gc3BlY2lhbDMgfHwgZC5uYW1lID09IHNwZWNpYWw0KSByb3RhdGUgKz0gMTtcblx0XHRcdFx0XHRcdFx0XHRpZiAoZC5kZXB0aCA9PSAwKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHR0cmFuc2wgPSAtMi41MDtcblx0XHRcdFx0XHRcdFx0XHRcdHJvdGF0ZSA9IDA7XG5cdFx0XHRcdFx0XHRcdFx0XHRzZWNBbmdsZSA9IDA7XG5cdFx0XHRcdFx0XHRcdFx0fSBlbHNlIGlmIChkLmRlcHRoID09IDEpIHRyYW5zbCArPSAtOTtcblx0XHRcdFx0XHRcdFx0XHRlbHNlIGlmIChkLmRlcHRoID09IDIpIHRyYW5zbCArPSAtNTtcblx0XHRcdFx0XHRcdFx0XHRlbHNlIGlmIChkLmRlcHRoID09IDMpIHRyYW5zbCArPSA0O1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBcInJvdGF0ZShcIiArIHJvdGF0ZSArIFwiKXRyYW5zbGF0ZShcIiArIHRyYW5zbCArIFwiKXJvdGF0ZShcIiArIHNlY0FuZ2xlICsgXCIpXCI7XG5cdFx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0LnN0eWxlKFwiZmlsbC1vcGFjaXR5XCIsIGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBpc1BhcmVudE9mKGQsIGUpID8gMSA6IDFlLTY7XG5cdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0LmVhY2goXCJlbmRcIiwgZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0XHRcdFx0ZDMuc2VsZWN0KHRoaXMpLnN0eWxlKFwidmlzaWJpbGl0eVwiLCBpc1BhcmVudE9mKGQsIGUpID8gbnVsbCA6IFwiaGlkZGVuXCIpO1xuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblxuXG5cdFx0XHRcdGZ1bmN0aW9uIGlzUGFyZW50T2YocCwgYykge1xuXHRcdFx0XHRcdGlmIChwID09PSBjKSByZXR1cm4gdHJ1ZTtcblx0XHRcdFx0XHRpZiAocC5jaGlsZHJlbikge1xuXHRcdFx0XHRcdFx0cmV0dXJuIHAuY2hpbGRyZW4uc29tZShmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gaXNQYXJlbnRPZihkLCBjKTtcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRmdW5jdGlvbiBzZXRDb2xvcihkKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGQuY29sb3I7XG5cdFx0XHRcdFx0aWYgKGQuY29sb3IpXG5cdFx0XHRcdFx0XHRyZXR1cm4gZC5jb2xvcjtcblx0XHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRcdHZhciB0aW50RGVjYXkgPSAwLjIwO1xuXHRcdFx0XHRcdFx0Ly8gRmluZCBjaGlsZCBudW1iZXJcblx0XHRcdFx0XHRcdHZhciB4ID0gMDtcblx0XHRcdFx0XHRcdHdoaWxlIChkLnBhcmVudC5jaGlsZHJlblt4XSAhPSBkKVxuXHRcdFx0XHRcdFx0XHR4Kys7XG5cdFx0XHRcdFx0XHR2YXIgdGludENoYW5nZSA9ICh0aW50RGVjYXkgKiAoeCArIDEpKS50b1N0cmluZygpO1xuXHRcdFx0XHRcdFx0cmV0dXJuIHB1c2hlci5jb2xvcihkLnBhcmVudC5jb2xvcikudGludCh0aW50Q2hhbmdlKS5odG1sKCdoZXg2Jyk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gSW50ZXJwb2xhdGUgdGhlIHNjYWxlcyFcblx0XHRcdFx0ZnVuY3Rpb24gYXJjVHdlZW4oZCkge1xuXHRcdFx0XHRcdHZhciBteSA9IG1heFkoZCksXG5cdFx0XHRcdFx0XHR4ZCA9IGQzLmludGVycG9sYXRlKHguZG9tYWluKCksIFtkLngsIGQueCArIGQuZHggLSAwLjAwMDldKSxcblx0XHRcdFx0XHRcdHlkID0gZDMuaW50ZXJwb2xhdGUoeS5kb21haW4oKSwgW2QueSwgbXldKSxcblx0XHRcdFx0XHRcdHlyID0gZDMuaW50ZXJwb2xhdGUoeS5yYW5nZSgpLCBbZC55ID8gMjAgOiAwLCByYWRpdXNdKTtcblxuXHRcdFx0XHRcdHJldHVybiBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGZ1bmN0aW9uICh0KSB7XG5cdFx0XHRcdFx0XHRcdHguZG9tYWluKHhkKHQpKTtcblx0XHRcdFx0XHRcdFx0eS5kb21haW4oeWQodCkpLnJhbmdlKHlyKHQpKTtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGFyYyhkKTtcblx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGZ1bmN0aW9uIG1heFkoZCkge1xuXHRcdFx0XHRcdHJldHVybiBkLmNoaWxkcmVuID8gTWF0aC5tYXguYXBwbHkoTWF0aCwgZC5jaGlsZHJlbi5tYXAobWF4WSkpIDogZC55ICsgZC5keTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fSk7XG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ1N1bmJ1cnN0Q3RybCcsIGZ1bmN0aW9uICgkc2NvcGUpIHtcblxuXHRcdCRzY29wZS5zZXRDaGFydCA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdCRzY29wZS5jaGFydCA9IHtcblx0XHRcdFx0b3B0aW9uczoge1xuXHRcdFx0XHRcdGNoYXJ0OiB7XG5cdFx0XHRcdFx0XHR0eXBlOiAnc3VuYnVyc3QnLFxuXHRcdFx0XHRcdFx0aGVpZ2h0OiA3MDAsXG5cdFx0XHRcdFx0XHRcInN1bmJ1cnN0XCI6IHtcblx0XHRcdFx0XHRcdFx0XCJkaXNwYXRjaFwiOiB7fSxcblx0XHRcdFx0XHRcdFx0XCJ3aWR0aFwiOiBudWxsLFxuXHRcdFx0XHRcdFx0XHRcImhlaWdodFwiOiBudWxsLFxuXHRcdFx0XHRcdFx0XHRcIm1vZGVcIjogXCJzaXplXCIsXG5cdFx0XHRcdFx0XHRcdFwiaWRcIjogMjA4OCxcblx0XHRcdFx0XHRcdFx0XCJkdXJhdGlvblwiOiA1MDAsXG5cdFx0XHRcdFx0XHRcdFwibWFyZ2luXCI6IHtcblx0XHRcdFx0XHRcdFx0XHRcInRvcFwiOiAwLFxuXHRcdFx0XHRcdFx0XHRcdFwicmlnaHRcIjogMCxcblx0XHRcdFx0XHRcdFx0XHRcImJvdHRvbVwiOiAwLFxuXHRcdFx0XHRcdFx0XHRcdFwibGVmdFwiOiAwXG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRcInRvb2x0aXBcIjoge1xuXHRcdFx0XHRcdFx0XHRcImR1cmF0aW9uXCI6IDAsXG5cdFx0XHRcdFx0XHRcdFwiZ3Jhdml0eVwiOiBcIndcIixcblx0XHRcdFx0XHRcdFx0XCJkaXN0YW5jZVwiOiAyNSxcblx0XHRcdFx0XHRcdFx0XCJzbmFwRGlzdGFuY2VcIjogMCxcblx0XHRcdFx0XHRcdFx0XCJjbGFzc2VzXCI6IG51bGwsXG5cdFx0XHRcdFx0XHRcdFwiY2hhcnRDb250YWluZXJcIjogbnVsbCxcblx0XHRcdFx0XHRcdFx0XCJmaXhlZFRvcFwiOiBudWxsLFxuXHRcdFx0XHRcdFx0XHRcImVuYWJsZWRcIjogdHJ1ZSxcblx0XHRcdFx0XHRcdFx0XCJoaWRlRGVsYXlcIjogNDAwLFxuXHRcdFx0XHRcdFx0XHRcImhlYWRlckVuYWJsZWRcIjogZmFsc2UsXG5cblx0XHRcdFx0XHRcdFx0XCJvZmZzZXRcIjoge1xuXHRcdFx0XHRcdFx0XHRcdFwibGVmdFwiOiAwLFxuXHRcdFx0XHRcdFx0XHRcdFwidG9wXCI6IDBcblx0XHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdFx0XCJoaWRkZW5cIjogdHJ1ZSxcblx0XHRcdFx0XHRcdFx0XCJkYXRhXCI6IG51bGwsXG5cdFx0XHRcdFx0XHRcdFwidG9vbHRpcEVsZW1cIjogbnVsbCxcblx0XHRcdFx0XHRcdFx0XCJpZFwiOiBcIm52dG9vbHRpcC05OTM0N1wiXG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSxcblx0XHRcdFx0ZGF0YTogW11cblx0XHRcdH07XG5cdFx0XHRyZXR1cm4gJHNjb3BlLmNoYXJ0O1xuXHRcdH1cblx0XHR2YXIgYnVpbGRUcmVlID0gZnVuY3Rpb24gKGRhdGEpIHtcblx0XHRcdHZhciBjaGlsZHJlbiA9IFtdO1xuXHRcdFx0YW5ndWxhci5mb3JFYWNoKGRhdGEsIGZ1bmN0aW9uIChpdGVtKSB7XG5cdFx0XHRcdHZhciBjaGlsZCA9IHtcblx0XHRcdFx0XHQnbmFtZSc6IGl0ZW0udGl0bGUsXG5cdFx0XHRcdFx0J3NpemUnOiBpdGVtLnNpemUsXG5cdFx0XHRcdFx0J2NvbG9yJzogaXRlbS5jb2xvcixcblx0XHRcdFx0XHQnY2hpbGRyZW4nOiBidWlsZFRyZWUoaXRlbS5jaGlsZHJlbilcblx0XHRcdFx0fTtcblx0XHRcdFx0aWYoaXRlbS5jb2xvcil7XG5cdFx0XHRcdFx0Y2hpbGQuY29sb3IgPSBpdGVtLmNvbG9yXG5cdFx0XHRcdH1cblx0XHRcdFx0aWYoaXRlbS5zaXplKXtcblx0XHRcdFx0XHRjaGlsZC5zaXplID0gaXRlbS5zaXplXG5cdFx0XHRcdH1cblx0XHRcdFx0Y2hpbGRyZW4ucHVzaChjaGlsZCk7XG5cdFx0XHR9KTtcblx0XHRcdHJldHVybiBjaGlsZHJlbjtcblx0XHR9O1xuXHRcdCRzY29wZS5jYWxjdWxhdGVHcmFwaCA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdHZhciBjaGFydERhdGEgPSB7XG5cdFx0XHRcdFwibmFtZVwiOiAkc2NvcGUuZGF0YS50aXRsZSxcblx0XHRcdFx0XCJjb2xvclwiOiAkc2NvcGUuZGF0YS5jb2xvcixcblx0XHRcdFx0XCJjaGlsZHJlblwiOiBidWlsZFRyZWUoJHNjb3BlLmRhdGEuY2hpbGRyZW4pLFxuXHRcdFx0XHRcInNpemVcIjogMVxuXHRcdFx0fTtcblx0XHRcdCRzY29wZS5jaGFydC5kYXRhID0gY2hhcnREYXRhO1xuXHRcdFx0cmV0dXJuIGNoYXJ0RGF0YTtcblx0XHR9O1xuXHRcdCRzY29wZS4kd2F0Y2goJ2RhdGEnLCBmdW5jdGlvbiAobiwgbykge1xuXHRcdFx0aWYgKCFuKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHRcdCRzY29wZS5jYWxjdWxhdGVHcmFwaCgpO1xuXHRcdH0pXG5cdH0pO1xuXG59KSgpO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
