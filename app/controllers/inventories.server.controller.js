'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Inventory = mongoose.model('Inventory'),
	_ = require('lodash');

/**
 * Create a Inventory
 */
exports.create = function(req, res) {
	var inventory = new Inventory(req.body);

	inventory.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(inventory);
		}
	});
};

/**
 * Show the current Inventory
 */
exports.read = function(req, res) {
	res.jsonp(req.inventory);
};

/**
 * Update a Inventory
 */
exports.update = function(req, res) {
	var inventory = req.inventory ;

	inventory = _.extend(inventory , req.body);

	inventory.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(inventory);
		}
	});
};

/**
 * Delete an Inventory
 */
exports.delete = function(req, res) {
	var inventory = req.inventory ;

	inventory.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(inventory);
		}
	});
};

/**
 * List of Inventories
 */
exports.list = function(req, res) {
	// TODO: For development .limit to 10. need to remove in production env.
	Inventory.find().sort('-created').limit(12).populate('user', 'displayName').exec(function(err, inventories) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(inventories);
		}
	});
};


/**
 * Member middleware find one inventory by inv_code
 */
exports.oneByInvCode = function (req, res, next, inv_code) {
    Inventory.findOneByInvCode(inv_code, function(err, inventory) {
        if (err) return next(err);
        if (! inventory) return next(new Error('Faild to load Inventory with inv_code ' + inv_code));
        req.inventory = inventory;
        next();
    });
};


/**
 * Member middleware find inventories  by isbn
 */
exports.listsByIsbn = function (req, res, next, isbn) {
    Inventory.findByIsbn(isbn, function(err, inventories) {
        if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(inventories);
		}
    });
};


/**
 * Member middleware find one inventory by name
 */
exports.listsByName = function (req, res, next, name) {
    Inventory.findByName(name, function(err, inventories) {
        if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(inventories);
		}
    });
};

/**
 * Inventory middleware
 */
exports.inventoryByID = function(req, res, next, id) {
	Inventory.findById(id).populate('user', 'displayName').exec(function(err, inventory) {
		if (err) return next(err);
		if (! inventory) return next(new Error('Failed to load Inventory ' + id));
		req.inventory = inventory ;
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

exports.hasAdminRole = function(req, res, next) {
    if (!isAdmin(req.user.roles))  {
        return res.status(403).send('User is not authorized');
    }

    next();
};

// /**
//  * Inventory authorization middleware
//  */
// exports.hasAuthorization = function(req, res, next) {
// 	if (req.inventory.user.id !== req.user.id || !hasAdminRole(req.user.roles)) {
// 		return res.status(403).send('User is not authorized');
// 	}
// 	next();
// };
