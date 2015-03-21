'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Inventory = mongoose.model('Inventory'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, inventory;

/**
 * Inventory routes tests
 */
describe('Inventory CRUD tests', function() {
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

		// Save a user to the test db and create new Inventory
		user.save(function() {
			inventory = {
				name: 'Inventory Name'
			};

			done();
		});
	});

	it('should be able to save Inventory instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Inventory
				agent.post('/inventories')
					.send(inventory)
					.expect(200)
					.end(function(inventorySaveErr, inventorySaveRes) {
						// Handle Inventory save error
						if (inventorySaveErr) done(inventorySaveErr);

						// Get a list of Inventories
						agent.get('/inventories')
							.end(function(inventoriesGetErr, inventoriesGetRes) {
								// Handle Inventory save error
								if (inventoriesGetErr) done(inventoriesGetErr);

								// Get Inventories list
								var inventories = inventoriesGetRes.body;

								// Set assertions
								(inventories[0].user._id).should.equal(userId);
								(inventories[0].name).should.match('Inventory Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Inventory instance if not logged in', function(done) {
		agent.post('/inventories')
			.send(inventory)
			.expect(401)
			.end(function(inventorySaveErr, inventorySaveRes) {
				// Call the assertion callback
				done(inventorySaveErr);
			});
	});

	it('should not be able to save Inventory instance if no name is provided', function(done) {
		// Invalidate name field
		inventory.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Inventory
				agent.post('/inventories')
					.send(inventory)
					.expect(400)
					.end(function(inventorySaveErr, inventorySaveRes) {
						// Set message assertion
						(inventorySaveRes.body.message).should.match('Please fill Inventory name');
						
						// Handle Inventory save error
						done(inventorySaveErr);
					});
			});
	});

	it('should be able to update Inventory instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Inventory
				agent.post('/inventories')
					.send(inventory)
					.expect(200)
					.end(function(inventorySaveErr, inventorySaveRes) {
						// Handle Inventory save error
						if (inventorySaveErr) done(inventorySaveErr);

						// Update Inventory name
						inventory.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Inventory
						agent.put('/inventories/' + inventorySaveRes.body._id)
							.send(inventory)
							.expect(200)
							.end(function(inventoryUpdateErr, inventoryUpdateRes) {
								// Handle Inventory update error
								if (inventoryUpdateErr) done(inventoryUpdateErr);

								// Set assertions
								(inventoryUpdateRes.body._id).should.equal(inventorySaveRes.body._id);
								(inventoryUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Inventories if not signed in', function(done) {
		// Create new Inventory model instance
		var inventoryObj = new Inventory(inventory);

		// Save the Inventory
		inventoryObj.save(function() {
			// Request Inventories
			request(app).get('/inventories')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Inventory if not signed in', function(done) {
		// Create new Inventory model instance
		var inventoryObj = new Inventory(inventory);

		// Save the Inventory
		inventoryObj.save(function() {
			request(app).get('/inventories/' + inventoryObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', inventory.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Inventory instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Inventory
				agent.post('/inventories')
					.send(inventory)
					.expect(200)
					.end(function(inventorySaveErr, inventorySaveRes) {
						// Handle Inventory save error
						if (inventorySaveErr) done(inventorySaveErr);

						// Delete existing Inventory
						agent.delete('/inventories/' + inventorySaveRes.body._id)
							.send(inventory)
							.expect(200)
							.end(function(inventoryDeleteErr, inventoryDeleteRes) {
								// Handle Inventory error error
								if (inventoryDeleteErr) done(inventoryDeleteErr);

								// Set assertions
								(inventoryDeleteRes.body._id).should.equal(inventorySaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Inventory instance if not signed in', function(done) {
		// Set Inventory user 
		inventory.user = user;

		// Create new Inventory model instance
		var inventoryObj = new Inventory(inventory);

		// Save the Inventory
		inventoryObj.save(function() {
			// Try deleting Inventory
			request(app).delete('/inventories/' + inventoryObj._id)
			.expect(401)
			.end(function(inventoryDeleteErr, inventoryDeleteRes) {
				// Set message assertion
				(inventoryDeleteRes.body.message).should.match('User is not logged in');

				// Handle Inventory error error
				done(inventoryDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Inventory.remove().exec();
		done();
	});
});