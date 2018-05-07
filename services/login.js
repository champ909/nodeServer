var express = require("express");
var router = express.Router();
const User = require("../models/user");

const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;

router.post("/", (req, res, next) => {
  console.log(req.body);
  User.findOne(
    {
      firstName: req.body.username
    },
    (err, user) => {
      console.log(err);
      console.log(user);
      if (err) return next(err);
      res.json({
        token: jwt.sign(
          {
            username: user.username,
            role: user.type
          },
          jwtSecret
        )
      });
    }
  );
});

module.exports = router;
