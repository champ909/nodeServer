var express = require('express');
var router = express.Router();
var createError = require("http-errors");

var Unit = require('../models/unit');
var User = require('../models/user');
var Ticket = require('../models/ticket');

// Get all tickets.
router.get( '/', ( req, res, next ) => {
    if ( req.user.type == 'ADMIN' ) {
        Ticket.find( {} )
            .populate( 'technicians', { hash:0 } )
            .populate( 'createdBy', { hash:0 } )
            .populate( 'unit', 'name' )
            .exec( ( err, tickets ) => {
            if ( err ) return next(err);
                res.json( tickets ); 
        });
    } else {
        next( createError(401, 'Unauthorized: Insufficient Privilege.') );
    }
});

// Create a new ticket.
router.post( '/', ( req, res, next ) => {
    if ( req.user.type == 'ADMIN' ) {
        if ( req.body.createdForEmail == null ) {
            next( createError(404, 'Bad Request: createdForEmail field was missing.') );
        } else if ( req.body.subject == null ) {
            next( createError(404, 'Bad Request: subject field was missing.') );
        } else if ( req.body.unit == null ) {
            next( createError(404, 'Bad Request: unit field was missing.') );
        } else {
            const ticket = new Ticket({
                createdBy: req.user.userId,
                createdForName: req.body.createdForName || '',
                createdForEmail: req.body.createdForEmail,
                createdForPhone: req.body.createdForPhone || '',
                createdForDepartment: req.body.createdForDepartment || '',
                subject: req.body.subject,
                details: req.body.details || '',
                location: req.body.location || '',
                unit: req.body.unit,
                dateAssigned: req.body.dateAssigned,
                dateUpdated: req.body.dateUpdated || '',
                dateClosed: req.body.dateClosed || '',
                priority: req.body.priority || '',
                status: req.body.status || '',
                technicians: req.body.technicians || '',
                updates: req.body.updates || []
            });

            ticket.save( ( err, ticket ) => {
                if ( err ) {
                  return next ( createError(400, "Failed to create ticket.") );
                }
                res.send( ticket );
            });
        }
    } else {
        next( createError(401, 'Unauthorized: Insufficient Privilege.') );
    }
});

// Get the technicians assigned to a ticket.
router.get( '/:ticketId/technicians', ( req, res, next ) => {
    if ( req.user.type == 'ADMIN' ) {
        Ticket.find( { _id: req.params.ticketId } )
        .populate( 'technicians', { hash:0 } )
        .exec( ( err, ticket ) => {
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
router.put( '/:ticketId/status/:status', ( req, res, next ) => {
    if ( req.user.type == 'ADMIN' ) {
        Ticket.findOne( { _id: req.params.ticketId }, ( err, ticket ) => {
            if ( err ) return next(err);

            ticket.updates.push( {
                details: `Changed the status from ${ticket.status} to ${req.params.status}.`,
                technician: {
                    id: req.params.ticketId,
                }
            });
            ticket.status = req.params.status;
            ticket.dateUpdated = new Date();
            if ( req.params.status == 'CLOSED' )
                ticket.dateClosed = new Date();
            ticket.save();
            res.json( ticket ); 
        });
    } else {
        next( createError(401, 'Unauthorized: Insufficient Privilege.') );
    }
});

// Set the priority of a ticket.
router.put( '/:ticketId/priority/:priority', ( req, res, next ) => {
    if ( req.user.type == 'ADMIN' ) {
        Ticket.findOne( { _id: req.params.ticketId }, ( err, ticket ) => {
            if ( err ) return next(err);

            ticket.updates.push( {
                details: `Changed the priority from ${ticket.priority} to ${req.params.priority}.`,
                technician: {
                    id: req.params.ticketId,
                }
            });
            ticket.priority = req.params.priority;
            ticket.dateUpdated = new Date();
            ticket.save();
            res.json( ticket ); 
        });
    } else {
        next( createError(401, 'Unauthorized: Insufficient Privilege.') );
    }
});

module.exports = router;
