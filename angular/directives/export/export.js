(function() {
	"use strict";

	angular.module('app.controllers').controller('ExportDirectiveCtrl', function() {
		//
		var vm = this;
		vm.original = angular.copy(vm.item);
		vm.checkBase = checkBase;
		vm.checkFull = checkFull;
		vm.save = save;

		vm.baseOptions = {
			drag: true,
			allowDrop: true,
			allowDrag: true,
			allowMove: true,
			allowSave: true,
			allowDelete: true,
			allowAddContainer: true,
			allowAdd: true,
			editable: true,
			assigments: false,
			saveClick: save,
			addClick: vm.options.indizes.addClick,
			addContainerClick: vm.options.indizes.addContainerClick,
			deleteDrop: vm.options.indizes.deleteDrop,
			deleteClick: vm.options.indizes.deleteClick,
			styleable:vm.options.styleable,
			styleClick: vm.options.style.click
		};
		activate();


		function activate() {
			//loadAll();
		}

		function checkBase() {

		}

		function checkFull() {

		}
		function save(){

		}
	});

})();
