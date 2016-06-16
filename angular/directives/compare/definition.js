(function(){
	"use strict";

	angular.module('app.directives').directive( 'compareCountries', function() {

		var defaults = function () {
			return {
				width: 370,
				height: 25,
				margin:5,
				field: 'score'
			}
		};

		return {
			restrict: 'EA',
			templateUrl: 'views/directives/compare/compare.html',
			controller: 'CompareCtrl',
			scope:{
				countries:'=',
				country: '=',
				options: '='
			},
			link: function( scope, element, attrs ){
				scope.options = angular.extend(defaults(), scope.options);
				console.log(scope.options);

				var xscale = d3.scale.linear()
						.domain([0,100])
						.range([0,(scope.options.width -150)]);

				var yscale = d3.scale.linear()
						.domain([0,scope.countries.length + 1])
						.range([0,scope.options.height]);

				var svg = d3.select(element[0]).append('svg');
					svg.attr('width', scope.options.width)
					.attr('height', scope.options.height * scope.countries.length + 1);

				var container = svg.append('g')
					.attr('id', 'compare-chart');


			var	yAxis = d3.svg.axis();
				yAxis
					.orient('left')
					.scale(yscale);

			var y_xis = container.append('g')
							  .attr("transform", "translate(100,0)")
							  .attr('id','yaxis')
							  .call(yAxis);



				var chart = container.append('g')
					.attr('id', 'bars')
					.attr("transform", "translate(100,0)");

				function updateData(){
					svg.transition()
						.duration(500)
						.attr('height', scope.options.height * (scope.countries.length + 1));
					yscale.domain([0,scope.countries.length + 1]).range([0,scope.options.height * (scope.countries.length + 1)]);
					y_xis.transition()
						.duration(500)
            .call(yAxis);
					chart.selectAll('rect')
					.data(scope.countries)
					.enter()
					.append('rect')
					.attr('height', (scope.options.height - scope.options.margin))
					.attr({
						'x':0,
						'y': function(d, i){
							return yscale(i);
						}
					})
					.style('fill', function(d,i){
						return '#ccc';
					})
					.attr('width', function(d){
						return 0;
					});
					var transit = chart.selectAll('rect')
						.data(scope.countries)
						.transition()
						.duration(500)
						.attr('width', function(d){
							return xscale(d[scope.options.field]);
						});
					var transitext = chart.selectAll('text')
						.data(scope.countries)
						.enter()
						.append('text')
						.attr({
							'x':function(d) {
								console.log(d)
								return 200;
							},
							'y':function(d,i){
								return yscale(i)+35;
							}
						})
						.text(function(d){
							return d.score
						});
				}




				scope.$watch(function() { return scope.countries; }, function(n, o){
					updateData();
					console.log(n);
				},true)
			}
		};

	});

})();
