(function(){
    "use strict";

    angular.module('app.controllers').controller('ExportedCtrl', function($state, ExportService, VectorlayerService, IndizesService){
        //
        var vm = this;
        vm.exporter = ExportService.exporter;
        vm.item = {};
        activate();

        function activate(){
          ExportService.getExport($state.params.id, function(exporter){
            vm.exporter = exporter;
            vm.item = getFirstIndicator(vm.exporter.items);
            vm.index = IndizesService.fetchData(vm.item.indicator_id);
    				vm.index.promises.data.then(function(structure) {
    					vm.index.promises.structure.then(function(data) {
    						vm.data = data;
    						vm.structure = structure;
                VectorlayerService.setBaseLayer(vm.item.style.basemap);
    						VectorlayerService.setData(vm.structure,vm.data,vm.item.style.base_color, true);
    					});
    				});
          });
        }

        function getFirstIndicator(list){
          var found = null;
          angular.forEach(list, function(item){
            if(item.type == 'indicator'){
              found =  item;
            }
            else{
              if(!found){
                found = getFirstIndicator(item.children);
              }
            }
          });
          return found;
        }
    });

})();
