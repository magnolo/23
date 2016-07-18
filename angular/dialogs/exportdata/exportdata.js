(function(){
    "use strict";

    angular.module('app.controllers').controller('ExportdataCtrl', function($scope, DialogService){

        $scope.save = function(){
            //
        };

        $scope.hide = function(){
        	DialogService.hide();
        };

    });

})();
