var db = require('../config');
var crypto = require('crypto');
const mongoose = require('mongoose');



db.linkSchema.methods.genCode = function () {
  var shasum = crypto.createHash('sha1');
  shasum.update(this.url);
  this.code = shasum.digest('hex').slice(0, 5);
};

db.linkSchema.pre('save', function (next) {
  this.genCode();
  next();
});

db.linkSchema.pre('init', function (next, link) {
  var shasum = crypto.createHash('sha1');
  shasum.update(link.url);
  link.code = shasum.digest('hex').slice(0, 5);
  next()
});

let Link = mongoose.model('Link', db.linkSchema);


module.exports = Link;