(function () {
	"use strict";

	angular.module('app.controllers').controller('EpiCtrl', function ($scope,$state, Restangular, leafletData, MapService) {

		$scope.indexData = {
			 name:'EPI',
			 full_name: 'Environment Preformance Index',
			 table: 'epi',
			 allCountries: 'yes',
			 countries: [],
			 score_field_name: 'score',
			 change_field_name: 'percent_change',
			 order_field: 'year',
			 countries_id_field: 'country_id',
			 countries_iso_field: 'iso',
			 data_tree:[{
				 column_name: 'eh',
				 title: 'Enviromental Health',
				 range:[0, 100],
				 weigth: 40,
				 icon:'',
				 color:'',
				 children:[{
					 column_name:'eh_hi',
					 title:'Health Impact',
					 icon: 'man',
					 unicode: '\ue605',
					 color: '#ff9600',
					 children:[{
						 column_name: 'eh_hi_child_mortality',
						 title:'Child Mortality',
						 icon:'',
						 color:'',
						 description:'Probability of dying between a childs first and fifth birthdays (between age 1 and 5)'
					 }]
				 },{
					 column_name:'eh_aq',
					 title:'Air Quality',
					 color: '#f7c80b',
					 icon: 'sink',
					 unicode: '\ue606',
					 children:[{
						 column_name: 'eh_aq_household_air_quality',
						 title:'Household Air Quality',
						 icon:'',
						 color:'',
						 description:'Percentage of the population using solid fuels as primary cooking fuel.'
					 },{
						 column_name: 'eh_aq_exposure_pm25',
						 title:'Air Pollution - Average Exposure to PM2.5',
						 icon:'',
						 color:'',
						 description:'Population weighted exposure to PM2.5 (three- year average)'
					 },{
						 column_name: 'eh_aq_exeedande_pm25',
						 title:'Air Pollution - PM2.5 Exceedance',
						 icon:'',
						 color:'',
						 description:'Proportion of the population whose exposure is above  WHO thresholds (10, 15, 25, 35 micrograms/m3)'
					 }]
				 },{
					 column_name:'eh_ws',
					 title:'Water Sanitation',
					 color: '#ff6d24',
					 icon: 'fabric',
					 unicode: '\ue604',
					 children:[{
						column_name: 'eh_ws_access_to_drinking_water',
						title:'Access to Drinking Water',
						icon:'',
						color:'',
						description:'Percentage of population with access to improved drinking water source'
					},{
						column_name: 'eh_ws_access_to_sanitation',
						title:'Access to Sanitation',
						icon:'',
						color:'',
						description:'Percentage of population with access to improved sanitation'
					}]
				 }]
			 },{
				 column_name: 'ev',
				 title: 'Enviromental Validity',
				 range:[0, 100],
				 weight:60,
				 icon:'',
				 color:'',
				 children:[{
					 column_name:'ev_wr',
					 title:'Water Resources',
					 color: '#7993f2',
					 icon: 'water',
					 unicode: '\ue608',
					 children:[{
						 column_name: 'ev_wr_wastewater_treatment',
						 title:'Wastewater Treatment',
						 icon:'',
						 color:'',
						 description:'Wastewater treatment level weighted by connection to wastewater treatment rate.'
					 }]
				 },{
					 column_name:'ev_ag',
					 title:'Agriculture',
					 color: '#009bcc',
					 icon: 'agrar',
					 unicode: '\ue600',
					 children:[{
						 column_name: 'ev_ag_agricultural_subsidies',
						 title:'Agricultural Subsidies',
						 icon:'',
						 color:'',
						 description:'Subsidies are expressed in price of their product in the domestic market (plus any direct output subsidy) less its price at the border, expressed as a percentage of the border price (adjusting for transport costs and quality differences).'
					 },{
						 column_name: 'ev_ag_pesticide_regulation',
						 title:'Pesticide Regulation',
						 icon:'',
						 color:'',
						 description:'Wastewater treatment level weighted by connection to wastewater treatment rate.'
					 }]
				 },{
					 column_name:'ev_fo',
					 title:'Forest',
					 color: '#2e74ba',
					 icon: 'tree',
					 unicode: '\ue607',
					 children:[{
						 column_name: 'ev_fo_change_in_forest_cover',
						 title:'Change in Forest Cover',
						 icon:'',
						 color:'',
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
						 icon:'',
						 color:'',
						 description:'Catch in metric tons from trawling and dredging gears (mostly bottom trawls) divided by EEZ area.'
					 },{
						 column_name: 'ev_fi_fish_stocks',
						 title:'Fish Stocks',
						 icon:'',
						 color:'',
						 description:'Percentage of fishing stocks overexploited and collapsed from EEZ.'
					 }]
				 },{
					 column_name:'ev_bd',
					 title:'Biodiversity and Habitat',
					 color: '#00ccaa',
					 icon: 'butterfly',
					 unicode: '\ue602',
					 children:[{
						 column_name: 'ev_bd_terrestrial_protected_areas_national_biome',
						 title:'Terrestrial Protected Areas (National Biome Weights)',
						 icon:'',
						 color:'',
						 description:'Percentage of terrestrial biome area that is protected, weighted by domestic biome area.'
					 },{
						 column_name: 'ev_bd_terrestrial_protected_areas_global_biome',
						 title:'Terrestrial Protected Areas (Global Biome Weights)',
						 icon:'',
						 color:'',
						 description:'Percentage of terrestrial biome area that is protected, weighted by global biome area.'
					 },{
						 column_name: 'ev_bd_marine_protected_areas',
						 title:'Marine Protected Areas',
						 icon:'',
						 color:'',
						 description:'Marine protected areas as a percent of EEZ.'
					 },{
						 column_name: 'ev_bd_critical_habitat_protection',
						 title:'Critical Habitat Protection',
						 icon:'',
						 color:'',
						 description:'Percentage of terrestrial biome area that is protected, weighted by global biome area.'
					 }]
				 },{
					 column_name:'ev_ce',
					 title:'Climate and Energy',
					 color: '#1cb85d',
					 icon: 'energy',
					 unicode: '\ue603',
					 children:[{
						 column_name: 'ev_ce_trend_in_carbon_intensity',
						 title:'Trend in Carbon Intensity',
						 icon:'',
						 color:'',
						 description:'Change in CO2 emissions per unit GDP from 1990 to 2010.'
					 },{
						 column_name: 'ev_ce_change_of_trend_in_carbon_intesity',
						 title:'Change of Trend in Carbon Intensity',
						 icon:'',
						 color:'',
						 description:'Change in Trend of CO2 emissions per unit GDP from 1990 to 2000; 2000 to 2010.'
					 },{
						 column_name: 'ev_ce_trend_in_co2_emissions_per_kwh',
						 title:'Trend in CO2 Emissions per KWH',
						 icon:'',
						 color:'',
						 description:'Change in CO2 emissions from electricity and heat production.'
					 }]
				 }]
			 }]
		};
		$scope.current = "";
		$scope.display = {
			selectedCat: ''
		};
		$scope.menueOpen = true;
		$scope.details = false;
		$scope.closeIcon = 'chevron_left';
		$scope.setState = function(iso){
			angular.forEach($scope.epi, function(epi){
				if(epi.iso == iso){
					$scope.current = epi;
				}
			});
		};
		var epi = Restangular.all('epi/year/2014');
		epi.getList().then(function (data) {
			$scope.epi = data;
			$scope.drawCountries();
			if($state.current.name == "app.epi.selected"){
			//setState($state.params.item);
			}
		});
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
		$scope.toggleDetails = function () {
			return $scope.details = !$scope.details;
		}
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
			var country = Restangular.one('nations', newItem.iso).get();

			country.then(function (data) {
				$scope.country = data;
				$state.go('app.epi.selected', {item:newItem.iso})
			});
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
		createCanvas();


		$scope.drawCountries = function () {
			leafletData.getMap('map').then(function (map) {
				//	L.tileLayer('http://localhost:3001/services/postgis/countries_big/geom/dynamicMap/{z}/{x}/{y}.png').addTo(map);
				var debug = {};
				var apiKey = 'pk.eyJ1IjoibWFnbm9sbyIsImEiOiJuSFdUYkg4In0.5HOykKk0pNP1N3isfPQGTQ';
				var url = 'http://localhost:3001/services/postgis/countries_big/geom/vector-tiles/{z}/{x}/{y}.pbf?fields=id,admin,adm0_a3,name,name_long'; //
				var url2 = 'https://a.tiles.mapbox.com/v4/mapbox.mapbox-streets-v6-dev/{z}/{x}/{y}.vector.pbf?access_token=' + apiKey;
				var mvtSource = new L.TileLayer.MVTSource({
					url: url, //"http://spatialserver.spatialdev.com/services/vector-tiles/gaul_fsp_india/{z}/{x}/{y}.pbf",
					debug: false,
					clickableLayers: ['countries_big_geom'],
					mutexToggle: true,
					onClick: function (evt, t) {
						//map.fitBounds(evt.target.getBounds());
						/*console.log(evt.latlng);
						var x = evt.feature.bbox()[0]/ (evt.feature.extent / evt.feature.tileSize);
						var y = evt.feature.bbox()[1]/(evt.feature.extent / evt.feature.tileSize)
						console.log(new L.Point(x,y));
						console.log([
							[evt.feature.bbox()[0]/ (evt.feature.extent / evt.feature.tileSize), evt.feature.bbox()[1]/(evt.feature.extent / evt.feature.tileSize)],
							[evt.feature.bbox()[2]/(evt.feature.extent / evt.feature.tileSize), evt.feature.bbox()[3]/(evt.feature.extent / evt.feature.tileSize)],
						]);
						debugger;*/
						if ($scope.current.country != evt.feature.properties.admin) {
							map.panTo(evt.latlng);
							map.panBy(new L.Point(-200,0));
						/*	map.fitBounds([
								[evt.feature.bbox()[0] / (evt.feature.extent / evt.feature.tileSize), evt.feature.bbox()[1] / (evt.feature.extent / evt.feature.tileSize)],
								[evt.feature.bbox()[2] / (evt.feature.extent / evt.feature.tileSize), evt.feature.bbox()[3] / (evt.feature.extent / evt.feature.tileSize)],
							])*/
						}
						$scope.current = getNationByName(evt.feature.properties.admin);
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

					style: function (feature) {
						var style = {};
						var nation = getNationByName(feature.properties.admin);
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
							if (nation.score) {
								var colorPos = parseInt(256 / 100 * nation.score) * 4;
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
								html: ajaxData.total_count,
								iconSize: [33, 33],
								cssClass: 'label-icon-number',
								cssSelectedClass: 'label-icon-number-selected'
							};
							return style;
						};
						//	}

						return style;
					},


					layerLink: function (layerName) {
						if (layerName.indexOf('_label') > -1) {
							return layerName.replace('_label', '');
						}
						return layerName + '_label';
					}

				});
				debug.mvtSource = mvtSource;
				map.addLayer(mvtSource);
			});
		};
	});
})();
