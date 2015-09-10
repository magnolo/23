(function () {
	"use strict";

	angular.module('app.config').config(function (ChartJsProvider) {
		//
		ChartJsProvider.setOptions({
			colours: ['#FF5252', '#FF8A80'],
			responsive: true
		});
		// Configure all line charts
		ChartJsProvider.setOptions('Line', {
			datasetFill: false
		});
	});

})();
