'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var members = require('../../app/controllers/members.server.controller');

	// Members Routes
	app.route('/members')
		.get(users.requiresLogin, members.hasAdminRole, members.list)
		.post(users.requiresLogin, members.hasAdminRole, members.create);

	app.route('/members/card/:cardNumber')
        .get(users.requiresLogin, members.hasAdminRole, members.read);

	app.route('/members/:memberId')
		.get(users.requiresLogin, members.hasAuthorization, members.read)
		.put(users.requiresLogin, members.hasAdminRole, members.update)
		.delete(users.requiresLogin, members.hasAdminRole, members.delete);

	// Finish by binding the Member middleware
	app.param('memberId', members.memberByID);
	app.param('cardNumber', members.memberByCardNumber);
};
