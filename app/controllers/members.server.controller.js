'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Member = mongoose.model('Member'),
	_ = require('lodash');

/**
 * Create a Member
 */
exports.create = function(req, res) {
	var member = new Member(req.body);

	member.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(member);
		}
	});
};

/**
 * Show the current Member
 */
exports.read = function(req, res) {
	res.jsonp(req.member);
};

/**
 * Update a Member
 */
exports.update = function(req, res) {
	var member = req.member ;

	member = _.extend(member , req.body);

	member.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(member);
		}
	});
};

/**
 * Delete an Member
 */
exports.delete = function(req, res) {
	var member = req.member ;

	member.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(member);
		}
	});
};

/**
 * List of Members
 */
exports.list = function(req, res) { 
	Member.find().sort('-created').populate('user', 'displayName').exec(function(err, members) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(members);
		}
	});
};

/**
 * Member middleware
 */
exports.memberByID = function(req, res, next, id) { 
	Member.findById(id).populate('user', 'displayName').exec(function(err, member) {
		if (err) return next(err);
		if (! member) return next(new Error('Failed to load Member ' + id));
		req.member = member ;
		next();
	});
};


/**
 * Member middleware find one member by card_number
 */
exports.memberByCardNumber = function (req, res, next, card_number) {
    Member.findOneByCardNumber(card_number, function(err, member) {
        if (err) return next(err);
        if (! member) return next(new Error('Faild to load Member with card_number ' + card_number));
        req.member = member;
        next();
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

/**
 * Member authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
    // TODO: if user.role is admin ; ok
    // TODO: if user.member is req.member._id
    if (!isAdmin(req.user.roles) && req.member._id !== req.user.member) {
        return res.status(403).send('User is not authorized');
    }
	next();
};


exports.hasAdminRole = function(req, res, next) {
    if (!isAdmin(req.user.roles))  {
        return res.status(403).send('User is not authorized');
    }

    next();
};
