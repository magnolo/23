(function(){
	"use strict";

	angular.module( 'app.controllers' ).controller( 'StyleSingleCtrl', function(toastr, StyleService){
		var vm = this;

		vm.saveStyle = saveStyle;
		vm.style = {};

		function saveStyle() {
			console.log(vm.item);
			if (typeof vm.item.id === 'undefined')
				StyleService.saveStyle(vm.item).then(function (data) {
					vm.styles.push(data);
					//vm.createStyle = false;
					//vm.style = {};
					toastr.success('New Style has been saved', 'Success');
					vm.options.postDone(data);
				});
			else
				updateStyle();
		}

		function updateStyle() {
			StyleService.updateStyle(vm.item.id, vm.item).then(function (data) {
				vm.createStyle = false;
				vm.style = {};
				toastr.success('Style has been updated', 'Success');
			});
		}
		
    });

})();
