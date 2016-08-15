(function() {
	"use strict";

	angular.module('app.controllers').controller('ChapterContentCtrl', function($scope, $rootScope, $timeout, $state, DataService, ContentService, countries, ExportService, IndizesService, IndexService, DialogService, VectorlayerService) {
		//
		var vm = this;
		$rootScope.sidebarOpen = false;
		vm.compare = false;
		vm.activeTab = 0, vm.selectedIndicator;
		vm.selectedCountry = {}, vm.current = {}, vm.circleOptions = {};
		vm.countriesList = [], vm.compareList = [];
		vm.chapterId = $state.params.chapter;
		vm.ExportService = ExportService;
		vm.setCompare = setCompare;
		vm.selectCountry = selectCountry;
		vm.showInfo = showInfo;
		vm.gotoIndicator = gotoIndicator;
		//vm.countries = countries.plain();
		vm.compareOptions = {};
		activate();

		VectorlayerService.countryClick(function(e) {
			var feature = VectorlayerService.mapLayer.queryRenderedFeatures(e.point, {
				layers: [VectorlayerService.getName()]
			});
			if(feature.length){
				var iso = feature[0].properties.ISO_A2;
				if (!countryExistsInData(iso)) return false;
				if (vm.compare) {
					addCompareCountry(iso, true)
					showComparison();
				} else {
					$state.go('app.export.detail.chapter.indicator.country', {
						indicator: vm.ExportService.indicator.indicator_id,
						indiname: vm.ExportService.indicator.name,
						iso: iso
					});
					//$rootScope.sidebarOpen = false;
					getCountryByIso(iso);
					fetchNationData(iso);
				}
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
				renderIndicator(indicator, finished);
			});
		}

		// DRY in you face. REDUCE THIS MULTIPLE KOT
		function gotoIndicator() {
			if (vm.ExportService.chapter.type == "indicator") {
				var idx = 0;
				angular.forEach(vm.ExportService.exporter.items, function(item, key) {
					if (item.id == vm.selectedIndicator.id) {
						idx = key;
					}
				})
				if(typeof vm.selectedCountry.iso != "undefined"){
					$state.go('app.export.detail.chapter.indicator.country', {
						chapter: idx + 1,
						indicator: vm.selectedIndicator.indicator_id,
						indiname: vm.selectedIndicator.name,
						iso:vm.selectedCountry.iso
					});
				}
				else{
					$state.go('app.export.detail.chapter.indicator', {
						chapter: idx + 1,
						indicator: vm.selectedIndicator.indicator_id,
						indiname: vm.selectedIndicator.name
					});
				}
			} else {
				if (vm.ExportService.chapter.id != vm.selectedIndicator.parent.id) {
					var idx = 0;
					angular.forEach(vm.ExportService.exporter.items, function(item, key) {
						if (item.id == vm.selectedIndicator.parent.id) {
							idx = key;
						}
					})
					if(typeof vm.selectedCountry.iso != "undefined"){
						$state.go('app.export.detail.chapter.indicator.country', {
							chapter: idx + 1,
							indicator: vm.selectedIndicator.indicator_id,
							indiname: vm.selectedIndicator.name,
							iso:vm.selectedCountry.iso
						});
					}
					else{
						$state.go('app.export.detail.chapter.indicator', {
							chapter: idx + 1,
							indicator: vm.selectedIndicator.indicator_id,
							indiname: vm.selectedIndicator.name
						});
					}
				} else {
					if(typeof vm.selectedCountry.iso != "undefined"){
						$state.go('app.export.detail.chapter.indicator.country', {
							indicator: vm.selectedIndicator.indicator_id,
							indiname: vm.selectedIndicator.name,
							iso:vm.selectedCountry.iso
						});
					}
					else{
						$state.go('app.export.detail.chapter.indicator', {
							indicator: vm.selectedIndicator.indicator_id,
							indiname: vm.selectedIndicator.name
						});
					}
					loadStateData();
				}
			}
		}

		function selectCountry(nation) {
			$state.go('app.export.detail.chapter.indicator.country', {
				iso: nation.iso
			});
			//VectorlayerService.setSelectedFeature(nation.iso, true, true);
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


			IndexService.fetchNationData(vm.ExportService.indicator.indicator_id, iso, function(data) {
				vm.current = data;
				VectorlayerService.setSelectedFeature(iso, true, true);
				$rootScope.sidebarOpen = true;

			});
		}

		function renderIndicator(item, done) {
			ContentService.fetchIndicatorWithData(item.indicator_id, function(indicator) {
				vm.data = indicator.data;
				vm.structure = indicator;
				vm.ExportService.data = indicator;
				vm.circleOptions = {
					color: vm.ExportService.indicator.style.base_color || '#00ccaa',
					field: 'rank',
					size: vm.structure.count,
					hideNumbering: true,
					width: 60,
					height: 60,
					fontSize:12
				};
				vm.compareOptions = {field: 'score', height: 25, margin:5, color:vm.ExportService.indicator.style.base_color, duration:500, min:vm.structure.min, max:vm.structure.max}

				if (typeof item.style.color_range == "string") {
					item.style.color_range = JSON.parse(item.style.color_range);
				}

				// VectorlayerService.setBaseLayer(item.style.basemap, item.indicator.dataprovider);
				// VectorlayerService.setMapDefaults(item.style);

				 VectorlayerService.setData(indicator.data, indicator, item.style.color_range || item.style.base_color, true);

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

		function loadStateData(){
			$timeout(function() {
				//RESET COUNTRY FOR CORRECT VIEW, IF NOT: View would stay active
				vm.selectedCountry = {};
				getIndicator(function() {
					if ($state.params.iso) {
						getCountryByIso($state.params.iso);
						fetchNationData($state.params.iso);

						if ($state.params.countries) {
							var countries = $state.params.countries.split('-vs-');
							angular.forEach(countries, function(country) {
								addCompareCountry(country);
							});
							vm.activeTab = 2;
							VectorlayerService.gotoCountries($state.params.iso, vm.compareList);
						}
					}
					else{
						vm.selectedCountry = {};
					}
					if (typeof vm.ExportService.chapter != "undefined") {
						if(vm.ExportService.chapter.description){
								showInfo()
						}
					}
				});


			});
		}

		function activate() {
			loadStateData();
		}

		$scope.$watch('vm.selectedIndicator', function(n, o){
			if(n === o || typeof n.id == "undefined") return false;
			if(typeof o != "undefined"){
				if(n.id == o.id) return false;
			}
			vm.gotoIndicator();
		})
	});

})();
