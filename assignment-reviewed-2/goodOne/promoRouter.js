const express = require("express");
const bodyParser = require("body-parser");
const Promotions = require("../model/promotions");

const promoRouter = express.Router();

promoRouter.use(bodyParser.json());

promoRouter
  .route("/")
  .get((req, res, next) => {
    getAllPromotions(req, res, next);
  })
  .post((req, res, next) => {
    addPromotion(req, res, next);
  })
  .put((req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /promotions");
  })
  .delete((req, res, next) => {
    deleteAllPromotions(req, res, next);
  });

async function deleteAllPromotions(req, res, next) {
  try {
    let resp = await Promotions.remove({});
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    res.json(resp);
  } catch (error) {
    next(error);
  }
}

async function addPromotion(req, res, next) {
  try {
    let promo = await Promotions.create(req.body);
    console.log("Promo created: " + promo);
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    res.json(promo);
  } catch (error) {
    next(error);
  }
}

async function getAllPromotions(req, res, next) {
  try {
    let promos = await Promotions.find({});
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    res.json(promos);
  } catch (error) {
    next(error);
  }
}

promoRouter
  .route("/:promoId")
  .get((req, res, next) => {
    getPromotion(req, res, next);
  })
  .post((req, res, next) => {
    res.statusCode = 403;
    res.end(
      "POST operation not supported on /promotions/" + req.params.promoId
    );
  })
  .put((req, res, next) => {
    updatePromotion(req, res, next);
  })
  .delete((req, res, next) => {
    deletePromotion(req, res, next);
  });

async function deletePromotion(req, res, next) {
  try {
    let resp = await Promotions.findByIdAndRemove(req.params.promoId);
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    res.json(resp);
  } catch (error) {
    next(error);
  }
}

async function updatePromotion(req, res, next) {
  try {
    let promo = await Promotions.findByIdAndUpdate(
      req.params.promoId,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    res.json(promo);
  } catch (error) {
    next(error);
  }
}
async function getPromotion(req, res, next) {
  try {
    let promo = await Promotions.findById(req.params.promoId);
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    res.json(promo);
  } catch (error) {
    next(error);
  }
}

module.exports = promoRouter;
