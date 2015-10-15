(function(){
	"use strict";

	angular.module( 'app.controllers' ).controller( 'SubindexCtrl', function($scope, $filter, $timeout, smoothScroll){
		$scope.info = false;
		$scope.activeTab = 0;
		$scope.setChart = setChart;
		$scope.calculateGraph = calculateGraph;
		$scope.createIndexer = createIndexer;
		$scope.calcSubRank = calcSubRank;
		$scope.toggleInfo = toggleInfo;
		$scope.medianOptions = {
			color:$scope.$parent.display.selectedCat.color,
			field:$scope.$parent.display.selectedCat.type,
			handling: false
		};
		activate();


		function activate(){
			$scope.calcSubRank();
			$scope.setChart();
			$scope.calculateGraph();
			$scope.createIndexer();
			$scope.$watch('selected', function (newItem, oldItem) {
				if (newItem === oldItem) {
					return false;
				}
				$scope.createIndexer();
				$scope.calculateGraph();
				$scope.gotoBox();
			});
			$scope.$watch('country', function(n, o){
				if(n === o){
					return;
				}
				$scope.calcSubRank();
			});
			$scope.$watch('medianOptions', function(n, o){
				if(n === o){
					return;
				}
			});
			if($scope.$parent.compare.active){
				$scope.activeTab = 2;
			}
		}
		function toggleInfo(){
			$scope.info = !$scope.info;
		};
		function calcSubRank(){
				var rank = 0;
				angular.forEach($scope.data, function(item){
					item[$scope.selected.type] = parseFloat(item[$scope.selected.type]);
					item['score'] = parseInt(item['score']);
				})
				var filter = $filter('orderBy')($scope.data, [$scope.selected.type,"score"] , true);
				for(var i = 0;i < filter.length; i++){
					if(filter[i].iso == $scope.country.iso){
						rank = i+1;
					}
				}
				$scope.country.rank = rank;
		}
		function createIndexer(){
		 	$scope.indexer = [$scope.$parent.display.selectedCat.data];
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
		}
    });

})();
