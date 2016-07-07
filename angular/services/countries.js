(function() {
	"use strict";

	angular.module('app.services').factory('CountriesService', function(DataService) {
		//
		return {
			countries: [],
			continents: [],
			indicator: null,
			fetchData: function() {
				return this.countries = DataService.getOne('countries/isos').$object;
			},
			getData: function() {
				if (!this.countries.length) {
					this.fetchData();
				}
				return this.countries;
			},
			getContinents: function(success, indicator) {
				var _that = this;
				if (this.continents.length && indicator == this.indicator) {
					success(this.continents);
				} else {
					this.indicator = indicator;
					return DataService.getAll('continents', {
						indicator: indicator
					}).then(function(continents) {
						_that.continents = continents;
						success(continents);
					});
				}

			}
		}
	});

})();
