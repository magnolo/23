(function() {
	"use strict";

	angular.module('app.controllers').controller('ExportDirectiveCtrl', function(DataService) {
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
			addClick: vm.options.exports.addClick,
			addContainerClick: vm.options.exports.addContainerClick,
			deleteDrop: vm.options.exports.deleteDrop,
			deleteClick: vm.options.exports.deleteClick,
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
			if(vm.item.id == 0 || ! vm.item.id){
				DataService.post('exports', vm.item).then(function(){

				});
			}
			else{
				vm.item.save().then(function(response){

				});
			}
		}
	});

})();
