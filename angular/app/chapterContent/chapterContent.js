(function(){
    "use strict";

    angular.module('app.controllers').controller('ChapterContentCtrl', function($scope, $timeout, $state,DataService,countries, ExportService,IndizesService, DialogService,VectorlayerService){
        //
        var vm = this;
        vm.showInfo = showInfo;
        vm.compare = false;
        vm.chapterId = $state.params.chapter;
        vm.selectedIndicator = 0;
        vm.current = {};
        vm.countriesList = [];
        vm.ExportService = ExportService;
        vm.countries = countries.plain();
        vm.selectCountry = selectCountry;
        vm.circleOptions = {};
        vm.calcRank = calcRank;
        vm.gotoIndicator = gotoIndicator;
        VectorlayerService.countryClick(function(data, bla){
          if(vm.compare){
            var cl = null;
            angular.forEach(vm.data, function(nat){
              if(nat.iso == data.feature.id){
                cl = nat;
              }
            })
            if(cl)
              vm.countriesList.push(cl);
          }
          else{
            $state.go('app.export.detail.chapter.indicator.country',{
              iso:data.feature.id
            });
            fetchNationData(data.feature.id);
          }

        });

        function getIndicator(){
            vm.ExportService.getIndicator($state.params.id, $state.params.chapter, $state.params.indicator, function(chapter, indicator){
              vm.selectedIndicator = indicator;
              renderIndicator(indicator, function(){
                if($state.params.iso){
                  fetchNationData($state.params.iso);
                }
              });
          });
        }

        function gotoIndicator(){
          $state.go('app.export.detail.chapter.indicator',{
            indicator:vm.selectedIndicator.indicator_id,
            indiname: vm.selectedIndicator.name
          });

          getIndicator();
        }
        function selectCountry(){
          var iso = getCountryByName(vm.nation);
          $state.go('app.export.detail.chapter.indicator.country',{
            iso:iso
          });
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
            calcRank();
          });
        }
        function renderIndicator(item, done){
          vm.index = IndizesService.fetchData(item.indicator_id);
          vm.index.promises.data.then(function(structure) {
            vm.index.promises.structure.then(function(data) {
              vm.data = structure;
              vm.structure = data;
              VectorlayerService.setBaseLayer(item.style.basemap);
              VectorlayerService.setData(vm.data,vm.structure,item.style.base_color, true);
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
                if(typeof done == "function"){
                  done();
                }
              })
            });
          });
        }
        function calcRank() {
    			var rank = 0;
    			var kack = [];
    			angular.forEach(vm.data, function(item, key) {
    				item[vm.structure.name] = parseFloat(item[vm.structure.name]);
    				item['score'] = parseFloat(item[vm.structure.name]);
            if(item.iso == vm.current.iso){
              rank = key+1;
            }
    			});
    			//vm.data = $filter('orderBy')(vm.data, 'score', 'iso', true);
    			//rank = vm.data.indexOf(vm.current) + 1;
    			vm.current[vm.structure.name + '_rank'] = rank;
    			vm.circleOptions = {
    				color: vm.ExportService.indicator.style.base_color || '#00ccaa',
    				field: vm.structure.name + '_rank',
    				size: vm.data.length,
            hideNumbering: true
    			};
    			return rank;
    		}
        function showInfo(){
            DialogService.fromTemplate('export', $scope);
        }

        getIndicator();
    });

})();
