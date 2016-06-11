(function(){
    "use strict";

    angular.module('app.services').factory('ExportService', function(DataService, toastr){

        return {
          exports:[],
          exporter:{},
          getExports: function(success, error){
            var _that = this;
            DataService.getAll('exports').then(function(response){
              _that.exports = response;
              if(typeof success === 'function')
              success(_that.exports);
            }, error);
          },
          getExport: function(id, success, error){
            var _that = this;
            DataService.getOne('exports', id).then(function(response){
              _that.exporter = response;
              if(typeof success === 'function')
              success(_that.exporter);
            });
          },
          setExport: function(data){
            return this.exporter = data;
          },
          save: function(success, error){
            if(this.exporter.id == 0 || !this.exporter.id){
              DataService.post('exports', this.exporter).then(function(response){
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

             this.exporter.save().then(function(response){
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
          removeItem: function(id, success, error){
            DataService.remove('exports', id).then(function(response){
              if(typeof success === 'function')
              toastr.success('Successfully deleted');
              success(response);
            }, function(response){
              if(typeof error === 'function')
              error(response);
            })
          }
        }
    });

})();
