const http = require("http");
const fs = require("fs");
const url = require("url");

let users = []; // Array
let userId = 1; // Keep track of users

fs.readFile("./userId.js", "utf8", (err, data) => {
  if (err) {
    console.error(err);
  }
  userId = parseInt(data) || 1;
  console.log("ID:", userId);
});

fs.readFile("./app.js", "utf8", (err, data) => {
  if (err) {
    console.error(err);
  } else {
    if (data !== "") {
      users = JSON.parse(data);
      console.log("Users:", users);
    } else {
      users = [];
    }
  }
});

const server = http.createServer((req, res) => {
  if (req.method === "POST" && req.url === "/post") {
    let body = "";
    const parsedUrl = url.parse(req.url, true);

    req.on("data", (data) => {
      body += data.toString();
    });

    req.on("end", () => {
      try {
        const user = JSON.parse(body);
        user.id = userId;
        userId++;

        fs.writeFile("./userId.js", userId.toString(), (err) => {
          if (err) {
            console.error(err);
          }
        });
        users.push(user);

        console.log("Path:", parsedUrl.pathname);

        fs.writeFile("./app.js", JSON.stringify(users), (err) => {
          if (err) {
            console.error(err);
            res.writeHead(500, { "Content-Type": "text/plain" });
            res.end("Internal Server Error");
          } else {
            console.log(user);
            console.log("Count:", userId);
            res.writeHead(200, { "Content-Type": "text/plain" });
            res.end("OK");
          }
        });
      } catch (error) {
        console.log("Invalid JSON format");
        res.writeHead(400, { "Content-Type": "text/plain" });
        res.end("400 bad request");
      }
    });
  } else if (req.method === "GET" && req.url.startsWith("/get")) {
    const parsedUrl = url.parse(req.url, true);
    const query = parsedUrl.query;
    const id = query.id;

    const getUser = users.find((elem) => elem.id == id);

    console.log("Path:", parsedUrl.pathname);
    if (getUser) {
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.write(JSON.stringify(getUser));
      res.end(" OK");
    } else {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("404 not found");
    }
  } else if (req.method === "PUT" && req.url.startsWith("/put")) {
    let body = "";
    const parsedUrl = url.parse(req.url, true);

    req.on("data", (data) => {
      body += data.toString();
    });

    req.on("end", () => {
      const query = parsedUrl.query;
      const id = query.id;

      const requestBody = JSON.parse(body);
      const name = requestBody.name;

      const getUserIndex = users.findIndex((elem) => elem.id == id);

      console.log("Path:", parsedUrl.pathname);

      if (getUserIndex !== -1) {
        users[getUserIndex].name = name;
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("404 not found");
      }

      fs.writeFile("./app.js", JSON.stringify(users), (err) => {
        if (err) {
          console.error(err);
          res.writeHead(500, { "Content-Type": "text/plain" });
          res.end("Internal Server Error");
        } else {
          console.log(users);
          res.writeHead(200, { "Content-Type": "text/plain" });
          res.end("OK");
        }
      });
    });
  } else if (req.method === "DELETE" && req.url.startsWith("/delete")) {
    const parsedUrl = url.parse(req.url, true);
    const query = parsedUrl.query;
    const id = query.id;

    const getUser = users.find((elem) => elem.id == id);
    const getUserIndex = users.findIndex((elem) => elem.id == id);

    console.log("Path:", parsedUrl.pathname);

    if (getUserIndex !== -1) {
      users.splice(getUserIndex, 1);
    } else {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("404 not found");
    }

    fs.writeFile("./app.js", JSON.stringify(users), (err) => {
      if (err) {
        console.error(err);
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Internal server error");
      } else {
        console.log(users);
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.write(JSON.stringify(getUser));
        res.end(" OK");
      }
    });
  } else {
    const parsedUrl = url.parse(req.url, true);
    console.log("Path:", parsedUrl.pathname);
    console.log("Invalid url");

    res.writeHead(400, { "Content-Type": "text/plain" });
    res.end("400 bad request");
  }
});

server.listen(3000, () => {
  console.log("Server is listening on port http://localhost:3000");
});
