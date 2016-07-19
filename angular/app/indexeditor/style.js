(function () {
    "use strict";
    angular.module('app.controllers').controller('IndexeditorstyleCtrl', function ($state, style, styles){
        var vm = this;
        vm.style = style;
        vm.styles = styles;

        vm.options = {
            globalSave: true,
            postDone: function (data) {
                $state.go('app.index.editor.styles.style', {id:data.id});
            }

        }

    });
})();