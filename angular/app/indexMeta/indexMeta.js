(function(){
    "use strict";

    angular.module('app.controllers').controller('IndexMetaCtrl', function($scope, VectorlayerService,$timeout, DataService,IndexService,leafletData, toastr){
        //

        var vm = this;
        vm.min = 10000000;
        vm.max = 0;
        vm.indicators = [];
        vm.scale = "";
        vm.data = IndexService.getData();
        vm.meta = IndexService.getMeta();
        vm.errors = IndexService.getErrors();
        vm.indicator = IndexService.activeIndicator();
        vm.countriesStyle = countriesStyle;
        createCanvas('#ff0000');

        $scope.$watch(function(){ return IndexService.activeIndicator()}, function(n,o){
          if(n === o)return;
          vm.indicator = n;
          if(vm.indicator.style){
            updateCanvas(vm.indicator.style.base_color);
          }
          drawCountries();
        });

        $scope.$watch('vm.indicator', function(n,o){
          if(n === o) return;
          if(typeof n.style_id != "undefined" ){
            if(n.style_id != o.style_id){
              if(n.style){
                updateCanvas(n.style.base_color);
              }
              else{
                updateCanvas('#ff0000');
              }

              drawCountries();
            }
          }
          //IndexService.setActiveIndicatorData(n);
          IndexService.setToLocalStorage();
        },true);

        function restyle(item){

        }
        function minMax(){
          vm.min = 10000000;
          vm.max = 0;
          angular.forEach(vm.data, function(item, key){
              vm.min = Math.min(item.data[0][vm.indicator.column_name], vm.min);
              vm.max = Math.max(item.data[0][vm.indicator.column_name], vm.max);
          });
          vm.scale = d3.scale.linear().domain([vm.min,vm.max]).range([0,100]);
        }
        function createCanvas(color) {
    			vm.canvas = document.createElement('canvas');
    			vm.canvas.width = 280;
    			vm.canvas.height = 10;
    			vm.ctx = vm.canvas.getContext('2d');
    			var gradient = vm.ctx.createLinearGradient(0, 0, 280, 10);
    			gradient.addColorStop(1, 'rgba(255,255,255,0)');
    			gradient.addColorStop(0.53, color ||  'rgba(128, 243, 198,1)');
    			gradient.addColorStop(0, 'rgba(102,102,102,1)');
    			vm.ctx.fillStyle = gradient;
    			vm.ctx.fillRect(0, 0, 280, 10);
    			vm.palette = vm.ctx.getImageData(0, 0, 257, 1).data;
    			document.getElementsByTagName('body')[0].appendChild(vm.canvas);
    		}

    		function updateCanvas(color) {
    			var gradient = vm.ctx.createLinearGradient(0, 0, 280, 10);
    			gradient.addColorStop(1, 'rgba(255,255,255,0)');
    			gradient.addColorStop(0.53, color || 'rgba(128, 243, 198,1)' );
    			gradient.addColorStop(0, 'rgba(102,102,102,1)');
    			vm.ctx.fillStyle = gradient;
    			vm.ctx.fillRect(0, 0, 280, 10);
    			vm.palette = vm.ctx.getImageData(0, 0, 257, 1).data;
    			//document.getElementsByTagName('body')[0].appendChild(vm.canvas);
    		};
        function getValueByIso(iso){
          var value = 0;
          angular.forEach(vm.data, function(item, key){
             if(item.data[0][vm.meta.iso_field] == iso){
               value = item.data[0][vm.indicator.column_name];
             }
          });
          return value;
        }
        function countriesStyle(feature) {
    			var style = {};
    			var iso = feature.properties.iso_a2;
    			var value = getValueByIso(iso) || vm.min;
    			var field = vm.indicator.column_name;
    			var type = feature.type;

    			switch (type) {
    			case 3: //'Polygon'
    			//	if (!value) value = 0;

    					//TODO: MAX VALUE INSTEAD OF 100
              console.log(value, vm.scale(value), vm.min, vm.max);
    					var colorPos = parseInt(256 / 100 * parseInt(vm.scale(value))) * 4;
    					var color = 'rgba(' + vm.palette[colorPos] + ', ' + vm.palette[colorPos + 1] + ', ' + vm.palette[colorPos + 2] + ',' + vm.palette[colorPos + 3] + ')';
              style.color = 'rgba(' + vm.palette[colorPos] + ', ' + vm.palette[colorPos + 1] + ', ' + vm.palette[colorPos + 2] + ',0.6)'; //color;
    					style.outline = {
    						color: color,
    						size: 1
    					};
    					style.selected = {
    						color: 'rgba(' + vm.palette[colorPos] + ', ' + vm.palette[colorPos + 1] + ', ' + vm.palette[colorPos + 2] + ',0.3)',
    						outline: {
    							color: 'rgba(66,66,66,0.9)',
    							size: 2
    						}
    					};
    					break;
    				/*} else {

    					style.color = 'rgba(255,255,255,0)';
    					style.outline = {
    						color: 'rgba(255,255,255,0)',
    						size: 1
    					};
    				}*/
    			}

    			if (feature.layer.name === VectorlayerService.getName()+'_geom') {
    				style.staticLabel = function () {
    					var style = {
    						html: feature.properties.name,
    						iconSize: [125, 30],
    						cssClass: 'label-icon-text'
    					};
    					return style;
    				};
    			}
    			return style;
    		}
        function drawCountries() {
          minMax();
    			leafletData.getMap('map').then(function (map) {
    				vm.map = map;
    				vm.mvtSource = VectorlayerService.getLayer();
    				$timeout(function () {
    						vm.mvtSource.setStyle(countriesStyle);
    					//vm.mvtSource.redraw();
    				});
    			});
    		}
    });

})();
