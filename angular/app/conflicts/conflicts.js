(function () {
	"use strict";

	angular.module('app.controllers').controller('ConflictsCtrl', function ($timeout,$state, $rootScope, $scope, conflicts, VectorlayerService, Restangular) {
		//

		var vm = this;
		vm.ready = false;
		vm.conflicts = conflicts;
		vm.relations = [];
		vm.linearScale = d3.scale.linear().domain([0, 5]).range([0, 256]);
		vm.colors = ['#d4ebf7', '#87cceb', '#36a8c6', '#268399', '#0e6377'];
		vm.typesColors = {
			interstate: '#69d4c3',
			intrastate: '#b7b7b7',
			substate: '#ff9d27'
		};
		vm.active = {
			conflict: '',
			tpye: ''
		};
		vm.conflictCount = 0;
		vm.conflictIntensities = {
			veryLow: 0,
			low: 0,
			mid: 0,
			high: 0,
			veryHigh: 0
		};
		vm.chartData = [{
			label: 1,
			value: 0,
			color: vm.colors[0]
		}, {
			label: 2,
			value: 0,
			color: vm.colors[1]
		}, {
			label: 3,
			value: 0,
			color: vm.colors[2]
		}, {
			label: 4,
			value: 0,
			color: vm.colors[3]
		}, {
			label: 5,
			value: 0,
			color: vm.colors[4]
		}];

		vm.conflictTypes = [{
			type: 'interstate',
			color: '#69d4c3',
			count: 0
		}, {
			type: 'intrastate',
			count: 0,
			color: '#b7b7b7'
		}, {
			type: 'substate',
			count: 0,
			color: '#ff9d27'
		}];

		activate();

		function activate() {
			VectorlayerService.setStyle(countriesStyle);
			VectorlayerService.countryClick(countryClick);
			VectorlayerService.setData(vm.conflicts, vm.colors, true);
			//	$timeout(function() {
			calcIntensities();
			//});
		}

		function calcIntensities() {
			angular.forEach(vm.conflicts, function (nation) {

				angular.forEach(nation.conflicts, function (conflict) {
					vm.conflictCount++;
					switch (conflict.type_id) {
					case 1:
						vm.conflictTypes[0].count++;
						break;
					case 2:
						vm.conflictTypes[1].count++;
						break;
					case 3:
						vm.conflictTypes[2].count++;
						break;
					default:

					}
					switch (conflict.int2015) {
					case 1:
						vm.conflictIntensities.veryLow++;
						vm.chartData[0].value++;
						break;
					case 2:
						vm.conflictIntensities.low++;
						vm.chartData[1].value++;
						break;
					case 3:
						vm.conflictIntensities.mid++;
						vm.chartData[2].value++;
						break;
					case 4:
						vm.conflictIntensities.high++;
						vm.chartData[3].value++;
						break;
					case 5:
						vm.conflictIntensities.veryHigh++;
						vm.chartData[4].value++;
						break;
					default:
					}
				})
			});
			vm.ready = true;
		}

		function countryClick(evt, t) {

			var country = VectorlayerService.getNationByIso(evt.feature.properties['iso_a2']);
			if (typeof country['intensity'] != "undefined") {
				VectorlayerService.resetSelected(country.iso);
				$state.go('app.conflict.index.nation',{iso:country.iso});
			}
		}
		function invertedStyle(feature){
			var style = {};
			var iso = feature.properties[VectorlayerService.data.iso2];
			var nation = VectorlayerService.getNationByIso(iso);
			var field = 'intensity';
			var colorPos = parseInt(vm.linearScale(parseFloat(nation[field]))) * 4; // parseInt(256 / vm.range.max * parseInt(nation[field])) * 4;

			var color = 'rgba(' + VectorlayerService.palette[colorPos] + ', ' + VectorlayerService.palette[colorPos + 1] + ', ' + VectorlayerService.palette[colorPos + 2] + ',' + VectorlayerService.palette[colorPos + 3] + ')';
			style.color = 'rgba(0,0,0,0)';
			style.outline = {
				color: 'rgba(0,0,0,0)',
				size: 0
			};
			style.selected = {
				color: color,
				outline: {
					color: 'rgba(0,0,0,0.3)',
					size: 1
				}
			};
			return style;
		}
		function countriesStyle(feature) {
			var style = {};
			var iso = feature.properties[VectorlayerService.data.iso2];
			var nation = VectorlayerService.getNationByIso(iso);

			var field = 'intensity';
			var type = feature.type;
			feature.selected = false;

			switch (type) {
			case 3: //'Polygon'
				if (typeof nation[field] != "undefined" && nation[field] != null) {
					var colorPos = parseInt(vm.linearScale(parseFloat(nation[field]))) * 4; // parseInt(256 / vm.range.max * parseInt(nation[field])) * 4;
					var color = 'rgba(' + VectorlayerService.palette[colorPos] + ', ' + VectorlayerService.palette[colorPos + 1] + ', ' + VectorlayerService.palette[colorPos + 2] + ',' + VectorlayerService.palette[colorPos + 3] + ')';
						style.color = 'rgba(' + VectorlayerService.palette[colorPos] + ', ' + VectorlayerService.palette[colorPos + 1] + ', ' + VectorlayerService.palette[colorPos + 2] + ',0.6)'; //color;
						style.outline = {
							color: color,
							size: 1
						};
					style.selected = {
						color: 'rgba(' + VectorlayerService.palette[colorPos] + ', ' + VectorlayerService.palette[colorPos + 1] + ', ' + VectorlayerService.palette[colorPos + 2] + ',' + VectorlayerService.palette[colorPos + 3] + ')',
						outline: {
							color: 'rgba(66,66,66,0.9)',
							size: 2
						}
					};

				} else {
					style.color = 'rgba(255,255,255,0)';
					style.outline = {
						color: 'rgba(255,255,255,0)',
						size: 1
					};

				}
				break;
			}
			return style;
		};
	});

})();
