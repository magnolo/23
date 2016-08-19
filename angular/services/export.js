/**
 * @ngdoc service
 * @name app.ExportService
 * @requires app.DataService
 * @requires toastr
 *
 * @description
 * Provides services used to export custom maps with chapters
 *
 */

(function() {
	"use strict";

	angular.module('app.services').service('ExportService', function(DataService, toastr) {
		var vm = this;
		vm._promise, vm._promiseOne;
		vm._callbacks = new Array();
		vm._callbacksOne = new Array();
		vm.exports;
		vm.chapter;
		vm.indicator;
		vm.exporter = {};

		vm.getExports = function(success, error, force) {
			if (angular.isDefined(vm.exports) && !force) {
				if (typeof success === 'function')
					success(vm.exports);
			} else if (angular.isDefined(vm._promise) && !force) {
				if (typeof success === 'function')
					vm._callbacks.push(success);
			} else {
				vm._callbacks.push(success);
				vm._promise = DataService.getAll('exports').then(function(response) {
					vm.exports = response;
					angular.forEach(vm._callbacks, function(callback) {
						if (typeof callback != "undefined")
							callback(vm.exports);
					});
					vm._promise = null;
				}, error);
			}
		}

		vm.getExport = function(id, success, error, force) {
			if (angular.isDefined(vm.exporter) && vm.exporter.id == id && !force) {
				if (typeof success === 'function')
					success(vm.exporter);
			} else {
				vm._callbacksOne.push(success);
				vm._promiseOne = DataService.getOne('exports', id).then(function(response) {
					vm.exporter = response;
					if (!vm.exporter.items) {
						vm.exporter.items = new Array();
					}
					angular.forEach(vm._callbacksOne, function(callback) {
						if (typeof callback != "undefined")
							callback(vm.exporter);
					});
					vm._promiseOne = null;
				}, error);
			}

		}
		vm.setExport = function(data) {
			return vm.exporter = data;
		}
		vm.getChapter = function(id, chapter, success, ignoreFirst) {
			if (angular.isDefined(vm.exporter) && vm.exporter.id == id) {
				vm.chapter = vm.exporter.items[chapter - 1];

				if (!ignoreFirst) {
					if (vm.chapter.type == "indicator") {
						vm.indicator = vm.chapter;
					} else {
						vm.indicator = vm.getFirstIndicator(vm.chapter.children);
					}
				}

				if (typeof success === 'function')
					success(vm.chapter, vm.indicator);
			} else {
				vm.getExport(id, function(data) {
					vm.chapter = vm.exporter.items[chapter - 1];
					if (!ignoreFirst)
						vm.indicator = vm.getFirstIndicator(vm.chapter.children);
					if (typeof success === 'function')
						success(vm.chapter, vm.indicator);
				});
			}
		}
		vm.getIndicator = function(id, chapter, indicator, success) {
			var fetch = typeof indicator == 'undefined' ? true : false;

			vm.getExport(id, function(exporter) {
				vm.getChapter(id, chapter, function(ch, ind) {
					if (!fetch) vm.indicator = vm.findIndicator(indicator);
					success(vm.indicator, vm.chapter, vm.exporter);
				}, !fetch)
			});
			// vm.getChapter(id, chapter, function(c, i) {
			// 	angular.forEach(c.children, function(indi) {
			// 		if (indi.indicator_id == indicator) {
			// 			vm.indicator = indi;
			// 		}
			// 	})
			// 	success(vm.chapter, vm.indicator);
			// }, true);
		}
		vm.getFirstIndicator = function(list) {
			var found = null;
			angular.forEach(list, function(item) {
				if (item.type == 'indicator' && !found) {
					found = item;
				} else {
					if (!found) {
						found = vm.getFirstIndicator(item.children);
					}
				}
			});
			return found;
		}
		vm.findIndicator = function(indicator_id) {
			var item = null;
			angular.forEach(vm.exporter.items, function(chapter, key) {
				if (typeof chapter.indicator_id != "undefined") {
					if (chapter.indicator_id == indicator_id) {
						item = chapter;
					}
				}
				angular.forEach(chapter.children, function(indicator) {
					if (indicator.indicator_id == indicator_id) {
						item = indicator;
					}
				})
			});
			return item;
		}
		vm.save = function(success, error) {
			if (vm.exporter.id == 0 || !vm.exporter.id) {
				DataService.post('exports', vm.exporter).then(function(response) {
					vm.exporter = response;
					vm.exports.push(vm.exporter);
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
					vm.getExports(function() {}, function() {}, true);
				}, function(response) {
					toastr.error('Something went wrong!');
					if (typeof error === 'function')
						error(response);
				});
			}
		}
		vm.removeItem = function(id, success, error) {
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
