(function(){
	"use strict";

	angular.module('app.directives').directive( 'triangleGraph', function() {

		return {
			restrict: 'EA',
			templateUrl: 'views/directives/triangle-graph/triangle-graph.html',
			controller: 'TriangleGraphCtrl',
			controllerAs: 'vm',
			scope: {},
			bindToController: {
				data: '=',
				ngModel: '='
			},
			link: function( scope, element, attrs ){
				//
				var width = element.parent()[0].clientWidth - 48;
				var height = width / 3;
				var xScale = d3.scale.linear()
			 .domain([0, 100])
			 .range([0, width]);

	 var yScale = d3.scale.linear()
			 .domain([0, scope.vm.data.length])
			 .range([height, 0]);
			 var svg = d3.select(element[0]).append('svg')
		 		.attr('width',width)
		 		.attr('height', height);

				svg.select('.triangle-grid')
         .selectAll('div')
         .data(scope.vm.data)
       .enter().append('div')
         .attr('class', 'triangle-box');

    //  svg.selectAll('.triangle-box')
    //      .append('svg')
    //      .attr('width', 100)
    //      .attr('height', 100)
    //    .append('g')
    //      .attr('class', 'triangles')
		 //
    //      .append('path')
    //      .attr('d', () => 'M ' + xScale(5) + ' ' + yScale(0) + ' L ' + xScale(88) + ' ' + yScale(5) + ' L ' + xScale(88) + ' ' + yScale(18815) + ' Z')
    //      .style('fill', 'rgb(222,222,222)');
		 //
    //  svg.selectAll('.triangles')
		 //
    //      .append('path')
    //      .attr('d', (d) => 'M ' + xScale(5) + ' ' + yScale(0) + ' L ' + xScale(88) + ' ' + yScale(5) + ' L ' + xScale(88) + ' ' + yScale(d.value) + ' Z')
    //      .style('fill', 'rgba(181,227,147,0.5)');


				}
		};

	});

})();
