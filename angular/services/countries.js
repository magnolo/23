(function() {
	"use strict";

	angular.module('app.services').factory('CountriesService', function(DataService) {
		//
		return {
			countries: [],
			continents: [],
			fetchData: function() {
				return this.countries = DataService.getOne('countries/isos').$object;
			},
			getData: function() {
				if (!this.countries.length) {
					this.fetchData();
				}
				return this.countries;
			},
			getContinents: function(success) {
				var _that = this;
				if (this.continents.length) {
					success(this.continents);
				} else {
					return DataService.getAll('continents').then(function(continents) {
						_that.continents = continents;
						success(continents);
					});
				}

			}
		}
	});

})();