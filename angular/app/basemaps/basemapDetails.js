(function(){
    "use strict";

    angular.module('app.controllers').controller('BasemapDetailsCtrl', function($state, BasemapsService){
        //
        var vm = this;
        vm.basemap = {}
        vm.selected = [];
        vm.options = {
          save: function(){
            console.log(vm.basemap);
          },
          withSave: true,
        };

        activate();

        function activate(){
          if($state.params.id != 0){
            BasemapsService.getBasemap($state.params.id, function(response){
              vm.basemap = response;
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
