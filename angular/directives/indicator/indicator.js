(function () {
	"use strict";

	angular.module('app.controllers').controller('IndicatorCtrl', function ($scope, DataService, DialogService, $filter, toastr) {
		//
		var vm = this;

		vm.checkBase = checkBase;
		vm.checkFull = checkFull;

		vm.categories = [];
		vm.dataproviders = [];
		vm.selectedItem = null;
		vm.searchText = null;
		vm.searchUnit = null;
		vm.querySearch = querySearch;
		vm.queryUnit = queryUnit;
		vm.querySearchCategory = querySearchCategory;

		vm.save = save;

		vm.toggleCategorie = toggleCategorie;
		vm.selectedCategorie = selectedCategorie;
		vm.saveCategory = saveCategory;

		vm.toggleStyle = toggleStyle;
		vm.selectedStyle = selectedStyle;

		vm.createProvider = createProvider;
		vm.createUnit = createUnit;

		activate();

		function activate() {
			loadAll();
		}

		function querySearch(query) {
			return $filter('findbyname')(vm.dataproviders, query, 'title');
		}
		function queryUnit(query) {
			return $filter('findbyname')(vm.measureTypes, query, 'title');
		}

		function querySearchCategory(query) {
			return $filter('findbyname')(vm.categories, query, 'title');
		}

		function loadAll() {
			vm.dataproviders = DataService.getAll('dataproviders').$object;
			vm.categories = DataService.getAll('categories').$object;
			vm.measureTypes = DataService.getAll('measure_types').$object;
			vm.styles = DataService.getAll('styles').$object;
		}

		function checkBase(){
			if (vm.item.title && vm.item.type && vm.item.dataprovider && vm.item.title.length >= 3) {
				return true;
			}
			return false;
		}
		function checkFull(){
			if(typeof vm.item.categories == "undefined") return false;
			return checkBase() && vm.item.categories.length ? true : false;
		}
		function save(){
			vm.item.save().then(function(response){
				if(response.data){
					toastr.success('Data successfully updated!', 'Successfully saved');
				}
			});
		}
		function toggleCategorie(categorie) {
			var found = false, index = -1;
			angular.forEach(vm.item.categories, function(cat, i){
				if(cat.id == categorie.id){
					found = true;
					index = i;
				}
			})
			console.log(found, index);
			index === -1 ? vm.item.categories.push(categorie) : vm.item.categories.splice(index, 1);
		}

		function selectedCategorie(item, categorie) {
			if (typeof item.categories == "undefined") {
				item.categories = [];
				return false;
			}
		 	var found = false;
			angular.forEach(item.categories, function(cat, key){
				if(cat.id == categorie.id){
					found = true;
				}
			});
			return found;
		}
		function saveCategory(valid){
			if(valid){

				DataService.post('categories', vm.category).then(function(data){
					vm.categories.push(data);
					vm.createCategory = false;
					vm.item.categories.push(data);
					toastr.success('New Category was saved','Success');
				});
			}
		}
		function toggleStyle(style) {
			if(vm.item.style_id == style.id){
				vm.item.style_id = 0;
			}
			else{
				vm.item.style_id = style.id
				vm.item.style = style;
			}
		}
		function selectedStyle(item, style) {
			return vm.item.style_id == style.id ? true : false;
		}

		//TODO: ITS A HACK TO GET IT WORK: ng-click vs ng-mousedown
		function createProvider(text){
			DialogService.fromTemplate('addProvider', $scope);
		}
		function createUnit(text){
			DialogService.fromTemplate('addUnit', $scope);
		}

	});

})();
