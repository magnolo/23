/**
 * @ngdoc service
 * @name app.DialogService
 * @requires $mdDialog
 *
 * @description
 * Uses $mdDialog to envoke UI elements for user interaction
 *
 */

(function(){
	"use strict";

	angular.module("app.services").factory('DialogService', function($mdDialog){

		return {
			/**
			 * @ngdoc method
			 * @name app.DialogService#fromTemplate
			 * @methodOf app.DialogService
			 *
			 * @description
			 * Fetches template for dialog
			 *
			 * @param {string} template name
			 * @param {object} $scope scope object
             * @returns {function} promise
             */
			fromTemplate: function(template, $scope){

				var options = {
					templateUrl: './views/dialogs/' + template + '/' + template + '.html'
				};

				if ($scope){
					options.scope = $scope.$new();
				}

				return $mdDialog.show(options);
			},

			/**
			 * @ngdoc method
			 * @name app.DialogService#hide
			 * @methodOf app.DialogService
			 *
			 * @description
			 * Hides dialog element
			 *
			 * @returns {function} promise
             */
			hide: function(){
				return $mdDialog.hide();
			},

			/**
			 * @ngdoc method
			 * @name app.DialogService#alert
			 * @methodOf app.DialogService
			 *
			 * @description
			 * Shows dialog as an alert
			 *
			 * @param {string} title alert title
             * @param {string} content alert content
             */
			alert: function(title, content){
				$mdDialog.show(
					$mdDialog.alert()
						.title(title)
						.content(content)
						.ok('Ok')
				);
			},

			/**
			 * @ngdoc method
			 * @name app.DialogService#confirm
			 * @methodOf app.DialogService
			 *
			 * @description
			 * Shows confirmation dialog
			 *
			 * @param {string} title confirmation title
			 * @param {string} content confirmation content
             * @returns {function} promise
             */
			confirm: function(title, content) {
				return $mdDialog.show(
					$mdDialog.confirm()
						.title(title)
						.content(content)
						.ok('Ok')
						.cancel('Cancel')
				);
			}
		};
	});
})();