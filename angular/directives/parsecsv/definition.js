(function(){
	"use strict";

	angular.module('app.directives').directive( 'parsecsv', function($state, $timeout, toastr) {

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
					var isVertical = false;
					var raw = [];
					var rawList = {};
					input.css({ display:'none' });
					button.bind('click', function() {
							input[0].click();
					});
					input.bind('change',function(e){
						isVertical = false;
						raw = [];
						rawList = {};
						errors = 0;
						stepped = 0, rowCount = 0, errorCount = 0, firstError;
						start, end;
						firstRun = true;
							$timeout(function(){
								var csv = Papa.parse(input[0].files[0],{
									skipEmptyLines: true,
									header:true,
									dynamicTyping: true,
									step:function(row){
										angular.forEach(row.data[0], function(item, key){
											if(isNaN(item) || item < 0 ){
												if(/*item.toString().toUpperCase() == "NA" || */item < 0 || item.toString().toUpperCase().indexOf('N/A') > -1){
													row.errors.push({
														type:"1",
														message:"Field in row is not valid for database use!",
														column: item
													})
													errors++;
												}
											}
										});
										if(isVertical){
											angular.forEach(row.data[0], function(item, key){
												if(key.length == 3){
													if(typeof	rawList[key].data == "undefined"){
															rawList[key].data = [];
													}
													rawList[key].data.push(item);
												}
											});
											//rawList[key].errors = row.errors;
										}
										else{
											$scope.vm.data.push(row);
										}
										//console.log(row);

									},
									beforeFirstChunk: function(chunk)
									{

										//Check if there are points in the headers
										var index = chunk.match( /\r\n|\r|\n/ ).index;
											var delimiter = ',';
								    var headings = chunk.substr(0, index).split( ',' );

										if(headings.length < 2){
 											headings = chunk.substr(0, index).split( "\t" );
											delimiter = '\t';
										}
										var isIso = [];

										for(var i = 0; i <= headings.length; i++){
											if(headings[i]){
												headings[i] = headings[i].replace(/[^a-z0-9]/gi,'_').toLowerCase();
												if(headings[i].indexOf('.') > -1){
													headings[i] = headings[i].substr(0, headings[i].indexOf('.'));
												}
												var head = headings[i].split('_');
												if(head.length > 1){
													headings[i] = '';
													for(var j = 0; j < head.length; j++){
														if(isNaN(head[j])){
															if(j > 0){
																headings[i] += '_';
															}
															headings[i] += head[j];
														}
													}
												}

												if(headings[i].length == 3){
													isIso.push(true);
												}
											}
										}
										if(headings.length == isIso.length){
											isVertical = true;
												for(var i = 0; i <= headings.length; i++){
													if(typeof rawList[headings[i]] == "undefined"){
														rawList[headings[i]] = {};
													}
													rawList[headings[i]].data = [];
												}
										}

								    return headings.join(delimiter) + chunk.substr(index);
									},
									error: function(err, file)
									{
										ToastService.error(err);
									},
									complete: function(results)
									{
										$scope.vm.errors = errors;

										//See if there is an field name "iso" in the headings;
										if(!isVertical){
											angular.forEach($scope.vm.data[0].data[0], function(item, key){
												if(key.toLowerCase().indexOf('iso') != -1 || key.toLowerCase().indexOf('code') != -1){
													$scope.vm.meta.iso_field = key;
												}
													if(key.toLowerCase().indexOf('country') != -1){
														$scope.vm.meta.country_field = key;
													}
											});
										}
										else{
											angular.forEach(rawList, function(item,key){
												item.errors = [];
												if(key.toLowerCase() != "undefined" && typeof key != "undefined"){
													var r = {iso:key.toUpperCase()};
													angular.forEach(item.data, function(column, i){
														r['column_'+i] = column;
														if(isNaN(column) || column < 0 ){
															if(column.toString().toUpperCase() == "NA" || column < 0 || column.toString().toUpperCase().indexOf('N/A') > -1){
																item.errors.push({
																	type:"1",
																	message:"Field in row is not valid for database use!",
																	column: item
																})
																errors++;
															}
														}
													});
													$scope.vm.data.push({data:[r], errors:item.errors});
												}
											});
											$scope.vm.meta.iso_field = 'iso';
										}

										$state.go('app.index.create.basic');
										toastr.info($scope.vm.data.length+' lines importet!', 'Information')
									}
								});

							});

					});
			}
		};

	});

})();
