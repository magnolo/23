(function() {
		"use strict";

		angular.module('app.services').factory('ColorHandleService', function() {
				//
				var ColorHandle;
				return ColorHandle = (function() {
					/*
					      @param {String} color Color string in CSS rgba(0-255, 0-255, 0-255, 0-1) format.
					      @param {Number} stop  Value 0-1, the gradient color stop. 0 means the color appears at 0%, 0.5 means 50%, etc.
					*/

					function ColorHandle(color, stop) {
						this.color = color;
						this.stop = stop;
					}

					return ColorHandle;

				})();
		});

})();
