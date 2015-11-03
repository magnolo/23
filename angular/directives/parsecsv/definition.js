(function(){
	"use strict";

	angular.module('app.directives').directive( 'parsecsv', function($state, $timeout, ToastService) {

		return {
			restrict: 'EA',
			templateUrl: 'views/directives/parsecsv/parsecsv.html',
			controller: 'ParsecsvCtrl',
			link: function( $scope, element, $attrs ){
				//
				var errors = 0;
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
										angular.forEach(row.data[0], function(item){
											if(item == "NA" || item < 0){
												row.errors.push({
													type:"1",
													message:"Field in row is not valid for database use!",
													column: item
												})
												errors++;
											}
										});
										$scope.vm.data.push(row);
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
										$scope.vm.errors = errors;
										$state.go('app.index.create.check');
										ToastService.show($scope.vm.data.length+' Zeilen importiert!')
									}
								})
							})

					});
			}
		};

	});

})();
