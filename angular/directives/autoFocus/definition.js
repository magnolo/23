/**
 * @ngdoc directive
 * @name app.directive:autoFocus
 * @restrict 'AC'
 *
 * @description Provides an attribute or class to focus an element in the DOM automatically
 */

(function(){
	"use strict";

	angular.module('app.directives').directive( 'autoFocus', function($timeout) {
		return {
        restrict: 'AC',
        link: function(_scope, _element) {
            $timeout(function(){
                _element[0].focus();
            }, 0);
        }
    };

	});

})();
