/**
 * @ngdoc service
 * @name app.IndizesService
 * @requires app.DataService
 *
 * @description
 * Service for indizies/composite measures
 *
 */
(function () {
	"use strict";

	angular.module('app.services').factory('IndizesService', function(DataService) {
		//
		return {
			index: {
				data: {
					data: null,
					structure: null
				},
				promises: {
					data: null,
					structur: null
				}
			},
			/**
			 * @ngdoc method
			 * @name app.IndizesService#fetchData
			 * @methodOf app.IndizesService
			 *
			 * @param {string} index id of index
			 * @returns {object} IndizesService.index|{data, promises}
             */
			fetchData: function(index) {
				this.index.promises.data = DataService.getAll('index/' + index + '/year/latest');
				this.index.promises.structure = DataService.getOne('index/' + index + '/structure');
				this.index.data.data = this.index.promises.data.$object;
				this.index.data.structure = this.index.promises.structure.$object;
				return this.index;
			},

			/**
			 * @ngdoc method
			 * @name app.IndizesService#getData
			 * @methodOf app.IndizesService
			 *
			 * @description
			 * Get data object from fetched index, currently saved in service instance
			 *
			 * @returns {object} data data from index
             */
			getData: function () {
				return this.index.data.data;
			},

			/**
			 * @ngdoc method
			 * @name app.IndizesService#getStructure
			 * @methodOf app.IndizesService
			 *
			 * @description
			 * Get structure object from fetched index, currently saved in service instance
			 *
			 * @returns {object} structure structure data from index
             */
			getStructure: function () {
				return this.index.data.structure;
			},

			/**
			 * @ngdoc method
			 * @name app.IndizesService#getDataPromise
			 * @methodOf app.IndizesService
			 *
			 * @description
			 * Get data promise object from fetched index, currently saved in service instance
			 *
			 * @returns {object} structure structure data from index
			 */
			getDataPromise: function () {
				return this.index.promises.data;
			},

			/**
			 * @ngdoc method
			 * @name app.IndizesService#getStructure
			 * @methodOf app.IndizesService
			 *
			 * @description
			 * Get structure promise object from fetched index, currently saved in service instance
			 *
			 * @returns {object} structure structure data from index
			 */
			getStructurePromise: function () {
				return this.index.promises.structure;
			},

			/**
			 * @ngdoc method
			 * @name app.IndizesService#fetchNationData
			 * @methodOf app.IndizesService
			 *
			 * @description
			 * Fetches data of a specific nation by its iso code and index id and uses success callback on it
			 *
			 * @param {string} index id of index
			 * @param {string} iso iso code of country
			 * @param {function} success callback function that will be called on successfully fetched data
			 *
			 * @returns {object} structure structure data from index
			 */
			fetchNationData:function(index, iso, success){
				DataService.getOne('index/' + index, iso).then(function(data) {
					success(data);

				});
			}
		}
	});

})();
