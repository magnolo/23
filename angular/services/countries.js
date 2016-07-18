/**
 * @ngdoc service
 * @name app.CountriesService
 * @requires app.DataService
 *
 * @description
 * Fetches country and continent objects from db
 */

(function() {
	"use strict";

	angular.module('app.services').factory('CountriesService', function(DataService) {
		//
		return {
			countries: [],
			continents: [],
			indicator: null,

			/**
			 * @ngdoc method
			 * @name app.CountriesService#fetchData
			 * @methodOf app.CountriesService
			 *
			 * @description
			 * fechtes countries and saves it in CountriesService singleton as countries array
			 *
			 * @returns {Array} countries array of service instance
             */
			fetchData: function() {
				return this.countries = DataService.getOne('countries/isos').$object;
			},

			/**
			 * @ngdoc method
			 * @name app.CountriesService#getData
			 * @methodOf app.CountriesService
			 *
			 * @description
			 * gets countries saved in CountriesService instance, fetches it if no countries array is saved in instance
			 *
			 * @returns {Array} countries array of service instance
             */
			getData: function() {
				if (!this.countries.length) {
					this.fetchData();
				}
				return this.countries;
			},

			/**
			 * @ngdoc method
			 * @name app.CountriesService#getContinents
			 * @methodOf app.CountriesService
			 *
			 * @description
			 * uses success callback function on continents or fetches them
			 *
			 * @param {function} success callback function if fetch of continents from db was successful
             */
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
