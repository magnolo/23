(function() {
	"use strict";

	angular.module('app.controllers').controller('IndicatorShowCtrl', function($scope, $state, $filter,$timeout, indicator, data, countries, ContentService, VectorlayerService, toastr) {
		//
		var vm = this;
		vm.current = null;
		vm.countryList = countries;
		vm.indicator = indicator;
		vm.data = data;
		console.log(vm.indicator);
		vm.circleOptions = {
			color: vm.indicator.styled.base_color || '#00ccaa',
			field: 'rank',
			size: vm.data.length
		};

		vm.getData = getData;
		vm.setCurrent = setCurrent;
		vm.getOffset = getOffset;
		vm.getRank = getRank;

		activate();

		function activate(){
			if($state.params.iso){
				setState($state.params.iso);
			}
		}

		function setState(iso) {
			$timeout(function(){
				//console.log(VectorlayerService.getNationByIso(iso));
				//vm.current = VectorlayerService.getNationByIso(iso);
			})
		};

		function getRank(country) {
			var rank = vm.data.indexOf(country) + 1;
			return rank;
		}

		function getOffset() {
			if (!vm.current) {
				return 0;
			}
			//console.log(vm.getRank(vm.current));
			return (vm.getRank(vm.current) - 2) * 17;
		};

		function setCurrent(nat) {
			vm.current = nat;
			setSelectedFeature();
		};

		function setSelectedFeature() {

			/*	$timeout(function() {
					VectorlayerService.getLayer().layers[VectorlayerService.getName()+'_geom'].features[vm.current.iso].selected = true;
				});*/
				$state.go('app.index.indicator.country', {
					id: $state.params.id,
					name:$state.params.name,
					iso:vm.current.iso
				})
		};
		function countryClick(evt,t){
			var c = VectorlayerService.getNationByIso(evt.feature.properties[VectorlayerService.data.iso2]);
			if (typeof c.score != "undefined") {
				vm.current = c;
			} else {
				toastr.error('No info about this location!');
			}
		}
		function getData(year) {
			ContentService.getIndicatorData(vm.indicator.id, year).then(function(data) {
				vm.data = data;
				angular.forEach(vm.data, function(item){
					item.rank = vm.data.indexOf(item) +1;
				});
				getOffset();
				VectorlayerService.setData(vm.data, vm.indicator.styled.base_color);
				VectorlayerService.paintCountries(countriesStyle, countryClick);
			});


		}

		function countriesStyle(feature) {
			var style = {};
			var iso = feature.properties[VectorlayerService.data.iso2];
			var nation = VectorlayerService.getNationByIso(iso);
			var field = 'score';
			var type = feature.type;
			feature.selected = false;
			switch (type) {
				case 3: //'Polygon'
					if (typeof nation[field] != "undefined") {
						var colorPos = parseInt(256 / 100 * parseInt(nation[field])) * 4;

						var color = 'rgba(' + VectorlayerService.palette[colorPos] + ', ' + VectorlayerService.palette[colorPos + 1] + ', ' + VectorlayerService.palette[colorPos + 2] + ',' + VectorlayerService.palette[colorPos + 3] + ')';
						style.color = 'rgba(' + VectorlayerService.palette[colorPos] + ', ' + VectorlayerService.palette[colorPos + 1] + ', ' + VectorlayerService.palette[colorPos + 2] + ',0.6)'; //color;
						style.outline = {
							color: color,
							size: 1
						};
						style.selected = {
							color: 'rgba(' + VectorlayerService.palette[colorPos] + ', ' + VectorlayerService.palette[colorPos + 1] + ', ' + VectorlayerService.palette[colorPos + 2] + ',0.3)',
							outline: {
								color: 'rgba(66,66,66,0.9)',
								size: 2
							}
						};
						//	debugger;
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



	});
})();
