(function(){
    "use strict";

    angular.module('app.controllers').controller('LoginCtrl', function($state, $auth, toastr){
        var vm = this;
        vm.doLogin = doLogin;
        vm.checkLoggedIn = checkLoggedIn;
        vm.user = {
          email:'',
          password:''
        };

        activate();

        function activate(){
          vm.checkLoggedIn();
        }

        function checkLoggedIn(){

          if($auth.isAuthenticated()){
            //$state.go('app.index.show', {index:'epi'});
          }
        }
        function doLogin(){
          $auth.login(vm.user).then(function(response){
            toastr.success('You have successfully signed in');
            console.log($auth.getPayload());
            $state.go('app.home');
          }).catch(function(response){
            toastr.error('Please check your email and password', 'Something went wrong');
          })
        }
    });

})();
