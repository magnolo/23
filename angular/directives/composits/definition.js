(function(){
	"use strict";

	angular.module('app.directives').directive( 'composits', function() {

		return {
			restrict: 'EA',
			templateUrl: 'views/directives/composits/composits.html',
			controller: 'CompositsCtrl',
			bindToController: {
				item: '=',
				composits: '=',
				options:'=',
				save: '&'
			},
			link: function( scope, element, attrs ){
				//
			}
		};

	});

})();
