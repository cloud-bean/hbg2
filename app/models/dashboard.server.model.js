'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    utils = requires('../utils'),
    defaultSelection = 'member updateTime';

var DashboardSchema = new Schema({
    memberData: {type: String},
    inventoryData: {type: String},
    createTime: { type: Date},
    updateTime: { type: Date}
});


DashboardSchema.path('memberData').validate(function (memberString) {
    return utils.isJson(memberString);
}, 'Invalid JSON string');

DashboardSchema.path('inventoryData').validate(function (inventoryString) {
    return utils.isJson(inventoryString);
}, 'Invalid JSON string');


DashboardSchema.pre('validate', function(next) {
    var currentTime = new Date();
    if (this.isNew){
        this.createTime = currentTime;
        this.updateTime = currentTime;
    } else {
        this.updateTime = currentTime;
    }
    next();
});

DashboardSchema.statics = {
    getLeast: function (cb) {
        this.findOne()
            .sort({ field: '-updateTime' })
            .limit(1)
            .exec(cb);
    },

    load: function (options, cb) {
        options.select = options.select || defaultSelection;
        this.findOne(options.criteria)
            .select(options.select)
            .exec(cb);
    },

    loadAll: function (options, cb) {
        options.select = options.select || defaultSelection;
        this.find(options.criteria)
            .select(options.select)
            .limit(options.limit)
            .sort(options.sortBy || '-updateTime')
            .exec(cb);
    }

};

module.exports = mongoose.model('dashboard', DashboardSchema, 'dashboards');
