/**
 * @ngdoc service
 * @name app.UserService
 * @requires app.DataService
 *
 * @description
 * Service for getting current user data
 *
 */

(function(){
    "use strict";

    angular.module('app.services').factory('UserService', function(DataService){
        //

        return {
          user:{
            data: []
          },
          myData: function(){
            return this.user.data = DataService.getAll('me/data');
          },
          myProfile: function(){

          },
          myFriends: function(){

          }
        }
    });

})();
