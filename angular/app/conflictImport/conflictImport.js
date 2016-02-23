(function(){
    "use strict";

    angular.module('app.controllers').controller('ConflictImportCtrl', function(Restangular){
        //
        var vm = this;
        vm.nations = [];
        vm.events = [];
        vm.sum = 0;

        vm.saveToDb = saveToDb;

        function saveToDb(){
          console.log(vm.nations);
          console.log(vm.events);
          var data = {
            nations: vm.nations,
            events : vm.events
          };
          Restangular.all('/conflicts/nations').post(data).then(function(data){

          });
        }

    });

})();
