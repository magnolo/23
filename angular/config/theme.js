(function(){
	"use strict";

	angular.module('app.config').config(function($mdThemingProvider) {
		/* For more info, visit https://material.angularjs.org/#/Theming/01_introduction */
	var neonTealMap = $mdThemingProvider.extendPalette('teal', {
    '500': '00ccaa',
		//'A200': '00ccaa'
  });
	var whiteTealMap = $mdThemingProvider.extendPalette('teal', {
    '500': 'fff',
		'A200': '00ccaa'
  });
	$mdThemingProvider.definePalette('neonTeal', neonTealMap);
	$mdThemingProvider.definePalette('whiteTeal', whiteTealMap);
		$mdThemingProvider.theme('default')
		.primaryPalette('neonTeal')
		.accentPalette('whiteTeal')
		.warnPalette('red');
	});

})();
