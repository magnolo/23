(function() {
	"use strict";

	angular.module('app.controllers').controller('ExportDirectiveCtrl', function($scope, DataService,DialogService ) {
		//
		var vm = this;
		vm.original = angular.copy(vm.item);
		vm.checkBase = checkBase;
		vm.checkFull = checkFull;
		vm.getCode = getCode;

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
			saveClick: vm.options.exports.save,
			addClick: vm.options.exports.addClick,
			addContainerClick: vm.options.exports.addContainerClick,
			deleteDrop: vm.options.exports.deleteDrop,
			deleteClick: vm.options.exports.deleteClick,
			onDrop: vm.options.exports.onDrop,
			inserted: vm.options.exports.inserted,
			styleable: vm.options.styleable,
			styleClick: vm.options.style.click,
			hideExpansionOnItem:true,
			expandJustGroups: vm.options.expandJustGroups
		};
		activate();


		function activate() {
			//loadAll();
		}

		function checkBase() {

		}

		function checkFull() {

		}
		function getCode(){
			 DialogService.fromTemplate('embedcode', $scope);
		}

	});

})();
