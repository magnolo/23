(function(){
    "use strict";

    angular.module('app.controllers').controller('AddYearCtrl', function($scope, DialogService){

        $scope.save = function(){
            console.log($scope.vm);
            $scope.vm.saveData();
            DialogService.hide();
        };

        $scope.hide = function(){
        	DialogService.hide();
        };

    });

})();
