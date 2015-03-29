'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Record = mongoose.model('Record'),
	Member = mongoose.model('Member'),
	_ = require('lodash');

/**
 * Create a Record
 */
exports.create = function(req, res) {
	var record = new Record({
		member: req.body.member._id,
		inventory: req.body.inventory._id,
		status: req.body.status,
	});
	record.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err) 
			});
		} else {
			res.jsonp(record);
		}
	});
};

/**
 * Show the current Record
 */
exports.read = function(req, res) {
	res.jsonp(req.record);
};

/**
 * Update a Record
 */
exports.update = function(req, res) {
	var record = req.record ;

	record = _.extend(record , req.body);

	record.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(record);
		}
	});
};

/**
 * Delete an Record
 */
exports.delete = function(req, res) {
	var record = req.record ;

	record.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(record);
		}
	});
};

/**
 * List of Records, 外键用poplulate计算出来。
 */
exports.list = function(req, res) { 
	Record.find().sort('-start_date').populate('member').exec(function(err, records) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(records);
		}
	});
};

/**
 * Record middleware
 */
exports.recordByID = function(req, res, next, id) { 
	Record.findById(id).populate('user', 'displayName').exec(function(err, record) {
		if (err) return next(err);
		if (! record) return next(new Error('Failed to load Record ' + id));
		req.record = record ;
		next();
	});
};

/**
 * Record middleware to return the spec member's records.
 */
exports.recordHistoryByMemberID = function (req, res, next, mid) {
    Member.findById(mid, function (err, member) {
        Record.find({member: member})
        .sort('-start_date')
        .populate('inventory')
        .exec(function (err, records) {
	    	if (err) {
	    		return res.status(400).send({
	    			message: errorHandler.getErrorMessage(err)
	    		});
	    	} else {
	    		res.jsonp(records);
	    	}
	    });
    });
};


/** 
 * function to test if 'admin'  in the roles array
 */
var isAdmin = function (roles) {
    var isInAdminRole = false;
    for (var i=0; i<roles.length; i++) {
        if ( roles[i] === 'admin') {
            isInAdminRole = true;
        }
    }
    return isInAdminRole;
};

exports.hasAdminRole = function(req, res, next) {
    if (!isAdmin(req.user.roles))  {
        return res.status(403).send('User is not authorized');
    }

    next();
};

/**
 * Record authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (isAdmin(req.user.roles)) {  // admin , pass
		next();
	} else if (req.user.member && req.user.username === req.user.member.card_number) { // member self, pass
		next();
	} else { //otherwise, forbidden.
		return res.status(403).send('User is not authorized');
	}
};
