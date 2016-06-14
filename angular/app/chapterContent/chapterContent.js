(function(){
    "use strict";

    angular.module('app.controllers').controller('ChapterContentCtrl', function($scope, $timeout, $state,DataService, ExportService,IndizesService, DialogService,VectorlayerService){
        //
        var vm = this;
        vm.showInfo = showInfo;
        vm.chapterId = $state.params.chapter;
        vm.current = {};

        VectorlayerService.countryClick(function(data, bla){
          $state.go('app.export.detail.chapter.indicator.country',{
            iso:data.feature.id
          });
        });
        ExportService.getExport($state.params.id, function(exporter){
            vm.exporter = exporter;
            vm.chapter = getChapter(vm.chapterId);
            vm.item = getFirstIndicator(vm.chapter.children);
    				renderIndicator(vm.item);
        });

        function fetchNationData(iso){
          IndizesService.fetchNationData(vm.item.indicator_id, iso, function(data){
            vm.current = data;
          });
        }
        function renderIndicator(item){
          vm.index = IndizesService.fetchData(item.indicator_id);
          vm.index.promises.data.then(function(structure) {
            vm.index.promises.structure.then(function(data) {
              vm.data = data;
              vm.structure = structure;
              VectorlayerService.setBaseLayer(vm.item.style.basemap);
              VectorlayerService.setData(vm.structure,vm.data,vm.item.style.base_color, true);
              $timeout(function(){
                if($state.params.iso){
                  $state.go('app.export.detail.chapter.indicator.country',{
                    indicator:item.indicator_id,
                    indiname: item.indicator.name,
                    iso:vm.current.iso
                  });
                }
                else{
                  $state.go('app.export.detail.chapter.indicator',{
                    indicator:item.indicator_id,
                    indiname: item.indicator.name
                  });
                }

              })

            });
          });
        }
        function showInfo(){
            DialogService.fromTemplate('export', $scope);
        }
        function getChapter(id){
            return vm.exporter.items[id-1];
        }
        function getFirstIndicator(list){
          var found = null;
          angular.forEach(list, function(item){
            if(item.type == 'indicator'){
              found =  item;
            }
            else{
              if(!found){
                found = getFirstIndicator(item.children);
              }
            }
          });
          return found;
        }
        $scope.$watch('vm.item', function(n,o){
            if(n === o) return false;
            console.log(n);
            renderIndicator(n);
        });
        $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
          fetchNationData(toParams.iso);
        });
    });

})();
