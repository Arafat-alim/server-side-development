const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/user");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const jwt = require("jsonwebtoken"); //! used to create, sign, and verify tokens

const config = require("./config");

module.exports.local = passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//! creata a token and given to us, sing() - to create a token
exports.getToken = function (user) {
  return jwt.sign(user, config.secretKey, { expiresIn: 3600 });
};

//! create a strategy for our passport, fromAuthHeaderAsBearerToken() authorization token header
let opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(
  new JwtStrategy(opts, (jwt_payload, done) => {
    console.log("JWT Payload", jwt_payload);
    User.findOne({ _id: jwt_payload._id }, (err, user) => {
      if (err) {
        return done(err, false);
      } else if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    });
  })
);

//! Passport authenticate **important one
module.exports.verifyUser = passport.authenticate("jwt", { session: false }); //! token base application
//! thats why session is false

//! Creating an admin verify user
module.exports.verifyAdmin = function (req, res, next) {
  //! Finding the user
  User.findOne({ _id: req.user._id })
    .then(
      (user) => {
        console.log("User: ", req.user);
        if (user.author) {
          next();
        } else {
          const err = new Error(
            "You are not authorized to perform this operation"
          );
          err.staus = 403;
          return next(err);
        }
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
};
