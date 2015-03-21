'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Record = mongoose.model('Record'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, record;

/**
 * Record routes tests
 */
describe('Record CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Record
		user.save(function() {
			record = {
				name: 'Record Name'
			};

			done();
		});
	});

	it('should be able to save Record instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Record
				agent.post('/records')
					.send(record)
					.expect(200)
					.end(function(recordSaveErr, recordSaveRes) {
						// Handle Record save error
						if (recordSaveErr) done(recordSaveErr);

						// Get a list of Records
						agent.get('/records')
							.end(function(recordsGetErr, recordsGetRes) {
								// Handle Record save error
								if (recordsGetErr) done(recordsGetErr);

								// Get Records list
								var records = recordsGetRes.body;

								// Set assertions
								(records[0].user._id).should.equal(userId);
								(records[0].name).should.match('Record Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Record instance if not logged in', function(done) {
		agent.post('/records')
			.send(record)
			.expect(401)
			.end(function(recordSaveErr, recordSaveRes) {
				// Call the assertion callback
				done(recordSaveErr);
			});
	});

	it('should not be able to save Record instance if no name is provided', function(done) {
		// Invalidate name field
		record.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Record
				agent.post('/records')
					.send(record)
					.expect(400)
					.end(function(recordSaveErr, recordSaveRes) {
						// Set message assertion
						(recordSaveRes.body.message).should.match('Please fill Record name');
						
						// Handle Record save error
						done(recordSaveErr);
					});
			});
	});

	it('should be able to update Record instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Record
				agent.post('/records')
					.send(record)
					.expect(200)
					.end(function(recordSaveErr, recordSaveRes) {
						// Handle Record save error
						if (recordSaveErr) done(recordSaveErr);

						// Update Record name
						record.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Record
						agent.put('/records/' + recordSaveRes.body._id)
							.send(record)
							.expect(200)
							.end(function(recordUpdateErr, recordUpdateRes) {
								// Handle Record update error
								if (recordUpdateErr) done(recordUpdateErr);

								// Set assertions
								(recordUpdateRes.body._id).should.equal(recordSaveRes.body._id);
								(recordUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Records if not signed in', function(done) {
		// Create new Record model instance
		var recordObj = new Record(record);

		// Save the Record
		recordObj.save(function() {
			// Request Records
			request(app).get('/records')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Record if not signed in', function(done) {
		// Create new Record model instance
		var recordObj = new Record(record);

		// Save the Record
		recordObj.save(function() {
			request(app).get('/records/' + recordObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', record.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Record instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Record
				agent.post('/records')
					.send(record)
					.expect(200)
					.end(function(recordSaveErr, recordSaveRes) {
						// Handle Record save error
						if (recordSaveErr) done(recordSaveErr);

						// Delete existing Record
						agent.delete('/records/' + recordSaveRes.body._id)
							.send(record)
							.expect(200)
							.end(function(recordDeleteErr, recordDeleteRes) {
								// Handle Record error error
								if (recordDeleteErr) done(recordDeleteErr);

								// Set assertions
								(recordDeleteRes.body._id).should.equal(recordSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Record instance if not signed in', function(done) {
		// Set Record user 
		record.user = user;

		// Create new Record model instance
		var recordObj = new Record(record);

		// Save the Record
		recordObj.save(function() {
			// Try deleting Record
			request(app).delete('/records/' + recordObj._id)
			.expect(401)
			.end(function(recordDeleteErr, recordDeleteRes) {
				// Set message assertion
				(recordDeleteRes.body.message).should.match('User is not logged in');

				// Handle Record error error
				done(recordDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Record.remove().exec();
		done();
	});
});