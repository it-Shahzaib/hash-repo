const express = require("express");
const crypto = require("crypto");
const fs = require("fs");

const app = express(); // Instance of express
const port = 3000;

let users = [];

// Read data from file and assign it to users array
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

// Middleware to parse JSON body
app.use(express.json());

// Middleware to check if the user already exists or not
app.use("/signup", (req, res, next) => {
  const { username, password } = req.body;

  if (users.some((user) => user.username === username)) {
    res.status(400).send("Username already exists!");
  } else {
    next();
  }
});

// Requests for signup
app.post("/signup", (req, res) => {
  const { username, password } = req.body;

  console.log("Username:", username);
  console.log("Password:", password);

  const salt = crypto.randomBytes(16).toString("hex");

  const hashedPassword = crypto
    .createHash("sha512")
    .update(password + salt)
    .digest("hex");

  users.push({ username, hashedPassword, salt });
  console.log(users);

  fs.writeFile("./users.js", JSON.stringify(users), (err) => {
    if (err) {
      console.error(err);
    }
  });

  res.status(201).send("User registered successfully");
});

// Request for signin
app.post("/signin", (req, res) => {
  const { username, password } = req.body;

  const findUser = users.find((user) => user.username === username);
  console.log(findUser);
  console.log(typeof findUser);

  if (findUser) {
    const hashedPassword = crypto
      .createHash("sha512")
      .update(password + findUser.salt)
      .digest("hex");

    if (hashedPassword === findUser.hashedPassword) {
      res.status(200).send("OK");
    } else {
      res.status(400).send("Invalid password");
    }
  } else {
    res.status(404).send("Username does not exist");
  }
});

app.listen(port, () => {
  console.log(`Server is now listening on port http://localhost:${port}`);
});
