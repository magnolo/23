(function(){
	"use strict";

	angular.module('app.directives').directive('gradientClickArea', function($document) {
    return {
      template: '<span class="addHandleIcon iconic brush"></span>',
      link: function(scope, elem) {
        var addHandleIcon, mouseIsDown;
        addHandleIcon = elem.find('span').css('opacity',0);
        mouseIsDown = false;
        $document.bind('mousedown', function() {
          return mouseIsDown = true;
        });
        $document.bind('mouseup',function() {
          return mouseIsDown = false;
        });
        elem.bind('mouseover',function() {
          if (!mouseIsDown) {
            return addHandleIcon.css('opacity',1);
          }
        });
        elem.bind('mouseout',function() {
          return addHandleIcon.css('opacity',0);
        });
        elem.bind('mousemove',function(event) {
          return addHandleIcon.css({
            left: event.offsetX,
            top: event.offsetY - 5
          });
        });
        return elem.bind('mousedown',function(event) {
          var leftClicked;
          leftClicked = event.which === 1;
          if (leftClicked) {
            scope.$apply(function() {
						  return scope.vm.addColorHandle((event.pageX -  elem[0].getBoundingClientRect().left) / elem[0].clientWidth);
            });
            return addHandleIcon.css('opacity',0);
          }
        });
      }
    };
  });

})();
