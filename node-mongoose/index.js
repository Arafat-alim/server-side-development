const mongoose = require("mongoose");
const Dishes = require("./models/dishes");

const url = "mongodb://127.0.0.1:27017/conFusion";

const connect = mongoose.connect(url);

connect.then((db) => {
  console.log("Mongoose Database server connected Successfully");

  //! created a dish
  Dishes.create({
    name: "Biryani",
    description: "You will Loving It",
  })
    .then((dish) => {
      console.log("Saved Dish", dish);

      // ! finding the dishes
      return Dishes.find({}).exec();
    }) //! deleting the entire dishes
    .then((dishes) => {
      console.log(dishes);
      return Dishes.remove({});
    }) //! close the connection
    .then(() => {
      return mongoose.connection.close();
    }) //! catch any error any found
    .catch((err) => console.log("Error Message ", err));
});
