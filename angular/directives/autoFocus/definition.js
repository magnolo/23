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
