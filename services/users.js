var express = require('express');
var router = express.Router();
var User = require('../models/user');
var createError = require("http-errors");
var bcrypt = require('bcrypt');

// Get all users.
router.get( '/', ( req, res, next ) => {
  if ( req.user.type == 'ADMIN' ) {
    User.find( {}, ( err, users ) => {
      if ( err ) return next(err);
      res.json( users ); 
    });
  } else {
    next( createError(401, 'Unauthorized: Insufficient Privilege.') );
  }
});

// Get a user by username.
router.get( '/:username', ( req, res, next ) => {
  if ( req.user.type == 'ADMIN' || req.params.username === req.user.username ) {
    User.findOne( { username: req.params.username }, ( err, user ) => {
      if ( err ) return next( err );
      res.json(user);
    });
  } else {
    next( createError(403, 'Unauthorized: Insufficient Privilege.') );
  }
});

// Save a user.
router.post( '/', ( req, res, next ) => {
  if ( req.user.type == 'ADMIN' ) {
    if ( req.body.username == null || req.body.password == null ) {
      next( createError(400, 'Bad Request: Missing username and/or password.') );
    } else {
      const passhash = bcrypt.hashSync( req.body.password, 10 );
      const user = new User({
        firstName: req.body.firstname || '',
        lastName: req.body.lastname || '',
        email: req.body.email || `${req.body.username}@techitnode.com`,
        username: req.body.username,
        type: req.body.type || 'REGULAR',
        hash: passhash,
        enabled: req.body.enabled || true,
        phone: req.body.phone || '',
        department: req.body.department || ''
      });

      user.save( ( err, user ) => {
        if ( err ) {
          if ( err.message.includes('duplicate') ) {
            return next ( createError(400, "User already exists.") );
          } else {
            return next ( createError(400, "Failed to save user.") );
          }
        }
        res.send( user );
      });
    }
  } else {
    next( createError(403, 'Unauthorized: Insufficient Privilege.') );
  }
});

module.exports = router;
