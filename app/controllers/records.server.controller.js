'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Record = mongoose.model('Record'),
	Member = mongoose.model('Member'),
    Inventory = mongoose.model('Inventory'),
	_ = require('lodash');

/**
 * Create a Record
 */
exports.create = function(req, res) {
	var record = new Record({
		member: req.body.member._id,
		inventory: req.body.inventory._id,
		status: req.body.status
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
 * create a record from mobile app. just need mId and bId
 */
exports.createFromMob = function(req, res){
    //var member = Member.findById(req.body.mId);
    
    var record = new Record({
        member: req.body.mId,
        inventory: req.body.bId,
        status: req.body.status
    });

    record.save(function(err){
        if(err){
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            // change the inventory with the inv_code
            // todo: should be written in inventories's router and controller, 
            //       to be quick , just code here. by ghh@2015.6.3
            
            var inventory = Inventory.findById(req.body.bId);
            inventory.isRent = true;
            inventroy.save(function(err){
                if(err){
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else {
                    res.jsonp(record);
                }
            });
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
	Record.find()
		.sort('-start_date')
		.populate('member')
		.exec(function(err, records) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				res.jsonp(records);
			}
		});
};

exports.listByMemberId = function(req, res){
    res.jsonp(req.records);
};

/**
 * Record middleware
 */
exports.recordByID = function(req, res, next, id) {
	Record.findById(id)
        .populate('inventory')
		.exec(function(err, record) {
		if (err)
			return next(err);
		if (! record)
			return next(new Error('Failed to load Record ' + id));
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
							// res.jsonp(records);
                            req.records = records;
                            next();
							//console.log('server log for records of member ' + mid + ' :' + records);
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

exports.hasApiKey = function(req, res, next) {
    console.log('get records with an api key for test');
    next();
};

exports.hasSecretKey = function(req, res, next) {
    console.log('put or create records with secret key for test');
    next();
};

// return book to the lib.
exports.return = function(req, res) {
	var record = req.record ;

	//record = _.extend(record , req.body);
    record.status = 'A';
    record.return_date = Date.now();

    
	record.save(function(err) {
		if (err) {
            var err_msg_of_update_record = errorHandler.getErrorMessage(err);
        } else {
            Inventory.findById(record.inventory.id, function(err, book){
                book.isRent = false;
                book.save(function(err){
                    if (err) {
                        return res.status(400).send({
                            message: err_msg_of_update_record + '\nerror to update the book to return back'
                        });
                    } else {
                        if (err_msg_of_update_record){
                            return res.status(400).send({message: err_msg_of_update_record });
                        }
                    }
                });
            });

			res.jsonp(record);
		}
	});
};
