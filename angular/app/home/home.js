(function(){
    "use strict";

    angular.module('app.controllers').controller('HomeCtrl', function(DataService){
        var vm = this;
        DataService.getOne('index').then(function(response){
          vm.indizes = response.data;
        });

    });

})();
