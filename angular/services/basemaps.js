(function(){
    "use strict";

    angular.module('app.services').factory('BasemapsService', function(DataService, toastr){
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
            DataService.getOne('basemaps',id).then(function(response){
              _that.basemap = response;
              if(typeof success === 'function')
              success(_that.basemap);
            });
          },
          setBasemap: function(data){
            return this.basemap = data;
          },
          save: function(basemap, success, error){
            if(basemap.id == 0 || !basemap.id){
              DataService.post('basemaps', basemap).then(function(response){
                toastr.success('New Basemap successfully created');
                if(typeof success === 'function')
                success(response);
              },function(response){
                toastr.error('Saving error');
                if(typeof error === 'function')
                error(response);
              });
            }
            else{
              basemap.save().then(function(response){
                toastr.success('Save successful');
                if(typeof success === 'function')
                success(response);
              },function(response){
                toastr.error('Saving error');
                if(typeof error === 'function')
                error(response);
              });
            }
          },
          removeItem: function(id, success, error){
            DataService.remove('basemaps', id).then(function(response){
              toastr.success('Deletion successful');
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
