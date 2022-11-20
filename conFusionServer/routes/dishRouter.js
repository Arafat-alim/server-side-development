const express = require("express");
const bodyParser = require("body-parser");

const dishRouter = express.Router();
dishRouter.use(bodyParser.json());

dishRouter
  .route("/")
  .all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    next();
  })
  .get((req, res, next) => {
    res.end("Will send the all dishes to you!");
  })
  .post((req, res, next) => {
    res.end(
      "Will add the dish - " +
        req.body.name +
        " with details " +
        req.body.details
    );
  })
  .put((req, res, next) => {
    res.statusCode = 403;
    res.end("POST operation is not supported on /dishes");
  })
  .delete((req, res, next) => {
    res.end("Delete all the dishes");
  });

dishRouter
  .route("/:dishId")
  .get((req, res, next) => {
    res.end("Will send the dish: " + req.params.dishId);
  })
  .post((req, res, next) => {
    res.statusCode = 403;
    res.end("POST operation is not supported on /dishes/id");
  })
  .put((req, res, next) => {
    res.write("Updating the dish: " + req.params.dishId + "\n");
    res.end(
      "Updated the dish " + req.body.name + " with details " + req.body.details
    );
  })
  .delete((req, res, next) => {
    res.end("Deleting the dish: " + req.params.dishId);
  });

module.exports = dishRouter;
