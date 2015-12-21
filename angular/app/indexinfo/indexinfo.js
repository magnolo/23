(function(){
    "use strict";
    angular.module('app.controllers').controller('IndexinfoCtrl', function(IndizesService){
        var vm = this;
        vm.structure = IndizesService.getStructure();
    });
})();
