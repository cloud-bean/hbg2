'use strict';

// Configuring the Articles module
angular.module('inventories').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Inventories', 'inventories', 'dropdown', '/inventories(/create)?');
		Menus.addSubMenuItem('topbar', 'inventories', 'List Inventories', 'inventories');
		Menus.addSubMenuItem('topbar', 'inventories', 'New Inventory', 'inventories/create');
	}
]);