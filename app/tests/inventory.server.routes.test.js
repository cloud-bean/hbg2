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
var credentials_admin, credentials_member, user_admin, user_member, inventory;

/**
 * Inventory routes tests
 */
describe('Inventory CRUD tests', function() {
    beforeEach(function(done) {
        // Create user credentials
        credentials_admin = {
            username: 'username',
            password: 'password'
        };

        credentials_member = {
            username: 'username_member',
            password: 'password'
        };

        // Create a new user with admin role
        user_admin = new User({
            firstName: 'Full',
            lastName: 'Name',
            displayName: 'Full Name',
            email: 'test@test.com',
            username: credentials_admin.username,
            password: credentials_admin.password,
            provider: 'local',
            roles: ['admin']
        });

        // Create a new user without admin role
        user_member = new User({
            firstName: 'Full',
            lastName: 'Name',
            displayName: 'Full Name',
            email: 'test@test.com',
            username: credentials_member.username,
            password: credentials_member.password,
            provider: 'local',
        });

        var tasks_count = 2;
        var tasks_completed = 0;

        var isCompleted = function() {
            tasks_completed++;
            if (tasks_completed === tasks_count) {
                inventory = {
                    name: 'Inventory Name'
                };
                done();
            }

        };

        user_admin.save(isCompleted);
        user_member.save(isCompleted);

    });

    describe('SAVE INVENTORY: [as_admin, as_member, not signin]', function(done) {
        it('should be able to save Inventory instance if logged in as admin', function(done) {
            agent.post('/auth/signin')
                .send(credentials_admin)
                .expect(200)
                .end(function(signinErr, signinRes) {
                    // Handle signin error
                    if (signinErr) done(signinErr);

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
                                    (inventories[0].name).should.match('Inventory Name');

                                    // Call the assertion callback
                                    done();
                                });
                        });
                });
        });

        it('should not be able to save Inventory instance if logged in as member', function(done) {
            agent.post('/auth/signin')
                .send(credentials_member)
                .expect(200)
                .end(function(signinErr, signinRes) {
                    // Handle signin error
                    if (signinErr) done(signinErr);

                    // Save a new Inventory
                    agent.post('/inventories')
                        .send(inventory)
                        .expect(403)
                        .end(function(inventorySaveErr, inventorySaveRes) {
                            done(inventorySaveErr);
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
    });

    describe('GET INVENTORY LIST', function(done) {
        it('should be able to get a list of Inventories if not signed in', function(done) {
            // Create new Inventory model instance
            var inventoryObj = new Inventory(inventory);

            // Save the Inventory
            inventoryObj.save(function() {
                // Request Inventories
                agent.get('/inventories')
                    .end(function(req, res) {
                        // Set assertion
                        res.body.should.be.an.Array.with.lengthOf(1);
                        res.body[0].name.should.be.equal('Inventory Name');
                        // Call the assertion callback
                        done();
                    });

            });
        });
    });

    describe('UPDATE INVENTORY: [as_admin, as_member, not signin]', function(done) {
        it('should be able to update Inventory instance if signed in as admin', function(done) {
            agent.post('/auth/signin')
                .send(credentials_admin)
                .expect(200)
                .end(function(signinErr, signinRes) {
                    // Handle signin error
                    if (signinErr) done(signinErr);

                    // Get the userId
                    var userId = user_admin.id;

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

        it('should not be able to update Inventory instance if signed in as member', function(done) {
            agent.post('/auth/signin')
                .send(credentials_member)
                .expect(200)
                .end(function(signinErr, signinRes) {
                    // Handle signin error
                    if (signinErr) done(signinErr);

                    // Save a new Inventory
                    agent.post('/inventories')
                        .send(inventory)
                        .expect(403)
                        .end(function(inventorySaveErr, inventorySaveRes) {
                            // Handle Inventory save error
                            done(inventorySaveErr);

                        });
                });
        });

        it('should not be able to update Inventory instance if not signed in', function(done) {
            agent.post('/inventories')
                .send(inventory)
                .expect(401)
                .end(function(inventorySaveErr, inventorySaveRes) {
                    // Handle Inventory save error
                    done(inventorySaveErr);

                });
        });
    });


    it('should be able to get a single Inventory if not signed in', function(done) {
        // Create new Inventory model instance
        var inventoryObj = new Inventory(inventory);

        // Save the Inventory
        inventoryObj.save(function() {
            agent.get('/inventories/' + inventoryObj._id)
                .end(function(req, res) {
                    // Set assertion
                    res.body.should.be.an.Object.with.property('name', inventory.name);

                    // Call the assertion callback
                    done();
                });
        });
    });


    describe('DELETE INVENTORY: [as_admin, as_member, not signed in]', function(done) {
        it('should be able to delete Inventory instance if signed in as admin', function(done) {
            agent.post('/auth/signin')
                .send(credentials_admin)
                .expect(200)
                .end(function(signinErr, signinRes) {
                    // Handle signin error
                    if (signinErr) done(signinErr);

                    // Get the userId
                    var userId = user_admin.id;

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

		it('should not be able to delete Inventory instance if signed in as member', function(done) {
            // Create new Inventory model instance
            var inventoryObj = new Inventory(inventory);

            // Save the Inventory
            inventoryObj.save(function() {
            	agent.post('/auth/signin')
                .send(credentials_member)
                .expect(200)
                .end(function(signinErr, signinRes) {
                    // Handle signin error
                    if (signinErr) done(signinErr);
               		
               		// Try deleting Inventory
                	agent.delete('/inventories/' + inventoryObj._id)
                    .expect(403)
                    .end(function(inventoryDeleteErr, inventoryDeleteRes) {
                        // Handle Inventory error error
                        done(inventoryDeleteErr);
                    });
                });

            });
        });

        it('should not be able to delete Inventory instance if not signed in', function(done) {
            // Set Inventory user 
            inventory.user = user_admin;

            // Create new Inventory model instance
            var inventoryObj = new Inventory(inventory);

            // Save the Inventory
            inventoryObj.save(function() {
                // Try deleting Inventory
                agent.delete('/inventories/' + inventoryObj._id)
                    .expect(401)
                    .end(function(inventoryDeleteErr, inventoryDeleteRes) {
                        // Handle Inventory error error
                        done(inventoryDeleteErr);
                    });

            });
        });
    });


    afterEach(function(done) {
        User.remove().exec();
        Inventory.remove().exec();
        done();
    });
});
