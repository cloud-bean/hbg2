'use strict';

var should = require('should'),
    request = require('supertest'),
    app = require('../../server'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Member = mongoose.model('Member'),
    agent = request.agent(app);

/**
 * Globals
 */
var credentials_admin, credentials_member, user_admin, user_member, member;

/**
 * Member routes tests
 */
describe('Member CRUD tests', function() {
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
                member = {
                    card_number: 'Member card number',
                    phone_number: '15002323332',
                    baby_name: 'baby name'
                };
                done();
            }

        };

        user_admin.save(isCompleted);
        user_member.save(isCompleted);
    });

    describe('SAVE MEMBER: [as_admin, as_member, not-signed-in]', function(done) {
        it('should be able to save Member instance if signed in as admin', function(done) {
            agent.post('/auth/signin')
                .send(credentials_admin)
                .expect(200)
                .end(function(signinErr, signinRes) {
                    // Handle signin error
                    if (signinErr) done(signinErr);

                    // Save a new Member
                    agent.post('/members')
                        .send(member)
                        .expect(200)
                        .end(function(memberSaveErr, memberSaveRes) {
                            // Handle Member save error
                            if (memberSaveErr) done(memberSaveErr);

                            // Get a list of Members
                            agent.get('/members')
                                .end(function(membersGetErr, membersGetRes) {
                                    // Handle Member save error
                                    if (membersGetErr) done(membersGetErr);

                                    // Get Members list
                                    var members = membersGetRes.body;

                                    // Set assertions
                                    (members[0].card_number).should.match('Member card number');

                                    // Call the assertion callback
                                    done();
                                });
                        });
                });
        });

        it('should not be able to save Member instance if logged in with member role', function(done) {
            agent.post('/auth/signin')
                .send(credentials_member)
                .expect(200)
                .end(function(signinErr, signinRes) {
                    // Handle signin error
                    if (signinErr) done(signinErr);

                    agent.post('/members')
                        .send(member)
                        .expect(403)
                        .end(function(memberSaveErr, memberSaveRes) {
                            // Call the assertion callback
                            done(memberSaveErr);
                        });
                });
        });

        it('should not be able to save Member instance if not logged in', function(done) {
            agent.post('/members')
                .send(member)
                .expect(401)
                .end(function(memberSaveErr, memberSaveRes) {
                    // Call the assertion callback
                    done(memberSaveErr);
                });
        });

        it('should not be able to save Member instance if no card number is provided', function(done) {
            // Invalidate name field
            member.card_number = '';

            agent.post('/auth/signin')
                .send(credentials_admin)
                .expect(200)
                .end(function(signinErr, signinRes) {
                    // Handle signin error
                    if (signinErr) done(signinErr);

                    // Save a new Member
                    agent.post('/members')
                        .send(member)
                        .expect(400)
                        .end(function(memberSaveErr, memberSaveRes) {
                            // Handle Member save error
                            done(memberSaveErr);
                        });
                });
        });
    })


    describe('UPDATE MEMBER: [as_admin, as_member, not-signed-in]', function(done) {
        it('should be able to update Member instance if signed in as admin', function(done) {
            agent.post('/auth/signin')
                .send(credentials_admin)
                .expect(200)
                .end(function(signinErr, signinRes) {
                    // Handle signin error
                    if (signinErr) done(signinErr);

                    // Save a new Member
                    agent.post('/members')
                        .send(member)
                        .expect(200)
                        .end(function(memberSaveErr, memberSaveRes) {
                            // Handle Member save error
                            if (memberSaveErr) done(memberSaveErr);

                            // Update Member name
                            member.card_number = '12345678';
                            // Update existing Member
                            agent.put('/members/' + memberSaveRes.body._id)
                                .send(member)
                                .expect(200)
                                .end(function(memberUpdateErr, memberUpdateRes) {
                                    // Handle Member update error
                                    if (memberUpdateErr) done(memberUpdateErr);

                                    // Set assertions
                                    (memberUpdateRes.body._id).should.equal(memberSaveRes.body._id);
                                    (memberUpdateRes.body.card_number).should.match('12345678');

                                    // Call the assertion callback
                                    done();
                                });
                        });
                });
        });
    });


    describe('LIST MEMBER: [as_admin, as_member, not-signed-in]', function(done) {
        it('should not be able to get a list of Members if not signed in', function(done) {
            request(app)
                .get('/members')
                .expect(401)
                .end(function(memberDeleteErr, memberDeleteRes) {
                    // Handle Member error error
                    done(memberDeleteErr);
                });
        });

        it('should not be able to get a list of Members if signed in as a member', function(done) {
            agent.post('/auth/signin')
                .send(credentials_member)
                .expect(200)
                .end(function(signinErr, signinRes) {
                    // Handle signin error
                    if (signinErr) done(signinErr);
                    agent.get('/members')
                        .expect(403)
                        .end(function(memberListErr, memberListRes) {
                            // Handle Member error error
                            done(memberListErr);
                        });
                });
        });

        it('should be able to get a list of Members if signed in as a admin', function(done) {
            agent.post('/auth/signin')
                .send(credentials_admin)
                .expect(200)
                .end(function(signinErr, signinRes) {
                    // Handle signin error
                    if (signinErr) done(signinErr);
                    agent.get('/members')
                        .expect(200)
                        .end(function(memberListErr, memberListRes) {
                            // Handle Member error error
                            done(memberListErr);
                        });
                });
        });
    });

    describe('DELETE MEMBER: [as_admin, as_member, not-signed-in]', function(done) {
        it('should not be able to delete the Member instance if not signed in.', function(done) {
            // Create new Member model instance
            var memberObj = new Member(member);

            // Save the Member
            memberObj.save(function() {
                // Try deleting Member

                agent.delete('/members/' + memberObj._id)
                    .expect(401)
                    .end(function(memberDeleteErr, memberDeleteRes) {
                        // Handle Member error error
                        done(memberDeleteErr);
                    });
            });
        });

        it('should not be able to delete the Member instance if signed in without admin role', function(done) {
            // Create new Member model instance
            var memberObj = new Member(member);

            // Save the Member
            memberObj.save(function() {
                // Try deleting Member
                agent.post('/auth/signin')
                    .send(credentials_member)
                    .expect(200)
                    .end(function(signinErr, signinRes) {
                        // Handle signin error
                        if (signinErr) done(signinErr);
                        agent.delete('/members/' + memberObj._id)
                            .expect(403)
                            .end(function(memberDeleteErr, memberDeleteRes) { // Set message assertion
                                done(memberDeleteErr);
                            });
                    });
            });
        });

        it('should be able to delete the Member instance if signed in with admin role', function(done) {
            // Create new Member model instance
            var memberObj = new Member(member);

            // Save the Member
            memberObj.save(function() {
                // Try deleting Member
                agent.post('/auth/signin')
                    .send(credentials_admin)
                    .expect(200)
                    .end(function(signinErr, signinRes) {
                        // Handle signin error
                        if (signinErr) done(signinErr);
                        agent.delete('/members/' + memberObj._id)
                            .expect(200)
                            .end(function(memberDeleteErr, memberDeleteRes) { // Set message assertion
                                done(memberDeleteErr);
                            });
                    });
            });
        });
    });

    describe('GET MEMBER: [as_admin, as_member, not-signed-in]', function(done) {
        it('should not be able to get  Member instance if not signed in ', function(done) {
            var memberObj = new Member(member);

            memberObj.save(function() {
                // try get the member without signed in
                agent.get('/members/' + memberObj._id)
                    .expect(401)
                    .end(function(getErr, getRes) {
                        done(getErr);
                    });
            });
        });

        it('should not be able to get  Member instance if signed in without admin role as member', function(done) {
            var memberObj = new Member(member);

            memberObj.save(function() {
                // sign in as a member without admin role.
                agent.post('/auth/signin')
                    .send(credentials_member)
                    .expect(200)
                    .end(function(signinErr, signinRes) {
                        // Handle signin error
                        if (signinErr) done(signinErr);

                        // try to get the a member instance.
                        agent.get('/members/' + memberObj._id)
                            .expect(403)
                            .end(function(getErr, getRes) {
                                done(getErr);
                            });
                    });
            });
        });

        it('should be able to get a Member instance if signed as admin', function(done) {
            var memberObj = new Member(member);

            memberObj.save(function() {
                // sign in as a member without admin role.
                agent.post('/auth/signin')
                    .send(credentials_admin)
                    .expect(200)
                    .end(function(signinErr, signinRes) {
                        // Handle signin error
                        if (signinErr) done(signinErr);

                        // try to get the a member instance.
                        agent.get('/members/' + memberObj._id)
                            .expect(200)
                            .end(function(getErr, getRes) {
                                done(getErr);
                            });
                    });
            });
        });
    });


    afterEach(function(done) {
        User.remove().exec();
        Member.remove().exec();
        done();
    });
});
