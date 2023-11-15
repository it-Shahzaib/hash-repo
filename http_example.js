// var http = require("http");
var url = require("url");
// var fs = require("fs");

// http
//   .createServer(function (req, res) {
//     var q = url.parse(req.url, true);
//     var filename = "." + q.pathname;

//     fs.readFile(filename, function (err, data) {
//       if (err) {
//         res.writeHead(404, { "Content-Type": "text/html" });
//         return res.end("404 Not Found");
//       }
//       res.writeHead(200, { "Content-Type": "text/html" });
//       res.write(data);
//       return res.end(" Successfully sended");
//     });
//   })
//   .listen(8080);

// const url = require("url");
// const myURL = url.format({
//   protocol: "https",
//   hostname: "www.example.com",
//   pathname: "/products",
//   query: { id: 123 },
// });
// console.log(myURL); // Outputs 'https://www.example.com/products?id=123'

var adr = "http://localhost:8080/default.htm?year=2017&month=february";

var q = url.parse(adr, true);
console.log("Pathname prop:", q.query);
