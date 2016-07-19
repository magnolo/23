(function(){
	"use strict";

	angular.module( 'app.controllers' ).controller( 'StyleSingleCtrl', function(toastr, DataService){
		var vm = this;

		vm.saveStyle = saveStyle;
		vm.style = {};

		function saveStyle() {
			DataService.post('styles', vm.item).then(function (data) {
				vm.styles.push(data);
				vm.createStyle = false;
				vm.style = {};
				//vm.item.style = data;
				toastr.success('New Style has been saved', 'Success');
			});
		}
    });

})();
