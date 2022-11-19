const express = require("express");
const bodyParser = require("body-parser");

const leaderRouter = express.Router();

leaderRouter.use(bodyParser.json());

leaderRouter
  .route("/")
  .all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    next();
  })
  .get((req, res, next) => {
    res.end("WIll send all the leaders ");
  })
  .post((req, res, next) => {
    res.end(
      "Will add the leader " +
        req.body.name +
        " with details " +
        req.body.details
    );
  })
  .put((req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation is not supported on this domain");
  })
  .delete((req, res, next) => {
    res.end("Delete all the leaders");
  });

leaderRouter
  .route("/:leaderId")
  .get((req, res, next) => {
    res.end("Will send the leader: " + req.params.leaderId);
  })
  .post((req, res, next) => {
    res.statusCode = 403;
    res.end("POST operation is not supported on this domain");
  })
  .put((req, res, next) => {
    res.write("Updating the Leader: " + req.params.leaderId + "\n");
    res.end(
      "Updated the leader " +
        req.body.name +
        " with the details " +
        req.body.details
    );
  })
  .delete((req, res, next) => {
    res.end("Delete the leader " + req.params.leaderId);
  });

module.exports = leaderRouter;
