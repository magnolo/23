(function(){
	"use strict";

	angular.module('app.directives').directive( 'imageUploader', function() {

		return {
			restrict: 'EA',
			templateUrl: 'views/directives/imageUploader/imageUploader.html',
			controller: 'ImageUploaderCtrl',
			controllerAs: 'vm',
			scope:{
				item: '=ngModel',
      	label: '@'
			},
			bindToController: true,
			//replace:true,
			link: function( scope, element, attrs ){
				//
			}
		};

	});

})();
