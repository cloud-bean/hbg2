'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var records = require('../../app/controllers/records.server.controller');

	// Records Routes
	app.route('/records')
		.get(users.requiresLogin, records.list)
		.post(users.requiresLogin, records.hasAuthorization, records.create);
    
    // Records for member's history
    app.route('/records/member/:mId')
        .get(users.requiresLogin, records.listByMemberId);

    // get records for mobile, search records by a member id
    app.route('/records/mob/:mId')
        .get(records.hasApiKey, records.listByMemberId);

    // post record for mobile
    app.route('/records/mob/create/')
        .post(records.hasApiKey, records.hasSecretKey, records.create);
    
    // update record for mobile
    app.route('/records/mob/return/:recordId')
        .put(records.hasApiKey, records.hasSecretKey, records.return);

	app.route('/records/:recordId')
		.get(users.requiresLogin, records.read)
		.put(users.requiresLogin, records.hasAuthorization, records.update)
		.delete(users.requiresLogin, records.hasAdminRole, records.delete);

	// Finish by binding the Record middleware
	app.param('recordId', records.recordByID);
	app.param('mId', records.recordHistoryByMemberID);
};
