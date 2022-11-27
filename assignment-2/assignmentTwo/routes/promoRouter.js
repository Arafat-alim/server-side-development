const bodyParser = require("body-parser");
const express = require("express");
const promoRouter = express.Router();
const Promos = require("../models/promotions");

promoRouter.use(bodyParser.json());

promoRouter
  .route("/")
  .get((req, res, next) => {
    Promos.find()
      .then(
        (promos) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(promos);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post((req, res, next) => {
    Promos.create(req.body)
      .then(
        (promo) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(promo);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .put((req, res, next) => {
    res.statusCode = 403;
    res.end(`PUT operation is not supported on this /promotions`);
  })
  .delete((req, res, next) => {
    Promos.remove({}).then((promos) => {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json(promos);
    });
  });

module.exports = promoRouter;
