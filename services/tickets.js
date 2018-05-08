var express = require("express");
var router = express.Router();
var createError = require("http-errors");

var Unit = require("../models/unit");
var User = require("../models/user");
var Ticket = require("../models/ticket");

// Get all tickets.
router.get("/", (req, res, next) => {
  if (req.user.type == "ADMIN") {
    Ticket.getTickets((err, tickets) => {
      if (err) return next(err);
      res.json(tickets);
    });
  } else {
    next(createError(403, "Forbidden: Insufficient Privilege."));
  }
});

// Create a new ticket.
router.post("/", (req, res, next) => {
  if (req.user.type == "ADMIN") {
    if (req.body.createdForEmail == null) {
      next(createError(404, "Bad Request: createdForEmail field was missing."));
    } else if (req.body.subject == null) {
      next(createError(404, "Bad Request: subject field was missing."));
    } else if (req.body.unit == null) {
      next(createError(404, "Bad Request: unit field was missing."));
    } else {
      const ticket = new Ticket({
        createdBy: req.user.userId,
        createdForName: req.body.createdForName || "",
        createdForEmail: req.body.createdForEmail,
        createdForPhone: req.body.createdForPhone || "",
        createdForDepartment: req.body.createdForDepartment || "",
        subject: req.body.subject,
        details: req.body.details || "",
        location: req.body.location || "",
        unit: req.body.unit,
        dateAssigned: req.body.dateAssigned,
        dateUpdated: req.body.dateUpdated || "",
        dateClosed: req.body.dateClosed || "",
        priority: req.body.priority || "",
        status: req.body.status || "",
        technicians: req.body.technicians || "",
        updates: req.body.updates || []
      });

      Tickets.saveTicket(ticket, (err, ticket) => {
        if (err) {
          return next(createError(500, "Failed to create ticket."));
        }
        res.send(ticket);
      });
    }
  } else {
    next(createError(403, "Forbidden: Insufficient Privilege."));
  }
});

// Get the technicians assigned to a ticket.
router.get("/:ticketId/technicians", (req, res, next) => {
  if (req.user.type == "ADMIN") {
    Ticket.getTicketById(req.params.ticketId, (err, ticket) => {
      if (err) return next(err);
      res.json(ticket && ticket[0].technicians ? ticket[0].technicians : []);
    });
  } else {
    next(createError(403, "Forbidden: Insufficient Privilege."));
  }
});

// Set the status of a ticket.
// Some status changes require a message explaining the reason of the change -- this message should be included in the request body.
// Each status change automatically adds an Update to the ticket.
router.put("/:ticketId/status/:status", (req, res, next) => {
  if (req.user.type == "ADMIN") {
    Ticket.getTicketById(req.params.ticketId, (err, ticket) => {
      if (err) return next(err);
      if (!ticket) return next(createError(404));
      Ticket.saveUpdate(
        ticket,
        `Changed the status from ${ticket.status} to ${req.params.status}.`,
        req.user
      );
      ticket.status = req.params.status;
      ticket.dateUpdated = Date.now;
      if (req.params.status == "CLOSED") ticket.dateClosed = Date.now;
      Ticket.saveTicket(ticket, (err, ticket) => {
        if (err) {
          return next(createError(500, "Failed to create ticket."));
        }
        res.send(ticket);
      });
    });
  } else {
    next(createError(403, "Forbidden: Insufficient Privilege."));
  }
});

// Set the priority of a ticket.
router.put("/:ticketId/priority/:priority", (req, res, next) => {
  if (req.user.type == "ADMIN") {
    Ticket.getTicketById(req.params.ticketId, (err, ticket) => {
      if (err) return next(err);
      if (!ticket) return next(createError(404));

      Ticket.saveUpdate(
        ticket,
        `Changed the priority from ${ticket.priority} to ${
          req.params.priority
        }.`,
        req.user
      );
      ticket.priority = req.params.priority;
      ticket.dateUpdated = Date.now;
      Ticket.saveTicket(ticket, (err, ticket) => {
        if (err) {
          return next(createError(500, "Failed to create ticket."));
        }
        res.send(ticket);
      });
    });
  } else {
    next(createError(403, "Forbidden: Insufficient Privilege."));
  }
});

module.exports = router;
