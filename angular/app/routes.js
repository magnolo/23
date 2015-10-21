(function(){
	"use strict";

	angular.module('app.routes').config(function($stateProvider, $urlRouterProvider){

		var getView = function(viewName){
			return '/views/app/' + viewName + '/' + viewName + '.html';
		};

		$urlRouterProvider.otherwise('/');

		$stateProvider
			.state('app', {
				url: '/',
				views: {
					/*sidebar: {
						templateUrl: getView('sidebar')
					},*/
					header: {
						templateUrl: getView('header-main')
					},
					subHeader:{
						templateUrl: getView('header-home')
					},
					main: {
						templateUrl: getView('main'),
						controller: 'MainCtrl',
						controllerAs: 'ctrl'
					},
					map:{
						templateUrl: getView('map')
					}
				}
			})
			.state('app.indizes',{
				url: 'indizes',
				views:{

				}
			})
			.state('app.indizes.show', {
				url: '/:index',
				views: {
					'subHeader@':{
						templateUrl:''
					},
					'main@': {
						templateUrl: getView('epi'),
						controller: 'EpiCtrl',
						resolve:{
							EPI: function(DataService){
								return DataService.getAll('/epi/year/2014')
							}
						}
					}
				}
			})
			.state('app.indizes.show.selected',{
				url: '/:item'
			})
			.state('app.indizes.show.selected.compare',{
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
