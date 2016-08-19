/**
 * @ngdoc directive
 * @name app.directive:treeview
 * @scope
 * restrict E
 *
 * @description
 * UI element showing data structure. Crawls recursively the passed data object
 *
 * @param {object[]} items object array containing data structure
 * @param {object} item current item
 * @param {object} selection selected item
 * @param {object} options options object
 * @param {boolean} active if item is active
 *
 */

(function() {
	"use strict";

	angular.module('app.directives').directive('treeview', function(RecursionHelper) {
		var options = {
			editWeight: false,
			drag: false,
			edit: false,
			children: 'children'
		};
		return {
			restrict: 'E',
			templateUrl: 'views/directives/treeview/treeview.html',
			controller: 'TreeviewCtrl',
			controllerAs: 'vm',
			scope: {},
			bindToController: {
				items: '=',
				item: '=?',
				selection: '=?',
				options: '=?',
				active: '=?',
				click: '&'
			},
			replace: true,
			compile: function(element) {
				return RecursionHelper.compile(element, function(scope, iElement, iAttrs, controller, transcludeFn) {
	
					angular.extend(options, scope.vm.options)

				});
			}
		};

	});

})();
