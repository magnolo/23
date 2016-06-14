(function(){
    "use strict";

    angular.module('app.controllers').controller('ExportDetailsCtrl', function($scope, $state, ExportService){
        //
        var vm = this;
        vm.export = ExportService.exporter;

        vm.selected = [];
        vm.options = {
          exports:{
            onDrop: function(event, index, item, external){
              item.indicator_id = item.id;
              item.type = 'indicator';
            },
            inserted: function(event, index, item, external){

            },
            addClick: function(){
              $state.go('app.index.exports.details.add');
            },
    				addContainerClick:function(){
    					var item = {
                id:  Date.now(),
    						title: 'I am a group... name me',
                type:'group'
    					};
    					vm.export.items.push(item);

    				},
    				deleteClick:function(){
    					angular.forEach(vm.selected,function(item, key){
    							removeItem(item,vm.export.items);
                  //ExportService.removeItem(vm,item.id);
    							vm.selected = [];
    					});
    				},
    				deleteDrop: function(event,item,external,type){
    						removeItem(item,vm.export.items);
    						vm.selection = [];
    				},
            save: function(){
              ExportService.save(function(response){
                if(vm.export.id == 0 || !vm.export.id){
                  $state.go('app.index.exports.details',{id:response.id, name:response.name});
                }
              });
              // if(vm.export.id == 0 || ! vm.export.id){
              //   DataService.post('exports', vm.export).then(function(){
              //
              //   });
              // }
              // else{
              //   vm.item.save().then(function(response){
              //
              //   });
              // }
            }
          },
          style:{
            click: function(item){
              $state.go('app.index.exports.details.style',{styleId:item.id, styleName:item.name})
            }
          },
          withSave: true,
          styleable: true,
          expandJustGroups: true
        };

        activate();

        function activate(){
          if($state.params.id != 0){
            ExportService.getExport($state.params.id, function(exporter) {
              vm.export = exporter;
              console.log(vm.export);
            });
          }
          else{
            vm.export = ExportService.setExport({
              items: []
            });
          }

        }
        function removeItem(item, list){
    			angular.forEach(list, function(entry, key){
    				if(entry.id == item.id){
    					list.splice(key, 1);
    					return true;
    				}
    				if(entry.children){
    					var subresult = removeItem(item, entry.children);
    					if(subresult){
    						return subresult;
    					}
    				}
    			});
    			return false;
    		}
    });

})();
