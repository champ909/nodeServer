var express = require('express');
var router = express.Router();
var User = require('../models/user');

// GET list of all users.
router.get('/', function(req, res, next) {
  User.find( {}, (err, users) => {
    res.send(users);
  });
});

// GET a particular user by username.
router.get('/:username', function(req, res, next) {
  const username = req.params.username;
  User.find( {username: username}, (err, user) => {
    res.send(user);
  });
});

router.post('/userpost', function(req, res, next) {
  res.send(req.body);
});

module.exports = router;
