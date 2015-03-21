'use strict';

// Configuring the Articles module
angular.module('records').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Records', 'records', 'dropdown', '/records(/create)?');
		Menus.addSubMenuItem('topbar', 'records', 'List Records', 'records');
		Menus.addSubMenuItem('topbar', 'records', 'New Record', 'records/create');
	}
]);