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
	angular.module('app.directives', ['smoothScroll']);
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
			.state('app.epi.selected',{
				url: '/:item'
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
		$mdThemingProvider.theme('default')
		.primaryPalette('indigo')
		.accentPalette('grey')
		.warnPalette('red');
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
        				 color:'#cc3f16',
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
        				 color:'#036385',
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

(function(){
	"use strict";

	angular.module('app.controllers').controller('DialogsCtrl', ["$scope", "DialogService", function($scope, DialogService){
		$scope.alertDialog = function(){
			DialogService.alert('This is an alert title', 'You can specify some description text in here.');
		};

		$scope.customDialog = function(){
			DialogService.fromTemplate('add_users', $scope);
		};
	}]);

})();

(function(){
    "use strict";

    angular.module('app.controllers').controller('ElixirCtrl', function(){
        //
    });

})();

(function () {
	"use strict";

	angular.module('app.controllers').controller('EpiCtrl', ["$scope", "$rootScope", "$state", "$timeout", "smoothScroll", "IndexService", "EPI", "DataService", "leafletData", "MapService", function ($scope, $rootScope, $state, $timeout, smoothScroll, IndexService, EPI, DataService, leafletData, MapService) {

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
		$scope.details = false;
		$scope.info = false;
		$scope.closeIcon = 'close';
		$scope.compare = {
			active: false,
			countries: []
		};
		$scope.showTabContent = function (content) {
			if (content == '' && $scope.tabContent == '') {
				$scope.tabContent = 'rank';
			} else {
				$scope.tabContent = content;
			}
			$scope.toggleButton = $scope.tabContent ? 'arrow_drop_up' : 'arrow_drop_down';
		};
		$scope.epi = EPI;
		$scope.setState = function (item) {
			console.log('item');
			$scope.setCurrent(getNationByIso(item));
		};
		$scope.toggleOpen = function () {
			$scope.menueOpen = !$scope.menueOpen;
			$scope.closeIcon = $scope.menueOpen == true ? 'chevron_left' : 'chevron_right';
		}
		$scope.setCurrent = function (nat) {
			$scope.current = nat;
			$scope.setSelectedFeature();
		};
		$scope.setSelectedFeature = function (iso) {
			if ($scope.mvtSource) {
				$timeout(function () {
					$scope.mvtSource.layers.countries_big_geom.features[$scope.current.iso].selected = true;
				})
			}
		};
		$scope.getRank = function (nat) {
			return $scope.epi.indexOf(nat) + 1;
		};
		$scope.toggleInfo = function () {
			$scope.display.selectedCat = '';
			$scope.info = !$scope.info;
		};
		$scope.toggleDetails = function () {
			return $scope.details = !$scope.details;
		};
		$scope.toggleComparison = function () {
			$scope.compare.countries = [$scope.current];
			$scope.compare.active = !$scope.compare.active;
			if ($scope.compare.active) {
				$rootScope.greyed = true;
				$scope.mvtSource.options.mutexToggle = false;
				$scope.mvtSource.setStyle(invertedStyle);
				$timeout(function () {
					var element = document.getElementById('index-comparison');
					smoothScroll(element, {
						offset: 120,
						duration: 200
					});

				})
			} else {
				$rootScope.greyed = false;
				angular.forEach($scope.mvtSource.layers.countries_big_geom.features, function (feature) {
						feature.selected = false;
				});
				$scope.mvtSource.layers.countries_big_geom.features[$scope.current.iso].selected = true;
				$scope.mvtSource.options.mutexToggle = true;
				$scope.mvtSource.setStyle(countriesStyle);
				DataService.getOne('nations/bbox', [$scope.country.iso]).then(function (data) {
					$scope.bbox = data;
				});
			}
		};
		$scope.toggleCountrieList = function (country) {
			var found = false;
			angular.forEach($scope.compare.countries, function (nat, key) {
				if (country == nat && nat != $scope.current) {
					$scope.compare.countries.splice(key, 1);
					found = true;
				}
			});
			if (!found) {
				$scope.compare.countries.push(country);
			};
			var isos = [];
			angular.forEach($scope.compare.countries, function (item, key) {
				isos.push(item.iso);
			});
			DataService.getOne('nations/bbox', isos).then(function (data) {
				$scope.bbox = data;
			});
			return !found;
		};
		$scope.getOffset = function () {
			if (!$scope.current) {
				return 0;
			}
			return ($scope.current.rank == 1 ? 0 : $scope.current.rank == $scope.current.length + 1 ? $scope.current.rank : $scope.current.rank - 2) * 16;
			//return $scope.current.rank - 2 || 0;
		};
		$scope.getTendency = function () {
			if (!$scope.current) {
				return 'arrow_drop_down'
			}
			return $scope.current.percent_change > 0 ? 'arrow_drop_up' : 'arrow_drop_down';
		};

		$scope.$watch('current', function (newItem, oldItem) {
			if (newItem === oldItem) {
				return;
			}
			if (newItem.iso) {
				$state.go('app.epi.selected', {
					item: newItem.iso
				})
				$scope.mvtSource.layers.countries_big_geom.features[oldItem.iso].selected = false;
				$scope.mvtSource.options.mutexToggle = true;
				DataService.getOne('nations/bbox', [$scope.current.iso]).then(function (data) {
					$scope.bbox = data;
				});
			} else {
				$state.go('app.epi');
			}
		});
		$scope.$watch('display.selectedCat', function (n, o) {
			if (n === o) {
				return
			}
			if (n)
				updateCanvas(n.color);
			else {
				updateCanvas('rgba(128, 243, 198,1)');
			};
			$scope.mvtSource.setStyle(countriesStyle);
		});
		$scope.$on("$stateChangeSuccess", function (event, toState, toParams) {

			if (toState.name == "app.epi.selected") {
				$scope.setState(toParams.item);
				DataService.getOne('nations', toParams.item).then(function (data) {
					$scope.country = data;
					DataService.getOne('nations/bbox', [$scope.country.iso]).then(function (data) {
						$scope.bbox = data;
					});
				});
			} else {
				$scope.country = $scope.current = "";
				$scope.details = false;
			}
		});
		var getNationByName = function (name) {
			var nation = {};
			angular.forEach($scope.epi, function (nat) {
				if (nat.country == name) {
					nation = nat;
				}
			});
			return nation;
		};
		var getNationByIso = function (iso) {
			var nation = {};
			angular.forEach($scope.epi, function (nat) {
				if (nat.iso == iso) {
					nation = nat;
				}
			});
			return nation;
		};
		var createCanvas = function (colors) {
			$scope.canvas = document.createElement('canvas');
			$scope.canvas.width = 256;
			$scope.canvas.height = 10;
			$scope.ctx = $scope.canvas.getContext('2d');
			var gradient = $scope.ctx.createLinearGradient(0, 0, 256, 10);
			gradient.addColorStop(0, 'rgba(255,255,255,0)');
			gradient.addColorStop(0.53, 'rgba(128, 243, 198,1)');
			gradient.addColorStop(1, 'rgba(102,102,102,1)');
			$scope.ctx.fillStyle = gradient;
			$scope.ctx.fillRect(0, 0, 256, 10);
			$scope.palette = $scope.ctx.getImageData(0, 0, 256, 1).data;
			//document.getElementsByTagName('body')[0].appendChild($scope.canvas);
		}
		var updateCanvas = function (color) {
			var gradient = $scope.ctx.createLinearGradient(0, 0, 256, 10);
			gradient.addColorStop(0, 'rgba(255,255,255,0)');
			gradient.addColorStop(0.53, color);
			gradient.addColorStop(1, 'rgba(102,102,102,1)');
			$scope.ctx.fillStyle = gradient;
			$scope.ctx.fillRect(0, 0, 256, 10);
			$scope.palette = $scope.ctx.getImageData(0, 0, 256, 1).data;
		};
		createCanvas();
		var invertedStyle = function (feature) {
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
		var countriesStyle = function (feature) {
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
					style.color = color;
					style.outline = {
						color: color,
						size: 1
					};
					style.selected = {
						color: 'rgba(255,255,255,0.0)',
						outline: {
							color: 'rgba(0,0,0,0.3)',
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

			return style;
		};

		$scope.drawCountries = function () {
			leafletData.getMap('map').then(function (map) {
				$scope.$watch('bbox', function (n, o) {
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
					onClick: function (evt, t) {
						if (!$scope.compare.active) {
							$scope.current = getNationByIso(evt.feature.properties.adm0_a3);
						} else {
							$scope.toggleCountrieList(getNationByIso(evt.feature.properties.adm0_a3));
						}
					},
					getIDForLayerFeature: function (feature) {
						return feature.properties.adm0_a3;
					},
					filter: function (feature, context) {

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
				map.addLayer($scope.mvtSource);
				$scope.mvtSource.setOpacity(0.5);
				$scope.setSelectedFeature();
			});
		};
		$scope.drawCountries();
	}]);
})();

(function(){
    "use strict";

    angular.module('app.controllers').controller('GeneratorsCtrl', function(){
        //
    });

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


(function(){
	"use strict";

	angular.module('app.controllers').controller('JwtAuthCtrl', ["$scope", "$auth", "Restangular", function($scope, $auth, Restangular){

		var credentials = {};

		$scope.requestToken = function(){
			// Use Satellizer's $auth service to login because it'll automatically save the JWT in localStorage
			$auth.login(credentials).then(function (data){
				// If login is successful, redirect to the users state
				//$state.go('dashboard');
			});
		};

		// This request will hit the getData method in the AuthenticateController
		// on the Laravel side and will return your data that require authentication
		$scope.getData = function(){
			Restangular.all('authenticate/data').get().then(function (response){

			}, function (error){});
		};



	}]);

})();

(function(){
	"use strict";

	angular.module('app.controllers').controller('LandingCtrl', ["$scope", "$mdToast", "$mdDialog", "$interval", "ToastService", "DialogService", function($scope, $mdToast, $mdDialog, $interval, ToastService, DialogService){

		$scope.promoImage = 'https://i.imgur.com/ZbLzOPP.jpg';
		$scope.icon = 'send';

		var icons = [
				'office', 'facebook', 'twitter', 'apple', 'whatsapp', 'linkedin', 'windows', 'accessibility', 'alarm', 'aspect_ratio',
				'autorenew', 'bookmark_outline', 'dashboard', 'dns', 'favorite_outline', 'get_app', 'highlight_remove', 'history', 'list',
				'picture_in_picture', 'print', 'settings_ethernet', 'settings_power', 'shopping_cart', 'spellcheck', 'swap_horiz', 'swap_vert',
				'thumb_up', 'thumbs_up_down', 'translate', 'trending_up', 'visibility', 'warning', 'mic', 'play_circle_outline', 'repeat',
				'skip_next', 'call', 'chat', 'clear_all', 'dialpad', 'dnd_on', 'forum', 'location_on', 'vpn_key', 'filter_list', 'inbox',
				'link', 'remove_circle_outline', 'save', 'text_format', 'access_time', 'airplanemode_on', 'bluetooth', 'data_usage',
				'gps_fixed', 'now_wallpaper', 'now_widgets', 'storage', 'wifi_tethering', 'attach_file', 'format_line_spacing',
				'format_list_numbered', 'format_quote', 'vertical_align_center', 'wrap_text', 'cloud_queue', 'file_download', 'folder_open',
				'cast', 'headset', 'keyboard_backspace', 'mouse', 'speaker', 'watch', 'audiotrack', 'edit', 'brush', 'looks', 'crop_free',
				'camera', 'filter_vintage', 'hdr_strong', 'photo_camera', 'slideshow', 'timer', 'directions_bike', 'hotel', 'local_library',
				'directions_walk', 'local_cafe', 'local_pizza', 'local_florist', 'my_location', 'navigation', 'pin_drop', 'arrow_back', 'menu',
				'close', 'more_horiz', 'more_vert', 'refresh', 'phone_paused', 'vibration', 'cake', 'group', 'mood', 'person',
				'notifications_none', 'plus_one', 'school', 'share', 'star_outline'
			],
			counter = 0;

		$interval(function(){
			$scope.icon = icons[++counter];
			if (counter > 112){
				counter = 0;
			}
		}, 2000);

	}]);

})();

(function (){
    "use strict";

    angular.module('app.controllers').controller('LoginCtrl', function (){

    });

})();

(function () {
	"use strict";

	angular.module('app.controllers').controller('MapCtrl', ["$scope", "$rootScope", "$timeout", "MapService", "leafletData", "$http", function ($scope, $rootScope, $timeout, MapService, leafletData, $http) {
		//
		var apiKey = 'pk.eyJ1IjoibWFnbm9sbyIsImEiOiJuSFdUYkg4In0.5HOykKk0pNP1N3isfPQGTQ';

		/*$scope.defaults = {
			tileLayer: 'https://{s}.tiles.mapbox.com/v4/mapbox.pencil/{z}/{x}/{y}.png?access_token=' + apiKey,
			maxZoom: 14,
			detectRetina: true,
			attribution: ''
		};*/
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
					/*wms: {
													 name: 'EEUU States (WMS)',
													 type: 'wms',
													 visible: true,
													 url: 'http://suite.opengeo.org/geoserver/usa/wms',
													 layerParams: {
															 layers: 'usa:states',
															 format: 'image/png',
															 transparent: true
													 }
											 }*/
				}
			}
		});
		/*$scope.searchIP = function (ip) {
			var url = "http://freegeoip.net/json/" + ip;
			$http.get(url).success(function (res) {
				$scope.center = {
					lat: res.latitude,
					lng: res.longitude,
					zoom: 3
				}
				$scope.ip = res.ip;
			})
		};*/

		//$scope.searchIP("");
		$scope.interactivity = "";
		$scope.flag = "";
		$scope.$on('leafletDirectiveMap.utfgridMouseover', function (event, leafletEvent) {
			// the UTFGrid information is on leafletEvent.data
			$scope.interactivity = leafletEvent.data.admin;
			$scope.flag = "data:image/png;base64," + leafletEvent.data.flag_png;

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

    angular.module('app.controllers').controller('MiscCtrl', function(){
        //
    });

})();

(function(){
    "use strict";

    angular.module('app.controllers').controller('RestApiCtrl', function(){
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

	angular.module('app.controllers').controller('DashboardCtrl', function(){

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
				damper: 0.1,
				circles: null,
				borders: true,
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
									damper: 0.085
								};

							}
					});
					console.log(groups);
				};
				var create_vis = function () {
					angular.element(elem).html('');
					options.vis = d3.select(elem[0]).append("svg").attr("width", options.width).attr("height", options.height).attr("id", "svg_vis");

					if (!options.borders) {
						var pi = Math.PI;
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
							.attr("transform", "translate("+(options.width/2)+","+(options.height/2 - options.height/10)+")");
						options.arcBottom = options.vis.append("path")
							.attr("d", arcBottom)
							.attr("fill", "#006bb6")
							.attr("transform", "translate("+(options.width/2)+","+(options.height/2)+")");
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
							0
						})
						.attr("text-anchor", "middle")
						.attr('fill', '#fff')
						.text(function (d) {
							return d.unicode
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
					options.force.gravity(options.layout_gravity).charge(charge).friction(0.9).on("tick", function (e) {
						return options.circles.each(move_towards_center(e.alpha)).attr('cx', function (d) {
							return d.x;
						}).attr("cy", function (d) {
							return d.y;
						})
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
							d.x = d.x + (options.center.x - d.x) * (options.damper + 0.02) * alpha;
							d.y = d.y + (options.center.y - d.y) * (options.damper + 0.02) * alpha;
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
					content = "<span class=\"title\">" + data.name + ":</span><br/>";
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
					display_by_cat();
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
			scope: true,
			require: 'ngModel',
			link: function($scope, element, $attrs, ngModel) {
				//Fetching Options

				var options = angular.extend(defaults(), $attrs);

				//Creating the Scale
				var rotate = d3.scale.linear()
					.domain([1, options.size])
					.range([1, 0])
					.clamp(true);

				//Creating Elements
				var svg = d3.select(element[0]).append('svg')
					.attr('width', options.width)
					.attr('height', options.height)
					.append('g');
				var container = svg.append('g')
					.attr('transform', 'translate(' + options.width / 2 + ',' + options.height / 2 + ')');
				var circleBack = container.append('circle')
					.attr('r', options.width / 2 - 2)
					.attr('stroke-width', 2)
					.attr('stroke', options.color)
					.style('opacity', '0.6')
					.attr('fill', 'none');
				var arc = d3.svg.arc()
					.startAngle(0)
					.innerRadius(function(d) {
						return options.width / 2 - 4;
					})
					.outerRadius(function(d) {
						return options.width / 2;
					});
				var circleGraph = container.append('path')
					.datum({
						endAngle: 2 * Math.PI * 0
					})
					.style("fill", options.color)
					.attr('d', arc);
				var text = container.selectAll('text')
					.data([0])
					.enter()
					.append('text')
					.text(function(d) {
						return 'N°' + d;
					})
						.style("fill", options.color)
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

				//Watching if selection has changed from another UI element
				$scope.$watch(
					function() {
						return ngModel.$modelValue;
					},
					function(newValue, oldValue) {
						console.log(newValue)
						if (!newValue){
							newValue = {};
							newValue[options.field] = options.size;
						}

						$timeout(function(){
							animateIt(newValue[options.field])
						});

					});
			}
		};

	}]);

})();

(function(){
	"use strict";

	angular.module( 'app.controllers' ).controller( 'DataListingCtrl', function(){
		//
    });

})();

(function(){
	"use strict";

	angular.module('app.directives').directive( 'dataListing', function() {

		return {
			restrict: 'EA',
			templateUrl: 'views/directives/data_listing/data_listing.html',
			controller: 'DataListingCtrl',
			link: function( $scope, element, $attrs ){
				//
			}
		};

	});

})();

(function(){
	"use strict";

	angular.module('app.directives').directive( 'history', function() {
		var defaults = function(){
			return {
				field: 'score'
			}
		};
		return {
			restrict: 'E',
			templateUrl: 'views/directives/history/history.html',
			controller: 'HistoryCtrl',
			scope:{
				field:'=',
				chartdata: '=',
				color:'='
			},
			link: function( $scope, element, $attrs, ngModel){
				//
			}
		};

	});

})();

(function(){
	"use strict";

	angular.module( 'app.controllers' ).controller( 'HistoryCtrl', ["$scope", function($scope){
		//
		$scope.toggleButton = 'arrow_drop_down';
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
					y: $scope.field
				},
				title: 'Score',
				color: $scope.color
			}]
		};
		$scope.tabContent = "";
		$scope.showTabContent = function (content) {
			if (content == '' && $scope.tabContent == '') {
				$scope.tabContent = 'rank';
			} else {
				$scope.tabContent = content;
			}
			$scope.toggleButton = $scope.tabContent ? 'arrow_drop_up' : 'arrow_drop_down';
		};
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
				colors: [{
					position: 0,
					color: 'rgba(255,255,255,1)',
					opacity: 0
				}, {
					position: 53,
					color: 'rgba(128, 243, 198,1)',
					opacity: 1
				}, {
					position: 100,
					color: 'rgba(102,102,102,1)',
					opacity: 1
				}]
			};
		}
		return {
			restrict: 'E',
			scope: {
				data: '='
			},
			require: 'ngModel',
			link: function ($scope, element, $attrs, ngModel) {

				var options = angular.extend(defaults(), $attrs);
				//console.log(options.color);
				if(options.color){
					options.colors[1].color = options.color;
				}
				element.css('height', options.height + 'px').css('border-radius', options.height / 2 + 'px');
				var x = d3.scale.linear()
					.domain([0, 100])
					.range([20, options.width - options.margin.left])
					.clamp(true);

				var brush = d3.svg.brush()
					.x(x)
					.extent([0, 0])
					.on("brush", brush)
					.on("brushend", brushed);

				var svg = d3.select(element[0]).append("svg")
					.attr("width", options.width)
					.attr("height", options.height + options.margin.top + options.margin.bottom)
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
				svg.append('svg:rect')
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
				}



				if (options.info === true) {
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
					ngModel.$setViewValue(final);
					ngModel.$render();
				}

				$scope.$watch(
					function () {
						return ngModel.$modelValue;
					},
					function (newValue, oldValue) {
						//console.log(newValue);
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

	angular.module('app.directives').directive( 'simplelinechart', function() {

		return {
			restrict: 'E',
			scope:{
				data:'=',
				selection:'='
			},
			templateUrl: 'views/directives/simplelinechart/simplelinechart.html',
			controller: 'SimplelinechartCtrl',
			link: function( $scope, element, $attrs ){
				$scope.options = $attrs;
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
	},

	$scope.chart = {
		options:{
			chart:{}
		},
		data:[]
	};
		$scope.setChart = function () {
			$scope.chart.options.chart =  {
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
						showLegend:false,
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
			if($scope.options.invert == "true"){
				$scope.chart.options.chart.yDomain = [parseInt($scope.range.max),$scope.range.min];
			}
			return $scope.chart;
		}
		$scope.calculateGraph = function () {
			var chartData = [];
			$scope.range = {
				max:0,
				min:1000
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
			if($scope.options.invert == "true"){
				$scope.chart.options.chart.yDomain = [parseInt($scope.range.max),$scope.range.min];
			}
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
			scope: {
				country: '=',
				selected: '=',
				data: '='
			},
			controller: 'SubindexCtrl',
			templateUrl: 'views/directives/subindex/subindex.html',
			link: subindexLinkFunction
		};

		function subindexLinkFunction($scope, element, $attrs) {
			console.log($scope.selected);
			$scope.gotoBox = gotoBox;
					$scope.gotoBox();
			function gotoBox(){
				$timeout(function(){
						smoothScroll(element[0], {offset:120, duration:250});
				});
			}
		}
	}
})();

(function(){
	"use strict";

	angular.module( 'app.controllers' ).controller( 'SubindexCtrl', ["$scope", "$filter", "$timeout", "smoothScroll", function($scope, $filter, $timeout, smoothScroll){
		$scope.info = false;
		$scope.setChart = setChart;
		$scope.calculateGraph = calculateGraph;
		$scope.createIndexer = createIndexer;
		$scope.calcSubRank = calcSubRank;
		$scope.toggleInfo = toggleInfo;

		activate();

		function activate(){
			$scope.calcSubRank();
			$scope.setChart();
			$scope.calculateGraph();
			$scope.createIndexer();
			$scope.$watch('selected', function (newItem, oldItem) {
				if (newItem === oldItem) {
					return false;
				}
				$scope.calculateGraph();
				$scope.gotoBox();

			});
			$scope.$watch('country', function(n, o){
				if(n === o){
					return;
				}
				$scope.calcSubRank();
			})
		}
		function toggleInfo(){
			$scope.info = !$scope.info;
		};
		function calcSubRank(){
				var rank = 0;
				angular.forEach($scope.data, function(item){
					item[$scope.selected.type] = parseFloat(item[$scope.selected.type]);
					item['score'] = parseInt(item['score']);
				})
				var filter = $filter('orderBy')($scope.data, [$scope.selected.type,"score"] , true);
				for(var i = 0;i < filter.length; i++){
					if(filter[i].iso == $scope.country.iso){
						rank = i+1;
					}
				}
				$scope.country.rank = rank;
		}
		function createIndexer(){
		 	$scope.indexer = [$scope.selected.data];
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
						x: function (d) {
							return d.x;
						},
						y: function (d) {
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
						legend:{
							rightAlign:false,
							margin:{
								bottom:30
							}
						},
						lines:{
							interpolate:'cardinal'
						}
					}
				},
				data: []
			};
			return $scope.chart;
		}

		function calculateGraph() {

			var chartData = [];
			angular.forEach($scope.selected.data.children, function (item, key) {
				var graph = {
					key: item.title,
					color: item.color,
					values: []
				};
				angular.forEach($scope.country.epi, function (data) {
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9tYWluLmpzIiwiYXBwL3JvdXRlcy5qcyIsImFwcC9yb3V0ZXMucnVuLmpzIiwiY29uZmlnL2F1dGguanMiLCJjb25maWcvbG9hZGluZ19iYXIuanMiLCJjb25maWcvcmVzdGFuZ3VsYXIuanMiLCJjb25maWcvdGhlbWUuanMiLCJmaWx0ZXJzL2NhcGl0YWxpemUuanMiLCJmaWx0ZXJzL2h1bWFuX3JlYWRhYmxlLmpzIiwiZmlsdGVycy90cnVzdF9odG1sLmpzIiwiZmlsdGVycy91Y2ZpcnN0LmpzIiwic2VydmljZXMvRGF0YVNlcnZpY2UuanMiLCJzZXJ2aWNlcy9JbmRleC5qcyIsInNlcnZpY2VzL01hcC5qcyIsInNlcnZpY2VzL2RpYWxvZy5qcyIsInNlcnZpY2VzL3RvYXN0LmpzIiwiYXBwL2RpYWxvZ3MvZGlhbG9ncy5qcyIsImFwcC9lbGl4aXIvZWxpeGlyLmpzIiwiYXBwL2VwaS9lcGkuanMiLCJhcHAvZ2VuZXJhdG9ycy9nZW5lcmF0b3JzLmpzIiwiYXBwL2hlYWRlci9oZWFkZXIuanMiLCJhcHAvaW1wb3J0Y3N2L2ltcG9ydGNzdi5qcyIsImFwcC9qd3RfYXV0aC9qd3RfYXV0aC5qcyIsImFwcC9sYW5kaW5nL2xhbmRpbmcuanMiLCJhcHAvbG9naW4vbG9naW4uanMiLCJhcHAvbWFwL21hcC5qcyIsImFwcC9taXNjL21pc2MuanMiLCJhcHAvcmVzdF9hcGkvcmVzdF9hcGkuanMiLCJhcHAvc2lkZWJhci9zaWRlYmFyLmpzIiwiYXBwL3RhYnMvdGFicy5qcyIsImFwcC90b2FzdHMvdG9hc3RzLmpzIiwiYXBwL3Vuc3VwcG9ydGVkX2Jyb3dzZXIvdW5zdXBwb3J0ZWRfYnJvd3Nlci5qcyIsImRpcmVjdGl2ZXMvYnViYmxlcy9idWJibGVzLmpzIiwiZGlyZWN0aXZlcy9idWJibGVzL2RlZmluaXRpb24uanMiLCJkaXJlY3RpdmVzL2NpcmNsZWdyYXBoL2NpcmNsZWdyYXBoLmpzIiwiZGlyZWN0aXZlcy9jaXJjbGVncmFwaC9kZWZpbml0aW9uLmpzIiwiZGlyZWN0aXZlcy9kYXRhX2xpc3RpbmcvZGF0YV9saXN0aW5nLmpzIiwiZGlyZWN0aXZlcy9kYXRhX2xpc3RpbmcvZGVmaW5pdGlvbi5qcyIsImRpcmVjdGl2ZXMvaGlzdG9yeS9kZWZpbml0aW9uLmpzIiwiZGlyZWN0aXZlcy9oaXN0b3J5L2hpc3RvcnkuanMiLCJkaXJlY3RpdmVzL21lZGlhbi9kZWZpbml0aW9uLmpzIiwiZGlyZWN0aXZlcy9tZWRpYW4vbWVkaWFuLmpzIiwiZGlyZWN0aXZlcy9zaW1wbGVsaW5lY2hhcnQvZGVmaW5pdGlvbi5qcyIsImRpcmVjdGl2ZXMvc2ltcGxlbGluZWNoYXJ0L3NpbXBsZWxpbmVjaGFydC5qcyIsImRpcmVjdGl2ZXMvc2xpZGVUb2dnbGUvZGVmaW5pdGlvbi5qcyIsImRpcmVjdGl2ZXMvc2xpZGVUb2dnbGUvc2xpZGVUb2dnbGUuanMiLCJkaXJlY3RpdmVzL3N1YmluZGV4L2RlZmluaXRpb24uanMiLCJkaXJlY3RpdmVzL3N1YmluZGV4L3N1YmluZGV4LmpzIiwiZGlyZWN0aXZlcy9zdW5idXJzdC9kZWZpbml0aW9uLmpzIiwiZGlyZWN0aXZlcy9zdW5idXJzdC9zdW5idXJzdC5qcyIsImRpYWxvZ3MvYWRkX3VzZXJzL2FkZF91c2Vycy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxJQUFBLE1BQUEsUUFBQSxPQUFBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7Ozs7Q0FJQSxRQUFBLE9BQUEsY0FBQSxDQUFBLGFBQUEsYUFBQTtDQUNBLFFBQUEsT0FBQSxtQkFBQSxDQUFBLGVBQUEsYUFBQSxjQUFBLGFBQUEsZUFBQSxhQUFBLHVCQUFBLGNBQUEsY0FBQSxvQkFBQSxRQUFBLGNBQUE7Q0FDQSxRQUFBLE9BQUEsZUFBQTtDQUNBLFFBQUEsT0FBQSxnQkFBQSxDQUFBLGFBQUEsYUFBQTtDQUNBLFFBQUEsT0FBQSxrQkFBQSxDQUFBO0NBQ0EsUUFBQSxPQUFBLGNBQUE7Ozs7QUNuQkEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGNBQUEsZ0RBQUEsU0FBQSxnQkFBQSxtQkFBQTs7RUFFQSxJQUFBLFVBQUEsU0FBQSxTQUFBO0dBQ0EsT0FBQSxnQkFBQSxXQUFBLE1BQUEsV0FBQTs7O0VBR0EsbUJBQUEsVUFBQTs7RUFFQTtJQUNBLE1BQUEsT0FBQTtJQUNBLFVBQUE7SUFDQSxPQUFBOzs7O0tBSUEsUUFBQTtNQUNBLGFBQUEsUUFBQTs7S0FFQSxNQUFBOzs7SUFHQSxNQUFBLFdBQUE7SUFDQSxLQUFBO0lBQ0EsT0FBQTtLQUNBLFNBQUE7TUFDQSxhQUFBLFFBQUE7TUFDQSxZQUFBO01BQ0EsUUFBQTtPQUNBLHFCQUFBLFNBQUEsWUFBQTtRQUNBLE9BQUEsWUFBQSxPQUFBOzs7O0tBSUEsT0FBQTtNQUNBLGFBQUEsUUFBQTs7OztJQUlBLE1BQUEsbUJBQUE7SUFDQSxLQUFBOztJQUVBLE1BQUEsaUJBQUE7SUFDQSxLQUFBO0lBQ0EsTUFBQSxDQUFBLFVBQUE7SUFDQSxPQUFBO0tBQ0EsU0FBQTtNQUNBLGFBQUEsUUFBQTs7S0FFQSxNQUFBOzs7Ozs7Ozs7QUNuREEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGNBQUEsbUJBQUEsU0FBQSxXQUFBO0VBQ0EsV0FBQSxJQUFBLHFCQUFBLFNBQUEsT0FBQSxRQUFBO0dBQ0EsSUFBQSxRQUFBLFFBQUEsUUFBQSxLQUFBLFNBQUE7SUFDQSxXQUFBLGVBQUEsUUFBQSxLQUFBOztJQUVBLFdBQUEsaUJBQUE7O0VBRUEsV0FBQSxJQUFBLHVCQUFBLFNBQUEsT0FBQSxRQUFBO0lBQ0EsV0FBQSxpQkFBQTs7Ozs7O0FDWEEsQ0FBQSxXQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLGNBQUEseUJBQUEsVUFBQSxjQUFBOzs7UUFHQSxjQUFBLFdBQUE7Ozs7O0FDTkEsQ0FBQSxXQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGNBQUEsaUNBQUEsVUFBQSxzQkFBQTtFQUNBLHNCQUFBLGlCQUFBOzs7OztBQ0pBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxjQUFBLGdDQUFBLFNBQUEscUJBQUE7RUFDQTtHQUNBLFdBQUE7Ozs7O0FDTEEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGNBQUEsOEJBQUEsU0FBQSxvQkFBQTs7RUFFQSxtQkFBQSxNQUFBO0dBQ0EsZUFBQTtHQUNBLGNBQUE7R0FDQSxZQUFBOzs7OztBQ1JBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxlQUFBLFFBQUEsY0FBQSxVQUFBO0VBQ0EsT0FBQSxTQUFBLE9BQUEsS0FBQTtHQUNBLE9BQUEsQ0FBQSxDQUFBLENBQUEsU0FBQSxNQUFBLFFBQUEsc0JBQUEsU0FBQSxJQUFBO0lBQ0EsT0FBQSxJQUFBLE9BQUEsR0FBQSxnQkFBQSxJQUFBLE9BQUEsR0FBQTtRQUNBOzs7OztBQ1BBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxlQUFBLFFBQUEsaUJBQUEsVUFBQTtFQUNBLE9BQUEsU0FBQSxTQUFBLEtBQUE7R0FDQSxLQUFBLENBQUEsS0FBQTtJQUNBLE9BQUE7O0dBRUEsSUFBQSxRQUFBLElBQUEsTUFBQTtHQUNBLEtBQUEsSUFBQSxFQUFBLEdBQUEsRUFBQSxNQUFBLFFBQUEsS0FBQTtJQUNBLE1BQUEsS0FBQSxNQUFBLEdBQUEsT0FBQSxHQUFBLGdCQUFBLE1BQUEsR0FBQSxNQUFBOztHQUVBLE9BQUEsTUFBQSxLQUFBOzs7O0FDWkEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGVBQUEsUUFBQSxzQkFBQSxVQUFBLE1BQUE7RUFDQSxPQUFBLFVBQUEsTUFBQTtHQUNBLE9BQUEsS0FBQSxZQUFBOzs7O0FDTEEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGVBQUEsT0FBQSxXQUFBLFdBQUE7RUFDQSxPQUFBLFVBQUEsUUFBQTtHQUNBLEtBQUEsQ0FBQSxPQUFBO0lBQ0EsT0FBQTs7R0FFQSxPQUFBLE1BQUEsVUFBQSxHQUFBLEdBQUEsZ0JBQUEsTUFBQSxVQUFBOzs7Ozs7QUNSQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsZ0JBQUEsUUFBQSxlQUFBO0lBQ0EsWUFBQSxVQUFBLENBQUE7O0lBRUEsU0FBQSxZQUFBLFlBQUE7UUFDQSxPQUFBO1VBQ0EsUUFBQTtVQUNBLFFBQUE7OztRQUdBLFNBQUEsT0FBQSxNQUFBO1VBQ0EsSUFBQSxPQUFBLFlBQUEsSUFBQSxPQUFBO1lBQ0EsS0FBQSxLQUFBLFVBQUEsSUFBQSxVQUFBO2NBQ0EsTUFBQTs7WUFFQSxPQUFBOztRQUVBLFNBQUEsT0FBQSxPQUFBLEdBQUE7VUFDQSxPQUFBLFlBQUEsSUFBQSxPQUFBLElBQUE7Ozs7OztBQ3BCQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsZ0JBQUEsUUFBQSxnQkFBQSxVQUFBO1FBQ0EsT0FBQTtVQUNBLFFBQUEsVUFBQTtZQUNBLE9BQUE7WUFDQSxLQUFBO2VBQ0EsT0FBQTtZQUNBLFdBQUE7WUFDQSxPQUFBO1lBQ0EsY0FBQTtZQUNBLFdBQUE7WUFDQSxrQkFBQTtZQUNBLG1CQUFBO1lBQ0EsYUFBQTtZQUNBLG9CQUFBO1lBQ0EscUJBQUE7ZUFDQSxPQUFBO2VBQ0EsS0FBQTtlQUNBLGFBQUE7ZUFDQSxTQUFBO2VBQ0EsU0FBQSxDQUFBO2FBQ0EsYUFBQTthQUNBLE9BQUE7YUFDQSxNQUFBLENBQUEsR0FBQTthQUNBLEtBQUE7YUFDQSxNQUFBO2FBQ0EsU0FBQSxDQUFBO2NBQ0EsWUFBQTtjQUNBLE1BQUE7Y0FDQSxNQUFBO2NBQ0EsU0FBQTtjQUNBLE9BQUE7Y0FDQSxTQUFBLENBQUE7ZUFDQSxhQUFBO2VBQ0EsTUFBQTtxQkFDQSxLQUFBO2VBQ0EsS0FBQTtlQUNBLE1BQUE7ZUFDQSxZQUFBOztlQUVBO2NBQ0EsWUFBQTtjQUNBLE1BQUE7Y0FDQSxPQUFBO2NBQ0EsTUFBQTtjQUNBLFNBQUE7Y0FDQSxTQUFBLENBQUE7ZUFDQSxhQUFBO2VBQ0EsTUFBQTtxQkFDQSxLQUFBO2VBQ0EsS0FBQTtlQUNBLE1BQUE7ZUFDQSxZQUFBO2dCQUNBO2VBQ0EsYUFBQTtlQUNBLE1BQUE7cUJBQ0EsS0FBQTtlQUNBLEtBQUE7ZUFDQSxNQUFBO2VBQ0EsWUFBQTtnQkFDQTtlQUNBLGFBQUE7ZUFDQSxNQUFBO3FCQUNBLEtBQUE7ZUFDQSxLQUFBO2VBQ0EsTUFBQTtlQUNBLFlBQUE7O2VBRUE7Y0FDQSxZQUFBO2NBQ0EsTUFBQTtjQUNBLE9BQUE7Y0FDQSxNQUFBO2NBQ0EsU0FBQTtjQUNBLFNBQUEsQ0FBQTtjQUNBLGFBQUE7Y0FDQSxNQUFBO29CQUNBLEtBQUE7Y0FDQSxLQUFBO2NBQ0EsTUFBQTtjQUNBLFlBQUE7ZUFDQTtjQUNBLGFBQUE7Y0FDQSxNQUFBO29CQUNBLEtBQUE7Y0FDQSxLQUFBO2NBQ0EsTUFBQTtjQUNBLFlBQUE7OztjQUdBO2FBQ0EsYUFBQTthQUNBLE9BQUE7YUFDQSxNQUFBLENBQUEsR0FBQTthQUNBLEtBQUE7YUFDQSxNQUFBO2FBQ0EsU0FBQSxDQUFBO2NBQ0EsWUFBQTtjQUNBLE1BQUE7Y0FDQSxPQUFBO2NBQ0EsTUFBQTtjQUNBLFNBQUE7Y0FDQSxTQUFBLENBQUE7ZUFDQSxhQUFBO2VBQ0EsTUFBQTtxQkFDQSxLQUFBO2VBQ0EsS0FBQTtlQUNBLE1BQUE7ZUFDQSxZQUFBOztlQUVBO2NBQ0EsWUFBQTtjQUNBLE1BQUE7Y0FDQSxPQUFBO2NBQ0EsTUFBQTtjQUNBLFNBQUE7Y0FDQSxTQUFBLENBQUE7ZUFDQSxhQUFBO2VBQ0EsTUFBQTtxQkFDQSxLQUFBO2VBQ0EsS0FBQTtlQUNBLE1BQUE7ZUFDQSxZQUFBO2dCQUNBO2VBQ0EsYUFBQTtlQUNBLE1BQUE7cUJBQ0EsS0FBQTtlQUNBLEtBQUE7ZUFDQSxNQUFBO2VBQ0EsWUFBQTs7ZUFFQTtjQUNBLFlBQUE7Y0FDQSxNQUFBO2NBQ0EsT0FBQTtjQUNBLE1BQUE7Y0FDQSxTQUFBO2NBQ0EsU0FBQSxDQUFBO2VBQ0EsYUFBQTtlQUNBLE1BQUE7cUJBQ0EsS0FBQTtlQUNBLEtBQUE7ZUFDQSxNQUFBO2VBQ0EsWUFBQTs7ZUFFQTtjQUNBLFlBQUE7Y0FDQSxNQUFBO2NBQ0EsT0FBQTtjQUNBLE1BQUE7Y0FDQSxTQUFBO2NBQ0EsU0FBQSxDQUFBO2VBQ0EsYUFBQTtlQUNBLE1BQUE7cUJBQ0EsS0FBQTtlQUNBLEtBQUE7ZUFDQSxNQUFBO2VBQ0EsWUFBQTtnQkFDQTtlQUNBLGFBQUE7ZUFDQSxNQUFBO3FCQUNBLEtBQUE7ZUFDQSxLQUFBO2VBQ0EsTUFBQTtlQUNBLFlBQUE7O2VBRUE7Y0FDQSxZQUFBO2NBQ0EsTUFBQTtjQUNBLE9BQUE7Y0FDQSxNQUFBO2NBQ0EsU0FBQTtjQUNBLFNBQUEsQ0FBQTtlQUNBLGFBQUE7ZUFDQSxNQUFBO3FCQUNBLEtBQUE7ZUFDQSxLQUFBO2VBQ0EsTUFBQTtlQUNBLFlBQUE7Z0JBQ0E7ZUFDQSxhQUFBO2VBQ0EsTUFBQTtxQkFDQSxLQUFBO2VBQ0EsS0FBQTtlQUNBLE1BQUE7ZUFDQSxZQUFBO2dCQUNBO2VBQ0EsYUFBQTtlQUNBLE1BQUE7cUJBQ0EsS0FBQTtlQUNBLEtBQUE7ZUFDQSxNQUFBO2VBQ0EsWUFBQTtnQkFDQTtlQUNBLGFBQUE7ZUFDQSxNQUFBO3FCQUNBLEtBQUE7ZUFDQSxLQUFBO2VBQ0EsTUFBQTtlQUNBLFlBQUE7O2VBRUE7Y0FDQSxZQUFBO2NBQ0EsTUFBQTtjQUNBLE9BQUE7Y0FDQSxNQUFBO2NBQ0EsU0FBQTtjQUNBLFNBQUEsQ0FBQTtlQUNBLGFBQUE7ZUFDQSxNQUFBO3FCQUNBLEtBQUE7ZUFDQSxLQUFBO2VBQ0EsTUFBQTtlQUNBLFlBQUE7Z0JBQ0E7ZUFDQSxhQUFBO2VBQ0EsTUFBQTtxQkFDQSxLQUFBO2VBQ0EsS0FBQTtlQUNBLE1BQUE7ZUFDQSxZQUFBO2dCQUNBO2VBQ0EsYUFBQTtlQUNBLE1BQUE7cUJBQ0EsS0FBQTtlQUNBLEtBQUE7ZUFDQSxNQUFBO2VBQ0EsWUFBQTs7Ozs7Ozs7Ozs7QUNyT0EsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLGdCQUFBLFFBQUEsOEJBQUEsU0FBQSxZQUFBOztRQUVBLElBQUEsVUFBQTtRQUNBLE9BQUE7VUFDQSxnQkFBQSxTQUFBLEtBQUE7WUFDQSxVQUFBOztVQUVBLGdCQUFBLFVBQUE7WUFDQSxPQUFBOzs7Ozs7O0FDWEEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGdCQUFBLFFBQUEsK0JBQUEsU0FBQSxVQUFBOztFQUVBLE9BQUE7R0FDQSxjQUFBLFNBQUEsVUFBQSxPQUFBOztJQUVBLElBQUEsVUFBQTtLQUNBLGFBQUEsb0JBQUEsV0FBQSxNQUFBLFdBQUE7OztJQUdBLElBQUEsT0FBQTtLQUNBLFFBQUEsUUFBQSxPQUFBOzs7SUFHQSxPQUFBLFVBQUEsS0FBQTs7O0dBR0EsTUFBQSxVQUFBO0lBQ0EsT0FBQSxVQUFBOzs7R0FHQSxPQUFBLFNBQUEsT0FBQSxRQUFBO0lBQ0EsVUFBQTtLQUNBLFVBQUE7T0FDQSxNQUFBO09BQ0EsUUFBQTtPQUNBLEdBQUE7Ozs7OztBQzVCQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsZ0JBQUEsUUFBQSw2QkFBQSxTQUFBLFNBQUE7O0VBRUEsSUFBQSxRQUFBO0dBQ0EsV0FBQTtHQUNBLFNBQUE7O0VBRUEsT0FBQTtHQUNBLE1BQUEsU0FBQSxRQUFBO0lBQ0EsSUFBQSxDQUFBLFFBQUE7S0FDQSxPQUFBOzs7SUFHQSxPQUFBLFNBQUE7S0FDQSxTQUFBO09BQ0EsUUFBQTtPQUNBLFNBQUE7T0FDQSxPQUFBO09BQ0EsVUFBQTs7O0dBR0EsT0FBQSxTQUFBLFFBQUE7SUFDQSxJQUFBLENBQUEsUUFBQTtLQUNBLE9BQUE7OztJQUdBLE9BQUEsU0FBQTtLQUNBLFNBQUE7T0FDQSxRQUFBO09BQ0EsU0FBQTtPQUNBLE1BQUE7T0FDQSxPQUFBO09BQ0EsVUFBQTs7Ozs7OztBQ2xDQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSwyQ0FBQSxTQUFBLFFBQUEsY0FBQTtFQUNBLE9BQUEsY0FBQSxVQUFBO0dBQ0EsY0FBQSxNQUFBLDBCQUFBOzs7RUFHQSxPQUFBLGVBQUEsVUFBQTtHQUNBLGNBQUEsYUFBQSxhQUFBOzs7Ozs7QUNUQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSxjQUFBLFVBQUE7Ozs7OztBQ0hBLENBQUEsWUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLDZJQUFBLFVBQUEsUUFBQSxZQUFBLFFBQUEsVUFBQSxjQUFBLGNBQUEsS0FBQSxhQUFBLGFBQUEsWUFBQTs7RUFFQSxPQUFBLFVBQUE7RUFDQSxPQUFBLFVBQUE7R0FDQSxhQUFBO0dBQ0EsTUFBQSxDQUFBO0lBQ0EsUUFBQTtLQUNBLEdBQUE7S0FDQSxHQUFBOztJQUVBLE9BQUE7SUFDQSxPQUFBOztHQUVBLE9BQUEsQ0FBQTtJQUNBLFFBQUE7S0FDQSxHQUFBO0tBQ0EsR0FBQTs7SUFFQSxPQUFBO0lBQ0EsT0FBQTs7O0VBR0EsT0FBQSxhQUFBO0VBQ0EsT0FBQSxlQUFBO0VBQ0EsT0FBQSxZQUFBLGFBQUE7RUFDQSxPQUFBLE1BQUE7RUFDQSxPQUFBLFlBQUE7RUFDQSxPQUFBLFVBQUE7RUFDQSxPQUFBLE9BQUE7RUFDQSxPQUFBLFlBQUE7RUFDQSxPQUFBLFVBQUE7R0FDQSxRQUFBO0dBQ0EsV0FBQTs7RUFFQSxPQUFBLGlCQUFBLFVBQUEsU0FBQTtHQUNBLElBQUEsV0FBQSxNQUFBLE9BQUEsY0FBQSxJQUFBO0lBQ0EsT0FBQSxhQUFBO1VBQ0E7SUFDQSxPQUFBLGFBQUE7O0dBRUEsT0FBQSxlQUFBLE9BQUEsYUFBQSxrQkFBQTs7RUFFQSxPQUFBLE1BQUE7RUFDQSxPQUFBLFdBQUEsVUFBQSxNQUFBO0dBQ0EsUUFBQSxJQUFBO0dBQ0EsT0FBQSxXQUFBLGVBQUE7O0VBRUEsT0FBQSxhQUFBLFlBQUE7R0FDQSxPQUFBLFlBQUEsQ0FBQSxPQUFBO0dBQ0EsT0FBQSxZQUFBLE9BQUEsYUFBQSxPQUFBLGlCQUFBOztFQUVBLE9BQUEsYUFBQSxVQUFBLEtBQUE7R0FDQSxPQUFBLFVBQUE7R0FDQSxPQUFBOztFQUVBLE9BQUEscUJBQUEsVUFBQSxLQUFBO0dBQ0EsSUFBQSxPQUFBLFdBQUE7SUFDQSxTQUFBLFlBQUE7S0FDQSxPQUFBLFVBQUEsT0FBQSxtQkFBQSxTQUFBLE9BQUEsUUFBQSxLQUFBLFdBQUE7Ozs7RUFJQSxPQUFBLFVBQUEsVUFBQSxLQUFBO0dBQ0EsT0FBQSxPQUFBLElBQUEsUUFBQSxPQUFBOztFQUVBLE9BQUEsYUFBQSxZQUFBO0dBQ0EsT0FBQSxRQUFBLGNBQUE7R0FDQSxPQUFBLE9BQUEsQ0FBQSxPQUFBOztFQUVBLE9BQUEsZ0JBQUEsWUFBQTtHQUNBLE9BQUEsT0FBQSxVQUFBLENBQUEsT0FBQTs7RUFFQSxPQUFBLG1CQUFBLFlBQUE7R0FDQSxPQUFBLFFBQUEsWUFBQSxDQUFBLE9BQUE7R0FDQSxPQUFBLFFBQUEsU0FBQSxDQUFBLE9BQUEsUUFBQTtHQUNBLElBQUEsT0FBQSxRQUFBLFFBQUE7SUFDQSxXQUFBLFNBQUE7SUFDQSxPQUFBLFVBQUEsUUFBQSxjQUFBO0lBQ0EsT0FBQSxVQUFBLFNBQUE7SUFDQSxTQUFBLFlBQUE7S0FDQSxJQUFBLFVBQUEsU0FBQSxlQUFBO0tBQ0EsYUFBQSxTQUFBO01BQ0EsUUFBQTtNQUNBLFVBQUE7Ozs7VUFJQTtJQUNBLFdBQUEsU0FBQTtJQUNBLFFBQUEsUUFBQSxPQUFBLFVBQUEsT0FBQSxtQkFBQSxVQUFBLFVBQUEsU0FBQTtNQUNBLFFBQUEsV0FBQTs7SUFFQSxPQUFBLFVBQUEsT0FBQSxtQkFBQSxTQUFBLE9BQUEsUUFBQSxLQUFBLFdBQUE7SUFDQSxPQUFBLFVBQUEsUUFBQSxjQUFBO0lBQ0EsT0FBQSxVQUFBLFNBQUE7SUFDQSxZQUFBLE9BQUEsZ0JBQUEsQ0FBQSxPQUFBLFFBQUEsTUFBQSxLQUFBLFVBQUEsTUFBQTtLQUNBLE9BQUEsT0FBQTs7OztFQUlBLE9BQUEscUJBQUEsVUFBQSxTQUFBO0dBQ0EsSUFBQSxRQUFBO0dBQ0EsUUFBQSxRQUFBLE9BQUEsUUFBQSxXQUFBLFVBQUEsS0FBQSxLQUFBO0lBQ0EsSUFBQSxXQUFBLE9BQUEsT0FBQSxPQUFBLFNBQUE7S0FDQSxPQUFBLFFBQUEsVUFBQSxPQUFBLEtBQUE7S0FDQSxRQUFBOzs7R0FHQSxJQUFBLENBQUEsT0FBQTtJQUNBLE9BQUEsUUFBQSxVQUFBLEtBQUE7SUFDQTtHQUNBLElBQUEsT0FBQTtHQUNBLFFBQUEsUUFBQSxPQUFBLFFBQUEsV0FBQSxVQUFBLE1BQUEsS0FBQTtJQUNBLEtBQUEsS0FBQSxLQUFBOztHQUVBLFlBQUEsT0FBQSxnQkFBQSxNQUFBLEtBQUEsVUFBQSxNQUFBO0lBQ0EsT0FBQSxPQUFBOztHQUVBLE9BQUEsQ0FBQTs7RUFFQSxPQUFBLFlBQUEsWUFBQTtHQUNBLElBQUEsQ0FBQSxPQUFBLFNBQUE7SUFDQSxPQUFBOztHQUVBLE9BQUEsQ0FBQSxPQUFBLFFBQUEsUUFBQSxJQUFBLElBQUEsT0FBQSxRQUFBLFFBQUEsT0FBQSxRQUFBLFNBQUEsSUFBQSxPQUFBLFFBQUEsT0FBQSxPQUFBLFFBQUEsT0FBQSxLQUFBOzs7RUFHQSxPQUFBLGNBQUEsWUFBQTtHQUNBLElBQUEsQ0FBQSxPQUFBLFNBQUE7SUFDQSxPQUFBOztHQUVBLE9BQUEsT0FBQSxRQUFBLGlCQUFBLElBQUEsa0JBQUE7OztFQUdBLE9BQUEsT0FBQSxXQUFBLFVBQUEsU0FBQSxTQUFBO0dBQ0EsSUFBQSxZQUFBLFNBQUE7SUFDQTs7R0FFQSxJQUFBLFFBQUEsS0FBQTtJQUNBLE9BQUEsR0FBQSxvQkFBQTtLQUNBLE1BQUEsUUFBQTs7SUFFQSxPQUFBLFVBQUEsT0FBQSxtQkFBQSxTQUFBLFFBQUEsS0FBQSxXQUFBO0lBQ0EsT0FBQSxVQUFBLFFBQUEsY0FBQTtJQUNBLFlBQUEsT0FBQSxnQkFBQSxDQUFBLE9BQUEsUUFBQSxNQUFBLEtBQUEsVUFBQSxNQUFBO0tBQ0EsT0FBQSxPQUFBOztVQUVBO0lBQ0EsT0FBQSxHQUFBOzs7RUFHQSxPQUFBLE9BQUEsdUJBQUEsVUFBQSxHQUFBLEdBQUE7R0FDQSxJQUFBLE1BQUEsR0FBQTtJQUNBOztHQUVBLElBQUE7SUFDQSxhQUFBLEVBQUE7UUFDQTtJQUNBLGFBQUE7SUFDQTtHQUNBLE9BQUEsVUFBQSxTQUFBOztFQUVBLE9BQUEsSUFBQSx1QkFBQSxVQUFBLE9BQUEsU0FBQSxVQUFBOztHQUVBLElBQUEsUUFBQSxRQUFBLG9CQUFBO0lBQ0EsT0FBQSxTQUFBLFNBQUE7SUFDQSxZQUFBLE9BQUEsV0FBQSxTQUFBLE1BQUEsS0FBQSxVQUFBLE1BQUE7S0FDQSxPQUFBLFVBQUE7S0FDQSxZQUFBLE9BQUEsZ0JBQUEsQ0FBQSxPQUFBLFFBQUEsTUFBQSxLQUFBLFVBQUEsTUFBQTtNQUNBLE9BQUEsT0FBQTs7O1VBR0E7SUFDQSxPQUFBLFVBQUEsT0FBQSxVQUFBO0lBQ0EsT0FBQSxVQUFBOzs7RUFHQSxJQUFBLGtCQUFBLFVBQUEsTUFBQTtHQUNBLElBQUEsU0FBQTtHQUNBLFFBQUEsUUFBQSxPQUFBLEtBQUEsVUFBQSxLQUFBO0lBQ0EsSUFBQSxJQUFBLFdBQUEsTUFBQTtLQUNBLFNBQUE7OztHQUdBLE9BQUE7O0VBRUEsSUFBQSxpQkFBQSxVQUFBLEtBQUE7R0FDQSxJQUFBLFNBQUE7R0FDQSxRQUFBLFFBQUEsT0FBQSxLQUFBLFVBQUEsS0FBQTtJQUNBLElBQUEsSUFBQSxPQUFBLEtBQUE7S0FDQSxTQUFBOzs7R0FHQSxPQUFBOztFQUVBLElBQUEsZUFBQSxVQUFBLFFBQUE7R0FDQSxPQUFBLFNBQUEsU0FBQSxjQUFBO0dBQ0EsT0FBQSxPQUFBLFFBQUE7R0FDQSxPQUFBLE9BQUEsU0FBQTtHQUNBLE9BQUEsTUFBQSxPQUFBLE9BQUEsV0FBQTtHQUNBLElBQUEsV0FBQSxPQUFBLElBQUEscUJBQUEsR0FBQSxHQUFBLEtBQUE7R0FDQSxTQUFBLGFBQUEsR0FBQTtHQUNBLFNBQUEsYUFBQSxNQUFBO0dBQ0EsU0FBQSxhQUFBLEdBQUE7R0FDQSxPQUFBLElBQUEsWUFBQTtHQUNBLE9BQUEsSUFBQSxTQUFBLEdBQUEsR0FBQSxLQUFBO0dBQ0EsT0FBQSxVQUFBLE9BQUEsSUFBQSxhQUFBLEdBQUEsR0FBQSxLQUFBLEdBQUE7OztFQUdBLElBQUEsZUFBQSxVQUFBLE9BQUE7R0FDQSxJQUFBLFdBQUEsT0FBQSxJQUFBLHFCQUFBLEdBQUEsR0FBQSxLQUFBO0dBQ0EsU0FBQSxhQUFBLEdBQUE7R0FDQSxTQUFBLGFBQUEsTUFBQTtHQUNBLFNBQUEsYUFBQSxHQUFBO0dBQ0EsT0FBQSxJQUFBLFlBQUE7R0FDQSxPQUFBLElBQUEsU0FBQSxHQUFBLEdBQUEsS0FBQTtHQUNBLE9BQUEsVUFBQSxPQUFBLElBQUEsYUFBQSxHQUFBLEdBQUEsS0FBQSxHQUFBOztFQUVBO0VBQ0EsSUFBQSxnQkFBQSxVQUFBLFNBQUE7R0FDQSxJQUFBLFFBQUE7R0FDQSxJQUFBLE1BQUEsUUFBQSxXQUFBO0dBQ0EsSUFBQSxTQUFBLGVBQUE7R0FDQSxJQUFBLFFBQUEsT0FBQSxRQUFBLFlBQUEsUUFBQTs7O0dBR0EsSUFBQSxXQUFBLFNBQUEsTUFBQSxNQUFBLE9BQUEsVUFBQTtHQUNBLElBQUEsUUFBQSxVQUFBLE9BQUEsUUFBQSxZQUFBLE9BQUEsT0FBQSxRQUFBLFdBQUEsS0FBQSxPQUFBLE9BQUEsUUFBQSxXQUFBLEtBQUEsTUFBQSxPQUFBLFFBQUEsV0FBQSxLQUFBO0dBQ0EsTUFBQSxRQUFBO0dBQ0EsTUFBQSxVQUFBO0lBQ0EsT0FBQTtJQUNBLE1BQUE7O0dBRUEsTUFBQSxXQUFBO0lBQ0EsT0FBQTtJQUNBLFNBQUE7S0FDQSxPQUFBO0tBQ0EsTUFBQTs7O0dBR0EsT0FBQTs7RUFFQSxJQUFBLGlCQUFBLFVBQUEsU0FBQTtHQUNBLElBQUEsUUFBQTtHQUNBLElBQUEsTUFBQSxRQUFBLFdBQUE7R0FDQSxJQUFBLFNBQUEsZUFBQTtHQUNBLElBQUEsUUFBQSxPQUFBLFFBQUEsWUFBQSxRQUFBO0dBQ0EsSUFBQSxPQUFBLFFBQUE7R0FDQSxRQUFBO0dBQ0EsS0FBQTtJQUNBLElBQUEsT0FBQSxRQUFBO0tBQ0EsSUFBQSxXQUFBLFNBQUEsTUFBQSxNQUFBLE9BQUEsVUFBQTtLQUNBLElBQUEsUUFBQSxVQUFBLE9BQUEsUUFBQSxZQUFBLE9BQUEsT0FBQSxRQUFBLFdBQUEsS0FBQSxPQUFBLE9BQUEsUUFBQSxXQUFBLEtBQUEsTUFBQSxPQUFBLFFBQUEsV0FBQSxLQUFBO0tBQ0EsTUFBQSxRQUFBO0tBQ0EsTUFBQSxVQUFBO01BQ0EsT0FBQTtNQUNBLE1BQUE7O0tBRUEsTUFBQSxXQUFBO01BQ0EsT0FBQTtNQUNBLFNBQUE7T0FDQSxPQUFBO09BQ0EsTUFBQTs7O0tBR0E7V0FDQTtLQUNBLE1BQUEsUUFBQTtLQUNBLE1BQUEsVUFBQTtNQUNBLE9BQUE7TUFDQSxNQUFBOzs7OztHQUtBLE9BQUE7OztFQUdBLE9BQUEsZ0JBQUEsWUFBQTtHQUNBLFlBQUEsT0FBQSxPQUFBLEtBQUEsVUFBQSxLQUFBO0lBQ0EsT0FBQSxPQUFBLFFBQUEsVUFBQSxHQUFBLEdBQUE7S0FDQSxJQUFBLE1BQUEsR0FBQTtNQUNBOzs7S0FHQSxJQUFBLE1BQUEsQ0FBQSxFQUFBLFlBQUEsR0FBQSxHQUFBO09BQ0EsQ0FBQSxFQUFBLFlBQUEsR0FBQSxHQUFBOztNQUVBLE1BQUEsQ0FBQSxFQUFBLFlBQUEsR0FBQSxHQUFBO09BQ0EsQ0FBQSxFQUFBLFlBQUEsR0FBQSxHQUFBOztLQUVBLElBQUEsWUFBQSxFQUFBLE9BQUEsRUFBQSxZQUFBLEdBQUEsR0FBQSxJQUFBLEVBQUEsWUFBQSxHQUFBLEdBQUE7TUFDQSxZQUFBLEVBQUEsT0FBQSxFQUFBLFlBQUEsR0FBQSxHQUFBLElBQUEsRUFBQSxZQUFBLEdBQUEsR0FBQTtNQUNBLFNBQUEsRUFBQSxhQUFBLFdBQUE7S0FDQSxJQUFBLE1BQUE7TUFDQSxDQUFBLEtBQUE7TUFDQSxDQUFBLEdBQUE7O0tBRUEsSUFBQSxPQUFBLFFBQUEsUUFBQTtNQUNBLE1BQUE7T0FDQSxDQUFBLEtBQUE7T0FDQSxDQUFBLEdBQUE7Ozs7S0FJQSxJQUFBLFVBQUEsUUFBQTtNQUNBLGdCQUFBLElBQUE7TUFDQSxvQkFBQSxJQUFBO01BQ0EsU0FBQTs7O0lBR0EsSUFBQSxTQUFBO0lBQ0EsSUFBQSxRQUFBO0lBQ0EsSUFBQSxLQUFBO0lBQ0EsSUFBQSxTQUFBO0lBQ0EsSUFBQSxNQUFBO0lBQ0EsSUFBQSxPQUFBLG9HQUFBO0lBQ0EsT0FBQSxZQUFBLElBQUEsRUFBQSxVQUFBLFVBQUE7S0FDQSxLQUFBO0tBQ0EsT0FBQTtLQUNBLFNBQUE7S0FDQSxpQkFBQSxDQUFBO0tBQ0EsYUFBQTtLQUNBLFNBQUEsVUFBQSxLQUFBLEdBQUE7TUFDQSxJQUFBLENBQUEsT0FBQSxRQUFBLFFBQUE7T0FDQSxPQUFBLFVBQUEsZUFBQSxJQUFBLFFBQUEsV0FBQTthQUNBO09BQ0EsT0FBQSxtQkFBQSxlQUFBLElBQUEsUUFBQSxXQUFBOzs7S0FHQSxzQkFBQSxVQUFBLFNBQUE7TUFDQSxPQUFBLFFBQUEsV0FBQTs7S0FFQSxRQUFBLFVBQUEsU0FBQSxTQUFBOztNQUVBLE9BQUE7O0tBRUEsT0FBQTs7Ozs7Ozs7O0lBU0EsSUFBQSxTQUFBLE9BQUE7SUFDQSxPQUFBLFVBQUEsV0FBQTtJQUNBLE9BQUE7OztFQUdBLE9BQUE7Ozs7QUNsV0EsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsa0JBQUEsVUFBQTs7Ozs7O0FDSEEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsdUNBQUEsU0FBQSxRQUFBLFdBQUE7O0VBRUEsT0FBQSxPQUFBLFVBQUE7R0FDQSxPQUFBLFdBQUE7S0FDQSxTQUFBLFFBQUE7R0FDQSxPQUFBLGVBQUEsV0FBQTs7Ozs7OztBQ1JBLENBQUEsWUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLCtCQUFBLFVBQUEsV0FBQTtFQUNBLEtBQUEsV0FBQTtHQUNBLGFBQUE7R0FDQSxXQUFBO0dBQ0EseUJBQUE7R0FDQSxrQkFBQTs7O0VBR0EsS0FBQSxlQUFBLFVBQUEsTUFBQSxJQUFBO0dBQ0EsVUFBQSxLQUFBLFVBQUE7S0FDQSxNQUFBO0tBQ0EsUUFBQSx3QkFBQSxPQUFBO0tBQ0EsR0FBQTtLQUNBLFlBQUE7Ozs7SUFJQSxLQUFBLGdCQUFBLFdBQUE7R0FDQSxVQUFBLEtBQUE7O0tBRUEsYUFBQTtTQUNBLGtCQUFBOztLQUVBLEtBQUEsVUFBQSxRQUFBOztPQUVBLFlBQUE7Ozs7Ozs7Ozs7QUM1QkEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsa0RBQUEsU0FBQSxRQUFBLE9BQUEsWUFBQTs7RUFFQSxJQUFBLGNBQUE7O0VBRUEsT0FBQSxlQUFBLFVBQUE7O0dBRUEsTUFBQSxNQUFBLGFBQUEsS0FBQSxVQUFBLEtBQUE7Ozs7Ozs7O0VBUUEsT0FBQSxVQUFBLFVBQUE7R0FDQSxZQUFBLElBQUEscUJBQUEsTUFBQSxLQUFBLFVBQUEsU0FBQTs7TUFFQSxVQUFBLE1BQUE7Ozs7Ozs7OztBQ3BCQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSxpR0FBQSxTQUFBLFFBQUEsVUFBQSxXQUFBLFdBQUEsY0FBQSxjQUFBOztFQUVBLE9BQUEsYUFBQTtFQUNBLE9BQUEsT0FBQTs7RUFFQSxJQUFBLFFBQUE7SUFDQSxVQUFBLFlBQUEsV0FBQSxTQUFBLFlBQUEsWUFBQSxXQUFBLGlCQUFBLFNBQUE7SUFDQSxhQUFBLG9CQUFBLGFBQUEsT0FBQSxvQkFBQSxXQUFBLG9CQUFBLFdBQUE7SUFDQSxzQkFBQSxTQUFBLHFCQUFBLGtCQUFBLGlCQUFBLGNBQUEsY0FBQTtJQUNBLFlBQUEsa0JBQUEsYUFBQSxlQUFBLGNBQUEsV0FBQSxPQUFBLHVCQUFBO0lBQ0EsYUFBQSxRQUFBLFFBQUEsYUFBQSxXQUFBLFVBQUEsU0FBQSxlQUFBLFdBQUEsZUFBQTtJQUNBLFFBQUEseUJBQUEsUUFBQSxlQUFBLGVBQUEsbUJBQUEsYUFBQTtJQUNBLGFBQUEsaUJBQUEsZUFBQSxXQUFBLGtCQUFBLGVBQUE7SUFDQSx3QkFBQSxnQkFBQSx5QkFBQSxhQUFBLGVBQUEsaUJBQUE7SUFDQSxRQUFBLFdBQUEsc0JBQUEsU0FBQSxXQUFBLFNBQUEsY0FBQSxRQUFBLFNBQUEsU0FBQTtJQUNBLFVBQUEsa0JBQUEsY0FBQSxnQkFBQSxhQUFBLFNBQUEsbUJBQUEsU0FBQTtJQUNBLG1CQUFBLGNBQUEsZUFBQSxpQkFBQSxlQUFBLGNBQUEsWUFBQSxjQUFBO0lBQ0EsU0FBQSxjQUFBLGFBQUEsV0FBQSxnQkFBQSxhQUFBLFFBQUEsU0FBQSxRQUFBO0lBQ0Esc0JBQUEsWUFBQSxVQUFBLFNBQUE7O0dBRUEsVUFBQTs7RUFFQSxVQUFBLFVBQUE7R0FDQSxPQUFBLE9BQUEsTUFBQSxFQUFBO0dBQ0EsSUFBQSxVQUFBLElBQUE7SUFDQSxVQUFBOztLQUVBOzs7Ozs7QUM5QkEsQ0FBQSxXQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsYUFBQSxXQUFBOzs7Ozs7QUNIQSxDQUFBLFlBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSxzRkFBQSxVQUFBLFFBQUEsWUFBQSxVQUFBLFlBQUEsYUFBQSxPQUFBOztFQUVBLElBQUEsU0FBQTs7Ozs7Ozs7RUFRQSxPQUFBLFNBQUE7R0FDQSxLQUFBO0dBQ0EsS0FBQTtHQUNBLE1BQUE7O0VBRUEsT0FBQSxXQUFBO0dBQ0EsaUJBQUE7O0VBRUEsUUFBQSxPQUFBLFlBQUE7R0FDQSxRQUFBO0lBQ0EsS0FBQTtJQUNBLEtBQUE7SUFDQSxNQUFBOztHQUVBLFFBQUE7SUFDQSxZQUFBO0tBQ0EsS0FBQTtNQUNBLE1BQUE7TUFDQSxLQUFBLGtGQUFBO01BQ0EsTUFBQTs7O0lBR0EsVUFBQTtLQUNBLGNBQUE7TUFDQSxNQUFBO01BQ0EsTUFBQTtNQUNBLEtBQUE7TUFDQSxTQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztFQTZCQSxPQUFBLGdCQUFBO0VBQ0EsT0FBQSxPQUFBO0VBQ0EsT0FBQSxJQUFBLHdDQUFBLFVBQUEsT0FBQSxjQUFBOztHQUVBLE9BQUEsZ0JBQUEsYUFBQSxLQUFBO0dBQ0EsT0FBQSxPQUFBLDJCQUFBLGFBQUEsS0FBQTs7O0VBR0EsT0FBQSxJQUFBLHVDQUFBLFVBQUEsT0FBQSxjQUFBO0dBQ0EsT0FBQSxnQkFBQTtHQUNBLE9BQUEsT0FBQTs7RUFFQSxXQUFBLGVBQUEsWUFBQSxPQUFBOzs7OztBQ2pGQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSxZQUFBLFVBQUE7Ozs7OztBQ0hBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLGVBQUEsVUFBQTs7Ozs7O0FDSEEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsb0NBQUEsU0FBQSxRQUFBLE9BQUE7Ozs7OztBQ0hBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLGlCQUFBLFVBQUE7Ozs7OztBQ0hBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLHlDQUFBLFNBQUEsUUFBQSxhQUFBOztFQUVBLE9BQUEsZUFBQSxVQUFBO0dBQ0EsYUFBQSxLQUFBOzs7RUFHQSxPQUFBLGFBQUEsVUFBQTtHQUNBLGFBQUEsTUFBQTs7Ozs7OztBQ1ZBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLDBCQUFBLFVBQUE7Ozs7OztBQ0hBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsUUFBQSxvQkFBQSxZQUFBLGVBQUEsVUFBQTs7Ozs7O0FDSEEsQ0FBQSxZQUFBO0NBQ0E7O0NBRUEsU0FBQSxjQUFBLFdBQUEsT0FBQTtFQUNBLElBQUEsWUFBQTtFQUNBLElBQUEsT0FBQSxTQUFBLGVBQUE7RUFDQSxHQUFBLFFBQUEsS0FBQTtHQUNBLFFBQUEsUUFBQSxVQUFBLEtBQUEsUUFBQSxPQUFBLCtDQUFBLFlBQUE7O0VBRUE7RUFDQSxTQUFBLFlBQUEsU0FBQSxNQUFBLE9BQUEsU0FBQTtHQUNBLFFBQUEsUUFBQSxTQUFBLGNBQUEsTUFBQSxZQUFBLEtBQUE7R0FDQSxRQUFBLFFBQUEsU0FBQSxjQUFBLE1BQUEsWUFBQSxJQUFBLFdBQUE7O0dBRUEsT0FBQSxlQUFBLE9BQUEsTUFBQTs7RUFFQSxTQUFBLGNBQUE7R0FDQSxRQUFBLFFBQUEsU0FBQSxjQUFBLE1BQUEsWUFBQSxJQUFBLFdBQUE7O0VBRUEsU0FBQSxlQUFBLE9BQUEsR0FBQSxTQUFBO0dBQ0EsSUFBQSxPQUFBLE1BQUE7R0FDQSxJQUFBLFVBQUE7R0FDQSxJQUFBLFVBQUE7R0FDQSxJQUFBLE1BQUEsUUFBQSxLQUFBLE9BQUE7R0FDQSxJQUFBLFFBQUEsT0FBQTtHQUNBLElBQUEsTUFBQSxRQUFBLFFBQUEsU0FBQSxjQUFBLE9BQUE7R0FDQSxJQUFBLE1BQUEsU0FBQSxjQUFBLE1BQUE7R0FDQSxJQUFBLFFBQUEsSUFBQSx3QkFBQSxNQUFBLEVBQUEsSUFBQSxNQUFBO0dBQ0EsSUFBQSxTQUFBLElBQUEsd0JBQUEsT0FBQSxFQUFBLElBQUEsRUFBQSxTQUFBO0dBQ0EsT0FBQSxRQUFBLFFBQUEsU0FBQSxjQUFBLE9BQUEsSUFBQSxPQUFBLFFBQUEsTUFBQSxJQUFBLFFBQUEsU0FBQTs7RUFFQSxPQUFBO0dBQ0EsYUFBQTtHQUNBLGFBQUE7R0FDQSxnQkFBQTs7O0NBR0EsUUFBQSxPQUFBLGtCQUFBLFVBQUEsd0JBQUEsVUFBQSxVQUFBO0VBQ0EsSUFBQTtFQUNBLFdBQUEsWUFBQTtHQUNBLE9BQUE7SUFDQSxPQUFBO0lBQ0EsUUFBQTtJQUNBLGdCQUFBO0lBQ0EsV0FBQTtJQUNBLEtBQUE7SUFDQSxPQUFBO0lBQ0EsUUFBQTtJQUNBLFNBQUE7SUFDQSxTQUFBO0lBQ0EsWUFBQSxHQUFBLE1BQUEsVUFBQSxPQUFBLENBQUEsTUFBQSxPQUFBLE1BQUEsQ0FBQSxXQUFBO0lBQ0EsWUFBQTtJQUNBLGNBQUE7SUFDQSxVQUFBO0lBQ0EsU0FBQSxjQUFBLG1CQUFBOzs7RUFHQSxPQUFBO0dBQ0EsVUFBQTtHQUNBLE9BQUE7SUFDQSxXQUFBO0lBQ0EsV0FBQTtJQUNBLFNBQUE7SUFDQSxZQUFBO0lBQ0EsU0FBQTtJQUNBLFNBQUE7O0dBRUEsU0FBQTtHQUNBLE1BQUEsVUFBQSxPQUFBLE1BQUEsT0FBQSxTQUFBO0lBQ0EsSUFBQSxVQUFBLFFBQUEsT0FBQSxZQUFBO0lBQ0EsSUFBQSxRQUFBO0tBQ0EsUUFBQTtLQUNBLFNBQUE7O0lBRUEsSUFBQSxhQUFBLEdBQUEsSUFBQSxNQUFBLFdBQUEsVUFBQSxHQUFBO0tBQ0EsT0FBQSxTQUFBLEVBQUE7OztJQUdBLFFBQUEsZUFBQSxHQUFBLE1BQUEsTUFBQSxTQUFBLEtBQUEsT0FBQSxDQUFBLEdBQUEsYUFBQSxNQUFBLENBQUEsR0FBQTtJQUNBLFFBQUEsU0FBQTtLQUNBLEdBQUEsUUFBQSxRQUFBO0tBQ0EsR0FBQSxRQUFBLFNBQUE7O0lBRUEsUUFBQSxjQUFBO0tBQ0EsTUFBQTtNQUNBLEdBQUEsUUFBQSxRQUFBO01BQ0EsR0FBQSxRQUFBLFVBQUE7TUFDQSxRQUFBOztLQUVBLE1BQUE7TUFDQSxHQUFBLFFBQUEsUUFBQTtNQUNBLEdBQUEsUUFBQSxVQUFBO01BQ0EsUUFBQTs7O0lBR0EsSUFBQSxlQUFBLFlBQUE7OztLQUdBLFFBQUEsUUFBQSxNQUFBLFNBQUEsVUFBQSxPQUFBO01BQ0EsUUFBQSxRQUFBLE1BQUEsVUFBQSxVQUFBLE1BQUE7O09BRUEsSUFBQSxNQUFBLFVBQUEsS0FBQSxjQUFBO1FBQ0EsSUFBQSxPQUFBO1NBQ0EsTUFBQSxLQUFBO1NBQ0EsUUFBQSxNQUFBLFVBQUEsS0FBQSxlQUFBLE1BQUE7U0FDQSxPQUFBLE1BQUEsVUFBQSxLQUFBLGVBQUEsTUFBQTtTQUNBLE1BQUEsS0FBQTtTQUNBLE9BQUEsTUFBQSxZQUFBLFVBQUEsRUFBQTtTQUNBLEdBQUEsUUFBQSxPQUFBO1NBQ0EsR0FBQSxRQUFBLE9BQUE7U0FDQSxPQUFBLEtBQUE7U0FDQSxNQUFBLEtBQUE7U0FDQSxTQUFBLEtBQUE7U0FDQSxNQUFBO1NBQ0EsU0FBQTs7UUFFQSxNQUFBLEtBQUE7Ozs7S0FJQTs7SUFFQSxJQUFBLGdCQUFBLFVBQUE7S0FDQSxTQUFBO0tBQ0EsSUFBQSxRQUFBO0tBQ0EsUUFBQSxRQUFBLE9BQUEsU0FBQSxLQUFBO09BQ0EsSUFBQSxTQUFBO09BQ0EsSUFBQSxRQUFBO09BQ0EsUUFBQSxRQUFBLFFBQUEsU0FBQSxPQUFBLE1BQUE7UUFDQSxHQUFBLEtBQUEsU0FBQSxNQUFBO1NBQ0EsU0FBQTs7O09BR0EsR0FBQSxDQUFBLE9BQUE7UUFDQTtRQUNBLE9BQUEsS0FBQSxTQUFBO1NBQ0EsR0FBQSxRQUFBLFFBQUE7U0FDQSxHQUFBLFFBQUEsU0FBQSxLQUFBLElBQUE7U0FDQSxRQUFBOzs7OztLQUtBLFFBQUEsSUFBQTs7SUFFQSxJQUFBLGFBQUEsWUFBQTtLQUNBLFFBQUEsUUFBQSxNQUFBLEtBQUE7S0FDQSxRQUFBLE1BQUEsR0FBQSxPQUFBLEtBQUEsSUFBQSxPQUFBLE9BQUEsS0FBQSxTQUFBLFFBQUEsT0FBQSxLQUFBLFVBQUEsUUFBQSxRQUFBLEtBQUEsTUFBQTs7S0FFQSxJQUFBLENBQUEsUUFBQSxTQUFBO01BQ0EsSUFBQSxLQUFBLEtBQUE7TUFDQSxJQUFBLFNBQUEsR0FBQSxJQUFBO1FBQ0EsWUFBQTtRQUNBLFlBQUE7UUFDQSxXQUFBLENBQUEsTUFBQSxLQUFBO1FBQ0EsU0FBQSxNQUFBLEtBQUE7TUFDQSxJQUFBLFlBQUEsR0FBQSxJQUFBO1FBQ0EsWUFBQTtRQUNBLFlBQUE7UUFDQSxXQUFBLE1BQUEsS0FBQTtRQUNBLFNBQUEsT0FBQSxLQUFBOztNQUVBLFFBQUEsU0FBQSxRQUFBLElBQUEsT0FBQTtRQUNBLEtBQUEsS0FBQTtRQUNBLEtBQUEsUUFBQTtRQUNBLEtBQUEsYUFBQSxjQUFBLFFBQUEsTUFBQSxHQUFBLEtBQUEsUUFBQSxPQUFBLElBQUEsUUFBQSxPQUFBLElBQUE7TUFDQSxRQUFBLFlBQUEsUUFBQSxJQUFBLE9BQUE7UUFDQSxLQUFBLEtBQUE7UUFDQSxLQUFBLFFBQUE7UUFDQSxLQUFBLGFBQUEsY0FBQSxRQUFBLE1BQUEsR0FBQSxLQUFBLFFBQUEsT0FBQSxHQUFBOztLQUVBLFFBQUEsYUFBQSxRQUFBLElBQUEsVUFBQSxVQUFBLEtBQUEsT0FBQSxRQUFBLE9BQUEsS0FBQSxLQUFBLGFBQUEsZ0JBQUEsUUFBQSxRQUFBLEtBQUEsT0FBQSxRQUFBLFNBQUEsS0FBQSxLQUFBLEtBQUEsU0FBQTs7Ozs7O0tBTUEsUUFBQSxVQUFBLFFBQUEsV0FBQSxPQUFBLFVBQUEsS0FBQSxLQUFBLEdBQUEsS0FBQSxTQUFBLFVBQUEsR0FBQTtNQUNBLE9BQUEsRUFBQSxTQUFBLFFBQUEsV0FBQSxFQUFBO1NBQ0EsS0FBQSxnQkFBQSxHQUFBLEtBQUEsVUFBQSxVQUFBLEdBQUE7TUFDQSxPQUFBLEdBQUEsSUFBQSxRQUFBLFdBQUEsRUFBQSxRQUFBO1FBQ0EsS0FBQSxNQUFBLFVBQUEsR0FBQTtNQUNBLE9BQUEsWUFBQSxFQUFBOztLQUVBLFFBQUEsUUFBQSxRQUFBLFdBQUEsT0FBQTtPQUNBLEtBQUEsZUFBQTtPQUNBLEtBQUEsYUFBQSxVQUFBLEdBQUE7T0FDQTs7T0FFQSxLQUFBLGVBQUE7T0FDQSxLQUFBLFFBQUE7T0FDQSxLQUFBLFVBQUEsR0FBQTtPQUNBLE9BQUEsRUFBQTs7S0FFQSxRQUFBLE1BQUEsR0FBQSxhQUFBLFVBQUEsR0FBQSxHQUFBO01BQ0EsT0FBQSxhQUFBLEdBQUEsR0FBQTtRQUNBLEdBQUEsWUFBQSxVQUFBLEdBQUEsR0FBQTtNQUNBLE9BQUEsYUFBQSxHQUFBLEdBQUE7UUFDQSxHQUFBLFNBQUEsVUFBQSxHQUFBLEdBQUE7TUFDQSxRQUFBLGNBQUE7TUFDQSxRQUFBOztLQUVBLFFBQUEsUUFBQSxhQUFBLFNBQUEsUUFBQSxVQUFBLEtBQUEsS0FBQSxVQUFBLEdBQUE7TUFDQSxPQUFBLEVBQUE7O0tBRUEsUUFBQSxNQUFBLGFBQUEsU0FBQSxRQUFBLFVBQUEsS0FBQSxhQUFBLFVBQUEsR0FBQTtNQUNBLE9BQUEsRUFBQSxTQUFBLE9BQUE7UUFDQSxLQUFBLEtBQUEsVUFBQSxHQUFBO01BQ0EsT0FBQSxFQUFBLFNBQUEsTUFBQTs7O0lBR0EsSUFBQSxhQUFBLFlBQUE7O0tBRUEsTUFBQSxRQUFBLFVBQUEsR0FBQSxHQUFBO01BQ0EsUUFBQSxRQUFBLGFBQUEsU0FBQSxRQUFBLFVBQUEsTUFBQSxJQUFBLFFBQUE7UUFDQSxLQUFBLEtBQUEsVUFBQSxHQUFBO1FBQ0EsRUFBQSxTQUFBLEVBQUEsUUFBQSxNQUFBLFVBQUEsRUFBQSxRQUFBLE1BQUE7O1FBRUEsT0FBQSxNQUFBLFVBQUEsRUFBQSxRQUFBLE1BQUE7O01BRUEsUUFBQSxNQUFBLGFBQUEsU0FBQSxRQUFBLFVBQUEsTUFBQSxJQUFBLFFBQUE7UUFDQSxLQUFBLGFBQUEsVUFBQSxHQUFBO1FBQ0EsT0FBQSxDQUFBLE1BQUEsVUFBQSxFQUFBLFFBQUEsTUFBQSxjQUFBLE9BQUE7O1FBRUEsS0FBQSxLQUFBLFVBQUEsR0FBQTtRQUNBLE9BQUEsQ0FBQSxNQUFBLFVBQUEsRUFBQSxRQUFBLE1BQUEsY0FBQSxNQUFBOzs7O0lBSUEsSUFBQSxTQUFBLFVBQUEsR0FBQTtLQUNBLE9BQUEsQ0FBQSxLQUFBLElBQUEsRUFBQSxRQUFBLE9BQUE7O0lBRUEsSUFBQSxRQUFBLFlBQUE7S0FDQSxPQUFBLFFBQUEsUUFBQSxHQUFBLE9BQUEsUUFBQSxNQUFBLE9BQUEsS0FBQSxDQUFBLFFBQUEsT0FBQSxRQUFBLFNBQUEsTUFBQTs7SUFFQSxJQUFBLG9CQUFBLFlBQUE7S0FDQSxRQUFBLE1BQUEsUUFBQSxRQUFBLGdCQUFBLE9BQUEsUUFBQSxTQUFBLEtBQUEsR0FBQSxRQUFBLFVBQUEsR0FBQTtNQUNBLE9BQUEsUUFBQSxRQUFBLEtBQUEsb0JBQUEsRUFBQSxRQUFBLEtBQUEsTUFBQSxVQUFBLEdBQUE7T0FDQSxPQUFBLEVBQUE7U0FDQSxLQUFBLE1BQUEsVUFBQSxHQUFBO09BQ0EsT0FBQSxFQUFBOzs7S0FHQSxRQUFBLE1BQUE7O0lBRUEsSUFBQSxpQkFBQSxZQUFBO0tBQ0EsUUFBQSxNQUFBLFFBQUEsUUFBQSxnQkFBQSxPQUFBLFFBQUEsU0FBQSxLQUFBLEdBQUEsUUFBQSxVQUFBLEdBQUE7TUFDQSxRQUFBLFdBQUEsS0FBQSxpQkFBQSxFQUFBLFFBQUEsS0FBQSxhQUFBLFVBQUEsR0FBQTtPQUNBLE9BQUEsZUFBQSxFQUFBLElBQUEsTUFBQSxFQUFBLElBQUE7OztLQUdBLFFBQUEsTUFBQTs7SUFFQSxJQUFBLHNCQUFBLFVBQUEsT0FBQTtLQUNBLE9BQUEsQ0FBQSxVQUFBLE9BQUE7TUFDQSxPQUFBLFVBQUEsR0FBQTtPQUNBLEVBQUEsSUFBQSxFQUFBLElBQUEsQ0FBQSxRQUFBLE9BQUEsSUFBQSxFQUFBLE1BQUEsUUFBQSxTQUFBLFFBQUE7T0FDQSxFQUFBLElBQUEsRUFBQSxJQUFBLENBQUEsUUFBQSxPQUFBLElBQUEsRUFBQSxNQUFBLFFBQUEsU0FBQSxRQUFBOztRQUVBOztJQUVBLElBQUEsbUJBQUEsVUFBQSxPQUFBO0tBQ0EsT0FBQSxDQUFBLFVBQUEsT0FBQTtNQUNBLE9BQUEsVUFBQSxHQUFBO09BQ0EsRUFBQSxJQUFBLEVBQUEsSUFBQSxDQUFBLFFBQUEsT0FBQSxJQUFBLEVBQUEsTUFBQSxRQUFBLFNBQUEsUUFBQSxRQUFBO09BQ0EsRUFBQSxJQUFBLEVBQUEsSUFBQSxDQUFBLE1BQUEsRUFBQSxNQUFBLFFBQUEsU0FBQSxRQUFBLFFBQUE7O1FBRUE7O0lBRUEsSUFBQSxtQkFBQSxVQUFBLE9BQUE7S0FDQSxPQUFBLENBQUEsVUFBQSxPQUFBO01BQ0EsT0FBQSxVQUFBLEdBQUE7T0FDQSxJQUFBO09BQ0EsU0FBQSxRQUFBLFlBQUEsRUFBQTtPQUNBLEVBQUEsSUFBQSxFQUFBLElBQUEsQ0FBQSxPQUFBLElBQUEsRUFBQSxNQUFBLE9BQUEsU0FBQSxRQUFBLFFBQUE7T0FDQSxPQUFBLEVBQUEsSUFBQSxFQUFBLElBQUEsQ0FBQSxPQUFBLElBQUEsRUFBQSxNQUFBLE9BQUEsU0FBQSxRQUFBLFFBQUE7O1FBRUE7O0lBRUEsSUFBQSxlQUFBLFVBQUEsTUFBQSxHQUFBLFNBQUE7S0FDQSxJQUFBO0tBQ0EsVUFBQSwyQkFBQSxLQUFBLE9BQUE7S0FDQSxRQUFBLFFBQUEsS0FBQSxLQUFBLFVBQUEsVUFBQSxNQUFBO01BQ0EsV0FBQSx5Q0FBQSxLQUFBLFNBQUEsS0FBQSxTQUFBLFVBQUEsS0FBQSxTQUFBOztLQUVBLFNBQUEsUUFBQSxRQUFBLFlBQUEsU0FBQSxNQUFBLEdBQUEsT0FBQSxNQUFBLFlBQUE7OztJQUdBLElBQUEsZUFBQSxVQUFBLE1BQUEsR0FBQSxTQUFBO0tBQ0EsT0FBQSxRQUFBLFFBQUE7OztJQUdBLE1BQUEsT0FBQSxhQUFBLFVBQUEsTUFBQSxTQUFBO0tBQ0EsUUFBQSxRQUFBO0tBQ0EsSUFBQSxRQUFBLFdBQUEsTUFBQTtNQUNBO01BQ0E7TUFDQTtZQUNBO01BQ0E7O0tBRUE7OztJQUdBLE1BQUEsT0FBQSxhQUFBLFVBQUEsTUFBQSxNQUFBO0tBQ0EsSUFBQSxTQUFBLE1BQUE7TUFDQTs7S0FFQSxJQUFBLFFBQUEsT0FBQTtNQUNBO1lBQ0E7TUFDQTs7Ozs7Ozs7QUN2VEEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxRQUFBLG9CQUFBLFlBQUEsbUJBQUEsVUFBQTs7Ozs7O0FDSEEsQ0FBQSxXQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGtCQUFBLFVBQUEsNEJBQUEsU0FBQSxVQUFBO0VBQ0EsSUFBQSxXQUFBLFdBQUE7R0FDQSxPQUFBO0lBQ0EsT0FBQTtJQUNBLFFBQUE7SUFDQSxPQUFBO0lBQ0EsTUFBQTtJQUNBLE9BQUE7OztFQUdBLE9BQUE7R0FDQSxVQUFBO0dBQ0EsWUFBQTtHQUNBLE9BQUE7R0FDQSxTQUFBO0dBQ0EsTUFBQSxTQUFBLFFBQUEsU0FBQSxRQUFBLFNBQUE7OztJQUdBLElBQUEsVUFBQSxRQUFBLE9BQUEsWUFBQTs7O0lBR0EsSUFBQSxTQUFBLEdBQUEsTUFBQTtNQUNBLE9BQUEsQ0FBQSxHQUFBLFFBQUE7TUFDQSxNQUFBLENBQUEsR0FBQTtNQUNBLE1BQUE7OztJQUdBLElBQUEsTUFBQSxHQUFBLE9BQUEsUUFBQSxJQUFBLE9BQUE7TUFDQSxLQUFBLFNBQUEsUUFBQTtNQUNBLEtBQUEsVUFBQSxRQUFBO01BQ0EsT0FBQTtJQUNBLElBQUEsWUFBQSxJQUFBLE9BQUE7TUFDQSxLQUFBLGFBQUEsZUFBQSxRQUFBLFFBQUEsSUFBQSxNQUFBLFFBQUEsU0FBQSxJQUFBO0lBQ0EsSUFBQSxhQUFBLFVBQUEsT0FBQTtNQUNBLEtBQUEsS0FBQSxRQUFBLFFBQUEsSUFBQTtNQUNBLEtBQUEsZ0JBQUE7TUFDQSxLQUFBLFVBQUEsUUFBQTtNQUNBLE1BQUEsV0FBQTtNQUNBLEtBQUEsUUFBQTtJQUNBLElBQUEsTUFBQSxHQUFBLElBQUE7TUFDQSxXQUFBO01BQ0EsWUFBQSxTQUFBLEdBQUE7TUFDQSxPQUFBLFFBQUEsUUFBQSxJQUFBOztNQUVBLFlBQUEsU0FBQSxHQUFBO01BQ0EsT0FBQSxRQUFBLFFBQUE7O0lBRUEsSUFBQSxjQUFBLFVBQUEsT0FBQTtNQUNBLE1BQUE7TUFDQSxVQUFBLElBQUEsS0FBQSxLQUFBOztNQUVBLE1BQUEsUUFBQSxRQUFBO01BQ0EsS0FBQSxLQUFBO0lBQ0EsSUFBQSxPQUFBLFVBQUEsVUFBQTtNQUNBLEtBQUEsQ0FBQTtNQUNBO01BQ0EsT0FBQTtNQUNBLEtBQUEsU0FBQSxHQUFBO01BQ0EsT0FBQSxPQUFBOztPQUVBLE1BQUEsUUFBQSxRQUFBO01BQ0EsTUFBQSxlQUFBO01BQ0EsS0FBQSxlQUFBO01BQ0EsS0FBQSxLQUFBOzs7SUFHQSxTQUFBLFVBQUEsUUFBQTtLQUNBLFlBQUE7T0FDQSxTQUFBO09BQ0EsS0FBQSxVQUFBLE9BQUEsVUFBQSxJQUFBLEtBQUE7S0FDQSxLQUFBLGFBQUEsU0FBQSxLQUFBLE1BQUEsUUFBQSxTQUFBLEdBQUE7TUFDQSxJQUFBLE9BQUEsS0FBQSxZQUFBLE1BQUE7O01BRUEsSUFBQSxJQUFBLEdBQUEsWUFBQSxLQUFBLElBQUE7TUFDQSxPQUFBLFNBQUEsR0FBQTtPQUNBLEtBQUEsZUFBQSxRQUFBLEtBQUEsTUFBQSxFQUFBLEtBQUEsS0FBQTs7Ozs7O0lBTUEsU0FBQSxTQUFBLFlBQUEsVUFBQTtLQUNBLFdBQUEsVUFBQSxLQUFBLFNBQUEsR0FBQTtNQUNBLElBQUEsY0FBQSxHQUFBLFlBQUEsRUFBQSxVQUFBO01BQ0EsT0FBQSxTQUFBLEdBQUE7T0FDQSxFQUFBLFdBQUEsWUFBQTtPQUNBLE9BQUEsSUFBQTs7Ozs7O0lBTUEsT0FBQTtLQUNBLFdBQUE7TUFDQSxPQUFBLFFBQUE7O0tBRUEsU0FBQSxVQUFBLFVBQUE7TUFDQSxRQUFBLElBQUE7TUFDQSxJQUFBLENBQUEsU0FBQTtPQUNBLFdBQUE7T0FDQSxTQUFBLFFBQUEsU0FBQSxRQUFBOzs7TUFHQSxTQUFBLFVBQUE7T0FDQSxVQUFBLFNBQUEsUUFBQTs7Ozs7Ozs7Ozs7QUMzR0EsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxRQUFBLG9CQUFBLFlBQUEsbUJBQUEsVUFBQTs7Ozs7O0FDSEEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGtCQUFBLFdBQUEsZUFBQSxXQUFBOztFQUVBLE9BQUE7R0FDQSxVQUFBO0dBQ0EsYUFBQTtHQUNBLFlBQUE7R0FDQSxNQUFBLFVBQUEsUUFBQSxTQUFBLFFBQUE7Ozs7Ozs7OztBQ1RBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxrQkFBQSxXQUFBLFdBQUEsV0FBQTtFQUNBLElBQUEsV0FBQSxVQUFBO0dBQ0EsT0FBQTtJQUNBLE9BQUE7OztFQUdBLE9BQUE7R0FDQSxVQUFBO0dBQ0EsYUFBQTtHQUNBLFlBQUE7R0FDQSxNQUFBO0lBQ0EsTUFBQTtJQUNBLFdBQUE7SUFDQSxNQUFBOztHQUVBLE1BQUEsVUFBQSxRQUFBLFNBQUEsUUFBQSxRQUFBOzs7Ozs7Ozs7QUNsQkEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxRQUFBLG9CQUFBLFlBQUEsMEJBQUEsU0FBQSxPQUFBOztFQUVBLE9BQUEsZUFBQTtFQUNBLE9BQUEsVUFBQTtHQUNBLGFBQUE7R0FDQSxNQUFBLENBQUE7SUFDQSxRQUFBO0tBQ0EsR0FBQTtLQUNBLEdBQUE7O0lBRUEsT0FBQTtJQUNBLE9BQUE7O0dBRUEsT0FBQSxDQUFBO0lBQ0EsUUFBQTtLQUNBLEdBQUE7S0FDQSxHQUFBLE9BQUE7O0lBRUEsT0FBQTtJQUNBLE9BQUEsT0FBQTs7O0VBR0EsT0FBQSxhQUFBO0VBQ0EsT0FBQSxpQkFBQSxVQUFBLFNBQUE7R0FDQSxJQUFBLFdBQUEsTUFBQSxPQUFBLGNBQUEsSUFBQTtJQUNBLE9BQUEsYUFBQTtVQUNBO0lBQ0EsT0FBQSxhQUFBOztHQUVBLE9BQUEsZUFBQSxPQUFBLGFBQUEsa0JBQUE7Ozs7OztBQ2hDQSxDQUFBLFlBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsa0JBQUEsVUFBQSx1QkFBQSxVQUFBLFVBQUE7RUFDQSxJQUFBLFdBQUEsWUFBQTtHQUNBLE9BQUE7SUFDQSxJQUFBO0lBQ0EsT0FBQTtJQUNBLFFBQUE7SUFDQSxNQUFBO0lBQ0EsT0FBQTtJQUNBLFVBQUE7SUFDQSxRQUFBO0tBQ0EsTUFBQTtLQUNBLE9BQUE7S0FDQSxLQUFBO0tBQ0EsUUFBQTs7SUFFQSxRQUFBLENBQUE7S0FDQSxVQUFBO0tBQ0EsT0FBQTtLQUNBLFNBQUE7T0FDQTtLQUNBLFVBQUE7S0FDQSxPQUFBO0tBQ0EsU0FBQTtPQUNBO0tBQ0EsVUFBQTtLQUNBLE9BQUE7S0FDQSxTQUFBOzs7O0VBSUEsT0FBQTtHQUNBLFVBQUE7R0FDQSxPQUFBO0lBQ0EsTUFBQTs7R0FFQSxTQUFBO0dBQ0EsTUFBQSxVQUFBLFFBQUEsU0FBQSxRQUFBLFNBQUE7O0lBRUEsSUFBQSxVQUFBLFFBQUEsT0FBQSxZQUFBOztJQUVBLEdBQUEsUUFBQSxNQUFBO0tBQ0EsUUFBQSxPQUFBLEdBQUEsUUFBQSxRQUFBOztJQUVBLFFBQUEsSUFBQSxVQUFBLFFBQUEsU0FBQSxNQUFBLElBQUEsaUJBQUEsUUFBQSxTQUFBLElBQUE7SUFDQSxJQUFBLElBQUEsR0FBQSxNQUFBO01BQ0EsT0FBQSxDQUFBLEdBQUE7TUFDQSxNQUFBLENBQUEsSUFBQSxRQUFBLFFBQUEsUUFBQSxPQUFBO01BQ0EsTUFBQTs7SUFFQSxJQUFBLFFBQUEsR0FBQSxJQUFBO01BQ0EsRUFBQTtNQUNBLE9BQUEsQ0FBQSxHQUFBO01BQ0EsR0FBQSxTQUFBO01BQ0EsR0FBQSxZQUFBOztJQUVBLElBQUEsTUFBQSxHQUFBLE9BQUEsUUFBQSxJQUFBLE9BQUE7TUFDQSxLQUFBLFNBQUEsUUFBQTtNQUNBLEtBQUEsVUFBQSxRQUFBLFNBQUEsUUFBQSxPQUFBLE1BQUEsUUFBQSxPQUFBO01BQ0EsT0FBQTs7SUFFQSxJQUFBLFdBQUEsSUFBQSxPQUFBO01BQ0EsT0FBQTtNQUNBLEtBQUEsTUFBQSxRQUFBO01BQ0EsS0FBQSxNQUFBO01BQ0EsS0FBQSxNQUFBO01BQ0EsS0FBQSxNQUFBO01BQ0EsS0FBQSxNQUFBO01BQ0EsS0FBQSxnQkFBQTtJQUNBLFFBQUEsUUFBQSxRQUFBLFFBQUEsVUFBQSxPQUFBO0tBQ0EsU0FBQSxPQUFBO09BQ0EsS0FBQSxVQUFBLE1BQUEsV0FBQTtPQUNBLEtBQUEsY0FBQSxNQUFBO09BQ0EsS0FBQSxnQkFBQSxNQUFBOztJQUVBLElBQUEsT0FBQTtNQUNBLEtBQUEsU0FBQSxRQUFBO01BQ0EsS0FBQSxVQUFBLFFBQUE7TUFDQSxNQUFBLFFBQUEsVUFBQSxRQUFBLFFBQUE7SUFDQSxJQUFBLFNBQUEsSUFBQSxPQUFBLEtBQUEsS0FBQSxhQUFBLGVBQUEsUUFBQSxTQUFBLElBQUEsT0FBQSxRQUFBLFNBQUEsSUFBQTtNQUNBLEtBQUEsU0FBQTs7SUFFQSxJQUFBLFFBQUEsU0FBQSxNQUFBO0tBQ0EsT0FBQSxPQUFBO09BQ0EsS0FBQSxLQUFBLFFBQUEsU0FBQTtLQUNBLE9BQUEsT0FBQTtPQUNBLEtBQUE7T0FDQSxNQUFBLGFBQUEsUUFBQSxPQUFBO09BQ0EsS0FBQSxlQUFBO09BQ0EsS0FBQSxLQUFBOzs7OztJQUtBLElBQUEsUUFBQSxTQUFBLE1BQUE7S0FDQSxJQUFBLFVBQUEsSUFBQSxPQUFBLEtBQUEsS0FBQSxhQUFBLGdCQUFBLFFBQUEsU0FBQSxRQUFBLFNBQUEsTUFBQSxPQUFBLFFBQUEsU0FBQSxJQUFBO09BQ0EsS0FBQSxTQUFBO0tBQ0EsUUFBQSxPQUFBO09BQ0EsS0FBQSxLQUFBLFFBQUEsU0FBQTtLQUNBLFFBQUEsT0FBQTtPQUNBLEtBQUE7T0FDQSxNQUFBLGFBQUEsUUFBQSxPQUFBO09BQ0EsS0FBQSxlQUFBO09BQ0EsS0FBQSxLQUFBOztJQUVBLElBQUEsU0FBQSxJQUFBLE9BQUE7TUFDQSxLQUFBLFNBQUE7SUFDQSxHQUFBLFFBQUEsWUFBQSxLQUFBO0tBQ0EsT0FBQSxLQUFBOzs7SUFHQSxPQUFBLE9BQUE7TUFDQSxLQUFBLFVBQUEsUUFBQTs7SUFFQSxJQUFBLFFBQUEsU0FBQSxNQUFBO0lBQ0EsT0FBQSxPQUFBO01BQ0EsS0FBQSxNQUFBLFFBQUEsUUFBQTtNQUNBLEtBQUEsTUFBQTtNQUNBLEtBQUEsTUFBQSxRQUFBLFFBQUE7TUFDQSxLQUFBLE1BQUEsUUFBQTtNQUNBLEtBQUEsb0JBQUE7TUFDQSxLQUFBLGdCQUFBO01BQ0EsS0FBQSxVQUFBOztJQUVBLElBQUEsYUFBQSxPQUFBLE9BQUE7TUFDQSxLQUFBLGFBQUEsaUJBQUEsUUFBQSxTQUFBLElBQUE7SUFDQSxJQUFBLFNBQUEsV0FBQSxPQUFBO01BQ0EsS0FBQSxTQUFBO01BQ0EsS0FBQSxLQUFBLFFBQUEsU0FBQTtLQUNBLEdBQUEsUUFBQSxNQUFBO01BQ0EsT0FBQSxNQUFBLFFBQUEsUUFBQTs7SUFFQSxJQUFBLGNBQUEsV0FBQSxPQUFBO01BQ0EsS0FBQTtNQUNBLE1BQUEsYUFBQSxRQUFBLE9BQUE7TUFDQSxLQUFBLGVBQUEsVUFBQSxLQUFBLEtBQUE7Ozs7OztJQU1BLFNBQUEsUUFBQTtLQUNBLElBQUEsUUFBQSxNQUFBLFNBQUE7O0tBRUEsSUFBQSxHQUFBLE1BQUEsYUFBQTtNQUNBLFFBQUEsRUFBQSxPQUFBLEdBQUEsTUFBQSxNQUFBO01BQ0EsTUFBQSxPQUFBLENBQUEsT0FBQTs7S0FFQSxZQUFBLEtBQUEsU0FBQTtLQUNBLFdBQUEsS0FBQSxhQUFBLGVBQUEsRUFBQSxTQUFBLE1BQUEsUUFBQSxTQUFBLElBQUE7OztJQUdBLFNBQUEsVUFBQTtLQUNBLElBQUEsUUFBQSxNQUFBLFNBQUE7TUFDQSxRQUFBO01BQ0EsUUFBQTtLQUNBLElBQUEsUUFBQTtLQUNBLEdBQUE7O01BRUEsUUFBQSxRQUFBLE9BQUEsTUFBQSxVQUFBLEtBQUEsS0FBQTtPQUNBLElBQUEsU0FBQSxJQUFBLFFBQUEsV0FBQSxTQUFBLFFBQUE7UUFDQSxRQUFBO1FBQ0EsUUFBQTs7O01BR0E7TUFDQSxRQUFBLFFBQUEsS0FBQSxRQUFBLElBQUEsUUFBQTtjQUNBLENBQUEsU0FBQSxRQUFBO0tBQ0EsUUFBQSxjQUFBO0tBQ0EsUUFBQTs7O0lBR0EsT0FBQTtLQUNBLFlBQUE7TUFDQSxPQUFBLFFBQUE7O0tBRUEsVUFBQSxVQUFBLFVBQUE7O01BRUEsSUFBQSxDQUFBLFVBQUE7T0FDQSxZQUFBLEtBQUEsU0FBQTtPQUNBLFdBQUEsS0FBQSxhQUFBLGVBQUEsRUFBQSxLQUFBLE1BQUEsUUFBQSxTQUFBLElBQUE7T0FDQTs7TUFFQSxZQUFBLEtBQUEsU0FBQSxTQUFBLFFBQUE7TUFDQSxJQUFBLFlBQUEsVUFBQTtPQUNBLFdBQUEsS0FBQSxhQUFBLGVBQUEsRUFBQSxTQUFBLFFBQUEsVUFBQSxNQUFBLFFBQUEsU0FBQSxJQUFBO2FBQ0E7T0FDQSxXQUFBLGFBQUEsU0FBQSxLQUFBLEtBQUEsUUFBQSxLQUFBLGFBQUEsZUFBQSxFQUFBLFNBQUEsUUFBQSxVQUFBLE1BQUEsUUFBQSxTQUFBLElBQUE7Ozs7Ozs7Ozs7O0FDN0xBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsUUFBQSxvQkFBQSxZQUFBLGNBQUEsVUFBQTs7Ozs7O0FDSEEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGtCQUFBLFdBQUEsbUJBQUEsV0FBQTs7RUFFQSxPQUFBO0dBQ0EsVUFBQTtHQUNBLE1BQUE7SUFDQSxLQUFBO0lBQ0EsVUFBQTs7R0FFQSxhQUFBO0dBQ0EsWUFBQTtHQUNBLE1BQUEsVUFBQSxRQUFBLFNBQUEsUUFBQTtJQUNBLE9BQUEsVUFBQTtJQUNBLE9BQUE7SUFDQSxPQUFBOzs7Ozs7Ozs7QUNoQkEsQ0FBQSxZQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsa0NBQUEsVUFBQSxRQUFBO0VBQ0EsT0FBQSxTQUFBO0dBQ0EsU0FBQTtHQUNBLFVBQUE7R0FDQSxVQUFBO0dBQ0EsYUFBQTtHQUNBLGlCQUFBO0dBQ0Esa0JBQUE7R0FDQSxlQUFBO0dBQ0EsaUJBQUE7R0FDQSxVQUFBOzs7Q0FHQSxPQUFBLFFBQUE7RUFDQSxRQUFBO0dBQ0EsTUFBQTs7RUFFQSxLQUFBOztFQUVBLE9BQUEsV0FBQSxZQUFBO0dBQ0EsT0FBQSxNQUFBLFFBQUEsU0FBQTtNQUNBLE1BQUE7TUFDQSxnQkFBQTtNQUNBLFFBQUE7T0FDQSxLQUFBO09BQ0EsT0FBQTtPQUNBLFFBQUE7T0FDQSxNQUFBOztNQUVBLEdBQUEsVUFBQSxHQUFBO09BQ0EsT0FBQSxFQUFBOztNQUVBLEdBQUEsVUFBQSxHQUFBO09BQ0EsT0FBQSxFQUFBOztNQUVBLFdBQUE7TUFDQSxZQUFBO01BQ0EsV0FBQTtNQUNBLG9CQUFBO01BQ0EseUJBQUE7OztNQUdBLE9BQUE7T0FDQSxXQUFBOztNQUVBLE9BQUE7T0FDQSxXQUFBO09BQ0EsbUJBQUE7O01BRUEsUUFBQTtPQUNBLFlBQUE7O01BRUEsT0FBQTtPQUNBLGFBQUE7Ozs7R0FJQSxHQUFBLE9BQUEsUUFBQSxVQUFBLE9BQUE7SUFDQSxPQUFBLE1BQUEsUUFBQSxNQUFBLFVBQUEsQ0FBQSxTQUFBLE9BQUEsTUFBQSxLQUFBLE9BQUEsTUFBQTs7R0FFQSxPQUFBLE9BQUE7O0VBRUEsT0FBQSxpQkFBQSxZQUFBO0dBQ0EsSUFBQSxZQUFBO0dBQ0EsT0FBQSxRQUFBO0lBQ0EsSUFBQTtJQUNBLElBQUE7O0dBRUEsUUFBQSxRQUFBLE9BQUEsV0FBQSxVQUFBLE1BQUEsS0FBQTtJQUNBLElBQUEsUUFBQTtLQUNBLElBQUE7S0FDQSxLQUFBLEtBQUE7S0FDQSxPQUFBLEtBQUE7S0FDQSxRQUFBOztJQUVBLFFBQUEsUUFBQSxPQUFBLE1BQUEsVUFBQSxNQUFBLEdBQUE7S0FDQSxNQUFBLE9BQUEsS0FBQTtNQUNBLElBQUE7TUFDQSxHQUFBLEtBQUEsS0FBQSxPQUFBO01BQ0EsR0FBQSxLQUFBLEtBQUEsT0FBQTs7S0FFQSxPQUFBLE1BQUEsTUFBQSxLQUFBLElBQUEsT0FBQSxNQUFBLEtBQUEsS0FBQSxLQUFBLE9BQUE7S0FDQSxPQUFBLE1BQUEsTUFBQSxLQUFBLElBQUEsT0FBQSxNQUFBLEtBQUEsS0FBQSxLQUFBLE9BQUE7O0lBRUEsVUFBQSxLQUFBOzs7R0FHQSxPQUFBLE1BQUEsT0FBQTtHQUNBLEdBQUEsT0FBQSxRQUFBLFVBQUEsT0FBQTtJQUNBLE9BQUEsTUFBQSxRQUFBLE1BQUEsVUFBQSxDQUFBLFNBQUEsT0FBQSxNQUFBLEtBQUEsT0FBQSxNQUFBOzs7RUFHQSxPQUFBLE9BQUEsUUFBQSxVQUFBLEdBQUEsR0FBQTtHQUNBLElBQUEsQ0FBQSxHQUFBO0lBQ0E7O0dBRUEsT0FBQTs7Ozs7O0FDbkdBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxrQkFBQSxVQUFBLGlCQUFBLENBQUEsZUFBQSxTQUFBLGFBQUE7O0VBRUEsSUFBQSxTQUFBO1FBQ0EsSUFBQSxTQUFBOztRQUVBLFNBQUEsTUFBQSxJQUFBO1lBQ0EsSUFBQSxLQUFBLEdBQUEsR0FBQSxhQUFBO1lBQ0EsSUFBQSxDQUFBLElBQUE7Z0JBQ0EsS0FBQSxFQUFBO2dCQUNBLEdBQUEsR0FBQSxhQUFBLHFCQUFBOztZQUVBLE9BQUE7O1FBRUEsU0FBQSxTQUFBLElBQUE7WUFDQSxJQUFBLFFBQUEsT0FBQTtZQUNBLElBQUEsQ0FBQSxPQUFBO2dCQUNBLFFBQUE7Z0JBQ0EsT0FBQSxNQUFBOztZQUVBLE9BQUE7OztRQUdBLFNBQUEsZUFBQSxTQUFBLE9BQUEsVUFBQSxTQUFBLFFBQUE7WUFDQSxPQUFBLFdBQUE7Z0JBQ0EsTUFBQSxZQUFBO2dCQUNBLE1BQUEsV0FBQTtnQkFDQSxNQUFBLFNBQUE7Z0JBQ0EsU0FBQSxRQUFBLFFBQUEsV0FBQTtvQkFDQSxJQUFBLFdBQUEsTUFBQSxXQUFBLFFBQUE7d0JBQ0EsUUFBQSxHQUFBLE1BQUEsU0FBQTs7b0JBRUEsTUFBQSxZQUFBO29CQUNBLE1BQUEsV0FBQTtvQkFDQSxNQUFBOzs7OztRQUtBLE9BQUE7WUFDQSxPQUFBLFNBQUEsU0FBQSxRQUFBOztvQkFFQSxJQUFBLFFBQUEsU0FBQSxNQUFBO29CQUNBLElBQUEsU0FBQSxDQUFBLE1BQUEsYUFBQSxNQUFBO3dCQUNBLE1BQUEsU0FBQSxRQUFBLEdBQUE7b0JBQ0EsSUFBQSxXQUFBLFlBQUEsU0FBQTt3QkFDQSxNQUFBLENBQUEsUUFBQSxTQUFBLE1BQUEsU0FBQTt3QkFDQSxJQUFBLENBQUEsUUFBQSxPQUFBLFNBQUE7O29CQUVBLElBQUEsVUFBQTt3QkFDQSxJQUFBLE1BQUEsV0FBQTs0QkFDQSxNQUFBOzhCQUNBLGVBQUE7NkNBQ0E7NkNBQ0E7NkNBQ0E7NkNBQ0E7NEJBQ0EsT0FBQSxNQUFBLFNBQUE7OzZCQUVBOzRCQUNBLE1BQUEsU0FBQTs0QkFDQSxPQUFBLGVBQUE7a0RBQ0E7a0RBQ0E7a0RBQ0E7a0RBQ0E7Ozs7Z0JBSUE7O1lBRUEsT0FBQSxTQUFBLFNBQUEsUUFBQTs7b0JBRUEsSUFBQSxRQUFBLFNBQUEsTUFBQTtvQkFDQSxJQUFBLFNBQUEsQ0FBQSxNQUFBLGFBQUEsTUFBQTt3QkFDQSxNQUFBLFNBQUEsUUFBQSxHQUFBOztvQkFFQSxJQUFBLFdBQUEsWUFBQSxTQUFBO3dCQUNBLE1BQUEsQ0FBQSxRQUFBLE9BQUEsU0FBQTt3QkFDQSxJQUFBLENBQUEsUUFBQSxTQUFBLE1BQUEsU0FBQTs7b0JBRUEsSUFBQSxVQUFBO3dCQUNBLElBQUEsTUFBQSxXQUFBOzRCQUNBLE1BQUEsU0FBQSxlQUFBOzBEQUNBOzBEQUNBOzBEQUNBOzBEQUNBOzRCQUNBLE9BQUEsTUFBQSxTQUFBOzs2QkFFQTs0QkFDQSxNQUFBLFNBQUE7NEJBQ0EsT0FBQSxlQUFBO2tEQUNBO2tEQUNBO2tEQUNBO2tEQUNBOzs7O2dCQUlBOzs7Ozs7QUN0R0EsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxRQUFBLG9CQUFBLFlBQUEsbUJBQUEsVUFBQTs7Ozs7O0FDSEEsQ0FBQSxZQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGtCQUFBLFVBQUEsWUFBQTs7Q0FFQSxTQUFBLFVBQUEsQ0FBQSxZQUFBOztDQUVBLFNBQUEsU0FBQSxVQUFBLGNBQUE7RUFDQSxPQUFBO0dBQ0EsVUFBQTtHQUNBLFNBQUE7R0FDQSxPQUFBO0lBQ0EsU0FBQTtJQUNBLFVBQUE7SUFDQSxNQUFBOztHQUVBLFlBQUE7R0FDQSxhQUFBO0dBQ0EsTUFBQTs7O0VBR0EsU0FBQSxxQkFBQSxRQUFBLFNBQUEsUUFBQTtHQUNBLFFBQUEsSUFBQSxPQUFBO0dBQ0EsT0FBQSxVQUFBO0tBQ0EsT0FBQTtHQUNBLFNBQUEsU0FBQTtJQUNBLFNBQUEsVUFBQTtNQUNBLGFBQUEsUUFBQSxJQUFBLENBQUEsT0FBQSxLQUFBLFNBQUE7Ozs7Ozs7QUMzQkEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxRQUFBLG9CQUFBLFlBQUEsa0VBQUEsU0FBQSxRQUFBLFNBQUEsVUFBQSxhQUFBO0VBQ0EsT0FBQSxPQUFBO0VBQ0EsT0FBQSxXQUFBO0VBQ0EsT0FBQSxpQkFBQTtFQUNBLE9BQUEsZ0JBQUE7RUFDQSxPQUFBLGNBQUE7RUFDQSxPQUFBLGFBQUE7O0VBRUE7O0VBRUEsU0FBQSxVQUFBO0dBQ0EsT0FBQTtHQUNBLE9BQUE7R0FDQSxPQUFBO0dBQ0EsT0FBQTtHQUNBLE9BQUEsT0FBQSxZQUFBLFVBQUEsU0FBQSxTQUFBO0lBQ0EsSUFBQSxZQUFBLFNBQUE7S0FDQSxPQUFBOztJQUVBLE9BQUE7SUFDQSxPQUFBOzs7R0FHQSxPQUFBLE9BQUEsV0FBQSxTQUFBLEdBQUEsRUFBQTtJQUNBLEdBQUEsTUFBQSxFQUFBO0tBQ0E7O0lBRUEsT0FBQTs7O0VBR0EsU0FBQSxZQUFBO0dBQ0EsT0FBQSxPQUFBLENBQUEsT0FBQTtHQUNBO0VBQ0EsU0FBQSxhQUFBO0lBQ0EsSUFBQSxPQUFBO0lBQ0EsUUFBQSxRQUFBLE9BQUEsTUFBQSxTQUFBLEtBQUE7S0FDQSxLQUFBLE9BQUEsU0FBQSxRQUFBLFdBQUEsS0FBQSxPQUFBLFNBQUE7S0FDQSxLQUFBLFdBQUEsU0FBQSxLQUFBOztJQUVBLElBQUEsU0FBQSxRQUFBLFdBQUEsT0FBQSxNQUFBLENBQUEsT0FBQSxTQUFBLEtBQUEsV0FBQTtJQUNBLElBQUEsSUFBQSxJQUFBLEVBQUEsSUFBQSxPQUFBLFFBQUEsSUFBQTtLQUNBLEdBQUEsT0FBQSxHQUFBLE9BQUEsT0FBQSxRQUFBLElBQUE7TUFDQSxPQUFBLEVBQUE7OztJQUdBLE9BQUEsUUFBQSxPQUFBOztFQUVBLFNBQUEsZUFBQTtJQUNBLE9BQUEsVUFBQSxDQUFBLE9BQUEsU0FBQTs7RUFFQSxTQUFBLFdBQUE7R0FDQSxPQUFBLFFBQUE7SUFDQSxTQUFBO0tBQ0EsT0FBQTtNQUNBLE1BQUE7O01BRUEsZ0JBQUE7TUFDQSxRQUFBO09BQ0EsS0FBQTtPQUNBLE9BQUE7T0FDQSxRQUFBO09BQ0EsTUFBQTs7TUFFQSxHQUFBLFVBQUEsR0FBQTtPQUNBLE9BQUEsRUFBQTs7TUFFQSxHQUFBLFVBQUEsR0FBQTtPQUNBLE9BQUEsRUFBQTs7TUFFQSxZQUFBO01BQ0EsV0FBQTtNQUNBLG9CQUFBO01BQ0EseUJBQUE7TUFDQSxRQUFBLENBQUEsS0FBQTtNQUNBLE9BQUE7T0FDQSxXQUFBOztNQUVBLE9BQUE7T0FDQSxXQUFBO09BQ0EsbUJBQUE7O01BRUEsT0FBQTtPQUNBLFdBQUE7T0FDQSxPQUFBO1FBQ0EsT0FBQTs7O01BR0EsTUFBQTtPQUNBLFlBQUE7Ozs7SUFJQSxNQUFBOztHQUVBLE9BQUEsT0FBQTs7O0VBR0EsU0FBQSxpQkFBQTs7R0FFQSxJQUFBLFlBQUE7R0FDQSxRQUFBLFFBQUEsT0FBQSxTQUFBLEtBQUEsVUFBQSxVQUFBLE1BQUEsS0FBQTtJQUNBLElBQUEsUUFBQTtLQUNBLEtBQUEsS0FBQTtLQUNBLE9BQUEsS0FBQTtLQUNBLFFBQUE7O0lBRUEsUUFBQSxRQUFBLE9BQUEsUUFBQSxLQUFBLFVBQUEsTUFBQTtLQUNBLE1BQUEsT0FBQSxLQUFBO01BQ0EsR0FBQSxLQUFBO01BQ0EsR0FBQSxLQUFBLEtBQUE7OztJQUdBLFVBQUEsS0FBQTs7R0FFQSxPQUFBLE1BQUEsT0FBQTs7Ozs7O0FDckhBLENBQUEsWUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxrQkFBQSxVQUFBLFlBQUEsWUFBQTtFQUNBLElBQUEsV0FBQSxVQUFBO0lBQ0EsT0FBQTtNQUNBLE1BQUE7OztFQUdBLE9BQUE7R0FDQSxVQUFBOztHQUVBLFlBQUE7R0FDQSxPQUFBO0lBQ0EsTUFBQTs7R0FFQSxNQUFBLFVBQUEsUUFBQSxTQUFBLFFBQUE7SUFDQSxJQUFBLFVBQUEsUUFBQSxPQUFBLFlBQUE7SUFDQSxPQUFBO0lBQ0EsT0FBQTtJQUNBLElBQUEsUUFBQTtLQUNBLFNBQUE7S0FDQSxTQUFBLENBQUEsU0FBQTtLQUNBLElBQUEsR0FBQSxNQUFBLFNBQUEsTUFBQSxDQUFBLEdBQUEsSUFBQSxLQUFBO0tBQ0EsSUFBQSxHQUFBLE1BQUEsTUFBQSxTQUFBLEtBQUEsT0FBQSxDQUFBLEdBQUEsSUFBQSxNQUFBLENBQUEsR0FBQTs7O0tBR0EsVUFBQTtLQUNBLFdBQUE7S0FDQSxjQUFBOztJQUVBLElBQUEsTUFBQSxHQUFBLE9BQUEsUUFBQTs7O0lBR0EsSUFBQSxNQUFBLElBQUEsT0FBQTtNQUNBLEtBQUEsU0FBQSxRQUFBLFVBQUE7TUFDQSxLQUFBLFVBQUEsU0FBQSxVQUFBO01BQ0EsT0FBQTtNQUNBLEtBQUEsYUFBQSxlQUFBLENBQUEsU0FBQSxTQUFBLFNBQUEsV0FBQTs7Ozs7Ozs7SUFRQSxJQUFBLFlBQUEsR0FBQSxPQUFBO01BQ0EsS0FBQTtNQUNBLE1BQUEsVUFBQSxHQUFBO01BQ0EsT0FBQTs7O0lBR0EsSUFBQSxNQUFBLEdBQUEsSUFBQTtNQUNBLFdBQUEsVUFBQSxHQUFBO01BQ0EsT0FBQSxLQUFBLElBQUEsR0FBQSxLQUFBLElBQUEsSUFBQSxLQUFBLElBQUEsRUFBQSxFQUFBOztNQUVBLFNBQUEsVUFBQSxHQUFBO01BQ0EsT0FBQSxLQUFBLElBQUEsR0FBQSxLQUFBLElBQUEsSUFBQSxLQUFBLElBQUEsRUFBQSxFQUFBLElBQUEsRUFBQTs7TUFFQSxZQUFBLFVBQUEsR0FBQTtNQUNBLE9BQUEsS0FBQSxJQUFBLEdBQUEsRUFBQSxJQUFBLEVBQUEsRUFBQSxLQUFBLEVBQUE7O01BRUEsWUFBQSxVQUFBLEdBQUE7TUFDQSxPQUFBLEtBQUEsSUFBQSxHQUFBLEVBQUEsRUFBQSxJQUFBLEVBQUE7OztJQUdBLElBQUEsV0FBQTtLQUNBLFdBQUE7S0FDQSxXQUFBO0tBQ0EsV0FBQTs7O0lBR0EsSUFBQSxRQUFBLFVBQUEsTUFBQSxPQUFBOztJQUVBLElBQUEsT0FBQSxJQUFBLFVBQUEsUUFBQSxLQUFBO0lBQ0EsS0FBQSxRQUFBLE9BQUE7TUFDQSxLQUFBLE1BQUEsVUFBQSxHQUFBLEdBQUE7TUFDQSxPQUFBLFVBQUE7O01BRUEsS0FBQSxLQUFBO01BQ0EsS0FBQSxhQUFBO01BQ0EsS0FBQSxTQUFBLFVBQUEsR0FBQTtNQUNBLE9BQUEsRUFBQSxRQUFBLFdBQUE7O01BRUEsTUFBQSxRQUFBO01BQ0EsR0FBQSxTQUFBOztJQUVBLElBQUEsT0FBQSxJQUFBLFVBQUEsUUFBQSxLQUFBO0lBQ0EsSUFBQSxZQUFBLEtBQUEsUUFBQSxPQUFBO01BQ0EsTUFBQSxnQkFBQTtNQUNBLEtBQUEsZUFBQSxVQUFBLEdBQUE7TUFDQSxJQUFBLEVBQUE7T0FDQSxPQUFBOzs7T0FHQSxPQUFBOztNQUVBLEtBQUEsTUFBQSxVQUFBLEdBQUE7TUFDQSxPQUFBLFVBQUEsRUFBQTs7TUFFQSxLQUFBLFNBQUEsVUFBQSxHQUFBO01BQ0EsT0FBQTs7TUFFQSxLQUFBLE1BQUEsVUFBQSxHQUFBO01BQ0EsT0FBQSxFQUFBLFFBQUEsU0FBQTs7TUFFQSxLQUFBLGFBQUEsVUFBQSxHQUFBO01BQ0EsSUFBQSxZQUFBLENBQUEsRUFBQSxRQUFBLElBQUEsTUFBQSxLQUFBLFNBQUE7T0FDQSxjQUFBLEVBQUEsSUFBQSxNQUFBLElBQUEsQ0FBQTtPQUNBLFFBQUEsRUFBQSxFQUFBLElBQUEsRUFBQSxLQUFBLEtBQUEsTUFBQSxLQUFBLEtBQUEsTUFBQSxZQUFBLGFBQUE7T0FDQSxTQUFBLFNBQUEsWUFBQSxDQUFBLEtBQUE7T0FDQSxTQUFBLENBQUEsRUFBQSxFQUFBLEtBQUEsZUFBQTtPQUNBLFlBQUEsUUFBQSxLQUFBLENBQUEsTUFBQTtNQUNBLElBQUEsRUFBQSxRQUFBLFlBQUEsRUFBQSxRQUFBLFVBQUEsVUFBQTtNQUNBLElBQUEsRUFBQSxTQUFBLEdBQUE7T0FDQSxTQUFBLENBQUE7T0FDQSxTQUFBO09BQ0EsV0FBQTthQUNBLElBQUEsRUFBQSxTQUFBLEdBQUEsVUFBQSxDQUFBO1dBQ0EsSUFBQSxFQUFBLFNBQUEsR0FBQSxVQUFBLENBQUE7V0FDQSxJQUFBLEVBQUEsU0FBQSxHQUFBLFVBQUE7TUFDQSxPQUFBLFlBQUEsU0FBQSxnQkFBQSxTQUFBLGFBQUEsV0FBQTs7TUFFQSxHQUFBLFNBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUErQkEsVUFBQSxPQUFBO01BQ0EsS0FBQSxLQUFBO01BQ0EsS0FBQSxVQUFBLEdBQUE7O01BRUEsSUFBQSxFQUFBLFNBQUEsS0FBQSxFQUFBLFFBQUEsWUFBQSxFQUFBLFFBQUEsWUFBQSxFQUFBLFFBQUEsWUFBQSxFQUFBLFFBQUE7T0FDQSxPQUFBLEVBQUEsS0FBQSxNQUFBLEtBQUEsS0FBQSxPQUFBLEVBQUEsS0FBQSxNQUFBLEtBQUEsTUFBQTs7T0FFQSxPQUFBLEVBQUEsS0FBQSxNQUFBLEtBQUE7O0lBRUEsVUFBQSxPQUFBO01BQ0EsS0FBQSxLQUFBO01BQ0EsS0FBQSxNQUFBO01BQ0EsS0FBQSxVQUFBLEdBQUE7O01BRUEsSUFBQSxFQUFBLFNBQUEsS0FBQSxFQUFBLFFBQUEsWUFBQSxFQUFBLFFBQUEsWUFBQSxFQUFBLFFBQUEsWUFBQSxFQUFBLFFBQUE7T0FDQSxPQUFBLENBQUEsRUFBQSxLQUFBLE1BQUEsS0FBQSxNQUFBLE1BQUEsT0FBQSxFQUFBLEtBQUEsTUFBQSxLQUFBLE1BQUE7O09BRUEsT0FBQSxDQUFBLEVBQUEsS0FBQSxNQUFBLEtBQUEsTUFBQSxNQUFBLE9BQUEsRUFBQSxLQUFBLE1BQUEsS0FBQSxNQUFBOztJQUVBLFVBQUEsT0FBQTtNQUNBLEtBQUEsS0FBQTtNQUNBLEtBQUEsTUFBQTtNQUNBLEtBQUEsVUFBQSxHQUFBO01BQ0EsSUFBQSxFQUFBLFNBQUEsS0FBQSxFQUFBLFFBQUEsWUFBQSxFQUFBLFFBQUEsWUFBQSxFQUFBLFFBQUEsWUFBQSxFQUFBLFFBQUE7T0FDQSxPQUFBLENBQUEsRUFBQSxLQUFBLE1BQUEsS0FBQSxNQUFBLE1BQUEsT0FBQSxFQUFBLEtBQUEsTUFBQSxLQUFBLE1BQUE7O09BRUEsT0FBQSxDQUFBLEVBQUEsS0FBQSxNQUFBLEtBQUEsTUFBQSxNQUFBLE9BQUEsRUFBQSxLQUFBLE1BQUEsS0FBQSxNQUFBLElBQUE7OztJQUdBLFNBQUEsTUFBQSxHQUFBOztLQUVBLEtBQUE7T0FDQSxTQUFBO09BQ0EsVUFBQSxLQUFBLFNBQUE7Ozs7S0FJQSxLQUFBLE1BQUEsY0FBQSxVQUFBLEdBQUE7T0FDQSxPQUFBLFdBQUEsR0FBQSxLQUFBLE9BQUEsR0FBQSxPQUFBLE1BQUEsTUFBQTs7T0FFQTtPQUNBLFNBQUE7T0FDQSxVQUFBLGVBQUEsVUFBQSxHQUFBO09BQ0EsT0FBQSxZQUFBO1FBQ0EsSUFBQSxFQUFBO1NBQ0EsT0FBQTs7O1NBR0EsT0FBQTs7O09BR0EsVUFBQSxhQUFBLFVBQUEsR0FBQTtPQUNBLElBQUEsWUFBQSxDQUFBLEVBQUEsUUFBQSxJQUFBLE1BQUEsS0FBQSxTQUFBO09BQ0EsT0FBQSxZQUFBO1FBQ0EsSUFBQSxZQUFBLENBQUEsRUFBQSxRQUFBLElBQUEsTUFBQSxLQUFBLFNBQUE7U0FDQSxjQUFBLEVBQUEsSUFBQSxNQUFBLElBQUEsQ0FBQTtTQUNBLFFBQUEsRUFBQSxFQUFBLElBQUEsRUFBQSxLQUFBLEtBQUEsTUFBQSxLQUFBLEtBQUEsTUFBQSxZQUFBLGFBQUE7U0FDQSxTQUFBLFNBQUEsWUFBQSxDQUFBLEtBQUE7U0FDQSxTQUFBLENBQUEsRUFBQSxFQUFBLEtBQUEsZUFBQTtTQUNBLFlBQUEsUUFBQSxLQUFBLENBQUEsTUFBQTtRQUNBLElBQUEsRUFBQSxRQUFBLFlBQUEsRUFBQSxRQUFBLFVBQUEsVUFBQTtRQUNBLElBQUEsRUFBQSxTQUFBLEdBQUE7U0FDQSxTQUFBLENBQUE7U0FDQSxTQUFBO1NBQ0EsV0FBQTtlQUNBLElBQUEsRUFBQSxTQUFBLEdBQUEsVUFBQSxDQUFBO2FBQ0EsSUFBQSxFQUFBLFNBQUEsR0FBQSxVQUFBLENBQUE7YUFDQSxJQUFBLEVBQUEsU0FBQSxHQUFBLFVBQUE7UUFDQSxPQUFBLFlBQUEsU0FBQSxnQkFBQSxTQUFBLGFBQUEsV0FBQTs7O09BR0EsTUFBQSxnQkFBQSxVQUFBLEdBQUE7T0FDQSxPQUFBLFdBQUEsR0FBQSxLQUFBLElBQUE7O09BRUEsS0FBQSxPQUFBLFVBQUEsR0FBQTtPQUNBLEdBQUEsT0FBQSxNQUFBLE1BQUEsY0FBQSxXQUFBLEdBQUEsS0FBQSxPQUFBOzs7OztJQUtBLFNBQUEsV0FBQSxHQUFBLEdBQUE7S0FDQSxJQUFBLE1BQUEsR0FBQSxPQUFBO0tBQ0EsSUFBQSxFQUFBLFVBQUE7TUFDQSxPQUFBLEVBQUEsU0FBQSxLQUFBLFVBQUEsR0FBQTtPQUNBLE9BQUEsV0FBQSxHQUFBOzs7S0FHQSxPQUFBOzs7SUFHQSxTQUFBLFNBQUEsR0FBQTtLQUNBLE9BQUEsRUFBQTtLQUNBLElBQUEsRUFBQTtNQUNBLE9BQUEsRUFBQTtVQUNBO01BQ0EsSUFBQSxZQUFBOztNQUVBLElBQUEsSUFBQTtNQUNBLE9BQUEsRUFBQSxPQUFBLFNBQUEsTUFBQTtPQUNBO01BQ0EsSUFBQSxhQUFBLENBQUEsYUFBQSxJQUFBLElBQUE7TUFDQSxPQUFBLE9BQUEsTUFBQSxFQUFBLE9BQUEsT0FBQSxLQUFBLFlBQUEsS0FBQTs7Ozs7SUFLQSxTQUFBLFNBQUEsR0FBQTtLQUNBLElBQUEsS0FBQSxLQUFBO01BQ0EsS0FBQSxHQUFBLFlBQUEsRUFBQSxVQUFBLENBQUEsRUFBQSxHQUFBLEVBQUEsSUFBQSxFQUFBLEtBQUE7TUFDQSxLQUFBLEdBQUEsWUFBQSxFQUFBLFVBQUEsQ0FBQSxFQUFBLEdBQUE7TUFDQSxLQUFBLEdBQUEsWUFBQSxFQUFBLFNBQUEsQ0FBQSxFQUFBLElBQUEsS0FBQSxHQUFBOztLQUVBLE9BQUEsVUFBQSxHQUFBO01BQ0EsT0FBQSxVQUFBLEdBQUE7T0FDQSxFQUFBLE9BQUEsR0FBQTtPQUNBLEVBQUEsT0FBQSxHQUFBLElBQUEsTUFBQSxHQUFBO09BQ0EsT0FBQSxJQUFBOzs7OztJQUtBLFNBQUEsS0FBQSxHQUFBO0tBQ0EsT0FBQSxFQUFBLFdBQUEsS0FBQSxJQUFBLE1BQUEsTUFBQSxFQUFBLFNBQUEsSUFBQSxTQUFBLEVBQUEsSUFBQSxFQUFBOzs7Ozs7O0FDcFJBLENBQUEsWUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLDJCQUFBLFVBQUEsUUFBQTs7RUFFQSxPQUFBLFdBQUEsWUFBQTtHQUNBLE9BQUEsUUFBQTtJQUNBLFNBQUE7S0FDQSxPQUFBO01BQ0EsTUFBQTtNQUNBLFFBQUE7TUFDQSxZQUFBO09BQ0EsWUFBQTtPQUNBLFNBQUE7T0FDQSxVQUFBO09BQ0EsUUFBQTtPQUNBLE1BQUE7T0FDQSxZQUFBO09BQ0EsVUFBQTtRQUNBLE9BQUE7UUFDQSxTQUFBO1FBQ0EsVUFBQTtRQUNBLFFBQUE7OztNQUdBLFdBQUE7T0FDQSxZQUFBO09BQ0EsV0FBQTtPQUNBLFlBQUE7T0FDQSxnQkFBQTtPQUNBLFdBQUE7T0FDQSxrQkFBQTtPQUNBLFlBQUE7T0FDQSxXQUFBO09BQ0EsYUFBQTtPQUNBLGlCQUFBOztPQUVBLFVBQUE7UUFDQSxRQUFBO1FBQ0EsT0FBQTs7T0FFQSxVQUFBO09BQ0EsUUFBQTtPQUNBLGVBQUE7T0FDQSxNQUFBOzs7O0lBSUEsTUFBQTs7R0FFQSxPQUFBLE9BQUE7O0VBRUEsSUFBQSxZQUFBLFVBQUEsTUFBQTtHQUNBLElBQUEsV0FBQTtHQUNBLFFBQUEsUUFBQSxNQUFBLFVBQUEsTUFBQTtJQUNBLElBQUEsUUFBQTtLQUNBLFFBQUEsS0FBQTtLQUNBLFFBQUEsS0FBQTtLQUNBLFNBQUEsS0FBQTtLQUNBLFlBQUEsVUFBQSxLQUFBOztJQUVBLEdBQUEsS0FBQSxNQUFBO0tBQ0EsTUFBQSxRQUFBLEtBQUE7O0lBRUEsR0FBQSxLQUFBLEtBQUE7S0FDQSxNQUFBLE9BQUEsS0FBQTs7SUFFQSxTQUFBLEtBQUE7O0dBRUEsT0FBQTs7RUFFQSxPQUFBLGlCQUFBLFlBQUE7R0FDQSxJQUFBLFlBQUE7SUFDQSxRQUFBLE9BQUEsS0FBQTtJQUNBLFNBQUEsT0FBQSxLQUFBO0lBQ0EsWUFBQSxVQUFBLE9BQUEsS0FBQTtJQUNBLFFBQUE7O0dBRUEsT0FBQSxNQUFBLE9BQUE7R0FDQSxPQUFBOztFQUVBLE9BQUEsT0FBQSxRQUFBLFVBQUEsR0FBQSxHQUFBO0dBQ0EsSUFBQSxDQUFBLEdBQUE7SUFDQTs7R0FFQSxPQUFBOzs7Ozs7QUNyRkEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsNENBQUEsU0FBQSxRQUFBLGNBQUE7O1FBRUEsT0FBQSxPQUFBLFVBQUE7O1lBRUEsY0FBQTs7O1FBR0EsT0FBQSxPQUFBLFVBQUE7U0FDQSxjQUFBOzs7Ozs7QUFNQSIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0dmFyIGFwcCA9IGFuZ3VsYXIubW9kdWxlKCdhcHAnLFxuXHRcdFtcblx0XHQnYXBwLmNvbnRyb2xsZXJzJyxcblx0XHQnYXBwLmZpbHRlcnMnLFxuXHRcdCdhcHAuc2VydmljZXMnLFxuXHRcdCdhcHAuZGlyZWN0aXZlcycsXG5cdFx0J2FwcC5yb3V0ZXMnLFxuXHRcdCdhcHAuY29uZmlnJyxcblx0XHRdKTtcblxuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAucm91dGVzJywgWyd1aS5yb3V0ZXInLCAnbmdTdG9yYWdlJywgJ3NhdGVsbGl6ZXInXSk7XG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnLCBbJ3Ntb290aFNjcm9sbCcsJ3VpLnJvdXRlcicsICduZ01hdGVyaWFsJywgJ25nU3RvcmFnZScsICdyZXN0YW5ndWxhcicsICduZ01kSWNvbnMnLCAnYW5ndWxhci1sb2FkaW5nLWJhcicsICduZ01lc3NhZ2VzJywgJ25nU2FuaXRpemUnLCBcImxlYWZsZXQtZGlyZWN0aXZlXCIsJ252ZDMnLCAnbmdDc3ZJbXBvcnQnLCdzdGlja3knXSk7XG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZmlsdGVycycsIFtdKTtcblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5zZXJ2aWNlcycsIFsndWkucm91dGVyJywgJ25nU3RvcmFnZScsICdyZXN0YW5ndWxhciddKTtcblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5kaXJlY3RpdmVzJywgWydzbW9vdGhTY3JvbGwnXSk7XG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29uZmlnJywgW10pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAucm91dGVzJykuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIpe1xuXG5cdFx0dmFyIGdldFZpZXcgPSBmdW5jdGlvbih2aWV3TmFtZSl7XG5cdFx0XHRyZXR1cm4gJy92aWV3cy9hcHAvJyArIHZpZXdOYW1lICsgJy8nICsgdmlld05hbWUgKyAnLmh0bWwnO1xuXHRcdH07XG5cblx0XHQkdXJsUm91dGVyUHJvdmlkZXIub3RoZXJ3aXNlKCcvZXBpJyk7XG5cblx0XHQkc3RhdGVQcm92aWRlclxuXHRcdFx0LnN0YXRlKCdhcHAnLCB7XG5cdFx0XHRcdGFic3RyYWN0OiB0cnVlLFxuXHRcdFx0XHR2aWV3czoge1xuXHRcdFx0XHQvKlx0c2lkZWJhcjoge1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6IGdldFZpZXcoJ3NpZGViYXInKVxuXHRcdFx0XHRcdH0sKi9cblx0XHRcdFx0XHRoZWFkZXI6IHtcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdoZWFkZXInKVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0bWFpbjoge31cblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLmVwaScsIHtcblx0XHRcdFx0dXJsOiAnL2VwaScsXG5cdFx0XHRcdHZpZXdzOiB7XG5cdFx0XHRcdFx0J21haW5AJzoge1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6IGdldFZpZXcoJ2VwaScpLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlcjogJ0VwaUN0cmwnLFxuXHRcdFx0XHRcdFx0cmVzb2x2ZTp7XG5cdFx0XHRcdFx0XHRcdEVQSTogZnVuY3Rpb24oRGF0YVNlcnZpY2Upe1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBEYXRhU2VydmljZS5nZXRBbGwoJy9lcGkveWVhci8yMDE0Jylcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0J21hcEAnOntcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdtYXAnKVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLmVwaS5zZWxlY3RlZCcse1xuXHRcdFx0XHR1cmw6ICcvOml0ZW0nXG5cdFx0XHR9KVxuXHRcdFx0LnN0YXRlKCdhcHAuaW1wb3J0Y3N2Jywge1xuXHRcdFx0XHR1cmw6ICcvaW1wb3J0ZXInLFxuXHRcdFx0XHRkYXRhOiB7cGFnZU5hbWU6ICdJbXBvcnQgQ1NWJ30sXG5cdFx0XHRcdHZpZXdzOiB7XG5cdFx0XHRcdFx0J21haW5AJzoge1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6IGdldFZpZXcoJ2ltcG9ydGNzdicpXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHQnbWFwJzp7fVxuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXG5cblx0fSk7XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAucm91dGVzJykucnVuKGZ1bmN0aW9uKCRyb290U2NvcGUpe1xuXHRcdCRyb290U2NvcGUuJG9uKFwiJHN0YXRlQ2hhbmdlU3RhcnRcIiwgZnVuY3Rpb24oZXZlbnQsIHRvU3RhdGUpe1xuXHRcdFx0aWYgKHRvU3RhdGUuZGF0YSAmJiB0b1N0YXRlLmRhdGEucGFnZU5hbWUpe1xuXHRcdFx0XHQkcm9vdFNjb3BlLmN1cnJlbnRfcGFnZSA9IHRvU3RhdGUuZGF0YS5wYWdlTmFtZTtcblx0XHRcdH1cblx0XHRcdCAkcm9vdFNjb3BlLnN0YXRlSXNMb2FkaW5nID0gdHJ1ZTtcblx0XHR9KTtcblx0XHQkcm9vdFNjb3BlLiRvbihcIiRzdGF0ZUNoYW5nZVN1Y2Nlc3NcIiwgZnVuY3Rpb24oZXZlbnQsIHRvU3RhdGUpe1xuXHRcdFx0ICRyb290U2NvcGUuc3RhdGVJc0xvYWRpbmcgPSBmYWxzZTtcblx0XHR9KTtcblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbmZpZycpLmNvbmZpZyhmdW5jdGlvbiAoJGF1dGhQcm92aWRlcil7XG4gICAgICAgIC8vIFNhdGVsbGl6ZXIgY29uZmlndXJhdGlvbiB0aGF0IHNwZWNpZmllcyB3aGljaCBBUElcbiAgICAgICAgLy8gcm91dGUgdGhlIEpXVCBzaG91bGQgYmUgcmV0cmlldmVkIGZyb21cbiAgICAgICAgJGF1dGhQcm92aWRlci5sb2dpblVybCA9ICcvYXBpLzEvYXV0aGVudGljYXRlL2F1dGgnO1xuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbmZpZycpLmNvbmZpZyhmdW5jdGlvbiAoY2ZwTG9hZGluZ0JhclByb3ZpZGVyKXtcblx0XHRjZnBMb2FkaW5nQmFyUHJvdmlkZXIuaW5jbHVkZVNwaW5uZXIgPSBmYWxzZTtcblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb25maWcnKS5jb25maWcoIGZ1bmN0aW9uKFJlc3Rhbmd1bGFyUHJvdmlkZXIpIHtcblx0XHRSZXN0YW5ndWxhclByb3ZpZGVyXG5cdFx0LnNldEJhc2VVcmwoJy9hcGkvMS8nKTtcblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb25maWcnKS5jb25maWcoZnVuY3Rpb24oJG1kVGhlbWluZ1Byb3ZpZGVyKSB7XG5cdFx0LyogRm9yIG1vcmUgaW5mbywgdmlzaXQgaHR0cHM6Ly9tYXRlcmlhbC5hbmd1bGFyanMub3JnLyMvVGhlbWluZy8wMV9pbnRyb2R1Y3Rpb24gKi9cblx0XHQkbWRUaGVtaW5nUHJvdmlkZXIudGhlbWUoJ2RlZmF1bHQnKVxuXHRcdC5wcmltYXJ5UGFsZXR0ZSgnaW5kaWdvJylcblx0XHQuYWNjZW50UGFsZXR0ZSgnZ3JleScpXG5cdFx0Lndhcm5QYWxldHRlKCdyZWQnKTtcblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5maWx0ZXJzJykuZmlsdGVyKCAnY2FwaXRhbGl6ZScsIGZ1bmN0aW9uKCl7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uKGlucHV0LCBhbGwpIHtcblx0XHRcdHJldHVybiAoISFpbnB1dCkgPyBpbnB1dC5yZXBsYWNlKC8oW15cXFdfXStbXlxccy1dKikgKi9nLGZ1bmN0aW9uKHR4dCl7XG5cdFx0XHRcdHJldHVybiB0eHQuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyB0eHQuc3Vic3RyKDEpLnRvTG93ZXJDYXNlKCk7XG5cdFx0XHR9KSA6ICcnO1xuXHRcdH07XG5cdH0pO1xufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmZpbHRlcnMnKS5maWx0ZXIoICdodW1hblJlYWRhYmxlJywgZnVuY3Rpb24oKXtcblx0XHRyZXR1cm4gZnVuY3Rpb24gaHVtYW5pemUoc3RyKSB7XG5cdFx0XHRpZiAoICFzdHIgKXtcblx0XHRcdFx0cmV0dXJuICcnO1xuXHRcdFx0fVxuXHRcdFx0dmFyIGZyYWdzID0gc3RyLnNwbGl0KCdfJyk7XG5cdFx0XHRmb3IgKHZhciBpPTA7IGk8ZnJhZ3MubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0ZnJhZ3NbaV0gPSBmcmFnc1tpXS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIGZyYWdzW2ldLnNsaWNlKDEpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGZyYWdzLmpvaW4oJyAnKTtcblx0XHR9O1xuXHR9KTtcbn0pKCk7IiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZmlsdGVycycpLmZpbHRlciggJ3RydXN0SHRtbCcsIGZ1bmN0aW9uKCAkc2NlICl7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uKCBodG1sICl7XG5cdFx0XHRyZXR1cm4gJHNjZS50cnVzdEFzSHRtbChodG1sKTtcblx0XHR9O1xuXHR9KTtcbn0pKCk7IiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZmlsdGVycycpLmZpbHRlcigndWNmaXJzdCcsIGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBmdW5jdGlvbiggaW5wdXQgKSB7XG5cdFx0XHRpZiAoICFpbnB1dCApe1xuXHRcdFx0XHRyZXR1cm4gbnVsbDtcblx0XHRcdH1cblx0XHRcdHJldHVybiBpbnB1dC5zdWJzdHJpbmcoMCwgMSkudG9VcHBlckNhc2UoKSArIGlucHV0LnN1YnN0cmluZygxKTtcblx0XHR9O1xuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5zZXJ2aWNlcycpLmZhY3RvcnkoJ0RhdGFTZXJ2aWNlJywgRGF0YVNlcnZpY2UpO1xuICAgIERhdGFTZXJ2aWNlLiRpbmplY3QgPSBbJ1Jlc3Rhbmd1bGFyJ107XG5cbiAgICBmdW5jdGlvbiBEYXRhU2VydmljZShSZXN0YW5ndWxhcil7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZ2V0QWxsOiBnZXRBbGwsXG4gICAgICAgICAgZ2V0T25lOiBnZXRPbmVcbiAgICAgICAgfTtcblxuICAgICAgICBmdW5jdGlvbiBnZXRBbGwocm91dGUpe1xuICAgICAgICAgIHZhciBkYXRhID0gUmVzdGFuZ3VsYXIuYWxsKHJvdXRlKS5nZXRMaXN0KCk7XG4gICAgICAgICAgICBkYXRhLnRoZW4oZnVuY3Rpb24oKXt9LCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICBhbGVydCgnZXJyb3InKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gZ2V0T25lKHJvdXRlLCBpZCl7XG4gICAgICAgICAgcmV0dXJuIFJlc3Rhbmd1bGFyLm9uZShyb3V0ZSwgaWQpLmdldCgpO1xuICAgICAgICB9XG4gICAgfVxuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLnNlcnZpY2VzJykuZmFjdG9yeSgnSW5kZXhTZXJ2aWNlJywgZnVuY3Rpb24oKXtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBnZXRFcGk6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICBcdFx0XHQgbmFtZTonRVBJJyxcbiAgICAgICAgICAgICAgIHRpdGxlOiAnRVBJJyxcbiAgICAgICAgXHRcdFx0IGZ1bGxfbmFtZTogJ0Vudmlyb25tZW50IFBlcmZvcm1hbmNlIEluZGV4JyxcbiAgICAgICAgXHRcdFx0IHRhYmxlOiAnZXBpJyxcbiAgICAgICAgXHRcdFx0IGFsbENvdW50cmllczogJ3llcycsXG4gICAgICAgIFx0XHRcdCBjb3VudHJpZXM6IFtdLFxuICAgICAgICBcdFx0XHQgc2NvcmVfZmllbGRfbmFtZTogJ3Njb3JlJyxcbiAgICAgICAgXHRcdFx0IGNoYW5nZV9maWVsZF9uYW1lOiAncGVyY2VudF9jaGFuZ2UnLFxuICAgICAgICBcdFx0XHQgb3JkZXJfZmllbGQ6ICd5ZWFyJyxcbiAgICAgICAgXHRcdFx0IGNvdW50cmllc19pZF9maWVsZDogJ2NvdW50cnlfaWQnLFxuICAgICAgICBcdFx0XHQgY291bnRyaWVzX2lzb19maWVsZDogJ2lzbycsXG4gICAgICAgICAgICAgICBjb2xvcjogJyMzOTM2MzUnLFxuICAgICAgICAgICAgICAgc2l6ZToxLFxuICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ICc8cD5UaGUgRW52aXJvbm1lbnRhbCBQZXJmb3JtYW5jZSBJbmRleCAoRVBJKSByYW5rcyBob3cgd2VsbCBjb3VudHJpZXMgcGVyZm9ybSBvbiBoaWdoLXByaW9yaXR5IGVudmlyb25tZW50YWwgaXNzdWVzIGluIHR3byBicm9hZCBwb2xpY3kgYXJlYXM6IHByb3RlY3Rpb24gb2YgaHVtYW4gaGVhbHRoIGZyb20gZW52aXJvbm1lbnRhbCBoYXJtIGFuZCBwcm90ZWN0aW9uIG9mIGVjb3N5c3RlbXMuPC9wPjxwPlRoZSBFbnZpcm9ubWVudGFsIFBlcmZvcm1hbmNlIEluZGV4IChFUEkpIGlzIGNvbnN0cnVjdGVkIHRocm91Z2ggdGhlIGNhbGN1bGF0aW9uIGFuZCBhZ2dyZWdhdGlvbiBvZiAyMCBpbmRpY2F0b3JzIHJlZmxlY3RpbmcgbmF0aW9uYWwtbGV2ZWwgZW52aXJvbm1lbnRhbCBkYXRhLiBUaGVzZSBpbmRpY2F0b3JzIGFyZSBjb21iaW5lZCBpbnRvIG5pbmUgaXNzdWUgY2F0ZWdvcmllcywgZWFjaCBvZiB3aGljaCBmaXQgdW5kZXIgb25lIG9mIHR3byBvdmVyYXJjaGluZyBvYmplY3RpdmVzLjwvcD4nLFxuICAgICAgICAgICAgICAgY2FwdGlvbjogJ1RoZSAyMDE0IEVQSSBGcmFtZXdvcmsgaW5jbHVkZXMgOSBpc3N1ZXMgYW5kIDIwIGluZGljYXRvcnMuIEFjY2VzcyB0byBFbGVjdHJpY2l0eSBpcyBub3QgaW5jbHVkZWQgaW4gdGhlIGZpZ3VyZSBiZWNhdXNlIGl0IGlzIG5vdCB1c2VkIHRvIGNhbGN1bGF0ZSBjb3VudHJ5IHNjb3Jlcy4gQ2xpY2sgb24gdGhlIGludGVyYWN0aXZlIGZpZ3VyZSBhYm92ZSB0byBleHBsb3JlIHRoZSBFUEkgZnJhbWV3b3JrLicsXG4gICAgICAgICAgICAgICBjaGlsZHJlbjpbe1xuICAgICAgICBcdFx0XHRcdCBjb2x1bW5fbmFtZTogJ2VoJyxcbiAgICAgICAgXHRcdFx0XHQgdGl0bGU6ICdFbnZpcm9tZW50YWwgSGVhbHRoJyxcbiAgICAgICAgXHRcdFx0XHQgcmFuZ2U6WzAsIDEwMF0sXG4gICAgICAgIFx0XHRcdFx0IGljb246JycsXG4gICAgICAgIFx0XHRcdFx0IGNvbG9yOicjY2MzZjE2JyxcbiAgICAgICAgXHRcdFx0XHQgY2hpbGRyZW46W3tcbiAgICAgICAgXHRcdFx0XHRcdCBjb2x1bW5fbmFtZTonZWhfaGknLFxuICAgICAgICBcdFx0XHRcdFx0IHRpdGxlOidIZWFsdGggSW1wYWN0JyxcbiAgICAgICAgXHRcdFx0XHRcdCBpY29uOiAnbWFuJyxcbiAgICAgICAgXHRcdFx0XHRcdCB1bmljb2RlOiAnXFx1ZTYwNScsXG4gICAgICAgIFx0XHRcdFx0XHQgY29sb3I6ICcjZjM5NDE5JyxcbiAgICAgICAgXHRcdFx0XHRcdCBjaGlsZHJlbjpbe1xuICAgICAgICBcdFx0XHRcdFx0XHQgY29sdW1uX25hbWU6ICdlaF9oaV9jaGlsZF9tb3J0YWxpdHknLFxuICAgICAgICBcdFx0XHRcdFx0XHQgdGl0bGU6J0NoaWxkIE1vcnRhbGl0eScsXG4gICAgICAgICAgICAgICAgICAgICBzaXplOjYwNzQsXG4gICAgICAgIFx0XHRcdFx0XHRcdCBpY29uOicnLFxuICAgICAgICBcdFx0XHRcdFx0XHQgY29sb3I6JyNmN2E5MzcnLFxuICAgICAgICBcdFx0XHRcdFx0XHQgZGVzY3JpcHRpb246J1Byb2JhYmlsaXR5IG9mIGR5aW5nIGJldHdlZW4gYSBjaGlsZHMgZmlyc3QgYW5kIGZpZnRoIGJpcnRoZGF5cyAoYmV0d2VlbiBhZ2UgMSBhbmQgNSknXG4gICAgICAgIFx0XHRcdFx0XHQgfV1cbiAgICAgICAgXHRcdFx0XHQgfSx7XG4gICAgICAgIFx0XHRcdFx0XHQgY29sdW1uX25hbWU6J2VoX2FxJyxcbiAgICAgICAgXHRcdFx0XHRcdCB0aXRsZTonQWlyIFF1YWxpdHknLFxuICAgICAgICBcdFx0XHRcdFx0IGNvbG9yOiAnI2Y2YzcwYScsXG4gICAgICAgIFx0XHRcdFx0XHQgaWNvbjogJ3NpbmsnLFxuICAgICAgICBcdFx0XHRcdFx0IHVuaWNvZGU6ICdcXHVlNjA0JyxcbiAgICAgICAgXHRcdFx0XHRcdCBjaGlsZHJlbjpbe1xuICAgICAgICBcdFx0XHRcdFx0XHQgY29sdW1uX25hbWU6ICdlaF9hcV9ob3VzZWhvbGRfYWlyX3F1YWxpdHknLFxuICAgICAgICBcdFx0XHRcdFx0XHQgdGl0bGU6J0hvdXNlaG9sZCBBaXIgUXVhbGl0eScsXG4gICAgICAgICAgICAgICAgICAgICBzaXplOjIwMDMsXG4gICAgICAgIFx0XHRcdFx0XHRcdCBpY29uOicnLFxuICAgICAgICBcdFx0XHRcdFx0XHQgY29sb3I6JyNmYWQzM2QnLFxuICAgICAgICBcdFx0XHRcdFx0XHQgZGVzY3JpcHRpb246J1BlcmNlbnRhZ2Ugb2YgdGhlIHBvcHVsYXRpb24gdXNpbmcgc29saWQgZnVlbHMgYXMgcHJpbWFyeSBjb29raW5nIGZ1ZWwuJ1xuICAgICAgICBcdFx0XHRcdFx0IH0se1xuICAgICAgICBcdFx0XHRcdFx0XHQgY29sdW1uX25hbWU6ICdlaF9hcV9leHBvc3VyZV9wbTI1JyxcbiAgICAgICAgXHRcdFx0XHRcdFx0IHRpdGxlOidBaXIgUG9sbHV0aW9uIC0gQXZlcmFnZSBFeHBvc3VyZSB0byBQTTIuNScsXG4gICAgICAgICAgICAgICAgICAgICBzaXplOjIwMDMsXG4gICAgICAgIFx0XHRcdFx0XHRcdCBpY29uOicnLFxuICAgICAgICBcdFx0XHRcdFx0XHQgY29sb3I6JyNmYWRkNmMnLFxuICAgICAgICBcdFx0XHRcdFx0XHQgZGVzY3JpcHRpb246J1BvcHVsYXRpb24gd2VpZ2h0ZWQgZXhwb3N1cmUgdG8gUE0yLjUgKHRocmVlLSB5ZWFyIGF2ZXJhZ2UpJ1xuICAgICAgICBcdFx0XHRcdFx0IH0se1xuICAgICAgICBcdFx0XHRcdFx0XHQgY29sdW1uX25hbWU6ICdlaF9hcV9leGNlZWRhbmNlX3BtMjUnLFxuICAgICAgICBcdFx0XHRcdFx0XHQgdGl0bGU6J0FpciBQb2xsdXRpb24gLSBQTTIuNSBFeGNlZWRhbmNlJyxcbiAgICAgICAgICAgICAgICAgICAgIHNpemU6MjAwMyxcbiAgICAgICAgXHRcdFx0XHRcdFx0IGljb246JycsXG4gICAgICAgIFx0XHRcdFx0XHRcdCBjb2xvcjonI2ZkZTk5YycsXG4gICAgICAgIFx0XHRcdFx0XHRcdCBkZXNjcmlwdGlvbjonUHJvcG9ydGlvbiBvZiB0aGUgcG9wdWxhdGlvbiB3aG9zZSBleHBvc3VyZSBpcyBhYm92ZSAgV0hPIHRocmVzaG9sZHMgKDEwLCAxNSwgMjUsIDM1IG1pY3JvZ3JhbXMvbTMpJ1xuICAgICAgICBcdFx0XHRcdFx0IH1dXG4gICAgICAgIFx0XHRcdFx0IH0se1xuICAgICAgICBcdFx0XHRcdFx0IGNvbHVtbl9uYW1lOidlaF93cycsXG4gICAgICAgIFx0XHRcdFx0XHQgdGl0bGU6J1dhdGVyIFNhbml0YXRpb24nLFxuICAgICAgICBcdFx0XHRcdFx0IGNvbG9yOiAnI2VkNmMyZScsXG4gICAgICAgIFx0XHRcdFx0XHQgaWNvbjogJ2ZhYnJpYycsXG4gICAgICAgIFx0XHRcdFx0XHQgdW5pY29kZTogJ1xcdWU2MDYnLFxuICAgICAgICBcdFx0XHRcdFx0IGNoaWxkcmVuOlt7XG4gICAgICAgIFx0XHRcdFx0XHRcdGNvbHVtbl9uYW1lOiAnZWhfd3NfYWNjZXNzX3RvX2RyaW5raW5nX3dhdGVyJyxcbiAgICAgICAgXHRcdFx0XHRcdFx0dGl0bGU6J0FjY2VzcyB0byBEcmlua2luZyBXYXRlcicsXG4gICAgICAgICAgICAgICAgICAgIHNpemU6Mjg4MCxcbiAgICAgICAgXHRcdFx0XHRcdFx0aWNvbjonJyxcbiAgICAgICAgXHRcdFx0XHRcdFx0Y29sb3I6JyNmMTg3NTMnLFxuICAgICAgICBcdFx0XHRcdFx0XHRkZXNjcmlwdGlvbjonUGVyY2VudGFnZSBvZiBwb3B1bGF0aW9uIHdpdGggYWNjZXNzIHRvIGltcHJvdmVkIGRyaW5raW5nIHdhdGVyIHNvdXJjZSdcbiAgICAgICAgXHRcdFx0XHRcdH0se1xuICAgICAgICBcdFx0XHRcdFx0XHRjb2x1bW5fbmFtZTogJ2VoX3dzX2FjY2Vzc190b19zYW5pdGF0aW9uJyxcbiAgICAgICAgXHRcdFx0XHRcdFx0dGl0bGU6J0FjY2VzcyB0byBTYW5pdGF0aW9uJyxcbiAgICAgICAgICAgICAgICAgICAgc2l6ZToyODgwLFxuICAgICAgICBcdFx0XHRcdFx0XHRpY29uOicnLFxuICAgICAgICBcdFx0XHRcdFx0XHRjb2xvcjonI2Y1YTQ3ZCcsXG4gICAgICAgIFx0XHRcdFx0XHRcdGRlc2NyaXB0aW9uOidQZXJjZW50YWdlIG9mIHBvcHVsYXRpb24gd2l0aCBhY2Nlc3MgdG8gaW1wcm92ZWQgc2FuaXRhdGlvbidcbiAgICAgICAgXHRcdFx0XHRcdH1dXG4gICAgICAgIFx0XHRcdFx0IH1dXG4gICAgICAgIFx0XHRcdCB9LHtcbiAgICAgICAgXHRcdFx0XHQgY29sdW1uX25hbWU6ICdldicsXG4gICAgICAgIFx0XHRcdFx0IHRpdGxlOiAnRWNvc3lzdGVtIFZhbGlkaXR5JyxcbiAgICAgICAgXHRcdFx0XHQgcmFuZ2U6WzAsIDEwMF0sXG4gICAgICAgIFx0XHRcdFx0IGljb246JycsXG4gICAgICAgIFx0XHRcdFx0IGNvbG9yOicjMDM2Mzg1JyxcbiAgICAgICAgXHRcdFx0XHQgY2hpbGRyZW46W3tcbiAgICAgICAgXHRcdFx0XHRcdCBjb2x1bW5fbmFtZTonZXZfd3InLFxuICAgICAgICBcdFx0XHRcdFx0IHRpdGxlOidXYXRlciBSZXNvdXJjZXMnLFxuICAgICAgICBcdFx0XHRcdFx0IGNvbG9yOiAnIzdhOGRjNycsXG4gICAgICAgIFx0XHRcdFx0XHQgaWNvbjogJ3dhdGVyJyxcbiAgICAgICAgXHRcdFx0XHRcdCB1bmljb2RlOiAnXFx1ZTYwOCcsXG4gICAgICAgIFx0XHRcdFx0XHQgY2hpbGRyZW46W3tcbiAgICAgICAgXHRcdFx0XHRcdFx0IGNvbHVtbl9uYW1lOiAnZXZfd3Jfd2FzdGV3YXRlcl90cmVhdG1lbnQnLFxuICAgICAgICBcdFx0XHRcdFx0XHQgdGl0bGU6J1dhc3Rld2F0ZXIgVHJlYXRtZW50JyxcbiAgICAgICAgICAgICAgICAgICAgIHNpemU6NDAwMCxcbiAgICAgICAgXHRcdFx0XHRcdFx0IGljb246JycsXG4gICAgICAgIFx0XHRcdFx0XHRcdCBjb2xvcjonIzk1YTZkNScsXG4gICAgICAgIFx0XHRcdFx0XHRcdCBkZXNjcmlwdGlvbjonV2FzdGV3YXRlciB0cmVhdG1lbnQgbGV2ZWwgd2VpZ2h0ZWQgYnkgY29ubmVjdGlvbiB0byB3YXN0ZXdhdGVyIHRyZWF0bWVudCByYXRlLidcbiAgICAgICAgXHRcdFx0XHRcdCB9XVxuICAgICAgICBcdFx0XHRcdCB9LHtcbiAgICAgICAgXHRcdFx0XHRcdCBjb2x1bW5fbmFtZTonZXZfYWcnLFxuICAgICAgICBcdFx0XHRcdFx0IHRpdGxlOidBZ3JpY3VsdHVyZScsXG4gICAgICAgIFx0XHRcdFx0XHQgY29sb3I6ICcjMmU3NGJhJyxcbiAgICAgICAgXHRcdFx0XHRcdCBpY29uOiAnYWdyYXInLFxuICAgICAgICBcdFx0XHRcdFx0IHVuaWNvZGU6ICdcXHVlNjAwJyxcbiAgICAgICAgXHRcdFx0XHRcdCBjaGlsZHJlbjpbe1xuICAgICAgICBcdFx0XHRcdFx0XHQgY29sdW1uX25hbWU6ICdldl9hZ19hZ3JpY3VsdHVyYWxfc3Vic2lkaWVzJyxcbiAgICAgICAgXHRcdFx0XHRcdFx0IHRpdGxlOidBZ3JpY3VsdHVyYWwgU3Vic2lkaWVzJyxcbiAgICAgICAgICAgICAgICAgICAgIHNpemU6Nzk2LFxuICAgICAgICBcdFx0XHRcdFx0XHQgaWNvbjonJyxcbiAgICAgICAgXHRcdFx0XHRcdFx0IGNvbG9yOicjODJhYmQ2JyxcbiAgICAgICAgXHRcdFx0XHRcdFx0IGRlc2NyaXB0aW9uOidTdWJzaWRpZXMgYXJlIGV4cHJlc3NlZCBpbiBwcmljZSBvZiB0aGVpciBwcm9kdWN0IGluIHRoZSBkb21lc3RpYyBtYXJrZXQgKHBsdXMgYW55IGRpcmVjdCBvdXRwdXQgc3Vic2lkeSkgbGVzcyBpdHMgcHJpY2UgYXQgdGhlIGJvcmRlciwgZXhwcmVzc2VkIGFzIGEgcGVyY2VudGFnZSBvZiB0aGUgYm9yZGVyIHByaWNlIChhZGp1c3RpbmcgZm9yIHRyYW5zcG9ydCBjb3N0cyBhbmQgcXVhbGl0eSBkaWZmZXJlbmNlcykuJ1xuICAgICAgICBcdFx0XHRcdFx0IH0se1xuICAgICAgICBcdFx0XHRcdFx0XHQgY29sdW1uX25hbWU6ICdldl9hZ19wZXN0aWNpZGVfcmVndWxhdGlvbicsXG4gICAgICAgIFx0XHRcdFx0XHRcdCB0aXRsZTonUGVzdGljaWRlIFJlZ3VsYXRpb24nLFxuICAgICAgICAgICAgICAgICAgICAgc2l6ZTo3OTYsXG4gICAgICAgIFx0XHRcdFx0XHRcdCBpY29uOicnLFxuICAgICAgICBcdFx0XHRcdFx0XHQgY29sb3I6JyM1NzhmYzgnLFxuICAgICAgICBcdFx0XHRcdFx0XHQgZGVzY3JpcHRpb246J1dhc3Rld2F0ZXIgdHJlYXRtZW50IGxldmVsIHdlaWdodGVkIGJ5IGNvbm5lY3Rpb24gdG8gd2FzdGV3YXRlciB0cmVhdG1lbnQgcmF0ZS4nXG4gICAgICAgIFx0XHRcdFx0XHQgfV1cbiAgICAgICAgXHRcdFx0XHQgfSx7XG4gICAgICAgIFx0XHRcdFx0XHQgY29sdW1uX25hbWU6J2V2X2ZvJyxcbiAgICAgICAgXHRcdFx0XHRcdCB0aXRsZTonRm9yZXN0JyxcbiAgICAgICAgXHRcdFx0XHRcdCBjb2xvcjogJyMwMDlhY2InLFxuICAgICAgICBcdFx0XHRcdFx0IGljb246ICd0cmVlJyxcbiAgICAgICAgXHRcdFx0XHRcdCB1bmljb2RlOiAnXFx1ZTYwNycsXG4gICAgICAgIFx0XHRcdFx0XHQgY2hpbGRyZW46W3tcbiAgICAgICAgXHRcdFx0XHRcdFx0IGNvbHVtbl9uYW1lOiAnZXZfZm9fY2hhbmdlX2luX2ZvcmVzdF9jb3ZlcicsXG4gICAgICAgIFx0XHRcdFx0XHRcdCB0aXRsZTonQ2hhbmdlIGluIEZvcmVzdCBDb3ZlcicsXG4gICAgICAgICAgICAgICAgICAgICBzaXplOjE1NTAsXG4gICAgICAgIFx0XHRcdFx0XHRcdCBpY29uOicnLFxuICAgICAgICBcdFx0XHRcdFx0XHQgY29sb3I6JyMzMWFlZDUnLFxuICAgICAgICBcdFx0XHRcdFx0XHQgZGVzY3JpcHRpb246J0ZvcmVzdCBsb3NzIC0gRm9yZXN0IGdhaW4gaW4gPiA1MCUgdHJlZSBjb3ZlciwgYXMgY29tcGFyZWQgdG8gMjAwMCBsZXZlbHMuJ1xuICAgICAgICBcdFx0XHRcdFx0IH1dXG4gICAgICAgIFx0XHRcdFx0IH0se1xuICAgICAgICBcdFx0XHRcdFx0IGNvbHVtbl9uYW1lOidldl9maScsXG4gICAgICAgIFx0XHRcdFx0XHQgdGl0bGU6J0Zpc2hlcmllcycsXG4gICAgICAgIFx0XHRcdFx0XHQgY29sb3I6ICcjMDA4YzhjJyxcbiAgICAgICAgXHRcdFx0XHRcdCBpY29uOiAnYW5jaG9yJyxcbiAgICAgICAgXHRcdFx0XHRcdCB1bmljb2RlOiAnXFx1ZTYwMScsXG4gICAgICAgIFx0XHRcdFx0XHQgY2hpbGRyZW46W3tcbiAgICAgICAgXHRcdFx0XHRcdFx0IGNvbHVtbl9uYW1lOiAnZXZfZmlfY29hc3RhbF9zaGVsZl9maXNoaW5nX3ByZXNzdXJlJyxcbiAgICAgICAgXHRcdFx0XHRcdFx0IHRpdGxlOidDb2FzdGFsIFNoZWxmIEZpc2hpbmcgUHJlc3N1cmUnLFxuICAgICAgICAgICAgICAgICAgICAgc2l6ZTo5MDEsXG4gICAgICAgIFx0XHRcdFx0XHRcdCBpY29uOicnLFxuICAgICAgICBcdFx0XHRcdFx0XHQgY29sb3I6JyM2NWI4YjcnLFxuICAgICAgICBcdFx0XHRcdFx0XHQgZGVzY3JpcHRpb246J0NhdGNoIGluIG1ldHJpYyB0b25zIGZyb20gdHJhd2xpbmcgYW5kIGRyZWRnaW5nIGdlYXJzIChtb3N0bHkgYm90dG9tIHRyYXdscykgZGl2aWRlZCBieSBFRVogYXJlYS4nXG4gICAgICAgIFx0XHRcdFx0XHQgfSx7XG4gICAgICAgIFx0XHRcdFx0XHRcdCBjb2x1bW5fbmFtZTogJ2V2X2ZpX2Zpc2hfc3RvY2tzJyxcbiAgICAgICAgXHRcdFx0XHRcdFx0IHRpdGxlOidGaXNoIFN0b2NrcycsXG4gICAgICAgICAgICAgICAgICAgICBzaXplOjkwMSxcbiAgICAgICAgXHRcdFx0XHRcdFx0IGljb246JycsXG4gICAgICAgIFx0XHRcdFx0XHRcdCBjb2xvcjonIzMwYTJhMicsXG4gICAgICAgIFx0XHRcdFx0XHRcdCBkZXNjcmlwdGlvbjonUGVyY2VudGFnZSBvZiBmaXNoaW5nIHN0b2NrcyBvdmVyZXhwbG9pdGVkIGFuZCBjb2xsYXBzZWQgZnJvbSBFRVouJ1xuICAgICAgICBcdFx0XHRcdFx0IH1dXG4gICAgICAgIFx0XHRcdFx0IH0se1xuICAgICAgICBcdFx0XHRcdFx0IGNvbHVtbl9uYW1lOidldl9iZCcsXG4gICAgICAgIFx0XHRcdFx0XHQgdGl0bGU6J0Jpb2RpdmVyc2l0eSBhbmQgSGFiaXRhdCcsXG4gICAgICAgIFx0XHRcdFx0XHQgY29sb3I6ICcjNDRiNmEwJyxcbiAgICAgICAgXHRcdFx0XHRcdCBpY29uOiAnYnV0dGVyZmx5JyxcbiAgICAgICAgXHRcdFx0XHRcdCB1bmljb2RlOiAnXFx1ZTYwMicsXG4gICAgICAgIFx0XHRcdFx0XHQgY2hpbGRyZW46W3tcbiAgICAgICAgXHRcdFx0XHRcdFx0IGNvbHVtbl9uYW1lOiAnZXZfYmRfdGVycmVzdHJpYWxfcHJvdGVjdGVkX2FyZWFzX25hdGlvbmFsX2Jpb21lJyxcbiAgICAgICAgXHRcdFx0XHRcdFx0IHRpdGxlOidOYXRpb25hbCBCaW9tZSBQcm90ZWN0aW9uJyxcbiAgICAgICAgICAgICAgICAgICAgIHNpemU6MTA3NCxcbiAgICAgICAgXHRcdFx0XHRcdFx0IGljb246JycsXG4gICAgICAgIFx0XHRcdFx0XHRcdCBjb2xvcjonI2NlZThlNycsXG4gICAgICAgIFx0XHRcdFx0XHRcdCBkZXNjcmlwdGlvbjonUGVyY2VudGFnZSBvZiB0ZXJyZXN0cmlhbCBiaW9tZSBhcmVhIHRoYXQgaXMgcHJvdGVjdGVkLCB3ZWlnaHRlZCBieSBkb21lc3RpYyBiaW9tZSBhcmVhLidcbiAgICAgICAgXHRcdFx0XHRcdCB9LHtcbiAgICAgICAgXHRcdFx0XHRcdFx0IGNvbHVtbl9uYW1lOiAnZXZfYmRfdGVycmVzdHJpYWxfcHJvdGVjdGVkX2FyZWFzX2dsb2JhbF9iaW9tZScsXG4gICAgICAgIFx0XHRcdFx0XHRcdCB0aXRsZTonR2xvYmFsIEJpb21lIFByb3RlY3Rpb24nLFxuICAgICAgICAgICAgICAgICAgICAgc2l6ZToxMDc0LFxuICAgICAgICBcdFx0XHRcdFx0XHQgaWNvbjonJyxcbiAgICAgICAgXHRcdFx0XHRcdFx0IGNvbG9yOicjYTJkNWQxJyxcbiAgICAgICAgXHRcdFx0XHRcdFx0IGRlc2NyaXB0aW9uOidQZXJjZW50YWdlIG9mIHRlcnJlc3RyaWFsIGJpb21lIGFyZWEgdGhhdCBpcyBwcm90ZWN0ZWQsIHdlaWdodGVkIGJ5IGdsb2JhbCBiaW9tZSBhcmVhLidcbiAgICAgICAgXHRcdFx0XHRcdCB9LHtcbiAgICAgICAgXHRcdFx0XHRcdFx0IGNvbHVtbl9uYW1lOiAnZXZfYmRfbWFyaW5lX3Byb3RlY3RlZF9hcmVhcycsXG4gICAgICAgIFx0XHRcdFx0XHRcdCB0aXRsZTonTWFyaW5lIFByb3RlY3RlZCBBcmVhcycsXG4gICAgICAgICAgICAgICAgICAgICBzaXplOjEwNzQsXG4gICAgICAgIFx0XHRcdFx0XHRcdCBpY29uOicnLFxuICAgICAgICBcdFx0XHRcdFx0XHQgY29sb3I6JyM3N2MxYjknLFxuICAgICAgICBcdFx0XHRcdFx0XHQgZGVzY3JpcHRpb246J01hcmluZSBwcm90ZWN0ZWQgYXJlYXMgYXMgYSBwZXJjZW50IG9mIEVFWi4nXG4gICAgICAgIFx0XHRcdFx0XHQgfSx7XG4gICAgICAgIFx0XHRcdFx0XHRcdCBjb2x1bW5fbmFtZTogJ2V2X2JkX2NyaXRpY2FsX2hhYml0YXRfcHJvdGVjdGlvbicsXG4gICAgICAgIFx0XHRcdFx0XHRcdCB0aXRsZTonQ3JpdGljYWwgSGFiaXRhdCBQcm90ZWN0aW9uJyxcbiAgICAgICAgICAgICAgICAgICAgIHNpemU6MTA3NCxcbiAgICAgICAgXHRcdFx0XHRcdFx0IGljb246JycsXG4gICAgICAgIFx0XHRcdFx0XHRcdCBjb2xvcjonIzU4YmJhZScsXG4gICAgICAgIFx0XHRcdFx0XHRcdCBkZXNjcmlwdGlvbjonUGVyY2VudGFnZSBvZiB0ZXJyZXN0cmlhbCBiaW9tZSBhcmVhIHRoYXQgaXMgcHJvdGVjdGVkLCB3ZWlnaHRlZCBieSBnbG9iYWwgYmlvbWUgYXJlYS4nXG4gICAgICAgIFx0XHRcdFx0XHQgfV1cbiAgICAgICAgXHRcdFx0XHQgfSx7XG4gICAgICAgIFx0XHRcdFx0XHQgY29sdW1uX25hbWU6J2V2X2NlJyxcbiAgICAgICAgXHRcdFx0XHRcdCB0aXRsZTonQ2xpbWF0ZSBhbmQgRW5lcmd5JyxcbiAgICAgICAgXHRcdFx0XHRcdCBjb2xvcjogJyMzYmFkNWUnLFxuICAgICAgICBcdFx0XHRcdFx0IGljb246ICdlbmVyZ3knLFxuICAgICAgICBcdFx0XHRcdFx0IHVuaWNvZGU6ICdcXHVlNjAzJyxcbiAgICAgICAgXHRcdFx0XHRcdCBjaGlsZHJlbjpbe1xuICAgICAgICBcdFx0XHRcdFx0XHQgY29sdW1uX25hbWU6ICdldl9jZV90cmVuZF9pbl9jYXJib25faW50ZW5zaXR5JyxcbiAgICAgICAgXHRcdFx0XHRcdFx0IHRpdGxlOidUcmVuZCBpbiBDYXJib24gSW50ZW5zaXR5JyxcbiAgICAgICAgICAgICAgICAgICAgIHNpemU6MTUxNCxcbiAgICAgICAgXHRcdFx0XHRcdFx0IGljb246JycsXG4gICAgICAgIFx0XHRcdFx0XHRcdCBjb2xvcjonIzU5YjU3YScsXG4gICAgICAgIFx0XHRcdFx0XHRcdCBkZXNjcmlwdGlvbjonQ2hhbmdlIGluIENPMiBlbWlzc2lvbnMgcGVyIHVuaXQgR0RQIGZyb20gMTk5MCB0byAyMDEwLidcbiAgICAgICAgXHRcdFx0XHRcdCB9LHtcbiAgICAgICAgXHRcdFx0XHRcdFx0IGNvbHVtbl9uYW1lOiAnZXZfY2VfY2hhbmdlX29mX3RyZW5kX2luX2NhcmJvbl9pbnRlc2l0eScsXG4gICAgICAgIFx0XHRcdFx0XHRcdCB0aXRsZTonQ2hhbmdlIG9mIFRyZW5kIGluIENhcmJvbiBJbnRlbnNpdHknLFxuICAgICAgICAgICAgICAgICAgICAgc2l6ZToxNTE0LFxuICAgICAgICBcdFx0XHRcdFx0XHQgaWNvbjonJyxcbiAgICAgICAgXHRcdFx0XHRcdFx0IGNvbG9yOicjODBjMzk5JyxcbiAgICAgICAgXHRcdFx0XHRcdFx0IGRlc2NyaXB0aW9uOidDaGFuZ2UgaW4gVHJlbmQgb2YgQ08yIGVtaXNzaW9ucyBwZXIgdW5pdCBHRFAgZnJvbSAxOTkwIHRvIDIwMDA7IDIwMDAgdG8gMjAxMC4nXG4gICAgICAgIFx0XHRcdFx0XHQgfSx7XG4gICAgICAgIFx0XHRcdFx0XHRcdCBjb2x1bW5fbmFtZTogJ2V2X2NlX3RyZW5kX2luX2NvMl9lbWlzc2lvbnNfcGVyX2t3aCcsXG4gICAgICAgIFx0XHRcdFx0XHRcdCB0aXRsZTonVHJlbmQgaW4gQ08yIEVtaXNzaW9ucyBwZXIgS1dIJyxcbiAgICAgICAgICAgICAgICAgICAgIHNpemU6MTUxNCxcbiAgICAgICAgXHRcdFx0XHRcdFx0IGljb246JycsXG4gICAgICAgIFx0XHRcdFx0XHRcdCBjb2xvcjonI2E4ZDRiOCcsXG4gICAgICAgIFx0XHRcdFx0XHRcdCBkZXNjcmlwdGlvbjonQ2hhbmdlIGluIENPMiBlbWlzc2lvbnMgZnJvbSBlbGVjdHJpY2l0eSBhbmQgaGVhdCBwcm9kdWN0aW9uLidcbiAgICAgICAgXHRcdFx0XHRcdCB9XVxuICAgICAgICBcdFx0XHRcdCB9XVxuICAgICAgICBcdFx0XHQgfV1cbiAgICAgICAgXHRcdH07XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuc2VydmljZXMnKS5mYWN0b3J5KCdNYXBTZXJ2aWNlJywgZnVuY3Rpb24obGVhZmxldERhdGEpe1xuICAgICAgICAvL1xuICAgICAgICB2YXIgbGVhZmxldCA9IHt9O1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHNldExlYWZsZXREYXRhOiBmdW5jdGlvbihsZWFmKXtcbiAgICAgICAgICAgIGxlYWZsZXQgPSBsZWFmbGV0O1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZ2V0TGVhZmxldERhdGE6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICByZXR1cm4gbGVhZmxldDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZShcImFwcC5zZXJ2aWNlc1wiKS5mYWN0b3J5KCdEaWFsb2dTZXJ2aWNlJywgZnVuY3Rpb24oJG1kRGlhbG9nKXtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRmcm9tVGVtcGxhdGU6IGZ1bmN0aW9uKHRlbXBsYXRlLCAkc2NvcGUpe1xuXG5cdFx0XHRcdHZhciBvcHRpb25zID0ge1xuXHRcdFx0XHRcdHRlbXBsYXRlVXJsOiAnL3ZpZXdzL2RpYWxvZ3MvJyArIHRlbXBsYXRlICsgJy8nICsgdGVtcGxhdGUgKyAnLmh0bWwnXG5cdFx0XHRcdH07XG5cblx0XHRcdFx0aWYgKCRzY29wZSl7XG5cdFx0XHRcdFx0b3B0aW9ucy5zY29wZSA9ICRzY29wZS4kbmV3KCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm4gJG1kRGlhbG9nLnNob3cob3B0aW9ucyk7XG5cdFx0XHR9LFxuXG5cdFx0XHRoaWRlOiBmdW5jdGlvbigpe1xuXHRcdFx0XHRyZXR1cm4gJG1kRGlhbG9nLmhpZGUoKTtcblx0XHRcdH0sXG5cblx0XHRcdGFsZXJ0OiBmdW5jdGlvbih0aXRsZSwgY29udGVudCl7XG5cdFx0XHRcdCRtZERpYWxvZy5zaG93KFxuXHRcdFx0XHRcdCRtZERpYWxvZy5hbGVydCgpXG5cdFx0XHRcdFx0XHQudGl0bGUodGl0bGUpXG5cdFx0XHRcdFx0XHQuY29udGVudChjb250ZW50KVxuXHRcdFx0XHRcdFx0Lm9rKCdPaycpXG5cdFx0XHRcdCk7XG5cdFx0XHR9XG5cdFx0fTtcblx0fSk7XG59KSgpOyIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZShcImFwcC5zZXJ2aWNlc1wiKS5mYWN0b3J5KCdUb2FzdFNlcnZpY2UnLCBmdW5jdGlvbigkbWRUb2FzdCl7XG5cblx0XHR2YXIgZGVsYXkgPSA2MDAwLFxuXHRcdFx0cG9zaXRpb24gPSAndG9wIHJpZ2h0Jyxcblx0XHRcdGFjdGlvbiA9ICdPSyc7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0c2hvdzogZnVuY3Rpb24oY29udGVudCl7XG5cdFx0XHRcdGlmICghY29udGVudCl7XG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuICRtZFRvYXN0LnNob3coXG5cdFx0XHRcdFx0JG1kVG9hc3Quc2ltcGxlKClcblx0XHRcdFx0XHRcdC5jb250ZW50KGNvbnRlbnQpXG5cdFx0XHRcdFx0XHQucG9zaXRpb24ocG9zaXRpb24pXG5cdFx0XHRcdFx0XHQuYWN0aW9uKGFjdGlvbilcblx0XHRcdFx0XHRcdC5oaWRlRGVsYXkoZGVsYXkpXG5cdFx0XHRcdCk7XG5cdFx0XHR9LFxuXHRcdFx0ZXJyb3I6IGZ1bmN0aW9uKGNvbnRlbnQpe1xuXHRcdFx0XHRpZiAoIWNvbnRlbnQpe1xuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiAkbWRUb2FzdC5zaG93KFxuXHRcdFx0XHRcdCRtZFRvYXN0LnNpbXBsZSgpXG5cdFx0XHRcdFx0XHQuY29udGVudChjb250ZW50KVxuXHRcdFx0XHRcdFx0LnBvc2l0aW9uKHBvc2l0aW9uKVxuXHRcdFx0XHRcdFx0LnRoZW1lKCd3YXJuJylcblx0XHRcdFx0XHRcdC5hY3Rpb24oYWN0aW9uKVxuXHRcdFx0XHRcdFx0LmhpZGVEZWxheShkZWxheSlcblx0XHRcdFx0KTtcblx0XHRcdH1cblx0XHR9O1xuXHR9KTtcbn0pKCk7IiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdEaWFsb2dzQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgRGlhbG9nU2VydmljZSl7XG5cdFx0JHNjb3BlLmFsZXJ0RGlhbG9nID0gZnVuY3Rpb24oKXtcblx0XHRcdERpYWxvZ1NlcnZpY2UuYWxlcnQoJ1RoaXMgaXMgYW4gYWxlcnQgdGl0bGUnLCAnWW91IGNhbiBzcGVjaWZ5IHNvbWUgZGVzY3JpcHRpb24gdGV4dCBpbiBoZXJlLicpO1xuXHRcdH07XG5cblx0XHQkc2NvcGUuY3VzdG9tRGlhbG9nID0gZnVuY3Rpb24oKXtcblx0XHRcdERpYWxvZ1NlcnZpY2UuZnJvbVRlbXBsYXRlKCdhZGRfdXNlcnMnLCAkc2NvcGUpO1xuXHRcdH07XG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignRWxpeGlyQ3RybCcsIGZ1bmN0aW9uKCl7XG4gICAgICAgIC8vXG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignRXBpQ3RybCcsIGZ1bmN0aW9uICgkc2NvcGUsICRyb290U2NvcGUsICRzdGF0ZSwgJHRpbWVvdXQsIHNtb290aFNjcm9sbCwgSW5kZXhTZXJ2aWNlLCBFUEksIERhdGFTZXJ2aWNlLCBsZWFmbGV0RGF0YSwgTWFwU2VydmljZSkge1xuXG5cdFx0JHNjb3BlLmN1cnJlbnQgPSBcIlwiO1xuXHRcdCRzY29wZS5kaXNwbGF5ID0ge1xuXHRcdFx0c2VsZWN0ZWRDYXQ6ICcnLFxuXHRcdFx0cmFuazogW3tcblx0XHRcdFx0ZmllbGRzOiB7XG5cdFx0XHRcdFx0eDogJ3llYXInLFxuXHRcdFx0XHRcdHk6ICdyYW5rJ1xuXHRcdFx0XHR9LFxuXHRcdFx0XHR0aXRsZTogJ1JhbmsnLFxuXHRcdFx0XHRjb2xvcjogJyM1MmI2OTUnXG5cdFx0XHR9XSxcblx0XHRcdHNjb3JlOiBbe1xuXHRcdFx0XHRmaWVsZHM6IHtcblx0XHRcdFx0XHR4OiAneWVhcicsXG5cdFx0XHRcdFx0eTogJ3Njb3JlJ1xuXHRcdFx0XHR9LFxuXHRcdFx0XHR0aXRsZTogJ1Njb3JlJyxcblx0XHRcdFx0Y29sb3I6ICcjMDA2NmI5J1xuXHRcdFx0fV1cblx0XHR9O1xuXHRcdCRzY29wZS50YWJDb250ZW50ID0gXCJcIjtcblx0XHQkc2NvcGUudG9nZ2xlQnV0dG9uID0gJ2Fycm93X2Ryb3BfZG93bic7XG5cdFx0JHNjb3BlLmluZGV4RGF0YSA9IEluZGV4U2VydmljZS5nZXRFcGkoKTtcblx0XHQkc2NvcGUuZXBpID0gW107XG5cdFx0JHNjb3BlLm1lbnVlT3BlbiA9IHRydWU7XG5cdFx0JHNjb3BlLmRldGFpbHMgPSBmYWxzZTtcblx0XHQkc2NvcGUuaW5mbyA9IGZhbHNlO1xuXHRcdCRzY29wZS5jbG9zZUljb24gPSAnY2xvc2UnO1xuXHRcdCRzY29wZS5jb21wYXJlID0ge1xuXHRcdFx0YWN0aXZlOiBmYWxzZSxcblx0XHRcdGNvdW50cmllczogW11cblx0XHR9O1xuXHRcdCRzY29wZS5zaG93VGFiQ29udGVudCA9IGZ1bmN0aW9uIChjb250ZW50KSB7XG5cdFx0XHRpZiAoY29udGVudCA9PSAnJyAmJiAkc2NvcGUudGFiQ29udGVudCA9PSAnJykge1xuXHRcdFx0XHQkc2NvcGUudGFiQ29udGVudCA9ICdyYW5rJztcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCRzY29wZS50YWJDb250ZW50ID0gY29udGVudDtcblx0XHRcdH1cblx0XHRcdCRzY29wZS50b2dnbGVCdXR0b24gPSAkc2NvcGUudGFiQ29udGVudCA/ICdhcnJvd19kcm9wX3VwJyA6ICdhcnJvd19kcm9wX2Rvd24nO1xuXHRcdH07XG5cdFx0JHNjb3BlLmVwaSA9IEVQSTtcblx0XHQkc2NvcGUuc2V0U3RhdGUgPSBmdW5jdGlvbiAoaXRlbSkge1xuXHRcdFx0Y29uc29sZS5sb2coJ2l0ZW0nKTtcblx0XHRcdCRzY29wZS5zZXRDdXJyZW50KGdldE5hdGlvbkJ5SXNvKGl0ZW0pKTtcblx0XHR9O1xuXHRcdCRzY29wZS50b2dnbGVPcGVuID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0JHNjb3BlLm1lbnVlT3BlbiA9ICEkc2NvcGUubWVudWVPcGVuO1xuXHRcdFx0JHNjb3BlLmNsb3NlSWNvbiA9ICRzY29wZS5tZW51ZU9wZW4gPT0gdHJ1ZSA/ICdjaGV2cm9uX2xlZnQnIDogJ2NoZXZyb25fcmlnaHQnO1xuXHRcdH1cblx0XHQkc2NvcGUuc2V0Q3VycmVudCA9IGZ1bmN0aW9uIChuYXQpIHtcblx0XHRcdCRzY29wZS5jdXJyZW50ID0gbmF0O1xuXHRcdFx0JHNjb3BlLnNldFNlbGVjdGVkRmVhdHVyZSgpO1xuXHRcdH07XG5cdFx0JHNjb3BlLnNldFNlbGVjdGVkRmVhdHVyZSA9IGZ1bmN0aW9uIChpc28pIHtcblx0XHRcdGlmICgkc2NvcGUubXZ0U291cmNlKSB7XG5cdFx0XHRcdCR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHQkc2NvcGUubXZ0U291cmNlLmxheWVycy5jb3VudHJpZXNfYmlnX2dlb20uZmVhdHVyZXNbJHNjb3BlLmN1cnJlbnQuaXNvXS5zZWxlY3RlZCA9IHRydWU7XG5cdFx0XHRcdH0pXG5cdFx0XHR9XG5cdFx0fTtcblx0XHQkc2NvcGUuZ2V0UmFuayA9IGZ1bmN0aW9uIChuYXQpIHtcblx0XHRcdHJldHVybiAkc2NvcGUuZXBpLmluZGV4T2YobmF0KSArIDE7XG5cdFx0fTtcblx0XHQkc2NvcGUudG9nZ2xlSW5mbyA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdCRzY29wZS5kaXNwbGF5LnNlbGVjdGVkQ2F0ID0gJyc7XG5cdFx0XHQkc2NvcGUuaW5mbyA9ICEkc2NvcGUuaW5mbztcblx0XHR9O1xuXHRcdCRzY29wZS50b2dnbGVEZXRhaWxzID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0cmV0dXJuICRzY29wZS5kZXRhaWxzID0gISRzY29wZS5kZXRhaWxzO1xuXHRcdH07XG5cdFx0JHNjb3BlLnRvZ2dsZUNvbXBhcmlzb24gPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHQkc2NvcGUuY29tcGFyZS5jb3VudHJpZXMgPSBbJHNjb3BlLmN1cnJlbnRdO1xuXHRcdFx0JHNjb3BlLmNvbXBhcmUuYWN0aXZlID0gISRzY29wZS5jb21wYXJlLmFjdGl2ZTtcblx0XHRcdGlmICgkc2NvcGUuY29tcGFyZS5hY3RpdmUpIHtcblx0XHRcdFx0JHJvb3RTY29wZS5ncmV5ZWQgPSB0cnVlO1xuXHRcdFx0XHQkc2NvcGUubXZ0U291cmNlLm9wdGlvbnMubXV0ZXhUb2dnbGUgPSBmYWxzZTtcblx0XHRcdFx0JHNjb3BlLm12dFNvdXJjZS5zZXRTdHlsZShpbnZlcnRlZFN0eWxlKTtcblx0XHRcdFx0JHRpbWVvdXQoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdHZhciBlbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2luZGV4LWNvbXBhcmlzb24nKTtcblx0XHRcdFx0XHRzbW9vdGhTY3JvbGwoZWxlbWVudCwge1xuXHRcdFx0XHRcdFx0b2Zmc2V0OiAxMjAsXG5cdFx0XHRcdFx0XHRkdXJhdGlvbjogMjAwXG5cdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0fSlcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCRyb290U2NvcGUuZ3JleWVkID0gZmFsc2U7XG5cdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaCgkc2NvcGUubXZ0U291cmNlLmxheWVycy5jb3VudHJpZXNfYmlnX2dlb20uZmVhdHVyZXMsIGZ1bmN0aW9uIChmZWF0dXJlKSB7XG5cdFx0XHRcdFx0XHRmZWF0dXJlLnNlbGVjdGVkID0gZmFsc2U7XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHQkc2NvcGUubXZ0U291cmNlLmxheWVycy5jb3VudHJpZXNfYmlnX2dlb20uZmVhdHVyZXNbJHNjb3BlLmN1cnJlbnQuaXNvXS5zZWxlY3RlZCA9IHRydWU7XG5cdFx0XHRcdCRzY29wZS5tdnRTb3VyY2Uub3B0aW9ucy5tdXRleFRvZ2dsZSA9IHRydWU7XG5cdFx0XHRcdCRzY29wZS5tdnRTb3VyY2Uuc2V0U3R5bGUoY291bnRyaWVzU3R5bGUpO1xuXHRcdFx0XHREYXRhU2VydmljZS5nZXRPbmUoJ25hdGlvbnMvYmJveCcsIFskc2NvcGUuY291bnRyeS5pc29dKS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG5cdFx0XHRcdFx0JHNjb3BlLmJib3ggPSBkYXRhO1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9O1xuXHRcdCRzY29wZS50b2dnbGVDb3VudHJpZUxpc3QgPSBmdW5jdGlvbiAoY291bnRyeSkge1xuXHRcdFx0dmFyIGZvdW5kID0gZmFsc2U7XG5cdFx0XHRhbmd1bGFyLmZvckVhY2goJHNjb3BlLmNvbXBhcmUuY291bnRyaWVzLCBmdW5jdGlvbiAobmF0LCBrZXkpIHtcblx0XHRcdFx0aWYgKGNvdW50cnkgPT0gbmF0ICYmIG5hdCAhPSAkc2NvcGUuY3VycmVudCkge1xuXHRcdFx0XHRcdCRzY29wZS5jb21wYXJlLmNvdW50cmllcy5zcGxpY2Uoa2V5LCAxKTtcblx0XHRcdFx0XHRmb3VuZCA9IHRydWU7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdFx0aWYgKCFmb3VuZCkge1xuXHRcdFx0XHQkc2NvcGUuY29tcGFyZS5jb3VudHJpZXMucHVzaChjb3VudHJ5KTtcblx0XHRcdH07XG5cdFx0XHR2YXIgaXNvcyA9IFtdO1xuXHRcdFx0YW5ndWxhci5mb3JFYWNoKCRzY29wZS5jb21wYXJlLmNvdW50cmllcywgZnVuY3Rpb24gKGl0ZW0sIGtleSkge1xuXHRcdFx0XHRpc29zLnB1c2goaXRlbS5pc28pO1xuXHRcdFx0fSk7XG5cdFx0XHREYXRhU2VydmljZS5nZXRPbmUoJ25hdGlvbnMvYmJveCcsIGlzb3MpLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcblx0XHRcdFx0JHNjb3BlLmJib3ggPSBkYXRhO1xuXHRcdFx0fSk7XG5cdFx0XHRyZXR1cm4gIWZvdW5kO1xuXHRcdH07XG5cdFx0JHNjb3BlLmdldE9mZnNldCA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdGlmICghJHNjb3BlLmN1cnJlbnQpIHtcblx0XHRcdFx0cmV0dXJuIDA7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gKCRzY29wZS5jdXJyZW50LnJhbmsgPT0gMSA/IDAgOiAkc2NvcGUuY3VycmVudC5yYW5rID09ICRzY29wZS5jdXJyZW50Lmxlbmd0aCArIDEgPyAkc2NvcGUuY3VycmVudC5yYW5rIDogJHNjb3BlLmN1cnJlbnQucmFuayAtIDIpICogMTY7XG5cdFx0XHQvL3JldHVybiAkc2NvcGUuY3VycmVudC5yYW5rIC0gMiB8fCAwO1xuXHRcdH07XG5cdFx0JHNjb3BlLmdldFRlbmRlbmN5ID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0aWYgKCEkc2NvcGUuY3VycmVudCkge1xuXHRcdFx0XHRyZXR1cm4gJ2Fycm93X2Ryb3BfZG93bidcblx0XHRcdH1cblx0XHRcdHJldHVybiAkc2NvcGUuY3VycmVudC5wZXJjZW50X2NoYW5nZSA+IDAgPyAnYXJyb3dfZHJvcF91cCcgOiAnYXJyb3dfZHJvcF9kb3duJztcblx0XHR9O1xuXG5cdFx0JHNjb3BlLiR3YXRjaCgnY3VycmVudCcsIGZ1bmN0aW9uIChuZXdJdGVtLCBvbGRJdGVtKSB7XG5cdFx0XHRpZiAobmV3SXRlbSA9PT0gb2xkSXRlbSkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0XHRpZiAobmV3SXRlbS5pc28pIHtcblx0XHRcdFx0JHN0YXRlLmdvKCdhcHAuZXBpLnNlbGVjdGVkJywge1xuXHRcdFx0XHRcdGl0ZW06IG5ld0l0ZW0uaXNvXG5cdFx0XHRcdH0pXG5cdFx0XHRcdCRzY29wZS5tdnRTb3VyY2UubGF5ZXJzLmNvdW50cmllc19iaWdfZ2VvbS5mZWF0dXJlc1tvbGRJdGVtLmlzb10uc2VsZWN0ZWQgPSBmYWxzZTtcblx0XHRcdFx0JHNjb3BlLm12dFNvdXJjZS5vcHRpb25zLm11dGV4VG9nZ2xlID0gdHJ1ZTtcblx0XHRcdFx0RGF0YVNlcnZpY2UuZ2V0T25lKCduYXRpb25zL2Jib3gnLCBbJHNjb3BlLmN1cnJlbnQuaXNvXSkudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuXHRcdFx0XHRcdCRzY29wZS5iYm94ID0gZGF0YTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkc3RhdGUuZ28oJ2FwcC5lcGknKTtcblx0XHRcdH1cblx0XHR9KTtcblx0XHQkc2NvcGUuJHdhdGNoKCdkaXNwbGF5LnNlbGVjdGVkQ2F0JywgZnVuY3Rpb24gKG4sIG8pIHtcblx0XHRcdGlmIChuID09PSBvKSB7XG5cdFx0XHRcdHJldHVyblxuXHRcdFx0fVxuXHRcdFx0aWYgKG4pXG5cdFx0XHRcdHVwZGF0ZUNhbnZhcyhuLmNvbG9yKTtcblx0XHRcdGVsc2Uge1xuXHRcdFx0XHR1cGRhdGVDYW52YXMoJ3JnYmEoMTI4LCAyNDMsIDE5OCwxKScpO1xuXHRcdFx0fTtcblx0XHRcdCRzY29wZS5tdnRTb3VyY2Uuc2V0U3R5bGUoY291bnRyaWVzU3R5bGUpO1xuXHRcdH0pO1xuXHRcdCRzY29wZS4kb24oXCIkc3RhdGVDaGFuZ2VTdWNjZXNzXCIsIGZ1bmN0aW9uIChldmVudCwgdG9TdGF0ZSwgdG9QYXJhbXMpIHtcblxuXHRcdFx0aWYgKHRvU3RhdGUubmFtZSA9PSBcImFwcC5lcGkuc2VsZWN0ZWRcIikge1xuXHRcdFx0XHQkc2NvcGUuc2V0U3RhdGUodG9QYXJhbXMuaXRlbSk7XG5cdFx0XHRcdERhdGFTZXJ2aWNlLmdldE9uZSgnbmF0aW9ucycsIHRvUGFyYW1zLml0ZW0pLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcblx0XHRcdFx0XHQkc2NvcGUuY291bnRyeSA9IGRhdGE7XG5cdFx0XHRcdFx0RGF0YVNlcnZpY2UuZ2V0T25lKCduYXRpb25zL2Jib3gnLCBbJHNjb3BlLmNvdW50cnkuaXNvXSkudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuXHRcdFx0XHRcdFx0JHNjb3BlLmJib3ggPSBkYXRhO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9KTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCRzY29wZS5jb3VudHJ5ID0gJHNjb3BlLmN1cnJlbnQgPSBcIlwiO1xuXHRcdFx0XHQkc2NvcGUuZGV0YWlscyA9IGZhbHNlO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdHZhciBnZXROYXRpb25CeU5hbWUgPSBmdW5jdGlvbiAobmFtZSkge1xuXHRcdFx0dmFyIG5hdGlvbiA9IHt9O1xuXHRcdFx0YW5ndWxhci5mb3JFYWNoKCRzY29wZS5lcGksIGZ1bmN0aW9uIChuYXQpIHtcblx0XHRcdFx0aWYgKG5hdC5jb3VudHJ5ID09IG5hbWUpIHtcblx0XHRcdFx0XHRuYXRpb24gPSBuYXQ7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdFx0cmV0dXJuIG5hdGlvbjtcblx0XHR9O1xuXHRcdHZhciBnZXROYXRpb25CeUlzbyA9IGZ1bmN0aW9uIChpc28pIHtcblx0XHRcdHZhciBuYXRpb24gPSB7fTtcblx0XHRcdGFuZ3VsYXIuZm9yRWFjaCgkc2NvcGUuZXBpLCBmdW5jdGlvbiAobmF0KSB7XG5cdFx0XHRcdGlmIChuYXQuaXNvID09IGlzbykge1xuXHRcdFx0XHRcdG5hdGlvbiA9IG5hdDtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0XHRyZXR1cm4gbmF0aW9uO1xuXHRcdH07XG5cdFx0dmFyIGNyZWF0ZUNhbnZhcyA9IGZ1bmN0aW9uIChjb2xvcnMpIHtcblx0XHRcdCRzY29wZS5jYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcblx0XHRcdCRzY29wZS5jYW52YXMud2lkdGggPSAyNTY7XG5cdFx0XHQkc2NvcGUuY2FudmFzLmhlaWdodCA9IDEwO1xuXHRcdFx0JHNjb3BlLmN0eCA9ICRzY29wZS5jYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcblx0XHRcdHZhciBncmFkaWVudCA9ICRzY29wZS5jdHguY3JlYXRlTGluZWFyR3JhZGllbnQoMCwgMCwgMjU2LCAxMCk7XG5cdFx0XHRncmFkaWVudC5hZGRDb2xvclN0b3AoMCwgJ3JnYmEoMjU1LDI1NSwyNTUsMCknKTtcblx0XHRcdGdyYWRpZW50LmFkZENvbG9yU3RvcCgwLjUzLCAncmdiYSgxMjgsIDI0MywgMTk4LDEpJyk7XG5cdFx0XHRncmFkaWVudC5hZGRDb2xvclN0b3AoMSwgJ3JnYmEoMTAyLDEwMiwxMDIsMSknKTtcblx0XHRcdCRzY29wZS5jdHguZmlsbFN0eWxlID0gZ3JhZGllbnQ7XG5cdFx0XHQkc2NvcGUuY3R4LmZpbGxSZWN0KDAsIDAsIDI1NiwgMTApO1xuXHRcdFx0JHNjb3BlLnBhbGV0dGUgPSAkc2NvcGUuY3R4LmdldEltYWdlRGF0YSgwLCAwLCAyNTYsIDEpLmRhdGE7XG5cdFx0XHQvL2RvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdib2R5JylbMF0uYXBwZW5kQ2hpbGQoJHNjb3BlLmNhbnZhcyk7XG5cdFx0fVxuXHRcdHZhciB1cGRhdGVDYW52YXMgPSBmdW5jdGlvbiAoY29sb3IpIHtcblx0XHRcdHZhciBncmFkaWVudCA9ICRzY29wZS5jdHguY3JlYXRlTGluZWFyR3JhZGllbnQoMCwgMCwgMjU2LCAxMCk7XG5cdFx0XHRncmFkaWVudC5hZGRDb2xvclN0b3AoMCwgJ3JnYmEoMjU1LDI1NSwyNTUsMCknKTtcblx0XHRcdGdyYWRpZW50LmFkZENvbG9yU3RvcCgwLjUzLCBjb2xvcik7XG5cdFx0XHRncmFkaWVudC5hZGRDb2xvclN0b3AoMSwgJ3JnYmEoMTAyLDEwMiwxMDIsMSknKTtcblx0XHRcdCRzY29wZS5jdHguZmlsbFN0eWxlID0gZ3JhZGllbnQ7XG5cdFx0XHQkc2NvcGUuY3R4LmZpbGxSZWN0KDAsIDAsIDI1NiwgMTApO1xuXHRcdFx0JHNjb3BlLnBhbGV0dGUgPSAkc2NvcGUuY3R4LmdldEltYWdlRGF0YSgwLCAwLCAyNTYsIDEpLmRhdGE7XG5cdFx0fTtcblx0XHRjcmVhdGVDYW52YXMoKTtcblx0XHR2YXIgaW52ZXJ0ZWRTdHlsZSA9IGZ1bmN0aW9uIChmZWF0dXJlKSB7XG5cdFx0XHR2YXIgc3R5bGUgPSB7fTtcblx0XHRcdHZhciBpc28gPSBmZWF0dXJlLnByb3BlcnRpZXMuYWRtMF9hMztcblx0XHRcdHZhciBuYXRpb24gPSBnZXROYXRpb25CeUlzbyhpc28pO1xuXHRcdFx0dmFyIGZpZWxkID0gJHNjb3BlLmRpc3BsYXkuc2VsZWN0ZWRDYXQudHlwZSB8fCAnc2NvcmUnO1xuXG5cblx0XHRcdHZhciBjb2xvclBvcyA9IHBhcnNlSW50KDI1NiAvIDEwMCAqIG5hdGlvbltmaWVsZF0pICogNDtcblx0XHRcdHZhciBjb2xvciA9ICdyZ2JhKCcgKyAkc2NvcGUucGFsZXR0ZVtjb2xvclBvc10gKyAnLCAnICsgJHNjb3BlLnBhbGV0dGVbY29sb3JQb3MgKyAxXSArICcsICcgKyAkc2NvcGUucGFsZXR0ZVtjb2xvclBvcyArIDJdICsgJywnICsgJHNjb3BlLnBhbGV0dGVbY29sb3JQb3MgKyAzXSArICcpJztcblx0XHRcdHN0eWxlLmNvbG9yID0gJ3JnYmEoMCwwLDAsMCknO1xuXHRcdFx0c3R5bGUub3V0bGluZSA9IHtcblx0XHRcdFx0Y29sb3I6ICdyZ2JhKDAsMCwwLDApJyxcblx0XHRcdFx0c2l6ZTogMFxuXHRcdFx0fTtcblx0XHRcdHN0eWxlLnNlbGVjdGVkID0ge1xuXHRcdFx0XHRjb2xvcjogY29sb3IsXG5cdFx0XHRcdG91dGxpbmU6IHtcblx0XHRcdFx0XHRjb2xvcjogJ3JnYmEoMCwwLDAsMC4zKScsXG5cdFx0XHRcdFx0c2l6ZTogMlxuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXHRcdFx0cmV0dXJuIHN0eWxlO1xuXHRcdH07XG5cdFx0dmFyIGNvdW50cmllc1N0eWxlID0gZnVuY3Rpb24gKGZlYXR1cmUpIHtcblx0XHRcdHZhciBzdHlsZSA9IHt9O1xuXHRcdFx0dmFyIGlzbyA9IGZlYXR1cmUucHJvcGVydGllcy5hZG0wX2EzO1xuXHRcdFx0dmFyIG5hdGlvbiA9IGdldE5hdGlvbkJ5SXNvKGlzbyk7XG5cdFx0XHR2YXIgZmllbGQgPSAkc2NvcGUuZGlzcGxheS5zZWxlY3RlZENhdC50eXBlIHx8ICdzY29yZSc7XG5cdFx0XHR2YXIgdHlwZSA9IGZlYXR1cmUudHlwZTtcblx0XHRcdHN3aXRjaCAodHlwZSkge1xuXHRcdFx0Y2FzZSAzOiAvLydQb2x5Z29uJ1xuXHRcdFx0XHRpZiAobmF0aW9uW2ZpZWxkXSkge1xuXHRcdFx0XHRcdHZhciBjb2xvclBvcyA9IHBhcnNlSW50KDI1NiAvIDEwMCAqIG5hdGlvbltmaWVsZF0pICogNDtcblx0XHRcdFx0XHR2YXIgY29sb3IgPSAncmdiYSgnICsgJHNjb3BlLnBhbGV0dGVbY29sb3JQb3NdICsgJywgJyArICRzY29wZS5wYWxldHRlW2NvbG9yUG9zICsgMV0gKyAnLCAnICsgJHNjb3BlLnBhbGV0dGVbY29sb3JQb3MgKyAyXSArICcsJyArICRzY29wZS5wYWxldHRlW2NvbG9yUG9zICsgM10gKyAnKSc7XG5cdFx0XHRcdFx0c3R5bGUuY29sb3IgPSBjb2xvcjtcblx0XHRcdFx0XHRzdHlsZS5vdXRsaW5lID0ge1xuXHRcdFx0XHRcdFx0Y29sb3I6IGNvbG9yLFxuXHRcdFx0XHRcdFx0c2l6ZTogMVxuXHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0c3R5bGUuc2VsZWN0ZWQgPSB7XG5cdFx0XHRcdFx0XHRjb2xvcjogJ3JnYmEoMjU1LDI1NSwyNTUsMC4wKScsXG5cdFx0XHRcdFx0XHRvdXRsaW5lOiB7XG5cdFx0XHRcdFx0XHRcdGNvbG9yOiAncmdiYSgwLDAsMCwwLjMpJyxcblx0XHRcdFx0XHRcdFx0c2l6ZTogMlxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0c3R5bGUuY29sb3IgPSAncmdiYSgyNTUsMjU1LDI1NSwwKSc7XG5cdFx0XHRcdFx0c3R5bGUub3V0bGluZSA9IHtcblx0XHRcdFx0XHRcdGNvbG9yOiAncmdiYSgyNTUsMjU1LDI1NSwwKScsXG5cdFx0XHRcdFx0XHRzaXplOiAxXG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gc3R5bGU7XG5cdFx0fTtcblxuXHRcdCRzY29wZS5kcmF3Q291bnRyaWVzID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0bGVhZmxldERhdGEuZ2V0TWFwKCdtYXAnKS50aGVuKGZ1bmN0aW9uIChtYXApIHtcblx0XHRcdFx0JHNjb3BlLiR3YXRjaCgnYmJveCcsIGZ1bmN0aW9uIChuLCBvKSB7XG5cdFx0XHRcdFx0aWYgKG4gPT09IG8pIHtcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHR2YXIgbGF0ID0gW24uY29vcmRpbmF0ZXNbMF1bMF1bMV0sXG5cdFx0XHRcdFx0XHRcdFtuLmNvb3JkaW5hdGVzWzBdWzBdWzBdXVxuXHRcdFx0XHRcdFx0XSxcblx0XHRcdFx0XHRcdGxuZyA9IFtuLmNvb3JkaW5hdGVzWzBdWzJdWzFdLFxuXHRcdFx0XHRcdFx0XHRbbi5jb29yZGluYXRlc1swXVsyXVswXV1cblx0XHRcdFx0XHRcdF1cblx0XHRcdFx0XHR2YXIgc291dGhXZXN0ID0gTC5sYXRMbmcobi5jb29yZGluYXRlc1swXVswXVsxXSwgbi5jb29yZGluYXRlc1swXVswXVswXSksXG5cdFx0XHRcdFx0XHRub3J0aEVhc3QgPSBMLmxhdExuZyhuLmNvb3JkaW5hdGVzWzBdWzJdWzFdLCBuLmNvb3JkaW5hdGVzWzBdWzJdWzBdKSxcblx0XHRcdFx0XHRcdGJvdW5kcyA9IEwubGF0TG5nQm91bmRzKHNvdXRoV2VzdCwgbm9ydGhFYXN0KTtcblx0XHRcdFx0XHR2YXIgcGFkID0gW1xuXHRcdFx0XHRcdFx0WzM1MCwgMjAwXSxcblx0XHRcdFx0XHRcdFswLCAyMDBdXG5cdFx0XHRcdFx0XTtcblx0XHRcdFx0XHRpZiAoJHNjb3BlLmNvbXBhcmUuYWN0aXZlKSB7XG5cdFx0XHRcdFx0XHRwYWQgPSBbXG5cdFx0XHRcdFx0XHRcdFszNTAsIDBdLFxuXHRcdFx0XHRcdFx0XHRbMCwgMF1cblx0XHRcdFx0XHRcdF07XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0bWFwLmZpdEJvdW5kcyhib3VuZHMsIHtcblx0XHRcdFx0XHRcdHBhZGRpbmdUb3BMZWZ0OiBwYWRbMF0sXG5cdFx0XHRcdFx0XHRwYWRkaW5nQm90dG9tUmlnaHQ6IHBhZFsxXSxcblx0XHRcdFx0XHRcdG1heFpvb206IDZcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fSk7XG5cdFx0XHRcdHZhciBhcGlLZXkgPSAncGsuZXlKMUlqb2liV0ZuYm05c2J5SXNJbUVpT2lKdVNGZFVZa2c0SW4wLjVIT3lrS2swcE5QMU4zaXNmUFFHVFEnO1xuXHRcdFx0XHR2YXIgZGVidWcgPSB7fTtcblx0XHRcdFx0dmFyIG1iID0gJ2h0dHBzOi8vYS50aWxlcy5tYXBib3guY29tL3Y0L21hcGJveC5tYXBib3gtdGVycmFpbi12MSxtYXBib3gubWFwYm94LXN0cmVldHMtdjYtZGV2L3t6fS97eH0ve3l9LnZlY3Rvci5wYmY/YWNjZXNzX3Rva2VuPXBrLmV5SjFJam9pYldGd1ltOTRJaXdpWVNJNklsaEhWa1ptYVc4aWZRLmhBTVg1aFNXLVFuVGVSQ01BeTlBOFEnO1xuXHRcdFx0XHR2YXIgbWFwemVuID0gJ2h0dHA6Ly92ZWN0b3IubWFwemVuLmNvbS9vc20vcGxhY2VzL3t6fS97eH0ve3l9Lm12dD9hcGlfa2V5PXZlY3Rvci10aWxlcy1RM19PczV3J1xuXHRcdFx0XHR2YXIgdXJsID0gJ2h0dHA6Ly92MjIwMTUwNTI4MzU4MjUzNTgueW91cnZzZXJ2ZXIubmV0OjMwMDEvc2VydmljZXMvcG9zdGdpcy9jb3VudHJpZXNfYmlnL2dlb20vdmVjdG9yLXRpbGVzL3t6fS97eH0ve3l9LnBiZj9maWVsZHM9aWQsYWRtaW4sYWRtMF9hMyx3Yl9hMyxzdV9hMyxpc29fYTMsbmFtZSxuYW1lX2xvbmcnOyAvL1xuXHRcdFx0XHR2YXIgdXJsMiA9ICdodHRwczovL2EudGlsZXMubWFwYm94LmNvbS92NC9tYXBib3gubWFwYm94LXN0cmVldHMtdjYtZGV2L3t6fS97eH0ve3l9LnZlY3Rvci5wYmY/YWNjZXNzX3Rva2VuPScgKyBhcGlLZXk7XG5cdFx0XHRcdCRzY29wZS5tdnRTb3VyY2UgPSBuZXcgTC5UaWxlTGF5ZXIuTVZUU291cmNlKHtcblx0XHRcdFx0XHR1cmw6IHVybCxcblx0XHRcdFx0XHRkZWJ1ZzogZmFsc2UsXG5cdFx0XHRcdFx0b3BhY2l0eTogMC42LFxuXHRcdFx0XHRcdGNsaWNrYWJsZUxheWVyczogWydjb3VudHJpZXNfYmlnX2dlb20nXSxcblx0XHRcdFx0XHRtdXRleFRvZ2dsZTogdHJ1ZSxcblx0XHRcdFx0XHRvbkNsaWNrOiBmdW5jdGlvbiAoZXZ0LCB0KSB7XG5cdFx0XHRcdFx0XHRpZiAoISRzY29wZS5jb21wYXJlLmFjdGl2ZSkge1xuXHRcdFx0XHRcdFx0XHQkc2NvcGUuY3VycmVudCA9IGdldE5hdGlvbkJ5SXNvKGV2dC5mZWF0dXJlLnByb3BlcnRpZXMuYWRtMF9hMyk7XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHQkc2NvcGUudG9nZ2xlQ291bnRyaWVMaXN0KGdldE5hdGlvbkJ5SXNvKGV2dC5mZWF0dXJlLnByb3BlcnRpZXMuYWRtMF9hMykpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0Z2V0SURGb3JMYXllckZlYXR1cmU6IGZ1bmN0aW9uIChmZWF0dXJlKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZmVhdHVyZS5wcm9wZXJ0aWVzLmFkbTBfYTM7XG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRmaWx0ZXI6IGZ1bmN0aW9uIChmZWF0dXJlLCBjb250ZXh0KSB7XG5cblx0XHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0c3R5bGU6IGNvdW50cmllc1N0eWxlIC8vLFxuXHRcdFx0XHRcdFx0LypsYXllckxpbms6IGZ1bmN0aW9uIChsYXllck5hbWUpIHtcblx0XHRcdFx0XHRcdFx0Y29uc29sZS5sb2cobGF5ZXJOYW1lKTtcblx0XHRcdFx0XHRcdFx0aWYgKGxheWVyTmFtZS5pbmRleE9mKCdfbGFiZWwnKSA+IC0xKSB7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIGxheWVyTmFtZS5yZXBsYWNlKCdfbGFiZWwnLCAnJyk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0cmV0dXJuIGxheWVyTmFtZSArICdfbGFiZWwnO1xuXHRcdFx0XHRcdFx0fSovXG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRtYXAuYWRkTGF5ZXIoJHNjb3BlLm12dFNvdXJjZSk7XG5cdFx0XHRcdCRzY29wZS5tdnRTb3VyY2Uuc2V0T3BhY2l0eSgwLjUpO1xuXHRcdFx0XHQkc2NvcGUuc2V0U2VsZWN0ZWRGZWF0dXJlKCk7XG5cdFx0XHR9KTtcblx0XHR9O1xuXHRcdCRzY29wZS5kcmF3Q291bnRyaWVzKCk7XG5cdH0pO1xufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0dlbmVyYXRvcnNDdHJsJywgZnVuY3Rpb24oKXtcbiAgICAgICAgLy9cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignSGVhZGVyQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgJHJvb3RTY29wZSl7XG5cblx0XHQkc2NvcGUuJHdhdGNoKGZ1bmN0aW9uKCl7XG5cdFx0XHRyZXR1cm4gJHJvb3RTY29wZS5jdXJyZW50X3BhZ2U7XG5cdFx0fSwgZnVuY3Rpb24obmV3UGFnZSl7XG5cdFx0XHQkc2NvcGUuY3VycmVudF9wYWdlID0gbmV3UGFnZSB8fCAnUGFnZSBOYW1lJztcblx0XHR9KTtcblxuXG5cdH0pO1xuXG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdJbXBvcnRjc3ZDdHJsJywgZnVuY3Rpb24gKCRtZERpYWxvZykge1xuXHRcdHRoaXMuc2V0dGluZ3MgPSB7XG5cdFx0XHRwcmludExheW91dDogdHJ1ZSxcblx0XHRcdHNob3dSdWxlcjogdHJ1ZSxcblx0XHRcdHNob3dTcGVsbGluZ1N1Z2dlc3Rpb25zOiB0cnVlLFxuXHRcdFx0cHJlc2VudGF0aW9uTW9kZTogJ2VkaXQnXG5cdFx0fTtcblxuXHRcdHRoaXMuc2FtcGxlQWN0aW9uID0gZnVuY3Rpb24gKG5hbWUsIGV2KSB7XG5cdFx0XHQkbWREaWFsb2cuc2hvdygkbWREaWFsb2cuYWxlcnQoKVxuXHRcdFx0XHQudGl0bGUobmFtZSlcblx0XHRcdFx0LmNvbnRlbnQoJ1lvdSB0cmlnZ2VyZWQgdGhlIFwiJyArIG5hbWUgKyAnXCIgYWN0aW9uJylcblx0XHRcdFx0Lm9rKCdHcmVhdCcpXG5cdFx0XHRcdC50YXJnZXRFdmVudChldilcblx0XHRcdCk7XG5cdFx0fTtcblxuICAgIHRoaXMub3BlbkNzdlVwbG9hZCA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0JG1kRGlhbG9nLnNob3coe1xuXHRcdFx0XHRcdC8vY29udHJvbGxlcjogRGlhbG9nQ29udHJvbGxlcixcblx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogJy92aWV3cy9hcHAvaW1wb3J0Y3N2L2NzdlVwbG9hZERpYWxvZy5odG1sJyxcblx0ICAgICAgICBiaW5kVG9Db250cm9sbGVyOiB0cnVlLFxuXHRcdFx0XHR9KVxuXHRcdFx0XHQudGhlbihmdW5jdGlvbiAoYW5zd2VyKSB7XG5cblx0XHRcdFx0fSwgZnVuY3Rpb24gKCkge1xuXG5cdFx0XHRcdH0pO1xuXHRcdH07XG5cdH0pXG5cblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignSnd0QXV0aEN0cmwnLCBmdW5jdGlvbigkc2NvcGUsICRhdXRoLCBSZXN0YW5ndWxhcil7XG5cblx0XHR2YXIgY3JlZGVudGlhbHMgPSB7fTtcblxuXHRcdCRzY29wZS5yZXF1ZXN0VG9rZW4gPSBmdW5jdGlvbigpe1xuXHRcdFx0Ly8gVXNlIFNhdGVsbGl6ZXIncyAkYXV0aCBzZXJ2aWNlIHRvIGxvZ2luIGJlY2F1c2UgaXQnbGwgYXV0b21hdGljYWxseSBzYXZlIHRoZSBKV1QgaW4gbG9jYWxTdG9yYWdlXG5cdFx0XHQkYXV0aC5sb2dpbihjcmVkZW50aWFscykudGhlbihmdW5jdGlvbiAoZGF0YSl7XG5cdFx0XHRcdC8vIElmIGxvZ2luIGlzIHN1Y2Nlc3NmdWwsIHJlZGlyZWN0IHRvIHRoZSB1c2VycyBzdGF0ZVxuXHRcdFx0XHQvLyRzdGF0ZS5nbygnZGFzaGJvYXJkJyk7XG5cdFx0XHR9KTtcblx0XHR9O1xuXG5cdFx0Ly8gVGhpcyByZXF1ZXN0IHdpbGwgaGl0IHRoZSBnZXREYXRhIG1ldGhvZCBpbiB0aGUgQXV0aGVudGljYXRlQ29udHJvbGxlclxuXHRcdC8vIG9uIHRoZSBMYXJhdmVsIHNpZGUgYW5kIHdpbGwgcmV0dXJuIHlvdXIgZGF0YSB0aGF0IHJlcXVpcmUgYXV0aGVudGljYXRpb25cblx0XHQkc2NvcGUuZ2V0RGF0YSA9IGZ1bmN0aW9uKCl7XG5cdFx0XHRSZXN0YW5ndWxhci5hbGwoJ2F1dGhlbnRpY2F0ZS9kYXRhJykuZ2V0KCkudGhlbihmdW5jdGlvbiAocmVzcG9uc2Upe1xuXG5cdFx0XHR9LCBmdW5jdGlvbiAoZXJyb3Ipe30pO1xuXHRcdH07XG5cblxuXG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdMYW5kaW5nQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgJG1kVG9hc3QsICRtZERpYWxvZywgJGludGVydmFsLCBUb2FzdFNlcnZpY2UsIERpYWxvZ1NlcnZpY2Upe1xuXG5cdFx0JHNjb3BlLnByb21vSW1hZ2UgPSAnaHR0cHM6Ly9pLmltZ3VyLmNvbS9aYkx6T1BQLmpwZyc7XG5cdFx0JHNjb3BlLmljb24gPSAnc2VuZCc7XG5cblx0XHR2YXIgaWNvbnMgPSBbXG5cdFx0XHRcdCdvZmZpY2UnLCAnZmFjZWJvb2snLCAndHdpdHRlcicsICdhcHBsZScsICd3aGF0c2FwcCcsICdsaW5rZWRpbicsICd3aW5kb3dzJywgJ2FjY2Vzc2liaWxpdHknLCAnYWxhcm0nLCAnYXNwZWN0X3JhdGlvJyxcblx0XHRcdFx0J2F1dG9yZW5ldycsICdib29rbWFya19vdXRsaW5lJywgJ2Rhc2hib2FyZCcsICdkbnMnLCAnZmF2b3JpdGVfb3V0bGluZScsICdnZXRfYXBwJywgJ2hpZ2hsaWdodF9yZW1vdmUnLCAnaGlzdG9yeScsICdsaXN0Jyxcblx0XHRcdFx0J3BpY3R1cmVfaW5fcGljdHVyZScsICdwcmludCcsICdzZXR0aW5nc19ldGhlcm5ldCcsICdzZXR0aW5nc19wb3dlcicsICdzaG9wcGluZ19jYXJ0JywgJ3NwZWxsY2hlY2snLCAnc3dhcF9ob3JpeicsICdzd2FwX3ZlcnQnLFxuXHRcdFx0XHQndGh1bWJfdXAnLCAndGh1bWJzX3VwX2Rvd24nLCAndHJhbnNsYXRlJywgJ3RyZW5kaW5nX3VwJywgJ3Zpc2liaWxpdHknLCAnd2FybmluZycsICdtaWMnLCAncGxheV9jaXJjbGVfb3V0bGluZScsICdyZXBlYXQnLFxuXHRcdFx0XHQnc2tpcF9uZXh0JywgJ2NhbGwnLCAnY2hhdCcsICdjbGVhcl9hbGwnLCAnZGlhbHBhZCcsICdkbmRfb24nLCAnZm9ydW0nLCAnbG9jYXRpb25fb24nLCAndnBuX2tleScsICdmaWx0ZXJfbGlzdCcsICdpbmJveCcsXG5cdFx0XHRcdCdsaW5rJywgJ3JlbW92ZV9jaXJjbGVfb3V0bGluZScsICdzYXZlJywgJ3RleHRfZm9ybWF0JywgJ2FjY2Vzc190aW1lJywgJ2FpcnBsYW5lbW9kZV9vbicsICdibHVldG9vdGgnLCAnZGF0YV91c2FnZScsXG5cdFx0XHRcdCdncHNfZml4ZWQnLCAnbm93X3dhbGxwYXBlcicsICdub3dfd2lkZ2V0cycsICdzdG9yYWdlJywgJ3dpZmlfdGV0aGVyaW5nJywgJ2F0dGFjaF9maWxlJywgJ2Zvcm1hdF9saW5lX3NwYWNpbmcnLFxuXHRcdFx0XHQnZm9ybWF0X2xpc3RfbnVtYmVyZWQnLCAnZm9ybWF0X3F1b3RlJywgJ3ZlcnRpY2FsX2FsaWduX2NlbnRlcicsICd3cmFwX3RleHQnLCAnY2xvdWRfcXVldWUnLCAnZmlsZV9kb3dubG9hZCcsICdmb2xkZXJfb3BlbicsXG5cdFx0XHRcdCdjYXN0JywgJ2hlYWRzZXQnLCAna2V5Ym9hcmRfYmFja3NwYWNlJywgJ21vdXNlJywgJ3NwZWFrZXInLCAnd2F0Y2gnLCAnYXVkaW90cmFjaycsICdlZGl0JywgJ2JydXNoJywgJ2xvb2tzJywgJ2Nyb3BfZnJlZScsXG5cdFx0XHRcdCdjYW1lcmEnLCAnZmlsdGVyX3ZpbnRhZ2UnLCAnaGRyX3N0cm9uZycsICdwaG90b19jYW1lcmEnLCAnc2xpZGVzaG93JywgJ3RpbWVyJywgJ2RpcmVjdGlvbnNfYmlrZScsICdob3RlbCcsICdsb2NhbF9saWJyYXJ5Jyxcblx0XHRcdFx0J2RpcmVjdGlvbnNfd2FsaycsICdsb2NhbF9jYWZlJywgJ2xvY2FsX3BpenphJywgJ2xvY2FsX2Zsb3Jpc3QnLCAnbXlfbG9jYXRpb24nLCAnbmF2aWdhdGlvbicsICdwaW5fZHJvcCcsICdhcnJvd19iYWNrJywgJ21lbnUnLFxuXHRcdFx0XHQnY2xvc2UnLCAnbW9yZV9ob3JpeicsICdtb3JlX3ZlcnQnLCAncmVmcmVzaCcsICdwaG9uZV9wYXVzZWQnLCAndmlicmF0aW9uJywgJ2Nha2UnLCAnZ3JvdXAnLCAnbW9vZCcsICdwZXJzb24nLFxuXHRcdFx0XHQnbm90aWZpY2F0aW9uc19ub25lJywgJ3BsdXNfb25lJywgJ3NjaG9vbCcsICdzaGFyZScsICdzdGFyX291dGxpbmUnXG5cdFx0XHRdLFxuXHRcdFx0Y291bnRlciA9IDA7XG5cblx0XHQkaW50ZXJ2YWwoZnVuY3Rpb24oKXtcblx0XHRcdCRzY29wZS5pY29uID0gaWNvbnNbKytjb3VudGVyXTtcblx0XHRcdGlmIChjb3VudGVyID4gMTEyKXtcblx0XHRcdFx0Y291bnRlciA9IDA7XG5cdFx0XHR9XG5cdFx0fSwgMjAwMCk7XG5cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignTG9naW5DdHJsJywgZnVuY3Rpb24gKCl7XG5cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdNYXBDdHJsJywgZnVuY3Rpb24gKCRzY29wZSwgJHJvb3RTY29wZSwgJHRpbWVvdXQsIE1hcFNlcnZpY2UsIGxlYWZsZXREYXRhLCAkaHR0cCkge1xuXHRcdC8vXG5cdFx0dmFyIGFwaUtleSA9ICdway5leUoxSWpvaWJXRm5ibTlzYnlJc0ltRWlPaUp1U0ZkVVlrZzRJbjAuNUhPeWtLazBwTlAxTjNpc2ZQUUdUUSc7XG5cblx0XHQvKiRzY29wZS5kZWZhdWx0cyA9IHtcblx0XHRcdHRpbGVMYXllcjogJ2h0dHBzOi8ve3N9LnRpbGVzLm1hcGJveC5jb20vdjQvbWFwYm94LnBlbmNpbC97en0ve3h9L3t5fS5wbmc/YWNjZXNzX3Rva2VuPScgKyBhcGlLZXksXG5cdFx0XHRtYXhab29tOiAxNCxcblx0XHRcdGRldGVjdFJldGluYTogdHJ1ZSxcblx0XHRcdGF0dHJpYnV0aW9uOiAnJ1xuXHRcdH07Ki9cblx0XHQkc2NvcGUuY2VudGVyID0ge1xuXHRcdFx0bGF0OiAwLFxuXHRcdFx0bG5nOiAwLFxuXHRcdFx0em9vbTogM1xuXHRcdH07XG5cdFx0JHNjb3BlLmRlZmF1bHRzID0ge1xuXHRcdFx0c2Nyb2xsV2hlZWxab29tOiBmYWxzZVxuXHRcdH07XG5cdFx0YW5ndWxhci5leHRlbmQoJHJvb3RTY29wZSwge1xuXHRcdFx0Y2VudGVyOiB7XG5cdFx0XHRcdGxhdDogMCxcblx0XHRcdFx0bG5nOiAwLFxuXHRcdFx0XHR6b29tOiAzXG5cdFx0XHR9LFxuXHRcdFx0bGF5ZXJzOiB7XG5cdFx0XHRcdGJhc2VsYXllcnM6IHtcblx0XHRcdFx0XHR4eXo6IHtcblx0XHRcdFx0XHRcdG5hbWU6ICdNYXBCb3ggUGVuY2lsJyxcblx0XHRcdFx0XHRcdHVybDogJ2h0dHBzOi8ve3N9LnRpbGVzLm1hcGJveC5jb20vdjQvbWFwYm94Lm91dGRvb3JzL3t6fS97eH0ve3l9LnBuZz9hY2Nlc3NfdG9rZW49JyArIGFwaUtleSxcblx0XHRcdFx0XHRcdHR5cGU6ICd4eXonLFxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSxcblx0XHRcdFx0b3ZlcmxheXM6IHtcblx0XHRcdFx0XHRkZW1vc3V0ZmdyaWQ6IHtcblx0XHRcdFx0XHRcdG5hbWU6ICdVVEZHcmlkIEludGVyYWN0aXZpdHknLFxuXHRcdFx0XHRcdFx0dHlwZTogJ3V0ZkdyaWQnLFxuXHRcdFx0XHRcdFx0dXJsOiAnaHR0cDovL3tzfS50aWxlcy5tYXBib3guY29tL3YzL21hcGJveC5nZW9ncmFwaHktY2xhc3Mve3p9L3t4fS97eX0uZ3JpZC5qc29uP2NhbGxiYWNrPXtjYn0nLFxuXHRcdFx0XHRcdFx0dmlzaWJsZTogdHJ1ZVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0Lyp3bXM6IHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0IG5hbWU6ICdFRVVVIFN0YXRlcyAoV01TKScsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdCB0eXBlOiAnd21zJyxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0IHZpc2libGU6IHRydWUsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdCB1cmw6ICdodHRwOi8vc3VpdGUub3Blbmdlby5vcmcvZ2Vvc2VydmVyL3VzYS93bXMnLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQgbGF5ZXJQYXJhbXM6IHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdCBsYXllcnM6ICd1c2E6c3RhdGVzJyxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdCBmb3JtYXQ6ICdpbWFnZS9wbmcnLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0IHRyYW5zcGFyZW50OiB0cnVlXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdCB9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0IH0qL1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0Lyokc2NvcGUuc2VhcmNoSVAgPSBmdW5jdGlvbiAoaXApIHtcblx0XHRcdHZhciB1cmwgPSBcImh0dHA6Ly9mcmVlZ2VvaXAubmV0L2pzb24vXCIgKyBpcDtcblx0XHRcdCRodHRwLmdldCh1cmwpLnN1Y2Nlc3MoZnVuY3Rpb24gKHJlcykge1xuXHRcdFx0XHQkc2NvcGUuY2VudGVyID0ge1xuXHRcdFx0XHRcdGxhdDogcmVzLmxhdGl0dWRlLFxuXHRcdFx0XHRcdGxuZzogcmVzLmxvbmdpdHVkZSxcblx0XHRcdFx0XHR6b29tOiAzXG5cdFx0XHRcdH1cblx0XHRcdFx0JHNjb3BlLmlwID0gcmVzLmlwO1xuXHRcdFx0fSlcblx0XHR9OyovXG5cblx0XHQvLyRzY29wZS5zZWFyY2hJUChcIlwiKTtcblx0XHQkc2NvcGUuaW50ZXJhY3Rpdml0eSA9IFwiXCI7XG5cdFx0JHNjb3BlLmZsYWcgPSBcIlwiO1xuXHRcdCRzY29wZS4kb24oJ2xlYWZsZXREaXJlY3RpdmVNYXAudXRmZ3JpZE1vdXNlb3ZlcicsIGZ1bmN0aW9uIChldmVudCwgbGVhZmxldEV2ZW50KSB7XG5cdFx0XHQvLyB0aGUgVVRGR3JpZCBpbmZvcm1hdGlvbiBpcyBvbiBsZWFmbGV0RXZlbnQuZGF0YVxuXHRcdFx0JHNjb3BlLmludGVyYWN0aXZpdHkgPSBsZWFmbGV0RXZlbnQuZGF0YS5hZG1pbjtcblx0XHRcdCRzY29wZS5mbGFnID0gXCJkYXRhOmltYWdlL3BuZztiYXNlNjQsXCIgKyBsZWFmbGV0RXZlbnQuZGF0YS5mbGFnX3BuZztcblxuXHRcdH0pO1xuXHRcdCRzY29wZS4kb24oJ2xlYWZsZXREaXJlY3RpdmVNYXAudXRmZ3JpZE1vdXNlb3V0JywgZnVuY3Rpb24gKGV2ZW50LCBsZWFmbGV0RXZlbnQpIHtcblx0XHRcdCRzY29wZS5pbnRlcmFjdGl2aXR5ID0gXCJcIjtcblx0XHRcdCRzY29wZS5mbGFnID0gXCJcIjtcblx0XHR9KTtcblx0XHRNYXBTZXJ2aWNlLnNldExlYWZsZXREYXRhKGxlYWZsZXREYXRhLmdldE1hcCgnbWFwJykpO1xuXG5cdH0pO1xufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ01pc2NDdHJsJywgZnVuY3Rpb24oKXtcbiAgICAgICAgLy9cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ1Jlc3RBcGlDdHJsJywgZnVuY3Rpb24oKXtcbiAgICAgICAgLy9cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignU2lkZWJhckN0cmwnLCBmdW5jdGlvbigkc2NvcGUsICRzdGF0ZSl7XG5cblxuXHR9KTtcblxufSkoKTsiLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0Rhc2hib2FyZEN0cmwnLCBmdW5jdGlvbigpe1xuXG5cdH0pO1xuXG59KSgpOyIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignVG9hc3RzQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgVG9hc3RTZXJ2aWNlKXtcblxuXHRcdCRzY29wZS50b2FzdFN1Y2Nlc3MgPSBmdW5jdGlvbigpe1xuXHRcdFx0VG9hc3RTZXJ2aWNlLnNob3coJ1VzZXIgYWRkZWQgc3VjY2Vzc2Z1bGx5IScpO1xuXHRcdH07XG5cblx0XHQkc2NvcGUudG9hc3RFcnJvciA9IGZ1bmN0aW9uKCl7XG5cdFx0XHRUb2FzdFNlcnZpY2UuZXJyb3IoJ0Nvbm5lY3Rpb24gaW50ZXJydXB0ZWQhJyk7XG5cdFx0fTtcblxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ1Vuc3VwcG9ydGVkQnJvd3NlckN0cmwnLCBmdW5jdGlvbigpe1xuICAgICAgICAvL1xuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCAnYXBwLmNvbnRyb2xsZXJzJyApLmNvbnRyb2xsZXIoICdCdWJibGVzQ3RybCcsIGZ1bmN0aW9uKCl7XG5cdFx0Ly9cbiAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRmdW5jdGlvbiBDdXN0b21Ub29sdGlwKHRvb2x0aXBJZCwgd2lkdGgpIHtcblx0XHR2YXIgdG9vbHRpcElkID0gdG9vbHRpcElkO1xuXHRcdHZhciBlbGVtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodG9vbHRpcElkKTtcblx0XHRpZihlbGVtID09IG51bGwpe1xuXHRcdFx0YW5ndWxhci5lbGVtZW50KGRvY3VtZW50KS5maW5kKCdib2R5JykuYXBwZW5kKFwiPGRpdiBjbGFzcz0ndG9vbHRpcCBtZC13aGl0ZWZyYW1lLXozJyBpZD0nXCIgKyB0b29sdGlwSWQgKyBcIic+PC9kaXY+XCIpO1xuXHRcdH1cblx0XHRoaWRlVG9vbHRpcCgpO1xuXHRcdGZ1bmN0aW9uIHNob3dUb29sdGlwKGNvbnRlbnQsIGRhdGEsIGV2ZW50LCBlbGVtZW50KSB7XG5cdFx0XHRhbmd1bGFyLmVsZW1lbnQoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignIycgKyB0b29sdGlwSWQpKS5odG1sKGNvbnRlbnQpO1xuXHRcdFx0YW5ndWxhci5lbGVtZW50KGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyMnICsgdG9vbHRpcElkKSkuY3NzKCdkaXNwbGF5JywgJ2Jsb2NrJyk7XG5cblx0XHRcdHJldHVybiB1cGRhdGVQb3NpdGlvbihldmVudCwgZGF0YSwgZWxlbWVudCk7XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIGhpZGVUb29sdGlwKCkge1xuXHRcdFx0YW5ndWxhci5lbGVtZW50KGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyMnICsgdG9vbHRpcElkKSkuY3NzKCdkaXNwbGF5JywgJ25vbmUnKTtcblx0XHR9XG5cdFx0ZnVuY3Rpb24gdXBkYXRlUG9zaXRpb24oZXZlbnQsIGQsIGVsZW1lbnQpIHtcblx0XHRcdHZhciB0dGlkID0gXCIjXCIgKyB0b29sdGlwSWQ7XG5cdFx0XHR2YXIgeE9mZnNldCA9IDIwO1xuXHRcdFx0dmFyIHlPZmZzZXQgPSAxMDtcblx0XHRcdHZhciBzdmcgPSBlbGVtZW50LmZpbmQoJ3N2ZycpWzBdOy8vZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3N2Z192aXMnKTtcblx0XHRcdHZhciB3c2NyWSA9IHdpbmRvdy5zY3JvbGxZO1xuXHRcdFx0dmFyIHR0dyA9IGFuZ3VsYXIuZWxlbWVudChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHR0aWQpKS5vZmZzZXRXaWR0aDtcblx0XHRcdHZhciB0dGggPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHR0aWQpLm9mZnNldEhlaWdodDtcblx0XHRcdHZhciB0dHRvcCA9IHN2Zy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3AgKyBkLnkgLSB0dGggLyAyO1xuXHRcdFx0dmFyIHR0bGVmdCA9IHN2Zy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5sZWZ0ICsgZC54ICsgZC5yYWRpdXMgKyAxMjtcblx0XHRcdHJldHVybiBhbmd1bGFyLmVsZW1lbnQoZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0dGlkKSkuY3NzKCd0b3AnLCB0dHRvcCArICdweCcpLmNzcygnbGVmdCcsIHR0bGVmdCArICdweCcpO1xuXHRcdH1cblx0XHRyZXR1cm4ge1xuXHRcdFx0c2hvd1Rvb2x0aXA6IHNob3dUb29sdGlwLFxuXHRcdFx0aGlkZVRvb2x0aXA6IGhpZGVUb29sdGlwLFxuXHRcdFx0dXBkYXRlUG9zaXRpb246IHVwZGF0ZVBvc2l0aW9uXG5cdFx0fVxuXHR9XG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZGlyZWN0aXZlcycpLmRpcmVjdGl2ZSgnYnViYmxlcycsIGZ1bmN0aW9uICgkY29tcGlsZSkge1xuXHRcdHZhciBkZWZhdWx0cztcblx0XHRkZWZhdWx0cyA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdHdpZHRoOiAzMDAsXG5cdFx0XHRcdGhlaWdodDogMzAwLFxuXHRcdFx0XHRsYXlvdXRfZ3Jhdml0eTogMCxcblx0XHRcdFx0c2l6ZWZhY3RvcjozLFxuXHRcdFx0XHR2aXM6IG51bGwsXG5cdFx0XHRcdGZvcmNlOiBudWxsLFxuXHRcdFx0XHRkYW1wZXI6IDAuMSxcblx0XHRcdFx0Y2lyY2xlczogbnVsbCxcblx0XHRcdFx0Ym9yZGVyczogdHJ1ZSxcblx0XHRcdFx0ZmlsbF9jb2xvcjogZDMuc2NhbGUub3JkaW5hbCgpLmRvbWFpbihbXCJlaFwiLCBcImV2XCJdKS5yYW5nZShbXCIjYTMxMDMxXCIsIFwiI2JlY2NhZVwiXSksXG5cdFx0XHRcdG1heF9hbW91bnQ6ICcnLFxuXHRcdFx0XHRyYWRpdXNfc2NhbGU6ICcnLFxuXHRcdFx0XHRkdXJhdGlvbjogMTAwMCxcblx0XHRcdFx0dG9vbHRpcDogQ3VzdG9tVG9vbHRpcChcImJ1YmJsZXNfdG9vbHRpcFwiLCAyNDApXG5cdFx0XHR9O1xuXHRcdH07XG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlc3RyaWN0OiAnRScsXG5cdFx0XHRzY29wZToge1xuXHRcdFx0XHRjaGFydGRhdGE6ICc9Jyxcblx0XHRcdFx0ZGlyZWN0aW9uOiAnPScsXG5cdFx0XHRcdGdyYXZpdHk6ICc9Jyxcblx0XHRcdFx0c2l6ZWZhY3RvcjogJz0nLFxuXHRcdFx0XHRpbmRleGVyOiAnPScsXG5cdFx0XHRcdGJvcmRlcnM6ICdAJ1xuXHRcdFx0fSxcblx0XHRcdHJlcXVpcmU6ICduZ01vZGVsJyxcblx0XHRcdGxpbms6IGZ1bmN0aW9uIChzY29wZSwgZWxlbSwgYXR0cnMsIG5nTW9kZWwpIHtcblx0XHRcdFx0dmFyIG9wdGlvbnMgPSBhbmd1bGFyLmV4dGVuZChkZWZhdWx0cygpLCBhdHRycyk7XG5cdFx0XHRcdHZhciBub2RlcyA9IFtdLFxuXHRcdFx0XHRcdGxpbmtzID0gW10sXG5cdFx0XHRcdFx0Z3JvdXBzID0gW107XG5cblx0XHRcdFx0dmFyIG1heF9hbW91bnQgPSBkMy5tYXgoc2NvcGUuY2hhcnRkYXRhLCBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdHJldHVybiBwYXJzZUludChkLnZhbHVlKTtcblx0XHRcdFx0fSk7XG5cdFx0XHRcdC8vb3B0aW9ucy5oZWlnaHQgPSBvcHRpb25zLndpZHRoICogMS4xO1xuXHRcdFx0XHRvcHRpb25zLnJhZGl1c19zY2FsZSA9IGQzLnNjYWxlLnBvdygpLmV4cG9uZW50KDAuNSkuZG9tYWluKFswLCBtYXhfYW1vdW50XSkucmFuZ2UoWzIsIDg1XSk7XG5cdFx0XHRcdG9wdGlvbnMuY2VudGVyID0ge1xuXHRcdFx0XHRcdHg6IG9wdGlvbnMud2lkdGggLyAyLFxuXHRcdFx0XHRcdHk6IG9wdGlvbnMuaGVpZ2h0IC8gMlxuXHRcdFx0XHR9O1xuXHRcdFx0XHRvcHRpb25zLmNhdF9jZW50ZXJzID0ge1xuXHRcdFx0XHRcdFwiZWhcIjoge1xuXHRcdFx0XHRcdFx0eDogb3B0aW9ucy53aWR0aCAvIDIsXG5cdFx0XHRcdFx0XHR5OiBvcHRpb25zLmhlaWdodCAgKiAwLjQ1LFxuXHRcdFx0XHRcdFx0ZGFtcGVyOiAwLjA4NVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XCJldlwiOiB7XG5cdFx0XHRcdFx0XHR4OiBvcHRpb25zLndpZHRoIC8gMixcblx0XHRcdFx0XHRcdHk6IG9wdGlvbnMuaGVpZ2h0ICAqIDAuNTUsXG5cdFx0XHRcdFx0XHRkYW1wZXI6IDAuMDg1XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9O1xuXHRcdFx0XHR2YXIgY3JlYXRlX25vZGVzID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdC8vY29uc29sZS5sb2coc2NvcGUuaW5kZXhlcik7XG5cdFx0XHRcdFx0Ly9jb25zb2xlLmxvZyhzY29wZS5jaGFydGRhdGEpO1xuXHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChzY29wZS5pbmRleGVyLCBmdW5jdGlvbiAoZ3JvdXApIHtcblx0XHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChncm91cC5jaGlsZHJlbiwgZnVuY3Rpb24gKGl0ZW0pIHtcblx0XHRcdFx0XHRcdFx0Ly9jb25zb2xlLmxvZyhzY29wZS5jaGFydGRhdGFbaXRlbS5jb2x1bW5fbmFtZV0sIHNjb3BlLmNoYXJ0ZGF0YVtpdGVtLmNvbHVtbl9uYW1lXSAvIHNjb3BlLnNpemVmYWN0b3IpO1xuXHRcdFx0XHRcdFx0XHRpZiAoc2NvcGUuY2hhcnRkYXRhW2l0ZW0uY29sdW1uX25hbWVdKSB7XG5cdFx0XHRcdFx0XHRcdFx0dmFyIG5vZGUgPSB7XG5cdFx0XHRcdFx0XHRcdFx0XHR0eXBlOiBpdGVtLmNvbHVtbl9uYW1lLFxuXHRcdFx0XHRcdFx0XHRcdFx0cmFkaXVzOiBzY29wZS5jaGFydGRhdGFbaXRlbS5jb2x1bW5fbmFtZV0gLyBzY29wZS5zaXplZmFjdG9yLFxuXHRcdFx0XHRcdFx0XHRcdFx0dmFsdWU6IHNjb3BlLmNoYXJ0ZGF0YVtpdGVtLmNvbHVtbl9uYW1lXSAvIHNjb3BlLnNpemVmYWN0b3IsXG5cdFx0XHRcdFx0XHRcdFx0XHRuYW1lOiBpdGVtLnRpdGxlLFxuXHRcdFx0XHRcdFx0XHRcdFx0Z3JvdXA6IGdyb3VwLmNvbHVtbl9uYW1lLnN1YnN0cmluZygwLDIpLFxuXHRcdFx0XHRcdFx0XHRcdFx0eDogb3B0aW9ucy5jZW50ZXIueCxcblx0XHRcdFx0XHRcdFx0XHRcdHk6IG9wdGlvbnMuY2VudGVyLnksXG5cdFx0XHRcdFx0XHRcdFx0XHRjb2xvcjogaXRlbS5jb2xvcixcblx0XHRcdFx0XHRcdFx0XHRcdGljb246IGl0ZW0uaWNvbixcblx0XHRcdFx0XHRcdFx0XHRcdHVuaWNvZGU6IGl0ZW0udW5pY29kZSxcblx0XHRcdFx0XHRcdFx0XHRcdGRhdGE6IGl0ZW0sXG5cdFx0XHRcdFx0XHRcdFx0XHRjaGlsZHJlbjppdGVtXG5cdFx0XHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdFx0XHRub2Rlcy5wdXNoKG5vZGUpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRjcmVhdGVfZ3JvdXBzKCk7XG5cdFx0XHRcdH07XG5cdFx0XHRcdHZhciBjcmVhdGVfZ3JvdXBzID0gZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRncm91cHMgPSB7fTtcblx0XHRcdFx0XHR2YXIgY291bnQgPSAwO1xuXHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChub2RlcywgZnVuY3Rpb24obm9kZSl7XG5cdFx0XHRcdFx0XHRcdHZhciBleGlzdHMgPSBmYWxzZTtcblx0XHRcdFx0XHRcdFx0dmFyIGdyb3VwID0ge307XG5cdFx0XHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChncm91cHMsIGZ1bmN0aW9uKGdyb3VwLCBpbmRleCl7XG5cdFx0XHRcdFx0XHRcdFx0aWYobm9kZS5ncm91cCA9PSBpbmRleCl7XG5cdFx0XHRcdFx0XHRcdFx0XHRleGlzdHMgPSB0cnVlO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRcdGlmKCFleGlzdHMpe1xuXHRcdFx0XHRcdFx0XHRcdGNvdW50Kys7XG5cdFx0XHRcdFx0XHRcdFx0Z3JvdXBzW25vZGUuZ3JvdXBdID0ge1xuXHRcdFx0XHRcdFx0XHRcdFx0eDogb3B0aW9ucy53aWR0aCAvIDIsXG5cdFx0XHRcdFx0XHRcdFx0XHR5OiBvcHRpb25zLmhlaWdodCAvIDIgKyAoMSAtIGNvdW50KSxcblx0XHRcdFx0XHRcdFx0XHRcdGRhbXBlcjogMC4wODVcblx0XHRcdFx0XHRcdFx0XHR9O1xuXG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhncm91cHMpO1xuXHRcdFx0XHR9O1xuXHRcdFx0XHR2YXIgY3JlYXRlX3ZpcyA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRhbmd1bGFyLmVsZW1lbnQoZWxlbSkuaHRtbCgnJyk7XG5cdFx0XHRcdFx0b3B0aW9ucy52aXMgPSBkMy5zZWxlY3QoZWxlbVswXSkuYXBwZW5kKFwic3ZnXCIpLmF0dHIoXCJ3aWR0aFwiLCBvcHRpb25zLndpZHRoKS5hdHRyKFwiaGVpZ2h0XCIsIG9wdGlvbnMuaGVpZ2h0KS5hdHRyKFwiaWRcIiwgXCJzdmdfdmlzXCIpO1xuXG5cdFx0XHRcdFx0aWYgKCFvcHRpb25zLmJvcmRlcnMpIHtcblx0XHRcdFx0XHRcdHZhciBwaSA9IE1hdGguUEk7XG5cdFx0XHRcdFx0XHR2YXIgYXJjVG9wID0gZDMuc3ZnLmFyYygpXG5cdFx0XHRcdFx0XHRcdC5pbm5lclJhZGl1cygxMDkpXG5cdFx0XHRcdFx0XHRcdC5vdXRlclJhZGl1cygxMTApXG5cdFx0XHRcdFx0XHRcdC5zdGFydEFuZ2xlKC05MCAqIChwaSAvIDE4MCkpIC8vY29udmVydGluZyBmcm9tIGRlZ3MgdG8gcmFkaWFuc1xuXHRcdFx0XHRcdFx0XHQuZW5kQW5nbGUoOTAgKiAocGkgLyAxODApKTsgLy9qdXN0IHJhZGlhbnNcblx0XHRcdFx0XHRcdHZhciBhcmNCb3R0b20gPSBkMy5zdmcuYXJjKClcblx0XHRcdFx0XHRcdFx0LmlubmVyUmFkaXVzKDEzNClcblx0XHRcdFx0XHRcdFx0Lm91dGVyUmFkaXVzKDEzNSlcblx0XHRcdFx0XHRcdFx0LnN0YXJ0QW5nbGUoOTAgKiAocGkgLyAxODApKSAvL2NvbnZlcnRpbmcgZnJvbSBkZWdzIHRvIHJhZGlhbnNcblx0XHRcdFx0XHRcdFx0LmVuZEFuZ2xlKDI3MCAqIChwaSAvIDE4MCkpOyAvL2p1c3QgcmFkaWFuc1xuXG5cdFx0XHRcdFx0XHRvcHRpb25zLmFyY1RvcCA9IG9wdGlvbnMudmlzLmFwcGVuZChcInBhdGhcIilcblx0XHRcdFx0XHRcdFx0LmF0dHIoXCJkXCIsIGFyY1RvcClcblx0XHRcdFx0XHRcdFx0LmF0dHIoXCJmaWxsXCIsIFwiI2JlNWYwMFwiKVxuXHRcdFx0XHRcdFx0XHQuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIisob3B0aW9ucy53aWR0aC8yKStcIixcIisob3B0aW9ucy5oZWlnaHQvMiAtIG9wdGlvbnMuaGVpZ2h0LzEwKStcIilcIik7XG5cdFx0XHRcdFx0XHRvcHRpb25zLmFyY0JvdHRvbSA9IG9wdGlvbnMudmlzLmFwcGVuZChcInBhdGhcIilcblx0XHRcdFx0XHRcdFx0LmF0dHIoXCJkXCIsIGFyY0JvdHRvbSlcblx0XHRcdFx0XHRcdFx0LmF0dHIoXCJmaWxsXCIsIFwiIzAwNmJiNlwiKVxuXHRcdFx0XHRcdFx0XHQuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIisob3B0aW9ucy53aWR0aC8yKStcIixcIisob3B0aW9ucy5oZWlnaHQvMikrXCIpXCIpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRvcHRpb25zLmNvbnRhaW5lcnMgPSBvcHRpb25zLnZpcy5zZWxlY3RBbGwoJ2cubm9kZScpLmRhdGEobm9kZXMpLmVudGVyKCkuYXBwZW5kKCdnJykuYXR0cigndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgnICsgKG9wdGlvbnMud2lkdGggLyAyKSArICcsJyArIChvcHRpb25zLmhlaWdodCAvIDIpICsgJyknKS5hdHRyKCdjbGFzcycsICdub2RlJyk7XG5cblx0XHRcdFx0XHQvKm9wdGlvbnMuY2lyY2xlcyA9IG9wdGlvbnMuY29udGFpbmVycy5zZWxlY3RBbGwoXCJjaXJjbGVcIikuZGF0YShub2RlcywgZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdHJldHVybiBkLmlkO1xuXHRcdFx0XHRcdH0pOyovXG5cblx0XHRcdFx0XHRvcHRpb25zLmNpcmNsZXMgPSBvcHRpb25zLmNvbnRhaW5lcnMuYXBwZW5kKFwiY2lyY2xlXCIpLmF0dHIoXCJyXCIsIDApLmF0dHIoXCJmaWxsXCIsIChmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGQuY29sb3IgfHwgb3B0aW9ucy5maWxsX2NvbG9yKGQuZ3JvdXApO1xuXHRcdFx0XHRcdH0pKS5hdHRyKFwic3Ryb2tlLXdpZHRoXCIsIDApLmF0dHIoXCJzdHJva2VcIiwgZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdHJldHVybiBkMy5yZ2Iob3B0aW9ucy5maWxsX2NvbG9yKGQuZ3JvdXApKS5kYXJrZXIoKTtcblx0XHRcdFx0XHR9KS5hdHRyKFwiaWRcIiwgZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdHJldHVybiBcImJ1YmJsZV9cIiArIGQuaWQ7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0b3B0aW9ucy5pY29ucyA9IG9wdGlvbnMuY29udGFpbmVycy5hcHBlbmQoXCJ0ZXh0XCIpXG5cdFx0XHRcdFx0XHQuYXR0cignZm9udC1mYW1pbHknLCAnRVBJJylcblx0XHRcdFx0XHRcdC5hdHRyKCdmb250LXNpemUnLCBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0XHQwXG5cdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0LmF0dHIoXCJ0ZXh0LWFuY2hvclwiLCBcIm1pZGRsZVwiKVxuXHRcdFx0XHRcdFx0LmF0dHIoJ2ZpbGwnLCAnI2ZmZicpXG5cdFx0XHRcdFx0XHQudGV4dChmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gZC51bmljb2RlXG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRvcHRpb25zLmljb25zLm9uKFwibW91c2VvdmVyXCIsIGZ1bmN0aW9uIChkLCBpKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gc2hvd19kZXRhaWxzKGQsIGksIHRoaXMpO1xuXHRcdFx0XHRcdH0pLm9uKFwibW91c2VvdXRcIiwgZnVuY3Rpb24gKGQsIGkpIHtcblx0XHRcdFx0XHRcdHJldHVybiBoaWRlX2RldGFpbHMoZCwgaSwgdGhpcyk7XG5cdFx0XHRcdFx0fSkub24oXCJjbGlja1wiLCBmdW5jdGlvbiAoZCwgaSkge1xuXHRcdFx0XHRcdFx0bmdNb2RlbC4kc2V0Vmlld1ZhbHVlKGQpO1xuXHRcdFx0XHRcdFx0bmdNb2RlbC4kcmVuZGVyKCk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0b3B0aW9ucy5jaXJjbGVzLnRyYW5zaXRpb24oKS5kdXJhdGlvbihvcHRpb25zLmR1cmF0aW9uKS5hdHRyKFwiclwiLCBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGQucmFkaXVzO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdG9wdGlvbnMuaWNvbnMudHJhbnNpdGlvbigpLmR1cmF0aW9uKG9wdGlvbnMuZHVyYXRpb24pLmF0dHIoXCJmb250LXNpemVcIiwgZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdHJldHVybiBkLnJhZGl1cyAqIDEuNzUgKyAncHgnO1xuXHRcdFx0XHRcdH0pLmF0dHIoJ3knLCBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGQucmFkaXVzICogLjc1ICsgJ3B4Jztcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fTtcblx0XHRcdFx0dmFyIHVwZGF0ZV92aXMgPSBmdW5jdGlvbiAoKSB7XG5cblx0XHRcdFx0XHRub2Rlcy5mb3JFYWNoKGZ1bmN0aW9uIChkLCBpKSB7XG5cdFx0XHRcdFx0XHRvcHRpb25zLmNpcmNsZXMudHJhbnNpdGlvbigpLmR1cmF0aW9uKG9wdGlvbnMuZHVyYXRpb24pLmRlbGF5KGkgKiBvcHRpb25zLmR1cmF0aW9uKVxuXHRcdFx0XHRcdFx0XHQuYXR0cihcInJcIiwgZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdFx0XHRkLnJhZGl1cyA9IGQudmFsdWUgPSBzY29wZS5jaGFydGRhdGFbZC50eXBlXSAvIHNjb3BlLnNpemVmYWN0b3I7XG5cblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gc2NvcGUuY2hhcnRkYXRhW2QudHlwZV0gLyBzY29wZS5zaXplZmFjdG9yO1xuXHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdG9wdGlvbnMuaWNvbnMudHJhbnNpdGlvbigpLmR1cmF0aW9uKG9wdGlvbnMuZHVyYXRpb24pLmRlbGF5KGkgKiBvcHRpb25zLmR1cmF0aW9uKVxuXHRcdFx0XHRcdFx0XHQuYXR0cihcImZvbnQtc2l6ZVwiLCBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybiAoc2NvcGUuY2hhcnRkYXRhW2QudHlwZV0gLyBzY29wZS5zaXplZmFjdG9yKSAqIDEuNzUgKyAncHgnXG5cdFx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0XHRcdC5hdHRyKCd5JywgZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gKHNjb3BlLmNoYXJ0ZGF0YVtkLnR5cGVdIC8gc2NvcGUuc2l6ZWZhY3RvcikgKiAuNzUgKyAncHgnO1xuXHRcdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9O1xuXHRcdFx0XHR2YXIgY2hhcmdlID0gZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRyZXR1cm4gLU1hdGgucG93KGQucmFkaXVzLCAyLjApIC8gNDtcblx0XHRcdFx0fTtcblx0XHRcdFx0dmFyIHN0YXJ0ID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdHJldHVybiBvcHRpb25zLmZvcmNlID0gZDMubGF5b3V0LmZvcmNlKCkubm9kZXMobm9kZXMpLnNpemUoW29wdGlvbnMud2lkdGgsIG9wdGlvbnMuaGVpZ2h0XSkubGlua3MobGlua3MpO1xuXHRcdFx0XHR9O1xuXHRcdFx0XHR2YXIgZGlzcGxheV9ncm91cF9hbGwgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0b3B0aW9ucy5mb3JjZS5ncmF2aXR5KG9wdGlvbnMubGF5b3V0X2dyYXZpdHkpLmNoYXJnZShjaGFyZ2UpLmZyaWN0aW9uKDAuOSkub24oXCJ0aWNrXCIsIGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gb3B0aW9ucy5jaXJjbGVzLmVhY2gobW92ZV90b3dhcmRzX2NlbnRlcihlLmFscGhhKSkuYXR0cignY3gnLCBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gZC54O1xuXHRcdFx0XHRcdFx0fSkuYXR0cihcImN5XCIsIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBkLnk7XG5cdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdG9wdGlvbnMuZm9yY2Uuc3RhcnQoKTtcblx0XHRcdFx0fTtcblx0XHRcdFx0dmFyIGRpc3BsYXlfYnlfY2F0ID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdG9wdGlvbnMuZm9yY2UuZ3Jhdml0eShvcHRpb25zLmxheW91dF9ncmF2aXR5KS5jaGFyZ2UoY2hhcmdlKS5mcmljdGlvbigwLjkpLm9uKFwidGlja1wiLCBmdW5jdGlvbiAoZSkge1xuXHRcdFx0XHRcdFx0b3B0aW9ucy5jb250YWluZXJzLmVhY2gobW92ZV90b3dhcmRzX2NhdChlLmFscGhhKSkuYXR0cihcInRyYW5zZm9ybVwiLCBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gJ3RyYW5zbGF0ZSgnICsgZC54ICsgJywnICsgZC55ICsgJyknO1xuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0b3B0aW9ucy5mb3JjZS5zdGFydCgpO1xuXHRcdFx0XHR9O1xuXHRcdFx0XHR2YXIgbW92ZV90b3dhcmRzX2NlbnRlciA9IGZ1bmN0aW9uIChhbHBoYSkge1xuXHRcdFx0XHRcdHJldHVybiAoZnVuY3Rpb24gKF90aGlzKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdFx0ZC54ID0gZC54ICsgKG9wdGlvbnMuY2VudGVyLnggLSBkLngpICogKG9wdGlvbnMuZGFtcGVyICsgMC4wMikgKiBhbHBoYTtcblx0XHRcdFx0XHRcdFx0ZC55ID0gZC55ICsgKG9wdGlvbnMuY2VudGVyLnkgLSBkLnkpICogKG9wdGlvbnMuZGFtcGVyICsgMC4wMikgKiBhbHBoYTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KSh0aGlzKTtcblx0XHRcdFx0fTtcblx0XHRcdFx0dmFyIG1vdmVfdG93YXJkc190b3AgPSBmdW5jdGlvbiAoYWxwaGEpIHtcblx0XHRcdFx0XHRyZXR1cm4gKGZ1bmN0aW9uIChfdGhpcykge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRcdGQueCA9IGQueCArIChvcHRpb25zLmNlbnRlci54IC0gZC54KSAqIChvcHRpb25zLmRhbXBlciArIDAuMDIpICogYWxwaGEgKiAxLjE7XG5cdFx0XHRcdFx0XHRcdGQueSA9IGQueSArICgyMDAgLSBkLnkpICogKG9wdGlvbnMuZGFtcGVyICsgMC4wMikgKiBhbHBoYSAqIDEuMTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KSh0aGlzKTtcblx0XHRcdFx0fTtcblx0XHRcdFx0dmFyIG1vdmVfdG93YXJkc19jYXQgPSBmdW5jdGlvbiAoYWxwaGEpIHtcblx0XHRcdFx0XHRyZXR1cm4gKGZ1bmN0aW9uIChfdGhpcykge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRcdHZhciB0YXJnZXQ7XG5cdFx0XHRcdFx0XHRcdHRhcmdldCA9IG9wdGlvbnMuY2F0X2NlbnRlcnNbZC5ncm91cF07XG5cdFx0XHRcdFx0XHRcdGQueCA9IGQueCArICh0YXJnZXQueCAtIGQueCkgKiAodGFyZ2V0LmRhbXBlciArIDAuMDIpICogYWxwaGEgKiAxO1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gZC55ID0gZC55ICsgKHRhcmdldC55IC0gZC55KSAqICh0YXJnZXQuZGFtcGVyICsgMC4wMikgKiBhbHBoYSAqIDE7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSkodGhpcyk7XG5cdFx0XHRcdH07XG5cdFx0XHRcdHZhciBzaG93X2RldGFpbHMgPSBmdW5jdGlvbiAoZGF0YSwgaSwgZWxlbWVudCkge1xuXHRcdFx0XHRcdHZhciBjb250ZW50O1xuXHRcdFx0XHRcdGNvbnRlbnQgPSBcIjxzcGFuIGNsYXNzPVxcXCJ0aXRsZVxcXCI+XCIgKyBkYXRhLm5hbWUgKyBcIjo8L3NwYW4+PGJyLz5cIjtcblx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2goZGF0YS5kYXRhLmNoaWxkcmVuLCBmdW5jdGlvbiAoaW5mbykge1xuXHRcdFx0XHRcdFx0Y29udGVudCArPSBcIjxzcGFuIGNsYXNzPVxcXCJuYW1lXFxcIiBzdHlsZT1cXFwiY29sb3I6XCIgKyAoaW5mby5jb2xvciB8fCBkYXRhLmNvbG9yKSArIFwiXFxcIj4gXCIgKyAoaW5mby50aXRsZSkgKyBcIjwvc3Bhbj48YnIvPlwiO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdCRjb21waWxlKG9wdGlvbnMudG9vbHRpcC5zaG93VG9vbHRpcChjb250ZW50LCBkYXRhLCBkMy5ldmVudCwgZWxlbSkuY29udGVudHMoKSkoc2NvcGUpO1xuXHRcdFx0XHR9O1xuXG5cdFx0XHRcdHZhciBoaWRlX2RldGFpbHMgPSBmdW5jdGlvbiAoZGF0YSwgaSwgZWxlbWVudCkge1xuXHRcdFx0XHRcdHJldHVybiBvcHRpb25zLnRvb2x0aXAuaGlkZVRvb2x0aXAoKTtcblx0XHRcdFx0fTtcblxuXHRcdFx0XHRzY29wZS4kd2F0Y2goJ2NoYXJ0ZGF0YScsIGZ1bmN0aW9uIChkYXRhLCBvbGREYXRhKSB7XG5cdFx0XHRcdFx0b3B0aW9ucy50b29sdGlwLmhpZGVUb29sdGlwKCk7XG5cdFx0XHRcdFx0aWYgKG9wdGlvbnMuY2lyY2xlcyA9PSBudWxsKSB7XG5cdFx0XHRcdFx0XHRjcmVhdGVfbm9kZXMoKTtcblx0XHRcdFx0XHRcdGNyZWF0ZV92aXMoKTtcblx0XHRcdFx0XHRcdHN0YXJ0KCk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHVwZGF0ZV92aXMoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZGlzcGxheV9ieV9jYXQoKTtcblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0c2NvcGUuJHdhdGNoKCdkaXJlY3Rpb24nLCBmdW5jdGlvbiAob2xkRCwgbmV3RCkge1xuXHRcdFx0XHRcdGlmIChvbGREID09PSBuZXdEKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmIChvbGREID09IFwiYWxsXCIpIHtcblx0XHRcdFx0XHRcdGRpc3BsYXlfZ3JvdXBfYWxsKCk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGRpc3BsYXlfYnlfY2F0KCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KVxuXHRcdFx0fVxuXHRcdH07XG5cdH0pO1xufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSggJ2FwcC5jb250cm9sbGVycycgKS5jb250cm9sbGVyKCAnQ2lyY2xlZ3JhcGhDdHJsJywgZnVuY3Rpb24oKXtcblx0XHQvL1xuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmRpcmVjdGl2ZXMnKS5kaXJlY3RpdmUoJ2NpcmNsZWdyYXBoJywgZnVuY3Rpb24oJHRpbWVvdXQpIHtcblx0XHR2YXIgZGVmYXVsdHMgPSBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdHdpZHRoOiA4MCxcblx0XHRcdFx0aGVpZ2h0OiA4MCxcblx0XHRcdFx0Y29sb3I6ICcjMDBjY2FhJyxcblx0XHRcdFx0c2l6ZTogMTc4LFxuXHRcdFx0XHRmaWVsZDogJ3JhbmsnXG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiB7XG5cdFx0XHRyZXN0cmljdDogJ0UnLFxuXHRcdFx0Y29udHJvbGxlcjogJ0NpcmNsZWdyYXBoQ3RybCcsXG5cdFx0XHRzY29wZTogdHJ1ZSxcblx0XHRcdHJlcXVpcmU6ICduZ01vZGVsJyxcblx0XHRcdGxpbms6IGZ1bmN0aW9uKCRzY29wZSwgZWxlbWVudCwgJGF0dHJzLCBuZ01vZGVsKSB7XG5cdFx0XHRcdC8vRmV0Y2hpbmcgT3B0aW9uc1xuXG5cdFx0XHRcdHZhciBvcHRpb25zID0gYW5ndWxhci5leHRlbmQoZGVmYXVsdHMoKSwgJGF0dHJzKTtcblxuXHRcdFx0XHQvL0NyZWF0aW5nIHRoZSBTY2FsZVxuXHRcdFx0XHR2YXIgcm90YXRlID0gZDMuc2NhbGUubGluZWFyKClcblx0XHRcdFx0XHQuZG9tYWluKFsxLCBvcHRpb25zLnNpemVdKVxuXHRcdFx0XHRcdC5yYW5nZShbMSwgMF0pXG5cdFx0XHRcdFx0LmNsYW1wKHRydWUpO1xuXG5cdFx0XHRcdC8vQ3JlYXRpbmcgRWxlbWVudHNcblx0XHRcdFx0dmFyIHN2ZyA9IGQzLnNlbGVjdChlbGVtZW50WzBdKS5hcHBlbmQoJ3N2ZycpXG5cdFx0XHRcdFx0LmF0dHIoJ3dpZHRoJywgb3B0aW9ucy53aWR0aClcblx0XHRcdFx0XHQuYXR0cignaGVpZ2h0Jywgb3B0aW9ucy5oZWlnaHQpXG5cdFx0XHRcdFx0LmFwcGVuZCgnZycpO1xuXHRcdFx0XHR2YXIgY29udGFpbmVyID0gc3ZnLmFwcGVuZCgnZycpXG5cdFx0XHRcdFx0LmF0dHIoJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoJyArIG9wdGlvbnMud2lkdGggLyAyICsgJywnICsgb3B0aW9ucy5oZWlnaHQgLyAyICsgJyknKTtcblx0XHRcdFx0dmFyIGNpcmNsZUJhY2sgPSBjb250YWluZXIuYXBwZW5kKCdjaXJjbGUnKVxuXHRcdFx0XHRcdC5hdHRyKCdyJywgb3B0aW9ucy53aWR0aCAvIDIgLSAyKVxuXHRcdFx0XHRcdC5hdHRyKCdzdHJva2Utd2lkdGgnLCAyKVxuXHRcdFx0XHRcdC5hdHRyKCdzdHJva2UnLCBvcHRpb25zLmNvbG9yKVxuXHRcdFx0XHRcdC5zdHlsZSgnb3BhY2l0eScsICcwLjYnKVxuXHRcdFx0XHRcdC5hdHRyKCdmaWxsJywgJ25vbmUnKTtcblx0XHRcdFx0dmFyIGFyYyA9IGQzLnN2Zy5hcmMoKVxuXHRcdFx0XHRcdC5zdGFydEFuZ2xlKDApXG5cdFx0XHRcdFx0LmlubmVyUmFkaXVzKGZ1bmN0aW9uKGQpIHtcblx0XHRcdFx0XHRcdHJldHVybiBvcHRpb25zLndpZHRoIC8gMiAtIDQ7XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQub3V0ZXJSYWRpdXMoZnVuY3Rpb24oZCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIG9wdGlvbnMud2lkdGggLyAyO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR2YXIgY2lyY2xlR3JhcGggPSBjb250YWluZXIuYXBwZW5kKCdwYXRoJylcblx0XHRcdFx0XHQuZGF0dW0oe1xuXHRcdFx0XHRcdFx0ZW5kQW5nbGU6IDIgKiBNYXRoLlBJICogMFxuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0LnN0eWxlKFwiZmlsbFwiLCBvcHRpb25zLmNvbG9yKVxuXHRcdFx0XHRcdC5hdHRyKCdkJywgYXJjKTtcblx0XHRcdFx0dmFyIHRleHQgPSBjb250YWluZXIuc2VsZWN0QWxsKCd0ZXh0Jylcblx0XHRcdFx0XHQuZGF0YShbMF0pXG5cdFx0XHRcdFx0LmVudGVyKClcblx0XHRcdFx0XHQuYXBwZW5kKCd0ZXh0Jylcblx0XHRcdFx0XHQudGV4dChmdW5jdGlvbihkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gJ07CsCcgKyBkO1xuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0XHQuc3R5bGUoXCJmaWxsXCIsIG9wdGlvbnMuY29sb3IpXG5cdFx0XHRcdFx0LnN0eWxlKCdmb250LXdlaWdodCcsICdib2xkJylcblx0XHRcdFx0XHQuYXR0cigndGV4dC1hbmNob3InLCAnbWlkZGxlJylcblx0XHRcdFx0XHQuYXR0cigneScsICcwLjM1ZW0nKTtcblxuXHRcdFx0XHQvL1RyYW5zaXRpb24gaWYgc2VsZWN0aW9uIGhhcyBjaGFuZ2VkXG5cdFx0XHRcdGZ1bmN0aW9uIGFuaW1hdGVJdChyYWRpdXMpIHtcblx0XHRcdFx0XHRjaXJjbGVHcmFwaC50cmFuc2l0aW9uKClcblx0XHRcdFx0XHRcdC5kdXJhdGlvbig3NTApXG5cdFx0XHRcdFx0XHQuY2FsbChhcmNUd2Vlbiwgcm90YXRlKHJhZGl1cykgKiAyICogTWF0aC5QSSk7XG5cdFx0XHRcdFx0dGV4dC50cmFuc2l0aW9uKCkuZHVyYXRpb24oNzUwKS50d2VlbigndGV4dCcsIGZ1bmN0aW9uKGQpIHtcblx0XHRcdFx0XHRcdHZhciBkYXRhID0gdGhpcy50ZXh0Q29udGVudC5zcGxpdCgnTsKwJyk7XG5cblx0XHRcdFx0XHRcdHZhciBpID0gZDMuaW50ZXJwb2xhdGUoZGF0YVsxXSwgcmFkaXVzKTtcblx0XHRcdFx0XHRcdHJldHVybiBmdW5jdGlvbih0KSB7XG5cdFx0XHRcdFx0XHRcdHRoaXMudGV4dENvbnRlbnQgPSAgJ07CsCcgKyAoTWF0aC5yb3VuZChpKHQpICogMSkgLyAxKTtcblx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vVHdlZW4gYW5pbWF0aW9uIGZvciB0aGUgQXJjXG5cdFx0XHRcdGZ1bmN0aW9uIGFyY1R3ZWVuKHRyYW5zaXRpb24sIG5ld0FuZ2xlKSB7XG5cdFx0XHRcdFx0dHJhbnNpdGlvbi5hdHRyVHdlZW4oXCJkXCIsIGZ1bmN0aW9uKGQpIHtcblx0XHRcdFx0XHRcdHZhciBpbnRlcnBvbGF0ZSA9IGQzLmludGVycG9sYXRlKGQuZW5kQW5nbGUsIG5ld0FuZ2xlKTtcblx0XHRcdFx0XHRcdHJldHVybiBmdW5jdGlvbih0KSB7XG5cdFx0XHRcdFx0XHRcdGQuZW5kQW5nbGUgPSBpbnRlcnBvbGF0ZSh0KTtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGFyYyhkKTtcblx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvL1dhdGNoaW5nIGlmIHNlbGVjdGlvbiBoYXMgY2hhbmdlZCBmcm9tIGFub3RoZXIgVUkgZWxlbWVudFxuXHRcdFx0XHQkc2NvcGUuJHdhdGNoKFxuXHRcdFx0XHRcdGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIG5nTW9kZWwuJG1vZGVsVmFsdWU7XG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRmdW5jdGlvbihuZXdWYWx1ZSwgb2xkVmFsdWUpIHtcblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKG5ld1ZhbHVlKVxuXHRcdFx0XHRcdFx0aWYgKCFuZXdWYWx1ZSl7XG5cdFx0XHRcdFx0XHRcdG5ld1ZhbHVlID0ge307XG5cdFx0XHRcdFx0XHRcdG5ld1ZhbHVlW29wdGlvbnMuZmllbGRdID0gb3B0aW9ucy5zaXplO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHQkdGltZW91dChmdW5jdGlvbigpe1xuXHRcdFx0XHRcdFx0XHRhbmltYXRlSXQobmV3VmFsdWVbb3B0aW9ucy5maWVsZF0pXG5cdFx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH07XG5cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoICdhcHAuY29udHJvbGxlcnMnICkuY29udHJvbGxlciggJ0RhdGFMaXN0aW5nQ3RybCcsIGZ1bmN0aW9uKCl7XG5cdFx0Ly9cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmRpcmVjdGl2ZXMnKS5kaXJlY3RpdmUoICdkYXRhTGlzdGluZycsIGZ1bmN0aW9uKCkge1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlc3RyaWN0OiAnRUEnLFxuXHRcdFx0dGVtcGxhdGVVcmw6ICd2aWV3cy9kaXJlY3RpdmVzL2RhdGFfbGlzdGluZy9kYXRhX2xpc3RpbmcuaHRtbCcsXG5cdFx0XHRjb250cm9sbGVyOiAnRGF0YUxpc3RpbmdDdHJsJyxcblx0XHRcdGxpbms6IGZ1bmN0aW9uKCAkc2NvcGUsIGVsZW1lbnQsICRhdHRycyApe1xuXHRcdFx0XHQvL1xuXHRcdFx0fVxuXHRcdH07XG5cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5kaXJlY3RpdmVzJykuZGlyZWN0aXZlKCAnaGlzdG9yeScsIGZ1bmN0aW9uKCkge1xuXHRcdHZhciBkZWZhdWx0cyA9IGZ1bmN0aW9uKCl7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRmaWVsZDogJ3Njb3JlJ1xuXHRcdFx0fVxuXHRcdH07XG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlc3RyaWN0OiAnRScsXG5cdFx0XHR0ZW1wbGF0ZVVybDogJ3ZpZXdzL2RpcmVjdGl2ZXMvaGlzdG9yeS9oaXN0b3J5Lmh0bWwnLFxuXHRcdFx0Y29udHJvbGxlcjogJ0hpc3RvcnlDdHJsJyxcblx0XHRcdHNjb3BlOntcblx0XHRcdFx0ZmllbGQ6Jz0nLFxuXHRcdFx0XHRjaGFydGRhdGE6ICc9Jyxcblx0XHRcdFx0Y29sb3I6Jz0nXG5cdFx0XHR9LFxuXHRcdFx0bGluazogZnVuY3Rpb24oICRzY29wZSwgZWxlbWVudCwgJGF0dHJzLCBuZ01vZGVsKXtcblx0XHRcdFx0Ly9cblx0XHRcdH1cblx0XHR9O1xuXG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCAnYXBwLmNvbnRyb2xsZXJzJyApLmNvbnRyb2xsZXIoICdIaXN0b3J5Q3RybCcsIGZ1bmN0aW9uKCRzY29wZSl7XG5cdFx0Ly9cblx0XHQkc2NvcGUudG9nZ2xlQnV0dG9uID0gJ2Fycm93X2Ryb3BfZG93bic7XG5cdFx0JHNjb3BlLmRpc3BsYXkgPSB7XG5cdFx0XHRzZWxlY3RlZENhdDogJycsXG5cdFx0XHRyYW5rOiBbe1xuXHRcdFx0XHRmaWVsZHM6IHtcblx0XHRcdFx0XHR4OiAneWVhcicsXG5cdFx0XHRcdFx0eTogJ3JhbmsnXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHRpdGxlOiAnUmFuaycsXG5cdFx0XHRcdGNvbG9yOiAnIzUyYjY5NSdcblx0XHRcdH1dLFxuXHRcdFx0c2NvcmU6IFt7XG5cdFx0XHRcdGZpZWxkczoge1xuXHRcdFx0XHRcdHg6ICd5ZWFyJyxcblx0XHRcdFx0XHR5OiAkc2NvcGUuZmllbGRcblx0XHRcdFx0fSxcblx0XHRcdFx0dGl0bGU6ICdTY29yZScsXG5cdFx0XHRcdGNvbG9yOiAkc2NvcGUuY29sb3Jcblx0XHRcdH1dXG5cdFx0fTtcblx0XHQkc2NvcGUudGFiQ29udGVudCA9IFwiXCI7XG5cdFx0JHNjb3BlLnNob3dUYWJDb250ZW50ID0gZnVuY3Rpb24gKGNvbnRlbnQpIHtcblx0XHRcdGlmIChjb250ZW50ID09ICcnICYmICRzY29wZS50YWJDb250ZW50ID09ICcnKSB7XG5cdFx0XHRcdCRzY29wZS50YWJDb250ZW50ID0gJ3JhbmsnO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JHNjb3BlLnRhYkNvbnRlbnQgPSBjb250ZW50O1xuXHRcdFx0fVxuXHRcdFx0JHNjb3BlLnRvZ2dsZUJ1dHRvbiA9ICRzY29wZS50YWJDb250ZW50ID8gJ2Fycm93X2Ryb3BfdXAnIDogJ2Fycm93X2Ryb3BfZG93bic7XG5cdFx0fTtcbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZGlyZWN0aXZlcycpLmRpcmVjdGl2ZSgnbWVkaWFuJywgZnVuY3Rpb24gKCR0aW1lb3V0KSB7XG5cdFx0dmFyIGRlZmF1bHRzID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0aWQ6ICdncmFkaWVudCcsXG5cdFx0XHRcdHdpZHRoOiAzMDAsXG5cdFx0XHRcdGhlaWdodDogNDAsXG5cdFx0XHRcdGluZm86IHRydWUsIFxuXHRcdFx0XHRmaWVsZDogJ3Njb3JlJyxcblx0XHRcdFx0aGFuZGxpbmc6IHRydWUsXG5cdFx0XHRcdG1hcmdpbjoge1xuXHRcdFx0XHRcdGxlZnQ6IDIwLFxuXHRcdFx0XHRcdHJpZ2h0OiAyMCxcblx0XHRcdFx0XHR0b3A6IDEwLFxuXHRcdFx0XHRcdGJvdHRvbTogMTBcblx0XHRcdFx0fSxcblx0XHRcdFx0Y29sb3JzOiBbe1xuXHRcdFx0XHRcdHBvc2l0aW9uOiAwLFxuXHRcdFx0XHRcdGNvbG9yOiAncmdiYSgyNTUsMjU1LDI1NSwxKScsXG5cdFx0XHRcdFx0b3BhY2l0eTogMFxuXHRcdFx0XHR9LCB7XG5cdFx0XHRcdFx0cG9zaXRpb246IDUzLFxuXHRcdFx0XHRcdGNvbG9yOiAncmdiYSgxMjgsIDI0MywgMTk4LDEpJyxcblx0XHRcdFx0XHRvcGFjaXR5OiAxXG5cdFx0XHRcdH0sIHtcblx0XHRcdFx0XHRwb3NpdGlvbjogMTAwLFxuXHRcdFx0XHRcdGNvbG9yOiAncmdiYSgxMDIsMTAyLDEwMiwxKScsXG5cdFx0XHRcdFx0b3BhY2l0eTogMVxuXHRcdFx0XHR9XVxuXHRcdFx0fTtcblx0XHR9XG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlc3RyaWN0OiAnRScsXG5cdFx0XHRzY29wZToge1xuXHRcdFx0XHRkYXRhOiAnPSdcblx0XHRcdH0sXG5cdFx0XHRyZXF1aXJlOiAnbmdNb2RlbCcsXG5cdFx0XHRsaW5rOiBmdW5jdGlvbiAoJHNjb3BlLCBlbGVtZW50LCAkYXR0cnMsIG5nTW9kZWwpIHtcblxuXHRcdFx0XHR2YXIgb3B0aW9ucyA9IGFuZ3VsYXIuZXh0ZW5kKGRlZmF1bHRzKCksICRhdHRycyk7XG5cdFx0XHRcdC8vY29uc29sZS5sb2cob3B0aW9ucy5jb2xvcik7XG5cdFx0XHRcdGlmKG9wdGlvbnMuY29sb3Ipe1xuXHRcdFx0XHRcdG9wdGlvbnMuY29sb3JzWzFdLmNvbG9yID0gb3B0aW9ucy5jb2xvcjtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbGVtZW50LmNzcygnaGVpZ2h0Jywgb3B0aW9ucy5oZWlnaHQgKyAncHgnKS5jc3MoJ2JvcmRlci1yYWRpdXMnLCBvcHRpb25zLmhlaWdodCAvIDIgKyAncHgnKTtcblx0XHRcdFx0dmFyIHggPSBkMy5zY2FsZS5saW5lYXIoKVxuXHRcdFx0XHRcdC5kb21haW4oWzAsIDEwMF0pXG5cdFx0XHRcdFx0LnJhbmdlKFsyMCwgb3B0aW9ucy53aWR0aCAtIG9wdGlvbnMubWFyZ2luLmxlZnRdKVxuXHRcdFx0XHRcdC5jbGFtcCh0cnVlKTtcblxuXHRcdFx0XHR2YXIgYnJ1c2ggPSBkMy5zdmcuYnJ1c2goKVxuXHRcdFx0XHRcdC54KHgpXG5cdFx0XHRcdFx0LmV4dGVudChbMCwgMF0pXG5cdFx0XHRcdFx0Lm9uKFwiYnJ1c2hcIiwgYnJ1c2gpXG5cdFx0XHRcdFx0Lm9uKFwiYnJ1c2hlbmRcIiwgYnJ1c2hlZCk7XG5cblx0XHRcdFx0dmFyIHN2ZyA9IGQzLnNlbGVjdChlbGVtZW50WzBdKS5hcHBlbmQoXCJzdmdcIilcblx0XHRcdFx0XHQuYXR0cihcIndpZHRoXCIsIG9wdGlvbnMud2lkdGgpXG5cdFx0XHRcdFx0LmF0dHIoXCJoZWlnaHRcIiwgb3B0aW9ucy5oZWlnaHQgKyBvcHRpb25zLm1hcmdpbi50b3AgKyBvcHRpb25zLm1hcmdpbi5ib3R0b20pXG5cdFx0XHRcdFx0LmFwcGVuZChcImdcIik7XG5cdFx0XHRcdC8vLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoMCxcIiArIG9wdGlvbnMubWFyZ2luLnRvcCAvIDIgKyBcIilcIik7XG5cdFx0XHRcdHZhciBncmFkaWVudCA9IHN2Zy5hcHBlbmQoJ3N2ZzpkZWZzJylcblx0XHRcdFx0XHQuYXBwZW5kKFwic3ZnOmxpbmVhckdyYWRpZW50XCIpXG5cdFx0XHRcdFx0LmF0dHIoJ2lkJywgb3B0aW9ucy5maWVsZClcblx0XHRcdFx0XHQuYXR0cigneDEnLCAnMCUnKVxuXHRcdFx0XHRcdC5hdHRyKCd5MScsICcwJScpXG5cdFx0XHRcdFx0LmF0dHIoJ3gyJywgJzEwMCUnKVxuXHRcdFx0XHRcdC5hdHRyKCd5MicsICcwJScpXG5cdFx0XHRcdFx0LmF0dHIoJ3NwcmVhZE1ldGhvZCcsICdwYWQnKVxuXHRcdFx0XHRhbmd1bGFyLmZvckVhY2gob3B0aW9ucy5jb2xvcnMsIGZ1bmN0aW9uIChjb2xvcikge1xuXHRcdFx0XHRcdGdyYWRpZW50LmFwcGVuZCgnc3ZnOnN0b3AnKVxuXHRcdFx0XHRcdFx0LmF0dHIoJ29mZnNldCcsIGNvbG9yLnBvc2l0aW9uICsgJyUnKVxuXHRcdFx0XHRcdFx0LmF0dHIoJ3N0b3AtY29sb3InLCBjb2xvci5jb2xvcilcblx0XHRcdFx0XHRcdC5hdHRyKCdzdG9wLW9wYWNpdHknLCBjb2xvci5vcGFjaXR5KTtcblx0XHRcdFx0fSk7XG5cdFx0XHRcdHN2Zy5hcHBlbmQoJ3N2ZzpyZWN0Jylcblx0XHRcdFx0XHQuYXR0cignd2lkdGgnLCBvcHRpb25zLndpZHRoKVxuXHRcdFx0XHRcdC5hdHRyKCdoZWlnaHQnLCBvcHRpb25zLmhlaWdodClcblx0XHRcdFx0XHQuc3R5bGUoJ2ZpbGwnLCAndXJsKCMnICsgb3B0aW9ucy5maWVsZCArICcpJyk7XG5cdFx0XHRcdHZhciBsZWdlbmQgPSBzdmcuYXBwZW5kKCdnJykuYXR0cigndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgnICsgb3B0aW9ucy5oZWlnaHQgLyAyICsgJywgJyArIG9wdGlvbnMuaGVpZ2h0IC8gMiArICcpJylcblx0XHRcdFx0XHQuYXR0cignY2xhc3MnLCAnc3RhcnRMYWJlbCcpXG5cblx0XHRcdFx0aWYgKG9wdGlvbnMuaW5mbyA9PT0gdHJ1ZSkge1xuXHRcdFx0XHRcdGxlZ2VuZC5hcHBlbmQoJ2NpcmNsZScpXG5cdFx0XHRcdFx0XHQuYXR0cigncicsIG9wdGlvbnMuaGVpZ2h0IC8gMik7XG5cdFx0XHRcdFx0bGVnZW5kLmFwcGVuZCgndGV4dCcpXG5cdFx0XHRcdFx0XHQudGV4dCgwKVxuXHRcdFx0XHRcdFx0LnN0eWxlKCdmb250LXNpemUnLCBvcHRpb25zLmhlaWdodC8yLjUpXG5cdFx0XHRcdFx0XHQuYXR0cigndGV4dC1hbmNob3InLCAnbWlkZGxlJylcblx0XHRcdFx0XHRcdC5hdHRyKCd5JywgJy4zNWVtJylcblx0XHRcdFx0fVxuXG5cblxuXHRcdFx0XHRpZiAob3B0aW9ucy5pbmZvID09PSB0cnVlKSB7XG5cdFx0XHRcdFx0dmFyIGxlZ2VuZDIgPSBzdmcuYXBwZW5kKCdnJykuYXR0cigndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgnICsgKG9wdGlvbnMud2lkdGggLSAob3B0aW9ucy5oZWlnaHQgLyAyKSkgKyAnLCAnICsgb3B0aW9ucy5oZWlnaHQgLyAyICsgJyknKVxuXHRcdFx0XHRcdFx0LmF0dHIoJ2NsYXNzJywgJ2VuZExhYmVsJylcblx0XHRcdFx0XHRsZWdlbmQyLmFwcGVuZCgnY2lyY2xlJylcblx0XHRcdFx0XHRcdC5hdHRyKCdyJywgb3B0aW9ucy5oZWlnaHQgLyAyKVxuXHRcdFx0XHRcdGxlZ2VuZDIuYXBwZW5kKCd0ZXh0Jylcblx0XHRcdFx0XHRcdC50ZXh0KDEwMClcblx0XHRcdFx0XHRcdC5zdHlsZSgnZm9udC1zaXplJywgb3B0aW9ucy5oZWlnaHQvMi41KVxuXHRcdFx0XHRcdFx0LmF0dHIoJ3RleHQtYW5jaG9yJywgJ21pZGRsZScpXG5cdFx0XHRcdFx0XHQuYXR0cigneScsICcuMzVlbScpXG5cdFx0XHRcdH1cblx0XHRcdFx0dmFyIHNsaWRlciA9IHN2Zy5hcHBlbmQoXCJnXCIpXG5cdFx0XHRcdFx0LmF0dHIoXCJjbGFzc1wiLCBcInNsaWRlclwiKTtcblx0XHRcdFx0aWYob3B0aW9ucy5oYW5kbGluZyA9PSB0cnVlKXtcblx0XHRcdFx0XHRzbGlkZXIuY2FsbChicnVzaCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRzbGlkZXIuc2VsZWN0KFwiLmJhY2tncm91bmRcIilcblx0XHRcdFx0XHQuYXR0cihcImhlaWdodFwiLCBvcHRpb25zLmhlaWdodCk7XG5cblx0XHRcdFx0aWYgKG9wdGlvbnMuaW5mbyA9PT0gdHJ1ZSkge1xuXHRcdFx0XHRzbGlkZXIuYXBwZW5kKCdsaW5lJylcblx0XHRcdFx0XHQuYXR0cigneDEnLCBvcHRpb25zLndpZHRoIC8gMilcblx0XHRcdFx0XHQuYXR0cigneTEnLCAwKVxuXHRcdFx0XHRcdC5hdHRyKCd4MicsIG9wdGlvbnMud2lkdGggLyAyKVxuXHRcdFx0XHRcdC5hdHRyKCd5MicsIG9wdGlvbnMuaGVpZ2h0KVxuXHRcdFx0XHRcdC5hdHRyKCdzdHJva2UtZGFzaGFycmF5JywgJzMsMycpXG5cdFx0XHRcdFx0LmF0dHIoJ3N0cm9rZS13aWR0aCcsIDEpXG5cdFx0XHRcdFx0LmF0dHIoJ3N0cm9rZScsICdyZ2JhKDAsMCwwLDg3KScpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHZhciBoYW5kbGVDb250ID0gc2xpZGVyLmFwcGVuZCgnZycpXG5cdFx0XHRcdFx0LmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoMCxcIiArIG9wdGlvbnMuaGVpZ2h0IC8gMiArIFwiKVwiKTtcblx0XHRcdFx0dmFyIGhhbmRsZSA9IGhhbmRsZUNvbnQuYXBwZW5kKFwiY2lyY2xlXCIpXG5cdFx0XHRcdFx0LmF0dHIoXCJjbGFzc1wiLCBcImhhbmRsZVwiKVxuXHRcdFx0XHRcdC5hdHRyKFwiclwiLCBvcHRpb25zLmhlaWdodCAvIDIpO1xuXHRcdFx0XHRcdGlmKG9wdGlvbnMuY29sb3Ipe1xuXHRcdFx0XHRcdFx0aGFuZGxlLnN0eWxlKCdmaWxsJywgb3B0aW9ucy5jb2xvcik7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR2YXIgaGFuZGxlTGFiZWwgPSBoYW5kbGVDb250LmFwcGVuZCgndGV4dCcpXG5cdFx0XHRcdFx0LnRleHQoMClcblx0XHRcdFx0XHQuc3R5bGUoJ2ZvbnQtc2l6ZScsIG9wdGlvbnMuaGVpZ2h0LzIuNSlcblx0XHRcdFx0XHQuYXR0cihcInRleHQtYW5jaG9yXCIsIFwibWlkZGxlXCIpLmF0dHIoJ3knLCAnMC4zNWVtJyk7XG5cblx0XHRcdFx0Ly9zbGlkZXJcblx0XHRcdFx0Ly8uY2FsbChicnVzaC5leHRlbnQoWzAsIDBdKSlcblx0XHRcdFx0Ly8uY2FsbChicnVzaC5ldmVudCk7XG5cblx0XHRcdFx0ZnVuY3Rpb24gYnJ1c2goKSB7XG5cdFx0XHRcdFx0dmFyIHZhbHVlID0gYnJ1c2guZXh0ZW50KClbMF07XG5cblx0XHRcdFx0XHRpZiAoZDMuZXZlbnQuc291cmNlRXZlbnQpIHsgLy8gbm90IGEgcHJvZ3JhbW1hdGljIGV2ZW50XG5cdFx0XHRcdFx0XHR2YWx1ZSA9IHguaW52ZXJ0KGQzLm1vdXNlKHRoaXMpWzBdKTtcblx0XHRcdFx0XHRcdGJydXNoLmV4dGVudChbdmFsdWUsIHZhbHVlXSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGhhbmRsZUxhYmVsLnRleHQocGFyc2VJbnQodmFsdWUpKTtcblx0XHRcdFx0XHRoYW5kbGVDb250LmF0dHIoXCJ0cmFuc2Zvcm1cIiwgJ3RyYW5zbGF0ZSgnICsgeCh2YWx1ZSkgKyAnLCcgKyBvcHRpb25zLmhlaWdodCAvIDIgKyAnKScpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0ZnVuY3Rpb24gYnJ1c2hlZCgpIHtcblx0XHRcdFx0XHR2YXIgdmFsdWUgPSBicnVzaC5leHRlbnQoKVswXSxcblx0XHRcdFx0XHRcdGNvdW50ID0gMCxcblx0XHRcdFx0XHRcdGZvdW5kID0gZmFsc2U7XG5cdFx0XHRcdFx0dmFyIGZpbmFsID0gXCJcIjtcblx0XHRcdFx0XHRkbyB7XG5cblx0XHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaCgkc2NvcGUuZGF0YSwgZnVuY3Rpb24gKG5hdCwga2V5KSB7XG5cdFx0XHRcdFx0XHRcdGlmIChwYXJzZUludChuYXRbb3B0aW9ucy5maWVsZF0pID09IHBhcnNlSW50KHZhbHVlKSkge1xuXHRcdFx0XHRcdFx0XHRcdGZpbmFsID0gbmF0O1xuXHRcdFx0XHRcdFx0XHRcdGZvdW5kID0gdHJ1ZTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRjb3VudCsrO1xuXHRcdFx0XHRcdFx0dmFsdWUgPSB2YWx1ZSA+IDUwID8gdmFsdWUgLSAxIDogdmFsdWUgKyAxO1xuXHRcdFx0XHRcdH0gd2hpbGUgKCFmb3VuZCAmJiBjb3VudCA8IDEwMCk7XG5cdFx0XHRcdFx0bmdNb2RlbC4kc2V0Vmlld1ZhbHVlKGZpbmFsKTtcblx0XHRcdFx0XHRuZ01vZGVsLiRyZW5kZXIoKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdCRzY29wZS4kd2F0Y2goXG5cdFx0XHRcdFx0ZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIG5nTW9kZWwuJG1vZGVsVmFsdWU7XG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRmdW5jdGlvbiAobmV3VmFsdWUsIG9sZFZhbHVlKSB7XG5cdFx0XHRcdFx0XHQvL2NvbnNvbGUubG9nKG5ld1ZhbHVlKTtcblx0XHRcdFx0XHRcdGlmICghbmV3VmFsdWUpIHtcblx0XHRcdFx0XHRcdFx0aGFuZGxlTGFiZWwudGV4dChwYXJzZUludCgwKSk7XG5cdFx0XHRcdFx0XHRcdGhhbmRsZUNvbnQuYXR0cihcInRyYW5zZm9ybVwiLCAndHJhbnNsYXRlKCcgKyB4KDApICsgJywnICsgb3B0aW9ucy5oZWlnaHQgLyAyICsgJyknKTtcblx0XHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0aGFuZGxlTGFiZWwudGV4dChwYXJzZUludChuZXdWYWx1ZVtvcHRpb25zLmZpZWxkXSkpO1xuXHRcdFx0XHRcdFx0aWYgKG5ld1ZhbHVlID09IG9sZFZhbHVlKSB7XG5cdFx0XHRcdFx0XHRcdGhhbmRsZUNvbnQuYXR0cihcInRyYW5zZm9ybVwiLCAndHJhbnNsYXRlKCcgKyB4KG5ld1ZhbHVlW29wdGlvbnMuZmllbGRdKSArICcsJyArIG9wdGlvbnMuaGVpZ2h0IC8gMiArICcpJyk7XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRoYW5kbGVDb250LnRyYW5zaXRpb24oKS5kdXJhdGlvbig1MDApLmVhc2UoJ3F1YWQnKS5hdHRyKFwidHJhbnNmb3JtXCIsICd0cmFuc2xhdGUoJyArIHgobmV3VmFsdWVbb3B0aW9ucy5maWVsZF0pICsgJywnICsgb3B0aW9ucy5oZWlnaHQgLyAyICsgJyknKTtcblxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH07XG5cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoICdhcHAuY29udHJvbGxlcnMnICkuY29udHJvbGxlciggJ01lZGlhbkN0cmwnLCBmdW5jdGlvbigpe1xuXHRcdC8vXG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5kaXJlY3RpdmVzJykuZGlyZWN0aXZlKCAnc2ltcGxlbGluZWNoYXJ0JywgZnVuY3Rpb24oKSB7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0cmVzdHJpY3Q6ICdFJyxcblx0XHRcdHNjb3BlOntcblx0XHRcdFx0ZGF0YTonPScsXG5cdFx0XHRcdHNlbGVjdGlvbjonPSdcblx0XHRcdH0sXG5cdFx0XHR0ZW1wbGF0ZVVybDogJ3ZpZXdzL2RpcmVjdGl2ZXMvc2ltcGxlbGluZWNoYXJ0L3NpbXBsZWxpbmVjaGFydC5odG1sJyxcblx0XHRcdGNvbnRyb2xsZXI6ICdTaW1wbGVsaW5lY2hhcnRDdHJsJyxcblx0XHRcdGxpbms6IGZ1bmN0aW9uKCAkc2NvcGUsIGVsZW1lbnQsICRhdHRycyApe1xuXHRcdFx0XHQkc2NvcGUub3B0aW9ucyA9ICRhdHRycztcblx0XHRcdFx0JHNjb3BlLmNhbGN1bGF0ZUdyYXBoKCk7XG5cdFx0XHRcdCRzY29wZS5zZXRDaGFydCgpO1xuXG5cdFx0XHR9XG5cdFx0fTtcblxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdTaW1wbGVsaW5lY2hhcnRDdHJsJywgZnVuY3Rpb24gKCRzY29wZSkge1xuXHRcdCRzY29wZS5jb25maWcgPSB7XG5cdFx0XHR2aXNpYmxlOiB0cnVlLCAvLyBkZWZhdWx0OiB0cnVlXG5cdFx0XHRleHRlbmRlZDogZmFsc2UsIC8vIGRlZmF1bHQ6IGZhbHNlXG5cdFx0XHRkaXNhYmxlZDogZmFsc2UsIC8vIGRlZmF1bHQ6IGZhbHNlXG5cdFx0XHRhdXRvcmVmcmVzaDogdHJ1ZSwgLy8gZGVmYXVsdDogdHJ1ZVxuXHRcdFx0cmVmcmVzaERhdGFPbmx5OiBmYWxzZSwgLy8gZGVmYXVsdDogZmFsc2Vcblx0XHRcdGRlZXBXYXRjaE9wdGlvbnM6IHRydWUsIC8vIGRlZmF1bHQ6IHRydWVcblx0XHRcdGRlZXBXYXRjaERhdGE6IGZhbHNlLCAvLyBkZWZhdWx0OiBmYWxzZVxuXHRcdFx0ZGVlcFdhdGNoQ29uZmlnOiB0cnVlLCAvLyBkZWZhdWx0OiB0cnVlXG5cdFx0XHRkZWJvdW5jZTogMTAgLy8gZGVmYXVsdDogMTBcblx0fSxcblxuXHQkc2NvcGUuY2hhcnQgPSB7XG5cdFx0b3B0aW9uczp7XG5cdFx0XHRjaGFydDp7fVxuXHRcdH0sXG5cdFx0ZGF0YTpbXVxuXHR9O1xuXHRcdCRzY29wZS5zZXRDaGFydCA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdCRzY29wZS5jaGFydC5vcHRpb25zLmNoYXJ0ID0gIHtcblx0XHRcdFx0XHRcdHR5cGU6ICdsaW5lQ2hhcnQnLFxuXHRcdFx0XHRcdFx0bGVnZW5kUG9zaXRpb246ICdsZWZ0Jyxcblx0XHRcdFx0XHRcdG1hcmdpbjoge1xuXHRcdFx0XHRcdFx0XHR0b3A6IDIwLFxuXHRcdFx0XHRcdFx0XHRyaWdodDogMjAsXG5cdFx0XHRcdFx0XHRcdGJvdHRvbTogMjAsXG5cdFx0XHRcdFx0XHRcdGxlZnQ6IDIwXG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0eDogZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGQueDtcblx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHR5OiBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gZC55O1xuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdHNob3dMZWdlbmQ6ZmFsc2UsXG5cdFx0XHRcdFx0XHRzaG93VmFsdWVzOiBmYWxzZSxcblx0XHRcdFx0XHRcdHNob3dZQXhpczogZmFsc2UsXG5cdFx0XHRcdFx0XHR0cmFuc2l0aW9uRHVyYXRpb246IDUwMCxcblx0XHRcdFx0XHRcdHVzZUludGVyYWN0aXZlR3VpZGVsaW5lOiB0cnVlLFxuXHRcdFx0XHRcdFx0Ly9mb3JjZVk6IFsxMDAsIDBdLFxuXHRcdFx0XHRcdFx0Ly95RG9tYWluOnlEb21haW4sXG5cdFx0XHRcdFx0XHR4QXhpczoge1xuXHRcdFx0XHRcdFx0XHRheGlzTGFiZWw6ICcnXG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0eUF4aXM6IHtcblx0XHRcdFx0XHRcdFx0YXhpc0xhYmVsOiAnJyxcblx0XHRcdFx0XHRcdFx0YXhpc0xhYmVsRGlzdGFuY2U6IDMwXG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0bGVnZW5kOiB7XG5cdFx0XHRcdFx0XHRcdHJpZ2h0QWxpZ246IGZhbHNlXG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0bGluZXM6IHtcblx0XHRcdFx0XHRcdFx0aW50ZXJwb2xhdGU6ICdjYXJkaW5hbCdcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0fTtcblx0XHRcdGlmKCRzY29wZS5vcHRpb25zLmludmVydCA9PSBcInRydWVcIil7XG5cdFx0XHRcdCRzY29wZS5jaGFydC5vcHRpb25zLmNoYXJ0LnlEb21haW4gPSBbcGFyc2VJbnQoJHNjb3BlLnJhbmdlLm1heCksJHNjb3BlLnJhbmdlLm1pbl07XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gJHNjb3BlLmNoYXJ0O1xuXHRcdH1cblx0XHQkc2NvcGUuY2FsY3VsYXRlR3JhcGggPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHR2YXIgY2hhcnREYXRhID0gW107XG5cdFx0XHQkc2NvcGUucmFuZ2UgPSB7XG5cdFx0XHRcdG1heDowLFxuXHRcdFx0XHRtaW46MTAwMFxuXHRcdFx0fTtcblx0XHRcdGFuZ3VsYXIuZm9yRWFjaCgkc2NvcGUuc2VsZWN0aW9uLCBmdW5jdGlvbiAoaXRlbSwga2V5KSB7XG5cdFx0XHRcdHZhciBncmFwaCA9IHtcblx0XHRcdFx0XHRpZDoga2V5LFxuXHRcdFx0XHRcdGtleTogaXRlbS50aXRsZSxcblx0XHRcdFx0XHRjb2xvcjogaXRlbS5jb2xvcixcblx0XHRcdFx0XHR2YWx1ZXM6IFtdXG5cdFx0XHRcdH07XG5cdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaCgkc2NvcGUuZGF0YSwgZnVuY3Rpb24gKGRhdGEsIGspIHtcblx0XHRcdFx0XHRncmFwaC52YWx1ZXMucHVzaCh7XG5cdFx0XHRcdFx0XHRpZDogayxcblx0XHRcdFx0XHRcdHg6IGRhdGFbaXRlbS5maWVsZHMueF0sXG5cdFx0XHRcdFx0XHR5OiBkYXRhW2l0ZW0uZmllbGRzLnldXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0JHNjb3BlLnJhbmdlLm1heCA9IE1hdGgubWF4KCRzY29wZS5yYW5nZS5tYXgsIGRhdGFbaXRlbS5maWVsZHMueV0pO1xuXHRcdFx0XHRcdCRzY29wZS5yYW5nZS5taW4gPSBNYXRoLm1pbigkc2NvcGUucmFuZ2UubWluLCBkYXRhW2l0ZW0uZmllbGRzLnldKTtcblx0XHRcdFx0fSk7XG5cdFx0XHRcdGNoYXJ0RGF0YS5wdXNoKGdyYXBoKTtcblx0XHRcdH0pO1xuXG5cdFx0XHQkc2NvcGUuY2hhcnQuZGF0YSA9IGNoYXJ0RGF0YTtcblx0XHRcdGlmKCRzY29wZS5vcHRpb25zLmludmVydCA9PSBcInRydWVcIil7XG5cdFx0XHRcdCRzY29wZS5jaGFydC5vcHRpb25zLmNoYXJ0LnlEb21haW4gPSBbcGFyc2VJbnQoJHNjb3BlLnJhbmdlLm1heCksJHNjb3BlLnJhbmdlLm1pbl07XG5cdFx0XHR9XG5cdFx0fTtcblx0XHQkc2NvcGUuJHdhdGNoKCdkYXRhJywgZnVuY3Rpb24gKG4sIG8pIHtcblx0XHRcdGlmICghbikge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0XHQkc2NvcGUuY2FsY3VsYXRlR3JhcGgoKTtcblx0XHR9KVxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmRpcmVjdGl2ZXMnKS5hbmltYXRpb24oJy5zbGlkZS10b2dnbGUnLCBbJyRhbmltYXRlQ3NzJywgZnVuY3Rpb24oJGFuaW1hdGVDc3MpIHtcblxuXHRcdHZhciBsYXN0SWQgPSAwO1xuICAgICAgICB2YXIgX2NhY2hlID0ge307XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0SWQoZWwpIHtcbiAgICAgICAgICAgIHZhciBpZCA9IGVsWzBdLmdldEF0dHJpYnV0ZShcImRhdGEtc2xpZGUtdG9nZ2xlXCIpO1xuICAgICAgICAgICAgaWYgKCFpZCkge1xuICAgICAgICAgICAgICAgIGlkID0gKytsYXN0SWQ7XG4gICAgICAgICAgICAgICAgZWxbMF0uc2V0QXR0cmlidXRlKFwiZGF0YS1zbGlkZS10b2dnbGVcIiwgaWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGlkO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGdldFN0YXRlKGlkKSB7XG4gICAgICAgICAgICB2YXIgc3RhdGUgPSBfY2FjaGVbaWRdO1xuICAgICAgICAgICAgaWYgKCFzdGF0ZSkge1xuICAgICAgICAgICAgICAgIHN0YXRlID0ge307XG4gICAgICAgICAgICAgICAgX2NhY2hlW2lkXSA9IHN0YXRlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZ2VuZXJhdGVSdW5uZXIoY2xvc2luZywgc3RhdGUsIGFuaW1hdG9yLCBlbGVtZW50LCBkb25lRm4pIHtcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBzdGF0ZS5hbmltYXRpbmcgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHN0YXRlLmFuaW1hdG9yID0gYW5pbWF0b3I7XG4gICAgICAgICAgICAgICAgc3RhdGUuZG9uZUZuID0gZG9uZUZuO1xuICAgICAgICAgICAgICAgIGFuaW1hdG9yLnN0YXJ0KCkuZmluYWxseShmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNsb3NpbmcgJiYgc3RhdGUuZG9uZUZuID09PSBkb25lRm4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnRbMF0uc3R5bGUuaGVpZ2h0ID0gJyc7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgc3RhdGUuYW5pbWF0aW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIHN0YXRlLmFuaW1hdG9yID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgICAgICBzdGF0ZS5kb25lRm4oKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBsZWF2ZTogZnVuY3Rpb24oZWxlbWVudCwgZG9uZUZuKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIHN0YXRlID0gZ2V0U3RhdGUoZ2V0SWQoZWxlbWVudCkpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgaGVpZ2h0ID0gKHN0YXRlLmFuaW1hdGluZyAmJiBzdGF0ZS5oZWlnaHQpID9cbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlLmhlaWdodCA6IGVsZW1lbnRbMF0ub2Zmc2V0SGVpZ2h0O1xuICAgICAgICAgICAgICAgICAgICB2YXIgYW5pbWF0b3IgPSAkYW5pbWF0ZUNzcyhlbGVtZW50LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmcm9tOiB7aGVpZ2h0OiBoZWlnaHQgKyAncHgnLCBvcGFjaXR5OiAxfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvOiB7aGVpZ2h0OiAnMHB4Jywgb3BhY2l0eTogMH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChhbmltYXRvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN0YXRlLmFuaW1hdGluZykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlLmRvbmVGbiA9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZW5lcmF0ZVJ1bm5lcih0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbmltYXRvcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkb25lRm4pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBzdGF0ZS5hbmltYXRvci5lbmQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlLmhlaWdodCA9IGhlaWdodDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZ2VuZXJhdGVSdW5uZXIodHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuaW1hdG9yLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkb25lRm4pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGRvbmVGbigpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGVudGVyOiBmdW5jdGlvbihlbGVtZW50LCBkb25lRm4pIHtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgc3RhdGUgPSBnZXRTdGF0ZShnZXRJZChlbGVtZW50KSk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBoZWlnaHQgPSAoc3RhdGUuYW5pbWF0aW5nICYmIHN0YXRlLmhlaWdodCkgP1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGUuaGVpZ2h0IDogZWxlbWVudFswXS5vZmZzZXRIZWlnaHQ7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGFuaW1hdG9yID0gJGFuaW1hdGVDc3MoZWxlbWVudCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgZnJvbToge2hlaWdodDogJzBweCcsIG9wYWNpdHk6IDB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgdG86IHtoZWlnaHQ6IGhlaWdodCArICdweCcsIG9wYWNpdHk6IDF9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBpZiAoYW5pbWF0b3IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzdGF0ZS5hbmltYXRpbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZS5kb25lRm4gPSBnZW5lcmF0ZVJ1bm5lcihmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbmltYXRvcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvbmVGbik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHN0YXRlLmFuaW1hdG9yLmVuZCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGUuaGVpZ2h0ID0gaGVpZ2h0O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBnZW5lcmF0ZVJ1bm5lcihmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuaW1hdG9yLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkb25lRm4pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGRvbmVGbigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1dKTtcbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoICdhcHAuY29udHJvbGxlcnMnICkuY29udHJvbGxlciggJ1NsaWRlVG9nZ2xlQ3RybCcsIGZ1bmN0aW9uKCl7XG5cdFx0Ly9cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZGlyZWN0aXZlcycpLmRpcmVjdGl2ZSgnc3ViaW5kZXgnLCBzdWJpbmRleCk7XG5cblx0c3ViaW5kZXguJGluamVjdCA9IFsnJHRpbWVvdXQnLCAnc21vb3RoU2Nyb2xsJ107XG5cblx0ZnVuY3Rpb24gc3ViaW5kZXgoJHRpbWVvdXQsIHNtb290aFNjcm9sbCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRyZXN0cmljdDogJ0UnLFxuXHRcdFx0cmVwbGFjZTogdHJ1ZSxcblx0XHRcdHNjb3BlOiB7XG5cdFx0XHRcdGNvdW50cnk6ICc9Jyxcblx0XHRcdFx0c2VsZWN0ZWQ6ICc9Jyxcblx0XHRcdFx0ZGF0YTogJz0nXG5cdFx0XHR9LFxuXHRcdFx0Y29udHJvbGxlcjogJ1N1YmluZGV4Q3RybCcsXG5cdFx0XHR0ZW1wbGF0ZVVybDogJ3ZpZXdzL2RpcmVjdGl2ZXMvc3ViaW5kZXgvc3ViaW5kZXguaHRtbCcsXG5cdFx0XHRsaW5rOiBzdWJpbmRleExpbmtGdW5jdGlvblxuXHRcdH07XG5cblx0XHRmdW5jdGlvbiBzdWJpbmRleExpbmtGdW5jdGlvbigkc2NvcGUsIGVsZW1lbnQsICRhdHRycykge1xuXHRcdFx0Y29uc29sZS5sb2coJHNjb3BlLnNlbGVjdGVkKTtcblx0XHRcdCRzY29wZS5nb3RvQm94ID0gZ290b0JveDtcblx0XHRcdFx0XHQkc2NvcGUuZ290b0JveCgpO1xuXHRcdFx0ZnVuY3Rpb24gZ290b0JveCgpe1xuXHRcdFx0XHQkdGltZW91dChmdW5jdGlvbigpe1xuXHRcdFx0XHRcdFx0c21vb3RoU2Nyb2xsKGVsZW1lbnRbMF0sIHtvZmZzZXQ6MTIwLCBkdXJhdGlvbjoyNTB9KTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCAnYXBwLmNvbnRyb2xsZXJzJyApLmNvbnRyb2xsZXIoICdTdWJpbmRleEN0cmwnLCBmdW5jdGlvbigkc2NvcGUsICRmaWx0ZXIsICR0aW1lb3V0LCBzbW9vdGhTY3JvbGwpe1xuXHRcdCRzY29wZS5pbmZvID0gZmFsc2U7XG5cdFx0JHNjb3BlLnNldENoYXJ0ID0gc2V0Q2hhcnQ7XG5cdFx0JHNjb3BlLmNhbGN1bGF0ZUdyYXBoID0gY2FsY3VsYXRlR3JhcGg7XG5cdFx0JHNjb3BlLmNyZWF0ZUluZGV4ZXIgPSBjcmVhdGVJbmRleGVyO1xuXHRcdCRzY29wZS5jYWxjU3ViUmFuayA9IGNhbGNTdWJSYW5rO1xuXHRcdCRzY29wZS50b2dnbGVJbmZvID0gdG9nZ2xlSW5mbztcblxuXHRcdGFjdGl2YXRlKCk7XG5cblx0XHRmdW5jdGlvbiBhY3RpdmF0ZSgpe1xuXHRcdFx0JHNjb3BlLmNhbGNTdWJSYW5rKCk7XG5cdFx0XHQkc2NvcGUuc2V0Q2hhcnQoKTtcblx0XHRcdCRzY29wZS5jYWxjdWxhdGVHcmFwaCgpO1xuXHRcdFx0JHNjb3BlLmNyZWF0ZUluZGV4ZXIoKTtcblx0XHRcdCRzY29wZS4kd2F0Y2goJ3NlbGVjdGVkJywgZnVuY3Rpb24gKG5ld0l0ZW0sIG9sZEl0ZW0pIHtcblx0XHRcdFx0aWYgKG5ld0l0ZW0gPT09IG9sZEl0ZW0pIHtcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdH1cblx0XHRcdFx0JHNjb3BlLmNhbGN1bGF0ZUdyYXBoKCk7XG5cdFx0XHRcdCRzY29wZS5nb3RvQm94KCk7XG5cblx0XHRcdH0pO1xuXHRcdFx0JHNjb3BlLiR3YXRjaCgnY291bnRyeScsIGZ1bmN0aW9uKG4sIG8pe1xuXHRcdFx0XHRpZihuID09PSBvKXtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblx0XHRcdFx0JHNjb3BlLmNhbGNTdWJSYW5rKCk7XG5cdFx0XHR9KVxuXHRcdH1cblx0XHRmdW5jdGlvbiB0b2dnbGVJbmZvKCl7XG5cdFx0XHQkc2NvcGUuaW5mbyA9ICEkc2NvcGUuaW5mbztcblx0XHR9O1xuXHRcdGZ1bmN0aW9uIGNhbGNTdWJSYW5rKCl7XG5cdFx0XHRcdHZhciByYW5rID0gMDtcblx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKCRzY29wZS5kYXRhLCBmdW5jdGlvbihpdGVtKXtcblx0XHRcdFx0XHRpdGVtWyRzY29wZS5zZWxlY3RlZC50eXBlXSA9IHBhcnNlRmxvYXQoaXRlbVskc2NvcGUuc2VsZWN0ZWQudHlwZV0pO1xuXHRcdFx0XHRcdGl0ZW1bJ3Njb3JlJ10gPSBwYXJzZUludChpdGVtWydzY29yZSddKTtcblx0XHRcdFx0fSlcblx0XHRcdFx0dmFyIGZpbHRlciA9ICRmaWx0ZXIoJ29yZGVyQnknKSgkc2NvcGUuZGF0YSwgWyRzY29wZS5zZWxlY3RlZC50eXBlLFwic2NvcmVcIl0gLCB0cnVlKTtcblx0XHRcdFx0Zm9yKHZhciBpID0gMDtpIDwgZmlsdGVyLmxlbmd0aDsgaSsrKXtcblx0XHRcdFx0XHRpZihmaWx0ZXJbaV0uaXNvID09ICRzY29wZS5jb3VudHJ5Lmlzbyl7XG5cdFx0XHRcdFx0XHRyYW5rID0gaSsxO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHQkc2NvcGUuY291bnRyeS5yYW5rID0gcmFuaztcblx0XHR9XG5cdFx0ZnVuY3Rpb24gY3JlYXRlSW5kZXhlcigpe1xuXHRcdCBcdCRzY29wZS5pbmRleGVyID0gWyRzY29wZS5zZWxlY3RlZC5kYXRhXTtcblx0XHR9XG5cdFx0ZnVuY3Rpb24gc2V0Q2hhcnQoKSB7XG5cdFx0XHQkc2NvcGUuY2hhcnQgPSB7XG5cdFx0XHRcdG9wdGlvbnM6IHtcblx0XHRcdFx0XHRjaGFydDoge1xuXHRcdFx0XHRcdFx0dHlwZTogJ2xpbmVDaGFydCcsXG5cdFx0XHRcdFx0XHQvL2hlaWdodDogMjAwLFxuXHRcdFx0XHRcdFx0bGVnZW5kUG9zaXRpb246ICdsZWZ0Jyxcblx0XHRcdFx0XHRcdG1hcmdpbjoge1xuXHRcdFx0XHRcdFx0XHR0b3A6IDIwLFxuXHRcdFx0XHRcdFx0XHRyaWdodDogMjAsXG5cdFx0XHRcdFx0XHRcdGJvdHRvbTogMjAsXG5cdFx0XHRcdFx0XHRcdGxlZnQ6IDIwXG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0eDogZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGQueDtcblx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHR5OiBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gZC55O1xuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdHNob3dWYWx1ZXM6IGZhbHNlLFxuXHRcdFx0XHRcdFx0c2hvd1lBeGlzOiBmYWxzZSxcblx0XHRcdFx0XHRcdHRyYW5zaXRpb25EdXJhdGlvbjogNTAwLFxuXHRcdFx0XHRcdFx0dXNlSW50ZXJhY3RpdmVHdWlkZWxpbmU6IHRydWUsXG5cdFx0XHRcdFx0XHRmb3JjZVk6IFsxMDAsIDBdLFxuXHRcdFx0XHRcdFx0eEF4aXM6IHtcblx0XHRcdFx0XHRcdFx0YXhpc0xhYmVsOiAnJ1xuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdHlBeGlzOiB7XG5cdFx0XHRcdFx0XHRcdGF4aXNMYWJlbDogJycsXG5cdFx0XHRcdFx0XHRcdGF4aXNMYWJlbERpc3RhbmNlOiAzMFxuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdGxlZ2VuZDp7XG5cdFx0XHRcdFx0XHRcdHJpZ2h0QWxpZ246ZmFsc2UsXG5cdFx0XHRcdFx0XHRcdG1hcmdpbjp7XG5cdFx0XHRcdFx0XHRcdFx0Ym90dG9tOjMwXG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRsaW5lczp7XG5cdFx0XHRcdFx0XHRcdGludGVycG9sYXRlOidjYXJkaW5hbCdcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sXG5cdFx0XHRcdGRhdGE6IFtdXG5cdFx0XHR9O1xuXHRcdFx0cmV0dXJuICRzY29wZS5jaGFydDtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBjYWxjdWxhdGVHcmFwaCgpIHtcblxuXHRcdFx0dmFyIGNoYXJ0RGF0YSA9IFtdO1xuXHRcdFx0YW5ndWxhci5mb3JFYWNoKCRzY29wZS5zZWxlY3RlZC5kYXRhLmNoaWxkcmVuLCBmdW5jdGlvbiAoaXRlbSwga2V5KSB7XG5cdFx0XHRcdHZhciBncmFwaCA9IHtcblx0XHRcdFx0XHRrZXk6IGl0ZW0udGl0bGUsXG5cdFx0XHRcdFx0Y29sb3I6IGl0ZW0uY29sb3IsXG5cdFx0XHRcdFx0dmFsdWVzOiBbXVxuXHRcdFx0XHR9O1xuXHRcdFx0XHRhbmd1bGFyLmZvckVhY2goJHNjb3BlLmNvdW50cnkuZXBpLCBmdW5jdGlvbiAoZGF0YSkge1xuXHRcdFx0XHRcdGdyYXBoLnZhbHVlcy5wdXNoKHtcblx0XHRcdFx0XHRcdHg6IGRhdGEueWVhcixcblx0XHRcdFx0XHRcdHk6IGRhdGFbaXRlbS5jb2x1bW5fbmFtZV1cblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fSk7XG5cdFx0XHRcdGNoYXJ0RGF0YS5wdXNoKGdyYXBoKTtcblx0XHRcdH0pO1xuXHRcdFx0JHNjb3BlLmNoYXJ0LmRhdGEgPSBjaGFydERhdGE7XG5cdFx0fVxuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5kaXJlY3RpdmVzJykuZGlyZWN0aXZlKCdzdW5idXJzdCcsIGZ1bmN0aW9uICgpIHtcblx0XHR2YXIgZGVmYXVsdHMgPSBmdW5jdGlvbigpe1xuXHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdCBtb2RlOiAnc2l6ZSdcblx0XHRcdFx0fVxuXHRcdH07XG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlc3RyaWN0OiAnRScsXG5cdFx0XHQvL3RlbXBsYXRlVXJsOiAndmlld3MvZGlyZWN0aXZlcy9zdW5idXJzdC9zdW5idXJzdC5odG1sJyxcblx0XHRcdGNvbnRyb2xsZXI6ICdTdW5idXJzdEN0cmwnLFxuXHRcdFx0c2NvcGU6IHtcblx0XHRcdFx0ZGF0YTogJz0nXG5cdFx0XHR9LFxuXHRcdFx0bGluazogZnVuY3Rpb24gKCRzY29wZSwgZWxlbWVudCwgJGF0dHJzKSB7XG5cdFx0XHRcdHZhciBvcHRpb25zID0gYW5ndWxhci5leHRlbmQoZGVmYXVsdHMoKSwgJGF0dHJzKTtcblx0XHRcdFx0JHNjb3BlLnNldENoYXJ0KCk7XG5cdFx0XHRcdCRzY29wZS5jYWxjdWxhdGVHcmFwaCgpO1xuXHRcdFx0XHR2YXIgd2lkdGggPSA2MTAsXG5cdFx0XHRcdFx0aGVpZ2h0ID0gd2lkdGgsXG5cdFx0XHRcdFx0cmFkaXVzID0gKHdpZHRoKSAvIDIsXG5cdFx0XHRcdFx0eCA9IGQzLnNjYWxlLmxpbmVhcigpLnJhbmdlKFswLCAyICogTWF0aC5QSV0pLFxuXHRcdFx0XHRcdHkgPSBkMy5zY2FsZS5wb3coKS5leHBvbmVudCgxLjMpLmRvbWFpbihbMCwgMV0pLnJhbmdlKFswLCByYWRpdXNdKSxcblx0XHRcdFx0XHQvL34geSA9IGQzLnNjYWxlLnBvdygpLmV4cG9uZW50KDEuMykuZG9tYWluKFswLCAwLjI1LCAxXSkucmFuZ2UoWzAsIDMwLCByYWRpdXNdKSxcblx0XHRcdFx0XHQvL34geSA9IGQzLnNjYWxlLmxpbmVhcigpLmRvbWFpbihbMCwgMC4yNSwgMC41LCAwLjc1LCAxXSkucmFuZ2UoWzAsIDMwLCAxMTUsIDIwMCwgcmFkaXVzXSksXG5cdFx0XHRcdFx0cGFkZGluZyA9IDAsXG5cdFx0XHRcdFx0ZHVyYXRpb24gPSAxMDAwLFxuXHRcdFx0XHRcdGNpcmNQYWRkaW5nID0gMTA7XG5cblx0XHRcdFx0dmFyIGRpdiA9IGQzLnNlbGVjdChlbGVtZW50WzBdKTtcblxuXG5cdFx0XHRcdHZhciB2aXMgPSBkaXYuYXBwZW5kKFwic3ZnXCIpXG5cdFx0XHRcdFx0LmF0dHIoXCJ3aWR0aFwiLCB3aWR0aCArIHBhZGRpbmcgKiAyKVxuXHRcdFx0XHRcdC5hdHRyKFwiaGVpZ2h0XCIsIGhlaWdodCArIHBhZGRpbmcgKiAyKVxuXHRcdFx0XHRcdC5hcHBlbmQoXCJnXCIpXG5cdFx0XHRcdFx0LmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIgKyBbcmFkaXVzICsgcGFkZGluZywgcmFkaXVzICsgcGFkZGluZ10gKyBcIilcIik7XG5cblx0XHRcdFx0Lypcblx0XHRcdFx0ZGl2LmFwcGVuZChcInBcIilcblx0XHRcdFx0XHRcdC5hdHRyKFwiaWRcIiwgXCJpbnRyb1wiKVxuXHRcdFx0XHRcdFx0LnRleHQoXCJDbGljayB0byB6b29tIVwiKTtcblx0XHRcdFx0Ki9cblxuXHRcdFx0XHR2YXIgcGFydGl0aW9uID0gZDMubGF5b3V0LnBhcnRpdGlvbigpXG5cdFx0XHRcdFx0LnNvcnQobnVsbClcblx0XHRcdFx0XHQudmFsdWUoZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdHJldHVybiAxO1xuXHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdHZhciBhcmMgPSBkMy5zdmcuYXJjKClcblx0XHRcdFx0XHQuc3RhcnRBbmdsZShmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIE1hdGgubWF4KDAsIE1hdGgubWluKDIgKiBNYXRoLlBJLCB4KGQueCkpKTtcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC5lbmRBbmdsZShmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIE1hdGgubWF4KDAsIE1hdGgubWluKDIgKiBNYXRoLlBJLCB4KGQueCArIGQuZHgpKSk7XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQuaW5uZXJSYWRpdXMoZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdHJldHVybiBNYXRoLm1heCgwLCBkLnkgPyB5KGQueSkgOiBkLnkpO1xuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0Lm91dGVyUmFkaXVzKGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gTWF0aC5tYXgoMCwgeShkLnkgKyBkLmR5KSk7XG5cdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0dmFyIHNwZWNpYWwxID0gXCJXYXN0ZXdhdGVyIFRyZWF0bWVudFwiLFxuXHRcdFx0XHRcdHNwZWNpYWwyID0gXCJBaXIgUG9sbHV0aW9uIFBNMi41IEV4Y2VlZGFuY2VcIixcblx0XHRcdFx0XHRzcGVjaWFsMyA9IFwiQWdyaWN1bHR1cmFsIFN1YnNpZGllc1wiLFxuXHRcdFx0XHRcdHNwZWNpYWw0ID0gXCJQZXN0aWNpZGUgUmVndWxhdGlvblwiO1xuXG5cblx0XHRcdFx0dmFyIG5vZGVzID0gcGFydGl0aW9uLm5vZGVzKCRzY29wZS5jYWxjdWxhdGVHcmFwaCgpKTtcblxuXHRcdFx0XHR2YXIgcGF0aCA9IHZpcy5zZWxlY3RBbGwoXCJwYXRoXCIpLmRhdGEobm9kZXMpO1xuXHRcdFx0XHRwYXRoLmVudGVyKCkuYXBwZW5kKFwicGF0aFwiKVxuXHRcdFx0XHRcdC5hdHRyKFwiaWRcIiwgZnVuY3Rpb24gKGQsIGkpIHtcblx0XHRcdFx0XHRcdHJldHVybiBcInBhdGgtXCIgKyBpO1xuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0LmF0dHIoXCJkXCIsIGFyYylcblx0XHRcdFx0XHQuYXR0cihcImZpbGwtcnVsZVwiLCBcImV2ZW5vZGRcIilcblx0XHRcdFx0XHQuYXR0cihcImNsYXNzXCIsIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZC5kZXB0aCA/IFwiYnJhbmNoXCIgOiBcInJvb3RcIjtcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC5zdHlsZShcImZpbGxcIiwgc2V0Q29sb3IpXG5cdFx0XHRcdFx0Lm9uKFwiY2xpY2tcIiwgY2xpY2spO1xuXG5cdFx0XHRcdHZhciB0ZXh0ID0gdmlzLnNlbGVjdEFsbChcInRleHRcIikuZGF0YShub2Rlcyk7XG5cdFx0XHRcdHZhciB0ZXh0RW50ZXIgPSB0ZXh0LmVudGVyKCkuYXBwZW5kKFwidGV4dFwiKVxuXHRcdFx0XHRcdC5zdHlsZShcImZpbGwtb3BhY2l0eVwiLCAxKVxuXHRcdFx0XHRcdC5hdHRyKFwidGV4dC1hbmNob3JcIiwgZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdGlmIChkLmRlcHRoKVxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gXCJtaWRkbGVcIjtcblx0XHRcdFx0XHRcdC8vfiByZXR1cm4geChkLnggKyBkLmR4IC8gMikgPiBNYXRoLlBJID8gXCJlbmRcIiA6IFwic3RhcnRcIjtcblx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0cmV0dXJuIFwibWlkZGxlXCI7XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQuYXR0cihcImlkXCIsIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gXCJkZXB0aFwiICsgZC5kZXB0aDtcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC5hdHRyKFwiY2xhc3NcIiwgZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdHJldHVybiBcInNlY3RvclwiXG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQuYXR0cihcImR5XCIsIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZC5kZXB0aCA/IFwiLjJlbVwiIDogXCIwLjM1ZW1cIjtcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC5hdHRyKFwidHJhbnNmb3JtXCIsIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHR2YXIgbXVsdGlsaW5lID0gKGQubmFtZSB8fCBcIlwiKS5zcGxpdChcIiBcIikubGVuZ3RoID4gMixcblx0XHRcdFx0XHRcdFx0YW5nbGVBbGlnbiA9IChkLnggPiAwLjUgPyAyIDogLTIpLFxuXHRcdFx0XHRcdFx0XHRhbmdsZSA9IHgoZC54ICsgZC5keCAvIDIpICogMTgwIC8gTWF0aC5QSSAtIDkwICsgKG11bHRpbGluZSA/IGFuZ2xlQWxpZ24gOiAwKSxcblx0XHRcdFx0XHRcdFx0cm90YXRlID0gYW5nbGUgKyAobXVsdGlsaW5lID8gLS41IDogMCksXG5cdFx0XHRcdFx0XHRcdHRyYW5zbCA9ICh5KGQueSkgKyBjaXJjUGFkZGluZykgKyAzNSxcblx0XHRcdFx0XHRcdFx0c2VjQW5nbGUgPSAoYW5nbGUgPiA5MCA/IC0xODAgOiAwKTtcblx0XHRcdFx0XHRcdGlmIChkLm5hbWUgPT0gc3BlY2lhbDMgfHwgZC5uYW1lID09IHNwZWNpYWw0KSByb3RhdGUgKz0gMTtcblx0XHRcdFx0XHRcdGlmIChkLmRlcHRoID09IDApIHtcblx0XHRcdFx0XHRcdFx0dHJhbnNsID0gLTIuNTA7XG5cdFx0XHRcdFx0XHRcdHJvdGF0ZSA9IDA7XG5cdFx0XHRcdFx0XHRcdHNlY0FuZ2xlID0gMDtcblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoZC5kZXB0aCA9PSAxKSB0cmFuc2wgKz0gLTk7XG5cdFx0XHRcdFx0XHRlbHNlIGlmIChkLmRlcHRoID09IDIpIHRyYW5zbCArPSAtNTtcblx0XHRcdFx0XHRcdGVsc2UgaWYgKGQuZGVwdGggPT0gMykgdHJhbnNsICs9IDQ7XG5cdFx0XHRcdFx0XHRyZXR1cm4gXCJyb3RhdGUoXCIgKyByb3RhdGUgKyBcIil0cmFuc2xhdGUoXCIgKyB0cmFuc2wgKyBcIilyb3RhdGUoXCIgKyBzZWNBbmdsZSArIFwiKVwiO1xuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0Lm9uKFwiY2xpY2tcIiwgY2xpY2spO1xuXG5cdFx0XHRcdC8vIEFkZCBsYWJlbHMuIFZlcnkgdWdseSBjb2RlIHRvIHNwbGl0IHNlbnRlbmNlcyBpbnRvIGxpbmVzLiBDYW4gb25seSBtYWtlXG5cdFx0XHRcdC8vIGNvZGUgYmV0dGVyIGlmIGZpbmQgYSB3YXkgdG8gdXNlIGQgb3V0c2lkZSBjYWxscyBzdWNoIGFzIC50ZXh0KGZ1bmN0aW9uKGQpKVxuXG5cdFx0XHRcdC8vIFRoaXMgYmxvY2sgcmVwbGFjZXMgdGhlIHR3byBibG9ja3MgYXJyb3VuZCBpdC4gSXQgaXMgJ3VzZWZ1bCcgYmVjYXVzZSBpdFxuXHRcdFx0XHQvLyB1c2VzIGZvcmVpZ25PYmplY3QsIHNvIHRoYXQgdGV4dCB3aWxsIHdyYXAgYXJvdW5kIGxpa2UgaW4gcmVndWxhciBIVE1MLiBJIHRyaWVkXG5cdFx0XHRcdC8vIHRvIGdldCBpdCB0byB3b3JrLCBidXQgaXQgb25seSBpbnRyb2R1Y2VkIG1vcmUgYnVncy4gVW5mb3J0dW5hdGVseSwgdGhlXG5cdFx0XHRcdC8vIHVnbHkgc29sdXRpb24gKGhhcmQgY29kZWQgbGluZSBzcGxpY2luZykgd29uLlxuXHRcdFx0XHQvL34gdmFyIHRleHRFbnRlciA9IHRleHQuZW50ZXIoKS5hcHBlbmQoXCJmb3JlaWduT2JqZWN0XCIpXG5cdFx0XHRcdC8vfiAuYXR0cihcInhcIiwwKVxuXHRcdFx0XHQvL34gLmF0dHIoXCJ5XCIsLTIwKVxuXHRcdFx0XHQvL34gLmF0dHIoXCJoZWlnaHRcIiwgMTAwKVxuXHRcdFx0XHQvL34gLmF0dHIoXCJ3aWR0aFwiLCBmdW5jdGlvbihkKXsgcmV0dXJuICh5KGQuZHkpICs1MCk7IH0pXG5cdFx0XHRcdC8vfiAuYXR0cihcInRyYW5zZm9ybVwiLCBmdW5jdGlvbihkKSB7XG5cdFx0XHRcdC8vfiB2YXIgYW5nbGVBbGlnbiA9IChkLnggPiAwLjUgPyAyIDogLTIpLFxuXHRcdFx0XHQvL34gYW5nbGUgPSB4KGQueCArIGQuZHggLyAyKSAqIDE4MCAvIE1hdGguUEkgLSA5MCxcblx0XHRcdFx0Ly9+IHRyYW5zbCA9ICh5KGQueSkgKyBjaXJjUGFkZGluZyk7XG5cdFx0XHRcdC8vfiBkLnJvdCA9IGFuZ2xlO1xuXHRcdFx0XHQvL34gaWYgKCFkLmRlcHRoKSB0cmFuc2wgPSAtNTA7XG5cdFx0XHRcdC8vfiBpZiAoYW5nbGUgPiA5MCkgdHJhbnNsICs9IDEyMDtcblx0XHRcdFx0Ly9+IGlmIChkLmRlcHRoKVxuXHRcdFx0XHQvL34gcmV0dXJuIFwicm90YXRlKFwiICsgYW5nbGUgKyBcIil0cmFuc2xhdGUoXCIgKyB0cmFuc2wgKyBcIilyb3RhdGUoXCIgKyAoYW5nbGUgPiA5MCA/IC0xODAgOiAwKSArIFwiKVwiO1xuXHRcdFx0XHQvL34gZWxzZVxuXHRcdFx0XHQvL34gcmV0dXJuIFwidHJhbnNsYXRlKFwiICsgdHJhbnNsICsgXCIpXCI7XG5cdFx0XHRcdC8vfiB9KVxuXHRcdFx0XHQvL34gLmFwcGVuZChcInhodG1sOmJvZHlcIilcblx0XHRcdFx0Ly9+IC5zdHlsZShcImJhY2tncm91bmRcIiwgXCJub25lXCIpXG5cdFx0XHRcdC8vfiAuc3R5bGUoXCJ0ZXh0LWFsaWduXCIsIGZ1bmN0aW9uKGQpeyByZXR1cm4gKGQucm90ID4gOTAgPyBcImxlZnRcIiA6IFwicmlnaHRcIil9KVxuXHRcdFx0XHQvL34gLmh0bWwoZnVuY3Rpb24oZCl7IHJldHVybiAnPGRpdiBjbGFzcz0nICtcImRlcHRoXCIgKyBkLmRlcHRoICsnIHN0eWxlPVxcXCJ3aWR0aDogJyArKHkoZC5keSkgKzUwKSArJ3B4OycgK1widGV4dC1hbGlnbjogXCIgKyAoZC5yb3QgPiA5MCA/IFwicmlnaHRcIiA6IFwibGVmdFwiKSArJ1wiPicgK2QubmFtZSArJzwvZGl2Pic7fSlcblxuXHRcdFx0XHR0ZXh0RW50ZXIuYXBwZW5kKFwidHNwYW5cIilcblx0XHRcdFx0XHQuYXR0cihcInhcIiwgMClcblx0XHRcdFx0XHQudGV4dChmdW5jdGlvbiAoZCkge1xuXG5cdFx0XHRcdFx0XHRpZiAoZC5kZXB0aCA9PSAzICYmIGQubmFtZSAhPSBzcGVjaWFsMSAmJiBkLm5hbWUgIT0gc3BlY2lhbDIgJiYgZC5uYW1lICE9IHNwZWNpYWwzICYmIGQubmFtZSAhPSBzcGVjaWFsNClcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGQubmFtZS5zcGxpdChcIiBcIilbMF0gKyBcIiBcIiArIChkLm5hbWUuc3BsaXQoXCIgXCIpWzFdIHx8IFwiXCIpO1xuXHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gZC5uYW1lLnNwbGl0KFwiIFwiKVswXTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0dGV4dEVudGVyLmFwcGVuZChcInRzcGFuXCIpXG5cdFx0XHRcdFx0LmF0dHIoXCJ4XCIsIDApXG5cdFx0XHRcdFx0LmF0dHIoXCJkeVwiLCBcIjFlbVwiKVxuXHRcdFx0XHRcdC50ZXh0KGZ1bmN0aW9uIChkKSB7XG5cblx0XHRcdFx0XHRcdGlmIChkLmRlcHRoID09IDMgJiYgZC5uYW1lICE9IHNwZWNpYWwxICYmIGQubmFtZSAhPSBzcGVjaWFsMiAmJiBkLm5hbWUgIT0gc3BlY2lhbDMgJiYgZC5uYW1lICE9IHNwZWNpYWw0KVxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gKGQubmFtZS5zcGxpdChcIiBcIilbMl0gfHwgXCJcIikgKyBcIiBcIiArIChkLm5hbWUuc3BsaXQoXCIgXCIpWzNdIHx8IFwiXCIpO1xuXHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gKGQubmFtZS5zcGxpdChcIiBcIilbMV0gfHwgXCJcIikgKyBcIiBcIiArIChkLm5hbWUuc3BsaXQoXCIgXCIpWzJdIHx8IFwiXCIpO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR0ZXh0RW50ZXIuYXBwZW5kKFwidHNwYW5cIilcblx0XHRcdFx0XHQuYXR0cihcInhcIiwgMClcblx0XHRcdFx0XHQuYXR0cihcImR5XCIsIFwiMWVtXCIpXG5cdFx0XHRcdFx0LnRleHQoZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdGlmIChkLmRlcHRoID09IDMgJiYgZC5uYW1lICE9IHNwZWNpYWwxICYmIGQubmFtZSAhPSBzcGVjaWFsMiAmJiBkLm5hbWUgIT0gc3BlY2lhbDMgJiYgZC5uYW1lICE9IHNwZWNpYWw0KVxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gKGQubmFtZS5zcGxpdChcIiBcIilbNF0gfHwgXCJcIikgKyBcIiBcIiArIChkLm5hbWUuc3BsaXQoXCIgXCIpWzVdIHx8IFwiXCIpO1xuXHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gKGQubmFtZS5zcGxpdChcIiBcIilbM10gfHwgXCJcIikgKyBcIiBcIiArIChkLm5hbWUuc3BsaXQoXCIgXCIpWzRdIHx8IFwiXCIpOztcblx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRmdW5jdGlvbiBjbGljayhkKSB7XG5cdFx0XHRcdFx0Ly8gQ29udHJvbCBhcmMgdHJhbnNpdGlvblxuXHRcdFx0XHRcdHBhdGgudHJhbnNpdGlvbigpXG5cdFx0XHRcdFx0XHQuZHVyYXRpb24oZHVyYXRpb24pXG5cdFx0XHRcdFx0XHQuYXR0clR3ZWVuKFwiZFwiLCBhcmNUd2VlbihkKSk7XG5cblx0XHRcdFx0XHQvLyBTb21ld2hhdCBvZiBhIGhhY2sgYXMgd2UgcmVseSBvbiBhcmNUd2VlbiB1cGRhdGluZyB0aGUgc2NhbGVzLlxuXHRcdFx0XHRcdC8vIENvbnRyb2wgdGhlIHRleHQgdHJhbnNpdGlvblxuXHRcdFx0XHRcdHRleHQuc3R5bGUoXCJ2aXNpYmlsaXR5XCIsIGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBpc1BhcmVudE9mKGQsIGUpID8gbnVsbCA6IGQzLnNlbGVjdCh0aGlzKS5zdHlsZShcInZpc2liaWxpdHlcIik7XG5cdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0LnRyYW5zaXRpb24oKVxuXHRcdFx0XHRcdFx0LmR1cmF0aW9uKGR1cmF0aW9uKVxuXHRcdFx0XHRcdFx0LmF0dHJUd2VlbihcInRleHQtYW5jaG9yXCIsIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRcdFx0aWYgKGQuZGVwdGgpXG5cdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gXCJtaWRkbGVcIjtcblx0XHRcdFx0XHRcdFx0XHQvL34gcmV0dXJuIHgoZC54ICsgZC5keCAvIDIpID4gTWF0aC5QSSA/IFwiZW5kXCIgOiBcInN0YXJ0XCI7XG5cdFx0XHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIFwibWlkZGxlXCI7XG5cdFx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0LmF0dHJUd2VlbihcInRyYW5zZm9ybVwiLCBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0XHR2YXIgbXVsdGlsaW5lID0gKGQubmFtZSB8fCBcIlwiKS5zcGxpdChcIiBcIikubGVuZ3RoID4gMjtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdFx0XHR2YXIgbXVsdGlsaW5lID0gKGQubmFtZSB8fCBcIlwiKS5zcGxpdChcIiBcIikubGVuZ3RoID4gMixcblx0XHRcdFx0XHRcdFx0XHRcdGFuZ2xlQWxpZ24gPSAoZC54ID4gMC41ID8gMiA6IC0yKSxcblx0XHRcdFx0XHRcdFx0XHRcdGFuZ2xlID0geChkLnggKyBkLmR4IC8gMikgKiAxODAgLyBNYXRoLlBJIC0gOTAgKyAobXVsdGlsaW5lID8gYW5nbGVBbGlnbiA6IDApLFxuXHRcdFx0XHRcdFx0XHRcdFx0cm90YXRlID0gYW5nbGUgKyAobXVsdGlsaW5lID8gLS41IDogMCksXG5cdFx0XHRcdFx0XHRcdFx0XHR0cmFuc2wgPSAoeShkLnkpICsgY2lyY1BhZGRpbmcpICsgMzUsXG5cdFx0XHRcdFx0XHRcdFx0XHRzZWNBbmdsZSA9IChhbmdsZSA+IDkwID8gLTE4MCA6IDApO1xuXHRcdFx0XHRcdFx0XHRcdGlmIChkLm5hbWUgPT0gc3BlY2lhbDMgfHwgZC5uYW1lID09IHNwZWNpYWw0KSByb3RhdGUgKz0gMTtcblx0XHRcdFx0XHRcdFx0XHRpZiAoZC5kZXB0aCA9PSAwKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHR0cmFuc2wgPSAtMi41MDtcblx0XHRcdFx0XHRcdFx0XHRcdHJvdGF0ZSA9IDA7XG5cdFx0XHRcdFx0XHRcdFx0XHRzZWNBbmdsZSA9IDA7XG5cdFx0XHRcdFx0XHRcdFx0fSBlbHNlIGlmIChkLmRlcHRoID09IDEpIHRyYW5zbCArPSAtOTtcblx0XHRcdFx0XHRcdFx0XHRlbHNlIGlmIChkLmRlcHRoID09IDIpIHRyYW5zbCArPSAtNTtcblx0XHRcdFx0XHRcdFx0XHRlbHNlIGlmIChkLmRlcHRoID09IDMpIHRyYW5zbCArPSA0O1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBcInJvdGF0ZShcIiArIHJvdGF0ZSArIFwiKXRyYW5zbGF0ZShcIiArIHRyYW5zbCArIFwiKXJvdGF0ZShcIiArIHNlY0FuZ2xlICsgXCIpXCI7XG5cdFx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0LnN0eWxlKFwiZmlsbC1vcGFjaXR5XCIsIGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBpc1BhcmVudE9mKGQsIGUpID8gMSA6IDFlLTY7XG5cdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0LmVhY2goXCJlbmRcIiwgZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0XHRcdFx0ZDMuc2VsZWN0KHRoaXMpLnN0eWxlKFwidmlzaWJpbGl0eVwiLCBpc1BhcmVudE9mKGQsIGUpID8gbnVsbCA6IFwiaGlkZGVuXCIpO1xuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblxuXG5cdFx0XHRcdGZ1bmN0aW9uIGlzUGFyZW50T2YocCwgYykge1xuXHRcdFx0XHRcdGlmIChwID09PSBjKSByZXR1cm4gdHJ1ZTtcblx0XHRcdFx0XHRpZiAocC5jaGlsZHJlbikge1xuXHRcdFx0XHRcdFx0cmV0dXJuIHAuY2hpbGRyZW4uc29tZShmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gaXNQYXJlbnRPZihkLCBjKTtcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRmdW5jdGlvbiBzZXRDb2xvcihkKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGQuY29sb3I7XG5cdFx0XHRcdFx0aWYgKGQuY29sb3IpXG5cdFx0XHRcdFx0XHRyZXR1cm4gZC5jb2xvcjtcblx0XHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRcdHZhciB0aW50RGVjYXkgPSAwLjIwO1xuXHRcdFx0XHRcdFx0Ly8gRmluZCBjaGlsZCBudW1iZXJcblx0XHRcdFx0XHRcdHZhciB4ID0gMDtcblx0XHRcdFx0XHRcdHdoaWxlIChkLnBhcmVudC5jaGlsZHJlblt4XSAhPSBkKVxuXHRcdFx0XHRcdFx0XHR4Kys7XG5cdFx0XHRcdFx0XHR2YXIgdGludENoYW5nZSA9ICh0aW50RGVjYXkgKiAoeCArIDEpKS50b1N0cmluZygpO1xuXHRcdFx0XHRcdFx0cmV0dXJuIHB1c2hlci5jb2xvcihkLnBhcmVudC5jb2xvcikudGludCh0aW50Q2hhbmdlKS5odG1sKCdoZXg2Jyk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gSW50ZXJwb2xhdGUgdGhlIHNjYWxlcyFcblx0XHRcdFx0ZnVuY3Rpb24gYXJjVHdlZW4oZCkge1xuXHRcdFx0XHRcdHZhciBteSA9IG1heFkoZCksXG5cdFx0XHRcdFx0XHR4ZCA9IGQzLmludGVycG9sYXRlKHguZG9tYWluKCksIFtkLngsIGQueCArIGQuZHggLSAwLjAwMDldKSxcblx0XHRcdFx0XHRcdHlkID0gZDMuaW50ZXJwb2xhdGUoeS5kb21haW4oKSwgW2QueSwgbXldKSxcblx0XHRcdFx0XHRcdHlyID0gZDMuaW50ZXJwb2xhdGUoeS5yYW5nZSgpLCBbZC55ID8gMjAgOiAwLCByYWRpdXNdKTtcblxuXHRcdFx0XHRcdHJldHVybiBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGZ1bmN0aW9uICh0KSB7XG5cdFx0XHRcdFx0XHRcdHguZG9tYWluKHhkKHQpKTtcblx0XHRcdFx0XHRcdFx0eS5kb21haW4oeWQodCkpLnJhbmdlKHlyKHQpKTtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGFyYyhkKTtcblx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGZ1bmN0aW9uIG1heFkoZCkge1xuXHRcdFx0XHRcdHJldHVybiBkLmNoaWxkcmVuID8gTWF0aC5tYXguYXBwbHkoTWF0aCwgZC5jaGlsZHJlbi5tYXAobWF4WSkpIDogZC55ICsgZC5keTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fSk7XG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ1N1bmJ1cnN0Q3RybCcsIGZ1bmN0aW9uICgkc2NvcGUpIHtcblxuXHRcdCRzY29wZS5zZXRDaGFydCA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdCRzY29wZS5jaGFydCA9IHtcblx0XHRcdFx0b3B0aW9uczoge1xuXHRcdFx0XHRcdGNoYXJ0OiB7XG5cdFx0XHRcdFx0XHR0eXBlOiAnc3VuYnVyc3QnLFxuXHRcdFx0XHRcdFx0aGVpZ2h0OiA3MDAsXG5cdFx0XHRcdFx0XHRcInN1bmJ1cnN0XCI6IHtcblx0XHRcdFx0XHRcdFx0XCJkaXNwYXRjaFwiOiB7fSxcblx0XHRcdFx0XHRcdFx0XCJ3aWR0aFwiOiBudWxsLFxuXHRcdFx0XHRcdFx0XHRcImhlaWdodFwiOiBudWxsLFxuXHRcdFx0XHRcdFx0XHRcIm1vZGVcIjogXCJzaXplXCIsXG5cdFx0XHRcdFx0XHRcdFwiaWRcIjogMjA4OCxcblx0XHRcdFx0XHRcdFx0XCJkdXJhdGlvblwiOiA1MDAsXG5cdFx0XHRcdFx0XHRcdFwibWFyZ2luXCI6IHtcblx0XHRcdFx0XHRcdFx0XHRcInRvcFwiOiAwLFxuXHRcdFx0XHRcdFx0XHRcdFwicmlnaHRcIjogMCxcblx0XHRcdFx0XHRcdFx0XHRcImJvdHRvbVwiOiAwLFxuXHRcdFx0XHRcdFx0XHRcdFwibGVmdFwiOiAwXG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRcInRvb2x0aXBcIjoge1xuXHRcdFx0XHRcdFx0XHRcImR1cmF0aW9uXCI6IDAsXG5cdFx0XHRcdFx0XHRcdFwiZ3Jhdml0eVwiOiBcIndcIixcblx0XHRcdFx0XHRcdFx0XCJkaXN0YW5jZVwiOiAyNSxcblx0XHRcdFx0XHRcdFx0XCJzbmFwRGlzdGFuY2VcIjogMCxcblx0XHRcdFx0XHRcdFx0XCJjbGFzc2VzXCI6IG51bGwsXG5cdFx0XHRcdFx0XHRcdFwiY2hhcnRDb250YWluZXJcIjogbnVsbCxcblx0XHRcdFx0XHRcdFx0XCJmaXhlZFRvcFwiOiBudWxsLFxuXHRcdFx0XHRcdFx0XHRcImVuYWJsZWRcIjogdHJ1ZSxcblx0XHRcdFx0XHRcdFx0XCJoaWRlRGVsYXlcIjogNDAwLFxuXHRcdFx0XHRcdFx0XHRcImhlYWRlckVuYWJsZWRcIjogZmFsc2UsXG5cblx0XHRcdFx0XHRcdFx0XCJvZmZzZXRcIjoge1xuXHRcdFx0XHRcdFx0XHRcdFwibGVmdFwiOiAwLFxuXHRcdFx0XHRcdFx0XHRcdFwidG9wXCI6IDBcblx0XHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdFx0XCJoaWRkZW5cIjogdHJ1ZSxcblx0XHRcdFx0XHRcdFx0XCJkYXRhXCI6IG51bGwsXG5cdFx0XHRcdFx0XHRcdFwidG9vbHRpcEVsZW1cIjogbnVsbCxcblx0XHRcdFx0XHRcdFx0XCJpZFwiOiBcIm52dG9vbHRpcC05OTM0N1wiXG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSxcblx0XHRcdFx0ZGF0YTogW11cblx0XHRcdH07XG5cdFx0XHRyZXR1cm4gJHNjb3BlLmNoYXJ0O1xuXHRcdH1cblx0XHR2YXIgYnVpbGRUcmVlID0gZnVuY3Rpb24gKGRhdGEpIHtcblx0XHRcdHZhciBjaGlsZHJlbiA9IFtdO1xuXHRcdFx0YW5ndWxhci5mb3JFYWNoKGRhdGEsIGZ1bmN0aW9uIChpdGVtKSB7XG5cdFx0XHRcdHZhciBjaGlsZCA9IHtcblx0XHRcdFx0XHQnbmFtZSc6IGl0ZW0udGl0bGUsXG5cdFx0XHRcdFx0J3NpemUnOiBpdGVtLnNpemUsXG5cdFx0XHRcdFx0J2NvbG9yJzogaXRlbS5jb2xvcixcblx0XHRcdFx0XHQnY2hpbGRyZW4nOiBidWlsZFRyZWUoaXRlbS5jaGlsZHJlbilcblx0XHRcdFx0fTtcblx0XHRcdFx0aWYoaXRlbS5jb2xvcil7XG5cdFx0XHRcdFx0Y2hpbGQuY29sb3IgPSBpdGVtLmNvbG9yXG5cdFx0XHRcdH1cblx0XHRcdFx0aWYoaXRlbS5zaXplKXtcblx0XHRcdFx0XHRjaGlsZC5zaXplID0gaXRlbS5zaXplXG5cdFx0XHRcdH1cblx0XHRcdFx0Y2hpbGRyZW4ucHVzaChjaGlsZCk7XG5cdFx0XHR9KTtcblx0XHRcdHJldHVybiBjaGlsZHJlbjtcblx0XHR9O1xuXHRcdCRzY29wZS5jYWxjdWxhdGVHcmFwaCA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdHZhciBjaGFydERhdGEgPSB7XG5cdFx0XHRcdFwibmFtZVwiOiAkc2NvcGUuZGF0YS50aXRsZSxcblx0XHRcdFx0XCJjb2xvclwiOiAkc2NvcGUuZGF0YS5jb2xvcixcblx0XHRcdFx0XCJjaGlsZHJlblwiOiBidWlsZFRyZWUoJHNjb3BlLmRhdGEuY2hpbGRyZW4pLFxuXHRcdFx0XHRcInNpemVcIjogMVxuXHRcdFx0fTtcblx0XHRcdCRzY29wZS5jaGFydC5kYXRhID0gY2hhcnREYXRhO1xuXHRcdFx0cmV0dXJuIGNoYXJ0RGF0YTtcblx0XHR9O1xuXHRcdCRzY29wZS4kd2F0Y2goJ2RhdGEnLCBmdW5jdGlvbiAobiwgbykge1xuXHRcdFx0aWYgKCFuKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHRcdCRzY29wZS5jYWxjdWxhdGVHcmFwaCgpO1xuXHRcdH0pXG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignQWRkVXNlcnNDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBEaWFsb2dTZXJ2aWNlKXtcblxuICAgICAgICAkc2NvcGUuc2F2ZSA9IGZ1bmN0aW9uKCl7XG5cdCAgICAgICAgLy9kbyBzb21ldGhpbmcgdXNlZnVsXG4gICAgICAgICAgICBEaWFsb2dTZXJ2aWNlLmhpZGUoKTtcbiAgICAgICAgfTtcblxuICAgICAgICAkc2NvcGUuaGlkZSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIFx0RGlhbG9nU2VydmljZS5oaWRlKCk7XG4gICAgICAgIH07XG5cbiAgICB9KTtcblxufSkoKTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==