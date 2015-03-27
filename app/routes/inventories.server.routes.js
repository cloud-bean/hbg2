'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var inventories = require('../../app/controllers/inventories.server.controller');

	// Inventories Routes
	app.route('/inventories')
		.get(inventories.list)
		.post(users.requiresLogin, inventories.hasAdminRole, inventories.create);

	app.route('/inventories/invCode/:inv_code')
		.get(inventories.read);

	app.route('/inventories/name/:name')
		.get(inventories.list);

	app.route('/inventories/isbn/:isbn')
		.get(inventories.list);

	app.route('/inventories/:inventoryId')
		.get(inventories.read)
		.put(users.requiresLogin, inventories.hasAdminRole, inventories.update)
		.delete(users.requiresLogin, inventories.hasAdminRole, inventories.delete);

	// Finish by binding the Inventory middleware
	app.param('inventoryId', inventories.inventoryByID);
	app.param('name', inventories.listsByName);
	app.param('isbn', inventories.listsByIsbn);
	app.param('inv_code', inventories.oneByInvCode);
};
