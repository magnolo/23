(function() {
	"use strict";

	angular.module('app.services').service('ExportService', function(DataService, toastr) {
		var vm = this;
		this._promise, this._promiseOne;
		this._callbacks = new Array();
		this._callbacksOne = new Array();
		this.exports;
			this.exporter = {};

		this.getExports = function(success, error, force) {
				if (angular.isDefined(vm.exports) && !force) {
						success(this.exports);
				} else if (angular.isDefined(vm._promise)) {
						vm._callbacks.push(success);
				} else {
          vm._callbacks.push(success);
					vm._promise = DataService.getAll('exports').then(function(response) {
						vm.exports = response;
            console.log(vm._callbacks);
						angular.forEach(vm._callbacks, function(callback) {
							callback(vm.exports);
						});
						vm._promise = null;
					}, error);
				}
			},

			this.getExport = function(id, success, error, force) {
				if (angular.isDefined(vm.exporter) && vm.exporter.id == id && !force) {
					success(vm.exporter);
				} else if (angular.isDefined(vm._promiseOne)) {
					if (typeof success === 'function')
						vm._callbacksOne.push(success);
				} else {
          	vm._callbacksOne.push(success);
					this._promiseOne = DataService.getOne('exports', id).then(function(response) {
						vm.exporter = response;
						angular.forEach(vm._callbacksOne,  function(callback) {
							callback(vm.exporter);
						});
						vm._promiseOne = null;
					}, error);
				}

			},
			this.setExport = function(data) {
				return vm.exporter = data;
			},
			this.save = function(success, error) {
				if (vm.exporter.id == 0 || !vm.exporter.id) {
					DataService.post('exports', vm.exporter).then(function(response) {
						toastr.success('Successfully created');
						if (typeof success === 'function')
							success(response);
					}, function(response) {
						toastr.error('Something went wrong!');
						if (typeof error === 'function')
							error(response);
					});
				} else {

					vm.exporter.save().then(function(response) {
						if (typeof success === 'function')
							toastr.success('Save successfully');
						success(response);
					}, function(response) {
						toastr.error('Something went wrong!');
						if (typeof error === 'function')
							error(response);
					});
				}
			},
			this.removeItem = function(id, success, error) {
				DataService.remove('exports', id).then(function(response) {
					if (typeof success === 'function')
						toastr.success('Successfully deleted');
					success(response);
				}, function(response) {
					if (typeof error === 'function')
						error(response);
				})
			}

	});

})();
