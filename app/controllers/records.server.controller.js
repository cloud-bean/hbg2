'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Record = mongoose.model('Record'),
	_ = require('lodash');

/**
 * Create a Record
 */
exports.create = function(req, res) {
	var record = new Record(req.body);
	record.user = req.user;

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
 * List of Records
 */
exports.list = function(req, res) { 
	Record.find().sort('-created').populate('user', 'displayName').exec(function(err, records) {
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
 * Record authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.record.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
