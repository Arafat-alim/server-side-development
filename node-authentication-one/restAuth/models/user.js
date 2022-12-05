const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const User = new Schema({
  // username: {
  //   type: String,
  //   unique: true,
  //   required: true,
  // },
  // password: {
  //   type: String,
  //   required: true,
  // },
  //1 user name and password added by the passport-local-mongoose
  firstName: {
    type: String,
    default: "",
  },

  username: {
    type: String,
    default: "",
  },

  admin: {
    type: Boolean,
    default: false,
  },
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", User);
