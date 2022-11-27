const express = require("express");
const bodyParser = require("body-parser");
const Leaders = require("../model/leaders");

const leaderRouter = express.Router();

leaderRouter.use(bodyParser.json());

leaderRouter
  .route("/")
  .get((req, res, next) => {
    getAllLeaders(req, res, next);
  })
  .post((req, res, next) => {
    createLeader(req, res, next);
  })
  .put((req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /leaders");
  })
  .delete((req, res, next) => {
    deleteAllLeaders(req, res, next);
  });

async function deleteAllLeaders(req, res, next) {
  try {
    let resp = Leaders.remove({});
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    res.json(resp);
  } catch (error) {
    next(error);
  }
}

async function createLeader(req, res, next) {
  try {
    let leader = await Leaders.create(req.body);
    console.log("Leader created " + leader);
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    res.json(leader);
  } catch (error) {
    next(error);
  }
}

async function getAllLeaders(req, res, next) {
  try {
    let leaders = await Leaders.find({});
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    res.json(leaders);
  } catch (error) {
    next(error);
  }
}

leaderRouter
  .route("/:leaderId")
  .get((req, res, next) => {
    getLeader(req, res, next);
  })
  .post((req, res, next) => {
    res.statusCode = 403;
    res.end("POST operation not supported on /leaders/" + req.params.leaderId);
  })
  .put((req, res, next) => {
    updateLeader(req, res, next);
  })
  .delete((req, res, next) => {
    deleteLeader(req, res, next);
  });

async function deleteLeader(req, res, next) {
  try {
    let resp = await Leaders.findByIdAndDelete(req.params.leaderId);
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    res.json(resp);
  } catch (error) {
    next(error);
  }
}

async function updateLeader(req, res, next) {
  try {
    let leader = await Leaders.findByIdAndUpdate(
      req.params.leaderId,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    res.json(leader);
  } catch (error) {
    next(error);
  }
}

async function getLeader(req, res, next) {
  try {
    let leader = await Leaders.findById(req.params.leaderId);
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    res.json(dishes);
  } catch (error) {
    next(error);
  }
}

module.exports = leaderRouter;
