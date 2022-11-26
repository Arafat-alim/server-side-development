const mongoose = require("mongoose");
const Currency = require("mongoose-currency").loadType(mongoose);

const Schema = mongoose.Schema;

//! creating commnt schema
const commentSchema = new Schema(
  {
    rating: {
      type: String,
      min: 0,
      max: 5,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

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
    image: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      default: "",
    },
    price: {
      type: Currency,
      required: true,
      min: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    comments: [commentSchema],
  },
  {
    timestamps: true,
  }
);

//! Creating model
const Dishes = mongoose.model("Dish", dishSchema);

module.exports = Dishes;
