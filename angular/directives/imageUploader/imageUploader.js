(function() {
	"use strict";

	angular.module('app.controllers').controller('ImageUploaderCtrl', function() {
		//
		var vm = this;
		vm.assignImage = assignImage;
		vm.resetImage = resetImage;

		function assignImage($file, $message, $flow) {
			if (!vm.item) vm.item = {};
			var image = JSON.parse($message);
			vm.item.image = image;
			vm.item.image_id = image.id;
		}

		function resetImage($flow) {
			$flow.cancel();
			vm.item.image = null;
			vm.item.image_id = null;
		}
	});

})();
