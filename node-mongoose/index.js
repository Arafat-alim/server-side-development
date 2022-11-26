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

      // ! finding the dish by id and update it
      return Dishes.findByIdAndUpdate(
        dish._id,
        {
          $set: { description: "Updated the Description" },
        },
        { new: true }
      ).exec();
    })
    .then((dish) => {
      console.log(dish);
      //! adding comment
      dish.comments.push({
        rating: 5,
        comment: "This is totally awfull",
        author: "Arafat Alim",
      });

      return dish.save();
    })
    //! removing all the dishes from the database
    .then((dish) => {
      console.log("Comments added Dish", dish);
      return Dishes.remove({});
    })

    //! close the connection
    .then(() => {
      return mongoose.connection.close();
    }) //! catch any error any found
    .catch((err) => console.log("Error Message ", err));
});
