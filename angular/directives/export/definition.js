(function(){
	"use strict";

	angular.module('app.directives').directive( 'export', function() {

		return {
			restrict: 'EA',
			templateUrl: 'views/directives/export/export.html',
			controller: 'ExportDirectiveCtrl',
			controllerAs: 'vm',
			scope:{
				item: '=',
				options: '=',
				selected: '='
			},
			bindToController: true,
			replace:true,
			link: function( scope, element, attrs ){
				//
			}
		};

	});

})();
