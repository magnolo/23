(function(){
    "use strict";

    angular.module('app.controllers').controller('EditrowCtrl', function($scope, DialogService){
        $scope.data = $scope.$parent.vm.selected[0];
        $scope.save = function(){
            //
            console.log($scope.data);
        };

        $scope.hide = function(){
        	DialogService.hide();
        };

    });

})();
