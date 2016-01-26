(function () {
	"use strict";

	angular.module('app.controllers').controller('IndexeditorCtrl', function ($scope, $filter, $mdBottomSheet, $timeout,$state, indicators, ContentService) {
		//
		var vm = this;

		vm.indicators = indicators;
		vm.selection = [];
		vm.filter = {
			sort:'title',
			reverse:false,
			list: 0,
			published: false,
			types: {
				title: true,
				style: false,
				categories: false,
				infographic: false,
				description: false,
			}
		};
		vm.search = {
			query: '',
			show: false
		};
		vm.openMenu = openMenu;
		vm.selectAll = selectAll;
		vm.selectAllGroup = selectAllGroup;
		vm.selectedItem = selectedItem;
		vm.toggleSelection = toggleSelection;
		vm.loadIndicators = loadIndicators;

		vm.showListBottomSheet = showListBottomSheet;

		vm.toggleList = toggleList;


		activate($state.params);

		function activate(params){
			vm.selection = [];

			angular.forEach(vm.indicators, function(item){
				if(item.id == params.id){
					vm.selection.push(item);
				}
			});
		}

		function toggleList(key){
			if(vm.visibleList == key){
				vm.visibleList = '';
			}
			else{
				vm.visibleList = key;
			}
		}


		function selectedItem(item) {
			return vm.selection.indexOf(item) > -1 ? true : false;
		}
		function selectAll(){
			if(vm.selection.length){
				vm.selection = [];
			}
			else{
				angular.forEach(vm.indicators, function(item){
					if(vm.selection.indexOf(item) == -1){
						vm.selection.push(item);
					}
				});
			}
		}
		function selectAllGroup(group){
			vm.selection = [];
			angular.forEach(group, function(item){
				vm.selection.push(item);
			});

		}
		function toggleSelection(item) {
			var index = vm.selection.indexOf(item);
			if (index > -1) {
				return vm.selection.splice(index, 1);
			} else {
				return vm.selection.push(item);
			}
		}

		function loadIndicators() {

		}


		function openMenu($mdOpenMenu, ev) {
			$mdOpenMenu(ev);
		}
		 function showListBottomSheet($event) {
		    $mdBottomSheet.show({
		      templateUrl: '/views/bottomsheets/indizes/bottomsheet_indizes.html',
		      //controller: 'ListBottomSheetCtrl',
		      targetEvent: $event,
					parent:'#sidebar',
		    }).then(function(clickedItem) {

		    });
		  }

		$scope.$watch('vm.search.query', function (query, oldQuery) {
			if(query === oldQuery) return false;
			vm.query = vm.filter.types;
			vm.query.q = query;
			vm.indicators = ContentService.fetchIndicators(vm.query);
		});
		$scope.$on('$stateChangeSuccess', function(fromParams, fromState, toParams, toState){
			activate(toParams);
		});
	});

})();
