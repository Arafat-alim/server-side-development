const express = require("express");
const bodyParser = require("body-parser");

const Dishes = require("../models/dishes");

const dishRouter = express.Router();
dishRouter.use(bodyParser.json());

//! endpoint - /dishes
dishRouter
  .route("/")
  .get((req, res, next) => {
    Dishes.find({})
      .then(
        (dishes) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(dishes);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post((req, res, next) => {
    Dishes.create(req.body)
      .then(
        (dish) => {
          console.log("New Created ", dish);
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(dish);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .put((req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operations not supported on /dishes");
  })
  .delete((req, res, next) => {
    Dishes.remove({})
      .then(
        (resp) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(resp);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

//! end points - /dishes/:id

dishRouter
  .route("/:dishId")
  .get((req, res, next) => {
    Dishes.findById(req.params.dishId)
      .then(
        (dish) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(dish);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post((req, res, next) => {
    res.statusCode = 401;
    res.end("POST operation is not supported on /dishes/" + req.params.dishId);
  })
  .put((req, res, next) => {
    Dishes.findByIdAndUpdate(
      req.params.dishId,
      {
        $set: req.body,
      },
      { new: true }
    )
      .then(
        (dish) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(dish);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .delete((req, res, next) => {
    Dishes.findByIdAndDelete(req.params.dishId)
      .then(
        (resp) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(resp);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

//! dishes/:dishId/comments
dishRouter
  .route("/:dishId/comments")
  .get((req, res, next) => {
    Dishes.findById(req.params.dishId)
      .then(
        (dish) => {
          if (dish != null) {
            res.status = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(dish.comments);
          } else {
            const err = new Error("Dish " + req.params.dishId + "not Found!");
            err.status = 404;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch();
  })
  .post((req, res, next) => {
    Dishes.findById(req.params.dishId)
      .then(
        (dish) => {
          if (dish != null) {
            req.body.author = req.user._id;
            dish.comments.push(req.body);
            dish.save().then(
              (dish) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(dish);
              },
              (err) => next(err)
            );
          } else {
            const err = new Error(`Dish ${req.params.dishId} not found!`);
            err.status = 404;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .put((req, res, next) => {
    res.statusCode = 200;
    res.end(
      `PUT operation is not supported on /dishes/${req.params.dishId}/comments`
    );
  })
  .delete((req, res, next) => {
    Dishes.findById(req.params.dishId)
      .then(
        (dish) => {
          if (dish != null) {
            for (let i = dish.comments.length - 1; i >= 0; i--) {
              dish.comments.id(dish.comments[i]._id).remove();
            }
            dish.save().then(
              (dish) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(dish);
              },
              (err) => next(err)
            );
          } else {
            const err = new Error(`Dish ${req.params.dishId} not found!`);
            err.status = 404;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

//! dishes/:dishId/comments/:commentId

dishRouter
  .route("/:dishId/comments/:commentId")
  .get((req, res, next) => {
    Dishes.findById(req.params.dishId)
      .then(
        (dish) => {
          if (dish != null && dish.comments.id(req.params.commentId) != null) {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(dish.comments.id(req.params.commentId));
          } else if (dish === null) {
            err = new Error(`Dish ${req.params.dishId} not found!`);
            err.status = 404;
            return next(err);
          } else {
            err = new Error(`Comment ${req.params.commentId} not found!`);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post((req, res, next) => {
    res.statusCode = 403;
    res.end(
      `POST operation not supported on /dishes/${req.params.dishId}/comments/${req.params.commentId}`
    );
  })
  .put((req, res, next) => {
    Dishes.findById(req.params.dishId)
      .then(
        (dish) => {
          if (
            dish != null &&
            dish.comments.id(req.params.commentId) != null &&
            dish.comments.id(req.params.commentId).author.equals(req.user._id)
          ) {
            if (req.body.rating) {
              dish.comments.id(req.params.commentId).rating = req.body.rating;
            }
            if (req.body.author) {
              dish.comments.id(req.params.commentId).author = req.body.author;
            }
            dish.save().then(
              (dish) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(dish);
              },
              (err) => next(err)
            );
          } else if (dish == null) {
            err = new Error(`Dish ${req.params.dishId} not found`);
            err.status = 404;
            return next(err);
          } else if (dish.comments.id(req.params.commentId) == null) {
            err = new Error(`Comment ${req.params.commentId} not found!`);
            err.status = 404;
            return next(err);
          } else {
            err = new Error(`You are not authorised to update this comment!`);
            err.status = 403;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .delete((req, res, next) => {
    Dishes.findById(req.params.dishId)
      .then(
        (dish) => {
          if (
            dish != null &&
            dish.comments.id(req.params.commentId) != null &&
            dish.comments.id(req.params.commentId).author.equals(req.user._id)
          ) {
            dish.comments.id(req.params.commentId).remove();
            dish.save().then(
              (dish) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                return next(err);
              },
              (err) => next(err)
            );
          } else if (dish === null) {
            err = new Errpr(`Dish ${req.params.dishId} not Found!`);
            err.status = 404;
            return next(err);
          } else if (dish.comments.id(req.params.commentId) === null) {
            err = new Error(`Comment ${req.params.commentId} not found!`);
            err.status = 404;
            return next(err);
          } else {
            err = new Error(`You are not authorised to delete this comment `);
            err.status = 403;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

module.exports = dishRouter;
