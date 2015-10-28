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
					main: {}
				}
			})
			.state('app.epi', {
				url: '/epi',
				views: {
					'main@': {
						templateUrl: getView('epi'),
						controller: 'EpiCtrl',
						resolve:{
							EPI: function(DataService){
								return DataService.getAll('/epi/year/2014')
							}
						}
					},
					'map@':{
						templateUrl: getView('map')
					}
				}
			})
			.state('app.epi.upload',{
				url: '/upload-tutorial',
				views:{
					'sub':{
						templateUrl: '/views/app/epi/upload.html'
					}
				}
			})
			.state('app.epi.stats',{
				url: '/advanced-statistics',
				views:{
					'sub':{
						templateUrl: '/views/app/epi/stats.html'
					}
				}
			})
			.state('app.epi.sustain',{
				url: '/sustainable-goals',
				views:{
					'sub':{
						templateUrl: '/views/app/epi/sustain.html'
					}
				}
			})
			.state('app.epi.energy',{
				url: '/state-of-the-energy',
				views:{
					'sub':{
						templateUrl: '/views/app/epi/energy.html'
					}
				}
			})
			.state('app.epi.expert',{
				url: '/expert',
				views:{
					'sub':{
						templateUrl: '/views/app/epi/expert.html'
					}
				}
			})
			.state('app.epi.url',{
				url: '/url/:url'
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
