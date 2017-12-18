// var path = require('path');
// var knex = require('knex')({
//   client: 'sqlite3',
//   connection: {
//     filename: path.join(__dirname, '../db/shortly.sqlite')
//   },
//   useNullAsDefault: true
// });

// var db = require('bookshelf')(knex);

////THIS IS OUR CONNECTION TO THE MONGO DATABASE!_@!$*!$@_$

const mongoose = require('mongoose');

mongoose.connect('mongodb://paulanderik:paulanderik@ds151702.mlab.com:51702/paulanderic123', {useMongoClient: true});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error'));

db.once('open', function() {
  console.log('connected');
});

let linkSchema = mongoose.Schema({
  url: String,
  title: String,
  baseUrl: String,
  visits: { type: Number, default: 0 },
  code: String
});

let userSchema = mongoose.Schema({
  username: { type: String, unique: true },
  password: String,
});



module.exports.linkSchema = linkSchema;

module.exports.userSchema = userSchema;

//create a save user and save url function

// module.exports.saveUser = (userObj) => {
//   var user = new User(userObj);
//   // console.log(user);
//   return new Promise((reject, resolve) => {
//     db.user.save((err, res) => {
//       if (err) {
//         console.log(err, null);
//       }
//       if (res) {
//         console.log(null, 'resolved');
//       }
//     });
//   });
// };

// module.exports.saveUrl = (urlObj) => {
//   var link = new Link(urlObj);
//   // console.log(link);
//   return new Promise((reject, resolve) => {
//     db.link.save((err, res) => {
//       if (err) {
//         console.log(err, null);
//       }
//       if (res) {
//         console.log(null, 'resolved');
//       }
//     });
//   });
// };


// db.knex.schema.hasTable('urls').then(function(exists) {
//   if (!exists) {
//     db.knex.schema.createTable('urls', function (link) {
//       link.increments('id').primary();
//       link.string('url', 255);
//       link.string('baseUrl', 255);
//       link.string('code', 100);
//       link.string('title', 255);
//       link.integer('visits');
//       link.timestamps();
//     }).then(function (table) {
//       console.log('Created Table', table);
//     });
//   }
// });


// db.knex.schema.hasTable('users').then(function(exists) {
//   if (!exists) {
//     db.knex.schema.createTable('users', function (user) {
//       user.increments('id').primary();
//       user.string('username', 100).unique();
//       user.string('password', 100);
//       user.timestamps();
//     }).then(function (table) {
//       console.log('Created Table', table);
//     });
//   }
// });
