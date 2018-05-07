var express = require('express');
var router = express.Router();
var User = require('../models/user');

router.get('/', (req, res, next) => {
  console.log(req.user);
  User.find( {}, ( err, users ) => {
    if ( err ) return next(err);
    res.json( users ); 
  });
});

router.get('/:username', (req, res, next) => {
  console.log(req.user);
  User.findOne({
    username: req.params.username
  }, (err, user) => {
    if (err) return next(err);
    res.json(user);
  });
});

module.exports = router;
