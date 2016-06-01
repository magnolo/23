(function(){
    "use strict";

    angular.module('app.controllers').controller('ExportCtrl', function($state){
        //
        var vm = this;
        vm.exports = [];
        vm.options = {
            drag:false,
            type:'exports',
            allowMove:false,
            allowDrop:false,
            allowAdd:true,
            allowDelete:true,
            itemClick: function(id, name){
              $state.go('app.index.exports.indizes.data', {id:id, name:name})
            },
            addClick:function(){
              $state.go('app.index.exports.details', {id:0, name: 'new'})
            },
            deleteClick:function(){
              angular.forEach(vm.selection.indices,function(item, key){
                ContentService.removeItem(item.id).then(function(data){
                  if($state.params.id == item.id){
                    $state.go('app.index.editor.indizes');
                  }
                  vm.selection.indices = [];
                });
              });
              //$state.go('app.index.editor.indizes');
            }
          };

    });

})();
