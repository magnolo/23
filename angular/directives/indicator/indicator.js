(function(){
	"use strict";

	angular.module( 'app.controllers' ).controller( 'IndicatorCtrl', function($scope, DataService, $filter){
		//
			var vm = this;

			vm.categories = [];
			vm.dataproviders = [];
			vm.selectedItem = null;
			vm.searchText = null;
			vm.querySearch = querySearch;
			vm.querySearchCategory = querySearchCategory;

	    activate();

	    function activate(){
	      loadAll();
	    }
			function querySearch(query) {
				return $filter('findbyname')(vm.dataproviders, query, 'title');
			}
			function querySearchCategory(query) {
				return $filter('findbyname')(vm.categories, query, 'title');
			}
			function loadAll() {
	      vm.dataproviders = DataService.getAll('dataproviders').$object;
				vm.categories = DataService.getAll('categories').$object;
				vm.measureTypes = DataService.getAll('measure_types').$object;
			}

			$scope.$watchCollection('vm.item', function(n, o){
					if(n === o){
						return;
					}
					console.log(n);
					if(n.title && n.measure_type_id && n.type && n.dataprovider){
						n.base = true;
					}
					else{
						n.base = false;
					};
			});
    });

})();
