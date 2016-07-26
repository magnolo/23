/**
 * @ngdoc directive
 * @name app.directive:imageUploader
 * @scope
 * @restrict EA
 * @description
 * Image Upload
 * 
 * @param {object} item object containing the image
 * @param {string} label label for the uploaded image
 *
 */

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
