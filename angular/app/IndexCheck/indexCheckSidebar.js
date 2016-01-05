(function () {
	"use strict";

	angular.module('app.controllers').controller('IndexCheckSidebarCtrl', function ($scope,$state, IndexService, DataService,DialogService, toastr) {
		var vm = this;
		vm.data = IndexService.getData();
		vm.meta = IndexService.getMeta();
		vm.errors = IndexService.getErrors();
    vm.iso_errors = IndexService.getIsoErrors();
		vm.clearErrors = clearErrors;
		vm.fetchIso = fetchIso;

		activate();

		function activate(){
			vm.myData = DataService.getAll('me/data');
			checkMyData();
		}

		function checkMyData(){
			vm.extendingChoices = [];
			if(vm.data.length){
				vm.myData.then(function(imports){
					angular.forEach(imports, function(entry){
						var found = 0;
						angular.forEach(vm.data[0].meta.fields, function(field){
								var columns = JSON.parse(entry.meta_data);
								angular.forEach(columns, function(column){
									if(column.column == field ){
										found++;
									}
								})
						});
						if(found >= vm.data[0].meta.fields.length - 2){
							vm.extendingChoices.push(entry);
						}
					})
					if(vm.extendingChoices.length){
						DialogService.fromTemplate('extendData', $scope);
					}
				});
			}
		}
		function clearErrors() {
			angular.forEach(vm.data, function (row, key) {
				angular.forEach(row.data[0], function (item, k) {
					if (isNaN(item) || item < 0) {
						if ( /*item.toString().toUpperCase() == "NA" ||*/ item < 0 || item.toString().toUpperCase().indexOf('N/A') > -1) {
							vm.data[key].data[0][k] = null;
							row.errors.splice(0, 1);
              vm.errors.splice(0,1);
						}
					}
				});
				if (!row.data[0][vm.meta.iso_field]) {
          var error = {
						type: "2",
						message: "Iso field is not valid!",
						value: row.data[0][vm.meta.iso_field],
            column:vm.meta.iso_field,
            row:key
					};
					var errorFound = false;
					angular.forEach(row.errors, function(error, key){
						console.log(error);
						if(error.type == 2){
							errorFound = true;
						}
					})
					if(!errorFound){
						row.errors.push(error);
	          vm.iso_errors.push(error);
					}
				}
			});
		}

		function fetchIso() {
			if (!vm.meta.iso_field) {
				toastr.error('Check your selection for the ISO field', 'Column not specified!');
				return false;
			}
			if (!vm.meta.country_field) {
				toastr.error('Check your selection for the COUNTRY field', 'Column not specified!');
				return false;
			}
			if (vm.meta.country_field == vm.meta.iso_field) {
				toastr.error('ISO field and COUNTRY field can not be the same', 'Selection error!');
				return false;
			}

			vm.notFound = [];
			var entries = [];
			var isoCheck = 0;
			var isoType = 'iso-3166-2';
			angular.forEach(vm.data, function (item, key) {
				if (item.data[0][vm.meta.iso_field]) {
					isoCheck += item.data[0][vm.meta.iso_field].length == 3 ? 1 : 0;
				}
				switch (item.data[0][vm.meta.country_field]) {
				case 'Cabo Verde':
					item.data[0][vm.meta.country_field] = 'Cape Verde';
					break;
				case "Democratic Peoples Republic of Korea":
					item.data[0][vm.meta.country_field] = "Democratic People's Republic of Korea";
					break;
				case "Cote d'Ivoire":
					item.data[0][vm.meta.country_field] = "Ivory Coast";
					break;
				case "Lao Peoples Democratic Republic":
					item.data[0][vm.meta.country_field] = "Lao People's Democratic Republic";
					break;
				default:
					break;
				}
				entries.push({
					iso: item.data[0][vm.meta.iso_field],
					name: item.data[0][vm.meta.country_field]
				});
			});
			var isoType = isoCheck >= (entries.length / 2) ? 'iso-3166-1' : 'iso-3166-2';
      IndexService.resetToSelect();
			DataService.post('countries/byIsoNames', {
				data: entries,
				iso: isoType
			}).then(function (response) {
				angular.forEach(response, function (country, key) {
					angular.forEach(vm.data, function (item, k) {
						if (country.name == item.data[0][vm.meta.country_field]) {
							if (country.data.length > 1) {
								var toSelect = {
									entry: item,
									options: country.data
								};
								IndexService.addToSelect(toSelect);
							} else {
								if (typeof country.data[0] != "undefined") {
									vm.data[k].data[0][vm.meta.iso_field] = country.data[0].iso;
									vm.data[k].data[0][vm.meta.country_field] = country.data[0].admin;
									if (item.errors.length) {
										angular.forEach(item.errors, function (error, e) {
											if (error.type == 2 || error.type == 3) {
												vm.iso_errors.splice(0,1);
												item.errors.splice(e, 1);
											}
                      else if(error.type == 1){
                        if(error.column == vm.meta.iso_field){
                          vm.errors.splice(0,1);
                          item.errors.splice(e, 1);
                        }
                      }
										});

									}
								} else {
									console.log(vm.data[k]);
                  var error = {
                    type: "3",
                    message: "Could not locate a valid iso name!",
                    column: vm.meta.country_field
                  };
									var errorFound = false;
									angular.forEach(vm.data[k].errors, function(error, i){
										console.log(error);
										if(error.type == 3){
											errorFound = true;
										}
									})
									if(!errorFound){
										IndexService.addIsoError(error);
										item.errors.push(error);
									}
								}
							}
						}
					});
				});
				vm.iso_checked = true;
        if(IndexService.getToSelect().length){
            DialogService.fromTemplate('selectisofetchers');
        }
			}, function (response) {
				toastr.error('Please check your field selections', response.data.message);
			});

		}
		vm.extendData = extendData;

		function extendData(){
			var insertData = {data:[]};
			var meta = [], fields = [];
			angular.forEach(vm.data, function(item, key){
				if(item.errors.length == 0){
					item.data[0].year = vm.meta.year;
					insertData.data.push(item.data[0]);
				}
				else{
					toastr.error('There are some errors left!', 'Huch!');
					return;
				}
			});
			console.log(insertData);
			DataService.post('data/tables/'+vm.addDataTo.table_name+'/insert', insertData).then(function(res){
				if(res == true){
					toastr.success(insertData.data.length+' items importet to '+vm.meta.name,'Success');
					vm.data = IndexService.clear();
					$state.go('app.index.mydata');
				}
			});
		}

	});
})();
