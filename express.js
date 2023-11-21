const express = require("express");
const app = express();

// Custom error handling middleware

// route handler with intentional error
app.get("/example", (req, res, next) => {
  try {
    console.log("Code is working.");
    // Simulating an error for demonstration purposes
    throw { status: 404, message: "Not found" };
  } catch (error) {
    // Pass the error to Express for centralized handling
    next(error);
  }
});

app.use((err, req, res, next) => {
  console.error("Status:", err.status); // Use 500 as the default status

  // Send a user-friendly error response
  res.status(err.status).send("Something went wrong! Please try again later");
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
