var request = require('request');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var util = require('../lib/utility');
var db = require('../app/config');
var User = require('../app/models/user');
var Link = require('../app/models/link');

exports.renderIndex = function (req, res) {
  res.render('index');
};

exports.signupUserForm = function (req, res) {
  res.render('signup');
};

exports.loginUserForm = function (req, res) {
  res.render('login');
};

exports.logoutUser = function (req, res) {
  req.session.destroy(function () {
    res.redirect('/login');
  });
};

exports.fetchLinks = function (req, res) {
  return Link.find().exec(function (err, results) {
    if (err) {
      console.error(err)
    } else {
      res.status(200).send(results)
    }
  })
};

exports.saveLink = function (req, res) {
  var uri = req.body.url;

  if (!util.isValidUrl(uri)) {
    return res.sendStatus(404);
  }

  Link.findOne({ url: uri }).exec(function (err, found) {
    if (found) {
      res.status(200).send(found);
    } else {
      util.getUrlTitle(uri, function (err, title) {
        if (err) {
          return res.sendStatus(404);
        }
        var newLink = new Link({
          url: uri,
          title: title,
          baseUrl: req.headers.host
        });
        newLink.save(function (err, newLink) {
          if (err) {
            console.error(err)
          } else {
            res.status(200).send(newLink)
          }
        });
      });
    }
  });
};

exports.loginUser = function (req, res) {
  var username = req.body.username;
  var password = req.body.password;
  User.findOne({ username: username }).exec(function (err, user) {
    if (!user) {
      res.redirect('/login')
    } else {
      user.comparePassword(password, function (match) {
        if (match) {
          util.createSession(req, res, user);
        } else {
          res.redirect('/')
        }
      });
    }
  });
};

exports.signupUser = function (req, res) {
  var username = req.body.username;
  var password = req.body.password;
  User.findOne({ username: username }).exec(function (err, user) {
    if (!user) {
      var newUser = new User({
        username: username,
        password: password
      });
      newUser.save(function (err, newUser) {
        if (err) {
          console.error(err)
        } else {
          util.createSession(req, res, newUser)
        };
      });
    } else {
      console.log('Account already exists')
      res.redirect('/signup');
    }
  });
};

exports.navToLink = function (req, res) {
  Link.findOne({ code: req.params[0] })
    .then(function (link) {
      if (!link) {
        console.log('theres no link!')
        res.redirect('/')
      } else {
        link.visits = link.visits + 1;
        link.save(function (err, link) {
          if (err) {
            console.log(err)
          } else {
            console.log(link, 'link in navToLink')
            return res.redirect(link.url)
          }
        })
      }
    });
};