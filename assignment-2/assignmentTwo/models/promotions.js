const mongoose = require("mongoose");
const Currency = require("mongoose-currency").loadType(mongoose);
const Schema = mongoose.Schema;

const promoSchema = new Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      default: "",
    },
    price: {
      type: Currency,
      min: 0,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

//! creating a model
const Promos = mongoose.model("Promo", promoSchema);

module.exports = Promos;
