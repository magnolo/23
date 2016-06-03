(function(){
    "use strict";

    angular.module('app.services').factory('BasemapsService', function(DataService){
        //
        return {
          basemaps:[],
          basemap:{},
          getBasemaps: function(success, error){
            var _that = this;
            DataService.getAll('basemaps').then(function(response){
              _that.basemaps = response;
              if(typeof success === 'function')
              success(_that.basemaps);
            }, error);
          },
          getBasemap: function(id, success, error){
            var _that = this;
            DataService.getOne('basemaps/'+id).then(function(response){
              _that.basemap = response;
              if(typeof success === 'function')
              success(_that.basemap);
            });
          },
          setBasemap: function(data){
            return this.basemap = data;
          },
          save: function(success, error){
            if(this.basemap.id == 0 || !this.basemap.id){
              DataService.post('basemaps', basemap).then(function(response){
                if(typeof success === 'function')
                success(response);
              },function(response){
                if(typeof error === 'function')
                error(response);
              });
            }
            else{
              this.basemap.save().then(function(response){
                if(typeof success === 'function')
                success(response);
              },function(response){
                if(typeof error === 'function')
                error(response);
              });
            }
          },
          remove: function(id, success, error){
            DataService.remove('basemaps', id).then(function(response){
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
