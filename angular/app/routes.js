(function(){
	"use strict";

	angular.module('app.routes').config(function($stateProvider, $urlRouterProvider){

		var getView = function(viewName){
			return '/views/app/' + viewName + '/' + viewName + '.html';
		};

		$urlRouterProvider.otherwise('/epi');

		$stateProvider
			.state('app', {
				abstract: true,
				views: {
				/*	sidebar: {
						templateUrl: getView('sidebar')
					},*/
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
			.state('app.epi', {
				url: '/:index',
				views: {
					'main@': {
						templateUrl: getView('index'),
						controller: 'IndexCtrl',
						controllerAs: 'vm',
						resolve:{
							initialData: function(DataService, $stateParams){
								return {
										data:DataService.getAll('index/'+$stateParams.index+'/year/2014').$object,
										indexer: DataService.getOne('index/'+$stateParams.index+'/structure').$object
								}
							},

						}
					}
				}
			})
			.state('app.epi.selected',{
				url: '/:item'
			})
			.state('app.epi.selected.compare',{
				url: '/compare-with-countries'
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
