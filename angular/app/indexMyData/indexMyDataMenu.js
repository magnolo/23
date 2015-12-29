(function(){
    "use strict";

    angular.module('app.controllers').controller('IndexMyDataMenuCtrl', function(UserService){
      var vm = this;
      vm.data = UserService.myData();
    });
})();
