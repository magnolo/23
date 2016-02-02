(function () {
	"use strict";

	angular.module('app.controllers').controller('IndexeditorcategoryCtrl', function (category, DataService,ContentService) {
    var vm = this;
    vm.category = category;
  });
})();
