(function() {
	"use strict";

	angular.module('app.controllers').controller('ChapterCtrl', function($rootScope, $scope, $state, DialogService, ExportService) {
		var vm = this;
		vm.gotoChapter = gotoChapter;
		vm.ExportService = ExportService;
		vm.showData = showData;
		vm.ExportService.getChapter($state.params.id, $state.params.chapter || 1);

		function gotoChapter(chapter) {
			vm.ExportService.getChapter($state.params.id, chapter, function(c, i) {

				if ($state.params.iso) {
					$state.go('app.export.detail.chapter.indicator.country', {
						chapter: chapter,
						indicator: i.indicator_id,
						indiname: i.name,
						iso: $state.params.iso
					});
				} else {
					$state.go('app.export.detail.chapter.indicator', {
						chapter: chapter,
						indicator: i.indicator_id,
						indiname: i.name
					})
				}

			});
		}

		function showData() {
			DialogService.fromTemplate('exportdata', $scope);
		}

	
	});

})();
