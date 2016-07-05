(function() {
	"use strict";

	angular.module('app.config').config(function(hljsServiceProvider) {
		//
		hljsServiceProvider.setOptions({
			// replace tab with 4 spaces
			tabReplace: '    '
		});
	});

})();