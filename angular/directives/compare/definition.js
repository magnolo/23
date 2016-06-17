(function() {
	"use strict";

	angular.module('app.directives').directive('compareCountries', function() {

		var defaults = function() {
			return {
				width: 350,
				height: 25,
				margin: 5,
				color: '#ff0000',
				field: 'score'
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
				var fontColor = '#333', bgColor = '#ddd';

				var xscale = d3.scale.linear()
					.domain([0, 100])
					.range([0, (scope.options.width - 100)]);

				var yscale = d3.scale.linear()
					.domain([0, scope.countries.length])
					.range([0, scope.options.height]);

				var svg = d3.select(element[0]).append('svg');
				svg.attr('width', scope.options.width)
					.attr('height', scope.options.height * scope.countries.length);

				var container = svg.append('g')
					.attr('id', 'compare-chart')
					.attr('y', scope.options.height);


				var yAxis = d3.svg.axis();
				yAxis
					.orient('left')
					.ticks(0)
					.tickSize(1)
					.scale(yscale);

				var y_xis = container.append('g')
					.attr("transform", "translate(100,0)")
					.attr('class', 'yaxis')
					.call(yAxis);

				var y_xis_center = container.append('g')
					.attr("transform", "translate(" + (((scope.options.width - 100) / 2) + 100) + ",0)")
					.attr('class', 'yaxis dashed')
					.style("stroke-dasharray", ("3, 3"))
					.call(yAxis);


				var chart = container.append('g')
					.attr('id', 'bars')
					.attr("transform", "translate(100,0)");
				var labels = container.append('g')
					.attr('id', 'labels')
					.attr('width' , 100);

					var y_xis_end= container.append('g')
							.attr("transform", "translate(" + scope.options.width + ",0)")
							.attr('class', 'yaxis')
							.style("stroke-dasharray", ("3, 3"))
							.call(yAxis);
				function updateData() {
					svg.transition()
						.duration(500)
						.attr('height', (scope.options.height * (scope.countries.length))+ (scope.options.height *2));
					yscale.domain([0, scope.countries.length]).range([0, scope.options.height * (scope.countries.length)]);
					y_xis.transition()
						.duration(500)
						.call(yAxis);
					y_xis_center.transition()
						.duration(500)
						.call(yAxis);
					y_xis_end.transition()
							.duration(500)
							.call(yAxis);
					var barsData = chart.selectAll('g')
						.data(scope.countries);

					var barsContainer = barsData.enter().append('g');
					var bars = barsContainer
						.append('rect')
						.attr('height', (scope.options.height - scope.options.margin))
						.attr({
							'x': 0,
							'y': function(d, i) {
								return yscale(i)+(scope.options.margin/2);
							}
						})
						.style('fill', bgColor)
						.attr('width', function(d) {
							return 0;
						});

					var circles = barsContainer
						.append('cirlce')
						.attr('r', 20)
						.attr('cx', 20)
						.attr('cy', 20)
						.attr("fill", scope.options.color);

					bars
						.transition()
						.duration(500)
						.attr('width', function(d) {
							return xscale(d[scope.options.field]);
						});
					var valuesText = barsContainer
						.append('text')
						.attr({
							'x': function(d, i) {
								return 0;
							},
							'y': function(d, i) {
								return yscale(i) + 15;
							}
						})
						.text(0)
						.style('fill', scope.options.color)
						.style('font-size', '12px')
					valuesText
						.transition()
						.duration(500)
						.attr({
							'x': function(d, i) {

								if(d[scope.options.field] > 50){
									return xscale(d[scope.options.field]) - this.getBoundingClientRect().width - 15;
								}
								return xscale(d[scope.options.field] ) + 5;
							}
						}).tween('text', function(d) {
							var i = d3.interpolate(this.textContent, parseInt(d[scope.options.field]));
							return function(t) {
								 this.textContent = Math.round(i(t));
							};

						});
						var labelsData = labels.selectAll('g')
							.data(scope.countries);
						var labelsContainer = labelsData.enter().append('g');
						var countryLabels = labelsContainer
							.append('rect')
							.attr('width', 20)
							.attr('height', scope.options.height - scope.options.margin)
							.attr({
								'x': function(d, i) {
								return (100 - (scope.options.height - scope.options.margin) - ((scope.options.height - scope.options.margin)/2));
								},
								'y': function(d, i) {
									return yscale(i) + (scope.options.margin/2);
								}
							})
							.attr('fill', function(d){
								if(d.iso == scope.country.iso){
									return scope.options.color
								}
								return bgColor
							});
						var countryIso =	labelsContainer.append('text')
							.text(function(d){
								return d.iso
							})
							.style('font-size', '12px')
							.attr('width', scope.options.height - scope.options.margin)
							.attr('height', scope.options.height - scope.options.margin)
							.attr({
								'x': function(d, i) {
									return (100 - (scope.options.height - scope.options.margin) - 8);
								},
								'y': function(d, i) {
									return yscale(i)+ 14 +(scope.options.margin/2);
								}
							})
							.attr('fill', function(d){
								if(d.iso == scope.country.iso){
									return fontColor
								}

								return scope.options.color
							});
						barsData.exit().remove();
						labelsData.exit().remove();

				}




				scope.$watch(function() {
					return scope.countries;
				}, function(n, o) {
					updateData();

				}, true)
			}
		};

	});

})();
