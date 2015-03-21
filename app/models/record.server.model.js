'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Record Schema
 */
var RecordSchema = new Schema({
  inventory: {
    type: Schema.ObjectId,
    ref: 'Inventory',
    required: true
  },
  member: {
    type: Schema.ObjectId,
    ref: 'Member',
    required: true
  },
  start_date: {
    type: Date,
    default: Date.now
  },
  status: String,    // R 借阅中， A 已经归还
  return_date: Date
}, {
  collection: 'record'
});


mongoose.model('Record', RecordSchema);
