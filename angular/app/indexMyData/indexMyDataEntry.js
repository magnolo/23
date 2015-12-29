(function(){
    "use strict";

    angular.module('app.controllers').controller('IndexMyDataEntryCtrl', function(UserService){
      var vm = this;
      vm.data = UserService.myData();
    });
})();
