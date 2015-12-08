(function(){
    "use strict";

    angular.module('app.controllers').controller('EditrowCtrl', function($scope, DialogService){
        $scope.data = $scope.$parent.vm.selected[0];
        $scope.save = function(){
            //
            DialogService.hide();
        };

        $scope.hide = function(){
        	DialogService.hide();
        };

    });

})();
