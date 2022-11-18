const http = require("http");
const hostname = "localhost";
const port = 3000;

const server = http.createServer((req, res) => {
  //! Req header is coming from the client side
  console.log(req.headers);

  //! Res - Sending the data to the client
  res.statusCode = 200;
  res.setHeader("Content-type", "text/html");
  res.end("<html><body><h1>Hello, World</h1></body></html>");
});

server.listen(port, hostname, () => {
  console.log(`Server is running at http://${hostname}:${port}`);
});
