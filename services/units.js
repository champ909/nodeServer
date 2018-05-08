var express = require('express');
var router = express.Router();
var createError = require("http-errors");

var Unit = require('../models/unit');
var User = require('../models/user');
var Ticket = require('../models/ticket');

// Get all units.
router.get( '/', ( req, res, next ) => {
    if ( req.user.type == 'ADMIN' ) {
        Unit.find( {} )
            .populate( 'supervisors', { hash:0 } )
            .populate( 'technicians', { hash:0 } )
            .exec( ( err, units ) => {
          if ( err ) return next(err);
          res.json( units ); 
        });
      } else {
        next( createError(401, 'Unauthorized: Insufficient Privilege.') );
    }
});

// Get the technicians of a unit.
router.get( '/:unitId/technicians', ( req, res, next ) => {
    if ( req.user.type == 'ADMIN' ) {
        Unit.find( { _id: req.params.unitId } )
            .populate( 'technicians', { hash:0 } )
            .exec( ( err, unit ) => {
            if ( err ) return next(err);
          
            res.json( unit[0].technicians ); 
        });
      } else {
        next( createError(401, 'Unauthorized: Insufficient Privilege.') );
    }
});

// Get the tickets submitted to a unit.
router.get( '/:unitId/tickets', ( req, res, next ) => {
    if ( req.user.type == 'ADMIN' ) {
        Ticket.find( { unit: req.params.unitId } )
            .populate( 'technicians' )
            .populate( 'unit', 'name' )
            .exec( ( err, tickets ) => {
            if ( err ) return next(err);
          
            res.json( tickets ); 
        });
      } else {
        next( createError(401, 'Unauthorized: Insufficient Privilege.') );
    }
});

module.exports = router;
