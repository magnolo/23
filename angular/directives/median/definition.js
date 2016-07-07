(function() {
	"use strict";

	angular.module('app.directives').directive('median', function($timeout) {
		var defaults = function() {
			return {
				id: 'gradient',
				width: 300,
				height: 40,
				info: true,
				field: 'score',
				handling: true,
				min: 0,
				max: 100,
				margin: {
					left: 20,
					right: 20,
					top: 10,
					bottom: 10
				},
				colors: [{
					position: 0,
					color: 'rgba(102,102,102,1)',
					opacity: 1
				}, {
					position: 53,
					color: 'rgba(128, 243, 198,1)',
					opacity: 1
				}, {
					position: 100,
					color: 'rgba(255,255,255,1)',
					opacity: 0
				}]
			};
		}
		return {
			restrict: 'E',
			scope: {
				data: '=',
				options: '='
			},
			require: 'ngModel',
			link: function($scope, element, $attrs, ngModel) {

				var options = angular.extend(defaults(), $attrs);

				options = angular.extend(options, $scope.options);

				options.unique = new Date().getTime();
				if (options.color) {
					options.colors[1].color = options.color;
				}
				element.css('height', options.height + 'px').css('border-radius', options.height / 2 + 'px');

				if (!$scope.options.max) {
					angular.forEach($scope.data, function(nat, key) {
						options.max = d3.max([options.max, parseInt(nat[options.field])]);
						options.min = d3.min([options.min, parseInt(nat[options.field])]);
					});
				}


				var x = d3.scale.linear()
					.domain([options.min, options.max])
					.range([options.margin.left, options.width - options.margin.left])
					.clamp(true);

				var brush = d3.svg.brush()
					.x(x)
					.extent([0, 0])
					.on("brush", brush)
					.on("brushend", brushed);

				var svg = d3.select(element[0]).append("svg")
					.attr("width", options.width)
					.attr("height", options.height)
					.append("g");
				//.attr("transform", "translate(0," + options.margin.top / 2 + ")");


				var effects = svg.append('svg:defs')
				var gradient = effects.append("svg:linearGradient")
					.attr('id', options.field + options.unique)
					.attr('x1', '0%')
					.attr('y1', '0%')
					.attr('x2', '100%')
					.attr('y2', '0%')
					.attr('spreadMethod', 'pad');

				angular.forEach(options.colors, function(color) {
					gradient.append('svg:stop')
						.attr('offset', color.position + '%')
						.attr('stop-color', color.color)
						.attr('stop-opacity', color.opacity);
				});

				var shadow = effects.append("filter")
					.attr("id", "drop-shadow")
					.attr("height", "150%");
				var shadowIntensity = shadow.append("feGaussianBlur")
					.attr("in", "SourceAlpha")
					.attr("stdDeviation", 1)
					.attr("result", "blur");
				var shadowPos = shadow.append("feOffset")
					.attr("in", "blur")
					.attr("dx", 0)
					.attr("dy", 0)
					.attr("result", "offsetBlur");

				var feMerge = shadow.append("feMerge");
				feMerge.append("feMergeNode")
					.attr("in", "offsetBlur")
				feMerge.append("feMergeNode")
					.attr("in", "SourceGraphic");

				var bckgrnd = svg.append('g');
				var rect = bckgrnd.append('path')
					.attr('d', rounded_rect(0, 0, options.width, options.height, options.height / 2, true, true, true, true))
					.attr('width', options.width)
					.attr('height', options.height)
					.style('fill', 'url(#' + (options.field + options.unique) + ')');
				var legend = svg.append('g').attr('transform', 'translate(' + options.height / 2 + ', ' + options.height / 2 + ')')
					.attr('class', 'startLabel')

				if (options.info === true) {

					legend.append('circle')
						.attr('r', options.height / 2);
					legend.append('text')
						.text(options.min)
						.style('font-size', options.height / 2.5)
						.attr('text-anchor', 'middle')
						.attr('y', '.35em')
						.attr('id', 'lowerValue');
					var legend2 = svg.append('g').attr('transform', 'translate(' + (options.width - (options.height / 2)) + ', ' + options.height / 2 + ')')
						.attr('class', 'endLabel')
					legend2.append('circle')
						.attr('r', options.height / 2)
					legend2.append('text')
						.text(function() {
							//TDODO: CHckick if no comma there
							if (options.max > 1000) {
								var v = (parseInt(options.max) / 1000).toString();
								return v.substr(0, v.indexOf('.')) + "k";
							}
							return options.max
						})
						.style('font-size', options.height / 2.5)
						.attr('text-anchor', 'middle')
						.attr('y', '.35em')
						.attr('id', 'upperValue');
				}
				var slider = svg.append("g")
					.attr("class", "slider");
				if (options.handling == true) {
					slider.call(brush);
				}

				slider.select(".background")
					.attr("height", options.height);

				if (options.info === true) {
					slider.append('line')
						.attr('x1', options.width / 2)
						.attr('y1', 0)
						.attr('x2', options.width / 2)
						.attr('y2', options.height)
						.attr('stroke-dasharray', '3,3')
						.attr('stroke-width', 1)
						.attr('stroke', 'rgba(0,0,0,87)');
				}
				var handleCont = slider.append('g')
					.attr("transform", "translate(0," + options.height / 2 + ")")
					.on('mouseover', function() {
						shadowIntensity.transition().duration(200).attr('stdDeviation', 2);

					})
					.on('mouseout', function() {
						shadowIntensity.transition().duration(200).attr('stdDeviation', 1);

					});
				var handle = handleCont.append("circle")
					.attr("class", "handle")
					.style("filter", "url(#drop-shadow)")
					.attr("r", ((options.height / 2) + options.height / 10));
				if (options.color) {
					handle.style('fill', '#fff' /*options.color*/ );
				}
				var handleLabel = handleCont.append('text')
					.text(0)
					.style('font-size', options.height / 2.5)
					.attr("text-anchor", "middle").attr('y', '0.35em');

				//slider
				//.call(brush.extent([0, 0]))
				//.call(brush.event);
				function rounded_rect(x, y, w, h, r, tl, tr, bl, br) {
					var retval;
					retval = "M" + (x + r) + "," + y;
					retval += "h" + (w - 2 * r);
					if (tr) {
						retval += "a" + r + "," + r + " 0 0 1 " + r + "," + r;
					} else {
						retval += "h" + r;
						retval += "v" + r;
					}
					retval += "v" + (h - 2 * r);
					if (br) {
						retval += "a" + r + "," + r + " 0 0 1 " + -r + "," + r;
					} else {
						retval += "v" + r;
						retval += "h" + -r;
					}
					retval += "h" + (2 * r - w);
					if (bl) {
						retval += "a" + r + "," + r + " 0 0 1 " + -r + "," + -r;
					} else {
						retval += "h" + -r;
						retval += "v" + -r;
					}
					retval += "v" + (2 * r - h);
					if (tl) {
						retval += "a" + r + "," + r + " 0 0 1 " + r + "," + -r;
					} else {
						retval += "v" + -r;
						retval += "h" + r;
					}
					retval += "z";
					return retval;
				}

				function labeling(value) {
					if (parseInt(value) > 1000) {
						var v = (parseInt(value) / 1000).toString();
						return v.substr(0, v.indexOf('.')) + "k";
					} else {
						return parseInt(value);
					}
				}

				function brush() {
					var value = brush.extent()[0];

					if (d3.event.sourceEvent) {
						value = x.invert(d3.mouse(this)[0]);
						brush.extent([value, value]);
					}
					handleLabel.text(labeling(value));
					handleCont.attr("transform", 'translate(' + x(value) + ',' + options.height / 2 + ')');
				}

				function brushed() {
					var count = 0;
					var found = false;
					var final = "";
					var value = brush.extent()[0];
					angular.forEach($scope.data, function(nat, key) {
						console.log(nat);
						if (parseInt(nat[options.field]) == parseInt(value)) {
							final = nat;
							found = true;
						}
					});

					//
					// if(!final){
					// 	do {
					// 		angular.forEach($scope.data, function (nat, key) {
					// 			if (parseInt(nat[options.field]) == parseInt(value)) {
					// 				final = nat;
					// 				found = true;
					// 			}
					// 		});
					// 		count++;
					// 		value = value > (max / 2) ? value - 1 : value + 1;
					// 	} while (!found && count < max);
					// }


					if (final) {
						ngModel.$setViewValue(final);
						ngModel.$render();
					}

				}


				$scope.$watch('options', function(n, o) {
					if (n === o) {
						return;
					}
					options.colors[1].color = n.color;
					gradient = svg.append('svg:defs')
						.append("svg:linearGradient")
						.attr('id', options.field + "_" + n.color)
						.attr('x1', '0%')
						.attr('y1', '0%')
						.attr('x2', '100%')
						.attr('y2', '0%')
						.attr('spreadMethod', 'pad')
					angular.forEach(options.colors, function(color) {
						gradient.append('svg:stop')
							.attr('offset', color.position + '%')
							.attr('stop-color', color.color)
							.attr('stop-opacity', color.opacity);
					});
					rect.style('fill', 'url(#' + options.field + '_' + n.color + ')');
					handle.style('fill', n.color);
					if (ngModel.$modelValue) {
						handleLabel.text(labeling(ngModel.$modelValue[0][n.field]));
						handleCont.transition().duration(500).ease('quad').attr("transform", 'translate(' + x(ngModel.$modelValue.data[0][n.field]) + ',' + options.height / 2 + ')');
					} else {
						handleLabel.text(0);
					}
				}, true);
				$scope.$watch(
					function() {
						return ngModel.$modelValue;
					},
					function(newValue, oldValue) {

						if (!newValue) {
							handleLabel.text(parseInt(0));
							handleCont.attr("transform", 'translate(' + x(0) + ',' + options.height / 2 + ')');
							return;
						}

						handleLabel.text(labeling(newValue[options.field]));
						if (newValue == oldValue) {
							handleCont.attr("transform", 'translate(' + x(newValue[options.field]) + ',' + options.height / 2 + ')');
						} else {
							handleCont.transition().duration(500).ease('quad').attr("transform", 'translate(' + x(newValue[options.field]) + ',' + options.height / 2 + ')');

						}


					});
				$scope.$watch('data', function(n, o) {
					if (n === o) return false;

					options.min = 0;
					options.max = 0;
					angular.forEach($scope.data, function(nat, key) {
						if (!$scope.options.max) {
							options.max = d3.max([options.max, parseInt(nat[options.field])]);
							options.min = d3.min([options.min, parseInt(nat[options.field])]);
						}
						if (nat.iso == ngModel.$modelValue.iso) {
							handleLabel.text(labeling(nat.data[0][options.field]));
							handleCont.transition().duration(500).ease('quad').attr("transform", 'translate(' + x(nat.data[0][options.field]) + ',' + options.height / 2 + ')');

						}
					});

					x = d3.scale.linear()
						.domain([options.min, options.max])
						.range([options.margin.left, options.width - options.margin.left])
						.clamp(true);
					brush.x(x)
						.extent([0, 0])
						.on("brush", brush)
						.on("brushend", brushed);
					legend.select('#lowerValue').text(min);
					legend2.select('#upperValue').text(function() {
						//TDODO: CHckick if no comma there
						if (options.max > 1000) {
							var v = (parseInt(options.max) / 1000).toString();
							return v.substr(0, v.indexOf('.')) + "k";
						}
						return options.max
					});
					angular.forEach($scope.data, function(nat, key) {
						if (nat.iso == ngModel.$modelValue.iso) {
							handleLabel.text(labeling(nat.data[0][options.field]));
							handleCont.transition().duration(500).ease('quad').attr("transform", 'translate(' + x(nat.data[0][options.field]) + ',' + options.height / 2 + ')');
						}
					});

				});
			}
		};

	});

})();
