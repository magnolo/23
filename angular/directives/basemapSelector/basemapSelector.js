(function(){
	"use strict";

	angular.module( 'app.controllers' ).controller( 'BasemapSelectorCtrl', function(BasemapsService){
		//
			var vm = this;
			vm.basemaps = [];
			vm.selected = {};
			vm.setMap = setMap;

			activate();

			function activate(){
				if(!vm.style){
					vm.style = {
						basemap_id:0
					}
				}
				BasemapsService.getBasemaps(function(response){
					vm.basemaps = response;
					if(vm.style.basemap_id != 0){
						angular.forEach(vm.basemaps, function(map, key){
							if(map.id == vm.style.basemap_id){
								vm.selected = map;
							}
						})
					}
				});
			}

			function setMap(map){
				vm.selected = map;
				vm.style.basemap_id = map.id;
			}

    });

})();
