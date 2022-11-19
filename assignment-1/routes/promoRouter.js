const express = require("express");
const bodyParser = require("body-parser");

const promoRouter = express.Router();

promoRouter.use(bodyParser.json());

promoRouter
  .route("/")
  .all((req, res, next) => {
    res.statusCodde = 200;
    res.setHeader("Content-Type", "text/plain");
    next();
  })
  .get((req, res, next) => {
    res.end("Will send all  Promos to you!");
  })
  .post((req, res, next) => {
    res.end(
      "Will add the promo " +
        req.body.name +
        " with the details " +
        req.body.details
    );
  })
  .put((req, res, next) => {
    res.statusCode = 403;
    res.end("POST operation is not supported!");
  })
  .delete((req, res, next) => {
    res.end("Delete all the promos");
  });

promoRouter
  .route("/:promoId")
  .get((req, res, next) => {
    res.end("Will send the Promo: " + req.params.promoId);
  })
  .post((req, res, next) => {
    res.statusCode = 403;
    res.end("POST operation is not supported on this domain");
  })
  .put((req, res, next) => {
    res.write("Updating the Promo " + req.params.promoId + "\n");
    res.end(
      `WIll update the promo ${req.body.name} with the details ${req.body.details}`
    );
  })
  .delete((req, res, next) => {
    res.end(`Delete the promo ${req.params.promoId}`);
  });

module.exports = promoRouter;
