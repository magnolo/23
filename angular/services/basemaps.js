/**
 * @ngdoc service
 * @name app.BasemapsService
 * @requires app.DataService
 * @requires toastr
 *
 * @description
 * Service factory that provides CRUD for basemaps
 */

(function(){
    "use strict";

    angular.module('app.services').factory('BasemapsService', function(DataService, toastr){
        //
        return {
          basemaps:[],
          basemap:{},

          /**
           * @ngdoc method
           * @name app.BasemapsService#getBasemaps
           * @methodOf app.BasemapsService
           *
           * @description
           * Fetches all basemaps
           *
           * @param {function} success Will be executed over data, if fetch of basemaps was successful
           * @param {string} error error message
             */
          getBasemaps: function(success, error){
            var _that = this;
            DataService.getAll('basemaps').then(function(response){
              _that.basemaps = response;
              if(typeof success === 'function')
              success(_that.basemaps);
            }, error);
          },

          /**
           * @ngdoc method
           * @name app.BasemapsService#getBasemap
           * @methodOf app.BasemapsService
           *
           * @description
           * Fetches specific basemap
           *
           * @param {string} id id of basemap that will be fetched
           * @param {function} success will be executed over data, if fetch was successful
           * @param {string} error unused
           */
          getBasemap: function(id, success, error){
            var _that = this;
            DataService.getOne('basemaps',id).then(function(response){
              _that.basemap = response;
              if(typeof success === 'function')
              success(_that.basemap);
            });
          },

          /**
           * @ngdoc method
           * @name app.BasemapsService#setBasemap
           * @methodOf app.BasemapsService
           *
           * @description
           * Sets basemap variable in BasemapsService singleton
           *
           * @param {object} data data parameter
           * @returns {object} given parameter
           */
          setBasemap: function(data){
            return this.basemap = data;
          },

            /**
             * @ngdoc method
             * @name app.BasemapsService#save
             * @methodOf app.BasemapsService
             *
             * @description
             * Save basemap to database
             *
             * @param {object} basemap basemap object that should be saved in database
             * @param {function} success callback function if save successful
             * @param {error} error callback function if save not successful
             */
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

            /**
             * @ngdoc method
             * @name app.BasemapsService#removeItem
             * @methodOf app.BasemapsService
             *
             * @description
             * Remove basemap from database
             *
             * @param {string} id basemap id to be removed from database
             * @param {function} success callback function if successfully removed
             * @param {function} error callback function if remove unsuccessful
             */
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
