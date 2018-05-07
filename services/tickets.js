var express = require('express');
var router = express.Router();
var createError = require("http-errors");

var Unit = require('../models/unit');
var User = require('../models/user');
var Ticket = require('../models/ticket');

// Get all tickets.
router.get( '/', ( req, res, next ) => {
    if ( req.user.type == 'ADMIN' ) {
        Ticket.find( {}, ( err, tickets ) => {
            if ( err ) return next(err);
                res.json( tickets ); 
        });
    } else {
        next( createError(401, 'Unauthorized: Insufficient Privilege.') );
    }
});

// Create a new ticket.
router.post( '/', ( req, res, next ) => {

});

// Get the technicians assigned to a ticket.
router.get( '/:ticketId/technicians', ( req, res, next ) => {
    if ( req.user.type == 'ADMIN' ) {
        Ticket.find( { _id: req.params.ticketId }, ( err, ticket ) => {
            if ( err ) return next(err);
            res.json( ticket[0].technicians ); 
        });
    } else {
        next( createError(401, 'Unauthorized: Insufficient Privilege.') );
    }
});

// Set the status of a ticket.
// Some status changes require a message explaining the reason of the change -- this message should be included in the request body.
// Each status change automatically adds an Update to the ticket. 
router.get( '/:ticketId/status/:status', ( req, res, next ) => {

});

// Set the priority of a ticket.
router.get( '/:ticketId/priority/:priority', ( req, res, next ) => {

});

module.exports = router;
