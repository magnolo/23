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
					console.log(options);
					angular.extend(options, scope.vm.options)

				});
			}
		};

	});

})();