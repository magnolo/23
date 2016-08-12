(function() {
	"use strict";

	angular.module('app.directives').directive('median', function($timeout, $window) {
		var defaults = function() {
			return {
				id: 'gradient',
				width: 340,
				height: 40,
				info: true,
				field: 'score',
				handling: true,
				showValue: true,
				min: 0,
				max: 100,
				margin: {
					left: 0,
					right: 0,
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
				options.width = element.parent()[0].clientWidth - options.margin.left - options.margin.right;
				options.unique = new Date().getTime();
				element.css('height', options.height + 'px').css('border-radius', options.height / 2 + 'px');

				if (options.color) {
					options.colors[1].color = options.color;
				}
				if (!$scope.options.max) {
					angular.forEach($scope.data, function(nat, key) {
						options.max = d3.max([options.max, parseInt(nat[options.field])]);
						options.min = d3.min([options.min, parseInt(nat[options.field])]);
					});
				}

				var container = d3.select(element[0]).append("svg");
				var svg = container.append("g");
				var effects = svg.append('svg:defs')
				var gradient = effects.append("svg:linearGradient")
					.attr('id', options.field + options.unique)
					.attr('x1', '0%')
					.attr('y1', '0%')
					.attr('x2', '100%')
					.attr('y2', '0%')
					.attr('spreadMethod', 'pad');
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

				var bckgrnd = svg.append('g').attr('transform', "translate(0, " + (options.height / 4) + ")");
				var rect = bckgrnd.append('path');
				var legend = svg.append('g');
				var legend2 = svg.append('g');
				var slider = svg.append("g")
					.attr("class", "slider");
				// if (options.handling == true) {
				// 	slider.call(brush);
				// }

				slider.select(".background")
					.attr("height", options.height);

				var x = d3.scale.linear()
				x.domain([options.min, options.max])
					.range([options.margin.left, options.width - options.margin.left])
					.clamp(true);

				if(options.gradient){
					if (typeof options.gradient == "string") {
						options.gradient = JSON.parse(options.gradient);
					}
					angular.forEach(options.gradient, function(color) {
						gradient.append('svg:stop')
							.attr('offset', (color.stop * 100) + '%')
							.attr('stop-color', color.color)
							//.attr('stop-opacity', color.opacity);
					});
				}
				else{
					angular.forEach(options.colors, function(color) {
						gradient.append('svg:stop')
							.attr('offset', color.position + '%')
							.attr('stop-color', color.color)
							.attr('stop-opacity', color.opacity);
					});
				}



				if (options.info === true) {
					legend.append('circle')
						.attr('r', options.height / 2);
					var legendText = legend.append('text')
						.text(options.min)
						.style('font-size', options.height / 2.5)
						.attr('text-anchor', 'middle')
						.attr('y', '.35em')
						.attr('id', 'lowerValue');

					legend2.attr('transform', 'translate(' + (options.width - (options.height / 2)) + ', ' + options.height / 2 + ')')
						.attr('class', 'endLabel')
					legend2.append('circle')
						.attr('r', options.height / 2)
					var legend2Text = legend2.append('text')
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


				if (options.info === true) {
					var line = slider.append('line')
						.attr('x1', options.width / 2)
						.attr('y1', 0)
						.attr('x2', options.width / 2)
						.attr('y2', options.height)
						.attr('stroke-dasharray', '3,3')
						.attr('stroke-width', 1)
						.attr('stroke', 'rgba(0,0,0,87)');
				}
				var handleCont = slider.append('g');
				var handle = handleCont.append("circle")
					.attr("class", "handle")
					.style("filter", "url(#drop-shadow)");
				if (options.showValue) {
					var handleLabel = handleCont.append('text')
						.text(0)
				}


				function draw() {
					x.range([options.margin.left, options.width - options.margin.right])
						.clamp(true);


					// var brush = d3.svg.brush()
					// 	.x(x)
					// 	.extent([0, 0])
					// 	.on("brush", brush)
					// 	.on("brushend", brushed);

					container
						.attr("width", options.width)
						.attr("height", options.height)
						.style('margin-left', options.margin.left)


					//.attr("transform", "translate(0," + options.margin.top / 2 + ")");



					rect
						.attr('d', rounded_rect(0, 0, options.width, options.height / 2, options.height / 4, true, true, true, true))
						.attr('y', options.height / 2)
						.attr('width', options.width)
						.attr('height', options.height / 2)
						.style('fill', 'url(#' + (options.field + options.unique) + ')');
					legend.attr('transform', 'translate(' + options.height / 2 + ', ' + options.height / 2 + ')')
						.attr('class', 'startLabel')

					if (options.info === true) {
						legend.attr('r', options.height / 2);
						legendText.text(options.min)
							.style('font-size', options.height / 2.5)
							.attr('text-anchor', 'middle')
							.attr('y', '.35em')
							.attr('id', 'lowerValue');
						legend2.attr('transform', 'translate(' + (options.width - (options.height / 2)) + ', ' + options.height / 2 + ')')
							.attr('class', 'endLabel')
						legend2.append('circle')
							.attr('r', options.height / 2)

						legend2Text.text(function() {
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

						line.attr('x1', options.width / 2)
							.attr('y1', 0)
							.attr('x2', options.width / 2)
							.attr('y2', options.height)
							.attr('stroke-dasharray', '3,3')
							.attr('stroke-width', 1)
							.attr('stroke', 'rgba(0,0,0,87)');
					}

					handleCont
					//.attr("transform", "translate(0," + options.height / 2 + ")")
						.on('mouseover', function() {
							shadowIntensity.transition().duration(200).attr('stdDeviation', 2);

						})
						.on('mouseout', function() {
							shadowIntensity.transition().duration(200).attr('stdDeviation', 1);

						});

					handle
						.attr("r", function() {
							if (options.showValue) {
								return ((options.height / 2) + options.height / 10);
							}
							return options.height / 4;
						});

					if (options.color) {
						handle.style('fill', '#fff' /*options.color*/ );
					}
					if (options.showValue) {
						handleLabel
							.style('font-size', options.height / 2.5)
							.attr("text-anchor", "middle").attr('y', '0.35em');
					}
					if (ngModel.$modelValue) {
						if (options.showValue) {
							handleLabel.text(labeling(ngModel.$modelValue[options.field]));
						}
						handleCont.transition().duration(500).ease('quad').attr("transform", 'translate(' + x(ngModel.$modelValue[options.field]) + ',' + options.height / 2 + ')');
					} else {
						if (options.showValue) {
							handleLabel.text(0);
						}

					}
				}
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
					if (options.showValue) {
						handleLabel.text(labeling(value));
					}
					handleCont.attr("transform", 'translate(' + x(value) + ',' + options.height / 2 + ')');
				}

				function brushed() {
					var count = 0;
					var found = false;
					var final = "";
					var value = brush.extent()[0];
					angular.forEach($scope.data, function(nat, key) {

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
						if (options.showValue) {
							handleLabel.text(labeling(ngModel.$modelValue[0][n.field]));
						}
						handleCont.transition().duration(500).ease('quad').attr("transform", 'translate(' + x(ngModel.$modelValue.data[0][n.field]) + ',' + options.height / 2 + ')');
					} else {
						if (options.showValue) {
							handleLabel.text(0);
						}
					}

				}, true);
				$scope.$watch(
					function() {
						return ngModel.$modelValue;
					},
					function(newValue, oldValue) {

						if (!newValue) {
							if (options.showValue) {
								handleLabel.text(parseInt(0));
							}
							handleCont.attr("transform", 'translate(' + x(0) + ',' + options.height / 2 + ')');
							return;
						}
						if (options.showValue) {
							handleLabel.text(labeling(newValue[options.field]));
						}
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
							if (options.showValue) {
								handleLabel.text(labeling(nat.data[0][options.field]));
							}
							handleCont.transition().duration(500).ease('quad').attr("transform", 'translate(' + x(nat.data[0][options.field]) + ',' + options.height / 2 + ')');

						}
					});

					x = d3.scale.linear()
						.domain([options.min, options.max])
						.range([options.margin.left, options.width - options.margin.left])
						.clamp(true);
					// brush.x(x)
					// 	.extent([0, 0])
					// 	.on("brush", brush)
					// 	.on("brushend", brushed);
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
							if (options.showValue) {
								handleLabel.text(labeling(nat.data[0][options.field]));
							}
							handleCont.transition().duration(500).ease('quad').attr("transform", 'translate(' + x(nat.data[0][options.field]) + ',' + options.height / 2 + ')');
						}
					});

				});
				$window.onresize = function() {
						options.width = element.parent()[0].clientWidth - options.margin.left - options.margin.right;
						//options.height = options.width / 20;
						draw();
					}
					// $timeout(function() {
					// 	options.width = element.parent()[0].clientWidth - options.margin.left - options.margin.right;
					// 	//options.height = options.width / 20;
					// 	draw();
					// }, 250)
				$scope.$watch($attrs.ngIf, function() {
					$timeout(function() {
						options.width = element.parent()[0].clientWidth - options.margin.left - options.margin.right;

						draw();
					});
				});
				draw();
			}
		};

	});

})();
