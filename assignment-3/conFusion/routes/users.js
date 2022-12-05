var express = require("express");
var router = express.Router();

const bodyParser = require("body-parser");
const User = require("../models/users");

const passport = require("passport");
const authenticate = require("../authenticate");

router.use(bodyParser.json());
/* GET users listing. */
//! endpoints - users
router.get(
  "/",
  authenticate.verifyUser,
  authenticate.verifyAdmin,
  (req, res, next) => {
    User.find({})
      .then(
        (users) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(users);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  }
);

//! endpoints - users/signup
router.post("/signup", (req, res, next) => {
  User.register(
    new User({ username: req.body.username }),
    req.body.password,
    (err, user) => {
      if (err) {
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        res.json({ err: err });
      } else {
        if (req.body.firstname) {
          user.firstname = req.body.firstname;
        }
        if (req.body.lastname) {
          user.lastname = req.body.lastname;
        }
        user.save((err, user) => {
          if (err) {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.json({ err: err });
            return;
          }
          passport.authenticate("local")(req.res, () => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json({ success: true, status: "Registration Successfully" });
          });
        });
      }
    }
  );
});

//! endpoint - users/login
router.post("/login", passport.authenticate("local"), (req, res, next) => {
  const token = authenticate.getToken({ _id: req.user._id });
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.json({
    success: true,
    token: token,
    status: "You are successfully logged in!!",
  });
});

//! end point - users/logout
router.get("/logout", (req, res, next) => {
  if (req.session) {
    req.session.destroy();
    req.cleanCookie("session-id");
    res.redirect("/");
  } else {
    const err = new Error("You are not logged in!");
    err.status = 500;
    return next(err);
  }
});
module.exports = router;
