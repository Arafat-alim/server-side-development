// var createError = require("http-errors");
var express = require("express");
var path = require("path");
// var cookieParser = require("cookie-parser");
var logger = require("morgan");
var bodyParser = require("body-parser");
const config = require("./config");
var session = require("express-session");
var FileStore = require("session-file-store")(session);

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
const dishRouter = require("./routes/dishRouter");

const mongoose = require("mongoose");
// mongoose.Promise = require("bluebird");

const Dishes = require("./models/dishes");

const passport = require("passport");
const authenticate = require("./authenticate");

//! connection to mongo db
const url = config.mongoURL;
//! Please note - Install mongoose version - 4.13.0
const connect = mongoose.connect(url, {
  useMongoClient: true,
  //other options
});

connect.then(
  (db) => {
    console.log("Connected to the Mongo DB server successfully");
  },
  (err) => console.log(err)
);

var app = express();

// Authentication configuration
app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: config.secretKey,
  })
);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cookieParser());

app.use(passport.initialize());
app.use(passport.session());

app.use("/", indexRouter);
app.use("/users", usersRouter);

app.use(express.static(path.join(__dirname, "public")));

app.use("/dishes", dishRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  // next(createError(404));
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
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
