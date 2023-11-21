const express = require("express");
const app = express();
const fs = require("fs");

let users = []; // Array
let userId = 1; // Keep track of users

fs.readFile("./userId.js", "utf8", (err, data) => {
  if (err) {
    console.error(err);
  }
  userId = parseInt(data) || 1;
  console.log("ID:", userId);

  startServer();
});

fs.readFile("./users.js", "utf8", (err, data) => {
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

function startServer() {
  app.use(express.json());

  app.use((req, res, next) => {
    console.log("Incoming request");
    console.log("Request:", req.method);
    console.log("Path:", req.path);
    next();
  });

  app.post("/post", (req, res, next) => {
    const user = req.body;

    try {
      if (Object.keys(user).length === 0) {
        throw { status: 400, message: "Bad request" };
      } else {
        user.id = userId;
        users.push(user);
        userId++;
        fs.writeFile("./userId.js", JSON.stringify(userId), (err) => {
          if (err) {
            console.error(err);
          }
        });

        fs.writeFile("./users.js", JSON.stringify(users), (err) => {
          if (err) {
            console.error(err);
            res.status(500).send("Internal server error");
          } else {
            console.log("Users:", users);
            res.status(200).send("OK");
          }
        });
      }
    } catch (error) {
      next(error);
    }
  });

  app.get("/get/:id", (req, res) => {
    const id = parseInt(req.params.id);
    console.log(typeof id);

    const getUser = users.find((user) => user.id === id);

    if (!getUser) {
      res.status(404).send("404 not found");
    } else {
      console.log("User:", getUser);
      console.log(typeof getUser);
      res.status(200).send(getUser);
    }
  });

  app.put("/put/:id", (req, res, next) => {
    const user = req.body;
    const id = parseInt(req.params.id);
    const getUserIndex = users.findIndex((user) => user.id === id);
    console.log("Index:", getUserIndex);
    if (getUserIndex === -1) {
      res.status(404).send("404 not found");
    }

    try {
      if (Object.keys(user).length === 0) {
        throw { status: 400, message: "Bad request" };
      } else {
        user.id = id;
        users[getUserIndex] = user;

        fs.writeFile("./users.js", JSON.stringify(users), (err) => {
          if (err) {
            console.error(err);
            res.status(500).send("Internal server error");
          } else {
            res.status(200).send("OK");
          }
        });
      }
    } catch (error) {
      next(error);
    }
  });

  app.delete("/delete/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const getUser = users.find((user) => user.id === id);
    console.log("User:", getUser);

    const getUserIndex = users.findIndex((user) => user.id === id);

    if (getUserIndex === -1) {
      res.status(404).send("404 not found");
    } else {
      users.splice(getUserIndex, 1);
      userId--;
      fs.writeFile("./users.js", JSON.stringify(users), (err) => {
        if (err) {
          console.error(err);
          res.status(500).send("Internal server error");
        } else {
          res.status(200).send("OK");
        }
      });
    }
  });

  app.use((err, req, res, next) => {
    const status = err.status;
    console.log("Status:", status);
    res
      .status(status || 500)
      .send("Something went wrong! Please try again later");
  });

  const port = 3000;
  app.listen(port, () => {
    console.log(`Server is now listening on port http://localhost:${port}`);
  });
}
