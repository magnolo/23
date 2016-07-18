(function() {
	"use strict";

	var app = angular.module('app', [
		'app.controllers',
		'app.filters',
		'app.services',
		'app.directives',
		'app.routes',
		'app.config'
	]);


	angular.module('app.routes', ['ui.router', 'ui.router.state.events', 'ngStorage', 'satellizer']);
	angular.module('app.controllers', ['hljs', 'flow', 'FBAngular', 'dndLists', 'angular.filter', 'angularMoment', 'ngScrollbar', 'mdColorPicker', 'ngAnimate', 'ui.tree', 'toastr', 'ui.router', 'md.data.table', 'ngMaterial', 'ngStorage', 'restangular', 'ngMdIcons', 'angular-loading-bar', 'ngMessages', 'ngSanitize', "leaflet-directive", 'nvd3']);
	angular.module('app.filters', []);
	angular.module('app.services', ['angular-cache', 'ui.router', 'ngStorage', 'restangular', 'toastr']);
	angular.module('app.directives', ['ngMaterial', 'ngPapaParse']);
	angular.module('app.config', []);

})();
