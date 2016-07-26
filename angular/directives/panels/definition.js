/**
 * @ngdoc directive
 * @name app.directive:panels
 * @scope
 * @restrict EA
 * @description
 * SEEMS TO BE A TESTDIRECTIVE, INCOMPLETE or UNUSED
 * 
 */

(function() {
	"use strict";

	angular.module('app.directives').directive('panels', function($window) {

		return {
			restrict: 'EA',
			templateUrl: 'views/directives/panels/panels.html',
			controller: 'PanelsCtrl',
			link: function(scope, element, attrs) {
				//
				var projectsContainer = element.next(),
					projectsPreviewWrapper = element.find('ul'),
					projectPreviews = projectsPreviewWrapper.children('li'),
					projects = document.querySelector('.cd-projects'),
					navigationTrigger = angular.element(document.querySelector('.cd-nav-trigger')),
					navigation = element.find('nav');
					//if browser doesn't support CSS transitions...
					//transitionsNotSupported = ($('.no-csstransitions').length > 0);

				var animating = false,
					//will be used to extract random numbers for projects slide up/slide down effect
					numRandoms = projects.querySelector('li').length,
					uniqueRandoms = [];

				//open project
				projectsPreviewWrapper.on('click', function(event) {
					event.preventDefault();
					if (animating == false) {
						animating = true;
						navigationTrigger.add(projectsContainer).addClass('project-open');
						openProject($(this).parent('li'));
					}
				});

				// navigationTrigger.on('click', function(event) {
				// 	event.preventDefault();
				//
				// 	if (animating == false) {
				// 		animating = true;
				// 		if (navigationTrigger.hasClass('project-open')) {
				// 			//close visible project
				// 			navigationTrigger.add(projectsContainer).removeClass('project-open');
				// 			closeProject();
				// 		} else if (navigationTrigger.hasClass('nav-visible')) {
				// 			//close main navigation
				// 			navigationTrigger.removeClass('nav-visible');
				// 			navigation.removeClass('nav-clickable nav-visible');
				// 			if (transitionsNotSupported) projectPreviews.removeClass('slide-out');
				// 			else slideToggleProjects(projectsPreviewWrapper.children('li'), -1, 0, false);
				// 		} else {
				// 			//open main navigation
				// 			navigationTrigger.addClass('nav-visible');
				// 			navigation.addClass('nav-visible');
				// 			if (transitionsNotSupported) projectPreviews.addClass('slide-out');
				// 			else slideToggleProjects(projectsPreviewWrapper.children('li'), -1, 0, true);
				// 		}
				// 	}
				//
				// 	if (transitionsNotSupported) animating = false;
				// });

				//scroll down to project info
				// projectsContainer.on('click', '.scroll', function() {
				// 	projectsContainer.animate({
				// 		'scrollTop': $window.height()
				// 	}, 500);
				// });

				//check if background-images have been loaded and show project previews
				// projectPreviews.children('a').bgLoaded({
				// 	afterLoaded: function() {
				// 		showPreview(projectPreviews.eq(0));
				// 	}
				// });

				function showPreview(projectPreview) {
					if (projectPreview.length > 0) {
						setTimeout(function() {
							projectPreview.addClass('bg-loaded');
							showPreview(projectPreview.next());
						}, 150);
					}
				}

				function openProject(projectPreview) {
					var projectIndex = projectPreview.index();
					projects.children('li').eq(projectIndex).add(projectPreview).addClass('selected');

					if (transitionsNotSupported) {
						projectPreviews.addClass('slide-out').removeClass('selected');
						projects.children('li').eq(projectIndex).addClass('content-visible');
						animating = false;
					} else {
						slideToggleProjects(projectPreviews, projectIndex, 0, true);
					}
				}

				function closeProject() {
					projects.find('.selected').removeClass('selected').on('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function() {
						$(this).removeClass('content-visible').off('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend');
						slideToggleProjects(projectsPreviewWrapper.children('li'), -1, 0, false);
					});

					//if browser doesn't support CSS transitions...
					if (transitionsNotSupported) {
						projectPreviews.removeClass('slide-out');
						projects.find('.content-visible').removeClass('content-visible');
						animating = false;
					}
				}

				function slideToggleProjects(projectsPreviewWrapper, projectIndex, index, bool) {
					if (index == 0) createArrayRandom();
					if (projectIndex != -1 && index == 0) index = 1;

					var randomProjectIndex = makeUniqueRandom();
					if (randomProjectIndex == projectIndex) randomProjectIndex = makeUniqueRandom();

					if (index < numRandoms - 1) {
						projectsPreviewWrapper.eq(randomProjectIndex).toggleClass('slide-out', bool);
						setTimeout(function() {
							//animate next preview project
							slideToggleProjects(projectsPreviewWrapper, projectIndex, index + 1, bool);
						}, 150);
					} else if (index == numRandoms - 1) {
						//this is the last project preview to be animated
						projectsPreviewWrapper.eq(randomProjectIndex).toggleClass('slide-out', bool).one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function() {
							if (projectIndex != -1) {
								projects.children('li.selected').addClass('content-visible');
								projectsPreviewWrapper.eq(projectIndex).addClass('slide-out').removeClass('selected');
							} else if (navigation.hasClass('nav-visible') && bool) {
								navigation.addClass('nav-clickable');
							}
							projectsPreviewWrapper.eq(randomProjectIndex).off('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend');
							animating = false;
						});
					}
				}

				//http://stackoverflow.com/questions/19351759/javascript-random-number-out-of-5-no-repeat-until-all-have-been-used
				function makeUniqueRandom() {
					var index = Math.floor(Math.random() * uniqueRandoms.length);
					var val = uniqueRandoms[index];
					// now remove that value from the array
					uniqueRandoms.splice(index, 1);
					return val;
				}

				function createArrayRandom() {
					//reset array
					uniqueRandoms.length = 0;
					for (var i = 0; i < numRandoms; i++) {
						uniqueRandoms.push(i);
					}
				}
			}
		};

	});

})();
