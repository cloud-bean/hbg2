'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Inventory = mongoose.model('Inventory'),
	_ = require('lodash');

var maxDefaultQuerySize = 100;
var defaultPageSize = 25;


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
    if(req.inventories){
        res.jsonp(req.inventories);
    } else {
	    Inventory.find()
	    	.limit(maxDefaultQuerySize)
	    	.sort('-created')
	    	.exec(function(err, inventories) {
	    		if (err) {
	    			return res.status(400).send({
	    				message: errorHandler.getErrorMessage(err)
	    			});
	    		} else {
	    			res.jsonp(inventories);
	    		}
	    	});
    }
};

/**
 * list of inventories for mobile.
 * just return the list property:
 * @id
 * name
 * inv_code
 * location
 * isRent
 * img
 * tags
*/
exports.listForMobile = function(req, res) {
	var simpleDataList = [];
    for(var i=0; i < req.inventories.length; i++) {
        var inventory = req.inventories[i];
        var tagArr = [];
        for(var j=0; j < inventory.tags.length; j++) {
            tagArr.push(inventory.tags[j].name);
        }
        var simple_data = {
            id: inventory.id,
            name: inventory.name,
            inv_code: inventory.inv_code,
            location: inventory.location,
            isRent: inventory.isRent,
            img: inventory.img,
            tags: tagArr.toString()
        };
        simpleDataList.push(simple_data);
    }
	res.jsonp(simpleDataList);
};


/**
 * list of Inventories per page
 */
exports.listWithPage = function(req, res) {
	var _page = req.params.page || 1;
	var _pageSize = req.params.size || defaultPageSize;
	var offset = (_page - 1) * _pageSize;

	Inventory.find()
		.skip(offset).limit(_pageSize)
		.sort('-created')
		.exec(function(err, inventories) {
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
            req.inventories = inventories;
            next();
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
                req.inventories = inventories;
                next();
			}
		});
};

/**
 * Inventory middleware
 */
exports.inventoryByID = function(req, res, next, id) {
	Inventory.findById(id, function(err, inventory) {
		if (err)
			return next(err);
		if (! inventory)
            return res.status(500).send('no data');
		req.inventory = inventory ;
		next();
	});
};

/**
 * Inventory middleware search by inv_code
 */
exports.inventoryByInvCode = function (req, res, next, inv_code) {
	Inventory.findOneByInvCode(inv_code, function(err, inventory) {
		if (err)
			return next(err);
		if (! inventory)
            return res.status(500).send('没有编码为' + inv_code + '的绘本');
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

exports.totalSize = function (req, res, next) {
    Inventory.find(function (err, inventories) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp({size: inventories.length});
        }
    });
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
