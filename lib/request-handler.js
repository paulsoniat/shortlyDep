var request = require('request');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var util = require('../lib/utility');

var db = require('../app/config');
var User = require('../app/models/user');
var Link = require('../app/models/link');

exports.renderIndex = function(req, res) {
  res.render('index');
};

exports.signupUserForm = function(req, res) {
  res.render('signup');
};

exports.loginUserForm = function(req, res) {
  res.render('login');
};

exports.logoutUser = function(req, res) {
  req.session.destroy(function() {
    res.redirect('/login');
  });
};

exports.fetchLinks = function(req, res) {
  Link.find({})
  .then(links => {
    res.status(200).send(links);
  })
};

exports.saveLink = function(req, res) {
  var uri = req.body.url;

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.sendStatus(404);
  }

  Link.findOne({url: uri})
  .then(link => {
    if (!link) {
      let code = crypto.createHash('sha1');
      code.update(uri);
      code = code.digest('hex').slice(0, 5);
    
      util.getUrlTitle(uri, (err, title) => {
        if (err) {
          console.log(err);
          return res.sendStatus(404);
        } else {
          const newUrl = new Link({
            url: uri,
            title: title,
            baseUrl: req.headers.origin,
            code: code
          });
          newUrl.save()
          .then((newLink) => {
            res.status(200).send(newLink);
          })
          .catch(err => {
            console.error(err);
          });
        }
      });
    } else {
      res.status(200).send(link);
    }
  })

};

exports.loginUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.findOne({username: username})
  .then(user => {
    if (!user) {
      res.redirect('/login');
    } else {
      if (user.password === password) {
        util.createSession(req, res, user);
      } else {
        res.redirect('/login');
      }
    }
  })
};

exports.signupUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  User.findOne({username: username})
    .then(user => {
      if (!user) {
        let newUser = new User({
          username: username,
          password: password
        })
        newUser.save((err, response) => {
          if (err) {
            console.error(err);
          } else {
            util.createSession(req, res, newUser);
          }
        });
      } else {
        console.log('Account already exists');
        res.redirect('/signup');
      }
    });
};

exports.navToLink = function(req, res) {
  let code =  req.params[0];
  Link.findOne({code: code})
    .then((link) => {
      if (!link) {
        res.redict('/');
      } else {
        res.redirect(link.url);
      }
    })
};