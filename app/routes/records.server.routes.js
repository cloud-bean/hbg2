'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var records = require('../../app/controllers/records.server.controller');

	// Records Routes
	app.route('/records')
		.get(users.requiresLogin, records.list)
		.post(users.requiresLogin, records.hasAuthorization, records.create);

	app.route('/records/:recordId')
		.get(users.requiresLogin, records.read)
		.put(users.requiresLogin, records.hasAuthorization, records.update)
		.delete(users.requiresLogin, records.hasAdminRole, records.delete);

	// Finish by binding the Record middleware
	app.param('recordId', records.recordByID);
};
