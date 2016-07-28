/**
 * @ngdoc service
 * @name app.ToastService
 * @requires $mdToast
 *
 * @description
 * Build toast notifications for application
 */

(function(){
	"use strict";

	angular.module("app.services").factory('ToastService', function($mdToast){

		var delay = 6000,
			position = 'top right',
			action = 'OK';

		return {
			/**
			 * @ngdoc method
			 * @name app.ToastService#show
			 * @methodOf app.ToastService
			 *
			 * @description
			 * Shows a toast with given content
			 *
			 * @param {string} content content of toast
             */
			show: function(content){
				if (!content){
					return false;
				}

				return $mdToast.show(
					$mdToast.simple()
						.content(content)
						.position(position)
						.action(action)
						.hideDelay(delay)
				);
			},
			/**
			 * @ngdoc method
			 * @name app.ToastService#error
			 * @methodOf app.ToastService
			 *
			 * @description
			 * Shows error toast
			 *
			 * @param {string} content content of toast
             */
			error: function(content){
				if (!content){
					return false;
				}

				return $mdToast.show(
					$mdToast.simple()
						.content(content)
						.position(position)
						.theme('warn')
						.action(action)
						.hideDelay(delay)
				);
			}
		};
	});
})();