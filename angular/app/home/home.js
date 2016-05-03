(function(){
    "use strict";

    angular.module('app.controllers').controller('HomeCtrl', function(DataService){
        var vm = this;
      
        DataService.getAll('index', {is_official: true}).then(function(response){
          vm.indizes = response;
        });

    });

})();
