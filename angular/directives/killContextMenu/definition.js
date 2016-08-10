(function(){
	"use strict";

	angular.module('app.directives').directive( 'killContextMenu',  function() {
    return function(scope, elem) {
      return elem.bind('contextmenu',  function(e) {
                            e.preventDefault();
                        });
    };
  });

})();
