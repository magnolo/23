(function(){
	"use strict";

	angular.module('app.directives').directive( 'logo', function($interval) {
		var options = function(){
			return {
				size: 150,
				width: 5,
				refresh: 50,
				full: false,
				colors:{
					sun:'#cacaca',
					earth: '#004389'
				}
			};
		}
		return {
			restrict: 'EA',
			templateUrl: 'views/directives/logo/logo.html',
			controller: 'LogoCtrl',
			$scope:{
				options:'='
			},
			compile: function($element, $attrs){
				return {
					pre: function($scope){
						$scope.options = angular.extend(options(), $scope.options);
						$scope.percent = 28;
						$scope.options1 = {
							animate: {
								duration: 1000,
								enabled: true
							},
							barColor: '#3AFEFB',
							scaleColor: false,
							lineWidth: 4,
							lineCap: 'square',
							rotate: 203,
							size: $scope.options.size/1.25,
							trackColor: false
						};
						$scope.percent2 = 87;
						$scope.options2 = {
							animate: {
								duration: 1000,
								enabled: true
							},
							barColor: '#3CADDE',
							scaleColor: false,
							lineWidth: 4,
							lineCap: 'square',
							size: $scope.options.size/1.66667,
							rotate: 203,
							trackColor: false
						};
						$scope.percent3 = 33;
						$scope.options3 = {
							animate: {
								duration: 1000,
								enabled: true
							},
							barColor: '#0C26FA',
							scaleColor: false,
							lineWidth: 4,
							lineCap: 'square',
							size: $scope.options.size/2.5,
							rotate: 203,
							trackColor: false
						};

						$scope.pos = 0;
						$scope.scale = 1;
						$scope.localTime  = new Date().toLocaleString() ;
						$scope.country;
						$scope.color ={
							scale:$scope.options.colors.earth,
							afternoon:$scope.options.colors.earth,
							global:$scope.options.colors.sun
						};
					},
					post: function($scope, $element){
						var afternoon = false;
						function calculateSun(){
						 if($scope.scale > 0){
								$scope.pos = $scope.pos+($scope.options.size/400);
								$scope.scale = $scope.scale-0.005;
							}
							else if($scope.scale < 0 && $scope.scale > -1){
								if(afternoon){
									$scope.color.scale = $scope.options.colors.earth ;
								}
								else{
									$scope.color.scale = $scope.options.colors.sun;
								}
								$scope.pos = $scope.pos+($scope.options.size/400);
								$scope.scale = $scope.scale-0.005;
							}
							else if($scope.scale <= -1){

								if(afternoon){
									$scope.color.global = $scope.options.colors.sun;
									$scope.color.afternoon = $scope.options.colors.earth;
								}
								else{
									$scope.color.global = $scope.options.colors.earth;
									$scope.color.afternoon = $scope.options.colors.sun;
								}

								afternoon = !afternoon;
								$scope.scale = 1;
								$scope.pos = 0;
							}
						}
						$interval(calculateSun, $scope.options.refresh);
						calculateSun();
						if($scope.options.full){
							$element.find('g').css('mask','');
						}
					}
				}
			}
		};

	});

})();
