(function(){
    "use strict";

    angular.module('app.controllers').controller('IndexFinalMenuCtrl', function(IndexService){
      var vm = this;
      vm.data = IndexService.getData();
      vm.meta = IndexService.getMeta();
      vm.indicators = IndexService.getIndicators();
      vm.indicatorsLength = Object.keys(vm.indicators).length;

    });
})();
