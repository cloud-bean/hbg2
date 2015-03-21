'use strict';

//Inventories service used to communicate Inventories REST endpoints
angular.module('inventories').factory('Inventories', ['$resource',
	function($resource) {
		return $resource('inventories/:inventoryId', { inventoryId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);