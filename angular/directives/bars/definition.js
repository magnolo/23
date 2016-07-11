/**
 *	@ngdoc directive
 *	@name app.directive:Bars
 *	@restrict 'EA'
 *
 *	@param {object} data object which comprises of specific indicator data (as found in api/indicator/:id) (TODO FIND BETTER DECLARATION!)
 *	@param {object} options object with bar specific options, should look like
 *		{titled:boolean, color:csscolor, onClick:function}
 *	@param {object} structure object with index and its children (as found in api/index/:id)
 *
 * 	@example <bars data="vm.current.data.data[0]" options="{'titled': false, color:vm.structure.style.base_color, onClick: vm.goToIndex}" structure="vm.structure.children"></bars>
 *	@description
 *	Builds horizontal bar charts out of passed data
 */

(function(){
	"use strict";

	angular.module('app.directives').directive( 'bars', function() {

		return {
			restrict: 'EA',
			templateUrl: 'views/directives/bars/bars.html',
			controller: 'BarsCtrl',
			controllerAs: 'vm',
			scope:{},
			bindToController: {
				data: '=',
				options: '=',
				structure: '='
			},
			link: function( scope, element, attrs ){
				//
			}
		};

	});

})();
