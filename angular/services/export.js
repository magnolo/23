(function(){
    "use strict";

    angular.module('app.services').service('ExportService', function(DataService, toastr){
          var vm = this;
          this.exports = [],
          this.exporter = {},
          this.getExports = function(success, error){

            DataService.getAll('exports').then(function(response){
              vm.exports = response;
              if(typeof success === 'function')
              success(vm.exports);
            }, error);
          },
          this.getExport = function(id, success, error){
            if(vm.exporter.id == id){
              if(typeof success === 'function')
              success(vm.exporter);
            }
            else{
              DataService.getOne('exports', id).then(function(response){
                vm.exporter = response;
                if(typeof success === 'function')
                success(vm.exporter);
    
              });
            }

          },
          this.setExport = function(data){
            return vm.exporter = data;
          },
          this.save = function(success, error){
            if(vm.exporter.id == 0 || !vm.exporter.id){
              DataService.post('exports', vm.exporter).then(function(response){
                toastr.success('Successfully created');
                if(typeof success === 'function')
                success(response);
              },function(response){
                toastr.error('Something went wrong!');
                if(typeof error === 'function')
                error(response);
              });
            }
            else{

             vm.exporter.save().then(function(response){
                if(typeof success === 'function')
                toastr.success('Save successfully');
                success(response);
              },function(response){
                  toastr.error('Something went wrong!');
                if(typeof error === 'function')
                error(response);
              });
            }
          },
          this.removeItem = function(id, success, error){
            DataService.remove('exports', id).then(function(response){
              if(typeof success === 'function')
              toastr.success('Successfully deleted');
              success(response);
            }, function(response){
              if(typeof error === 'function')
              error(response);
            })
          }

    });

})();
