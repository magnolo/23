(function(){
    "use strict";

    angular.module('app.controllers').controller('ChapterCtrl', function($scope,$state, ExportService){
        var vm = this;
        vm.chapter = $state.params.chapter;
         ExportService.getExport($state.params.id, function(exporter){
            vm.exporter = exporter;
        });

        $scope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams) {
          vm.chapter = toParams.chapter;
        });

    });

})();
