(function(){
	"use strict";

	angular.module('app.directives').directive('gradientClickArea', function($document) {
    return {
      template: '<span class="addHandleIcon iconic brush"></span>',
      link: function(scope, elem) {
        var addHandleIcon, mouseIsDown;
        addHandleIcon = elem.find('span').hide();
        mouseIsDown = false;
        $document.mousedown(function() {
          return mouseIsDown = true;
        });
        $document.mouseup(function() {
          return mouseIsDown = false;
        });
        elem.mouseover(function() {
          if (!mouseIsDown) {
            return addHandleIcon.show();
          }
        });
        elem.mouseout(function() {
          return addHandleIcon.hide();
        });
        elem.mousemove(function(event) {
          return addHandleIcon.css({
            left: event.offsetX,
            top: event.offsetY - 5
          });
        });
        return elem.mousedown(function(event) {
          var leftClicked;
          leftClicked = event.which === 1;
          if (leftClicked) {
            scope.$apply(function() {
              return scope.addColorHandle((event.pageX - elem.offset().left) / elem.width());
            });
            return addHandleIcon.hide();
          }
        });
      }
    };
  });

})();
