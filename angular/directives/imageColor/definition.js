(function() {
	"use strict";

	angular.module('app.directives').directive('imageColor', function($timeout) {

		return {
			restrict: 'EA',
			templateUrl: 'views/directives/imageColor/imageColor.html',
			controller: 'ImageColorCtrl',
			scope:{
				color:'='
			},
			link: function(scope, element, attrs) {
				//
				var image = element[0];
				image.onload = function(){
					scope.color = tinycolor(getAverageRGB(image)).isDark();
				};

				function getAverageRGB(imgEl) {

					var blockSize = 5, // only visit every 5 pixels
						defaultRGB = {
							r: 0,
							g: 0,
							b: 0
						}, // for non-supporting envs
						canvas = document.createElement('canvas'),
						context = canvas.getContext && canvas.getContext('2d'),
						data, width, height,
						i = -4,
						length,
						rgb = {
							r: 0,
							g: 0,
							b: 0
						},
						count = 0;

					if (!context) {
						return defaultRGB;
					}

					height = canvas.height = imgEl.naturalHeight || imgEl.offsetHeight || imgEl.height;
					width = canvas.width = imgEl.naturalWidth || imgEl.offsetWidth || imgEl.width;

					context.drawImage(imgEl, 0, 0);

					try {
						data = context.getImageData(0, 0, width, height);
					} catch (e) {
						/* security error, img on diff domain */
						alert('x');
						return defaultRGB;
					}

					length = data.data.length;

					while ((i += blockSize * 4) < length) {
						++count;
						rgb.r += data.data[i];
						rgb.g += data.data[i + 1];
						rgb.b += data.data[i + 2];
					}

					// ~~ used to floor values
					rgb.r = ~~(rgb.r / count);
					rgb.g = ~~(rgb.g / count);
					rgb.b = ~~(rgb.b / count);

					return rgb;

				}
				function rgb2hsv () {
    var rr, gg, bb,
        r = arguments[0] / 255,
        g = arguments[1] / 255,
        b = arguments[2] / 255,
        h, s,
        v = Math.max(r, g, b),
        diff = v - Math.min(r, g, b),
        diffc = function(c){
            return (v - c) / 6 / diff + 1 / 2;
        };

    if (diff == 0) {
        h = s = 0;
    } else {
        s = diff / v;
        rr = diffc(r);
        gg = diffc(g);
        bb = diffc(b);

        if (r === v) {
            h = bb - gg;
        }else if (g === v) {
            h = (1 / 3) + rr - bb;
        }else if (b === v) {
            h = (2 / 3) + gg - rr;
        }
        if (h < 0) {
            h += 1;
        }else if (h > 1) {
            h -= 1;
        }
    }
    return {
        h: Math.round(h * 360),
        	s: Math.round(s * 100),
        	v: Math.round(v * 100)
        };
        }
			}
		};

	});

})();
