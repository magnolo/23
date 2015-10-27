(function(){
	"use strict";

	var app = angular.module('app',
		[
		'app.controllers',
		'app.filters',
		'app.services',
		'app.directives',
		'app.routes',
		'app.config',
		]);


	angular.module('app.routes', ['ui.router', 'ngStorage', 'satellizer']);
	angular.module('app.controllers', ['smoothScroll','ui.router', 'ngMaterial', 'ngStorage', 'restangular', 'ngMdIcons', 'angular-loading-bar', 'ngMessages', 'ngSanitize', "leaflet-directive",'nvd3', 'ngCsvImport','sticky']);
	angular.module('app.filters', []);
	angular.module('app.services', ['ui.router', 'ngStorage', 'restangular']);
	angular.module('app.directives', ['ngMaterial']);
	angular.module('app.config', []);

})();

(function(){
	"use strict";

	angular.module('app.routes').config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider){

		var getView = function(viewName){
			return '/views/app/' + viewName + '/' + viewName + '.html';
		};

		$urlRouterProvider.otherwise('/epi');

		$stateProvider
			.state('app', {
				abstract: true,
				views: {
				/*	sidebar: {
						templateUrl: getView('sidebar')
					},*/
					header: {
						templateUrl: getView('header')
					},
					main: {}
				}
			})
			.state('app.epi', {
				url: '/epi',
				views: {
					'main@': {
						templateUrl: getView('epi'),
						controller: 'EpiCtrl',
						resolve:{
							EPI: ["DataService", function(DataService){
								return DataService.getAll('/epi/year/2014')
							}]
						}
					},
					'map@':{
						templateUrl: getView('map')
					}
				}
			})
			.state('app.epi.upload',{
				url: '/upload-tutorial',
				views:{
					'sub':{
						templateUrl: '/views/app/epi/upload.html'
					}
				}
			})
			.state('app.epi.stats',{
				url: '/advanced-statistics',
				views:{
					'sub':{
						templateUrl: '/views/app/epi/stats.html'
					}
				}
			})
			.state('app.epi.sustain',{
				url: '/sustainable-goals',
				views:{
					'sub':{
						templateUrl: '/views/app/epi/sustain.html'
					}
				}
			})
			.state('app.epi.energy',{
				url: '/state-of-the-energy',
				views:{
					'sub':{
						templateUrl: '/views/app/epi/energy.html'
					}
				}
			})
			.state('app.epi.selected',{
				url: '/:item'
			})
			.state('app.epi.selected.compare',{
				url: '/compare-with-countries'
			})
			.state('app.importcsv', {
				url: '/importer',
				data: {pageName: 'Import CSV'},
				views: {
					'main@': {
						templateUrl: getView('importcsv')
					},
					'map':{}
				}
			});



	}]);
})();

(function(){
	"use strict";

	angular.module('app.routes').run(["$rootScope", function($rootScope){
		$rootScope.$on("$stateChangeStart", function(event, toState){
			if (toState.data && toState.data.pageName){
				$rootScope.current_page = toState.data.pageName;
			}
			 $rootScope.stateIsLoading = true;
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
        $authProvider.loginUrl = '/api/1/authenticate/auth';
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
		.setBaseUrl('/api/1/');
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
		.accentPalette('neonTeal')
		.warnPalette('bluer');
	}]);

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
    DataService.$inject = ['Restangular'];

    function DataService(Restangular){
        return {
          getAll: getAll,
          getOne: getOne
        };

        function getAll(route){
          var data = Restangular.all(route).getList();
            data.then(function(){}, function(){
              alert('error');
            });
            return data;
        }
        function getOne(route, id){
          return Restangular.one(route, id).get();
        }
    }

})();

(function(){
    "use strict";

    angular.module('app.services').factory('IndexService', function(){
        return {
          getEpi: function(){
            return {
        			 name:'EPI',
               title: 'EPI',
        			 full_name: 'Environment Performance Index',
        			 table: 'epi',
        			 allCountries: 'yes',
        			 countries: [],
        			 score_field_name: 'score',
        			 change_field_name: 'percent_change',
        			 order_field: 'year',
        			 countries_id_field: 'country_id',
        			 countries_iso_field: 'iso',
               color: '#393635',
               size:1,
               description: '<p>The Environmental Performance Index (EPI) ranks how well countries perform on high-priority environmental issues in two broad policy areas: protection of human health from environmental harm and protection of ecosystems.</p><p>The Environmental Performance Index (EPI) is constructed through the calculation and aggregation of 20 indicators reflecting national-level environmental data. These indicators are combined into nine issue categories, each of which fit under one of two overarching objectives.</p>',
               caption: 'The 2014 EPI Framework includes 9 issues and 20 indicators. Access to Electricity is not included in the figure because it is not used to calculate country scores. Click on the interactive figure above to explore the EPI framework.',
               children:[{
        				 column_name: 'eh',
        				 title: 'Enviromental Health',
        				 range:[0, 100],
        				 icon:'',
        				 color:'#be5f00',
        				 children:[{
        					 column_name:'eh_hi',
        					 title:'Health Impact',
        					 icon: 'man',
        					 unicode: '\ue605',
        					 color: '#f39419',
        					 children:[{
        						 column_name: 'eh_hi_child_mortality',
        						 title:'Child Mortality',
                     size:6074,
        						 icon:'',
        						 color:'#f7a937',
        						 description:'Probability of dying between a childs first and fifth birthdays (between age 1 and 5)'
        					 }]
        				 },{
        					 column_name:'eh_aq',
        					 title:'Air Quality',
        					 color: '#f6c70a',
        					 icon: 'sink',
        					 unicode: '\ue604',
        					 children:[{
        						 column_name: 'eh_aq_household_air_quality',
        						 title:'Household Air Quality',
                     size:2003,
        						 icon:'',
        						 color:'#fad33d',
        						 description:'Percentage of the population using solid fuels as primary cooking fuel.'
        					 },{
        						 column_name: 'eh_aq_exposure_pm25',
        						 title:'Air Pollution - Average Exposure to PM2.5',
                     size:2003,
        						 icon:'',
        						 color:'#fadd6c',
        						 description:'Population weighted exposure to PM2.5 (three- year average)'
        					 },{
        						 column_name: 'eh_aq_exceedance_pm25',
        						 title:'Air Pollution - PM2.5 Exceedance',
                     size:2003,
        						 icon:'',
        						 color:'#fde99c',
        						 description:'Proportion of the population whose exposure is above  WHO thresholds (10, 15, 25, 35 micrograms/m3)'
        					 }]
        				 },{
        					 column_name:'eh_ws',
        					 title:'Water Sanitation',
        					 color: '#ed6c2e',
        					 icon: 'fabric',
        					 unicode: '\ue606',
        					 children:[{
        						column_name: 'eh_ws_access_to_drinking_water',
        						title:'Access to Drinking Water',
                    size:2880,
        						icon:'',
        						color:'#f18753',
        						description:'Percentage of population with access to improved drinking water source'
        					},{
        						column_name: 'eh_ws_access_to_sanitation',
        						title:'Access to Sanitation',
                    size:2880,
        						icon:'',
        						color:'#f5a47d',
        						description:'Percentage of population with access to improved sanitation'
        					}]
        				 }]
        			 },{
        				 column_name: 'ev',
        				 title: 'Ecosystem Validity',
        				 range:[0, 100],
        				 icon:'',
        				 color:'#006bb6',
        				 children:[{
        					 column_name:'ev_wr',
        					 title:'Water Resources',
        					 color: '#7a8dc7',
        					 icon: 'water',
        					 unicode: '\ue608',
        					 children:[{
        						 column_name: 'ev_wr_wastewater_treatment',
        						 title:'Wastewater Treatment',
                     size:4000,
        						 icon:'',
        						 color:'#95a6d5',
        						 description:'Wastewater treatment level weighted by connection to wastewater treatment rate.'
        					 }]
        				 },{
        					 column_name:'ev_ag',
        					 title:'Agriculture',
        					 color: '#2e74ba',
        					 icon: 'agrar',
        					 unicode: '\ue600',
        					 children:[{
        						 column_name: 'ev_ag_agricultural_subsidies',
        						 title:'Agricultural Subsidies',
                     size:796,
        						 icon:'',
        						 color:'#82abd6',
        						 description:'Subsidies are expressed in price of their product in the domestic market (plus any direct output subsidy) less its price at the border, expressed as a percentage of the border price (adjusting for transport costs and quality differences).'
        					 },{
        						 column_name: 'ev_ag_pesticide_regulation',
        						 title:'Pesticide Regulation',
                     size:796,
        						 icon:'',
        						 color:'#578fc8',
        						 description:'Wastewater treatment level weighted by connection to wastewater treatment rate.'
        					 }]
        				 },{
        					 column_name:'ev_fo',
        					 title:'Forest',
        					 color: '#009acb',
        					 icon: 'tree',
        					 unicode: '\ue607',
        					 children:[{
        						 column_name: 'ev_fo_change_in_forest_cover',
        						 title:'Change in Forest Cover',
                     size:1550,
        						 icon:'',
        						 color:'#31aed5',
        						 description:'Forest loss - Forest gain in > 50% tree cover, as compared to 2000 levels.'
        					 }]
        				 },{
        					 column_name:'ev_fi',
        					 title:'Fisheries',
        					 color: '#008c8c',
        					 icon: 'anchor',
        					 unicode: '\ue601',
        					 children:[{
        						 column_name: 'ev_fi_coastal_shelf_fishing_pressure',
        						 title:'Coastal Shelf Fishing Pressure',
                     size:901,
        						 icon:'',
        						 color:'#65b8b7',
        						 description:'Catch in metric tons from trawling and dredging gears (mostly bottom trawls) divided by EEZ area.'
        					 },{
        						 column_name: 'ev_fi_fish_stocks',
        						 title:'Fish Stocks',
                     size:901,
        						 icon:'',
        						 color:'#30a2a2',
        						 description:'Percentage of fishing stocks overexploited and collapsed from EEZ.'
        					 }]
        				 },{
        					 column_name:'ev_bd',
        					 title:'Biodiversity and Habitat',
        					 color: '#44b6a0',
        					 icon: 'butterfly',
        					 unicode: '\ue602',
        					 children:[{
        						 column_name: 'ev_bd_terrestrial_protected_areas_national_biome',
        						 title:'National Biome Protection',
                     size:1074,
        						 icon:'',
        						 color:'#cee8e7',
        						 description:'Percentage of terrestrial biome area that is protected, weighted by domestic biome area.'
        					 },{
        						 column_name: 'ev_bd_terrestrial_protected_areas_global_biome',
        						 title:'Global Biome Protection',
                     size:1074,
        						 icon:'',
        						 color:'#a2d5d1',
        						 description:'Percentage of terrestrial biome area that is protected, weighted by global biome area.'
        					 },{
        						 column_name: 'ev_bd_marine_protected_areas',
        						 title:'Marine Protected Areas',
                     size:1074,
        						 icon:'',
        						 color:'#77c1b9',
        						 description:'Marine protected areas as a percent of EEZ.'
        					 },{
        						 column_name: 'ev_bd_critical_habitat_protection',
        						 title:'Critical Habitat Protection',
                     size:1074,
        						 icon:'',
        						 color:'#58bbae',
        						 description:'Percentage of terrestrial biome area that is protected, weighted by global biome area.'
        					 }]
        				 },{
        					 column_name:'ev_ce',
        					 title:'Climate and Energy',
        					 color: '#3bad5e',
        					 icon: 'energy',
        					 unicode: '\ue603',
        					 children:[{
        						 column_name: 'ev_ce_trend_in_carbon_intensity',
        						 title:'Trend in Carbon Intensity',
                     size:1514,
        						 icon:'',
        						 color:'#59b57a',
        						 description:'Change in CO2 emissions per unit GDP from 1990 to 2010.'
        					 },{
        						 column_name: 'ev_ce_change_of_trend_in_carbon_intesity',
        						 title:'Change of Trend in Carbon Intensity',
                     size:1514,
        						 icon:'',
        						 color:'#80c399',
        						 description:'Change in Trend of CO2 emissions per unit GDP from 1990 to 2000; 2000 to 2010.'
        					 },{
        						 column_name: 'ev_ce_trend_in_co2_emissions_per_kwh',
        						 title:'Trend in CO2 Emissions per KWH',
                     size:1514,
        						 icon:'',
        						 color:'#a8d4b8',
        						 description:'Change in CO2 emissions from electricity and heat production.'
        					 }]
        				 }]
        			 }]
        		};
          }
        }
    });

})();

(function(){
    "use strict";

    angular.module('app.services').factory('MapService', ["leafletData", function(leafletData){
        //
        var leaflet = {};
        return {
          setLeafletData: function(leaf){
            leaflet = leaflet;
          },
          getLeafletData: function(){
            return leaflet;
          }
        }
    }]);

})();

(function(){
	"use strict";

	angular.module("app.services").factory('DialogService', ["$mdDialog", function($mdDialog){

		return {
			fromTemplate: function(template, $scope){

				var options = {
					templateUrl: '/views/dialogs/' + template + '/' + template + '.html'
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
			}
		};
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
(function() {
	"use strict";

	angular.module('app.controllers').controller('EpiCtrl', ["$scope", "$rootScope", "$state", "$timeout", "$mdToast", "IndexService", "EPI", "DataService", "leafletData", "MapService", function($scope, $rootScope, $state, $timeout, $mdToast, IndexService, EPI, DataService, leafletData, MapService) {

		$scope.current = "";
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
					y: 'score'
				},
				title: 'Score',
				color: '#0066b9'
			}]
		};
		$scope.tabContent = "";
		$scope.toggleButton = 'arrow_drop_down';
		$scope.indexData = IndexService.getEpi();
		$scope.epi = [];
		$scope.menueOpen = true;
		$scope.info = false;
		$scope.closeIcon = 'close';
		$scope.compare = {
			active: false,
			countries: []
		};
		$scope.epi = EPI;
		$scope.selectedTab = 0;
		$scope.showTabContent = function(content) {
			if (content == '' && $scope.tabContent == '') {
				$scope.tabContent = 'rank';
			} else {
				$scope.tabContent = content;
			}
			$scope.toggleButton = $scope.tabContent ? 'arrow_drop_up' : 'arrow_drop_down';
		};

		$scope.setState = function(item) {
			$scope.setCurrent(getNationByIso(item));
		};
		$scope.toggleOpen = function() {
			$scope.menueOpen = !$scope.menueOpen;
			$scope.closeIcon = $scope.menueOpen == true ? 'chevron_left' : 'chevron_right';
		}
		$scope.setCurrent = function(nat) {
			$scope.current = nat;
			$scope.setSelectedFeature();
		};
		$scope.setSelectedFeature = function(iso) {
			if ($scope.mvtSource) {
				$timeout(function() {
					$scope.mvtSource.layers.countries_big_geom.features[$scope.current.iso].selected = true;
				})
			}
		};
		$scope.getRank = function(nat) {
			return $scope.epi.indexOf(nat) + 1;
		};
		$scope.toggleInfo = function() {
			//$scope.display.selectedCat = '';
			$scope.info = !$scope.info;
		};
		$scope.toggleDetails = function() {
			return $scope.details = !$scope.details;
		};
		$scope.mapGotoCountry = function(iso){
			DataService.getOne('nations/bbox', [$scope.country.iso]).then(function(data) {
				$scope.bbox = data;
			});
		}
		$scope.checkComparison = function(want) {
			//console.log(want,$scope.compare.active);
			if (want && !$scope.compare.active || !want && $scope.compare.active) {
				$scope.toggleComparison();
			}
		}
		$scope.toggleComparison = function() {
			$scope.compare.countries = [$scope.current];
			$scope.compare.active = !$scope.compare.active;
			if ($scope.compare.active) {
				//$state.go('app.epi.selected.compare');
				$scope.setTab(2);
				$rootScope.greyed = true;
				$scope.mvtSource.options.mutexToggle = false;
				$scope.mvtSource.setStyle(invertedStyle);
			} else {
				$rootScope.greyed = false;
				//$state.go('app.epi.selected', {item:$scope.current.iso});
				angular.forEach($scope.mvtSource.layers.countries_big_geom.features, function(feature) {
					feature.selected = false;
				});
				$scope.mvtSource.layers.countries_big_geom.features[$scope.current.iso].selected = true;
				$scope.mvtSource.options.mutexToggle = true;
				$scope.mvtSource.setStyle(countriesStyle);
				DataService.getOne('nations/bbox', [$scope.country.iso]).then(function(data) {
					$scope.bbox = data;
				});
			}
		};
		$scope.toggleCountrieList = function(country) {
			var found = false;
			angular.forEach($scope.compare.countries, function(nat, key) {
				if (country == nat && nat != $scope.current) {
					$scope.compare.countries.splice(key, 1);
					found = true;
				}
			});
			if (!found) {
				$scope.compare.countries.push(country);
			};
			var isos = [];
			angular.forEach($scope.compare.countries, function(item, key) {
				isos.push(item.iso);
			});
			if (isos.length > 1) {
				DataService.getOne('nations/bbox', isos).then(function(data) {
					$scope.bbox = data;
				});
			}

			return !found;
		};
		$scope.getOffset = function() {
			if (!$scope.current) {
				return 0;
			}
			return ($scope.current.rank == 1 ? 0 : $scope.current.rank == $scope.current.length + 1 ? $scope.current.rank : $scope.current.rank - 2) * 16;
			//return $scope.current.rank - 2 || 0;
		};
		$scope.getTendency = function() {
			if (!$scope.current) {
				return 'arrow_drop_down'
			}
			return $scope.current.percent_change > 0 ? 'arrow_drop_up' : 'arrow_drop_down';
		};

		$scope.$watch('current', function(newItem, oldItem) {
			if (newItem === oldItem) {
				return;
			}
			if (newItem.iso) {
				$state.go('app.epi.selected', {
					item: newItem.iso
				})
				$scope.mvtSource.layers.countries_big_geom.features[oldItem.iso].selected = false;
				$scope.mvtSource.options.mutexToggle = true;
				DataService.getOne('nations/bbox', [$scope.current.iso]).then(function(data) {
					$scope.bbox = data;
				});
			} else {
				$state.go('app.epi');
			}
		});
		$scope.setTab = function(i){
			$scope.activeTab = i;
		}
		$scope.nodeParent = {};
		function getParent(data){
				var items = [];
				angular.forEach(data.children, function(item){
					if(item.column_name == $scope.display.selectedCat.type){
						$scope.nodeParent =data;
					}
					getParent(item);
				});
				return items;
		}
		$scope.calcTree = function(){
			console.log($scope.display.selectedCat);
				getParent($scope.indexData);
		};
		$scope.$watch('display.selectedCat', function(n, o) {
			if (n === o) {
				return
			}
			if (n)
				updateCanvas(n.color);
			else {
				updateCanvas('rgba(128, 243, 198,1)');
			};
			$scope.calcTree();
			if ($scope.compare.active) {
				$scope.mvtSource.setStyle(invertedStyle);
			} else {
				$scope.mvtSource.setStyle(countriesStyle);
			}
		});
		$scope.$on("$stateChangeSuccess", function(event, toState, toParams) {
			if (toState.name == "app.epi.selected") {
				$rootScope.move = true;
				$scope.setState(toParams.item);
				DataService.getOne('nations', toParams.item).then(function(data) {
					$scope.country = data;
					DataService.getOne('nations/bbox', [$scope.country.iso]).then(function(data) {
						$scope.bbox = data;
					});
				});
			} else if (toState.name == "app.epi.selected.compare") {
				$scope.setState(toParams.item);
				//$scope.activeTab = 2;
				DataService.getOne('nations', toParams.item).then(function(data) {
					$scope.country = data;
					DataService.getOne('nations/bbox', [$scope.country.iso]).then(function(data) {
						$scope.bbox = data;
					});
				});
				$rootScope.move = false;
			} else {
				$rootScope.move = false;
				$scope.country = $scope.current = "";
			}
		});
		var getNationByName = function(name) {
			var nation = {};
			angular.forEach($scope.epi, function(nat) {
				if (nat.country == name) {
					nation = nat;
				}
			});
			return nation;
		};
		var getNationByIso = function(iso) {
			var nation = {};
			angular.forEach($scope.epi, function(nat) {
				if (nat.iso == iso) {
					nation = nat;
				}
			});
			return nation;
		};
		var createCanvas = function(colors) {
			$scope.canvas = document.createElement('canvas');
			$scope.canvas.width = 256;
			$scope.canvas.height = 10;
			$scope.ctx = $scope.canvas.getContext('2d');
			var gradient = $scope.ctx.createLinearGradient(0, 0, 280, 10);
			gradient.addColorStop(1, 'rgba(255,255,255,0)');
			gradient.addColorStop(0.53, 'rgba(128, 243, 198,1)');
			gradient.addColorStop(0, 'rgba(102,102,102,1)');
			$scope.ctx.fillStyle = gradient;
			$scope.ctx.fillRect(0, 0, 280, 10);
			$scope.palette = $scope.ctx.getImageData(0, 0, 256, 1).data;
			//document.getElementsByTagName('body')[0].appendChild($scope.canvas);
		}
		var updateCanvas = function(color) {
			var gradient = $scope.ctx.createLinearGradient(0, 0, 280, 10);
			gradient.addColorStop(1, 'rgba(255,255,255,0)');
			gradient.addColorStop(0.53, color);
			gradient.addColorStop(0, 'rgba(102,102,102,1)');
			$scope.ctx.fillStyle = gradient;
			$scope.ctx.fillRect(0, 0, 280, 10);
			$scope.palette = $scope.ctx.getImageData(0, 0, 256, 1).data;
		};
		createCanvas();
		var invertedStyle = function(feature) {
			var style = {};
			var iso = feature.properties.adm0_a3;
			var nation = getNationByIso(iso);
			var field = $scope.display.selectedCat.type || 'score';


			var colorPos = parseInt(256 / 100 * nation[field]) * 4;
			var color = 'rgba(' + $scope.palette[colorPos] + ', ' + $scope.palette[colorPos + 1] + ', ' + $scope.palette[colorPos + 2] + ',' + $scope.palette[colorPos + 3] + ')';
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
		var countriesStyle = function(feature) {
			var style = {};
			var iso = feature.properties.adm0_a3;
			var nation = getNationByIso(iso);
			var field = $scope.display.selectedCat.type || 'score';
			var type = feature.type;
			switch (type) {
				case 3: //'Polygon'
					if (nation[field]) {
						var colorPos = parseInt(256 / 100 * nation[field]) * 4;
						var color = 'rgba(' + $scope.palette[colorPos] + ', ' + $scope.palette[colorPos + 1] + ', ' + $scope.palette[colorPos + 2] + ',' + $scope.palette[colorPos + 3] + ')';
						style.color = 'rgba(' + $scope.palette[colorPos] + ', ' + $scope.palette[colorPos + 1] + ', ' + $scope.palette[colorPos + 2] + ',0.7)'; //color;
						style.outline = {
							color: color,
							size: 1
						};
						style.selected = {
							color: 'rgba(' + $scope.palette[colorPos] + ', ' + $scope.palette[colorPos + 1] + ', ' + $scope.palette[colorPos + 2] + ',0.3)',
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

		$scope.drawCountries = function() {
			leafletData.getMap('map').then(function(map) {
				$scope.$watch('bbox', function(n, o) {
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
					if ($scope.compare.active) {
						pad = [
							[350, 0],
							[0, 0]
						];
					}

					map.fitBounds(bounds, {
						paddingTopLeft: pad[0],
						paddingBottomRight: pad[1],
						maxZoom: 6
					});
				});
				var apiKey = 'pk.eyJ1IjoibWFnbm9sbyIsImEiOiJuSFdUYkg4In0.5HOykKk0pNP1N3isfPQGTQ';
				var debug = {};
				var mb = 'https://a.tiles.mapbox.com/v4/mapbox.mapbox-terrain-v1,mapbox.mapbox-streets-v6-dev/{z}/{x}/{y}.vector.pbf?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6IlhHVkZmaW8ifQ.hAMX5hSW-QnTeRCMAy9A8Q';
				var mapzen = 'http://vector.mapzen.com/osm/places/{z}/{x}/{y}.mvt?api_key=vector-tiles-Q3_Os5w'
				var url = 'http://v22015052835825358.yourvserver.net:3001/services/postgis/countries_big/geom/vector-tiles/{z}/{x}/{y}.pbf?fields=id,admin,adm0_a3,wb_a3,su_a3,iso_a3,name,name_long'; //
				var url2 = 'https://a.tiles.mapbox.com/v4/mapbox.mapbox-streets-v6-dev/{z}/{x}/{y}.vector.pbf?access_token=' + apiKey;
				$scope.mvtSource = new L.TileLayer.MVTSource({
					url: url,
					debug: false,
					opacity: 0.6,
					clickableLayers: ['countries_big_geom'],
					mutexToggle: true,
					onClick: function(evt, t) {
						if (!$scope.compare.active) {
							var c = getNationByIso(evt.feature.properties.adm0_a3);
							if(typeof c.rank != "undefined"){
								$scope.current = getNationByIso(evt.feature.properties.adm0_a3);
							}
							else{
								$mdToast.show($mdToast.simple().content('No info about this location!').position('bottom right'));
							}
						} else {

							var c = getNationByIso(evt.feature.properties.adm0_a3);
							if(typeof c.rank != "undefined"){
								$scope.toggleCountrieList(c);
							}
							else{
								$mdToast.show($mdToast.simple().content('No info about this location!').position('bottom right'));
							}
						}
					},
					getIDForLayerFeature: function(feature) {
						return feature.properties.adm0_a3;
					},
					filter: function(feature, context) {
						return true;
					},
					style: countriesStyle //,
						/*layerLink: function (layerName) {
							console.log(layerName);
							if (layerName.indexOf('_label') > -1) {
								return layerName.replace('_label', '');
							}
							return layerName + '_label';
						}*/
				});
				debug.mvtSource = $scope.mvtSource;
				map.addLayer($scope.mvtSource);
				$scope.mvtSource.setOpacity(0.5);
				$timeout(function(){
						$scope.setSelectedFeature();
				});
				var labelsLayer = L.tileLayer('https://{s}.tiles.mapbox.com/v4/magnolo.59c96cac/{z}/{x}/{y}.png?access_token=' + apiKey);
				map.addLayer(labelsLayer);
				labelsLayer.bringToFront();
			});
		};
		$scope.drawCountries();
	}]);
})();

(function(){
	"use strict";

	angular.module('app.controllers').controller('HeaderCtrl', ["$scope", "$rootScope", function($scope, $rootScope){

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

	angular.module('app.controllers').controller('MapCtrl', ["$scope", "$rootScope", "$timeout", "MapService", "leafletData", "$http", function ($scope, $rootScope, $timeout, MapService, leafletData, $http) {
		//
		var apiKey = 'pk.eyJ1IjoibWFnbm9sbyIsImEiOiJuSFdUYkg4In0.5HOykKk0pNP1N3isfPQGTQ';
		$scope.center = {
			lat: 0,
			lng: 0,
			zoom: 3
		};
		$scope.defaults = {
			scrollWheelZoom: false
		};
		angular.extend($rootScope, {
			center: {
				lat: 0,
				lng: 0,
				zoom: 3
			},
			layers: {
				baselayers: {
					xyz: {
						name: 'MapBox Pencil',
						url: 'https://{s}.tiles.mapbox.com/v4/mapbox.outdoors/{z}/{x}/{y}.png?access_token=' + apiKey,
						type: 'xyz',
					}
				},
				overlays: {
					demosutfgrid: {
						name: 'UTFGrid Interactivity',
						type: 'utfGrid',
						url: 'http://{s}.tiles.mapbox.com/v3/mapbox.geography-class/{z}/{x}/{y}.grid.json?callback={cb}',
						visible: true
					},
				}
			}
		});

		$scope.interactivity = "";
		$scope.flag = "";
		$scope.$on('leafletDirectiveMap.utfgridMouseover', function (event, leafletEvent) {
			//$scope.interactivity = leafletEvent.data.admin;
			//$scope.flag = "data:image/png;base64," + leafletEvent.data.flag_png;

		});
		$scope.$on('leafletDirectiveMap.utfgridMouseout', function (event, leafletEvent) {
			$scope.interactivity = "";
			$scope.flag = "";
		});
		MapService.setLeafletData(leafletData.getMap('map'));

	}]);
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

	angular.module('app.controllers').controller('SidebarCtrl', ["$scope", "$state", function($scope, $state){


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
	angular.module('app.directives').directive('bubbles', ["$compile", function ($compile) {
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
					//console.log(scope.indexer);
					//console.log(scope.chartdata);
					angular.forEach(scope.indexer, function (group) {
						var d = {
							type: group.column_name,
							name: group.title,
							group: group.column_name.substring(0,2),
							color: group.color,
							icon: group.icon,
							unicode: group.unicode,
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
									group: group.column_name.substring(0,2),
									x: options.center.x,
									y: options.center.y,
									color: item.color,
									icon: item.icon,
									unicode: item.unicode,
									data: item,
									children:item
								};
								nodes.push(node);
							}
						});
					});

					create_groups();
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
				if(options.labels == true){
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

						ngModel.$setViewValue(d);
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

						var i = d3.interpolate(data[1], radius);
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
						console.log(n)
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
					function(newValue, oldValue) {
						$timeout(function(){
							console.log(	newValue[$scope.options.field]);
							console.log(	newValue,$scope.options.field);
						})


						if (!newValue){
							newValue = {};
							newValue[$scope.options.field] = $scope.options.size;
						}

						$timeout(function(){
							animateIt(newValue[$scope.options.field])
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
					.attr('id', options.field)
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
					.style('fill', 'url(#' + options.field + ')');
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
				selection:'='
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9tYWluLmpzIiwiYXBwL3JvdXRlcy5qcyIsImFwcC9yb3V0ZXMucnVuLmpzIiwiY29uZmlnL2F1dGguanMiLCJjb25maWcvbG9hZGluZ19iYXIuanMiLCJjb25maWcvcmVzdGFuZ3VsYXIuanMiLCJjb25maWcvdGhlbWUuanMiLCJmaWx0ZXJzL2NhcGl0YWxpemUuanMiLCJmaWx0ZXJzL2h1bWFuX3JlYWRhYmxlLmpzIiwiZmlsdGVycy90cnVzdF9odG1sLmpzIiwiZmlsdGVycy91Y2ZpcnN0LmpzIiwic2VydmljZXMvRGF0YVNlcnZpY2UuanMiLCJzZXJ2aWNlcy9JbmRleC5qcyIsInNlcnZpY2VzL01hcC5qcyIsInNlcnZpY2VzL2RpYWxvZy5qcyIsInNlcnZpY2VzL3RvYXN0LmpzIiwiYXBwL2VwaS9lcGkuanMiLCJhcHAvaGVhZGVyL2hlYWRlci5qcyIsImFwcC9pbXBvcnRjc3YvaW1wb3J0Y3N2LmpzIiwiYXBwL21hcC9tYXAuanMiLCJhcHAvdG9hc3RzL3RvYXN0cy5qcyIsImFwcC9zaWRlYmFyL3NpZGViYXIuanMiLCJhcHAvdW5zdXBwb3J0ZWRfYnJvd3Nlci91bnN1cHBvcnRlZF9icm93c2VyLmpzIiwiZGlhbG9ncy9hZGRfdXNlcnMvYWRkX3VzZXJzLmpzIiwiZGlyZWN0aXZlcy9idWJibGVzL2J1YmJsZXMuanMiLCJkaXJlY3RpdmVzL2J1YmJsZXMvZGVmaW5pdGlvbi5qcyIsImRpcmVjdGl2ZXMvY2lyY2xlZ3JhcGgvY2lyY2xlZ3JhcGguanMiLCJkaXJlY3RpdmVzL2NpcmNsZWdyYXBoL2RlZmluaXRpb24uanMiLCJkaXJlY3RpdmVzL2hpc3RvcnkvZGVmaW5pdGlvbi5qcyIsImRpcmVjdGl2ZXMvaGlzdG9yeS9oaXN0b3J5LmpzIiwiZGlyZWN0aXZlcy9tZWRpYW4vZGVmaW5pdGlvbi5qcyIsImRpcmVjdGl2ZXMvbWVkaWFuL21lZGlhbi5qcyIsImRpcmVjdGl2ZXMvc2xpZGVUb2dnbGUvZGVmaW5pdGlvbi5qcyIsImRpcmVjdGl2ZXMvc2xpZGVUb2dnbGUvc2xpZGVUb2dnbGUuanMiLCJkaXJlY3RpdmVzL3N1YmluZGV4L2RlZmluaXRpb24uanMiLCJkaXJlY3RpdmVzL3N1YmluZGV4L3N1YmluZGV4LmpzIiwiZGlyZWN0aXZlcy9zaW1wbGVsaW5lY2hhcnQvZGVmaW5pdGlvbi5qcyIsImRpcmVjdGl2ZXMvc2ltcGxlbGluZWNoYXJ0L3NpbXBsZWxpbmVjaGFydC5qcyIsImRpcmVjdGl2ZXMvc3VuYnVyc3QvZGVmaW5pdGlvbi5qcyIsImRpcmVjdGl2ZXMvc3VuYnVyc3Qvc3VuYnVyc3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsSUFBQSxNQUFBLFFBQUEsT0FBQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBOzs7O0NBSUEsUUFBQSxPQUFBLGNBQUEsQ0FBQSxhQUFBLGFBQUE7Q0FDQSxRQUFBLE9BQUEsbUJBQUEsQ0FBQSxlQUFBLGFBQUEsY0FBQSxhQUFBLGVBQUEsYUFBQSx1QkFBQSxjQUFBLGNBQUEsb0JBQUEsUUFBQSxjQUFBO0NBQ0EsUUFBQSxPQUFBLGVBQUE7Q0FDQSxRQUFBLE9BQUEsZ0JBQUEsQ0FBQSxhQUFBLGFBQUE7Q0FDQSxRQUFBLE9BQUEsa0JBQUEsQ0FBQTtDQUNBLFFBQUEsT0FBQSxjQUFBOzs7O0FDbkJBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxjQUFBLGdEQUFBLFNBQUEsZ0JBQUEsbUJBQUE7O0VBRUEsSUFBQSxVQUFBLFNBQUEsU0FBQTtHQUNBLE9BQUEsZ0JBQUEsV0FBQSxNQUFBLFdBQUE7OztFQUdBLG1CQUFBLFVBQUE7O0VBRUE7SUFDQSxNQUFBLE9BQUE7SUFDQSxVQUFBO0lBQ0EsT0FBQTs7OztLQUlBLFFBQUE7TUFDQSxhQUFBLFFBQUE7O0tBRUEsTUFBQTs7O0lBR0EsTUFBQSxXQUFBO0lBQ0EsS0FBQTtJQUNBLE9BQUE7S0FDQSxTQUFBO01BQ0EsYUFBQSxRQUFBO01BQ0EsWUFBQTtNQUNBLFFBQUE7T0FDQSxxQkFBQSxTQUFBLFlBQUE7UUFDQSxPQUFBLFlBQUEsT0FBQTs7OztLQUlBLE9BQUE7TUFDQSxhQUFBLFFBQUE7Ozs7SUFJQSxNQUFBLGlCQUFBO0lBQ0EsS0FBQTtJQUNBLE1BQUE7S0FDQSxNQUFBO01BQ0EsYUFBQTs7OztJQUlBLE1BQUEsZ0JBQUE7SUFDQSxLQUFBO0lBQ0EsTUFBQTtLQUNBLE1BQUE7TUFDQSxhQUFBOzs7O0lBSUEsTUFBQSxrQkFBQTtJQUNBLEtBQUE7SUFDQSxNQUFBO0tBQ0EsTUFBQTtNQUNBLGFBQUE7Ozs7SUFJQSxNQUFBLGlCQUFBO0lBQ0EsS0FBQTtJQUNBLE1BQUE7S0FDQSxNQUFBO01BQ0EsYUFBQTs7OztJQUlBLE1BQUEsbUJBQUE7SUFDQSxLQUFBOztJQUVBLE1BQUEsMkJBQUE7SUFDQSxLQUFBOztJQUVBLE1BQUEsaUJBQUE7SUFDQSxLQUFBO0lBQ0EsTUFBQSxDQUFBLFVBQUE7SUFDQSxPQUFBO0tBQ0EsU0FBQTtNQUNBLGFBQUEsUUFBQTs7S0FFQSxNQUFBOzs7Ozs7Ozs7QUN0RkEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGNBQUEsbUJBQUEsU0FBQSxXQUFBO0VBQ0EsV0FBQSxJQUFBLHFCQUFBLFNBQUEsT0FBQSxRQUFBO0dBQ0EsSUFBQSxRQUFBLFFBQUEsUUFBQSxLQUFBLFNBQUE7SUFDQSxXQUFBLGVBQUEsUUFBQSxLQUFBOztJQUVBLFdBQUEsaUJBQUE7O0VBRUEsV0FBQSxJQUFBLHVCQUFBLFNBQUEsT0FBQSxRQUFBO0lBQ0EsV0FBQSxpQkFBQTs7Ozs7O0FDWEEsQ0FBQSxXQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLGNBQUEseUJBQUEsVUFBQSxjQUFBOzs7UUFHQSxjQUFBLFdBQUE7Ozs7O0FDTkEsQ0FBQSxXQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGNBQUEsaUNBQUEsVUFBQSxzQkFBQTtFQUNBLHNCQUFBLGlCQUFBOzs7OztBQ0pBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxjQUFBLGdDQUFBLFNBQUEscUJBQUE7RUFDQTtHQUNBLFdBQUE7Ozs7O0FDTEEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGNBQUEsOEJBQUEsU0FBQSxvQkFBQTs7Q0FFQSxJQUFBLGNBQUEsbUJBQUEsY0FBQSxRQUFBO0lBQ0EsT0FBQTtFQUNBLFFBQUE7O0NBRUEsSUFBQSxXQUFBLG1CQUFBLGNBQUEsUUFBQTtJQUNBLE9BQUE7RUFDQSxRQUFBOztDQUVBLElBQUEsVUFBQSxtQkFBQSxjQUFBLFFBQUE7SUFDQSxPQUFBO0VBQ0EsUUFBQTs7Q0FFQSxtQkFBQSxjQUFBLFlBQUE7Q0FDQSxtQkFBQSxjQUFBLGFBQUE7Q0FDQSxtQkFBQSxjQUFBLFNBQUE7RUFDQSxtQkFBQSxNQUFBO0dBQ0EsZUFBQTtHQUNBLGNBQUE7R0FDQSxZQUFBOzs7OztBQ3ZCQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsZUFBQSxRQUFBLGNBQUEsVUFBQTtFQUNBLE9BQUEsU0FBQSxPQUFBLEtBQUE7R0FDQSxPQUFBLENBQUEsQ0FBQSxDQUFBLFNBQUEsTUFBQSxRQUFBLHNCQUFBLFNBQUEsSUFBQTtJQUNBLE9BQUEsSUFBQSxPQUFBLEdBQUEsZ0JBQUEsSUFBQSxPQUFBLEdBQUE7UUFDQTs7Ozs7QUNQQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsZUFBQSxRQUFBLGlCQUFBLFVBQUE7RUFDQSxPQUFBLFNBQUEsU0FBQSxLQUFBO0dBQ0EsS0FBQSxDQUFBLEtBQUE7SUFDQSxPQUFBOztHQUVBLElBQUEsUUFBQSxJQUFBLE1BQUE7R0FDQSxLQUFBLElBQUEsRUFBQSxHQUFBLEVBQUEsTUFBQSxRQUFBLEtBQUE7SUFDQSxNQUFBLEtBQUEsTUFBQSxHQUFBLE9BQUEsR0FBQSxnQkFBQSxNQUFBLEdBQUEsTUFBQTs7R0FFQSxPQUFBLE1BQUEsS0FBQTs7OztBQ1pBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxlQUFBLFFBQUEsc0JBQUEsVUFBQSxNQUFBO0VBQ0EsT0FBQSxVQUFBLE1BQUE7R0FDQSxPQUFBLEtBQUEsWUFBQTs7OztBQ0xBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxlQUFBLE9BQUEsV0FBQSxXQUFBO0VBQ0EsT0FBQSxVQUFBLFFBQUE7R0FDQSxLQUFBLENBQUEsT0FBQTtJQUNBLE9BQUE7O0dBRUEsT0FBQSxNQUFBLFVBQUEsR0FBQSxHQUFBLGdCQUFBLE1BQUEsVUFBQTs7Ozs7O0FDUkEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLGdCQUFBLFFBQUEsZUFBQTtJQUNBLFlBQUEsVUFBQSxDQUFBOztJQUVBLFNBQUEsWUFBQSxZQUFBO1FBQ0EsT0FBQTtVQUNBLFFBQUE7VUFDQSxRQUFBOzs7UUFHQSxTQUFBLE9BQUEsTUFBQTtVQUNBLElBQUEsT0FBQSxZQUFBLElBQUEsT0FBQTtZQUNBLEtBQUEsS0FBQSxVQUFBLElBQUEsVUFBQTtjQUNBLE1BQUE7O1lBRUEsT0FBQTs7UUFFQSxTQUFBLE9BQUEsT0FBQSxHQUFBO1VBQ0EsT0FBQSxZQUFBLElBQUEsT0FBQSxJQUFBOzs7Ozs7QUNwQkEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLGdCQUFBLFFBQUEsZ0JBQUEsVUFBQTtRQUNBLE9BQUE7VUFDQSxRQUFBLFVBQUE7WUFDQSxPQUFBO1lBQ0EsS0FBQTtlQUNBLE9BQUE7WUFDQSxXQUFBO1lBQ0EsT0FBQTtZQUNBLGNBQUE7WUFDQSxXQUFBO1lBQ0Esa0JBQUE7WUFDQSxtQkFBQTtZQUNBLGFBQUE7WUFDQSxvQkFBQTtZQUNBLHFCQUFBO2VBQ0EsT0FBQTtlQUNBLEtBQUE7ZUFDQSxhQUFBO2VBQ0EsU0FBQTtlQUNBLFNBQUEsQ0FBQTthQUNBLGFBQUE7YUFDQSxPQUFBO2FBQ0EsTUFBQSxDQUFBLEdBQUE7YUFDQSxLQUFBO2FBQ0EsTUFBQTthQUNBLFNBQUEsQ0FBQTtjQUNBLFlBQUE7Y0FDQSxNQUFBO2NBQ0EsTUFBQTtjQUNBLFNBQUE7Y0FDQSxPQUFBO2NBQ0EsU0FBQSxDQUFBO2VBQ0EsYUFBQTtlQUNBLE1BQUE7cUJBQ0EsS0FBQTtlQUNBLEtBQUE7ZUFDQSxNQUFBO2VBQ0EsWUFBQTs7ZUFFQTtjQUNBLFlBQUE7Y0FDQSxNQUFBO2NBQ0EsT0FBQTtjQUNBLE1BQUE7Y0FDQSxTQUFBO2NBQ0EsU0FBQSxDQUFBO2VBQ0EsYUFBQTtlQUNBLE1BQUE7cUJBQ0EsS0FBQTtlQUNBLEtBQUE7ZUFDQSxNQUFBO2VBQ0EsWUFBQTtnQkFDQTtlQUNBLGFBQUE7ZUFDQSxNQUFBO3FCQUNBLEtBQUE7ZUFDQSxLQUFBO2VBQ0EsTUFBQTtlQUNBLFlBQUE7Z0JBQ0E7ZUFDQSxhQUFBO2VBQ0EsTUFBQTtxQkFDQSxLQUFBO2VBQ0EsS0FBQTtlQUNBLE1BQUE7ZUFDQSxZQUFBOztlQUVBO2NBQ0EsWUFBQTtjQUNBLE1BQUE7Y0FDQSxPQUFBO2NBQ0EsTUFBQTtjQUNBLFNBQUE7Y0FDQSxTQUFBLENBQUE7Y0FDQSxhQUFBO2NBQ0EsTUFBQTtvQkFDQSxLQUFBO2NBQ0EsS0FBQTtjQUNBLE1BQUE7Y0FDQSxZQUFBO2VBQ0E7Y0FDQSxhQUFBO2NBQ0EsTUFBQTtvQkFDQSxLQUFBO2NBQ0EsS0FBQTtjQUNBLE1BQUE7Y0FDQSxZQUFBOzs7Y0FHQTthQUNBLGFBQUE7YUFDQSxPQUFBO2FBQ0EsTUFBQSxDQUFBLEdBQUE7YUFDQSxLQUFBO2FBQ0EsTUFBQTthQUNBLFNBQUEsQ0FBQTtjQUNBLFlBQUE7Y0FDQSxNQUFBO2NBQ0EsT0FBQTtjQUNBLE1BQUE7Y0FDQSxTQUFBO2NBQ0EsU0FBQSxDQUFBO2VBQ0EsYUFBQTtlQUNBLE1BQUE7cUJBQ0EsS0FBQTtlQUNBLEtBQUE7ZUFDQSxNQUFBO2VBQ0EsWUFBQTs7ZUFFQTtjQUNBLFlBQUE7Y0FDQSxNQUFBO2NBQ0EsT0FBQTtjQUNBLE1BQUE7Y0FDQSxTQUFBO2NBQ0EsU0FBQSxDQUFBO2VBQ0EsYUFBQTtlQUNBLE1BQUE7cUJBQ0EsS0FBQTtlQUNBLEtBQUE7ZUFDQSxNQUFBO2VBQ0EsWUFBQTtnQkFDQTtlQUNBLGFBQUE7ZUFDQSxNQUFBO3FCQUNBLEtBQUE7ZUFDQSxLQUFBO2VBQ0EsTUFBQTtlQUNBLFlBQUE7O2VBRUE7Y0FDQSxZQUFBO2NBQ0EsTUFBQTtjQUNBLE9BQUE7Y0FDQSxNQUFBO2NBQ0EsU0FBQTtjQUNBLFNBQUEsQ0FBQTtlQUNBLGFBQUE7ZUFDQSxNQUFBO3FCQUNBLEtBQUE7ZUFDQSxLQUFBO2VBQ0EsTUFBQTtlQUNBLFlBQUE7O2VBRUE7Y0FDQSxZQUFBO2NBQ0EsTUFBQTtjQUNBLE9BQUE7Y0FDQSxNQUFBO2NBQ0EsU0FBQTtjQUNBLFNBQUEsQ0FBQTtlQUNBLGFBQUE7ZUFDQSxNQUFBO3FCQUNBLEtBQUE7ZUFDQSxLQUFBO2VBQ0EsTUFBQTtlQUNBLFlBQUE7Z0JBQ0E7ZUFDQSxhQUFBO2VBQ0EsTUFBQTtxQkFDQSxLQUFBO2VBQ0EsS0FBQTtlQUNBLE1BQUE7ZUFDQSxZQUFBOztlQUVBO2NBQ0EsWUFBQTtjQUNBLE1BQUE7Y0FDQSxPQUFBO2NBQ0EsTUFBQTtjQUNBLFNBQUE7Y0FDQSxTQUFBLENBQUE7ZUFDQSxhQUFBO2VBQ0EsTUFBQTtxQkFDQSxLQUFBO2VBQ0EsS0FBQTtlQUNBLE1BQUE7ZUFDQSxZQUFBO2dCQUNBO2VBQ0EsYUFBQTtlQUNBLE1BQUE7cUJBQ0EsS0FBQTtlQUNBLEtBQUE7ZUFDQSxNQUFBO2VBQ0EsWUFBQTtnQkFDQTtlQUNBLGFBQUE7ZUFDQSxNQUFBO3FCQUNBLEtBQUE7ZUFDQSxLQUFBO2VBQ0EsTUFBQTtlQUNBLFlBQUE7Z0JBQ0E7ZUFDQSxhQUFBO2VBQ0EsTUFBQTtxQkFDQSxLQUFBO2VBQ0EsS0FBQTtlQUNBLE1BQUE7ZUFDQSxZQUFBOztlQUVBO2NBQ0EsWUFBQTtjQUNBLE1BQUE7Y0FDQSxPQUFBO2NBQ0EsTUFBQTtjQUNBLFNBQUE7Y0FDQSxTQUFBLENBQUE7ZUFDQSxhQUFBO2VBQ0EsTUFBQTtxQkFDQSxLQUFBO2VBQ0EsS0FBQTtlQUNBLE1BQUE7ZUFDQSxZQUFBO2dCQUNBO2VBQ0EsYUFBQTtlQUNBLE1BQUE7cUJBQ0EsS0FBQTtlQUNBLEtBQUE7ZUFDQSxNQUFBO2VBQ0EsWUFBQTtnQkFDQTtlQUNBLGFBQUE7ZUFDQSxNQUFBO3FCQUNBLEtBQUE7ZUFDQSxLQUFBO2VBQ0EsTUFBQTtlQUNBLFlBQUE7Ozs7Ozs7Ozs7O0FDck9BLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxnQkFBQSxRQUFBLDhCQUFBLFNBQUEsWUFBQTs7UUFFQSxJQUFBLFVBQUE7UUFDQSxPQUFBO1VBQ0EsZ0JBQUEsU0FBQSxLQUFBO1lBQ0EsVUFBQTs7VUFFQSxnQkFBQSxVQUFBO1lBQ0EsT0FBQTs7Ozs7OztBQ1hBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxnQkFBQSxRQUFBLCtCQUFBLFNBQUEsVUFBQTs7RUFFQSxPQUFBO0dBQ0EsY0FBQSxTQUFBLFVBQUEsT0FBQTs7SUFFQSxJQUFBLFVBQUE7S0FDQSxhQUFBLG9CQUFBLFdBQUEsTUFBQSxXQUFBOzs7SUFHQSxJQUFBLE9BQUE7S0FDQSxRQUFBLFFBQUEsT0FBQTs7O0lBR0EsT0FBQSxVQUFBLEtBQUE7OztHQUdBLE1BQUEsVUFBQTtJQUNBLE9BQUEsVUFBQTs7O0dBR0EsT0FBQSxTQUFBLE9BQUEsUUFBQTtJQUNBLFVBQUE7S0FDQSxVQUFBO09BQ0EsTUFBQTtPQUNBLFFBQUE7T0FDQSxHQUFBOzs7Ozs7QUM1QkEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGdCQUFBLFFBQUEsNkJBQUEsU0FBQSxTQUFBOztFQUVBLElBQUEsUUFBQTtHQUNBLFdBQUE7R0FDQSxTQUFBOztFQUVBLE9BQUE7R0FDQSxNQUFBLFNBQUEsUUFBQTtJQUNBLElBQUEsQ0FBQSxRQUFBO0tBQ0EsT0FBQTs7O0lBR0EsT0FBQSxTQUFBO0tBQ0EsU0FBQTtPQUNBLFFBQUE7T0FDQSxTQUFBO09BQ0EsT0FBQTtPQUNBLFVBQUE7OztHQUdBLE9BQUEsU0FBQSxRQUFBO0lBQ0EsSUFBQSxDQUFBLFFBQUE7S0FDQSxPQUFBOzs7SUFHQSxPQUFBLFNBQUE7S0FDQSxTQUFBO09BQ0EsUUFBQTtPQUNBLFNBQUE7T0FDQSxNQUFBO09BQ0EsT0FBQTtPQUNBLFVBQUE7Ozs7OztBQ2xDQSxDQUFBLFdBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSx5SUFBQSxTQUFBLFFBQUEsWUFBQSxRQUFBLFVBQUEsVUFBQSxjQUFBLEtBQUEsYUFBQSxhQUFBLFlBQUE7O0VBRUEsT0FBQSxVQUFBO0VBQ0EsT0FBQSxVQUFBO0dBQ0EsYUFBQTtHQUNBLE1BQUEsQ0FBQTtJQUNBLFFBQUE7S0FDQSxHQUFBO0tBQ0EsR0FBQTs7SUFFQSxPQUFBO0lBQ0EsT0FBQTs7R0FFQSxPQUFBLENBQUE7SUFDQSxRQUFBO0tBQ0EsR0FBQTtLQUNBLEdBQUE7O0lBRUEsT0FBQTtJQUNBLE9BQUE7OztFQUdBLE9BQUEsYUFBQTtFQUNBLE9BQUEsZUFBQTtFQUNBLE9BQUEsWUFBQSxhQUFBO0VBQ0EsT0FBQSxNQUFBO0VBQ0EsT0FBQSxZQUFBO0VBQ0EsT0FBQSxPQUFBO0VBQ0EsT0FBQSxZQUFBO0VBQ0EsT0FBQSxVQUFBO0dBQ0EsUUFBQTtHQUNBLFdBQUE7O0VBRUEsT0FBQSxNQUFBO0VBQ0EsT0FBQSxjQUFBO0VBQ0EsT0FBQSxpQkFBQSxTQUFBLFNBQUE7R0FDQSxJQUFBLFdBQUEsTUFBQSxPQUFBLGNBQUEsSUFBQTtJQUNBLE9BQUEsYUFBQTtVQUNBO0lBQ0EsT0FBQSxhQUFBOztHQUVBLE9BQUEsZUFBQSxPQUFBLGFBQUEsa0JBQUE7OztFQUdBLE9BQUEsV0FBQSxTQUFBLE1BQUE7R0FDQSxPQUFBLFdBQUEsZUFBQTs7RUFFQSxPQUFBLGFBQUEsV0FBQTtHQUNBLE9BQUEsWUFBQSxDQUFBLE9BQUE7R0FDQSxPQUFBLFlBQUEsT0FBQSxhQUFBLE9BQUEsaUJBQUE7O0VBRUEsT0FBQSxhQUFBLFNBQUEsS0FBQTtHQUNBLE9BQUEsVUFBQTtHQUNBLE9BQUE7O0VBRUEsT0FBQSxxQkFBQSxTQUFBLEtBQUE7R0FDQSxJQUFBLE9BQUEsV0FBQTtJQUNBLFNBQUEsV0FBQTtLQUNBLE9BQUEsVUFBQSxPQUFBLG1CQUFBLFNBQUEsT0FBQSxRQUFBLEtBQUEsV0FBQTs7OztFQUlBLE9BQUEsVUFBQSxTQUFBLEtBQUE7R0FDQSxPQUFBLE9BQUEsSUFBQSxRQUFBLE9BQUE7O0VBRUEsT0FBQSxhQUFBLFdBQUE7O0dBRUEsT0FBQSxPQUFBLENBQUEsT0FBQTs7RUFFQSxPQUFBLGdCQUFBLFdBQUE7R0FDQSxPQUFBLE9BQUEsVUFBQSxDQUFBLE9BQUE7O0VBRUEsT0FBQSxpQkFBQSxTQUFBLElBQUE7R0FDQSxZQUFBLE9BQUEsZ0JBQUEsQ0FBQSxPQUFBLFFBQUEsTUFBQSxLQUFBLFNBQUEsTUFBQTtJQUNBLE9BQUEsT0FBQTs7O0VBR0EsT0FBQSxrQkFBQSxTQUFBLE1BQUE7O0dBRUEsSUFBQSxRQUFBLENBQUEsT0FBQSxRQUFBLFVBQUEsQ0FBQSxRQUFBLE9BQUEsUUFBQSxRQUFBO0lBQ0EsT0FBQTs7O0VBR0EsT0FBQSxtQkFBQSxXQUFBO0dBQ0EsT0FBQSxRQUFBLFlBQUEsQ0FBQSxPQUFBO0dBQ0EsT0FBQSxRQUFBLFNBQUEsQ0FBQSxPQUFBLFFBQUE7R0FDQSxJQUFBLE9BQUEsUUFBQSxRQUFBOztJQUVBLE9BQUEsT0FBQTtJQUNBLFdBQUEsU0FBQTtJQUNBLE9BQUEsVUFBQSxRQUFBLGNBQUE7SUFDQSxPQUFBLFVBQUEsU0FBQTtVQUNBO0lBQ0EsV0FBQSxTQUFBOztJQUVBLFFBQUEsUUFBQSxPQUFBLFVBQUEsT0FBQSxtQkFBQSxVQUFBLFNBQUEsU0FBQTtLQUNBLFFBQUEsV0FBQTs7SUFFQSxPQUFBLFVBQUEsT0FBQSxtQkFBQSxTQUFBLE9BQUEsUUFBQSxLQUFBLFdBQUE7SUFDQSxPQUFBLFVBQUEsUUFBQSxjQUFBO0lBQ0EsT0FBQSxVQUFBLFNBQUE7SUFDQSxZQUFBLE9BQUEsZ0JBQUEsQ0FBQSxPQUFBLFFBQUEsTUFBQSxLQUFBLFNBQUEsTUFBQTtLQUNBLE9BQUEsT0FBQTs7OztFQUlBLE9BQUEscUJBQUEsU0FBQSxTQUFBO0dBQ0EsSUFBQSxRQUFBO0dBQ0EsUUFBQSxRQUFBLE9BQUEsUUFBQSxXQUFBLFNBQUEsS0FBQSxLQUFBO0lBQ0EsSUFBQSxXQUFBLE9BQUEsT0FBQSxPQUFBLFNBQUE7S0FDQSxPQUFBLFFBQUEsVUFBQSxPQUFBLEtBQUE7S0FDQSxRQUFBOzs7R0FHQSxJQUFBLENBQUEsT0FBQTtJQUNBLE9BQUEsUUFBQSxVQUFBLEtBQUE7SUFDQTtHQUNBLElBQUEsT0FBQTtHQUNBLFFBQUEsUUFBQSxPQUFBLFFBQUEsV0FBQSxTQUFBLE1BQUEsS0FBQTtJQUNBLEtBQUEsS0FBQSxLQUFBOztHQUVBLElBQUEsS0FBQSxTQUFBLEdBQUE7SUFDQSxZQUFBLE9BQUEsZ0JBQUEsTUFBQSxLQUFBLFNBQUEsTUFBQTtLQUNBLE9BQUEsT0FBQTs7OztHQUlBLE9BQUEsQ0FBQTs7RUFFQSxPQUFBLFlBQUEsV0FBQTtHQUNBLElBQUEsQ0FBQSxPQUFBLFNBQUE7SUFDQSxPQUFBOztHQUVBLE9BQUEsQ0FBQSxPQUFBLFFBQUEsUUFBQSxJQUFBLElBQUEsT0FBQSxRQUFBLFFBQUEsT0FBQSxRQUFBLFNBQUEsSUFBQSxPQUFBLFFBQUEsT0FBQSxPQUFBLFFBQUEsT0FBQSxLQUFBOzs7RUFHQSxPQUFBLGNBQUEsV0FBQTtHQUNBLElBQUEsQ0FBQSxPQUFBLFNBQUE7SUFDQSxPQUFBOztHQUVBLE9BQUEsT0FBQSxRQUFBLGlCQUFBLElBQUEsa0JBQUE7OztFQUdBLE9BQUEsT0FBQSxXQUFBLFNBQUEsU0FBQSxTQUFBO0dBQ0EsSUFBQSxZQUFBLFNBQUE7SUFDQTs7R0FFQSxJQUFBLFFBQUEsS0FBQTtJQUNBLE9BQUEsR0FBQSxvQkFBQTtLQUNBLE1BQUEsUUFBQTs7SUFFQSxPQUFBLFVBQUEsT0FBQSxtQkFBQSxTQUFBLFFBQUEsS0FBQSxXQUFBO0lBQ0EsT0FBQSxVQUFBLFFBQUEsY0FBQTtJQUNBLFlBQUEsT0FBQSxnQkFBQSxDQUFBLE9BQUEsUUFBQSxNQUFBLEtBQUEsU0FBQSxNQUFBO0tBQ0EsT0FBQSxPQUFBOztVQUVBO0lBQ0EsT0FBQSxHQUFBOzs7RUFHQSxPQUFBLFNBQUEsU0FBQSxFQUFBO0dBQ0EsT0FBQSxZQUFBOztFQUVBLE9BQUEsYUFBQTtFQUNBLFNBQUEsVUFBQSxLQUFBO0lBQ0EsSUFBQSxRQUFBO0lBQ0EsUUFBQSxRQUFBLEtBQUEsVUFBQSxTQUFBLEtBQUE7S0FDQSxHQUFBLEtBQUEsZUFBQSxPQUFBLFFBQUEsWUFBQSxLQUFBO01BQ0EsT0FBQSxZQUFBOztLQUVBLFVBQUE7O0lBRUEsT0FBQTs7RUFFQSxPQUFBLFdBQUEsVUFBQTtHQUNBLFFBQUEsSUFBQSxPQUFBLFFBQUE7SUFDQSxVQUFBLE9BQUE7O0VBRUEsT0FBQSxPQUFBLHVCQUFBLFNBQUEsR0FBQSxHQUFBO0dBQ0EsSUFBQSxNQUFBLEdBQUE7SUFDQTs7R0FFQSxJQUFBO0lBQ0EsYUFBQSxFQUFBO1FBQ0E7SUFDQSxhQUFBO0lBQ0E7R0FDQSxPQUFBO0dBQ0EsSUFBQSxPQUFBLFFBQUEsUUFBQTtJQUNBLE9BQUEsVUFBQSxTQUFBO1VBQ0E7SUFDQSxPQUFBLFVBQUEsU0FBQTs7O0VBR0EsT0FBQSxJQUFBLHVCQUFBLFNBQUEsT0FBQSxTQUFBLFVBQUE7R0FDQSxJQUFBLFFBQUEsUUFBQSxvQkFBQTtJQUNBLFdBQUEsT0FBQTtJQUNBLE9BQUEsU0FBQSxTQUFBO0lBQ0EsWUFBQSxPQUFBLFdBQUEsU0FBQSxNQUFBLEtBQUEsU0FBQSxNQUFBO0tBQ0EsT0FBQSxVQUFBO0tBQ0EsWUFBQSxPQUFBLGdCQUFBLENBQUEsT0FBQSxRQUFBLE1BQUEsS0FBQSxTQUFBLE1BQUE7TUFDQSxPQUFBLE9BQUE7OztVQUdBLElBQUEsUUFBQSxRQUFBLDRCQUFBO0lBQ0EsT0FBQSxTQUFBLFNBQUE7O0lBRUEsWUFBQSxPQUFBLFdBQUEsU0FBQSxNQUFBLEtBQUEsU0FBQSxNQUFBO0tBQ0EsT0FBQSxVQUFBO0tBQ0EsWUFBQSxPQUFBLGdCQUFBLENBQUEsT0FBQSxRQUFBLE1BQUEsS0FBQSxTQUFBLE1BQUE7TUFDQSxPQUFBLE9BQUE7OztJQUdBLFdBQUEsT0FBQTtVQUNBO0lBQ0EsV0FBQSxPQUFBO0lBQ0EsT0FBQSxVQUFBLE9BQUEsVUFBQTs7O0VBR0EsSUFBQSxrQkFBQSxTQUFBLE1BQUE7R0FDQSxJQUFBLFNBQUE7R0FDQSxRQUFBLFFBQUEsT0FBQSxLQUFBLFNBQUEsS0FBQTtJQUNBLElBQUEsSUFBQSxXQUFBLE1BQUE7S0FDQSxTQUFBOzs7R0FHQSxPQUFBOztFQUVBLElBQUEsaUJBQUEsU0FBQSxLQUFBO0dBQ0EsSUFBQSxTQUFBO0dBQ0EsUUFBQSxRQUFBLE9BQUEsS0FBQSxTQUFBLEtBQUE7SUFDQSxJQUFBLElBQUEsT0FBQSxLQUFBO0tBQ0EsU0FBQTs7O0dBR0EsT0FBQTs7RUFFQSxJQUFBLGVBQUEsU0FBQSxRQUFBO0dBQ0EsT0FBQSxTQUFBLFNBQUEsY0FBQTtHQUNBLE9BQUEsT0FBQSxRQUFBO0dBQ0EsT0FBQSxPQUFBLFNBQUE7R0FDQSxPQUFBLE1BQUEsT0FBQSxPQUFBLFdBQUE7R0FDQSxJQUFBLFdBQUEsT0FBQSxJQUFBLHFCQUFBLEdBQUEsR0FBQSxLQUFBO0dBQ0EsU0FBQSxhQUFBLEdBQUE7R0FDQSxTQUFBLGFBQUEsTUFBQTtHQUNBLFNBQUEsYUFBQSxHQUFBO0dBQ0EsT0FBQSxJQUFBLFlBQUE7R0FDQSxPQUFBLElBQUEsU0FBQSxHQUFBLEdBQUEsS0FBQTtHQUNBLE9BQUEsVUFBQSxPQUFBLElBQUEsYUFBQSxHQUFBLEdBQUEsS0FBQSxHQUFBOzs7RUFHQSxJQUFBLGVBQUEsU0FBQSxPQUFBO0dBQ0EsSUFBQSxXQUFBLE9BQUEsSUFBQSxxQkFBQSxHQUFBLEdBQUEsS0FBQTtHQUNBLFNBQUEsYUFBQSxHQUFBO0dBQ0EsU0FBQSxhQUFBLE1BQUE7R0FDQSxTQUFBLGFBQUEsR0FBQTtHQUNBLE9BQUEsSUFBQSxZQUFBO0dBQ0EsT0FBQSxJQUFBLFNBQUEsR0FBQSxHQUFBLEtBQUE7R0FDQSxPQUFBLFVBQUEsT0FBQSxJQUFBLGFBQUEsR0FBQSxHQUFBLEtBQUEsR0FBQTs7RUFFQTtFQUNBLElBQUEsZ0JBQUEsU0FBQSxTQUFBO0dBQ0EsSUFBQSxRQUFBO0dBQ0EsSUFBQSxNQUFBLFFBQUEsV0FBQTtHQUNBLElBQUEsU0FBQSxlQUFBO0dBQ0EsSUFBQSxRQUFBLE9BQUEsUUFBQSxZQUFBLFFBQUE7OztHQUdBLElBQUEsV0FBQSxTQUFBLE1BQUEsTUFBQSxPQUFBLFVBQUE7R0FDQSxJQUFBLFFBQUEsVUFBQSxPQUFBLFFBQUEsWUFBQSxPQUFBLE9BQUEsUUFBQSxXQUFBLEtBQUEsT0FBQSxPQUFBLFFBQUEsV0FBQSxLQUFBLE1BQUEsT0FBQSxRQUFBLFdBQUEsS0FBQTtHQUNBLE1BQUEsUUFBQTtHQUNBLE1BQUEsVUFBQTtJQUNBLE9BQUE7SUFDQSxNQUFBOztHQUVBLE1BQUEsV0FBQTtJQUNBLE9BQUE7SUFDQSxTQUFBO0tBQ0EsT0FBQTtLQUNBLE1BQUE7OztHQUdBLE9BQUE7O0VBRUEsSUFBQSxpQkFBQSxTQUFBLFNBQUE7R0FDQSxJQUFBLFFBQUE7R0FDQSxJQUFBLE1BQUEsUUFBQSxXQUFBO0dBQ0EsSUFBQSxTQUFBLGVBQUE7R0FDQSxJQUFBLFFBQUEsT0FBQSxRQUFBLFlBQUEsUUFBQTtHQUNBLElBQUEsT0FBQSxRQUFBO0dBQ0EsUUFBQTtJQUNBLEtBQUE7S0FDQSxJQUFBLE9BQUEsUUFBQTtNQUNBLElBQUEsV0FBQSxTQUFBLE1BQUEsTUFBQSxPQUFBLFVBQUE7TUFDQSxJQUFBLFFBQUEsVUFBQSxPQUFBLFFBQUEsWUFBQSxPQUFBLE9BQUEsUUFBQSxXQUFBLEtBQUEsT0FBQSxPQUFBLFFBQUEsV0FBQSxLQUFBLE1BQUEsT0FBQSxRQUFBLFdBQUEsS0FBQTtNQUNBLE1BQUEsUUFBQSxVQUFBLE9BQUEsUUFBQSxZQUFBLE9BQUEsT0FBQSxRQUFBLFdBQUEsS0FBQSxPQUFBLE9BQUEsUUFBQSxXQUFBLEtBQUE7TUFDQSxNQUFBLFVBQUE7T0FDQSxPQUFBO09BQ0EsTUFBQTs7TUFFQSxNQUFBLFdBQUE7T0FDQSxPQUFBLFVBQUEsT0FBQSxRQUFBLFlBQUEsT0FBQSxPQUFBLFFBQUEsV0FBQSxLQUFBLE9BQUEsT0FBQSxRQUFBLFdBQUEsS0FBQTtPQUNBLFNBQUE7UUFDQSxPQUFBO1FBQ0EsTUFBQTs7O01BR0E7WUFDQTtNQUNBLE1BQUEsUUFBQTtNQUNBLE1BQUEsVUFBQTtPQUNBLE9BQUE7T0FDQSxNQUFBOzs7O0dBSUEsSUFBQSxRQUFBLE1BQUEsU0FBQSw0QkFBQTtJQUNBLE1BQUEsY0FBQSxXQUFBO0tBQ0EsSUFBQSxRQUFBO01BQ0EsTUFBQSxRQUFBLFdBQUE7TUFDQSxVQUFBLENBQUEsS0FBQTtNQUNBLFVBQUE7O0tBRUEsT0FBQTs7O0dBR0EsT0FBQTs7O0VBR0EsT0FBQSxnQkFBQSxXQUFBO0dBQ0EsWUFBQSxPQUFBLE9BQUEsS0FBQSxTQUFBLEtBQUE7SUFDQSxPQUFBLE9BQUEsUUFBQSxTQUFBLEdBQUEsR0FBQTtLQUNBLElBQUEsTUFBQSxHQUFBO01BQ0E7OztLQUdBLElBQUEsTUFBQSxDQUFBLEVBQUEsWUFBQSxHQUFBLEdBQUE7T0FDQSxDQUFBLEVBQUEsWUFBQSxHQUFBLEdBQUE7O01BRUEsTUFBQSxDQUFBLEVBQUEsWUFBQSxHQUFBLEdBQUE7T0FDQSxDQUFBLEVBQUEsWUFBQSxHQUFBLEdBQUE7O0tBRUEsSUFBQSxZQUFBLEVBQUEsT0FBQSxFQUFBLFlBQUEsR0FBQSxHQUFBLElBQUEsRUFBQSxZQUFBLEdBQUEsR0FBQTtNQUNBLFlBQUEsRUFBQSxPQUFBLEVBQUEsWUFBQSxHQUFBLEdBQUEsSUFBQSxFQUFBLFlBQUEsR0FBQSxHQUFBO01BQ0EsU0FBQSxFQUFBLGFBQUEsV0FBQTtLQUNBLElBQUEsTUFBQTtNQUNBLENBQUEsS0FBQTtNQUNBLENBQUEsR0FBQTs7S0FFQSxJQUFBLE9BQUEsUUFBQSxRQUFBO01BQ0EsTUFBQTtPQUNBLENBQUEsS0FBQTtPQUNBLENBQUEsR0FBQTs7OztLQUlBLElBQUEsVUFBQSxRQUFBO01BQ0EsZ0JBQUEsSUFBQTtNQUNBLG9CQUFBLElBQUE7TUFDQSxTQUFBOzs7SUFHQSxJQUFBLFNBQUE7SUFDQSxJQUFBLFFBQUE7SUFDQSxJQUFBLEtBQUE7SUFDQSxJQUFBLFNBQUE7SUFDQSxJQUFBLE1BQUE7SUFDQSxJQUFBLE9BQUEsb0dBQUE7SUFDQSxPQUFBLFlBQUEsSUFBQSxFQUFBLFVBQUEsVUFBQTtLQUNBLEtBQUE7S0FDQSxPQUFBO0tBQ0EsU0FBQTtLQUNBLGlCQUFBLENBQUE7S0FDQSxhQUFBO0tBQ0EsU0FBQSxTQUFBLEtBQUEsR0FBQTtNQUNBLElBQUEsQ0FBQSxPQUFBLFFBQUEsUUFBQTtPQUNBLElBQUEsSUFBQSxlQUFBLElBQUEsUUFBQSxXQUFBO09BQ0EsR0FBQSxPQUFBLEVBQUEsUUFBQSxZQUFBO1FBQ0EsT0FBQSxVQUFBLGVBQUEsSUFBQSxRQUFBLFdBQUE7O1dBRUE7UUFDQSxTQUFBLEtBQUEsU0FBQSxTQUFBLFFBQUEsZ0NBQUEsU0FBQTs7YUFFQTs7T0FFQSxJQUFBLElBQUEsZUFBQSxJQUFBLFFBQUEsV0FBQTtPQUNBLEdBQUEsT0FBQSxFQUFBLFFBQUEsWUFBQTtRQUNBLE9BQUEsbUJBQUE7O1dBRUE7UUFDQSxTQUFBLEtBQUEsU0FBQSxTQUFBLFFBQUEsZ0NBQUEsU0FBQTs7OztLQUlBLHNCQUFBLFNBQUEsU0FBQTtNQUNBLE9BQUEsUUFBQSxXQUFBOztLQUVBLFFBQUEsU0FBQSxTQUFBLFNBQUE7TUFDQSxPQUFBOztLQUVBLE9BQUE7Ozs7Ozs7OztJQVNBLE1BQUEsWUFBQSxPQUFBO0lBQ0EsSUFBQSxTQUFBLE9BQUE7SUFDQSxPQUFBLFVBQUEsV0FBQTtJQUNBLFNBQUEsVUFBQTtNQUNBLE9BQUE7O0lBRUEsSUFBQSxjQUFBLEVBQUEsVUFBQSxtRkFBQTtJQUNBLElBQUEsU0FBQTtJQUNBLFlBQUE7OztFQUdBLE9BQUE7Ozs7QUN2YUEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsdUNBQUEsU0FBQSxRQUFBLFdBQUE7O0VBRUEsT0FBQSxPQUFBLFVBQUE7R0FDQSxPQUFBLFdBQUE7S0FDQSxTQUFBLFFBQUE7R0FDQSxPQUFBLGVBQUEsV0FBQTs7Ozs7OztBQ1JBLENBQUEsWUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLCtCQUFBLFVBQUEsV0FBQTtFQUNBLEtBQUEsV0FBQTtHQUNBLGFBQUE7R0FDQSxXQUFBO0dBQ0EseUJBQUE7R0FDQSxrQkFBQTs7O0VBR0EsS0FBQSxlQUFBLFVBQUEsTUFBQSxJQUFBO0dBQ0EsVUFBQSxLQUFBLFVBQUE7S0FDQSxNQUFBO0tBQ0EsUUFBQSx3QkFBQSxPQUFBO0tBQ0EsR0FBQTtLQUNBLFlBQUE7Ozs7SUFJQSxLQUFBLGdCQUFBLFdBQUE7R0FDQSxVQUFBLEtBQUE7O0tBRUEsYUFBQTtTQUNBLGtCQUFBOztLQUVBLEtBQUEsVUFBQSxRQUFBOztPQUVBLFlBQUE7Ozs7Ozs7OztBQzVCQSxDQUFBLFlBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSxzRkFBQSxVQUFBLFFBQUEsWUFBQSxVQUFBLFlBQUEsYUFBQSxPQUFBOztFQUVBLElBQUEsU0FBQTtFQUNBLE9BQUEsU0FBQTtHQUNBLEtBQUE7R0FDQSxLQUFBO0dBQ0EsTUFBQTs7RUFFQSxPQUFBLFdBQUE7R0FDQSxpQkFBQTs7RUFFQSxRQUFBLE9BQUEsWUFBQTtHQUNBLFFBQUE7SUFDQSxLQUFBO0lBQ0EsS0FBQTtJQUNBLE1BQUE7O0dBRUEsUUFBQTtJQUNBLFlBQUE7S0FDQSxLQUFBO01BQ0EsTUFBQTtNQUNBLEtBQUEsa0ZBQUE7TUFDQSxNQUFBOzs7SUFHQSxVQUFBO0tBQ0EsY0FBQTtNQUNBLE1BQUE7TUFDQSxNQUFBO01BQ0EsS0FBQTtNQUNBLFNBQUE7Ozs7OztFQU1BLE9BQUEsZ0JBQUE7RUFDQSxPQUFBLE9BQUE7RUFDQSxPQUFBLElBQUEsd0NBQUEsVUFBQSxPQUFBLGNBQUE7Ozs7O0VBS0EsT0FBQSxJQUFBLHVDQUFBLFVBQUEsT0FBQSxjQUFBO0dBQ0EsT0FBQSxnQkFBQTtHQUNBLE9BQUEsT0FBQTs7RUFFQSxXQUFBLGVBQUEsWUFBQSxPQUFBOzs7OztBQ2xEQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSx5Q0FBQSxTQUFBLFFBQUEsYUFBQTs7RUFFQSxPQUFBLGVBQUEsVUFBQTtHQUNBLGFBQUEsS0FBQTs7O0VBR0EsT0FBQSxhQUFBLFVBQUE7R0FDQSxhQUFBLE1BQUE7Ozs7Ozs7QUNWQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSxvQ0FBQSxTQUFBLFFBQUEsT0FBQTs7Ozs7O0FDSEEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsMEJBQUEsVUFBQTs7Ozs7O0FDSEEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsNENBQUEsU0FBQSxRQUFBLGNBQUE7O1FBRUEsT0FBQSxPQUFBLFVBQUE7O1lBRUEsY0FBQTs7O1FBR0EsT0FBQSxPQUFBLFVBQUE7U0FDQSxjQUFBOzs7Ozs7O0FDWEEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxRQUFBLG9CQUFBLFlBQUEsZUFBQSxVQUFBOzs7Ozs7O0FDSEEsQ0FBQSxZQUFBO0NBQ0E7O0NBRUEsU0FBQSxjQUFBLFdBQUEsT0FBQTtFQUNBLElBQUEsWUFBQTtFQUNBLElBQUEsT0FBQSxTQUFBLGVBQUE7RUFDQSxHQUFBLFFBQUEsS0FBQTtHQUNBLFFBQUEsUUFBQSxVQUFBLEtBQUEsUUFBQSxPQUFBLCtDQUFBLFlBQUE7O0VBRUE7RUFDQSxTQUFBLFlBQUEsU0FBQSxNQUFBLE9BQUEsU0FBQTtHQUNBLFFBQUEsUUFBQSxTQUFBLGNBQUEsTUFBQSxZQUFBLEtBQUE7R0FDQSxRQUFBLFFBQUEsU0FBQSxjQUFBLE1BQUEsWUFBQSxJQUFBLFdBQUE7O0dBRUEsT0FBQSxlQUFBLE9BQUEsTUFBQTs7RUFFQSxTQUFBLGNBQUE7R0FDQSxRQUFBLFFBQUEsU0FBQSxjQUFBLE1BQUEsWUFBQSxJQUFBLFdBQUE7O0VBRUEsU0FBQSxlQUFBLE9BQUEsR0FBQSxTQUFBO0dBQ0EsSUFBQSxPQUFBLE1BQUE7R0FDQSxJQUFBLFVBQUE7R0FDQSxJQUFBLFVBQUE7R0FDQSxJQUFBLE1BQUEsUUFBQSxLQUFBLE9BQUE7R0FDQSxJQUFBLFFBQUEsT0FBQTtHQUNBLElBQUEsTUFBQSxRQUFBLFFBQUEsU0FBQSxjQUFBLE9BQUE7R0FDQSxJQUFBLE1BQUEsU0FBQSxjQUFBLE1BQUE7R0FDQSxJQUFBLFFBQUEsSUFBQSx3QkFBQSxNQUFBLEVBQUEsSUFBQSxNQUFBO0dBQ0EsSUFBQSxTQUFBLElBQUEsd0JBQUEsT0FBQSxFQUFBLElBQUEsRUFBQSxTQUFBO0dBQ0EsT0FBQSxRQUFBLFFBQUEsU0FBQSxjQUFBLE9BQUEsSUFBQSxPQUFBLFFBQUEsTUFBQSxJQUFBLFFBQUEsU0FBQTs7RUFFQSxPQUFBO0dBQ0EsYUFBQTtHQUNBLGFBQUE7R0FDQSxnQkFBQTs7O0NBR0EsUUFBQSxPQUFBLGtCQUFBLFVBQUEsd0JBQUEsVUFBQSxVQUFBO0VBQ0EsSUFBQTtFQUNBLFdBQUEsWUFBQTtHQUNBLE9BQUE7SUFDQSxPQUFBO0lBQ0EsUUFBQTtJQUNBLGdCQUFBO0lBQ0EsV0FBQTtJQUNBLEtBQUE7SUFDQSxPQUFBO0lBQ0EsUUFBQTtJQUNBLFNBQUE7SUFDQSxTQUFBO0lBQ0EsUUFBQTtJQUNBLFlBQUEsR0FBQSxNQUFBLFVBQUEsT0FBQSxDQUFBLE1BQUEsT0FBQSxNQUFBLENBQUEsV0FBQTtJQUNBLFlBQUE7SUFDQSxjQUFBO0lBQ0EsVUFBQTtJQUNBLFNBQUEsY0FBQSxtQkFBQTs7O0VBR0EsT0FBQTtHQUNBLFVBQUE7R0FDQSxPQUFBO0lBQ0EsV0FBQTtJQUNBLFdBQUE7SUFDQSxTQUFBO0lBQ0EsWUFBQTtJQUNBLFNBQUE7SUFDQSxTQUFBOztHQUVBLFNBQUE7R0FDQSxNQUFBLFVBQUEsT0FBQSxNQUFBLE9BQUEsU0FBQTtJQUNBLElBQUEsVUFBQSxRQUFBLE9BQUEsWUFBQTtJQUNBLElBQUEsUUFBQTtLQUNBLFFBQUE7S0FDQSxTQUFBO0tBQ0EsU0FBQTs7SUFFQSxJQUFBLGFBQUEsR0FBQSxJQUFBLE1BQUEsV0FBQSxVQUFBLEdBQUE7S0FDQSxPQUFBLFNBQUEsRUFBQTs7O0lBR0EsUUFBQSxlQUFBLEdBQUEsTUFBQSxNQUFBLFNBQUEsS0FBQSxPQUFBLENBQUEsR0FBQSxhQUFBLE1BQUEsQ0FBQSxHQUFBO0lBQ0EsUUFBQSxTQUFBO0tBQ0EsR0FBQSxRQUFBLFFBQUE7S0FDQSxHQUFBLFFBQUEsU0FBQTs7SUFFQSxRQUFBLGNBQUE7S0FDQSxNQUFBO01BQ0EsR0FBQSxRQUFBLFFBQUE7TUFDQSxHQUFBLFFBQUEsVUFBQTtNQUNBLFFBQUE7O0tBRUEsTUFBQTtNQUNBLEdBQUEsUUFBQSxRQUFBO01BQ0EsR0FBQSxRQUFBLFVBQUE7TUFDQSxRQUFBOzs7O0lBSUEsSUFBQSxlQUFBLFlBQUE7OztLQUdBLFFBQUEsUUFBQSxNQUFBLFNBQUEsVUFBQSxPQUFBO01BQ0EsSUFBQSxJQUFBO09BQ0EsTUFBQSxNQUFBO09BQ0EsTUFBQSxNQUFBO09BQ0EsT0FBQSxNQUFBLFlBQUEsVUFBQSxFQUFBO09BQ0EsT0FBQSxNQUFBO09BQ0EsTUFBQSxNQUFBO09BQ0EsU0FBQSxNQUFBO09BQ0EsTUFBQTtPQUNBLFNBQUEsTUFBQTs7TUFFQSxPQUFBLEtBQUE7TUFDQSxRQUFBLFFBQUEsTUFBQSxVQUFBLFVBQUEsTUFBQTs7T0FFQSxJQUFBLE1BQUEsVUFBQSxLQUFBLGNBQUE7UUFDQSxJQUFBLE9BQUE7U0FDQSxNQUFBLEtBQUE7U0FDQSxRQUFBLE1BQUEsVUFBQSxLQUFBLGVBQUEsTUFBQTtTQUNBLE9BQUEsTUFBQSxVQUFBLEtBQUEsZUFBQSxNQUFBO1NBQ0EsTUFBQSxLQUFBO1NBQ0EsT0FBQSxNQUFBLFlBQUEsVUFBQSxFQUFBO1NBQ0EsR0FBQSxRQUFBLE9BQUE7U0FDQSxHQUFBLFFBQUEsT0FBQTtTQUNBLE9BQUEsS0FBQTtTQUNBLE1BQUEsS0FBQTtTQUNBLFNBQUEsS0FBQTtTQUNBLE1BQUE7U0FDQSxTQUFBOztRQUVBLE1BQUEsS0FBQTs7Ozs7S0FLQTs7SUFFQSxJQUFBLGNBQUEsVUFBQTs7S0FFQSxRQUFBO0tBQ0EsU0FBQTs7SUFFQSxJQUFBLGdCQUFBLFVBQUE7S0FDQSxTQUFBO0tBQ0EsSUFBQSxRQUFBO0tBQ0EsUUFBQSxRQUFBLE9BQUEsU0FBQSxLQUFBO09BQ0EsSUFBQSxTQUFBO09BQ0EsSUFBQSxRQUFBO09BQ0EsUUFBQSxRQUFBLFFBQUEsU0FBQSxPQUFBLE1BQUE7UUFDQSxHQUFBLEtBQUEsU0FBQSxNQUFBO1NBQ0EsU0FBQTs7O09BR0EsR0FBQSxDQUFBLE9BQUE7UUFDQTtRQUNBLE9BQUEsS0FBQSxTQUFBO1NBQ0EsR0FBQSxRQUFBLFFBQUE7U0FDQSxHQUFBLFFBQUEsU0FBQSxLQUFBLElBQUE7U0FDQSxRQUFBOzs7Ozs7SUFNQSxJQUFBLGFBQUEsWUFBQTtLQUNBLFFBQUEsUUFBQSxNQUFBLEtBQUE7S0FDQSxRQUFBLE1BQUEsR0FBQSxPQUFBLEtBQUEsSUFBQSxPQUFBLE9BQUEsS0FBQSxTQUFBLFFBQUEsT0FBQSxLQUFBLFVBQUEsUUFBQSxRQUFBLEtBQUEsTUFBQTs7S0FFQSxJQUFBLENBQUEsUUFBQSxTQUFBO01BQ0EsSUFBQSxLQUFBLEtBQUE7TUFDQSxHQUFBLE9BQUEsVUFBQSxFQUFBO09BQ0EsSUFBQSxTQUFBLEdBQUEsSUFBQTtTQUNBLFlBQUE7U0FDQSxZQUFBO1NBQ0EsV0FBQSxDQUFBLE1BQUEsS0FBQTtTQUNBLFNBQUEsTUFBQSxLQUFBO09BQ0EsSUFBQSxZQUFBLEdBQUEsSUFBQTtTQUNBLFlBQUE7U0FDQSxZQUFBO1NBQ0EsV0FBQSxNQUFBLEtBQUE7U0FDQSxTQUFBLE9BQUEsS0FBQTs7T0FFQSxRQUFBLFNBQUEsUUFBQSxJQUFBLE9BQUE7U0FDQSxLQUFBLEtBQUE7U0FDQSxLQUFBLFFBQUE7U0FDQSxLQUFBLE1BQUE7U0FDQSxLQUFBLGFBQUEsY0FBQSxRQUFBLE1BQUEsR0FBQSxLQUFBLFFBQUEsT0FBQSxJQUFBLFFBQUEsT0FBQSxJQUFBO09BQ0EsUUFBQSxZQUFBLFFBQUEsSUFBQSxPQUFBO1NBQ0EsS0FBQSxLQUFBO1NBQ0EsS0FBQSxNQUFBO1NBQ0EsS0FBQSxRQUFBO1NBQ0EsS0FBQSxhQUFBLGNBQUEsUUFBQSxNQUFBLEdBQUEsS0FBQSxRQUFBLE9BQUEsR0FBQTs7VUFFQTtPQUNBLElBQUEsTUFBQSxHQUFBLElBQUE7U0FDQSxZQUFBLFFBQUEsTUFBQSxJQUFBO1NBQ0EsWUFBQSxRQUFBLE1BQUE7U0FDQSxXQUFBLEtBQUEsS0FBQTtTQUNBLFNBQUEsT0FBQSxLQUFBOzs7T0FHQSxRQUFBLE1BQUEsUUFBQSxJQUFBLE9BQUE7U0FDQSxLQUFBLEtBQUE7U0FDQSxLQUFBLFFBQUEsT0FBQSxHQUFBO1NBQ0EsS0FBQSxNQUFBO1NBQ0EsS0FBQSxhQUFBLGNBQUEsUUFBQSxNQUFBLEdBQUEsS0FBQSxRQUFBLE9BQUEsR0FBQTs7OztJQUlBLEdBQUEsUUFBQSxVQUFBLEtBQUE7TUFDQSxJQUFBLGFBQUEsUUFBQSxJQUFBLFVBQUEsZUFBQSxLQUFBLFFBQUEsUUFBQSxPQUFBO1FBQ0EsS0FBQSxTQUFBO1FBQ0EsS0FBQSxRQUFBLFNBQUEsRUFBQTtRQUNBLE9BQUEsRUFBQTs7Ozs7Ozs7UUFRQSxLQUFBLEtBQUE7UUFDQSxNQUFBLGFBQUE7UUFDQSxNQUFBLFVBQUE7O1FBRUEsS0FBQSxTQUFBLFFBQUE7UUFDQSxLQUFBLGVBQUE7UUFDQSxHQUFBLFNBQUEsU0FBQSxFQUFBO1FBQ0EsUUFBQSxjQUFBLEVBQUE7UUFDQSxRQUFBOztRQUVBLEtBQUEsS0FBQSxTQUFBLEVBQUE7UUFDQSxJQUFBLFFBQUEsT0FBQSxRQUFBO1FBQ0EsR0FBQSxTQUFBLEVBQUE7U0FDQSxPQUFBOztZQUVBO1NBQ0EsT0FBQSxRQUFBLFNBQUE7OztRQUdBLEtBQUEsU0FBQSxFQUFBO1FBQ0EsT0FBQSxFQUFBOzs7O0tBSUEsUUFBQSxhQUFBLFFBQUEsSUFBQSxVQUFBLFVBQUEsS0FBQSxPQUFBLFFBQUEsT0FBQSxLQUFBLEtBQUEsYUFBQSxnQkFBQSxRQUFBLFFBQUEsS0FBQSxPQUFBLFFBQUEsU0FBQSxLQUFBLEtBQUEsS0FBQSxTQUFBOzs7Ozs7S0FNQSxRQUFBLFVBQUEsUUFBQSxXQUFBLE9BQUEsVUFBQSxLQUFBLEtBQUEsR0FBQSxLQUFBLFNBQUEsVUFBQSxHQUFBO01BQ0EsT0FBQSxFQUFBLFNBQUEsUUFBQSxXQUFBLEVBQUE7U0FDQSxLQUFBLGdCQUFBLEdBQUEsS0FBQSxVQUFBLFVBQUEsR0FBQTtNQUNBLE9BQUEsR0FBQSxJQUFBLFFBQUEsV0FBQSxFQUFBLFFBQUE7UUFDQSxLQUFBLE1BQUEsVUFBQSxHQUFBO01BQ0EsT0FBQSxZQUFBLEVBQUE7O0tBRUEsUUFBQSxRQUFBLFFBQUEsV0FBQSxPQUFBO09BQ0EsS0FBQSxlQUFBO09BQ0EsS0FBQSxhQUFBLFVBQUEsR0FBQTs7O09BR0EsS0FBQSxlQUFBO09BQ0EsS0FBQSxRQUFBLFNBQUEsRUFBQTtPQUNBLE9BQUEsRUFBQSxVQUFBLFNBQUEsRUFBQTs7T0FFQSxLQUFBLFVBQUEsR0FBQTtPQUNBLE9BQUEsRUFBQSxXQUFBOztLQUVBLFFBQUEsTUFBQSxHQUFBLGFBQUEsVUFBQSxHQUFBLEdBQUE7TUFDQSxPQUFBLGFBQUEsR0FBQSxHQUFBO1FBQ0EsR0FBQSxZQUFBLFVBQUEsR0FBQSxHQUFBO01BQ0EsT0FBQSxhQUFBLEdBQUEsR0FBQTtRQUNBLEdBQUEsU0FBQSxVQUFBLEdBQUEsR0FBQTs7TUFFQSxRQUFBLGNBQUE7TUFDQSxRQUFBOztLQUVBLFFBQUEsUUFBQSxhQUFBLFNBQUEsUUFBQSxVQUFBLEtBQUEsS0FBQSxVQUFBLEdBQUE7TUFDQSxPQUFBLEVBQUE7O0tBRUEsUUFBQSxNQUFBLGFBQUEsU0FBQSxRQUFBLFVBQUEsS0FBQSxhQUFBLFVBQUEsR0FBQTtNQUNBLE9BQUEsRUFBQSxTQUFBLE9BQUE7UUFDQSxLQUFBLEtBQUEsVUFBQSxHQUFBO01BQ0EsT0FBQSxFQUFBLFNBQUEsTUFBQTs7O0lBR0EsSUFBQSxhQUFBLFlBQUE7O0tBRUEsTUFBQSxRQUFBLFVBQUEsR0FBQSxHQUFBO01BQ0EsUUFBQSxRQUFBLGFBQUEsU0FBQSxRQUFBLFVBQUEsTUFBQSxJQUFBLFFBQUE7UUFDQSxLQUFBLEtBQUEsVUFBQSxHQUFBO1FBQ0EsRUFBQSxTQUFBLEVBQUEsUUFBQSxNQUFBLFVBQUEsRUFBQSxRQUFBLE1BQUE7O1FBRUEsT0FBQSxNQUFBLFVBQUEsRUFBQSxRQUFBLE1BQUE7O01BRUEsUUFBQSxNQUFBLGFBQUEsU0FBQSxRQUFBLFVBQUEsTUFBQSxJQUFBLFFBQUE7UUFDQSxLQUFBLGFBQUEsVUFBQSxHQUFBO1FBQ0EsT0FBQSxDQUFBLE1BQUEsVUFBQSxFQUFBLFFBQUEsTUFBQSxjQUFBLE9BQUE7O1FBRUEsS0FBQSxLQUFBLFVBQUEsR0FBQTtRQUNBLE9BQUEsQ0FBQSxNQUFBLFVBQUEsRUFBQSxRQUFBLE1BQUEsY0FBQSxNQUFBOzs7O0lBSUEsSUFBQSxTQUFBLFVBQUEsR0FBQTtLQUNBLE9BQUEsQ0FBQSxLQUFBLElBQUEsRUFBQSxRQUFBLE9BQUE7O0lBRUEsSUFBQSxRQUFBLFlBQUE7S0FDQSxPQUFBLFFBQUEsUUFBQSxHQUFBLE9BQUEsUUFBQSxNQUFBLE9BQUEsS0FBQSxDQUFBLFFBQUEsT0FBQSxRQUFBLFNBQUEsTUFBQTs7SUFFQSxJQUFBLG9CQUFBLFlBQUE7S0FDQSxRQUFBLE1BQUEsUUFBQSxRQUFBLGdCQUFBLE9BQUEsUUFBQSxTQUFBLE1BQUEsR0FBQSxRQUFBLFVBQUEsR0FBQTtNQUNBLFFBQUEsV0FBQSxLQUFBLG9CQUFBLEVBQUEsUUFBQSxLQUFBLGFBQUEsVUFBQSxHQUFBO09BQ0EsT0FBQSxlQUFBLEVBQUEsSUFBQSxNQUFBLEVBQUEsSUFBQTs7O0tBR0EsUUFBQSxNQUFBOztJQUVBLElBQUEsaUJBQUEsWUFBQTtLQUNBLFFBQUEsTUFBQSxRQUFBLFFBQUEsZ0JBQUEsT0FBQSxRQUFBLFNBQUEsS0FBQSxHQUFBLFFBQUEsVUFBQSxHQUFBO01BQ0EsUUFBQSxXQUFBLEtBQUEsaUJBQUEsRUFBQSxRQUFBLEtBQUEsYUFBQSxVQUFBLEdBQUE7T0FDQSxPQUFBLGVBQUEsRUFBQSxJQUFBLE1BQUEsRUFBQSxJQUFBOzs7S0FHQSxRQUFBLE1BQUE7O0lBRUEsSUFBQSxzQkFBQSxVQUFBLE9BQUE7S0FDQSxPQUFBLENBQUEsVUFBQSxPQUFBO01BQ0EsT0FBQSxVQUFBLEdBQUE7T0FDQSxFQUFBLElBQUEsRUFBQSxJQUFBLENBQUEsUUFBQSxNQUFBLElBQUEsRUFBQSxNQUFBLFFBQUEsU0FBQSxRQUFBLE9BQUE7T0FDQSxFQUFBLElBQUEsRUFBQSxJQUFBLENBQUEsUUFBQSxPQUFBLElBQUEsRUFBQSxNQUFBLFFBQUEsU0FBQSxRQUFBLFFBQUE7O1FBRUE7O0lBRUEsSUFBQSxtQkFBQSxVQUFBLE9BQUE7S0FDQSxPQUFBLENBQUEsVUFBQSxPQUFBO01BQ0EsT0FBQSxVQUFBLEdBQUE7T0FDQSxFQUFBLElBQUEsRUFBQSxJQUFBLENBQUEsUUFBQSxPQUFBLElBQUEsRUFBQSxNQUFBLFFBQUEsU0FBQSxRQUFBLFFBQUE7T0FDQSxFQUFBLElBQUEsRUFBQSxJQUFBLENBQUEsTUFBQSxFQUFBLE1BQUEsUUFBQSxTQUFBLFFBQUEsUUFBQTs7UUFFQTs7SUFFQSxJQUFBLG1CQUFBLFVBQUEsT0FBQTtLQUNBLE9BQUEsQ0FBQSxVQUFBLE9BQUE7TUFDQSxPQUFBLFVBQUEsR0FBQTtPQUNBLElBQUE7T0FDQSxTQUFBLFFBQUEsWUFBQSxFQUFBO09BQ0EsRUFBQSxJQUFBLEVBQUEsSUFBQSxDQUFBLE9BQUEsSUFBQSxFQUFBLE1BQUEsT0FBQSxTQUFBLFFBQUEsUUFBQTtPQUNBLE9BQUEsRUFBQSxJQUFBLEVBQUEsSUFBQSxDQUFBLE9BQUEsSUFBQSxFQUFBLE1BQUEsT0FBQSxTQUFBLFFBQUEsUUFBQTs7UUFFQTs7SUFFQSxJQUFBLGVBQUEsVUFBQSxNQUFBLEdBQUEsU0FBQTtLQUNBLElBQUE7S0FDQSxVQUFBLDJCQUFBLEtBQUEsT0FBQTtLQUNBLFFBQUEsUUFBQSxLQUFBLEtBQUEsVUFBQSxVQUFBLE1BQUE7TUFDQSxXQUFBLHlDQUFBLEtBQUEsU0FBQSxLQUFBLFNBQUEsVUFBQSxLQUFBLFNBQUE7O0tBRUEsU0FBQSxRQUFBLFFBQUEsWUFBQSxTQUFBLE1BQUEsR0FBQSxPQUFBLE1BQUEsWUFBQTs7O0lBR0EsSUFBQSxlQUFBLFVBQUEsTUFBQSxHQUFBLFNBQUE7S0FDQSxPQUFBLFFBQUEsUUFBQTs7O0lBR0EsTUFBQSxPQUFBLGFBQUEsVUFBQSxNQUFBLFNBQUE7S0FDQSxRQUFBLFFBQUE7O0tBRUEsSUFBQSxRQUFBLFdBQUEsTUFBQTtNQUNBO01BQ0E7TUFDQTtZQUNBO01BQ0E7O0tBRUEsR0FBQSxPQUFBLFVBQUEsS0FBQSxRQUFBLFVBQUEsS0FBQTtPQUNBOztTQUVBO09BQ0E7Ozs7SUFJQSxNQUFBLE9BQUEsV0FBQSxVQUFBLEdBQUEsR0FBQTtLQUNBLEdBQUEsTUFBQSxFQUFBO01BQ0E7OztLQUdBLEdBQUEsT0FBQSxFQUFBLEdBQUEsWUFBQSxZQUFBO01BQ0EsUUFBQSxRQUFBO01BQ0E7TUFDQTtNQUNBO01BQ0E7O01BRUEsR0FBQSxPQUFBLFVBQUEsS0FBQSxRQUFBLFVBQUEsS0FBQTtRQUNBO1FBQ0EsUUFBQSxJQUFBOztVQUVBO1FBQ0E7Ozs7SUFJQSxNQUFBLE9BQUEsYUFBQSxVQUFBLE1BQUEsTUFBQTtLQUNBLElBQUEsU0FBQSxNQUFBO01BQ0E7O0tBRUEsSUFBQSxRQUFBLE9BQUE7TUFDQTtZQUNBO01BQ0E7Ozs7Ozs7O0FDN1pBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsUUFBQSxvQkFBQSxZQUFBLG1CQUFBLFVBQUE7Ozs7OztBQ0hBLENBQUEsV0FBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxrQkFBQSxVQUFBLDRCQUFBLFNBQUEsVUFBQTtFQUNBLElBQUEsV0FBQSxXQUFBO0dBQ0EsT0FBQTtJQUNBLE9BQUE7SUFDQSxRQUFBO0lBQ0EsT0FBQTtJQUNBLE1BQUE7SUFDQSxPQUFBOzs7RUFHQSxPQUFBO0dBQ0EsVUFBQTtHQUNBLFlBQUE7R0FDQSxPQUFBO0lBQ0EsU0FBQTs7R0FFQSxTQUFBO0dBQ0EsTUFBQSxTQUFBLFFBQUEsU0FBQSxRQUFBLFNBQUE7OztJQUdBLE9BQUEsVUFBQSxRQUFBLE9BQUEsWUFBQSxPQUFBOzs7SUFHQSxJQUFBLFNBQUEsR0FBQSxNQUFBO01BQ0EsT0FBQSxDQUFBLEdBQUEsT0FBQSxRQUFBO01BQ0EsTUFBQSxDQUFBLEdBQUE7TUFDQSxNQUFBOzs7SUFHQSxJQUFBLE1BQUEsR0FBQSxPQUFBLFFBQUEsSUFBQSxPQUFBO01BQ0EsS0FBQSxTQUFBLE9BQUEsUUFBQTtNQUNBLEtBQUEsVUFBQSxPQUFBLFFBQUE7TUFDQSxPQUFBO0lBQ0EsSUFBQSxZQUFBLElBQUEsT0FBQTtNQUNBLEtBQUEsYUFBQSxlQUFBLE9BQUEsUUFBQSxRQUFBLElBQUEsTUFBQSxPQUFBLFFBQUEsU0FBQSxJQUFBO0lBQ0EsSUFBQSxhQUFBLFVBQUEsT0FBQTtNQUNBLEtBQUEsS0FBQSxPQUFBLFFBQUEsUUFBQSxJQUFBO01BQ0EsS0FBQSxnQkFBQTtNQUNBLEtBQUEsVUFBQSxPQUFBLFFBQUE7TUFDQSxNQUFBLFdBQUE7TUFDQSxLQUFBLFFBQUE7SUFDQSxJQUFBLE1BQUEsR0FBQSxJQUFBO01BQ0EsV0FBQTtNQUNBLFlBQUEsU0FBQSxHQUFBO01BQ0EsT0FBQSxPQUFBLFFBQUEsUUFBQSxJQUFBOztNQUVBLFlBQUEsU0FBQSxHQUFBO01BQ0EsT0FBQSxPQUFBLFFBQUEsUUFBQTs7SUFFQSxJQUFBLGNBQUEsVUFBQSxPQUFBO01BQ0EsTUFBQTtNQUNBLFVBQUEsSUFBQSxLQUFBLEtBQUE7O01BRUEsTUFBQSxRQUFBLE9BQUEsUUFBQTtNQUNBLEtBQUEsS0FBQTtJQUNBLElBQUEsT0FBQSxVQUFBLFVBQUE7TUFDQSxLQUFBLENBQUE7TUFDQTtNQUNBLE9BQUE7TUFDQSxLQUFBLFNBQUEsR0FBQTtNQUNBLE9BQUEsT0FBQTs7T0FFQSxNQUFBLFFBQUEsT0FBQSxRQUFBO01BQ0EsTUFBQSxlQUFBO01BQ0EsS0FBQSxlQUFBO01BQ0EsS0FBQSxLQUFBOzs7SUFHQSxTQUFBLFVBQUEsUUFBQTtLQUNBLFlBQUE7T0FDQSxTQUFBO09BQ0EsS0FBQSxVQUFBLE9BQUEsVUFBQSxJQUFBLEtBQUE7S0FDQSxLQUFBLGFBQUEsU0FBQSxLQUFBLE1BQUEsUUFBQSxTQUFBLEdBQUE7TUFDQSxJQUFBLE9BQUEsS0FBQSxZQUFBLE1BQUE7O01BRUEsSUFBQSxJQUFBLEdBQUEsWUFBQSxLQUFBLElBQUE7TUFDQSxPQUFBLFNBQUEsR0FBQTtPQUNBLEtBQUEsZUFBQSxRQUFBLEtBQUEsTUFBQSxFQUFBLEtBQUEsS0FBQTs7Ozs7O0lBTUEsU0FBQSxTQUFBLFlBQUEsVUFBQTtLQUNBLFdBQUEsVUFBQSxLQUFBLFNBQUEsR0FBQTtNQUNBLElBQUEsY0FBQSxHQUFBLFlBQUEsRUFBQSxVQUFBO01BQ0EsT0FBQSxTQUFBLEdBQUE7T0FDQSxFQUFBLFdBQUEsWUFBQTtPQUNBLE9BQUEsSUFBQTs7OztJQUlBLE9BQUEsT0FBQSxVQUFBLFNBQUEsR0FBQSxFQUFBO01BQ0EsR0FBQSxNQUFBLEVBQUE7T0FDQTs7TUFFQSxRQUFBLElBQUE7TUFDQSxXQUFBLE1BQUEsVUFBQSxFQUFBO01BQ0EsWUFBQSxNQUFBLFFBQUEsRUFBQTtNQUNBLEtBQUEsTUFBQSxRQUFBLEVBQUE7TUFDQSxTQUFBLFVBQUE7T0FDQSxVQUFBLFFBQUEsWUFBQSxFQUFBOzs7O0lBSUEsT0FBQTtLQUNBLFdBQUE7TUFDQSxPQUFBLFFBQUE7O0tBRUEsU0FBQSxVQUFBLFVBQUE7TUFDQSxTQUFBLFVBQUE7T0FDQSxRQUFBLEtBQUEsU0FBQSxPQUFBLFFBQUE7T0FDQSxRQUFBLEtBQUEsU0FBQSxPQUFBLFFBQUE7Ozs7TUFJQSxJQUFBLENBQUEsU0FBQTtPQUNBLFdBQUE7T0FDQSxTQUFBLE9BQUEsUUFBQSxTQUFBLE9BQUEsUUFBQTs7O01BR0EsU0FBQSxVQUFBO09BQ0EsVUFBQSxTQUFBLE9BQUEsUUFBQTs7Ozs7Ozs7OztBQzdIQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsa0JBQUEsV0FBQSxXQUFBLFdBQUE7RUFDQSxJQUFBLFdBQUEsVUFBQTtHQUNBLE9BQUE7SUFDQSxPQUFBO0lBQ0EsT0FBQTs7O0VBR0EsT0FBQTtHQUNBLFVBQUE7R0FDQSxhQUFBO0dBQ0EsWUFBQTtHQUNBLE1BQUE7SUFDQSxRQUFBO0lBQ0EsV0FBQTs7R0FFQSxNQUFBLFVBQUEsUUFBQSxTQUFBLFFBQUEsUUFBQTtLQUNBLElBQUEsVUFBQSxRQUFBLE9BQUEsWUFBQSxPQUFBOzs7Ozs7OztBQ25CQSxDQUFBLFlBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSwwQkFBQSxVQUFBLFFBQUE7RUFDQSxPQUFBLFVBQUE7RUFDQTs7RUFFQSxTQUFBLFVBQUE7R0FDQSxPQUFBO0dBQ0EsT0FBQSxPQUFBLFdBQUEsU0FBQSxFQUFBLEVBQUE7SUFDQSxHQUFBLE1BQUEsRUFBQTtLQUNBOztJQUVBLE9BQUE7OztFQUdBLFNBQUEsU0FBQTtHQUNBLE9BQUEsVUFBQTtJQUNBLGFBQUE7SUFDQSxNQUFBLENBQUE7S0FDQSxRQUFBO01BQ0EsR0FBQTtNQUNBLEdBQUE7O0tBRUEsT0FBQTtLQUNBLE9BQUE7O0lBRUEsT0FBQSxDQUFBO0tBQ0EsUUFBQTtNQUNBLEdBQUE7TUFDQSxHQUFBLE9BQUEsUUFBQTs7S0FFQSxPQUFBO0tBQ0EsT0FBQSxPQUFBLFFBQUE7Ozs7Ozs7O0FDakNBLENBQUEsWUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxrQkFBQSxVQUFBLHVCQUFBLFVBQUEsVUFBQTtFQUNBLElBQUEsV0FBQSxZQUFBO0dBQ0EsT0FBQTtJQUNBLElBQUE7SUFDQSxPQUFBO0lBQ0EsUUFBQTtJQUNBLE1BQUE7SUFDQSxPQUFBO0lBQ0EsVUFBQTtJQUNBLFFBQUE7S0FDQSxNQUFBO0tBQ0EsT0FBQTtLQUNBLEtBQUE7S0FDQSxRQUFBOztJQUVBLFFBQUEsRUFBQTtLQUNBLFVBQUE7S0FDQSxPQUFBO0tBQ0EsU0FBQTtPQUNBO0tBQ0EsVUFBQTtLQUNBLE9BQUE7S0FDQSxTQUFBO01BQ0E7S0FDQSxVQUFBO0tBQ0EsT0FBQTtLQUNBLFNBQUE7Ozs7RUFJQSxPQUFBO0dBQ0EsVUFBQTtHQUNBLE9BQUE7SUFDQSxNQUFBO0lBQ0EsU0FBQTs7R0FFQSxTQUFBO0dBQ0EsTUFBQSxVQUFBLFFBQUEsU0FBQSxRQUFBLFNBQUE7SUFDQSxJQUFBLFVBQUEsUUFBQSxPQUFBLFlBQUE7SUFDQSxVQUFBLFFBQUEsT0FBQSxTQUFBLE9BQUE7SUFDQSxHQUFBLFFBQUEsTUFBQTtLQUNBLFFBQUEsT0FBQSxHQUFBLFFBQUEsUUFBQTs7SUFFQSxRQUFBLElBQUEsVUFBQSxRQUFBLFNBQUEsTUFBQSxJQUFBLGlCQUFBLFFBQUEsU0FBQSxJQUFBO0lBQ0EsSUFBQSxJQUFBLEdBQUEsTUFBQTtNQUNBLE9BQUEsQ0FBQSxHQUFBO01BQ0EsTUFBQSxDQUFBLFFBQUEsT0FBQSxNQUFBLFFBQUEsUUFBQSxRQUFBLE9BQUE7TUFDQSxNQUFBOztJQUVBLElBQUEsUUFBQSxHQUFBLElBQUE7TUFDQSxFQUFBO01BQ0EsT0FBQSxDQUFBLEdBQUE7TUFDQSxHQUFBLFNBQUE7TUFDQSxHQUFBLFlBQUE7O0lBRUEsSUFBQSxNQUFBLEdBQUEsT0FBQSxRQUFBLElBQUEsT0FBQTtNQUNBLEtBQUEsU0FBQSxRQUFBO01BQ0EsS0FBQSxVQUFBLFFBQUE7TUFDQSxPQUFBOztJQUVBLElBQUEsV0FBQSxJQUFBLE9BQUE7TUFDQSxPQUFBO01BQ0EsS0FBQSxNQUFBLFFBQUE7TUFDQSxLQUFBLE1BQUE7TUFDQSxLQUFBLE1BQUE7TUFDQSxLQUFBLE1BQUE7TUFDQSxLQUFBLE1BQUE7TUFDQSxLQUFBLGdCQUFBO0lBQ0EsUUFBQSxRQUFBLFFBQUEsUUFBQSxVQUFBLE9BQUE7S0FDQSxTQUFBLE9BQUE7T0FDQSxLQUFBLFVBQUEsTUFBQSxXQUFBO09BQ0EsS0FBQSxjQUFBLE1BQUE7T0FDQSxLQUFBLGdCQUFBLE1BQUE7O0lBRUEsSUFBQSxPQUFBLElBQUEsT0FBQTtNQUNBLEtBQUEsU0FBQSxRQUFBO01BQ0EsS0FBQSxVQUFBLFFBQUE7TUFDQSxNQUFBLFFBQUEsVUFBQSxRQUFBLFFBQUE7SUFDQSxJQUFBLFNBQUEsSUFBQSxPQUFBLEtBQUEsS0FBQSxhQUFBLGVBQUEsUUFBQSxTQUFBLElBQUEsT0FBQSxRQUFBLFNBQUEsSUFBQTtNQUNBLEtBQUEsU0FBQTs7SUFFQSxJQUFBLFFBQUEsU0FBQSxNQUFBO0tBQ0EsT0FBQSxPQUFBO09BQ0EsS0FBQSxLQUFBLFFBQUEsU0FBQTtLQUNBLE9BQUEsT0FBQTtPQUNBLEtBQUE7T0FDQSxNQUFBLGFBQUEsUUFBQSxPQUFBO09BQ0EsS0FBQSxlQUFBO09BQ0EsS0FBQSxLQUFBO0tBQ0EsSUFBQSxVQUFBLElBQUEsT0FBQSxLQUFBLEtBQUEsYUFBQSxnQkFBQSxRQUFBLFNBQUEsUUFBQSxTQUFBLE1BQUEsT0FBQSxRQUFBLFNBQUEsSUFBQTtPQUNBLEtBQUEsU0FBQTtLQUNBLFFBQUEsT0FBQTtPQUNBLEtBQUEsS0FBQSxRQUFBLFNBQUE7S0FDQSxRQUFBLE9BQUE7T0FDQSxLQUFBO09BQ0EsTUFBQSxhQUFBLFFBQUEsT0FBQTtPQUNBLEtBQUEsZUFBQTtPQUNBLEtBQUEsS0FBQTs7SUFFQSxJQUFBLFNBQUEsSUFBQSxPQUFBO01BQ0EsS0FBQSxTQUFBO0lBQ0EsR0FBQSxRQUFBLFlBQUEsS0FBQTtLQUNBLE9BQUEsS0FBQTs7O0lBR0EsT0FBQSxPQUFBO01BQ0EsS0FBQSxVQUFBLFFBQUE7O0lBRUEsSUFBQSxRQUFBLFNBQUEsTUFBQTtJQUNBLE9BQUEsT0FBQTtNQUNBLEtBQUEsTUFBQSxRQUFBLFFBQUE7TUFDQSxLQUFBLE1BQUE7TUFDQSxLQUFBLE1BQUEsUUFBQSxRQUFBO01BQ0EsS0FBQSxNQUFBLFFBQUE7TUFDQSxLQUFBLG9CQUFBO01BQ0EsS0FBQSxnQkFBQTtNQUNBLEtBQUEsVUFBQTs7SUFFQSxJQUFBLGFBQUEsT0FBQSxPQUFBO01BQ0EsS0FBQSxhQUFBLGlCQUFBLFFBQUEsU0FBQSxJQUFBO0lBQ0EsSUFBQSxTQUFBLFdBQUEsT0FBQTtNQUNBLEtBQUEsU0FBQTtNQUNBLEtBQUEsS0FBQSxRQUFBLFNBQUE7S0FDQSxHQUFBLFFBQUEsTUFBQTtNQUNBLE9BQUEsTUFBQSxRQUFBLFFBQUE7O0lBRUEsSUFBQSxjQUFBLFdBQUEsT0FBQTtNQUNBLEtBQUE7TUFDQSxNQUFBLGFBQUEsUUFBQSxPQUFBO01BQ0EsS0FBQSxlQUFBLFVBQUEsS0FBQSxLQUFBOzs7Ozs7SUFNQSxTQUFBLFFBQUE7S0FDQSxJQUFBLFFBQUEsTUFBQSxTQUFBOztLQUVBLElBQUEsR0FBQSxNQUFBLGFBQUE7TUFDQSxRQUFBLEVBQUEsT0FBQSxHQUFBLE1BQUEsTUFBQTtNQUNBLE1BQUEsT0FBQSxDQUFBLE9BQUE7O0tBRUEsWUFBQSxLQUFBLFNBQUE7S0FDQSxXQUFBLEtBQUEsYUFBQSxlQUFBLEVBQUEsU0FBQSxNQUFBLFFBQUEsU0FBQSxJQUFBOzs7SUFHQSxTQUFBLFVBQUE7S0FDQSxJQUFBLFFBQUEsTUFBQSxTQUFBO01BQ0EsUUFBQTtNQUNBLFFBQUE7S0FDQSxJQUFBLFFBQUE7S0FDQSxHQUFBOztNQUVBLFFBQUEsUUFBQSxPQUFBLE1BQUEsVUFBQSxLQUFBLEtBQUE7T0FDQSxJQUFBLFNBQUEsSUFBQSxRQUFBLFdBQUEsU0FBQSxRQUFBO1FBQ0EsUUFBQTtRQUNBLFFBQUE7OztNQUdBO01BQ0EsUUFBQSxRQUFBLEtBQUEsUUFBQSxJQUFBLFFBQUE7Y0FDQSxDQUFBLFNBQUEsUUFBQTtLQUNBLFFBQUEsSUFBQTtLQUNBLFFBQUEsY0FBQTtLQUNBLFFBQUE7O0lBRUEsT0FBQSxPQUFBLFdBQUEsU0FBQSxFQUFBLEVBQUE7S0FDQSxHQUFBLE1BQUEsRUFBQTtNQUNBOztLQUVBLFFBQUEsT0FBQSxHQUFBLFFBQUEsRUFBQTtLQUNBLFdBQUEsSUFBQSxPQUFBO09BQ0EsT0FBQTtPQUNBLEtBQUEsTUFBQSxRQUFBLE1BQUEsSUFBQSxFQUFBO09BQ0EsS0FBQSxNQUFBO09BQ0EsS0FBQSxNQUFBO09BQ0EsS0FBQSxNQUFBO09BQ0EsS0FBQSxNQUFBO09BQ0EsS0FBQSxnQkFBQTtLQUNBLFFBQUEsUUFBQSxRQUFBLFFBQUEsVUFBQSxPQUFBO01BQ0EsU0FBQSxPQUFBO1FBQ0EsS0FBQSxVQUFBLE1BQUEsV0FBQTtRQUNBLEtBQUEsY0FBQSxNQUFBO1FBQ0EsS0FBQSxnQkFBQSxNQUFBOztLQUVBLEtBQUEsTUFBQSxRQUFBLFVBQUEsUUFBQSxRQUFBLElBQUEsRUFBQSxNQUFBO0tBQ0EsT0FBQSxNQUFBLFFBQUEsRUFBQTtLQUNBLFlBQUEsS0FBQSxTQUFBLFFBQUEsWUFBQSxFQUFBO0tBQ0EsV0FBQSxhQUFBLFNBQUEsS0FBQSxLQUFBLFFBQUEsS0FBQSxhQUFBLGVBQUEsRUFBQSxRQUFBLFlBQUEsRUFBQSxVQUFBLE1BQUEsUUFBQSxTQUFBLElBQUE7O0lBRUEsT0FBQTtLQUNBLFlBQUE7TUFDQSxPQUFBLFFBQUE7O0tBRUEsVUFBQSxVQUFBLFVBQUE7TUFDQSxJQUFBLENBQUEsVUFBQTtPQUNBLFlBQUEsS0FBQSxTQUFBO09BQ0EsV0FBQSxLQUFBLGFBQUEsZUFBQSxFQUFBLEtBQUEsTUFBQSxRQUFBLFNBQUEsSUFBQTtPQUNBOztNQUVBLFlBQUEsS0FBQSxTQUFBLFNBQUEsUUFBQTtNQUNBLElBQUEsWUFBQSxVQUFBO09BQ0EsV0FBQSxLQUFBLGFBQUEsZUFBQSxFQUFBLFNBQUEsUUFBQSxVQUFBLE1BQUEsUUFBQSxTQUFBLElBQUE7YUFDQTtPQUNBLFdBQUEsYUFBQSxTQUFBLEtBQUEsS0FBQSxRQUFBLEtBQUEsYUFBQSxlQUFBLEVBQUEsU0FBQSxRQUFBLFVBQUEsTUFBQSxRQUFBLFNBQUEsSUFBQTs7Ozs7Ozs7Ozs7QUMvTUEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxRQUFBLG9CQUFBLFlBQUEsY0FBQSxVQUFBOzs7Ozs7QUNIQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsa0JBQUEsVUFBQSxpQkFBQSxDQUFBLGVBQUEsU0FBQSxhQUFBOztFQUVBLElBQUEsU0FBQTtRQUNBLElBQUEsU0FBQTs7UUFFQSxTQUFBLE1BQUEsSUFBQTtZQUNBLElBQUEsS0FBQSxHQUFBLEdBQUEsYUFBQTtZQUNBLElBQUEsQ0FBQSxJQUFBO2dCQUNBLEtBQUEsRUFBQTtnQkFDQSxHQUFBLEdBQUEsYUFBQSxxQkFBQTs7WUFFQSxPQUFBOztRQUVBLFNBQUEsU0FBQSxJQUFBO1lBQ0EsSUFBQSxRQUFBLE9BQUE7WUFDQSxJQUFBLENBQUEsT0FBQTtnQkFDQSxRQUFBO2dCQUNBLE9BQUEsTUFBQTs7WUFFQSxPQUFBOzs7UUFHQSxTQUFBLGVBQUEsU0FBQSxPQUFBLFVBQUEsU0FBQSxRQUFBO1lBQ0EsT0FBQSxXQUFBO2dCQUNBLE1BQUEsWUFBQTtnQkFDQSxNQUFBLFdBQUE7Z0JBQ0EsTUFBQSxTQUFBO2dCQUNBLFNBQUEsUUFBQSxRQUFBLFdBQUE7b0JBQ0EsSUFBQSxXQUFBLE1BQUEsV0FBQSxRQUFBO3dCQUNBLFFBQUEsR0FBQSxNQUFBLFNBQUE7O29CQUVBLE1BQUEsWUFBQTtvQkFDQSxNQUFBLFdBQUE7b0JBQ0EsTUFBQTs7Ozs7UUFLQSxPQUFBO1lBQ0EsT0FBQSxTQUFBLFNBQUEsUUFBQTs7b0JBRUEsSUFBQSxRQUFBLFNBQUEsTUFBQTtvQkFDQSxJQUFBLFNBQUEsQ0FBQSxNQUFBLGFBQUEsTUFBQTt3QkFDQSxNQUFBLFNBQUEsUUFBQSxHQUFBO29CQUNBLElBQUEsV0FBQSxZQUFBLFNBQUE7d0JBQ0EsTUFBQSxDQUFBLFFBQUEsU0FBQSxNQUFBLFNBQUE7d0JBQ0EsSUFBQSxDQUFBLFFBQUEsT0FBQSxTQUFBOztvQkFFQSxJQUFBLFVBQUE7d0JBQ0EsSUFBQSxNQUFBLFdBQUE7NEJBQ0EsTUFBQTs4QkFDQSxlQUFBOzZDQUNBOzZDQUNBOzZDQUNBOzZDQUNBOzRCQUNBLE9BQUEsTUFBQSxTQUFBOzs2QkFFQTs0QkFDQSxNQUFBLFNBQUE7NEJBQ0EsT0FBQSxlQUFBO2tEQUNBO2tEQUNBO2tEQUNBO2tEQUNBOzs7O2dCQUlBOztZQUVBLE9BQUEsU0FBQSxTQUFBLFFBQUE7O29CQUVBLElBQUEsUUFBQSxTQUFBLE1BQUE7b0JBQ0EsSUFBQSxTQUFBLENBQUEsTUFBQSxhQUFBLE1BQUE7d0JBQ0EsTUFBQSxTQUFBLFFBQUEsR0FBQTs7b0JBRUEsSUFBQSxXQUFBLFlBQUEsU0FBQTt3QkFDQSxNQUFBLENBQUEsUUFBQSxPQUFBLFNBQUE7d0JBQ0EsSUFBQSxDQUFBLFFBQUEsU0FBQSxNQUFBLFNBQUE7O29CQUVBLElBQUEsVUFBQTt3QkFDQSxJQUFBLE1BQUEsV0FBQTs0QkFDQSxNQUFBLFNBQUEsZUFBQTswREFDQTswREFDQTswREFDQTswREFDQTs0QkFDQSxPQUFBLE1BQUEsU0FBQTs7NkJBRUE7NEJBQ0EsTUFBQSxTQUFBOzRCQUNBLE9BQUEsZUFBQTtrREFDQTtrREFDQTtrREFDQTtrREFDQTs7OztnQkFJQTs7Ozs7O0FDdEdBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsUUFBQSxvQkFBQSxZQUFBLG1CQUFBLFVBQUE7Ozs7OztBQ0hBLENBQUEsWUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxrQkFBQSxVQUFBLFlBQUE7O0NBRUEsU0FBQSxVQUFBLENBQUEsWUFBQTs7Q0FFQSxTQUFBLFNBQUEsVUFBQSxjQUFBO0VBQ0EsT0FBQTtHQUNBLFVBQUE7R0FDQSxTQUFBO0dBQ0EsWUFBQTtHQUNBLGFBQUE7R0FDQSxNQUFBOzs7RUFHQSxTQUFBLHFCQUFBLFFBQUEsU0FBQSxRQUFBOzs7OztBQ2hCQSxDQUFBLFdBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSxrREFBQSxTQUFBLFFBQUEsU0FBQSxVQUFBO0VBQ0EsT0FBQSxPQUFBO0VBQ0EsT0FBQSxXQUFBO0VBQ0EsT0FBQSxpQkFBQTtFQUNBLE9BQUEsZ0JBQUE7RUFDQSxPQUFBLGNBQUE7RUFDQSxPQUFBLGFBQUE7RUFDQSxPQUFBLGdCQUFBO0VBQ0EsT0FBQSxhQUFBO0VBQ0E7O0VBRUEsU0FBQSxXQUFBO0dBQ0EsT0FBQTtHQUNBLE9BQUE7R0FDQSxPQUFBO0dBQ0EsT0FBQTtHQUNBLE9BQUE7R0FDQSxPQUFBLE9BQUEsdUJBQUEsU0FBQSxTQUFBLFNBQUE7SUFDQSxJQUFBLFlBQUEsU0FBQTtLQUNBLE9BQUE7O0lBRUEsT0FBQTtJQUNBLE9BQUE7SUFDQSxPQUFBO0lBQ0EsT0FBQTs7R0FFQSxPQUFBLE9BQUEsV0FBQSxTQUFBLEdBQUEsR0FBQTtJQUNBLElBQUEsTUFBQSxHQUFBO0tBQ0E7O0lBRUEsT0FBQTs7OztFQUlBLFNBQUEsYUFBQTtHQUNBLE9BQUEsT0FBQSxDQUFBLE9BQUE7R0FDQTs7RUFFQSxTQUFBLGNBQUE7R0FDQSxJQUFBLE9BQUE7R0FDQSxRQUFBLFFBQUEsT0FBQSxNQUFBLFNBQUEsTUFBQTtJQUNBLEtBQUEsT0FBQSxRQUFBLFlBQUEsUUFBQSxXQUFBLEtBQUEsT0FBQSxRQUFBLFlBQUE7SUFDQSxLQUFBLFdBQUEsU0FBQSxLQUFBOztHQUVBLElBQUEsU0FBQSxRQUFBLFdBQUEsT0FBQSxLQUFBLENBQUEsT0FBQSxRQUFBLFlBQUEsTUFBQSxVQUFBO0dBQ0EsS0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLE9BQUEsUUFBQSxLQUFBO0lBQ0EsSUFBQSxPQUFBLEdBQUEsT0FBQSxPQUFBLFFBQUEsS0FBQTtLQUNBLE9BQUEsSUFBQTs7O0dBR0EsT0FBQSxRQUFBLE9BQUEsUUFBQSxZQUFBLEtBQUEsV0FBQTs7RUFFQSxTQUFBLFdBQUEsUUFBQTtHQUNBLElBQUEsU0FBQSxRQUFBLFdBQUEsT0FBQSxLQUFBLENBQUEsT0FBQSxRQUFBLFlBQUEsTUFBQSxVQUFBO0dBQ0EsSUFBQSxPQUFBO0dBQ0EsUUFBQSxRQUFBLFFBQUEsU0FBQSxNQUFBLElBQUE7SUFDQSxHQUFBLEtBQUEsV0FBQSxRQUFBLFFBQUE7S0FDQSxPQUFBOzs7R0FHQSxPQUFBLEtBQUE7O0VBRUEsU0FBQSxnQkFBQTtHQUNBLE9BQUEsVUFBQSxDQUFBLE9BQUEsUUFBQSxRQUFBLFlBQUE7OztFQUdBLFNBQUEsZ0JBQUE7R0FDQSxPQUFBLGdCQUFBO0lBQ0EsT0FBQSxPQUFBLFFBQUEsUUFBQSxZQUFBO0lBQ0EsT0FBQSxPQUFBLFFBQUEsUUFBQSxZQUFBO0lBQ0EsVUFBQTtJQUNBLE9BQUE7S0FDQSxLQUFBOzs7R0FHQSxPQUFBLG1CQUFBO0lBQ0EsT0FBQSxPQUFBLFFBQUEsUUFBQSxZQUFBO0lBQ0EsT0FBQSxPQUFBLFFBQUEsUUFBQSxZQUFBO0lBQ0EsVUFBQTtJQUNBLE9BQUE7S0FDQSxLQUFBOzs7OztFQUtBLFNBQUEsV0FBQTtHQUNBLE9BQUEsUUFBQTtJQUNBLFNBQUE7S0FDQSxPQUFBO01BQ0EsTUFBQTs7TUFFQSxnQkFBQTtNQUNBLFFBQUE7T0FDQSxLQUFBO09BQ0EsT0FBQTtPQUNBLFFBQUE7T0FDQSxNQUFBOztNQUVBLEdBQUEsU0FBQSxHQUFBO09BQ0EsT0FBQSxFQUFBOztNQUVBLEdBQUEsU0FBQSxHQUFBO09BQ0EsT0FBQSxFQUFBOztNQUVBLFlBQUE7TUFDQSxXQUFBO01BQ0Esb0JBQUE7TUFDQSx5QkFBQTtNQUNBLFFBQUEsQ0FBQSxLQUFBO01BQ0EsT0FBQTtPQUNBLFdBQUE7O01BRUEsT0FBQTtPQUNBLFdBQUE7T0FDQSxtQkFBQTs7TUFFQSxRQUFBO09BQ0EsWUFBQTtPQUNBLFFBQUE7UUFDQSxRQUFBOzs7TUFHQSxPQUFBO09BQ0EsYUFBQTs7OztJQUlBLE1BQUE7O0dBRUEsT0FBQSxPQUFBOzs7RUFHQSxTQUFBLGlCQUFBO0dBQ0EsSUFBQSxZQUFBO0dBQ0EsUUFBQSxRQUFBLE9BQUEsUUFBQSxZQUFBLFVBQUEsU0FBQSxNQUFBLEtBQUE7SUFDQSxJQUFBLFFBQUE7S0FDQSxLQUFBLEtBQUE7S0FDQSxPQUFBLEtBQUE7S0FDQSxRQUFBOztJQUVBLFFBQUEsUUFBQSxPQUFBLFFBQUEsS0FBQSxTQUFBLE1BQUE7S0FDQSxNQUFBLE9BQUEsS0FBQTtNQUNBLEdBQUEsS0FBQTtNQUNBLEdBQUEsS0FBQSxLQUFBOzs7SUFHQSxVQUFBLEtBQUE7O0dBRUEsT0FBQSxNQUFBLE9BQUE7Ozs7OztBQ3ZKQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsa0JBQUEsV0FBQSxtQkFBQSxXQUFBO0VBQ0EsSUFBQSxXQUFBLFVBQUE7R0FDQSxPQUFBO0lBQ0EsT0FBQTs7O0VBR0EsT0FBQTtHQUNBLFVBQUE7R0FDQSxNQUFBO0lBQ0EsS0FBQTtJQUNBLFVBQUE7O0dBRUEsYUFBQTtHQUNBLFlBQUE7R0FDQSxNQUFBLFVBQUEsUUFBQSxTQUFBLFFBQUE7SUFDQSxPQUFBLFVBQUEsUUFBQSxPQUFBLFlBQUEsT0FBQTtJQUNBLE9BQUE7SUFDQSxPQUFBOzs7Ozs7OztBQ3BCQSxDQUFBLFlBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSxrQ0FBQSxVQUFBLFFBQUE7RUFDQSxPQUFBLFNBQUE7R0FDQSxTQUFBO0dBQ0EsVUFBQTtHQUNBLFVBQUE7R0FDQSxhQUFBO0dBQ0EsaUJBQUE7R0FDQSxrQkFBQTtHQUNBLGVBQUE7R0FDQSxpQkFBQTtHQUNBLFVBQUE7O0VBRUEsT0FBQSxRQUFBO0dBQ0EsU0FBQTtJQUNBLE9BQUE7O0dBRUEsTUFBQTs7RUFFQSxPQUFBLFdBQUEsWUFBQTtHQUNBLE9BQUEsTUFBQSxRQUFBLFFBQUE7SUFDQSxNQUFBO0lBQ0EsZ0JBQUE7SUFDQSxRQUFBO0tBQ0EsS0FBQTtLQUNBLE9BQUE7S0FDQSxRQUFBO0tBQ0EsTUFBQTs7SUFFQSxHQUFBLFVBQUEsR0FBQTtLQUNBLE9BQUEsRUFBQTs7SUFFQSxHQUFBLFVBQUEsR0FBQTtLQUNBLE9BQUEsRUFBQTs7SUFFQSxZQUFBO0lBQ0EsWUFBQTtJQUNBLFdBQUE7SUFDQSxvQkFBQTtJQUNBLHlCQUFBOzs7SUFHQSxPQUFBO0tBQ0EsV0FBQTs7SUFFQSxPQUFBO0tBQ0EsV0FBQTtLQUNBLG1CQUFBOztJQUVBLFFBQUE7S0FDQSxZQUFBOztJQUVBLE9BQUE7S0FDQSxhQUFBOzs7O0dBSUEsSUFBQSxPQUFBLFFBQUEsVUFBQSxNQUFBO0lBQ0EsT0FBQSxNQUFBLFFBQUEsTUFBQSxVQUFBLENBQUEsU0FBQSxPQUFBLE1BQUEsTUFBQSxPQUFBLE1BQUE7O0dBRUEsT0FBQSxPQUFBOztFQUVBLE9BQUEsaUJBQUEsWUFBQTtHQUNBLElBQUEsWUFBQTtHQUNBLE9BQUEsUUFBQTtJQUNBLEtBQUE7SUFDQSxLQUFBOztHQUVBLFFBQUEsUUFBQSxPQUFBLFdBQUEsVUFBQSxNQUFBLEtBQUE7SUFDQSxJQUFBLFFBQUE7S0FDQSxJQUFBO0tBQ0EsS0FBQSxLQUFBO0tBQ0EsT0FBQSxLQUFBO0tBQ0EsUUFBQTs7SUFFQSxRQUFBLFFBQUEsT0FBQSxNQUFBLFVBQUEsTUFBQSxHQUFBO0tBQ0EsTUFBQSxPQUFBLEtBQUE7TUFDQSxJQUFBO01BQ0EsR0FBQSxLQUFBLEtBQUEsT0FBQTtNQUNBLEdBQUEsS0FBQSxLQUFBLE9BQUE7O0tBRUEsT0FBQSxNQUFBLE1BQUEsS0FBQSxJQUFBLE9BQUEsTUFBQSxLQUFBLEtBQUEsS0FBQSxPQUFBO0tBQ0EsT0FBQSxNQUFBLE1BQUEsS0FBQSxJQUFBLE9BQUEsTUFBQSxLQUFBLEtBQUEsS0FBQSxPQUFBOztJQUVBLFVBQUEsS0FBQTs7O0dBR0EsT0FBQSxNQUFBLE9BQUE7R0FDQSxJQUFBLE9BQUEsUUFBQSxVQUFBLFFBQUE7SUFDQSxPQUFBLE1BQUEsUUFBQSxNQUFBLFVBQUEsQ0FBQSxTQUFBLE9BQUEsTUFBQSxNQUFBLE9BQUEsTUFBQTs7O0VBR0EsT0FBQSxPQUFBLFFBQUEsVUFBQSxHQUFBLEdBQUE7R0FDQSxJQUFBLENBQUEsR0FBQTtJQUNBOztHQUVBLE9BQUE7O0VBRUEsT0FBQSxPQUFBLGFBQUEsVUFBQSxHQUFBLEdBQUE7R0FDQSxJQUFBLE1BQUEsR0FBQTtJQUNBOztHQUVBLE9BQUE7Ozs7OztBQ3hHQSxDQUFBLFlBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsa0JBQUEsVUFBQSxZQUFBLFlBQUE7RUFDQSxJQUFBLFdBQUEsVUFBQTtJQUNBLE9BQUE7TUFDQSxNQUFBOzs7RUFHQSxPQUFBO0dBQ0EsVUFBQTs7R0FFQSxZQUFBO0dBQ0EsT0FBQTtJQUNBLE1BQUE7O0dBRUEsTUFBQSxVQUFBLFFBQUEsU0FBQSxRQUFBO0lBQ0EsSUFBQSxVQUFBLFFBQUEsT0FBQSxZQUFBO0lBQ0EsT0FBQTtJQUNBLE9BQUE7SUFDQSxJQUFBLFFBQUE7S0FDQSxTQUFBO0tBQ0EsU0FBQSxDQUFBLFNBQUE7S0FDQSxJQUFBLEdBQUEsTUFBQSxTQUFBLE1BQUEsQ0FBQSxHQUFBLElBQUEsS0FBQTtLQUNBLElBQUEsR0FBQSxNQUFBLE1BQUEsU0FBQSxLQUFBLE9BQUEsQ0FBQSxHQUFBLElBQUEsTUFBQSxDQUFBLEdBQUE7OztLQUdBLFVBQUE7S0FDQSxXQUFBO0tBQ0EsY0FBQTs7SUFFQSxJQUFBLE1BQUEsR0FBQSxPQUFBLFFBQUE7OztJQUdBLElBQUEsTUFBQSxJQUFBLE9BQUE7TUFDQSxLQUFBLFNBQUEsUUFBQSxVQUFBO01BQ0EsS0FBQSxVQUFBLFNBQUEsVUFBQTtNQUNBLE9BQUE7TUFDQSxLQUFBLGFBQUEsZUFBQSxDQUFBLFNBQUEsU0FBQSxTQUFBLFdBQUE7Ozs7Ozs7O0lBUUEsSUFBQSxZQUFBLEdBQUEsT0FBQTtNQUNBLEtBQUE7TUFDQSxNQUFBLFVBQUEsR0FBQTtNQUNBLE9BQUE7OztJQUdBLElBQUEsTUFBQSxHQUFBLElBQUE7TUFDQSxXQUFBLFVBQUEsR0FBQTtNQUNBLE9BQUEsS0FBQSxJQUFBLEdBQUEsS0FBQSxJQUFBLElBQUEsS0FBQSxJQUFBLEVBQUEsRUFBQTs7TUFFQSxTQUFBLFVBQUEsR0FBQTtNQUNBLE9BQUEsS0FBQSxJQUFBLEdBQUEsS0FBQSxJQUFBLElBQUEsS0FBQSxJQUFBLEVBQUEsRUFBQSxJQUFBLEVBQUE7O01BRUEsWUFBQSxVQUFBLEdBQUE7TUFDQSxPQUFBLEtBQUEsSUFBQSxHQUFBLEVBQUEsSUFBQSxFQUFBLEVBQUEsS0FBQSxFQUFBOztNQUVBLFlBQUEsVUFBQSxHQUFBO01BQ0EsT0FBQSxLQUFBLElBQUEsR0FBQSxFQUFBLEVBQUEsSUFBQSxFQUFBOzs7SUFHQSxJQUFBLFdBQUE7S0FDQSxXQUFBO0tBQ0EsV0FBQTtLQUNBLFdBQUE7OztJQUdBLElBQUEsUUFBQSxVQUFBLE1BQUEsT0FBQTs7SUFFQSxJQUFBLE9BQUEsSUFBQSxVQUFBLFFBQUEsS0FBQTtJQUNBLEtBQUEsUUFBQSxPQUFBO01BQ0EsS0FBQSxNQUFBLFVBQUEsR0FBQSxHQUFBO01BQ0EsT0FBQSxVQUFBOztNQUVBLEtBQUEsS0FBQTtNQUNBLEtBQUEsYUFBQTtNQUNBLEtBQUEsU0FBQSxVQUFBLEdBQUE7TUFDQSxPQUFBLEVBQUEsUUFBQSxXQUFBOztNQUVBLE1BQUEsUUFBQTtNQUNBLEdBQUEsU0FBQTs7SUFFQSxJQUFBLE9BQUEsSUFBQSxVQUFBLFFBQUEsS0FBQTtJQUNBLElBQUEsWUFBQSxLQUFBLFFBQUEsT0FBQTtNQUNBLE1BQUEsZ0JBQUE7TUFDQSxLQUFBLGVBQUEsVUFBQSxHQUFBO01BQ0EsSUFBQSxFQUFBO09BQ0EsT0FBQTs7O09BR0EsT0FBQTs7TUFFQSxLQUFBLE1BQUEsVUFBQSxHQUFBO01BQ0EsT0FBQSxVQUFBLEVBQUE7O01BRUEsS0FBQSxTQUFBLFVBQUEsR0FBQTtNQUNBLE9BQUE7O01BRUEsS0FBQSxNQUFBLFVBQUEsR0FBQTtNQUNBLE9BQUEsRUFBQSxRQUFBLFNBQUE7O01BRUEsS0FBQSxhQUFBLFVBQUEsR0FBQTtNQUNBLElBQUEsWUFBQSxDQUFBLEVBQUEsUUFBQSxJQUFBLE1BQUEsS0FBQSxTQUFBO09BQ0EsY0FBQSxFQUFBLElBQUEsTUFBQSxJQUFBLENBQUE7T0FDQSxRQUFBLEVBQUEsRUFBQSxJQUFBLEVBQUEsS0FBQSxLQUFBLE1BQUEsS0FBQSxLQUFBLE1BQUEsWUFBQSxhQUFBO09BQ0EsU0FBQSxTQUFBLFlBQUEsQ0FBQSxLQUFBO09BQ0EsU0FBQSxDQUFBLEVBQUEsRUFBQSxLQUFBLGVBQUE7T0FDQSxZQUFBLFFBQUEsS0FBQSxDQUFBLE1BQUE7TUFDQSxJQUFBLEVBQUEsUUFBQSxZQUFBLEVBQUEsUUFBQSxVQUFBLFVBQUE7TUFDQSxJQUFBLEVBQUEsU0FBQSxHQUFBO09BQ0EsU0FBQSxDQUFBO09BQ0EsU0FBQTtPQUNBLFdBQUE7YUFDQSxJQUFBLEVBQUEsU0FBQSxHQUFBLFVBQUEsQ0FBQTtXQUNBLElBQUEsRUFBQSxTQUFBLEdBQUEsVUFBQSxDQUFBO1dBQ0EsSUFBQSxFQUFBLFNBQUEsR0FBQSxVQUFBO01BQ0EsT0FBQSxZQUFBLFNBQUEsZ0JBQUEsU0FBQSxhQUFBLFdBQUE7O01BRUEsR0FBQSxTQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBK0JBLFVBQUEsT0FBQTtNQUNBLEtBQUEsS0FBQTtNQUNBLEtBQUEsVUFBQSxHQUFBOztNQUVBLElBQUEsRUFBQSxTQUFBLEtBQUEsRUFBQSxRQUFBLFlBQUEsRUFBQSxRQUFBLFlBQUEsRUFBQSxRQUFBLFlBQUEsRUFBQSxRQUFBO09BQ0EsT0FBQSxFQUFBLEtBQUEsTUFBQSxLQUFBLEtBQUEsT0FBQSxFQUFBLEtBQUEsTUFBQSxLQUFBLE1BQUE7O09BRUEsT0FBQSxFQUFBLEtBQUEsTUFBQSxLQUFBOztJQUVBLFVBQUEsT0FBQTtNQUNBLEtBQUEsS0FBQTtNQUNBLEtBQUEsTUFBQTtNQUNBLEtBQUEsVUFBQSxHQUFBOztNQUVBLElBQUEsRUFBQSxTQUFBLEtBQUEsRUFBQSxRQUFBLFlBQUEsRUFBQSxRQUFBLFlBQUEsRUFBQSxRQUFBLFlBQUEsRUFBQSxRQUFBO09BQ0EsT0FBQSxDQUFBLEVBQUEsS0FBQSxNQUFBLEtBQUEsTUFBQSxNQUFBLE9BQUEsRUFBQSxLQUFBLE1BQUEsS0FBQSxNQUFBOztPQUVBLE9BQUEsQ0FBQSxFQUFBLEtBQUEsTUFBQSxLQUFBLE1BQUEsTUFBQSxPQUFBLEVBQUEsS0FBQSxNQUFBLEtBQUEsTUFBQTs7SUFFQSxVQUFBLE9BQUE7TUFDQSxLQUFBLEtBQUE7TUFDQSxLQUFBLE1BQUE7TUFDQSxLQUFBLFVBQUEsR0FBQTtNQUNBLElBQUEsRUFBQSxTQUFBLEtBQUEsRUFBQSxRQUFBLFlBQUEsRUFBQSxRQUFBLFlBQUEsRUFBQSxRQUFBLFlBQUEsRUFBQSxRQUFBO09BQ0EsT0FBQSxDQUFBLEVBQUEsS0FBQSxNQUFBLEtBQUEsTUFBQSxNQUFBLE9BQUEsRUFBQSxLQUFBLE1BQUEsS0FBQSxNQUFBOztPQUVBLE9BQUEsQ0FBQSxFQUFBLEtBQUEsTUFBQSxLQUFBLE1BQUEsTUFBQSxPQUFBLEVBQUEsS0FBQSxNQUFBLEtBQUEsTUFBQSxJQUFBOzs7SUFHQSxTQUFBLE1BQUEsR0FBQTs7S0FFQSxLQUFBO09BQ0EsU0FBQTtPQUNBLFVBQUEsS0FBQSxTQUFBOzs7O0tBSUEsS0FBQSxNQUFBLGNBQUEsVUFBQSxHQUFBO09BQ0EsT0FBQSxXQUFBLEdBQUEsS0FBQSxPQUFBLEdBQUEsT0FBQSxNQUFBLE1BQUE7O09BRUE7T0FDQSxTQUFBO09BQ0EsVUFBQSxlQUFBLFVBQUEsR0FBQTtPQUNBLE9BQUEsWUFBQTtRQUNBLElBQUEsRUFBQTtTQUNBLE9BQUE7OztTQUdBLE9BQUE7OztPQUdBLFVBQUEsYUFBQSxVQUFBLEdBQUE7T0FDQSxJQUFBLFlBQUEsQ0FBQSxFQUFBLFFBQUEsSUFBQSxNQUFBLEtBQUEsU0FBQTtPQUNBLE9BQUEsWUFBQTtRQUNBLElBQUEsWUFBQSxDQUFBLEVBQUEsUUFBQSxJQUFBLE1BQUEsS0FBQSxTQUFBO1NBQ0EsY0FBQSxFQUFBLElBQUEsTUFBQSxJQUFBLENBQUE7U0FDQSxRQUFBLEVBQUEsRUFBQSxJQUFBLEVBQUEsS0FBQSxLQUFBLE1BQUEsS0FBQSxLQUFBLE1BQUEsWUFBQSxhQUFBO1NBQ0EsU0FBQSxTQUFBLFlBQUEsQ0FBQSxLQUFBO1NBQ0EsU0FBQSxDQUFBLEVBQUEsRUFBQSxLQUFBLGVBQUE7U0FDQSxZQUFBLFFBQUEsS0FBQSxDQUFBLE1BQUE7UUFDQSxJQUFBLEVBQUEsUUFBQSxZQUFBLEVBQUEsUUFBQSxVQUFBLFVBQUE7UUFDQSxJQUFBLEVBQUEsU0FBQSxHQUFBO1NBQ0EsU0FBQSxDQUFBO1NBQ0EsU0FBQTtTQUNBLFdBQUE7ZUFDQSxJQUFBLEVBQUEsU0FBQSxHQUFBLFVBQUEsQ0FBQTthQUNBLElBQUEsRUFBQSxTQUFBLEdBQUEsVUFBQSxDQUFBO2FBQ0EsSUFBQSxFQUFBLFNBQUEsR0FBQSxVQUFBO1FBQ0EsT0FBQSxZQUFBLFNBQUEsZ0JBQUEsU0FBQSxhQUFBLFdBQUE7OztPQUdBLE1BQUEsZ0JBQUEsVUFBQSxHQUFBO09BQ0EsT0FBQSxXQUFBLEdBQUEsS0FBQSxJQUFBOztPQUVBLEtBQUEsT0FBQSxVQUFBLEdBQUE7T0FDQSxHQUFBLE9BQUEsTUFBQSxNQUFBLGNBQUEsV0FBQSxHQUFBLEtBQUEsT0FBQTs7Ozs7SUFLQSxTQUFBLFdBQUEsR0FBQSxHQUFBO0tBQ0EsSUFBQSxNQUFBLEdBQUEsT0FBQTtLQUNBLElBQUEsRUFBQSxVQUFBO01BQ0EsT0FBQSxFQUFBLFNBQUEsS0FBQSxVQUFBLEdBQUE7T0FDQSxPQUFBLFdBQUEsR0FBQTs7O0tBR0EsT0FBQTs7O0lBR0EsU0FBQSxTQUFBLEdBQUE7S0FDQSxPQUFBLEVBQUE7S0FDQSxJQUFBLEVBQUE7TUFDQSxPQUFBLEVBQUE7VUFDQTtNQUNBLElBQUEsWUFBQTs7TUFFQSxJQUFBLElBQUE7TUFDQSxPQUFBLEVBQUEsT0FBQSxTQUFBLE1BQUE7T0FDQTtNQUNBLElBQUEsYUFBQSxDQUFBLGFBQUEsSUFBQSxJQUFBO01BQ0EsT0FBQSxPQUFBLE1BQUEsRUFBQSxPQUFBLE9BQUEsS0FBQSxZQUFBLEtBQUE7Ozs7O0lBS0EsU0FBQSxTQUFBLEdBQUE7S0FDQSxJQUFBLEtBQUEsS0FBQTtNQUNBLEtBQUEsR0FBQSxZQUFBLEVBQUEsVUFBQSxDQUFBLEVBQUEsR0FBQSxFQUFBLElBQUEsRUFBQSxLQUFBO01BQ0EsS0FBQSxHQUFBLFlBQUEsRUFBQSxVQUFBLENBQUEsRUFBQSxHQUFBO01BQ0EsS0FBQSxHQUFBLFlBQUEsRUFBQSxTQUFBLENBQUEsRUFBQSxJQUFBLEtBQUEsR0FBQTs7S0FFQSxPQUFBLFVBQUEsR0FBQTtNQUNBLE9BQUEsVUFBQSxHQUFBO09BQ0EsRUFBQSxPQUFBLEdBQUE7T0FDQSxFQUFBLE9BQUEsR0FBQSxJQUFBLE1BQUEsR0FBQTtPQUNBLE9BQUEsSUFBQTs7Ozs7SUFLQSxTQUFBLEtBQUEsR0FBQTtLQUNBLE9BQUEsRUFBQSxXQUFBLEtBQUEsSUFBQSxNQUFBLE1BQUEsRUFBQSxTQUFBLElBQUEsU0FBQSxFQUFBLElBQUEsRUFBQTs7Ozs7OztBQ3BSQSxDQUFBLFlBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSwyQkFBQSxVQUFBLFFBQUE7O0VBRUEsT0FBQSxXQUFBLFlBQUE7R0FDQSxPQUFBLFFBQUE7SUFDQSxTQUFBO0tBQ0EsT0FBQTtNQUNBLE1BQUE7TUFDQSxRQUFBO01BQ0EsWUFBQTtPQUNBLFlBQUE7T0FDQSxTQUFBO09BQ0EsVUFBQTtPQUNBLFFBQUE7T0FDQSxNQUFBO09BQ0EsWUFBQTtPQUNBLFVBQUE7UUFDQSxPQUFBO1FBQ0EsU0FBQTtRQUNBLFVBQUE7UUFDQSxRQUFBOzs7TUFHQSxXQUFBO09BQ0EsWUFBQTtPQUNBLFdBQUE7T0FDQSxZQUFBO09BQ0EsZ0JBQUE7T0FDQSxXQUFBO09BQ0Esa0JBQUE7T0FDQSxZQUFBO09BQ0EsV0FBQTtPQUNBLGFBQUE7T0FDQSxpQkFBQTs7T0FFQSxVQUFBO1FBQ0EsUUFBQTtRQUNBLE9BQUE7O09BRUEsVUFBQTtPQUNBLFFBQUE7T0FDQSxlQUFBO09BQ0EsTUFBQTs7OztJQUlBLE1BQUE7O0dBRUEsT0FBQSxPQUFBOztFQUVBLElBQUEsWUFBQSxVQUFBLE1BQUE7R0FDQSxJQUFBLFdBQUE7R0FDQSxRQUFBLFFBQUEsTUFBQSxVQUFBLE1BQUE7SUFDQSxJQUFBLFFBQUE7S0FDQSxRQUFBLEtBQUE7S0FDQSxRQUFBLEtBQUE7S0FDQSxTQUFBLEtBQUE7S0FDQSxZQUFBLFVBQUEsS0FBQTs7SUFFQSxHQUFBLEtBQUEsTUFBQTtLQUNBLE1BQUEsUUFBQSxLQUFBOztJQUVBLEdBQUEsS0FBQSxLQUFBO0tBQ0EsTUFBQSxPQUFBLEtBQUE7O0lBRUEsU0FBQSxLQUFBOztHQUVBLE9BQUE7O0VBRUEsT0FBQSxpQkFBQSxZQUFBO0dBQ0EsSUFBQSxZQUFBO0lBQ0EsUUFBQSxPQUFBLEtBQUE7SUFDQSxTQUFBLE9BQUEsS0FBQTtJQUNBLFlBQUEsVUFBQSxPQUFBLEtBQUE7SUFDQSxRQUFBOztHQUVBLE9BQUEsTUFBQSxPQUFBO0dBQ0EsT0FBQTs7RUFFQSxPQUFBLE9BQUEsUUFBQSxVQUFBLEdBQUEsR0FBQTtHQUNBLElBQUEsQ0FBQSxHQUFBO0lBQ0E7O0dBRUEsT0FBQTs7Ozs7QUFLQSIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0dmFyIGFwcCA9IGFuZ3VsYXIubW9kdWxlKCdhcHAnLFxuXHRcdFtcblx0XHQnYXBwLmNvbnRyb2xsZXJzJyxcblx0XHQnYXBwLmZpbHRlcnMnLFxuXHRcdCdhcHAuc2VydmljZXMnLFxuXHRcdCdhcHAuZGlyZWN0aXZlcycsXG5cdFx0J2FwcC5yb3V0ZXMnLFxuXHRcdCdhcHAuY29uZmlnJyxcblx0XHRdKTtcblxuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAucm91dGVzJywgWyd1aS5yb3V0ZXInLCAnbmdTdG9yYWdlJywgJ3NhdGVsbGl6ZXInXSk7XG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnLCBbJ3Ntb290aFNjcm9sbCcsJ3VpLnJvdXRlcicsICduZ01hdGVyaWFsJywgJ25nU3RvcmFnZScsICdyZXN0YW5ndWxhcicsICduZ01kSWNvbnMnLCAnYW5ndWxhci1sb2FkaW5nLWJhcicsICduZ01lc3NhZ2VzJywgJ25nU2FuaXRpemUnLCBcImxlYWZsZXQtZGlyZWN0aXZlXCIsJ252ZDMnLCAnbmdDc3ZJbXBvcnQnLCdzdGlja3knXSk7XG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZmlsdGVycycsIFtdKTtcblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5zZXJ2aWNlcycsIFsndWkucm91dGVyJywgJ25nU3RvcmFnZScsICdyZXN0YW5ndWxhciddKTtcblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5kaXJlY3RpdmVzJywgWyduZ01hdGVyaWFsJ10pO1xuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbmZpZycsIFtdKTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLnJvdXRlcycpLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyKXtcblxuXHRcdHZhciBnZXRWaWV3ID0gZnVuY3Rpb24odmlld05hbWUpe1xuXHRcdFx0cmV0dXJuICcvdmlld3MvYXBwLycgKyB2aWV3TmFtZSArICcvJyArIHZpZXdOYW1lICsgJy5odG1sJztcblx0XHR9O1xuXG5cdFx0JHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSgnL2VwaScpO1xuXG5cdFx0JHN0YXRlUHJvdmlkZXJcblx0XHRcdC5zdGF0ZSgnYXBwJywge1xuXHRcdFx0XHRhYnN0cmFjdDogdHJ1ZSxcblx0XHRcdFx0dmlld3M6IHtcblx0XHRcdFx0LypcdHNpZGViYXI6IHtcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdzaWRlYmFyJylcblx0XHRcdFx0XHR9LCovXG5cdFx0XHRcdFx0aGVhZGVyOiB7XG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogZ2V0VmlldygnaGVhZGVyJylcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdG1haW46IHt9XG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cdFx0XHQuc3RhdGUoJ2FwcC5lcGknLCB7XG5cdFx0XHRcdHVybDogJy9lcGknLFxuXHRcdFx0XHR2aWV3czoge1xuXHRcdFx0XHRcdCdtYWluQCc6IHtcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdlcGknKSxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdFcGlDdHJsJyxcblx0XHRcdFx0XHRcdHJlc29sdmU6e1xuXHRcdFx0XHRcdFx0XHRFUEk6IGZ1bmN0aW9uKERhdGFTZXJ2aWNlKXtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gRGF0YVNlcnZpY2UuZ2V0QWxsKCcvZXBpL3llYXIvMjAxNCcpXG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdCdtYXBAJzp7XG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogZ2V0VmlldygnbWFwJylcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cdFx0XHQuc3RhdGUoJ2FwcC5lcGkudXBsb2FkJyx7XG5cdFx0XHRcdHVybDogJy91cGxvYWQtdHV0b3JpYWwnLFxuXHRcdFx0XHR2aWV3czp7XG5cdFx0XHRcdFx0J3N1Yic6e1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICcvdmlld3MvYXBwL2VwaS91cGxvYWQuaHRtbCdcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cdFx0XHQuc3RhdGUoJ2FwcC5lcGkuc3RhdHMnLHtcblx0XHRcdFx0dXJsOiAnL2FkdmFuY2VkLXN0YXRpc3RpY3MnLFxuXHRcdFx0XHR2aWV3czp7XG5cdFx0XHRcdFx0J3N1Yic6e1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICcvdmlld3MvYXBwL2VwaS9zdGF0cy5odG1sJ1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLmVwaS5zdXN0YWluJyx7XG5cdFx0XHRcdHVybDogJy9zdXN0YWluYWJsZS1nb2FscycsXG5cdFx0XHRcdHZpZXdzOntcblx0XHRcdFx0XHQnc3ViJzp7XG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogJy92aWV3cy9hcHAvZXBpL3N1c3RhaW4uaHRtbCdcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cdFx0XHQuc3RhdGUoJ2FwcC5lcGkuZW5lcmd5Jyx7XG5cdFx0XHRcdHVybDogJy9zdGF0ZS1vZi10aGUtZW5lcmd5Jyxcblx0XHRcdFx0dmlld3M6e1xuXHRcdFx0XHRcdCdzdWInOntcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiAnL3ZpZXdzL2FwcC9lcGkvZW5lcmd5Lmh0bWwnXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdFx0LnN0YXRlKCdhcHAuZXBpLnNlbGVjdGVkJyx7XG5cdFx0XHRcdHVybDogJy86aXRlbSdcblx0XHRcdH0pXG5cdFx0XHQuc3RhdGUoJ2FwcC5lcGkuc2VsZWN0ZWQuY29tcGFyZScse1xuXHRcdFx0XHR1cmw6ICcvY29tcGFyZS13aXRoLWNvdW50cmllcydcblx0XHRcdH0pXG5cdFx0XHQuc3RhdGUoJ2FwcC5pbXBvcnRjc3YnLCB7XG5cdFx0XHRcdHVybDogJy9pbXBvcnRlcicsXG5cdFx0XHRcdGRhdGE6IHtwYWdlTmFtZTogJ0ltcG9ydCBDU1YnfSxcblx0XHRcdFx0dmlld3M6IHtcblx0XHRcdFx0XHQnbWFpbkAnOiB7XG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogZ2V0VmlldygnaW1wb3J0Y3N2Jylcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdCdtYXAnOnt9XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXG5cblxuXHR9KTtcbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5yb3V0ZXMnKS5ydW4oZnVuY3Rpb24oJHJvb3RTY29wZSl7XG5cdFx0JHJvb3RTY29wZS4kb24oXCIkc3RhdGVDaGFuZ2VTdGFydFwiLCBmdW5jdGlvbihldmVudCwgdG9TdGF0ZSl7XG5cdFx0XHRpZiAodG9TdGF0ZS5kYXRhICYmIHRvU3RhdGUuZGF0YS5wYWdlTmFtZSl7XG5cdFx0XHRcdCRyb290U2NvcGUuY3VycmVudF9wYWdlID0gdG9TdGF0ZS5kYXRhLnBhZ2VOYW1lO1xuXHRcdFx0fVxuXHRcdFx0ICRyb290U2NvcGUuc3RhdGVJc0xvYWRpbmcgPSB0cnVlO1xuXHRcdH0pO1xuXHRcdCRyb290U2NvcGUuJG9uKFwiJHN0YXRlQ2hhbmdlU3VjY2Vzc1wiLCBmdW5jdGlvbihldmVudCwgdG9TdGF0ZSl7XG5cdFx0XHQgJHJvb3RTY29wZS5zdGF0ZUlzTG9hZGluZyA9IGZhbHNlO1xuXHRcdH0pO1xuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbiAoKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29uZmlnJykuY29uZmlnKGZ1bmN0aW9uICgkYXV0aFByb3ZpZGVyKXtcbiAgICAgICAgLy8gU2F0ZWxsaXplciBjb25maWd1cmF0aW9uIHRoYXQgc3BlY2lmaWVzIHdoaWNoIEFQSVxuICAgICAgICAvLyByb3V0ZSB0aGUgSldUIHNob3VsZCBiZSByZXRyaWV2ZWQgZnJvbVxuICAgICAgICAkYXV0aFByb3ZpZGVyLmxvZ2luVXJsID0gJy9hcGkvMS9hdXRoZW50aWNhdGUvYXV0aCc7XG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29uZmlnJykuY29uZmlnKGZ1bmN0aW9uIChjZnBMb2FkaW5nQmFyUHJvdmlkZXIpe1xuXHRcdGNmcExvYWRpbmdCYXJQcm92aWRlci5pbmNsdWRlU3Bpbm5lciA9IGZhbHNlO1xuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbmZpZycpLmNvbmZpZyggZnVuY3Rpb24oUmVzdGFuZ3VsYXJQcm92aWRlcikge1xuXHRcdFJlc3Rhbmd1bGFyUHJvdmlkZXJcblx0XHQuc2V0QmFzZVVybCgnL2FwaS8xLycpO1xuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbmZpZycpLmNvbmZpZyhmdW5jdGlvbigkbWRUaGVtaW5nUHJvdmlkZXIpIHtcblx0XHQvKiBGb3IgbW9yZSBpbmZvLCB2aXNpdCBodHRwczovL21hdGVyaWFsLmFuZ3VsYXJqcy5vcmcvIy9UaGVtaW5nLzAxX2ludHJvZHVjdGlvbiAqL1xuXHR2YXIgbmVvblRlYWxNYXAgPSAkbWRUaGVtaW5nUHJvdmlkZXIuZXh0ZW5kUGFsZXR0ZSgndGVhbCcsIHtcbiAgICAnNTAwJzogJzAwY2NhYScsXG5cdFx0J0EyMDAnOiAnMDBjY2FhJ1xuICB9KTtcblx0dmFyIHdoaXRlTWFwID0gJG1kVGhlbWluZ1Byb3ZpZGVyLmV4dGVuZFBhbGV0dGUoJ3RlYWwnLCB7XG4gICAgJzUwMCc6ICcwMGNjYWEnLFxuXHRcdCdBMjAwJzogJyNmZmYnXG4gIH0pO1xuXHR2YXIgYmx1ZU1hcCA9ICRtZFRoZW1pbmdQcm92aWRlci5leHRlbmRQYWxldHRlKCdibHVlJywge1xuICAgICc1MDAnOiAnIzAwNmJiOScsXG5cdFx0J0EyMDAnOiAnIzAwNmJiOSdcbiAgfSk7XG5cdCRtZFRoZW1pbmdQcm92aWRlci5kZWZpbmVQYWxldHRlKCduZW9uVGVhbCcsIG5lb25UZWFsTWFwKTtcblx0JG1kVGhlbWluZ1Byb3ZpZGVyLmRlZmluZVBhbGV0dGUoJ3doaXRlVGVhbCcsIHdoaXRlTWFwKTtcblx0JG1kVGhlbWluZ1Byb3ZpZGVyLmRlZmluZVBhbGV0dGUoJ2JsdWVyJywgYmx1ZU1hcCk7XG5cdFx0JG1kVGhlbWluZ1Byb3ZpZGVyLnRoZW1lKCdkZWZhdWx0Jylcblx0XHQucHJpbWFyeVBhbGV0dGUoJ25lb25UZWFsJylcblx0XHQuYWNjZW50UGFsZXR0ZSgnbmVvblRlYWwnKVxuXHRcdC53YXJuUGFsZXR0ZSgnYmx1ZXInKTtcblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5maWx0ZXJzJykuZmlsdGVyKCAnY2FwaXRhbGl6ZScsIGZ1bmN0aW9uKCl7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uKGlucHV0LCBhbGwpIHtcblx0XHRcdHJldHVybiAoISFpbnB1dCkgPyBpbnB1dC5yZXBsYWNlKC8oW15cXFdfXStbXlxccy1dKikgKi9nLGZ1bmN0aW9uKHR4dCl7XG5cdFx0XHRcdHJldHVybiB0eHQuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyB0eHQuc3Vic3RyKDEpLnRvTG93ZXJDYXNlKCk7XG5cdFx0XHR9KSA6ICcnO1xuXHRcdH07XG5cdH0pO1xufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmZpbHRlcnMnKS5maWx0ZXIoICdodW1hblJlYWRhYmxlJywgZnVuY3Rpb24oKXtcblx0XHRyZXR1cm4gZnVuY3Rpb24gaHVtYW5pemUoc3RyKSB7XG5cdFx0XHRpZiAoICFzdHIgKXtcblx0XHRcdFx0cmV0dXJuICcnO1xuXHRcdFx0fVxuXHRcdFx0dmFyIGZyYWdzID0gc3RyLnNwbGl0KCdfJyk7XG5cdFx0XHRmb3IgKHZhciBpPTA7IGk8ZnJhZ3MubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0ZnJhZ3NbaV0gPSBmcmFnc1tpXS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIGZyYWdzW2ldLnNsaWNlKDEpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGZyYWdzLmpvaW4oJyAnKTtcblx0XHR9O1xuXHR9KTtcbn0pKCk7IiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZmlsdGVycycpLmZpbHRlciggJ3RydXN0SHRtbCcsIGZ1bmN0aW9uKCAkc2NlICl7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uKCBodG1sICl7XG5cdFx0XHRyZXR1cm4gJHNjZS50cnVzdEFzSHRtbChodG1sKTtcblx0XHR9O1xuXHR9KTtcbn0pKCk7IiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZmlsdGVycycpLmZpbHRlcigndWNmaXJzdCcsIGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBmdW5jdGlvbiggaW5wdXQgKSB7XG5cdFx0XHRpZiAoICFpbnB1dCApe1xuXHRcdFx0XHRyZXR1cm4gbnVsbDtcblx0XHRcdH1cblx0XHRcdHJldHVybiBpbnB1dC5zdWJzdHJpbmcoMCwgMSkudG9VcHBlckNhc2UoKSArIGlucHV0LnN1YnN0cmluZygxKTtcblx0XHR9O1xuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5zZXJ2aWNlcycpLmZhY3RvcnkoJ0RhdGFTZXJ2aWNlJywgRGF0YVNlcnZpY2UpO1xuICAgIERhdGFTZXJ2aWNlLiRpbmplY3QgPSBbJ1Jlc3Rhbmd1bGFyJ107XG5cbiAgICBmdW5jdGlvbiBEYXRhU2VydmljZShSZXN0YW5ndWxhcil7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZ2V0QWxsOiBnZXRBbGwsXG4gICAgICAgICAgZ2V0T25lOiBnZXRPbmVcbiAgICAgICAgfTtcblxuICAgICAgICBmdW5jdGlvbiBnZXRBbGwocm91dGUpe1xuICAgICAgICAgIHZhciBkYXRhID0gUmVzdGFuZ3VsYXIuYWxsKHJvdXRlKS5nZXRMaXN0KCk7XG4gICAgICAgICAgICBkYXRhLnRoZW4oZnVuY3Rpb24oKXt9LCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICBhbGVydCgnZXJyb3InKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gZ2V0T25lKHJvdXRlLCBpZCl7XG4gICAgICAgICAgcmV0dXJuIFJlc3Rhbmd1bGFyLm9uZShyb3V0ZSwgaWQpLmdldCgpO1xuICAgICAgICB9XG4gICAgfVxuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLnNlcnZpY2VzJykuZmFjdG9yeSgnSW5kZXhTZXJ2aWNlJywgZnVuY3Rpb24oKXtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBnZXRFcGk6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICBcdFx0XHQgbmFtZTonRVBJJyxcbiAgICAgICAgICAgICAgIHRpdGxlOiAnRVBJJyxcbiAgICAgICAgXHRcdFx0IGZ1bGxfbmFtZTogJ0Vudmlyb25tZW50IFBlcmZvcm1hbmNlIEluZGV4JyxcbiAgICAgICAgXHRcdFx0IHRhYmxlOiAnZXBpJyxcbiAgICAgICAgXHRcdFx0IGFsbENvdW50cmllczogJ3llcycsXG4gICAgICAgIFx0XHRcdCBjb3VudHJpZXM6IFtdLFxuICAgICAgICBcdFx0XHQgc2NvcmVfZmllbGRfbmFtZTogJ3Njb3JlJyxcbiAgICAgICAgXHRcdFx0IGNoYW5nZV9maWVsZF9uYW1lOiAncGVyY2VudF9jaGFuZ2UnLFxuICAgICAgICBcdFx0XHQgb3JkZXJfZmllbGQ6ICd5ZWFyJyxcbiAgICAgICAgXHRcdFx0IGNvdW50cmllc19pZF9maWVsZDogJ2NvdW50cnlfaWQnLFxuICAgICAgICBcdFx0XHQgY291bnRyaWVzX2lzb19maWVsZDogJ2lzbycsXG4gICAgICAgICAgICAgICBjb2xvcjogJyMzOTM2MzUnLFxuICAgICAgICAgICAgICAgc2l6ZToxLFxuICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ICc8cD5UaGUgRW52aXJvbm1lbnRhbCBQZXJmb3JtYW5jZSBJbmRleCAoRVBJKSByYW5rcyBob3cgd2VsbCBjb3VudHJpZXMgcGVyZm9ybSBvbiBoaWdoLXByaW9yaXR5IGVudmlyb25tZW50YWwgaXNzdWVzIGluIHR3byBicm9hZCBwb2xpY3kgYXJlYXM6IHByb3RlY3Rpb24gb2YgaHVtYW4gaGVhbHRoIGZyb20gZW52aXJvbm1lbnRhbCBoYXJtIGFuZCBwcm90ZWN0aW9uIG9mIGVjb3N5c3RlbXMuPC9wPjxwPlRoZSBFbnZpcm9ubWVudGFsIFBlcmZvcm1hbmNlIEluZGV4IChFUEkpIGlzIGNvbnN0cnVjdGVkIHRocm91Z2ggdGhlIGNhbGN1bGF0aW9uIGFuZCBhZ2dyZWdhdGlvbiBvZiAyMCBpbmRpY2F0b3JzIHJlZmxlY3RpbmcgbmF0aW9uYWwtbGV2ZWwgZW52aXJvbm1lbnRhbCBkYXRhLiBUaGVzZSBpbmRpY2F0b3JzIGFyZSBjb21iaW5lZCBpbnRvIG5pbmUgaXNzdWUgY2F0ZWdvcmllcywgZWFjaCBvZiB3aGljaCBmaXQgdW5kZXIgb25lIG9mIHR3byBvdmVyYXJjaGluZyBvYmplY3RpdmVzLjwvcD4nLFxuICAgICAgICAgICAgICAgY2FwdGlvbjogJ1RoZSAyMDE0IEVQSSBGcmFtZXdvcmsgaW5jbHVkZXMgOSBpc3N1ZXMgYW5kIDIwIGluZGljYXRvcnMuIEFjY2VzcyB0byBFbGVjdHJpY2l0eSBpcyBub3QgaW5jbHVkZWQgaW4gdGhlIGZpZ3VyZSBiZWNhdXNlIGl0IGlzIG5vdCB1c2VkIHRvIGNhbGN1bGF0ZSBjb3VudHJ5IHNjb3Jlcy4gQ2xpY2sgb24gdGhlIGludGVyYWN0aXZlIGZpZ3VyZSBhYm92ZSB0byBleHBsb3JlIHRoZSBFUEkgZnJhbWV3b3JrLicsXG4gICAgICAgICAgICAgICBjaGlsZHJlbjpbe1xuICAgICAgICBcdFx0XHRcdCBjb2x1bW5fbmFtZTogJ2VoJyxcbiAgICAgICAgXHRcdFx0XHQgdGl0bGU6ICdFbnZpcm9tZW50YWwgSGVhbHRoJyxcbiAgICAgICAgXHRcdFx0XHQgcmFuZ2U6WzAsIDEwMF0sXG4gICAgICAgIFx0XHRcdFx0IGljb246JycsXG4gICAgICAgIFx0XHRcdFx0IGNvbG9yOicjYmU1ZjAwJyxcbiAgICAgICAgXHRcdFx0XHQgY2hpbGRyZW46W3tcbiAgICAgICAgXHRcdFx0XHRcdCBjb2x1bW5fbmFtZTonZWhfaGknLFxuICAgICAgICBcdFx0XHRcdFx0IHRpdGxlOidIZWFsdGggSW1wYWN0JyxcbiAgICAgICAgXHRcdFx0XHRcdCBpY29uOiAnbWFuJyxcbiAgICAgICAgXHRcdFx0XHRcdCB1bmljb2RlOiAnXFx1ZTYwNScsXG4gICAgICAgIFx0XHRcdFx0XHQgY29sb3I6ICcjZjM5NDE5JyxcbiAgICAgICAgXHRcdFx0XHRcdCBjaGlsZHJlbjpbe1xuICAgICAgICBcdFx0XHRcdFx0XHQgY29sdW1uX25hbWU6ICdlaF9oaV9jaGlsZF9tb3J0YWxpdHknLFxuICAgICAgICBcdFx0XHRcdFx0XHQgdGl0bGU6J0NoaWxkIE1vcnRhbGl0eScsXG4gICAgICAgICAgICAgICAgICAgICBzaXplOjYwNzQsXG4gICAgICAgIFx0XHRcdFx0XHRcdCBpY29uOicnLFxuICAgICAgICBcdFx0XHRcdFx0XHQgY29sb3I6JyNmN2E5MzcnLFxuICAgICAgICBcdFx0XHRcdFx0XHQgZGVzY3JpcHRpb246J1Byb2JhYmlsaXR5IG9mIGR5aW5nIGJldHdlZW4gYSBjaGlsZHMgZmlyc3QgYW5kIGZpZnRoIGJpcnRoZGF5cyAoYmV0d2VlbiBhZ2UgMSBhbmQgNSknXG4gICAgICAgIFx0XHRcdFx0XHQgfV1cbiAgICAgICAgXHRcdFx0XHQgfSx7XG4gICAgICAgIFx0XHRcdFx0XHQgY29sdW1uX25hbWU6J2VoX2FxJyxcbiAgICAgICAgXHRcdFx0XHRcdCB0aXRsZTonQWlyIFF1YWxpdHknLFxuICAgICAgICBcdFx0XHRcdFx0IGNvbG9yOiAnI2Y2YzcwYScsXG4gICAgICAgIFx0XHRcdFx0XHQgaWNvbjogJ3NpbmsnLFxuICAgICAgICBcdFx0XHRcdFx0IHVuaWNvZGU6ICdcXHVlNjA0JyxcbiAgICAgICAgXHRcdFx0XHRcdCBjaGlsZHJlbjpbe1xuICAgICAgICBcdFx0XHRcdFx0XHQgY29sdW1uX25hbWU6ICdlaF9hcV9ob3VzZWhvbGRfYWlyX3F1YWxpdHknLFxuICAgICAgICBcdFx0XHRcdFx0XHQgdGl0bGU6J0hvdXNlaG9sZCBBaXIgUXVhbGl0eScsXG4gICAgICAgICAgICAgICAgICAgICBzaXplOjIwMDMsXG4gICAgICAgIFx0XHRcdFx0XHRcdCBpY29uOicnLFxuICAgICAgICBcdFx0XHRcdFx0XHQgY29sb3I6JyNmYWQzM2QnLFxuICAgICAgICBcdFx0XHRcdFx0XHQgZGVzY3JpcHRpb246J1BlcmNlbnRhZ2Ugb2YgdGhlIHBvcHVsYXRpb24gdXNpbmcgc29saWQgZnVlbHMgYXMgcHJpbWFyeSBjb29raW5nIGZ1ZWwuJ1xuICAgICAgICBcdFx0XHRcdFx0IH0se1xuICAgICAgICBcdFx0XHRcdFx0XHQgY29sdW1uX25hbWU6ICdlaF9hcV9leHBvc3VyZV9wbTI1JyxcbiAgICAgICAgXHRcdFx0XHRcdFx0IHRpdGxlOidBaXIgUG9sbHV0aW9uIC0gQXZlcmFnZSBFeHBvc3VyZSB0byBQTTIuNScsXG4gICAgICAgICAgICAgICAgICAgICBzaXplOjIwMDMsXG4gICAgICAgIFx0XHRcdFx0XHRcdCBpY29uOicnLFxuICAgICAgICBcdFx0XHRcdFx0XHQgY29sb3I6JyNmYWRkNmMnLFxuICAgICAgICBcdFx0XHRcdFx0XHQgZGVzY3JpcHRpb246J1BvcHVsYXRpb24gd2VpZ2h0ZWQgZXhwb3N1cmUgdG8gUE0yLjUgKHRocmVlLSB5ZWFyIGF2ZXJhZ2UpJ1xuICAgICAgICBcdFx0XHRcdFx0IH0se1xuICAgICAgICBcdFx0XHRcdFx0XHQgY29sdW1uX25hbWU6ICdlaF9hcV9leGNlZWRhbmNlX3BtMjUnLFxuICAgICAgICBcdFx0XHRcdFx0XHQgdGl0bGU6J0FpciBQb2xsdXRpb24gLSBQTTIuNSBFeGNlZWRhbmNlJyxcbiAgICAgICAgICAgICAgICAgICAgIHNpemU6MjAwMyxcbiAgICAgICAgXHRcdFx0XHRcdFx0IGljb246JycsXG4gICAgICAgIFx0XHRcdFx0XHRcdCBjb2xvcjonI2ZkZTk5YycsXG4gICAgICAgIFx0XHRcdFx0XHRcdCBkZXNjcmlwdGlvbjonUHJvcG9ydGlvbiBvZiB0aGUgcG9wdWxhdGlvbiB3aG9zZSBleHBvc3VyZSBpcyBhYm92ZSAgV0hPIHRocmVzaG9sZHMgKDEwLCAxNSwgMjUsIDM1IG1pY3JvZ3JhbXMvbTMpJ1xuICAgICAgICBcdFx0XHRcdFx0IH1dXG4gICAgICAgIFx0XHRcdFx0IH0se1xuICAgICAgICBcdFx0XHRcdFx0IGNvbHVtbl9uYW1lOidlaF93cycsXG4gICAgICAgIFx0XHRcdFx0XHQgdGl0bGU6J1dhdGVyIFNhbml0YXRpb24nLFxuICAgICAgICBcdFx0XHRcdFx0IGNvbG9yOiAnI2VkNmMyZScsXG4gICAgICAgIFx0XHRcdFx0XHQgaWNvbjogJ2ZhYnJpYycsXG4gICAgICAgIFx0XHRcdFx0XHQgdW5pY29kZTogJ1xcdWU2MDYnLFxuICAgICAgICBcdFx0XHRcdFx0IGNoaWxkcmVuOlt7XG4gICAgICAgIFx0XHRcdFx0XHRcdGNvbHVtbl9uYW1lOiAnZWhfd3NfYWNjZXNzX3RvX2RyaW5raW5nX3dhdGVyJyxcbiAgICAgICAgXHRcdFx0XHRcdFx0dGl0bGU6J0FjY2VzcyB0byBEcmlua2luZyBXYXRlcicsXG4gICAgICAgICAgICAgICAgICAgIHNpemU6Mjg4MCxcbiAgICAgICAgXHRcdFx0XHRcdFx0aWNvbjonJyxcbiAgICAgICAgXHRcdFx0XHRcdFx0Y29sb3I6JyNmMTg3NTMnLFxuICAgICAgICBcdFx0XHRcdFx0XHRkZXNjcmlwdGlvbjonUGVyY2VudGFnZSBvZiBwb3B1bGF0aW9uIHdpdGggYWNjZXNzIHRvIGltcHJvdmVkIGRyaW5raW5nIHdhdGVyIHNvdXJjZSdcbiAgICAgICAgXHRcdFx0XHRcdH0se1xuICAgICAgICBcdFx0XHRcdFx0XHRjb2x1bW5fbmFtZTogJ2VoX3dzX2FjY2Vzc190b19zYW5pdGF0aW9uJyxcbiAgICAgICAgXHRcdFx0XHRcdFx0dGl0bGU6J0FjY2VzcyB0byBTYW5pdGF0aW9uJyxcbiAgICAgICAgICAgICAgICAgICAgc2l6ZToyODgwLFxuICAgICAgICBcdFx0XHRcdFx0XHRpY29uOicnLFxuICAgICAgICBcdFx0XHRcdFx0XHRjb2xvcjonI2Y1YTQ3ZCcsXG4gICAgICAgIFx0XHRcdFx0XHRcdGRlc2NyaXB0aW9uOidQZXJjZW50YWdlIG9mIHBvcHVsYXRpb24gd2l0aCBhY2Nlc3MgdG8gaW1wcm92ZWQgc2FuaXRhdGlvbidcbiAgICAgICAgXHRcdFx0XHRcdH1dXG4gICAgICAgIFx0XHRcdFx0IH1dXG4gICAgICAgIFx0XHRcdCB9LHtcbiAgICAgICAgXHRcdFx0XHQgY29sdW1uX25hbWU6ICdldicsXG4gICAgICAgIFx0XHRcdFx0IHRpdGxlOiAnRWNvc3lzdGVtIFZhbGlkaXR5JyxcbiAgICAgICAgXHRcdFx0XHQgcmFuZ2U6WzAsIDEwMF0sXG4gICAgICAgIFx0XHRcdFx0IGljb246JycsXG4gICAgICAgIFx0XHRcdFx0IGNvbG9yOicjMDA2YmI2JyxcbiAgICAgICAgXHRcdFx0XHQgY2hpbGRyZW46W3tcbiAgICAgICAgXHRcdFx0XHRcdCBjb2x1bW5fbmFtZTonZXZfd3InLFxuICAgICAgICBcdFx0XHRcdFx0IHRpdGxlOidXYXRlciBSZXNvdXJjZXMnLFxuICAgICAgICBcdFx0XHRcdFx0IGNvbG9yOiAnIzdhOGRjNycsXG4gICAgICAgIFx0XHRcdFx0XHQgaWNvbjogJ3dhdGVyJyxcbiAgICAgICAgXHRcdFx0XHRcdCB1bmljb2RlOiAnXFx1ZTYwOCcsXG4gICAgICAgIFx0XHRcdFx0XHQgY2hpbGRyZW46W3tcbiAgICAgICAgXHRcdFx0XHRcdFx0IGNvbHVtbl9uYW1lOiAnZXZfd3Jfd2FzdGV3YXRlcl90cmVhdG1lbnQnLFxuICAgICAgICBcdFx0XHRcdFx0XHQgdGl0bGU6J1dhc3Rld2F0ZXIgVHJlYXRtZW50JyxcbiAgICAgICAgICAgICAgICAgICAgIHNpemU6NDAwMCxcbiAgICAgICAgXHRcdFx0XHRcdFx0IGljb246JycsXG4gICAgICAgIFx0XHRcdFx0XHRcdCBjb2xvcjonIzk1YTZkNScsXG4gICAgICAgIFx0XHRcdFx0XHRcdCBkZXNjcmlwdGlvbjonV2FzdGV3YXRlciB0cmVhdG1lbnQgbGV2ZWwgd2VpZ2h0ZWQgYnkgY29ubmVjdGlvbiB0byB3YXN0ZXdhdGVyIHRyZWF0bWVudCByYXRlLidcbiAgICAgICAgXHRcdFx0XHRcdCB9XVxuICAgICAgICBcdFx0XHRcdCB9LHtcbiAgICAgICAgXHRcdFx0XHRcdCBjb2x1bW5fbmFtZTonZXZfYWcnLFxuICAgICAgICBcdFx0XHRcdFx0IHRpdGxlOidBZ3JpY3VsdHVyZScsXG4gICAgICAgIFx0XHRcdFx0XHQgY29sb3I6ICcjMmU3NGJhJyxcbiAgICAgICAgXHRcdFx0XHRcdCBpY29uOiAnYWdyYXInLFxuICAgICAgICBcdFx0XHRcdFx0IHVuaWNvZGU6ICdcXHVlNjAwJyxcbiAgICAgICAgXHRcdFx0XHRcdCBjaGlsZHJlbjpbe1xuICAgICAgICBcdFx0XHRcdFx0XHQgY29sdW1uX25hbWU6ICdldl9hZ19hZ3JpY3VsdHVyYWxfc3Vic2lkaWVzJyxcbiAgICAgICAgXHRcdFx0XHRcdFx0IHRpdGxlOidBZ3JpY3VsdHVyYWwgU3Vic2lkaWVzJyxcbiAgICAgICAgICAgICAgICAgICAgIHNpemU6Nzk2LFxuICAgICAgICBcdFx0XHRcdFx0XHQgaWNvbjonJyxcbiAgICAgICAgXHRcdFx0XHRcdFx0IGNvbG9yOicjODJhYmQ2JyxcbiAgICAgICAgXHRcdFx0XHRcdFx0IGRlc2NyaXB0aW9uOidTdWJzaWRpZXMgYXJlIGV4cHJlc3NlZCBpbiBwcmljZSBvZiB0aGVpciBwcm9kdWN0IGluIHRoZSBkb21lc3RpYyBtYXJrZXQgKHBsdXMgYW55IGRpcmVjdCBvdXRwdXQgc3Vic2lkeSkgbGVzcyBpdHMgcHJpY2UgYXQgdGhlIGJvcmRlciwgZXhwcmVzc2VkIGFzIGEgcGVyY2VudGFnZSBvZiB0aGUgYm9yZGVyIHByaWNlIChhZGp1c3RpbmcgZm9yIHRyYW5zcG9ydCBjb3N0cyBhbmQgcXVhbGl0eSBkaWZmZXJlbmNlcykuJ1xuICAgICAgICBcdFx0XHRcdFx0IH0se1xuICAgICAgICBcdFx0XHRcdFx0XHQgY29sdW1uX25hbWU6ICdldl9hZ19wZXN0aWNpZGVfcmVndWxhdGlvbicsXG4gICAgICAgIFx0XHRcdFx0XHRcdCB0aXRsZTonUGVzdGljaWRlIFJlZ3VsYXRpb24nLFxuICAgICAgICAgICAgICAgICAgICAgc2l6ZTo3OTYsXG4gICAgICAgIFx0XHRcdFx0XHRcdCBpY29uOicnLFxuICAgICAgICBcdFx0XHRcdFx0XHQgY29sb3I6JyM1NzhmYzgnLFxuICAgICAgICBcdFx0XHRcdFx0XHQgZGVzY3JpcHRpb246J1dhc3Rld2F0ZXIgdHJlYXRtZW50IGxldmVsIHdlaWdodGVkIGJ5IGNvbm5lY3Rpb24gdG8gd2FzdGV3YXRlciB0cmVhdG1lbnQgcmF0ZS4nXG4gICAgICAgIFx0XHRcdFx0XHQgfV1cbiAgICAgICAgXHRcdFx0XHQgfSx7XG4gICAgICAgIFx0XHRcdFx0XHQgY29sdW1uX25hbWU6J2V2X2ZvJyxcbiAgICAgICAgXHRcdFx0XHRcdCB0aXRsZTonRm9yZXN0JyxcbiAgICAgICAgXHRcdFx0XHRcdCBjb2xvcjogJyMwMDlhY2InLFxuICAgICAgICBcdFx0XHRcdFx0IGljb246ICd0cmVlJyxcbiAgICAgICAgXHRcdFx0XHRcdCB1bmljb2RlOiAnXFx1ZTYwNycsXG4gICAgICAgIFx0XHRcdFx0XHQgY2hpbGRyZW46W3tcbiAgICAgICAgXHRcdFx0XHRcdFx0IGNvbHVtbl9uYW1lOiAnZXZfZm9fY2hhbmdlX2luX2ZvcmVzdF9jb3ZlcicsXG4gICAgICAgIFx0XHRcdFx0XHRcdCB0aXRsZTonQ2hhbmdlIGluIEZvcmVzdCBDb3ZlcicsXG4gICAgICAgICAgICAgICAgICAgICBzaXplOjE1NTAsXG4gICAgICAgIFx0XHRcdFx0XHRcdCBpY29uOicnLFxuICAgICAgICBcdFx0XHRcdFx0XHQgY29sb3I6JyMzMWFlZDUnLFxuICAgICAgICBcdFx0XHRcdFx0XHQgZGVzY3JpcHRpb246J0ZvcmVzdCBsb3NzIC0gRm9yZXN0IGdhaW4gaW4gPiA1MCUgdHJlZSBjb3ZlciwgYXMgY29tcGFyZWQgdG8gMjAwMCBsZXZlbHMuJ1xuICAgICAgICBcdFx0XHRcdFx0IH1dXG4gICAgICAgIFx0XHRcdFx0IH0se1xuICAgICAgICBcdFx0XHRcdFx0IGNvbHVtbl9uYW1lOidldl9maScsXG4gICAgICAgIFx0XHRcdFx0XHQgdGl0bGU6J0Zpc2hlcmllcycsXG4gICAgICAgIFx0XHRcdFx0XHQgY29sb3I6ICcjMDA4YzhjJyxcbiAgICAgICAgXHRcdFx0XHRcdCBpY29uOiAnYW5jaG9yJyxcbiAgICAgICAgXHRcdFx0XHRcdCB1bmljb2RlOiAnXFx1ZTYwMScsXG4gICAgICAgIFx0XHRcdFx0XHQgY2hpbGRyZW46W3tcbiAgICAgICAgXHRcdFx0XHRcdFx0IGNvbHVtbl9uYW1lOiAnZXZfZmlfY29hc3RhbF9zaGVsZl9maXNoaW5nX3ByZXNzdXJlJyxcbiAgICAgICAgXHRcdFx0XHRcdFx0IHRpdGxlOidDb2FzdGFsIFNoZWxmIEZpc2hpbmcgUHJlc3N1cmUnLFxuICAgICAgICAgICAgICAgICAgICAgc2l6ZTo5MDEsXG4gICAgICAgIFx0XHRcdFx0XHRcdCBpY29uOicnLFxuICAgICAgICBcdFx0XHRcdFx0XHQgY29sb3I6JyM2NWI4YjcnLFxuICAgICAgICBcdFx0XHRcdFx0XHQgZGVzY3JpcHRpb246J0NhdGNoIGluIG1ldHJpYyB0b25zIGZyb20gdHJhd2xpbmcgYW5kIGRyZWRnaW5nIGdlYXJzIChtb3N0bHkgYm90dG9tIHRyYXdscykgZGl2aWRlZCBieSBFRVogYXJlYS4nXG4gICAgICAgIFx0XHRcdFx0XHQgfSx7XG4gICAgICAgIFx0XHRcdFx0XHRcdCBjb2x1bW5fbmFtZTogJ2V2X2ZpX2Zpc2hfc3RvY2tzJyxcbiAgICAgICAgXHRcdFx0XHRcdFx0IHRpdGxlOidGaXNoIFN0b2NrcycsXG4gICAgICAgICAgICAgICAgICAgICBzaXplOjkwMSxcbiAgICAgICAgXHRcdFx0XHRcdFx0IGljb246JycsXG4gICAgICAgIFx0XHRcdFx0XHRcdCBjb2xvcjonIzMwYTJhMicsXG4gICAgICAgIFx0XHRcdFx0XHRcdCBkZXNjcmlwdGlvbjonUGVyY2VudGFnZSBvZiBmaXNoaW5nIHN0b2NrcyBvdmVyZXhwbG9pdGVkIGFuZCBjb2xsYXBzZWQgZnJvbSBFRVouJ1xuICAgICAgICBcdFx0XHRcdFx0IH1dXG4gICAgICAgIFx0XHRcdFx0IH0se1xuICAgICAgICBcdFx0XHRcdFx0IGNvbHVtbl9uYW1lOidldl9iZCcsXG4gICAgICAgIFx0XHRcdFx0XHQgdGl0bGU6J0Jpb2RpdmVyc2l0eSBhbmQgSGFiaXRhdCcsXG4gICAgICAgIFx0XHRcdFx0XHQgY29sb3I6ICcjNDRiNmEwJyxcbiAgICAgICAgXHRcdFx0XHRcdCBpY29uOiAnYnV0dGVyZmx5JyxcbiAgICAgICAgXHRcdFx0XHRcdCB1bmljb2RlOiAnXFx1ZTYwMicsXG4gICAgICAgIFx0XHRcdFx0XHQgY2hpbGRyZW46W3tcbiAgICAgICAgXHRcdFx0XHRcdFx0IGNvbHVtbl9uYW1lOiAnZXZfYmRfdGVycmVzdHJpYWxfcHJvdGVjdGVkX2FyZWFzX25hdGlvbmFsX2Jpb21lJyxcbiAgICAgICAgXHRcdFx0XHRcdFx0IHRpdGxlOidOYXRpb25hbCBCaW9tZSBQcm90ZWN0aW9uJyxcbiAgICAgICAgICAgICAgICAgICAgIHNpemU6MTA3NCxcbiAgICAgICAgXHRcdFx0XHRcdFx0IGljb246JycsXG4gICAgICAgIFx0XHRcdFx0XHRcdCBjb2xvcjonI2NlZThlNycsXG4gICAgICAgIFx0XHRcdFx0XHRcdCBkZXNjcmlwdGlvbjonUGVyY2VudGFnZSBvZiB0ZXJyZXN0cmlhbCBiaW9tZSBhcmVhIHRoYXQgaXMgcHJvdGVjdGVkLCB3ZWlnaHRlZCBieSBkb21lc3RpYyBiaW9tZSBhcmVhLidcbiAgICAgICAgXHRcdFx0XHRcdCB9LHtcbiAgICAgICAgXHRcdFx0XHRcdFx0IGNvbHVtbl9uYW1lOiAnZXZfYmRfdGVycmVzdHJpYWxfcHJvdGVjdGVkX2FyZWFzX2dsb2JhbF9iaW9tZScsXG4gICAgICAgIFx0XHRcdFx0XHRcdCB0aXRsZTonR2xvYmFsIEJpb21lIFByb3RlY3Rpb24nLFxuICAgICAgICAgICAgICAgICAgICAgc2l6ZToxMDc0LFxuICAgICAgICBcdFx0XHRcdFx0XHQgaWNvbjonJyxcbiAgICAgICAgXHRcdFx0XHRcdFx0IGNvbG9yOicjYTJkNWQxJyxcbiAgICAgICAgXHRcdFx0XHRcdFx0IGRlc2NyaXB0aW9uOidQZXJjZW50YWdlIG9mIHRlcnJlc3RyaWFsIGJpb21lIGFyZWEgdGhhdCBpcyBwcm90ZWN0ZWQsIHdlaWdodGVkIGJ5IGdsb2JhbCBiaW9tZSBhcmVhLidcbiAgICAgICAgXHRcdFx0XHRcdCB9LHtcbiAgICAgICAgXHRcdFx0XHRcdFx0IGNvbHVtbl9uYW1lOiAnZXZfYmRfbWFyaW5lX3Byb3RlY3RlZF9hcmVhcycsXG4gICAgICAgIFx0XHRcdFx0XHRcdCB0aXRsZTonTWFyaW5lIFByb3RlY3RlZCBBcmVhcycsXG4gICAgICAgICAgICAgICAgICAgICBzaXplOjEwNzQsXG4gICAgICAgIFx0XHRcdFx0XHRcdCBpY29uOicnLFxuICAgICAgICBcdFx0XHRcdFx0XHQgY29sb3I6JyM3N2MxYjknLFxuICAgICAgICBcdFx0XHRcdFx0XHQgZGVzY3JpcHRpb246J01hcmluZSBwcm90ZWN0ZWQgYXJlYXMgYXMgYSBwZXJjZW50IG9mIEVFWi4nXG4gICAgICAgIFx0XHRcdFx0XHQgfSx7XG4gICAgICAgIFx0XHRcdFx0XHRcdCBjb2x1bW5fbmFtZTogJ2V2X2JkX2NyaXRpY2FsX2hhYml0YXRfcHJvdGVjdGlvbicsXG4gICAgICAgIFx0XHRcdFx0XHRcdCB0aXRsZTonQ3JpdGljYWwgSGFiaXRhdCBQcm90ZWN0aW9uJyxcbiAgICAgICAgICAgICAgICAgICAgIHNpemU6MTA3NCxcbiAgICAgICAgXHRcdFx0XHRcdFx0IGljb246JycsXG4gICAgICAgIFx0XHRcdFx0XHRcdCBjb2xvcjonIzU4YmJhZScsXG4gICAgICAgIFx0XHRcdFx0XHRcdCBkZXNjcmlwdGlvbjonUGVyY2VudGFnZSBvZiB0ZXJyZXN0cmlhbCBiaW9tZSBhcmVhIHRoYXQgaXMgcHJvdGVjdGVkLCB3ZWlnaHRlZCBieSBnbG9iYWwgYmlvbWUgYXJlYS4nXG4gICAgICAgIFx0XHRcdFx0XHQgfV1cbiAgICAgICAgXHRcdFx0XHQgfSx7XG4gICAgICAgIFx0XHRcdFx0XHQgY29sdW1uX25hbWU6J2V2X2NlJyxcbiAgICAgICAgXHRcdFx0XHRcdCB0aXRsZTonQ2xpbWF0ZSBhbmQgRW5lcmd5JyxcbiAgICAgICAgXHRcdFx0XHRcdCBjb2xvcjogJyMzYmFkNWUnLFxuICAgICAgICBcdFx0XHRcdFx0IGljb246ICdlbmVyZ3knLFxuICAgICAgICBcdFx0XHRcdFx0IHVuaWNvZGU6ICdcXHVlNjAzJyxcbiAgICAgICAgXHRcdFx0XHRcdCBjaGlsZHJlbjpbe1xuICAgICAgICBcdFx0XHRcdFx0XHQgY29sdW1uX25hbWU6ICdldl9jZV90cmVuZF9pbl9jYXJib25faW50ZW5zaXR5JyxcbiAgICAgICAgXHRcdFx0XHRcdFx0IHRpdGxlOidUcmVuZCBpbiBDYXJib24gSW50ZW5zaXR5JyxcbiAgICAgICAgICAgICAgICAgICAgIHNpemU6MTUxNCxcbiAgICAgICAgXHRcdFx0XHRcdFx0IGljb246JycsXG4gICAgICAgIFx0XHRcdFx0XHRcdCBjb2xvcjonIzU5YjU3YScsXG4gICAgICAgIFx0XHRcdFx0XHRcdCBkZXNjcmlwdGlvbjonQ2hhbmdlIGluIENPMiBlbWlzc2lvbnMgcGVyIHVuaXQgR0RQIGZyb20gMTk5MCB0byAyMDEwLidcbiAgICAgICAgXHRcdFx0XHRcdCB9LHtcbiAgICAgICAgXHRcdFx0XHRcdFx0IGNvbHVtbl9uYW1lOiAnZXZfY2VfY2hhbmdlX29mX3RyZW5kX2luX2NhcmJvbl9pbnRlc2l0eScsXG4gICAgICAgIFx0XHRcdFx0XHRcdCB0aXRsZTonQ2hhbmdlIG9mIFRyZW5kIGluIENhcmJvbiBJbnRlbnNpdHknLFxuICAgICAgICAgICAgICAgICAgICAgc2l6ZToxNTE0LFxuICAgICAgICBcdFx0XHRcdFx0XHQgaWNvbjonJyxcbiAgICAgICAgXHRcdFx0XHRcdFx0IGNvbG9yOicjODBjMzk5JyxcbiAgICAgICAgXHRcdFx0XHRcdFx0IGRlc2NyaXB0aW9uOidDaGFuZ2UgaW4gVHJlbmQgb2YgQ08yIGVtaXNzaW9ucyBwZXIgdW5pdCBHRFAgZnJvbSAxOTkwIHRvIDIwMDA7IDIwMDAgdG8gMjAxMC4nXG4gICAgICAgIFx0XHRcdFx0XHQgfSx7XG4gICAgICAgIFx0XHRcdFx0XHRcdCBjb2x1bW5fbmFtZTogJ2V2X2NlX3RyZW5kX2luX2NvMl9lbWlzc2lvbnNfcGVyX2t3aCcsXG4gICAgICAgIFx0XHRcdFx0XHRcdCB0aXRsZTonVHJlbmQgaW4gQ08yIEVtaXNzaW9ucyBwZXIgS1dIJyxcbiAgICAgICAgICAgICAgICAgICAgIHNpemU6MTUxNCxcbiAgICAgICAgXHRcdFx0XHRcdFx0IGljb246JycsXG4gICAgICAgIFx0XHRcdFx0XHRcdCBjb2xvcjonI2E4ZDRiOCcsXG4gICAgICAgIFx0XHRcdFx0XHRcdCBkZXNjcmlwdGlvbjonQ2hhbmdlIGluIENPMiBlbWlzc2lvbnMgZnJvbSBlbGVjdHJpY2l0eSBhbmQgaGVhdCBwcm9kdWN0aW9uLidcbiAgICAgICAgXHRcdFx0XHRcdCB9XVxuICAgICAgICBcdFx0XHRcdCB9XVxuICAgICAgICBcdFx0XHQgfV1cbiAgICAgICAgXHRcdH07XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuc2VydmljZXMnKS5mYWN0b3J5KCdNYXBTZXJ2aWNlJywgZnVuY3Rpb24obGVhZmxldERhdGEpe1xuICAgICAgICAvL1xuICAgICAgICB2YXIgbGVhZmxldCA9IHt9O1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHNldExlYWZsZXREYXRhOiBmdW5jdGlvbihsZWFmKXtcbiAgICAgICAgICAgIGxlYWZsZXQgPSBsZWFmbGV0O1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZ2V0TGVhZmxldERhdGE6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICByZXR1cm4gbGVhZmxldDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZShcImFwcC5zZXJ2aWNlc1wiKS5mYWN0b3J5KCdEaWFsb2dTZXJ2aWNlJywgZnVuY3Rpb24oJG1kRGlhbG9nKXtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRmcm9tVGVtcGxhdGU6IGZ1bmN0aW9uKHRlbXBsYXRlLCAkc2NvcGUpe1xuXG5cdFx0XHRcdHZhciBvcHRpb25zID0ge1xuXHRcdFx0XHRcdHRlbXBsYXRlVXJsOiAnL3ZpZXdzL2RpYWxvZ3MvJyArIHRlbXBsYXRlICsgJy8nICsgdGVtcGxhdGUgKyAnLmh0bWwnXG5cdFx0XHRcdH07XG5cblx0XHRcdFx0aWYgKCRzY29wZSl7XG5cdFx0XHRcdFx0b3B0aW9ucy5zY29wZSA9ICRzY29wZS4kbmV3KCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm4gJG1kRGlhbG9nLnNob3cob3B0aW9ucyk7XG5cdFx0XHR9LFxuXG5cdFx0XHRoaWRlOiBmdW5jdGlvbigpe1xuXHRcdFx0XHRyZXR1cm4gJG1kRGlhbG9nLmhpZGUoKTtcblx0XHRcdH0sXG5cblx0XHRcdGFsZXJ0OiBmdW5jdGlvbih0aXRsZSwgY29udGVudCl7XG5cdFx0XHRcdCRtZERpYWxvZy5zaG93KFxuXHRcdFx0XHRcdCRtZERpYWxvZy5hbGVydCgpXG5cdFx0XHRcdFx0XHQudGl0bGUodGl0bGUpXG5cdFx0XHRcdFx0XHQuY29udGVudChjb250ZW50KVxuXHRcdFx0XHRcdFx0Lm9rKCdPaycpXG5cdFx0XHRcdCk7XG5cdFx0XHR9XG5cdFx0fTtcblx0fSk7XG59KSgpOyIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZShcImFwcC5zZXJ2aWNlc1wiKS5mYWN0b3J5KCdUb2FzdFNlcnZpY2UnLCBmdW5jdGlvbigkbWRUb2FzdCl7XG5cblx0XHR2YXIgZGVsYXkgPSA2MDAwLFxuXHRcdFx0cG9zaXRpb24gPSAndG9wIHJpZ2h0Jyxcblx0XHRcdGFjdGlvbiA9ICdPSyc7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0c2hvdzogZnVuY3Rpb24oY29udGVudCl7XG5cdFx0XHRcdGlmICghY29udGVudCl7XG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuICRtZFRvYXN0LnNob3coXG5cdFx0XHRcdFx0JG1kVG9hc3Quc2ltcGxlKClcblx0XHRcdFx0XHRcdC5jb250ZW50KGNvbnRlbnQpXG5cdFx0XHRcdFx0XHQucG9zaXRpb24ocG9zaXRpb24pXG5cdFx0XHRcdFx0XHQuYWN0aW9uKGFjdGlvbilcblx0XHRcdFx0XHRcdC5oaWRlRGVsYXkoZGVsYXkpXG5cdFx0XHRcdCk7XG5cdFx0XHR9LFxuXHRcdFx0ZXJyb3I6IGZ1bmN0aW9uKGNvbnRlbnQpe1xuXHRcdFx0XHRpZiAoIWNvbnRlbnQpe1xuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiAkbWRUb2FzdC5zaG93KFxuXHRcdFx0XHRcdCRtZFRvYXN0LnNpbXBsZSgpXG5cdFx0XHRcdFx0XHQuY29udGVudChjb250ZW50KVxuXHRcdFx0XHRcdFx0LnBvc2l0aW9uKHBvc2l0aW9uKVxuXHRcdFx0XHRcdFx0LnRoZW1lKCd3YXJuJylcblx0XHRcdFx0XHRcdC5hY3Rpb24oYWN0aW9uKVxuXHRcdFx0XHRcdFx0LmhpZGVEZWxheShkZWxheSlcblx0XHRcdFx0KTtcblx0XHRcdH1cblx0XHR9O1xuXHR9KTtcbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignRXBpQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgJHJvb3RTY29wZSwgJHN0YXRlLCAkdGltZW91dCwgJG1kVG9hc3QsIEluZGV4U2VydmljZSwgRVBJLCBEYXRhU2VydmljZSwgbGVhZmxldERhdGEsIE1hcFNlcnZpY2UpIHtcblxuXHRcdCRzY29wZS5jdXJyZW50ID0gXCJcIjtcblx0XHQkc2NvcGUuZGlzcGxheSA9IHtcblx0XHRcdHNlbGVjdGVkQ2F0OiAnJyxcblx0XHRcdHJhbms6IFt7XG5cdFx0XHRcdGZpZWxkczoge1xuXHRcdFx0XHRcdHg6ICd5ZWFyJyxcblx0XHRcdFx0XHR5OiAncmFuaydcblx0XHRcdFx0fSxcblx0XHRcdFx0dGl0bGU6ICdSYW5rJyxcblx0XHRcdFx0Y29sb3I6ICcjNTJiNjk1J1xuXHRcdFx0fV0sXG5cdFx0XHRzY29yZTogW3tcblx0XHRcdFx0ZmllbGRzOiB7XG5cdFx0XHRcdFx0eDogJ3llYXInLFxuXHRcdFx0XHRcdHk6ICdzY29yZSdcblx0XHRcdFx0fSxcblx0XHRcdFx0dGl0bGU6ICdTY29yZScsXG5cdFx0XHRcdGNvbG9yOiAnIzAwNjZiOSdcblx0XHRcdH1dXG5cdFx0fTtcblx0XHQkc2NvcGUudGFiQ29udGVudCA9IFwiXCI7XG5cdFx0JHNjb3BlLnRvZ2dsZUJ1dHRvbiA9ICdhcnJvd19kcm9wX2Rvd24nO1xuXHRcdCRzY29wZS5pbmRleERhdGEgPSBJbmRleFNlcnZpY2UuZ2V0RXBpKCk7XG5cdFx0JHNjb3BlLmVwaSA9IFtdO1xuXHRcdCRzY29wZS5tZW51ZU9wZW4gPSB0cnVlO1xuXHRcdCRzY29wZS5pbmZvID0gZmFsc2U7XG5cdFx0JHNjb3BlLmNsb3NlSWNvbiA9ICdjbG9zZSc7XG5cdFx0JHNjb3BlLmNvbXBhcmUgPSB7XG5cdFx0XHRhY3RpdmU6IGZhbHNlLFxuXHRcdFx0Y291bnRyaWVzOiBbXVxuXHRcdH07XG5cdFx0JHNjb3BlLmVwaSA9IEVQSTtcblx0XHQkc2NvcGUuc2VsZWN0ZWRUYWIgPSAwO1xuXHRcdCRzY29wZS5zaG93VGFiQ29udGVudCA9IGZ1bmN0aW9uKGNvbnRlbnQpIHtcblx0XHRcdGlmIChjb250ZW50ID09ICcnICYmICRzY29wZS50YWJDb250ZW50ID09ICcnKSB7XG5cdFx0XHRcdCRzY29wZS50YWJDb250ZW50ID0gJ3JhbmsnO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JHNjb3BlLnRhYkNvbnRlbnQgPSBjb250ZW50O1xuXHRcdFx0fVxuXHRcdFx0JHNjb3BlLnRvZ2dsZUJ1dHRvbiA9ICRzY29wZS50YWJDb250ZW50ID8gJ2Fycm93X2Ryb3BfdXAnIDogJ2Fycm93X2Ryb3BfZG93bic7XG5cdFx0fTtcblxuXHRcdCRzY29wZS5zZXRTdGF0ZSA9IGZ1bmN0aW9uKGl0ZW0pIHtcblx0XHRcdCRzY29wZS5zZXRDdXJyZW50KGdldE5hdGlvbkJ5SXNvKGl0ZW0pKTtcblx0XHR9O1xuXHRcdCRzY29wZS50b2dnbGVPcGVuID0gZnVuY3Rpb24oKSB7XG5cdFx0XHQkc2NvcGUubWVudWVPcGVuID0gISRzY29wZS5tZW51ZU9wZW47XG5cdFx0XHQkc2NvcGUuY2xvc2VJY29uID0gJHNjb3BlLm1lbnVlT3BlbiA9PSB0cnVlID8gJ2NoZXZyb25fbGVmdCcgOiAnY2hldnJvbl9yaWdodCc7XG5cdFx0fVxuXHRcdCRzY29wZS5zZXRDdXJyZW50ID0gZnVuY3Rpb24obmF0KSB7XG5cdFx0XHQkc2NvcGUuY3VycmVudCA9IG5hdDtcblx0XHRcdCRzY29wZS5zZXRTZWxlY3RlZEZlYXR1cmUoKTtcblx0XHR9O1xuXHRcdCRzY29wZS5zZXRTZWxlY3RlZEZlYXR1cmUgPSBmdW5jdGlvbihpc28pIHtcblx0XHRcdGlmICgkc2NvcGUubXZ0U291cmNlKSB7XG5cdFx0XHRcdCR0aW1lb3V0KGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdCRzY29wZS5tdnRTb3VyY2UubGF5ZXJzLmNvdW50cmllc19iaWdfZ2VvbS5mZWF0dXJlc1skc2NvcGUuY3VycmVudC5pc29dLnNlbGVjdGVkID0gdHJ1ZTtcblx0XHRcdFx0fSlcblx0XHRcdH1cblx0XHR9O1xuXHRcdCRzY29wZS5nZXRSYW5rID0gZnVuY3Rpb24obmF0KSB7XG5cdFx0XHRyZXR1cm4gJHNjb3BlLmVwaS5pbmRleE9mKG5hdCkgKyAxO1xuXHRcdH07XG5cdFx0JHNjb3BlLnRvZ2dsZUluZm8gPSBmdW5jdGlvbigpIHtcblx0XHRcdC8vJHNjb3BlLmRpc3BsYXkuc2VsZWN0ZWRDYXQgPSAnJztcblx0XHRcdCRzY29wZS5pbmZvID0gISRzY29wZS5pbmZvO1xuXHRcdH07XG5cdFx0JHNjb3BlLnRvZ2dsZURldGFpbHMgPSBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiAkc2NvcGUuZGV0YWlscyA9ICEkc2NvcGUuZGV0YWlscztcblx0XHR9O1xuXHRcdCRzY29wZS5tYXBHb3RvQ291bnRyeSA9IGZ1bmN0aW9uKGlzbyl7XG5cdFx0XHREYXRhU2VydmljZS5nZXRPbmUoJ25hdGlvbnMvYmJveCcsIFskc2NvcGUuY291bnRyeS5pc29dKS50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcblx0XHRcdFx0JHNjb3BlLmJib3ggPSBkYXRhO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHRcdCRzY29wZS5jaGVja0NvbXBhcmlzb24gPSBmdW5jdGlvbih3YW50KSB7XG5cdFx0XHQvL2NvbnNvbGUubG9nKHdhbnQsJHNjb3BlLmNvbXBhcmUuYWN0aXZlKTtcblx0XHRcdGlmICh3YW50ICYmICEkc2NvcGUuY29tcGFyZS5hY3RpdmUgfHwgIXdhbnQgJiYgJHNjb3BlLmNvbXBhcmUuYWN0aXZlKSB7XG5cdFx0XHRcdCRzY29wZS50b2dnbGVDb21wYXJpc29uKCk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdCRzY29wZS50b2dnbGVDb21wYXJpc29uID0gZnVuY3Rpb24oKSB7XG5cdFx0XHQkc2NvcGUuY29tcGFyZS5jb3VudHJpZXMgPSBbJHNjb3BlLmN1cnJlbnRdO1xuXHRcdFx0JHNjb3BlLmNvbXBhcmUuYWN0aXZlID0gISRzY29wZS5jb21wYXJlLmFjdGl2ZTtcblx0XHRcdGlmICgkc2NvcGUuY29tcGFyZS5hY3RpdmUpIHtcblx0XHRcdFx0Ly8kc3RhdGUuZ28oJ2FwcC5lcGkuc2VsZWN0ZWQuY29tcGFyZScpO1xuXHRcdFx0XHQkc2NvcGUuc2V0VGFiKDIpO1xuXHRcdFx0XHQkcm9vdFNjb3BlLmdyZXllZCA9IHRydWU7XG5cdFx0XHRcdCRzY29wZS5tdnRTb3VyY2Uub3B0aW9ucy5tdXRleFRvZ2dsZSA9IGZhbHNlO1xuXHRcdFx0XHQkc2NvcGUubXZ0U291cmNlLnNldFN0eWxlKGludmVydGVkU3R5bGUpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JHJvb3RTY29wZS5ncmV5ZWQgPSBmYWxzZTtcblx0XHRcdFx0Ly8kc3RhdGUuZ28oJ2FwcC5lcGkuc2VsZWN0ZWQnLCB7aXRlbTokc2NvcGUuY3VycmVudC5pc299KTtcblx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKCRzY29wZS5tdnRTb3VyY2UubGF5ZXJzLmNvdW50cmllc19iaWdfZ2VvbS5mZWF0dXJlcywgZnVuY3Rpb24oZmVhdHVyZSkge1xuXHRcdFx0XHRcdGZlYXR1cmUuc2VsZWN0ZWQgPSBmYWxzZTtcblx0XHRcdFx0fSk7XG5cdFx0XHRcdCRzY29wZS5tdnRTb3VyY2UubGF5ZXJzLmNvdW50cmllc19iaWdfZ2VvbS5mZWF0dXJlc1skc2NvcGUuY3VycmVudC5pc29dLnNlbGVjdGVkID0gdHJ1ZTtcblx0XHRcdFx0JHNjb3BlLm12dFNvdXJjZS5vcHRpb25zLm11dGV4VG9nZ2xlID0gdHJ1ZTtcblx0XHRcdFx0JHNjb3BlLm12dFNvdXJjZS5zZXRTdHlsZShjb3VudHJpZXNTdHlsZSk7XG5cdFx0XHRcdERhdGFTZXJ2aWNlLmdldE9uZSgnbmF0aW9ucy9iYm94JywgWyRzY29wZS5jb3VudHJ5Lmlzb10pLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuXHRcdFx0XHRcdCRzY29wZS5iYm94ID0gZGF0YTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fTtcblx0XHQkc2NvcGUudG9nZ2xlQ291bnRyaWVMaXN0ID0gZnVuY3Rpb24oY291bnRyeSkge1xuXHRcdFx0dmFyIGZvdW5kID0gZmFsc2U7XG5cdFx0XHRhbmd1bGFyLmZvckVhY2goJHNjb3BlLmNvbXBhcmUuY291bnRyaWVzLCBmdW5jdGlvbihuYXQsIGtleSkge1xuXHRcdFx0XHRpZiAoY291bnRyeSA9PSBuYXQgJiYgbmF0ICE9ICRzY29wZS5jdXJyZW50KSB7XG5cdFx0XHRcdFx0JHNjb3BlLmNvbXBhcmUuY291bnRyaWVzLnNwbGljZShrZXksIDEpO1xuXHRcdFx0XHRcdGZvdW5kID0gdHJ1ZTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0XHRpZiAoIWZvdW5kKSB7XG5cdFx0XHRcdCRzY29wZS5jb21wYXJlLmNvdW50cmllcy5wdXNoKGNvdW50cnkpO1xuXHRcdFx0fTtcblx0XHRcdHZhciBpc29zID0gW107XG5cdFx0XHRhbmd1bGFyLmZvckVhY2goJHNjb3BlLmNvbXBhcmUuY291bnRyaWVzLCBmdW5jdGlvbihpdGVtLCBrZXkpIHtcblx0XHRcdFx0aXNvcy5wdXNoKGl0ZW0uaXNvKTtcblx0XHRcdH0pO1xuXHRcdFx0aWYgKGlzb3MubGVuZ3RoID4gMSkge1xuXHRcdFx0XHREYXRhU2VydmljZS5nZXRPbmUoJ25hdGlvbnMvYmJveCcsIGlzb3MpLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuXHRcdFx0XHRcdCRzY29wZS5iYm94ID0gZGF0YTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiAhZm91bmQ7XG5cdFx0fTtcblx0XHQkc2NvcGUuZ2V0T2Zmc2V0ID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRpZiAoISRzY29wZS5jdXJyZW50KSB7XG5cdFx0XHRcdHJldHVybiAwO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuICgkc2NvcGUuY3VycmVudC5yYW5rID09IDEgPyAwIDogJHNjb3BlLmN1cnJlbnQucmFuayA9PSAkc2NvcGUuY3VycmVudC5sZW5ndGggKyAxID8gJHNjb3BlLmN1cnJlbnQucmFuayA6ICRzY29wZS5jdXJyZW50LnJhbmsgLSAyKSAqIDE2O1xuXHRcdFx0Ly9yZXR1cm4gJHNjb3BlLmN1cnJlbnQucmFuayAtIDIgfHwgMDtcblx0XHR9O1xuXHRcdCRzY29wZS5nZXRUZW5kZW5jeSA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0aWYgKCEkc2NvcGUuY3VycmVudCkge1xuXHRcdFx0XHRyZXR1cm4gJ2Fycm93X2Ryb3BfZG93bidcblx0XHRcdH1cblx0XHRcdHJldHVybiAkc2NvcGUuY3VycmVudC5wZXJjZW50X2NoYW5nZSA+IDAgPyAnYXJyb3dfZHJvcF91cCcgOiAnYXJyb3dfZHJvcF9kb3duJztcblx0XHR9O1xuXG5cdFx0JHNjb3BlLiR3YXRjaCgnY3VycmVudCcsIGZ1bmN0aW9uKG5ld0l0ZW0sIG9sZEl0ZW0pIHtcblx0XHRcdGlmIChuZXdJdGVtID09PSBvbGRJdGVtKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHRcdGlmIChuZXdJdGVtLmlzbykge1xuXHRcdFx0XHQkc3RhdGUuZ28oJ2FwcC5lcGkuc2VsZWN0ZWQnLCB7XG5cdFx0XHRcdFx0aXRlbTogbmV3SXRlbS5pc29cblx0XHRcdFx0fSlcblx0XHRcdFx0JHNjb3BlLm12dFNvdXJjZS5sYXllcnMuY291bnRyaWVzX2JpZ19nZW9tLmZlYXR1cmVzW29sZEl0ZW0uaXNvXS5zZWxlY3RlZCA9IGZhbHNlO1xuXHRcdFx0XHQkc2NvcGUubXZ0U291cmNlLm9wdGlvbnMubXV0ZXhUb2dnbGUgPSB0cnVlO1xuXHRcdFx0XHREYXRhU2VydmljZS5nZXRPbmUoJ25hdGlvbnMvYmJveCcsIFskc2NvcGUuY3VycmVudC5pc29dKS50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcblx0XHRcdFx0XHQkc2NvcGUuYmJveCA9IGRhdGE7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JHN0YXRlLmdvKCdhcHAuZXBpJyk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0JHNjb3BlLnNldFRhYiA9IGZ1bmN0aW9uKGkpe1xuXHRcdFx0JHNjb3BlLmFjdGl2ZVRhYiA9IGk7XG5cdFx0fVxuXHRcdCRzY29wZS5ub2RlUGFyZW50ID0ge307XG5cdFx0ZnVuY3Rpb24gZ2V0UGFyZW50KGRhdGEpe1xuXHRcdFx0XHR2YXIgaXRlbXMgPSBbXTtcblx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKGRhdGEuY2hpbGRyZW4sIGZ1bmN0aW9uKGl0ZW0pe1xuXHRcdFx0XHRcdGlmKGl0ZW0uY29sdW1uX25hbWUgPT0gJHNjb3BlLmRpc3BsYXkuc2VsZWN0ZWRDYXQudHlwZSl7XG5cdFx0XHRcdFx0XHQkc2NvcGUubm9kZVBhcmVudCA9ZGF0YTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Z2V0UGFyZW50KGl0ZW0pO1xuXHRcdFx0XHR9KTtcblx0XHRcdFx0cmV0dXJuIGl0ZW1zO1xuXHRcdH1cblx0XHQkc2NvcGUuY2FsY1RyZWUgPSBmdW5jdGlvbigpe1xuXHRcdFx0Y29uc29sZS5sb2coJHNjb3BlLmRpc3BsYXkuc2VsZWN0ZWRDYXQpO1xuXHRcdFx0XHRnZXRQYXJlbnQoJHNjb3BlLmluZGV4RGF0YSk7XG5cdFx0fTtcblx0XHQkc2NvcGUuJHdhdGNoKCdkaXNwbGF5LnNlbGVjdGVkQ2F0JywgZnVuY3Rpb24obiwgbykge1xuXHRcdFx0aWYgKG4gPT09IG8pIHtcblx0XHRcdFx0cmV0dXJuXG5cdFx0XHR9XG5cdFx0XHRpZiAobilcblx0XHRcdFx0dXBkYXRlQ2FudmFzKG4uY29sb3IpO1xuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdHVwZGF0ZUNhbnZhcygncmdiYSgxMjgsIDI0MywgMTk4LDEpJyk7XG5cdFx0XHR9O1xuXHRcdFx0JHNjb3BlLmNhbGNUcmVlKCk7XG5cdFx0XHRpZiAoJHNjb3BlLmNvbXBhcmUuYWN0aXZlKSB7XG5cdFx0XHRcdCRzY29wZS5tdnRTb3VyY2Uuc2V0U3R5bGUoaW52ZXJ0ZWRTdHlsZSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkc2NvcGUubXZ0U291cmNlLnNldFN0eWxlKGNvdW50cmllc1N0eWxlKTtcblx0XHRcdH1cblx0XHR9KTtcblx0XHQkc2NvcGUuJG9uKFwiJHN0YXRlQ2hhbmdlU3VjY2Vzc1wiLCBmdW5jdGlvbihldmVudCwgdG9TdGF0ZSwgdG9QYXJhbXMpIHtcblx0XHRcdGlmICh0b1N0YXRlLm5hbWUgPT0gXCJhcHAuZXBpLnNlbGVjdGVkXCIpIHtcblx0XHRcdFx0JHJvb3RTY29wZS5tb3ZlID0gdHJ1ZTtcblx0XHRcdFx0JHNjb3BlLnNldFN0YXRlKHRvUGFyYW1zLml0ZW0pO1xuXHRcdFx0XHREYXRhU2VydmljZS5nZXRPbmUoJ25hdGlvbnMnLCB0b1BhcmFtcy5pdGVtKS50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcblx0XHRcdFx0XHQkc2NvcGUuY291bnRyeSA9IGRhdGE7XG5cdFx0XHRcdFx0RGF0YVNlcnZpY2UuZ2V0T25lKCduYXRpb25zL2Jib3gnLCBbJHNjb3BlLmNvdW50cnkuaXNvXSkudGhlbihmdW5jdGlvbihkYXRhKSB7XG5cdFx0XHRcdFx0XHQkc2NvcGUuYmJveCA9IGRhdGE7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSBlbHNlIGlmICh0b1N0YXRlLm5hbWUgPT0gXCJhcHAuZXBpLnNlbGVjdGVkLmNvbXBhcmVcIikge1xuXHRcdFx0XHQkc2NvcGUuc2V0U3RhdGUodG9QYXJhbXMuaXRlbSk7XG5cdFx0XHRcdC8vJHNjb3BlLmFjdGl2ZVRhYiA9IDI7XG5cdFx0XHRcdERhdGFTZXJ2aWNlLmdldE9uZSgnbmF0aW9ucycsIHRvUGFyYW1zLml0ZW0pLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuXHRcdFx0XHRcdCRzY29wZS5jb3VudHJ5ID0gZGF0YTtcblx0XHRcdFx0XHREYXRhU2VydmljZS5nZXRPbmUoJ25hdGlvbnMvYmJveCcsIFskc2NvcGUuY291bnRyeS5pc29dKS50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcblx0XHRcdFx0XHRcdCRzY29wZS5iYm94ID0gZGF0YTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fSk7XG5cdFx0XHRcdCRyb290U2NvcGUubW92ZSA9IGZhbHNlO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JHJvb3RTY29wZS5tb3ZlID0gZmFsc2U7XG5cdFx0XHRcdCRzY29wZS5jb3VudHJ5ID0gJHNjb3BlLmN1cnJlbnQgPSBcIlwiO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdHZhciBnZXROYXRpb25CeU5hbWUgPSBmdW5jdGlvbihuYW1lKSB7XG5cdFx0XHR2YXIgbmF0aW9uID0ge307XG5cdFx0XHRhbmd1bGFyLmZvckVhY2goJHNjb3BlLmVwaSwgZnVuY3Rpb24obmF0KSB7XG5cdFx0XHRcdGlmIChuYXQuY291bnRyeSA9PSBuYW1lKSB7XG5cdFx0XHRcdFx0bmF0aW9uID0gbmF0O1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHRcdHJldHVybiBuYXRpb247XG5cdFx0fTtcblx0XHR2YXIgZ2V0TmF0aW9uQnlJc28gPSBmdW5jdGlvbihpc28pIHtcblx0XHRcdHZhciBuYXRpb24gPSB7fTtcblx0XHRcdGFuZ3VsYXIuZm9yRWFjaCgkc2NvcGUuZXBpLCBmdW5jdGlvbihuYXQpIHtcblx0XHRcdFx0aWYgKG5hdC5pc28gPT0gaXNvKSB7XG5cdFx0XHRcdFx0bmF0aW9uID0gbmF0O1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHRcdHJldHVybiBuYXRpb247XG5cdFx0fTtcblx0XHR2YXIgY3JlYXRlQ2FudmFzID0gZnVuY3Rpb24oY29sb3JzKSB7XG5cdFx0XHQkc2NvcGUuY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG5cdFx0XHQkc2NvcGUuY2FudmFzLndpZHRoID0gMjU2O1xuXHRcdFx0JHNjb3BlLmNhbnZhcy5oZWlnaHQgPSAxMDtcblx0XHRcdCRzY29wZS5jdHggPSAkc2NvcGUuY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG5cdFx0XHR2YXIgZ3JhZGllbnQgPSAkc2NvcGUuY3R4LmNyZWF0ZUxpbmVhckdyYWRpZW50KDAsIDAsIDI4MCwgMTApO1xuXHRcdFx0Z3JhZGllbnQuYWRkQ29sb3JTdG9wKDEsICdyZ2JhKDI1NSwyNTUsMjU1LDApJyk7XG5cdFx0XHRncmFkaWVudC5hZGRDb2xvclN0b3AoMC41MywgJ3JnYmEoMTI4LCAyNDMsIDE5OCwxKScpO1xuXHRcdFx0Z3JhZGllbnQuYWRkQ29sb3JTdG9wKDAsICdyZ2JhKDEwMiwxMDIsMTAyLDEpJyk7XG5cdFx0XHQkc2NvcGUuY3R4LmZpbGxTdHlsZSA9IGdyYWRpZW50O1xuXHRcdFx0JHNjb3BlLmN0eC5maWxsUmVjdCgwLCAwLCAyODAsIDEwKTtcblx0XHRcdCRzY29wZS5wYWxldHRlID0gJHNjb3BlLmN0eC5nZXRJbWFnZURhdGEoMCwgMCwgMjU2LCAxKS5kYXRhO1xuXHRcdFx0Ly9kb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnYm9keScpWzBdLmFwcGVuZENoaWxkKCRzY29wZS5jYW52YXMpO1xuXHRcdH1cblx0XHR2YXIgdXBkYXRlQ2FudmFzID0gZnVuY3Rpb24oY29sb3IpIHtcblx0XHRcdHZhciBncmFkaWVudCA9ICRzY29wZS5jdHguY3JlYXRlTGluZWFyR3JhZGllbnQoMCwgMCwgMjgwLCAxMCk7XG5cdFx0XHRncmFkaWVudC5hZGRDb2xvclN0b3AoMSwgJ3JnYmEoMjU1LDI1NSwyNTUsMCknKTtcblx0XHRcdGdyYWRpZW50LmFkZENvbG9yU3RvcCgwLjUzLCBjb2xvcik7XG5cdFx0XHRncmFkaWVudC5hZGRDb2xvclN0b3AoMCwgJ3JnYmEoMTAyLDEwMiwxMDIsMSknKTtcblx0XHRcdCRzY29wZS5jdHguZmlsbFN0eWxlID0gZ3JhZGllbnQ7XG5cdFx0XHQkc2NvcGUuY3R4LmZpbGxSZWN0KDAsIDAsIDI4MCwgMTApO1xuXHRcdFx0JHNjb3BlLnBhbGV0dGUgPSAkc2NvcGUuY3R4LmdldEltYWdlRGF0YSgwLCAwLCAyNTYsIDEpLmRhdGE7XG5cdFx0fTtcblx0XHRjcmVhdGVDYW52YXMoKTtcblx0XHR2YXIgaW52ZXJ0ZWRTdHlsZSA9IGZ1bmN0aW9uKGZlYXR1cmUpIHtcblx0XHRcdHZhciBzdHlsZSA9IHt9O1xuXHRcdFx0dmFyIGlzbyA9IGZlYXR1cmUucHJvcGVydGllcy5hZG0wX2EzO1xuXHRcdFx0dmFyIG5hdGlvbiA9IGdldE5hdGlvbkJ5SXNvKGlzbyk7XG5cdFx0XHR2YXIgZmllbGQgPSAkc2NvcGUuZGlzcGxheS5zZWxlY3RlZENhdC50eXBlIHx8ICdzY29yZSc7XG5cblxuXHRcdFx0dmFyIGNvbG9yUG9zID0gcGFyc2VJbnQoMjU2IC8gMTAwICogbmF0aW9uW2ZpZWxkXSkgKiA0O1xuXHRcdFx0dmFyIGNvbG9yID0gJ3JnYmEoJyArICRzY29wZS5wYWxldHRlW2NvbG9yUG9zXSArICcsICcgKyAkc2NvcGUucGFsZXR0ZVtjb2xvclBvcyArIDFdICsgJywgJyArICRzY29wZS5wYWxldHRlW2NvbG9yUG9zICsgMl0gKyAnLCcgKyAkc2NvcGUucGFsZXR0ZVtjb2xvclBvcyArIDNdICsgJyknO1xuXHRcdFx0c3R5bGUuY29sb3IgPSAncmdiYSgwLDAsMCwwKSc7XG5cdFx0XHRzdHlsZS5vdXRsaW5lID0ge1xuXHRcdFx0XHRjb2xvcjogJ3JnYmEoMCwwLDAsMCknLFxuXHRcdFx0XHRzaXplOiAwXG5cdFx0XHR9O1xuXHRcdFx0c3R5bGUuc2VsZWN0ZWQgPSB7XG5cdFx0XHRcdGNvbG9yOiBjb2xvcixcblx0XHRcdFx0b3V0bGluZToge1xuXHRcdFx0XHRcdGNvbG9yOiAncmdiYSgwLDAsMCwwLjMpJyxcblx0XHRcdFx0XHRzaXplOiAyXG5cdFx0XHRcdH1cblx0XHRcdH07XG5cdFx0XHRyZXR1cm4gc3R5bGU7XG5cdFx0fTtcblx0XHR2YXIgY291bnRyaWVzU3R5bGUgPSBmdW5jdGlvbihmZWF0dXJlKSB7XG5cdFx0XHR2YXIgc3R5bGUgPSB7fTtcblx0XHRcdHZhciBpc28gPSBmZWF0dXJlLnByb3BlcnRpZXMuYWRtMF9hMztcblx0XHRcdHZhciBuYXRpb24gPSBnZXROYXRpb25CeUlzbyhpc28pO1xuXHRcdFx0dmFyIGZpZWxkID0gJHNjb3BlLmRpc3BsYXkuc2VsZWN0ZWRDYXQudHlwZSB8fCAnc2NvcmUnO1xuXHRcdFx0dmFyIHR5cGUgPSBmZWF0dXJlLnR5cGU7XG5cdFx0XHRzd2l0Y2ggKHR5cGUpIHtcblx0XHRcdFx0Y2FzZSAzOiAvLydQb2x5Z29uJ1xuXHRcdFx0XHRcdGlmIChuYXRpb25bZmllbGRdKSB7XG5cdFx0XHRcdFx0XHR2YXIgY29sb3JQb3MgPSBwYXJzZUludCgyNTYgLyAxMDAgKiBuYXRpb25bZmllbGRdKSAqIDQ7XG5cdFx0XHRcdFx0XHR2YXIgY29sb3IgPSAncmdiYSgnICsgJHNjb3BlLnBhbGV0dGVbY29sb3JQb3NdICsgJywgJyArICRzY29wZS5wYWxldHRlW2NvbG9yUG9zICsgMV0gKyAnLCAnICsgJHNjb3BlLnBhbGV0dGVbY29sb3JQb3MgKyAyXSArICcsJyArICRzY29wZS5wYWxldHRlW2NvbG9yUG9zICsgM10gKyAnKSc7XG5cdFx0XHRcdFx0XHRzdHlsZS5jb2xvciA9ICdyZ2JhKCcgKyAkc2NvcGUucGFsZXR0ZVtjb2xvclBvc10gKyAnLCAnICsgJHNjb3BlLnBhbGV0dGVbY29sb3JQb3MgKyAxXSArICcsICcgKyAkc2NvcGUucGFsZXR0ZVtjb2xvclBvcyArIDJdICsgJywwLjcpJzsgLy9jb2xvcjtcblx0XHRcdFx0XHRcdHN0eWxlLm91dGxpbmUgPSB7XG5cdFx0XHRcdFx0XHRcdGNvbG9yOiBjb2xvcixcblx0XHRcdFx0XHRcdFx0c2l6ZTogMVxuXHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdHN0eWxlLnNlbGVjdGVkID0ge1xuXHRcdFx0XHRcdFx0XHRjb2xvcjogJ3JnYmEoJyArICRzY29wZS5wYWxldHRlW2NvbG9yUG9zXSArICcsICcgKyAkc2NvcGUucGFsZXR0ZVtjb2xvclBvcyArIDFdICsgJywgJyArICRzY29wZS5wYWxldHRlW2NvbG9yUG9zICsgMl0gKyAnLDAuMyknLFxuXHRcdFx0XHRcdFx0XHRvdXRsaW5lOiB7XG5cdFx0XHRcdFx0XHRcdFx0Y29sb3I6ICdyZ2JhKDY2LDY2LDY2LDAuOSknLFxuXHRcdFx0XHRcdFx0XHRcdHNpemU6IDJcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRzdHlsZS5jb2xvciA9ICdyZ2JhKDI1NSwyNTUsMjU1LDApJztcblx0XHRcdFx0XHRcdHN0eWxlLm91dGxpbmUgPSB7XG5cdFx0XHRcdFx0XHRcdGNvbG9yOiAncmdiYSgyNTUsMjU1LDI1NSwwKScsXG5cdFx0XHRcdFx0XHRcdHNpemU6IDFcblx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0aWYgKGZlYXR1cmUubGF5ZXIubmFtZSA9PT0gJ2NvdW50cmllc19iaWdfZ2VvbV9sYWJlbCcpIHtcblx0XHRcdFx0c3R5bGUuc3RhdGljTGFiZWwgPSBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHR2YXIgc3R5bGUgPSB7XG5cdFx0XHRcdFx0XHRodG1sOiBmZWF0dXJlLnByb3BlcnRpZXMubmFtZSxcblx0XHRcdFx0XHRcdGljb25TaXplOiBbMTI1LCAzMF0sXG5cdFx0XHRcdFx0XHRjc3NDbGFzczogJ2xhYmVsLWljb24tdGV4dCdcblx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdHJldHVybiBzdHlsZTtcblx0XHRcdFx0fTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBzdHlsZTtcblx0XHR9O1xuXG5cdFx0JHNjb3BlLmRyYXdDb3VudHJpZXMgPSBmdW5jdGlvbigpIHtcblx0XHRcdGxlYWZsZXREYXRhLmdldE1hcCgnbWFwJykudGhlbihmdW5jdGlvbihtYXApIHtcblx0XHRcdFx0JHNjb3BlLiR3YXRjaCgnYmJveCcsIGZ1bmN0aW9uKG4sIG8pIHtcblx0XHRcdFx0XHRpZiAobiA9PT0gbykge1xuXHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdHZhciBsYXQgPSBbbi5jb29yZGluYXRlc1swXVswXVsxXSxcblx0XHRcdFx0XHRcdFx0W24uY29vcmRpbmF0ZXNbMF1bMF1bMF1dXG5cdFx0XHRcdFx0XHRdLFxuXHRcdFx0XHRcdFx0bG5nID0gW24uY29vcmRpbmF0ZXNbMF1bMl1bMV0sXG5cdFx0XHRcdFx0XHRcdFtuLmNvb3JkaW5hdGVzWzBdWzJdWzBdXVxuXHRcdFx0XHRcdFx0XVxuXHRcdFx0XHRcdHZhciBzb3V0aFdlc3QgPSBMLmxhdExuZyhuLmNvb3JkaW5hdGVzWzBdWzBdWzFdLCBuLmNvb3JkaW5hdGVzWzBdWzBdWzBdKSxcblx0XHRcdFx0XHRcdG5vcnRoRWFzdCA9IEwubGF0TG5nKG4uY29vcmRpbmF0ZXNbMF1bMl1bMV0sIG4uY29vcmRpbmF0ZXNbMF1bMl1bMF0pLFxuXHRcdFx0XHRcdFx0Ym91bmRzID0gTC5sYXRMbmdCb3VuZHMoc291dGhXZXN0LCBub3J0aEVhc3QpO1xuXHRcdFx0XHRcdHZhciBwYWQgPSBbXG5cdFx0XHRcdFx0XHRbMzUwLCAyMDBdLFxuXHRcdFx0XHRcdFx0WzAsIDIwMF1cblx0XHRcdFx0XHRdO1xuXHRcdFx0XHRcdGlmICgkc2NvcGUuY29tcGFyZS5hY3RpdmUpIHtcblx0XHRcdFx0XHRcdHBhZCA9IFtcblx0XHRcdFx0XHRcdFx0WzM1MCwgMF0sXG5cdFx0XHRcdFx0XHRcdFswLCAwXVxuXHRcdFx0XHRcdFx0XTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRtYXAuZml0Qm91bmRzKGJvdW5kcywge1xuXHRcdFx0XHRcdFx0cGFkZGluZ1RvcExlZnQ6IHBhZFswXSxcblx0XHRcdFx0XHRcdHBhZGRpbmdCb3R0b21SaWdodDogcGFkWzFdLFxuXHRcdFx0XHRcdFx0bWF4Wm9vbTogNlxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9KTtcblx0XHRcdFx0dmFyIGFwaUtleSA9ICdway5leUoxSWpvaWJXRm5ibTlzYnlJc0ltRWlPaUp1U0ZkVVlrZzRJbjAuNUhPeWtLazBwTlAxTjNpc2ZQUUdUUSc7XG5cdFx0XHRcdHZhciBkZWJ1ZyA9IHt9O1xuXHRcdFx0XHR2YXIgbWIgPSAnaHR0cHM6Ly9hLnRpbGVzLm1hcGJveC5jb20vdjQvbWFwYm94Lm1hcGJveC10ZXJyYWluLXYxLG1hcGJveC5tYXBib3gtc3RyZWV0cy12Ni1kZXYve3p9L3t4fS97eX0udmVjdG9yLnBiZj9hY2Nlc3NfdG9rZW49cGsuZXlKMUlqb2liV0Z3WW05NElpd2lZU0k2SWxoSFZrWm1hVzhpZlEuaEFNWDVoU1ctUW5UZVJDTUF5OUE4USc7XG5cdFx0XHRcdHZhciBtYXB6ZW4gPSAnaHR0cDovL3ZlY3Rvci5tYXB6ZW4uY29tL29zbS9wbGFjZXMve3p9L3t4fS97eX0ubXZ0P2FwaV9rZXk9dmVjdG9yLXRpbGVzLVEzX09zNXcnXG5cdFx0XHRcdHZhciB1cmwgPSAnaHR0cDovL3YyMjAxNTA1MjgzNTgyNTM1OC55b3VydnNlcnZlci5uZXQ6MzAwMS9zZXJ2aWNlcy9wb3N0Z2lzL2NvdW50cmllc19iaWcvZ2VvbS92ZWN0b3ItdGlsZXMve3p9L3t4fS97eX0ucGJmP2ZpZWxkcz1pZCxhZG1pbixhZG0wX2EzLHdiX2EzLHN1X2EzLGlzb19hMyxuYW1lLG5hbWVfbG9uZyc7IC8vXG5cdFx0XHRcdHZhciB1cmwyID0gJ2h0dHBzOi8vYS50aWxlcy5tYXBib3guY29tL3Y0L21hcGJveC5tYXBib3gtc3RyZWV0cy12Ni1kZXYve3p9L3t4fS97eX0udmVjdG9yLnBiZj9hY2Nlc3NfdG9rZW49JyArIGFwaUtleTtcblx0XHRcdFx0JHNjb3BlLm12dFNvdXJjZSA9IG5ldyBMLlRpbGVMYXllci5NVlRTb3VyY2Uoe1xuXHRcdFx0XHRcdHVybDogdXJsLFxuXHRcdFx0XHRcdGRlYnVnOiBmYWxzZSxcblx0XHRcdFx0XHRvcGFjaXR5OiAwLjYsXG5cdFx0XHRcdFx0Y2xpY2thYmxlTGF5ZXJzOiBbJ2NvdW50cmllc19iaWdfZ2VvbSddLFxuXHRcdFx0XHRcdG11dGV4VG9nZ2xlOiB0cnVlLFxuXHRcdFx0XHRcdG9uQ2xpY2s6IGZ1bmN0aW9uKGV2dCwgdCkge1xuXHRcdFx0XHRcdFx0aWYgKCEkc2NvcGUuY29tcGFyZS5hY3RpdmUpIHtcblx0XHRcdFx0XHRcdFx0dmFyIGMgPSBnZXROYXRpb25CeUlzbyhldnQuZmVhdHVyZS5wcm9wZXJ0aWVzLmFkbTBfYTMpO1xuXHRcdFx0XHRcdFx0XHRpZih0eXBlb2YgYy5yYW5rICE9IFwidW5kZWZpbmVkXCIpe1xuXHRcdFx0XHRcdFx0XHRcdCRzY29wZS5jdXJyZW50ID0gZ2V0TmF0aW9uQnlJc28oZXZ0LmZlYXR1cmUucHJvcGVydGllcy5hZG0wX2EzKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRlbHNle1xuXHRcdFx0XHRcdFx0XHRcdCRtZFRvYXN0LnNob3coJG1kVG9hc3Quc2ltcGxlKCkuY29udGVudCgnTm8gaW5mbyBhYm91dCB0aGlzIGxvY2F0aW9uIScpLnBvc2l0aW9uKCdib3R0b20gcmlnaHQnKSk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0XHRcdFx0dmFyIGMgPSBnZXROYXRpb25CeUlzbyhldnQuZmVhdHVyZS5wcm9wZXJ0aWVzLmFkbTBfYTMpO1xuXHRcdFx0XHRcdFx0XHRpZih0eXBlb2YgYy5yYW5rICE9IFwidW5kZWZpbmVkXCIpe1xuXHRcdFx0XHRcdFx0XHRcdCRzY29wZS50b2dnbGVDb3VudHJpZUxpc3QoYyk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0ZWxzZXtcblx0XHRcdFx0XHRcdFx0XHQkbWRUb2FzdC5zaG93KCRtZFRvYXN0LnNpbXBsZSgpLmNvbnRlbnQoJ05vIGluZm8gYWJvdXQgdGhpcyBsb2NhdGlvbiEnKS5wb3NpdGlvbignYm90dG9tIHJpZ2h0JykpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRnZXRJREZvckxheWVyRmVhdHVyZTogZnVuY3Rpb24oZmVhdHVyZSkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGZlYXR1cmUucHJvcGVydGllcy5hZG0wX2EzO1xuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0ZmlsdGVyOiBmdW5jdGlvbihmZWF0dXJlLCBjb250ZXh0KSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdHN0eWxlOiBjb3VudHJpZXNTdHlsZSAvLyxcblx0XHRcdFx0XHRcdC8qbGF5ZXJMaW5rOiBmdW5jdGlvbiAobGF5ZXJOYW1lKSB7XG5cdFx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKGxheWVyTmFtZSk7XG5cdFx0XHRcdFx0XHRcdGlmIChsYXllck5hbWUuaW5kZXhPZignX2xhYmVsJykgPiAtMSkge1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBsYXllck5hbWUucmVwbGFjZSgnX2xhYmVsJywgJycpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdHJldHVybiBsYXllck5hbWUgKyAnX2xhYmVsJztcblx0XHRcdFx0XHRcdH0qL1xuXHRcdFx0XHR9KTtcblx0XHRcdFx0ZGVidWcubXZ0U291cmNlID0gJHNjb3BlLm12dFNvdXJjZTtcblx0XHRcdFx0bWFwLmFkZExheWVyKCRzY29wZS5tdnRTb3VyY2UpO1xuXHRcdFx0XHQkc2NvcGUubXZ0U291cmNlLnNldE9wYWNpdHkoMC41KTtcblx0XHRcdFx0JHRpbWVvdXQoZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRcdCRzY29wZS5zZXRTZWxlY3RlZEZlYXR1cmUoKTtcblx0XHRcdFx0fSk7XG5cdFx0XHRcdHZhciBsYWJlbHNMYXllciA9IEwudGlsZUxheWVyKCdodHRwczovL3tzfS50aWxlcy5tYXBib3guY29tL3Y0L21hZ25vbG8uNTljOTZjYWMve3p9L3t4fS97eX0ucG5nP2FjY2Vzc190b2tlbj0nICsgYXBpS2V5KTtcblx0XHRcdFx0bWFwLmFkZExheWVyKGxhYmVsc0xheWVyKTtcblx0XHRcdFx0bGFiZWxzTGF5ZXIuYnJpbmdUb0Zyb250KCk7XG5cdFx0XHR9KTtcblx0XHR9O1xuXHRcdCRzY29wZS5kcmF3Q291bnRyaWVzKCk7XG5cdH0pO1xufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignSGVhZGVyQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgJHJvb3RTY29wZSl7XG5cblx0XHQkc2NvcGUuJHdhdGNoKGZ1bmN0aW9uKCl7XG5cdFx0XHRyZXR1cm4gJHJvb3RTY29wZS5jdXJyZW50X3BhZ2U7XG5cdFx0fSwgZnVuY3Rpb24obmV3UGFnZSl7XG5cdFx0XHQkc2NvcGUuY3VycmVudF9wYWdlID0gbmV3UGFnZSB8fCAnUGFnZSBOYW1lJztcblx0XHR9KTtcblxuXG5cdH0pO1xuXG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdJbXBvcnRjc3ZDdHJsJywgZnVuY3Rpb24gKCRtZERpYWxvZykge1xuXHRcdHRoaXMuc2V0dGluZ3MgPSB7XG5cdFx0XHRwcmludExheW91dDogdHJ1ZSxcblx0XHRcdHNob3dSdWxlcjogdHJ1ZSxcblx0XHRcdHNob3dTcGVsbGluZ1N1Z2dlc3Rpb25zOiB0cnVlLFxuXHRcdFx0cHJlc2VudGF0aW9uTW9kZTogJ2VkaXQnXG5cdFx0fTtcblxuXHRcdHRoaXMuc2FtcGxlQWN0aW9uID0gZnVuY3Rpb24gKG5hbWUsIGV2KSB7XG5cdFx0XHQkbWREaWFsb2cuc2hvdygkbWREaWFsb2cuYWxlcnQoKVxuXHRcdFx0XHQudGl0bGUobmFtZSlcblx0XHRcdFx0LmNvbnRlbnQoJ1lvdSB0cmlnZ2VyZWQgdGhlIFwiJyArIG5hbWUgKyAnXCIgYWN0aW9uJylcblx0XHRcdFx0Lm9rKCdHcmVhdCcpXG5cdFx0XHRcdC50YXJnZXRFdmVudChldilcblx0XHRcdCk7XG5cdFx0fTtcblxuICAgIHRoaXMub3BlbkNzdlVwbG9hZCA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0JG1kRGlhbG9nLnNob3coe1xuXHRcdFx0XHRcdC8vY29udHJvbGxlcjogRGlhbG9nQ29udHJvbGxlcixcblx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogJy92aWV3cy9hcHAvaW1wb3J0Y3N2L2NzdlVwbG9hZERpYWxvZy5odG1sJyxcblx0ICAgICAgICBiaW5kVG9Db250cm9sbGVyOiB0cnVlLFxuXHRcdFx0XHR9KVxuXHRcdFx0XHQudGhlbihmdW5jdGlvbiAoYW5zd2VyKSB7XG5cblx0XHRcdFx0fSwgZnVuY3Rpb24gKCkge1xuXG5cdFx0XHRcdH0pO1xuXHRcdH07XG5cdH0pXG5cblxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdNYXBDdHJsJywgZnVuY3Rpb24gKCRzY29wZSwgJHJvb3RTY29wZSwgJHRpbWVvdXQsIE1hcFNlcnZpY2UsIGxlYWZsZXREYXRhLCAkaHR0cCkge1xuXHRcdC8vXG5cdFx0dmFyIGFwaUtleSA9ICdway5leUoxSWpvaWJXRm5ibTlzYnlJc0ltRWlPaUp1U0ZkVVlrZzRJbjAuNUhPeWtLazBwTlAxTjNpc2ZQUUdUUSc7XG5cdFx0JHNjb3BlLmNlbnRlciA9IHtcblx0XHRcdGxhdDogMCxcblx0XHRcdGxuZzogMCxcblx0XHRcdHpvb206IDNcblx0XHR9O1xuXHRcdCRzY29wZS5kZWZhdWx0cyA9IHtcblx0XHRcdHNjcm9sbFdoZWVsWm9vbTogZmFsc2Vcblx0XHR9O1xuXHRcdGFuZ3VsYXIuZXh0ZW5kKCRyb290U2NvcGUsIHtcblx0XHRcdGNlbnRlcjoge1xuXHRcdFx0XHRsYXQ6IDAsXG5cdFx0XHRcdGxuZzogMCxcblx0XHRcdFx0em9vbTogM1xuXHRcdFx0fSxcblx0XHRcdGxheWVyczoge1xuXHRcdFx0XHRiYXNlbGF5ZXJzOiB7XG5cdFx0XHRcdFx0eHl6OiB7XG5cdFx0XHRcdFx0XHRuYW1lOiAnTWFwQm94IFBlbmNpbCcsXG5cdFx0XHRcdFx0XHR1cmw6ICdodHRwczovL3tzfS50aWxlcy5tYXBib3guY29tL3Y0L21hcGJveC5vdXRkb29ycy97en0ve3h9L3t5fS5wbmc/YWNjZXNzX3Rva2VuPScgKyBhcGlLZXksXG5cdFx0XHRcdFx0XHR0eXBlOiAneHl6Jyxcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sXG5cdFx0XHRcdG92ZXJsYXlzOiB7XG5cdFx0XHRcdFx0ZGVtb3N1dGZncmlkOiB7XG5cdFx0XHRcdFx0XHRuYW1lOiAnVVRGR3JpZCBJbnRlcmFjdGl2aXR5Jyxcblx0XHRcdFx0XHRcdHR5cGU6ICd1dGZHcmlkJyxcblx0XHRcdFx0XHRcdHVybDogJ2h0dHA6Ly97c30udGlsZXMubWFwYm94LmNvbS92My9tYXBib3guZ2VvZ3JhcGh5LWNsYXNzL3t6fS97eH0ve3l9LmdyaWQuanNvbj9jYWxsYmFjaz17Y2J9Jyxcblx0XHRcdFx0XHRcdHZpc2libGU6IHRydWVcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHQkc2NvcGUuaW50ZXJhY3Rpdml0eSA9IFwiXCI7XG5cdFx0JHNjb3BlLmZsYWcgPSBcIlwiO1xuXHRcdCRzY29wZS4kb24oJ2xlYWZsZXREaXJlY3RpdmVNYXAudXRmZ3JpZE1vdXNlb3ZlcicsIGZ1bmN0aW9uIChldmVudCwgbGVhZmxldEV2ZW50KSB7XG5cdFx0XHQvLyRzY29wZS5pbnRlcmFjdGl2aXR5ID0gbGVhZmxldEV2ZW50LmRhdGEuYWRtaW47XG5cdFx0XHQvLyRzY29wZS5mbGFnID0gXCJkYXRhOmltYWdlL3BuZztiYXNlNjQsXCIgKyBsZWFmbGV0RXZlbnQuZGF0YS5mbGFnX3BuZztcblxuXHRcdH0pO1xuXHRcdCRzY29wZS4kb24oJ2xlYWZsZXREaXJlY3RpdmVNYXAudXRmZ3JpZE1vdXNlb3V0JywgZnVuY3Rpb24gKGV2ZW50LCBsZWFmbGV0RXZlbnQpIHtcblx0XHRcdCRzY29wZS5pbnRlcmFjdGl2aXR5ID0gXCJcIjtcblx0XHRcdCRzY29wZS5mbGFnID0gXCJcIjtcblx0XHR9KTtcblx0XHRNYXBTZXJ2aWNlLnNldExlYWZsZXREYXRhKGxlYWZsZXREYXRhLmdldE1hcCgnbWFwJykpO1xuXG5cdH0pO1xufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignVG9hc3RzQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgVG9hc3RTZXJ2aWNlKXtcblxuXHRcdCRzY29wZS50b2FzdFN1Y2Nlc3MgPSBmdW5jdGlvbigpe1xuXHRcdFx0VG9hc3RTZXJ2aWNlLnNob3coJ1VzZXIgYWRkZWQgc3VjY2Vzc2Z1bGx5IScpO1xuXHRcdH07XG5cblx0XHQkc2NvcGUudG9hc3RFcnJvciA9IGZ1bmN0aW9uKCl7XG5cdFx0XHRUb2FzdFNlcnZpY2UuZXJyb3IoJ0Nvbm5lY3Rpb24gaW50ZXJydXB0ZWQhJyk7XG5cdFx0fTtcblxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignU2lkZWJhckN0cmwnLCBmdW5jdGlvbigkc2NvcGUsICRzdGF0ZSl7XG5cblxuXHR9KTtcblxufSkoKTsiLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdVbnN1cHBvcnRlZEJyb3dzZXJDdHJsJywgZnVuY3Rpb24oKXtcbiAgICAgICAgLy9cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0FkZFVzZXJzQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgRGlhbG9nU2VydmljZSl7XG5cbiAgICAgICAgJHNjb3BlLnNhdmUgPSBmdW5jdGlvbigpe1xuXHQgICAgICAgIC8vZG8gc29tZXRoaW5nIHVzZWZ1bFxuICAgICAgICAgICAgRGlhbG9nU2VydmljZS5oaWRlKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgJHNjb3BlLmhpZGUgPSBmdW5jdGlvbigpe1xuICAgICAgICBcdERpYWxvZ1NlcnZpY2UuaGlkZSgpO1xuICAgICAgICB9O1xuXG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoICdhcHAuY29udHJvbGxlcnMnICkuY29udHJvbGxlciggJ0J1YmJsZXNDdHJsJywgZnVuY3Rpb24oKXtcblx0XHQvL1xuXG4gIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0ZnVuY3Rpb24gQ3VzdG9tVG9vbHRpcCh0b29sdGlwSWQsIHdpZHRoKSB7XG5cdFx0dmFyIHRvb2x0aXBJZCA9IHRvb2x0aXBJZDtcblx0XHR2YXIgZWxlbSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRvb2x0aXBJZCk7XG5cdFx0aWYoZWxlbSA9PSBudWxsKXtcblx0XHRcdGFuZ3VsYXIuZWxlbWVudChkb2N1bWVudCkuZmluZCgnYm9keScpLmFwcGVuZChcIjxkaXYgY2xhc3M9J3Rvb2x0aXAgbWQtd2hpdGVmcmFtZS16MycgaWQ9J1wiICsgdG9vbHRpcElkICsgXCInPjwvZGl2PlwiKTtcblx0XHR9XG5cdFx0aGlkZVRvb2x0aXAoKTtcblx0XHRmdW5jdGlvbiBzaG93VG9vbHRpcChjb250ZW50LCBkYXRhLCBldmVudCwgZWxlbWVudCkge1xuXHRcdFx0YW5ndWxhci5lbGVtZW50KGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyMnICsgdG9vbHRpcElkKSkuaHRtbChjb250ZW50KTtcblx0XHRcdGFuZ3VsYXIuZWxlbWVudChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjJyArIHRvb2x0aXBJZCkpLmNzcygnZGlzcGxheScsICdibG9jaycpO1xuXG5cdFx0XHRyZXR1cm4gdXBkYXRlUG9zaXRpb24oZXZlbnQsIGRhdGEsIGVsZW1lbnQpO1xuXHRcdH1cblx0XHRmdW5jdGlvbiBoaWRlVG9vbHRpcCgpIHtcblx0XHRcdGFuZ3VsYXIuZWxlbWVudChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjJyArIHRvb2x0aXBJZCkpLmNzcygnZGlzcGxheScsICdub25lJyk7XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIHVwZGF0ZVBvc2l0aW9uKGV2ZW50LCBkLCBlbGVtZW50KSB7XG5cdFx0XHR2YXIgdHRpZCA9IFwiI1wiICsgdG9vbHRpcElkO1xuXHRcdFx0dmFyIHhPZmZzZXQgPSAyMDtcblx0XHRcdHZhciB5T2Zmc2V0ID0gMTA7XG5cdFx0XHR2YXIgc3ZnID0gZWxlbWVudC5maW5kKCdzdmcnKVswXTsvL2RvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNzdmdfdmlzJyk7XG5cdFx0XHR2YXIgd3NjclkgPSB3aW5kb3cuc2Nyb2xsWTtcblx0XHRcdHZhciB0dHcgPSBhbmd1bGFyLmVsZW1lbnQoZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0dGlkKSkub2Zmc2V0V2lkdGg7XG5cdFx0XHR2YXIgdHRoID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0dGlkKS5vZmZzZXRIZWlnaHQ7XG5cdFx0XHR2YXIgdHR0b3AgPSBzdmcuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wICsgZC55IC0gdHRoIC8gMjtcblx0XHRcdHZhciB0dGxlZnQgPSBzdmcuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkubGVmdCArIGQueCArIGQucmFkaXVzICsgMTI7XG5cdFx0XHRyZXR1cm4gYW5ndWxhci5lbGVtZW50KGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodHRpZCkpLmNzcygndG9wJywgdHR0b3AgKyAncHgnKS5jc3MoJ2xlZnQnLCB0dGxlZnQgKyAncHgnKTtcblx0XHR9XG5cdFx0cmV0dXJuIHtcblx0XHRcdHNob3dUb29sdGlwOiBzaG93VG9vbHRpcCxcblx0XHRcdGhpZGVUb29sdGlwOiBoaWRlVG9vbHRpcCxcblx0XHRcdHVwZGF0ZVBvc2l0aW9uOiB1cGRhdGVQb3NpdGlvblxuXHRcdH1cblx0fVxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmRpcmVjdGl2ZXMnKS5kaXJlY3RpdmUoJ2J1YmJsZXMnLCBmdW5jdGlvbiAoJGNvbXBpbGUpIHtcblx0XHR2YXIgZGVmYXVsdHM7XG5cdFx0ZGVmYXVsdHMgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHR3aWR0aDogMzAwLFxuXHRcdFx0XHRoZWlnaHQ6IDMwMCxcblx0XHRcdFx0bGF5b3V0X2dyYXZpdHk6IDAsXG5cdFx0XHRcdHNpemVmYWN0b3I6Myxcblx0XHRcdFx0dmlzOiBudWxsLFxuXHRcdFx0XHRmb3JjZTogbnVsbCxcblx0XHRcdFx0ZGFtcGVyOiAwLjA4NSxcblx0XHRcdFx0Y2lyY2xlczogbnVsbCxcblx0XHRcdFx0Ym9yZGVyczogdHJ1ZSxcblx0XHRcdFx0bGFiZWxzOiB0cnVlLFxuXHRcdFx0XHRmaWxsX2NvbG9yOiBkMy5zY2FsZS5vcmRpbmFsKCkuZG9tYWluKFtcImVoXCIsIFwiZXZcIl0pLnJhbmdlKFtcIiNhMzEwMzFcIiwgXCIjYmVjY2FlXCJdKSxcblx0XHRcdFx0bWF4X2Ftb3VudDogJycsXG5cdFx0XHRcdHJhZGl1c19zY2FsZTogJycsXG5cdFx0XHRcdGR1cmF0aW9uOiAxMDAwLFxuXHRcdFx0XHR0b29sdGlwOiBDdXN0b21Ub29sdGlwKFwiYnViYmxlc190b29sdGlwXCIsIDI0MClcblx0XHRcdH07XG5cdFx0fTtcblx0XHRyZXR1cm4ge1xuXHRcdFx0cmVzdHJpY3Q6ICdFJyxcblx0XHRcdHNjb3BlOiB7XG5cdFx0XHRcdGNoYXJ0ZGF0YTogJz0nLFxuXHRcdFx0XHRkaXJlY3Rpb246ICc9Jyxcblx0XHRcdFx0Z3Jhdml0eTogJz0nLFxuXHRcdFx0XHRzaXplZmFjdG9yOiAnPScsXG5cdFx0XHRcdGluZGV4ZXI6ICc9Jyxcblx0XHRcdFx0Ym9yZGVyczogJ0AnXG5cdFx0XHR9LFxuXHRcdFx0cmVxdWlyZTogJ25nTW9kZWwnLFxuXHRcdFx0bGluazogZnVuY3Rpb24gKHNjb3BlLCBlbGVtLCBhdHRycywgbmdNb2RlbCkge1xuXHRcdFx0XHR2YXIgb3B0aW9ucyA9IGFuZ3VsYXIuZXh0ZW5kKGRlZmF1bHRzKCksIGF0dHJzKTtcblx0XHRcdFx0dmFyIG5vZGVzID0gW10sXG5cdFx0XHRcdFx0bGlua3MgPSBbXSxcblx0XHRcdFx0XHRsYWJlbHMgPSBbXSxcblx0XHRcdFx0XHRncm91cHMgPSBbXTtcblxuXHRcdFx0XHR2YXIgbWF4X2Ftb3VudCA9IGQzLm1heChzY29wZS5jaGFydGRhdGEsIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHBhcnNlSW50KGQudmFsdWUpO1xuXHRcdFx0XHR9KTtcblx0XHRcdFx0Ly9vcHRpb25zLmhlaWdodCA9IG9wdGlvbnMud2lkdGggKiAxLjE7XG5cdFx0XHRcdG9wdGlvbnMucmFkaXVzX3NjYWxlID0gZDMuc2NhbGUucG93KCkuZXhwb25lbnQoMC41KS5kb21haW4oWzAsIG1heF9hbW91bnRdKS5yYW5nZShbMiwgODVdKTtcblx0XHRcdFx0b3B0aW9ucy5jZW50ZXIgPSB7XG5cdFx0XHRcdFx0eDogb3B0aW9ucy53aWR0aCAvIDIsXG5cdFx0XHRcdFx0eTogb3B0aW9ucy5oZWlnaHQgLyAyXG5cdFx0XHRcdH07XG5cdFx0XHRcdG9wdGlvbnMuY2F0X2NlbnRlcnMgPSB7XG5cdFx0XHRcdFx0XCJlaFwiOiB7XG5cdFx0XHRcdFx0XHR4OiBvcHRpb25zLndpZHRoIC8gMixcblx0XHRcdFx0XHRcdHk6IG9wdGlvbnMuaGVpZ2h0ICAqIDAuNDUsXG5cdFx0XHRcdFx0XHRkYW1wZXI6IDAuMDg1XG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcImV2XCI6IHtcblx0XHRcdFx0XHRcdHg6IG9wdGlvbnMud2lkdGggLyAyLFxuXHRcdFx0XHRcdFx0eTogb3B0aW9ucy5oZWlnaHQgICogMC41NSxcblx0XHRcdFx0XHRcdGRhbXBlcjogMC4wODVcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH07XG5cblx0XHRcdFx0dmFyIGNyZWF0ZV9ub2RlcyA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHQvL2NvbnNvbGUubG9nKHNjb3BlLmluZGV4ZXIpO1xuXHRcdFx0XHRcdC8vY29uc29sZS5sb2coc2NvcGUuY2hhcnRkYXRhKTtcblx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2goc2NvcGUuaW5kZXhlciwgZnVuY3Rpb24gKGdyb3VwKSB7XG5cdFx0XHRcdFx0XHR2YXIgZCA9IHtcblx0XHRcdFx0XHRcdFx0dHlwZTogZ3JvdXAuY29sdW1uX25hbWUsXG5cdFx0XHRcdFx0XHRcdG5hbWU6IGdyb3VwLnRpdGxlLFxuXHRcdFx0XHRcdFx0XHRncm91cDogZ3JvdXAuY29sdW1uX25hbWUuc3Vic3RyaW5nKDAsMiksXG5cdFx0XHRcdFx0XHRcdGNvbG9yOiBncm91cC5jb2xvcixcblx0XHRcdFx0XHRcdFx0aWNvbjogZ3JvdXAuaWNvbixcblx0XHRcdFx0XHRcdFx0dW5pY29kZTogZ3JvdXAudW5pY29kZSxcblx0XHRcdFx0XHRcdFx0ZGF0YTogZ3JvdXAsXG5cdFx0XHRcdFx0XHRcdGNoaWxkcmVuOmdyb3VwLmNoaWxkcmVuXG5cdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdFx0bGFiZWxzLnB1c2goZCk7XG5cdFx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2goZ3JvdXAuY2hpbGRyZW4sIGZ1bmN0aW9uIChpdGVtKSB7XG5cdFx0XHRcdFx0XHRcdC8vY29uc29sZS5sb2coc2NvcGUuY2hhcnRkYXRhW2l0ZW0uY29sdW1uX25hbWVdLCBzY29wZS5jaGFydGRhdGFbaXRlbS5jb2x1bW5fbmFtZV0gLyBzY29wZS5zaXplZmFjdG9yKTtcblx0XHRcdFx0XHRcdFx0aWYgKHNjb3BlLmNoYXJ0ZGF0YVtpdGVtLmNvbHVtbl9uYW1lXSkge1xuXHRcdFx0XHRcdFx0XHRcdHZhciBub2RlID0ge1xuXHRcdFx0XHRcdFx0XHRcdFx0dHlwZTogaXRlbS5jb2x1bW5fbmFtZSxcblx0XHRcdFx0XHRcdFx0XHRcdHJhZGl1czogc2NvcGUuY2hhcnRkYXRhW2l0ZW0uY29sdW1uX25hbWVdIC8gc2NvcGUuc2l6ZWZhY3Rvcixcblx0XHRcdFx0XHRcdFx0XHRcdHZhbHVlOiBzY29wZS5jaGFydGRhdGFbaXRlbS5jb2x1bW5fbmFtZV0gLyBzY29wZS5zaXplZmFjdG9yLFxuXHRcdFx0XHRcdFx0XHRcdFx0bmFtZTogaXRlbS50aXRsZSxcblx0XHRcdFx0XHRcdFx0XHRcdGdyb3VwOiBncm91cC5jb2x1bW5fbmFtZS5zdWJzdHJpbmcoMCwyKSxcblx0XHRcdFx0XHRcdFx0XHRcdHg6IG9wdGlvbnMuY2VudGVyLngsXG5cdFx0XHRcdFx0XHRcdFx0XHR5OiBvcHRpb25zLmNlbnRlci55LFxuXHRcdFx0XHRcdFx0XHRcdFx0Y29sb3I6IGl0ZW0uY29sb3IsXG5cdFx0XHRcdFx0XHRcdFx0XHRpY29uOiBpdGVtLmljb24sXG5cdFx0XHRcdFx0XHRcdFx0XHR1bmljb2RlOiBpdGVtLnVuaWNvZGUsXG5cdFx0XHRcdFx0XHRcdFx0XHRkYXRhOiBpdGVtLFxuXHRcdFx0XHRcdFx0XHRcdFx0Y2hpbGRyZW46aXRlbVxuXHRcdFx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0XHRcdFx0bm9kZXMucHVzaChub2RlKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0XHRjcmVhdGVfZ3JvdXBzKCk7XG5cdFx0XHRcdH07XG5cdFx0XHRcdHZhciBjbGVhcl9ub2RlcyA9IGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0Ly9kMy5zZWxlY3RBbGwoXCJzdmcgPiAqXCIpLnJlbW92ZSgpO1xuXHRcdFx0XHRcdG5vZGVzID0gW107XG5cdFx0XHRcdFx0bGFiZWxzID0gW107XG5cdFx0XHRcdH1cblx0XHRcdFx0dmFyIGNyZWF0ZV9ncm91cHMgPSBmdW5jdGlvbigpe1xuXHRcdFx0XHRcdGdyb3VwcyA9IHt9O1xuXHRcdFx0XHRcdHZhciBjb3VudCA9IDA7XG5cdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKG5vZGVzLCBmdW5jdGlvbihub2RlKXtcblx0XHRcdFx0XHRcdFx0dmFyIGV4aXN0cyA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0XHR2YXIgZ3JvdXAgPSB7fTtcblx0XHRcdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKGdyb3VwcywgZnVuY3Rpb24oZ3JvdXAsIGluZGV4KXtcblx0XHRcdFx0XHRcdFx0XHRpZihub2RlLmdyb3VwID09IGluZGV4KXtcblx0XHRcdFx0XHRcdFx0XHRcdGV4aXN0cyA9IHRydWU7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdFx0aWYoIWV4aXN0cyl7XG5cdFx0XHRcdFx0XHRcdFx0Y291bnQrKztcblx0XHRcdFx0XHRcdFx0XHRncm91cHNbbm9kZS5ncm91cF0gPSB7XG5cdFx0XHRcdFx0XHRcdFx0XHR4OiBvcHRpb25zLndpZHRoIC8gMixcblx0XHRcdFx0XHRcdFx0XHRcdHk6IG9wdGlvbnMuaGVpZ2h0IC8gMiArICgxIC0gY291bnQpLFxuXHRcdFx0XHRcdFx0XHRcdFx0ZGFtcGVyOiAwLjA4NSxcblx0XHRcdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0fTtcblx0XHRcdFx0dmFyIGNyZWF0ZV92aXMgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0YW5ndWxhci5lbGVtZW50KGVsZW0pLmh0bWwoJycpO1xuXHRcdFx0XHRcdG9wdGlvbnMudmlzID0gZDMuc2VsZWN0KGVsZW1bMF0pLmFwcGVuZChcInN2Z1wiKS5hdHRyKFwid2lkdGhcIiwgb3B0aW9ucy53aWR0aCkuYXR0cihcImhlaWdodFwiLCBvcHRpb25zLmhlaWdodCkuYXR0cihcImlkXCIsIFwic3ZnX3Zpc1wiKTtcblxuXHRcdFx0XHRcdGlmICghb3B0aW9ucy5ib3JkZXJzKSB7XG5cdFx0XHRcdFx0XHR2YXIgcGkgPSBNYXRoLlBJO1xuXHRcdFx0XHRcdFx0aWYobGFiZWxzLmxlbmd0aCA9PSAyKXtcblx0XHRcdFx0XHRcdFx0dmFyIGFyY1RvcCA9IGQzLnN2Zy5hcmMoKVxuXHRcdFx0XHRcdFx0XHRcdC5pbm5lclJhZGl1cygxMDkpXG5cdFx0XHRcdFx0XHRcdFx0Lm91dGVyUmFkaXVzKDExMClcblx0XHRcdFx0XHRcdFx0XHQuc3RhcnRBbmdsZSgtOTAgKiAocGkgLyAxODApKSAvL2NvbnZlcnRpbmcgZnJvbSBkZWdzIHRvIHJhZGlhbnNcblx0XHRcdFx0XHRcdFx0XHQuZW5kQW5nbGUoOTAgKiAocGkgLyAxODApKTsgLy9qdXN0IHJhZGlhbnNcblx0XHRcdFx0XHRcdFx0dmFyIGFyY0JvdHRvbSA9IGQzLnN2Zy5hcmMoKVxuXHRcdFx0XHRcdFx0XHRcdC5pbm5lclJhZGl1cygxMzQpXG5cdFx0XHRcdFx0XHRcdFx0Lm91dGVyUmFkaXVzKDEzNSlcblx0XHRcdFx0XHRcdFx0XHQuc3RhcnRBbmdsZSg5MCAqIChwaSAvIDE4MCkpIC8vY29udmVydGluZyBmcm9tIGRlZ3MgdG8gcmFkaWFuc1xuXHRcdFx0XHRcdFx0XHRcdC5lbmRBbmdsZSgyNzAgKiAocGkgLyAxODApKTsgLy9qdXN0IHJhZGlhbnNcblxuXHRcdFx0XHRcdFx0XHRvcHRpb25zLmFyY1RvcCA9IG9wdGlvbnMudmlzLmFwcGVuZChcInBhdGhcIilcblx0XHRcdFx0XHRcdFx0XHQuYXR0cihcImRcIiwgYXJjVG9wKVxuXHRcdFx0XHRcdFx0XHRcdC5hdHRyKFwiZmlsbFwiLCBcIiNiZTVmMDBcIilcblx0XHRcdFx0XHRcdFx0XHQuYXR0cihcImlkXCIsIFwiYXJjVG9wXCIpXG5cdFx0XHRcdFx0XHRcdFx0LmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIrKG9wdGlvbnMud2lkdGgvMikrXCIsXCIrKG9wdGlvbnMuaGVpZ2h0LzIgLSBvcHRpb25zLmhlaWdodC8xMikrXCIpXCIpO1xuXHRcdFx0XHRcdFx0XHRvcHRpb25zLmFyY0JvdHRvbSA9IG9wdGlvbnMudmlzLmFwcGVuZChcInBhdGhcIilcblx0XHRcdFx0XHRcdFx0XHQuYXR0cihcImRcIiwgYXJjQm90dG9tKVxuXHRcdFx0XHRcdFx0XHRcdC5hdHRyKFwiaWRcIiwgXCJhcmNCb3R0b21cIilcblx0XHRcdFx0XHRcdFx0XHQuYXR0cihcImZpbGxcIiwgXCIjMDA2YmI2XCIpXG5cdFx0XHRcdFx0XHRcdFx0LmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIrKG9wdGlvbnMud2lkdGgvMikrXCIsXCIrKG9wdGlvbnMuaGVpZ2h0LzIpK1wiKVwiKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGVsc2V7XG5cdFx0XHRcdFx0XHRcdHZhciBhcmMgPSBkMy5zdmcuYXJjKClcblx0XHRcdFx0XHRcdFx0XHQuaW5uZXJSYWRpdXMob3B0aW9ucy53aWR0aC8zIC0gMSlcblx0XHRcdFx0XHRcdFx0XHQub3V0ZXJSYWRpdXMob3B0aW9ucy53aWR0aC8zKVxuXHRcdFx0XHRcdFx0XHRcdC5zdGFydEFuZ2xlKDAgKiAocGkgLyAxODApKSAvL2NvbnZlcnRpbmcgZnJvbSBkZWdzIHRvIHJhZGlhbnNcblx0XHRcdFx0XHRcdFx0XHQuZW5kQW5nbGUoMzYwICogKHBpIC8gMTgwKSk7IC8vanVzdCByYWRpYW5zXG5cblxuXHRcdFx0XHRcdFx0XHRvcHRpb25zLmFyYyA9IG9wdGlvbnMudmlzLmFwcGVuZChcInBhdGhcIilcblx0XHRcdFx0XHRcdFx0XHQuYXR0cihcImRcIiwgYXJjKVxuXHRcdFx0XHRcdFx0XHRcdC5hdHRyKFwiZmlsbFwiLCBsYWJlbHNbMF0uY29sb3IpXG5cdFx0XHRcdFx0XHRcdFx0LmF0dHIoXCJpZFwiLCBcImFyY1RvcFwiKVxuXHRcdFx0XHRcdFx0XHRcdC5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiKyhvcHRpb25zLndpZHRoLzIpK1wiLFwiKyhvcHRpb25zLmhlaWdodC8yKStcIilcIik7XG5cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdGlmKG9wdGlvbnMubGFiZWxzID09IHRydWUpe1xuXHRcdFx0XHRcdFx0dmFyIHRleHRMYWJlbHMgPSBvcHRpb25zLnZpcy5zZWxlY3RBbGwoJ3RleHQubGFiZWxzJykuZGF0YShsYWJlbHMpLmVudGVyKCkuYXBwZW5kKFwidGV4dFwiKVxuXHRcdFx0XHRcdFx0XHQuYXR0cignY2xhc3MnLCAnbGFiZWxzJylcblx0XHRcdFx0XHRcdFx0LmF0dHIoJ2ZpbGwnLCBmdW5jdGlvbihkKXtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gZC5jb2xvcjtcblx0XHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRcdC8qXHQuYXR0cigndHJhbnNmb3JtJywgZnVuY3Rpb24oZCl7XG5cdFx0XHRcdFx0XHRcdFx0dmFyIGluZGV4ID0gbGFiZWxzLmluZGV4T2YoZCk7XG5cdFx0XHRcdFx0XHRcdFx0aWYoaW5kZXggPiAwKXtcblx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiAncm90YXRlKDkwLCAxMDAsIDEwMCknO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fSkqL1xuXHRcdFx0XHRcdFx0XHQuYXR0cigneCcsIFwiNTAlXCIpXG5cdFx0XHRcdFx0XHRcdC5zdHlsZSgnZm9udC1zaXplJywgJzEuMmVtJylcblx0XHRcdFx0XHRcdFx0LnN0eWxlKCdjdXJzb3InLCAncG9pbnRlcicpXG5cblx0XHRcdFx0XHRcdFx0LmF0dHIoJ3dpZHRoJywgb3B0aW9ucy53aWR0aClcblx0XHRcdFx0XHRcdFx0LmF0dHIoJ3RleHQtYW5jaG9yJywgJ21pZGRsZScpXG5cdFx0XHRcdFx0XHRcdC5vbignY2xpY2snLCBmdW5jdGlvbihkKXtcblx0XHRcdFx0XHRcdFx0XHRuZ01vZGVsLiRzZXRWaWV3VmFsdWUoZC5kYXRhKTtcblx0XHRcdFx0XHRcdFx0XHRuZ01vZGVsLiRyZW5kZXIoKTtcblx0XHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRcdFx0LmF0dHIoXCJ5XCIsIGZ1bmN0aW9uKGQpe1xuXHRcdFx0XHRcdFx0XHRcdHZhciBpbmRleCA9IGxhYmVscy5pbmRleE9mKGQpO1xuXHRcdFx0XHRcdFx0XHRcdGlmKGluZGV4ID09IDApe1xuXHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIDE1O1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRlbHNle1xuXHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIG9wdGlvbnMuaGVpZ2h0IC0gNjtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0XHRcdC50ZXh0KGZ1bmN0aW9uKGQpe1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBkLm5hbWU7XG5cdFx0XHRcdFx0XHRcdH0pXG5cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0b3B0aW9ucy5jb250YWluZXJzID0gb3B0aW9ucy52aXMuc2VsZWN0QWxsKCdnLm5vZGUnKS5kYXRhKG5vZGVzKS5lbnRlcigpLmFwcGVuZCgnZycpLmF0dHIoJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoJyArIChvcHRpb25zLndpZHRoIC8gMikgKyAnLCcgKyAob3B0aW9ucy5oZWlnaHQgLyAyKSArICcpJykuYXR0cignY2xhc3MnLCAnbm9kZScpO1xuXG5cdFx0XHRcdFx0LypvcHRpb25zLmNpcmNsZXMgPSBvcHRpb25zLmNvbnRhaW5lcnMuc2VsZWN0QWxsKFwiY2lyY2xlXCIpLmRhdGEobm9kZXMsIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZC5pZDtcblx0XHRcdFx0XHR9KTsqL1xuXG5cdFx0XHRcdFx0b3B0aW9ucy5jaXJjbGVzID0gb3B0aW9ucy5jb250YWluZXJzLmFwcGVuZChcImNpcmNsZVwiKS5hdHRyKFwiclwiLCAwKS5hdHRyKFwiZmlsbFwiLCAoZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdHJldHVybiBkLmNvbG9yIHx8IG9wdGlvbnMuZmlsbF9jb2xvcihkLmdyb3VwKTtcblx0XHRcdFx0XHR9KSkuYXR0cihcInN0cm9rZS13aWR0aFwiLCAwKS5hdHRyKFwic3Ryb2tlXCIsIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZDMucmdiKG9wdGlvbnMuZmlsbF9jb2xvcihkLmdyb3VwKSkuZGFya2VyKCk7XG5cdFx0XHRcdFx0fSkuYXR0cihcImlkXCIsIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gXCJidWJibGVfXCIgKyBkLmlkO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdG9wdGlvbnMuaWNvbnMgPSBvcHRpb25zLmNvbnRhaW5lcnMuYXBwZW5kKFwidGV4dFwiKVxuXHRcdFx0XHRcdFx0LmF0dHIoJ2ZvbnQtZmFtaWx5JywgJ0VQSScpXG5cdFx0XHRcdFx0XHQuYXR0cignZm9udC1zaXplJywgZnVuY3Rpb24gKGQpIHtcblxuXHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRcdC5hdHRyKFwidGV4dC1hbmNob3JcIiwgXCJtaWRkbGVcIilcblx0XHRcdFx0XHRcdC5hdHRyKCdmaWxsJywgZnVuY3Rpb24oZCl7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBkLnVuaWNvZGUgPyAnI2ZmZicgOiBkLmNvbG9yO1xuXHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRcdC50ZXh0KGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBkLnVuaWNvZGUgfHwgJzEnXG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRvcHRpb25zLmljb25zLm9uKFwibW91c2VvdmVyXCIsIGZ1bmN0aW9uIChkLCBpKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gc2hvd19kZXRhaWxzKGQsIGksIHRoaXMpO1xuXHRcdFx0XHRcdH0pLm9uKFwibW91c2VvdXRcIiwgZnVuY3Rpb24gKGQsIGkpIHtcblx0XHRcdFx0XHRcdHJldHVybiBoaWRlX2RldGFpbHMoZCwgaSwgdGhpcyk7XG5cdFx0XHRcdFx0fSkub24oXCJjbGlja1wiLCBmdW5jdGlvbiAoZCwgaSkge1xuXG5cdFx0XHRcdFx0XHRuZ01vZGVsLiRzZXRWaWV3VmFsdWUoZCk7XG5cdFx0XHRcdFx0XHRuZ01vZGVsLiRyZW5kZXIoKTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRvcHRpb25zLmNpcmNsZXMudHJhbnNpdGlvbigpLmR1cmF0aW9uKG9wdGlvbnMuZHVyYXRpb24pLmF0dHIoXCJyXCIsIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZC5yYWRpdXM7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0b3B0aW9ucy5pY29ucy50cmFuc2l0aW9uKCkuZHVyYXRpb24ob3B0aW9ucy5kdXJhdGlvbikuYXR0cihcImZvbnQtc2l6ZVwiLCBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGQucmFkaXVzICogMS43NSArICdweCc7XG5cdFx0XHRcdFx0fSkuYXR0cigneScsIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZC5yYWRpdXMgKiAuNzUgKyAncHgnO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9O1xuXHRcdFx0XHR2YXIgdXBkYXRlX3ZpcyA9IGZ1bmN0aW9uICgpIHtcblxuXHRcdFx0XHRcdG5vZGVzLmZvckVhY2goZnVuY3Rpb24gKGQsIGkpIHtcblx0XHRcdFx0XHRcdG9wdGlvbnMuY2lyY2xlcy50cmFuc2l0aW9uKCkuZHVyYXRpb24ob3B0aW9ucy5kdXJhdGlvbikuZGVsYXkoaSAqIG9wdGlvbnMuZHVyYXRpb24pXG5cdFx0XHRcdFx0XHRcdC5hdHRyKFwiclwiLCBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0XHRcdGQucmFkaXVzID0gZC52YWx1ZSA9IHNjb3BlLmNoYXJ0ZGF0YVtkLnR5cGVdIC8gc2NvcGUuc2l6ZWZhY3RvcjtcblxuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBzY29wZS5jaGFydGRhdGFbZC50eXBlXSAvIHNjb3BlLnNpemVmYWN0b3I7XG5cdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0b3B0aW9ucy5pY29ucy50cmFuc2l0aW9uKCkuZHVyYXRpb24ob3B0aW9ucy5kdXJhdGlvbikuZGVsYXkoaSAqIG9wdGlvbnMuZHVyYXRpb24pXG5cdFx0XHRcdFx0XHRcdC5hdHRyKFwiZm9udC1zaXplXCIsIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIChzY29wZS5jaGFydGRhdGFbZC50eXBlXSAvIHNjb3BlLnNpemVmYWN0b3IpICogMS43NSArICdweCdcblx0XHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRcdFx0LmF0dHIoJ3knLCBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybiAoc2NvcGUuY2hhcnRkYXRhW2QudHlwZV0gLyBzY29wZS5zaXplZmFjdG9yKSAqIC43NSArICdweCc7XG5cdFx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH07XG5cdFx0XHRcdHZhciBjaGFyZ2UgPSBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdHJldHVybiAtTWF0aC5wb3coZC5yYWRpdXMsIDIuMCkgLyA0O1xuXHRcdFx0XHR9O1xuXHRcdFx0XHR2YXIgc3RhcnQgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0cmV0dXJuIG9wdGlvbnMuZm9yY2UgPSBkMy5sYXlvdXQuZm9yY2UoKS5ub2Rlcyhub2Rlcykuc2l6ZShbb3B0aW9ucy53aWR0aCwgb3B0aW9ucy5oZWlnaHRdKS5saW5rcyhsaW5rcyk7XG5cdFx0XHRcdH07XG5cdFx0XHRcdHZhciBkaXNwbGF5X2dyb3VwX2FsbCA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRvcHRpb25zLmZvcmNlLmdyYXZpdHkob3B0aW9ucy5sYXlvdXRfZ3Jhdml0eSkuY2hhcmdlKGNoYXJnZSkuZnJpY3Rpb24oMC44NSkub24oXCJ0aWNrXCIsIGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdFx0XHRvcHRpb25zLmNvbnRhaW5lcnMuZWFjaChtb3ZlX3Rvd2FyZHNfY2VudGVyKGUuYWxwaGEpKS5hdHRyKFwidHJhbnNmb3JtXCIsIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiAndHJhbnNsYXRlKCcgKyBkLnggKyAnLCcgKyBkLnkgKyAnKSc7XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRvcHRpb25zLmZvcmNlLnN0YXJ0KCk7XG5cdFx0XHRcdH07XG5cdFx0XHRcdHZhciBkaXNwbGF5X2J5X2NhdCA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRvcHRpb25zLmZvcmNlLmdyYXZpdHkob3B0aW9ucy5sYXlvdXRfZ3Jhdml0eSkuY2hhcmdlKGNoYXJnZSkuZnJpY3Rpb24oMC45KS5vbihcInRpY2tcIiwgZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0XHRcdG9wdGlvbnMuY29udGFpbmVycy5lYWNoKG1vdmVfdG93YXJkc19jYXQoZS5hbHBoYSkpLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuICd0cmFuc2xhdGUoJyArIGQueCArICcsJyArIGQueSArICcpJztcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdG9wdGlvbnMuZm9yY2Uuc3RhcnQoKTtcblx0XHRcdFx0fTtcblx0XHRcdFx0dmFyIG1vdmVfdG93YXJkc19jZW50ZXIgPSBmdW5jdGlvbiAoYWxwaGEpIHtcblx0XHRcdFx0XHRyZXR1cm4gKGZ1bmN0aW9uIChfdGhpcykge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRcdGQueCA9IGQueCArIChvcHRpb25zLndpZHRoLzIgLSBkLngpICogKG9wdGlvbnMuZGFtcGVyICsgMC4wMikgKiBhbHBoYSAqMS4yNTtcblx0XHRcdFx0XHRcdFx0ZC55ID0gZC55ICsgKG9wdGlvbnMuaGVpZ2h0LzIgLSBkLnkpICogKG9wdGlvbnMuZGFtcGVyICsgMC4wMikgKiBhbHBoYSAqIDEuMjU7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSkodGhpcyk7XG5cdFx0XHRcdH07XG5cdFx0XHRcdHZhciBtb3ZlX3Rvd2FyZHNfdG9wID0gZnVuY3Rpb24gKGFscGhhKSB7XG5cdFx0XHRcdFx0cmV0dXJuIChmdW5jdGlvbiAoX3RoaXMpIHtcblx0XHRcdFx0XHRcdHJldHVybiBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0XHRkLnggPSBkLnggKyAob3B0aW9ucy5jZW50ZXIueCAtIGQueCkgKiAob3B0aW9ucy5kYW1wZXIgKyAwLjAyKSAqIGFscGhhICogMS4xO1xuXHRcdFx0XHRcdFx0XHRkLnkgPSBkLnkgKyAoMjAwIC0gZC55KSAqIChvcHRpb25zLmRhbXBlciArIDAuMDIpICogYWxwaGEgKiAxLjE7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSkodGhpcyk7XG5cdFx0XHRcdH07XG5cdFx0XHRcdHZhciBtb3ZlX3Rvd2FyZHNfY2F0ID0gZnVuY3Rpb24gKGFscGhhKSB7XG5cdFx0XHRcdFx0cmV0dXJuIChmdW5jdGlvbiAoX3RoaXMpIHtcblx0XHRcdFx0XHRcdHJldHVybiBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0XHR2YXIgdGFyZ2V0O1xuXHRcdFx0XHRcdFx0XHR0YXJnZXQgPSBvcHRpb25zLmNhdF9jZW50ZXJzW2QuZ3JvdXBdO1xuXHRcdFx0XHRcdFx0XHRkLnggPSBkLnggKyAodGFyZ2V0LnggLSBkLngpICogKHRhcmdldC5kYW1wZXIgKyAwLjAyKSAqIGFscGhhICogMTtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGQueSA9IGQueSArICh0YXJnZXQueSAtIGQueSkgKiAodGFyZ2V0LmRhbXBlciArIDAuMDIpICogYWxwaGEgKiAxO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pKHRoaXMpO1xuXHRcdFx0XHR9O1xuXHRcdFx0XHR2YXIgc2hvd19kZXRhaWxzID0gZnVuY3Rpb24gKGRhdGEsIGksIGVsZW1lbnQpIHtcblx0XHRcdFx0XHR2YXIgY29udGVudDtcblx0XHRcdFx0XHRjb250ZW50ID0gXCI8c3BhbiBjbGFzcz1cXFwidGl0bGVcXFwiPlwiICsgZGF0YS5uYW1lICsgXCI8L3NwYW4+PGJyLz5cIjtcblx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2goZGF0YS5kYXRhLmNoaWxkcmVuLCBmdW5jdGlvbiAoaW5mbykge1xuXHRcdFx0XHRcdFx0Y29udGVudCArPSBcIjxzcGFuIGNsYXNzPVxcXCJuYW1lXFxcIiBzdHlsZT1cXFwiY29sb3I6XCIgKyAoaW5mby5jb2xvciB8fCBkYXRhLmNvbG9yKSArIFwiXFxcIj4gXCIgKyAoaW5mby50aXRsZSkgKyBcIjwvc3Bhbj48YnIvPlwiO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdCRjb21waWxlKG9wdGlvbnMudG9vbHRpcC5zaG93VG9vbHRpcChjb250ZW50LCBkYXRhLCBkMy5ldmVudCwgZWxlbSkuY29udGVudHMoKSkoc2NvcGUpO1xuXHRcdFx0XHR9O1xuXG5cdFx0XHRcdHZhciBoaWRlX2RldGFpbHMgPSBmdW5jdGlvbiAoZGF0YSwgaSwgZWxlbWVudCkge1xuXHRcdFx0XHRcdHJldHVybiBvcHRpb25zLnRvb2x0aXAuaGlkZVRvb2x0aXAoKTtcblx0XHRcdFx0fTtcblxuXHRcdFx0XHRzY29wZS4kd2F0Y2goJ2NoYXJ0ZGF0YScsIGZ1bmN0aW9uIChkYXRhLCBvbGREYXRhKSB7XG5cdFx0XHRcdFx0b3B0aW9ucy50b29sdGlwLmhpZGVUb29sdGlwKCk7XG5cblx0XHRcdFx0XHRpZiAob3B0aW9ucy5jaXJjbGVzID09IG51bGwpIHtcblx0XHRcdFx0XHRcdGNyZWF0ZV9ub2RlcygpO1xuXHRcdFx0XHRcdFx0Y3JlYXRlX3ZpcygpO1xuXHRcdFx0XHRcdFx0c3RhcnQoKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0dXBkYXRlX3ZpcygpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZihsYWJlbHMubGVuZ3RoID09IDEgfHwgb3B0aW9ucy5sYWJlbHMgIT0gdHJ1ZSl7XG5cdFx0XHRcdFx0XHRcdGRpc3BsYXlfZ3JvdXBfYWxsKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2V7XG5cdFx0XHRcdFx0XHRcdGRpc3BsYXlfYnlfY2F0KCk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRzY29wZS4kd2F0Y2goJ2luZGV4ZXInLCBmdW5jdGlvbiAobiwgbykge1xuXHRcdFx0XHRcdGlmKG4gPT09IG8pe1xuXHRcdFx0XHRcdFx0cmV0dXJuXG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYodHlwZW9mIG5bMF0uY2hpbGRyZW4gIT0gXCJ1bmRlZmluZWRcIil7XG5cdFx0XHRcdFx0XHRvcHRpb25zLnRvb2x0aXAuaGlkZVRvb2x0aXAoKTtcblx0XHRcdFx0XHRcdGNsZWFyX25vZGVzKCk7XG5cdFx0XHRcdFx0XHRjcmVhdGVfbm9kZXMoKTtcblx0XHRcdFx0XHRcdGNyZWF0ZV92aXMoKTtcblx0XHRcdFx0XHRcdHN0YXJ0KCk7XG5cblx0XHRcdFx0XHRcdGlmKGxhYmVscy5sZW5ndGggPT0gMSB8fCBvcHRpb25zLmxhYmVscyAhPSB0cnVlKXtcblx0XHRcdFx0XHRcdFx0XHRkaXNwbGF5X2dyb3VwX2FsbCgpO1xuXHRcdFx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKCdhbGwnKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGVsc2V7XG5cdFx0XHRcdFx0XHRcdFx0ZGlzcGxheV9ieV9jYXQoKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRzY29wZS4kd2F0Y2goJ2RpcmVjdGlvbicsIGZ1bmN0aW9uIChvbGRELCBuZXdEKSB7XG5cdFx0XHRcdFx0aWYgKG9sZEQgPT09IG5ld0QpIHtcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKG9sZEQgPT0gXCJhbGxcIikge1xuXHRcdFx0XHRcdFx0ZGlzcGxheV9ncm91cF9hbGwoKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0ZGlzcGxheV9ieV9jYXQoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pXG5cdFx0XHR9XG5cdFx0fTtcblx0fSk7XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCAnYXBwLmNvbnRyb2xsZXJzJyApLmNvbnRyb2xsZXIoICdDaXJjbGVncmFwaEN0cmwnLCBmdW5jdGlvbigpe1xuXHRcdC8vXG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZGlyZWN0aXZlcycpLmRpcmVjdGl2ZSgnY2lyY2xlZ3JhcGgnLCBmdW5jdGlvbigkdGltZW91dCkge1xuXHRcdHZhciBkZWZhdWx0cyA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0d2lkdGg6IDgwLFxuXHRcdFx0XHRoZWlnaHQ6IDgwLFxuXHRcdFx0XHRjb2xvcjogJyMwMGNjYWEnLFxuXHRcdFx0XHRzaXplOiAxNzgsXG5cdFx0XHRcdGZpZWxkOiAncmFuaydcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlc3RyaWN0OiAnRScsXG5cdFx0XHRjb250cm9sbGVyOiAnQ2lyY2xlZ3JhcGhDdHJsJyxcblx0XHRcdHNjb3BlOiB7XG5cdFx0XHRcdG9wdGlvbnM6ICc9J1xuXHRcdFx0fSxcblx0XHRcdHJlcXVpcmU6ICduZ01vZGVsJyxcblx0XHRcdGxpbms6IGZ1bmN0aW9uKCRzY29wZSwgZWxlbWVudCwgJGF0dHJzLCBuZ01vZGVsKSB7XG5cdFx0XHRcdC8vRmV0Y2hpbmcgT3B0aW9uc1xuXG5cdFx0XHQgJHNjb3BlLm9wdGlvbnMgPSBhbmd1bGFyLmV4dGVuZChkZWZhdWx0cygpLCAkc2NvcGUub3B0aW9ucyk7XG5cdFx0XHRcblx0XHRcdFx0Ly9DcmVhdGluZyB0aGUgU2NhbGVcblx0XHRcdFx0dmFyIHJvdGF0ZSA9IGQzLnNjYWxlLmxpbmVhcigpXG5cdFx0XHRcdFx0LmRvbWFpbihbMSwgJHNjb3BlLm9wdGlvbnMuc2l6ZV0pXG5cdFx0XHRcdFx0LnJhbmdlKFsxLCAwXSlcblx0XHRcdFx0XHQuY2xhbXAodHJ1ZSk7XG5cblx0XHRcdFx0Ly9DcmVhdGluZyBFbGVtZW50c1xuXHRcdFx0XHR2YXIgc3ZnID0gZDMuc2VsZWN0KGVsZW1lbnRbMF0pLmFwcGVuZCgnc3ZnJylcblx0XHRcdFx0XHQuYXR0cignd2lkdGgnLCAkc2NvcGUub3B0aW9ucy53aWR0aClcblx0XHRcdFx0XHQuYXR0cignaGVpZ2h0JywgJHNjb3BlLm9wdGlvbnMuaGVpZ2h0KVxuXHRcdFx0XHRcdC5hcHBlbmQoJ2cnKTtcblx0XHRcdFx0dmFyIGNvbnRhaW5lciA9IHN2Zy5hcHBlbmQoJ2cnKVxuXHRcdFx0XHRcdC5hdHRyKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKCcgKyAkc2NvcGUub3B0aW9ucy53aWR0aCAvIDIgKyAnLCcgKyAkc2NvcGUub3B0aW9ucy5oZWlnaHQgLyAyICsgJyknKTtcblx0XHRcdFx0dmFyIGNpcmNsZUJhY2sgPSBjb250YWluZXIuYXBwZW5kKCdjaXJjbGUnKVxuXHRcdFx0XHRcdC5hdHRyKCdyJywgJHNjb3BlLm9wdGlvbnMud2lkdGggLyAyIC0gMilcblx0XHRcdFx0XHQuYXR0cignc3Ryb2tlLXdpZHRoJywgMilcblx0XHRcdFx0XHQuYXR0cignc3Ryb2tlJywgJHNjb3BlLm9wdGlvbnMuY29sb3IpXG5cdFx0XHRcdFx0LnN0eWxlKCdvcGFjaXR5JywgJzAuNicpXG5cdFx0XHRcdFx0LmF0dHIoJ2ZpbGwnLCAnbm9uZScpO1xuXHRcdFx0XHR2YXIgYXJjID0gZDMuc3ZnLmFyYygpXG5cdFx0XHRcdFx0LnN0YXJ0QW5nbGUoMClcblx0XHRcdFx0XHQuaW5uZXJSYWRpdXMoZnVuY3Rpb24oZCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuICRzY29wZS5vcHRpb25zLndpZHRoIC8gMiAtIDQ7XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQub3V0ZXJSYWRpdXMoZnVuY3Rpb24oZCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuICRzY29wZS5vcHRpb25zLndpZHRoIC8gMjtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0dmFyIGNpcmNsZUdyYXBoID0gY29udGFpbmVyLmFwcGVuZCgncGF0aCcpXG5cdFx0XHRcdFx0LmRhdHVtKHtcblx0XHRcdFx0XHRcdGVuZEFuZ2xlOiAyICogTWF0aC5QSSAqIDBcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC5zdHlsZShcImZpbGxcIiwgJHNjb3BlLm9wdGlvbnMuY29sb3IpXG5cdFx0XHRcdFx0LmF0dHIoJ2QnLCBhcmMpO1xuXHRcdFx0XHR2YXIgdGV4dCA9IGNvbnRhaW5lci5zZWxlY3RBbGwoJ3RleHQnKVxuXHRcdFx0XHRcdC5kYXRhKFswXSlcblx0XHRcdFx0XHQuZW50ZXIoKVxuXHRcdFx0XHRcdC5hcHBlbmQoJ3RleHQnKVxuXHRcdFx0XHRcdC50ZXh0KGZ1bmN0aW9uKGQpIHtcblx0XHRcdFx0XHRcdHJldHVybiAnTsKwJyArIGQ7XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRcdC5zdHlsZShcImZpbGxcIiwgJHNjb3BlLm9wdGlvbnMuY29sb3IpXG5cdFx0XHRcdFx0LnN0eWxlKCdmb250LXdlaWdodCcsICdib2xkJylcblx0XHRcdFx0XHQuYXR0cigndGV4dC1hbmNob3InLCAnbWlkZGxlJylcblx0XHRcdFx0XHQuYXR0cigneScsICcwLjM1ZW0nKTtcblxuXHRcdFx0XHQvL1RyYW5zaXRpb24gaWYgc2VsZWN0aW9uIGhhcyBjaGFuZ2VkXG5cdFx0XHRcdGZ1bmN0aW9uIGFuaW1hdGVJdChyYWRpdXMpIHtcblx0XHRcdFx0XHRjaXJjbGVHcmFwaC50cmFuc2l0aW9uKClcblx0XHRcdFx0XHRcdC5kdXJhdGlvbig3NTApXG5cdFx0XHRcdFx0XHQuY2FsbChhcmNUd2Vlbiwgcm90YXRlKHJhZGl1cykgKiAyICogTWF0aC5QSSk7XG5cdFx0XHRcdFx0dGV4dC50cmFuc2l0aW9uKCkuZHVyYXRpb24oNzUwKS50d2VlbigndGV4dCcsIGZ1bmN0aW9uKGQpIHtcblx0XHRcdFx0XHRcdHZhciBkYXRhID0gdGhpcy50ZXh0Q29udGVudC5zcGxpdCgnTsKwJyk7XG5cblx0XHRcdFx0XHRcdHZhciBpID0gZDMuaW50ZXJwb2xhdGUoZGF0YVsxXSwgcmFkaXVzKTtcblx0XHRcdFx0XHRcdHJldHVybiBmdW5jdGlvbih0KSB7XG5cdFx0XHRcdFx0XHRcdHRoaXMudGV4dENvbnRlbnQgPSAgJ07CsCcgKyAoTWF0aC5yb3VuZChpKHQpICogMSkgLyAxKTtcblx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vVHdlZW4gYW5pbWF0aW9uIGZvciB0aGUgQXJjXG5cdFx0XHRcdGZ1bmN0aW9uIGFyY1R3ZWVuKHRyYW5zaXRpb24sIG5ld0FuZ2xlKSB7XG5cdFx0XHRcdFx0dHJhbnNpdGlvbi5hdHRyVHdlZW4oXCJkXCIsIGZ1bmN0aW9uKGQpIHtcblx0XHRcdFx0XHRcdHZhciBpbnRlcnBvbGF0ZSA9IGQzLmludGVycG9sYXRlKGQuZW5kQW5nbGUsIG5ld0FuZ2xlKTtcblx0XHRcdFx0XHRcdHJldHVybiBmdW5jdGlvbih0KSB7XG5cdFx0XHRcdFx0XHRcdGQuZW5kQW5nbGUgPSBpbnRlcnBvbGF0ZSh0KTtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGFyYyhkKTtcblx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0JHNjb3BlLiR3YXRjaCgnb3B0aW9ucycsZnVuY3Rpb24obiwgbyl7XG5cdFx0XHRcdFx0XHRpZihuID09PSBvKXtcblx0XHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0Y29uc29sZS5sb2cobilcblx0XHRcdFx0XHRcdGNpcmNsZUJhY2suc3R5bGUoJ3N0cm9rZScsIG4uY29sb3IpO1xuXHRcdFx0XHRcdFx0Y2lyY2xlR3JhcGguc3R5bGUoJ2ZpbGwnLCBuLmNvbG9yKTtcblx0XHRcdFx0XHRcdHRleHQuc3R5bGUoJ2ZpbGwnLCBuLmNvbG9yKTtcblx0XHRcdFx0XHRcdCR0aW1lb3V0KGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0XHRcdGFuaW1hdGVJdChuZ01vZGVsLiRtb2RlbFZhbHVlW24uZmllbGRdKVxuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHQvL1dhdGNoaW5nIGlmIHNlbGVjdGlvbiBoYXMgY2hhbmdlZCBmcm9tIGFub3RoZXIgVUkgZWxlbWVudFxuXHRcdFx0XHQkc2NvcGUuJHdhdGNoKFxuXHRcdFx0XHRcdGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIG5nTW9kZWwuJG1vZGVsVmFsdWU7XG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRmdW5jdGlvbihuZXdWYWx1ZSwgb2xkVmFsdWUpIHtcblx0XHRcdFx0XHRcdCR0aW1lb3V0KGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKFx0bmV3VmFsdWVbJHNjb3BlLm9wdGlvbnMuZmllbGRdKTtcblx0XHRcdFx0XHRcdFx0Y29uc29sZS5sb2coXHRuZXdWYWx1ZSwkc2NvcGUub3B0aW9ucy5maWVsZCk7XG5cdFx0XHRcdFx0XHR9KVxuXG5cblx0XHRcdFx0XHRcdGlmICghbmV3VmFsdWUpe1xuXHRcdFx0XHRcdFx0XHRuZXdWYWx1ZSA9IHt9O1xuXHRcdFx0XHRcdFx0XHRuZXdWYWx1ZVskc2NvcGUub3B0aW9ucy5maWVsZF0gPSAkc2NvcGUub3B0aW9ucy5zaXplO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHQkdGltZW91dChmdW5jdGlvbigpe1xuXHRcdFx0XHRcdFx0XHRhbmltYXRlSXQobmV3VmFsdWVbJHNjb3BlLm9wdGlvbnMuZmllbGRdKVxuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fTtcblxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmRpcmVjdGl2ZXMnKS5kaXJlY3RpdmUoICdoaXN0b3J5JywgZnVuY3Rpb24oKSB7XG5cdFx0dmFyIGRlZmF1bHRzID0gZnVuY3Rpb24oKXtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdGZpZWxkOiAnc2NvcmUnLFxuXHRcdFx0XHRjb2xvcjogJydcblx0XHRcdH1cblx0XHR9O1xuXHRcdHJldHVybiB7XG5cdFx0XHRyZXN0cmljdDogJ0UnLFxuXHRcdFx0dGVtcGxhdGVVcmw6ICd2aWV3cy9kaXJlY3RpdmVzL2hpc3RvcnkvaGlzdG9yeS5odG1sJyxcblx0XHRcdGNvbnRyb2xsZXI6ICdIaXN0b3J5Q3RybCcsXG5cdFx0XHRzY29wZTp7XG5cdFx0XHRcdG9wdGlvbnM6Jz0nLFxuXHRcdFx0XHRjaGFydGRhdGE6ICc9J1xuXHRcdFx0fSxcblx0XHRcdGxpbms6IGZ1bmN0aW9uKCAkc2NvcGUsIGVsZW1lbnQsICRhdHRycywgbmdNb2RlbCl7XG5cdFx0XHRcdFx0dmFyIG9wdGlvbnMgPSBhbmd1bGFyLmV4dGVuZChkZWZhdWx0cygpLCAkc2NvcGUub3B0aW9ucyk7XG5cdFx0XHR9XG5cdFx0fTtcblxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdIaXN0b3J5Q3RybCcsIGZ1bmN0aW9uICgkc2NvcGUpIHtcblx0XHQkc2NvcGUuc2V0RGF0YSA9IHNldERhdGE7XG5cdFx0YWN0aXZhdGUoKTtcblxuXHRcdGZ1bmN0aW9uIGFjdGl2YXRlKCl7XG5cdFx0XHQkc2NvcGUuc2V0RGF0YSgpO1xuXHRcdFx0JHNjb3BlLiR3YXRjaCgnb3B0aW9ucycsIGZ1bmN0aW9uKG4sbyl7XG5cdFx0XHRcdGlmKG4gPT09IDApe1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXHRcdFx0XHQkc2NvcGUuc2V0RGF0YSgpO1xuXHRcdFx0fSlcblx0XHR9XG5cdFx0ZnVuY3Rpb24gc2V0RGF0YSgpe1xuXHRcdFx0JHNjb3BlLmRpc3BsYXkgPSB7XG5cdFx0XHRcdHNlbGVjdGVkQ2F0OiAnJyxcblx0XHRcdFx0cmFuazogW3tcblx0XHRcdFx0XHRmaWVsZHM6IHtcblx0XHRcdFx0XHRcdHg6ICd5ZWFyJyxcblx0XHRcdFx0XHRcdHk6ICdyYW5rJ1xuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0dGl0bGU6ICdSYW5rJyxcblx0XHRcdFx0XHRjb2xvcjogJyM1MmI2OTUnXG5cdFx0XHRcdH1dLFxuXHRcdFx0XHRzY29yZTogW3tcblx0XHRcdFx0XHRmaWVsZHM6IHtcblx0XHRcdFx0XHRcdHg6ICd5ZWFyJyxcblx0XHRcdFx0XHRcdHk6ICRzY29wZS5vcHRpb25zLmZpZWxkXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHR0aXRsZTogJ1Njb3JlJyxcblx0XHRcdFx0XHRjb2xvcjogJHNjb3BlLm9wdGlvbnMuY29sb3Jcblx0XHRcdFx0fV1cblx0XHRcdH07XG5cdFx0fVxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZGlyZWN0aXZlcycpLmRpcmVjdGl2ZSgnbWVkaWFuJywgZnVuY3Rpb24gKCR0aW1lb3V0KSB7XG5cdFx0dmFyIGRlZmF1bHRzID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0aWQ6ICdncmFkaWVudCcsXG5cdFx0XHRcdHdpZHRoOiAzMDAsXG5cdFx0XHRcdGhlaWdodDogNDAsXG5cdFx0XHRcdGluZm86IHRydWUsXG5cdFx0XHRcdGZpZWxkOiAnc2NvcmUnLFxuXHRcdFx0XHRoYW5kbGluZzogdHJ1ZSxcblx0XHRcdFx0bWFyZ2luOiB7XG5cdFx0XHRcdFx0bGVmdDogMjAsXG5cdFx0XHRcdFx0cmlnaHQ6IDIwLFxuXHRcdFx0XHRcdHRvcDogMTAsXG5cdFx0XHRcdFx0Ym90dG9tOiAxMFxuXHRcdFx0XHR9LFxuXHRcdFx0XHRjb2xvcnM6IFsge1xuXHRcdFx0XHRcdHBvc2l0aW9uOiAwLFxuXHRcdFx0XHRcdGNvbG9yOiAncmdiYSgxMDIsMTAyLDEwMiwxKScsXG5cdFx0XHRcdFx0b3BhY2l0eTogMVxuXHRcdFx0XHR9LCB7XG5cdFx0XHRcdFx0cG9zaXRpb246IDUzLFxuXHRcdFx0XHRcdGNvbG9yOiAncmdiYSgxMjgsIDI0MywgMTk4LDEpJyxcblx0XHRcdFx0XHRvcGFjaXR5OiAxXG5cdFx0XHRcdH0se1xuXHRcdFx0XHRcdHBvc2l0aW9uOiAxMDAsXG5cdFx0XHRcdFx0Y29sb3I6ICdyZ2JhKDI1NSwyNTUsMjU1LDEpJyxcblx0XHRcdFx0XHRvcGFjaXR5OiAwXG5cdFx0XHRcdH1dXG5cdFx0XHR9O1xuXHRcdH1cblx0XHRyZXR1cm4ge1xuXHRcdFx0cmVzdHJpY3Q6ICdFJyxcblx0XHRcdHNjb3BlOiB7XG5cdFx0XHRcdGRhdGE6ICc9Jyxcblx0XHRcdFx0b3B0aW9uczogJz0nXG5cdFx0XHR9LFxuXHRcdFx0cmVxdWlyZTogJ25nTW9kZWwnLFxuXHRcdFx0bGluazogZnVuY3Rpb24gKCRzY29wZSwgZWxlbWVudCwgJGF0dHJzLCBuZ01vZGVsKSB7XG5cdFx0XHRcdHZhciBvcHRpb25zID0gYW5ndWxhci5leHRlbmQoZGVmYXVsdHMoKSwgJGF0dHJzKTtcblx0XHRcdFx0b3B0aW9ucyA9IGFuZ3VsYXIuZXh0ZW5kKG9wdGlvbnMsICRzY29wZS5vcHRpb25zKTtcblx0XHRcdFx0aWYob3B0aW9ucy5jb2xvcil7XG5cdFx0XHRcdFx0b3B0aW9ucy5jb2xvcnNbMV0uY29sb3IgPSBvcHRpb25zLmNvbG9yO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsZW1lbnQuY3NzKCdoZWlnaHQnLCBvcHRpb25zLmhlaWdodCArICdweCcpLmNzcygnYm9yZGVyLXJhZGl1cycsIG9wdGlvbnMuaGVpZ2h0IC8gMiArICdweCcpO1xuXHRcdFx0XHR2YXIgeCA9IGQzLnNjYWxlLmxpbmVhcigpXG5cdFx0XHRcdFx0LmRvbWFpbihbMCwgMTAwXSlcblx0XHRcdFx0XHQucmFuZ2UoW29wdGlvbnMubWFyZ2luLmxlZnQsIG9wdGlvbnMud2lkdGggLSBvcHRpb25zLm1hcmdpbi5sZWZ0XSlcblx0XHRcdFx0XHQuY2xhbXAodHJ1ZSk7XG5cblx0XHRcdFx0dmFyIGJydXNoID0gZDMuc3ZnLmJydXNoKClcblx0XHRcdFx0XHQueCh4KVxuXHRcdFx0XHRcdC5leHRlbnQoWzAsIDBdKVxuXHRcdFx0XHRcdC5vbihcImJydXNoXCIsIGJydXNoKVxuXHRcdFx0XHRcdC5vbihcImJydXNoZW5kXCIsIGJydXNoZWQpO1xuXG5cdFx0XHRcdHZhciBzdmcgPSBkMy5zZWxlY3QoZWxlbWVudFswXSkuYXBwZW5kKFwic3ZnXCIpXG5cdFx0XHRcdFx0LmF0dHIoXCJ3aWR0aFwiLCBvcHRpb25zLndpZHRoKVxuXHRcdFx0XHRcdC5hdHRyKFwiaGVpZ2h0XCIsIG9wdGlvbnMuaGVpZ2h0KVxuXHRcdFx0XHRcdC5hcHBlbmQoXCJnXCIpO1xuXHRcdFx0XHQvLy5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKDAsXCIgKyBvcHRpb25zLm1hcmdpbi50b3AgLyAyICsgXCIpXCIpO1xuXHRcdFx0XHR2YXIgZ3JhZGllbnQgPSBzdmcuYXBwZW5kKCdzdmc6ZGVmcycpXG5cdFx0XHRcdFx0LmFwcGVuZChcInN2ZzpsaW5lYXJHcmFkaWVudFwiKVxuXHRcdFx0XHRcdC5hdHRyKCdpZCcsIG9wdGlvbnMuZmllbGQpXG5cdFx0XHRcdFx0LmF0dHIoJ3gxJywgJzAlJylcblx0XHRcdFx0XHQuYXR0cigneTEnLCAnMCUnKVxuXHRcdFx0XHRcdC5hdHRyKCd4MicsICcxMDAlJylcblx0XHRcdFx0XHQuYXR0cigneTInLCAnMCUnKVxuXHRcdFx0XHRcdC5hdHRyKCdzcHJlYWRNZXRob2QnLCAncGFkJylcblx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKG9wdGlvbnMuY29sb3JzLCBmdW5jdGlvbiAoY29sb3IpIHtcblx0XHRcdFx0XHRncmFkaWVudC5hcHBlbmQoJ3N2ZzpzdG9wJylcblx0XHRcdFx0XHRcdC5hdHRyKCdvZmZzZXQnLCBjb2xvci5wb3NpdGlvbiArICclJylcblx0XHRcdFx0XHRcdC5hdHRyKCdzdG9wLWNvbG9yJywgY29sb3IuY29sb3IpXG5cdFx0XHRcdFx0XHQuYXR0cignc3RvcC1vcGFjaXR5JywgY29sb3Iub3BhY2l0eSk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHR2YXIgcmVjdCA9IHN2Zy5hcHBlbmQoJ3N2ZzpyZWN0Jylcblx0XHRcdFx0XHQuYXR0cignd2lkdGgnLCBvcHRpb25zLndpZHRoKVxuXHRcdFx0XHRcdC5hdHRyKCdoZWlnaHQnLCBvcHRpb25zLmhlaWdodClcblx0XHRcdFx0XHQuc3R5bGUoJ2ZpbGwnLCAndXJsKCMnICsgb3B0aW9ucy5maWVsZCArICcpJyk7XG5cdFx0XHRcdHZhciBsZWdlbmQgPSBzdmcuYXBwZW5kKCdnJykuYXR0cigndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgnICsgb3B0aW9ucy5oZWlnaHQgLyAyICsgJywgJyArIG9wdGlvbnMuaGVpZ2h0IC8gMiArICcpJylcblx0XHRcdFx0XHQuYXR0cignY2xhc3MnLCAnc3RhcnRMYWJlbCcpXG5cblx0XHRcdFx0aWYgKG9wdGlvbnMuaW5mbyA9PT0gdHJ1ZSkge1xuXHRcdFx0XHRcdGxlZ2VuZC5hcHBlbmQoJ2NpcmNsZScpXG5cdFx0XHRcdFx0XHQuYXR0cigncicsIG9wdGlvbnMuaGVpZ2h0IC8gMik7XG5cdFx0XHRcdFx0bGVnZW5kLmFwcGVuZCgndGV4dCcpXG5cdFx0XHRcdFx0XHQudGV4dCgwKVxuXHRcdFx0XHRcdFx0LnN0eWxlKCdmb250LXNpemUnLCBvcHRpb25zLmhlaWdodC8yLjUpXG5cdFx0XHRcdFx0XHQuYXR0cigndGV4dC1hbmNob3InLCAnbWlkZGxlJylcblx0XHRcdFx0XHRcdC5hdHRyKCd5JywgJy4zNWVtJylcblx0XHRcdFx0XHR2YXIgbGVnZW5kMiA9IHN2Zy5hcHBlbmQoJ2cnKS5hdHRyKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKCcgKyAob3B0aW9ucy53aWR0aCAtIChvcHRpb25zLmhlaWdodCAvIDIpKSArICcsICcgKyBvcHRpb25zLmhlaWdodCAvIDIgKyAnKScpXG5cdFx0XHRcdFx0XHQuYXR0cignY2xhc3MnLCAnZW5kTGFiZWwnKVxuXHRcdFx0XHRcdGxlZ2VuZDIuYXBwZW5kKCdjaXJjbGUnKVxuXHRcdFx0XHRcdFx0LmF0dHIoJ3InLCBvcHRpb25zLmhlaWdodCAvIDIpXG5cdFx0XHRcdFx0bGVnZW5kMi5hcHBlbmQoJ3RleHQnKVxuXHRcdFx0XHRcdFx0LnRleHQoMTAwKVxuXHRcdFx0XHRcdFx0LnN0eWxlKCdmb250LXNpemUnLCBvcHRpb25zLmhlaWdodC8yLjUpXG5cdFx0XHRcdFx0XHQuYXR0cigndGV4dC1hbmNob3InLCAnbWlkZGxlJylcblx0XHRcdFx0XHRcdC5hdHRyKCd5JywgJy4zNWVtJylcblx0XHRcdFx0fVxuXHRcdFx0XHR2YXIgc2xpZGVyID0gc3ZnLmFwcGVuZChcImdcIilcblx0XHRcdFx0XHQuYXR0cihcImNsYXNzXCIsIFwic2xpZGVyXCIpO1xuXHRcdFx0XHRpZihvcHRpb25zLmhhbmRsaW5nID09IHRydWUpe1xuXHRcdFx0XHRcdHNsaWRlci5jYWxsKGJydXNoKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHNsaWRlci5zZWxlY3QoXCIuYmFja2dyb3VuZFwiKVxuXHRcdFx0XHRcdC5hdHRyKFwiaGVpZ2h0XCIsIG9wdGlvbnMuaGVpZ2h0KTtcblxuXHRcdFx0XHRpZiAob3B0aW9ucy5pbmZvID09PSB0cnVlKSB7XG5cdFx0XHRcdHNsaWRlci5hcHBlbmQoJ2xpbmUnKVxuXHRcdFx0XHRcdC5hdHRyKCd4MScsIG9wdGlvbnMud2lkdGggLyAyKVxuXHRcdFx0XHRcdC5hdHRyKCd5MScsIDApXG5cdFx0XHRcdFx0LmF0dHIoJ3gyJywgb3B0aW9ucy53aWR0aCAvIDIpXG5cdFx0XHRcdFx0LmF0dHIoJ3kyJywgb3B0aW9ucy5oZWlnaHQpXG5cdFx0XHRcdFx0LmF0dHIoJ3N0cm9rZS1kYXNoYXJyYXknLCAnMywzJylcblx0XHRcdFx0XHQuYXR0cignc3Ryb2tlLXdpZHRoJywgMSlcblx0XHRcdFx0XHQuYXR0cignc3Ryb2tlJywgJ3JnYmEoMCwwLDAsODcpJyk7XG5cdFx0XHRcdH1cblx0XHRcdFx0dmFyIGhhbmRsZUNvbnQgPSBzbGlkZXIuYXBwZW5kKCdnJylcblx0XHRcdFx0XHQuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZSgwLFwiICsgb3B0aW9ucy5oZWlnaHQgLyAyICsgXCIpXCIpO1xuXHRcdFx0XHR2YXIgaGFuZGxlID0gaGFuZGxlQ29udC5hcHBlbmQoXCJjaXJjbGVcIilcblx0XHRcdFx0XHQuYXR0cihcImNsYXNzXCIsIFwiaGFuZGxlXCIpXG5cdFx0XHRcdFx0LmF0dHIoXCJyXCIsIG9wdGlvbnMuaGVpZ2h0IC8gMik7XG5cdFx0XHRcdFx0aWYob3B0aW9ucy5jb2xvcil7XG5cdFx0XHRcdFx0XHRoYW5kbGUuc3R5bGUoJ2ZpbGwnLCBvcHRpb25zLmNvbG9yKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdHZhciBoYW5kbGVMYWJlbCA9IGhhbmRsZUNvbnQuYXBwZW5kKCd0ZXh0Jylcblx0XHRcdFx0XHQudGV4dCgwKVxuXHRcdFx0XHRcdC5zdHlsZSgnZm9udC1zaXplJywgb3B0aW9ucy5oZWlnaHQvMi41KVxuXHRcdFx0XHRcdC5hdHRyKFwidGV4dC1hbmNob3JcIiwgXCJtaWRkbGVcIikuYXR0cigneScsICcwLjM1ZW0nKTtcblxuXHRcdFx0XHQvL3NsaWRlclxuXHRcdFx0XHQvLy5jYWxsKGJydXNoLmV4dGVudChbMCwgMF0pKVxuXHRcdFx0XHQvLy5jYWxsKGJydXNoLmV2ZW50KTtcblxuXHRcdFx0XHRmdW5jdGlvbiBicnVzaCgpIHtcblx0XHRcdFx0XHR2YXIgdmFsdWUgPSBicnVzaC5leHRlbnQoKVswXTtcblxuXHRcdFx0XHRcdGlmIChkMy5ldmVudC5zb3VyY2VFdmVudCkgeyAvLyBub3QgYSBwcm9ncmFtbWF0aWMgZXZlbnRcblx0XHRcdFx0XHRcdHZhbHVlID0geC5pbnZlcnQoZDMubW91c2UodGhpcylbMF0pO1xuXHRcdFx0XHRcdFx0YnJ1c2guZXh0ZW50KFt2YWx1ZSwgdmFsdWVdKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aGFuZGxlTGFiZWwudGV4dChwYXJzZUludCh2YWx1ZSkpO1xuXHRcdFx0XHRcdGhhbmRsZUNvbnQuYXR0cihcInRyYW5zZm9ybVwiLCAndHJhbnNsYXRlKCcgKyB4KHZhbHVlKSArICcsJyArIG9wdGlvbnMuaGVpZ2h0IC8gMiArICcpJyk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRmdW5jdGlvbiBicnVzaGVkKCkge1xuXHRcdFx0XHRcdHZhciB2YWx1ZSA9IGJydXNoLmV4dGVudCgpWzBdLFxuXHRcdFx0XHRcdFx0Y291bnQgPSAwLFxuXHRcdFx0XHRcdFx0Zm91bmQgPSBmYWxzZTtcblx0XHRcdFx0XHR2YXIgZmluYWwgPSBcIlwiO1xuXHRcdFx0XHRcdGRvIHtcblxuXHRcdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKCRzY29wZS5kYXRhLCBmdW5jdGlvbiAobmF0LCBrZXkpIHtcblx0XHRcdFx0XHRcdFx0aWYgKHBhcnNlSW50KG5hdFtvcHRpb25zLmZpZWxkXSkgPT0gcGFyc2VJbnQodmFsdWUpKSB7XG5cdFx0XHRcdFx0XHRcdFx0ZmluYWwgPSBuYXQ7XG5cdFx0XHRcdFx0XHRcdFx0Zm91bmQgPSB0cnVlO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdGNvdW50Kys7XG5cdFx0XHRcdFx0XHR2YWx1ZSA9IHZhbHVlID4gNTAgPyB2YWx1ZSAtIDEgOiB2YWx1ZSArIDE7XG5cdFx0XHRcdFx0fSB3aGlsZSAoIWZvdW5kICYmIGNvdW50IDwgMTAwKTtcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhmaW5hbCk7XG5cdFx0XHRcdFx0bmdNb2RlbC4kc2V0Vmlld1ZhbHVlKGZpbmFsKTtcblx0XHRcdFx0XHRuZ01vZGVsLiRyZW5kZXIoKTtcblx0XHRcdFx0fVxuXHRcdFx0XHQkc2NvcGUuJHdhdGNoKCdvcHRpb25zJywgZnVuY3Rpb24obixvKXtcblx0XHRcdFx0XHRpZihuID09PSBvKXtcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0b3B0aW9ucy5jb2xvcnNbMV0uY29sb3IgPSBuLmNvbG9yO1xuXHRcdFx0XHRcdGdyYWRpZW50ID0gc3ZnLmFwcGVuZCgnc3ZnOmRlZnMnKVxuXHRcdFx0XHRcdFx0LmFwcGVuZChcInN2ZzpsaW5lYXJHcmFkaWVudFwiKVxuXHRcdFx0XHRcdFx0LmF0dHIoJ2lkJywgb3B0aW9ucy5maWVsZCtcIl9cIituLmNvbG9yKVxuXHRcdFx0XHRcdFx0LmF0dHIoJ3gxJywgJzAlJylcblx0XHRcdFx0XHRcdC5hdHRyKCd5MScsICcwJScpXG5cdFx0XHRcdFx0XHQuYXR0cigneDInLCAnMTAwJScpXG5cdFx0XHRcdFx0XHQuYXR0cigneTInLCAnMCUnKVxuXHRcdFx0XHRcdFx0LmF0dHIoJ3NwcmVhZE1ldGhvZCcsICdwYWQnKVxuXHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChvcHRpb25zLmNvbG9ycywgZnVuY3Rpb24gKGNvbG9yKSB7XG5cdFx0XHRcdFx0XHRncmFkaWVudC5hcHBlbmQoJ3N2ZzpzdG9wJylcblx0XHRcdFx0XHRcdFx0LmF0dHIoJ29mZnNldCcsIGNvbG9yLnBvc2l0aW9uICsgJyUnKVxuXHRcdFx0XHRcdFx0XHQuYXR0cignc3RvcC1jb2xvcicsIGNvbG9yLmNvbG9yKVxuXHRcdFx0XHRcdFx0XHQuYXR0cignc3RvcC1vcGFjaXR5JywgY29sb3Iub3BhY2l0eSk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0cmVjdC5zdHlsZSgnZmlsbCcsICd1cmwoIycgKyBvcHRpb25zLmZpZWxkICsgJ18nK24uY29sb3IrJyknKTtcblx0XHRcdFx0XHRoYW5kbGUuc3R5bGUoJ2ZpbGwnLCBuLmNvbG9yKTtcblx0XHRcdFx0XHRoYW5kbGVMYWJlbC50ZXh0KHBhcnNlSW50KG5nTW9kZWwuJG1vZGVsVmFsdWVbbi5maWVsZF0pKTtcblx0XHRcdFx0XHRoYW5kbGVDb250LnRyYW5zaXRpb24oKS5kdXJhdGlvbig1MDApLmVhc2UoJ3F1YWQnKS5hdHRyKFwidHJhbnNmb3JtXCIsICd0cmFuc2xhdGUoJyArIHgobmdNb2RlbC4kbW9kZWxWYWx1ZVtuLmZpZWxkXSkgKyAnLCcgKyBvcHRpb25zLmhlaWdodCAvIDIgKyAnKScpO1xuXHRcdFx0XHR9KTtcblx0XHRcdFx0JHNjb3BlLiR3YXRjaChcblx0XHRcdFx0XHRmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gbmdNb2RlbC4kbW9kZWxWYWx1ZTtcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdGZ1bmN0aW9uIChuZXdWYWx1ZSwgb2xkVmFsdWUpIHtcblx0XHRcdFx0XHRcdGlmICghbmV3VmFsdWUpIHtcblx0XHRcdFx0XHRcdFx0aGFuZGxlTGFiZWwudGV4dChwYXJzZUludCgwKSk7XG5cdFx0XHRcdFx0XHRcdGhhbmRsZUNvbnQuYXR0cihcInRyYW5zZm9ybVwiLCAndHJhbnNsYXRlKCcgKyB4KDApICsgJywnICsgb3B0aW9ucy5oZWlnaHQgLyAyICsgJyknKTtcblx0XHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0aGFuZGxlTGFiZWwudGV4dChwYXJzZUludChuZXdWYWx1ZVtvcHRpb25zLmZpZWxkXSkpO1xuXHRcdFx0XHRcdFx0aWYgKG5ld1ZhbHVlID09IG9sZFZhbHVlKSB7XG5cdFx0XHRcdFx0XHRcdGhhbmRsZUNvbnQuYXR0cihcInRyYW5zZm9ybVwiLCAndHJhbnNsYXRlKCcgKyB4KG5ld1ZhbHVlW29wdGlvbnMuZmllbGRdKSArICcsJyArIG9wdGlvbnMuaGVpZ2h0IC8gMiArICcpJyk7XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRoYW5kbGVDb250LnRyYW5zaXRpb24oKS5kdXJhdGlvbig1MDApLmVhc2UoJ3F1YWQnKS5hdHRyKFwidHJhbnNmb3JtXCIsICd0cmFuc2xhdGUoJyArIHgobmV3VmFsdWVbb3B0aW9ucy5maWVsZF0pICsgJywnICsgb3B0aW9ucy5oZWlnaHQgLyAyICsgJyknKTtcblxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH07XG5cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoICdhcHAuY29udHJvbGxlcnMnICkuY29udHJvbGxlciggJ01lZGlhbkN0cmwnLCBmdW5jdGlvbigpe1xuXHRcdC8vXG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5kaXJlY3RpdmVzJykuYW5pbWF0aW9uKCcuc2xpZGUtdG9nZ2xlJywgWyckYW5pbWF0ZUNzcycsIGZ1bmN0aW9uKCRhbmltYXRlQ3NzKSB7XG5cblx0XHR2YXIgbGFzdElkID0gMDtcbiAgICAgICAgdmFyIF9jYWNoZSA9IHt9O1xuXG4gICAgICAgIGZ1bmN0aW9uIGdldElkKGVsKSB7XG4gICAgICAgICAgICB2YXIgaWQgPSBlbFswXS5nZXRBdHRyaWJ1dGUoXCJkYXRhLXNsaWRlLXRvZ2dsZVwiKTtcbiAgICAgICAgICAgIGlmICghaWQpIHtcbiAgICAgICAgICAgICAgICBpZCA9ICsrbGFzdElkO1xuICAgICAgICAgICAgICAgIGVsWzBdLnNldEF0dHJpYnV0ZShcImRhdGEtc2xpZGUtdG9nZ2xlXCIsIGlkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBpZDtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBnZXRTdGF0ZShpZCkge1xuICAgICAgICAgICAgdmFyIHN0YXRlID0gX2NhY2hlW2lkXTtcbiAgICAgICAgICAgIGlmICghc3RhdGUpIHtcbiAgICAgICAgICAgICAgICBzdGF0ZSA9IHt9O1xuICAgICAgICAgICAgICAgIF9jYWNoZVtpZF0gPSBzdGF0ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGdlbmVyYXRlUnVubmVyKGNsb3NpbmcsIHN0YXRlLCBhbmltYXRvciwgZWxlbWVudCwgZG9uZUZuKSB7XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgc3RhdGUuYW5pbWF0aW5nID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBzdGF0ZS5hbmltYXRvciA9IGFuaW1hdG9yO1xuICAgICAgICAgICAgICAgIHN0YXRlLmRvbmVGbiA9IGRvbmVGbjtcbiAgICAgICAgICAgICAgICBhbmltYXRvci5zdGFydCgpLmZpbmFsbHkoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjbG9zaW5nICYmIHN0YXRlLmRvbmVGbiA9PT0gZG9uZUZuKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50WzBdLnN0eWxlLmhlaWdodCA9ICcnO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHN0YXRlLmFuaW1hdGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBzdGF0ZS5hbmltYXRvciA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAgICAgc3RhdGUuZG9uZUZuKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgbGVhdmU6IGZ1bmN0aW9uKGVsZW1lbnQsIGRvbmVGbikge1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciBzdGF0ZSA9IGdldFN0YXRlKGdldElkKGVsZW1lbnQpKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGhlaWdodCA9IChzdGF0ZS5hbmltYXRpbmcgJiYgc3RhdGUuaGVpZ2h0KSA/XG4gICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZS5oZWlnaHQgOiBlbGVtZW50WzBdLm9mZnNldEhlaWdodDtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGFuaW1hdG9yID0gJGFuaW1hdGVDc3MoZWxlbWVudCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgZnJvbToge2hlaWdodDogaGVpZ2h0ICsgJ3B4Jywgb3BhY2l0eTogMX0sXG4gICAgICAgICAgICAgICAgICAgICAgICB0bzoge2hlaWdodDogJzBweCcsIG9wYWNpdHk6IDB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBpZiAoYW5pbWF0b3IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzdGF0ZS5hbmltYXRpbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZS5kb25lRm4gPVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2VuZXJhdGVSdW5uZXIodHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5pbWF0b3IsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZG9uZUZuKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gc3RhdGUuYW5pbWF0b3IuZW5kKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZS5oZWlnaHQgPSBoZWlnaHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGdlbmVyYXRlUnVubmVyKHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbmltYXRvcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZG9uZUZuKSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBkb25lRm4oKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlbnRlcjogZnVuY3Rpb24oZWxlbWVudCwgZG9uZUZuKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIHN0YXRlID0gZ2V0U3RhdGUoZ2V0SWQoZWxlbWVudCkpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgaGVpZ2h0ID0gKHN0YXRlLmFuaW1hdGluZyAmJiBzdGF0ZS5oZWlnaHQpID9cbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlLmhlaWdodCA6IGVsZW1lbnRbMF0ub2Zmc2V0SGVpZ2h0O1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciBhbmltYXRvciA9ICRhbmltYXRlQ3NzKGVsZW1lbnQsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZyb206IHtoZWlnaHQ6ICcwcHgnLCBvcGFjaXR5OiAwfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvOiB7aGVpZ2h0OiBoZWlnaHQgKyAncHgnLCBvcGFjaXR5OiAxfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFuaW1hdG9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3RhdGUuYW5pbWF0aW5nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGUuZG9uZUZuID0gZ2VuZXJhdGVSdW5uZXIoZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5pbWF0b3IsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkb25lRm4pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBzdGF0ZS5hbmltYXRvci5lbmQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlLmhlaWdodCA9IGhlaWdodDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZ2VuZXJhdGVSdW5uZXIoZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbmltYXRvcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZG9uZUZuKSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBkb25lRm4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XSk7XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCAnYXBwLmNvbnRyb2xsZXJzJyApLmNvbnRyb2xsZXIoICdTbGlkZVRvZ2dsZUN0cmwnLCBmdW5jdGlvbigpe1xuXHRcdC8vXG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmRpcmVjdGl2ZXMnKS5kaXJlY3RpdmUoJ3N1YmluZGV4Jywgc3ViaW5kZXgpO1xuXG5cdHN1YmluZGV4LiRpbmplY3QgPSBbJyR0aW1lb3V0JywgJ3Ntb290aFNjcm9sbCddO1xuXG5cdGZ1bmN0aW9uIHN1YmluZGV4KCR0aW1lb3V0LCBzbW9vdGhTY3JvbGwpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0cmVzdHJpY3Q6ICdFJyxcblx0XHRcdHJlcGxhY2U6IHRydWUsXG5cdFx0XHRjb250cm9sbGVyOiAnU3ViaW5kZXhDdHJsJyxcblx0XHRcdHRlbXBsYXRlVXJsOiAndmlld3MvZGlyZWN0aXZlcy9zdWJpbmRleC9zdWJpbmRleC5odG1sJyxcblx0XHRcdGxpbms6IHN1YmluZGV4TGlua0Z1bmN0aW9uXG5cdFx0fTtcblxuXHRcdGZ1bmN0aW9uIHN1YmluZGV4TGlua0Z1bmN0aW9uKCRzY29wZSwgZWxlbWVudCwgJGF0dHJzKSB7XG5cdFx0fVxuXHR9XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignU3ViaW5kZXhDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCAkZmlsdGVyLCAkdGltZW91dCkge1xuXHRcdCRzY29wZS5pbmZvID0gZmFsc2U7XG5cdFx0JHNjb3BlLnNldENoYXJ0ID0gc2V0Q2hhcnQ7XG5cdFx0JHNjb3BlLmNhbGN1bGF0ZUdyYXBoID0gY2FsY3VsYXRlR3JhcGg7XG5cdFx0JHNjb3BlLmNyZWF0ZUluZGV4ZXIgPSBjcmVhdGVJbmRleGVyO1xuXHRcdCRzY29wZS5jYWxjU3ViUmFuayA9IGNhbGNTdWJSYW5rO1xuXHRcdCRzY29wZS50b2dnbGVJbmZvID0gdG9nZ2xlSW5mbztcblx0XHQkc2NvcGUuY3JlYXRlT3B0aW9ucyA9IGNyZWF0ZU9wdGlvbnM7XG5cdFx0JHNjb3BlLmdldFN1YlJhbmsgPSBnZXRTdWJSYW5rO1xuXHRcdGFjdGl2YXRlKCk7XG5cblx0XHRmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcblx0XHRcdCRzY29wZS5jYWxjU3ViUmFuaygpO1xuXHRcdFx0JHNjb3BlLnNldENoYXJ0KCk7XG5cdFx0XHQkc2NvcGUuY2FsY3VsYXRlR3JhcGgoKTtcblx0XHRcdCRzY29wZS5jcmVhdGVJbmRleGVyKCk7XG5cdFx0XHQkc2NvcGUuY3JlYXRlT3B0aW9ucygpO1xuXHRcdFx0JHNjb3BlLiR3YXRjaCgnZGlzcGxheS5zZWxlY3RlZENhdCcsIGZ1bmN0aW9uKG5ld0l0ZW0sIG9sZEl0ZW0pIHtcblx0XHRcdFx0aWYgKG5ld0l0ZW0gPT09IG9sZEl0ZW0pIHtcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdH1cblx0XHRcdFx0JHNjb3BlLmNyZWF0ZUluZGV4ZXIoKTtcblx0XHRcdFx0JHNjb3BlLmNhbGN1bGF0ZUdyYXBoKCk7XG5cdFx0XHRcdCRzY29wZS5jcmVhdGVPcHRpb25zKCk7XG5cdFx0XHRcdCRzY29wZS5jYWxjU3ViUmFuaygpO1xuXHRcdFx0fSk7XG5cdFx0XHQkc2NvcGUuJHdhdGNoKCdjdXJyZW50JywgZnVuY3Rpb24obiwgbykge1xuXHRcdFx0XHRpZiAobiA9PT0gbykge1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXHRcdFx0XHQkc2NvcGUuY2FsY1N1YlJhbmsoKTtcblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIHRvZ2dsZUluZm8oKSB7XG5cdFx0XHQkc2NvcGUuaW5mbyA9ICEkc2NvcGUuaW5mbztcblx0XHR9O1xuXG5cdFx0ZnVuY3Rpb24gY2FsY1N1YlJhbmsoKSB7XG5cdFx0XHR2YXIgcmFuayA9IDA7XG5cdFx0XHRhbmd1bGFyLmZvckVhY2goJHNjb3BlLmRhdGEsIGZ1bmN0aW9uKGl0ZW0pIHtcblx0XHRcdFx0aXRlbVskc2NvcGUuZGlzcGxheS5zZWxlY3RlZENhdC50eXBlXSA9IHBhcnNlRmxvYXQoaXRlbVskc2NvcGUuZGlzcGxheS5zZWxlY3RlZENhdC50eXBlXSk7XG5cdFx0XHRcdGl0ZW1bJ3Njb3JlJ10gPSBwYXJzZUludChpdGVtWydzY29yZSddKTtcblx0XHRcdH0pXG5cdFx0XHR2YXIgZmlsdGVyID0gJGZpbHRlcignb3JkZXJCeScpKCRzY29wZS5lcGksIFskc2NvcGUuZGlzcGxheS5zZWxlY3RlZENhdC50eXBlLCBcInNjb3JlXCJdLCB0cnVlKTtcblx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgZmlsdGVyLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdGlmIChmaWx0ZXJbaV0uaXNvID09ICRzY29wZS5jdXJyZW50Lmlzbykge1xuXHRcdFx0XHRcdHJhbmsgPSBpICsgMTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0JHNjb3BlLmN1cnJlbnRbJHNjb3BlLmRpc3BsYXkuc2VsZWN0ZWRDYXQudHlwZSsnX3JhbmsnXSA9IHJhbms7XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIGdldFN1YlJhbmsoY291bnRyeSl7XG5cdFx0XHR2YXIgZmlsdGVyID0gJGZpbHRlcignb3JkZXJCeScpKCRzY29wZS5lcGksIFskc2NvcGUuZGlzcGxheS5zZWxlY3RlZENhdC50eXBlLCBcInNjb3JlXCJdLCB0cnVlKTtcblx0XHRcdHZhciByYW5rID0gMDtcblx0XHRcdGFuZ3VsYXIuZm9yRWFjaChmaWx0ZXIsIGZ1bmN0aW9uKGl0ZW0sIGtleSl7XG5cdFx0XHRcdGlmKGl0ZW0uY291bnRyeSA9PSBjb3VudHJ5LmNvdW50cnkpe1xuXHRcdFx0XHRcdHJhbmsgPSBrZXk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdFx0cmV0dXJuIHJhbmsrMTtcblx0XHR9XG5cdFx0ZnVuY3Rpb24gY3JlYXRlSW5kZXhlcigpIHtcblx0XHRcdCRzY29wZS5pbmRleGVyID0gWyRzY29wZS4kcGFyZW50LmRpc3BsYXkuc2VsZWN0ZWRDYXQuZGF0YV07XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gY3JlYXRlT3B0aW9ucygpIHtcblx0XHRcdCRzY29wZS5tZWRpYW5PcHRpb25zID0ge1xuXHRcdFx0XHRjb2xvcjogJHNjb3BlLiRwYXJlbnQuZGlzcGxheS5zZWxlY3RlZENhdC5jb2xvcixcblx0XHRcdFx0ZmllbGQ6ICRzY29wZS4kcGFyZW50LmRpc3BsYXkuc2VsZWN0ZWRDYXQudHlwZSxcblx0XHRcdFx0aGFuZGxpbmc6IGZhbHNlLFxuXHRcdFx0XHRtYXJnaW46e1xuXHRcdFx0XHRcdGxlZnQ6MTBcblx0XHRcdFx0fVxuXHRcdFx0fTtcblx0XHRcdCRzY29wZS5tZWRpYW5PcHRpb25zQmlnID0ge1xuXHRcdFx0XHRjb2xvcjogJHNjb3BlLiRwYXJlbnQuZGlzcGxheS5zZWxlY3RlZENhdC5jb2xvcixcblx0XHRcdFx0ZmllbGQ6ICRzY29wZS4kcGFyZW50LmRpc3BsYXkuc2VsZWN0ZWRDYXQudHlwZSxcblx0XHRcdFx0aGFuZGxpbmc6IGZhbHNlLFxuXHRcdFx0XHRtYXJnaW46e1xuXHRcdFx0XHRcdGxlZnQ6MjBcblx0XHRcdFx0fVxuXHRcdFx0fTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBzZXRDaGFydCgpIHtcblx0XHRcdCRzY29wZS5jaGFydCA9IHtcblx0XHRcdFx0b3B0aW9uczoge1xuXHRcdFx0XHRcdGNoYXJ0OiB7XG5cdFx0XHRcdFx0XHR0eXBlOiAnbGluZUNoYXJ0Jyxcblx0XHRcdFx0XHRcdC8vaGVpZ2h0OiAyMDAsXG5cdFx0XHRcdFx0XHRsZWdlbmRQb3NpdGlvbjogJ2xlZnQnLFxuXHRcdFx0XHRcdFx0bWFyZ2luOiB7XG5cdFx0XHRcdFx0XHRcdHRvcDogMjAsXG5cdFx0XHRcdFx0XHRcdHJpZ2h0OiAyMCxcblx0XHRcdFx0XHRcdFx0Ym90dG9tOiAyMCxcblx0XHRcdFx0XHRcdFx0bGVmdDogMjBcblx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHR4OiBmdW5jdGlvbihkKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBkLng7XG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0eTogZnVuY3Rpb24oZCkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gZC55O1xuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdHNob3dWYWx1ZXM6IGZhbHNlLFxuXHRcdFx0XHRcdFx0c2hvd1lBeGlzOiBmYWxzZSxcblx0XHRcdFx0XHRcdHRyYW5zaXRpb25EdXJhdGlvbjogNTAwLFxuXHRcdFx0XHRcdFx0dXNlSW50ZXJhY3RpdmVHdWlkZWxpbmU6IHRydWUsXG5cdFx0XHRcdFx0XHRmb3JjZVk6IFsxMDAsIDBdLFxuXHRcdFx0XHRcdFx0eEF4aXM6IHtcblx0XHRcdFx0XHRcdFx0YXhpc0xhYmVsOiAnJ1xuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdHlBeGlzOiB7XG5cdFx0XHRcdFx0XHRcdGF4aXNMYWJlbDogJycsXG5cdFx0XHRcdFx0XHRcdGF4aXNMYWJlbERpc3RhbmNlOiAzMFxuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdGxlZ2VuZDoge1xuXHRcdFx0XHRcdFx0XHRyaWdodEFsaWduOiBmYWxzZSxcblx0XHRcdFx0XHRcdFx0bWFyZ2luOiB7XG5cdFx0XHRcdFx0XHRcdFx0Ym90dG9tOiAzMFxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0bGluZXM6IHtcblx0XHRcdFx0XHRcdFx0aW50ZXJwb2xhdGU6ICdjYXJkaW5hbCdcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sXG5cdFx0XHRcdGRhdGE6IFtdXG5cdFx0XHR9O1xuXHRcdFx0cmV0dXJuICRzY29wZS5jaGFydDtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBjYWxjdWxhdGVHcmFwaCgpIHtcblx0XHRcdHZhciBjaGFydERhdGEgPSBbXTtcblx0XHRcdGFuZ3VsYXIuZm9yRWFjaCgkc2NvcGUuZGlzcGxheS5zZWxlY3RlZENhdC5jaGlsZHJlbiwgZnVuY3Rpb24oaXRlbSwga2V5KSB7XG5cdFx0XHRcdHZhciBncmFwaCA9IHtcblx0XHRcdFx0XHRrZXk6IGl0ZW0udGl0bGUsXG5cdFx0XHRcdFx0Y29sb3I6IGl0ZW0uY29sb3IsXG5cdFx0XHRcdFx0dmFsdWVzOiBbXVxuXHRcdFx0XHR9O1xuXHRcdFx0XHRhbmd1bGFyLmZvckVhY2goJHNjb3BlLmNvdW50cnkuZXBpLCBmdW5jdGlvbihkYXRhKSB7XG5cdFx0XHRcdFx0Z3JhcGgudmFsdWVzLnB1c2goe1xuXHRcdFx0XHRcdFx0eDogZGF0YS55ZWFyLFxuXHRcdFx0XHRcdFx0eTogZGF0YVtpdGVtLmNvbHVtbl9uYW1lXVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9KTtcblx0XHRcdFx0Y2hhcnREYXRhLnB1c2goZ3JhcGgpO1xuXHRcdFx0fSk7XG5cdFx0XHQkc2NvcGUuY2hhcnQuZGF0YSA9IGNoYXJ0RGF0YTtcblx0XHR9XG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZGlyZWN0aXZlcycpLmRpcmVjdGl2ZSggJ3NpbXBsZWxpbmVjaGFydCcsIGZ1bmN0aW9uKCkge1xuXHRcdHZhciBkZWZhdWx0cyA9IGZ1bmN0aW9uKCl7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRpbnZlcnQ6ZmFsc2Vcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlc3RyaWN0OiAnRScsXG5cdFx0XHRzY29wZTp7XG5cdFx0XHRcdGRhdGE6Jz0nLFxuXHRcdFx0XHRzZWxlY3Rpb246Jz0nXG5cdFx0XHR9LFxuXHRcdFx0dGVtcGxhdGVVcmw6ICd2aWV3cy9kaXJlY3RpdmVzL3NpbXBsZWxpbmVjaGFydC9zaW1wbGVsaW5lY2hhcnQuaHRtbCcsXG5cdFx0XHRjb250cm9sbGVyOiAnU2ltcGxlbGluZWNoYXJ0Q3RybCcsXG5cdFx0XHRsaW5rOiBmdW5jdGlvbiggJHNjb3BlLCBlbGVtZW50LCAkYXR0cnMgKXtcblx0XHRcdFx0JHNjb3BlLm9wdGlvbnMgPSBhbmd1bGFyLmV4dGVuZChkZWZhdWx0cygpLCAkc2NvcGUub3B0aW9ucyk7XG5cdFx0XHRcdCRzY29wZS5jYWxjdWxhdGVHcmFwaCgpO1xuXHRcdFx0XHQkc2NvcGUuc2V0Q2hhcnQoKTtcblx0XHRcdH1cblx0XHR9O1xuXG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ1NpbXBsZWxpbmVjaGFydEN0cmwnLCBmdW5jdGlvbiAoJHNjb3BlKSB7XG5cdFx0JHNjb3BlLmNvbmZpZyA9IHtcblx0XHRcdHZpc2libGU6IHRydWUsIC8vIGRlZmF1bHQ6IHRydWVcblx0XHRcdGV4dGVuZGVkOiBmYWxzZSwgLy8gZGVmYXVsdDogZmFsc2Vcblx0XHRcdGRpc2FibGVkOiBmYWxzZSwgLy8gZGVmYXVsdDogZmFsc2Vcblx0XHRcdGF1dG9yZWZyZXNoOiB0cnVlLCAvLyBkZWZhdWx0OiB0cnVlXG5cdFx0XHRyZWZyZXNoRGF0YU9ubHk6IGZhbHNlLCAvLyBkZWZhdWx0OiBmYWxzZVxuXHRcdFx0ZGVlcFdhdGNoT3B0aW9uczogdHJ1ZSwgLy8gZGVmYXVsdDogdHJ1ZVxuXHRcdFx0ZGVlcFdhdGNoRGF0YTogZmFsc2UsIC8vIGRlZmF1bHQ6IGZhbHNlXG5cdFx0XHRkZWVwV2F0Y2hDb25maWc6IHRydWUsIC8vIGRlZmF1bHQ6IHRydWVcblx0XHRcdGRlYm91bmNlOiAxMCAvLyBkZWZhdWx0OiAxMFxuXHRcdH07XG5cdFx0JHNjb3BlLmNoYXJ0ID0ge1xuXHRcdFx0b3B0aW9uczoge1xuXHRcdFx0XHRjaGFydDoge31cblx0XHRcdH0sXG5cdFx0XHRkYXRhOiBbXVxuXHRcdH07XG5cdFx0JHNjb3BlLnNldENoYXJ0ID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0JHNjb3BlLmNoYXJ0Lm9wdGlvbnMuY2hhcnQgPSB7XG5cdFx0XHRcdHR5cGU6ICdsaW5lQ2hhcnQnLFxuXHRcdFx0XHRsZWdlbmRQb3NpdGlvbjogJ2xlZnQnLFxuXHRcdFx0XHRtYXJnaW46IHtcblx0XHRcdFx0XHR0b3A6IDIwLFxuXHRcdFx0XHRcdHJpZ2h0OiAyMCxcblx0XHRcdFx0XHRib3R0b206IDIwLFxuXHRcdFx0XHRcdGxlZnQ6IDIwXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHg6IGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGQueDtcblx0XHRcdFx0fSxcblx0XHRcdFx0eTogZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRyZXR1cm4gZC55O1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRzaG93TGVnZW5kOiBmYWxzZSxcblx0XHRcdFx0c2hvd1ZhbHVlczogZmFsc2UsXG5cdFx0XHRcdHNob3dZQXhpczogZmFsc2UsXG5cdFx0XHRcdHRyYW5zaXRpb25EdXJhdGlvbjogNTAwLFxuXHRcdFx0XHR1c2VJbnRlcmFjdGl2ZUd1aWRlbGluZTogdHJ1ZSxcblx0XHRcdFx0Ly9mb3JjZVk6IFsxMDAsIDBdLFxuXHRcdFx0XHQvL3lEb21haW46eURvbWFpbixcblx0XHRcdFx0eEF4aXM6IHtcblx0XHRcdFx0XHRheGlzTGFiZWw6ICcnXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHlBeGlzOiB7XG5cdFx0XHRcdFx0YXhpc0xhYmVsOiAnJyxcblx0XHRcdFx0XHRheGlzTGFiZWxEaXN0YW5jZTogMzBcblx0XHRcdFx0fSxcblx0XHRcdFx0bGVnZW5kOiB7XG5cdFx0XHRcdFx0cmlnaHRBbGlnbjogZmFsc2Vcblx0XHRcdFx0fSxcblx0XHRcdFx0bGluZXM6IHtcblx0XHRcdFx0XHRpbnRlcnBvbGF0ZTogJ2NhcmRpbmFsJ1xuXHRcdFx0XHR9XG5cblx0XHRcdH07XG5cdFx0XHRpZiAoJHNjb3BlLm9wdGlvbnMuaW52ZXJ0ID09IHRydWUpIHtcblx0XHRcdFx0JHNjb3BlLmNoYXJ0Lm9wdGlvbnMuY2hhcnQueURvbWFpbiA9IFtwYXJzZUludCgkc2NvcGUucmFuZ2UubWF4KSwgJHNjb3BlLnJhbmdlLm1pbl07XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gJHNjb3BlLmNoYXJ0O1xuXHRcdH1cblx0XHQkc2NvcGUuY2FsY3VsYXRlR3JhcGggPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHR2YXIgY2hhcnREYXRhID0gW107XG5cdFx0XHQkc2NvcGUucmFuZ2UgPSB7XG5cdFx0XHRcdG1heDogMCxcblx0XHRcdFx0bWluOiAxMDAwXG5cdFx0XHR9O1xuXHRcdFx0YW5ndWxhci5mb3JFYWNoKCRzY29wZS5zZWxlY3Rpb24sIGZ1bmN0aW9uIChpdGVtLCBrZXkpIHtcblx0XHRcdFx0dmFyIGdyYXBoID0ge1xuXHRcdFx0XHRcdGlkOiBrZXksXG5cdFx0XHRcdFx0a2V5OiBpdGVtLnRpdGxlLFxuXHRcdFx0XHRcdGNvbG9yOiBpdGVtLmNvbG9yLFxuXHRcdFx0XHRcdHZhbHVlczogW11cblx0XHRcdFx0fTtcblx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKCRzY29wZS5kYXRhLCBmdW5jdGlvbiAoZGF0YSwgaykge1xuXHRcdFx0XHRcdGdyYXBoLnZhbHVlcy5wdXNoKHtcblx0XHRcdFx0XHRcdGlkOiBrLFxuXHRcdFx0XHRcdFx0eDogZGF0YVtpdGVtLmZpZWxkcy54XSxcblx0XHRcdFx0XHRcdHk6IGRhdGFbaXRlbS5maWVsZHMueV1cblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHQkc2NvcGUucmFuZ2UubWF4ID0gTWF0aC5tYXgoJHNjb3BlLnJhbmdlLm1heCwgZGF0YVtpdGVtLmZpZWxkcy55XSk7XG5cdFx0XHRcdFx0JHNjb3BlLnJhbmdlLm1pbiA9IE1hdGgubWluKCRzY29wZS5yYW5nZS5taW4sIGRhdGFbaXRlbS5maWVsZHMueV0pO1xuXHRcdFx0XHR9KTtcblx0XHRcdFx0Y2hhcnREYXRhLnB1c2goZ3JhcGgpO1xuXHRcdFx0fSk7XG5cblx0XHRcdCRzY29wZS5jaGFydC5kYXRhID0gY2hhcnREYXRhO1xuXHRcdFx0aWYgKCRzY29wZS5vcHRpb25zLmludmVydCA9PSBcInRydWVcIikge1xuXHRcdFx0XHQkc2NvcGUuY2hhcnQub3B0aW9ucy5jaGFydC55RG9tYWluID0gW3BhcnNlSW50KCRzY29wZS5yYW5nZS5tYXgpLCAkc2NvcGUucmFuZ2UubWluXTtcblx0XHRcdH1cblx0XHR9O1xuXHRcdCRzY29wZS4kd2F0Y2goJ2RhdGEnLCBmdW5jdGlvbiAobiwgbykge1xuXHRcdFx0aWYgKCFuKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHRcdCRzY29wZS5jYWxjdWxhdGVHcmFwaCgpO1xuXHRcdH0pO1xuXHRcdCRzY29wZS4kd2F0Y2goJ3NlbGVjdGlvbicsIGZ1bmN0aW9uIChuLCBvKSB7XG5cdFx0XHRpZiAobiA9PT0gbykge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0XHQkc2NvcGUuY2FsY3VsYXRlR3JhcGgoKTtcblx0XHR9KVxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZGlyZWN0aXZlcycpLmRpcmVjdGl2ZSgnc3VuYnVyc3QnLCBmdW5jdGlvbiAoKSB7XG5cdFx0dmFyIGRlZmF1bHRzID0gZnVuY3Rpb24oKXtcblx0XHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHQgbW9kZTogJ3NpemUnXG5cdFx0XHRcdH1cblx0XHR9O1xuXHRcdHJldHVybiB7XG5cdFx0XHRyZXN0cmljdDogJ0UnLFxuXHRcdFx0Ly90ZW1wbGF0ZVVybDogJ3ZpZXdzL2RpcmVjdGl2ZXMvc3VuYnVyc3Qvc3VuYnVyc3QuaHRtbCcsXG5cdFx0XHRjb250cm9sbGVyOiAnU3VuYnVyc3RDdHJsJyxcblx0XHRcdHNjb3BlOiB7XG5cdFx0XHRcdGRhdGE6ICc9J1xuXHRcdFx0fSxcblx0XHRcdGxpbms6IGZ1bmN0aW9uICgkc2NvcGUsIGVsZW1lbnQsICRhdHRycykge1xuXHRcdFx0XHR2YXIgb3B0aW9ucyA9IGFuZ3VsYXIuZXh0ZW5kKGRlZmF1bHRzKCksICRhdHRycyk7XG5cdFx0XHRcdCRzY29wZS5zZXRDaGFydCgpO1xuXHRcdFx0XHQkc2NvcGUuY2FsY3VsYXRlR3JhcGgoKTtcblx0XHRcdFx0dmFyIHdpZHRoID0gNjEwLFxuXHRcdFx0XHRcdGhlaWdodCA9IHdpZHRoLFxuXHRcdFx0XHRcdHJhZGl1cyA9ICh3aWR0aCkgLyAyLFxuXHRcdFx0XHRcdHggPSBkMy5zY2FsZS5saW5lYXIoKS5yYW5nZShbMCwgMiAqIE1hdGguUEldKSxcblx0XHRcdFx0XHR5ID0gZDMuc2NhbGUucG93KCkuZXhwb25lbnQoMS4zKS5kb21haW4oWzAsIDFdKS5yYW5nZShbMCwgcmFkaXVzXSksXG5cdFx0XHRcdFx0Ly9+IHkgPSBkMy5zY2FsZS5wb3coKS5leHBvbmVudCgxLjMpLmRvbWFpbihbMCwgMC4yNSwgMV0pLnJhbmdlKFswLCAzMCwgcmFkaXVzXSksXG5cdFx0XHRcdFx0Ly9+IHkgPSBkMy5zY2FsZS5saW5lYXIoKS5kb21haW4oWzAsIDAuMjUsIDAuNSwgMC43NSwgMV0pLnJhbmdlKFswLCAzMCwgMTE1LCAyMDAsIHJhZGl1c10pLFxuXHRcdFx0XHRcdHBhZGRpbmcgPSAwLFxuXHRcdFx0XHRcdGR1cmF0aW9uID0gMTAwMCxcblx0XHRcdFx0XHRjaXJjUGFkZGluZyA9IDEwO1xuXG5cdFx0XHRcdHZhciBkaXYgPSBkMy5zZWxlY3QoZWxlbWVudFswXSk7XG5cblxuXHRcdFx0XHR2YXIgdmlzID0gZGl2LmFwcGVuZChcInN2Z1wiKVxuXHRcdFx0XHRcdC5hdHRyKFwid2lkdGhcIiwgd2lkdGggKyBwYWRkaW5nICogMilcblx0XHRcdFx0XHQuYXR0cihcImhlaWdodFwiLCBoZWlnaHQgKyBwYWRkaW5nICogMilcblx0XHRcdFx0XHQuYXBwZW5kKFwiZ1wiKVxuXHRcdFx0XHRcdC5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiICsgW3JhZGl1cyArIHBhZGRpbmcsIHJhZGl1cyArIHBhZGRpbmddICsgXCIpXCIpO1xuXG5cdFx0XHRcdC8qXG5cdFx0XHRcdGRpdi5hcHBlbmQoXCJwXCIpXG5cdFx0XHRcdFx0XHQuYXR0cihcImlkXCIsIFwiaW50cm9cIilcblx0XHRcdFx0XHRcdC50ZXh0KFwiQ2xpY2sgdG8gem9vbSFcIik7XG5cdFx0XHRcdCovXG5cblx0XHRcdFx0dmFyIHBhcnRpdGlvbiA9IGQzLmxheW91dC5wYXJ0aXRpb24oKVxuXHRcdFx0XHRcdC5zb3J0KG51bGwpXG5cdFx0XHRcdFx0LnZhbHVlKGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gMTtcblx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHR2YXIgYXJjID0gZDMuc3ZnLmFyYygpXG5cdFx0XHRcdFx0LnN0YXJ0QW5nbGUoZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdHJldHVybiBNYXRoLm1heCgwLCBNYXRoLm1pbigyICogTWF0aC5QSSwgeChkLngpKSk7XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQuZW5kQW5nbGUoZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdHJldHVybiBNYXRoLm1heCgwLCBNYXRoLm1pbigyICogTWF0aC5QSSwgeChkLnggKyBkLmR4KSkpO1xuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0LmlubmVyUmFkaXVzKGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gTWF0aC5tYXgoMCwgZC55ID8geShkLnkpIDogZC55KTtcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC5vdXRlclJhZGl1cyhmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIE1hdGgubWF4KDAsIHkoZC55ICsgZC5keSkpO1xuXHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdHZhciBzcGVjaWFsMSA9IFwiV2FzdGV3YXRlciBUcmVhdG1lbnRcIixcblx0XHRcdFx0XHRzcGVjaWFsMiA9IFwiQWlyIFBvbGx1dGlvbiBQTTIuNSBFeGNlZWRhbmNlXCIsXG5cdFx0XHRcdFx0c3BlY2lhbDMgPSBcIkFncmljdWx0dXJhbCBTdWJzaWRpZXNcIixcblx0XHRcdFx0XHRzcGVjaWFsNCA9IFwiUGVzdGljaWRlIFJlZ3VsYXRpb25cIjtcblxuXG5cdFx0XHRcdHZhciBub2RlcyA9IHBhcnRpdGlvbi5ub2Rlcygkc2NvcGUuY2FsY3VsYXRlR3JhcGgoKSk7XG5cblx0XHRcdFx0dmFyIHBhdGggPSB2aXMuc2VsZWN0QWxsKFwicGF0aFwiKS5kYXRhKG5vZGVzKTtcblx0XHRcdFx0cGF0aC5lbnRlcigpLmFwcGVuZChcInBhdGhcIilcblx0XHRcdFx0XHQuYXR0cihcImlkXCIsIGZ1bmN0aW9uIChkLCBpKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gXCJwYXRoLVwiICsgaTtcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC5hdHRyKFwiZFwiLCBhcmMpXG5cdFx0XHRcdFx0LmF0dHIoXCJmaWxsLXJ1bGVcIiwgXCJldmVub2RkXCIpXG5cdFx0XHRcdFx0LmF0dHIoXCJjbGFzc1wiLCBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGQuZGVwdGggPyBcImJyYW5jaFwiIDogXCJyb290XCI7XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQuc3R5bGUoXCJmaWxsXCIsIHNldENvbG9yKVxuXHRcdFx0XHRcdC5vbihcImNsaWNrXCIsIGNsaWNrKTtcblxuXHRcdFx0XHR2YXIgdGV4dCA9IHZpcy5zZWxlY3RBbGwoXCJ0ZXh0XCIpLmRhdGEobm9kZXMpO1xuXHRcdFx0XHR2YXIgdGV4dEVudGVyID0gdGV4dC5lbnRlcigpLmFwcGVuZChcInRleHRcIilcblx0XHRcdFx0XHQuc3R5bGUoXCJmaWxsLW9wYWNpdHlcIiwgMSlcblx0XHRcdFx0XHQuYXR0cihcInRleHQtYW5jaG9yXCIsIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRpZiAoZC5kZXB0aClcblx0XHRcdFx0XHRcdFx0cmV0dXJuIFwibWlkZGxlXCI7XG5cdFx0XHRcdFx0XHQvL34gcmV0dXJuIHgoZC54ICsgZC5keCAvIDIpID4gTWF0aC5QSSA/IFwiZW5kXCIgOiBcInN0YXJ0XCI7XG5cdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdHJldHVybiBcIm1pZGRsZVwiO1xuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0LmF0dHIoXCJpZFwiLCBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIFwiZGVwdGhcIiArIGQuZGVwdGg7XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQuYXR0cihcImNsYXNzXCIsIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gXCJzZWN0b3JcIlxuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0LmF0dHIoXCJkeVwiLCBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGQuZGVwdGggPyBcIi4yZW1cIiA6IFwiMC4zNWVtXCI7XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQuYXR0cihcInRyYW5zZm9ybVwiLCBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0dmFyIG11bHRpbGluZSA9IChkLm5hbWUgfHwgXCJcIikuc3BsaXQoXCIgXCIpLmxlbmd0aCA+IDIsXG5cdFx0XHRcdFx0XHRcdGFuZ2xlQWxpZ24gPSAoZC54ID4gMC41ID8gMiA6IC0yKSxcblx0XHRcdFx0XHRcdFx0YW5nbGUgPSB4KGQueCArIGQuZHggLyAyKSAqIDE4MCAvIE1hdGguUEkgLSA5MCArIChtdWx0aWxpbmUgPyBhbmdsZUFsaWduIDogMCksXG5cdFx0XHRcdFx0XHRcdHJvdGF0ZSA9IGFuZ2xlICsgKG11bHRpbGluZSA/IC0uNSA6IDApLFxuXHRcdFx0XHRcdFx0XHR0cmFuc2wgPSAoeShkLnkpICsgY2lyY1BhZGRpbmcpICsgMzUsXG5cdFx0XHRcdFx0XHRcdHNlY0FuZ2xlID0gKGFuZ2xlID4gOTAgPyAtMTgwIDogMCk7XG5cdFx0XHRcdFx0XHRpZiAoZC5uYW1lID09IHNwZWNpYWwzIHx8IGQubmFtZSA9PSBzcGVjaWFsNCkgcm90YXRlICs9IDE7XG5cdFx0XHRcdFx0XHRpZiAoZC5kZXB0aCA9PSAwKSB7XG5cdFx0XHRcdFx0XHRcdHRyYW5zbCA9IC0yLjUwO1xuXHRcdFx0XHRcdFx0XHRyb3RhdGUgPSAwO1xuXHRcdFx0XHRcdFx0XHRzZWNBbmdsZSA9IDA7XG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKGQuZGVwdGggPT0gMSkgdHJhbnNsICs9IC05O1xuXHRcdFx0XHRcdFx0ZWxzZSBpZiAoZC5kZXB0aCA9PSAyKSB0cmFuc2wgKz0gLTU7XG5cdFx0XHRcdFx0XHRlbHNlIGlmIChkLmRlcHRoID09IDMpIHRyYW5zbCArPSA0O1xuXHRcdFx0XHRcdFx0cmV0dXJuIFwicm90YXRlKFwiICsgcm90YXRlICsgXCIpdHJhbnNsYXRlKFwiICsgdHJhbnNsICsgXCIpcm90YXRlKFwiICsgc2VjQW5nbGUgKyBcIilcIjtcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC5vbihcImNsaWNrXCIsIGNsaWNrKTtcblxuXHRcdFx0XHQvLyBBZGQgbGFiZWxzLiBWZXJ5IHVnbHkgY29kZSB0byBzcGxpdCBzZW50ZW5jZXMgaW50byBsaW5lcy4gQ2FuIG9ubHkgbWFrZVxuXHRcdFx0XHQvLyBjb2RlIGJldHRlciBpZiBmaW5kIGEgd2F5IHRvIHVzZSBkIG91dHNpZGUgY2FsbHMgc3VjaCBhcyAudGV4dChmdW5jdGlvbihkKSlcblxuXHRcdFx0XHQvLyBUaGlzIGJsb2NrIHJlcGxhY2VzIHRoZSB0d28gYmxvY2tzIGFycm91bmQgaXQuIEl0IGlzICd1c2VmdWwnIGJlY2F1c2UgaXRcblx0XHRcdFx0Ly8gdXNlcyBmb3JlaWduT2JqZWN0LCBzbyB0aGF0IHRleHQgd2lsbCB3cmFwIGFyb3VuZCBsaWtlIGluIHJlZ3VsYXIgSFRNTC4gSSB0cmllZFxuXHRcdFx0XHQvLyB0byBnZXQgaXQgdG8gd29yaywgYnV0IGl0IG9ubHkgaW50cm9kdWNlZCBtb3JlIGJ1Z3MuIFVuZm9ydHVuYXRlbHksIHRoZVxuXHRcdFx0XHQvLyB1Z2x5IHNvbHV0aW9uIChoYXJkIGNvZGVkIGxpbmUgc3BsaWNpbmcpIHdvbi5cblx0XHRcdFx0Ly9+IHZhciB0ZXh0RW50ZXIgPSB0ZXh0LmVudGVyKCkuYXBwZW5kKFwiZm9yZWlnbk9iamVjdFwiKVxuXHRcdFx0XHQvL34gLmF0dHIoXCJ4XCIsMClcblx0XHRcdFx0Ly9+IC5hdHRyKFwieVwiLC0yMClcblx0XHRcdFx0Ly9+IC5hdHRyKFwiaGVpZ2h0XCIsIDEwMClcblx0XHRcdFx0Ly9+IC5hdHRyKFwid2lkdGhcIiwgZnVuY3Rpb24oZCl7IHJldHVybiAoeShkLmR5KSArNTApOyB9KVxuXHRcdFx0XHQvL34gLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgZnVuY3Rpb24oZCkge1xuXHRcdFx0XHQvL34gdmFyIGFuZ2xlQWxpZ24gPSAoZC54ID4gMC41ID8gMiA6IC0yKSxcblx0XHRcdFx0Ly9+IGFuZ2xlID0geChkLnggKyBkLmR4IC8gMikgKiAxODAgLyBNYXRoLlBJIC0gOTAsXG5cdFx0XHRcdC8vfiB0cmFuc2wgPSAoeShkLnkpICsgY2lyY1BhZGRpbmcpO1xuXHRcdFx0XHQvL34gZC5yb3QgPSBhbmdsZTtcblx0XHRcdFx0Ly9+IGlmICghZC5kZXB0aCkgdHJhbnNsID0gLTUwO1xuXHRcdFx0XHQvL34gaWYgKGFuZ2xlID4gOTApIHRyYW5zbCArPSAxMjA7XG5cdFx0XHRcdC8vfiBpZiAoZC5kZXB0aClcblx0XHRcdFx0Ly9+IHJldHVybiBcInJvdGF0ZShcIiArIGFuZ2xlICsgXCIpdHJhbnNsYXRlKFwiICsgdHJhbnNsICsgXCIpcm90YXRlKFwiICsgKGFuZ2xlID4gOTAgPyAtMTgwIDogMCkgKyBcIilcIjtcblx0XHRcdFx0Ly9+IGVsc2Vcblx0XHRcdFx0Ly9+IHJldHVybiBcInRyYW5zbGF0ZShcIiArIHRyYW5zbCArIFwiKVwiO1xuXHRcdFx0XHQvL34gfSlcblx0XHRcdFx0Ly9+IC5hcHBlbmQoXCJ4aHRtbDpib2R5XCIpXG5cdFx0XHRcdC8vfiAuc3R5bGUoXCJiYWNrZ3JvdW5kXCIsIFwibm9uZVwiKVxuXHRcdFx0XHQvL34gLnN0eWxlKFwidGV4dC1hbGlnblwiLCBmdW5jdGlvbihkKXsgcmV0dXJuIChkLnJvdCA+IDkwID8gXCJsZWZ0XCIgOiBcInJpZ2h0XCIpfSlcblx0XHRcdFx0Ly9+IC5odG1sKGZ1bmN0aW9uKGQpeyByZXR1cm4gJzxkaXYgY2xhc3M9JyArXCJkZXB0aFwiICsgZC5kZXB0aCArJyBzdHlsZT1cXFwid2lkdGg6ICcgKyh5KGQuZHkpICs1MCkgKydweDsnICtcInRleHQtYWxpZ246IFwiICsgKGQucm90ID4gOTAgPyBcInJpZ2h0XCIgOiBcImxlZnRcIikgKydcIj4nICtkLm5hbWUgKyc8L2Rpdj4nO30pXG5cblx0XHRcdFx0dGV4dEVudGVyLmFwcGVuZChcInRzcGFuXCIpXG5cdFx0XHRcdFx0LmF0dHIoXCJ4XCIsIDApXG5cdFx0XHRcdFx0LnRleHQoZnVuY3Rpb24gKGQpIHtcblxuXHRcdFx0XHRcdFx0aWYgKGQuZGVwdGggPT0gMyAmJiBkLm5hbWUgIT0gc3BlY2lhbDEgJiYgZC5uYW1lICE9IHNwZWNpYWwyICYmIGQubmFtZSAhPSBzcGVjaWFsMyAmJiBkLm5hbWUgIT0gc3BlY2lhbDQpXG5cdFx0XHRcdFx0XHRcdHJldHVybiBkLm5hbWUuc3BsaXQoXCIgXCIpWzBdICsgXCIgXCIgKyAoZC5uYW1lLnNwbGl0KFwiIFwiKVsxXSB8fCBcIlwiKTtcblx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGQubmFtZS5zcGxpdChcIiBcIilbMF07XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdHRleHRFbnRlci5hcHBlbmQoXCJ0c3BhblwiKVxuXHRcdFx0XHRcdC5hdHRyKFwieFwiLCAwKVxuXHRcdFx0XHRcdC5hdHRyKFwiZHlcIiwgXCIxZW1cIilcblx0XHRcdFx0XHQudGV4dChmdW5jdGlvbiAoZCkge1xuXG5cdFx0XHRcdFx0XHRpZiAoZC5kZXB0aCA9PSAzICYmIGQubmFtZSAhPSBzcGVjaWFsMSAmJiBkLm5hbWUgIT0gc3BlY2lhbDIgJiYgZC5uYW1lICE9IHNwZWNpYWwzICYmIGQubmFtZSAhPSBzcGVjaWFsNClcblx0XHRcdFx0XHRcdFx0cmV0dXJuIChkLm5hbWUuc3BsaXQoXCIgXCIpWzJdIHx8IFwiXCIpICsgXCIgXCIgKyAoZC5uYW1lLnNwbGl0KFwiIFwiKVszXSB8fCBcIlwiKTtcblx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0cmV0dXJuIChkLm5hbWUuc3BsaXQoXCIgXCIpWzFdIHx8IFwiXCIpICsgXCIgXCIgKyAoZC5uYW1lLnNwbGl0KFwiIFwiKVsyXSB8fCBcIlwiKTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0dGV4dEVudGVyLmFwcGVuZChcInRzcGFuXCIpXG5cdFx0XHRcdFx0LmF0dHIoXCJ4XCIsIDApXG5cdFx0XHRcdFx0LmF0dHIoXCJkeVwiLCBcIjFlbVwiKVxuXHRcdFx0XHRcdC50ZXh0KGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRpZiAoZC5kZXB0aCA9PSAzICYmIGQubmFtZSAhPSBzcGVjaWFsMSAmJiBkLm5hbWUgIT0gc3BlY2lhbDIgJiYgZC5uYW1lICE9IHNwZWNpYWwzICYmIGQubmFtZSAhPSBzcGVjaWFsNClcblx0XHRcdFx0XHRcdFx0cmV0dXJuIChkLm5hbWUuc3BsaXQoXCIgXCIpWzRdIHx8IFwiXCIpICsgXCIgXCIgKyAoZC5uYW1lLnNwbGl0KFwiIFwiKVs1XSB8fCBcIlwiKTtcblx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0cmV0dXJuIChkLm5hbWUuc3BsaXQoXCIgXCIpWzNdIHx8IFwiXCIpICsgXCIgXCIgKyAoZC5uYW1lLnNwbGl0KFwiIFwiKVs0XSB8fCBcIlwiKTs7XG5cdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0ZnVuY3Rpb24gY2xpY2soZCkge1xuXHRcdFx0XHRcdC8vIENvbnRyb2wgYXJjIHRyYW5zaXRpb25cblx0XHRcdFx0XHRwYXRoLnRyYW5zaXRpb24oKVxuXHRcdFx0XHRcdFx0LmR1cmF0aW9uKGR1cmF0aW9uKVxuXHRcdFx0XHRcdFx0LmF0dHJUd2VlbihcImRcIiwgYXJjVHdlZW4oZCkpO1xuXG5cdFx0XHRcdFx0Ly8gU29tZXdoYXQgb2YgYSBoYWNrIGFzIHdlIHJlbHkgb24gYXJjVHdlZW4gdXBkYXRpbmcgdGhlIHNjYWxlcy5cblx0XHRcdFx0XHQvLyBDb250cm9sIHRoZSB0ZXh0IHRyYW5zaXRpb25cblx0XHRcdFx0XHR0ZXh0LnN0eWxlKFwidmlzaWJpbGl0eVwiLCBmdW5jdGlvbiAoZSkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gaXNQYXJlbnRPZihkLCBlKSA/IG51bGwgOiBkMy5zZWxlY3QodGhpcykuc3R5bGUoXCJ2aXNpYmlsaXR5XCIpO1xuXHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRcdC50cmFuc2l0aW9uKClcblx0XHRcdFx0XHRcdC5kdXJhdGlvbihkdXJhdGlvbilcblx0XHRcdFx0XHRcdC5hdHRyVHdlZW4oXCJ0ZXh0LWFuY2hvclwiLCBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0XHRcdGlmIChkLmRlcHRoKVxuXHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIFwibWlkZGxlXCI7XG5cdFx0XHRcdFx0XHRcdFx0Ly9+IHJldHVybiB4KGQueCArIGQuZHggLyAyKSA+IE1hdGguUEkgPyBcImVuZFwiIDogXCJzdGFydFwiO1xuXHRcdFx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiBcIm1pZGRsZVwiO1xuXHRcdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRcdC5hdHRyVHdlZW4oXCJ0cmFuc2Zvcm1cIiwgZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdFx0dmFyIG11bHRpbGluZSA9IChkLm5hbWUgfHwgXCJcIikuc3BsaXQoXCIgXCIpLmxlbmd0aCA+IDI7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRcdFx0dmFyIG11bHRpbGluZSA9IChkLm5hbWUgfHwgXCJcIikuc3BsaXQoXCIgXCIpLmxlbmd0aCA+IDIsXG5cdFx0XHRcdFx0XHRcdFx0XHRhbmdsZUFsaWduID0gKGQueCA+IDAuNSA/IDIgOiAtMiksXG5cdFx0XHRcdFx0XHRcdFx0XHRhbmdsZSA9IHgoZC54ICsgZC5keCAvIDIpICogMTgwIC8gTWF0aC5QSSAtIDkwICsgKG11bHRpbGluZSA/IGFuZ2xlQWxpZ24gOiAwKSxcblx0XHRcdFx0XHRcdFx0XHRcdHJvdGF0ZSA9IGFuZ2xlICsgKG11bHRpbGluZSA/IC0uNSA6IDApLFxuXHRcdFx0XHRcdFx0XHRcdFx0dHJhbnNsID0gKHkoZC55KSArIGNpcmNQYWRkaW5nKSArIDM1LFxuXHRcdFx0XHRcdFx0XHRcdFx0c2VjQW5nbGUgPSAoYW5nbGUgPiA5MCA/IC0xODAgOiAwKTtcblx0XHRcdFx0XHRcdFx0XHRpZiAoZC5uYW1lID09IHNwZWNpYWwzIHx8IGQubmFtZSA9PSBzcGVjaWFsNCkgcm90YXRlICs9IDE7XG5cdFx0XHRcdFx0XHRcdFx0aWYgKGQuZGVwdGggPT0gMCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0dHJhbnNsID0gLTIuNTA7XG5cdFx0XHRcdFx0XHRcdFx0XHRyb3RhdGUgPSAwO1xuXHRcdFx0XHRcdFx0XHRcdFx0c2VjQW5nbGUgPSAwO1xuXHRcdFx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoZC5kZXB0aCA9PSAxKSB0cmFuc2wgKz0gLTk7XG5cdFx0XHRcdFx0XHRcdFx0ZWxzZSBpZiAoZC5kZXB0aCA9PSAyKSB0cmFuc2wgKz0gLTU7XG5cdFx0XHRcdFx0XHRcdFx0ZWxzZSBpZiAoZC5kZXB0aCA9PSAzKSB0cmFuc2wgKz0gNDtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gXCJyb3RhdGUoXCIgKyByb3RhdGUgKyBcIil0cmFuc2xhdGUoXCIgKyB0cmFuc2wgKyBcIilyb3RhdGUoXCIgKyBzZWNBbmdsZSArIFwiKVwiO1xuXHRcdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRcdC5zdHlsZShcImZpbGwtb3BhY2l0eVwiLCBmdW5jdGlvbiAoZSkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gaXNQYXJlbnRPZihkLCBlKSA/IDEgOiAxZS02O1xuXHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRcdC5lYWNoKFwiZW5kXCIsIGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdFx0XHRcdGQzLnNlbGVjdCh0aGlzKS5zdHlsZShcInZpc2liaWxpdHlcIiwgaXNQYXJlbnRPZihkLCBlKSA/IG51bGwgOiBcImhpZGRlblwiKTtcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cblxuXHRcdFx0XHRmdW5jdGlvbiBpc1BhcmVudE9mKHAsIGMpIHtcblx0XHRcdFx0XHRpZiAocCA9PT0gYykgcmV0dXJuIHRydWU7XG5cdFx0XHRcdFx0aWYgKHAuY2hpbGRyZW4pIHtcblx0XHRcdFx0XHRcdHJldHVybiBwLmNoaWxkcmVuLnNvbWUoZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGlzUGFyZW50T2YoZCwgYyk7XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0ZnVuY3Rpb24gc2V0Q29sb3IoZCkge1xuXHRcdFx0XHRcdHJldHVybiBkLmNvbG9yO1xuXHRcdFx0XHRcdGlmIChkLmNvbG9yKVxuXHRcdFx0XHRcdFx0cmV0dXJuIGQuY29sb3I7XG5cdFx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0XHR2YXIgdGludERlY2F5ID0gMC4yMDtcblx0XHRcdFx0XHRcdC8vIEZpbmQgY2hpbGQgbnVtYmVyXG5cdFx0XHRcdFx0XHR2YXIgeCA9IDA7XG5cdFx0XHRcdFx0XHR3aGlsZSAoZC5wYXJlbnQuY2hpbGRyZW5beF0gIT0gZClcblx0XHRcdFx0XHRcdFx0eCsrO1xuXHRcdFx0XHRcdFx0dmFyIHRpbnRDaGFuZ2UgPSAodGludERlY2F5ICogKHggKyAxKSkudG9TdHJpbmcoKTtcblx0XHRcdFx0XHRcdHJldHVybiBwdXNoZXIuY29sb3IoZC5wYXJlbnQuY29sb3IpLnRpbnQodGludENoYW5nZSkuaHRtbCgnaGV4NicpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIEludGVycG9sYXRlIHRoZSBzY2FsZXMhXG5cdFx0XHRcdGZ1bmN0aW9uIGFyY1R3ZWVuKGQpIHtcblx0XHRcdFx0XHR2YXIgbXkgPSBtYXhZKGQpLFxuXHRcdFx0XHRcdFx0eGQgPSBkMy5pbnRlcnBvbGF0ZSh4LmRvbWFpbigpLCBbZC54LCBkLnggKyBkLmR4IC0gMC4wMDA5XSksXG5cdFx0XHRcdFx0XHR5ZCA9IGQzLmludGVycG9sYXRlKHkuZG9tYWluKCksIFtkLnksIG15XSksXG5cdFx0XHRcdFx0XHR5ciA9IGQzLmludGVycG9sYXRlKHkucmFuZ2UoKSwgW2QueSA/IDIwIDogMCwgcmFkaXVzXSk7XG5cblx0XHRcdFx0XHRyZXR1cm4gZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdHJldHVybiBmdW5jdGlvbiAodCkge1xuXHRcdFx0XHRcdFx0XHR4LmRvbWFpbih4ZCh0KSk7XG5cdFx0XHRcdFx0XHRcdHkuZG9tYWluKHlkKHQpKS5yYW5nZSh5cih0KSk7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBhcmMoZCk7XG5cdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdH07XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRmdW5jdGlvbiBtYXhZKGQpIHtcblx0XHRcdFx0XHRyZXR1cm4gZC5jaGlsZHJlbiA/IE1hdGgubWF4LmFwcGx5KE1hdGgsIGQuY2hpbGRyZW4ubWFwKG1heFkpKSA6IGQueSArIGQuZHk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH0pO1xufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdTdW5idXJzdEN0cmwnLCBmdW5jdGlvbiAoJHNjb3BlKSB7XG5cblx0XHQkc2NvcGUuc2V0Q2hhcnQgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHQkc2NvcGUuY2hhcnQgPSB7XG5cdFx0XHRcdG9wdGlvbnM6IHtcblx0XHRcdFx0XHRjaGFydDoge1xuXHRcdFx0XHRcdFx0dHlwZTogJ3N1bmJ1cnN0Jyxcblx0XHRcdFx0XHRcdGhlaWdodDogNzAwLFxuXHRcdFx0XHRcdFx0XCJzdW5idXJzdFwiOiB7XG5cdFx0XHRcdFx0XHRcdFwiZGlzcGF0Y2hcIjoge30sXG5cdFx0XHRcdFx0XHRcdFwid2lkdGhcIjogbnVsbCxcblx0XHRcdFx0XHRcdFx0XCJoZWlnaHRcIjogbnVsbCxcblx0XHRcdFx0XHRcdFx0XCJtb2RlXCI6IFwic2l6ZVwiLFxuXHRcdFx0XHRcdFx0XHRcImlkXCI6IDIwODgsXG5cdFx0XHRcdFx0XHRcdFwiZHVyYXRpb25cIjogNTAwLFxuXHRcdFx0XHRcdFx0XHRcIm1hcmdpblwiOiB7XG5cdFx0XHRcdFx0XHRcdFx0XCJ0b3BcIjogMCxcblx0XHRcdFx0XHRcdFx0XHRcInJpZ2h0XCI6IDAsXG5cdFx0XHRcdFx0XHRcdFx0XCJib3R0b21cIjogMCxcblx0XHRcdFx0XHRcdFx0XHRcImxlZnRcIjogMFxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XCJ0b29sdGlwXCI6IHtcblx0XHRcdFx0XHRcdFx0XCJkdXJhdGlvblwiOiAwLFxuXHRcdFx0XHRcdFx0XHRcImdyYXZpdHlcIjogXCJ3XCIsXG5cdFx0XHRcdFx0XHRcdFwiZGlzdGFuY2VcIjogMjUsXG5cdFx0XHRcdFx0XHRcdFwic25hcERpc3RhbmNlXCI6IDAsXG5cdFx0XHRcdFx0XHRcdFwiY2xhc3Nlc1wiOiBudWxsLFxuXHRcdFx0XHRcdFx0XHRcImNoYXJ0Q29udGFpbmVyXCI6IG51bGwsXG5cdFx0XHRcdFx0XHRcdFwiZml4ZWRUb3BcIjogbnVsbCxcblx0XHRcdFx0XHRcdFx0XCJlbmFibGVkXCI6IHRydWUsXG5cdFx0XHRcdFx0XHRcdFwiaGlkZURlbGF5XCI6IDQwMCxcblx0XHRcdFx0XHRcdFx0XCJoZWFkZXJFbmFibGVkXCI6IGZhbHNlLFxuXG5cdFx0XHRcdFx0XHRcdFwib2Zmc2V0XCI6IHtcblx0XHRcdFx0XHRcdFx0XHRcImxlZnRcIjogMCxcblx0XHRcdFx0XHRcdFx0XHRcInRvcFwiOiAwXG5cdFx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRcdFwiaGlkZGVuXCI6IHRydWUsXG5cdFx0XHRcdFx0XHRcdFwiZGF0YVwiOiBudWxsLFxuXHRcdFx0XHRcdFx0XHRcInRvb2x0aXBFbGVtXCI6IG51bGwsXG5cdFx0XHRcdFx0XHRcdFwiaWRcIjogXCJudnRvb2x0aXAtOTkzNDdcIlxuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sXG5cdFx0XHRcdGRhdGE6IFtdXG5cdFx0XHR9O1xuXHRcdFx0cmV0dXJuICRzY29wZS5jaGFydDtcblx0XHR9XG5cdFx0dmFyIGJ1aWxkVHJlZSA9IGZ1bmN0aW9uIChkYXRhKSB7XG5cdFx0XHR2YXIgY2hpbGRyZW4gPSBbXTtcblx0XHRcdGFuZ3VsYXIuZm9yRWFjaChkYXRhLCBmdW5jdGlvbiAoaXRlbSkge1xuXHRcdFx0XHR2YXIgY2hpbGQgPSB7XG5cdFx0XHRcdFx0J25hbWUnOiBpdGVtLnRpdGxlLFxuXHRcdFx0XHRcdCdzaXplJzogaXRlbS5zaXplLFxuXHRcdFx0XHRcdCdjb2xvcic6IGl0ZW0uY29sb3IsXG5cdFx0XHRcdFx0J2NoaWxkcmVuJzogYnVpbGRUcmVlKGl0ZW0uY2hpbGRyZW4pXG5cdFx0XHRcdH07XG5cdFx0XHRcdGlmKGl0ZW0uY29sb3Ipe1xuXHRcdFx0XHRcdGNoaWxkLmNvbG9yID0gaXRlbS5jb2xvclxuXHRcdFx0XHR9XG5cdFx0XHRcdGlmKGl0ZW0uc2l6ZSl7XG5cdFx0XHRcdFx0Y2hpbGQuc2l6ZSA9IGl0ZW0uc2l6ZVxuXHRcdFx0XHR9XG5cdFx0XHRcdGNoaWxkcmVuLnB1c2goY2hpbGQpO1xuXHRcdFx0fSk7XG5cdFx0XHRyZXR1cm4gY2hpbGRyZW47XG5cdFx0fTtcblx0XHQkc2NvcGUuY2FsY3VsYXRlR3JhcGggPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHR2YXIgY2hhcnREYXRhID0ge1xuXHRcdFx0XHRcIm5hbWVcIjogJHNjb3BlLmRhdGEudGl0bGUsXG5cdFx0XHRcdFwiY29sb3JcIjogJHNjb3BlLmRhdGEuY29sb3IsXG5cdFx0XHRcdFwiY2hpbGRyZW5cIjogYnVpbGRUcmVlKCRzY29wZS5kYXRhLmNoaWxkcmVuKSxcblx0XHRcdFx0XCJzaXplXCI6IDFcblx0XHRcdH07XG5cdFx0XHQkc2NvcGUuY2hhcnQuZGF0YSA9IGNoYXJ0RGF0YTtcblx0XHRcdHJldHVybiBjaGFydERhdGE7XG5cdFx0fTtcblx0XHQkc2NvcGUuJHdhdGNoKCdkYXRhJywgZnVuY3Rpb24gKG4sIG8pIHtcblx0XHRcdGlmICghbikge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0XHQkc2NvcGUuY2FsY3VsYXRlR3JhcGgoKTtcblx0XHR9KVxuXHR9KTtcblxufSkoKTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
