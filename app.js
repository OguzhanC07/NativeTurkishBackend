const express = require("express");
const morgan = require("morgan");

const app = express();

//development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//body parsing
app.use(express.json());

//Routes

app.all("*", (req, res, next) => {
  res.send("Test");
});

// app.use(/*call error handler*/);

module.exports = app;
