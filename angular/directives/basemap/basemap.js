(function(){
	"use strict";

	angular.module( 'app.controllers' ).controller( 'BasemapCtrl', function(){
		//

		var vm = this;
		vm.original = angular.copy(vm.item);

		vm.baseOptions = {
			drag: false,
			allowDrop: false,
			allowDrag: false,
			allowMove: false,
			allowDelete: false,
			allowAddContainer: false,
			allowAdd: false,
			allowSave: true,
			editable: false,
			assigments: false,
			saveClick: vm.options.save,
			deleteClick: vm.options.deleteClick,

		};
    });

})();
