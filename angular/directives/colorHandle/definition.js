(function(){
	"use strict";

	angular.module('app.directives').directive('colorHandle', function($document, $timeout) {
    return function(scope, elem, attrs) {
      var beginDragging, container, getColorHandle, mousemoveListener;
			var dragging = false;
      container = elem.parent();
      getColorHandle = function() {
        return scope.$eval(attrs.colorHandle);
      };
      scope.$watch(attrs.colorHandle, function(ColorHandle, OldColorHandle) {
        var deleted, leftExtremePercent, rightExtremePercent;
        leftExtremePercent = -3.4;
        rightExtremePercent = 96.7;
        elem.css('left', leftExtremePercent + (ColorHandle.stop * (rightExtremePercent + Math.abs(leftExtremePercent))) + '%');
        if (ColorHandle.color !== null) {
          return elem.css('color', ColorHandle.color);
        } else {
          deleted = scope.vm.deleteColorHandle(ColorHandle);
          if (!deleted) {
            return ColorHandle.color = OldColorHandle.color;
          }
        }
      }, true);
      // scope.$watch('ActiveColorHandle', function(ActiveColorHandle) {
      //   var ThisColorHandle;
      //   ThisColorHandle = getColorHandle();
      //   elem.toggleClass('arrow_up_alt1', ActiveColorHandle === ThisColorHandle);
      //   return elem.toggleClass('arrow_up', ActiveColorHandle !== ThisColorHandle);
      // });
      mousemoveListener = null;
      elem.bind('mousedown',function(event) {
        var leftClicked;
        leftClicked = event.which === 1;
        if (leftClicked) {
          return beginDragging();
        }
      });
      beginDragging = function() {
        var ThisColorHandle;
        ThisColorHandle = getColorHandle();
        // scope.$apply(function() {
        //   return scope.setActiveColorHandle(ThisColorHandle);
        // });
        elem.addClass('dragging');
        if (!mousemoveListener) {
          return $document.bind('mousemove',mousemoveListener = function(event) {

            return scope.$apply(function() {

              ThisColorHandle.stop = (event.pageX - container[0].getBoundingClientRect().left) / container[0].clientWidth;
              if (ThisColorHandle.stop < 0) {
                return ThisColorHandle.stop = 0;
              } else if (ThisColorHandle.stop > 1) {
                return ThisColorHandle.stop = 1;
              }
            });
          });
        }
      };

      $document.bind('mouseup',function() {

        if (elem.hasClass('dragging')) {
          elem.removeClass('dragging');
        }
        if (mousemoveListener !== null) {
          $document.unbind('mousemove', mousemoveListener);
          return mousemoveListener = null;
        }
      });
      elem.bind('mouseup',function() {
        var rightClicked;
        rightClicked = event.which === 3;
        if (rightClicked) {
          return scope.$apply(function() {
            return scope.vm.deleteColorHandle(getColorHandle());
          });
        }
      });
      return $timeout(function() {
        var ThisColorHandle;
        ThisColorHandle = getColorHandle();
        // if (ThisColorHandle.forceDrag && scope.getMouseIsDown()) {
        //   ThisColorHandle.forceDrag = false;
        //   scope.setActiveColorHandle(ThisColorHandle);
        //   return beginDragging();
        // }
      });
    };
  });

})();
