(function() {
	"use strict";

	angular.module('app.directives').directive('colorGradient', function() {

		return {
			restrict: 'EA',
			templateUrl: 'views/directives/color-gradient/color-gradient.html',
			controller: 'ColorGradientCtrl',
			controllerAs: 'vm',
			scope: {},
			bindToController: {
				gradient: '='
			},
			link: function(scope, element, attrs) {
				//

				var width = element.parent()[0].clientWidth;
				var height = 20;
				var svg = d3.select(element[0]).append('svg');
				svg.attr("width", width)
					.attr("height", height);
				var def = svg.append("defs");
				var gradCol = def.append("linearGradient")
					.attr("id", "gradient")
					.attr("x1", "0%")
					.attr("y1", "0%")
					.attr("x2", "100%")
					.attr("y2", "0%");

				var rect = svg.append("rect")
					.attr("width", width)
					.attr("height", height)
					.style("fill", "url(#gradient)")
					.on("mouseover", function(d) {
	          console.log(d);
	        })

				function drawGradient() {

					var gradient = gradCol.selectAll('stop')
						.data(scope.vm.gradient, function(d){
							return "id_" + d.pos
						});

					gradient
						.enter()
						.append("stop")
						.attr("offset", function(d) {
							return d.pos + "%";
						})
						.style("stop-color", function(d) {
							return d.color
						})
						.style("stop-opacity", function(d) {
							d.alpha
						});

					gradient.exit().remove();
				}

				scope.$watch('vm.gradient', function(n, o) {
					console.log(n);
					if (n === 0) return false;
					drawGradient();
				}, true);

				drawGradient();
			}
		};

	});

})();
