'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
    mongoose = require('mongoose'),
    Record = mongoose.model('Record'),
    Member = mongoose.model('Member'),
    Inventory = mongoose.model('Inventory');

/**
 * Globals
 */

var record, 
    member, 
    inventory;

/**
 * Unit tests
 */
describe('Record Model Unit Tests:', function() {
    beforeEach(function(done) {

        inventory = new Inventory({
            inv_code: '4100012345678',
            name: 'test for inventory- books title'
        });

        member = new Member({
            phone_number: '14220987643',
            baby_name: 'baby-test-name',
            card_number: '987654321'
        });

        var tasks_count = 2;
        var tasks_completed = 0;

        var isCompleted = function() {
            tasks_completed++;
            if (tasks_completed === tasks_count) {
                record = new Record({
                    member: member,
                    inventory: inventory
                });
                done();
            }
        };

        inventory.save(isCompleted);
        member.save(isCompleted);

    });

    describe('Method Save', function() {

        it('should be able to save without problems', function(done) {

            return record.save(function(err) {
                if (err) console.log(err);
                should.not.exist(err);
                done();
            });
        });

        it('should not be able to save record without member', function(done) {
            record.member = null;
            return record.save(function(err) {
                should.exist(err);
                done();
            });
        });

        it('should not be able to save record without inventory', function(done) {
            record.inventory = null;
            return record.save(function(err) {
                should.exist(err);
                done();
            });
        });


    });

    afterEach(function(done) {
        Record.remove().exec();
        Member.remove().exec();
        Inventory.remove().exec();
        done();
    });
});
