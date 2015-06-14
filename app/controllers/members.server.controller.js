'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Member = mongoose.model('Member'),
	Record = mongoose.model('Record'),
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
 * get the current member for mobile app
 */
exports.readMore = function(req, res){
    var count = 0;
    // todo: not good. need to refactor. @2015-5-24
    Record.find({member: req.member})
        .exec(function(err, records) {
            if (err) {
                return res.status(400).send({
                    message: 'faild to get the records of the member'
                });
            } else {
                console.log(records);
                for(var i=0; i<records.length; i++)
                    if(records[i].status === 'R')
                        count++;
                res.jsonp({ member: req.member, rentCount: count});
            }
        });
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
	Member.find()
		.sort('-created')
		//.populate('user', 'displayName')
		.exec(function(err, members) {
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
	Member.findById(id)
		//.populate('user', 'displayName')
		.exec(function(err, member) {
		if (err) return next(err);
		if (! member)
			return next(new Error('Failed to load Member ' + id));
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

exports.memberByPhoneNumber = function(req, res, next, phoneNumber){
    Member.findOneByPhoneNumber(phoneNumber, function(err, member) {
        if (err) return next(err);
        if (! member) return next(new Error('Faild to load Member with phoneNumber' + phoneNumber));
        req.member = member;
        next();
    });
};


/** 
 * function to test if 'admin'  in the roles array
 */
var isAdmin = function (roles) {
    for (var i=0; i<roles.length; i++) {
        if ( roles[i] === 'admin') {
            return true;
        }
    }
    return false;
};

/**
 * Member authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
    // if user.role is admin ; ok
    // or if user.member is req.member._id
    // 管理员有权限；登录的用户绑定的会员和要访问的会员是同一个人，即自己访问和修改自己的会员资料。
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

exports.hasApiKey = function(req, res, next){
   console.log('Todo: there is a Api Key by test.');
   next(); 
};
