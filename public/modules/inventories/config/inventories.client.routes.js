'use strict';

//Setting up route
angular.module('inventories').config(['$stateProvider',
	function($stateProvider) {
		// Inventories state routing
		$stateProvider.
		state('listInventories', {
			url: '/inventories',
			templateUrl: 'modules/inventories/views/list-inventories.client.view.html'
		}).
		state('createInventory', {
			url: '/inventories/create',
			templateUrl: 'modules/inventories/views/create-inventory.client.view.html'
		}).
		state('viewInventory', {
			url: '/inventories/:inventoryId',
			templateUrl: 'modules/inventories/views/view-inventory.client.view.html'
		}).
		state('editInventory', {
			url: '/inventories/:inventoryId/edit',
			templateUrl: 'modules/inventories/views/edit-inventory.client.view.html'
		});
	}
]);