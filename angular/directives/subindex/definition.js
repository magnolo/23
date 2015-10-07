(function () {
	"use strict";

	angular.module('app.directives').directive('subindex', subindex);

	subindex.$inject = ['$timeout', 'smoothScroll'];

	function subindex($timeout, smoothScroll) {
		return {
			restrict: 'E',
			replace: true,
			scope: {
				country: '=',
				selected: '='
			},
			templateUrl: 'views/directives/subindex/subindex.html',
			link: subindexLinkFunction
		};

		function subindexLinkFunction($scope, element, $attrs) {
			$scope.setChart = setChart;
			$scope.calculateGraph = calculateGraph;
			$scope.gotoBox = gotoBox;
			activate();

			function activate(){
				$scope.setChart();
				$scope.calculateGraph();
				$scope.gotoBox();
				$scope.$watch('selected', function (newItem, oldItem) {
					if (newItem === oldItem) {
						return false;
					}
					$scope.calculateGraph();
					$scope.gotoBox();
				})
			}
			function setChart() {
				$scope.chart = {
					options: {
						chart: {
							type: 'lineChart',
							//height: 200,
							legendPosition: 'left',
							margin: {
								top: 20,
								right: 20,
								bottom: 20,
								left: 20
							},
							x: function (d) {
								return d.x;
							},
							y: function (d) {
								return d.y;
							},
							showValues: false,
							showYAxis: false,
							transitionDuration: 500,
							useInteractiveGuideline: true,
							forceY: [100, 0],
							xAxis: {
								axisLabel: ''
							},
							yAxis: {
								axisLabel: '',
								axisLabelDistance: 30
							},
							legend:{
								rightAlign:false,
								margin:{
									bottom:30
								}
							},
							lines:{
								interpolate:'cardinal'
							}
						}
					},
					data: []
				};
				return $scope.chart;
			}
			function gotoBox(){
				$timeout(function(){
						smoothScroll(element[0], {offset:150});
				});

			}
			function calculateGraph() {
				var chartData = [];
				angular.forEach($scope.selected.data.children, function (item, key) {
					var graph = {
						key: item.title,
						color: item.color,
						values: []
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
		}
	}
})();
