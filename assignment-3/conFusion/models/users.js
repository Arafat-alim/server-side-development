const mongoose = require("mongoose");
const Schema = mongoose.Schema;
//! Adding plugin
const pasportLocalMongoose = require("passport-local-mongoose");

const User = new Schema({
  firstname: {
    type: String,
    default: "",
  },
  lastname: {
    type: String,
    defaullt: "",
  },
  admin: {
    type: Boolean,
    default: false,
  },
});

User.plugin(pasportLocalMongoose);

module.exports = mongoose.model("User", User);
