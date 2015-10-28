(function(){
	"use strict";

	angular.module('app.directives').directive( 'external', function() {

		return {
			restrict: 'EA',
			templateUrl: 'views/directives/external/external.html',
			controller: 'ExternalCtrl',
			scope:{
				url: '='
			},
			link: function( $scope, element, $attrs ){
				//

			}
		};

	});

})();
