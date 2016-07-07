(function() {
	"use strict";

	angular.module('app.routes').config(function($stateProvider, $urlRouterProvider, $locationProvider) {
		//$locationProvider.html5Mode(true);
		var getView = function(viewName) {
			return '/views/app/' + viewName + '/' + viewName + '.html';
		};

		$urlRouterProvider.otherwise('/');

		$stateProvider
			.state('app', {
				abstract: true,
				views: {
					header: {
						templateUrl: getView('header'),
						controller: 'HeaderCtrl',
						controllerAs: 'vm'
					},
					main: {},
					'map@': {
						templateUrl: getView('map'),
						controller: 'MapCtrl',
						controllerAs: 'vm'
					},
					'sidemenu@': {
						templateUrl: getView('sidemenu'),
						controller: 'SidemenuCtrl',
						controllerAs: 'vm'
					}
				}
			})
			.state('app.home', {
				url: '/',
				views: {

					'sidebar@': {
						templateUrl: getView('home'),
						controller: 'HomeCtrl',
						controllerAs: 'vm'
					}
				}
			})
			.state('app.user', {
				url: '/user',
				abstract: true

			})
			.state('app.user.login', {
				url: '/login',
				views: {
					'main@': {
						templateUrl: getView('login'),
						controller: 'LoginCtrl',
						controllerAs: 'vm'

					}
				}

			})
			.state('app.user.profile', {
				url: '/my-profile',
				auth: true,
				resolve: {
					profile: function(DataService, $auth) {
						return DataService.getOne('me').$object;
					}
				},
				views: {
					'main@': {
						templateUrl: getView('user'),
						controller: 'UserCtrl',
						controllerAs: 'vm'
					}
				}

			})
			.state('app.index', {
				abstract: true,
				url: '/index',
				resolve: {
					countries: function(CountriesService) {
						return CountriesService.getData();
					}
				}
			})

		.state('app.index.mydata', {
				url: '/my-data',
				auth: true,
				views: {
					'sidebar@': {
						templateUrl: '/views/app/indexMyData/indexMyDataMenu.html',
						controller: 'IndexMyDataMenuCtrl',
						controllerAs: 'vm'
					},
					'main@': {
						templateUrl: getView('indexMyData'),
						controller: 'IndexMyDataCtrl',
						controllerAs: 'vm'
					}
				}
			})
			.state('app.index.mydata.entry', {
				url: '/:name',
				auth: true,
				views: {
					'sidebar@': {
						templateUrl: '/views/app/indexMyData/indexMyDataMenu.html',
						controller: 'IndexMyDataMenuCtrl',
						controllerAs: 'vm'
					},
					'main@': {
						templateUrl: '/views/app/indexMyData/indexMyDataEntry.html',
						controller: 'IndexMyDataEntryCtrl',
						controllerAs: 'vm'
					}
				}
			})
			.state('app.index.editor', {
				url: '/editor',
				auth: true,
				resolve: {
					indices: function(ContentService) {
						return ContentService.getIndices();
					},
					indicators: function(ContentService) {
						return ContentService.fetchIndicators({
							page: 1,
							order: 'title',
							limit: 1000,
							dir: 'ASC'
						});
					},
					styles: function(ContentService) {
						return ContentService.getStyles();
					},
					categories: function(ContentService) {
						return ContentService.getCategories({
							indicators: true,
							tree: true
						});
					}
				},
				views: {
					'sidebar@': {
						templateUrl: getView('indexeditor'),
						controller: 'IndexeditorCtrl',
						controllerAs: 'vm',
					}
				}
			})
			.state('app.index.editor.indicators', {
				url: '/indicators',
				auth: true,
			})
			.state('app.index.editor.indicators.indicator', {
				url: '/:id',
				auth: true,
				layout: 'row',
				resolve: {
					indicator: function(ContentService, $stateParams) {
						return ContentService.getIndicator($stateParams.id)
					}
				},
				views: {
					'main@': {
						templateUrl: '/views/app/indexeditor/indexeditorindicator.html',
						controller: 'IndexeditorindicatorCtrl',
						controllerAs: 'vm'

					}
				}
				/*views:{
					'info':{

					},
					'menu':{
						templateUrl:getView('indexeditor'),
						controller: 'IndexeditorCtrl',
						controllerAs: 'vm'
					}
				}*/
			})
			.state('app.index.editor.indizes', {
				url: '/indizes',
				auth: true,
			})
			.state('app.index.editor.indizes.data', {
				url: '/:id/:name',
				auth: true,
				layout: 'row',
				resolve: {
					index: function(ContentService, $stateParams) {
						if ($stateParams.id == 0) return {};
						return ContentService.getItem($stateParams.id);
					}
				},
				views: {
					'main@': {
						templateUrl: '/views/app/indexeditor/indexeditorindizes.html',
						controller: 'IndexeditorindizesCtrl',
						controllerAs: 'vm'
					}
				}
			})
			.state('app.index.editor.indizes.data.add', {
				url: '/add',
				layout: 'row',
				resolve: {
					indicators: function(ContentService, $stateParams) {
						return ContentService.fetchIndicators({
							page: 1,
							order: 'title',
							limit: 1000,
							dir: 'ASC'
						});
					}
				},
				views: {
					'additional@': {
						templateUrl: '/views/app/indexeditor/indicators.html',
						controller: 'IndexinidcatorsCtrl',
						controllerAs: 'vm'
					}
				}
			})
			.state('app.index.editor.indicators.indicator.details', {
				url: '/:entry',
				auth: true,
				layout: 'row'
			})
			.state('app.index.editor.categories', {
				url: '/categories',
				auth: true,
			})
			.state('app.index.editor.categories.category', {
				url: '/:id',
				auth: true,
				layout: 'row',
				resolve: {
					category: function(ContentService, $stateParams) {
						if ($stateParams.id == 'new') {
							return {};
						}
						return ContentService.getCategory($stateParams.id);
					}
				},
				views: {
					'main@': {
						templateUrl: '/views/app/indexeditor/indexeditorcategory.html',
						controller: 'IndexeditorcategoryCtrl',
						controllerAs: 'vm'
					}
				}
			})

		.state('app.index.create', {
				url: '/create',
				auth: true,
				views: {
					'sidebar@': {
						templateUrl: getView('indexcreator'),
						controller: 'IndexcreatorCtrl',
						controllerAs: 'vm'
					}
				}
			})
			.state('app.index.create.basic', {
				url: '/basic',
				auth: true
			})
			.state('app.index.check', {
				url: '/checking',
				auth: true,
				views: {
					'main@': {
						templateUrl: getView('indexCheck'),
						controller: 'IndexCheckCtrl',
						controllerAs: 'vm'
					},
					'sidebar@': {
						templateUrl: '/views/app/indexCheck/indexCheckSidebar.html',
						controller: 'IndexCheckSidebarCtrl',
						controllerAs: 'vm'
					}
				}
			})
			.state('app.index.meta', {
				url: '/adding-meta-data',
				auth: true,
				layout: 'row',
				views: {
					'main@': {
						templateUrl: getView('indexMeta'),
						controller: 'IndexMetaCtrl',
						controllerAs: 'vm'
					},
					'sidebar@': {
						templateUrl: '/views/app/indexMeta/indexMetaMenu.html',
						controller: 'IndexMetaMenuCtrl',
						controllerAs: 'vm'
					}
				}
			})
			.state('app.index.final', {
				url: '/final',
				auth: true,
				layout: 'row',
				views: {
					'main@': {
						templateUrl: getView('indexFinal'),
						controller: 'IndexFinalCtrl',
						controllerAs: 'vm'
					},
					'sidebar@': {
						templateUrl: '/views/app/indexFinal/indexFinalMenu.html',
						controller: 'IndexFinalMenuCtrl',
						controllerAs: 'vm'
					}
				}
			})
			.state('app.export', {
				abstract: true,
				url: '/export',
				resolve: {
					countries: function(DataService) {
						return DataService.getOne('countries/isos').then(function(countries) {
							return countries;
						});
					}
				}
			})
			.state('app.export.detail', {
				url: '/:id/:name',
				data: {
					pageName: 'Export Data',
				},
				views: {
					'fullscreen@': {
						templateUrl: getView('exported'),
						controller: 'ExportedCtrl',
						controllerAs: 'vm'
					}
				}
			})
			.state('app.export.detail.chapter', {
				url: '/chapter/:chapter',
				data: {
					pageName: 'Export Data',
				},
				layout: 'loose',
				fixLayout: true,
				avoidRoots: true,
				views: {
					'header@': {
						templateUrl: getView('chapter'),
						controller: 'ChapterCtrl',
						controllerAs: 'vm'
					},
					'sidebar@': {
						templateUrl: getView('chapterContent'),
						controller: 'ChapterContentCtrl',
						controllerAs: 'vm'
					}
				}
			})
			.state('app.export.detail.chapter.indicator', {
				url: '/:indicator/:indiname',
				layout: 'loose',
				fixLayout: true,
				avoidRoots: true
			})
			.state('app.export.detail.chapter.indicator.country', {
				url: '/:iso',
				layout: 'loose',
				fixLayout: true,
				avoidRoots: true
			})
			.state('app.export.detail.chapter.indicator.country.compare', {
				url: '/compare/:countries',
				layout: 'loose',
				fixLayout: true,
				avoidRoots: true
			})
			.state('app.index.exports', {
				url: '/exports',
				auth: true,
				data: {
					pageName: 'Export Data'
				},
				views: {
					'sidebar@': {
						templateUrl: getView('export'),
						controller: 'ExportCtrl',
						controllerAs: 'vm'
					}
				}
			})
			.state('app.index.exports.details', {
				url: '/:id/:name',
				auth: true,
				layout: 'row',
				data: {
					pageName: 'Export Data'
				},
				views: {
					'main@': {
						templateUrl: '/views/app/export/exportDetails.html',
						controller: 'ExportDetailsCtrl',
						controllerAs: 'vm'
					}
				}
			})
			.state('app.index.exports.details.add', {
				url: '/add',
				layout: 'row',
				resolve: {
					indicators: function(ContentService, $stateParams) {
						return ContentService.fetchIndicators({
							page: 1,
							order: 'title',
							limit: 1000,
							dir: 'ASC'
						});
					}
				},
				views: {
					'additional@': {
						templateUrl: '/views/app/indexeditor/indicators.html',
						controller: 'IndexinidcatorsCtrl',
						controllerAs: 'vm'
					}
				}
			})
			.state('app.index.exports.details.style', {
				url: '/style/:styleId/:styleName',
				layout: 'row',
				additional: 'full',
				views: {
					'additional@': {
						templateUrl: getView('exportStyle'),
						controller: 'ExportStyleCtrl',
						controllerAs: 'vm'
					}
				}
			})
			.state('app.index.exports.details.layout', {
				url: '/layout',
				layout: 'row',
				views: {
					'additional@': {
						templateUrl: getView('exportLayout'),
						controller: 'ExportLayoutCtrl',
						controllerAs: 'vm'
					}
				}
			})
			.state('app.index.basemaps', {
				url: '/basemaps',
				auth: true,
				data: {
					pageName: 'Export Data'
				},
				views: {
					'sidebar@': {
						templateUrl: getView('basemaps'),
						controller: 'BasemapsCtrl',
						controllerAs: 'vm'
					}
				}
			})
			.state('app.index.basemaps.details', {
				url: '/:id/:name',
				auth: true,
				layout: 'row',
				data: {
					pageName: 'Basemaps'
				},
				views: {
					'main@': {
						templateUrl: '/views/app/basemaps/basemapDetails.html',
						controller: 'BasemapDetailsCtrl',
						controllerAs: 'vm'
					}
				}
			})
			.state('app.index.list', {
				url: '/list',
				resolve: {
					indicators: function(ContentService) {
						return ContentService.getIndicators({
							page: 1,
							order: 'title',
							limit: 1000,
							dir: 'ASC'
						})
					},
					indices: function(ContentService) {
						return ContentService.fetchIndices();
					},
					categories: function(ContentService) {
						return ContentService.getCategories({
							indicators: true,
							tree: true
						});
					}
				},
				views: {
					'sidebar@': {
						templateUrl: getView('fullList'),
						controller: 'FullListCtrl',
						controllerAs: 'vm',

					}
				}
			})
			.state('app.index.list.filter', {
				url: '/:filter',
				layout: 'row',
				views: {
					'main@': {
						templateUrl: '/views/app/fullList/filter.html',
						controller: 'FullListFitlerCtrl',
						controllerAs: 'vm',
					}
				}
			})
			.state('app.index.indicator', {
				url: '/indicator/:id/:name/:year/:gender/:iso',
				resolve: {
					indicator: function(ContentService, $stateParams) {
						return ContentService.fetchIndicator($stateParams.id);
					}
				},
				views: {
					'sidebar@': {
						templateUrl: getView('indicator'),
						controller: 'IndicatorShowCtrl',
						controllerAs: 'vm'
					}
				},
				params: {
					year: {
						squash: true,
						value: null,
						dynamic: true
					},
					gender: {
						squash: true,
						value: null,
						dynamic: true
					},
					iso: {
						squash: true,
						value: null,
						dynamic: true

					}
				}
			})
			.state('app.index.indicator.info', {
				url: '/details',
				layout: 'row',
				resolve: {
					data: function(ContentService, $state) {

						return ContentService.getIndicatorData($state.params.id, $state.params.year, $state.params.gender);
					}
				},
				views: {
					'main@': {
						templateUrl: '/views/app/indicator/indicatorYearTable.html',
						controller: 'IndicatorYearTableCtrl',
						controllerAs: 'vm',
					}
				}
			})
			.state('app.index.show', {
				url: '/:id/:name',
				resolve: {
					data: function(IndizesService, $stateParams) {
						return IndizesService.fetchData($stateParams.id);
					},
					countries: function(CountriesService) {
						return CountriesService.getData();
					}
				},
				views: {
					'sidebar@': {
						templateUrl: '/views/app/index/info.html',
						controller: 'IndexCtrl',
						controllerAs: 'vm'
					},
					'selected': {
						templateUrl: '/views/app/index/selected.html',
					}
				}
			})
			.state('app.index.show.info', {
				url: '/info',
				views: {
					'main@': {
						controller: 'IndexinfoCtrl',
						controllerAs: 'vm',
						templateUrl: getView('indexinfo')
					}
				}
			})
			.state('app.index.show.selected', {
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
			.state('app.index.show.selected.compare', {
				url: '/compare/:countries'
			})
			.state('app.conflict', {
				abstract: true,
				url: '/conflict',
			})
			.state('app.conflict.index', {
				url: '/index',
				resolve: {
					nations: function(Restangular) {
						return Restangular.all('conflicts/nations');
					},
					conflicts: function(Restangular) {
						return Restangular.all('conflicts');
					}
				},
				views: {
					'sidebar@': {
						controller: 'ConflictsCtrl',
						controllerAs: 'vm',
						templateUrl: getView('conflicts')
					},
					'logo@': {
						templateUrl: getView('logo')
					}
				}
			})
			.state('app.conflict.index.nation', {
				url: '/nation/:iso',
				resolve: {
					nation: function(Restangular, $stateParams) {
						return Restangular.one('/conflicts/nations/', $stateParams.iso).get();
					}
				},
				views: {
					'sidebar@': {
						controller: 'ConflictnationCtrl',
						controllerAs: 'vm',
						templateUrl: getView('conflictnation')
					},
					'logo@': {
						templateUrl: getView('logo')
					}
				}
			})
			.state('app.conflict.index.details', {
				url: '/:id',
				resolve: {
					conflict: function(Restangular, $stateParams) {
						return Restangular.one('/conflicts/events/', $stateParams.id).get();
					}
				},
				views: {
					'sidebar@': {
						controller: 'ConflictdetailsCtrl',
						controllerAs: 'vm',
						templateUrl: getView('conflictdetails')
					},
					'items-menu@': {},
					'logo@': {
						templateUrl: getView('logo')
					}
				}
			})
			.state('app.conflict.import', {
				url: '/import',
				auth: true,
				views: {
					'sidebar@': {
						controller: 'ConflictImportCtrl',
						controllerAs: 'vm',
						templateUrl: getView('conflictImport')
					}
				}
			})
			.state('app.importcsv', {
				url: '/importer',
				data: {
					pageName: 'Import CSV'
				},
				views: {
					'main@': {
						templateUrl: getView('importcsv')
					},
					'map': {}
				}
			});
	});
})();
