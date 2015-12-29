(function(){
    "use strict";

    angular.module('app.controllers').controller('IndexFinalCtrl', function(IndexService, DataService, toastr){
        //
        var vm = this;
        vm.data = IndexService.getData();
        vm.meta = IndexService.getMeta();
        vm.errors = IndexService.getErrors();
        vm.indicators = IndexService.getIndicators();
        vm.saveData = saveData;

        function saveData(){
          var insertData = {data:[]};
          var insertMeta = [], fields = [];
          angular.forEach(vm.data, function(item, key){
            if(item.errors.length == 0){
              item.data[0].year = vm.meta.year;
              console.log(item.data[0]);
              vm.meta.iso_type = item.data[0][vm.meta.iso_field].length == 3 ? 'iso-3166-1' : 'iso-3166-2';
              insertData.data.push(item.data[0]);
            }
            else{
              toastr.error('There are some errors left!', 'Huch!');
              return;
            }
          });
          angular.forEach(vm.indicators, function(item, key){
              var field = {
                'column': key,
                'title':vm.indicators[key].title,
                'description':vm.indicators[key].description,
                'measure_type_id':vm.indicators[key].measure_type_id || 0,
                'is_public': vm.indicators[key].is_public || 0,
                'dataprovider_id': vm.indicators[key].dataprovider.id || 0
              };
              var categories = [];
              angular.forEach(vm.indicators[key].categories, function(cat){
                categories.push(cat.id);
              });
              field.categories = categories;
              fields.push(field);
          });
          /*angular.forEach(vm.data.table, function(item, key){
            insertMeta.push({
              field:key,
              data: item
            })
          })*/
          vm.meta.fields = fields;
          console.log(vm.meta);
          DataService.post('data/tables', vm.meta).then(function(response){
              DataService.post('data/tables/'+response.table_name+'/insert', insertData).then(function(res){
                if(res == true){
                  toastr.success(insertData.data.length+' items importet to '+vm.meta.name,'Success');
                  IndexService.clear();
                  $state.go('app.index.mydata');
                  vm.data = [];
                  vm.step = 0;
                }
              });
          }, function(response){
            if(response.message){
              toastr.error(response.message, 'Ouch!');
            }
          })
        }
    });

})();
