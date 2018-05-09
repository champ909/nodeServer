var express = require("express");
var router = express.Router();
var jwt = require("jsonwebtoken");
var bcrypt = require("bcrypt");
var createError = require("http-errors");

const User = require("../models/user");
const jwtSecret = process.env.JWT_SECRET;
const saltRound = 10;

router.post("/", (req, res, next) => {
  if (req.body.username == null || req.body.password == null) {
    next(createError(400, "Bad Request: Missing username and/or password."));
  } else {
    User.getUserByUsername(req.body.username, { hash: 1 }, (err, user) => {
      if (err) return next(err);

      if (user) {
        bcrypt.compare(req.body.password, user.hash).then(result => {
          if (!result)
            return next(
              createError(401, "Unauthorized: Wrong username and/or password.")
            );
          res.json({
            token: jwt.sign(
              {
                userId: user._id,
                username: user.username,
                type: user.type
              },
              jwtSecret
            )
          });
        });
      } else {
        next(createError(404, "User not found."));
      }
    });
  }
});

module.exports = router;
