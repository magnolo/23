(function(){
    "use strict";

    angular.module('app.controllers').controller('IndexcreatorCtrl', function($scope,$rootScope,DialogService, $timeout,$state, $filter, leafletData, ToastService, VectorlayerService){
        //
        var vm = this;
        vm.map = null;
        vm.data = [];
        vm.meta = {
          iso_field: '',
          table:[]
        };
        vm.selectedIndex = 0;
        vm.search = search;
        vm.deleteData = deleteData;
        vm.onOrderChange = onOrderChange;
        vm.onPaginationChange = onPaginationChange;
        vm.checkForErrors = checkForErrors;
        vm.clearErrors = clearErrors;
        vm.showUploadContainer = false;
        vm.openClose = openClose;
        vm.selected = [];
        vm.step = 0;
        vm.query = {
          filter: '',
          order: '-errors',
          limit: 15,
          page: 1
        };

        activate();

        function activate(){
          clearMap();
        }
        function openClose(active){
          return active ? 'remove' : 'add'; 
        }
        function clearLayerStyle(feature){
      			var style = {
              color:'rgba(255,255,255,0)',
              outline: {
    						color: 'rgba(255,255,255,0)',
    						size: 1
    					}
            };
      			return style;
        }
        function clearMap(){
          	leafletData.getMap('map').then(function (map) {
              vm.mvtSource = VectorlayerService.getLayer();
              $timeout(function(){
                vm.mvtSource.setStyle(clearLayerStyle);
              })
            });
        }
        function search(predicate) {
          vm.filter = predicate;
        };
        function onOrderChange(order) {
          return vm.data = $filter('orderBy')(vm.data, [order], true)
        };
        function onPaginationChange(page, limit) {
          //console.log(page, limit);
          //return $nutrition.desserts.get($scope.query, success).$promise;
        };
        function checkForErrors(item){
          return item.errors.length > 0 ? 'md-warn': '';
        }
        function clearErrors(){
          angular.forEach(vm.data, function(row, key){
            angular.forEach(row.data[0], function(item, k){
              if(item == "NA" || item < 0){
                vm.data[key].data[0][k] = '';
                vm.errors --;
                row.errors.splice(0,1);
              }
            });
          });

        }
        function deleteData(){
          vm.data = [];

        }
        $scope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {
          switch (toState.name) {
            case 'app.index.create':
                if(vm.data.length){
                  $scope.toState = toState;
                  DialogService.fromTemplate('loosedata', $scope, vm.deleteData);
                  event.preventDefault();
                  $rootScope.stateIsLoading = false;
                }
              break;
            case 'app.index.create.check':

              break;
            case 'app.index.create.meta':
                if(!vm.meta.iso_field){

                  ToastService.error('No field for ISO Code selected!');
                  event.preventDefault();
                   $rootScope.stateIsLoading = false;
                }
                break;
            default:

          }
        });
        $scope.$on("$stateChangeSuccess", function (event, toState, toParams, fromState, fromParams) {
          if(!vm.data.length){
            $state.go('app.index.create');
          }
          else{
            switch (toState.name) {
              case 'app.index.create':
                  vm.step = 0;
                break;
              case 'app.index.create.check':
                  vm.step = 1;
                  vm.showUploadContainer = false;
                break;
              case 'app.index.create.meta':
                  vm.step = 2
                  break;
              default:

            }
          }
        });
    });

})();
