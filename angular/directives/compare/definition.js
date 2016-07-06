(function() {
	"use strict";

	angular.module('app.directives').directive('compareCountries', function() {

		var defaults = function() {
			return {
				width: 350,
				height: 25,
				margin: 5,
				color: '#ff0000',
				field: 'score',
				duration: 500,
				min: 0,
				max: 100
			}
		};

		return {
			restrict: 'EA',
			templateUrl: 'views/directives/compare/compare.html',
			controller: 'CompareCtrl',
			scope: {
				countries: '=',
				country: '=',
				options: '='
			},
			link: function(scope, element, attrs) {
				scope.options = angular.extend(defaults(), scope.options);
				var fontColor = '#333',
					bgColor = '#ddd';

				var xscale = d3.scale.linear()
					.domain([scope.options.min, scope.options.max])
					.range([0, (scope.options.width - 100 - (scope.options.margin * 2))]);

				var yscale = d3.scale.ordinal()
					.range([0, scope.options.height])
					.domain([0, scope.countries.length]);

				var svg = d3.select(element[0]).append('svg')
					.attr('width', scope.options.width)
					.attr('height', scope.options.height * scope.countries.length);

				var container = svg.append('g')
					.attr('id', 'compare-chart')
					.attr('y', scope.options.height)
					.attr('x', scope.options.margin);

				var xAxis = d3.svg.axis()
					.scale(xscale)
					.orient("top")
					.tickValues([scope.options.min, scope.options.max]);

				var lines = svg.append("g")
					.attr("class", "x axis")
				var nullLine = lines.append("line")
					.attr("class", "domain")
					.attr("y2", scope.options.height * scope.countries.length)

				var midLine = lines.append("line")
					.attr("class", "domain dashed")
					.attr('transform', function() {
						return "translate(" + (xscale(scope.options.max / 2)) + ",0)";
					})
					.attr("y2", scope.options.height * scope.countries.length)

				var endLine = lines.append("line")
					.attr("class", "domain")
					.attr('transform', function() {
						return "translate(" + (xscale(scope.options.max)) + ",0)";
					})
					.attr("y2", scope.options.height * scope.countries.length);
				var rankLabel = lines.append('text')
					.attr('class', 'header')
					.text('Rank')
					.attr('transform', function() {
						return "translate(-85,-10)";
					});

				var medianLabel = lines.append('text')
					.attr('class', 'header')
					.text('Median')
					.attr('transform', function() {
						return "translate(100,-10)";
					});

				var chart = container.append('g')
					.attr('id', 'bars')
					.attr("transform", "translate(100,0)");
				var labels = container.append('g')
					.attr('id', 'labels')
					.attr('width', scope.options.max);

				function updateData() {
					//var max = d3.max(data, function(d) { return +d.field_goal_attempts;} );
					svg.transition()
						.duration(scope.options.duration)
						.attr('height', (scope.options.height * (scope.countries.length)) + (scope.options.height * 2));
					yscale.domain([0, scope.countries.length]).range([0, scope.options.height * (scope.countries.length)]);



					d3.transition(svg).select(".x.axis")
						.call(xAxis)
						.attr("transform", "translate(100,20)");

					var bar = chart.selectAll('.bar')
						.data(scope.countries, function(d) {
							return "id_" + d.iso
						});

					var barsContainer = bar.enter().insert('g', '.axis')
						.attr('class', "bar");

					var rects = barsContainer.append('rect')
						.attr('height', (scope.options.height - scope.options.margin))
						.style('fill', bgColor)
						.attr('width', function(d) {
							return 0;
						});
					var ranks = barsContainer.append('text')
						.attr('class', 'ranks')
						.attr('transform', 'translate(-70, 0)')
						.text(function(d) {
							if (d.rank == 1) {
								return "1st";
							} else if (d.rank == 2) {
								return "2nd";
							}
							return d.rank + "th";
						})
						.attr('fill', scope.options.color)
						.attr('y', function(d) {
							return scope.options.margin * 3;
						})
					var labelsBg = barsContainer.append('rect')
						.attr('height', (scope.options.height - scope.options.margin))
						.style('fill', function(d) {
							if (d.iso == scope.country.iso) {
								return scope.options.color
							}
							return bgColor
						})
						.attr('width', function(d) {
							return scope.options.height;
						})
						.attr('x', -(scope.options.height + scope.options.margin));

					var labels = barsContainer.append('text')
						.attr('class', "label")
						.attr({
							'x': function(d, i) {
								return -17;
							},
							'y': function(d, i) {
								return scope.options.margin * 2;
							}
						})
						.style('font-size', '13px')
						.attr('dy', ".35em")
						.attr('text-anchor', 'middle')
						.text(function(d) {
							return d.iso
						}).attr('fill', function(d) {
							if (d.iso == scope.country.iso) {
								return "#fff"
							}
							return scope.options.color
						});

					var values = barsContainer.append("text")
						.attr("class", "value")
						.attr({
							'x': 0,
							'y': (scope.options.margin * 2)
						})
						.text(0)
						.style('fill', scope.options.color)
						.attr("dy", ".35em")
						.attr("text-anchor", "end");

					var circles = barsContainer.append('circle')
						.attr('r', 3)
						.attr('cx', 0)
						.attr('cy', ((scope.options.height / 2) - (scope.options.margin / 2)))
						.attr("fill", scope.options.color);

					var barUpdate = d3.transition(bar)
						.attr("transform", function(d, i) {
							return "translate(0," + (i * scope.options.height + (scope.options.margin / 2) + 20) + ")";
						});
					nullLine.transition()
						.duration(scope.options.duration)
						.attr('y2', scope.options.height * scope.countries.length)
					midLine.transition()
						.duration(scope.options.duration)
						.attr('y2', scope.options.height * scope.countries.length)
					endLine.transition()
						.duration(scope.options.duration)
						.attr('y2', scope.options.height * scope.countries.length)
					rects.transition()
						.duration(scope.options.duration)
						.attr('width', function(d) {
							return xscale(d[scope.options.field]);
						});

					circles.transition()
						.duration(scope.options.duration)
						.attr('cx', function(d) {
							return xscale(d[scope.options.field]);
						});

					values.transition()
						.duration(scope.options.duration)
						.attr({
							'x': function(d, i) {

								if (d[scope.options.field] > scope.options.max / 2) {
									return xscale(d[scope.options.field]) - this.getBoundingClientRect().width;
								}
								return xscale(d[scope.options.field]) + scope.options.height;
							}
						})
						.tween('text', function(d) {
							var i = d3.interpolate(this.textContent, parseInt(d[scope.options.field]));
							return function(t) {
								this.textContent = Math.round(i(t));
							};

						});


					// bar.exit()
					// 	.select("circle")
					// 	.transition()
					// 	.duration(scope.options.duration)
					// 	.attr("r", 0)
					// 	.attr("cx", 0);
					// bar.exit()
					// 	.select("text")
					// 	.transition()
					// 	.duration(scope.options.duration)
					// 	.attr("transform", "scale(0)");
					//
					// bar.exit()
					// 	.select("rect")
					// 	.transition()
					// 	.duration(scope.options.duration)
					// 	.attr('transform', "rotate(90)scale(0)")
					// 	.attr('opacity', 0)

					bar.exit()
						.transition()
						.duration(scope.options.duration)
						.attr("opacity", "0")
						.remove();
					//
					// barExit.select("rect")
					// 	.attr("width", function(d) {
					// 		return xAxis(d[scope.options.field]);
					// 	});
					//
					// barExit.select(".value")
					// 	.attr("x", function(d) {
					// 		return xAxis(d[scope.options.field]) - 3;
					// 	})
					// 	.text(function(d) {
					// 		return format(d[scope.options.field]);
					// 	});


					//	labelsData.exit().remove();

				}




				scope.$watch(function() {
					return scope.countries;
				}, function(n, o) {
					scope.countries = angular.extend(scope.countries, scope.country);
					updateData();

				}, true)
			}
		};

	});

})();
