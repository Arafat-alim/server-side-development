const express = require("express");
const http = require("http");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
//! Importing router
const dishRouter = require("./routes/dishRouter");

const hostname = "localhost";
const port = 3000;

//! Middleware
app.use(morgan("dev"));
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());
app.use("/dishes", dishRouter); //! added new codes

// app.all("/dishes", (req, res, next) => {
//   res.stateCode = 200;
//   res.setHeader("Content-Type", "text/plain");
//   next();
// });
// app.get("/dishes", (req, res, next) => {
//   res.end("Will send all the dishes to you!");
// });
// app.post("/dishes", (req, res, next) => {
//   res.end(
//     "WIll add the dish: " + req.body.name + " with details: " + req.body.details
//   );
// });

// app.put("/dishes", (req, res, next) => {
//   res.statusCode = 403;
//   res.end("PUT operation is not supported on /dishes");
// });

// app.delete("/dishes", (req, res, next) => {
//   res.end("Delete all the dishes");
// });
// app.get("/dishes/:dishid", (req, res, next) => {
//   res.end("Will send the details of dish: " + req.params.dishid + " to you");
// });
// app.post("/dishes/:dishid", (req, res, next) => {
//   res.StatusCode = 403;
//   res.end("POST operation is not supported! on /dishes");
// });

// app.put("/dishes/:dishid", (req, res, next) => {
//   res.write("Updating the dish: " + req.params.dishid);
//   res.end(
//     "Will update the dish: " +
//       req.body.name +
//       "\n" +
//       " with details: " +
//       req.body.details
//   );
// });

// app.delete("/dishes/:dishId", (req, res, next) => {
//   res.end("Deleting dish: " + req.params.dishId);
// });

app.use((req, res, next) => {
  // console.log(req.headers);
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/html");
  res.end("<html><body><h1>This is an express Server</h1></body></html>");
});

//! creating a server
const server = http.createServer(app);

server.listen(port, hostname, () => {
  console.log(`Server is running at http://${hostname}:${port}`);
});
