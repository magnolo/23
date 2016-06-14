(function(){
    "use strict";

    angular.module('app.controllers').controller('ExportLayoutCtrl', function(ExportService,$state, $timeout){
        //
        var vm = this;
        vm.exporter = ExportService.exporter;
        activate();

        function activate(){
          $timeout(function(){
              vm.exporter = ExportService.exporter;
          });
            // ExportService.getExport($state.params.id, function(exporter){
            //   vm.exporter = exporter;
            // });
        }


    });

})();
