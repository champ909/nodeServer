var express = require("express");
var router = express.Router();
var createError = require("http-errors");
var bcrypt = require("bcrypt");

var Unit = require("../models/unit");
var User = require("../models/user");
var Ticket = require("../models/ticket");

// Get all users.
router.get("/", (req, res, next) => {
  if (req.user.type == "ADMIN") {
    User.getUsers((err, users) => {
      if (err) return next(err);
      res.json(users);
    });
  } else {
    next(createError(401, "Unauthorized: Insufficient Privilege."));
  }
});

// Get a user by username.
router.get("/:username", (req, res, next) => {
  if (req.user.type == "ADMIN" || req.params.username === req.user.username) {
    User.getUserByUsername(req.params.username, (err, user) => {
      if (err) return next(err);
      res.json(user);
    });
  } else {
    next(createError(403, "Forbidden: Insufficient Privilege."));
  }
});

// Save a user.
router.post("/", (req, res, next) => {
  if (req.user.type == "ADMIN") {
    if (req.body.username == null || req.body.password == null) {
      next(createError(404, "Missing username and/or password."));
    } else {
      const passhash = bcrypt.hashSync(req.body.password, 10);
      const user = new User({
        firstName: req.body.firstname || "",
        lastName: req.body.lastname || "",
        email: req.body.email || `${req.body.username}@techitnode.com`,
        username: req.body.username,
        type: req.body.type || "REGULAR",
        hash: passhash,
        enabled: req.body.enabled || true,
        phone: req.body.phone || "",
        department: req.body.department || ""
      });

      User.saveUser(user, (err, user) => {
        if (err) {
          if (err.message.includes("duplicate")) {
            return next(createError(400, "Bad Request : User already exists."));
          } else {
            return next(createError(500, "Failed to save user."));
          }
        }
        res.send(user);
      });
    }
  } else {
    next(createError(403, "Forbidden: Insufficient Privilege."));
  }
});

// Get the tickets submitted by a user.
router.get("/:userId/tickets", (req, res, next) => {
  if (req.user.type == "ADMIN" || req.user.userId == req.params.userId) {
    Ticket.getTicketsCreatedByUser(req.params.userId, null, (err, tickets) => {
      if (err) return next(err);
      res.json(tickets);
    });
  } else {
    next(createError(403, "Forbidden: Insufficient Privilege."));
  }
});

module.exports = router;
