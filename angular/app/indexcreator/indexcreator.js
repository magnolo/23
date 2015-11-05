(function(){
    "use strict";

    angular.module('app.controllers').controller('IndexcreatorCtrl', function($scope,$rootScope,DialogService, $timeout,$state, $filter, leafletData, toastr, VectorlayerService){
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
        vm.deleteSelected = deleteSelected;
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
              if(isNaN(item) || item < 0)
              if(item == "NA" || item < 0 || item.indexOf('#N/A') > -1){
                vm.data[key].data[0][k] = '';
                vm.errors --;
                row.errors.splice(0,1);
              }
            });
          });

        }
        function deleteSelected(){
          console.log(vm.selected);
          angular.forEach(vm.selected, function(item, key){
            vm.data.splice(vm.data.indexOf(item), 1);
            vm.selected.splice(key, 1);
          });
          if(vm.data.length == 0){
            vm.deleteData();
            $state.got('app.index.create');
          }
        }
        function deleteData(){
          vm.data = [];

        }
        $scope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {
          switch (toState.name) {

            case 'app.index.create.check':

              break;
            case 'app.index.create.meta':
                if(!vm.meta.iso_field){

                  toastr.error('No field for ISO Code selected!', 'Error');
                  event.preventDefault();
                   $rootScope.stateIsLoading = false;
                }
                break;
            default:

                if(vm.data.length){ 
                  $scope.toState = toState;
                  DialogService.fromTemplate('loosedata', $scope, vm.deleteData);
                  event.preventDefault();
                  $rootScope.stateIsLoading = false;
                }

              break;

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
