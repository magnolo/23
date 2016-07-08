(function() {
	"use strict";

	angular.module('app.controllers').controller('ChapterContentCtrl', function($scope, $timeout, $state, DataService, ContentService, countries, ExportService, IndizesService, IndexService, DialogService, VectorlayerService) {
		//
		var vm = this;

		vm.compare = false;
		vm.activeTab = 0, vm.selectedIndicator = 0;
		vm.selectedCountry = {}, vm.current = {}, vm.circleOptions = {};
		vm.countriesList = [], vm.compareList = [];
		vm.chapterId = $state.params.chapter;
		vm.ExportService = ExportService;
		vm.setCompare = setCompare;
		vm.selectCountry = selectCountry;
		vm.showInfo = showInfo;
		vm.gotoIndicator = gotoIndicator;
		//vm.countries = countries.plain();

		activate();

		VectorlayerService.countryClick(function(data) {
			if (!countryExistsInData(data.feature.id)) return false;
			if (vm.compare) {
				addCompareCountry(data.feature.id, true)
				showComparison();
			} else {
				$state.go('app.export.detail.chapter.indicator.country', {
					indicator: vm.ExportService.indicator.indicator_id,
					indiname: vm.ExportService.indicator.name,
					iso: data.feature.id
				});
				getCountryByIso(data.feature.id);
				fetchNationData(data.feature.id);
			}

		});

		function addCompareCountry(iso, withRemove) {
			if (iso == vm.selectedCountry.iso)
				return false;
			var cl = null;
			var idx = vm.compareList.indexOf(iso);
			angular.forEach(vm.data, function(nat) {
				if (nat.iso == iso) {
					cl = nat;
				}
			})
			if (idx == -1) {
				if (cl) {
					vm.countriesList.push(cl);
					vm.compareList.push(cl.iso);
					VectorlayerService.setSelectedFeature(cl.iso, true);
				}
			} else if (withRemove) {
				vm.compareList.splice(idx, 1);
				vm.countriesList.splice(vm.countriesList.indexOf(cl), 1);
				VectorlayerService.setSelectedFeature(iso, false);
			}

		}

		function showComparison() {
			$state.go('app.export.detail.chapter.indicator.country.compare', {
				countries: vm.compareList.join('-vs-')
			});
			VectorlayerService.gotoCountries($state.params.iso, vm.compareList);
		}

		function setCompare(activate) {
			if (activate) {
				vm.compare = true;
				vm.countriesList[0] = vm.selectedCountry;
				VectorlayerService.invertStyle();
				$state.go('app.export.detail.chapter.indicator.country.compare', {
					countries: vm.compareList.join('-vs-')
				});
			} else {
				vm.compare = false;
				VectorlayerService.localStyle();
				$state.go('app.export.detail.chapter.indicator.country');
				VectorlayerService.setSelectedFeature($state.params.iso, true);

				//muss nicht sein
				vm.compareList = [];
				vm.countriesList = [];
			}

		}

		function getIndicator(finished) {

			vm.ExportService.getIndicator($state.params.id, $state.params.chapter, $state.params.indicator, function(indicator, chapter, exporter) {
				vm.selectedIndicator = indicator;

				// renderIndicator(indicator, function() {
				// 	if ($state.params.iso) {
				// 		fetchNationData($state.params.iso);
				// 	}
				// 	if (typeof finished == "function") {
				// 		finished();
				// 	}
				// });
				renderIndicator(indicator, finished);
			});
		}
		//URL PROBLEM LIES HERE AND ON EXPORT SERVICE
		function gotoIndicator() {
			if (vm.ExportService.chapter.type == "indicator") {
				var idx = 0;
				angular.forEach(vm.ExportService.exporter.items, function(item, key) {
					if (item.id == vm.selectedIndicator.id) {
						idx = key;
					}
				})
				$state.go('app.export.detail.chapter.indicator', {
					chapter: idx + 1,
					indicator: vm.selectedIndicator.indicator_id,
					indiname: vm.selectedIndicator.name
				});
			} else {


				if (vm.ExportService.chapter.id != vm.selectedIndicator.parent.id) {
					var idx = 0;
					angular.forEach(vm.ExportService.exporter.items, function(item, key) {
						if (item.id == vm.selectedIndicator.parent.id) {
							idx = key;
						}
					})
					$state.go('app.export.detail.chapter.indicator', {
						chapter: idx + 1,
						indicator: vm.selectedIndicator.indicator_id,
						indiname: vm.selectedIndicator.name
					});
				} else {
					$state.go('app.export.detail.chapter.indicator', {
						indicator: vm.selectedIndicator.indicator_id,
						indiname: vm.selectedIndicator.name
					});
				}
			}
			getIndicator();
		}

		function selectCountry(nation) {
			$state.go('app.export.detail.chapter.indicator.country', {
				iso: nation.iso
			});
			VectorlayerService.setSelectedFeature(nation.iso, true);
			getCountryByIso(nation.iso);
			fetchNationData(nation.iso);
		}

		function getCountryByName(name) {
			var iso = null;
			angular.forEach(vm.countries, function(nat, key) {
				if (nat == name) {
					iso = key;
				}
			});
			getCountryByIso(iso);
			return iso;
		}

		function countryExistsInData(iso) {
			var found = false;
			angular.forEach(vm.data, function(item) {
				if (item.iso == iso) {
					found = true;
				}
			});
			return found;
		}

		function getCountryByIso(iso) {
			angular.forEach(vm.data, function(item) {
				if (item.iso == iso) {
					vm.selectedCountry = item;
				}
			})
			return iso;
		}

		function fetchNationData(iso) {
			if (!$state.params.countries) {
				VectorlayerService.gotoCountry(iso);
			}
			VectorlayerService.setSelectedFeature(iso, true);
			IndexService.fetchNationData(vm.ExportService.indicator.indicator_id, iso, function(data) {
				//	vm.nation = vm.countries[iso];
				vm.current = data;
				//calcRank();
			});
		}

		function renderIndicator(item, done) {

			ContentService.fetchIndicatorWithData(item.indicator_id, function(indicator) {
				vm.data = indicator.data;
				vm.structure = indicator;
				vm.circleOptions = {
					color: vm.ExportService.indicator.style.base_color || '#00ccaa',
					field: 'rank',
					size: vm.structure.count,
					hideNumbering: true
				};

				VectorlayerService.setBaseLayer(item.style.basemap);
				VectorlayerService.setMapDefaults(item.style);
				VectorlayerService.setData(indicator.data, indicator, item.style.base_color, true);

				// if ($state.params.iso) {
				// 	$state.go('app.export.detail.chapter.indicator.country', {
				// 		indicator: item.indicator_id,
				// 		indiname: item.indicator.name,
				// 		iso: $state.params.iso
				// 	});
				// 	getCountryByIso($state.params.iso);
				// 	fetchNationData($state.params.iso);
				//
				// } else {
				// 	$state.go('app.export.detail.chapter.indicator', {
				// 		indicator: item.indicator_id,
				// 		indiname: item.indicator.name
				// 	});
				// }
				if (typeof done == "function") {
					done();
				}
			}, {
				data: true
			});

		}

		function showInfo() {
			DialogService.fromTemplate('export', $scope);
		}


		function activate() {
			$timeout(function() {
				getIndicator(function() {
					if ($state.params.iso) {
						getCountryByIso($state.params.iso);
						if ($state.params.countries) {
							var countries = $state.params.countries.split('-vs-');
							angular.forEach(countries, function(country) {
								addCompareCountry(country);
							});
							vm.activeTab = 2;
							VectorlayerService.gotoCountries($state.params.iso, vm.compareList);
						}
					}
				});

			});
		}
	});

})();
