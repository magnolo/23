(function(){
    "use strict";

    angular.module('app.controllers').controller('ChapterContentCtrl', function($scope, $timeout, $state,DataService,countries, ExportService,IndizesService, DialogService,VectorlayerService){
        //
        var vm = this;
        vm.showInfo = showInfo;
        vm.chapterId = $state.params.chapter;
        vm.current = {};
        vm.ExportService = ExportService;
        vm.countries = countries.plain();
        vm.selectCountry = selectCountry;
        vm.circleOptions = {};
        vm.ExportService.getIndicator($state.params.id, $state.params.chapter, $state.params.indicator, function(chapter, indicator){
    				renderIndicator(indicator);
        });
        VectorlayerService.countryClick(function(data, bla){
          $state.go('app.export.detail.chapter.indicator.country',{
            iso:data.feature.id
          });
        });
        function selectCountry(){
          var iso = getCountryByName(vm.nation);
          fetchNationData(iso);
        }
        function getCountryByName(name){
          var iso = null;
          angular.forEach(vm.countries, function(nat,key){
            if(nat == name){
              iso = key;
            }
          });
          return iso;
        }
        function fetchNationData(iso){
          IndizesService.fetchNationData(vm.ExportService.indicator.indicator_id, iso, function(data){
            vm.nation = vm.countries[iso];
            vm.current = data;
          });
        }
        function renderIndicator(item){
          vm.index = IndizesService.fetchData(item.indicator_id);
          vm.index.promises.data.then(function(structure) {
            vm.index.promises.structure.then(function(data) {
              vm.data = data;
              vm.structure = structure;
              VectorlayerService.setBaseLayer(item.style.basemap);
              VectorlayerService.setData(vm.structure,vm.data,item.style.base_color, true);
              $timeout(function(){
                vm.circleOptions = {
          				color: vm.ExportService.indicator.style.base_color || '#00ccaa',
          				field: vm.structure.name + '_rank',
          				size: vm.data.length
          			};
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
        $scope.$watch('vm.ExportService.indicator', function(n,o){
            if(n === o) return false;
            console.log(n);
            renderIndicator(n);
        });
        $scope.$watch('vm.color', function(n,o){
            if(n === o) return false;
            console.log(n);
        });
        $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
          fetchNationData(toParams.iso);
        });
    });

})();
