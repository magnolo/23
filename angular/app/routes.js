(function(){
	"use strict";

	angular.module('app.routes').config(function($stateProvider, $urlRouterProvider){

		var getView = function(viewName){
			return '/views/app/' + viewName + '/' + viewName + '.html';
		};

		$urlRouterProvider.otherwise('/index/epi');

		$stateProvider
			.state('app', {
				abstract: true,
				views: {
					header: {
						templateUrl: getView('header')
					},
					main: {},
					'map@':{
						templateUrl: getView('map'),
						controller: 'MapCtrl',
						controllerAs: 'vm'
					}
				}
			})
			.state('app.index', {
				abstract:true,
				url: '/index',
				views: {
					'main@': {
						templateUrl: getView('index')
					}
				}
			})
			.state('app.index.show', {
				url: '/:index',
				views: {
					'info':{
						templateUrl: '/views/app/index/info.html',
						controller: 'IndexCtrl',
						controllerAs: 'vm',
						resolve:{
							initialData: function(DataService, $stateParams){
								var d = DataService.getAll('index/'+$stateParams.index+'/year/2014');
								var i = DataService.getOne('index/'+$stateParams.index+'/structure');
								return {
										dataObject: d.$object,
										indexerObject: i.$object,
										data:d,
										indexer: i
								}
							}
						}
					},
					'selected':{
							templateUrl: '/views/app/index/selected.html',
					}
				}
			})
			.state('app.index.show.selected',{
				url: '/:item',
				/*views:{
					'selected':{
						templateUrl: getView('selected'),
						controller: 'SelectedCtrl',
						controllerAs: 'vm',
						resolve:{
							getCountry: function(DataService, $stateParams){
								return DataService.getOne('nations', $stateParams.item).$object;
							}
						}
					}
				}*/
			})
			.state('app.index.show.selected.compare',{
				url: '/compare/:countries' 
			})
			.state('app.importcsv', {
				url: '/importer',
				data: {pageName: 'Import CSV'},
				views: {
					'main@': {
						templateUrl: getView('importcsv')
					},
					'map':{}
				}
			});



	});
})();
