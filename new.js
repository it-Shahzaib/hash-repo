const express = require("express"); // Import express app
const app = express(); // Instance of express app
const fs = require("fs"); // Import files module

let users = []; // Array
let userId = 1; // Keep track of users

// Read from the userId file
fs.readFile("./userId.js", "utf8", (err, data) => {
  if (err) {
    console.error(err);
  }
  userId = parseInt(data) || 1;
  console.log("ID:", userId);

  startServer();
});

// Read from the users file
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

// Function to handle all type of requests
function startServer() {
  app.use(express.json()); // Parse incoming requests body

  // Middleware to log request details
  app.use((req, res, next) => {
    console.log("Incoming request");
    console.log("Request:", req.method);
    console.log("Path:", req.path);
    next();
  });

  // Handle all post requests
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

  // Handle all get requests
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

  // Handle all put requests
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

  // Handle all delete requests
  app.delete("/delete/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const getUser = users.find((user) => user.id === id);
    console.log("User:", getUser);

    const getUserIndex = users.findIndex((user) => user.id === id);

    if (getUserIndex === -1) {
      res.status(404).send("404 not found");
    } else {
      users.splice(getUserIndex, 1);

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

  // If no route matches the path
  app.use((req, res, next) => {
    res.status(404).send("Not found");
  });

  // Handle errors that can occur in the cycle
  app.use((err, req, res, next) => {
    const status = err.status;
    console.log("Status:", status);
    res.status(status || 500).send(err.message);
  });

  const port = 3000;
  app.listen(port, () => {
    console.log(`Server is now listening on port http://localhost:${port}`);
  });
}
