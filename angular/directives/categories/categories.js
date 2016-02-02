(function () {
	"use strict";

	angular.module('app.controllers').controller('CategoriesCtrl', function ($filter, toastr, DataService) {
		//
		var vm = this;
		vm.catOptions = {
			abort: function(){
				vm.createCategory = false;
			},
			postDone:function(category){
				vm.createCategory = false;
			}
		}

	});

})();
