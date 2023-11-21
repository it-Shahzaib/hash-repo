const express = require("express");
const app = express();
const fs = require("fs");
// app.use(express.json());

// const loggerMiddleWare = (req, res, next) => {
//   console.log("Path:", req.path);
//   console.log("Req:", req.method);
//   next();
// };

// const checkMiddleWare = (req, res, next) => {
//   const body = req.body;
//   if (body.name !== "Ali") {
//     res.status(400).send("400 bad request");
//   } else {
//     next();
//   }
// };

// app.use(loggerMiddleWare);

// app.post("/user", checkMiddleWare, (req, res) => {
//   const body = req.body;
//   const name = body.name;
//   res.send(`Hello ${name}`);
// });

app.get("/", (req, res, next) => {
  fs.readFile("userId.js", (err, data) => {
    if (err) {
      next(err); // Pass errors to Express.
    } else {
      res.send(data);
    }
  });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server is now listening on port http://localhost:${port}`);
});
