const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Dishes = require("../models/dishes");

const dishRouter = express.Router();

dishRouter.use(bodyParser.json());

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
        (err) => {
          next(err);
        }
      )
      .catch((err) => next(err));
  })
  .post((req, res, next) => {
    Dishes.create(req.body)
      .then(
        (dish) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(dish);
        },
        (err) => {
          next(err);
        }
      )
      .catch((err) => next(err));
  })
  .put((req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /dishes");
  })
  .delete((req, res, next) => {
    Dishes.remove({})
      .then(
        (dishes) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(dishes);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

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
    res.statusCode = 403;
    res.end(`PUT operation not supported on /dishes/:${req.params.dishId}`);
  })
  .put((req, res, next) => {
    Dishes.findByIdAndUpdate(
      req.params.dishId,
      { $set: req.body },
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
        (dish) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(dish);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

//!   handling the comment router
dishRouter
  .route("/:dishId/comments")
  .get((req, res, next) => {
    Dishes.findById(req.params.dishId).then((dish) => {
      if (dish != null) {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(dish.comments);
      } else {
        err = new Error(`Dish ${req.params.dishId} not found`);
        err.status = 404;
        return next(err);
      }
    });
  })
  .post((req, res, next) => {
    Dishes.findById(req.parama.dishId)
      .then(
        (dish) => {
          if (dish != null) {
            dish.comments.push(req.body);
            dish.save().then((dish) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(dish);
            });
          } else {
            err = new Error(`Dish ${req.params.dishId} is not found`);
            err.status = 404;
            return next(err);
          }
        },
        (err) => {
          next(err);
        }
      )
      .catch((err) => next(err));
  })
  .put((req, res, next) => {
    res.statusCode = 403;
    res.end(
      `PUT operation is not supported on /dishes/${req.params.dishId}/comments`
    );
  })
  .delete((req, res, next) => {
    Dishes.findById(req.params.dishId).then((dish) => {
      if (dish != null) {
        //! deleting all the comments
        for (let i = dish.comments.length - 1; i >= 0; i--) {
          dish.comments.id(dish.comments[i]._id).remove();
        }
        dish
          .save()
          .then(
            (dish) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(dish);
            },
            (err) => next(err)
          )
          .catch((err) => next(err));
      } else {
        err = new Error(`Dish ${req.params.dishId} not found`);
        err.status = 404;
        return next(err);
      }
    });
  });

dishRouter
  .route("/:dishId/comments/:commentId")
  .get((req, res, next) => {
    Dishes.findById(req.params.dishId)
      .then(
        (dish) => {
          //! Check three condition
          if (dish != null && dish.comments.id(req.params.commentId) !== null) {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(dish.comments.id(req.params.commentId));
          } else if (dish != null) {
            err = new Error(`Dish id: ${req.params.dishId} not found`);
            err.status = 404;
            return next(err);
          } else {
            err = new Error(`Comment Id: ${req.params.commentId}  not Found`);
            err.status = 404;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post((req, res, next) => {
    res.sendStatus = 403;
    res.end(
      `POST operaion is not supported on /dishes/${req.params.dishId}/comments/${req.params.commentId}`
    );
  })
  .put((req, res, next) => {
    Dishes.findById(req.params.dishId)
      .then(
        (dish) => {
          if (dish != null && dish.comments.id(req.params.commentId) != null) {
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
          } else if (dish === null) {
            err = new Error(`Dish id : ${req.params.dishId} not found`);
            err.status = 404;
            return next(err);
          } else {
            err = new Error(`Comment Id: ${req.params.commentId} not found`);
            err.status = 404;
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
          if (dish != null && dish.comments.id(req.params.commentId)) {
            dish.comments.id(req.params.commentId).remove();
            dish.save().then((dish) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(dish);
            });
          } else if (dish === null) {
            err = new Error(`Dish id: ${req.params.dishId} not found `);
            err.status = 404;
            return next(err);
          } else {
            err = new Error(`Comment Id: ${req.params.commentId} not found`);
            err.status = 200;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

module.exports = dishRouter;
