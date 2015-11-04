(function(){
    "use strict";

    angular.module('app.controllers').controller('LoosedataCtrl', function($scope, $state, DialogService){

        $scope.save = function(){
            //
            $scope.vm.deleteData();
            $state.go($scope.toState.name);
            DialogService.hide();
        };

        $scope.hide = function(){
        	DialogService.hide();
        };

    });

})();
