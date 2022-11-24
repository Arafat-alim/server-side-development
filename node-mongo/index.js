const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");
const dboper = require("./operations");

const url = "mongodb://127.0.0.1:27017";
const dbname = "conFusion";

//Connect with the mongodb server
MongoClient.connect(url, (err, client) => {
  assert.equal(err, null);
  console.log("Connected to the mongodb server successfully");

  //selecting the database
  const db = client.db(dbname);

  //selecting the collection from the db
  // const collection = db.collection("dishes");

  dboper.insertDocument(
    db,
    { name: "Vadonut", description: "Test" },
    "dishes",
    (result) => {
      console.log("Insert Document:\n", result.ops);

      dboper.findDocuments(db, "dishes", (docs) => {
        console.log("Found Documents:\n", docs);

        dboper.updateDocument(
          db,
          { name: "Vadonut" },
          { description: "Updated Test" },
          "dishes",
          (result) => {
            console.log("Updated Document:\n", result.result);

            dboper.findDocuments(db, "dishes", (docs) => {
              console.log("Found Updated Documents:\n", docs);

              db.dropCollection("dishes", (result) => {
                console.log("Dropped Collection: ", result);

                client.close();
              });
            });
          }
        );
      });
    }
  );
  // //Inserting the single docs in to the colleciton
  // collection.insertOne(
  //   { name: "Murghmussalam", description: "testing1" },
  //   (err, result) => {
  //     assert.equal(err, null);

  //     console.log("After insert: \n");
  //     console.log(result.ops); //displaying the inserted docs
  //     //ops --> tells us how many operation is performed till now

  //     //Finding the doc from the collection - READ operation
  //     //! toArray() method convert the object into an array

  //     collection.find({}).toArray((err, docs) => {
  //       assert.equal(err, null);

  //       //print the array
  //       console.log("Found: \n");
  //       console.log(docs);

  //       //Now Delete the collection from the database
  //       db.dropCollection("dishes", (err, result) => {
  //         assert.equal(err, null);

  //         client.close(); //close the connection
  //       });
  //     });
  //   }
  // );
});
