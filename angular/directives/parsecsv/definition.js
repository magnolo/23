(function(){
	"use strict";

	angular.module('app.directives').directive( 'parsecsv', function($timeout, ToastService) {

		return {
			restrict: 'EA',
			templateUrl: 'views/directives/parsecsv/parsecsv.html',
			controller: 'ParsecsvCtrl',
			link: function( $scope, element, $attrs ){
				//
				var stepped = 0, rowCount = 0, errorCount = 0, firstError;
				var start, end;
				var firstRun = true;
				var maxUnparseLength = 10000;
				var button = element.find('button');
					var input = element.find('input');
					input.css({ display:'none' });
					button.bind('click', function() {
							input[0].click();
					});
					input.bind('change',function(e){
							console.log('hidd');
							$timeout(function(){
								Papa.parse(input[0].files[0],{
									skipEmptyLines: true,
									header:true,
									dynamicTyping: true,
									step:function(row){
										console.log(row.data[0]);
										$scope.vm.data.push(row.data[0]);
									},
									before: function(file, inputElem)
									{

										console.log("Parsing file...", file);
									},
									error: function(err, file)
									{
										ToastService.error(err);
									},
									complete: function(results)
									{
										$scope.vm.step = 1;
										ToastService.show($scope.vm.data.length+' Zeilen importiert!')
									}
								})
							})

					});
			}
		};

	});

})();
