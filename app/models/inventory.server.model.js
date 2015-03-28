'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Inventory Schema
 */
var InventorySchema = new Schema({
  location: {
    type: String,     // 库存位置
    default: ''
  },
  inv_code: {         // 入库编码
    type: String,
    default: ''
  },
  in_time: {          // 入库时间
    type: Date,
    default: Date.now
  },
  isRent: {
    type: Boolean,    // 是否借出
    default: false
  },
  skuid: {            // 书商品编号(jd.com)
    type: String,
    default: ''
  },
  url: {              // 书网页地址（jd.com）
    type: String,
    default: ''
  },
  name: {             // 图书书名
    type: String,
    required: true
  },
  isbn: String,       // 图书isbn
  img: String,        // 图书封面图片
  price: Number,      // wMaprice
  author: String,     // 图书作者
  pub_by: String,     // 出版社
  pub_date: Date,     // 出版时间
  pre_id: String,     // 原来mysql中的id
  tags: [{
        name: String
  }]      // 标签
}, {
  collection: 'inventory'
});

InventorySchema.statics.findOneByInvCode = function (inv_code, callback) {
    this.findOne({inv_code: inv_code}, callback);
};

InventorySchema.statics.findByName = function (name, callback) {
    this.find({name: new RegExp(name,'i')}, callback);
};

InventorySchema.statics.findByIsbn = function (isbn, callback) {
    this.find({isbn: new RegExp(isbn,'i')}, callback);
};

mongoose.model('Inventory', InventorySchema);
