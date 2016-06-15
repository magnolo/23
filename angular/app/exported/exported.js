(function(){
    "use strict";

    angular.module('app.controllers').controller('ExportedCtrl', function($state, ExportService, VectorlayerService, IndizesService){
        //
        var vm = this;
        vm.ExportService = ExportService;
        activate();

        function activate(){
          vm.ExportService.getExport($state.params.id, function(exporter){
            // vm.index = IndizesService.fetchData(vm.item.indicator_id);
    				// vm.index.promises.data.then(function(structure) {
    				// 	vm.index.promises.structure.then(function(data) {
    				// 		vm.data = data;
    				// 		vm.structure = structure;
            //     VectorlayerService.setBaseLayer(vm.item.style.basemap);
    				// 		VectorlayerService.setData(vm.structure,vm.data,vm.item.style.base_color, true);
    				// 	});
    				// });
          });
        }
    });

})();
