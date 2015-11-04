(function(){
	"use strict";

	angular.module('app.directives').directive( 'parsecsv', function($state, $timeout, ToastService) {

		return {
			restrict: 'EA',
			templateUrl: 'views/directives/parsecsv/parsecsv.html',
			controller: 'ParsecsvCtrl',
			replace:true,
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
									beforeFirstChunk: function(chunk)
									{

										//Check if there are points in the headers
										var index = chunk.match( /\r\n|\r|\n/ ).index;
								    var headings = chunk.substr(0, index).split( ',' );
										for(var i = 0; i <= headings.length; i++){
											console.log(headings[i]);
											if(headings[i]){
												if(headings[i].indexOf('.') > -1){
													headings[i] = headings[i].substr(0, headings[i].indexOf('.'));
												}
											}
										}
								    return headings.join() + chunk.substr(index);
									},
									error: function(err, file)
									{
										ToastService.error(err);
									},
									complete: function(results)
									{
										$scope.vm.errors = errors;

										//See if there is an field name "iso" in the headings;
										angular.forEach($scope.vm.data[0].data[0], function(item, key){
											if(key.indexOf('iso') != -1){
												$scope.vm.meta.iso_field = key;
											}
										});
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
