(function(){
    "use strict";

    angular.module('app.controllers').controller('ExportDialogCtrl', function($scope, DialogService){

        console.log($scope);
        $scope.hide = function(){

        	DialogService.hide();
        };

    });

})();
