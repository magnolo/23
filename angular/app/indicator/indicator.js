(function() {
	"use strict";

	angular.module('app.controllers').controller('IndicatorShowCtrl', function(indicator, data, countries, ContentService, VectorlayerService) {
		//
		var vm = this;
		vm.countryList = countries;
		vm.indicator = indicator;
		vm.data = data;

		vm.getData = getData;

		VectorlayerService.setData(vm.data, vm.indicator.categories[0].style.base_color);
		VectorlayerService.paintCountries(countriesStyle);

		function getData(year) {
			vm.data = ContentService.getIndicatorData(vm.indicator.id, year);
			VectorlayerService.setData(vm.data, vm.indicator.categories[0].style.base_color);
			VectorlayerService.paintCountries(countriesStyle);
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