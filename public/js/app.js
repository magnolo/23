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
		angular.module('app.controllers', ['ngAnimate','ui.tree','toastr','ui.router', 'md.data.table', 'ngMaterial', 'ngStorage', 'restangular', 'ngMdIcons', 'angular-loading-bar', 'ngMessages', 'ngSanitize', "leaflet-directive",'nvd3']);
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
			vm.data = $filter('orderBy')(vm.data, [vm.structure.score_field_name, "score"], true);
			rank = vm.data.indexOf(vm.current) + 1;
			vm.current[vm.structure.score_field_name+'_rank'] = rank;
			vm.circleOptions = {
					color:vm.structure.color,
					field:vm.structure.score_field_name+'_rank'
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
			console.log(vm.getRank(vm.current));
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
        vm.selectedResources =[];
        vm.sortedResources = [];
        vm.iso_errors = 0;
        vm.iso_checked = false;
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
          dropped:function(event){
            calcPercentage(vm.sortedResources);
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
            console.log(response);
            toastr.error('Please check your field selections', response.data.message);
          })
        }
        function saveData(){
          console.log(vm.meta.table);
          console.log(vm.meta.table, vm.data[0].data[0].length);
          return false;

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
        function toggleResource(resource){
          if(vm.selectedResources.indexOf(resource) > -1){
            vm.selectedResources.splice(vm.selectedResources.indexOf(resource), 1);
          }
          else{
            vm.selectedResources.push(resource);
          }
          angular.copy(vm.selectedResources, vm.sortedResources);
          angular.forEach(vm.sortedResources, function(res, key){
             vm.sortedResources[key].weight = parseInt(100 / vm.sortedResources.length);
             vm.sortedResources[key].nodes = [];
          });
          calcPercentage(vm.sortedResources);
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
                break;
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
												console.log(headings[i]);
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiLCJyb3V0ZXMuanMiLCJyb3V0ZXMucnVuLmpzIiwiY29uZmlnL2F1dGguanMiLCJjb25maWcvbG9hZGluZ19iYXIuanMiLCJjb25maWcvcmVzdGFuZ3VsYXIuanMiLCJjb25maWcvdGhlbWUuanMiLCJjb25maWcvdG9hc3RyLmpzIiwiZmlsdGVycy9hbHBoYW51bS5qcyIsImZpbHRlcnMvY2FwaXRhbGl6ZS5qcyIsImZpbHRlcnMvaHVtYW5fcmVhZGFibGUuanMiLCJmaWx0ZXJzL3RydW5jYXRlX2NoYXJhY3RlcnMuanMiLCJmaWx0ZXJzL3RydW5jYXRlX3dvcmRzLmpzIiwiZmlsdGVycy90cnVzdF9odG1sLmpzIiwiZmlsdGVycy91Y2ZpcnN0LmpzIiwic2VydmljZXMvVmVjdG9ybGF5ZXIuanMiLCJzZXJ2aWNlcy9kYXRhLmpzIiwic2VydmljZXMvZGlhbG9nLmpzIiwic2VydmljZXMvaWNvbnMuanMiLCJzZXJ2aWNlcy90b2FzdC5qcyIsImFwcC9oZWFkZXIvaGVhZGVyLmpzIiwiYXBwL2ltcG9ydGNzdi9pbXBvcnRjc3YuanMiLCJhcHAvaW5kZXgvaW5kZXguanMiLCJhcHAvaW5kZXgvaW5kZXhiYXNlLmpzIiwiYXBwL2luZGV4Y3JlYXRvci9pbmRleGNyZWF0b3IuanMiLCJhcHAvbG9naW4vbG9naW4uanMiLCJhcHAvbWFwL21hcC5qcyIsImFwcC9zZWxlY3RlZC9zZWxlY3RlZC5qcyIsImFwcC9zaWRlYmFyL3NpZGViYXIuanMiLCJhcHAvc2lnbnVwL3NpZ251cC5qcyIsImFwcC90b2FzdHMvdG9hc3RzLmpzIiwiYXBwL3Vuc3VwcG9ydGVkX2Jyb3dzZXIvdW5zdXBwb3J0ZWRfYnJvd3Nlci5qcyIsImFwcC91c2VyL3VzZXIuanMiLCJkaWFsb2dzL2FkZF91c2Vycy9hZGRfdXNlcnMuanMiLCJkaWFsb2dzL2VkaXRjb2x1bW4vZWRpdGNvbHVtbi5qcyIsImRpYWxvZ3MvZWRpdHJvdy9lZGl0cm93LmpzIiwiZGlhbG9ncy9sb29zZWRhdGEvbG9vc2VkYXRhLmpzIiwiZGlhbG9ncy9zZWxlY3Rpc29mZXRjaGVycy9zZWxlY3Rpc29mZXRjaGVycy5qcyIsImRpcmVjdGl2ZXMvYnViYmxlcy9idWJibGVzLmpzIiwiZGlyZWN0aXZlcy9idWJibGVzL2RlZmluaXRpb24uanMiLCJkaXJlY3RpdmVzL2NpcmNsZWdyYXBoL2NpcmNsZWdyYXBoLmpzIiwiZGlyZWN0aXZlcy9jaXJjbGVncmFwaC9kZWZpbml0aW9uLmpzIiwiZGlyZWN0aXZlcy9oaXN0b3J5L2RlZmluaXRpb24uanMiLCJkaXJlY3RpdmVzL2hpc3RvcnkvaGlzdG9yeS5qcyIsImRpcmVjdGl2ZXMvbWVkaWFuL2RlZmluaXRpb24uanMiLCJkaXJlY3RpdmVzL21lZGlhbi9tZWRpYW4uanMiLCJkaXJlY3RpdmVzL3BhcnNlY3N2L2RlZmluaXRpb24uanMiLCJkaXJlY3RpdmVzL3BhcnNlY3N2L3BhcnNlY3N2LmpzIiwiZGlyZWN0aXZlcy9zaW1wbGVsaW5lY2hhcnQvZGVmaW5pdGlvbi5qcyIsImRpcmVjdGl2ZXMvc2ltcGxlbGluZWNoYXJ0L3NpbXBsZWxpbmVjaGFydC5qcyIsImRpcmVjdGl2ZXMvc2xpZGVUb2dnbGUvZGVmaW5pdGlvbi5qcyIsImRpcmVjdGl2ZXMvc2xpZGVUb2dnbGUvc2xpZGVUb2dnbGUuanMiLCJkaXJlY3RpdmVzL3N1YmluZGV4L2RlZmluaXRpb24uanMiLCJkaXJlY3RpdmVzL3N1YmluZGV4L3N1YmluZGV4LmpzIiwiZGlyZWN0aXZlcy9zdW5idXJzdC9kZWZpbml0aW9uLmpzIiwiZGlyZWN0aXZlcy9zdW5idXJzdC9zdW5idXJzdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxJQUFBLE1BQUEsUUFBQSxPQUFBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7Ozs7RUFJQSxRQUFBLE9BQUEsY0FBQSxDQUFBLGFBQUEsYUFBQTtFQUNBLFFBQUEsT0FBQSxtQkFBQSxDQUFBLFlBQUEsVUFBQSxTQUFBLGFBQUEsaUJBQUEsY0FBQSxhQUFBLGVBQUEsYUFBQSx1QkFBQSxjQUFBLGNBQUEsb0JBQUE7RUFDQSxRQUFBLE9BQUEsZUFBQTtFQUNBLFFBQUEsT0FBQSxnQkFBQSxDQUFBLGFBQUEsYUFBQSxlQUFBO0VBQ0EsUUFBQSxPQUFBLGtCQUFBLENBQUEsYUFBQTtFQUNBLFFBQUEsT0FBQSxjQUFBOzs7O0FDbkJBLENBQUEsWUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxjQUFBLGdEQUFBLFVBQUEsZ0JBQUEsb0JBQUE7O0VBRUEsSUFBQSxVQUFBLFVBQUEsVUFBQTtHQUNBLE9BQUEsZ0JBQUEsV0FBQSxNQUFBLFdBQUE7OztFQUdBLG1CQUFBLFVBQUE7O0VBRUE7SUFDQSxNQUFBLE9BQUE7SUFDQSxVQUFBO0lBQ0EsT0FBQTtLQUNBLFFBQUE7TUFDQSxhQUFBLFFBQUE7TUFDQSxZQUFBO01BQ0EsY0FBQTs7S0FFQSxNQUFBO0tBQ0EsUUFBQTtNQUNBLGFBQUEsUUFBQTtNQUNBLFlBQUE7TUFDQSxjQUFBOzs7O0lBSUEsTUFBQSxZQUFBO0lBQ0EsS0FBQTtJQUNBLFVBQUE7OztJQUdBLE1BQUEsa0JBQUE7SUFDQSxLQUFBO0lBQ0EsT0FBQTtLQUNBLFNBQUE7TUFDQSxhQUFBLFFBQUE7TUFDQSxZQUFBO01BQ0EsY0FBQTs7Ozs7O0lBTUEsTUFBQSxvQkFBQTtJQUNBLEtBQUE7SUFDQSxPQUFBO0tBQ0EsU0FBQTtNQUNBLGFBQUEsUUFBQTtNQUNBLFlBQUE7TUFDQSxjQUFBO01BQ0EsU0FBQTtPQUNBLGtDQUFBLFVBQUEsYUFBQSxPQUFBO1FBQ0EsT0FBQSxZQUFBLE9BQUEsTUFBQTs7Ozs7OztJQU9BLE1BQUEsYUFBQTtJQUNBLFVBQUE7SUFDQSxLQUFBO0lBQ0EsT0FBQTtLQUNBLFNBQUE7TUFDQSxhQUFBLFFBQUE7TUFDQSxZQUFBO01BQ0EsY0FBQTs7OztJQUlBLE1BQUEsb0JBQUE7SUFDQSxLQUFBO0lBQ0EsT0FBQTtLQUNBLFFBQUE7OztLQUdBLFFBQUE7TUFDQSxhQUFBLFFBQUE7TUFDQSxZQUFBO01BQ0EsY0FBQTs7OztJQUlBLE1BQUEsMEJBQUE7SUFDQSxLQUFBOztJQUVBLE1BQUEseUJBQUE7SUFDQSxLQUFBOztJQUVBLE1BQUEsMEJBQUE7SUFDQSxLQUFBOztJQUVBLE1BQUEsa0JBQUE7SUFDQSxLQUFBO0lBQ0EsT0FBQTtLQUNBLFFBQUE7TUFDQSxhQUFBO01BQ0EsWUFBQTtNQUNBLGNBQUE7TUFDQSxTQUFBO09BQ0EsNkNBQUEsVUFBQSxhQUFBLGNBQUE7UUFDQSxJQUFBLElBQUEsWUFBQSxPQUFBLFdBQUEsYUFBQSxRQUFBO1FBQ0EsSUFBQSxJQUFBLFlBQUEsT0FBQSxXQUFBLGFBQUEsUUFBQTtRQUNBLE9BQUE7U0FDQSxZQUFBLEVBQUE7U0FDQSxlQUFBLEVBQUE7U0FDQSxNQUFBO1NBQ0EsU0FBQTs7Ozs7S0FLQSxZQUFBO01BQ0EsYUFBQTs7OztJQUlBLE1BQUEsMkJBQUE7SUFDQSxLQUFBOzs7Ozs7Ozs7Ozs7OztJQWNBLE1BQUEsbUNBQUE7SUFDQSxLQUFBOztJQUVBLE1BQUEsaUJBQUE7SUFDQSxLQUFBO0lBQ0EsTUFBQTtLQUNBLFVBQUE7O0lBRUEsT0FBQTtLQUNBLFNBQUE7TUFDQSxhQUFBLFFBQUE7O0tBRUEsT0FBQTs7Ozs7Ozs7O0FDbEpBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxjQUFBLGlDQUFBLFNBQUEsWUFBQSxXQUFBO0VBQ0EsV0FBQSxJQUFBLHFCQUFBLFNBQUEsT0FBQSxRQUFBOztHQUVBLElBQUEsUUFBQSxRQUFBLFFBQUEsS0FBQSxTQUFBO0lBQ0EsV0FBQSxlQUFBLFFBQUEsS0FBQTs7SUFFQSxXQUFBLGlCQUFBOztFQUVBLFdBQUEsSUFBQSxzQkFBQSxTQUFBLE9BQUEsUUFBQTs7OztFQUlBLFdBQUEsSUFBQSx1QkFBQSxTQUFBLE9BQUEsUUFBQTtHQUNBLFdBQUEsaUJBQUE7Ozs7OztBQ2hCQSxDQUFBLFdBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsY0FBQSx5QkFBQSxVQUFBLGNBQUE7OztRQUdBLGNBQUEsV0FBQTs7Ozs7QUNOQSxDQUFBLFdBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsY0FBQSxpQ0FBQSxVQUFBLHNCQUFBO0VBQ0Esc0JBQUEsaUJBQUE7Ozs7O0FDSkEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGNBQUEsZ0NBQUEsU0FBQSxxQkFBQTtFQUNBO0dBQ0EsV0FBQTtHQUNBLGtCQUFBLEVBQUEsUUFBQTs7Ozs7QUNOQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsY0FBQSw4QkFBQSxTQUFBLG9CQUFBOztDQUVBLElBQUEsY0FBQSxtQkFBQSxjQUFBLFFBQUE7SUFDQSxPQUFBO0VBQ0EsUUFBQTs7Q0FFQSxJQUFBLFdBQUEsbUJBQUEsY0FBQSxRQUFBO0lBQ0EsT0FBQTtFQUNBLFFBQUE7O0NBRUEsSUFBQSxVQUFBLG1CQUFBLGNBQUEsUUFBQTtJQUNBLE9BQUE7RUFDQSxRQUFBOztDQUVBLG1CQUFBLGNBQUEsWUFBQTtDQUNBLG1CQUFBLGNBQUEsYUFBQTtDQUNBLG1CQUFBLGNBQUEsU0FBQTtFQUNBLG1CQUFBLE1BQUE7R0FDQSxlQUFBO0dBQ0EsY0FBQTs7Ozs7QUN0QkEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLGNBQUEsd0JBQUEsU0FBQSxhQUFBOztRQUVBLFFBQUEsT0FBQSxjQUFBO1VBQ0EsYUFBQTtVQUNBLGFBQUE7VUFDQSxXQUFBO1VBQ0EsYUFBQTtVQUNBLGVBQUE7VUFDQSxtQkFBQTtVQUNBLHVCQUFBO1VBQ0EsUUFBQTtVQUNBLGFBQUE7Ozs7OztBQ2RBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxlQUFBLFFBQUEsWUFBQSxVQUFBO1FBQ0EsT0FBQSxVQUFBLE9BQUE7O1lBRUEsS0FBQSxDQUFBLE9BQUE7Y0FDQSxPQUFBOztZQUVBLE9BQUEsTUFBQSxRQUFBLGVBQUE7Ozs7Ozs7QUNUQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsZUFBQSxRQUFBLGNBQUEsVUFBQTtFQUNBLE9BQUEsU0FBQSxPQUFBLEtBQUE7R0FDQSxPQUFBLENBQUEsQ0FBQSxDQUFBLFNBQUEsTUFBQSxRQUFBLHNCQUFBLFNBQUEsSUFBQTtJQUNBLE9BQUEsSUFBQSxPQUFBLEdBQUEsZ0JBQUEsSUFBQSxPQUFBLEdBQUE7UUFDQTs7Ozs7QUNQQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsZUFBQSxRQUFBLGlCQUFBLFVBQUE7RUFDQSxPQUFBLFNBQUEsU0FBQSxLQUFBO0dBQ0EsS0FBQSxDQUFBLEtBQUE7SUFDQSxPQUFBOztHQUVBLElBQUEsUUFBQSxJQUFBLE1BQUE7R0FDQSxLQUFBLElBQUEsRUFBQSxHQUFBLEVBQUEsTUFBQSxRQUFBLEtBQUE7SUFDQSxNQUFBLEtBQUEsTUFBQSxHQUFBLE9BQUEsR0FBQSxnQkFBQSxNQUFBLEdBQUEsTUFBQTs7R0FFQSxPQUFBLE1BQUEsS0FBQTs7OztBQ1pBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxlQUFBLE9BQUEsc0JBQUEsWUFBQTtRQUNBLE9BQUEsVUFBQSxPQUFBLE9BQUEsYUFBQTtZQUNBLElBQUEsTUFBQSxRQUFBO2dCQUNBLE9BQUE7O1lBRUEsSUFBQSxTQUFBLEdBQUE7Z0JBQ0EsT0FBQTs7WUFFQSxJQUFBLFNBQUEsTUFBQSxTQUFBLE9BQUE7Z0JBQ0EsUUFBQSxNQUFBLFVBQUEsR0FBQTs7Z0JBRUEsSUFBQSxDQUFBLGFBQUE7b0JBQ0EsSUFBQSxZQUFBLE1BQUEsWUFBQTs7b0JBRUEsSUFBQSxjQUFBLENBQUEsR0FBQTt3QkFDQSxRQUFBLE1BQUEsT0FBQSxHQUFBOzt1QkFFQTtvQkFDQSxPQUFBLE1BQUEsT0FBQSxNQUFBLE9BQUEsT0FBQSxLQUFBO3dCQUNBLFFBQUEsTUFBQSxPQUFBLEdBQUEsTUFBQSxTQUFBOzs7Z0JBR0EsT0FBQSxRQUFBOztZQUVBLE9BQUE7Ozs7QUMzQkEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLGVBQUEsT0FBQSxpQkFBQSxZQUFBO1FBQ0EsT0FBQSxVQUFBLE9BQUEsT0FBQTtZQUNBLElBQUEsTUFBQSxRQUFBO2dCQUNBLE9BQUE7O1lBRUEsSUFBQSxTQUFBLEdBQUE7Z0JBQ0EsT0FBQTs7WUFFQSxJQUFBLE9BQUE7Z0JBQ0EsSUFBQSxhQUFBLE1BQUEsTUFBQTtnQkFDQSxJQUFBLFdBQUEsU0FBQSxPQUFBO29CQUNBLFFBQUEsV0FBQSxNQUFBLEdBQUEsT0FBQSxLQUFBLE9BQUE7OztZQUdBLE9BQUE7Ozs7QUNqQkEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGVBQUEsUUFBQSxzQkFBQSxVQUFBLE1BQUE7RUFDQSxPQUFBLFVBQUEsTUFBQTtHQUNBLE9BQUEsS0FBQSxZQUFBOzs7O0FDTEEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGVBQUEsT0FBQSxXQUFBLFdBQUE7RUFDQSxPQUFBLFVBQUEsUUFBQTtHQUNBLEtBQUEsQ0FBQSxPQUFBO0lBQ0EsT0FBQTs7R0FFQSxPQUFBLE1BQUEsVUFBQSxHQUFBLEdBQUEsZ0JBQUEsTUFBQSxVQUFBOzs7Ozs7QUNSQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsZ0JBQUEsUUFBQSxzQkFBQSxVQUFBOztRQUVBLE1BQUE7VUFDQSxLQUFBO1lBQ0EsT0FBQTs7VUFFQSxVQUFBLFNBQUEsRUFBQTtZQUNBLE9BQUEsS0FBQSxLQUFBLFFBQUE7O1VBRUEsVUFBQSxVQUFBO1lBQ0EsT0FBQSxLQUFBLEtBQUE7Ozs7Ozs7QUNiQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsZ0JBQUEsUUFBQSxlQUFBO0lBQ0EsWUFBQSxVQUFBLENBQUEsY0FBQTs7SUFFQSxTQUFBLFlBQUEsYUFBQSxPQUFBO1FBQ0EsT0FBQTtVQUNBLFFBQUE7VUFDQSxRQUFBO1VBQ0EsTUFBQTs7O1FBR0EsU0FBQSxPQUFBLE1BQUE7VUFDQSxJQUFBLE9BQUEsWUFBQSxJQUFBLE9BQUE7WUFDQSxLQUFBLEtBQUEsVUFBQSxJQUFBLFNBQUEsS0FBQTtjQUNBLE9BQUEsTUFBQSxLQUFBLFlBQUE7Y0FDQSxRQUFBLElBQUE7O1lBRUEsT0FBQTs7UUFFQSxTQUFBLE9BQUEsT0FBQSxHQUFBO1VBQ0EsT0FBQSxZQUFBLElBQUEsT0FBQSxJQUFBOztRQUVBLFNBQUEsS0FBQSxPQUFBLEtBQUE7VUFDQSxPQUFBLFlBQUEsSUFBQSxPQUFBLEtBQUE7Ozs7OztBQ3pCQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsZ0JBQUEsUUFBQSwrQkFBQSxTQUFBLFVBQUE7O0VBRUEsT0FBQTtHQUNBLGNBQUEsU0FBQSxVQUFBLE9BQUE7O0lBRUEsSUFBQSxVQUFBO0tBQ0EsYUFBQSxxQkFBQSxXQUFBLE1BQUEsV0FBQTs7O0lBR0EsSUFBQSxPQUFBO0tBQ0EsUUFBQSxRQUFBLE9BQUE7OztJQUdBLE9BQUEsVUFBQSxLQUFBOzs7R0FHQSxNQUFBLFVBQUE7SUFDQSxPQUFBLFVBQUE7OztHQUdBLE9BQUEsU0FBQSxPQUFBLFFBQUE7SUFDQSxVQUFBO0tBQ0EsVUFBQTtPQUNBLE1BQUE7T0FDQSxRQUFBO09BQ0EsR0FBQTs7OztHQUlBLFNBQUEsU0FBQSxPQUFBLFNBQUE7SUFDQSxPQUFBLFVBQUE7S0FDQSxVQUFBO09BQ0EsTUFBQTtPQUNBLFFBQUE7T0FDQSxHQUFBO09BQ0EsT0FBQTs7Ozs7O0FDdENBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxnQkFBQSxRQUFBLGdCQUFBLFVBQUE7UUFDQSxJQUFBLFdBQUE7VUFDQSxTQUFBO1VBQ0EsU0FBQTtVQUNBLFVBQUE7VUFDQSxhQUFBO1VBQ0EsU0FBQTtVQUNBLFFBQUE7VUFDQSxPQUFBO1VBQ0EsVUFBQTtVQUNBLE9BQUE7VUFDQSxRQUFBOztRQUVBLE9BQUE7VUFDQSxZQUFBLFNBQUEsS0FBQTtZQUNBLE9BQUEsU0FBQTs7Ozs7OztBQ2xCQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsZ0JBQUEsUUFBQSw2QkFBQSxTQUFBLFNBQUE7O0VBRUEsSUFBQSxRQUFBO0dBQ0EsV0FBQTtHQUNBLFNBQUE7O0VBRUEsT0FBQTtHQUNBLE1BQUEsU0FBQSxRQUFBO0lBQ0EsSUFBQSxDQUFBLFFBQUE7S0FDQSxPQUFBOzs7SUFHQSxPQUFBLFNBQUE7S0FDQSxTQUFBO09BQ0EsUUFBQTtPQUNBLFNBQUE7T0FDQSxPQUFBO09BQ0EsVUFBQTs7O0dBR0EsT0FBQSxTQUFBLFFBQUE7SUFDQSxJQUFBLENBQUEsUUFBQTtLQUNBLE9BQUE7OztJQUdBLE9BQUEsU0FBQTtLQUNBLFNBQUE7T0FDQSxRQUFBO09BQ0EsU0FBQTtPQUNBLE1BQUE7T0FDQSxPQUFBO09BQ0EsVUFBQTs7Ozs7O0FDbENBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLDBEQUFBLFNBQUEsUUFBQSxZQUFBLE9BQUEsT0FBQTs7RUFFQSxJQUFBLEtBQUE7RUFDQSxHQUFBLGtCQUFBO0VBQ0EsR0FBQSxXQUFBO0VBQ0EsR0FBQSxXQUFBOztFQUVBLFNBQUEsaUJBQUE7SUFDQSxPQUFBLE1BQUE7O0VBRUEsU0FBQSxVQUFBO0dBQ0EsR0FBQSxNQUFBLGtCQUFBO0lBQ0EsTUFBQSxTQUFBLEtBQUEsU0FBQSxLQUFBO0tBQ0EsT0FBQSxRQUFBO09BQ0EsTUFBQSxTQUFBLFNBQUE7Ozs7O0VBS0EsSUFBQTtJQUNBLFNBQUEsU0FBQSxhQUFBLElBQUE7TUFDQSxlQUFBO01BQ0EsWUFBQTtLQUNBO0VBQ0EsT0FBQSxPQUFBLFVBQUE7R0FDQSxPQUFBLFdBQUE7S0FDQSxTQUFBLFFBQUE7R0FDQSxPQUFBLGVBQUEsV0FBQTs7Ozs7OztBQzlCQSxDQUFBLFlBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSwrQkFBQSxVQUFBLFdBQUE7RUFDQSxLQUFBLFdBQUE7R0FDQSxhQUFBO0dBQ0EsV0FBQTtHQUNBLHlCQUFBO0dBQ0Esa0JBQUE7OztFQUdBLEtBQUEsZUFBQSxVQUFBLE1BQUEsSUFBQTtHQUNBLFVBQUEsS0FBQSxVQUFBO0tBQ0EsTUFBQTtLQUNBLFFBQUEsd0JBQUEsT0FBQTtLQUNBLEdBQUE7S0FDQSxZQUFBOzs7O0lBSUEsS0FBQSxnQkFBQSxXQUFBO0dBQ0EsVUFBQSxLQUFBOztLQUVBLGFBQUE7U0FDQSxrQkFBQTs7S0FFQSxLQUFBLFVBQUEsUUFBQTs7T0FFQSxZQUFBOzs7Ozs7Ozs7QUM1QkEsQ0FBQSxZQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEscUtBQUEsVUFBQSxRQUFBLFNBQUEsV0FBQSxTQUFBLFFBQUEsVUFBQSxjQUFBLG9CQUFBLGFBQUEsYUFBQSxhQUFBOztFQUVBLElBQUEsS0FBQTtFQUNBLEdBQUEsTUFBQTs7RUFFQSxHQUFBLGFBQUEsWUFBQTtFQUNBLEdBQUEsa0JBQUEsWUFBQTtFQUNBLEdBQUEsWUFBQTtFQUNBLEdBQUEsYUFBQSxtQkFBQTtFQUNBLEdBQUEsYUFBQTtFQUNBLEdBQUEsY0FBQTtFQUNBLEdBQUEsVUFBQTtFQUNBLEdBQUEsYUFBQTtFQUNBLEdBQUEsZUFBQTtFQUNBLEdBQUEsWUFBQTtFQUNBLEdBQUEsT0FBQTtFQUNBLEdBQUEsWUFBQTtFQUNBLEdBQUEsVUFBQTtHQUNBLFFBQUE7R0FDQSxXQUFBOztFQUVBLEdBQUEsVUFBQTtHQUNBLGFBQUE7Ozs7RUFJQSxHQUFBLGlCQUFBO0VBQ0EsR0FBQSxTQUFBO0VBQ0EsR0FBQSxXQUFBO0VBQ0EsR0FBQSxhQUFBO0VBQ0EsR0FBQSxxQkFBQTtFQUNBLEdBQUEsVUFBQTtFQUNBLEdBQUEsWUFBQTtFQUNBLEdBQUEsY0FBQTs7RUFFQSxHQUFBLGtCQUFBO0VBQ0EsR0FBQSxhQUFBO0VBQ0EsR0FBQSxhQUFBO0VBQ0EsR0FBQSxnQkFBQTtFQUNBLEdBQUEsbUJBQUE7RUFDQSxHQUFBLHFCQUFBO0VBQ0EsR0FBQSxpQkFBQTtFQUNBLEdBQUEsU0FBQTs7RUFFQSxHQUFBLFdBQUE7O0VBRUE7O0VBRUEsU0FBQSxXQUFBOztHQUVBLEdBQUEsZ0JBQUEsS0FBQSxTQUFBLFVBQUE7SUFDQSxHQUFBLFdBQUEsS0FBQSxTQUFBLEtBQUE7S0FDQSxHQUFBLE9BQUE7S0FDQSxHQUFBLFlBQUEsVUFBQTtLQUNBO0tBQ0E7S0FDQSxHQUFBLE9BQUEsT0FBQSxLQUFBO01BQ0EsR0FBQSxTQUFBLE9BQUEsT0FBQTtNQUNBOztLQUVBLEdBQUEsT0FBQSxPQUFBLFVBQUE7TUFDQSxHQUFBLE9BQUE7TUFDQSxHQUFBLFFBQUEsVUFBQSxLQUFBLEdBQUE7TUFDQSxHQUFBLFFBQUEsU0FBQTtNQUNBLFdBQUEsU0FBQTtNQUNBLElBQUEsWUFBQSxPQUFBLE9BQUEsVUFBQSxNQUFBO01BQ0EsUUFBQSxRQUFBLFdBQUEsU0FBQSxJQUFBO09BQ0EsR0FBQSxRQUFBLFVBQUEsS0FBQSxlQUFBOztNQUVBLFFBQUEsSUFBQSxHQUFBLFFBQUE7TUFDQSxVQUFBLEtBQUEsR0FBQSxRQUFBLEdBQUEsVUFBQTtNQUNBLFlBQUEsT0FBQSxnQkFBQSxXQUFBLEtBQUEsVUFBQSxNQUFBO09BQ0EsR0FBQSxPQUFBOzs7Ozs7OztFQVFBLFNBQUEsUUFBQTtHQUNBLFFBQUEsUUFBQTs7RUFFQSxTQUFBLGVBQUEsU0FBQTtHQUNBLElBQUEsV0FBQSxNQUFBLEdBQUEsY0FBQSxJQUFBO0lBQ0EsR0FBQSxhQUFBO1VBQ0E7SUFDQSxHQUFBLGFBQUE7O0dBRUEsR0FBQSxlQUFBLEdBQUEsYUFBQSxrQkFBQTtHQUNBO0VBQ0EsU0FBQSxTQUFBLE1BQUE7R0FDQSxHQUFBLFdBQUEsZUFBQTtHQUNBLGdCQUFBO0dBQ0E7O0VBRUEsU0FBQSxhQUFBO0dBQ0EsR0FBQSxZQUFBLENBQUEsR0FBQTtHQUNBLEdBQUEsWUFBQSxHQUFBLGFBQUEsT0FBQSxpQkFBQTs7RUFFQSxTQUFBLFdBQUEsS0FBQTtHQUNBLEdBQUEsVUFBQTtHQUNBLEdBQUE7R0FDQTs7RUFFQSxTQUFBLG1CQUFBLEtBQUE7R0FDQSxJQUFBLEdBQUEsV0FBQTtJQUNBLFNBQUEsWUFBQTtLQUNBLEdBQUEsVUFBQSxPQUFBLG1CQUFBLFNBQUEsR0FBQSxRQUFBLEdBQUEsVUFBQSxNQUFBLFdBQUE7OztHQUdBO0VBQ0EsU0FBQSxXQUFBO0dBQ0EsR0FBQSxDQUFBLEdBQUEsUUFBQTtJQUNBOztHQUVBLElBQUEsT0FBQTtHQUNBLFFBQUEsUUFBQSxHQUFBLE1BQUEsU0FBQSxNQUFBO0lBQ0EsS0FBQSxHQUFBLFVBQUEsb0JBQUEsV0FBQSxLQUFBLEdBQUEsVUFBQTtJQUNBLEtBQUEsV0FBQSxXQUFBLEtBQUE7O0dBRUEsR0FBQSxPQUFBLFFBQUEsV0FBQSxHQUFBLE1BQUEsQ0FBQSxHQUFBLFVBQUEsa0JBQUEsVUFBQTtHQUNBLE9BQUEsR0FBQSxLQUFBLFFBQUEsR0FBQSxXQUFBO0dBQ0EsR0FBQSxRQUFBLEdBQUEsVUFBQSxpQkFBQSxXQUFBO0dBQ0EsR0FBQSxnQkFBQTtLQUNBLE1BQUEsR0FBQSxVQUFBO0tBQ0EsTUFBQSxHQUFBLFVBQUEsaUJBQUE7O0dBRUEsT0FBQTs7RUFFQSxTQUFBLFFBQUEsUUFBQTs7R0FFQSxJQUFBLE9BQUEsR0FBQSxLQUFBLFFBQUEsV0FBQTtHQUNBLE9BQUE7O0VBRUEsU0FBQSxhQUFBO0dBQ0EsR0FBQSxPQUFBLENBQUEsR0FBQTtHQUNBOztFQUVBLFNBQUEsZ0JBQUE7R0FDQSxPQUFBLEdBQUEsVUFBQSxDQUFBLEdBQUE7R0FDQTtFQUNBLFNBQUEsZ0JBQUEsSUFBQTtHQUNBLFlBQUEsT0FBQSxXQUFBLEtBQUEsS0FBQSxVQUFBLE1BQUE7SUFDQSxHQUFBLFFBQUEsT0FBQSxLQUFBO0lBQ0EsZUFBQTs7O0VBR0EsU0FBQSxlQUFBLEtBQUE7R0FDQSxHQUFBLENBQUEsT0FBQSxPQUFBLFVBQUE7SUFDQSxZQUFBLE9BQUEsZ0JBQUEsQ0FBQSxNQUFBLEtBQUEsVUFBQSxNQUFBO0tBQ0EsR0FBQSxPQUFBOzs7Ozs7RUFNQSxTQUFBLGdCQUFBLE1BQUE7R0FDQSxJQUFBLFFBQUEsQ0FBQSxHQUFBLFFBQUEsVUFBQSxDQUFBLFFBQUEsR0FBQSxRQUFBLFFBQUE7SUFDQSxHQUFBOzs7O0VBSUEsU0FBQSxtQkFBQTtHQUNBLEdBQUEsUUFBQSxZQUFBLENBQUEsR0FBQTtHQUNBLEdBQUEsUUFBQSxTQUFBLENBQUEsR0FBQSxRQUFBO0dBQ0EsSUFBQSxHQUFBLFFBQUEsUUFBQTtJQUNBLEdBQUEsT0FBQTtJQUNBLFdBQUEsU0FBQTtJQUNBLEdBQUEsVUFBQSxRQUFBLGNBQUE7SUFDQSxHQUFBLFVBQUEsU0FBQTs7VUFFQTtJQUNBLFdBQUEsU0FBQTtJQUNBLFFBQUEsUUFBQSxHQUFBLFVBQUEsT0FBQSxtQkFBQSxVQUFBLFVBQUEsU0FBQTtLQUNBLFFBQUEsV0FBQTs7SUFFQSxHQUFBLFVBQUEsT0FBQSxtQkFBQSxTQUFBLEdBQUEsUUFBQSxHQUFBLFVBQUEsTUFBQSxXQUFBO0lBQ0EsR0FBQSxVQUFBLFFBQUEsY0FBQTtJQUNBLEdBQUEsVUFBQSxTQUFBO0lBQ0EsWUFBQSxPQUFBLGdCQUFBLENBQUEsR0FBQSxRQUFBLEdBQUEsVUFBQSxPQUFBLEtBQUEsVUFBQSxNQUFBO0tBQ0EsR0FBQSxPQUFBOztJQUVBLE9BQUEsR0FBQSwwQkFBQTtLQUNBLE1BQUEsT0FBQSxPQUFBO0tBQ0EsS0FBQSxPQUFBLE9BQUE7Ozs7R0FJQTs7RUFFQSxTQUFBLG1CQUFBLFNBQUE7R0FDQSxJQUFBLFFBQUE7R0FDQSxRQUFBLFFBQUEsR0FBQSxRQUFBLFdBQUEsVUFBQSxLQUFBLEtBQUE7SUFDQSxJQUFBLFdBQUEsT0FBQSxPQUFBLEdBQUEsU0FBQTtLQUNBLEdBQUEsUUFBQSxVQUFBLE9BQUEsS0FBQTtLQUNBLFFBQUE7OztHQUdBLElBQUEsQ0FBQSxPQUFBO0lBQ0EsR0FBQSxRQUFBLFVBQUEsS0FBQTtJQUNBO0dBQ0EsSUFBQSxPQUFBO0dBQ0EsSUFBQSxVQUFBO0dBQ0EsUUFBQSxRQUFBLEdBQUEsUUFBQSxXQUFBLFVBQUEsTUFBQSxLQUFBO0lBQ0EsS0FBQSxLQUFBLEtBQUEsR0FBQSxVQUFBO0lBQ0EsR0FBQSxLQUFBLEdBQUEsVUFBQSxRQUFBLEdBQUEsUUFBQSxHQUFBLFVBQUEsS0FBQTtLQUNBLFFBQUEsS0FBQSxLQUFBLEdBQUEsVUFBQTs7O0dBR0EsSUFBQSxLQUFBLFNBQUEsR0FBQTtJQUNBLFlBQUEsT0FBQSxnQkFBQSxNQUFBLEtBQUEsVUFBQSxNQUFBO0tBQ0EsR0FBQSxPQUFBOztJQUVBLE9BQUEsR0FBQSxrQ0FBQTtLQUNBLE9BQUEsT0FBQSxPQUFBO0tBQ0EsTUFBQSxPQUFBLE9BQUE7S0FDQSxVQUFBLFFBQUEsS0FBQTs7OztHQUlBLE9BQUEsQ0FBQTtHQUNBOztFQUVBLFNBQUEsWUFBQTtHQUNBLElBQUEsQ0FBQSxHQUFBLFNBQUE7SUFDQSxPQUFBOztHQUVBLFFBQUEsSUFBQSxHQUFBLFFBQUEsR0FBQTtHQUNBLE9BQUEsQ0FBQSxHQUFBLFFBQUEsR0FBQSxXQUFBLEtBQUE7R0FDQTs7RUFFQSxTQUFBLGNBQUE7R0FDQSxJQUFBLENBQUEsR0FBQSxTQUFBO0lBQ0EsT0FBQTs7R0FFQSxPQUFBLEdBQUEsUUFBQSxpQkFBQSxJQUFBLGtCQUFBO0dBQ0E7O0VBRUEsU0FBQSxPQUFBLEdBQUE7R0FDQSxHQUFBLFlBQUE7OztFQUdBLFNBQUEsVUFBQSxNQUFBO0dBQ0EsSUFBQSxRQUFBO0dBQ0EsUUFBQSxRQUFBLEtBQUEsVUFBQSxVQUFBLE1BQUE7SUFDQSxJQUFBLEtBQUEsZUFBQSxHQUFBLFFBQUEsWUFBQSxNQUFBO0tBQ0EsR0FBQSxhQUFBOztJQUVBLFVBQUE7O0dBRUEsT0FBQTs7O0VBR0EsU0FBQSxXQUFBO0dBQ0EsVUFBQSxHQUFBO0dBQ0E7O0VBRUEsU0FBQSxnQkFBQSxNQUFBO0dBQ0EsSUFBQSxTQUFBO0dBQ0EsUUFBQSxRQUFBLEdBQUEsTUFBQSxVQUFBLEtBQUE7SUFDQSxJQUFBLElBQUEsV0FBQSxNQUFBO0tBQ0EsU0FBQTs7O0dBR0EsT0FBQTtHQUNBOztFQUVBLFNBQUEsZUFBQSxLQUFBO0dBQ0EsSUFBQSxTQUFBO0dBQ0EsUUFBQSxRQUFBLEdBQUEsTUFBQSxVQUFBLEtBQUE7SUFDQSxJQUFBLElBQUEsR0FBQSxVQUFBLFFBQUEsS0FBQTtLQUNBLFNBQUE7Ozs7R0FJQSxPQUFBO0dBQ0E7O0VBRUEsU0FBQSxhQUFBLFFBQUE7O0dBRUEsR0FBQSxTQUFBLFNBQUEsY0FBQTtHQUNBLEdBQUEsT0FBQSxRQUFBO0dBQ0EsR0FBQSxPQUFBLFNBQUE7R0FDQSxHQUFBLE1BQUEsR0FBQSxPQUFBLFdBQUE7R0FDQSxJQUFBLFdBQUEsR0FBQSxJQUFBLHFCQUFBLEdBQUEsR0FBQSxLQUFBO0dBQ0EsU0FBQSxhQUFBLEdBQUE7R0FDQSxTQUFBLGFBQUEsTUFBQSxHQUFBLFVBQUEsU0FBQTtHQUNBLFNBQUEsYUFBQSxHQUFBO0dBQ0EsR0FBQSxJQUFBLFlBQUE7R0FDQSxHQUFBLElBQUEsU0FBQSxHQUFBLEdBQUEsS0FBQTtHQUNBLEdBQUEsVUFBQSxHQUFBLElBQUEsYUFBQSxHQUFBLEdBQUEsS0FBQSxHQUFBOzs7O0VBSUEsU0FBQSxhQUFBLE9BQUE7R0FDQSxJQUFBLFdBQUEsR0FBQSxJQUFBLHFCQUFBLEdBQUEsR0FBQSxLQUFBO0dBQ0EsU0FBQSxhQUFBLEdBQUE7R0FDQSxTQUFBLGFBQUEsTUFBQTtHQUNBLFNBQUEsYUFBQSxHQUFBO0dBQ0EsR0FBQSxJQUFBLFlBQUE7R0FDQSxHQUFBLElBQUEsU0FBQSxHQUFBLEdBQUEsS0FBQTtHQUNBLEdBQUEsVUFBQSxHQUFBLElBQUEsYUFBQSxHQUFBLEdBQUEsS0FBQSxHQUFBOztHQUVBOztFQUVBLFNBQUEsY0FBQSxTQUFBO0dBQ0EsSUFBQSxRQUFBO0dBQ0EsSUFBQSxNQUFBLFFBQUEsV0FBQTtHQUNBLElBQUEsU0FBQSxlQUFBO0dBQ0EsSUFBQSxRQUFBLEdBQUEsVUFBQSxvQkFBQTs7R0FFQSxRQUFBLElBQUEsR0FBQSxVQUFBO0dBQ0EsSUFBQSxXQUFBLFNBQUEsTUFBQSxNQUFBLE9BQUEsVUFBQTtHQUNBLElBQUEsUUFBQSxVQUFBLEdBQUEsUUFBQSxZQUFBLE9BQUEsR0FBQSxRQUFBLFdBQUEsS0FBQSxPQUFBLEdBQUEsUUFBQSxXQUFBLEtBQUEsTUFBQSxHQUFBLFFBQUEsV0FBQSxLQUFBO0dBQ0EsTUFBQSxRQUFBO0dBQ0EsTUFBQSxVQUFBO0lBQ0EsT0FBQTtJQUNBLE1BQUE7O0dBRUEsTUFBQSxXQUFBO0lBQ0EsT0FBQTtJQUNBLFNBQUE7S0FDQSxPQUFBO0tBQ0EsTUFBQTs7O0dBR0EsT0FBQTtHQUNBOztFQUVBLFNBQUEsZUFBQSxTQUFBOztHQUVBLElBQUEsUUFBQTtHQUNBLElBQUEsTUFBQSxRQUFBLFdBQUE7R0FDQSxJQUFBLFNBQUEsZUFBQTtHQUNBLElBQUEsUUFBQSxHQUFBLFVBQUEsb0JBQUE7R0FDQSxJQUFBLE9BQUEsUUFBQTtHQUNBLEdBQUEsT0FBQSxHQUFBLFFBQUEsR0FBQSxVQUFBLEtBQUE7S0FDQSxRQUFBLFdBQUE7OztHQUdBLFFBQUE7R0FDQSxLQUFBO0lBQ0EsSUFBQSxPQUFBLE9BQUEsVUFBQSxhQUFBOztLQUVBLElBQUEsV0FBQSxTQUFBLE1BQUEsTUFBQSxTQUFBLE9BQUEsV0FBQTtLQUNBLElBQUEsUUFBQSxVQUFBLEdBQUEsUUFBQSxZQUFBLE9BQUEsR0FBQSxRQUFBLFdBQUEsS0FBQSxPQUFBLEdBQUEsUUFBQSxXQUFBLEtBQUEsTUFBQSxHQUFBLFFBQUEsV0FBQSxLQUFBO0tBQ0EsTUFBQSxRQUFBLFVBQUEsR0FBQSxRQUFBLFlBQUEsT0FBQSxHQUFBLFFBQUEsV0FBQSxLQUFBLE9BQUEsR0FBQSxRQUFBLFdBQUEsS0FBQTtLQUNBLE1BQUEsVUFBQTtNQUNBLE9BQUE7TUFDQSxNQUFBOztLQUVBLE1BQUEsV0FBQTtNQUNBLE9BQUEsVUFBQSxHQUFBLFFBQUEsWUFBQSxPQUFBLEdBQUEsUUFBQSxXQUFBLEtBQUEsT0FBQSxHQUFBLFFBQUEsV0FBQSxLQUFBO01BQ0EsU0FBQTtPQUNBLE9BQUE7T0FDQSxNQUFBOzs7S0FHQTtXQUNBOztLQUVBLE1BQUEsUUFBQTtLQUNBLE1BQUEsVUFBQTtNQUNBLE9BQUE7TUFDQSxNQUFBOzs7O0dBSUEsSUFBQSxRQUFBLE1BQUEsU0FBQSw0QkFBQTtJQUNBLE1BQUEsY0FBQSxZQUFBO0tBQ0EsSUFBQSxRQUFBO01BQ0EsTUFBQSxRQUFBLFdBQUE7TUFDQSxVQUFBLENBQUEsS0FBQTtNQUNBLFVBQUE7O0tBRUEsT0FBQTs7O0dBR0EsT0FBQTtHQUNBOztFQUVBLE9BQUEsT0FBQSxjQUFBLFVBQUEsR0FBQSxHQUFBO0dBQ0EsSUFBQSxNQUFBLEdBQUE7SUFDQTs7R0FFQSxHQUFBLEVBQUEsR0FBQSxVQUFBLE1BQUE7SUFDQSxHQUFBLEVBQUEsR0FBQSxVQUFBLEtBQUE7S0FDQSxHQUFBLFVBQUEsT0FBQSxtQkFBQSxTQUFBLEVBQUEsR0FBQSxVQUFBLE1BQUEsV0FBQTs7SUFFQTtJQUNBLGdCQUFBLEVBQUEsR0FBQSxVQUFBO0lBQ0EsR0FBQSxVQUFBLE9BQUEsbUJBQUEsU0FBQSxFQUFBLEdBQUEsVUFBQSxNQUFBLFdBQUE7SUFDQSxHQUFBLE9BQUEsUUFBQSxRQUFBLDZCQUFBLE9BQUEsUUFBQSxRQUFBLGlCQUFBO0tBQ0EsT0FBQSxHQUFBLDJCQUFBO01BQ0EsT0FBQSxPQUFBLE9BQUE7TUFDQSxNQUFBLEVBQUEsR0FBQSxVQUFBOzs7VUFHQTtJQUNBLE9BQUEsR0FBQSxpQkFBQTtLQUNBLE9BQUEsT0FBQSxPQUFBOzs7O0VBSUEsT0FBQSxPQUFBLDBCQUFBLFVBQUEsR0FBQSxHQUFBO0dBQ0EsSUFBQSxNQUFBLEdBQUE7SUFDQTs7R0FFQSxJQUFBO0lBQ0EsYUFBQSxFQUFBO1FBQ0E7SUFDQSxhQUFBO0lBQ0E7R0FDQSxHQUFBOzs7Ozs7Ozs7Ozs7O0dBYUEsSUFBQSxHQUFBLFFBQUEsR0FBQSxVQUFBLE1BQUE7SUFDQSxHQUFBLE9BQUEsT0FBQSxVQUFBO0tBQ0EsT0FBQSxHQUFBLG1DQUFBO01BQ0EsT0FBQSxFQUFBO01BQ0EsTUFBQSxHQUFBLFFBQUEsR0FBQSxVQUFBO01BQ0EsV0FBQSxPQUFBLE9BQUE7OztRQUdBO0tBQ0EsT0FBQSxHQUFBLDJCQUFBO01BQ0EsT0FBQSxFQUFBO01BQ0EsTUFBQSxHQUFBLFFBQUEsR0FBQSxVQUFBOzs7VUFHQTtJQUNBLE9BQUEsR0FBQSxrQkFBQTtLQUNBLE9BQUEsRUFBQTs7Ozs7RUFLQSxPQUFBLE9BQUEsV0FBQSxVQUFBLEdBQUEsR0FBQTtHQUNBLElBQUEsTUFBQSxHQUFBO0lBQ0E7OztHQUdBLElBQUEsTUFBQSxDQUFBLEVBQUEsWUFBQSxHQUFBLEdBQUE7S0FDQSxDQUFBLEVBQUEsWUFBQSxHQUFBLEdBQUE7O0lBRUEsTUFBQSxDQUFBLEVBQUEsWUFBQSxHQUFBLEdBQUE7S0FDQSxDQUFBLEVBQUEsWUFBQSxHQUFBLEdBQUE7O0dBRUEsSUFBQSxZQUFBLEVBQUEsT0FBQSxFQUFBLFlBQUEsR0FBQSxHQUFBLElBQUEsRUFBQSxZQUFBLEdBQUEsR0FBQTtJQUNBLFlBQUEsRUFBQSxPQUFBLEVBQUEsWUFBQSxHQUFBLEdBQUEsSUFBQSxFQUFBLFlBQUEsR0FBQSxHQUFBO0lBQ0EsU0FBQSxFQUFBLGFBQUEsV0FBQTs7R0FFQSxJQUFBLE1BQUE7SUFDQSxDQUFBLEtBQUE7SUFDQSxDQUFBLEdBQUE7O0dBRUEsSUFBQSxHQUFBLFFBQUEsUUFBQTtJQUNBLE1BQUE7S0FDQSxDQUFBLEtBQUE7S0FDQSxDQUFBLEdBQUE7OztHQUdBLEdBQUEsSUFBQSxVQUFBLFFBQUE7SUFDQSxnQkFBQSxJQUFBO0lBQ0Esb0JBQUEsSUFBQTtJQUNBLFNBQUE7Ozs7RUFJQSxPQUFBLElBQUEsdUJBQUEsVUFBQSxPQUFBLFNBQUEsVUFBQSxXQUFBLFlBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7RUFrQ0EsU0FBQSxnQkFBQTtHQUNBLFlBQUEsT0FBQSxPQUFBLEtBQUEsVUFBQSxLQUFBO0lBQ0EsR0FBQSxNQUFBO0lBQ0EsR0FBQSxZQUFBLG1CQUFBO0lBQ0EsU0FBQSxZQUFBO0tBQ0EsR0FBQSxPQUFBLE9BQUEsVUFBQTtNQUNBLEdBQUEsVUFBQSxRQUFBLGNBQUE7TUFDQSxHQUFBLFVBQUEsU0FBQTtNQUNBLEdBQUEsVUFBQSxPQUFBLG1CQUFBLFNBQUEsR0FBQSxRQUFBLEdBQUEsVUFBQSxNQUFBLFdBQUE7TUFDQSxJQUFBLFlBQUEsT0FBQSxPQUFBLFVBQUEsTUFBQTtNQUNBLFFBQUEsUUFBQSxXQUFBLFNBQUEsSUFBQTtPQUNBLEdBQUEsVUFBQSxPQUFBLG1CQUFBLFNBQUEsS0FBQSxXQUFBOzs7O1NBSUE7TUFDQSxHQUFBLFVBQUEsU0FBQTtNQUNBLEdBQUEsT0FBQSxPQUFBLEtBQUE7UUFDQSxHQUFBLFVBQUEsT0FBQSxtQkFBQSxTQUFBLE9BQUEsT0FBQSxNQUFBLFdBQUE7Ozs7O0lBS0EsR0FBQSxVQUFBLFFBQUEsVUFBQSxVQUFBLEtBQUEsR0FBQTtLQUNBLElBQUEsQ0FBQSxHQUFBLFFBQUEsUUFBQTtNQUNBLElBQUEsSUFBQSxlQUFBLElBQUEsUUFBQSxXQUFBO01BQ0EsSUFBQSxPQUFBLEVBQUEsR0FBQSxVQUFBLHFCQUFBLGFBQUE7T0FDQSxHQUFBLFVBQUEsZUFBQSxJQUFBLFFBQUEsV0FBQTthQUNBO09BQ0EsYUFBQSxNQUFBOztZQUVBO01BQ0EsSUFBQSxJQUFBLGVBQUEsSUFBQSxRQUFBLFdBQUE7TUFDQSxJQUFBLE9BQUEsRUFBQSxHQUFBLFVBQUEscUJBQUEsYUFBQTtPQUNBLEdBQUEsbUJBQUE7YUFDQTtPQUNBLGFBQUEsTUFBQTs7Ozs7R0FLQTs7OztBQzlpQkEsQ0FBQSxZQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsc0NBQUEsVUFBQSxPQUFBLFFBQUE7O0lBRUEsT0FBQSxTQUFBOzs7O0FDTEEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsNkpBQUEsU0FBQSxPQUFBLFdBQUEsY0FBQSxhQUFBLFNBQUEsUUFBQSxTQUFBLGFBQUEsUUFBQSxtQkFBQTs7UUFFQSxJQUFBLEtBQUE7UUFDQSxHQUFBLE1BQUE7UUFDQSxHQUFBLE9BQUE7UUFDQSxHQUFBLFdBQUE7UUFDQSxHQUFBLFdBQUE7UUFDQSxHQUFBLGVBQUE7UUFDQSxHQUFBLG1CQUFBO1FBQ0EsR0FBQSxrQkFBQTtRQUNBLEdBQUEsYUFBQTtRQUNBLEdBQUEsY0FBQTtRQUNBLEdBQUEsZ0JBQUE7UUFDQSxHQUFBLE9BQUE7UUFDQSxHQUFBLFNBQUE7UUFDQSxHQUFBLGFBQUE7UUFDQSxHQUFBLGlCQUFBO1FBQ0EsR0FBQSxnQkFBQTtRQUNBLEdBQUEscUJBQUE7UUFDQSxHQUFBLGlCQUFBO1FBQ0EsR0FBQSxjQUFBO1FBQ0EsR0FBQSxzQkFBQTtRQUNBLEdBQUEsWUFBQTtRQUNBLEdBQUEsa0JBQUE7UUFDQSxHQUFBLGlCQUFBO1FBQ0EsR0FBQSxXQUFBO1FBQ0EsR0FBQSxVQUFBO1FBQ0EsR0FBQSxXQUFBO1FBQ0EsR0FBQSxnQkFBQTtRQUNBLEdBQUEsc0JBQUE7UUFDQSxHQUFBLG1CQUFBO1FBQ0EsR0FBQSxpQkFBQTtRQUNBLEdBQUEscUJBQUE7UUFDQSxHQUFBLHFCQUFBOztRQUVBLEdBQUEsT0FBQTtVQUNBLFdBQUE7VUFDQSxjQUFBO1VBQ0EsTUFBQTs7UUFFQSxHQUFBLFFBQUE7VUFDQSxRQUFBO1VBQ0EsT0FBQTtVQUNBLE9BQUE7VUFDQSxNQUFBOztRQUVBLEdBQUEsY0FBQTtVQUNBLFFBQUEsU0FBQSxNQUFBO1lBQ0EsZUFBQSxHQUFBOzs7OztRQUtBOztRQUVBLFNBQUEsVUFBQTtVQUNBOztRQUVBLFNBQUEsVUFBQSxPQUFBO1VBQ0EsT0FBQSxTQUFBLFdBQUE7O1FBRUEsU0FBQSxnQkFBQSxRQUFBO1NBQ0EsSUFBQSxRQUFBO2NBQ0EsTUFBQTtjQUNBLFNBQUE7VUFDQSxPQUFBO1VBQ0EsTUFBQTs7O1NBR0EsT0FBQTs7UUFFQSxTQUFBLFVBQUE7V0FDQSxZQUFBLE9BQUEsT0FBQSxLQUFBLFVBQUEsS0FBQTtjQUNBLEdBQUEsWUFBQSxtQkFBQTtjQUNBLFNBQUEsVUFBQTtnQkFDQSxHQUFBLFVBQUEsU0FBQTs7OztRQUlBLFNBQUEsT0FBQSxXQUFBO1VBQ0EsR0FBQSxTQUFBO1NBQ0E7UUFDQSxTQUFBLGNBQUEsT0FBQTtVQUNBLE9BQUEsR0FBQSxPQUFBLFFBQUEsV0FBQSxHQUFBLE1BQUEsQ0FBQSxRQUFBO1NBQ0E7UUFDQSxTQUFBLG1CQUFBLE1BQUEsT0FBQTs7O1NBR0E7UUFDQSxTQUFBLGVBQUEsS0FBQTtVQUNBLE9BQUEsS0FBQSxPQUFBLFNBQUEsSUFBQSxXQUFBOztRQUVBLFNBQUEsYUFBQTtVQUNBLFFBQUEsUUFBQSxHQUFBLE1BQUEsU0FBQSxLQUFBLElBQUE7WUFDQSxRQUFBLFFBQUEsSUFBQSxLQUFBLElBQUEsU0FBQSxNQUFBLEVBQUE7Y0FDQSxHQUFBLE1BQUEsU0FBQSxPQUFBLEVBQUE7Z0JBQ0EsR0FBQSxLQUFBLFdBQUEsaUJBQUEsUUFBQSxPQUFBLEtBQUEsS0FBQSxXQUFBLGNBQUEsUUFBQSxTQUFBLENBQUEsRUFBQTtrQkFDQSxHQUFBLEtBQUEsS0FBQSxLQUFBLEdBQUEsS0FBQTtrQkFDQSxHQUFBO2tCQUNBLElBQUEsT0FBQSxPQUFBLEVBQUE7OztjQUdBLFFBQUE7Z0JBQ0EsS0FBQTtzQkFDQSxHQUFBLEtBQUEsS0FBQSxLQUFBLEdBQUEsT0FBQTtrQkFDQTtnQkFDQSxLQUFBO3dCQUNBLEdBQUEsS0FBQSxLQUFBLEtBQUEsR0FBQSxPQUFBO29CQUNBO2dCQUNBLEtBQUE7d0JBQ0EsR0FBQSxLQUFBLEtBQUEsS0FBQSxHQUFBLE9BQUE7b0JBQ0E7Z0JBQ0EsS0FBQTt3QkFDQSxHQUFBLEtBQUEsS0FBQSxLQUFBLEdBQUEsT0FBQTtvQkFDQTtnQkFDQTtrQkFDQTs7O1lBR0EsR0FBQSxDQUFBLElBQUEsS0FBQSxHQUFBLEdBQUEsS0FBQSxXQUFBO2NBQ0EsR0FBQTtjQUNBLEdBQUE7Y0FDQSxJQUFBLE9BQUEsS0FBQTtnQkFDQSxLQUFBO2dCQUNBLFFBQUE7Z0JBQ0EsUUFBQSxHQUFBLEtBQUE7Ozs7O1FBS0EsU0FBQSxnQkFBQSxJQUFBO1VBQ0EsR0FBQSxPQUFBLEdBQUEsS0FBQSxNQUFBLFFBQUEsWUFBQTtZQUNBLEdBQUEsR0FBQSxLQUFBLE1BQUEsS0FBQSxNQUFBO2NBQ0EsT0FBQTs7O1VBR0EsT0FBQTs7UUFFQSxTQUFBLGVBQUEsR0FBQSxJQUFBO1VBQ0EsR0FBQSxTQUFBO1VBQ0EsY0FBQSxhQUFBLGNBQUE7O1FBRUEsU0FBQSxnQkFBQTtVQUNBLFFBQUEsUUFBQSxHQUFBLFVBQUEsU0FBQSxNQUFBLElBQUE7WUFDQSxRQUFBLFFBQUEsS0FBQSxRQUFBLFNBQUEsT0FBQSxFQUFBO2NBQ0EsR0FBQSxNQUFBLFFBQUEsRUFBQTtnQkFDQSxHQUFBOztjQUVBLEdBQUE7O1lBRUEsR0FBQSxLQUFBLE9BQUEsR0FBQSxLQUFBLFFBQUEsT0FBQTtZQUNBLEdBQUEsU0FBQSxPQUFBLEtBQUE7O1VBRUEsR0FBQSxHQUFBLEtBQUEsVUFBQSxFQUFBO1lBQ0EsR0FBQTtZQUNBLE9BQUEsSUFBQTs7O1FBR0EsU0FBQSxTQUFBO1VBQ0EsR0FBQSxNQUFBLEdBQUEsU0FBQTtVQUNBLGNBQUEsYUFBQSxXQUFBOztRQUVBLFNBQUEsWUFBQTtVQUNBLEdBQUEsT0FBQTs7UUFFQSxTQUFBLFVBQUE7VUFDQSxHQUFBLENBQUEsR0FBQSxLQUFBLFVBQUE7WUFDQSxPQUFBLE1BQUEsMENBQUE7WUFDQSxPQUFBOztVQUVBLEdBQUEsQ0FBQSxHQUFBLEtBQUEsY0FBQTtZQUNBLE9BQUEsTUFBQSw4Q0FBQTtZQUNBLE9BQUE7O1VBRUEsR0FBQSxHQUFBLEtBQUEsaUJBQUEsR0FBQSxLQUFBLFVBQUE7WUFDQSxPQUFBLE1BQUEsbURBQUE7WUFDQSxPQUFBOzs7VUFHQSxHQUFBLFdBQUE7VUFDQSxHQUFBLFdBQUE7VUFDQSxJQUFBLFVBQUE7VUFDQSxRQUFBLFFBQUEsR0FBQSxNQUFBLFNBQUEsTUFBQSxJQUFBO2NBQ0EsUUFBQSxLQUFBO2dCQUNBLEtBQUEsS0FBQSxLQUFBLEdBQUEsR0FBQSxLQUFBO2dCQUNBLE1BQUEsS0FBQSxLQUFBLEdBQUEsR0FBQSxLQUFBOzs7VUFHQSxZQUFBLEtBQUEsdUJBQUEsQ0FBQSxLQUFBLFVBQUEsS0FBQSxTQUFBLFNBQUE7Y0FDQSxRQUFBLFFBQUEsU0FBQSxNQUFBLFNBQUEsU0FBQSxJQUFBO2dCQUNBLFFBQUEsUUFBQSxHQUFBLE1BQUEsU0FBQSxNQUFBLEVBQUE7b0JBQ0EsR0FBQSxRQUFBLFFBQUEsS0FBQSxLQUFBLEdBQUEsR0FBQSxLQUFBLGVBQUE7c0JBQ0EsR0FBQSxRQUFBLEtBQUEsU0FBQSxFQUFBO3dCQUNBLElBQUEsV0FBQTswQkFDQSxPQUFBOzBCQUNBLFNBQUEsUUFBQTs7d0JBRUEsR0FBQSxTQUFBLEtBQUE7OzBCQUVBO3dCQUNBLEdBQUEsT0FBQSxRQUFBLEtBQUEsTUFBQSxZQUFBOzBCQUNBLEdBQUEsS0FBQSxHQUFBLEtBQUEsR0FBQSxHQUFBLEtBQUEsYUFBQSxRQUFBLEtBQUEsR0FBQTswQkFDQSxHQUFBLEtBQUEsR0FBQSxLQUFBLEdBQUEsR0FBQSxLQUFBLGlCQUFBLFFBQUEsS0FBQSxHQUFBOzBCQUNBLEdBQUEsS0FBQSxPQUFBLE9BQUE7NEJBQ0EsUUFBQSxRQUFBLEtBQUEsUUFBQSxTQUFBLE9BQUEsRUFBQTs4QkFDQSxHQUFBLE1BQUEsUUFBQSxFQUFBO2dDQUNBLEdBQUE7Z0NBQ0EsR0FBQTtnQ0FDQSxLQUFBLE9BQUEsT0FBQSxHQUFBOzs7Ozs0QkFLQTswQkFDQSxRQUFBLElBQUE7Ozs7OztjQU1BLEdBQUEsR0FBQSxTQUFBLE9BQUE7Z0JBQ0EsY0FBQSxhQUFBLHFCQUFBOztjQUVBLEdBQUEsY0FBQTthQUNBLFNBQUEsU0FBQTtZQUNBLFFBQUEsSUFBQTtZQUNBLE9BQUEsTUFBQSxzQ0FBQSxTQUFBLEtBQUE7OztRQUdBLFNBQUEsVUFBQTtVQUNBLFFBQUEsSUFBQSxHQUFBLEtBQUE7VUFDQSxRQUFBLElBQUEsR0FBQSxLQUFBLE9BQUEsR0FBQSxLQUFBLEdBQUEsS0FBQSxHQUFBO1VBQ0EsT0FBQTs7VUFFQSxJQUFBLGFBQUEsQ0FBQSxLQUFBO1VBQ0EsSUFBQSxPQUFBLElBQUEsU0FBQTtVQUNBLFFBQUEsUUFBQSxHQUFBLE1BQUEsU0FBQSxNQUFBLElBQUE7WUFDQSxHQUFBLEtBQUEsT0FBQSxVQUFBLEVBQUE7Y0FDQSxLQUFBLEtBQUEsR0FBQSxPQUFBLEdBQUEsS0FBQTtjQUNBLFdBQUEsS0FBQSxLQUFBLEtBQUEsS0FBQTs7Z0JBRUE7Y0FDQSxPQUFBLE1BQUEsK0JBQUE7Y0FDQTs7O1VBR0EsUUFBQSxRQUFBLEdBQUEsS0FBQSxHQUFBLEtBQUEsSUFBQSxTQUFBLE1BQUEsSUFBQTtZQUNBLEdBQUEsR0FBQSxLQUFBLE1BQUEsS0FBQTtjQUNBLElBQUEsUUFBQTtnQkFDQSxVQUFBO2dCQUNBLFFBQUEsR0FBQSxLQUFBLE1BQUEsS0FBQTtnQkFDQSxjQUFBLEdBQUEsS0FBQSxNQUFBLEtBQUE7O2NBRUEsT0FBQSxLQUFBOzs7VUFHQSxRQUFBLFFBQUEsR0FBQSxLQUFBLE9BQUEsU0FBQSxNQUFBLElBQUE7WUFDQSxLQUFBLEtBQUE7Y0FDQSxNQUFBO2NBQ0EsTUFBQTs7O1VBR0EsR0FBQSxLQUFBLFNBQUE7VUFDQSxHQUFBLEtBQUEsT0FBQTs7VUFFQSxZQUFBLEtBQUEsZUFBQSxHQUFBLE1BQUEsS0FBQSxTQUFBLFNBQUE7Y0FDQSxZQUFBLEtBQUEsZUFBQSxTQUFBLEtBQUEsV0FBQSxXQUFBLFlBQUEsS0FBQSxTQUFBLElBQUE7Z0JBQ0EsR0FBQSxJQUFBLFFBQUEsS0FBQTtrQkFDQSxPQUFBLFFBQUEsV0FBQSxLQUFBLE9BQUEsc0JBQUEsR0FBQSxLQUFBLEtBQUE7a0JBQ0EsR0FBQSxPQUFBO2tCQUNBLEdBQUEsT0FBQTs7O2FBR0EsU0FBQSxTQUFBO1lBQ0EsR0FBQSxTQUFBLFFBQUE7Y0FDQSxPQUFBLE1BQUEsU0FBQSxTQUFBOzs7O1FBSUEsU0FBQSxxQkFBQTtVQUNBLEdBQUEsZ0JBQUEsQ0FBQSxHQUFBO1VBQ0EsR0FBQSxHQUFBLGNBQUE7WUFDQSxHQUFBOzs7UUFHQSxTQUFBLGVBQUE7O1VBRUEsR0FBQSxDQUFBLEdBQUEsVUFBQTtZQUNBLFlBQUEsT0FBQSxlQUFBLEtBQUEsU0FBQSxTQUFBO2NBQ0EsR0FBQSxZQUFBO2NBQ0EsR0FBQSxvQkFBQSxJQUFBLEdBQUEsa0JBQUE7Ozs7O1FBS0EsU0FBQSxpQkFBQSxTQUFBO1VBQ0EsT0FBQSxHQUFBLGtCQUFBLFFBQUEsWUFBQSxDQUFBLElBQUEsT0FBQTs7UUFFQSxTQUFBLGVBQUEsU0FBQTtVQUNBLEdBQUEsR0FBQSxrQkFBQSxRQUFBLFlBQUEsQ0FBQSxFQUFBO1lBQ0EsR0FBQSxrQkFBQSxPQUFBLEdBQUEsa0JBQUEsUUFBQSxXQUFBOztjQUVBO1lBQ0EsR0FBQSxrQkFBQSxLQUFBOztVQUVBLFFBQUEsS0FBQSxHQUFBLG1CQUFBLEdBQUE7VUFDQSxRQUFBLFFBQUEsR0FBQSxpQkFBQSxTQUFBLEtBQUEsSUFBQTthQUNBLEdBQUEsZ0JBQUEsS0FBQSxTQUFBLFNBQUEsTUFBQSxHQUFBLGdCQUFBO2FBQ0EsR0FBQSxnQkFBQSxLQUFBLFFBQUE7O1VBRUEsZUFBQSxHQUFBOztRQUVBLFNBQUEsZUFBQSxNQUFBO1VBQ0EsUUFBQSxRQUFBLE9BQUEsU0FBQSxNQUFBLElBQUE7WUFDQSxNQUFBLEtBQUEsU0FBQSxTQUFBLE1BQUEsTUFBQTtZQUNBLGVBQUEsTUFBQTs7O1FBR0EsU0FBQSxtQkFBQSxLQUFBO1VBQ0EsUUFBQSxJQUFBOztRQUVBLFNBQUEsbUJBQUEsS0FBQTtVQUNBLFFBQUEsSUFBQTs7UUFFQSxPQUFBLElBQUEscUJBQUEsVUFBQSxPQUFBLFNBQUEsVUFBQSxXQUFBLFlBQUE7VUFDQSxRQUFBLFFBQUE7WUFDQSxLQUFBO2NBQ0E7WUFDQSxLQUFBO2dCQUNBLEdBQUEsQ0FBQSxHQUFBLEtBQUEsVUFBQTtrQkFDQSxPQUFBLE1BQUEsbUNBQUE7a0JBQ0EsTUFBQTttQkFDQSxXQUFBLGlCQUFBOztnQkFFQTtZQUNBLEtBQUE7Y0FDQTtZQUNBO2dCQUNBLEdBQUEsR0FBQSxLQUFBLE9BQUE7a0JBQ0EsT0FBQSxVQUFBO2tCQUNBLGNBQUEsYUFBQSxhQUFBLFFBQUEsR0FBQTtrQkFDQSxNQUFBO2tCQUNBLFdBQUEsaUJBQUE7O2NBRUE7OztRQUdBLE9BQUEsSUFBQSx1QkFBQSxVQUFBLE9BQUEsU0FBQSxVQUFBLFdBQUEsWUFBQTtVQUNBLEdBQUEsQ0FBQSxHQUFBLEtBQUEsT0FBQTtZQUNBLE9BQUEsR0FBQTs7Y0FFQTtZQUNBLFFBQUEsUUFBQTtjQUNBLEtBQUE7a0JBQ0EsR0FBQSxPQUFBO2dCQUNBO2NBQ0EsS0FBQTtrQkFDQSxHQUFBLE9BQUE7a0JBQ0EsR0FBQSxzQkFBQTtnQkFDQTtjQUNBLEtBQUE7a0JBQ0EsR0FBQSxPQUFBO2tCQUNBO2NBQ0EsS0FBQTtrQkFDQSxHQUFBLE9BQUE7a0JBQ0E7Y0FDQTtnQkFDQTs7Ozs7Ozs7QUNsWEEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsMkNBQUEsU0FBQSxRQUFBLE9BQUEsT0FBQTtRQUNBLElBQUEsS0FBQTtRQUNBLEdBQUEsVUFBQTtRQUNBLEdBQUEsZ0JBQUE7UUFDQSxHQUFBLE9BQUE7VUFDQSxNQUFBO1VBQ0EsU0FBQTs7O1FBR0E7O1FBRUEsU0FBQSxVQUFBO1VBQ0EsR0FBQTs7O1FBR0EsU0FBQSxlQUFBOztVQUVBLEdBQUEsTUFBQSxrQkFBQTs7OztRQUlBLFNBQUEsU0FBQTtVQUNBLE1BQUEsTUFBQSxHQUFBLE1BQUEsS0FBQSxTQUFBLFNBQUE7WUFDQSxPQUFBLFFBQUE7WUFDQSxPQUFBLEdBQUEsaUJBQUEsQ0FBQSxNQUFBO2FBQ0EsTUFBQSxTQUFBLFNBQUE7WUFDQSxPQUFBLE1BQUEsd0NBQUE7Ozs7Ozs7QUM3QkEsQ0FBQSxZQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsaURBQUEsVUFBQSxhQUFBLG9CQUFBOztFQUVBLElBQUEsS0FBQTtFQUNBLElBQUEsU0FBQTtFQUNBLEdBQUEsV0FBQTtHQUNBLGlCQUFBOztFQUVBLEdBQUEsU0FBQTtHQUNBLEtBQUE7R0FDQSxLQUFBO0dBQ0EsTUFBQTs7RUFFQSxHQUFBLFNBQUE7R0FDQSxZQUFBO0lBQ0EsS0FBQTtLQUNBLE1BQUE7S0FDQSxLQUFBLHNGQUFBO0tBQ0EsTUFBQTs7OztFQUlBLFlBQUEsT0FBQSxPQUFBLEtBQUEsU0FBQSxLQUFBO0dBQ0EsSUFBQSxNQUFBO0dBQ0EsSUFBQSxRQUFBLElBQUEsRUFBQSxVQUFBLFVBQUE7SUFDQSxLQUFBO0lBQ0EsT0FBQTtJQUNBLGlCQUFBLENBQUE7SUFDQSxhQUFBO0lBQ0Esc0JBQUEsU0FBQSxTQUFBO0tBQ0EsT0FBQSxRQUFBLFdBQUE7O0lBRUEsUUFBQSxTQUFBLFNBQUEsU0FBQTtLQUNBLE9BQUE7OztJQUdBLElBQUEsU0FBQSxtQkFBQSxTQUFBO0lBQ0EsSUFBQSxjQUFBLEVBQUEsVUFBQSxtRkFBQTtJQUNBLElBQUEsU0FBQTtJQUNBLFlBQUE7Ozs7O0FDekNBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLDBFQUFBLFNBQUEsUUFBQSxZQUFBLG9CQUFBLFFBQUE7O1FBRUEsSUFBQSxLQUFBO1FBQ0EsR0FBQSxZQUFBLE9BQUEsUUFBQSxHQUFBO1FBQ0EsR0FBQSxVQUFBLE9BQUEsUUFBQSxHQUFBO1FBQ0EsR0FBQSxPQUFBLE9BQUEsUUFBQSxHQUFBO1FBQ0EsR0FBQSxVQUFBO1FBQ0EsR0FBQSxZQUFBLG1CQUFBO1FBQ0EsR0FBQSxVQUFBO1FBQ0EsR0FBQSxZQUFBO1FBQ0EsR0FBQSxjQUFBOztRQUVBLFNBQUEsV0FBQTtVQUNBLElBQUEsT0FBQTtVQUNBLFFBQUEsUUFBQSxHQUFBLE1BQUEsU0FBQSxNQUFBO1lBQ0EsS0FBQSxHQUFBLFVBQUEsb0JBQUEsV0FBQSxLQUFBLEdBQUEsVUFBQTtZQUNBLEtBQUEsV0FBQSxTQUFBLEtBQUE7O1VBRUEsSUFBQSxTQUFBLFFBQUEsV0FBQSxHQUFBLE1BQUEsQ0FBQSxHQUFBLFVBQUEsa0JBQUEsVUFBQTtVQUNBLEtBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxPQUFBLFFBQUEsS0FBQTtZQUNBLElBQUEsT0FBQSxHQUFBLE9BQUEsR0FBQSxRQUFBLEtBQUE7Y0FDQSxPQUFBLElBQUE7OztVQUdBLEdBQUEsUUFBQSxHQUFBLFVBQUEsaUJBQUEsV0FBQTtVQUNBLEdBQUEsZ0JBQUE7Y0FDQSxNQUFBLEdBQUEsVUFBQTtjQUNBLE1BQUEsR0FBQSxVQUFBLGlCQUFBOzs7UUFHQSxTQUFBLFFBQUEsUUFBQTtVQUNBLElBQUEsU0FBQSxRQUFBLFdBQUEsR0FBQSxNQUFBLENBQUEsR0FBQSxVQUFBLGtCQUFBLFVBQUE7VUFDQSxJQUFBLE9BQUE7VUFDQSxRQUFBLFFBQUEsUUFBQSxTQUFBLE1BQUEsSUFBQTtZQUNBLEdBQUEsS0FBQSxXQUFBLFFBQUEsUUFBQTtjQUNBLE9BQUE7OztVQUdBLE9BQUEsS0FBQTs7UUFFQSxTQUFBLFlBQUE7T0FDQSxJQUFBLENBQUEsR0FBQSxTQUFBO1FBQ0EsT0FBQTs7T0FFQSxPQUFBLENBQUEsR0FBQSxRQUFBLEdBQUEsV0FBQSxLQUFBO09BQ0E7O01BRUEsU0FBQSxjQUFBO09BQ0EsSUFBQSxDQUFBLEdBQUEsU0FBQTtRQUNBLE9BQUE7O09BRUEsT0FBQSxHQUFBLFFBQUEsaUJBQUEsSUFBQSxrQkFBQTtPQUNBOztRQUVBLE9BQUEsT0FBQSxjQUFBLFVBQUEsR0FBQSxHQUFBO1VBQ0EsSUFBQSxNQUFBLEdBQUE7WUFDQTs7O1lBR0EsR0FBQSxFQUFBLElBQUE7Y0FDQSxHQUFBLFVBQUEsT0FBQSxtQkFBQSxTQUFBLEVBQUEsS0FBQSxXQUFBOztZQUVBO1lBQ0EsZ0JBQUEsRUFBQTs7Ozs7Ozs7O0FDbEVBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLG9DQUFBLFNBQUEsUUFBQSxPQUFBOzs7Ozs7QUNIQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSxjQUFBLFVBQUE7Ozs7OztBQ0hBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLHlDQUFBLFNBQUEsUUFBQSxhQUFBOztFQUVBLE9BQUEsZUFBQSxVQUFBO0dBQ0EsYUFBQSxLQUFBOzs7RUFHQSxPQUFBLGFBQUEsVUFBQTtHQUNBLGFBQUEsTUFBQTs7Ozs7OztBQ1ZBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLDBCQUFBLFVBQUE7Ozs7OztBQ0hBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLFlBQUEsVUFBQTs7Ozs7O0FDSEEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsNENBQUEsU0FBQSxRQUFBLGNBQUE7O1FBRUEsT0FBQSxPQUFBLFVBQUE7O1lBRUEsY0FBQTs7O1FBR0EsT0FBQSxPQUFBLFVBQUE7U0FDQSxjQUFBOzs7Ozs7O0FDWEEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsOENBQUEsU0FBQSxRQUFBLGNBQUE7UUFDQSxPQUFBLE9BQUEsT0FBQSxRQUFBLEdBQUE7UUFDQSxHQUFBLE9BQUEsT0FBQSxRQUFBLEdBQUEsS0FBQSxNQUFBLE9BQUEsU0FBQSxZQUFBO1VBQ0EsT0FBQSxRQUFBLEdBQUEsS0FBQSxNQUFBLE9BQUEsUUFBQTs7WUFFQTtVQUNBLEdBQUEsT0FBQSxRQUFBLEdBQUEsS0FBQSxNQUFBLE9BQUEsTUFBQSxNQUFBO1lBQ0EsT0FBQSxRQUFBLE9BQUEsUUFBQSxHQUFBLEtBQUEsTUFBQSxPQUFBLE1BQUE7O1VBRUEsR0FBQSxPQUFBLFFBQUEsR0FBQSxLQUFBLE1BQUEsT0FBQSxNQUFBLFlBQUE7WUFDQSxPQUFBLGNBQUEsT0FBQSxRQUFBLEdBQUEsS0FBQSxNQUFBLE9BQUEsTUFBQTs7OztRQUlBLE9BQUEsT0FBQSxVQUFBO1VBQ0EsT0FBQSxRQUFBLEdBQUEsS0FBQSxNQUFBLE9BQUEsTUFBQSxRQUFBLE9BQUE7VUFDQSxPQUFBLFFBQUEsR0FBQSxLQUFBLE1BQUEsT0FBQSxNQUFBLGNBQUEsT0FBQTtVQUNBLGNBQUE7OztRQUdBLE9BQUEsT0FBQSxVQUFBO1NBQ0EsY0FBQTs7Ozs7OztBQ3hCQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSwyQ0FBQSxTQUFBLFFBQUEsY0FBQTtRQUNBLE9BQUEsT0FBQSxPQUFBLFFBQUEsR0FBQSxTQUFBO1FBQ0EsT0FBQSxPQUFBLFVBQUE7O1lBRUEsUUFBQSxJQUFBLE9BQUE7OztRQUdBLE9BQUEsT0FBQSxVQUFBO1NBQ0EsY0FBQTs7Ozs7OztBQ1hBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLHVEQUFBLFNBQUEsUUFBQSxRQUFBLGNBQUE7O1FBRUEsT0FBQSxPQUFBLFVBQUE7O1lBRUEsT0FBQSxHQUFBO1lBQ0EsT0FBQSxHQUFBLE9BQUEsUUFBQTtZQUNBLGNBQUE7OztRQUdBLE9BQUEsT0FBQSxVQUFBO1NBQ0EsY0FBQTs7Ozs7OztBQ2JBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLHFEQUFBLFNBQUEsUUFBQSxjQUFBO1FBQ0EsT0FBQSxNQUFBLE9BQUEsUUFBQSxHQUFBLEtBQUE7UUFDQSxPQUFBLE9BQUEsT0FBQSxRQUFBLEdBQUE7O1FBRUEsT0FBQSxPQUFBLFVBQUE7VUFDQSxjQUFBOzs7UUFHQSxPQUFBLE9BQUEsVUFBQTtTQUNBLGNBQUE7OztRQUdBLE9BQUEsT0FBQSxRQUFBLFNBQUEsR0FBQSxFQUFBO1lBQ0EsUUFBQSxJQUFBO1VBQ0EsR0FBQSxNQUFBLEVBQUE7WUFDQTs7VUFFQSxRQUFBLFFBQUEsR0FBQSxTQUFBLE1BQUEsSUFBQTtZQUNBLEdBQUEsS0FBQSxNQUFBLEtBQUEsR0FBQSxPQUFBLFFBQUEsQ0FBQSxFQUFBLEtBQUEsTUFBQSxLQUFBLEdBQUEsT0FBQSxLQUFBO2NBQ0EsS0FBQSxNQUFBLE9BQUEsT0FBQSxFQUFBO2NBQ0EsT0FBQSxRQUFBLEdBQUE7Y0FDQSxPQUFBLFFBQUEsR0FBQTs7O1dBR0E7Ozs7OztBQzNCQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLFFBQUEsb0JBQUEsWUFBQSxlQUFBLFVBQUE7Ozs7Ozs7QUNIQSxDQUFBLFlBQUE7Q0FDQTs7Q0FFQSxTQUFBLGNBQUEsV0FBQSxPQUFBO0VBQ0EsSUFBQSxZQUFBO0VBQ0EsSUFBQSxPQUFBLFNBQUEsZUFBQTtFQUNBLEdBQUEsUUFBQSxLQUFBO0dBQ0EsUUFBQSxRQUFBLFVBQUEsS0FBQSxRQUFBLE9BQUEsK0NBQUEsWUFBQTs7RUFFQTtFQUNBLFNBQUEsWUFBQSxTQUFBLE1BQUEsT0FBQSxTQUFBO0dBQ0EsUUFBQSxRQUFBLFNBQUEsY0FBQSxNQUFBLFlBQUEsS0FBQTtHQUNBLFFBQUEsUUFBQSxTQUFBLGNBQUEsTUFBQSxZQUFBLElBQUEsV0FBQTs7R0FFQSxPQUFBLGVBQUEsT0FBQSxNQUFBOztFQUVBLFNBQUEsY0FBQTtHQUNBLFFBQUEsUUFBQSxTQUFBLGNBQUEsTUFBQSxZQUFBLElBQUEsV0FBQTs7RUFFQSxTQUFBLGVBQUEsT0FBQSxHQUFBLFNBQUE7R0FDQSxJQUFBLE9BQUEsTUFBQTtHQUNBLElBQUEsVUFBQTtHQUNBLElBQUEsVUFBQTtHQUNBLElBQUEsTUFBQSxRQUFBLEtBQUEsT0FBQTtHQUNBLElBQUEsUUFBQSxPQUFBO0dBQ0EsSUFBQSxNQUFBLFFBQUEsUUFBQSxTQUFBLGNBQUEsT0FBQTtHQUNBLElBQUEsTUFBQSxTQUFBLGNBQUEsTUFBQTtHQUNBLElBQUEsUUFBQSxJQUFBLHdCQUFBLE1BQUEsRUFBQSxJQUFBLE1BQUE7R0FDQSxJQUFBLFNBQUEsSUFBQSx3QkFBQSxPQUFBLEVBQUEsSUFBQSxFQUFBLFNBQUE7R0FDQSxPQUFBLFFBQUEsUUFBQSxTQUFBLGNBQUEsT0FBQSxJQUFBLE9BQUEsUUFBQSxNQUFBLElBQUEsUUFBQSxTQUFBOztFQUVBLE9BQUE7R0FDQSxhQUFBO0dBQ0EsYUFBQTtHQUNBLGdCQUFBOzs7Q0FHQSxRQUFBLE9BQUEsa0JBQUEsVUFBQSx3Q0FBQSxVQUFBLFVBQUEsY0FBQTtFQUNBLElBQUE7RUFDQSxXQUFBLFlBQUE7R0FDQSxPQUFBO0lBQ0EsT0FBQTtJQUNBLFFBQUE7SUFDQSxnQkFBQTtJQUNBLFdBQUE7SUFDQSxLQUFBO0lBQ0EsT0FBQTtJQUNBLFFBQUE7SUFDQSxTQUFBO0lBQ0EsU0FBQTtJQUNBLFFBQUE7SUFDQSxZQUFBLEdBQUEsTUFBQSxVQUFBLE9BQUEsQ0FBQSxNQUFBLE9BQUEsTUFBQSxDQUFBLFdBQUE7SUFDQSxZQUFBO0lBQ0EsY0FBQTtJQUNBLFVBQUE7SUFDQSxTQUFBLGNBQUEsbUJBQUE7OztFQUdBLE9BQUE7R0FDQSxVQUFBO0dBQ0EsT0FBQTtJQUNBLFdBQUE7SUFDQSxXQUFBO0lBQ0EsU0FBQTtJQUNBLFlBQUE7SUFDQSxTQUFBO0lBQ0EsU0FBQTs7R0FFQSxTQUFBO0dBQ0EsTUFBQSxVQUFBLE9BQUEsTUFBQSxPQUFBLFNBQUE7SUFDQSxJQUFBLFVBQUEsUUFBQSxPQUFBLFlBQUE7SUFDQSxJQUFBLFFBQUE7S0FDQSxRQUFBO0tBQ0EsU0FBQTtLQUNBLFNBQUE7O0lBRUEsSUFBQSxhQUFBLEdBQUEsSUFBQSxNQUFBLFdBQUEsVUFBQSxHQUFBO0tBQ0EsT0FBQSxTQUFBLEVBQUE7OztJQUdBLFFBQUEsZUFBQSxHQUFBLE1BQUEsTUFBQSxTQUFBLEtBQUEsT0FBQSxDQUFBLEdBQUEsYUFBQSxNQUFBLENBQUEsR0FBQTtJQUNBLFFBQUEsU0FBQTtLQUNBLEdBQUEsUUFBQSxRQUFBO0tBQ0EsR0FBQSxRQUFBLFNBQUE7O0lBRUEsUUFBQSxjQUFBO0tBQ0EsTUFBQTtNQUNBLEdBQUEsUUFBQSxRQUFBO01BQ0EsR0FBQSxRQUFBLFVBQUE7TUFDQSxRQUFBOztLQUVBLE1BQUE7TUFDQSxHQUFBLFFBQUEsUUFBQTtNQUNBLEdBQUEsUUFBQSxVQUFBO01BQ0EsUUFBQTs7OztJQUlBLElBQUEsZUFBQSxZQUFBO0tBQ0EsR0FBQSxNQUFBLFFBQUEsU0FBQSxVQUFBLEtBQUEsTUFBQSxRQUFBLFNBQUEsR0FBQSxTQUFBLFNBQUEsRUFBQTtNQUNBLFFBQUEsUUFBQSxNQUFBLFFBQUEsVUFBQSxVQUFBLE9BQUE7T0FDQSxJQUFBLElBQUE7UUFDQSxNQUFBLE1BQUE7UUFDQSxNQUFBLE1BQUE7UUFDQSxPQUFBLE1BQUEsWUFBQSxVQUFBLEVBQUE7UUFDQSxPQUFBLE1BQUE7UUFDQSxNQUFBLE1BQUE7UUFDQSxTQUFBLGFBQUEsV0FBQSxNQUFBO1FBQ0EsTUFBQTtRQUNBLFNBQUEsTUFBQTs7T0FFQSxPQUFBLEtBQUE7O09BRUEsUUFBQSxRQUFBLE1BQUEsVUFBQSxVQUFBLE1BQUE7O1FBRUEsSUFBQSxNQUFBLFVBQUEsS0FBQSxjQUFBO1NBQ0EsSUFBQSxPQUFBO1VBQ0EsTUFBQSxLQUFBO1VBQ0EsUUFBQSxNQUFBLFVBQUEsS0FBQSxlQUFBLE1BQUE7VUFDQSxPQUFBLE1BQUEsVUFBQSxLQUFBLGVBQUEsTUFBQTtVQUNBLE1BQUEsS0FBQTtVQUNBLE9BQUEsS0FBQSxZQUFBLFVBQUEsRUFBQTtVQUNBLEdBQUEsUUFBQSxPQUFBO1VBQ0EsR0FBQSxRQUFBLE9BQUE7VUFDQSxPQUFBLEtBQUE7VUFDQSxNQUFBLEtBQUE7VUFDQSxTQUFBLGFBQUEsV0FBQSxLQUFBO1VBQ0EsTUFBQTtVQUNBLFNBQUE7O1NBRUEsTUFBQSxLQUFBOzs7O01BSUE7O1NBRUE7TUFDQSxJQUFBLElBQUE7T0FDQSxNQUFBLE1BQUEsUUFBQTtPQUNBLE1BQUEsTUFBQSxRQUFBO09BQ0EsT0FBQSxNQUFBLFFBQUEsWUFBQSxVQUFBLEVBQUE7T0FDQSxPQUFBLE1BQUEsUUFBQTtPQUNBLE1BQUEsTUFBQSxRQUFBO09BQ0EsU0FBQSxNQUFBLFFBQUE7T0FDQSxNQUFBLE1BQUEsUUFBQTtPQUNBLFVBQUEsTUFBQSxRQUFBOztNQUVBLE9BQUEsS0FBQTtNQUNBLFFBQUEsUUFBQSxNQUFBLFFBQUEsVUFBQSxVQUFBLE1BQUE7O09BRUEsSUFBQSxNQUFBLFVBQUEsS0FBQSxjQUFBO1FBQ0EsSUFBQSxPQUFBO1NBQ0EsTUFBQSxLQUFBO1NBQ0EsUUFBQSxNQUFBLFVBQUEsS0FBQSxlQUFBLE1BQUE7U0FDQSxPQUFBLE1BQUEsVUFBQSxLQUFBLGVBQUEsTUFBQTtTQUNBLE1BQUEsS0FBQTtTQUNBLE9BQUEsS0FBQSxZQUFBLFVBQUEsRUFBQTtTQUNBLEdBQUEsUUFBQSxPQUFBO1NBQ0EsR0FBQSxRQUFBLE9BQUE7U0FDQSxPQUFBLEtBQUE7U0FDQSxNQUFBLEtBQUE7U0FDQSxTQUFBLGFBQUEsV0FBQSxLQUFBO1NBQ0EsTUFBQTtTQUNBLFNBQUE7O1FBRUEsTUFBQSxLQUFBOzs7OztJQUtBLElBQUEsY0FBQSxVQUFBOztLQUVBLFFBQUE7S0FDQSxTQUFBOztJQUVBLElBQUEsZ0JBQUEsVUFBQTtLQUNBLFNBQUE7S0FDQSxJQUFBLFFBQUE7S0FDQSxRQUFBLFFBQUEsT0FBQSxTQUFBLEtBQUE7T0FDQSxJQUFBLFNBQUE7T0FDQSxJQUFBLFFBQUE7T0FDQSxRQUFBLFFBQUEsUUFBQSxTQUFBLE9BQUEsTUFBQTtRQUNBLEdBQUEsS0FBQSxTQUFBLE1BQUE7U0FDQSxTQUFBOzs7T0FHQSxHQUFBLENBQUEsT0FBQTtRQUNBO1FBQ0EsT0FBQSxLQUFBLFNBQUE7U0FDQSxHQUFBLFFBQUEsUUFBQTtTQUNBLEdBQUEsUUFBQSxTQUFBLEtBQUEsSUFBQTtTQUNBLFFBQUE7Ozs7OztJQU1BLElBQUEsYUFBQSxZQUFBO0tBQ0EsUUFBQSxRQUFBLE1BQUEsS0FBQTtLQUNBLFFBQUEsTUFBQSxHQUFBLE9BQUEsS0FBQSxJQUFBLE9BQUEsT0FBQSxLQUFBLFNBQUEsUUFBQSxPQUFBLEtBQUEsVUFBQSxRQUFBLFFBQUEsS0FBQSxNQUFBOztLQUVBLElBQUEsQ0FBQSxRQUFBLFNBQUE7TUFDQSxJQUFBLEtBQUEsS0FBQTtNQUNBLEdBQUEsT0FBQSxVQUFBLEVBQUE7T0FDQSxJQUFBLFNBQUEsR0FBQSxJQUFBO1NBQ0EsWUFBQTtTQUNBLFlBQUE7U0FDQSxXQUFBLENBQUEsTUFBQSxLQUFBO1NBQ0EsU0FBQSxNQUFBLEtBQUE7T0FDQSxJQUFBLFlBQUEsR0FBQSxJQUFBO1NBQ0EsWUFBQTtTQUNBLFlBQUE7U0FDQSxXQUFBLE1BQUEsS0FBQTtTQUNBLFNBQUEsT0FBQSxLQUFBOztPQUVBLFFBQUEsU0FBQSxRQUFBLElBQUEsT0FBQTtTQUNBLEtBQUEsS0FBQTtTQUNBLEtBQUEsUUFBQTtTQUNBLEtBQUEsTUFBQTtTQUNBLEtBQUEsYUFBQSxjQUFBLFFBQUEsTUFBQSxHQUFBLEtBQUEsUUFBQSxPQUFBLElBQUEsUUFBQSxPQUFBLElBQUE7T0FDQSxRQUFBLFlBQUEsUUFBQSxJQUFBLE9BQUE7U0FDQSxLQUFBLEtBQUE7U0FDQSxLQUFBLE1BQUE7U0FDQSxLQUFBLFFBQUE7U0FDQSxLQUFBLGFBQUEsY0FBQSxRQUFBLE1BQUEsR0FBQSxLQUFBLFFBQUEsT0FBQSxHQUFBOztVQUVBO09BQ0EsSUFBQSxNQUFBLEdBQUEsSUFBQTtTQUNBLFlBQUEsUUFBQSxNQUFBLElBQUE7U0FDQSxZQUFBLFFBQUEsTUFBQTtTQUNBLFdBQUEsS0FBQSxLQUFBO1NBQ0EsU0FBQSxPQUFBLEtBQUE7OztPQUdBLFFBQUEsTUFBQSxRQUFBLElBQUEsT0FBQTtTQUNBLEtBQUEsS0FBQTtTQUNBLEtBQUEsUUFBQSxPQUFBLEdBQUE7U0FDQSxLQUFBLE1BQUE7U0FDQSxLQUFBLGFBQUEsY0FBQSxRQUFBLE1BQUEsR0FBQSxLQUFBLFFBQUEsT0FBQSxHQUFBOzs7O0lBSUEsR0FBQSxRQUFBLFVBQUEsUUFBQSxPQUFBLFVBQUEsRUFBQTtNQUNBLElBQUEsYUFBQSxRQUFBLElBQUEsVUFBQSxlQUFBLEtBQUEsUUFBQSxRQUFBLE9BQUE7UUFDQSxLQUFBLFNBQUE7UUFDQSxLQUFBLFFBQUEsU0FBQSxFQUFBO1FBQ0EsT0FBQSxFQUFBOzs7Ozs7OztRQVFBLEtBQUEsS0FBQTtRQUNBLE1BQUEsYUFBQTtRQUNBLE1BQUEsVUFBQTs7UUFFQSxLQUFBLFNBQUEsUUFBQTtRQUNBLEtBQUEsZUFBQTtRQUNBLEdBQUEsU0FBQSxTQUFBLEVBQUE7UUFDQSxRQUFBLGNBQUEsRUFBQTtRQUNBLFFBQUE7O1FBRUEsS0FBQSxLQUFBLFNBQUEsRUFBQTtRQUNBLElBQUEsUUFBQSxPQUFBLFFBQUE7UUFDQSxHQUFBLFNBQUEsRUFBQTtTQUNBLE9BQUE7O1lBRUE7U0FDQSxPQUFBLFFBQUEsU0FBQTs7O1FBR0EsS0FBQSxTQUFBLEVBQUE7UUFDQSxPQUFBLEVBQUE7Ozs7S0FJQSxRQUFBLGFBQUEsUUFBQSxJQUFBLFVBQUEsVUFBQSxLQUFBLE9BQUEsUUFBQSxPQUFBLEtBQUEsS0FBQSxhQUFBLGdCQUFBLFFBQUEsUUFBQSxLQUFBLE9BQUEsUUFBQSxTQUFBLEtBQUEsS0FBQSxLQUFBLFNBQUE7Ozs7OztLQU1BLFFBQUEsVUFBQSxRQUFBLFdBQUEsT0FBQSxVQUFBLEtBQUEsS0FBQSxHQUFBLEtBQUEsU0FBQSxVQUFBLEdBQUE7TUFDQSxPQUFBLEVBQUEsU0FBQSxRQUFBLFdBQUEsRUFBQTtTQUNBLEtBQUEsZ0JBQUEsR0FBQSxLQUFBLFVBQUEsVUFBQSxHQUFBO01BQ0EsT0FBQSxHQUFBLElBQUEsUUFBQSxXQUFBLEVBQUEsUUFBQTtRQUNBLEtBQUEsTUFBQSxVQUFBLEdBQUE7TUFDQSxPQUFBLFlBQUEsRUFBQTs7S0FFQSxRQUFBLFFBQUEsUUFBQSxXQUFBLE9BQUE7T0FDQSxLQUFBLGVBQUE7T0FDQSxLQUFBLGFBQUEsVUFBQSxHQUFBOzs7T0FHQSxLQUFBLGVBQUE7T0FDQSxLQUFBLFFBQUEsU0FBQSxFQUFBO09BQ0EsT0FBQSxFQUFBLFVBQUEsU0FBQSxFQUFBOztPQUVBLEtBQUEsVUFBQSxHQUFBO09BQ0EsT0FBQSxFQUFBLFdBQUE7O0tBRUEsUUFBQSxNQUFBLEdBQUEsYUFBQSxVQUFBLEdBQUEsR0FBQTtNQUNBLE9BQUEsYUFBQSxHQUFBLEdBQUE7UUFDQSxHQUFBLFlBQUEsVUFBQSxHQUFBLEdBQUE7TUFDQSxPQUFBLGFBQUEsR0FBQSxHQUFBO1FBQ0EsR0FBQSxTQUFBLFVBQUEsR0FBQSxHQUFBOztNQUVBLFFBQUEsY0FBQSxFQUFBO01BQ0EsUUFBQTs7S0FFQSxRQUFBLFFBQUEsYUFBQSxTQUFBLFFBQUEsVUFBQSxLQUFBLEtBQUEsVUFBQSxHQUFBO01BQ0EsT0FBQSxFQUFBOztLQUVBLFFBQUEsTUFBQSxhQUFBLFNBQUEsUUFBQSxVQUFBLEtBQUEsYUFBQSxVQUFBLEdBQUE7TUFDQSxPQUFBLEVBQUEsU0FBQSxPQUFBO1FBQ0EsS0FBQSxLQUFBLFVBQUEsR0FBQTtNQUNBLE9BQUEsRUFBQSxTQUFBLE1BQUE7OztJQUdBLElBQUEsYUFBQSxZQUFBOztLQUVBLE1BQUEsUUFBQSxVQUFBLEdBQUEsR0FBQTtNQUNBLFFBQUEsUUFBQSxhQUFBLFNBQUEsUUFBQSxVQUFBLE1BQUEsSUFBQSxRQUFBO1FBQ0EsS0FBQSxLQUFBLFVBQUEsR0FBQTtRQUNBLEVBQUEsU0FBQSxFQUFBLFFBQUEsTUFBQSxVQUFBLEVBQUEsUUFBQSxNQUFBOztRQUVBLE9BQUEsTUFBQSxVQUFBLEVBQUEsUUFBQSxNQUFBOztNQUVBLFFBQUEsTUFBQSxhQUFBLFNBQUEsUUFBQSxVQUFBLE1BQUEsSUFBQSxRQUFBO1FBQ0EsS0FBQSxhQUFBLFVBQUEsR0FBQTtRQUNBLE9BQUEsQ0FBQSxNQUFBLFVBQUEsRUFBQSxRQUFBLE1BQUEsY0FBQSxPQUFBOztRQUVBLEtBQUEsS0FBQSxVQUFBLEdBQUE7UUFDQSxPQUFBLENBQUEsTUFBQSxVQUFBLEVBQUEsUUFBQSxNQUFBLGNBQUEsTUFBQTs7OztJQUlBLElBQUEsU0FBQSxVQUFBLEdBQUE7S0FDQSxPQUFBLENBQUEsS0FBQSxJQUFBLEVBQUEsUUFBQSxPQUFBOztJQUVBLElBQUEsUUFBQSxZQUFBO0tBQ0EsT0FBQSxRQUFBLFFBQUEsR0FBQSxPQUFBLFFBQUEsTUFBQSxPQUFBLEtBQUEsQ0FBQSxRQUFBLE9BQUEsUUFBQSxTQUFBLE1BQUE7O0lBRUEsSUFBQSxvQkFBQSxZQUFBO0tBQ0EsUUFBQSxNQUFBLFFBQUEsUUFBQSxnQkFBQSxPQUFBLFFBQUEsU0FBQSxNQUFBLEdBQUEsUUFBQSxVQUFBLEdBQUE7TUFDQSxRQUFBLFdBQUEsS0FBQSxvQkFBQSxFQUFBLFFBQUEsS0FBQSxhQUFBLFVBQUEsR0FBQTtPQUNBLE9BQUEsZUFBQSxFQUFBLElBQUEsTUFBQSxFQUFBLElBQUE7OztLQUdBLFFBQUEsTUFBQTs7SUFFQSxJQUFBLGlCQUFBLFlBQUE7S0FDQSxRQUFBLE1BQUEsUUFBQSxRQUFBLGdCQUFBLE9BQUEsUUFBQSxTQUFBLEtBQUEsR0FBQSxRQUFBLFVBQUEsR0FBQTtNQUNBLFFBQUEsV0FBQSxLQUFBLGlCQUFBLEVBQUEsUUFBQSxLQUFBLGFBQUEsVUFBQSxHQUFBO09BQ0EsT0FBQSxlQUFBLEVBQUEsSUFBQSxNQUFBLEVBQUEsSUFBQTs7O0tBR0EsUUFBQSxNQUFBOztJQUVBLElBQUEsc0JBQUEsVUFBQSxPQUFBO0tBQ0EsT0FBQSxDQUFBLFVBQUEsT0FBQTtNQUNBLE9BQUEsVUFBQSxHQUFBO09BQ0EsRUFBQSxJQUFBLEVBQUEsSUFBQSxDQUFBLFFBQUEsTUFBQSxJQUFBLEVBQUEsTUFBQSxRQUFBLFNBQUEsUUFBQSxPQUFBO09BQ0EsRUFBQSxJQUFBLEVBQUEsSUFBQSxDQUFBLFFBQUEsT0FBQSxJQUFBLEVBQUEsTUFBQSxRQUFBLFNBQUEsUUFBQSxRQUFBOztRQUVBOztJQUVBLElBQUEsbUJBQUEsVUFBQSxPQUFBO0tBQ0EsT0FBQSxDQUFBLFVBQUEsT0FBQTtNQUNBLE9BQUEsVUFBQSxHQUFBO09BQ0EsRUFBQSxJQUFBLEVBQUEsSUFBQSxDQUFBLFFBQUEsT0FBQSxJQUFBLEVBQUEsTUFBQSxRQUFBLFNBQUEsUUFBQSxRQUFBO09BQ0EsRUFBQSxJQUFBLEVBQUEsSUFBQSxDQUFBLE1BQUEsRUFBQSxNQUFBLFFBQUEsU0FBQSxRQUFBLFFBQUE7O1FBRUE7O0lBRUEsSUFBQSxtQkFBQSxVQUFBLE9BQUE7S0FDQSxPQUFBLENBQUEsVUFBQSxPQUFBO01BQ0EsT0FBQSxVQUFBLEdBQUE7T0FDQSxJQUFBO09BQ0EsU0FBQSxRQUFBLFlBQUEsRUFBQTtPQUNBLEVBQUEsSUFBQSxFQUFBLElBQUEsQ0FBQSxPQUFBLElBQUEsRUFBQSxNQUFBLE9BQUEsU0FBQSxRQUFBLFFBQUE7T0FDQSxPQUFBLEVBQUEsSUFBQSxFQUFBLElBQUEsQ0FBQSxPQUFBLElBQUEsRUFBQSxNQUFBLE9BQUEsU0FBQSxRQUFBLFFBQUE7O1FBRUE7O0lBRUEsSUFBQSxlQUFBLFVBQUEsTUFBQSxHQUFBLFNBQUE7S0FDQSxJQUFBO0tBQ0EsVUFBQSwyQkFBQSxLQUFBLE9BQUE7S0FDQSxRQUFBLFFBQUEsS0FBQSxLQUFBLFVBQUEsVUFBQSxNQUFBO01BQ0EsV0FBQSx5Q0FBQSxLQUFBLFNBQUEsS0FBQSxTQUFBLFVBQUEsS0FBQSxTQUFBOztLQUVBLFNBQUEsUUFBQSxRQUFBLFlBQUEsU0FBQSxNQUFBLEdBQUEsT0FBQSxNQUFBLFlBQUE7OztJQUdBLElBQUEsZUFBQSxVQUFBLE1BQUEsR0FBQSxTQUFBO0tBQ0EsT0FBQSxRQUFBLFFBQUE7OztJQUdBLE1BQUEsT0FBQSxhQUFBLFVBQUEsTUFBQSxTQUFBO0tBQ0EsUUFBQSxRQUFBOztLQUVBLElBQUEsUUFBQSxXQUFBLE1BQUE7TUFDQTtNQUNBO01BQ0E7WUFDQTtNQUNBOztLQUVBLEdBQUEsT0FBQSxVQUFBLEtBQUEsUUFBQSxVQUFBLEtBQUE7T0FDQTs7U0FFQTtPQUNBOzs7O0lBSUEsTUFBQSxPQUFBLFdBQUEsVUFBQSxHQUFBLEdBQUE7S0FDQSxHQUFBLE1BQUEsRUFBQTtNQUNBOztLQUVBLEdBQUEsT0FBQSxFQUFBLEdBQUEsWUFBQSxZQUFBO01BQ0EsUUFBQSxRQUFBO01BQ0E7TUFDQTtNQUNBO01BQ0E7O01BRUEsR0FBQSxPQUFBLFVBQUEsS0FBQSxRQUFBLFVBQUEsS0FBQTtRQUNBO1FBQ0EsUUFBQSxJQUFBOztVQUVBO1FBQ0E7Ozs7SUFJQSxNQUFBLE9BQUEsYUFBQSxVQUFBLE1BQUEsTUFBQTtLQUNBLElBQUEsU0FBQSxNQUFBO01BQ0E7O0tBRUEsSUFBQSxRQUFBLE9BQUE7TUFDQTtZQUNBO01BQ0E7Ozs7Ozs7O0FDN2JBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsUUFBQSxvQkFBQSxZQUFBLG1CQUFBLFVBQUE7Ozs7OztBQ0hBLENBQUEsV0FBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxrQkFBQSxVQUFBLDRCQUFBLFNBQUEsVUFBQTtFQUNBLElBQUEsV0FBQSxXQUFBO0dBQ0EsT0FBQTtJQUNBLE9BQUE7SUFDQSxRQUFBO0lBQ0EsT0FBQTtJQUNBLE1BQUE7SUFDQSxPQUFBOzs7RUFHQSxPQUFBO0dBQ0EsVUFBQTtHQUNBLFlBQUE7R0FDQSxPQUFBO0lBQ0EsU0FBQTs7R0FFQSxTQUFBO0dBQ0EsTUFBQSxTQUFBLFFBQUEsU0FBQSxRQUFBLFNBQUE7OztJQUdBLE9BQUEsVUFBQSxRQUFBLE9BQUEsWUFBQSxPQUFBOzs7SUFHQSxJQUFBLFNBQUEsR0FBQSxNQUFBO01BQ0EsT0FBQSxDQUFBLEdBQUEsT0FBQSxRQUFBO01BQ0EsTUFBQSxDQUFBLEdBQUE7TUFDQSxNQUFBOzs7SUFHQSxJQUFBLE1BQUEsR0FBQSxPQUFBLFFBQUEsSUFBQSxPQUFBO01BQ0EsS0FBQSxTQUFBLE9BQUEsUUFBQTtNQUNBLEtBQUEsVUFBQSxPQUFBLFFBQUE7TUFDQSxPQUFBO0lBQ0EsSUFBQSxZQUFBLElBQUEsT0FBQTtNQUNBLEtBQUEsYUFBQSxlQUFBLE9BQUEsUUFBQSxRQUFBLElBQUEsTUFBQSxPQUFBLFFBQUEsU0FBQSxJQUFBO0lBQ0EsSUFBQSxhQUFBLFVBQUEsT0FBQTtNQUNBLEtBQUEsS0FBQSxPQUFBLFFBQUEsUUFBQSxJQUFBO01BQ0EsS0FBQSxnQkFBQTtNQUNBLEtBQUEsVUFBQSxPQUFBLFFBQUE7TUFDQSxNQUFBLFdBQUE7TUFDQSxLQUFBLFFBQUE7SUFDQSxJQUFBLE1BQUEsR0FBQSxJQUFBO01BQ0EsV0FBQTtNQUNBLFlBQUEsU0FBQSxHQUFBO01BQ0EsT0FBQSxPQUFBLFFBQUEsUUFBQSxJQUFBOztNQUVBLFlBQUEsU0FBQSxHQUFBO01BQ0EsT0FBQSxPQUFBLFFBQUEsUUFBQTs7SUFFQSxJQUFBLGNBQUEsVUFBQSxPQUFBO01BQ0EsTUFBQTtNQUNBLFVBQUEsSUFBQSxLQUFBLEtBQUE7O01BRUEsTUFBQSxRQUFBLE9BQUEsUUFBQTtNQUNBLEtBQUEsS0FBQTtJQUNBLElBQUEsT0FBQSxVQUFBLFVBQUE7TUFDQSxLQUFBLENBQUE7TUFDQTtNQUNBLE9BQUE7TUFDQSxLQUFBLFNBQUEsR0FBQTtNQUNBLE9BQUEsT0FBQTs7T0FFQSxNQUFBLFFBQUEsT0FBQSxRQUFBO01BQ0EsTUFBQSxlQUFBO01BQ0EsS0FBQSxlQUFBO01BQ0EsS0FBQSxLQUFBOzs7SUFHQSxTQUFBLFVBQUEsUUFBQTtLQUNBLFlBQUE7T0FDQSxTQUFBO09BQ0EsS0FBQSxVQUFBLE9BQUEsVUFBQSxJQUFBLEtBQUE7S0FDQSxLQUFBLGFBQUEsU0FBQSxLQUFBLE1BQUEsUUFBQSxTQUFBLEdBQUE7TUFDQSxJQUFBLE9BQUEsS0FBQSxZQUFBLE1BQUE7TUFDQSxJQUFBLElBQUEsR0FBQSxZQUFBLFNBQUEsS0FBQSxLQUFBO01BQ0EsT0FBQSxTQUFBLEdBQUE7T0FDQSxLQUFBLGVBQUEsUUFBQSxLQUFBLE1BQUEsRUFBQSxLQUFBLEtBQUE7Ozs7OztJQU1BLFNBQUEsU0FBQSxZQUFBLFVBQUE7O0tBRUEsV0FBQSxVQUFBLEtBQUEsU0FBQSxHQUFBO01BQ0EsSUFBQSxjQUFBLEdBQUEsWUFBQSxFQUFBLFVBQUE7TUFDQSxPQUFBLFNBQUEsR0FBQTtPQUNBLEVBQUEsV0FBQSxZQUFBO09BQ0EsT0FBQSxJQUFBOzs7O0lBSUEsT0FBQSxPQUFBLFVBQUEsU0FBQSxHQUFBLEVBQUE7TUFDQSxHQUFBLE1BQUEsRUFBQTtPQUNBOztNQUVBLFdBQUEsTUFBQSxVQUFBLEVBQUE7TUFDQSxZQUFBLE1BQUEsUUFBQSxFQUFBO01BQ0EsS0FBQSxNQUFBLFFBQUEsRUFBQTtNQUNBLFNBQUEsVUFBQTtPQUNBLFVBQUEsUUFBQSxZQUFBLEVBQUE7Ozs7SUFJQSxPQUFBO0tBQ0EsV0FBQTtNQUNBLE9BQUEsUUFBQTs7S0FFQSxTQUFBLEdBQUEsR0FBQTs7TUFFQSxJQUFBLENBQUEsRUFBQTtPQUNBLElBQUE7T0FDQSxFQUFBLE9BQUEsUUFBQSxTQUFBLE9BQUEsUUFBQTs7TUFFQSxTQUFBLFVBQUE7T0FDQSxVQUFBLEVBQUEsT0FBQSxRQUFBOzs7Ozs7Ozs7O0FDdEhBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxrQkFBQSxXQUFBLFdBQUEsV0FBQTtFQUNBLElBQUEsV0FBQSxVQUFBO0dBQ0EsT0FBQTtJQUNBLE9BQUE7SUFDQSxPQUFBOzs7RUFHQSxPQUFBO0dBQ0EsVUFBQTtHQUNBLGFBQUE7R0FDQSxZQUFBO0dBQ0EsTUFBQTtJQUNBLFFBQUE7SUFDQSxXQUFBOztHQUVBLE1BQUEsVUFBQSxRQUFBLFNBQUEsUUFBQSxRQUFBO0tBQ0EsSUFBQSxVQUFBLFFBQUEsT0FBQSxZQUFBLE9BQUE7Ozs7Ozs7O0FDbkJBLENBQUEsWUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLDBCQUFBLFVBQUEsUUFBQTtFQUNBLE9BQUEsVUFBQTtFQUNBOztFQUVBLFNBQUEsVUFBQTtHQUNBLE9BQUE7R0FDQSxPQUFBLE9BQUEsV0FBQSxTQUFBLEVBQUEsRUFBQTtJQUNBLEdBQUEsTUFBQSxFQUFBO0tBQ0E7O0lBRUEsT0FBQTs7O0VBR0EsU0FBQSxTQUFBO0dBQ0EsT0FBQSxVQUFBO0lBQ0EsYUFBQTtJQUNBLE1BQUEsQ0FBQTtLQUNBLFFBQUE7TUFDQSxHQUFBO01BQ0EsR0FBQTs7S0FFQSxPQUFBO0tBQ0EsT0FBQTs7SUFFQSxPQUFBLENBQUE7S0FDQSxRQUFBO01BQ0EsR0FBQTtNQUNBLEdBQUEsT0FBQSxRQUFBOztLQUVBLE9BQUE7S0FDQSxPQUFBLE9BQUEsUUFBQTs7Ozs7Ozs7QUNqQ0EsQ0FBQSxZQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGtCQUFBLFVBQUEsdUJBQUEsVUFBQSxVQUFBO0VBQ0EsSUFBQSxXQUFBLFlBQUE7R0FDQSxPQUFBO0lBQ0EsSUFBQTtJQUNBLE9BQUE7SUFDQSxRQUFBO0lBQ0EsTUFBQTtJQUNBLE9BQUE7SUFDQSxVQUFBO0lBQ0EsUUFBQTtLQUNBLE1BQUE7S0FDQSxPQUFBO0tBQ0EsS0FBQTtLQUNBLFFBQUE7O0lBRUEsUUFBQSxFQUFBO0tBQ0EsVUFBQTtLQUNBLE9BQUE7S0FDQSxTQUFBO09BQ0E7S0FDQSxVQUFBO0tBQ0EsT0FBQTtLQUNBLFNBQUE7TUFDQTtLQUNBLFVBQUE7S0FDQSxPQUFBO0tBQ0EsU0FBQTs7OztFQUlBLE9BQUE7R0FDQSxVQUFBO0dBQ0EsT0FBQTtJQUNBLE1BQUE7SUFDQSxTQUFBOztHQUVBLFNBQUE7R0FDQSxNQUFBLFVBQUEsUUFBQSxTQUFBLFFBQUEsU0FBQTs7SUFFQSxJQUFBLFVBQUEsUUFBQSxPQUFBLFlBQUE7SUFDQSxVQUFBLFFBQUEsT0FBQSxTQUFBLE9BQUE7SUFDQSxRQUFBLFNBQUEsSUFBQSxPQUFBO0lBQ0EsR0FBQSxRQUFBLE1BQUE7S0FDQSxRQUFBLE9BQUEsR0FBQSxRQUFBLFFBQUE7O0lBRUEsUUFBQSxJQUFBLFVBQUEsUUFBQSxTQUFBLE1BQUEsSUFBQSxpQkFBQSxRQUFBLFNBQUEsSUFBQTtJQUNBLElBQUEsSUFBQSxHQUFBLE1BQUE7TUFDQSxPQUFBLENBQUEsR0FBQTtNQUNBLE1BQUEsQ0FBQSxRQUFBLE9BQUEsTUFBQSxRQUFBLFFBQUEsUUFBQSxPQUFBO01BQ0EsTUFBQTs7SUFFQSxJQUFBLFFBQUEsR0FBQSxJQUFBO01BQ0EsRUFBQTtNQUNBLE9BQUEsQ0FBQSxHQUFBO01BQ0EsR0FBQSxTQUFBO01BQ0EsR0FBQSxZQUFBOztJQUVBLElBQUEsTUFBQSxHQUFBLE9BQUEsUUFBQSxJQUFBLE9BQUE7TUFDQSxLQUFBLFNBQUEsUUFBQTtNQUNBLEtBQUEsVUFBQSxRQUFBO01BQ0EsT0FBQTs7SUFFQSxJQUFBLFdBQUEsSUFBQSxPQUFBO01BQ0EsT0FBQTtNQUNBLEtBQUEsTUFBQSxRQUFBLE1BQUEsUUFBQTtNQUNBLEtBQUEsTUFBQTtNQUNBLEtBQUEsTUFBQTtNQUNBLEtBQUEsTUFBQTtNQUNBLEtBQUEsTUFBQTtNQUNBLEtBQUEsZ0JBQUE7SUFDQSxRQUFBLFFBQUEsUUFBQSxRQUFBLFVBQUEsT0FBQTtLQUNBLFNBQUEsT0FBQTtPQUNBLEtBQUEsVUFBQSxNQUFBLFdBQUE7T0FDQSxLQUFBLGNBQUEsTUFBQTtPQUNBLEtBQUEsZ0JBQUEsTUFBQTs7SUFFQSxJQUFBLE9BQUEsSUFBQSxPQUFBO01BQ0EsS0FBQSxTQUFBLFFBQUE7TUFDQSxLQUFBLFVBQUEsUUFBQTtNQUNBLE1BQUEsUUFBQSxXQUFBLFFBQUEsTUFBQSxRQUFBLFNBQUE7SUFDQSxJQUFBLFNBQUEsSUFBQSxPQUFBLEtBQUEsS0FBQSxhQUFBLGVBQUEsUUFBQSxTQUFBLElBQUEsT0FBQSxRQUFBLFNBQUEsSUFBQTtNQUNBLEtBQUEsU0FBQTs7SUFFQSxJQUFBLFFBQUEsU0FBQSxNQUFBO0tBQ0EsT0FBQSxPQUFBO09BQ0EsS0FBQSxLQUFBLFFBQUEsU0FBQTtLQUNBLE9BQUEsT0FBQTtPQUNBLEtBQUE7T0FDQSxNQUFBLGFBQUEsUUFBQSxPQUFBO09BQ0EsS0FBQSxlQUFBO09BQ0EsS0FBQSxLQUFBO0tBQ0EsSUFBQSxVQUFBLElBQUEsT0FBQSxLQUFBLEtBQUEsYUFBQSxnQkFBQSxRQUFBLFNBQUEsUUFBQSxTQUFBLE1BQUEsT0FBQSxRQUFBLFNBQUEsSUFBQTtPQUNBLEtBQUEsU0FBQTtLQUNBLFFBQUEsT0FBQTtPQUNBLEtBQUEsS0FBQSxRQUFBLFNBQUE7S0FDQSxRQUFBLE9BQUE7T0FDQSxLQUFBO09BQ0EsTUFBQSxhQUFBLFFBQUEsT0FBQTtPQUNBLEtBQUEsZUFBQTtPQUNBLEtBQUEsS0FBQTs7SUFFQSxJQUFBLFNBQUEsSUFBQSxPQUFBO01BQ0EsS0FBQSxTQUFBO0lBQ0EsR0FBQSxRQUFBLFlBQUEsS0FBQTtLQUNBLE9BQUEsS0FBQTs7O0lBR0EsT0FBQSxPQUFBO01BQ0EsS0FBQSxVQUFBLFFBQUE7O0lBRUEsSUFBQSxRQUFBLFNBQUEsTUFBQTtJQUNBLE9BQUEsT0FBQTtNQUNBLEtBQUEsTUFBQSxRQUFBLFFBQUE7TUFDQSxLQUFBLE1BQUE7TUFDQSxLQUFBLE1BQUEsUUFBQSxRQUFBO01BQ0EsS0FBQSxNQUFBLFFBQUE7TUFDQSxLQUFBLG9CQUFBO01BQ0EsS0FBQSxnQkFBQTtNQUNBLEtBQUEsVUFBQTs7SUFFQSxJQUFBLGFBQUEsT0FBQSxPQUFBO01BQ0EsS0FBQSxhQUFBLGlCQUFBLFFBQUEsU0FBQSxJQUFBO0lBQ0EsSUFBQSxTQUFBLFdBQUEsT0FBQTtNQUNBLEtBQUEsU0FBQTtNQUNBLEtBQUEsS0FBQSxRQUFBLFNBQUE7S0FDQSxHQUFBLFFBQUEsTUFBQTtNQUNBLE9BQUEsTUFBQSxRQUFBLFFBQUE7O0lBRUEsSUFBQSxjQUFBLFdBQUEsT0FBQTtNQUNBLEtBQUE7TUFDQSxNQUFBLGFBQUEsUUFBQSxPQUFBO01BQ0EsS0FBQSxlQUFBLFVBQUEsS0FBQSxLQUFBOzs7Ozs7SUFNQSxTQUFBLFFBQUE7S0FDQSxJQUFBLFFBQUEsTUFBQSxTQUFBOztLQUVBLElBQUEsR0FBQSxNQUFBLGFBQUE7TUFDQSxRQUFBLEVBQUEsT0FBQSxHQUFBLE1BQUEsTUFBQTtNQUNBLE1BQUEsT0FBQSxDQUFBLE9BQUE7O0tBRUEsWUFBQSxLQUFBLFNBQUE7S0FDQSxXQUFBLEtBQUEsYUFBQSxlQUFBLEVBQUEsU0FBQSxNQUFBLFFBQUEsU0FBQSxJQUFBOzs7SUFHQSxTQUFBLFVBQUE7S0FDQSxJQUFBLFFBQUEsTUFBQSxTQUFBO01BQ0EsUUFBQTtNQUNBLFFBQUE7S0FDQSxJQUFBLFFBQUE7S0FDQSxHQUFBOztNQUVBLFFBQUEsUUFBQSxPQUFBLE1BQUEsVUFBQSxLQUFBLEtBQUE7T0FDQSxJQUFBLFNBQUEsSUFBQSxRQUFBLFdBQUEsU0FBQSxRQUFBO1FBQ0EsUUFBQTtRQUNBLFFBQUE7OztNQUdBO01BQ0EsUUFBQSxRQUFBLEtBQUEsUUFBQSxJQUFBLFFBQUE7Y0FDQSxDQUFBLFNBQUEsUUFBQTtLQUNBLFFBQUEsSUFBQTtLQUNBLFFBQUEsY0FBQTtLQUNBLFFBQUE7O0lBRUEsT0FBQSxPQUFBLFdBQUEsU0FBQSxFQUFBLEVBQUE7S0FDQSxHQUFBLE1BQUEsRUFBQTtNQUNBOztLQUVBLFFBQUEsT0FBQSxHQUFBLFFBQUEsRUFBQTtLQUNBLFdBQUEsSUFBQSxPQUFBO09BQ0EsT0FBQTtPQUNBLEtBQUEsTUFBQSxRQUFBLE1BQUEsSUFBQSxFQUFBO09BQ0EsS0FBQSxNQUFBO09BQ0EsS0FBQSxNQUFBO09BQ0EsS0FBQSxNQUFBO09BQ0EsS0FBQSxNQUFBO09BQ0EsS0FBQSxnQkFBQTtLQUNBLFFBQUEsUUFBQSxRQUFBLFFBQUEsVUFBQSxPQUFBO01BQ0EsU0FBQSxPQUFBO1FBQ0EsS0FBQSxVQUFBLE1BQUEsV0FBQTtRQUNBLEtBQUEsY0FBQSxNQUFBO1FBQ0EsS0FBQSxnQkFBQSxNQUFBOztLQUVBLEtBQUEsTUFBQSxRQUFBLFVBQUEsUUFBQSxRQUFBLElBQUEsRUFBQSxNQUFBO0tBQ0EsT0FBQSxNQUFBLFFBQUEsRUFBQTtLQUNBLFlBQUEsS0FBQSxTQUFBLFFBQUEsWUFBQSxFQUFBO0tBQ0EsV0FBQSxhQUFBLFNBQUEsS0FBQSxLQUFBLFFBQUEsS0FBQSxhQUFBLGVBQUEsRUFBQSxRQUFBLFlBQUEsRUFBQSxVQUFBLE1BQUEsUUFBQSxTQUFBLElBQUE7O0lBRUEsT0FBQTtLQUNBLFlBQUE7TUFDQSxPQUFBLFFBQUE7O0tBRUEsVUFBQSxVQUFBLFVBQUE7TUFDQSxJQUFBLENBQUEsVUFBQTtPQUNBLFlBQUEsS0FBQSxTQUFBO09BQ0EsV0FBQSxLQUFBLGFBQUEsZUFBQSxFQUFBLEtBQUEsTUFBQSxRQUFBLFNBQUEsSUFBQTtPQUNBOztNQUVBLFlBQUEsS0FBQSxTQUFBLFNBQUEsUUFBQTtNQUNBLElBQUEsWUFBQSxVQUFBO09BQ0EsV0FBQSxLQUFBLGFBQUEsZUFBQSxFQUFBLFNBQUEsUUFBQSxVQUFBLE1BQUEsUUFBQSxTQUFBLElBQUE7YUFDQTtPQUNBLFdBQUEsYUFBQSxTQUFBLEtBQUEsS0FBQSxRQUFBLEtBQUEsYUFBQSxlQUFBLEVBQUEsU0FBQSxRQUFBLFVBQUEsTUFBQSxRQUFBLFNBQUEsSUFBQTs7Ozs7Ozs7Ozs7QUNqTkEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxRQUFBLG9CQUFBLFlBQUEsY0FBQSxVQUFBOzs7Ozs7QUNIQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsa0JBQUEsV0FBQSw2Q0FBQSxTQUFBLFFBQUEsVUFBQSxRQUFBOztFQUVBLE9BQUE7R0FDQSxVQUFBO0dBQ0EsYUFBQTtHQUNBLFlBQUE7R0FDQSxRQUFBO0dBQ0EsTUFBQSxVQUFBLFFBQUEsU0FBQSxRQUFBOztJQUVBLElBQUEsU0FBQTtJQUNBLElBQUEsVUFBQSxHQUFBLFdBQUEsR0FBQSxhQUFBLEdBQUE7SUFDQSxJQUFBLE9BQUE7SUFDQSxJQUFBLFdBQUE7SUFDQSxJQUFBLG1CQUFBO0lBQ0EsSUFBQSxTQUFBLFFBQUEsS0FBQTtLQUNBLElBQUEsUUFBQSxRQUFBLEtBQUE7S0FDQSxJQUFBLGFBQUE7S0FDQSxJQUFBLE1BQUE7S0FDQSxJQUFBLFVBQUE7S0FDQSxNQUFBLElBQUEsRUFBQSxRQUFBO0tBQ0EsT0FBQSxLQUFBLFNBQUEsV0FBQTtPQUNBLE1BQUEsR0FBQTs7S0FFQSxNQUFBLEtBQUEsU0FBQSxTQUFBLEVBQUE7TUFDQSxhQUFBO01BQ0EsTUFBQTtNQUNBLFVBQUE7TUFDQSxTQUFBO01BQ0EsVUFBQSxHQUFBLFdBQUEsR0FBQSxhQUFBLEdBQUE7TUFDQSxPQUFBO01BQ0EsV0FBQTtPQUNBLFNBQUEsVUFBQTtRQUNBLEtBQUEsTUFBQSxNQUFBLEdBQUEsTUFBQSxHQUFBO1NBQ0EsZ0JBQUE7U0FDQSxPQUFBO1NBQ0EsZUFBQTtTQUNBLEtBQUEsU0FBQSxJQUFBO1VBQ0EsUUFBQSxRQUFBLElBQUEsS0FBQSxJQUFBLFNBQUEsTUFBQSxJQUFBO1dBQ0EsR0FBQSxNQUFBLFNBQUEsT0FBQSxHQUFBO1lBQ0EsR0FBQSxLQUFBLFdBQUEsaUJBQUEsUUFBQSxPQUFBLEtBQUEsS0FBQSxXQUFBLGNBQUEsUUFBQSxTQUFBLENBQUEsRUFBQTthQUNBLElBQUEsT0FBQSxLQUFBO2NBQ0EsS0FBQTtjQUNBLFFBQUE7Y0FDQSxRQUFBOzthQUVBOzs7O1VBSUEsR0FBQSxXQUFBO1dBQ0EsUUFBQSxRQUFBLElBQUEsS0FBQSxJQUFBLFNBQUEsTUFBQSxJQUFBO1lBQ0EsR0FBQSxJQUFBLFVBQUEsRUFBQTthQUNBLEdBQUEsT0FBQSxRQUFBLEtBQUEsUUFBQSxZQUFBO2VBQ0EsUUFBQSxLQUFBLE9BQUE7O2FBRUEsUUFBQSxLQUFBLEtBQUEsS0FBQTs7Ozs7Y0FLQTtXQUNBLE9BQUEsR0FBQSxLQUFBLEtBQUE7Ozs7U0FJQSxrQkFBQSxTQUFBO1NBQ0E7O1VBRUEsSUFBQSxRQUFBLE1BQUEsT0FBQSxlQUFBO1lBQ0EsSUFBQSxXQUFBLE1BQUEsT0FBQSxHQUFBLE9BQUEsT0FBQTtVQUNBLElBQUEsUUFBQTtVQUNBLElBQUEsSUFBQSxJQUFBLEdBQUEsS0FBQSxTQUFBLFFBQUEsSUFBQTtXQUNBLEdBQUEsU0FBQSxHQUFBO1lBQ0EsU0FBQSxLQUFBLFNBQUEsR0FBQSxRQUFBLGNBQUEsS0FBQTtZQUNBLEdBQUEsU0FBQSxHQUFBLFFBQUEsT0FBQSxDQUFBLEVBQUE7YUFDQSxTQUFBLEtBQUEsU0FBQSxHQUFBLE9BQUEsR0FBQSxTQUFBLEdBQUEsUUFBQTs7WUFFQSxHQUFBLFNBQUEsR0FBQSxVQUFBLEVBQUE7YUFDQSxNQUFBLEtBQUE7O1lBRUEsUUFBQSxJQUFBLFNBQUE7OztVQUdBLEdBQUEsU0FBQSxVQUFBLE1BQUEsT0FBQTtXQUNBLGFBQUE7WUFDQSxJQUFBLElBQUEsSUFBQSxHQUFBLEtBQUEsU0FBQSxRQUFBLElBQUE7YUFDQSxHQUFBLE9BQUEsUUFBQSxTQUFBLE9BQUEsWUFBQTtjQUNBLFFBQUEsU0FBQSxNQUFBOzthQUVBLFFBQUEsU0FBQSxJQUFBLE9BQUE7OztZQUdBLE9BQUEsU0FBQSxTQUFBLE1BQUEsT0FBQTs7U0FFQSxPQUFBLFNBQUEsS0FBQTtTQUNBO1VBQ0EsYUFBQSxNQUFBOztTQUVBLFVBQUEsU0FBQTtTQUNBO1VBQ0EsT0FBQSxHQUFBLFNBQUE7OztVQUdBLEdBQUEsQ0FBQSxXQUFBO1dBQ0EsUUFBQSxRQUFBLE9BQUEsR0FBQSxLQUFBLEdBQUEsS0FBQSxJQUFBLFNBQUEsTUFBQSxJQUFBO1lBQ0EsR0FBQSxJQUFBLGNBQUEsUUFBQSxVQUFBLENBQUEsS0FBQSxJQUFBLGNBQUEsUUFBQSxXQUFBLENBQUEsRUFBQTthQUNBLE9BQUEsR0FBQSxLQUFBLFlBQUE7O2FBRUEsR0FBQSxJQUFBLGNBQUEsUUFBQSxjQUFBLENBQUEsRUFBQTtjQUNBLE9BQUEsR0FBQSxLQUFBLGdCQUFBOzs7O2NBSUE7V0FDQSxRQUFBLFFBQUEsU0FBQSxTQUFBLEtBQUEsSUFBQTtZQUNBLEtBQUEsU0FBQTtZQUNBLEdBQUEsSUFBQSxpQkFBQSxlQUFBLE9BQUEsT0FBQSxZQUFBO2FBQ0EsSUFBQSxJQUFBLENBQUEsSUFBQSxJQUFBO2FBQ0EsUUFBQSxRQUFBLEtBQUEsTUFBQSxTQUFBLFFBQUEsRUFBQTtjQUNBLEVBQUEsVUFBQSxLQUFBO2NBQ0EsR0FBQSxNQUFBLFdBQUEsU0FBQSxHQUFBO2VBQ0EsR0FBQSxPQUFBLFdBQUEsaUJBQUEsUUFBQSxTQUFBLEtBQUEsT0FBQSxXQUFBLGNBQUEsUUFBQSxTQUFBLENBQUEsRUFBQTtnQkFDQSxLQUFBLE9BQUEsS0FBQTtpQkFDQSxLQUFBO2lCQUNBLFFBQUE7aUJBQ0EsUUFBQTs7Z0JBRUE7Ozs7YUFJQSxPQUFBLEdBQUEsS0FBQSxLQUFBLENBQUEsS0FBQSxDQUFBLElBQUEsT0FBQSxLQUFBOzs7V0FHQSxPQUFBLEdBQUEsS0FBQSxZQUFBOzs7VUFHQSxPQUFBLEdBQUE7VUFDQSxPQUFBLEtBQUEsT0FBQSxHQUFBLEtBQUEsT0FBQSxvQkFBQTs7Ozs7Ozs7Ozs7OztBQzdJQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLFFBQUEsb0JBQUEsWUFBQSxnQkFBQSxVQUFBOzs7Ozs7O0FDSEEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGtCQUFBLFdBQUEsbUJBQUEsV0FBQTtFQUNBLElBQUEsV0FBQSxVQUFBO0dBQ0EsT0FBQTtJQUNBLE9BQUE7OztFQUdBLE9BQUE7R0FDQSxVQUFBO0dBQ0EsTUFBQTtJQUNBLEtBQUE7SUFDQSxVQUFBO0lBQ0EsUUFBQTs7R0FFQSxhQUFBO0dBQ0EsWUFBQTtHQUNBLE1BQUEsVUFBQSxRQUFBLFNBQUEsUUFBQTtJQUNBLE9BQUEsVUFBQSxRQUFBLE9BQUEsWUFBQSxPQUFBO0lBQ0EsT0FBQTtJQUNBLE9BQUE7Ozs7Ozs7O0FDckJBLENBQUEsWUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLGtDQUFBLFVBQUEsUUFBQTtFQUNBLE9BQUEsU0FBQTtHQUNBLFNBQUE7R0FDQSxVQUFBO0dBQ0EsVUFBQTtHQUNBLGFBQUE7R0FDQSxpQkFBQTtHQUNBLGtCQUFBO0dBQ0EsZUFBQTtHQUNBLGlCQUFBO0dBQ0EsVUFBQTs7RUFFQSxPQUFBLFFBQUE7R0FDQSxTQUFBO0lBQ0EsT0FBQTs7R0FFQSxNQUFBOztFQUVBLE9BQUEsV0FBQSxZQUFBO0dBQ0EsT0FBQSxNQUFBLFFBQUEsUUFBQTtJQUNBLE1BQUE7SUFDQSxnQkFBQTtJQUNBLFFBQUE7S0FDQSxLQUFBO0tBQ0EsT0FBQTtLQUNBLFFBQUE7S0FDQSxNQUFBOztJQUVBLEdBQUEsVUFBQSxHQUFBO0tBQ0EsT0FBQSxFQUFBOztJQUVBLEdBQUEsVUFBQSxHQUFBO0tBQ0EsT0FBQSxFQUFBOztJQUVBLFlBQUE7SUFDQSxZQUFBO0lBQ0EsV0FBQTtJQUNBLG9CQUFBO0lBQ0EseUJBQUE7OztJQUdBLE9BQUE7S0FDQSxXQUFBOztJQUVBLE9BQUE7S0FDQSxXQUFBO0tBQ0EsbUJBQUE7O0lBRUEsUUFBQTtLQUNBLFlBQUE7O0lBRUEsT0FBQTtLQUNBLGFBQUE7Ozs7R0FJQSxJQUFBLE9BQUEsUUFBQSxVQUFBLE1BQUE7SUFDQSxPQUFBLE1BQUEsUUFBQSxNQUFBLFVBQUEsQ0FBQSxTQUFBLE9BQUEsTUFBQSxNQUFBLE9BQUEsTUFBQTs7R0FFQSxPQUFBLE9BQUE7O0VBRUEsT0FBQSxpQkFBQSxZQUFBO0dBQ0EsSUFBQSxZQUFBO0dBQ0EsT0FBQSxRQUFBO0lBQ0EsS0FBQTtJQUNBLEtBQUE7O0dBRUEsUUFBQSxRQUFBLE9BQUEsV0FBQSxVQUFBLE1BQUEsS0FBQTtJQUNBLElBQUEsUUFBQTtLQUNBLElBQUE7S0FDQSxLQUFBLEtBQUE7S0FDQSxPQUFBLEtBQUE7S0FDQSxRQUFBOztJQUVBLFFBQUEsUUFBQSxPQUFBLE1BQUEsVUFBQSxNQUFBLEdBQUE7S0FDQSxNQUFBLE9BQUEsS0FBQTtNQUNBLElBQUE7TUFDQSxHQUFBLEtBQUEsS0FBQSxPQUFBO01BQ0EsR0FBQSxLQUFBLEtBQUEsT0FBQTs7S0FFQSxPQUFBLE1BQUEsTUFBQSxLQUFBLElBQUEsT0FBQSxNQUFBLEtBQUEsS0FBQSxLQUFBLE9BQUE7S0FDQSxPQUFBLE1BQUEsTUFBQSxLQUFBLElBQUEsT0FBQSxNQUFBLEtBQUEsS0FBQSxLQUFBLE9BQUE7O0lBRUEsVUFBQSxLQUFBOzs7R0FHQSxPQUFBLE1BQUEsT0FBQTtHQUNBLElBQUEsT0FBQSxRQUFBLFVBQUEsUUFBQTtJQUNBLE9BQUEsTUFBQSxRQUFBLE1BQUEsVUFBQSxDQUFBLFNBQUEsT0FBQSxNQUFBLE1BQUEsT0FBQSxNQUFBOzs7RUFHQSxPQUFBLE9BQUEsUUFBQSxVQUFBLEdBQUEsR0FBQTtHQUNBLElBQUEsQ0FBQSxHQUFBO0lBQ0E7O0dBRUEsT0FBQTs7RUFFQSxPQUFBLE9BQUEsYUFBQSxVQUFBLEdBQUEsR0FBQTtHQUNBLElBQUEsTUFBQSxHQUFBO0lBQ0E7O0dBRUEsT0FBQTs7Ozs7O0FDeEdBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxrQkFBQSxVQUFBLGlCQUFBLENBQUEsZUFBQSxTQUFBLGFBQUE7O0VBRUEsSUFBQSxTQUFBO1FBQ0EsSUFBQSxTQUFBOztRQUVBLFNBQUEsTUFBQSxJQUFBO1lBQ0EsSUFBQSxLQUFBLEdBQUEsR0FBQSxhQUFBO1lBQ0EsSUFBQSxDQUFBLElBQUE7Z0JBQ0EsS0FBQSxFQUFBO2dCQUNBLEdBQUEsR0FBQSxhQUFBLHFCQUFBOztZQUVBLE9BQUE7O1FBRUEsU0FBQSxTQUFBLElBQUE7WUFDQSxJQUFBLFFBQUEsT0FBQTtZQUNBLElBQUEsQ0FBQSxPQUFBO2dCQUNBLFFBQUE7Z0JBQ0EsT0FBQSxNQUFBOztZQUVBLE9BQUE7OztRQUdBLFNBQUEsZUFBQSxTQUFBLE9BQUEsVUFBQSxTQUFBLFFBQUE7WUFDQSxPQUFBLFdBQUE7Z0JBQ0EsTUFBQSxZQUFBO2dCQUNBLE1BQUEsV0FBQTtnQkFDQSxNQUFBLFNBQUE7Z0JBQ0EsU0FBQSxRQUFBLFFBQUEsV0FBQTtvQkFDQSxJQUFBLFdBQUEsTUFBQSxXQUFBLFFBQUE7d0JBQ0EsUUFBQSxHQUFBLE1BQUEsU0FBQTs7b0JBRUEsTUFBQSxZQUFBO29CQUNBLE1BQUEsV0FBQTtvQkFDQSxNQUFBOzs7OztRQUtBLE9BQUE7WUFDQSxPQUFBLFNBQUEsU0FBQSxRQUFBOztvQkFFQSxJQUFBLFFBQUEsU0FBQSxNQUFBO29CQUNBLElBQUEsU0FBQSxDQUFBLE1BQUEsYUFBQSxNQUFBO3dCQUNBLE1BQUEsU0FBQSxRQUFBLEdBQUE7b0JBQ0EsSUFBQSxXQUFBLFlBQUEsU0FBQTt3QkFDQSxNQUFBLENBQUEsUUFBQSxTQUFBLE1BQUEsU0FBQTt3QkFDQSxJQUFBLENBQUEsUUFBQSxPQUFBLFNBQUE7O29CQUVBLElBQUEsVUFBQTt3QkFDQSxJQUFBLE1BQUEsV0FBQTs0QkFDQSxNQUFBOzhCQUNBLGVBQUE7NkNBQ0E7NkNBQ0E7NkNBQ0E7NkNBQ0E7NEJBQ0EsT0FBQSxNQUFBLFNBQUE7OzZCQUVBOzRCQUNBLE1BQUEsU0FBQTs0QkFDQSxPQUFBLGVBQUE7a0RBQ0E7a0RBQ0E7a0RBQ0E7a0RBQ0E7Ozs7Z0JBSUE7O1lBRUEsT0FBQSxTQUFBLFNBQUEsUUFBQTs7b0JBRUEsSUFBQSxRQUFBLFNBQUEsTUFBQTtvQkFDQSxJQUFBLFNBQUEsQ0FBQSxNQUFBLGFBQUEsTUFBQTt3QkFDQSxNQUFBLFNBQUEsUUFBQSxHQUFBOztvQkFFQSxJQUFBLFdBQUEsWUFBQSxTQUFBO3dCQUNBLE1BQUEsQ0FBQSxRQUFBLE9BQUEsU0FBQTt3QkFDQSxJQUFBLENBQUEsUUFBQSxTQUFBLE1BQUEsU0FBQTs7b0JBRUEsSUFBQSxVQUFBO3dCQUNBLElBQUEsTUFBQSxXQUFBOzRCQUNBLE1BQUEsU0FBQSxlQUFBOzBEQUNBOzBEQUNBOzBEQUNBOzBEQUNBOzRCQUNBLE9BQUEsTUFBQSxTQUFBOzs2QkFFQTs0QkFDQSxNQUFBLFNBQUE7NEJBQ0EsT0FBQSxlQUFBO2tEQUNBO2tEQUNBO2tEQUNBO2tEQUNBOzs7O2dCQUlBOzs7Ozs7QUN0R0EsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxRQUFBLG9CQUFBLFlBQUEsbUJBQUEsVUFBQTs7Ozs7O0FDSEEsQ0FBQSxZQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGtCQUFBLFVBQUEsWUFBQTs7Q0FFQSxTQUFBLFVBQUEsQ0FBQSxZQUFBOztDQUVBLFNBQUEsU0FBQSxVQUFBLGNBQUE7RUFDQSxPQUFBO0dBQ0EsVUFBQTtHQUNBLFNBQUE7R0FDQSxZQUFBO0dBQ0EsYUFBQTtHQUNBLE1BQUE7OztFQUdBLFNBQUEscUJBQUEsUUFBQSxTQUFBLFFBQUE7Ozs7O0FDaEJBLENBQUEsV0FBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLGtEQUFBLFNBQUEsUUFBQSxTQUFBLFVBQUE7RUFDQSxPQUFBLE9BQUE7RUFDQSxPQUFBLFdBQUE7RUFDQSxPQUFBLGlCQUFBO0VBQ0EsT0FBQSxnQkFBQTtFQUNBLE9BQUEsY0FBQTtFQUNBLE9BQUEsYUFBQTtFQUNBLE9BQUEsZ0JBQUE7RUFDQSxPQUFBLGFBQUE7RUFDQTs7RUFFQSxTQUFBLFdBQUE7R0FDQSxPQUFBO0dBQ0EsT0FBQTtHQUNBLE9BQUE7R0FDQSxPQUFBO0dBQ0EsT0FBQTtHQUNBLE9BQUEsT0FBQSx1QkFBQSxTQUFBLFNBQUEsU0FBQTtJQUNBLElBQUEsWUFBQSxTQUFBO0tBQ0EsT0FBQTs7SUFFQSxPQUFBO0lBQ0EsT0FBQTtJQUNBLE9BQUE7SUFDQSxPQUFBOztHQUVBLE9BQUEsT0FBQSxXQUFBLFNBQUEsR0FBQSxHQUFBO0lBQ0EsSUFBQSxNQUFBLEdBQUE7S0FDQTs7SUFFQSxPQUFBOzs7O0VBSUEsU0FBQSxhQUFBO0dBQ0EsT0FBQSxPQUFBLENBQUEsT0FBQTtHQUNBOztFQUVBLFNBQUEsY0FBQTtHQUNBLElBQUEsT0FBQTtHQUNBLFFBQUEsUUFBQSxPQUFBLE1BQUEsU0FBQSxNQUFBO0lBQ0EsS0FBQSxPQUFBLFFBQUEsWUFBQSxRQUFBLFdBQUEsS0FBQSxPQUFBLFFBQUEsWUFBQTtJQUNBLEtBQUEsV0FBQSxTQUFBLEtBQUE7O0dBRUEsSUFBQSxTQUFBLFFBQUEsV0FBQSxPQUFBLEtBQUEsQ0FBQSxPQUFBLFFBQUEsWUFBQSxNQUFBLFVBQUE7R0FDQSxLQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsT0FBQSxRQUFBLEtBQUE7SUFDQSxJQUFBLE9BQUEsR0FBQSxPQUFBLE9BQUEsUUFBQSxLQUFBO0tBQ0EsT0FBQSxJQUFBOzs7R0FHQSxPQUFBLFFBQUEsT0FBQSxRQUFBLFlBQUEsS0FBQSxXQUFBOztFQUVBLFNBQUEsV0FBQSxRQUFBO0dBQ0EsSUFBQSxTQUFBLFFBQUEsV0FBQSxPQUFBLEtBQUEsQ0FBQSxPQUFBLFFBQUEsWUFBQSxNQUFBLFVBQUE7R0FDQSxJQUFBLE9BQUE7R0FDQSxRQUFBLFFBQUEsUUFBQSxTQUFBLE1BQUEsSUFBQTtJQUNBLEdBQUEsS0FBQSxXQUFBLFFBQUEsUUFBQTtLQUNBLE9BQUE7OztHQUdBLE9BQUEsS0FBQTs7RUFFQSxTQUFBLGdCQUFBO0dBQ0EsT0FBQSxVQUFBLENBQUEsT0FBQSxRQUFBLFFBQUEsWUFBQTs7O0VBR0EsU0FBQSxnQkFBQTtHQUNBLE9BQUEsZ0JBQUE7SUFDQSxPQUFBLE9BQUEsUUFBQSxRQUFBLFlBQUE7SUFDQSxPQUFBLE9BQUEsUUFBQSxRQUFBLFlBQUE7SUFDQSxVQUFBO0lBQ0EsT0FBQTtLQUNBLEtBQUE7OztHQUdBLE9BQUEsbUJBQUE7SUFDQSxPQUFBLE9BQUEsUUFBQSxRQUFBLFlBQUE7SUFDQSxPQUFBLE9BQUEsUUFBQSxRQUFBLFlBQUE7SUFDQSxVQUFBO0lBQ0EsT0FBQTtLQUNBLEtBQUE7Ozs7O0VBS0EsU0FBQSxXQUFBO0dBQ0EsT0FBQSxRQUFBO0lBQ0EsU0FBQTtLQUNBLE9BQUE7TUFDQSxNQUFBOztNQUVBLGdCQUFBO01BQ0EsUUFBQTtPQUNBLEtBQUE7T0FDQSxPQUFBO09BQ0EsUUFBQTtPQUNBLE1BQUE7O01BRUEsR0FBQSxTQUFBLEdBQUE7T0FDQSxPQUFBLEVBQUE7O01BRUEsR0FBQSxTQUFBLEdBQUE7T0FDQSxPQUFBLEVBQUE7O01BRUEsWUFBQTtNQUNBLFdBQUE7TUFDQSxvQkFBQTtNQUNBLHlCQUFBO01BQ0EsUUFBQSxDQUFBLEtBQUE7TUFDQSxPQUFBO09BQ0EsV0FBQTs7TUFFQSxPQUFBO09BQ0EsV0FBQTtPQUNBLG1CQUFBOztNQUVBLFFBQUE7T0FDQSxZQUFBO09BQ0EsUUFBQTtRQUNBLFFBQUE7OztNQUdBLE9BQUE7T0FDQSxhQUFBOzs7O0lBSUEsTUFBQTs7R0FFQSxPQUFBLE9BQUE7OztFQUdBLFNBQUEsaUJBQUE7R0FDQSxJQUFBLFlBQUE7R0FDQSxRQUFBLFFBQUEsT0FBQSxRQUFBLFlBQUEsVUFBQSxTQUFBLE1BQUEsS0FBQTtJQUNBLElBQUEsUUFBQTtLQUNBLEtBQUEsS0FBQTtLQUNBLE9BQUEsS0FBQTtLQUNBLFFBQUE7O0lBRUEsUUFBQSxRQUFBLE9BQUEsUUFBQSxLQUFBLFNBQUEsTUFBQTtLQUNBLE1BQUEsT0FBQSxLQUFBO01BQ0EsR0FBQSxLQUFBO01BQ0EsR0FBQSxLQUFBLEtBQUE7OztJQUdBLFVBQUEsS0FBQTs7R0FFQSxPQUFBLE1BQUEsT0FBQTs7Ozs7O0FDdkpBLENBQUEsWUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxrQkFBQSxVQUFBLFlBQUEsWUFBQTtFQUNBLElBQUEsV0FBQSxVQUFBO0lBQ0EsT0FBQTtNQUNBLE1BQUE7OztFQUdBLE9BQUE7R0FDQSxVQUFBOztHQUVBLFlBQUE7R0FDQSxPQUFBO0lBQ0EsTUFBQTs7R0FFQSxNQUFBLFVBQUEsUUFBQSxTQUFBLFFBQUE7SUFDQSxJQUFBLFVBQUEsUUFBQSxPQUFBLFlBQUE7SUFDQSxPQUFBO0lBQ0EsT0FBQTtJQUNBLElBQUEsUUFBQTtLQUNBLFNBQUE7S0FDQSxTQUFBLENBQUEsU0FBQTtLQUNBLElBQUEsR0FBQSxNQUFBLFNBQUEsTUFBQSxDQUFBLEdBQUEsSUFBQSxLQUFBO0tBQ0EsSUFBQSxHQUFBLE1BQUEsTUFBQSxTQUFBLEtBQUEsT0FBQSxDQUFBLEdBQUEsSUFBQSxNQUFBLENBQUEsR0FBQTs7O0tBR0EsVUFBQTtLQUNBLFdBQUE7S0FDQSxjQUFBOztJQUVBLElBQUEsTUFBQSxHQUFBLE9BQUEsUUFBQTs7O0lBR0EsSUFBQSxNQUFBLElBQUEsT0FBQTtNQUNBLEtBQUEsU0FBQSxRQUFBLFVBQUE7TUFDQSxLQUFBLFVBQUEsU0FBQSxVQUFBO01BQ0EsT0FBQTtNQUNBLEtBQUEsYUFBQSxlQUFBLENBQUEsU0FBQSxTQUFBLFNBQUEsV0FBQTs7Ozs7Ozs7SUFRQSxJQUFBLFlBQUEsR0FBQSxPQUFBO01BQ0EsS0FBQTtNQUNBLE1BQUEsVUFBQSxHQUFBO01BQ0EsT0FBQTs7O0lBR0EsSUFBQSxNQUFBLEdBQUEsSUFBQTtNQUNBLFdBQUEsVUFBQSxHQUFBO01BQ0EsT0FBQSxLQUFBLElBQUEsR0FBQSxLQUFBLElBQUEsSUFBQSxLQUFBLElBQUEsRUFBQSxFQUFBOztNQUVBLFNBQUEsVUFBQSxHQUFBO01BQ0EsT0FBQSxLQUFBLElBQUEsR0FBQSxLQUFBLElBQUEsSUFBQSxLQUFBLElBQUEsRUFBQSxFQUFBLElBQUEsRUFBQTs7TUFFQSxZQUFBLFVBQUEsR0FBQTtNQUNBLE9BQUEsS0FBQSxJQUFBLEdBQUEsRUFBQSxJQUFBLEVBQUEsRUFBQSxLQUFBLEVBQUE7O01BRUEsWUFBQSxVQUFBLEdBQUE7TUFDQSxPQUFBLEtBQUEsSUFBQSxHQUFBLEVBQUEsRUFBQSxJQUFBLEVBQUE7OztJQUdBLElBQUEsV0FBQTtLQUNBLFdBQUE7S0FDQSxXQUFBO0tBQ0EsV0FBQTs7O0lBR0EsSUFBQSxRQUFBLFVBQUEsTUFBQSxPQUFBOztJQUVBLElBQUEsT0FBQSxJQUFBLFVBQUEsUUFBQSxLQUFBO0lBQ0EsS0FBQSxRQUFBLE9BQUE7TUFDQSxLQUFBLE1BQUEsVUFBQSxHQUFBLEdBQUE7TUFDQSxPQUFBLFVBQUE7O01BRUEsS0FBQSxLQUFBO01BQ0EsS0FBQSxhQUFBO01BQ0EsS0FBQSxTQUFBLFVBQUEsR0FBQTtNQUNBLE9BQUEsRUFBQSxRQUFBLFdBQUE7O01BRUEsTUFBQSxRQUFBO01BQ0EsR0FBQSxTQUFBOztJQUVBLElBQUEsT0FBQSxJQUFBLFVBQUEsUUFBQSxLQUFBO0lBQ0EsSUFBQSxZQUFBLEtBQUEsUUFBQSxPQUFBO01BQ0EsTUFBQSxnQkFBQTtNQUNBLEtBQUEsZUFBQSxVQUFBLEdBQUE7TUFDQSxJQUFBLEVBQUE7T0FDQSxPQUFBOzs7T0FHQSxPQUFBOztNQUVBLEtBQUEsTUFBQSxVQUFBLEdBQUE7TUFDQSxPQUFBLFVBQUEsRUFBQTs7TUFFQSxLQUFBLFNBQUEsVUFBQSxHQUFBO01BQ0EsT0FBQTs7TUFFQSxLQUFBLE1BQUEsVUFBQSxHQUFBO01BQ0EsT0FBQSxFQUFBLFFBQUEsU0FBQTs7TUFFQSxLQUFBLGFBQUEsVUFBQSxHQUFBO01BQ0EsSUFBQSxZQUFBLENBQUEsRUFBQSxRQUFBLElBQUEsTUFBQSxLQUFBLFNBQUE7T0FDQSxjQUFBLEVBQUEsSUFBQSxNQUFBLElBQUEsQ0FBQTtPQUNBLFFBQUEsRUFBQSxFQUFBLElBQUEsRUFBQSxLQUFBLEtBQUEsTUFBQSxLQUFBLEtBQUEsTUFBQSxZQUFBLGFBQUE7T0FDQSxTQUFBLFNBQUEsWUFBQSxDQUFBLEtBQUE7T0FDQSxTQUFBLENBQUEsRUFBQSxFQUFBLEtBQUEsZUFBQTtPQUNBLFlBQUEsUUFBQSxLQUFBLENBQUEsTUFBQTtNQUNBLElBQUEsRUFBQSxRQUFBLFlBQUEsRUFBQSxRQUFBLFVBQUEsVUFBQTtNQUNBLElBQUEsRUFBQSxTQUFBLEdBQUE7T0FDQSxTQUFBLENBQUE7T0FDQSxTQUFBO09BQ0EsV0FBQTthQUNBLElBQUEsRUFBQSxTQUFBLEdBQUEsVUFBQSxDQUFBO1dBQ0EsSUFBQSxFQUFBLFNBQUEsR0FBQSxVQUFBLENBQUE7V0FDQSxJQUFBLEVBQUEsU0FBQSxHQUFBLFVBQUE7TUFDQSxPQUFBLFlBQUEsU0FBQSxnQkFBQSxTQUFBLGFBQUEsV0FBQTs7TUFFQSxHQUFBLFNBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUErQkEsVUFBQSxPQUFBO01BQ0EsS0FBQSxLQUFBO01BQ0EsS0FBQSxVQUFBLEdBQUE7O01BRUEsSUFBQSxFQUFBLFNBQUEsS0FBQSxFQUFBLFFBQUEsWUFBQSxFQUFBLFFBQUEsWUFBQSxFQUFBLFFBQUEsWUFBQSxFQUFBLFFBQUE7T0FDQSxPQUFBLEVBQUEsS0FBQSxNQUFBLEtBQUEsS0FBQSxPQUFBLEVBQUEsS0FBQSxNQUFBLEtBQUEsTUFBQTs7T0FFQSxPQUFBLEVBQUEsS0FBQSxNQUFBLEtBQUE7O0lBRUEsVUFBQSxPQUFBO01BQ0EsS0FBQSxLQUFBO01BQ0EsS0FBQSxNQUFBO01BQ0EsS0FBQSxVQUFBLEdBQUE7O01BRUEsSUFBQSxFQUFBLFNBQUEsS0FBQSxFQUFBLFFBQUEsWUFBQSxFQUFBLFFBQUEsWUFBQSxFQUFBLFFBQUEsWUFBQSxFQUFBLFFBQUE7T0FDQSxPQUFBLENBQUEsRUFBQSxLQUFBLE1BQUEsS0FBQSxNQUFBLE1BQUEsT0FBQSxFQUFBLEtBQUEsTUFBQSxLQUFBLE1BQUE7O09BRUEsT0FBQSxDQUFBLEVBQUEsS0FBQSxNQUFBLEtBQUEsTUFBQSxNQUFBLE9BQUEsRUFBQSxLQUFBLE1BQUEsS0FBQSxNQUFBOztJQUVBLFVBQUEsT0FBQTtNQUNBLEtBQUEsS0FBQTtNQUNBLEtBQUEsTUFBQTtNQUNBLEtBQUEsVUFBQSxHQUFBO01BQ0EsSUFBQSxFQUFBLFNBQUEsS0FBQSxFQUFBLFFBQUEsWUFBQSxFQUFBLFFBQUEsWUFBQSxFQUFBLFFBQUEsWUFBQSxFQUFBLFFBQUE7T0FDQSxPQUFBLENBQUEsRUFBQSxLQUFBLE1BQUEsS0FBQSxNQUFBLE1BQUEsT0FBQSxFQUFBLEtBQUEsTUFBQSxLQUFBLE1BQUE7O09BRUEsT0FBQSxDQUFBLEVBQUEsS0FBQSxNQUFBLEtBQUEsTUFBQSxNQUFBLE9BQUEsRUFBQSxLQUFBLE1BQUEsS0FBQSxNQUFBLElBQUE7OztJQUdBLFNBQUEsTUFBQSxHQUFBOztLQUVBLEtBQUE7T0FDQSxTQUFBO09BQ0EsVUFBQSxLQUFBLFNBQUE7Ozs7S0FJQSxLQUFBLE1BQUEsY0FBQSxVQUFBLEdBQUE7T0FDQSxPQUFBLFdBQUEsR0FBQSxLQUFBLE9BQUEsR0FBQSxPQUFBLE1BQUEsTUFBQTs7T0FFQTtPQUNBLFNBQUE7T0FDQSxVQUFBLGVBQUEsVUFBQSxHQUFBO09BQ0EsT0FBQSxZQUFBO1FBQ0EsSUFBQSxFQUFBO1NBQ0EsT0FBQTs7O1NBR0EsT0FBQTs7O09BR0EsVUFBQSxhQUFBLFVBQUEsR0FBQTtPQUNBLElBQUEsWUFBQSxDQUFBLEVBQUEsUUFBQSxJQUFBLE1BQUEsS0FBQSxTQUFBO09BQ0EsT0FBQSxZQUFBO1FBQ0EsSUFBQSxZQUFBLENBQUEsRUFBQSxRQUFBLElBQUEsTUFBQSxLQUFBLFNBQUE7U0FDQSxjQUFBLEVBQUEsSUFBQSxNQUFBLElBQUEsQ0FBQTtTQUNBLFFBQUEsRUFBQSxFQUFBLElBQUEsRUFBQSxLQUFBLEtBQUEsTUFBQSxLQUFBLEtBQUEsTUFBQSxZQUFBLGFBQUE7U0FDQSxTQUFBLFNBQUEsWUFBQSxDQUFBLEtBQUE7U0FDQSxTQUFBLENBQUEsRUFBQSxFQUFBLEtBQUEsZUFBQTtTQUNBLFlBQUEsUUFBQSxLQUFBLENBQUEsTUFBQTtRQUNBLElBQUEsRUFBQSxRQUFBLFlBQUEsRUFBQSxRQUFBLFVBQUEsVUFBQTtRQUNBLElBQUEsRUFBQSxTQUFBLEdBQUE7U0FDQSxTQUFBLENBQUE7U0FDQSxTQUFBO1NBQ0EsV0FBQTtlQUNBLElBQUEsRUFBQSxTQUFBLEdBQUEsVUFBQSxDQUFBO2FBQ0EsSUFBQSxFQUFBLFNBQUEsR0FBQSxVQUFBLENBQUE7YUFDQSxJQUFBLEVBQUEsU0FBQSxHQUFBLFVBQUE7UUFDQSxPQUFBLFlBQUEsU0FBQSxnQkFBQSxTQUFBLGFBQUEsV0FBQTs7O09BR0EsTUFBQSxnQkFBQSxVQUFBLEdBQUE7T0FDQSxPQUFBLFdBQUEsR0FBQSxLQUFBLElBQUE7O09BRUEsS0FBQSxPQUFBLFVBQUEsR0FBQTtPQUNBLEdBQUEsT0FBQSxNQUFBLE1BQUEsY0FBQSxXQUFBLEdBQUEsS0FBQSxPQUFBOzs7OztJQUtBLFNBQUEsV0FBQSxHQUFBLEdBQUE7S0FDQSxJQUFBLE1BQUEsR0FBQSxPQUFBO0tBQ0EsSUFBQSxFQUFBLFVBQUE7TUFDQSxPQUFBLEVBQUEsU0FBQSxLQUFBLFVBQUEsR0FBQTtPQUNBLE9BQUEsV0FBQSxHQUFBOzs7S0FHQSxPQUFBOzs7SUFHQSxTQUFBLFNBQUEsR0FBQTtLQUNBLE9BQUEsRUFBQTtLQUNBLElBQUEsRUFBQTtNQUNBLE9BQUEsRUFBQTtVQUNBO01BQ0EsSUFBQSxZQUFBOztNQUVBLElBQUEsSUFBQTtNQUNBLE9BQUEsRUFBQSxPQUFBLFNBQUEsTUFBQTtPQUNBO01BQ0EsSUFBQSxhQUFBLENBQUEsYUFBQSxJQUFBLElBQUE7TUFDQSxPQUFBLE9BQUEsTUFBQSxFQUFBLE9BQUEsT0FBQSxLQUFBLFlBQUEsS0FBQTs7Ozs7SUFLQSxTQUFBLFNBQUEsR0FBQTtLQUNBLElBQUEsS0FBQSxLQUFBO01BQ0EsS0FBQSxHQUFBLFlBQUEsRUFBQSxVQUFBLENBQUEsRUFBQSxHQUFBLEVBQUEsSUFBQSxFQUFBLEtBQUE7TUFDQSxLQUFBLEdBQUEsWUFBQSxFQUFBLFVBQUEsQ0FBQSxFQUFBLEdBQUE7TUFDQSxLQUFBLEdBQUEsWUFBQSxFQUFBLFNBQUEsQ0FBQSxFQUFBLElBQUEsS0FBQSxHQUFBOztLQUVBLE9BQUEsVUFBQSxHQUFBO01BQ0EsT0FBQSxVQUFBLEdBQUE7T0FDQSxFQUFBLE9BQUEsR0FBQTtPQUNBLEVBQUEsT0FBQSxHQUFBLElBQUEsTUFBQSxHQUFBO09BQ0EsT0FBQSxJQUFBOzs7OztJQUtBLFNBQUEsS0FBQSxHQUFBO0tBQ0EsT0FBQSxFQUFBLFdBQUEsS0FBQSxJQUFBLE1BQUEsTUFBQSxFQUFBLFNBQUEsSUFBQSxTQUFBLEVBQUEsSUFBQSxFQUFBOzs7Ozs7O0FDcFJBLENBQUEsWUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLDJCQUFBLFVBQUEsUUFBQTs7RUFFQSxPQUFBLFdBQUEsWUFBQTtHQUNBLE9BQUEsUUFBQTtJQUNBLFNBQUE7S0FDQSxPQUFBO01BQ0EsTUFBQTtNQUNBLFFBQUE7TUFDQSxZQUFBO09BQ0EsWUFBQTtPQUNBLFNBQUE7T0FDQSxVQUFBO09BQ0EsUUFBQTtPQUNBLE1BQUE7T0FDQSxZQUFBO09BQ0EsVUFBQTtRQUNBLE9BQUE7UUFDQSxTQUFBO1FBQ0EsVUFBQTtRQUNBLFFBQUE7OztNQUdBLFdBQUE7T0FDQSxZQUFBO09BQ0EsV0FBQTtPQUNBLFlBQUE7T0FDQSxnQkFBQTtPQUNBLFdBQUE7T0FDQSxrQkFBQTtPQUNBLFlBQUE7T0FDQSxXQUFBO09BQ0EsYUFBQTtPQUNBLGlCQUFBOztPQUVBLFVBQUE7UUFDQSxRQUFBO1FBQ0EsT0FBQTs7T0FFQSxVQUFBO09BQ0EsUUFBQTtPQUNBLGVBQUE7T0FDQSxNQUFBOzs7O0lBSUEsTUFBQTs7R0FFQSxPQUFBLE9BQUE7O0VBRUEsSUFBQSxZQUFBLFVBQUEsTUFBQTtHQUNBLElBQUEsV0FBQTtHQUNBLFFBQUEsUUFBQSxNQUFBLFVBQUEsTUFBQTtJQUNBLElBQUEsUUFBQTtLQUNBLFFBQUEsS0FBQTtLQUNBLFFBQUEsS0FBQTtLQUNBLFNBQUEsS0FBQTtLQUNBLFlBQUEsVUFBQSxLQUFBOztJQUVBLEdBQUEsS0FBQSxNQUFBO0tBQ0EsTUFBQSxRQUFBLEtBQUE7O0lBRUEsR0FBQSxLQUFBLEtBQUE7S0FDQSxNQUFBLE9BQUEsS0FBQTs7SUFFQSxTQUFBLEtBQUE7O0dBRUEsT0FBQTs7RUFFQSxPQUFBLGlCQUFBLFlBQUE7R0FDQSxJQUFBLFlBQUE7SUFDQSxRQUFBLE9BQUEsS0FBQTtJQUNBLFNBQUEsT0FBQSxLQUFBO0lBQ0EsWUFBQSxVQUFBLE9BQUEsS0FBQTtJQUNBLFFBQUE7O0dBRUEsT0FBQSxNQUFBLE9BQUE7R0FDQSxPQUFBOztFQUVBLE9BQUEsT0FBQSxRQUFBLFVBQUEsR0FBQSxHQUFBO0dBQ0EsSUFBQSxDQUFBLEdBQUE7SUFDQTs7R0FFQSxPQUFBOzs7OztBQUtBIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHR2YXIgYXBwID0gYW5ndWxhci5tb2R1bGUoJ2FwcCcsXG5cdFx0W1xuXHRcdCdhcHAuY29udHJvbGxlcnMnLFxuXHRcdCdhcHAuZmlsdGVycycsXG5cdFx0J2FwcC5zZXJ2aWNlcycsXG5cdFx0J2FwcC5kaXJlY3RpdmVzJyxcblx0XHQnYXBwLnJvdXRlcycsXG5cdFx0J2FwcC5jb25maWcnXG5cdFx0XSk7XG5cblxuXHRcdGFuZ3VsYXIubW9kdWxlKCdhcHAucm91dGVzJywgWyd1aS5yb3V0ZXInLCAnbmdTdG9yYWdlJywgJ3NhdGVsbGl6ZXInXSk7XG5cdFx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycsIFsnbmdBbmltYXRlJywndWkudHJlZScsJ3RvYXN0cicsJ3VpLnJvdXRlcicsICdtZC5kYXRhLnRhYmxlJywgJ25nTWF0ZXJpYWwnLCAnbmdTdG9yYWdlJywgJ3Jlc3Rhbmd1bGFyJywgJ25nTWRJY29ucycsICdhbmd1bGFyLWxvYWRpbmctYmFyJywgJ25nTWVzc2FnZXMnLCAnbmdTYW5pdGl6ZScsIFwibGVhZmxldC1kaXJlY3RpdmVcIiwnbnZkMyddKTtcblx0XHRhbmd1bGFyLm1vZHVsZSgnYXBwLmZpbHRlcnMnLCBbXSk7XG5cdFx0YW5ndWxhci5tb2R1bGUoJ2FwcC5zZXJ2aWNlcycsIFsndWkucm91dGVyJywgJ25nU3RvcmFnZScsICdyZXN0YW5ndWxhcicsICd0b2FzdHInXSk7XG5cdFx0YW5ndWxhci5tb2R1bGUoJ2FwcC5kaXJlY3RpdmVzJywgWyduZ01hdGVyaWFsJywnbmdQYXBhUGFyc2UnXSk7XG5cdFx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb25maWcnLCBbXSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLnJvdXRlcycpLmNvbmZpZyhmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlcikge1xuXG5cdFx0dmFyIGdldFZpZXcgPSBmdW5jdGlvbiAodmlld05hbWUpIHtcblx0XHRcdHJldHVybiAnL3ZpZXdzL2FwcC8nICsgdmlld05hbWUgKyAnLycgKyB2aWV3TmFtZSArICcuaHRtbCc7XG5cdFx0fTtcblxuXHRcdCR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UoJy9pbmRleC9lcGknKTtcblxuXHRcdCRzdGF0ZVByb3ZpZGVyXG5cdFx0XHQuc3RhdGUoJ2FwcCcsIHtcblx0XHRcdFx0YWJzdHJhY3Q6IHRydWUsXG5cdFx0XHRcdHZpZXdzOiB7XG5cdFx0XHRcdFx0aGVhZGVyOiB7XG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogZ2V0VmlldygnaGVhZGVyJyksXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiAnSGVhZGVyQ3RybCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyQXM6ICd2bSdcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdG1haW46IHt9LFxuXHRcdFx0XHRcdCdtYXBAJzoge1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6IGdldFZpZXcoJ21hcCcpLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlcjogJ01hcEN0cmwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlckFzOiAndm0nXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdFx0LnN0YXRlKCdhcHAudXNlcicsIHtcblx0XHRcdFx0dXJsOiAnL3VzZXInLFxuXHRcdFx0XHRhYnN0cmFjdDogdHJ1ZVxuXG5cdFx0XHR9KVxuXHRcdFx0LnN0YXRlKCdhcHAudXNlci5sb2dpbicsIHtcblx0XHRcdFx0dXJsOiAnL2xvZ2luJyxcblx0XHRcdFx0dmlld3M6IHtcblx0XHRcdFx0XHQnbWFpbkAnOiB7XG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogZ2V0VmlldygnbG9naW4nKSxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdMb2dpbkN0cmwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlckFzOiAndm0nXG5cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLnVzZXIucHJvZmlsZScsIHtcblx0XHRcdFx0dXJsOiAnL215LXByb2ZpbGUnLFxuXHRcdFx0XHR2aWV3czoge1xuXHRcdFx0XHRcdCdtYWluQCc6IHtcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiBnZXRWaWV3KCd1c2VyJyksXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiAnVXNlckN0cmwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlckFzOiAndm0nLFxuXHRcdFx0XHRcdFx0cmVzb2x2ZToge1xuXHRcdFx0XHRcdFx0XHRwcm9maWxlOiBmdW5jdGlvbiAoRGF0YVNlcnZpY2UsICRhdXRoKSB7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIERhdGFTZXJ2aWNlLmdldE9uZSgnbWUnKS4kb2JqZWN0O1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdH0pXG5cdFx0XHQuc3RhdGUoJ2FwcC5pbmRleCcsIHtcblx0XHRcdFx0YWJzdHJhY3Q6IHRydWUsXG5cdFx0XHRcdHVybDogJy9pbmRleCcsXG5cdFx0XHRcdHZpZXdzOiB7XG5cdFx0XHRcdFx0J21haW5AJzoge1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6IGdldFZpZXcoJ2luZGV4JyksXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiAnSW5kZXhiYXNlQ3RybCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyQXM6ICd2bSdcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cdFx0XHQuc3RhdGUoJ2FwcC5pbmRleC5jcmVhdGUnLCB7XG5cdFx0XHRcdHVybDogJy9jcmVhdGUnLFxuXHRcdFx0XHR2aWV3czoge1xuXHRcdFx0XHRcdCdpbmZvJzoge1xuXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHQnbWVudSc6IHtcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdpbmRleGNyZWF0b3InKSxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdJbmRleGNyZWF0b3JDdHJsJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLmluZGV4LmNyZWF0ZS5jaGVjaycsIHtcblx0XHRcdFx0dXJsOiAnL2NoZWNraW5nJ1xuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLmluZGV4LmNyZWF0ZS5tZXRhJywge1xuXHRcdFx0XHR1cmw6ICcvYWRkaW5nLW1ldGEtZGF0YSdcblx0XHRcdH0pXG5cdFx0XHQuc3RhdGUoJ2FwcC5pbmRleC5jcmVhdGUuZmluYWwnLCB7XG5cdFx0XHRcdHVybDogJy9hZGRpbmctbWV0YS1kYXRhJ1xuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLmluZGV4LnNob3cnLCB7XG5cdFx0XHRcdHVybDogJy86aW5kZXgnLFxuXHRcdFx0XHR2aWV3czoge1xuXHRcdFx0XHRcdCdpbmZvJzoge1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICcvdmlld3MvYXBwL2luZGV4L2luZm8uaHRtbCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiAnSW5kZXhDdHJsJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXJBczogJ3ZtJyxcblx0XHRcdFx0XHRcdHJlc29sdmU6IHtcblx0XHRcdFx0XHRcdFx0aW5pdGlhbERhdGE6IGZ1bmN0aW9uIChEYXRhU2VydmljZSwgJHN0YXRlUGFyYW1zKSB7XG5cdFx0XHRcdFx0XHRcdFx0dmFyIGQgPSBEYXRhU2VydmljZS5nZXRBbGwoJ2luZGV4LycgKyAkc3RhdGVQYXJhbXMuaW5kZXggKyAnL3llYXIvMjAxNCcpO1xuXHRcdFx0XHRcdFx0XHRcdHZhciBpID0gRGF0YVNlcnZpY2UuZ2V0T25lKCdpbmRleC8nICsgJHN0YXRlUGFyYW1zLmluZGV4ICsgJy9zdHJ1Y3R1cmUnKTtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdFx0XHRcdFx0ZGF0YU9iamVjdDogZC4kb2JqZWN0LFxuXHRcdFx0XHRcdFx0XHRcdFx0aW5kZXhlck9iamVjdDogaS4kb2JqZWN0LFxuXHRcdFx0XHRcdFx0XHRcdFx0ZGF0YTogZCxcblx0XHRcdFx0XHRcdFx0XHRcdGluZGV4ZXI6IGlcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdCdzZWxlY3RlZCc6IHtcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiAnL3ZpZXdzL2FwcC9pbmRleC9zZWxlY3RlZC5odG1sJyxcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cdFx0XHQuc3RhdGUoJ2FwcC5pbmRleC5zaG93LnNlbGVjdGVkJywge1xuXHRcdFx0XHR1cmw6ICcvOml0ZW0nLFxuXHRcdFx0XHQvKnZpZXdzOntcblx0XHRcdFx0XHQnc2VsZWN0ZWQnOntcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdzZWxlY3RlZCcpLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlcjogJ1NlbGVjdGVkQ3RybCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyQXM6ICd2bScsXG5cdFx0XHRcdFx0XHRyZXNvbHZlOntcblx0XHRcdFx0XHRcdFx0Z2V0Q291bnRyeTogZnVuY3Rpb24oRGF0YVNlcnZpY2UsICRzdGF0ZVBhcmFtcyl7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIERhdGFTZXJ2aWNlLmdldE9uZSgnbmF0aW9ucycsICRzdGF0ZVBhcmFtcy5pdGVtKS4kb2JqZWN0O1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9Ki9cblx0XHRcdH0pXG5cdFx0XHQuc3RhdGUoJ2FwcC5pbmRleC5zaG93LnNlbGVjdGVkLmNvbXBhcmUnLCB7XG5cdFx0XHRcdHVybDogJy9jb21wYXJlLzpjb3VudHJpZXMnXG5cdFx0XHR9KVxuXHRcdFx0LnN0YXRlKCdhcHAuaW1wb3J0Y3N2Jywge1xuXHRcdFx0XHR1cmw6ICcvaW1wb3J0ZXInLFxuXHRcdFx0XHRkYXRhOiB7XG5cdFx0XHRcdFx0cGFnZU5hbWU6ICdJbXBvcnQgQ1NWJ1xuXHRcdFx0XHR9LFxuXHRcdFx0XHR2aWV3czoge1xuXHRcdFx0XHRcdCdtYWluQCc6IHtcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdpbXBvcnRjc3YnKVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0J21hcCc6IHt9XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXG5cblxuXHR9KTtcbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5yb3V0ZXMnKS5ydW4oZnVuY3Rpb24oJHJvb3RTY29wZSwgJG1kU2lkZW5hdil7XG5cdFx0JHJvb3RTY29wZS4kb24oXCIkc3RhdGVDaGFuZ2VTdGFydFwiLCBmdW5jdGlvbihldmVudCwgdG9TdGF0ZSl7XG5cblx0XHRcdGlmICh0b1N0YXRlLmRhdGEgJiYgdG9TdGF0ZS5kYXRhLnBhZ2VOYW1lKXtcblx0XHRcdFx0JHJvb3RTY29wZS5jdXJyZW50X3BhZ2UgPSB0b1N0YXRlLmRhdGEucGFnZU5hbWU7XG5cdFx0XHR9XG5cdFx0XHQgJHJvb3RTY29wZS5zdGF0ZUlzTG9hZGluZyA9IHRydWU7XG5cdFx0fSk7XG5cdFx0JHJvb3RTY29wZS4kb24oXCIkdmlld0NvbnRlbnRMb2FkZWRcIiwgZnVuY3Rpb24oZXZlbnQsIHRvU3RhdGUpe1xuXG5cdFx0fSk7XG5cblx0XHQkcm9vdFNjb3BlLiRvbihcIiRzdGF0ZUNoYW5nZVN1Y2Nlc3NcIiwgZnVuY3Rpb24oZXZlbnQsIHRvU3RhdGUpe1xuXHRcdFx0JHJvb3RTY29wZS5zdGF0ZUlzTG9hZGluZyA9IGZhbHNlO1xuXHRcdH0pO1xuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbiAoKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29uZmlnJykuY29uZmlnKGZ1bmN0aW9uICgkYXV0aFByb3ZpZGVyKXtcbiAgICAgICAgLy8gU2F0ZWxsaXplciBjb25maWd1cmF0aW9uIHRoYXQgc3BlY2lmaWVzIHdoaWNoIEFQSVxuICAgICAgICAvLyByb3V0ZSB0aGUgSldUIHNob3VsZCBiZSByZXRyaWV2ZWQgZnJvbVxuICAgICAgICAkYXV0aFByb3ZpZGVyLmxvZ2luVXJsID0gJy9hcGkvYXV0aGVudGljYXRlL2F1dGgnO1xuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbmZpZycpLmNvbmZpZyhmdW5jdGlvbiAoY2ZwTG9hZGluZ0JhclByb3ZpZGVyKXtcblx0XHRjZnBMb2FkaW5nQmFyUHJvdmlkZXIuaW5jbHVkZVNwaW5uZXIgPSBmYWxzZTtcblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb25maWcnKS5jb25maWcoIGZ1bmN0aW9uKFJlc3Rhbmd1bGFyUHJvdmlkZXIpIHtcblx0XHRSZXN0YW5ndWxhclByb3ZpZGVyXG5cdFx0LnNldEJhc2VVcmwoJy9hcGkvJylcblx0XHQuc2V0RGVmYXVsdEhlYWRlcnMoeyBhY2NlcHQ6IFwiYXBwbGljYXRpb24veC5sYXJhdmVsLnYxK2pzb25cIiB9KTtcblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb25maWcnKS5jb25maWcoZnVuY3Rpb24oJG1kVGhlbWluZ1Byb3ZpZGVyKSB7XG5cdFx0LyogRm9yIG1vcmUgaW5mbywgdmlzaXQgaHR0cHM6Ly9tYXRlcmlhbC5hbmd1bGFyanMub3JnLyMvVGhlbWluZy8wMV9pbnRyb2R1Y3Rpb24gKi9cblx0dmFyIG5lb25UZWFsTWFwID0gJG1kVGhlbWluZ1Byb3ZpZGVyLmV4dGVuZFBhbGV0dGUoJ3RlYWwnLCB7XG4gICAgJzUwMCc6ICcwMGNjYWEnLFxuXHRcdCdBMjAwJzogJzAwY2NhYSdcbiAgfSk7XG5cdHZhciB3aGl0ZU1hcCA9ICRtZFRoZW1pbmdQcm92aWRlci5leHRlbmRQYWxldHRlKCd0ZWFsJywge1xuICAgICc1MDAnOiAnMDBjY2FhJyxcblx0XHQnQTIwMCc6ICcjZmZmJ1xuICB9KTtcblx0dmFyIGJsdWVNYXAgPSAkbWRUaGVtaW5nUHJvdmlkZXIuZXh0ZW5kUGFsZXR0ZSgnYmx1ZScsIHtcbiAgICAnNTAwJzogJyMwMDZiYjknLFxuXHRcdCdBMjAwJzogJyMwMDZiYjknXG4gIH0pO1xuXHQkbWRUaGVtaW5nUHJvdmlkZXIuZGVmaW5lUGFsZXR0ZSgnbmVvblRlYWwnLCBuZW9uVGVhbE1hcCk7XG5cdCRtZFRoZW1pbmdQcm92aWRlci5kZWZpbmVQYWxldHRlKCd3aGl0ZVRlYWwnLCB3aGl0ZU1hcCk7XG5cdCRtZFRoZW1pbmdQcm92aWRlci5kZWZpbmVQYWxldHRlKCdibHVlcicsIGJsdWVNYXApO1xuXHRcdCRtZFRoZW1pbmdQcm92aWRlci50aGVtZSgnZGVmYXVsdCcpXG5cdFx0LnByaW1hcnlQYWxldHRlKCduZW9uVGVhbCcpXG5cdFx0LmFjY2VudFBhbGV0dGUoJ2JsdWVyJyk7XG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbmZpZycpLmNvbmZpZyhmdW5jdGlvbih0b2FzdHJDb25maWcpe1xuICAgICAgICAvL1xuICAgICAgICBhbmd1bGFyLmV4dGVuZCh0b2FzdHJDb25maWcsIHtcbiAgICAgICAgICBhdXRvRGlzbWlzczogZmFsc2UsXG4gICAgICAgICAgY29udGFpbmVySWQ6ICd0b2FzdC1jb250YWluZXInLFxuICAgICAgICAgIG1heE9wZW5lZDogMCxcbiAgICAgICAgICBuZXdlc3RPblRvcDogdHJ1ZSxcbiAgICAgICAgICBwb3NpdGlvbkNsYXNzOiAndG9hc3QtYm90dG9tLXJpZ2h0JyxcbiAgICAgICAgICBwcmV2ZW50RHVwbGljYXRlczogZmFsc2UsXG4gICAgICAgICAgcHJldmVudE9wZW5EdXBsaWNhdGVzOiBmYWxzZSxcbiAgICAgICAgICB0YXJnZXQ6ICdib2R5JyxcbiAgICAgICAgICBjbG9zZUJ1dHRvbjogdHJ1ZVxuICAgICAgICB9KTtcbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5maWx0ZXJzJykuZmlsdGVyKCAnYWxwaGFudW0nLCBmdW5jdGlvbigpe1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oIGlucHV0ICl7XG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgaWYgKCAhaW5wdXQgKXtcbiAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gaW5wdXQucmVwbGFjZSgvKFteMC05QS1aXSkvZyxcIlwiKTtcblxuICAgICAgICB9XG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5maWx0ZXJzJykuZmlsdGVyKCAnY2FwaXRhbGl6ZScsIGZ1bmN0aW9uKCl7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uKGlucHV0LCBhbGwpIHtcblx0XHRcdHJldHVybiAoISFpbnB1dCkgPyBpbnB1dC5yZXBsYWNlKC8oW15cXFdfXStbXlxccy1dKikgKi9nLGZ1bmN0aW9uKHR4dCl7XG5cdFx0XHRcdHJldHVybiB0eHQuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyB0eHQuc3Vic3RyKDEpLnRvTG93ZXJDYXNlKCk7XG5cdFx0XHR9KSA6ICcnO1xuXHRcdH07XG5cdH0pO1xufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmZpbHRlcnMnKS5maWx0ZXIoICdodW1hblJlYWRhYmxlJywgZnVuY3Rpb24oKXtcblx0XHRyZXR1cm4gZnVuY3Rpb24gaHVtYW5pemUoc3RyKSB7XG5cdFx0XHRpZiAoICFzdHIgKXtcblx0XHRcdFx0cmV0dXJuICcnO1xuXHRcdFx0fVxuXHRcdFx0dmFyIGZyYWdzID0gc3RyLnNwbGl0KCdfJyk7XG5cdFx0XHRmb3IgKHZhciBpPTA7IGk8ZnJhZ3MubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0ZnJhZ3NbaV0gPSBmcmFnc1tpXS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIGZyYWdzW2ldLnNsaWNlKDEpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGZyYWdzLmpvaW4oJyAnKTtcblx0XHR9O1xuXHR9KTtcbn0pKCk7IiwiKGZ1bmN0aW9uKCl7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5maWx0ZXJzJykuZmlsdGVyKCd0cnVuY2F0ZUNoYXJhY3RlcnMnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoaW5wdXQsIGNoYXJzLCBicmVha09uV29yZCkge1xuICAgICAgICAgICAgaWYgKGlzTmFOKGNoYXJzKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpbnB1dDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChjaGFycyA8PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICcnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGlucHV0ICYmIGlucHV0Lmxlbmd0aCA+IGNoYXJzKSB7XG4gICAgICAgICAgICAgICAgaW5wdXQgPSBpbnB1dC5zdWJzdHJpbmcoMCwgY2hhcnMpO1xuXG4gICAgICAgICAgICAgICAgaWYgKCFicmVha09uV29yZCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgbGFzdHNwYWNlID0gaW5wdXQubGFzdEluZGV4T2YoJyAnKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gR2V0IGxhc3Qgc3BhY2VcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxhc3RzcGFjZSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlucHV0ID0gaW5wdXQuc3Vic3RyKDAsIGxhc3RzcGFjZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB3aGlsZSAoaW5wdXQuY2hhckF0KGlucHV0Lmxlbmd0aC0xKSA9PT0gJyAnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbnB1dCA9IGlucHV0LnN1YnN0cigwLCBpbnB1dC5sZW5ndGggLSAxKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gaW5wdXQgKyAnLi4uJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBpbnB1dDtcbiAgICAgICAgfTtcbiAgICB9KTtcbn0pKCk7IiwiKGZ1bmN0aW9uKCl7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5maWx0ZXJzJykuZmlsdGVyKCd0cnVuY2F0ZVdvcmRzJywgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGlucHV0LCB3b3Jkcykge1xuICAgICAgICAgICAgaWYgKGlzTmFOKHdvcmRzKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpbnB1dDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh3b3JkcyA8PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICcnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGlucHV0KSB7XG4gICAgICAgICAgICAgICAgdmFyIGlucHV0V29yZHMgPSBpbnB1dC5zcGxpdCgvXFxzKy8pO1xuICAgICAgICAgICAgICAgIGlmIChpbnB1dFdvcmRzLmxlbmd0aCA+IHdvcmRzKSB7XG4gICAgICAgICAgICAgICAgICAgIGlucHV0ID0gaW5wdXRXb3Jkcy5zbGljZSgwLCB3b3Jkcykuam9pbignICcpICsgJy4uLic7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGlucHV0O1xuICAgICAgICB9O1xuICAgIH0pO1xufSkoKTsiLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5maWx0ZXJzJykuZmlsdGVyKCAndHJ1c3RIdG1sJywgZnVuY3Rpb24oICRzY2UgKXtcblx0XHRyZXR1cm4gZnVuY3Rpb24oIGh0bWwgKXtcblx0XHRcdHJldHVybiAkc2NlLnRydXN0QXNIdG1sKGh0bWwpO1xuXHRcdH07XG5cdH0pO1xufSkoKTsiLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5maWx0ZXJzJykuZmlsdGVyKCd1Y2ZpcnN0JywgZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uKCBpbnB1dCApIHtcblx0XHRcdGlmICggIWlucHV0ICl7XG5cdFx0XHRcdHJldHVybiBudWxsO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGlucHV0LnN1YnN0cmluZygwLCAxKS50b1VwcGVyQ2FzZSgpICsgaW5wdXQuc3Vic3RyaW5nKDEpO1xuXHRcdH07XG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLnNlcnZpY2VzJykuZmFjdG9yeSgnVmVjdG9ybGF5ZXJTZXJ2aWNlJywgZnVuY3Rpb24oKXtcblxuICAgICAgICByZXR1cm57XG4gICAgICAgICAgZGF0YTp7XG4gICAgICAgICAgICBsYXllcjogJycsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBzZXRMYXllcjogZnVuY3Rpb24obCl7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5kYXRhLmxheWVyID0gbDtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGdldExheWVyOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGF0YS5sYXllcjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5zZXJ2aWNlcycpLmZhY3RvcnkoJ0RhdGFTZXJ2aWNlJywgRGF0YVNlcnZpY2UpO1xuICAgIERhdGFTZXJ2aWNlLiRpbmplY3QgPSBbJ1Jlc3Rhbmd1bGFyJywndG9hc3RyJ107XG5cbiAgICBmdW5jdGlvbiBEYXRhU2VydmljZShSZXN0YW5ndWxhciwgdG9hc3RyKXtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBnZXRBbGw6IGdldEFsbCxcbiAgICAgICAgICBnZXRPbmU6IGdldE9uZSxcbiAgICAgICAgICBwb3N0OiBwb3N0XG4gICAgICAgIH07XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0QWxsKHJvdXRlKXtcbiAgICAgICAgICB2YXIgZGF0YSA9IFJlc3Rhbmd1bGFyLmFsbChyb3V0ZSkuZ2V0TGlzdCgpO1xuICAgICAgICAgICAgZGF0YS50aGVuKGZ1bmN0aW9uKCl7fSwgZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgICAgICAgIHRvYXN0ci5lcnJvcihkYXRhLnN0YXR1c1RleHQsICdDb25uZWN0aW9uIEVycm9yJyk7XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBnZXRPbmUocm91dGUsIGlkKXtcbiAgICAgICAgICByZXR1cm4gUmVzdGFuZ3VsYXIub25lKHJvdXRlLCBpZCkuZ2V0KCk7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gcG9zdChyb3V0ZSwgZGF0YSl7XG4gICAgICAgICAgcmV0dXJuIFJlc3Rhbmd1bGFyLmFsbChyb3V0ZSkucG9zdChkYXRhKTtcbiAgICAgICAgfVxuICAgIH1cblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZShcImFwcC5zZXJ2aWNlc1wiKS5mYWN0b3J5KCdEaWFsb2dTZXJ2aWNlJywgZnVuY3Rpb24oJG1kRGlhbG9nKXtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRmcm9tVGVtcGxhdGU6IGZ1bmN0aW9uKHRlbXBsYXRlLCAkc2NvcGUpe1xuXG5cdFx0XHRcdHZhciBvcHRpb25zID0ge1xuXHRcdFx0XHRcdHRlbXBsYXRlVXJsOiAnLi92aWV3cy9kaWFsb2dzLycgKyB0ZW1wbGF0ZSArICcvJyArIHRlbXBsYXRlICsgJy5odG1sJ1xuXHRcdFx0XHR9O1xuXG5cdFx0XHRcdGlmICgkc2NvcGUpe1xuXHRcdFx0XHRcdG9wdGlvbnMuc2NvcGUgPSAkc2NvcGUuJG5ldygpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuICRtZERpYWxvZy5zaG93KG9wdGlvbnMpO1xuXHRcdFx0fSxcblxuXHRcdFx0aGlkZTogZnVuY3Rpb24oKXtcblx0XHRcdFx0cmV0dXJuICRtZERpYWxvZy5oaWRlKCk7XG5cdFx0XHR9LFxuXG5cdFx0XHRhbGVydDogZnVuY3Rpb24odGl0bGUsIGNvbnRlbnQpe1xuXHRcdFx0XHQkbWREaWFsb2cuc2hvdyhcblx0XHRcdFx0XHQkbWREaWFsb2cuYWxlcnQoKVxuXHRcdFx0XHRcdFx0LnRpdGxlKHRpdGxlKVxuXHRcdFx0XHRcdFx0LmNvbnRlbnQoY29udGVudClcblx0XHRcdFx0XHRcdC5vaygnT2snKVxuXHRcdFx0XHQpO1xuXHRcdFx0fSxcblxuXHRcdFx0Y29uZmlybTogZnVuY3Rpb24odGl0bGUsIGNvbnRlbnQpIHtcblx0XHRcdFx0cmV0dXJuICRtZERpYWxvZy5zaG93KFxuXHRcdFx0XHRcdCRtZERpYWxvZy5jb25maXJtKClcblx0XHRcdFx0XHRcdC50aXRsZSh0aXRsZSlcblx0XHRcdFx0XHRcdC5jb250ZW50KGNvbnRlbnQpXG5cdFx0XHRcdFx0XHQub2soJ09rJylcblx0XHRcdFx0XHRcdC5jYW5jZWwoJ0NhbmNlbCcpXG5cdFx0XHRcdCk7XG5cdFx0XHR9XG5cdFx0fTtcblx0fSk7XG59KSgpOyIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5zZXJ2aWNlcycpLmZhY3RvcnkoJ0ljb25zU2VydmljZScsIGZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciB1bmljb2RlcyA9IHtcbiAgICAgICAgICAnZW1wdHknOiBcIlxcdWU2MDBcIixcbiAgICAgICAgICAnYWdyYXInOiBcIlxcdWU2MDBcIixcbiAgICAgICAgICAnYW5jaG9yJzogXCJcXHVlNjAxXCIsXG4gICAgICAgICAgJ2J1dHRlcmZseSc6IFwiXFx1ZTYwMlwiLFxuICAgICAgICAgICdlbmVyZ3knOlwiXFx1ZTYwM1wiLFxuICAgICAgICAgICdzaW5rJzogXCJcXHVlNjA0XCIsXG4gICAgICAgICAgJ21hbic6IFwiXFx1ZTYwNVwiLFxuICAgICAgICAgICdmYWJyaWMnOiBcIlxcdWU2MDZcIixcbiAgICAgICAgICAndHJlZSc6XCJcXHVlNjA3XCIsXG4gICAgICAgICAgJ3dhdGVyJzpcIlxcdWU2MDhcIlxuICAgICAgICB9O1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGdldFVuaWNvZGU6IGZ1bmN0aW9uKGljb24pe1xuICAgICAgICAgICAgcmV0dXJuIHVuaWNvZGVzW2ljb25dO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKFwiYXBwLnNlcnZpY2VzXCIpLmZhY3RvcnkoJ1RvYXN0U2VydmljZScsIGZ1bmN0aW9uKCRtZFRvYXN0KXtcblxuXHRcdHZhciBkZWxheSA9IDYwMDAsXG5cdFx0XHRwb3NpdGlvbiA9ICd0b3AgcmlnaHQnLFxuXHRcdFx0YWN0aW9uID0gJ09LJztcblxuXHRcdHJldHVybiB7XG5cdFx0XHRzaG93OiBmdW5jdGlvbihjb250ZW50KXtcblx0XHRcdFx0aWYgKCFjb250ZW50KXtcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm4gJG1kVG9hc3Quc2hvdyhcblx0XHRcdFx0XHQkbWRUb2FzdC5zaW1wbGUoKVxuXHRcdFx0XHRcdFx0LmNvbnRlbnQoY29udGVudClcblx0XHRcdFx0XHRcdC5wb3NpdGlvbihwb3NpdGlvbilcblx0XHRcdFx0XHRcdC5hY3Rpb24oYWN0aW9uKVxuXHRcdFx0XHRcdFx0LmhpZGVEZWxheShkZWxheSlcblx0XHRcdFx0KTtcblx0XHRcdH0sXG5cdFx0XHRlcnJvcjogZnVuY3Rpb24oY29udGVudCl7XG5cdFx0XHRcdGlmICghY29udGVudCl7XG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuICRtZFRvYXN0LnNob3coXG5cdFx0XHRcdFx0JG1kVG9hc3Quc2ltcGxlKClcblx0XHRcdFx0XHRcdC5jb250ZW50KGNvbnRlbnQpXG5cdFx0XHRcdFx0XHQucG9zaXRpb24ocG9zaXRpb24pXG5cdFx0XHRcdFx0XHQudGhlbWUoJ3dhcm4nKVxuXHRcdFx0XHRcdFx0LmFjdGlvbihhY3Rpb24pXG5cdFx0XHRcdFx0XHQuaGlkZURlbGF5KGRlbGF5KVxuXHRcdFx0XHQpO1xuXHRcdFx0fVxuXHRcdH07XG5cdH0pO1xufSkoKTsiLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0hlYWRlckN0cmwnLCBmdW5jdGlvbigkc2NvcGUsICRyb290U2NvcGUsICRhdXRoLCB0b2FzdHIpe1xuXG5cdFx0dmFyIHZtID0gdGhpcztcblx0XHR2bS5pc0F1dGhlbnRpY2F0ZWQgPSBpc0F1dGhlbnRpY2F0ZWQ7XG5cdFx0dm0uZG9Mb2dvdXQgPSBkb0xvZ291dDtcblx0XHR2bS5vcGVuTWVudSA9IG9wZW5NZW51O1xuXG5cdFx0ZnVuY3Rpb24gaXNBdXRoZW50aWNhdGVkKCl7XG5cdFx0XHQgcmV0dXJuICRhdXRoLmlzQXV0aGVudGljYXRlZCgpO1xuXHRcdH1cblx0XHRmdW5jdGlvbiBkb0xvZ291dCgpe1xuXHRcdFx0aWYoJGF1dGguaXNBdXRoZW50aWNhdGVkKCkpe1xuXHRcdFx0XHQkYXV0aC5sb2dvdXQoKS50aGVuKGZ1bmN0aW9uKGRhdGEpe1xuXHRcdFx0XHRcdHRvYXN0ci5zdWNjZXNzKCdZb3UgaGF2ZSBzdWNjZXNzZnVsbHkgbG9nZ2VkIG91dCcpO1xuXHRcdFx0XHR9KS5jYXRjaChmdW5jdGlvbihyZXNwb25zZSl7XG5cblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHZhciBvcmlnaW5hdG9yRXY7XG4gICAgZnVuY3Rpb24gb3Blbk1lbnUoJG1kT3Blbk1lbnUsIGV2KSB7XG4gICAgICBvcmlnaW5hdG9yRXYgPSBldjtcbiAgICAgICRtZE9wZW5NZW51KGV2KTtcbiAgICB9O1xuXHRcdCRzY29wZS4kd2F0Y2goZnVuY3Rpb24oKXtcblx0XHRcdHJldHVybiAkcm9vdFNjb3BlLmN1cnJlbnRfcGFnZTtcblx0XHR9LCBmdW5jdGlvbihuZXdQYWdlKXtcblx0XHRcdCRzY29wZS5jdXJyZW50X3BhZ2UgPSBuZXdQYWdlIHx8ICdQYWdlIE5hbWUnO1xuXHRcdH0pO1xuXG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0ltcG9ydGNzdkN0cmwnLCBmdW5jdGlvbiAoJG1kRGlhbG9nKSB7XG5cdFx0dGhpcy5zZXR0aW5ncyA9IHtcblx0XHRcdHByaW50TGF5b3V0OiB0cnVlLFxuXHRcdFx0c2hvd1J1bGVyOiB0cnVlLFxuXHRcdFx0c2hvd1NwZWxsaW5nU3VnZ2VzdGlvbnM6IHRydWUsXG5cdFx0XHRwcmVzZW50YXRpb25Nb2RlOiAnZWRpdCdcblx0XHR9O1xuXG5cdFx0dGhpcy5zYW1wbGVBY3Rpb24gPSBmdW5jdGlvbiAobmFtZSwgZXYpIHtcblx0XHRcdCRtZERpYWxvZy5zaG93KCRtZERpYWxvZy5hbGVydCgpXG5cdFx0XHRcdC50aXRsZShuYW1lKVxuXHRcdFx0XHQuY29udGVudCgnWW91IHRyaWdnZXJlZCB0aGUgXCInICsgbmFtZSArICdcIiBhY3Rpb24nKVxuXHRcdFx0XHQub2soJ0dyZWF0Jylcblx0XHRcdFx0LnRhcmdldEV2ZW50KGV2KVxuXHRcdFx0KTtcblx0XHR9O1xuXG4gICAgdGhpcy5vcGVuQ3N2VXBsb2FkID0gZnVuY3Rpb24oKSB7XG5cdFx0XHQkbWREaWFsb2cuc2hvdyh7XG5cdFx0XHRcdFx0Ly9jb250cm9sbGVyOiBEaWFsb2dDb250cm9sbGVyLFxuXHRcdFx0XHRcdHRlbXBsYXRlVXJsOiAnL3ZpZXdzL2FwcC9pbXBvcnRjc3YvY3N2VXBsb2FkRGlhbG9nLmh0bWwnLFxuXHQgICAgICAgIGJpbmRUb0NvbnRyb2xsZXI6IHRydWUsXG5cdFx0XHRcdH0pXG5cdFx0XHRcdC50aGVuKGZ1bmN0aW9uIChhbnN3ZXIpIHtcblxuXHRcdFx0XHR9LCBmdW5jdGlvbiAoKSB7XG5cblx0XHRcdFx0fSk7XG5cdFx0fTtcblx0fSlcblxuXG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0luZGV4Q3RybCcsIGZ1bmN0aW9uICgkc2NvcGUsICR3aW5kb3csICRyb290U2NvcGUsJGZpbHRlciwgJHN0YXRlLCAkdGltZW91dCwgVG9hc3RTZXJ2aWNlLCBWZWN0b3JsYXllclNlcnZpY2UsIGluaXRpYWxEYXRhLCBsZWFmbGV0RGF0YSwgRGF0YVNlcnZpY2UpIHtcblx0XHQvLyBWYXJpYWJsZSBkZWZpbml0aW9uc1xuXHRcdHZhciB2bSA9IHRoaXM7XG5cdFx0dm0ubWFwID0gbnVsbDtcblxuXHRcdHZtLmRhdGFTZXJ2ZXIgPSBpbml0aWFsRGF0YS5kYXRhO1xuXHRcdHZtLnN0cnVjdHVyZVNlcnZlciA9IGluaXRpYWxEYXRhLmluZGV4ZXI7XG5cdFx0dm0uc3RydWN0dXJlID0gXCJcIjtcblx0XHR2bS5tdnRTY291cmNlID0gVmVjdG9ybGF5ZXJTZXJ2aWNlLmdldExheWVyKCk7XG5cdFx0dm0ubm9kZVBhcmVudCA9IHt9O1xuXHRcdHZtLnNlbGVjdGVkVGFiID0gMDtcblx0XHR2bS5jdXJyZW50ID0gXCJcIjtcblx0XHR2bS50YWJDb250ZW50ID0gXCJcIjtcblx0XHR2bS50b2dnbGVCdXR0b24gPSAnYXJyb3dfZHJvcF9kb3duJztcblx0XHR2bS5tZW51ZU9wZW4gPSB0cnVlO1xuXHRcdHZtLmluZm8gPSBmYWxzZTtcblx0XHR2bS5jbG9zZUljb24gPSAnY2xvc2UnO1xuXHRcdHZtLmNvbXBhcmUgPSB7XG5cdFx0XHRhY3RpdmU6IGZhbHNlLFxuXHRcdFx0Y291bnRyaWVzOiBbXVxuXHRcdH07XG5cdFx0dm0uZGlzcGxheSA9IHtcblx0XHRcdHNlbGVjdGVkQ2F0OiAnJ1xuXHRcdH07XG5cblx0XHQvL0Z1bmN0aW9uIGRlZmluaXRvbnNcblx0XHR2bS5zaG93VGFiQ29udGVudCA9IHNob3dUYWJDb250ZW50O1xuXHRcdHZtLnNldFRhYiA9IHNldFRhYjtcblx0XHR2bS5zZXRTdGF0ZSA9IHNldFN0YXRlO1xuXHRcdHZtLnNldEN1cnJlbnQgPSBzZXRDdXJyZW50O1xuXHRcdHZtLnNldFNlbGVjdGVkRmVhdHVyZSA9IHNldFNlbGVjdGVkRmVhdHVyZTtcblx0XHR2bS5nZXRSYW5rID0gZ2V0UmFuaztcblx0XHR2bS5nZXRPZmZzZXQgPSBnZXRPZmZzZXQ7XG5cdFx0dm0uZ2V0VGVuZGVuY3kgPSBnZXRUZW5kZW5jeTtcblxuXHRcdHZtLmNoZWNrQ29tcGFyaXNvbiA9IGNoZWNrQ29tcGFyaXNvbjtcblx0XHR2bS50b2dnbGVPcGVuID0gdG9nZ2xlT3Blbjtcblx0XHR2bS50b2dnbGVJbmZvID0gdG9nZ2xlSW5mbztcblx0XHR2bS50b2dnbGVEZXRhaWxzID0gdG9nZ2xlRGV0YWlscztcblx0XHR2bS50b2dnbGVDb21wYXJpc29uID0gdG9nZ2xlQ29tcGFyaXNvbjtcblx0XHR2bS50b2dnbGVDb3VudHJpZUxpc3QgPSB0b2dnbGVDb3VudHJpZUxpc3Q7XG5cdFx0dm0ubWFwR290b0NvdW50cnkgPSBtYXBHb3RvQ291bnRyeTtcblx0XHR2bS5nb0JhY2sgPSBnb0JhY2s7XG5cblx0XHR2bS5jYWxjVHJlZSA9IGNhbGNUcmVlO1xuXG5cdFx0YWN0aXZhdGUoKTtcblxuXHRcdGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xuXG5cdFx0XHR2bS5zdHJ1Y3R1cmVTZXJ2ZXIudGhlbihmdW5jdGlvbihzdHJ1Y3R1cmUpe1xuXHRcdFx0XHR2bS5kYXRhU2VydmVyLnRoZW4oZnVuY3Rpb24oZGF0YSl7XG5cdFx0XHRcdFx0dm0uZGF0YSA9IGRhdGE7XG5cdFx0XHRcdFx0dm0uc3RydWN0dXJlID0gc3RydWN0dXJlLmRhdGE7XG5cdFx0XHRcdFx0Y3JlYXRlQ2FudmFzKCk7XG5cdFx0XHRcdFx0ZHJhd0NvdW50cmllcygpO1xuXHRcdFx0XHRcdGlmKCRzdGF0ZS5wYXJhbXMuaXRlbSl7XG5cdFx0XHRcdFx0XHR2bS5zZXRTdGF0ZSgkc3RhdGUucGFyYW1zLml0ZW0pO1xuXHRcdFx0XHRcdFx0Y2FsY1JhbmsoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYoJHN0YXRlLnBhcmFtcy5jb3VudHJpZXMpe1xuXHRcdFx0XHRcdFx0dm0uc2V0VGFiKDIpO1xuXHRcdFx0XHRcdFx0dm0uY29tcGFyZS5jb3VudHJpZXMucHVzaCh2bS5jdXJyZW50KTtcblx0XHRcdFx0XHRcdHZtLmNvbXBhcmUuYWN0aXZlID0gdHJ1ZTtcblx0XHRcdFx0XHRcdCRyb290U2NvcGUuZ3JleWVkID0gdHJ1ZTtcblx0XHRcdFx0XHRcdHZhciBjb3VudHJpZXMgPSAkc3RhdGUucGFyYW1zLmNvdW50cmllcy5zcGxpdCgnLXZzLScpO1xuXHRcdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKGNvdW50cmllcywgZnVuY3Rpb24oaXNvKXtcblx0XHRcdFx0XHRcdFx0dm0uY29tcGFyZS5jb3VudHJpZXMucHVzaChnZXROYXRpb25CeUlzbyhpc28pKTtcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0Y29uc29sZS5sb2codm0uY29tcGFyZS5jb3VudHJpZXMpO1xuXHRcdFx0XHRcdFx0Y291bnRyaWVzLnB1c2godm0uY3VycmVudFt2bS5zdHJ1Y3R1cmUuaXNvXSk7XG5cdFx0XHRcdFx0XHREYXRhU2VydmljZS5nZXRPbmUoJ25hdGlvbnMvYmJveCcsIGNvdW50cmllcykudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuXHRcdFx0XHRcdFx0XHR2bS5iYm94ID0gZGF0YTtcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSlcblx0XHRcdH0pO1xuXG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gZ29CYWNrKCl7XG5cdFx0XHQkd2luZG93Lmhpc3RvcnkuYmFjaygpO1xuXHRcdH1cblx0XHRmdW5jdGlvbiBzaG93VGFiQ29udGVudChjb250ZW50KSB7XG5cdFx0XHRpZiAoY29udGVudCA9PSAnJyAmJiB2bS50YWJDb250ZW50ID09ICcnKSB7XG5cdFx0XHRcdHZtLnRhYkNvbnRlbnQgPSAncmFuayc7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR2bS50YWJDb250ZW50ID0gY29udGVudDtcblx0XHRcdH1cblx0XHRcdHZtLnRvZ2dsZUJ1dHRvbiA9IHZtLnRhYkNvbnRlbnQgPyAnYXJyb3dfZHJvcF91cCcgOiAnYXJyb3dfZHJvcF9kb3duJztcblx0XHR9O1xuXHRcdGZ1bmN0aW9uIHNldFN0YXRlKGl0ZW0pIHtcblx0XHRcdHZtLnNldEN1cnJlbnQoZ2V0TmF0aW9uQnlJc28oaXRlbSkpO1xuXHRcdFx0ZmV0Y2hOYXRpb25EYXRhKGl0ZW0pO1xuXHRcdH07XG5cblx0XHRmdW5jdGlvbiB0b2dnbGVPcGVuKCkge1xuXHRcdFx0dm0ubWVudWVPcGVuID0gIXZtLm1lbnVlT3Blbjtcblx0XHRcdHZtLmNsb3NlSWNvbiA9IHZtLm1lbnVlT3BlbiA9PSB0cnVlID8gJ2NoZXZyb25fbGVmdCcgOiAnY2hldnJvbl9yaWdodCc7XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIHNldEN1cnJlbnQobmF0KSB7XG5cdFx0XHR2bS5jdXJyZW50ID0gbmF0O1xuXHRcdFx0dm0uc2V0U2VsZWN0ZWRGZWF0dXJlKCk7XG5cdFx0fTtcblxuXHRcdGZ1bmN0aW9uIHNldFNlbGVjdGVkRmVhdHVyZShpc28pIHtcblx0XHRcdGlmICh2bS5tdnRTb3VyY2UpIHtcblx0XHRcdFx0JHRpbWVvdXQoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdHZtLm12dFNvdXJjZS5sYXllcnMuY291bnRyaWVzX2JpZ19nZW9tLmZlYXR1cmVzW3ZtLmN1cnJlbnRbdm0uc3RydWN0dXJlLmlzb11dLnNlbGVjdGVkID0gdHJ1ZTtcblx0XHRcdFx0fSlcblx0XHRcdH1cblx0XHR9O1xuXHRcdGZ1bmN0aW9uIGNhbGNSYW5rKCkge1xuXHRcdFx0aWYoIXZtLmN1cnJlbnQpe1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0XHR2YXIgcmFuayA9IDA7XG5cdFx0XHRhbmd1bGFyLmZvckVhY2godm0uZGF0YSwgZnVuY3Rpb24oaXRlbSkge1xuXHRcdFx0XHRpdGVtW3ZtLnN0cnVjdHVyZS5zY29yZV9maWVsZF9uYW1lXSA9IHBhcnNlRmxvYXQoaXRlbVt2bS5zdHJ1Y3R1cmUuc2NvcmVfZmllbGRfbmFtZV0pO1xuXHRcdFx0XHRpdGVtWydzY29yZSddID0gcGFyc2VGbG9hdChpdGVtWydzY29yZSddKTtcblx0XHRcdH0pXG5cdFx0XHR2bS5kYXRhID0gJGZpbHRlcignb3JkZXJCeScpKHZtLmRhdGEsIFt2bS5zdHJ1Y3R1cmUuc2NvcmVfZmllbGRfbmFtZSwgXCJzY29yZVwiXSwgdHJ1ZSk7XG5cdFx0XHRyYW5rID0gdm0uZGF0YS5pbmRleE9mKHZtLmN1cnJlbnQpICsgMTtcblx0XHRcdHZtLmN1cnJlbnRbdm0uc3RydWN0dXJlLnNjb3JlX2ZpZWxkX25hbWUrJ19yYW5rJ10gPSByYW5rO1xuXHRcdFx0dm0uY2lyY2xlT3B0aW9ucyA9IHtcblx0XHRcdFx0XHRjb2xvcjp2bS5zdHJ1Y3R1cmUuY29sb3IsXG5cdFx0XHRcdFx0ZmllbGQ6dm0uc3RydWN0dXJlLnNjb3JlX2ZpZWxkX25hbWUrJ19yYW5rJ1xuXHRcdFx0fTtcblx0XHRcdHJldHVybiByYW5rO1xuXHRcdH1cblx0XHRmdW5jdGlvbiBnZXRSYW5rKGNvdW50cnkpe1xuXG5cdFx0XHR2YXIgcmFuayA9IHZtLmRhdGEuaW5kZXhPZihjb3VudHJ5KSArIDE7XG5cdFx0XHRyZXR1cm4gcmFuaztcblx0XHR9XG5cdFx0ZnVuY3Rpb24gdG9nZ2xlSW5mbygpIHtcblx0XHRcdHZtLmluZm8gPSAhdm0uaW5mbztcblx0XHR9O1xuXG5cdFx0ZnVuY3Rpb24gdG9nZ2xlRGV0YWlscygpIHtcblx0XHRcdHJldHVybiB2bS5kZXRhaWxzID0gIXZtLmRldGFpbHM7XG5cdFx0fTtcblx0XHRmdW5jdGlvbiBmZXRjaE5hdGlvbkRhdGEoaXNvKXtcblx0XHRcdERhdGFTZXJ2aWNlLmdldE9uZSgnbmF0aW9ucycsIGlzbykudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuXHRcdFx0XHR2bS5jdXJyZW50LmRhdGEgPSBkYXRhLmRhdGE7XG5cdFx0XHRcdG1hcEdvdG9Db3VudHJ5KGlzbyk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdFx0ZnVuY3Rpb24gbWFwR290b0NvdW50cnkoaXNvKSB7XG5cdFx0XHRpZighJHN0YXRlLnBhcmFtcy5jb3VudHJpZXMpe1xuXHRcdFx0XHREYXRhU2VydmljZS5nZXRPbmUoJ25hdGlvbnMvYmJveCcsIFtpc29dKS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG5cdFx0XHRcdFx0dm0uYmJveCA9IGRhdGE7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gY2hlY2tDb21wYXJpc29uKHdhbnQpIHtcblx0XHRcdGlmICh3YW50ICYmICF2bS5jb21wYXJlLmFjdGl2ZSB8fCAhd2FudCAmJiB2bS5jb21wYXJlLmFjdGl2ZSkge1xuXHRcdFx0XHR2bS50b2dnbGVDb21wYXJpc29uKCk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gdG9nZ2xlQ29tcGFyaXNvbigpIHtcblx0XHRcdHZtLmNvbXBhcmUuY291bnRyaWVzID0gW3ZtLmN1cnJlbnRdO1xuXHRcdFx0dm0uY29tcGFyZS5hY3RpdmUgPSAhdm0uY29tcGFyZS5hY3RpdmU7XG5cdFx0XHRpZiAodm0uY29tcGFyZS5hY3RpdmUpIHtcblx0XHRcdFx0dm0uc2V0VGFiKDIpO1xuXHRcdFx0XHQkcm9vdFNjb3BlLmdyZXllZCA9IHRydWU7XG5cdFx0XHRcdHZtLm12dFNvdXJjZS5vcHRpb25zLm11dGV4VG9nZ2xlID0gZmFsc2U7XG5cdFx0XHRcdHZtLm12dFNvdXJjZS5zZXRTdHlsZShpbnZlcnRlZFN0eWxlKTtcblxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JHJvb3RTY29wZS5ncmV5ZWQgPSBmYWxzZTtcblx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLm12dFNvdXJjZS5sYXllcnMuY291bnRyaWVzX2JpZ19nZW9tLmZlYXR1cmVzLCBmdW5jdGlvbiAoZmVhdHVyZSkge1xuXHRcdFx0XHRcdGZlYXR1cmUuc2VsZWN0ZWQgPSBmYWxzZTtcblx0XHRcdFx0fSk7XG5cdFx0XHRcdHZtLm12dFNvdXJjZS5sYXllcnMuY291bnRyaWVzX2JpZ19nZW9tLmZlYXR1cmVzW3ZtLmN1cnJlbnRbdm0uc3RydWN0dXJlLmlzb11dLnNlbGVjdGVkID0gdHJ1ZTtcblx0XHRcdFx0dm0ubXZ0U291cmNlLm9wdGlvbnMubXV0ZXhUb2dnbGUgPSB0cnVlO1xuXHRcdFx0XHR2bS5tdnRTb3VyY2Uuc2V0U3R5bGUoY291bnRyaWVzU3R5bGUpO1xuXHRcdFx0XHREYXRhU2VydmljZS5nZXRPbmUoJ25hdGlvbnMvYmJveCcsIFt2bS5jdXJyZW50W3ZtLnN0cnVjdHVyZS5pc29dXSkudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuXHRcdFx0XHRcdHZtLmJib3ggPSBkYXRhO1xuXHRcdFx0XHR9KTtcblx0XHRcdFx0JHN0YXRlLmdvKCdhcHAuaW5kZXguc2hvdy5zZWxlY3RlZCcse1xuXHRcdFx0XHRcdGluZGV4OiRzdGF0ZS5wYXJhbXMuaW5kZXgsXG5cdFx0XHRcdFx0aXRlbTokc3RhdGUucGFyYW1zLml0ZW1cblx0XHRcdFx0fSlcblx0XHRcdH1cblx0XHRcdC8vdm0ubXZ0U291cmNlLnJlZHJhdygpO1xuXHRcdH07XG5cblx0XHRmdW5jdGlvbiB0b2dnbGVDb3VudHJpZUxpc3QoY291bnRyeSkge1xuXHRcdFx0dmFyIGZvdW5kID0gZmFsc2U7XG5cdFx0XHRhbmd1bGFyLmZvckVhY2godm0uY29tcGFyZS5jb3VudHJpZXMsIGZ1bmN0aW9uIChuYXQsIGtleSkge1xuXHRcdFx0XHRpZiAoY291bnRyeSA9PSBuYXQgJiYgbmF0ICE9IHZtLmN1cnJlbnQpIHtcblx0XHRcdFx0XHR2bS5jb21wYXJlLmNvdW50cmllcy5zcGxpY2Uoa2V5LCAxKTtcblx0XHRcdFx0XHRmb3VuZCA9IHRydWU7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdFx0aWYgKCFmb3VuZCkge1xuXHRcdFx0XHR2bS5jb21wYXJlLmNvdW50cmllcy5wdXNoKGNvdW50cnkpO1xuXHRcdFx0fTtcblx0XHRcdHZhciBpc29zID0gW107XG5cdFx0XHR2YXIgY29tcGFyZSA9IFtdO1xuXHRcdFx0YW5ndWxhci5mb3JFYWNoKHZtLmNvbXBhcmUuY291bnRyaWVzLCBmdW5jdGlvbiAoaXRlbSwga2V5KSB7XG5cdFx0XHRcdGlzb3MucHVzaChpdGVtW3ZtLnN0cnVjdHVyZS5pc29dKTtcblx0XHRcdFx0aWYoaXRlbVt2bS5zdHJ1Y3R1cmUuaXNvXSAhPSB2bS5jdXJyZW50W3ZtLnN0cnVjdHVyZS5pc29dKXtcblx0XHRcdFx0XHRjb21wYXJlLnB1c2goaXRlbVt2bS5zdHJ1Y3R1cmUuaXNvXSk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdFx0aWYgKGlzb3MubGVuZ3RoID4gMSkge1xuXHRcdFx0XHREYXRhU2VydmljZS5nZXRPbmUoJ25hdGlvbnMvYmJveCcsIGlzb3MpLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcblx0XHRcdFx0XHR2bS5iYm94ID0gZGF0YTtcblx0XHRcdFx0fSk7XG5cdFx0XHRcdCRzdGF0ZS5nbygnYXBwLmluZGV4LnNob3cuc2VsZWN0ZWQuY29tcGFyZScse1xuXHRcdFx0XHRcdGluZGV4OiAkc3RhdGUucGFyYW1zLmluZGV4LFxuXHRcdFx0XHRcdGl0ZW06ICRzdGF0ZS5wYXJhbXMuaXRlbSxcblx0XHRcdFx0XHRjb3VudHJpZXM6Y29tcGFyZS5qb2luKCctdnMtJylcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiAhZm91bmQ7XG5cdFx0fTtcblxuXHRcdGZ1bmN0aW9uIGdldE9mZnNldCgpIHtcblx0XHRcdGlmICghdm0uY3VycmVudCkge1xuXHRcdFx0XHRyZXR1cm4gMDtcblx0XHRcdH1cblx0XHRcdGNvbnNvbGUubG9nKHZtLmdldFJhbmsodm0uY3VycmVudCkpO1xuXHRcdFx0cmV0dXJuICh2bS5nZXRSYW5rKHZtLmN1cnJlbnQpIC0gMikgKiAxNjtcblx0XHR9O1xuXG5cdFx0ZnVuY3Rpb24gZ2V0VGVuZGVuY3koKSB7XG5cdFx0XHRpZiAoIXZtLmN1cnJlbnQpIHtcblx0XHRcdFx0cmV0dXJuICdhcnJvd19kcm9wX2Rvd24nXG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdm0uY3VycmVudC5wZXJjZW50X2NoYW5nZSA+IDAgPyAnYXJyb3dfZHJvcF91cCcgOiAnYXJyb3dfZHJvcF9kb3duJztcblx0XHR9O1xuXG5cdFx0ZnVuY3Rpb24gc2V0VGFiKGkpIHtcblx0XHRcdHZtLmFjdGl2ZVRhYiA9IGk7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gZ2V0UGFyZW50KGRhdGEpIHtcblx0XHRcdHZhciBpdGVtcyA9IFtdO1xuXHRcdFx0YW5ndWxhci5mb3JFYWNoKGRhdGEuY2hpbGRyZW4sIGZ1bmN0aW9uIChpdGVtKSB7XG5cdFx0XHRcdGlmIChpdGVtLmNvbHVtbl9uYW1lID09IHZtLmRpc3BsYXkuc2VsZWN0ZWRDYXQudHlwZSkge1xuXHRcdFx0XHRcdHZtLm5vZGVQYXJlbnQgPSBkYXRhO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGdldFBhcmVudChpdGVtKTtcblx0XHRcdH0pO1xuXHRcdFx0cmV0dXJuIGl0ZW1zO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGNhbGNUcmVlKCkge1xuXHRcdFx0Z2V0UGFyZW50KHZtLnN0cnVjdHVyZSk7XG5cdFx0fTtcblxuXHRcdGZ1bmN0aW9uIGdldE5hdGlvbkJ5TmFtZShuYW1lKSB7XG5cdFx0XHR2YXIgbmF0aW9uID0ge307XG5cdFx0XHRhbmd1bGFyLmZvckVhY2godm0uZGF0YSwgZnVuY3Rpb24gKG5hdCkge1xuXHRcdFx0XHRpZiAobmF0LmNvdW50cnkgPT0gbmFtZSkge1xuXHRcdFx0XHRcdG5hdGlvbiA9IG5hdDtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0XHRyZXR1cm4gbmF0aW9uO1xuXHRcdH07XG5cblx0XHRmdW5jdGlvbiBnZXROYXRpb25CeUlzbyhpc28pIHtcblx0XHRcdHZhciBuYXRpb24gPSB7fTtcblx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5kYXRhLCBmdW5jdGlvbiAobmF0KSB7XG5cdFx0XHRcdGlmIChuYXRbdm0uc3RydWN0dXJlLmlzb10gPT0gaXNvKSB7XG5cdFx0XHRcdFx0bmF0aW9uID0gbmF0O1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdFx0cmV0dXJuIG5hdGlvbjtcblx0XHR9O1xuXG5cdFx0ZnVuY3Rpb24gY3JlYXRlQ2FudmFzKGNvbG9ycykge1xuXG5cdFx0XHR2bS5jYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcblx0XHRcdHZtLmNhbnZhcy53aWR0aCA9IDI4MDtcblx0XHRcdHZtLmNhbnZhcy5oZWlnaHQgPSAxMDtcblx0XHRcdHZtLmN0eCA9IHZtLmNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuXHRcdFx0dmFyIGdyYWRpZW50ID0gdm0uY3R4LmNyZWF0ZUxpbmVhckdyYWRpZW50KDAsIDAsIDI4MCwgMTApO1xuXHRcdFx0Z3JhZGllbnQuYWRkQ29sb3JTdG9wKDEsICdyZ2JhKDI1NSwyNTUsMjU1LDApJyk7XG5cdFx0XHRncmFkaWVudC5hZGRDb2xvclN0b3AoMC41Mywgdm0uc3RydWN0dXJlLmNvbG9yIHx8ICdyZ2JhKDEyOCwgMjQzLCAxOTgsMSknKTtcblx0XHRcdGdyYWRpZW50LmFkZENvbG9yU3RvcCgwLCAncmdiYSgxMDIsMTAyLDEwMiwxKScpO1xuXHRcdFx0dm0uY3R4LmZpbGxTdHlsZSA9IGdyYWRpZW50O1xuXHRcdFx0dm0uY3R4LmZpbGxSZWN0KDAsIDAsIDI4MCwgMTApO1xuXHRcdFx0dm0ucGFsZXR0ZSA9IHZtLmN0eC5nZXRJbWFnZURhdGEoMCwgMCwgMjU3LCAxKS5kYXRhO1xuXHRcdFx0Ly9kb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnYm9keScpWzBdLmFwcGVuZENoaWxkKHZtLmNhbnZhcyk7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gdXBkYXRlQ2FudmFzKGNvbG9yKSB7XG5cdFx0XHR2YXIgZ3JhZGllbnQgPSB2bS5jdHguY3JlYXRlTGluZWFyR3JhZGllbnQoMCwgMCwgMjgwLCAxMCk7XG5cdFx0XHRncmFkaWVudC5hZGRDb2xvclN0b3AoMSwgJ3JnYmEoMjU1LDI1NSwyNTUsMCknKTtcblx0XHRcdGdyYWRpZW50LmFkZENvbG9yU3RvcCgwLjUzLCBjb2xvcik7XG5cdFx0XHRncmFkaWVudC5hZGRDb2xvclN0b3AoMCwgJ3JnYmEoMTAyLDEwMiwxMDIsMSknKTtcblx0XHRcdHZtLmN0eC5maWxsU3R5bGUgPSBncmFkaWVudDtcblx0XHRcdHZtLmN0eC5maWxsUmVjdCgwLCAwLCAyODAsIDEwKTtcblx0XHRcdHZtLnBhbGV0dGUgPSB2bS5jdHguZ2V0SW1hZ2VEYXRhKDAsIDAsIDI1NywgMSkuZGF0YTtcblx0XHRcdC8vZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2JvZHknKVswXS5hcHBlbmRDaGlsZCh2bS5jYW52YXMpO1xuXHRcdH07XG5cblx0XHRmdW5jdGlvbiBpbnZlcnRlZFN0eWxlKGZlYXR1cmUpIHtcblx0XHRcdHZhciBzdHlsZSA9IHt9O1xuXHRcdFx0dmFyIGlzbyA9IGZlYXR1cmUucHJvcGVydGllcy5hZG0wX2EzO1xuXHRcdFx0dmFyIG5hdGlvbiA9IGdldE5hdGlvbkJ5SXNvKGlzbyk7XG5cdFx0XHR2YXIgZmllbGQgPSB2bS5zdHJ1Y3R1cmUuc2NvcmVfZmllbGRfbmFtZSB8fCAnc2NvcmUnO1xuXG5cdFx0XHRjb25zb2xlLmxvZyh2bS5zdHJ1Y3R1cmUuc2NvcmVfZmllbGRfbmFtZSk7XG5cdFx0XHR2YXIgY29sb3JQb3MgPSBwYXJzZUludCgyNTYgLyAxMDAgKiBuYXRpb25bZmllbGRdKSAqIDQ7XG5cdFx0XHR2YXIgY29sb3IgPSAncmdiYSgnICsgdm0ucGFsZXR0ZVtjb2xvclBvc10gKyAnLCAnICsgdm0ucGFsZXR0ZVtjb2xvclBvcyArIDFdICsgJywgJyArIHZtLnBhbGV0dGVbY29sb3JQb3MgKyAyXSArICcsJyArIHZtLnBhbGV0dGVbY29sb3JQb3MgKyAzXSArICcpJztcblx0XHRcdHN0eWxlLmNvbG9yID0gJ3JnYmEoMCwwLDAsMCknO1xuXHRcdFx0c3R5bGUub3V0bGluZSA9IHtcblx0XHRcdFx0Y29sb3I6ICdyZ2JhKDAsMCwwLDApJyxcblx0XHRcdFx0c2l6ZTogMFxuXHRcdFx0fTtcblx0XHRcdHN0eWxlLnNlbGVjdGVkID0ge1xuXHRcdFx0XHRjb2xvcjogY29sb3IsXG5cdFx0XHRcdG91dGxpbmU6IHtcblx0XHRcdFx0XHRjb2xvcjogJ3JnYmEoMCwwLDAsMC4zKScsXG5cdFx0XHRcdFx0c2l6ZTogMlxuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXHRcdFx0cmV0dXJuIHN0eWxlO1xuXHRcdH07XG5cblx0XHRmdW5jdGlvbiBjb3VudHJpZXNTdHlsZShmZWF0dXJlKSB7XG5cblx0XHRcdHZhciBzdHlsZSA9IHt9O1xuXHRcdFx0dmFyIGlzbyA9IGZlYXR1cmUucHJvcGVydGllcy5hZG0wX2EzO1xuXHRcdFx0dmFyIG5hdGlvbiA9IGdldE5hdGlvbkJ5SXNvKGlzbyk7XG5cdFx0XHR2YXIgZmllbGQgPSB2bS5zdHJ1Y3R1cmUuc2NvcmVfZmllbGRfbmFtZSB8fCAnc2NvcmUnO1xuXHRcdFx0dmFyIHR5cGUgPSBmZWF0dXJlLnR5cGU7XG5cdFx0XHRpZihpc28gIT0gdm0uY3VycmVudFt2bS5zdHJ1Y3R1cmUuaXNvXSl7XG5cdFx0XHRcdFx0ZmVhdHVyZS5zZWxlY3RlZCA9IGZhbHNlO1xuXHRcdFx0fVxuXG5cdFx0XHRzd2l0Y2ggKHR5cGUpIHtcblx0XHRcdGNhc2UgMzogLy8nUG9seWdvbidcblx0XHRcdFx0aWYgKHR5cGVvZiBuYXRpb25bZmllbGRdICE9IFwidW5kZWZpbmVkXCIpIHtcblxuXHRcdFx0XHRcdHZhciBjb2xvclBvcyA9IHBhcnNlSW50KDI1NiAvIDEwMCAqIHBhcnNlSW50KG5hdGlvbltmaWVsZF0pKSAqIDQ7XG5cdFx0XHRcdFx0dmFyIGNvbG9yID0gJ3JnYmEoJyArIHZtLnBhbGV0dGVbY29sb3JQb3NdICsgJywgJyArIHZtLnBhbGV0dGVbY29sb3JQb3MgKyAxXSArICcsICcgKyB2bS5wYWxldHRlW2NvbG9yUG9zICsgMl0gKyAnLCcgKyB2bS5wYWxldHRlW2NvbG9yUG9zICsgM10gKyAnKSc7XG5cdFx0XHRcdFx0c3R5bGUuY29sb3IgPSAncmdiYSgnICsgdm0ucGFsZXR0ZVtjb2xvclBvc10gKyAnLCAnICsgdm0ucGFsZXR0ZVtjb2xvclBvcyArIDFdICsgJywgJyArIHZtLnBhbGV0dGVbY29sb3JQb3MgKyAyXSArICcsMC42KSc7IC8vY29sb3I7XG5cdFx0XHRcdFx0c3R5bGUub3V0bGluZSA9IHtcblx0XHRcdFx0XHRcdGNvbG9yOiBjb2xvcixcblx0XHRcdFx0XHRcdHNpemU6IDFcblx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdHN0eWxlLnNlbGVjdGVkID0ge1xuXHRcdFx0XHRcdFx0Y29sb3I6ICdyZ2JhKCcgKyB2bS5wYWxldHRlW2NvbG9yUG9zXSArICcsICcgKyB2bS5wYWxldHRlW2NvbG9yUG9zICsgMV0gKyAnLCAnICsgdm0ucGFsZXR0ZVtjb2xvclBvcyArIDJdICsgJywwLjMpJyxcblx0XHRcdFx0XHRcdG91dGxpbmU6IHtcblx0XHRcdFx0XHRcdFx0Y29sb3I6ICdyZ2JhKDY2LDY2LDY2LDAuOSknLFxuXHRcdFx0XHRcdFx0XHRzaXplOiAyXG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fSBlbHNlIHtcblxuXHRcdFx0XHRcdHN0eWxlLmNvbG9yID0gJ3JnYmEoMjU1LDI1NSwyNTUsMCknO1xuXHRcdFx0XHRcdHN0eWxlLm91dGxpbmUgPSB7XG5cdFx0XHRcdFx0XHRjb2xvcjogJ3JnYmEoMjU1LDI1NSwyNTUsMCknLFxuXHRcdFx0XHRcdFx0c2l6ZTogMVxuXHRcdFx0XHRcdH07XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGlmIChmZWF0dXJlLmxheWVyLm5hbWUgPT09ICdjb3VudHJpZXNfYmlnX2dlb21fbGFiZWwnKSB7XG5cdFx0XHRcdHN0eWxlLnN0YXRpY0xhYmVsID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdHZhciBzdHlsZSA9IHtcblx0XHRcdFx0XHRcdGh0bWw6IGZlYXR1cmUucHJvcGVydGllcy5uYW1lLFxuXHRcdFx0XHRcdFx0aWNvblNpemU6IFsxMjUsIDMwXSxcblx0XHRcdFx0XHRcdGNzc0NsYXNzOiAnbGFiZWwtaWNvbi10ZXh0J1xuXHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0cmV0dXJuIHN0eWxlO1xuXHRcdFx0XHR9O1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHN0eWxlO1xuXHRcdH07XG5cblx0XHQkc2NvcGUuJHdhdGNoKCd2bS5jdXJyZW50JywgZnVuY3Rpb24gKG4sIG8pIHtcblx0XHRcdGlmIChuID09PSBvKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHRcdGlmKG5bdm0uc3RydWN0dXJlLmlzb10pIHtcblx0XHRcdFx0aWYob1t2bS5zdHJ1Y3R1cmUuaXNvXSl7XG5cdFx0XHRcdFx0dm0ubXZ0U291cmNlLmxheWVycy5jb3VudHJpZXNfYmlnX2dlb20uZmVhdHVyZXNbb1t2bS5zdHJ1Y3R1cmUuaXNvXV0uc2VsZWN0ZWQgPSBmYWxzZTtcblx0XHRcdFx0fVxuXHRcdFx0XHRjYWxjUmFuaygpO1xuXHRcdFx0XHRmZXRjaE5hdGlvbkRhdGEoblt2bS5zdHJ1Y3R1cmUuaXNvXSk7XG5cdFx0XHRcdHZtLm12dFNvdXJjZS5sYXllcnMuY291bnRyaWVzX2JpZ19nZW9tLmZlYXR1cmVzW25bdm0uc3RydWN0dXJlLmlzb11dLnNlbGVjdGVkID0gdHJ1ZTtcblx0XHRcdFx0aWYoJHN0YXRlLmN1cnJlbnQubmFtZSA9PSAnYXBwLmluZGV4LnNob3cuc2VsZWN0ZWQnIHx8ICRzdGF0ZS5jdXJyZW50Lm5hbWUgPT0gJ2FwcC5pbmRleC5zaG93Jyl7XG5cdFx0XHRcdFx0JHN0YXRlLmdvKCdhcHAuaW5kZXguc2hvdy5zZWxlY3RlZCcsIHtcblx0XHRcdFx0XHRcdGluZGV4OiAkc3RhdGUucGFyYW1zLmluZGV4LFxuXHRcdFx0XHRcdFx0aXRlbTogblt2bS5zdHJ1Y3R1cmUuaXNvXVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkc3RhdGUuZ28oJ2FwcC5pbmRleC5zaG93Jyx7XG5cdFx0XHRcdFx0aW5kZXg6ICRzdGF0ZS5wYXJhbXMuaW5kZXhcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0JHNjb3BlLiR3YXRjaCgndm0uZGlzcGxheS5zZWxlY3RlZENhdCcsIGZ1bmN0aW9uIChuLCBvKSB7XG5cdFx0XHRpZiAobiA9PT0gbykge1xuXHRcdFx0XHRyZXR1cm5cblx0XHRcdH1cblx0XHRcdGlmIChuKVxuXHRcdFx0XHR1cGRhdGVDYW52YXMobi5jb2xvcik7XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0dXBkYXRlQ2FudmFzKCdyZ2JhKDEyOCwgMjQzLCAxOTgsMSknKTtcblx0XHRcdH07XG5cdFx0XHR2bS5jYWxjVHJlZSgpO1xuXHRcdFx0LyppZiAodm0uY29tcGFyZS5hY3RpdmUpIHtcblx0XHRcdFx0JHRpbWVvdXQoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdC8vdm0ubXZ0U291cmNlLnNldFN0eWxlKGludmVydGVkU3R5bGUpO1xuXHRcdFx0XHRcdC8vdm0ubXZ0U291cmNlLnJlZHJhdygpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHQvL3ZtLm12dFNvdXJjZS5zZXRTdHlsZShjb3VudHJpZXNTdHlsZSk7XG5cdFx0XHRcdFx0Ly92bS5tdnRTb3VyY2UucmVkcmF3KCk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSovXG5cblx0XHRcdGlmICh2bS5jdXJyZW50W3ZtLnN0cnVjdHVyZS5pc29dKSB7XG5cdFx0XHRcdGlmKCRzdGF0ZS5wYXJhbXMuY291bnRyaWVzKXtcblx0XHRcdFx0XHQkc3RhdGUuZ28oJ2FwcC5pbmRleC5zaG93LnNlbGVjdGVkLmNvbXBhcmUnLCB7XG5cdFx0XHRcdFx0XHRpbmRleDogbi5uYW1lLFxuXHRcdFx0XHRcdFx0aXRlbTogdm0uY3VycmVudFt2bS5zdHJ1Y3R1cmUuaXNvXSxcblx0XHRcdFx0XHRcdGNvdW50cmllczogJHN0YXRlLnBhcmFtcy5jb3VudHJpZXNcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2V7XG5cdFx0XHRcdFx0JHN0YXRlLmdvKCdhcHAuaW5kZXguc2hvdy5zZWxlY3RlZCcsIHtcblx0XHRcdFx0XHRcdGluZGV4OiBuLm5hbWUsXG5cdFx0XHRcdFx0XHRpdGVtOiB2bS5jdXJyZW50W3ZtLnN0cnVjdHVyZS5pc29dXG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JHN0YXRlLmdvKCdhcHAuaW5kZXguc2hvdycsIHtcblx0XHRcdFx0XHRpbmRleDogbi5uYW1lXG5cdFx0XHRcdH0pXG5cdFx0XHR9XG5cblx0XHR9KTtcblx0XHQkc2NvcGUuJHdhdGNoKCd2bS5iYm94JywgZnVuY3Rpb24gKG4sIG8pIHtcblx0XHRcdGlmIChuID09PSBvKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0dmFyIGxhdCA9IFtuLmNvb3JkaW5hdGVzWzBdWzBdWzFdLFxuXHRcdFx0XHRcdFtuLmNvb3JkaW5hdGVzWzBdWzBdWzBdXVxuXHRcdFx0XHRdLFxuXHRcdFx0XHRsbmcgPSBbbi5jb29yZGluYXRlc1swXVsyXVsxXSxcblx0XHRcdFx0XHRbbi5jb29yZGluYXRlc1swXVsyXVswXV1cblx0XHRcdFx0XVxuXHRcdFx0dmFyIHNvdXRoV2VzdCA9IEwubGF0TG5nKG4uY29vcmRpbmF0ZXNbMF1bMF1bMV0sIG4uY29vcmRpbmF0ZXNbMF1bMF1bMF0pLFxuXHRcdFx0XHRub3J0aEVhc3QgPSBMLmxhdExuZyhuLmNvb3JkaW5hdGVzWzBdWzJdWzFdLCBuLmNvb3JkaW5hdGVzWzBdWzJdWzBdKSxcblx0XHRcdFx0Ym91bmRzID0gTC5sYXRMbmdCb3VuZHMoc291dGhXZXN0LCBub3J0aEVhc3QpO1xuXG5cdFx0XHR2YXIgcGFkID0gW1xuXHRcdFx0XHRbMzUwLCAyMDBdLFxuXHRcdFx0XHRbMCwgMjAwXVxuXHRcdFx0XTtcblx0XHRcdGlmICh2bS5jb21wYXJlLmFjdGl2ZSkge1xuXHRcdFx0XHRwYWQgPSBbXG5cdFx0XHRcdFx0WzM1MCwgMF0sXG5cdFx0XHRcdFx0WzAsIDBdXG5cdFx0XHRcdF07XG5cdFx0XHR9XG5cdFx0XHR2bS5tYXAuZml0Qm91bmRzKGJvdW5kcywge1xuXHRcdFx0XHRwYWRkaW5nVG9wTGVmdDogcGFkWzBdLFxuXHRcdFx0XHRwYWRkaW5nQm90dG9tUmlnaHQ6IHBhZFsxXSxcblx0XHRcdFx0bWF4Wm9vbTogNlxuXHRcdFx0fSk7XG5cdFx0fSk7XG5cblx0XHQkc2NvcGUuJG9uKFwiJHN0YXRlQ2hhbmdlU3VjY2Vzc1wiLCBmdW5jdGlvbiAoZXZlbnQsIHRvU3RhdGUsIHRvUGFyYW1zLCBmcm9tU3RhdGUsIGZyb21QYXJhbXMpIHtcblxuXHRcdFx0Lypjb25zb2xlLmxvZygkKVxuXHRcdFx0aWYgKHRvU3RhdGUubmFtZSA9PSBcImFwcC5pbmRleC5zaG93XCIpIHtcblx0XHRcdFx0XHR2bS5jdXJyZW50ID0gXCJcIjtcblx0XHRcdH0gZWxzZSBpZiAodG9TdGF0ZS5uYW1lID09IFwiYXBwLmluZGV4LnNob3cuc2VsZWN0ZWRcIikge1xuXG5cdFx0XHRcdGlmKHRvUGFyYW1zLmluZGV4ICE9IGZyb21QYXJhbXMuaW5kZXgpe1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKCdhbmRlcnMnKVxuXHRcdFx0XHR9XG5cdFx0XHRcdGNvbnNvbGUubG9nKHRvUGFyYW1zLml0ZW0pO1xuXHRcdFx0XHR2bS5zZXRTdGF0ZSh0b1BhcmFtcy5pdGVtKTtcblx0XHRcdFx0Y2FsY1JhbmsoKTtcblx0XHRcdFx0Ly92bS5tdnRTb3VyY2Uub3B0aW9ucy5tdXRleFRvZ2dsZSA9IHRydWU7XG5cdFx0XHRcdERhdGFTZXJ2aWNlLmdldE9uZSgnbmF0aW9ucycsIHZtLmN1cnJlbnQuaXNvKS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG5cdFx0XHRcdFx0dm0uY3VycmVudC5kYXRhID0gZGF0YTtcblx0XHRcdFx0XHREYXRhU2VydmljZS5nZXRPbmUoJ25hdGlvbnMvYmJveCcsIFt2bS5jdXJyZW50Lmlzb10pLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcblx0XHRcdFx0XHRcdHZtLmJib3ggPSBkYXRhO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9KTtcblx0XHRcdH0gZWxzZSBpZiAodG9TdGF0ZS5uYW1lID09IFwiYXBwLmluZGV4LnNob3cuc2VsZWN0ZWQuY29tcGFyZVwiKSB7XG5cdFx0XHRcdHZtLnNldFN0YXRlKHRvUGFyYW1zLml0ZW0pO1xuXHRcdFx0XHQvLyRzY29wZS5hY3RpdmVUYWIgPSAyO1xuXHRcdFx0XHQvKkRhdGFTZXJ2aWNlLmdldE9uZSgnbmF0aW9ucycsIHRvUGFyYW1zLml0ZW0pLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcblx0XHRcdFx0XHR2bS5jb3VudHJ5ID0gZGF0YTtcblx0XHRcdFx0XHREYXRhU2VydmljZS5nZXRPbmUoJ25hdGlvbnMvYmJveCcsIFt2bS5jb3VudHJ5Lmlzb10pLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcblx0XHRcdFx0XHRcdHZtLmJib3ggPSBkYXRhO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9KTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHZtLmN1cnJlbnQgPSBcIlwiO1xuXHRcdFx0fSovXG5cdFx0fSk7XG5cblx0XHRmdW5jdGlvbiBkcmF3Q291bnRyaWVzKCkge1xuXHRcdFx0bGVhZmxldERhdGEuZ2V0TWFwKCdtYXAnKS50aGVuKGZ1bmN0aW9uIChtYXApIHtcblx0XHRcdFx0dm0ubWFwID0gbWFwO1xuXHRcdFx0XHR2bS5tdnRTb3VyY2UgPSBWZWN0b3JsYXllclNlcnZpY2UuZ2V0TGF5ZXIoKTtcblx0XHRcdFx0JHRpbWVvdXQoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdGlmKCRzdGF0ZS5wYXJhbXMuY291bnRyaWVzKXtcblx0XHRcdFx0XHRcdHZtLm12dFNvdXJjZS5vcHRpb25zLm11dGV4VG9nZ2xlID0gZmFsc2U7XG5cdFx0XHRcdFx0XHR2bS5tdnRTb3VyY2Uuc2V0U3R5bGUoaW52ZXJ0ZWRTdHlsZSk7XG5cdFx0XHRcdFx0XHR2bS5tdnRTb3VyY2UubGF5ZXJzLmNvdW50cmllc19iaWdfZ2VvbS5mZWF0dXJlc1t2bS5jdXJyZW50W3ZtLnN0cnVjdHVyZS5pc29dXS5zZWxlY3RlZCA9IHRydWU7XG5cdFx0XHRcdFx0XHR2YXIgY291bnRyaWVzID0gJHN0YXRlLnBhcmFtcy5jb3VudHJpZXMuc3BsaXQoJy12cy0nKTtcblx0XHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChjb3VudHJpZXMsIGZ1bmN0aW9uKGlzbyl7XG5cdFx0XHRcdFx0XHRcdHZtLm12dFNvdXJjZS5sYXllcnMuY291bnRyaWVzX2JpZ19nZW9tLmZlYXR1cmVzW2lzb10uc2VsZWN0ZWQgPSB0cnVlO1xuXHRcdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZWxzZXtcblx0XHRcdFx0XHRcdHZtLm12dFNvdXJjZS5zZXRTdHlsZShjb3VudHJpZXNTdHlsZSk7XG5cdFx0XHRcdFx0XHRpZigkc3RhdGUucGFyYW1zLml0ZW0pe1xuXHRcdFx0XHRcdFx0XHRcdHZtLm12dFNvdXJjZS5sYXllcnMuY291bnRyaWVzX2JpZ19nZW9tLmZlYXR1cmVzWyRzdGF0ZS5wYXJhbXMuaXRlbV0uc2VsZWN0ZWQgPSB0cnVlO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHQvL3ZtLm12dFNvdXJjZS5yZWRyYXcoKTtcblx0XHRcdFx0fSk7XG5cdFx0XHRcdHZtLm12dFNvdXJjZS5vcHRpb25zLm9uQ2xpY2sgPSBmdW5jdGlvbiAoZXZ0LCB0KSB7XG5cdFx0XHRcdFx0aWYgKCF2bS5jb21wYXJlLmFjdGl2ZSkge1xuXHRcdFx0XHRcdFx0dmFyIGMgPSBnZXROYXRpb25CeUlzbyhldnQuZmVhdHVyZS5wcm9wZXJ0aWVzLmFkbTBfYTMpO1xuXHRcdFx0XHRcdFx0aWYgKHR5cGVvZiBjW3ZtLnN0cnVjdHVyZS5zY29yZV9maWVsZF9uYW1lXSAhPSBcInVuZGVmaW5lZFwiKSB7XG5cdFx0XHRcdFx0XHRcdHZtLmN1cnJlbnQgPSBnZXROYXRpb25CeUlzbyhldnQuZmVhdHVyZS5wcm9wZXJ0aWVzLmFkbTBfYTMpO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0VG9hc3RTZXJ2aWNlLmVycm9yKCdObyBpbmZvIGFib3V0IHRoaXMgbG9jYXRpb24hJyk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHZhciBjID0gZ2V0TmF0aW9uQnlJc28oZXZ0LmZlYXR1cmUucHJvcGVydGllcy5hZG0wX2EzKTtcblx0XHRcdFx0XHRcdGlmICh0eXBlb2YgY1t2bS5zdHJ1Y3R1cmUuc2NvcmVfZmllbGRfbmFtZV0gIT0gXCJ1bmRlZmluZWRcIikge1xuXHRcdFx0XHRcdFx0XHR2bS50b2dnbGVDb3VudHJpZUxpc3QoYyk7XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRUb2FzdFNlcnZpY2UuZXJyb3IoJ05vIGluZm8gYWJvdXQgdGhpcyBsb2NhdGlvbiEnKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH07XG5cdH0pO1xufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdJbmRleGJhc2VDdHJsJywgZnVuY3Rpb24gKCRzY29wZSwkc3RhdGUpIHtcblx0XHQvL1xuICAgICRzY29wZS4kc3RhdGUgPSAkc3RhdGU7XG5cdH0pO1xufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0luZGV4Y3JlYXRvckN0cmwnLCBmdW5jdGlvbigkc2NvcGUsJHJvb3RTY29wZSxEaWFsb2dTZXJ2aWNlLERhdGFTZXJ2aWNlLCAkdGltZW91dCwkc3RhdGUsICRmaWx0ZXIsIGxlYWZsZXREYXRhLCB0b2FzdHIsIFZlY3RvcmxheWVyU2VydmljZSl7XG4gICAgICAgIC8vXG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG4gICAgICAgIHZtLm1hcCA9IG51bGw7XG4gICAgICAgIHZtLmRhdGEgPSBbXTtcbiAgICAgICAgdm0udG9TZWxlY3QgPSBbXTtcbiAgICAgICAgdm0uc2VsZWN0ZWQgPSBbXTtcbiAgICAgICAgdm0uc2VsZWN0ZWRSb3dzID0gW107XG4gICAgICAgIHZtLnNlbGVjdGVkUmVzb3VyY2VzID1bXTtcbiAgICAgICAgdm0uc29ydGVkUmVzb3VyY2VzID0gW107XG4gICAgICAgIHZtLmlzb19lcnJvcnMgPSAwO1xuICAgICAgICB2bS5pc29fY2hlY2tlZCA9IGZhbHNlO1xuICAgICAgICB2bS5zZWxlY3RlZEluZGV4ID0gMDtcbiAgICAgICAgdm0uc3RlcCA9IDA7XG4gICAgICAgIHZtLnNlYXJjaCA9IHNlYXJjaDtcbiAgICAgICAgdm0uZGVsZXRlRGF0YSA9IGRlbGV0ZURhdGE7XG4gICAgICAgIHZtLmRlbGV0ZVNlbGVjdGVkID0gZGVsZXRlU2VsZWN0ZWQ7XG4gICAgICAgIHZtLm9uT3JkZXJDaGFuZ2UgPSBvbk9yZGVyQ2hhbmdlO1xuICAgICAgICB2bS5vblBhZ2luYXRpb25DaGFuZ2UgPSBvblBhZ2luYXRpb25DaGFuZ2U7XG4gICAgICAgIHZtLmNoZWNrRm9yRXJyb3JzID0gY2hlY2tGb3JFcnJvcnM7XG4gICAgICAgIHZtLmNsZWFyRXJyb3JzID0gY2xlYXJFcnJvcnM7XG4gICAgICAgIHZtLnNob3dVcGxvYWRDb250YWluZXIgPSBmYWxzZTtcbiAgICAgICAgdm0ub3BlbkNsb3NlID0gb3BlbkNsb3NlO1xuICAgICAgICB2bS5jaGVja0NvbHVtbkRhdGEgPSBjaGVja0NvbHVtbkRhdGE7XG4gICAgICAgIHZtLmVkaXRDb2x1bW5EYXRhID0gZWRpdENvbHVtbkRhdGE7XG4gICAgICAgIHZtLmZldGNoSXNvID0gZmV0Y2hJc287XG4gICAgICAgIHZtLmVkaXRSb3cgPSBlZGl0Um93O1xuICAgICAgICB2bS5zYXZlRGF0YSA9IHNhdmVEYXRhO1xuICAgICAgICB2bS5saXN0UmVzb3VyY2VzID0gbGlzdFJlc291cmNlcztcbiAgICAgICAgdm0udG9nZ2xlTGlzdFJlc291cmNlcyA9IHRvZ2dsZUxpc3RSZXNvdXJjZXM7XG4gICAgICAgIHZtLnNlbGVjdGVkUmVzb3VyY2UgPSBzZWxlY3RlZFJlc291cmNlO1xuICAgICAgICB2bS50b2dnbGVSZXNvdXJjZSA9IHRvZ2dsZVJlc291cmNlO1xuICAgICAgICB2bS5pbmNyZWFzZVBlcmNlbnRhZ2UgPSBpbmNyZWFzZVBlcmNlbnRhZ2U7XG4gICAgICAgIHZtLmRlY3JlYXNlUGVyY2VudGFnZSA9IGRlY3JlYXNlUGVyY2VudGFnZTtcblxuICAgICAgICB2bS5tZXRhID0ge1xuICAgICAgICAgIGlzb19maWVsZDogJycsXG4gICAgICAgICAgY291bnRyeV9maWVsZDonJyxcbiAgICAgICAgICB0YWJsZTpbXVxuICAgICAgICB9O1xuICAgICAgICB2bS5xdWVyeSA9IHtcbiAgICAgICAgICBmaWx0ZXI6ICcnLFxuICAgICAgICAgIG9yZGVyOiAnLWVycm9ycycsXG4gICAgICAgICAgbGltaXQ6IDE1LFxuICAgICAgICAgIHBhZ2U6IDFcbiAgICAgICAgfTtcbiAgICAgICAgdm0udHJlZU9wdGlvbnMgPSB7XG4gICAgICAgICAgZHJvcHBlZDpmdW5jdGlvbihldmVudCl7XG4gICAgICAgICAgICBjYWxjUGVyY2VudGFnZSh2bS5zb3J0ZWRSZXNvdXJjZXMpO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICAvL1J1biBTdGFydHVwLUZ1bmNpdG9uc1xuICAgICAgICBhY3RpdmF0ZSgpO1xuXG4gICAgICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCl7XG4gICAgICAgICAgY2xlYXJNYXAoKTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBvcGVuQ2xvc2UoYWN0aXZlKXtcbiAgICAgICAgICByZXR1cm4gYWN0aXZlID8gJ3JlbW92ZScgOiAnYWRkJztcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBjbGVhckxheWVyU3R5bGUoZmVhdHVyZSl7XG4gICAgICBcdFx0XHR2YXIgc3R5bGUgPSB7XG4gICAgICAgICAgICAgIGNvbG9yOidyZ2JhKDI1NSwyNTUsMjU1LDApJyxcbiAgICAgICAgICAgICAgb3V0bGluZToge1xuICAgIFx0XHRcdFx0XHRcdGNvbG9yOiAncmdiYSgyNTUsMjU1LDI1NSwwKScsXG4gICAgXHRcdFx0XHRcdFx0c2l6ZTogMVxuICAgIFx0XHRcdFx0XHR9XG4gICAgICAgICAgICB9O1xuICAgICAgXHRcdFx0cmV0dXJuIHN0eWxlO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGNsZWFyTWFwKCl7XG4gICAgICAgICAgXHRsZWFmbGV0RGF0YS5nZXRNYXAoJ21hcCcpLnRoZW4oZnVuY3Rpb24gKG1hcCkge1xuICAgICAgICAgICAgICB2bS5tdnRTb3VyY2UgPSBWZWN0b3JsYXllclNlcnZpY2UuZ2V0TGF5ZXIoKTtcbiAgICAgICAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICB2bS5tdnRTb3VyY2Uuc2V0U3R5bGUoY2xlYXJMYXllclN0eWxlKTtcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIHNlYXJjaChwcmVkaWNhdGUpIHtcbiAgICAgICAgICB2bS5maWx0ZXIgPSBwcmVkaWNhdGU7XG4gICAgICAgIH07XG4gICAgICAgIGZ1bmN0aW9uIG9uT3JkZXJDaGFuZ2Uob3JkZXIpIHtcbiAgICAgICAgICByZXR1cm4gdm0uZGF0YSA9ICRmaWx0ZXIoJ29yZGVyQnknKSh2bS5kYXRhLCBbb3JkZXJdLCB0cnVlKVxuICAgICAgICB9O1xuICAgICAgICBmdW5jdGlvbiBvblBhZ2luYXRpb25DaGFuZ2UocGFnZSwgbGltaXQpIHtcbiAgICAgICAgICAvL2NvbnNvbGUubG9nKHBhZ2UsIGxpbWl0KTtcbiAgICAgICAgICAvL3JldHVybiAkbnV0cml0aW9uLmRlc3NlcnRzLmdldCgkc2NvcGUucXVlcnksIHN1Y2Nlc3MpLiRwcm9taXNlO1xuICAgICAgICB9O1xuICAgICAgICBmdW5jdGlvbiBjaGVja0ZvckVycm9ycyhpdGVtKXtcbiAgICAgICAgICByZXR1cm4gaXRlbS5lcnJvcnMubGVuZ3RoID4gMCA/ICdtZC13YXJuJzogJyc7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gY2xlYXJFcnJvcnMoKXtcbiAgICAgICAgICBhbmd1bGFyLmZvckVhY2godm0uZGF0YSwgZnVuY3Rpb24ocm93LCBrZXkpe1xuICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKHJvdy5kYXRhWzBdLCBmdW5jdGlvbihpdGVtLCBrKXtcbiAgICAgICAgICAgICAgaWYoaXNOYU4oaXRlbSkgfHwgaXRlbSA8IDApe1xuICAgICAgICAgICAgICAgIGlmKGl0ZW0udG9TdHJpbmcoKS50b1VwcGVyQ2FzZSgpID09IFwiTkFcIiB8fCBpdGVtIDwgMCB8fCBpdGVtLnRvU3RyaW5nKCkudG9VcHBlckNhc2UoKS5pbmRleE9mKCdOL0EnKSA+IC0xKXtcbiAgICAgICAgICAgICAgICAgIHZtLmRhdGFba2V5XS5kYXRhWzBdW2tdID0gJyc7XG4gICAgICAgICAgICAgICAgICB2bS5lcnJvcnMgLS07XG4gICAgICAgICAgICAgICAgICByb3cuZXJyb3JzLnNwbGljZSgwLDEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBzd2l0Y2ggKGl0ZW0pIHtcbiAgICAgICAgICAgICAgICBjYXNlICdDYWJvIFZlcmRlJzpcbiAgICAgICAgICAgICAgICAgICAgICB2bS5kYXRhW2tleV0uZGF0YVswXVtrXSAgID0gJ0NhcGUgVmVyZGUnO1xuICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBcIkRlbW9jcmF0aWMgUGVvcGxlcyBSZXB1YmxpYyBvZiBLb3JlYVwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgdm0uZGF0YVtrZXldLmRhdGFbMF1ba10gICA9IFwiRGVtb2NyYXRpYyBQZW9wbGUncyBSZXB1YmxpYyBvZiBLb3JlYVwiO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIFwiQ290ZSBkJ0l2b2lyZVwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgdm0uZGF0YVtrZXldLmRhdGFbMF1ba10gICA9IFwiSXZvcnkgQ29hc3RcIjtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBcIkxhbyBQZW9wbGVzIERlbW9jcmF0aWMgUmVwdWJsaWNcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgIHZtLmRhdGFba2V5XS5kYXRhWzBdW2tdICAgPSBcIkxhbyBQZW9wbGUncyBEZW1vY3JhdGljIFJlcHVibGljXCI7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZighcm93LmRhdGFbMF1bdm0ubWV0YS5pc29fZmllbGRdKXtcbiAgICAgICAgICAgICAgdm0uaXNvX2Vycm9ycysrO1xuICAgICAgICAgICAgICB2bS5lcnJvcnMrK1xuICAgICAgICAgICAgICByb3cuZXJyb3JzLnB1c2goe1xuICAgICAgICAgICAgICAgIHR5cGU6XCIyXCIsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTpcIklzbyBmaWVsZCBpcyBub3QgdmFsaWQhXCIsXG4gICAgICAgICAgICAgICAgY29sdW1uOiB2bS5tZXRhLmlzb19maWVsZFxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGNoZWNrQ29sdW1uRGF0YShrZXkpe1xuICAgICAgICAgIGlmKHR5cGVvZiB2bS5tZXRhLnRhYmxlW2tleV0gIT0gXCJ1bmRlZmluZWRcIil7XG4gICAgICAgICAgICBpZih2bS5tZXRhLnRhYmxlW2tleV0udGl0bGUpe1xuICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGVkaXRDb2x1bW5EYXRhKGUsIGtleSl7XG4gICAgICAgICAgdm0udG9FZGl0ID0ga2V5O1xuICAgICAgICAgIERpYWxvZ1NlcnZpY2UuZnJvbVRlbXBsYXRlKCdlZGl0Y29sdW1uJywgJHNjb3BlKTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBkZWxldGVTZWxlY3RlZCgpe1xuICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaCh2bS5zZWxlY3RlZCwgZnVuY3Rpb24oaXRlbSwga2V5KXtcbiAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaChpdGVtLmVycm9ycywgZnVuY3Rpb24oZXJyb3IsIGspe1xuICAgICAgICAgICAgICBpZihlcnJvci50eXBlID09IDIpe1xuICAgICAgICAgICAgICAgIHZtLmlzb19lcnJvcnMgLS07XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgdm0uZXJyb3JzIC0tO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIHZtLmRhdGEuc3BsaWNlKHZtLmRhdGEuaW5kZXhPZihpdGVtKSwgMSk7XG4gICAgICAgICAgICB2bS5zZWxlY3RlZC5zcGxpY2Uoa2V5LCAxKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBpZih2bS5kYXRhLmxlbmd0aCA9PSAwKXtcbiAgICAgICAgICAgIHZtLmRlbGV0ZURhdGEoKTtcbiAgICAgICAgICAgICRzdGF0ZS5nb3QoJ2FwcC5pbmRleC5jcmVhdGUnKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gZWRpdFJvdygpe1xuICAgICAgICAgIHZtLnJvdyA9IHZtLnNlbGVjdGVkWzBdO1xuICAgICAgICAgIERpYWxvZ1NlcnZpY2UuZnJvbVRlbXBsYXRlKCdlZGl0cm93JywgJHNjb3BlKTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBkZWxldGVEYXRhKCl7XG4gICAgICAgICAgdm0uZGF0YSA9IFtdO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGZldGNoSXNvKCl7XG4gICAgICAgICAgaWYoIXZtLm1ldGEuaXNvX2ZpZWxkKXtcbiAgICAgICAgICAgIHRvYXN0ci5lcnJvcignQ2hlY2sgeW91ciBzZWxlY3Rpb24gZm9yIHRoZSBJU08gZmllbGQnLCAnQ29sdW1uIG5vdCBzcGVjaWZpZWQhJyk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmKCF2bS5tZXRhLmNvdW50cnlfZmllbGQpe1xuICAgICAgICAgICAgdG9hc3RyLmVycm9yKCdDaGVjayB5b3VyIHNlbGVjdGlvbiBmb3IgdGhlIENPVU5UUlkgZmllbGQnLCAnQ29sdW1uIG5vdCBzcGVjaWZpZWQhJyk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmKHZtLm1ldGEuY291bnRyeV9maWVsZCA9PSB2bS5tZXRhLmlzb19maWVsZCl7XG4gICAgICAgICAgICB0b2FzdHIuZXJyb3IoJ0lTTyBmaWVsZCBhbmQgQ09VTlRSWSBmaWVsZCBjYW4gbm90IGJlIHRoZSBzYW1lJywgJ1NlbGVjdGlvbiBlcnJvciEnKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB2bS50b1NlbGVjdCA9IFtdO1xuICAgICAgICAgIHZtLm5vdEZvdW5kID0gW107XG4gICAgICAgICAgdmFyIGVudHJpZXMgPSBbXTtcbiAgICAgICAgICBhbmd1bGFyLmZvckVhY2godm0uZGF0YSwgZnVuY3Rpb24oaXRlbSwga2V5KXtcbiAgICAgICAgICAgICAgZW50cmllcy5wdXNoKHtcbiAgICAgICAgICAgICAgICBpc286IGl0ZW0uZGF0YVswXVt2bS5tZXRhLmlzb19maWVsZF0sXG4gICAgICAgICAgICAgICAgbmFtZTogaXRlbS5kYXRhWzBdW3ZtLm1ldGEuY291bnRyeV9maWVsZF1cbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgRGF0YVNlcnZpY2UucG9zdCgnL25hdGlvbnMvYnlJc29OYW1lcycsIHtkYXRhOmVudHJpZXN9KS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKHJlc3BvbnNlLmRhdGEsIGZ1bmN0aW9uKGNvdW50cnksIGtleSl7XG4gICAgICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKHZtLmRhdGEsIGZ1bmN0aW9uKGl0ZW0sIGspe1xuICAgICAgICAgICAgICAgICAgICBpZihjb3VudHJ5Lm5hbWUgPT0gaXRlbS5kYXRhWzBdW3ZtLm1ldGEuY291bnRyeV9maWVsZF0pe1xuICAgICAgICAgICAgICAgICAgICAgIGlmKGNvdW50cnkuZGF0YS5sZW5ndGggPiAxKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0b1NlbGVjdCA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZW50cnk6IGl0ZW0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnM6IGNvdW50cnkuZGF0YVxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZtLnRvU2VsZWN0LnB1c2godG9TZWxlY3QpO1xuICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYodHlwZW9mIGNvdW50cnkuZGF0YVswXSAhPSBcInVuZGVmaW5lZFwiKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdm0uZGF0YVtrXS5kYXRhWzBdW3ZtLm1ldGEuaXNvX2ZpZWxkXSA9IGNvdW50cnkuZGF0YVswXS5pc287XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHZtLmRhdGFba10uZGF0YVswXVt2bS5tZXRhLmNvdW50cnlfZmllbGRdID0gY291bnRyeS5kYXRhWzBdLmFkbWluO1xuICAgICAgICAgICAgICAgICAgICAgICAgICBpZihpdGVtLmVycm9ycy5sZW5ndGgpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaChpdGVtLmVycm9ycywgZnVuY3Rpb24oZXJyb3IsIGUpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoZXJyb3IudHlwZSA9PSAyKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdm0uaXNvX2Vycm9ycyAtLTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdm0uZXJyb3JzIC0tO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtLmVycm9ycy5zcGxpY2UoZSwgMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coY291bnRyeSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICBpZih2bS50b1NlbGVjdC5sZW5ndGgpe1xuICAgICAgICAgICAgICAgIERpYWxvZ1NlcnZpY2UuZnJvbVRlbXBsYXRlKCdzZWxlY3Rpc29mZXRjaGVycycsICRzY29wZSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgdm0uaXNvX2NoZWNrZWQgPSB0cnVlO1xuICAgICAgICAgIH0sIGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcbiAgICAgICAgICAgIHRvYXN0ci5lcnJvcignUGxlYXNlIGNoZWNrIHlvdXIgZmllbGQgc2VsZWN0aW9ucycsIHJlc3BvbnNlLmRhdGEubWVzc2FnZSk7XG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBzYXZlRGF0YSgpe1xuICAgICAgICAgIGNvbnNvbGUubG9nKHZtLm1ldGEudGFibGUpO1xuICAgICAgICAgIGNvbnNvbGUubG9nKHZtLm1ldGEudGFibGUsIHZtLmRhdGFbMF0uZGF0YVswXS5sZW5ndGgpO1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcblxuICAgICAgICAgIHZhciBpbnNlcnREYXRhID0ge2RhdGE6W119O1xuICAgICAgICAgIHZhciBtZXRhID0gW10sIGZpZWxkcyA9IFtdO1xuICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaCh2bS5kYXRhLCBmdW5jdGlvbihpdGVtLCBrZXkpe1xuICAgICAgICAgICAgaWYoaXRlbS5lcnJvcnMubGVuZ3RoID09IDApe1xuICAgICAgICAgICAgICBpdGVtLmRhdGFbMF0ueWVhciA9IHZtLm1ldGEueWVhcjtcbiAgICAgICAgICAgICAgaW5zZXJ0RGF0YS5kYXRhLnB1c2goaXRlbS5kYXRhWzBdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICAgIHRvYXN0ci5lcnJvcignVGhlcmUgYXJlIHNvbWUgZXJyb3JzIGxlZnQhJywgJ0h1Y2ghJyk7XG4gICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgICBhbmd1bGFyLmZvckVhY2godm0uZGF0YVswXS5kYXRhWzBdLCBmdW5jdGlvbihpdGVtLCBrZXkpe1xuICAgICAgICAgICAgaWYodm0ubWV0YS50YWJsZVtrZXldKXtcbiAgICAgICAgICAgICAgdmFyIGZpZWxkID0ge1xuICAgICAgICAgICAgICAgICdjb2x1bW4nOiBrZXksXG4gICAgICAgICAgICAgICAgJ3RpdGxlJzp2bS5tZXRhLnRhYmxlW2tleV0udGl0bGUsXG4gICAgICAgICAgICAgICAgJ2Rlc2NyaXB0aW9uJzp2bS5tZXRhLnRhYmxlW2tleV0uZGVzY3JpcHRpb25cbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgZmllbGRzLnB1c2goZmllbGQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaCh2bS5kYXRhLnRhYmxlLCBmdW5jdGlvbihpdGVtLCBrZXkpe1xuICAgICAgICAgICAgbWV0YS5wdXNoKHtcbiAgICAgICAgICAgICAgZmllbGQ6a2V5LFxuICAgICAgICAgICAgICBkYXRhOiBpdGVtXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH0pXG4gICAgICAgICAgdm0ubWV0YS5maWVsZHMgPSBmaWVsZHM7XG4gICAgICAgICAgdm0ubWV0YS5pbmZvID0gbWV0YTtcblxuICAgICAgICAgIERhdGFTZXJ2aWNlLnBvc3QoJ2RhdGEvdGFibGVzJywgdm0ubWV0YSkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICAgICAgICAgIERhdGFTZXJ2aWNlLnBvc3QoJ2RhdGEvdGFibGVzLycrcmVzcG9uc2UuZGF0YS50YWJsZV9uYW1lKycvaW5zZXJ0JywgaW5zZXJ0RGF0YSkudGhlbihmdW5jdGlvbihyZXMpe1xuICAgICAgICAgICAgICAgIGlmKHJlcy5kYXRhID09IHRydWUpe1xuICAgICAgICAgICAgICAgICAgdG9hc3RyLnN1Y2Nlc3MoaW5zZXJ0RGF0YS5kYXRhLmxlbmd0aCsnIGl0ZW1zIGltcG9ydGV0IHRvICcrdm0ubWV0YS5uYW1lLCdTdWNjZXNzJyk7XG4gICAgICAgICAgICAgICAgICB2bS5kYXRhID0gW107XG4gICAgICAgICAgICAgICAgICB2bS5zdGVwID0gMDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0sIGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgICAgICAgIGlmKHJlc3BvbnNlLm1lc3NhZ2Upe1xuICAgICAgICAgICAgICB0b2FzdHIuZXJyb3IocmVzcG9uc2UubWVzc2FnZSwgJ091Y2ghJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiB0b2dnbGVMaXN0UmVzb3VyY2VzKCl7XG4gICAgICAgICAgdm0uc2hvd1Jlc291cmNlcyA9ICF2bS5zaG93UmVzb3VyY2VzO1xuICAgICAgICAgIGlmKHZtLnNob3dSZXNvdXJjZXMpe1xuICAgICAgICAgICAgdm0ubGlzdFJlc291cmNlcygpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBsaXN0UmVzb3VyY2VzKCl7XG5cbiAgICAgICAgICBpZighdm0ucmVzb3VyY2VzKXtcbiAgICAgICAgICAgIERhdGFTZXJ2aWNlLmdldEFsbCgnZGF0YS90YWJsZXMnKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgICAgICAgICAgdm0ucmVzb3VyY2VzID0gcmVzcG9uc2U7XG4gICAgICAgICAgICAgIHZtLnNlbGVjdGVkUmVzb3VyY2VzID0gW10sIHZtLnNvcnRlZFJlc291cmNlcyA9IFtdO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9XG5cbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBzZWxlY3RlZFJlc291cmNlKHJlc291cmNlKXtcbiAgICAgICAgICByZXR1cm4gdm0uc2VsZWN0ZWRSZXNvdXJjZXMuaW5kZXhPZihyZXNvdXJjZSkgPiAtMSA/IHRydWUgOiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiB0b2dnbGVSZXNvdXJjZShyZXNvdXJjZSl7XG4gICAgICAgICAgaWYodm0uc2VsZWN0ZWRSZXNvdXJjZXMuaW5kZXhPZihyZXNvdXJjZSkgPiAtMSl7XG4gICAgICAgICAgICB2bS5zZWxlY3RlZFJlc291cmNlcy5zcGxpY2Uodm0uc2VsZWN0ZWRSZXNvdXJjZXMuaW5kZXhPZihyZXNvdXJjZSksIDEpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgdm0uc2VsZWN0ZWRSZXNvdXJjZXMucHVzaChyZXNvdXJjZSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGFuZ3VsYXIuY29weSh2bS5zZWxlY3RlZFJlc291cmNlcywgdm0uc29ydGVkUmVzb3VyY2VzKTtcbiAgICAgICAgICBhbmd1bGFyLmZvckVhY2godm0uc29ydGVkUmVzb3VyY2VzLCBmdW5jdGlvbihyZXMsIGtleSl7XG4gICAgICAgICAgICAgdm0uc29ydGVkUmVzb3VyY2VzW2tleV0ud2VpZ2h0ID0gcGFyc2VJbnQoMTAwIC8gdm0uc29ydGVkUmVzb3VyY2VzLmxlbmd0aCk7XG4gICAgICAgICAgICAgdm0uc29ydGVkUmVzb3VyY2VzW2tleV0ubm9kZXMgPSBbXTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBjYWxjUGVyY2VudGFnZSh2bS5zb3J0ZWRSZXNvdXJjZXMpO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGNhbGNQZXJjZW50YWdlKG5vZGVzKXtcbiAgICAgICAgICBhbmd1bGFyLmZvckVhY2gobm9kZXMsIGZ1bmN0aW9uKG5vZGUsIGtleSl7XG4gICAgICAgICAgICBub2Rlc1trZXldLndlaWdodCA9IHBhcnNlSW50KDEwMCAvIG5vZGVzLmxlbmd0aCk7XG4gICAgICAgICAgICBjYWxjUGVyY2VudGFnZShub2Rlcy5ub2RlKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBpbmNyZWFzZVBlcmNlbnRhZ2UoaXRlbSl7XG4gICAgICAgICAgY29uc29sZS5sb2coaXRlbSk7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gZGVjcmVhc2VQZXJjZW50YWdlKGl0ZW0pe1xuICAgICAgICAgIGNvbnNvbGUubG9nKGl0ZW0pXG4gICAgICAgIH1cbiAgICAgICAgJHNjb3BlLiRvbihcIiRzdGF0ZUNoYW5nZVN0YXJ0XCIsIGZ1bmN0aW9uIChldmVudCwgdG9TdGF0ZSwgdG9QYXJhbXMsIGZyb21TdGF0ZSwgZnJvbVBhcmFtcykge1xuICAgICAgICAgIHN3aXRjaCAodG9TdGF0ZS5uYW1lKSB7XG4gICAgICAgICAgICBjYXNlICdhcHAuaW5kZXguY3JlYXRlLmNoZWNrJzpcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdhcHAuaW5kZXguY3JlYXRlLm1ldGEnOlxuICAgICAgICAgICAgICAgIGlmKCF2bS5tZXRhLmlzb19maWVsZCl7XG4gICAgICAgICAgICAgICAgICB0b2FzdHIuZXJyb3IoJ05vIGZpZWxkIGZvciBJU08gQ29kZSBzZWxlY3RlZCEnLCAnRXJyb3InKTtcbiAgICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgJHJvb3RTY29wZS5zdGF0ZUlzTG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2FwcC5pbmRleC5jcmVhdGUuZmluYWwnOlxuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgaWYodm0uZGF0YS5sZW5ndGgpe1xuICAgICAgICAgICAgICAgICAgJHNjb3BlLnRvU3RhdGUgPSB0b1N0YXRlO1xuICAgICAgICAgICAgICAgICAgRGlhbG9nU2VydmljZS5mcm9tVGVtcGxhdGUoJ2xvb3NlZGF0YScsICRzY29wZSwgdm0uZGVsZXRlRGF0YSk7XG4gICAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgJHJvb3RTY29wZS5zdGF0ZUlzTG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgJHNjb3BlLiRvbihcIiRzdGF0ZUNoYW5nZVN1Y2Nlc3NcIiwgZnVuY3Rpb24gKGV2ZW50LCB0b1N0YXRlLCB0b1BhcmFtcywgZnJvbVN0YXRlLCBmcm9tUGFyYW1zKSB7XG4gICAgICAgICAgaWYoIXZtLmRhdGEubGVuZ3RoKXtcbiAgICAgICAgICAgICRzdGF0ZS5nbygnYXBwLmluZGV4LmNyZWF0ZScpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgc3dpdGNoICh0b1N0YXRlLm5hbWUpIHtcbiAgICAgICAgICAgICAgY2FzZSAnYXBwLmluZGV4LmNyZWF0ZSc6XG4gICAgICAgICAgICAgICAgICB2bS5zdGVwID0gMDtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgY2FzZSAnYXBwLmluZGV4LmNyZWF0ZS5jaGVjayc6XG4gICAgICAgICAgICAgICAgICB2bS5zdGVwID0gMTtcbiAgICAgICAgICAgICAgICAgIHZtLnNob3dVcGxvYWRDb250YWluZXIgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgY2FzZSAnYXBwLmluZGV4LmNyZWF0ZS5tZXRhJzpcbiAgICAgICAgICAgICAgICAgIHZtLnN0ZXAgPSAyO1xuICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIGNhc2UgJ2FwcC5pbmRleC5jcmVhdGUuZmluYWwnOlxuICAgICAgICAgICAgICAgICAgdm0uc3RlcCA9IDM7XG4gICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignTG9naW5DdHJsJywgZnVuY3Rpb24oJHN0YXRlLCAkYXV0aCwgdG9hc3RyKXtcbiAgICAgICAgdmFyIHZtID0gdGhpcztcbiAgICAgICAgdm0uZG9Mb2dpbiA9IGRvTG9naW47XG4gICAgICAgIHZtLmNoZWNrTG9nZ2VkSW4gPSBjaGVja0xvZ2dlZEluO1xuICAgICAgICB2bS51c2VyID0ge1xuICAgICAgICAgIGVtYWlsOicnLFxuICAgICAgICAgIHBhc3N3b3JkOicnXG4gICAgICAgIH07XG5cbiAgICAgICAgYWN0aXZhdGUoKTtcblxuICAgICAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpe1xuICAgICAgICAgIHZtLmNoZWNrTG9nZ2VkSW4oKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGNoZWNrTG9nZ2VkSW4oKXtcblxuICAgICAgICAgIGlmKCRhdXRoLmlzQXV0aGVudGljYXRlZCgpKXtcbiAgICAgICAgICAgIC8vJHN0YXRlLmdvKCdhcHAuaW5kZXguc2hvdycsIHtpbmRleDonZXBpJ30pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBkb0xvZ2luKCl7XG4gICAgICAgICAgJGF1dGgubG9naW4odm0udXNlcikudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICAgICAgICB0b2FzdHIuc3VjY2VzcygnWW91IGhhdmUgc3VjY2Vzc2Z1bGx5IHNpZ25lZCBpbicpO1xuICAgICAgICAgICAgJHN0YXRlLmdvKCdhcHAuaW5kZXguc2hvdycse2luZGV4OidlcGknfSlcbiAgICAgICAgICB9KS5jYXRjaChmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICAgICAgICB0b2FzdHIuZXJyb3IoJ1BsZWFzZSBjaGVjayB5b3VyIGVtYWlsIGFuZCBwYXNzd29yZCcsICdTb21ldGhpbmcgd2VudCB3cm9uZycpO1xuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdNYXBDdHJsJywgZnVuY3Rpb24gKGxlYWZsZXREYXRhLCBWZWN0b3JsYXllclNlcnZpY2UpIHtcblx0XHQvL1xuXHRcdHZhciB2bSA9IHRoaXM7XG5cdFx0dmFyIGFwaUtleSA9ICdway5leUoxSWpvaWJXRm5ibTlzYnlJc0ltRWlPaUp1U0ZkVVlrZzRJbjAuNUhPeWtLazBwTlAxTjNpc2ZQUUdUUSc7XG5cdFx0dm0uZGVmYXVsdHMgPSB7XG5cdFx0XHRzY3JvbGxXaGVlbFpvb206IGZhbHNlXG5cdFx0fTtcblx0XHR2bS5jZW50ZXIgPSB7XG5cdFx0XHRsYXQ6IDAsXG5cdFx0XHRsbmc6IDAsXG5cdFx0XHR6b29tOiAzXG5cdFx0fTtcblx0XHR2bS5sYXllcnMgPSB7XG5cdFx0XHRiYXNlbGF5ZXJzOiB7XG5cdFx0XHRcdHh5ejoge1xuXHRcdFx0XHRcdG5hbWU6ICdNYXBCb3ggT3V0ZG9vcnMgTW9kJyxcblx0XHRcdFx0XHR1cmw6ICdodHRwczovL3tzfS50aWxlcy5tYXBib3guY29tL3Y0L3ZhbGRlcnJhbWEuZDg2MTE0YjYve3p9L3t4fS97eX0ucG5nP2FjY2Vzc190b2tlbj0nICsgYXBpS2V5LFxuXHRcdFx0XHRcdHR5cGU6ICd4eXonLFxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGxlYWZsZXREYXRhLmdldE1hcCgnbWFwJykudGhlbihmdW5jdGlvbihtYXApIHtcblx0XHRcdHZhciB1cmwgPSAnaHR0cDovL3YyMjAxNTA1MjgzNTgyNTM1OC55b3VydnNlcnZlci5uZXQ6MzAwMS9zZXJ2aWNlcy9wb3N0Z2lzL2NvdW50cmllc19iaWcvZ2VvbS92ZWN0b3ItdGlsZXMve3p9L3t4fS97eX0ucGJmP2ZpZWxkcz1pZCxhZG1pbixhZG0wX2EzLHdiX2EzLHN1X2EzLGlzb19hMyxuYW1lLG5hbWVfbG9uZyc7IC8vXG5cdFx0XHR2YXIgbGF5ZXIgPSBuZXcgTC5UaWxlTGF5ZXIuTVZUU291cmNlKHtcblx0XHRcdFx0dXJsOiB1cmwsXG5cdFx0XHRcdGRlYnVnOiBmYWxzZSxcblx0XHRcdFx0Y2xpY2thYmxlTGF5ZXJzOiBbJ2NvdW50cmllc19iaWdfZ2VvbSddLFxuXHRcdFx0XHRtdXRleFRvZ2dsZTogdHJ1ZSxcblx0XHRcdFx0Z2V0SURGb3JMYXllckZlYXR1cmU6IGZ1bmN0aW9uKGZlYXR1cmUpIHtcblx0XHRcdFx0XHRyZXR1cm4gZmVhdHVyZS5wcm9wZXJ0aWVzLmFkbTBfYTM7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdGZpbHRlcjogZnVuY3Rpb24oZmVhdHVyZSwgY29udGV4dCkge1xuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHRcdCBtYXAuYWRkTGF5ZXIoVmVjdG9ybGF5ZXJTZXJ2aWNlLnNldExheWVyKGxheWVyKSk7XG5cdFx0XHQgdmFyIGxhYmVsc0xheWVyID0gTC50aWxlTGF5ZXIoJ2h0dHBzOi8ve3N9LnRpbGVzLm1hcGJveC5jb20vdjQvbWFnbm9sby4wNjAyOWE5Yy97en0ve3h9L3t5fS5wbmc/YWNjZXNzX3Rva2VuPScgKyBhcGlLZXkpO1xuXHRcdFx0IG1hcC5hZGRMYXllcihsYWJlbHNMYXllcik7XG5cdFx0XHQgbGFiZWxzTGF5ZXIuYnJpbmdUb0Zyb250KCk7XG5cdFx0fSk7XG5cdH0pO1xufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ1NlbGVjdGVkQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgZ2V0Q291bnRyeSwgVmVjdG9ybGF5ZXJTZXJ2aWNlLCAkZmlsdGVyKXtcbiAgICAgICAgLy9cbiAgICAgICAgdmFyIHZtID0gdGhpcztcbiAgICAgICAgdm0uc3RydWN0dXJlID0gJHNjb3BlLiRwYXJlbnQudm0uc3RydWN0dXJlO1xuICAgICAgICB2bS5kaXNwbGF5ID0gJHNjb3BlLiRwYXJlbnQudm0uZGlzcGxheTtcbiAgICAgICAgdm0uZGF0YSA9ICRzY29wZS4kcGFyZW50LnZtLmRhdGE7XG4gICAgICAgIHZtLmN1cnJlbnQgPSBnZXRDb3VudHJ5O1xuICAgICAgICB2bS5tdnRTb3VyY2UgPSBWZWN0b3JsYXllclNlcnZpY2UuZ2V0TGF5ZXIoKTtcbiAgICAgICAgdm0uZ2V0UmFuayA9IGdldFJhbms7XG4gICAgICAgIHZtLmdldE9mZnNldCA9IGdldE9mZnNldDtcbiAgICAgICAgdm0uZ2V0VGVuZGVuY3kgPSBnZXRUZW5kZW5jeTtcblxuICAgICAgICBmdW5jdGlvbiBjYWxjUmFuaygpIHtcbiAgICAgICAgICB2YXIgcmFuayA9IDA7XG4gICAgICAgICAgYW5ndWxhci5mb3JFYWNoKHZtLmRhdGEsIGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgICAgICAgIGl0ZW1bdm0uc3RydWN0dXJlLnNjb3JlX2ZpZWxkX25hbWVdID0gcGFyc2VGbG9hdChpdGVtW3ZtLnN0cnVjdHVyZS5zY29yZV9maWVsZF9uYW1lXSk7XG4gICAgICAgICAgICBpdGVtWydzY29yZSddID0gcGFyc2VJbnQoaXRlbVsnc2NvcmUnXSk7XG4gICAgICAgICAgfSlcbiAgICAgICAgICB2YXIgZmlsdGVyID0gJGZpbHRlcignb3JkZXJCeScpKHZtLmRhdGEsIFt2bS5zdHJ1Y3R1cmUuc2NvcmVfZmllbGRfbmFtZSwgXCJzY29yZVwiXSwgdHJ1ZSk7XG4gICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBmaWx0ZXIubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChmaWx0ZXJbaV0uaXNvID09IHZtLmN1cnJlbnQuaXNvKSB7XG4gICAgICAgICAgICAgIHJhbmsgPSBpICsgMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgdm0uY3VycmVudFt2bS5zdHJ1Y3R1cmUuc2NvcmVfZmllbGRfbmFtZSsnX3JhbmsnXSA9IHJhbms7XG4gICAgICAgICAgdm0uY2lyY2xlT3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgY29sb3I6dm0uc3RydWN0dXJlLmNvbG9yLFxuICAgICAgICAgICAgICBmaWVsZDp2bS5zdHJ1Y3R1cmUuc2NvcmVfZmllbGRfbmFtZSsnX3JhbmsnXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGdldFJhbmsoY291bnRyeSl7XG4gICAgICAgICAgdmFyIGZpbHRlciA9ICRmaWx0ZXIoJ29yZGVyQnknKSh2bS5kYXRhLCBbdm0uc3RydWN0dXJlLnNjb3JlX2ZpZWxkX25hbWUsIFwic2NvcmVcIl0sIHRydWUpO1xuICAgICAgICAgIHZhciByYW5rID0gMDtcbiAgICAgICAgICBhbmd1bGFyLmZvckVhY2goZmlsdGVyLCBmdW5jdGlvbihpdGVtLCBrZXkpe1xuICAgICAgICAgICAgaWYoaXRlbS5jb3VudHJ5ID09IGNvdW50cnkuY291bnRyeSl7XG4gICAgICAgICAgICAgIHJhbmsgPSBrZXk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgcmV0dXJuIHJhbmsrMTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBnZXRPZmZzZXQoKSB7XG4gICAgXHRcdFx0aWYgKCF2bS5jdXJyZW50KSB7XG4gICAgXHRcdFx0XHRyZXR1cm4gMDtcbiAgICBcdFx0XHR9XG4gICAgXHRcdFx0cmV0dXJuICh2bS5nZXRSYW5rKHZtLmN1cnJlbnQpIC0gMikgKiAxNjtcbiAgICBcdFx0fTtcblxuICAgIFx0XHRmdW5jdGlvbiBnZXRUZW5kZW5jeSgpIHtcbiAgICBcdFx0XHRpZiAoIXZtLmN1cnJlbnQpIHtcbiAgICBcdFx0XHRcdHJldHVybiAnYXJyb3dfZHJvcF9kb3duJ1xuICAgIFx0XHRcdH1cbiAgICBcdFx0XHRyZXR1cm4gdm0uY3VycmVudC5wZXJjZW50X2NoYW5nZSA+IDAgPyAnYXJyb3dfZHJvcF91cCcgOiAnYXJyb3dfZHJvcF9kb3duJztcbiAgICBcdFx0fTtcblxuICAgICAgICAkc2NvcGUuJHdhdGNoKCd2bS5jdXJyZW50JywgZnVuY3Rpb24gKG4sIG8pIHtcbiAgICAgICAgICBpZiAobiA9PT0gbykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYoby5pc28pe1xuICAgICAgICAgICAgICB2bS5tdnRTb3VyY2UubGF5ZXJzLmNvdW50cmllc19iaWdfZ2VvbS5mZWF0dXJlc1tvLmlzb10uc2VsZWN0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhbGNSYW5rKCk7XG4gICAgICAgICAgICBmZXRjaE5hdGlvbkRhdGEobi5pc28pO1xuXG5cbiAgICAgICAgfSk7XG4gICAgICAgIC8qOyovXG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ1NpZGViYXJDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCAkc3RhdGUpe1xuXG5cblx0fSk7XG5cbn0pKCk7IiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignU2lnbnVwQ3RybCcsIGZ1bmN0aW9uKCl7XG4gICAgICAgIC8vXG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ1RvYXN0c0N0cmwnLCBmdW5jdGlvbigkc2NvcGUsIFRvYXN0U2VydmljZSl7XG5cblx0XHQkc2NvcGUudG9hc3RTdWNjZXNzID0gZnVuY3Rpb24oKXtcblx0XHRcdFRvYXN0U2VydmljZS5zaG93KCdVc2VyIGFkZGVkIHN1Y2Nlc3NmdWxseSEnKTtcblx0XHR9O1xuXG5cdFx0JHNjb3BlLnRvYXN0RXJyb3IgPSBmdW5jdGlvbigpe1xuXHRcdFx0VG9hc3RTZXJ2aWNlLmVycm9yKCdDb25uZWN0aW9uIGludGVycnVwdGVkIScpO1xuXHRcdH07XG5cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdVbnN1cHBvcnRlZEJyb3dzZXJDdHJsJywgZnVuY3Rpb24oKXtcbiAgICAgICAgLy9cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ1VzZXJDdHJsJywgZnVuY3Rpb24oKXtcbiAgICAgICAgLy9cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0FkZFVzZXJzQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgRGlhbG9nU2VydmljZSl7XG5cbiAgICAgICAgJHNjb3BlLnNhdmUgPSBmdW5jdGlvbigpe1xuXHQgICAgICAgIC8vZG8gc29tZXRoaW5nIHVzZWZ1bFxuICAgICAgICAgICAgRGlhbG9nU2VydmljZS5oaWRlKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgJHNjb3BlLmhpZGUgPSBmdW5jdGlvbigpe1xuICAgICAgICBcdERpYWxvZ1NlcnZpY2UuaGlkZSgpO1xuICAgICAgICB9O1xuXG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdFZGl0Y29sdW1uQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgRGlhbG9nU2VydmljZSl7XG4gICAgICAgICRzY29wZS5uYW1lID0gJHNjb3BlLiRwYXJlbnQudm0udG9FZGl0O1xuICAgICAgICBpZih0eXBlb2YgJHNjb3BlLiRwYXJlbnQudm0ubWV0YS50YWJsZVskc2NvcGUubmFtZV0gPT0gXCJ1bmRlZmluZWRcIil7XG4gICAgICAgICAgJHNjb3BlLiRwYXJlbnQudm0ubWV0YS50YWJsZVskc2NvcGUubmFtZV0gPSB7fTtcbiAgICAgICAgfVxuICAgICAgICBlbHNle1xuICAgICAgICAgIGlmKCRzY29wZS4kcGFyZW50LnZtLm1ldGEudGFibGVbJHNjb3BlLm5hbWVdLnRpdGxlKXtcbiAgICAgICAgICAgICRzY29wZS50aXRsZSA9ICRzY29wZS4kcGFyZW50LnZtLm1ldGEudGFibGVbJHNjb3BlLm5hbWVdLnRpdGxlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZigkc2NvcGUuJHBhcmVudC52bS5tZXRhLnRhYmxlWyRzY29wZS5uYW1lXS5kZXNjcmlwdGlvbil7XG4gICAgICAgICAgICAkc2NvcGUuZGVzY3JpcHRpb24gPSAkc2NvcGUuJHBhcmVudC52bS5tZXRhLnRhYmxlWyRzY29wZS5uYW1lXS5kZXNjcmlwdGlvbjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAkc2NvcGUuc2F2ZSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgJHNjb3BlLiRwYXJlbnQudm0ubWV0YS50YWJsZVskc2NvcGUubmFtZV0udGl0bGUgPSAkc2NvcGUudGl0bGU7XG4gICAgICAgICAgJHNjb3BlLiRwYXJlbnQudm0ubWV0YS50YWJsZVskc2NvcGUubmFtZV0uZGVzY3JpcHRpb24gPSAkc2NvcGUuZGVzY3JpcHRpb247XG4gICAgICAgICAgRGlhbG9nU2VydmljZS5oaWRlKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgJHNjb3BlLmhpZGUgPSBmdW5jdGlvbigpe1xuICAgICAgICBcdERpYWxvZ1NlcnZpY2UuaGlkZSgpO1xuICAgICAgICB9O1xuXG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdFZGl0cm93Q3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgRGlhbG9nU2VydmljZSl7XG4gICAgICAgICRzY29wZS5kYXRhID0gJHNjb3BlLiRwYXJlbnQudm0uc2VsZWN0ZWRbMF07XG4gICAgICAgICRzY29wZS5zYXZlID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICBjb25zb2xlLmxvZygkc2NvcGUuZGF0YSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgJHNjb3BlLmhpZGUgPSBmdW5jdGlvbigpe1xuICAgICAgICBcdERpYWxvZ1NlcnZpY2UuaGlkZSgpO1xuICAgICAgICB9O1xuXG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdMb29zZWRhdGFDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCAkc3RhdGUsIERpYWxvZ1NlcnZpY2Upe1xuXG4gICAgICAgICRzY29wZS5zYXZlID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAkc2NvcGUudm0uZGVsZXRlRGF0YSgpO1xuICAgICAgICAgICAgJHN0YXRlLmdvKCRzY29wZS50b1N0YXRlLm5hbWUpO1xuICAgICAgICAgICAgRGlhbG9nU2VydmljZS5oaWRlKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgJHNjb3BlLmhpZGUgPSBmdW5jdGlvbigpe1xuICAgICAgICBcdERpYWxvZ1NlcnZpY2UuaGlkZSgpO1xuICAgICAgICB9O1xuXG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdTZWxlY3Rpc29mZXRjaGVyc0N0cmwnLCBmdW5jdGlvbigkc2NvcGUsIERpYWxvZ1NlcnZpY2Upe1xuICAgICAgICAkc2NvcGUuaXNvID0gJHNjb3BlLiRwYXJlbnQudm0ubWV0YS5pc29fZmllbGQ7XG4gICAgICAgICRzY29wZS5saXN0ID0gJHNjb3BlLiRwYXJlbnQudm0udG9TZWxlY3Q7XG5cbiAgICAgICAgJHNjb3BlLnNhdmUgPSBmdW5jdGlvbigpe1xuICAgICAgICAgIERpYWxvZ1NlcnZpY2UuaGlkZSgpO1xuICAgICAgICB9O1xuXG4gICAgICAgICRzY29wZS5oaWRlID0gZnVuY3Rpb24oKXtcbiAgICAgICAgXHREaWFsb2dTZXJ2aWNlLmhpZGUoKTtcbiAgICAgICAgfTtcblxuICAgICAgICAkc2NvcGUuJHdhdGNoKCdsaXN0JywgZnVuY3Rpb24obiwgbyl7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhuKTtcbiAgICAgICAgICBpZihuID09PSBvKXtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgYW5ndWxhci5mb3JFYWNoKG4sIGZ1bmN0aW9uKGl0ZW0sIGtleSl7XG4gICAgICAgICAgICBpZihpdGVtLmVudHJ5LmRhdGFbMF1bJHNjb3BlLmlzb10gJiYgIW9ba2V5XS5lbnRyeS5kYXRhWzBdWyRzY29wZS5pc29dKXtcbiAgICAgICAgICAgICAgaXRlbS5lbnRyeS5lcnJvcnMuc3BsaWNlKDAsMSk7XG4gICAgICAgICAgICAgICRzY29wZS4kcGFyZW50LnZtLmlzb19lcnJvcnMgLS07XG4gICAgICAgICAgICAgICRzY29wZS4kcGFyZW50LnZtLmVycm9ycyAtLTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfSwgdHJ1ZSk7XG5cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSggJ2FwcC5jb250cm9sbGVycycgKS5jb250cm9sbGVyKCAnQnViYmxlc0N0cmwnLCBmdW5jdGlvbigpe1xuXHRcdC8vXG5cbiAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRmdW5jdGlvbiBDdXN0b21Ub29sdGlwKHRvb2x0aXBJZCwgd2lkdGgpIHtcblx0XHR2YXIgdG9vbHRpcElkID0gdG9vbHRpcElkO1xuXHRcdHZhciBlbGVtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodG9vbHRpcElkKTtcblx0XHRpZihlbGVtID09IG51bGwpe1xuXHRcdFx0YW5ndWxhci5lbGVtZW50KGRvY3VtZW50KS5maW5kKCdib2R5JykuYXBwZW5kKFwiPGRpdiBjbGFzcz0ndG9vbHRpcCBtZC13aGl0ZWZyYW1lLXozJyBpZD0nXCIgKyB0b29sdGlwSWQgKyBcIic+PC9kaXY+XCIpO1xuXHRcdH1cblx0XHRoaWRlVG9vbHRpcCgpO1xuXHRcdGZ1bmN0aW9uIHNob3dUb29sdGlwKGNvbnRlbnQsIGRhdGEsIGV2ZW50LCBlbGVtZW50KSB7XG5cdFx0XHRhbmd1bGFyLmVsZW1lbnQoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignIycgKyB0b29sdGlwSWQpKS5odG1sKGNvbnRlbnQpO1xuXHRcdFx0YW5ndWxhci5lbGVtZW50KGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyMnICsgdG9vbHRpcElkKSkuY3NzKCdkaXNwbGF5JywgJ2Jsb2NrJyk7XG5cblx0XHRcdHJldHVybiB1cGRhdGVQb3NpdGlvbihldmVudCwgZGF0YSwgZWxlbWVudCk7XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIGhpZGVUb29sdGlwKCkge1xuXHRcdFx0YW5ndWxhci5lbGVtZW50KGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyMnICsgdG9vbHRpcElkKSkuY3NzKCdkaXNwbGF5JywgJ25vbmUnKTtcblx0XHR9XG5cdFx0ZnVuY3Rpb24gdXBkYXRlUG9zaXRpb24oZXZlbnQsIGQsIGVsZW1lbnQpIHtcblx0XHRcdHZhciB0dGlkID0gXCIjXCIgKyB0b29sdGlwSWQ7XG5cdFx0XHR2YXIgeE9mZnNldCA9IDIwO1xuXHRcdFx0dmFyIHlPZmZzZXQgPSAxMDtcblx0XHRcdHZhciBzdmcgPSBlbGVtZW50LmZpbmQoJ3N2ZycpWzBdOy8vZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3N2Z192aXMnKTtcblx0XHRcdHZhciB3c2NyWSA9IHdpbmRvdy5zY3JvbGxZO1xuXHRcdFx0dmFyIHR0dyA9IGFuZ3VsYXIuZWxlbWVudChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHR0aWQpKS5vZmZzZXRXaWR0aDtcblx0XHRcdHZhciB0dGggPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHR0aWQpLm9mZnNldEhlaWdodDtcblx0XHRcdHZhciB0dHRvcCA9IHN2Zy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3AgKyBkLnkgLSB0dGggLyAyO1xuXHRcdFx0dmFyIHR0bGVmdCA9IHN2Zy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5sZWZ0ICsgZC54ICsgZC5yYWRpdXMgKyAxMjtcblx0XHRcdHJldHVybiBhbmd1bGFyLmVsZW1lbnQoZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0dGlkKSkuY3NzKCd0b3AnLCB0dHRvcCArICdweCcpLmNzcygnbGVmdCcsIHR0bGVmdCArICdweCcpO1xuXHRcdH1cblx0XHRyZXR1cm4ge1xuXHRcdFx0c2hvd1Rvb2x0aXA6IHNob3dUb29sdGlwLFxuXHRcdFx0aGlkZVRvb2x0aXA6IGhpZGVUb29sdGlwLFxuXHRcdFx0dXBkYXRlUG9zaXRpb246IHVwZGF0ZVBvc2l0aW9uXG5cdFx0fVxuXHR9XG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZGlyZWN0aXZlcycpLmRpcmVjdGl2ZSgnYnViYmxlcycsIGZ1bmN0aW9uICgkY29tcGlsZSwgSWNvbnNTZXJ2aWNlKSB7XG5cdFx0dmFyIGRlZmF1bHRzO1xuXHRcdGRlZmF1bHRzID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0d2lkdGg6IDMwMCxcblx0XHRcdFx0aGVpZ2h0OiAzMDAsXG5cdFx0XHRcdGxheW91dF9ncmF2aXR5OiAwLFxuXHRcdFx0XHRzaXplZmFjdG9yOjMsXG5cdFx0XHRcdHZpczogbnVsbCxcblx0XHRcdFx0Zm9yY2U6IG51bGwsXG5cdFx0XHRcdGRhbXBlcjogMC4wODUsXG5cdFx0XHRcdGNpcmNsZXM6IG51bGwsXG5cdFx0XHRcdGJvcmRlcnM6IHRydWUsXG5cdFx0XHRcdGxhYmVsczogdHJ1ZSxcblx0XHRcdFx0ZmlsbF9jb2xvcjogZDMuc2NhbGUub3JkaW5hbCgpLmRvbWFpbihbXCJlaFwiLCBcImV2XCJdKS5yYW5nZShbXCIjYTMxMDMxXCIsIFwiI2JlY2NhZVwiXSksXG5cdFx0XHRcdG1heF9hbW91bnQ6ICcnLFxuXHRcdFx0XHRyYWRpdXNfc2NhbGU6ICcnLFxuXHRcdFx0XHRkdXJhdGlvbjogMTAwMCxcblx0XHRcdFx0dG9vbHRpcDogQ3VzdG9tVG9vbHRpcChcImJ1YmJsZXNfdG9vbHRpcFwiLCAyNDApXG5cdFx0XHR9O1xuXHRcdH07XG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlc3RyaWN0OiAnRScsXG5cdFx0XHRzY29wZToge1xuXHRcdFx0XHRjaGFydGRhdGE6ICc9Jyxcblx0XHRcdFx0ZGlyZWN0aW9uOiAnPScsXG5cdFx0XHRcdGdyYXZpdHk6ICc9Jyxcblx0XHRcdFx0c2l6ZWZhY3RvcjogJz0nLFxuXHRcdFx0XHRpbmRleGVyOiAnPScsXG5cdFx0XHRcdGJvcmRlcnM6ICdAJ1xuXHRcdFx0fSxcblx0XHRcdHJlcXVpcmU6ICduZ01vZGVsJyxcblx0XHRcdGxpbms6IGZ1bmN0aW9uIChzY29wZSwgZWxlbSwgYXR0cnMsIG5nTW9kZWwpIHtcblx0XHRcdFx0dmFyIG9wdGlvbnMgPSBhbmd1bGFyLmV4dGVuZChkZWZhdWx0cygpLCBhdHRycyk7XG5cdFx0XHRcdHZhciBub2RlcyA9IFtdLFxuXHRcdFx0XHRcdGxpbmtzID0gW10sXG5cdFx0XHRcdFx0bGFiZWxzID0gW10sXG5cdFx0XHRcdFx0Z3JvdXBzID0gW107XG5cblx0XHRcdFx0dmFyIG1heF9hbW91bnQgPSBkMy5tYXgoc2NvcGUuY2hhcnRkYXRhLCBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdHJldHVybiBwYXJzZUludChkLnZhbHVlKTtcblx0XHRcdFx0fSk7XG5cdFx0XHRcdC8vb3B0aW9ucy5oZWlnaHQgPSBvcHRpb25zLndpZHRoICogMS4xO1xuXHRcdFx0XHRvcHRpb25zLnJhZGl1c19zY2FsZSA9IGQzLnNjYWxlLnBvdygpLmV4cG9uZW50KDAuNSkuZG9tYWluKFswLCBtYXhfYW1vdW50XSkucmFuZ2UoWzIsIDg1XSk7XG5cdFx0XHRcdG9wdGlvbnMuY2VudGVyID0ge1xuXHRcdFx0XHRcdHg6IG9wdGlvbnMud2lkdGggLyAyLFxuXHRcdFx0XHRcdHk6IG9wdGlvbnMuaGVpZ2h0IC8gMlxuXHRcdFx0XHR9O1xuXHRcdFx0XHRvcHRpb25zLmNhdF9jZW50ZXJzID0ge1xuXHRcdFx0XHRcdFwiZWhcIjoge1xuXHRcdFx0XHRcdFx0eDogb3B0aW9ucy53aWR0aCAvIDIsXG5cdFx0XHRcdFx0XHR5OiBvcHRpb25zLmhlaWdodCAgKiAwLjQ1LFxuXHRcdFx0XHRcdFx0ZGFtcGVyOiAwLjA4NVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XCJldlwiOiB7XG5cdFx0XHRcdFx0XHR4OiBvcHRpb25zLndpZHRoIC8gMixcblx0XHRcdFx0XHRcdHk6IG9wdGlvbnMuaGVpZ2h0ICAqIDAuNTUsXG5cdFx0XHRcdFx0XHRkYW1wZXI6IDAuMDg1XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9O1xuXG5cdFx0XHRcdHZhciBjcmVhdGVfbm9kZXMgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0aWYoc2NvcGUuaW5kZXhlci5jaGlsZHJlbi5sZW5ndGggPT0gMiAmJiBzY29wZS5pbmRleGVyLmNoaWxkcmVuWzBdLmNoaWxkcmVuLmxlbmd0aCA+IDApe1xuXHRcdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKHNjb3BlLmluZGV4ZXIuY2hpbGRyZW4sIGZ1bmN0aW9uIChncm91cCkge1xuXHRcdFx0XHRcdFx0XHR2YXIgZCA9IHtcblx0XHRcdFx0XHRcdFx0XHR0eXBlOiBncm91cC5jb2x1bW5fbmFtZSxcblx0XHRcdFx0XHRcdFx0XHRuYW1lOiBncm91cC50aXRsZSxcblx0XHRcdFx0XHRcdFx0XHRncm91cDogZ3JvdXAuY29sdW1uX25hbWUuc3Vic3RyaW5nKDAsMiksXG5cdFx0XHRcdFx0XHRcdFx0Y29sb3I6IGdyb3VwLmNvbG9yLFxuXHRcdFx0XHRcdFx0XHRcdGljb246IGdyb3VwLmljb24sXG5cdFx0XHRcdFx0XHRcdFx0dW5pY29kZTogSWNvbnNTZXJ2aWNlLmdldFVuaWNvZGUoZ3JvdXAuaWNvbiksXG5cdFx0XHRcdFx0XHRcdFx0ZGF0YTogZ3JvdXAsXG5cdFx0XHRcdFx0XHRcdFx0Y2hpbGRyZW46Z3JvdXAuY2hpbGRyZW5cblx0XHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdFx0bGFiZWxzLnB1c2goZCk7XG5cblx0XHRcdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKGdyb3VwLmNoaWxkcmVuLCBmdW5jdGlvbiAoaXRlbSkge1xuXHRcdFx0XHRcdFx0XHRcdC8vY29uc29sZS5sb2coc2NvcGUuY2hhcnRkYXRhW2l0ZW0uY29sdW1uX25hbWVdLCBzY29wZS5jaGFydGRhdGFbaXRlbS5jb2x1bW5fbmFtZV0gLyBzY29wZS5zaXplZmFjdG9yKTtcblx0XHRcdFx0XHRcdFx0XHRpZiAoc2NvcGUuY2hhcnRkYXRhW2l0ZW0uY29sdW1uX25hbWVdKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHR2YXIgbm9kZSA9IHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0dHlwZTogaXRlbS5jb2x1bW5fbmFtZSxcblx0XHRcdFx0XHRcdFx0XHRcdFx0cmFkaXVzOiBzY29wZS5jaGFydGRhdGFbaXRlbS5jb2x1bW5fbmFtZV0gLyBzY29wZS5zaXplZmFjdG9yLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHR2YWx1ZTogc2NvcGUuY2hhcnRkYXRhW2l0ZW0uY29sdW1uX25hbWVdIC8gc2NvcGUuc2l6ZWZhY3Rvcixcblx0XHRcdFx0XHRcdFx0XHRcdFx0bmFtZTogaXRlbS50aXRsZSxcblx0XHRcdFx0XHRcdFx0XHRcdFx0Z3JvdXA6IGl0ZW0uY29sdW1uX25hbWUuc3Vic3RyaW5nKDAsMiksXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHg6IG9wdGlvbnMuY2VudGVyLngsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHk6IG9wdGlvbnMuY2VudGVyLnksXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGNvbG9yOiBpdGVtLmNvbG9yLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpY29uOiBpdGVtLmljb24sXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHVuaWNvZGU6IEljb25zU2VydmljZS5nZXRVbmljb2RlKGl0ZW0uaWNvbiksXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGRhdGE6IGl0ZW0sXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGNoaWxkcmVuOml0ZW1cblx0XHRcdFx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0XHRcdFx0XHRub2Rlcy5wdXNoKG5vZGUpO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdGNyZWF0ZV9ncm91cHMoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZWxzZXtcblx0XHRcdFx0XHRcdHZhciBkID0ge1xuXHRcdFx0XHRcdFx0XHR0eXBlOiBzY29wZS5pbmRleGVyLmNvbHVtbl9uYW1lLFxuXHRcdFx0XHRcdFx0XHRuYW1lOiBzY29wZS5pbmRleGVyLnRpdGxlLFxuXHRcdFx0XHRcdFx0XHRncm91cDogc2NvcGUuaW5kZXhlci5jb2x1bW5fbmFtZS5zdWJzdHJpbmcoMCwyKSxcblx0XHRcdFx0XHRcdFx0Y29sb3I6IHNjb3BlLmluZGV4ZXIuY29sb3IsXG5cdFx0XHRcdFx0XHRcdGljb246IHNjb3BlLmluZGV4ZXIuaWNvbixcblx0XHRcdFx0XHRcdFx0dW5pY29kZTogc2NvcGUuaW5kZXhlci51bmljb2RlLFxuXHRcdFx0XHRcdFx0XHRkYXRhOiBzY29wZS5pbmRleGVyLmRhdGEsXG5cdFx0XHRcdFx0XHRcdGNoaWxkcmVuOiBzY29wZS5pbmRleGVyLmNoaWxkcmVuXG5cdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdFx0bGFiZWxzLnB1c2goZCk7XG5cdFx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2goc2NvcGUuaW5kZXhlci5jaGlsZHJlbiwgZnVuY3Rpb24gKGl0ZW0pIHtcblx0XHRcdFx0XHRcdFx0Ly9jb25zb2xlLmxvZyhzY29wZS5jaGFydGRhdGFbaXRlbS5jb2x1bW5fbmFtZV0sIHNjb3BlLmNoYXJ0ZGF0YVtpdGVtLmNvbHVtbl9uYW1lXSAvIHNjb3BlLnNpemVmYWN0b3IpO1xuXHRcdFx0XHRcdFx0XHRpZiAoc2NvcGUuY2hhcnRkYXRhW2l0ZW0uY29sdW1uX25hbWVdKSB7XG5cdFx0XHRcdFx0XHRcdFx0dmFyIG5vZGUgPSB7XG5cdFx0XHRcdFx0XHRcdFx0XHR0eXBlOiBpdGVtLmNvbHVtbl9uYW1lLFxuXHRcdFx0XHRcdFx0XHRcdFx0cmFkaXVzOiBzY29wZS5jaGFydGRhdGFbaXRlbS5jb2x1bW5fbmFtZV0gLyBzY29wZS5zaXplZmFjdG9yLFxuXHRcdFx0XHRcdFx0XHRcdFx0dmFsdWU6IHNjb3BlLmNoYXJ0ZGF0YVtpdGVtLmNvbHVtbl9uYW1lXSAvIHNjb3BlLnNpemVmYWN0b3IsXG5cdFx0XHRcdFx0XHRcdFx0XHRuYW1lOiBpdGVtLnRpdGxlLFxuXHRcdFx0XHRcdFx0XHRcdFx0Z3JvdXA6IGl0ZW0uY29sdW1uX25hbWUuc3Vic3RyaW5nKDAsMiksXG5cdFx0XHRcdFx0XHRcdFx0XHR4OiBvcHRpb25zLmNlbnRlci54LFxuXHRcdFx0XHRcdFx0XHRcdFx0eTogb3B0aW9ucy5jZW50ZXIueSxcblx0XHRcdFx0XHRcdFx0XHRcdGNvbG9yOiBpdGVtLmNvbG9yLFxuXHRcdFx0XHRcdFx0XHRcdFx0aWNvbjogaXRlbS5pY29uLFxuXHRcdFx0XHRcdFx0XHRcdFx0dW5pY29kZTogSWNvbnNTZXJ2aWNlLmdldFVuaWNvZGUoaXRlbS5pY29uKSxcblx0XHRcdFx0XHRcdFx0XHRcdGRhdGE6IGl0ZW0sXG5cdFx0XHRcdFx0XHRcdFx0XHRjaGlsZHJlbjppdGVtXG5cdFx0XHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdFx0XHRub2Rlcy5wdXNoKG5vZGUpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH07XG5cdFx0XHRcdHZhciBjbGVhcl9ub2RlcyA9IGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0Ly9kMy5zZWxlY3RBbGwoXCJzdmcgPiAqXCIpLnJlbW92ZSgpO1xuXHRcdFx0XHRcdG5vZGVzID0gW107XG5cdFx0XHRcdFx0bGFiZWxzID0gW107XG5cdFx0XHRcdH1cblx0XHRcdFx0dmFyIGNyZWF0ZV9ncm91cHMgPSBmdW5jdGlvbigpe1xuXHRcdFx0XHRcdGdyb3VwcyA9IHt9O1xuXHRcdFx0XHRcdHZhciBjb3VudCA9IDA7XG5cdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKG5vZGVzLCBmdW5jdGlvbihub2RlKXtcblx0XHRcdFx0XHRcdFx0dmFyIGV4aXN0cyA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0XHR2YXIgZ3JvdXAgPSB7fTtcblx0XHRcdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKGdyb3VwcywgZnVuY3Rpb24oZ3JvdXAsIGluZGV4KXtcblx0XHRcdFx0XHRcdFx0XHRpZihub2RlLmdyb3VwID09IGluZGV4KXtcblx0XHRcdFx0XHRcdFx0XHRcdGV4aXN0cyA9IHRydWU7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdFx0aWYoIWV4aXN0cyl7XG5cdFx0XHRcdFx0XHRcdFx0Y291bnQrKztcblx0XHRcdFx0XHRcdFx0XHRncm91cHNbbm9kZS5ncm91cF0gPSB7XG5cdFx0XHRcdFx0XHRcdFx0XHR4OiBvcHRpb25zLndpZHRoIC8gMixcblx0XHRcdFx0XHRcdFx0XHRcdHk6IG9wdGlvbnMuaGVpZ2h0IC8gMiArICgxIC0gY291bnQpLFxuXHRcdFx0XHRcdFx0XHRcdFx0ZGFtcGVyOiAwLjA4NSxcblx0XHRcdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0fTtcblx0XHRcdFx0dmFyIGNyZWF0ZV92aXMgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0YW5ndWxhci5lbGVtZW50KGVsZW0pLmh0bWwoJycpO1xuXHRcdFx0XHRcdG9wdGlvbnMudmlzID0gZDMuc2VsZWN0KGVsZW1bMF0pLmFwcGVuZChcInN2Z1wiKS5hdHRyKFwid2lkdGhcIiwgb3B0aW9ucy53aWR0aCkuYXR0cihcImhlaWdodFwiLCBvcHRpb25zLmhlaWdodCkuYXR0cihcImlkXCIsIFwic3ZnX3Zpc1wiKTtcblxuXHRcdFx0XHRcdGlmICghb3B0aW9ucy5ib3JkZXJzKSB7XG5cdFx0XHRcdFx0XHR2YXIgcGkgPSBNYXRoLlBJO1xuXHRcdFx0XHRcdFx0aWYobGFiZWxzLmxlbmd0aCA9PSAyKXtcblx0XHRcdFx0XHRcdFx0dmFyIGFyY1RvcCA9IGQzLnN2Zy5hcmMoKVxuXHRcdFx0XHRcdFx0XHRcdC5pbm5lclJhZGl1cygxMDkpXG5cdFx0XHRcdFx0XHRcdFx0Lm91dGVyUmFkaXVzKDExMClcblx0XHRcdFx0XHRcdFx0XHQuc3RhcnRBbmdsZSgtOTAgKiAocGkgLyAxODApKSAvL2NvbnZlcnRpbmcgZnJvbSBkZWdzIHRvIHJhZGlhbnNcblx0XHRcdFx0XHRcdFx0XHQuZW5kQW5nbGUoOTAgKiAocGkgLyAxODApKTsgLy9qdXN0IHJhZGlhbnNcblx0XHRcdFx0XHRcdFx0dmFyIGFyY0JvdHRvbSA9IGQzLnN2Zy5hcmMoKVxuXHRcdFx0XHRcdFx0XHRcdC5pbm5lclJhZGl1cygxMzQpXG5cdFx0XHRcdFx0XHRcdFx0Lm91dGVyUmFkaXVzKDEzNSlcblx0XHRcdFx0XHRcdFx0XHQuc3RhcnRBbmdsZSg5MCAqIChwaSAvIDE4MCkpIC8vY29udmVydGluZyBmcm9tIGRlZ3MgdG8gcmFkaWFuc1xuXHRcdFx0XHRcdFx0XHRcdC5lbmRBbmdsZSgyNzAgKiAocGkgLyAxODApKTsgLy9qdXN0IHJhZGlhbnNcblxuXHRcdFx0XHRcdFx0XHRvcHRpb25zLmFyY1RvcCA9IG9wdGlvbnMudmlzLmFwcGVuZChcInBhdGhcIilcblx0XHRcdFx0XHRcdFx0XHQuYXR0cihcImRcIiwgYXJjVG9wKVxuXHRcdFx0XHRcdFx0XHRcdC5hdHRyKFwiZmlsbFwiLCBcIiNiZTVmMDBcIilcblx0XHRcdFx0XHRcdFx0XHQuYXR0cihcImlkXCIsIFwiYXJjVG9wXCIpXG5cdFx0XHRcdFx0XHRcdFx0LmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIrKG9wdGlvbnMud2lkdGgvMikrXCIsXCIrKG9wdGlvbnMuaGVpZ2h0LzIgLSBvcHRpb25zLmhlaWdodC8xMikrXCIpXCIpO1xuXHRcdFx0XHRcdFx0XHRvcHRpb25zLmFyY0JvdHRvbSA9IG9wdGlvbnMudmlzLmFwcGVuZChcInBhdGhcIilcblx0XHRcdFx0XHRcdFx0XHQuYXR0cihcImRcIiwgYXJjQm90dG9tKVxuXHRcdFx0XHRcdFx0XHRcdC5hdHRyKFwiaWRcIiwgXCJhcmNCb3R0b21cIilcblx0XHRcdFx0XHRcdFx0XHQuYXR0cihcImZpbGxcIiwgXCIjMDA2YmI2XCIpXG5cdFx0XHRcdFx0XHRcdFx0LmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIrKG9wdGlvbnMud2lkdGgvMikrXCIsXCIrKG9wdGlvbnMuaGVpZ2h0LzIpK1wiKVwiKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGVsc2V7XG5cdFx0XHRcdFx0XHRcdHZhciBhcmMgPSBkMy5zdmcuYXJjKClcblx0XHRcdFx0XHRcdFx0XHQuaW5uZXJSYWRpdXMob3B0aW9ucy53aWR0aC8zIC0gMSlcblx0XHRcdFx0XHRcdFx0XHQub3V0ZXJSYWRpdXMob3B0aW9ucy53aWR0aC8zKVxuXHRcdFx0XHRcdFx0XHRcdC5zdGFydEFuZ2xlKDAgKiAocGkgLyAxODApKSAvL2NvbnZlcnRpbmcgZnJvbSBkZWdzIHRvIHJhZGlhbnNcblx0XHRcdFx0XHRcdFx0XHQuZW5kQW5nbGUoMzYwICogKHBpIC8gMTgwKSk7IC8vanVzdCByYWRpYW5zXG5cblxuXHRcdFx0XHRcdFx0XHRvcHRpb25zLmFyYyA9IG9wdGlvbnMudmlzLmFwcGVuZChcInBhdGhcIilcblx0XHRcdFx0XHRcdFx0XHQuYXR0cihcImRcIiwgYXJjKVxuXHRcdFx0XHRcdFx0XHRcdC5hdHRyKFwiZmlsbFwiLCBsYWJlbHNbMF0uY29sb3IpXG5cdFx0XHRcdFx0XHRcdFx0LmF0dHIoXCJpZFwiLCBcImFyY1RvcFwiKVxuXHRcdFx0XHRcdFx0XHRcdC5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiKyhvcHRpb25zLndpZHRoLzIpK1wiLFwiKyhvcHRpb25zLmhlaWdodC8yKStcIilcIik7XG5cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdGlmKG9wdGlvbnMubGFiZWxzID09IHRydWUgJiYgbGFiZWxzLmxlbmd0aCA9PSAyKXtcblx0XHRcdFx0XHRcdHZhciB0ZXh0TGFiZWxzID0gb3B0aW9ucy52aXMuc2VsZWN0QWxsKCd0ZXh0LmxhYmVscycpLmRhdGEobGFiZWxzKS5lbnRlcigpLmFwcGVuZChcInRleHRcIilcblx0XHRcdFx0XHRcdFx0LmF0dHIoJ2NsYXNzJywgJ2xhYmVscycpXG5cdFx0XHRcdFx0XHRcdC5hdHRyKCdmaWxsJywgZnVuY3Rpb24oZCl7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIGQuY29sb3I7XG5cdFx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0XHQvKlx0LmF0dHIoJ3RyYW5zZm9ybScsIGZ1bmN0aW9uKGQpe1xuXHRcdFx0XHRcdFx0XHRcdHZhciBpbmRleCA9IGxhYmVscy5pbmRleE9mKGQpO1xuXHRcdFx0XHRcdFx0XHRcdGlmKGluZGV4ID4gMCl7XG5cdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gJ3JvdGF0ZSg5MCwgMTAwLCAxMDApJztcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH0pKi9cblx0XHRcdFx0XHRcdFx0LmF0dHIoJ3gnLCBcIjUwJVwiKVxuXHRcdFx0XHRcdFx0XHQuc3R5bGUoJ2ZvbnQtc2l6ZScsICcxLjJlbScpXG5cdFx0XHRcdFx0XHRcdC5zdHlsZSgnY3Vyc29yJywgJ3BvaW50ZXInKVxuXG5cdFx0XHRcdFx0XHRcdC5hdHRyKCd3aWR0aCcsIG9wdGlvbnMud2lkdGgpXG5cdFx0XHRcdFx0XHRcdC5hdHRyKCd0ZXh0LWFuY2hvcicsICdtaWRkbGUnKVxuXHRcdFx0XHRcdFx0XHQub24oJ2NsaWNrJywgZnVuY3Rpb24oZCl7XG5cdFx0XHRcdFx0XHRcdFx0bmdNb2RlbC4kc2V0Vmlld1ZhbHVlKGQuZGF0YSk7XG5cdFx0XHRcdFx0XHRcdFx0bmdNb2RlbC4kcmVuZGVyKCk7XG5cdFx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0XHRcdC5hdHRyKFwieVwiLCBmdW5jdGlvbihkKXtcblx0XHRcdFx0XHRcdFx0XHR2YXIgaW5kZXggPSBsYWJlbHMuaW5kZXhPZihkKTtcblx0XHRcdFx0XHRcdFx0XHRpZihpbmRleCA9PSAwKXtcblx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiAxNTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0ZWxzZXtcblx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiBvcHRpb25zLmhlaWdodCAtIDY7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0XHQudGV4dChmdW5jdGlvbihkKXtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gZC5uYW1lO1xuXHRcdFx0XHRcdFx0XHR9KVxuXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdG9wdGlvbnMuY29udGFpbmVycyA9IG9wdGlvbnMudmlzLnNlbGVjdEFsbCgnZy5ub2RlJykuZGF0YShub2RlcykuZW50ZXIoKS5hcHBlbmQoJ2cnKS5hdHRyKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKCcgKyAob3B0aW9ucy53aWR0aCAvIDIpICsgJywnICsgKG9wdGlvbnMuaGVpZ2h0IC8gMikgKyAnKScpLmF0dHIoJ2NsYXNzJywgJ25vZGUnKTtcblxuXHRcdFx0XHRcdC8qb3B0aW9ucy5jaXJjbGVzID0gb3B0aW9ucy5jb250YWluZXJzLnNlbGVjdEFsbChcImNpcmNsZVwiKS5kYXRhKG5vZGVzLCBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGQuaWQ7XG5cdFx0XHRcdFx0fSk7Ki9cblxuXHRcdFx0XHRcdG9wdGlvbnMuY2lyY2xlcyA9IG9wdGlvbnMuY29udGFpbmVycy5hcHBlbmQoXCJjaXJjbGVcIikuYXR0cihcInJcIiwgMCkuYXR0cihcImZpbGxcIiwgKGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZC5jb2xvciB8fCBvcHRpb25zLmZpbGxfY29sb3IoZC5ncm91cCk7XG5cdFx0XHRcdFx0fSkpLmF0dHIoXCJzdHJva2Utd2lkdGhcIiwgMCkuYXR0cihcInN0cm9rZVwiLCBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGQzLnJnYihvcHRpb25zLmZpbGxfY29sb3IoZC5ncm91cCkpLmRhcmtlcigpO1xuXHRcdFx0XHRcdH0pLmF0dHIoXCJpZFwiLCBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIFwiYnViYmxlX1wiICsgZC5pZDtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRvcHRpb25zLmljb25zID0gb3B0aW9ucy5jb250YWluZXJzLmFwcGVuZChcInRleHRcIilcblx0XHRcdFx0XHRcdC5hdHRyKCdmb250LWZhbWlseScsICdFUEknKVxuXHRcdFx0XHRcdFx0LmF0dHIoJ2ZvbnQtc2l6ZScsIGZ1bmN0aW9uIChkKSB7XG5cblx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0XHQuYXR0cihcInRleHQtYW5jaG9yXCIsIFwibWlkZGxlXCIpXG5cdFx0XHRcdFx0XHQuYXR0cignZmlsbCcsIGZ1bmN0aW9uKGQpe1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gZC51bmljb2RlID8gJyNmZmYnIDogZC5jb2xvcjtcblx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0XHQudGV4dChmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gZC51bmljb2RlIHx8ICcxJ1xuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0b3B0aW9ucy5pY29ucy5vbihcIm1vdXNlb3ZlclwiLCBmdW5jdGlvbiAoZCwgaSkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIHNob3dfZGV0YWlscyhkLCBpLCB0aGlzKTtcblx0XHRcdFx0XHR9KS5vbihcIm1vdXNlb3V0XCIsIGZ1bmN0aW9uIChkLCBpKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gaGlkZV9kZXRhaWxzKGQsIGksIHRoaXMpO1xuXHRcdFx0XHRcdH0pLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24gKGQsIGkpIHtcblxuXHRcdFx0XHRcdFx0bmdNb2RlbC4kc2V0Vmlld1ZhbHVlKGQuZGF0YSk7XG5cdFx0XHRcdFx0XHRuZ01vZGVsLiRyZW5kZXIoKTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRvcHRpb25zLmNpcmNsZXMudHJhbnNpdGlvbigpLmR1cmF0aW9uKG9wdGlvbnMuZHVyYXRpb24pLmF0dHIoXCJyXCIsIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZC5yYWRpdXM7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0b3B0aW9ucy5pY29ucy50cmFuc2l0aW9uKCkuZHVyYXRpb24ob3B0aW9ucy5kdXJhdGlvbikuYXR0cihcImZvbnQtc2l6ZVwiLCBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGQucmFkaXVzICogMS43NSArICdweCc7XG5cdFx0XHRcdFx0fSkuYXR0cigneScsIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZC5yYWRpdXMgKiAuNzUgKyAncHgnO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9O1xuXHRcdFx0XHR2YXIgdXBkYXRlX3ZpcyA9IGZ1bmN0aW9uICgpIHtcblxuXHRcdFx0XHRcdG5vZGVzLmZvckVhY2goZnVuY3Rpb24gKGQsIGkpIHtcblx0XHRcdFx0XHRcdG9wdGlvbnMuY2lyY2xlcy50cmFuc2l0aW9uKCkuZHVyYXRpb24ob3B0aW9ucy5kdXJhdGlvbikuZGVsYXkoaSAqIG9wdGlvbnMuZHVyYXRpb24pXG5cdFx0XHRcdFx0XHRcdC5hdHRyKFwiclwiLCBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0XHRcdGQucmFkaXVzID0gZC52YWx1ZSA9IHNjb3BlLmNoYXJ0ZGF0YVtkLnR5cGVdIC8gc2NvcGUuc2l6ZWZhY3RvcjtcblxuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBzY29wZS5jaGFydGRhdGFbZC50eXBlXSAvIHNjb3BlLnNpemVmYWN0b3I7XG5cdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0b3B0aW9ucy5pY29ucy50cmFuc2l0aW9uKCkuZHVyYXRpb24ob3B0aW9ucy5kdXJhdGlvbikuZGVsYXkoaSAqIG9wdGlvbnMuZHVyYXRpb24pXG5cdFx0XHRcdFx0XHRcdC5hdHRyKFwiZm9udC1zaXplXCIsIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIChzY29wZS5jaGFydGRhdGFbZC50eXBlXSAvIHNjb3BlLnNpemVmYWN0b3IpICogMS43NSArICdweCdcblx0XHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRcdFx0LmF0dHIoJ3knLCBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybiAoc2NvcGUuY2hhcnRkYXRhW2QudHlwZV0gLyBzY29wZS5zaXplZmFjdG9yKSAqIC43NSArICdweCc7XG5cdFx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH07XG5cdFx0XHRcdHZhciBjaGFyZ2UgPSBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdHJldHVybiAtTWF0aC5wb3coZC5yYWRpdXMsIDIuMCkgLyA0O1xuXHRcdFx0XHR9O1xuXHRcdFx0XHR2YXIgc3RhcnQgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0cmV0dXJuIG9wdGlvbnMuZm9yY2UgPSBkMy5sYXlvdXQuZm9yY2UoKS5ub2Rlcyhub2Rlcykuc2l6ZShbb3B0aW9ucy53aWR0aCwgb3B0aW9ucy5oZWlnaHRdKS5saW5rcyhsaW5rcyk7XG5cdFx0XHRcdH07XG5cdFx0XHRcdHZhciBkaXNwbGF5X2dyb3VwX2FsbCA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRvcHRpb25zLmZvcmNlLmdyYXZpdHkob3B0aW9ucy5sYXlvdXRfZ3Jhdml0eSkuY2hhcmdlKGNoYXJnZSkuZnJpY3Rpb24oMC44NSkub24oXCJ0aWNrXCIsIGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdFx0XHRvcHRpb25zLmNvbnRhaW5lcnMuZWFjaChtb3ZlX3Rvd2FyZHNfY2VudGVyKGUuYWxwaGEpKS5hdHRyKFwidHJhbnNmb3JtXCIsIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiAndHJhbnNsYXRlKCcgKyBkLnggKyAnLCcgKyBkLnkgKyAnKSc7XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRvcHRpb25zLmZvcmNlLnN0YXJ0KCk7XG5cdFx0XHRcdH07XG5cdFx0XHRcdHZhciBkaXNwbGF5X2J5X2NhdCA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRvcHRpb25zLmZvcmNlLmdyYXZpdHkob3B0aW9ucy5sYXlvdXRfZ3Jhdml0eSkuY2hhcmdlKGNoYXJnZSkuZnJpY3Rpb24oMC45KS5vbihcInRpY2tcIiwgZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0XHRcdG9wdGlvbnMuY29udGFpbmVycy5lYWNoKG1vdmVfdG93YXJkc19jYXQoZS5hbHBoYSkpLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuICd0cmFuc2xhdGUoJyArIGQueCArICcsJyArIGQueSArICcpJztcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdG9wdGlvbnMuZm9yY2Uuc3RhcnQoKTtcblx0XHRcdFx0fTtcblx0XHRcdFx0dmFyIG1vdmVfdG93YXJkc19jZW50ZXIgPSBmdW5jdGlvbiAoYWxwaGEpIHtcblx0XHRcdFx0XHRyZXR1cm4gKGZ1bmN0aW9uIChfdGhpcykge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRcdGQueCA9IGQueCArIChvcHRpb25zLndpZHRoLzIgLSBkLngpICogKG9wdGlvbnMuZGFtcGVyICsgMC4wMikgKiBhbHBoYSAqMS4yNTtcblx0XHRcdFx0XHRcdFx0ZC55ID0gZC55ICsgKG9wdGlvbnMuaGVpZ2h0LzIgLSBkLnkpICogKG9wdGlvbnMuZGFtcGVyICsgMC4wMikgKiBhbHBoYSAqIDEuMjU7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSkodGhpcyk7XG5cdFx0XHRcdH07XG5cdFx0XHRcdHZhciBtb3ZlX3Rvd2FyZHNfdG9wID0gZnVuY3Rpb24gKGFscGhhKSB7XG5cdFx0XHRcdFx0cmV0dXJuIChmdW5jdGlvbiAoX3RoaXMpIHtcblx0XHRcdFx0XHRcdHJldHVybiBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0XHRkLnggPSBkLnggKyAob3B0aW9ucy5jZW50ZXIueCAtIGQueCkgKiAob3B0aW9ucy5kYW1wZXIgKyAwLjAyKSAqIGFscGhhICogMS4xO1xuXHRcdFx0XHRcdFx0XHRkLnkgPSBkLnkgKyAoMjAwIC0gZC55KSAqIChvcHRpb25zLmRhbXBlciArIDAuMDIpICogYWxwaGEgKiAxLjE7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSkodGhpcyk7XG5cdFx0XHRcdH07XG5cdFx0XHRcdHZhciBtb3ZlX3Rvd2FyZHNfY2F0ID0gZnVuY3Rpb24gKGFscGhhKSB7XG5cdFx0XHRcdFx0cmV0dXJuIChmdW5jdGlvbiAoX3RoaXMpIHtcblx0XHRcdFx0XHRcdHJldHVybiBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0XHR2YXIgdGFyZ2V0O1xuXHRcdFx0XHRcdFx0XHR0YXJnZXQgPSBvcHRpb25zLmNhdF9jZW50ZXJzW2QuZ3JvdXBdO1xuXHRcdFx0XHRcdFx0XHRkLnggPSBkLnggKyAodGFyZ2V0LnggLSBkLngpICogKHRhcmdldC5kYW1wZXIgKyAwLjAyKSAqIGFscGhhICogMTtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGQueSA9IGQueSArICh0YXJnZXQueSAtIGQueSkgKiAodGFyZ2V0LmRhbXBlciArIDAuMDIpICogYWxwaGEgKiAxO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pKHRoaXMpO1xuXHRcdFx0XHR9O1xuXHRcdFx0XHR2YXIgc2hvd19kZXRhaWxzID0gZnVuY3Rpb24gKGRhdGEsIGksIGVsZW1lbnQpIHtcblx0XHRcdFx0XHR2YXIgY29udGVudDtcblx0XHRcdFx0XHRjb250ZW50ID0gXCI8c3BhbiBjbGFzcz1cXFwidGl0bGVcXFwiPlwiICsgZGF0YS5uYW1lICsgXCI8L3NwYW4+PGJyLz5cIjtcblx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2goZGF0YS5kYXRhLmNoaWxkcmVuLCBmdW5jdGlvbiAoaW5mbykge1xuXHRcdFx0XHRcdFx0Y29udGVudCArPSBcIjxzcGFuIGNsYXNzPVxcXCJuYW1lXFxcIiBzdHlsZT1cXFwiY29sb3I6XCIgKyAoaW5mby5jb2xvciB8fCBkYXRhLmNvbG9yKSArIFwiXFxcIj4gXCIgKyAoaW5mby50aXRsZSkgKyBcIjwvc3Bhbj48YnIvPlwiO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdCRjb21waWxlKG9wdGlvbnMudG9vbHRpcC5zaG93VG9vbHRpcChjb250ZW50LCBkYXRhLCBkMy5ldmVudCwgZWxlbSkuY29udGVudHMoKSkoc2NvcGUpO1xuXHRcdFx0XHR9O1xuXG5cdFx0XHRcdHZhciBoaWRlX2RldGFpbHMgPSBmdW5jdGlvbiAoZGF0YSwgaSwgZWxlbWVudCkge1xuXHRcdFx0XHRcdHJldHVybiBvcHRpb25zLnRvb2x0aXAuaGlkZVRvb2x0aXAoKTtcblx0XHRcdFx0fTtcblxuXHRcdFx0XHRzY29wZS4kd2F0Y2goJ2NoYXJ0ZGF0YScsIGZ1bmN0aW9uIChkYXRhLCBvbGREYXRhKSB7XG5cdFx0XHRcdFx0b3B0aW9ucy50b29sdGlwLmhpZGVUb29sdGlwKCk7XG5cblx0XHRcdFx0XHRpZiAob3B0aW9ucy5jaXJjbGVzID09IG51bGwpIHtcblx0XHRcdFx0XHRcdGNyZWF0ZV9ub2RlcygpO1xuXHRcdFx0XHRcdFx0Y3JlYXRlX3ZpcygpO1xuXHRcdFx0XHRcdFx0c3RhcnQoKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0dXBkYXRlX3ZpcygpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZihsYWJlbHMubGVuZ3RoID09IDEgfHwgb3B0aW9ucy5sYWJlbHMgIT0gdHJ1ZSl7XG5cdFx0XHRcdFx0XHRcdGRpc3BsYXlfZ3JvdXBfYWxsKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2V7XG5cdFx0XHRcdFx0XHRcdGRpc3BsYXlfYnlfY2F0KCk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRzY29wZS4kd2F0Y2goJ2luZGV4ZXInLCBmdW5jdGlvbiAobiwgbykge1xuXHRcdFx0XHRcdGlmKG4gPT09IG8pe1xuXHRcdFx0XHRcdFx0cmV0dXJuXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmKHR5cGVvZiBuWzBdLmNoaWxkcmVuICE9IFwidW5kZWZpbmVkXCIpe1xuXHRcdFx0XHRcdFx0b3B0aW9ucy50b29sdGlwLmhpZGVUb29sdGlwKCk7XG5cdFx0XHRcdFx0XHRjbGVhcl9ub2RlcygpO1xuXHRcdFx0XHRcdFx0Y3JlYXRlX25vZGVzKCk7XG5cdFx0XHRcdFx0XHRjcmVhdGVfdmlzKCk7XG5cdFx0XHRcdFx0XHRzdGFydCgpO1xuXG5cdFx0XHRcdFx0XHRpZihsYWJlbHMubGVuZ3RoID09IDEgfHwgb3B0aW9ucy5sYWJlbHMgIT0gdHJ1ZSl7XG5cdFx0XHRcdFx0XHRcdFx0ZGlzcGxheV9ncm91cF9hbGwoKTtcblx0XHRcdFx0XHRcdFx0XHRjb25zb2xlLmxvZygnYWxsJyk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRlbHNle1xuXHRcdFx0XHRcdFx0XHRcdGRpc3BsYXlfYnlfY2F0KCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdFx0c2NvcGUuJHdhdGNoKCdkaXJlY3Rpb24nLCBmdW5jdGlvbiAob2xkRCwgbmV3RCkge1xuXHRcdFx0XHRcdGlmIChvbGREID09PSBuZXdEKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmIChvbGREID09IFwiYWxsXCIpIHtcblx0XHRcdFx0XHRcdGRpc3BsYXlfZ3JvdXBfYWxsKCk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGRpc3BsYXlfYnlfY2F0KCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KVxuXHRcdFx0fVxuXHRcdH07XG5cdH0pO1xufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSggJ2FwcC5jb250cm9sbGVycycgKS5jb250cm9sbGVyKCAnQ2lyY2xlZ3JhcGhDdHJsJywgZnVuY3Rpb24oKXtcblx0XHQvL1xuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmRpcmVjdGl2ZXMnKS5kaXJlY3RpdmUoJ2NpcmNsZWdyYXBoJywgZnVuY3Rpb24oJHRpbWVvdXQpIHtcblx0XHR2YXIgZGVmYXVsdHMgPSBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdHdpZHRoOiA4MCxcblx0XHRcdFx0aGVpZ2h0OiA4MCxcblx0XHRcdFx0Y29sb3I6ICcjMDBjY2FhJyxcblx0XHRcdFx0c2l6ZTogMTc4LFxuXHRcdFx0XHRmaWVsZDogJ3JhbmsnXG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiB7XG5cdFx0XHRyZXN0cmljdDogJ0UnLFxuXHRcdFx0Y29udHJvbGxlcjogJ0NpcmNsZWdyYXBoQ3RybCcsXG5cdFx0XHRzY29wZToge1xuXHRcdFx0XHRvcHRpb25zOiAnPSdcblx0XHRcdH0sXG5cdFx0XHRyZXF1aXJlOiAnbmdNb2RlbCcsXG5cdFx0XHRsaW5rOiBmdW5jdGlvbigkc2NvcGUsIGVsZW1lbnQsICRhdHRycywgbmdNb2RlbCkge1xuXHRcdFx0XHQvL0ZldGNoaW5nIE9wdGlvbnNcblxuXHRcdFx0ICRzY29wZS5vcHRpb25zID0gYW5ndWxhci5leHRlbmQoZGVmYXVsdHMoKSwgJHNjb3BlLm9wdGlvbnMpO1xuXG5cdFx0XHRcdC8vQ3JlYXRpbmcgdGhlIFNjYWxlXG5cdFx0XHRcdHZhciByb3RhdGUgPSBkMy5zY2FsZS5saW5lYXIoKVxuXHRcdFx0XHRcdC5kb21haW4oWzEsICRzY29wZS5vcHRpb25zLnNpemVdKVxuXHRcdFx0XHRcdC5yYW5nZShbMSwgMF0pXG5cdFx0XHRcdFx0LmNsYW1wKHRydWUpO1xuXG5cdFx0XHRcdC8vQ3JlYXRpbmcgRWxlbWVudHNcblx0XHRcdFx0dmFyIHN2ZyA9IGQzLnNlbGVjdChlbGVtZW50WzBdKS5hcHBlbmQoJ3N2ZycpXG5cdFx0XHRcdFx0LmF0dHIoJ3dpZHRoJywgJHNjb3BlLm9wdGlvbnMud2lkdGgpXG5cdFx0XHRcdFx0LmF0dHIoJ2hlaWdodCcsICRzY29wZS5vcHRpb25zLmhlaWdodClcblx0XHRcdFx0XHQuYXBwZW5kKCdnJyk7XG5cdFx0XHRcdHZhciBjb250YWluZXIgPSBzdmcuYXBwZW5kKCdnJylcblx0XHRcdFx0XHQuYXR0cigndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgnICsgJHNjb3BlLm9wdGlvbnMud2lkdGggLyAyICsgJywnICsgJHNjb3BlLm9wdGlvbnMuaGVpZ2h0IC8gMiArICcpJyk7XG5cdFx0XHRcdHZhciBjaXJjbGVCYWNrID0gY29udGFpbmVyLmFwcGVuZCgnY2lyY2xlJylcblx0XHRcdFx0XHQuYXR0cigncicsICRzY29wZS5vcHRpb25zLndpZHRoIC8gMiAtIDIpXG5cdFx0XHRcdFx0LmF0dHIoJ3N0cm9rZS13aWR0aCcsIDIpXG5cdFx0XHRcdFx0LmF0dHIoJ3N0cm9rZScsICRzY29wZS5vcHRpb25zLmNvbG9yKVxuXHRcdFx0XHRcdC5zdHlsZSgnb3BhY2l0eScsICcwLjYnKVxuXHRcdFx0XHRcdC5hdHRyKCdmaWxsJywgJ25vbmUnKTtcblx0XHRcdFx0dmFyIGFyYyA9IGQzLnN2Zy5hcmMoKVxuXHRcdFx0XHRcdC5zdGFydEFuZ2xlKDApXG5cdFx0XHRcdFx0LmlubmVyUmFkaXVzKGZ1bmN0aW9uKGQpIHtcblx0XHRcdFx0XHRcdHJldHVybiAkc2NvcGUub3B0aW9ucy53aWR0aCAvIDIgLSA0O1xuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0Lm91dGVyUmFkaXVzKGZ1bmN0aW9uKGQpIHtcblx0XHRcdFx0XHRcdHJldHVybiAkc2NvcGUub3B0aW9ucy53aWR0aCAvIDI7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdHZhciBjaXJjbGVHcmFwaCA9IGNvbnRhaW5lci5hcHBlbmQoJ3BhdGgnKVxuXHRcdFx0XHRcdC5kYXR1bSh7XG5cdFx0XHRcdFx0XHRlbmRBbmdsZTogMiAqIE1hdGguUEkgKiAwXG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQuc3R5bGUoXCJmaWxsXCIsICRzY29wZS5vcHRpb25zLmNvbG9yKVxuXHRcdFx0XHRcdC5hdHRyKCdkJywgYXJjKTtcblx0XHRcdFx0dmFyIHRleHQgPSBjb250YWluZXIuc2VsZWN0QWxsKCd0ZXh0Jylcblx0XHRcdFx0XHQuZGF0YShbMF0pXG5cdFx0XHRcdFx0LmVudGVyKClcblx0XHRcdFx0XHQuYXBwZW5kKCd0ZXh0Jylcblx0XHRcdFx0XHQudGV4dChmdW5jdGlvbihkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gJ07CsCcgKyBkO1xuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0XHQuc3R5bGUoXCJmaWxsXCIsICRzY29wZS5vcHRpb25zLmNvbG9yKVxuXHRcdFx0XHRcdC5zdHlsZSgnZm9udC13ZWlnaHQnLCAnYm9sZCcpXG5cdFx0XHRcdFx0LmF0dHIoJ3RleHQtYW5jaG9yJywgJ21pZGRsZScpXG5cdFx0XHRcdFx0LmF0dHIoJ3knLCAnMC4zNWVtJyk7XG5cblx0XHRcdFx0Ly9UcmFuc2l0aW9uIGlmIHNlbGVjdGlvbiBoYXMgY2hhbmdlZFxuXHRcdFx0XHRmdW5jdGlvbiBhbmltYXRlSXQocmFkaXVzKSB7XG5cdFx0XHRcdFx0Y2lyY2xlR3JhcGgudHJhbnNpdGlvbigpXG5cdFx0XHRcdFx0XHQuZHVyYXRpb24oNzUwKVxuXHRcdFx0XHRcdFx0LmNhbGwoYXJjVHdlZW4sIHJvdGF0ZShyYWRpdXMpICogMiAqIE1hdGguUEkpO1xuXHRcdFx0XHRcdHRleHQudHJhbnNpdGlvbigpLmR1cmF0aW9uKDc1MCkudHdlZW4oJ3RleHQnLCBmdW5jdGlvbihkKSB7XG5cdFx0XHRcdFx0XHR2YXIgZGF0YSA9IHRoaXMudGV4dENvbnRlbnQuc3BsaXQoJ07CsCcpO1xuXHRcdFx0XHRcdFx0dmFyIGkgPSBkMy5pbnRlcnBvbGF0ZShwYXJzZUludChkYXRhWzFdKSwgcmFkaXVzKTtcblx0XHRcdFx0XHRcdHJldHVybiBmdW5jdGlvbih0KSB7XG5cdFx0XHRcdFx0XHRcdHRoaXMudGV4dENvbnRlbnQgPSAgJ07CsCcgKyAoTWF0aC5yb3VuZChpKHQpICogMSkgLyAxKTtcblx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vVHdlZW4gYW5pbWF0aW9uIGZvciB0aGUgQXJjXG5cdFx0XHRcdGZ1bmN0aW9uIGFyY1R3ZWVuKHRyYW5zaXRpb24sIG5ld0FuZ2xlKSB7XG5cblx0XHRcdFx0XHR0cmFuc2l0aW9uLmF0dHJUd2VlbihcImRcIiwgZnVuY3Rpb24oZCkge1xuXHRcdFx0XHRcdFx0dmFyIGludGVycG9sYXRlID0gZDMuaW50ZXJwb2xhdGUoZC5lbmRBbmdsZSwgbmV3QW5nbGUpO1xuXHRcdFx0XHRcdFx0cmV0dXJuIGZ1bmN0aW9uKHQpIHtcblx0XHRcdFx0XHRcdFx0ZC5lbmRBbmdsZSA9IGludGVycG9sYXRlKHQpO1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gYXJjKGQpO1xuXHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXHRcdFx0XHQkc2NvcGUuJHdhdGNoKCdvcHRpb25zJyxmdW5jdGlvbihuLCBvKXtcblx0XHRcdFx0XHRcdGlmKG4gPT09IG8pe1xuXHRcdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRjaXJjbGVCYWNrLnN0eWxlKCdzdHJva2UnLCBuLmNvbG9yKTtcblx0XHRcdFx0XHRcdGNpcmNsZUdyYXBoLnN0eWxlKCdmaWxsJywgbi5jb2xvcik7XG5cdFx0XHRcdFx0XHR0ZXh0LnN0eWxlKCdmaWxsJywgbi5jb2xvcik7XG5cdFx0XHRcdFx0XHQkdGltZW91dChmdW5jdGlvbigpe1xuXHRcdFx0XHRcdFx0XHRhbmltYXRlSXQobmdNb2RlbC4kbW9kZWxWYWx1ZVtuLmZpZWxkXSlcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9KTtcblx0XHRcdFx0Ly9XYXRjaGluZyBpZiBzZWxlY3Rpb24gaGFzIGNoYW5nZWQgZnJvbSBhbm90aGVyIFVJIGVsZW1lbnRcblx0XHRcdFx0JHNjb3BlLiR3YXRjaChcblx0XHRcdFx0XHRmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdHJldHVybiBuZ01vZGVsLiRtb2RlbFZhbHVlO1xuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0ZnVuY3Rpb24obiwgbykge1xuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0aWYgKCFuKXtcblx0XHRcdFx0XHRcdFx0biA9IHt9O1xuXHRcdFx0XHRcdFx0XHRuWyRzY29wZS5vcHRpb25zLmZpZWxkXSA9ICRzY29wZS5vcHRpb25zLnNpemU7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHQkdGltZW91dChmdW5jdGlvbigpe1xuXHRcdFx0XHRcdFx0XHRhbmltYXRlSXQoblskc2NvcGUub3B0aW9ucy5maWVsZF0pXG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9O1xuXG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZGlyZWN0aXZlcycpLmRpcmVjdGl2ZSggJ2hpc3RvcnknLCBmdW5jdGlvbigpIHtcblx0XHR2YXIgZGVmYXVsdHMgPSBmdW5jdGlvbigpe1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0ZmllbGQ6ICdzY29yZScsXG5cdFx0XHRcdGNvbG9yOiAnJ1xuXHRcdFx0fVxuXHRcdH07XG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlc3RyaWN0OiAnRScsXG5cdFx0XHR0ZW1wbGF0ZVVybDogJ3ZpZXdzL2RpcmVjdGl2ZXMvaGlzdG9yeS9oaXN0b3J5Lmh0bWwnLFxuXHRcdFx0Y29udHJvbGxlcjogJ0hpc3RvcnlDdHJsJyxcblx0XHRcdHNjb3BlOntcblx0XHRcdFx0b3B0aW9uczonPScsXG5cdFx0XHRcdGNoYXJ0ZGF0YTogJz0nXG5cdFx0XHR9LFxuXHRcdFx0bGluazogZnVuY3Rpb24oICRzY29wZSwgZWxlbWVudCwgJGF0dHJzLCBuZ01vZGVsKXtcblx0XHRcdFx0XHR2YXIgb3B0aW9ucyA9IGFuZ3VsYXIuZXh0ZW5kKGRlZmF1bHRzKCksICRzY29wZS5vcHRpb25zKTtcblx0XHRcdH1cblx0XHR9O1xuXG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0hpc3RvcnlDdHJsJywgZnVuY3Rpb24gKCRzY29wZSkge1xuXHRcdCRzY29wZS5zZXREYXRhID0gc2V0RGF0YTtcblx0XHRhY3RpdmF0ZSgpO1xuXHRcblx0XHRmdW5jdGlvbiBhY3RpdmF0ZSgpe1xuXHRcdFx0JHNjb3BlLnNldERhdGEoKTtcblx0XHRcdCRzY29wZS4kd2F0Y2goJ29wdGlvbnMnLCBmdW5jdGlvbihuLG8pe1xuXHRcdFx0XHRpZihuID09PSAwKXtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblx0XHRcdFx0JHNjb3BlLnNldERhdGEoKTtcblx0XHRcdH0pXG5cdFx0fVxuXHRcdGZ1bmN0aW9uIHNldERhdGEoKXtcblx0XHRcdCRzY29wZS5kaXNwbGF5ID0ge1xuXHRcdFx0XHRzZWxlY3RlZENhdDogJycsXG5cdFx0XHRcdHJhbms6IFt7XG5cdFx0XHRcdFx0ZmllbGRzOiB7XG5cdFx0XHRcdFx0XHR4OiAneWVhcicsXG5cdFx0XHRcdFx0XHR5OiAncmFuaydcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdHRpdGxlOiAnUmFuaycsXG5cdFx0XHRcdFx0Y29sb3I6ICcjNTJiNjk1J1xuXHRcdFx0XHR9XSxcblx0XHRcdFx0c2NvcmU6IFt7XG5cdFx0XHRcdFx0ZmllbGRzOiB7XG5cdFx0XHRcdFx0XHR4OiAneWVhcicsXG5cdFx0XHRcdFx0XHR5OiAkc2NvcGUub3B0aW9ucy5maWVsZFxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0dGl0bGU6ICdTY29yZScsXG5cdFx0XHRcdFx0Y29sb3I6ICRzY29wZS5vcHRpb25zLmNvbG9yXG5cdFx0XHRcdH1dXG5cdFx0XHR9O1xuXHRcdH1cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmRpcmVjdGl2ZXMnKS5kaXJlY3RpdmUoJ21lZGlhbicsIGZ1bmN0aW9uICgkdGltZW91dCkge1xuXHRcdHZhciBkZWZhdWx0cyA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdGlkOiAnZ3JhZGllbnQnLFxuXHRcdFx0XHR3aWR0aDogMzAwLFxuXHRcdFx0XHRoZWlnaHQ6IDQwLFxuXHRcdFx0XHRpbmZvOiB0cnVlLFxuXHRcdFx0XHRmaWVsZDogJ3Njb3JlJyxcblx0XHRcdFx0aGFuZGxpbmc6IHRydWUsXG5cdFx0XHRcdG1hcmdpbjoge1xuXHRcdFx0XHRcdGxlZnQ6IDIwLFxuXHRcdFx0XHRcdHJpZ2h0OiAyMCxcblx0XHRcdFx0XHR0b3A6IDEwLFxuXHRcdFx0XHRcdGJvdHRvbTogMTBcblx0XHRcdFx0fSxcblx0XHRcdFx0Y29sb3JzOiBbIHtcblx0XHRcdFx0XHRwb3NpdGlvbjogMCxcblx0XHRcdFx0XHRjb2xvcjogJ3JnYmEoMTAyLDEwMiwxMDIsMSknLFxuXHRcdFx0XHRcdG9wYWNpdHk6IDFcblx0XHRcdFx0fSwge1xuXHRcdFx0XHRcdHBvc2l0aW9uOiA1Myxcblx0XHRcdFx0XHRjb2xvcjogJ3JnYmEoMTI4LCAyNDMsIDE5OCwxKScsXG5cdFx0XHRcdFx0b3BhY2l0eTogMVxuXHRcdFx0XHR9LHtcblx0XHRcdFx0XHRwb3NpdGlvbjogMTAwLFxuXHRcdFx0XHRcdGNvbG9yOiAncmdiYSgyNTUsMjU1LDI1NSwxKScsXG5cdFx0XHRcdFx0b3BhY2l0eTogMFxuXHRcdFx0XHR9XVxuXHRcdFx0fTtcblx0XHR9XG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlc3RyaWN0OiAnRScsXG5cdFx0XHRzY29wZToge1xuXHRcdFx0XHRkYXRhOiAnPScsXG5cdFx0XHRcdG9wdGlvbnM6ICc9J1xuXHRcdFx0fSxcblx0XHRcdHJlcXVpcmU6ICduZ01vZGVsJyxcblx0XHRcdGxpbms6IGZ1bmN0aW9uICgkc2NvcGUsIGVsZW1lbnQsICRhdHRycywgbmdNb2RlbCkge1xuXG5cdFx0XHRcdHZhciBvcHRpb25zID0gYW5ndWxhci5leHRlbmQoZGVmYXVsdHMoKSwgJGF0dHJzKTtcblx0XHRcdFx0b3B0aW9ucyA9IGFuZ3VsYXIuZXh0ZW5kKG9wdGlvbnMsICRzY29wZS5vcHRpb25zKTtcblx0XHRcdFx0b3B0aW9ucy51bmlxdWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcblx0XHRcdFx0aWYob3B0aW9ucy5jb2xvcil7XG5cdFx0XHRcdFx0b3B0aW9ucy5jb2xvcnNbMV0uY29sb3IgPSBvcHRpb25zLmNvbG9yO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsZW1lbnQuY3NzKCdoZWlnaHQnLCBvcHRpb25zLmhlaWdodCArICdweCcpLmNzcygnYm9yZGVyLXJhZGl1cycsIG9wdGlvbnMuaGVpZ2h0IC8gMiArICdweCcpO1xuXHRcdFx0XHR2YXIgeCA9IGQzLnNjYWxlLmxpbmVhcigpXG5cdFx0XHRcdFx0LmRvbWFpbihbMCwgMTAwXSlcblx0XHRcdFx0XHQucmFuZ2UoW29wdGlvbnMubWFyZ2luLmxlZnQsIG9wdGlvbnMud2lkdGggLSBvcHRpb25zLm1hcmdpbi5sZWZ0XSlcblx0XHRcdFx0XHQuY2xhbXAodHJ1ZSk7XG5cblx0XHRcdFx0dmFyIGJydXNoID0gZDMuc3ZnLmJydXNoKClcblx0XHRcdFx0XHQueCh4KVxuXHRcdFx0XHRcdC5leHRlbnQoWzAsIDBdKVxuXHRcdFx0XHRcdC5vbihcImJydXNoXCIsIGJydXNoKVxuXHRcdFx0XHRcdC5vbihcImJydXNoZW5kXCIsIGJydXNoZWQpO1xuXG5cdFx0XHRcdHZhciBzdmcgPSBkMy5zZWxlY3QoZWxlbWVudFswXSkuYXBwZW5kKFwic3ZnXCIpXG5cdFx0XHRcdFx0LmF0dHIoXCJ3aWR0aFwiLCBvcHRpb25zLndpZHRoKVxuXHRcdFx0XHRcdC5hdHRyKFwiaGVpZ2h0XCIsIG9wdGlvbnMuaGVpZ2h0KVxuXHRcdFx0XHRcdC5hcHBlbmQoXCJnXCIpO1xuXHRcdFx0XHQvLy5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKDAsXCIgKyBvcHRpb25zLm1hcmdpbi50b3AgLyAyICsgXCIpXCIpO1xuXHRcdFx0XHR2YXIgZ3JhZGllbnQgPSBzdmcuYXBwZW5kKCdzdmc6ZGVmcycpXG5cdFx0XHRcdFx0LmFwcGVuZChcInN2ZzpsaW5lYXJHcmFkaWVudFwiKVxuXHRcdFx0XHRcdC5hdHRyKCdpZCcsIG9wdGlvbnMuZmllbGQrb3B0aW9ucy51bmlxdWUpXG5cdFx0XHRcdFx0LmF0dHIoJ3gxJywgJzAlJylcblx0XHRcdFx0XHQuYXR0cigneTEnLCAnMCUnKVxuXHRcdFx0XHRcdC5hdHRyKCd4MicsICcxMDAlJylcblx0XHRcdFx0XHQuYXR0cigneTInLCAnMCUnKVxuXHRcdFx0XHRcdC5hdHRyKCdzcHJlYWRNZXRob2QnLCAncGFkJylcblx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKG9wdGlvbnMuY29sb3JzLCBmdW5jdGlvbiAoY29sb3IpIHtcblx0XHRcdFx0XHRncmFkaWVudC5hcHBlbmQoJ3N2ZzpzdG9wJylcblx0XHRcdFx0XHRcdC5hdHRyKCdvZmZzZXQnLCBjb2xvci5wb3NpdGlvbiArICclJylcblx0XHRcdFx0XHRcdC5hdHRyKCdzdG9wLWNvbG9yJywgY29sb3IuY29sb3IpXG5cdFx0XHRcdFx0XHQuYXR0cignc3RvcC1vcGFjaXR5JywgY29sb3Iub3BhY2l0eSk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHR2YXIgcmVjdCA9IHN2Zy5hcHBlbmQoJ3N2ZzpyZWN0Jylcblx0XHRcdFx0XHQuYXR0cignd2lkdGgnLCBvcHRpb25zLndpZHRoKVxuXHRcdFx0XHRcdC5hdHRyKCdoZWlnaHQnLCBvcHRpb25zLmhlaWdodClcblx0XHRcdFx0XHQuc3R5bGUoJ2ZpbGwnLCAndXJsKCMnICsgKG9wdGlvbnMuZmllbGQrb3B0aW9ucy51bmlxdWUpKyAnKScpO1xuXHRcdFx0XHR2YXIgbGVnZW5kID0gc3ZnLmFwcGVuZCgnZycpLmF0dHIoJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoJyArIG9wdGlvbnMuaGVpZ2h0IC8gMiArICcsICcgKyBvcHRpb25zLmhlaWdodCAvIDIgKyAnKScpXG5cdFx0XHRcdFx0LmF0dHIoJ2NsYXNzJywgJ3N0YXJ0TGFiZWwnKVxuXG5cdFx0XHRcdGlmIChvcHRpb25zLmluZm8gPT09IHRydWUpIHtcblx0XHRcdFx0XHRsZWdlbmQuYXBwZW5kKCdjaXJjbGUnKVxuXHRcdFx0XHRcdFx0LmF0dHIoJ3InLCBvcHRpb25zLmhlaWdodCAvIDIpO1xuXHRcdFx0XHRcdGxlZ2VuZC5hcHBlbmQoJ3RleHQnKVxuXHRcdFx0XHRcdFx0LnRleHQoMClcblx0XHRcdFx0XHRcdC5zdHlsZSgnZm9udC1zaXplJywgb3B0aW9ucy5oZWlnaHQvMi41KVxuXHRcdFx0XHRcdFx0LmF0dHIoJ3RleHQtYW5jaG9yJywgJ21pZGRsZScpXG5cdFx0XHRcdFx0XHQuYXR0cigneScsICcuMzVlbScpXG5cdFx0XHRcdFx0dmFyIGxlZ2VuZDIgPSBzdmcuYXBwZW5kKCdnJykuYXR0cigndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgnICsgKG9wdGlvbnMud2lkdGggLSAob3B0aW9ucy5oZWlnaHQgLyAyKSkgKyAnLCAnICsgb3B0aW9ucy5oZWlnaHQgLyAyICsgJyknKVxuXHRcdFx0XHRcdFx0LmF0dHIoJ2NsYXNzJywgJ2VuZExhYmVsJylcblx0XHRcdFx0XHRsZWdlbmQyLmFwcGVuZCgnY2lyY2xlJylcblx0XHRcdFx0XHRcdC5hdHRyKCdyJywgb3B0aW9ucy5oZWlnaHQgLyAyKVxuXHRcdFx0XHRcdGxlZ2VuZDIuYXBwZW5kKCd0ZXh0Jylcblx0XHRcdFx0XHRcdC50ZXh0KDEwMClcblx0XHRcdFx0XHRcdC5zdHlsZSgnZm9udC1zaXplJywgb3B0aW9ucy5oZWlnaHQvMi41KVxuXHRcdFx0XHRcdFx0LmF0dHIoJ3RleHQtYW5jaG9yJywgJ21pZGRsZScpXG5cdFx0XHRcdFx0XHQuYXR0cigneScsICcuMzVlbScpXG5cdFx0XHRcdH1cblx0XHRcdFx0dmFyIHNsaWRlciA9IHN2Zy5hcHBlbmQoXCJnXCIpXG5cdFx0XHRcdFx0LmF0dHIoXCJjbGFzc1wiLCBcInNsaWRlclwiKTtcblx0XHRcdFx0aWYob3B0aW9ucy5oYW5kbGluZyA9PSB0cnVlKXtcblx0XHRcdFx0XHRzbGlkZXIuY2FsbChicnVzaCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRzbGlkZXIuc2VsZWN0KFwiLmJhY2tncm91bmRcIilcblx0XHRcdFx0XHQuYXR0cihcImhlaWdodFwiLCBvcHRpb25zLmhlaWdodCk7XG5cblx0XHRcdFx0aWYgKG9wdGlvbnMuaW5mbyA9PT0gdHJ1ZSkge1xuXHRcdFx0XHRzbGlkZXIuYXBwZW5kKCdsaW5lJylcblx0XHRcdFx0XHQuYXR0cigneDEnLCBvcHRpb25zLndpZHRoIC8gMilcblx0XHRcdFx0XHQuYXR0cigneTEnLCAwKVxuXHRcdFx0XHRcdC5hdHRyKCd4MicsIG9wdGlvbnMud2lkdGggLyAyKVxuXHRcdFx0XHRcdC5hdHRyKCd5MicsIG9wdGlvbnMuaGVpZ2h0KVxuXHRcdFx0XHRcdC5hdHRyKCdzdHJva2UtZGFzaGFycmF5JywgJzMsMycpXG5cdFx0XHRcdFx0LmF0dHIoJ3N0cm9rZS13aWR0aCcsIDEpXG5cdFx0XHRcdFx0LmF0dHIoJ3N0cm9rZScsICdyZ2JhKDAsMCwwLDg3KScpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHZhciBoYW5kbGVDb250ID0gc2xpZGVyLmFwcGVuZCgnZycpXG5cdFx0XHRcdFx0LmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoMCxcIiArIG9wdGlvbnMuaGVpZ2h0IC8gMiArIFwiKVwiKTtcblx0XHRcdFx0dmFyIGhhbmRsZSA9IGhhbmRsZUNvbnQuYXBwZW5kKFwiY2lyY2xlXCIpXG5cdFx0XHRcdFx0LmF0dHIoXCJjbGFzc1wiLCBcImhhbmRsZVwiKVxuXHRcdFx0XHRcdC5hdHRyKFwiclwiLCBvcHRpb25zLmhlaWdodCAvIDIpO1xuXHRcdFx0XHRcdGlmKG9wdGlvbnMuY29sb3Ipe1xuXHRcdFx0XHRcdFx0aGFuZGxlLnN0eWxlKCdmaWxsJywgb3B0aW9ucy5jb2xvcik7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR2YXIgaGFuZGxlTGFiZWwgPSBoYW5kbGVDb250LmFwcGVuZCgndGV4dCcpXG5cdFx0XHRcdFx0LnRleHQoMClcblx0XHRcdFx0XHQuc3R5bGUoJ2ZvbnQtc2l6ZScsIG9wdGlvbnMuaGVpZ2h0LzIuNSlcblx0XHRcdFx0XHQuYXR0cihcInRleHQtYW5jaG9yXCIsIFwibWlkZGxlXCIpLmF0dHIoJ3knLCAnMC4zNWVtJyk7XG5cblx0XHRcdFx0Ly9zbGlkZXJcblx0XHRcdFx0Ly8uY2FsbChicnVzaC5leHRlbnQoWzAsIDBdKSlcblx0XHRcdFx0Ly8uY2FsbChicnVzaC5ldmVudCk7XG5cblx0XHRcdFx0ZnVuY3Rpb24gYnJ1c2goKSB7XG5cdFx0XHRcdFx0dmFyIHZhbHVlID0gYnJ1c2guZXh0ZW50KClbMF07XG5cblx0XHRcdFx0XHRpZiAoZDMuZXZlbnQuc291cmNlRXZlbnQpIHsgLy8gbm90IGEgcHJvZ3JhbW1hdGljIGV2ZW50XG5cdFx0XHRcdFx0XHR2YWx1ZSA9IHguaW52ZXJ0KGQzLm1vdXNlKHRoaXMpWzBdKTtcblx0XHRcdFx0XHRcdGJydXNoLmV4dGVudChbdmFsdWUsIHZhbHVlXSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGhhbmRsZUxhYmVsLnRleHQocGFyc2VJbnQodmFsdWUpKTtcblx0XHRcdFx0XHRoYW5kbGVDb250LmF0dHIoXCJ0cmFuc2Zvcm1cIiwgJ3RyYW5zbGF0ZSgnICsgeCh2YWx1ZSkgKyAnLCcgKyBvcHRpb25zLmhlaWdodCAvIDIgKyAnKScpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0ZnVuY3Rpb24gYnJ1c2hlZCgpIHtcblx0XHRcdFx0XHR2YXIgdmFsdWUgPSBicnVzaC5leHRlbnQoKVswXSxcblx0XHRcdFx0XHRcdGNvdW50ID0gMCxcblx0XHRcdFx0XHRcdGZvdW5kID0gZmFsc2U7XG5cdFx0XHRcdFx0dmFyIGZpbmFsID0gXCJcIjtcblx0XHRcdFx0XHRkbyB7XG5cblx0XHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaCgkc2NvcGUuZGF0YSwgZnVuY3Rpb24gKG5hdCwga2V5KSB7XG5cdFx0XHRcdFx0XHRcdGlmIChwYXJzZUludChuYXRbb3B0aW9ucy5maWVsZF0pID09IHBhcnNlSW50KHZhbHVlKSkge1xuXHRcdFx0XHRcdFx0XHRcdGZpbmFsID0gbmF0O1xuXHRcdFx0XHRcdFx0XHRcdGZvdW5kID0gdHJ1ZTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRjb3VudCsrO1xuXHRcdFx0XHRcdFx0dmFsdWUgPSB2YWx1ZSA+IDUwID8gdmFsdWUgLSAxIDogdmFsdWUgKyAxO1xuXHRcdFx0XHRcdH0gd2hpbGUgKCFmb3VuZCAmJiBjb3VudCA8IDEwMCk7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2coZmluYWwpO1xuXHRcdFx0XHRcdG5nTW9kZWwuJHNldFZpZXdWYWx1ZShmaW5hbCk7XG5cdFx0XHRcdFx0bmdNb2RlbC4kcmVuZGVyKCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0JHNjb3BlLiR3YXRjaCgnb3B0aW9ucycsIGZ1bmN0aW9uKG4sbyl7XG5cdFx0XHRcdFx0aWYobiA9PT0gbyl7XG5cdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdG9wdGlvbnMuY29sb3JzWzFdLmNvbG9yID0gbi5jb2xvcjtcblx0XHRcdFx0XHRncmFkaWVudCA9IHN2Zy5hcHBlbmQoJ3N2ZzpkZWZzJylcblx0XHRcdFx0XHRcdC5hcHBlbmQoXCJzdmc6bGluZWFyR3JhZGllbnRcIilcblx0XHRcdFx0XHRcdC5hdHRyKCdpZCcsIG9wdGlvbnMuZmllbGQrXCJfXCIrbi5jb2xvcilcblx0XHRcdFx0XHRcdC5hdHRyKCd4MScsICcwJScpXG5cdFx0XHRcdFx0XHQuYXR0cigneTEnLCAnMCUnKVxuXHRcdFx0XHRcdFx0LmF0dHIoJ3gyJywgJzEwMCUnKVxuXHRcdFx0XHRcdFx0LmF0dHIoJ3kyJywgJzAlJylcblx0XHRcdFx0XHRcdC5hdHRyKCdzcHJlYWRNZXRob2QnLCAncGFkJylcblx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2gob3B0aW9ucy5jb2xvcnMsIGZ1bmN0aW9uIChjb2xvcikge1xuXHRcdFx0XHRcdFx0Z3JhZGllbnQuYXBwZW5kKCdzdmc6c3RvcCcpXG5cdFx0XHRcdFx0XHRcdC5hdHRyKCdvZmZzZXQnLCBjb2xvci5wb3NpdGlvbiArICclJylcblx0XHRcdFx0XHRcdFx0LmF0dHIoJ3N0b3AtY29sb3InLCBjb2xvci5jb2xvcilcblx0XHRcdFx0XHRcdFx0LmF0dHIoJ3N0b3Atb3BhY2l0eScsIGNvbG9yLm9wYWNpdHkpO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdHJlY3Quc3R5bGUoJ2ZpbGwnLCAndXJsKCMnICsgb3B0aW9ucy5maWVsZCArICdfJytuLmNvbG9yKycpJyk7XG5cdFx0XHRcdFx0aGFuZGxlLnN0eWxlKCdmaWxsJywgbi5jb2xvcik7XG5cdFx0XHRcdFx0aGFuZGxlTGFiZWwudGV4dChwYXJzZUludChuZ01vZGVsLiRtb2RlbFZhbHVlW24uZmllbGRdKSk7XG5cdFx0XHRcdFx0aGFuZGxlQ29udC50cmFuc2l0aW9uKCkuZHVyYXRpb24oNTAwKS5lYXNlKCdxdWFkJykuYXR0cihcInRyYW5zZm9ybVwiLCAndHJhbnNsYXRlKCcgKyB4KG5nTW9kZWwuJG1vZGVsVmFsdWVbbi5maWVsZF0pICsgJywnICsgb3B0aW9ucy5oZWlnaHQgLyAyICsgJyknKTtcblx0XHRcdFx0fSk7XG5cdFx0XHRcdCRzY29wZS4kd2F0Y2goXG5cdFx0XHRcdFx0ZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIG5nTW9kZWwuJG1vZGVsVmFsdWU7XG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRmdW5jdGlvbiAobmV3VmFsdWUsIG9sZFZhbHVlKSB7XG5cdFx0XHRcdFx0XHRpZiAoIW5ld1ZhbHVlKSB7XG5cdFx0XHRcdFx0XHRcdGhhbmRsZUxhYmVsLnRleHQocGFyc2VJbnQoMCkpO1xuXHRcdFx0XHRcdFx0XHRoYW5kbGVDb250LmF0dHIoXCJ0cmFuc2Zvcm1cIiwgJ3RyYW5zbGF0ZSgnICsgeCgwKSArICcsJyArIG9wdGlvbnMuaGVpZ2h0IC8gMiArICcpJyk7XG5cdFx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGhhbmRsZUxhYmVsLnRleHQocGFyc2VJbnQobmV3VmFsdWVbb3B0aW9ucy5maWVsZF0pKTtcblx0XHRcdFx0XHRcdGlmIChuZXdWYWx1ZSA9PSBvbGRWYWx1ZSkge1xuXHRcdFx0XHRcdFx0XHRoYW5kbGVDb250LmF0dHIoXCJ0cmFuc2Zvcm1cIiwgJ3RyYW5zbGF0ZSgnICsgeChuZXdWYWx1ZVtvcHRpb25zLmZpZWxkXSkgKyAnLCcgKyBvcHRpb25zLmhlaWdodCAvIDIgKyAnKScpO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0aGFuZGxlQ29udC50cmFuc2l0aW9uKCkuZHVyYXRpb24oNTAwKS5lYXNlKCdxdWFkJykuYXR0cihcInRyYW5zZm9ybVwiLCAndHJhbnNsYXRlKCcgKyB4KG5ld1ZhbHVlW29wdGlvbnMuZmllbGRdKSArICcsJyArIG9wdGlvbnMuaGVpZ2h0IC8gMiArICcpJyk7XG5cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9O1xuXG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCAnYXBwLmNvbnRyb2xsZXJzJyApLmNvbnRyb2xsZXIoICdNZWRpYW5DdHJsJywgZnVuY3Rpb24oKXtcblx0XHQvL1xuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZGlyZWN0aXZlcycpLmRpcmVjdGl2ZSggJ3BhcnNlY3N2JywgZnVuY3Rpb24oJHN0YXRlLCAkdGltZW91dCwgdG9hc3RyKSB7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0cmVzdHJpY3Q6ICdFQScsXG5cdFx0XHR0ZW1wbGF0ZVVybDogJ3ZpZXdzL2RpcmVjdGl2ZXMvcGFyc2Vjc3YvcGFyc2Vjc3YuaHRtbCcsXG5cdFx0XHRjb250cm9sbGVyOiAnUGFyc2Vjc3ZDdHJsJyxcblx0XHRcdHJlcGxhY2U6dHJ1ZSxcblx0XHRcdGxpbms6IGZ1bmN0aW9uKCAkc2NvcGUsIGVsZW1lbnQsICRhdHRycyApe1xuXHRcdFx0XHQvL1xuXHRcdFx0XHR2YXIgZXJyb3JzID0gMDtcblx0XHRcdFx0dmFyIHN0ZXBwZWQgPSAwLCByb3dDb3VudCA9IDAsIGVycm9yQ291bnQgPSAwLCBmaXJzdEVycm9yO1xuXHRcdFx0XHR2YXIgc3RhcnQsIGVuZDtcblx0XHRcdFx0dmFyIGZpcnN0UnVuID0gdHJ1ZTtcblx0XHRcdFx0dmFyIG1heFVucGFyc2VMZW5ndGggPSAxMDAwMDtcblx0XHRcdFx0dmFyIGJ1dHRvbiA9IGVsZW1lbnQuZmluZCgnYnV0dG9uJyk7XG5cdFx0XHRcdFx0dmFyIGlucHV0ID0gZWxlbWVudC5maW5kKCdpbnB1dCcpO1xuXHRcdFx0XHRcdHZhciBpc1ZlcnRpY2FsID0gZmFsc2U7XG5cdFx0XHRcdFx0dmFyIHJhdyA9IFtdO1xuXHRcdFx0XHRcdHZhciByYXdMaXN0ID0ge307XG5cdFx0XHRcdFx0aW5wdXQuY3NzKHsgZGlzcGxheTonbm9uZScgfSk7XG5cdFx0XHRcdFx0YnV0dG9uLmJpbmQoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHRcdGlucHV0WzBdLmNsaWNrKCk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0aW5wdXQuYmluZCgnY2hhbmdlJyxmdW5jdGlvbihlKXtcblx0XHRcdFx0XHRcdGlzVmVydGljYWwgPSBmYWxzZTtcblx0XHRcdFx0XHRcdHJhdyA9IFtdO1xuXHRcdFx0XHRcdFx0cmF3TGlzdCA9IHt9O1xuXHRcdFx0XHRcdFx0ZXJyb3JzID0gMDtcblx0XHRcdFx0XHRcdHN0ZXBwZWQgPSAwLCByb3dDb3VudCA9IDAsIGVycm9yQ291bnQgPSAwLCBmaXJzdEVycm9yO1xuXHRcdFx0XHRcdFx0c3RhcnQsIGVuZDtcblx0XHRcdFx0XHRcdGZpcnN0UnVuID0gdHJ1ZTtcblx0XHRcdFx0XHRcdFx0JHRpbWVvdXQoZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRcdFx0XHRQYXBhLnBhcnNlKGlucHV0WzBdLmZpbGVzWzBdLHtcblx0XHRcdFx0XHRcdFx0XHRcdHNraXBFbXB0eUxpbmVzOiB0cnVlLFxuXHRcdFx0XHRcdFx0XHRcdFx0aGVhZGVyOnRydWUsXG5cdFx0XHRcdFx0XHRcdFx0XHRkeW5hbWljVHlwaW5nOiB0cnVlLFxuXHRcdFx0XHRcdFx0XHRcdFx0c3RlcDpmdW5jdGlvbihyb3cpe1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2gocm93LmRhdGFbMF0sIGZ1bmN0aW9uKGl0ZW0sIGtleSl7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWYoaXNOYU4oaXRlbSkgfHwgaXRlbSA8IDAgKXtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlmKGl0ZW0udG9TdHJpbmcoKS50b1VwcGVyQ2FzZSgpID09IFwiTkFcIiB8fCBpdGVtIDwgMCB8fCBpdGVtLnRvU3RyaW5nKCkudG9VcHBlckNhc2UoKS5pbmRleE9mKCdOL0EnKSA+IC0xKXtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cm93LmVycm9ycy5wdXNoKHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR0eXBlOlwiMVwiLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1lc3NhZ2U6XCJGaWVsZCBpbiByb3cgaXMgbm90IHZhbGlkIGZvciBkYXRhYmFzZSB1c2UhXCIsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Y29sdW1uOiBpdGVtXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVycm9ycysrO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlmKGlzVmVydGljYWwpe1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChyb3cuZGF0YVswXSwgZnVuY3Rpb24oaXRlbSwga2V5KXtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlmKGtleS5sZW5ndGggPT0gMyl7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlmKHR5cGVvZlx0cmF3TGlzdFtrZXldLmRhdGEgPT0gXCJ1bmRlZmluZWRcIil7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRyYXdMaXN0W2tleV0uZGF0YSA9IFtdO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJhd0xpc3Rba2V5XS5kYXRhLnB1c2goaXRlbSk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Ly9yYXdMaXN0W2tleV0uZXJyb3JzID0gcm93LmVycm9ycztcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRlbHNle1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdCRzY29wZS52bS5kYXRhLnB1c2gocm93KTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHRcdFx0YmVmb3JlRmlyc3RDaHVuazogZnVuY3Rpb24oY2h1bmspXG5cdFx0XHRcdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdC8vQ2hlY2sgaWYgdGhlcmUgYXJlIHBvaW50cyBpbiB0aGUgaGVhZGVyc1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR2YXIgaW5kZXggPSBjaHVuay5tYXRjaCggL1xcclxcbnxcXHJ8XFxuLyApLmluZGV4O1xuXHRcdFx0XHRcdFx0XHRcdCAgICB2YXIgaGVhZGluZ3MgPSBjaHVuay5zdWJzdHIoMCwgaW5kZXgpLnNwbGl0KCAnLCcgKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0dmFyIGlzSXNvID0gW107XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGZvcih2YXIgaSA9IDA7IGkgPD0gaGVhZGluZ3MubGVuZ3RoOyBpKyspe1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlmKGhlYWRpbmdzW2ldKXtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGhlYWRpbmdzW2ldID0gaGVhZGluZ3NbaV0ucmVwbGFjZSgvW15hLXowLTldL2dpLCdfJykudG9Mb3dlckNhc2UoKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlmKGhlYWRpbmdzW2ldLmluZGV4T2YoJy4nKSA+IC0xKXtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aGVhZGluZ3NbaV0gPSBoZWFkaW5nc1tpXS5zdWJzdHIoMCwgaGVhZGluZ3NbaV0uaW5kZXhPZignLicpKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlmKGhlYWRpbmdzW2ldLmxlbmd0aCA9PSAzKXtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aXNJc28ucHVzaCh0cnVlKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKGhlYWRpbmdzW2ldKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0aWYoaGVhZGluZ3MubGVuZ3RoID09IGlzSXNvLmxlbmd0aCl7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0aXNWZXJ0aWNhbCA9IHRydWU7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRmb3IodmFyIGkgPSAwOyBpIDw9IGhlYWRpbmdzLmxlbmd0aDsgaSsrKXtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWYodHlwZW9mIHJhd0xpc3RbaGVhZGluZ3NbaV1dID09IFwidW5kZWZpbmVkXCIpe1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJhd0xpc3RbaGVhZGluZ3NbaV1dID0ge307XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cmF3TGlzdFtoZWFkaW5nc1tpXV0uZGF0YSA9IFtdO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0ICAgIHJldHVybiBoZWFkaW5ncy5qb2luKCkgKyBjaHVuay5zdWJzdHIoaW5kZXgpO1xuXHRcdFx0XHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdFx0XHRcdGVycm9yOiBmdW5jdGlvbihlcnIsIGZpbGUpXG5cdFx0XHRcdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFRvYXN0U2VydmljZS5lcnJvcihlcnIpO1xuXHRcdFx0XHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdFx0XHRcdGNvbXBsZXRlOiBmdW5jdGlvbihyZXN1bHRzKVxuXHRcdFx0XHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRcdFx0XHQkc2NvcGUudm0uZXJyb3JzID0gZXJyb3JzO1xuXG5cdFx0XHRcdFx0XHRcdFx0XHRcdC8vU2VlIGlmIHRoZXJlIGlzIGFuIGZpZWxkIG5hbWUgXCJpc29cIiBpbiB0aGUgaGVhZGluZ3M7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlmKCFpc1ZlcnRpY2FsKXtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2goJHNjb3BlLnZtLmRhdGFbMF0uZGF0YVswXSwgZnVuY3Rpb24oaXRlbSwga2V5KXtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlmKGtleS50b0xvd2VyQ2FzZSgpLmluZGV4T2YoJ2lzbycpICE9IC0xIHx8IGtleS50b0xvd2VyQ2FzZSgpLmluZGV4T2YoJ2NvZGUnKSAhPSAtMSl7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdCRzY29wZS52bS5tZXRhLmlzb19maWVsZCA9IGtleTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWYoa2V5LnRvTG93ZXJDYXNlKCkuaW5kZXhPZignY291bnRyeScpICE9IC0xKXtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQkc2NvcGUudm0ubWV0YS5jb3VudHJ5X2ZpZWxkID0ga2V5O1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0ZWxzZXtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2gocmF3TGlzdCwgZnVuY3Rpb24oaXRlbSxrZXkpe1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aXRlbS5lcnJvcnMgPSBbXTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlmKGtleS50b0xvd2VyQ2FzZSgpICE9IFwidW5kZWZpbmVkXCIgJiYgdHlwZW9mIGtleSAhPSBcInVuZGVmaW5lZFwiKXtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0dmFyIHIgPSB7aXNvOmtleS50b1VwcGVyQ2FzZSgpfTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKGl0ZW0uZGF0YSwgZnVuY3Rpb24oY29sdW1uLCBpKXtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRyWydjb2x1bW5fJytpXSA9IGNvbHVtbjtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZihpc05hTihjb2x1bW4pIHx8IGNvbHVtbiA8IDAgKXtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlmKGNvbHVtbi50b1N0cmluZygpLnRvVXBwZXJDYXNlKCkgPT0gXCJOQVwiIHx8IGNvbHVtbiA8IDAgfHwgY29sdW1uLnRvU3RyaW5nKCkudG9VcHBlckNhc2UoKS5pbmRleE9mKCdOL0EnKSA+IC0xKXtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aXRlbS5lcnJvcnMucHVzaCh7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0dHlwZTpcIjFcIixcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtZXNzYWdlOlwiRmllbGQgaW4gcm93IGlzIG5vdCB2YWxpZCBmb3IgZGF0YWJhc2UgdXNlIVwiLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGNvbHVtbjogaXRlbVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlcnJvcnMrKztcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQkc2NvcGUudm0uZGF0YS5wdXNoKHtkYXRhOltyXSwgZXJyb3JzOml0ZW0uZXJyb3JzfSk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0JHNjb3BlLnZtLm1ldGEuaXNvX2ZpZWxkID0gJ2lzbyc7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHRcdFx0XHQkc3RhdGUuZ28oJ2FwcC5pbmRleC5jcmVhdGUuY2hlY2snKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0dG9hc3RyLmluZm8oJHNjb3BlLnZtLmRhdGEubGVuZ3RoKycgbGluZXMgaW1wb3J0ZXQhJywgJ0luZm9ybWF0aW9uJylcblx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0XHR9KVxuXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fTtcblxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSggJ2FwcC5jb250cm9sbGVycycgKS5jb250cm9sbGVyKCAnUGFyc2Vjc3ZDdHJsJywgZnVuY3Rpb24oKXtcblx0XHQvL1xuXG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5kaXJlY3RpdmVzJykuZGlyZWN0aXZlKCAnc2ltcGxlbGluZWNoYXJ0JywgZnVuY3Rpb24oKSB7XG5cdFx0dmFyIGRlZmF1bHRzID0gZnVuY3Rpb24oKXtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdGludmVydDpmYWxzZVxuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4ge1xuXHRcdFx0cmVzdHJpY3Q6ICdFJyxcblx0XHRcdHNjb3BlOntcblx0XHRcdFx0ZGF0YTonPScsXG5cdFx0XHRcdHNlbGVjdGlvbjonPScsXG5cdFx0XHRcdG9wdGlvbnM6Jz0nXG5cdFx0XHR9LFxuXHRcdFx0dGVtcGxhdGVVcmw6ICd2aWV3cy9kaXJlY3RpdmVzL3NpbXBsZWxpbmVjaGFydC9zaW1wbGVsaW5lY2hhcnQuaHRtbCcsXG5cdFx0XHRjb250cm9sbGVyOiAnU2ltcGxlbGluZWNoYXJ0Q3RybCcsXG5cdFx0XHRsaW5rOiBmdW5jdGlvbiggJHNjb3BlLCBlbGVtZW50LCAkYXR0cnMgKXtcblx0XHRcdFx0JHNjb3BlLm9wdGlvbnMgPSBhbmd1bGFyLmV4dGVuZChkZWZhdWx0cygpLCAkc2NvcGUub3B0aW9ucyk7XG5cdFx0XHRcdCRzY29wZS5jYWxjdWxhdGVHcmFwaCgpO1xuXHRcdFx0XHQkc2NvcGUuc2V0Q2hhcnQoKTtcblx0XHRcdH1cblx0XHR9O1xuXG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ1NpbXBsZWxpbmVjaGFydEN0cmwnLCBmdW5jdGlvbiAoJHNjb3BlKSB7XG5cdFx0JHNjb3BlLmNvbmZpZyA9IHtcblx0XHRcdHZpc2libGU6IHRydWUsIC8vIGRlZmF1bHQ6IHRydWVcblx0XHRcdGV4dGVuZGVkOiBmYWxzZSwgLy8gZGVmYXVsdDogZmFsc2Vcblx0XHRcdGRpc2FibGVkOiBmYWxzZSwgLy8gZGVmYXVsdDogZmFsc2Vcblx0XHRcdGF1dG9yZWZyZXNoOiB0cnVlLCAvLyBkZWZhdWx0OiB0cnVlXG5cdFx0XHRyZWZyZXNoRGF0YU9ubHk6IGZhbHNlLCAvLyBkZWZhdWx0OiBmYWxzZVxuXHRcdFx0ZGVlcFdhdGNoT3B0aW9uczogdHJ1ZSwgLy8gZGVmYXVsdDogdHJ1ZVxuXHRcdFx0ZGVlcFdhdGNoRGF0YTogZmFsc2UsIC8vIGRlZmF1bHQ6IGZhbHNlXG5cdFx0XHRkZWVwV2F0Y2hDb25maWc6IHRydWUsIC8vIGRlZmF1bHQ6IHRydWVcblx0XHRcdGRlYm91bmNlOiAxMCAvLyBkZWZhdWx0OiAxMFxuXHRcdH07XG5cdFx0JHNjb3BlLmNoYXJ0ID0ge1xuXHRcdFx0b3B0aW9uczoge1xuXHRcdFx0XHRjaGFydDoge31cblx0XHRcdH0sXG5cdFx0XHRkYXRhOiBbXVxuXHRcdH07XG5cdFx0JHNjb3BlLnNldENoYXJ0ID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0JHNjb3BlLmNoYXJ0Lm9wdGlvbnMuY2hhcnQgPSB7XG5cdFx0XHRcdHR5cGU6ICdsaW5lQ2hhcnQnLFxuXHRcdFx0XHRsZWdlbmRQb3NpdGlvbjogJ2xlZnQnLFxuXHRcdFx0XHRtYXJnaW46IHtcblx0XHRcdFx0XHR0b3A6IDIwLFxuXHRcdFx0XHRcdHJpZ2h0OiAyMCxcblx0XHRcdFx0XHRib3R0b206IDIwLFxuXHRcdFx0XHRcdGxlZnQ6IDIwXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHg6IGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGQueDtcblx0XHRcdFx0fSxcblx0XHRcdFx0eTogZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRyZXR1cm4gZC55O1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRzaG93TGVnZW5kOiBmYWxzZSxcblx0XHRcdFx0c2hvd1ZhbHVlczogZmFsc2UsXG5cdFx0XHRcdHNob3dZQXhpczogZmFsc2UsXG5cdFx0XHRcdHRyYW5zaXRpb25EdXJhdGlvbjogNTAwLFxuXHRcdFx0XHR1c2VJbnRlcmFjdGl2ZUd1aWRlbGluZTogdHJ1ZSxcblx0XHRcdFx0Ly9mb3JjZVk6IFsxMDAsIDBdLFxuXHRcdFx0XHQvL3lEb21haW46eURvbWFpbixcblx0XHRcdFx0eEF4aXM6IHtcblx0XHRcdFx0XHRheGlzTGFiZWw6ICcnXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHlBeGlzOiB7XG5cdFx0XHRcdFx0YXhpc0xhYmVsOiAnJyxcblx0XHRcdFx0XHRheGlzTGFiZWxEaXN0YW5jZTogMzBcblx0XHRcdFx0fSxcblx0XHRcdFx0bGVnZW5kOiB7XG5cdFx0XHRcdFx0cmlnaHRBbGlnbjogZmFsc2Vcblx0XHRcdFx0fSxcblx0XHRcdFx0bGluZXM6IHtcblx0XHRcdFx0XHRpbnRlcnBvbGF0ZTogJ2NhcmRpbmFsJ1xuXHRcdFx0XHR9XG5cblx0XHRcdH07XG5cdFx0XHRpZiAoJHNjb3BlLm9wdGlvbnMuaW52ZXJ0ID09IHRydWUpIHtcblx0XHRcdFx0JHNjb3BlLmNoYXJ0Lm9wdGlvbnMuY2hhcnQueURvbWFpbiA9IFtwYXJzZUludCgkc2NvcGUucmFuZ2UubWF4KSwgJHNjb3BlLnJhbmdlLm1pbl07XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gJHNjb3BlLmNoYXJ0O1xuXHRcdH1cblx0XHQkc2NvcGUuY2FsY3VsYXRlR3JhcGggPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHR2YXIgY2hhcnREYXRhID0gW107XG5cdFx0XHQkc2NvcGUucmFuZ2UgPSB7XG5cdFx0XHRcdG1heDogMCxcblx0XHRcdFx0bWluOiAxMDAwXG5cdFx0XHR9O1xuXHRcdFx0YW5ndWxhci5mb3JFYWNoKCRzY29wZS5zZWxlY3Rpb24sIGZ1bmN0aW9uIChpdGVtLCBrZXkpIHtcblx0XHRcdFx0dmFyIGdyYXBoID0ge1xuXHRcdFx0XHRcdGlkOiBrZXksXG5cdFx0XHRcdFx0a2V5OiBpdGVtLnRpdGxlLFxuXHRcdFx0XHRcdGNvbG9yOiBpdGVtLmNvbG9yLFxuXHRcdFx0XHRcdHZhbHVlczogW11cblx0XHRcdFx0fTtcblx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKCRzY29wZS5kYXRhLCBmdW5jdGlvbiAoZGF0YSwgaykge1xuXHRcdFx0XHRcdGdyYXBoLnZhbHVlcy5wdXNoKHtcblx0XHRcdFx0XHRcdGlkOiBrLFxuXHRcdFx0XHRcdFx0eDogZGF0YVtpdGVtLmZpZWxkcy54XSxcblx0XHRcdFx0XHRcdHk6IGRhdGFbaXRlbS5maWVsZHMueV1cblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHQkc2NvcGUucmFuZ2UubWF4ID0gTWF0aC5tYXgoJHNjb3BlLnJhbmdlLm1heCwgZGF0YVtpdGVtLmZpZWxkcy55XSk7XG5cdFx0XHRcdFx0JHNjb3BlLnJhbmdlLm1pbiA9IE1hdGgubWluKCRzY29wZS5yYW5nZS5taW4sIGRhdGFbaXRlbS5maWVsZHMueV0pO1xuXHRcdFx0XHR9KTtcblx0XHRcdFx0Y2hhcnREYXRhLnB1c2goZ3JhcGgpO1xuXHRcdFx0fSk7XG5cblx0XHRcdCRzY29wZS5jaGFydC5kYXRhID0gY2hhcnREYXRhO1xuXHRcdFx0aWYgKCRzY29wZS5vcHRpb25zLmludmVydCA9PSBcInRydWVcIikge1xuXHRcdFx0XHQkc2NvcGUuY2hhcnQub3B0aW9ucy5jaGFydC55RG9tYWluID0gW3BhcnNlSW50KCRzY29wZS5yYW5nZS5tYXgpLCAkc2NvcGUucmFuZ2UubWluXTtcblx0XHRcdH1cblx0XHR9O1xuXHRcdCRzY29wZS4kd2F0Y2goJ2RhdGEnLCBmdW5jdGlvbiAobiwgbykge1xuXHRcdFx0aWYgKCFuKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHRcdCRzY29wZS5jYWxjdWxhdGVHcmFwaCgpO1xuXHRcdH0pO1xuXHRcdCRzY29wZS4kd2F0Y2goJ3NlbGVjdGlvbicsIGZ1bmN0aW9uIChuLCBvKSB7XG5cdFx0XHRpZiAobiA9PT0gbykge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0XHQkc2NvcGUuY2FsY3VsYXRlR3JhcGgoKTtcblx0XHR9KVxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmRpcmVjdGl2ZXMnKS5hbmltYXRpb24oJy5zbGlkZS10b2dnbGUnLCBbJyRhbmltYXRlQ3NzJywgZnVuY3Rpb24oJGFuaW1hdGVDc3MpIHtcblxuXHRcdHZhciBsYXN0SWQgPSAwO1xuICAgICAgICB2YXIgX2NhY2hlID0ge307XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0SWQoZWwpIHtcbiAgICAgICAgICAgIHZhciBpZCA9IGVsWzBdLmdldEF0dHJpYnV0ZShcImRhdGEtc2xpZGUtdG9nZ2xlXCIpO1xuICAgICAgICAgICAgaWYgKCFpZCkge1xuICAgICAgICAgICAgICAgIGlkID0gKytsYXN0SWQ7XG4gICAgICAgICAgICAgICAgZWxbMF0uc2V0QXR0cmlidXRlKFwiZGF0YS1zbGlkZS10b2dnbGVcIiwgaWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGlkO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGdldFN0YXRlKGlkKSB7XG4gICAgICAgICAgICB2YXIgc3RhdGUgPSBfY2FjaGVbaWRdO1xuICAgICAgICAgICAgaWYgKCFzdGF0ZSkge1xuICAgICAgICAgICAgICAgIHN0YXRlID0ge307XG4gICAgICAgICAgICAgICAgX2NhY2hlW2lkXSA9IHN0YXRlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZ2VuZXJhdGVSdW5uZXIoY2xvc2luZywgc3RhdGUsIGFuaW1hdG9yLCBlbGVtZW50LCBkb25lRm4pIHtcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBzdGF0ZS5hbmltYXRpbmcgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHN0YXRlLmFuaW1hdG9yID0gYW5pbWF0b3I7XG4gICAgICAgICAgICAgICAgc3RhdGUuZG9uZUZuID0gZG9uZUZuO1xuICAgICAgICAgICAgICAgIGFuaW1hdG9yLnN0YXJ0KCkuZmluYWxseShmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNsb3NpbmcgJiYgc3RhdGUuZG9uZUZuID09PSBkb25lRm4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnRbMF0uc3R5bGUuaGVpZ2h0ID0gJyc7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgc3RhdGUuYW5pbWF0aW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIHN0YXRlLmFuaW1hdG9yID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgICAgICBzdGF0ZS5kb25lRm4oKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBsZWF2ZTogZnVuY3Rpb24oZWxlbWVudCwgZG9uZUZuKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIHN0YXRlID0gZ2V0U3RhdGUoZ2V0SWQoZWxlbWVudCkpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgaGVpZ2h0ID0gKHN0YXRlLmFuaW1hdGluZyAmJiBzdGF0ZS5oZWlnaHQpID9cbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlLmhlaWdodCA6IGVsZW1lbnRbMF0ub2Zmc2V0SGVpZ2h0O1xuICAgICAgICAgICAgICAgICAgICB2YXIgYW5pbWF0b3IgPSAkYW5pbWF0ZUNzcyhlbGVtZW50LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmcm9tOiB7aGVpZ2h0OiBoZWlnaHQgKyAncHgnLCBvcGFjaXR5OiAxfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvOiB7aGVpZ2h0OiAnMHB4Jywgb3BhY2l0eTogMH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChhbmltYXRvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN0YXRlLmFuaW1hdGluZykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlLmRvbmVGbiA9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZW5lcmF0ZVJ1bm5lcih0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbmltYXRvcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkb25lRm4pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBzdGF0ZS5hbmltYXRvci5lbmQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlLmhlaWdodCA9IGhlaWdodDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZ2VuZXJhdGVSdW5uZXIodHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuaW1hdG9yLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkb25lRm4pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGRvbmVGbigpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGVudGVyOiBmdW5jdGlvbihlbGVtZW50LCBkb25lRm4pIHtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgc3RhdGUgPSBnZXRTdGF0ZShnZXRJZChlbGVtZW50KSk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBoZWlnaHQgPSAoc3RhdGUuYW5pbWF0aW5nICYmIHN0YXRlLmhlaWdodCkgP1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGUuaGVpZ2h0IDogZWxlbWVudFswXS5vZmZzZXRIZWlnaHQ7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGFuaW1hdG9yID0gJGFuaW1hdGVDc3MoZWxlbWVudCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgZnJvbToge2hlaWdodDogJzBweCcsIG9wYWNpdHk6IDB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgdG86IHtoZWlnaHQ6IGhlaWdodCArICdweCcsIG9wYWNpdHk6IDF9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBpZiAoYW5pbWF0b3IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzdGF0ZS5hbmltYXRpbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZS5kb25lRm4gPSBnZW5lcmF0ZVJ1bm5lcihmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbmltYXRvcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvbmVGbik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHN0YXRlLmFuaW1hdG9yLmVuZCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGUuaGVpZ2h0ID0gaGVpZ2h0O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBnZW5lcmF0ZVJ1bm5lcihmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuaW1hdG9yLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkb25lRm4pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGRvbmVGbigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1dKTtcbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoICdhcHAuY29udHJvbGxlcnMnICkuY29udHJvbGxlciggJ1NsaWRlVG9nZ2xlQ3RybCcsIGZ1bmN0aW9uKCl7XG5cdFx0Ly9cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZGlyZWN0aXZlcycpLmRpcmVjdGl2ZSgnc3ViaW5kZXgnLCBzdWJpbmRleCk7XG5cblx0c3ViaW5kZXguJGluamVjdCA9IFsnJHRpbWVvdXQnLCAnc21vb3RoU2Nyb2xsJ107XG5cblx0ZnVuY3Rpb24gc3ViaW5kZXgoJHRpbWVvdXQsIHNtb290aFNjcm9sbCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRyZXN0cmljdDogJ0UnLFxuXHRcdFx0cmVwbGFjZTogdHJ1ZSxcblx0XHRcdGNvbnRyb2xsZXI6ICdTdWJpbmRleEN0cmwnLFxuXHRcdFx0dGVtcGxhdGVVcmw6ICd2aWV3cy9kaXJlY3RpdmVzL3N1YmluZGV4L3N1YmluZGV4Lmh0bWwnLFxuXHRcdFx0bGluazogc3ViaW5kZXhMaW5rRnVuY3Rpb25cblx0XHR9O1xuXG5cdFx0ZnVuY3Rpb24gc3ViaW5kZXhMaW5rRnVuY3Rpb24oJHNjb3BlLCBlbGVtZW50LCAkYXR0cnMpIHtcblx0XHR9XG5cdH1cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdTdWJpbmRleEN0cmwnLCBmdW5jdGlvbigkc2NvcGUsICRmaWx0ZXIsICR0aW1lb3V0KSB7XG5cdFx0JHNjb3BlLmluZm8gPSBmYWxzZTtcblx0XHQkc2NvcGUuc2V0Q2hhcnQgPSBzZXRDaGFydDtcblx0XHQkc2NvcGUuY2FsY3VsYXRlR3JhcGggPSBjYWxjdWxhdGVHcmFwaDtcblx0XHQkc2NvcGUuY3JlYXRlSW5kZXhlciA9IGNyZWF0ZUluZGV4ZXI7XG5cdFx0JHNjb3BlLmNhbGNTdWJSYW5rID0gY2FsY1N1YlJhbms7XG5cdFx0JHNjb3BlLnRvZ2dsZUluZm8gPSB0b2dnbGVJbmZvO1xuXHRcdCRzY29wZS5jcmVhdGVPcHRpb25zID0gY3JlYXRlT3B0aW9ucztcblx0XHQkc2NvcGUuZ2V0U3ViUmFuayA9IGdldFN1YlJhbms7XG5cdFx0YWN0aXZhdGUoKTtcblxuXHRcdGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xuXHRcdFx0JHNjb3BlLmNhbGNTdWJSYW5rKCk7XG5cdFx0XHQkc2NvcGUuc2V0Q2hhcnQoKTtcblx0XHRcdCRzY29wZS5jYWxjdWxhdGVHcmFwaCgpO1xuXHRcdFx0JHNjb3BlLmNyZWF0ZUluZGV4ZXIoKTtcblx0XHRcdCRzY29wZS5jcmVhdGVPcHRpb25zKCk7XG5cdFx0XHQkc2NvcGUuJHdhdGNoKCdkaXNwbGF5LnNlbGVjdGVkQ2F0JywgZnVuY3Rpb24obmV3SXRlbSwgb2xkSXRlbSkge1xuXHRcdFx0XHRpZiAobmV3SXRlbSA9PT0gb2xkSXRlbSkge1xuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0fVxuXHRcdFx0XHQkc2NvcGUuY3JlYXRlSW5kZXhlcigpO1xuXHRcdFx0XHQkc2NvcGUuY2FsY3VsYXRlR3JhcGgoKTtcblx0XHRcdFx0JHNjb3BlLmNyZWF0ZU9wdGlvbnMoKTtcblx0XHRcdFx0JHNjb3BlLmNhbGNTdWJSYW5rKCk7XG5cdFx0XHR9KTtcblx0XHRcdCRzY29wZS4kd2F0Y2goJ2N1cnJlbnQnLCBmdW5jdGlvbihuLCBvKSB7XG5cdFx0XHRcdGlmIChuID09PSBvKSB7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cdFx0XHRcdCRzY29wZS5jYWxjU3ViUmFuaygpO1xuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gdG9nZ2xlSW5mbygpIHtcblx0XHRcdCRzY29wZS5pbmZvID0gISRzY29wZS5pbmZvO1xuXHRcdH07XG5cblx0XHRmdW5jdGlvbiBjYWxjU3ViUmFuaygpIHtcblx0XHRcdHZhciByYW5rID0gMDtcblx0XHRcdGFuZ3VsYXIuZm9yRWFjaCgkc2NvcGUuZGF0YSwgZnVuY3Rpb24oaXRlbSkge1xuXHRcdFx0XHRpdGVtWyRzY29wZS5kaXNwbGF5LnNlbGVjdGVkQ2F0LnR5cGVdID0gcGFyc2VGbG9hdChpdGVtWyRzY29wZS5kaXNwbGF5LnNlbGVjdGVkQ2F0LnR5cGVdKTtcblx0XHRcdFx0aXRlbVsnc2NvcmUnXSA9IHBhcnNlSW50KGl0ZW1bJ3Njb3JlJ10pO1xuXHRcdFx0fSlcblx0XHRcdHZhciBmaWx0ZXIgPSAkZmlsdGVyKCdvcmRlckJ5JykoJHNjb3BlLmVwaSwgWyRzY29wZS5kaXNwbGF5LnNlbGVjdGVkQ2F0LnR5cGUsIFwic2NvcmVcIl0sIHRydWUpO1xuXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBmaWx0ZXIubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0aWYgKGZpbHRlcltpXS5pc28gPT0gJHNjb3BlLmN1cnJlbnQuaXNvKSB7XG5cdFx0XHRcdFx0cmFuayA9IGkgKyAxO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHQkc2NvcGUuY3VycmVudFskc2NvcGUuZGlzcGxheS5zZWxlY3RlZENhdC50eXBlKydfcmFuayddID0gcmFuaztcblx0XHR9XG5cdFx0ZnVuY3Rpb24gZ2V0U3ViUmFuayhjb3VudHJ5KXtcblx0XHRcdHZhciBmaWx0ZXIgPSAkZmlsdGVyKCdvcmRlckJ5JykoJHNjb3BlLmVwaSwgWyRzY29wZS5kaXNwbGF5LnNlbGVjdGVkQ2F0LnR5cGUsIFwic2NvcmVcIl0sIHRydWUpO1xuXHRcdFx0dmFyIHJhbmsgPSAwO1xuXHRcdFx0YW5ndWxhci5mb3JFYWNoKGZpbHRlciwgZnVuY3Rpb24oaXRlbSwga2V5KXtcblx0XHRcdFx0aWYoaXRlbS5jb3VudHJ5ID09IGNvdW50cnkuY291bnRyeSl7XG5cdFx0XHRcdFx0cmFuayA9IGtleTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0XHRyZXR1cm4gcmFuaysxO1xuXHRcdH1cblx0XHRmdW5jdGlvbiBjcmVhdGVJbmRleGVyKCkge1xuXHRcdFx0JHNjb3BlLmluZGV4ZXIgPSBbJHNjb3BlLiRwYXJlbnQuZGlzcGxheS5zZWxlY3RlZENhdC5kYXRhXTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBjcmVhdGVPcHRpb25zKCkge1xuXHRcdFx0JHNjb3BlLm1lZGlhbk9wdGlvbnMgPSB7XG5cdFx0XHRcdGNvbG9yOiAkc2NvcGUuJHBhcmVudC5kaXNwbGF5LnNlbGVjdGVkQ2F0LmNvbG9yLFxuXHRcdFx0XHRmaWVsZDogJHNjb3BlLiRwYXJlbnQuZGlzcGxheS5zZWxlY3RlZENhdC50eXBlLFxuXHRcdFx0XHRoYW5kbGluZzogZmFsc2UsXG5cdFx0XHRcdG1hcmdpbjp7XG5cdFx0XHRcdFx0bGVmdDoxMFxuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXHRcdFx0JHNjb3BlLm1lZGlhbk9wdGlvbnNCaWcgPSB7XG5cdFx0XHRcdGNvbG9yOiAkc2NvcGUuJHBhcmVudC5kaXNwbGF5LnNlbGVjdGVkQ2F0LmNvbG9yLFxuXHRcdFx0XHRmaWVsZDogJHNjb3BlLiRwYXJlbnQuZGlzcGxheS5zZWxlY3RlZENhdC50eXBlLFxuXHRcdFx0XHRoYW5kbGluZzogZmFsc2UsXG5cdFx0XHRcdG1hcmdpbjp7XG5cdFx0XHRcdFx0bGVmdDoyMFxuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIHNldENoYXJ0KCkge1xuXHRcdFx0JHNjb3BlLmNoYXJ0ID0ge1xuXHRcdFx0XHRvcHRpb25zOiB7XG5cdFx0XHRcdFx0Y2hhcnQ6IHtcblx0XHRcdFx0XHRcdHR5cGU6ICdsaW5lQ2hhcnQnLFxuXHRcdFx0XHRcdFx0Ly9oZWlnaHQ6IDIwMCxcblx0XHRcdFx0XHRcdGxlZ2VuZFBvc2l0aW9uOiAnbGVmdCcsXG5cdFx0XHRcdFx0XHRtYXJnaW46IHtcblx0XHRcdFx0XHRcdFx0dG9wOiAyMCxcblx0XHRcdFx0XHRcdFx0cmlnaHQ6IDIwLFxuXHRcdFx0XHRcdFx0XHRib3R0b206IDIwLFxuXHRcdFx0XHRcdFx0XHRsZWZ0OiAyMFxuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdHg6IGZ1bmN0aW9uKGQpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGQueDtcblx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHR5OiBmdW5jdGlvbihkKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBkLnk7XG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0c2hvd1ZhbHVlczogZmFsc2UsXG5cdFx0XHRcdFx0XHRzaG93WUF4aXM6IGZhbHNlLFxuXHRcdFx0XHRcdFx0dHJhbnNpdGlvbkR1cmF0aW9uOiA1MDAsXG5cdFx0XHRcdFx0XHR1c2VJbnRlcmFjdGl2ZUd1aWRlbGluZTogdHJ1ZSxcblx0XHRcdFx0XHRcdGZvcmNlWTogWzEwMCwgMF0sXG5cdFx0XHRcdFx0XHR4QXhpczoge1xuXHRcdFx0XHRcdFx0XHRheGlzTGFiZWw6ICcnXG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0eUF4aXM6IHtcblx0XHRcdFx0XHRcdFx0YXhpc0xhYmVsOiAnJyxcblx0XHRcdFx0XHRcdFx0YXhpc0xhYmVsRGlzdGFuY2U6IDMwXG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0bGVnZW5kOiB7XG5cdFx0XHRcdFx0XHRcdHJpZ2h0QWxpZ246IGZhbHNlLFxuXHRcdFx0XHRcdFx0XHRtYXJnaW46IHtcblx0XHRcdFx0XHRcdFx0XHRib3R0b206IDMwXG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRsaW5lczoge1xuXHRcdFx0XHRcdFx0XHRpbnRlcnBvbGF0ZTogJ2NhcmRpbmFsJ1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSxcblx0XHRcdFx0ZGF0YTogW11cblx0XHRcdH07XG5cdFx0XHRyZXR1cm4gJHNjb3BlLmNoYXJ0O1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGNhbGN1bGF0ZUdyYXBoKCkge1xuXHRcdFx0dmFyIGNoYXJ0RGF0YSA9IFtdO1xuXHRcdFx0YW5ndWxhci5mb3JFYWNoKCRzY29wZS5kaXNwbGF5LnNlbGVjdGVkQ2F0LmNoaWxkcmVuLCBmdW5jdGlvbihpdGVtLCBrZXkpIHtcblx0XHRcdFx0dmFyIGdyYXBoID0ge1xuXHRcdFx0XHRcdGtleTogaXRlbS50aXRsZSxcblx0XHRcdFx0XHRjb2xvcjogaXRlbS5jb2xvcixcblx0XHRcdFx0XHR2YWx1ZXM6IFtdXG5cdFx0XHRcdH07XG5cdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaCgkc2NvcGUuY291bnRyeS5lcGksIGZ1bmN0aW9uKGRhdGEpIHtcblx0XHRcdFx0XHRncmFwaC52YWx1ZXMucHVzaCh7XG5cdFx0XHRcdFx0XHR4OiBkYXRhLnllYXIsXG5cdFx0XHRcdFx0XHR5OiBkYXRhW2l0ZW0uY29sdW1uX25hbWVdXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRjaGFydERhdGEucHVzaChncmFwaCk7XG5cdFx0XHR9KTtcblx0XHRcdCRzY29wZS5jaGFydC5kYXRhID0gY2hhcnREYXRhO1xuXHRcdH1cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmRpcmVjdGl2ZXMnKS5kaXJlY3RpdmUoJ3N1bmJ1cnN0JywgZnVuY3Rpb24gKCkge1xuXHRcdHZhciBkZWZhdWx0cyA9IGZ1bmN0aW9uKCl7XG5cdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0IG1vZGU6ICdzaXplJ1xuXHRcdFx0XHR9XG5cdFx0fTtcblx0XHRyZXR1cm4ge1xuXHRcdFx0cmVzdHJpY3Q6ICdFJyxcblx0XHRcdC8vdGVtcGxhdGVVcmw6ICd2aWV3cy9kaXJlY3RpdmVzL3N1bmJ1cnN0L3N1bmJ1cnN0Lmh0bWwnLFxuXHRcdFx0Y29udHJvbGxlcjogJ1N1bmJ1cnN0Q3RybCcsXG5cdFx0XHRzY29wZToge1xuXHRcdFx0XHRkYXRhOiAnPSdcblx0XHRcdH0sXG5cdFx0XHRsaW5rOiBmdW5jdGlvbiAoJHNjb3BlLCBlbGVtZW50LCAkYXR0cnMpIHtcblx0XHRcdFx0dmFyIG9wdGlvbnMgPSBhbmd1bGFyLmV4dGVuZChkZWZhdWx0cygpLCAkYXR0cnMpO1xuXHRcdFx0XHQkc2NvcGUuc2V0Q2hhcnQoKTtcblx0XHRcdFx0JHNjb3BlLmNhbGN1bGF0ZUdyYXBoKCk7XG5cdFx0XHRcdHZhciB3aWR0aCA9IDYxMCxcblx0XHRcdFx0XHRoZWlnaHQgPSB3aWR0aCxcblx0XHRcdFx0XHRyYWRpdXMgPSAod2lkdGgpIC8gMixcblx0XHRcdFx0XHR4ID0gZDMuc2NhbGUubGluZWFyKCkucmFuZ2UoWzAsIDIgKiBNYXRoLlBJXSksXG5cdFx0XHRcdFx0eSA9IGQzLnNjYWxlLnBvdygpLmV4cG9uZW50KDEuMykuZG9tYWluKFswLCAxXSkucmFuZ2UoWzAsIHJhZGl1c10pLFxuXHRcdFx0XHRcdC8vfiB5ID0gZDMuc2NhbGUucG93KCkuZXhwb25lbnQoMS4zKS5kb21haW4oWzAsIDAuMjUsIDFdKS5yYW5nZShbMCwgMzAsIHJhZGl1c10pLFxuXHRcdFx0XHRcdC8vfiB5ID0gZDMuc2NhbGUubGluZWFyKCkuZG9tYWluKFswLCAwLjI1LCAwLjUsIDAuNzUsIDFdKS5yYW5nZShbMCwgMzAsIDExNSwgMjAwLCByYWRpdXNdKSxcblx0XHRcdFx0XHRwYWRkaW5nID0gMCxcblx0XHRcdFx0XHRkdXJhdGlvbiA9IDEwMDAsXG5cdFx0XHRcdFx0Y2lyY1BhZGRpbmcgPSAxMDtcblxuXHRcdFx0XHR2YXIgZGl2ID0gZDMuc2VsZWN0KGVsZW1lbnRbMF0pO1xuXG5cblx0XHRcdFx0dmFyIHZpcyA9IGRpdi5hcHBlbmQoXCJzdmdcIilcblx0XHRcdFx0XHQuYXR0cihcIndpZHRoXCIsIHdpZHRoICsgcGFkZGluZyAqIDIpXG5cdFx0XHRcdFx0LmF0dHIoXCJoZWlnaHRcIiwgaGVpZ2h0ICsgcGFkZGluZyAqIDIpXG5cdFx0XHRcdFx0LmFwcGVuZChcImdcIilcblx0XHRcdFx0XHQuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIiArIFtyYWRpdXMgKyBwYWRkaW5nLCByYWRpdXMgKyBwYWRkaW5nXSArIFwiKVwiKTtcblxuXHRcdFx0XHQvKlxuXHRcdFx0XHRkaXYuYXBwZW5kKFwicFwiKVxuXHRcdFx0XHRcdFx0LmF0dHIoXCJpZFwiLCBcImludHJvXCIpXG5cdFx0XHRcdFx0XHQudGV4dChcIkNsaWNrIHRvIHpvb20hXCIpO1xuXHRcdFx0XHQqL1xuXG5cdFx0XHRcdHZhciBwYXJ0aXRpb24gPSBkMy5sYXlvdXQucGFydGl0aW9uKClcblx0XHRcdFx0XHQuc29ydChudWxsKVxuXHRcdFx0XHRcdC52YWx1ZShmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIDE7XG5cdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0dmFyIGFyYyA9IGQzLnN2Zy5hcmMoKVxuXHRcdFx0XHRcdC5zdGFydEFuZ2xlKGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gTWF0aC5tYXgoMCwgTWF0aC5taW4oMiAqIE1hdGguUEksIHgoZC54KSkpO1xuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0LmVuZEFuZ2xlKGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gTWF0aC5tYXgoMCwgTWF0aC5taW4oMiAqIE1hdGguUEksIHgoZC54ICsgZC5keCkpKTtcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC5pbm5lclJhZGl1cyhmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIE1hdGgubWF4KDAsIGQueSA/IHkoZC55KSA6IGQueSk7XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQub3V0ZXJSYWRpdXMoZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdHJldHVybiBNYXRoLm1heCgwLCB5KGQueSArIGQuZHkpKTtcblx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHR2YXIgc3BlY2lhbDEgPSBcIldhc3Rld2F0ZXIgVHJlYXRtZW50XCIsXG5cdFx0XHRcdFx0c3BlY2lhbDIgPSBcIkFpciBQb2xsdXRpb24gUE0yLjUgRXhjZWVkYW5jZVwiLFxuXHRcdFx0XHRcdHNwZWNpYWwzID0gXCJBZ3JpY3VsdHVyYWwgU3Vic2lkaWVzXCIsXG5cdFx0XHRcdFx0c3BlY2lhbDQgPSBcIlBlc3RpY2lkZSBSZWd1bGF0aW9uXCI7XG5cblxuXHRcdFx0XHR2YXIgbm9kZXMgPSBwYXJ0aXRpb24ubm9kZXMoJHNjb3BlLmNhbGN1bGF0ZUdyYXBoKCkpO1xuXG5cdFx0XHRcdHZhciBwYXRoID0gdmlzLnNlbGVjdEFsbChcInBhdGhcIikuZGF0YShub2Rlcyk7XG5cdFx0XHRcdHBhdGguZW50ZXIoKS5hcHBlbmQoXCJwYXRoXCIpXG5cdFx0XHRcdFx0LmF0dHIoXCJpZFwiLCBmdW5jdGlvbiAoZCwgaSkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIFwicGF0aC1cIiArIGk7XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQuYXR0cihcImRcIiwgYXJjKVxuXHRcdFx0XHRcdC5hdHRyKFwiZmlsbC1ydWxlXCIsIFwiZXZlbm9kZFwiKVxuXHRcdFx0XHRcdC5hdHRyKFwiY2xhc3NcIiwgZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdHJldHVybiBkLmRlcHRoID8gXCJicmFuY2hcIiA6IFwicm9vdFwiO1xuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0LnN0eWxlKFwiZmlsbFwiLCBzZXRDb2xvcilcblx0XHRcdFx0XHQub24oXCJjbGlja1wiLCBjbGljayk7XG5cblx0XHRcdFx0dmFyIHRleHQgPSB2aXMuc2VsZWN0QWxsKFwidGV4dFwiKS5kYXRhKG5vZGVzKTtcblx0XHRcdFx0dmFyIHRleHRFbnRlciA9IHRleHQuZW50ZXIoKS5hcHBlbmQoXCJ0ZXh0XCIpXG5cdFx0XHRcdFx0LnN0eWxlKFwiZmlsbC1vcGFjaXR5XCIsIDEpXG5cdFx0XHRcdFx0LmF0dHIoXCJ0ZXh0LWFuY2hvclwiLCBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0aWYgKGQuZGVwdGgpXG5cdFx0XHRcdFx0XHRcdHJldHVybiBcIm1pZGRsZVwiO1xuXHRcdFx0XHRcdFx0Ly9+IHJldHVybiB4KGQueCArIGQuZHggLyAyKSA+IE1hdGguUEkgPyBcImVuZFwiIDogXCJzdGFydFwiO1xuXHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gXCJtaWRkbGVcIjtcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC5hdHRyKFwiaWRcIiwgZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdHJldHVybiBcImRlcHRoXCIgKyBkLmRlcHRoO1xuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0LmF0dHIoXCJjbGFzc1wiLCBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIFwic2VjdG9yXCJcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC5hdHRyKFwiZHlcIiwgZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdHJldHVybiBkLmRlcHRoID8gXCIuMmVtXCIgOiBcIjAuMzVlbVwiO1xuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0LmF0dHIoXCJ0cmFuc2Zvcm1cIiwgZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdHZhciBtdWx0aWxpbmUgPSAoZC5uYW1lIHx8IFwiXCIpLnNwbGl0KFwiIFwiKS5sZW5ndGggPiAyLFxuXHRcdFx0XHRcdFx0XHRhbmdsZUFsaWduID0gKGQueCA+IDAuNSA/IDIgOiAtMiksXG5cdFx0XHRcdFx0XHRcdGFuZ2xlID0geChkLnggKyBkLmR4IC8gMikgKiAxODAgLyBNYXRoLlBJIC0gOTAgKyAobXVsdGlsaW5lID8gYW5nbGVBbGlnbiA6IDApLFxuXHRcdFx0XHRcdFx0XHRyb3RhdGUgPSBhbmdsZSArIChtdWx0aWxpbmUgPyAtLjUgOiAwKSxcblx0XHRcdFx0XHRcdFx0dHJhbnNsID0gKHkoZC55KSArIGNpcmNQYWRkaW5nKSArIDM1LFxuXHRcdFx0XHRcdFx0XHRzZWNBbmdsZSA9IChhbmdsZSA+IDkwID8gLTE4MCA6IDApO1xuXHRcdFx0XHRcdFx0aWYgKGQubmFtZSA9PSBzcGVjaWFsMyB8fCBkLm5hbWUgPT0gc3BlY2lhbDQpIHJvdGF0ZSArPSAxO1xuXHRcdFx0XHRcdFx0aWYgKGQuZGVwdGggPT0gMCkge1xuXHRcdFx0XHRcdFx0XHR0cmFuc2wgPSAtMi41MDtcblx0XHRcdFx0XHRcdFx0cm90YXRlID0gMDtcblx0XHRcdFx0XHRcdFx0c2VjQW5nbGUgPSAwO1xuXHRcdFx0XHRcdFx0fSBlbHNlIGlmIChkLmRlcHRoID09IDEpIHRyYW5zbCArPSAtOTtcblx0XHRcdFx0XHRcdGVsc2UgaWYgKGQuZGVwdGggPT0gMikgdHJhbnNsICs9IC01O1xuXHRcdFx0XHRcdFx0ZWxzZSBpZiAoZC5kZXB0aCA9PSAzKSB0cmFuc2wgKz0gNDtcblx0XHRcdFx0XHRcdHJldHVybiBcInJvdGF0ZShcIiArIHJvdGF0ZSArIFwiKXRyYW5zbGF0ZShcIiArIHRyYW5zbCArIFwiKXJvdGF0ZShcIiArIHNlY0FuZ2xlICsgXCIpXCI7XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQub24oXCJjbGlja1wiLCBjbGljayk7XG5cblx0XHRcdFx0Ly8gQWRkIGxhYmVscy4gVmVyeSB1Z2x5IGNvZGUgdG8gc3BsaXQgc2VudGVuY2VzIGludG8gbGluZXMuIENhbiBvbmx5IG1ha2Vcblx0XHRcdFx0Ly8gY29kZSBiZXR0ZXIgaWYgZmluZCBhIHdheSB0byB1c2UgZCBvdXRzaWRlIGNhbGxzIHN1Y2ggYXMgLnRleHQoZnVuY3Rpb24oZCkpXG5cblx0XHRcdFx0Ly8gVGhpcyBibG9jayByZXBsYWNlcyB0aGUgdHdvIGJsb2NrcyBhcnJvdW5kIGl0LiBJdCBpcyAndXNlZnVsJyBiZWNhdXNlIGl0XG5cdFx0XHRcdC8vIHVzZXMgZm9yZWlnbk9iamVjdCwgc28gdGhhdCB0ZXh0IHdpbGwgd3JhcCBhcm91bmQgbGlrZSBpbiByZWd1bGFyIEhUTUwuIEkgdHJpZWRcblx0XHRcdFx0Ly8gdG8gZ2V0IGl0IHRvIHdvcmssIGJ1dCBpdCBvbmx5IGludHJvZHVjZWQgbW9yZSBidWdzLiBVbmZvcnR1bmF0ZWx5LCB0aGVcblx0XHRcdFx0Ly8gdWdseSBzb2x1dGlvbiAoaGFyZCBjb2RlZCBsaW5lIHNwbGljaW5nKSB3b24uXG5cdFx0XHRcdC8vfiB2YXIgdGV4dEVudGVyID0gdGV4dC5lbnRlcigpLmFwcGVuZChcImZvcmVpZ25PYmplY3RcIilcblx0XHRcdFx0Ly9+IC5hdHRyKFwieFwiLDApXG5cdFx0XHRcdC8vfiAuYXR0cihcInlcIiwtMjApXG5cdFx0XHRcdC8vfiAuYXR0cihcImhlaWdodFwiLCAxMDApXG5cdFx0XHRcdC8vfiAuYXR0cihcIndpZHRoXCIsIGZ1bmN0aW9uKGQpeyByZXR1cm4gKHkoZC5keSkgKzUwKTsgfSlcblx0XHRcdFx0Ly9+IC5hdHRyKFwidHJhbnNmb3JtXCIsIGZ1bmN0aW9uKGQpIHtcblx0XHRcdFx0Ly9+IHZhciBhbmdsZUFsaWduID0gKGQueCA+IDAuNSA/IDIgOiAtMiksXG5cdFx0XHRcdC8vfiBhbmdsZSA9IHgoZC54ICsgZC5keCAvIDIpICogMTgwIC8gTWF0aC5QSSAtIDkwLFxuXHRcdFx0XHQvL34gdHJhbnNsID0gKHkoZC55KSArIGNpcmNQYWRkaW5nKTtcblx0XHRcdFx0Ly9+IGQucm90ID0gYW5nbGU7XG5cdFx0XHRcdC8vfiBpZiAoIWQuZGVwdGgpIHRyYW5zbCA9IC01MDtcblx0XHRcdFx0Ly9+IGlmIChhbmdsZSA+IDkwKSB0cmFuc2wgKz0gMTIwO1xuXHRcdFx0XHQvL34gaWYgKGQuZGVwdGgpXG5cdFx0XHRcdC8vfiByZXR1cm4gXCJyb3RhdGUoXCIgKyBhbmdsZSArIFwiKXRyYW5zbGF0ZShcIiArIHRyYW5zbCArIFwiKXJvdGF0ZShcIiArIChhbmdsZSA+IDkwID8gLTE4MCA6IDApICsgXCIpXCI7XG5cdFx0XHRcdC8vfiBlbHNlXG5cdFx0XHRcdC8vfiByZXR1cm4gXCJ0cmFuc2xhdGUoXCIgKyB0cmFuc2wgKyBcIilcIjtcblx0XHRcdFx0Ly9+IH0pXG5cdFx0XHRcdC8vfiAuYXBwZW5kKFwieGh0bWw6Ym9keVwiKVxuXHRcdFx0XHQvL34gLnN0eWxlKFwiYmFja2dyb3VuZFwiLCBcIm5vbmVcIilcblx0XHRcdFx0Ly9+IC5zdHlsZShcInRleHQtYWxpZ25cIiwgZnVuY3Rpb24oZCl7IHJldHVybiAoZC5yb3QgPiA5MCA/IFwibGVmdFwiIDogXCJyaWdodFwiKX0pXG5cdFx0XHRcdC8vfiAuaHRtbChmdW5jdGlvbihkKXsgcmV0dXJuICc8ZGl2IGNsYXNzPScgK1wiZGVwdGhcIiArIGQuZGVwdGggKycgc3R5bGU9XFxcIndpZHRoOiAnICsoeShkLmR5KSArNTApICsncHg7JyArXCJ0ZXh0LWFsaWduOiBcIiArIChkLnJvdCA+IDkwID8gXCJyaWdodFwiIDogXCJsZWZ0XCIpICsnXCI+JyArZC5uYW1lICsnPC9kaXY+Jzt9KVxuXG5cdFx0XHRcdHRleHRFbnRlci5hcHBlbmQoXCJ0c3BhblwiKVxuXHRcdFx0XHRcdC5hdHRyKFwieFwiLCAwKVxuXHRcdFx0XHRcdC50ZXh0KGZ1bmN0aW9uIChkKSB7XG5cblx0XHRcdFx0XHRcdGlmIChkLmRlcHRoID09IDMgJiYgZC5uYW1lICE9IHNwZWNpYWwxICYmIGQubmFtZSAhPSBzcGVjaWFsMiAmJiBkLm5hbWUgIT0gc3BlY2lhbDMgJiYgZC5uYW1lICE9IHNwZWNpYWw0KVxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gZC5uYW1lLnNwbGl0KFwiIFwiKVswXSArIFwiIFwiICsgKGQubmFtZS5zcGxpdChcIiBcIilbMV0gfHwgXCJcIik7XG5cdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdHJldHVybiBkLm5hbWUuc3BsaXQoXCIgXCIpWzBdO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR0ZXh0RW50ZXIuYXBwZW5kKFwidHNwYW5cIilcblx0XHRcdFx0XHQuYXR0cihcInhcIiwgMClcblx0XHRcdFx0XHQuYXR0cihcImR5XCIsIFwiMWVtXCIpXG5cdFx0XHRcdFx0LnRleHQoZnVuY3Rpb24gKGQpIHtcblxuXHRcdFx0XHRcdFx0aWYgKGQuZGVwdGggPT0gMyAmJiBkLm5hbWUgIT0gc3BlY2lhbDEgJiYgZC5uYW1lICE9IHNwZWNpYWwyICYmIGQubmFtZSAhPSBzcGVjaWFsMyAmJiBkLm5hbWUgIT0gc3BlY2lhbDQpXG5cdFx0XHRcdFx0XHRcdHJldHVybiAoZC5uYW1lLnNwbGl0KFwiIFwiKVsyXSB8fCBcIlwiKSArIFwiIFwiICsgKGQubmFtZS5zcGxpdChcIiBcIilbM10gfHwgXCJcIik7XG5cdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdHJldHVybiAoZC5uYW1lLnNwbGl0KFwiIFwiKVsxXSB8fCBcIlwiKSArIFwiIFwiICsgKGQubmFtZS5zcGxpdChcIiBcIilbMl0gfHwgXCJcIik7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdHRleHRFbnRlci5hcHBlbmQoXCJ0c3BhblwiKVxuXHRcdFx0XHRcdC5hdHRyKFwieFwiLCAwKVxuXHRcdFx0XHRcdC5hdHRyKFwiZHlcIiwgXCIxZW1cIilcblx0XHRcdFx0XHQudGV4dChmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0aWYgKGQuZGVwdGggPT0gMyAmJiBkLm5hbWUgIT0gc3BlY2lhbDEgJiYgZC5uYW1lICE9IHNwZWNpYWwyICYmIGQubmFtZSAhPSBzcGVjaWFsMyAmJiBkLm5hbWUgIT0gc3BlY2lhbDQpXG5cdFx0XHRcdFx0XHRcdHJldHVybiAoZC5uYW1lLnNwbGl0KFwiIFwiKVs0XSB8fCBcIlwiKSArIFwiIFwiICsgKGQubmFtZS5zcGxpdChcIiBcIilbNV0gfHwgXCJcIik7XG5cdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdHJldHVybiAoZC5uYW1lLnNwbGl0KFwiIFwiKVszXSB8fCBcIlwiKSArIFwiIFwiICsgKGQubmFtZS5zcGxpdChcIiBcIilbNF0gfHwgXCJcIik7O1xuXHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdGZ1bmN0aW9uIGNsaWNrKGQpIHtcblx0XHRcdFx0XHQvLyBDb250cm9sIGFyYyB0cmFuc2l0aW9uXG5cdFx0XHRcdFx0cGF0aC50cmFuc2l0aW9uKClcblx0XHRcdFx0XHRcdC5kdXJhdGlvbihkdXJhdGlvbilcblx0XHRcdFx0XHRcdC5hdHRyVHdlZW4oXCJkXCIsIGFyY1R3ZWVuKGQpKTtcblxuXHRcdFx0XHRcdC8vIFNvbWV3aGF0IG9mIGEgaGFjayBhcyB3ZSByZWx5IG9uIGFyY1R3ZWVuIHVwZGF0aW5nIHRoZSBzY2FsZXMuXG5cdFx0XHRcdFx0Ly8gQ29udHJvbCB0aGUgdGV4dCB0cmFuc2l0aW9uXG5cdFx0XHRcdFx0dGV4dC5zdHlsZShcInZpc2liaWxpdHlcIiwgZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGlzUGFyZW50T2YoZCwgZSkgPyBudWxsIDogZDMuc2VsZWN0KHRoaXMpLnN0eWxlKFwidmlzaWJpbGl0eVwiKTtcblx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0XHQudHJhbnNpdGlvbigpXG5cdFx0XHRcdFx0XHQuZHVyYXRpb24oZHVyYXRpb24pXG5cdFx0XHRcdFx0XHQuYXR0clR3ZWVuKFwidGV4dC1hbmNob3JcIiwgZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdFx0XHRpZiAoZC5kZXB0aClcblx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiBcIm1pZGRsZVwiO1xuXHRcdFx0XHRcdFx0XHRcdC8vfiByZXR1cm4geChkLnggKyBkLmR4IC8gMikgPiBNYXRoLlBJID8gXCJlbmRcIiA6IFwic3RhcnRcIjtcblx0XHRcdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gXCJtaWRkbGVcIjtcblx0XHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0XHQuYXR0clR3ZWVuKFwidHJhbnNmb3JtXCIsIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRcdHZhciBtdWx0aWxpbmUgPSAoZC5uYW1lIHx8IFwiXCIpLnNwbGl0KFwiIFwiKS5sZW5ndGggPiAyO1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0XHRcdHZhciBtdWx0aWxpbmUgPSAoZC5uYW1lIHx8IFwiXCIpLnNwbGl0KFwiIFwiKS5sZW5ndGggPiAyLFxuXHRcdFx0XHRcdFx0XHRcdFx0YW5nbGVBbGlnbiA9IChkLnggPiAwLjUgPyAyIDogLTIpLFxuXHRcdFx0XHRcdFx0XHRcdFx0YW5nbGUgPSB4KGQueCArIGQuZHggLyAyKSAqIDE4MCAvIE1hdGguUEkgLSA5MCArIChtdWx0aWxpbmUgPyBhbmdsZUFsaWduIDogMCksXG5cdFx0XHRcdFx0XHRcdFx0XHRyb3RhdGUgPSBhbmdsZSArIChtdWx0aWxpbmUgPyAtLjUgOiAwKSxcblx0XHRcdFx0XHRcdFx0XHRcdHRyYW5zbCA9ICh5KGQueSkgKyBjaXJjUGFkZGluZykgKyAzNSxcblx0XHRcdFx0XHRcdFx0XHRcdHNlY0FuZ2xlID0gKGFuZ2xlID4gOTAgPyAtMTgwIDogMCk7XG5cdFx0XHRcdFx0XHRcdFx0aWYgKGQubmFtZSA9PSBzcGVjaWFsMyB8fCBkLm5hbWUgPT0gc3BlY2lhbDQpIHJvdGF0ZSArPSAxO1xuXHRcdFx0XHRcdFx0XHRcdGlmIChkLmRlcHRoID09IDApIHtcblx0XHRcdFx0XHRcdFx0XHRcdHRyYW5zbCA9IC0yLjUwO1xuXHRcdFx0XHRcdFx0XHRcdFx0cm90YXRlID0gMDtcblx0XHRcdFx0XHRcdFx0XHRcdHNlY0FuZ2xlID0gMDtcblx0XHRcdFx0XHRcdFx0XHR9IGVsc2UgaWYgKGQuZGVwdGggPT0gMSkgdHJhbnNsICs9IC05O1xuXHRcdFx0XHRcdFx0XHRcdGVsc2UgaWYgKGQuZGVwdGggPT0gMikgdHJhbnNsICs9IC01O1xuXHRcdFx0XHRcdFx0XHRcdGVsc2UgaWYgKGQuZGVwdGggPT0gMykgdHJhbnNsICs9IDQ7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIFwicm90YXRlKFwiICsgcm90YXRlICsgXCIpdHJhbnNsYXRlKFwiICsgdHJhbnNsICsgXCIpcm90YXRlKFwiICsgc2VjQW5nbGUgKyBcIilcIjtcblx0XHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0XHQuc3R5bGUoXCJmaWxsLW9wYWNpdHlcIiwgZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGlzUGFyZW50T2YoZCwgZSkgPyAxIDogMWUtNjtcblx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0XHQuZWFjaChcImVuZFwiLCBmdW5jdGlvbiAoZSkge1xuXHRcdFx0XHRcdFx0XHRkMy5zZWxlY3QodGhpcykuc3R5bGUoXCJ2aXNpYmlsaXR5XCIsIGlzUGFyZW50T2YoZCwgZSkgPyBudWxsIDogXCJoaWRkZW5cIik7XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXG5cblx0XHRcdFx0ZnVuY3Rpb24gaXNQYXJlbnRPZihwLCBjKSB7XG5cdFx0XHRcdFx0aWYgKHAgPT09IGMpIHJldHVybiB0cnVlO1xuXHRcdFx0XHRcdGlmIChwLmNoaWxkcmVuKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gcC5jaGlsZHJlbi5zb21lKGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBpc1BhcmVudE9mKGQsIGMpO1xuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGZ1bmN0aW9uIHNldENvbG9yKGQpIHtcblx0XHRcdFx0XHRyZXR1cm4gZC5jb2xvcjtcblx0XHRcdFx0XHRpZiAoZC5jb2xvcilcblx0XHRcdFx0XHRcdHJldHVybiBkLmNvbG9yO1xuXHRcdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdFx0dmFyIHRpbnREZWNheSA9IDAuMjA7XG5cdFx0XHRcdFx0XHQvLyBGaW5kIGNoaWxkIG51bWJlclxuXHRcdFx0XHRcdFx0dmFyIHggPSAwO1xuXHRcdFx0XHRcdFx0d2hpbGUgKGQucGFyZW50LmNoaWxkcmVuW3hdICE9IGQpXG5cdFx0XHRcdFx0XHRcdHgrKztcblx0XHRcdFx0XHRcdHZhciB0aW50Q2hhbmdlID0gKHRpbnREZWNheSAqICh4ICsgMSkpLnRvU3RyaW5nKCk7XG5cdFx0XHRcdFx0XHRyZXR1cm4gcHVzaGVyLmNvbG9yKGQucGFyZW50LmNvbG9yKS50aW50KHRpbnRDaGFuZ2UpLmh0bWwoJ2hleDYnKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBJbnRlcnBvbGF0ZSB0aGUgc2NhbGVzIVxuXHRcdFx0XHRmdW5jdGlvbiBhcmNUd2VlbihkKSB7XG5cdFx0XHRcdFx0dmFyIG15ID0gbWF4WShkKSxcblx0XHRcdFx0XHRcdHhkID0gZDMuaW50ZXJwb2xhdGUoeC5kb21haW4oKSwgW2QueCwgZC54ICsgZC5keCAtIDAuMDAwOV0pLFxuXHRcdFx0XHRcdFx0eWQgPSBkMy5pbnRlcnBvbGF0ZSh5LmRvbWFpbigpLCBbZC55LCBteV0pLFxuXHRcdFx0XHRcdFx0eXIgPSBkMy5pbnRlcnBvbGF0ZSh5LnJhbmdlKCksIFtkLnkgPyAyMCA6IDAsIHJhZGl1c10pO1xuXG5cdFx0XHRcdFx0cmV0dXJuIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZnVuY3Rpb24gKHQpIHtcblx0XHRcdFx0XHRcdFx0eC5kb21haW4oeGQodCkpO1xuXHRcdFx0XHRcdFx0XHR5LmRvbWFpbih5ZCh0KSkucmFuZ2UoeXIodCkpO1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gYXJjKGQpO1xuXHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHR9O1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0ZnVuY3Rpb24gbWF4WShkKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGQuY2hpbGRyZW4gPyBNYXRoLm1heC5hcHBseShNYXRoLCBkLmNoaWxkcmVuLm1hcChtYXhZKSkgOiBkLnkgKyBkLmR5O1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9KTtcbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignU3VuYnVyc3RDdHJsJywgZnVuY3Rpb24gKCRzY29wZSkge1xuXG5cdFx0JHNjb3BlLnNldENoYXJ0ID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0JHNjb3BlLmNoYXJ0ID0ge1xuXHRcdFx0XHRvcHRpb25zOiB7XG5cdFx0XHRcdFx0Y2hhcnQ6IHtcblx0XHRcdFx0XHRcdHR5cGU6ICdzdW5idXJzdCcsXG5cdFx0XHRcdFx0XHRoZWlnaHQ6IDcwMCxcblx0XHRcdFx0XHRcdFwic3VuYnVyc3RcIjoge1xuXHRcdFx0XHRcdFx0XHRcImRpc3BhdGNoXCI6IHt9LFxuXHRcdFx0XHRcdFx0XHRcIndpZHRoXCI6IG51bGwsXG5cdFx0XHRcdFx0XHRcdFwiaGVpZ2h0XCI6IG51bGwsXG5cdFx0XHRcdFx0XHRcdFwibW9kZVwiOiBcInNpemVcIixcblx0XHRcdFx0XHRcdFx0XCJpZFwiOiAyMDg4LFxuXHRcdFx0XHRcdFx0XHRcImR1cmF0aW9uXCI6IDUwMCxcblx0XHRcdFx0XHRcdFx0XCJtYXJnaW5cIjoge1xuXHRcdFx0XHRcdFx0XHRcdFwidG9wXCI6IDAsXG5cdFx0XHRcdFx0XHRcdFx0XCJyaWdodFwiOiAwLFxuXHRcdFx0XHRcdFx0XHRcdFwiYm90dG9tXCI6IDAsXG5cdFx0XHRcdFx0XHRcdFx0XCJsZWZ0XCI6IDBcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdFwidG9vbHRpcFwiOiB7XG5cdFx0XHRcdFx0XHRcdFwiZHVyYXRpb25cIjogMCxcblx0XHRcdFx0XHRcdFx0XCJncmF2aXR5XCI6IFwid1wiLFxuXHRcdFx0XHRcdFx0XHRcImRpc3RhbmNlXCI6IDI1LFxuXHRcdFx0XHRcdFx0XHRcInNuYXBEaXN0YW5jZVwiOiAwLFxuXHRcdFx0XHRcdFx0XHRcImNsYXNzZXNcIjogbnVsbCxcblx0XHRcdFx0XHRcdFx0XCJjaGFydENvbnRhaW5lclwiOiBudWxsLFxuXHRcdFx0XHRcdFx0XHRcImZpeGVkVG9wXCI6IG51bGwsXG5cdFx0XHRcdFx0XHRcdFwiZW5hYmxlZFwiOiB0cnVlLFxuXHRcdFx0XHRcdFx0XHRcImhpZGVEZWxheVwiOiA0MDAsXG5cdFx0XHRcdFx0XHRcdFwiaGVhZGVyRW5hYmxlZFwiOiBmYWxzZSxcblxuXHRcdFx0XHRcdFx0XHRcIm9mZnNldFwiOiB7XG5cdFx0XHRcdFx0XHRcdFx0XCJsZWZ0XCI6IDAsXG5cdFx0XHRcdFx0XHRcdFx0XCJ0b3BcIjogMFxuXHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHRcImhpZGRlblwiOiB0cnVlLFxuXHRcdFx0XHRcdFx0XHRcImRhdGFcIjogbnVsbCxcblx0XHRcdFx0XHRcdFx0XCJ0b29sdGlwRWxlbVwiOiBudWxsLFxuXHRcdFx0XHRcdFx0XHRcImlkXCI6IFwibnZ0b29sdGlwLTk5MzQ3XCJcblx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRkYXRhOiBbXVxuXHRcdFx0fTtcblx0XHRcdHJldHVybiAkc2NvcGUuY2hhcnQ7XG5cdFx0fVxuXHRcdHZhciBidWlsZFRyZWUgPSBmdW5jdGlvbiAoZGF0YSkge1xuXHRcdFx0dmFyIGNoaWxkcmVuID0gW107XG5cdFx0XHRhbmd1bGFyLmZvckVhY2goZGF0YSwgZnVuY3Rpb24gKGl0ZW0pIHtcblx0XHRcdFx0dmFyIGNoaWxkID0ge1xuXHRcdFx0XHRcdCduYW1lJzogaXRlbS50aXRsZSxcblx0XHRcdFx0XHQnc2l6ZSc6IGl0ZW0uc2l6ZSxcblx0XHRcdFx0XHQnY29sb3InOiBpdGVtLmNvbG9yLFxuXHRcdFx0XHRcdCdjaGlsZHJlbic6IGJ1aWxkVHJlZShpdGVtLmNoaWxkcmVuKVxuXHRcdFx0XHR9O1xuXHRcdFx0XHRpZihpdGVtLmNvbG9yKXtcblx0XHRcdFx0XHRjaGlsZC5jb2xvciA9IGl0ZW0uY29sb3Jcblx0XHRcdFx0fVxuXHRcdFx0XHRpZihpdGVtLnNpemUpe1xuXHRcdFx0XHRcdGNoaWxkLnNpemUgPSBpdGVtLnNpemVcblx0XHRcdFx0fVxuXHRcdFx0XHRjaGlsZHJlbi5wdXNoKGNoaWxkKTtcblx0XHRcdH0pO1xuXHRcdFx0cmV0dXJuIGNoaWxkcmVuO1xuXHRcdH07XG5cdFx0JHNjb3BlLmNhbGN1bGF0ZUdyYXBoID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0dmFyIGNoYXJ0RGF0YSA9IHtcblx0XHRcdFx0XCJuYW1lXCI6ICRzY29wZS5kYXRhLnRpdGxlLFxuXHRcdFx0XHRcImNvbG9yXCI6ICRzY29wZS5kYXRhLmNvbG9yLFxuXHRcdFx0XHRcImNoaWxkcmVuXCI6IGJ1aWxkVHJlZSgkc2NvcGUuZGF0YS5jaGlsZHJlbiksXG5cdFx0XHRcdFwic2l6ZVwiOiAxXG5cdFx0XHR9O1xuXHRcdFx0JHNjb3BlLmNoYXJ0LmRhdGEgPSBjaGFydERhdGE7XG5cdFx0XHRyZXR1cm4gY2hhcnREYXRhO1xuXHRcdH07XG5cdFx0JHNjb3BlLiR3YXRjaCgnZGF0YScsIGZ1bmN0aW9uIChuLCBvKSB7XG5cdFx0XHRpZiAoIW4pIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdFx0JHNjb3BlLmNhbGN1bGF0ZUdyYXBoKCk7XG5cdFx0fSlcblx0fSk7XG5cbn0pKCk7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
