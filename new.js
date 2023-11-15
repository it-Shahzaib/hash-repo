const http = require("http");
const fs = require("fs");

const server = http.createServer((req, res) => {
  if (req.method === "POST" && req.url === "/post") {
    let body = "";

    req.on("data", (data) => {
      body += data.toString();
    });

    req.on("end", () => {
      try {
        let parsedBody = JSON.parse(body);
        fs.appendFile("./app.js", JSON.stringify(parsedBody), (err) => {
          if (err) {
            console.error(err);
            res.writeHead(500, { "Content-Type": "text/plain" });
            res.end("Internal Server Error");
          }
          res.writeHead(200, { "Content-Type": "text/plain" });
          res.end("OK");
        });
      } catch {
        console.log("Invalid JSON format");
        res.writeHead(400, { "Content-Type": "text/plain" });
        res.end("400 bad request");
      }
    });
  } else if (req.method === "GET" && req.url === "/get") {
    fs.readFile("./app.js", (err, data) => {
      try {
        if (!err) {
          res.writeHead(200, { "Content-Type": "text/plain" });
          res.write(data.toString());
          res.end(" OK");
        }
      } catch (error) {
        console.log(error);
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.write("404 not found");
        res.end();
      }
    });
  } else if (req.method === "PUT" && req.url === "/put") {
    let body = "";

    req.on("data", (data) => {
      body += data.toString();
    });

    req.on("end", () => {
      let parsedBody = JSON.parse(body);
      try {
        fs.writeFile("./app.js", JSON.stringify(parsedBody), (err) => {
          if (!err) {
            console.log("Updated");
            console.log(JSON.stringify(parsedBody));
            res.writeHead(200, { "Content-Type": "text/plain" });
            res.end("OK");
          }
        });
      } catch (error) {
        console.error(error);
        res.writeHead(400, { "Content-Type": "text/plain" });
        res.end("400 bad request");
      }
    });
  } else {
    console.log("Invalid url");
    res.writeHead(400, { "Content-Type": "text/plain" });
    res.end("400 bad request");
  }
});
server.listen(3000, () => {
  console.log("Server is listening on port http://localhost:3000");
});
