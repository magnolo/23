(function(){
    "use strict";

    angular.module('app.services').factory('DataService', DataService);
    DataService.$inject = ['Restangular'];

    function DataService(Restangular){
        return {
          getAll: getAll,
          getOne: getOne
        };

        function getAll(route){
          return Restangular.all(route).getList();
        }
        function getOne(route, id){
          return Restangular.one(route, id).get();
        }
    }

})();
