var express = require("express");
var router = express.Router();
var jwt = require("jsonwebtoken");

const User = require("../models/user");
const jwtSecret = process.env.JWT_SECRET;

router.post('/', ( req, res, next ) => {
  User.findOne( { username: req.body.username }, ( err, user ) => {
      if (err) return next( err );
      
      res.json({
        token: jwt.sign({
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
