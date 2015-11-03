(function(){
    "use strict";

    angular.module('app.controllers').controller('IndexcreatorCtrl', function($timeout, $filter, leafletData, VectorlayerService){
        //
        var vm = this;
        vm.map = null;
        vm.data = [];
        vm.search = search;
        vm.onOrderChange = onOrderChange;
        vm.onPaginationChange = onPaginationChange;
        vm.selected = [];
        vm.step = 0;
        vm.query = {
          filter: '',
          order: 'iso',
          limit: 15,
          page: 1
        };
        activate();
        function activate(){
          clearMap();
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
          return $filter('orderBy')(vm.data, [order], true)
        };
        function onPaginationChange(page, limit) {
          console.log(page, limit);
          //return $nutrition.desserts.get($scope.query, success).$promise;
        };
    });

})();
