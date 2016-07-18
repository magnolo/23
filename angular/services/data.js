/**
 * @ngdoc service
 * @name app.DataService
 * @requires Restangular
 * @requires toastr
 *
 * @description
 * Provides CRUD services for API
 *
 */

(function() {
	"use strict";

	angular.module('app.services').factory('DataService', DataService);
	DataService.$inject = ['Restangular', 'toastr'];

	function DataService(Restangular, toastr) {
		return {
			getAll: getAll,
			getOne: getOne,
			post: post,
			put: put,
			update: update,
			remove: remove
		};

        /**
         * @ngdoc method
         * @name app.DataService#getAll
         * @methodOf app.DataService
         *
         * @description
         * Gets all objects on given route filtered by filter
         *
         * @param {string} route address from which data will be pulled from
         * @param {object} filter filter by which the pulled data will be filtered
         * @returns {object} data json object with pulled data
         */
        function getAll(route, filter) {
			var data = Restangular.all(route).getList(filter);
			data.then(function() {}, function(data) {
				toastr.error(data.statusText, 'Connection Error');
			});
			return data;
		}
        /**
         * @ngdoc method
         * @name app.DataService#getOne
         * @methodOf app.DataService
         *
         * @description
         * Get on object on given route specified by given id
         *
         * @param {string} route address from which data will be pulled from
         * @param {string} id datum id
         * @returns {object} data json with pulled data
         */
		function getOne(route, id, query) {
			return Restangular.one(route, id).get(query);
		}
        /**
         * @ngdoc method
         * @name app.DataService#post
         * @methodOf app.DataService
         *
         * @description
         * Create multiple new data entries
         *
         * @param {string} route route where to post to
         * @param {object} data object to be created
         * @returns {object} saved data
         */
		function post(route, data) {
			var data = Restangular.all(route).post(data);
			data.then(function() {}, function(data) {
				toastr.error(data.data.error, 'Saving failed');
			});
			return data;
		}
        /**
         * @ngdoc method
         * @name app.DataService#put
         * @methodOf app.DataService
         *
         * @description
         * Update or create multiple data entries
         *
         * @param {string} route route where to put at
         * @param {object} data data object to be created or updated data object
         */
		function put(route, data) {
			return Restangular.all(route).put(data);
		}
        /**
         * @ngdoc method
         * @name app.DataService#update
         * @methodOf app.DataService
         *
         * @description
         * Update a single data entry
         *
         * @param {string} route route to where to update at
         * @param {string} id datum id
         * @param {object} data updated datum
         *
         */
		function update(route, id, data) {
			return Restangular.one(route, id).put(data);
		}
        /**
         * @ngdoc method
         * @name app.DataService#remove
         * @methodOf app.DataService
         *
         * @description
         * Remove a single data entry
         *
         * @param {string} route where to delete at
         * @param {string} id datum id
         */
		function remove(route, id) {
			return Restangular.one(route, id).remove();
		}
	}

})();
