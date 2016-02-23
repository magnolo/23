(function () {
	"use strict";

	angular.module('app.directives').directive('roundbar', function () {

		return {
			restrict: 'EA',
			//templateUrl: 'views/directives/roundbar/roundbar.html',
			controller: 'RoundbarCtrl',
			replace:false,
			scope: {
				data: '=chartData'
			},
			link: function (scope, element, attrs) {

				var margin = {
						top: 20,
						right: 20,
						bottom: 30,
						left: 40
					},
					width = 300 - margin.left - margin.right,
					height = 250 - margin.top - margin.bottom,
					barWidth =35;


					var scale = {
	  				y: d3.scale.linear()
					};
					scale.y.domain([0, 100]);
					scale.y.range([height,0]);
				var svg = d3.select(element[0]).append("svg")
					.attr("width", width + margin.left + margin.right)
					.attr("height", height + margin.top + margin.bottom)
					.append("g")
					.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

				//x.domain(scope.data.map(function(d) { return d.letter; }));
				//y.domain([0, d3.max(scope.data, function(d) { return d.frequency; })]);
				var bars = svg.selectAll('.bars').data(scope.data).enter().append("g");//.attr("transform", function(d, i) { return "translate(" + i * 20 + ", 0)"; });;

				var attributes = bars
					.append('rect')
					.attr('x', function(d, i){
						return i * barWidth;
					})
					.attr('y', function(d) {
			         return scale.y(d.value) ;
			    } )
					.attr("width", function(d){ return barWidth - 5})
					.attr("height", function(d){ return height - scale.y(d.value)})

					.style("fill",function(d){ return d.color});

				var labels = svg.selectAll("text")
				   .data(scope.data)
				   .enter()
				   .append("text");

				labels.text(function(d){
					return d.value
				}).attr("x", function(d, i) {
        return i * barWidth;
   })
   .attr("y", function(d) {
        return scale.y(d.value) ;
   });
			}
		};

	});

})();
