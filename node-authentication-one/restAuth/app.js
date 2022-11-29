var createError = require("http-errors");
var express = require("express");
var path = require("path");
//var cookieParser = require("cookie-parser");
const session = require("express-session");
const FileStore = require("session-file-store")(session);
var logger = require("morgan");

// ! Connection
const mongoose = require("mongoose");
const url = "mongodb://127.0.0.1:27017/conFusion";

const connect = mongoose.connect(url);
connect
  .then((db) => console.log("Connected with the mongo db server"))
  .catch((err) => console.log("Error: ", err));

// ! Router
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
const dishRouter = require("./routes/dishRouter");
const promoRouter = require("./routes/promoRouter");
const leaderRouter = require("./routes/leaderRouter.js");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser("12345-32145-74123-96321")); //! signed cookie

//! session set up
app.use(
  session({
    name: "session-id",
    secret: "12345-32145-74123-96321",
    saveUninitialized: false,
    resave: false,
    store: new FileStore(),
  })
);

//! Adding authentication + cookies
function auth(req, res, next) {
  console.log(req.headers);
  console.log(req.signedCookies);
  console.log(req.session);
  if (!req.session.user) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      const err = new Error("You are not authenticated!");
      res.setHeader("WWW-Authenticate", "Basic");
      err.status = 401;
      return next(err);
    }
    //! Extract out the username and password, and check whether the auth is verfied or not
    const auth = new Buffer.from(authHeader.split(" ")[1], "base64")
      .toString()
      .split(":");

    const username = auth[0];
    const password = auth[1];
    //! check the valid user or not
    if (username === "admin" && password === "password") {
      //! set up the cookies
      //res.cookie("user", "admin", { signed: true });

      req.session.user = "admin";
      next();
    } else {
      const err = new Error("You are not authenticated!");
      res.setHeader("WWW-Authenticate", "Basic");
      err.status = 401;
      return next(err);
    }
  } else {
    //! if cookies is present in the client side
    if (req.session.user === "admin") {
      next(); //! authorized
    } else {
      const err = new Error("You are not authenticated");
      err.status = 401;
      return next(err);
    }
  }
}

app.use(auth);

app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/dishes", dishRouter);
app.use("/promotions", promoRouter);
app.use("/leaders", leaderRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
