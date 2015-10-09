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

		$urlRouterProvider.otherwise('/');

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

	angular.module('app.controllers').controller('EpiCtrl', ["$scope", "$state", "$timeout", "smoothScroll", "IndexService", "EPI", "DataService", "leafletData", "MapService", function ($scope,$state, $timeout, smoothScroll, IndexService, EPI, DataService, leafletData, MapService) {

		$scope.current = "";
		$scope.display = {
			selectedCat: '',
			rank: [{
				fields: {x: 'year',y:'rank'},
				title: 'Rank',
				color:'#52b695'
			}],
			score: [{
				fields: {x: 'year',y:'score'},
				title: 'Score',
				color:'#0066b9'
			}]
		};
		$scope.tabContent= "";
		$scope.toggleButton = 'arrow_drop_down';
		$scope.indexData = IndexService.getEpi();
		$scope.epi = [];
		$scope.menueOpen = true;
		$scope.details = false;
		$scope.info = false;
		$scope.closeIcon = 'close';
		$scope.compare= {
			active: false,
			countries:[]
		};
		$scope.showTabContent = function(content){
			if(content == '' && $scope.tabContent == ''){
				$scope.tabContent = 'rank';
			}
			else{
					$scope.tabContent = content;
			}
			$scope.toggleButton = $scope.tabContent ? 'arrow_drop_up': 'arrow_drop_down';
		};
		$scope.setState = function(iso){
			angular.forEach($scope.epi, function(epi){
				if(epi.iso == iso){
					$scope.current = epi;
				}
			});
		};
		$scope.epi = EPI;

		/*.getList().then(function(data){

				if($state.current.name == "app.epi.selected"){
					$scope.setState($state.params.item);
				}
		});*/



		/*DataService.getAll('epi/year/2014').then(function (data) {
			$scope.epi = data;

			if($state.current.name == "app.epi.selected"){
				console.log($state.params.item);
				$scope.setState($state.params.item);
			}
		});*/
		$scope.setState = function(item){
			$scope.setCurrent(getNationByIso(item));
		};
		//$scope.epi = Restangular.all('epi/year/2014').getList().$object;
		$scope.toggleOpen = function () {
			$scope.menueOpen = !$scope.menueOpen;
			$scope.closeIcon = $scope.menueOpen == true ? 'chevron_left' : 'chevron_right';
		}
		$scope.setCurrent = function (nat) {
			$scope.current = nat;
		};
		$scope.getRank = function (nat) {
			return $scope.epi.indexOf(nat) + 1;
		};
		$scope.toggleInfo = function(){
				$scope.display.selectedCat = '';
				$scope.info = !$scope.info;
		};
		$scope.toggleDetails = function () {
			return $scope.details = !$scope.details;
		};
		$scope.toggleComparison = function(){
			$scope.compare.countries = [$scope.current];
			$scope.compare.active = !$scope.compare.active;
			if($scope.compare.active){
				$timeout(function(){
					var element = document.getElementById('index-comparison');
					smoothScroll(element,{offset:120, duration:200});

				})
			}
		};
		$scope.toggleCountrieList = function(country){
			var found = false;
			angular.forEach($scope.compare.countries, function(nat, key){
					if(country == nat){
						$scope.compare.countries.splice(key, 1);
						found = true;
					}
			});
			if(!found){
				$scope.compare.countries.push(country);
			};
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
			//$scope.display.selectedCat = "";
			if(newItem.iso){
				if($scope.compare.active){
					$scope.toggleCountrieList(newItem);
				}
				else{
					$state.go('app.epi.selected', {item:newItem.iso})
				}

			}
			else{
				$state.go('app.epi');
			}
		});
		$scope.$watch('display.selectedCat', function(n, o){
				if(n === o){
					return
				}
				if(n)
				updateCanvas(n.color);
				else {
					updateCanvas('rgba(128, 243, 198,1)');
				};
				$scope.mvtSource.setStyle(countriesStyle);
		});
		$scope.$on("$stateChangeSuccess", function(event, toState, toParams){

			if(toState.name == "app.epi.selected"){
				$scope.setState( toParams.item);
				DataService.getOne('nations', toParams.item).then(function (data) {
					$scope.country = data;
				});
			}
			else{
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
			document.getElementsByTagName('body')[0].appendChild($scope.canvas);
		}
		var updateCanvas = function(color){
			var gradient = $scope.ctx.createLinearGradient(0, 0, 256, 10);
			gradient.addColorStop(0, 'rgba(255,255,255,0)');
			gradient.addColorStop(0.53, color);
			gradient.addColorStop(1, 'rgba(102,102,102,1)');
			$scope.ctx.fillStyle = gradient;
			$scope.ctx.fillRect(0, 0, 256, 10);
			$scope.palette = $scope.ctx.getImageData(0, 0, 256, 1).data;
		};
		createCanvas();

		var countriesStyle = function (feature) {
			var style = {};
			var iso = feature.properties.adm0_a3;
			console.log(iso);
			var nation = getNationByIso(iso);
			var field = $scope.display.selectedCat.type || 'score';
			var type = feature.type;
			switch (type) {
			case 1: //'Point' 
				style.color = 'rgba(49,79,79,0.01)';
				style.radius = 5;
				style.selected = {
					color: 'rgba(255,255,0,0.5)',
					radius: 0
				};
				break;
			case 2: //'LineString'
				style.color = 'rgba(255,0,0,1)';
				style.size = 1;
				style.selected = {
					color: 'rgba(255,25,0,1)',
					size: 2
				};
				break;
			case 3: //'Polygon'
				if (nation[field]) {
					var colorPos = parseInt(256 / 100 * nation[field]) * 4;
					var color = 'rgba(' + $scope.palette[colorPos] + ', ' + $scope.palette[colorPos + 1] + ', ' + $scope.palette[colorPos + 2] + ',' + $scope.palette[colorPos + 3] + ')';
					style.color = color;
					style.outline = {
						color: 'rgba(50,50,50,0.4)',
						size: 1
					};
					style.selected = {
						color: 'rgba(255,255,255,0.0)',
						outline: {
							color: 'rgba(0,0,0,0.5)',
							size: 1
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

			//	if (feature.layer.name === 'gaul_2014_adm1_label') {
			style.ajaxSource = function (mvtFeature) {
				var id = mvtFeature.id;
				//	console.log(id);
				//return 'http://spatialserver.spatialdev.com/fsp/2014/fsp/aggregations-no-name/' + id + '.json';
			};

			style.staticLabel = function (mvtFeature, ajaxData) {
				var style = {
					html: feature.properties.name,
					iconSize: [33, 33],
					cssClass: 'label-icon-number',
					cssSelectedClass: 'label-icon-number-selected'
				};
				return style;
			};
			//	}

			return style;
		};

		$scope.drawCountries = function () {
			leafletData.getMap('map').then(function (map) {
				var apiKey = 'pk.eyJ1IjoibWFnbm9sbyIsImEiOiJuSFdUYkg4In0.5HOykKk0pNP1N3isfPQGTQ';

				//	L.tileLayer('http://localhost:3001/services/postgis/countries_big/geom/dynamicMap/{z}/{x}/{y}.png').addTo(map);
				var debug = {};
				var mb = 'https://a.tiles.mapbox.com/v4/mapbox.mapbox-terrain-v1,mapbox.mapbox-streets-v6-dev/{z}/{x}/{y}.vector.pbf?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6IlhHVkZmaW8ifQ.hAMX5hSW-QnTeRCMAy9A8Q';
				var mapzen = 'http://vector.mapzen.com/osm/{layers}/{z}/{x}/{y}.{format}?api_key={api_key}'
				var url = 'http://localhost:3001/services/postgis/countries_big/geom/vector-tiles/{z}/{x}/{y}.pbf?fields=id,admin,adm0_a3,wb_a3,su_a3,iso_a3,name,name_long'; //
				var url2 = 'https://a.tiles.mapbox.com/v4/mapbox.mapbox-streets-v6-dev/{z}/{x}/{y}.vector.pbf?access_token=' + apiKey;
				$scope.mvtSource = new L.TileLayer.MVTSource({
					url: url, //"http://spatialserver.spatialdev.com/services/vector-tiles/gaul_fsp_india/{z}/{x}/{y}.pbf",
					debug: false,
					opacity: 0.6,
					clickableLayers: ['countries_big_geom'],
					//mutexToggle: true,
					onClick: function (evt, t) {
						//map.fitBounds(evt.target.getBounds());

						var x = evt.feature.bbox()[0]/ (evt.feature.extent / evt.feature.tileSize);
						var y = evt.feature.bbox()[1]/(evt.feature.extent / evt.feature.tileSize)
						if ($scope.current.country != evt.feature.properties.admin) {
							map.panTo(evt.latlng);
							map.panBy(new L.Point(-200,0));
						/*	map.fitBounds([
								[evt.feature.bbox()[0] / (evt.feature.extent / evt.feature.tileSize), evt.feature.bbox()[1] / (evt.feature.extent / evt.feature.tileSize)],
								[evt.feature.bbox()[2] / (evt.feature.extent / evt.feature.tileSize), evt.feature.bbox()[3] / (evt.feature.extent / evt.feature.tileSize)],
							])*/
						}
						//console.log(evt.feature);
						$scope.current = getNationByIso(evt.feature.properties.adm0_a3);
					},
					getIDForLayerFeature: function (feature) {

						return feature.properties.id;
					},
					filter: function (feature, context) {

						if (feature.layer.name === 'admin' || feature.layer.name === 'gaul_2014_adm1_label') {
							//console.log(feature);
							if (feature.properties.admin_level == 0 || feature.properties.admin_level == 1 || feature.properties.admin_level == 2) {
								return true;
							} else {
								return false;
							}

						}
						return true;
					},

					style: countriesStyle,


					layerLink: function (layerName) {
						if (layerName.indexOf('_label') > -1) {
							return layerName.replace('_label', '');
						}
						return layerName + '_label';
					}

				});
				debug.mvtSource = $scope.mvtSource;
				map.addLayer($scope.mvtSource);
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
			zoom: 4
		};
		$scope.defaults = {
			scrollWheelZoom: false
		};
		angular.extend($rootScope, {
			center: {
				lat: 0,
				lng: 0,
				zoom: 4
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
		$scope.searchIP = function (ip) {
			var url = "http://freegeoip.net/json/" + ip;
			$http.get(url).success(function (res) {
				$scope.center = {
					lat: res.latitude,
					lng: res.longitude,
					zoom: 4
				}
				$scope.ip = res.ip;
			})
		};

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
				width: 320,
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
									data: item
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
									y: options.width / 2 + (1 - count),
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
							.attr("transform", "translate(170,140)");
						options.arcBottom = options.vis.append("path")
							.attr("d", arcBottom)
							.attr("fill", "#006bb6")
							.attr("transform", "translate(170,180)");
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
				size: 178
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
						if (!newValue){
							newValue = {
								rank: options.size
							};
						}

						$timeout(function(){
							animateIt(newValue.rank)
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

(function () {
	"use strict";

	angular.module('app.directives').directive('median', ["$timeout", function ($timeout) {
		var defaults = function () {
			return {
				id: 'gradient',
				width: 340,
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
						console.log(newValue);
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
				selected: '='
			},
			controller: 'SubindexCtrl',
			templateUrl: 'views/directives/subindex/subindex.html',
			link: subindexLinkFunction
		};

		function subindexLinkFunction($scope, element, $attrs) {
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

	angular.module( 'app.controllers' ).controller( 'SubindexCtrl', ["$scope", "$timeout", "smoothScroll", function($scope, $timeout, smoothScroll){
		$scope.setChart = setChart;
		$scope.calculateGraph = calculateGraph;
		$scope.createIndexer = createIndexer;
		activate();


		function activate(){
			$scope.setChart();
			$scope.calculateGraph();
			$scope.createIndexer();
			$scope.$watch('selected', function (newItem, oldItem) {
				if (newItem === oldItem) {
					return false;
				}
				$scope.calculateGraph();
				$scope.gotoBox();
			})
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

		return {
			restrict: 'E',
			//templateUrl: 'views/directives/sunburst/sunburst.html',
			controller: 'SunburstCtrl',
			scope: {
				data: '='
			},
			link: function ($scope, element, $attrs) {
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
						return d.size;
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


					var nodes = partition.nodes(	$scope.calculateGraph());

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
				"name": $scope.data.name,
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9tYWluLmpzIiwiYXBwL3JvdXRlcy5qcyIsImFwcC9yb3V0ZXMucnVuLmpzIiwiY29uZmlnL2F1dGguanMiLCJjb25maWcvbG9hZGluZ19iYXIuanMiLCJjb25maWcvcmVzdGFuZ3VsYXIuanMiLCJjb25maWcvdGhlbWUuanMiLCJmaWx0ZXJzL2NhcGl0YWxpemUuanMiLCJmaWx0ZXJzL2h1bWFuX3JlYWRhYmxlLmpzIiwiZmlsdGVycy90cnVzdF9odG1sLmpzIiwiZmlsdGVycy91Y2ZpcnN0LmpzIiwic2VydmljZXMvRGF0YVNlcnZpY2UuanMiLCJzZXJ2aWNlcy9JbmRleC5qcyIsInNlcnZpY2VzL01hcC5qcyIsInNlcnZpY2VzL2RpYWxvZy5qcyIsInNlcnZpY2VzL3RvYXN0LmpzIiwiYXBwL2RpYWxvZ3MvZGlhbG9ncy5qcyIsImFwcC9lbGl4aXIvZWxpeGlyLmpzIiwiYXBwL2VwaS9lcGkuanMiLCJhcHAvZ2VuZXJhdG9ycy9nZW5lcmF0b3JzLmpzIiwiYXBwL2hlYWRlci9oZWFkZXIuanMiLCJhcHAvaW1wb3J0Y3N2L2ltcG9ydGNzdi5qcyIsImFwcC9qd3RfYXV0aC9qd3RfYXV0aC5qcyIsImFwcC9sYW5kaW5nL2xhbmRpbmcuanMiLCJhcHAvbG9naW4vbG9naW4uanMiLCJhcHAvbWFwL21hcC5qcyIsImFwcC9taXNjL21pc2MuanMiLCJhcHAvcmVzdF9hcGkvcmVzdF9hcGkuanMiLCJhcHAvc2lkZWJhci9zaWRlYmFyLmpzIiwiYXBwL3RhYnMvdGFicy5qcyIsImFwcC90b2FzdHMvdG9hc3RzLmpzIiwiYXBwL3Vuc3VwcG9ydGVkX2Jyb3dzZXIvdW5zdXBwb3J0ZWRfYnJvd3Nlci5qcyIsImRpcmVjdGl2ZXMvYnViYmxlcy9idWJibGVzLmpzIiwiZGlyZWN0aXZlcy9idWJibGVzL2RlZmluaXRpb24uanMiLCJkaXJlY3RpdmVzL2NpcmNsZWdyYXBoL2NpcmNsZWdyYXBoLmpzIiwiZGlyZWN0aXZlcy9jaXJjbGVncmFwaC9kZWZpbml0aW9uLmpzIiwiZGlyZWN0aXZlcy9kYXRhX2xpc3RpbmcvZGF0YV9saXN0aW5nLmpzIiwiZGlyZWN0aXZlcy9kYXRhX2xpc3RpbmcvZGVmaW5pdGlvbi5qcyIsImRpcmVjdGl2ZXMvbWVkaWFuL2RlZmluaXRpb24uanMiLCJkaXJlY3RpdmVzL21lZGlhbi9tZWRpYW4uanMiLCJkaXJlY3RpdmVzL3NpbXBsZWxpbmVjaGFydC9kZWZpbml0aW9uLmpzIiwiZGlyZWN0aXZlcy9zaW1wbGVsaW5lY2hhcnQvc2ltcGxlbGluZWNoYXJ0LmpzIiwiZGlyZWN0aXZlcy9zbGlkZVRvZ2dsZS9kZWZpbml0aW9uLmpzIiwiZGlyZWN0aXZlcy9zbGlkZVRvZ2dsZS9zbGlkZVRvZ2dsZS5qcyIsImRpcmVjdGl2ZXMvc3ViaW5kZXgvZGVmaW5pdGlvbi5qcyIsImRpcmVjdGl2ZXMvc3ViaW5kZXgvc3ViaW5kZXguanMiLCJkaXJlY3RpdmVzL3N1bmJ1cnN0L2RlZmluaXRpb24uanMiLCJkaXJlY3RpdmVzL3N1bmJ1cnN0L3N1bmJ1cnN0LmpzIiwiZGlhbG9ncy9hZGRfdXNlcnMvYWRkX3VzZXJzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLENBQUEsVUFBQTtDQUNBOztDQUVBLElBQUEsTUFBQSxRQUFBLE9BQUE7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7OztDQUlBLFFBQUEsT0FBQSxjQUFBLENBQUEsYUFBQSxhQUFBO0NBQ0EsUUFBQSxPQUFBLG1CQUFBLENBQUEsZUFBQSxhQUFBLGNBQUEsYUFBQSxlQUFBLGFBQUEsdUJBQUEsY0FBQSxjQUFBLG9CQUFBLFFBQUEsY0FBQTtDQUNBLFFBQUEsT0FBQSxlQUFBO0NBQ0EsUUFBQSxPQUFBLGdCQUFBLENBQUEsYUFBQSxhQUFBO0NBQ0EsUUFBQSxPQUFBLGtCQUFBLENBQUE7Q0FDQSxRQUFBLE9BQUEsY0FBQTs7OztBQ25CQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsY0FBQSxnREFBQSxTQUFBLGdCQUFBLG1CQUFBOztFQUVBLElBQUEsVUFBQSxTQUFBLFNBQUE7R0FDQSxPQUFBLGdCQUFBLFdBQUEsTUFBQSxXQUFBOzs7RUFHQSxtQkFBQSxVQUFBOztFQUVBO0lBQ0EsTUFBQSxPQUFBO0lBQ0EsVUFBQTtJQUNBLE9BQUE7Ozs7S0FJQSxRQUFBO01BQ0EsYUFBQSxRQUFBOztLQUVBLE1BQUE7OztJQUdBLE1BQUEsV0FBQTtJQUNBLEtBQUE7SUFDQSxPQUFBO0tBQ0EsU0FBQTtNQUNBLGFBQUEsUUFBQTtNQUNBLFlBQUE7TUFDQSxRQUFBO09BQ0EscUJBQUEsU0FBQSxZQUFBO1FBQ0EsT0FBQSxZQUFBLE9BQUE7Ozs7S0FJQSxPQUFBO01BQ0EsYUFBQSxRQUFBOzs7O0lBSUEsTUFBQSxtQkFBQTtJQUNBLEtBQUE7O0lBRUEsTUFBQSxpQkFBQTtJQUNBLEtBQUE7SUFDQSxNQUFBLENBQUEsVUFBQTtJQUNBLE9BQUE7S0FDQSxTQUFBO01BQ0EsYUFBQSxRQUFBOztLQUVBLE1BQUE7Ozs7Ozs7OztBQ25EQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsY0FBQSxtQkFBQSxTQUFBLFdBQUE7RUFDQSxXQUFBLElBQUEscUJBQUEsU0FBQSxPQUFBLFFBQUE7R0FDQSxJQUFBLFFBQUEsUUFBQSxRQUFBLEtBQUEsU0FBQTtJQUNBLFdBQUEsZUFBQSxRQUFBLEtBQUE7O0lBRUEsV0FBQSxpQkFBQTs7RUFFQSxXQUFBLElBQUEsdUJBQUEsU0FBQSxPQUFBLFFBQUE7SUFDQSxXQUFBLGlCQUFBOzs7Ozs7QUNYQSxDQUFBLFdBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsY0FBQSx5QkFBQSxVQUFBLGNBQUE7OztRQUdBLGNBQUEsV0FBQTs7Ozs7QUNOQSxDQUFBLFdBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsY0FBQSxpQ0FBQSxVQUFBLHNCQUFBO0VBQ0Esc0JBQUEsaUJBQUE7Ozs7O0FDSkEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGNBQUEsZ0NBQUEsU0FBQSxxQkFBQTtFQUNBO0dBQ0EsV0FBQTs7Ozs7QUNMQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsY0FBQSw4QkFBQSxTQUFBLG9CQUFBOztFQUVBLG1CQUFBLE1BQUE7R0FDQSxlQUFBO0dBQ0EsY0FBQTtHQUNBLFlBQUE7Ozs7O0FDUkEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGVBQUEsUUFBQSxjQUFBLFVBQUE7RUFDQSxPQUFBLFNBQUEsT0FBQSxLQUFBO0dBQ0EsT0FBQSxDQUFBLENBQUEsQ0FBQSxTQUFBLE1BQUEsUUFBQSxzQkFBQSxTQUFBLElBQUE7SUFDQSxPQUFBLElBQUEsT0FBQSxHQUFBLGdCQUFBLElBQUEsT0FBQSxHQUFBO1FBQ0E7Ozs7O0FDUEEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGVBQUEsUUFBQSxpQkFBQSxVQUFBO0VBQ0EsT0FBQSxTQUFBLFNBQUEsS0FBQTtHQUNBLEtBQUEsQ0FBQSxLQUFBO0lBQ0EsT0FBQTs7R0FFQSxJQUFBLFFBQUEsSUFBQSxNQUFBO0dBQ0EsS0FBQSxJQUFBLEVBQUEsR0FBQSxFQUFBLE1BQUEsUUFBQSxLQUFBO0lBQ0EsTUFBQSxLQUFBLE1BQUEsR0FBQSxPQUFBLEdBQUEsZ0JBQUEsTUFBQSxHQUFBLE1BQUE7O0dBRUEsT0FBQSxNQUFBLEtBQUE7Ozs7QUNaQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsZUFBQSxRQUFBLHNCQUFBLFVBQUEsTUFBQTtFQUNBLE9BQUEsVUFBQSxNQUFBO0dBQ0EsT0FBQSxLQUFBLFlBQUE7Ozs7QUNMQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsZUFBQSxPQUFBLFdBQUEsV0FBQTtFQUNBLE9BQUEsVUFBQSxRQUFBO0dBQ0EsS0FBQSxDQUFBLE9BQUE7SUFDQSxPQUFBOztHQUVBLE9BQUEsTUFBQSxVQUFBLEdBQUEsR0FBQSxnQkFBQSxNQUFBLFVBQUE7Ozs7OztBQ1JBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxnQkFBQSxRQUFBLGVBQUE7SUFDQSxZQUFBLFVBQUEsQ0FBQTs7SUFFQSxTQUFBLFlBQUEsWUFBQTtRQUNBLE9BQUE7VUFDQSxRQUFBO1VBQ0EsUUFBQTs7O1FBR0EsU0FBQSxPQUFBLE1BQUE7VUFDQSxJQUFBLE9BQUEsWUFBQSxJQUFBLE9BQUE7WUFDQSxLQUFBLEtBQUEsVUFBQSxJQUFBLFVBQUE7Y0FDQSxNQUFBOztZQUVBLE9BQUE7O1FBRUEsU0FBQSxPQUFBLE9BQUEsR0FBQTtVQUNBLE9BQUEsWUFBQSxJQUFBLE9BQUEsSUFBQTs7Ozs7O0FDcEJBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxnQkFBQSxRQUFBLGdCQUFBLFVBQUE7UUFDQSxPQUFBO1VBQ0EsUUFBQSxVQUFBO1lBQ0EsT0FBQTtZQUNBLEtBQUE7WUFDQSxXQUFBO1lBQ0EsT0FBQTtZQUNBLGNBQUE7WUFDQSxXQUFBO1lBQ0Esa0JBQUE7WUFDQSxtQkFBQTtZQUNBLGFBQUE7WUFDQSxvQkFBQTtZQUNBLHFCQUFBO2VBQ0EsT0FBQTtlQUNBLEtBQUE7ZUFDQSxhQUFBO2VBQ0EsU0FBQTtlQUNBLFNBQUEsQ0FBQTthQUNBLGFBQUE7YUFDQSxPQUFBO2FBQ0EsTUFBQSxDQUFBLEdBQUE7YUFDQSxLQUFBO2FBQ0EsTUFBQTthQUNBLFNBQUEsQ0FBQTtjQUNBLFlBQUE7Y0FDQSxNQUFBO2NBQ0EsTUFBQTtjQUNBLFNBQUE7Y0FDQSxPQUFBO2NBQ0EsU0FBQSxDQUFBO2VBQ0EsYUFBQTtlQUNBLE1BQUE7cUJBQ0EsS0FBQTtlQUNBLEtBQUE7ZUFDQSxNQUFBO2VBQ0EsWUFBQTs7ZUFFQTtjQUNBLFlBQUE7Y0FDQSxNQUFBO2NBQ0EsT0FBQTtjQUNBLE1BQUE7Y0FDQSxTQUFBO2NBQ0EsU0FBQSxDQUFBO2VBQ0EsYUFBQTtlQUNBLE1BQUE7cUJBQ0EsS0FBQTtlQUNBLEtBQUE7ZUFDQSxNQUFBO2VBQ0EsWUFBQTtnQkFDQTtlQUNBLGFBQUE7ZUFDQSxNQUFBO3FCQUNBLEtBQUE7ZUFDQSxLQUFBO2VBQ0EsTUFBQTtlQUNBLFlBQUE7Z0JBQ0E7ZUFDQSxhQUFBO2VBQ0EsTUFBQTtxQkFDQSxLQUFBO2VBQ0EsS0FBQTtlQUNBLE1BQUE7ZUFDQSxZQUFBOztlQUVBO2NBQ0EsWUFBQTtjQUNBLE1BQUE7Y0FDQSxPQUFBO2NBQ0EsTUFBQTtjQUNBLFNBQUE7Y0FDQSxTQUFBLENBQUE7Y0FDQSxhQUFBO2NBQ0EsTUFBQTtvQkFDQSxLQUFBO2NBQ0EsS0FBQTtjQUNBLE1BQUE7Y0FDQSxZQUFBO2VBQ0E7Y0FDQSxhQUFBO2NBQ0EsTUFBQTtvQkFDQSxLQUFBO2NBQ0EsS0FBQTtjQUNBLE1BQUE7Y0FDQSxZQUFBOzs7Y0FHQTthQUNBLGFBQUE7YUFDQSxPQUFBO2FBQ0EsTUFBQSxDQUFBLEdBQUE7YUFDQSxLQUFBO2FBQ0EsTUFBQTthQUNBLFNBQUEsQ0FBQTtjQUNBLFlBQUE7Y0FDQSxNQUFBO2NBQ0EsT0FBQTtjQUNBLE1BQUE7Y0FDQSxTQUFBO2NBQ0EsU0FBQSxDQUFBO2VBQ0EsYUFBQTtlQUNBLE1BQUE7cUJBQ0EsS0FBQTtlQUNBLEtBQUE7ZUFDQSxNQUFBO2VBQ0EsWUFBQTs7ZUFFQTtjQUNBLFlBQUE7Y0FDQSxNQUFBO2NBQ0EsT0FBQTtjQUNBLE1BQUE7Y0FDQSxTQUFBO2NBQ0EsU0FBQSxDQUFBO2VBQ0EsYUFBQTtlQUNBLE1BQUE7cUJBQ0EsS0FBQTtlQUNBLEtBQUE7ZUFDQSxNQUFBO2VBQ0EsWUFBQTtnQkFDQTtlQUNBLGFBQUE7ZUFDQSxNQUFBO3FCQUNBLEtBQUE7ZUFDQSxLQUFBO2VBQ0EsTUFBQTtlQUNBLFlBQUE7O2VBRUE7Y0FDQSxZQUFBO2NBQ0EsTUFBQTtjQUNBLE9BQUE7Y0FDQSxNQUFBO2NBQ0EsU0FBQTtjQUNBLFNBQUEsQ0FBQTtlQUNBLGFBQUE7ZUFDQSxNQUFBO3FCQUNBLEtBQUE7ZUFDQSxLQUFBO2VBQ0EsTUFBQTtlQUNBLFlBQUE7O2VBRUE7Y0FDQSxZQUFBO2NBQ0EsTUFBQTtjQUNBLE9BQUE7Y0FDQSxNQUFBO2NBQ0EsU0FBQTtjQUNBLFNBQUEsQ0FBQTtlQUNBLGFBQUE7ZUFDQSxNQUFBO3FCQUNBLEtBQUE7ZUFDQSxLQUFBO2VBQ0EsTUFBQTtlQUNBLFlBQUE7Z0JBQ0E7ZUFDQSxhQUFBO2VBQ0EsTUFBQTtxQkFDQSxLQUFBO2VBQ0EsS0FBQTtlQUNBLE1BQUE7ZUFDQSxZQUFBOztlQUVBO2NBQ0EsWUFBQTtjQUNBLE1BQUE7Y0FDQSxPQUFBO2NBQ0EsTUFBQTtjQUNBLFNBQUE7Y0FDQSxTQUFBLENBQUE7ZUFDQSxhQUFBO2VBQ0EsTUFBQTtxQkFDQSxLQUFBO2VBQ0EsS0FBQTtlQUNBLE1BQUE7ZUFDQSxZQUFBO2dCQUNBO2VBQ0EsYUFBQTtlQUNBLE1BQUE7cUJBQ0EsS0FBQTtlQUNBLEtBQUE7ZUFDQSxNQUFBO2VBQ0EsWUFBQTtnQkFDQTtlQUNBLGFBQUE7ZUFDQSxNQUFBO3FCQUNBLEtBQUE7ZUFDQSxLQUFBO2VBQ0EsTUFBQTtlQUNBLFlBQUE7Z0JBQ0E7ZUFDQSxhQUFBO2VBQ0EsTUFBQTtxQkFDQSxLQUFBO2VBQ0EsS0FBQTtlQUNBLE1BQUE7ZUFDQSxZQUFBOztlQUVBO2NBQ0EsWUFBQTtjQUNBLE1BQUE7Y0FDQSxPQUFBO2NBQ0EsTUFBQTtjQUNBLFNBQUE7Y0FDQSxTQUFBLENBQUE7ZUFDQSxhQUFBO2VBQ0EsTUFBQTtxQkFDQSxLQUFBO2VBQ0EsS0FBQTtlQUNBLE1BQUE7ZUFDQSxZQUFBO2dCQUNBO2VBQ0EsYUFBQTtlQUNBLE1BQUE7cUJBQ0EsS0FBQTtlQUNBLEtBQUE7ZUFDQSxNQUFBO2VBQ0EsWUFBQTtnQkFDQTtlQUNBLGFBQUE7ZUFDQSxNQUFBO3FCQUNBLEtBQUE7ZUFDQSxLQUFBO2VBQ0EsTUFBQTtlQUNBLFlBQUE7Ozs7Ozs7Ozs7O0FDcE9BLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxnQkFBQSxRQUFBLDhCQUFBLFNBQUEsWUFBQTs7UUFFQSxJQUFBLFVBQUE7UUFDQSxPQUFBO1VBQ0EsZ0JBQUEsU0FBQSxLQUFBO1lBQ0EsVUFBQTs7VUFFQSxnQkFBQSxVQUFBO1lBQ0EsT0FBQTs7Ozs7OztBQ1hBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxnQkFBQSxRQUFBLCtCQUFBLFNBQUEsVUFBQTs7RUFFQSxPQUFBO0dBQ0EsY0FBQSxTQUFBLFVBQUEsT0FBQTs7SUFFQSxJQUFBLFVBQUE7S0FDQSxhQUFBLG9CQUFBLFdBQUEsTUFBQSxXQUFBOzs7SUFHQSxJQUFBLE9BQUE7S0FDQSxRQUFBLFFBQUEsT0FBQTs7O0lBR0EsT0FBQSxVQUFBLEtBQUE7OztHQUdBLE1BQUEsVUFBQTtJQUNBLE9BQUEsVUFBQTs7O0dBR0EsT0FBQSxTQUFBLE9BQUEsUUFBQTtJQUNBLFVBQUE7S0FDQSxVQUFBO09BQ0EsTUFBQTtPQUNBLFFBQUE7T0FDQSxHQUFBOzs7Ozs7QUM1QkEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGdCQUFBLFFBQUEsNkJBQUEsU0FBQSxTQUFBOztFQUVBLElBQUEsUUFBQTtHQUNBLFdBQUE7R0FDQSxTQUFBOztFQUVBLE9BQUE7R0FDQSxNQUFBLFNBQUEsUUFBQTtJQUNBLElBQUEsQ0FBQSxRQUFBO0tBQ0EsT0FBQTs7O0lBR0EsT0FBQSxTQUFBO0tBQ0EsU0FBQTtPQUNBLFFBQUE7T0FDQSxTQUFBO09BQ0EsT0FBQTtPQUNBLFVBQUE7OztHQUdBLE9BQUEsU0FBQSxRQUFBO0lBQ0EsSUFBQSxDQUFBLFFBQUE7S0FDQSxPQUFBOzs7SUFHQSxPQUFBLFNBQUE7S0FDQSxTQUFBO09BQ0EsUUFBQTtPQUNBLFNBQUE7T0FDQSxNQUFBO09BQ0EsT0FBQTtPQUNBLFVBQUE7Ozs7Ozs7QUNsQ0EsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsMkNBQUEsU0FBQSxRQUFBLGNBQUE7RUFDQSxPQUFBLGNBQUEsVUFBQTtHQUNBLGNBQUEsTUFBQSwwQkFBQTs7O0VBR0EsT0FBQSxlQUFBLFVBQUE7R0FDQSxjQUFBLGFBQUEsYUFBQTs7Ozs7O0FDVEEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsY0FBQSxVQUFBOzs7Ozs7QUNIQSxDQUFBLFlBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSwrSEFBQSxVQUFBLE9BQUEsUUFBQSxVQUFBLGNBQUEsY0FBQSxLQUFBLGFBQUEsYUFBQSxZQUFBOztFQUVBLE9BQUEsVUFBQTtFQUNBLE9BQUEsVUFBQTtHQUNBLGFBQUE7R0FDQSxNQUFBLENBQUE7SUFDQSxRQUFBLENBQUEsR0FBQSxPQUFBLEVBQUE7SUFDQSxPQUFBO0lBQ0EsTUFBQTs7R0FFQSxPQUFBLENBQUE7SUFDQSxRQUFBLENBQUEsR0FBQSxPQUFBLEVBQUE7SUFDQSxPQUFBO0lBQ0EsTUFBQTs7O0VBR0EsT0FBQSxZQUFBO0VBQ0EsT0FBQSxlQUFBO0VBQ0EsT0FBQSxZQUFBLGFBQUE7RUFDQSxPQUFBLE1BQUE7RUFDQSxPQUFBLFlBQUE7RUFDQSxPQUFBLFVBQUE7RUFDQSxPQUFBLE9BQUE7RUFDQSxPQUFBLFlBQUE7RUFDQSxPQUFBLFNBQUE7R0FDQSxRQUFBO0dBQ0EsVUFBQTs7RUFFQSxPQUFBLGlCQUFBLFNBQUEsUUFBQTtHQUNBLEdBQUEsV0FBQSxNQUFBLE9BQUEsY0FBQSxHQUFBO0lBQ0EsT0FBQSxhQUFBOztPQUVBO0tBQ0EsT0FBQSxhQUFBOztHQUVBLE9BQUEsZUFBQSxPQUFBLGFBQUEsaUJBQUE7O0VBRUEsT0FBQSxXQUFBLFNBQUEsSUFBQTtHQUNBLFFBQUEsUUFBQSxPQUFBLEtBQUEsU0FBQSxJQUFBO0lBQ0EsR0FBQSxJQUFBLE9BQUEsSUFBQTtLQUNBLE9BQUEsVUFBQTs7OztFQUlBLE9BQUEsTUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7OztFQW1CQSxPQUFBLFdBQUEsU0FBQSxLQUFBO0dBQ0EsT0FBQSxXQUFBLGVBQUE7OztFQUdBLE9BQUEsYUFBQSxZQUFBO0dBQ0EsT0FBQSxZQUFBLENBQUEsT0FBQTtHQUNBLE9BQUEsWUFBQSxPQUFBLGFBQUEsT0FBQSxpQkFBQTs7RUFFQSxPQUFBLGFBQUEsVUFBQSxLQUFBO0dBQ0EsT0FBQSxVQUFBOztFQUVBLE9BQUEsVUFBQSxVQUFBLEtBQUE7R0FDQSxPQUFBLE9BQUEsSUFBQSxRQUFBLE9BQUE7O0VBRUEsT0FBQSxhQUFBLFVBQUE7SUFDQSxPQUFBLFFBQUEsY0FBQTtJQUNBLE9BQUEsT0FBQSxDQUFBLE9BQUE7O0VBRUEsT0FBQSxnQkFBQSxZQUFBO0dBQ0EsT0FBQSxPQUFBLFVBQUEsQ0FBQSxPQUFBOztFQUVBLE9BQUEsbUJBQUEsVUFBQTtHQUNBLE9BQUEsUUFBQSxZQUFBLENBQUEsT0FBQTtHQUNBLE9BQUEsUUFBQSxTQUFBLENBQUEsT0FBQSxRQUFBO0dBQ0EsR0FBQSxPQUFBLFFBQUEsT0FBQTtJQUNBLFNBQUEsVUFBQTtLQUNBLElBQUEsVUFBQSxTQUFBLGVBQUE7S0FDQSxhQUFBLFFBQUEsQ0FBQSxPQUFBLEtBQUEsU0FBQTs7Ozs7RUFLQSxPQUFBLHFCQUFBLFNBQUEsUUFBQTtHQUNBLElBQUEsUUFBQTtHQUNBLFFBQUEsUUFBQSxPQUFBLFFBQUEsV0FBQSxTQUFBLEtBQUEsSUFBQTtLQUNBLEdBQUEsV0FBQSxJQUFBO01BQ0EsT0FBQSxRQUFBLFVBQUEsT0FBQSxLQUFBO01BQ0EsUUFBQTs7O0dBR0EsR0FBQSxDQUFBLE1BQUE7SUFDQSxPQUFBLFFBQUEsVUFBQSxLQUFBO0lBQ0E7R0FDQSxPQUFBLENBQUE7O0VBRUEsT0FBQSxZQUFBLFlBQUE7R0FDQSxJQUFBLENBQUEsT0FBQSxTQUFBO0lBQ0EsT0FBQTs7R0FFQSxPQUFBLENBQUEsT0FBQSxRQUFBLFFBQUEsSUFBQSxJQUFBLE9BQUEsUUFBQSxRQUFBLE9BQUEsUUFBQSxTQUFBLElBQUEsT0FBQSxRQUFBLE9BQUEsT0FBQSxRQUFBLE9BQUEsS0FBQTs7O0VBR0EsT0FBQSxjQUFBLFlBQUE7R0FDQSxJQUFBLENBQUEsT0FBQSxTQUFBO0lBQ0EsT0FBQTs7R0FFQSxPQUFBLE9BQUEsUUFBQSxpQkFBQSxJQUFBLGtCQUFBOzs7RUFHQSxPQUFBLE9BQUEsV0FBQSxVQUFBLFNBQUEsU0FBQTtHQUNBLElBQUEsWUFBQSxTQUFBO0lBQ0E7OztHQUdBLEdBQUEsUUFBQSxJQUFBO0lBQ0EsR0FBQSxPQUFBLFFBQUEsT0FBQTtLQUNBLE9BQUEsbUJBQUE7O1FBRUE7S0FDQSxPQUFBLEdBQUEsb0JBQUEsQ0FBQSxLQUFBLFFBQUE7Ozs7T0FJQTtJQUNBLE9BQUEsR0FBQTs7O0VBR0EsT0FBQSxPQUFBLHVCQUFBLFNBQUEsR0FBQSxFQUFBO0lBQ0EsR0FBQSxNQUFBLEVBQUE7S0FDQTs7SUFFQSxHQUFBO0lBQ0EsYUFBQSxFQUFBO1NBQ0E7S0FDQSxhQUFBO0tBQ0E7SUFDQSxPQUFBLFVBQUEsU0FBQTs7RUFFQSxPQUFBLElBQUEsdUJBQUEsU0FBQSxPQUFBLFNBQUEsU0FBQTs7R0FFQSxHQUFBLFFBQUEsUUFBQSxtQkFBQTtJQUNBLE9BQUEsVUFBQSxTQUFBO0lBQ0EsWUFBQSxPQUFBLFdBQUEsU0FBQSxNQUFBLEtBQUEsVUFBQSxNQUFBO0tBQ0EsT0FBQSxVQUFBOzs7T0FHQTtJQUNBLE9BQUEsVUFBQSxPQUFBLFVBQUE7SUFDQSxPQUFBLFVBQUE7OztFQUdBLElBQUEsa0JBQUEsVUFBQSxNQUFBO0dBQ0EsSUFBQSxTQUFBO0dBQ0EsUUFBQSxRQUFBLE9BQUEsS0FBQSxVQUFBLEtBQUE7SUFDQSxJQUFBLElBQUEsV0FBQSxNQUFBO0tBQ0EsU0FBQTs7O0dBR0EsT0FBQTs7RUFFQSxJQUFBLGlCQUFBLFVBQUEsS0FBQTtHQUNBLElBQUEsU0FBQTtHQUNBLFFBQUEsUUFBQSxPQUFBLEtBQUEsVUFBQSxLQUFBO0lBQ0EsSUFBQSxJQUFBLE9BQUEsS0FBQTtLQUNBLFNBQUE7OztHQUdBLE9BQUE7O0VBRUEsSUFBQSxlQUFBLFVBQUEsUUFBQTtHQUNBLE9BQUEsU0FBQSxTQUFBLGNBQUE7R0FDQSxPQUFBLE9BQUEsUUFBQTtHQUNBLE9BQUEsT0FBQSxTQUFBO0dBQ0EsT0FBQSxNQUFBLE9BQUEsT0FBQSxXQUFBO0dBQ0EsSUFBQSxXQUFBLE9BQUEsSUFBQSxxQkFBQSxHQUFBLEdBQUEsS0FBQTtHQUNBLFNBQUEsYUFBQSxHQUFBO0dBQ0EsU0FBQSxhQUFBLE1BQUE7R0FDQSxTQUFBLGFBQUEsR0FBQTtHQUNBLE9BQUEsSUFBQSxZQUFBO0dBQ0EsT0FBQSxJQUFBLFNBQUEsR0FBQSxHQUFBLEtBQUE7R0FDQSxPQUFBLFVBQUEsT0FBQSxJQUFBLGFBQUEsR0FBQSxHQUFBLEtBQUEsR0FBQTtHQUNBLFNBQUEscUJBQUEsUUFBQSxHQUFBLFlBQUEsT0FBQTs7RUFFQSxJQUFBLGVBQUEsU0FBQSxNQUFBO0dBQ0EsSUFBQSxXQUFBLE9BQUEsSUFBQSxxQkFBQSxHQUFBLEdBQUEsS0FBQTtHQUNBLFNBQUEsYUFBQSxHQUFBO0dBQ0EsU0FBQSxhQUFBLE1BQUE7R0FDQSxTQUFBLGFBQUEsR0FBQTtHQUNBLE9BQUEsSUFBQSxZQUFBO0dBQ0EsT0FBQSxJQUFBLFNBQUEsR0FBQSxHQUFBLEtBQUE7R0FDQSxPQUFBLFVBQUEsT0FBQSxJQUFBLGFBQUEsR0FBQSxHQUFBLEtBQUEsR0FBQTs7RUFFQTs7RUFFQSxJQUFBLGlCQUFBLFVBQUEsU0FBQTtHQUNBLElBQUEsUUFBQTtHQUNBLElBQUEsTUFBQSxRQUFBLFdBQUE7R0FDQSxRQUFBLElBQUE7R0FDQSxJQUFBLFNBQUEsZUFBQTtHQUNBLElBQUEsUUFBQSxPQUFBLFFBQUEsWUFBQSxRQUFBO0dBQ0EsSUFBQSxPQUFBLFFBQUE7R0FDQSxRQUFBO0dBQ0EsS0FBQTtJQUNBLE1BQUEsUUFBQTtJQUNBLE1BQUEsU0FBQTtJQUNBLE1BQUEsV0FBQTtLQUNBLE9BQUE7S0FDQSxRQUFBOztJQUVBO0dBQ0EsS0FBQTtJQUNBLE1BQUEsUUFBQTtJQUNBLE1BQUEsT0FBQTtJQUNBLE1BQUEsV0FBQTtLQUNBLE9BQUE7S0FDQSxNQUFBOztJQUVBO0dBQ0EsS0FBQTtJQUNBLElBQUEsT0FBQSxRQUFBO0tBQ0EsSUFBQSxXQUFBLFNBQUEsTUFBQSxNQUFBLE9BQUEsVUFBQTtLQUNBLElBQUEsUUFBQSxVQUFBLE9BQUEsUUFBQSxZQUFBLE9BQUEsT0FBQSxRQUFBLFdBQUEsS0FBQSxPQUFBLE9BQUEsUUFBQSxXQUFBLEtBQUEsTUFBQSxPQUFBLFFBQUEsV0FBQSxLQUFBO0tBQ0EsTUFBQSxRQUFBO0tBQ0EsTUFBQSxVQUFBO01BQ0EsT0FBQTtNQUNBLE1BQUE7O0tBRUEsTUFBQSxXQUFBO01BQ0EsT0FBQTtNQUNBLFNBQUE7T0FDQSxPQUFBO09BQ0EsTUFBQTs7O0tBR0E7V0FDQTtLQUNBLE1BQUEsUUFBQTtLQUNBLE1BQUEsVUFBQTtNQUNBLE9BQUE7TUFDQSxNQUFBOzs7Ozs7R0FNQSxNQUFBLGFBQUEsVUFBQSxZQUFBO0lBQ0EsSUFBQSxLQUFBLFdBQUE7Ozs7O0dBS0EsTUFBQSxjQUFBLFVBQUEsWUFBQSxVQUFBO0lBQ0EsSUFBQSxRQUFBO0tBQ0EsTUFBQSxRQUFBLFdBQUE7S0FDQSxVQUFBLENBQUEsSUFBQTtLQUNBLFVBQUE7S0FDQSxrQkFBQTs7SUFFQSxPQUFBOzs7O0dBSUEsT0FBQTs7O0VBR0EsT0FBQSxnQkFBQSxZQUFBO0dBQ0EsWUFBQSxPQUFBLE9BQUEsS0FBQSxVQUFBLEtBQUE7SUFDQSxJQUFBLFNBQUE7OztJQUdBLElBQUEsUUFBQTtJQUNBLElBQUEsS0FBQTtJQUNBLElBQUEsU0FBQTtJQUNBLElBQUEsTUFBQTtJQUNBLElBQUEsT0FBQSxvR0FBQTtJQUNBLE9BQUEsWUFBQSxJQUFBLEVBQUEsVUFBQSxVQUFBO0tBQ0EsS0FBQTtLQUNBLE9BQUE7S0FDQSxTQUFBO0tBQ0EsaUJBQUEsQ0FBQTs7S0FFQSxTQUFBLFVBQUEsS0FBQSxHQUFBOzs7TUFHQSxJQUFBLElBQUEsSUFBQSxRQUFBLE9BQUEsS0FBQSxJQUFBLFFBQUEsU0FBQSxJQUFBLFFBQUE7TUFDQSxJQUFBLElBQUEsSUFBQSxRQUFBLE9BQUEsSUFBQSxJQUFBLFFBQUEsU0FBQSxJQUFBLFFBQUE7TUFDQSxJQUFBLE9BQUEsUUFBQSxXQUFBLElBQUEsUUFBQSxXQUFBLE9BQUE7T0FDQSxJQUFBLE1BQUEsSUFBQTtPQUNBLElBQUEsTUFBQSxJQUFBLEVBQUEsTUFBQSxDQUFBLElBQUE7Ozs7Ozs7TUFPQSxPQUFBLFVBQUEsZUFBQSxJQUFBLFFBQUEsV0FBQTs7S0FFQSxzQkFBQSxVQUFBLFNBQUE7O01BRUEsT0FBQSxRQUFBLFdBQUE7O0tBRUEsUUFBQSxVQUFBLFNBQUEsU0FBQTs7TUFFQSxJQUFBLFFBQUEsTUFBQSxTQUFBLFdBQUEsUUFBQSxNQUFBLFNBQUEsd0JBQUE7O09BRUEsSUFBQSxRQUFBLFdBQUEsZUFBQSxLQUFBLFFBQUEsV0FBQSxlQUFBLEtBQUEsUUFBQSxXQUFBLGVBQUEsR0FBQTtRQUNBLE9BQUE7Y0FDQTtRQUNBLE9BQUE7Ozs7TUFJQSxPQUFBOzs7S0FHQSxPQUFBOzs7S0FHQSxXQUFBLFVBQUEsV0FBQTtNQUNBLElBQUEsVUFBQSxRQUFBLFlBQUEsQ0FBQSxHQUFBO09BQ0EsT0FBQSxVQUFBLFFBQUEsVUFBQTs7TUFFQSxPQUFBLFlBQUE7Ozs7SUFJQSxNQUFBLFlBQUEsT0FBQTtJQUNBLElBQUEsU0FBQSxPQUFBOzs7RUFHQSxPQUFBOzs7O0FDMVZBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLGtCQUFBLFVBQUE7Ozs7OztBQ0hBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLHVDQUFBLFNBQUEsUUFBQSxXQUFBOztFQUVBLE9BQUEsT0FBQSxVQUFBO0dBQ0EsT0FBQSxXQUFBO0tBQ0EsU0FBQSxRQUFBO0dBQ0EsT0FBQSxlQUFBLFdBQUE7Ozs7Ozs7QUNSQSxDQUFBLFlBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSwrQkFBQSxVQUFBLFdBQUE7RUFDQSxLQUFBLFdBQUE7R0FDQSxhQUFBO0dBQ0EsV0FBQTtHQUNBLHlCQUFBO0dBQ0Esa0JBQUE7OztFQUdBLEtBQUEsZUFBQSxVQUFBLE1BQUEsSUFBQTtHQUNBLFVBQUEsS0FBQSxVQUFBO0tBQ0EsTUFBQTtLQUNBLFFBQUEsd0JBQUEsT0FBQTtLQUNBLEdBQUE7S0FDQSxZQUFBOzs7O0lBSUEsS0FBQSxnQkFBQSxXQUFBO0dBQ0EsVUFBQSxLQUFBOztLQUVBLGFBQUE7U0FDQSxrQkFBQTs7S0FFQSxLQUFBLFVBQUEsUUFBQTs7T0FFQSxZQUFBOzs7Ozs7Ozs7O0FDNUJBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLGtEQUFBLFNBQUEsUUFBQSxPQUFBLFlBQUE7O0VBRUEsSUFBQSxjQUFBOztFQUVBLE9BQUEsZUFBQSxVQUFBOztHQUVBLE1BQUEsTUFBQSxhQUFBLEtBQUEsVUFBQSxLQUFBOzs7Ozs7OztFQVFBLE9BQUEsVUFBQSxVQUFBO0dBQ0EsWUFBQSxJQUFBLHFCQUFBLE1BQUEsS0FBQSxVQUFBLFNBQUE7O01BRUEsVUFBQSxNQUFBOzs7Ozs7Ozs7QUNwQkEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsaUdBQUEsU0FBQSxRQUFBLFVBQUEsV0FBQSxXQUFBLGNBQUEsY0FBQTs7RUFFQSxPQUFBLGFBQUE7RUFDQSxPQUFBLE9BQUE7O0VBRUEsSUFBQSxRQUFBO0lBQ0EsVUFBQSxZQUFBLFdBQUEsU0FBQSxZQUFBLFlBQUEsV0FBQSxpQkFBQSxTQUFBO0lBQ0EsYUFBQSxvQkFBQSxhQUFBLE9BQUEsb0JBQUEsV0FBQSxvQkFBQSxXQUFBO0lBQ0Esc0JBQUEsU0FBQSxxQkFBQSxrQkFBQSxpQkFBQSxjQUFBLGNBQUE7SUFDQSxZQUFBLGtCQUFBLGFBQUEsZUFBQSxjQUFBLFdBQUEsT0FBQSx1QkFBQTtJQUNBLGFBQUEsUUFBQSxRQUFBLGFBQUEsV0FBQSxVQUFBLFNBQUEsZUFBQSxXQUFBLGVBQUE7SUFDQSxRQUFBLHlCQUFBLFFBQUEsZUFBQSxlQUFBLG1CQUFBLGFBQUE7SUFDQSxhQUFBLGlCQUFBLGVBQUEsV0FBQSxrQkFBQSxlQUFBO0lBQ0Esd0JBQUEsZ0JBQUEseUJBQUEsYUFBQSxlQUFBLGlCQUFBO0lBQ0EsUUFBQSxXQUFBLHNCQUFBLFNBQUEsV0FBQSxTQUFBLGNBQUEsUUFBQSxTQUFBLFNBQUE7SUFDQSxVQUFBLGtCQUFBLGNBQUEsZ0JBQUEsYUFBQSxTQUFBLG1CQUFBLFNBQUE7SUFDQSxtQkFBQSxjQUFBLGVBQUEsaUJBQUEsZUFBQSxjQUFBLFlBQUEsY0FBQTtJQUNBLFNBQUEsY0FBQSxhQUFBLFdBQUEsZ0JBQUEsYUFBQSxRQUFBLFNBQUEsUUFBQTtJQUNBLHNCQUFBLFlBQUEsVUFBQSxTQUFBOztHQUVBLFVBQUE7O0VBRUEsVUFBQSxVQUFBO0dBQ0EsT0FBQSxPQUFBLE1BQUEsRUFBQTtHQUNBLElBQUEsVUFBQSxJQUFBO0lBQ0EsVUFBQTs7S0FFQTs7Ozs7O0FDOUJBLENBQUEsV0FBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLGFBQUEsV0FBQTs7Ozs7O0FDSEEsQ0FBQSxZQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsc0ZBQUEsVUFBQSxRQUFBLFlBQUEsVUFBQSxZQUFBLGFBQUEsT0FBQTs7RUFFQSxJQUFBLFNBQUE7Ozs7Ozs7O0VBUUEsT0FBQSxTQUFBO0dBQ0EsS0FBQTtHQUNBLEtBQUE7R0FDQSxNQUFBOztFQUVBLE9BQUEsV0FBQTtHQUNBLGlCQUFBOztFQUVBLFFBQUEsT0FBQSxZQUFBO0dBQ0EsUUFBQTtJQUNBLEtBQUE7SUFDQSxLQUFBO0lBQ0EsTUFBQTs7R0FFQSxRQUFBO0lBQ0EsWUFBQTtLQUNBLEtBQUE7TUFDQSxNQUFBO01BQ0EsS0FBQSxrRkFBQTtNQUNBLE1BQUE7OztJQUdBLFVBQUE7S0FDQSxjQUFBO01BQ0EsTUFBQTtNQUNBLE1BQUE7TUFDQSxLQUFBO01BQ0EsU0FBQTs7Ozs7Ozs7Ozs7Ozs7OztFQWdCQSxPQUFBLFdBQUEsVUFBQSxJQUFBO0dBQ0EsSUFBQSxNQUFBLCtCQUFBO0dBQ0EsTUFBQSxJQUFBLEtBQUEsUUFBQSxVQUFBLEtBQUE7SUFDQSxPQUFBLFNBQUE7S0FDQSxLQUFBLElBQUE7S0FDQSxLQUFBLElBQUE7S0FDQSxNQUFBOztJQUVBLE9BQUEsS0FBQSxJQUFBOzs7OztFQUtBLE9BQUEsZ0JBQUE7RUFDQSxPQUFBLE9BQUE7RUFDQSxPQUFBLElBQUEsd0NBQUEsVUFBQSxPQUFBLGNBQUE7O0dBRUEsT0FBQSxnQkFBQSxhQUFBLEtBQUE7R0FDQSxPQUFBLE9BQUEsMkJBQUEsYUFBQSxLQUFBOzs7RUFHQSxPQUFBLElBQUEsdUNBQUEsVUFBQSxPQUFBLGNBQUE7R0FDQSxPQUFBLGdCQUFBO0dBQ0EsT0FBQSxPQUFBOztFQUVBLFdBQUEsZUFBQSxZQUFBLE9BQUE7Ozs7O0FDakZBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLFlBQUEsVUFBQTs7Ozs7O0FDSEEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsZUFBQSxVQUFBOzs7Ozs7QUNIQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSxvQ0FBQSxTQUFBLFFBQUEsT0FBQTs7Ozs7O0FDSEEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsaUJBQUEsVUFBQTs7Ozs7O0FDSEEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEseUNBQUEsU0FBQSxRQUFBLGFBQUE7O0VBRUEsT0FBQSxlQUFBLFVBQUE7R0FDQSxhQUFBLEtBQUE7OztFQUdBLE9BQUEsYUFBQSxVQUFBO0dBQ0EsYUFBQSxNQUFBOzs7Ozs7O0FDVkEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsMEJBQUEsVUFBQTs7Ozs7O0FDSEEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxRQUFBLG9CQUFBLFlBQUEsZUFBQSxVQUFBOzs7Ozs7QUNIQSxDQUFBLFlBQUE7Q0FDQTs7Q0FFQSxTQUFBLGNBQUEsV0FBQSxPQUFBO0VBQ0EsSUFBQSxZQUFBO0VBQ0EsSUFBQSxPQUFBLFNBQUEsZUFBQTtFQUNBLEdBQUEsUUFBQSxLQUFBO0dBQ0EsUUFBQSxRQUFBLFVBQUEsS0FBQSxRQUFBLE9BQUEsK0NBQUEsWUFBQTs7RUFFQTtFQUNBLFNBQUEsWUFBQSxTQUFBLE1BQUEsT0FBQSxTQUFBO0dBQ0EsUUFBQSxRQUFBLFNBQUEsY0FBQSxNQUFBLFlBQUEsS0FBQTtHQUNBLFFBQUEsUUFBQSxTQUFBLGNBQUEsTUFBQSxZQUFBLElBQUEsV0FBQTs7R0FFQSxPQUFBLGVBQUEsT0FBQSxNQUFBOztFQUVBLFNBQUEsY0FBQTtHQUNBLFFBQUEsUUFBQSxTQUFBLGNBQUEsTUFBQSxZQUFBLElBQUEsV0FBQTs7RUFFQSxTQUFBLGVBQUEsT0FBQSxHQUFBLFNBQUE7R0FDQSxJQUFBLE9BQUEsTUFBQTtHQUNBLElBQUEsVUFBQTtHQUNBLElBQUEsVUFBQTtHQUNBLElBQUEsTUFBQSxRQUFBLEtBQUEsT0FBQTtHQUNBLElBQUEsUUFBQSxPQUFBO0dBQ0EsSUFBQSxNQUFBLFFBQUEsUUFBQSxTQUFBLGNBQUEsT0FBQTtHQUNBLElBQUEsTUFBQSxTQUFBLGNBQUEsTUFBQTtHQUNBLElBQUEsUUFBQSxJQUFBLHdCQUFBLE1BQUEsRUFBQSxJQUFBLE1BQUE7R0FDQSxJQUFBLFNBQUEsSUFBQSx3QkFBQSxPQUFBLEVBQUEsSUFBQSxFQUFBLFNBQUE7R0FDQSxPQUFBLFFBQUEsUUFBQSxTQUFBLGNBQUEsT0FBQSxJQUFBLE9BQUEsUUFBQSxNQUFBLElBQUEsUUFBQSxTQUFBOztFQUVBLE9BQUE7R0FDQSxhQUFBO0dBQ0EsYUFBQTtHQUNBLGdCQUFBOzs7Q0FHQSxRQUFBLE9BQUEsa0JBQUEsVUFBQSx3QkFBQSxVQUFBLFVBQUE7RUFDQSxJQUFBO0VBQ0EsV0FBQSxZQUFBO0dBQ0EsT0FBQTtJQUNBLE9BQUE7SUFDQSxRQUFBO0lBQ0EsZ0JBQUE7SUFDQSxXQUFBO0lBQ0EsS0FBQTtJQUNBLE9BQUE7SUFDQSxRQUFBO0lBQ0EsU0FBQTtJQUNBLFNBQUE7SUFDQSxZQUFBLEdBQUEsTUFBQSxVQUFBLE9BQUEsQ0FBQSxNQUFBLE9BQUEsTUFBQSxDQUFBLFdBQUE7SUFDQSxZQUFBO0lBQ0EsY0FBQTtJQUNBLFVBQUE7SUFDQSxTQUFBLGNBQUEsbUJBQUE7OztFQUdBLE9BQUE7R0FDQSxVQUFBO0dBQ0EsT0FBQTtJQUNBLFdBQUE7SUFDQSxXQUFBO0lBQ0EsU0FBQTtJQUNBLFlBQUE7SUFDQSxTQUFBO0lBQ0EsU0FBQTs7R0FFQSxTQUFBO0dBQ0EsTUFBQSxVQUFBLE9BQUEsTUFBQSxPQUFBLFNBQUE7SUFDQSxJQUFBLFVBQUEsUUFBQSxPQUFBLFlBQUE7SUFDQSxJQUFBLFFBQUE7S0FDQSxRQUFBO0tBQ0EsU0FBQTs7SUFFQSxJQUFBLGFBQUEsR0FBQSxJQUFBLE1BQUEsV0FBQSxVQUFBLEdBQUE7S0FDQSxPQUFBLFNBQUEsRUFBQTs7O0lBR0EsUUFBQSxlQUFBLEdBQUEsTUFBQSxNQUFBLFNBQUEsS0FBQSxPQUFBLENBQUEsR0FBQSxhQUFBLE1BQUEsQ0FBQSxHQUFBO0lBQ0EsUUFBQSxTQUFBO0tBQ0EsR0FBQSxRQUFBLFFBQUE7S0FDQSxHQUFBLFFBQUEsU0FBQTs7SUFFQSxRQUFBLGNBQUE7S0FDQSxNQUFBO01BQ0EsR0FBQSxRQUFBLFFBQUE7TUFDQSxHQUFBLFFBQUEsVUFBQTtNQUNBLFFBQUE7O0tBRUEsTUFBQTtNQUNBLEdBQUEsUUFBQSxRQUFBO01BQ0EsR0FBQSxRQUFBLFVBQUE7TUFDQSxRQUFBOzs7SUFHQSxJQUFBLGVBQUEsWUFBQTs7O0tBR0EsUUFBQSxRQUFBLE1BQUEsU0FBQSxVQUFBLE9BQUE7TUFDQSxRQUFBLFFBQUEsTUFBQSxVQUFBLFVBQUEsTUFBQTs7T0FFQSxJQUFBLE1BQUEsVUFBQSxLQUFBLGNBQUE7UUFDQSxJQUFBLE9BQUE7U0FDQSxNQUFBLEtBQUE7U0FDQSxRQUFBLE1BQUEsVUFBQSxLQUFBLGVBQUEsTUFBQTtTQUNBLE9BQUEsTUFBQSxVQUFBLEtBQUEsZUFBQSxNQUFBO1NBQ0EsTUFBQSxLQUFBO1NBQ0EsT0FBQSxNQUFBLFlBQUEsVUFBQSxFQUFBO1NBQ0EsR0FBQSxRQUFBLE9BQUE7U0FDQSxHQUFBLFFBQUEsT0FBQTtTQUNBLE9BQUEsS0FBQTtTQUNBLE1BQUEsS0FBQTtTQUNBLFNBQUEsS0FBQTtTQUNBLE1BQUE7O1FBRUEsTUFBQSxLQUFBOzs7O0tBSUE7O0lBRUEsSUFBQSxnQkFBQSxVQUFBO0tBQ0EsU0FBQTtLQUNBLElBQUEsUUFBQTtLQUNBLFFBQUEsUUFBQSxPQUFBLFNBQUEsS0FBQTtPQUNBLElBQUEsU0FBQTtPQUNBLElBQUEsUUFBQTtPQUNBLFFBQUEsUUFBQSxRQUFBLFNBQUEsT0FBQSxNQUFBO1FBQ0EsR0FBQSxLQUFBLFNBQUEsTUFBQTtTQUNBLFNBQUE7OztPQUdBLEdBQUEsQ0FBQSxPQUFBO1FBQ0E7UUFDQSxPQUFBLEtBQUEsU0FBQTtTQUNBLEdBQUEsUUFBQSxRQUFBO1NBQ0EsR0FBQSxRQUFBLFFBQUEsS0FBQSxJQUFBO1NBQ0EsUUFBQTs7Ozs7S0FLQSxRQUFBLElBQUE7O0lBRUEsSUFBQSxhQUFBLFlBQUE7S0FDQSxRQUFBLFFBQUEsTUFBQSxLQUFBO0tBQ0EsUUFBQSxNQUFBLEdBQUEsT0FBQSxLQUFBLElBQUEsT0FBQSxPQUFBLEtBQUEsU0FBQSxRQUFBLE9BQUEsS0FBQSxVQUFBLFFBQUEsUUFBQSxLQUFBLE1BQUE7O0tBRUEsSUFBQSxDQUFBLFFBQUEsU0FBQTtNQUNBLElBQUEsS0FBQSxLQUFBO01BQ0EsSUFBQSxTQUFBLEdBQUEsSUFBQTtRQUNBLFlBQUE7UUFDQSxZQUFBO1FBQ0EsV0FBQSxDQUFBLE1BQUEsS0FBQTtRQUNBLFNBQUEsTUFBQSxLQUFBO01BQ0EsSUFBQSxZQUFBLEdBQUEsSUFBQTtRQUNBLFlBQUE7UUFDQSxZQUFBO1FBQ0EsV0FBQSxNQUFBLEtBQUE7UUFDQSxTQUFBLE9BQUEsS0FBQTs7TUFFQSxRQUFBLFNBQUEsUUFBQSxJQUFBLE9BQUE7UUFDQSxLQUFBLEtBQUE7UUFDQSxLQUFBLFFBQUE7UUFDQSxLQUFBLGFBQUE7TUFDQSxRQUFBLFlBQUEsUUFBQSxJQUFBLE9BQUE7UUFDQSxLQUFBLEtBQUE7UUFDQSxLQUFBLFFBQUE7UUFDQSxLQUFBLGFBQUE7O0tBRUEsUUFBQSxhQUFBLFFBQUEsSUFBQSxVQUFBLFVBQUEsS0FBQSxPQUFBLFFBQUEsT0FBQSxLQUFBLEtBQUEsYUFBQSxnQkFBQSxRQUFBLFFBQUEsS0FBQSxPQUFBLFFBQUEsU0FBQSxLQUFBLEtBQUEsS0FBQSxTQUFBOzs7Ozs7S0FNQSxRQUFBLFVBQUEsUUFBQSxXQUFBLE9BQUEsVUFBQSxLQUFBLEtBQUEsR0FBQSxLQUFBLFNBQUEsVUFBQSxHQUFBO01BQ0EsT0FBQSxFQUFBLFNBQUEsUUFBQSxXQUFBLEVBQUE7U0FDQSxLQUFBLGdCQUFBLEdBQUEsS0FBQSxVQUFBLFVBQUEsR0FBQTtNQUNBLE9BQUEsR0FBQSxJQUFBLFFBQUEsV0FBQSxFQUFBLFFBQUE7UUFDQSxLQUFBLE1BQUEsVUFBQSxHQUFBO01BQ0EsT0FBQSxZQUFBLEVBQUE7O0tBRUEsUUFBQSxRQUFBLFFBQUEsV0FBQSxPQUFBO09BQ0EsS0FBQSxlQUFBO09BQ0EsS0FBQSxhQUFBLFVBQUEsR0FBQTtPQUNBOztPQUVBLEtBQUEsZUFBQTtPQUNBLEtBQUEsUUFBQTtPQUNBLEtBQUEsVUFBQSxHQUFBO09BQ0EsT0FBQSxFQUFBOztLQUVBLFFBQUEsTUFBQSxHQUFBLGFBQUEsVUFBQSxHQUFBLEdBQUE7TUFDQSxPQUFBLGFBQUEsR0FBQSxHQUFBO1FBQ0EsR0FBQSxZQUFBLFVBQUEsR0FBQSxHQUFBO01BQ0EsT0FBQSxhQUFBLEdBQUEsR0FBQTtRQUNBLEdBQUEsU0FBQSxVQUFBLEdBQUEsR0FBQTtNQUNBLFFBQUEsY0FBQTtNQUNBLFFBQUE7O0tBRUEsUUFBQSxRQUFBLGFBQUEsU0FBQSxRQUFBLFVBQUEsS0FBQSxLQUFBLFVBQUEsR0FBQTtNQUNBLE9BQUEsRUFBQTs7S0FFQSxRQUFBLE1BQUEsYUFBQSxTQUFBLFFBQUEsVUFBQSxLQUFBLGFBQUEsVUFBQSxHQUFBO01BQ0EsT0FBQSxFQUFBLFNBQUEsT0FBQTtRQUNBLEtBQUEsS0FBQSxVQUFBLEdBQUE7TUFDQSxPQUFBLEVBQUEsU0FBQSxNQUFBOzs7SUFHQSxJQUFBLGFBQUEsWUFBQTs7S0FFQSxNQUFBLFFBQUEsVUFBQSxHQUFBLEdBQUE7TUFDQSxRQUFBLFFBQUEsYUFBQSxTQUFBLFFBQUEsVUFBQSxNQUFBLElBQUEsUUFBQTtRQUNBLEtBQUEsS0FBQSxVQUFBLEdBQUE7UUFDQSxFQUFBLFNBQUEsRUFBQSxRQUFBLE1BQUEsVUFBQSxFQUFBLFFBQUEsTUFBQTs7UUFFQSxPQUFBLE1BQUEsVUFBQSxFQUFBLFFBQUEsTUFBQTs7TUFFQSxRQUFBLE1BQUEsYUFBQSxTQUFBLFFBQUEsVUFBQSxNQUFBLElBQUEsUUFBQTtRQUNBLEtBQUEsYUFBQSxVQUFBLEdBQUE7UUFDQSxPQUFBLENBQUEsTUFBQSxVQUFBLEVBQUEsUUFBQSxNQUFBLGNBQUEsT0FBQTs7UUFFQSxLQUFBLEtBQUEsVUFBQSxHQUFBO1FBQ0EsT0FBQSxDQUFBLE1BQUEsVUFBQSxFQUFBLFFBQUEsTUFBQSxjQUFBLE1BQUE7Ozs7SUFJQSxJQUFBLFNBQUEsVUFBQSxHQUFBO0tBQ0EsT0FBQSxDQUFBLEtBQUEsSUFBQSxFQUFBLFFBQUEsT0FBQTs7SUFFQSxJQUFBLFFBQUEsWUFBQTtLQUNBLE9BQUEsUUFBQSxRQUFBLEdBQUEsT0FBQSxRQUFBLE1BQUEsT0FBQSxLQUFBLENBQUEsUUFBQSxPQUFBLFFBQUEsU0FBQSxNQUFBOztJQUVBLElBQUEsb0JBQUEsWUFBQTtLQUNBLFFBQUEsTUFBQSxRQUFBLFFBQUEsZ0JBQUEsT0FBQSxRQUFBLFNBQUEsS0FBQSxHQUFBLFFBQUEsVUFBQSxHQUFBO01BQ0EsT0FBQSxRQUFBLFFBQUEsS0FBQSxvQkFBQSxFQUFBLFFBQUEsS0FBQSxNQUFBLFVBQUEsR0FBQTtPQUNBLE9BQUEsRUFBQTtTQUNBLEtBQUEsTUFBQSxVQUFBLEdBQUE7T0FDQSxPQUFBLEVBQUE7OztLQUdBLFFBQUEsTUFBQTs7SUFFQSxJQUFBLGlCQUFBLFlBQUE7S0FDQSxRQUFBLE1BQUEsUUFBQSxRQUFBLGdCQUFBLE9BQUEsUUFBQSxTQUFBLEtBQUEsR0FBQSxRQUFBLFVBQUEsR0FBQTtNQUNBLFFBQUEsV0FBQSxLQUFBLGlCQUFBLEVBQUEsUUFBQSxLQUFBLGFBQUEsVUFBQSxHQUFBO09BQ0EsT0FBQSxlQUFBLEVBQUEsSUFBQSxNQUFBLEVBQUEsSUFBQTs7O0tBR0EsUUFBQSxNQUFBOztJQUVBLElBQUEsc0JBQUEsVUFBQSxPQUFBO0tBQ0EsT0FBQSxDQUFBLFVBQUEsT0FBQTtNQUNBLE9BQUEsVUFBQSxHQUFBO09BQ0EsRUFBQSxJQUFBLEVBQUEsSUFBQSxDQUFBLFFBQUEsT0FBQSxJQUFBLEVBQUEsTUFBQSxRQUFBLFNBQUEsUUFBQTtPQUNBLEVBQUEsSUFBQSxFQUFBLElBQUEsQ0FBQSxRQUFBLE9BQUEsSUFBQSxFQUFBLE1BQUEsUUFBQSxTQUFBLFFBQUE7O1FBRUE7O0lBRUEsSUFBQSxtQkFBQSxVQUFBLE9BQUE7S0FDQSxPQUFBLENBQUEsVUFBQSxPQUFBO01BQ0EsT0FBQSxVQUFBLEdBQUE7T0FDQSxFQUFBLElBQUEsRUFBQSxJQUFBLENBQUEsUUFBQSxPQUFBLElBQUEsRUFBQSxNQUFBLFFBQUEsU0FBQSxRQUFBLFFBQUE7T0FDQSxFQUFBLElBQUEsRUFBQSxJQUFBLENBQUEsTUFBQSxFQUFBLE1BQUEsUUFBQSxTQUFBLFFBQUEsUUFBQTs7UUFFQTs7SUFFQSxJQUFBLG1CQUFBLFVBQUEsT0FBQTtLQUNBLE9BQUEsQ0FBQSxVQUFBLE9BQUE7TUFDQSxPQUFBLFVBQUEsR0FBQTtPQUNBLElBQUE7T0FDQSxTQUFBLFFBQUEsWUFBQSxFQUFBO09BQ0EsRUFBQSxJQUFBLEVBQUEsSUFBQSxDQUFBLE9BQUEsSUFBQSxFQUFBLE1BQUEsT0FBQSxTQUFBLFFBQUEsUUFBQTtPQUNBLE9BQUEsRUFBQSxJQUFBLEVBQUEsSUFBQSxDQUFBLE9BQUEsSUFBQSxFQUFBLE1BQUEsT0FBQSxTQUFBLFFBQUEsUUFBQTs7UUFFQTs7SUFFQSxJQUFBLGVBQUEsVUFBQSxNQUFBLEdBQUEsU0FBQTtLQUNBLElBQUE7S0FDQSxVQUFBLDJCQUFBLEtBQUEsT0FBQTtLQUNBLFFBQUEsUUFBQSxLQUFBLEtBQUEsVUFBQSxVQUFBLE1BQUE7TUFDQSxXQUFBLHlDQUFBLEtBQUEsU0FBQSxLQUFBLFNBQUEsVUFBQSxLQUFBLFNBQUE7O0tBRUEsU0FBQSxRQUFBLFFBQUEsWUFBQSxTQUFBLE1BQUEsR0FBQSxPQUFBLE1BQUEsWUFBQTs7O0lBR0EsSUFBQSxlQUFBLFVBQUEsTUFBQSxHQUFBLFNBQUE7S0FDQSxPQUFBLFFBQUEsUUFBQTs7O0lBR0EsTUFBQSxPQUFBLGFBQUEsVUFBQSxNQUFBLFNBQUE7S0FDQSxRQUFBLFFBQUE7S0FDQSxJQUFBLFFBQUEsV0FBQSxNQUFBO01BQ0E7TUFDQTtNQUNBO1lBQ0E7TUFDQTs7S0FFQTs7O0lBR0EsTUFBQSxPQUFBLGFBQUEsVUFBQSxNQUFBLE1BQUE7S0FDQSxJQUFBLFNBQUEsTUFBQTtNQUNBOztLQUVBLElBQUEsUUFBQSxPQUFBO01BQ0E7WUFDQTtNQUNBOzs7Ozs7OztBQ3RUQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLFFBQUEsb0JBQUEsWUFBQSxtQkFBQSxVQUFBOzs7Ozs7QUNIQSxDQUFBLFdBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsa0JBQUEsVUFBQSw0QkFBQSxTQUFBLFVBQUE7RUFDQSxJQUFBLFdBQUEsV0FBQTtHQUNBLE9BQUE7SUFDQSxPQUFBO0lBQ0EsUUFBQTtJQUNBLE9BQUE7SUFDQSxNQUFBOzs7RUFHQSxPQUFBO0dBQ0EsVUFBQTtHQUNBLFlBQUE7R0FDQSxPQUFBO0dBQ0EsU0FBQTtHQUNBLE1BQUEsU0FBQSxRQUFBLFNBQUEsUUFBQSxTQUFBOztJQUVBLElBQUEsVUFBQSxRQUFBLE9BQUEsWUFBQTs7O0lBR0EsSUFBQSxTQUFBLEdBQUEsTUFBQTtNQUNBLE9BQUEsQ0FBQSxHQUFBLFFBQUE7TUFDQSxNQUFBLENBQUEsR0FBQTtNQUNBLE1BQUE7OztJQUdBLElBQUEsTUFBQSxHQUFBLE9BQUEsUUFBQSxJQUFBLE9BQUE7TUFDQSxLQUFBLFNBQUEsUUFBQTtNQUNBLEtBQUEsVUFBQSxRQUFBO01BQ0EsT0FBQTtJQUNBLElBQUEsWUFBQSxJQUFBLE9BQUE7TUFDQSxLQUFBLGFBQUEsZUFBQSxRQUFBLFFBQUEsSUFBQSxNQUFBLFFBQUEsU0FBQSxJQUFBO0lBQ0EsSUFBQSxhQUFBLFVBQUEsT0FBQTtNQUNBLEtBQUEsS0FBQSxRQUFBLFFBQUEsSUFBQTtNQUNBLEtBQUEsZ0JBQUE7TUFDQSxLQUFBLFVBQUEsUUFBQTtNQUNBLE1BQUEsV0FBQTtNQUNBLEtBQUEsUUFBQTtJQUNBLElBQUEsTUFBQSxHQUFBLElBQUE7TUFDQSxXQUFBO01BQ0EsWUFBQSxTQUFBLEdBQUE7TUFDQSxPQUFBLFFBQUEsUUFBQSxJQUFBOztNQUVBLFlBQUEsU0FBQSxHQUFBO01BQ0EsT0FBQSxRQUFBLFFBQUE7O0lBRUEsSUFBQSxjQUFBLFVBQUEsT0FBQTtNQUNBLE1BQUE7TUFDQSxVQUFBLElBQUEsS0FBQSxLQUFBOztNQUVBLE1BQUEsUUFBQSxRQUFBO01BQ0EsS0FBQSxLQUFBO0lBQ0EsSUFBQSxPQUFBLFVBQUEsVUFBQTtNQUNBLEtBQUEsQ0FBQTtNQUNBO01BQ0EsT0FBQTtNQUNBLEtBQUEsU0FBQSxHQUFBO01BQ0EsT0FBQSxPQUFBOztPQUVBLE1BQUEsUUFBQSxRQUFBO01BQ0EsTUFBQSxlQUFBO01BQ0EsS0FBQSxlQUFBO01BQ0EsS0FBQSxLQUFBOzs7SUFHQSxTQUFBLFVBQUEsUUFBQTtLQUNBLFlBQUE7T0FDQSxTQUFBO09BQ0EsS0FBQSxVQUFBLE9BQUEsVUFBQSxJQUFBLEtBQUE7S0FDQSxLQUFBLGFBQUEsU0FBQSxLQUFBLE1BQUEsUUFBQSxTQUFBLEdBQUE7TUFDQSxJQUFBLE9BQUEsS0FBQSxZQUFBLE1BQUE7O01BRUEsSUFBQSxJQUFBLEdBQUEsWUFBQSxLQUFBLElBQUE7TUFDQSxPQUFBLFNBQUEsR0FBQTtPQUNBLEtBQUEsZUFBQSxRQUFBLEtBQUEsTUFBQSxFQUFBLEtBQUEsS0FBQTs7Ozs7O0lBTUEsU0FBQSxTQUFBLFlBQUEsVUFBQTtLQUNBLFdBQUEsVUFBQSxLQUFBLFNBQUEsR0FBQTtNQUNBLElBQUEsY0FBQSxHQUFBLFlBQUEsRUFBQSxVQUFBO01BQ0EsT0FBQSxTQUFBLEdBQUE7T0FDQSxFQUFBLFdBQUEsWUFBQTtPQUNBLE9BQUEsSUFBQTs7Ozs7O0lBTUEsT0FBQTtLQUNBLFdBQUE7TUFDQSxPQUFBLFFBQUE7O0tBRUEsU0FBQSxVQUFBLFVBQUE7TUFDQSxJQUFBLENBQUEsU0FBQTtPQUNBLFdBQUE7UUFDQSxNQUFBLFFBQUE7Ozs7TUFJQSxTQUFBLFVBQUE7T0FDQSxVQUFBLFNBQUE7Ozs7Ozs7Ozs7O0FDekdBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsUUFBQSxvQkFBQSxZQUFBLG1CQUFBLFVBQUE7Ozs7OztBQ0hBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxrQkFBQSxXQUFBLGVBQUEsV0FBQTs7RUFFQSxPQUFBO0dBQ0EsVUFBQTtHQUNBLGFBQUE7R0FDQSxZQUFBO0dBQ0EsTUFBQSxVQUFBLFFBQUEsU0FBQSxRQUFBOzs7Ozs7Ozs7QUNUQSxDQUFBLFlBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsa0JBQUEsVUFBQSx1QkFBQSxVQUFBLFVBQUE7RUFDQSxJQUFBLFdBQUEsWUFBQTtHQUNBLE9BQUE7SUFDQSxJQUFBO0lBQ0EsT0FBQTtJQUNBLFFBQUE7SUFDQSxNQUFBO0lBQ0EsT0FBQTtJQUNBLFVBQUE7SUFDQSxRQUFBO0tBQ0EsTUFBQTtLQUNBLE9BQUE7S0FDQSxLQUFBO0tBQ0EsUUFBQTs7SUFFQSxRQUFBLENBQUE7S0FDQSxVQUFBO0tBQ0EsT0FBQTtLQUNBLFNBQUE7T0FDQTtLQUNBLFVBQUE7S0FDQSxPQUFBO0tBQ0EsU0FBQTtPQUNBO0tBQ0EsVUFBQTtLQUNBLE9BQUE7S0FDQSxTQUFBOzs7O0VBSUEsT0FBQTtHQUNBLFVBQUE7R0FDQSxPQUFBO0lBQ0EsTUFBQTs7R0FFQSxTQUFBO0dBQ0EsTUFBQSxVQUFBLFFBQUEsU0FBQSxRQUFBLFNBQUE7O0lBRUEsSUFBQSxVQUFBLFFBQUEsT0FBQSxZQUFBOztJQUVBLEdBQUEsUUFBQSxNQUFBO0tBQ0EsUUFBQSxPQUFBLEdBQUEsUUFBQSxRQUFBOztJQUVBLFFBQUEsSUFBQSxVQUFBLFFBQUEsU0FBQSxNQUFBLElBQUEsaUJBQUEsUUFBQSxTQUFBLElBQUE7SUFDQSxJQUFBLElBQUEsR0FBQSxNQUFBO01BQ0EsT0FBQSxDQUFBLEdBQUE7TUFDQSxNQUFBLENBQUEsSUFBQSxRQUFBLFFBQUEsUUFBQSxPQUFBO01BQ0EsTUFBQTs7SUFFQSxJQUFBLFFBQUEsR0FBQSxJQUFBO01BQ0EsRUFBQTtNQUNBLE9BQUEsQ0FBQSxHQUFBO01BQ0EsR0FBQSxTQUFBO01BQ0EsR0FBQSxZQUFBOztJQUVBLElBQUEsTUFBQSxHQUFBLE9BQUEsUUFBQSxJQUFBLE9BQUE7TUFDQSxLQUFBLFNBQUEsUUFBQTtNQUNBLEtBQUEsVUFBQSxRQUFBLFNBQUEsUUFBQSxPQUFBLE1BQUEsUUFBQSxPQUFBO01BQ0EsT0FBQTs7SUFFQSxJQUFBLFdBQUEsSUFBQSxPQUFBO01BQ0EsT0FBQTtNQUNBLEtBQUEsTUFBQSxRQUFBO01BQ0EsS0FBQSxNQUFBO01BQ0EsS0FBQSxNQUFBO01BQ0EsS0FBQSxNQUFBO01BQ0EsS0FBQSxNQUFBO01BQ0EsS0FBQSxnQkFBQTtJQUNBLFFBQUEsUUFBQSxRQUFBLFFBQUEsVUFBQSxPQUFBO0tBQ0EsU0FBQSxPQUFBO09BQ0EsS0FBQSxVQUFBLE1BQUEsV0FBQTtPQUNBLEtBQUEsY0FBQSxNQUFBO09BQ0EsS0FBQSxnQkFBQSxNQUFBOztJQUVBLElBQUEsT0FBQTtNQUNBLEtBQUEsU0FBQSxRQUFBO01BQ0EsS0FBQSxVQUFBLFFBQUE7TUFDQSxNQUFBLFFBQUEsVUFBQSxRQUFBLFFBQUE7SUFDQSxJQUFBLFNBQUEsSUFBQSxPQUFBLEtBQUEsS0FBQSxhQUFBLGVBQUEsUUFBQSxTQUFBLElBQUEsT0FBQSxRQUFBLFNBQUEsSUFBQTtNQUNBLEtBQUEsU0FBQTs7SUFFQSxJQUFBLFFBQUEsU0FBQSxNQUFBO0tBQ0EsT0FBQSxPQUFBO09BQ0EsS0FBQSxLQUFBLFFBQUEsU0FBQTtLQUNBLE9BQUEsT0FBQTtPQUNBLEtBQUE7T0FDQSxNQUFBLGFBQUEsUUFBQSxPQUFBO09BQ0EsS0FBQSxlQUFBO09BQ0EsS0FBQSxLQUFBOzs7OztJQUtBLElBQUEsUUFBQSxTQUFBLE1BQUE7S0FDQSxJQUFBLFVBQUEsSUFBQSxPQUFBLEtBQUEsS0FBQSxhQUFBLGdCQUFBLFFBQUEsU0FBQSxRQUFBLFNBQUEsTUFBQSxPQUFBLFFBQUEsU0FBQSxJQUFBO09BQ0EsS0FBQSxTQUFBO0tBQ0EsUUFBQSxPQUFBO09BQ0EsS0FBQSxLQUFBLFFBQUEsU0FBQTtLQUNBLFFBQUEsT0FBQTtPQUNBLEtBQUE7T0FDQSxNQUFBLGFBQUEsUUFBQSxPQUFBO09BQ0EsS0FBQSxlQUFBO09BQ0EsS0FBQSxLQUFBOztJQUVBLElBQUEsU0FBQSxJQUFBLE9BQUE7TUFDQSxLQUFBLFNBQUE7SUFDQSxHQUFBLFFBQUEsWUFBQSxLQUFBO0tBQ0EsT0FBQSxLQUFBOzs7SUFHQSxPQUFBLE9BQUE7TUFDQSxLQUFBLFVBQUEsUUFBQTs7SUFFQSxJQUFBLFFBQUEsU0FBQSxNQUFBO0lBQ0EsT0FBQSxPQUFBO01BQ0EsS0FBQSxNQUFBLFFBQUEsUUFBQTtNQUNBLEtBQUEsTUFBQTtNQUNBLEtBQUEsTUFBQSxRQUFBLFFBQUE7TUFDQSxLQUFBLE1BQUEsUUFBQTtNQUNBLEtBQUEsb0JBQUE7TUFDQSxLQUFBLGdCQUFBO01BQ0EsS0FBQSxVQUFBOztJQUVBLElBQUEsYUFBQSxPQUFBLE9BQUE7TUFDQSxLQUFBLGFBQUEsaUJBQUEsUUFBQSxTQUFBLElBQUE7SUFDQSxJQUFBLFNBQUEsV0FBQSxPQUFBO01BQ0EsS0FBQSxTQUFBO01BQ0EsS0FBQSxLQUFBLFFBQUEsU0FBQTtLQUNBLEdBQUEsUUFBQSxNQUFBO01BQ0EsT0FBQSxNQUFBLFFBQUEsUUFBQTs7SUFFQSxJQUFBLGNBQUEsV0FBQSxPQUFBO01BQ0EsS0FBQTtNQUNBLE1BQUEsYUFBQSxRQUFBLE9BQUE7TUFDQSxLQUFBLGVBQUEsVUFBQSxLQUFBLEtBQUE7Ozs7OztJQU1BLFNBQUEsUUFBQTtLQUNBLElBQUEsUUFBQSxNQUFBLFNBQUE7O0tBRUEsSUFBQSxHQUFBLE1BQUEsYUFBQTtNQUNBLFFBQUEsRUFBQSxPQUFBLEdBQUEsTUFBQSxNQUFBO01BQ0EsTUFBQSxPQUFBLENBQUEsT0FBQTs7S0FFQSxZQUFBLEtBQUEsU0FBQTtLQUNBLFdBQUEsS0FBQSxhQUFBLGVBQUEsRUFBQSxTQUFBLE1BQUEsUUFBQSxTQUFBLElBQUE7OztJQUdBLFNBQUEsVUFBQTtLQUNBLElBQUEsUUFBQSxNQUFBLFNBQUE7TUFDQSxRQUFBO01BQ0EsUUFBQTtLQUNBLElBQUEsUUFBQTtLQUNBLEdBQUE7O01BRUEsUUFBQSxRQUFBLE9BQUEsTUFBQSxVQUFBLEtBQUEsS0FBQTtPQUNBLElBQUEsU0FBQSxJQUFBLFFBQUEsV0FBQSxTQUFBLFFBQUE7UUFDQSxRQUFBO1FBQ0EsUUFBQTs7O01BR0E7TUFDQSxRQUFBLFFBQUEsS0FBQSxRQUFBLElBQUEsUUFBQTtjQUNBLENBQUEsU0FBQSxRQUFBO0tBQ0EsUUFBQSxjQUFBO0tBQ0EsUUFBQTs7O0lBR0EsT0FBQTtLQUNBLFlBQUE7TUFDQSxPQUFBLFFBQUE7O0tBRUEsVUFBQSxVQUFBLFVBQUE7TUFDQSxRQUFBLElBQUE7TUFDQSxJQUFBLENBQUEsVUFBQTtPQUNBLFlBQUEsS0FBQSxTQUFBO09BQ0EsV0FBQSxLQUFBLGFBQUEsZUFBQSxFQUFBLEtBQUEsTUFBQSxRQUFBLFNBQUEsSUFBQTtPQUNBOztNQUVBLFlBQUEsS0FBQSxTQUFBLFNBQUEsUUFBQTtNQUNBLElBQUEsWUFBQSxVQUFBO09BQ0EsV0FBQSxLQUFBLGFBQUEsZUFBQSxFQUFBLFNBQUEsUUFBQSxVQUFBLE1BQUEsUUFBQSxTQUFBLElBQUE7YUFDQTtPQUNBLFdBQUEsYUFBQSxTQUFBLEtBQUEsS0FBQSxRQUFBLEtBQUEsYUFBQSxlQUFBLEVBQUEsU0FBQSxRQUFBLFVBQUEsTUFBQSxRQUFBLFNBQUEsSUFBQTs7Ozs7Ozs7Ozs7QUM3TEEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxRQUFBLG9CQUFBLFlBQUEsY0FBQSxVQUFBOzs7Ozs7QUNIQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsa0JBQUEsV0FBQSxtQkFBQSxXQUFBOztFQUVBLE9BQUE7R0FDQSxVQUFBO0dBQ0EsTUFBQTtJQUNBLEtBQUE7SUFDQSxVQUFBOztHQUVBLGFBQUE7R0FDQSxZQUFBO0dBQ0EsTUFBQSxVQUFBLFFBQUEsU0FBQSxRQUFBO0lBQ0EsT0FBQSxVQUFBO0lBQ0EsT0FBQTtJQUNBLE9BQUE7Ozs7Ozs7OztBQ2hCQSxDQUFBLFlBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSxrQ0FBQSxVQUFBLFFBQUE7RUFDQSxPQUFBLFNBQUE7R0FDQSxTQUFBO0dBQ0EsVUFBQTtHQUNBLFVBQUE7R0FDQSxhQUFBO0dBQ0EsaUJBQUE7R0FDQSxrQkFBQTtHQUNBLGVBQUE7R0FDQSxpQkFBQTtHQUNBLFVBQUE7OztDQUdBLE9BQUEsUUFBQTtFQUNBLFFBQUE7R0FDQSxNQUFBOztFQUVBLEtBQUE7O0VBRUEsT0FBQSxXQUFBLFlBQUE7R0FDQSxPQUFBLE1BQUEsUUFBQSxTQUFBO01BQ0EsTUFBQTtNQUNBLGdCQUFBO01BQ0EsUUFBQTtPQUNBLEtBQUE7T0FDQSxPQUFBO09BQ0EsUUFBQTtPQUNBLE1BQUE7O01BRUEsR0FBQSxVQUFBLEdBQUE7T0FDQSxPQUFBLEVBQUE7O01BRUEsR0FBQSxVQUFBLEdBQUE7T0FDQSxPQUFBLEVBQUE7O01BRUEsV0FBQTtNQUNBLFlBQUE7TUFDQSxXQUFBO01BQ0Esb0JBQUE7TUFDQSx5QkFBQTs7O01BR0EsT0FBQTtPQUNBLFdBQUE7O01BRUEsT0FBQTtPQUNBLFdBQUE7T0FDQSxtQkFBQTs7TUFFQSxRQUFBO09BQ0EsWUFBQTs7TUFFQSxPQUFBO09BQ0EsYUFBQTs7OztHQUlBLEdBQUEsT0FBQSxRQUFBLFVBQUEsT0FBQTtJQUNBLE9BQUEsTUFBQSxRQUFBLE1BQUEsVUFBQSxDQUFBLFNBQUEsT0FBQSxNQUFBLEtBQUEsT0FBQSxNQUFBOztHQUVBLE9BQUEsT0FBQTs7RUFFQSxPQUFBLGlCQUFBLFlBQUE7R0FDQSxJQUFBLFlBQUE7R0FDQSxPQUFBLFFBQUE7SUFDQSxJQUFBO0lBQ0EsSUFBQTs7R0FFQSxRQUFBLFFBQUEsT0FBQSxXQUFBLFVBQUEsTUFBQSxLQUFBO0lBQ0EsSUFBQSxRQUFBO0tBQ0EsSUFBQTtLQUNBLEtBQUEsS0FBQTtLQUNBLE9BQUEsS0FBQTtLQUNBLFFBQUE7O0lBRUEsUUFBQSxRQUFBLE9BQUEsTUFBQSxVQUFBLE1BQUEsR0FBQTtLQUNBLE1BQUEsT0FBQSxLQUFBO01BQ0EsSUFBQTtNQUNBLEdBQUEsS0FBQSxLQUFBLE9BQUE7TUFDQSxHQUFBLEtBQUEsS0FBQSxPQUFBOztLQUVBLE9BQUEsTUFBQSxNQUFBLEtBQUEsSUFBQSxPQUFBLE1BQUEsS0FBQSxLQUFBLEtBQUEsT0FBQTtLQUNBLE9BQUEsTUFBQSxNQUFBLEtBQUEsSUFBQSxPQUFBLE1BQUEsS0FBQSxLQUFBLEtBQUEsT0FBQTs7SUFFQSxVQUFBLEtBQUE7OztHQUdBLE9BQUEsTUFBQSxPQUFBO0dBQ0EsR0FBQSxPQUFBLFFBQUEsVUFBQSxPQUFBO0lBQ0EsT0FBQSxNQUFBLFFBQUEsTUFBQSxVQUFBLENBQUEsU0FBQSxPQUFBLE1BQUEsS0FBQSxPQUFBLE1BQUE7OztFQUdBLE9BQUEsT0FBQSxRQUFBLFVBQUEsR0FBQSxHQUFBO0dBQ0EsSUFBQSxDQUFBLEdBQUE7SUFDQTs7R0FFQSxPQUFBOzs7Ozs7QUNuR0EsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGtCQUFBLFVBQUEsaUJBQUEsQ0FBQSxlQUFBLFNBQUEsYUFBQTs7RUFFQSxJQUFBLFNBQUE7UUFDQSxJQUFBLFNBQUE7O1FBRUEsU0FBQSxNQUFBLElBQUE7WUFDQSxJQUFBLEtBQUEsR0FBQSxHQUFBLGFBQUE7WUFDQSxJQUFBLENBQUEsSUFBQTtnQkFDQSxLQUFBLEVBQUE7Z0JBQ0EsR0FBQSxHQUFBLGFBQUEscUJBQUE7O1lBRUEsT0FBQTs7UUFFQSxTQUFBLFNBQUEsSUFBQTtZQUNBLElBQUEsUUFBQSxPQUFBO1lBQ0EsSUFBQSxDQUFBLE9BQUE7Z0JBQ0EsUUFBQTtnQkFDQSxPQUFBLE1BQUE7O1lBRUEsT0FBQTs7O1FBR0EsU0FBQSxlQUFBLFNBQUEsT0FBQSxVQUFBLFNBQUEsUUFBQTtZQUNBLE9BQUEsV0FBQTtnQkFDQSxNQUFBLFlBQUE7Z0JBQ0EsTUFBQSxXQUFBO2dCQUNBLE1BQUEsU0FBQTtnQkFDQSxTQUFBLFFBQUEsUUFBQSxXQUFBO29CQUNBLElBQUEsV0FBQSxNQUFBLFdBQUEsUUFBQTt3QkFDQSxRQUFBLEdBQUEsTUFBQSxTQUFBOztvQkFFQSxNQUFBLFlBQUE7b0JBQ0EsTUFBQSxXQUFBO29CQUNBLE1BQUE7Ozs7O1FBS0EsT0FBQTtZQUNBLE9BQUEsU0FBQSxTQUFBLFFBQUE7O29CQUVBLElBQUEsUUFBQSxTQUFBLE1BQUE7b0JBQ0EsSUFBQSxTQUFBLENBQUEsTUFBQSxhQUFBLE1BQUE7d0JBQ0EsTUFBQSxTQUFBLFFBQUEsR0FBQTtvQkFDQSxJQUFBLFdBQUEsWUFBQSxTQUFBO3dCQUNBLE1BQUEsQ0FBQSxRQUFBLFNBQUEsTUFBQSxTQUFBO3dCQUNBLElBQUEsQ0FBQSxRQUFBLE9BQUEsU0FBQTs7b0JBRUEsSUFBQSxVQUFBO3dCQUNBLElBQUEsTUFBQSxXQUFBOzRCQUNBLE1BQUE7OEJBQ0EsZUFBQTs2Q0FDQTs2Q0FDQTs2Q0FDQTs2Q0FDQTs0QkFDQSxPQUFBLE1BQUEsU0FBQTs7NkJBRUE7NEJBQ0EsTUFBQSxTQUFBOzRCQUNBLE9BQUEsZUFBQTtrREFDQTtrREFDQTtrREFDQTtrREFDQTs7OztnQkFJQTs7WUFFQSxPQUFBLFNBQUEsU0FBQSxRQUFBOztvQkFFQSxJQUFBLFFBQUEsU0FBQSxNQUFBO29CQUNBLElBQUEsU0FBQSxDQUFBLE1BQUEsYUFBQSxNQUFBO3dCQUNBLE1BQUEsU0FBQSxRQUFBLEdBQUE7O29CQUVBLElBQUEsV0FBQSxZQUFBLFNBQUE7d0JBQ0EsTUFBQSxDQUFBLFFBQUEsT0FBQSxTQUFBO3dCQUNBLElBQUEsQ0FBQSxRQUFBLFNBQUEsTUFBQSxTQUFBOztvQkFFQSxJQUFBLFVBQUE7d0JBQ0EsSUFBQSxNQUFBLFdBQUE7NEJBQ0EsTUFBQSxTQUFBLGVBQUE7MERBQ0E7MERBQ0E7MERBQ0E7MERBQ0E7NEJBQ0EsT0FBQSxNQUFBLFNBQUE7OzZCQUVBOzRCQUNBLE1BQUEsU0FBQTs0QkFDQSxPQUFBLGVBQUE7a0RBQ0E7a0RBQ0E7a0RBQ0E7a0RBQ0E7Ozs7Z0JBSUE7Ozs7OztBQ3RHQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLFFBQUEsb0JBQUEsWUFBQSxtQkFBQSxVQUFBOzs7Ozs7QUNIQSxDQUFBLFlBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsa0JBQUEsVUFBQSxZQUFBOztDQUVBLFNBQUEsVUFBQSxDQUFBLFlBQUE7O0NBRUEsU0FBQSxTQUFBLFVBQUEsY0FBQTtFQUNBLE9BQUE7R0FDQSxVQUFBO0dBQ0EsU0FBQTtHQUNBLE9BQUE7SUFDQSxTQUFBO0lBQ0EsVUFBQTs7R0FFQSxZQUFBO0dBQ0EsYUFBQTtHQUNBLE1BQUE7OztFQUdBLFNBQUEscUJBQUEsUUFBQSxTQUFBLFFBQUE7R0FDQSxPQUFBLFVBQUE7S0FDQSxPQUFBO0dBQ0EsU0FBQSxTQUFBO0lBQ0EsU0FBQSxVQUFBO01BQ0EsYUFBQSxRQUFBLElBQUEsQ0FBQSxPQUFBLEtBQUEsU0FBQTs7Ozs7OztBQ3pCQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLFFBQUEsb0JBQUEsWUFBQSx1REFBQSxTQUFBLFFBQUEsVUFBQSxhQUFBO0VBQ0EsT0FBQSxXQUFBO0VBQ0EsT0FBQSxpQkFBQTtFQUNBLE9BQUEsZ0JBQUE7RUFDQTs7O0VBR0EsU0FBQSxVQUFBO0dBQ0EsT0FBQTtHQUNBLE9BQUE7R0FDQSxPQUFBO0dBQ0EsT0FBQSxPQUFBLFlBQUEsVUFBQSxTQUFBLFNBQUE7SUFDQSxJQUFBLFlBQUEsU0FBQTtLQUNBLE9BQUE7O0lBRUEsT0FBQTtJQUNBLE9BQUE7OztFQUdBLFNBQUEsZUFBQTtJQUNBLE9BQUEsVUFBQSxDQUFBLE9BQUEsU0FBQTs7O0VBR0EsU0FBQSxXQUFBO0dBQ0EsT0FBQSxRQUFBO0lBQ0EsU0FBQTtLQUNBLE9BQUE7TUFDQSxNQUFBOztNQUVBLGdCQUFBO01BQ0EsUUFBQTtPQUNBLEtBQUE7T0FDQSxPQUFBO09BQ0EsUUFBQTtPQUNBLE1BQUE7O01BRUEsR0FBQSxVQUFBLEdBQUE7T0FDQSxPQUFBLEVBQUE7O01BRUEsR0FBQSxVQUFBLEdBQUE7T0FDQSxPQUFBLEVBQUE7O01BRUEsWUFBQTtNQUNBLFdBQUE7TUFDQSxvQkFBQTtNQUNBLHlCQUFBO01BQ0EsUUFBQSxDQUFBLEtBQUE7TUFDQSxPQUFBO09BQ0EsV0FBQTs7TUFFQSxPQUFBO09BQ0EsV0FBQTtPQUNBLG1CQUFBOztNQUVBLE9BQUE7T0FDQSxXQUFBO09BQ0EsT0FBQTtRQUNBLE9BQUE7OztNQUdBLE1BQUE7T0FDQSxZQUFBOzs7O0lBSUEsTUFBQTs7R0FFQSxPQUFBLE9BQUE7OztFQUdBLFNBQUEsaUJBQUE7O0dBRUEsSUFBQSxZQUFBO0dBQ0EsUUFBQSxRQUFBLE9BQUEsU0FBQSxLQUFBLFVBQUEsVUFBQSxNQUFBLEtBQUE7SUFDQSxJQUFBLFFBQUE7S0FDQSxLQUFBLEtBQUE7S0FDQSxPQUFBLEtBQUE7S0FDQSxRQUFBOztJQUVBLFFBQUEsUUFBQSxPQUFBLFFBQUEsS0FBQSxVQUFBLE1BQUE7S0FDQSxNQUFBLE9BQUEsS0FBQTtNQUNBLEdBQUEsS0FBQTtNQUNBLEdBQUEsS0FBQSxLQUFBOzs7SUFHQSxVQUFBLEtBQUE7O0dBRUEsT0FBQSxNQUFBLE9BQUE7Ozs7OztBQzFGQSxDQUFBLFlBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsa0JBQUEsVUFBQSxZQUFBLFlBQUE7O0VBRUEsT0FBQTtHQUNBLFVBQUE7O0dBRUEsWUFBQTtHQUNBLE9BQUE7SUFDQSxNQUFBOztHQUVBLE1BQUEsVUFBQSxRQUFBLFNBQUEsUUFBQTtJQUNBLE9BQUE7SUFDQSxPQUFBO0lBQ0EsSUFBQSxRQUFBO0tBQ0EsU0FBQTtLQUNBLFNBQUEsQ0FBQSxTQUFBO0tBQ0EsSUFBQSxHQUFBLE1BQUEsU0FBQSxNQUFBLENBQUEsR0FBQSxJQUFBLEtBQUE7S0FDQSxJQUFBLEdBQUEsTUFBQSxNQUFBLFNBQUEsS0FBQSxPQUFBLENBQUEsR0FBQSxJQUFBLE1BQUEsQ0FBQSxHQUFBOzs7S0FHQSxVQUFBO0tBQ0EsV0FBQTtLQUNBLGNBQUE7O0lBRUEsSUFBQSxNQUFBLEdBQUEsT0FBQSxRQUFBOzs7SUFHQSxJQUFBLE1BQUEsSUFBQSxPQUFBO01BQ0EsS0FBQSxTQUFBLFFBQUEsVUFBQTtNQUNBLEtBQUEsVUFBQSxTQUFBLFVBQUE7TUFDQSxPQUFBO01BQ0EsS0FBQSxhQUFBLGVBQUEsQ0FBQSxTQUFBLFNBQUEsU0FBQSxXQUFBOzs7Ozs7OztJQVFBLElBQUEsWUFBQSxHQUFBLE9BQUE7TUFDQSxLQUFBO01BQ0EsTUFBQSxVQUFBLEdBQUE7TUFDQSxPQUFBLEVBQUE7OztJQUdBLElBQUEsTUFBQSxHQUFBLElBQUE7TUFDQSxXQUFBLFVBQUEsR0FBQTtNQUNBLE9BQUEsS0FBQSxJQUFBLEdBQUEsS0FBQSxJQUFBLElBQUEsS0FBQSxJQUFBLEVBQUEsRUFBQTs7TUFFQSxTQUFBLFVBQUEsR0FBQTtNQUNBLE9BQUEsS0FBQSxJQUFBLEdBQUEsS0FBQSxJQUFBLElBQUEsS0FBQSxJQUFBLEVBQUEsRUFBQSxJQUFBLEVBQUE7O01BRUEsWUFBQSxVQUFBLEdBQUE7TUFDQSxPQUFBLEtBQUEsSUFBQSxHQUFBLEVBQUEsSUFBQSxFQUFBLEVBQUEsS0FBQSxFQUFBOztNQUVBLFlBQUEsVUFBQSxHQUFBO01BQ0EsT0FBQSxLQUFBLElBQUEsR0FBQSxFQUFBLEVBQUEsSUFBQSxFQUFBOzs7SUFHQSxJQUFBLFdBQUE7S0FDQSxXQUFBO0tBQ0EsV0FBQTtLQUNBLFdBQUE7OztLQUdBLElBQUEsUUFBQSxVQUFBLE9BQUEsT0FBQTs7S0FFQSxJQUFBLE9BQUEsSUFBQSxVQUFBLFFBQUEsS0FBQTtLQUNBLEtBQUEsUUFBQSxPQUFBO09BQ0EsS0FBQSxNQUFBLFVBQUEsR0FBQSxHQUFBO09BQ0EsT0FBQSxVQUFBOztPQUVBLEtBQUEsS0FBQTtPQUNBLEtBQUEsYUFBQTtPQUNBLEtBQUEsU0FBQSxVQUFBLEdBQUE7T0FDQSxPQUFBLEVBQUEsUUFBQSxXQUFBOztPQUVBLE1BQUEsUUFBQTtPQUNBLEdBQUEsU0FBQTs7S0FFQSxJQUFBLE9BQUEsSUFBQSxVQUFBLFFBQUEsS0FBQTtLQUNBLElBQUEsWUFBQSxLQUFBLFFBQUEsT0FBQTtPQUNBLE1BQUEsZ0JBQUE7T0FDQSxLQUFBLGVBQUEsVUFBQSxHQUFBO09BQ0EsSUFBQSxFQUFBO1FBQ0EsT0FBQTs7O1FBR0EsT0FBQTs7T0FFQSxLQUFBLE1BQUEsVUFBQSxHQUFBO09BQ0EsT0FBQSxVQUFBLEVBQUE7O09BRUEsS0FBQSxTQUFBLFVBQUEsR0FBQTtPQUNBLE9BQUE7O09BRUEsS0FBQSxNQUFBLFVBQUEsR0FBQTtPQUNBLE9BQUEsRUFBQSxRQUFBLFNBQUE7O09BRUEsS0FBQSxhQUFBLFVBQUEsR0FBQTtPQUNBLElBQUEsWUFBQSxDQUFBLEVBQUEsUUFBQSxJQUFBLE1BQUEsS0FBQSxTQUFBO1FBQ0EsY0FBQSxFQUFBLElBQUEsTUFBQSxJQUFBLENBQUE7T0FDQSxRQUFBLEVBQUEsRUFBQSxJQUFBLEVBQUEsS0FBQSxLQUFBLE1BQUEsS0FBQSxLQUFBLE1BQUEsWUFBQSxhQUFBO1FBQ0EsU0FBQSxTQUFBLFlBQUEsQ0FBQSxLQUFBO09BQ0EsU0FBQSxDQUFBLEVBQUEsRUFBQSxLQUFBLGVBQUE7T0FDQSxZQUFBLFFBQUEsS0FBQSxDQUFBLE1BQUE7T0FDQSxJQUFBLEVBQUEsUUFBQSxZQUFBLEVBQUEsUUFBQSxVQUFBLFVBQUE7T0FDQSxJQUFBLEVBQUEsU0FBQSxHQUFBO1FBQ0EsU0FBQSxDQUFBO1FBQ0EsU0FBQTtRQUNBLFdBQUE7Y0FDQSxJQUFBLEVBQUEsU0FBQSxHQUFBLFVBQUEsQ0FBQTtZQUNBLElBQUEsRUFBQSxTQUFBLEdBQUEsVUFBQSxDQUFBO1lBQ0EsSUFBQSxFQUFBLFNBQUEsR0FBQSxVQUFBO09BQ0EsT0FBQSxZQUFBLFNBQUEsZ0JBQUEsU0FBQSxhQUFBLFdBQUE7O09BRUEsR0FBQSxTQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0tBK0JBLFVBQUEsT0FBQTtPQUNBLEtBQUEsS0FBQTtPQUNBLEtBQUEsVUFBQSxHQUFBOztPQUVBLElBQUEsRUFBQSxTQUFBLEtBQUEsRUFBQSxRQUFBLFlBQUEsRUFBQSxRQUFBLFlBQUEsRUFBQSxRQUFBLFlBQUEsRUFBQSxRQUFBO1FBQ0EsT0FBQSxFQUFBLEtBQUEsTUFBQSxLQUFBLEtBQUEsT0FBQSxFQUFBLEtBQUEsTUFBQSxLQUFBLE1BQUE7O1FBRUEsT0FBQSxFQUFBLEtBQUEsTUFBQSxLQUFBOztLQUVBLFVBQUEsT0FBQTtPQUNBLEtBQUEsS0FBQTtPQUNBLEtBQUEsTUFBQTtPQUNBLEtBQUEsVUFBQSxHQUFBOztPQUVBLElBQUEsRUFBQSxTQUFBLEtBQUEsRUFBQSxRQUFBLFlBQUEsRUFBQSxRQUFBLFlBQUEsRUFBQSxRQUFBLFlBQUEsRUFBQSxRQUFBO1FBQ0EsT0FBQSxDQUFBLEVBQUEsS0FBQSxNQUFBLEtBQUEsTUFBQSxNQUFBLE9BQUEsRUFBQSxLQUFBLE1BQUEsS0FBQSxNQUFBOztRQUVBLE9BQUEsQ0FBQSxFQUFBLEtBQUEsTUFBQSxLQUFBLE1BQUEsTUFBQSxPQUFBLEVBQUEsS0FBQSxNQUFBLEtBQUEsTUFBQTs7S0FFQSxVQUFBLE9BQUE7T0FDQSxLQUFBLEtBQUE7T0FDQSxLQUFBLE1BQUE7T0FDQSxLQUFBLFVBQUEsR0FBQTtPQUNBLElBQUEsRUFBQSxTQUFBLEtBQUEsRUFBQSxRQUFBLFlBQUEsRUFBQSxRQUFBLFlBQUEsRUFBQSxRQUFBLFlBQUEsRUFBQSxRQUFBO1FBQ0EsT0FBQSxDQUFBLEVBQUEsS0FBQSxNQUFBLEtBQUEsTUFBQSxNQUFBLE9BQUEsRUFBQSxLQUFBLE1BQUEsS0FBQSxNQUFBOztRQUVBLE9BQUEsQ0FBQSxFQUFBLEtBQUEsTUFBQSxLQUFBLE1BQUEsTUFBQSxPQUFBLEVBQUEsS0FBQSxNQUFBLEtBQUEsTUFBQSxJQUFBOzs7S0FHQSxTQUFBLE1BQUEsR0FBQTs7TUFFQSxLQUFBO1FBQ0EsU0FBQTtRQUNBLFVBQUEsS0FBQSxTQUFBOzs7O01BSUEsS0FBQSxNQUFBLGNBQUEsVUFBQSxHQUFBO1FBQ0EsT0FBQSxXQUFBLEdBQUEsS0FBQSxPQUFBLEdBQUEsT0FBQSxNQUFBLE1BQUE7O1FBRUE7UUFDQSxTQUFBO1FBQ0EsVUFBQSxlQUFBLFVBQUEsR0FBQTtRQUNBLE9BQUEsWUFBQTtTQUNBLElBQUEsRUFBQTtVQUNBLE9BQUE7OztVQUdBLE9BQUE7OztRQUdBLFVBQUEsYUFBQSxVQUFBLEdBQUE7UUFDQSxJQUFBLFlBQUEsQ0FBQSxFQUFBLFFBQUEsSUFBQSxNQUFBLEtBQUEsU0FBQTtRQUNBLE9BQUEsWUFBQTtTQUNBLElBQUEsWUFBQSxDQUFBLEVBQUEsUUFBQSxJQUFBLE1BQUEsS0FBQSxTQUFBO1VBQ0EsY0FBQSxFQUFBLElBQUEsTUFBQSxJQUFBLENBQUE7U0FDQSxRQUFBLEVBQUEsRUFBQSxJQUFBLEVBQUEsS0FBQSxLQUFBLE1BQUEsS0FBQSxLQUFBLE1BQUEsWUFBQSxhQUFBO1VBQ0EsU0FBQSxTQUFBLFlBQUEsQ0FBQSxLQUFBO1NBQ0EsU0FBQSxDQUFBLEVBQUEsRUFBQSxLQUFBLGVBQUE7U0FDQSxZQUFBLFFBQUEsS0FBQSxDQUFBLE1BQUE7U0FDQSxJQUFBLEVBQUEsUUFBQSxZQUFBLEVBQUEsUUFBQSxVQUFBLFVBQUE7U0FDQSxJQUFBLEVBQUEsU0FBQSxHQUFBO1VBQ0EsU0FBQSxDQUFBO1VBQ0EsU0FBQTtVQUNBLFdBQUE7Z0JBQ0EsSUFBQSxFQUFBLFNBQUEsR0FBQSxVQUFBLENBQUE7Y0FDQSxJQUFBLEVBQUEsU0FBQSxHQUFBLFVBQUEsQ0FBQTtjQUNBLElBQUEsRUFBQSxTQUFBLEdBQUEsVUFBQTtTQUNBLE9BQUEsWUFBQSxTQUFBLGdCQUFBLFNBQUEsYUFBQSxXQUFBOzs7UUFHQSxNQUFBLGdCQUFBLFVBQUEsR0FBQTtRQUNBLE9BQUEsV0FBQSxHQUFBLEtBQUEsSUFBQTs7UUFFQSxLQUFBLE9BQUEsVUFBQSxHQUFBO1FBQ0EsR0FBQSxPQUFBLE1BQUEsTUFBQSxjQUFBLFdBQUEsR0FBQSxLQUFBLE9BQUE7Ozs7O0lBS0EsU0FBQSxXQUFBLEdBQUEsR0FBQTtLQUNBLElBQUEsTUFBQSxHQUFBLE9BQUE7S0FDQSxJQUFBLEVBQUEsVUFBQTtNQUNBLE9BQUEsRUFBQSxTQUFBLEtBQUEsVUFBQSxHQUFBO09BQ0EsT0FBQSxXQUFBLEdBQUE7OztLQUdBLE9BQUE7OztJQUdBLFNBQUEsU0FBQSxHQUFBO0tBQ0EsT0FBQSxFQUFBO0tBQ0EsSUFBQSxFQUFBO01BQ0EsT0FBQSxFQUFBO1VBQ0E7TUFDQSxJQUFBLFlBQUE7O01BRUEsSUFBQSxJQUFBO01BQ0EsT0FBQSxFQUFBLE9BQUEsU0FBQSxNQUFBO09BQ0E7TUFDQSxJQUFBLGFBQUEsQ0FBQSxhQUFBLElBQUEsSUFBQTtNQUNBLE9BQUEsT0FBQSxNQUFBLEVBQUEsT0FBQSxPQUFBLEtBQUEsWUFBQSxLQUFBOzs7OztJQUtBLFNBQUEsU0FBQSxHQUFBO0tBQ0EsSUFBQSxLQUFBLEtBQUE7TUFDQSxLQUFBLEdBQUEsWUFBQSxFQUFBLFVBQUEsQ0FBQSxFQUFBLEdBQUEsRUFBQSxJQUFBLEVBQUEsS0FBQTtNQUNBLEtBQUEsR0FBQSxZQUFBLEVBQUEsVUFBQSxDQUFBLEVBQUEsR0FBQTtNQUNBLEtBQUEsR0FBQSxZQUFBLEVBQUEsU0FBQSxDQUFBLEVBQUEsSUFBQSxLQUFBLEdBQUE7O0tBRUEsT0FBQSxVQUFBLEdBQUE7TUFDQSxPQUFBLFVBQUEsR0FBQTtPQUNBLEVBQUEsT0FBQSxHQUFBO09BQ0EsRUFBQSxPQUFBLEdBQUEsSUFBQSxNQUFBLEdBQUE7T0FDQSxPQUFBLElBQUE7Ozs7O0lBS0EsU0FBQSxLQUFBLEdBQUE7S0FDQSxPQUFBLEVBQUEsV0FBQSxLQUFBLElBQUEsTUFBQSxNQUFBLEVBQUEsU0FBQSxJQUFBLFNBQUEsRUFBQSxJQUFBLEVBQUE7Ozs7Ozs7QUMvUUEsQ0FBQSxZQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsMkJBQUEsVUFBQSxRQUFBOztFQUVBLE9BQUEsV0FBQSxZQUFBO0dBQ0EsT0FBQSxRQUFBO0lBQ0EsU0FBQTtLQUNBLE9BQUE7TUFDQSxNQUFBO01BQ0EsUUFBQTtNQUNBLFlBQUE7T0FDQSxZQUFBO09BQ0EsU0FBQTtPQUNBLFVBQUE7T0FDQSxRQUFBO09BQ0EsTUFBQTtPQUNBLFlBQUE7T0FDQSxVQUFBO1FBQ0EsT0FBQTtRQUNBLFNBQUE7UUFDQSxVQUFBO1FBQ0EsUUFBQTs7O01BR0EsV0FBQTtPQUNBLFlBQUE7T0FDQSxXQUFBO09BQ0EsWUFBQTtPQUNBLGdCQUFBO09BQ0EsV0FBQTtPQUNBLGtCQUFBO09BQ0EsWUFBQTtPQUNBLFdBQUE7T0FDQSxhQUFBO09BQ0EsaUJBQUE7O09BRUEsVUFBQTtRQUNBLFFBQUE7UUFDQSxPQUFBOztPQUVBLFVBQUE7T0FDQSxRQUFBO09BQ0EsZUFBQTtPQUNBLE1BQUE7Ozs7SUFJQSxNQUFBOztHQUVBLE9BQUEsT0FBQTs7RUFFQSxJQUFBLFlBQUEsVUFBQSxNQUFBO0dBQ0EsSUFBQSxXQUFBO0dBQ0EsUUFBQSxRQUFBLE1BQUEsVUFBQSxNQUFBO0lBQ0EsSUFBQSxRQUFBO0tBQ0EsUUFBQSxLQUFBO0tBQ0EsUUFBQSxLQUFBO0tBQ0EsU0FBQSxLQUFBO0tBQ0EsWUFBQSxVQUFBLEtBQUE7O0lBRUEsR0FBQSxLQUFBLE1BQUE7S0FDQSxNQUFBLFFBQUEsS0FBQTs7SUFFQSxHQUFBLEtBQUEsS0FBQTtLQUNBLE1BQUEsT0FBQSxLQUFBOztJQUVBLFNBQUEsS0FBQTs7R0FFQSxPQUFBOztFQUVBLE9BQUEsaUJBQUEsWUFBQTtHQUNBLElBQUEsWUFBQTtJQUNBLFFBQUEsT0FBQSxLQUFBO0lBQ0EsU0FBQSxPQUFBLEtBQUE7SUFDQSxZQUFBLFVBQUEsT0FBQSxLQUFBO0lBQ0EsUUFBQTs7R0FFQSxPQUFBLE1BQUEsT0FBQTtHQUNBLE9BQUE7O0VBRUEsT0FBQSxPQUFBLFFBQUEsVUFBQSxHQUFBLEdBQUE7R0FDQSxJQUFBLENBQUEsR0FBQTtJQUNBOztHQUVBLE9BQUE7Ozs7OztBQ3JGQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSw0Q0FBQSxTQUFBLFFBQUEsY0FBQTs7UUFFQSxPQUFBLE9BQUEsVUFBQTs7WUFFQSxjQUFBOzs7UUFHQSxPQUFBLE9BQUEsVUFBQTtTQUNBLGNBQUE7Ozs7OztBQU1BIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHR2YXIgYXBwID0gYW5ndWxhci5tb2R1bGUoJ2FwcCcsXG5cdFx0W1xuXHRcdCdhcHAuY29udHJvbGxlcnMnLFxuXHRcdCdhcHAuZmlsdGVycycsXG5cdFx0J2FwcC5zZXJ2aWNlcycsXG5cdFx0J2FwcC5kaXJlY3RpdmVzJyxcblx0XHQnYXBwLnJvdXRlcycsXG5cdFx0J2FwcC5jb25maWcnLFxuXHRcdF0pO1xuXG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5yb3V0ZXMnLCBbJ3VpLnJvdXRlcicsICduZ1N0b3JhZ2UnLCAnc2F0ZWxsaXplciddKTtcblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycsIFsnc21vb3RoU2Nyb2xsJywndWkucm91dGVyJywgJ25nTWF0ZXJpYWwnLCAnbmdTdG9yYWdlJywgJ3Jlc3Rhbmd1bGFyJywgJ25nTWRJY29ucycsICdhbmd1bGFyLWxvYWRpbmctYmFyJywgJ25nTWVzc2FnZXMnLCAnbmdTYW5pdGl6ZScsIFwibGVhZmxldC1kaXJlY3RpdmVcIiwnbnZkMycsICduZ0NzdkltcG9ydCcsJ3N0aWNreSddKTtcblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5maWx0ZXJzJywgW10pO1xuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLnNlcnZpY2VzJywgWyd1aS5yb3V0ZXInLCAnbmdTdG9yYWdlJywgJ3Jlc3Rhbmd1bGFyJ10pO1xuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmRpcmVjdGl2ZXMnLCBbJ3Ntb290aFNjcm9sbCddKTtcblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb25maWcnLCBbXSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5yb3V0ZXMnKS5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlcil7XG5cblx0XHR2YXIgZ2V0VmlldyA9IGZ1bmN0aW9uKHZpZXdOYW1lKXtcblx0XHRcdHJldHVybiAnL3ZpZXdzL2FwcC8nICsgdmlld05hbWUgKyAnLycgKyB2aWV3TmFtZSArICcuaHRtbCc7XG5cdFx0fTtcblxuXHRcdCR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UoJy8nKTtcblxuXHRcdCRzdGF0ZVByb3ZpZGVyXG5cdFx0XHQuc3RhdGUoJ2FwcCcsIHtcblx0XHRcdFx0YWJzdHJhY3Q6IHRydWUsXG5cdFx0XHRcdHZpZXdzOiB7XG5cdFx0XHRcdC8qXHRzaWRlYmFyOiB7XG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogZ2V0Vmlldygnc2lkZWJhcicpXG5cdFx0XHRcdFx0fSwqL1xuXHRcdFx0XHRcdGhlYWRlcjoge1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6IGdldFZpZXcoJ2hlYWRlcicpXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRtYWluOiB7fVxuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdFx0LnN0YXRlKCdhcHAuZXBpJywge1xuXHRcdFx0XHR1cmw6ICcvZXBpJyxcblx0XHRcdFx0dmlld3M6IHtcblx0XHRcdFx0XHQnbWFpbkAnOiB7XG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogZ2V0VmlldygnZXBpJyksXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiAnRXBpQ3RybCcsXG5cdFx0XHRcdFx0XHRyZXNvbHZlOntcblx0XHRcdFx0XHRcdFx0RVBJOiBmdW5jdGlvbihEYXRhU2VydmljZSl7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIERhdGFTZXJ2aWNlLmdldEFsbCgnL2VwaS95ZWFyLzIwMTQnKVxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHQnbWFwQCc6e1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6IGdldFZpZXcoJ21hcCcpXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdFx0LnN0YXRlKCdhcHAuZXBpLnNlbGVjdGVkJyx7XG5cdFx0XHRcdHVybDogJy86aXRlbSdcblx0XHRcdH0pXG5cdFx0XHQuc3RhdGUoJ2FwcC5pbXBvcnRjc3YnLCB7XG5cdFx0XHRcdHVybDogJy9pbXBvcnRlcicsXG5cdFx0XHRcdGRhdGE6IHtwYWdlTmFtZTogJ0ltcG9ydCBDU1YnfSxcblx0XHRcdFx0dmlld3M6IHtcblx0XHRcdFx0XHQnbWFpbkAnOiB7XG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogZ2V0VmlldygnaW1wb3J0Y3N2Jylcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdCdtYXAnOnt9XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXG5cblxuXHR9KTtcbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5yb3V0ZXMnKS5ydW4oZnVuY3Rpb24oJHJvb3RTY29wZSl7XG5cdFx0JHJvb3RTY29wZS4kb24oXCIkc3RhdGVDaGFuZ2VTdGFydFwiLCBmdW5jdGlvbihldmVudCwgdG9TdGF0ZSl7XG5cdFx0XHRpZiAodG9TdGF0ZS5kYXRhICYmIHRvU3RhdGUuZGF0YS5wYWdlTmFtZSl7XG5cdFx0XHRcdCRyb290U2NvcGUuY3VycmVudF9wYWdlID0gdG9TdGF0ZS5kYXRhLnBhZ2VOYW1lO1xuXHRcdFx0fVxuXHRcdFx0ICRyb290U2NvcGUuc3RhdGVJc0xvYWRpbmcgPSB0cnVlO1xuXHRcdH0pO1xuXHRcdCRyb290U2NvcGUuJG9uKFwiJHN0YXRlQ2hhbmdlU3VjY2Vzc1wiLCBmdW5jdGlvbihldmVudCwgdG9TdGF0ZSl7XG5cdFx0XHQgJHJvb3RTY29wZS5zdGF0ZUlzTG9hZGluZyA9IGZhbHNlO1xuXHRcdH0pO1xuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbiAoKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29uZmlnJykuY29uZmlnKGZ1bmN0aW9uICgkYXV0aFByb3ZpZGVyKXtcbiAgICAgICAgLy8gU2F0ZWxsaXplciBjb25maWd1cmF0aW9uIHRoYXQgc3BlY2lmaWVzIHdoaWNoIEFQSVxuICAgICAgICAvLyByb3V0ZSB0aGUgSldUIHNob3VsZCBiZSByZXRyaWV2ZWQgZnJvbVxuICAgICAgICAkYXV0aFByb3ZpZGVyLmxvZ2luVXJsID0gJy9hcGkvMS9hdXRoZW50aWNhdGUvYXV0aCc7XG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29uZmlnJykuY29uZmlnKGZ1bmN0aW9uIChjZnBMb2FkaW5nQmFyUHJvdmlkZXIpe1xuXHRcdGNmcExvYWRpbmdCYXJQcm92aWRlci5pbmNsdWRlU3Bpbm5lciA9IGZhbHNlO1xuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbmZpZycpLmNvbmZpZyggZnVuY3Rpb24oUmVzdGFuZ3VsYXJQcm92aWRlcikge1xuXHRcdFJlc3Rhbmd1bGFyUHJvdmlkZXJcblx0XHQuc2V0QmFzZVVybCgnL2FwaS8xLycpO1xuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbmZpZycpLmNvbmZpZyhmdW5jdGlvbigkbWRUaGVtaW5nUHJvdmlkZXIpIHtcblx0XHQvKiBGb3IgbW9yZSBpbmZvLCB2aXNpdCBodHRwczovL21hdGVyaWFsLmFuZ3VsYXJqcy5vcmcvIy9UaGVtaW5nLzAxX2ludHJvZHVjdGlvbiAqL1xuXHRcdCRtZFRoZW1pbmdQcm92aWRlci50aGVtZSgnZGVmYXVsdCcpXG5cdFx0LnByaW1hcnlQYWxldHRlKCdpbmRpZ28nKVxuXHRcdC5hY2NlbnRQYWxldHRlKCdncmV5Jylcblx0XHQud2FyblBhbGV0dGUoJ3JlZCcpO1xuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmZpbHRlcnMnKS5maWx0ZXIoICdjYXBpdGFsaXplJywgZnVuY3Rpb24oKXtcblx0XHRyZXR1cm4gZnVuY3Rpb24oaW5wdXQsIGFsbCkge1xuXHRcdFx0cmV0dXJuICghIWlucHV0KSA/IGlucHV0LnJlcGxhY2UoLyhbXlxcV19dK1teXFxzLV0qKSAqL2csZnVuY3Rpb24odHh0KXtcblx0XHRcdFx0cmV0dXJuIHR4dC5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHR4dC5zdWJzdHIoMSkudG9Mb3dlckNhc2UoKTtcblx0XHRcdH0pIDogJyc7XG5cdFx0fTtcblx0fSk7XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZmlsdGVycycpLmZpbHRlciggJ2h1bWFuUmVhZGFibGUnLCBmdW5jdGlvbigpe1xuXHRcdHJldHVybiBmdW5jdGlvbiBodW1hbml6ZShzdHIpIHtcblx0XHRcdGlmICggIXN0ciApe1xuXHRcdFx0XHRyZXR1cm4gJyc7XG5cdFx0XHR9XG5cdFx0XHR2YXIgZnJhZ3MgPSBzdHIuc3BsaXQoJ18nKTtcblx0XHRcdGZvciAodmFyIGk9MDsgaTxmcmFncy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRmcmFnc1tpXSA9IGZyYWdzW2ldLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgZnJhZ3NbaV0uc2xpY2UoMSk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gZnJhZ3Muam9pbignICcpO1xuXHRcdH07XG5cdH0pO1xufSkoKTsiLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5maWx0ZXJzJykuZmlsdGVyKCAndHJ1c3RIdG1sJywgZnVuY3Rpb24oICRzY2UgKXtcblx0XHRyZXR1cm4gZnVuY3Rpb24oIGh0bWwgKXtcblx0XHRcdHJldHVybiAkc2NlLnRydXN0QXNIdG1sKGh0bWwpO1xuXHRcdH07XG5cdH0pO1xufSkoKTsiLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5maWx0ZXJzJykuZmlsdGVyKCd1Y2ZpcnN0JywgZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uKCBpbnB1dCApIHtcblx0XHRcdGlmICggIWlucHV0ICl7XG5cdFx0XHRcdHJldHVybiBudWxsO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGlucHV0LnN1YnN0cmluZygwLCAxKS50b1VwcGVyQ2FzZSgpICsgaW5wdXQuc3Vic3RyaW5nKDEpO1xuXHRcdH07XG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLnNlcnZpY2VzJykuZmFjdG9yeSgnRGF0YVNlcnZpY2UnLCBEYXRhU2VydmljZSk7XG4gICAgRGF0YVNlcnZpY2UuJGluamVjdCA9IFsnUmVzdGFuZ3VsYXInXTtcblxuICAgIGZ1bmN0aW9uIERhdGFTZXJ2aWNlKFJlc3Rhbmd1bGFyKXtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBnZXRBbGw6IGdldEFsbCxcbiAgICAgICAgICBnZXRPbmU6IGdldE9uZVxuICAgICAgICB9O1xuXG4gICAgICAgIGZ1bmN0aW9uIGdldEFsbChyb3V0ZSl7XG4gICAgICAgICAgdmFyIGRhdGEgPSBSZXN0YW5ndWxhci5hbGwocm91dGUpLmdldExpc3QoKTtcbiAgICAgICAgICAgIGRhdGEudGhlbihmdW5jdGlvbigpe30sIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgIGFsZXJ0KCdlcnJvcicpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBnZXRPbmUocm91dGUsIGlkKXtcbiAgICAgICAgICByZXR1cm4gUmVzdGFuZ3VsYXIub25lKHJvdXRlLCBpZCkuZ2V0KCk7XG4gICAgICAgIH1cbiAgICB9XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuc2VydmljZXMnKS5mYWN0b3J5KCdJbmRleFNlcnZpY2UnLCBmdW5jdGlvbigpe1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGdldEVwaTogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgIFx0XHRcdCBuYW1lOidFUEknLFxuICAgICAgICBcdFx0XHQgZnVsbF9uYW1lOiAnRW52aXJvbm1lbnQgUGVyZm9ybWFuY2UgSW5kZXgnLFxuICAgICAgICBcdFx0XHQgdGFibGU6ICdlcGknLFxuICAgICAgICBcdFx0XHQgYWxsQ291bnRyaWVzOiAneWVzJyxcbiAgICAgICAgXHRcdFx0IGNvdW50cmllczogW10sXG4gICAgICAgIFx0XHRcdCBzY29yZV9maWVsZF9uYW1lOiAnc2NvcmUnLFxuICAgICAgICBcdFx0XHQgY2hhbmdlX2ZpZWxkX25hbWU6ICdwZXJjZW50X2NoYW5nZScsXG4gICAgICAgIFx0XHRcdCBvcmRlcl9maWVsZDogJ3llYXInLFxuICAgICAgICBcdFx0XHQgY291bnRyaWVzX2lkX2ZpZWxkOiAnY291bnRyeV9pZCcsXG4gICAgICAgIFx0XHRcdCBjb3VudHJpZXNfaXNvX2ZpZWxkOiAnaXNvJyxcbiAgICAgICAgICAgICAgIGNvbG9yOiAnIzM5MzYzNScsXG4gICAgICAgICAgICAgICBzaXplOjEsXG4gICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogJzxwPlRoZSBFbnZpcm9ubWVudGFsIFBlcmZvcm1hbmNlIEluZGV4IChFUEkpIHJhbmtzIGhvdyB3ZWxsIGNvdW50cmllcyBwZXJmb3JtIG9uIGhpZ2gtcHJpb3JpdHkgZW52aXJvbm1lbnRhbCBpc3N1ZXMgaW4gdHdvIGJyb2FkIHBvbGljeSBhcmVhczogcHJvdGVjdGlvbiBvZiBodW1hbiBoZWFsdGggZnJvbSBlbnZpcm9ubWVudGFsIGhhcm0gYW5kIHByb3RlY3Rpb24gb2YgZWNvc3lzdGVtcy48L3A+PHA+VGhlIEVudmlyb25tZW50YWwgUGVyZm9ybWFuY2UgSW5kZXggKEVQSSkgaXMgY29uc3RydWN0ZWQgdGhyb3VnaCB0aGUgY2FsY3VsYXRpb24gYW5kIGFnZ3JlZ2F0aW9uIG9mIDIwIGluZGljYXRvcnMgcmVmbGVjdGluZyBuYXRpb25hbC1sZXZlbCBlbnZpcm9ubWVudGFsIGRhdGEuIFRoZXNlIGluZGljYXRvcnMgYXJlIGNvbWJpbmVkIGludG8gbmluZSBpc3N1ZSBjYXRlZ29yaWVzLCBlYWNoIG9mIHdoaWNoIGZpdCB1bmRlciBvbmUgb2YgdHdvIG92ZXJhcmNoaW5nIG9iamVjdGl2ZXMuPC9wPicsXG4gICAgICAgICAgICAgICBjYXB0aW9uOiAnVGhlIDIwMTQgRVBJIEZyYW1ld29yayBpbmNsdWRlcyA5IGlzc3VlcyBhbmQgMjAgaW5kaWNhdG9ycy4gQWNjZXNzIHRvIEVsZWN0cmljaXR5IGlzIG5vdCBpbmNsdWRlZCBpbiB0aGUgZmlndXJlIGJlY2F1c2UgaXQgaXMgbm90IHVzZWQgdG8gY2FsY3VsYXRlIGNvdW50cnkgc2NvcmVzLiBDbGljayBvbiB0aGUgaW50ZXJhY3RpdmUgZmlndXJlIGFib3ZlIHRvIGV4cGxvcmUgdGhlIEVQSSBmcmFtZXdvcmsuJyxcbiAgICAgICAgICAgICAgIGNoaWxkcmVuOlt7XG4gICAgICAgIFx0XHRcdFx0IGNvbHVtbl9uYW1lOiAnZWgnLFxuICAgICAgICBcdFx0XHRcdCB0aXRsZTogJ0Vudmlyb21lbnRhbCBIZWFsdGgnLFxuICAgICAgICBcdFx0XHRcdCByYW5nZTpbMCwgMTAwXSxcbiAgICAgICAgXHRcdFx0XHQgaWNvbjonJyxcbiAgICAgICAgXHRcdFx0XHQgY29sb3I6JyNjYzNmMTYnLFxuICAgICAgICBcdFx0XHRcdCBjaGlsZHJlbjpbe1xuICAgICAgICBcdFx0XHRcdFx0IGNvbHVtbl9uYW1lOidlaF9oaScsXG4gICAgICAgIFx0XHRcdFx0XHQgdGl0bGU6J0hlYWx0aCBJbXBhY3QnLFxuICAgICAgICBcdFx0XHRcdFx0IGljb246ICdtYW4nLFxuICAgICAgICBcdFx0XHRcdFx0IHVuaWNvZGU6ICdcXHVlNjA1JyxcbiAgICAgICAgXHRcdFx0XHRcdCBjb2xvcjogJyNmMzk0MTknLFxuICAgICAgICBcdFx0XHRcdFx0IGNoaWxkcmVuOlt7XG4gICAgICAgIFx0XHRcdFx0XHRcdCBjb2x1bW5fbmFtZTogJ2VoX2hpX2NoaWxkX21vcnRhbGl0eScsXG4gICAgICAgIFx0XHRcdFx0XHRcdCB0aXRsZTonQ2hpbGQgTW9ydGFsaXR5JyxcbiAgICAgICAgICAgICAgICAgICAgIHNpemU6NjA3NCxcbiAgICAgICAgXHRcdFx0XHRcdFx0IGljb246JycsXG4gICAgICAgIFx0XHRcdFx0XHRcdCBjb2xvcjonI2Y3YTkzNycsXG4gICAgICAgIFx0XHRcdFx0XHRcdCBkZXNjcmlwdGlvbjonUHJvYmFiaWxpdHkgb2YgZHlpbmcgYmV0d2VlbiBhIGNoaWxkcyBmaXJzdCBhbmQgZmlmdGggYmlydGhkYXlzIChiZXR3ZWVuIGFnZSAxIGFuZCA1KSdcbiAgICAgICAgXHRcdFx0XHRcdCB9XVxuICAgICAgICBcdFx0XHRcdCB9LHtcbiAgICAgICAgXHRcdFx0XHRcdCBjb2x1bW5fbmFtZTonZWhfYXEnLFxuICAgICAgICBcdFx0XHRcdFx0IHRpdGxlOidBaXIgUXVhbGl0eScsXG4gICAgICAgIFx0XHRcdFx0XHQgY29sb3I6ICcjZjZjNzBhJyxcbiAgICAgICAgXHRcdFx0XHRcdCBpY29uOiAnc2luaycsXG4gICAgICAgIFx0XHRcdFx0XHQgdW5pY29kZTogJ1xcdWU2MDQnLFxuICAgICAgICBcdFx0XHRcdFx0IGNoaWxkcmVuOlt7XG4gICAgICAgIFx0XHRcdFx0XHRcdCBjb2x1bW5fbmFtZTogJ2VoX2FxX2hvdXNlaG9sZF9haXJfcXVhbGl0eScsXG4gICAgICAgIFx0XHRcdFx0XHRcdCB0aXRsZTonSG91c2Vob2xkIEFpciBRdWFsaXR5JyxcbiAgICAgICAgICAgICAgICAgICAgIHNpemU6MjAwMyxcbiAgICAgICAgXHRcdFx0XHRcdFx0IGljb246JycsXG4gICAgICAgIFx0XHRcdFx0XHRcdCBjb2xvcjonI2ZhZDMzZCcsXG4gICAgICAgIFx0XHRcdFx0XHRcdCBkZXNjcmlwdGlvbjonUGVyY2VudGFnZSBvZiB0aGUgcG9wdWxhdGlvbiB1c2luZyBzb2xpZCBmdWVscyBhcyBwcmltYXJ5IGNvb2tpbmcgZnVlbC4nXG4gICAgICAgIFx0XHRcdFx0XHQgfSx7XG4gICAgICAgIFx0XHRcdFx0XHRcdCBjb2x1bW5fbmFtZTogJ2VoX2FxX2V4cG9zdXJlX3BtMjUnLFxuICAgICAgICBcdFx0XHRcdFx0XHQgdGl0bGU6J0FpciBQb2xsdXRpb24gLSBBdmVyYWdlIEV4cG9zdXJlIHRvIFBNMi41JyxcbiAgICAgICAgICAgICAgICAgICAgIHNpemU6MjAwMyxcbiAgICAgICAgXHRcdFx0XHRcdFx0IGljb246JycsXG4gICAgICAgIFx0XHRcdFx0XHRcdCBjb2xvcjonI2ZhZGQ2YycsXG4gICAgICAgIFx0XHRcdFx0XHRcdCBkZXNjcmlwdGlvbjonUG9wdWxhdGlvbiB3ZWlnaHRlZCBleHBvc3VyZSB0byBQTTIuNSAodGhyZWUtIHllYXIgYXZlcmFnZSknXG4gICAgICAgIFx0XHRcdFx0XHQgfSx7XG4gICAgICAgIFx0XHRcdFx0XHRcdCBjb2x1bW5fbmFtZTogJ2VoX2FxX2V4Y2VlZGFuY2VfcG0yNScsXG4gICAgICAgIFx0XHRcdFx0XHRcdCB0aXRsZTonQWlyIFBvbGx1dGlvbiAtIFBNMi41IEV4Y2VlZGFuY2UnLFxuICAgICAgICAgICAgICAgICAgICAgc2l6ZToyMDAzLFxuICAgICAgICBcdFx0XHRcdFx0XHQgaWNvbjonJyxcbiAgICAgICAgXHRcdFx0XHRcdFx0IGNvbG9yOicjZmRlOTljJyxcbiAgICAgICAgXHRcdFx0XHRcdFx0IGRlc2NyaXB0aW9uOidQcm9wb3J0aW9uIG9mIHRoZSBwb3B1bGF0aW9uIHdob3NlIGV4cG9zdXJlIGlzIGFib3ZlICBXSE8gdGhyZXNob2xkcyAoMTAsIDE1LCAyNSwgMzUgbWljcm9ncmFtcy9tMyknXG4gICAgICAgIFx0XHRcdFx0XHQgfV1cbiAgICAgICAgXHRcdFx0XHQgfSx7XG4gICAgICAgIFx0XHRcdFx0XHQgY29sdW1uX25hbWU6J2VoX3dzJyxcbiAgICAgICAgXHRcdFx0XHRcdCB0aXRsZTonV2F0ZXIgU2FuaXRhdGlvbicsXG4gICAgICAgIFx0XHRcdFx0XHQgY29sb3I6ICcjZWQ2YzJlJyxcbiAgICAgICAgXHRcdFx0XHRcdCBpY29uOiAnZmFicmljJyxcbiAgICAgICAgXHRcdFx0XHRcdCB1bmljb2RlOiAnXFx1ZTYwNicsXG4gICAgICAgIFx0XHRcdFx0XHQgY2hpbGRyZW46W3tcbiAgICAgICAgXHRcdFx0XHRcdFx0Y29sdW1uX25hbWU6ICdlaF93c19hY2Nlc3NfdG9fZHJpbmtpbmdfd2F0ZXInLFxuICAgICAgICBcdFx0XHRcdFx0XHR0aXRsZTonQWNjZXNzIHRvIERyaW5raW5nIFdhdGVyJyxcbiAgICAgICAgICAgICAgICAgICAgc2l6ZToyODgwLFxuICAgICAgICBcdFx0XHRcdFx0XHRpY29uOicnLFxuICAgICAgICBcdFx0XHRcdFx0XHRjb2xvcjonI2YxODc1MycsXG4gICAgICAgIFx0XHRcdFx0XHRcdGRlc2NyaXB0aW9uOidQZXJjZW50YWdlIG9mIHBvcHVsYXRpb24gd2l0aCBhY2Nlc3MgdG8gaW1wcm92ZWQgZHJpbmtpbmcgd2F0ZXIgc291cmNlJ1xuICAgICAgICBcdFx0XHRcdFx0fSx7XG4gICAgICAgIFx0XHRcdFx0XHRcdGNvbHVtbl9uYW1lOiAnZWhfd3NfYWNjZXNzX3RvX3Nhbml0YXRpb24nLFxuICAgICAgICBcdFx0XHRcdFx0XHR0aXRsZTonQWNjZXNzIHRvIFNhbml0YXRpb24nLFxuICAgICAgICAgICAgICAgICAgICBzaXplOjI4ODAsXG4gICAgICAgIFx0XHRcdFx0XHRcdGljb246JycsXG4gICAgICAgIFx0XHRcdFx0XHRcdGNvbG9yOicjZjVhNDdkJyxcbiAgICAgICAgXHRcdFx0XHRcdFx0ZGVzY3JpcHRpb246J1BlcmNlbnRhZ2Ugb2YgcG9wdWxhdGlvbiB3aXRoIGFjY2VzcyB0byBpbXByb3ZlZCBzYW5pdGF0aW9uJ1xuICAgICAgICBcdFx0XHRcdFx0fV1cbiAgICAgICAgXHRcdFx0XHQgfV1cbiAgICAgICAgXHRcdFx0IH0se1xuICAgICAgICBcdFx0XHRcdCBjb2x1bW5fbmFtZTogJ2V2JyxcbiAgICAgICAgXHRcdFx0XHQgdGl0bGU6ICdFY29zeXN0ZW0gVmFsaWRpdHknLFxuICAgICAgICBcdFx0XHRcdCByYW5nZTpbMCwgMTAwXSxcbiAgICAgICAgXHRcdFx0XHQgaWNvbjonJyxcbiAgICAgICAgXHRcdFx0XHQgY29sb3I6JyMwMzYzODUnLFxuICAgICAgICBcdFx0XHRcdCBjaGlsZHJlbjpbe1xuICAgICAgICBcdFx0XHRcdFx0IGNvbHVtbl9uYW1lOidldl93cicsXG4gICAgICAgIFx0XHRcdFx0XHQgdGl0bGU6J1dhdGVyIFJlc291cmNlcycsXG4gICAgICAgIFx0XHRcdFx0XHQgY29sb3I6ICcjN2E4ZGM3JyxcbiAgICAgICAgXHRcdFx0XHRcdCBpY29uOiAnd2F0ZXInLFxuICAgICAgICBcdFx0XHRcdFx0IHVuaWNvZGU6ICdcXHVlNjA4JyxcbiAgICAgICAgXHRcdFx0XHRcdCBjaGlsZHJlbjpbe1xuICAgICAgICBcdFx0XHRcdFx0XHQgY29sdW1uX25hbWU6ICdldl93cl93YXN0ZXdhdGVyX3RyZWF0bWVudCcsXG4gICAgICAgIFx0XHRcdFx0XHRcdCB0aXRsZTonV2FzdGV3YXRlciBUcmVhdG1lbnQnLFxuICAgICAgICAgICAgICAgICAgICAgc2l6ZTo0MDAwLFxuICAgICAgICBcdFx0XHRcdFx0XHQgaWNvbjonJyxcbiAgICAgICAgXHRcdFx0XHRcdFx0IGNvbG9yOicjOTVhNmQ1JyxcbiAgICAgICAgXHRcdFx0XHRcdFx0IGRlc2NyaXB0aW9uOidXYXN0ZXdhdGVyIHRyZWF0bWVudCBsZXZlbCB3ZWlnaHRlZCBieSBjb25uZWN0aW9uIHRvIHdhc3Rld2F0ZXIgdHJlYXRtZW50IHJhdGUuJ1xuICAgICAgICBcdFx0XHRcdFx0IH1dXG4gICAgICAgIFx0XHRcdFx0IH0se1xuICAgICAgICBcdFx0XHRcdFx0IGNvbHVtbl9uYW1lOidldl9hZycsXG4gICAgICAgIFx0XHRcdFx0XHQgdGl0bGU6J0FncmljdWx0dXJlJyxcbiAgICAgICAgXHRcdFx0XHRcdCBjb2xvcjogJyMyZTc0YmEnLFxuICAgICAgICBcdFx0XHRcdFx0IGljb246ICdhZ3JhcicsXG4gICAgICAgIFx0XHRcdFx0XHQgdW5pY29kZTogJ1xcdWU2MDAnLFxuICAgICAgICBcdFx0XHRcdFx0IGNoaWxkcmVuOlt7XG4gICAgICAgIFx0XHRcdFx0XHRcdCBjb2x1bW5fbmFtZTogJ2V2X2FnX2FncmljdWx0dXJhbF9zdWJzaWRpZXMnLFxuICAgICAgICBcdFx0XHRcdFx0XHQgdGl0bGU6J0FncmljdWx0dXJhbCBTdWJzaWRpZXMnLFxuICAgICAgICAgICAgICAgICAgICAgc2l6ZTo3OTYsXG4gICAgICAgIFx0XHRcdFx0XHRcdCBpY29uOicnLFxuICAgICAgICBcdFx0XHRcdFx0XHQgY29sb3I6JyM4MmFiZDYnLFxuICAgICAgICBcdFx0XHRcdFx0XHQgZGVzY3JpcHRpb246J1N1YnNpZGllcyBhcmUgZXhwcmVzc2VkIGluIHByaWNlIG9mIHRoZWlyIHByb2R1Y3QgaW4gdGhlIGRvbWVzdGljIG1hcmtldCAocGx1cyBhbnkgZGlyZWN0IG91dHB1dCBzdWJzaWR5KSBsZXNzIGl0cyBwcmljZSBhdCB0aGUgYm9yZGVyLCBleHByZXNzZWQgYXMgYSBwZXJjZW50YWdlIG9mIHRoZSBib3JkZXIgcHJpY2UgKGFkanVzdGluZyBmb3IgdHJhbnNwb3J0IGNvc3RzIGFuZCBxdWFsaXR5IGRpZmZlcmVuY2VzKS4nXG4gICAgICAgIFx0XHRcdFx0XHQgfSx7XG4gICAgICAgIFx0XHRcdFx0XHRcdCBjb2x1bW5fbmFtZTogJ2V2X2FnX3Blc3RpY2lkZV9yZWd1bGF0aW9uJyxcbiAgICAgICAgXHRcdFx0XHRcdFx0IHRpdGxlOidQZXN0aWNpZGUgUmVndWxhdGlvbicsXG4gICAgICAgICAgICAgICAgICAgICBzaXplOjc5NixcbiAgICAgICAgXHRcdFx0XHRcdFx0IGljb246JycsXG4gICAgICAgIFx0XHRcdFx0XHRcdCBjb2xvcjonIzU3OGZjOCcsXG4gICAgICAgIFx0XHRcdFx0XHRcdCBkZXNjcmlwdGlvbjonV2FzdGV3YXRlciB0cmVhdG1lbnQgbGV2ZWwgd2VpZ2h0ZWQgYnkgY29ubmVjdGlvbiB0byB3YXN0ZXdhdGVyIHRyZWF0bWVudCByYXRlLidcbiAgICAgICAgXHRcdFx0XHRcdCB9XVxuICAgICAgICBcdFx0XHRcdCB9LHtcbiAgICAgICAgXHRcdFx0XHRcdCBjb2x1bW5fbmFtZTonZXZfZm8nLFxuICAgICAgICBcdFx0XHRcdFx0IHRpdGxlOidGb3Jlc3QnLFxuICAgICAgICBcdFx0XHRcdFx0IGNvbG9yOiAnIzAwOWFjYicsXG4gICAgICAgIFx0XHRcdFx0XHQgaWNvbjogJ3RyZWUnLFxuICAgICAgICBcdFx0XHRcdFx0IHVuaWNvZGU6ICdcXHVlNjA3JyxcbiAgICAgICAgXHRcdFx0XHRcdCBjaGlsZHJlbjpbe1xuICAgICAgICBcdFx0XHRcdFx0XHQgY29sdW1uX25hbWU6ICdldl9mb19jaGFuZ2VfaW5fZm9yZXN0X2NvdmVyJyxcbiAgICAgICAgXHRcdFx0XHRcdFx0IHRpdGxlOidDaGFuZ2UgaW4gRm9yZXN0IENvdmVyJyxcbiAgICAgICAgICAgICAgICAgICAgIHNpemU6MTU1MCxcbiAgICAgICAgXHRcdFx0XHRcdFx0IGljb246JycsXG4gICAgICAgIFx0XHRcdFx0XHRcdCBjb2xvcjonIzMxYWVkNScsXG4gICAgICAgIFx0XHRcdFx0XHRcdCBkZXNjcmlwdGlvbjonRm9yZXN0IGxvc3MgLSBGb3Jlc3QgZ2FpbiBpbiA+IDUwJSB0cmVlIGNvdmVyLCBhcyBjb21wYXJlZCB0byAyMDAwIGxldmVscy4nXG4gICAgICAgIFx0XHRcdFx0XHQgfV1cbiAgICAgICAgXHRcdFx0XHQgfSx7XG4gICAgICAgIFx0XHRcdFx0XHQgY29sdW1uX25hbWU6J2V2X2ZpJyxcbiAgICAgICAgXHRcdFx0XHRcdCB0aXRsZTonRmlzaGVyaWVzJyxcbiAgICAgICAgXHRcdFx0XHRcdCBjb2xvcjogJyMwMDhjOGMnLFxuICAgICAgICBcdFx0XHRcdFx0IGljb246ICdhbmNob3InLFxuICAgICAgICBcdFx0XHRcdFx0IHVuaWNvZGU6ICdcXHVlNjAxJyxcbiAgICAgICAgXHRcdFx0XHRcdCBjaGlsZHJlbjpbe1xuICAgICAgICBcdFx0XHRcdFx0XHQgY29sdW1uX25hbWU6ICdldl9maV9jb2FzdGFsX3NoZWxmX2Zpc2hpbmdfcHJlc3N1cmUnLFxuICAgICAgICBcdFx0XHRcdFx0XHQgdGl0bGU6J0NvYXN0YWwgU2hlbGYgRmlzaGluZyBQcmVzc3VyZScsXG4gICAgICAgICAgICAgICAgICAgICBzaXplOjkwMSxcbiAgICAgICAgXHRcdFx0XHRcdFx0IGljb246JycsXG4gICAgICAgIFx0XHRcdFx0XHRcdCBjb2xvcjonIzY1YjhiNycsXG4gICAgICAgIFx0XHRcdFx0XHRcdCBkZXNjcmlwdGlvbjonQ2F0Y2ggaW4gbWV0cmljIHRvbnMgZnJvbSB0cmF3bGluZyBhbmQgZHJlZGdpbmcgZ2VhcnMgKG1vc3RseSBib3R0b20gdHJhd2xzKSBkaXZpZGVkIGJ5IEVFWiBhcmVhLidcbiAgICAgICAgXHRcdFx0XHRcdCB9LHtcbiAgICAgICAgXHRcdFx0XHRcdFx0IGNvbHVtbl9uYW1lOiAnZXZfZmlfZmlzaF9zdG9ja3MnLFxuICAgICAgICBcdFx0XHRcdFx0XHQgdGl0bGU6J0Zpc2ggU3RvY2tzJyxcbiAgICAgICAgICAgICAgICAgICAgIHNpemU6OTAxLFxuICAgICAgICBcdFx0XHRcdFx0XHQgaWNvbjonJyxcbiAgICAgICAgXHRcdFx0XHRcdFx0IGNvbG9yOicjMzBhMmEyJyxcbiAgICAgICAgXHRcdFx0XHRcdFx0IGRlc2NyaXB0aW9uOidQZXJjZW50YWdlIG9mIGZpc2hpbmcgc3RvY2tzIG92ZXJleHBsb2l0ZWQgYW5kIGNvbGxhcHNlZCBmcm9tIEVFWi4nXG4gICAgICAgIFx0XHRcdFx0XHQgfV1cbiAgICAgICAgXHRcdFx0XHQgfSx7XG4gICAgICAgIFx0XHRcdFx0XHQgY29sdW1uX25hbWU6J2V2X2JkJyxcbiAgICAgICAgXHRcdFx0XHRcdCB0aXRsZTonQmlvZGl2ZXJzaXR5IGFuZCBIYWJpdGF0JyxcbiAgICAgICAgXHRcdFx0XHRcdCBjb2xvcjogJyM0NGI2YTAnLFxuICAgICAgICBcdFx0XHRcdFx0IGljb246ICdidXR0ZXJmbHknLFxuICAgICAgICBcdFx0XHRcdFx0IHVuaWNvZGU6ICdcXHVlNjAyJyxcbiAgICAgICAgXHRcdFx0XHRcdCBjaGlsZHJlbjpbe1xuICAgICAgICBcdFx0XHRcdFx0XHQgY29sdW1uX25hbWU6ICdldl9iZF90ZXJyZXN0cmlhbF9wcm90ZWN0ZWRfYXJlYXNfbmF0aW9uYWxfYmlvbWUnLFxuICAgICAgICBcdFx0XHRcdFx0XHQgdGl0bGU6J05hdGlvbmFsIEJpb21lIFByb3RlY3Rpb24nLFxuICAgICAgICAgICAgICAgICAgICAgc2l6ZToxMDc0LFxuICAgICAgICBcdFx0XHRcdFx0XHQgaWNvbjonJyxcbiAgICAgICAgXHRcdFx0XHRcdFx0IGNvbG9yOicjY2VlOGU3JyxcbiAgICAgICAgXHRcdFx0XHRcdFx0IGRlc2NyaXB0aW9uOidQZXJjZW50YWdlIG9mIHRlcnJlc3RyaWFsIGJpb21lIGFyZWEgdGhhdCBpcyBwcm90ZWN0ZWQsIHdlaWdodGVkIGJ5IGRvbWVzdGljIGJpb21lIGFyZWEuJ1xuICAgICAgICBcdFx0XHRcdFx0IH0se1xuICAgICAgICBcdFx0XHRcdFx0XHQgY29sdW1uX25hbWU6ICdldl9iZF90ZXJyZXN0cmlhbF9wcm90ZWN0ZWRfYXJlYXNfZ2xvYmFsX2Jpb21lJyxcbiAgICAgICAgXHRcdFx0XHRcdFx0IHRpdGxlOidHbG9iYWwgQmlvbWUgUHJvdGVjdGlvbicsXG4gICAgICAgICAgICAgICAgICAgICBzaXplOjEwNzQsXG4gICAgICAgIFx0XHRcdFx0XHRcdCBpY29uOicnLFxuICAgICAgICBcdFx0XHRcdFx0XHQgY29sb3I6JyNhMmQ1ZDEnLFxuICAgICAgICBcdFx0XHRcdFx0XHQgZGVzY3JpcHRpb246J1BlcmNlbnRhZ2Ugb2YgdGVycmVzdHJpYWwgYmlvbWUgYXJlYSB0aGF0IGlzIHByb3RlY3RlZCwgd2VpZ2h0ZWQgYnkgZ2xvYmFsIGJpb21lIGFyZWEuJ1xuICAgICAgICBcdFx0XHRcdFx0IH0se1xuICAgICAgICBcdFx0XHRcdFx0XHQgY29sdW1uX25hbWU6ICdldl9iZF9tYXJpbmVfcHJvdGVjdGVkX2FyZWFzJyxcbiAgICAgICAgXHRcdFx0XHRcdFx0IHRpdGxlOidNYXJpbmUgUHJvdGVjdGVkIEFyZWFzJyxcbiAgICAgICAgICAgICAgICAgICAgIHNpemU6MTA3NCxcbiAgICAgICAgXHRcdFx0XHRcdFx0IGljb246JycsXG4gICAgICAgIFx0XHRcdFx0XHRcdCBjb2xvcjonIzc3YzFiOScsXG4gICAgICAgIFx0XHRcdFx0XHRcdCBkZXNjcmlwdGlvbjonTWFyaW5lIHByb3RlY3RlZCBhcmVhcyBhcyBhIHBlcmNlbnQgb2YgRUVaLidcbiAgICAgICAgXHRcdFx0XHRcdCB9LHtcbiAgICAgICAgXHRcdFx0XHRcdFx0IGNvbHVtbl9uYW1lOiAnZXZfYmRfY3JpdGljYWxfaGFiaXRhdF9wcm90ZWN0aW9uJyxcbiAgICAgICAgXHRcdFx0XHRcdFx0IHRpdGxlOidDcml0aWNhbCBIYWJpdGF0IFByb3RlY3Rpb24nLFxuICAgICAgICAgICAgICAgICAgICAgc2l6ZToxMDc0LFxuICAgICAgICBcdFx0XHRcdFx0XHQgaWNvbjonJyxcbiAgICAgICAgXHRcdFx0XHRcdFx0IGNvbG9yOicjNThiYmFlJyxcbiAgICAgICAgXHRcdFx0XHRcdFx0IGRlc2NyaXB0aW9uOidQZXJjZW50YWdlIG9mIHRlcnJlc3RyaWFsIGJpb21lIGFyZWEgdGhhdCBpcyBwcm90ZWN0ZWQsIHdlaWdodGVkIGJ5IGdsb2JhbCBiaW9tZSBhcmVhLidcbiAgICAgICAgXHRcdFx0XHRcdCB9XVxuICAgICAgICBcdFx0XHRcdCB9LHtcbiAgICAgICAgXHRcdFx0XHRcdCBjb2x1bW5fbmFtZTonZXZfY2UnLFxuICAgICAgICBcdFx0XHRcdFx0IHRpdGxlOidDbGltYXRlIGFuZCBFbmVyZ3knLFxuICAgICAgICBcdFx0XHRcdFx0IGNvbG9yOiAnIzNiYWQ1ZScsXG4gICAgICAgIFx0XHRcdFx0XHQgaWNvbjogJ2VuZXJneScsXG4gICAgICAgIFx0XHRcdFx0XHQgdW5pY29kZTogJ1xcdWU2MDMnLFxuICAgICAgICBcdFx0XHRcdFx0IGNoaWxkcmVuOlt7XG4gICAgICAgIFx0XHRcdFx0XHRcdCBjb2x1bW5fbmFtZTogJ2V2X2NlX3RyZW5kX2luX2NhcmJvbl9pbnRlbnNpdHknLFxuICAgICAgICBcdFx0XHRcdFx0XHQgdGl0bGU6J1RyZW5kIGluIENhcmJvbiBJbnRlbnNpdHknLFxuICAgICAgICAgICAgICAgICAgICAgc2l6ZToxNTE0LFxuICAgICAgICBcdFx0XHRcdFx0XHQgaWNvbjonJyxcbiAgICAgICAgXHRcdFx0XHRcdFx0IGNvbG9yOicjNTliNTdhJyxcbiAgICAgICAgXHRcdFx0XHRcdFx0IGRlc2NyaXB0aW9uOidDaGFuZ2UgaW4gQ08yIGVtaXNzaW9ucyBwZXIgdW5pdCBHRFAgZnJvbSAxOTkwIHRvIDIwMTAuJ1xuICAgICAgICBcdFx0XHRcdFx0IH0se1xuICAgICAgICBcdFx0XHRcdFx0XHQgY29sdW1uX25hbWU6ICdldl9jZV9jaGFuZ2Vfb2ZfdHJlbmRfaW5fY2FyYm9uX2ludGVzaXR5JyxcbiAgICAgICAgXHRcdFx0XHRcdFx0IHRpdGxlOidDaGFuZ2Ugb2YgVHJlbmQgaW4gQ2FyYm9uIEludGVuc2l0eScsXG4gICAgICAgICAgICAgICAgICAgICBzaXplOjE1MTQsXG4gICAgICAgIFx0XHRcdFx0XHRcdCBpY29uOicnLFxuICAgICAgICBcdFx0XHRcdFx0XHQgY29sb3I6JyM4MGMzOTknLFxuICAgICAgICBcdFx0XHRcdFx0XHQgZGVzY3JpcHRpb246J0NoYW5nZSBpbiBUcmVuZCBvZiBDTzIgZW1pc3Npb25zIHBlciB1bml0IEdEUCBmcm9tIDE5OTAgdG8gMjAwMDsgMjAwMCB0byAyMDEwLidcbiAgICAgICAgXHRcdFx0XHRcdCB9LHtcbiAgICAgICAgXHRcdFx0XHRcdFx0IGNvbHVtbl9uYW1lOiAnZXZfY2VfdHJlbmRfaW5fY28yX2VtaXNzaW9uc19wZXJfa3doJyxcbiAgICAgICAgXHRcdFx0XHRcdFx0IHRpdGxlOidUcmVuZCBpbiBDTzIgRW1pc3Npb25zIHBlciBLV0gnLFxuICAgICAgICAgICAgICAgICAgICAgc2l6ZToxNTE0LFxuICAgICAgICBcdFx0XHRcdFx0XHQgaWNvbjonJyxcbiAgICAgICAgXHRcdFx0XHRcdFx0IGNvbG9yOicjYThkNGI4JyxcbiAgICAgICAgXHRcdFx0XHRcdFx0IGRlc2NyaXB0aW9uOidDaGFuZ2UgaW4gQ08yIGVtaXNzaW9ucyBmcm9tIGVsZWN0cmljaXR5IGFuZCBoZWF0IHByb2R1Y3Rpb24uJ1xuICAgICAgICBcdFx0XHRcdFx0IH1dXG4gICAgICAgIFx0XHRcdFx0IH1dXG4gICAgICAgIFx0XHRcdCB9XVxuICAgICAgICBcdFx0fTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5zZXJ2aWNlcycpLmZhY3RvcnkoJ01hcFNlcnZpY2UnLCBmdW5jdGlvbihsZWFmbGV0RGF0YSl7XG4gICAgICAgIC8vXG4gICAgICAgIHZhciBsZWFmbGV0ID0ge307XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgc2V0TGVhZmxldERhdGE6IGZ1bmN0aW9uKGxlYWYpe1xuICAgICAgICAgICAgbGVhZmxldCA9IGxlYWZsZXQ7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBnZXRMZWFmbGV0RGF0YTogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHJldHVybiBsZWFmbGV0O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKFwiYXBwLnNlcnZpY2VzXCIpLmZhY3RvcnkoJ0RpYWxvZ1NlcnZpY2UnLCBmdW5jdGlvbigkbWREaWFsb2cpe1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdGZyb21UZW1wbGF0ZTogZnVuY3Rpb24odGVtcGxhdGUsICRzY29wZSl7XG5cblx0XHRcdFx0dmFyIG9wdGlvbnMgPSB7XG5cdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICcvdmlld3MvZGlhbG9ncy8nICsgdGVtcGxhdGUgKyAnLycgKyB0ZW1wbGF0ZSArICcuaHRtbCdcblx0XHRcdFx0fTtcblxuXHRcdFx0XHRpZiAoJHNjb3BlKXtcblx0XHRcdFx0XHRvcHRpb25zLnNjb3BlID0gJHNjb3BlLiRuZXcoKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiAkbWREaWFsb2cuc2hvdyhvcHRpb25zKTtcblx0XHRcdH0sXG5cblx0XHRcdGhpZGU6IGZ1bmN0aW9uKCl7XG5cdFx0XHRcdHJldHVybiAkbWREaWFsb2cuaGlkZSgpO1xuXHRcdFx0fSxcblxuXHRcdFx0YWxlcnQ6IGZ1bmN0aW9uKHRpdGxlLCBjb250ZW50KXtcblx0XHRcdFx0JG1kRGlhbG9nLnNob3coXG5cdFx0XHRcdFx0JG1kRGlhbG9nLmFsZXJ0KClcblx0XHRcdFx0XHRcdC50aXRsZSh0aXRsZSlcblx0XHRcdFx0XHRcdC5jb250ZW50KGNvbnRlbnQpXG5cdFx0XHRcdFx0XHQub2soJ09rJylcblx0XHRcdFx0KTtcblx0XHRcdH1cblx0XHR9O1xuXHR9KTtcbn0pKCk7IiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKFwiYXBwLnNlcnZpY2VzXCIpLmZhY3RvcnkoJ1RvYXN0U2VydmljZScsIGZ1bmN0aW9uKCRtZFRvYXN0KXtcblxuXHRcdHZhciBkZWxheSA9IDYwMDAsXG5cdFx0XHRwb3NpdGlvbiA9ICd0b3AgcmlnaHQnLFxuXHRcdFx0YWN0aW9uID0gJ09LJztcblxuXHRcdHJldHVybiB7XG5cdFx0XHRzaG93OiBmdW5jdGlvbihjb250ZW50KXtcblx0XHRcdFx0aWYgKCFjb250ZW50KXtcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm4gJG1kVG9hc3Quc2hvdyhcblx0XHRcdFx0XHQkbWRUb2FzdC5zaW1wbGUoKVxuXHRcdFx0XHRcdFx0LmNvbnRlbnQoY29udGVudClcblx0XHRcdFx0XHRcdC5wb3NpdGlvbihwb3NpdGlvbilcblx0XHRcdFx0XHRcdC5hY3Rpb24oYWN0aW9uKVxuXHRcdFx0XHRcdFx0LmhpZGVEZWxheShkZWxheSlcblx0XHRcdFx0KTtcblx0XHRcdH0sXG5cdFx0XHRlcnJvcjogZnVuY3Rpb24oY29udGVudCl7XG5cdFx0XHRcdGlmICghY29udGVudCl7XG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuICRtZFRvYXN0LnNob3coXG5cdFx0XHRcdFx0JG1kVG9hc3Quc2ltcGxlKClcblx0XHRcdFx0XHRcdC5jb250ZW50KGNvbnRlbnQpXG5cdFx0XHRcdFx0XHQucG9zaXRpb24ocG9zaXRpb24pXG5cdFx0XHRcdFx0XHQudGhlbWUoJ3dhcm4nKVxuXHRcdFx0XHRcdFx0LmFjdGlvbihhY3Rpb24pXG5cdFx0XHRcdFx0XHQuaGlkZURlbGF5KGRlbGF5KVxuXHRcdFx0XHQpO1xuXHRcdFx0fVxuXHRcdH07XG5cdH0pO1xufSkoKTsiLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0RpYWxvZ3NDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBEaWFsb2dTZXJ2aWNlKXtcblx0XHQkc2NvcGUuYWxlcnREaWFsb2cgPSBmdW5jdGlvbigpe1xuXHRcdFx0RGlhbG9nU2VydmljZS5hbGVydCgnVGhpcyBpcyBhbiBhbGVydCB0aXRsZScsICdZb3UgY2FuIHNwZWNpZnkgc29tZSBkZXNjcmlwdGlvbiB0ZXh0IGluIGhlcmUuJyk7XG5cdFx0fTtcblxuXHRcdCRzY29wZS5jdXN0b21EaWFsb2cgPSBmdW5jdGlvbigpe1xuXHRcdFx0RGlhbG9nU2VydmljZS5mcm9tVGVtcGxhdGUoJ2FkZF91c2VycycsICRzY29wZSk7XG5cdFx0fTtcblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdFbGl4aXJDdHJsJywgZnVuY3Rpb24oKXtcbiAgICAgICAgLy9cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdFcGlDdHJsJywgZnVuY3Rpb24gKCRzY29wZSwkc3RhdGUsICR0aW1lb3V0LCBzbW9vdGhTY3JvbGwsIEluZGV4U2VydmljZSwgRVBJLCBEYXRhU2VydmljZSwgbGVhZmxldERhdGEsIE1hcFNlcnZpY2UpIHtcblxuXHRcdCRzY29wZS5jdXJyZW50ID0gXCJcIjtcblx0XHQkc2NvcGUuZGlzcGxheSA9IHtcblx0XHRcdHNlbGVjdGVkQ2F0OiAnJyxcblx0XHRcdHJhbms6IFt7XG5cdFx0XHRcdGZpZWxkczoge3g6ICd5ZWFyJyx5OidyYW5rJ30sXG5cdFx0XHRcdHRpdGxlOiAnUmFuaycsXG5cdFx0XHRcdGNvbG9yOicjNTJiNjk1J1xuXHRcdFx0fV0sXG5cdFx0XHRzY29yZTogW3tcblx0XHRcdFx0ZmllbGRzOiB7eDogJ3llYXInLHk6J3Njb3JlJ30sXG5cdFx0XHRcdHRpdGxlOiAnU2NvcmUnLFxuXHRcdFx0XHRjb2xvcjonIzAwNjZiOSdcblx0XHRcdH1dXG5cdFx0fTtcblx0XHQkc2NvcGUudGFiQ29udGVudD0gXCJcIjtcblx0XHQkc2NvcGUudG9nZ2xlQnV0dG9uID0gJ2Fycm93X2Ryb3BfZG93bic7XG5cdFx0JHNjb3BlLmluZGV4RGF0YSA9IEluZGV4U2VydmljZS5nZXRFcGkoKTtcblx0XHQkc2NvcGUuZXBpID0gW107XG5cdFx0JHNjb3BlLm1lbnVlT3BlbiA9IHRydWU7XG5cdFx0JHNjb3BlLmRldGFpbHMgPSBmYWxzZTtcblx0XHQkc2NvcGUuaW5mbyA9IGZhbHNlO1xuXHRcdCRzY29wZS5jbG9zZUljb24gPSAnY2xvc2UnO1xuXHRcdCRzY29wZS5jb21wYXJlPSB7XG5cdFx0XHRhY3RpdmU6IGZhbHNlLFxuXHRcdFx0Y291bnRyaWVzOltdXG5cdFx0fTtcblx0XHQkc2NvcGUuc2hvd1RhYkNvbnRlbnQgPSBmdW5jdGlvbihjb250ZW50KXtcblx0XHRcdGlmKGNvbnRlbnQgPT0gJycgJiYgJHNjb3BlLnRhYkNvbnRlbnQgPT0gJycpe1xuXHRcdFx0XHQkc2NvcGUudGFiQ29udGVudCA9ICdyYW5rJztcblx0XHRcdH1cblx0XHRcdGVsc2V7XG5cdFx0XHRcdFx0JHNjb3BlLnRhYkNvbnRlbnQgPSBjb250ZW50O1xuXHRcdFx0fVxuXHRcdFx0JHNjb3BlLnRvZ2dsZUJ1dHRvbiA9ICRzY29wZS50YWJDb250ZW50ID8gJ2Fycm93X2Ryb3BfdXAnOiAnYXJyb3dfZHJvcF9kb3duJztcblx0XHR9O1xuXHRcdCRzY29wZS5zZXRTdGF0ZSA9IGZ1bmN0aW9uKGlzbyl7XG5cdFx0XHRhbmd1bGFyLmZvckVhY2goJHNjb3BlLmVwaSwgZnVuY3Rpb24oZXBpKXtcblx0XHRcdFx0aWYoZXBpLmlzbyA9PSBpc28pe1xuXHRcdFx0XHRcdCRzY29wZS5jdXJyZW50ID0gZXBpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9O1xuXHRcdCRzY29wZS5lcGkgPSBFUEk7XG5cblx0XHQvKi5nZXRMaXN0KCkudGhlbihmdW5jdGlvbihkYXRhKXtcblxuXHRcdFx0XHRpZigkc3RhdGUuY3VycmVudC5uYW1lID09IFwiYXBwLmVwaS5zZWxlY3RlZFwiKXtcblx0XHRcdFx0XHQkc2NvcGUuc2V0U3RhdGUoJHN0YXRlLnBhcmFtcy5pdGVtKTtcblx0XHRcdFx0fVxuXHRcdH0pOyovXG5cblxuXG5cdFx0LypEYXRhU2VydmljZS5nZXRBbGwoJ2VwaS95ZWFyLzIwMTQnKS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG5cdFx0XHQkc2NvcGUuZXBpID0gZGF0YTtcblxuXHRcdFx0aWYoJHN0YXRlLmN1cnJlbnQubmFtZSA9PSBcImFwcC5lcGkuc2VsZWN0ZWRcIil7XG5cdFx0XHRcdGNvbnNvbGUubG9nKCRzdGF0ZS5wYXJhbXMuaXRlbSk7XG5cdFx0XHRcdCRzY29wZS5zZXRTdGF0ZSgkc3RhdGUucGFyYW1zLml0ZW0pO1xuXHRcdFx0fVxuXHRcdH0pOyovXG5cdFx0JHNjb3BlLnNldFN0YXRlID0gZnVuY3Rpb24oaXRlbSl7XG5cdFx0XHQkc2NvcGUuc2V0Q3VycmVudChnZXROYXRpb25CeUlzbyhpdGVtKSk7XG5cdFx0fTtcblx0XHQvLyRzY29wZS5lcGkgPSBSZXN0YW5ndWxhci5hbGwoJ2VwaS95ZWFyLzIwMTQnKS5nZXRMaXN0KCkuJG9iamVjdDtcblx0XHQkc2NvcGUudG9nZ2xlT3BlbiA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdCRzY29wZS5tZW51ZU9wZW4gPSAhJHNjb3BlLm1lbnVlT3Blbjtcblx0XHRcdCRzY29wZS5jbG9zZUljb24gPSAkc2NvcGUubWVudWVPcGVuID09IHRydWUgPyAnY2hldnJvbl9sZWZ0JyA6ICdjaGV2cm9uX3JpZ2h0Jztcblx0XHR9XG5cdFx0JHNjb3BlLnNldEN1cnJlbnQgPSBmdW5jdGlvbiAobmF0KSB7XG5cdFx0XHQkc2NvcGUuY3VycmVudCA9IG5hdDtcblx0XHR9O1xuXHRcdCRzY29wZS5nZXRSYW5rID0gZnVuY3Rpb24gKG5hdCkge1xuXHRcdFx0cmV0dXJuICRzY29wZS5lcGkuaW5kZXhPZihuYXQpICsgMTtcblx0XHR9O1xuXHRcdCRzY29wZS50b2dnbGVJbmZvID0gZnVuY3Rpb24oKXtcblx0XHRcdFx0JHNjb3BlLmRpc3BsYXkuc2VsZWN0ZWRDYXQgPSAnJztcblx0XHRcdFx0JHNjb3BlLmluZm8gPSAhJHNjb3BlLmluZm87XG5cdFx0fTtcblx0XHQkc2NvcGUudG9nZ2xlRGV0YWlscyA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdHJldHVybiAkc2NvcGUuZGV0YWlscyA9ICEkc2NvcGUuZGV0YWlscztcblx0XHR9O1xuXHRcdCRzY29wZS50b2dnbGVDb21wYXJpc29uID0gZnVuY3Rpb24oKXtcblx0XHRcdCRzY29wZS5jb21wYXJlLmNvdW50cmllcyA9IFskc2NvcGUuY3VycmVudF07XG5cdFx0XHQkc2NvcGUuY29tcGFyZS5hY3RpdmUgPSAhJHNjb3BlLmNvbXBhcmUuYWN0aXZlO1xuXHRcdFx0aWYoJHNjb3BlLmNvbXBhcmUuYWN0aXZlKXtcblx0XHRcdFx0JHRpbWVvdXQoZnVuY3Rpb24oKXtcblx0XHRcdFx0XHR2YXIgZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpbmRleC1jb21wYXJpc29uJyk7XG5cdFx0XHRcdFx0c21vb3RoU2Nyb2xsKGVsZW1lbnQse29mZnNldDoxMjAsIGR1cmF0aW9uOjIwMH0pO1xuXG5cdFx0XHRcdH0pXG5cdFx0XHR9XG5cdFx0fTtcblx0XHQkc2NvcGUudG9nZ2xlQ291bnRyaWVMaXN0ID0gZnVuY3Rpb24oY291bnRyeSl7XG5cdFx0XHR2YXIgZm91bmQgPSBmYWxzZTtcblx0XHRcdGFuZ3VsYXIuZm9yRWFjaCgkc2NvcGUuY29tcGFyZS5jb3VudHJpZXMsIGZ1bmN0aW9uKG5hdCwga2V5KXtcblx0XHRcdFx0XHRpZihjb3VudHJ5ID09IG5hdCl7XG5cdFx0XHRcdFx0XHQkc2NvcGUuY29tcGFyZS5jb3VudHJpZXMuc3BsaWNlKGtleSwgMSk7XG5cdFx0XHRcdFx0XHRmb3VuZCA9IHRydWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0XHRpZighZm91bmQpe1xuXHRcdFx0XHQkc2NvcGUuY29tcGFyZS5jb3VudHJpZXMucHVzaChjb3VudHJ5KTtcblx0XHRcdH07XG5cdFx0XHRyZXR1cm4gIWZvdW5kO1xuXHRcdH07XG5cdFx0JHNjb3BlLmdldE9mZnNldCA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdGlmICghJHNjb3BlLmN1cnJlbnQpIHtcblx0XHRcdFx0cmV0dXJuIDA7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gKCRzY29wZS5jdXJyZW50LnJhbmsgPT0gMSA/IDAgOiAkc2NvcGUuY3VycmVudC5yYW5rID09ICRzY29wZS5jdXJyZW50Lmxlbmd0aCArIDEgPyAkc2NvcGUuY3VycmVudC5yYW5rIDogJHNjb3BlLmN1cnJlbnQucmFuayAtIDIpICogMTY7XG5cdFx0XHQvL3JldHVybiAkc2NvcGUuY3VycmVudC5yYW5rIC0gMiB8fCAwO1xuXHRcdH07XG5cdFx0JHNjb3BlLmdldFRlbmRlbmN5ID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0aWYgKCEkc2NvcGUuY3VycmVudCkge1xuXHRcdFx0XHRyZXR1cm4gJ2Fycm93X2Ryb3BfZG93bidcblx0XHRcdH1cblx0XHRcdHJldHVybiAkc2NvcGUuY3VycmVudC5wZXJjZW50X2NoYW5nZSA+IDAgPyAnYXJyb3dfZHJvcF91cCcgOiAnYXJyb3dfZHJvcF9kb3duJztcblx0XHR9O1xuXG5cdFx0JHNjb3BlLiR3YXRjaCgnY3VycmVudCcsIGZ1bmN0aW9uIChuZXdJdGVtLCBvbGRJdGVtKSB7XG5cdFx0XHRpZiAobmV3SXRlbSA9PT0gb2xkSXRlbSkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0XHQvLyRzY29wZS5kaXNwbGF5LnNlbGVjdGVkQ2F0ID0gXCJcIjtcblx0XHRcdGlmKG5ld0l0ZW0uaXNvKXtcblx0XHRcdFx0aWYoJHNjb3BlLmNvbXBhcmUuYWN0aXZlKXtcblx0XHRcdFx0XHQkc2NvcGUudG9nZ2xlQ291bnRyaWVMaXN0KG5ld0l0ZW0pO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2V7XG5cdFx0XHRcdFx0JHN0YXRlLmdvKCdhcHAuZXBpLnNlbGVjdGVkJywge2l0ZW06bmV3SXRlbS5pc299KVxuXHRcdFx0XHR9XG5cblx0XHRcdH1cblx0XHRcdGVsc2V7XG5cdFx0XHRcdCRzdGF0ZS5nbygnYXBwLmVwaScpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdCRzY29wZS4kd2F0Y2goJ2Rpc3BsYXkuc2VsZWN0ZWRDYXQnLCBmdW5jdGlvbihuLCBvKXtcblx0XHRcdFx0aWYobiA9PT0gbyl7XG5cdFx0XHRcdFx0cmV0dXJuXG5cdFx0XHRcdH1cblx0XHRcdFx0aWYobilcblx0XHRcdFx0dXBkYXRlQ2FudmFzKG4uY29sb3IpO1xuXHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHR1cGRhdGVDYW52YXMoJ3JnYmEoMTI4LCAyNDMsIDE5OCwxKScpO1xuXHRcdFx0XHR9O1xuXHRcdFx0XHQkc2NvcGUubXZ0U291cmNlLnNldFN0eWxlKGNvdW50cmllc1N0eWxlKTtcblx0XHR9KTtcblx0XHQkc2NvcGUuJG9uKFwiJHN0YXRlQ2hhbmdlU3VjY2Vzc1wiLCBmdW5jdGlvbihldmVudCwgdG9TdGF0ZSwgdG9QYXJhbXMpe1xuXG5cdFx0XHRpZih0b1N0YXRlLm5hbWUgPT0gXCJhcHAuZXBpLnNlbGVjdGVkXCIpe1xuXHRcdFx0XHQkc2NvcGUuc2V0U3RhdGUoIHRvUGFyYW1zLml0ZW0pO1xuXHRcdFx0XHREYXRhU2VydmljZS5nZXRPbmUoJ25hdGlvbnMnLCB0b1BhcmFtcy5pdGVtKS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG5cdFx0XHRcdFx0JHNjb3BlLmNvdW50cnkgPSBkYXRhO1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHRcdGVsc2V7XG5cdFx0XHRcdCRzY29wZS5jb3VudHJ5ID0gJHNjb3BlLmN1cnJlbnQgPSBcIlwiO1xuXHRcdFx0XHQkc2NvcGUuZGV0YWlscyA9IGZhbHNlO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdHZhciBnZXROYXRpb25CeU5hbWUgPSBmdW5jdGlvbiAobmFtZSkge1xuXHRcdFx0dmFyIG5hdGlvbiA9IHt9O1xuXHRcdFx0YW5ndWxhci5mb3JFYWNoKCRzY29wZS5lcGksIGZ1bmN0aW9uIChuYXQpIHtcblx0XHRcdFx0aWYgKG5hdC5jb3VudHJ5ID09IG5hbWUpIHtcblx0XHRcdFx0XHRuYXRpb24gPSBuYXQ7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdFx0cmV0dXJuIG5hdGlvbjtcblx0XHR9O1xuXHRcdHZhciBnZXROYXRpb25CeUlzbyA9IGZ1bmN0aW9uIChpc28pIHtcblx0XHRcdHZhciBuYXRpb24gPSB7fTtcblx0XHRcdGFuZ3VsYXIuZm9yRWFjaCgkc2NvcGUuZXBpLCBmdW5jdGlvbiAobmF0KSB7XG5cdFx0XHRcdGlmIChuYXQuaXNvID09IGlzbykge1xuXHRcdFx0XHRcdG5hdGlvbiA9IG5hdDtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0XHRyZXR1cm4gbmF0aW9uO1xuXHRcdH07XG5cdFx0dmFyIGNyZWF0ZUNhbnZhcyA9IGZ1bmN0aW9uIChjb2xvcnMpIHtcblx0XHRcdCRzY29wZS5jYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcblx0XHRcdCRzY29wZS5jYW52YXMud2lkdGggPSAyNTY7XG5cdFx0XHQkc2NvcGUuY2FudmFzLmhlaWdodCA9IDEwO1xuXHRcdFx0JHNjb3BlLmN0eCA9ICRzY29wZS5jYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcblx0XHRcdHZhciBncmFkaWVudCA9ICRzY29wZS5jdHguY3JlYXRlTGluZWFyR3JhZGllbnQoMCwgMCwgMjU2LCAxMCk7XG5cdFx0XHRncmFkaWVudC5hZGRDb2xvclN0b3AoMCwgJ3JnYmEoMjU1LDI1NSwyNTUsMCknKTtcblx0XHRcdGdyYWRpZW50LmFkZENvbG9yU3RvcCgwLjUzLCAncmdiYSgxMjgsIDI0MywgMTk4LDEpJyk7XG5cdFx0XHRncmFkaWVudC5hZGRDb2xvclN0b3AoMSwgJ3JnYmEoMTAyLDEwMiwxMDIsMSknKTtcblx0XHRcdCRzY29wZS5jdHguZmlsbFN0eWxlID0gZ3JhZGllbnQ7XG5cdFx0XHQkc2NvcGUuY3R4LmZpbGxSZWN0KDAsIDAsIDI1NiwgMTApO1xuXHRcdFx0JHNjb3BlLnBhbGV0dGUgPSAkc2NvcGUuY3R4LmdldEltYWdlRGF0YSgwLCAwLCAyNTYsIDEpLmRhdGE7XG5cdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnYm9keScpWzBdLmFwcGVuZENoaWxkKCRzY29wZS5jYW52YXMpO1xuXHRcdH1cblx0XHR2YXIgdXBkYXRlQ2FudmFzID0gZnVuY3Rpb24oY29sb3Ipe1xuXHRcdFx0dmFyIGdyYWRpZW50ID0gJHNjb3BlLmN0eC5jcmVhdGVMaW5lYXJHcmFkaWVudCgwLCAwLCAyNTYsIDEwKTtcblx0XHRcdGdyYWRpZW50LmFkZENvbG9yU3RvcCgwLCAncmdiYSgyNTUsMjU1LDI1NSwwKScpO1xuXHRcdFx0Z3JhZGllbnQuYWRkQ29sb3JTdG9wKDAuNTMsIGNvbG9yKTtcblx0XHRcdGdyYWRpZW50LmFkZENvbG9yU3RvcCgxLCAncmdiYSgxMDIsMTAyLDEwMiwxKScpO1xuXHRcdFx0JHNjb3BlLmN0eC5maWxsU3R5bGUgPSBncmFkaWVudDtcblx0XHRcdCRzY29wZS5jdHguZmlsbFJlY3QoMCwgMCwgMjU2LCAxMCk7XG5cdFx0XHQkc2NvcGUucGFsZXR0ZSA9ICRzY29wZS5jdHguZ2V0SW1hZ2VEYXRhKDAsIDAsIDI1NiwgMSkuZGF0YTtcblx0XHR9O1xuXHRcdGNyZWF0ZUNhbnZhcygpO1xuXG5cdFx0dmFyIGNvdW50cmllc1N0eWxlID0gZnVuY3Rpb24gKGZlYXR1cmUpIHtcblx0XHRcdHZhciBzdHlsZSA9IHt9O1xuXHRcdFx0dmFyIGlzbyA9IGZlYXR1cmUucHJvcGVydGllcy5hZG0wX2EzO1xuXHRcdFx0Y29uc29sZS5sb2coaXNvKTtcblx0XHRcdHZhciBuYXRpb24gPSBnZXROYXRpb25CeUlzbyhpc28pO1xuXHRcdFx0dmFyIGZpZWxkID0gJHNjb3BlLmRpc3BsYXkuc2VsZWN0ZWRDYXQudHlwZSB8fCAnc2NvcmUnO1xuXHRcdFx0dmFyIHR5cGUgPSBmZWF0dXJlLnR5cGU7XG5cdFx0XHRzd2l0Y2ggKHR5cGUpIHtcblx0XHRcdGNhc2UgMTogLy8nUG9pbnQnIFxuXHRcdFx0XHRzdHlsZS5jb2xvciA9ICdyZ2JhKDQ5LDc5LDc5LDAuMDEpJztcblx0XHRcdFx0c3R5bGUucmFkaXVzID0gNTtcblx0XHRcdFx0c3R5bGUuc2VsZWN0ZWQgPSB7XG5cdFx0XHRcdFx0Y29sb3I6ICdyZ2JhKDI1NSwyNTUsMCwwLjUpJyxcblx0XHRcdFx0XHRyYWRpdXM6IDBcblx0XHRcdFx0fTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIDI6IC8vJ0xpbmVTdHJpbmcnXG5cdFx0XHRcdHN0eWxlLmNvbG9yID0gJ3JnYmEoMjU1LDAsMCwxKSc7XG5cdFx0XHRcdHN0eWxlLnNpemUgPSAxO1xuXHRcdFx0XHRzdHlsZS5zZWxlY3RlZCA9IHtcblx0XHRcdFx0XHRjb2xvcjogJ3JnYmEoMjU1LDI1LDAsMSknLFxuXHRcdFx0XHRcdHNpemU6IDJcblx0XHRcdFx0fTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIDM6IC8vJ1BvbHlnb24nXG5cdFx0XHRcdGlmIChuYXRpb25bZmllbGRdKSB7XG5cdFx0XHRcdFx0dmFyIGNvbG9yUG9zID0gcGFyc2VJbnQoMjU2IC8gMTAwICogbmF0aW9uW2ZpZWxkXSkgKiA0O1xuXHRcdFx0XHRcdHZhciBjb2xvciA9ICdyZ2JhKCcgKyAkc2NvcGUucGFsZXR0ZVtjb2xvclBvc10gKyAnLCAnICsgJHNjb3BlLnBhbGV0dGVbY29sb3JQb3MgKyAxXSArICcsICcgKyAkc2NvcGUucGFsZXR0ZVtjb2xvclBvcyArIDJdICsgJywnICsgJHNjb3BlLnBhbGV0dGVbY29sb3JQb3MgKyAzXSArICcpJztcblx0XHRcdFx0XHRzdHlsZS5jb2xvciA9IGNvbG9yO1xuXHRcdFx0XHRcdHN0eWxlLm91dGxpbmUgPSB7XG5cdFx0XHRcdFx0XHRjb2xvcjogJ3JnYmEoNTAsNTAsNTAsMC40KScsXG5cdFx0XHRcdFx0XHRzaXplOiAxXG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRzdHlsZS5zZWxlY3RlZCA9IHtcblx0XHRcdFx0XHRcdGNvbG9yOiAncmdiYSgyNTUsMjU1LDI1NSwwLjApJyxcblx0XHRcdFx0XHRcdG91dGxpbmU6IHtcblx0XHRcdFx0XHRcdFx0Y29sb3I6ICdyZ2JhKDAsMCwwLDAuNSknLFxuXHRcdFx0XHRcdFx0XHRzaXplOiAxXG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRzdHlsZS5jb2xvciA9ICdyZ2JhKDI1NSwyNTUsMjU1LDApJztcblx0XHRcdFx0XHRzdHlsZS5vdXRsaW5lID0ge1xuXHRcdFx0XHRcdFx0Y29sb3I6ICdyZ2JhKDI1NSwyNTUsMjU1LDApJyxcblx0XHRcdFx0XHRcdHNpemU6IDFcblx0XHRcdFx0XHR9O1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdC8vXHRpZiAoZmVhdHVyZS5sYXllci5uYW1lID09PSAnZ2F1bF8yMDE0X2FkbTFfbGFiZWwnKSB7XG5cdFx0XHRzdHlsZS5hamF4U291cmNlID0gZnVuY3Rpb24gKG12dEZlYXR1cmUpIHtcblx0XHRcdFx0dmFyIGlkID0gbXZ0RmVhdHVyZS5pZDtcblx0XHRcdFx0Ly9cdGNvbnNvbGUubG9nKGlkKTtcblx0XHRcdFx0Ly9yZXR1cm4gJ2h0dHA6Ly9zcGF0aWFsc2VydmVyLnNwYXRpYWxkZXYuY29tL2ZzcC8yMDE0L2ZzcC9hZ2dyZWdhdGlvbnMtbm8tbmFtZS8nICsgaWQgKyAnLmpzb24nO1xuXHRcdFx0fTtcblxuXHRcdFx0c3R5bGUuc3RhdGljTGFiZWwgPSBmdW5jdGlvbiAobXZ0RmVhdHVyZSwgYWpheERhdGEpIHtcblx0XHRcdFx0dmFyIHN0eWxlID0ge1xuXHRcdFx0XHRcdGh0bWw6IGZlYXR1cmUucHJvcGVydGllcy5uYW1lLFxuXHRcdFx0XHRcdGljb25TaXplOiBbMzMsIDMzXSxcblx0XHRcdFx0XHRjc3NDbGFzczogJ2xhYmVsLWljb24tbnVtYmVyJyxcblx0XHRcdFx0XHRjc3NTZWxlY3RlZENsYXNzOiAnbGFiZWwtaWNvbi1udW1iZXItc2VsZWN0ZWQnXG5cdFx0XHRcdH07XG5cdFx0XHRcdHJldHVybiBzdHlsZTtcblx0XHRcdH07XG5cdFx0XHQvL1x0fVxuXG5cdFx0XHRyZXR1cm4gc3R5bGU7XG5cdFx0fTtcblxuXHRcdCRzY29wZS5kcmF3Q291bnRyaWVzID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0bGVhZmxldERhdGEuZ2V0TWFwKCdtYXAnKS50aGVuKGZ1bmN0aW9uIChtYXApIHtcblx0XHRcdFx0dmFyIGFwaUtleSA9ICdway5leUoxSWpvaWJXRm5ibTlzYnlJc0ltRWlPaUp1U0ZkVVlrZzRJbjAuNUhPeWtLazBwTlAxTjNpc2ZQUUdUUSc7XG5cblx0XHRcdFx0Ly9cdEwudGlsZUxheWVyKCdodHRwOi8vbG9jYWxob3N0OjMwMDEvc2VydmljZXMvcG9zdGdpcy9jb3VudHJpZXNfYmlnL2dlb20vZHluYW1pY01hcC97en0ve3h9L3t5fS5wbmcnKS5hZGRUbyhtYXApO1xuXHRcdFx0XHR2YXIgZGVidWcgPSB7fTtcblx0XHRcdFx0dmFyIG1iID0gJ2h0dHBzOi8vYS50aWxlcy5tYXBib3guY29tL3Y0L21hcGJveC5tYXBib3gtdGVycmFpbi12MSxtYXBib3gubWFwYm94LXN0cmVldHMtdjYtZGV2L3t6fS97eH0ve3l9LnZlY3Rvci5wYmY/YWNjZXNzX3Rva2VuPXBrLmV5SjFJam9pYldGd1ltOTRJaXdpWVNJNklsaEhWa1ptYVc4aWZRLmhBTVg1aFNXLVFuVGVSQ01BeTlBOFEnO1xuXHRcdFx0XHR2YXIgbWFwemVuID0gJ2h0dHA6Ly92ZWN0b3IubWFwemVuLmNvbS9vc20ve2xheWVyc30ve3p9L3t4fS97eX0ue2Zvcm1hdH0/YXBpX2tleT17YXBpX2tleX0nXG5cdFx0XHRcdHZhciB1cmwgPSAnaHR0cDovL2xvY2FsaG9zdDozMDAxL3NlcnZpY2VzL3Bvc3RnaXMvY291bnRyaWVzX2JpZy9nZW9tL3ZlY3Rvci10aWxlcy97en0ve3h9L3t5fS5wYmY/ZmllbGRzPWlkLGFkbWluLGFkbTBfYTMsd2JfYTMsc3VfYTMsaXNvX2EzLG5hbWUsbmFtZV9sb25nJzsgLy9cblx0XHRcdFx0dmFyIHVybDIgPSAnaHR0cHM6Ly9hLnRpbGVzLm1hcGJveC5jb20vdjQvbWFwYm94Lm1hcGJveC1zdHJlZXRzLXY2LWRldi97en0ve3h9L3t5fS52ZWN0b3IucGJmP2FjY2Vzc190b2tlbj0nICsgYXBpS2V5O1xuXHRcdFx0XHQkc2NvcGUubXZ0U291cmNlID0gbmV3IEwuVGlsZUxheWVyLk1WVFNvdXJjZSh7XG5cdFx0XHRcdFx0dXJsOiB1cmwsIC8vXCJodHRwOi8vc3BhdGlhbHNlcnZlci5zcGF0aWFsZGV2LmNvbS9zZXJ2aWNlcy92ZWN0b3ItdGlsZXMvZ2F1bF9mc3BfaW5kaWEve3p9L3t4fS97eX0ucGJmXCIsXG5cdFx0XHRcdFx0ZGVidWc6IGZhbHNlLFxuXHRcdFx0XHRcdG9wYWNpdHk6IDAuNixcblx0XHRcdFx0XHRjbGlja2FibGVMYXllcnM6IFsnY291bnRyaWVzX2JpZ19nZW9tJ10sXG5cdFx0XHRcdFx0Ly9tdXRleFRvZ2dsZTogdHJ1ZSxcblx0XHRcdFx0XHRvbkNsaWNrOiBmdW5jdGlvbiAoZXZ0LCB0KSB7XG5cdFx0XHRcdFx0XHQvL21hcC5maXRCb3VuZHMoZXZ0LnRhcmdldC5nZXRCb3VuZHMoKSk7XG5cblx0XHRcdFx0XHRcdHZhciB4ID0gZXZ0LmZlYXR1cmUuYmJveCgpWzBdLyAoZXZ0LmZlYXR1cmUuZXh0ZW50IC8gZXZ0LmZlYXR1cmUudGlsZVNpemUpO1xuXHRcdFx0XHRcdFx0dmFyIHkgPSBldnQuZmVhdHVyZS5iYm94KClbMV0vKGV2dC5mZWF0dXJlLmV4dGVudCAvIGV2dC5mZWF0dXJlLnRpbGVTaXplKVxuXHRcdFx0XHRcdFx0aWYgKCRzY29wZS5jdXJyZW50LmNvdW50cnkgIT0gZXZ0LmZlYXR1cmUucHJvcGVydGllcy5hZG1pbikge1xuXHRcdFx0XHRcdFx0XHRtYXAucGFuVG8oZXZ0LmxhdGxuZyk7XG5cdFx0XHRcdFx0XHRcdG1hcC5wYW5CeShuZXcgTC5Qb2ludCgtMjAwLDApKTtcblx0XHRcdFx0XHRcdC8qXHRtYXAuZml0Qm91bmRzKFtcblx0XHRcdFx0XHRcdFx0XHRbZXZ0LmZlYXR1cmUuYmJveCgpWzBdIC8gKGV2dC5mZWF0dXJlLmV4dGVudCAvIGV2dC5mZWF0dXJlLnRpbGVTaXplKSwgZXZ0LmZlYXR1cmUuYmJveCgpWzFdIC8gKGV2dC5mZWF0dXJlLmV4dGVudCAvIGV2dC5mZWF0dXJlLnRpbGVTaXplKV0sXG5cdFx0XHRcdFx0XHRcdFx0W2V2dC5mZWF0dXJlLmJib3goKVsyXSAvIChldnQuZmVhdHVyZS5leHRlbnQgLyBldnQuZmVhdHVyZS50aWxlU2l6ZSksIGV2dC5mZWF0dXJlLmJib3goKVszXSAvIChldnQuZmVhdHVyZS5leHRlbnQgLyBldnQuZmVhdHVyZS50aWxlU2l6ZSldLFxuXHRcdFx0XHRcdFx0XHRdKSovXG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHQvL2NvbnNvbGUubG9nKGV2dC5mZWF0dXJlKTtcblx0XHRcdFx0XHRcdCRzY29wZS5jdXJyZW50ID0gZ2V0TmF0aW9uQnlJc28oZXZ0LmZlYXR1cmUucHJvcGVydGllcy5hZG0wX2EzKTtcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdGdldElERm9yTGF5ZXJGZWF0dXJlOiBmdW5jdGlvbiAoZmVhdHVyZSkge1xuXG5cdFx0XHRcdFx0XHRyZXR1cm4gZmVhdHVyZS5wcm9wZXJ0aWVzLmlkO1xuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0ZmlsdGVyOiBmdW5jdGlvbiAoZmVhdHVyZSwgY29udGV4dCkge1xuXG5cdFx0XHRcdFx0XHRpZiAoZmVhdHVyZS5sYXllci5uYW1lID09PSAnYWRtaW4nIHx8IGZlYXR1cmUubGF5ZXIubmFtZSA9PT0gJ2dhdWxfMjAxNF9hZG0xX2xhYmVsJykge1xuXHRcdFx0XHRcdFx0XHQvL2NvbnNvbGUubG9nKGZlYXR1cmUpO1xuXHRcdFx0XHRcdFx0XHRpZiAoZmVhdHVyZS5wcm9wZXJ0aWVzLmFkbWluX2xldmVsID09IDAgfHwgZmVhdHVyZS5wcm9wZXJ0aWVzLmFkbWluX2xldmVsID09IDEgfHwgZmVhdHVyZS5wcm9wZXJ0aWVzLmFkbWluX2xldmVsID09IDIpIHtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdFx0fSxcblxuXHRcdFx0XHRcdHN0eWxlOiBjb3VudHJpZXNTdHlsZSxcblxuXG5cdFx0XHRcdFx0bGF5ZXJMaW5rOiBmdW5jdGlvbiAobGF5ZXJOYW1lKSB7XG5cdFx0XHRcdFx0XHRpZiAobGF5ZXJOYW1lLmluZGV4T2YoJ19sYWJlbCcpID4gLTEpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGxheWVyTmFtZS5yZXBsYWNlKCdfbGFiZWwnLCAnJyk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRyZXR1cm4gbGF5ZXJOYW1lICsgJ19sYWJlbCc7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRkZWJ1Zy5tdnRTb3VyY2UgPSAkc2NvcGUubXZ0U291cmNlO1xuXHRcdFx0XHRtYXAuYWRkTGF5ZXIoJHNjb3BlLm12dFNvdXJjZSk7XG5cdFx0XHR9KTtcblx0XHR9O1xuXHRcdCRzY29wZS5kcmF3Q291bnRyaWVzKCk7XG5cdH0pO1xufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0dlbmVyYXRvcnNDdHJsJywgZnVuY3Rpb24oKXtcbiAgICAgICAgLy9cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignSGVhZGVyQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgJHJvb3RTY29wZSl7XG5cblx0XHQkc2NvcGUuJHdhdGNoKGZ1bmN0aW9uKCl7XG5cdFx0XHRyZXR1cm4gJHJvb3RTY29wZS5jdXJyZW50X3BhZ2U7XG5cdFx0fSwgZnVuY3Rpb24obmV3UGFnZSl7XG5cdFx0XHQkc2NvcGUuY3VycmVudF9wYWdlID0gbmV3UGFnZSB8fCAnUGFnZSBOYW1lJztcblx0XHR9KTtcblxuXG5cdH0pO1xuXG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdJbXBvcnRjc3ZDdHJsJywgZnVuY3Rpb24gKCRtZERpYWxvZykge1xuXHRcdHRoaXMuc2V0dGluZ3MgPSB7XG5cdFx0XHRwcmludExheW91dDogdHJ1ZSxcblx0XHRcdHNob3dSdWxlcjogdHJ1ZSxcblx0XHRcdHNob3dTcGVsbGluZ1N1Z2dlc3Rpb25zOiB0cnVlLFxuXHRcdFx0cHJlc2VudGF0aW9uTW9kZTogJ2VkaXQnXG5cdFx0fTtcblxuXHRcdHRoaXMuc2FtcGxlQWN0aW9uID0gZnVuY3Rpb24gKG5hbWUsIGV2KSB7XG5cdFx0XHQkbWREaWFsb2cuc2hvdygkbWREaWFsb2cuYWxlcnQoKVxuXHRcdFx0XHQudGl0bGUobmFtZSlcblx0XHRcdFx0LmNvbnRlbnQoJ1lvdSB0cmlnZ2VyZWQgdGhlIFwiJyArIG5hbWUgKyAnXCIgYWN0aW9uJylcblx0XHRcdFx0Lm9rKCdHcmVhdCcpXG5cdFx0XHRcdC50YXJnZXRFdmVudChldilcblx0XHRcdCk7XG5cdFx0fTtcblxuICAgIHRoaXMub3BlbkNzdlVwbG9hZCA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0JG1kRGlhbG9nLnNob3coe1xuXHRcdFx0XHRcdC8vY29udHJvbGxlcjogRGlhbG9nQ29udHJvbGxlcixcblx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogJy92aWV3cy9hcHAvaW1wb3J0Y3N2L2NzdlVwbG9hZERpYWxvZy5odG1sJyxcblx0ICAgICAgICBiaW5kVG9Db250cm9sbGVyOiB0cnVlLFxuXHRcdFx0XHR9KVxuXHRcdFx0XHQudGhlbihmdW5jdGlvbiAoYW5zd2VyKSB7XG5cblx0XHRcdFx0fSwgZnVuY3Rpb24gKCkge1xuXG5cdFx0XHRcdH0pO1xuXHRcdH07XG5cdH0pXG5cblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignSnd0QXV0aEN0cmwnLCBmdW5jdGlvbigkc2NvcGUsICRhdXRoLCBSZXN0YW5ndWxhcil7XG5cblx0XHR2YXIgY3JlZGVudGlhbHMgPSB7fTtcblxuXHRcdCRzY29wZS5yZXF1ZXN0VG9rZW4gPSBmdW5jdGlvbigpe1xuXHRcdFx0Ly8gVXNlIFNhdGVsbGl6ZXIncyAkYXV0aCBzZXJ2aWNlIHRvIGxvZ2luIGJlY2F1c2UgaXQnbGwgYXV0b21hdGljYWxseSBzYXZlIHRoZSBKV1QgaW4gbG9jYWxTdG9yYWdlXG5cdFx0XHQkYXV0aC5sb2dpbihjcmVkZW50aWFscykudGhlbihmdW5jdGlvbiAoZGF0YSl7XG5cdFx0XHRcdC8vIElmIGxvZ2luIGlzIHN1Y2Nlc3NmdWwsIHJlZGlyZWN0IHRvIHRoZSB1c2VycyBzdGF0ZVxuXHRcdFx0XHQvLyRzdGF0ZS5nbygnZGFzaGJvYXJkJyk7XG5cdFx0XHR9KTtcblx0XHR9O1xuXG5cdFx0Ly8gVGhpcyByZXF1ZXN0IHdpbGwgaGl0IHRoZSBnZXREYXRhIG1ldGhvZCBpbiB0aGUgQXV0aGVudGljYXRlQ29udHJvbGxlclxuXHRcdC8vIG9uIHRoZSBMYXJhdmVsIHNpZGUgYW5kIHdpbGwgcmV0dXJuIHlvdXIgZGF0YSB0aGF0IHJlcXVpcmUgYXV0aGVudGljYXRpb25cblx0XHQkc2NvcGUuZ2V0RGF0YSA9IGZ1bmN0aW9uKCl7XG5cdFx0XHRSZXN0YW5ndWxhci5hbGwoJ2F1dGhlbnRpY2F0ZS9kYXRhJykuZ2V0KCkudGhlbihmdW5jdGlvbiAocmVzcG9uc2Upe1xuXG5cdFx0XHR9LCBmdW5jdGlvbiAoZXJyb3Ipe30pO1xuXHRcdH07XG5cblxuXG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdMYW5kaW5nQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgJG1kVG9hc3QsICRtZERpYWxvZywgJGludGVydmFsLCBUb2FzdFNlcnZpY2UsIERpYWxvZ1NlcnZpY2Upe1xuXG5cdFx0JHNjb3BlLnByb21vSW1hZ2UgPSAnaHR0cHM6Ly9pLmltZ3VyLmNvbS9aYkx6T1BQLmpwZyc7XG5cdFx0JHNjb3BlLmljb24gPSAnc2VuZCc7XG5cblx0XHR2YXIgaWNvbnMgPSBbXG5cdFx0XHRcdCdvZmZpY2UnLCAnZmFjZWJvb2snLCAndHdpdHRlcicsICdhcHBsZScsICd3aGF0c2FwcCcsICdsaW5rZWRpbicsICd3aW5kb3dzJywgJ2FjY2Vzc2liaWxpdHknLCAnYWxhcm0nLCAnYXNwZWN0X3JhdGlvJyxcblx0XHRcdFx0J2F1dG9yZW5ldycsICdib29rbWFya19vdXRsaW5lJywgJ2Rhc2hib2FyZCcsICdkbnMnLCAnZmF2b3JpdGVfb3V0bGluZScsICdnZXRfYXBwJywgJ2hpZ2hsaWdodF9yZW1vdmUnLCAnaGlzdG9yeScsICdsaXN0Jyxcblx0XHRcdFx0J3BpY3R1cmVfaW5fcGljdHVyZScsICdwcmludCcsICdzZXR0aW5nc19ldGhlcm5ldCcsICdzZXR0aW5nc19wb3dlcicsICdzaG9wcGluZ19jYXJ0JywgJ3NwZWxsY2hlY2snLCAnc3dhcF9ob3JpeicsICdzd2FwX3ZlcnQnLFxuXHRcdFx0XHQndGh1bWJfdXAnLCAndGh1bWJzX3VwX2Rvd24nLCAndHJhbnNsYXRlJywgJ3RyZW5kaW5nX3VwJywgJ3Zpc2liaWxpdHknLCAnd2FybmluZycsICdtaWMnLCAncGxheV9jaXJjbGVfb3V0bGluZScsICdyZXBlYXQnLFxuXHRcdFx0XHQnc2tpcF9uZXh0JywgJ2NhbGwnLCAnY2hhdCcsICdjbGVhcl9hbGwnLCAnZGlhbHBhZCcsICdkbmRfb24nLCAnZm9ydW0nLCAnbG9jYXRpb25fb24nLCAndnBuX2tleScsICdmaWx0ZXJfbGlzdCcsICdpbmJveCcsXG5cdFx0XHRcdCdsaW5rJywgJ3JlbW92ZV9jaXJjbGVfb3V0bGluZScsICdzYXZlJywgJ3RleHRfZm9ybWF0JywgJ2FjY2Vzc190aW1lJywgJ2FpcnBsYW5lbW9kZV9vbicsICdibHVldG9vdGgnLCAnZGF0YV91c2FnZScsXG5cdFx0XHRcdCdncHNfZml4ZWQnLCAnbm93X3dhbGxwYXBlcicsICdub3dfd2lkZ2V0cycsICdzdG9yYWdlJywgJ3dpZmlfdGV0aGVyaW5nJywgJ2F0dGFjaF9maWxlJywgJ2Zvcm1hdF9saW5lX3NwYWNpbmcnLFxuXHRcdFx0XHQnZm9ybWF0X2xpc3RfbnVtYmVyZWQnLCAnZm9ybWF0X3F1b3RlJywgJ3ZlcnRpY2FsX2FsaWduX2NlbnRlcicsICd3cmFwX3RleHQnLCAnY2xvdWRfcXVldWUnLCAnZmlsZV9kb3dubG9hZCcsICdmb2xkZXJfb3BlbicsXG5cdFx0XHRcdCdjYXN0JywgJ2hlYWRzZXQnLCAna2V5Ym9hcmRfYmFja3NwYWNlJywgJ21vdXNlJywgJ3NwZWFrZXInLCAnd2F0Y2gnLCAnYXVkaW90cmFjaycsICdlZGl0JywgJ2JydXNoJywgJ2xvb2tzJywgJ2Nyb3BfZnJlZScsXG5cdFx0XHRcdCdjYW1lcmEnLCAnZmlsdGVyX3ZpbnRhZ2UnLCAnaGRyX3N0cm9uZycsICdwaG90b19jYW1lcmEnLCAnc2xpZGVzaG93JywgJ3RpbWVyJywgJ2RpcmVjdGlvbnNfYmlrZScsICdob3RlbCcsICdsb2NhbF9saWJyYXJ5Jyxcblx0XHRcdFx0J2RpcmVjdGlvbnNfd2FsaycsICdsb2NhbF9jYWZlJywgJ2xvY2FsX3BpenphJywgJ2xvY2FsX2Zsb3Jpc3QnLCAnbXlfbG9jYXRpb24nLCAnbmF2aWdhdGlvbicsICdwaW5fZHJvcCcsICdhcnJvd19iYWNrJywgJ21lbnUnLFxuXHRcdFx0XHQnY2xvc2UnLCAnbW9yZV9ob3JpeicsICdtb3JlX3ZlcnQnLCAncmVmcmVzaCcsICdwaG9uZV9wYXVzZWQnLCAndmlicmF0aW9uJywgJ2Nha2UnLCAnZ3JvdXAnLCAnbW9vZCcsICdwZXJzb24nLFxuXHRcdFx0XHQnbm90aWZpY2F0aW9uc19ub25lJywgJ3BsdXNfb25lJywgJ3NjaG9vbCcsICdzaGFyZScsICdzdGFyX291dGxpbmUnXG5cdFx0XHRdLFxuXHRcdFx0Y291bnRlciA9IDA7XG5cblx0XHQkaW50ZXJ2YWwoZnVuY3Rpb24oKXtcblx0XHRcdCRzY29wZS5pY29uID0gaWNvbnNbKytjb3VudGVyXTtcblx0XHRcdGlmIChjb3VudGVyID4gMTEyKXtcblx0XHRcdFx0Y291bnRlciA9IDA7XG5cdFx0XHR9XG5cdFx0fSwgMjAwMCk7XG5cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignTG9naW5DdHJsJywgZnVuY3Rpb24gKCl7XG5cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdNYXBDdHJsJywgZnVuY3Rpb24gKCRzY29wZSwgJHJvb3RTY29wZSwgJHRpbWVvdXQsIE1hcFNlcnZpY2UsIGxlYWZsZXREYXRhLCAkaHR0cCkge1xuXHRcdC8vXG5cdFx0dmFyIGFwaUtleSA9ICdway5leUoxSWpvaWJXRm5ibTlzYnlJc0ltRWlPaUp1U0ZkVVlrZzRJbjAuNUhPeWtLazBwTlAxTjNpc2ZQUUdUUSc7XG5cblx0XHQvKiRzY29wZS5kZWZhdWx0cyA9IHtcblx0XHRcdHRpbGVMYXllcjogJ2h0dHBzOi8ve3N9LnRpbGVzLm1hcGJveC5jb20vdjQvbWFwYm94LnBlbmNpbC97en0ve3h9L3t5fS5wbmc/YWNjZXNzX3Rva2VuPScgKyBhcGlLZXksXG5cdFx0XHRtYXhab29tOiAxNCxcblx0XHRcdGRldGVjdFJldGluYTogdHJ1ZSxcblx0XHRcdGF0dHJpYnV0aW9uOiAnJ1xuXHRcdH07Ki9cblx0XHQkc2NvcGUuY2VudGVyID0ge1xuXHRcdFx0bGF0OiAwLFxuXHRcdFx0bG5nOiAwLFxuXHRcdFx0em9vbTogNFxuXHRcdH07XG5cdFx0JHNjb3BlLmRlZmF1bHRzID0ge1xuXHRcdFx0c2Nyb2xsV2hlZWxab29tOiBmYWxzZVxuXHRcdH07XG5cdFx0YW5ndWxhci5leHRlbmQoJHJvb3RTY29wZSwge1xuXHRcdFx0Y2VudGVyOiB7XG5cdFx0XHRcdGxhdDogMCxcblx0XHRcdFx0bG5nOiAwLFxuXHRcdFx0XHR6b29tOiA0XG5cdFx0XHR9LFxuXHRcdFx0bGF5ZXJzOiB7XG5cdFx0XHRcdGJhc2VsYXllcnM6IHtcblx0XHRcdFx0XHR4eXo6IHtcblx0XHRcdFx0XHRcdG5hbWU6ICdNYXBCb3ggUGVuY2lsJyxcblx0XHRcdFx0XHRcdHVybDogJ2h0dHBzOi8ve3N9LnRpbGVzLm1hcGJveC5jb20vdjQvbWFwYm94Lm91dGRvb3JzL3t6fS97eH0ve3l9LnBuZz9hY2Nlc3NfdG9rZW49JyArIGFwaUtleSxcblx0XHRcdFx0XHRcdHR5cGU6ICd4eXonLFxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSxcblx0XHRcdFx0b3ZlcmxheXM6IHtcblx0XHRcdFx0XHRkZW1vc3V0ZmdyaWQ6IHtcblx0XHRcdFx0XHRcdG5hbWU6ICdVVEZHcmlkIEludGVyYWN0aXZpdHknLFxuXHRcdFx0XHRcdFx0dHlwZTogJ3V0ZkdyaWQnLFxuXHRcdFx0XHRcdFx0dXJsOiAnaHR0cDovL3tzfS50aWxlcy5tYXBib3guY29tL3YzL21hcGJveC5nZW9ncmFwaHktY2xhc3Mve3p9L3t4fS97eX0uZ3JpZC5qc29uP2NhbGxiYWNrPXtjYn0nLFxuXHRcdFx0XHRcdFx0dmlzaWJsZTogdHJ1ZVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0Lyp3bXM6IHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0IG5hbWU6ICdFRVVVIFN0YXRlcyAoV01TKScsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdCB0eXBlOiAnd21zJyxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0IHZpc2libGU6IHRydWUsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdCB1cmw6ICdodHRwOi8vc3VpdGUub3Blbmdlby5vcmcvZ2Vvc2VydmVyL3VzYS93bXMnLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQgbGF5ZXJQYXJhbXM6IHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdCBsYXllcnM6ICd1c2E6c3RhdGVzJyxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdCBmb3JtYXQ6ICdpbWFnZS9wbmcnLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0IHRyYW5zcGFyZW50OiB0cnVlXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdCB9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0IH0qL1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0JHNjb3BlLnNlYXJjaElQID0gZnVuY3Rpb24gKGlwKSB7XG5cdFx0XHR2YXIgdXJsID0gXCJodHRwOi8vZnJlZWdlb2lwLm5ldC9qc29uL1wiICsgaXA7XG5cdFx0XHQkaHR0cC5nZXQodXJsKS5zdWNjZXNzKGZ1bmN0aW9uIChyZXMpIHtcblx0XHRcdFx0JHNjb3BlLmNlbnRlciA9IHtcblx0XHRcdFx0XHRsYXQ6IHJlcy5sYXRpdHVkZSxcblx0XHRcdFx0XHRsbmc6IHJlcy5sb25naXR1ZGUsXG5cdFx0XHRcdFx0em9vbTogNFxuXHRcdFx0XHR9XG5cdFx0XHRcdCRzY29wZS5pcCA9IHJlcy5pcDtcblx0XHRcdH0pXG5cdFx0fTtcblxuXHRcdC8vJHNjb3BlLnNlYXJjaElQKFwiXCIpO1xuXHRcdCRzY29wZS5pbnRlcmFjdGl2aXR5ID0gXCJcIjtcblx0XHQkc2NvcGUuZmxhZyA9IFwiXCI7XG5cdFx0JHNjb3BlLiRvbignbGVhZmxldERpcmVjdGl2ZU1hcC51dGZncmlkTW91c2VvdmVyJywgZnVuY3Rpb24gKGV2ZW50LCBsZWFmbGV0RXZlbnQpIHtcblx0XHRcdC8vIHRoZSBVVEZHcmlkIGluZm9ybWF0aW9uIGlzIG9uIGxlYWZsZXRFdmVudC5kYXRhXG5cdFx0XHQkc2NvcGUuaW50ZXJhY3Rpdml0eSA9IGxlYWZsZXRFdmVudC5kYXRhLmFkbWluO1xuXHRcdFx0JHNjb3BlLmZsYWcgPSBcImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxcIiArIGxlYWZsZXRFdmVudC5kYXRhLmZsYWdfcG5nO1xuXG5cdFx0fSk7XG5cdFx0JHNjb3BlLiRvbignbGVhZmxldERpcmVjdGl2ZU1hcC51dGZncmlkTW91c2VvdXQnLCBmdW5jdGlvbiAoZXZlbnQsIGxlYWZsZXRFdmVudCkge1xuXHRcdFx0JHNjb3BlLmludGVyYWN0aXZpdHkgPSBcIlwiO1xuXHRcdFx0JHNjb3BlLmZsYWcgPSBcIlwiO1xuXHRcdH0pO1xuXHRcdE1hcFNlcnZpY2Uuc2V0TGVhZmxldERhdGEobGVhZmxldERhdGEuZ2V0TWFwKCdtYXAnKSk7XG5cblx0fSk7XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignTWlzY0N0cmwnLCBmdW5jdGlvbigpe1xuICAgICAgICAvL1xuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignUmVzdEFwaUN0cmwnLCBmdW5jdGlvbigpe1xuICAgICAgICAvL1xuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdTaWRlYmFyQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgJHN0YXRlKXtcblxuXG5cdH0pO1xuXG59KSgpOyIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignRGFzaGJvYXJkQ3RybCcsIGZ1bmN0aW9uKCl7XG5cblx0fSk7XG5cbn0pKCk7IiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdUb2FzdHNDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBUb2FzdFNlcnZpY2Upe1xuXG5cdFx0JHNjb3BlLnRvYXN0U3VjY2VzcyA9IGZ1bmN0aW9uKCl7XG5cdFx0XHRUb2FzdFNlcnZpY2Uuc2hvdygnVXNlciBhZGRlZCBzdWNjZXNzZnVsbHkhJyk7XG5cdFx0fTtcblxuXHRcdCRzY29wZS50b2FzdEVycm9yID0gZnVuY3Rpb24oKXtcblx0XHRcdFRvYXN0U2VydmljZS5lcnJvcignQ29ubmVjdGlvbiBpbnRlcnJ1cHRlZCEnKTtcblx0XHR9O1xuXG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignVW5zdXBwb3J0ZWRCcm93c2VyQ3RybCcsIGZ1bmN0aW9uKCl7XG4gICAgICAgIC8vXG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoICdhcHAuY29udHJvbGxlcnMnICkuY29udHJvbGxlciggJ0J1YmJsZXNDdHJsJywgZnVuY3Rpb24oKXtcblx0XHQvL1xuICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGZ1bmN0aW9uIEN1c3RvbVRvb2x0aXAodG9vbHRpcElkLCB3aWR0aCkge1xuXHRcdHZhciB0b29sdGlwSWQgPSB0b29sdGlwSWQ7XG5cdFx0dmFyIGVsZW0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0b29sdGlwSWQpO1xuXHRcdGlmKGVsZW0gPT0gbnVsbCl7XG5cdFx0XHRhbmd1bGFyLmVsZW1lbnQoZG9jdW1lbnQpLmZpbmQoJ2JvZHknKS5hcHBlbmQoXCI8ZGl2IGNsYXNzPSd0b29sdGlwIG1kLXdoaXRlZnJhbWUtejMnIGlkPSdcIiArIHRvb2x0aXBJZCArIFwiJz48L2Rpdj5cIik7XG5cdFx0fVxuXHRcdGhpZGVUb29sdGlwKCk7XG5cdFx0ZnVuY3Rpb24gc2hvd1Rvb2x0aXAoY29udGVudCwgZGF0YSwgZXZlbnQsIGVsZW1lbnQpIHtcblx0XHRcdGFuZ3VsYXIuZWxlbWVudChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjJyArIHRvb2x0aXBJZCkpLmh0bWwoY29udGVudCk7XG5cdFx0XHRhbmd1bGFyLmVsZW1lbnQoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignIycgKyB0b29sdGlwSWQpKS5jc3MoJ2Rpc3BsYXknLCAnYmxvY2snKTtcblxuXHRcdFx0cmV0dXJuIHVwZGF0ZVBvc2l0aW9uKGV2ZW50LCBkYXRhLCBlbGVtZW50KTtcblx0XHR9XG5cdFx0ZnVuY3Rpb24gaGlkZVRvb2x0aXAoKSB7XG5cdFx0XHRhbmd1bGFyLmVsZW1lbnQoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignIycgKyB0b29sdGlwSWQpKS5jc3MoJ2Rpc3BsYXknLCAnbm9uZScpO1xuXHRcdH1cblx0XHRmdW5jdGlvbiB1cGRhdGVQb3NpdGlvbihldmVudCwgZCwgZWxlbWVudCkge1xuXHRcdFx0dmFyIHR0aWQgPSBcIiNcIiArIHRvb2x0aXBJZDtcblx0XHRcdHZhciB4T2Zmc2V0ID0gMjA7XG5cdFx0XHR2YXIgeU9mZnNldCA9IDEwO1xuXHRcdFx0dmFyIHN2ZyA9IGVsZW1lbnQuZmluZCgnc3ZnJylbMF07Ly9kb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjc3ZnX3ZpcycpO1xuXHRcdFx0dmFyIHdzY3JZID0gd2luZG93LnNjcm9sbFk7XG5cdFx0XHR2YXIgdHR3ID0gYW5ndWxhci5lbGVtZW50KGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodHRpZCkpLm9mZnNldFdpZHRoO1xuXHRcdFx0dmFyIHR0aCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodHRpZCkub2Zmc2V0SGVpZ2h0O1xuXHRcdFx0dmFyIHR0dG9wID0gc3ZnLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcCArIGQueSAtIHR0aCAvIDI7XG5cdFx0XHR2YXIgdHRsZWZ0ID0gc3ZnLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmxlZnQgKyBkLnggKyBkLnJhZGl1cyArIDEyO1xuXHRcdFx0cmV0dXJuIGFuZ3VsYXIuZWxlbWVudChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHR0aWQpKS5jc3MoJ3RvcCcsIHR0dG9wICsgJ3B4JykuY3NzKCdsZWZ0JywgdHRsZWZ0ICsgJ3B4Jyk7XG5cdFx0fVxuXHRcdHJldHVybiB7XG5cdFx0XHRzaG93VG9vbHRpcDogc2hvd1Rvb2x0aXAsXG5cdFx0XHRoaWRlVG9vbHRpcDogaGlkZVRvb2x0aXAsXG5cdFx0XHR1cGRhdGVQb3NpdGlvbjogdXBkYXRlUG9zaXRpb25cblx0XHR9XG5cdH1cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5kaXJlY3RpdmVzJykuZGlyZWN0aXZlKCdidWJibGVzJywgZnVuY3Rpb24gKCRjb21waWxlKSB7XG5cdFx0dmFyIGRlZmF1bHRzO1xuXHRcdGRlZmF1bHRzID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0d2lkdGg6IDMyMCxcblx0XHRcdFx0aGVpZ2h0OiAzMDAsXG5cdFx0XHRcdGxheW91dF9ncmF2aXR5OiAwLFxuXHRcdFx0XHRzaXplZmFjdG9yOjMsXG5cdFx0XHRcdHZpczogbnVsbCxcblx0XHRcdFx0Zm9yY2U6IG51bGwsXG5cdFx0XHRcdGRhbXBlcjogMC4xLFxuXHRcdFx0XHRjaXJjbGVzOiBudWxsLFxuXHRcdFx0XHRib3JkZXJzOiB0cnVlLFxuXHRcdFx0XHRmaWxsX2NvbG9yOiBkMy5zY2FsZS5vcmRpbmFsKCkuZG9tYWluKFtcImVoXCIsIFwiZXZcIl0pLnJhbmdlKFtcIiNhMzEwMzFcIiwgXCIjYmVjY2FlXCJdKSxcblx0XHRcdFx0bWF4X2Ftb3VudDogJycsXG5cdFx0XHRcdHJhZGl1c19zY2FsZTogJycsXG5cdFx0XHRcdGR1cmF0aW9uOiAxMDAwLFxuXHRcdFx0XHR0b29sdGlwOiBDdXN0b21Ub29sdGlwKFwiYnViYmxlc190b29sdGlwXCIsIDI0MClcblx0XHRcdH07XG5cdFx0fTtcblx0XHRyZXR1cm4ge1xuXHRcdFx0cmVzdHJpY3Q6ICdFJyxcblx0XHRcdHNjb3BlOiB7XG5cdFx0XHRcdGNoYXJ0ZGF0YTogJz0nLFxuXHRcdFx0XHRkaXJlY3Rpb246ICc9Jyxcblx0XHRcdFx0Z3Jhdml0eTogJz0nLFxuXHRcdFx0XHRzaXplZmFjdG9yOiAnPScsXG5cdFx0XHRcdGluZGV4ZXI6ICc9Jyxcblx0XHRcdFx0Ym9yZGVyczogJ0AnXG5cdFx0XHR9LFxuXHRcdFx0cmVxdWlyZTogJ25nTW9kZWwnLFxuXHRcdFx0bGluazogZnVuY3Rpb24gKHNjb3BlLCBlbGVtLCBhdHRycywgbmdNb2RlbCkge1xuXHRcdFx0XHR2YXIgb3B0aW9ucyA9IGFuZ3VsYXIuZXh0ZW5kKGRlZmF1bHRzKCksIGF0dHJzKTtcblx0XHRcdFx0dmFyIG5vZGVzID0gW10sXG5cdFx0XHRcdFx0bGlua3MgPSBbXSxcblx0XHRcdFx0XHRncm91cHMgPSBbXTtcblxuXHRcdFx0XHR2YXIgbWF4X2Ftb3VudCA9IGQzLm1heChzY29wZS5jaGFydGRhdGEsIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHBhcnNlSW50KGQudmFsdWUpO1xuXHRcdFx0XHR9KTtcblxuXHRcdFx0XHRvcHRpb25zLnJhZGl1c19zY2FsZSA9IGQzLnNjYWxlLnBvdygpLmV4cG9uZW50KDAuNSkuZG9tYWluKFswLCBtYXhfYW1vdW50XSkucmFuZ2UoWzIsIDg1XSk7XG5cdFx0XHRcdG9wdGlvbnMuY2VudGVyID0ge1xuXHRcdFx0XHRcdHg6IG9wdGlvbnMud2lkdGggLyAyLFxuXHRcdFx0XHRcdHk6IG9wdGlvbnMuaGVpZ2h0IC8gMlxuXHRcdFx0XHR9O1xuXHRcdFx0XHRvcHRpb25zLmNhdF9jZW50ZXJzID0ge1xuXHRcdFx0XHRcdFwiZWhcIjoge1xuXHRcdFx0XHRcdFx0eDogb3B0aW9ucy53aWR0aCAvIDIsXG5cdFx0XHRcdFx0XHR5OiBvcHRpb25zLmhlaWdodCAgKiAwLjQ1LFxuXHRcdFx0XHRcdFx0ZGFtcGVyOiAwLjA4NVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XCJldlwiOiB7XG5cdFx0XHRcdFx0XHR4OiBvcHRpb25zLndpZHRoIC8gMixcblx0XHRcdFx0XHRcdHk6IG9wdGlvbnMuaGVpZ2h0ICAqIDAuNTUsXG5cdFx0XHRcdFx0XHRkYW1wZXI6IDAuMDg1XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9O1xuXHRcdFx0XHR2YXIgY3JlYXRlX25vZGVzID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdC8vY29uc29sZS5sb2coc2NvcGUuaW5kZXhlcik7XG5cdFx0XHRcdFx0Ly9jb25zb2xlLmxvZyhzY29wZS5jaGFydGRhdGEpO1xuXHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChzY29wZS5pbmRleGVyLCBmdW5jdGlvbiAoZ3JvdXApIHtcblx0XHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChncm91cC5jaGlsZHJlbiwgZnVuY3Rpb24gKGl0ZW0pIHtcblx0XHRcdFx0XHRcdFx0Ly9jb25zb2xlLmxvZyhzY29wZS5jaGFydGRhdGFbaXRlbS5jb2x1bW5fbmFtZV0sIHNjb3BlLmNoYXJ0ZGF0YVtpdGVtLmNvbHVtbl9uYW1lXSAvIHNjb3BlLnNpemVmYWN0b3IpO1xuXHRcdFx0XHRcdFx0XHRpZiAoc2NvcGUuY2hhcnRkYXRhW2l0ZW0uY29sdW1uX25hbWVdKSB7XG5cdFx0XHRcdFx0XHRcdFx0dmFyIG5vZGUgPSB7XG5cdFx0XHRcdFx0XHRcdFx0XHR0eXBlOiBpdGVtLmNvbHVtbl9uYW1lLFxuXHRcdFx0XHRcdFx0XHRcdFx0cmFkaXVzOiBzY29wZS5jaGFydGRhdGFbaXRlbS5jb2x1bW5fbmFtZV0gLyBzY29wZS5zaXplZmFjdG9yLFxuXHRcdFx0XHRcdFx0XHRcdFx0dmFsdWU6IHNjb3BlLmNoYXJ0ZGF0YVtpdGVtLmNvbHVtbl9uYW1lXSAvIHNjb3BlLnNpemVmYWN0b3IsXG5cdFx0XHRcdFx0XHRcdFx0XHRuYW1lOiBpdGVtLnRpdGxlLFxuXHRcdFx0XHRcdFx0XHRcdFx0Z3JvdXA6IGdyb3VwLmNvbHVtbl9uYW1lLnN1YnN0cmluZygwLDIpLFxuXHRcdFx0XHRcdFx0XHRcdFx0eDogb3B0aW9ucy5jZW50ZXIueCxcblx0XHRcdFx0XHRcdFx0XHRcdHk6IG9wdGlvbnMuY2VudGVyLnksXG5cdFx0XHRcdFx0XHRcdFx0XHRjb2xvcjogaXRlbS5jb2xvcixcblx0XHRcdFx0XHRcdFx0XHRcdGljb246IGl0ZW0uaWNvbixcblx0XHRcdFx0XHRcdFx0XHRcdHVuaWNvZGU6IGl0ZW0udW5pY29kZSxcblx0XHRcdFx0XHRcdFx0XHRcdGRhdGE6IGl0ZW1cblx0XHRcdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdFx0XHRcdG5vZGVzLnB1c2gobm9kZSk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdGNyZWF0ZV9ncm91cHMoKTtcblx0XHRcdFx0fTtcblx0XHRcdFx0dmFyIGNyZWF0ZV9ncm91cHMgPSBmdW5jdGlvbigpe1xuXHRcdFx0XHRcdGdyb3VwcyA9IHt9O1xuXHRcdFx0XHRcdHZhciBjb3VudCA9IDA7XG5cdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKG5vZGVzLCBmdW5jdGlvbihub2RlKXtcblx0XHRcdFx0XHRcdFx0dmFyIGV4aXN0cyA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0XHR2YXIgZ3JvdXAgPSB7fTtcblx0XHRcdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKGdyb3VwcywgZnVuY3Rpb24oZ3JvdXAsIGluZGV4KXtcblx0XHRcdFx0XHRcdFx0XHRpZihub2RlLmdyb3VwID09IGluZGV4KXtcblx0XHRcdFx0XHRcdFx0XHRcdGV4aXN0cyA9IHRydWU7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdFx0aWYoIWV4aXN0cyl7XG5cdFx0XHRcdFx0XHRcdFx0Y291bnQrKztcblx0XHRcdFx0XHRcdFx0XHRncm91cHNbbm9kZS5ncm91cF0gPSB7XG5cdFx0XHRcdFx0XHRcdFx0XHR4OiBvcHRpb25zLndpZHRoIC8gMixcblx0XHRcdFx0XHRcdFx0XHRcdHk6IG9wdGlvbnMud2lkdGggLyAyICsgKDEgLSBjb3VudCksXG5cdFx0XHRcdFx0XHRcdFx0XHRkYW1wZXI6IDAuMDg1XG5cdFx0XHRcdFx0XHRcdFx0fTtcblxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2coZ3JvdXBzKTtcblx0XHRcdFx0fTtcblx0XHRcdFx0dmFyIGNyZWF0ZV92aXMgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0YW5ndWxhci5lbGVtZW50KGVsZW0pLmh0bWwoJycpO1xuXHRcdFx0XHRcdG9wdGlvbnMudmlzID0gZDMuc2VsZWN0KGVsZW1bMF0pLmFwcGVuZChcInN2Z1wiKS5hdHRyKFwid2lkdGhcIiwgb3B0aW9ucy53aWR0aCkuYXR0cihcImhlaWdodFwiLCBvcHRpb25zLmhlaWdodCkuYXR0cihcImlkXCIsIFwic3ZnX3Zpc1wiKTtcblxuXHRcdFx0XHRcdGlmICghb3B0aW9ucy5ib3JkZXJzKSB7XG5cdFx0XHRcdFx0XHR2YXIgcGkgPSBNYXRoLlBJO1xuXHRcdFx0XHRcdFx0dmFyIGFyY1RvcCA9IGQzLnN2Zy5hcmMoKVxuXHRcdFx0XHRcdFx0XHQuaW5uZXJSYWRpdXMoMTA5KVxuXHRcdFx0XHRcdFx0XHQub3V0ZXJSYWRpdXMoMTEwKVxuXHRcdFx0XHRcdFx0XHQuc3RhcnRBbmdsZSgtOTAgKiAocGkgLyAxODApKSAvL2NvbnZlcnRpbmcgZnJvbSBkZWdzIHRvIHJhZGlhbnNcblx0XHRcdFx0XHRcdFx0LmVuZEFuZ2xlKDkwICogKHBpIC8gMTgwKSk7IC8vanVzdCByYWRpYW5zXG5cdFx0XHRcdFx0XHR2YXIgYXJjQm90dG9tID0gZDMuc3ZnLmFyYygpXG5cdFx0XHRcdFx0XHRcdC5pbm5lclJhZGl1cygxMzQpXG5cdFx0XHRcdFx0XHRcdC5vdXRlclJhZGl1cygxMzUpXG5cdFx0XHRcdFx0XHRcdC5zdGFydEFuZ2xlKDkwICogKHBpIC8gMTgwKSkgLy9jb252ZXJ0aW5nIGZyb20gZGVncyB0byByYWRpYW5zXG5cdFx0XHRcdFx0XHRcdC5lbmRBbmdsZSgyNzAgKiAocGkgLyAxODApKTsgLy9qdXN0IHJhZGlhbnNcblxuXHRcdFx0XHRcdFx0b3B0aW9ucy5hcmNUb3AgPSBvcHRpb25zLnZpcy5hcHBlbmQoXCJwYXRoXCIpXG5cdFx0XHRcdFx0XHRcdC5hdHRyKFwiZFwiLCBhcmNUb3ApXG5cdFx0XHRcdFx0XHRcdC5hdHRyKFwiZmlsbFwiLCBcIiNiZTVmMDBcIilcblx0XHRcdFx0XHRcdFx0LmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoMTcwLDE0MClcIik7XG5cdFx0XHRcdFx0XHRvcHRpb25zLmFyY0JvdHRvbSA9IG9wdGlvbnMudmlzLmFwcGVuZChcInBhdGhcIilcblx0XHRcdFx0XHRcdFx0LmF0dHIoXCJkXCIsIGFyY0JvdHRvbSlcblx0XHRcdFx0XHRcdFx0LmF0dHIoXCJmaWxsXCIsIFwiIzAwNmJiNlwiKVxuXHRcdFx0XHRcdFx0XHQuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZSgxNzAsMTgwKVwiKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0b3B0aW9ucy5jb250YWluZXJzID0gb3B0aW9ucy52aXMuc2VsZWN0QWxsKCdnLm5vZGUnKS5kYXRhKG5vZGVzKS5lbnRlcigpLmFwcGVuZCgnZycpLmF0dHIoJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoJyArIChvcHRpb25zLndpZHRoIC8gMikgKyAnLCcgKyAob3B0aW9ucy5oZWlnaHQgLyAyKSArICcpJykuYXR0cignY2xhc3MnLCAnbm9kZScpO1xuXG5cdFx0XHRcdFx0LypvcHRpb25zLmNpcmNsZXMgPSBvcHRpb25zLmNvbnRhaW5lcnMuc2VsZWN0QWxsKFwiY2lyY2xlXCIpLmRhdGEobm9kZXMsIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZC5pZDtcblx0XHRcdFx0XHR9KTsqL1xuXG5cdFx0XHRcdFx0b3B0aW9ucy5jaXJjbGVzID0gb3B0aW9ucy5jb250YWluZXJzLmFwcGVuZChcImNpcmNsZVwiKS5hdHRyKFwiclwiLCAwKS5hdHRyKFwiZmlsbFwiLCAoZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdHJldHVybiBkLmNvbG9yIHx8IG9wdGlvbnMuZmlsbF9jb2xvcihkLmdyb3VwKTtcblx0XHRcdFx0XHR9KSkuYXR0cihcInN0cm9rZS13aWR0aFwiLCAwKS5hdHRyKFwic3Ryb2tlXCIsIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZDMucmdiKG9wdGlvbnMuZmlsbF9jb2xvcihkLmdyb3VwKSkuZGFya2VyKCk7XG5cdFx0XHRcdFx0fSkuYXR0cihcImlkXCIsIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gXCJidWJibGVfXCIgKyBkLmlkO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdG9wdGlvbnMuaWNvbnMgPSBvcHRpb25zLmNvbnRhaW5lcnMuYXBwZW5kKFwidGV4dFwiKVxuXHRcdFx0XHRcdFx0LmF0dHIoJ2ZvbnQtZmFtaWx5JywgJ0VQSScpXG5cdFx0XHRcdFx0XHQuYXR0cignZm9udC1zaXplJywgZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdFx0MFxuXHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRcdC5hdHRyKFwidGV4dC1hbmNob3JcIiwgXCJtaWRkbGVcIilcblx0XHRcdFx0XHRcdC5hdHRyKCdmaWxsJywgJyNmZmYnKVxuXHRcdFx0XHRcdFx0LnRleHQoZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGQudW5pY29kZVxuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0b3B0aW9ucy5pY29ucy5vbihcIm1vdXNlb3ZlclwiLCBmdW5jdGlvbiAoZCwgaSkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIHNob3dfZGV0YWlscyhkLCBpLCB0aGlzKTtcblx0XHRcdFx0XHR9KS5vbihcIm1vdXNlb3V0XCIsIGZ1bmN0aW9uIChkLCBpKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gaGlkZV9kZXRhaWxzKGQsIGksIHRoaXMpO1xuXHRcdFx0XHRcdH0pLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24gKGQsIGkpIHtcblx0XHRcdFx0XHRcdG5nTW9kZWwuJHNldFZpZXdWYWx1ZShkKTtcblx0XHRcdFx0XHRcdG5nTW9kZWwuJHJlbmRlcigpO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdG9wdGlvbnMuY2lyY2xlcy50cmFuc2l0aW9uKCkuZHVyYXRpb24ob3B0aW9ucy5kdXJhdGlvbikuYXR0cihcInJcIiwgZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdHJldHVybiBkLnJhZGl1cztcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRvcHRpb25zLmljb25zLnRyYW5zaXRpb24oKS5kdXJhdGlvbihvcHRpb25zLmR1cmF0aW9uKS5hdHRyKFwiZm9udC1zaXplXCIsIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZC5yYWRpdXMgKiAxLjc1ICsgJ3B4Jztcblx0XHRcdFx0XHR9KS5hdHRyKCd5JywgZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdHJldHVybiBkLnJhZGl1cyAqIC43NSArICdweCc7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH07XG5cdFx0XHRcdHZhciB1cGRhdGVfdmlzID0gZnVuY3Rpb24gKCkge1xuXG5cdFx0XHRcdFx0bm9kZXMuZm9yRWFjaChmdW5jdGlvbiAoZCwgaSkge1xuXHRcdFx0XHRcdFx0b3B0aW9ucy5jaXJjbGVzLnRyYW5zaXRpb24oKS5kdXJhdGlvbihvcHRpb25zLmR1cmF0aW9uKS5kZWxheShpICogb3B0aW9ucy5kdXJhdGlvbilcblx0XHRcdFx0XHRcdFx0LmF0dHIoXCJyXCIsIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRcdFx0ZC5yYWRpdXMgPSBkLnZhbHVlID0gc2NvcGUuY2hhcnRkYXRhW2QudHlwZV0gLyBzY29wZS5zaXplZmFjdG9yO1xuXG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIHNjb3BlLmNoYXJ0ZGF0YVtkLnR5cGVdIC8gc2NvcGUuc2l6ZWZhY3Rvcjtcblx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRvcHRpb25zLmljb25zLnRyYW5zaXRpb24oKS5kdXJhdGlvbihvcHRpb25zLmR1cmF0aW9uKS5kZWxheShpICogb3B0aW9ucy5kdXJhdGlvbilcblx0XHRcdFx0XHRcdFx0LmF0dHIoXCJmb250LXNpemVcIiwgZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gKHNjb3BlLmNoYXJ0ZGF0YVtkLnR5cGVdIC8gc2NvcGUuc2l6ZWZhY3RvcikgKiAxLjc1ICsgJ3B4J1xuXHRcdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0XHQuYXR0cigneScsIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIChzY29wZS5jaGFydGRhdGFbZC50eXBlXSAvIHNjb3BlLnNpemVmYWN0b3IpICogLjc1ICsgJ3B4Jztcblx0XHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fTtcblx0XHRcdFx0dmFyIGNoYXJnZSA9IGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0cmV0dXJuIC1NYXRoLnBvdyhkLnJhZGl1cywgMi4wKSAvIDQ7XG5cdFx0XHRcdH07XG5cdFx0XHRcdHZhciBzdGFydCA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRyZXR1cm4gb3B0aW9ucy5mb3JjZSA9IGQzLmxheW91dC5mb3JjZSgpLm5vZGVzKG5vZGVzKS5zaXplKFtvcHRpb25zLndpZHRoLCBvcHRpb25zLmhlaWdodF0pLmxpbmtzKGxpbmtzKTtcblx0XHRcdFx0fTtcblx0XHRcdFx0dmFyIGRpc3BsYXlfZ3JvdXBfYWxsID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdG9wdGlvbnMuZm9yY2UuZ3Jhdml0eShvcHRpb25zLmxheW91dF9ncmF2aXR5KS5jaGFyZ2UoY2hhcmdlKS5mcmljdGlvbigwLjkpLm9uKFwidGlja1wiLCBmdW5jdGlvbiAoZSkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIG9wdGlvbnMuY2lyY2xlcy5lYWNoKG1vdmVfdG93YXJkc19jZW50ZXIoZS5hbHBoYSkpLmF0dHIoJ2N4JywgZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGQueDtcblx0XHRcdFx0XHRcdH0pLmF0dHIoXCJjeVwiLCBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gZC55O1xuXHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRvcHRpb25zLmZvcmNlLnN0YXJ0KCk7XG5cdFx0XHRcdH07XG5cdFx0XHRcdHZhciBkaXNwbGF5X2J5X2NhdCA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRvcHRpb25zLmZvcmNlLmdyYXZpdHkob3B0aW9ucy5sYXlvdXRfZ3Jhdml0eSkuY2hhcmdlKGNoYXJnZSkuZnJpY3Rpb24oMC45KS5vbihcInRpY2tcIiwgZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0XHRcdG9wdGlvbnMuY29udGFpbmVycy5lYWNoKG1vdmVfdG93YXJkc19jYXQoZS5hbHBoYSkpLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuICd0cmFuc2xhdGUoJyArIGQueCArICcsJyArIGQueSArICcpJztcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdG9wdGlvbnMuZm9yY2Uuc3RhcnQoKTtcblx0XHRcdFx0fTtcblx0XHRcdFx0dmFyIG1vdmVfdG93YXJkc19jZW50ZXIgPSBmdW5jdGlvbiAoYWxwaGEpIHtcblx0XHRcdFx0XHRyZXR1cm4gKGZ1bmN0aW9uIChfdGhpcykge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRcdGQueCA9IGQueCArIChvcHRpb25zLmNlbnRlci54IC0gZC54KSAqIChvcHRpb25zLmRhbXBlciArIDAuMDIpICogYWxwaGE7XG5cdFx0XHRcdFx0XHRcdGQueSA9IGQueSArIChvcHRpb25zLmNlbnRlci55IC0gZC55KSAqIChvcHRpb25zLmRhbXBlciArIDAuMDIpICogYWxwaGE7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSkodGhpcyk7XG5cdFx0XHRcdH07XG5cdFx0XHRcdHZhciBtb3ZlX3Rvd2FyZHNfdG9wID0gZnVuY3Rpb24gKGFscGhhKSB7XG5cdFx0XHRcdFx0cmV0dXJuIChmdW5jdGlvbiAoX3RoaXMpIHtcblx0XHRcdFx0XHRcdHJldHVybiBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0XHRkLnggPSBkLnggKyAob3B0aW9ucy5jZW50ZXIueCAtIGQueCkgKiAob3B0aW9ucy5kYW1wZXIgKyAwLjAyKSAqIGFscGhhICogMS4xO1xuXHRcdFx0XHRcdFx0XHRkLnkgPSBkLnkgKyAoMjAwIC0gZC55KSAqIChvcHRpb25zLmRhbXBlciArIDAuMDIpICogYWxwaGEgKiAxLjE7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSkodGhpcyk7XG5cdFx0XHRcdH07XG5cdFx0XHRcdHZhciBtb3ZlX3Rvd2FyZHNfY2F0ID0gZnVuY3Rpb24gKGFscGhhKSB7XG5cdFx0XHRcdFx0cmV0dXJuIChmdW5jdGlvbiAoX3RoaXMpIHtcblx0XHRcdFx0XHRcdHJldHVybiBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0XHR2YXIgdGFyZ2V0O1xuXHRcdFx0XHRcdFx0XHR0YXJnZXQgPSBvcHRpb25zLmNhdF9jZW50ZXJzW2QuZ3JvdXBdO1xuXHRcdFx0XHRcdFx0XHRkLnggPSBkLnggKyAodGFyZ2V0LnggLSBkLngpICogKHRhcmdldC5kYW1wZXIgKyAwLjAyKSAqIGFscGhhICogMTtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGQueSA9IGQueSArICh0YXJnZXQueSAtIGQueSkgKiAodGFyZ2V0LmRhbXBlciArIDAuMDIpICogYWxwaGEgKiAxO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pKHRoaXMpO1xuXHRcdFx0XHR9O1xuXHRcdFx0XHR2YXIgc2hvd19kZXRhaWxzID0gZnVuY3Rpb24gKGRhdGEsIGksIGVsZW1lbnQpIHtcblx0XHRcdFx0XHR2YXIgY29udGVudDtcblx0XHRcdFx0XHRjb250ZW50ID0gXCI8c3BhbiBjbGFzcz1cXFwidGl0bGVcXFwiPlwiICsgZGF0YS5uYW1lICsgXCI6PC9zcGFuPjxici8+XCI7XG5cdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKGRhdGEuZGF0YS5jaGlsZHJlbiwgZnVuY3Rpb24gKGluZm8pIHtcblx0XHRcdFx0XHRcdGNvbnRlbnQgKz0gXCI8c3BhbiBjbGFzcz1cXFwibmFtZVxcXCIgc3R5bGU9XFxcImNvbG9yOlwiICsgKGluZm8uY29sb3IgfHwgZGF0YS5jb2xvcikgKyBcIlxcXCI+IFwiICsgKGluZm8udGl0bGUpICsgXCI8L3NwYW4+PGJyLz5cIjtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHQkY29tcGlsZShvcHRpb25zLnRvb2x0aXAuc2hvd1Rvb2x0aXAoY29udGVudCwgZGF0YSwgZDMuZXZlbnQsIGVsZW0pLmNvbnRlbnRzKCkpKHNjb3BlKTtcblx0XHRcdFx0fTtcblxuXHRcdFx0XHR2YXIgaGlkZV9kZXRhaWxzID0gZnVuY3Rpb24gKGRhdGEsIGksIGVsZW1lbnQpIHtcblx0XHRcdFx0XHRyZXR1cm4gb3B0aW9ucy50b29sdGlwLmhpZGVUb29sdGlwKCk7XG5cdFx0XHRcdH07XG5cblx0XHRcdFx0c2NvcGUuJHdhdGNoKCdjaGFydGRhdGEnLCBmdW5jdGlvbiAoZGF0YSwgb2xkRGF0YSkge1xuXHRcdFx0XHRcdG9wdGlvbnMudG9vbHRpcC5oaWRlVG9vbHRpcCgpO1xuXHRcdFx0XHRcdGlmIChvcHRpb25zLmNpcmNsZXMgPT0gbnVsbCkge1xuXHRcdFx0XHRcdFx0Y3JlYXRlX25vZGVzKCk7XG5cdFx0XHRcdFx0XHRjcmVhdGVfdmlzKCk7XG5cdFx0XHRcdFx0XHRzdGFydCgpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHR1cGRhdGVfdmlzKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGRpc3BsYXlfYnlfY2F0KCk7XG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRcdHNjb3BlLiR3YXRjaCgnZGlyZWN0aW9uJywgZnVuY3Rpb24gKG9sZEQsIG5ld0QpIHtcblx0XHRcdFx0XHRpZiAob2xkRCA9PT0gbmV3RCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAob2xkRCA9PSBcImFsbFwiKSB7XG5cdFx0XHRcdFx0XHRkaXNwbGF5X2dyb3VwX2FsbCgpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRkaXNwbGF5X2J5X2NhdCgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSlcblx0XHRcdH1cblx0XHR9O1xuXHR9KTtcbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoICdhcHAuY29udHJvbGxlcnMnICkuY29udHJvbGxlciggJ0NpcmNsZWdyYXBoQ3RybCcsIGZ1bmN0aW9uKCl7XG5cdFx0Ly9cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5kaXJlY3RpdmVzJykuZGlyZWN0aXZlKCdjaXJjbGVncmFwaCcsIGZ1bmN0aW9uKCR0aW1lb3V0KSB7XG5cdFx0dmFyIGRlZmF1bHRzID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHR3aWR0aDogODAsXG5cdFx0XHRcdGhlaWdodDogODAsXG5cdFx0XHRcdGNvbG9yOiAnIzAwY2NhYScsXG5cdFx0XHRcdHNpemU6IDE3OFxuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4ge1xuXHRcdFx0cmVzdHJpY3Q6ICdFJyxcblx0XHRcdGNvbnRyb2xsZXI6ICdDaXJjbGVncmFwaEN0cmwnLFxuXHRcdFx0c2NvcGU6IHRydWUsXG5cdFx0XHRyZXF1aXJlOiAnbmdNb2RlbCcsXG5cdFx0XHRsaW5rOiBmdW5jdGlvbigkc2NvcGUsIGVsZW1lbnQsICRhdHRycywgbmdNb2RlbCkge1xuXHRcdFx0XHQvL0ZldGNoaW5nIE9wdGlvbnNcblx0XHRcdFx0dmFyIG9wdGlvbnMgPSBhbmd1bGFyLmV4dGVuZChkZWZhdWx0cygpLCAkYXR0cnMpO1xuXG5cdFx0XHRcdC8vQ3JlYXRpbmcgdGhlIFNjYWxlXG5cdFx0XHRcdHZhciByb3RhdGUgPSBkMy5zY2FsZS5saW5lYXIoKVxuXHRcdFx0XHRcdC5kb21haW4oWzEsIG9wdGlvbnMuc2l6ZV0pXG5cdFx0XHRcdFx0LnJhbmdlKFsxLCAwXSlcblx0XHRcdFx0XHQuY2xhbXAodHJ1ZSk7XG5cblx0XHRcdFx0Ly9DcmVhdGluZyBFbGVtZW50c1xuXHRcdFx0XHR2YXIgc3ZnID0gZDMuc2VsZWN0KGVsZW1lbnRbMF0pLmFwcGVuZCgnc3ZnJylcblx0XHRcdFx0XHQuYXR0cignd2lkdGgnLCBvcHRpb25zLndpZHRoKVxuXHRcdFx0XHRcdC5hdHRyKCdoZWlnaHQnLCBvcHRpb25zLmhlaWdodClcblx0XHRcdFx0XHQuYXBwZW5kKCdnJyk7XG5cdFx0XHRcdHZhciBjb250YWluZXIgPSBzdmcuYXBwZW5kKCdnJylcblx0XHRcdFx0XHQuYXR0cigndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgnICsgb3B0aW9ucy53aWR0aCAvIDIgKyAnLCcgKyBvcHRpb25zLmhlaWdodCAvIDIgKyAnKScpO1xuXHRcdFx0XHR2YXIgY2lyY2xlQmFjayA9IGNvbnRhaW5lci5hcHBlbmQoJ2NpcmNsZScpXG5cdFx0XHRcdFx0LmF0dHIoJ3InLCBvcHRpb25zLndpZHRoIC8gMiAtIDIpXG5cdFx0XHRcdFx0LmF0dHIoJ3N0cm9rZS13aWR0aCcsIDIpXG5cdFx0XHRcdFx0LmF0dHIoJ3N0cm9rZScsIG9wdGlvbnMuY29sb3IpXG5cdFx0XHRcdFx0LnN0eWxlKCdvcGFjaXR5JywgJzAuNicpXG5cdFx0XHRcdFx0LmF0dHIoJ2ZpbGwnLCAnbm9uZScpO1xuXHRcdFx0XHR2YXIgYXJjID0gZDMuc3ZnLmFyYygpXG5cdFx0XHRcdFx0LnN0YXJ0QW5nbGUoMClcblx0XHRcdFx0XHQuaW5uZXJSYWRpdXMoZnVuY3Rpb24oZCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIG9wdGlvbnMud2lkdGggLyAyIC0gNDtcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC5vdXRlclJhZGl1cyhmdW5jdGlvbihkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gb3B0aW9ucy53aWR0aCAvIDI7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdHZhciBjaXJjbGVHcmFwaCA9IGNvbnRhaW5lci5hcHBlbmQoJ3BhdGgnKVxuXHRcdFx0XHRcdC5kYXR1bSh7XG5cdFx0XHRcdFx0XHRlbmRBbmdsZTogMiAqIE1hdGguUEkgKiAwXG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQuc3R5bGUoXCJmaWxsXCIsIG9wdGlvbnMuY29sb3IpXG5cdFx0XHRcdFx0LmF0dHIoJ2QnLCBhcmMpO1xuXHRcdFx0XHR2YXIgdGV4dCA9IGNvbnRhaW5lci5zZWxlY3RBbGwoJ3RleHQnKVxuXHRcdFx0XHRcdC5kYXRhKFswXSlcblx0XHRcdFx0XHQuZW50ZXIoKVxuXHRcdFx0XHRcdC5hcHBlbmQoJ3RleHQnKVxuXHRcdFx0XHRcdC50ZXh0KGZ1bmN0aW9uKGQpIHtcblx0XHRcdFx0XHRcdHJldHVybiAnTsKwJyArIGQ7XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRcdC5zdHlsZShcImZpbGxcIiwgb3B0aW9ucy5jb2xvcilcblx0XHRcdFx0XHQuc3R5bGUoJ2ZvbnQtd2VpZ2h0JywgJ2JvbGQnKVxuXHRcdFx0XHRcdC5hdHRyKCd0ZXh0LWFuY2hvcicsICdtaWRkbGUnKVxuXHRcdFx0XHRcdC5hdHRyKCd5JywgJzAuMzVlbScpO1xuXG5cdFx0XHRcdC8vVHJhbnNpdGlvbiBpZiBzZWxlY3Rpb24gaGFzIGNoYW5nZWRcblx0XHRcdFx0ZnVuY3Rpb24gYW5pbWF0ZUl0KHJhZGl1cykge1xuXHRcdFx0XHRcdGNpcmNsZUdyYXBoLnRyYW5zaXRpb24oKVxuXHRcdFx0XHRcdFx0LmR1cmF0aW9uKDc1MClcblx0XHRcdFx0XHRcdC5jYWxsKGFyY1R3ZWVuLCByb3RhdGUocmFkaXVzKSAqIDIgKiBNYXRoLlBJKTtcblx0XHRcdFx0XHR0ZXh0LnRyYW5zaXRpb24oKS5kdXJhdGlvbig3NTApLnR3ZWVuKCd0ZXh0JywgZnVuY3Rpb24oZCkge1xuXHRcdFx0XHRcdFx0dmFyIGRhdGEgPSB0aGlzLnRleHRDb250ZW50LnNwbGl0KCdOwrAnKTtcblxuXHRcdFx0XHRcdFx0dmFyIGkgPSBkMy5pbnRlcnBvbGF0ZShkYXRhWzFdLCByYWRpdXMpO1xuXHRcdFx0XHRcdFx0cmV0dXJuIGZ1bmN0aW9uKHQpIHtcblx0XHRcdFx0XHRcdFx0dGhpcy50ZXh0Q29udGVudCA9ICAnTsKwJyArIChNYXRoLnJvdW5kKGkodCkgKiAxKSAvIDEpO1xuXHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly9Ud2VlbiBhbmltYXRpb24gZm9yIHRoZSBBcmNcblx0XHRcdFx0ZnVuY3Rpb24gYXJjVHdlZW4odHJhbnNpdGlvbiwgbmV3QW5nbGUpIHtcblx0XHRcdFx0XHR0cmFuc2l0aW9uLmF0dHJUd2VlbihcImRcIiwgZnVuY3Rpb24oZCkge1xuXHRcdFx0XHRcdFx0dmFyIGludGVycG9sYXRlID0gZDMuaW50ZXJwb2xhdGUoZC5lbmRBbmdsZSwgbmV3QW5nbGUpO1xuXHRcdFx0XHRcdFx0cmV0dXJuIGZ1bmN0aW9uKHQpIHtcblx0XHRcdFx0XHRcdFx0ZC5lbmRBbmdsZSA9IGludGVycG9sYXRlKHQpO1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gYXJjKGQpO1xuXHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vV2F0Y2hpbmcgaWYgc2VsZWN0aW9uIGhhcyBjaGFuZ2VkIGZyb20gYW5vdGhlciBVSSBlbGVtZW50XG5cdFx0XHRcdCRzY29wZS4kd2F0Y2goXG5cdFx0XHRcdFx0ZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gbmdNb2RlbC4kbW9kZWxWYWx1ZTtcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdGZ1bmN0aW9uKG5ld1ZhbHVlLCBvbGRWYWx1ZSkge1xuXHRcdFx0XHRcdFx0aWYgKCFuZXdWYWx1ZSl7XG5cdFx0XHRcdFx0XHRcdG5ld1ZhbHVlID0ge1xuXHRcdFx0XHRcdFx0XHRcdHJhbms6IG9wdGlvbnMuc2l6ZVxuXHRcdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHQkdGltZW91dChmdW5jdGlvbigpe1xuXHRcdFx0XHRcdFx0XHRhbmltYXRlSXQobmV3VmFsdWUucmFuaylcblx0XHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fTtcblxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSggJ2FwcC5jb250cm9sbGVycycgKS5jb250cm9sbGVyKCAnRGF0YUxpc3RpbmdDdHJsJywgZnVuY3Rpb24oKXtcblx0XHQvL1xuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZGlyZWN0aXZlcycpLmRpcmVjdGl2ZSggJ2RhdGFMaXN0aW5nJywgZnVuY3Rpb24oKSB7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0cmVzdHJpY3Q6ICdFQScsXG5cdFx0XHR0ZW1wbGF0ZVVybDogJ3ZpZXdzL2RpcmVjdGl2ZXMvZGF0YV9saXN0aW5nL2RhdGFfbGlzdGluZy5odG1sJyxcblx0XHRcdGNvbnRyb2xsZXI6ICdEYXRhTGlzdGluZ0N0cmwnLFxuXHRcdFx0bGluazogZnVuY3Rpb24oICRzY29wZSwgZWxlbWVudCwgJGF0dHJzICl7XG5cdFx0XHRcdC8vXG5cdFx0XHR9XG5cdFx0fTtcblxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZGlyZWN0aXZlcycpLmRpcmVjdGl2ZSgnbWVkaWFuJywgZnVuY3Rpb24gKCR0aW1lb3V0KSB7XG5cdFx0dmFyIGRlZmF1bHRzID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0aWQ6ICdncmFkaWVudCcsXG5cdFx0XHRcdHdpZHRoOiAzNDAsXG5cdFx0XHRcdGhlaWdodDogNDAsXG5cdFx0XHRcdGluZm86IHRydWUsXG5cdFx0XHRcdGZpZWxkOiAnc2NvcmUnLFxuXHRcdFx0XHRoYW5kbGluZzogdHJ1ZSxcblx0XHRcdFx0bWFyZ2luOiB7XG5cdFx0XHRcdFx0bGVmdDogMjAsXG5cdFx0XHRcdFx0cmlnaHQ6IDIwLFxuXHRcdFx0XHRcdHRvcDogMTAsXG5cdFx0XHRcdFx0Ym90dG9tOiAxMFxuXHRcdFx0XHR9LFxuXHRcdFx0XHRjb2xvcnM6IFt7XG5cdFx0XHRcdFx0cG9zaXRpb246IDAsXG5cdFx0XHRcdFx0Y29sb3I6ICdyZ2JhKDI1NSwyNTUsMjU1LDEpJyxcblx0XHRcdFx0XHRvcGFjaXR5OiAwXG5cdFx0XHRcdH0sIHtcblx0XHRcdFx0XHRwb3NpdGlvbjogNTMsXG5cdFx0XHRcdFx0Y29sb3I6ICdyZ2JhKDEyOCwgMjQzLCAxOTgsMSknLFxuXHRcdFx0XHRcdG9wYWNpdHk6IDFcblx0XHRcdFx0fSwge1xuXHRcdFx0XHRcdHBvc2l0aW9uOiAxMDAsXG5cdFx0XHRcdFx0Y29sb3I6ICdyZ2JhKDEwMiwxMDIsMTAyLDEpJyxcblx0XHRcdFx0XHRvcGFjaXR5OiAxXG5cdFx0XHRcdH1dXG5cdFx0XHR9O1xuXHRcdH1cblx0XHRyZXR1cm4ge1xuXHRcdFx0cmVzdHJpY3Q6ICdFJyxcblx0XHRcdHNjb3BlOiB7XG5cdFx0XHRcdGRhdGE6ICc9J1xuXHRcdFx0fSxcblx0XHRcdHJlcXVpcmU6ICduZ01vZGVsJyxcblx0XHRcdGxpbms6IGZ1bmN0aW9uICgkc2NvcGUsIGVsZW1lbnQsICRhdHRycywgbmdNb2RlbCkge1xuXG5cdFx0XHRcdHZhciBvcHRpb25zID0gYW5ndWxhci5leHRlbmQoZGVmYXVsdHMoKSwgJGF0dHJzKTtcblx0XHRcdFx0Ly9jb25zb2xlLmxvZyhvcHRpb25zLmNvbG9yKTtcblx0XHRcdFx0aWYob3B0aW9ucy5jb2xvcil7XG5cdFx0XHRcdFx0b3B0aW9ucy5jb2xvcnNbMV0uY29sb3IgPSBvcHRpb25zLmNvbG9yO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsZW1lbnQuY3NzKCdoZWlnaHQnLCBvcHRpb25zLmhlaWdodCArICdweCcpLmNzcygnYm9yZGVyLXJhZGl1cycsIG9wdGlvbnMuaGVpZ2h0IC8gMiArICdweCcpO1xuXHRcdFx0XHR2YXIgeCA9IGQzLnNjYWxlLmxpbmVhcigpXG5cdFx0XHRcdFx0LmRvbWFpbihbMCwgMTAwXSlcblx0XHRcdFx0XHQucmFuZ2UoWzIwLCBvcHRpb25zLndpZHRoIC0gb3B0aW9ucy5tYXJnaW4ubGVmdF0pXG5cdFx0XHRcdFx0LmNsYW1wKHRydWUpO1xuXG5cdFx0XHRcdHZhciBicnVzaCA9IGQzLnN2Zy5icnVzaCgpXG5cdFx0XHRcdFx0LngoeClcblx0XHRcdFx0XHQuZXh0ZW50KFswLCAwXSlcblx0XHRcdFx0XHQub24oXCJicnVzaFwiLCBicnVzaClcblx0XHRcdFx0XHQub24oXCJicnVzaGVuZFwiLCBicnVzaGVkKTtcblxuXHRcdFx0XHR2YXIgc3ZnID0gZDMuc2VsZWN0KGVsZW1lbnRbMF0pLmFwcGVuZChcInN2Z1wiKVxuXHRcdFx0XHRcdC5hdHRyKFwid2lkdGhcIiwgb3B0aW9ucy53aWR0aClcblx0XHRcdFx0XHQuYXR0cihcImhlaWdodFwiLCBvcHRpb25zLmhlaWdodCArIG9wdGlvbnMubWFyZ2luLnRvcCArIG9wdGlvbnMubWFyZ2luLmJvdHRvbSlcblx0XHRcdFx0XHQuYXBwZW5kKFwiZ1wiKTtcblx0XHRcdFx0Ly8uYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZSgwLFwiICsgb3B0aW9ucy5tYXJnaW4udG9wIC8gMiArIFwiKVwiKTtcblx0XHRcdFx0dmFyIGdyYWRpZW50ID0gc3ZnLmFwcGVuZCgnc3ZnOmRlZnMnKVxuXHRcdFx0XHRcdC5hcHBlbmQoXCJzdmc6bGluZWFyR3JhZGllbnRcIilcblx0XHRcdFx0XHQuYXR0cignaWQnLCBvcHRpb25zLmZpZWxkKVxuXHRcdFx0XHRcdC5hdHRyKCd4MScsICcwJScpXG5cdFx0XHRcdFx0LmF0dHIoJ3kxJywgJzAlJylcblx0XHRcdFx0XHQuYXR0cigneDInLCAnMTAwJScpXG5cdFx0XHRcdFx0LmF0dHIoJ3kyJywgJzAlJylcblx0XHRcdFx0XHQuYXR0cignc3ByZWFkTWV0aG9kJywgJ3BhZCcpXG5cdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChvcHRpb25zLmNvbG9ycywgZnVuY3Rpb24gKGNvbG9yKSB7XG5cdFx0XHRcdFx0Z3JhZGllbnQuYXBwZW5kKCdzdmc6c3RvcCcpXG5cdFx0XHRcdFx0XHQuYXR0cignb2Zmc2V0JywgY29sb3IucG9zaXRpb24gKyAnJScpXG5cdFx0XHRcdFx0XHQuYXR0cignc3RvcC1jb2xvcicsIGNvbG9yLmNvbG9yKVxuXHRcdFx0XHRcdFx0LmF0dHIoJ3N0b3Atb3BhY2l0eScsIGNvbG9yLm9wYWNpdHkpO1xuXHRcdFx0XHR9KTtcblx0XHRcdFx0c3ZnLmFwcGVuZCgnc3ZnOnJlY3QnKVxuXHRcdFx0XHRcdC5hdHRyKCd3aWR0aCcsIG9wdGlvbnMud2lkdGgpXG5cdFx0XHRcdFx0LmF0dHIoJ2hlaWdodCcsIG9wdGlvbnMuaGVpZ2h0KVxuXHRcdFx0XHRcdC5zdHlsZSgnZmlsbCcsICd1cmwoIycgKyBvcHRpb25zLmZpZWxkICsgJyknKTtcblx0XHRcdFx0dmFyIGxlZ2VuZCA9IHN2Zy5hcHBlbmQoJ2cnKS5hdHRyKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKCcgKyBvcHRpb25zLmhlaWdodCAvIDIgKyAnLCAnICsgb3B0aW9ucy5oZWlnaHQgLyAyICsgJyknKVxuXHRcdFx0XHRcdC5hdHRyKCdjbGFzcycsICdzdGFydExhYmVsJylcblxuXHRcdFx0XHRpZiAob3B0aW9ucy5pbmZvID09PSB0cnVlKSB7XG5cdFx0XHRcdFx0bGVnZW5kLmFwcGVuZCgnY2lyY2xlJylcblx0XHRcdFx0XHRcdC5hdHRyKCdyJywgb3B0aW9ucy5oZWlnaHQgLyAyKTtcblx0XHRcdFx0XHRsZWdlbmQuYXBwZW5kKCd0ZXh0Jylcblx0XHRcdFx0XHRcdC50ZXh0KDApXG5cdFx0XHRcdFx0XHQuc3R5bGUoJ2ZvbnQtc2l6ZScsIG9wdGlvbnMuaGVpZ2h0LzIuNSlcblx0XHRcdFx0XHRcdC5hdHRyKCd0ZXh0LWFuY2hvcicsICdtaWRkbGUnKVxuXHRcdFx0XHRcdFx0LmF0dHIoJ3knLCAnLjM1ZW0nKVxuXHRcdFx0XHR9XG5cblxuXG5cdFx0XHRcdGlmIChvcHRpb25zLmluZm8gPT09IHRydWUpIHtcblx0XHRcdFx0XHR2YXIgbGVnZW5kMiA9IHN2Zy5hcHBlbmQoJ2cnKS5hdHRyKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKCcgKyAob3B0aW9ucy53aWR0aCAtIChvcHRpb25zLmhlaWdodCAvIDIpKSArICcsICcgKyBvcHRpb25zLmhlaWdodCAvIDIgKyAnKScpXG5cdFx0XHRcdFx0XHQuYXR0cignY2xhc3MnLCAnZW5kTGFiZWwnKVxuXHRcdFx0XHRcdGxlZ2VuZDIuYXBwZW5kKCdjaXJjbGUnKVxuXHRcdFx0XHRcdFx0LmF0dHIoJ3InLCBvcHRpb25zLmhlaWdodCAvIDIpXG5cdFx0XHRcdFx0bGVnZW5kMi5hcHBlbmQoJ3RleHQnKVxuXHRcdFx0XHRcdFx0LnRleHQoMTAwKVxuXHRcdFx0XHRcdFx0LnN0eWxlKCdmb250LXNpemUnLCBvcHRpb25zLmhlaWdodC8yLjUpXG5cdFx0XHRcdFx0XHQuYXR0cigndGV4dC1hbmNob3InLCAnbWlkZGxlJylcblx0XHRcdFx0XHRcdC5hdHRyKCd5JywgJy4zNWVtJylcblx0XHRcdFx0fVxuXHRcdFx0XHR2YXIgc2xpZGVyID0gc3ZnLmFwcGVuZChcImdcIilcblx0XHRcdFx0XHQuYXR0cihcImNsYXNzXCIsIFwic2xpZGVyXCIpO1xuXHRcdFx0XHRpZihvcHRpb25zLmhhbmRsaW5nID09IHRydWUpe1xuXHRcdFx0XHRcdHNsaWRlci5jYWxsKGJydXNoKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHNsaWRlci5zZWxlY3QoXCIuYmFja2dyb3VuZFwiKVxuXHRcdFx0XHRcdC5hdHRyKFwiaGVpZ2h0XCIsIG9wdGlvbnMuaGVpZ2h0KTtcblxuXHRcdFx0XHRpZiAob3B0aW9ucy5pbmZvID09PSB0cnVlKSB7XG5cdFx0XHRcdHNsaWRlci5hcHBlbmQoJ2xpbmUnKVxuXHRcdFx0XHRcdC5hdHRyKCd4MScsIG9wdGlvbnMud2lkdGggLyAyKVxuXHRcdFx0XHRcdC5hdHRyKCd5MScsIDApXG5cdFx0XHRcdFx0LmF0dHIoJ3gyJywgb3B0aW9ucy53aWR0aCAvIDIpXG5cdFx0XHRcdFx0LmF0dHIoJ3kyJywgb3B0aW9ucy5oZWlnaHQpXG5cdFx0XHRcdFx0LmF0dHIoJ3N0cm9rZS1kYXNoYXJyYXknLCAnMywzJylcblx0XHRcdFx0XHQuYXR0cignc3Ryb2tlLXdpZHRoJywgMSlcblx0XHRcdFx0XHQuYXR0cignc3Ryb2tlJywgJ3JnYmEoMCwwLDAsODcpJyk7XG5cdFx0XHRcdH1cblx0XHRcdFx0dmFyIGhhbmRsZUNvbnQgPSBzbGlkZXIuYXBwZW5kKCdnJylcblx0XHRcdFx0XHQuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZSgwLFwiICsgb3B0aW9ucy5oZWlnaHQgLyAyICsgXCIpXCIpO1xuXHRcdFx0XHR2YXIgaGFuZGxlID0gaGFuZGxlQ29udC5hcHBlbmQoXCJjaXJjbGVcIilcblx0XHRcdFx0XHQuYXR0cihcImNsYXNzXCIsIFwiaGFuZGxlXCIpXG5cdFx0XHRcdFx0LmF0dHIoXCJyXCIsIG9wdGlvbnMuaGVpZ2h0IC8gMik7XG5cdFx0XHRcdFx0aWYob3B0aW9ucy5jb2xvcil7XG5cdFx0XHRcdFx0XHRoYW5kbGUuc3R5bGUoJ2ZpbGwnLCBvcHRpb25zLmNvbG9yKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdHZhciBoYW5kbGVMYWJlbCA9IGhhbmRsZUNvbnQuYXBwZW5kKCd0ZXh0Jylcblx0XHRcdFx0XHQudGV4dCgwKVxuXHRcdFx0XHRcdC5zdHlsZSgnZm9udC1zaXplJywgb3B0aW9ucy5oZWlnaHQvMi41KVxuXHRcdFx0XHRcdC5hdHRyKFwidGV4dC1hbmNob3JcIiwgXCJtaWRkbGVcIikuYXR0cigneScsICcwLjM1ZW0nKTtcblxuXHRcdFx0XHQvL3NsaWRlclxuXHRcdFx0XHQvLy5jYWxsKGJydXNoLmV4dGVudChbMCwgMF0pKVxuXHRcdFx0XHQvLy5jYWxsKGJydXNoLmV2ZW50KTtcblxuXHRcdFx0XHRmdW5jdGlvbiBicnVzaCgpIHtcblx0XHRcdFx0XHR2YXIgdmFsdWUgPSBicnVzaC5leHRlbnQoKVswXTtcblxuXHRcdFx0XHRcdGlmIChkMy5ldmVudC5zb3VyY2VFdmVudCkgeyAvLyBub3QgYSBwcm9ncmFtbWF0aWMgZXZlbnRcblx0XHRcdFx0XHRcdHZhbHVlID0geC5pbnZlcnQoZDMubW91c2UodGhpcylbMF0pO1xuXHRcdFx0XHRcdFx0YnJ1c2guZXh0ZW50KFt2YWx1ZSwgdmFsdWVdKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aGFuZGxlTGFiZWwudGV4dChwYXJzZUludCh2YWx1ZSkpO1xuXHRcdFx0XHRcdGhhbmRsZUNvbnQuYXR0cihcInRyYW5zZm9ybVwiLCAndHJhbnNsYXRlKCcgKyB4KHZhbHVlKSArICcsJyArIG9wdGlvbnMuaGVpZ2h0IC8gMiArICcpJyk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRmdW5jdGlvbiBicnVzaGVkKCkge1xuXHRcdFx0XHRcdHZhciB2YWx1ZSA9IGJydXNoLmV4dGVudCgpWzBdLFxuXHRcdFx0XHRcdFx0Y291bnQgPSAwLFxuXHRcdFx0XHRcdFx0Zm91bmQgPSBmYWxzZTtcblx0XHRcdFx0XHR2YXIgZmluYWwgPSBcIlwiO1xuXHRcdFx0XHRcdGRvIHtcblxuXHRcdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKCRzY29wZS5kYXRhLCBmdW5jdGlvbiAobmF0LCBrZXkpIHtcblx0XHRcdFx0XHRcdFx0aWYgKHBhcnNlSW50KG5hdFtvcHRpb25zLmZpZWxkXSkgPT0gcGFyc2VJbnQodmFsdWUpKSB7XG5cdFx0XHRcdFx0XHRcdFx0ZmluYWwgPSBuYXQ7XG5cdFx0XHRcdFx0XHRcdFx0Zm91bmQgPSB0cnVlO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdGNvdW50Kys7XG5cdFx0XHRcdFx0XHR2YWx1ZSA9IHZhbHVlID4gNTAgPyB2YWx1ZSAtIDEgOiB2YWx1ZSArIDE7XG5cdFx0XHRcdFx0fSB3aGlsZSAoIWZvdW5kICYmIGNvdW50IDwgMTAwKTtcblx0XHRcdFx0XHRuZ01vZGVsLiRzZXRWaWV3VmFsdWUoZmluYWwpO1xuXHRcdFx0XHRcdG5nTW9kZWwuJHJlbmRlcigpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0JHNjb3BlLiR3YXRjaChcblx0XHRcdFx0XHRmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gbmdNb2RlbC4kbW9kZWxWYWx1ZTtcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdGZ1bmN0aW9uIChuZXdWYWx1ZSwgb2xkVmFsdWUpIHtcblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKG5ld1ZhbHVlKTtcblx0XHRcdFx0XHRcdGlmICghbmV3VmFsdWUpIHtcblx0XHRcdFx0XHRcdFx0aGFuZGxlTGFiZWwudGV4dChwYXJzZUludCgwKSk7XG5cdFx0XHRcdFx0XHRcdGhhbmRsZUNvbnQuYXR0cihcInRyYW5zZm9ybVwiLCAndHJhbnNsYXRlKCcgKyB4KDApICsgJywnICsgb3B0aW9ucy5oZWlnaHQgLyAyICsgJyknKTtcblx0XHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0aGFuZGxlTGFiZWwudGV4dChwYXJzZUludChuZXdWYWx1ZVtvcHRpb25zLmZpZWxkXSkpO1xuXHRcdFx0XHRcdFx0aWYgKG5ld1ZhbHVlID09IG9sZFZhbHVlKSB7XG5cdFx0XHRcdFx0XHRcdGhhbmRsZUNvbnQuYXR0cihcInRyYW5zZm9ybVwiLCAndHJhbnNsYXRlKCcgKyB4KG5ld1ZhbHVlW29wdGlvbnMuZmllbGRdKSArICcsJyArIG9wdGlvbnMuaGVpZ2h0IC8gMiArICcpJyk7XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRoYW5kbGVDb250LnRyYW5zaXRpb24oKS5kdXJhdGlvbig1MDApLmVhc2UoJ3F1YWQnKS5hdHRyKFwidHJhbnNmb3JtXCIsICd0cmFuc2xhdGUoJyArIHgobmV3VmFsdWVbb3B0aW9ucy5maWVsZF0pICsgJywnICsgb3B0aW9ucy5oZWlnaHQgLyAyICsgJyknKTtcblxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH07XG5cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoICdhcHAuY29udHJvbGxlcnMnICkuY29udHJvbGxlciggJ01lZGlhbkN0cmwnLCBmdW5jdGlvbigpe1xuXHRcdC8vXG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5kaXJlY3RpdmVzJykuZGlyZWN0aXZlKCAnc2ltcGxlbGluZWNoYXJ0JywgZnVuY3Rpb24oKSB7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0cmVzdHJpY3Q6ICdFJyxcblx0XHRcdHNjb3BlOntcblx0XHRcdFx0ZGF0YTonPScsXG5cdFx0XHRcdHNlbGVjdGlvbjonPSdcblx0XHRcdH0sXG5cdFx0XHR0ZW1wbGF0ZVVybDogJ3ZpZXdzL2RpcmVjdGl2ZXMvc2ltcGxlbGluZWNoYXJ0L3NpbXBsZWxpbmVjaGFydC5odG1sJyxcblx0XHRcdGNvbnRyb2xsZXI6ICdTaW1wbGVsaW5lY2hhcnRDdHJsJyxcblx0XHRcdGxpbms6IGZ1bmN0aW9uKCAkc2NvcGUsIGVsZW1lbnQsICRhdHRycyApe1xuXHRcdFx0XHQkc2NvcGUub3B0aW9ucyA9ICRhdHRycztcblx0XHRcdFx0JHNjb3BlLmNhbGN1bGF0ZUdyYXBoKCk7XG5cdFx0XHRcdCRzY29wZS5zZXRDaGFydCgpO1xuXG5cdFx0XHR9XG5cdFx0fTtcblxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdTaW1wbGVsaW5lY2hhcnRDdHJsJywgZnVuY3Rpb24gKCRzY29wZSkge1xuXHRcdCRzY29wZS5jb25maWcgPSB7XG5cdFx0XHR2aXNpYmxlOiB0cnVlLCAvLyBkZWZhdWx0OiB0cnVlXG5cdFx0XHRleHRlbmRlZDogZmFsc2UsIC8vIGRlZmF1bHQ6IGZhbHNlXG5cdFx0XHRkaXNhYmxlZDogZmFsc2UsIC8vIGRlZmF1bHQ6IGZhbHNlXG5cdFx0XHRhdXRvcmVmcmVzaDogdHJ1ZSwgLy8gZGVmYXVsdDogdHJ1ZVxuXHRcdFx0cmVmcmVzaERhdGFPbmx5OiBmYWxzZSwgLy8gZGVmYXVsdDogZmFsc2Vcblx0XHRcdGRlZXBXYXRjaE9wdGlvbnM6IHRydWUsIC8vIGRlZmF1bHQ6IHRydWVcblx0XHRcdGRlZXBXYXRjaERhdGE6IGZhbHNlLCAvLyBkZWZhdWx0OiBmYWxzZVxuXHRcdFx0ZGVlcFdhdGNoQ29uZmlnOiB0cnVlLCAvLyBkZWZhdWx0OiB0cnVlXG5cdFx0XHRkZWJvdW5jZTogMTAgLy8gZGVmYXVsdDogMTBcblx0fSxcblxuXHQkc2NvcGUuY2hhcnQgPSB7XG5cdFx0b3B0aW9uczp7XG5cdFx0XHRjaGFydDp7fVxuXHRcdH0sXG5cdFx0ZGF0YTpbXVxuXHR9O1xuXHRcdCRzY29wZS5zZXRDaGFydCA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdCRzY29wZS5jaGFydC5vcHRpb25zLmNoYXJ0ID0gIHtcblx0XHRcdFx0XHRcdHR5cGU6ICdsaW5lQ2hhcnQnLFxuXHRcdFx0XHRcdFx0bGVnZW5kUG9zaXRpb246ICdsZWZ0Jyxcblx0XHRcdFx0XHRcdG1hcmdpbjoge1xuXHRcdFx0XHRcdFx0XHR0b3A6IDIwLFxuXHRcdFx0XHRcdFx0XHRyaWdodDogMjAsXG5cdFx0XHRcdFx0XHRcdGJvdHRvbTogMjAsXG5cdFx0XHRcdFx0XHRcdGxlZnQ6IDIwXG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0eDogZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGQueDtcblx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHR5OiBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gZC55O1xuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdHNob3dMZWdlbmQ6ZmFsc2UsXG5cdFx0XHRcdFx0XHRzaG93VmFsdWVzOiBmYWxzZSxcblx0XHRcdFx0XHRcdHNob3dZQXhpczogZmFsc2UsXG5cdFx0XHRcdFx0XHR0cmFuc2l0aW9uRHVyYXRpb246IDUwMCxcblx0XHRcdFx0XHRcdHVzZUludGVyYWN0aXZlR3VpZGVsaW5lOiB0cnVlLFxuXHRcdFx0XHRcdFx0Ly9mb3JjZVk6IFsxMDAsIDBdLFxuXHRcdFx0XHRcdFx0Ly95RG9tYWluOnlEb21haW4sXG5cdFx0XHRcdFx0XHR4QXhpczoge1xuXHRcdFx0XHRcdFx0XHRheGlzTGFiZWw6ICcnXG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0eUF4aXM6IHtcblx0XHRcdFx0XHRcdFx0YXhpc0xhYmVsOiAnJyxcblx0XHRcdFx0XHRcdFx0YXhpc0xhYmVsRGlzdGFuY2U6IDMwXG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0bGVnZW5kOiB7XG5cdFx0XHRcdFx0XHRcdHJpZ2h0QWxpZ246IGZhbHNlXG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0bGluZXM6IHtcblx0XHRcdFx0XHRcdFx0aW50ZXJwb2xhdGU6ICdjYXJkaW5hbCdcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0fTtcblx0XHRcdGlmKCRzY29wZS5vcHRpb25zLmludmVydCA9PSBcInRydWVcIil7XG5cdFx0XHRcdCRzY29wZS5jaGFydC5vcHRpb25zLmNoYXJ0LnlEb21haW4gPSBbcGFyc2VJbnQoJHNjb3BlLnJhbmdlLm1heCksJHNjb3BlLnJhbmdlLm1pbl07XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gJHNjb3BlLmNoYXJ0O1xuXHRcdH1cblx0XHQkc2NvcGUuY2FsY3VsYXRlR3JhcGggPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHR2YXIgY2hhcnREYXRhID0gW107XG5cdFx0XHQkc2NvcGUucmFuZ2UgPSB7XG5cdFx0XHRcdG1heDowLFxuXHRcdFx0XHRtaW46MTAwMFxuXHRcdFx0fTtcblx0XHRcdGFuZ3VsYXIuZm9yRWFjaCgkc2NvcGUuc2VsZWN0aW9uLCBmdW5jdGlvbiAoaXRlbSwga2V5KSB7XG5cdFx0XHRcdHZhciBncmFwaCA9IHtcblx0XHRcdFx0XHRpZDoga2V5LFxuXHRcdFx0XHRcdGtleTogaXRlbS50aXRsZSxcblx0XHRcdFx0XHRjb2xvcjogaXRlbS5jb2xvcixcblx0XHRcdFx0XHR2YWx1ZXM6IFtdXG5cdFx0XHRcdH07XG5cdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaCgkc2NvcGUuZGF0YSwgZnVuY3Rpb24gKGRhdGEsIGspIHtcblx0XHRcdFx0XHRncmFwaC52YWx1ZXMucHVzaCh7XG5cdFx0XHRcdFx0XHRpZDogayxcblx0XHRcdFx0XHRcdHg6IGRhdGFbaXRlbS5maWVsZHMueF0sXG5cdFx0XHRcdFx0XHR5OiBkYXRhW2l0ZW0uZmllbGRzLnldXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0JHNjb3BlLnJhbmdlLm1heCA9IE1hdGgubWF4KCRzY29wZS5yYW5nZS5tYXgsIGRhdGFbaXRlbS5maWVsZHMueV0pO1xuXHRcdFx0XHRcdCRzY29wZS5yYW5nZS5taW4gPSBNYXRoLm1pbigkc2NvcGUucmFuZ2UubWluLCBkYXRhW2l0ZW0uZmllbGRzLnldKTtcblx0XHRcdFx0fSk7XG5cdFx0XHRcdGNoYXJ0RGF0YS5wdXNoKGdyYXBoKTtcblx0XHRcdH0pO1xuXG5cdFx0XHQkc2NvcGUuY2hhcnQuZGF0YSA9IGNoYXJ0RGF0YTtcblx0XHRcdGlmKCRzY29wZS5vcHRpb25zLmludmVydCA9PSBcInRydWVcIil7XG5cdFx0XHRcdCRzY29wZS5jaGFydC5vcHRpb25zLmNoYXJ0LnlEb21haW4gPSBbcGFyc2VJbnQoJHNjb3BlLnJhbmdlLm1heCksJHNjb3BlLnJhbmdlLm1pbl07XG5cdFx0XHR9XG5cdFx0fTtcblx0XHQkc2NvcGUuJHdhdGNoKCdkYXRhJywgZnVuY3Rpb24gKG4sIG8pIHtcblx0XHRcdGlmICghbikge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0XHQkc2NvcGUuY2FsY3VsYXRlR3JhcGgoKTtcblx0XHR9KVxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmRpcmVjdGl2ZXMnKS5hbmltYXRpb24oJy5zbGlkZS10b2dnbGUnLCBbJyRhbmltYXRlQ3NzJywgZnVuY3Rpb24oJGFuaW1hdGVDc3MpIHtcblxuXHRcdHZhciBsYXN0SWQgPSAwO1xuICAgICAgICB2YXIgX2NhY2hlID0ge307XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0SWQoZWwpIHtcbiAgICAgICAgICAgIHZhciBpZCA9IGVsWzBdLmdldEF0dHJpYnV0ZShcImRhdGEtc2xpZGUtdG9nZ2xlXCIpO1xuICAgICAgICAgICAgaWYgKCFpZCkge1xuICAgICAgICAgICAgICAgIGlkID0gKytsYXN0SWQ7XG4gICAgICAgICAgICAgICAgZWxbMF0uc2V0QXR0cmlidXRlKFwiZGF0YS1zbGlkZS10b2dnbGVcIiwgaWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGlkO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGdldFN0YXRlKGlkKSB7XG4gICAgICAgICAgICB2YXIgc3RhdGUgPSBfY2FjaGVbaWRdO1xuICAgICAgICAgICAgaWYgKCFzdGF0ZSkge1xuICAgICAgICAgICAgICAgIHN0YXRlID0ge307XG4gICAgICAgICAgICAgICAgX2NhY2hlW2lkXSA9IHN0YXRlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZ2VuZXJhdGVSdW5uZXIoY2xvc2luZywgc3RhdGUsIGFuaW1hdG9yLCBlbGVtZW50LCBkb25lRm4pIHtcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBzdGF0ZS5hbmltYXRpbmcgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHN0YXRlLmFuaW1hdG9yID0gYW5pbWF0b3I7XG4gICAgICAgICAgICAgICAgc3RhdGUuZG9uZUZuID0gZG9uZUZuO1xuICAgICAgICAgICAgICAgIGFuaW1hdG9yLnN0YXJ0KCkuZmluYWxseShmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNsb3NpbmcgJiYgc3RhdGUuZG9uZUZuID09PSBkb25lRm4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnRbMF0uc3R5bGUuaGVpZ2h0ID0gJyc7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgc3RhdGUuYW5pbWF0aW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIHN0YXRlLmFuaW1hdG9yID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgICAgICBzdGF0ZS5kb25lRm4oKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBsZWF2ZTogZnVuY3Rpb24oZWxlbWVudCwgZG9uZUZuKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIHN0YXRlID0gZ2V0U3RhdGUoZ2V0SWQoZWxlbWVudCkpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgaGVpZ2h0ID0gKHN0YXRlLmFuaW1hdGluZyAmJiBzdGF0ZS5oZWlnaHQpID9cbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlLmhlaWdodCA6IGVsZW1lbnRbMF0ub2Zmc2V0SGVpZ2h0O1xuICAgICAgICAgICAgICAgICAgICB2YXIgYW5pbWF0b3IgPSAkYW5pbWF0ZUNzcyhlbGVtZW50LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmcm9tOiB7aGVpZ2h0OiBoZWlnaHQgKyAncHgnLCBvcGFjaXR5OiAxfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvOiB7aGVpZ2h0OiAnMHB4Jywgb3BhY2l0eTogMH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChhbmltYXRvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN0YXRlLmFuaW1hdGluZykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlLmRvbmVGbiA9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZW5lcmF0ZVJ1bm5lcih0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbmltYXRvcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkb25lRm4pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBzdGF0ZS5hbmltYXRvci5lbmQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlLmhlaWdodCA9IGhlaWdodDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZ2VuZXJhdGVSdW5uZXIodHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuaW1hdG9yLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkb25lRm4pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGRvbmVGbigpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGVudGVyOiBmdW5jdGlvbihlbGVtZW50LCBkb25lRm4pIHtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgc3RhdGUgPSBnZXRTdGF0ZShnZXRJZChlbGVtZW50KSk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBoZWlnaHQgPSAoc3RhdGUuYW5pbWF0aW5nICYmIHN0YXRlLmhlaWdodCkgP1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGUuaGVpZ2h0IDogZWxlbWVudFswXS5vZmZzZXRIZWlnaHQ7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGFuaW1hdG9yID0gJGFuaW1hdGVDc3MoZWxlbWVudCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgZnJvbToge2hlaWdodDogJzBweCcsIG9wYWNpdHk6IDB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgdG86IHtoZWlnaHQ6IGhlaWdodCArICdweCcsIG9wYWNpdHk6IDF9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBpZiAoYW5pbWF0b3IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzdGF0ZS5hbmltYXRpbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZS5kb25lRm4gPSBnZW5lcmF0ZVJ1bm5lcihmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbmltYXRvcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvbmVGbik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHN0YXRlLmFuaW1hdG9yLmVuZCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGUuaGVpZ2h0ID0gaGVpZ2h0O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBnZW5lcmF0ZVJ1bm5lcihmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuaW1hdG9yLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkb25lRm4pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGRvbmVGbigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1dKTtcbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoICdhcHAuY29udHJvbGxlcnMnICkuY29udHJvbGxlciggJ1NsaWRlVG9nZ2xlQ3RybCcsIGZ1bmN0aW9uKCl7XG5cdFx0Ly9cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZGlyZWN0aXZlcycpLmRpcmVjdGl2ZSgnc3ViaW5kZXgnLCBzdWJpbmRleCk7XG5cblx0c3ViaW5kZXguJGluamVjdCA9IFsnJHRpbWVvdXQnLCAnc21vb3RoU2Nyb2xsJ107XG5cblx0ZnVuY3Rpb24gc3ViaW5kZXgoJHRpbWVvdXQsIHNtb290aFNjcm9sbCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRyZXN0cmljdDogJ0UnLFxuXHRcdFx0cmVwbGFjZTogdHJ1ZSxcblx0XHRcdHNjb3BlOiB7XG5cdFx0XHRcdGNvdW50cnk6ICc9Jyxcblx0XHRcdFx0c2VsZWN0ZWQ6ICc9J1xuXHRcdFx0fSxcblx0XHRcdGNvbnRyb2xsZXI6ICdTdWJpbmRleEN0cmwnLFxuXHRcdFx0dGVtcGxhdGVVcmw6ICd2aWV3cy9kaXJlY3RpdmVzL3N1YmluZGV4L3N1YmluZGV4Lmh0bWwnLFxuXHRcdFx0bGluazogc3ViaW5kZXhMaW5rRnVuY3Rpb25cblx0XHR9O1xuXG5cdFx0ZnVuY3Rpb24gc3ViaW5kZXhMaW5rRnVuY3Rpb24oJHNjb3BlLCBlbGVtZW50LCAkYXR0cnMpIHtcblx0XHRcdCRzY29wZS5nb3RvQm94ID0gZ290b0JveDtcblx0XHRcdFx0XHQkc2NvcGUuZ290b0JveCgpO1xuXHRcdFx0ZnVuY3Rpb24gZ290b0JveCgpe1xuXHRcdFx0XHQkdGltZW91dChmdW5jdGlvbigpe1xuXHRcdFx0XHRcdFx0c21vb3RoU2Nyb2xsKGVsZW1lbnRbMF0sIHtvZmZzZXQ6MTIwLCBkdXJhdGlvbjoyNTB9KTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCAnYXBwLmNvbnRyb2xsZXJzJyApLmNvbnRyb2xsZXIoICdTdWJpbmRleEN0cmwnLCBmdW5jdGlvbigkc2NvcGUsICR0aW1lb3V0LCBzbW9vdGhTY3JvbGwpe1xuXHRcdCRzY29wZS5zZXRDaGFydCA9IHNldENoYXJ0O1xuXHRcdCRzY29wZS5jYWxjdWxhdGVHcmFwaCA9IGNhbGN1bGF0ZUdyYXBoO1xuXHRcdCRzY29wZS5jcmVhdGVJbmRleGVyID0gY3JlYXRlSW5kZXhlcjtcblx0XHRhY3RpdmF0ZSgpO1xuXG5cblx0XHRmdW5jdGlvbiBhY3RpdmF0ZSgpe1xuXHRcdFx0JHNjb3BlLnNldENoYXJ0KCk7XG5cdFx0XHQkc2NvcGUuY2FsY3VsYXRlR3JhcGgoKTtcblx0XHRcdCRzY29wZS5jcmVhdGVJbmRleGVyKCk7XG5cdFx0XHQkc2NvcGUuJHdhdGNoKCdzZWxlY3RlZCcsIGZ1bmN0aW9uIChuZXdJdGVtLCBvbGRJdGVtKSB7XG5cdFx0XHRcdGlmIChuZXdJdGVtID09PSBvbGRJdGVtKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdCRzY29wZS5jYWxjdWxhdGVHcmFwaCgpO1xuXHRcdFx0XHQkc2NvcGUuZ290b0JveCgpO1xuXHRcdFx0fSlcblx0XHR9XG5cdFx0ZnVuY3Rpb24gY3JlYXRlSW5kZXhlcigpe1xuXHRcdCBcdCRzY29wZS5pbmRleGVyID0gWyRzY29wZS5zZWxlY3RlZC5kYXRhXTtcblxuXHRcdH1cblx0XHRmdW5jdGlvbiBzZXRDaGFydCgpIHtcblx0XHRcdCRzY29wZS5jaGFydCA9IHtcblx0XHRcdFx0b3B0aW9uczoge1xuXHRcdFx0XHRcdGNoYXJ0OiB7XG5cdFx0XHRcdFx0XHR0eXBlOiAnbGluZUNoYXJ0Jyxcblx0XHRcdFx0XHRcdC8vaGVpZ2h0OiAyMDAsXG5cdFx0XHRcdFx0XHRsZWdlbmRQb3NpdGlvbjogJ2xlZnQnLFxuXHRcdFx0XHRcdFx0bWFyZ2luOiB7XG5cdFx0XHRcdFx0XHRcdHRvcDogMjAsXG5cdFx0XHRcdFx0XHRcdHJpZ2h0OiAyMCxcblx0XHRcdFx0XHRcdFx0Ym90dG9tOiAyMCxcblx0XHRcdFx0XHRcdFx0bGVmdDogMjBcblx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHR4OiBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gZC54O1xuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdHk6IGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBkLnk7XG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0c2hvd1ZhbHVlczogZmFsc2UsXG5cdFx0XHRcdFx0XHRzaG93WUF4aXM6IGZhbHNlLFxuXHRcdFx0XHRcdFx0dHJhbnNpdGlvbkR1cmF0aW9uOiA1MDAsXG5cdFx0XHRcdFx0XHR1c2VJbnRlcmFjdGl2ZUd1aWRlbGluZTogdHJ1ZSxcblx0XHRcdFx0XHRcdGZvcmNlWTogWzEwMCwgMF0sXG5cdFx0XHRcdFx0XHR4QXhpczoge1xuXHRcdFx0XHRcdFx0XHRheGlzTGFiZWw6ICcnXG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0eUF4aXM6IHtcblx0XHRcdFx0XHRcdFx0YXhpc0xhYmVsOiAnJyxcblx0XHRcdFx0XHRcdFx0YXhpc0xhYmVsRGlzdGFuY2U6IDMwXG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0bGVnZW5kOntcblx0XHRcdFx0XHRcdFx0cmlnaHRBbGlnbjpmYWxzZSxcblx0XHRcdFx0XHRcdFx0bWFyZ2luOntcblx0XHRcdFx0XHRcdFx0XHRib3R0b206MzBcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdGxpbmVzOntcblx0XHRcdFx0XHRcdFx0aW50ZXJwb2xhdGU6J2NhcmRpbmFsJ1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSxcblx0XHRcdFx0ZGF0YTogW11cblx0XHRcdH07XG5cdFx0XHRyZXR1cm4gJHNjb3BlLmNoYXJ0O1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGNhbGN1bGF0ZUdyYXBoKCkge1xuXG5cdFx0XHR2YXIgY2hhcnREYXRhID0gW107XG5cdFx0XHRhbmd1bGFyLmZvckVhY2goJHNjb3BlLnNlbGVjdGVkLmRhdGEuY2hpbGRyZW4sIGZ1bmN0aW9uIChpdGVtLCBrZXkpIHtcblx0XHRcdFx0dmFyIGdyYXBoID0ge1xuXHRcdFx0XHRcdGtleTogaXRlbS50aXRsZSxcblx0XHRcdFx0XHRjb2xvcjogaXRlbS5jb2xvcixcblx0XHRcdFx0XHR2YWx1ZXM6IFtdXG5cdFx0XHRcdH07XG5cdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaCgkc2NvcGUuY291bnRyeS5lcGksIGZ1bmN0aW9uIChkYXRhKSB7XG5cdFx0XHRcdFx0Z3JhcGgudmFsdWVzLnB1c2goe1xuXHRcdFx0XHRcdFx0eDogZGF0YS55ZWFyLFxuXHRcdFx0XHRcdFx0eTogZGF0YVtpdGVtLmNvbHVtbl9uYW1lXVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9KTtcblx0XHRcdFx0Y2hhcnREYXRhLnB1c2goZ3JhcGgpO1xuXHRcdFx0fSk7XG5cdFx0XHQkc2NvcGUuY2hhcnQuZGF0YSA9IGNoYXJ0RGF0YTtcblx0XHR9XG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmRpcmVjdGl2ZXMnKS5kaXJlY3RpdmUoJ3N1bmJ1cnN0JywgZnVuY3Rpb24gKCkge1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlc3RyaWN0OiAnRScsXG5cdFx0XHQvL3RlbXBsYXRlVXJsOiAndmlld3MvZGlyZWN0aXZlcy9zdW5idXJzdC9zdW5idXJzdC5odG1sJyxcblx0XHRcdGNvbnRyb2xsZXI6ICdTdW5idXJzdEN0cmwnLFxuXHRcdFx0c2NvcGU6IHtcblx0XHRcdFx0ZGF0YTogJz0nXG5cdFx0XHR9LFxuXHRcdFx0bGluazogZnVuY3Rpb24gKCRzY29wZSwgZWxlbWVudCwgJGF0dHJzKSB7XG5cdFx0XHRcdCRzY29wZS5zZXRDaGFydCgpO1xuXHRcdFx0XHQkc2NvcGUuY2FsY3VsYXRlR3JhcGgoKTtcblx0XHRcdFx0dmFyIHdpZHRoID0gNjEwLFxuXHRcdFx0XHRcdGhlaWdodCA9IHdpZHRoLFxuXHRcdFx0XHRcdHJhZGl1cyA9ICh3aWR0aCkgLyAyLFxuXHRcdFx0XHRcdHggPSBkMy5zY2FsZS5saW5lYXIoKS5yYW5nZShbMCwgMiAqIE1hdGguUEldKSxcblx0XHRcdFx0XHR5ID0gZDMuc2NhbGUucG93KCkuZXhwb25lbnQoMS4zKS5kb21haW4oWzAsIDFdKS5yYW5nZShbMCwgcmFkaXVzXSksXG5cdFx0XHRcdFx0Ly9+IHkgPSBkMy5zY2FsZS5wb3coKS5leHBvbmVudCgxLjMpLmRvbWFpbihbMCwgMC4yNSwgMV0pLnJhbmdlKFswLCAzMCwgcmFkaXVzXSksXG5cdFx0XHRcdFx0Ly9+IHkgPSBkMy5zY2FsZS5saW5lYXIoKS5kb21haW4oWzAsIDAuMjUsIDAuNSwgMC43NSwgMV0pLnJhbmdlKFswLCAzMCwgMTE1LCAyMDAsIHJhZGl1c10pLFxuXHRcdFx0XHRcdHBhZGRpbmcgPSAwLFxuXHRcdFx0XHRcdGR1cmF0aW9uID0gMTAwMCxcblx0XHRcdFx0XHRjaXJjUGFkZGluZyA9IDEwO1xuXG5cdFx0XHRcdHZhciBkaXYgPSBkMy5zZWxlY3QoZWxlbWVudFswXSk7XG5cblxuXHRcdFx0XHR2YXIgdmlzID0gZGl2LmFwcGVuZChcInN2Z1wiKVxuXHRcdFx0XHRcdC5hdHRyKFwid2lkdGhcIiwgd2lkdGggKyBwYWRkaW5nICogMilcblx0XHRcdFx0XHQuYXR0cihcImhlaWdodFwiLCBoZWlnaHQgKyBwYWRkaW5nICogMilcblx0XHRcdFx0XHQuYXBwZW5kKFwiZ1wiKVxuXHRcdFx0XHRcdC5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiICsgW3JhZGl1cyArIHBhZGRpbmcsIHJhZGl1cyArIHBhZGRpbmddICsgXCIpXCIpO1xuXG5cdFx0XHRcdC8qXG5cdFx0XHRcdGRpdi5hcHBlbmQoXCJwXCIpXG5cdFx0XHRcdFx0XHQuYXR0cihcImlkXCIsIFwiaW50cm9cIilcblx0XHRcdFx0XHRcdC50ZXh0KFwiQ2xpY2sgdG8gem9vbSFcIik7XG5cdFx0XHRcdCovXG5cblx0XHRcdFx0dmFyIHBhcnRpdGlvbiA9IGQzLmxheW91dC5wYXJ0aXRpb24oKVxuXHRcdFx0XHRcdC5zb3J0KG51bGwpXG5cdFx0XHRcdFx0LnZhbHVlKGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZC5zaXplO1xuXHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdHZhciBhcmMgPSBkMy5zdmcuYXJjKClcblx0XHRcdFx0XHQuc3RhcnRBbmdsZShmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIE1hdGgubWF4KDAsIE1hdGgubWluKDIgKiBNYXRoLlBJLCB4KGQueCkpKTtcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC5lbmRBbmdsZShmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIE1hdGgubWF4KDAsIE1hdGgubWluKDIgKiBNYXRoLlBJLCB4KGQueCArIGQuZHgpKSk7XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQuaW5uZXJSYWRpdXMoZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdHJldHVybiBNYXRoLm1heCgwLCBkLnkgPyB5KGQueSkgOiBkLnkpO1xuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0Lm91dGVyUmFkaXVzKGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gTWF0aC5tYXgoMCwgeShkLnkgKyBkLmR5KSk7XG5cdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0dmFyIHNwZWNpYWwxID0gXCJXYXN0ZXdhdGVyIFRyZWF0bWVudFwiLFxuXHRcdFx0XHRcdHNwZWNpYWwyID0gXCJBaXIgUG9sbHV0aW9uIFBNMi41IEV4Y2VlZGFuY2VcIixcblx0XHRcdFx0XHRzcGVjaWFsMyA9IFwiQWdyaWN1bHR1cmFsIFN1YnNpZGllc1wiLFxuXHRcdFx0XHRcdHNwZWNpYWw0ID0gXCJQZXN0aWNpZGUgUmVndWxhdGlvblwiO1xuXG5cblx0XHRcdFx0XHR2YXIgbm9kZXMgPSBwYXJ0aXRpb24ubm9kZXMoXHQkc2NvcGUuY2FsY3VsYXRlR3JhcGgoKSk7XG5cblx0XHRcdFx0XHR2YXIgcGF0aCA9IHZpcy5zZWxlY3RBbGwoXCJwYXRoXCIpLmRhdGEobm9kZXMpO1xuXHRcdFx0XHRcdHBhdGguZW50ZXIoKS5hcHBlbmQoXCJwYXRoXCIpXG5cdFx0XHRcdFx0XHQuYXR0cihcImlkXCIsIGZ1bmN0aW9uIChkLCBpKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBcInBhdGgtXCIgKyBpO1xuXHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRcdC5hdHRyKFwiZFwiLCBhcmMpXG5cdFx0XHRcdFx0XHQuYXR0cihcImZpbGwtcnVsZVwiLCBcImV2ZW5vZGRcIilcblx0XHRcdFx0XHRcdC5hdHRyKFwiY2xhc3NcIiwgZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGQuZGVwdGggPyBcImJyYW5jaFwiIDogXCJyb290XCI7XG5cdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0LnN0eWxlKFwiZmlsbFwiLCBzZXRDb2xvcilcblx0XHRcdFx0XHRcdC5vbihcImNsaWNrXCIsIGNsaWNrKTtcblxuXHRcdFx0XHRcdHZhciB0ZXh0ID0gdmlzLnNlbGVjdEFsbChcInRleHRcIikuZGF0YShub2Rlcyk7XG5cdFx0XHRcdFx0dmFyIHRleHRFbnRlciA9IHRleHQuZW50ZXIoKS5hcHBlbmQoXCJ0ZXh0XCIpXG5cdFx0XHRcdFx0XHQuc3R5bGUoXCJmaWxsLW9wYWNpdHlcIiwgMSlcblx0XHRcdFx0XHRcdC5hdHRyKFwidGV4dC1hbmNob3JcIiwgZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdFx0aWYgKGQuZGVwdGgpXG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIFwibWlkZGxlXCI7XG5cdFx0XHRcdFx0XHRcdC8vfiByZXR1cm4geChkLnggKyBkLmR4IC8gMikgPiBNYXRoLlBJID8gXCJlbmRcIiA6IFwic3RhcnRcIjtcblx0XHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBcIm1pZGRsZVwiO1xuXHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRcdC5hdHRyKFwiaWRcIiwgZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIFwiZGVwdGhcIiArIGQuZGVwdGg7XG5cdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0LmF0dHIoXCJjbGFzc1wiLCBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gXCJzZWN0b3JcIlxuXHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRcdC5hdHRyKFwiZHlcIiwgZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGQuZGVwdGggPyBcIi4yZW1cIiA6IFwiMC4zNWVtXCI7XG5cdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0LmF0dHIoXCJ0cmFuc2Zvcm1cIiwgZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdFx0dmFyIG11bHRpbGluZSA9IChkLm5hbWUgfHwgXCJcIikuc3BsaXQoXCIgXCIpLmxlbmd0aCA+IDIsXG5cdFx0XHRcdFx0XHRcdFx0YW5nbGVBbGlnbiA9IChkLnggPiAwLjUgPyAyIDogLTIpLFxuXHRcdFx0XHRcdFx0XHRhbmdsZSA9IHgoZC54ICsgZC5keCAvIDIpICogMTgwIC8gTWF0aC5QSSAtIDkwICsgKG11bHRpbGluZSA/IGFuZ2xlQWxpZ24gOiAwKSxcblx0XHRcdFx0XHRcdFx0XHRyb3RhdGUgPSBhbmdsZSArIChtdWx0aWxpbmUgPyAtLjUgOiAwKSxcblx0XHRcdFx0XHRcdFx0dHJhbnNsID0gKHkoZC55KSArIGNpcmNQYWRkaW5nKSArIDM1LFxuXHRcdFx0XHRcdFx0XHRzZWNBbmdsZSA9IChhbmdsZSA+IDkwID8gLTE4MCA6IDApO1xuXHRcdFx0XHRcdFx0XHRpZiAoZC5uYW1lID09IHNwZWNpYWwzIHx8IGQubmFtZSA9PSBzcGVjaWFsNCkgcm90YXRlICs9IDE7XG5cdFx0XHRcdFx0XHRcdGlmIChkLmRlcHRoID09IDApIHtcblx0XHRcdFx0XHRcdFx0XHR0cmFuc2wgPSAtMi41MDtcblx0XHRcdFx0XHRcdFx0XHRyb3RhdGUgPSAwO1xuXHRcdFx0XHRcdFx0XHRcdHNlY0FuZ2xlID0gMDtcblx0XHRcdFx0XHRcdFx0fSBlbHNlIGlmIChkLmRlcHRoID09IDEpIHRyYW5zbCArPSAtOTtcblx0XHRcdFx0XHRcdFx0ZWxzZSBpZiAoZC5kZXB0aCA9PSAyKSB0cmFuc2wgKz0gLTU7XG5cdFx0XHRcdFx0XHRcdGVsc2UgaWYgKGQuZGVwdGggPT0gMykgdHJhbnNsICs9IDQ7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBcInJvdGF0ZShcIiArIHJvdGF0ZSArIFwiKXRyYW5zbGF0ZShcIiArIHRyYW5zbCArIFwiKXJvdGF0ZShcIiArIHNlY0FuZ2xlICsgXCIpXCI7XG5cdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0Lm9uKFwiY2xpY2tcIiwgY2xpY2spO1xuXG5cdFx0XHRcdFx0Ly8gQWRkIGxhYmVscy4gVmVyeSB1Z2x5IGNvZGUgdG8gc3BsaXQgc2VudGVuY2VzIGludG8gbGluZXMuIENhbiBvbmx5IG1ha2Vcblx0XHRcdFx0XHQvLyBjb2RlIGJldHRlciBpZiBmaW5kIGEgd2F5IHRvIHVzZSBkIG91dHNpZGUgY2FsbHMgc3VjaCBhcyAudGV4dChmdW5jdGlvbihkKSlcblxuXHRcdFx0XHRcdC8vIFRoaXMgYmxvY2sgcmVwbGFjZXMgdGhlIHR3byBibG9ja3MgYXJyb3VuZCBpdC4gSXQgaXMgJ3VzZWZ1bCcgYmVjYXVzZSBpdFxuXHRcdFx0XHRcdC8vIHVzZXMgZm9yZWlnbk9iamVjdCwgc28gdGhhdCB0ZXh0IHdpbGwgd3JhcCBhcm91bmQgbGlrZSBpbiByZWd1bGFyIEhUTUwuIEkgdHJpZWRcblx0XHRcdFx0XHQvLyB0byBnZXQgaXQgdG8gd29yaywgYnV0IGl0IG9ubHkgaW50cm9kdWNlZCBtb3JlIGJ1Z3MuIFVuZm9ydHVuYXRlbHksIHRoZVxuXHRcdFx0XHRcdC8vIHVnbHkgc29sdXRpb24gKGhhcmQgY29kZWQgbGluZSBzcGxpY2luZykgd29uLlxuXHRcdFx0XHRcdC8vfiB2YXIgdGV4dEVudGVyID0gdGV4dC5lbnRlcigpLmFwcGVuZChcImZvcmVpZ25PYmplY3RcIilcblx0XHRcdFx0XHQvL34gLmF0dHIoXCJ4XCIsMClcblx0XHRcdFx0XHQvL34gLmF0dHIoXCJ5XCIsLTIwKVxuXHRcdFx0XHRcdC8vfiAuYXR0cihcImhlaWdodFwiLCAxMDApXG5cdFx0XHRcdFx0Ly9+IC5hdHRyKFwid2lkdGhcIiwgZnVuY3Rpb24oZCl7IHJldHVybiAoeShkLmR5KSArNTApOyB9KVxuXHRcdFx0XHRcdC8vfiAuYXR0cihcInRyYW5zZm9ybVwiLCBmdW5jdGlvbihkKSB7XG5cdFx0XHRcdFx0Ly9+IHZhciBhbmdsZUFsaWduID0gKGQueCA+IDAuNSA/IDIgOiAtMiksXG5cdFx0XHRcdFx0Ly9+IGFuZ2xlID0geChkLnggKyBkLmR4IC8gMikgKiAxODAgLyBNYXRoLlBJIC0gOTAsXG5cdFx0XHRcdFx0Ly9+IHRyYW5zbCA9ICh5KGQueSkgKyBjaXJjUGFkZGluZyk7XG5cdFx0XHRcdFx0Ly9+IGQucm90ID0gYW5nbGU7XG5cdFx0XHRcdFx0Ly9+IGlmICghZC5kZXB0aCkgdHJhbnNsID0gLTUwO1xuXHRcdFx0XHRcdC8vfiBpZiAoYW5nbGUgPiA5MCkgdHJhbnNsICs9IDEyMDtcblx0XHRcdFx0XHQvL34gaWYgKGQuZGVwdGgpXG5cdFx0XHRcdFx0Ly9+IHJldHVybiBcInJvdGF0ZShcIiArIGFuZ2xlICsgXCIpdHJhbnNsYXRlKFwiICsgdHJhbnNsICsgXCIpcm90YXRlKFwiICsgKGFuZ2xlID4gOTAgPyAtMTgwIDogMCkgKyBcIilcIjtcblx0XHRcdFx0XHQvL34gZWxzZVxuXHRcdFx0XHRcdC8vfiByZXR1cm4gXCJ0cmFuc2xhdGUoXCIgKyB0cmFuc2wgKyBcIilcIjtcblx0XHRcdFx0XHQvL34gfSlcblx0XHRcdFx0XHQvL34gLmFwcGVuZChcInhodG1sOmJvZHlcIilcblx0XHRcdFx0XHQvL34gLnN0eWxlKFwiYmFja2dyb3VuZFwiLCBcIm5vbmVcIilcblx0XHRcdFx0XHQvL34gLnN0eWxlKFwidGV4dC1hbGlnblwiLCBmdW5jdGlvbihkKXsgcmV0dXJuIChkLnJvdCA+IDkwID8gXCJsZWZ0XCIgOiBcInJpZ2h0XCIpfSlcblx0XHRcdFx0XHQvL34gLmh0bWwoZnVuY3Rpb24oZCl7IHJldHVybiAnPGRpdiBjbGFzcz0nICtcImRlcHRoXCIgKyBkLmRlcHRoICsnIHN0eWxlPVxcXCJ3aWR0aDogJyArKHkoZC5keSkgKzUwKSArJ3B4OycgK1widGV4dC1hbGlnbjogXCIgKyAoZC5yb3QgPiA5MCA/IFwicmlnaHRcIiA6IFwibGVmdFwiKSArJ1wiPicgK2QubmFtZSArJzwvZGl2Pic7fSlcblxuXHRcdFx0XHRcdHRleHRFbnRlci5hcHBlbmQoXCJ0c3BhblwiKVxuXHRcdFx0XHRcdFx0LmF0dHIoXCJ4XCIsIDApXG5cdFx0XHRcdFx0XHQudGV4dChmdW5jdGlvbiAoZCkge1xuXG5cdFx0XHRcdFx0XHRcdGlmIChkLmRlcHRoID09IDMgJiYgZC5uYW1lICE9IHNwZWNpYWwxICYmIGQubmFtZSAhPSBzcGVjaWFsMiAmJiBkLm5hbWUgIT0gc3BlY2lhbDMgJiYgZC5uYW1lICE9IHNwZWNpYWw0KVxuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBkLm5hbWUuc3BsaXQoXCIgXCIpWzBdICsgXCIgXCIgKyAoZC5uYW1lLnNwbGl0KFwiIFwiKVsxXSB8fCBcIlwiKTtcblx0XHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBkLm5hbWUuc3BsaXQoXCIgXCIpWzBdO1xuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0dGV4dEVudGVyLmFwcGVuZChcInRzcGFuXCIpXG5cdFx0XHRcdFx0XHQuYXR0cihcInhcIiwgMClcblx0XHRcdFx0XHRcdC5hdHRyKFwiZHlcIiwgXCIxZW1cIilcblx0XHRcdFx0XHRcdC50ZXh0KGZ1bmN0aW9uIChkKSB7XG5cblx0XHRcdFx0XHRcdFx0aWYgKGQuZGVwdGggPT0gMyAmJiBkLm5hbWUgIT0gc3BlY2lhbDEgJiYgZC5uYW1lICE9IHNwZWNpYWwyICYmIGQubmFtZSAhPSBzcGVjaWFsMyAmJiBkLm5hbWUgIT0gc3BlY2lhbDQpXG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIChkLm5hbWUuc3BsaXQoXCIgXCIpWzJdIHx8IFwiXCIpICsgXCIgXCIgKyAoZC5uYW1lLnNwbGl0KFwiIFwiKVszXSB8fCBcIlwiKTtcblx0XHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRcdHJldHVybiAoZC5uYW1lLnNwbGl0KFwiIFwiKVsxXSB8fCBcIlwiKSArIFwiIFwiICsgKGQubmFtZS5zcGxpdChcIiBcIilbMl0gfHwgXCJcIik7XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR0ZXh0RW50ZXIuYXBwZW5kKFwidHNwYW5cIilcblx0XHRcdFx0XHRcdC5hdHRyKFwieFwiLCAwKVxuXHRcdFx0XHRcdFx0LmF0dHIoXCJkeVwiLCBcIjFlbVwiKVxuXHRcdFx0XHRcdFx0LnRleHQoZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdFx0aWYgKGQuZGVwdGggPT0gMyAmJiBkLm5hbWUgIT0gc3BlY2lhbDEgJiYgZC5uYW1lICE9IHNwZWNpYWwyICYmIGQubmFtZSAhPSBzcGVjaWFsMyAmJiBkLm5hbWUgIT0gc3BlY2lhbDQpXG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIChkLm5hbWUuc3BsaXQoXCIgXCIpWzRdIHx8IFwiXCIpICsgXCIgXCIgKyAoZC5uYW1lLnNwbGl0KFwiIFwiKVs1XSB8fCBcIlwiKTtcblx0XHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRcdHJldHVybiAoZC5uYW1lLnNwbGl0KFwiIFwiKVszXSB8fCBcIlwiKSArIFwiIFwiICsgKGQubmFtZS5zcGxpdChcIiBcIilbNF0gfHwgXCJcIik7O1xuXHRcdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0XHRmdW5jdGlvbiBjbGljayhkKSB7XG5cdFx0XHRcdFx0XHQvLyBDb250cm9sIGFyYyB0cmFuc2l0aW9uXG5cdFx0XHRcdFx0XHRwYXRoLnRyYW5zaXRpb24oKVxuXHRcdFx0XHRcdFx0XHQuZHVyYXRpb24oZHVyYXRpb24pXG5cdFx0XHRcdFx0XHRcdC5hdHRyVHdlZW4oXCJkXCIsIGFyY1R3ZWVuKGQpKTtcblxuXHRcdFx0XHRcdFx0Ly8gU29tZXdoYXQgb2YgYSBoYWNrIGFzIHdlIHJlbHkgb24gYXJjVHdlZW4gdXBkYXRpbmcgdGhlIHNjYWxlcy5cblx0XHRcdFx0XHRcdC8vIENvbnRyb2wgdGhlIHRleHQgdHJhbnNpdGlvblxuXHRcdFx0XHRcdFx0dGV4dC5zdHlsZShcInZpc2liaWxpdHlcIiwgZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gaXNQYXJlbnRPZihkLCBlKSA/IG51bGwgOiBkMy5zZWxlY3QodGhpcykuc3R5bGUoXCJ2aXNpYmlsaXR5XCIpO1xuXHRcdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0XHQudHJhbnNpdGlvbigpXG5cdFx0XHRcdFx0XHRcdC5kdXJhdGlvbihkdXJhdGlvbilcblx0XHRcdFx0XHRcdFx0LmF0dHJUd2VlbihcInRleHQtYW5jaG9yXCIsIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdFx0XHRcdGlmIChkLmRlcHRoKVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gXCJtaWRkbGVcIjtcblx0XHRcdFx0XHRcdFx0XHRcdC8vfiByZXR1cm4geChkLnggKyBkLmR4IC8gMikgPiBNYXRoLlBJID8gXCJlbmRcIiA6IFwic3RhcnRcIjtcblx0XHRcdFx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIFwibWlkZGxlXCI7XG5cdFx0XHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRcdFx0LmF0dHJUd2VlbihcInRyYW5zZm9ybVwiLCBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0XHRcdHZhciBtdWx0aWxpbmUgPSAoZC5uYW1lIHx8IFwiXCIpLnNwbGl0KFwiIFwiKS5sZW5ndGggPiAyO1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHR2YXIgbXVsdGlsaW5lID0gKGQubmFtZSB8fCBcIlwiKS5zcGxpdChcIiBcIikubGVuZ3RoID4gMixcblx0XHRcdFx0XHRcdFx0XHRcdFx0YW5nbGVBbGlnbiA9IChkLnggPiAwLjUgPyAyIDogLTIpLFxuXHRcdFx0XHRcdFx0XHRcdFx0YW5nbGUgPSB4KGQueCArIGQuZHggLyAyKSAqIDE4MCAvIE1hdGguUEkgLSA5MCArIChtdWx0aWxpbmUgPyBhbmdsZUFsaWduIDogMCksXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHJvdGF0ZSA9IGFuZ2xlICsgKG11bHRpbGluZSA/IC0uNSA6IDApLFxuXHRcdFx0XHRcdFx0XHRcdFx0dHJhbnNsID0gKHkoZC55KSArIGNpcmNQYWRkaW5nKSArIDM1LFxuXHRcdFx0XHRcdFx0XHRcdFx0c2VjQW5nbGUgPSAoYW5nbGUgPiA5MCA/IC0xODAgOiAwKTtcblx0XHRcdFx0XHRcdFx0XHRcdGlmIChkLm5hbWUgPT0gc3BlY2lhbDMgfHwgZC5uYW1lID09IHNwZWNpYWw0KSByb3RhdGUgKz0gMTtcblx0XHRcdFx0XHRcdFx0XHRcdGlmIChkLmRlcHRoID09IDApIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0dHJhbnNsID0gLTIuNTA7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHJvdGF0ZSA9IDA7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHNlY0FuZ2xlID0gMDtcblx0XHRcdFx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoZC5kZXB0aCA9PSAxKSB0cmFuc2wgKz0gLTk7XG5cdFx0XHRcdFx0XHRcdFx0XHRlbHNlIGlmIChkLmRlcHRoID09IDIpIHRyYW5zbCArPSAtNTtcblx0XHRcdFx0XHRcdFx0XHRcdGVsc2UgaWYgKGQuZGVwdGggPT0gMykgdHJhbnNsICs9IDQ7XG5cdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gXCJyb3RhdGUoXCIgKyByb3RhdGUgKyBcIil0cmFuc2xhdGUoXCIgKyB0cmFuc2wgKyBcIilyb3RhdGUoXCIgKyBzZWNBbmdsZSArIFwiKVwiO1xuXHRcdFx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0XHRcdC5zdHlsZShcImZpbGwtb3BhY2l0eVwiLCBmdW5jdGlvbiAoZSkge1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBpc1BhcmVudE9mKGQsIGUpID8gMSA6IDFlLTY7XG5cdFx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0XHRcdC5lYWNoKFwiZW5kXCIsIGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdFx0XHRcdFx0ZDMuc2VsZWN0KHRoaXMpLnN0eWxlKFwidmlzaWJpbGl0eVwiLCBpc1BhcmVudE9mKGQsIGUpID8gbnVsbCA6IFwiaGlkZGVuXCIpO1xuXHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR9XG5cblxuXHRcdFx0XHRmdW5jdGlvbiBpc1BhcmVudE9mKHAsIGMpIHtcblx0XHRcdFx0XHRpZiAocCA9PT0gYykgcmV0dXJuIHRydWU7XG5cdFx0XHRcdFx0aWYgKHAuY2hpbGRyZW4pIHtcblx0XHRcdFx0XHRcdHJldHVybiBwLmNoaWxkcmVuLnNvbWUoZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGlzUGFyZW50T2YoZCwgYyk7XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0ZnVuY3Rpb24gc2V0Q29sb3IoZCkge1xuXHRcdFx0XHRcdHJldHVybiBkLmNvbG9yO1xuXHRcdFx0XHRcdGlmIChkLmNvbG9yKVxuXHRcdFx0XHRcdFx0cmV0dXJuIGQuY29sb3I7XG5cdFx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0XHR2YXIgdGludERlY2F5ID0gMC4yMDtcblx0XHRcdFx0XHRcdC8vIEZpbmQgY2hpbGQgbnVtYmVyXG5cdFx0XHRcdFx0XHR2YXIgeCA9IDA7XG5cdFx0XHRcdFx0XHR3aGlsZSAoZC5wYXJlbnQuY2hpbGRyZW5beF0gIT0gZClcblx0XHRcdFx0XHRcdFx0eCsrO1xuXHRcdFx0XHRcdFx0dmFyIHRpbnRDaGFuZ2UgPSAodGludERlY2F5ICogKHggKyAxKSkudG9TdHJpbmcoKTtcblx0XHRcdFx0XHRcdHJldHVybiBwdXNoZXIuY29sb3IoZC5wYXJlbnQuY29sb3IpLnRpbnQodGludENoYW5nZSkuaHRtbCgnaGV4NicpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIEludGVycG9sYXRlIHRoZSBzY2FsZXMhXG5cdFx0XHRcdGZ1bmN0aW9uIGFyY1R3ZWVuKGQpIHtcblx0XHRcdFx0XHR2YXIgbXkgPSBtYXhZKGQpLFxuXHRcdFx0XHRcdFx0eGQgPSBkMy5pbnRlcnBvbGF0ZSh4LmRvbWFpbigpLCBbZC54LCBkLnggKyBkLmR4IC0gMC4wMDA5XSksXG5cdFx0XHRcdFx0XHR5ZCA9IGQzLmludGVycG9sYXRlKHkuZG9tYWluKCksIFtkLnksIG15XSksXG5cdFx0XHRcdFx0XHR5ciA9IGQzLmludGVycG9sYXRlKHkucmFuZ2UoKSwgW2QueSA/IDIwIDogMCwgcmFkaXVzXSk7XG5cblx0XHRcdFx0XHRyZXR1cm4gZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdHJldHVybiBmdW5jdGlvbiAodCkge1xuXHRcdFx0XHRcdFx0XHR4LmRvbWFpbih4ZCh0KSk7XG5cdFx0XHRcdFx0XHRcdHkuZG9tYWluKHlkKHQpKS5yYW5nZSh5cih0KSk7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBhcmMoZCk7XG5cdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdH07XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRmdW5jdGlvbiBtYXhZKGQpIHtcblx0XHRcdFx0XHRyZXR1cm4gZC5jaGlsZHJlbiA/IE1hdGgubWF4LmFwcGx5KE1hdGgsIGQuY2hpbGRyZW4ubWFwKG1heFkpKSA6IGQueSArIGQuZHk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH0pO1xufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdTdW5idXJzdEN0cmwnLCBmdW5jdGlvbiAoJHNjb3BlKSB7XG5cblx0XHQkc2NvcGUuc2V0Q2hhcnQgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHQkc2NvcGUuY2hhcnQgPSB7XG5cdFx0XHRcdG9wdGlvbnM6IHtcblx0XHRcdFx0XHRjaGFydDoge1xuXHRcdFx0XHRcdFx0dHlwZTogJ3N1bmJ1cnN0Jyxcblx0XHRcdFx0XHRcdGhlaWdodDogNzAwLFxuXHRcdFx0XHRcdFx0XCJzdW5idXJzdFwiOiB7XG5cdFx0XHRcdFx0XHRcdFwiZGlzcGF0Y2hcIjoge30sXG5cdFx0XHRcdFx0XHRcdFwid2lkdGhcIjogbnVsbCxcblx0XHRcdFx0XHRcdFx0XCJoZWlnaHRcIjogbnVsbCxcblx0XHRcdFx0XHRcdFx0XCJtb2RlXCI6IFwic2l6ZVwiLFxuXHRcdFx0XHRcdFx0XHRcImlkXCI6IDIwODgsXG5cdFx0XHRcdFx0XHRcdFwiZHVyYXRpb25cIjogNTAwLFxuXHRcdFx0XHRcdFx0XHRcIm1hcmdpblwiOiB7XG5cdFx0XHRcdFx0XHRcdFx0XCJ0b3BcIjogMCxcblx0XHRcdFx0XHRcdFx0XHRcInJpZ2h0XCI6IDAsXG5cdFx0XHRcdFx0XHRcdFx0XCJib3R0b21cIjogMCxcblx0XHRcdFx0XHRcdFx0XHRcImxlZnRcIjogMFxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XCJ0b29sdGlwXCI6IHtcblx0XHRcdFx0XHRcdFx0XCJkdXJhdGlvblwiOiAwLFxuXHRcdFx0XHRcdFx0XHRcImdyYXZpdHlcIjogXCJ3XCIsXG5cdFx0XHRcdFx0XHRcdFwiZGlzdGFuY2VcIjogMjUsXG5cdFx0XHRcdFx0XHRcdFwic25hcERpc3RhbmNlXCI6IDAsXG5cdFx0XHRcdFx0XHRcdFwiY2xhc3Nlc1wiOiBudWxsLFxuXHRcdFx0XHRcdFx0XHRcImNoYXJ0Q29udGFpbmVyXCI6IG51bGwsXG5cdFx0XHRcdFx0XHRcdFwiZml4ZWRUb3BcIjogbnVsbCxcblx0XHRcdFx0XHRcdFx0XCJlbmFibGVkXCI6IHRydWUsXG5cdFx0XHRcdFx0XHRcdFwiaGlkZURlbGF5XCI6IDQwMCxcblx0XHRcdFx0XHRcdFx0XCJoZWFkZXJFbmFibGVkXCI6IGZhbHNlLFxuXG5cdFx0XHRcdFx0XHRcdFwib2Zmc2V0XCI6IHtcblx0XHRcdFx0XHRcdFx0XHRcImxlZnRcIjogMCxcblx0XHRcdFx0XHRcdFx0XHRcInRvcFwiOiAwXG5cdFx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRcdFwiaGlkZGVuXCI6IHRydWUsXG5cdFx0XHRcdFx0XHRcdFwiZGF0YVwiOiBudWxsLFxuXHRcdFx0XHRcdFx0XHRcInRvb2x0aXBFbGVtXCI6IG51bGwsXG5cdFx0XHRcdFx0XHRcdFwiaWRcIjogXCJudnRvb2x0aXAtOTkzNDdcIlxuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sXG5cdFx0XHRcdGRhdGE6IFtdXG5cdFx0XHR9O1xuXHRcdFx0cmV0dXJuICRzY29wZS5jaGFydDtcblx0XHR9XG5cdFx0dmFyIGJ1aWxkVHJlZSA9IGZ1bmN0aW9uIChkYXRhKSB7XG5cdFx0XHR2YXIgY2hpbGRyZW4gPSBbXTtcblx0XHRcdGFuZ3VsYXIuZm9yRWFjaChkYXRhLCBmdW5jdGlvbiAoaXRlbSkge1xuXHRcdFx0XHR2YXIgY2hpbGQgPSB7XG5cdFx0XHRcdFx0J25hbWUnOiBpdGVtLnRpdGxlLFxuXHRcdFx0XHRcdCdzaXplJzogaXRlbS5zaXplLFxuXHRcdFx0XHRcdCdjb2xvcic6IGl0ZW0uY29sb3IsXG5cdFx0XHRcdFx0J2NoaWxkcmVuJzogYnVpbGRUcmVlKGl0ZW0uY2hpbGRyZW4pXG5cdFx0XHRcdH07XG5cdFx0XHRcdGlmKGl0ZW0uY29sb3Ipe1xuXHRcdFx0XHRcdGNoaWxkLmNvbG9yID0gaXRlbS5jb2xvclxuXHRcdFx0XHR9XG5cdFx0XHRcdGlmKGl0ZW0uc2l6ZSl7XG5cdFx0XHRcdFx0Y2hpbGQuc2l6ZSA9IGl0ZW0uc2l6ZVxuXHRcdFx0XHR9XG5cdFx0XHRcdGNoaWxkcmVuLnB1c2goY2hpbGQpO1xuXHRcdFx0fSk7XG5cdFx0XHRyZXR1cm4gY2hpbGRyZW47XG5cdFx0fTtcblx0XHQkc2NvcGUuY2FsY3VsYXRlR3JhcGggPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHR2YXIgY2hhcnREYXRhID0ge1xuXHRcdFx0XHRcIm5hbWVcIjogJHNjb3BlLmRhdGEubmFtZSxcblx0XHRcdFx0XCJjb2xvclwiOiAkc2NvcGUuZGF0YS5jb2xvcixcblx0XHRcdFx0XCJjaGlsZHJlblwiOiBidWlsZFRyZWUoJHNjb3BlLmRhdGEuY2hpbGRyZW4pLFxuXHRcdFx0XHRcInNpemVcIjogMVxuXHRcdFx0fTtcblx0XHRcdCRzY29wZS5jaGFydC5kYXRhID0gY2hhcnREYXRhO1xuXHRcdFx0cmV0dXJuIGNoYXJ0RGF0YTtcblx0XHR9O1xuXHRcdCRzY29wZS4kd2F0Y2goJ2RhdGEnLCBmdW5jdGlvbiAobiwgbykge1xuXHRcdFx0aWYgKCFuKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHRcdCRzY29wZS5jYWxjdWxhdGVHcmFwaCgpO1xuXHRcdH0pXG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignQWRkVXNlcnNDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBEaWFsb2dTZXJ2aWNlKXtcblxuICAgICAgICAkc2NvcGUuc2F2ZSA9IGZ1bmN0aW9uKCl7XG5cdCAgICAgICAgLy9kbyBzb21ldGhpbmcgdXNlZnVsXG4gICAgICAgICAgICBEaWFsb2dTZXJ2aWNlLmhpZGUoKTtcbiAgICAgICAgfTtcblxuICAgICAgICAkc2NvcGUuaGlkZSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIFx0RGlhbG9nU2VydmljZS5oaWRlKCk7XG4gICAgICAgIH07XG5cbiAgICB9KTtcblxufSkoKTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==