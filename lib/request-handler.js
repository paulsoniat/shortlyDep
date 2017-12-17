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

exports.fetchLinks = function (req, res) {
  Link.find({}, function (err, links) {
    if (err) {
      console.error(err);
      res.send(404);
    } else {
      res.send(200, links);
    }
  });
  // Links.reset().fetch().then(function(links) {
  //   res.send(200, links.models);
  // })
};

// exports.saveLink = function(req, res) {
//   var uri = req.body.url;

//   if (!util.isValidUrl(uri)) {
//     console.log('Not a valid url: ', uri);
//     return res.sendStatus(404);
//   }

//   Link.findOne({url: uri})
//   .then(link => {
//     if (!link) {
//       let code = crypto.createHash('sha1');
//       code.update(uri);
//       code = code.digest('hex').slice(0, 5);
    
//       util.getUrlTitle(uri, (err, title) => {
//         if (err) {
//           console.log(err);
//           return res.sendStatus(404);
//         } else {
//           const newUrl = new Link({
//             url: uri,
//             title: title,
//             baseUrl: req.headers.origin,
//             code: code
//           });
//           newUrl.save()
//           .then((newLink) => {
//             res.status(200).send(newLink);
//           })
//           .catch(err => {
//             console.error(err);
//           });
//         }
//       });
//     } else {
//       res.status(200).send(link);
//     }
//   })

// };

exports.saveLink = function (req, res) {

  var uri = req.body.url;

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.send(404);
  }

  Link.find({ url: uri }, function (err, link) {
    if (link.length > 0) {
      res.send(200, link[0]);
    } else {
      util.getUrlTitle(uri, function (err, title) {
        if (err) {
          console.log(err);
          return res.send(404);
        }

        var newLink = new Link({
          url: uri,
          title: title,
          base_url: req.headers.origin
        });
        newLink.save(function (err, newLink) {
          res.send(200, newLink);
        });
      });
    }
  });
}

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

exports.navToLink = function (req, res) {
  Link.find({ code: req.params[0] }, function (err, links) {
    if (err) {
      res.send(404);
    }
    var link = links[0];
    if (!link) {
      res.redirect('/');
    } else {
      link.visits++;
      link.save(function (err, link) {
        if (err) {
          res.send(404);
        }
        return res.redirect(link.url);
      });
    }
  });
};