const bodyParser = require("body-parser");
const express = require("express");
const Leaders = require("../models/leaders");
const leaderRouter = express.Router();
const authenticate = require("../authenticate");

leaderRouter.use(bodyParser.json());

leaderRouter
  .route("/")
  .get((req, res, next) => {
    Leaders.find()
      .then(
        (leaders) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(leaders);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post(authenticate.verifyUser, (req, res, next) => {
    Leaders.create(req.body)
      .then(
        (leader) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(leader);
        },
        (err) => next(err)
      )
      .catch((err) => {
        next(err);
      });
  })
  .put(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end(`PUT operation is not supported on /leaders`);
  })
  .delete(authenticate.verifyUser, (req, res, next) => {
    Leaders.remove({})
      .then(
        (leaders) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(leaders);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

leaderRouter
  .route("/:leaderId")
  .get((req, res, next) => {
    Leaders.findById(req.params.leaderId)
      .then(
        (leader) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(leader);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end(
      `POST operation is not supported on /leaders/${req.params.leaderId}`
    );
  })
  .put(authenticate.verifyUser, (req, res, next) => {
    Leaders.findByIdAndUpdate(
      req.params.leaderId,
      { $set: req.body },
      { new: true }
    )
      .then(
        (leader) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(leader);
        },
        (err) => {
          next(err);
        }
      )
      .catch((err) => {
        next(err);
      });
  })
  .delete(authenticate.verifyUser, (req, res, next) => {
    Leaders.findByIdAndDelete(req.params.leaderId)
      .then(
        (leader) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(leader);
        },
        (err) => next(err)
      )
      .catch((err) => {
        next(err);
      });
  });

module.exports = leaderRouter;
