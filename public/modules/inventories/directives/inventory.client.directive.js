'use strict';

angular.module('inventories').directive('invSearch', [
	function($document) {
		return {
			template: '<div>{{keyword}}</div>',
			restrict: 'EA',
            scope: {
                keyword: '=search.keyword'
            },
			link: function postLink(scope, element, attrs) {
				// Inventory directive logic
				// ...
                // 300s THEN send a request to update the inv.
				//element.text('this is the inventory directive');
			}
		};
	}
]);
