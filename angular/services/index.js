/**
 * @ngdoc service
 * @name app.IndexService
 * @requires CacheFactory
 * @requires $state
 *
 * @description
 * Service for indexes, set and getting errors, iso, country and meta data
 * STILL NEEDS METHOD DOCUMENTATION
 */

(function(){
    "use strict";

	angular.module('app.services').factory('IndexService', function(CacheFactory, DataService, $state) {
		//
		var serviceData = {
				data: [],
				errors: [],
				iso_errors: [],
				meta: {
					iso_field: '',
					country_field: '',
					year_field: '',
					gender_field: '',
					table: []
				},
				indicators: {},
				toSelect: []
			},
			storage, importCache, indicator;

        if (!CacheFactory.get('importData')) {
          importCache = CacheFactory('importData', {
            cacheFlushInterval: 60 * 60 * 1000, // This cache will clear itself every hour.
            deleteOnExpire: 'aggressive', // Items will be deleted from this cache right when they expire.
            storageMode: 'localStorage' // This cache will use `localStorage`.
          });
          serviceData = importCache.get('dataToImport');
        }
        else{
          importCache = CacheFactory.get('importData');
          storage = importCache.get('dataToImport');
        }
        return {
            /**
             * @ngdoc method
             * @name app.IndexService#clear
             * @methodOf app.IndexService
             *
             * @description
             * Clears out data in IndexService instance to standard format
             *
             * @returns {object} Emptied service data object
             */
          clear:function(){
            $state.go('app.index.create');
            if(CacheFactory.get('importData')){
                importCache.remove('dataToImport');
            }
            return serviceData= {
                data: [],
                errors: [],
                iso_errors:[],
                meta:{
                  iso_field: '',
                  country_field:'',
                  year_field:'',
                  gender_field:''
                },
                toSelect:[],
                indicators:{}
            };
          },

            /**
             * @ngdoc method
             * @name app.IndexService#addData
             * @methodOf app.IndexService
             *
             * @param {object} item item to be added to data array
             * @returns {object} pushed item
             */
          addData:function(item){
            return serviceData.data.push(item);
          },
            /**
             * @ngdoc method
             * @name app.IndexService#addIndicator
             * @methodOf app.IndexService
             *
             * @param {object} item item to be added to indicators array
             * @returns {object} pushed item
             */
          addIndicator: function(item){
            return serviceData.indicators.push(item);
          },
            /**
             * @ngdoc method
             * @name app.IndexService#addToSelect
             * @methodOf app.IndexService
             *
             * @param {object} item item to be added to toSelect array
             * @returns {object} pushed item
             */
          addToSelect: function(item){
            return serviceData.toSelect.push(item);
          },
            /**
             * @ngdoc method
             * @name app.IndexService#addIsoError
             * @methodOf app.IndexService
             *
             * @param {object} item item to be added to iso_errors array
             * @returns {object} pushed item
             */
          addIsoError: function(error){
            return serviceData.iso_errors.push(error);
          },
            /**
             * @ngdoc method
             * @name app.IndexService#removeToSelect
             * @methodOf app.IndexService
             *
             * @param {object} item item to be removed from toSelect array
             * @returns {boolean} if remove successful
             */
          removeToSelect: function(item){
            var index = serviceData.toSelect.indexOf(item);
            return index > -1 ? serviceData.toSelect.splice(index, 1) : false;
          },
            /**
             * @ngdoc method
             * @name app.IndexService#addData
             * @methodOf app.IndexService
             *
             * @param {object} item item to be added to data array
             * @returns {object} pushed item
             */
          setData: function(data){
            return serviceData.data = data;
          },
          setIsoField: function(key){
            return serviceData.meta.iso_field = key;
          },
          setCountryField: function(key){
            return serviceData.meta.country_field = key;
          },
          setGenderField: function(key){
            return serviceData.meta.gender_field = key;
          },
          setYearField: function(key){
            return serviceData.meta.year_field = key;
          },
          setErrors: function(errors){
            return serviceData.errors = errors;
          },
          setToLocalStorage: function(){
            //console.log(serviceData);
          importCache.put('dataToImport',serviceData);
          },
          setIndicator: function(key, item){
            return serviceData.indicators[key] = item;
          },
          setActiveIndicatorData: function(item){
            return indicator = serviceData.indicators[item.column_name] = item;
          },
          getFromLocalStorage: function(){
            return serviceData = importCache.get('dataToImport');
          },
          getFullData: function(){
            return serviceData;
          },
          getData: function(){
            if(typeof serviceData == "undefined") return false;
            return serviceData.data;
          },
          getMeta: function(){
            if(typeof serviceData == "undefined") return false;
            return serviceData.meta;
          },
          getToSelect: function(){
            return serviceData.toSelect;
          },
          getIsoField: function(){
            return serviceData.meta.iso_field;
          },
          getCountryField: function(){
            return serviceData.meta.country_field;
          },
          getErrors: function(){
            if(typeof serviceData == "undefined") return false;
            return serviceData.errors;
          },
          getIsoErrors: function(){
            if(typeof serviceData == "undefined") return false;
            return serviceData.iso_errors;
          },
          getFirstEntry: function(){
            return serviceData.data[0];
          },
          getDataSize: function(){
            return serviceData.data.length;
          },
          getIndicator: function(key){
            return indicator = serviceData.indicators[key];
          },
          getIndicators: function(){
            if(typeof serviceData == "undefined") return false;
            return serviceData.indicators;
          },
          activeIndicator: function(){
            return indicator;
          },
          resetIndicator:function(){
            return indicator = null;
          },
          reduceIsoError:function(){
            return serviceData.iso_errors.splice(0,1);
          },
          reduceError:function(){
            return serviceData.errors.splice(0,1);
          },
          resetToSelect: function(){
            return serviceData.toSelect = [];
          },
          resetLocalStorage: function(){
            if(CacheFactory.get('importData')){
                importCache.remove('dataToImport');
            }
            return serviceData= {
                data: [],
                errors: [],
                iso_errors:[],
                meta:{
                  iso_field: '',
                  country_field:'',
                  year_field:''
                },
                toSelect:[],
                indicators:{}
            };
          },
			fetchNationData: function(indicator, iso, success) {
				return DataService.getOne('indicators/' + indicator + "/history", iso).then(function(data) {
					success(data);
				});
			}
        }
    });

})();
