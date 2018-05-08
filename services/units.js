var express = require("express");
var router = express.Router();
var createError = require("http-errors");

var Unit = require("../models/unit");
var User = require("../models/user");
var Ticket = require("../models/ticket");

// Get all units.
router.get("/", (req, res, next) => {
  if (req.user.type == "ADMIN") {
    Unit.getUnits((err, units) => {
      if (err) return next(err);
      res.json(units);
    });
  } else {
    next(createError(403, "Forbidden: Insufficient Privilege."));
  }
});

// Get the technicians of a unit.
router.get("/:unitId/technicians", (req, res, next) => {
  if (req.user.type == "ADMIN") {
    Unit.getUnitById(req.params.unitId, (err, unit) => {
      if (err) return next(err);
      res.json(unit[0].technicians);
    });
  } else {
    next(createError(403, "Forbidden: Insufficient Privilege."));
  }
});

// Get the tickets submitted to a unit.
router.get("/:unitId/tickets", (req, res, next) => {
  if (req.user.type == "ADMIN") {
    Ticket.getUnitById(req.params.unitId, (err, tickets) => {
      if (err) return next(err);
      res.json(tickets);
    });
  } else {
    next(createError(403, "Forbidden: Insufficient Privilege."));
  }
});

module.exports = router;
