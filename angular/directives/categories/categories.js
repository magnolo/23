(function(){
	"use strict";

	angular.module( 'app.controllers' ).controller( 'CategoriesCtrl', function($filter, toastr, DataService){
		//
		var vm = this;
		vm.saveCategory = saveCategory;
		vm.querySearchCategory = querySearchCategory;

		function querySearchCategory(query) {
			console.log($filter('flatten')(vm.categories));
			return $filter('findbyname')($filter('flatten')(vm.categories), query, 'title');
		}

		function saveCategory(valid){
			if(valid){
				DataService.post('categories', vm.category).then(function(data){
					vm.categories.push(data);
					vm.createCategory = false;
					vm.item.categories.push(data);
					toastr.success('New Category has been saved','Success');
				});
			}
		}
    });

})();
