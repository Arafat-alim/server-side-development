const http = require("http");
const path = require("path");
const fs = require("fs");
const hostname = "localhost";
const port = 3000;

const server = http.createServer((req, res) => {
  //! Req header is coming from the client side
  //   console.log(req.headers);
  console.log("Request for " + req.url + " by method " + req.method);

  if (req.method == "GET") {
    var fileUrl;
    if (req.url == "/") fileUrl = "/index.html";
    else fileUrl = req.url;

    var filePath = path.resolve("./public" + fileUrl); // full path of the file
    //! want to make sure the extension
    const fileExt = path.extname(filePath);
    if (fileExt == ".html") {
      fs.exists(filePath, (exists) => {
        if (!exists) {
          res.statusCode = 404;
          res.setHeader("Content-Type", "text/html");
          res.end(
            "<html><body><h1>Error: 404 " +
              fileUrl +
              " is not found</h1></body>"
          );
          return;
        } else {
          res.statusCode = 200;
          res.setHeader("Content-Type", "text/html");
          fs.createReadStream(filePath).pipe(res);
        }
      });
    } else {
      res.statusCode = 404;
      res.setHeader("Content-Type", "text/html");
      res.end(
        "<html><body><h1>Error: 404 " + fileUrl + " is not HTML</h1></body>"
      );
    }
  } else {
    res.statusCode = 404;
    res.setHeader("Content-Type", "text/html");
    res.end(
      "<html><body><h1>Error: 404 " +
        req.method +
        " is not supported</h1></body>"
    );
  }
  //   //! Res - Sending the data to the client
  //   res.statusCode = 200;
  //   res.setHeader("Content-type", "text/html");
  //   res.end("<html><body><h1>Hello, World</h1></body></html>");
});

server.listen(port, hostname, () => {
  console.log(`Server is running at http://${hostname}:${port}`);
});
