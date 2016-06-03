(function(){
    "use strict";

    angular.module('app.services').factory('ExportService', function(DataService){

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
            DataService.getOne('exports/'+id).then(function(response){
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
                if(typeof success === 'function')
                success(response);
              },function(response){
                if(typeof error === 'function')
                error(response);
              });
            }
            else{
              this.exporter.save().then(function(response){
                if(typeof success === 'function')
                success(response);
              },function(response){
                if(typeof error === 'function')
                error(response);
              });
            }
          },
          remove: function(id, success, error){
            DataService.remove('exports', id).then(function(response){
              if(typeof success === 'function')
              success(response);
            }, function(response){
              if(typeof error === 'function')
              error(response);
            })
          }
        }
    });

})();
