const http = require("http");
const url = require("url");

let userId = 1;
const users = [];

http
  .createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const query = parsedUrl.query;
    const path = parsedUrl.pathname;

    console.log("Method of req:", req.method);

    if (path === "/add-user/") {
      const name = query.name;
      const user = {
        id: userId,
        name: name,
      };

      if (name === '""' || name === "") {
        res.writeHead(400, { "Content-Type": "text/plain" });
        res.write("400 bad request");
        res.end();
      } else {
        users.push(user);
        userId++;
        console.log("Path", path);
      }
      console.log(users);
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.write("OK");
      res.end();
    }
    if (path === "/get-user/") {
      const id = query.id;
      console.log("id:", id);

      console.log("Method of req:", req.method);

      const getUser = users.find((elem) => elem.id == id);
      console.log("Type:", typeof getUser);
      console.log(getUser);

      if (getUser) {
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.write(JSON.stringify(getUser));
        res.end();
      } else {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("404 not found");
      }
    }
    if (path === "/update-user/") {
      const id = query.id;
      console.log("id:", id);

      const name = query.name;
      console.log("Name:", name);

      const getUser = users.find((elem) => elem.id == id);
      console.log(getUser);

      console.log("Method of req:", req.method);

      console.log(users);
      if (!getUser) {
        console.log("404 not found");
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.write("404 not found");
        res.end();
      } else if (name === '""' || name === "") {
        console.log("400 bad request");
        res.writeHead(400, { "Content-Type": "text/plain" });
        res.write("400 bad request");
        res.end();
      } else {
        const name = query.name;
        getUser.name = name;
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.write(JSON.stringify(getUser));
        res.write(" OK");
        res.end();
      }
    }
    if (path === "/delete-user/") {
      const id = query.id;
      console.log("id:", id);

      const getUser = users.findIndex((elem) => elem.id == id);
      console.log("Get user:", getUser);

      const removeUser = users.splice(getUser, 1);
      console.log("Length:", removeUser.length);
      console.log("Removed elem:", removeUser);

      console.log("Method of req:", req.method);

      if (getUser === -1 && removeUser.length === 0) {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.write("404 not found");
        res.end();
      } else {
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.write(JSON.stringify(removeUser));
        res.write(" OK");
        res.end();
      }
      console.log(users);
    }
  })
  .listen(3000, () => {
    console.log("Server is now listening on port http://localhost:3000");
  });
