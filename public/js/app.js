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
					DataService.getOne('nations/bbox', [$scope.current.iso]).then(function(data){
						$scope.bbox = data;
					});
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
			//document.getElementsByTagName('body')[0].appendChild($scope.canvas);
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
				$scope.$watch('bbox', function(n, o){
						if(n === o){
							return;
						}

						var lat = [n.coordinates[0][0][1],[n.coordinates[0][0][0]]],
						lng = [n.coordinates[0][2][1],[n.coordinates[0][2][0]]]
						var southWest = L.latLng(n.coordinates[0][0][1], n.coordinates[0][0][0]),
    northEast = L.latLng(n.coordinates[0][2][1], n.coordinates[0][2][0]),
    bounds = L.latLngBounds(southWest, northEast);

						//map.panInsideBounds(bounds,{zoom:true});
						map.fitBounds(bounds, {
							paddingTopLeft: [300,0]
						});
				});
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
					mutexToggle: true,
					onClick: function (evt, t) {
						//map.fitBounds(evt.target.getBounds());

						//var x = evt.feature.bbox()[0]/ (evt.feature.extent / evt.feature.tileSize);
						//var y = evt.feature.bbox()[1]/(evt.feature.extent / evt.feature.tileSize)
						//if ($scope.current.country != evt.feature.properties.admin) {
							//map.panTo(evt.latlng);
							//map.panBy(new L.Point(-200,0));
						/*	map.fitBounds([
								[evt.feature.bbox()[0] / (evt.feature.extent / evt.feature.tileSize), evt.feature.bbox()[1] / (evt.feature.extent / evt.feature.tileSize)],
								[evt.feature.bbox()[2] / (evt.feature.extent / evt.feature.tileSize), evt.feature.bbox()[3] / (evt.feature.extent / evt.feature.tileSize)],
							])*/
						//}
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
		$scope.searchIP = function (ip) {
			var url = "http://freegeoip.net/json/" + ip;
			$http.get(url).success(function (res) {
				$scope.center = {
					lat: res.latitude,
					lng: res.longitude,
					zoom: 3
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9tYWluLmpzIiwiYXBwL3JvdXRlcy5qcyIsImFwcC9yb3V0ZXMucnVuLmpzIiwiY29uZmlnL2F1dGguanMiLCJjb25maWcvbG9hZGluZ19iYXIuanMiLCJjb25maWcvcmVzdGFuZ3VsYXIuanMiLCJjb25maWcvdGhlbWUuanMiLCJmaWx0ZXJzL2NhcGl0YWxpemUuanMiLCJmaWx0ZXJzL2h1bWFuX3JlYWRhYmxlLmpzIiwiZmlsdGVycy90cnVzdF9odG1sLmpzIiwiZmlsdGVycy91Y2ZpcnN0LmpzIiwic2VydmljZXMvRGF0YVNlcnZpY2UuanMiLCJzZXJ2aWNlcy9JbmRleC5qcyIsInNlcnZpY2VzL01hcC5qcyIsInNlcnZpY2VzL2RpYWxvZy5qcyIsInNlcnZpY2VzL3RvYXN0LmpzIiwiYXBwL2RpYWxvZ3MvZGlhbG9ncy5qcyIsImFwcC9lbGl4aXIvZWxpeGlyLmpzIiwiYXBwL2VwaS9lcGkuanMiLCJhcHAvZ2VuZXJhdG9ycy9nZW5lcmF0b3JzLmpzIiwiYXBwL2hlYWRlci9oZWFkZXIuanMiLCJhcHAvaW1wb3J0Y3N2L2ltcG9ydGNzdi5qcyIsImFwcC9qd3RfYXV0aC9qd3RfYXV0aC5qcyIsImFwcC9sYW5kaW5nL2xhbmRpbmcuanMiLCJhcHAvbG9naW4vbG9naW4uanMiLCJhcHAvbWFwL21hcC5qcyIsImFwcC9taXNjL21pc2MuanMiLCJhcHAvcmVzdF9hcGkvcmVzdF9hcGkuanMiLCJhcHAvc2lkZWJhci9zaWRlYmFyLmpzIiwiYXBwL3RhYnMvdGFicy5qcyIsImFwcC90b2FzdHMvdG9hc3RzLmpzIiwiYXBwL3Vuc3VwcG9ydGVkX2Jyb3dzZXIvdW5zdXBwb3J0ZWRfYnJvd3Nlci5qcyIsImRpYWxvZ3MvYWRkX3VzZXJzL2FkZF91c2Vycy5qcyIsImRpcmVjdGl2ZXMvYnViYmxlcy9idWJibGVzLmpzIiwiZGlyZWN0aXZlcy9idWJibGVzL2RlZmluaXRpb24uanMiLCJkaXJlY3RpdmVzL2NpcmNsZWdyYXBoL2NpcmNsZWdyYXBoLmpzIiwiZGlyZWN0aXZlcy9jaXJjbGVncmFwaC9kZWZpbml0aW9uLmpzIiwiZGlyZWN0aXZlcy9kYXRhX2xpc3RpbmcvZGF0YV9saXN0aW5nLmpzIiwiZGlyZWN0aXZlcy9kYXRhX2xpc3RpbmcvZGVmaW5pdGlvbi5qcyIsImRpcmVjdGl2ZXMvbWVkaWFuL2RlZmluaXRpb24uanMiLCJkaXJlY3RpdmVzL21lZGlhbi9tZWRpYW4uanMiLCJkaXJlY3RpdmVzL3NpbXBsZWxpbmVjaGFydC9kZWZpbml0aW9uLmpzIiwiZGlyZWN0aXZlcy9zaW1wbGVsaW5lY2hhcnQvc2ltcGxlbGluZWNoYXJ0LmpzIiwiZGlyZWN0aXZlcy9zbGlkZVRvZ2dsZS9kZWZpbml0aW9uLmpzIiwiZGlyZWN0aXZlcy9zbGlkZVRvZ2dsZS9zbGlkZVRvZ2dsZS5qcyIsImRpcmVjdGl2ZXMvc3ViaW5kZXgvZGVmaW5pdGlvbi5qcyIsImRpcmVjdGl2ZXMvc3ViaW5kZXgvc3ViaW5kZXguanMiLCJkaXJlY3RpdmVzL3N1bmJ1cnN0L2RlZmluaXRpb24uanMiLCJkaXJlY3RpdmVzL3N1bmJ1cnN0L3N1bmJ1cnN0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLENBQUEsVUFBQTtDQUNBOztDQUVBLElBQUEsTUFBQSxRQUFBLE9BQUE7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7OztDQUlBLFFBQUEsT0FBQSxjQUFBLENBQUEsYUFBQSxhQUFBO0NBQ0EsUUFBQSxPQUFBLG1CQUFBLENBQUEsZUFBQSxhQUFBLGNBQUEsYUFBQSxlQUFBLGFBQUEsdUJBQUEsY0FBQSxjQUFBLG9CQUFBLFFBQUEsY0FBQTtDQUNBLFFBQUEsT0FBQSxlQUFBO0NBQ0EsUUFBQSxPQUFBLGdCQUFBLENBQUEsYUFBQSxhQUFBO0NBQ0EsUUFBQSxPQUFBLGtCQUFBLENBQUE7Q0FDQSxRQUFBLE9BQUEsY0FBQTs7OztBQ25CQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsY0FBQSxnREFBQSxTQUFBLGdCQUFBLG1CQUFBOztFQUVBLElBQUEsVUFBQSxTQUFBLFNBQUE7R0FDQSxPQUFBLGdCQUFBLFdBQUEsTUFBQSxXQUFBOzs7RUFHQSxtQkFBQSxVQUFBOztFQUVBO0lBQ0EsTUFBQSxPQUFBO0lBQ0EsVUFBQTtJQUNBLE9BQUE7Ozs7S0FJQSxRQUFBO01BQ0EsYUFBQSxRQUFBOztLQUVBLE1BQUE7OztJQUdBLE1BQUEsV0FBQTtJQUNBLEtBQUE7SUFDQSxPQUFBO0tBQ0EsU0FBQTtNQUNBLGFBQUEsUUFBQTtNQUNBLFlBQUE7TUFDQSxRQUFBO09BQ0EscUJBQUEsU0FBQSxZQUFBO1FBQ0EsT0FBQSxZQUFBLE9BQUE7Ozs7S0FJQSxPQUFBO01BQ0EsYUFBQSxRQUFBOzs7O0lBSUEsTUFBQSxtQkFBQTtJQUNBLEtBQUE7O0lBRUEsTUFBQSxpQkFBQTtJQUNBLEtBQUE7SUFDQSxNQUFBLENBQUEsVUFBQTtJQUNBLE9BQUE7S0FDQSxTQUFBO01BQ0EsYUFBQSxRQUFBOztLQUVBLE1BQUE7Ozs7Ozs7OztBQ25EQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsY0FBQSxtQkFBQSxTQUFBLFdBQUE7RUFDQSxXQUFBLElBQUEscUJBQUEsU0FBQSxPQUFBLFFBQUE7R0FDQSxJQUFBLFFBQUEsUUFBQSxRQUFBLEtBQUEsU0FBQTtJQUNBLFdBQUEsZUFBQSxRQUFBLEtBQUE7O0lBRUEsV0FBQSxpQkFBQTs7RUFFQSxXQUFBLElBQUEsdUJBQUEsU0FBQSxPQUFBLFFBQUE7SUFDQSxXQUFBLGlCQUFBOzs7Ozs7QUNYQSxDQUFBLFdBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsY0FBQSx5QkFBQSxVQUFBLGNBQUE7OztRQUdBLGNBQUEsV0FBQTs7Ozs7QUNOQSxDQUFBLFdBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsY0FBQSxpQ0FBQSxVQUFBLHNCQUFBO0VBQ0Esc0JBQUEsaUJBQUE7Ozs7O0FDSkEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGNBQUEsZ0NBQUEsU0FBQSxxQkFBQTtFQUNBO0dBQ0EsV0FBQTs7Ozs7QUNMQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsY0FBQSw4QkFBQSxTQUFBLG9CQUFBOztFQUVBLG1CQUFBLE1BQUE7R0FDQSxlQUFBO0dBQ0EsY0FBQTtHQUNBLFlBQUE7Ozs7O0FDUkEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGVBQUEsUUFBQSxjQUFBLFVBQUE7RUFDQSxPQUFBLFNBQUEsT0FBQSxLQUFBO0dBQ0EsT0FBQSxDQUFBLENBQUEsQ0FBQSxTQUFBLE1BQUEsUUFBQSxzQkFBQSxTQUFBLElBQUE7SUFDQSxPQUFBLElBQUEsT0FBQSxHQUFBLGdCQUFBLElBQUEsT0FBQSxHQUFBO1FBQ0E7Ozs7O0FDUEEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGVBQUEsUUFBQSxpQkFBQSxVQUFBO0VBQ0EsT0FBQSxTQUFBLFNBQUEsS0FBQTtHQUNBLEtBQUEsQ0FBQSxLQUFBO0lBQ0EsT0FBQTs7R0FFQSxJQUFBLFFBQUEsSUFBQSxNQUFBO0dBQ0EsS0FBQSxJQUFBLEVBQUEsR0FBQSxFQUFBLE1BQUEsUUFBQSxLQUFBO0lBQ0EsTUFBQSxLQUFBLE1BQUEsR0FBQSxPQUFBLEdBQUEsZ0JBQUEsTUFBQSxHQUFBLE1BQUE7O0dBRUEsT0FBQSxNQUFBLEtBQUE7Ozs7QUNaQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsZUFBQSxRQUFBLHNCQUFBLFVBQUEsTUFBQTtFQUNBLE9BQUEsVUFBQSxNQUFBO0dBQ0EsT0FBQSxLQUFBLFlBQUE7Ozs7QUNMQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsZUFBQSxPQUFBLFdBQUEsV0FBQTtFQUNBLE9BQUEsVUFBQSxRQUFBO0dBQ0EsS0FBQSxDQUFBLE9BQUE7SUFDQSxPQUFBOztHQUVBLE9BQUEsTUFBQSxVQUFBLEdBQUEsR0FBQSxnQkFBQSxNQUFBLFVBQUE7Ozs7OztBQ1JBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxnQkFBQSxRQUFBLGVBQUE7SUFDQSxZQUFBLFVBQUEsQ0FBQTs7SUFFQSxTQUFBLFlBQUEsWUFBQTtRQUNBLE9BQUE7VUFDQSxRQUFBO1VBQ0EsUUFBQTs7O1FBR0EsU0FBQSxPQUFBLE1BQUE7VUFDQSxJQUFBLE9BQUEsWUFBQSxJQUFBLE9BQUE7WUFDQSxLQUFBLEtBQUEsVUFBQSxJQUFBLFVBQUE7Y0FDQSxNQUFBOztZQUVBLE9BQUE7O1FBRUEsU0FBQSxPQUFBLE9BQUEsR0FBQTtVQUNBLE9BQUEsWUFBQSxJQUFBLE9BQUEsSUFBQTs7Ozs7O0FDcEJBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxnQkFBQSxRQUFBLGdCQUFBLFVBQUE7UUFDQSxPQUFBO1VBQ0EsUUFBQSxVQUFBO1lBQ0EsT0FBQTtZQUNBLEtBQUE7WUFDQSxXQUFBO1lBQ0EsT0FBQTtZQUNBLGNBQUE7WUFDQSxXQUFBO1lBQ0Esa0JBQUE7WUFDQSxtQkFBQTtZQUNBLGFBQUE7WUFDQSxvQkFBQTtZQUNBLHFCQUFBO2VBQ0EsT0FBQTtlQUNBLEtBQUE7ZUFDQSxhQUFBO2VBQ0EsU0FBQTtlQUNBLFNBQUEsQ0FBQTthQUNBLGFBQUE7YUFDQSxPQUFBO2FBQ0EsTUFBQSxDQUFBLEdBQUE7YUFDQSxLQUFBO2FBQ0EsTUFBQTthQUNBLFNBQUEsQ0FBQTtjQUNBLFlBQUE7Y0FDQSxNQUFBO2NBQ0EsTUFBQTtjQUNBLFNBQUE7Y0FDQSxPQUFBO2NBQ0EsU0FBQSxDQUFBO2VBQ0EsYUFBQTtlQUNBLE1BQUE7cUJBQ0EsS0FBQTtlQUNBLEtBQUE7ZUFDQSxNQUFBO2VBQ0EsWUFBQTs7ZUFFQTtjQUNBLFlBQUE7Y0FDQSxNQUFBO2NBQ0EsT0FBQTtjQUNBLE1BQUE7Y0FDQSxTQUFBO2NBQ0EsU0FBQSxDQUFBO2VBQ0EsYUFBQTtlQUNBLE1BQUE7cUJBQ0EsS0FBQTtlQUNBLEtBQUE7ZUFDQSxNQUFBO2VBQ0EsWUFBQTtnQkFDQTtlQUNBLGFBQUE7ZUFDQSxNQUFBO3FCQUNBLEtBQUE7ZUFDQSxLQUFBO2VBQ0EsTUFBQTtlQUNBLFlBQUE7Z0JBQ0E7ZUFDQSxhQUFBO2VBQ0EsTUFBQTtxQkFDQSxLQUFBO2VBQ0EsS0FBQTtlQUNBLE1BQUE7ZUFDQSxZQUFBOztlQUVBO2NBQ0EsWUFBQTtjQUNBLE1BQUE7Y0FDQSxPQUFBO2NBQ0EsTUFBQTtjQUNBLFNBQUE7Y0FDQSxTQUFBLENBQUE7Y0FDQSxhQUFBO2NBQ0EsTUFBQTtvQkFDQSxLQUFBO2NBQ0EsS0FBQTtjQUNBLE1BQUE7Y0FDQSxZQUFBO2VBQ0E7Y0FDQSxhQUFBO2NBQ0EsTUFBQTtvQkFDQSxLQUFBO2NBQ0EsS0FBQTtjQUNBLE1BQUE7Y0FDQSxZQUFBOzs7Y0FHQTthQUNBLGFBQUE7YUFDQSxPQUFBO2FBQ0EsTUFBQSxDQUFBLEdBQUE7YUFDQSxLQUFBO2FBQ0EsTUFBQTthQUNBLFNBQUEsQ0FBQTtjQUNBLFlBQUE7Y0FDQSxNQUFBO2NBQ0EsT0FBQTtjQUNBLE1BQUE7Y0FDQSxTQUFBO2NBQ0EsU0FBQSxDQUFBO2VBQ0EsYUFBQTtlQUNBLE1BQUE7cUJBQ0EsS0FBQTtlQUNBLEtBQUE7ZUFDQSxNQUFBO2VBQ0EsWUFBQTs7ZUFFQTtjQUNBLFlBQUE7Y0FDQSxNQUFBO2NBQ0EsT0FBQTtjQUNBLE1BQUE7Y0FDQSxTQUFBO2NBQ0EsU0FBQSxDQUFBO2VBQ0EsYUFBQTtlQUNBLE1BQUE7cUJBQ0EsS0FBQTtlQUNBLEtBQUE7ZUFDQSxNQUFBO2VBQ0EsWUFBQTtnQkFDQTtlQUNBLGFBQUE7ZUFDQSxNQUFBO3FCQUNBLEtBQUE7ZUFDQSxLQUFBO2VBQ0EsTUFBQTtlQUNBLFlBQUE7O2VBRUE7Y0FDQSxZQUFBO2NBQ0EsTUFBQTtjQUNBLE9BQUE7Y0FDQSxNQUFBO2NBQ0EsU0FBQTtjQUNBLFNBQUEsQ0FBQTtlQUNBLGFBQUE7ZUFDQSxNQUFBO3FCQUNBLEtBQUE7ZUFDQSxLQUFBO2VBQ0EsTUFBQTtlQUNBLFlBQUE7O2VBRUE7Y0FDQSxZQUFBO2NBQ0EsTUFBQTtjQUNBLE9BQUE7Y0FDQSxNQUFBO2NBQ0EsU0FBQTtjQUNBLFNBQUEsQ0FBQTtlQUNBLGFBQUE7ZUFDQSxNQUFBO3FCQUNBLEtBQUE7ZUFDQSxLQUFBO2VBQ0EsTUFBQTtlQUNBLFlBQUE7Z0JBQ0E7ZUFDQSxhQUFBO2VBQ0EsTUFBQTtxQkFDQSxLQUFBO2VBQ0EsS0FBQTtlQUNBLE1BQUE7ZUFDQSxZQUFBOztlQUVBO2NBQ0EsWUFBQTtjQUNBLE1BQUE7Y0FDQSxPQUFBO2NBQ0EsTUFBQTtjQUNBLFNBQUE7Y0FDQSxTQUFBLENBQUE7ZUFDQSxhQUFBO2VBQ0EsTUFBQTtxQkFDQSxLQUFBO2VBQ0EsS0FBQTtlQUNBLE1BQUE7ZUFDQSxZQUFBO2dCQUNBO2VBQ0EsYUFBQTtlQUNBLE1BQUE7cUJBQ0EsS0FBQTtlQUNBLEtBQUE7ZUFDQSxNQUFBO2VBQ0EsWUFBQTtnQkFDQTtlQUNBLGFBQUE7ZUFDQSxNQUFBO3FCQUNBLEtBQUE7ZUFDQSxLQUFBO2VBQ0EsTUFBQTtlQUNBLFlBQUE7Z0JBQ0E7ZUFDQSxhQUFBO2VBQ0EsTUFBQTtxQkFDQSxLQUFBO2VBQ0EsS0FBQTtlQUNBLE1BQUE7ZUFDQSxZQUFBOztlQUVBO2NBQ0EsWUFBQTtjQUNBLE1BQUE7Y0FDQSxPQUFBO2NBQ0EsTUFBQTtjQUNBLFNBQUE7Y0FDQSxTQUFBLENBQUE7ZUFDQSxhQUFBO2VBQ0EsTUFBQTtxQkFDQSxLQUFBO2VBQ0EsS0FBQTtlQUNBLE1BQUE7ZUFDQSxZQUFBO2dCQUNBO2VBQ0EsYUFBQTtlQUNBLE1BQUE7cUJBQ0EsS0FBQTtlQUNBLEtBQUE7ZUFDQSxNQUFBO2VBQ0EsWUFBQTtnQkFDQTtlQUNBLGFBQUE7ZUFDQSxNQUFBO3FCQUNBLEtBQUE7ZUFDQSxLQUFBO2VBQ0EsTUFBQTtlQUNBLFlBQUE7Ozs7Ozs7Ozs7O0FDcE9BLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxnQkFBQSxRQUFBLDhCQUFBLFNBQUEsWUFBQTs7UUFFQSxJQUFBLFVBQUE7UUFDQSxPQUFBO1VBQ0EsZ0JBQUEsU0FBQSxLQUFBO1lBQ0EsVUFBQTs7VUFFQSxnQkFBQSxVQUFBO1lBQ0EsT0FBQTs7Ozs7OztBQ1hBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxnQkFBQSxRQUFBLCtCQUFBLFNBQUEsVUFBQTs7RUFFQSxPQUFBO0dBQ0EsY0FBQSxTQUFBLFVBQUEsT0FBQTs7SUFFQSxJQUFBLFVBQUE7S0FDQSxhQUFBLG9CQUFBLFdBQUEsTUFBQSxXQUFBOzs7SUFHQSxJQUFBLE9BQUE7S0FDQSxRQUFBLFFBQUEsT0FBQTs7O0lBR0EsT0FBQSxVQUFBLEtBQUE7OztHQUdBLE1BQUEsVUFBQTtJQUNBLE9BQUEsVUFBQTs7O0dBR0EsT0FBQSxTQUFBLE9BQUEsUUFBQTtJQUNBLFVBQUE7S0FDQSxVQUFBO09BQ0EsTUFBQTtPQUNBLFFBQUE7T0FDQSxHQUFBOzs7Ozs7QUM1QkEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGdCQUFBLFFBQUEsNkJBQUEsU0FBQSxTQUFBOztFQUVBLElBQUEsUUFBQTtHQUNBLFdBQUE7R0FDQSxTQUFBOztFQUVBLE9BQUE7R0FDQSxNQUFBLFNBQUEsUUFBQTtJQUNBLElBQUEsQ0FBQSxRQUFBO0tBQ0EsT0FBQTs7O0lBR0EsT0FBQSxTQUFBO0tBQ0EsU0FBQTtPQUNBLFFBQUE7T0FDQSxTQUFBO09BQ0EsT0FBQTtPQUNBLFVBQUE7OztHQUdBLE9BQUEsU0FBQSxRQUFBO0lBQ0EsSUFBQSxDQUFBLFFBQUE7S0FDQSxPQUFBOzs7SUFHQSxPQUFBLFNBQUE7S0FDQSxTQUFBO09BQ0EsUUFBQTtPQUNBLFNBQUE7T0FDQSxNQUFBO09BQ0EsT0FBQTtPQUNBLFVBQUE7Ozs7Ozs7QUNsQ0EsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsMkNBQUEsU0FBQSxRQUFBLGNBQUE7RUFDQSxPQUFBLGNBQUEsVUFBQTtHQUNBLGNBQUEsTUFBQSwwQkFBQTs7O0VBR0EsT0FBQSxlQUFBLFVBQUE7R0FDQSxjQUFBLGFBQUEsYUFBQTs7Ozs7O0FDVEEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsY0FBQSxVQUFBOzs7Ozs7QUNIQSxDQUFBLFlBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSwrSEFBQSxVQUFBLE9BQUEsUUFBQSxVQUFBLGNBQUEsY0FBQSxLQUFBLGFBQUEsYUFBQSxZQUFBOztFQUVBLE9BQUEsVUFBQTtFQUNBLE9BQUEsVUFBQTtHQUNBLGFBQUE7R0FDQSxNQUFBLENBQUE7SUFDQSxRQUFBLENBQUEsR0FBQSxPQUFBLEVBQUE7SUFDQSxPQUFBO0lBQ0EsTUFBQTs7R0FFQSxPQUFBLENBQUE7SUFDQSxRQUFBLENBQUEsR0FBQSxPQUFBLEVBQUE7SUFDQSxPQUFBO0lBQ0EsTUFBQTs7O0VBR0EsT0FBQSxZQUFBO0VBQ0EsT0FBQSxlQUFBO0VBQ0EsT0FBQSxZQUFBLGFBQUE7RUFDQSxPQUFBLE1BQUE7RUFDQSxPQUFBLFlBQUE7RUFDQSxPQUFBLFVBQUE7RUFDQSxPQUFBLE9BQUE7RUFDQSxPQUFBLFlBQUE7RUFDQSxPQUFBLFNBQUE7R0FDQSxRQUFBO0dBQ0EsVUFBQTs7RUFFQSxPQUFBLGlCQUFBLFNBQUEsUUFBQTtHQUNBLEdBQUEsV0FBQSxNQUFBLE9BQUEsY0FBQSxHQUFBO0lBQ0EsT0FBQSxhQUFBOztPQUVBO0tBQ0EsT0FBQSxhQUFBOztHQUVBLE9BQUEsZUFBQSxPQUFBLGFBQUEsaUJBQUE7O0VBRUEsT0FBQSxXQUFBLFNBQUEsSUFBQTtHQUNBLFFBQUEsUUFBQSxPQUFBLEtBQUEsU0FBQSxJQUFBO0lBQ0EsR0FBQSxJQUFBLE9BQUEsSUFBQTtLQUNBLE9BQUEsVUFBQTs7OztFQUlBLE9BQUEsTUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7OztFQW1CQSxPQUFBLFdBQUEsU0FBQSxLQUFBO0dBQ0EsT0FBQSxXQUFBLGVBQUE7OztFQUdBLE9BQUEsYUFBQSxZQUFBO0dBQ0EsT0FBQSxZQUFBLENBQUEsT0FBQTtHQUNBLE9BQUEsWUFBQSxPQUFBLGFBQUEsT0FBQSxpQkFBQTs7RUFFQSxPQUFBLGFBQUEsVUFBQSxLQUFBO0dBQ0EsT0FBQSxVQUFBOztFQUVBLE9BQUEsVUFBQSxVQUFBLEtBQUE7R0FDQSxPQUFBLE9BQUEsSUFBQSxRQUFBLE9BQUE7O0VBRUEsT0FBQSxhQUFBLFVBQUE7SUFDQSxPQUFBLFFBQUEsY0FBQTtJQUNBLE9BQUEsT0FBQSxDQUFBLE9BQUE7O0VBRUEsT0FBQSxnQkFBQSxZQUFBO0dBQ0EsT0FBQSxPQUFBLFVBQUEsQ0FBQSxPQUFBOztFQUVBLE9BQUEsbUJBQUEsVUFBQTtHQUNBLE9BQUEsUUFBQSxZQUFBLENBQUEsT0FBQTtHQUNBLE9BQUEsUUFBQSxTQUFBLENBQUEsT0FBQSxRQUFBO0dBQ0EsR0FBQSxPQUFBLFFBQUEsT0FBQTtJQUNBLFNBQUEsVUFBQTtLQUNBLElBQUEsVUFBQSxTQUFBLGVBQUE7S0FDQSxhQUFBLFFBQUEsQ0FBQSxPQUFBLEtBQUEsU0FBQTs7Ozs7RUFLQSxPQUFBLHFCQUFBLFNBQUEsUUFBQTtHQUNBLElBQUEsUUFBQTtHQUNBLFFBQUEsUUFBQSxPQUFBLFFBQUEsV0FBQSxTQUFBLEtBQUEsSUFBQTtLQUNBLEdBQUEsV0FBQSxJQUFBO01BQ0EsT0FBQSxRQUFBLFVBQUEsT0FBQSxLQUFBO01BQ0EsUUFBQTs7O0dBR0EsR0FBQSxDQUFBLE1BQUE7SUFDQSxPQUFBLFFBQUEsVUFBQSxLQUFBO0lBQ0E7R0FDQSxPQUFBLENBQUE7O0VBRUEsT0FBQSxZQUFBLFlBQUE7R0FDQSxJQUFBLENBQUEsT0FBQSxTQUFBO0lBQ0EsT0FBQTs7R0FFQSxPQUFBLENBQUEsT0FBQSxRQUFBLFFBQUEsSUFBQSxJQUFBLE9BQUEsUUFBQSxRQUFBLE9BQUEsUUFBQSxTQUFBLElBQUEsT0FBQSxRQUFBLE9BQUEsT0FBQSxRQUFBLE9BQUEsS0FBQTs7O0VBR0EsT0FBQSxjQUFBLFlBQUE7R0FDQSxJQUFBLENBQUEsT0FBQSxTQUFBO0lBQ0EsT0FBQTs7R0FFQSxPQUFBLE9BQUEsUUFBQSxpQkFBQSxJQUFBLGtCQUFBOzs7RUFHQSxPQUFBLE9BQUEsV0FBQSxVQUFBLFNBQUEsU0FBQTtHQUNBLElBQUEsWUFBQSxTQUFBO0lBQ0E7OztHQUdBLEdBQUEsUUFBQSxJQUFBO0lBQ0EsR0FBQSxPQUFBLFFBQUEsT0FBQTtLQUNBLE9BQUEsbUJBQUE7O1FBRUE7S0FDQSxPQUFBLEdBQUEsb0JBQUEsQ0FBQSxLQUFBLFFBQUE7S0FDQSxZQUFBLE9BQUEsZ0JBQUEsQ0FBQSxPQUFBLFFBQUEsTUFBQSxLQUFBLFNBQUEsS0FBQTtNQUNBLE9BQUEsT0FBQTs7Ozs7T0FLQTtJQUNBLE9BQUEsR0FBQTs7O0VBR0EsT0FBQSxPQUFBLHVCQUFBLFNBQUEsR0FBQSxFQUFBO0lBQ0EsR0FBQSxNQUFBLEVBQUE7S0FDQTs7SUFFQSxHQUFBO0lBQ0EsYUFBQSxFQUFBO1NBQ0E7S0FDQSxhQUFBO0tBQ0E7SUFDQSxPQUFBLFVBQUEsU0FBQTs7RUFFQSxPQUFBLElBQUEsdUJBQUEsU0FBQSxPQUFBLFNBQUEsU0FBQTs7R0FFQSxHQUFBLFFBQUEsUUFBQSxtQkFBQTtJQUNBLE9BQUEsVUFBQSxTQUFBO0lBQ0EsWUFBQSxPQUFBLFdBQUEsU0FBQSxNQUFBLEtBQUEsVUFBQSxNQUFBO0tBQ0EsT0FBQSxVQUFBOzs7T0FHQTtJQUNBLE9BQUEsVUFBQSxPQUFBLFVBQUE7SUFDQSxPQUFBLFVBQUE7OztFQUdBLElBQUEsa0JBQUEsVUFBQSxNQUFBO0dBQ0EsSUFBQSxTQUFBO0dBQ0EsUUFBQSxRQUFBLE9BQUEsS0FBQSxVQUFBLEtBQUE7SUFDQSxJQUFBLElBQUEsV0FBQSxNQUFBO0tBQ0EsU0FBQTs7O0dBR0EsT0FBQTs7RUFFQSxJQUFBLGlCQUFBLFVBQUEsS0FBQTtHQUNBLElBQUEsU0FBQTtHQUNBLFFBQUEsUUFBQSxPQUFBLEtBQUEsVUFBQSxLQUFBO0lBQ0EsSUFBQSxJQUFBLE9BQUEsS0FBQTtLQUNBLFNBQUE7OztHQUdBLE9BQUE7O0VBRUEsSUFBQSxlQUFBLFVBQUEsUUFBQTtHQUNBLE9BQUEsU0FBQSxTQUFBLGNBQUE7R0FDQSxPQUFBLE9BQUEsUUFBQTtHQUNBLE9BQUEsT0FBQSxTQUFBO0dBQ0EsT0FBQSxNQUFBLE9BQUEsT0FBQSxXQUFBO0dBQ0EsSUFBQSxXQUFBLE9BQUEsSUFBQSxxQkFBQSxHQUFBLEdBQUEsS0FBQTtHQUNBLFNBQUEsYUFBQSxHQUFBO0dBQ0EsU0FBQSxhQUFBLE1BQUE7R0FDQSxTQUFBLGFBQUEsR0FBQTtHQUNBLE9BQUEsSUFBQSxZQUFBO0dBQ0EsT0FBQSxJQUFBLFNBQUEsR0FBQSxHQUFBLEtBQUE7R0FDQSxPQUFBLFVBQUEsT0FBQSxJQUFBLGFBQUEsR0FBQSxHQUFBLEtBQUEsR0FBQTs7O0VBR0EsSUFBQSxlQUFBLFNBQUEsTUFBQTtHQUNBLElBQUEsV0FBQSxPQUFBLElBQUEscUJBQUEsR0FBQSxHQUFBLEtBQUE7R0FDQSxTQUFBLGFBQUEsR0FBQTtHQUNBLFNBQUEsYUFBQSxNQUFBO0dBQ0EsU0FBQSxhQUFBLEdBQUE7R0FDQSxPQUFBLElBQUEsWUFBQTtHQUNBLE9BQUEsSUFBQSxTQUFBLEdBQUEsR0FBQSxLQUFBO0dBQ0EsT0FBQSxVQUFBLE9BQUEsSUFBQSxhQUFBLEdBQUEsR0FBQSxLQUFBLEdBQUE7O0VBRUE7O0VBRUEsSUFBQSxpQkFBQSxVQUFBLFNBQUE7R0FDQSxJQUFBLFFBQUE7R0FDQSxJQUFBLE1BQUEsUUFBQSxXQUFBO0dBQ0EsSUFBQSxTQUFBLGVBQUE7R0FDQSxJQUFBLFFBQUEsT0FBQSxRQUFBLFlBQUEsUUFBQTtHQUNBLElBQUEsT0FBQSxRQUFBO0dBQ0EsUUFBQTtHQUNBLEtBQUE7SUFDQSxNQUFBLFFBQUE7SUFDQSxNQUFBLFNBQUE7SUFDQSxNQUFBLFdBQUE7S0FDQSxPQUFBO0tBQ0EsUUFBQTs7SUFFQTtHQUNBLEtBQUE7SUFDQSxNQUFBLFFBQUE7SUFDQSxNQUFBLE9BQUE7SUFDQSxNQUFBLFdBQUE7S0FDQSxPQUFBO0tBQ0EsTUFBQTs7SUFFQTtHQUNBLEtBQUE7SUFDQSxJQUFBLE9BQUEsUUFBQTtLQUNBLElBQUEsV0FBQSxTQUFBLE1BQUEsTUFBQSxPQUFBLFVBQUE7S0FDQSxJQUFBLFFBQUEsVUFBQSxPQUFBLFFBQUEsWUFBQSxPQUFBLE9BQUEsUUFBQSxXQUFBLEtBQUEsT0FBQSxPQUFBLFFBQUEsV0FBQSxLQUFBLE1BQUEsT0FBQSxRQUFBLFdBQUEsS0FBQTtLQUNBLE1BQUEsUUFBQTtLQUNBLE1BQUEsVUFBQTtNQUNBLE9BQUE7TUFDQSxNQUFBOztLQUVBLE1BQUEsV0FBQTtNQUNBLE9BQUE7TUFDQSxTQUFBO09BQ0EsT0FBQTtPQUNBLE1BQUE7OztLQUdBO1dBQ0E7S0FDQSxNQUFBLFFBQUE7S0FDQSxNQUFBLFVBQUE7TUFDQSxPQUFBO01BQ0EsTUFBQTs7Ozs7O0dBTUEsTUFBQSxhQUFBLFVBQUEsWUFBQTtJQUNBLElBQUEsS0FBQSxXQUFBOzs7OztHQUtBLE1BQUEsY0FBQSxVQUFBLFlBQUEsVUFBQTtJQUNBLElBQUEsUUFBQTtLQUNBLE1BQUEsUUFBQSxXQUFBO0tBQ0EsVUFBQSxDQUFBLElBQUE7S0FDQSxVQUFBO0tBQ0Esa0JBQUE7O0lBRUEsT0FBQTs7OztHQUlBLE9BQUE7OztFQUdBLE9BQUEsZ0JBQUEsWUFBQTtHQUNBLFlBQUEsT0FBQSxPQUFBLEtBQUEsVUFBQSxLQUFBO0lBQ0EsT0FBQSxPQUFBLFFBQUEsU0FBQSxHQUFBLEVBQUE7TUFDQSxHQUFBLE1BQUEsRUFBQTtPQUNBOzs7TUFHQSxJQUFBLE1BQUEsQ0FBQSxFQUFBLFlBQUEsR0FBQSxHQUFBLEdBQUEsQ0FBQSxFQUFBLFlBQUEsR0FBQSxHQUFBO01BQ0EsTUFBQSxDQUFBLEVBQUEsWUFBQSxHQUFBLEdBQUEsR0FBQSxDQUFBLEVBQUEsWUFBQSxHQUFBLEdBQUE7TUFDQSxJQUFBLFlBQUEsRUFBQSxPQUFBLEVBQUEsWUFBQSxHQUFBLEdBQUEsSUFBQSxFQUFBLFlBQUEsR0FBQSxHQUFBO0lBQ0EsWUFBQSxFQUFBLE9BQUEsRUFBQSxZQUFBLEdBQUEsR0FBQSxJQUFBLEVBQUEsWUFBQSxHQUFBLEdBQUE7SUFDQSxTQUFBLEVBQUEsYUFBQSxXQUFBOzs7TUFHQSxJQUFBLFVBQUEsUUFBQTtPQUNBLGdCQUFBLENBQUEsSUFBQTs7O0lBR0EsSUFBQSxTQUFBOzs7SUFHQSxJQUFBLFFBQUE7SUFDQSxJQUFBLEtBQUE7SUFDQSxJQUFBLFNBQUE7SUFDQSxJQUFBLE1BQUE7SUFDQSxJQUFBLE9BQUEsb0dBQUE7SUFDQSxPQUFBLFlBQUEsSUFBQSxFQUFBLFVBQUEsVUFBQTtLQUNBLEtBQUE7S0FDQSxPQUFBO0tBQ0EsU0FBQTtLQUNBLGlCQUFBLENBQUE7S0FDQSxhQUFBO0tBQ0EsU0FBQSxVQUFBLEtBQUEsR0FBQTs7Ozs7Ozs7Ozs7Ozs7TUFjQSxPQUFBLFVBQUEsZUFBQSxJQUFBLFFBQUEsV0FBQTs7S0FFQSxzQkFBQSxVQUFBLFNBQUE7O01BRUEsT0FBQSxRQUFBLFdBQUE7O0tBRUEsUUFBQSxVQUFBLFNBQUEsU0FBQTs7TUFFQSxJQUFBLFFBQUEsTUFBQSxTQUFBLFdBQUEsUUFBQSxNQUFBLFNBQUEsd0JBQUE7O09BRUEsSUFBQSxRQUFBLFdBQUEsZUFBQSxLQUFBLFFBQUEsV0FBQSxlQUFBLEtBQUEsUUFBQSxXQUFBLGVBQUEsR0FBQTtRQUNBLE9BQUE7Y0FDQTtRQUNBLE9BQUE7Ozs7TUFJQSxPQUFBOzs7S0FHQSxPQUFBOzs7S0FHQSxXQUFBLFVBQUEsV0FBQTtNQUNBLElBQUEsVUFBQSxRQUFBLFlBQUEsQ0FBQSxHQUFBO09BQ0EsT0FBQSxVQUFBLFFBQUEsVUFBQTs7TUFFQSxPQUFBLFlBQUE7Ozs7SUFJQSxNQUFBLFlBQUEsT0FBQTtJQUNBLElBQUEsU0FBQSxPQUFBOzs7RUFHQSxPQUFBOzs7O0FDNVdBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLGtCQUFBLFVBQUE7Ozs7OztBQ0hBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLHVDQUFBLFNBQUEsUUFBQSxXQUFBOztFQUVBLE9BQUEsT0FBQSxVQUFBO0dBQ0EsT0FBQSxXQUFBO0tBQ0EsU0FBQSxRQUFBO0dBQ0EsT0FBQSxlQUFBLFdBQUE7Ozs7Ozs7QUNSQSxDQUFBLFlBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSwrQkFBQSxVQUFBLFdBQUE7RUFDQSxLQUFBLFdBQUE7R0FDQSxhQUFBO0dBQ0EsV0FBQTtHQUNBLHlCQUFBO0dBQ0Esa0JBQUE7OztFQUdBLEtBQUEsZUFBQSxVQUFBLE1BQUEsSUFBQTtHQUNBLFVBQUEsS0FBQSxVQUFBO0tBQ0EsTUFBQTtLQUNBLFFBQUEsd0JBQUEsT0FBQTtLQUNBLEdBQUE7S0FDQSxZQUFBOzs7O0lBSUEsS0FBQSxnQkFBQSxXQUFBO0dBQ0EsVUFBQSxLQUFBOztLQUVBLGFBQUE7U0FDQSxrQkFBQTs7S0FFQSxLQUFBLFVBQUEsUUFBQTs7T0FFQSxZQUFBOzs7Ozs7Ozs7O0FDNUJBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLGtEQUFBLFNBQUEsUUFBQSxPQUFBLFlBQUE7O0VBRUEsSUFBQSxjQUFBOztFQUVBLE9BQUEsZUFBQSxVQUFBOztHQUVBLE1BQUEsTUFBQSxhQUFBLEtBQUEsVUFBQSxLQUFBOzs7Ozs7OztFQVFBLE9BQUEsVUFBQSxVQUFBO0dBQ0EsWUFBQSxJQUFBLHFCQUFBLE1BQUEsS0FBQSxVQUFBLFNBQUE7O01BRUEsVUFBQSxNQUFBOzs7Ozs7Ozs7QUNwQkEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsaUdBQUEsU0FBQSxRQUFBLFVBQUEsV0FBQSxXQUFBLGNBQUEsY0FBQTs7RUFFQSxPQUFBLGFBQUE7RUFDQSxPQUFBLE9BQUE7O0VBRUEsSUFBQSxRQUFBO0lBQ0EsVUFBQSxZQUFBLFdBQUEsU0FBQSxZQUFBLFlBQUEsV0FBQSxpQkFBQSxTQUFBO0lBQ0EsYUFBQSxvQkFBQSxhQUFBLE9BQUEsb0JBQUEsV0FBQSxvQkFBQSxXQUFBO0lBQ0Esc0JBQUEsU0FBQSxxQkFBQSxrQkFBQSxpQkFBQSxjQUFBLGNBQUE7SUFDQSxZQUFBLGtCQUFBLGFBQUEsZUFBQSxjQUFBLFdBQUEsT0FBQSx1QkFBQTtJQUNBLGFBQUEsUUFBQSxRQUFBLGFBQUEsV0FBQSxVQUFBLFNBQUEsZUFBQSxXQUFBLGVBQUE7SUFDQSxRQUFBLHlCQUFBLFFBQUEsZUFBQSxlQUFBLG1CQUFBLGFBQUE7SUFDQSxhQUFBLGlCQUFBLGVBQUEsV0FBQSxrQkFBQSxlQUFBO0lBQ0Esd0JBQUEsZ0JBQUEseUJBQUEsYUFBQSxlQUFBLGlCQUFBO0lBQ0EsUUFBQSxXQUFBLHNCQUFBLFNBQUEsV0FBQSxTQUFBLGNBQUEsUUFBQSxTQUFBLFNBQUE7SUFDQSxVQUFBLGtCQUFBLGNBQUEsZ0JBQUEsYUFBQSxTQUFBLG1CQUFBLFNBQUE7SUFDQSxtQkFBQSxjQUFBLGVBQUEsaUJBQUEsZUFBQSxjQUFBLFlBQUEsY0FBQTtJQUNBLFNBQUEsY0FBQSxhQUFBLFdBQUEsZ0JBQUEsYUFBQSxRQUFBLFNBQUEsUUFBQTtJQUNBLHNCQUFBLFlBQUEsVUFBQSxTQUFBOztHQUVBLFVBQUE7O0VBRUEsVUFBQSxVQUFBO0dBQ0EsT0FBQSxPQUFBLE1BQUEsRUFBQTtHQUNBLElBQUEsVUFBQSxJQUFBO0lBQ0EsVUFBQTs7S0FFQTs7Ozs7O0FDOUJBLENBQUEsV0FBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLGFBQUEsV0FBQTs7Ozs7O0FDSEEsQ0FBQSxZQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsc0ZBQUEsVUFBQSxRQUFBLFlBQUEsVUFBQSxZQUFBLGFBQUEsT0FBQTs7RUFFQSxJQUFBLFNBQUE7Ozs7Ozs7O0VBUUEsT0FBQSxTQUFBO0dBQ0EsS0FBQTtHQUNBLEtBQUE7R0FDQSxNQUFBOztFQUVBLE9BQUEsV0FBQTtHQUNBLGlCQUFBOztFQUVBLFFBQUEsT0FBQSxZQUFBO0dBQ0EsUUFBQTtJQUNBLEtBQUE7SUFDQSxLQUFBO0lBQ0EsTUFBQTs7R0FFQSxRQUFBO0lBQ0EsWUFBQTtLQUNBLEtBQUE7TUFDQSxNQUFBO01BQ0EsS0FBQSxrRkFBQTtNQUNBLE1BQUE7OztJQUdBLFVBQUE7S0FDQSxjQUFBO01BQ0EsTUFBQTtNQUNBLE1BQUE7TUFDQSxLQUFBO01BQ0EsU0FBQTs7Ozs7Ozs7Ozs7Ozs7OztFQWdCQSxPQUFBLFdBQUEsVUFBQSxJQUFBO0dBQ0EsSUFBQSxNQUFBLCtCQUFBO0dBQ0EsTUFBQSxJQUFBLEtBQUEsUUFBQSxVQUFBLEtBQUE7SUFDQSxPQUFBLFNBQUE7S0FDQSxLQUFBLElBQUE7S0FDQSxLQUFBLElBQUE7S0FDQSxNQUFBOztJQUVBLE9BQUEsS0FBQSxJQUFBOzs7OztFQUtBLE9BQUEsZ0JBQUE7RUFDQSxPQUFBLE9BQUE7RUFDQSxPQUFBLElBQUEsd0NBQUEsVUFBQSxPQUFBLGNBQUE7O0dBRUEsT0FBQSxnQkFBQSxhQUFBLEtBQUE7R0FDQSxPQUFBLE9BQUEsMkJBQUEsYUFBQSxLQUFBOzs7RUFHQSxPQUFBLElBQUEsdUNBQUEsVUFBQSxPQUFBLGNBQUE7R0FDQSxPQUFBLGdCQUFBO0dBQ0EsT0FBQSxPQUFBOztFQUVBLFdBQUEsZUFBQSxZQUFBLE9BQUE7Ozs7O0FDakZBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLFlBQUEsVUFBQTs7Ozs7O0FDSEEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsZUFBQSxVQUFBOzs7Ozs7QUNIQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSxvQ0FBQSxTQUFBLFFBQUEsT0FBQTs7Ozs7O0FDSEEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsaUJBQUEsVUFBQTs7Ozs7O0FDSEEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEseUNBQUEsU0FBQSxRQUFBLGFBQUE7O0VBRUEsT0FBQSxlQUFBLFVBQUE7R0FDQSxhQUFBLEtBQUE7OztFQUdBLE9BQUEsYUFBQSxVQUFBO0dBQ0EsYUFBQSxNQUFBOzs7Ozs7O0FDVkEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsMEJBQUEsVUFBQTs7Ozs7O0FDSEEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsNENBQUEsU0FBQSxRQUFBLGNBQUE7O1FBRUEsT0FBQSxPQUFBLFVBQUE7O1lBRUEsY0FBQTs7O1FBR0EsT0FBQSxPQUFBLFVBQUE7U0FDQSxjQUFBOzs7Ozs7O0FDWEEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxRQUFBLG9CQUFBLFlBQUEsZUFBQSxVQUFBOzs7Ozs7QUNIQSxDQUFBLFlBQUE7Q0FDQTs7Q0FFQSxTQUFBLGNBQUEsV0FBQSxPQUFBO0VBQ0EsSUFBQSxZQUFBO0VBQ0EsSUFBQSxPQUFBLFNBQUEsZUFBQTtFQUNBLEdBQUEsUUFBQSxLQUFBO0dBQ0EsUUFBQSxRQUFBLFVBQUEsS0FBQSxRQUFBLE9BQUEsK0NBQUEsWUFBQTs7RUFFQTtFQUNBLFNBQUEsWUFBQSxTQUFBLE1BQUEsT0FBQSxTQUFBO0dBQ0EsUUFBQSxRQUFBLFNBQUEsY0FBQSxNQUFBLFlBQUEsS0FBQTtHQUNBLFFBQUEsUUFBQSxTQUFBLGNBQUEsTUFBQSxZQUFBLElBQUEsV0FBQTs7R0FFQSxPQUFBLGVBQUEsT0FBQSxNQUFBOztFQUVBLFNBQUEsY0FBQTtHQUNBLFFBQUEsUUFBQSxTQUFBLGNBQUEsTUFBQSxZQUFBLElBQUEsV0FBQTs7RUFFQSxTQUFBLGVBQUEsT0FBQSxHQUFBLFNBQUE7R0FDQSxJQUFBLE9BQUEsTUFBQTtHQUNBLElBQUEsVUFBQTtHQUNBLElBQUEsVUFBQTtHQUNBLElBQUEsTUFBQSxRQUFBLEtBQUEsT0FBQTtHQUNBLElBQUEsUUFBQSxPQUFBO0dBQ0EsSUFBQSxNQUFBLFFBQUEsUUFBQSxTQUFBLGNBQUEsT0FBQTtHQUNBLElBQUEsTUFBQSxTQUFBLGNBQUEsTUFBQTtHQUNBLElBQUEsUUFBQSxJQUFBLHdCQUFBLE1BQUEsRUFBQSxJQUFBLE1BQUE7R0FDQSxJQUFBLFNBQUEsSUFBQSx3QkFBQSxPQUFBLEVBQUEsSUFBQSxFQUFBLFNBQUE7R0FDQSxPQUFBLFFBQUEsUUFBQSxTQUFBLGNBQUEsT0FBQSxJQUFBLE9BQUEsUUFBQSxNQUFBLElBQUEsUUFBQSxTQUFBOztFQUVBLE9BQUE7R0FDQSxhQUFBO0dBQ0EsYUFBQTtHQUNBLGdCQUFBOzs7Q0FHQSxRQUFBLE9BQUEsa0JBQUEsVUFBQSx3QkFBQSxVQUFBLFVBQUE7RUFDQSxJQUFBO0VBQ0EsV0FBQSxZQUFBO0dBQ0EsT0FBQTtJQUNBLE9BQUE7SUFDQSxRQUFBO0lBQ0EsZ0JBQUE7SUFDQSxXQUFBO0lBQ0EsS0FBQTtJQUNBLE9BQUE7SUFDQSxRQUFBO0lBQ0EsU0FBQTtJQUNBLFNBQUE7SUFDQSxZQUFBLEdBQUEsTUFBQSxVQUFBLE9BQUEsQ0FBQSxNQUFBLE9BQUEsTUFBQSxDQUFBLFdBQUE7SUFDQSxZQUFBO0lBQ0EsY0FBQTtJQUNBLFVBQUE7SUFDQSxTQUFBLGNBQUEsbUJBQUE7OztFQUdBLE9BQUE7R0FDQSxVQUFBO0dBQ0EsT0FBQTtJQUNBLFdBQUE7SUFDQSxXQUFBO0lBQ0EsU0FBQTtJQUNBLFlBQUE7SUFDQSxTQUFBO0lBQ0EsU0FBQTs7R0FFQSxTQUFBO0dBQ0EsTUFBQSxVQUFBLE9BQUEsTUFBQSxPQUFBLFNBQUE7SUFDQSxJQUFBLFVBQUEsUUFBQSxPQUFBLFlBQUE7SUFDQSxJQUFBLFFBQUE7S0FDQSxRQUFBO0tBQ0EsU0FBQTs7SUFFQSxJQUFBLGFBQUEsR0FBQSxJQUFBLE1BQUEsV0FBQSxVQUFBLEdBQUE7S0FDQSxPQUFBLFNBQUEsRUFBQTs7O0lBR0EsUUFBQSxlQUFBLEdBQUEsTUFBQSxNQUFBLFNBQUEsS0FBQSxPQUFBLENBQUEsR0FBQSxhQUFBLE1BQUEsQ0FBQSxHQUFBO0lBQ0EsUUFBQSxTQUFBO0tBQ0EsR0FBQSxRQUFBLFFBQUE7S0FDQSxHQUFBLFFBQUEsU0FBQTs7SUFFQSxRQUFBLGNBQUE7S0FDQSxNQUFBO01BQ0EsR0FBQSxRQUFBLFFBQUE7TUFDQSxHQUFBLFFBQUEsVUFBQTtNQUNBLFFBQUE7O0tBRUEsTUFBQTtNQUNBLEdBQUEsUUFBQSxRQUFBO01BQ0EsR0FBQSxRQUFBLFVBQUE7TUFDQSxRQUFBOzs7SUFHQSxJQUFBLGVBQUEsWUFBQTs7O0tBR0EsUUFBQSxRQUFBLE1BQUEsU0FBQSxVQUFBLE9BQUE7TUFDQSxRQUFBLFFBQUEsTUFBQSxVQUFBLFVBQUEsTUFBQTs7T0FFQSxJQUFBLE1BQUEsVUFBQSxLQUFBLGNBQUE7UUFDQSxJQUFBLE9BQUE7U0FDQSxNQUFBLEtBQUE7U0FDQSxRQUFBLE1BQUEsVUFBQSxLQUFBLGVBQUEsTUFBQTtTQUNBLE9BQUEsTUFBQSxVQUFBLEtBQUEsZUFBQSxNQUFBO1NBQ0EsTUFBQSxLQUFBO1NBQ0EsT0FBQSxNQUFBLFlBQUEsVUFBQSxFQUFBO1NBQ0EsR0FBQSxRQUFBLE9BQUE7U0FDQSxHQUFBLFFBQUEsT0FBQTtTQUNBLE9BQUEsS0FBQTtTQUNBLE1BQUEsS0FBQTtTQUNBLFNBQUEsS0FBQTtTQUNBLE1BQUE7O1FBRUEsTUFBQSxLQUFBOzs7O0tBSUE7O0lBRUEsSUFBQSxnQkFBQSxVQUFBO0tBQ0EsU0FBQTtLQUNBLElBQUEsUUFBQTtLQUNBLFFBQUEsUUFBQSxPQUFBLFNBQUEsS0FBQTtPQUNBLElBQUEsU0FBQTtPQUNBLElBQUEsUUFBQTtPQUNBLFFBQUEsUUFBQSxRQUFBLFNBQUEsT0FBQSxNQUFBO1FBQ0EsR0FBQSxLQUFBLFNBQUEsTUFBQTtTQUNBLFNBQUE7OztPQUdBLEdBQUEsQ0FBQSxPQUFBO1FBQ0E7UUFDQSxPQUFBLEtBQUEsU0FBQTtTQUNBLEdBQUEsUUFBQSxRQUFBO1NBQ0EsR0FBQSxRQUFBLFNBQUEsS0FBQSxJQUFBO1NBQ0EsUUFBQTs7Ozs7S0FLQSxRQUFBLElBQUE7O0lBRUEsSUFBQSxhQUFBLFlBQUE7S0FDQSxRQUFBLFFBQUEsTUFBQSxLQUFBO0tBQ0EsUUFBQSxNQUFBLEdBQUEsT0FBQSxLQUFBLElBQUEsT0FBQSxPQUFBLEtBQUEsU0FBQSxRQUFBLE9BQUEsS0FBQSxVQUFBLFFBQUEsUUFBQSxLQUFBLE1BQUE7O0tBRUEsSUFBQSxDQUFBLFFBQUEsU0FBQTtNQUNBLElBQUEsS0FBQSxLQUFBO01BQ0EsSUFBQSxTQUFBLEdBQUEsSUFBQTtRQUNBLFlBQUE7UUFDQSxZQUFBO1FBQ0EsV0FBQSxDQUFBLE1BQUEsS0FBQTtRQUNBLFNBQUEsTUFBQSxLQUFBO01BQ0EsSUFBQSxZQUFBLEdBQUEsSUFBQTtRQUNBLFlBQUE7UUFDQSxZQUFBO1FBQ0EsV0FBQSxNQUFBLEtBQUE7UUFDQSxTQUFBLE9BQUEsS0FBQTs7TUFFQSxRQUFBLFNBQUEsUUFBQSxJQUFBLE9BQUE7UUFDQSxLQUFBLEtBQUE7UUFDQSxLQUFBLFFBQUE7UUFDQSxLQUFBLGFBQUE7TUFDQSxRQUFBLFlBQUEsUUFBQSxJQUFBLE9BQUE7UUFDQSxLQUFBLEtBQUE7UUFDQSxLQUFBLFFBQUE7UUFDQSxLQUFBLGFBQUE7O0tBRUEsUUFBQSxhQUFBLFFBQUEsSUFBQSxVQUFBLFVBQUEsS0FBQSxPQUFBLFFBQUEsT0FBQSxLQUFBLEtBQUEsYUFBQSxnQkFBQSxRQUFBLFFBQUEsS0FBQSxPQUFBLFFBQUEsU0FBQSxLQUFBLEtBQUEsS0FBQSxTQUFBOzs7Ozs7S0FNQSxRQUFBLFVBQUEsUUFBQSxXQUFBLE9BQUEsVUFBQSxLQUFBLEtBQUEsR0FBQSxLQUFBLFNBQUEsVUFBQSxHQUFBO01BQ0EsT0FBQSxFQUFBLFNBQUEsUUFBQSxXQUFBLEVBQUE7U0FDQSxLQUFBLGdCQUFBLEdBQUEsS0FBQSxVQUFBLFVBQUEsR0FBQTtNQUNBLE9BQUEsR0FBQSxJQUFBLFFBQUEsV0FBQSxFQUFBLFFBQUE7UUFDQSxLQUFBLE1BQUEsVUFBQSxHQUFBO01BQ0EsT0FBQSxZQUFBLEVBQUE7O0tBRUEsUUFBQSxRQUFBLFFBQUEsV0FBQSxPQUFBO09BQ0EsS0FBQSxlQUFBO09BQ0EsS0FBQSxhQUFBLFVBQUEsR0FBQTtPQUNBOztPQUVBLEtBQUEsZUFBQTtPQUNBLEtBQUEsUUFBQTtPQUNBLEtBQUEsVUFBQSxHQUFBO09BQ0EsT0FBQSxFQUFBOztLQUVBLFFBQUEsTUFBQSxHQUFBLGFBQUEsVUFBQSxHQUFBLEdBQUE7TUFDQSxPQUFBLGFBQUEsR0FBQSxHQUFBO1FBQ0EsR0FBQSxZQUFBLFVBQUEsR0FBQSxHQUFBO01BQ0EsT0FBQSxhQUFBLEdBQUEsR0FBQTtRQUNBLEdBQUEsU0FBQSxVQUFBLEdBQUEsR0FBQTtNQUNBLFFBQUEsY0FBQTtNQUNBLFFBQUE7O0tBRUEsUUFBQSxRQUFBLGFBQUEsU0FBQSxRQUFBLFVBQUEsS0FBQSxLQUFBLFVBQUEsR0FBQTtNQUNBLE9BQUEsRUFBQTs7S0FFQSxRQUFBLE1BQUEsYUFBQSxTQUFBLFFBQUEsVUFBQSxLQUFBLGFBQUEsVUFBQSxHQUFBO01BQ0EsT0FBQSxFQUFBLFNBQUEsT0FBQTtRQUNBLEtBQUEsS0FBQSxVQUFBLEdBQUE7TUFDQSxPQUFBLEVBQUEsU0FBQSxNQUFBOzs7SUFHQSxJQUFBLGFBQUEsWUFBQTs7S0FFQSxNQUFBLFFBQUEsVUFBQSxHQUFBLEdBQUE7TUFDQSxRQUFBLFFBQUEsYUFBQSxTQUFBLFFBQUEsVUFBQSxNQUFBLElBQUEsUUFBQTtRQUNBLEtBQUEsS0FBQSxVQUFBLEdBQUE7UUFDQSxFQUFBLFNBQUEsRUFBQSxRQUFBLE1BQUEsVUFBQSxFQUFBLFFBQUEsTUFBQTs7UUFFQSxPQUFBLE1BQUEsVUFBQSxFQUFBLFFBQUEsTUFBQTs7TUFFQSxRQUFBLE1BQUEsYUFBQSxTQUFBLFFBQUEsVUFBQSxNQUFBLElBQUEsUUFBQTtRQUNBLEtBQUEsYUFBQSxVQUFBLEdBQUE7UUFDQSxPQUFBLENBQUEsTUFBQSxVQUFBLEVBQUEsUUFBQSxNQUFBLGNBQUEsT0FBQTs7UUFFQSxLQUFBLEtBQUEsVUFBQSxHQUFBO1FBQ0EsT0FBQSxDQUFBLE1BQUEsVUFBQSxFQUFBLFFBQUEsTUFBQSxjQUFBLE1BQUE7Ozs7SUFJQSxJQUFBLFNBQUEsVUFBQSxHQUFBO0tBQ0EsT0FBQSxDQUFBLEtBQUEsSUFBQSxFQUFBLFFBQUEsT0FBQTs7SUFFQSxJQUFBLFFBQUEsWUFBQTtLQUNBLE9BQUEsUUFBQSxRQUFBLEdBQUEsT0FBQSxRQUFBLE1BQUEsT0FBQSxLQUFBLENBQUEsUUFBQSxPQUFBLFFBQUEsU0FBQSxNQUFBOztJQUVBLElBQUEsb0JBQUEsWUFBQTtLQUNBLFFBQUEsTUFBQSxRQUFBLFFBQUEsZ0JBQUEsT0FBQSxRQUFBLFNBQUEsS0FBQSxHQUFBLFFBQUEsVUFBQSxHQUFBO01BQ0EsT0FBQSxRQUFBLFFBQUEsS0FBQSxvQkFBQSxFQUFBLFFBQUEsS0FBQSxNQUFBLFVBQUEsR0FBQTtPQUNBLE9BQUEsRUFBQTtTQUNBLEtBQUEsTUFBQSxVQUFBLEdBQUE7T0FDQSxPQUFBLEVBQUE7OztLQUdBLFFBQUEsTUFBQTs7SUFFQSxJQUFBLGlCQUFBLFlBQUE7S0FDQSxRQUFBLE1BQUEsUUFBQSxRQUFBLGdCQUFBLE9BQUEsUUFBQSxTQUFBLEtBQUEsR0FBQSxRQUFBLFVBQUEsR0FBQTtNQUNBLFFBQUEsV0FBQSxLQUFBLGlCQUFBLEVBQUEsUUFBQSxLQUFBLGFBQUEsVUFBQSxHQUFBO09BQ0EsT0FBQSxlQUFBLEVBQUEsSUFBQSxNQUFBLEVBQUEsSUFBQTs7O0tBR0EsUUFBQSxNQUFBOztJQUVBLElBQUEsc0JBQUEsVUFBQSxPQUFBO0tBQ0EsT0FBQSxDQUFBLFVBQUEsT0FBQTtNQUNBLE9BQUEsVUFBQSxHQUFBO09BQ0EsRUFBQSxJQUFBLEVBQUEsSUFBQSxDQUFBLFFBQUEsT0FBQSxJQUFBLEVBQUEsTUFBQSxRQUFBLFNBQUEsUUFBQTtPQUNBLEVBQUEsSUFBQSxFQUFBLElBQUEsQ0FBQSxRQUFBLE9BQUEsSUFBQSxFQUFBLE1BQUEsUUFBQSxTQUFBLFFBQUE7O1FBRUE7O0lBRUEsSUFBQSxtQkFBQSxVQUFBLE9BQUE7S0FDQSxPQUFBLENBQUEsVUFBQSxPQUFBO01BQ0EsT0FBQSxVQUFBLEdBQUE7T0FDQSxFQUFBLElBQUEsRUFBQSxJQUFBLENBQUEsUUFBQSxPQUFBLElBQUEsRUFBQSxNQUFBLFFBQUEsU0FBQSxRQUFBLFFBQUE7T0FDQSxFQUFBLElBQUEsRUFBQSxJQUFBLENBQUEsTUFBQSxFQUFBLE1BQUEsUUFBQSxTQUFBLFFBQUEsUUFBQTs7UUFFQTs7SUFFQSxJQUFBLG1CQUFBLFVBQUEsT0FBQTtLQUNBLE9BQUEsQ0FBQSxVQUFBLE9BQUE7TUFDQSxPQUFBLFVBQUEsR0FBQTtPQUNBLElBQUE7T0FDQSxTQUFBLFFBQUEsWUFBQSxFQUFBO09BQ0EsRUFBQSxJQUFBLEVBQUEsSUFBQSxDQUFBLE9BQUEsSUFBQSxFQUFBLE1BQUEsT0FBQSxTQUFBLFFBQUEsUUFBQTtPQUNBLE9BQUEsRUFBQSxJQUFBLEVBQUEsSUFBQSxDQUFBLE9BQUEsSUFBQSxFQUFBLE1BQUEsT0FBQSxTQUFBLFFBQUEsUUFBQTs7UUFFQTs7SUFFQSxJQUFBLGVBQUEsVUFBQSxNQUFBLEdBQUEsU0FBQTtLQUNBLElBQUE7S0FDQSxVQUFBLDJCQUFBLEtBQUEsT0FBQTtLQUNBLFFBQUEsUUFBQSxLQUFBLEtBQUEsVUFBQSxVQUFBLE1BQUE7TUFDQSxXQUFBLHlDQUFBLEtBQUEsU0FBQSxLQUFBLFNBQUEsVUFBQSxLQUFBLFNBQUE7O0tBRUEsU0FBQSxRQUFBLFFBQUEsWUFBQSxTQUFBLE1BQUEsR0FBQSxPQUFBLE1BQUEsWUFBQTs7O0lBR0EsSUFBQSxlQUFBLFVBQUEsTUFBQSxHQUFBLFNBQUE7S0FDQSxPQUFBLFFBQUEsUUFBQTs7O0lBR0EsTUFBQSxPQUFBLGFBQUEsVUFBQSxNQUFBLFNBQUE7S0FDQSxRQUFBLFFBQUE7S0FDQSxJQUFBLFFBQUEsV0FBQSxNQUFBO01BQ0E7TUFDQTtNQUNBO1lBQ0E7TUFDQTs7S0FFQTs7O0lBR0EsTUFBQSxPQUFBLGFBQUEsVUFBQSxNQUFBLE1BQUE7S0FDQSxJQUFBLFNBQUEsTUFBQTtNQUNBOztLQUVBLElBQUEsUUFBQSxPQUFBO01BQ0E7WUFDQTtNQUNBOzs7Ozs7OztBQ3RUQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLFFBQUEsb0JBQUEsWUFBQSxtQkFBQSxVQUFBOzs7Ozs7QUNIQSxDQUFBLFdBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsa0JBQUEsVUFBQSw0QkFBQSxTQUFBLFVBQUE7RUFDQSxJQUFBLFdBQUEsV0FBQTtHQUNBLE9BQUE7SUFDQSxPQUFBO0lBQ0EsUUFBQTtJQUNBLE9BQUE7SUFDQSxNQUFBOzs7RUFHQSxPQUFBO0dBQ0EsVUFBQTtHQUNBLFlBQUE7R0FDQSxPQUFBO0dBQ0EsU0FBQTtHQUNBLE1BQUEsU0FBQSxRQUFBLFNBQUEsUUFBQSxTQUFBOztJQUVBLElBQUEsVUFBQSxRQUFBLE9BQUEsWUFBQTs7O0lBR0EsSUFBQSxTQUFBLEdBQUEsTUFBQTtNQUNBLE9BQUEsQ0FBQSxHQUFBLFFBQUE7TUFDQSxNQUFBLENBQUEsR0FBQTtNQUNBLE1BQUE7OztJQUdBLElBQUEsTUFBQSxHQUFBLE9BQUEsUUFBQSxJQUFBLE9BQUE7TUFDQSxLQUFBLFNBQUEsUUFBQTtNQUNBLEtBQUEsVUFBQSxRQUFBO01BQ0EsT0FBQTtJQUNBLElBQUEsWUFBQSxJQUFBLE9BQUE7TUFDQSxLQUFBLGFBQUEsZUFBQSxRQUFBLFFBQUEsSUFBQSxNQUFBLFFBQUEsU0FBQSxJQUFBO0lBQ0EsSUFBQSxhQUFBLFVBQUEsT0FBQTtNQUNBLEtBQUEsS0FBQSxRQUFBLFFBQUEsSUFBQTtNQUNBLEtBQUEsZ0JBQUE7TUFDQSxLQUFBLFVBQUEsUUFBQTtNQUNBLE1BQUEsV0FBQTtNQUNBLEtBQUEsUUFBQTtJQUNBLElBQUEsTUFBQSxHQUFBLElBQUE7TUFDQSxXQUFBO01BQ0EsWUFBQSxTQUFBLEdBQUE7TUFDQSxPQUFBLFFBQUEsUUFBQSxJQUFBOztNQUVBLFlBQUEsU0FBQSxHQUFBO01BQ0EsT0FBQSxRQUFBLFFBQUE7O0lBRUEsSUFBQSxjQUFBLFVBQUEsT0FBQTtNQUNBLE1BQUE7TUFDQSxVQUFBLElBQUEsS0FBQSxLQUFBOztNQUVBLE1BQUEsUUFBQSxRQUFBO01BQ0EsS0FBQSxLQUFBO0lBQ0EsSUFBQSxPQUFBLFVBQUEsVUFBQTtNQUNBLEtBQUEsQ0FBQTtNQUNBO01BQ0EsT0FBQTtNQUNBLEtBQUEsU0FBQSxHQUFBO01BQ0EsT0FBQSxPQUFBOztPQUVBLE1BQUEsUUFBQSxRQUFBO01BQ0EsTUFBQSxlQUFBO01BQ0EsS0FBQSxlQUFBO01BQ0EsS0FBQSxLQUFBOzs7SUFHQSxTQUFBLFVBQUEsUUFBQTtLQUNBLFlBQUE7T0FDQSxTQUFBO09BQ0EsS0FBQSxVQUFBLE9BQUEsVUFBQSxJQUFBLEtBQUE7S0FDQSxLQUFBLGFBQUEsU0FBQSxLQUFBLE1BQUEsUUFBQSxTQUFBLEdBQUE7TUFDQSxJQUFBLE9BQUEsS0FBQSxZQUFBLE1BQUE7O01BRUEsSUFBQSxJQUFBLEdBQUEsWUFBQSxLQUFBLElBQUE7TUFDQSxPQUFBLFNBQUEsR0FBQTtPQUNBLEtBQUEsZUFBQSxRQUFBLEtBQUEsTUFBQSxFQUFBLEtBQUEsS0FBQTs7Ozs7O0lBTUEsU0FBQSxTQUFBLFlBQUEsVUFBQTtLQUNBLFdBQUEsVUFBQSxLQUFBLFNBQUEsR0FBQTtNQUNBLElBQUEsY0FBQSxHQUFBLFlBQUEsRUFBQSxVQUFBO01BQ0EsT0FBQSxTQUFBLEdBQUE7T0FDQSxFQUFBLFdBQUEsWUFBQTtPQUNBLE9BQUEsSUFBQTs7Ozs7O0lBTUEsT0FBQTtLQUNBLFdBQUE7TUFDQSxPQUFBLFFBQUE7O0tBRUEsU0FBQSxVQUFBLFVBQUE7TUFDQSxJQUFBLENBQUEsU0FBQTtPQUNBLFdBQUE7UUFDQSxNQUFBLFFBQUE7Ozs7TUFJQSxTQUFBLFVBQUE7T0FDQSxVQUFBLFNBQUE7Ozs7Ozs7Ozs7O0FDekdBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsUUFBQSxvQkFBQSxZQUFBLG1CQUFBLFVBQUE7Ozs7OztBQ0hBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxrQkFBQSxXQUFBLGVBQUEsV0FBQTs7RUFFQSxPQUFBO0dBQ0EsVUFBQTtHQUNBLGFBQUE7R0FDQSxZQUFBO0dBQ0EsTUFBQSxVQUFBLFFBQUEsU0FBQSxRQUFBOzs7Ozs7Ozs7QUNUQSxDQUFBLFlBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsa0JBQUEsVUFBQSx1QkFBQSxVQUFBLFVBQUE7RUFDQSxJQUFBLFdBQUEsWUFBQTtHQUNBLE9BQUE7SUFDQSxJQUFBO0lBQ0EsT0FBQTtJQUNBLFFBQUE7SUFDQSxNQUFBO0lBQ0EsT0FBQTtJQUNBLFVBQUE7SUFDQSxRQUFBO0tBQ0EsTUFBQTtLQUNBLE9BQUE7S0FDQSxLQUFBO0tBQ0EsUUFBQTs7SUFFQSxRQUFBLENBQUE7S0FDQSxVQUFBO0tBQ0EsT0FBQTtLQUNBLFNBQUE7T0FDQTtLQUNBLFVBQUE7S0FDQSxPQUFBO0tBQ0EsU0FBQTtPQUNBO0tBQ0EsVUFBQTtLQUNBLE9BQUE7S0FDQSxTQUFBOzs7O0VBSUEsT0FBQTtHQUNBLFVBQUE7R0FDQSxPQUFBO0lBQ0EsTUFBQTs7R0FFQSxTQUFBO0dBQ0EsTUFBQSxVQUFBLFFBQUEsU0FBQSxRQUFBLFNBQUE7O0lBRUEsSUFBQSxVQUFBLFFBQUEsT0FBQSxZQUFBOztJQUVBLEdBQUEsUUFBQSxNQUFBO0tBQ0EsUUFBQSxPQUFBLEdBQUEsUUFBQSxRQUFBOztJQUVBLFFBQUEsSUFBQSxVQUFBLFFBQUEsU0FBQSxNQUFBLElBQUEsaUJBQUEsUUFBQSxTQUFBLElBQUE7SUFDQSxJQUFBLElBQUEsR0FBQSxNQUFBO01BQ0EsT0FBQSxDQUFBLEdBQUE7TUFDQSxNQUFBLENBQUEsSUFBQSxRQUFBLFFBQUEsUUFBQSxPQUFBO01BQ0EsTUFBQTs7SUFFQSxJQUFBLFFBQUEsR0FBQSxJQUFBO01BQ0EsRUFBQTtNQUNBLE9BQUEsQ0FBQSxHQUFBO01BQ0EsR0FBQSxTQUFBO01BQ0EsR0FBQSxZQUFBOztJQUVBLElBQUEsTUFBQSxHQUFBLE9BQUEsUUFBQSxJQUFBLE9BQUE7TUFDQSxLQUFBLFNBQUEsUUFBQTtNQUNBLEtBQUEsVUFBQSxRQUFBLFNBQUEsUUFBQSxPQUFBLE1BQUEsUUFBQSxPQUFBO01BQ0EsT0FBQTs7SUFFQSxJQUFBLFdBQUEsSUFBQSxPQUFBO01BQ0EsT0FBQTtNQUNBLEtBQUEsTUFBQSxRQUFBO01BQ0EsS0FBQSxNQUFBO01BQ0EsS0FBQSxNQUFBO01BQ0EsS0FBQSxNQUFBO01BQ0EsS0FBQSxNQUFBO01BQ0EsS0FBQSxnQkFBQTtJQUNBLFFBQUEsUUFBQSxRQUFBLFFBQUEsVUFBQSxPQUFBO0tBQ0EsU0FBQSxPQUFBO09BQ0EsS0FBQSxVQUFBLE1BQUEsV0FBQTtPQUNBLEtBQUEsY0FBQSxNQUFBO09BQ0EsS0FBQSxnQkFBQSxNQUFBOztJQUVBLElBQUEsT0FBQTtNQUNBLEtBQUEsU0FBQSxRQUFBO01BQ0EsS0FBQSxVQUFBLFFBQUE7TUFDQSxNQUFBLFFBQUEsVUFBQSxRQUFBLFFBQUE7SUFDQSxJQUFBLFNBQUEsSUFBQSxPQUFBLEtBQUEsS0FBQSxhQUFBLGVBQUEsUUFBQSxTQUFBLElBQUEsT0FBQSxRQUFBLFNBQUEsSUFBQTtNQUNBLEtBQUEsU0FBQTs7SUFFQSxJQUFBLFFBQUEsU0FBQSxNQUFBO0tBQ0EsT0FBQSxPQUFBO09BQ0EsS0FBQSxLQUFBLFFBQUEsU0FBQTtLQUNBLE9BQUEsT0FBQTtPQUNBLEtBQUE7T0FDQSxNQUFBLGFBQUEsUUFBQSxPQUFBO09BQ0EsS0FBQSxlQUFBO09BQ0EsS0FBQSxLQUFBOzs7OztJQUtBLElBQUEsUUFBQSxTQUFBLE1BQUE7S0FDQSxJQUFBLFVBQUEsSUFBQSxPQUFBLEtBQUEsS0FBQSxhQUFBLGdCQUFBLFFBQUEsU0FBQSxRQUFBLFNBQUEsTUFBQSxPQUFBLFFBQUEsU0FBQSxJQUFBO09BQ0EsS0FBQSxTQUFBO0tBQ0EsUUFBQSxPQUFBO09BQ0EsS0FBQSxLQUFBLFFBQUEsU0FBQTtLQUNBLFFBQUEsT0FBQTtPQUNBLEtBQUE7T0FDQSxNQUFBLGFBQUEsUUFBQSxPQUFBO09BQ0EsS0FBQSxlQUFBO09BQ0EsS0FBQSxLQUFBOztJQUVBLElBQUEsU0FBQSxJQUFBLE9BQUE7TUFDQSxLQUFBLFNBQUE7SUFDQSxHQUFBLFFBQUEsWUFBQSxLQUFBO0tBQ0EsT0FBQSxLQUFBOzs7SUFHQSxPQUFBLE9BQUE7TUFDQSxLQUFBLFVBQUEsUUFBQTs7SUFFQSxJQUFBLFFBQUEsU0FBQSxNQUFBO0lBQ0EsT0FBQSxPQUFBO01BQ0EsS0FBQSxNQUFBLFFBQUEsUUFBQTtNQUNBLEtBQUEsTUFBQTtNQUNBLEtBQUEsTUFBQSxRQUFBLFFBQUE7TUFDQSxLQUFBLE1BQUEsUUFBQTtNQUNBLEtBQUEsb0JBQUE7TUFDQSxLQUFBLGdCQUFBO01BQ0EsS0FBQSxVQUFBOztJQUVBLElBQUEsYUFBQSxPQUFBLE9BQUE7TUFDQSxLQUFBLGFBQUEsaUJBQUEsUUFBQSxTQUFBLElBQUE7SUFDQSxJQUFBLFNBQUEsV0FBQSxPQUFBO01BQ0EsS0FBQSxTQUFBO01BQ0EsS0FBQSxLQUFBLFFBQUEsU0FBQTtLQUNBLEdBQUEsUUFBQSxNQUFBO01BQ0EsT0FBQSxNQUFBLFFBQUEsUUFBQTs7SUFFQSxJQUFBLGNBQUEsV0FBQSxPQUFBO01BQ0EsS0FBQTtNQUNBLE1BQUEsYUFBQSxRQUFBLE9BQUE7TUFDQSxLQUFBLGVBQUEsVUFBQSxLQUFBLEtBQUE7Ozs7OztJQU1BLFNBQUEsUUFBQTtLQUNBLElBQUEsUUFBQSxNQUFBLFNBQUE7O0tBRUEsSUFBQSxHQUFBLE1BQUEsYUFBQTtNQUNBLFFBQUEsRUFBQSxPQUFBLEdBQUEsTUFBQSxNQUFBO01BQ0EsTUFBQSxPQUFBLENBQUEsT0FBQTs7S0FFQSxZQUFBLEtBQUEsU0FBQTtLQUNBLFdBQUEsS0FBQSxhQUFBLGVBQUEsRUFBQSxTQUFBLE1BQUEsUUFBQSxTQUFBLElBQUE7OztJQUdBLFNBQUEsVUFBQTtLQUNBLElBQUEsUUFBQSxNQUFBLFNBQUE7TUFDQSxRQUFBO01BQ0EsUUFBQTtLQUNBLElBQUEsUUFBQTtLQUNBLEdBQUE7O01BRUEsUUFBQSxRQUFBLE9BQUEsTUFBQSxVQUFBLEtBQUEsS0FBQTtPQUNBLElBQUEsU0FBQSxJQUFBLFFBQUEsV0FBQSxTQUFBLFFBQUE7UUFDQSxRQUFBO1FBQ0EsUUFBQTs7O01BR0E7TUFDQSxRQUFBLFFBQUEsS0FBQSxRQUFBLElBQUEsUUFBQTtjQUNBLENBQUEsU0FBQSxRQUFBO0tBQ0EsUUFBQSxjQUFBO0tBQ0EsUUFBQTs7O0lBR0EsT0FBQTtLQUNBLFlBQUE7TUFDQSxPQUFBLFFBQUE7O0tBRUEsVUFBQSxVQUFBLFVBQUE7O01BRUEsSUFBQSxDQUFBLFVBQUE7T0FDQSxZQUFBLEtBQUEsU0FBQTtPQUNBLFdBQUEsS0FBQSxhQUFBLGVBQUEsRUFBQSxLQUFBLE1BQUEsUUFBQSxTQUFBLElBQUE7T0FDQTs7TUFFQSxZQUFBLEtBQUEsU0FBQSxTQUFBLFFBQUE7TUFDQSxJQUFBLFlBQUEsVUFBQTtPQUNBLFdBQUEsS0FBQSxhQUFBLGVBQUEsRUFBQSxTQUFBLFFBQUEsVUFBQSxNQUFBLFFBQUEsU0FBQSxJQUFBO2FBQ0E7T0FDQSxXQUFBLGFBQUEsU0FBQSxLQUFBLEtBQUEsUUFBQSxLQUFBLGFBQUEsZUFBQSxFQUFBLFNBQUEsUUFBQSxVQUFBLE1BQUEsUUFBQSxTQUFBLElBQUE7Ozs7Ozs7Ozs7O0FDN0xBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsUUFBQSxvQkFBQSxZQUFBLGNBQUEsVUFBQTs7Ozs7O0FDSEEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGtCQUFBLFdBQUEsbUJBQUEsV0FBQTs7RUFFQSxPQUFBO0dBQ0EsVUFBQTtHQUNBLE1BQUE7SUFDQSxLQUFBO0lBQ0EsVUFBQTs7R0FFQSxhQUFBO0dBQ0EsWUFBQTtHQUNBLE1BQUEsVUFBQSxRQUFBLFNBQUEsUUFBQTtJQUNBLE9BQUEsVUFBQTtJQUNBLE9BQUE7SUFDQSxPQUFBOzs7Ozs7Ozs7QUNoQkEsQ0FBQSxZQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsa0NBQUEsVUFBQSxRQUFBO0VBQ0EsT0FBQSxTQUFBO0dBQ0EsU0FBQTtHQUNBLFVBQUE7R0FDQSxVQUFBO0dBQ0EsYUFBQTtHQUNBLGlCQUFBO0dBQ0Esa0JBQUE7R0FDQSxlQUFBO0dBQ0EsaUJBQUE7R0FDQSxVQUFBOzs7Q0FHQSxPQUFBLFFBQUE7RUFDQSxRQUFBO0dBQ0EsTUFBQTs7RUFFQSxLQUFBOztFQUVBLE9BQUEsV0FBQSxZQUFBO0dBQ0EsT0FBQSxNQUFBLFFBQUEsU0FBQTtNQUNBLE1BQUE7TUFDQSxnQkFBQTtNQUNBLFFBQUE7T0FDQSxLQUFBO09BQ0EsT0FBQTtPQUNBLFFBQUE7T0FDQSxNQUFBOztNQUVBLEdBQUEsVUFBQSxHQUFBO09BQ0EsT0FBQSxFQUFBOztNQUVBLEdBQUEsVUFBQSxHQUFBO09BQ0EsT0FBQSxFQUFBOztNQUVBLFdBQUE7TUFDQSxZQUFBO01BQ0EsV0FBQTtNQUNBLG9CQUFBO01BQ0EseUJBQUE7OztNQUdBLE9BQUE7T0FDQSxXQUFBOztNQUVBLE9BQUE7T0FDQSxXQUFBO09BQ0EsbUJBQUE7O01BRUEsUUFBQTtPQUNBLFlBQUE7O01BRUEsT0FBQTtPQUNBLGFBQUE7Ozs7R0FJQSxHQUFBLE9BQUEsUUFBQSxVQUFBLE9BQUE7SUFDQSxPQUFBLE1BQUEsUUFBQSxNQUFBLFVBQUEsQ0FBQSxTQUFBLE9BQUEsTUFBQSxLQUFBLE9BQUEsTUFBQTs7R0FFQSxPQUFBLE9BQUE7O0VBRUEsT0FBQSxpQkFBQSxZQUFBO0dBQ0EsSUFBQSxZQUFBO0dBQ0EsT0FBQSxRQUFBO0lBQ0EsSUFBQTtJQUNBLElBQUE7O0dBRUEsUUFBQSxRQUFBLE9BQUEsV0FBQSxVQUFBLE1BQUEsS0FBQTtJQUNBLElBQUEsUUFBQTtLQUNBLElBQUE7S0FDQSxLQUFBLEtBQUE7S0FDQSxPQUFBLEtBQUE7S0FDQSxRQUFBOztJQUVBLFFBQUEsUUFBQSxPQUFBLE1BQUEsVUFBQSxNQUFBLEdBQUE7S0FDQSxNQUFBLE9BQUEsS0FBQTtNQUNBLElBQUE7TUFDQSxHQUFBLEtBQUEsS0FBQSxPQUFBO01BQ0EsR0FBQSxLQUFBLEtBQUEsT0FBQTs7S0FFQSxPQUFBLE1BQUEsTUFBQSxLQUFBLElBQUEsT0FBQSxNQUFBLEtBQUEsS0FBQSxLQUFBLE9BQUE7S0FDQSxPQUFBLE1BQUEsTUFBQSxLQUFBLElBQUEsT0FBQSxNQUFBLEtBQUEsS0FBQSxLQUFBLE9BQUE7O0lBRUEsVUFBQSxLQUFBOzs7R0FHQSxPQUFBLE1BQUEsT0FBQTtHQUNBLEdBQUEsT0FBQSxRQUFBLFVBQUEsT0FBQTtJQUNBLE9BQUEsTUFBQSxRQUFBLE1BQUEsVUFBQSxDQUFBLFNBQUEsT0FBQSxNQUFBLEtBQUEsT0FBQSxNQUFBOzs7RUFHQSxPQUFBLE9BQUEsUUFBQSxVQUFBLEdBQUEsR0FBQTtHQUNBLElBQUEsQ0FBQSxHQUFBO0lBQ0E7O0dBRUEsT0FBQTs7Ozs7O0FDbkdBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxrQkFBQSxVQUFBLGlCQUFBLENBQUEsZUFBQSxTQUFBLGFBQUE7O0VBRUEsSUFBQSxTQUFBO1FBQ0EsSUFBQSxTQUFBOztRQUVBLFNBQUEsTUFBQSxJQUFBO1lBQ0EsSUFBQSxLQUFBLEdBQUEsR0FBQSxhQUFBO1lBQ0EsSUFBQSxDQUFBLElBQUE7Z0JBQ0EsS0FBQSxFQUFBO2dCQUNBLEdBQUEsR0FBQSxhQUFBLHFCQUFBOztZQUVBLE9BQUE7O1FBRUEsU0FBQSxTQUFBLElBQUE7WUFDQSxJQUFBLFFBQUEsT0FBQTtZQUNBLElBQUEsQ0FBQSxPQUFBO2dCQUNBLFFBQUE7Z0JBQ0EsT0FBQSxNQUFBOztZQUVBLE9BQUE7OztRQUdBLFNBQUEsZUFBQSxTQUFBLE9BQUEsVUFBQSxTQUFBLFFBQUE7WUFDQSxPQUFBLFdBQUE7Z0JBQ0EsTUFBQSxZQUFBO2dCQUNBLE1BQUEsV0FBQTtnQkFDQSxNQUFBLFNBQUE7Z0JBQ0EsU0FBQSxRQUFBLFFBQUEsV0FBQTtvQkFDQSxJQUFBLFdBQUEsTUFBQSxXQUFBLFFBQUE7d0JBQ0EsUUFBQSxHQUFBLE1BQUEsU0FBQTs7b0JBRUEsTUFBQSxZQUFBO29CQUNBLE1BQUEsV0FBQTtvQkFDQSxNQUFBOzs7OztRQUtBLE9BQUE7WUFDQSxPQUFBLFNBQUEsU0FBQSxRQUFBOztvQkFFQSxJQUFBLFFBQUEsU0FBQSxNQUFBO29CQUNBLElBQUEsU0FBQSxDQUFBLE1BQUEsYUFBQSxNQUFBO3dCQUNBLE1BQUEsU0FBQSxRQUFBLEdBQUE7b0JBQ0EsSUFBQSxXQUFBLFlBQUEsU0FBQTt3QkFDQSxNQUFBLENBQUEsUUFBQSxTQUFBLE1BQUEsU0FBQTt3QkFDQSxJQUFBLENBQUEsUUFBQSxPQUFBLFNBQUE7O29CQUVBLElBQUEsVUFBQTt3QkFDQSxJQUFBLE1BQUEsV0FBQTs0QkFDQSxNQUFBOzhCQUNBLGVBQUE7NkNBQ0E7NkNBQ0E7NkNBQ0E7NkNBQ0E7NEJBQ0EsT0FBQSxNQUFBLFNBQUE7OzZCQUVBOzRCQUNBLE1BQUEsU0FBQTs0QkFDQSxPQUFBLGVBQUE7a0RBQ0E7a0RBQ0E7a0RBQ0E7a0RBQ0E7Ozs7Z0JBSUE7O1lBRUEsT0FBQSxTQUFBLFNBQUEsUUFBQTs7b0JBRUEsSUFBQSxRQUFBLFNBQUEsTUFBQTtvQkFDQSxJQUFBLFNBQUEsQ0FBQSxNQUFBLGFBQUEsTUFBQTt3QkFDQSxNQUFBLFNBQUEsUUFBQSxHQUFBOztvQkFFQSxJQUFBLFdBQUEsWUFBQSxTQUFBO3dCQUNBLE1BQUEsQ0FBQSxRQUFBLE9BQUEsU0FBQTt3QkFDQSxJQUFBLENBQUEsUUFBQSxTQUFBLE1BQUEsU0FBQTs7b0JBRUEsSUFBQSxVQUFBO3dCQUNBLElBQUEsTUFBQSxXQUFBOzRCQUNBLE1BQUEsU0FBQSxlQUFBOzBEQUNBOzBEQUNBOzBEQUNBOzBEQUNBOzRCQUNBLE9BQUEsTUFBQSxTQUFBOzs2QkFFQTs0QkFDQSxNQUFBLFNBQUE7NEJBQ0EsT0FBQSxlQUFBO2tEQUNBO2tEQUNBO2tEQUNBO2tEQUNBOzs7O2dCQUlBOzs7Ozs7QUN0R0EsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxRQUFBLG9CQUFBLFlBQUEsbUJBQUEsVUFBQTs7Ozs7O0FDSEEsQ0FBQSxZQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGtCQUFBLFVBQUEsWUFBQTs7Q0FFQSxTQUFBLFVBQUEsQ0FBQSxZQUFBOztDQUVBLFNBQUEsU0FBQSxVQUFBLGNBQUE7RUFDQSxPQUFBO0dBQ0EsVUFBQTtHQUNBLFNBQUE7R0FDQSxPQUFBO0lBQ0EsU0FBQTtJQUNBLFVBQUE7O0dBRUEsWUFBQTtHQUNBLGFBQUE7R0FDQSxNQUFBOzs7RUFHQSxTQUFBLHFCQUFBLFFBQUEsU0FBQSxRQUFBO0dBQ0EsT0FBQSxVQUFBO0tBQ0EsT0FBQTtHQUNBLFNBQUEsU0FBQTtJQUNBLFNBQUEsVUFBQTtNQUNBLGFBQUEsUUFBQSxJQUFBLENBQUEsT0FBQSxLQUFBLFNBQUE7Ozs7Ozs7QUN6QkEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxRQUFBLG9CQUFBLFlBQUEsdURBQUEsU0FBQSxRQUFBLFVBQUEsYUFBQTtFQUNBLE9BQUEsV0FBQTtFQUNBLE9BQUEsaUJBQUE7RUFDQSxPQUFBLGdCQUFBO0VBQ0E7OztFQUdBLFNBQUEsVUFBQTtHQUNBLE9BQUE7R0FDQSxPQUFBO0dBQ0EsT0FBQTtHQUNBLE9BQUEsT0FBQSxZQUFBLFVBQUEsU0FBQSxTQUFBO0lBQ0EsSUFBQSxZQUFBLFNBQUE7S0FDQSxPQUFBOztJQUVBLE9BQUE7SUFDQSxPQUFBOzs7RUFHQSxTQUFBLGVBQUE7SUFDQSxPQUFBLFVBQUEsQ0FBQSxPQUFBLFNBQUE7OztFQUdBLFNBQUEsV0FBQTtHQUNBLE9BQUEsUUFBQTtJQUNBLFNBQUE7S0FDQSxPQUFBO01BQ0EsTUFBQTs7TUFFQSxnQkFBQTtNQUNBLFFBQUE7T0FDQSxLQUFBO09BQ0EsT0FBQTtPQUNBLFFBQUE7T0FDQSxNQUFBOztNQUVBLEdBQUEsVUFBQSxHQUFBO09BQ0EsT0FBQSxFQUFBOztNQUVBLEdBQUEsVUFBQSxHQUFBO09BQ0EsT0FBQSxFQUFBOztNQUVBLFlBQUE7TUFDQSxXQUFBO01BQ0Esb0JBQUE7TUFDQSx5QkFBQTtNQUNBLFFBQUEsQ0FBQSxLQUFBO01BQ0EsT0FBQTtPQUNBLFdBQUE7O01BRUEsT0FBQTtPQUNBLFdBQUE7T0FDQSxtQkFBQTs7TUFFQSxPQUFBO09BQ0EsV0FBQTtPQUNBLE9BQUE7UUFDQSxPQUFBOzs7TUFHQSxNQUFBO09BQ0EsWUFBQTs7OztJQUlBLE1BQUE7O0dBRUEsT0FBQSxPQUFBOzs7RUFHQSxTQUFBLGlCQUFBOztHQUVBLElBQUEsWUFBQTtHQUNBLFFBQUEsUUFBQSxPQUFBLFNBQUEsS0FBQSxVQUFBLFVBQUEsTUFBQSxLQUFBO0lBQ0EsSUFBQSxRQUFBO0tBQ0EsS0FBQSxLQUFBO0tBQ0EsT0FBQSxLQUFBO0tBQ0EsUUFBQTs7SUFFQSxRQUFBLFFBQUEsT0FBQSxRQUFBLEtBQUEsVUFBQSxNQUFBO0tBQ0EsTUFBQSxPQUFBLEtBQUE7TUFDQSxHQUFBLEtBQUE7TUFDQSxHQUFBLEtBQUEsS0FBQTs7O0lBR0EsVUFBQSxLQUFBOztHQUVBLE9BQUEsTUFBQSxPQUFBOzs7Ozs7QUMxRkEsQ0FBQSxZQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGtCQUFBLFVBQUEsWUFBQSxZQUFBOztFQUVBLE9BQUE7R0FDQSxVQUFBOztHQUVBLFlBQUE7R0FDQSxPQUFBO0lBQ0EsTUFBQTs7R0FFQSxNQUFBLFVBQUEsUUFBQSxTQUFBLFFBQUE7SUFDQSxPQUFBO0lBQ0EsT0FBQTtJQUNBLElBQUEsUUFBQTtLQUNBLFNBQUE7S0FDQSxTQUFBLENBQUEsU0FBQTtLQUNBLElBQUEsR0FBQSxNQUFBLFNBQUEsTUFBQSxDQUFBLEdBQUEsSUFBQSxLQUFBO0tBQ0EsSUFBQSxHQUFBLE1BQUEsTUFBQSxTQUFBLEtBQUEsT0FBQSxDQUFBLEdBQUEsSUFBQSxNQUFBLENBQUEsR0FBQTs7O0tBR0EsVUFBQTtLQUNBLFdBQUE7S0FDQSxjQUFBOztJQUVBLElBQUEsTUFBQSxHQUFBLE9BQUEsUUFBQTs7O0lBR0EsSUFBQSxNQUFBLElBQUEsT0FBQTtNQUNBLEtBQUEsU0FBQSxRQUFBLFVBQUE7TUFDQSxLQUFBLFVBQUEsU0FBQSxVQUFBO01BQ0EsT0FBQTtNQUNBLEtBQUEsYUFBQSxlQUFBLENBQUEsU0FBQSxTQUFBLFNBQUEsV0FBQTs7Ozs7Ozs7SUFRQSxJQUFBLFlBQUEsR0FBQSxPQUFBO01BQ0EsS0FBQTtNQUNBLE1BQUEsVUFBQSxHQUFBO01BQ0EsT0FBQSxFQUFBOzs7SUFHQSxJQUFBLE1BQUEsR0FBQSxJQUFBO01BQ0EsV0FBQSxVQUFBLEdBQUE7TUFDQSxPQUFBLEtBQUEsSUFBQSxHQUFBLEtBQUEsSUFBQSxJQUFBLEtBQUEsSUFBQSxFQUFBLEVBQUE7O01BRUEsU0FBQSxVQUFBLEdBQUE7TUFDQSxPQUFBLEtBQUEsSUFBQSxHQUFBLEtBQUEsSUFBQSxJQUFBLEtBQUEsSUFBQSxFQUFBLEVBQUEsSUFBQSxFQUFBOztNQUVBLFlBQUEsVUFBQSxHQUFBO01BQ0EsT0FBQSxLQUFBLElBQUEsR0FBQSxFQUFBLElBQUEsRUFBQSxFQUFBLEtBQUEsRUFBQTs7TUFFQSxZQUFBLFVBQUEsR0FBQTtNQUNBLE9BQUEsS0FBQSxJQUFBLEdBQUEsRUFBQSxFQUFBLElBQUEsRUFBQTs7O0lBR0EsSUFBQSxXQUFBO0tBQ0EsV0FBQTtLQUNBLFdBQUE7S0FDQSxXQUFBOzs7S0FHQSxJQUFBLFFBQUEsVUFBQSxPQUFBLE9BQUE7O0tBRUEsSUFBQSxPQUFBLElBQUEsVUFBQSxRQUFBLEtBQUE7S0FDQSxLQUFBLFFBQUEsT0FBQTtPQUNBLEtBQUEsTUFBQSxVQUFBLEdBQUEsR0FBQTtPQUNBLE9BQUEsVUFBQTs7T0FFQSxLQUFBLEtBQUE7T0FDQSxLQUFBLGFBQUE7T0FDQSxLQUFBLFNBQUEsVUFBQSxHQUFBO09BQ0EsT0FBQSxFQUFBLFFBQUEsV0FBQTs7T0FFQSxNQUFBLFFBQUE7T0FDQSxHQUFBLFNBQUE7O0tBRUEsSUFBQSxPQUFBLElBQUEsVUFBQSxRQUFBLEtBQUE7S0FDQSxJQUFBLFlBQUEsS0FBQSxRQUFBLE9BQUE7T0FDQSxNQUFBLGdCQUFBO09BQ0EsS0FBQSxlQUFBLFVBQUEsR0FBQTtPQUNBLElBQUEsRUFBQTtRQUNBLE9BQUE7OztRQUdBLE9BQUE7O09BRUEsS0FBQSxNQUFBLFVBQUEsR0FBQTtPQUNBLE9BQUEsVUFBQSxFQUFBOztPQUVBLEtBQUEsU0FBQSxVQUFBLEdBQUE7T0FDQSxPQUFBOztPQUVBLEtBQUEsTUFBQSxVQUFBLEdBQUE7T0FDQSxPQUFBLEVBQUEsUUFBQSxTQUFBOztPQUVBLEtBQUEsYUFBQSxVQUFBLEdBQUE7T0FDQSxJQUFBLFlBQUEsQ0FBQSxFQUFBLFFBQUEsSUFBQSxNQUFBLEtBQUEsU0FBQTtRQUNBLGNBQUEsRUFBQSxJQUFBLE1BQUEsSUFBQSxDQUFBO09BQ0EsUUFBQSxFQUFBLEVBQUEsSUFBQSxFQUFBLEtBQUEsS0FBQSxNQUFBLEtBQUEsS0FBQSxNQUFBLFlBQUEsYUFBQTtRQUNBLFNBQUEsU0FBQSxZQUFBLENBQUEsS0FBQTtPQUNBLFNBQUEsQ0FBQSxFQUFBLEVBQUEsS0FBQSxlQUFBO09BQ0EsWUFBQSxRQUFBLEtBQUEsQ0FBQSxNQUFBO09BQ0EsSUFBQSxFQUFBLFFBQUEsWUFBQSxFQUFBLFFBQUEsVUFBQSxVQUFBO09BQ0EsSUFBQSxFQUFBLFNBQUEsR0FBQTtRQUNBLFNBQUEsQ0FBQTtRQUNBLFNBQUE7UUFDQSxXQUFBO2NBQ0EsSUFBQSxFQUFBLFNBQUEsR0FBQSxVQUFBLENBQUE7WUFDQSxJQUFBLEVBQUEsU0FBQSxHQUFBLFVBQUEsQ0FBQTtZQUNBLElBQUEsRUFBQSxTQUFBLEdBQUEsVUFBQTtPQUNBLE9BQUEsWUFBQSxTQUFBLGdCQUFBLFNBQUEsYUFBQSxXQUFBOztPQUVBLEdBQUEsU0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztLQStCQSxVQUFBLE9BQUE7T0FDQSxLQUFBLEtBQUE7T0FDQSxLQUFBLFVBQUEsR0FBQTs7T0FFQSxJQUFBLEVBQUEsU0FBQSxLQUFBLEVBQUEsUUFBQSxZQUFBLEVBQUEsUUFBQSxZQUFBLEVBQUEsUUFBQSxZQUFBLEVBQUEsUUFBQTtRQUNBLE9BQUEsRUFBQSxLQUFBLE1BQUEsS0FBQSxLQUFBLE9BQUEsRUFBQSxLQUFBLE1BQUEsS0FBQSxNQUFBOztRQUVBLE9BQUEsRUFBQSxLQUFBLE1BQUEsS0FBQTs7S0FFQSxVQUFBLE9BQUE7T0FDQSxLQUFBLEtBQUE7T0FDQSxLQUFBLE1BQUE7T0FDQSxLQUFBLFVBQUEsR0FBQTs7T0FFQSxJQUFBLEVBQUEsU0FBQSxLQUFBLEVBQUEsUUFBQSxZQUFBLEVBQUEsUUFBQSxZQUFBLEVBQUEsUUFBQSxZQUFBLEVBQUEsUUFBQTtRQUNBLE9BQUEsQ0FBQSxFQUFBLEtBQUEsTUFBQSxLQUFBLE1BQUEsTUFBQSxPQUFBLEVBQUEsS0FBQSxNQUFBLEtBQUEsTUFBQTs7UUFFQSxPQUFBLENBQUEsRUFBQSxLQUFBLE1BQUEsS0FBQSxNQUFBLE1BQUEsT0FBQSxFQUFBLEtBQUEsTUFBQSxLQUFBLE1BQUE7O0tBRUEsVUFBQSxPQUFBO09BQ0EsS0FBQSxLQUFBO09BQ0EsS0FBQSxNQUFBO09BQ0EsS0FBQSxVQUFBLEdBQUE7T0FDQSxJQUFBLEVBQUEsU0FBQSxLQUFBLEVBQUEsUUFBQSxZQUFBLEVBQUEsUUFBQSxZQUFBLEVBQUEsUUFBQSxZQUFBLEVBQUEsUUFBQTtRQUNBLE9BQUEsQ0FBQSxFQUFBLEtBQUEsTUFBQSxLQUFBLE1BQUEsTUFBQSxPQUFBLEVBQUEsS0FBQSxNQUFBLEtBQUEsTUFBQTs7UUFFQSxPQUFBLENBQUEsRUFBQSxLQUFBLE1BQUEsS0FBQSxNQUFBLE1BQUEsT0FBQSxFQUFBLEtBQUEsTUFBQSxLQUFBLE1BQUEsSUFBQTs7O0tBR0EsU0FBQSxNQUFBLEdBQUE7O01BRUEsS0FBQTtRQUNBLFNBQUE7UUFDQSxVQUFBLEtBQUEsU0FBQTs7OztNQUlBLEtBQUEsTUFBQSxjQUFBLFVBQUEsR0FBQTtRQUNBLE9BQUEsV0FBQSxHQUFBLEtBQUEsT0FBQSxHQUFBLE9BQUEsTUFBQSxNQUFBOztRQUVBO1FBQ0EsU0FBQTtRQUNBLFVBQUEsZUFBQSxVQUFBLEdBQUE7UUFDQSxPQUFBLFlBQUE7U0FDQSxJQUFBLEVBQUE7VUFDQSxPQUFBOzs7VUFHQSxPQUFBOzs7UUFHQSxVQUFBLGFBQUEsVUFBQSxHQUFBO1FBQ0EsSUFBQSxZQUFBLENBQUEsRUFBQSxRQUFBLElBQUEsTUFBQSxLQUFBLFNBQUE7UUFDQSxPQUFBLFlBQUE7U0FDQSxJQUFBLFlBQUEsQ0FBQSxFQUFBLFFBQUEsSUFBQSxNQUFBLEtBQUEsU0FBQTtVQUNBLGNBQUEsRUFBQSxJQUFBLE1BQUEsSUFBQSxDQUFBO1NBQ0EsUUFBQSxFQUFBLEVBQUEsSUFBQSxFQUFBLEtBQUEsS0FBQSxNQUFBLEtBQUEsS0FBQSxNQUFBLFlBQUEsYUFBQTtVQUNBLFNBQUEsU0FBQSxZQUFBLENBQUEsS0FBQTtTQUNBLFNBQUEsQ0FBQSxFQUFBLEVBQUEsS0FBQSxlQUFBO1NBQ0EsWUFBQSxRQUFBLEtBQUEsQ0FBQSxNQUFBO1NBQ0EsSUFBQSxFQUFBLFFBQUEsWUFBQSxFQUFBLFFBQUEsVUFBQSxVQUFBO1NBQ0EsSUFBQSxFQUFBLFNBQUEsR0FBQTtVQUNBLFNBQUEsQ0FBQTtVQUNBLFNBQUE7VUFDQSxXQUFBO2dCQUNBLElBQUEsRUFBQSxTQUFBLEdBQUEsVUFBQSxDQUFBO2NBQ0EsSUFBQSxFQUFBLFNBQUEsR0FBQSxVQUFBLENBQUE7Y0FDQSxJQUFBLEVBQUEsU0FBQSxHQUFBLFVBQUE7U0FDQSxPQUFBLFlBQUEsU0FBQSxnQkFBQSxTQUFBLGFBQUEsV0FBQTs7O1FBR0EsTUFBQSxnQkFBQSxVQUFBLEdBQUE7UUFDQSxPQUFBLFdBQUEsR0FBQSxLQUFBLElBQUE7O1FBRUEsS0FBQSxPQUFBLFVBQUEsR0FBQTtRQUNBLEdBQUEsT0FBQSxNQUFBLE1BQUEsY0FBQSxXQUFBLEdBQUEsS0FBQSxPQUFBOzs7OztJQUtBLFNBQUEsV0FBQSxHQUFBLEdBQUE7S0FDQSxJQUFBLE1BQUEsR0FBQSxPQUFBO0tBQ0EsSUFBQSxFQUFBLFVBQUE7TUFDQSxPQUFBLEVBQUEsU0FBQSxLQUFBLFVBQUEsR0FBQTtPQUNBLE9BQUEsV0FBQSxHQUFBOzs7S0FHQSxPQUFBOzs7SUFHQSxTQUFBLFNBQUEsR0FBQTtLQUNBLE9BQUEsRUFBQTtLQUNBLElBQUEsRUFBQTtNQUNBLE9BQUEsRUFBQTtVQUNBO01BQ0EsSUFBQSxZQUFBOztNQUVBLElBQUEsSUFBQTtNQUNBLE9BQUEsRUFBQSxPQUFBLFNBQUEsTUFBQTtPQUNBO01BQ0EsSUFBQSxhQUFBLENBQUEsYUFBQSxJQUFBLElBQUE7TUFDQSxPQUFBLE9BQUEsTUFBQSxFQUFBLE9BQUEsT0FBQSxLQUFBLFlBQUEsS0FBQTs7Ozs7SUFLQSxTQUFBLFNBQUEsR0FBQTtLQUNBLElBQUEsS0FBQSxLQUFBO01BQ0EsS0FBQSxHQUFBLFlBQUEsRUFBQSxVQUFBLENBQUEsRUFBQSxHQUFBLEVBQUEsSUFBQSxFQUFBLEtBQUE7TUFDQSxLQUFBLEdBQUEsWUFBQSxFQUFBLFVBQUEsQ0FBQSxFQUFBLEdBQUE7TUFDQSxLQUFBLEdBQUEsWUFBQSxFQUFBLFNBQUEsQ0FBQSxFQUFBLElBQUEsS0FBQSxHQUFBOztLQUVBLE9BQUEsVUFBQSxHQUFBO01BQ0EsT0FBQSxVQUFBLEdBQUE7T0FDQSxFQUFBLE9BQUEsR0FBQTtPQUNBLEVBQUEsT0FBQSxHQUFBLElBQUEsTUFBQSxHQUFBO09BQ0EsT0FBQSxJQUFBOzs7OztJQUtBLFNBQUEsS0FBQSxHQUFBO0tBQ0EsT0FBQSxFQUFBLFdBQUEsS0FBQSxJQUFBLE1BQUEsTUFBQSxFQUFBLFNBQUEsSUFBQSxTQUFBLEVBQUEsSUFBQSxFQUFBOzs7Ozs7O0FDL1FBLENBQUEsWUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLDJCQUFBLFVBQUEsUUFBQTs7RUFFQSxPQUFBLFdBQUEsWUFBQTtHQUNBLE9BQUEsUUFBQTtJQUNBLFNBQUE7S0FDQSxPQUFBO01BQ0EsTUFBQTtNQUNBLFFBQUE7TUFDQSxZQUFBO09BQ0EsWUFBQTtPQUNBLFNBQUE7T0FDQSxVQUFBO09BQ0EsUUFBQTtPQUNBLE1BQUE7T0FDQSxZQUFBO09BQ0EsVUFBQTtRQUNBLE9BQUE7UUFDQSxTQUFBO1FBQ0EsVUFBQTtRQUNBLFFBQUE7OztNQUdBLFdBQUE7T0FDQSxZQUFBO09BQ0EsV0FBQTtPQUNBLFlBQUE7T0FDQSxnQkFBQTtPQUNBLFdBQUE7T0FDQSxrQkFBQTtPQUNBLFlBQUE7T0FDQSxXQUFBO09BQ0EsYUFBQTtPQUNBLGlCQUFBOztPQUVBLFVBQUE7UUFDQSxRQUFBO1FBQ0EsT0FBQTs7T0FFQSxVQUFBO09BQ0EsUUFBQTtPQUNBLGVBQUE7T0FDQSxNQUFBOzs7O0lBSUEsTUFBQTs7R0FFQSxPQUFBLE9BQUE7O0VBRUEsSUFBQSxZQUFBLFVBQUEsTUFBQTtHQUNBLElBQUEsV0FBQTtHQUNBLFFBQUEsUUFBQSxNQUFBLFVBQUEsTUFBQTtJQUNBLElBQUEsUUFBQTtLQUNBLFFBQUEsS0FBQTtLQUNBLFFBQUEsS0FBQTtLQUNBLFNBQUEsS0FBQTtLQUNBLFlBQUEsVUFBQSxLQUFBOztJQUVBLEdBQUEsS0FBQSxNQUFBO0tBQ0EsTUFBQSxRQUFBLEtBQUE7O0lBRUEsR0FBQSxLQUFBLEtBQUE7S0FDQSxNQUFBLE9BQUEsS0FBQTs7SUFFQSxTQUFBLEtBQUE7O0dBRUEsT0FBQTs7RUFFQSxPQUFBLGlCQUFBLFlBQUE7R0FDQSxJQUFBLFlBQUE7SUFDQSxRQUFBLE9BQUEsS0FBQTtJQUNBLFNBQUEsT0FBQSxLQUFBO0lBQ0EsWUFBQSxVQUFBLE9BQUEsS0FBQTtJQUNBLFFBQUE7O0dBRUEsT0FBQSxNQUFBLE9BQUE7R0FDQSxPQUFBOztFQUVBLE9BQUEsT0FBQSxRQUFBLFVBQUEsR0FBQSxHQUFBO0dBQ0EsSUFBQSxDQUFBLEdBQUE7SUFDQTs7R0FFQSxPQUFBOzs7OztBQUtBIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHR2YXIgYXBwID0gYW5ndWxhci5tb2R1bGUoJ2FwcCcsXG5cdFx0W1xuXHRcdCdhcHAuY29udHJvbGxlcnMnLFxuXHRcdCdhcHAuZmlsdGVycycsXG5cdFx0J2FwcC5zZXJ2aWNlcycsXG5cdFx0J2FwcC5kaXJlY3RpdmVzJyxcblx0XHQnYXBwLnJvdXRlcycsXG5cdFx0J2FwcC5jb25maWcnLFxuXHRcdF0pO1xuXG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5yb3V0ZXMnLCBbJ3VpLnJvdXRlcicsICduZ1N0b3JhZ2UnLCAnc2F0ZWxsaXplciddKTtcblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycsIFsnc21vb3RoU2Nyb2xsJywndWkucm91dGVyJywgJ25nTWF0ZXJpYWwnLCAnbmdTdG9yYWdlJywgJ3Jlc3Rhbmd1bGFyJywgJ25nTWRJY29ucycsICdhbmd1bGFyLWxvYWRpbmctYmFyJywgJ25nTWVzc2FnZXMnLCAnbmdTYW5pdGl6ZScsIFwibGVhZmxldC1kaXJlY3RpdmVcIiwnbnZkMycsICduZ0NzdkltcG9ydCcsJ3N0aWNreSddKTtcblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5maWx0ZXJzJywgW10pO1xuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLnNlcnZpY2VzJywgWyd1aS5yb3V0ZXInLCAnbmdTdG9yYWdlJywgJ3Jlc3Rhbmd1bGFyJ10pO1xuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmRpcmVjdGl2ZXMnLCBbJ3Ntb290aFNjcm9sbCddKTtcblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb25maWcnLCBbXSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5yb3V0ZXMnKS5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlcil7XG5cblx0XHR2YXIgZ2V0VmlldyA9IGZ1bmN0aW9uKHZpZXdOYW1lKXtcblx0XHRcdHJldHVybiAnL3ZpZXdzL2FwcC8nICsgdmlld05hbWUgKyAnLycgKyB2aWV3TmFtZSArICcuaHRtbCc7XG5cdFx0fTtcblxuXHRcdCR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UoJy9lcGknKTtcblxuXHRcdCRzdGF0ZVByb3ZpZGVyXG5cdFx0XHQuc3RhdGUoJ2FwcCcsIHtcblx0XHRcdFx0YWJzdHJhY3Q6IHRydWUsXG5cdFx0XHRcdHZpZXdzOiB7XG5cdFx0XHRcdC8qXHRzaWRlYmFyOiB7XG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogZ2V0Vmlldygnc2lkZWJhcicpXG5cdFx0XHRcdFx0fSwqL1xuXHRcdFx0XHRcdGhlYWRlcjoge1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6IGdldFZpZXcoJ2hlYWRlcicpXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRtYWluOiB7fVxuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdFx0LnN0YXRlKCdhcHAuZXBpJywge1xuXHRcdFx0XHR1cmw6ICcvZXBpJyxcblx0XHRcdFx0dmlld3M6IHtcblx0XHRcdFx0XHQnbWFpbkAnOiB7XG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogZ2V0VmlldygnZXBpJyksXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiAnRXBpQ3RybCcsXG5cdFx0XHRcdFx0XHRyZXNvbHZlOntcblx0XHRcdFx0XHRcdFx0RVBJOiBmdW5jdGlvbihEYXRhU2VydmljZSl7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIERhdGFTZXJ2aWNlLmdldEFsbCgnL2VwaS95ZWFyLzIwMTQnKVxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHQnbWFwQCc6e1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6IGdldFZpZXcoJ21hcCcpXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdFx0LnN0YXRlKCdhcHAuZXBpLnNlbGVjdGVkJyx7XG5cdFx0XHRcdHVybDogJy86aXRlbSdcblx0XHRcdH0pXG5cdFx0XHQuc3RhdGUoJ2FwcC5pbXBvcnRjc3YnLCB7XG5cdFx0XHRcdHVybDogJy9pbXBvcnRlcicsXG5cdFx0XHRcdGRhdGE6IHtwYWdlTmFtZTogJ0ltcG9ydCBDU1YnfSxcblx0XHRcdFx0dmlld3M6IHtcblx0XHRcdFx0XHQnbWFpbkAnOiB7XG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogZ2V0VmlldygnaW1wb3J0Y3N2Jylcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdCdtYXAnOnt9XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXG5cblxuXHR9KTtcbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5yb3V0ZXMnKS5ydW4oZnVuY3Rpb24oJHJvb3RTY29wZSl7XG5cdFx0JHJvb3RTY29wZS4kb24oXCIkc3RhdGVDaGFuZ2VTdGFydFwiLCBmdW5jdGlvbihldmVudCwgdG9TdGF0ZSl7XG5cdFx0XHRpZiAodG9TdGF0ZS5kYXRhICYmIHRvU3RhdGUuZGF0YS5wYWdlTmFtZSl7XG5cdFx0XHRcdCRyb290U2NvcGUuY3VycmVudF9wYWdlID0gdG9TdGF0ZS5kYXRhLnBhZ2VOYW1lO1xuXHRcdFx0fVxuXHRcdFx0ICRyb290U2NvcGUuc3RhdGVJc0xvYWRpbmcgPSB0cnVlO1xuXHRcdH0pO1xuXHRcdCRyb290U2NvcGUuJG9uKFwiJHN0YXRlQ2hhbmdlU3VjY2Vzc1wiLCBmdW5jdGlvbihldmVudCwgdG9TdGF0ZSl7XG5cdFx0XHQgJHJvb3RTY29wZS5zdGF0ZUlzTG9hZGluZyA9IGZhbHNlO1xuXHRcdH0pO1xuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbiAoKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29uZmlnJykuY29uZmlnKGZ1bmN0aW9uICgkYXV0aFByb3ZpZGVyKXtcbiAgICAgICAgLy8gU2F0ZWxsaXplciBjb25maWd1cmF0aW9uIHRoYXQgc3BlY2lmaWVzIHdoaWNoIEFQSVxuICAgICAgICAvLyByb3V0ZSB0aGUgSldUIHNob3VsZCBiZSByZXRyaWV2ZWQgZnJvbVxuICAgICAgICAkYXV0aFByb3ZpZGVyLmxvZ2luVXJsID0gJy9hcGkvMS9hdXRoZW50aWNhdGUvYXV0aCc7XG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29uZmlnJykuY29uZmlnKGZ1bmN0aW9uIChjZnBMb2FkaW5nQmFyUHJvdmlkZXIpe1xuXHRcdGNmcExvYWRpbmdCYXJQcm92aWRlci5pbmNsdWRlU3Bpbm5lciA9IGZhbHNlO1xuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbmZpZycpLmNvbmZpZyggZnVuY3Rpb24oUmVzdGFuZ3VsYXJQcm92aWRlcikge1xuXHRcdFJlc3Rhbmd1bGFyUHJvdmlkZXJcblx0XHQuc2V0QmFzZVVybCgnL2FwaS8xLycpO1xuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbmZpZycpLmNvbmZpZyhmdW5jdGlvbigkbWRUaGVtaW5nUHJvdmlkZXIpIHtcblx0XHQvKiBGb3IgbW9yZSBpbmZvLCB2aXNpdCBodHRwczovL21hdGVyaWFsLmFuZ3VsYXJqcy5vcmcvIy9UaGVtaW5nLzAxX2ludHJvZHVjdGlvbiAqL1xuXHRcdCRtZFRoZW1pbmdQcm92aWRlci50aGVtZSgnZGVmYXVsdCcpXG5cdFx0LnByaW1hcnlQYWxldHRlKCdpbmRpZ28nKVxuXHRcdC5hY2NlbnRQYWxldHRlKCdncmV5Jylcblx0XHQud2FyblBhbGV0dGUoJ3JlZCcpO1xuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmZpbHRlcnMnKS5maWx0ZXIoICdjYXBpdGFsaXplJywgZnVuY3Rpb24oKXtcblx0XHRyZXR1cm4gZnVuY3Rpb24oaW5wdXQsIGFsbCkge1xuXHRcdFx0cmV0dXJuICghIWlucHV0KSA/IGlucHV0LnJlcGxhY2UoLyhbXlxcV19dK1teXFxzLV0qKSAqL2csZnVuY3Rpb24odHh0KXtcblx0XHRcdFx0cmV0dXJuIHR4dC5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHR4dC5zdWJzdHIoMSkudG9Mb3dlckNhc2UoKTtcblx0XHRcdH0pIDogJyc7XG5cdFx0fTtcblx0fSk7XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZmlsdGVycycpLmZpbHRlciggJ2h1bWFuUmVhZGFibGUnLCBmdW5jdGlvbigpe1xuXHRcdHJldHVybiBmdW5jdGlvbiBodW1hbml6ZShzdHIpIHtcblx0XHRcdGlmICggIXN0ciApe1xuXHRcdFx0XHRyZXR1cm4gJyc7XG5cdFx0XHR9XG5cdFx0XHR2YXIgZnJhZ3MgPSBzdHIuc3BsaXQoJ18nKTtcblx0XHRcdGZvciAodmFyIGk9MDsgaTxmcmFncy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRmcmFnc1tpXSA9IGZyYWdzW2ldLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgZnJhZ3NbaV0uc2xpY2UoMSk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gZnJhZ3Muam9pbignICcpO1xuXHRcdH07XG5cdH0pO1xufSkoKTsiLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5maWx0ZXJzJykuZmlsdGVyKCAndHJ1c3RIdG1sJywgZnVuY3Rpb24oICRzY2UgKXtcblx0XHRyZXR1cm4gZnVuY3Rpb24oIGh0bWwgKXtcblx0XHRcdHJldHVybiAkc2NlLnRydXN0QXNIdG1sKGh0bWwpO1xuXHRcdH07XG5cdH0pO1xufSkoKTsiLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5maWx0ZXJzJykuZmlsdGVyKCd1Y2ZpcnN0JywgZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uKCBpbnB1dCApIHtcblx0XHRcdGlmICggIWlucHV0ICl7XG5cdFx0XHRcdHJldHVybiBudWxsO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGlucHV0LnN1YnN0cmluZygwLCAxKS50b1VwcGVyQ2FzZSgpICsgaW5wdXQuc3Vic3RyaW5nKDEpO1xuXHRcdH07XG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLnNlcnZpY2VzJykuZmFjdG9yeSgnRGF0YVNlcnZpY2UnLCBEYXRhU2VydmljZSk7XG4gICAgRGF0YVNlcnZpY2UuJGluamVjdCA9IFsnUmVzdGFuZ3VsYXInXTtcblxuICAgIGZ1bmN0aW9uIERhdGFTZXJ2aWNlKFJlc3Rhbmd1bGFyKXtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBnZXRBbGw6IGdldEFsbCxcbiAgICAgICAgICBnZXRPbmU6IGdldE9uZVxuICAgICAgICB9O1xuXG4gICAgICAgIGZ1bmN0aW9uIGdldEFsbChyb3V0ZSl7XG4gICAgICAgICAgdmFyIGRhdGEgPSBSZXN0YW5ndWxhci5hbGwocm91dGUpLmdldExpc3QoKTtcbiAgICAgICAgICAgIGRhdGEudGhlbihmdW5jdGlvbigpe30sIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgIGFsZXJ0KCdlcnJvcicpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBnZXRPbmUocm91dGUsIGlkKXtcbiAgICAgICAgICByZXR1cm4gUmVzdGFuZ3VsYXIub25lKHJvdXRlLCBpZCkuZ2V0KCk7XG4gICAgICAgIH1cbiAgICB9XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuc2VydmljZXMnKS5mYWN0b3J5KCdJbmRleFNlcnZpY2UnLCBmdW5jdGlvbigpe1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGdldEVwaTogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgIFx0XHRcdCBuYW1lOidFUEknLFxuICAgICAgICBcdFx0XHQgZnVsbF9uYW1lOiAnRW52aXJvbm1lbnQgUGVyZm9ybWFuY2UgSW5kZXgnLFxuICAgICAgICBcdFx0XHQgdGFibGU6ICdlcGknLFxuICAgICAgICBcdFx0XHQgYWxsQ291bnRyaWVzOiAneWVzJyxcbiAgICAgICAgXHRcdFx0IGNvdW50cmllczogW10sXG4gICAgICAgIFx0XHRcdCBzY29yZV9maWVsZF9uYW1lOiAnc2NvcmUnLFxuICAgICAgICBcdFx0XHQgY2hhbmdlX2ZpZWxkX25hbWU6ICdwZXJjZW50X2NoYW5nZScsXG4gICAgICAgIFx0XHRcdCBvcmRlcl9maWVsZDogJ3llYXInLFxuICAgICAgICBcdFx0XHQgY291bnRyaWVzX2lkX2ZpZWxkOiAnY291bnRyeV9pZCcsXG4gICAgICAgIFx0XHRcdCBjb3VudHJpZXNfaXNvX2ZpZWxkOiAnaXNvJyxcbiAgICAgICAgICAgICAgIGNvbG9yOiAnIzM5MzYzNScsXG4gICAgICAgICAgICAgICBzaXplOjEsXG4gICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogJzxwPlRoZSBFbnZpcm9ubWVudGFsIFBlcmZvcm1hbmNlIEluZGV4IChFUEkpIHJhbmtzIGhvdyB3ZWxsIGNvdW50cmllcyBwZXJmb3JtIG9uIGhpZ2gtcHJpb3JpdHkgZW52aXJvbm1lbnRhbCBpc3N1ZXMgaW4gdHdvIGJyb2FkIHBvbGljeSBhcmVhczogcHJvdGVjdGlvbiBvZiBodW1hbiBoZWFsdGggZnJvbSBlbnZpcm9ubWVudGFsIGhhcm0gYW5kIHByb3RlY3Rpb24gb2YgZWNvc3lzdGVtcy48L3A+PHA+VGhlIEVudmlyb25tZW50YWwgUGVyZm9ybWFuY2UgSW5kZXggKEVQSSkgaXMgY29uc3RydWN0ZWQgdGhyb3VnaCB0aGUgY2FsY3VsYXRpb24gYW5kIGFnZ3JlZ2F0aW9uIG9mIDIwIGluZGljYXRvcnMgcmVmbGVjdGluZyBuYXRpb25hbC1sZXZlbCBlbnZpcm9ubWVudGFsIGRhdGEuIFRoZXNlIGluZGljYXRvcnMgYXJlIGNvbWJpbmVkIGludG8gbmluZSBpc3N1ZSBjYXRlZ29yaWVzLCBlYWNoIG9mIHdoaWNoIGZpdCB1bmRlciBvbmUgb2YgdHdvIG92ZXJhcmNoaW5nIG9iamVjdGl2ZXMuPC9wPicsXG4gICAgICAgICAgICAgICBjYXB0aW9uOiAnVGhlIDIwMTQgRVBJIEZyYW1ld29yayBpbmNsdWRlcyA5IGlzc3VlcyBhbmQgMjAgaW5kaWNhdG9ycy4gQWNjZXNzIHRvIEVsZWN0cmljaXR5IGlzIG5vdCBpbmNsdWRlZCBpbiB0aGUgZmlndXJlIGJlY2F1c2UgaXQgaXMgbm90IHVzZWQgdG8gY2FsY3VsYXRlIGNvdW50cnkgc2NvcmVzLiBDbGljayBvbiB0aGUgaW50ZXJhY3RpdmUgZmlndXJlIGFib3ZlIHRvIGV4cGxvcmUgdGhlIEVQSSBmcmFtZXdvcmsuJyxcbiAgICAgICAgICAgICAgIGNoaWxkcmVuOlt7XG4gICAgICAgIFx0XHRcdFx0IGNvbHVtbl9uYW1lOiAnZWgnLFxuICAgICAgICBcdFx0XHRcdCB0aXRsZTogJ0Vudmlyb21lbnRhbCBIZWFsdGgnLFxuICAgICAgICBcdFx0XHRcdCByYW5nZTpbMCwgMTAwXSxcbiAgICAgICAgXHRcdFx0XHQgaWNvbjonJyxcbiAgICAgICAgXHRcdFx0XHQgY29sb3I6JyNjYzNmMTYnLFxuICAgICAgICBcdFx0XHRcdCBjaGlsZHJlbjpbe1xuICAgICAgICBcdFx0XHRcdFx0IGNvbHVtbl9uYW1lOidlaF9oaScsXG4gICAgICAgIFx0XHRcdFx0XHQgdGl0bGU6J0hlYWx0aCBJbXBhY3QnLFxuICAgICAgICBcdFx0XHRcdFx0IGljb246ICdtYW4nLFxuICAgICAgICBcdFx0XHRcdFx0IHVuaWNvZGU6ICdcXHVlNjA1JyxcbiAgICAgICAgXHRcdFx0XHRcdCBjb2xvcjogJyNmMzk0MTknLFxuICAgICAgICBcdFx0XHRcdFx0IGNoaWxkcmVuOlt7XG4gICAgICAgIFx0XHRcdFx0XHRcdCBjb2x1bW5fbmFtZTogJ2VoX2hpX2NoaWxkX21vcnRhbGl0eScsXG4gICAgICAgIFx0XHRcdFx0XHRcdCB0aXRsZTonQ2hpbGQgTW9ydGFsaXR5JyxcbiAgICAgICAgICAgICAgICAgICAgIHNpemU6NjA3NCxcbiAgICAgICAgXHRcdFx0XHRcdFx0IGljb246JycsXG4gICAgICAgIFx0XHRcdFx0XHRcdCBjb2xvcjonI2Y3YTkzNycsXG4gICAgICAgIFx0XHRcdFx0XHRcdCBkZXNjcmlwdGlvbjonUHJvYmFiaWxpdHkgb2YgZHlpbmcgYmV0d2VlbiBhIGNoaWxkcyBmaXJzdCBhbmQgZmlmdGggYmlydGhkYXlzIChiZXR3ZWVuIGFnZSAxIGFuZCA1KSdcbiAgICAgICAgXHRcdFx0XHRcdCB9XVxuICAgICAgICBcdFx0XHRcdCB9LHtcbiAgICAgICAgXHRcdFx0XHRcdCBjb2x1bW5fbmFtZTonZWhfYXEnLFxuICAgICAgICBcdFx0XHRcdFx0IHRpdGxlOidBaXIgUXVhbGl0eScsXG4gICAgICAgIFx0XHRcdFx0XHQgY29sb3I6ICcjZjZjNzBhJyxcbiAgICAgICAgXHRcdFx0XHRcdCBpY29uOiAnc2luaycsXG4gICAgICAgIFx0XHRcdFx0XHQgdW5pY29kZTogJ1xcdWU2MDQnLFxuICAgICAgICBcdFx0XHRcdFx0IGNoaWxkcmVuOlt7XG4gICAgICAgIFx0XHRcdFx0XHRcdCBjb2x1bW5fbmFtZTogJ2VoX2FxX2hvdXNlaG9sZF9haXJfcXVhbGl0eScsXG4gICAgICAgIFx0XHRcdFx0XHRcdCB0aXRsZTonSG91c2Vob2xkIEFpciBRdWFsaXR5JyxcbiAgICAgICAgICAgICAgICAgICAgIHNpemU6MjAwMyxcbiAgICAgICAgXHRcdFx0XHRcdFx0IGljb246JycsXG4gICAgICAgIFx0XHRcdFx0XHRcdCBjb2xvcjonI2ZhZDMzZCcsXG4gICAgICAgIFx0XHRcdFx0XHRcdCBkZXNjcmlwdGlvbjonUGVyY2VudGFnZSBvZiB0aGUgcG9wdWxhdGlvbiB1c2luZyBzb2xpZCBmdWVscyBhcyBwcmltYXJ5IGNvb2tpbmcgZnVlbC4nXG4gICAgICAgIFx0XHRcdFx0XHQgfSx7XG4gICAgICAgIFx0XHRcdFx0XHRcdCBjb2x1bW5fbmFtZTogJ2VoX2FxX2V4cG9zdXJlX3BtMjUnLFxuICAgICAgICBcdFx0XHRcdFx0XHQgdGl0bGU6J0FpciBQb2xsdXRpb24gLSBBdmVyYWdlIEV4cG9zdXJlIHRvIFBNMi41JyxcbiAgICAgICAgICAgICAgICAgICAgIHNpemU6MjAwMyxcbiAgICAgICAgXHRcdFx0XHRcdFx0IGljb246JycsXG4gICAgICAgIFx0XHRcdFx0XHRcdCBjb2xvcjonI2ZhZGQ2YycsXG4gICAgICAgIFx0XHRcdFx0XHRcdCBkZXNjcmlwdGlvbjonUG9wdWxhdGlvbiB3ZWlnaHRlZCBleHBvc3VyZSB0byBQTTIuNSAodGhyZWUtIHllYXIgYXZlcmFnZSknXG4gICAgICAgIFx0XHRcdFx0XHQgfSx7XG4gICAgICAgIFx0XHRcdFx0XHRcdCBjb2x1bW5fbmFtZTogJ2VoX2FxX2V4Y2VlZGFuY2VfcG0yNScsXG4gICAgICAgIFx0XHRcdFx0XHRcdCB0aXRsZTonQWlyIFBvbGx1dGlvbiAtIFBNMi41IEV4Y2VlZGFuY2UnLFxuICAgICAgICAgICAgICAgICAgICAgc2l6ZToyMDAzLFxuICAgICAgICBcdFx0XHRcdFx0XHQgaWNvbjonJyxcbiAgICAgICAgXHRcdFx0XHRcdFx0IGNvbG9yOicjZmRlOTljJyxcbiAgICAgICAgXHRcdFx0XHRcdFx0IGRlc2NyaXB0aW9uOidQcm9wb3J0aW9uIG9mIHRoZSBwb3B1bGF0aW9uIHdob3NlIGV4cG9zdXJlIGlzIGFib3ZlICBXSE8gdGhyZXNob2xkcyAoMTAsIDE1LCAyNSwgMzUgbWljcm9ncmFtcy9tMyknXG4gICAgICAgIFx0XHRcdFx0XHQgfV1cbiAgICAgICAgXHRcdFx0XHQgfSx7XG4gICAgICAgIFx0XHRcdFx0XHQgY29sdW1uX25hbWU6J2VoX3dzJyxcbiAgICAgICAgXHRcdFx0XHRcdCB0aXRsZTonV2F0ZXIgU2FuaXRhdGlvbicsXG4gICAgICAgIFx0XHRcdFx0XHQgY29sb3I6ICcjZWQ2YzJlJyxcbiAgICAgICAgXHRcdFx0XHRcdCBpY29uOiAnZmFicmljJyxcbiAgICAgICAgXHRcdFx0XHRcdCB1bmljb2RlOiAnXFx1ZTYwNicsXG4gICAgICAgIFx0XHRcdFx0XHQgY2hpbGRyZW46W3tcbiAgICAgICAgXHRcdFx0XHRcdFx0Y29sdW1uX25hbWU6ICdlaF93c19hY2Nlc3NfdG9fZHJpbmtpbmdfd2F0ZXInLFxuICAgICAgICBcdFx0XHRcdFx0XHR0aXRsZTonQWNjZXNzIHRvIERyaW5raW5nIFdhdGVyJyxcbiAgICAgICAgICAgICAgICAgICAgc2l6ZToyODgwLFxuICAgICAgICBcdFx0XHRcdFx0XHRpY29uOicnLFxuICAgICAgICBcdFx0XHRcdFx0XHRjb2xvcjonI2YxODc1MycsXG4gICAgICAgIFx0XHRcdFx0XHRcdGRlc2NyaXB0aW9uOidQZXJjZW50YWdlIG9mIHBvcHVsYXRpb24gd2l0aCBhY2Nlc3MgdG8gaW1wcm92ZWQgZHJpbmtpbmcgd2F0ZXIgc291cmNlJ1xuICAgICAgICBcdFx0XHRcdFx0fSx7XG4gICAgICAgIFx0XHRcdFx0XHRcdGNvbHVtbl9uYW1lOiAnZWhfd3NfYWNjZXNzX3RvX3Nhbml0YXRpb24nLFxuICAgICAgICBcdFx0XHRcdFx0XHR0aXRsZTonQWNjZXNzIHRvIFNhbml0YXRpb24nLFxuICAgICAgICAgICAgICAgICAgICBzaXplOjI4ODAsXG4gICAgICAgIFx0XHRcdFx0XHRcdGljb246JycsXG4gICAgICAgIFx0XHRcdFx0XHRcdGNvbG9yOicjZjVhNDdkJyxcbiAgICAgICAgXHRcdFx0XHRcdFx0ZGVzY3JpcHRpb246J1BlcmNlbnRhZ2Ugb2YgcG9wdWxhdGlvbiB3aXRoIGFjY2VzcyB0byBpbXByb3ZlZCBzYW5pdGF0aW9uJ1xuICAgICAgICBcdFx0XHRcdFx0fV1cbiAgICAgICAgXHRcdFx0XHQgfV1cbiAgICAgICAgXHRcdFx0IH0se1xuICAgICAgICBcdFx0XHRcdCBjb2x1bW5fbmFtZTogJ2V2JyxcbiAgICAgICAgXHRcdFx0XHQgdGl0bGU6ICdFY29zeXN0ZW0gVmFsaWRpdHknLFxuICAgICAgICBcdFx0XHRcdCByYW5nZTpbMCwgMTAwXSxcbiAgICAgICAgXHRcdFx0XHQgaWNvbjonJyxcbiAgICAgICAgXHRcdFx0XHQgY29sb3I6JyMwMzYzODUnLFxuICAgICAgICBcdFx0XHRcdCBjaGlsZHJlbjpbe1xuICAgICAgICBcdFx0XHRcdFx0IGNvbHVtbl9uYW1lOidldl93cicsXG4gICAgICAgIFx0XHRcdFx0XHQgdGl0bGU6J1dhdGVyIFJlc291cmNlcycsXG4gICAgICAgIFx0XHRcdFx0XHQgY29sb3I6ICcjN2E4ZGM3JyxcbiAgICAgICAgXHRcdFx0XHRcdCBpY29uOiAnd2F0ZXInLFxuICAgICAgICBcdFx0XHRcdFx0IHVuaWNvZGU6ICdcXHVlNjA4JyxcbiAgICAgICAgXHRcdFx0XHRcdCBjaGlsZHJlbjpbe1xuICAgICAgICBcdFx0XHRcdFx0XHQgY29sdW1uX25hbWU6ICdldl93cl93YXN0ZXdhdGVyX3RyZWF0bWVudCcsXG4gICAgICAgIFx0XHRcdFx0XHRcdCB0aXRsZTonV2FzdGV3YXRlciBUcmVhdG1lbnQnLFxuICAgICAgICAgICAgICAgICAgICAgc2l6ZTo0MDAwLFxuICAgICAgICBcdFx0XHRcdFx0XHQgaWNvbjonJyxcbiAgICAgICAgXHRcdFx0XHRcdFx0IGNvbG9yOicjOTVhNmQ1JyxcbiAgICAgICAgXHRcdFx0XHRcdFx0IGRlc2NyaXB0aW9uOidXYXN0ZXdhdGVyIHRyZWF0bWVudCBsZXZlbCB3ZWlnaHRlZCBieSBjb25uZWN0aW9uIHRvIHdhc3Rld2F0ZXIgdHJlYXRtZW50IHJhdGUuJ1xuICAgICAgICBcdFx0XHRcdFx0IH1dXG4gICAgICAgIFx0XHRcdFx0IH0se1xuICAgICAgICBcdFx0XHRcdFx0IGNvbHVtbl9uYW1lOidldl9hZycsXG4gICAgICAgIFx0XHRcdFx0XHQgdGl0bGU6J0FncmljdWx0dXJlJyxcbiAgICAgICAgXHRcdFx0XHRcdCBjb2xvcjogJyMyZTc0YmEnLFxuICAgICAgICBcdFx0XHRcdFx0IGljb246ICdhZ3JhcicsXG4gICAgICAgIFx0XHRcdFx0XHQgdW5pY29kZTogJ1xcdWU2MDAnLFxuICAgICAgICBcdFx0XHRcdFx0IGNoaWxkcmVuOlt7XG4gICAgICAgIFx0XHRcdFx0XHRcdCBjb2x1bW5fbmFtZTogJ2V2X2FnX2FncmljdWx0dXJhbF9zdWJzaWRpZXMnLFxuICAgICAgICBcdFx0XHRcdFx0XHQgdGl0bGU6J0FncmljdWx0dXJhbCBTdWJzaWRpZXMnLFxuICAgICAgICAgICAgICAgICAgICAgc2l6ZTo3OTYsXG4gICAgICAgIFx0XHRcdFx0XHRcdCBpY29uOicnLFxuICAgICAgICBcdFx0XHRcdFx0XHQgY29sb3I6JyM4MmFiZDYnLFxuICAgICAgICBcdFx0XHRcdFx0XHQgZGVzY3JpcHRpb246J1N1YnNpZGllcyBhcmUgZXhwcmVzc2VkIGluIHByaWNlIG9mIHRoZWlyIHByb2R1Y3QgaW4gdGhlIGRvbWVzdGljIG1hcmtldCAocGx1cyBhbnkgZGlyZWN0IG91dHB1dCBzdWJzaWR5KSBsZXNzIGl0cyBwcmljZSBhdCB0aGUgYm9yZGVyLCBleHByZXNzZWQgYXMgYSBwZXJjZW50YWdlIG9mIHRoZSBib3JkZXIgcHJpY2UgKGFkanVzdGluZyBmb3IgdHJhbnNwb3J0IGNvc3RzIGFuZCBxdWFsaXR5IGRpZmZlcmVuY2VzKS4nXG4gICAgICAgIFx0XHRcdFx0XHQgfSx7XG4gICAgICAgIFx0XHRcdFx0XHRcdCBjb2x1bW5fbmFtZTogJ2V2X2FnX3Blc3RpY2lkZV9yZWd1bGF0aW9uJyxcbiAgICAgICAgXHRcdFx0XHRcdFx0IHRpdGxlOidQZXN0aWNpZGUgUmVndWxhdGlvbicsXG4gICAgICAgICAgICAgICAgICAgICBzaXplOjc5NixcbiAgICAgICAgXHRcdFx0XHRcdFx0IGljb246JycsXG4gICAgICAgIFx0XHRcdFx0XHRcdCBjb2xvcjonIzU3OGZjOCcsXG4gICAgICAgIFx0XHRcdFx0XHRcdCBkZXNjcmlwdGlvbjonV2FzdGV3YXRlciB0cmVhdG1lbnQgbGV2ZWwgd2VpZ2h0ZWQgYnkgY29ubmVjdGlvbiB0byB3YXN0ZXdhdGVyIHRyZWF0bWVudCByYXRlLidcbiAgICAgICAgXHRcdFx0XHRcdCB9XVxuICAgICAgICBcdFx0XHRcdCB9LHtcbiAgICAgICAgXHRcdFx0XHRcdCBjb2x1bW5fbmFtZTonZXZfZm8nLFxuICAgICAgICBcdFx0XHRcdFx0IHRpdGxlOidGb3Jlc3QnLFxuICAgICAgICBcdFx0XHRcdFx0IGNvbG9yOiAnIzAwOWFjYicsXG4gICAgICAgIFx0XHRcdFx0XHQgaWNvbjogJ3RyZWUnLFxuICAgICAgICBcdFx0XHRcdFx0IHVuaWNvZGU6ICdcXHVlNjA3JyxcbiAgICAgICAgXHRcdFx0XHRcdCBjaGlsZHJlbjpbe1xuICAgICAgICBcdFx0XHRcdFx0XHQgY29sdW1uX25hbWU6ICdldl9mb19jaGFuZ2VfaW5fZm9yZXN0X2NvdmVyJyxcbiAgICAgICAgXHRcdFx0XHRcdFx0IHRpdGxlOidDaGFuZ2UgaW4gRm9yZXN0IENvdmVyJyxcbiAgICAgICAgICAgICAgICAgICAgIHNpemU6MTU1MCxcbiAgICAgICAgXHRcdFx0XHRcdFx0IGljb246JycsXG4gICAgICAgIFx0XHRcdFx0XHRcdCBjb2xvcjonIzMxYWVkNScsXG4gICAgICAgIFx0XHRcdFx0XHRcdCBkZXNjcmlwdGlvbjonRm9yZXN0IGxvc3MgLSBGb3Jlc3QgZ2FpbiBpbiA+IDUwJSB0cmVlIGNvdmVyLCBhcyBjb21wYXJlZCB0byAyMDAwIGxldmVscy4nXG4gICAgICAgIFx0XHRcdFx0XHQgfV1cbiAgICAgICAgXHRcdFx0XHQgfSx7XG4gICAgICAgIFx0XHRcdFx0XHQgY29sdW1uX25hbWU6J2V2X2ZpJyxcbiAgICAgICAgXHRcdFx0XHRcdCB0aXRsZTonRmlzaGVyaWVzJyxcbiAgICAgICAgXHRcdFx0XHRcdCBjb2xvcjogJyMwMDhjOGMnLFxuICAgICAgICBcdFx0XHRcdFx0IGljb246ICdhbmNob3InLFxuICAgICAgICBcdFx0XHRcdFx0IHVuaWNvZGU6ICdcXHVlNjAxJyxcbiAgICAgICAgXHRcdFx0XHRcdCBjaGlsZHJlbjpbe1xuICAgICAgICBcdFx0XHRcdFx0XHQgY29sdW1uX25hbWU6ICdldl9maV9jb2FzdGFsX3NoZWxmX2Zpc2hpbmdfcHJlc3N1cmUnLFxuICAgICAgICBcdFx0XHRcdFx0XHQgdGl0bGU6J0NvYXN0YWwgU2hlbGYgRmlzaGluZyBQcmVzc3VyZScsXG4gICAgICAgICAgICAgICAgICAgICBzaXplOjkwMSxcbiAgICAgICAgXHRcdFx0XHRcdFx0IGljb246JycsXG4gICAgICAgIFx0XHRcdFx0XHRcdCBjb2xvcjonIzY1YjhiNycsXG4gICAgICAgIFx0XHRcdFx0XHRcdCBkZXNjcmlwdGlvbjonQ2F0Y2ggaW4gbWV0cmljIHRvbnMgZnJvbSB0cmF3bGluZyBhbmQgZHJlZGdpbmcgZ2VhcnMgKG1vc3RseSBib3R0b20gdHJhd2xzKSBkaXZpZGVkIGJ5IEVFWiBhcmVhLidcbiAgICAgICAgXHRcdFx0XHRcdCB9LHtcbiAgICAgICAgXHRcdFx0XHRcdFx0IGNvbHVtbl9uYW1lOiAnZXZfZmlfZmlzaF9zdG9ja3MnLFxuICAgICAgICBcdFx0XHRcdFx0XHQgdGl0bGU6J0Zpc2ggU3RvY2tzJyxcbiAgICAgICAgICAgICAgICAgICAgIHNpemU6OTAxLFxuICAgICAgICBcdFx0XHRcdFx0XHQgaWNvbjonJyxcbiAgICAgICAgXHRcdFx0XHRcdFx0IGNvbG9yOicjMzBhMmEyJyxcbiAgICAgICAgXHRcdFx0XHRcdFx0IGRlc2NyaXB0aW9uOidQZXJjZW50YWdlIG9mIGZpc2hpbmcgc3RvY2tzIG92ZXJleHBsb2l0ZWQgYW5kIGNvbGxhcHNlZCBmcm9tIEVFWi4nXG4gICAgICAgIFx0XHRcdFx0XHQgfV1cbiAgICAgICAgXHRcdFx0XHQgfSx7XG4gICAgICAgIFx0XHRcdFx0XHQgY29sdW1uX25hbWU6J2V2X2JkJyxcbiAgICAgICAgXHRcdFx0XHRcdCB0aXRsZTonQmlvZGl2ZXJzaXR5IGFuZCBIYWJpdGF0JyxcbiAgICAgICAgXHRcdFx0XHRcdCBjb2xvcjogJyM0NGI2YTAnLFxuICAgICAgICBcdFx0XHRcdFx0IGljb246ICdidXR0ZXJmbHknLFxuICAgICAgICBcdFx0XHRcdFx0IHVuaWNvZGU6ICdcXHVlNjAyJyxcbiAgICAgICAgXHRcdFx0XHRcdCBjaGlsZHJlbjpbe1xuICAgICAgICBcdFx0XHRcdFx0XHQgY29sdW1uX25hbWU6ICdldl9iZF90ZXJyZXN0cmlhbF9wcm90ZWN0ZWRfYXJlYXNfbmF0aW9uYWxfYmlvbWUnLFxuICAgICAgICBcdFx0XHRcdFx0XHQgdGl0bGU6J05hdGlvbmFsIEJpb21lIFByb3RlY3Rpb24nLFxuICAgICAgICAgICAgICAgICAgICAgc2l6ZToxMDc0LFxuICAgICAgICBcdFx0XHRcdFx0XHQgaWNvbjonJyxcbiAgICAgICAgXHRcdFx0XHRcdFx0IGNvbG9yOicjY2VlOGU3JyxcbiAgICAgICAgXHRcdFx0XHRcdFx0IGRlc2NyaXB0aW9uOidQZXJjZW50YWdlIG9mIHRlcnJlc3RyaWFsIGJpb21lIGFyZWEgdGhhdCBpcyBwcm90ZWN0ZWQsIHdlaWdodGVkIGJ5IGRvbWVzdGljIGJpb21lIGFyZWEuJ1xuICAgICAgICBcdFx0XHRcdFx0IH0se1xuICAgICAgICBcdFx0XHRcdFx0XHQgY29sdW1uX25hbWU6ICdldl9iZF90ZXJyZXN0cmlhbF9wcm90ZWN0ZWRfYXJlYXNfZ2xvYmFsX2Jpb21lJyxcbiAgICAgICAgXHRcdFx0XHRcdFx0IHRpdGxlOidHbG9iYWwgQmlvbWUgUHJvdGVjdGlvbicsXG4gICAgICAgICAgICAgICAgICAgICBzaXplOjEwNzQsXG4gICAgICAgIFx0XHRcdFx0XHRcdCBpY29uOicnLFxuICAgICAgICBcdFx0XHRcdFx0XHQgY29sb3I6JyNhMmQ1ZDEnLFxuICAgICAgICBcdFx0XHRcdFx0XHQgZGVzY3JpcHRpb246J1BlcmNlbnRhZ2Ugb2YgdGVycmVzdHJpYWwgYmlvbWUgYXJlYSB0aGF0IGlzIHByb3RlY3RlZCwgd2VpZ2h0ZWQgYnkgZ2xvYmFsIGJpb21lIGFyZWEuJ1xuICAgICAgICBcdFx0XHRcdFx0IH0se1xuICAgICAgICBcdFx0XHRcdFx0XHQgY29sdW1uX25hbWU6ICdldl9iZF9tYXJpbmVfcHJvdGVjdGVkX2FyZWFzJyxcbiAgICAgICAgXHRcdFx0XHRcdFx0IHRpdGxlOidNYXJpbmUgUHJvdGVjdGVkIEFyZWFzJyxcbiAgICAgICAgICAgICAgICAgICAgIHNpemU6MTA3NCxcbiAgICAgICAgXHRcdFx0XHRcdFx0IGljb246JycsXG4gICAgICAgIFx0XHRcdFx0XHRcdCBjb2xvcjonIzc3YzFiOScsXG4gICAgICAgIFx0XHRcdFx0XHRcdCBkZXNjcmlwdGlvbjonTWFyaW5lIHByb3RlY3RlZCBhcmVhcyBhcyBhIHBlcmNlbnQgb2YgRUVaLidcbiAgICAgICAgXHRcdFx0XHRcdCB9LHtcbiAgICAgICAgXHRcdFx0XHRcdFx0IGNvbHVtbl9uYW1lOiAnZXZfYmRfY3JpdGljYWxfaGFiaXRhdF9wcm90ZWN0aW9uJyxcbiAgICAgICAgXHRcdFx0XHRcdFx0IHRpdGxlOidDcml0aWNhbCBIYWJpdGF0IFByb3RlY3Rpb24nLFxuICAgICAgICAgICAgICAgICAgICAgc2l6ZToxMDc0LFxuICAgICAgICBcdFx0XHRcdFx0XHQgaWNvbjonJyxcbiAgICAgICAgXHRcdFx0XHRcdFx0IGNvbG9yOicjNThiYmFlJyxcbiAgICAgICAgXHRcdFx0XHRcdFx0IGRlc2NyaXB0aW9uOidQZXJjZW50YWdlIG9mIHRlcnJlc3RyaWFsIGJpb21lIGFyZWEgdGhhdCBpcyBwcm90ZWN0ZWQsIHdlaWdodGVkIGJ5IGdsb2JhbCBiaW9tZSBhcmVhLidcbiAgICAgICAgXHRcdFx0XHRcdCB9XVxuICAgICAgICBcdFx0XHRcdCB9LHtcbiAgICAgICAgXHRcdFx0XHRcdCBjb2x1bW5fbmFtZTonZXZfY2UnLFxuICAgICAgICBcdFx0XHRcdFx0IHRpdGxlOidDbGltYXRlIGFuZCBFbmVyZ3knLFxuICAgICAgICBcdFx0XHRcdFx0IGNvbG9yOiAnIzNiYWQ1ZScsXG4gICAgICAgIFx0XHRcdFx0XHQgaWNvbjogJ2VuZXJneScsXG4gICAgICAgIFx0XHRcdFx0XHQgdW5pY29kZTogJ1xcdWU2MDMnLFxuICAgICAgICBcdFx0XHRcdFx0IGNoaWxkcmVuOlt7XG4gICAgICAgIFx0XHRcdFx0XHRcdCBjb2x1bW5fbmFtZTogJ2V2X2NlX3RyZW5kX2luX2NhcmJvbl9pbnRlbnNpdHknLFxuICAgICAgICBcdFx0XHRcdFx0XHQgdGl0bGU6J1RyZW5kIGluIENhcmJvbiBJbnRlbnNpdHknLFxuICAgICAgICAgICAgICAgICAgICAgc2l6ZToxNTE0LFxuICAgICAgICBcdFx0XHRcdFx0XHQgaWNvbjonJyxcbiAgICAgICAgXHRcdFx0XHRcdFx0IGNvbG9yOicjNTliNTdhJyxcbiAgICAgICAgXHRcdFx0XHRcdFx0IGRlc2NyaXB0aW9uOidDaGFuZ2UgaW4gQ08yIGVtaXNzaW9ucyBwZXIgdW5pdCBHRFAgZnJvbSAxOTkwIHRvIDIwMTAuJ1xuICAgICAgICBcdFx0XHRcdFx0IH0se1xuICAgICAgICBcdFx0XHRcdFx0XHQgY29sdW1uX25hbWU6ICdldl9jZV9jaGFuZ2Vfb2ZfdHJlbmRfaW5fY2FyYm9uX2ludGVzaXR5JyxcbiAgICAgICAgXHRcdFx0XHRcdFx0IHRpdGxlOidDaGFuZ2Ugb2YgVHJlbmQgaW4gQ2FyYm9uIEludGVuc2l0eScsXG4gICAgICAgICAgICAgICAgICAgICBzaXplOjE1MTQsXG4gICAgICAgIFx0XHRcdFx0XHRcdCBpY29uOicnLFxuICAgICAgICBcdFx0XHRcdFx0XHQgY29sb3I6JyM4MGMzOTknLFxuICAgICAgICBcdFx0XHRcdFx0XHQgZGVzY3JpcHRpb246J0NoYW5nZSBpbiBUcmVuZCBvZiBDTzIgZW1pc3Npb25zIHBlciB1bml0IEdEUCBmcm9tIDE5OTAgdG8gMjAwMDsgMjAwMCB0byAyMDEwLidcbiAgICAgICAgXHRcdFx0XHRcdCB9LHtcbiAgICAgICAgXHRcdFx0XHRcdFx0IGNvbHVtbl9uYW1lOiAnZXZfY2VfdHJlbmRfaW5fY28yX2VtaXNzaW9uc19wZXJfa3doJyxcbiAgICAgICAgXHRcdFx0XHRcdFx0IHRpdGxlOidUcmVuZCBpbiBDTzIgRW1pc3Npb25zIHBlciBLV0gnLFxuICAgICAgICAgICAgICAgICAgICAgc2l6ZToxNTE0LFxuICAgICAgICBcdFx0XHRcdFx0XHQgaWNvbjonJyxcbiAgICAgICAgXHRcdFx0XHRcdFx0IGNvbG9yOicjYThkNGI4JyxcbiAgICAgICAgXHRcdFx0XHRcdFx0IGRlc2NyaXB0aW9uOidDaGFuZ2UgaW4gQ08yIGVtaXNzaW9ucyBmcm9tIGVsZWN0cmljaXR5IGFuZCBoZWF0IHByb2R1Y3Rpb24uJ1xuICAgICAgICBcdFx0XHRcdFx0IH1dXG4gICAgICAgIFx0XHRcdFx0IH1dXG4gICAgICAgIFx0XHRcdCB9XVxuICAgICAgICBcdFx0fTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5zZXJ2aWNlcycpLmZhY3RvcnkoJ01hcFNlcnZpY2UnLCBmdW5jdGlvbihsZWFmbGV0RGF0YSl7XG4gICAgICAgIC8vXG4gICAgICAgIHZhciBsZWFmbGV0ID0ge307XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgc2V0TGVhZmxldERhdGE6IGZ1bmN0aW9uKGxlYWYpe1xuICAgICAgICAgICAgbGVhZmxldCA9IGxlYWZsZXQ7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBnZXRMZWFmbGV0RGF0YTogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHJldHVybiBsZWFmbGV0O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKFwiYXBwLnNlcnZpY2VzXCIpLmZhY3RvcnkoJ0RpYWxvZ1NlcnZpY2UnLCBmdW5jdGlvbigkbWREaWFsb2cpe1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdGZyb21UZW1wbGF0ZTogZnVuY3Rpb24odGVtcGxhdGUsICRzY29wZSl7XG5cblx0XHRcdFx0dmFyIG9wdGlvbnMgPSB7XG5cdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICcvdmlld3MvZGlhbG9ncy8nICsgdGVtcGxhdGUgKyAnLycgKyB0ZW1wbGF0ZSArICcuaHRtbCdcblx0XHRcdFx0fTtcblxuXHRcdFx0XHRpZiAoJHNjb3BlKXtcblx0XHRcdFx0XHRvcHRpb25zLnNjb3BlID0gJHNjb3BlLiRuZXcoKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiAkbWREaWFsb2cuc2hvdyhvcHRpb25zKTtcblx0XHRcdH0sXG5cblx0XHRcdGhpZGU6IGZ1bmN0aW9uKCl7XG5cdFx0XHRcdHJldHVybiAkbWREaWFsb2cuaGlkZSgpO1xuXHRcdFx0fSxcblxuXHRcdFx0YWxlcnQ6IGZ1bmN0aW9uKHRpdGxlLCBjb250ZW50KXtcblx0XHRcdFx0JG1kRGlhbG9nLnNob3coXG5cdFx0XHRcdFx0JG1kRGlhbG9nLmFsZXJ0KClcblx0XHRcdFx0XHRcdC50aXRsZSh0aXRsZSlcblx0XHRcdFx0XHRcdC5jb250ZW50KGNvbnRlbnQpXG5cdFx0XHRcdFx0XHQub2soJ09rJylcblx0XHRcdFx0KTtcblx0XHRcdH1cblx0XHR9O1xuXHR9KTtcbn0pKCk7IiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKFwiYXBwLnNlcnZpY2VzXCIpLmZhY3RvcnkoJ1RvYXN0U2VydmljZScsIGZ1bmN0aW9uKCRtZFRvYXN0KXtcblxuXHRcdHZhciBkZWxheSA9IDYwMDAsXG5cdFx0XHRwb3NpdGlvbiA9ICd0b3AgcmlnaHQnLFxuXHRcdFx0YWN0aW9uID0gJ09LJztcblxuXHRcdHJldHVybiB7XG5cdFx0XHRzaG93OiBmdW5jdGlvbihjb250ZW50KXtcblx0XHRcdFx0aWYgKCFjb250ZW50KXtcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm4gJG1kVG9hc3Quc2hvdyhcblx0XHRcdFx0XHQkbWRUb2FzdC5zaW1wbGUoKVxuXHRcdFx0XHRcdFx0LmNvbnRlbnQoY29udGVudClcblx0XHRcdFx0XHRcdC5wb3NpdGlvbihwb3NpdGlvbilcblx0XHRcdFx0XHRcdC5hY3Rpb24oYWN0aW9uKVxuXHRcdFx0XHRcdFx0LmhpZGVEZWxheShkZWxheSlcblx0XHRcdFx0KTtcblx0XHRcdH0sXG5cdFx0XHRlcnJvcjogZnVuY3Rpb24oY29udGVudCl7XG5cdFx0XHRcdGlmICghY29udGVudCl7XG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuICRtZFRvYXN0LnNob3coXG5cdFx0XHRcdFx0JG1kVG9hc3Quc2ltcGxlKClcblx0XHRcdFx0XHRcdC5jb250ZW50KGNvbnRlbnQpXG5cdFx0XHRcdFx0XHQucG9zaXRpb24ocG9zaXRpb24pXG5cdFx0XHRcdFx0XHQudGhlbWUoJ3dhcm4nKVxuXHRcdFx0XHRcdFx0LmFjdGlvbihhY3Rpb24pXG5cdFx0XHRcdFx0XHQuaGlkZURlbGF5KGRlbGF5KVxuXHRcdFx0XHQpO1xuXHRcdFx0fVxuXHRcdH07XG5cdH0pO1xufSkoKTsiLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0RpYWxvZ3NDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBEaWFsb2dTZXJ2aWNlKXtcblx0XHQkc2NvcGUuYWxlcnREaWFsb2cgPSBmdW5jdGlvbigpe1xuXHRcdFx0RGlhbG9nU2VydmljZS5hbGVydCgnVGhpcyBpcyBhbiBhbGVydCB0aXRsZScsICdZb3UgY2FuIHNwZWNpZnkgc29tZSBkZXNjcmlwdGlvbiB0ZXh0IGluIGhlcmUuJyk7XG5cdFx0fTtcblxuXHRcdCRzY29wZS5jdXN0b21EaWFsb2cgPSBmdW5jdGlvbigpe1xuXHRcdFx0RGlhbG9nU2VydmljZS5mcm9tVGVtcGxhdGUoJ2FkZF91c2VycycsICRzY29wZSk7XG5cdFx0fTtcblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdFbGl4aXJDdHJsJywgZnVuY3Rpb24oKXtcbiAgICAgICAgLy9cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdFcGlDdHJsJywgZnVuY3Rpb24gKCRzY29wZSwkc3RhdGUsICR0aW1lb3V0LCBzbW9vdGhTY3JvbGwsIEluZGV4U2VydmljZSwgRVBJLCBEYXRhU2VydmljZSwgbGVhZmxldERhdGEsIE1hcFNlcnZpY2UpIHtcblxuXHRcdCRzY29wZS5jdXJyZW50ID0gXCJcIjtcblx0XHQkc2NvcGUuZGlzcGxheSA9IHtcblx0XHRcdHNlbGVjdGVkQ2F0OiAnJyxcblx0XHRcdHJhbms6IFt7XG5cdFx0XHRcdGZpZWxkczoge3g6ICd5ZWFyJyx5OidyYW5rJ30sXG5cdFx0XHRcdHRpdGxlOiAnUmFuaycsXG5cdFx0XHRcdGNvbG9yOicjNTJiNjk1J1xuXHRcdFx0fV0sXG5cdFx0XHRzY29yZTogW3tcblx0XHRcdFx0ZmllbGRzOiB7eDogJ3llYXInLHk6J3Njb3JlJ30sXG5cdFx0XHRcdHRpdGxlOiAnU2NvcmUnLFxuXHRcdFx0XHRjb2xvcjonIzAwNjZiOSdcblx0XHRcdH1dXG5cdFx0fTtcblx0XHQkc2NvcGUudGFiQ29udGVudD0gXCJcIjtcblx0XHQkc2NvcGUudG9nZ2xlQnV0dG9uID0gJ2Fycm93X2Ryb3BfZG93bic7XG5cdFx0JHNjb3BlLmluZGV4RGF0YSA9IEluZGV4U2VydmljZS5nZXRFcGkoKTtcblx0XHQkc2NvcGUuZXBpID0gW107XG5cdFx0JHNjb3BlLm1lbnVlT3BlbiA9IHRydWU7XG5cdFx0JHNjb3BlLmRldGFpbHMgPSBmYWxzZTtcblx0XHQkc2NvcGUuaW5mbyA9IGZhbHNlO1xuXHRcdCRzY29wZS5jbG9zZUljb24gPSAnY2xvc2UnO1xuXHRcdCRzY29wZS5jb21wYXJlPSB7XG5cdFx0XHRhY3RpdmU6IGZhbHNlLFxuXHRcdFx0Y291bnRyaWVzOltdXG5cdFx0fTtcblx0XHQkc2NvcGUuc2hvd1RhYkNvbnRlbnQgPSBmdW5jdGlvbihjb250ZW50KXtcblx0XHRcdGlmKGNvbnRlbnQgPT0gJycgJiYgJHNjb3BlLnRhYkNvbnRlbnQgPT0gJycpe1xuXHRcdFx0XHQkc2NvcGUudGFiQ29udGVudCA9ICdyYW5rJztcblx0XHRcdH1cblx0XHRcdGVsc2V7XG5cdFx0XHRcdFx0JHNjb3BlLnRhYkNvbnRlbnQgPSBjb250ZW50O1xuXHRcdFx0fVxuXHRcdFx0JHNjb3BlLnRvZ2dsZUJ1dHRvbiA9ICRzY29wZS50YWJDb250ZW50ID8gJ2Fycm93X2Ryb3BfdXAnOiAnYXJyb3dfZHJvcF9kb3duJztcblx0XHR9O1xuXHRcdCRzY29wZS5zZXRTdGF0ZSA9IGZ1bmN0aW9uKGlzbyl7XG5cdFx0XHRhbmd1bGFyLmZvckVhY2goJHNjb3BlLmVwaSwgZnVuY3Rpb24oZXBpKXtcblx0XHRcdFx0aWYoZXBpLmlzbyA9PSBpc28pe1xuXHRcdFx0XHRcdCRzY29wZS5jdXJyZW50ID0gZXBpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9O1xuXHRcdCRzY29wZS5lcGkgPSBFUEk7XG5cblx0XHQvKi5nZXRMaXN0KCkudGhlbihmdW5jdGlvbihkYXRhKXtcblxuXHRcdFx0XHRpZigkc3RhdGUuY3VycmVudC5uYW1lID09IFwiYXBwLmVwaS5zZWxlY3RlZFwiKXtcblx0XHRcdFx0XHQkc2NvcGUuc2V0U3RhdGUoJHN0YXRlLnBhcmFtcy5pdGVtKTtcblx0XHRcdFx0fVxuXHRcdH0pOyovXG5cblxuXG5cdFx0LypEYXRhU2VydmljZS5nZXRBbGwoJ2VwaS95ZWFyLzIwMTQnKS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG5cdFx0XHQkc2NvcGUuZXBpID0gZGF0YTtcblxuXHRcdFx0aWYoJHN0YXRlLmN1cnJlbnQubmFtZSA9PSBcImFwcC5lcGkuc2VsZWN0ZWRcIil7XG5cdFx0XHRcdGNvbnNvbGUubG9nKCRzdGF0ZS5wYXJhbXMuaXRlbSk7XG5cdFx0XHRcdCRzY29wZS5zZXRTdGF0ZSgkc3RhdGUucGFyYW1zLml0ZW0pO1xuXHRcdFx0fVxuXHRcdH0pOyovXG5cdFx0JHNjb3BlLnNldFN0YXRlID0gZnVuY3Rpb24oaXRlbSl7XG5cdFx0XHQkc2NvcGUuc2V0Q3VycmVudChnZXROYXRpb25CeUlzbyhpdGVtKSk7XG5cdFx0fTtcblx0XHQvLyRzY29wZS5lcGkgPSBSZXN0YW5ndWxhci5hbGwoJ2VwaS95ZWFyLzIwMTQnKS5nZXRMaXN0KCkuJG9iamVjdDtcblx0XHQkc2NvcGUudG9nZ2xlT3BlbiA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdCRzY29wZS5tZW51ZU9wZW4gPSAhJHNjb3BlLm1lbnVlT3Blbjtcblx0XHRcdCRzY29wZS5jbG9zZUljb24gPSAkc2NvcGUubWVudWVPcGVuID09IHRydWUgPyAnY2hldnJvbl9sZWZ0JyA6ICdjaGV2cm9uX3JpZ2h0Jztcblx0XHR9XG5cdFx0JHNjb3BlLnNldEN1cnJlbnQgPSBmdW5jdGlvbiAobmF0KSB7XG5cdFx0XHQkc2NvcGUuY3VycmVudCA9IG5hdDtcblx0XHR9O1xuXHRcdCRzY29wZS5nZXRSYW5rID0gZnVuY3Rpb24gKG5hdCkge1xuXHRcdFx0cmV0dXJuICRzY29wZS5lcGkuaW5kZXhPZihuYXQpICsgMTtcblx0XHR9O1xuXHRcdCRzY29wZS50b2dnbGVJbmZvID0gZnVuY3Rpb24oKXtcblx0XHRcdFx0JHNjb3BlLmRpc3BsYXkuc2VsZWN0ZWRDYXQgPSAnJztcblx0XHRcdFx0JHNjb3BlLmluZm8gPSAhJHNjb3BlLmluZm87XG5cdFx0fTtcblx0XHQkc2NvcGUudG9nZ2xlRGV0YWlscyA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdHJldHVybiAkc2NvcGUuZGV0YWlscyA9ICEkc2NvcGUuZGV0YWlscztcblx0XHR9O1xuXHRcdCRzY29wZS50b2dnbGVDb21wYXJpc29uID0gZnVuY3Rpb24oKXtcblx0XHRcdCRzY29wZS5jb21wYXJlLmNvdW50cmllcyA9IFskc2NvcGUuY3VycmVudF07XG5cdFx0XHQkc2NvcGUuY29tcGFyZS5hY3RpdmUgPSAhJHNjb3BlLmNvbXBhcmUuYWN0aXZlO1xuXHRcdFx0aWYoJHNjb3BlLmNvbXBhcmUuYWN0aXZlKXtcblx0XHRcdFx0JHRpbWVvdXQoZnVuY3Rpb24oKXtcblx0XHRcdFx0XHR2YXIgZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpbmRleC1jb21wYXJpc29uJyk7XG5cdFx0XHRcdFx0c21vb3RoU2Nyb2xsKGVsZW1lbnQse29mZnNldDoxMjAsIGR1cmF0aW9uOjIwMH0pO1xuXG5cdFx0XHRcdH0pXG5cdFx0XHR9XG5cdFx0fTtcblx0XHQkc2NvcGUudG9nZ2xlQ291bnRyaWVMaXN0ID0gZnVuY3Rpb24oY291bnRyeSl7XG5cdFx0XHR2YXIgZm91bmQgPSBmYWxzZTtcblx0XHRcdGFuZ3VsYXIuZm9yRWFjaCgkc2NvcGUuY29tcGFyZS5jb3VudHJpZXMsIGZ1bmN0aW9uKG5hdCwga2V5KXtcblx0XHRcdFx0XHRpZihjb3VudHJ5ID09IG5hdCl7XG5cdFx0XHRcdFx0XHQkc2NvcGUuY29tcGFyZS5jb3VudHJpZXMuc3BsaWNlKGtleSwgMSk7XG5cdFx0XHRcdFx0XHRmb3VuZCA9IHRydWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0XHRpZighZm91bmQpe1xuXHRcdFx0XHQkc2NvcGUuY29tcGFyZS5jb3VudHJpZXMucHVzaChjb3VudHJ5KTtcblx0XHRcdH07XG5cdFx0XHRyZXR1cm4gIWZvdW5kO1xuXHRcdH07XG5cdFx0JHNjb3BlLmdldE9mZnNldCA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdGlmICghJHNjb3BlLmN1cnJlbnQpIHtcblx0XHRcdFx0cmV0dXJuIDA7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gKCRzY29wZS5jdXJyZW50LnJhbmsgPT0gMSA/IDAgOiAkc2NvcGUuY3VycmVudC5yYW5rID09ICRzY29wZS5jdXJyZW50Lmxlbmd0aCArIDEgPyAkc2NvcGUuY3VycmVudC5yYW5rIDogJHNjb3BlLmN1cnJlbnQucmFuayAtIDIpICogMTY7XG5cdFx0XHQvL3JldHVybiAkc2NvcGUuY3VycmVudC5yYW5rIC0gMiB8fCAwO1xuXHRcdH07XG5cdFx0JHNjb3BlLmdldFRlbmRlbmN5ID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0aWYgKCEkc2NvcGUuY3VycmVudCkge1xuXHRcdFx0XHRyZXR1cm4gJ2Fycm93X2Ryb3BfZG93bidcblx0XHRcdH1cblx0XHRcdHJldHVybiAkc2NvcGUuY3VycmVudC5wZXJjZW50X2NoYW5nZSA+IDAgPyAnYXJyb3dfZHJvcF91cCcgOiAnYXJyb3dfZHJvcF9kb3duJztcblx0XHR9O1xuXG5cdFx0JHNjb3BlLiR3YXRjaCgnY3VycmVudCcsIGZ1bmN0aW9uIChuZXdJdGVtLCBvbGRJdGVtKSB7XG5cdFx0XHRpZiAobmV3SXRlbSA9PT0gb2xkSXRlbSkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0XHQvLyRzY29wZS5kaXNwbGF5LnNlbGVjdGVkQ2F0ID0gXCJcIjtcblx0XHRcdGlmKG5ld0l0ZW0uaXNvKXtcblx0XHRcdFx0aWYoJHNjb3BlLmNvbXBhcmUuYWN0aXZlKXtcblx0XHRcdFx0XHQkc2NvcGUudG9nZ2xlQ291bnRyaWVMaXN0KG5ld0l0ZW0pO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2V7XG5cdFx0XHRcdFx0JHN0YXRlLmdvKCdhcHAuZXBpLnNlbGVjdGVkJywge2l0ZW06bmV3SXRlbS5pc299KVxuXHRcdFx0XHRcdERhdGFTZXJ2aWNlLmdldE9uZSgnbmF0aW9ucy9iYm94JywgWyRzY29wZS5jdXJyZW50Lmlzb10pLnRoZW4oZnVuY3Rpb24oZGF0YSl7XG5cdFx0XHRcdFx0XHQkc2NvcGUuYmJveCA9IGRhdGE7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblxuXHRcdFx0fVxuXHRcdFx0ZWxzZXtcblx0XHRcdFx0JHN0YXRlLmdvKCdhcHAuZXBpJyk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0JHNjb3BlLiR3YXRjaCgnZGlzcGxheS5zZWxlY3RlZENhdCcsIGZ1bmN0aW9uKG4sIG8pe1xuXHRcdFx0XHRpZihuID09PSBvKXtcblx0XHRcdFx0XHRyZXR1cm5cblx0XHRcdFx0fVxuXHRcdFx0XHRpZihuKVxuXHRcdFx0XHR1cGRhdGVDYW52YXMobi5jb2xvcik7XG5cdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdHVwZGF0ZUNhbnZhcygncmdiYSgxMjgsIDI0MywgMTk4LDEpJyk7XG5cdFx0XHRcdH07XG5cdFx0XHRcdCRzY29wZS5tdnRTb3VyY2Uuc2V0U3R5bGUoY291bnRyaWVzU3R5bGUpO1xuXHRcdH0pO1xuXHRcdCRzY29wZS4kb24oXCIkc3RhdGVDaGFuZ2VTdWNjZXNzXCIsIGZ1bmN0aW9uKGV2ZW50LCB0b1N0YXRlLCB0b1BhcmFtcyl7XG5cblx0XHRcdGlmKHRvU3RhdGUubmFtZSA9PSBcImFwcC5lcGkuc2VsZWN0ZWRcIil7XG5cdFx0XHRcdCRzY29wZS5zZXRTdGF0ZSggdG9QYXJhbXMuaXRlbSk7XG5cdFx0XHRcdERhdGFTZXJ2aWNlLmdldE9uZSgnbmF0aW9ucycsIHRvUGFyYW1zLml0ZW0pLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcblx0XHRcdFx0XHQkc2NvcGUuY291bnRyeSA9IGRhdGE7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZXtcblx0XHRcdFx0JHNjb3BlLmNvdW50cnkgPSAkc2NvcGUuY3VycmVudCA9IFwiXCI7XG5cdFx0XHRcdCRzY29wZS5kZXRhaWxzID0gZmFsc2U7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0dmFyIGdldE5hdGlvbkJ5TmFtZSA9IGZ1bmN0aW9uIChuYW1lKSB7XG5cdFx0XHR2YXIgbmF0aW9uID0ge307XG5cdFx0XHRhbmd1bGFyLmZvckVhY2goJHNjb3BlLmVwaSwgZnVuY3Rpb24gKG5hdCkge1xuXHRcdFx0XHRpZiAobmF0LmNvdW50cnkgPT0gbmFtZSkge1xuXHRcdFx0XHRcdG5hdGlvbiA9IG5hdDtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0XHRyZXR1cm4gbmF0aW9uO1xuXHRcdH07XG5cdFx0dmFyIGdldE5hdGlvbkJ5SXNvID0gZnVuY3Rpb24gKGlzbykge1xuXHRcdFx0dmFyIG5hdGlvbiA9IHt9O1xuXHRcdFx0YW5ndWxhci5mb3JFYWNoKCRzY29wZS5lcGksIGZ1bmN0aW9uIChuYXQpIHtcblx0XHRcdFx0aWYgKG5hdC5pc28gPT0gaXNvKSB7XG5cdFx0XHRcdFx0bmF0aW9uID0gbmF0O1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHRcdHJldHVybiBuYXRpb247XG5cdFx0fTtcblx0XHR2YXIgY3JlYXRlQ2FudmFzID0gZnVuY3Rpb24gKGNvbG9ycykge1xuXHRcdFx0JHNjb3BlLmNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuXHRcdFx0JHNjb3BlLmNhbnZhcy53aWR0aCA9IDI1Njtcblx0XHRcdCRzY29wZS5jYW52YXMuaGVpZ2h0ID0gMTA7XG5cdFx0XHQkc2NvcGUuY3R4ID0gJHNjb3BlLmNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuXHRcdFx0dmFyIGdyYWRpZW50ID0gJHNjb3BlLmN0eC5jcmVhdGVMaW5lYXJHcmFkaWVudCgwLCAwLCAyNTYsIDEwKTtcblx0XHRcdGdyYWRpZW50LmFkZENvbG9yU3RvcCgwLCAncmdiYSgyNTUsMjU1LDI1NSwwKScpO1xuXHRcdFx0Z3JhZGllbnQuYWRkQ29sb3JTdG9wKDAuNTMsICdyZ2JhKDEyOCwgMjQzLCAxOTgsMSknKTtcblx0XHRcdGdyYWRpZW50LmFkZENvbG9yU3RvcCgxLCAncmdiYSgxMDIsMTAyLDEwMiwxKScpO1xuXHRcdFx0JHNjb3BlLmN0eC5maWxsU3R5bGUgPSBncmFkaWVudDtcblx0XHRcdCRzY29wZS5jdHguZmlsbFJlY3QoMCwgMCwgMjU2LCAxMCk7XG5cdFx0XHQkc2NvcGUucGFsZXR0ZSA9ICRzY29wZS5jdHguZ2V0SW1hZ2VEYXRhKDAsIDAsIDI1NiwgMSkuZGF0YTtcblx0XHRcdC8vZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2JvZHknKVswXS5hcHBlbmRDaGlsZCgkc2NvcGUuY2FudmFzKTtcblx0XHR9XG5cdFx0dmFyIHVwZGF0ZUNhbnZhcyA9IGZ1bmN0aW9uKGNvbG9yKXtcblx0XHRcdHZhciBncmFkaWVudCA9ICRzY29wZS5jdHguY3JlYXRlTGluZWFyR3JhZGllbnQoMCwgMCwgMjU2LCAxMCk7XG5cdFx0XHRncmFkaWVudC5hZGRDb2xvclN0b3AoMCwgJ3JnYmEoMjU1LDI1NSwyNTUsMCknKTtcblx0XHRcdGdyYWRpZW50LmFkZENvbG9yU3RvcCgwLjUzLCBjb2xvcik7XG5cdFx0XHRncmFkaWVudC5hZGRDb2xvclN0b3AoMSwgJ3JnYmEoMTAyLDEwMiwxMDIsMSknKTtcblx0XHRcdCRzY29wZS5jdHguZmlsbFN0eWxlID0gZ3JhZGllbnQ7XG5cdFx0XHQkc2NvcGUuY3R4LmZpbGxSZWN0KDAsIDAsIDI1NiwgMTApO1xuXHRcdFx0JHNjb3BlLnBhbGV0dGUgPSAkc2NvcGUuY3R4LmdldEltYWdlRGF0YSgwLCAwLCAyNTYsIDEpLmRhdGE7XG5cdFx0fTtcblx0XHRjcmVhdGVDYW52YXMoKTtcblxuXHRcdHZhciBjb3VudHJpZXNTdHlsZSA9IGZ1bmN0aW9uIChmZWF0dXJlKSB7XG5cdFx0XHR2YXIgc3R5bGUgPSB7fTtcblx0XHRcdHZhciBpc28gPSBmZWF0dXJlLnByb3BlcnRpZXMuYWRtMF9hMztcblx0XHRcdHZhciBuYXRpb24gPSBnZXROYXRpb25CeUlzbyhpc28pO1xuXHRcdFx0dmFyIGZpZWxkID0gJHNjb3BlLmRpc3BsYXkuc2VsZWN0ZWRDYXQudHlwZSB8fCAnc2NvcmUnO1xuXHRcdFx0dmFyIHR5cGUgPSBmZWF0dXJlLnR5cGU7XG5cdFx0XHRzd2l0Y2ggKHR5cGUpIHtcblx0XHRcdGNhc2UgMTogLy8nUG9pbnQnXG5cdFx0XHRcdHN0eWxlLmNvbG9yID0gJ3JnYmEoNDksNzksNzksMC4wMSknO1xuXHRcdFx0XHRzdHlsZS5yYWRpdXMgPSA1O1xuXHRcdFx0XHRzdHlsZS5zZWxlY3RlZCA9IHtcblx0XHRcdFx0XHRjb2xvcjogJ3JnYmEoMjU1LDI1NSwwLDAuNSknLFxuXHRcdFx0XHRcdHJhZGl1czogMFxuXHRcdFx0XHR9O1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgMjogLy8nTGluZVN0cmluZydcblx0XHRcdFx0c3R5bGUuY29sb3IgPSAncmdiYSgyNTUsMCwwLDEpJztcblx0XHRcdFx0c3R5bGUuc2l6ZSA9IDE7XG5cdFx0XHRcdHN0eWxlLnNlbGVjdGVkID0ge1xuXHRcdFx0XHRcdGNvbG9yOiAncmdiYSgyNTUsMjUsMCwxKScsXG5cdFx0XHRcdFx0c2l6ZTogMlxuXHRcdFx0XHR9O1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgMzogLy8nUG9seWdvbidcblx0XHRcdFx0aWYgKG5hdGlvbltmaWVsZF0pIHtcblx0XHRcdFx0XHR2YXIgY29sb3JQb3MgPSBwYXJzZUludCgyNTYgLyAxMDAgKiBuYXRpb25bZmllbGRdKSAqIDQ7XG5cdFx0XHRcdFx0dmFyIGNvbG9yID0gJ3JnYmEoJyArICRzY29wZS5wYWxldHRlW2NvbG9yUG9zXSArICcsICcgKyAkc2NvcGUucGFsZXR0ZVtjb2xvclBvcyArIDFdICsgJywgJyArICRzY29wZS5wYWxldHRlW2NvbG9yUG9zICsgMl0gKyAnLCcgKyAkc2NvcGUucGFsZXR0ZVtjb2xvclBvcyArIDNdICsgJyknO1xuXHRcdFx0XHRcdHN0eWxlLmNvbG9yID0gY29sb3I7XG5cdFx0XHRcdFx0c3R5bGUub3V0bGluZSA9IHtcblx0XHRcdFx0XHRcdGNvbG9yOiAncmdiYSg1MCw1MCw1MCwwLjQpJyxcblx0XHRcdFx0XHRcdHNpemU6IDFcblx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdHN0eWxlLnNlbGVjdGVkID0ge1xuXHRcdFx0XHRcdFx0Y29sb3I6ICdyZ2JhKDI1NSwyNTUsMjU1LDAuMCknLFxuXHRcdFx0XHRcdFx0b3V0bGluZToge1xuXHRcdFx0XHRcdFx0XHRjb2xvcjogJ3JnYmEoMCwwLDAsMC4zKScsXG5cdFx0XHRcdFx0XHRcdHNpemU6IDJcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHN0eWxlLmNvbG9yID0gJ3JnYmEoMjU1LDI1NSwyNTUsMCknO1xuXHRcdFx0XHRcdHN0eWxlLm91dGxpbmUgPSB7XG5cdFx0XHRcdFx0XHRjb2xvcjogJ3JnYmEoMjU1LDI1NSwyNTUsMCknLFxuXHRcdFx0XHRcdFx0c2l6ZTogMVxuXHRcdFx0XHRcdH07XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0Ly9cdGlmIChmZWF0dXJlLmxheWVyLm5hbWUgPT09ICdnYXVsXzIwMTRfYWRtMV9sYWJlbCcpIHtcblx0XHRcdHN0eWxlLmFqYXhTb3VyY2UgPSBmdW5jdGlvbiAobXZ0RmVhdHVyZSkge1xuXHRcdFx0XHR2YXIgaWQgPSBtdnRGZWF0dXJlLmlkO1xuXHRcdFx0XHQvL1x0Y29uc29sZS5sb2coaWQpO1xuXHRcdFx0XHQvL3JldHVybiAnaHR0cDovL3NwYXRpYWxzZXJ2ZXIuc3BhdGlhbGRldi5jb20vZnNwLzIwMTQvZnNwL2FnZ3JlZ2F0aW9ucy1uby1uYW1lLycgKyBpZCArICcuanNvbic7XG5cdFx0XHR9O1xuXG5cdFx0XHRzdHlsZS5zdGF0aWNMYWJlbCA9IGZ1bmN0aW9uIChtdnRGZWF0dXJlLCBhamF4RGF0YSkge1xuXHRcdFx0XHR2YXIgc3R5bGUgPSB7XG5cdFx0XHRcdFx0aHRtbDogZmVhdHVyZS5wcm9wZXJ0aWVzLm5hbWUsXG5cdFx0XHRcdFx0aWNvblNpemU6IFszMywgMzNdLFxuXHRcdFx0XHRcdGNzc0NsYXNzOiAnbGFiZWwtaWNvbi1udW1iZXInLFxuXHRcdFx0XHRcdGNzc1NlbGVjdGVkQ2xhc3M6ICdsYWJlbC1pY29uLW51bWJlci1zZWxlY3RlZCdcblx0XHRcdFx0fTtcblx0XHRcdFx0cmV0dXJuIHN0eWxlO1xuXHRcdFx0fTtcblx0XHRcdC8vXHR9XG5cblx0XHRcdHJldHVybiBzdHlsZTtcblx0XHR9O1xuXG5cdFx0JHNjb3BlLmRyYXdDb3VudHJpZXMgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRsZWFmbGV0RGF0YS5nZXRNYXAoJ21hcCcpLnRoZW4oZnVuY3Rpb24gKG1hcCkge1xuXHRcdFx0XHQkc2NvcGUuJHdhdGNoKCdiYm94JywgZnVuY3Rpb24obiwgbyl7XG5cdFx0XHRcdFx0XHRpZihuID09PSBvKXtcblx0XHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHR2YXIgbGF0ID0gW24uY29vcmRpbmF0ZXNbMF1bMF1bMV0sW24uY29vcmRpbmF0ZXNbMF1bMF1bMF1dXSxcblx0XHRcdFx0XHRcdGxuZyA9IFtuLmNvb3JkaW5hdGVzWzBdWzJdWzFdLFtuLmNvb3JkaW5hdGVzWzBdWzJdWzBdXV1cblx0XHRcdFx0XHRcdHZhciBzb3V0aFdlc3QgPSBMLmxhdExuZyhuLmNvb3JkaW5hdGVzWzBdWzBdWzFdLCBuLmNvb3JkaW5hdGVzWzBdWzBdWzBdKSxcbiAgICBub3J0aEVhc3QgPSBMLmxhdExuZyhuLmNvb3JkaW5hdGVzWzBdWzJdWzFdLCBuLmNvb3JkaW5hdGVzWzBdWzJdWzBdKSxcbiAgICBib3VuZHMgPSBMLmxhdExuZ0JvdW5kcyhzb3V0aFdlc3QsIG5vcnRoRWFzdCk7XG5cblx0XHRcdFx0XHRcdC8vbWFwLnBhbkluc2lkZUJvdW5kcyhib3VuZHMse3pvb206dHJ1ZX0pO1xuXHRcdFx0XHRcdFx0bWFwLmZpdEJvdW5kcyhib3VuZHMsIHtcblx0XHRcdFx0XHRcdFx0cGFkZGluZ1RvcExlZnQ6IFszMDAsMF1cblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9KTtcblx0XHRcdFx0dmFyIGFwaUtleSA9ICdway5leUoxSWpvaWJXRm5ibTlzYnlJc0ltRWlPaUp1U0ZkVVlrZzRJbjAuNUhPeWtLazBwTlAxTjNpc2ZQUUdUUSc7XG5cblx0XHRcdFx0Ly9cdEwudGlsZUxheWVyKCdodHRwOi8vbG9jYWxob3N0OjMwMDEvc2VydmljZXMvcG9zdGdpcy9jb3VudHJpZXNfYmlnL2dlb20vZHluYW1pY01hcC97en0ve3h9L3t5fS5wbmcnKS5hZGRUbyhtYXApO1xuXHRcdFx0XHR2YXIgZGVidWcgPSB7fTtcblx0XHRcdFx0dmFyIG1iID0gJ2h0dHBzOi8vYS50aWxlcy5tYXBib3guY29tL3Y0L21hcGJveC5tYXBib3gtdGVycmFpbi12MSxtYXBib3gubWFwYm94LXN0cmVldHMtdjYtZGV2L3t6fS97eH0ve3l9LnZlY3Rvci5wYmY/YWNjZXNzX3Rva2VuPXBrLmV5SjFJam9pYldGd1ltOTRJaXdpWVNJNklsaEhWa1ptYVc4aWZRLmhBTVg1aFNXLVFuVGVSQ01BeTlBOFEnO1xuXHRcdFx0XHR2YXIgbWFwemVuID0gJ2h0dHA6Ly92ZWN0b3IubWFwemVuLmNvbS9vc20ve2xheWVyc30ve3p9L3t4fS97eX0ue2Zvcm1hdH0/YXBpX2tleT17YXBpX2tleX0nXG5cdFx0XHRcdHZhciB1cmwgPSAnaHR0cDovL2xvY2FsaG9zdDozMDAxL3NlcnZpY2VzL3Bvc3RnaXMvY291bnRyaWVzX2JpZy9nZW9tL3ZlY3Rvci10aWxlcy97en0ve3h9L3t5fS5wYmY/ZmllbGRzPWlkLGFkbWluLGFkbTBfYTMsd2JfYTMsc3VfYTMsaXNvX2EzLG5hbWUsbmFtZV9sb25nJzsgLy9cblx0XHRcdFx0dmFyIHVybDIgPSAnaHR0cHM6Ly9hLnRpbGVzLm1hcGJveC5jb20vdjQvbWFwYm94Lm1hcGJveC1zdHJlZXRzLXY2LWRldi97en0ve3h9L3t5fS52ZWN0b3IucGJmP2FjY2Vzc190b2tlbj0nICsgYXBpS2V5O1xuXHRcdFx0XHQkc2NvcGUubXZ0U291cmNlID0gbmV3IEwuVGlsZUxheWVyLk1WVFNvdXJjZSh7XG5cdFx0XHRcdFx0dXJsOiB1cmwsIC8vXCJodHRwOi8vc3BhdGlhbHNlcnZlci5zcGF0aWFsZGV2LmNvbS9zZXJ2aWNlcy92ZWN0b3ItdGlsZXMvZ2F1bF9mc3BfaW5kaWEve3p9L3t4fS97eX0ucGJmXCIsXG5cdFx0XHRcdFx0ZGVidWc6IGZhbHNlLFxuXHRcdFx0XHRcdG9wYWNpdHk6IDAuNixcblx0XHRcdFx0XHRjbGlja2FibGVMYXllcnM6IFsnY291bnRyaWVzX2JpZ19nZW9tJ10sXG5cdFx0XHRcdFx0bXV0ZXhUb2dnbGU6IHRydWUsXG5cdFx0XHRcdFx0b25DbGljazogZnVuY3Rpb24gKGV2dCwgdCkge1xuXHRcdFx0XHRcdFx0Ly9tYXAuZml0Qm91bmRzKGV2dC50YXJnZXQuZ2V0Qm91bmRzKCkpO1xuXG5cdFx0XHRcdFx0XHQvL3ZhciB4ID0gZXZ0LmZlYXR1cmUuYmJveCgpWzBdLyAoZXZ0LmZlYXR1cmUuZXh0ZW50IC8gZXZ0LmZlYXR1cmUudGlsZVNpemUpO1xuXHRcdFx0XHRcdFx0Ly92YXIgeSA9IGV2dC5mZWF0dXJlLmJib3goKVsxXS8oZXZ0LmZlYXR1cmUuZXh0ZW50IC8gZXZ0LmZlYXR1cmUudGlsZVNpemUpXG5cdFx0XHRcdFx0XHQvL2lmICgkc2NvcGUuY3VycmVudC5jb3VudHJ5ICE9IGV2dC5mZWF0dXJlLnByb3BlcnRpZXMuYWRtaW4pIHtcblx0XHRcdFx0XHRcdFx0Ly9tYXAucGFuVG8oZXZ0LmxhdGxuZyk7XG5cdFx0XHRcdFx0XHRcdC8vbWFwLnBhbkJ5KG5ldyBMLlBvaW50KC0yMDAsMCkpO1xuXHRcdFx0XHRcdFx0LypcdG1hcC5maXRCb3VuZHMoW1xuXHRcdFx0XHRcdFx0XHRcdFtldnQuZmVhdHVyZS5iYm94KClbMF0gLyAoZXZ0LmZlYXR1cmUuZXh0ZW50IC8gZXZ0LmZlYXR1cmUudGlsZVNpemUpLCBldnQuZmVhdHVyZS5iYm94KClbMV0gLyAoZXZ0LmZlYXR1cmUuZXh0ZW50IC8gZXZ0LmZlYXR1cmUudGlsZVNpemUpXSxcblx0XHRcdFx0XHRcdFx0XHRbZXZ0LmZlYXR1cmUuYmJveCgpWzJdIC8gKGV2dC5mZWF0dXJlLmV4dGVudCAvIGV2dC5mZWF0dXJlLnRpbGVTaXplKSwgZXZ0LmZlYXR1cmUuYmJveCgpWzNdIC8gKGV2dC5mZWF0dXJlLmV4dGVudCAvIGV2dC5mZWF0dXJlLnRpbGVTaXplKV0sXG5cdFx0XHRcdFx0XHRcdF0pKi9cblx0XHRcdFx0XHRcdC8vfVxuXHRcdFx0XHRcdFx0Ly9jb25zb2xlLmxvZyhldnQuZmVhdHVyZSk7XG5cdFx0XHRcdFx0XHQkc2NvcGUuY3VycmVudCA9IGdldE5hdGlvbkJ5SXNvKGV2dC5mZWF0dXJlLnByb3BlcnRpZXMuYWRtMF9hMyk7XG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRnZXRJREZvckxheWVyRmVhdHVyZTogZnVuY3Rpb24gKGZlYXR1cmUpIHtcblxuXHRcdFx0XHRcdFx0cmV0dXJuIGZlYXR1cmUucHJvcGVydGllcy5pZDtcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdGZpbHRlcjogZnVuY3Rpb24gKGZlYXR1cmUsIGNvbnRleHQpIHtcblxuXHRcdFx0XHRcdFx0aWYgKGZlYXR1cmUubGF5ZXIubmFtZSA9PT0gJ2FkbWluJyB8fCBmZWF0dXJlLmxheWVyLm5hbWUgPT09ICdnYXVsXzIwMTRfYWRtMV9sYWJlbCcpIHtcblx0XHRcdFx0XHRcdFx0Ly9jb25zb2xlLmxvZyhmZWF0dXJlKTtcblx0XHRcdFx0XHRcdFx0aWYgKGZlYXR1cmUucHJvcGVydGllcy5hZG1pbl9sZXZlbCA9PSAwIHx8IGZlYXR1cmUucHJvcGVydGllcy5hZG1pbl9sZXZlbCA9PSAxIHx8IGZlYXR1cmUucHJvcGVydGllcy5hZG1pbl9sZXZlbCA9PSAyKSB7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHRcdH0sXG5cblx0XHRcdFx0XHRzdHlsZTogY291bnRyaWVzU3R5bGUsXG5cblxuXHRcdFx0XHRcdGxheWVyTGluazogZnVuY3Rpb24gKGxheWVyTmFtZSkge1xuXHRcdFx0XHRcdFx0aWYgKGxheWVyTmFtZS5pbmRleE9mKCdfbGFiZWwnKSA+IC0xKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBsYXllck5hbWUucmVwbGFjZSgnX2xhYmVsJywgJycpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0cmV0dXJuIGxheWVyTmFtZSArICdfbGFiZWwnO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHR9KTtcblx0XHRcdFx0ZGVidWcubXZ0U291cmNlID0gJHNjb3BlLm12dFNvdXJjZTtcblx0XHRcdFx0bWFwLmFkZExheWVyKCRzY29wZS5tdnRTb3VyY2UpO1xuXHRcdFx0fSk7XG5cdFx0fTtcblx0XHQkc2NvcGUuZHJhd0NvdW50cmllcygpO1xuXHR9KTtcbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdHZW5lcmF0b3JzQ3RybCcsIGZ1bmN0aW9uKCl7XG4gICAgICAgIC8vXG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0hlYWRlckN0cmwnLCBmdW5jdGlvbigkc2NvcGUsICRyb290U2NvcGUpe1xuXG5cdFx0JHNjb3BlLiR3YXRjaChmdW5jdGlvbigpe1xuXHRcdFx0cmV0dXJuICRyb290U2NvcGUuY3VycmVudF9wYWdlO1xuXHRcdH0sIGZ1bmN0aW9uKG5ld1BhZ2Upe1xuXHRcdFx0JHNjb3BlLmN1cnJlbnRfcGFnZSA9IG5ld1BhZ2UgfHwgJ1BhZ2UgTmFtZSc7XG5cdFx0fSk7XG5cblxuXHR9KTtcblxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignSW1wb3J0Y3N2Q3RybCcsIGZ1bmN0aW9uICgkbWREaWFsb2cpIHtcblx0XHR0aGlzLnNldHRpbmdzID0ge1xuXHRcdFx0cHJpbnRMYXlvdXQ6IHRydWUsXG5cdFx0XHRzaG93UnVsZXI6IHRydWUsXG5cdFx0XHRzaG93U3BlbGxpbmdTdWdnZXN0aW9uczogdHJ1ZSxcblx0XHRcdHByZXNlbnRhdGlvbk1vZGU6ICdlZGl0J1xuXHRcdH07XG5cblx0XHR0aGlzLnNhbXBsZUFjdGlvbiA9IGZ1bmN0aW9uIChuYW1lLCBldikge1xuXHRcdFx0JG1kRGlhbG9nLnNob3coJG1kRGlhbG9nLmFsZXJ0KClcblx0XHRcdFx0LnRpdGxlKG5hbWUpXG5cdFx0XHRcdC5jb250ZW50KCdZb3UgdHJpZ2dlcmVkIHRoZSBcIicgKyBuYW1lICsgJ1wiIGFjdGlvbicpXG5cdFx0XHRcdC5vaygnR3JlYXQnKVxuXHRcdFx0XHQudGFyZ2V0RXZlbnQoZXYpXG5cdFx0XHQpO1xuXHRcdH07XG5cbiAgICB0aGlzLm9wZW5Dc3ZVcGxvYWQgPSBmdW5jdGlvbigpIHtcblx0XHRcdCRtZERpYWxvZy5zaG93KHtcblx0XHRcdFx0XHQvL2NvbnRyb2xsZXI6IERpYWxvZ0NvbnRyb2xsZXIsXG5cdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICcvdmlld3MvYXBwL2ltcG9ydGNzdi9jc3ZVcGxvYWREaWFsb2cuaHRtbCcsXG5cdCAgICAgICAgYmluZFRvQ29udHJvbGxlcjogdHJ1ZSxcblx0XHRcdFx0fSlcblx0XHRcdFx0LnRoZW4oZnVuY3Rpb24gKGFuc3dlcikge1xuXG5cdFx0XHRcdH0sIGZ1bmN0aW9uICgpIHtcblxuXHRcdFx0XHR9KTtcblx0XHR9O1xuXHR9KVxuXG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0p3dEF1dGhDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCAkYXV0aCwgUmVzdGFuZ3VsYXIpe1xuXG5cdFx0dmFyIGNyZWRlbnRpYWxzID0ge307XG5cblx0XHQkc2NvcGUucmVxdWVzdFRva2VuID0gZnVuY3Rpb24oKXtcblx0XHRcdC8vIFVzZSBTYXRlbGxpemVyJ3MgJGF1dGggc2VydmljZSB0byBsb2dpbiBiZWNhdXNlIGl0J2xsIGF1dG9tYXRpY2FsbHkgc2F2ZSB0aGUgSldUIGluIGxvY2FsU3RvcmFnZVxuXHRcdFx0JGF1dGgubG9naW4oY3JlZGVudGlhbHMpLnRoZW4oZnVuY3Rpb24gKGRhdGEpe1xuXHRcdFx0XHQvLyBJZiBsb2dpbiBpcyBzdWNjZXNzZnVsLCByZWRpcmVjdCB0byB0aGUgdXNlcnMgc3RhdGVcblx0XHRcdFx0Ly8kc3RhdGUuZ28oJ2Rhc2hib2FyZCcpO1xuXHRcdFx0fSk7XG5cdFx0fTtcblxuXHRcdC8vIFRoaXMgcmVxdWVzdCB3aWxsIGhpdCB0aGUgZ2V0RGF0YSBtZXRob2QgaW4gdGhlIEF1dGhlbnRpY2F0ZUNvbnRyb2xsZXJcblx0XHQvLyBvbiB0aGUgTGFyYXZlbCBzaWRlIGFuZCB3aWxsIHJldHVybiB5b3VyIGRhdGEgdGhhdCByZXF1aXJlIGF1dGhlbnRpY2F0aW9uXG5cdFx0JHNjb3BlLmdldERhdGEgPSBmdW5jdGlvbigpe1xuXHRcdFx0UmVzdGFuZ3VsYXIuYWxsKCdhdXRoZW50aWNhdGUvZGF0YScpLmdldCgpLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKXtcblxuXHRcdFx0fSwgZnVuY3Rpb24gKGVycm9yKXt9KTtcblx0XHR9O1xuXG5cblxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignTGFuZGluZ0N0cmwnLCBmdW5jdGlvbigkc2NvcGUsICRtZFRvYXN0LCAkbWREaWFsb2csICRpbnRlcnZhbCwgVG9hc3RTZXJ2aWNlLCBEaWFsb2dTZXJ2aWNlKXtcblxuXHRcdCRzY29wZS5wcm9tb0ltYWdlID0gJ2h0dHBzOi8vaS5pbWd1ci5jb20vWmJMek9QUC5qcGcnO1xuXHRcdCRzY29wZS5pY29uID0gJ3NlbmQnO1xuXG5cdFx0dmFyIGljb25zID0gW1xuXHRcdFx0XHQnb2ZmaWNlJywgJ2ZhY2Vib29rJywgJ3R3aXR0ZXInLCAnYXBwbGUnLCAnd2hhdHNhcHAnLCAnbGlua2VkaW4nLCAnd2luZG93cycsICdhY2Nlc3NpYmlsaXR5JywgJ2FsYXJtJywgJ2FzcGVjdF9yYXRpbycsXG5cdFx0XHRcdCdhdXRvcmVuZXcnLCAnYm9va21hcmtfb3V0bGluZScsICdkYXNoYm9hcmQnLCAnZG5zJywgJ2Zhdm9yaXRlX291dGxpbmUnLCAnZ2V0X2FwcCcsICdoaWdobGlnaHRfcmVtb3ZlJywgJ2hpc3RvcnknLCAnbGlzdCcsXG5cdFx0XHRcdCdwaWN0dXJlX2luX3BpY3R1cmUnLCAncHJpbnQnLCAnc2V0dGluZ3NfZXRoZXJuZXQnLCAnc2V0dGluZ3NfcG93ZXInLCAnc2hvcHBpbmdfY2FydCcsICdzcGVsbGNoZWNrJywgJ3N3YXBfaG9yaXonLCAnc3dhcF92ZXJ0Jyxcblx0XHRcdFx0J3RodW1iX3VwJywgJ3RodW1ic191cF9kb3duJywgJ3RyYW5zbGF0ZScsICd0cmVuZGluZ191cCcsICd2aXNpYmlsaXR5JywgJ3dhcm5pbmcnLCAnbWljJywgJ3BsYXlfY2lyY2xlX291dGxpbmUnLCAncmVwZWF0Jyxcblx0XHRcdFx0J3NraXBfbmV4dCcsICdjYWxsJywgJ2NoYXQnLCAnY2xlYXJfYWxsJywgJ2RpYWxwYWQnLCAnZG5kX29uJywgJ2ZvcnVtJywgJ2xvY2F0aW9uX29uJywgJ3Zwbl9rZXknLCAnZmlsdGVyX2xpc3QnLCAnaW5ib3gnLFxuXHRcdFx0XHQnbGluaycsICdyZW1vdmVfY2lyY2xlX291dGxpbmUnLCAnc2F2ZScsICd0ZXh0X2Zvcm1hdCcsICdhY2Nlc3NfdGltZScsICdhaXJwbGFuZW1vZGVfb24nLCAnYmx1ZXRvb3RoJywgJ2RhdGFfdXNhZ2UnLFxuXHRcdFx0XHQnZ3BzX2ZpeGVkJywgJ25vd193YWxscGFwZXInLCAnbm93X3dpZGdldHMnLCAnc3RvcmFnZScsICd3aWZpX3RldGhlcmluZycsICdhdHRhY2hfZmlsZScsICdmb3JtYXRfbGluZV9zcGFjaW5nJyxcblx0XHRcdFx0J2Zvcm1hdF9saXN0X251bWJlcmVkJywgJ2Zvcm1hdF9xdW90ZScsICd2ZXJ0aWNhbF9hbGlnbl9jZW50ZXInLCAnd3JhcF90ZXh0JywgJ2Nsb3VkX3F1ZXVlJywgJ2ZpbGVfZG93bmxvYWQnLCAnZm9sZGVyX29wZW4nLFxuXHRcdFx0XHQnY2FzdCcsICdoZWFkc2V0JywgJ2tleWJvYXJkX2JhY2tzcGFjZScsICdtb3VzZScsICdzcGVha2VyJywgJ3dhdGNoJywgJ2F1ZGlvdHJhY2snLCAnZWRpdCcsICdicnVzaCcsICdsb29rcycsICdjcm9wX2ZyZWUnLFxuXHRcdFx0XHQnY2FtZXJhJywgJ2ZpbHRlcl92aW50YWdlJywgJ2hkcl9zdHJvbmcnLCAncGhvdG9fY2FtZXJhJywgJ3NsaWRlc2hvdycsICd0aW1lcicsICdkaXJlY3Rpb25zX2Jpa2UnLCAnaG90ZWwnLCAnbG9jYWxfbGlicmFyeScsXG5cdFx0XHRcdCdkaXJlY3Rpb25zX3dhbGsnLCAnbG9jYWxfY2FmZScsICdsb2NhbF9waXp6YScsICdsb2NhbF9mbG9yaXN0JywgJ215X2xvY2F0aW9uJywgJ25hdmlnYXRpb24nLCAncGluX2Ryb3AnLCAnYXJyb3dfYmFjaycsICdtZW51Jyxcblx0XHRcdFx0J2Nsb3NlJywgJ21vcmVfaG9yaXonLCAnbW9yZV92ZXJ0JywgJ3JlZnJlc2gnLCAncGhvbmVfcGF1c2VkJywgJ3ZpYnJhdGlvbicsICdjYWtlJywgJ2dyb3VwJywgJ21vb2QnLCAncGVyc29uJyxcblx0XHRcdFx0J25vdGlmaWNhdGlvbnNfbm9uZScsICdwbHVzX29uZScsICdzY2hvb2wnLCAnc2hhcmUnLCAnc3Rhcl9vdXRsaW5lJ1xuXHRcdFx0XSxcblx0XHRcdGNvdW50ZXIgPSAwO1xuXG5cdFx0JGludGVydmFsKGZ1bmN0aW9uKCl7XG5cdFx0XHQkc2NvcGUuaWNvbiA9IGljb25zWysrY291bnRlcl07XG5cdFx0XHRpZiAoY291bnRlciA+IDExMil7XG5cdFx0XHRcdGNvdW50ZXIgPSAwO1xuXHRcdFx0fVxuXHRcdH0sIDIwMDApO1xuXG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0xvZ2luQ3RybCcsIGZ1bmN0aW9uICgpe1xuXG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignTWFwQ3RybCcsIGZ1bmN0aW9uICgkc2NvcGUsICRyb290U2NvcGUsICR0aW1lb3V0LCBNYXBTZXJ2aWNlLCBsZWFmbGV0RGF0YSwgJGh0dHApIHtcblx0XHQvL1xuXHRcdHZhciBhcGlLZXkgPSAncGsuZXlKMUlqb2liV0ZuYm05c2J5SXNJbUVpT2lKdVNGZFVZa2c0SW4wLjVIT3lrS2swcE5QMU4zaXNmUFFHVFEnO1xuXG5cdFx0Lyokc2NvcGUuZGVmYXVsdHMgPSB7XG5cdFx0XHR0aWxlTGF5ZXI6ICdodHRwczovL3tzfS50aWxlcy5tYXBib3guY29tL3Y0L21hcGJveC5wZW5jaWwve3p9L3t4fS97eX0ucG5nP2FjY2Vzc190b2tlbj0nICsgYXBpS2V5LFxuXHRcdFx0bWF4Wm9vbTogMTQsXG5cdFx0XHRkZXRlY3RSZXRpbmE6IHRydWUsXG5cdFx0XHRhdHRyaWJ1dGlvbjogJydcblx0XHR9OyovXG5cdFx0JHNjb3BlLmNlbnRlciA9IHtcblx0XHRcdGxhdDogMCxcblx0XHRcdGxuZzogMCxcblx0XHRcdHpvb206IDNcblx0XHR9O1xuXHRcdCRzY29wZS5kZWZhdWx0cyA9IHtcblx0XHRcdHNjcm9sbFdoZWVsWm9vbTogZmFsc2Vcblx0XHR9O1xuXHRcdGFuZ3VsYXIuZXh0ZW5kKCRyb290U2NvcGUsIHtcblx0XHRcdGNlbnRlcjoge1xuXHRcdFx0XHRsYXQ6IDAsXG5cdFx0XHRcdGxuZzogMCxcblx0XHRcdFx0em9vbTogM1xuXHRcdFx0fSxcblx0XHRcdGxheWVyczoge1xuXHRcdFx0XHRiYXNlbGF5ZXJzOiB7XG5cdFx0XHRcdFx0eHl6OiB7XG5cdFx0XHRcdFx0XHRuYW1lOiAnTWFwQm94IFBlbmNpbCcsXG5cdFx0XHRcdFx0XHR1cmw6ICdodHRwczovL3tzfS50aWxlcy5tYXBib3guY29tL3Y0L21hcGJveC5vdXRkb29ycy97en0ve3h9L3t5fS5wbmc/YWNjZXNzX3Rva2VuPScgKyBhcGlLZXksXG5cdFx0XHRcdFx0XHR0eXBlOiAneHl6Jyxcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sXG5cdFx0XHRcdG92ZXJsYXlzOiB7XG5cdFx0XHRcdFx0ZGVtb3N1dGZncmlkOiB7XG5cdFx0XHRcdFx0XHRuYW1lOiAnVVRGR3JpZCBJbnRlcmFjdGl2aXR5Jyxcblx0XHRcdFx0XHRcdHR5cGU6ICd1dGZHcmlkJyxcblx0XHRcdFx0XHRcdHVybDogJ2h0dHA6Ly97c30udGlsZXMubWFwYm94LmNvbS92My9tYXBib3guZ2VvZ3JhcGh5LWNsYXNzL3t6fS97eH0ve3l9LmdyaWQuanNvbj9jYWxsYmFjaz17Y2J9Jyxcblx0XHRcdFx0XHRcdHZpc2libGU6IHRydWVcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdC8qd21zOiB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdCBuYW1lOiAnRUVVVSBTdGF0ZXMgKFdNUyknLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQgdHlwZTogJ3dtcycsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdCB2aXNpYmxlOiB0cnVlLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQgdXJsOiAnaHR0cDovL3N1aXRlLm9wZW5nZW8ub3JnL2dlb3NlcnZlci91c2Evd21zJyxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0IGxheWVyUGFyYW1zOiB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQgbGF5ZXJzOiAndXNhOnN0YXRlcycsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQgZm9ybWF0OiAnaW1hZ2UvcG5nJyxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdCB0cmFuc3BhcmVudDogdHJ1ZVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQgfVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdCB9Ki9cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdCRzY29wZS5zZWFyY2hJUCA9IGZ1bmN0aW9uIChpcCkge1xuXHRcdFx0dmFyIHVybCA9IFwiaHR0cDovL2ZyZWVnZW9pcC5uZXQvanNvbi9cIiArIGlwO1xuXHRcdFx0JGh0dHAuZ2V0KHVybCkuc3VjY2VzcyhmdW5jdGlvbiAocmVzKSB7XG5cdFx0XHRcdCRzY29wZS5jZW50ZXIgPSB7XG5cdFx0XHRcdFx0bGF0OiByZXMubGF0aXR1ZGUsXG5cdFx0XHRcdFx0bG5nOiByZXMubG9uZ2l0dWRlLFxuXHRcdFx0XHRcdHpvb206IDNcblx0XHRcdFx0fVxuXHRcdFx0XHQkc2NvcGUuaXAgPSByZXMuaXA7XG5cdFx0XHR9KVxuXHRcdH07XG5cblx0XHQvLyRzY29wZS5zZWFyY2hJUChcIlwiKTtcblx0XHQkc2NvcGUuaW50ZXJhY3Rpdml0eSA9IFwiXCI7XG5cdFx0JHNjb3BlLmZsYWcgPSBcIlwiO1xuXHRcdCRzY29wZS4kb24oJ2xlYWZsZXREaXJlY3RpdmVNYXAudXRmZ3JpZE1vdXNlb3ZlcicsIGZ1bmN0aW9uIChldmVudCwgbGVhZmxldEV2ZW50KSB7XG5cdFx0XHQvLyB0aGUgVVRGR3JpZCBpbmZvcm1hdGlvbiBpcyBvbiBsZWFmbGV0RXZlbnQuZGF0YVxuXHRcdFx0JHNjb3BlLmludGVyYWN0aXZpdHkgPSBsZWFmbGV0RXZlbnQuZGF0YS5hZG1pbjtcblx0XHRcdCRzY29wZS5mbGFnID0gXCJkYXRhOmltYWdlL3BuZztiYXNlNjQsXCIgKyBsZWFmbGV0RXZlbnQuZGF0YS5mbGFnX3BuZztcblxuXHRcdH0pO1xuXHRcdCRzY29wZS4kb24oJ2xlYWZsZXREaXJlY3RpdmVNYXAudXRmZ3JpZE1vdXNlb3V0JywgZnVuY3Rpb24gKGV2ZW50LCBsZWFmbGV0RXZlbnQpIHtcblx0XHRcdCRzY29wZS5pbnRlcmFjdGl2aXR5ID0gXCJcIjtcblx0XHRcdCRzY29wZS5mbGFnID0gXCJcIjtcblx0XHR9KTtcblx0XHRNYXBTZXJ2aWNlLnNldExlYWZsZXREYXRhKGxlYWZsZXREYXRhLmdldE1hcCgnbWFwJykpO1xuXG5cdH0pO1xufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ01pc2NDdHJsJywgZnVuY3Rpb24oKXtcbiAgICAgICAgLy9cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ1Jlc3RBcGlDdHJsJywgZnVuY3Rpb24oKXtcbiAgICAgICAgLy9cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignU2lkZWJhckN0cmwnLCBmdW5jdGlvbigkc2NvcGUsICRzdGF0ZSl7XG5cblxuXHR9KTtcblxufSkoKTsiLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0Rhc2hib2FyZEN0cmwnLCBmdW5jdGlvbigpe1xuXG5cdH0pO1xuXG59KSgpOyIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignVG9hc3RzQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgVG9hc3RTZXJ2aWNlKXtcblxuXHRcdCRzY29wZS50b2FzdFN1Y2Nlc3MgPSBmdW5jdGlvbigpe1xuXHRcdFx0VG9hc3RTZXJ2aWNlLnNob3coJ1VzZXIgYWRkZWQgc3VjY2Vzc2Z1bGx5IScpO1xuXHRcdH07XG5cblx0XHQkc2NvcGUudG9hc3RFcnJvciA9IGZ1bmN0aW9uKCl7XG5cdFx0XHRUb2FzdFNlcnZpY2UuZXJyb3IoJ0Nvbm5lY3Rpb24gaW50ZXJydXB0ZWQhJyk7XG5cdFx0fTtcblxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ1Vuc3VwcG9ydGVkQnJvd3NlckN0cmwnLCBmdW5jdGlvbigpe1xuICAgICAgICAvL1xuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignQWRkVXNlcnNDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBEaWFsb2dTZXJ2aWNlKXtcblxuICAgICAgICAkc2NvcGUuc2F2ZSA9IGZ1bmN0aW9uKCl7XG5cdCAgICAgICAgLy9kbyBzb21ldGhpbmcgdXNlZnVsXG4gICAgICAgICAgICBEaWFsb2dTZXJ2aWNlLmhpZGUoKTtcbiAgICAgICAgfTtcblxuICAgICAgICAkc2NvcGUuaGlkZSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIFx0RGlhbG9nU2VydmljZS5oaWRlKCk7XG4gICAgICAgIH07XG5cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSggJ2FwcC5jb250cm9sbGVycycgKS5jb250cm9sbGVyKCAnQnViYmxlc0N0cmwnLCBmdW5jdGlvbigpe1xuXHRcdC8vXG4gIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0ZnVuY3Rpb24gQ3VzdG9tVG9vbHRpcCh0b29sdGlwSWQsIHdpZHRoKSB7XG5cdFx0dmFyIHRvb2x0aXBJZCA9IHRvb2x0aXBJZDtcblx0XHR2YXIgZWxlbSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRvb2x0aXBJZCk7XG5cdFx0aWYoZWxlbSA9PSBudWxsKXtcblx0XHRcdGFuZ3VsYXIuZWxlbWVudChkb2N1bWVudCkuZmluZCgnYm9keScpLmFwcGVuZChcIjxkaXYgY2xhc3M9J3Rvb2x0aXAgbWQtd2hpdGVmcmFtZS16MycgaWQ9J1wiICsgdG9vbHRpcElkICsgXCInPjwvZGl2PlwiKTtcblx0XHR9XG5cdFx0aGlkZVRvb2x0aXAoKTtcblx0XHRmdW5jdGlvbiBzaG93VG9vbHRpcChjb250ZW50LCBkYXRhLCBldmVudCwgZWxlbWVudCkge1xuXHRcdFx0YW5ndWxhci5lbGVtZW50KGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyMnICsgdG9vbHRpcElkKSkuaHRtbChjb250ZW50KTtcblx0XHRcdGFuZ3VsYXIuZWxlbWVudChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjJyArIHRvb2x0aXBJZCkpLmNzcygnZGlzcGxheScsICdibG9jaycpO1xuXG5cdFx0XHRyZXR1cm4gdXBkYXRlUG9zaXRpb24oZXZlbnQsIGRhdGEsIGVsZW1lbnQpO1xuXHRcdH1cblx0XHRmdW5jdGlvbiBoaWRlVG9vbHRpcCgpIHtcblx0XHRcdGFuZ3VsYXIuZWxlbWVudChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjJyArIHRvb2x0aXBJZCkpLmNzcygnZGlzcGxheScsICdub25lJyk7XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIHVwZGF0ZVBvc2l0aW9uKGV2ZW50LCBkLCBlbGVtZW50KSB7XG5cdFx0XHR2YXIgdHRpZCA9IFwiI1wiICsgdG9vbHRpcElkO1xuXHRcdFx0dmFyIHhPZmZzZXQgPSAyMDtcblx0XHRcdHZhciB5T2Zmc2V0ID0gMTA7XG5cdFx0XHR2YXIgc3ZnID0gZWxlbWVudC5maW5kKCdzdmcnKVswXTsvL2RvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNzdmdfdmlzJyk7XG5cdFx0XHR2YXIgd3NjclkgPSB3aW5kb3cuc2Nyb2xsWTtcblx0XHRcdHZhciB0dHcgPSBhbmd1bGFyLmVsZW1lbnQoZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0dGlkKSkub2Zmc2V0V2lkdGg7XG5cdFx0XHR2YXIgdHRoID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0dGlkKS5vZmZzZXRIZWlnaHQ7XG5cdFx0XHR2YXIgdHR0b3AgPSBzdmcuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wICsgZC55IC0gdHRoIC8gMjtcblx0XHRcdHZhciB0dGxlZnQgPSBzdmcuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkubGVmdCArIGQueCArIGQucmFkaXVzICsgMTI7XG5cdFx0XHRyZXR1cm4gYW5ndWxhci5lbGVtZW50KGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodHRpZCkpLmNzcygndG9wJywgdHR0b3AgKyAncHgnKS5jc3MoJ2xlZnQnLCB0dGxlZnQgKyAncHgnKTtcblx0XHR9XG5cdFx0cmV0dXJuIHtcblx0XHRcdHNob3dUb29sdGlwOiBzaG93VG9vbHRpcCxcblx0XHRcdGhpZGVUb29sdGlwOiBoaWRlVG9vbHRpcCxcblx0XHRcdHVwZGF0ZVBvc2l0aW9uOiB1cGRhdGVQb3NpdGlvblxuXHRcdH1cblx0fVxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmRpcmVjdGl2ZXMnKS5kaXJlY3RpdmUoJ2J1YmJsZXMnLCBmdW5jdGlvbiAoJGNvbXBpbGUpIHtcblx0XHR2YXIgZGVmYXVsdHM7XG5cdFx0ZGVmYXVsdHMgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHR3aWR0aDogMzIwLFxuXHRcdFx0XHRoZWlnaHQ6IDMwMCxcblx0XHRcdFx0bGF5b3V0X2dyYXZpdHk6IDAsXG5cdFx0XHRcdHNpemVmYWN0b3I6Myxcblx0XHRcdFx0dmlzOiBudWxsLFxuXHRcdFx0XHRmb3JjZTogbnVsbCxcblx0XHRcdFx0ZGFtcGVyOiAwLjEsXG5cdFx0XHRcdGNpcmNsZXM6IG51bGwsXG5cdFx0XHRcdGJvcmRlcnM6IHRydWUsXG5cdFx0XHRcdGZpbGxfY29sb3I6IGQzLnNjYWxlLm9yZGluYWwoKS5kb21haW4oW1wiZWhcIiwgXCJldlwiXSkucmFuZ2UoW1wiI2EzMTAzMVwiLCBcIiNiZWNjYWVcIl0pLFxuXHRcdFx0XHRtYXhfYW1vdW50OiAnJyxcblx0XHRcdFx0cmFkaXVzX3NjYWxlOiAnJyxcblx0XHRcdFx0ZHVyYXRpb246IDEwMDAsXG5cdFx0XHRcdHRvb2x0aXA6IEN1c3RvbVRvb2x0aXAoXCJidWJibGVzX3Rvb2x0aXBcIiwgMjQwKVxuXHRcdFx0fTtcblx0XHR9O1xuXHRcdHJldHVybiB7XG5cdFx0XHRyZXN0cmljdDogJ0UnLFxuXHRcdFx0c2NvcGU6IHtcblx0XHRcdFx0Y2hhcnRkYXRhOiAnPScsXG5cdFx0XHRcdGRpcmVjdGlvbjogJz0nLFxuXHRcdFx0XHRncmF2aXR5OiAnPScsXG5cdFx0XHRcdHNpemVmYWN0b3I6ICc9Jyxcblx0XHRcdFx0aW5kZXhlcjogJz0nLFxuXHRcdFx0XHRib3JkZXJzOiAnQCdcblx0XHRcdH0sXG5cdFx0XHRyZXF1aXJlOiAnbmdNb2RlbCcsXG5cdFx0XHRsaW5rOiBmdW5jdGlvbiAoc2NvcGUsIGVsZW0sIGF0dHJzLCBuZ01vZGVsKSB7XG5cdFx0XHRcdHZhciBvcHRpb25zID0gYW5ndWxhci5leHRlbmQoZGVmYXVsdHMoKSwgYXR0cnMpO1xuXHRcdFx0XHR2YXIgbm9kZXMgPSBbXSxcblx0XHRcdFx0XHRsaW5rcyA9IFtdLFxuXHRcdFx0XHRcdGdyb3VwcyA9IFtdO1xuXG5cdFx0XHRcdHZhciBtYXhfYW1vdW50ID0gZDMubWF4KHNjb3BlLmNoYXJ0ZGF0YSwgZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRyZXR1cm4gcGFyc2VJbnQoZC52YWx1ZSk7XG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRcdG9wdGlvbnMucmFkaXVzX3NjYWxlID0gZDMuc2NhbGUucG93KCkuZXhwb25lbnQoMC41KS5kb21haW4oWzAsIG1heF9hbW91bnRdKS5yYW5nZShbMiwgODVdKTtcblx0XHRcdFx0b3B0aW9ucy5jZW50ZXIgPSB7XG5cdFx0XHRcdFx0eDogb3B0aW9ucy53aWR0aCAvIDIsXG5cdFx0XHRcdFx0eTogb3B0aW9ucy5oZWlnaHQgLyAyXG5cdFx0XHRcdH07XG5cdFx0XHRcdG9wdGlvbnMuY2F0X2NlbnRlcnMgPSB7XG5cdFx0XHRcdFx0XCJlaFwiOiB7XG5cdFx0XHRcdFx0XHR4OiBvcHRpb25zLndpZHRoIC8gMixcblx0XHRcdFx0XHRcdHk6IG9wdGlvbnMuaGVpZ2h0ICAqIDAuNDUsXG5cdFx0XHRcdFx0XHRkYW1wZXI6IDAuMDg1XG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcImV2XCI6IHtcblx0XHRcdFx0XHRcdHg6IG9wdGlvbnMud2lkdGggLyAyLFxuXHRcdFx0XHRcdFx0eTogb3B0aW9ucy5oZWlnaHQgICogMC41NSxcblx0XHRcdFx0XHRcdGRhbXBlcjogMC4wODVcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH07XG5cdFx0XHRcdHZhciBjcmVhdGVfbm9kZXMgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0Ly9jb25zb2xlLmxvZyhzY29wZS5pbmRleGVyKTtcblx0XHRcdFx0XHQvL2NvbnNvbGUubG9nKHNjb3BlLmNoYXJ0ZGF0YSk7XG5cdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKHNjb3BlLmluZGV4ZXIsIGZ1bmN0aW9uIChncm91cCkge1xuXHRcdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKGdyb3VwLmNoaWxkcmVuLCBmdW5jdGlvbiAoaXRlbSkge1xuXHRcdFx0XHRcdFx0XHQvL2NvbnNvbGUubG9nKHNjb3BlLmNoYXJ0ZGF0YVtpdGVtLmNvbHVtbl9uYW1lXSwgc2NvcGUuY2hhcnRkYXRhW2l0ZW0uY29sdW1uX25hbWVdIC8gc2NvcGUuc2l6ZWZhY3Rvcik7XG5cdFx0XHRcdFx0XHRcdGlmIChzY29wZS5jaGFydGRhdGFbaXRlbS5jb2x1bW5fbmFtZV0pIHtcblx0XHRcdFx0XHRcdFx0XHR2YXIgbm9kZSA9IHtcblx0XHRcdFx0XHRcdFx0XHRcdHR5cGU6IGl0ZW0uY29sdW1uX25hbWUsXG5cdFx0XHRcdFx0XHRcdFx0XHRyYWRpdXM6IHNjb3BlLmNoYXJ0ZGF0YVtpdGVtLmNvbHVtbl9uYW1lXSAvIHNjb3BlLnNpemVmYWN0b3IsXG5cdFx0XHRcdFx0XHRcdFx0XHR2YWx1ZTogc2NvcGUuY2hhcnRkYXRhW2l0ZW0uY29sdW1uX25hbWVdIC8gc2NvcGUuc2l6ZWZhY3Rvcixcblx0XHRcdFx0XHRcdFx0XHRcdG5hbWU6IGl0ZW0udGl0bGUsXG5cdFx0XHRcdFx0XHRcdFx0XHRncm91cDogZ3JvdXAuY29sdW1uX25hbWUuc3Vic3RyaW5nKDAsMiksXG5cdFx0XHRcdFx0XHRcdFx0XHR4OiBvcHRpb25zLmNlbnRlci54LFxuXHRcdFx0XHRcdFx0XHRcdFx0eTogb3B0aW9ucy5jZW50ZXIueSxcblx0XHRcdFx0XHRcdFx0XHRcdGNvbG9yOiBpdGVtLmNvbG9yLFxuXHRcdFx0XHRcdFx0XHRcdFx0aWNvbjogaXRlbS5pY29uLFxuXHRcdFx0XHRcdFx0XHRcdFx0dW5pY29kZTogaXRlbS51bmljb2RlLFxuXHRcdFx0XHRcdFx0XHRcdFx0ZGF0YTogaXRlbVxuXHRcdFx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0XHRcdFx0bm9kZXMucHVzaChub2RlKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0Y3JlYXRlX2dyb3VwcygpO1xuXHRcdFx0XHR9O1xuXHRcdFx0XHR2YXIgY3JlYXRlX2dyb3VwcyA9IGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0Z3JvdXBzID0ge307XG5cdFx0XHRcdFx0dmFyIGNvdW50ID0gMDtcblx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2gobm9kZXMsIGZ1bmN0aW9uKG5vZGUpe1xuXHRcdFx0XHRcdFx0XHR2YXIgZXhpc3RzID0gZmFsc2U7XG5cdFx0XHRcdFx0XHRcdHZhciBncm91cCA9IHt9O1xuXHRcdFx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2goZ3JvdXBzLCBmdW5jdGlvbihncm91cCwgaW5kZXgpe1xuXHRcdFx0XHRcdFx0XHRcdGlmKG5vZGUuZ3JvdXAgPT0gaW5kZXgpe1xuXHRcdFx0XHRcdFx0XHRcdFx0ZXhpc3RzID0gdHJ1ZTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0XHRpZighZXhpc3RzKXtcblx0XHRcdFx0XHRcdFx0XHRjb3VudCsrO1xuXHRcdFx0XHRcdFx0XHRcdGdyb3Vwc1tub2RlLmdyb3VwXSA9IHtcblx0XHRcdFx0XHRcdFx0XHRcdHg6IG9wdGlvbnMud2lkdGggLyAyLFxuXHRcdFx0XHRcdFx0XHRcdFx0eTogb3B0aW9ucy5oZWlnaHQgLyAyICsgKDEgLSBjb3VudCksXG5cdFx0XHRcdFx0XHRcdFx0XHRkYW1wZXI6IDAuMDg1XG5cdFx0XHRcdFx0XHRcdFx0fTtcblxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2coZ3JvdXBzKTtcblx0XHRcdFx0fTtcblx0XHRcdFx0dmFyIGNyZWF0ZV92aXMgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0YW5ndWxhci5lbGVtZW50KGVsZW0pLmh0bWwoJycpO1xuXHRcdFx0XHRcdG9wdGlvbnMudmlzID0gZDMuc2VsZWN0KGVsZW1bMF0pLmFwcGVuZChcInN2Z1wiKS5hdHRyKFwid2lkdGhcIiwgb3B0aW9ucy53aWR0aCkuYXR0cihcImhlaWdodFwiLCBvcHRpb25zLmhlaWdodCkuYXR0cihcImlkXCIsIFwic3ZnX3Zpc1wiKTtcblxuXHRcdFx0XHRcdGlmICghb3B0aW9ucy5ib3JkZXJzKSB7XG5cdFx0XHRcdFx0XHR2YXIgcGkgPSBNYXRoLlBJO1xuXHRcdFx0XHRcdFx0dmFyIGFyY1RvcCA9IGQzLnN2Zy5hcmMoKVxuXHRcdFx0XHRcdFx0XHQuaW5uZXJSYWRpdXMoMTA5KVxuXHRcdFx0XHRcdFx0XHQub3V0ZXJSYWRpdXMoMTEwKVxuXHRcdFx0XHRcdFx0XHQuc3RhcnRBbmdsZSgtOTAgKiAocGkgLyAxODApKSAvL2NvbnZlcnRpbmcgZnJvbSBkZWdzIHRvIHJhZGlhbnNcblx0XHRcdFx0XHRcdFx0LmVuZEFuZ2xlKDkwICogKHBpIC8gMTgwKSk7IC8vanVzdCByYWRpYW5zXG5cdFx0XHRcdFx0XHR2YXIgYXJjQm90dG9tID0gZDMuc3ZnLmFyYygpXG5cdFx0XHRcdFx0XHRcdC5pbm5lclJhZGl1cygxMzQpXG5cdFx0XHRcdFx0XHRcdC5vdXRlclJhZGl1cygxMzUpXG5cdFx0XHRcdFx0XHRcdC5zdGFydEFuZ2xlKDkwICogKHBpIC8gMTgwKSkgLy9jb252ZXJ0aW5nIGZyb20gZGVncyB0byByYWRpYW5zXG5cdFx0XHRcdFx0XHRcdC5lbmRBbmdsZSgyNzAgKiAocGkgLyAxODApKTsgLy9qdXN0IHJhZGlhbnNcblxuXHRcdFx0XHRcdFx0b3B0aW9ucy5hcmNUb3AgPSBvcHRpb25zLnZpcy5hcHBlbmQoXCJwYXRoXCIpXG5cdFx0XHRcdFx0XHRcdC5hdHRyKFwiZFwiLCBhcmNUb3ApXG5cdFx0XHRcdFx0XHRcdC5hdHRyKFwiZmlsbFwiLCBcIiNiZTVmMDBcIilcblx0XHRcdFx0XHRcdFx0LmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoMTcwLDE0MClcIik7XG5cdFx0XHRcdFx0XHRvcHRpb25zLmFyY0JvdHRvbSA9IG9wdGlvbnMudmlzLmFwcGVuZChcInBhdGhcIilcblx0XHRcdFx0XHRcdFx0LmF0dHIoXCJkXCIsIGFyY0JvdHRvbSlcblx0XHRcdFx0XHRcdFx0LmF0dHIoXCJmaWxsXCIsIFwiIzAwNmJiNlwiKVxuXHRcdFx0XHRcdFx0XHQuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZSgxNzAsMTgwKVwiKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0b3B0aW9ucy5jb250YWluZXJzID0gb3B0aW9ucy52aXMuc2VsZWN0QWxsKCdnLm5vZGUnKS5kYXRhKG5vZGVzKS5lbnRlcigpLmFwcGVuZCgnZycpLmF0dHIoJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoJyArIChvcHRpb25zLndpZHRoIC8gMikgKyAnLCcgKyAob3B0aW9ucy5oZWlnaHQgLyAyKSArICcpJykuYXR0cignY2xhc3MnLCAnbm9kZScpO1xuXG5cdFx0XHRcdFx0LypvcHRpb25zLmNpcmNsZXMgPSBvcHRpb25zLmNvbnRhaW5lcnMuc2VsZWN0QWxsKFwiY2lyY2xlXCIpLmRhdGEobm9kZXMsIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZC5pZDtcblx0XHRcdFx0XHR9KTsqL1xuXG5cdFx0XHRcdFx0b3B0aW9ucy5jaXJjbGVzID0gb3B0aW9ucy5jb250YWluZXJzLmFwcGVuZChcImNpcmNsZVwiKS5hdHRyKFwiclwiLCAwKS5hdHRyKFwiZmlsbFwiLCAoZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdHJldHVybiBkLmNvbG9yIHx8IG9wdGlvbnMuZmlsbF9jb2xvcihkLmdyb3VwKTtcblx0XHRcdFx0XHR9KSkuYXR0cihcInN0cm9rZS13aWR0aFwiLCAwKS5hdHRyKFwic3Ryb2tlXCIsIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZDMucmdiKG9wdGlvbnMuZmlsbF9jb2xvcihkLmdyb3VwKSkuZGFya2VyKCk7XG5cdFx0XHRcdFx0fSkuYXR0cihcImlkXCIsIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gXCJidWJibGVfXCIgKyBkLmlkO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdG9wdGlvbnMuaWNvbnMgPSBvcHRpb25zLmNvbnRhaW5lcnMuYXBwZW5kKFwidGV4dFwiKVxuXHRcdFx0XHRcdFx0LmF0dHIoJ2ZvbnQtZmFtaWx5JywgJ0VQSScpXG5cdFx0XHRcdFx0XHQuYXR0cignZm9udC1zaXplJywgZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdFx0MFxuXHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRcdC5hdHRyKFwidGV4dC1hbmNob3JcIiwgXCJtaWRkbGVcIilcblx0XHRcdFx0XHRcdC5hdHRyKCdmaWxsJywgJyNmZmYnKVxuXHRcdFx0XHRcdFx0LnRleHQoZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGQudW5pY29kZVxuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0b3B0aW9ucy5pY29ucy5vbihcIm1vdXNlb3ZlclwiLCBmdW5jdGlvbiAoZCwgaSkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIHNob3dfZGV0YWlscyhkLCBpLCB0aGlzKTtcblx0XHRcdFx0XHR9KS5vbihcIm1vdXNlb3V0XCIsIGZ1bmN0aW9uIChkLCBpKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gaGlkZV9kZXRhaWxzKGQsIGksIHRoaXMpO1xuXHRcdFx0XHRcdH0pLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24gKGQsIGkpIHtcblx0XHRcdFx0XHRcdG5nTW9kZWwuJHNldFZpZXdWYWx1ZShkKTtcblx0XHRcdFx0XHRcdG5nTW9kZWwuJHJlbmRlcigpO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdG9wdGlvbnMuY2lyY2xlcy50cmFuc2l0aW9uKCkuZHVyYXRpb24ob3B0aW9ucy5kdXJhdGlvbikuYXR0cihcInJcIiwgZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdHJldHVybiBkLnJhZGl1cztcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRvcHRpb25zLmljb25zLnRyYW5zaXRpb24oKS5kdXJhdGlvbihvcHRpb25zLmR1cmF0aW9uKS5hdHRyKFwiZm9udC1zaXplXCIsIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZC5yYWRpdXMgKiAxLjc1ICsgJ3B4Jztcblx0XHRcdFx0XHR9KS5hdHRyKCd5JywgZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdHJldHVybiBkLnJhZGl1cyAqIC43NSArICdweCc7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH07XG5cdFx0XHRcdHZhciB1cGRhdGVfdmlzID0gZnVuY3Rpb24gKCkge1xuXG5cdFx0XHRcdFx0bm9kZXMuZm9yRWFjaChmdW5jdGlvbiAoZCwgaSkge1xuXHRcdFx0XHRcdFx0b3B0aW9ucy5jaXJjbGVzLnRyYW5zaXRpb24oKS5kdXJhdGlvbihvcHRpb25zLmR1cmF0aW9uKS5kZWxheShpICogb3B0aW9ucy5kdXJhdGlvbilcblx0XHRcdFx0XHRcdFx0LmF0dHIoXCJyXCIsIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRcdFx0ZC5yYWRpdXMgPSBkLnZhbHVlID0gc2NvcGUuY2hhcnRkYXRhW2QudHlwZV0gLyBzY29wZS5zaXplZmFjdG9yO1xuXG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIHNjb3BlLmNoYXJ0ZGF0YVtkLnR5cGVdIC8gc2NvcGUuc2l6ZWZhY3Rvcjtcblx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRvcHRpb25zLmljb25zLnRyYW5zaXRpb24oKS5kdXJhdGlvbihvcHRpb25zLmR1cmF0aW9uKS5kZWxheShpICogb3B0aW9ucy5kdXJhdGlvbilcblx0XHRcdFx0XHRcdFx0LmF0dHIoXCJmb250LXNpemVcIiwgZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gKHNjb3BlLmNoYXJ0ZGF0YVtkLnR5cGVdIC8gc2NvcGUuc2l6ZWZhY3RvcikgKiAxLjc1ICsgJ3B4J1xuXHRcdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0XHQuYXR0cigneScsIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIChzY29wZS5jaGFydGRhdGFbZC50eXBlXSAvIHNjb3BlLnNpemVmYWN0b3IpICogLjc1ICsgJ3B4Jztcblx0XHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fTtcblx0XHRcdFx0dmFyIGNoYXJnZSA9IGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0cmV0dXJuIC1NYXRoLnBvdyhkLnJhZGl1cywgMi4wKSAvIDQ7XG5cdFx0XHRcdH07XG5cdFx0XHRcdHZhciBzdGFydCA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRyZXR1cm4gb3B0aW9ucy5mb3JjZSA9IGQzLmxheW91dC5mb3JjZSgpLm5vZGVzKG5vZGVzKS5zaXplKFtvcHRpb25zLndpZHRoLCBvcHRpb25zLmhlaWdodF0pLmxpbmtzKGxpbmtzKTtcblx0XHRcdFx0fTtcblx0XHRcdFx0dmFyIGRpc3BsYXlfZ3JvdXBfYWxsID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdG9wdGlvbnMuZm9yY2UuZ3Jhdml0eShvcHRpb25zLmxheW91dF9ncmF2aXR5KS5jaGFyZ2UoY2hhcmdlKS5mcmljdGlvbigwLjkpLm9uKFwidGlja1wiLCBmdW5jdGlvbiAoZSkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIG9wdGlvbnMuY2lyY2xlcy5lYWNoKG1vdmVfdG93YXJkc19jZW50ZXIoZS5hbHBoYSkpLmF0dHIoJ2N4JywgZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGQueDtcblx0XHRcdFx0XHRcdH0pLmF0dHIoXCJjeVwiLCBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gZC55O1xuXHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRvcHRpb25zLmZvcmNlLnN0YXJ0KCk7XG5cdFx0XHRcdH07XG5cdFx0XHRcdHZhciBkaXNwbGF5X2J5X2NhdCA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRvcHRpb25zLmZvcmNlLmdyYXZpdHkob3B0aW9ucy5sYXlvdXRfZ3Jhdml0eSkuY2hhcmdlKGNoYXJnZSkuZnJpY3Rpb24oMC45KS5vbihcInRpY2tcIiwgZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0XHRcdG9wdGlvbnMuY29udGFpbmVycy5lYWNoKG1vdmVfdG93YXJkc19jYXQoZS5hbHBoYSkpLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuICd0cmFuc2xhdGUoJyArIGQueCArICcsJyArIGQueSArICcpJztcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdG9wdGlvbnMuZm9yY2Uuc3RhcnQoKTtcblx0XHRcdFx0fTtcblx0XHRcdFx0dmFyIG1vdmVfdG93YXJkc19jZW50ZXIgPSBmdW5jdGlvbiAoYWxwaGEpIHtcblx0XHRcdFx0XHRyZXR1cm4gKGZ1bmN0aW9uIChfdGhpcykge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRcdGQueCA9IGQueCArIChvcHRpb25zLmNlbnRlci54IC0gZC54KSAqIChvcHRpb25zLmRhbXBlciArIDAuMDIpICogYWxwaGE7XG5cdFx0XHRcdFx0XHRcdGQueSA9IGQueSArIChvcHRpb25zLmNlbnRlci55IC0gZC55KSAqIChvcHRpb25zLmRhbXBlciArIDAuMDIpICogYWxwaGE7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSkodGhpcyk7XG5cdFx0XHRcdH07XG5cdFx0XHRcdHZhciBtb3ZlX3Rvd2FyZHNfdG9wID0gZnVuY3Rpb24gKGFscGhhKSB7XG5cdFx0XHRcdFx0cmV0dXJuIChmdW5jdGlvbiAoX3RoaXMpIHtcblx0XHRcdFx0XHRcdHJldHVybiBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0XHRkLnggPSBkLnggKyAob3B0aW9ucy5jZW50ZXIueCAtIGQueCkgKiAob3B0aW9ucy5kYW1wZXIgKyAwLjAyKSAqIGFscGhhICogMS4xO1xuXHRcdFx0XHRcdFx0XHRkLnkgPSBkLnkgKyAoMjAwIC0gZC55KSAqIChvcHRpb25zLmRhbXBlciArIDAuMDIpICogYWxwaGEgKiAxLjE7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSkodGhpcyk7XG5cdFx0XHRcdH07XG5cdFx0XHRcdHZhciBtb3ZlX3Rvd2FyZHNfY2F0ID0gZnVuY3Rpb24gKGFscGhhKSB7XG5cdFx0XHRcdFx0cmV0dXJuIChmdW5jdGlvbiAoX3RoaXMpIHtcblx0XHRcdFx0XHRcdHJldHVybiBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0XHR2YXIgdGFyZ2V0O1xuXHRcdFx0XHRcdFx0XHR0YXJnZXQgPSBvcHRpb25zLmNhdF9jZW50ZXJzW2QuZ3JvdXBdO1xuXHRcdFx0XHRcdFx0XHRkLnggPSBkLnggKyAodGFyZ2V0LnggLSBkLngpICogKHRhcmdldC5kYW1wZXIgKyAwLjAyKSAqIGFscGhhICogMTtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGQueSA9IGQueSArICh0YXJnZXQueSAtIGQueSkgKiAodGFyZ2V0LmRhbXBlciArIDAuMDIpICogYWxwaGEgKiAxO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pKHRoaXMpO1xuXHRcdFx0XHR9O1xuXHRcdFx0XHR2YXIgc2hvd19kZXRhaWxzID0gZnVuY3Rpb24gKGRhdGEsIGksIGVsZW1lbnQpIHtcblx0XHRcdFx0XHR2YXIgY29udGVudDtcblx0XHRcdFx0XHRjb250ZW50ID0gXCI8c3BhbiBjbGFzcz1cXFwidGl0bGVcXFwiPlwiICsgZGF0YS5uYW1lICsgXCI6PC9zcGFuPjxici8+XCI7XG5cdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKGRhdGEuZGF0YS5jaGlsZHJlbiwgZnVuY3Rpb24gKGluZm8pIHtcblx0XHRcdFx0XHRcdGNvbnRlbnQgKz0gXCI8c3BhbiBjbGFzcz1cXFwibmFtZVxcXCIgc3R5bGU9XFxcImNvbG9yOlwiICsgKGluZm8uY29sb3IgfHwgZGF0YS5jb2xvcikgKyBcIlxcXCI+IFwiICsgKGluZm8udGl0bGUpICsgXCI8L3NwYW4+PGJyLz5cIjtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHQkY29tcGlsZShvcHRpb25zLnRvb2x0aXAuc2hvd1Rvb2x0aXAoY29udGVudCwgZGF0YSwgZDMuZXZlbnQsIGVsZW0pLmNvbnRlbnRzKCkpKHNjb3BlKTtcblx0XHRcdFx0fTtcblxuXHRcdFx0XHR2YXIgaGlkZV9kZXRhaWxzID0gZnVuY3Rpb24gKGRhdGEsIGksIGVsZW1lbnQpIHtcblx0XHRcdFx0XHRyZXR1cm4gb3B0aW9ucy50b29sdGlwLmhpZGVUb29sdGlwKCk7XG5cdFx0XHRcdH07XG5cblx0XHRcdFx0c2NvcGUuJHdhdGNoKCdjaGFydGRhdGEnLCBmdW5jdGlvbiAoZGF0YSwgb2xkRGF0YSkge1xuXHRcdFx0XHRcdG9wdGlvbnMudG9vbHRpcC5oaWRlVG9vbHRpcCgpO1xuXHRcdFx0XHRcdGlmIChvcHRpb25zLmNpcmNsZXMgPT0gbnVsbCkge1xuXHRcdFx0XHRcdFx0Y3JlYXRlX25vZGVzKCk7XG5cdFx0XHRcdFx0XHRjcmVhdGVfdmlzKCk7XG5cdFx0XHRcdFx0XHRzdGFydCgpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHR1cGRhdGVfdmlzKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGRpc3BsYXlfYnlfY2F0KCk7XG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRcdHNjb3BlLiR3YXRjaCgnZGlyZWN0aW9uJywgZnVuY3Rpb24gKG9sZEQsIG5ld0QpIHtcblx0XHRcdFx0XHRpZiAob2xkRCA9PT0gbmV3RCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAob2xkRCA9PSBcImFsbFwiKSB7XG5cdFx0XHRcdFx0XHRkaXNwbGF5X2dyb3VwX2FsbCgpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRkaXNwbGF5X2J5X2NhdCgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSlcblx0XHRcdH1cblx0XHR9O1xuXHR9KTtcbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoICdhcHAuY29udHJvbGxlcnMnICkuY29udHJvbGxlciggJ0NpcmNsZWdyYXBoQ3RybCcsIGZ1bmN0aW9uKCl7XG5cdFx0Ly9cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5kaXJlY3RpdmVzJykuZGlyZWN0aXZlKCdjaXJjbGVncmFwaCcsIGZ1bmN0aW9uKCR0aW1lb3V0KSB7XG5cdFx0dmFyIGRlZmF1bHRzID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHR3aWR0aDogODAsXG5cdFx0XHRcdGhlaWdodDogODAsXG5cdFx0XHRcdGNvbG9yOiAnIzAwY2NhYScsXG5cdFx0XHRcdHNpemU6IDE3OFxuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4ge1xuXHRcdFx0cmVzdHJpY3Q6ICdFJyxcblx0XHRcdGNvbnRyb2xsZXI6ICdDaXJjbGVncmFwaEN0cmwnLFxuXHRcdFx0c2NvcGU6IHRydWUsXG5cdFx0XHRyZXF1aXJlOiAnbmdNb2RlbCcsXG5cdFx0XHRsaW5rOiBmdW5jdGlvbigkc2NvcGUsIGVsZW1lbnQsICRhdHRycywgbmdNb2RlbCkge1xuXHRcdFx0XHQvL0ZldGNoaW5nIE9wdGlvbnNcblx0XHRcdFx0dmFyIG9wdGlvbnMgPSBhbmd1bGFyLmV4dGVuZChkZWZhdWx0cygpLCAkYXR0cnMpO1xuXG5cdFx0XHRcdC8vQ3JlYXRpbmcgdGhlIFNjYWxlXG5cdFx0XHRcdHZhciByb3RhdGUgPSBkMy5zY2FsZS5saW5lYXIoKVxuXHRcdFx0XHRcdC5kb21haW4oWzEsIG9wdGlvbnMuc2l6ZV0pXG5cdFx0XHRcdFx0LnJhbmdlKFsxLCAwXSlcblx0XHRcdFx0XHQuY2xhbXAodHJ1ZSk7XG5cblx0XHRcdFx0Ly9DcmVhdGluZyBFbGVtZW50c1xuXHRcdFx0XHR2YXIgc3ZnID0gZDMuc2VsZWN0KGVsZW1lbnRbMF0pLmFwcGVuZCgnc3ZnJylcblx0XHRcdFx0XHQuYXR0cignd2lkdGgnLCBvcHRpb25zLndpZHRoKVxuXHRcdFx0XHRcdC5hdHRyKCdoZWlnaHQnLCBvcHRpb25zLmhlaWdodClcblx0XHRcdFx0XHQuYXBwZW5kKCdnJyk7XG5cdFx0XHRcdHZhciBjb250YWluZXIgPSBzdmcuYXBwZW5kKCdnJylcblx0XHRcdFx0XHQuYXR0cigndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgnICsgb3B0aW9ucy53aWR0aCAvIDIgKyAnLCcgKyBvcHRpb25zLmhlaWdodCAvIDIgKyAnKScpO1xuXHRcdFx0XHR2YXIgY2lyY2xlQmFjayA9IGNvbnRhaW5lci5hcHBlbmQoJ2NpcmNsZScpXG5cdFx0XHRcdFx0LmF0dHIoJ3InLCBvcHRpb25zLndpZHRoIC8gMiAtIDIpXG5cdFx0XHRcdFx0LmF0dHIoJ3N0cm9rZS13aWR0aCcsIDIpXG5cdFx0XHRcdFx0LmF0dHIoJ3N0cm9rZScsIG9wdGlvbnMuY29sb3IpXG5cdFx0XHRcdFx0LnN0eWxlKCdvcGFjaXR5JywgJzAuNicpXG5cdFx0XHRcdFx0LmF0dHIoJ2ZpbGwnLCAnbm9uZScpO1xuXHRcdFx0XHR2YXIgYXJjID0gZDMuc3ZnLmFyYygpXG5cdFx0XHRcdFx0LnN0YXJ0QW5nbGUoMClcblx0XHRcdFx0XHQuaW5uZXJSYWRpdXMoZnVuY3Rpb24oZCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIG9wdGlvbnMud2lkdGggLyAyIC0gNDtcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC5vdXRlclJhZGl1cyhmdW5jdGlvbihkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gb3B0aW9ucy53aWR0aCAvIDI7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdHZhciBjaXJjbGVHcmFwaCA9IGNvbnRhaW5lci5hcHBlbmQoJ3BhdGgnKVxuXHRcdFx0XHRcdC5kYXR1bSh7XG5cdFx0XHRcdFx0XHRlbmRBbmdsZTogMiAqIE1hdGguUEkgKiAwXG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQuc3R5bGUoXCJmaWxsXCIsIG9wdGlvbnMuY29sb3IpXG5cdFx0XHRcdFx0LmF0dHIoJ2QnLCBhcmMpO1xuXHRcdFx0XHR2YXIgdGV4dCA9IGNvbnRhaW5lci5zZWxlY3RBbGwoJ3RleHQnKVxuXHRcdFx0XHRcdC5kYXRhKFswXSlcblx0XHRcdFx0XHQuZW50ZXIoKVxuXHRcdFx0XHRcdC5hcHBlbmQoJ3RleHQnKVxuXHRcdFx0XHRcdC50ZXh0KGZ1bmN0aW9uKGQpIHtcblx0XHRcdFx0XHRcdHJldHVybiAnTsKwJyArIGQ7XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRcdC5zdHlsZShcImZpbGxcIiwgb3B0aW9ucy5jb2xvcilcblx0XHRcdFx0XHQuc3R5bGUoJ2ZvbnQtd2VpZ2h0JywgJ2JvbGQnKVxuXHRcdFx0XHRcdC5hdHRyKCd0ZXh0LWFuY2hvcicsICdtaWRkbGUnKVxuXHRcdFx0XHRcdC5hdHRyKCd5JywgJzAuMzVlbScpO1xuXG5cdFx0XHRcdC8vVHJhbnNpdGlvbiBpZiBzZWxlY3Rpb24gaGFzIGNoYW5nZWRcblx0XHRcdFx0ZnVuY3Rpb24gYW5pbWF0ZUl0KHJhZGl1cykge1xuXHRcdFx0XHRcdGNpcmNsZUdyYXBoLnRyYW5zaXRpb24oKVxuXHRcdFx0XHRcdFx0LmR1cmF0aW9uKDc1MClcblx0XHRcdFx0XHRcdC5jYWxsKGFyY1R3ZWVuLCByb3RhdGUocmFkaXVzKSAqIDIgKiBNYXRoLlBJKTtcblx0XHRcdFx0XHR0ZXh0LnRyYW5zaXRpb24oKS5kdXJhdGlvbig3NTApLnR3ZWVuKCd0ZXh0JywgZnVuY3Rpb24oZCkge1xuXHRcdFx0XHRcdFx0dmFyIGRhdGEgPSB0aGlzLnRleHRDb250ZW50LnNwbGl0KCdOwrAnKTtcblxuXHRcdFx0XHRcdFx0dmFyIGkgPSBkMy5pbnRlcnBvbGF0ZShkYXRhWzFdLCByYWRpdXMpO1xuXHRcdFx0XHRcdFx0cmV0dXJuIGZ1bmN0aW9uKHQpIHtcblx0XHRcdFx0XHRcdFx0dGhpcy50ZXh0Q29udGVudCA9ICAnTsKwJyArIChNYXRoLnJvdW5kKGkodCkgKiAxKSAvIDEpO1xuXHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly9Ud2VlbiBhbmltYXRpb24gZm9yIHRoZSBBcmNcblx0XHRcdFx0ZnVuY3Rpb24gYXJjVHdlZW4odHJhbnNpdGlvbiwgbmV3QW5nbGUpIHtcblx0XHRcdFx0XHR0cmFuc2l0aW9uLmF0dHJUd2VlbihcImRcIiwgZnVuY3Rpb24oZCkge1xuXHRcdFx0XHRcdFx0dmFyIGludGVycG9sYXRlID0gZDMuaW50ZXJwb2xhdGUoZC5lbmRBbmdsZSwgbmV3QW5nbGUpO1xuXHRcdFx0XHRcdFx0cmV0dXJuIGZ1bmN0aW9uKHQpIHtcblx0XHRcdFx0XHRcdFx0ZC5lbmRBbmdsZSA9IGludGVycG9sYXRlKHQpO1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gYXJjKGQpO1xuXHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vV2F0Y2hpbmcgaWYgc2VsZWN0aW9uIGhhcyBjaGFuZ2VkIGZyb20gYW5vdGhlciBVSSBlbGVtZW50XG5cdFx0XHRcdCRzY29wZS4kd2F0Y2goXG5cdFx0XHRcdFx0ZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gbmdNb2RlbC4kbW9kZWxWYWx1ZTtcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdGZ1bmN0aW9uKG5ld1ZhbHVlLCBvbGRWYWx1ZSkge1xuXHRcdFx0XHRcdFx0aWYgKCFuZXdWYWx1ZSl7XG5cdFx0XHRcdFx0XHRcdG5ld1ZhbHVlID0ge1xuXHRcdFx0XHRcdFx0XHRcdHJhbms6IG9wdGlvbnMuc2l6ZVxuXHRcdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHQkdGltZW91dChmdW5jdGlvbigpe1xuXHRcdFx0XHRcdFx0XHRhbmltYXRlSXQobmV3VmFsdWUucmFuaylcblx0XHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fTtcblxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSggJ2FwcC5jb250cm9sbGVycycgKS5jb250cm9sbGVyKCAnRGF0YUxpc3RpbmdDdHJsJywgZnVuY3Rpb24oKXtcblx0XHQvL1xuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZGlyZWN0aXZlcycpLmRpcmVjdGl2ZSggJ2RhdGFMaXN0aW5nJywgZnVuY3Rpb24oKSB7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0cmVzdHJpY3Q6ICdFQScsXG5cdFx0XHR0ZW1wbGF0ZVVybDogJ3ZpZXdzL2RpcmVjdGl2ZXMvZGF0YV9saXN0aW5nL2RhdGFfbGlzdGluZy5odG1sJyxcblx0XHRcdGNvbnRyb2xsZXI6ICdEYXRhTGlzdGluZ0N0cmwnLFxuXHRcdFx0bGluazogZnVuY3Rpb24oICRzY29wZSwgZWxlbWVudCwgJGF0dHJzICl7XG5cdFx0XHRcdC8vXG5cdFx0XHR9XG5cdFx0fTtcblxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZGlyZWN0aXZlcycpLmRpcmVjdGl2ZSgnbWVkaWFuJywgZnVuY3Rpb24gKCR0aW1lb3V0KSB7XG5cdFx0dmFyIGRlZmF1bHRzID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0aWQ6ICdncmFkaWVudCcsXG5cdFx0XHRcdHdpZHRoOiAzNDAsXG5cdFx0XHRcdGhlaWdodDogNDAsXG5cdFx0XHRcdGluZm86IHRydWUsXG5cdFx0XHRcdGZpZWxkOiAnc2NvcmUnLFxuXHRcdFx0XHRoYW5kbGluZzogdHJ1ZSxcblx0XHRcdFx0bWFyZ2luOiB7XG5cdFx0XHRcdFx0bGVmdDogMjAsXG5cdFx0XHRcdFx0cmlnaHQ6IDIwLFxuXHRcdFx0XHRcdHRvcDogMTAsXG5cdFx0XHRcdFx0Ym90dG9tOiAxMFxuXHRcdFx0XHR9LFxuXHRcdFx0XHRjb2xvcnM6IFt7XG5cdFx0XHRcdFx0cG9zaXRpb246IDAsXG5cdFx0XHRcdFx0Y29sb3I6ICdyZ2JhKDI1NSwyNTUsMjU1LDEpJyxcblx0XHRcdFx0XHRvcGFjaXR5OiAwXG5cdFx0XHRcdH0sIHtcblx0XHRcdFx0XHRwb3NpdGlvbjogNTMsXG5cdFx0XHRcdFx0Y29sb3I6ICdyZ2JhKDEyOCwgMjQzLCAxOTgsMSknLFxuXHRcdFx0XHRcdG9wYWNpdHk6IDFcblx0XHRcdFx0fSwge1xuXHRcdFx0XHRcdHBvc2l0aW9uOiAxMDAsXG5cdFx0XHRcdFx0Y29sb3I6ICdyZ2JhKDEwMiwxMDIsMTAyLDEpJyxcblx0XHRcdFx0XHRvcGFjaXR5OiAxXG5cdFx0XHRcdH1dXG5cdFx0XHR9O1xuXHRcdH1cblx0XHRyZXR1cm4ge1xuXHRcdFx0cmVzdHJpY3Q6ICdFJyxcblx0XHRcdHNjb3BlOiB7XG5cdFx0XHRcdGRhdGE6ICc9J1xuXHRcdFx0fSxcblx0XHRcdHJlcXVpcmU6ICduZ01vZGVsJyxcblx0XHRcdGxpbms6IGZ1bmN0aW9uICgkc2NvcGUsIGVsZW1lbnQsICRhdHRycywgbmdNb2RlbCkge1xuXG5cdFx0XHRcdHZhciBvcHRpb25zID0gYW5ndWxhci5leHRlbmQoZGVmYXVsdHMoKSwgJGF0dHJzKTtcblx0XHRcdFx0Ly9jb25zb2xlLmxvZyhvcHRpb25zLmNvbG9yKTtcblx0XHRcdFx0aWYob3B0aW9ucy5jb2xvcil7XG5cdFx0XHRcdFx0b3B0aW9ucy5jb2xvcnNbMV0uY29sb3IgPSBvcHRpb25zLmNvbG9yO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsZW1lbnQuY3NzKCdoZWlnaHQnLCBvcHRpb25zLmhlaWdodCArICdweCcpLmNzcygnYm9yZGVyLXJhZGl1cycsIG9wdGlvbnMuaGVpZ2h0IC8gMiArICdweCcpO1xuXHRcdFx0XHR2YXIgeCA9IGQzLnNjYWxlLmxpbmVhcigpXG5cdFx0XHRcdFx0LmRvbWFpbihbMCwgMTAwXSlcblx0XHRcdFx0XHQucmFuZ2UoWzIwLCBvcHRpb25zLndpZHRoIC0gb3B0aW9ucy5tYXJnaW4ubGVmdF0pXG5cdFx0XHRcdFx0LmNsYW1wKHRydWUpO1xuXG5cdFx0XHRcdHZhciBicnVzaCA9IGQzLnN2Zy5icnVzaCgpXG5cdFx0XHRcdFx0LngoeClcblx0XHRcdFx0XHQuZXh0ZW50KFswLCAwXSlcblx0XHRcdFx0XHQub24oXCJicnVzaFwiLCBicnVzaClcblx0XHRcdFx0XHQub24oXCJicnVzaGVuZFwiLCBicnVzaGVkKTtcblxuXHRcdFx0XHR2YXIgc3ZnID0gZDMuc2VsZWN0KGVsZW1lbnRbMF0pLmFwcGVuZChcInN2Z1wiKVxuXHRcdFx0XHRcdC5hdHRyKFwid2lkdGhcIiwgb3B0aW9ucy53aWR0aClcblx0XHRcdFx0XHQuYXR0cihcImhlaWdodFwiLCBvcHRpb25zLmhlaWdodCArIG9wdGlvbnMubWFyZ2luLnRvcCArIG9wdGlvbnMubWFyZ2luLmJvdHRvbSlcblx0XHRcdFx0XHQuYXBwZW5kKFwiZ1wiKTtcblx0XHRcdFx0Ly8uYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZSgwLFwiICsgb3B0aW9ucy5tYXJnaW4udG9wIC8gMiArIFwiKVwiKTtcblx0XHRcdFx0dmFyIGdyYWRpZW50ID0gc3ZnLmFwcGVuZCgnc3ZnOmRlZnMnKVxuXHRcdFx0XHRcdC5hcHBlbmQoXCJzdmc6bGluZWFyR3JhZGllbnRcIilcblx0XHRcdFx0XHQuYXR0cignaWQnLCBvcHRpb25zLmZpZWxkKVxuXHRcdFx0XHRcdC5hdHRyKCd4MScsICcwJScpXG5cdFx0XHRcdFx0LmF0dHIoJ3kxJywgJzAlJylcblx0XHRcdFx0XHQuYXR0cigneDInLCAnMTAwJScpXG5cdFx0XHRcdFx0LmF0dHIoJ3kyJywgJzAlJylcblx0XHRcdFx0XHQuYXR0cignc3ByZWFkTWV0aG9kJywgJ3BhZCcpXG5cdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChvcHRpb25zLmNvbG9ycywgZnVuY3Rpb24gKGNvbG9yKSB7XG5cdFx0XHRcdFx0Z3JhZGllbnQuYXBwZW5kKCdzdmc6c3RvcCcpXG5cdFx0XHRcdFx0XHQuYXR0cignb2Zmc2V0JywgY29sb3IucG9zaXRpb24gKyAnJScpXG5cdFx0XHRcdFx0XHQuYXR0cignc3RvcC1jb2xvcicsIGNvbG9yLmNvbG9yKVxuXHRcdFx0XHRcdFx0LmF0dHIoJ3N0b3Atb3BhY2l0eScsIGNvbG9yLm9wYWNpdHkpO1xuXHRcdFx0XHR9KTtcblx0XHRcdFx0c3ZnLmFwcGVuZCgnc3ZnOnJlY3QnKVxuXHRcdFx0XHRcdC5hdHRyKCd3aWR0aCcsIG9wdGlvbnMud2lkdGgpXG5cdFx0XHRcdFx0LmF0dHIoJ2hlaWdodCcsIG9wdGlvbnMuaGVpZ2h0KVxuXHRcdFx0XHRcdC5zdHlsZSgnZmlsbCcsICd1cmwoIycgKyBvcHRpb25zLmZpZWxkICsgJyknKTtcblx0XHRcdFx0dmFyIGxlZ2VuZCA9IHN2Zy5hcHBlbmQoJ2cnKS5hdHRyKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKCcgKyBvcHRpb25zLmhlaWdodCAvIDIgKyAnLCAnICsgb3B0aW9ucy5oZWlnaHQgLyAyICsgJyknKVxuXHRcdFx0XHRcdC5hdHRyKCdjbGFzcycsICdzdGFydExhYmVsJylcblxuXHRcdFx0XHRpZiAob3B0aW9ucy5pbmZvID09PSB0cnVlKSB7XG5cdFx0XHRcdFx0bGVnZW5kLmFwcGVuZCgnY2lyY2xlJylcblx0XHRcdFx0XHRcdC5hdHRyKCdyJywgb3B0aW9ucy5oZWlnaHQgLyAyKTtcblx0XHRcdFx0XHRsZWdlbmQuYXBwZW5kKCd0ZXh0Jylcblx0XHRcdFx0XHRcdC50ZXh0KDApXG5cdFx0XHRcdFx0XHQuc3R5bGUoJ2ZvbnQtc2l6ZScsIG9wdGlvbnMuaGVpZ2h0LzIuNSlcblx0XHRcdFx0XHRcdC5hdHRyKCd0ZXh0LWFuY2hvcicsICdtaWRkbGUnKVxuXHRcdFx0XHRcdFx0LmF0dHIoJ3knLCAnLjM1ZW0nKVxuXHRcdFx0XHR9XG5cblxuXG5cdFx0XHRcdGlmIChvcHRpb25zLmluZm8gPT09IHRydWUpIHtcblx0XHRcdFx0XHR2YXIgbGVnZW5kMiA9IHN2Zy5hcHBlbmQoJ2cnKS5hdHRyKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKCcgKyAob3B0aW9ucy53aWR0aCAtIChvcHRpb25zLmhlaWdodCAvIDIpKSArICcsICcgKyBvcHRpb25zLmhlaWdodCAvIDIgKyAnKScpXG5cdFx0XHRcdFx0XHQuYXR0cignY2xhc3MnLCAnZW5kTGFiZWwnKVxuXHRcdFx0XHRcdGxlZ2VuZDIuYXBwZW5kKCdjaXJjbGUnKVxuXHRcdFx0XHRcdFx0LmF0dHIoJ3InLCBvcHRpb25zLmhlaWdodCAvIDIpXG5cdFx0XHRcdFx0bGVnZW5kMi5hcHBlbmQoJ3RleHQnKVxuXHRcdFx0XHRcdFx0LnRleHQoMTAwKVxuXHRcdFx0XHRcdFx0LnN0eWxlKCdmb250LXNpemUnLCBvcHRpb25zLmhlaWdodC8yLjUpXG5cdFx0XHRcdFx0XHQuYXR0cigndGV4dC1hbmNob3InLCAnbWlkZGxlJylcblx0XHRcdFx0XHRcdC5hdHRyKCd5JywgJy4zNWVtJylcblx0XHRcdFx0fVxuXHRcdFx0XHR2YXIgc2xpZGVyID0gc3ZnLmFwcGVuZChcImdcIilcblx0XHRcdFx0XHQuYXR0cihcImNsYXNzXCIsIFwic2xpZGVyXCIpO1xuXHRcdFx0XHRpZihvcHRpb25zLmhhbmRsaW5nID09IHRydWUpe1xuXHRcdFx0XHRcdHNsaWRlci5jYWxsKGJydXNoKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHNsaWRlci5zZWxlY3QoXCIuYmFja2dyb3VuZFwiKVxuXHRcdFx0XHRcdC5hdHRyKFwiaGVpZ2h0XCIsIG9wdGlvbnMuaGVpZ2h0KTtcblxuXHRcdFx0XHRpZiAob3B0aW9ucy5pbmZvID09PSB0cnVlKSB7XG5cdFx0XHRcdHNsaWRlci5hcHBlbmQoJ2xpbmUnKVxuXHRcdFx0XHRcdC5hdHRyKCd4MScsIG9wdGlvbnMud2lkdGggLyAyKVxuXHRcdFx0XHRcdC5hdHRyKCd5MScsIDApXG5cdFx0XHRcdFx0LmF0dHIoJ3gyJywgb3B0aW9ucy53aWR0aCAvIDIpXG5cdFx0XHRcdFx0LmF0dHIoJ3kyJywgb3B0aW9ucy5oZWlnaHQpXG5cdFx0XHRcdFx0LmF0dHIoJ3N0cm9rZS1kYXNoYXJyYXknLCAnMywzJylcblx0XHRcdFx0XHQuYXR0cignc3Ryb2tlLXdpZHRoJywgMSlcblx0XHRcdFx0XHQuYXR0cignc3Ryb2tlJywgJ3JnYmEoMCwwLDAsODcpJyk7XG5cdFx0XHRcdH1cblx0XHRcdFx0dmFyIGhhbmRsZUNvbnQgPSBzbGlkZXIuYXBwZW5kKCdnJylcblx0XHRcdFx0XHQuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZSgwLFwiICsgb3B0aW9ucy5oZWlnaHQgLyAyICsgXCIpXCIpO1xuXHRcdFx0XHR2YXIgaGFuZGxlID0gaGFuZGxlQ29udC5hcHBlbmQoXCJjaXJjbGVcIilcblx0XHRcdFx0XHQuYXR0cihcImNsYXNzXCIsIFwiaGFuZGxlXCIpXG5cdFx0XHRcdFx0LmF0dHIoXCJyXCIsIG9wdGlvbnMuaGVpZ2h0IC8gMik7XG5cdFx0XHRcdFx0aWYob3B0aW9ucy5jb2xvcil7XG5cdFx0XHRcdFx0XHRoYW5kbGUuc3R5bGUoJ2ZpbGwnLCBvcHRpb25zLmNvbG9yKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdHZhciBoYW5kbGVMYWJlbCA9IGhhbmRsZUNvbnQuYXBwZW5kKCd0ZXh0Jylcblx0XHRcdFx0XHQudGV4dCgwKVxuXHRcdFx0XHRcdC5zdHlsZSgnZm9udC1zaXplJywgb3B0aW9ucy5oZWlnaHQvMi41KVxuXHRcdFx0XHRcdC5hdHRyKFwidGV4dC1hbmNob3JcIiwgXCJtaWRkbGVcIikuYXR0cigneScsICcwLjM1ZW0nKTtcblxuXHRcdFx0XHQvL3NsaWRlclxuXHRcdFx0XHQvLy5jYWxsKGJydXNoLmV4dGVudChbMCwgMF0pKVxuXHRcdFx0XHQvLy5jYWxsKGJydXNoLmV2ZW50KTtcblxuXHRcdFx0XHRmdW5jdGlvbiBicnVzaCgpIHtcblx0XHRcdFx0XHR2YXIgdmFsdWUgPSBicnVzaC5leHRlbnQoKVswXTtcblxuXHRcdFx0XHRcdGlmIChkMy5ldmVudC5zb3VyY2VFdmVudCkgeyAvLyBub3QgYSBwcm9ncmFtbWF0aWMgZXZlbnRcblx0XHRcdFx0XHRcdHZhbHVlID0geC5pbnZlcnQoZDMubW91c2UodGhpcylbMF0pO1xuXHRcdFx0XHRcdFx0YnJ1c2guZXh0ZW50KFt2YWx1ZSwgdmFsdWVdKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aGFuZGxlTGFiZWwudGV4dChwYXJzZUludCh2YWx1ZSkpO1xuXHRcdFx0XHRcdGhhbmRsZUNvbnQuYXR0cihcInRyYW5zZm9ybVwiLCAndHJhbnNsYXRlKCcgKyB4KHZhbHVlKSArICcsJyArIG9wdGlvbnMuaGVpZ2h0IC8gMiArICcpJyk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRmdW5jdGlvbiBicnVzaGVkKCkge1xuXHRcdFx0XHRcdHZhciB2YWx1ZSA9IGJydXNoLmV4dGVudCgpWzBdLFxuXHRcdFx0XHRcdFx0Y291bnQgPSAwLFxuXHRcdFx0XHRcdFx0Zm91bmQgPSBmYWxzZTtcblx0XHRcdFx0XHR2YXIgZmluYWwgPSBcIlwiO1xuXHRcdFx0XHRcdGRvIHtcblxuXHRcdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKCRzY29wZS5kYXRhLCBmdW5jdGlvbiAobmF0LCBrZXkpIHtcblx0XHRcdFx0XHRcdFx0aWYgKHBhcnNlSW50KG5hdFtvcHRpb25zLmZpZWxkXSkgPT0gcGFyc2VJbnQodmFsdWUpKSB7XG5cdFx0XHRcdFx0XHRcdFx0ZmluYWwgPSBuYXQ7XG5cdFx0XHRcdFx0XHRcdFx0Zm91bmQgPSB0cnVlO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdGNvdW50Kys7XG5cdFx0XHRcdFx0XHR2YWx1ZSA9IHZhbHVlID4gNTAgPyB2YWx1ZSAtIDEgOiB2YWx1ZSArIDE7XG5cdFx0XHRcdFx0fSB3aGlsZSAoIWZvdW5kICYmIGNvdW50IDwgMTAwKTtcblx0XHRcdFx0XHRuZ01vZGVsLiRzZXRWaWV3VmFsdWUoZmluYWwpO1xuXHRcdFx0XHRcdG5nTW9kZWwuJHJlbmRlcigpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0JHNjb3BlLiR3YXRjaChcblx0XHRcdFx0XHRmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gbmdNb2RlbC4kbW9kZWxWYWx1ZTtcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdGZ1bmN0aW9uIChuZXdWYWx1ZSwgb2xkVmFsdWUpIHtcblx0XHRcdFx0XHRcdC8vY29uc29sZS5sb2cobmV3VmFsdWUpO1xuXHRcdFx0XHRcdFx0aWYgKCFuZXdWYWx1ZSkge1xuXHRcdFx0XHRcdFx0XHRoYW5kbGVMYWJlbC50ZXh0KHBhcnNlSW50KDApKTtcblx0XHRcdFx0XHRcdFx0aGFuZGxlQ29udC5hdHRyKFwidHJhbnNmb3JtXCIsICd0cmFuc2xhdGUoJyArIHgoMCkgKyAnLCcgKyBvcHRpb25zLmhlaWdodCAvIDIgKyAnKScpO1xuXHRcdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRoYW5kbGVMYWJlbC50ZXh0KHBhcnNlSW50KG5ld1ZhbHVlW29wdGlvbnMuZmllbGRdKSk7XG5cdFx0XHRcdFx0XHRpZiAobmV3VmFsdWUgPT0gb2xkVmFsdWUpIHtcblx0XHRcdFx0XHRcdFx0aGFuZGxlQ29udC5hdHRyKFwidHJhbnNmb3JtXCIsICd0cmFuc2xhdGUoJyArIHgobmV3VmFsdWVbb3B0aW9ucy5maWVsZF0pICsgJywnICsgb3B0aW9ucy5oZWlnaHQgLyAyICsgJyknKTtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdGhhbmRsZUNvbnQudHJhbnNpdGlvbigpLmR1cmF0aW9uKDUwMCkuZWFzZSgncXVhZCcpLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgJ3RyYW5zbGF0ZSgnICsgeChuZXdWYWx1ZVtvcHRpb25zLmZpZWxkXSkgKyAnLCcgKyBvcHRpb25zLmhlaWdodCAvIDIgKyAnKScpO1xuXG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fTtcblxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSggJ2FwcC5jb250cm9sbGVycycgKS5jb250cm9sbGVyKCAnTWVkaWFuQ3RybCcsIGZ1bmN0aW9uKCl7XG5cdFx0Ly9cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmRpcmVjdGl2ZXMnKS5kaXJlY3RpdmUoICdzaW1wbGVsaW5lY2hhcnQnLCBmdW5jdGlvbigpIHtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRyZXN0cmljdDogJ0UnLFxuXHRcdFx0c2NvcGU6e1xuXHRcdFx0XHRkYXRhOic9Jyxcblx0XHRcdFx0c2VsZWN0aW9uOic9J1xuXHRcdFx0fSxcblx0XHRcdHRlbXBsYXRlVXJsOiAndmlld3MvZGlyZWN0aXZlcy9zaW1wbGVsaW5lY2hhcnQvc2ltcGxlbGluZWNoYXJ0Lmh0bWwnLFxuXHRcdFx0Y29udHJvbGxlcjogJ1NpbXBsZWxpbmVjaGFydEN0cmwnLFxuXHRcdFx0bGluazogZnVuY3Rpb24oICRzY29wZSwgZWxlbWVudCwgJGF0dHJzICl7XG5cdFx0XHRcdCRzY29wZS5vcHRpb25zID0gJGF0dHJzO1xuXHRcdFx0XHQkc2NvcGUuY2FsY3VsYXRlR3JhcGgoKTtcblx0XHRcdFx0JHNjb3BlLnNldENoYXJ0KCk7XG5cblx0XHRcdH1cblx0XHR9O1xuXG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ1NpbXBsZWxpbmVjaGFydEN0cmwnLCBmdW5jdGlvbiAoJHNjb3BlKSB7XG5cdFx0JHNjb3BlLmNvbmZpZyA9IHtcblx0XHRcdHZpc2libGU6IHRydWUsIC8vIGRlZmF1bHQ6IHRydWVcblx0XHRcdGV4dGVuZGVkOiBmYWxzZSwgLy8gZGVmYXVsdDogZmFsc2Vcblx0XHRcdGRpc2FibGVkOiBmYWxzZSwgLy8gZGVmYXVsdDogZmFsc2Vcblx0XHRcdGF1dG9yZWZyZXNoOiB0cnVlLCAvLyBkZWZhdWx0OiB0cnVlXG5cdFx0XHRyZWZyZXNoRGF0YU9ubHk6IGZhbHNlLCAvLyBkZWZhdWx0OiBmYWxzZVxuXHRcdFx0ZGVlcFdhdGNoT3B0aW9uczogdHJ1ZSwgLy8gZGVmYXVsdDogdHJ1ZVxuXHRcdFx0ZGVlcFdhdGNoRGF0YTogZmFsc2UsIC8vIGRlZmF1bHQ6IGZhbHNlXG5cdFx0XHRkZWVwV2F0Y2hDb25maWc6IHRydWUsIC8vIGRlZmF1bHQ6IHRydWVcblx0XHRcdGRlYm91bmNlOiAxMCAvLyBkZWZhdWx0OiAxMFxuXHR9LFxuXG5cdCRzY29wZS5jaGFydCA9IHtcblx0XHRvcHRpb25zOntcblx0XHRcdGNoYXJ0Ont9XG5cdFx0fSxcblx0XHRkYXRhOltdXG5cdH07XG5cdFx0JHNjb3BlLnNldENoYXJ0ID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0JHNjb3BlLmNoYXJ0Lm9wdGlvbnMuY2hhcnQgPSAge1xuXHRcdFx0XHRcdFx0dHlwZTogJ2xpbmVDaGFydCcsXG5cdFx0XHRcdFx0XHRsZWdlbmRQb3NpdGlvbjogJ2xlZnQnLFxuXHRcdFx0XHRcdFx0bWFyZ2luOiB7XG5cdFx0XHRcdFx0XHRcdHRvcDogMjAsXG5cdFx0XHRcdFx0XHRcdHJpZ2h0OiAyMCxcblx0XHRcdFx0XHRcdFx0Ym90dG9tOiAyMCxcblx0XHRcdFx0XHRcdFx0bGVmdDogMjBcblx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHR4OiBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gZC54O1xuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdHk6IGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBkLnk7XG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0c2hvd0xlZ2VuZDpmYWxzZSxcblx0XHRcdFx0XHRcdHNob3dWYWx1ZXM6IGZhbHNlLFxuXHRcdFx0XHRcdFx0c2hvd1lBeGlzOiBmYWxzZSxcblx0XHRcdFx0XHRcdHRyYW5zaXRpb25EdXJhdGlvbjogNTAwLFxuXHRcdFx0XHRcdFx0dXNlSW50ZXJhY3RpdmVHdWlkZWxpbmU6IHRydWUsXG5cdFx0XHRcdFx0XHQvL2ZvcmNlWTogWzEwMCwgMF0sXG5cdFx0XHRcdFx0XHQvL3lEb21haW46eURvbWFpbixcblx0XHRcdFx0XHRcdHhBeGlzOiB7XG5cdFx0XHRcdFx0XHRcdGF4aXNMYWJlbDogJydcblx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHR5QXhpczoge1xuXHRcdFx0XHRcdFx0XHRheGlzTGFiZWw6ICcnLFxuXHRcdFx0XHRcdFx0XHRheGlzTGFiZWxEaXN0YW5jZTogMzBcblx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRsZWdlbmQ6IHtcblx0XHRcdFx0XHRcdFx0cmlnaHRBbGlnbjogZmFsc2Vcblx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRsaW5lczoge1xuXHRcdFx0XHRcdFx0XHRpbnRlcnBvbGF0ZTogJ2NhcmRpbmFsJ1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHR9O1xuXHRcdFx0aWYoJHNjb3BlLm9wdGlvbnMuaW52ZXJ0ID09IFwidHJ1ZVwiKXtcblx0XHRcdFx0JHNjb3BlLmNoYXJ0Lm9wdGlvbnMuY2hhcnQueURvbWFpbiA9IFtwYXJzZUludCgkc2NvcGUucmFuZ2UubWF4KSwkc2NvcGUucmFuZ2UubWluXTtcblx0XHRcdH1cblx0XHRcdHJldHVybiAkc2NvcGUuY2hhcnQ7XG5cdFx0fVxuXHRcdCRzY29wZS5jYWxjdWxhdGVHcmFwaCA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdHZhciBjaGFydERhdGEgPSBbXTtcblx0XHRcdCRzY29wZS5yYW5nZSA9IHtcblx0XHRcdFx0bWF4OjAsXG5cdFx0XHRcdG1pbjoxMDAwXG5cdFx0XHR9O1xuXHRcdFx0YW5ndWxhci5mb3JFYWNoKCRzY29wZS5zZWxlY3Rpb24sIGZ1bmN0aW9uIChpdGVtLCBrZXkpIHtcblx0XHRcdFx0dmFyIGdyYXBoID0ge1xuXHRcdFx0XHRcdGlkOiBrZXksXG5cdFx0XHRcdFx0a2V5OiBpdGVtLnRpdGxlLFxuXHRcdFx0XHRcdGNvbG9yOiBpdGVtLmNvbG9yLFxuXHRcdFx0XHRcdHZhbHVlczogW11cblx0XHRcdFx0fTtcblx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKCRzY29wZS5kYXRhLCBmdW5jdGlvbiAoZGF0YSwgaykge1xuXHRcdFx0XHRcdGdyYXBoLnZhbHVlcy5wdXNoKHtcblx0XHRcdFx0XHRcdGlkOiBrLFxuXHRcdFx0XHRcdFx0eDogZGF0YVtpdGVtLmZpZWxkcy54XSxcblx0XHRcdFx0XHRcdHk6IGRhdGFbaXRlbS5maWVsZHMueV1cblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHQkc2NvcGUucmFuZ2UubWF4ID0gTWF0aC5tYXgoJHNjb3BlLnJhbmdlLm1heCwgZGF0YVtpdGVtLmZpZWxkcy55XSk7XG5cdFx0XHRcdFx0JHNjb3BlLnJhbmdlLm1pbiA9IE1hdGgubWluKCRzY29wZS5yYW5nZS5taW4sIGRhdGFbaXRlbS5maWVsZHMueV0pO1xuXHRcdFx0XHR9KTtcblx0XHRcdFx0Y2hhcnREYXRhLnB1c2goZ3JhcGgpO1xuXHRcdFx0fSk7XG5cblx0XHRcdCRzY29wZS5jaGFydC5kYXRhID0gY2hhcnREYXRhO1xuXHRcdFx0aWYoJHNjb3BlLm9wdGlvbnMuaW52ZXJ0ID09IFwidHJ1ZVwiKXtcblx0XHRcdFx0JHNjb3BlLmNoYXJ0Lm9wdGlvbnMuY2hhcnQueURvbWFpbiA9IFtwYXJzZUludCgkc2NvcGUucmFuZ2UubWF4KSwkc2NvcGUucmFuZ2UubWluXTtcblx0XHRcdH1cblx0XHR9O1xuXHRcdCRzY29wZS4kd2F0Y2goJ2RhdGEnLCBmdW5jdGlvbiAobiwgbykge1xuXHRcdFx0aWYgKCFuKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHRcdCRzY29wZS5jYWxjdWxhdGVHcmFwaCgpO1xuXHRcdH0pXG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZGlyZWN0aXZlcycpLmFuaW1hdGlvbignLnNsaWRlLXRvZ2dsZScsIFsnJGFuaW1hdGVDc3MnLCBmdW5jdGlvbigkYW5pbWF0ZUNzcykge1xuXG5cdFx0dmFyIGxhc3RJZCA9IDA7XG4gICAgICAgIHZhciBfY2FjaGUgPSB7fTtcblxuICAgICAgICBmdW5jdGlvbiBnZXRJZChlbCkge1xuICAgICAgICAgICAgdmFyIGlkID0gZWxbMF0uZ2V0QXR0cmlidXRlKFwiZGF0YS1zbGlkZS10b2dnbGVcIik7XG4gICAgICAgICAgICBpZiAoIWlkKSB7XG4gICAgICAgICAgICAgICAgaWQgPSArK2xhc3RJZDtcbiAgICAgICAgICAgICAgICBlbFswXS5zZXRBdHRyaWJ1dGUoXCJkYXRhLXNsaWRlLXRvZ2dsZVwiLCBpZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gaWQ7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gZ2V0U3RhdGUoaWQpIHtcbiAgICAgICAgICAgIHZhciBzdGF0ZSA9IF9jYWNoZVtpZF07XG4gICAgICAgICAgICBpZiAoIXN0YXRlKSB7XG4gICAgICAgICAgICAgICAgc3RhdGUgPSB7fTtcbiAgICAgICAgICAgICAgICBfY2FjaGVbaWRdID0gc3RhdGU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBnZW5lcmF0ZVJ1bm5lcihjbG9zaW5nLCBzdGF0ZSwgYW5pbWF0b3IsIGVsZW1lbnQsIGRvbmVGbikge1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHN0YXRlLmFuaW1hdGluZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgc3RhdGUuYW5pbWF0b3IgPSBhbmltYXRvcjtcbiAgICAgICAgICAgICAgICBzdGF0ZS5kb25lRm4gPSBkb25lRm47XG4gICAgICAgICAgICAgICAgYW5pbWF0b3Iuc3RhcnQoKS5maW5hbGx5KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoY2xvc2luZyAmJiBzdGF0ZS5kb25lRm4gPT09IGRvbmVGbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudFswXS5zdHlsZS5oZWlnaHQgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBzdGF0ZS5hbmltYXRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgc3RhdGUuYW5pbWF0b3IgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgICAgIHN0YXRlLmRvbmVGbigpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGxlYXZlOiBmdW5jdGlvbihlbGVtZW50LCBkb25lRm4pIHtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgc3RhdGUgPSBnZXRTdGF0ZShnZXRJZChlbGVtZW50KSk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBoZWlnaHQgPSAoc3RhdGUuYW5pbWF0aW5nICYmIHN0YXRlLmhlaWdodCkgP1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGUuaGVpZ2h0IDogZWxlbWVudFswXS5vZmZzZXRIZWlnaHQ7XG4gICAgICAgICAgICAgICAgICAgIHZhciBhbmltYXRvciA9ICRhbmltYXRlQ3NzKGVsZW1lbnQsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZyb206IHtoZWlnaHQ6IGhlaWdodCArICdweCcsIG9wYWNpdHk6IDF9LFxuICAgICAgICAgICAgICAgICAgICAgICAgdG86IHtoZWlnaHQ6ICcwcHgnLCBvcGFjaXR5OiAwfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFuaW1hdG9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3RhdGUuYW5pbWF0aW5nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGUuZG9uZUZuID1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdlbmVyYXRlUnVubmVyKHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuaW1hdG9yLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvbmVGbik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHN0YXRlLmFuaW1hdG9yLmVuZCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGUuaGVpZ2h0ID0gaGVpZ2h0O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBnZW5lcmF0ZVJ1bm5lcih0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5pbWF0b3IsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvbmVGbikoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgZG9uZUZuKCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZW50ZXI6IGZ1bmN0aW9uKGVsZW1lbnQsIGRvbmVGbikge1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciBzdGF0ZSA9IGdldFN0YXRlKGdldElkKGVsZW1lbnQpKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGhlaWdodCA9IChzdGF0ZS5hbmltYXRpbmcgJiYgc3RhdGUuaGVpZ2h0KSA/XG4gICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZS5oZWlnaHQgOiBlbGVtZW50WzBdLm9mZnNldEhlaWdodDtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgYW5pbWF0b3IgPSAkYW5pbWF0ZUNzcyhlbGVtZW50LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmcm9tOiB7aGVpZ2h0OiAnMHB4Jywgb3BhY2l0eTogMH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB0bzoge2hlaWdodDogaGVpZ2h0ICsgJ3B4Jywgb3BhY2l0eTogMX1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChhbmltYXRvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN0YXRlLmFuaW1hdGluZykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlLmRvbmVGbiA9IGdlbmVyYXRlUnVubmVyKGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuaW1hdG9yLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZG9uZUZuKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gc3RhdGUuYW5pbWF0b3IuZW5kKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZS5oZWlnaHQgPSBoZWlnaHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGdlbmVyYXRlUnVubmVyKGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5pbWF0b3IsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvbmVGbikoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgZG9uZUZuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfV0pO1xufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSggJ2FwcC5jb250cm9sbGVycycgKS5jb250cm9sbGVyKCAnU2xpZGVUb2dnbGVDdHJsJywgZnVuY3Rpb24oKXtcblx0XHQvL1xuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5kaXJlY3RpdmVzJykuZGlyZWN0aXZlKCdzdWJpbmRleCcsIHN1YmluZGV4KTtcblxuXHRzdWJpbmRleC4kaW5qZWN0ID0gWyckdGltZW91dCcsICdzbW9vdGhTY3JvbGwnXTtcblxuXHRmdW5jdGlvbiBzdWJpbmRleCgkdGltZW91dCwgc21vb3RoU2Nyb2xsKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlc3RyaWN0OiAnRScsXG5cdFx0XHRyZXBsYWNlOiB0cnVlLFxuXHRcdFx0c2NvcGU6IHtcblx0XHRcdFx0Y291bnRyeTogJz0nLFxuXHRcdFx0XHRzZWxlY3RlZDogJz0nXG5cdFx0XHR9LFxuXHRcdFx0Y29udHJvbGxlcjogJ1N1YmluZGV4Q3RybCcsXG5cdFx0XHR0ZW1wbGF0ZVVybDogJ3ZpZXdzL2RpcmVjdGl2ZXMvc3ViaW5kZXgvc3ViaW5kZXguaHRtbCcsXG5cdFx0XHRsaW5rOiBzdWJpbmRleExpbmtGdW5jdGlvblxuXHRcdH07XG5cblx0XHRmdW5jdGlvbiBzdWJpbmRleExpbmtGdW5jdGlvbigkc2NvcGUsIGVsZW1lbnQsICRhdHRycykge1xuXHRcdFx0JHNjb3BlLmdvdG9Cb3ggPSBnb3RvQm94O1xuXHRcdFx0XHRcdCRzY29wZS5nb3RvQm94KCk7XG5cdFx0XHRmdW5jdGlvbiBnb3RvQm94KCl7XG5cdFx0XHRcdCR0aW1lb3V0KGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0XHRzbW9vdGhTY3JvbGwoZWxlbWVudFswXSwge29mZnNldDoxMjAsIGR1cmF0aW9uOjI1MH0pO1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9XG5cdH1cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoICdhcHAuY29udHJvbGxlcnMnICkuY29udHJvbGxlciggJ1N1YmluZGV4Q3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgJHRpbWVvdXQsIHNtb290aFNjcm9sbCl7XG5cdFx0JHNjb3BlLnNldENoYXJ0ID0gc2V0Q2hhcnQ7XG5cdFx0JHNjb3BlLmNhbGN1bGF0ZUdyYXBoID0gY2FsY3VsYXRlR3JhcGg7XG5cdFx0JHNjb3BlLmNyZWF0ZUluZGV4ZXIgPSBjcmVhdGVJbmRleGVyO1xuXHRcdGFjdGl2YXRlKCk7XG5cblxuXHRcdGZ1bmN0aW9uIGFjdGl2YXRlKCl7XG5cdFx0XHQkc2NvcGUuc2V0Q2hhcnQoKTtcblx0XHRcdCRzY29wZS5jYWxjdWxhdGVHcmFwaCgpO1xuXHRcdFx0JHNjb3BlLmNyZWF0ZUluZGV4ZXIoKTtcblx0XHRcdCRzY29wZS4kd2F0Y2goJ3NlbGVjdGVkJywgZnVuY3Rpb24gKG5ld0l0ZW0sIG9sZEl0ZW0pIHtcblx0XHRcdFx0aWYgKG5ld0l0ZW0gPT09IG9sZEl0ZW0pIHtcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdH1cblx0XHRcdFx0JHNjb3BlLmNhbGN1bGF0ZUdyYXBoKCk7XG5cdFx0XHRcdCRzY29wZS5nb3RvQm94KCk7XG5cdFx0XHR9KVxuXHRcdH1cblx0XHRmdW5jdGlvbiBjcmVhdGVJbmRleGVyKCl7XG5cdFx0IFx0JHNjb3BlLmluZGV4ZXIgPSBbJHNjb3BlLnNlbGVjdGVkLmRhdGFdO1xuXG5cdFx0fVxuXHRcdGZ1bmN0aW9uIHNldENoYXJ0KCkge1xuXHRcdFx0JHNjb3BlLmNoYXJ0ID0ge1xuXHRcdFx0XHRvcHRpb25zOiB7XG5cdFx0XHRcdFx0Y2hhcnQ6IHtcblx0XHRcdFx0XHRcdHR5cGU6ICdsaW5lQ2hhcnQnLFxuXHRcdFx0XHRcdFx0Ly9oZWlnaHQ6IDIwMCxcblx0XHRcdFx0XHRcdGxlZ2VuZFBvc2l0aW9uOiAnbGVmdCcsXG5cdFx0XHRcdFx0XHRtYXJnaW46IHtcblx0XHRcdFx0XHRcdFx0dG9wOiAyMCxcblx0XHRcdFx0XHRcdFx0cmlnaHQ6IDIwLFxuXHRcdFx0XHRcdFx0XHRib3R0b206IDIwLFxuXHRcdFx0XHRcdFx0XHRsZWZ0OiAyMFxuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdHg6IGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBkLng7XG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0eTogZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGQueTtcblx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRzaG93VmFsdWVzOiBmYWxzZSxcblx0XHRcdFx0XHRcdHNob3dZQXhpczogZmFsc2UsXG5cdFx0XHRcdFx0XHR0cmFuc2l0aW9uRHVyYXRpb246IDUwMCxcblx0XHRcdFx0XHRcdHVzZUludGVyYWN0aXZlR3VpZGVsaW5lOiB0cnVlLFxuXHRcdFx0XHRcdFx0Zm9yY2VZOiBbMTAwLCAwXSxcblx0XHRcdFx0XHRcdHhBeGlzOiB7XG5cdFx0XHRcdFx0XHRcdGF4aXNMYWJlbDogJydcblx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHR5QXhpczoge1xuXHRcdFx0XHRcdFx0XHRheGlzTGFiZWw6ICcnLFxuXHRcdFx0XHRcdFx0XHRheGlzTGFiZWxEaXN0YW5jZTogMzBcblx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRsZWdlbmQ6e1xuXHRcdFx0XHRcdFx0XHRyaWdodEFsaWduOmZhbHNlLFxuXHRcdFx0XHRcdFx0XHRtYXJnaW46e1xuXHRcdFx0XHRcdFx0XHRcdGJvdHRvbTozMFxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0bGluZXM6e1xuXHRcdFx0XHRcdFx0XHRpbnRlcnBvbGF0ZTonY2FyZGluYWwnXG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRkYXRhOiBbXVxuXHRcdFx0fTtcblx0XHRcdHJldHVybiAkc2NvcGUuY2hhcnQ7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gY2FsY3VsYXRlR3JhcGgoKSB7XG5cblx0XHRcdHZhciBjaGFydERhdGEgPSBbXTtcblx0XHRcdGFuZ3VsYXIuZm9yRWFjaCgkc2NvcGUuc2VsZWN0ZWQuZGF0YS5jaGlsZHJlbiwgZnVuY3Rpb24gKGl0ZW0sIGtleSkge1xuXHRcdFx0XHR2YXIgZ3JhcGggPSB7XG5cdFx0XHRcdFx0a2V5OiBpdGVtLnRpdGxlLFxuXHRcdFx0XHRcdGNvbG9yOiBpdGVtLmNvbG9yLFxuXHRcdFx0XHRcdHZhbHVlczogW11cblx0XHRcdFx0fTtcblx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKCRzY29wZS5jb3VudHJ5LmVwaSwgZnVuY3Rpb24gKGRhdGEpIHtcblx0XHRcdFx0XHRncmFwaC52YWx1ZXMucHVzaCh7XG5cdFx0XHRcdFx0XHR4OiBkYXRhLnllYXIsXG5cdFx0XHRcdFx0XHR5OiBkYXRhW2l0ZW0uY29sdW1uX25hbWVdXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRjaGFydERhdGEucHVzaChncmFwaCk7XG5cdFx0XHR9KTtcblx0XHRcdCRzY29wZS5jaGFydC5kYXRhID0gY2hhcnREYXRhO1xuXHRcdH1cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZGlyZWN0aXZlcycpLmRpcmVjdGl2ZSgnc3VuYnVyc3QnLCBmdW5jdGlvbiAoKSB7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0cmVzdHJpY3Q6ICdFJyxcblx0XHRcdC8vdGVtcGxhdGVVcmw6ICd2aWV3cy9kaXJlY3RpdmVzL3N1bmJ1cnN0L3N1bmJ1cnN0Lmh0bWwnLFxuXHRcdFx0Y29udHJvbGxlcjogJ1N1bmJ1cnN0Q3RybCcsXG5cdFx0XHRzY29wZToge1xuXHRcdFx0XHRkYXRhOiAnPSdcblx0XHRcdH0sXG5cdFx0XHRsaW5rOiBmdW5jdGlvbiAoJHNjb3BlLCBlbGVtZW50LCAkYXR0cnMpIHtcblx0XHRcdFx0JHNjb3BlLnNldENoYXJ0KCk7XG5cdFx0XHRcdCRzY29wZS5jYWxjdWxhdGVHcmFwaCgpO1xuXHRcdFx0XHR2YXIgd2lkdGggPSA2MTAsXG5cdFx0XHRcdFx0aGVpZ2h0ID0gd2lkdGgsXG5cdFx0XHRcdFx0cmFkaXVzID0gKHdpZHRoKSAvIDIsXG5cdFx0XHRcdFx0eCA9IGQzLnNjYWxlLmxpbmVhcigpLnJhbmdlKFswLCAyICogTWF0aC5QSV0pLFxuXHRcdFx0XHRcdHkgPSBkMy5zY2FsZS5wb3coKS5leHBvbmVudCgxLjMpLmRvbWFpbihbMCwgMV0pLnJhbmdlKFswLCByYWRpdXNdKSxcblx0XHRcdFx0XHQvL34geSA9IGQzLnNjYWxlLnBvdygpLmV4cG9uZW50KDEuMykuZG9tYWluKFswLCAwLjI1LCAxXSkucmFuZ2UoWzAsIDMwLCByYWRpdXNdKSxcblx0XHRcdFx0XHQvL34geSA9IGQzLnNjYWxlLmxpbmVhcigpLmRvbWFpbihbMCwgMC4yNSwgMC41LCAwLjc1LCAxXSkucmFuZ2UoWzAsIDMwLCAxMTUsIDIwMCwgcmFkaXVzXSksXG5cdFx0XHRcdFx0cGFkZGluZyA9IDAsXG5cdFx0XHRcdFx0ZHVyYXRpb24gPSAxMDAwLFxuXHRcdFx0XHRcdGNpcmNQYWRkaW5nID0gMTA7XG5cblx0XHRcdFx0dmFyIGRpdiA9IGQzLnNlbGVjdChlbGVtZW50WzBdKTtcblxuXG5cdFx0XHRcdHZhciB2aXMgPSBkaXYuYXBwZW5kKFwic3ZnXCIpXG5cdFx0XHRcdFx0LmF0dHIoXCJ3aWR0aFwiLCB3aWR0aCArIHBhZGRpbmcgKiAyKVxuXHRcdFx0XHRcdC5hdHRyKFwiaGVpZ2h0XCIsIGhlaWdodCArIHBhZGRpbmcgKiAyKVxuXHRcdFx0XHRcdC5hcHBlbmQoXCJnXCIpXG5cdFx0XHRcdFx0LmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIgKyBbcmFkaXVzICsgcGFkZGluZywgcmFkaXVzICsgcGFkZGluZ10gKyBcIilcIik7XG5cblx0XHRcdFx0Lypcblx0XHRcdFx0ZGl2LmFwcGVuZChcInBcIilcblx0XHRcdFx0XHRcdC5hdHRyKFwiaWRcIiwgXCJpbnRyb1wiKVxuXHRcdFx0XHRcdFx0LnRleHQoXCJDbGljayB0byB6b29tIVwiKTtcblx0XHRcdFx0Ki9cblxuXHRcdFx0XHR2YXIgcGFydGl0aW9uID0gZDMubGF5b3V0LnBhcnRpdGlvbigpXG5cdFx0XHRcdFx0LnNvcnQobnVsbClcblx0XHRcdFx0XHQudmFsdWUoZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdHJldHVybiBkLnNpemU7XG5cdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0dmFyIGFyYyA9IGQzLnN2Zy5hcmMoKVxuXHRcdFx0XHRcdC5zdGFydEFuZ2xlKGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gTWF0aC5tYXgoMCwgTWF0aC5taW4oMiAqIE1hdGguUEksIHgoZC54KSkpO1xuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0LmVuZEFuZ2xlKGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gTWF0aC5tYXgoMCwgTWF0aC5taW4oMiAqIE1hdGguUEksIHgoZC54ICsgZC5keCkpKTtcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC5pbm5lclJhZGl1cyhmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIE1hdGgubWF4KDAsIGQueSA/IHkoZC55KSA6IGQueSk7XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQub3V0ZXJSYWRpdXMoZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdHJldHVybiBNYXRoLm1heCgwLCB5KGQueSArIGQuZHkpKTtcblx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHR2YXIgc3BlY2lhbDEgPSBcIldhc3Rld2F0ZXIgVHJlYXRtZW50XCIsXG5cdFx0XHRcdFx0c3BlY2lhbDIgPSBcIkFpciBQb2xsdXRpb24gUE0yLjUgRXhjZWVkYW5jZVwiLFxuXHRcdFx0XHRcdHNwZWNpYWwzID0gXCJBZ3JpY3VsdHVyYWwgU3Vic2lkaWVzXCIsXG5cdFx0XHRcdFx0c3BlY2lhbDQgPSBcIlBlc3RpY2lkZSBSZWd1bGF0aW9uXCI7XG5cblxuXHRcdFx0XHRcdHZhciBub2RlcyA9IHBhcnRpdGlvbi5ub2RlcyhcdCRzY29wZS5jYWxjdWxhdGVHcmFwaCgpKTtcblxuXHRcdFx0XHRcdHZhciBwYXRoID0gdmlzLnNlbGVjdEFsbChcInBhdGhcIikuZGF0YShub2Rlcyk7XG5cdFx0XHRcdFx0cGF0aC5lbnRlcigpLmFwcGVuZChcInBhdGhcIilcblx0XHRcdFx0XHRcdC5hdHRyKFwiaWRcIiwgZnVuY3Rpb24gKGQsIGkpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIFwicGF0aC1cIiArIGk7XG5cdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0LmF0dHIoXCJkXCIsIGFyYylcblx0XHRcdFx0XHRcdC5hdHRyKFwiZmlsbC1ydWxlXCIsIFwiZXZlbm9kZFwiKVxuXHRcdFx0XHRcdFx0LmF0dHIoXCJjbGFzc1wiLCBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gZC5kZXB0aCA/IFwiYnJhbmNoXCIgOiBcInJvb3RcIjtcblx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0XHQuc3R5bGUoXCJmaWxsXCIsIHNldENvbG9yKVxuXHRcdFx0XHRcdFx0Lm9uKFwiY2xpY2tcIiwgY2xpY2spO1xuXG5cdFx0XHRcdFx0dmFyIHRleHQgPSB2aXMuc2VsZWN0QWxsKFwidGV4dFwiKS5kYXRhKG5vZGVzKTtcblx0XHRcdFx0XHR2YXIgdGV4dEVudGVyID0gdGV4dC5lbnRlcigpLmFwcGVuZChcInRleHRcIilcblx0XHRcdFx0XHRcdC5zdHlsZShcImZpbGwtb3BhY2l0eVwiLCAxKVxuXHRcdFx0XHRcdFx0LmF0dHIoXCJ0ZXh0LWFuY2hvclwiLCBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0XHRpZiAoZC5kZXB0aClcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gXCJtaWRkbGVcIjtcblx0XHRcdFx0XHRcdFx0Ly9+IHJldHVybiB4KGQueCArIGQuZHggLyAyKSA+IE1hdGguUEkgPyBcImVuZFwiIDogXCJzdGFydFwiO1xuXHRcdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIFwibWlkZGxlXCI7XG5cdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0LmF0dHIoXCJpZFwiLCBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gXCJkZXB0aFwiICsgZC5kZXB0aDtcblx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0XHQuYXR0cihcImNsYXNzXCIsIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBcInNlY3RvclwiXG5cdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0LmF0dHIoXCJkeVwiLCBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gZC5kZXB0aCA/IFwiLjJlbVwiIDogXCIwLjM1ZW1cIjtcblx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0XHQuYXR0cihcInRyYW5zZm9ybVwiLCBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0XHR2YXIgbXVsdGlsaW5lID0gKGQubmFtZSB8fCBcIlwiKS5zcGxpdChcIiBcIikubGVuZ3RoID4gMixcblx0XHRcdFx0XHRcdFx0XHRhbmdsZUFsaWduID0gKGQueCA+IDAuNSA/IDIgOiAtMiksXG5cdFx0XHRcdFx0XHRcdGFuZ2xlID0geChkLnggKyBkLmR4IC8gMikgKiAxODAgLyBNYXRoLlBJIC0gOTAgKyAobXVsdGlsaW5lID8gYW5nbGVBbGlnbiA6IDApLFxuXHRcdFx0XHRcdFx0XHRcdHJvdGF0ZSA9IGFuZ2xlICsgKG11bHRpbGluZSA/IC0uNSA6IDApLFxuXHRcdFx0XHRcdFx0XHR0cmFuc2wgPSAoeShkLnkpICsgY2lyY1BhZGRpbmcpICsgMzUsXG5cdFx0XHRcdFx0XHRcdHNlY0FuZ2xlID0gKGFuZ2xlID4gOTAgPyAtMTgwIDogMCk7XG5cdFx0XHRcdFx0XHRcdGlmIChkLm5hbWUgPT0gc3BlY2lhbDMgfHwgZC5uYW1lID09IHNwZWNpYWw0KSByb3RhdGUgKz0gMTtcblx0XHRcdFx0XHRcdFx0aWYgKGQuZGVwdGggPT0gMCkge1xuXHRcdFx0XHRcdFx0XHRcdHRyYW5zbCA9IC0yLjUwO1xuXHRcdFx0XHRcdFx0XHRcdHJvdGF0ZSA9IDA7XG5cdFx0XHRcdFx0XHRcdFx0c2VjQW5nbGUgPSAwO1xuXHRcdFx0XHRcdFx0XHR9IGVsc2UgaWYgKGQuZGVwdGggPT0gMSkgdHJhbnNsICs9IC05O1xuXHRcdFx0XHRcdFx0XHRlbHNlIGlmIChkLmRlcHRoID09IDIpIHRyYW5zbCArPSAtNTtcblx0XHRcdFx0XHRcdFx0ZWxzZSBpZiAoZC5kZXB0aCA9PSAzKSB0cmFuc2wgKz0gNDtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIFwicm90YXRlKFwiICsgcm90YXRlICsgXCIpdHJhbnNsYXRlKFwiICsgdHJhbnNsICsgXCIpcm90YXRlKFwiICsgc2VjQW5nbGUgKyBcIilcIjtcblx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0XHQub24oXCJjbGlja1wiLCBjbGljayk7XG5cblx0XHRcdFx0XHQvLyBBZGQgbGFiZWxzLiBWZXJ5IHVnbHkgY29kZSB0byBzcGxpdCBzZW50ZW5jZXMgaW50byBsaW5lcy4gQ2FuIG9ubHkgbWFrZVxuXHRcdFx0XHRcdC8vIGNvZGUgYmV0dGVyIGlmIGZpbmQgYSB3YXkgdG8gdXNlIGQgb3V0c2lkZSBjYWxscyBzdWNoIGFzIC50ZXh0KGZ1bmN0aW9uKGQpKVxuXG5cdFx0XHRcdFx0Ly8gVGhpcyBibG9jayByZXBsYWNlcyB0aGUgdHdvIGJsb2NrcyBhcnJvdW5kIGl0LiBJdCBpcyAndXNlZnVsJyBiZWNhdXNlIGl0XG5cdFx0XHRcdFx0Ly8gdXNlcyBmb3JlaWduT2JqZWN0LCBzbyB0aGF0IHRleHQgd2lsbCB3cmFwIGFyb3VuZCBsaWtlIGluIHJlZ3VsYXIgSFRNTC4gSSB0cmllZFxuXHRcdFx0XHRcdC8vIHRvIGdldCBpdCB0byB3b3JrLCBidXQgaXQgb25seSBpbnRyb2R1Y2VkIG1vcmUgYnVncy4gVW5mb3J0dW5hdGVseSwgdGhlXG5cdFx0XHRcdFx0Ly8gdWdseSBzb2x1dGlvbiAoaGFyZCBjb2RlZCBsaW5lIHNwbGljaW5nKSB3b24uXG5cdFx0XHRcdFx0Ly9+IHZhciB0ZXh0RW50ZXIgPSB0ZXh0LmVudGVyKCkuYXBwZW5kKFwiZm9yZWlnbk9iamVjdFwiKVxuXHRcdFx0XHRcdC8vfiAuYXR0cihcInhcIiwwKVxuXHRcdFx0XHRcdC8vfiAuYXR0cihcInlcIiwtMjApXG5cdFx0XHRcdFx0Ly9+IC5hdHRyKFwiaGVpZ2h0XCIsIDEwMClcblx0XHRcdFx0XHQvL34gLmF0dHIoXCJ3aWR0aFwiLCBmdW5jdGlvbihkKXsgcmV0dXJuICh5KGQuZHkpICs1MCk7IH0pXG5cdFx0XHRcdFx0Ly9+IC5hdHRyKFwidHJhbnNmb3JtXCIsIGZ1bmN0aW9uKGQpIHtcblx0XHRcdFx0XHQvL34gdmFyIGFuZ2xlQWxpZ24gPSAoZC54ID4gMC41ID8gMiA6IC0yKSxcblx0XHRcdFx0XHQvL34gYW5nbGUgPSB4KGQueCArIGQuZHggLyAyKSAqIDE4MCAvIE1hdGguUEkgLSA5MCxcblx0XHRcdFx0XHQvL34gdHJhbnNsID0gKHkoZC55KSArIGNpcmNQYWRkaW5nKTtcblx0XHRcdFx0XHQvL34gZC5yb3QgPSBhbmdsZTtcblx0XHRcdFx0XHQvL34gaWYgKCFkLmRlcHRoKSB0cmFuc2wgPSAtNTA7XG5cdFx0XHRcdFx0Ly9+IGlmIChhbmdsZSA+IDkwKSB0cmFuc2wgKz0gMTIwO1xuXHRcdFx0XHRcdC8vfiBpZiAoZC5kZXB0aClcblx0XHRcdFx0XHQvL34gcmV0dXJuIFwicm90YXRlKFwiICsgYW5nbGUgKyBcIil0cmFuc2xhdGUoXCIgKyB0cmFuc2wgKyBcIilyb3RhdGUoXCIgKyAoYW5nbGUgPiA5MCA/IC0xODAgOiAwKSArIFwiKVwiO1xuXHRcdFx0XHRcdC8vfiBlbHNlXG5cdFx0XHRcdFx0Ly9+IHJldHVybiBcInRyYW5zbGF0ZShcIiArIHRyYW5zbCArIFwiKVwiO1xuXHRcdFx0XHRcdC8vfiB9KVxuXHRcdFx0XHRcdC8vfiAuYXBwZW5kKFwieGh0bWw6Ym9keVwiKVxuXHRcdFx0XHRcdC8vfiAuc3R5bGUoXCJiYWNrZ3JvdW5kXCIsIFwibm9uZVwiKVxuXHRcdFx0XHRcdC8vfiAuc3R5bGUoXCJ0ZXh0LWFsaWduXCIsIGZ1bmN0aW9uKGQpeyByZXR1cm4gKGQucm90ID4gOTAgPyBcImxlZnRcIiA6IFwicmlnaHRcIil9KVxuXHRcdFx0XHRcdC8vfiAuaHRtbChmdW5jdGlvbihkKXsgcmV0dXJuICc8ZGl2IGNsYXNzPScgK1wiZGVwdGhcIiArIGQuZGVwdGggKycgc3R5bGU9XFxcIndpZHRoOiAnICsoeShkLmR5KSArNTApICsncHg7JyArXCJ0ZXh0LWFsaWduOiBcIiArIChkLnJvdCA+IDkwID8gXCJyaWdodFwiIDogXCJsZWZ0XCIpICsnXCI+JyArZC5uYW1lICsnPC9kaXY+Jzt9KVxuXG5cdFx0XHRcdFx0dGV4dEVudGVyLmFwcGVuZChcInRzcGFuXCIpXG5cdFx0XHRcdFx0XHQuYXR0cihcInhcIiwgMClcblx0XHRcdFx0XHRcdC50ZXh0KGZ1bmN0aW9uIChkKSB7XG5cblx0XHRcdFx0XHRcdFx0aWYgKGQuZGVwdGggPT0gMyAmJiBkLm5hbWUgIT0gc3BlY2lhbDEgJiYgZC5uYW1lICE9IHNwZWNpYWwyICYmIGQubmFtZSAhPSBzcGVjaWFsMyAmJiBkLm5hbWUgIT0gc3BlY2lhbDQpXG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIGQubmFtZS5zcGxpdChcIiBcIilbMF0gKyBcIiBcIiArIChkLm5hbWUuc3BsaXQoXCIgXCIpWzFdIHx8IFwiXCIpO1xuXHRcdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIGQubmFtZS5zcGxpdChcIiBcIilbMF07XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR0ZXh0RW50ZXIuYXBwZW5kKFwidHNwYW5cIilcblx0XHRcdFx0XHRcdC5hdHRyKFwieFwiLCAwKVxuXHRcdFx0XHRcdFx0LmF0dHIoXCJkeVwiLCBcIjFlbVwiKVxuXHRcdFx0XHRcdFx0LnRleHQoZnVuY3Rpb24gKGQpIHtcblxuXHRcdFx0XHRcdFx0XHRpZiAoZC5kZXB0aCA9PSAzICYmIGQubmFtZSAhPSBzcGVjaWFsMSAmJiBkLm5hbWUgIT0gc3BlY2lhbDIgJiYgZC5uYW1lICE9IHNwZWNpYWwzICYmIGQubmFtZSAhPSBzcGVjaWFsNClcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gKGQubmFtZS5zcGxpdChcIiBcIilbMl0gfHwgXCJcIikgKyBcIiBcIiArIChkLm5hbWUuc3BsaXQoXCIgXCIpWzNdIHx8IFwiXCIpO1xuXHRcdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIChkLm5hbWUuc3BsaXQoXCIgXCIpWzFdIHx8IFwiXCIpICsgXCIgXCIgKyAoZC5uYW1lLnNwbGl0KFwiIFwiKVsyXSB8fCBcIlwiKTtcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdHRleHRFbnRlci5hcHBlbmQoXCJ0c3BhblwiKVxuXHRcdFx0XHRcdFx0LmF0dHIoXCJ4XCIsIDApXG5cdFx0XHRcdFx0XHQuYXR0cihcImR5XCIsIFwiMWVtXCIpXG5cdFx0XHRcdFx0XHQudGV4dChmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0XHRpZiAoZC5kZXB0aCA9PSAzICYmIGQubmFtZSAhPSBzcGVjaWFsMSAmJiBkLm5hbWUgIT0gc3BlY2lhbDIgJiYgZC5uYW1lICE9IHNwZWNpYWwzICYmIGQubmFtZSAhPSBzcGVjaWFsNClcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gKGQubmFtZS5zcGxpdChcIiBcIilbNF0gfHwgXCJcIikgKyBcIiBcIiArIChkLm5hbWUuc3BsaXQoXCIgXCIpWzVdIHx8IFwiXCIpO1xuXHRcdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIChkLm5hbWUuc3BsaXQoXCIgXCIpWzNdIHx8IFwiXCIpICsgXCIgXCIgKyAoZC5uYW1lLnNwbGl0KFwiIFwiKVs0XSB8fCBcIlwiKTs7XG5cdFx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdGZ1bmN0aW9uIGNsaWNrKGQpIHtcblx0XHRcdFx0XHRcdC8vIENvbnRyb2wgYXJjIHRyYW5zaXRpb25cblx0XHRcdFx0XHRcdHBhdGgudHJhbnNpdGlvbigpXG5cdFx0XHRcdFx0XHRcdC5kdXJhdGlvbihkdXJhdGlvbilcblx0XHRcdFx0XHRcdFx0LmF0dHJUd2VlbihcImRcIiwgYXJjVHdlZW4oZCkpO1xuXG5cdFx0XHRcdFx0XHQvLyBTb21ld2hhdCBvZiBhIGhhY2sgYXMgd2UgcmVseSBvbiBhcmNUd2VlbiB1cGRhdGluZyB0aGUgc2NhbGVzLlxuXHRcdFx0XHRcdFx0Ly8gQ29udHJvbCB0aGUgdGV4dCB0cmFuc2l0aW9uXG5cdFx0XHRcdFx0XHR0ZXh0LnN0eWxlKFwidmlzaWJpbGl0eVwiLCBmdW5jdGlvbiAoZSkge1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBpc1BhcmVudE9mKGQsIGUpID8gbnVsbCA6IGQzLnNlbGVjdCh0aGlzKS5zdHlsZShcInZpc2liaWxpdHlcIik7XG5cdFx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0XHRcdC50cmFuc2l0aW9uKClcblx0XHRcdFx0XHRcdFx0LmR1cmF0aW9uKGR1cmF0aW9uKVxuXHRcdFx0XHRcdFx0XHQuYXR0clR3ZWVuKFwidGV4dC1hbmNob3JcIiwgZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0aWYgKGQuZGVwdGgpXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiBcIm1pZGRsZVwiO1xuXHRcdFx0XHRcdFx0XHRcdFx0Ly9+IHJldHVybiB4KGQueCArIGQuZHggLyAyKSA+IE1hdGguUEkgPyBcImVuZFwiIDogXCJzdGFydFwiO1xuXHRcdFx0XHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gXCJtaWRkbGVcIjtcblx0XHRcdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0XHQuYXR0clR3ZWVuKFwidHJhbnNmb3JtXCIsIGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRcdFx0dmFyIG11bHRpbGluZSA9IChkLm5hbWUgfHwgXCJcIikuc3BsaXQoXCIgXCIpLmxlbmd0aCA+IDI7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdFx0XHRcdHZhciBtdWx0aWxpbmUgPSAoZC5uYW1lIHx8IFwiXCIpLnNwbGl0KFwiIFwiKS5sZW5ndGggPiAyLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRhbmdsZUFsaWduID0gKGQueCA+IDAuNSA/IDIgOiAtMiksXG5cdFx0XHRcdFx0XHRcdFx0XHRhbmdsZSA9IHgoZC54ICsgZC5keCAvIDIpICogMTgwIC8gTWF0aC5QSSAtIDkwICsgKG11bHRpbGluZSA/IGFuZ2xlQWxpZ24gOiAwKSxcblx0XHRcdFx0XHRcdFx0XHRcdFx0cm90YXRlID0gYW5nbGUgKyAobXVsdGlsaW5lID8gLS41IDogMCksXG5cdFx0XHRcdFx0XHRcdFx0XHR0cmFuc2wgPSAoeShkLnkpICsgY2lyY1BhZGRpbmcpICsgMzUsXG5cdFx0XHRcdFx0XHRcdFx0XHRzZWNBbmdsZSA9IChhbmdsZSA+IDkwID8gLTE4MCA6IDApO1xuXHRcdFx0XHRcdFx0XHRcdFx0aWYgKGQubmFtZSA9PSBzcGVjaWFsMyB8fCBkLm5hbWUgPT0gc3BlY2lhbDQpIHJvdGF0ZSArPSAxO1xuXHRcdFx0XHRcdFx0XHRcdFx0aWYgKGQuZGVwdGggPT0gMCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR0cmFuc2wgPSAtMi41MDtcblx0XHRcdFx0XHRcdFx0XHRcdFx0cm90YXRlID0gMDtcblx0XHRcdFx0XHRcdFx0XHRcdFx0c2VjQW5nbGUgPSAwO1xuXHRcdFx0XHRcdFx0XHRcdFx0fSBlbHNlIGlmIChkLmRlcHRoID09IDEpIHRyYW5zbCArPSAtOTtcblx0XHRcdFx0XHRcdFx0XHRcdGVsc2UgaWYgKGQuZGVwdGggPT0gMikgdHJhbnNsICs9IC01O1xuXHRcdFx0XHRcdFx0XHRcdFx0ZWxzZSBpZiAoZC5kZXB0aCA9PSAzKSB0cmFuc2wgKz0gNDtcblx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiBcInJvdGF0ZShcIiArIHJvdGF0ZSArIFwiKXRyYW5zbGF0ZShcIiArIHRyYW5zbCArIFwiKXJvdGF0ZShcIiArIHNlY0FuZ2xlICsgXCIpXCI7XG5cdFx0XHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRcdFx0LnN0eWxlKFwiZmlsbC1vcGFjaXR5XCIsIGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIGlzUGFyZW50T2YoZCwgZSkgPyAxIDogMWUtNjtcblx0XHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRcdFx0LmVhY2goXCJlbmRcIiwgZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0XHRcdFx0XHRkMy5zZWxlY3QodGhpcykuc3R5bGUoXCJ2aXNpYmlsaXR5XCIsIGlzUGFyZW50T2YoZCwgZSkgPyBudWxsIDogXCJoaWRkZW5cIik7XG5cdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdH1cblxuXG5cdFx0XHRcdGZ1bmN0aW9uIGlzUGFyZW50T2YocCwgYykge1xuXHRcdFx0XHRcdGlmIChwID09PSBjKSByZXR1cm4gdHJ1ZTtcblx0XHRcdFx0XHRpZiAocC5jaGlsZHJlbikge1xuXHRcdFx0XHRcdFx0cmV0dXJuIHAuY2hpbGRyZW4uc29tZShmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gaXNQYXJlbnRPZihkLCBjKTtcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRmdW5jdGlvbiBzZXRDb2xvcihkKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGQuY29sb3I7XG5cdFx0XHRcdFx0aWYgKGQuY29sb3IpXG5cdFx0XHRcdFx0XHRyZXR1cm4gZC5jb2xvcjtcblx0XHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRcdHZhciB0aW50RGVjYXkgPSAwLjIwO1xuXHRcdFx0XHRcdFx0Ly8gRmluZCBjaGlsZCBudW1iZXJcblx0XHRcdFx0XHRcdHZhciB4ID0gMDtcblx0XHRcdFx0XHRcdHdoaWxlIChkLnBhcmVudC5jaGlsZHJlblt4XSAhPSBkKVxuXHRcdFx0XHRcdFx0XHR4Kys7XG5cdFx0XHRcdFx0XHR2YXIgdGludENoYW5nZSA9ICh0aW50RGVjYXkgKiAoeCArIDEpKS50b1N0cmluZygpO1xuXHRcdFx0XHRcdFx0cmV0dXJuIHB1c2hlci5jb2xvcihkLnBhcmVudC5jb2xvcikudGludCh0aW50Q2hhbmdlKS5odG1sKCdoZXg2Jyk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gSW50ZXJwb2xhdGUgdGhlIHNjYWxlcyFcblx0XHRcdFx0ZnVuY3Rpb24gYXJjVHdlZW4oZCkge1xuXHRcdFx0XHRcdHZhciBteSA9IG1heFkoZCksXG5cdFx0XHRcdFx0XHR4ZCA9IGQzLmludGVycG9sYXRlKHguZG9tYWluKCksIFtkLngsIGQueCArIGQuZHggLSAwLjAwMDldKSxcblx0XHRcdFx0XHRcdHlkID0gZDMuaW50ZXJwb2xhdGUoeS5kb21haW4oKSwgW2QueSwgbXldKSxcblx0XHRcdFx0XHRcdHlyID0gZDMuaW50ZXJwb2xhdGUoeS5yYW5nZSgpLCBbZC55ID8gMjAgOiAwLCByYWRpdXNdKTtcblxuXHRcdFx0XHRcdHJldHVybiBmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGZ1bmN0aW9uICh0KSB7XG5cdFx0XHRcdFx0XHRcdHguZG9tYWluKHhkKHQpKTtcblx0XHRcdFx0XHRcdFx0eS5kb21haW4oeWQodCkpLnJhbmdlKHlyKHQpKTtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGFyYyhkKTtcblx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGZ1bmN0aW9uIG1heFkoZCkge1xuXHRcdFx0XHRcdHJldHVybiBkLmNoaWxkcmVuID8gTWF0aC5tYXguYXBwbHkoTWF0aCwgZC5jaGlsZHJlbi5tYXAobWF4WSkpIDogZC55ICsgZC5keTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fSk7XG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ1N1bmJ1cnN0Q3RybCcsIGZ1bmN0aW9uICgkc2NvcGUpIHtcblxuXHRcdCRzY29wZS5zZXRDaGFydCA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdCRzY29wZS5jaGFydCA9IHtcblx0XHRcdFx0b3B0aW9uczoge1xuXHRcdFx0XHRcdGNoYXJ0OiB7XG5cdFx0XHRcdFx0XHR0eXBlOiAnc3VuYnVyc3QnLFxuXHRcdFx0XHRcdFx0aGVpZ2h0OiA3MDAsXG5cdFx0XHRcdFx0XHRcInN1bmJ1cnN0XCI6IHtcblx0XHRcdFx0XHRcdFx0XCJkaXNwYXRjaFwiOiB7fSxcblx0XHRcdFx0XHRcdFx0XCJ3aWR0aFwiOiBudWxsLFxuXHRcdFx0XHRcdFx0XHRcImhlaWdodFwiOiBudWxsLFxuXHRcdFx0XHRcdFx0XHRcIm1vZGVcIjogXCJzaXplXCIsXG5cdFx0XHRcdFx0XHRcdFwiaWRcIjogMjA4OCxcblx0XHRcdFx0XHRcdFx0XCJkdXJhdGlvblwiOiA1MDAsXG5cdFx0XHRcdFx0XHRcdFwibWFyZ2luXCI6IHtcblx0XHRcdFx0XHRcdFx0XHRcInRvcFwiOiAwLFxuXHRcdFx0XHRcdFx0XHRcdFwicmlnaHRcIjogMCxcblx0XHRcdFx0XHRcdFx0XHRcImJvdHRvbVwiOiAwLFxuXHRcdFx0XHRcdFx0XHRcdFwibGVmdFwiOiAwXG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRcInRvb2x0aXBcIjoge1xuXHRcdFx0XHRcdFx0XHRcImR1cmF0aW9uXCI6IDAsXG5cdFx0XHRcdFx0XHRcdFwiZ3Jhdml0eVwiOiBcIndcIixcblx0XHRcdFx0XHRcdFx0XCJkaXN0YW5jZVwiOiAyNSxcblx0XHRcdFx0XHRcdFx0XCJzbmFwRGlzdGFuY2VcIjogMCxcblx0XHRcdFx0XHRcdFx0XCJjbGFzc2VzXCI6IG51bGwsXG5cdFx0XHRcdFx0XHRcdFwiY2hhcnRDb250YWluZXJcIjogbnVsbCxcblx0XHRcdFx0XHRcdFx0XCJmaXhlZFRvcFwiOiBudWxsLFxuXHRcdFx0XHRcdFx0XHRcImVuYWJsZWRcIjogdHJ1ZSxcblx0XHRcdFx0XHRcdFx0XCJoaWRlRGVsYXlcIjogNDAwLFxuXHRcdFx0XHRcdFx0XHRcImhlYWRlckVuYWJsZWRcIjogZmFsc2UsXG5cblx0XHRcdFx0XHRcdFx0XCJvZmZzZXRcIjoge1xuXHRcdFx0XHRcdFx0XHRcdFwibGVmdFwiOiAwLFxuXHRcdFx0XHRcdFx0XHRcdFwidG9wXCI6IDBcblx0XHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdFx0XCJoaWRkZW5cIjogdHJ1ZSxcblx0XHRcdFx0XHRcdFx0XCJkYXRhXCI6IG51bGwsXG5cdFx0XHRcdFx0XHRcdFwidG9vbHRpcEVsZW1cIjogbnVsbCxcblx0XHRcdFx0XHRcdFx0XCJpZFwiOiBcIm52dG9vbHRpcC05OTM0N1wiXG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSxcblx0XHRcdFx0ZGF0YTogW11cblx0XHRcdH07XG5cdFx0XHRyZXR1cm4gJHNjb3BlLmNoYXJ0O1xuXHRcdH1cblx0XHR2YXIgYnVpbGRUcmVlID0gZnVuY3Rpb24gKGRhdGEpIHtcblx0XHRcdHZhciBjaGlsZHJlbiA9IFtdO1xuXHRcdFx0YW5ndWxhci5mb3JFYWNoKGRhdGEsIGZ1bmN0aW9uIChpdGVtKSB7XG5cdFx0XHRcdHZhciBjaGlsZCA9IHtcblx0XHRcdFx0XHQnbmFtZSc6IGl0ZW0udGl0bGUsXG5cdFx0XHRcdFx0J3NpemUnOiBpdGVtLnNpemUsXG5cdFx0XHRcdFx0J2NvbG9yJzogaXRlbS5jb2xvcixcblx0XHRcdFx0XHQnY2hpbGRyZW4nOiBidWlsZFRyZWUoaXRlbS5jaGlsZHJlbilcblx0XHRcdFx0fTtcblx0XHRcdFx0aWYoaXRlbS5jb2xvcil7XG5cdFx0XHRcdFx0Y2hpbGQuY29sb3IgPSBpdGVtLmNvbG9yXG5cdFx0XHRcdH1cblx0XHRcdFx0aWYoaXRlbS5zaXplKXtcblx0XHRcdFx0XHRjaGlsZC5zaXplID0gaXRlbS5zaXplXG5cdFx0XHRcdH1cblx0XHRcdFx0Y2hpbGRyZW4ucHVzaChjaGlsZCk7XG5cdFx0XHR9KTtcblx0XHRcdHJldHVybiBjaGlsZHJlbjtcblx0XHR9O1xuXHRcdCRzY29wZS5jYWxjdWxhdGVHcmFwaCA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdHZhciBjaGFydERhdGEgPSB7XG5cdFx0XHRcdFwibmFtZVwiOiAkc2NvcGUuZGF0YS5uYW1lLFxuXHRcdFx0XHRcImNvbG9yXCI6ICRzY29wZS5kYXRhLmNvbG9yLFxuXHRcdFx0XHRcImNoaWxkcmVuXCI6IGJ1aWxkVHJlZSgkc2NvcGUuZGF0YS5jaGlsZHJlbiksXG5cdFx0XHRcdFwic2l6ZVwiOiAxXG5cdFx0XHR9O1xuXHRcdFx0JHNjb3BlLmNoYXJ0LmRhdGEgPSBjaGFydERhdGE7XG5cdFx0XHRyZXR1cm4gY2hhcnREYXRhO1xuXHRcdH07XG5cdFx0JHNjb3BlLiR3YXRjaCgnZGF0YScsIGZ1bmN0aW9uIChuLCBvKSB7XG5cdFx0XHRpZiAoIW4pIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdFx0JHNjb3BlLmNhbGN1bGF0ZUdyYXBoKCk7XG5cdFx0fSlcblx0fSk7XG5cbn0pKCk7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=