(function(){
    "use strict";

    angular.module('app.controllers').controller('GradientLabelsCtrl', function($scope, DialogService){

        $scope.save = function(){
            //
        };

        $scope.hide = function(){
        	DialogService.hide();
        };

    });

})();
