const express = require("express");
const app = express();
const fs = require("fs");

let users = [];

app.use(express.json());

fs.readFile("./users.js", "utf8", (err, data) => {
  if (err) {
    console.error(err);
  } else {
    if (data !== "") {
      users = JSON.parse(data);
      console.log("Users:", users);
    } else {
      users = [];
      console.log("File is empty.");
    }
  }
});

app.use((req, res, next) => {
  console.log("Req:", req.method);
  console.log("Path:", req.path);
  next();
});

app.use("/signup", (req, res, next) => {
  const { username, password } = req.body;

  if (users.some((user) => user.username === username)) {
    res.status(400).send("Username already exists.");
  } else {
    next();
  }
});

app.post("/signup", (req, res) => {
  const { username, password } = req.body;

  let value = "";

  for (let i = 0; i < password.length; i += 2) {
    if (i + 1 < password.length) {
      value += password[i + 1] + password[i];
    } else {
      value += password[i];
    }
  }

  let result = "";

  for (let i = 0; i < value.length; i++) {
    result += value.charAt(i);
    result += i + 1;
  }

  users.push({ username, password: result });

  fs.writeFile("./users.js", JSON.stringify(users), (err) => {
    if (err) {
      console.error(err);
    }
  });

  res.status(201).send("User added successfully");
  console.log(users);
});

app.post("/signin", (req, res) => {
  const { username, password } = req.body;

  const findUser = users.find((user) => user.username === username);
  console.log(findUser);

  if (findUser) {
    let value = "";

    for (let i = 0; i < password.length; i += 2) {
      if (i + 1 < password.length) {
        value += password[i + 1] + password[i];
      } else {
        value += password[i];
      }
    }

    let result = "";

    for (let i = 0; i < value.length; i++) {
      result += value.charAt(i);
      result += i + 1;
    }

    console.log(findUser.password);

    if (result === findUser.password) {
      res.status(200).send("OK");
    } else {
      res.status(400).send("Invalid password!");
    }
  } else {
    res.status(404).send("Username does not exist");
  }
});

app.listen(3000, () => {
  console.log("Server is now listening on port http://localhost:3000");
});
