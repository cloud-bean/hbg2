require('./models/inventory.server.model');
var mongoose = require('mongoose');
var Inventory = mongoose.model('Inventory');
var async = require('async');

var config= {
    db: 'your-mongodb-connect-string'
};

// Bootstrap db connection
var db = mongoose.connect(config.db, function(err) {
    if (err) {
        console.error('Could not connect to MongoDB!');
    } else {

        Inventory.distinct('inv_code', function(err, items) {
            if (err && !items) {
                return next(err);
            }

            var uniqueResults = [];
            async.each(items, function (item, callback) {
                Inventory.findOne({inv_code: item}, function (err, inventory) {
                    uniqueResults.push(inventory);
                    callback(null);
                })
            }, function (err) {
                uniqueResults.forEach(function(eachInventory) {
                    console.log('');
                    console.log(JSON.stringify(eachInventory));
                    console.log('');
                });
            });
        });
    }
});


