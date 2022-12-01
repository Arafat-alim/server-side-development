var express = require("express");
const bodyParser = require("body-parser");
const User = require("../models/user");
var router = express.Router();
const passport = require("passport");

/* GET users listing. */
router.use(bodyParser.json());

router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

//! signup
/*
router.post("/signup", (req, res, next) => {
  //! CHeck whether user is existing or not
  User.findOne({ username: req.body.username })
    .then((user) => {
      //! if user found - return an error
      if (user) {
        const err = new Error(`User ${user} already existed!`);
        err.statusCode = 403; //forbidden
        next(err);
      } else {
        //! If user not existed. create a new user
        return (
          User.create(
            {
              username: req.body.username,
              password: req.body.password,
            },
            (err) => next(err)
          )
            //! Return a successfull message to the client
            .then(
              (user) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json({ status: "Registration Succesfully", user: user });
              },
              (err) => next(err)
            )
            .catch((err) => next(err))
        );
      }
    })
    .catch((err) => next(err));
});

*/

//! Updated signUp using passport module
router.post("/signup", (req, res) => {
  User.register(
    new User({ username: req.body.username }),
    req.body.password,
    (err, user) => {
      if (err) {
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        res.json({ err: err });
      } else {
        passport.authenticate("local")((req, res) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json({
            success: true,
            status: "Registration Successfully!",
          });
        });
      }
    }
  );
});
//! login
/*
router.post("/login", (req, res, next) => {
  //! session is not found
  if (!req.session.user) {
    //! then create a session using basic authorization header
    //! checking the header if any basic authorization is added or not
    const authHeader = req.headers.authorization;
    //! if authHeader not found then return an error
    if (!authHeader) {
      const err = new Error("You are not authenticated");
      err.setHeader("WWW-Authenticate", "Basic");
      err.status = 401;
      return next(err);
    }
    //! if authHeader is prsent then extract the username and password
    const auth = new Buffer.from(authHeader.split(" ")[1], "base64")
      .toString()
      .split(":");

    const username = auth[0];
    const password = auth[1];

    //! checking the username existed in out database or not
    User.findOne({ username: username })
      .then(
        (user) => {
          //! if user not found return an error
          if (user === null) {
            const err = new Error(`User ${user} does not exist!`);
            err.status = 403; //forbidden
            return next(err);
            //! if user passowrd not match with our saved database paasword
          } else if (user.password !== password) {
            const err = new Error("Your password is incorrect!");
            err.status = 403;
            return next(err);
            //! Here our username and password matched with the database then return a succssfully login
          } else if (user.username === username && user.password === password) {
            //! check the req. session
            req.session.user = "authenticated"; //! we are setting to authenticated
            res.statusCode = 200;
            res.setHeader("Content-Type", "text/plain");
            res.end("You are successfully login!");
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  } else {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    res.end("You are already authenticated!");
  }
});

*/
//! login - Here user data expecting comes from the body of the requset not authorization header
router.use("/login", passport.authenticate("local"), (req, res) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.json({ success: true, status: "You are successfully logged in!" });
});

//! logout
router.get("/logout", (req, res, next) => {
  //! If session is present then destroyed it
  if (req.session) {
    //! deleting the session
    req.session.destroy(); // ! destroying thse session from the server side
    res.clearCookie("session-id"); //! destroying the cookies from the client side
    res.redirect("/"); //! redirect the user to the home page
  } else {
    const err = new Error("You are not logged in!");
    err.statusCode = 401;
    return next(err);
  }
});

module.exports = router;
