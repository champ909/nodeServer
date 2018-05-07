var express = require("express");
var router = express.Router();
var jwt = require("jsonwebtoken");
var bcrypt = require("bcrypt");

const User = require("../models/user");
const jwtSecret = process.env.JWT_SECRET;
const saltRound = 10;

router.post("/", (req, res, next) => {
  User.findOne({ username: req.body.username }, (err, user) => {
    if (err) return next(err);

    bcrypt.compare(req.body.password, user.hash).then(result => {
      if (result)
        res.json({
          token: jwt.sign(
            {
              username: user.username,
              role: user.type
            },
            jwtSecret
          )
        });
      else return next(new Error("Unauthorized"));
    });
  });
});

module.exports = router;
