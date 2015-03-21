'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var records = require('../../app/controllers/records.server.controller');

	// Records Routes
	app.route('/records')
		.get(records.list)
		.post(users.requiresLogin, records.create);

	app.route('/records/:recordId')
		.get(records.read)
		.put(users.requiresLogin, records.hasAuthorization, records.update)
		.delete(users.requiresLogin, records.hasAuthorization, records.delete);

	// Finish by binding the Record middleware
	app.param('recordId', records.recordByID);
};
