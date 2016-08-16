(function() {
	"use strict";

	angular.module('app.controllers').controller('TreeviewCtrl', function($filter) {
		//
		var vm = this;
		vm.selectedItem = selectedItem;
		vm.childSelected = childSelected;
		vm.toggleSelection = toggleSelection;
		vm.onDragOver = onDragOver;
		vm.onDropComplete = onDropComplete;
		vm.onMovedComplete = onMovedComplete;
		vm.addChildren = addChildren;

		activate();

		function activate() {
			if (typeof vm.options == "undefined") {
				vm.options = {
					editWeight: false,
					drag: false,
					edit: false,
					children: 'children'
				}
			}
			if (typeof vm.options.children == "undefined") {
				vm.options.children = "children";
			}
			if (typeof vm.selection == "undefined") {
				vm.selection = [];
			}
		}

		function onDragOver(event, index, external, type) {
			return true;
		}

		function onDropComplete(event, index, item, external) {
			angular.forEach(vm.items, function(entry, key) {
				if (entry.id == 0) {
					vm.items.splice(key, 1);
				}
			})
			return item;
		}

		function onMovedComplete(index, data, evt) {
			if (vm.options.allowMove) {
				return vm.items.splice(index, 1);
			}
		}

		function toggleSelection(item) {
			var index = -1;
			angular.forEach(vm.selection, function(selected, i) {
				if (selected.id == item.id) {
					index = i;
				}
			});
			if (index > -1) {
				vm.selection.splice(index, 1);
			} else {
				vm.selection.push(item);
			}
			if (typeof vm.options.selectionChanged == 'function')
				vm.options.selectionChanged();
		}

		function addChildren(item) {

			item[vm.options.children] = [];
			item.expanded = true;
		}

		function selectedItem(item) {
			var found = false;
			angular.forEach(vm.selection, function(selected) {
				if (selected.id == item.id) {
					found = true;
				}
			});
			return found;
			/*	if(vm.selection.indexOf(angular.copy(item)) > -1){
					return true;
				}
				return false;*/
		}

		function childSelected(item) {
			var found = false;
			angular.forEach(item.children, function(child) {
				if (vm.selection.indexOf(child) > -1) {
					found = true;
				}
				if (!found) {
					found = childSelected(child);

				}
			})
			return found;
		}

		/*function toggleItem(item) {
			if (typeof vm.item[vm.options.type] === "undefined") vm.item[vm.options.type] = [];
			var found = false,
				index = -1;
			angular.forEach(vm.item[vm.options.type], function(entry, i) {
				if (entry.id == item.id) {
					found = true;
					index = i;
				}
			})
			index === -1 ? vm.item[vm.options.type].push(item) : vm.item[vm.options.type].splice(index, 1);
		}*/
	});

})();
