(function(){
    "use strict";

    angular.module('app.controllers').controller('HeaderMainCtrl', function(){
        //
        var originatorEv;
        this.openMenu = function($mdOpenMenu, ev) {
          originatorEv = ev;
          $mdOpenMenu(ev);
        };
    });

})();
