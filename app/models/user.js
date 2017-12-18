var db = require('../config');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');
const mongoose = require('mongoose');



db.userSchema.methods.comparePassword = (attemptedPassword, callback) => {
  let isMatch = attemptedPassword === this.password;
  callback(isMatch);
};

db.userSchema.methods.hashPassword = () => {
  var cipher = Promise.promisify(bcrypt.hash);
  return cipher(this.password, null, null).bind(this)
    .then(function (hash) {
      this.password = hash;
    });
};

let User = mongoose.model('User', db.userSchema);


module.exports = User;
