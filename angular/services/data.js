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

		function getAll(route, filter) {
			var data = Restangular.all(route).getList(filter);
			data.then(function() {}, function(data) {
				toastr.error(data.statusText, 'Connection Error');
			});
			return data;
		}

		function getOne(route, id, query) {
			return Restangular.one(route, id).get(query);
		}

		function post(route, data) {
			var data = Restangular.all(route).post(data);
			data.then(function() {}, function(data) {
				toastr.error(data.data.error, 'Saving failed');
			});
			return data;
		}

		function put(route, data) {
			return Restangular.all(route).put(data);
		}

		function update(route, id, data) {
			return Restangular.one(route, id).put(data);
		}

		function remove(route, id) {
			return Restangular.one(route, id).remove();
		}
	}

})();
