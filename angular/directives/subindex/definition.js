(function(){
	"use strict";

	angular.module('app.directives').directive( 'subindex', function() {
		return {
			restrict: 'E',
			scope:{
				country:'=',
				selected: '='
			},
			templateUrl: 'views/directives/subindex/subindex.html',
			link: function( $scope, element, $attrs ){
				$scope.chart = {
					options: {
						chart: {
							type: 'lineChart',
							height: 200,
							legendPosition:'bottom',
							margin: {
								top: 20,
								right: 20,
								bottom: 20,
								left: 40
							},
							x: function (d) {
								return d.x;
							},
							y: function (d) {
								return d.y;
							},
							showValues: false,
							transitionDuration: 500,
							forceY:[100,0],
							xAxis: {
								axisLabel: ''
							},
							yAxis: {
								axisLabel: '',
								axisLabelDistance: 30
							}
						}
					},
					data: []
				};
				$scope.calculateGraph = function(){
					var chartData = [];
					angular.forEach($scope.selected.data.children, function(item,key){
						var graph = {
							key:item.title,
							color: item.color,
							values :[]
						};
						angular.forEach($scope.country.epi, function (data) {
							graph.values.push({
								x: data.year,
								y: data[item.column_name]
							});
						});
						chartData.push(graph);
					});
					$scope.chart.data = chartData;
				};
				$scope.calculateGraph();
				$scope.$watch('selected', function(newItem, oldItem){
					if(newItem === oldItem){
						return false;
					}
					console.log();
					$scope.calculateGraph();
				})
			}
		};

	});

})();
