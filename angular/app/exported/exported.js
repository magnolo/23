(function(){
    "use strict";

    angular.module('app.controllers').controller('ExportedCtrl', function($state, ExportService, VectorlayerService, IndizesService){
        //
        var vm = this;
        vm.ExportService = ExportService;
        activate();

        function activate(){
          vm.ExportService.getExport($state.params.id, function(exporter){});
        }
    });

})();
