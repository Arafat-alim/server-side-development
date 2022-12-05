const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//! Comment Schema
const commentSchema = new Schema(
  {
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
    author: {
      // type: String,
      // required: true,
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

//! Dish Schema
const dishSchema = new Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },
    comments: [commentSchema], //! subdocument in mongoose
  },
  {
    timestamps: true,
  }
);

const Dishes = mongoose.model("Dish", dishSchema);

module.exports = Dishes;
